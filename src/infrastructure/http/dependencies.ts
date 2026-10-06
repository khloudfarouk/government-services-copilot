import { ProcessCitizenRequestUseCase } from "../../application/use-cases/process-citizen-request.js";
import { ApproveCitizenResponseUseCase } from "../../application/use-cases/approve-citizen-response.js";
import { EligibilityAgentImpl } from "../agents/eligibility-agent.js";
import { ProcedureAgentImpl } from "../agents/procedure-agent.js";
import { ResponseDrafterImpl } from "../agents/response-drafter.js";
import { LocalDocumentRetriever } from "../retrieval/local-document-retriever.js";

export function buildProcessCitizenRequestUseCase() {
  const retriever = new LocalDocumentRetriever();

  const eligibilityAgent = new EligibilityAgentImpl(retriever);
  const procedureAgent = new ProcedureAgentImpl(retriever);
  const responseDrafter = new ResponseDrafterImpl();

  return new ProcessCitizenRequestUseCase(
    eligibilityAgent,
    procedureAgent,
    responseDrafter,
  );
}

export function buildApproveCitizenResponseUseCase() {
  return new ApproveCitizenResponseUseCase();
}