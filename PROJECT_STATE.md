# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach architecture continuation is complete; implementation has not started in this pass. The source baseline is `c3f467571f958c54e6447c7182ebf15c007d5947`. Claude Opus 5's ranking and architecture are retained. Specs 4–14, the spec 1–3 reference corrections, source inventory and 54-item routing plan are ready.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Start **F0 only**, shared live.ts pure helpers from specs 1–2: Sonnet 5 Medium / GPT-5.6 Sol Medium. Later persisted-state and grounding work is T2 with T3 review. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Docs-only change. Baseline app/proxy typecheck, 374 app tests, 87 proxy tests (eight existing skips), and build passed. Local visual/live-browser gate was blocked by unavailable Chromium and a denied download. See `03-SOURCE-VERIFICATION.md` for exact verification scope; use branch CI for remote gate status. Implementing agents must perform the entire required gate for actual feature behavior, append `docs/COACH_BRAIN.md`, commit, push, and verify the exact commit's CI before handing off.
