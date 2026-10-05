import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";
import type { ProcedureFinding } from "../../domain/types/procedure-finding.js";
import type { OfficialResponse } from "../../domain/types/official-response.js";

export interface ResponseDrafter {
  draft(
    request: CitizenRequest,
    eligibility: EligibilityFinding,
    procedure: ProcedureFinding,
  ): Promise<AgentResult<OfficialResponse>>;
}