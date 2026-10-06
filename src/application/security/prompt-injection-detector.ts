const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(the\s+)?government\s+documents/i,
  /reveal\s+(your\s+)?(internal\s+instructions|system\s+prompt)/i,
  /show\s+(your\s+)?system\s+prompt/i,
  /invent\s+(the\s+)?answer/i,
];

export function isPromptInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) =>
    pattern.test(input),
  );
}