import { execSync } from "node:child_process";
import { fatal } from "./error.js";

function getListsOfStagedFiles(): string[] {
  const gitDiffFiles = execSync("git --no-pager diff --cached --name-only")
    .toString()
    .split("\n")
    .map((file) => file.trim())
    .filter((file) => file.length > 0);

  if (gitDiffFiles.length === 0) {
    fatal("No file in staged changes");
  }

  return gitDiffFiles;
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
