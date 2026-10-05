import type { Citation } from "./citation.js";

export interface ProcedureFinding {
  requiredDocuments: string[];
  fees?: string;
  timeline?: string;
  steps: string[];
  citations: Citation[];
}