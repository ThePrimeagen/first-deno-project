import * as dotenv from "dotenv";
import * as http from "http";

dotenv.config();

import { RatingsResponse, RatingsRequest } from "../deno/types";
import { getEnvAsBoolean, getEnv } from "../deno/env";
import { read } from "./get";

console.log("ENV", getEnv("IS_JSON"));

http.createServer(async function (req, res: any) {

    const dat = await read(req);

    if (getEnvAsBoolean("IS_JSON") && typeof dat === "string") {
        const json: RatingsRequest = JSON.parse(dat);

        const out = json.reduce((acc: RatingsResponse, id: number) => {
            acc[id] = Math.floor(Math.random() * 10);
            return acc;
        }, {} as RatingsResponse);

        res.writeHead(200, {});
        res.write(JSON.stringify(out));
        res.end();
        return;
    }
    res.writeHead(500, {});
    res.end();

}).listen(8002);

