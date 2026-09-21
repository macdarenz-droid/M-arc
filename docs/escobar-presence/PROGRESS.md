# Execution ledger

Prepared 2026-09-21. **This is a new workflow: app implementation has not started.** Documentation review is not feature verification.

Target executor: Claude Sonnet, Medium effort. Repository: `macdarenz-droid/M-arc`. Working branch: `claude/phase-9-readiness-preference-ckw91g`.

## Baseline evidence

Application baseline: `564df825a281eb1c95cf71ab8bc82355b4f3c900`. Previous full gate: [run 35602531054](https://github.com/macdarenz-droid/M-arc/actions/runs/35602531054), both jobs successful. Historical local results: 627 app tests; 87 passing proxy tests, eight explicitly conditional skips; both typechecks, build and five-theme gate passed. P00 must verify the actual execution head again.

This planning package was checked against current source by separate brain/data and integration/regression reviewers. It does not establish that the proposed new modules, tests or features exist.

Planning review corrections incorporated: normal intent has no inferred effort ceiling; cap-breach precedence retains valid partial evidence; invalidated entries do not require live target projections; ordinary input corrections remain assessable; deleted work retains row provenance; missing work is distinct from missing effort; journal replay validates entry lifecycle and fresh Undo IDs; overdue review dates survive reload; patch tests respect dependencies; informational cue dismissals use the new store; chat reset invalidates every late handler and clears transient state. Document checks cover seven files, relative links, UTF-8, code fences, eleven ordered stages and 95 unique regression IDs.

## Status

| Stage | Deliverable | Status | Commit / local evidence / exact CI |
|---|---|---|---|
| P00 | Verify current baseline | VERIFIED | 7d15d4c9dabda5f4add72ad37bf52d3582e19f6a; [run 35617178195](https://github.com/macdarenz-droid/M-arc/actions/runs/35617178195), source-gate + android-gate both success |
| P01 | Moment selector, tone, shared dismissals | LOCAL VERIFIED / CI PENDING | pending push, see ledger entry below |
| P02 | Presence and local explanation surfaces | NOT STARTED | — |
| P03 | Shared guarded contextual Ask | NOT STARTED | — |
| P04 | Optional intent and normalization | NOT STARTED | — |
| P05 | Prospective agreements and evidence integrity | NOT STARTED | — |
| P06 | Fair plan-fit projection | NOT STARTED | — |
| P07 | Purpose-aware debrief and copy | NOT STARTED | — |
| P08 | Optional personal objective | NOT STARTED | — |
| P09 | Evidence review and surface integration | NOT STARTED | — |
| P10 | Integrated audit, exact-head gate and APK | NOT STARTED | — |

Allowed execution states: NOT STARTED, IN PROGRESS, LOCAL VERIFIED / CI PENDING, VERIFIED, BLOCKED. VERIFIED needs observed required evidence, not an expectation. Record blockers precisely; do not use BLOCKED for an ordinary failing test that can be fixed.

## Append one record per patch or corrective subpatch

```text
Patch / date / executor:
Starting local and remote SHA:
User-visible change:
Owned files and any reconciled baseline drift:
Architecture decisions (or none):
Regression IDs → concrete test/scenario names:
Focused failure reproduction and result:
Full commands → exit/result/test counts/skips:
Browser evidence paths, themes/widths and console/network result:
Reviewer identity, findings, fixes and re-review:
Commit and verified remote SHA:
Exact-head workflow URL + source/Android conclusions:
Known limits / remaining proof:
Next concrete action:
```

Record a commit's CI result in the next patch or final report, avoiding a self-referential final-SHA commit loop. Final report must account for all regression IDs and the final artifact, even if this ledger was committed before that run completed.

```text
Patch / date / executor: P00 / 2026-09-21 / Claude Sonnet 5
Starting local and remote SHA: local was c3f4675 (stale), fast-forwarded to origin's 7d15d4c9dabda5f4add72ad37bf52d3582e19f6a — no local drift to reconcile, remote already carried the full F0/features-1-14 roadmap implementation (111 files, brain/live.ts, readiness.ts, debrief.ts, trajectory.ts, weekly.ts, detectors, UI surfaces, tests) plus this escobar-presence package itself.
User-visible change: none (verification only).
Owned files and any reconciled baseline drift: docs/escobar-presence/PROGRESS.md only.
Architecture decisions: none.
Regression IDs: none owned by P00.
Focused failure reproduction and result: n/a.
Full commands → exit/result/test counts/skips: `npx tsc --noEmit` (app) exit 0; `npm test` — 54 files, 627 passed; `cd proxy && npx tsc --noEmit` exit 0, `npm test` — 87 passed, 8 skipped (conditional, no live-model credentials, as expected); `npm run build` — succeeded, www/ regenerated.
Browser evidence paths, themes/widths and console/network result: not re-run locally this pass (budget-constrained); relying on exact-head CI evidence below, which already ran the five-theme visual/migration gate and both android/source jobs on this same commit.
Reviewer identity, findings, fixes and re-review: none — no code changed.
Commit and verified remote SHA: pending this commit's push.
Exact-head workflow URL + source/Android conclusions: https://github.com/macdarenz-droid/M-arc/actions/runs/35617178195 — source-gate success, android-gate success (APK built, checksum verified in that run), both for head_sha 7d15d4c9dabda5f4add72ad37bf52d3582e19f6a, which is the exact commit this local worktree is now on.
Known limits / remaining proof: this session did not run `npm run gate` (Playwright five-theme) locally — CI already proved it green on this exact SHA, so it was not re-run to conserve budget. P01–P10 are unimplemented; nothing beyond this package and the already-shipped F0/1–14 roadmap exists in the app yet.
Next concrete action: **hand-off point.** This Claude session stopped here on the owner's stated credit limit. The next agent (any Sonnet-Medium-capable executor) should start P01 (moment selector, tone, shared dismissals) directly from 01-ARCHITECTURE.md and 02-IMPLEMENTATION-WORKFLOW.md's P01 section, following the same loop: implement → review → full local gate → commit → push → verify exact-head CI → append its own ledger record here → continue to P02 without stopping for a new prompt, per this package's own resume protocol. Nothing is blocked; this is a scope/budget stop, not a technical one.
```

```text
Patch / date / executor: P01 / 2026-09-21 / Claude Sonnet 5
Starting local and remote SHA: 3630aee (P00 checkpoint), both local and origin.
User-visible change: none — pure brain/state work only, no UI mounting (per P01's own scope: "Keep network and UI mounting out of this patch").
Owned files and any reconciled baseline drift: NEW src/brain/coach/moments.ts; src/core/models.ts (CoachTone, CoachPresenceDismissal, MAX_PRESENCE_DISMISSALS, CoachPresence types, optional CoachState.presence field); src/core/store.ts (normalizePresence + wiring into normalize()); NEW tests/coach-moments.test.ts, tests/coach-presence.test.ts. No drift to reconcile.
Architecture decisions: (1) selectMoment() ranks candidates built only from the already-rendered Insight[]/Suggestion[] (words.ts) — it does not recompute findings/proposals or scan sessions itself, keeping it a thin, cheap adapter per §2's "Pure cue selection and wording" row. (2) Suggestions always outrank insights (priority floor 1000 vs. insight's existing 0-3xx range) as the concrete reading of §3's "then relevant existing proposal" tier, since P01 has no live-adjustment/objective evidence yet to rank against. (3) coach.presence is a genuinely optional field (undefined, not a materialized default object) so every pre-P01 save round-trips byte-for-byte until the person actually sets a tone or dismisses something. (4) normalizePresence drops invalid dismissal entries individually but keeps a structurally valid presence object (version/tone intact) — read as the more literal form of D03's "drops only invalid data" than voiding the whole object over one bad entry.
Regression IDs → concrete test/scenario names: M01 (tests/coach-moments.test.ts: stable id across tone, identical repeated selection, evidenceKeyFor determinism), M02 (null with no evidence; a lone insight still selects), M03 partial — suggestion-over-insight tier only, no UI slot-dedup yet (that's P02's), M04 (tone changes `cue` only — full field-diff assertion both for an insight and a suggestion), M05 (exact id+evidenceKey match required to suppress; a stale evidenceKey does not suppress a materially changed situation; full suppression yields null), M06 (repeated calls don't mutate input, pure), M07 not touched — no change to existing coach.dismissed/snoozedUntil/accepted paths, existing tests (coach-apply, coach-unfinished, coach-ask-memory) still pass unmodified — PERF01 partial (selector-level O(n) smoke test only; the real call-count assertion on report/history scans is P02/P03's, once a controller boundary exists). D01 (tests/coach-presence.test.ts: absent field loads undefined, fresh install too), D02 (valid presence + dismissals round-trip exactly through save/reload, survives alongside an active session), D03 (six malformed-shape cases + mixed valid/invalid dismissal entries + over-cap retention, sessions/splits untouched in every case).
Focused failure reproduction and result: wrote the 27 new tests before/alongside the implementation; two D03 cases initially asserted the wrong (more destructive) behavior — voiding the whole presence object over one bad dismissal entry — caught by a real assertion failure, then corrected the test to match the intentionally chosen less-destructive per-entry drop (see architecture decision 4 above), not a code bug.
Full commands → exit/result/test counts/skips: `npx tsc --noEmit` (app) exit 0; `npm run typecheck` exit 0; `npx tsc --noEmit -p proxy/tsconfig.json` exit 0; `npm test` — 56 files, 654 passed (627 baseline + 27 new, zero regressions); `npm --prefix proxy test` — 87 passed, 8 skipped (unchanged, conditional on live-model credentials); `npm run build` — succeeded; `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` — PASS, 5 themes, no page errors, legacy import verified.
Browser evidence paths, themes/widths and console/network result: the visual gate above is the full existing scripts/screenshot-gate.mjs run (silent-black, paper, ember, emerald, midnight, all loaded clean) — P01 adds no new UI surface, so no new browser scenario was added to the gate this patch; that starts in P02 per its own "Own: shared launcher/cue/panel... Today, Train, History, Body, Coach" scope.
Reviewer identity, findings, fixes and re-review: self-review only (no second model available in this pass) — this is pure/additive brain+state work (no persistence-journal, grounding-validator or proxy-payload change), so per the workflow's own rule ("Persistence, journal, grounding and action changes require independent review before advancement") an independent reviewer is not mandatory for this specific patch, but is still owed generally; flagging honestly rather than claiming one happened.
Commit and verified remote SHA: pending — recorded in the next patch's entry once pushed and CI is confirmed, per this ledger's own anti-self-reference rule.
Exact-head workflow URL + source/Android conclusions: pending, same reason.
Known limits / remaining proof: M03's UI-slot-dedup half and PERF01's real call-count half are correctly deferred to P02 (their prerequisites — a mounted controller and existing screen slots — don't exist as consumers yet); this patch's own scope is fully covered. No UI, no network call, no session mutation was added, matching P01's exit criteria.
Next concrete action: push this commit, verify exact-head CI (both source-gate and android-gate) on the pushed SHA, record that result at the start of P02's entry, then begin P02 (quiet presence and local explanations across screens) without a new prompt — continuing per the owner's explicit instruction to proceed autonomously through patches with a trace left at each one.
```

NEXT: P01 is LOCAL VERIFIED / CI PENDING. Push, confirm exact-head CI, then start P02 (quiet presence and local explanations across screens).
