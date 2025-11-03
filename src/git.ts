import { execSync } from "node:child_process";

function getListsOfStagedFiles(): string[] {
  const gitDiffFiles = execSync("git --no-pager diff --cached --name-only")
    .toString()
    .split("\n")
    .map((file) => file.trim())
    .filter((file) => file.length > 0);
  if (gitDiffFiles.length === 0) {
    throw new Error("There is no file in staged to commit");
  }
  return gitDiffFiles;
}

function getDiffOfStagedFiles(): string[] {
  const stagedChanges: string[] = [];
  try {
    for (const file of getListsOfStagedFiles()) {
      const gitDiffOutput = execSync(
        `git --no-pager diff --cached ${file} `,
      ).toString();
      stagedChanges.push(gitDiffOutput);
    }
    return stagedChanges;
  } catch (error) {
    console.error("There is no file in staged to commit");
    process.exit(1);
  }
}

export { getDiffOfStagedFiles };
