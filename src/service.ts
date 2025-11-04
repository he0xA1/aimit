import { Ollama } from "ollama";
import { config, defaultSystemPrompt, defaultUserPrompt } from "./config.js";
import { getDiffOfStagedFiles } from "./git.js";
import { fatal } from "./error.js";

export const ollama = new Ollama({ host: `localhost:${config.ollamaPort}` });

async function getFirstModel() {
  const modelList = (await ollama.list()).models;
  if (modelList.length === 0) {
    fatal("No model installed on ollama", 1);
  }
  return modelList[0].model;
}

export async function generateMessage(): Promise<string> {
  const prompt = defaultUserPrompt.replace(
    "{{STAGED_FILES_DIFF}}",
    getDiffOfStagedFiles().toString(),
  );

  if (config.model === "available") {
    config.model = await getFirstModel();
  }

  const ollamaResponse = await ollama.generate({
    model: config.model,
    prompt: prompt,
    system: defaultSystemPrompt,
    stream: false,
  });

  return ollamaResponse.response.trim();
}
