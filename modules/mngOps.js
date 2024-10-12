import { basename, dirname, join, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, access, rename, unlink } from "node:fs/promises";
import { printWorkingDirectory } from "./printOps.js";
import { userData } from "../app.js";
import { nameValidator } from "./helpers.js";

export function readFileOp(path) {
  if (!path) {
    console.error("Invalid input.\ncat: undefined or wrong data in arguments.");
    return;
  }

  const fileAbsolutePath = resolve(path);
  const rs = createReadStream(fileAbsolutePath, "utf-8");
  rs.on("error", (err) =>
    console.error(`Operation failed.\ncd: ${err.message}`)
  );
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
    console.error("Invalid input.\nadd: undefined or wrong data in arguments.");
    return;
  }

  const fileAbsolutePath = resolve(userData.currentDir, name);

  try {
    nameValidator(name);
    await writeFile(fileAbsolutePath, "", {
      flag: "wx",
    });
    console.log(`File ${name} created`);
  } catch (err) {
    console.error(`Operation failed.\nadd: ${err.message}`);
  } finally {
    printWorkingDirectory();
  }
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

export async function renameFileOp(oldName, newName) {
  //!check for valuable filename
  if (!oldName || !newName) {
    console.error("rn: undefined or wrong path.");
    return;
  }

  const fileSrc = resolve(oldName);
  const newNameDest = resolve(dirname(fileSrc), newName);

  try {
    await access(fileSrc);
  } catch (error) {
    if (error.code == "ENOENT")
      console.error(`rn failed: src file don't exists`);
    else console.error(error.message);
    return 1;
  }

  try {
    await access(newNameDest);
    throw new Error(`rn failed: file ${newName} already exists`);
  } catch (error) {
    if (error.code == "ENOENT") {
      await rename(fileSrc, newNameDest);
      console.log("rn:file renamed");
    } else {
      console.error(error.message);
    }
  } finally {
    printWorkingDirectory();
  }
}

export async function coptFileOp(path, newPath) {
  //!check for valuable filename
  if (!path || !newPath) {
    console.error("cp: undefined or wrong path.");
    return;
  }
  const filePath = resolve(path);
  const copyPath = join(resolve(newPath), basename(filePath));

  const rs = createReadStream(filePath);
  const ws = createWriteStream(copyPath, { flags: "wx" });

  rs.pipe(ws);

  rs.on("error", (error) => console.error(error.message));
  ws.on("error", (error) => console.error(error.message));

  ws.on("close", printWorkingDirectory);
}
export async function moveFileOp(path, newPath) {
  //!check for valuable filename
  if (!path || !newPath) {
    console.error("cp: undefined or wrong path.");
    return;
  }
  const filePath = resolve(path);
  const copyPath = join(resolve(newPath), basename(filePath));

  const rs = createReadStream(filePath);
  const ws = createWriteStream(copyPath, { flags: "wx" });

  rs.pipe(ws);

  rs.on("error", (error) => console.error(error.message));
  ws.on("error", (error) => console.error(error.message));

  ws.on("close", async () => {
    await unlink(filePath);
    printWorkingDirectory();
  });
}
