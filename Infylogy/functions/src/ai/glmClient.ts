export async function callGLM(messages: any[], maxTokens = 800) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error("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");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "z-ai/glm-4.6",
      max_tokens: maxTokens,
      temperature: 0.2,
      messages
    })
  });

  const text = await res.text();

  console.log("GLM HTTP STATUS:", res.status);
  console.log("GLM RAW RESPONSE:", text);

  if (!res.ok) {
    throw new Error(`GLM failed: ${res.status} ${text}`);
  }

  const data = JSON.parse(text);

  const content =
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.text ||
    "";

  return content;
}
