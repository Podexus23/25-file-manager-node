import path, { basename, dirname, join, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, access, rename, unlink } from "node:fs/promises";
import { printWorkingDirectory } from "./printOps.js";
import { userData } from "../app.js";
import { log } from "node:console";

export function readFileOp(path) {
  if (!path) {
    console.error("cat: undefined or wrong path.");
    return;
  }

  const fileAbsolutePath = resolve(path);
  const rs = createReadStream(fileAbsolutePath, "utf-8");
  rs.on("error", (err) => console.error(err.message));
  rs.on("data", (chunk) => {
    console.log(chunk);
  });
  rs.on("end", () => {
    printWorkingDirectory();
  });
}

//!create check names for validation

export async function createFileOp(name) {
  if (!name) {
    //!check for right naming
    console.error("add: undefined or wrong name.");
    return;
  }

  const fileAbsolutePath = resolve(userData.currentDir, name);

  try {
    await writeFile(fileAbsolutePath, "", {
      flag: "wx",
    });
    console.log(`File ${name} created`);
  } catch (err) {
    console.error(err.message);
  } finally {
    printWorkingDirectory();
  }
}

export async function renameFileOp(oldName, newName) {
  const fileSrc = resolve(oldName);
  const newNameDest = resolve(dirname(fileSrc), newName);

  try {
    await access(fileSrc);
  } catch (error) {
    if (error.code == "ENOENT")
      throw new Error(`FS operation failed: src file don't exists`);
    else console.log(error);
    return 1;
  }

  try {
    await access(fileDest);
    throw new Error(`FS operation failed: dest file already exists`);
  } catch (error) {
    if (error.code == "ENOENT") {
      await rename(fileSrc, newNameDest);
      console.log("file renamed");
    } else {
      console.error(error.message);
    }
  }
}

export async function coptFileOp(path, newPath) {
  console.log(`hello from another func coptFileOp`);
}
export async function moveFileOp(path, newPath) {
  console.log(`hello from another func moveFileOp`);
}
export async function deleteFileOp(path) {
  if (!path) {
    console.error("em: undefined or wrong path.");
    return;
  }

  const fileSrc = resolve(path);

  try {
    await unlink(fileSrc);
    console.log(`File ${basename(fileSrc)} deleted`);
  } catch (error) {
    console.error(error.message);
  } finally {
    printWorkingDirectory();
  }
}
