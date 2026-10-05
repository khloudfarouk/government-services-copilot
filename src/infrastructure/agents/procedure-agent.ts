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
        requiredDocuments: ["Demo required document"],
        fees: "Demo fee information",
        timeline: "Demo processing timeline",
        steps: ["Submit request", "Provide required documents"],
        citations: evidence.citations,
      },
    };
  }
}