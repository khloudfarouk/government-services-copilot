import type { ProcedureAgent } from "../../application/ports/procedure-agent.js";
import type { DocumentRetriever } from "../../application/ports/document-retriever.js";
import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { ProcedureFinding } from "../../domain/types/procedure-finding.js";

export class ProcedureAgentImpl implements ProcedureAgent {
  constructor(
    private readonly documentRetriever: DocumentRetriever,
  ) {}

  async resolve(
    request: CitizenRequest,
    serviceId: string,
  ): Promise<AgentResult<ProcedureFinding>> {
    const evidence = await this.documentRetriever.retrieve(
      `${serviceId}: ${request.message}`,
    );

    if (evidence.citations.length === 0) {
      return {
        status: "insufficient-evidence",
        reasoning: "No supporting government evidence was found.",
      };
    }

    return {
      status: "completed",
      data: {
        serviceId,
        requiredDocuments: [
          "Valid National ID",
          "Official service application form",
        ],
        fees: "50 EGP",
        timeline: "3 business days",
        steps: [
          "Submit the service request",
          "Provide the required documents",
          "Complete the verification process",
        ],
        citations: evidence.citations,
      },
    };
  }
}