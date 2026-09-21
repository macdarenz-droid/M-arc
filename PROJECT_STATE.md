# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0 and rack-swap work items 1A–1T are complete in this checkout. `src/brain/live.ts` owns the pure substitute ranking, effort-graded rest calculation and post-rest next-step projection. `src/slices/workout/session.ts` owns guarded in-place replacement and empty-slot restoration. Train exposes the two substitute intents, grounded targets, explicit handling for logged sets, guarded Undo, and Browse handoff through the existing picker. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **2A only**, rest ownership, effort grading/retiming and pause-resume lifecycle in the model and session mutation layer. Preserve the completed rack-swap behavior and keep F0 direct-imported and pure. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Rack-swap feature verification on 2026-09-21: app typecheck passed; 402 app tests passed across 32 files; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. The focused file has 21 cases, including the named shifted-index and newly-logged-set Undo regressions plus coach-state isolation. `substitutes()` has exactly one app call site, inside the tap handler. Live browser verification covered both intent rows, ranked targets, an empty in-place swap, guarded Undo, the logged-set confirmation, the non-destructive add-below choice, and Browse handoff to the existing picker; the confirmation sheet also passed visual inspection. The feature is ready for the next routed unit.
