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
      "utf-8",
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
      1,
    );
  }
}

export const config = loadConfig();
