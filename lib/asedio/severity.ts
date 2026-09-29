// lib/asedio/severity.ts
// Severity = exploitability × impact, banded. Mirrors backend/src/asedio/severity.py.

import type { Severity } from "./types";

export function severityOf(exploitability: number, impact: number): Severity {
  const score = exploitability * impact;
  if (score >= 16) return "critical";
  if (score >= 9) return "high";
  if (score >= 4) return "medium";
  return "low";
}
