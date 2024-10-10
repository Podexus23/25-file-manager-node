import path, { resolve } from "path";
import crypto, { createHash } from "crypto";
import { log } from "console";
import { on } from "events";
import { createReadStream } from "fs";

export async function hashOps(path) {
  if (!path) {
    console.error("hash: undefined or wrong path.");
    return;
  }
  try {
    const absolutePath = resolve(path);
    const rs = createReadStream(absolutePath);
    const hash = createHash("sha256");
    rs.on("error", (err) => console.error(err.message));
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => console.log(hash.digest("hex")));
  } catch (error) {
    console.error(error.message);
  }
}
