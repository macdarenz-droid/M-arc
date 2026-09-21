# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A–1T), and effort-graded rest (2A–2T) are complete in this checkout. `src/brain/live.ts` owns pure substitute ranking, effort-graded rest calculation and post-rest next-step projection. The session layer records rest ownership and regrades without restarting elapsed time; the selector and banner show the exact next target without recomputing it on each clock tick, and manual adjustments report the total the clock actually honours. Fake-clock regressions cover ownership, expiry, pause/resume, topology changes and every retime path. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **3A only**, the personal-readiness module, recovery counterfactual and detector integration. Preserve the completed rack-swap and rest behavior. Keep F0 direct-imported and pure. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Rest work item 2T verification on 2026-09-21: app typecheck passed; 415 app tests passed across 32 files; proxy typecheck passed; 87 proxy tests passed with eight existing skips; the production build passed; and the five-theme screenshot/migration gate passed with no page errors. The gate now uses Vite's runner config loader on sandboxed Windows and explicitly waits for the live rest banner before capturing it. The focused file has 20 cases, including expired-rest non-revival, paused adjustment, ownership and topology invalidation. Earlier live verification in the built app showed the next-set headline, a 2:15 max-compound grade with its +45s reason, and a manual +15 override changing the true total to 2:30 while hiding the reason. Rack swap and effort-graded rest are ready; work item 3A is next.
