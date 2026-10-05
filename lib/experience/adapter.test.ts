import { describe, expect, it } from "vitest";
import { ATTACKS } from "@/lib/asedio/demo";
import { runExperience } from "./adapter";
describe("Asedio experience", () => {
  it("shows fewer findings for the hardened deterministic target", async () => {
    const family = ATTACKS[0].category;
    const signal = new AbortController().signal;
    const vulnerable = await runExperience({ target: "vulnerable", families: [family] }, signal, () => undefined);
    const hardened = await runExperience({ target: "hardened", families: [family] }, signal, () => undefined);
    expect(hardened.result.stats.findings).toBeLessThanOrEqual(vulnerable.result.stats.findings);
  });
});
