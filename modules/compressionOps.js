import { basename, extname, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { printWorkingDirectory } from "./printOps.js";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";

export async function compressFileBrotli(file, destFile) {
  //!check for valuable filename
  if (!file || !destFile) {
    console.error("cp: undefined or wrong path.");
    return;
  }

  const filePath = resolve(file);
  const destArch = resolve(destFile, basename(file), "bcz");

  const rs = createReadStream(filePath);
  const ws = createWriteStream(destArch);
  const gzip = createBrotliCompress();

  ws.on("error", (err) => {
    console.log(err.message);
  });

  rs.on("error", (err) => {
    console.log(err.message);
  });

  rs.pipe(gzip).pipe(ws);
  ws.on("close", printWorkingDirectory);
}

export async function decompressFileBrotli(file, destFile) {
  //!check for valuable filename
  if (!file || !destFile) {
    console.error("cp: undefined or wrong path.");
    return;
  }

  const archPath = resolve(file);
  const destPath = resolve(destFile, basename(file, extname(file)));

  const rs = createReadStream(archPath);
  const ws = createWriteStream(destPath);
  const gzip = createBrotliDecompress();

  ws.on("error", (err) => {
    console.log(err.message);
  });

  rs.on("error", (err) => {
    console.log(err.message);
  });

  rs.pipe(gzip).pipe(ws);
  ws.on("close", printWorkingDirectory);
}
