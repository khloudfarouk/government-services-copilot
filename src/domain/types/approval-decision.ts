export type ApprovalAction =
  | "approve"
  | "reject"
  | "edit-and-approve";

export interface ApprovalDecision {
  action: ApprovalAction;
  officerId: string;
  decidedAt: string;
  comment?: string;
}