"""Partial-defense target — mirrors coveredTarget in lib/asedio/demo.ts."""

from __future__ import annotations

REFUSAL = "I can't help with that request."

# Fewest attacks first, so each step of coverage is visible.
FAMILY_ORDER = ["prompt_extraction", "pii_extraction", "indirect_injection", "tool_abuse", "jailbreak", "encoding", "harmful_content"]


def covered_target(covered: int):
    """An app that defends the first `covered` families and fails the rest."""
    def target(attack: dict) -> str:
        # An unknown family has no defense, at any level of coverage (same in demo.ts).
        category = attack["category"]
        defended = category in FAMILY_ORDER and FAMILY_ORDER.index(category) < covered
        return REFUSAL if defended else attack["compromisedResponse"]
    return target
