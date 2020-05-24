
import {
    getEnvAsBoolean,
    getEnvAsNumber,
} from "../deno/env";

import {
    Video,
    List,
    Lolomo,
} from "../deno/types";

import { get } from "./get";

export async function lolomoServiceNode() {
    const lolomo = await get("http://localhost:8001");
    if (getEnvAsBoolean("IS_JSON") && typeof lolomo === "string") {
        return JSON.parse(lolomo) as Lolomo;
    }
    throw new Error("Not Implement");
};

export function createLolomo(): Lolomo {
    if (getEnvAsBoolean("IS_JSON")) {
        return createLolomoJSON();
    }
    throw new Error("Sorry, not implemented");
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


