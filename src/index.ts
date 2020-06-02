import { Coinbase } from "./coinbase.ts";
import { PriceInfo, PriceMap } from "./types.ts";
import { BuyHighSellLow } from "./trader.ts";

const coinBase = new Coinbase();

// THIS IS A BAD WAY TO DO PATHS
const trader = new BuyHighSellLow(coinBase, ["ETH-USD"], Deno.cwd() + "/" + Deno.args[0]);

await trader.connect();


