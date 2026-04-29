import { callGLM } from "./glmClient";
import { getPrompt } from "./prompts";

export async function runAgent(agentType: string, input: any) {
  const systemPrompt = getPrompt(agentType);

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(input) }
  ];

  const response = await callGLM(messages);

  try {
    return JSON.parse(response);
  } catch {
    return { raw: response };
  }
}