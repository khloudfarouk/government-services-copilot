import Database from "better-sqlite3";
import type {
  ApprovalDecision,
  ApprovalDecisionRepository,
} from "../../application/ports/approval-decision-repository.js";

export class SqliteApprovalDecisionRepository
  implements ApprovalDecisionRepository
{
  constructor(private readonly db: Database.Database) {}

  save(decision: ApprovalDecision): void {
    this.db
      .prepare(
        `
        INSERT INTO approval_decisions
        (run_id, action, officer_id, comment, decided_at)
        VALUES (?, ?, ?, ?, ?)
        `,
      )
      .run(
        decision.runId,
        decision.action,
        decision.officerId,
        decision.comment ?? null,
        decision.decidedAt,
      );
  }
}