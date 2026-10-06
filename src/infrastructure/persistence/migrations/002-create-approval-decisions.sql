CREATE TABLE IF NOT EXISTS approval_decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  action TEXT NOT NULL,
  officer_id TEXT NOT NULL,
  comment TEXT,
  decided_at TEXT NOT NULL,
  FOREIGN KEY (run_id) REFERENCES workflow_runs(run_id)
);