import assert from "node:assert/strict";
import test from "node:test";

import { ApproveCitizenResponseUseCase } from "../src/application/use-cases/approve-citizen-response.js";

test("approves a response when the officer approves it", () => {
  const useCase = new ApproveCitizenResponseUseCase();

  const result = useCase.execute({
    action: "approve",
    officerId: "officer-test",
    decidedAt: new Date().toISOString(),
  });

  assert.equal(result.state, "approved");
  assert.equal(result.decision.action, "approve");
});

test("rejects a response when the officer rejects it", () => {
  const useCase = new ApproveCitizenResponseUseCase();

  const result = useCase.execute({
    action: "reject",
    officerId: "officer-test",
    decidedAt: new Date().toISOString(),
  });

  assert.equal(result.state, "rejected");
  assert.equal(result.decision.action, "reject");
});

test("supports edit and approve", () => {
  const useCase = new ApproveCitizenResponseUseCase();

  const result = useCase.execute({
    action: "edit-and-approve",
    officerId: "officer-test",
    decidedAt: new Date().toISOString(),
    comment: "Edited before approval.",
  });

  assert.equal(result.state, "approved");
  assert.equal(result.decision.action, "edit-and-approve");
});