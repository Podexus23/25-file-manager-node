import { resolve } from "path";
import { createHash } from "crypto";
import { createReadStream } from "fs";

export async function hashOps(path) {
  if (!path) {
    console.error(
      "Invalid input.\nhash: undefined or wrong data in arguments."
    );
    return;
  }
  const absolutePath = resolve(path);
  let prom = new Promise((resolve, reject) => {
    const rs = createReadStream(absolutePath);
    const hash = createHash("sha256");

    rs.on("error", (err) => reject(err));
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => resolve(hash.digest("hex")));
  }).catch((err) => console.error(`Operation failed.\nhash: ${err.message}`));
  return await prom;
}
