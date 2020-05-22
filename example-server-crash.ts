import {
    serve,
} from "https://deno.land/std/http/server.ts";

const s = serve({
    port: 8080
});

type Dat = {
    foo: number;
    bar?: Dat;
}

function createDat() {
    const out = {
        foo: Math.random()
    } as Dat;

    if (Math.random() > 0.5) {
        out.bar = createDat();
    }

    return out;
}
try {
    for await (const req of s) {
        //try {
            if (Deno.env.get("JSON")) {
                const data: Dat[] = [];

                for (let i = 3; i < 10000; ++i) {
                    data.push(createDat());
                }
                await req.respond({ body: JSON.stringify(data) });
            } else {
                const len = 1024 * 1024;
                const data2 = new Uint8Array(len);
                for (let i = 0; i < len; ++i) {
                    data2[i] = i % 256;
                }

                await req.respond({ body: data2 });
            }
        //} catch (e) {
        //    console.error("INNER CATCH", e);
       // }
    }
} catch (e) {
    console.error("OUTER CATCH", e);
}
