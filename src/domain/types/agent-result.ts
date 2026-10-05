export type AgentStatus =
  | "completed"
  | "insufficient-evidence"
  | "failed";

export interface AgentResult<T> {
  status: AgentStatus;
  data?: T;
  reasoning?: string;
}