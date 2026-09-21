# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0 and rack-swap work items 1A–1B are complete in this checkout. `src/brain/live.ts` owns the pure substitute ranking, effort-graded rest calculation and post-rest next-step projection. `src/slices/workout/session.ts` owns the guarded in-place replacement. Train now exposes the two substitute intents, grounded targets, explicit handling for logged sets, guarded Undo for empty swaps, and Browse handoff through the existing picker. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **1T only**, the remaining rack-swap verification cases, including the named stale-shift and newly-logged-set Undo guards. Do not redesign the shipped three-state UI. Keep F0 direct-imported and pure. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Work item 1B verification on 2026-09-21: app typecheck passed; 399 app tests passed across 32 files; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. Live browser verification against that build covered both intent rows, ranked targets, an empty in-place swap, guarded Undo, the logged-set confirmation, the non-destructive add-below choice, and Browse handoff to the existing picker; the confirmation sheet also passed visual inspection. Work item 1T remains before the feature review/gate handoff.
