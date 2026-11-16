# F-HARNESS-FEEL-GRIP: the fidelity harness learns three real sheet shapes

Owner: supervisor (drafted 2026-11-16; status `draft`). Base: origin/main `b5a14e13` (train 102). Every file:line below was read on that commit.

Covers both W9 follow-ups named in LAYERS APPROVED 6911987250: **F-FID-NOPRIMARY** (cable_external_rotation) and **F-HARNESS-NOGRIP** (jumping_jacks), and the open **F-RP-OADR-CER** (6870569956) for one_arm_dumbbell_row. One card, not two: Q-HFG-1 says why.

Builder: `claude-opus-5-5`. Deciding what is a row's real shape and what would be a loosening is judgement work. A fresh Opus reviewer follows. No screen change, no runtime change, no stage flip, no MANIFEST byte.

Sources:
- W9 #433: LAYERS READY 6911918023 and `LIB-SHIP-DESIGN.md` "W9 rulings and layers evidence" (the measured reds); LAYERS APPROVED 6911987250 (the follow-up names);
- #425 F-HT4-RIGHTPOSE: D-RP-OPTIN 6868123318 and the drop ruling 6870569956;
- W7 #394: D-SHIP-W7-HOLD2 6753333493 (high_knees);
- W5 `3c6efe61` (D-SHIP-A6NOGRIP).

Scratch checks (supervisor scratchpad `w10chk/` and `w10-trunkeq.mjs`, from `git archive` of main; never committed):
- the trunk-form test below, run on the real specs and sheets;
- a survey of every How-to sheet for `rows: []`, `primary: []` and `archetype: 'none'` without D-SHIP-GRIP.

id: F-HARNESS-FEEL-GRIP
mode: auto
title: 'Builder: F-HARNESS-FEEL-GRIP, the harness learns the real feel and pose shapes'
branch: `claude/f-harness-feel-grip` from main, now. It does not depend on W9. The first push opens a draft PR 'F-HARNESS-FEEL-GRIP'.
slot: before LIB-SHIP W10's LAYERS READY, so its 3 rows can join W10 (lib-ship-w10-card.md S4).

## Purpose
- W9 held cable_external_rotation and jumping_jacks on fidelity reds (S3). Both sheets are approved; the harness assumes shapes they do not have.
- one_arm_dumbbell_row (W10) shares CER's pose red.
- Freeing the 3 rows is +3 toward the 142. high_knees (W11) may also gain (Q-HFG-5).

## Reds
Each red from the W9 dry run, traced to its code path on main.

| row | check | red | code path | cause (the row's real shape) |
|---|---|---|---|---|
| CER | HT4/A6 | crash: "feel-band animation not found to pause deterministically" | `goldenB.mjs:234` always adds the "feel playing" state; `playFeelPaused` :179-193 throws at :192 when the map has no `.feel-band`; called from `ht4.mjs:288` | **no primary muscle.** The card's `feel.primary` is `[]`, and so is the sheet's (`lib_cable_external_rotation.howto.mjs:158`, D-SHIP-W6-NOPRIMARY). The map draws a band only for a primary, so it has none |
| CER | HT8/L4, S4, reduced | "0 bands" | `ht8.mjs:124` (`!la.length`); :137 (`is-playing` still set); :184 (`!s.n`) | the same. For S4: a tap adds `is-playing` (`useFeelMap.ts:31-36`); with no band, no `feel-sweep` animationend ever clears it. Golden B's script is the same port, so the golden page behaves the same way |
| CER | HT4/A5-poses | "cer-turn-right/-under poses match no reference pose" | `ht4.mjs` `libraryA5` :219-229: a zoom off `RULED_RIGHT_POSES` (:160-166) gets no declared Right; the per-call check then needs a JSON-equal reference pose | **the end pose, written another way.** `right: { base: 'end', pose: { trunk: { flex: 0, yaw: 0 } } }` (:138) over an end pose with `trunk: 0` (spec `cable_external_rotation.mjs:45`). The engine draws both the same: `body.mjs:90` turns a number n into `{ flex: n }`, and :111-112 default flex, yaw and lat to 0 |
| oadr (W10) | HT4/A5-poses | not run; the same red is expected | the same | the same Right (`lib_one_arm_dumbbell_row.howto.mjs:97`; spec :61 `trunk: 0`) |
| jj | HT4/A6 | crash: ".grip selector matches nothing" | `gripOf` (`ht4.mjs:275-282`) is true, so `statesFor` adds the grip state | **not a harness gap.** jj's sheet says `handling: { archetype: 'none' }` with no `why` (:122), so `noPairRuling` (`gen/hands.mjs:174-179`) returns null. Every other none-hand sheet names D-SHIP-GRIP, except box_jump and superman (survey). The fix is the sheet's `why`, in its ship wave (Q-HFG-3) |
| jj | HT8/size | "the source has none, but the build has feel-…" | `fidelity.mjs:130`: a feel chunk is wanted only if `facts.rows.length > 0` | **a feel section with no rows.** jj's sheet has a map (primary quads and glutes, secondary side_delts) and `rows: []` (:94-104). `gen/feel.mjs:220-226` cuts a section for every shipped row, so the chunk is right |
| jj | HT9/A5 | "the feel section never mounted" | `ht9.mjs:311` (`openAll`) waits for `.feel .fr-btn`, a feel **row** button; :321 asserts exactly one row open | the same: the section mounts, but it has no row to open |
| jj | HT10/A1 | 13 probed < floor 15 | `fidelity.mjs:213` → `ht10Floor` :251 = max(15, E); `ht10Ruled` :254-261 needs a `text-zooms.json` entry that `textZoomOfSheet` accepts | **a short card.** jj has no grip line, no feel rows and one drawn posture zoom (`toes-forward`), so its own E is 13 (measured in W9's dry run). It is no text-zoom row: it keeps a drawn posture zoom |

**Survey (main):** `rows: []` only on jumping_jacks and high_knees; `primary: []` only on cable_external_rotation; `archetype: 'none'` without D-SHIP-GRIP only on box_jump, jumping_jacks and superman.

**Trunk-form test (run here).** A `sameDrawing` rule (below) on the real specs and sheets:

| zoom | base trunk | JSON-equal today | same drawing | mutant `trunk: { flex: 5, yaw: 0 }` |
|---|---|---|---|---|
| cable_external_rotation `cer-turn` | 0 | false (today's red) | **true** | false |
| one_arm_dumbbell_row `oadr-top` | 0 | false | **true** | false |

## Shared code
- Both holds are the same kind of gap: the harness reads the feel section's shape from the DOM or assumes golden B's, when the sheet's source says otherwise.
- Both fixes read one new source fact set in `tools/plates/library/fidelity/tuples.mjs` `sourceFacts` (:93-121): `feel` and `noPrimary`, next to the existing `rows` (:114).
- One scratch flip (CER, jj and oadr together) proves all of it in one fidelity run before and one after.
- Two cards would both edit `sourceFacts` and pay that 1.5-2.5 h proof and a 94-min CI cycle twice.

## Change
Smallest form. Every rule keys on the sheet's source, never on the DOM, and keeps a red for a row that claims the shape but lacks it.
1. **Source facts** (`tuples.mjs` `sourceFacts`):
   - `feel: !!src.feel`;
   - `noPrimary`: true only when the sheet's `feel.primary` is `[]` **and** its research card's `feel.primary` is `[]` (`docs/research/howto/cards/<id without lib_>.json`, read only when the sheet's is empty). A missing card gives false (fail closed).
   - `statesOf` is unchanged: no tuple is added or removed.
2. **HT4-A6, no primary** (`tools/plates/fidelity/goldenB.mjs`; `ht4.mjs:288`):
   - `statesFor` and `selfCheck` take `{ grip = true, primary = true }`, the D-SHIP-A6NOGRIP `grip` form. The defaults leave the 8 (the gate's `gb.selfCheck(page, id)` at `screenshot-gate.mjs:7573`) and every shipped row exactly as today.
   - With `primary: false`, the "feel playing (paused mid-sweep)" state becomes "feel tapped (no primary)": motion on, tap the map, wait as `playFeelPaused` waits, then throw if any `.feel-band` exists. `selfCheck` asserts this capture **equals** "feel at rest" (the tap drew nothing), where a playing state must differ.
   - `primaryAbsenceProblems(page, id)`: any `.feel-band` on the card is red (the `gripAbsenceProblems` form).
   - `ht4.mjs` passes `primary: !facts.noPrimary`.
3. **HT8, no primary** (`ht8.mjs`), when `facts.noPrimary`:
   - L4: 0 bands in the app and in the golden, and both animation lists `[]` and equal;
   - S4: the `is-playing` check becomes parity: the app's `[data-feel-map]` class list equals the golden's, and nothing runs in the map;
   - reduced: `{ n: 0, shown: 0, anims: 0, playing: false }`;
   - S5-mid, S5-end, S6, lazy and C12 run unchanged.
   A no-primary row that draws a band is red; a row with a primary and 0 bands stays red.
4. **HT4-A5, trunk form** (`ht4.mjs` `libraryA5`). A zoom off `RULED_RIGHT_POSES` whose declared Right differs from its base reference pose only in how `trunk` is written is accepted as that reference pose, on the D-RP-SCOPE calls only (Right, `-under`, dashed Wrong).
   - `sameDrawing(a, b)`: JSON-equal, or equal outside `trunk` with both trunks reading the same `{ flex, yaw, lat }` under `body.mjs:90` and :111-112. A trunk with any other key (`bow`) or an array is never equal.
   - The fault-pose guard applies unchanged.
   - `RULED_RIGHT_POSES` stays at its 5 entries; its exact-set pin and `poses-proof.mjs` are untouched.
5. **HT8/size** (`fidelity.mjs:130`): `want = facts.feel`, not `facts.rows.length > 0`. A feel sheet with no chunk, or a chunk with no feel section, stays red. HT7 and L2 are unchanged.
6. **HT9/A5, no rows** (`ht9.mjs`): a sibling `openAllNoRows`, used only when `facts.rows` is `[]`.
   - `openAll` stays byte-identical: it is the gate's A5 mutate (`screenshot-gate.mjs:7948-7976`), copied verbatim.
   - `openAllNoRows` waits for `.feel [data-feel-map]` (the section mounted), opens every other collapsed control as `openAll` does, and asserts that every `.feel` holds 0 `.fr-btn`.
   - A zero-row sheet that shows a row is red. A sheet with rows keeps `openAll`.
7. **HT10/A1, own E** (`fidelity.mjs` `ht10Job`): an exact ruled list `HT10_OWN_E`, `[{ id: 'lib_jumping_jacks', ruling, terms }]`.
   - For a listed row: the ruling must pass the `citesRuling` form; the card's terms (`ht10TermsOfDoc`) must deep-equal the pinned `terms` (the counts measured on the scratch flip); and the floor is its own E.
   - Every other row keeps `ht10Floor` unchanged, so the `f-ht10-textzoom.test.ts` lines hold.
8. **Grip: no harness change.** A none-hand sheet that names D-SHIP-GRIP already gets `grip: false` and its absence check. An unruled one stays red. jj's sheet gains its `why` in its ship wave (lib-ship-w10-card.md Q-W10-7).

## Rulings asked
Q-HFG-n, for the supervisor before 'F-HARNESS-FEEL-GRIP start'.
1. **Q-HFG-1: one card for both holds.** They share `sourceFacts`, the scratch flip and the review. Recommended: yes. If refused, the split is F-FID-NOPRIMARY (parts 1-4) and F-HARNESS-NOGRIP (parts 1, 5-7), and the second to merge rebases part 1.
2. **Q-HFG-2: the trunk-form Right is proved, not listed** (D-HFG-TRUNKEQ). 6870569956 asked for "a ruling on the pose itself" before oadr and CER join `RULED_RIGHT_POSES`. This card proves instead that each Right is its base reference pose, under the engine's own trunk rule.
   - Why: it is stricter. A list entry would accept any later Right on those zooms; the proof accepts only the same drawing, and a real change to either Right turns red. The list, its pin and the proof file stay as they are.
   - The other route: a pose ruling and two list entries (the D-RP-OPTIN form), with the exact-set pin moved from 5 to 7 as another card's test line.
   - Recommended: the proof.
3. **Q-HFG-3: jj's grip red is the sheet's, not the harness's.** jj's sheet lacks the D-SHIP-GRIP `why` that W5 added to every none-hand sheet then known (`3c6efe61`; its lb04 layers page did not change). The fix is that one line, in jj's ship wave (W10 Q-W10-7). box_jump's and superman's ship waves need the same line. Recommended: yes.
4. **Q-HFG-4: jj's HT10 floor is a ruled own-E entry with pinned terms** (D-HFG-OWNE), not a `text-zooms.json` entry (`textZoomOfSheet` refuses jj, which keeps a drawn posture zoom) and not a general floor change.
   - Why: E is exact for the card the page shows. The pinned terms catch a card that later loses a control, which is the risk the 15 floor guards.
   - Recommended: yes.
5. **Q-HFG-5: high_knees.** It is the only other sheet with `rows: []`, and its W7 reds ("the feel source and mount", 6753333493) match parts 5-6. The scratch run reports its rows as information only. F-NOREDFLAG-GATE stays open until that run shows what remains (an HT10 own-E entry would need its own ruling). Recommended: report only.
6. **Q-HFG-6: one other card's test line** (the D-UF-LINTPIN form). `tests/howto/lib-ship.test.ts:448` pins the exact text `gb.selfCheck(page, chrome, { grip: await gripOf(ctx.root, lib) })`. It becomes the new full call, still `toContain`. A new red: the call without `primary` is red. Name it in the PR with before and after. Recommended: yes.

## Write scope
- `tools/plates/fidelity/goldenB.mjs`: `statesFor`, `selfCheck`, and two new helpers. None of its 5 pinned functions (`classifyPose`, `classifyMistakePose`, `validateCalls`, `protectedFieldProblems`, `fragmentProblems`) changes, and no new helper is reachable from them.
- `tools/plates/library/fidelity/tuples.mjs` (`sourceFacts`);
- `tools/plates/library/fidelity/twins/ht4.mjs`, `ht8.mjs`, `ht9.mjs`;
- `tools/plates/library/fidelity.mjs` (`sizeJob` :130, `ht10Job`, `HT10_OWN_E`);
- a new `tests/howto/f-harness-feel-grip.test.ts`;
- `tests/howto/lib-ship.test.ts:448` only (Q-HFG-6).

**No AGENTS exception is needed.** `scripts/screenshot-gate.mjs` and `tests/theme.test.ts` are untouched. So is `twins/pins.json`: it pins gate text and the 5 goldenB functions, and none of them moves.

## Steps
1. **PLAN** (no code): post 'F-HARNESS-FEEL-GRIP PLAN @ <sha>' with the red table re-run on the base and the exact diff per part. Wait for 'F-HARNESS-FEEL-GRIP PLAN RULED'.
2. **Unit tests first, red on main.** Put each decision in a small exported pure function the twins call (for example `sameDrawing`, `l4Problems`, `s4Problems`, `reducedProblems`, `ownEFloor`, `feelChunkWanted`), and test each with the mutations below. Every test is red on main's code and green after.
3. **The change**, parts 1-7, nothing else.
4. **Scratch flip** (never committed; the W9 dry-run recipe): flip CER, jj and one_arm_dumbbell_row with scratch stamps and provisional page entries on lb07, lb10 and lb03. For jj, apply `c51ae277`'s hunk and the D-SHIP-GRIP `why`. Build, then run `MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/fidelity.mjs --ids lib_cable_external_rotation,lib_jumping_jacks,lib_one_arm_dumbbell_row --json <out>`:
   - **red before:** on main's harness, at least the families HT4, HT8, HT9, HT10 and L2; post each named red;
   - **green after:** every family, every theme. Every row passes except the 3 "no entry in budgets.json" rows per id (set at a flip).
   - Also once with jj's `why` removed: its HT4/A6 `.grip` red must stay.
   - high_knees: one extra after-run on a scratch flip of lb10, reported only (Q-HFG-5).
5. **QA and READY:** merge `origin/main` with a merge commit; run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once on the finished head; CI green. Post 'F-HARNESS-FEEL-GRIP READY @ <full sha>' with the before and after tables.

## Acceptance
Each mutation turns red and is restored; the PR lists each red line.
- **H1 Trunk form.** `libraryA5`'s poses row is [] for `cer-turn` and `oadr-top` on the scratch flip. `RULED_RIGHT_POSES` is the same 5 entries; every `f-ht4-rightpose.test.ts` line passes unchanged; `poses-proof.mjs` is byte-equal and green.
  - Mutations: a declared Right with `trunk: { flex: 5, yaw: 0 }`; with `yaw: 1`; with a `bow` key. Each is red.
- **H2 HT4-A6, no primary.** CER's self-check is [] with `primary: false`. `statesFor`'s defaults are unchanged (`lib-ship.test.ts:450-455` green; the gate call is unchanged).
  - Mutations: a band drawn on a no-primary card; the tap capture differing from rest; a sheet with `primary: []` whose card names a primary (`noPrimary` stays false, so today's crash stays). Each is red.
- **H3 HT8, no primary.** L4, S4 and reduced pass for CER.
  - Mutations: a band on a no-primary card (L4 and reduced red); a primary row with 0 bands (L4 red, as today); app and golden class lists differing (S4 red).
- **H4 HT8/size.** jj's feel chunk is wanted and in budget.
  - Mutations: a feel sheet with no chunk; a chunk for a sheet with no `feel` (a scratch row). Both red.
- **H5 HT9/A5, no rows.** jj's A5 passes. `openAll` is byte-identical to main's.
  - Mutations: a `.fr-btn` shown on a zero-row sheet; the map never mounting. Both red.
- **H6 HT10 own E.** jj's A1 passes at its own E.
  - Mutations: one pinned term changed; the entry's ruling citation removed; jj removed from the list (back to floor 15); an unlisted row with E < 15 (red at 15, as `f-ht10-textzoom.test.ts` pins). Each is red. The list is an exact set.
- **H7 Grip unchanged.** `gripOf` is byte-equal. jj without its `why` stays red on HT4/A6.
- **H8 Tripwire.** `twinProblems()` is [] and `twins/pins.json` is unchanged. The finished head's gate run (the 8 through HT-4, HT-8, HT-9 and HT-10) is green.
- **H9 Scratch-flip proof** as Steps 4, with the before and after tables in the PR.
- **H10 Green.** check, test:tz and the gate pass on the merged head, and CI is green.

## Mutations
| id | mutation | red |
|---|---|---|
| m1 | declared Right `trunk: { flex: 5, yaw: 0 }` | H1 |
| m2 | declared Right `trunk: { flex: 0, yaw: 0, bow: 1 }` | H1 |
| m3 | a `.feel-band` injected on CER's card | H2, H3 |
| m4 | `noPrimary` forced true for a row with a primary | H2 (a band shows), H3 |
| m5 | CER's card given a primary (sheet still `[]`) | H2 (crash stays) |
| m6 | `want` back to `facts.rows.length > 0` | H4 |
| m7 | a `.fr-btn` injected on jj's feel section | H5 |
| m8 | one pinned jj term changed | H6 |
| m9 | the `HT10_OWN_E` citation removed | H6 |
| m10 | jj's `why` removed (scratch) | H7 |
| m11 | the `ht4.mjs` call without `primary` | `lib-ship.test.ts:448` (Q-HFG-6) |

## Stops
Post on the PR and wait.
- S1: any edit needed to `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `twins/pins.json`, `poses-proof.mjs`, `RULED_RIGHT_POSES` or a sheet. That needs a ruling (an AGENTS exception for the gate files).
- S2: a change makes any row pass that is red for a reason other than the shapes named here, or changes any result on the 8.
- S3: the "feel tapped" capture differs from "feel at rest" on CER (the tap draws something). That is an app or golden behaviour question, not this card's.
- S4: the scratch flip shows a red not in the table. Post it with its code path; do not fix it here.
- S5: two failed tries of one approach with no new evidence.

## Never
- Loosen, skip or delete any check, tuple or floor for a row whose source claims the shape. Every state in `statesOf` still runs for every row.
- Read a row's shape from the DOM to excuse a missing element.
- Change a sheet, a card, a page, a stage, MANIFEST or a budget.
- Touch `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `twins/pins.json`, `poses-proof.mjs` or the 5 pinned goldenB functions.
- Edit another card's test line beyond `lib-ship.test.ts:448`.

## Risks
- **A rule that is too wide lets a real fault through.** Mitigation: each rule keys on the source, with a red for "claims it, lacks it" (m4, m5, m7); `sameDrawing` only reads the trunk forms the engine defines (m1, m2).
- **The golden's behaviour on a no-band map differs from the app's** (S4 parity). Both run the same ported script, so parity is expected [unverified]. Mitigation: S3; the run's S4 row.
- **An `is-playing` class left on a no-band map** may matter to a later feature. It has no visual effect today; out of scope, and noted for the owner of `useFeelMap.ts`.
- **The 1.5-2.5 h scratch proof** (fidelity 760-887 s per id). Mitigation: one run before, one after, 3 ids; families narrowed only for the before-run.
- **Late merge.** If this card misses W10's LAYERS READY, 3 rows wait a wave (W10 S4). Mitigation: start now, in a free lane.
- **box_jump and superman** will hit jj's grip red in their waves. Mitigation: Q-HFG-3 names the one-line fix.

## Forecast
[est] Build and unit tests 4-5 h; the scratch proof 2-3 h; review, one fix and CI 3-4 h. **READY about 1 day after start, merged about 1.5 days after.**

## Unverified
- oadr's HT4 red and the after-change results: no fidelity run here.
- jj's exact E terms (W9 measured E 13; the terms are pinned from the scratch run).
- That no other shipped or W10 row has a trunk-form Right (the F-HT4-RIGHTPOSE survey found only these two among approved-plate rows; shipped rows had none).
- high_knees' remaining reds after this change.

return: PR and head sha; links to PLAN, READY and the scratch-flip tables; per part the diff summary and its mutations; check, test:tz, gate and CI output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'F-HARNESS-FEEL-GRIP resume', sent to the session or posted on the PR.

Supervisor rulings: (none yet)
