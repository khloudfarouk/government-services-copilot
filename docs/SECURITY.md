# Security

## Security Goals

The Government Services Copilot is designed to provide grounded government-service
answers without inventing requirements, exposing internal instructions, or allowing
unsafe agent behavior.

## Prompt Injection Protection

Citizen requests are checked for common prompt injection patterns before the
multi-agent workflow starts.

Detected patterns include attempts to:

- Ignore previous instructions.
- Ignore government documents.
- Reveal internal instructions or system prompts.
- Invent answers.
- Override the application's grounding rules.

When a prompt injection attempt is detected, the workflow is stopped and marked
as failed. No specialized agent is executed.

## Grounded Responses

The system uses retrieved government evidence as the source of truth.

If supporting evidence is unavailable, the workflow returns an insufficient-evidence
result instead of generating an unsupported answer.

Responses include citations containing:

- Document identifier.
- Document name.
- Page number.
- Chunk identifier.
- Evidence excerpt.

## Human Approval

Generated official responses do not become final automatically.

The workflow enters `awaiting-approval` and requires an officer decision before
the response can be approved.

Supported decisions:

- Approve.
- Reject.
- Edit and approve.

Approval decisions are persisted for auditability.

## Input Validation

The HTTP API validates:

- Request identifier.
- Citizen message.
- Supported language (`en` or `ar`).

Invalid requests are rejected before workflow execution.

## Sensitive Data

The project does not use real citizen personal data in the development corpus.
Test data is synthetic.

Secrets must not be committed to the repository.

## Current Security Controls

Implemented:

- Prompt injection detection.
- Prompt injection workflow blocking.
- Grounded evidence requirement.
- Insufficient-evidence refusal.
- Human approval gate.
- Approval audit persistence.
- HTTP input validation.
- No real PII in test data.

Planned hardening:

- Authentication and role-based authorization.
- Rate limiting and abuse protection.
- Correlation IDs and security audit events.
- Stronger indirect prompt injection protection for retrieved documents.
- Output validation before document export.
- Secret scanning in CI.
