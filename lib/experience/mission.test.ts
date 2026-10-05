import { expect, it } from "vitest";
import { runMission } from "./mission";

const run = (covered: number) => runMission({ covered }, new AbortController().signal, () => {});

it("counts attacks that got through, flagged ones and the full-coverage comparison", async () => {
  const r = (await run(4)).result;
  expect(r.results).toHaveLength(12);
  expect(r.through).toBe(5);
  expect(r.flagged).toBe(3);
  expect(r.comparison).toEqual({ mine: 5, full: 0 });
});

it("reveals the 12 attacks in four steps of three", async () => {
  expect((await run(4)).trace.map((e) => e.evidenceIds?.length)).toEqual([3, 3, 3, 3]);
});

it("rejects coverage outside 0 to 7 and stops when cancelled", async () => {
  await expect(run(8)).rejects.toThrow();
  const c = new AbortController();
  await expect(runMission({ covered: 4 }, c.signal, () => c.abort())).rejects.toMatchObject({ name: "AbortError" });
});
