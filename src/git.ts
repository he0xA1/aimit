import { BaseError, fatal, handleError } from "./error.js";
import { logDebug } from "./logger.js";
import { gitCommandExecuter, isExecException } from "./utils.js";

async function getListsOfStagedFiles(): Promise<string[]> {
  try {
    const { stdout } = await gitCommandExecuter(
      "git --no-pager diff --cached --name-only"
    );

    if (stdout.length === 0) {
      throw new BaseError("No file in staged changes");
    }

    logDebug(stdout);

    return stdout
      .split("\n")
      .map((file) => file.trim())
      .filter((file) => file.length > 0);
  } catch (err) {
    if (err instanceof BaseError) {
      handleError(err.message);
    }
    throw err;
  }
}

async function getDiffOfStagedFiles(): Promise<string[]> {
  const stagedChanges: string[] = [];
  for (const file of await getListsOfStagedFiles()) {
    logDebug(file);

    try {
      const { stdout } = await gitCommandExecuter(
        `git --no-pager diff --cached ${file} `
      );

      logDebug(stdout);

      stagedChanges.push(stdout);
    } catch (err) {
      if (isExecException(err)) {
        if (
          err.message.includes(
            "unknown revision or path not in the working tree"
          )
        ) {
          // Deleted files may not show in the commit message
          continue;
        }
      }
    }
  }
  return stagedChanges;
}

export { getDiffOfStagedFiles };
