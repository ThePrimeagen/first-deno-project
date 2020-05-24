import * as http from "http";

import { getEnvAsBoolean } from "../deno/env"

export function read(readable: any): Promise<Uint8Array | string> {
    return new Promise((res, rej) => {
        if (getEnvAsBoolean("IS_JSON")) {
            readable.setEncoding("utf8");

            // This is such a terrible way of doing things.
            let rawData = "";
            readable.on("data", chunk => { rawData += chunk; });
            readable.on("end", () => {
                res(rawData);
            });
            return;
        }
        rej(new Error("I have not made the flat buffers thing yet, maybe I wont???"));
    });
}

export function post(url: string, body: string): Promise<Uint8Array | string> {

    return new Promise((res, rej) => {
        const req = http.request({
            method: "POST",
            host: "localhost",
            port: "8002",
            path: "/",
        }, async (result) => {

            const { statusCode } = result;
            if (statusCode !== 200) {
                throw new Error("You are the worst programmer.");
            }

            res(await read(result));
        });

        req.write(body);
        req.end();
    });
}

export function get(url: string): Promise<Uint8Array | string> {
    return new Promise((res, rej) => {
        http.get(url, async (result) => {

            const { statusCode } = result;
            if (statusCode !== 200) {
                throw new Error("You are the worst programmer.");
            }

            res(await read(result));
        });
    });
}

