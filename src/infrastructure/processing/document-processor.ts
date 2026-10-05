import type { DocumentChunk } from "../../domain/types/document-chunk.js";
import type { OcrDocument } from "../../domain/types/ocr-document.js";

export class DocumentProcessor {
  process(document: OcrDocument): DocumentChunk[] {
    return document.pages.flatMap((page) => {
      const cleanedText = page.text
        .replace(/\s+/g, " ")
        .trim();

      if (!cleanedText) {
        return [];
      }

      return [
        {
          chunkId: `${document.documentId}-page-${page.pageNumber}`,
          documentId: document.documentId,
          pageNumber: page.pageNumber,
          content: cleanedText,
          ocrConfidence: page.confidence,
        },
      ];
    });
  }
}