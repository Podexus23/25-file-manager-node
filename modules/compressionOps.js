import path, { basename, dirname, join, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, access, rename, unlink } from "node:fs/promises";
import { printWorkingDirectory } from "./printOps.js";
import {
  createBrotliCompress,
  createBrotliDecompress,
  createGzip,
} from "node:zlib";

export async function compressFileBrotli(file, destFile) {
  //!check for valuable filename
  if (!file || !destFile) {
    console.error("cp: undefined or wrong path.");
    return;
  }

  const filePath = resolve(file);
  const destArch = resolve(destFile);

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
  const destPath = resolve(destFile);

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
