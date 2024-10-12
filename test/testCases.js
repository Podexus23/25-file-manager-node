// things to check

import { createWriteStream } from "node:fs";
import { commandsController } from "../modules/controller.js";
import { userData } from "../app.js";
import { join } from "node:path";

/**
 * BASIC WITH FILES
 *
 * cat+++
 * empty check Error(Invalid input)+
 * if no such path Error(Operation failed: wrong path)+
 * write directory+
 *
 * add+++
 * empty check Error(Invalid input)+
 * validation check Error(Invalid input)+
 * if file already exists Error(Operation failed: file with that name already exists)+
 *
 * rn
 * empty check for both Error(Invalid input)
 * validation check for second Error(Invalid input)
 * if no such path Error(Operation failed: wrong path)
 * if file already exists Error(Operation failed: file with that name already exists)
 *
 * cp
 * empty check for both Error(Invalid input)
 * if no such path for first Error(Operation failed: wrong path)
 * if no such path for second Error(Operation failed: wrong path)
 * if fileName already exists Error(Operation failed: file with that name already exists)
 *
 * mv
 * empty check for both Error(Invalid input)
 * if no such path for first Error(Operation failed: wrong path)
 * if no such path for second Error(Operation failed: wrong path)
 * if fileName already exists Error(Operation failed: file with that name already exists)
 * don't delete fucking file before checking is it can be moved
 *
 * rm
 * empty check for both Error(Invalid input)
 * if no such path for first Error(Operation failed: wrong path)
 *
 * COMPRESS
 * compress
 * empty check for both Error(Invalid input)
 * if no such path for first Error(Operation failed: wrong path)
 * if no such path for second Error(Operation failed: wrong path)
 * if filename exists, add "_c" to filename"
 *
 * decompress
 * empty check for both Error(Invalid input)
 * if no such path for first Error(Operation failed: wrong path)
 * if no such path for second Error(Operation failed: wrong path)
 * if filename exists, add "_dc" to filename"
 */

async function createFileToTest() {
  const data = "some data to read";
  const ws = createWriteStream(
    join(userData.currentDir, "testMegaSuperFile.txt")
  );

  ws.write(data);
  ws.end();
}

//NAVIGATION
function navigationTest() {
  //run up to see diretory
  commandsController("up");
  //run 3 times more to see Error
  commandsController("up");
  commandsController("up");
  commandsController("up");

  //run cd
  commandsController("cd users");
  commandsController("cd "); //invalid input
  commandsController("cd bababababab"); //operation failed

  //run ls
  commandsController("ls");
}

function osTest() {
  commandsController("os --EOL");
  commandsController("os --cpus");
  commandsController("os --homedir");
  commandsController("os --username");
  commandsController("os --architecture");
  commandsController("os --strange_flag");
}

async function hashTest() {
  await commandsController("add helloFile.txt"); //create to check
  await commandsController("hash    "); //check for invalid input
  await commandsController("hash helloFile.txt"); //check real file
  await commandsController("hash helloFile2.txt"); // check fake file

  setTimeout(() => {
    commandsController("rm helloFile.txt"); //remove file from system
  });
}

async function workWithFilesTest(arg) {
  const name = "testMegaSuperFile.txt";
  // cat
  if (arg == "cat") {
    await createFileToTest();
    commandsController("cat"); //check for invalid input
    commandsController("cat      "); //check for invalid input
    await commandsController("cat someFantasticNameForAFile.txt"); //check for fake file
    await commandsController(`cat ${name}`); //check for real file
    setTimeout(async (handler) => {
      await commandsController(`rm ${name}`); //remove file from system
    }, 1000);
  }
  if (arg == "add") {
    await createFileToTest();
    await commandsController("add"); //check for invalid input
    await commandsController("add      "); //check for invalid input
    await commandsController("add someFantasti>cNameForAFile.txt"); //check for not valid name
    await commandsController(`add ${name}`); //check for already made file
    await commandsController("add normal.txt");
    setTimeout(async (handler) => {
      await commandsController(`rm ${name}`); //remove file from system
      await commandsController(`rm normal.txt`); //remove file from system
    }, 1000);
  }
}

//to check each part, remove comments
export async function runTest() {
  // navigationTest();
  // osTest();
  // hashTest();
  // await workWithFilesTest("cat");
  await workWithFilesTest("add");
  // await workWithFilesTest("rn");
  // await workWithFilesTest("cp");
  // await workWithFilesTest("mv");
  // await workWithFilesTest("rm");
}
