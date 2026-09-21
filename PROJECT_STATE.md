# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), and rest work item 2A are complete in this checkout. `src/brain/live.ts` owns pure substitute ranking, effort-graded rest calculation and post-rest next-step projection. The session layer now records which set owns a rest, regrades without restarting elapsed time, preserves timer metadata across pause/resume, reports truthful totals after manual adjustment, and clears ownership when workout topology changes. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **2B only**, the `restNext` selector and RestBanner copy/formatting, including the effort-button call to `regradeRest`. Preserve the completed rack-swap behavior and keep F0 direct-imported and pure. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Rest work item 2A verification on 2026-09-21: app typecheck passed; 402 app tests passed across 32 files; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. This unit changes the persisted active-session timer shape and mutation behavior but no rendered UI; its fake-clock boundary cases remain assigned to 2T after the 2B selector/UI wiring. Rack-swap verification remains green.
