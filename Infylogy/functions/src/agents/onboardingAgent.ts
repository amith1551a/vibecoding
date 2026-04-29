import { runAgent } from "../ai/agentRouter";

type OnboardingInput = {
  consultantName: string;
  consultantRole: string;
  workAuthorization: string;
  assignedProject: string;
  completedDocuments: string[];
  completedSteps: string[];
  managerApproval: boolean;
  systemAccess: string[];
};

type OnboardingResult = {
  status: "ready" | "review" | "not_ready";
  missingItems: string[];
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  complianceScore: number;
  nextSteps: string[];
};

const REQUIRED_DOCUMENTS = [
  "Offer Letter",
  "Employment Agreement",
  "W-4 Form",
  "I-9 Form"
];

export async function validateOnboarding(
  input: OnboardingInput
): Promise<OnboardingResult> {
  try {
    const missingDocs = REQUIRED_DOCUMENTS.filter(
      doc => !input.completedDocuments.includes(doc)
    );

    if (missingDocs.length > 0 || !input.managerApproval) {
      return {
        status: "not_ready",
        missingItems: missingDocs,
        riskLevel: "high",
        recommendations: ["Complete required documents", "Get manager approval"],
        complianceScore: 40,
        nextSteps: ["Fix missing items before proceeding"]
      };
    }

    const safeInput = {
      role: input.consultantRole,
      project: input.assignedProject,
      completedDocsCount: input.completedDocuments.length,
      missingDocsCount: missingDocs.length,
      managerApproved: input.managerApproval
    };

    const aiResult = await runAgent("onboarding", safeInput);

    return {
      ...aiResult,
      complianceScore: 80
    };

  } catch (error) {
    console.error("Onboarding failed:", error);

    return {
      status: "review",
      missingItems: ["AI validation failed"],
      riskLevel: "medium",
      recommendations: ["Manual review required"],
      complianceScore: 60,
      nextSteps: ["HR review"]
    };
  }
}
