import {
    serve
} from "https://deno.land/std/http/server.ts";

import { getEnv } from "./env.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { readRequestBody } from "./request.ts";
import { RatingsRequest, RatingsResponse } from "./types.ts";

config({
    export: true
});

const s = serve({
    port: 8002
});

console.log("About to run ratings service");

for await (const req of s) {

    if (getEnv("IS_JSON") === "true") {
        const buf: Uint8Array = await readRequestBody(req);
        const json: RatingsRequest = JSON.parse(new TextDecoder().decode(buf));

        const out = json.reduce((acc: RatingsResponse, id: number) => {
            acc[id] = Math.floor(Math.random() * 10);
            return acc;
        }, {} as RatingsResponse);

        req.respond({body: JSON.stringify(out) });
    }
}

