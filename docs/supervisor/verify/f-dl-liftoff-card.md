# F-DL-LIFTOFF: conventional_deadlift's Liftoff close-up as a Wrong overlay on the Right

Owner: supervisor (drafted 11-14; status `drafted`, rulings asked). Base: origin/main `d92830c2` (train 94). Every file:line below was read on that commit. Builder: Opus (the drawing values and the panel numbers are judgement work). This is a close-up card for one how-to sheet: no app screen changes, no stage flips. One part, one PR, on `claude/f-dl-liftoff`.

Sources: W8b #417 (PLAN ruling 6847824876: a held conventional_deadlift also holds sumo_deadlift; panel ruling 6856272493), `f-ht4-rightpose-card.md` (its part 2, F-BSS-REARKNEE, is the form for this card), `panels/w4-findings.md`, `lib-ship-card.md`.


## Supervisor rulings (2026-11-14; these win over the text below)
1. **D-DL-FORM: the house dashed form.** The Right is drawn solid and the Wrong as a dashed red outline over it (crop.mjs:71, :75, :83), with a red arrow at the hip, as on cable_lateral_raise and sumo-start. The two faded or dashed-Right options stay rejected.
2. **The bounds** go to the panel only when all of them are measured and posted: hip rise ≥ 18 panel px, knee ≤ 20°, arrow ≥ 18 px, floor ≥ 20 px from the bottom edge.
   - Another L5 failure is conventional_deadlift's third, so it holds with no further round.
3. **sumo_deadlift:** its card must stay byte-equal to `b1c29f89…`. Any change to a shared file (crop.mjs, zoom-css.mjs, the lb03 `ZOOM` record) is a Stop.
4. **No flip here.** The ship wave after W8c flips both ids.

## Rulings asked

1. **D-DL-FORM (recommended): the house dashed-Wrong overlay, plus a red up-arrow at the hip.**
   - The Liftoff Wrong stops being solid. The Wrong crop then draws the Right pose as its base and the shot-up pose as the dashed red Mistake outline over it (House form, below).
   - A red `drop` arrow runs up from the Right hip to the shot-up hip.
   - The bar stays on the floor, and the knees straighten clearly (Numbers, below).
   - **One wording point.** The ruling and the brief say "the Right hips and back as a dashed ghost". The house form draws it the other way round: the Right stays solid, and the Wrong is the dashed red outline. That is the form sumo_deadlift passed W8b with, for the same fault. The two options that would draw the Right dashed or faded are under Rejected options.
2. **D-DL-NUMBERS:** the C2-C7 values are proposals. The PLAN measures them on the built crops and may argue other values, with the L5/L7 trade-off measured.
3. **D-DL-PANEL: a fresh layers panel for conventional_deadlift, and a third L5 failure holds it with no further round.**
   - L5 has failed twice already: W4 round 2 [3,3,3] and W8b [3,3,4] (6856272493).
   - Any other row is counted as D-LIB13-PANEL2 counts it: a first failure gets one crop-checked fix round, and a second failure holds.
4. **D-DL-NOFLIP (the D-RP-NOFLIP form): neither id flips here.** The next LIB-SHIP wave flips conventional_deadlift and then sumo_deadlift, in the same head, parent first (`plan-w8.md:63`, `:145`).
5. **D-DL-PINS:** the PLAN lists every other task's test line that the MANIFEST move turns red, before and after, in the D-PF5-PINS form. No such line is edited before this ruling.

## Why now

W8b (#417) holds conventional_deadlift for **L5 [3,3,4], its second L5 failure** (W4 round 2 had [3,3,3]). The panel's words (6856272493): the Liftoff Wrong "Hips shoot up" is nearly the Right, with the hip about 28 px higher and no ghost or arrow. sumo_deadlift is held with it (PLAN ruling 6847824876). Sumo's own W8b verdict is a PASS, and it carries over if its card stays byte-equal.

### Liftoff facts
- **Today's zoom.** `dl-liftoff` is at `lib_conventional_deadlift.howto.mjs:139-156`.
  - The crop is centred on the Right pose's `hip.r` plus [0, 10], sizePx 200 (:141).
  - `right: 'end'` (:142). The Wrong is `{ base: 'end', pose: SHOOT, solid: true }` (:143): the shot-up pose drawn alone, so the Right pose is not in the Wrong crop.
  - No guide. The Wrong callout anchor is the string `'hip.r'` (:146), which resolves on the pose the crop shows.
- **The shot-up pose.** SHOOT (:66-75, :82-86) keeps the bar and the feet where they are. It raises the root straight up until the near knee opens to SHOOT_KNEE 30 deg of flexion, then tips the trunk until the straight arm reaches the bar again. SHOOT_KNEE is a D-SHIP-DRAWVAL value (:72-74).
- **Engine numbers on main** (a scratch copy of main's tree; vendor engine; camera pxPerM 146.29, x0 172, y0 339; built crop viewBox `9.07 145.8 200 200`, so k = 171/200 = 0.855):
  - `hip.r` rises 0.1135 m. That is 16.6 plate px, or **14.2 panel px**, at the same x.
  - Knee flexion goes from **64.0 deg (Right) to 30.0 deg (Wrong)**.
  - The back (sacrum to neck) goes from 14.8 deg above horizontal to 0.2 deg.
  - The bar (`grips`) and both feet do not move.
- **The critics' 28 px** matches 2 × 14.2. The W4 panel's screenshots draw a 171 px panel about 340 px wide (`panels/w4-findings.md:73-75`, panels at x 36-376). So critic px read as about twice panel px. This is inferred.
- **The floor in the crop.** The floor line is `M62.29 339.5H281.71`.
  - It sits 5.4 panel px above the crop's bottom edge, inside the frame's 10 px corner radius (crop.mjs:32).
  - It starts 45 panel px in from the left edge.
  - The bar's plate is 3.5 panel px from the right edge.
  - F-BSS-REARKNEE found the same "floor at the edge" with bulgarian's L5.
- **The judged page.** `tests/howto/golden/library/lb03.layers.html` @ `1fdf6975`, sha256 `f7ac4b15…`. The conventional card (`gen/handpairs.mjs:97` `cardOf`) is 240,995 characters (240,997 UTF-8 bytes), sha256 `e0a154bd9d8408039c62ff62750d498ccde155049dab17e244e58b50e084bc1d`.
- **It still builds on main.** I rebuilt lb03 on main `d92830c2` with `lb03.layers.json` @ `1fdf6975` (`node scripts/howto-rebuild.mjs --page tests/howto/golden/library/lb03.json layers-page <out>`). The whole page is byte-equal to the judged one (`f7ac4b15…`).
- **A sketch fix, in scratch only.** I dropped `solid: true`, added a `drop` from `{ at: 'hip.r', pose: 'right', off: [0, -4] }` to `{ at: 'hip.r', pose: 'mistake', off: [0, -4] }`, and moved the Wrong anchor to `{ at: 'hip.r', pose: 'mistake' }`.
  - The page then differs only inside the conventional card, which grows to 271,189 characters. The sumo and shrug cards are byte-equal.
  - The arrow is `M85.5 73.53V60.33`: a 13.2 px shaft. That is too short to read; see Numbers.
  - The copy was restored, and nothing was committed.
- **MANIFEST.** `lib_conventional_deadlift.howto.mjs` is pinned in all 12 lb03 rows (MANIFEST.json; for example :3295 in its own row and :11395 in lib_sumo_deadlift's row). It is in no committed layers group on main (`pages/lb03.layers.json` groups 6 shipped ids), so no pinned page draws it.

### House form
- **What crop.mjs draws.** A Wrong that is neither `wrong.solid` nor `wrongAlone` (crop.mjs:71) draws the Right pose as both of its poses (:75: `shown = solid ? … : right`), and passes the Wrong pose as the plate's `mistake` (:83).
  - The engine outlines the Mistake pose's changed parts in a masked union (vendor `engine/plate.mjs:232-246`), dashed in `--mistake` (`layers/engine/plate.mjs:333`, in every zoom sheet through zoom-css.mjs:11, :25).
  - A `drop` guide is crop-only (crop.mjs:27), drawn in the Wrong crop only (:135), vertical at its start point's x, with the head pointing the way the point moves (:162-165). Its CSS is on every non-e1 sheet (zoom-css.mjs:99). So no CSS option, no crop.mjs change and no shared record change is needed.
  - In this form a string anchor resolves on the Right pose (crop.mjs:90, :100). So the Wrong callout must name `pose: 'mistake'` (:91), as sumo does.
- **Precedents:**
  - sumo_deadlift `sumo-start` (`lib_sumo_deadlift.howto.mjs:84-85`, :91, :94): the same fault, "Hips shoot up", drawn dashed over the Right. It answered W4 L5 [4,3,2], whose critics asked for "a red dashed ghost of the Right hip line" (`panels/w4-findings.md:73-75`), and it passed W8b.
  - The same sheet's `dl-start` (:121-124): a dashed Wrong over the Right start, from W4 recheck 2.
  - Shipped `cable_lateral_raise` `clr-elbow-lead` (`lib_cable_lateral_raise.howto.mjs:126-133`): the W6 panel L5 fix, a dashed Wrong plus a red `drop` from the Right point to the Wrong point. This is the exact shape this card asks for.
  - Shipped `close_grip_pulldown` (:146-147), a dashed Wrong plus a drop; and shipped `landmine_row` (:86) and `t_bar_row` (:82), both lb03 W4 L5 fixes in the dashed form.
- **HT4.** The twin accepts this with no new entry:
  - the dashed Wrong call draws `poses.start`/`end` = the spec's end, a reference pose (`fidelity/twins/ht4.mjs:217`, :237);
  - its `mistake.pose` is `mergeDeep(end, SHOOT)`, a declared fault pose (:145-152, :239).
  - `dl-start` already passes this way on the same sheet. So RULED_RIGHT_POSES (:160-166) is not touched. This is inferred and was not run; C10 runs it.

### Rejected options
- **(b) A solid Wrong over a faded Right (`wrong.under`, crop.mjs:146).** The Right is faded, not dashed. It needs the `fade` CSS option (zoom-css.mjs:94) on a new conventional-only record in `pages/lb03.closeups.mjs`, which moves that MANIFEST key in 12 rows.
- **(c) A solid Wrong with the Right back as a grey dashed `spine` line, plus a drop** (the plank form, `lib_plank.howto.mjs:117-118`). It is a straight line, not the hips' outline. It needs the `spine` CSS option (zoom-css.mjs:98) and the same record change. If the supervisor wants a literally dashed Right, this is the closest form.

### Sumo facts
- **No shared Liftoff zoom.** Sumo has no Liftoff zoom: the card zooms `sumo-start` and `sumo-liftoff` are merged into one zoom, `sumo-start` (`lib_sumo_deadlift.howto.mjs:14-16`, :86-106; chips :205).
- **No shared how-to code.**
  - Sumo's how-to imports only its own spec and the shared RED_FLAG (:19-20). Conventional's imports its own spec, `../engine.mjs` and RED_FLAG (:13-15).
  - Both headers say the family leaves are "written out, never imported" (sumo :9-10, conventional :9-10).
  - Sumo's spec imports only `../engine.mjs` (`specs/sumo_deadlift.mjs:30`; "never imported (D-LIB9-CLONE)", :9).
- **Shared code.**
  - Both crop through the same `ZOOM` record (`pages/lb03.closeups.mjs:4-8`, :14-15), `render/closeup/crop.mjs` `engineCrop` (:40-193), `zoom-css.mjs` and the vendor engine. A change to any of these would move sumo's card.
  - The family lint compares sumo's inherited leaves with the parent's (`lint/family.mjs:94`; conventional :91). The fix touches none of those leaves.
- **Measured.** A conventional-only how-to change leaves sumo's card byte-equal (the sketch above): 198,677 characters (198,679 UTF-8 bytes), sha256 `b1c29f89112a13a7bc104e7a7cf584cc4afa72c4dbe3273e4ed842f2d8d3dd0b`, the card judged at `1fdf6975`.
- **So sumo needs no delta check** while the fix stays inside conventional's how-to. If the fix moves sumo's card (a crop.mjs, zoom-css.mjs, `ZOOM` record or engine change), sumo gets a delta check in the Q-W8b-3 form before the wave.

## Scope and write_scope

**Do:**
- **The overlay.** In `dl-liftoff` (:139-156), drop `solid: true` from the Wrong (:143). Keep `right: 'end'` (a string, so the twin's Right side stays reference poses only).
- **The arrow.** Add one `drop` guide from the Right pose's `hip.r` to the Wrong pose's `hip.r` (the `clr-elbow-lead` form), with offsets that keep the arrow off the outlines. Offsets are drawing values.
- **The knees.** Lower SHOOT_KNEE (:75, a D-SHIP-DRAWVAL value) so the knees read as nearly straight, as the Wrong alt already says (:154). Engine numbers on main, with sizePx 200 / 180:
  - SHOOT_KNEE 30: hip rise 14.2 / 15.8 panel px, and the knee moves back 12.2 / 13.6 px;
  - SHOOT_KNEE 20: 16.4 / 18.2 px, and the knee moves back 16.3 / 18.1 px;
  - SHOOT_KNEE 15: 17.2 / 19.1 px, and the knee moves back 18.4 / 20.4 px.
  - In all three, the bar, both feet and the straight arm length (0.6665 m) are unchanged.
- **The window.** Move the crop (:141: the offset, and sizePx if needed) so that, in both halves:
  - the floor line is well inside the panel;
  - the Right and Wrong hips, sacrum and neck, the knee and the bar's plate are all inside.
  - For example, with SHOOT_KNEE 15, sizePx 180 and `off: [15, 35]`: the floor is 20.2 px up, the plate 8.7 px in from the right edge, both necks and sacra 17-21 px below the top edge, and the hip rise 19.1 px.
- **An optional guide.** If the floor alone does not read, add an untoned `level` guide at the floor point (crop.mjs:161; zoom-css.mjs:90 styles it with no option). A neutral tone needs the `levelNeutral` option, which is a Stop.
- **The words.**
  - The Wrong callout anchor becomes `{ at: 'hip.r', pose: 'mistake' }` (:146, the sumo :94 form).
  - Callout texts and captions stay.
  - The Wrong alt (:154) stays true to the drawn knee; any copy change keeps c9 and passes the copy lint.
- **Comments.** Update the zooms header (:115-117, which still says "the Wrong is drawn alone (solid)") and the SHOOT comment (:66-74) with the new numbers.
- **What stays.** No spec, renderer, crop.mjs, CSS, closeups record or twin change. Sumo's files are not touched.
- **The scratch page.**
  - Build a scratch lb03 page in the W8b form: `lb03.layers.json` @ `1fdf6975` verbatim. If main's file has moved past it, use main's then-current file plus the conventional, sumo and dumbbell_shrug group entries in `1fdf6975`'s order.
  - Build it twice and post its sha256 and the recipe. Never commit the config.
  - The supervisor runs a fresh layers panel on it (L1-L8, the D-PFC-ROUND1 form, the lyr-pf11 setup) for conventional_deadlift only, under D-DL-PANEL.
- **The panel numbers.** The PLAN and the LAYERS READY post give the numbers that make the fault read in 2 s, each in panel px and in the critics' 2× px:
  - the hip rise;
  - the knee flexion, Right and Wrong, and its change;
  - the arrow length, tail to tip;
  - the floor gap;
  - the crop window.
- **MANIFEST.** One `[golden update]` commit, made by `manifestOf` (`tools/plates/library/ci/manifest.mjs:96`). It moves only the conventional how-to key, in the 12 lb03 rows. Prove it with a blanked-keys test (the F-W8A-ASSISTED A1 form, `f-w8a-assisted.test.ts:154-167`).
- **Other tasks' MANIFEST tests.** These turn red when the key moves. They are expected to be f-w8a-assisted A1 (:154-167), pair-faults (:205-208), crop-projection (:94), lib-shapes (:357) and research-routes (:70-75); that is inferred from `platefix5-pins.ts:1-8`.
  - Each one gets one add-only call to a new helper, `tests/howto/f-dl-liftoff-pins.ts` (the platefix5-pins.ts form), under D-DL-PINS.

**write_scope:**
- in `tools/plates/library/howto/lib_conventional_deadlift.howto.mjs`: the `dl-liftoff` zoom (:139-156), SHOOT_KNEE and the SHOOT comment (:66-75), and the zooms header comment (:115-117);
- `tools/plates/library/MANIFEST.json` (`[golden update]`);
- the new `tests/howto/f-dl-liftoff.test.ts` and `tests/howto/f-dl-liftoff-pins.ts`;
- the D-DL-PINS lines, once ruled.

### Ship decision
**Recommended: both flips go to the next LIB-SHIP wave (D-DL-NOFLIP).** The reasons are the D-RP-NOFLIP ones (`f-ht4-rightpose-card.md`, Ship decision):
- a flip needs the wave's machinery;
- W8b (#417, open, head `d61ca89b`) is still editing lb03's config, the pins and MANIFEST.json;
- sumo's PASS holds only while its card is byte-equal, so the wave checks it on the final page;
- the two ids join a wave that runs anyway.

**What the wave owes:**
- **conventional:** the lb03 group entry, the card sha the fresh panel approved, the STAMP, flip, generate, budgets and the guards. The card is about 30 KB larger (the sketch), so its budget is set from the measured card.
- **sumo:** the same, with a card compare against `b1c29f89…`, in the same head, after its parent.

## Acceptance

Each row is evidence on the READY head. A test row must be red on main and green after, unless it is marked "kept". Crop numbers come from the built crop svgs and from engine landmarks projected with the crop's camera (the `engineCrop` probe, crop.mjs:38-40, :60, :129).

| id | check | evidence |
|---|---|---|
| C1 | Overlay: the `dl-liftoff-wrong` call draws the spec's end pose as `poses.start` and `poses.end`, with `mergeDeep(end, SHOOT)` as `mistake.pose`. Its svg holds the dashed `m-pose` group with a `-mmask` mask. The `dl-liftoff-right` call has no Mistake | `f-dl-liftoff.test.ts` |
| C2 | Hip rise: the Wrong `hip.r` is at least 18 panel px above the Right `hip.r` (today 14.2), within 2 px of the same x | the test |
| C3 | Arrow: exactly one `z-drop` in the Wrong crop and none in the Right. It is vertical within 2 px of the Right hip's x, points up, and runs from within 4 px of the Right hip to within 4 px of the Wrong hip. It is at least 18 panel px tail to tip (the sketch: 13.2) | the test |
| C4 | Knees: the Wrong knee flexion is 20 deg or less, against the Right's 64.0 deg (today 30.0) | the test |
| C5 | Bar on the floor: the Wrong pose's bar centre (`grips`) equals the Right's within 0.5 panel px; `heel.r`, `ball.r`, `heel.l` and `ball.l` are on the floor in both poses within 0.5 px | the test |
| C6 | Words: the Wrong callout dot is on the Wrong `hip.r`, within 1 panel px; the Right dot is on the Right `hip.r`. Callout texts and captions are unchanged; any alt change passes the copy lint and keeps c9 | the test; copy lint |
| C7 | Frame: the floor line is at least 20 panel px above the bottom edge in both halves (today 5.4). Both hips, sacra and necks, `knee.r` and the bar's plate are inside both halves, at least 8 panel px from every edge (L7; today the plate is 3.5 px from the right edge) | the test |
| C8 | Card scope: on the scratch lb03 page, the conventional card differs from `e0a154bd…` only inside the Liftoff block. Every other card, and the page outside the card, is byte-equal to the same page built without the change. The page is built twice with an equal sha256 | the test, plus the posted shas |
| C9 | Sumo carry-over: on each READY head, the scratch page's sumo card is 198,677 characters with sha256 `b1c29f89…`. If not, post the diff for a delta check (the Q-W8b-3 form) | the test, plus the posted shas |
| C10 | HT4 on the real row: conventional_deadlift, staged on a scratch lb03 tree, has HT4/A5-protected, A5-fragments and A5-poses green (the `f-ht4-rightpose.test.ts:63-82` form). `RULED_RIGHT_POSES` (`ht4.mjs:160-166`) is unchanged | the test; `git diff` |
| C11 | Nothing pinned moves: every pinned layers page rebuilt with `scripts/howto-rebuild.mjs` equals its pin; `node tools/plates/generate.mjs --check` is clean; MANIFEST moves only the conventional how-to key in 12 rows; the D-DL-PINS lines are as ruled | the blanked-keys test; command output |
| C12 | Panel: the fresh layers panel passes conventional_deadlift (every median 4 or more, or a recorded exception), or it is HOLD under D-DL-PANEL | the supervisor's ruling comment |
| C13 | The READY head contains the latest main. `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` and CI are green. A fresh Opus reviewer follows READY | CI links |

The C2-C7 numbers are proposals (D-DL-NUMBERS):
- 18 px is about 36 px in the critics' shots, against today's 28.
- 20 deg is a knee that reads as "nearly straight", as the alt says.
- The 20 px floor gap clears the 10 px corner radius by 10 px (the F-BSS-REARKNEE C7 value).
- The engine numbers above show that one window can meet all of them (the SHOOT_KNEE 15, sizePx 180 example in Scope).

## Mutations

Each one must turn a named test red. Post the red lines.

| id | mutation | red |
|---|---|---|
| m1 | Main's `dl-liftoff` zoom | C1, C2, C3 |
| m2 | `solid: true` put back, with the drop kept | C1 |
| m3 | The drop removed | C3 |
| m4 | The drop reversed (from the Wrong hip to the Right hip: the arrow points down) | C3 |
| m5 | SHOOT_KNEE back to 30 | C4, and C2 if the window is unchanged |
| m6 | The bar lifted with the hips (scratch copy: the Wrong's reach target raised 2 cm) | C5 |
| m7 | The Wrong callout anchor back to the string `'hip.r'` (it lands on the Right hip) | C6 |
| m8 | Main's crop window | C7 |
| m9 | One byte changed outside the Liftoff block of the conventional card (scratch copy: a dl-start caption) | C8 |
| m10 | One byte changed in sumo's how-to (scratch copy: a sumo-start caption) | C9 |
| m11 | The dashed Wrong's Mistake pose changed (scratch copy: crop.mjs draws `mergeDeep(SHOOT, { root: … +0.01 m })` as `mistake.pose`) | C10, with "mistake.pose matches neither the reference mistake pose nor its declared fault pose" |
| m12 | A second MANIFEST key moved | the blanked-keys test |

## Rules

- Read `.claude/skills/builder/SKILL.md` first. Branch from origin/main and name the sha. Open a draft PR and post `F-DL-LIFTOFF PLAN @ <sha>`.
- **PLAN first.** The PLAN names:
  - the zoom's new values (SHOOT_KNEE, the crop window, the drop's offsets, the anchor);
  - the panel numbers in panel px and 2× px;
  - the C2-C7 values; if L5 and L7 pull apart, both windows with their numbers;
  - the D-DL-PINS list: every other task's test line, before and after.
- Wait for PLAN RULED, then build. Post `F-DL-LIFTOFF LAYERS READY @ <sha>` with the page sha256 from two builds, the recipe and the panel numbers, before the pins. Then post `F-DL-LIFTOFF READY @ <full sha>`.
- **MANIFEST.json** changes only in a `[golden update]` commit made by `manifestOf`. It moves only the conventional how-to key.
- **Never loosen a check.** No test, guard or tolerance is cut, narrowed or skipped. Other tasks' lines move only under D-DL-PINS (the D-PF5-PINS form), each at least as strict, with their mutations kept red.
- **No flips (D-DL-NOFLIP).** Batch stages, committed `pages/*.layers.json`, layers-page pins, stamps and budgets belong to the ship wave.
- **Never touch:**
  - sumo's how-to and spec, plate specs (`specs/**`), research cards and quotes, golden pages and their pins, `GOLDEN.json`;
  - `render/**` (crop.mjs, zoom-css.mjs), `pages/*.closeups.mjs`, `tools/plates/vendor/**`, `tools/plates/layers/**`;
  - `fidelity/twins/ht4.mjs`, `fidelity/goldenB.mjs`, `fidelity/harness.mjs`, `fidelity/ht10.mjs`, `fidelity/twins/pins.json`;
  - `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `src/**`, `package*.json`;
  - `escobar-worker/**`, `native/wear/**`, signing and keystores, saved-data shapes (AGENTS.md).
- No closing keywords in commits or in the PR body (F-COMMIT-KEYWORDS).

### Stops
Post the question and wait.
- The fix needs a CSS option, a closeups record, a crop.mjs change or an engine change. Any of these moves shared bytes and may move sumo's card.
- C2-C4 and C7 cannot all hold in one 150-240 px window. Post both windows with their numbers and ask.
- The vendor engine draws the bar's plate (spec :167, :169) dashed or doubled in the overlay, and only a spec change would stop it.
- Sumo's card, any pinned page, any generated file or any other card's byte moves.

## Risks

- **A third L5 failure.** Mitigation: the panel numbers are measured before the panel (C2-C4, C7) and posted with the page. Under D-DL-PANEL a failure holds with no further round, and the follow-up is named then.
- **The L5 fix costs L7.** A tighter crop makes the rise bigger but can cut the back or push the floor to the edge, as happened to bulgarian. Mitigation: C7; the PLAN posts both windows; the panel judges L1-L8 together.
- **The overlay reads as clutter.** The whole body outline moves, so the dashed outline covers the trunk, thigh and arm. Mitigation: the supervisor's crop check before the panel. If needed, `wrong.parts` (crop.mjs:83, the `single_arm_lat_pulldown:124` form) limits the outline to the trunk and legs. That stays inside the how-to.
- **Sumo's carry-over breaks.** A main merge that moves a shared file (crop.mjs, zoom-css.mjs, `ZOOM`, the engine) would do it. Mitigation: C9 on each READY head and again in the ship wave. A diff gets a delta check, not a full panel.
- **MANIFEST lane overlap.** W8b (#417) changes 114 MANIFEST lines, and F-BSS-REARKNEE moves the lb04 bulgarian key with its own pins. Mitigation: merge main with a merge commit whenever it moves, regenerate the `[golden update]` with `manifestOf`, and re-take the D-DL-PINS list on the head that contains the latest main.
- **Card size.** The overlay adds about 30 KB to the card (240,995 to 271,189 characters in the sketch). Mitigation: no budget is set here; the wave sets it from the measured card.

## Forecast

Each estimate is build plus review. CI wall time is about 66 min a run (F-W8A-HOLDS, run 42898934120; not re-measured).
- **Build:** about half a day. It is one zoom, one test file, one pins helper and one MANIFEST commit. One scratch lb03 build takes about 20 s here.
- **Panel:** about half a day of the supervisor's time, plus his crop check.
- **Calendar:** about 1.5 days to merge, set by the D-DL-PINS ruling and the panel. The flips are in the next LIB-SHIP wave and are not counted here.
- **Assumptions:** the weekly usage limit allows the runs, and W8b merges before or alongside this card.
- **Uncertainty:** whether the critics read the overlay in 2 s; whether one window meets C2-C7; the size of the D-DL-PINS list.

## Not verified

- HT4/A5 for conventional_deadlift on a fixed tree. It is inferred from `ht4.mjs:145-152`, :217, :237-239 and from `dl-start` passing on the same sheet; C10 runs it.
- The full fidelity run (HT10, A6 in a browser) on a fixed tree.
- How the sketch looks. Its bytes were checked, but no crop was looked at in a browser, including whether the plate's `mplate` ring (spec :169) shows in the overlay.
- That the critics' "about 28 px" is 2× panel px. That is inferred from the W4 screenshot widths.
- Which other tasks' MANIFEST tests turn red. This is inferred from the blanked-keys form and was not run.
- Whether the C2-C7 numbers suit the critics. They are proposals, not critic values.
- Whether W8b's final lb03 page or MANIFEST moves sumo's card once merged. Its head `d61ca89b` drops the held ids from the lb03 group and changes no how-to or render file.
