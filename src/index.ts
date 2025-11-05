#!/usr/bin/env node

import { commands } from "./cli.js";
import { createGlobalConfigFile, Options, validateOptions } from "./config.js";
import { generateMessage, ollama } from "./service.js";
import { fatal, handleError, installGlobalHandlers } from "./error.js";
import { logDebug, setUpLogger } from "./logger.js";
import { handleAmend, handleCommit, handleDryRun } from "./command.js";
import { existsSync } from "node:fs";

async function main() {
  installGlobalHandlers();

  const parsedOptions = commands.parse();
  const options = parsedOptions.opts<Options>();

  setUpLogger({ verbose: options.verbose, quiet: options.quiet });

  logDebug(options);

  validateOptions(options);

  if (options.directory !== process.cwd()) {
    try {
      process.chdir(options.directory);
    } catch {
      fatal(`Failed to change directory to ${options.directory}`, 1);
    }
  }

  if (options.generateConfig) {
    createGlobalConfigFile();
    console.log("Global configuration file created");
    return;
  }

  if (!existsSync(".git")) {
    fatal("No git repository exists", 1);
  }

  try {
    await ollama.ps();
  } catch {
    fatal("Ollama is not running", 1);
  }

  let commitMessage = await generateMessage();
  logDebug("commit message: " + commitMessage);

  if (options.commit) {
    handleCommit(commitMessage);
    return;
  } else if (options.amend) {
    handleAmend(commitMessage);
    return;
  } else if (options.dryRun) {
    handleDryRun(commitMessage);
    return;
  }
}

main().catch((err) => handleError(err));
