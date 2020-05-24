import {
    WebSocket,
    connectWebSocket,
    isWebSocketPingEvent,
    isWebSocketPongEvent,
    isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts'

import {
    TickerEvent
} from "./types.ts";

export type Price = {
    buy: number,
    sell: number,
    price: number
};

export type Prices = {
    [key: string]: Price;
}

type Listener = (prices: Prices) => void;

export default class Coinbase {
    private sock?: WebSocket
    private listeners: Listener[];
    private prices: Prices;

    constructor() {
        this.prices = {};
        this.listeners = [];
    }

    public addTicker(ticker: string) {
        if (!this.sock) {
            throw new Error("Hellz yeah, you managed to be bad at programming");
        }

        const channelRequest = {
            "type": "subscribe",
            "channels": [{ "name": "ticker", "product_ids": [ticker] }]
        };

        this.sock.send(JSON.stringify(channelRequest));
    }

    public onPriceChange(listener: Listener) {
        this.listeners.push(listener);
    }

    public async connect() {
        this.sock = await connectWebSocket("wss://ws-feed.pro.coinbase.com/");
        this.listenToSocket();
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
            const tEvent = JSON.parse(message) as TickerEvent;
            const product = tEvent.product_id;
            if (!this.prices[product]) {
                this.prices[product] = { buy: 0, sell: 0, price: 0 };
            }

            const item = this.prices[product];
            item.price = +tEvent.price;
            item.buy = +tEvent.best_bid;
            item.sell = +tEvent.best_ask;

            this.listeners.forEach(cb => cb(item, this.prices));
        }
    }
}

