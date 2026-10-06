import { expect, it } from "vitest";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { asedioCells, revealedAttacks } from "./scene-state";
import { runMission } from "./mission";

it("maps attack outcomes to tape cells; final counts match the run", async () => {
  const r = (await runMission({ covered: 4 }, new AbortController().signal, () => {})).result;
  expect(tapeCounts(asedioCells(r.results, 12))).toEqual({ served: 4, rerouted: 3, lost: 5, pending: 0 });
  expect(asedioCells(r.results, 3).slice(3).every(c => c === "pending")).toBe(true);
});

it("reveals three attacks per trace step, all when complete or under reduced motion", () => {
  expect(revealedAttacks({ visible: 1, total: 4, complete: false }, 12, false)).toBe(3);
  expect(revealedAttacks({ visible: 4, total: 4, complete: true }, 12, false)).toBe(12);
  expect(revealedAttacks({ visible: 1, total: 4, complete: false }, 12, true)).toBe(12);
});
