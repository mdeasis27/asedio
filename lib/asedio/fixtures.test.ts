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
  ATTACKS,
  CONFIG,
  FAMILY_ORDER,
  coveredTarget,
} from "./demo";
import { runSuite } from "./suite";

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

describe("partial coverage", () => {
  const outcomes = (k: number) => runSuite(ATTACKS, coveredTarget(k), CONFIG).map((r) => r.outcome);

  it("coverage decides which families get refused", () => {
    expect(outcomes(0).filter((o) => o === "pass")).toHaveLength(0);
    expect(outcomes(7).every((o) => o === "pass")).toBe(true);
    const mid = outcomes(4);
    expect(mid.some((o) => o === "pass") && mid.some((o) => o === "fail")).toBe(true);
  });

  it("the story's default bet can go either way: something gets through until all 7 are covered", () => {
    for (let k = 0; k < 7; k++) expect(outcomes(k).some((o) => o === "fail"), `k=${k}`).toBe(true);
    expect(outcomes(7).some((o) => o === "fail")).toBe(false);
  });

  it("matches the per-attack outcomes pinned for Python", () => {
    expect(FAMILY_ORDER).toEqual(statsFixture.coverage.familyOrder);
    for (const [k, expected] of Object.entries(statsFixture.coverage.outcomes)) expect(outcomes(Number(k)), `k=${k}`).toEqual(expected);
  });
});
