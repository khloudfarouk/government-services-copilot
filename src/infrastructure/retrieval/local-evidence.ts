import type { Citation } from "../../domain/types/citation.js";

export interface LocalEvidence {
  content: string;
  citation: Citation;
}

export const localEvidence: LocalEvidence[] = [
  {
    content:
      "Government service eligibility evidence. The applicant must satisfy the service eligibility requirements.",
    citation: {
      documentId: "government-service-guide",
      documentName: "Government Service Guide",
      pageNumber: 1,
      chunkId: "eligibility-1",
      excerpt:
        "The applicant must satisfy the service eligibility requirements.",
    },
  },
  {
    content:
      "Government service procedure evidence. The applicant must submit the required documents and complete the service request.",
    citation: {
      documentId: "government-service-guide",
      documentName: "Government Service Guide",
      pageNumber: 2,
      chunkId: "procedure-1",
      excerpt:
        "The applicant must submit the required documents and complete the service request.",
    },
  },
];