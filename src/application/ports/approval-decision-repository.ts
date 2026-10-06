import type { ApprovalDecision as DomainApprovalDecision } from "../../domain/types/approval-decision.js";

export interface ApprovalDecision extends DomainApprovalDecision {
  runId: string;
}

export interface ApprovalDecisionRepository {
  save(decision: ApprovalDecision): void;
}