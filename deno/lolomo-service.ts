import {
    serve
} from "https://deno.land/std/http/server.ts";

import { createLolomo } from "./lolomo.ts";
import { getEnv } from "./env.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
const c = config({
    export: true
});

const s = serve({
    port: 8001
});


console.log("About to run service");
for await (const req of s) {
    const lolomo = createLolomo();

    if (getEnv("IS_JSON") === "true") {
        req.respond({
            body: JSON.stringify(lolomo),
        });
    } else {
        // TODO: Implement me, the flatbuffers
    }
}
