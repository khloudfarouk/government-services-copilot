import type { ApprovalDecision } from "../../domain/types/approval-decision.js";
import type { WorkflowState } from "../../domain/types/workflow-state.js";
import type { ApprovalDecisionRepository } from "../ports/approval-decision-repository.js";

export interface ApprovalResult {
  state: WorkflowState;
  decision: ApprovalDecision;
}

export class ApproveCitizenResponseUseCase {
  constructor(
    private readonly approvalDecisionRepository?: ApprovalDecisionRepository,
  ) {}

  execute(
    runId: string,
    decision: ApprovalDecision,
  ): ApprovalResult {
    this.approvalDecisionRepository?.save({
      runId,
      action: decision.action,
      officerId: decision.officerId,
      ...(decision.comment !== undefined
        ? { comment: decision.comment }
        : {}),
      decidedAt: decision.decidedAt,
    });

    if (decision.action === "reject") {
      return {
        state: "rejected",
        decision,
      };
    }

    return {
      state: "approved",
      decision,
    };
  }
}