import { ProcessCitizenRequestUseCase } from "./application/use-cases/process-citizen-request.js";
import { EligibilityAgentImpl } from "./infrastructure/agents/eligibility-agent.js";
import { ProcedureAgentImpl } from "./infrastructure/agents/procedure-agent.js";
import { ResponseDrafterImpl } from "./infrastructure/agents/response-drafter.js";
import { LocalDocumentRetriever } from "./infrastructure/retrieval/local-document-retriever.js";
import { ApproveCitizenResponseUseCase } from "./application/use-cases/approve-citizen-response.js";
const documentRetriever = new LocalDocumentRetriever();

const eligibilityAgent = new EligibilityAgentImpl(documentRetriever);
const procedureAgent = new ProcedureAgentImpl(documentRetriever);
const responseDrafter = new ResponseDrafterImpl();

const processCitizenRequest = new ProcessCitizenRequestUseCase(
  eligibilityAgent,
  procedureAgent,
  responseDrafter,
);

const request = {
  requestId: "demo-request-1",
  message: "I want to know if I am eligible for this government service.",
  submittedAt: new Date().toISOString(),
  language: "en",
};

const result = await processCitizenRequest.execute(request);

console.log(JSON.stringify(result, null, 2));

const approvalUseCase = new ApproveCitizenResponseUseCase();

const approvalResult = approvalUseCase.execute({
  action: "approve",
  officerId: "officer-demo-1",
  decidedAt: new Date().toISOString(),
  comment: "Approved for demonstration.",
});

console.log(
  "\nApproval Result:",
  JSON.stringify(approvalResult, null, 2),
);




const rejectionResult = approvalUseCase.execute({
  action: "reject",
  officerId: "officer-demo-2",
  decidedAt: new Date().toISOString(),
  comment: "Evidence needs further review.",
});

console.log(
  "\nRejection Result:",
  JSON.stringify(rejectionResult, null, 2),
);


const editAndApproveResult = approvalUseCase.execute({
  action: "edit-and-approve",
  officerId: "officer-demo-3",
  decidedAt: new Date().toISOString(),
  comment: "Response edited and approved by the officer.",
});

console.log(
  "\nEdit and Approve Result:",
  JSON.stringify(editAndApproveResult, null, 2),
);