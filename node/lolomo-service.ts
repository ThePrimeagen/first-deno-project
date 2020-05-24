import * as dotenv from "dotenv";
import * as http from "http";

dotenv.config();

import { getEnvAsBoolean, getEnv, getEnvAsNumber } from "../deno/env";

import { createLolomo } from "./lolomo";

console.log("ENV", getEnv("IS_JSON"));

const isJson = getEnvAsBoolean("IS_JSON");
const listLength = getEnvAsNumber("LIST_LENGTH");

http.createServer(async function (req: any, res: any) {
    const lolomo = createLolomo();
    if (getEnvAsBoolean("IS_JSON")) {
        res.writeHead(200, {});
        res.write(JSON.stringify(lolomo));
        res.end();
    }
}).listen(8001);
