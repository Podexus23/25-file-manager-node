/**
 * 
    By default program should prompt user in console to print commands and wait for results
    In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
    In case of error during execution of operation Operation failed message should be shown and user should be able to enter another command (e.g. attempt to perform an operation on a non-existent file or    work on a non-existent path should result in the operation fail)
    User can't go upper than root directory (e.g. on Windows it's current local drive root). If user tries to do so, current working directory doesn't change
 */

import os, { homedir } from "node:os";
import { stdin } from "node:process";
import path from "node:path";

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
  if (name == 0)
    console.log(
      `Empty value for ${usernameArg.slice(0, -1)}, FM will use default name`
    );
  else userData.userName = name;
  return null;
}
function setUserDir() {
  userData.currentDir = homedir();
}

function printHello(name) {
  process.stdout.write(`Welcome to the File Manager, ${name}!\n`);
}
function printGoodBye(name) {
  process.stdout.write(`Thank you for using File Manager, ${name}, goodbye!\n`);
}
function printWorkingDirectory(path) {
  console.log(`You are currently in ${path}`);
}

// OS OPERATIONS --------------------------------------
function osOps(flag) {
  switch (flag) {
    case "--EOL": {
      if (os.EOL == "\r\n") console.log("On this system EOL is '\\r\\n'");
      if (os.EOL == "\n") console.log("On this system EOL is '\\n'");
      break;
    }
    case "--cpus": {
      let cpusData = os.cpus();
      console.log(`Overall amount of logical CPUs: ${cpusData.length}`);
      console.log("Models:");
      for (let cpu of cpusData) {
        console.log(`${cpu.model.trim()}. Speed: ${cpu.speed / 1000} GHz`);
      }
      break;
    }
    case "--homedir": {
      console.log(os.homedir());
      break;
    }
    case "--username": {
      console.log(os.hostname());
      break;
    }
    case "--architecture": {
      console.log(os.arch());
      break;
    }
    default: {
      console.log(
        "No such flag for os command, try one of these: --EOL, --cpus, --homedir, --username, --architecture"
      );
    }
  }
}
// PATH OPERATIONS ------------------------------
function pathUp() {
  if (path.parse(userData.currentDir).root == userData.currentDir) {
    console.log(`You've reached the root folder ${userData.currentDir}`);
    return;
  }
  const newPath = path.dirname(userData.currentDir);
  userData.currentDir = newPath;
}

function main() {
  // START PROGRAM
  setUserName();
  printHello(userData.userName);
  setUserDir();
  printWorkingDirectory(userData.currentDir);
  /**
   * At the start of the program and after each end of input/operation current working directory should be printed in following way:
    You are currently in path_to_working_directory\
   */
  //! TEST CASES ------------------
  //os check
  //  osOps("--EOL");
  //  osOps("--cpus");
  //  osOps("--homedir");
  //  osOps("--username");
  //  osOps("--architecture");
  //  osOps("--archites");

  //!MID PROGRAM CYCLE
  let inputData;
  let exitFlag = 0;
  //take data from terminal
  stdin.setEncoding("utf-8");
  stdin.on("data", (data) => {
    inputData = data.toString().trim();
    // console.log(`Hi, this is data: ${inputData}`);
    const sortedInputData = inputData.split(" ");
    // console.log(`sorted data ${inputData.split(" ")}`);
    //check for os ops
    if (sortedInputData[0] == "os") osOps(sortedInputData[1]);
    if (sortedInputData[0] == "up") {
      pathUp();
      printWorkingDirectory(userData.currentDir);
    }
    //check for exit
    if (inputData == ".exit") {
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
