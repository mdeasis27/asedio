"""Severity = exploitability × impact, banded — mirrors lib/asedio/severity.ts."""

from __future__ import annotations


def severity_of(exploitability: int, impact: int) -> str:
    score = exploitability * impact
    if score >= 16:
        return "critical"
    if score >= 9:
        return "high"
    if score >= 4:
        return "medium"
    return "low"
