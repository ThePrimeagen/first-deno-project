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

export type OrderStatus = {
  id: string,
  price: string,
  size: string,
  product_id: ProductId,
  side: "buy" | "sell",
  type: "limit" | "market",
  time_in_force: string,
  post_only: boolean,
  created_at: string,
  fill_fees: string,
  filled_size: string,
  executed_value: string,
  status: "pending" | "done",
}

export interface Exchange {

    connect(): Promise<void>;
    onPriceChange(cb: Listener): void;
    getPrice(product: ProductId): PriceInfo | undefined;
    addCurrency(currency: ProductId): Promise<void>;
    getFee(): number;
    getOrderStatus(orderId: string): Promise<OrderStatus>

    // ya ya
    // 48 Hour timeout on new api keys
    buyLimit(currency: string, price: number, volume: number): Promise<TradeResult>;
    sellLimit(currency: string, price: number, volume: number): Promise<TradeResult>;
    sellMarket(currency: string, price: number, volume: number): Promise<TradeResult>;
    cancelOrder(orderId: string): Promise<TradeResult>;
}

export interface Trader {
    connect(): Promise<void>;
}

export type OpenOrder = {
    orderId: string;
    price: number;
    volume: number;
}

export type SellOpenOrder = OpenOrder & {
    buyId: string;
    buyPrice: number;
    buyVolume: number;
}

export type CompletedOrder = {
    sellId: string;
    sellPrice: number;
    sellVolume: number;

    buyId: string;
    buyPrice: number;
    buyVolume: number;
}

export type StateItem = {
    completed: CompletedOrder[];
    buys: OpenOrder[];
    sells: SellOpenOrder[];
}

export type State = {
    [key: string]: StateItem;
}

