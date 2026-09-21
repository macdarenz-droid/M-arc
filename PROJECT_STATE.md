# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), and morning-verdict brain work 3A are complete in this checkout. `src/brain/readiness.ts` owns the pure 28-day personal baseline, verdict bands and drift calculation. Adjusted recovery carries the exact no-readiness counterfactual, and the existing low-readiness detector now uses the person's own low line once enough history exists. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **3B only**, the pure verdict attribution/copy, shared selectors, and Today card wiring. Preserve the completed rack-swap, rest and readiness math. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Morning-verdict work item 3A verification on 2026-09-21: app typecheck passed; 433 app tests passed across 33 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. The new focused readiness module has 15 tests, with another 14 recovery/detector cases covering widen-only bounds, max-factor masking, the no-readiness counterfactual, personalized metrics, the habitual-low cry-wolf fix and relative-crash detection. Work item 3B is next.
