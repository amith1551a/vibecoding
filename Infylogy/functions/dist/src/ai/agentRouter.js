"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const glmClient_1 = require("./glmClient");
const prompts_1 = require("./prompts");
async function runAgent(agentType, input) {
    const systemPrompt = (0, prompts_1.getPrompt)(agentType);
    const response = await (0, glmClient_1.callGLM)([
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
    }
    catch {
        return {
            raw: response
        };
    }
}
