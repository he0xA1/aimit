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

function extractFullHistoryOfEachFile(): Record<string, string> {
  const fileContents: Record<string, string> = {};
  for (const file of getListsOfStagedFiles()) {
    const content = execSync(`git --no-pager log -p -- ${file}`).toString(); // it's can be most recent changes only
    fileContents[file] = content;
  }
  return fileContents;
}

function getDiffOfStagedFiles(): Record<string, string> {
  const stagedChanges: Record<string, string> = {};

  for (const file of getListsOfStagedFiles()) {
    const gitDiffOutput = execSync(
      `git --no-pager diff --cached ${file} `,
    ).toString();
    stagedChanges[file] = gitDiffOutput;
  }
  return stagedChanges;
}

export {
  getListsOfStagedFiles,
  extractFullHistoryOfEachFile,
  getDiffOfStagedFiles,
};
