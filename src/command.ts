import { gitCommandExecuter } from "./utils.js";
import { handleError } from "./error.js";

export async function handleCommit(commitMessage: string) {
  try {
    await gitCommandExecuter(`git commit -m "${commitMessage}"`);
  } catch (err) {
    handleError(err);
  }
}

export async function handleAmend(commitMessage: string) {
  try {
    await gitCommandExecuter(`git commit --amend -m "${commitMessage}"`);
  } catch (err) {
    handleError(err);
  }
}

export function handleDryRun(commitMessage: string) {
  console.log(commitMessage);
}
