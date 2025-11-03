import { execSync } from "node:child_process";
import { commands } from "./cli.js";
import { createGlobalConfigFile } from "./config.js";
import { generateMessage, ollama } from "./service.js";
import { fatal, handleError, installGlobalHandlers } from "./error.js";
import { setUpLogger } from "./logger.js";

interface Options {
  directory: string;
  commit?: boolean;
  amend?: boolean;
  dryRun?: boolean;
  type?: string;
  style?: string;
  maxLength: number;
  model: string;
  prompt?: string;
  ollamaPort: number;
  emoji: boolean;
  verbose: boolean;
  quiet: boolean;
  clipboard?: boolean;
  output?: string;
  generateConfig?: boolean;
}

function validateOptions(options: Options) {
  if (
    [options.commit, options.amend, options.dryRun].filter(Boolean).length > 1
  ) {
    fatal("--commit, --amend, and --dry-run options are mutually exclusive", 1);
  }

  if (
    options.generateConfig === true &&
    (options.commit || options.amend || options.dryRun) === true
  ) {
    fatal(
      "--generate-config option cannot be used with --commit, --amend, or --dry-run",
      1,
    );
  }
}

function handleCommit(commitMessage: string) {
  execSync(`git commit -m "${commitMessage}"`);
}

function handleAmend(commitMessage: string) {
  execSync(`git commit --amend -m "${commitMessage}"`);
}

function handleDryRun(commitMessage: string) {
  console.log(`commit message: ${commitMessage}`);
}

async function main() {
  installGlobalHandlers();

  const parsedOptions = commands.parse();
  const options = parsedOptions.opts<Options>();

  setUpLogger({ verbose: options.verbose, quiet: options.quiet });

  validateOptions(options);

  if (options.directory !== process.cwd()) {
    try {
      process.chdir(options.directory);
    } catch (error) {
      fatal(`Failed to change directory to ${options.directory}`, 1);
    }
  }

  if (options.generateConfig) {
    createGlobalConfigFile();
    console.log("Global configuration file created.");
    return;
  }

  try {
    await ollama.ps();
  } catch (error) {
    fatal("Ollama is not running", 1);
  }

  let commitMessage = await generateMessage();
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
