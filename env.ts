export function setEnv(key: string, value: string) {
    if (typeof Deno !== "undefined") {
        Deno.env.set(key, value);
    } else {
        // @ts-ignore
        process.env[key] = value;
    }
}

export function getEnv(str: string): string | undefined {
    if (typeof Deno !== 'undefined') {
        return Deno.env.get(str);
    } else {
        // @ts-ignore
        return process.env[str];
    }
}

export function getEnvAsNumber(str: string): number {
    const v = getEnv(str);
    if (v !== undefined) {
        return +v;
    }

    return 0;
}


