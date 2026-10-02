# System Architecture

## 1. Purpose

The Government Services Copilot is designed to assist users in discovering,
understanding, and interacting with government services through an AI-assisted
workflow.

The system separates business logic from infrastructure and external service
providers to keep the application maintainable, testable, and extensible.

## 2. Architectural Goals

The architecture should provide:

- Clear separation of concerns.
- Independent business logic.
- Replaceable external service providers.
- Isolated AI agents and orchestration logic.
- Testable application use cases.
- Controlled interaction with external government services.
- Clear boundaries between application, domain, and infrastructure layers.
- The ability to add new government services without modifying the core business logic.


## 3. Architecture Layers

The system follows a Clean Architecture approach with four main layers:

### 3.1 Presentation Layer

Responsible for handling external requests and presenting responses to users.

Responsibilities:

- Receive user requests.
- Validate basic request structure.
- Invoke application use cases.
- Return responses to the client.
- Handle transport-specific concerns.

The presentation layer must not contain business logic.

### 3.2 Application Layer

Responsible for coordinating application use cases and workflows.

Responsibilities:

- Define and execute use cases.
- Coordinate agents and domain services.
- Manage application workflows.
- Define provider interfaces required by the application.
- Control orchestration and approval workflows.

The application layer depends on domain abstractions and must not depend directly on infrastructure implementations.

### 3.3 Domain Layer

Contains the core business concepts and rules of the system.

Responsibilities:

- Define core entities.
- Define business rules.
- Define domain-level interfaces and contracts.
- Represent government services and user interactions.
- Remain independent from frameworks, databases, APIs, and AI providers.

The domain layer must not depend on infrastructure or external technologies.

### 3.4 Infrastructure Layer

Responsible for implementing technical details and integrations.

Responsibilities:

- Implement provider interfaces.
- Communicate with external government services.
- Implement data storage.
- Integrate AI/LLM providers.
- Handle external APIs.
- Provide technical adapters required by the application.

Infrastructure depends on abstractions defined by the inner layers.


 ## 4. Provider Abstractions

The application should communicate with external systems through provider
interfaces rather than directly depending on concrete implementations.

This allows infrastructure implementations to be replaced without changing
the application or domain logic.

### 4.1 Government Service Provider

Responsible for accessing government service information and operations.

Example responsibilities:

- Search available government services.
- Retrieve service details.
- Retrieve service requirements.
- Retrieve service procedures.
- Execute supported government service operations.

The application depends on a `GovernmentServiceProvider` abstraction rather
than a specific government API or platform.

external technologies.ion keeps the core application independent frome theirly


## 5. Agent Architecture and Orchestration

The system uses specialized AI agents with clearly defined responsibilities.
Agents should not directly control the entire application workflow.

A central orchestrator coordinates the agents and determines the execution
flow based on the current task and available information.

### 5.1 Agent Responsibilities

Each agent should have a focused responsibility.

Potential agents include:

- Service Discovery Agent
  - Identifies the government service relevant to the user's request.
  - Searches and evaluates available service information.

- Service Information Agent
  - Explains service details.
  - Identifies requirements, eligibility conditions, fees, documents,
    and procedures.

- Workflow Agent
  - Determines the required sequence of actions.
  - Coordinates the steps needed to complete a supported government service.

- Validation Agent
  - Validates collected information before an operation is executed.
  - Identifies missing or invalid information.

- Response Agent
  - Converts the final workflow result into a clear response for the user.

Agents should communicate through structured inputs and outputs rather than
directly depending on each other's internal implementation.

### 5.2 Orchestrator

The Orchestrator is responsible for coordinating the overall workflow.

Responsibilities:

- Receive the application task.
- Determine which agent should handle each stage.
- Maintain workflow state.
- Pass structured results between agents.
- Detect missing information.
- Trigger validation when required.
- Request human approval before sensitive operations.
- Handle failures and retries where appropriate.
- Produce the final workflow result.

The Orchestrator should coordinate agents but should not contain the business
logic of individual agents.

### 5.3 Agent Boundary

Each agent must have:

- A clearly defined responsibility.
- A defined input contract.
- A defined output contract.
- Access only to the providers and capabilities required for its task.
- No direct control over unrelated agents.

This prevents the AI layer from becoming a single monolithic component.


## 6. Data Stores and Workflow State

The system should separate persistent data from temporary workflow state.

### 6.1 Persistent Data

Persistent data represents information that must survive after a workflow
has completed.

Potential persistent data includes:

- User records.
- Government service metadata.
- Conversation records when persistence is required.
- Workflow history.
- Audit records.
- Configuration data.

Persistent storage should be accessed through data store abstractions rather
than directly from application or domain logic.

### 6.2 Workflow State

Workflow state represents the current execution state of an active request.

It may contain:

- Current workflow identifier.
- User request.
- Identified government service.
- Information collected from the user.
- Required information that is still missing.
- Current workflow step.
- Agent results.
- Validation results.
- Approval status.
- Execution status.
- Errors and retry information.

Workflow state should be represented using an explicit and structured model
rather than relying on unstructured conversation history.

### 6.3 State Management

The Orchestrator is responsible for coordinating workflow state transitions.

A simplified workflow state lifecycle is:

    CREATED
       │
       ▼
    DISCOVERING
       │
       ▼
    INFORMATION_GATHERING
       │
       ▼
    VALIDATING
       │
       ▼
    WAITING_FOR_APPROVAL
       │
       ▼
    EXECUTING
       │
       ▼
    COMPLETED

Failure states should be handled explicitly and should preserve enough
information to diagnose the failure or safely retry the workflow.

### 6.4 Data Access Boundary

Application and domain logic must not directly access database-specific
APIs.

Instead:

    Application
        │
        ▼
    Data Store Interface
        ▲
        │
        │ implements
        │
    Infrastructure
        │
        ▼
    Database

This keeps persistence technology replaceable and prevents database concerns
from leaking into business logic.


## 7. Complete System Flow

The system processes a user request through a controlled orchestration
workflow.

The high-level flow is:

    User
      │
      ▼
    Presentation Layer
      │
      ▼
    Application Use Case
      │
      ▼
    Orchestrator
      │
      ├──────────────► Service Discovery Agent
      │                       │
      │                       ▼
      │                Government Service Provider
      │                       │
      │                       ▼
      │                Service Information
      │
      ├──────────────► Information / Workflow Agents
      │                       │
      │                       ▼
      │                Workflow State
      │
      ├──────────────► Validation Agent
      │                       │
      │                       ▼
      │                Validation Result
      │
      ├──────────────► Approval Gate
      │                       │
      │                User Approval
      │                       │
      │                       ▼
      ├──────────────► Workflow Agent
      │                       │
      │                       ▼
      │                Government Service Provider
      │                       │
      │                       ▼
      │                External Government Service
      │
      ▼
    Response Agent
      │
      ▼
    Presentation Layer
      │
      ▼
    User

### 7.1 Request Lifecycle

A typical request follows these stages:

1. The user submits a request through the presentation layer.
2. The application creates a workflow context.
3. The orchestrator analyzes the request and selects the appropriate agent.
4. The Service Discovery Agent identifies the relevant government service.
5. Required service information and user requirements are collected.
6. The workflow state is updated after each meaningful step.
7. The Validation Agent verifies that the required information is complete
   and valid.
8. If information is missing, the workflow pauses and requests the required
   information from the user.
9. If the workflow requires an external or sensitive action, the system
   enters an approval state.
10. The user explicitly approves the action.
11. The Workflow Agent coordinates the execution.
12. The appropriate provider communicates with the external government
    service.
13. The result is stored in the workflow state.
14. The Response Agent prepares the final user-facing response.
15. The workflow is marked as completed or failed.

### 7.2 Failure Handling

Failures must be represented explicitly.

Possible failure categories include:

- Invalid user input.
- Missing required information.
- Service provider failure.
- External government service failure.
- AI provider failure.
- Validation failure.
- Approval timeout or rejection.
- Unexpected workflow errors.

The orchestrator should determine whether a failure can be retried,
requires additional user input, or should terminate the workflow.

### 7.3 Human-in-the-Loop

Human approval is required before sensitive operations that may create
external side effects.

The system must not interpret an AI-generated recommendation as user
authorization.

The approval state should be explicit and recorded as part of the workflow
state.

### 7.4 Observability

The system should provide sufficient observability to understand workflow
execution.

The architecture should support:

- Structured logging.
- Workflow identifiers.
- Agent execution tracking.
- Provider execution tracking.
- Error tracking.
- Execution duration measurement.
- Audit information for sensitive operations.

Observability mechanisms must avoid exposing sensitive user information in
logs.