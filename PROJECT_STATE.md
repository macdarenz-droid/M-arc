# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), and morning verdict (3A–3T) are complete in this checkout. `src/brain/readiness.ts` owns the pure 28-day personal baseline, verdict bands and drift calculation. `src/brain/coach/verdict.ts` proves whether the saved check-in moved a recovery threshold before it describes a consequence. Today replaces the completed check-in in place and reuses the existing guarded plan action. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **10A only**, immutable original workout targets, stable entry identity and guarded History edits; then 10AT. Preserve the completed rack-swap, rest and readiness behavior. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Morning-verdict work item 3T verification on 2026-09-21: app typecheck passed; 445 app tests passed across 34 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; the production build passed; and the five-theme screenshot/migration gate passed without page errors. Named adversarial tests cover duplicate, malformed and future readiness rows, split-switch and note attribution, exact-muscle provenance, neutral absolute-green copy and action guards. The mobile silent-black capture shows the red verdict, sourced 60%/78% recovery pair and honest no-plan-change consequence without overflow. Morning verdict is complete; work item 10A is next.
