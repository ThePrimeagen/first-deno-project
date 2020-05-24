import * as dotenv from "dotenv";
import { getEnvAsBoolean, getEnvAsNumber } from "../deno/env";
import { get } from "./get";

dotenv.config();

let count = getEnvAsNumber("COUNT");
console.log("LOOK AT THIS", count);

async function run() {
    while (--count > 0) {
        const out = await get("http://localhost:8000");
        if (getEnvAsBoolean("IS_JSON") && typeof out === "string") {
            const lolomo = JSON.parse(out);
        } else {
            // ? we have to new an object
        }
    }
}

run();


