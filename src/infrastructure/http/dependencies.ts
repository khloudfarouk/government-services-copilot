import { ProcessCitizenRequestUseCase } from "../../application/use-cases/process-citizen-request.js";
import { ApproveCitizenResponseUseCase } from "../../application/use-cases/approve-citizen-response.js";
import { EligibilityAgentImpl } from "../agents/eligibility-agent.js";
import { ProcedureAgentImpl } from "../agents/procedure-agent.js";
import { ResponseDrafterImpl } from "../agents/response-drafter.js";
import { LocalDocumentRetriever } from "../retrieval/local-document-retriever.js";
import { createDatabase } from "./../persistence/database.js";
import { SqliteWorkflowRunRepository } from "./../persistence/sqlite-workflow-run-repository.js";
import { SqliteApprovalDecisionRepository } from "../persistence/sqlite-approval-decision-repository.js";
import { GetWorkflowRunUseCase } from "../../application/use-cases/get-workflow-run.js";
export function buildProcessCitizenRequestUseCase() {
  const retriever = new LocalDocumentRetriever();
  const db = createDatabase();
  const workflowRunRepository = new SqliteWorkflowRunRepository(db);
  const eligibilityAgent = new EligibilityAgentImpl(retriever);
  const procedureAgent = new ProcedureAgentImpl(retriever);
  const responseDrafter = new ResponseDrafterImpl();


  return new ProcessCitizenRequestUseCase(
    eligibilityAgent,
    procedureAgent,
    responseDrafter,
    workflowRunRepository,
  );
}

export function buildApproveCitizenResponseUseCase() {
  const db = createDatabase();
  const approvalDecisionRepository =
    new SqliteApprovalDecisionRepository(db);

  return new ApproveCitizenResponseUseCase(
    approvalDecisionRepository,
  );
}


export function buildGetWorkflowRunUseCase() {
  const db = createDatabase();
  const workflowRunRepository = new SqliteWorkflowRunRepository(db);

  return new GetWorkflowRunUseCase(workflowRunRepository);
}