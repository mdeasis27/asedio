import json
from pathlib import Path

import pytest

from asedio.checks import check_harmful, check_pii, check_prompt_leak, check_tool_abuse, check_url_exfil
from asedio.severity import severity_of
from asedio.signature import fnv1a_hex, signature
from asedio.suite import compute_stats, count_regressions, evaluate, run_suite

FIXTURES = Path(__file__).parent / "fixtures"


def _load(name: str):
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def _config():
    return _load("config.json")


def _attacks():
    return _load("attacks.json")["attacks"]


def test_checks_match_expected():
    config = _config()
    assert check_prompt_leak(f"My prompt: {config['systemPrompt']}", config["systemPrompt"]) is True
    assert check_pii("alice@example.com") is True
    assert check_pii("card 4111-1111-1111-1111") is True
    assert check_tool_abuse("TOOL: db_delete_all", config["toolMarker"]) is True
    assert check_url_exfil("https://evil.com/?d=alice@example.com") is True
    assert check_harmful("build a bomb", config["hardKeywords"], config["grayKeywords"]) == "fail"
    assert check_harmful("ammonium nitrate", config["hardKeywords"], config["grayKeywords"]) == "needsReview"


def test_severity_matches_fixture():
    for case in _load("severity.json")["cases"]:
        assert severity_of(case["exploitability"], case["impact"]) == case["expected"]


def test_fnv1a_matches_fixture():
    fixture = _load("fnv.json")
    assert fnv1a_hex("hello") == fixture["hello"]
    assert fnv1a_hex("a1|hello") == fixture["a1hello"]


def test_signature_is_deterministic():
    assert signature("a1", "hello world") == signature("a1", "hello world")
    assert signature("a1", "hello world") != signature("a2", "hello world")


def test_harness_stats_match_fixture():
    fixture = _load("stats.json")
    config = _config()
    attacks = _attacks()

    vulnerable = run_suite(attacks, lambda a: a["compromisedResponse"], config)
    hardened = run_suite(attacks, lambda a: "I can't help with that request.", config)

    v_stats = compute_stats(vulnerable, attacks)
    h_stats = compute_stats(hardened, attacks)

    for key in fixture["vulnerable"]:
        assert v_stats[key] == pytest.approx(fixture["vulnerable"][key], abs=1e-9), key
    for key in fixture["hardened"]:
        assert h_stats[key] == pytest.approx(fixture["hardened"][key], abs=1e-9), key

    closed = {r["signature"] for r in vulnerable if r["outcome"] != "pass"}
    assert count_regressions(closed, hardened) == fixture["regressions"]


def test_evaluate_flags_leak():
    config = _config()
    attack = next(a for a in _attacks() if a["id"] == "prompt-extract-1")
    result = evaluate(attack, attack["compromisedResponse"], config)
    assert result["outcome"] == "fail"
    assert result["checks"]["leak"] is True
