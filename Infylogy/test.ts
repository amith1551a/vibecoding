

const OPENROUTER_API_KEY = "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";

async function testGLM() {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "z-ai/glm-4.6",
      messages: [
        { role: "user", content: "Say hello from GLM and confirm you are working." }
      ]
    })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testGLM();