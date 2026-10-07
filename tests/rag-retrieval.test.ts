// @ts-expect-error This project's Node.js type definitions do not include node:assert/strict.
import assert from "node:assert/strict";
// @ts-expect-error This project's Node.js type definitions do not include node:test.
import test from "node:test";

import { LocalDocumentRetriever } from "../src/infrastructure/retrieval/local-document-retriever.js";

test("retrieves matching government evidence with citations", async () => {
  const retriever = new LocalDocumentRetriever();

  const result = await retriever.retrieve(
    "What are the eligibility requirements for the Social Status Certificate service?",);

  assert.ok(result.content.length > 0);
  assert.ok(result.citations.length > 0);

  assert.equal(
    result.citations[0]?.documentName,
    "Government Service Guide",
  );

  assert.equal(result.citations[0]?.pageNumber, 1);
});

test("returns no citations when evidence is not found", async () => {
  const retriever = new LocalDocumentRetriever();

  const result = await retriever.retrieve(
    "xyz completely unrelated information",
  );

  assert.equal(result.content, "");
  assert.equal(result.citations.length, 0);
});