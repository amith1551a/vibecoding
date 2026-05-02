import { callOpenRouter } from "./openrouterClient";
import { getPrompt } from "./prompts";

const MODELS = [
  "deepseek/deepseek-chat",
  "mistralai/mistral-small-2603",
  "z-ai/glm-4.6"
];

export async function runAgent(agentType: string, input: any) {
  const systemPrompt = getPrompt(agentType);

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(input) }
  ];

  for (const model of MODELS) {
    try {
      console.log("Trying model:", model);

      const response = await callOpenRouter(model, messages);

      // 🔥 CLEAN + PARSE FIX
      const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return parsed;

    } catch (err: any) {
      console.log(`Model failed: ${model}`);
      console.log("Error:", err.message);
    }
  }

  return {
    status: "review",
    error: "All models failed",
    complianceScore: 80
  };
}
