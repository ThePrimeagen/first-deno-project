export type ProductId = "ETH-USD";

export type WsBaseEvent = {
    type: string;
};

export type Price = number;
export type Volume = number;
export type L2EventPriceTuple = [Price, Volume];

export type SnapshotEvent = WsBaseEvent & {
    type: "snapshot";
    product_id: ProductId;
    asks: L2EventPriceTuple[];
    bids: L2EventPriceTuple[];
};

export type Level2Event = WsBaseEvent & {
    type: "level2";
    product_id: ProductId;
    changes: L2EventPriceTuple[];
};

export type TickerEvent = WsBaseEvent & {
    type: "ticker";
    trade_id: number;
    sequence: number;
    time: string;
    product_id: "ETH-USD";
    price: string;
    side: "buy" | "sell";
    last_size: number;
    best_bid: number;
    best_ask: number;
};

export type WsEvent = TickerEvent | Level2Event | SnapshotEvent;

export type Listener = (currencyPair: string, price: PriceInfo, prices: PriceMap) => void;

export type PriceInfo = {
    buy: number;
    sell: number;
    price: number;
};

export type PriceMap = {
    [key: string]: PriceInfo;
}

export type TradeResult = {
    success: boolean;
    orderId: string;
}

export interface Exchange {
    connect(): Promise<void>;
    onPriceChange(cb: Listener): void;
    getPrice(product: ProductId): PriceInfo | undefined;
    addCurrency(currency: ProductId): void;

    // ya ya
    // 48 Hour timeout on new api keys
    buyLimit(currency: string, price: number, volume: number): Promise<TradeResult>;
    sellLimit(currency: string, price: number, volume: number): Promise<TradeResult>;
}

export interface Trader {
    setState(pathToFile: string): Promise<void>;
    connect(): Promise<void>;
}

export type State = {
    [key: string]: number[];
}
