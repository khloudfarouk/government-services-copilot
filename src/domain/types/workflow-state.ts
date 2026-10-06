export type WorkflowState =
  | "received"
  | "eligibility-analysis"
  | "procedure-analysis"
  | "response-drafting"
  | "awaiting-approval"
  | "approved"
  | "rejected"
  | "insufficient-evidence"
  | "failed";