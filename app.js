import { homedir } from "node:os";
import { stdin } from "node:process";

import { osOps } from "./modules/osOps.js";
import {
  printGoodBye,
  printHello,
  printWorkingDirectory,
} from "./modules/printOps.js";
import { goToPath, pathUp, showCurrentLs } from "./modules/pathAndLsOps.js";
import { hashOps } from "./modules/hashOps.js";
import {
  coptFileOp,
  createFileOp,
  deleteFileOp,
  moveFileOp,
  readFileOp,
  renameFileOp,
} from "./modules/mngOps.js";
import {
  compressFileBrotli,
  decompressFileBrotli,
} from "./modules/compressionOps.js";
import { rm } from "node:fs";

export const userData = {
  userName: "Username",
  currentDir: "",
};

const allCommands = {
  up: "up",
  cd: "cd path_to_directory",
  ls: "ls",
  cat: "cat path_to_file",
  add: "add new_file_name",
  rn: "rn path_to_file new_filename",
  cp: "cp path_to_file path_to_new_directory",
  mv: "mv path_to_file path_to_new_directory",
  rm: "rm path_to_file",
  os: "\tos --EOL\n\tos --cpus\n\tos --homedir\n\tos --username\n\tos --architecture",
  hash: "hash path_to_file",
  compress: "compress path_to_file path_to_destination",
  decompress: "decompress path_to_file path_to_destination",
};

function getCommHelp() {
  for (let key in allCommands) {
    console.log(`${key}: ${allCommands[key]}`);
  }
}

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

  // check for operation
  switch (sortedInputData[0]) {
    case "os":
      osOps(sortedInputData[1]);
      printWorkingDirectory();
      break;
    case "up":
      pathUp();
      printWorkingDirectory();
      break;
    case "cd":
      await goToPath(sortedInputData[1]);
      printWorkingDirectory();
      break;
    case "ls":
      await showCurrentLs();
      printWorkingDirectory();
      break;
    case "hash":
      const hashRes = await hashOps(sortedInputData[1]);
      if (hashRes) console.log(hashRes);
      printWorkingDirectory();
      break;
    case "cat":
      readFileOp(sortedInputData[1]);
      break;
    case "add":
      createFileOp(sortedInputData[1]);
      break;
    case "rn":
      renameFileOp(sortedInputData[1], sortedInputData[2]);
      break;
    case "cp":
      coptFileOp(sortedInputData[1], sortedInputData[2]);
      break;
    case "mv":
      moveFileOp(sortedInputData[1], sortedInputData[2]);
      break;
    case "rm":
      deleteFileOp(sortedInputData[1]);
      break;
    case "compress":
      compressFileBrotli(sortedInputData[1], sortedInputData[2]);
      break;
    case "decompress":
      decompressFileBrotli(sortedInputData[1], sortedInputData[2]);
      break;
    case ".exit":
      printGoodBye(userData.userName);
      process.exit(0);
      break;
    case "help":
      getCommHelp();
      printWorkingDirectory();
      break;

    default:
      console.log(
        `Sorry, no such command as "${sortedInputData[0]}".\nType 'help' to see all available commands`
      );
      printWorkingDirectory();
      break;
  }
}

function main() {
  //start program
  setUserName();
  printHello(userData.userName);
  setUserDir();
  printWorkingDirectory(userData.currentDir);

  //take data from terminal
  stdin.setEncoding("utf-8");
  stdin.on("data", commandsController);

  //exit on ctrl+c
  process.on("SIGINT", (signal) => {
    printGoodBye(userData.userName);
    process.exit(0);
  });
}

main();
