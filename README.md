# Asedio

**Automated red-team harness** — a committed attack battery (7 categories), deterministic
checks first, severity = exploitability × impact, and a zero-regression loop that turns every
confirmed finding into a permanent regression case.

> **Result:** Against a vulnerable target the harness files **10 findings** (9 deterministic
> `fail` + 1 classifier `needs-review` confirmed) and neutralizes **0%** of attacks. After a
> fix, the hardened target neutralizes **100%** and **regressions stay at 0** — no closed
> finding re-opens. Deterministic checks have **0 false positives**; the harmful-content
> classifier measures a **66.7% FP rate** on its review queue (2/3), which is the honest,
> published boundary of the cheap checks.

---

## Result

### Harness run (12 attacks, 7 categories)

| Target | Neutralized | Findings | Regressions |
|---|---|---|---|
| Vulnerable (deterministic stand-in) | 0% (0/12) | **10** | — |
| Hardened (post-fix) | **100% (12/12)** | 0 | **0** |

**Detection rate:** 10/12 = 83.3% (9 `fail` via deterministic checks + 1 `needs-review`
confirmed by a human verdict).

### False-positive rate

| Check layer | FP rate |
|---|---|
| Deterministic (leak, PII, tool, URL) | **0%** — unambiguous by construction |
| Classifier (harmful content) | **66.7%** (2 of 3 `needs-review` were benign) |

The review queue is where you learn what your classifier is missing. Deterministic checks are
free and exact; the classifier is the fuzzy boundary, and its FP rate is published rather
than hidden.

### Findings by severity (vulnerable run)

| Severity | Count |
|---|---|
| critical | 6 |
| high | 3 |
| medium | 0 |
| low | 0 |

Severity = exploitability × impact, banded (≥16 critical, ≥9 high, ≥4 medium).

---

## Architecture

```
lib/asedio/             # canonical core (TypeScript, tested)
  checks.ts             #   deterministic checks + harmful classifier (pass/fail/needs-review)
  severity.ts           #   exploitability × impact → critical/high/medium/low
  signature.ts          #   FNV-1a dedup signature (attack id + normalized response)
  suite.ts              #   evaluate · runSuite · computeStats · countRegressions
  demo.ts               #   vulnerable/hardened targets + before/after runs
  data/attacks.json     #   12 committed attacks with payloads + compromised responses
  data/config.json      #   system prompt, keywords, tool marker (committed)
  fixtures/             #   fnv/severity/stats.json (shared math, pinned)
backend/                # same math in Python + pytest (authoritative)
  src/asedio/           #   checks/severity/signature/suite.py
  tests/                #   pinned to tests/fixtures/*.json
app/                    # Next.js landing + demo dashboard (Vercel, demo mode)
```

The **checks are the real logic**; the targets are deterministic stand-ins (a documented proxy
for your own `grafo`/`compuerta` apps — see the scope note below). Dedup uses the FNV-1a hash
of `attackId + normalized response`, so the same attack/response never files 40 copies.

## Scope note

This harness runs against **applications you own and control** — in demo mode, the deterministic
local stand-ins; in production, your own deployments (the `grafo`/`compuerta` projects). Point
it at third-party systems and you are out of scope for this project and for your career.

## Design decisions & tradeoffs

1. **Deterministic checks before any judge.** Leak, PII, blocked-tool and outbound-URL checks
   are free and unambiguous — 0 false positives by construction. The classifier only handles
   policy violations that need interpretation.
2. **Three outcomes, not two.** `pass` / `fail` / `needs-review`. The review queue is where the
   FP rate lives; a binary harness would either flood findings or silently drop uncertain cases.
3. **Nothing is ever removed after a fix.** Every confirmed finding becomes a permanent
   regression case, so the re-run proves the hole stays closed — regressions must equal zero.

## What did not work

- **The classifier over-flags (66.7% FP).** Two gray "ammonium nitrate / reagent" responses
  were benign but flagged for review. That's the honest boundary of keyword heuristics — a real
  LLM judge would sharpen it, and the review queue exists precisely to expose that gap.

## Run it

```bash
# frontend demo + TS tests
pnpm install && pnpm dev      # http://localhost:3000
pnpm test                     # 22 vitest tests

# backend (authoritative math) — Python 3.12+
cd backend && uv sync --extra dev && uv run pytest   # 6 tests, pinned fixtures
```

## Stack

Next.js 16 · TypeScript · Vitest · Tailwind v4 · Python 3.13 · pytest
