import fetch from "node-fetch";
import { logAICost } from "../cost/costLogger";

export async function callOpenRouter(model: string, messages: any[]) {
  const startTime = new Date().toISOString();

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3002",
      "X-Title": "Infylogy-AI"
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 300,
      temperature: 0.2
    })
  });

  const data: any = await res.json();

  console.log("MODEL:", model);
  console.log("STATUS:", res.status);

  // ✅ LOG COST HERE
  logAICost({
    timestamp: startTime,
    agentType: "onboarding",
    model: model,
    provider: data?.provider,
    promptTokens: data?.usage?.prompt_tokens || 0,
    completionTokens: data?.usage?.completion_tokens || 0,
    totalTokens: data?.usage?.total_tokens || 0,
    cost: data?.usage?.cost || 0,
    status: res.ok ? "success" : "failed"
  });

  if (!res.ok) {
    throw new Error(data?.error?.message || "OpenRouter failed");
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty model response");
  }

  return content;
}
