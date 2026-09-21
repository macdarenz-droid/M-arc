# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), morning verdict (3A–3T), the session-plan capture prerequisite (10A/10AT), and live-autoregulation brain work (4A) are complete in this checkout. New workouts retain immutable original targets and stable row identity; the pure live brain can now derive one guarded load-down or rep-up offer without mutating actuals. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **4B**, guarded accept/dismiss mutation and persisted effective targets, then 4C/4T. Reuse 4A's evidence key and 10A's captured plan metadata; never rewrite actual sets. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Live-autoregulation work item 4A verification on 2026-09-21: app typecheck passed; 468 app tests passed across 36 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. The prior 10A five-theme gate remains green. Named pure tests cover defensive effective-target copies, reductions, exact-load tolerance, max misses, easy surplus, upper rep bounds, deload behavior, protected drafts, stable evidence keys and rest-banner target resolution. Work item 4B is next.
