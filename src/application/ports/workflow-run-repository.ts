import type { WorkflowState } from "../../domain/types/workflow-state.js";

export interface WorkflowRun {
  runId: string;
  requestId: string;
  state: WorkflowState;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRunRepository {
  save(run: WorkflowRun): void;
  updateState(runId: string, state: WorkflowState, updatedAt: string): void;
  findByRunId(runId: string): WorkflowRun | null;
}