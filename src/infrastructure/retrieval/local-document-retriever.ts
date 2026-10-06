import type {
  DocumentRetriever,
  RetrievedEvidence,
} from "../../application/ports/document-retriever.js";
import type { DocumentChunk } from "../../domain/types/document-chunk.js";
import { localEvidence } from "./local-evidence.js";

export class LocalDocumentRetriever implements DocumentRetriever {
  private documentChunks: DocumentChunk[] = [];

  addChunks(chunks: DocumentChunk[]): void {
    this.documentChunks.push(...chunks);
  }

  async retrieve(query: string): Promise<RetrievedEvidence> {
    const normalizedQuery = query.toLowerCase();

    const words = normalizedQuery
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const staticMatches = localEvidence.filter((evidence) => {
      const searchableContent = evidence.content.toLowerCase();

      return words.some((word) =>
        searchableContent.includes(word),
      );
    });

    const documentMatches = this.documentChunks.filter((chunk) => {
      const searchableContent = chunk.content.toLowerCase();

      return words.some((word) =>
        searchableContent.includes(word),
      );
    });

    return {
      content: [
        ...staticMatches.map((evidence) => evidence.content),
        ...documentMatches.map((chunk) => chunk.content),
      ].join("\n\n"),

      citations: [
        ...staticMatches.map((evidence) => evidence.citation),

        ...documentMatches.map((chunk) => ({
          documentId: chunk.documentId,
          documentName: chunk.documentId,
          pageNumber: chunk.pageNumber,
          chunkId: chunk.chunkId,
          excerpt: chunk.content,
          ocrConfidence: chunk.ocrConfidence,
        })),
      ],
    };
  }
}