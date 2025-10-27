import z from "zod";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
import fs from "fs";

const configOptionsSchema = z.object({
  model: z.string().trim().toLowerCase(),
  useEmoji: z.boolean().default(false),
  ollamaPort: z.number().positive().min(1000),
  maxLength: z.number().positive(),
  prompt: z.string(),
  style: z.string(),
});

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
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function getConfigPaths(): { homeConfig: string; localConfig?: string } {
  const homeConfig = join(homedir(), ".config", "aimit", "config.json");
  const localConfig = join(process.cwd(), "aimit.config.json");
  fs.existsSync(localConfig);
  return { homeConfig, localConfig };
}

function loadConfig(): Config {
  const configPaths = getConfigPaths();
  let mergedConfig = { ...defaultConfig };

  if (existsSync(configPaths.localConfig!)) {
    const localConfig = loadConfigFile(configPaths.localConfig!);
    mergedConfig = { ...mergedConfig, ...localConfig };
  } else if (existsSync(configPaths.homeConfig)) {
    const homeConfig = loadConfigFile(configPaths.homeConfig);
    mergedConfig = { ...mergedConfig, ...homeConfig };
  }

  try {
    return configOptionsSchema.parse(mergedConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Configuration Error:", error.message);
    }
    return defaultConfig;
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

export const config = loadConfig();
