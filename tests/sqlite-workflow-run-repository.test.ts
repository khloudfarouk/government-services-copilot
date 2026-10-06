import assert from "node:assert/strict";
import test from "node:test";
import Database from "better-sqlite3";

import { createDatabase } from "../src/infrastructure/persistence/database.js";
import { SqliteWorkflowRunRepository } from "../src/infrastructure/persistence/sqlite-workflow-run-repository.js";

test("persists and retrieves a workflow run", () => {
  const db = createDatabase(":memory:");
  const repository = new SqliteWorkflowRunRepository(db);

  const run = {
    runId: "run-001",
    requestId: "request-001",
    state: "awaiting-approval" as const,
    createdAt: "2026-10-06T18:00:00.000Z",
    updatedAt: "2026-10-06T18:01:00.000Z",
  };

  repository.save(run);

  repository.updateState(
  "run-001",
  "awaiting-approval",
  "2026-10-06T18:02:00.000Z",
);

const stored = repository.findByRunId("run-001");
  assert.deepEqual(stored, {
  ...run,
  state: "awaiting-approval",
  updatedAt: "2026-10-06T18:02:00.000Z",
});
  db.close();
});