import z from "zod";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
import fs from "fs";
import { fatal } from "./error.js";

const configOptionsSchema = z.object({
  model: z.string().trim().toLowerCase(),
  useEmoji: z.boolean(),
  ollamaPort: z.number().positive().min(1000),
  maxLength: z.number().positive(),
  prompt: z.string(),
  style: z.string(),
});

export interface Options {
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

export type Config = z.infer<typeof configOptionsSchema>;

const defaultConfig: Config = {
  model: "available",
  useEmoji: false,
  ollamaPort: 11434,
  maxLength: 80,
  prompt: "",
  style: "",
};

export const defaultSystemPrompt = `You are an expert at writing clear, concise git commit messages following best practices.

## Input

You will receive a git diff of staged changes. Analyze the diff to understand what was modified, added, or deleted.

## Task

Generate a professional git commit message that accurately describes the changes.

## Commit Message Format

### Structure

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Guidelines

**Subject Line (required):**

- Start with a type: \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`perf\`, \`test\`, \`chore\`, \`build\`, \`ci\`
- Optional scope in parentheses: the module/component affected
- Use imperative mood ("add" not "added" or "adds")
- Keep under 50 characters
- No period at the end
- Capitalize first letter after colon

**Body (optional but recommended for non-trivial changes):**

- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

**Footer (optional):**

- Reference issues: \`Fixes #123\` or \`Closes #456\`
- Breaking changes: \`BREAKING CHANGE: description\`

## Types

- \`feat\`: New feature
- \`fix\`: Bug fix
- \`docs\`: Documentation changes
- \`style\`: Code style/formatting (no logic change)
- \`refactor\`: Code restructuring (no behavior change)
- \`perf\`: Performance improvements
- \`test\`: Adding/updating tests
- \`chore\`: Maintenance tasks, dependencies
- \`build\`: Build system/dependencies
- \`ci\`: CI/CD changes

## Instructions

1. Analyze the diff carefully
2. Identify the primary purpose of the changes
3. If multiple unrelated changes exist, note this and suggest splitting the commit
4. Choose the most appropriate type
5. Write a clear subject line
6. Add body only if changes need explanation beyond the subject
7. Keep it professional and factual

## Output
Only output the commit message itself. Do not include any explanations, formatting, markdown, Backtick (\`), or additional text. Return only the commit message.
`;

export const defaultUserPrompt = `Here is the git diff of staged changes:

\`\`\`diff
{{STAGED_FILES_DIFF}}
\`\`\`
`;

function loadConfigFile(path: string): Partial<Config> {
  try {
    const content = fs.readFileSync(path, "utf-8");
    return JSON.parse(content) as Config;
  } catch {
    return {};
  }
}

function getConfigPaths(): { homeConfig: string; localConfig: string } {
  const homeConfig = join(homedir(), ".config", "aimit", "config.json");
  const localConfig = join(process.cwd(), ".aimit.json");
  return { homeConfig, localConfig };
}

function loadConfig(): Config {
  const configPaths = getConfigPaths();
  let mergedConfig = { ...defaultConfig };

  if (existsSync(configPaths.homeConfig)) {
    const homeConfig = loadConfigFile(configPaths.homeConfig);
    mergedConfig = { ...mergedConfig, ...homeConfig };
  } else if (existsSync(configPaths.localConfig)) {
    const localConfig = loadConfigFile(configPaths.localConfig);
    mergedConfig = { ...mergedConfig, ...localConfig };
  }

  try {
    return configOptionsSchema.parse(mergedConfig);
  } catch (err) {
    fatal("Configuration format is not valid");
  }
}

export function createGlobalConfigFile() {
  const globalConfigPath = join(homedir(), ".config", "aimit");
  if (!existsSync(globalConfigPath)) {
    fs.mkdirSync(globalConfigPath, { recursive: true });
  }
  const configFilePath = join(globalConfigPath, "config.json");
  if (!existsSync(configFilePath)) {
    fs.writeFileSync(
      configFilePath,
      JSON.stringify(defaultConfig, null, 2),
      "utf-8"
    );
  }
}

export function validateOptions(options: Options) {
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
      1
    );
  }
}

export const config = loadConfig();
