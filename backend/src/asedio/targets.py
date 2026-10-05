"""Partial-defense target — mirrors coveredTarget in lib/asedio/demo.ts."""

from __future__ import annotations

REFUSAL = "I can't help with that request."

# Fewest attacks first, so each step of coverage is visible.
FAMILY_ORDER = ["prompt_extraction", "pii_extraction", "indirect_injection", "tool_abuse", "jailbreak", "encoding", "harmful_content"]


def covered_target(covered: int):
    """An app that defends the first `covered` families and fails the rest."""
    def target(attack: dict) -> str:
        return REFUSAL if FAMILY_ORDER.index(attack["category"]) < covered else attack["compromisedResponse"]
    return target
