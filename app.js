/**
 * 
    
    
    By default program should prompt user in console to print commands and wait for results
    In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown and user should be able to enter another command
    In case of error during execution of operation Operation failed message should be shown and user should be able to enter another command (e.g. attempt to perform an operation on a non-existent file or    work on a non-existent path should result in the operation fail)
    User can't go upper than root directory (e.g. on Windows it's current local drive root). If user tries to do so, current working directory doesn't change
 */

/**
 *
 */

import fs, { createReadStream, createWriteStream } from "node:fs";
import { stdin } from "node:process";
import path, { join } from "path";

const userData = {
  userName: "Username",
};

function getName() {
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

function showHello() {
  process.stdout.write(`Welcome to the File Manager, ${userData.userName}!\n`);
}
function showGoodBye() {
  process.stdout.write(
    `Thank you for using File Manager, ${userData.userName}, goodbye!\n`
  );
}

function main() {
  // START PROGRAM
  getName();
  showHello();
  /**
   * At the start of the program and after each end of input/operation current working directory should be printed in following way:
    You are currently in path_to_working_directory
    Starting working directory is current user's home directory (for example, on Windows it's something like system_drive/Users/Username) 
   */
  //MID PROGRAMM CYCLE
  let inputData;
  //start working with cycle
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (data) => {
    inputData = data.trim();
    console.log(`Hi, this is data: ${inputData}`);
    //check for exit
    if (inputData == ".exit") {
      showGoodBye();
      process.exit(0);
    }
  });
  //----------------------------------------------------------------------
  //END of PROGRAM
  process.on("SIGINT", (signal) => {
    showGoodBye();
    process.exit();
  });
}

main();
