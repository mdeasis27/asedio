"""FNV-1a 32-bit dedup signature — mirrors lib/asedio/signature.ts."""

from __future__ import annotations

from .checks import normalize


def fnv1a(text: str) -> int:
    h = 0x811C9DC5
    for ch in text:
        h ^= ord(ch)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return h


def fnv1a_hex(text: str) -> str:
    return f"{fnv1a(text):08x}"


def signature(attack_id: str, response: str) -> str:
    return fnv1a_hex(f"{attack_id}|{normalize(response)}")
