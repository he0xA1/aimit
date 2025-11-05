export class BaseError extends Error {
  public readonly exitCode: number;

  constructor(message?: string, exitCode = 1) {
    super(message);
    this.name = "BaseError";
    this.exitCode = Number.isInteger(exitCode) ? exitCode : 1;
    if (Error.captureStackTrace) Error.captureStackTrace(this, BaseError);
  }
}

export function handleError(
  err: unknown,
  opts?: { exit?: boolean },
): never | void {
  const { exit = true } = opts || {};
  let message = "";
  let code = 1;

  if (err instanceof BaseError) {
    message = err.message || "Something went wrong";
    code = err.exitCode || 1;
  } else if (err instanceof Error) {
    message = err.message || err.toString();
  } else if (typeof err === "string") {
    message = err;
  } else {
    try {
      message = JSON.stringify(err);
    } catch (e) {
      message = String(err);
    }
  }

  console.error(`Error: ${message}`);

  if (exit) {
    process.exit(code);
  }
}

export function fatal(message: string, exitCode = 1): never {
  throw new BaseError(message, exitCode);
}

export function installGlobalHandlers(opts?: { exit?: boolean }) {
  const onRejection = (reason: unknown) => handleError(reason, opts);
  const onException = (err: Error) => handleError(err, opts);

  process.on("unhandledRejection", onRejection);
  process.on("uncaughtException", onException);

  return function remove() {
    process.off("unhandledRejection", onRejection);
    process.off("uncaughtException", onException);
  };
}

export default { BaseError, handleError, fatal, installGlobalHandlers };
