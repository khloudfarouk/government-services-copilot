import type { OfficialResponse } from "../../domain/types/official-response.js";

export interface DocumentExporter {
  export(
    response: OfficialResponse,
    documentName: string,
  ): Promise<Buffer>;
}