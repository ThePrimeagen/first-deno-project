import { config } from "https://deno.land/x/dotenv/mod.ts";
const c = config();
const API_KEY: string = c["API_KEY"];
const API_SECRET: string = c["API_SECRET"];
const API_PASSPHRASE: string = c["API_PASSPHRASE"];

import { hmac } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";
import { decode } from "https://deno.land/std/encoding/base64.ts";

import {
    WebSocket,
    connectWebSocket,
    isWebSocketPingEvent,
    isWebSocketPongEvent,
    isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts'

import {
    OrderStatus,
    Exchange,
    PriceMap,
    TradeResult,
    ProductId,
    WsEvent,
    Listener,
    PriceInfo,
} from "./types.ts";

const coinBaseUrl = "https://api.pro.coinbase.com";

type RequestArgs = object;

async function makeRequest(path: string, method: "GET" | "POST" | "DELETE", args: RequestArgs): Promise<object> {
    const secret = new Uint8Array(decode(API_SECRET));
    const fullPath = `${coinBaseUrl}${path}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify(args);

    const msg = timestamp + method + path + body;

    // @ts-ignore
    let sign2: string = hmac("sha256", secret, msg, "utf8", "base64");

    sign2 = sign2.
        replace(/-/g, "+").
        replace(/_/g, "/");

    const request = {
        method,
        headers: [
            ["User-Agent", "ThePrimeAgent"],
            ["content-type", "application/json"],
            ["CB-ACCESS-KEY", API_KEY],
            ["CB-ACCESS-TIMESTAMP", String(timestamp)],
            ["CB-ACCESS-PASSPHRASE", API_PASSPHRASE],
            ["CB-ACCESS-SIGN", sign2],
        ],
        body
    };

    const results = await fetch(fullPath, request);
    return await results.json();
}

export class Coinbase implements Exchange {
    private sock?: WebSocket
    private listeners: Listener[];
    private prices: PriceMap;

    constructor() {
        this.prices = {};
        this.listeners = [];
    }

    public getFee() {
        return 0.005;
    }

    public async addCurrency(ticker: ProductId) {
        if (!this.sock) {
            throw new Error("Hellz yeah, you managed to be bad at programming");
        }

        const channelRequest = {
            "type": "subscribe",
            "channels": [{ "name": "ticker", "product_ids": [ticker] }]
        };

        await this.sock.send(JSON.stringify(channelRequest));
    }

    public getOrderStatus(orderId: string): Promise<OrderStatus> {
        return new Promise(async (res, rej) => {
            try {
                const path = `/orders/${orderId}`;
                const status =
                    await makeRequest(path, "GET", {}) as OrderStatus

                if (!status.id) {
                    rej(status);
                    return;
                }

                res(status);
            } catch(e) {
                rej(e);
            }
        });
    }

    public getPrice(product: ProductId): PriceInfo | undefined {
        return this.prices[product];
    }

    public cancelOrder(orderId: string): Promise<TradeResult> {
        return new Promise(async (res, rej) => {
            const out = await makeRequest(`/orders/${orderId}`, "DELETE", {});

            res({
                success: true,
                orderId,
            });
        });
    }

    public onPriceChange(listener: Listener) {
        this.listeners.push(listener);
    }

    public async connect() {
        this.sock = await connectWebSocket("wss://ws-feed.pro.coinbase.com/");
        this.listenToSocket();
    }

    private async order(product_id: string, price: number, size: number, side: "buy" | "sell", type: "limit" | "market"): Promise<TradeResult> {
        return new Promise(async (res, rej) => {
            try {
                const data = {
                    type,
                    side,
                    product_id,
                };

                if (type !== "market") {
                    // @ts-ignore
                    data.price = price;

                    // @ts-ignore
                    data.size = size;
                }

                const results = await makeRequest("/orders", "POST", data) as OrderStatus;

                if (!results.id) {
                    rej(results);
                    return;
                }

                res({
                    success: true,
                    orderId: results.id
                });
            } catch (e) {
                rej({ success: false, });
            }
        });
    }

    public async buyLimit(currency: string, price: number, volume: number): Promise<TradeResult> {
        return this.order(currency, price, volume, "buy", "limit");
    }

    public async sellLimit(currency: string, price: number, volume: number): Promise<TradeResult> {
        return this.order(currency, price, volume, "sell", "limit");
    }

    public async sellMarket(currency: string, price: number, volume: number): Promise<TradeResult> {
        return this.order(currency, price, volume, "sell", "market");
    }

    private async listenToSocket() {
        if (!this.sock) {
            throw new Error("You are actually bad");
        }

        for await (const msg of this.sock) {
            if (isWebSocketCloseEvent(msg)) {
                console.log("The jig is over");
                break;
            }
            if (isWebSocketPingEvent(msg) || isWebSocketPongEvent(msg)) {
                console.log("I got something...", msg);
                continue;
            }

            let message: string;
            if (msg instanceof Uint8Array) {
                message = new TextDecoder().decode(msg);
            } else if (typeof msg === "string") {
                message = msg;
            } else {
                console.log(" I honestly don't know what to do here.", msg);
                continue;
            }

            // TODO: If I listen for any thing else this will literaly explode.
            const tEvent = JSON.parse(message) as WsEvent;

            if (tEvent.type === "ticker") {
                const product = tEvent.product_id;
                if (!this.prices[product]) {
                    this.prices[product] = { buy: 0, sell: 0, price: 0 };
                }

                const item = this.prices[product];
                item.price = +tEvent.price;
                item.buy = +tEvent.best_bid;
                item.sell = +tEvent.best_ask;

                this.listeners.forEach(cb => cb(product, item, this.prices));
            }
        }
    }
}

