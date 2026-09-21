# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), morning verdict (3A–3T), the session-plan capture prerequisite (10A/10AT), live autoregulation (4A–4T), and the warm-up ramp (5A–5T) are complete in this checkout. The ramp is derived only from the first eligible history-backed effective target, never creates logged work, renders from the shared effective target, and can be hidden for the active session. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **6A**, chronic-skip evidence, planning, report registration, wording and research registration. Preserve captured-plan provenance and label legacy comparisons explicitly. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Warm-up-ramp feature gate on 2026-09-21: both typechecks passed; 495 app tests passed across 39 files, including 15 focused ramp/dismissal tests and the unchanged 50-persona finite-number fuzz sweep; 87 proxy tests passed with eight existing skips; production build passed; and the five-theme visual/migration gate passed without page errors. The live flow verifies kg/lb rendering, 360 px wrapping, keyboard Hide, navigation/reload persistence, unchanged live/history counts and exactly two saved actual sets rather than five rows containing the three suggestions. Work item 6A is next.
