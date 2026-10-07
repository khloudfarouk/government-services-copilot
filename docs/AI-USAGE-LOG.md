# AI Usage Log

## Purpose

This document records how AI-assisted development was used during the
Government Services Copilot project.

AI was treated as a development accelerator, planning assistant, debugging
assistant, and review aid.

AI was **not** treated as an authority for:

- Government policy.
- Eligibility decisions.
- Security approval.
- Project requirements.
- Production readiness.

The repository, tests, compiler output, BRD, and runtime behavior remained the
sources of truth.

---

# 1. Architecture and System Design

## AI-Assisted

AI was used to:

- Brainstorm architecture options.
- Compare Clean Architecture and Hexagonal Architecture approaches.
- Identify application ports and infrastructure adapters.
- Review dependency boundaries.
- Identify missing assessment requirements.
- Structure the system-design documentation.
- Identify target-vs-MVP architectural gaps.

## Human Responsibility

Architecture decisions were reviewed against:

- The BRD.
- The assessment requirements.
- The existing repository structure.
- Actual implementation constraints.

The final architecture intentionally documents production capabilities separately
from implemented MVP capabilities.

---

# 2. Domain Modeling

## AI-Assisted

AI assistance was used to propose:

- Domain type structures.
- Workflow states.
- Eligibility finding structures.
- Citation structures.
- Document and OCR-related models.
- Agent contracts.

## Human Verification

The proposed types were checked against:

- Existing application interfaces.
- Actual workflow requirements.
- TypeScript compiler output.
- Existing repository conventions.

The final implementation was kept independent from web frameworks and provider SDKs.

---

# 3. Application Workflow

## AI-Assisted

AI assistance was used for:

- Structuring application use cases.
- Designing the multi-agent workflow.
- Defining approval workflow behavior.
- Reviewing failure and refusal paths.
- Identifying agent responsibilities.

The resulting workflow was:

```text id="i1x6r8"
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
Awaiting Approval
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

## Human Verification

The workflow was verified through:

- Type checking.
- Automated tests.
- Runtime demonstrations.
- Approval/rejection scenarios.
- Edit-and-approve scenarios.
- Manual browser/API testing.

---

# 4. Implementation Assistance

AI assistance was used for implementation tasks including:

- TypeScript scaffolding.
- Domain type suggestions.
- Application use-case structure.
- Test scaffolding.
- HTTP endpoint examples.
- SQLite repository implementation.
- Retrieval implementation.
- Document ingestion components.
- OCR provider abstraction.
- DOCX export implementation.
- UI improvements.
- Debugging compiler errors.

Generated code was not considered complete until it was inspected and executed
locally.

---

# 5. Retrieval and Evidence Grounding

## AI-Assisted

AI was used to reason about:

- Retrieval boundaries.
- Evidence-first responses.
- Citation structures.
- Out-of-corpus refusal behavior.
- Service-scoped retrieval.
- Unsupported-answer risks.

## Human Verification

Retrieval behavior was manually verified using both supported and unsupported
service requests.

An important verification scenario was an unrelated government service request.

The expected behavior was:

```text id="z1yp6x"
Unsupported Service
       |
       v
No Supporting Evidence
       |
       v
Insufficient Evidence
       |
       v
Refusal
```

This helped prevent unrelated evidence from the demo corpus being presented as
support for another service.

---

# 6. Eligibility Logic

## AI-Assisted

AI assistance was used to identify eligibility scenarios and propose domain
structures.

## Human Verification

The implementation was specifically checked for:

- Eligible applicants.
- Ineligible applicants.
- Missing/invalid eligibility conditions.
- Supporting citations.
- Insufficient evidence.

The eligibility result was not accepted merely because a generated implementation
looked logically correct; it was verified through actual workflow execution.

---

# 7. Document Ingestion and OCR

## AI-Assisted

AI assistance was used to structure:

- OCR provider interfaces.
- OCR document models.
- OCR page information.
- Document chunks.
- Ingestion services.
- Low-confidence handling.

## Important Limitation

The current assessment implementation uses a **mock OCR provider**.

The mock provider demonstrates:

- OCR abstraction.
- Page/chunk structures.
- OCR confidence.
- Low-confidence handling.

It is not represented as production-grade OCR.

A production OCR provider can be introduced behind the same provider boundary.

---

# 8. Evaluation

AI assistance was used to generate candidate evaluation scenarios covering:

- Normal in-corpus questions.
- Out-of-corpus questions.
- Ambiguous requests.
- Prompt injection.
- Conflicting information.
- Unsupported claims.
- Eligibility scenarios.
- Procedure scenarios.

The project evaluation includes a 25-case dataset with adversarial scenarios.

## Human Verification

The final evaluation cases were reviewed against the actual synthetic corpus and
expected behavior.

The evaluation results were then executed against the implementation rather
than being accepted based on AI prediction.

---

# 9. Security Review

AI assistance was used as a review aid for identifying:

- Prompt injection risks.
- Unsupported answer risks.
- Sensitive-data risks.
- Excessive agency.
- Unbounded workflows.
- Unsafe document handling.
- Approval bypass risks.

## Human Verification

Security behavior was checked against the actual application flow.

Important controls include:

- Prompt injection detection.
- Evidence grounding.
- Insufficient-evidence refusal.
- Human approval before finalization.
- Restricted agent responsibilities.
- No real citizen PII in the demo corpus.

---

# 10. Debugging and Corrections

AI assistance was also used during troubleshooting.

When errors occurred, AI suggestions were treated as hypotheses rather than
guaranteed solutions.

The debugging process followed:

```text id="v91v1a"
Error
  |
  v
AI-Assisted Diagnosis
  |
  v
Inspect Actual Repository
  |
  v
Apply Minimal Change
  |
  v
Run Typecheck / Tests
  |
  v
Verify Runtime Behavior
```

This was especially important when suggestions depended on files, methods, or
types that differed from the current repository state.

---

# 11. Examples of AI-Assisted Corrections

## 11.1 Repository Structure

Some AI suggestions assumed that a file or implementation existed in a specific
location.

The repository was inspected before applying the change.

The actual project structure was treated as authoritative.

---

## 11.2 TypeScript Errors

AI assistance was used to interpret compiler errors and suggest corrections.

The final decision was based on:

```text id="g7j4t0"
TypeScript Compiler
       +
Actual Type Definitions
       +
Runtime Behavior
```

rather than the AI suggestion alone.

---

## 11.3 Retrieval Behavior

The initial retrieval approach required additional verification to ensure that
unrelated service requests did not accidentally receive evidence from the
supported Social Status Certificate corpus.

The implementation was adjusted to apply service-scoped retrieval.

The behavior was then tested using an unsupported-service request.

---

## 11.4 Eligibility Behavior

The eligibility implementation required explicit verification for an
ineligible applicant rather than relying only on the happy path.

The behavior was checked using missing or invalid eligibility conditions.

---

## 11.5 Documentation Accuracy

AI-generated documentation can overstate implementation completeness.

The documentation was therefore reviewed to distinguish between:

- Implemented MVP functionality.
- Partial functionality.
- Target architecture.
- Deferred production functionality.

Examples of capabilities that are not represented as fully implemented include:

- Managed vector infrastructure.
- Production OCR.
- Distributed workers.
- Enterprise secrets management.
- Horizontal autoscaling.

---

# 12. Development Practices Used

AI-assisted development followed several controlled practices.

## Small Changes

Work was divided into focused branches, commits, and pull requests.

## Verification Gates

Important changes were checked with:

```bash id="1g2mqs"
npm run typecheck
npm test
npm run build
```

and, where appropriate, runtime/browser verification.

## Documentation Review

Documentation was checked against the actual repository state.

## Security Review

Security-sensitive behavior was explicitly reviewed rather than blindly accepting
generated code.

## Requirement Review

Implementation decisions were compared against the BRD and assessment acceptance
criteria.

---

# 13. Human-Written / Human-Controlled Work

Human involvement remained responsible for:

- Final architecture decisions.
- Repository and branch management.
- Selecting what AI suggestions to accept.
- Reviewing generated code.
- Running commands.
- Running tests.
- Verifying runtime behavior.
- Confirming requirement coverage.
- Determining whether a feature is actually implemented.
- Final documentation approval.
- Final submission decisions.

AI did not have authority to approve its own changes.

---

# 14. AI Misleading or Incorrect Suggestions

The project explicitly recognizes that AI-generated suggestions can be incorrect.

Known failure patterns included:

- Assuming files exist when they do not.
- Assuming methods exist on a class.
- Suggesting APIs that are not implemented.
- Misinterpreting the current repository state.
- Overestimating feature completeness.
- Suggesting production-level capabilities when only an MVP implementation exists.
- Producing technical explanations that require validation.

These cases reinforced the use of repository inspection and automated verification.

---

# 15. Verification Evidence

The following were used as verification mechanisms:

### Static Verification

```text id="8fz3qn"
npm run typecheck
```

### Automated Tests

```text id="f5t9kr"
npm test
```

### Build Verification

```text id="k5x4eu"
npm run build
```

### Runtime Verification

The HTTP application and demonstration workflow were executed locally.

### Manual Verification

Important scenarios were manually tested, including:

- Valid service request.
- Unsupported service.
- Insufficient evidence.
- Ineligible applicant.
- Prompt injection.
- Approval.
- Rejection.
- Edit and approve.
- Document ingestion.
- Low OCR confidence.
- DOCX output.

---

# 16. AI Usage Boundaries

AI was intentionally not used as an authority for government facts.

The system's citizen-service answers are grounded in the project corpus.

The synthetic demonstration corpus is used for reproducibility and does not
represent a real government database.

The project does not use real citizen PII.

---

# 17. Summary

AI accelerated:

- Architecture exploration.
- Implementation.
- Debugging.
- Test planning.
- Security review.
- Evaluation design.
- Documentation.

Human review remained responsible for:

- Correctness.
- Security.
- Requirement compliance.
- Government-service evidence.
- Runtime verification.
- Final implementation decisions.

The guiding principle is:

> **AI proposes; humans verify; the repository and tests provide evidence.**