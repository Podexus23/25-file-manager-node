import { homedir } from "node:os";
import { stdin } from "node:process";
import fs from "fs/promises";

import { osOps } from "./modules/osOps.js";
import {
  printGoodBye,
  printHello,
  printWorkingDirectory,
} from "./modules/printOps.js";
import { goToPath, pathUp, showCurrentLs } from "./modules/pathAndLsOps.js";

export const userData = {
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

async function commandsController(data) {
  let inputData = data.toString().trim();
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
}
// PATH OPERATIONS ------------------------------

function main() {
  // START PROGRAM
  setUserName();
  printHello(userData.userName);
  setUserDir();
  printWorkingDirectory(userData.currentDir);
  //! TEST CASES ------------------

  //!MID PROGRAM CYCLE
  //take data from terminal
  stdin.setEncoding("utf-8");
  stdin.on("data", commandsController);

  //!EXIT FROM PROGRAM -------------------------------
  process.on("SIGINT", (signal) => {
    printGoodBye(userData.userName);
    process.exit(0);
  });
}

main();
