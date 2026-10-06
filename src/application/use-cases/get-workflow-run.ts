import type { WorkflowRun } from "../ports/workflow-run-repository.js";
import type { WorkflowRunRepository } from "../ports/workflow-run-repository.js";

export class GetWorkflowRunUseCase {
  constructor(
    private readonly workflowRunRepository: WorkflowRunRepository,
  ) {}

  execute(runId: string): WorkflowRun | null {
    return this.workflowRunRepository.findByRunId(runId);
  }
}