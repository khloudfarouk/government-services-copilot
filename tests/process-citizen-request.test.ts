import assert from "node:assert/strict";
import test from "node:test";

import { ProcessCitizenRequestUseCase } from "../src/application/use-cases/process-citizen-request.js";
import type { EligibilityAgent } from "../src/application/ports/eligibility-agent.js";
import type { ProcedureAgent } from "../src/application/ports/procedure-agent.js";
import type { ResponseDrafter } from "../src/application/ports/response-drafter.js";

test("completes the workflow and waits for human approval", async () => {
  const eligibilityAgent: EligibilityAgent = {
    async analyze() {
      return {
        status: "completed",
        data: {
          serviceId: "service-1",
          requirement: "Applicant meets the requirements",
          status: "eligible",
          explanation: "The applicant satisfies the eligibility requirement.",
          citations: [
            {
              documentId: "doc-1",
              documentName: "Government Service Guide",
              pageNumber: 1,
              chunkId: "chunk-1",
              excerpt: "Eligibility requirement evidence.",
            },
          ],
        },
      };
    },
  };

  const procedureAgent: ProcedureAgent = {
    async resolve() {
      return {
        status: "completed",
        data: {
          serviceId: "service-1",
          requiredDocuments: ["National ID"],
          fees: "No fee",
          timeline: "5 working days",
          steps: ["Submit application", "Provide documents"],
          citations: [
            {
              documentId: "doc-1",
              documentName: "Government Service Guide",
              pageNumber: 2,
              chunkId: "chunk-2",
              excerpt: "Procedure evidence.",
            },
          ],
        },
      };
    },
  };

  const responseDrafter: ResponseDrafter = {
    async draft() {
      return {
        status: "completed",
        data: {
          serviceId: "service-1",
          content: "Official response draft.",
          citations: [],
        },
      };
    },
  };

  const useCase = new ProcessCitizenRequestUseCase(
    eligibilityAgent,
    procedureAgent,
    responseDrafter,
  );

  const result = await useCase.execute({
    requestId: "request-1",
    message: "I want to apply for the service.",
    submittedAt: new Date().toISOString(),
    language: "en",
  });

  assert.equal(result.state, "awaiting-approval");
  assert.ok(result.eligibility);
  assert.ok(result.procedure);
  assert.ok(result.draft);
  assert.equal(result.draft?.serviceId, "service-1");
});

test("stops with insufficient evidence when eligibility evidence is unavailable", async () => {
  const eligibilityAgent: EligibilityAgent = {
    async analyze() {
      return {
        status: "insufficient-evidence",
        reasoning: "No supporting government evidence was found.",
      };
    },
  };

  const procedureAgent: ProcedureAgent = {
    async resolve() {
      throw new Error("Procedure agent should not be called.");
    },
  };

  const responseDrafter: ResponseDrafter = {
    async draft() {
      throw new Error("Response drafter should not be called.");
    },
  };

  const useCase = new ProcessCitizenRequestUseCase(
    eligibilityAgent,
    procedureAgent,
    responseDrafter,
  );

  const result = await useCase.execute({
    requestId: "request-2",
    message: "I need information about an unknown service.",
    submittedAt: new Date().toISOString(),
    language: "en",
  });

  assert.equal(result.state, "insufficient-evidence");
  assert.equal(
    result.reason,
    "No supporting government evidence was found.",
  );
});



test("stops when procedure analysis fails", async () => {
  const eligibilityAgent: EligibilityAgent = {
    async analyze() {
      return {
        status: "completed",
        data: {
          serviceId: "service-1",
          requirement: "Applicant meets the requirements",
          status: "eligible",
          explanation: "The applicant satisfies the eligibility requirement.",
          citations: [],
        },
      };
    },
  };

  const procedureAgent: ProcedureAgent = {
    async resolve() {
      return {
        status: "failed",
        reasoning: "Procedure service temporarily unavailable.",
      };
    },
  };

  const responseDrafter: ResponseDrafter = {
    async draft() {
      throw new Error("Response drafter should not be called.");
    },
  };

  const useCase = new ProcessCitizenRequestUseCase(
    eligibilityAgent,
    procedureAgent,
    responseDrafter,
  );

  const result = await useCase.execute({
    requestId: "request-3",
    message: "I want to know the required documents.",
    submittedAt: new Date().toISOString(),
    language: "en",
  });

  assert.equal(result.state, "failed");
  assert.equal(
    result.reason,
    "Procedure service temporarily unavailable.",
  );
});