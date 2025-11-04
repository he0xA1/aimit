type LogSetting = { verbose?: boolean; quiet?: boolean };

let logSetting: LogSetting = { verbose: false, quiet: false };

export function setUpLogger(setting: LogSetting) {
  logSetting = { ...logSetting, ...setting };
}

export function logDebug(...args: unknown[]) {
  if (!logSetting.quiet && logSetting.verbose) {
    console.debug("Debug:", ...args);
  }
}

export function logInfo(...args: unknown[]) {
  if (!logSetting.quiet) {
    console.info("Info:", ...args);
  }
}

export function logWarn(...args: unknown[]) {
  if (!logSetting.quiet) {
    console.warn("Warning:", ...args);
  }
}
