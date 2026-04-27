import { runAgent } from "./src/ai/agentRouter";
import * as dotenv from "dotenv";
dotenv.config();
async function main() {
    console.log("Starting Governance Agent test...");
    const result = await runAgent("governance", {
        userRole: "Recruiter",
        actionType: "CHANGE_STATUS",
        module: "onboarding",
        currentStatus: "Pending Documents",
        requestedStatus: "Active",
        recordData: {
            backgroundCheckStatus: "Pending",
            i9Status: "Missing",
            workAuthorizationStatus: "Uploaded",
            onboardingChecklistComplete: false
        }
    });
    console.log(JSON.stringify(result, null, 2));
}
main().catch(console.error);
