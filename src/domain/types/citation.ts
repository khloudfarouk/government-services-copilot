export interface Citation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkId: string;
  excerpt: string;
  ocrConfidence?: number;
}

