type LogSetting = { verbose?: boolean; quiet?: boolean };

let logSetting: LogSetting = { verbose: false, quiet: false };

export function setUpLogger(setting: LogSetting) {
  logSetting = { ...logSetting, ...setting };
}

export function debug(...args: unknown[]) {
  if (!logSetting.quiet && logSetting.verbose) {
    console.debug("Debug:", ...args);
  }
}

export function info(...args: unknown[]) {
  if (!logSetting.quiet) {
    console.info("Info:", ...args);
  }
}

export function warn(...args: unknown[]) {
  if (!logSetting.quiet) {
    console.warn("Warning:", ...args);
  }
}
