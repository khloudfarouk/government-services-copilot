export interface OcrPage {
  pageNumber: number;
  text: string;
  confidence: number;
  flagged: boolean;
}

export interface OcrDocument {
  documentId: string;
  documentName: string;
  pages: OcrPage[];
}