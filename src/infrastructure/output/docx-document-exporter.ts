import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import type { DocumentExporter } from "../../application/ports/document-exporter.js";
import type { OfficialResponse } from "../../domain/types/official-response.js";

export class DocxDocumentExporter implements DocumentExporter {
  async export(
    response: OfficialResponse,
    documentName: string,
  ): Promise<Buffer> {
    const paragraphs = response.content.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
            }),
          ],
        }),
    );

    const document = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: documentName,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            ...paragraphs,
          ],
        },
      ],
    });

    return Packer.toBuffer(document);
  }
}