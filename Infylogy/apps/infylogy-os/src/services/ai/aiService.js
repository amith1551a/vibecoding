import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPEN_ROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Simple hash function for caching
const getCacheKey = (prompt, context) => {
  const str = prompt + (context || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `ai_cache_${Math.abs(hash)}`;
};

const PROVIDER_COSTS = {
  groq: 0.0005,      // Avg cost per call
  openrouter: 0.005  // Avg cost per call (Claude Haiku/HuggingFace)
};

const callAI = async (prompt, systemPrompt, provider = "groq", retryCount = 0) => {
  const key = provider === "groq" ? import.meta.env.VITE_GROQ_API_KEY : import.meta.env.VITE_OPENROUTER_API_KEY;
  const url = provider === "groq" ? GROQ_API_URL : OPEN_ROUTER_URL;

  if (!key || key === "placeholder") {
    console.warn(`AI Provider ${provider} missing API Key.`);
    return null;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: provider === "groq" ? "llama3-70b-8192" : "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.4 // Lower temp for more deterministic business results
      })
    });

    if (!response.ok) throw new Error(`${provider} failed`);
    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    if (provider === "groq" && retryCount < 1) {
      return callAI(prompt, systemPrompt, "groq", retryCount + 1);
    }
    if (provider === "groq") {
      return callAI(prompt, systemPrompt, "openrouter");
    }
    throw error;
  }
};

export const aiService = {
  // Check budget before running
  getEstimate: (task) => {
    return task === 'polish' ? PROVIDER_COSTS.openrouter : PROVIDER_COSTS.groq;
  },

  process: async (task, prompt, context = "") => {
    try {
      const cacheKey = getCacheKey(prompt, context);
      
      // 1. Check Firestore Cache
      const cacheDoc = await getDoc(doc(db, "ai_cache", cacheKey));
      if (cacheDoc.exists()) {
        console.log("Reusing cached AI result:", cacheKey);
        return { data: cacheDoc.data().result, cached: true };
      }

      // 2. Select Provider based on task
      const provider = task === 'polish' ? 'openrouter' : 'groq';
      
      // 3. System Prompts
      const systemPrompts = {
        match: "Analyze Match Score (0-100) and identify Gaps. Return JSON: { score: number, reasoning: string, gaps: string[] }",
        polish: "Optimize content for professional clarity. Don't invent facts. Return Markdown.",
        risk: "Identify 3 risks for this professional profile. Return JSON array.",
        signals: "Identify 3 expansion signals from client history. Return JSON array."
      };

      // 4. Call AI
      const result = await callAI(prompt, systemPrompts[task] || "", provider);
      
      if (result) {
        // 5. Store in Cache
        await setDoc(doc(db, "ai_cache", cacheKey), {
          result,
          task,
          createdAt: serverTimestamp(),
          provider
        });
        return { data: result, cached: false, cost: PROVIDER_COSTS[provider] };
      }

      throw new Error("AI Execution failed");
    } catch (error) {
      // LOG SYSTEM ERROR
      console.error("AI Logging Error:", error);
      await addDoc(collection(db, "system_logs"), {
        type: "AI_FAILURE",
        task,
        error: error.message,
        timestamp: serverTimestamp()
      });
      throw error;
    }
  }
};
