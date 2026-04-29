import http from "http";
import { validateOnboarding } from "./src/agents/onboardingAgent";

/**
 * Local test API server for Infylogy OS.
 * This lets us test the onboarding agent without frontend or Firebase first.
 */
const server = http.createServer(async (req, res) => {
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
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Onboarding API failed" }));
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(3001, () => {
  console.log("Infylogy local API running at http://localhost:3001");
});
