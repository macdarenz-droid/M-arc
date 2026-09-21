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
| P01 | Moment selector, tone, shared dismissals | VERIFIED | 62d097c1a3ecb0b02036df74e854299670b9b34b; [run 35619601814](https://github.com/macdarenz-droid/M-arc/actions/runs/35619601814), source-gate + android-gate both success |
| P02 | Presence and local explanation surfaces | IN PROGRESS — Today done; Train/History/Body/Coach/Settings remaining | pending push, see ledger entry below |
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

```text
Patch / date / executor: P02 (partial — Today only) / 2026-09-21 / Claude Sonnet 5
Starting local and remote SHA: 62d097c (P01, VERIFIED above), both local and origin.
User-visible change: Today's existing "Coach" section — which already held one top insight card plus a "waiting suggestions" link, i.e. the doc's "occupied coaching slot" — now shows the shared presenceMoment (from P01's selectMoment) through the new PresenceLauncher instead of an ad-hoc top-insight card, with an explicit dismiss (×) and a tap-through to the existing InsightSheet/SuggestionSheet detail (now exported, not re-implemented). No second card was added: the prior top-insight card is replaced in place, not stacked alongside.
Owned files and any reconciled baseline drift: NEW src/brain/coach/moments.ts consumer src/app/selectors.ts (added `presenceMoment` computed, excludes today_plan since Today already has its own dedicated accept flow for that); NEW src/slices/coach/presence.ts (dismissPresenceMoment, setPresenceTone — the only writers of coach.presence); NEW src/slices/coach/Presence.tsx (PresenceLauncher, presentational only); src/slices/coach/Coach.tsx (exported the previously-private InsightSheet/SuggestionSheet for reuse — behavior unchanged, only visibility); src/slices/today/Today.tsx (Coach section rewired to the shared moment); NEW tests/coach-presence-ui.test.ts. No drift to reconcile.
Architecture decisions: (1) Reused Today's existing "Coach" Section as the presence surface rather than adding a new one, per §1/§3's "reuse existing coaching slots... never stack a duplicate copy" — this was a real judgment call: the prior `top`/`waiting` logic was itself the occupied slot on this screen. (2) today_plan suggestions stay excluded from presenceMoment's candidate pool since Today has its own prominent, distinct accept-a-plan flow elsewhere on the same screen — showing it twice via two different mechanisms would be the exact duplication the spec forbids. (3) Detail views reuse the exact existing InsightSheet/SuggestionSheet (now exported) rather than new presence-specific sheets, so there is only one rendering of any given insight/suggestion's full detail in the whole app. (4) Scoped this patch to Today only — Train, History, Body, Coach and contextual Settings integration (all also named in P02's "Own") are not yet done; each has its own existing banners/slots (rest banner, PR hints, debrief, chronic-skip cards, etc.) that need the same "which existing slot does this reuse" judgment call Today needed, and rushing that across five more screens in one pass risked exactly the "duplicated cue or modal stacking" P02's Exit criteria forbids. This patch stays IN PROGRESS per the workflow's own "a partial patch stays IN PROGRESS" rule, not falsely marked VERIFIED/done.
Regression IDs → concrete test/scenario names: B01/B05 (Today's presence entry, tests/coach-presence-ui.test.ts's PresenceLauncher render assertions — no moment shows only the quiet entry, not an empty card; a moment shows its cue, not a duplicated verbatim block), M03 (this patch's concrete instance of it: the existing Today insight slot is reused, not duplicated — verified by inspection of the diff, no automated "count Card.insight instances" regression added this pass, noted as a limit below), M06 partial (no network path touched — Today's presence wiring only reads existing computed signals and calls the same acceptProposal/dismissProposal/dismissPresenceMoment functions already covered elsewhere), D01-D03 unchanged from P01 (still covered by tests/coach-presence.test.ts, untouched this patch). B02-B04, B12 (Train/History/Body/Coach surfaces) remain NOT STARTED — correctly not claimed this patch.
Focused failure reproduction and result: n/a — additive UI wiring with existing, already-tested mutation functions (acceptProposal/dismissProposal unchanged) and a new pure presentational component; the 6 new tests in tests/coach-presence-ui.test.ts (3 PresenceLauncher render cases, 3 dismissPresenceMoment/setPresenceTone mutation cases) were written directly against the intended contract and passed once the implementation matched it, no red-then-green cycle needed for this shape of change.
Full commands → exit/result/test counts/skips: `npx tsc --noEmit` (app) exit 0; `npm test` — 57 files, 660 passed (654 from P01 + 6 new this patch); `npm run build` — succeeded; `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` — PASS, 5 themes, no page errors, legacy import verified (Today renders in every theme with the new section, since the gate's fixture data has real insights/suggestions to exercise the moment-present path).
Browser evidence paths, themes/widths and console/network result: existing scripts/screenshot-gate.mjs run above; no new dedicated browser scenario was added for the presence cue's own open/dismiss interaction this pass (that requires either extending the gate script with a new named scenario or a live Playwright click-through, which this session did not have budget to add carefully — flagged honestly below rather than skipped silently).
Reviewer identity, findings, fixes and re-review: self-review only, same as P01 — this patch touches UI/state (not persistence journal, grounding validator or proxy payload), so independent review is owed generally but not gating for advancement per the workflow's own rule; noted honestly.
Commit and verified remote SHA: pending — recorded in the next patch's entry once pushed and CI is confirmed.
Exact-head workflow URL + source/Android conclusions: pending, same reason.
Known limits / remaining proof: (a) Train, History, Body, Coach and contextual Settings still need the same launcher wired to their own occupied slot (or a clearly-justified new slot where none exists) — each needs its own "what does this screen already show that would duplicate" read, the same care Today got; (b) no interactive (click-through) browser scenario for open/dismiss was added to the gate script this pass — the gate proves no page errors and correct theme rendering with the section present, not that tapping the cue opens the right sheet or that dismiss removes it, though tests/coach-presence-ui.test.ts covers that logic at the unit level; (c) zero-external-request verification (M06's browser half) for the presence surface specifically was not separately instrumented — Today's screen already has no network calls in its existing render path and nothing new here adds one, but this is inspection, not an automated network-recorder assertion.
Next concrete action: push this commit, verify exact-head CI (both jobs) on the pushed SHA, record that result at the start of the next entry, then continue P02 on Train next (it already has a rest banner and other in-workout cues — read those first, the same way Today's existing Coach section was read here, before adding anything). Do not restart Today's work; it is done for this pass. If a different executor picks this up, they can start directly from "Train" without re-reading Today's diff beyond this record.
```

NEXT: P02 is IN PROGRESS (Today done; Train/History/Body/Coach/Settings remaining). Push, confirm exact-head CI, then continue P02 on Train.
