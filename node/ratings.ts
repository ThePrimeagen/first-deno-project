import { Lolomo, List, RatingsResponse } from "../deno/types";
import { post } from "./get";

import { getEnvAsBoolean } from "../deno/env";

export function parseRatings(ratingsObj: Lolomo): number[] {
    const ids: number[] = [];
    ratingsObj.lists.forEach((l: List) => {
        l.videos.forEach(v => {
            ids.push(v.id);
        });
    });

    return ids;
}

export async function ratingsService(ratings: number[]): Promise<RatingsResponse | Uint8Array> {
    const res = await post("http://localhost:8002", JSON.stringify(ratings));

    if (getEnvAsBoolean("IS_JSON") && typeof res === "string") {
        return JSON.parse(res) as RatingsResponse;
    }

    throw new Error("Not Implement");
}


