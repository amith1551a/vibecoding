import { callGLM } from "./glmClient";
import { getPrompt } from "./prompts";
export async function runAgent(agentType, input) {
    const systemPrompt = getPrompt(agentType);
    const response = await callGLM([
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(input) }
    ], 800);
    try {
        return JSON.parse(response);
    }
    catch {
        return {
            raw: response
        };
    }
}
