import { execSync } from "node:child_process";

function getListsOfStagedFiles(): string[] {
  const gitDiffFiles = execSync(
    "git --no-pager diff --cached --name-only",
  ).toString();
  return gitDiffFiles
    .split("\n")
    .map((file) => file.trim())
    .filter((file) => file.length > 0);
}

function getDiffOfStagedFiles(): string[] {
  const stagedChanges: string[] = [];

  for (const file of getListsOfStagedFiles()) {
    const gitDiffOutput = execSync(
      `git --no-pager diff --cached ${file} `,
    ).toString();
    stagedChanges.push(gitDiffOutput);
  }
  return stagedChanges;
}

export { getDiffOfStagedFiles };
