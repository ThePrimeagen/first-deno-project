import {
    serve,
} from "https://deno.land/std/http/server.ts";

const s = serve({
    port: 8081
});

try {
    const len = 1024 * 1024;
    const data = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
        data[i] = i % 256;
    }

    for await (const req of s) {
        try {
            await req.respond({ body: data });
        } catch (e) {
            console.error("INNER CATCH", e);
        }
    }
} catch (e) {
    console.error("OUTER CATCH", e);
}

