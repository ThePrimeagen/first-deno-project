import {
    readJson
} from "https://deno.land/std/fs/read_json.ts";

import {
    State,
    StateItem,
    Trader,
    ProductId,
    OpenOrder,
    SellOpenOrder,
    OrderStatus,
    PriceInfo,
    PriceMap,
    Exchange,
} from "./types.ts";

function wait(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

// TODO: How much stock do I want to buy
const MAGIC_NUMBER = 0.01;

function getHighestPrice<T extends OpenOrder>(orders: T[]): T | null {
    if (orders.length === 0) {
        return null;
    }

    let highestPrice: T | null = null;

    for (let i = 0; i < orders.length; ++i) {
        if (!highestPrice || orders[i].price > highestPrice.price) {
            highestPrice = orders[i];
        }
    }

    return highestPrice;
}

function getLowestPrice<T extends OpenOrder>(orders: T[]): T | null {
    if (orders.length === 0) {
        return null;
    }

    let lowestPrice: T | null = null;

    for (let i = 0; i < orders.length; ++i) {
        if (!lowestPrice || orders[i].price < lowestPrice.price) {
            lowestPrice = orders[i];
        }
    }

    return lowestPrice;
}

function round(x: number, precision = 100) {
    return Math.round(x * precision) / precision;
}

async function saveState(s: State, path: string): Promise<void> {
    try {
        console.log("Path", path);
        const file = await Deno.open(path, {
            create: true,
            read: true,
            write: true,
        });

        const state = JSON.stringify(s, null, 4);

        await Deno.writeAll(file, new TextEncoder().encode(state));
    } catch (e) {
        console.error("ERROR : SavingState", e);
    }
}

export class BuyHighSellLow implements Trader {

    private state!: State;
    private lastSavedState!: State;
    private executing: boolean;

    constructor(private exchange: Exchange,
                private products: ProductId[],
                private pathToFile: string,
                private opts = {
                    maxOpenOrders: 5,
                    sellWin: 0.035,
                    orderSpread: 0.0075,
                    check: 30000,
                }) {
        this.executing = false;
    }

    private async resetState(item: StateItem) {
        await Promise.all(
            item.sells.map(s => this.exchange.cancelOrder(s.orderId)).
            concat(item.buys.map(s => this.exchange.cancelOrder(s.orderId))));

        item.sells = [];
        item.buys = [];
    }

    private async updateState() {
        console.log("LOG :: updateState ", JSON.stringify(this.lastSavedState) === JSON.stringify(this.state));
        if (JSON.stringify(this.lastSavedState) === JSON.stringify(this.state)) {
            return;
        }

        await saveState(this.state, this.pathToFile);
        this.lastSavedState = JSON.parse(JSON.stringify(this.state));
        console.log("LOG :: updateState LastState has been updated", JSON.stringify(this.lastSavedState, null, 4));
    }

    private createState(): StateItem {
        return {
            buys: [],
            sells: [],
            completed: [],
        };
    }

    private async init() {
        try {
            this.state = await readJson(this.pathToFile) as State;
        } catch(e) {
            console.error(
                "Got an error trying to get state from",
                e.message, "and will create a new empty state");
        }

        if (!this.state) {
            this.state = {};
            await this.updateState();
        }
        this.products.forEach(p => {
            if (!this.state[p]) {
                this.state[p] = this.createState();
            }
        });

        console.log("Products", this.products, this.state);

    }

    private async buyOrders(currency: string, price: number, item: StateItem) {
        console.log("LOG :: buyOrders ::", item.buys.length, ">=", this.opts.maxOpenOrders);

        const lowestSell = getLowestPrice<SellOpenOrder>(item.sells);
        const highestBuy = getHighestPrice<OpenOrder>(item.buys);
        const lowestBuy = getLowestPrice<OpenOrder>(item.buys);

        console.log("LOG :: buyOrders lowestBuy and Sell ::", lowestBuy, lowestSell);

        const amountDown = 1 - this.opts.orderSpread;
        const amountUp = 1 + this.opts.orderSpread;

        let buyPrice = lowestSell && lowestSell.price || price;
        let movedUp = false;

        if (highestBuy && highestBuy.price * amountUp < price * amountDown) {
            buyPrice = price;
            movedUp = true;
        }

        else if (lowestBuy && buyPrice > lowestBuy.price) {
            buyPrice = lowestBuy.price;
        }

        if (buyPrice > price) {
            buyPrice = price;
        }

        if (!movedUp && item.buys.length >= this.opts.maxOpenOrders) {
            return;
        }

        console.log("LOG :: Starting Buy at ::",
                    buyPrice,
                    highestBuy && highestBuy.price,
                    lowestBuy && lowestBuy.price,
                    price);

        buyPrice = round(buyPrice * amountDown);

        const res = await this.exchange.buyLimit(
            currency,
            buyPrice,
            MAGIC_NUMBER);

        console.log("LOG :: Buying ::", buyPrice, res.orderId);
        if (!res.success) {
            console.error("ERROR :: Buying ::", buyPrice, res.orderId);
        }

        item.buys.push({
            orderId: res.orderId,
            price: buyPrice,
            volume: MAGIC_NUMBER,
        });
    }

    private async checkOpenOrderStatus(currency: string, price: number, item: StateItem) {
        const highestPrice = getHighestPrice<OpenOrder>(item.buys);
        const lowestPrice = getLowestPrice<SellOpenOrder>(item.sells);

        console.log("LOG :: checkOpenOrderStatus", highestPrice, lowestPrice);
        if (highestPrice) {
            const hStatus = await this.exchange.getOrderStatus(highestPrice.orderId);
            console.log("LOG :: checkOpenOrderStatus hStatus", hStatus);

            if (hStatus.status === "done") {
                const buyVolume = +hStatus.size;
                const buyPrice = +hStatus.price;
                const sellPrice = round(buyPrice * (1 + this.opts.sellWin));

                const sellStatus = await this.exchange.sellLimit(
                    currency,
                    sellPrice,
                    buyVolume);

                console.log("LOG :: Buy Complete ::", buyPrice, "->", sellPrice, sellStatus.orderId);

                // Remove from buys
                item.buys.splice(item.buys.indexOf(highestPrice), 1);

                if (!sellStatus.success) {
                    console.error(`ERROR :: Sell Failed :: ${hStatus.price}x${hStatus.size}`);
                    return;
                }

                // Add to sells
                item.sells.push({
                    buyPrice,
                    buyVolume,
                    buyId: highestPrice.orderId,
                    price: sellPrice,
                    volume: buyVolume,
                    orderId: sellStatus.orderId,
                });

            }
        }

        if (lowestPrice) {
            const lStatus = await this.exchange.getOrderStatus(lowestPrice.orderId);
            if (lStatus.status === "done") {
                const sellVolume = +lStatus.size;
                const sellPrice = +lStatus.price;
                item.completed.push({
                    sellId: lStatus.id,
                    sellPrice,
                    sellVolume,

                    buyPrice: lowestPrice.buyPrice,
                    buyVolume: lowestPrice.buyVolume,
                    buyId: lowestPrice.buyId
                });

                item.sells.splice(item.sells.indexOf(lowestPrice), 1);
            }
        }
    }

    public async connect() {
        await this.init();
        await this.exchange.connect();

        for (let i = 0; i < this.products.length; ++i) {
            await this.exchange.addCurrency(this.products[i]);
        }

        const pair = "ETH-USD";
        do {
            try {
                const orderInfo = this.state[pair];
                const info = this.exchange.getPrice(pair);

                if (info) {
                    await this.buyOrders(pair, info.price, orderInfo);
                    await this.checkOpenOrderStatus(pair, info.price, orderInfo);
                }

                console.log("LOG :: about to wait");
                await wait(10000);
                console.log("LOG :: waiting is done");

            } catch(e) {
                console.error("Trader#onPriceChange", e);
            }

            await this.updateState();
        } while(true);
    }
}

