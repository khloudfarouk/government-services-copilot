import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { EvaluationHarness } from "../src/evaluation/evaluator.js";
import type { GoldenCase } from "../src/evaluation/evaluator.js";
import { LocalDocumentRetriever } from "../src/infrastructure/retrieval/local-document-retriever.js";

test("evaluates the full 25-case golden set", async () => {
  const goldenSetPath = new URL(
    "../evaluation/golden-set.json",
    import.meta.url,
  );

  const goldenSet = JSON.parse(
    await readFile(goldenSetPath, "utf8"),
  ) as GoldenCase[];

  const retriever = new LocalDocumentRetriever();
  const harness = new EvaluationHarness(retriever);

  const report = await harness.evaluate(goldenSet);

  console.log("\nEvaluation report:");
  console.log(`Total: ${report.total}`);
  console.log(`Passed: ${report.passed}`);
  console.log(`Hit rate: ${report.hitRate}`);
  console.log(`Groundedness: ${report.groundedness}`);
  console.log(
    `Refusal correctness: ${report.refusalCorrectness}`,
  );

  assert.equal(report.total, 25);
  assert.ok(report.hitRate >= 0);
  assert.ok(report.groundedness >= 0);
  assert.ok(report.refusalCorrectness >= 0);
});