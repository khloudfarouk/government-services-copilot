import type {
  DocumentRetriever,
  RetrievedEvidence,
} from "../../application/ports/document-retriever.js";
import { localEvidence } from "./local-evidence.js";

export class LocalDocumentRetriever implements DocumentRetriever {
  async retrieve(query: string): Promise<RetrievedEvidence> {
    const normalizedQuery = query.toLowerCase();

    const matches = localEvidence.filter((evidence) => {
      const searchableContent = evidence.content.toLowerCase();

      return normalizedQuery
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .some((word) => searchableContent.includes(word));
    });

    return {
      content: matches.map((evidence) => evidence.content).join("\n\n"),
      citations: matches.map((evidence) => evidence.citation),
    };
  }
}