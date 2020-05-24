import * as dotenv from "dotenv";
import * as http from "http";

dotenv.config();

import { getEnvAsBoolean, getEnv, getEnvAsNumber } from "../deno/env";

import { lolomoServiceNode } from "./lolomo";
import { RatingsResponse } from "../deno/types";
import { parseRatings, ratingsService } from "./ratings";

console.log("ENV", getEnv("IS_JSON"));

const isJson = getEnvAsBoolean("IS_JSON");
const listLength = getEnvAsNumber("LIST_LENGTH");

http.createServer(async function (req: any, res: any) {
    let lolomo = await lolomoServiceNode();

    if (isJson) {
        const ratings = parseRatings(lolomo);
        const ratingsResponse: RatingsResponse = await ratingsService(ratings);

        Object.keys(ratingsResponse).forEach((k: string, i) => {
            const listIdx = Math.floor(i / listLength);
            const videoIdx = i % listLength;

            lolomo.lists[listIdx].videos[videoIdx].rating = ratingsResponse[+k];
        });

        res.writeHead(200, {});
        res.write(JSON.stringify(lolomo));
        res.end();
    }

    /*:w
     *
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

        req.respond({body: JSON.stringify(lolomo));
    }
    */
}).listen(8000);
