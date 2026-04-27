import { callGLM } from "./glmClient";
import { getPrompt } from "./prompts";

export async function runAgent(agentType: string, input: any) {
  const systemPrompt = getPrompt(agentType);

  const response = await callGLM([
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(input) }
  ], 800);

  if (!response || response.trim() === "") {
    return {
      error: "Empty response from GLM"
    };
  }

  try {
    return JSON.parse(response);
  } catch {
    return {
      raw: response
    };
  }
}
