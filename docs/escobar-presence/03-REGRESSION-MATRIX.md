# Required regression proof

Map every ID to a named test or browser scenario and record its result in PROGRESS. These are requirements, not claims that new tests already exist. Keep existing suites. Use the [architecture](01-ARCHITECTURE.md) for exact semantics; do not infer a stricter policy from a short test title.

## Presence, tone and performance

| ID | Required behavior | Suggested test home |
|---|---|---|
| M01 | Same meaningful evidence has stable ID across surfaces, tones and clock ticks; deterministic tie-break | NEW `tests/coach-moments.test.ts` |
| M02 | Only one eligible cue; no useful evidence means null, not filler | Same |
| M03 | Existing readiness/rest/PR/debrief slot is reused or suppresses duplicate presence; confirmations/input keep priority | Same + browser |
| M04 | Steady/Direct changes copy only; compare target/proposal/confidence/action/evidence equality | Same + existing `coach-words` |
| M05 | Dismiss once across tabs/reload; only meaningful evidence change requalifies; bounded retention works | Same + persistence |
| M06 | Selector/render/open/navigation never changes durable training facts or makes a request | Same + browser network recorder |
| M07 | Existing proposal dismissal/cooldown/snooze/once-only behavior survives | Existing `coach-unfinished`, `coach-apply`, `coach-ask-memory` |
| PERF01 | Tab, tone, Ask typing, dismissal UI and rest second ticks reuse report/history scans; no per-row repeated exerciseHistory scan | Focused call-count test on real selector/controller boundary |
| PERF02 | A relevant workout/history/goal mutation recomputes the dependent facts once and changes the cue appropriately | Same |

## Optional persistence and intent

| ID | Required behavior | Suggested home |
|---|---|---|
| D01 | Absent new fields load with safe defaults; old workouts/plan/debrief survive unchanged | `models`, `migrate`, `session-plan` |
| D02 | Backup export/import and reload round-trip new fields and active workout without losing logs | Unit + mandatory browser gate |
| D03 | Malformed presence/objective/assessment metadata drops only invalid optional data, not history | `models` + NEW intent/objective tests |
| D04 | Assessment rejects unknown version, oversized metadata, duplicate IDs, cycles, dangling links, invalid timestamps/indices; lifecycle replay rejects double-add, active-destination replacement, double-retire and targets after retirement | NEW `tests/session-intent.test.ts` |
| D05 | Unexplained journal/projection mismatch makes the affected valid entry unassessable; intentional invalidated/retired entries need no live override; other valid evidence survives | Same + agreement tests |
| D06 | Metadata overflow is explicit unavailable, not a truncated effective plan | Same |
| D07 | Viewing guidance/old imports never backfills assessment or objective | Same + browser |
| I01 | New normal session captures null effort cap before work; no RIR-to-cap invention | NEW `session-intent` |
| I02 | New session during already accepted active deload captures actual easier intent, saved cap and adjusted targets | Same |
| I03 | Old saved AND resumed old active sessions never acquire intent | Same |
| I04 | Later goal/deload/day change cannot rewrite captured intent/targets | Same |
| I05 | Every start path agrees; resume is not treated as a new start | `session-plan` + browser |
| I06 | Deload start/end boundary uses the app's existing date policy; fixed UTC/local midnight cases | `dates`, intent tests |
| I07 | Normal cap absent does not require ratings for complete-plan fit; easier cap does | `plan-fit` |

## Accepted changes and deleted evidence

| ID | Required behavior | Suggested home |
|---|---|---|
| J01 | Target acceptance cannot retarget a completed OR partially drafted row (kg-only, effort-only, duration/distance fields) | `live-adjustment-apply` |
| J02 | Stale session/entry/evidence offer leaves logs, journal, overrides and accepted targets all unchanged | Same |
| J03 | Accepted change updates journal/projections atomically and applies only to named remaining indices | Same |
| J04 | Append preserves prior overrides through UI/reload/finish; appended work is extra until explicitly adopted | `session-plan` + browser |
| J05 | Adopted extra row has an effective target and no fabricated original target; historical indices stay valid within metadata bounds after live rows change | NEW `tests/plan-agreements.test.ts` |
| J06 | Replacement chains count final obligations once; add-below retains original plus new obligation | Same + `plan-fit` |
| J07 | Skip remains expected; approved untouched removal retires obligation; removing everything yields insufficient evidence | Same |
| J08 | Ordinary same-row retyping/effort toggle stays assessable; sticky seenWorkingRows survives reload; structural deletion, clear-then-remove/swap or previously working row empty at finish becomes lost evidence | Same + History tests + browser |
| J09 | Finish filters an empty middle row but actualSetIndices still pairs later work with the correct original row | `session-plan`, `debrief` |
| J10 | History value/effort edits recompute without changing agreement; structural/final-row deletion invalidates affected entry | `effort-repair`, session-edit tests |
| J11 | Stale History save/repair cannot overwrite newer saved session or resurrection after delete | Existing effort/history tests |
| J12 | Undo cannot clear new replacement work; A→B→A2 uses fresh entry ID and retains coherent journal/retirement facts through reload/finish | `live-substitutes` + browser |

## Fair feedback truth table

Use valid history-backed targets/mappings unless the row explicitly changes that assumption. Assert separate PR/achievement output as well as label and reason codes.

| ID | Fixture | Expected result |
|---|---|---|
| F01 | Normal, null cap, all named work meets target, ratings absent | Followed the plan; no claimed effort compliance |
| F02 | Easier, saved Easy cap, work meets target, ratings Easy | Followed the plan |
| F03 | Easier, new real PR and linked Max rating | Harder than planned; PR stays visible |
| F04 | Extra reps at comparable load within cap, no unadopted extra rows | Meets target; extra reps alone are not excessive intensity |
| F05 | Valid accepted reduction before remaining work; all effective targets met | Followed the adjusted plan; original shown unchanged |
| F06 | Different unaccepted load, no witnessed cap breach | Not enough information, different-load reason |
| F07 | Saved cap but missing/invalid effort | Not enough information, required-effort reason |
| F08 | One valid cap breach plus separate unknown coverage | Harder than planned with explicit incomplete-coverage reason |
| F09 | Legacy or malformed assessment | Not enough information; ordinary debrief and PRs remain |
| F10 | Starter/unavailable replacement target | Not enough information, never target failure |
| F11 | Valid fully assessable rows; one expected row never logged or one below target; include easier/capped case with all logged ratings known | Less work than planned; absent row is not also missing effort; factual counts, no claim the user did no exercise |
| F12 | Removed/replaced chain with valid journal; final expected rows all met | Final obligation counted once; adjusted verdict |
| F13 | Unadopted extra work, unsupported assisted/conditioning mode or invalid mapping | Not enough information unless a separate valid witnessed breach supports F08 |
| F14 | Structural deletion/invalidation, including retired entry with cleared evidence | Not enough information unless separate surviving valid work supports F08; invalid mapping itself cannot witness a cap breach |
| F15 | Identical canonical workout viewed/entered in kg and equivalent lb | Same classification/reasons; tolerance in canonical kg |
| F16 | Empty expected and actual work after accepted removals | Not enough information, never complete-plan success |

Suggested NEW `tests/plan-fit.test.ts`; retain existing `debrief`, `prs`, `coach-execution`, `near-miss` tests. Add malformed journal/mapping fuzz cases within bounded metadata sizes. Confirm expected-row totals are independent of debrief.plannedSets and filtered display array positions.

## Shared Ask and privacy

| ID | Required behavior | Suggested home |
|---|---|---|
| A01 | Open from every surface without submission; one shared thread, composer draft and send state | NEW controller tests + browser |
| A02 | Remote-off blocks send inside the handler, including an already open sheet after setting changes | `ai-ask`/controller + browser |
| A03 | Navigation/close/reopen cannot double-send or silently discard draft | Browser |
| A04 | Deleted/edited selected session/exercise is freshly resolved; stale context cannot apply an action | Controller + existing apply tests |
| A05 | Clear/reset/restore clears transient draft/context/errors/review selection; old success/error/finally cannot modify replacement conversation or newer sending state | `coach-ask-memory` + browser |
| A06 | Question prefill is visible/editable; 300-char limit never secretly truncates typed words for a prefix | `ai-ask` + browser |
| A07 | Captured payload has no new top-level keys, raw body/sets/plan arrays/objective prose/fingerprints; no hidden question concatenation | `ai-ask`, `coach-explainer`, `proxy/test/handler.test.ts` |
| A08 | Existing allowed facts/caps/numeric grounding remain; invented personal numbers rejected | Existing Ask/grounding tests |
| A09 | Valid mocked reply, quota, timeout, offline and malformed reply: no duplicate apply/automatic retry; local explanation survives | Browser deterministic routes |
| A10 | Saved draft review works offline; evicted turns/deleted update targets retain old guards | `coach-unfinished`, `coach-ask-memory` |

Capture the actual request body at the network boundary for A07. A UI screenshot alone cannot prove privacy. Do not loosen proxy validators to make a new context packet pass.

## Personal objectives and review

| ID | Required behavior | Suggested home |
|---|---|---|
| G01 | Save records explicit bounded objective; cancel writes nothing; no setup forced on old users | NEW `tests/coach-objective.test.ts` + browser |
| G02 | Save/update/delete/reload/backup preserve valid fields and revision semantics | Same |
| G03 | Invalid enum/day/date/oversized text/duplicate measures and missing exercise handled without dropping history | Same |
| G04 | Saving availability/equipment/objective does not alter goal, split, schedule or targets | Same |
| G05 | Goal presets and old Goal Undo remain distinct; newer choice survives stale Undo | Existing `coach-apply` + objective |
| G06 | Review uses actual dated measures/trajectories; insufficient observations show uncertainty | NEW review projection tests |
| G07 | Objective edit, exercise/session delete or changed underlying evidence invalidates open acceptance | Same + browser |
| G08 | Body trend stays local and labelled as the recorded estimate; exposure never claims measured growth | Same + A07 |
| G09 | Due date yields at most one in-app cue; overdue dates survive reload/import/unrelated edits; no notification scheduling or network calls | Same + moment tests |
| G10 | Supported proposal uses existing fresh apply/Undo; unsupported change only opens appropriate editor | Existing apply + browser |

## Existing guards: required survivors

| ID | Regression to preserve |
|---|---|
| O01 | Same-count set-value change invalidates “Swap and clear”; fresh confirmation succeeds |
| O02 | Undo never clears newly logged replacement work |
| O03 | Late note-analysis response cannot tag a newer note or show false success |
| O04 | Latest Easy set itself needs surplus before upward live adjustment |
| O05 | Adjustments only change remaining targets, not completed actuals |
| O06 | Deload/reduced targets suppress inappropriate PR challenges; actual PR suppresses near-miss |
| O07 | First session remains baseline; stale effort repair/history editors preserve newer data |
| O08 | Actual chronological predecessor and evidence agree across reverse imports, offsets, local dates, equal timestamps and future same-day sessions |
| O09 | Consistency acceptance rechecks the exact two-day patch and preserves unrelated days |
| O10 | Evicted conversation turn cannot receive stale actions; deleted update target never becomes create |
| O11 | Goal Undo cannot replace a later goal choice |
| O12 | Once-only reopening, snoozes, acceptance cooldowns and existing offline fallbacks remain |

Use current tests in `live-adjustment-apply`, `live-substitutes`, `session-note-flags`, `debrief`, `coach-execution`, `near-miss`, `effort-repair`, `consistency-drift`, `coach-ask-memory`, `coach-unfinished`, `coach-apply`, `pr-reach`, plus the existing screenshot-gate stale-swap fixture. If a survivor lacks real browser coverage, add the relevant boundary during P10; do not claim all already have browser coverage.

## Mandatory real-browser gate

Integrate all applicable scenarios into `scripts/screenshot-gate.mjs` or an imported helper invoked by `npm run gate`. Record page/console errors and external requests in EVERY new browser context. Use fixed UTC fixtures and mocked online routes; no real model calls. Inspect screenshots rather than relying only on file existence.

| ID | Scenario |
|---|---|
| B01 | Today → Train → Body → History → Coach: coherent facts, at most one proactive cue, zero unsolicited requests/persistence |
| B02 | Open/close contextual Escobar from each surface: current tab, selected lift/muscle/session, scroll and unsaved inputs survive |
| B03 | Keyboard open/close/Escape/focus return, labelled controls, no nested modal in History/Settings |
| B04 | Typing set values, rest banner and destructive confirmation: coaching never steals focus or hides primary controls |
| B05 | Dismiss across tabs/reload, tone switches, changed evidence, long messages and empty states |
| B06 | Remote off/offline: local explanations and saved review work; no external requests |
| B07 | Explicit Ask valid/invalid/quota/timeout replies, only one send, stale response after clear |
| B08 | Deleted selected entity, edit while open, backup restore/reset while Ask is in flight; old draft/context cleared and late handlers cannot clobber a new send |
| B09 | Existing stale swap, late note and chronological-comparison user flows |
| B10 | Easier workout → accepted reduction → append/reload → finish → PR plus plan-fit result → History edits/deletions |
| B11 | Objective save/cancel/review with sufficient/insufficient evidence, stale review acceptance and local body trends |
| B12 | Every new surface/state inspected in all five themes at 360/390 widths and kg/lb; add 320 stress check and wider layout; long names, keyboard, rest and expanded debrief; no horizontal overflow/hidden controls |

The baseline gate fixes both fixture and browser time; retain it. Add a separate morning UTC case and local-midnight/offset cases. Keep UTF-8 source intact and use escaped Unicode for fragile glyph assertions. Any source-format assertions must tolerate CRLF without weakening behavior checks.

## Exact-head CI and APK acceptance

After every push, verify branch ref and workflow `head_sha`; read full job status for that run. `M/ARC gate` requires successful source-gate AND android-gate, with Android still dependent on source. Source includes proxy tests and five-theme browser/migration checks. The signed release workflow does not substitute for it.

Final evidence must include the final SHA/run URL, test totals/skips, independent review findings/resolution, screenshot artifact, and non-expired `MARC-DEBUG-APK` with APK and SHA256 file. Inspect artifact contents and verify checksum when downloaded. Verify CI's built-web/bundled-source/APK-byte checks passed. Phone installation is a separate claim. A missing/expired artifact, cancelled run or unverified new head keeps delivery incomplete.
