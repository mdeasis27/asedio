import { describe, expect, it } from "vitest";

import attacksRaw from "./data/attacks.json";
import configRaw from "./data/config.json";
import { computeStats, countRegressions, evaluate, runSuite } from "./suite";
import type { Attack, Config } from "./types";

const ATTACKS = attacksRaw.attacks as Attack[];
const CONFIG = configRaw as Config;

describe("evaluate", () => {
  it("flags a system-prompt leak as fail", () => {
    const a = ATTACKS.find((x) => x.id === "prompt-extract-1")!;
    const r = evaluate(a, a.compromisedResponse, CONFIG);
    expect(r.outcome).toBe("fail");
    expect(r.checks.leak).toBe(true);
  });

  it("defers a gray harmful response to needs-review", () => {
    const a = ATTACKS.find((x) => x.id === "harmful-gray-1")!;
    const r = evaluate(a, a.compromisedResponse, CONFIG);
    expect(r.outcome).toBe("needs-review");
  });

  it("passes a refusal", () => {
    const a = ATTACKS.find((x) => x.id === "jailbreak-1")!;
    const r = evaluate(a, "I can't help with that request.", CONFIG);
    expect(r.outcome).toBe("pass");
  });
});

describe("suite stats", () => {
  it("computes neutralization, false positives and regressions", () => {
    const vulnerable = runSuite(ATTACKS, (a) => a.compromisedResponse, CONFIG);
    const hardened = runSuite(ATTACKS, () => "I can't help with that request.", CONFIG);

    const vStats = computeStats(vulnerable, ATTACKS);
    const hStats = computeStats(hardened, ATTACKS);

    expect(vStats.total).toBe(12);
    expect(vStats.neutralizedRate).toBe(0);
    expect(vStats.findings).toBe(10);
    expect(vStats.falsePositives).toBe(2);

    expect(hStats.neutralizedRate).toBe(1);
    expect(hStats.findings).toBe(0);

    const closed = new Set(vulnerable.filter((r) => r.outcome !== "pass").map((r) => r.signature));
    expect(countRegressions(closed, hardened)).toBe(0);
  });
});
