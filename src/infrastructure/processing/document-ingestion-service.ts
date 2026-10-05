import type { OcrProvider } from "../../application/ports/ocr-provider.js";
import type { DocumentChunk } from "../../domain/types/document-chunk.js";
import type { OcrDocument } from "../../domain/types/ocr-document.js";
import { DocumentProcessor } from "./document-processor.js";

export class DocumentIngestionService {
  constructor(
    private readonly ocrProvider: OcrProvider,
    private readonly processor: DocumentProcessor,
  ) {}

  async ingest(
    documentId: string,
    documentName: string,
    input: Buffer,
  ): Promise<{
    document: OcrDocument;
    chunks: DocumentChunk[];
  }> {
    const document = await this.ocrProvider.process(
      documentId,
      documentName,
      input,
    );

    const chunks = this.processor.process(document);

    return {
      document,
      chunks,
    };
  }
}