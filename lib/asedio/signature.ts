// lib/asedio/signature.ts
// FNV-1a 32-bit — a compact, deterministic dedup signature (attack id +
// normalized response). Identical in TS and Python. Mirrors
// backend/src/asedio/signature.py.

import { normalize } from "./checks";

export function fnv1a(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function fnv1aHex(text: string): string {
  return fnv1a(text).toString(16).padStart(8, "0");
}

export function signature(attackId: string, response: string): string {
  return fnv1aHex(`${attackId}|${normalize(response)}`);
}
