import { ATTACKS, CONFIG, hardenedTarget, vulnerableTarget } from "@/lib/asedio/demo";
import { computeStats, runSuite } from "@/lib/asedio/suite";
import type { DemoAdapter, TraceEvent } from "./types";

export type ExperienceInput = { target: "vulnerable" | "hardened"; families: string[] };
export type ExperienceResult = { results: ReturnType<typeof runSuite>; stats: ReturnType<typeof computeStats> };
export const runExperience: DemoAdapter<ExperienceInput, ExperienceResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  const selected = ATTACKS.filter((attack) => input.families.length === 0 || input.families.includes(attack.category));
  if (selected.length === 0) throw new Error("Select at least one attack family.");
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const target = input.target === "hardened" ? hardenedTarget : vulnerableTarget;
  const results = runSuite(selected, target, CONFIG);
  const trace: TraceEvent[] = results.map((result, index) => ({ id: result.attackId, step: index + 1, kind: "attack", messageKey: result.outcome, timestampMs: performance.now() - startedAt, evidenceIds: [result.signature] }));
  for (const event of trace) { if (signal.aborted) throw new DOMException("Aborted", "AbortError"); onEvent(event); if (signal.aborted) throw new DOMException("Aborted", "AbortError"); }
  return { input, result: { results, stats: computeStats(results, selected) }, trace, executionMs: performance.now() - startedAt, mode: "simulation" };
};
