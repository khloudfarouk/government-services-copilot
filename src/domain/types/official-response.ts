import type { Citation } from "./citation.js";

export interface OfficialResponse {
  serviceId: string;
  content: string;
  citations: Citation[];
}