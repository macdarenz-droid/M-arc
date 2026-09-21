# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0 and work item 1A are complete in this checkout. `src/brain/live.ts` owns the pure substitute ranking, effort-graded rest calculation and post-rest next-step projection. `src/slices/workout/session.ts` now has the guarded `replaceEntry` mutation: it replaces a live card in place, preserves its planned set count, clears the former exercise's set data and completion flags, rejects duplicates, and refuses stale session or entry identities without changing state. No rack-swap UI has been added. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **1B only**, the rack-swap sheet and Browse wiring in `src/slices/workout/Train.tsx`. Use `replaceEntry`'s `expected` argument for both the original swap and guarded Undo so a stale action cannot alter a different session or card. Keep F0 direct-imported and pure. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Work item 1A verification on 2026-09-21: app typecheck passed; 399 app tests passed across 32 files; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. `tests/live-substitutes.test.ts` now has seven focused mutation cases covering position and set-count preservation, data and flag clearing, duplicate/no-session/range refusal, stale identity guards, and clean finish/template behavior. This item changes no rendered UI, so there is no feature-specific live browser scenario; run that scenario and the full gate after 1B/1T integrate the rack-swap surface.
