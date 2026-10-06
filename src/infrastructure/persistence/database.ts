import Database from "better-sqlite3";
import { readFileSync } from "node:fs";

export function createDatabase(
  databasePath = "data/copilot.db",
): Database.Database {
  const db = new Database(databasePath);

  db.pragma("journal_mode = WAL");

  const migrations = [
    "001-create-workflow-runs.sql",
    "002-create-approval-decisions.sql",
  ];

  for (const migrationFile of migrations) {
    const migration = readFileSync(
      new URL(`./migrations/${migrationFile}`, import.meta.url),
      "utf8",
    );

    db.exec(migration);
  }



  return db;
}