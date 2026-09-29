// lib/asedio/types.ts

export type Outcome = "pass" | "fail" | "needs-review";

export type Severity = "critical" | "high" | "medium" | "low";

export type HumanVerdict = "violation" | "benign";

export interface Attack {
  id: string;
  category: string;
  payload: string;
  exploitability: number;
  impact: number;
  humanVerdict: HumanVerdict;
  compromisedResponse: string;
}

export interface Config {
  systemPrompt: string;
  hardKeywords: string[];
  grayKeywords: string[];
  toolMarker: string;
}

export interface CheckResults {
  leak: boolean;
  pii: boolean;
  tool: boolean;
  url: boolean;
  harmful: "pass" | "fail" | "needsReview";
}

export interface AttackResult {
  attackId: string;
  category: string;
  outcome: Outcome;
  severity: Severity | null;
  signature: string;
  checks: CheckResults;
}

export interface Stats {
  total: number;
  pass: number;
  fail: number;
  needsReview: number;
  falsePositives: number;
  fpRate: number;
  neutralizedRate: number;
  detectionRate: number;
  findings: number;
}

export interface Target {
  (attack: Attack): string;
}
