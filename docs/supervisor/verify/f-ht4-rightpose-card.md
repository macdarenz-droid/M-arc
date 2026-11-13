# F-HT4-RIGHTPOSE: the HT4 twin's declared Right pose, and bulgarian's Rear knee panels

Owner: supervisor (drafted 11-13; status `draft`, rulings asked below). Base: origin/main `5b7d6e80` (train 92). Every file:line below was read on that commit. Builder: Opus for both parts (the twin rule's strictness and the panel fix are judgement work). This is a tool and close-up card: no app screen changes, no stage flips.

Sources: W8b #417 (LAYERS READY 6854783313; panel ruling 6856272493, D-W8B-RIGHTPOSE), F-W8A-HOLDS part 1 (F-HT4-UNDER, merged in `176d0526`), `f-w8a-holds-card.md`, `lib-platefix-5-card.md`, `lib-ship-card.md`.

## Rulings asked

1. **D-RP-SPLIT (recommended): 2 parts, 2 PRs.**
   - Part 1 is the twin fix, F-HT4-RIGHTPOSE, on `claude/f-ht4-rightpose`. It frees dumbbell_shrug.
   - Part 2 is the bulgarian close-up fix, F-BSS-REARKNEE, on `claude/f-bss-rearknee`. Together with part 1 it frees bulgarian_split_squat.
   - Both build in parallel. Part 1 merges first; part 2 merges main after it, so its HT4 proof runs on a head that has part 1.
   - Why: the write scopes do not overlap, part 1 has no MANIFEST change and no panel, and shrug should not wait on bulgarian's panel.
2. **D-RP-SCOPE (recommended): the twin accepts the declared Right pose on every call whose crop shows the Right pose, and on no other.**
   - crop.mjs draws `poseOf(z.right)` (:45, :74) in the Right crop, in the `<key>-under` crop (:146, `cropSpec(z, 'right')`) and as the base pose of a dashed Wrong crop (:75: `shown = solid ? … : right`).
   - The narrower rule (the Right crop only) would leave a red for cable_external_rotation and diamond_push_up (under) and one_arm_dumbbell_row (dashed Wrong). All 3 are approved-plate rows with a custom Right (see Why now).
3. **D-RP-NOFLIP (recommended): this card flips no row.** The next LIB-SHIP wave flips both ids. Reasons are in Ship decision.
4. **D-RP-PINS:** part 2's PLAN lists every other task's test line that its MANIFEST move turns red, before and after, in the D-PF5-PINS form. No such line is edited before this ruling.

## Why now

W8b (#417) holds dumbbell_shrug and bulgarian_split_squat under D-W8B-RIGHTPOSE.
- **dumbbell_shrug:** its layers card passed the W8b panel (6856272493). The only thing holding it is the HT4 twin.
- **bulgarian_split_squat:** it has the same twin red. It also has a second L5 failure, [3,3,4] in W8b after [3,3,3] in W5. The ruling asks for 3 things in both Rear knee panels: a full-width floor line, a visible gap under the Right knee, and the Wrong knee flat on the floor. Then a fresh panel check, because its verdict does not carry over.

### Twin facts
- **The path.** The twin is `tools/plates/library/fidelity/twins/ht4.mjs`. The brief's `tools/plates/library/twins/ht4.mjs` does not exist. F-HT4-UNDER moved its lines, so on main:
  - `faultPoses` is at :144-152;
  - `sideOf` is at :180-185, with the under branch at :183;
  - the reference set `refs` is at :187;
  - the per-call check is at :189-199. The declared pose set is filled only for `at.role === 'wrong'` (:193), and the message is at :196.
- **The red, reproduced on main `5b7d6e80`.** I ran a scratch tree (`git archive`; W8b's `lb03.layers.json` and `lb04.layers.json` @ `1fdf6975`) and called `libraryA5` as `runLibrary` does (:205-231). The `protected` row was [] for both ids, and the `poses` row read:
  ```
  dumbbell_shrug|dshrug-top-right: poses.start matches neither a reference pose ({"root":{"at":[0,0.9216…
  bulgarian_split_squat|rear-knee-right: poses.start matches neither a reference pose ({"root":{"at":[0,0.5668…
  ```
  The same lines appear for `poses.end`.
- **A sketch rule fixes both.** In that scratch copy only, the Right side also accepted `z.right` resolved as crop.mjs:45 resolves it. Both `poses` lists were then []. The copy was restored afterwards, and nothing was committed.
- **The declarations.**
  - shrug: `right: { base: 'end', pose: TOP }` (`lib_dumbbell_shrug.howto.mjs:97`; TOP at :76-80 is a D-SHIP-DRAWVAL value).
  - bulgarian: `right: { base: 'end', pose: KNEE_GAP }` (`lib_bulgarian_split_squat.howto.mjs:79`; KNEE_GAP at :59-63 is a D-SHIP-DRAWVAL value).
  - Both Wrongs are solid (:98, :80).
- **The survey on main** (every registry row with a library spec; a scratch script, not committed):
  - Shipped rows have 96 posture zooms, and every declared Right resolves to a reference pose. So no shipped row's accepted set changes.
  - 7 approved-plate rows declare a Right that is no reference pose:
    - dumbbell_shrug (`dshrug-top`);
    - bulgarian_split_squat (`rear-knee`);
    - one_arm_dumbbell_row (`oadr-top`, a dashed Wrong over the Right, :97-98);
    - cable_external_rotation (`cer-turn`, under, :138-139);
    - diamond_push_up (`shoulder-blades`, under, :164-165);
    - hack_squat (`knee-lock`);
    - wall_ball (`wall-distance`).
  - Every library page uses the `zoom` shell (all 15 `pages/*.closeups.mjs`). No library page uses `zbox`.
- **MANIFEST.** `fidelity/twins/ht4.mjs` is not a MANIFEST.json key, so part 1 moves no MANIFEST byte.

### Bulgarian facts
- **The judged page.** `tests/howto/golden/library/lb04.layers.html` @ `1fdf6975`, sha256 `44d1e1f8…`. The card (`gen/handpairs.mjs:97` `cardOf`) is 204,412 B, sha256 `3649e98cde40c5c02890463ca2b853bf4ebcdb6c7efdba8fcae445a8a7633323`. The same card builds byte-equal on main `5b7d6e80` (scratch lb04 in the W8b form).
- **The Rear knee crops.**
  - Both halves have viewBox `111.53 241.3 100 100`, so k = 171/100 = 1.71. The crop is centred on the Right pose's `knee.l` plus [-40, -24], with sizePx 100 (:78).
  - The plate's floor line is `M86.35 339.5H306.52`. That is 1.8 plate px, or about 3 panel px, above the crop's bottom edge, inside the frame's 10 px corner radius.
  - The :77 comment records why: the fix round 2 L7 recheck put "the floor near the bottom edge".
- **Engine numbers on main** (vendor engine; camera pxPerM 146.29, y0 339). The height of the rear kneecap's lowest point above the floor:
  - Right (KNEE_GAP): 0.113 m, which is 16.5 plate px, or about 28 panel px;
  - end: 0.069 m;
  - Wrong: 0.000 m, resting on the floor, as spec check `specs/bulgarian_split_squat.mjs:139` requires.
- **So the gap and the contact are already in the poses.** The floor they are read against sits at the panel's edge. This cause is inferred; the fresh panel judges it.
- **A stale comment.** The how-to comment at :56-58 ("6.9 cm gap against the end pose's 3.0 cm") is out of date: LIB-PLATEFIX-3 set END_GAP to 0.069 (spec :49-51).
- **MANIFEST.** `lib_bulgarian_split_squat.howto.mjs` is pinned in all 12 lb04 rows. It is in no committed layers config on main (lb04's group is front_squat, bodyweight_squat, bodyweight_lunge and bodyweight_split_squat), so no pinned page draws it.

### Shrug carry-over
The dumbbell-shrug card on a scratch lb03 page (main `5b7d6e80` plus `lb03.layers.json` @ `1fdf6975`) is 142,856 B with sha256 `1495a28273ebc8cfcec5196579ba2c1eff734420cebe28696def1ca533d9f6f6`. That is byte-equal to the judged card on `lb03.layers.html` @ `1fdf6975` (`f7ac4b15…`). Part 1 changes no file the page build reads, so its PASS carries over while that stays true.

## Scope and write_scope

### Part 1: F-HT4-RIGHTPOSE
**Do:**
- Add `rightPoses(z, { ref, family })` next to `faultPoses` (:144-152), in the same form.
  - zoom family only. It returns `poseOf(z.right)`, resolved exactly as crop.mjs:45 does, with functions stripped.
  - zbox keeps today's rule: reference poses only on its Right side.
- **Which calls may draw it.** The Right crop, a `<key>-under` crop, and a dashed Wrong crop may draw it as `poses.start` and `poses.end`. A dashed Wrong is one that is neither `wrong.solid` nor `wrongAlone` (crop.mjs:71).
- **Which calls may not.** It is never accepted for `mistake.pose`, for base, cam or `-n`/`-m`, or for a solid Wrong's poses.
- **A guard.** A declared Right pose that equals one of the zoom's own fault poses (`faultPoses(z)`) is a poses problem: "declares a fault pose as its Right". This keeps D-LIB4b-POSES's "never the fault on the Right side" true through a declaration.
- **Messages.**
  - When no object Right is declared, every message stays byte-equal to today's.
  - Otherwise the text adds " nor its declared Right pose".
- Update the comments at :154-161 and :171-174 to name the rule.

**write_scope:**
- `tools/plates/library/fidelity/twins/ht4.mjs`: `libraryA5` and the new function only;
- an add-only block named F-HT4-RIGHTPOSE after :300 in `tests/howto/library-fidelity.test.ts`;
- one new file, `tests/howto/f-ht4-rightpose.test.ts`, for the scratch-tree proofs in the `f-w8a-assisted.test.ts:95-113` form.

### Part 2: F-BSS-REARKNEE
**Do:**
- **The crop.** Change the `rear-knee` zoom's `crop` (`lib_bulgarian_split_squat.howto.mjs:77-78`: the centre offset, and sizePx if needed) so that, in both halves:
  - the floor line sits well inside the panel;
  - the line spans the panel's full width;
  - the rear knee, shin and bench still fill the frame (L7).
- **An optional guide.** If the plate's floor line alone does not read, add the existing `level` guide at the floor point (crop.mjs:161; drawn full panel width in both halves, `tone: 'neutral'`).
- **What stays.** No spec, pose, renderer or plate change: the Wrong kneecap already rests on the floor.
- **The comment.** Fix the stale comment at :53-60 with the numbers above.
- **The scratch page.** Build a scratch lb04 page with bulgarian added in the W8b form: main's then-current `lb04.layers.json`, plus bulgarian's group entry and `closeups` entry as in `1fdf6975`. Build it twice and post its sha256 and the recipe.
  - Never commit the config.
  - The supervisor runs a fresh layers panel on it (L1-L8, the D-PFC-ROUND1 form, the lyr-pf11 setup) for bulgarian only.
  - One fix round, a recheck, then HOLD (D-LIB13-PANEL2).
- **MANIFEST.** One `[golden update]` commit, made by `manifestOf` (`tools/plates/library/ci/manifest.mjs:96`). It moves only the bulgarian how-to key, in the 12 lb04 rows. Prove it with a blanked-keys test (the F-W8A-ASSISTED A1 form, `f-w8a-assisted.test.ts:150-163`).
- **Other tasks' MANIFEST tests.** These turn red when the key moves. They are expected to include f-w8a-assisted A1, `pair-faults.test.ts:208-342`, crop-projection, lib-shapes and research-routes; that is inferred from `platefix5-pins.ts:1-8`. Each one gets one add-only call to a new helper, `tests/howto/f-bss-rearknee-pins.ts` (the platefix5-pins.ts form), under D-RP-PINS.

**write_scope:**
- the `rear-knee` zoom and the :53-60 comment in `lib_bulgarian_split_squat.howto.mjs`;
- `tools/plates/library/MANIFEST.json` (`[golden update]`);
- the new `tests/howto/f-bss-rearknee.test.ts` and `tests/howto/f-bss-rearknee-pins.ts`;
- the D-RP-PINS lines, once ruled.

### Ship decision
**Recommended: leave both flips to the next LIB-SHIP wave (D-RP-NOFLIP).** Why:
1. **The house rule.** F-W8A-HOLDS says "No held row flips here … The flip is a later LIB-SHIP wave". PF5 says "Flipping any row: the W8 lanes do that". A flip needs the ship machinery that lib-ship-card.md assigns to waves:
   - a STAMP comment copied into reviews.json (D-SHIP-LPANEL);
   - a layers-page pin;
   - the stage flip and `generate`;
   - budgets at measured + 10 %;
   - the exact-ruled-set guards (A9: lib-ship A1, lb3 and lb4 A9, library-ci C6, the counts).
2. **Lane conflict.** W8b (#417, open) is editing those same guards, the lb03 and lb04 configs and the pins now. A tool card that flips would collide with it.
3. **Evidence validity.** Shrug's PASS holds only while its card is byte-equal. The wave builds the final lb03 page after W8b lands and checks the card then. Pinning here would freeze a page that is still moving.
4. **Cost.** The two ids join a wave that runs anyway, so there is no extra CI run or train.

**Rejected: flip here.** It would add a full wave's scope to a tool card, and it puts both ids' stamps ahead of part 2's panel.

**What the wave owes:**
- **shrug:** the lb03 group entry; a card compare against `1495a282…`; the appended `'supervisor'` layers-page entry; the STAMP; flip, generate and budgets; the guards.
- **bulgarian:** the same on lb04, with the card sha that part 2's panel approved. It needs both parts merged.

## Acceptance

Each row is evidence on the READY head. A test row must be red on main and green after, unless it is marked "kept".

| id | part | check | evidence |
|---|---|---|---|
| C1 | 1 | Fixture zoom with `right: { base: 'end', pose: X }`. Its Right crop, its under crop (solid + under) and a dashed Wrong's base drawing `mergeDeep(E, X)` all pass. The problem lists are [] | the add-only block |
| C2 | 1 | Real rows on a scratch tree: dumbbell_shrug (lb03) and bulgarian_split_squat (lb04), each staged in the W8b form, have HT4/A5-protected, A5-fragments and A5-poses green | `f-ht4-rightpose.test.ts`, child process, F-W8A-ASSISTED A2 form |
| C3 | 1 | Real branches: one_arm_dumbbell_row (lb03, dashed) and diamond_push_up (lb07, under) show no poses line for their Right, under or dashed-Wrong calls. Any other red is posted as a finding and not fixed here | posted output with the scratch recipe |
| C4 | 1 | Kept: the D-LIB4b-POSES block (`library-fidelity.test.ts:225-266`) and the F-HT4-UNDER block (:270-300) are unchanged and green | `git diff origin/main` on those lines is empty |
| C5 | 1 | Shipped rows unchanged: the survey (96 shipped posture zooms, each Right a reference pose) is re-run and posted, and every shipped id's HT4 rows are green in CI | PR comment; CI |
| C6 | 1 | Nothing else moves: the diff names only the write_scope files; `node tools/plates/generate.mjs --check` is clean; MANIFEST.json is unchanged | `git diff --stat`; command output |
| C7 | 2 | Floor in view: in both Rear knee crops the floor line is at least 20 panel px above the bottom edge (today about 3; the frame's corner radius is 10). The crop's x range lies inside the floor's drawn extent [86.35, 306.52] plate px | `f-bss-rearknee.test.ts`, from the built crop svgs |
| C8 | 2 | Gap and contact: the Right kneecap's lowest point is at least 15 panel px above the floor line (today about 28), and the Wrong kneecap's lowest point is within 1 panel px of it | the test, from engine landmarks projected with the crop's camera (`engineCrop` probe, crop.mjs:38-40) |
| C9 | 2 | L7 kept: `knee.l`, `ankle.l` and the bench top edge are inside both halves, at least 8 panel px from every edge | the test |
| C10 | 2 | Card scope: the scratch page's bulgarian card differs from `3649e98c…` only inside the Rear knee block, and every other card on that page is byte-equal to the same page built without the change. The page is built twice with an equal sha256 | the test, plus the posted shas |
| C11 | 2 | Nothing pinned moves: the 14 pinned layers pages rebuilt with `scripts/howto-rebuild.mjs` equal their pins; `generate.mjs --check` is clean; MANIFEST moves only the bulgarian how-to key in 12 rows; the D-RP-PINS lines are as ruled | the blanked-keys test; command output |
| C12 | 2 | HT4 on the real row: C2's bulgarian proof re-run with part 2's crop on a head that contains part 1 | `f-bss-rearknee.test.ts` |
| C13 | 2 | Panel: the fresh layers panel passes bulgarian (every median 4 or more, or a recorded exception), or HOLD after one fix round and a recheck | the supervisor's ruling comment |
| C14 | both | Shrug carry-over: on each READY head, the scratch lb03 dumbbell-shrug card is 142,856 B with sha256 `1495a282…`. If not, post the diff for a delta check (the Q-W8b-3 form) | posted shas |
| C15 | both | The READY head contains the latest main. `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` and CI are green. A fresh Opus reviewer follows each READY | CI links |

The C7-C9 numbers are proposals: 20 px clears the 10 px corner radius by 10 px, and 15 px is about half of today's Right gap. The PLAN may argue other values, with the L7 trade-off measured.

## Mutations

Each one must turn a named test red. Post the red lines.

| id | part | mutation | red |
|---|---|---|---|
| m1 | 1 | A wrong declared pose: the Right crop draws the declared pose with one value changed (fixture `neck` +1; in a scratch copy, shrug TOP elev 13) | C1 or C2, with "…matches neither a reference pose nor its declared Right pose" |
| m2 | 1 | No declaration (`right: 'end'`): the Right crop draws a custom pose | C4's B5 test (:241-244), with today's text |
| m3 | 1 | A shipped-style row gains acceptance: the Wrong pose is accepted on the Right side of a string-Right zoom | C4's "never on the Right side" line (:250-251) |
| m4 | 1 | The suffix is always appended (an undeclared message changes) | C4's F-HT4-UNDER m6 regex (:293-296) |
| m5 | 1 | The declared Right is accepted for a solid Wrong's poses, for `mistake.pose`, or for base or `-n`/`-m` (one case each) | C1 |
| m6 | 1 | The rule applies to the zbox family | C1 (a zbox fixture with a custom Right stays red) |
| m7 | 1 | A declared Right equal to the zoom's fault pose is accepted | C1 |
| m8 | 1 | The under branch, or the dashed-Wrong branch, without the declared pose (one each) | C1 |
| m9 | 2 | Main's crop window | C7 |
| m10 | 2 | The Right drawn at the Wrong's pose (scratch copy) | C8, gap |
| m11 | 2 | The Wrong kneecap lifted 1 cm (scratch copy, root +0.01 m; about 2.5 panel px) | C8, contact |
| m12 | 2 | The floor's `to` shortened in a scratch spec copy so the line stops inside the panel | C7, width |
| m13 | 2 | The crop moved so the bench top or `ankle.l` leaves a half | C9 |
| m14 | 2 | One byte changed outside the Rear knee block | C10 |
| m15 | 2 | A second MANIFEST key moved | the blanked-keys test |

## Rules

- Read `.claude/skills/builder/SKILL.md` first. Branch from origin/main and name the sha. Open a draft PR and post `<ID> PLAN @ <sha>`.
- **PLAN first.**
  - Part 1 names the function, the call kinds, the message texts and the test list.
  - Part 2 names the crop window and the C7-C9 numbers. If L7 and L5 pull apart, it gives both options. It also gives the D-RP-PINS list: every other task's test line, before and after.
  - Wait for PLAN RULED, then build and post `<ID> READY @ <full sha>`. Part 2 also posts `F-BSS-REARKNEE LAYERS READY @ <sha>` with the page sha256 from two builds and the recipe, before its pins.
- **MANIFEST.json** changes only in a `[golden update]` commit made by `manifestOf`. It moves only the keys of the files the part changes.
- **Never loosen a check.** No test, guard or tolerance is cut, narrowed or skipped. Other tasks' lines move only under D-RP-PINS, each at least as strict, with their mutations kept red. The C4 blocks are never edited.
- **No flips (D-RP-NOFLIP).** Batch stages, committed `pages/*.layers.json`, layers-page pins, stamps and budgets are the ship wave's.
- **Never touch:**
  - research cards and quotes, plate specs (`specs/**`), golden pages and their pins, `GOLDEN.json`;
  - `tools/plates/vendor/**`, `tools/plates/layers/**`, `render/**`;
  - `fidelity/goldenB.mjs`, `fidelity/harness.mjs`, `fidelity/ht10.mjs`, `fidelity/twins/pins.json`;
  - `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `src/**`, `package*.json`;
  - `escobar-worker/**`, `native/wear/**`, signing and keystores, saved-data shapes (AGENTS.md).
- No closing keywords in commits or in the PR body (F-COMMIT-KEYWORDS).

### Stops
Post the question and wait.
- Part 1: a shipped id's HT4 result changes in any way, or the C3 rows show a red caused by this rule.
- Part 2: C7 and C9 cannot both hold in one 100-200 px window. Post both windows with their numbers and ask.
- Part 2: the floor line still does not read, and only a renderer change would fix it (for example, a heavier floor stroke). That becomes an opt-in `render/closeup` card in the E3 form, not this one.
- Any pinned page, generated file or other card's byte moves.

## Risks

- **Over-broad acceptance hides a wrong Right pose (part 1).** Mitigation: the pose is resolved exactly as crop.mjs:45 does; only the 3 call kinds that show the Right pose get it; a fault-pose declaration is refused; m1-m8.
- **Shrug's carry-over breaks.** A main merge that moves any lb03 card byte would do it: W8b, F-SHEET-COPY (#423, open; its files are mostly src/ and research JSON) or a crop.mjs change. Mitigation: C14 on each READY head and again in the ship wave. A diff gets a delta check, not a full panel.
- **The crop fix trades L7 for L5 (part 2).** The floor sits at the edge because the L7 recheck asked for it (:77). Mitigation: C9; the PLAN posts both windows; the fresh panel judges L1-L8 together.
- **A third L5 failure (part 2).** Mitigation: one fix round, a recheck, then HOLD (D-LIB13-PANEL2), with the follow-up named then.
- **Cross-task MANIFEST pins (part 2).** One key in 12 rows turns other tasks' blanked-keys tests red. Mitigation: the D-RP-PINS ruling before any edit, the platefix5-pins.ts helper form, and the old mutations kept red.
- **Lane overlap with W8b (#417) on lb04.** Mitigation: scratch configs only. Merge main with a merge commit whenever it moves, and rebuild the scratch page from main's then-current config.
- **The other 5 custom-Right rows meet a different red later.** Mitigation: C3 runs 2 of them now. The rest are inferred and will be checked by their own ship waves.

## Forecast

Each estimate is build plus review plus one fix round. CI wall time is about 66 min a run (F-W8A-HOLDS, run 42898934120; not re-measured).
- **Part 1:** about half a day. One scratch A5 build takes about 20 s an id here, plus one full CI run.
- **Part 2:** about 1.5 days, set by the D-RP-PINS ruling, the supervisor's panel (about half a day) and one fix round.
- **Calendar:** both merged in about 2 days if they run in parallel. The flips are in the next LIB-SHIP wave and are not counted here.
- **Assumptions:** the weekly usage limit allows the runs, and W8b merges before or alongside part 2.
- **Uncertainty:** whether one crop window satisfies L5 and L7 together, and the size of the D-RP-PINS list.

## Not verified

- The HT4 red for one_arm_dumbbell_row, cable_external_rotation, diamond_push_up, hack_squat and wall_ball. This is inferred from crop.mjs:74-76 and :146 and was not run. C3 runs two of them.
- The full fidelity run (HT10, A6 in a browser) for the 2 ids on a fixed tree. Only `libraryA5` was run, with no pinned plate entry passed. W8b's dry run found only budget reds besides HT4 (6854783313).
- Which other tasks' MANIFEST tests part 2 turns red. This is inferred from the blanked-keys form and was not run.
- That the floor's place at the edge is what failed L5. That is inferred from the crop numbers; the panel's words are in 6856272493.
- Whether the C7-C9 numbers suit the critics. They are proposals, not critic values.
- Whether #417 or #423 moves shrug's card once merged.
