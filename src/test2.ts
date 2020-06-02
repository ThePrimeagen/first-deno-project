import { hmac } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";

console.log(hmac("sha256", "MY_SECRET", "MY_MESSAGE", undefined, "base64"));

