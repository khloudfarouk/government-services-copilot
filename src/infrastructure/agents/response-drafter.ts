import type { ResponseDrafter } from "../../application/ports/response-drafter.js";
import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";
import type { ProcedureFinding } from "../../domain/types/procedure-finding.js";
import type { OfficialResponse } from "../../domain/types/official-response.js";

export class ResponseDrafterImpl implements ResponseDrafter {
  async draft(
    request: CitizenRequest,
    eligibility: EligibilityFinding,
    procedure: ProcedureFinding,
  ): Promise<AgentResult<OfficialResponse>> {
    if (procedure.serviceId !== eligibility.serviceId) {
      return {
        status: "failed",
        reasoning: "Eligibility and procedure results refer to different services.",
      };
    }

    const content = [
      `Citizen request: ${request.message}`,
      "",
      `Eligibility: ${eligibility.status}`,
      `Explanation: ${eligibility.explanation}`,
      "",
      "Required documents:",
      ...procedure.requiredDocuments.map((document) => `- ${document}`),
      "",
      `Fees: ${procedure.fees ?? "Not available"}`,
      `Timeline: ${procedure.timeline ?? "Not available"}`,
      "",
      "Procedure steps:",
      ...procedure.steps.map((step, index) => `${index + 1}. ${step}`),
    ].join("\n");

    return {
      status: "completed",
      data: {
        serviceId: eligibility.serviceId,
        content,
        citations: [
          ...eligibility.citations,
          ...procedure.citations,
        ],
      },
    };
  }
}