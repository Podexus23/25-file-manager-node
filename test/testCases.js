// things to check

import { commandsController } from "../modules/controller.js";

/**
 * BASIC WITH FILES
 *
 * cat
 * empty check Error(Invalid input)
 * if no such path Error(Operation failed: wrong path)
 * write directory
 *
 * add
 * empty check Error(Invalid input)
 * validation check Error(Invalid input)
 * if file already exists Error(Operation failed: file with that name already exists)
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
 *
 * HASH
 * hash
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

//to check each part, remove comments
export function runTest() {
  // navigationTest();
  // osTest();
}
