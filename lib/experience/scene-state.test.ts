import { expect, it } from "vitest";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { FAMILY_ORDER } from "@/lib/asedio/demo";
import { asedioCells, asedioDoors, lastDoor, revealedAttacks } from "./scene-state";
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

it("groups revealed attempts by door, in run order; the first `covered` doors carry a lock", async () => {
  const r = (await runMission({ covered: 4 }, new AbortController().signal, () => {})).result;
  const doors = asedioDoors(r.results, 4, 12);
  expect(doors.map(d => d.family)).toEqual(FAMILY_ORDER);
  expect(doors.map(d => d.locked)).toEqual([true, true, true, true, false, false, false]);
  expect(doors.map(d => d.marks)).toEqual([["pass"], ["pass"], ["pass"], ["pass"], ["fail", "fail"], ["fail", "fail"], ["fail", "needs-review", "needs-review", "needs-review"]]);
  expect(doors.flatMap(d => d.marks.filter(m => m === "fail")).length).toBe(r.through);
  expect(asedioDoors(r.results, 4, 3).map(d => d.marks.length)).toEqual([1, 0, 0, 0, 2, 0, 0]);
  expect(asedioDoors(r.results, 4, 0).every(d => d.marks.length === 0)).toBe(true);
});

it("puts the visitor at the door of the last revealed attempt, outside before the first", async () => {
  const r = (await runMission({ covered: 4 }, new AbortController().signal, () => {})).result;
  expect(lastDoor(r.results, 0)).toBe(-1);
  expect(lastDoor(r.results, 3)).toBe(FAMILY_ORDER.indexOf(r.results[2].category));
  expect(lastDoor(r.results, 12)).toBe(FAMILY_ORDER.indexOf(r.results[11].category));
});
