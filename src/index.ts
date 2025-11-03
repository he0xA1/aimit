import { execSync } from "node:child_process";
import { commands } from "./cmd.js";
import { createGlobalConfigFile } from "./config.js";
import { generateMessage } from "./service.js";

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
    console.error(
      "Error: --commit, --amend, and --dry-run options are mutually exclusive.",
    );
    process.exit(1);
  }

  if (
    options.generateConfig === true &&
    (options.commit || options.amend || options.dryRun) === true
  ) {
    console.error(
      "Error: --generate-config option cannot be used with --commit, --amend, or --dry-run.",
    );
    process.exit(1);
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
  const parsedOptions = commands.parse();
  const options = parsedOptions.opts<Options>();

  validateOptions(options);

  if (options.directory !== process.cwd()) {
    try {
      process.chdir(options.directory);
    } catch (error) {
      console.error(`Failed to change directory to ${options.directory}`);
      process.exit(1);
    }
  }

  if (options.generateConfig) {
    createGlobalConfigFile();
    console.log("Global configuration file created.");
    process.exit(0);
  }

  let commitMessage = await generateMessage();
  if (options.commit) {
    handleCommit(commitMessage);
  } else if (options.amend) {
    handleAmend(commitMessage);
  } else if (options.dryRun) {
    handleDryRun(commitMessage);
  }
}

main();
