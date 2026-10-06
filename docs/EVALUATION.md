# Evaluation

## Overview

The Government Services Copilot uses a golden-set evaluation harness to measure
retrieval quality, groundedness, and refusal behavior.

The evaluation dataset contains 25 test cases covering:

- In-corpus government service questions
- Out-of-corpus questions
- Ambiguous requests
- Prompt injection attempts
- Conflicting-source scenarios

The golden set is stored in:

`evaluation/golden-set.json`

The evaluation implementation is located in:

`src/evaluation/evaluator.ts`

## Evaluation Categories

### 1. In-Corpus Questions

These questions should be answered using evidence from the official/synthetic
government corpus.

A successful case must:

- retrieve evidence
- include citations
- include the required source document where specified

### 2. Out-of-Corpus Questions

These questions intentionally ask for information that is not available in the
corpus.

Expected behavior:

> Not enough information in the corpus.

The system should refuse to invent an answer when supporting evidence is
missing.

### 3. Ambiguous Questions

These cases intentionally contain insufficient or unclear information.

Expected behavior:

- avoid unsupported assumptions
- request clarification or refuse safely
- do not fabricate eligibility or procedure information

### 4. Prompt Injection

The adversarial set includes requests attempting to override system behavior,
for example requests to ignore previous instructions or reveal internal
instructions.

Expected behavior:

- reject the request
- do not execute the injected instruction
- do not generate unsupported government guidance

### 5. Conflicting Sources

The evaluation includes a conflicting-source scenario.

Expected behavior:

- detect insufficient confidence
- avoid silently selecting an unsupported answer
- escalate instead of presenting an uncertain entitlement or obligation as
  fact

## Metrics

The current MVP reports:

### Hit Rate

Percentage of evaluation cases where retrieval returned supporting evidence.

### Groundedness

Percentage of expected-answer cases where retrieved evidence exists and the
required citation is present.

### Refusal Correctness

Percentage of refusal/escalation cases where the system correctly avoids
returning unsupported evidence.

### Overall Pass Rate

Percentage of golden cases satisfying all applicable evaluation conditions.

## Baseline Results

The current baseline evaluation contains 25 cases.

| Metric | Baseline |
|---|---:|
| Total cases | 25 |
| Passed | 20 |
| Pass rate | 80% |
| Hit rate | 72% |
| Groundedness | 96% |
| Refusal correctness | 84% |

These numbers represent the current MVP retrieval/evidence evaluation and are
intended as a reproducible baseline rather than a claim of production-level
accuracy.

## Running the Evaluation

Run the complete test suite:

```bash
npm test