import type { OcrProvider } from "../../application/ports/ocr-provider.js";
import type { OcrDocument } from "../../domain/types/ocr-document.js";

export class MockOcrProvider implements OcrProvider {
  async process(
    documentId: string,
    documentName: string,
    input: Buffer,
  ): Promise<OcrDocument> {
    const text = input.toString("utf-8").trim();

    const pages = text
      .split(/\f/)
      .filter((page) => page.trim().length > 0)
      .map((page, index) => {
        const confidence = page.length > 40 ? 0.95 : 0.65;

        return {
          pageNumber: index + 1,
          text: page.trim(),
          confidence,
          flagged: confidence < 0.8,
        };
      });

    return {
      documentId,
      documentName,
      pages,
    };
  }
}