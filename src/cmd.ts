import { Command } from "commander";
import { config } from "./config.js";
import process from "node:process";

export const commands = new Command()
  .name("aimit")
  .description(
    "Generate intelligent Git commit messages automatically using local AI models",
  )
  .version("1.0.0")

  .option("--dir, --directory <dir>", "Git directory", process.cwd())

  // Action flags
  .option(
    "-c, --commit",
    "Generate commit message and commit changes automatically",
  )
  .option(
    "-a, --amend",
    "Replace the last commit message with a new AI-generated one",
  )
  .option(
    "-d, --dry-run",
    "Generate and display commit message without committing",
  )

  // Configuration options
  .option(
    "-s, --style <style>",
    "Set commit message style (e.g., conventional, semantic)",
    config.style,
  )
  .option(
    "-l, --max-length <length>",
    "Set maximum character length for commit message",
    parseInt,
    config.maxLength,
  )
  .option(
    "-m, --model <model>",
    "Specify which Ollama model to use for generation",
    config.model,
  )
  .option(
    "-p, --prompt",
    "Provide a custom prompt template for message generation",
    config.prompt,
  )
  .option(
    "--ollama-port <port>",
    "Specify the port for Ollama API",
    parseInt,
    config.ollamaPort,
  )
  .option(
    "-e, --emoji",
    "Include relevant emoji in commit message",
    config.useEmoji,
  )

  // Output options
  .option(
    "-v, --verbose",
    "Display detailed generation process and debug information",
    false,
  )
  .option("-q, --quiet", "Suppress all output except errors", false)
  .option("--clipboard", "Copy generated commit message to clipboard", false)
  .option("-o, --output <file>", "Write generated commit message to a file")

  // Utility options
  .option("--generate-config", "Create a global configuration file", false);
