# System Design

## Government Services Copilot

**ITI Technical Instructor — Post-Graduate Training**  
**Technical Assessment — Domain D4 + Twist T6**

**Domain:** D4 — Government: Citizen Services & Regulations  
**Twist:** T6 — Document In / Document Out  
**System Type:** Evidence-Grounded Agentic RAG Platform  
**Document Status:** MVP System Design  
**Version:** 1.0

---

# 1. Purpose

This document describes the system architecture and technical design of the Government Services Copilot.

The design is intentionally divided into two parts:

- **Part A — Target Architecture:** the architecture appropriate for a production-scale implementation without MVP constraints.
- **Part B — Implemented MVP:** the architecture and components actually implemented in the assessment repository.

This separation is important because the MVP prioritizes:

- Evidence grounding.
- Traceability.
- Human approval.
- Security controls.
- Testability.
- Demonstrable T6 document input/output.
- Clean architecture.
- Fast and reproducible local execution.

Production-scale concerns such as managed vector infrastructure, horizontal scaling, distributed messaging, production OCR, and enterprise secrets management are documented as gaps rather than being represented as implemented features.

---

# 2. Design Principles

The system follows the following principles.

## 2.1 Evidence Before Generation

The system should retrieve supporting evidence before generating a response.

The response must not present unsupported information as established government policy or eligibility information.

---

## 2.2 Refuse When Evidence Is Insufficient

If the approved corpus does not contain enough evidence to answer a request, the system must explicitly refuse instead of guessing.

The expected user-facing behavior is:

> Not enough information in the corpus.

---

## 2.3 Human-in-the-Loop

The system is a decision-support tool.

It does not replace the authority of the Government Service Officer.

A generated response must pass through an explicit approval gate before it can become an approved response or be exported as an official response.

---

## 2.4 Least Privilege for Agents

Each agent has a narrowly defined responsibility.

Agents should only access the tools and information required for their role.

The workflow orchestrator controls execution rather than allowing unrestricted autonomous agent actions.

---

## 2.5 Provider Independence

Application and domain logic must not directly depend on:

- LLM SDKs.
- Vector database SDKs.
- OCR vendor SDKs.
- HTTP framework implementation details.

Provider-specific behavior belongs behind application ports and infrastructure adapters.

---

## 2.6 Traceability

A workflow run must be identifiable and inspectable.

The design therefore treats run IDs, retrieved evidence, citations, agent execution, approval actions, errors, and model usage as important operational information.

---

# 3. System Context

The Government Services Copilot receives a citizen-service request and assists a Government Service Officer in producing an evidence-grounded response.

The high-level interaction is:

```text
+-------------------+
|      Citizen      |
+---------+---------+
          |
          | Service request / situation
          v
+--------------------------------+
| Government Services Copilot    |
|                                |
| Retrieval + Agents +           |
| Evidence + Approval Workflow   |
+---------------+----------------+
                |
                | Drafted response
                v
+-------------------+
| Government       |
| Service Officer  |
+---------+---------+
          |
          | Approve / Reject /
          | Edit and Approve
          v
+-------------------+
| Approved Response |
+---------+---------+
          |
          v
     DOCX / PDF
```

The system is explicitly designed as a **decision-support system rather than an autonomous governmental decision-maker**.

---

# 4. Part A — Target Architecture

## 4.1 Target Architecture Overview

A production-scale implementation would separate the public API, workflow execution, retrieval, document processing, persistence, observability, and infrastructure services.

```text
                         +----------------------+
                         | Citizen / Officer UI |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | API Gateway / WAF    |
                         | TLS + Rate Limiting  |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Application API     |
                         +----------+-----------+
                                    |
                         +----------+-----------+
                         |                      |
                         v                      v
                +----------------+     +----------------+
                | Workflow Queue |     | Document Queue |
                | / Broker       |     | / Ingestion    |
                +-------+--------+     +-------+--------+
                        |                      |
                        v                      v
                +---------------+      +---------------+
                | Workflow      |      | Document      |
                | Workers       |      | Workers       |
                +-------+-------+      +-------+-------+
                        |                      |
                        +----------+-----------+
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
           +------------------+          +------------------+
           | Managed Vector DB|          | Relational DB    |
           | Embeddings       |          | Runs / Audit     |
           | Retrieval        |          | Users / Metadata |
           +------------------+          +------------------+
                    |
                    v
           +------------------+
           | Approved Corpus  |
           | Object Storage   |
           +------------------+

              +-------------------------+
              | LLM / Embedding Providers|
              +-------------------------+

              +-------------------------+
              | Observability Platform  |
              | Logs / Metrics / Traces |
              +-------------------------+

              +-------------------------+
              | Secrets Manager         |
              +-------------------------+
```

---

# 5. Target Gateway and API Layer

A production deployment should place the application behind an API Gateway and Web Application Firewall.

Responsibilities include:

- TLS termination.
- Authentication integration.
- Request validation.
- Rate limiting.
- Abuse protection.
- Request size limits.
- Correlation ID propagation.
- API versioning.
- WAF protections.

The gateway should prevent excessive requests from reaching expensive LLM-backed workflows.

---

# 6. Target Rate Limiting and Abuse Protection

Rate limiting should exist at multiple levels.

## 6.1 User-Level Limits

Limit requests per authenticated user.

## 6.2 IP-Level Limits

Protect unauthenticated or public endpoints from basic abuse.

## 6.3 Workflow-Level Limits

Limit expensive AI workflow executions.

## 6.4 Token / Cost Limits

Each workflow should have configurable limits for:

- Maximum input tokens.
- Maximum output tokens.
- Maximum number of agent iterations.
- Maximum retries.
- Maximum estimated cost.

The MVP does not provide distributed managed rate limiting. The production target would use gateway or managed infrastructure capable of enforcing limits consistently across multiple application instances.

---

# 7. Target Secrets Management

Production credentials should not be stored directly in source code or committed environment files.

A production implementation should use an enterprise secrets manager for:

- LLM API keys.
- Database credentials.
- Object storage credentials.
- Signing secrets.
- Internal service credentials.

Applications should retrieve secrets at runtime using workload identity or equivalent secure mechanisms.

The repository should only contain placeholders in `.env.example`.

---

# 8. Target Message Broker

A production implementation should use asynchronous messaging for long-running workflows.

Potential queues include:

```text
Document Ingestion Queue
        |
        v
OCR / Extraction Workers
        |
        v
Chunking / Embedding Workers
        |
        v
Indexing

Workflow Queue
        |
        v
Agent Orchestrator Workers
```

Benefits include:

- Retry isolation.
- Backpressure.
- Horizontal scaling.
- Long-running job handling.
- Failure recovery.
- Decoupling API requests from expensive processing.

The MVP uses synchronous application workflow execution because the demonstration workload does not require distributed workers.

---

# 9. Target Autoscaling

Production workflow workers should scale independently from the API layer.

Example:

```text
API Instances
     |
     v
Workflow Queue
     |
     +----> Worker 1
     +----> Worker 2
     +----> Worker 3
     +----> Worker N
```

Scaling signals could include:

- Queue depth.
- Request latency.
- CPU utilization.
- Memory utilization.
- Active workflow count.

Document ingestion workers may use a separate scaling policy because OCR and embedding workloads have different resource requirements.

---

# 10. Target Caching

Caching can be introduced at several levels.

## 10.1 Retrieval Cache

Cache repeated retrieval requests where the underlying corpus version has not changed.

## 10.2 Document Metadata Cache

Frequently accessed document metadata can be cached.

## 10.3 Configuration Cache

Stable configuration and prompt metadata can be cached.

## 10.4 Embedding Cache

Repeated content should not necessarily require repeated embedding calls.

Caching must be version-aware so that stale evidence is not accidentally presented as current evidence.

---

# 11. Target Vector Database

The production target is a managed vector database supporting:

- Dense embeddings.
- Metadata filtering.
- Version filtering.
- Similarity search.
- Namespace or tenant isolation where required.
- Scalable indexing.

The vector database should store references to authoritative source documents rather than becoming the only source of truth.

The relational/document metadata store remains responsible for authoritative document metadata and lifecycle state.

---

# 12. Target Relational Database

A production relational database should persist:

- Users.
- Roles.
- Documents.
- Document versions.
- Chunks.
- Workflow runs.
- Agent executions.
- Retrieved evidence.
- Approvals.
- Audit events.
- Token/cost information.

Migrations should be version controlled.

---

# 13. Target Object Storage

Original documents should be stored separately from processed chunks.

Object storage can hold:

- Uploaded PDFs.
- Original source documents.
- Generated DOCX files.
- Generated PDF files.
- OCR artifacts where appropriate.

The relational database stores references and metadata rather than large binary documents.

---

# 14. Target Observability

A production system should use centralized observability.

The observability platform should capture:

### Logs

- Authentication events.
- Authorization failures.
- Ingestion failures.
- Workflow errors.
- Agent errors.
- Export events.

### Metrics

- Request latency.
- Retrieval hit rate.
- Workflow duration.
- OCR success rate.
- Token usage.
- Estimated cost.
- Error rate.
- Queue depth.

### Distributed Traces

A trace should connect:

```text
HTTP Request
    |
    +--> Workflow
          |
          +--> Eligibility Agent
          |
          +--> Procedure Agent
          |
          +--> Retrieval
          |
          +--> Response Drafter
          |
          +--> Approval
          |
          +--> Export
```

---

# 15. Target CI/CD and Environments

A production implementation should separate:

```text
Development
     |
     v
CI Validation
     |
     v
Test / Staging
     |
     v
Production
```

Every pull request should run automated checks including:

- Type checking.
- Build.
- Tests.
- Linting where configured.
- Dependency scanning.
- Secret scanning.
- Security checks.

Production deployment should require successful CI and appropriate approval.

---

# 16. Target Backup and Disaster Recovery

Production data should have:

- Automated database backups.
- Document/object-storage versioning.
- Backup retention policies.
- Recovery procedures.
- Periodic restore testing.

Critical audit records should be protected against accidental deletion.

A production deployment should define:

- RPO — Recovery Point Objective.
- RTO — Recovery Time Objective.

The exact values should be selected according to organizational requirements rather than assumed for the MVP.

---

# 17. Target Cost Model

The primary variable costs are expected to be:

1. LLM inference.
2. Embedding generation.
3. OCR processing.
4. Vector database usage.
5. Object storage.
6. Relational database.
7. Compute.
8. Observability/log storage.

The cost model should track:

```text
Cost per workflow
    =
LLM input cost
+ LLM output cost
+ embedding cost
+ OCR cost
+ infrastructure allocation
```

The system should enforce token and iteration limits because unbounded agent execution can directly increase cost.

The MVP records token/cost information where available and focuses on demonstrating the accounting model rather than production billing infrastructure.

---

# 18. Part B — Implemented MVP Architecture

## 18.1 MVP Architecture Overview

The implemented MVP uses a local TypeScript application with Clean/Hexagonal Architecture.

```text
+-----------------------------+
| Browser / Minimal UI        |
| public/index.html           |
+--------------+--------------+
               |
               v
+-----------------------------+
| Fastify HTTP API            |
+--------------+--------------+
               |
               v
+-----------------------------+
| Application Layer           |
| Use Cases + Ports           |
+--------------+--------------+
               |
        +------+------+
        |             |
        v             v
+---------------+ +---------------+
| Domain        | | Infrastructure|
| Business      | | Adapters      |
| Types/Rules   | | Agents/RAG    |
+---------------+ +-------+-------+
                         |
              +----------+----------+
              |          |          |
              v          v          v
          Retriever    OCR       DOCX
              |        Provider   Exporter
              |
              v
       Local Evidence / Chunks

               |
               v
        SQLite Persistence
```

---

# 19. Implemented Architectural Layers

## 19.1 Domain Layer

The domain layer contains business concepts and typed contracts.

Examples include:

- `CitizenRequest`
- `EligibilityFinding`
- `ProcedureFinding`
- `OfficialResponse`
- `Citation`
- `WorkflowState`
- `ApprovalDecision`
- `OcrDocument`
- `OcrPage`
- `DocumentChunk`

The domain does not depend on Fastify, a specific LLM SDK, or a specific vector database.

---

## 19.2 Application Layer

The application layer contains use cases and ports.

Examples include:

- `ProcessCitizenRequestUseCase`
- `ApproveCitizenResponseUseCase`
- `ExportOfficialResponseUseCase`
- `GetWorkflowRunUseCase`

Ports provide boundaries between application logic and infrastructure implementations.

---

## 19.3 Infrastructure Layer

Infrastructure contains adapters for external concerns.

Examples include:

- `LocalDocumentRetriever`
- `EligibilityAgentImpl`
- `ProcedureAgentImpl`
- `ResponseDrafterImpl`
- `MockOcrProvider`
- `DocumentProcessor`
- `DocxDocumentExporter`
- SQLite persistence
- HTTP server implementation

---

# 20. Implemented Workflow

The implemented workflow follows this structure:

```text
Citizen Request
      |
      v
Prompt Injection Detection
      |
      v
Eligibility Agent
      |
      +----> Local Document Retriever
      |             |
      |             v
      |       Evidence + Citations
      |
      v
Procedure Agent
      |
      +----> Local Document Retriever
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
DOCX Export
```

The approval state is intentionally explicit.

---

# 21. Retrieval Design — MVP

The MVP uses a `DocumentRetriever` application port with a local implementation.

The local implementation supports:

- Service-scoped retrieval.
- Keyword-based matching.
- Static evidence.
- Dynamically ingested document chunks.
- Citation generation.
- OCR confidence propagation where available.

The retriever returns:

```text
RetrievedEvidence
    |
    +-- content
    |
    +-- citations[]
          |
          +-- documentId
          +-- documentName
          +-- pageNumber
          +-- chunkId
          +-- excerpt
          +-- ocrConfidence
```

The implementation is deliberately behind an application-level retrieval port so that a managed vector database can be introduced later without changing the domain workflow.

---

# 22. Retrieval Enhancement — MVP

The MVP includes service scoping and evidence filtering as practical retrieval controls.

The retriever first verifies that the request refers to the supported service domain before returning evidence.

For example, a request about an unrelated service does not receive Social Status Certificate evidence merely because individual words happen to overlap.

This provides an additional guard against irrelevant retrieval and supports the required refusal behavior.

A future production implementation can replace this local strategy with hybrid dense + keyword retrieval and a formally evaluated ranking/fusion strategy.

---

# 23. OCR and Document Ingestion — MVP

The document ingestion architecture separates OCR behind an application/provider boundary.

The implemented MVP includes:

- OCR provider abstraction.
- Mock OCR provider.
- OCR document representation.
- Page-level information.
- OCR confidence.
- Document chunks.
- Ingestion processing.
- Low-confidence OCR handling.

The current OCR provider is intentionally a **mock provider for the assessment MVP**.

It demonstrates the architecture and confidence flow without claiming to provide production-grade scanned-PDF OCR.

A production implementation would replace the mock provider with an actual OCR adapter.

---

# 24. Document Output — MVP

The system supports document output through a document exporter abstraction.

The implemented workflow generates an approved response as a DOCX document.

The output contains structured response information and citations.

The approval gate prevents a normal workflow from treating an unapproved draft as an approved official response.

PDF generation is documented as a production/output extension where required by the deployment environment.

---

# 25. Human Approval Gate

The approval gate is a central safety boundary.

The workflow reaches:

```text
Awaiting Approval
```

before the response can be considered approved.

The officer can:

```text
Approve
Reject
Edit and Approve
```

Approval information is associated with the workflow/run.

This design ensures that the AI system prepares a proposed response while the officer retains final authority.

---

# 26. Prompt Injection Control

Prompt injection is treated as a security concern rather than an instruction-following feature.

The system includes prompt-injection detection before normal workflow processing.

The design also limits the authority of individual agents.

An agent's retrieved evidence does not automatically grant permission to:

- Modify system configuration.
- Execute arbitrary external actions.
- Bypass approval.
- Access unrelated protected information.

This follows the principle that retrieved text should be treated as data, not as trusted system instructions.

---

# 27. Run Trace and Observability — MVP

Each workflow is associated with a run identifier.

The trace model is intended to expose:

```text
Run
 |
 +-- Request
 |
 +-- Orchestrator
 |
 +-- Agent executions
 |     |
 |     +-- Eligibility
 |     +-- Procedure
 |     +-- Response Drafter
 |
 +-- Retrieval
 |     |
 |     +-- Evidence
 |     +-- Citations
 |
 +-- Approval
 |
 +-- Export
```

The evaluation and demonstration workflows use these records to inspect system behavior.

---

# 28. Data Design — MVP

The conceptual data model contains:

```text
Document
   |
   +----< DocumentChunk
   |
   +----< DocumentVersion

WorkflowRun
   |
   +----< AgentExecution
   |
   +----< Approval
   |
   +----< Citation / Evidence
```

The key concepts include:

### Document

- ID
- Title
- Source
- Version
- Format
- Status
- Upload/processing information

### DocumentChunk

- Chunk ID
- Document ID
- Content
- Page
- Section/clause where available
- OCR confidence
- Creation metadata

### WorkflowRun

- Run ID
- User
- Request
- Status
- Start/completion information

### AgentExecution

- Run ID
- Agent
- Input
- Output
- Status
- Retry information
- Timing information

### Approval

- Run ID
- Approver
- Action
- Response version
- Timestamp
- Comment

---

# 29. Target vs Implemented Gap Analysis

The following table intentionally documents the difference between the production target and the assessment MVP.

| Target Component | MVP Status | Why Deferred | Interim Mitigation | Effort to Close |
|---|---|---|---|---|
| API Gateway / WAF | Partial | Local MVP does not require a separate gateway | Fastify validation and application-level controls | ~1–2 days |
| Managed Rate Limiting | Deferred | Distributed infrastructure is unnecessary for local assessment execution | Application-level abuse/token controls | ~4 hours + infrastructure cost |
| Enterprise Secrets Manager | Deferred | No production secrets infrastructure is required for local demo | Environment configuration and `.env.example` | ~2–4 hours |
| Message Broker | Deferred | Current workflow is short enough for synchronous execution | Application workflow and controlled execution | ~4–6 hours |
| Horizontal Autoscaling | Deferred | MVP is single-instance | Single-process deployment | ~1 day |
| Managed Vector Database | Deferred | Local retrieval is sufficient to demonstrate evidence grounding | `DocumentRetriever` abstraction + local retrieval | ~4–6 hours + service cost |
| Dense Embeddings | Partial | Retrieval MVP focuses on deterministic local evidence retrieval | Retrieval abstraction | ~4–8 hours |
| Production Hybrid Retrieval | Partial | Local keyword/service-scoped retrieval is used for reproducibility | Retrieval port isolates implementation | ~1 day |
| Retrieval Enhancement | Partial | MVP uses service scoping/evidence filtering | Explicit retrieval constraints | ~4–8 hours for production ranking enhancement |
| Real OCR | Deferred | Assessment uses a mock OCR provider | OCR provider abstraction + confidence model | ~4 hours + provider cost |
| Object Storage | Deferred | Local files are sufficient for the assessment | Local document handling | ~4–8 hours |
| Production Observability Stack | Partial | Full distributed observability is unnecessary for MVP | Run IDs, traces, evaluation data | ~1–2 days |
| Production RBAC | Partial | Assessment demonstrates officer/admin concepts without enterprise identity infrastructure | Server-side authorization boundaries and approval checks | ~1 day |
| Multi-region Deployment | Deferred | Explicitly outside MVP | Documented production architecture | Several days/weeks depending on platform |
| Disaster Recovery | Deferred | Production infrastructure is outside MVP | Backup/DR design documented | ~1–2 days |
| Advanced Analytics | Deferred | Not required for core workflow | Evaluation metrics and run inspection | ~1–3 days |
| Production PDF Pipeline | Partial | DOCX demonstrates the T6 document-output path | Exporter abstraction | ~4–8 hours |

Effort estimates are engineering estimates for closing the architectural gap, not vendor quotations.

---

# 30. Significant Design Decisions

## ADR-001 — Clean / Hexagonal Architecture

### Decision

Use domain, application, and infrastructure boundaries with application ports for external capabilities.

### Alternatives Considered

A framework-centric architecture where business logic is placed directly inside HTTP controllers or infrastructure services.

### Why Rejected

That approach would tightly couple business rules to Fastify, retrieval implementation, and provider SDKs.

The assessment explicitly values maintainability and provider independence.

---

## ADR-002 — Port-Based Retrieval

### Decision

Expose retrieval through an application-level `DocumentRetriever` port.

### Alternatives Considered

Directly using a vector database SDK from agents.

### Why Rejected

Direct SDK usage would make the agents dependent on a specific storage technology and would make testing harder.

The current local retriever can therefore be replaced later with a managed vector implementation.

---

## ADR-003 — Controlled Multi-Agent Workflow

### Decision

Use an explicit orchestrator coordinating:

1. Eligibility Identifier.
2. Procedure Resolver.
3. Response Drafter.

### Alternatives Considered

A single unrestricted agent with access to all tools.

### Why Rejected

A single unrestricted agent makes responsibility boundaries unclear and increases excessive-agency risk.

The explicit workflow also makes each stage observable and testable.

---

## ADR-004 — Human Approval Before Export

### Decision

Require explicit officer approval before a response becomes an approved response or is exported as an official response.

### Alternatives Considered

Automatic finalization after successful generation.

### Why Rejected

Government-service responses can affect eligibility, requirements, and citizen decisions.

The system is intended as decision support rather than an autonomous governmental authority.

Human approval is therefore a safety and governance boundary rather than merely a UI feature.

---

## ADR-005 — Local Retrieval for MVP

### Decision

Use deterministic local retrieval behind a retrieval port for the assessment MVP.

### Alternatives Considered

Immediately introducing a managed vector database and embedding infrastructure.

### Why Rejected

The assessment requires reproducibility, traceability, and a demonstrable working system.

Introducing distributed infrastructure during the MVP would add operational complexity without materially improving the core demonstration of:

- Evidence grounding.
- Refusal.
- Citations.
- Agent orchestration.
- Human approval.

The abstraction keeps the migration path open.

---

## ADR-006 — Mock OCR Behind Provider Boundary

### Decision

Use a mock OCR provider for the MVP while preserving OCR confidence and page/chunk structures.

### Alternatives Considered

Integrating a production OCR vendor directly into the core application.

### Why Rejected

The T6 architecture is more important to demonstrate than coupling the domain to a specific OCR vendor.

The provider boundary allows a real OCR service to be introduced later without redesigning the domain model.

---

## ADR-007 — DOCX as the Demonstrated Output Path

### Decision

Use an exporter abstraction and demonstrate approved-response generation through DOCX.

### Alternatives Considered

Building a complete production PDF rendering pipeline during the assessment.

### Why Rejected

DOCX is sufficient to demonstrate the Document Out requirement while keeping the implementation focused on the approval, citation, and traceability workflow.

PDF generation remains an extension of the exporter boundary.

---

# 31. Failure and Degradation Strategy

The workflow should fail safely.

## No Evidence

```text
Retrieval
   |
   v
No sufficient evidence
   |
   v
Insufficient Evidence
   |
   v
Refuse / Escalate
```

The system must not fabricate an answer.

---

## Ambiguous Eligibility

```text
Evidence
   |
   v
Eligibility Uncertain
   |
   v
Human Review
```

---

## Agent Failure

A failed agent must not silently produce fabricated output.

The workflow should record:

- Agent.
- Error.
- Run ID.
- Step.
- Retry state.

Where safe, the workflow may degrade to a simpler evidence-grounded response rather than presenting an unsupported multi-agent conclusion.

---

## OCR Failure

OCR failure should be represented as an ingestion failure or low-confidence condition rather than silently treating missing text as authoritative evidence.

---

# 32. Security Boundaries

The primary trust boundaries are:

```text
[Citizen / Browser]
        |
        | Untrusted input
        v
[HTTP API]
        |
        | Validated request
        v
[Application Workflow]
        |
        +----> [Retriever]
        |          |
        |          v
        |      [Corpus]
        |
        +----> [Agents / Model Provider]
        |
        v
[Approval Boundary]
        |
        v
[Document Export]
```

Important security rules:

1. User input is untrusted.
2. Retrieved documents are data, not trusted instructions.
3. Agent capabilities are restricted.
4. Approval is enforced server-side.
5. Secrets are never embedded in prompts.
6. Sensitive information should not be unnecessarily sent to external model providers.
7. Document output must originate from an approved workflow state.

---

# 33. What the LLM Provider Should Receive

In a production implementation, the model provider should receive only the minimum information required for the current task.

Depending on the agent, this can include:

```text
System instructions
+
Citizen request
+
Relevant retrieved evidence
+
Citation metadata
+
Structured outputs from previous workflow steps
```

The model should not automatically receive:

- Application secrets.
- Database credentials.
- Unrelated citizen records.
- Unrelated documents.
- Internal administrative configuration.
- Arbitrary tool outputs unrelated to the current task.

This supports data minimization and reduces the impact of prompt injection or accidental disclosure.

---

# 34. Layer Dependency Rule

The intended dependency direction is:

```text
+-----------------------------+
| Infrastructure / HTTP / DB  |
+-------------+---------------+
              |
              v
+-----------------------------+
| Application / Use Cases      |
| Ports / Contracts            |
+-------------+---------------+
              |
              v
+-----------------------------+
| Domain                       |
| Business Types / Rules       |
+-----------------------------+
```

The domain must not depend on infrastructure.

The application layer defines contracts for infrastructure capabilities.

Infrastructure implements those contracts.

---

# 35. Scaling Path

The recommended migration path from MVP to production is incremental.

## Stage 1 — Current MVP

```text
Fastify
  +
Application Workflow
  +
Local Retrieval
  +
SQLite
  +
Mock OCR
  +
DOCX Export
```

## Stage 2 — Production Provider Integration

Replace:

```text
Mock OCR
    -> Real OCR Provider

Local Retrieval
    -> Dense + Keyword Retrieval

Local Storage
    -> Managed Relational/Object Storage
```

Keep the application ports unchanged.

---

## Stage 3 — Distributed Execution

Introduce:

```text
API
 |
 v
Message Broker
 |
 +--> Workflow Workers
 |
 +--> Document Workers
```

Add:

- Distributed rate limiting.
- Managed secrets.
- Horizontal scaling.
- Centralized observability.

---

## Stage 4 — Production Resilience

Add:

- Backups.
- Disaster recovery.
- Multi-zone deployment.
- Restore testing.
- Provider fallback.
- Advanced monitoring.
- Cost budgets.

---

# 36. Known Expedient Decisions

The following decisions were intentionally made to keep the assessment MVP reproducible and demonstrable.

## 36.1 Local Retrieval

A local deterministic retriever was preferred over introducing a full managed vector stack.

This reduces setup complexity and makes the evidence path easy to inspect.

The trade-off is that it does not represent production-scale semantic retrieval.

---

## 36.2 Mock OCR

The OCR provider is abstracted, but the assessment implementation uses a mock provider.

This demonstrates the document-processing architecture and confidence handling without pretending that production OCR has been implemented.

---

## 36.3 Local Persistence

Local persistence is sufficient for a single-instance assessment environment.

A production deployment would use managed relational storage and object storage with backup policies.

---

## 36.4 Limited Production Infrastructure

The assessment focuses on correctness, security boundaries, evaluation, and explainability.

Distributed infrastructure was therefore documented as a target architecture rather than added solely for architectural appearance.

---

# 37. Implementation-to-Requirement Traceability

The main design areas map to the BRD as follows.

| BRD Area | System Design Evidence |
|---|---|
| BR-01 Evidence Grounding | Retrieval + citations |
| BR-02 No Unsupported Claims | Insufficient-evidence refusal |
| BR-03 Ambiguous Eligibility | Eligibility uncertainty + approval |
| BR-04 Conflicting Sources | Version-aware target design |
| BR-05 Human Approval | Approval gate |
| BR-07 Tool Authorization | Least-privilege agent design |
| BR-09 OCR Confidence | OCR provider + confidence model |
| FR-01 Document Ingestion | Document processor + ingestion architecture |
| FR-02 OCR | OCR provider abstraction |
| FR-04 Hybrid Retrieval | Target dense + keyword architecture |
| FR-06 Grounded QA | Evidence-first workflow |
| FR-07 Correct Refusal | Retrieval refusal path |
| FR-08 Eligibility Agent | Eligibility agent |
| FR-09 Procedure Resolver | Procedure agent |
| FR-10 Response Drafter | Response drafter |
| FR-11 Orchestration | Explicit orchestrator |
| FR-12 Approval Gate | Awaiting Approval state |
| FR-13 Document Output | Exporter abstraction + DOCX |
| FR-17 Observability | Run ID and execution trace |
| FR-18 API/UI | Fastify + minimal web interface |
| NFR-02 Maintainability | Clean/Hexagonal Architecture |
| NFR-03 Provider Independence | Application ports |
| NFR-04 Reliability | Controlled workflow boundaries |
| NFR-05 Observability | Run traces |
| NFR-06 Reproducibility | Local MVP setup |
| NFR-07 Testability | Port-based infrastructure boundaries |

The final implementation status of each requirement remains governed by the BRD traceability matrix and verification evidence.

---

# 38. Production Readiness Gaps

The most important remaining gaps between the assessment MVP and a production deployment are:

1. Production OCR.
2. Dense embedding infrastructure.
3. Production hybrid retrieval.
4. Managed vector database.
5. Distributed rate limiting.
6. Enterprise secrets management.
7. Message broker and asynchronous workers.
8. Horizontal scaling.
9. Production identity and RBAC integration.
10. Centralized observability.
11. Backup and disaster recovery.
12. Production-grade PDF generation.
13. Full production CI/CD environment separation.
14. Operational cost controls.

These are architectural extensions rather than reasons to weaken the current evidence-grounding and human-approval boundaries.

---

# 39. Final Architecture Principle

The most important design decision is not the choice of vector database, OCR vendor, or cloud platform.

The central principle is:

```text
Evidence
   ↓
Controlled Analysis
   ↓
Traceable Draft
   ↓
Human Review
   ↓
Approved Output
```

The system should optimize for **correctness, evidence, traceability, controlled authority, and reviewability** before optimizing for autonomous behavior or infrastructure scale.

When evidence exists, the system should make it easy to find and understand.

When evidence is uncertain, the system should make that uncertainty visible.

When evidence does not exist, the system should refuse rather than guess.

When an official response is generated, the officer must remain in control of the final decision.