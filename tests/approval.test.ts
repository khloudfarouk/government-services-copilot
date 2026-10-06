import assert from "node:assert/strict";
import test from "node:test";

import { ApproveCitizenResponseUseCase } from "../src/application/use-cases/approve-citizen-response.js";

test("approves a response when the officer approves it", () => {
  const useCase = new ApproveCitizenResponseUseCase();

  const result = useCase.execute(
    "run-approve-001",
    {
      action: "approve",
      officerId: "officer-1",
      decidedAt: "2026-10-06T18:00:00.000Z",
    },
  );

  assert.equal(result.state, "approved");
  assert.equal(result.decision.action, "approve");
});

test("rejects a response when the officer rejects it", () => {
  const useCase = new ApproveCitizenResponseUseCase();

  const result = useCase.execute(
    "run-reject-001",
    {
      action: "reject",
      officerId: "officer-2",
      decidedAt: "2026-10-06T18:01:00.000Z",
    },
  );

  assert.equal(result.state, "rejected");
  assert.equal(result.decision.action, "reject");
});

test("supports edit and approve", () => {
  const useCase = new ApproveCitizenResponseUseCase();

  const result = useCase.execute(
    "run-edit-001",
    {
      action: "edit-and-approve",
      officerId: "officer-3",
      decidedAt: "2026-10-06T18:02:00.000Z",
      comment: "Edited before approval.",
    },
  );

  assert.equal(result.state, "approved");
  assert.equal(result.decision.action, "edit-and-approve");
});