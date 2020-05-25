import {
    readJson
} from "https://deno.land/std/fs/mod.ts";

import {
    State,
    Trader,
    Exchange,
} from "./types.ts";

export class BuyHighSellLow implements Trader {

    private state?: State;

    constructor(private exchange: Exchange) { }

    async setState(pathToFile: string): Promise<void> {
        this.state = await readJson(pathToFile) as State;
    }

    async connect() {
        await this.exchange.connect();

    }
}


