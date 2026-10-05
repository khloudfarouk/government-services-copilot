import type { Citation } from "./citation.js";

export type EligibilityStatus =
  | "eligible"
  | "ineligible"
  | "uncertain";

export interface EligibilityFinding {
  requirement: string;
  status: EligibilityStatus;
  explanation: string;
  citations: Citation[];
}