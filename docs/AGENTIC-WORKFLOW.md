# Agentic Workflow

## Purpose

The project uses an orchestrated multi-agent workflow to transform a citizen
request into a grounded draft response.

The workflow is deliberately bounded and evidence-first.

## Pattern

The selected orchestration pattern is a deterministic sequential workflow.

```text
Citizen Request
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
Human Approval