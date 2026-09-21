# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), morning verdict (3A–3T), and the session-plan capture prerequisite (10A/10AT) are complete in this checkout. New workouts now retain the immutable targets shown at start, stable entry identity through additions and swaps, and original live-row indices at finish. Malformed optional plan metadata is discarded without losing actual workout data, while stale History editors cannot overwrite or resurrect a changed session. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **4A**, the pure live-autoregulation brain and its bands, then 4B–4T. Reuse the captured plan metadata from 10A and preserve the completed rack-swap, rest and readiness behavior. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Session-plan capture work items 10A/10AT verification on 2026-09-21: app typecheck passed; 457 app tests passed across 35 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; and the production build passed. The five-theme screenshot/migration gate passed without page errors and now also checks target stability after reload, restored lb rendering, and 360 px live-session overflow. Named boundary tests cover deload capture, deep-copy ownership, swaps/additions, empty-row indices, untouched placeholders, legacy sessions, valid and malformed imports, value-versus-row History edits, stale saves and deleted-session resurrection. Capture is complete; work item 4A is next.
