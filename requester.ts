import { getEnv, getEnvAsNumber } from "./env.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
const c = config({
    export: true
});

let count = getEnvAsNumber("COUNT");
console.log("LOOK AT THIS", count);

while (--count > 0) {
    const out = await fetch("http://localhost:8000");
    if (getEnv("IS_JSON") === "true") {
        const lolomo = await out.json();
    } else {
        // ? we have to new an object
    }
}

