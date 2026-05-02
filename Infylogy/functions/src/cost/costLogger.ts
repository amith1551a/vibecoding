type CostLog = {
  timestamp: string;
  agentType: string;
  model: string;
  provider?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  status: "success" | "failed";
};

const costLogs: CostLog[] = [];

export function logAICost(entry: CostLog) {
  costLogs.push(entry);

  console.log("AI_COST_LOG:", {
    timestamp: entry.timestamp,
    agentType: entry.agentType,
    model: entry.model,
    totalTokens: entry.totalTokens,
    cost: entry.cost,
    status: entry.status
  });
}

export function getCostSummary() {
  const today = new Date().toISOString().slice(0, 10);

  const todayLogs = costLogs.filter(log =>
    log.timestamp.startsWith(today)
  );

  const todayCost = todayLogs.reduce((sum, log) => sum + log.cost, 0);

  return {
    todayCost,
    requestCount: todayLogs.length,
    logs: todayLogs
  };
}
