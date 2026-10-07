import type { EligibilityAgent } from "../../application/ports/eligibility-agent.js";
import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";
import type { DocumentRetriever } from "../../application/ports/document-retriever.js";

export class EligibilityAgentImpl implements EligibilityAgent {
    constructor(
        private readonly documentRetriever: DocumentRetriever,
    ) {}

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

        const message = request.message.toLowerCase();

        const explicitlyNotCitizen =
            message.includes("not a registered citizen") ||
            message.includes("not registered citizen") ||
            message.includes("not a citizen");

        const missingNationalId =
            message.includes("do not have a valid national id") ||
            message.includes("don't have a valid national id") ||
            message.includes("without a valid national id") ||
            message.includes("no valid national id");

        const notEligible = explicitlyNotCitizen || missingNationalId;

        return {
            status: "completed",
            data: {
                serviceId: "demo-service",
                requirement:
                    "Applicant must be a registered citizen and provide a valid National ID.",
                status: notEligible ? "ineligible" : "eligible",
                explanation: notEligible
                    ? "The applicant does not meet the eligibility requirements because a registered citizen status and a valid National ID are required."
                    : "The applicant meets the eligibility requirements based on the retrieved evidence.",
                citations: evidence.citations,
            },
        };
    }
}