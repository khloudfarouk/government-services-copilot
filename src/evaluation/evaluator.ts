import type { DocumentRetriever } from "../application/ports/document-retriever.js";

export type ExpectedOutcome =
  | "answer"
  | "refuse"
  | "escalate";

export interface GoldenCase {
  id: string;
  category: string;
  question: string;
  expectedOutcome: ExpectedOutcome;
  requiredCitation: string | null;
}

export interface EvaluationCaseResult {
  id: string;
  passed: boolean;
  hit: boolean;
  grounded: boolean;
  refusalCorrect: boolean;
  failureReason?: string;
}

export interface EvaluationReport {
  total: number;
  passed: number;
  hitRate: number;
  groundedness: number;
  refusalCorrectness: number;
  failures: EvaluationCaseResult[];
}

export class EvaluationHarness {
  constructor(
    private readonly retriever: DocumentRetriever,
  ) {}

  async evaluate(
    cases: GoldenCase[],
  ): Promise<EvaluationReport> {
    const results: EvaluationCaseResult[] = [];

    for (const testCase of cases) {
      const evidence = await this.retriever.retrieve(
        testCase.question,
      );

      const hit = evidence.citations.length > 0;

      const grounded =
        testCase.expectedOutcome === "answer"
          ? hit &&
            evidence.citations.some(
              (citation) =>
                citation.documentId ===
                testCase.requiredCitation,
            )
          : true;

      const shouldRefuse =
        testCase.expectedOutcome === "refuse" ||
        testCase.expectedOutcome === "escalate";

      const refusalCorrect = shouldRefuse
        ? !hit
        : true;

      const passed =
        hit === (testCase.expectedOutcome === "answer") &&
        grounded &&
        refusalCorrect;

      results.push({
        id: testCase.id,
        passed,
        hit,
        grounded,
        refusalCorrect,
        ...(passed
          ? {}
          : {
              failureReason:
                "Evaluation expectation was not satisfied.",
            }),
      });
    }

    const total = results.length;
    const passed = results.filter(
      (result) => result.passed,
    ).length;

    return {
      total,
      passed,
      hitRate:
        total === 0
          ? 0
          : results.filter((result) => result.hit).length /
            total,
      groundedness:
        total === 0
          ? 0
          : results.filter(
              (result) => result.grounded,
            ).length / total,
      refusalCorrectness:
        total === 0
          ? 0
          : results.filter(
              (result) => result.refusalCorrect,
            ).length / total,
      failures: results.filter(
        (result) => !result.passed,
      ),
    };
  }
}