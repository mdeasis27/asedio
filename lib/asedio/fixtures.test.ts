import { describe, expect, it } from "vitest";

import fnvFixture from "./fixtures/fnv.json";
import severityFixture from "./fixtures/severity.json";
import statsFixture from "./fixtures/stats.json";

import { fnv1aHex } from "./signature";
import { severityOf } from "./severity";
import {
  getFindingsBySeverity,
  getHardenedStats,
  getRegressions,
  getVulnerableStats,
} from "./demo";

describe("pinned fixture: fnv1a", () => {
  it("matches the reference hash", () => {
    expect(fnv1aHex("hello")).toBe(fnvFixture.hello);
    expect(fnv1aHex("a1|hello")).toBe(fnvFixture.a1hello);
  });
});

describe("pinned fixture: severity", () => {
  for (const c of severityFixture.cases as { exploitability: number; impact: number; expected: string }[]) {
    it(`severity(${c.exploitability}, ${c.impact})`, () => {
      expect(severityOf(c.exploitability, c.impact)).toBe(c.expected);
    });
  }
});

describe("pinned fixture: harness stats", () => {
  it("matches the reference run numbers", () => {
    expect(getVulnerableStats()).toMatchObject(statsFixture.vulnerable);
    expect(getHardenedStats()).toMatchObject(statsFixture.hardened);
    expect(getRegressions()).toBe(statsFixture.regressions);
    expect(getFindingsBySeverity()).toEqual(statsFixture.severity);
  });
});
