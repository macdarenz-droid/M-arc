# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), morning verdict (3A–3T), the session-plan capture prerequisite (10A/10AT), live autoregulation (4A–4T), and the pure warm-up ramp (5A) are complete in this checkout. The ramp is derived only from the first eligible history-backed effective target and never creates logged work. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **5B**, the session-wide Hide flag, effective-target map and inline ramp presentation, then 5T. Preserve the ordinary working-set inputs and all live-autoregulation metadata. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Warm-up-ramp work item 5A verification on 2026-09-21: app typecheck passed; 490 app tests passed across 38 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. Named pure tests cover the exact 60 kg ramp, first-compound selection, session-wide logged-work suppression, starter/legacy/light/unknown absence, every unsupported resistance mode, single deload application, downward rounding, pause and hidden state. Work item 5B is next.
