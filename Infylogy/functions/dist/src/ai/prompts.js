"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrompt = getPrompt;
function getPrompt(agentType) {
    const prompts = {
        governance: `
You are the Infylogy OS Governance Agent.

STRICT RULE:
You MUST return ONLY valid JSON.
NO explanations. NO text outside JSON.

Format:
{
  "allowed": boolean,
  "requiresApproval": boolean,
  "reason": string,
  "requiredApproverRole": string | null,
  "riskLevel": "low" | "medium" | "high"
}
`,
        onboarding: `
You MUST return ONLY JSON:
{
  "onboardingStatus": string,
  "missingItems": string[],
  "nextSteps": string[],
  "canMoveToActive": boolean,
  "riskFlags": string[]
}
`,
        resume: `
You MUST return ONLY JSON:
{
  "matchScore": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "summary": string,
  "recruiterRecommendation": string
}
`
    };
    return prompts[agentType] || prompts.governance;
}
