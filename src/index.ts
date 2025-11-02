import { commands } from "./cmd.js";
import { config, createGlobalConfigFile } from "./config.js";

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

function handleCommit() {}

function handleAmend() {}

function handleDryRun() {}

function main() {
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

  if (options.commit) {
    handleCommit();
  } else if (options.amend) {
    handleAmend();
  } else if (options.dryRun) {
    handleDryRun();
  } else if (options.generateConfig) {
    createGlobalConfigFile();
    console.log("Global configuration file created.");
  }
}

main();
