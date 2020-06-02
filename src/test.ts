import { config } from "https://deno.land/x/dotenv/mod.ts";
const c = config();
const API_KEY: string = c["API_KEY"];
const API_SECRET: string = c["API_SECRET"];
const API_PASSPHRASE: string = c["API_PASSPHRASE"];

import { hmac } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";
import { decode } from "https://deno.land/std/encoding/base64.ts";

const coinBaseUrl = "https://api.pro.coinbase.com";
type RequestArgs = {

}
async function makeRequest(path: string, args: RequestArgs) {
    const secret = new Uint8Array(decode(API_SECRET));
    const fullPath = `${coinBaseUrl}${path}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify(args);

    const msg = timestamp + "POST" + path + body;

    // @ts-ignore
    let sign2: string = hmac("sha256", secret, msg, "utf8", "base64");

    sign2 = sign2.
        replace(/-/g, "+").
        replace(/_/g, "/");

    const request: RequestInit = {
        method: "POST",
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

    try {
        const results = await fetch(fullPath, request);
        console.log(await results.json());
    } catch (e) {
        console.error(e);
    }
}

await makeRequest("/orders", {
    type: "limit",
    side: "buy",
    product_id: "ETH-USD",
    price: String(200.0),
    size: String(0.01),
});

