import { Lolomo, List, Video ,RatingsResponse } from "./types.ts";
import { getEnv } from "./env.ts";

export function parseRatings(ratingsObj: Lolomo): number[] {
    const ids: number[] = [];
    ratingsObj.lists.forEach((l: List) => {
        l.videos.forEach(v => {
            ids.push(v.id);
        });
    });

    return ids;
}

// TODO: DO THIS
function buildFBRatings(ratings: number[]): string {
    return JSON.stringify(ratings);
}

export async function ratingsService(ratings: number[]): Promise<RatingsResponse | Uint8Array> {
    const isJson = getEnv(`IS_JSON`) === 'true';
    const res = await fetch("http://localhost:8002", {
        method: "POST",
        body: isJson ? JSON.stringify(ratings) : buildFBRatings(ratings),
    });

    if (!res.ok || !res.body) {
        throw new Error("How did your crappy example fail?  You should stop programming and be with your wife you pile of human debris.");
    }

    if (isJson) {
        return await res.json() as RatingsResponse;
    }

    const blobby = await res.blob();
    const buf = await blobby.arrayBuffer();
    return new Uint8Array(buf);
}

