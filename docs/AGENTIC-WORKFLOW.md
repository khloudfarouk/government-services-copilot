# Agentic Workflow

## Purpose

The Government Services Copilot uses an orchestrated multi-agent workflow to transform a citizen request into an evidence-grounded draft response.

The workflow is deliberately bounded, deterministic at the orchestration level, evidence-first, and human-controlled.

The AI system provides decision support. It does not autonomously approve or reject government services.

---

# 1. Agentic Workflow Pattern

The selected orchestration pattern is a deterministic sequential workflow.

```text
Citizen Request
      |
      v
Prompt Injection Detection
      |
      v
Eligibility Agent
      |
      v
Procedure Agent
      |
      v
Response Drafter
      |
      v
Awaiting Human Approval
      |
      +----------+-----------+
      |          |           |
      v          v           v
   Approve    Reject   Edit + Approve
      |
      v
Approved Response
      |
      v
Document Export
```

Each agent has a defined responsibility and receives only the information required for its step.

---

# 2. Agent Responsibilities

## 2.1 Eligibility Identifier

Responsible for determining whether the available evidence supports an eligibility finding.

Inputs:

- Citizen request.
- Retrieved evidence.

Outputs:

- Eligibility status.
- Explanation.
- Supporting citations.

Possible statuses include:

```text
eligible
ineligible
uncertain
```

The agent must not infer unsupported eligibility rules.

---

## 2.2 Procedure Resolver

Responsible for identifying supported procedural information such as:

- Required documents.
- Procedure steps.
- Fees.
- Processing time.

The agent uses retrieved evidence and produces citations for supported claims.

---

## 2.3 Response Drafter

Responsible for transforming the structured findings into a clear draft response.

The response drafter does not independently establish government policy.

Its output is based on the preceding evidence-grounded workflow results.

---

## 2.4 Human Approval

The workflow stops at:

```text
Awaiting Approval
```

before an official response can be finalized or exported.

The officer can:

- Approve.
- Reject.
- Edit and approve.

This is a mandatory control boundary.

---

# 3. Evidence-First Workflow

The workflow follows:

```text
Request
   |
   v
Retrieve Evidence
   |
   v
Analyze Evidence
   |
   v
Draft Response
   |
   v
Human Review
```

Evidence is retrieved before the system produces the final response.

Every supported claim should be traceable to citation metadata.

If sufficient evidence cannot be retrieved, the system must not invent an answer.

The expected refusal behavior is:

```text
Not enough information in the corpus.
```

---

# 4. Refusal and Safe Degradation

The workflow explicitly handles insufficient evidence.

Example:

```text
Citizen asks about an unsupported government service
                  |
                  v
          Retrieval returns
            no evidence
                  |
                  v
       Insufficient Evidence
                  |
                  v
             Refusal
```

The system should prefer a safe refusal over an unsupported answer.

The same principle applies when eligibility cannot be determined reliably from the available evidence.

---

# 5. Prompt Injection Handling

Citizen requests and retrieved documents are treated as untrusted input.

Prompt injection detection is performed before normal workflow execution.

Examples considered during evaluation include:

1. Direct instruction injection.
2. Requests to reveal system instructions.
3. Attempts to override workflow rules.

The workflow does not treat retrieved document content as trusted executable instructions.

Retrieved content is evidence/data and must remain within the authority of the workflow.

---

# 6. Agent Authority Boundaries

Agents do not receive unrestricted authority.

An agent cannot normally:

- Approve a government response.
- Bypass the human approval gate.
- Change system configuration.
- Access unrelated protected data.
- Execute arbitrary external actions.

The orchestrator controls the order and boundaries of the workflow.

This reduces excessive-agency risk and makes individual steps easier to test.

---

# 7. Agentic Coding Practices

The project also uses an agentic software-development workflow.

The development process intentionally uses AI as an engineering assistant rather than allowing AI-generated changes to be accepted without verification.

The following practices are used.

---

## 7.1 Project Instructions

Architecture and implementation constraints are maintained as project documentation.

Important constraints include:

- Clean / Hexagonal Architecture.
- Domain/application independence from infrastructure.
- Provider abstraction.
- Evidence grounding.
- Human approval before export.
- Explicit refusal when evidence is insufficient.
- Security boundaries.
- Testability.

These constraints are used to guide implementation decisions and reviews.

---

## 7.2 Small, Scoped Changes

Work is divided into focused implementation branches and commits.

Examples include separate work for:

- System architecture.
- Domain contracts.
- Application workflow.
- Retrieval.
- Document ingestion.
- Document output.
- Security controls.
- Evaluation.

This reduces the risk of large AI-generated changes becoming difficult to review.

---

## 7.3 AI-Assisted Code Review

AI assistance is used to inspect implementation decisions, identify missing requirements, and suggest improvements.

Suggestions are not treated as automatically correct.

Changes are verified using:

- TypeScript type checking.
- Automated tests.
- Manual API testing.
- Browser/demo verification.
- Git diffs.
- Workflow inspection.

---

## 7.4 AI-Assisted Test Design

AI assistance is used to identify test scenarios and adversarial cases.

Examples include:

- Valid service requests.
- Unsupported services.
- Insufficient evidence.
- Ineligible applicants.
- Prompt injection.
- Approval rejection.
- Edit-and-approve.
- Document ingestion.
- Low OCR confidence.

The resulting behavior is verified against the actual implementation rather than accepted solely because an AI assistant proposed it.

---

## 7.5 Documentation Assistance

AI is used to help structure and review project documentation, including:

- System design.
- Architecture.
- Security documentation.
- Evaluation documentation.
- Agentic workflow documentation.
- AI usage records.

Documentation is reviewed against the actual repository state to avoid claiming functionality that has not been implemented.

---

## 7.6 Quality Gates

AI-generated or AI-assisted changes are expected to pass project quality gates before being considered complete.

The primary gates are:

```text
Code Change
    |
    v
Git Diff Review
    |
    v
npm run typecheck
    |
    v
npm test
    |
    v
Manual / Integration Verification
    |
    v
Commit / Pull Request
```

A change that fails a quality gate must be corrected before being treated as complete.

---

# 8. Human Verification of AI-Generated Changes

AI-generated suggestions are treated as proposals.

The developer remains responsible for:

- Understanding the change.
- Reviewing the diff.
- Running tests.
- Verifying behavior.
- Confirming architectural boundaries.
- Confirming that requirements are actually satisfied.

This is particularly important for security-sensitive behavior and evidence-grounded responses.

---

# 9. Where the Agentic Approach Failed or Needed Correction

AI assistance was useful for accelerating implementation, documentation, test planning, and troubleshooting, but it was not treated as infallible.

During development, several suggestions required correction or verification.

Examples include:

### 9.1 TypeScript / Project Structure

AI suggestions occasionally assumed files or project structures that did not exactly match the current repository state.

The repository itself was used as the source of truth.

The correction process was:

```text
AI Suggestion
     |
     v
Inspect Repository
     |
     v
Check Actual Types / Files
     |
     v
Run Typecheck
     |
     v
Correct Implementation
```

---

### 9.2 Retrieval Behavior

Retrieval logic required additional verification to ensure that unrelated services did not receive evidence from the supported demo service.

The implementation was adjusted to use service-scoped retrieval before returning evidence.

This was verified using an unsupported government-service request.

---

### 9.3 Eligibility Behavior

Eligibility behavior required explicit testing for an ineligible applicant rather than relying only on a generic successful request.

The implementation was verified using missing/invalid eligibility conditions and the resulting workflow state.

---

### 9.4 Documentation vs Implementation

AI-generated documentation can easily overstate the maturity of an MVP.

Therefore, production capabilities such as:

- Managed vector infrastructure.
- Production OCR.
- Distributed workers.
- Enterprise secrets management.
- Horizontal autoscaling.

are explicitly described as target architecture or future work when they are not implemented in the assessment MVP.

---

# 10. Verification Philosophy

The project follows this rule:

> AI proposes; the repository and tests verify.

For implementation work, verification is performed using multiple levels:

```text
Static Verification
      |
      +--> TypeScript typecheck
      |
      v
Automated Verification
      |
      +--> Unit / integration tests
      |
      v
Behavioral Verification
      |
      +--> API / browser testing
      |
      v
Requirement Verification
      |
      +--> BRD acceptance criteria
```

---

# 11. Reproducibility

The workflow is designed to be reproducible locally.

The primary verification commands are:

```bash
npm run typecheck
npm test
npm run build
npm run dev
```

The browser-based demonstration can be started through the documented HTTP server workflow.

The project also includes demo commands and synthetic documents to make the main scenarios reproducible without using real citizen data.

---

# 12. Safe Use of AI in the Development Process

AI assistance is intentionally bounded.

AI is not considered the authority for:

- Government policy.
- Eligibility rules.
- Security approval.
- Production readiness.
- Requirement completion.

The BRD, repository implementation, tests, and explicit verification evidence remain the sources of truth.

---

# 13. Summary

The project uses agentic techniques in two related but distinct areas:

### Runtime Agentic Workflow

```text
Citizen Request
      ↓
Eligibility Agent
      ↓
Procedure Agent
      ↓
Response Drafter
      ↓
Human Approval
      ↓
Approved Output
```

### Development Agentic Workflow

```text
Requirement
      ↓
AI-Assisted Planning / Implementation
      ↓
Human Review
      ↓
Automated Quality Gates
      ↓
Behavioral Verification
      ↓
Commit / Pull Request
```

The core principle is:

> **Use AI to accelerate engineering and reasoning, but never delegate final authority or verification to AI.**