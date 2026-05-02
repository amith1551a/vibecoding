import "dotenv/config";
import http from "http";
import { validateOnboarding } from "./src/agents/onboardingAgent";
import { getCostSummary } from "./src/cost/costLogger";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3002;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/v1/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      service: "infylogy-backend",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }, null, 2));
    return;
  }

  if (req.method === "GET" && req.url === "/api/v1/ai-cost") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getCostSummary(), null, 2));
    return;
  }

  if (req.method === "POST" && req.url === "/api/v1/onboarding") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const input = JSON.parse(body);
        const result = await validateOnboarding(input);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result, null, 2));
      } catch {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Onboarding API failed" }));
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`Infylogy local API running at http://localhost:${PORT}`);
});
