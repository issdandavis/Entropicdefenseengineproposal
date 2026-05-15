# xAI Demo Slides Outline (Evidence + Roadmap)

**Presentation:** SCBE-AetherMoore Prototype Review  
**Duration:** 15 minutes (10 slides)  
**Audience:** Technical + Product  
**Rule:** Claims must map to runnable repo artifacts.

---

## Slide 1: Title + Scope

```
SCBE-AETHERMOORE
Prototype Security Stack for AI Request Governance

Scope for this session:
- What runs today in this repo
- What is roadmap only
```

---

## Slide 2: Threat Model (Baseline)

```
THREATS WE MODEL

1) Prompt injection / policy bypass attempts
2) Brute-force pressure on auth context
3) Future quantum pressure (planning assumption)
```

---

## Slide 3: Baseline Demo (Traditional)

**Command:**
```bash
python demos/attack_scenarios.py --mode traditional
```

**Message:** Baseline lane is vulnerable under weak controls.

---

## Slide 4: What Runs Today (Evidence Mode)

```
RUNNING ARTIFACTS IN THIS REPO

- 14-layer math implementation:
  scbe_complete_math.py
- Hyperbolic distance + harmonic scaling:
  hyperbolic_distance(), harmonic_scaling()
- UI simulation tab:
  Neutrino Random Admin Check (function-first)
- Demo scripts under /demos
- Current local test status:
  29 passed / 3 failed (targeted Layer-3 tests)
```

---

## Slide 5: Live Prototype Flow

**Command:**
```bash
python demos/xai_grok_protection_demo.py
```

**Shows:** token-style encoding preview, hyperbolic gate decision, harmonic scaling curve.

---

## Slide 6: Neutrino Random Check (Function View)

```
FUNCTION-FIRST MODEL

semantic-spin bitstream
  -> Poisson count channel
  -> threshold decode
  -> trust/confidence gate
  -> admin allow/deny
```

**Visual:** W-Sphere panel (operator view), backed by same function math.

---

## Slide 7: Validation Policy

```
DECK INTEGRITY POLICY

- If it is not runnable here, it is labeled ROADMAP.
- Facts are public; value is in lessons, workflows, and operational control.
- No absolute claims without measured evidence artifacts.
```

---

## Slide 8: Roadmap Mode (Clearly Labeled)

```
ROADMAP (NOT YET SHIPPED IN THIS REPO)

- ML-KEM / ML-DSA wrappers (Layer 13)
- Third-party security audit
- Large-scale load testing and latency characterization
- Production hardening + CI evidence pipeline
```

---

## Slide 9: Productization / Monetization

```
WHAT WE SELL

- Lesson bundles + implementation playbooks
- Governance workflow templates
- Integration services and support

NOT SOLD:
- public science facts
```

---

## Slide 10: Close + Next Step

```
NEXT STEP

1) 1-week technical pilot
2) Evidence log export from live runs
3) Gap list -> roadmap tickets
```

Repo: https://github.com/issdandavis/Entropicdefenseengineproposal

---

## Design Notes

- Keep dark theme + high contrast.
- Show command + output snippets, not marketing-only bullets.
- Put "EVIDENCE" or "ROADMAP" tag on each slide.

---

**Slide Deck Version:** 1.1  
**Updated:** March 2026
