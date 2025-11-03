import { execSync } from "node:child_process";

export function handleCommit(commitMessage: string) {
  execSync(`git commit -m "${commitMessage}"`);
}

export function handleAmend(commitMessage: string) {
  execSync(`git commit --amend -m "${commitMessage}"`);
}

export function handleDryRun(commitMessage: string) {
  console.log(commitMessage);
}
