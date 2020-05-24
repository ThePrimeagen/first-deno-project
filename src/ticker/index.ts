import {
    WebSocketEvent,
    connectWebSocket,
    isWebSocketPingEvent,
    isWebSocketPongEvent,
    isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts'

export type TickerEvent = {
    type: "ticker",
    trade_id: number,
    sequence: number,
    time: string,
    product_id: "ETH-USD",
    price: string,
    side: "buy" | "sell", // Taker side
    last_size: number,
    best_bid: number,
    best_ask: number,
};

const sock = await connectWebSocket("wss://ws-feed.pro.coinbase.com/");


await sock.send(JSON.stringify(channelRequest));

for await (const msg: WebSocketEvent of sock) {
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

    const obj = JSON.parse(message);
}

Deno.exit(0);

