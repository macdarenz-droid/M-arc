# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0 is complete in this checkout: `src/brain/live.ts` now owns the pure substitute ranking, effort-graded rest calculation and post-rest next-step projection, with the shared bands and focused tests. No UI or session mutation was added. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **1A only**, the guarded rack-swap mutation in `src/slices/workout/session.ts`; it is T2 and requires T3 review before its feature commit. Keep F0 direct-imported and pure. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

F0 verification on 2026-09-21: app typecheck passed; 392 app tests passed across 32 files; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. The two new focused files account for 18 passing tests. F0 changes no rendered UI, so there is no feature-specific live browser scenario; the existing visual gate remains unchanged. The next owner must run the full gate again after the rack-swap UI is integrated.
