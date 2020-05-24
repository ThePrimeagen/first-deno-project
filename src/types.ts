export type WsEvent = {
    type: string;
};

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

