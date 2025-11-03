import { Ollama } from "ollama";
import { config } from "./config.js";
import fs from "node:fs";
import path from "node:path";
import { getDiffOfStagedFiles } from "./git.js";
import { fileURLToPath } from "node:url";
import { fatal } from "./error.js";

export const ollama = new Ollama({ host: `localhost:${config.ollamaPort}` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systemPromptPath = path.join(__dirname, "assets", "system-prompt.md");
const userPromptPath = path.join(__dirname, "assets", "prompt-template.md");

async function getFirstModel() {
  const modelList = (await ollama.list()).models;
  if (modelList.length === 0) {
    fatal("No model installed on ollama", 1);
  }
  return modelList[0].model;
}

export async function generateMessage(): Promise<string> {
  const systemPromptContent = fs.readFileSync(systemPromptPath, {
    encoding: "utf-8",
  });
  const userPromptContent = fs.readFileSync(userPromptPath, {
    encoding: "utf-8",
  });

  const prompt = userPromptContent.replace(
    "{{STAGED_FILES_DIFF}}",
    getDiffOfStagedFiles().toString(),
  );

  if (config.model === "available") {
    config.model = await getFirstModel();
  }

  const ollamaResponse = await ollama.generate({
    model: config.model,
    prompt: prompt,
    system: systemPromptContent,
    stream: false,
  });

  return ollamaResponse.response;
}
