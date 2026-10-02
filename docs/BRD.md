
# Business Requirements Document (BRD)

## Government Services Copilot

**ITI Technical Instructor — Post-Graduate Training**  
**Technical Assessment — Domain D4 + Twist T6**

**Domain:** D4 — Government: Citizen Services & Regulations  
**Twist:** T6 — Document In / Document Out  
**System Type:** Evidence-Grounded Agentic RAG Platform  
**Document Status:** MVP Specification  
**Version:** 1.0

---

# 1. Executive Summary

Government service officers frequently need to consult multiple official regulations, service guides, procedural documents, and policy references before responding to a citizen's request.

The process of identifying the appropriate service, checking eligibility, determining required documents, verifying fees and processing timelines, and preparing an official response can require navigating multiple documents and sources.

A conventional Large Language Model (LLM) assistant introduces a significant risk in this context: it may generate plausible but unsupported information.

The **Government Services Copilot** addresses this problem through an evidence-grounded Retrieval-Augmented Generation (RAG) platform combined with a controlled multi-agent workflow.

The system retrieves relevant information from an approved government-services corpus and uses specialized agents to:

1. Identify the relevant government service.
2. Determine eligibility and identify ambiguity.
3. Resolve required procedures, documents, fees, and timelines.
4. Draft an official response grounded in retrieved evidence.

The generated response must contain traceable citations to the source material. When the available evidence is insufficient, the system must explicitly state that there is not enough information in the corpus rather than guessing.

The final response cannot be issued automatically. A **Government Service Officer must explicitly approve the generated response** before it can be finalized or exported.

The T6 twist extends the system with document input and output capabilities. The platform supports OCR processing of scanned PDFs with confidence handling and generates professionally formatted DOCX/PDF outputs containing citations and structured tables.

The system is therefore designed as a **decision-support tool rather than an autonomous government decision-maker**.

---

# 2. Problem Statement

Government service officers may need to search across multiple documents to answer a single citizen request.

The information required to answer a request may include:

- Applicable government service.
- Eligibility conditions.
- Required documents.
- Fees.
- Expected processing time.
- Procedural steps.
- Exceptions or restrictions.
- Relevant regulations or clauses.

Manual searching can be time-consuming and can increase the possibility of overlooking relevant information.

Using a general-purpose LLM without grounded retrieval creates a more serious problem: the model may produce information that sounds authoritative but is not supported by the official corpus.

For a government-service scenario, unsupported claims about an individual's eligibility, obligations, or entitlements are unacceptable.

The proposed system therefore requires:

- Evidence-grounded retrieval.
- Explicit source citations.
- Confidence-aware document processing.
- Specialized agents with restricted responsibilities.
- Human approval before issuing a response.
- Complete execution traces.
- Correct refusal when sufficient evidence is unavailable.

---

# 3. Product Vision

The **Government Services Copilot** will provide government service officers with an evidence-grounded assistant that transforms citizen requests and government documents into traceable, reviewable, and professionally formatted responses.

The system will help officers:

- Find the relevant service.
- Determine eligibility based on available evidence.
- Resolve procedures and requirements.
- Identify uncertainty and ambiguity.
- Draft an official response.
- Review supporting evidence.
- Approve, reject, or edit the proposed response.
- Export the approved response as DOCX/PDF.

The system will **assist the officer but will not replace the officer's authority or final judgment**.

---

# 4. Business Objectives

## BO-01 — Reduce Information Search Effort

Reduce the manual effort required for officers to locate relevant service and regulation information across the approved corpus.

### Success Indicator

A complete workflow should retrieve relevant evidence and present it with citations without requiring the officer to manually search every source document.

---

## BO-02 — Improve Evidence Grounding

Ensure that generated claims are traceable to retrieved source chunks.

### Success Indicator

The evaluation harness measures groundedness and citation correctness, and unsupported claims are identified or refused.

---

## BO-03 — Prevent Unsupported Decisions

Prevent the system from presenting unsupported eligibility, obligations, or entitlements as established facts.

### Success Indicator

Low-evidence and ambiguous cases trigger a refusal or escalation instead of unsupported generation.

---

## BO-04 — Preserve Human Control

Ensure that the officer retains control over the final response.

### Success Indicator

A generated response cannot be finalized or exported as an official response until an authorized officer explicitly approves it.

---

## BO-05 — Provide Auditable AI Workflows

Make every workflow execution inspectable.

### Success Indicator

A run ID allows authorized users to inspect the orchestrator, agent steps, tools, retrieved chunks, citations, token usage, costs, and approval actions.

---

## BO-06 — Support Document-Based Government Workflows

Allow government documents to enter the system and allow approved responses to be generated in professional document formats.

### Success Indicator

The system supports scanned PDF OCR with confidence information and generates structured DOCX/PDF output containing citations and tables.

---

# 5. Stakeholders

| Stakeholder | Interest / Responsibility |
|---|---|
| Government Service Officer | Uses the system and approves final responses |
| System Administrator | Manages users, roles, documents, configuration, and system health |
| Technical / Platform Team | Maintains application, infrastructure, integrations, and observability |
| Compliance / Audit Stakeholder | Reviews traceability, access, and audit records |
| Citizen | Indirect beneficiary; receives the officer-approved response |
| AI System | Performs retrieval, classification, analysis, and drafting under defined constraints |

---

# 6. Personas

## P-01 — Government Service Officer

The primary user.

The officer needs to:

- Submit a citizen situation/request.
- Identify the relevant service.
- Review eligibility evidence.
- Review required documents, fees, and timelines.
- Inspect citations.
- Review generated response.
- Edit or reject the response.
- Approve the response.
- Export the approved response.

### Primary Concern

The officer must be able to understand **why** the system produced the proposed answer.

---

## P-02 — System Administrator

Responsible for:

- User management.
- Role management.
- Corpus management.
- Document ingestion monitoring.
- System configuration.
- Health monitoring.
- Audit review.

### Primary Concern

The system must remain secure, observable, and operational.

---

## P-03 — Auditor / Reviewer

An authorized user responsible for reviewing system activity.

The auditor needs to inspect:

- Workflow runs.
- Agent execution.
- Retrieved evidence.
- Citations.
- Approval actions.
- Audit logs.
- Token/cost information.

---

# 7. Product Scope

## 7.1 In Scope

The MVP includes:

1. Government-service document ingestion.
2. PDF and at least one additional supported document format.
3. OCR for scanned PDFs.
4. OCR confidence tracking.
5. Document cleaning and chunking.
6. Metadata extraction.
7. Embedding and indexing.
8. Hybrid retrieval.
9. Citation generation.
10. Evidence-grounded question answering.
11. Correct low-evidence refusal.
12. Citizen-service workflow.
13. Service identification.
14. Eligibility analysis.
15. Procedure resolution.
16. Response drafting.
17. Human approval gate.
18. DOCX/PDF generation.
19. Multi-agent orchestration.
20. Tool execution with restricted permissions.
21. Run tracing.
22. Token and cost accounting.
23. Authentication and role-based access.
24. Streaming agent progress.
25. Evaluation harness.
26. Security controls.
27. Persistent session/run history.

---

## 7.2 Out of Scope

The following are explicitly outside the MVP:

- Direct submission of government applications to external government systems.
- Automatic approval or rejection of citizen applications.
- Autonomous legal or governmental decision-making.
- Sending an official response to a citizen without officer approval.
- Processing real citizen PII.
- Live integration with confidential government databases.
- Payment processing.
- Real-world identity verification.
- Fully autonomous agent actions without authorization.
- Production-scale multi-region deployment.
- Advanced analytics dashboards beyond the requirements needed for evaluation and observability.

---

# 8. Business Rules

## BR-01 — Evidence Grounding

Every factual claim presented as coming from the corpus must be traceable to one or more retrieved source chunks.

---

## BR-02 — No Unsupported Claims

If the corpus does not contain sufficient evidence, the system must not invent an answer.

The system must communicate:

> Not enough information in the corpus.

or an equivalent explicit refusal.

---

## BR-03 — Ambiguous Eligibility

If the available evidence is insufficient to determine whether a citizen is eligible, the workflow must flag the ambiguity and require human review.

---

## BR-04 — Conflicting Sources

If relevant documents contain conflicting information, the system must not silently choose one.

The conflict must be surfaced to the officer with the relevant citations and document/version metadata.

---

## BR-05 — Human Approval

A generated response cannot become an approved response without explicit officer approval.

---

## BR-06 — Approval Actions

The officer must be able to:

- Approve.
- Reject.
- Edit and approve.

Every action must be recorded in the audit trail.

---

## BR-07 — Tool Authorization

Agents may only invoke tools explicitly allowed for their role.

A write or side-effecting operation must never execute without the required approval.

---

## BR-08 — Source Version Awareness

Document version and source metadata must be retained so that the system can identify the evidence version used for an answer.

---

## BR-09 — OCR Confidence

Low-confidence OCR output must be flagged rather than silently treated as reliable source text.

---

## BR-10 — No Real Personal Data

The development and evaluation corpus must use public or synthetic information and must not contain real personal data.

---

# 9. Functional Requirements

The following requirements define the MVP capabilities. They are uniquely identified so that they can later be traced to implementation, tests, and evidence.

---

## FR-01 — Document Ingestion

**Requirement**

The system shall allow authorized users to ingest government-service documents into the corpus using at least two supported input formats.

The ingestion pipeline shall be composed of independently testable stages:

1. Extract.
2. Clean.
3. Chunk.
4. Embed.
5. Index.

Each document and generated chunk shall maintain source metadata including source, section, page/clause where applicable, and version.

### Acceptance Criteria

- At least two document formats are supported.
- Each ingestion stage can be tested independently.
- Documents receive a unique identifier.
- Chunks retain source-document metadata.
- Page/section/clause metadata is preserved where available.
- Re-ingesting the same document does not create uncontrolled duplicates.
- The system reports ingestion status.
- Failed ingestion is reported with an actionable error.
- Ingestion can be traced to a specific document and run.

---

## FR-02 — Scanned PDF OCR

**Requirement**

The system shall detect scanned PDFs that do not contain usable machine-readable text and perform OCR to extract text while preserving page-level metadata and OCR confidence information.

### Acceptance Criteria

- A scanned PDF can be uploaded.
- The system detects when normal text extraction is insufficient.
- OCR is automatically invoked.
- OCR text is associated with its source page.
- OCR confidence information is stored.
- Low-confidence OCR output is flagged.
- OCR failures are reported.
- OCR-derived chunks remain traceable to the original document and page.

---

## FR-03 — Document and Chunk Metadata

**Requirement**

The system shall maintain structured metadata for documents and chunks to support retrieval, citations, version tracking, and auditability.

### Acceptance Criteria

Each applicable chunk contains:

- Document ID.
- Document title.
- Source.
- Version.
- Page.
- Section/clause.
- Chunk ID.
- Ingestion timestamp.

OCR-enabled chunks additionally contain OCR confidence information where available.

---

## FR-04 — Hybrid Retrieval

**Requirement**

The system shall retrieve relevant evidence using a hybrid retrieval strategy combining semantic/dense retrieval and keyword-based retrieval.

The fusion strategy shall be documented and deterministic enough to be evaluated.

### Acceptance Criteria

- Dense retrieval is implemented.
- Keyword retrieval is implemented.
- Results are combined using a documented fusion method.
- Retrieved chunks include metadata.
- Retrieval results can be inspected through the run trace.
- Retrieval can be evaluated independently from generation.

---

## FR-05 — Retrieval Enhancement

**Requirement**

The system shall implement at least one justified retrieval enhancement beyond basic hybrid retrieval.

The selected enhancement shall be documented in the architecture and evaluation documentation.

### Acceptance Criteria

- One enhancement is implemented.
- The design explains why it was selected.
- Baseline and enhanced retrieval can be compared where practical.
- The enhancement does not bypass evidence-grounding requirements.

---

## FR-06 — Grounded Question Answering

**Requirement**

The system shall answer user questions using retrieved corpus evidence and shall provide structured citations for claims supported by the corpus.

### Acceptance Criteria

- The answer is generated from retrieved evidence.
- Citations identify the supporting document/chunk.
- Citations are visible to the user.
- Retrieved evidence is available in the trace.
- Unsupported information is not presented as established fact.

---

## FR-07 — Correct Refusal

**Requirement**

The system shall refuse to answer when the corpus does not contain sufficient evidence to support the requested claim.

### Acceptance Criteria

The system correctly refuses:

- Out-of-corpus questions.
- Questions with insufficient evidence.
- Ambiguous eligibility cases where the evidence is insufficient.
- Requests attempting to force unsupported conclusions.

The refusal behavior must be included in the evaluation harness.

---

## FR-08 — Service Identification Agent

**Requirement**

The Service Identification / Eligibility Identifier agent shall analyze the citizen's situation and identify the most relevant government service and applicable eligibility information using retrieved evidence.

### Acceptance Criteria

The agent:

- Receives a structured citizen situation.
- Uses only its permitted retrieval/tools.
- Identifies relevant services.
- Provides evidence supporting the identification.
- Identifies uncertainty.
- Escalates ambiguous eligibility cases.
- Does not invent eligibility rules.

---

## FR-09 — Procedure Resolver Agent

**Requirement**

The Procedure Resolver agent shall determine the applicable procedure, required documents, fees, and expected processing timelines using grounded evidence.

### Acceptance Criteria

The agent produces structured information for:

- Required documents.
- Fees.
- Processing time.
- Procedure steps.
- Applicable conditions.
- Exceptions where supported.

Each factual field must be traceable to evidence.

---

## FR-10 — Response Drafter Agent

**Requirement**

The Response Drafter agent shall generate a professional draft response based only on the evidence and structured outputs produced by the workflow.

### Acceptance Criteria

The response:

- Uses an appropriate official tone.
- Contains no unsupported claims.
- Includes citations.
- Clearly identifies uncertainty.
- Does not independently invent policy or requirements.
- Can be reviewed before approval.
- Can be transformed into DOCX/PDF output.

---

## FR-11 — Multi-Agent Orchestration

**Requirement**

The system shall contain an orchestrator coordinating at least three specialized agents:

1. Eligibility Identifier.
2. Procedure Resolver.
3. Response Drafter.

The orchestrator shall enforce defined inputs, outputs, permissions, termination conditions, retry behavior, and iteration limits.

### Acceptance Criteria

- All required agents exist.
- The orchestrator controls workflow execution.
- Agent inputs and outputs use defined contracts.
- Maximum iterations are enforced.
- Per-step timeout exists.
- Retry behavior uses controlled backoff.
- Failure can degrade gracefully to plain RAG where appropriate.
- Each step is recorded in the run trace.

---

## FR-12 — Human Approval Gate

**Requirement**

The system shall require explicit officer approval before a generated response can be finalized or exported as an approved response.

### Acceptance Criteria

The officer can:

- Approve.
- Reject.
- Edit and approve.

The system records:

- Approver identity.
- Action.
- Timestamp.
- Response version.
- Run ID.
- Relevant audit information.

A response cannot bypass the approval gate through a normal API call.

---

## FR-13 — Document Output

**Requirement**

The system shall generate professionally formatted DOCX and/or PDF output from an approved response.

The generated document shall contain appropriate citations and structured tables where applicable.

### Acceptance Criteria

- Approved response can be exported.
- Output contains response content.
- Citations are preserved.
- Tables are formatted correctly.
- Document metadata can identify the originating workflow/run.
- Unapproved drafts cannot be exported as approved official responses.

---

## FR-14 — Workflow Streaming and Cancellation

**Requirement**

The system shall provide real-time progress updates during workflow execution and support client cancellation.

### Acceptance Criteria

- Agent progress is streamed to the client.
- Current workflow step is visible.
- Token generation can be streamed where supported.
- Client cancellation is transmitted to the server.
- Server-side work actually stops after cancellation within defined limits.
- Cancelled runs are recorded as cancelled.

---

## FR-15 — Authentication and Role-Based Access Control

**Requirement**

The system shall authenticate users and enforce at least two roles with genuinely different permissions on the server side.

### Acceptance Criteria

At minimum:

- Officer role can execute workflows and approve responses.
- Administrator role can manage corpus/system administration.
- Unauthorized requests are rejected server-side.
- Approval permissions cannot be obtained through client-side manipulation.
- Authorization events are auditable.

---

## FR-16 — Evaluation Harness

**Requirement**

The system shall provide a runnable evaluation harness containing at least 25 golden question/answer pairs, including at least five adversarial cases.

The adversarial set shall include examples covering:

- Out-of-corpus requests.
- Ambiguous requests.
- Prompt injection.
- Conflicting sources.

### Acceptance Criteria

The harness reports at minimum:

- Retrieval hit-rate.
- Groundedness.
- Refusal correctness.

The system shall record actual baseline measurements and provide interpretation of failures.

---

## FR-17 — Run Trace and Observability

**Requirement**

Every workflow execution shall receive a unique run ID and provide an inspectable trace covering the request, orchestrator, agents, tools, retrieval results, citations, and model usage.

### Acceptance Criteria

A trace can identify:

- Run ID.
- Correlation ID.
- User.
- Orchestrator steps.
- Agent steps.
- Tool calls.
- Retrieved chunks.
- Citations.
- LLM/provider calls.
- Token usage.
- Estimated cost.
- Errors/retries.
- Approval actions.

---

## FR-18 — API and User Interface

**Requirement**

The system shall expose a documented HTTP API using an OpenAPI specification and provide a minimal interface covering the core workflow.

### Acceptance Criteria

The interface supports:

- Document ingestion.
- Asking questions.
- Viewing citations.
- Running the citizen-service workflow.
- Viewing live progress.
- Reviewing approval requests.
- Approving/rejecting/editing responses.
- Viewing run traces.
- Viewing persistent session history.

---

# 10. Non-Functional Requirements

## NFR-01 — Security

The system shall implement documented security controls covering:

- Broken access control.
- Cryptographic failures.
- Injection.
- Rate limiting / abuse protection.
- Security misconfiguration.
- Dependency security.
- Secret management.
- Audit logging.

The system shall also address relevant OWASP LLM risks including prompt injection, insecure output handling, excessive agency, unbounded consumption, and supply-chain risks.

---

## NFR-02 — Maintainability

The system shall follow a clean architectural structure with separation between:

- Domain.
- Application/use cases.
- Infrastructure.
- API/UI.

Business logic must not directly depend on LLM SDKs, vector database SDKs, or web-framework implementation details.

---

## NFR-03 — Provider Independence

LLM and embedding providers shall be accessed through application-level abstractions.

Changing provider should require configuration changes and/or an adapter rather than rewriting business logic.

---

## NFR-04 — Reliability

The workflow shall support:

- Timeouts.
- Controlled retries.
- Backoff.
- Maximum iteration limits.
- Graceful degradation.

---

## NFR-05 — Observability

The platform shall persist sufficient information to diagnose workflow behavior, including request correlation, agent execution, LLM usage, retrieval, errors, and cost.

---

## NFR-06 — Reproducibility

The repository shall provide a reproducible local environment through Docker Compose or an equivalent single-command setup.

---

## NFR-07 — Testability

LLM calls shall be stubbed in unit tests.

The project shall contain:

- Unit tests.
- Integration tests.
- Retrieval/ingestion tests.
- Contract tests for agent/tool schemas.

---

# 11. Agent Responsibility Matrix

| Agent | Responsibility | Allowed Capabilities | Output |
|---|---|---|---|
| Eligibility Identifier | Identify service and eligibility | Retrieval + approved analysis tools | Service + eligibility evidence |
| Procedure Resolver | Resolve documents, fees, timeline, procedure | Retrieval + approved analysis tools | Structured procedure |
| Response Drafter | Draft officer-facing response | Retrieved evidence + structured agent outputs | Draft response |
| Orchestrator | Coordinate workflow | Agent invocation + workflow control | Final workflow state |

The agents must not overlap in unrestricted authority. Each agent should have a narrowly defined role.

---

# 12. Approval Workflow

The intended workflow is:

```text
Citizen Situation
       |
       v
Orchestrator
       |
       v
Eligibility Identifier
       |
       v
Procedure Resolver
       |
       v
Evidence Validation
       |
       v
Response Drafter
       |
       v
Human Officer Review
       |
   +---+---+
   |       |
Reject   Edit
   |       |
   |       v
   |   Review Again
   |       |
   +--- Approve
           |
           v
   Approved Response
           |
           v
       DOCX / PDF
```

The human approval step is mandatory.

---

# 13. Document Input and Output Requirements

## Input

The system shall accept supported document formats including PDF and at least one additional format.

For scanned PDFs:

```text
Document
   ↓
PDF Detection
   ↓
Text Extraction Attempt
   ↓
Is usable text available?
   ├── Yes → Cleaning
   └── No  → OCR
                ↓
          OCR Confidence
                ↓
             Cleaning
```

Low-confidence OCR content must be explicitly marked.

---

## Output

The system shall generate a professionally formatted document containing:

- Case/request information.
- Identified service.
- Eligibility result or uncertainty.
- Required documents.
- Fees.
- Processing timeline.
- Procedure.
- Officer-facing response.
- Source citations.
- Relevant tables.

Only an approved response may be represented as an approved official response.

---

# 14. Data Requirements

## Document Entity

Required conceptual fields:

- `id`
- `title`
- `source`
- `version`
- `format`
- `status`
- `uploaded_at`
- `processed_at`

---

## Document Chunk Entity

Required conceptual fields:

- `id`
- `document_id`
- `content`
- `page`
- `section`
- `clause`
- `embedding_reference`
- `ocr_confidence`
- `created_at`

---

## Workflow Run Entity

Required conceptual fields:

- `run_id`
- `user_id`
- `correlation_id`
- `request`
- `status`
- `started_at`
- `completed_at`

---

## Agent Execution Entity

Required conceptual fields:

- `run_id`
- `agent`
- `input`
- `output`
- `status`
- `started_at`
- `completed_at`
- `retry_count`

---

## Approval Entity

Required conceptual fields:

- `run_id`
- `approver_id`
- `action`
- `response_version`
- `timestamp`
- `comment`

---

# 15. Assumptions

## AS-01

The initial corpus consists of public or synthetic government-service documents.

## AS-02

The system is a decision-support prototype and does not directly make legally binding governmental decisions.

## AS-03

Government documents are assumed to have identifiable source and version information where available.

## AS-04

OCR accuracy depends on scan quality and document characteristics.

## AS-05

The initial MVP will prioritize correctness, traceability, and evaluation over UI richness.

## AS-06

External government-system integrations are outside the MVP.

## AS-07

The selected LLM providers may be replaceable through the provider abstraction layer.

---

# 16. Risks

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R-01 | Hallucinated government information | Critical | Retrieval grounding + citations + refusal |
| R-02 | Incorrect OCR | High | OCR confidence + flagging + human review |
| R-03 | Ambiguous eligibility | High | Escalation to officer |
| R-04 | Conflicting documents | High | Version metadata + conflict surfacing |
| R-05 | Prompt injection | High | Input sanitization + privilege separation + evaluation |
| R-06 | Excessive agent authority | Critical | Tool allow-lists + approval gate |
| R-07 | High LLM cost | Medium | Token limits + accounting + model configuration |
| R-08 | Retrieval misses relevant evidence | High | Hybrid retrieval + evaluation + enhancement |
| R-09 | Unauthorized approval | Critical | Server-side RBAC |
| R-10 | Workflow loops | Medium | Maximum iteration breaker |
| R-11 | Provider outage | Medium | Provider fallback/degradation |
| R-12 | Sensitive information leakage | High | Synthetic/public corpus + PII controls + logging controls |

---

# 17. Success Metrics

The MVP will be evaluated using measurable technical and business-oriented metrics.

## Retrieval

- Retrieval hit-rate.
- Relevant evidence retrieval rate.
- Citation coverage.

## Generation

- Groundedness.
- Unsupported-claim rate.
- Correct refusal rate.

## Workflow

- Successful workflow completion rate.
- Approval-gate enforcement.
- Agent/tool execution trace completeness.

## Document Processing

- OCR extraction success rate.
- Low-confidence OCR detection rate.
- Generated document validity.

## Security

- Unauthorized action rejection.
- Prompt-injection evaluation results.
- Secret scanning status.
- Dependency scanning status.

## Operational

- Token consumption per request.
- Estimated cost per workflow.
- Workflow duration.
- Failure/retry rate.

The final `docs/EVALUATION.md` shall contain the actual measured results rather than target numbers alone.

---

# 18. Traceability Matrix

| Requirement | Status | Evidence |
|---|---|---|
| BR-01 Evidence Grounding | Implemented / Partial / Deferred | Retrieval + citation tests |
| BR-02 No Unsupported Claims | Implemented / Partial / Deferred | Refusal evaluation |
| BR-03 Ambiguous Eligibility | Implemented / Partial / Deferred | Agent workflow + adversarial test |
| BR-04 Conflicting Sources | Implemented / Partial / Deferred | Conflict scenario |
| BR-05 Human Approval | Implemented / Partial / Deferred | Approval API/UI + integration test |
| BR-06 Approval Actions | Implemented / Partial / Deferred | Audit records |
| BR-07 Tool Authorization | Implemented / Partial / Deferred | RBAC/tool policy tests |
| BR-08 Source Version Awareness | Implemented / Partial / Deferred | Metadata schema + citation |
| BR-09 OCR Confidence | Implemented / Partial / Deferred | OCR integration test |
| BR-10 No Real Personal Data | Implemented | Corpus audit |
| FR-01 Document Ingestion | Implemented / Partial / Deferred | Ingestion pipeline |
| FR-02 OCR | Implemented / Partial / Deferred | OCR tests |
| FR-04 Hybrid Retrieval | Implemented / Partial / Deferred | Retrieval implementation |
| FR-05 Retrieval Enhancement | Implemented / Partial / Deferred | Evaluation |
| FR-06 Grounded QA | Implemented / Partial / Deferred | QA tests |
| FR-07 Refusal | Implemented / Partial / Deferred | Adversarial evaluation |
| FR-08 Eligibility Agent | Implemented / Partial / Deferred | Agent tests |
| FR-09 Procedure Resolver | Implemented / Partial / Deferred | Agent tests |
| FR-10 Response Drafter | Implemented / Partial / Deferred | Output tests |
| FR-11 Orchestration | Implemented / Partial / Deferred | Workflow integration |
| FR-12 Approval Gate | Implemented / Partial / Deferred | Approval integration |
| FR-13 Document Output | Implemented / Partial / Deferred | DOCX/PDF tests |
| FR-14 Streaming | Implemented / Partial / Deferred | SSE/WebSocket test |
| FR-15 RBAC | Implemented / Partial / Deferred | Authorization tests |
| FR-16 Evaluation | Implemented / Partial / Deferred | Evaluation harness |
| FR-17 Observability | Implemented / Partial / Deferred | Trace viewer/logs |
| FR-18 API/UI | Implemented / Partial / Deferred | OpenAPI + UI |

**Note:** The final status column must be updated only after implementation and verification. No requirement should be marked "Implemented" solely because it has been designed.

---

# 19. MVP Acceptance Criteria

The MVP will be considered functionally complete when an evaluator can:

1. Start the complete system using the documented setup.
2. Ingest supported government documents.
3. Ingest a scanned PDF and observe OCR processing.
4. Inspect OCR confidence information.
5. Ask a grounded question.
6. Receive an answer with source citations.
7. Ask an out-of-corpus question and observe a correct refusal.
8. Submit a citizen scenario.
9. Observe the multi-agent workflow.
10. Inspect retrieved evidence and agent execution.
11. Review the drafted response.
12. Approve, reject, or edit-and-approve the response.
13. Verify that the approval action is audited.
14. Export an approved response as DOCX/PDF.
15. Inspect the complete workflow trace.
16. Review token/cost information.
17. Run the evaluation harness.
18. Verify authentication and role-based authorization.

---

# 20. Deferred / Future Enhancements

The following capabilities may be added after the MVP:

- Advanced government-system integrations.
- Multi-region deployment.
- Advanced analytics.
- More sophisticated document understanding.
- Additional retrieval enhancements.
- Automated corpus update monitoring.
- More specialized government-service agents.
- Advanced reviewer dashboards.
- Production-grade disaster recovery infrastructure.
- Enterprise secrets-management integration.

These enhancements must not be implemented at the expense of the required MVP evaluation, security, documentation, teaching material, or human approval controls.

---

# 21. Requirement-to-Deliverable Mapping

| Requirement Area | Primary Evidence |
|---|---|
| Business requirements | `docs/BRD.md` |
| Architecture | `docs/SYSTEM-DESIGN.md`, `docs/ARCHITECTURE.md` |
| Security | `docs/SECURITY.md` |
| Evaluation | `docs/EVALUATION.md` |
| Agentic workflow | Architecture + implementation + run trace |
| OCR | T6 implementation + tests |
| DOCX/PDF | T6 implementation + demo |
| API | OpenAPI specification |
| Testing | Test suite + CI |
| AI-assisted development | `docs/AGENTIC-WORKFLOW.md` |
| AI usage | `docs/AI-USAGE-LOG.md` |
| Teaching | `teaching/` |
| Product demonstration | Demo video |
| Teaching demonstration | Teaching video |

---

# 22. Final Product Principle

The Government Services Copilot is not intended to answer every question.

Its core value is to provide an **evidence-grounded, traceable, controlled, and reviewable workflow** for government-service information.

When evidence exists, the system should make it easy to find and understand.

When evidence is uncertain, the system should make that uncertainty visible.

When evidence does not exist, the system should refuse rather than guess.

When an official response is generated, the officer must remain in control of the final decision.