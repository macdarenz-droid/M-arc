# Audit findings: confirmation against main 000918e

**Status: PAUSED by the owner, 2026-10-02 ~17:30 UTC.** The owner asked (17:1x): "Check audit 3 too in my repo or other audits for founded bug and confirm it." Sources:
- audit 3: #192, `audit-3.md` on `claude/audit-3-report-20261002` @ `bc85c618`;
- improvement audit: #149, `improvement-audit.md` @ `83463cf0`.

The method is in `docs/supervisor/workflows/audit-3-confirm.js`:
- one Opus verifier per area writes scratch vitest tests that assert the correct behaviour, so each test fails on main if the bug is real;
- then one Opus skeptic re-runs every confirmed test and tries to refute it.

| Group | Findings | State |
|---|---|---|
| coach-consent | COACH 01, IMP-E02, IMP-E03, IMP-E04, IMP-E06 | **verified** (table below) |
| coach-facts | IMP-E01, IMP-E05, ENG-01 | **verified**: all 3 CONFIRMED (9 of 10 tests fail as claimed; the 10th is a control) |
| data | DATA 01, DATA 02, QA CSV 01, QA CACHE 01 | stopped mid-run; 3 scratch tests saved, no verdicts yet |
| timing | UI 05, ENG-05, ENG-02, UI-R01, UI-R04 | stopped mid-run; 3 scratch tests saved, no verdicts yet |
| history | UI-R02, UI-R06, ENG-03, ENG-04, ENG-06, ENG-07 | not started |
| schedule | UI-R03, UI-R05, BUG-38 | not started (related to BUG-38) |
| native | IMP-N01, IMP-N02, IMP-N03 | not started |
| store | PLAY 01, the custom server encryption claim | not started |

**The skeptic pass has not run.** Every verdict below is a verifier's verdict only, not final.

**Scratch tests** are in `a3-tests/<group>/`. They are stored outside `tests/`, so CI does not run them. To use them, copy them back to `tests/_a3/<group>/`, because their imports assume that location. They are evidence for builders and are never merged as they are.

**Resume:**
- In the same session: `resumeFromRunId wf_1b1d1523-fe5`. The verified groups are cached. Copy the saved tests back into the verify worktree first.
- In a new session: run `audit-3-confirm.js` with the two verified groups removed, then the skeptic over all groups.

## Verified groups (verifier output, Opus)


=== agent aca4a688f96af48c0 ===
| ID | Verdict | Evidence | Severity | Fix |
|---|---|---|---|---|
| COACH 01 | CONFIRMED | `tests/_a3/coach-consent/coach-01-retry-sharing.test.ts`. Both cases fail (`upstream_busy`, `timeout`): `AssertionError: retry body still contains body weight after sharing.body=false: expected '{"protocol":2,…' not to match /weight 80\.5/`. The retry body still has `…male, age 38 [f12], weight 80.5 [f13] kg`. A control test passes: the same messages rebuilt with `body:false` drop the weight. Code: `src/escobar/loop.ts:383-387` builds `body` and runs the redaction once. Every attempt in the loop at `:388` resends that same `body` (`:396`, retry `continue` at `:430`). The guard at `:389-390` checks only `escobar.enabled`, not sharing. | Privacy (P2). Body weight or health data is sent after the user switched that sharing off. The window is the 2 s back-off after a busy or timeout error, before any output is shown. | Build `body` inside the attempt loop, using `toRequestMessages(windowed, imageData, this.deps.getState().escobar.sharing)`, so every attempt is redacted against the current switches. Keep the enabled guard and the retry limit. |
| IMP-E02 | CONFIRMED | `tests/_a3/coach-consent/imp-e02-toast-wrong-conversation.test.ts`: `AssertionError: B's daily-quote change was reversed by A's toast: expected true to be false`. Code: `src/escobar/apply.ts:285`. The toast callback captures only `proposalId`. When tapped, `onProposal` reads whichever conversation is visible (`:273-276`) and runs that chat's `p1` inverse. Proposal IDs repeat per chat. | Wrong data change (P2). Undo reverses a setting in another chat and leaves the intended change in place. | Capture `c.id` in the toast callback. Let `onProposal` take a `conversationId`, look that conversation up from the store, and persist the decision to it without switching the visible chat. Or clear the toast when the visible chat changes. |
| IMP-E03 | CONFIRMED | `tests/_a3/coach-consent/imp-e03-profile-undo.test.ts`. (a) `insight still claims the undone 82 kg is current: expected [ 'Weight updated to 82 kg' ] to not include 'Weight updated to 82 kg'`. (b) `duplicate same-day weight rows after Undo: expected [ 81, 80 ] to deeply equal [ 81 ]` and `Undo overwrote the newer manual weigh-in: expected 80 to be 81`. Code: `src/escobar/apply.ts:168-173`. It restores `profile[field]` unconditionally (`:170`). The weightLog filter (`:172`) removes only the exact `{day,kg:82}` row, keeps the manual 81 row, and appends `logBefore` (80). `profileHistory` is never touched, and `src/brain/coach/rules.ts:445-475` still reports 82. | Data loss/corruption (P2): a newer manual weigh-in is overwritten and today gets two weight rows. Wrong information: a coach note says the undone weight was saved. | In the inverse, throw `UndoUnavailable` unless the current `profile[field]` and today's row still equal what Apply wrote. When Undo succeeds, remove only the `profileHistory` event that Apply appended (matched by identity). Keep one row per day. |
| IMP-E04 | CONFIRMED | `tests/_a3/coach-consent/imp-e04-deleted-gym.test.ts`. Three assertions fail: `Apply reported success for a deleted gym: expected 'applied' not to be 'applied'`; `profile saved under the deleted gym id: expected { lib_barbell_bench_press: {…} } to be undefined`; `orphan changed the remaining gym's bench profile: expected { unit: 'lb', … } to deeply equal { unit: 'kg', source: 'default', … }`. The test also confirms the premise that the fingerprint does not change. Code: `src/escobar/tools/actions.ts:102` fingerprints only the profile maps. `src/escobar/apply.ts:196-207` does not recheck the gym. `src/slices/workout/units.ts:77-81` (`saveProfile`) accepts any `gymId`. `src/brain/units.ts:49-53` falls back to a bench profile from any gym. | Wrong advice (P2). Bench at the remaining gym switches to lb and the deleted gym's step size, and Apply says "Equipment saved". Behaviour changes again after reload (`normalizeUnits`, `src/core/escobarState.ts:153`), which the test did not exercise. | Add target-gym existence to the `propose_equipment_profile` fingerprint (`s.units.gyms.some(g => g.id === input.gymId)`) so Apply reports stale. A change of active gym alone should not make it stale. Also make `saveProfile` (or the applier) reject an unknown `gymId`. |
| IMP-E06 | CONFIRMED | `tests/_a3/coach-consent/imp-e06-haptics-runtime.test.ts` (web path, stubbed `navigator.vibrate`). Three failures: `vibrated after the saved preference became off: expected "spy" to not be called at all, but actually been called 1 times`; `silent although the saved preference is on: expected "spy" to be called 1 times, but got 0 times`; `Undo restored the preference but not the runtime switch: … got 0 times`. Code: `src/escobar/apply.ts:188-195` updates only `preferences`. The runtime flag `src/native/haptics.ts:4-5,85` is synced only at startup (`src/main.tsx:27`), after a restore (`Settings.tsx:50`) and by the manual toggle (`Settings.tsx:191`). | Cosmetic/UX (P3). Vibration continues after the coach turns it off, or stays silent after it turns it on, until restart. | In `propose_setting`'s `put`, call `setHapticsEnabled(v as boolean)` when `key === 'haptics'`. This covers both Apply and Undo. |

All five findings are real on main 000918e. Each test asserts the correct behaviour and fails on main for the reason the audit gives. Run: `npx vitest run tests/_a3/coach-consent` gives 9 failed, 1 passed (the passing one is the COACH 01 control).

Notes:
- **COACH 01:** the audit's line range (375–390 at 94fd32c) has shifted to 383–430 on main; the code is the same. Only the busy/timeout retry resends the old payload. Each new step (a tool round trip) rebuilds the body from current state, so only the retry is affected. I reproduced the body-weight gate only. Health data takes the same path because the whole `body` is reused, but the fixture brief has no health drivers to show it.
- **IMP-E02:** the repro has to build A's proposal after B is applied. Otherwise A goes stale, because the `propose_setting` fingerprint covers every setting.
- **IMP-E03:** in case (b) the insight then reads "Weight updated to 81 kg" while the profile says 80. Other profile fields also leave `profileHistory` stale on Undo, but only weight and goal feed the `profile.changed` note. A goal Undo records a new, truthful change, so it is not affected.
- **IMP-E04:** I used a single test with `expect.soft`, so all three failures are listed.
- **Test files:** all are in `/tmp/claude-0/-home-user-M-arc/3ce718af-58e5-5eb0-aea0-2faec1f835c0/scratchpad/train10/tests/_a3/coach-consent/`:
  - `coach-01-retry-sharing.test.ts`
  - `imp-e02-toast-wrong-conversation.test.ts`
  - `imp-e03-profile-undo.test.ts`
  - `imp-e04-deleted-gym.test.ts`
  - `imp-e06-haptics-runtime.test.ts`
- **Side effects:** none. Nothing outside that folder was changed, nothing was committed, and no live endpoint was called.

=== agent a7e3a790dcf4c6588 ===
All three findings are confirmed on main 000918ef. 9 of the 10 scratch tests fail for the reasons the audits give. The one that passes is a control case that proves the test setup is fair. Results were the same in the default TZ, `America/Los_Angeles` and `Asia/Kolkata`. Run: `cd …/train10 && npx vitest run tests/_a3/coach-facts` → `Tests 9 failed | 1 passed (10)`.

| ID | verdict | evidence (test file + failing assertion, or file:line) | severity | fix |
|---|---|---|---|---|
| IMP-E01 | CONFIRMED | `tests/_a3/coach-facts/imp-e01.test.ts`. **Across midnight** (started 23:50 with a 0.8 factor, asked 00:10): `expected undefined to be 0.8` (Escobar's factor) and `Train 80 kg: expected 100 to be 80`. **Override for split A, workout on split B:** `expected 0.8 to be undefined` and `Train 100 kg: expected 80 to be 100`. Control with no override passes, so Train and Escobar agree otherwise. Cause: `src/escobar/tools/context.ts:102` reads only today's global override; `:115` drops it after midnight; it never checks `splitId`. Train uses the stored factor of the workout entry (`src/slices/workout/session.ts:57,80`; `src/slices/workout/Train.tsx:166`). `get_next_target` (`src/escobar/tools/read.ts:227`) and live-session autoregulation (`read.ts:420`) both use it. | Wrong advice: the coach says 100 kg on a day the user chose 80 kg (25 % heavier), or cuts a session that was never cut. | In `progressionCtxFor`, when a workout is running, take that exercise's own `loadFactor`, even when it has none. Otherwise apply the override only if its `day` and `splitId` match the split being asked about, the way `plannedExercises` does. |
| IMP-E05 | CONFIRMED | `tests/_a3/coach-facts/imp-e05.test.ts`. Paused at 10 min with 60 s of rest left, asked 10 min later: `elapsedMin: expected 20 to be 10` and `restSecLeft: expected +0 to be 60`. Typed but unsaved set: `setsDone vs committed working sets: expected 1 to be +0` and `setsDone vs returned sets list: expected 1 to be +0`. Cause: `src/escobar/tools/read.ts:416` leaves out the pause that is still running; `:434` ignores `pausedRemainingSec`; `:432` counts drafts in `setsDone` but lists only timestamped sets. The correct helpers are `session.ts:92-97` (`elapsedSec`) and `:435-438` (`restRemainingSec`), which Train uses at `Train.tsx:607` and `:1366`. | Wrong advice: the coach thinks rest is over and the training time is doubled while paused. The done-count part is internal inconsistency, mostly cosmetic. | Use `elapsedSec(a, ctx.now)` and `restRemainingSec(a, ctx.now)`. Count `setsDone` with `isCommitted(x) && isWorkingSet(x)`, and filter the `sets` list the same way. |
| ENG-01 | CONFIRMED | `tests/_a3/coach-facts/eng-01.test.ts`. Setup: gym A has its own 5 kg step for this exercise, gym B has a 4 kg Machine group step, the workout is at B. **Root cause:** `profileFor(CP, GYM_B).step`: `expected 5 to be 4`. **Live retarget:** `Train retarget 25 x 6; gym B menu gives 24 x 7`, which matches the audit's numbers exactly. **Warm-ups:** `warm-ups 15/20/25: expected [ 15, 25 ] to deeply equal []`. **First target scaled by 0.9:** `scaled target 25 kg; gym B rungs 20/24/28/32/36`. **Escobar:** `get_equipment says confidence known: expected 5 to be 4`; `get_next_target warm-ups 15/20/25`; `get_live_session: Drop to 25 kg`. Cause: `src/brain/units.ts:46-59`, where `resolveProfile` ranks another gym's exercise profile above this gym's group. It feeds `Train.tsx:643` `profile`, which drives retarget `:737`, autoregulation `:741`, warm-ups `:747`, the entry unit `:646` and plate display `:712`. It also feeds `todayTarget` `:152` (the snap for scaled/hold targets, `progression.ts:319`) and Escobar `context.ts:101`. `getLiveSession` (`read.ts:422`) also passes no `menu`. | Wrong advice: weights the machine at this gym cannot load (25 kg on a 4 kg stack). It also gets the wrong kg/lb unit or plates when the gyms differ. | Use `loadMenu(...)` (`equipMenu`) as the single equipment context. In Train, replace `profile` with `equipMenu.profile` and pass `equipMenu` (including its loads) to `liveRetarget`. In `todayTarget`, set `equipment: menu.profile`. In `progressionCtxFor`, return `loadMenu(...).profile` and pass that menu into `getLiveSession`'s `suggestNext`. |

Notes:
- **IMP-E01:** both outputs come from real functions, Train's `entryTarget` and Escobar's `getNextTarget`. The midnight case uses real local wall-clock times with `refreshClock`.
- **IMP-E05, done count:** the audit's premise is only partly right. Train's own card line "x/y sets" also counts typed but unsaved sets (`Train.tsx:727,811`), and Finish saves them (`session.ts:525`). Only the progress bar in the sticky header counts saved sets alone (`Train.tsx:457`). So the clear defect is that the tool's output contradicts itself (`setsDone:1, sets:[]`). Whether Escobar's count should match the card or the progress bar is a choice to make before fixing. The pause and rest parts are wrong without any doubt.
- **ENG-01, Train live retarget:** this part copies the exact code at `Train.tsx:737` (real `profileFor`, `loadableValues` and `liveRetarget`), because the `EntryCard` component can't be rendered in the node test environment. Every other ENG-01 case calls the real exported function.
- **Related bug found beyond the audit text:** Escobar's `get_equipment` reports gym A's profile for gym B but still says `confidence: 'known'`. This is caused by `read.ts:478`, where the profile comes from the old resolver and the confidence from `loadMenu`.
- I created nothing outside the test folder and did not commit or push. `git status` shows only `tests/_a3/` untracked.

Files are in /tmp/claude-0/-home-user-M-arc/3ce718af-58e5-5eb0-aea0-2faec1f835c0/scratchpad/train10/tests/_a3/coach-facts/:
- imp-e01.test.ts
- imp-e05.test.ts
- eng-01.test.ts