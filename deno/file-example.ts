import {
    BufReader
} from "https://deno.land/std/io/bufio.ts";

const file = await Deno.open("./foo", { read: true, create: true, write: true });

await Deno.readAll(file);
import * as fs from "fs";

