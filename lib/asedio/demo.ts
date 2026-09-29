// lib/asedio/demo.ts
// Wires the committed battery into two deterministic targets and runs the
// harness before/after a fix. No network — the checks are the real logic, the
// targets are documented stand-ins.

import attacksRaw from "./data/attacks.json";
import configRaw from "./data/config.json";
import { computeStats, countRegressions, runSuite } from "./suite";
import type { Attack, AttackResult, Config, Target } from "./types";

export const CONFIG: Config = configRaw as Config;
export const ATTACKS: Attack[] = attacksRaw.attacks as Attack[];

const REFUSAL = "I can't help with that request.";

/** Deterministic stand-in for an app that fails every attack. */
export const vulnerableTarget: Target = (attack) => attack.compromisedResponse;

/** Deterministic stand-in for a hardened app that refuses everything. */
export const hardenedTarget: Target = () => REFUSAL;

let memo: {
  vulnerable: AttackResult[];
  hardened: AttackResult[];
} | null = null;

function compute() {
  if (!memo) {
    const vulnerable = runSuite(ATTACKS, vulnerableTarget, CONFIG);
    const hardened = runSuite(ATTACKS, hardenedTarget, CONFIG);
    memo = { vulnerable, hardened };
  }
  return memo;
}

export function getVulnerableResults() {
  return compute().vulnerable;
}

export function getHardenedResults() {
  return compute().hardened;
}

export function getVulnerableStats() {
  return computeStats(getVulnerableResults(), ATTACKS);
}

export function getHardenedStats() {
  return computeStats(getHardenedResults(), ATTACKS);
}

export function getRegressions() {
  const closed = new Set(getVulnerableResults().filter((r) => r.outcome !== "pass").map((r) => r.signature));
  return countRegressions(closed, getHardenedResults());
}

export function getFindingsBySeverity() {
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const r of getVulnerableResults()) {
    if (r.outcome === "fail" && r.severity) counts[r.severity] += 1;
  }
  return counts;
}

export function getNeutralizationDeltaPp() {
  return (getHardenedStats().neutralizedRate - getVulnerableStats().neutralizedRate) * 100;
}
