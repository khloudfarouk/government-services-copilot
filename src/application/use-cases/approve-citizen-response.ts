import type { ApprovalDecision } from "../../domain/types/approval-decision.js";
import type { WorkflowState } from "../../domain/types/workflow-state.js";

export interface ApprovalResult {
  state: WorkflowState;
  decision: ApprovalDecision;
}

export class ApproveCitizenResponseUseCase {
  execute(decision: ApprovalDecision): ApprovalResult {
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