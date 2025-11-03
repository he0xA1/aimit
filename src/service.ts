import { Ollama } from "ollama";
import { config } from "./config.js";
import fs from "node:fs";
import path from "node:path";
import { getDiffOfStagedFiles } from "./git.js";
import { fileURLToPath } from "node:url";

const ollama = new Ollama({ host: `localhost:${config.ollamaPort}` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systemPromptPath = path.join(__dirname, "resource", "system-prompt.md");
const userPromptPath = path.join(__dirname, "resource", "prompt-template.md");

export async function getFirstModel() {
  return (await ollama.list()).models[0].model;
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
