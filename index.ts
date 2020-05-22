import {
    serve,
} from "https://deno.land/std/http/server.ts";

import lolomoServer, { Lolomo } from "./lolomo.ts";

const s = serve({
    port: 8000
});

for await (const req of s) {
    const lolomoR = await lolomoServer(req);
    let lolomo:
}

/*
const encoder = new TextEncoder();
const file = await Deno.open("/tmp/foo", {
    read: true,
    write: true,
    create: true,
    append: true,
});

const data = new Uint8Array(1024 * 1024);
for (let i = 0; i < data.length; ++i) {
    data[i] = i % 256;
}

console.log("Hey I wrote a data blob with", data.length, "bytes");

let idx = 0;
do {
    // THAT SUCKS!
    const bytesWritten = await Deno.write(file.rid, data.slice(idx));
    idx += bytesWritten;

} while (idx < data.length);

Deno.close(file.rid);
const file2 = await Deno.open("/tmp/foo", { read: true });

let readTotal = 0;
const readData = new Uint8Array(1024);
let readAmount: number | null = 0;
while (readAmount = file2.readSync(readData)) {
    readTotal += readAmount;
}

console.log("Look at me", readTotal);

*/
