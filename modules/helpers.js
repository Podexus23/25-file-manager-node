import { homedir } from "node:os";

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
