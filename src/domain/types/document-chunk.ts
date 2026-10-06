export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  pageNumber: number;
  content: string;
  ocrConfidence: number;
}