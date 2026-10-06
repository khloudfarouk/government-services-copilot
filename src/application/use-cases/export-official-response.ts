import type { OfficialResponse } from "../../domain/types/official-response.js";
import type { DocumentExporter } from "../ports/document-exporter.js";

export class ExportOfficialResponseUseCase {
  constructor(
    private readonly documentExporter: DocumentExporter,
  ) {}

  async execute(
    response: OfficialResponse,
    documentName: string,
  ): Promise<Buffer> {
    return this.documentExporter.export(response, documentName);
  }
}