# Architecture

## Overview

Government Services Copilot is implemented as a TypeScript application using
Clean/Hexagonal Architecture principles.

The architecture separates:

- Domain rules and types
- Application use cases and ports
- Infrastructure adapters
- HTTP delivery
- Persistence
- Evaluation and security controls

The goal is to keep business logic independent from the web framework,
database, retrieval implementation, and future LLM providers.

## C4 Level 1 — System Context

The main actors are:

- Citizen
- Government Officer
- Administrator

The system receives citizen service requests, retrieves grounded government
evidence, executes a multi-step workflow, drafts an official response, and
requires officer approval before finalization.

External dependencies include:

- Government document corpus
- OCR provider
- Retrieval implementation
- Document exporter
- SQLite persistence

## C4 Level 2 — Container View

### HTTP API

Fastify exposes the application capabilities through HTTP endpoints.

Responsibilities:

- Receive citizen requests
- Submit officer approval decisions
- Inspect workflow runs
- Expose health information
- Expose API documentation

### Application Layer

The application layer contains use cases and ports.

Main use cases:

- ProcessCitizenRequestUseCase
- ApproveCitizenResponseUseCase
- ExportOfficialResponseUseCase
- GetWorkflowRunUseCase

### Domain Layer

The domain layer contains typed business concepts such as:

- CitizenRequest
- Service
- EligibilityFinding
- ProcedureFinding
- OfficialResponse
- Citation
- WorkflowState
- ApprovalDecision
- OcrDocument
- OcrPage
- DocumentChunk

### Infrastructure Layer

Infrastructure adapters implement application ports.

Examples:

- LocalDocumentRetriever
- EligibilityAgentImpl
- ProcedureAgentImpl
- ResponseDrafterImpl
- MockOcrProvider
- DocumentProcessor
- DocxDocumentExporter
- SQLite repositories

## C4 Level 3 — Application Flow

The main request workflow is:

```text
Citizen
   |
   v
POST /requests
   |
   v
ProcessCitizenRequestUseCase
   |
   +--> Prompt Injection Detector
   |
   +--> Eligibility Agent
   |       |
   |       +--> Document Retriever
   |       +--> Citations
   |
   +--> Procedure Agent
   |       |
   |       +--> Document Retriever
   |       +--> Citations
   |
   +--> Response Drafter
   |
   v
Awaiting Approval
   |
   v
Officer
   |
   +--> Approve
   +--> Reject
   +--> Edit and Approve
   |
   v
Official Response / Export