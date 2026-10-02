# Government Services Copilot

An agentic RAG platform for government citizen services and regulations.

## Project Overview

Government Services Copilot helps government officers answer citizen-service
questions using grounded information retrieved from an approved corpus of
government regulations, procedures, and service documents.

The system is designed to:

- Identify the relevant government service.
- Determine eligibility based on documented rules.
- Resolve required procedures, documents, fees, and timelines.
- Draft an official response grounded in source documents.
- Require human approval before any response is finalized.
- Provide citations and an inspectable execution trace.

## Assessment Variant

- Domain: D4 — Government Services & Regulations
- Twist: T6 — Document In / Document Out
- Architecture: Agentic RAG
- Human Approval: Officer approval required before final response

## Core Agents

1. Eligibility Identifier
2. Procedure Resolver
3. Response Drafter
4. Orchestrator

## Core Principles

- Grounded answers only
- Source citations for claims
- Refusal when evidence is insufficient
- Human-in-the-loop approval
- Inspectable agent execution
- Provider-independent LLM architecture
- Security and evaluation as first-class concerns

## Documentation

Project documentation will be maintained under `docs/`.

Key documents include:

- Business Requirements Document
- System Design
- Architecture Decision Records
- Security documentation
- Evaluation methodology
- Agentic development workflow
- AI usage log

## Status

🚧 Initial project setup