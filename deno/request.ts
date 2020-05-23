import {
    ServerRequest
} from "https://deno.land/std/http/server.ts";

const scratchBuffer = new Uint8Array(16 * 1024);

export async function readRequestBody(req: ServerRequest): Promise<Uint8Array> {
    const contentLength = req.headers.get("Content-length");
    let bufLength = 0;
    if (contentLength) {
        if (!isNaN(+contentLength)) {
            bufLength = +contentLength;
        }
    }

    let ptr = 0;
    let readAmount: number | null = 0;
    let outData: Uint8Array = new Uint8Array(bufLength);

    do {
        readAmount = await req.body.read(scratchBuffer);
        if (readAmount) {
            if (readAmount + ptr > outData.length) {
                const nextOutData = new Uint8Array(readAmount + ptr);
                nextOutData.set(outData.subarray(0, ptr), 0);
                outData = nextOutData;
            }

            outData.set(scratchBuffer.subarray(0, readAmount), ptr);
            ptr += readAmount;
        }
    } while(readAmount);

    return outData;
}

