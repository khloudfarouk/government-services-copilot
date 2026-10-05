import type { AgentResult } from "../../domain/types/agent-result.js";
import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { ProcedureFinding } from "../../domain/types/procedure-finding.js";

export interface ProcedureAgent {
  resolve(
    request: CitizenRequest,
    serviceId: string,
  ): Promise<AgentResult<ProcedureFinding>>;
}