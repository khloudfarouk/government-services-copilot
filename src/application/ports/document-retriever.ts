import type { Citation } from "../../domain/types/citation.js";

export interface RetrievedEvidence {
  content: string;
  citations: Citation[];
}

export interface DocumentRetriever {
  retrieve(query: string): Promise<RetrievedEvidence>;
}