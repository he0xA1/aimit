import { Command } from "commander";
import { config } from "./config.js";

export const commands = new Command()
  .name("aimit")
  .description(
    "Generate intelligent Git commit messages automatically using local AI models",
  )
  .version("1.0.0")

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
    "-t, --type <type>",
    "Specify commit type (e.g., feat, fix, docs, refactor)",
  )
  .option(
    "-s, --style <style>",
    "Set commit message style (e.g., conventional, semantic)",
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
  )
  .option(
    "--ollama-port <port>",
    "Specify the port for Ollama API",
    parseInt,
    config.ollamaPort,
  )

  // Output options
  .option("-e, --emoji", "Include relevant emoji in commit message")
  .option(
    "-v, --verbose",
    "Display detailed generation process and debug information",
  )
  .option("-q, --quiet", "Suppress all output except errors")
  .option("--copy, --clipboard", "Copy generated commit message to clipboard")
  .option("-o, --output", "Write generated commit message to a file")

  .argument("[directory]", "Project directory", process.cwd());
