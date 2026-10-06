import assert from "node:assert/strict";
import test from "node:test";
import Database from "better-sqlite3";

import { createDatabase } from "../src/infrastructure/persistence/database.js";
import { SqliteApprovalDecisionRepository } from "../src/infrastructure/persistence/sqlite-approval-decision-repository.js";

test("persists an approval decision", () => {
  const db = createDatabase(":memory:");

  db.prepare(
    `
    INSERT INTO workflow_runs
    (run_id, request_id, state, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    `,
  ).run(
    "run-approval-001",
    "request-approval-001",
    "awaiting-approval",
    "2026-10-06T18:20:00.000Z",
    "2026-10-06T18:20:00.000Z",
  );

  const repository = new SqliteApprovalDecisionRepository(db);

  repository.save({
    runId: "run-approval-001",
    action: "approve",
    officerId: "officer-001",
    comment: "Approved after review.",
    decidedAt: "2026-10-06T18:30:00.000Z",
  });

  const stored = db
    .prepare(
      `
      SELECT
        run_id,
        action,
        officer_id,
        comment,
        decided_at
      FROM approval_decisions
      WHERE run_id = ?
      `,
    )
    .get("run-approval-001") as
    | {
        run_id: string;
        action: string;
        officer_id: string;
        comment: string | null;
        decided_at: string;
      }
    | undefined;

  assert.deepEqual(stored, {
    run_id: "run-approval-001",
    action: "approve",
    officer_id: "officer-001",
    comment: "Approved after review.",
    decided_at: "2026-10-06T18:30:00.000Z",
  });

  db.close();
});