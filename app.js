/**
 * 
    By default program should prompt user in console to print commands and wait for results
    In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
    In case of error during execution of operation Operation failed message should be shown and user should be able to enter another command (e.g. attempt to perform an operation on a non-existent file or    work on a non-existent path should result in the operation fail)
    User can't go upper than root directory (e.g. on Windows it's current local drive root). If user tries to do so, current working directory doesn't change
 */

import { homedir } from "node:os";
import { stdin } from "node:process";

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
  //MID PROGRAM CYCLE
  let inputData;
  //start working with cycle
  stdin.setEncoding("utf-8");
  stdin.on("data", (data) => {
    inputData = data.trim();
    console.log(`Hi, this is data: ${inputData}`);
    //check for exit
    if (inputData == ".exit") {
      printGoodBye(userData.userName);
      process.exit(0);
    }
  });
  //----------------------------------------------------------------------
  //END of PROGRAM
  process.on("SIGINT", (signal) => {
    printGoodBye(userData.userName);
    process.exit(0);
  });
}

main();
