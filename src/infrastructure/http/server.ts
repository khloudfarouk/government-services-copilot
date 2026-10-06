import Fastify from "fastify";
import {
  buildApproveCitizenResponseUseCase,
  buildProcessCitizenRequestUseCase,
} from "./dependencies.js";

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

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

      const result = useCase.execute(decision);

      return reply.send({
        requestId: (request.params as { requestId: string }).requestId,
        ...result,
      });
    },
  );

  return app;
}