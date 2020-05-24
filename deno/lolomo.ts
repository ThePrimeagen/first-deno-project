import {
    getEnv,
    getEnvAsNumber,
} from "./env.ts";

import {
    Video,
    List,
    Lolomo,
} from "./types.ts";

export async function lolomoServiceDeno(req: any): Promise<Uint8Array | Lolomo> {
    const res = await fetch("http://localhost:8001", {
        headers: req.headers
    });

    if (!res.ok || !res.body) {
        throw new Error("How did your crappy example fail?  You should stop programming and be with your wife you pile of human debris.");
    }

    if (getEnv("IS_JSON") === "true") {
        return await res.json() as Lolomo;
    }

    const blobby = await res.blob();
    const buf = await blobby.arrayBuffer();
    return new Uint8Array(buf);
};

export function createLolomo(): Lolomo {
    if (getEnv("IS_JSON") === "true") {
        return createLolomoJSON();
    }
    throw new Error("lolomo");
}

const randomString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomTitle(): string {
    return new Array(16).fill('').map(x => {
        return randomString[Math.floor(Math.random() * randomString.length)];
    }).join('');
}

export function createLolomoJSON(): Lolomo {
    const lolomo = {
        lists: []
    } as Lolomo;

    const lists = lolomo.lists as List[];

    const lolomoLength: number = getEnvAsNumber("LOLOMO_LENGTH");
    const listLength: number = getEnvAsNumber("LIST_LENGTH");

    if (!lolomoLength || !listLength) {
        throw new Error("You must specify LOLOMO_LENGTH and LIST_LENGTH as env vars.");
    }

    for (let i = 0; i < lolomoLength; ++i) {
        const list = {videos: []} as List;
        const videos = list.videos;

        for (let j = 0; j < listLength; ++j) {
            videos.push({
                title: randomTitle(),
                id: i * listLength + j,
                rating: -1
            } as Video);
        }

        lists.push(list);
    }

    return lolomo;
}

