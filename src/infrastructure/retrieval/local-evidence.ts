import type { Citation } from "../../domain/types/citation.js";

export interface LocalEvidence {
  content: string;
  citation: Citation;
}

export const localEvidence: LocalEvidence[] = [
  {
    content:
      "Social Status Certificate Service eligibility. An applicant is eligible to request a Social Status Certificate if they are a registered citizen and provide a valid National ID.",
    citation: {
      documentId: "government-service-guide",
      documentName: "Government Service Guide",
      pageNumber: 1,
      chunkId: "eligibility-1",
      excerpt:
        "An applicant is eligible to request a Social Status Certificate if they are a registered citizen and provide a valid National ID.",
    },
  },
  {
    content:
      "Social Status Certificate Service required documents. The applicant must provide a valid National ID and complete the official service application form.",
    citation: {
      documentId: "government-service-guide",
      documentName: "Government Service Guide",
      pageNumber: 2,
      chunkId: "documents-1",
      excerpt:
        "The applicant must provide a valid National ID and complete the official service application form.",
    },
  },
  {
    content:
      "Social Status Certificate Service procedure. The applicant must submit the service request, provide the required documents, and complete the verification process.",
    citation: {
      documentId: "government-service-guide",
      documentName: "Government Service Guide",
      pageNumber: 2,
      chunkId: "procedure-1",
      excerpt:
        "The applicant must submit the service request, provide the required documents, and complete the verification process.",
    },
  },
  {
    content:
      "Social Status Certificate Service fees and processing time. The service fee is 50 EGP and the expected processing time is 3 business days.",
    citation: {
      documentId: "government-service-guide",
      documentName: "Government Service Guide",
      pageNumber: 3,
      chunkId: "fees-timeline-1",
      excerpt:
        "The service fee is 50 EGP and the expected processing time is 3 business days.",
    },
  },
];