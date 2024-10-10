import { userData } from "../app.js";

export function printHello(name) {
  process.stdout.write(`Welcome to the File Manager, ${name}!\n`);
}
export function printGoodBye(name) {
  process.stdout.write(`Thank you for using File Manager, ${name}, goodbye!\n`);
}
export function printWorkingDirectory(path) {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `You are currently in ${userData.currentDir}`
  );
}
