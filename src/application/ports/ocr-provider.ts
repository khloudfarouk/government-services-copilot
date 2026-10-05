import type { OcrDocument } from "../../domain/types/ocr-document.js";

export interface OcrProvider {
  process(
    documentId: string,
    documentName: string,
    input: Buffer,
  ): Promise<OcrDocument>;
}