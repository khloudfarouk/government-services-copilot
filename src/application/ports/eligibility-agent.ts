import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";

export interface EligibilityAgent {
  analyze(
    request: CitizenRequest,
  ): Promise<AgentResult<EligibilityFinding>>;
}