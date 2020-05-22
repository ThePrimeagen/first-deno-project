import {
    ServerRequest
} from "https://deno.land/std/http/server.ts";

export type Video = {
    title: string;
    ratings: number;
}
export type List = Video[];
export type Lolomo = List[];

export default async function lolomoService(req: ServerRequest): Promise<Uint8Array | Lolomo> {
    const res = await fetch("http://localhost:8001", {
        headers: req.headers
    });

    if (!res.ok || !res.body) {
        throw new Error("How did your crappy example fail?  You should stop programming and be with your wife you pile of human debris.");
    }

    if (Deno.env.get("IS_JSON")) {
        return await res.json() as Lolomo;
    }

    const blobby = await res.blob();
    const buf = await blobby.arrayBuffer();
    return new Uint8Array(buf);
};

