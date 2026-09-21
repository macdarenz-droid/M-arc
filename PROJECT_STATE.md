# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), and morning-verdict work 3A–3B are complete in this checkout. `src/brain/readiness.ts` owns the pure 28-day personal baseline, verdict bands and drift calculation. `src/brain/coach/verdict.ts` proves whether the saved check-in moved a recovery threshold before it describes a consequence. Today replaces the completed check-in in place and reuses the existing guarded plan action. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **3T only**, the readiness math, counterfactual attribution, grounded-copy and live visual regression gate. Preserve the completed rack-swap, rest and readiness behavior. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Morning-verdict work item 3B verification on 2026-09-21: app typecheck passed; 440 app tests passed across 34 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. Pure tests cover every verdict and consequence kind, same-split plan attribution, note-flag exclusion, already-crossed thresholds and action guards. Live verification in the built app saved a first-day 1/1/1 check-in, replaced the form in place with the red “A low morning” card, showed the no-schedule consequence, and passed visual inspection. Work item 3T is next.
