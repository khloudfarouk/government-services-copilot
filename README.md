# Government Services Copilot

An evidence-grounded agentic RAG platform for government citizen services and regulations, designed around the **ITI Technical Instructor — Post-Graduate Training Technical Assessment (D4 + T6)**.

> **Domain:** D4 — Government: Citizen Services & Regulations  
> **Twist:** T6 — Document In / Document Out  
> **System Type:** Evidence-Grounded Agentic RAG Platform  
> **Status:** MVP / Technical Assessment

---

## 🎯 Project Overview

Government Services Copilot is an AI-assisted decision-support platform for government service officers.

The system retrieves evidence from an approved document corpus, evaluates service eligibility and procedures through bounded agents, drafts an evidence-grounded response, and requires **human officer approval before finalization or document export**.

The system is designed to prioritize:

- Evidence-grounded answers
- Source citations and traceability
- Refusal when the corpus does not contain enough information
- Human-in-the-loop approval
- Prompt-injection protection
- Document ingestion and OCR metadata
- Structured workflow execution
- Reproducible evaluation

---

## 🏗️ Architecture

The project follows a **Clean / Hexagonal Architecture** approach.

```text
Citizen / Officer
       │
       ▼
   HTTP API / UI
       │
       ▼
   Application Layer
       │
       ▼
    Workflow
       │
       ├── Prompt Injection Detection
       │
       ├── Eligibility Agent
       │
       ├── Procedure Agent
       │
       └── Response Drafter
       │
       ▼
 Evidence Retrieval
       │
       ▼
 Document / OCR Layer
       │
       ▼
 Evidence + Citations
       │
       ▼
 Awaiting Human Approval
       │
       ├── Approve
       ├── Reject
       └── Edit + Approve
       │
       ▼
 Final Response / DOCX Export
```

### Main Agents

| Agent | Responsibility |
|---|---|
| Eligibility Identifier | Determines eligibility using retrieved evidence |
| Procedure Resolver | Identifies required documents and procedure |
| Response Drafter | Produces an evidence-grounded response |
| Orchestrator | Coordinates the workflow and approval state |

---

## 🔐 Evidence & Safety

The system does not blindly generate answers.

If the available corpus does not provide enough evidence, the system returns:

> **Not enough information in the corpus**

Unsupported services are therefore not answered using assumptions or external knowledge.

The workflow also includes:

- Citation metadata
- Evidence traceability
- Prompt-injection detection
- Unsupported-service refusal
- Human approval gate
- Approval / rejection / edit-and-approve flow

---

## 📄 Document In / Document Out

The project implements the T6 requirement through document ingestion and response generation.

### Document In

- Document upload
- Document processing
- OCR provider abstraction
- OCR confidence metadata
- Page/chunk metadata
- Evidence extraction

The current MVP uses a **mock OCR provider** behind an abstraction so that a production OCR provider can be introduced without changing the core application/domain layers.

### Document Out

Approved responses can be exported as a structured **DOCX** document.

---

## 🧪 Testing & Evaluation

Automated tests cover key application and infrastructure behaviors, including:

- Workflow execution
- Eligibility handling
- Evidence retrieval
- Insufficient-evidence refusal
- Approval workflow
- Document ingestion
- OCR processing
- Security / prompt-injection behavior
- API validation

Run the test suite with:

```bash
npm test
```

Type-check the project with:

```bash
npm run typecheck
```

Build the project with:

```bash
npm run build
```

---

## 🚀 Running Locally

### Requirements

- Node.js 22+
- npm
- Git

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production-style local server

```bash
npm run build
npm start
```

Then open:

```text
http://localhost:3000
```

---

## 🎬 Demo

The repository contains:

- Demo video
- Demo commands
- Sample government-service corpus
- Generated DOCX response
- Document ingestion demonstration

See:

```text
Demo Videos/
government-services-copilot-demo-commands.txt
demo-documents/
```

---

## 📚 Documentation

Additional project documentation is available in `docs/`:

- `BRD.md` — Business Requirements Document
- `ARCHITECTURE.md` — Architecture overview
- `SYSTEM-DESIGN.md` — System design and implementation decisions
- `AGENTIC-WORKFLOW.md` — Agentic development and runtime workflow
- `AI-USAGE-LOG.md` — AI-assisted development log
- `SECURITY.md` — Security controls
- `EVALUATION.md` — Evaluation strategy and golden test set

---

## 🤖 Agentic Development

The project follows an agentic coding workflow with:

- Small, traceable implementation steps
- Human verification of AI-generated changes
- Test-driven corrections
- Evidence-based debugging
- Explicit architectural decisions
- AI usage documentation
- Security and prompt-injection review

See:

```text
docs/AGENTIC-WORKFLOW.md
docs/AI-USAGE-LOG.md
```

---

## 🛡️ Security

Security considerations include:

- Prompt-injection detection
- Input validation
- Evidence-grounded responses
- No real personally identifiable information in the demo corpus
- Human approval before final response/export
- Environment-based configuration for secrets

See:

```text
docs/SECURITY.md
```

---

## ⚠️ MVP Scope & Limitations

This repository represents an **MVP technical assessment implementation**.

The architecture is provider-independent, while some infrastructure components are intentionally simplified for the assessment.

Current MVP limitations include:

- Local evidence retrieval instead of a production vector database
- Mock OCR provider instead of a production OCR service
- Demo/synthetic government-service corpus
- Simplified runtime infrastructure

These components can be replaced by production providers through the existing abstraction boundaries without redesigning the core domain and application layers.

---

## 📌 Example Workflow

```text
User Request
     ↓
Prompt Injection Check
     ↓
Evidence Retrieval
     ↓
Eligibility Analysis
     ↓
Procedure Resolution
     ↓
Response Drafting
     ↓
Human Officer Approval
     ↓
Approved Response
     ↓
DOCX Export
```

For unsupported services:

```text
User Request
     ↓
Evidence Retrieval
     ↓
No Sufficient Evidence
     ↓
"Not enough information in the corpus"
```

---

## 👩‍💻 Author

**Khloud Farouk**

ITI Technical Instructor — Post-Graduate Training  
Technical Assessment — D4 + T6