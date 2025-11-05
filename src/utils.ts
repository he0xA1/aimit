import { promisify } from "node:util";
import { exec, ExecException } from "node:child_process";
import { fatal, handleError } from "./error.js";

export const promisedExec = promisify(exec);

export function isExecException(err: unknown): err is ExecException {
  return !!(err as ExecException).stderr;
}

export async function gitCommandExecuter(command: string) {
  try {
    return await promisedExec(command);
  } catch (err) {
    if (isExecException(err)) {
      if (err.message.toLowerCase().includes("not found")) {
        handleError("Git not installed");
      }

      if (err.code === 129 || err.code === 128) {
        handleError("No git repository found");
      }
    }

    throw err;
  }
}
