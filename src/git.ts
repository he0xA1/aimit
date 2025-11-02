import { execSync } from "node:child_process";

function getListsOfStagedFiles(): string[] {
  const gitDiffFiles = execSync("git --no-pager diff --cached --name-only").toString();
  return gitDiffFiles
    .split("\n")
    .map((file) => file.trim())
    .filter((file) => file.length > 0);
}

function extractFullHistoryOfEachFile(files: string[]): Record<string, string> {
  const fileContents: Record<string, string> = {};
  for (const file of files) {
    const content = execSync(`git --no-pager log -p -- ${file}`).toString(); // it's can be most recent changes only
    fileContents[file] = content;
  }
  return fileContents;
}

function getDiffOfStagedFiles() {
  const gitDiffOutput = execSync("git --no-pager diff --cached").toString();
  const diffSections = gitDiffOutput.split("diff --git");
  console.log(diffSections);

}

getDiffOfStagedFiles();

export { getListsOfStagedFiles, extractFullHistoryOfEachFile };
