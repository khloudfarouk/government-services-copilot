import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import {
  buildApproveCitizenResponseUseCase,
  buildDocumentIngestionService,
  buildGetWorkflowRunUseCase,
  buildProcessCitizenRequestUseCase,
} from "./dependencies.js";

import { readFile } from "node:fs/promises";
import path from "node:path";

export async function buildServer() {
  const app = Fastify({
    logger: true,
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Government Services Copilot API",
        description:
          "HTTP API for the Government Services Copilot agentic workflow.",
        version: "1.0.0",
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  app.post(
    "/documents",
    {
      schema: {
        body: {
          type: "object",
          required: ["documentName", "content"],
          properties: {
            documentId: {
              type: "string",
            },
            documentName: {
              type: "string",
              minLength: 1,
            },
            content: {
              type: "string",
              minLength: 1,
            },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        documentId?: string;
        documentName: string;
        content: string;
      };

      const { ingestionService, retriever } =
        buildDocumentIngestionService();

      const documentId =
        body.documentId ?? `document-${Date.now()}`;

      const result = await ingestionService.ingest(
        documentId,
        body.documentName,
        Buffer.from(body.content, "utf-8"),
      );

      retriever.addChunks(result.chunks);

      return reply.send({
        documentId,
        documentName: body.documentName,
        pages: result.document.pages.length,
        chunks: result.chunks.length,
        chunksDetails: result.chunks.map((chunk) => ({
          chunkId: chunk.chunkId,
          pageNumber: chunk.pageNumber,
          ocrConfidence: chunk.ocrConfidence,
        })),
      });
    },
  );

  app.post(
    "/requests",
    {
      schema: {
        body: {
          type: "object",
          required: ["requestId", "message", "language"],
          properties: {
            requestId: {
              type: "string",
              minLength: 1,
            },
            message: {
              type: "string",
              minLength: 1,
            },
            language: {
              type: "string",
              enum: ["en", "ar"],
            },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        requestId: string;
        message: string;
        language: "en" | "ar";
      };

      const useCase = buildProcessCitizenRequestUseCase();

      const result = await useCase.execute({
        requestId: body.requestId,
        message: body.message,
        submittedAt: new Date().toISOString(),
        language: body.language,
      });

      return reply.send(result);
    },
  );

  app.post(
    "/requests/:requestId/approval",
    async (request, reply) => {
      const body = request.body as {
        action: "approve" | "reject" | "edit-and-approve";
        officerId: string;
        comment?: string;
      };

      const useCase = buildApproveCitizenResponseUseCase();

      const decision = {
        action: body.action,
        officerId: body.officerId,
        decidedAt: new Date().toISOString(),
        ...(body.comment !== undefined && {
          comment: body.comment,
        }),
      };

      const result = useCase.execute(
        (request.params as { requestId: string }).requestId,
        decision,
      );

      return reply.send({
        requestId: (request.params as { requestId: string }).requestId,
        ...result,
      });
    },
  );

  app.get("/runs/:runId", async (request, reply) => {
    const { runId } = request.params as { runId: string };

    const useCase = buildGetWorkflowRunUseCase();
    const run = useCase.execute(runId);

    if (!run) {
      return reply.code(404).send({
        error: "Workflow run not found",
      });
    }

    return reply.send(run);
  });

  app.get("/", async (_request, reply) => {
    const filePath = path.resolve(
      process.cwd(),
      "public/index.html",
    );

    const html = await readFile(filePath, "utf8");

    return reply.type("text/html").send(html);
  });

  return app;
}