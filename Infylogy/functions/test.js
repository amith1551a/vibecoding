const { validateOnboarding } = require("./dist/src/agents/onboardingAgent");

(async () => {
  const result = await validateOnboarding({
    consultantName: "John",
    consultantRole: "Developer",
    workAuthorization: "H1B",
    assignedProject: "ClientA",
    completedDocuments: ["Offer Letter"],
    completedSteps: [],
    managerApproval: false,
    systemAccess: []
  });

  console.log(JSON.stringify(result, null, 2));
})();
