const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export async function callGLM(messages, maxTokens = 800) {
    if (!OPENROUTER_API_KEY) {
        throw new Error("Missing OPENROUTER_API_KEY");
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
    if (!res.ok) {
        throw new Error(`GLM failed: ${res.status} ${text}`);
    }
    const data = JSON.parse(text);
    return data.choices?.[0]?.message?.content ?? "";
}
