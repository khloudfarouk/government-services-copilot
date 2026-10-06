import Database from "better-sqlite3";
import type {
  WorkflowRun,
  WorkflowRunRepository,
} from "../../application/ports/workflow-run-repository.js";

export class SqliteWorkflowRunRepository
  implements WorkflowRunRepository
{
  constructor(private readonly db: Database.Database) {}

  save(run: WorkflowRun): void {
    this.db
      .prepare(
        `
        INSERT OR REPLACE INTO workflow_runs
        (run_id, request_id, state, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        `,
      )
      .run(
        run.runId,
        run.requestId,
        run.state,
        run.createdAt,
        run.updatedAt,
      );
  }

  updateState(
  runId: string,
  state: WorkflowRun["state"],
  updatedAt: string,
): void {
  this.db
    .prepare(
      `
      UPDATE workflow_runs
      SET state = ?, updated_at = ?
      WHERE run_id = ?
      `,
    )
    .run(state, updatedAt, runId);
}
  findByRunId(runId: string): WorkflowRun | null {
    const row = this.db
      .prepare(
        `
        SELECT
          run_id,
          request_id,
          state,
          created_at,
          updated_at
        FROM workflow_runs
        WHERE run_id = ?
        `,
      )
      .get(runId) as
      | {
          run_id: string;
          request_id: string;
          state: WorkflowRun["state"];
          created_at: string;
          updated_at: string;
        }
      | undefined;

    if (!row) {
      return null;
    }

    return {
      runId: row.run_id,
      requestId: row.request_id,
      state: row.state,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}