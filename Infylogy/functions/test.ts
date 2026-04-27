const OPENROUTER_API_KEY = "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";

async function testGLM() {
  console.log("Starting GLM test...");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "z-ai/glm-4.6",
      max_tokens: 200,
      messages: [
        { role: "user", content: "Say hello from GLM-4.6 in one sentence." }
      ]
    })
  });
  console.log("HTTP status:", res.status);

  const text = await res.text();
  console.log("RAW RESPONSE:");
  console.log(text);
}

testGLM().catch((err) => {
  console.error("TEST FAILED:");
  console.error(err);
});