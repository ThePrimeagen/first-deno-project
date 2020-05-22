import {
    serve,
} from "https://deno.land/std/http/server.ts";

import { getEnv, getEnvAsNumber } from "./env.ts";

import { lolomoServiceDeno } from "./lolomo.ts";
import { parseRatings, ratingsService } from "./ratings.ts";

import { config } from "https://deno.land/x/dotenv/mod.ts";
import { RatingsResponse, Lolomo } from "./types.ts";

config({
    export: true
});

console.log("ENV", getEnv("IS_JSON"));

const s = serve({
    port: 8000
});

const isJson = getEnv("IS_JSON") === "true";
const listLength = getEnvAsNumber("LIST_LENGTH");

try {
    for await (const req of s) {
        let lolomo = await lolomoServiceDeno(req);

        if (isJson) {
            const l = lolomo as Lolomo;
            // 2001 iq
            // @ts-ignore
            const ratings = parseRatings(lolomo);
            const ratingsResponse: RatingsResponse = await ratingsService(ratings);

            Object.keys(ratingsResponse).forEach((k: string, i) => {
                const listIdx = Math.floor(i / listLength);
                const videoIdx = i % listLength;

                l.lists[listIdx].videos[videoIdx].rating = ratingsResponse[+k];
            });

            req.respond({body: JSON.stringify(lolomo)});
        }
    }

} catch (e) {
    console.error(e);
}
