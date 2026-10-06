import { describe, expect, it } from "vitest";
import { FAMILY_ORDER } from "@/lib/asedio/demo";
import { STORY } from "./story";
import { lintStory, storyStrings as strings } from "@/design-system/demo/copy-lint";

describe("Asedio story copy", () => {
  it("has the same shape in English and Spanish", () => {
    const keys = (o: unknown): string[] => o && typeof o === "object" && !Array.isArray(o) ? Object.entries(o).filter(([k]) => k !== "before" && k !== "after").flatMap(([k, v]) => [k, ...keys(v).map(x => `${k}.${x}`)]) : [];
    expect(keys(STORY.es)).toEqual(keys(STORY.en));
  });

  it("names every attack family in both languages", () => {
    for (const locale of ["en", "es"] as const) expect(Object.keys(STORY[locale].tryIt.families).sort()).toEqual([...FAMILY_ORDER].sort());
  });

  it("has no empty strings except the owner-supplied why note", () => {
    for (const locale of ["en", "es"] as const) {
      const { why, ...rest } = STORY[locale];
      expect(why.title.trim()).not.toBe("");
      for (const s of strings(rest)) expect(s.trim(), `${locale}: empty string`).not.toBe("");
    }
  });

  it("avoids AI-sounding patterns and brand names", () => {
    for (const locale of ["en", "es"] as const) expect(lintStory(STORY[locale]), locale).toEqual([]);
  });

  it("states the comparison truthfully at a gap, one, a tie, zero and the reverse case", () => {
    expect(STORY.es.compare.sentence(5, 0)).toBe("Con tus defensas pasaron 5 ataques. Con las siete, ninguno.");
    expect(STORY.es.compare.sentence(1, 0)).toContain("pasó un ataque");
    expect(STORY.es.compare.sentence(0, 0)).toContain("No pasó ningún ataque");
    expect(STORY.es.compare.sentence(2, 2)).toContain("dejaron pasar 2 ataques");
    expect(STORY.es.compare.sentence(0, 1)).toContain("la cobertura completa rindió menos");
    expect(STORY.en.compare.sentence(5, 0)).toBe("With your defenses, 5 attacks got through. With all seven, none.");
  });

  it("describes the house with the run's locks and count", () => {
    expect(STORY.es.scene.houseLabel(4, 5)).toBe("Una casa con siete puertas, 4 con cerradura. Pasaron 5 ataques.");
    expect(STORY.en.scene.houseLabel(7, 1)).toBe("A house with seven doors, 7 of them with a lock. 1 attack got through.");
  });

  it("asks the bet about the chosen coverage", () => {
    expect(STORY.es.tryIt.question(4)).toContain("con defensas para 4 de 7 tipos de ataque");
    expect(STORY.en.tryIt.question(7)).toContain("defenses for 7 of 7");
  });
});
