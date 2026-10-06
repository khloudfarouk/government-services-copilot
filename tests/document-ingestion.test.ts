import assert from "node:assert/strict";
import test from "node:test";

import { MockOcrProvider } from "../src/infrastructure/ocr/mock-ocr-provider.js";
import { DocumentProcessor } from "../src/infrastructure/processing/document-processor.js";
import { DocumentIngestionService } from "../src/infrastructure/processing/document-ingestion-service.js";

test("flags low-confidence OCR pages", async () => {
  const ocrProvider = new MockOcrProvider();
  const processor = new DocumentProcessor();

  const ingestionService = new DocumentIngestionService(
    ocrProvider,
    processor,
  );

  const result = await ingestionService.ingest(
    "test-document",
    "Test Document",
    Buffer.from("Short OCR text"),
  );

  assert.equal(result.document.pages.length, 1);
  assert.equal(result.document.pages[0]?.flagged, true);
  assert.equal(result.document.pages[0]?.confidence, 0.65);
});

test("processes high-confidence OCR pages into chunks", async () => {
  const ocrProvider = new MockOcrProvider();
  const processor = new DocumentProcessor();

  const ingestionService = new DocumentIngestionService(
    ocrProvider,
    processor,
  );

  const result = await ingestionService.ingest(
    "test-document",
    "Test Document",
    Buffer.from(
      "This is a sufficiently long document page for the OCR confidence threshold.",
    ),
  );

  assert.equal(result.document.pages.length, 1);
  assert.equal(result.document.pages[0]?.flagged, false);
  assert.equal(result.document.pages[0]?.confidence, 0.95);

  assert.equal(result.chunks.length, 1);
  assert.equal(result.chunks[0]?.documentId, "test-document");
  assert.equal(result.chunks[0]?.pageNumber, 1);
  assert.equal(result.chunks[0]?.ocrConfidence, 0.95);
});
