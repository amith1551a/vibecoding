import { onCall } from "firebase-functions/v2/https";
import { runAgent } from "./ai/agentRouter";

export const runInfylogyAgent = onCall(async (req) => {
  const { agentType, input } = req.data;

  if (!req.auth) {
    throw new Error("Unauthorized");
  }

  const result = await runAgent(agentType, input);

  return result;
});