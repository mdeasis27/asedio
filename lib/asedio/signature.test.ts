import { describe, expect, it } from "vitest";

import { fnv1a, fnv1aHex, signature } from "./signature";

describe("fnv1a", () => {
  it("is deterministic and returns 8-char hex", () => {
    expect(fnv1a("abc")).toBe(fnv1a("abc"));
    expect(fnv1aHex("abc")).toMatch(/^[0-9a-f]{8}$/);
    expect(fnv1a("abc")).not.toBe(fnv1a("abd"));
  });
});

describe("signature", () => {
  it("is stable for the same attack + response, distinct otherwise", () => {
    expect(signature("a1", "hello world")).toBe(signature("a1", "hello world"));
    expect(signature("a1", "hello world")).not.toBe(signature("a2", "hello world"));
    expect(signature("a1", "hello world")).not.toBe(signature("a1", "goodbye"));
  });
});
