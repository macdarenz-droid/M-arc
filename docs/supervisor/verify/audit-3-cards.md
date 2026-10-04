# Audit 3 cards (A3-1 to A3-7)

**Run date:** 2026-10-04. **Base:** main `c542ae95abc48c2afefb5e856f080e36283fcc4a` (train 13: HT-10 #166, #201, #206). BUG-38 and UI-R03 are in main and out of scope here.
**Inputs:** `docs/supervisor/verify/audit-3-confirm.md` (final table, rulings, skeptic notes), `docs/supervisor/verify/a3-tests/**`, the BUG-38 card format, `.claude/skills/supervisor/cards.md`, `.claude/skills/builder/SKILL.md`, AGENTS.md.

## 1. Recheck on c542ae9

**Method.** I made a scratch worktree at c542ae9 with node_modules symlinked from `train10`. I copied the 26 confirmed repro files to `tests/_a3/<folder>/` and left out UI 05, UI-R03 and BUG-38. Then I ran `npx vitest run tests/_a3` in UTC, `America/New_York` and `Asia/Manila`.
- **Result:** 26 files, 55 failed and 8 passed (the passing 8 are the recorded controls and premises). The result was the same in all three time zones.
- **Failure reasons:** every failing assertion fails for the reason the audit gives, with the same message recorded on 000918e.
- **Summary:** 26 of 26 still fail, 0 now pass, 0 dropped.

| Finding | Card | Repro file (a3-tests/…) | c542ae9 | Failing assertion on c542ae9 |
|---|---|---|---|---|
| COACH 01 | A3-1 | coach-consent/coach-01-retry-sharing | still fails (2 of 3; the control passes) | retry body still contains body weight after sharing.body=false |
| IMP-E02 | A3-1 | coach-consent/imp-e02-toast-wrong-conversation | still fails (1/1) | B's daily-quote change was reversed by A's toast |
| IMP-E03 | A3-1 | coach-consent/imp-e03-profile-undo | still fails (2/2) | insight still claims 82; Undo overwrote 81 (80); rows [81, 80] |
| IMP-E04 | A3-1 | coach-consent/imp-e04-deleted-gym | still fails (1/1, 3 soft) | Apply reported success for a deleted gym; orphan profile; bench at the other gym becomes lb |
| IMP-E06 | A3-1 | coach-consent/imp-e06-haptics-runtime | still fails (3/3) | vibrated after the preference became off (and 2 more) |
| DATA 01 | A3-2 | data/data-01 | still fails (3/3) | TypeError: list is not iterable; `.some` of undefined |
| DATA 02 | A3-2 | data/data-02 | still fails (3/3) | stored state still contains 's-old' or 'Synthetic old profile' |
| QA CSV 01 | A3-2 | data/qa-csv-01 | still fails (1 of 2; the control passes) | 7 formula-like text cells |
| QA CACHE 01 | A3-2 | data/qa-cache-01 | still fails (2/2) | `CACHE/MARC Exports/*` left after both resets |
| IMP-N01 | A3-3 | native/imp-n01-notification-race | still fails (3/3) | rest 880001 still queued; 'On. 56 of 56…' instead of 'Off'; backup back on |
| IMP-N02 | A3-3 | native/imp-n02-health-after-reset | still fails (2/2) | health days 1 instead of 0; connected true after Reset and after Restore |
| IMP-N03 | A3-3 | native/imp-n03-wakelock-late-grant | still fails (1/1) | release called 0 times |
| ENG-05 | A3-4 | timing/eng-05-stale-recovery | still fails (2/2) | recoveryModel not rebuilt (retime and insert) |
| ENG-02 | A3-4 | timing/eng-02-stale-set-count | still fails (6/6) | 3 vs 2, 2 vs 5, 1 vs 2 (red); 3 vs 2, 1 vs 2 (lighter week); carry 3 vs 2 |
| UI-R01 | A3-4 | timing/ui-r01-substitute-erases | still fails (3/3) | finish returned null, 0 sessions saved; replacement keeps Done and Skipped |
| UI-R04 | A3-4 | timing/ui-r04-edit-provenance | still fails (1 of 2; the control passes) | edited set provenance 'live' instead of 'edited' |
| IMP-E01 | A3-5 | coach-facts/imp-e01 | still fails (2 of 3; the control passes) | Train 80 vs coach 100 (midnight); Train 100 vs coach 80 (other split) |
| IMP-E05 (pause/rest) | A3-5 | coach-facts/imp-e05, case 1 | still fails | elapsedMin 20 instead of 10; restSecLeft 0 instead of 60 |
| ENG-01 | A3-5 | coach-facts/eng-01 | still fails (5/5) | step 5 instead of 4; retarget 25×6 instead of 24×7; warm-ups 15/25 not on the menu |
| UI-R02 | A3-6 | history/ui-r02-same-name-ids | still fails (1 of 2; the control passes) | A inherited B's session: 1 instead of 0 |
| UI-R06 | A3-6 | history/ui-r06-live-gym-delete | still fails (1/1) | live gym gone; bench unit kg instead of lb |
| ENG-03 | A3-6 | history/eng-03-review-week-contamination | still fails (1/1) | 'Chest is over its usual range' |
| ENG-04 | A3-6 | history/eng-04-warmup-only-completion | still fails (2 of 4; premise and mixed pass) | 3 workouts instead of 0; Strong week; review unlocks; 'under' |
| ENG-06 | A3-6 | history/eng-06-untrusted-duration-baseline | still fails (3/3) | "your usual for Push is about 30 min" (and "about 1 min") |
| ENG-07 | A3-6 | history/eng-07-future-history-debrief | still fails (1/1) | [] instead of 2 × "new record" |
| UI-R05 | A3-7 | schedule/ui-r05-onboarding-draft | still fails (1 of 2; the control passes) | sheet unmounted; weight 80 instead of 81 |

**Dropped:** none. **Needs owner:** no finding.
- No fix in these cards adds a stored key, field or kind of data, and none sends new data.
- Two side parts stay out of their cards. Their findings stay in:
  - **IMP-E05 done count:** `setsDone` against `sets`. It needs a decision on which count is right: the card's typed sets or the header's saved sets (`Train.tsx:727` vs `:457`). That choice belongs to the supervisor or the owner. Until then, the repro's second case is not moved.
  - **UI-R04 `editedAt`:** plan 6.17.2 (`COACHING-PLAN.md:817`) asks for an `editedAt` stamp. It is a new saved field, so it needs the owner. The fix does not need it.

**Test flaws found during the recheck** (each card already applies its fix; none weakens an assertion):
1. **ENG-03:** after a correct fix there is no chest insight, so `expect.soft(chest?.title).not.toMatch(/over/)` throws a TypeError ("expects to receive a string, but got undefined").
   - Use `chest?.title ?? ''`.
   - Checked in scratch: this corrected test fails on c542ae9 for the audit's reason and passes with the fix.
2. **QA CACHE 01:** the repro turns native off before Reset (skeptic note). The moved test keeps native on, and a web control is added.
3. **IMP-E04:** the premise line `expect(fingerprint(...)).toBe(p.fingerprint)` asserts the bug itself. The moved test inverts it to `.not.toBe`, which is the fix's own claim.
4. **IMP-E05:** the second case encodes the undecided count rule (skeptic note). It is not moved.
5. **UI-R04:** the repro never checks `timingTrusted`, which the plan says an edit may drop (`COACHING-PLAN.md:868`). A case is added.
6. **IMP-E03:** the skeptic's fix ("throw unless the field and today's row still equal what Apply wrote") turns `tests/escobar/apply.test.ts:58-68` red. That test pins "profile undo keeps a later weigh-in" across days. A3-1 uses a per-piece rule instead.
   - Checked in scratch: all of `tests/escobar` passes (35 files, 608 tests), along with both repro cases.

**Design probes.** These were scratch patches on c542ae9, all reverted. They show that the smallest fix passes its repro and keeps every non-perf test outside `tests/_a3` green. The perf run (`MARC_PERF=1`) was not run. The builder still proves each fix on its own head.

| Probe | Repro after the patch | Rest of `vitest run` |
|---|---|---|
| ENG-01: `profileFor` and `progressionCtxFor` take the menu profile | 5/5 pass | green |
| ENG-03 + ENG-04: three filters | pass (ENG-03 needs the test fix above) | green |
| ENG-06 + ENG-07 + UI-R02: filters in `post.ts` and `history.ts` | pass | green |
| DATA 02: guard in `persistSoon` and `flushSave` | 3/3 pass | green |
| IMP-E03: per-piece undo | 2/2 pass | `tests/escobar` green |
| ENG-02: cuts from `plannedSets` | cases 1-5 pass | 1 pin went red: `tests/progression.test.ts:455-460` (BUG-15 A1, a lift first logged inside the week repeats its own set count). A3-4 keeps that rule. |

**Rulings these cards make.** The supervisor confirms or overturns each one when accepting the cards; each is recorded as a D-entry by its builder.

**Supervisor, 2026-10-04 00:4x UTC: R1-R10 confirmed.** R5 revises the sets half of D-B15, which was a builder decision, not the owner's: the cut now applies once to today's plan, and the loads and the pre-week base stay as D-B15 says. R10 holds while GATE-SPLIT #194 is in flight; the full gate still runs on every card. Wave 1 starts with A3-2 and A3-1. A3-3 and A3-4 start when one of them reaches review.
- **R1 (A3-1):** IMP-E03 Undo reverts each piece only while it is still Apply's: the field, today's row and the history event. When no piece is left, Undo is unavailable.
- **R2 (A3-1):** IMP-E04 needs the fingerprint change only. An applier guard would be unreachable, because `decide` checks the fingerprint synchronously just before it runs.
- **R3 (A3-2):** DATA 01 defaults the four arrays to `[]` and keeps the record. Dropping it would cut the sessions off from their exercise.
- **R4 (A3-2):** the DATA 02 guard sits only in the deferred and flushed saves. Explicit replace, reset and boot writes still win.
- **R5 (A3-4):** ENG-02 cuts from today's planned rows:
  - red day = today's planned rows − 1;
  - lighter week = round(planned × setFactor), only when a pre-week session exists; otherwise the lift repeats its in-week session (D-B15 A1 pin);
  - carries take the week's set factor (D-A1 (1) exempts only timed holds).

  This revises the sets half of D-B15 (`COACHING-DECISIONS.md:539`). Loads still come from the pre-week session.
- **R6 (A3-4):** UI-R01 keeps committed sets on the original entry, and the substitute takes the remaining rows. With no committed set, the swap stays in place exactly as now; gate block AUD-10 pins that.
- **R7 (A3-5):** IMP-E01: during a live workout the coach uses the entry's own `loadFactor`. With no live workout, behaviour is unchanged.
- **R8 (A3-6):** UI-R06 hides and blocks Delete for the live session's gym, with no explanatory text (UI copy rule).
- **R9 (A3-7):** UI-R05 latches the trigger in a signal, so App.tsx is not touched.
- **R10 (all):** no new gate blocks, because GATE-SPLIT #194 is about to assign the existing blocks to jobs. UI behaviour is proven by vnode-harness unit tests, and the full gate still runs for regression.

**Follow-ups (supervisor, 2026-10-04 06:0x UTC):**
- **R11 / card A3-5b (IMP-E05 done count).** Ruling: the coach's live-workout read reports the same done count that Train's card shows. Train counts typed sets (`Train.tsx:727`). `setsDone` and the `sets` list are filtered by that one rule, so the tool can never say `setsDone: 1` with `sets: []`. This keeps the coach and the screen in agreement; no new data.
  - Card A3-5b starts after A3-5 merges. Its failing-first test is IMP-E05's second repro case, adjusted to the Train rule.
- **Card A3-2b (QA CACHE 01 residual).** The `index.html` pre-load reset still leaves cache copies; A3-2's reviewer confirmed it (#211 issuecomment-5977111056). A3-2 reserved `index.html` and named this as a residual risk, so it gets its own card. It starts after A3-2 merges.
  - Acceptance: after the pre-load reset, no app cache (SW caches and the native copy) holds pre-reset state. Prove it with a test that fails on main, plus a web control.

## 2. Collision check

Write scopes of the seven cards against each other and against the open PRs. The PR diffs were taken from each branch against its merge base with main:
- #191 LIB-12 and #193 LIB-7: `docs/COACHING-DECISIONS.md`, `scripts/screenshot-gate.mjs` and tools/library files. #193's base is `claude/lib-6-closeup-renderer`.
- #189 LIB-2 and #194 GATE-SPLIT: docs only for now. GATE-SPLIT's build will touch `.github/**` and `scripts/screenshot-gate.mjs`.
- #180 LIB-3: `tests/howto/library-qa.test.ts` and tools.
- #109 pilot A: `tools/plates/**` only.

| Shared file | Who touches it | Settlement |
|---|---|---|
| `src/core/store.ts` (owner-gated path; no new data in either card) | A3-2: `repairState` :67-135, new helper plus `persistSoon` :392-395, `flushSave` :418-421. A3-3: `replaceState` :402-405 and the two replacing branches of the storage listener :313-329. | Split by function. Neither card edits the other's functions. **A3-2 merges first** (data loss). A3-3 then merges main and keeps both sides; the hunks around :392-421 may touch, so resolve by hand. |
| `src/slices/workout/units.ts` | A3-5: `profileFor` :19-22. A3-6: `deleteGym` :115-123. | Different functions; either order. The second to merge merges main. Recommended: A3-5 first. The UI-R06 repro reads `profileFor`, and it stays lb at the lb gym under A3-5's menu rule (exercise profile with source `user` = known). |
| `src/slices/workout/session.ts` | A3-4: `substituteEntry` :364-369, `resolveSessionTiming` :601-625, `logPastSession` :627-650. A3-5: import only (`elapsedSec` :92-94, `restRemainingSec` :435-439). | A3-5 must not edit session.ts. If the build reports an import cycle, A3-5 stops and tells the supervisor. Moving the helpers would then wait for A3-4 to merge. |
| `docs/COACHING-DECISIONS.md` | A3-1, A3-2, A3-4, A3-5, A3-6 (new D-entries at the end); open #191, #193, #189, #194, #180 | Append-only. Every merge keeps both sides. |
| `scripts/screenshot-gate.mjs` (shared, add-only) | No A3 card; #191, #193 and the GATE-SPLIT build do | A3 cards add no block (R10). Blocks that A3 changes must not break are named in each card: AUD-10 :8638-8655 (A3-4); fresh-profile :1485-1500, UI-08 :8711-8720, :3558 (A3-7); Reset everything :271-290 (A3-2). |
| `src/slices/settings/Settings.tsx` | A3-2 (`resetEverything` :76-85 only) | Watch-lab row untouched (watch agent). No other A3 card or open PR touches it. |
| `src/app/App.tsx`, `src/main.tsx` (supervisor) | none | A3-7 avoids App.tsx by design. |
| `src/escobar/tools/read.ts`, `src/escobar/tools/context.ts` | A3-5 only | none |
| `src/brain/coach/post.ts`, `weeklyReview.ts`, `weekly.ts`, `volume.ts`, `src/brain/history.ts` | A3-6 only | none |
| `src/app/selectors.ts` | A3-7 only | none |
| `tests/helpers.ts`, `tests/escobar/fixtures.ts` | read by A3-1, A3-4, A3-5 and A3-6 | Read-only. No card edits them. |

No collision is unsettled, so all seven cards can be `ready`.

## 3. Recommended start order

The ruling puts privacy and data loss first: COACH 01, IMP-N02, DATA 01, DATA 02, UI-R01, IMP-E03, QA CACHE 01.

1. **Wave 1, in parallel (4 Opus builders):** A3-1 (COACH 01, IMP-E03), A3-2 (DATA 01, DATA 02, QA CACHE 01), A3-3 (IMP-N02) and A3-4 (UI-R01).
   - Their write scopes are independent apart from store.ts, which is split by function.
   - **Merge order:** A3-2 → A3-1 → A3-3 → A3-4.
2. **Wave 2, as review and CI capacity frees:** A3-5 → A3-6 (units.ts split), plus A3-7 (Sonnet, small) at any time.
   - **Merge order:** A3-5 → A3-6 → A3-7.
3. **Do not exceed review and CI capacity.** GATE-SPLIT and the library PRs share the gate runners. Start a wave-2 card only when a wave-1 card is in review.

---

## Card A3-1: coach consent and Undo (COACH 01, IMP-E02, IMP-E03, IMP-E04, IMP-E06)

```
id: A3-1
model: claude-opus-5-5
base: main c542ae9
depends_on: none
build_prerequisites: none (audit lane open: HT-10 merged in c542ae9; HANDOVER.md:907, :1097)
merge_prerequisites: review passed; checks green on a head that contains the latest main; every lower-numbered owner-checklist item merged (supervisor checks); merges after A3-2 if both are ready (merge order only)
shared-file owners: none of write_scope is owned in AGENTS.md; docs/COACHING-DECISIONS.md is append-only
```

**Outcome.** Five coach-consent bugs are fixed:
- the busy or timeout retry honours the sharing switches as they are now;
- an Undo toast reverts only its own conversation's change;
- profile Undo never overwrites a newer weigh-in and leaves no false "Weight updated" note;
- an equipment proposal for a gym deleted since is reported stale;
- a coach change to Haptic feedback takes effect at once.

**Deliverable:** one PR. **Evidence:** the tests under Acceptance; each is red on c542ae9 and green on the PR head. **Finish:** merged in a train; no device check needed.

### read_first
- `.claude/skills/builder/SKILL.md`, `gotchas.md`; `docs/supervisor/verify/audit-3-confirm.md` rows COACH 01 and IMP-E02 to IMP-E06, plus that group's verifier notes.
- COACH 01: `src/escobar/loop.ts:374-433`. The body is built once at :383-387, the attempt loop starts at :388, and the retry `continue` is at :430.
- IMP-E02:
  - `src/escobar/apply.ts:262-289` (`undoKey` :264; `onProposal` :271-289; toast :285);
  - `src/escobar/session.ts:119-133` (`persist` sets `activeConversation`; `persistQuietly` does not) and :353-356 (`updateConversation`);
  - `src/escobar/ui/Message.tsx:107`; `src/app/App.tsx:119` (the app-level toast).
- IMP-E03:
  - `src/escobar/apply.ts:152-174`; `src/escobar/apply.ts:226,237-247` (`UndoUnavailable`, `decide` undo branch);
  - `src/slices/profile/profile.ts:11-14,47-56`; `src/brain/coach/rules.ts:463-495`.
- IMP-E04: `src/escobar/tools/actions.ts:87-108` (equipment row :102); `src/escobar/apply.ts:196-207`; `src/slices/workout/units.ts:77-81,115-123`.
- IMP-E06: `src/escobar/apply.ts:188-195`; `src/native/haptics.ts:1-10`; `src/main.tsx:27`; `src/slices/settings/Settings.tsx:47-51,191`.
- **Pins that must stay green unchanged:**
  - `tests/escobar/apply.test.ts:58-68` ("profile undo keeps a later weigh-in");
  - `tests/escobar/apply.test.ts:24-115` (undo inverses and window);
  - `tests/escobar/loop.test.ts:148-160` (retry once on busy);
  - `tests/escobar/actions.test.ts:89-95` (fingerprint);
  - `tests/escobar/aud-2-coach-off.test.ts`.

### write_scope
- **Source:**
  - `src/escobar/loop.ts` (`step` only);
  - `src/escobar/apply.ts` (`propose_profile`, `propose_setting`, `onProposal`);
  - `src/escobar/session.ts` (one new export that saves a conversation without making it visible, wrapping `persistQuietly` and updating the loop copy as `updateConversation` does);
  - `src/escobar/tools/actions.ts` (`touchedState`, equipment row only).
- **Tests (moved from a3-tests; change the fixture import `../../escobar/fixtures` to `./fixtures`):**
  - `tests/escobar/a3-coach-01-retry-sharing.test.ts`
  - `tests/escobar/a3-imp-e02-toast-conversation.test.ts`
  - `tests/escobar/a3-imp-e03-profile-undo.test.ts`
  - `tests/escobar/a3-imp-e04-deleted-gym.test.ts`
  - `tests/escobar/a3-imp-e06-haptics-runtime.test.ts`
- **Docs:** `docs/COACHING-DECISIONS.md`, one entry `D-A3-1` (R1, R2, the toast rule).

### reserved_paths
- **No saved-data change:** `src/core/models.ts`, `src/core/store.ts`, migrations.
- **Other cards' scope:** `src/slices/workout/units.ts` (A3-5/A3-6; IMP-E04 needs no change there, R2), `src/escobar/tools/read.ts`, `context.ts`.
- **Shared or owned elsewhere:** `src/app/App.tsx`, `src/main.tsx`, `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, watch-agent files, `escobar-worker/**`, `.github/**`, `package*.json`.

### Fix (smallest)
- **COACH 01:** build `body` inside the attempt loop.
  - Each attempt reads `this.deps.getState()` and calls `toRequestMessages(windowed, imageData, state.escobar.sharing)`.
  - The enabled guard and the single retry stay.
- **IMP-E02:**
  - `onProposal(proposalId, choice, conversationId?)`. It uses `activeConversation` when the ids match or no id is given. Otherwise it looks the conversation up in `storeSig` and saves it through the new quiet export, without switching the visible chat.
  - The toast closure captures `c.id`. The undo key is already `${conversationId}:${proposalId}`.
- **IMP-E03 (R1):** Apply records:
  - `after` = the field value it wrote;
  - `added` = today's row it wrote;
  - `event` = the `profileHistory` entry `recordChange` appended (by identity; none when from === to).

  Undo then:
  - restores the field only if it still equals `after`;
  - removes `added` and puts back `logBefore` only if `added` is still in the log;
  - always drops `event`;
  - throws `UndoUnavailable` when neither the field nor the row is still Apply's.
- **IMP-E04 (R2):** the equipment fingerprint becomes `[byExercise, byEquipment, s.units.gyms.some(g => g.id === input.gymId)]`. A change of active gym alone does not change it.
- **IMP-E06:** in `propose_setting`'s `put`, call `setHapticsEnabled(v as boolean)` when `key === 'haptics'`. This covers Apply and Undo.

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation that must turn it red |
|---|---|---|---|---|
| AC1 | COACH 01: a retry honours the current switch | a3-coach-01 "upstream_busy: …" and "timeout: …" (moved as is; the control case stays). Add the same case for `sharing.health=false` if `tests/escobar/fixtures.ts` can produce a brief with health drivers; otherwise say so in the PR. | retry body contains "weight 80.5" | M1: hoist `body` back above the `for` |
| AC2 | IMP-E02: A's toast never touches B | a3-imp-e02 (moved as is); add "A's toast tapped while B is visible undoes A's own change and B stays visible" | B's showSpark reverted | M2: toast calls `onProposal(proposalId, 'undo')` without the id; M3: the non-visible save goes through `persist` (B no longer visible) |
| AC3 | IMP-E03: Undo keeps newer data and leaves no false note | a3-imp-e03 both cases (moved as is); `tests/escobar/apply.test.ts:58-68` unchanged and green | insight says 82; 81 overwritten; rows [81, 80] | M4: restore the field unconditionally (case b red); M5: keep `event` (case a red); M6: throw when the field changed (apply.test.ts:58 red) |
| AC4 | IMP-E04: a deleted gym makes the proposal stale | a3-imp-e04 with the premise line inverted to `expect(fingerprint(…)).not.toBe(p.fingerprint)`; add the control "switching the active gym keeps the fingerprint" | 'applied' plus orphan profile | M7: drop the gym term (case red); M8: fingerprint `activeGymId` too (control red) |
| AC5 | IMP-E06: haptics follow Apply and Undo | a3-imp-e06, 3 cases (moved as is) | vibrate called or not called | M9: remove the `setHapticsEnabled` call |
| AC6 | No regression | `npm run check`, `npm run test:tz` | n/a | n/a |

### design_reference
- `audit-3-confirm.md` rows for this group; ES-02, ES-03 and ES-04 (undo by conversation, `apply.ts:262-264`);
- AUD-2 (coach-off guard, `loop.ts:389`);
- BUG-20 (privacy redaction, `toRequestMessages`).

### connectivity
Offline only. The transport is scripted, with no live coach, Worker or AI call.

### verification
- `npm ci`, `npm run typecheck`, `npm test`, `npm run test:tz`, `npm run build`. The gate is not required (no UI change); it runs in CI.
- **Red-on-main proof:** run AC1-AC5 on c542ae9 and paste the failing lines.

### risk_and_recovery
- **Pending equipment proposals:** one saved before the update gets a new fingerprint and reads stale once. Proposals expire the same day; the user asks again. Accepted.
- **Undo on a non-visible conversation:** the quiet save must keep the running loop's copy in step (`updateConversation` :353-356 does `loop.conversation = c`), or the next loop save could drop the decision. Test it in AC2's added case.
- **Conversation deleted** ("Reset conversations") before the toast is tapped: the lookup fails and `onProposal` returns "No conversation." without a change.
- **Undo:** revert the PR; no data shape changes.

### return
- Draft PR URL and head sha.
- Table: AC → test → red output on c542ae9 → green output.
- Mutations M1-M9, each seen red and restored.
- Changed paths checked against write_scope.
- `You will notice:` the coach's Undo button now undoes only its own change, and turning haptics off through the coach stops vibration at once.
- HANDOFF block.

---

## Card A3-2: data safety (DATA 01, DATA 02, QA CSV 01, QA CACHE 01)

```
id: A3-2
model: claude-opus-5-5
base: main c542ae9
depends_on: none
build_prerequisites: none
merge_prerequisites: as A3-1; merges BEFORE A3-3 (store.ts, split by function)
shared-file owners: src/core/store.ts is owner-gated for new kinds of saved data; this card adds none (no key, no field). Ruling: audit-3-confirm.md DATA 02 row ("needs no new stored key, so no owner approval"). Settings.tsx: only resetEverything; the Watch-lab row belongs to the watch agent.
```

**Outcome.**
- A restored or saved state with a hand-made custom exercise lacking muscle lists never crashes the app.
- A stale tab (frozen or back-forward cached) never writes old data over another tab's reset or newer save.
- CSV text cells can no longer run as spreadsheet formulas.
- Both reset paths remove the plaintext export copies from the app cache on Android, as `PRIVACY-POLICY.md:57` promises.

**Deliverable:** one PR. **Finish:** merged in a train, plus the owner's optional device check below.

### read_first
- DATA 01:
  - `src/core/store.ts:60-135` (customExercises at :99, against its own DATA-01 comment :92);
  - `src/brain/exposure.ts:21`; `src/core/exercises.ts:134-137`;
  - `src/slices/settings/backup.ts:34`; `src/core/migrate.ts:116`.
- DATA 02: `src/core/store.ts:230-249` (`loadState`), :260 (`lastGoodRaw`), :286-331 (`initStore`, listener), :345-376 (`persistNow`), :392-427 (`persistSoon`, `update`, `replaceState`, `resetState`, `flushSave`, `stopSaving`); `src/main.tsx:55-63` (read only).
- QA CSV 01: `src/slices/settings/exportCsv.ts:8-34`; `tests/r6-features.test.ts:1-30`.
- QA CACHE 01:
  - `src/native/share.ts:7-16` (`MARC Exports/`), :34-46 (`MARC Share`);
  - `src/slices/settings/Settings.tsx:76-85`; `src/app/ErrorBoundary.tsx:19-27,51-54`;
  - `docs/PRIVACY-POLICY.md:57`; `index.html:100-104` (pre-load crash reset; out of scope, see risks).
- **Pins that must stay green unchanged:**
  - `tests/store.test.ts`, `tests/backup.test.ts`, `tests/aud4-restore-integrity.test.ts`;
  - `tests/error-boundary.test.ts:41,84` (calls `resetAppData` synchronously);
  - `tests/escobar/other-tab.test.ts`, `tests/share-native.test.ts`, `tests/r6-features.test.ts`;
  - gate block "Reset everything" `scripts/screenshot-gate.mjs:271-290`.

### write_scope
- **Source:**
  - `src/core/store.ts` (only `repairState`, one new helper next to `persistSoon`, `persistSoon`, `flushSave`);
  - `src/slices/settings/exportCsv.ts`;
  - `src/native/share.ts` (one new export, `clearExportCache(): Promise<void>`: native only, `rmdir` of `MARC Exports` and `MARC Share`, cache directory, recursive, errors swallowed);
  - `src/slices/settings/Settings.tsx` (`resetEverything` only);
  - `src/app/ErrorBoundary.tsx` (`resetAppData`, `confirmReset`).
- **Tests:**
  - `tests/a3-data-01-custom-exercise-repair.test.ts`
  - `tests/a3-data-02-stale-tab-save.test.ts`
  - `tests/a3-qa-csv-01-formula-cells.test.ts`
  - `tests/a3-qa-cache-01-reset-cache.test.ts`
- **Docs:** `docs/COACHING-DECISIONS.md`, entry `D-A3-2` (R3, R4, the CSV rule, the cache rule).

### reserved_paths
- `src/core/store.ts` outside the four places above. In particular `replaceState`, `resetState`, `persistNow` and the storage listener belong to A3-3.
- `src/core/models.ts`, migrations; `index.html`; the Settings Watch-lab row; `src/app/App.tsx`, `src/main.tsx`.
- `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`; `.github/**`; `package*.json`.

### Fix (smallest)
- **DATA 01 (R3):** in `repairState`, map each custom exercise so that `primary`, `secondary`, `stabilizers` and `aliases` are arrays of strings, `[]` when missing or invalid. Keep the record.
- **DATA 02 (R4):** a helper `storageMovedOn()`.
  - It returns true when `lastGoodRaw != null` and `storage.getItem(STATE_KEY) !== lastGoodRaw`.
  - In that case it sets `lastGoodRaw` to the stored value and `state.value = loadState(storage).state`.
  - The `persistSoon` timer callback and `flushSave` skip `persistNow` when it returns true.
  - `replaceState`, `resetState` and boot keep writing unconditionally. An explicit replace wins, and `resetState` already nulls `lastGoodRaw`.
- **QA CSV 01:** in `sessionsToCsv`, the split, exercise and both note cells get `'` in front when they start with `=`, `+`, `-`, `@`, a tab or a CR. Then they are quoted as now. Numeric columns are untouched (OWASP CSV injection).
- **QA CACHE 01:**
  - `resetEverything` calls `void clearExportCache()`.
  - `resetAppData` starts it after `storage.clear()` and returns that promise. It still clears storage synchronously first, so `error-boundary.test.ts:84` holds.
  - `confirmReset` reloads when the promise settles or after 2 s, whichever comes first.
  - On the web, nothing changes (no Filesystem call).

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation |
|---|---|---|---|---|
| AC1 | DATA 01: no crash after import or reload, and the record is kept | a3-data-01, 3 cases (moved as is); add: "the repaired custom exercise keeps its id and name and has `[]` lists" | TypeError: list is not iterable | M1: drop the `primary` default (red); M2: drop `aliases` (case 3 red) |
| AC2 | DATA 02: a stale flush or debounced save never restores old data | a3-data-02, 3 cases (moved as is) | stored state contains 's-old' | M3: no guard in `flushSave` (cases 1, 3 red); M4: no guard in `persistSoon` (case 2 red) |
| AC3 | DATA 02: the guard never blocks a legitimate save | new: (a) boot from the backup key (main unreadable), then `update` → main holds the edit; (b) two consecutive `update`s in one tab both reach storage; (c) `replaceState` after another tab wrote → this tab's state is stored | n/a (guards) | M5: guard compares against `null` too (a red); M6: guard also in `replaceState` (c red) |
| AC4 | QA CSV 01: no text cell starts with a formula trigger | a3-qa-csv-01, both cases (moved as is; numeric control included) | 7 formula cells | M7: drop `-` from the trigger set (red on '-2+3'); M8: prefix numeric cells (control red) |
| AC5 | QA CACHE 01: both resets clear the export cache on native | a3-qa-cache-01, **rewritten**: delete both `native(false)` lines so native stays on through Reset. If `Settings()` then reaches another plugin at render, stub it with `vi.mock`; never turn native off. Add a web control: with native off, Reset makes no Filesystem call. | `CACHE/MARC Exports/*` left | M9: remove the call in `resetEverything` (case 1 red); M10: remove it in `resetAppData` (case 2 red); M11: drop the native check (web control red) |
| AC6 | No regression | `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (Settings is touched) | n/a | n/a |

### design_reference
- DATA-01 and DATA-02 (AUD-4) comments in store.ts; ST-10, ST-19; QA2-FB-1;
- `docs/PRIVACY-POLICY.md:57`; QA4-11 (`share.ts:38`).

### connectivity
Offline only.

### verification
- As AC6.
- **Red-on-main proof** for AC1, AC2, AC4 and AC5 (rewritten).
- **Device check (owner, optional supporting evidence; acceptance is AC5):** on the APK, export a backup, then Settings › Reset everything. Android Settings › Apps › M/ARC › Storage: the cache drops by about the backup's size.

### risk_and_recovery
- **DATA 02 speed:** the guard reads the full state string and compares it on each deferred or flushed save. Keep `tests/perf/budgets.test.ts` (`MARC_PERF=1`, part of `npm test`) green. If it is not, stop and report.
- **DATA 02, failed first write:** on a boot from backup where the first write failed, `lastGoodRaw` holds the backup copy. The guard then reloads instead of writing, which is the same outcome as the failed write. AC3(a) pins the normal case.
- **CSV:** a leading `'` shows in plain-text viewers. That is accepted, the standard mitigation.
- **Third reset path:** `index.html:100-104` runs before the app bundle and can't call the Filesystem plugin. It is a residual risk; the supervisor logs it as a follow-up.
- **Crash-card reload:** a bridge call that hangs is capped at 2 s, so Reload always happens.
- **Undo:** revert the PR; no data shape changes.

### return
- As A3-1, plus the mutation table M1-M11.
- `You will notice:` nothing visible. Reset now also clears exported backup copies from the phone's cache.

---

## Card A3-3: native races (IMP-N01, IMP-N02, IMP-N03)

```
id: A3-3
model: claude-opus-5-5
base: main c542ae9
depends_on: none
build_prerequisites: none
merge_prerequisites: as A3-1; merges AFTER A3-2 (src/core/store.ts; merge main and keep both sides)
shared-file owners: src/core/store.ts is owner-gated for new kinds of saved data; this card adds an in-memory counter only (nothing stored or sent)
```

**Outcome.** The latest request always wins:
- a cancelled rest alert, a switched-off training reminder or a switched-off backup reminder cannot come back from an older request still waiting for permission;
- a Health Connect read that finishes after Reset, Restore or another tab's replace cannot reconnect health or refill health days;
- a late web wake-lock grant after the workout ended is released at once, and repeated tab returns never stack locks.

### read_first
- IMP-N01:
  - `src/native/notifications.ts:57-66` (`ensurePermission`), :73-78, :80-102 (`scheduleRestDone`), :119-122 (`cancelRestDone`), :133-171 (`syncTrainingReminders`), :181-205 (backup);
  - `src/slices/settings/reminders.ts:14-26` (writes `reminderHealth`);
  - callers `src/slices/workout/session.ts:156,163,381,426,432,595,656`.
- IMP-N02:
  - `src/slices/settings/health.ts:6-35`; `src/core/store.ts:307-331` (listener), :402-416 (`replaceState`, `resetState`);
  - `src/slices/settings/Settings.tsx:47-57,76-85,138`; `src/slices/settings/backup.ts:65`.
- IMP-N03: `src/native/keepAwake.ts:11-41`; `src/app/App.tsx:86`.
- **Pins:** `tests/notifications.test.ts`, `tests/reminders.test.ts` (BUG-38 `planned` map), `tests/health-bridge.test.ts`, `tests/native/keepAwake.test.ts`, `tests/store.test.ts`.

### write_scope
- **Source:**
  - `src/native/notifications.ts`, `src/slices/settings/reminders.ts`, `src/slices/settings/health.ts`, `src/native/keepAwake.ts`;
  - `src/core/store.ts`: only a module counter plus `export const replaceGeneration = (): number => …`, the increment in `replaceState` (which `resetState` calls), and the increment in the two listener branches that replace `state.value` (:313-319, :325-326).
- **Tests:**
  - `tests/native/a3-imp-n01-notification-race.test.ts`
  - `tests/native/a3-imp-n02-health-after-reset.test.ts`
  - `tests/native/a3-imp-n03-wakelock-late-grant.test.ts`

### reserved_paths
- `src/core/store.ts` outside those lines (A3-2 owns `repairState`, `persistSoon`, `flushSave` and the new guard).
- `src/native/wearEngine.ts`, `native/wear/**`, `src/slices/settings/WatchLab.tsx` (watch agent); `src/app/App.tsx`.
- `scripts/screenshot-gate.mjs`; `.github/**`; `package*.json`.

### Fix (smallest)
- **IMP-N01:** one request counter per family: rest, training and backup.
  - Each entry takes `my = ++seq`.
  - After every `await`, it returns if `my !== seq`.
  - If its `schedule` call already went out and a newer request started meanwhile, it cancels its own ids.
  - `cancelRestDone` and an Off call bump the counter too.
  - `resyncReminders` writes `reminderHealth` only when its own call is still the latest.
- **IMP-N02:** `syncAndStoreHealth` reads `replaceGeneration()` before `await syncHealth`. After the await it returns false, with no `update`, if the generation changed.
- **IMP-N03:** in `acquireWebLock`, after the await:
  - if `!wantOn` (or a newer request started), release the new lock and do not store it;
  - before storing, release any other lock still held.

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation |
|---|---|---|---|---|
| AC1 | Rest: Skip after a pending schedule leaves nothing queued | a3-imp-n01 "rest: …" (moved as is) | 880001 still queued | M1: drop the rest-seq check after the permission await |
| AC2 | Training: Off while On waits ends Off with 0 queued | a3-imp-n01 "training: …" | 56 queued, 'On. 56 of 56…' | M2: drop the training check; M3: `resyncReminders` writes stale results |
| AC3 | Backup: Off while On waits stays off | a3-imp-n01 "backup: …" | 880101 queued, flag true | M4: drop the backup check |
| AC4 | Health: Reset or Restore during a read keeps it disconnected and empty | a3-imp-n02, both cases (moved as is); add "another tab's storage-event replace during a read drops the read" (drive the listener as `tests/escobar/other-tab.test.ts` does) | 1 day, connected true | M5: no generation check in `syncAndStoreHealth` (both red); M6: no increment in the listener (added case red) |
| AC5 | Health: a normal read still lands | `tests/health-bridge.test.ts` unchanged and green | n/a | M7: always drop (health-bridge red) |
| AC6 | Wake lock: Off during a pending grant leaves 0 held | a3-imp-n03 (moved as is) | release called 0 times | M8: drop the `!wantOn` release |
| AC7 | Wake lock: two visibility re-acquires hold one lock | new: two `visible` events with grants → the first lock released once | n/a (verifier noted the leak, untested) | M9: drop the release of the old lock |
| AC8 | No regression | `npm run check`, `npm run test:tz` | n/a | n/a |

### design_reference
- `audit-3-confirm.md` native rows and notes; QA2-FB-2 (prompt only from Settings);
- PL-04 (background health sync); A4 (keep awake).

### connectivity
Offline. All Capacitor plugins are mocked; there is no device call.

### verification
- `npm ci`, `npm run typecheck`, `npm test`, `npm run test:tz`, `npm run build`. The gate runs in CI (no UI change).
- Red-on-main proof for AC1-AC4 and AC6.
- **Device:** none required. The race likelihood on Android is not measured, and the fix is safe either way.

### risk_and_recovery
- **Training reminders:** a status read while a newer request runs can briefly show the older result. Only the latest call writes, which AC2 pins.
- **Generation counter:**
  - A Reset's own Undo (`restoreAll` → `replaceState`) also bumps it. A read in flight is then dropped, and the next background sync repeats it within 10 min. Accepted.
  - The counter must not be persisted. It is a module variable only.
- **Undo:** revert the PR.

### return
- As A3-1.
- `You will notice:` nothing visible. Switched-off reminders and Health Connect stay off after quick taps or a reset.

---

## Card A3-4: workout timing and history edits (ENG-05, ENG-02, UI-R01, UI-R04)

```
id: A3-4
model: claude-opus-5-5
base: main c542ae9
depends_on: none
build_prerequisites: none
merge_prerequisites: as A3-1
shared-file owners: src/slices/workout/session.ts and History.tsx have no owner; A3-5 imports two helpers from session.ts and must not edit it
```

**Outcome.**
- Retiming or back-logging a session rebuilds the recovery model, as History edits already do.
- A red day removes exactly one of today's planned rows, and a lighter week cuts today's plan (R5).
- Substituting an exercise never erases sets already logged (R6).
- Correcting a set in History marks it `edited`, and the session's timing trust is recomputed.

### read_first
- ENG-05:
  - `src/slices/workout/session.ts:30-39` (`rebuildRecoveryModel`), :601-625 (`resolveSessionTiming`), :627-650 (`logPastSession`);
  - `src/slices/history/History.tsx:37-46` (`withSessions`).
- ENG-02:
  - `src/brain/progression.ts:333-352` (`setCount` :346, `weekSets` :349), :380-396 (`reduceSets` :386), :405-428 (carry branch), :438-450 (`deloadSets` :443), :474-480 (`fewer` :478);
  - `src/slices/workout/Train.tsx:126-135` (`setAsideRows`), :145-167.
  - Docs: `docs/LOAD-AWARE-TARGETS.md:73`; `docs/COACHING-DECISIONS.md:429` (D-A1), :535-548 (D-B15; sets at :539).
- UI-R01:
  - `src/slices/workout/session.ts:319-330` (`markDone`, `skipEntry`), :355-369 (`insertEntry`, `substituteEntry`), :477-510 (template lineage), :541-600 (`finishSession`);
  - `docs/COACHING-DECISIONS.md:262-265` (the substitution entry this revises), :1663 (D-AUD10-1).
- UI-R04:
  - `src/slices/history/History.tsx:284-305` (`SessionEditor.save`); `src/brain/fidelity.ts:63-118`;
  - `src/core/models.ts:69,121-135`; `docs/COACHING-PLAN.md:810-817,868`; `docs/COACHING-DECISIONS.md:71-73`.
- **Pins that must stay green unchanged:**
  - `tests/progression.test.ts:455-460` (BUG-15 A1, in-week lift repeats its set count; the scratch probe showed this goes red if R5 ignores it);
  - the rest of `tests/progression.test.ts`, `tests/deload*.test.ts`, `tests/workout/set-aside.test.ts`, `tests/aud-8.test.ts`, `tests/live-retarget-next.test.ts`;
  - `tests/session.test.ts`, `tests/workout/aud-10.test.ts`, `tests/heart-bug21.test.ts`, `tests/substitute*.test.ts`, `tests/fidelity.test.ts`;
  - gate block AUD-10 `scripts/screenshot-gate.mjs:8638-8655`: Substitute with no committed set must still swap in place, with Bench gone from the list;
  - gate History edit blocks :4757, :4825, :4834.

### write_scope
- **Source:**
  - `src/slices/workout/session.ts` (`substituteEntry`, `resolveSessionTiming`, `logPastSession` only);
  - `src/brain/progression.ts` (`suggestRaw` set counts only);
  - `src/slices/history/History.tsx` (`SessionEditor.save` only);
  - `src/brain/fidelity.ts` (only if a small pure helper for liveShare is needed).
- **Tests (change `../../helpers` to `../helpers`):**
  - `tests/workout/a3-eng-05-recovery-rebuild.test.ts`
  - `tests/workout/a3-eng-02-set-cuts.test.ts`
  - `tests/workout/a3-ui-r01-substitute-keeps-sets.test.ts`
  - `tests/workout/a3-ui-r04-edit-provenance.test.ts`
- **Docs:** `docs/COACHING-DECISIONS.md`, entry `D-A3-4`. It covers R5 (revises the sets half of D-B15 :539), R6 (revises :262-265, citing D-AUD10-1), and UI-R04 (plan 6.17.2; `editedAt` deferred to the owner).

### reserved_paths
- **Saved data:** `src/core/models.ts`, `src/core/store.ts`. No `editedAt` and no new flag value.
- **Other cards:** `src/slices/workout/Train.tsx` (no change needed), `src/slices/workout/units.ts`, `src/escobar/**`.
- **Shared:** `src/ui/styles.css` (existing classes only), `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `src/app/App.tsx`.

### Fix (smallest)
- **ENG-05:** both writers set `recoveryModel: rebuildRecoveryModel({ ...s, sessions })` inside their `update`, as `withSessions` does.
- **ENG-02 (R5):**
  - `reduceSets` and `fewer` = `max(1, plannedSets - 1)`.
  - `deloadSets` = `outside.length ? max(1, round(plannedSets × setFactor)) : setCount`, so an in-week first log repeats its own count.
  - In the conditioning distance/time branch, a lighter week uses the same `deloadSets` with `cutSets`. Timed holds stay exempt (D-A1 (1)).
  - Load and reps logic is unchanged.
- **UI-R01 (R6):**
  - **No committed set on the entry:** exactly today's in-place swap.
  - **Otherwise:**
    - the original keeps only its committed sets and is marked `done`, keeping its `skipped` flag;
    - a new entry is inserted right after it: the substitute, blank rows equal to the original working rows minus the committed working rows (minimum 1), `done: false`, `skipped: false`, `plannedId` = original `plannedId ?? exerciseId`, no target.
- **UI-R04:**
  - In `save`, a set whose kg, reps, effort or `durationSec` differs from the saved set gets `fidelity: 'edited'`. Match sets by `id`; with no id, match by index only when the exercise kept its set count, else mark the set edited.
  - Then `logging.liveShare` is recomputed over the sets that carry a fidelity.
  - `logging.timingTrusted = old.timingTrusted && liveShare >= 0.7`. It is never raised.

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation |
|---|---|---|---|---|
| AC1 | ENG-05: both writers rebuild the model | a3-eng-05 "retiming…" and "inserting…" (moved as is) | stale `tauScale` | M1: drop the rebuild in `resolveSessionTiming` (retime red); M2: in `logPastSession` (insert red) |
| AC2 | ENG-02 red day: one fewer than today's plan, no compounding | a3-eng-02 cases 1-3 (moved as is) | 3/2/1 instead of 2/5/2 | M3: `reduceSets` from `setCount` |
| AC3 | ENG-02 lighter week from today's plan when a pre-week level exists | a3-eng-02 cases 4-5 (moved as is); `tests/progression.test.ts:455-460` green | 3/1 instead of 2/2 | M4: `deloadSets` from `setCount` (4-5 red); M5: use `plannedSets` with no pre-week level (progression:455 red) |
| AC4 | ENG-02 carries take the week's set cut | a3-eng-02 case 6 (moved as is) | 3 sets, no `cutSets` | M6: drop the carry cut |
| AC5 | UI-R01: committed sets survive Substitute | a3-ui-r01, 3 cases (moved as is) | finish null, 0 saved; Done/Skipped kept | M7: blank all sets (case 1 red); M8: spread `done`/`skipped` (2-3 red) |
| AC6 | UI-R01: no committed set means an in-place swap, as now | new: substitute before any commit → same entry count, old exercise gone, `plannedId` lineage kept; gate AUD-10 :8638-8655 green | n/a (guard) | M9: always split (new test red) |
| AC7 | UI-R04: a corrected set is `edited`; untouched sets stay `live` | a3-ui-r04 both cases (moved as is) | 'live' | M10: no reassignment (red); M11: mark all sets (control red) |
| AC8 | UI-R04: timing trust is recomputed | new: 2 live sets, one edited → `liveShare` 0.5, `timingTrusted` false; a no-change save keeps both | n/a (missing check) | M12: skip the recompute |
| AC9 | No regression | `npm run check`, `npm run test:tz`, gate (live card and History editor are touched) | n/a | n/a |

### design_reference
- R5, R6; D-B15, D-A1, D-AUD10-1; `LOAD-AWARE-TARGETS.md:73`; plan 6.17.2 and 6.17.5 row 10;
- UI-12 (`History.tsx:37-38,298`).

**Design check-in:** before wiring UI-R01, post a short PR note on how the split entry interacts with `templateFromSession` (`session.ts:477-510`) and heart capture (`heart-bug21.test.ts`). The supervisor reads it the next tick.

### connectivity
Offline only.

### verification
- As AC9. Red-on-main proof for AC1-AC5 and AC7.
- **Device check (owner, on the APK):** log one set of bench, then Substitute. The bench set stays with its numbers, and the new exercise appears below with the remaining rows.

### risk_and_recovery
- **Test results move** in any test that relies on last-session set counts for cuts. Only the listed rulings may move a number; for anything else, stop and send the supervisor the diff.
- **Recovery rebuild speed:** it now runs on each past log and retime, as History already does. Keep `tests/perf/budgets.test.ts` green.
- **UI-R01, live list:** the live list grows by one entry after a substitution with logged sets. Reorder, Finish counts and "Save for future" must treat it as a normal entry; the design check-in covers this.
- **UI-R04, legacy sets with no id:** the index rule above.
- **Undo:** revert the PR; no data shape changes.

### return
- As A3-1.
- `You will notice:` swapping an exercise after logging a set keeps that set, and a red day drops exactly one planned set.

---

## Card A3-5: coach facts agree with Train (IMP-E01, IMP-E05 pause/rest part, ENG-01)

```
id: A3-5
model: claude-opus-5-5
base: main c542ae9
depends_on: none
build_prerequisites: none
merge_prerequisites: as A3-1; recommended before A3-6 (src/slices/workout/units.ts, split by function)
shared-file owners: none in AGENTS.md; src/slices/workout/units.ts is shared with A3-6 (A3-5 owns profileFor :19-22 only)
```

**Outcome.** Escobar's live advice and Train's numbers match:
- the coach uses the live entry's own load factor, across midnight and per split;
- `get_live_session` reports the elapsed time and rest left the way Train does while paused;
- every live target, warm-up, retarget and Escobar equipment answer at a gym comes from that gym's load menu. Another gym's profile gives only the unit, as `LOAD-AWARE-TARGETS.md` §2 says.

**Out of scope, left out deliberately:**
- **IMP-E05 done count** (`setsDone` against `sets`, `read.ts:434`): it needs a decision on which count is right (`Train.tsx:727` vs `:457`). The repro's second case is not moved.
- **`getNextTarget` without a live workout** (IMP-E01, no-live case): unchanged. There is no split to match against.

### read_first
- IMP-E01:
  - `src/escobar/tools/context.ts:96-113` (`progressionCtxFor`), :116 (`todayOverrideOf`);
  - `src/slices/workout/session.ts:55-66` (`plannedExercises` puts the override's loadFactor on the entries at start); `src/slices/workout/Train.tsx:164-167`.
- IMP-E05:
  - `src/escobar/tools/read.ts:412-441` (elapsed :418, rest :436);
  - `src/slices/workout/session.ts:92-97,435-439`; `src/escobar/apply.ts:15` (escobar already imports session.ts).
- ENG-01:
  - `src/brain/units.ts:40-59` (`resolveProfile`, untouched), :126-161 (`loadMenu`; the profile does not depend on the logged loads);
  - `src/slices/workout/units.ts:19-22`; `src/escobar/tools/read.ts:74,218-245,467-490`;
  - `src/escobar/context/brief.ts:126`; `src/escobar/tools/calc.ts:67`; `src/slices/coach/Coach.tsx:147`;
  - `src/slices/workout/Train.tsx:643,736-747,1103,1218`; `docs/LOAD-AWARE-TARGETS.md:12-21`.
- **Pins:** `tests/plate-sense.test.ts:88-110` (`resolveProfile` stays as is), `tests/aud-8.test.ts`, `tests/workout/aud-10.test.ts`, `tests/escobar/read.test.ts`, `tests/escobar/show.test.ts`. The scratch probe with the ENG-01 change kept all non-perf tests green.

### write_scope
- **Source:**
  - `src/brain/units.ts` (one new export `menuProfile(exerciseId, gymId, units, exercise)` = `loadMenu(…, []).profile`);
  - `src/slices/workout/units.ts` (`profileFor` only);
  - `src/escobar/tools/context.ts` (`progressionCtxFor`);
  - `src/escobar/tools/read.ts` (`getLiveSession`, and :74);
  - `src/escobar/context/brief.ts` (:126 only); `src/escobar/tools/calc.ts` (:67 only).
- **Tests (change `../../helpers` to `../helpers`):**
  - `tests/escobar/a3-imp-e01-load-factor.test.ts`
  - `tests/escobar/a3-imp-e05-live-clock.test.ts` (case 1 only)
  - `tests/escobar/a3-eng-01-gym-menu.test.ts`
- **Docs:** `docs/COACHING-DECISIONS.md`, entry `D-A3-5` (R7, the menu rule, the open IMP-E05 count question).

### reserved_paths
- `src/brain/units.ts` `resolveProfile` (the doc says it stays untouched).
- `src/slices/workout/session.ts`: import only. If `npm run build` or typecheck shows a cycle, stop and tell the supervisor.
- `src/slices/workout/units.ts` outside `profileFor` (A3-6 owns `deleteGym`).
- `src/slices/workout/Train.tsx`: no change. Its retarget line :737 stays byte-identical so the repro's copied composition stays valid.
- `src/core/**` saved data; `scripts/screenshot-gate.mjs`; `src/app/App.tsx`.

### Fix (smallest)
- **IMP-E01 (R7):** in `progressionCtxFor`, when `s.active` exists:
  - `loadFactor` = the factor of the live entry for this exercise, or none;
  - the day override is not read.

  With no live workout, behaviour is unchanged.
- **IMP-E05:** `elapsedMin = Math.round(elapsedSec(a, ctx.now) / 60)` and `restSecLeft = restRemainingSec(a, ctx.now)`, both imported from `@/slices/workout/session`.
- **ENG-01 (R4 of the doc):**
  - `profileFor` and `progressionCtxFor` return `menuProfile(…)`.
  - `read.ts:74`, `brief.ts:126` and `calc.ts:67` use it too, so `resolveProfile(` is called only inside `src/brain/units.ts`.
  - `getLiveSession` passes `menu: menuFor(ctx, cur.exerciseId, a.gymId)` to `suggestNext`, like `getNextTarget` does. Keep this only if a test can show it bites (AC5); otherwise leave it out and say so.

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation |
|---|---|---|---|---|
| AC1 | IMP-E01: across midnight, coach and Train agree (0.8) | a3-imp-e01 "a session started at 23:50…" (moved as is) | 100 vs 80; factor undefined | M1: read the day override while live |
| AC2 | IMP-E01: another split's override is not applied live | a3-imp-e01 "an override for split A…" (moved as is; control stays) | 80 vs 100 | M1 (same); M2: ignore the entry factor (AC1 red) |
| AC3 | IMP-E05: paused elapsed time and rest left match Train | a3-imp-e05 case 1 only | 20 vs 10; 0 vs 60 | M3: old elapsed formula; M4: old rest formula |
| AC4 | ENG-01: gym B's menu everywhere | a3-eng-01, 5 cases (moved as is; case 2 copies `Train.tsx:737`, which this card does not change) | step 5; 25×6; warm-ups 15/25 | M5: `profileFor` back to `resolveProfile` (cases 1, 2, 3, 5 red); M6: `progressionCtxFor` back (case 4 red) |
| AC5 | ENG-01: `get_live_session` uses the menu | new: a learned-menu gym (no saved profile, two loads each logged twice) → the live adjustment lands on a learned rung. If no case can show a difference, drop the change and record why. | n/a | M7: drop `menu` |
| AC6 | One profile source | new source scan: `resolveProfile(` appears only in `src/brain/units.ts` | 5 other call sites | M8: add one back in `brief.ts` |
| AC7 | No regression | `npm run check`, `npm run test:tz` | n/a | n/a |

### design_reference
- `LOAD-AWARE-TARGETS.md` §2 (precedence; "another gym's profile → unit only");
- ES-21 ("agree with the Train screen", `context.ts:96-99`); UI-19 (pause holds rest).

### connectivity
Offline only.

### verification
- As AC7. Red-on-main proof for AC1-AC4 and AC6.
- The gate runs in CI. There is no UI change, but Train's numbers can change at multi-gym setups.

### risk_and_recovery
- **Changed profile at other callers.** `profileFor` now follows the menu for Coach.tsx:147, Train.tsx:1103/1218 and `setExerciseUnit` (`units.ts:31`). A user with an exercise profile only at gym A sees gym B's group or default steps at gym B. That is the documented rule, and the probe kept every non-perf test green.
- **Pinned test changes.** If any pinned test changes, stop and send the supervisor the diff.
- **Live factor.** With a live workout, an override applied later in the day to the same split does not reach the running entries, which is Train's behaviour. Accepted.
- **Undo:** revert the PR.

### return
- As A3-1.
- `You will notice:` at a second gym the coach's loads match the weights that gym really has, and while paused the coach no longer says rest is over.

---

## Card A3-6: history and weekly numbers (UI-R02, UI-R06, ENG-03, ENG-04, ENG-06, ENG-07)

```
id: A3-6
model: claude-opus-5-5
base: main c542ae9
depends_on: none
build_prerequisites: none
merge_prerequisites: as A3-1; merges after A3-5 if both are ready (src/slices/workout/units.ts, split by function)
shared-file owners: src/slices/workout/units.ts shared with A3-5 (A3-6 owns deleteGym :115-123 only)
```

**Outcome.**
- An exercise's history never takes another exercise's sessions through a shared name.
- The gym of a running workout cannot be deleted.
- The weekly review judges a week only on that week.
- Warm-up-only sessions do not count as workouts.
- The "longer than usual" baseline uses only sessions with trusted timing.
- The finish screen compares a back-logged workout only with earlier ones, as Escobar does.

### read_first
- UI-R02: `src/brain/history.ts:118-127` (name fallback :123); `src/core/exercises.ts:134-137`; `src/slices/workout/ExercisePicker.tsx:19-21`.
- UI-R06:
  - `src/slices/workout/units.ts:115-123`; `src/slices/settings/Gyms.tsx:45-47`;
  - `src/slices/workout/session.ts:83,575` (read only); D-AUD10-3 `docs/COACHING-DECISIONS.md:1669`.
- ENG-03: `src/brain/coach/weeklyReview.ts:193-210` (call :208); `src/brain/volume.ts:44-60`.
- ENG-04:
  - `src/brain/weekly.ts:52-70,124-126`; `src/brain/coach/weeklyReview.ts:178-186,199`;
  - `src/brain/volume.ts:49-50`; `src/brain/exposure.ts:41` (`hasWorkingSets`).
- ENG-06: `src/brain/coach/post.ts:139-155,202-215`; `src/brain/fidelity.ts:101-112`.
- ENG-07: `src/brain/coach/post.ts:202-206`; `src/slices/workout/Train.tsx:1258-1265` (read only); `src/escobar/tools/read.ts:174`.
- **Pins:**
  - `tests/post.test.ts`, `tests/weeklyReview.test.ts`, `tests/adapt4-own-week.test.ts`, `tests/adapt5-volume-band.test.ts`, `tests/volume.test.ts`;
  - `tests/share-cards.test.ts`, `tests/share-qa4.test.ts`, `tests/balance-weekly.test.ts`, `tests/r6-features.test.ts`, `tests/bodyweight.test.ts`;
  - every `exerciseHistory(` test (13 files).
  - The scratch probes with the ENG-03/04/06/07 and UI-R02 changes kept all of them green.

### write_scope
- **Source:**
  - `src/brain/history.ts`;
  - `src/slices/workout/units.ts` (`deleteGym` only); `src/slices/settings/Gyms.tsx` (the Delete row only);
  - `src/brain/coach/weeklyReview.ts`, `src/brain/weekly.ts`, `src/brain/volume.ts`, `src/brain/coach/post.ts`.
- **Tests (change `../../helpers` to `./helpers` and `../../escobar/fixtures` to `./escobar/fixtures`):**
  - `tests/a3-ui-r02-same-name-ids.test.ts`
  - `tests/a3-ui-r06-live-gym-delete.test.ts`
  - `tests/a3-eng-03-review-week.test.ts`
  - `tests/a3-eng-04-warmup-only.test.ts`
  - `tests/a3-eng-06-duration-baseline.test.ts`
  - `tests/a3-eng-07-debrief-prior.test.ts`
- **Docs:** `docs/COACHING-DECISIONS.md`, entry `D-A3-6`.

### reserved_paths
- `src/slices/workout/units.ts` outside `deleteGym` (A3-5 owns `profileFor`).
- `src/slices/workout/Train.tsx` (ENG-07 is fixed inside `post.ts`); `src/escobar/**`.
- Saved data; `src/ui/styles.css`; `scripts/screenshot-gate.mjs`; `src/app/App.tsx`.

### Fix (smallest)
- **UI-R02:** the name fallback runs only when `e.exerciseId` is not a known id (custom or library). Use an id set built once per call; mind the perf budget.
- **UI-R06 (R8):**
  - `deleteGym` returns without a change when `state.value.active?.gymId === gymId`.
  - `Gyms.tsx` does not render "Delete gym" for that gym. No new text.
- **ENG-03:** pass `sessions.filter(s => s.day < addDays(start, 7))` to `muscleVolumeStatus` at `weeklyReview.ts:208`.
- **ENG-04:** filter with `hasWorkingSets` in:
  - `weekSummary`'s `inWeek`;
  - `reviewWeek`'s `count`;
  - `weeklyReviewInsights`' `weekSessions`;
  - `volume.ts`'s `sessionsIn`.

  `trainingStreak` already does this (`weekly.ts:125`).
- **ENG-06:** in `durationDriftInsight`, keep only prior sessions with `logging?.timingTrusted ?? true` before the 5-session minimum and the median. The default matches `post.ts:209`.
- **ENG-07:** in `postSessionInsights`, `priorSessions` = `input.priorSessions.filter(s => s.startedAt < session.startedAt)`.

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation |
|---|---|---|---|---|
| AC1 | UI-R02: a known id never matches by name | a3-ui-r02 both cases (moved as is; legacy control kept) | A inherits 1 | M1: drop the known-id check; M2: drop the fallback (control red) |
| AC2 | UI-R06: the live gym stays and keeps its unit | a3-ui-r06 (moved as is) | gym gone; kg | M3: no guard in `deleteGym` |
| AC3 | UI-R06: no Delete for the live gym in Settings | new vnode test of `Gyms` (harness as in the a3 UI-R05 test): live at gym A → no "Delete gym" on A, still shown on B | n/a | M4: always render Delete |
| AC4 | ENG-03: the review judges only its own week | a3-eng-03 with the fixed line `expect.soft(chest?.title ?? '', …)`. Same assertion; the original throws a TypeError once fixed. | 'Chest is over its usual range' | M5: pass all sessions again |
| AC5 | ENG-04: warm-up-only sessions don't count | a3-eng-04, 4 cases (moved as is; premise and mixed stay) | 3 workouts; Strong week; unlock; 'under' | M6: drop the `weekSummary` filter; M7: drop `reviewWeek`'s; M8: drop `volume`'s (each turns its assertion red) |
| AC6 | ENG-06: the baseline needs trusted timing | a3-eng-06, 3 cases (moved as is) | "about 30 min" / "about 1 min" | M9: drop the trust filter |
| AC7 | ENG-07: only earlier sessions are "prior" | a3-eng-07 (moved as is) | no "new record" | M10: drop the `startedAt` filter |
| AC8 | No regression | `npm run check`, `npm run test:tz`, gate (Gyms sheet touched) | n/a | n/a |

### design_reference
- D-AUD10-3 (a running session's gym context is fixed); ADAPT-4 and ADAPT-5 (one band, full weeks);
- 6.17.4 (timing-gated insights); BUG-20 / ES (`read.ts:174`, prior = earlier).

### connectivity
Offline only.

### verification
- As AC8. Red-on-main proof for AC1, AC2 and AC4-AC7.

### risk_and_recovery
- **Counts drop.** Today's week card, grade, share cards and the review unlock now ignore warm-up-only sessions. That is intended and matches the streak; the probe kept the pinned tests green.
- **UI-R06.** Escobar has no delete-gym tool (`deleteGym` callers: `units.ts`, `Gyms.tsx` only), so no other path needs the guard.
- **Undo:** revert the PR.

### return
- As A3-1.
- `You will notice:` warm-up-only sessions no longer count toward the week, and you can't delete the gym of a workout in progress.

---

## Card A3-7: onboarding keeps the typed weight (UI-R05)

```
id: A3-7
model: claude-sonnet-5   (every step is spelled out below)
base: main c542ae9
depends_on: none
build_prerequisites: none
merge_prerequisites: as A3-1
shared-file owners: none; src/app/App.tsx (supervisor) is NOT touched
```

**Outcome.** When the person opens "Your details", types a weight and then fills the last missing field, the sheet stays open until Save or close. Save stores the typed weight and records completion.

### read_first
- `src/app/selectors.ts:71-74` (`onboardingTrigger`); `src/app/App.tsx:98,118` (read only);
- `src/slices/profile/Onboarding.tsx:11-50` (`exit` :19-23, `finishForm` :24, "Update" :31, "Add my details" :44), :56-70 (the weight draft :56/:67, save :60);
- `src/brain/onboarding.ts:54-67`;
- the repro `docs/supervisor/verify/a3-tests/schedule/ui-r05-onboarding-draft.test.ts`.
- **Gate blocks that must stay green:** `scripts/screenshot-gate.mjs:1485-1500` (fresh-profile: Add my details → 80 → Save), :3558, :8711-8720 (UI-08).
- **Pins:** `tests/onboarding.test.ts`.

### write_scope
- `src/app/selectors.ts`, `src/slices/profile/Onboarding.tsx`
- `tests/a3-ui-r05-onboarding-hold.test.ts`

### reserved_paths
- `src/app/App.tsx`, `src/main.tsx`; saved data (`models.ts`, `store.ts`); `src/ui/styles.css`; `scripts/screenshot-gate.mjs`.

### Steps
1. In `src/app/selectors.ts`:
   - import `signal` from `@preact/signals` and `type OnboardingTrigger` from `@/brain/onboarding`;
   - add `export const heldOnboardingTrigger = signal<OnboardingTrigger | null>(null);` with a one-line comment "UI-R05: an opened form stays until Save or close";
   - change the `onboardingTrigger` computed to return `heldOnboardingTrigger.value ?? shouldShowOnboarding(…)`, with the existing arguments unchanged.
2. In `src/slices/profile/Onboarding.tsx`, import `heldOnboardingTrigger` from `@/app/selectors`.
   - In the "Add my details" and "Update" click handlers, set `heldOnboardingTrigger.value = trigger` before `setStep('form')`.
   - In `exit` and `finishForm`, set `heldOnboardingTrigger.value = null` before `onClose()`.
3. Copy the repro to `tests/a3-ui-r05-onboarding-hold.test.ts` unchanged. Add `heldOnboardingTrigger.value = null` to its `beforeEach`.
   - Add case 3: "after Save the sheet is gone": after `flow()`, `sheetInApp()` is undefined.
   - Add case 4: "Later on the intro releases the hold": open, tap Later, `sheetInApp()` is undefined.
4. Run the commands under verification. Then prove each mutation, revert it, and fill the return.

### Acceptance

| ID | Criterion | Evidence (test) | Red on c542ae9 because | Mutation |
|---|---|---|---|---|
| AC1 | The typed weight survives the last field; Save records completion | case 2 (moved as is; control case 1 kept) | sheet unmounted, weight 80 | M1: don't set the hold on "Add my details" |
| AC2 | Save and Later close the sheet | cases 3 and 4 (new) | n/a | M2: never clear the hold in `finishForm` (3 red); M3: or in `exit` (4 red) |
| AC3 | No regression | `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (blocks named above) | n/a | n/a |

### design_reference
- `audit-3-confirm.md` UI-R05 row (option 1: hold the trigger); UI copy rule: no new text.

### connectivity
Offline only.

### verification
- As AC3, plus red-on-main proof for AC1.

### risk_and_recovery
- **Panel switch with the form open.** While the hold is set and the person opens Settings or Profile, App hides the sheet (`App.tsx:118`). It reappears at the intro when they return, and Later releases it. Accepted, and recorded in the PR.
- **Error-reports sheet.** It stays hidden while the hold is set (`App.tsx:98`), which is correct.
- **Undo:** revert the PR.

### return
- Draft PR URL and head sha; AC → test → red/green output; mutations M1-M3; changed paths against write_scope.
- `You will notice:` the details form no longer closes on its own before Save.
- HANDOFF block.
