import type { EligibilityAgent } from "../../application/ports/eligibility-agent.js";
import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";
import type { DocumentRetriever } from "../../application/ports/document-retriever.js";


export class EligibilityAgentImpl implements EligibilityAgent {
    constructor(
        private readonly documentRetriever: DocumentRetriever,
    ) { }

    async analyze(
        request: CitizenRequest,
    ): Promise<AgentResult<EligibilityFinding>> {
        const evidence = await this.documentRetriever.retrieve(request.message);

        if (evidence.citations.length === 0) {
            return {
                status: "insufficient-evidence",
                reasoning: "No supporting government evidence was found.",
            };
        }

        return {
            status: "completed",
            data: {
                serviceId: "demo-service",
                requirement: "Demo eligibility requirement",
                status: "eligible",
                explanation:
                    "Eligibility was determined using the retrieved evidence.",
                citations: evidence.citations,
            },
        };
    }
}
