import type {
  DocumentRetriever,
  RetrievedEvidence,
} from "../../application/ports/document-retriever.js";
import type { Citation } from "../../domain/types/citation.js";

export class LocalDocumentRetriever implements DocumentRetriever {
  async retrieve(query: string): Promise<RetrievedEvidence> {
    const citation: Citation = {
      documentId: "demo-government-guide",
      documentName: "Demo Government Services Guide",
      pageNumber: 1,
      chunkId: "demo-chunk-1",
      excerpt:
        "Demo evidence for development and testing. This is not an official government source.",
    };

    return {
      content: `Demo evidence retrieved for query: ${query}`,
      citations: [citation],
    };
  }
}