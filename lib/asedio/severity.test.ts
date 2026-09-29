import { describe, expect, it } from "vitest";

import { severityOf } from "./severity";

describe("severityOf", () => {
  it("bands exploitability × impact", () => {
    expect(severityOf(4, 5)).toBe("critical"); // 20
    expect(severityOf(5, 5)).toBe("critical"); // 25
    expect(severityOf(3, 4)).toBe("high"); // 12
    expect(severityOf(3, 3)).toBe("high"); // 9
    expect(severityOf(2, 2)).toBe("medium"); // 4
    expect(severityOf(1, 2)).toBe("low"); // 2
  });
});
