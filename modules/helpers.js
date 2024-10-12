import { homedir } from "node:os";
import { platform } from "node:os";

export function setUserName(userObj) {
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
  else userObj.userName = name;
}

export function setUserDir(userObj) {
  userObj.currentDir = homedir();
  process.chdir(userObj.currentDir);
}

export function nameValidator(nameToValidate) {
  const machPlatform = platform();
  const winForbiddenChars = /[<>:"\/\\|?*]/;
  const winReservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

  if (machPlatform == "win32") {
    if (winForbiddenChars.test(nameToValidate)) {
      throw new Error(
        `Name contains forbidden characters for Windows: <>:"\/\\|?* `
      );
    }
    if (nameToValidate.endsWith(" ") || nameToValidate.endsWith(".")) {
      throw new Error("Name cannot ends with space or period on a Windows");
    }
    if (winReservedNames.test(nameToValidate)) {
      throw new Error("File name is reserved name on Windows");
    }
  }

  if (machPlatform === "linux" || machPlatform === "darwin") {
    if (nameToValidate.includes("/")) {
      throw new Error(`Name contains forbidden characters for Linux/macOS: \/`);
    }
  }

  return null;
}
