import type { TapeStatus } from "@/design-system/demo/outcome-tape";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { FAMILY_ORDER } from "@/lib/asedio/demo";
import type { AttackResult } from "@/lib/asedio/types";

const CELL: Record<AttackResult["outcome"], TapeStatus> = { pass: "served", "needs-review": "rerouted", fail: "lost" };

export function asedioCells(results: readonly AttackResult[], revealed: number): TapeStatus[] {
  return results.map((r, i) => (i >= revealed ? "pending" : CELL[r.outcome]));
}

export function revealedAttacks(frame: { visible: number; total: number; complete: boolean }, n: number, reducedMotion: boolean): number {
  if (reducedMotion || frame.complete || frame.total === 0) return n;
  return Math.ceil((n * frame.visible) / frame.total);
}

export const COMPLETE_FRAME: PlaybackFrame<TraceEvent> = { visible: 0, total: 0, event: undefined, complete: true };

export type Door = { family: string; locked: boolean; marks: AttackResult["outcome"][] };

/** One door per attack family; the first `covered` have a lock. Marks are the revealed attempts at that door, in run order. */
export function asedioDoors(results: readonly AttackResult[], covered: number, revealed: number): Door[] {
  return FAMILY_ORDER.map((family, i) => ({ family, locked: i < covered, marks: results.slice(0, revealed).filter((r) => r.category === family).map((r) => r.outcome) }));
}

/** Door index of the last revealed attempt; -1 before the first. */
export function lastDoor(results: readonly AttackResult[], revealed: number): number {
  return revealed > 0 ? FAMILY_ORDER.indexOf(results[revealed - 1].category) : -1;
}
