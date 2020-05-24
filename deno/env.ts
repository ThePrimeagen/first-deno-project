export function setEnv(key: string, value: string) {
    // @ts-ignore
    if (typeof Deno !== "undefined") {
        // @ts-ignore
        Deno.env.set(key, value);
    } else {
        // @ts-ignore
        process.env[key] = value;
    }
}

export function getEnv(str: string): string | undefined {
    // @ts-ignore
    if (typeof Deno !== "undefined") {
        // @ts-ignore
        return Deno.env.get(str);
    } else {
        // @ts-ignore
        return process.env[str];
    }
}

export function getEnvAsBoolean(str: string): boolean {
    const v = getEnv(str);
    if (v !== undefined) {
        return v.toLowerCase() === "true";
    }

    return false;
}

export function getEnvAsNumber(str: string): number {
const v = getEnv(str);
    if (v !== undefined) {
        return +v;
    }

    return 0;
}


