# xAI Demo Script - Evidence + Roadmap Split

**Duration:** 15 minutes  
**Audience:** Technical review  
**Goal:** Show what works now, separate roadmap from shipped behavior.

---

## Pre-Demo Setup (5 min)

- [ ] Terminal in repo root
- [ ] Python available
- [ ] Slides open from `docs/xai-demo/SLIDES_OUTLINE.md`

---

## Part 1: Baseline Risk (2 min)

**Command:**
```bash
python demos/attack_scenarios.py --mode traditional
```

**Narration:**
- This is a baseline weak-control lane.
- It demonstrates why we need governance layers.

---

## Part 2: Prototype Defense Flow (5 min)

**Command:**
```bash
python demos/xai_grok_protection_demo.py
```

**Narration:**
- Token-style representation improves operator readability.
- Hyperbolic distance separates trusted and attacker contexts.
- Harmonic scaling increases attacker cost with depth.

---

## Part 3: Additional Supporting Demos (3 min)

### A) Token representation comparison
```bash
python demos/tokenizer_comparison.py
```

### B) Layer view
```bash
python demos/layer_visualization.py
```

### C) Quantum pressure model
```bash
python demos/quantum_attack_sim.py
```

---

## Part 4: Repo-Truth Status (2 min)

**Evidence now:**
- Core math + simulation workflows are present.
- Functional prototype UI and terminal demos are present.
- Latest local Python test run: 29 passed / 3 failed.

**Roadmap only (label clearly):**
- ML-KEM/ML-DSA wrappers in this repo.
- Third-party audit + production hardening.

---

## Part 5: Business Positioning (3 min)

**Message:**
- We do not sell science facts.
- We sell implementation lessons, workflows, controls, and operational reliability.

**Pilot ask:**
1. One-week pilot scope.
2. Evidence log requirements.
3. Security and integration checkpoints.

---

## Q&A Guardrails

- If asked about production readiness: "Prototype with roadmap to production hardening."
- If asked about PQC wrappers: "Roadmap in this repo version, not claimed as shipped."
- If asked about metrics: "Only cite measured artifacts from this run and repo evidence."

---

## Troubleshooting

If a demo command fails:
1. Re-run from repo root.
2. Verify Python path and dependencies.
3. Continue with available commands and label missing items as roadmap.

---

**Script Version:** 1.1  
**Updated:** March 2026
