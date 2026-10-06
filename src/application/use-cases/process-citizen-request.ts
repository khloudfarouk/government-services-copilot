import type { CitizenRequest } from "../../domain/types/citizen-request.js";
import type { EligibilityFinding } from "../../domain/types/eligibility-finding.js";
import type { OfficialResponse } from "../../domain/types/official-response.js";
import type { ProcedureFinding } from "../../domain/types/procedure-finding.js";
import type { WorkflowState } from "../../domain/types/workflow-state.js";
import type { EligibilityAgent } from "../ports/eligibility-agent.js";
import type { ProcedureAgent } from "../ports/procedure-agent.js";
import type { ResponseDrafter } from "../ports/response-drafter.js";
import type { WorkflowRunRepository } from "../ports/workflow-run-repository.js";


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
        private readonly workflowRunRepository?: WorkflowRunRepository,) { }

    private updateRunState(
        requestId: string,
        state: WorkflowState,
    ): void {
        this.workflowRunRepository?.updateState(
            requestId,
            state,
            new Date().toISOString(),
        );
    }
    async execute(
        request: CitizenRequest,
    ): Promise<ProcessCitizenRequestResult> {
        const now = new Date().toISOString();

        this.workflowRunRepository?.save({
            runId: request.requestId,
            requestId: request.requestId,
            state: "received",
            createdAt: now,
            updatedAt: now,
        });
        const eligibilityResult = await this.eligibilityAgent.analyze(request);

        if (eligibilityResult.status === "insufficient-evidence") {
            this.updateRunState(request.requestId, "insufficient-evidence");
            return {
                state: "insufficient-evidence",
                reason:
                    eligibilityResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (eligibilityResult.status === "failed") {
            this.updateRunState(request.requestId, "failed");
            return {
                state: "failed",
                reason:
                    eligibilityResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (!eligibilityResult.data) {
            this.updateRunState(request.requestId, "failed");
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
            this.updateRunState(request.requestId, "insufficient-evidence");
            return {
                state: "insufficient-evidence",
                eligibility: eligibilityResult.data,
                reason:
                    procedureResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (procedureResult.status === "failed") {
            this.updateRunState(request.requestId, "failed");
            return {
                state: "failed",
                eligibility: eligibilityResult.data,
                reason:
                    procedureResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (!procedureResult.data) {
            this.updateRunState(request.requestId, "failed");
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
            this.updateRunState(request.requestId, "insufficient-evidence");
            return {
                state: "insufficient-evidence",
                eligibility: eligibilityResult.data,
                procedure: procedureResult.data,
                reason:
                    draftResult.reasoning ?? "No additional details were provided.",
            };
        }

        if (draftResult.status === "failed") {
            this.updateRunState(request.requestId, "insufficient-evidence");
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
        this.workflowRunRepository?.updateState(
            request.requestId,
            "awaiting-approval",
            new Date().toISOString(),
        );

        return {
            state: "awaiting-approval",
            eligibility: eligibilityResult.data,
            procedure: procedureResult.data,
            draft: draftResult.data,
        };
    }
}