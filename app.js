/**
 *  By default program should prompt user in console to print commands and wait for results
    In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
    In case of error during execution of operation Operation failed message should be shown and user should be able to enter another command (e.g. attempt to perform an operation on a non-existent file or    work on a non-existent path should result in the operation fail)
    User can't go upper than root directory (e.g. on Windows it's current local drive root). If user tries to do so, current working directory doesn't change
 */

import { homedir } from "node:os";
import { stdin } from "node:process";
import path from "node:path";
import fs from "fs/promises";

import { osOps } from "./modules/osOps.js";
import {
  printGoodBye,
  printHello,
  printWorkingDirectory,
} from "./modules/printOps.js";

const userData = {
  userName: "Username",
  currentDir: "",
};

function setUserName() {
  const args = process.argv.slice(2);
  const usernameArg = "--username=";
  if (args.length < 1) {
    console.log(`Please use ${usernameArg.slice(0, -1)} next time`);
    console.log(`FM will use default name`);
    return null;
  }

  const name = args
    .filter((e) => e.startsWith(usernameArg))[0]
    .slice(usernameArg.length);
  if (name.length == 0)
    console.log(
      `Empty value for ${usernameArg.slice(0, -1)}, FM will use default name`
    );
  else userData.userName = name;
  return null;
}
function setUserDir() {
  userData.currentDir = homedir();
  process.chdir(userData.currentDir);
}

// PATH OPERATIONS ------------------------------
function pathUp() {
  if (path.parse(userData.currentDir).root == userData.currentDir) {
    console.error(`You've reached the root folder ${userData.currentDir}`);
    return;
  }
  const newPath = path.dirname(userData.currentDir);
  userData.currentDir = newPath;
  process.chdir(userData.currentDir);
}
/**
 * @param {string | undefined} newPath
 */

async function goToPath(newPath) {
  if (!newPath) {
    console.error("cd: undefined or wrong path.");
    return;
  }
  const absolutePath = path.resolve(newPath);

  try {
    await fs.access(absolutePath);
    userData.currentDir = absolutePath;
    process.chdir(userData.currentDir);
  } catch (error) {
    console.log(error.message);
  }
  console.log(absolutePath);
}

async function showCurrentLs() {
  try {
    const lsData = await fs.readdir(userData.currentDir, {
      withFileTypes: true,
    });
    const showData = lsData
      .map((e) => {
        return {
          ["Name"]: e.name,
          ["Type"]: e.isDirectory() ? "directory" : e.isFile() ? "file" : null,
        };
      })
      .filter((e) => e.Type != null);
    const dir = showData
      .filter((e) => e.Type == "directory")
      .sort((a, b) => a - b);
    const files = showData
      .filter((e) => e.Type == "file")
      .sort((a, b) => a - b);
    const concatSortedData = [...dir, ...files];
    console.table(concatSortedData);
  } catch (error) {
    console.error(error.message);
  }
}

function main() {
  // START PROGRAM
  setUserName();
  printHello(userData.userName);
  setUserDir();
  printWorkingDirectory(userData.currentDir);
  //! TEST CASES ------------------

  //!MID PROGRAM CYCLE
  let inputData;
  //take data from terminal
  stdin.setEncoding("utf-8");
  stdin.on("data", async (data) => {
    inputData = data.toString().trim();
    const sortedInputData = inputData.split(" ");
    //check for operation
    if (sortedInputData[0] == "os") osOps(sortedInputData[1]);
    if (sortedInputData[0] == "up") {
      pathUp();
      printWorkingDirectory(userData.currentDir);
    }
    if (sortedInputData[0] == "cd") {
      await goToPath(sortedInputData[1]);
      printWorkingDirectory(userData.currentDir);
    }
    if (sortedInputData[0] == "ls") {
      await showCurrentLs();
      printWorkingDirectory(userData.currentDir);
    }
    //check for exit
    if (inputData == ".exit" || sortedInputData[0] == ".exit") {
      printGoodBye(userData.userName);
      process.exit(0);
    }
  });
  //!EXIT FROM PROGRAM -------------------------------
  process.on("SIGINT", (signal) => {
    printGoodBye(userData.userName);
    process.exit(0);
  });
}

main();
