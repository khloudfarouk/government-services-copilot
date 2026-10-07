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
    const normalizedQuery =
      query.toLowerCase().trim();

    /*
     * Generic words such as "documents", "required",
     * "request", and "procedure" are not enough to
     * establish that the query belongs to a service.
     *
     * We first check for service-specific terms.
     */

    const serviceKeywords = [
      "social status",
      "social status certificate",
    ];

    const hasKnownServiceReference =
      serviceKeywords.some((keyword) =>
        normalizedQuery.includes(keyword),
      );

    /*
     * If the request does not mention a known service,
     * do not return unrelated evidence.
     *
     * This is important for grounded refusal:
     * the system must not answer a driving-license
     * question using Social Status Certificate evidence.
     */

    if (!hasKnownServiceReference) {
      return {
        content: "",
        citations: [],
      };
    }

    /*
     * Once the service is identified, retrieve
     * relevant evidence using the query terms.
     */

    const words = normalizedQuery
      .split(/\s+/)
      .map((word) =>
        word.replace(/[^\p{L}\p{N}-]/gu, ""),
      )
      .filter((word) => word.length > 3);

    const staticMatches =
      localEvidence.filter((evidence) => {
        const searchableContent =
          evidence.content.toLowerCase();

        const serviceMatch =
          serviceKeywords.some((keyword) =>
            searchableContent.includes(keyword),
          );

        if (!serviceMatch) {
          return false;
        }

        /*
         * For a known service, return the service's
         * official evidence.
         */

        return words.some((word) =>
          searchableContent.includes(word),
        );
      });

    const documentMatches =
      this.documentChunks.filter((chunk) => {
        const searchableContent =
          chunk.content.toLowerCase();

        /*
         * Uploaded documents are accepted only when
         * they belong to the requested service.
         */

        const serviceMatch =
          serviceKeywords.some((keyword) =>
            searchableContent.includes(keyword),
          );

        if (!serviceMatch) {
          return false;
        }

        return words.some((word) =>
          searchableContent.includes(word),
        );
      });

    return {
      content: [
        ...staticMatches.map(
          (evidence) => evidence.content,
        ),

        ...documentMatches.map(
          (chunk) => chunk.content,
        ),
      ].join("\n\n"),

      citations: [
        ...staticMatches.map(
          (evidence) => evidence.citation,
        ),

        ...documentMatches.map((chunk) => ({
          documentId: chunk.documentId,

          documentName: chunk.documentId,

          pageNumber: chunk.pageNumber,

          chunkId: chunk.chunkId,

          excerpt: chunk.content,

          ocrConfidence:
            chunk.ocrConfidence,
        })),
      ],
    };
  }
}
