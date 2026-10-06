import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";
import type { OfficialResponse } from "../../domain/types/official-response.js";
import type { ProcedureFinding } from "../../domain/types/procedure-finding.js";
import type { WorkflowState } from "../../domain/types/workflow-state.js";
import type { EligibilityAgent } from "../ports/eligibility-agent.js";
import type { ProcedureAgent } from "../ports/procedure-agent.js";
import type { ResponseDrafter } from "../ports/response-drafter.js";

export interface ProcessCitizenRequestResult {
    state: WorkflowState;
    eligibility?: EligibilityFinding;
    procedure?: ProcedureFinding;
    draft?: OfficialResponse;
    reason?: string;
}

export class ProcessCitizenRequestUseCase {
    constructor(
        private readonly eligibilityAgent: EligibilityAgent,
        private readonly procedureAgent: ProcedureAgent,
        private readonly responseDrafter: ResponseDrafter,
    ) { }

    async execute(
        request: CitizenRequest,
    ): Promise<ProcessCitizenRequestResult> {
        const eligibilityResult = await this.eligibilityAgent.analyze(request);

        if (eligibilityResult.status === "insufficient-evidence") {
            return {
                state: "insufficient-evidence",
                reason:
                    eligibilityResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (eligibilityResult.status === "failed") {
            return {
                state: "failed",
                reason:
                    eligibilityResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (!eligibilityResult.data) {
            return {
                state: "failed",
                reason: "Eligibility analysis completed without findings.",
            };
        }

        const procedureResult = await this.procedureAgent.resolve(
            request,
            eligibilityResult.data.serviceId,
        );
        if (procedureResult.status === "insufficient-evidence") {
            return {
                state: "insufficient-evidence",
                eligibility: eligibilityResult.data,
                reason:
                    procedureResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (procedureResult.status === "failed") {
            return {
                state: "failed",
                eligibility: eligibilityResult.data,
                reason:
                    procedureResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (!procedureResult.data) {
            return {
                state: "failed",
                eligibility: eligibilityResult.data,
                reason: "Procedure analysis completed without findings.",
            };
        }

        const draftResult = await this.responseDrafter.draft(
            request,
            eligibilityResult.data,
            procedureResult.data,
        );

        if (draftResult.status === "insufficient-evidence") {
            return {
                state: "insufficient-evidence",
                eligibility: eligibilityResult.data,
                procedure: procedureResult.data,
                reason:
                    draftResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (draftResult.status === "failed") {
            return {
                state: "failed",
                eligibility: eligibilityResult.data,
                procedure: procedureResult.data,
                reason:
                    draftResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (!draftResult.data) {
            return {
                state: "failed",
                eligibility: eligibilityResult.data,
                procedure: procedureResult.data,
                reason: "Response drafting completed without a draft.",
            };
        }

        return {
            state: "awaiting-approval",
            eligibility: eligibilityResult.data,
            procedure: procedureResult.data,
            draft: draftResult.data,
        };
    }
}