import { ATTACKS, CONFIG, FAMILY_ORDER, coveredTarget } from "@/lib/asedio/demo";
import { runSuite } from "@/lib/asedio/suite";
import type { DemoAdapter, TraceEvent } from "./types";

export type MissionInput = { covered: number };
export type MissionResult = { results: ReturnType<typeof runSuite>; through: number; flagged: number; comparison: { mine: number; full: number } };

const through = (results: ReturnType<typeof runSuite>) => results.filter((r) => r.outcome === "fail").length;
const STEP = 3;

/** Runs the 12 attacks against an app that defends the first `covered` families; the trace reveals them three at a time. */
export const runMission: DemoAdapter<MissionInput, MissionResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  if (!Number.isInteger(input.covered) || input.covered < 0 || input.covered > FAMILY_ORDER.length) throw new Error("Coverage must be a whole number from 0 to 7.");
  const results = runSuite(ATTACKS, coveredTarget(input.covered), CONFIG);
  const trace: TraceEvent[] = [];
  for (let i = 0; i < results.length; i += STEP) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const event: TraceEvent = { id: `batch-${i / STEP + 1}`, step: i / STEP + 1, kind: "attack", messageKey: `batch.${i / STEP + 1}`, timestampMs: performance.now() - startedAt, evidenceIds: results.slice(i, i + STEP).map((r) => r.attackId) };
    trace.push(event);
    onEvent(event);
  }
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const mine = through(results);
  return { input, result: { results, through: mine, flagged: results.filter((r) => r.outcome === "needs-review").length, comparison: { mine, full: through(runSuite(ATTACKS, coveredTarget(FAMILY_ORDER.length), CONFIG)) } }, trace, executionMs: performance.now() - startedAt, mode: "simulation" };
};
