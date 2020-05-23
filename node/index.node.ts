import * as http from "http";

/*
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
        try {
            let lolomo = await lolomoServiceDeno(req);

            if (isJson) {
                const l = lolomo as Lolomo;
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

        } catch (e) {
            console.error("INNER CATCH", e);
        }
    }

} catch (e) {
    console.error("OUTER CATCH", e);
}

*/
