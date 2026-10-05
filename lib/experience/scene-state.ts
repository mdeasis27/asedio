import type { TapeStatus } from "@/design-system/demo/outcome-tape";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
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
