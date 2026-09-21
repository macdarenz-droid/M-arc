# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), effort-graded rest (2A–2T), morning verdict (3A–3T), the session-plan capture prerequisite (10A/10AT), and live autoregulation (4A–4T) are complete in this checkout. Explicit set events may show one local offer; accepted targets persist separately from immutable originals and feed both row placeholders and the rest banner. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **5A**, the pure warm-up-ramp brain and its display component, then 5B/5T. Reuse captured/effective targets and preserve live-autoregulation decisions. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Live-autoregulation work item 4T verification on 2026-09-21: app typecheck passed; 480 app tests passed across 37 files, including the unchanged 50-persona finite-number fuzz sweep; proxy typecheck passed; 87 proxy tests passed with eight existing skips; the production build passed; and the five-theme screenshot/migration gate passed without page errors. The built flow verifies exact offer copy, acceptance, dismissal, reload persistence, row/rest agreement, kg/lb rendering and 360/390 px layout. Named adversarial tests cover protected drafts, stale source/session/identity, pause/done/bounds, replacement opportunity, legacy absence, structural edits and cross-exercise import metadata. Feature 4 is complete; work item 5A is next.
