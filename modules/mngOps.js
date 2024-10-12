import { basename, dirname, join, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { writeFile, access, rename, unlink } from "node:fs/promises";
import { printWorkingDirectory } from "./printOps.js";
import { userData } from "../app.js";
import { nameValidator } from "./helpers.js";

export function readFileOp(path) {
  if (!path) {
    console.error("Invalid input.\ncat: undefined or wrong data in arguments.");
    printWorkingDirectory();
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

export async function createFileOp(name) {
  if (!name) {
    console.error("Invalid input.\nadd: undefined or wrong data in arguments.");
    printWorkingDirectory();
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
    console.error("Invalid input.\nrm: undefined or wrong data in arguments.");
    printWorkingDirectory();
    return;
  }

  const fileSrc = resolve(path);

  try {
    await unlink(fileSrc);
    console.log(`File ${basename(fileSrc)} deleted`);
  } catch (error) {
    console.error(`Operation failed.\nrm: ${error.message}`);
  } finally {
    printWorkingDirectory();
  }
}

export async function renameFileOp(oldName, newName) {
  if (!oldName || !newName) {
    console.error("Invalid input.\nrn: undefined or wrong data in arguments.");
    printWorkingDirectory();
    return;
  }

  const fileSrc = resolve(oldName);
  const newNameDest = resolve(dirname(fileSrc), newName);

  try {
    await access(fileSrc);
    nameValidator(newName);
  } catch (error) {
    if (error.code == "ENOENT")
      console.error(`Operation failed.\nrn: ${error.message}`);
    else console.error(`Operation failed.\nrn: ${error.message}`);
    printWorkingDirectory();
    return 1;
  }

  try {
    await access(newNameDest);
    throw new Error(`file ${newName} already exists`);
  } catch (error) {
    if (error.code == "ENOENT") {
      await rename(fileSrc, newNameDest);
      console.log("rn:file renamed");
    } else {
      console.error(`Operation failed.\nrn: ${error.message}`);
    }
  } finally {
    printWorkingDirectory();
  }
}

export async function coptFileOp(path, newPath) {
  if (!path || !newPath) {
    console.error("Invalid input.\ncp: undefined or wrong data in arguments.");
    printWorkingDirectory();
    return;
  }
  const filePath = resolve(path);
  const copyPath = join(resolve(newPath), basename(filePath));
  //flag for checking errors, if its 1, function dont show other errors
  let errCheck = 0;

  const rs = createReadStream(filePath);
  const ws = createWriteStream(copyPath, { flags: "wx" });

  rs.on("error", (error) => {
    console.error(`Operation failed.\ncp: ${error.message}`);
    errCheck = 1;
    printWorkingDirectory();
  });
  ws.on("error", (error) => {
    if (!errCheck) {
      console.error(`Operation failed.\ncp: ${error.message}`);
      printWorkingDirectory();
    }
    errCheck = 1;
  });

  ws.on("close", () => {
    if (!errCheck) {
      console.log(`File ${basename(path)} copied to ${dirname(copyPath)}`);
      printWorkingDirectory();
    }
  });

  rs.pipe(ws);
}

export async function moveFileOp(path, newPath) {
  if (!path || !newPath) {
    console.error("Invalid input.\nrm: undefined or wrong data in arguments.");
    printWorkingDirectory();
    return;
  }
  const filePath = resolve(path);
  const copyPath = join(resolve(newPath), basename(filePath));

  const rs = createReadStream(filePath);
  const ws = createWriteStream(copyPath, { flags: "wx" });
  let errCheck = 0;

  rs.on("error", (error) => {
    console.error(`Operation failed.\ncp: ${error.message}`);
    errCheck = 1;
    printWorkingDirectory();
  });

  ws.on("error", (error) => {
    if (!errCheck) {
      console.error(`Operation failed.\ncp: ${error.message}`);
      printWorkingDirectory();
    }
    errCheck = 1;
  });

  rs.pipe(ws);

  ws.on("close", async () => {
    try {
      if (!errCheck) {
        await unlink(filePath);
        console.log(`File moved to ${dirname(copyPath)}`);
        printWorkingDirectory();
      }
    } catch (error) {
      console.error(`Operation failed.\ncp: ${error.message}`);
      printWorkingDirectory();
    }
  });
}
