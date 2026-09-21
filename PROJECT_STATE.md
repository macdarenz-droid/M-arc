# M/ARC project state

Updated 2026-09-21. Branch: `claude/phase-9-readiness-preference-ckw91g`.

## Current phase

Escobar proactive-coach implementation has started from documentation commit `e694f004aeb9eb38e6ba30bcaf080b942d75cce3`. F0, rack swap (1A-1T), effort-graded rest (2A-2T), morning verdict (3A-3T), the session-plan capture prerequisite (10A/10AT), live autoregulation (4A-4T), warm-up ramp (5A-5T), chronic skip (6A-6T), closed-week review (7A-7T), lift trajectory (8A-8T), and unfinished coach items (9A-9T) are complete in this checkout. Changed-evidence reopening and reachable offline saved drafts have passed the full feature gate. Claude Opus 5's ranking and architecture remain the contract.

Read `docs/escobar-roadmap/HANDOFF.md` for the spec index and `docs/escobar-roadmap/02-ROUTING-PLAN.md` for dependencies/model routing. Continue with **10B**, session debrief calculation, its execution detector, report registration and grounded words/metrics. Follow `MODEL_ROUTER.md`, copied unchanged from the owner's supplied protocol.

## Fixed decisions

- Pure deterministic brain; LLM phrases only. Offline-first; no automatic new model calls.
- Every metric has real provenance. New proposals change data only on explicit acceptance.
- Shared live.ts is written once; direct imports. Feature 10's immutable plan capture precedes consumers needing historical targets, while its UI can ship later.
- Actual logs, original targets and accepted target adjustments remain distinct. Legacy unknowns are not backfilled.
- Raw body measurements stay on device; no medical diagnosis or injury prediction.
- Earlier intelligence-audit tiers 0–3 are shipped and outside scope.

## Validation and next handoff

Warm-up-ramp feature gate on 2026-09-21: both typechecks passed; 495 app tests passed across 39 files, including 15 focused ramp/dismissal tests and the unchanged 50-persona finite-number fuzz sweep; 87 proxy tests passed with eight existing skips; production build passed; and the five-theme visual/migration gate passed without page errors. The live flow verifies kg/lb rendering, 360 px wrapping, keyboard Hide, navigation/reload persistence, unchanged live/history counts and exactly two saved actual sets rather than five rows containing the three suggestions. Work item 6A is next.

Chronic-skip work item 6A verification on 2026-09-21: app typecheck passed and 89 focused detector, planner, report, wording, principle and fuzz tests passed. Five recent comparable split sessions are required; confirmed saved-plan and explicitly limited legacy paths never mix. Only confirmed evidence produces a split-scoped cut or same-area swap, both bounded by the existing report swap budget. Work item 6B is next.

Chronic-skip work item 6B verification on 2026-09-21: app typecheck passed and 13 focused apply/planner tests passed. Acceptance rejects a missing source split or exercise, a duplicate/unknown replacement, a malformed cut and removal of the split's sole exercise. A valid template edit preserves the active-session snapshot and all historical sessions; failed stale actions write no acceptance memory. Work item 6C is next.

Chronic-skip work item 6C verification on 2026-09-21: app typecheck, 26 focused wording/planner/apply tests and a production build passed. Confirmed cut/swap alternatives share one card, two explicit action buttons and one group dismissal; its sheet shows the exact split diff. The legacy comparison exposes only read-only `Review in Train` navigation. Work item 6T is next.

Chronic-skip feature gate on 2026-09-21: both typechecks passed; 509 app tests passed across 41 files, including 44 focused skip/report/apply/wording/principle tests and the unchanged 50-persona finite-number fuzz sweep; 87 proxy tests passed with eight existing skips; production build passed; and the five-theme visual/migration gate passed without page errors. The live flow covers grouped cut/swap actions, exact diff sheet, shared dismissal, explicit acceptance, unchanged history/active work, legacy restore and read-only Train navigation at mobile width. Work item 7A is next.

Closed-week review work item 7A verification on 2026-09-21: app typecheck passed and 34 focused review, detector, report, wording and principle tests passed. Monday and Sunday boundaries, same-day double sessions, partial/zero baseline weeks, four-week median gate, secondary-muscle half credit, current-schedule labelling, edits/deletes/imports, finite scalar metrics and empty history are covered. Work item 7B is next.

Closed-week review work item 7B verification on 2026-09-21: app typecheck, 23 focused review/report/wording tests and production build passed. Today retains current-week counters under literal `Week in progress` copy, then mounts one offline closed-week card with a local Details toggle. The computed projection observes only sessions, custom exercises, schedule, splits and the day key. Work item 7T is next.

Closed-week review feature gate on 2026-09-21: both typechecks passed; 520 app tests passed across 43 files, including unique valid-session provenance for the closed and baseline windows; 87 proxy tests passed with eight existing skips; production build passed; and the five-theme visual/migration gate passed without page errors. The live flow covers sufficient-history comparison, kg/lb detail rendering, 360 px wrapping, reload-collapse behavior and legacy import recomputation. Work item 8A is next.

Lift-trajectory work item 8A verification on 2026-09-21: app typecheck and 10 focused arithmetic/boundary tests passed. The pure module accepts only known weighted exercises, collapses distinct-day top loads, converts the existing relative trend through its identical recency-weighted mean, anchors projection and expiry to the last observation, and returns null for insufficient, unsupported, non-rising or over-horizon evidence. Work item 8B is next.

Lift-trajectory work item 8B verification on 2026-09-21: app typecheck, 43 focused trajectory/detector/wording tests and production build passed. Only projected `progressing` findings outside an active easier week gain the seven additive scalar fields; expired, absent and deload cases retain the old metrics. Offline words render rate, evidence days, next step and anchored dates in the selected unit without changing the numeric/date grounding allowlist. Work item 8C is next.

Lift-trajectory work item 8C verification on 2026-09-21: app typecheck and production build passed. History Stats memoizes the selected exercise projection on sessions, exercise, custom exercises, local day and active-deload state, then renders one wrapping projected or expired hint beneath the existing history list. Sparkline, trend score, records and targets are unchanged; appearance and expiry write no state. Work item 8T is next.

Lift-trajectory feature gate on 2026-09-21: both typechecks passed; 533 app tests passed across 44 files, including scalar/date-grounding separation; 87 proxy tests passed with eight existing skips; production build passed; and two five-theme visual/migration runs passed without page errors. The isolated live flow covers projected, expired and active-deload states, kg/lb, keyboard Stats access, 360 px wrapping, navigation/reload, export/restore, unchanged state and zero external requests. Work item 9A is next.

Unfinished-item work item 9A verification on 2026-09-21: app typecheck and 12 focused pure tests passed. Dismissal snapshots bind canonical action content and actual supporting sessions; reopening requires 21 days, two new valid working sessions and stronger severity or nondecreasing-severity confidence, and rejects edited/deleted evidence, changed actions, expiry and consumed offers. Pending assistant drafts are newest-first with stable turn fingerprints, explicit satisfied/dismissed omission and unavailable changed-reference rows. Work item 9B is next.

Unfinished-item work item 9B verification on 2026-09-21: app typecheck and 115 focused report, lifecycle, normalization, wire and stale-thread tests passed. The bounded device-only ledger defaults and normalizes safely, old counts without snapshots remain suppressed, accepted cooldowns still win, and reopened offers are consumed only by explicit accept/dismiss. Proposal actions validate expiry and current targets before writing; stale saved-item indices cannot mutate an evicted turn. Local fingerprints, dismissal evidence and draft flags remain outside both remote payloads. Work item 9C is next.

Unfinished-item work item 9C verification on 2026-09-21: app typecheck, 551 app tests across 45 files, production build and the five-theme visual/migration gate passed. Coach shows at most three unfinished typed items before Suggestions with Review all for overflow; saved-only Ask review has no composer or request path, and every apply rechecks the exact turn fingerprint. The live flow covers keyboard review, 360 px, create/schedule/goal apply, explicit dismissal, reload persistence, zero external requests and stale goal Undo refusal. Work item 9T is next.

Unfinished-coach-items feature gate on 2026-09-21: both typechecks passed; 552 app tests passed across 45 files; 87 proxy tests passed with eight existing skips; production build passed; and the five-theme visual/migration gate passed without page errors. The live flow covers a three-item offline queue and Review all, 360 px and keyboard access, saved split/schedule/goal apply paths, explicit draft dismissal, stale Undo protection, reload persistence, backup export/restore, changed-evidence reappearance and once-only accept/dismiss consumption, with zero external calls. Work item 10B is next.
