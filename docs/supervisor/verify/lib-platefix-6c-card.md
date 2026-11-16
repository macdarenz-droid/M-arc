# LIB-PLATEFIX-6c (PF6c): the ten rows W10 held for plate or spec fixes

Owner: supervisor (drafted 11-16; status `draft`). Builder: `claude-opus-5-5` (redraws, balance, view routes and pins are judgement work; mechanical re-pins may go to a `sonnet` helper with every step spelled out). Branch: `claude/lib-platefix-6c`, and `claude/lib-platefix-6d` if Q-PF6C-1 splits the card. Base: origin/main `2a898c3e` (train 103). Every file:line below was read on that commit unless another head is named. A fresh Opus reviewer follows READY.

This is a plates card in the LIB-PLATEFIX form (`lib-platefix-5-card.md`; the newest example is `f-incline-inset-card.md`). It changes plates, specs and sheets of 10 held rows and flips none. Ship waves never change plates, which is why W10 held them (#434 6923360626). Each row's layers look comes later, in the ship wave that flips it (W11 or W12).

Sources:
- `panels/w10-findings.md` (this branch @ `f9541788`): set a `:35-73`, set b `:85-124`, content `:140-149`, safety `:151-166`. Critic lines are cited as `w10:<line>`. The file's lines are cut at about 300 characters, so some FIX texts end mid-word.
- `panels/fii-findings.md` (@ `84a6af14`): the two control findings, `:8`, `:11-19` (cited `fii:<line>`); #436 PLATES APPROVED 6920821621.
- #434: LAYERS APPROVED 6923360626 (the holds and follow-up names), D-W10-JSLAND2 6923406051 (the text-only plate re-pin form); `lib-ship-w10-card.md` Rows `:26-47`, Q-W10-3 `:100-102`, rulings `:159-171`; D-W10-OADRHOLD and oadr's dry-run reds in `LIB-SHIP-DESIGN.md:3410-3412`, `:3462` on `claude/lib-ship-w10` @ `e4d93405` (not on main).
- `f-harness-feel-grip-card.md:208` (D-HFG-OADRH4, #435); `f-incline-inset-card.md` (the head-end inset form, D-FII-*); `plan-w8.md:140` (D-PFC-ROUND1); `plan-w9.md:149` (F-FLY-START catch-up), `:168` (sets of 8 tiles); `PANELS.md` §1, §5 (on main).
- Read only, by `git archive` of main into the supervisor scratchpad (`m6c/`, never committed). Nothing was rendered: every pixel number below is a critic's, read off a PNG (scale [est] 1-2 plate px per PNG px), and the PLAN re-measures each one.

## The rows
W10 numbers are `lib-ship-w10-card.md` row numbers. Every id is `approved-plate` on main (its batch line below) and is held at main's bytes by W10.

| # | id | page (batch:line) | tier | W10 round | items that failed in W10 (scores c1/c2/c3) | follow-up | half (Q-PF6C-1) |
|---|---|---|---|---|---|---|---|
| 5 | smith_machine_bench_press | pilot-b:10 | A | 2 | **L5 3/4/3 (second failure)**; L1 3/3/3, L6 3/4/3, L7 3/4/3; fii R3 3/3/3, R11 3/3/3 | F-SMITH-INSET | 6c |
| 40 | weighted_dip | lb07:101 | A | 2 as drawn | **L1 3/4/3 (second failure)**; safety S02 (a) | F-WDIP-LEGS | 6c |
| 12 | close_grip_bench_press | lb02:73 | A | 2 | **L5 3/4/3 (second failure)** | F-CGBP-FLARE | 6c |
| 11 | incline_dumbbell_press | lb02:54 | A | 2 | **L5 4/3/3 (second failure)**; fii R5 3/3/4; safety S05 (a) | F-IDP-GHOSTBACK | 6c |
| 33 | high_to_low_cable_fly | lb06:81 | B | 1 | L1 2/3/3, L5 2/2/2 | F-H2L-ENDPOSE | 6d |
| 34 | machine_pullover | lb06:30 | B | 1 | L4 3/4/3, L5 3/3/3, L7 3/3/3 | F-PULLOVER-MACHINE | 6d |
| 53 | burpee | lb10:87 | B | 1 | L5 3/3/3, L7 3/3/3 | F-BURPEE-PLATE | 6d |
| 29 | straight_bar_triceps_pushdown | lb05:201 | C | 1 | L1 4/2/3, L5 2/2/3 | F-PUSHDOWN-DRIFT | 6d |
| 37 | smith_machine_squat | lb06:97 | A | 1 | L6 4/3/3 | F-SMITHSQ-TEMPO | 6d |
| 16 | one_arm_dumbbell_row | lb03:51 | C | 1 | L5 3/3/3; PQ-H4 and HT10 C10 plate reds | F-OADR-CALLOUT | 6d |

**Round rules.**
- D-W10-ROUNDS (`lib-ship-w10-card.md:163`, Q-W10-3 `:100-102`) and D-LIB13-PANEL2 (as applied at #395 6655186998, `plan-w8.md:37`): a round-2 item that fails again holds the row. Four rows did: smith bench L5, weighted_dip L1, close_grip L5 and incline_dp L5. They come back only as a fresh round 1 in a new card (F-FLY-START, #340 6540319537; `plan-w9.md:149`). Q-PF6C-2 asks for that.
- The other six failed in round 1. D-PFC-ROUND1 (`plan-w8.md:140`) gives each one fix round. Their fixes are plate or spec changes, so the fix round happens here.
- A plate changed here resets the layers count. The ship wave's look is round 1 for that sheet (D-PFC-ROUND1, as PF4 and PF5 rows were judged in W10).
- smith_machine_squat is the exception. Its only plate change is the tempo strip, so its ship-wave look is the check of its W10 round-1 fix, not a new round (Q-PF6C-2).

**Shared-code rule for every row.** A file that another approved row also reads stays byte-equal. Any opt-in a ruling allows is default off, with a byte proof over every other user (the #395 form, as 6705100833 did). The PLAN proves each "byte-equal" below with `fragmentsOf` and the zoom-hash loop.

## Row 1: smith_machine_bench_press (F-SMITH-INSET)
History: W4 L5 [3,3,2]; PF3b item 22 head-end inset, crop check PASS 6705141445 (`lib-ship-w10-card.md:36`). W10 round 2 and the fii control panel, as in the table.

Plate and spec (`specs/smith_machine_bench_press.mjs`):
- **P1 The stop.** The block sits on the chest and over the forearm, so the bar seems to rest on it and no hand holds the bar (fii:11, :13, :16; w10:35, :39, :40). The fix:
  - draw the stop as a catch on the upright, behind the arm, its top still `STOP_BELOW` under the bar's lowest point (c4; `:52`, `:138`);
  - the forearm runs from the elbow to a hand closed on the bar, and the bar touches the mid-chest at the end;
  - nothing sits between the bar and the chest.
  - Spec arguments only: `stop` and `stopZ: 'back'` in `rigOf` (`:140`). `eq/smith.mjs:36` takes both, and smith_machine_squat already passes `'back'` (`specs/smith_machine_squat.mjs:102`).
  - Size: fii c3 asks about 16 × 10 px on the upright (fii:15). `STOP_SIZE` (`:53`) holds D-LIB11-PANEL1's 34-40 × 6-9 px. See Q-PF6C-4 (a). The 'Stops set' anchor (`:189`) follows the catch.
- **P2 The head-end inset.** The head is cut off, the figure sits off-centre, one arm is clipped and there is no link (fii:12, :14, :17; w10:36, :41). The fix:
  - the head inside the top of the circle and the spine on its centre line;
  - both upper arms whole, the Right at about 45° and the red dashed Wrong at about 90° (c3 asks a blue and a red arc as well: w10:41);
  - a dashed shoulder line through both shoulder joints;
  - the link drawn. `zoom/inline.mjs:284-286` drops a `src` link that crosses a label box, so the BAR OVER MID-CHEST box moves until the centre line clears it (fii:17).
  - Start from incline_bb's approved inset (#436, D-FII-INSET and D-FII-PLACE, approved 6920821621) once #436 merges, spec only: `HEAD_INSET` `:147`, `SRC_RING` `:148`, `HEAD_GHOST` `:157`, `SHOULDER_LINE` `:142`, the entries `:212-215`.
- **P3 Tempo.** Add the 1 s bottom pause (w10:37, :42): `:186` becomes Lower 2, Pause 1, Press 1. The card already names that pause and its 1 s from c18, outside `pause` (LR-33; `cards/smith_machine_bench_press.json:560-569`). Q-PF6C-3.

Sheet (`howto/lib_smith_machine_bench_press.howto.mjs`):
- **S1 Bench Wrong.** Show a clear wedge gap between the low back and the bench, with the hips on the bench (w10:36, :41). Today `ARCH` is 30 (`:82`), solved by `:87-88`; the drop guide is at `:106`.
- **S2 Shoulder-pain row cause** (w10:37, :42). `means: ''` is ruled (D-FEEL-NOMEANS, `:135-136`), although the card row says "Fault: flaring the elbows wide." (card `:692`). See Q-PF6C-6 (c).
- **S3 Hand chip** (w10:38, :43). It is gap-ruled (D-SHIP-HANDW4, `hands/no-zoom.json:292`; `:166`), and `hands/**` is outside this card. See Q-PF6C-6 (c).

Shared code:
- `eq/smith.mjs` has 5 users (smith bench, incline press, squat, shoulder press, shrug); it stays byte-equal because only the spec's arguments change.
- `zoom/inline.mjs` and `qa/zoom.mjs` serve every zoom entry; they stay byte-equal (spec only; an engine opt-in is a Stop, as D-FII-PLACE ruled).
- incline_bb's inset (after #436) is byte-equal in the zoom-hash loop.
- `pilot-b/tempo.json` keeps the other three ids' rows byte-equal.

## Row 2: weighted_dip (F-WDIP-LEGS)
History: W6 L1 [3,4,3] and L5 [3,4,3]; PF3 "judged as drawn" (6684669717 item 6); W10 round 2 as drawn: L1 failed again, L5 passed (4/4/3) (`lib-ship-w10-card.md:35`).

Plate and spec (`specs/weighted_dip.mjs`):
- **P1 Legs** (w10:62, :63). The bottom frame kicks the shins up to about hip height, while the top ghost hangs nearly straight. The fix keeps the same slight knee bend in both frames: feet under the hips, ankles crossed, the plate hanging low near the shins (c3, c8).
  - Today the knee goes from `KNEE` 20 to `BOTTOM_KNEE` 90, and the thigh from `TOP_THIGH` -15 to `BOTTOM_THIGH` -40 (`:48`, `:28-30`, `:82`). That was chosen for balance under D-LIB17-DIPBAL option P (#299 6348947992; `:15-16`, `:20-24`, `:120-121`).
  - The solver already finds the balanced shoulder position (`:113`), and the bar height follows the lowest foot point (`:32-34`).
  - See Q-PF6C-4 (b). c3's deeper Depth Wrong (w10:63-64) is one critic's L5 note; L5 passed.

Sheet (`howto/lib_weighted_dip.howto.mjs`):
- **S1 The c13 load line** (safety S02 (a), w10:153-154). The card's `tierA.safetyPoints` lists it, and `loadProgression` gives the text (`cards/weighted_dip.json:680-690`). The sheet leaves c13 out (`:20`, D-TEXT-PROGRESSION).
  - The supervisor's start message names the ruling D-W10-LOADLINE [no comment id found on #434; the substance is in 6923360626].
  - There is no free slot. Setup has 5 steps, the cap (`:225-231`; `SETUP_MAX_STEPS` 5, `tools/plates/layers/artifact/copy-lint.mjs:43`). Risks have 3, the cap (`:198-202`; `RISKS_MAX` 3, `:49`). See Q-PF6C-6 (a).
- S02 (b), the way out, is a card gap (`gaps[0]`), not a ruled fix here. It is recorded only.

Shared code: `eq/dipBars.mjs` (single use) and every other lb07 plate stay byte-equal. The sheet imports `WD`, `bisect` and `loadedCom` from the spec (`:22`), so its stills move with the spec. The PLAN measures them.

## Row 3: close_grip_bench_press (F-CGBP-FLARE)
History: W4 L1 [3,3,2], L5 [2,2,2]. W4's second fix (`FLARE_POLE`, #391 6682615402; `howto :67-86`) was never judged until W10, where L5 failed again (w10:85, :86). L1 passed (4/4/4) (`lib-ship-w10-card.md:42`).

Plate and spec (`specs/close_grip_bench_press.mjs`):
- **P1 A head-end inset on the Mistake view.** Seen side-on, the flare folds into a knot over the shoulder (`howto :67-74`). c1 asks for the view from above (w10:85). The fix copies smith's and incline_bb's ring form: Right upper arm near the ribs, red dashed flared arm (c2), entries added to this spec only. See Q-PF6C-5 (a).

Sheet (`howto/lib_close_grip_bench_press.howto.mjs`):
- **S1 Elbow-path Wrong** (c3, w10:86). Draw the bar dashed red at the high touch point (upper chest, never the neck), with the elbow level with the shoulder. Keep the Right's solid bar and arm out of the Wrong pane, so the two panes differ. Today `FLARE_GUIDES` (`:86`) sit over the Right pose in the zoom `elbows-to-ribs` (`:103`).

Shared code:
- `eq/parts.mjs` `sideBar` has many users and stays byte-equal.
- The other lb02 plates (bbp, decline, incline_bb, incline_dp) stay byte-equal.
- The OURS lines that list zoom specs move under D-PF6C-PINS: `platefix2-zoom.test.ts:20` and `platefix3b-zoomhead.test.ts:15`.

## Row 4: incline_dumbbell_press (F-IDP-GHOSTBACK)
History: PF4 item 20b (D-PF4-20B, #410 6750587189). lyr-pf11 L5 [3,3,3]. W10 round 2: L5 failed again (w10:123, :124). fii control R5 3/3/4 (fii:8, :18-19) (`lib-ship-w10-card.md:41`).

Plate and spec (`specs/incline_dumbbell_press__lb2.mjs`, the lb02 plate):
- **P1 The ghost back.** Today it runs under the arm, turns a sharp corner beside the elbow and drops to the seat (fii:18-19), and OFF THE PAD shows no gap (w10:123-124). The fix:
  - one smooth dashed curve that leaves the pad at the shoulder blades (fii c1 about (305,627), c2 about (300,628));
  - it bows 20-30 px off the pad at the lumbar (c2's apex about (373,677) at 20 px, just right of the elbow; c1 about 30 px);
  - it rejoins the seat with the hips on it, with no corner;
  - the belly bulge and its arrow stay;
  - the OFF THE PAD leader ends on the peak and crosses no arm outline.
  - Today: `ARCH_PTS` `:159-165`, `GAP_FILL` `:169`, the tell `:257`.
  - c2's route stays clear of the arm, so PF4 20b's "no dashed point inside the near arm" test holds (`platefix4-incline_dumbbell_press.test.ts:1-15`). c1's "on top of the arm" is used only if c2's route cannot reach 20 px (a Stop).

Sheet (`howto/lib_incline_dumbbell_press.howto.mjs`):
- **S1 The risk line** (safety S05 (a), w10:159-160). Print the card's `risks[0]` words: "In US hospital data, dropped weights are the top cause of lifting injuries. Have a spotter hold your wrists." (`cards/incline_dumbbell_press.json:625`; the sheet today, `:150-151`). The supervisor's start message names this D-W10-IDPRISK [no comment id found; the substance is in 6923360626].
  - Those words are 19, over `RISK_MAX_WORDS` 14 (`copy-lint.mjs:50`, `:191`). See Q-PF6C-6 (b).
- S05 (b), the end-of-set hand-off (c10), is recorded only.

Shared code:
- Pilot A's `specs/incline_dumbbell_press.mjs` is never touched. `specs/dumbbell_shoulder_press.mjs:38` imports `reclined` from it, and this sheet imports it too (`:16`).
- `eq/inclineBench.mjs` (8 specs) stays byte-equal.
- incline_dp is a gate fixture (`scripts/screenshot-gate.mjs:8486`, `:8600`, `:8602`, `:8958`). Nothing flips here, so the gate is unaffected.

## Row 5: high_to_low_cable_fly (F-H2L-ENDPOSE)
History: W6 L1 [3,3,3], L5 [2,2,2]; pf13 PASS 6752705237; W10 round 1 as in the table (`lib-ship-w10-card.md:33`).

Plate and spec (`specs/high_to_low_cable_fly.mjs`):
- **P1 End pose** (w10:46, :51). The hands meet at chest height (c1: about 45 px under the shoulders), and in front view the arms read as folded stubs. The fix:
  - long arms with the slight fixed bend (c3), swept down and in, so the hands meet clearly below the chest, around navel height (c5);
  - each cable runs from its pulley to the handle in the fist.
  - Today `END_DROP` 0.1 and `ELBOW` 20 (`:30`, `:53-54`), with basis rows in `lb6/sizes.json` r2 (`:453`, the h2l `ELBOW` row).

Sheet (`howto/lib_high_to_low_cable_fly.howto.mjs`):
- **S1 Trunk close-up in side view** (L5: w10:47, :50, :52; also w10:49). In front view a forward tip reads as a shorter figure (`LEAN` 30 `:86`, `LEANED` `:91`, zoom `:103-121`).
  - Close-ups use the plate's view: `render/closeup/crop.mjs:52-56` projects side only when `plate.view` is side. The one per-zoom view is `'back'`, behind the `backView` opt-in (`:14`, `:46`).
  - See Q-PF6C-5 (b).
- c1's Arms-back chip (w10:48) is one critic's note.

Shared code: `cable_fly` is a copied clone, never imported. `lb6/sizes.json` changes only h2l's keys. Every other lb06 plate stays byte-equal.

## Row 6: machine_pullover (F-PULLOVER-MACHINE)
History: W6 L1, L5, L7; no plate zoom (D-PF4-PULLOVERNOZOOM); pf13 PASS; a ruled text-zoom row (`text-zooms.json`, D-SHIP-TEXTZOOM) (`lib-ship-w10-card.md:37`). W10 round 1 as in the table.

Plate and spec (`specs/machine_pullover.mjs`, `eq/pulloverMachine.mjs`):
- **P1 Mistake arch** (L5: w10:88, :91, :94). Draw one dashed torso outside the solid outline:
  - hips on the seat;
  - an open wedge between the low back and the pad, at least 15 px at 780 px (c3), clear of the arm (c2: about x 320-350, y 600-675);
  - the head clearly off the pad (c2's number is cut off in the file);
  - the start-arm ghost faded or hidden in the Mistake view (c1).
  - c1's L1 note (w10:87: the Right back floats 20-30 px off the pad) is one critic's. The PLAN measures it, because c1's L5 fix starts from a Right that lies flush.
- **P2 The machine** (L7: w10:92, :95). Draw these as distinct parts:
  - the pivot (cam axis) as a circle just above the shoulder joint;
  - the movement arm, the elbow pad on the back of the upper arm, and the bar under the open hands;
  - the start as one dashed ghost with the arms beside the head (c2).
  - The composer already builds these parts (`eq/pulloverMachine.mjs:1-13`, items `:23`). The PLAN finds why they do not read (layer, size or cover).

Sheet (`howto/lib_machine_pullover.howto.mjs`):
- **S1 Trap region** (L4: w10:89, :93). The row "Neck and tops of the shoulders" marks the throat (`at: { parts: ['neck-left','neck-right'] }`, `:84`). Use `at: { muscles: ['upper_traps'] }`, the form of `lib_chin_up.howto.mjs:225`.
- **S2 Close-ups** (L7: w10:90, :92, :95). Pivot and Hand. The Pivot zoom is a text checkpoint today (`text-zooms.json` `lib_machine_pullover`). The Hand zoom is gap-ruled (D-SHIP-HANDW6, `hands/no-zoom.json:100-104`). See Q-PF6C-4 (d).

Shared code:
- `eq/pulloverMachine.mjs` has one user (its header `:1-3`; `lb6-plates.test.ts:53`); its A2 tests (`:560-`) move under D-PF6C-PINS.
- `text-zooms.json`: only the pullover entry may change.

## Row 7: burpee (F-BURPEE-PLATE)
History: W7 L1, L5 [2,2,2], L7; PF4 fresh round (`KNEE_SOFT` 30, `platefix4-burpee.test.ts:41-46`), pf13 PASS (`lib-ship-w10-card.md:39`). W10 round 1 as in the table.

Plate and spec (`specs/burpee.mjs`):
- **P1 Key pose** (L7: w10:100, :103, :105). The solid figure stands; the plank the caption and checkpoints describe is a faint ghost behind it, with a crouch ghost on top. All three critics ask for:
  - the plank solid;
  - the standing landing as the one ghost;
  - no crouch ghost.
  - Today D-LIB22-POSEMAP puts the plank at the spec's start and the standing pose at its end (`:4-5`; `lb10/tempo.json:4-8`; `lib-22-card.md:429`), because the engine draws the Mistake against the end pose (`vendor/engine/plate.mjs:48`).
  - See Q-PF6C-4 (c).
- **P2 The Mistake** (L5: w10:99, :101, :104). The soft-landing knee must read bent, forward of the hip-ankle guide, and the Wrong must be a separate red straight leg. The plank and crouch ghosts stay out of the Mistake view (c1).
  - PF4's pins stay at least as strict: knee 25-35°, at least 14 px forward, Mistake knee at least 12 px away (`platefix4-burpee.test.ts:41-45`).

Sheet (`howto/lib_burpee.howto.mjs`): the `landing` (`:137`) and `plank` (`:158`) close-ups name poses. If the pose map flips, they follow it, as named in the PLAN. c2's PUSH-UP phase (w10:102) is one critic's note.

## Row 8: straight_bar_triceps_pushdown (F-PUSHDOWN-DRIFT)
History: pf12 re-clone and R4 fix (`lib-ship-w10-card.md:32`). W10 round 1 as in the table.

Plate and spec (`templates/PUSHDOWN.mjs`, `specs/straight_bar_triceps_pushdown.mjs`):
- **P1 End-pose lean** (L1: w10:70, :72). The end pose stands bolt upright, the bar overlaps the thighs, and HIP LEAN ONLY points at a hip that does not lean. The fix: a slight forward tilt from the hips at the end, so the bar ends just in front of the thighs (c10 per c3).
  - Today `TILT` 8 and `TRUNK` 3 (`templates/PUSHDOWN.mjs:48`) are the parent's numbers. The parent proof needs `make(parentParams, parentFacts)` to draw `specs/triceps_pushdown.mjs` byte for byte (`platefix4-pushdown.test.ts:20-27`).
  - So the change is one new opt-in param that only this child sets: `PARAMS_READ` (`:10`), its range (`qa/param-ranges.json:29`) and its claim (`lb5-plates.test.ts:28`). See Q-PF6C-4 (e).

Sheet (`howto/lib_straight_bar_triceps_pushdown.howto.mjs`):
- **S1 Elbows Wrong** (L5: w10:69, :71, :73; also w10:70). Swing the upper arm 40-45° forward. That is where the three critics' ranges overlap: c1 35-45, c2 30-45, c3 40-60. Also:
  - the elbow clearly in front of the torso, and the bar at upper-chest height or higher;
  - a dashed vertical from the shoulder (c1) and the red arrow on the elbow path (c2).
  - Today `ELBOWS_FORWARD` (`:96`) takes the spec Mistake's shoulder flex 25 and elbow 75 (`BUILDERS.lean`, `templates/PUSHDOWN.mjs:12`), which measures about 13-15° on the start trunk (w10:69, :70).
  - Route: the sheet's own drawing value (D-SHIP-DRAWVAL, #376 6614695581), no longer read from `MIS`. `BUILDERS.lean` and the plate Mistake stay as they are.

Shared code:
- `templates/PUSHDOWN.mjs` has one user (`specs/straight_bar_triceps_pushdown.mjs:8`); templates are limited to CURL and PUSHDOWN (`lib11-pilot-b.test.ts:274`).
- The parent `specs/triceps_pushdown.mjs` is never touched, and its proof stays unchanged and green.

## Row 9: smith_machine_squat (F-SMITHSQ-TEMPO)
History: W6 L5 [3,3,3]; pf13 PASS (`lib-ship-w10-card.md:38`). W10 round 1: L6 failed (w10:96, :97); L5 passed; safety S06 ok.

Plate and spec:
- **P1 Tempo.** Add c22's 1 s bottom pause: `specs/smith_machine_squat.mjs:161` becomes Lower 3, Pause 1, Drive up 1. c22's quotes give the 3-1-1 and the order "eccentric (lowering), bottom pause, concentric (lifting), top pause" (`quotes/smith_machine_squat.json`; card `:623-`, machine key `tempo` `:878`). See Q-PF6C-3.
  - The plate check is the supervisor's delta check in the D-SHIP-W5-PLATETEXT form (D-W10-JSLAND2, 6923406051): only the tempo fragment moves.

Sheet (`howto/lib_smith_machine_squat.howto.mjs`):
- **S1** "Brace and keep your chest forward." becomes "Brace and keep your chest up." (`:167`; c5 "chest lifted", c6 "chest up"). The card row says "chest forward" (`cards/smith_machine_squat.json:711`, from c11's quote "keeping your chest pushed forward"). See Q-PF6C-3.
- The lockout cue in the feel line (`:141-142`) is ruled under D-TEXT-GOLDEN and stays (6923360626).
- c3's foot-position crop (w10:98) is one critic's note.

Shared code: `eq/smith.mjs` is not touched (tempo is spec data). The other 8 r2 rows in `lb6/tempo.json` stay byte-equal.

## Row 10: one_arm_dumbbell_row (F-OADR-CALLOUT)
History: W4 L5 [3,4,3]; plate redrawn, pf12 PASS (#410 6751563503) (`lib-ship-w10-card.md:31`). W10 set A: L5 failed (w10:65, :67, :68). Dry-run plate reds:
- PQ-H4 `back|elbow` overlap of 80.96 px² at 340 px;
- HT10 C10 `n-back`/`n-elbow` overlap of 3.2 × 31.1 px in all 5 themes;
- held under D-W10-OADRHOLD (`LIB-SHIP-DESIGN.md:3410-3412`, `:3462` @ `e4d93405`). D-HFG-OADRH4 (`f-harness-feel-grip-card.md:208`) sends both to this card.

Plate and spec (`specs/one_arm_dumbbell_row.mjs`):
- **P1 Callout boxes.** `back` and `elbow` have no `box` (`:152-153`). Give each a box so that no labels overlap at 340 px and HT10 C10 is clean in 5 themes. Their leaders still end on `backUpper` and `elbow.r`.

Sheet (`howto/lib_one_arm_dumbbell_row.howto.mjs`):
- **S1 Top twist Wrong** (L5). Turn the working shoulder up and open the chest (the shoulder line tilts up from the support side). Add one curved red arrow round the spine, keep the hips square, and remove the stray dashed support limb (w10:67, :68).
  - The curved arrow is the existing `turn` guide (`render/closeup/crop.mjs:175`; cable_external_rotation uses it, `lib_cable_external_rotation.howto.mjs:140`).
  - `TWIST` 30 (`:70`) is a drawing value. It grows only if the PLAN measures the shoulder rise below the posted threshold.
- c2's floating support knee (w10:66) is one critic's note. The PLAN measures it.

Dependency: `oadr-top`'s Right is the trunk form (`:97`), and HT4 A5-poses stays red until F-HARNESS-FEEL-GRIP (#435) merges (D-HFG-TRUNKEQ).

## Write scope
Per half if split. Each line names its rows.
- Specs:
  - `tools/plates/library/specs/{smith_machine_bench_press, weighted_dip, close_grip_bench_press, incline_dumbbell_press__lb2}.mjs` (6c);
  - `tools/plates/library/specs/{high_to_low_cable_fly, machine_pullover, burpee, straight_bar_triceps_pushdown, one_arm_dumbbell_row}.mjs` (6d);
  - `specs/smith_machine_squat.mjs`, the tempo line only (6d).
- `tools/plates/library/templates/PUSHDOWN.mjs`: the one ruled opt-in param, default the parent's (6d). `tools/plates/library/qa/param-ranges.json`: its PUSHDOWN entry (`:29`) only.
- `tools/plates/library/eq/pulloverMachine.mjs` (single use; 6d).
- Sizes: `lb7/sizes.json` (weighted_dip rows), `lb6/sizes.json` r2 (h2l and pullover rows), `lb10/sizes.json` (burpee rows), each with its basis.
- Tempo, only under Q-PF6C-3: `pilot-b/tempo.json` and `lb6/tempo.json` r2, one constant each. `lb10/tempo.json` `poseMap.burpee`, only under Q-PF6C-4 (c).
- Research cards, only under Q-PF6C-3, in the D-W10-JUMPSQ named-key form: `docs/research/howto/cards/smith_machine_bench_press.json` and `smith_machine_squat.json`, the machine key `tempo`, plus `smith_machine_squat.json` `handlingMistakes[2]`. `lb6/cards.sha.json` r2 pin and a `recopied` record. No quotes file.
- Sheets, the named items only: `tools/plates/library/howto/lib_{smith_machine_bench_press, weighted_dip, close_grip_bench_press, incline_dumbbell_press, high_to_low_cable_fly, machine_pullover, burpee, straight_bar_triceps_pushdown, smith_machine_squat, one_arm_dumbbell_row}.howto.mjs`. `tools/plates/library/text-zooms.json`: the pullover entry, only under Q-PF6C-4 (d).
- `tools/plates/library/render/closeup/crop.mjs`: only the ruled `view: 'side'` opt-in (Q-PF6C-5 (b)), default off.
- Golden: `tests/howto/golden/library/{pilot-b, lb02, lb07}.json` (6c) and `{lb03, lb05, lb06, lb10}.json` (6d), appended `'owner'` D-OWNER-REPIN entries only.
- `tools/plates/library/MANIFEST.json` by `manifestOf`, and generated headers (`inputsSha256` only), in `[golden update]` commits.
- Tests: new `tests/howto/platefix6c-*.test.ts` and `platefix6c-pins.ts` (6d: `platefix6d-*`). Other tasks' lines only under the ruled D-PF6C-PINS list.
- No AGENTS exception is needed: `scripts/screenshot-gate.mjs` and `tests/theme.test.ts` are not touched. No new kind of saved or sent data: drawings and sheet copy in `tools/` only.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Branch from origin/main (name the sha) and open a draft PR 'LIB-PLATEFIX-6c' (and '6d').
2. **PLAN, no drawing committed.** Post `PF6c PLAN @ <sha>` (and `PF6d PLAN`) with:
   - every number above re-measured on the base, each critic's PNG coordinates mapped to plate px;
   - per item, the target value with its source (critic line or claim), the test and its mutations;
   - which spec the lb02 layers sheet draws for incline_dp (see Unverified);
   - for each ruling below, the route the measurements support;
   - the dependency state of #434, #435 and #436, and the merge order;
   - the **D-PF6C-PINS** list: every other task's test line, before and after, each at least as strict (the D-PF5-PINS form). Known so far:
     - `platefix4-pins.ts:19-35` (PF4_MAIN: 8 of these files) and `PF4_MAIN_ENTRY` (oadr);
     - `platefix4-burpee.test.ts:41-50`;
     - `platefix4-incline_dumbbell_press.test.ts` (the 20b rules);
     - `lib11-pilot-b.test.ts:528-572` (ruled tempo table, empty constants, mutation (ii));
     - `lb6-plates.test.ts:1170-1176`, `:1660-1694` (r2 table; `:1686` the squat's tempo; `:1690` the Hold-on-squat mutation), `:1866-1894`, `:560-` (pulloverMachine A2);
     - `lb7-plates.test.ts:538-560` (D-LIB17-DIPBAL);
     - `lb10-plates.test.ts:152` (poseMap);
     - `lb2-plates.test.ts:224`, `:868`;
     - `platefix2-zoom.test.ts:20`, `platefix3b-zoomhead.test.ts:15` (OURS);
     - `lb5-plates.test.ts:28`;
     - the lb02 page pin in `library-ci.test.ts` (`:885` on main; #436 moves it);
     - `checks/ship-w10.ts` W10_HELD once #434 merges [unverified whether it pins held specs' bytes].
   - Wait for `PF6c PLAN RULED`.
3. Write the tests first and run them on the base. Each acceptance row is red there; post the red lines.
4. Build. Order in 6c: incline_dp, weighted_dip, smith bench (after #436), close_grip. Order in 6d: oadr's boxes (after #435), smith squat, pushdown, h2l, pullover, burpee. Run the new tests, the batch plate suites and the batch `qa.mjs` hard checks.
5. Build every touched plates page twice, plus a scratch layers page per id (never committed; the D-PF4-EARLY19 form), twice. Post `PF6c PLATES READY @ <sha>` with:
   - the page shas;
   - crops of each changed plate and close-up at 390 px in Silent Black and Paper;
   - the byte proofs;
   - smith squat's tempo-fragment diff.
6. The supervisor runs the plates panel (below). On a fail: one fix round to the critics' exact fixes (`PF6c FIX @ <sha>`), then the focused recheck.
7. After approval: the pins (appended `'owner'` entries citing the approval, `[golden update]` MANIFEST, the ruled D-PF6C-PINS lines). Merge the latest main with a merge commit. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once. Post `PF6c READY @ <full sha>`.
8. On a second failure: HOLD (D-LIB13-PANEL2). Put that row's files back to main's bytes (`git diff origin/main` empty on them), post HELD, and name the follow-up.

## Panels
- **Plates panel** (PANELS.md §1, the pf13 form): 3 fresh Opus critics, blind, R1-R11, one hidden golden-B anchor and a plant, at most 8 tiles (`plan-w9.md:168`).
  - 6c: smith bench, weighted_dip, close_grip, incline_dp, plus anchor and plant: 6 tiles, room for 2 controls.
  - 6d: h2l, pullover, burpee, pushdown, oadr, plus anchor and plant: 7 tiles.
  - smith squat gets the supervisor's delta check, not a tile.
  - The D-FII-R11 sentence covers the smith and close_grip insets. The ruled sentences of Q-PF6C-6 (c) go in as well.
- A finding counts when 2 of 3 critics score an item 3 or less. One fix round, a focused recheck, then HOLD. A new finding in round 2 gets one fix and a check (D-SHIP-W5-NEWFIND).
- **No layers panel here.** Each sheet's look is in the ship wave that flips it, in two blind sets of at most 6 sheets, with a content critic (every changed line: smith tempo, the load and risk lines, chest up, the trap row) and the tier-A safety checker. The scratch layers page shas posted here tell that wave what it judges.

## Pins
- Plates entries on main: appended `'owner'` D-OWNER-REPIN entries. Main's entries are never edited. Lane-only entries are edited in place (D-REPIN-UNMERGED).
- Layers pages: none of the 10 ids is in a committed `pages/*.layers.json` group (checked on main), so no layers pin moves. The shipping wave pins them.
- Pages shared with open lanes follow D-PLATEFIX-SECOND: lb02 with #436, and every page with W10 #434. Append after the other lane's entries, and re-pin after each main merge.

## Acceptance
Each row is a test that is red on main and green after, unless marked otherwise. Numbers marked (p) are proposed here, re-measured in the PLAN, and ruled with it.

| id | row | check | evidence |
|---|---|---|---|
| A1 | smith | The stop is drawn under the near forearm; its top is `STOP_BELOW` under the bar's lowest point (0.5 px); no stop pixel lies between the bar and the chest; the forearm shows from the elbow to the grip; the end bar touches the chest (1 px) | test |
| A2 | smith | Inset: head and both shoulder joints inside the circle; spine within 3 px (p) of its centre line; Right 40-50° (p), Wrong 85-95° (p); shoulder line through both joints (1 px); link drawn; same centre and ring in both views | test |
| A3 | smith, squat | Tempo Lower/Pause 1/Press (smith) and Lower 3/Pause 1/Drive up 1 (squat); each constant has its claim, quote, source and ruling; card `tempo` = spec; the ruled-table tests name the new exact sets | test |
| A4 | smith | Bench Wrong: lumbar at least 15 px (p) off the bench line, buttock on the pad (1 px) | test |
| A5 | wdip | Knee angle equal at the top and bottom (2°); feet under the hips (p); plate centre at mid-shin in both; D-LIB17-DIPBAL condition 3 within its own tolerance; bar height still the lowest 5 cm step with every foot point at least `FLOOR_GAP` up | test |
| A6 | wdip | The ruled c13 line is printed; copy-lint gives [] with every cap unchanged | test |
| A7 | close_grip | Mistake inset as A2, with the Right upper arm by the ribs and the Wrong at least 80° (p) | test |
| A8 | close_grip | Elbow-path Wrong: dashed red bar at the high touch point, never above the neck landmark; no solid Right bar or arm in that pane; Right pane byte-equal | test |
| A9 | incline_dp | One smooth dashed back (no turn sharper than 45° between samples, p); leaves the pad at the shoulder blades (2 px), peak 20-30 px off the pad face, rejoins at the seat; no point inside the near arm; leader on the peak (0.5 px), crossing no arm outline | test |
| A10 | incline_dp | The risk lines are the ruled split of card `risks[0]`, word for word; copy-lint []; 3 risks or fewer | test |
| A11 | h2l | End hands at least 0.2 m (p) below the chest landmark; `ELBOW` rule unchanged; drawn end arm at least 80 % (p) of its start length; each cable ends on its handle (1 px) | test |
| A12 | h2l | Trunk zoom in the ruled view: Right trunk within 3° of vertical, Wrong tipped at least 15° (p), arms equal in both | test |
| A13 | pullover | Wedge at least 15 px (c3) outside the solid outline, at least 3 px from the arm, hips on the seat (1 px); head off the pad (p); pivot circle within the posted distance above the shoulder; arm, elbow pad and bar each visible (p, how much may be covered) | test |
| A14 | pullover | Trap row `at.muscles` is `['upper_traps']`; the Pivot close-up as ruled | test |
| A15 | burpee | Key pose and ghosts as ruled; no via ghost; PF4's landing rules hold at least as strictly | test |
| A16 | pushdown | End lean as posted (c10); bar at least 3 px (p) in front of the thigh outline; the parent proof (`platefix4-pushdown.test.ts:20-27`) unchanged and green; hip leader within 0.5 px of the hip | test |
| A17 | pushdown | Elbows Wrong upper arm 40-45° forward; elbow at least 15 px (p) in front of the torso line; bar at or above the chest landmark; the dashed vertical drawn | test |
| A18 | squat | Only the tempo fragment of the plate moves (D-SHIP-W5-PLATETEXT proof); the sheet line reads "Brace and keep your chest up."; the feel line is byte-equal | test, supervisor delta check |
| A19 | oadr | PQ-H4 has no overlap at 340 px; HT10 C10 is clean in 5 themes; the leaders end on `backUpper` and `elbow.r` (0.5 px) | QA output, test |
| A20 | oadr | Twist Wrong: working shoulder at least 12 px (p) above the support shoulder; one `turn` guide; no dashed support limb; hips within 1 px of the Right's | test |
| A21 | all | Every other plate, zoom and page fragment is byte-equal (`fragmentsOf` over every page config). Byte-equal files: `eq/smith.mjs`, `eq/dipBars.mjs`, `eq/inclineBench.mjs`, `eq/parts.mjs`, `zoom/inline.mjs`, `qa/zoom.mjs`, `templates/CURL.mjs`, `specs/incline_dumbbell_press.mjs`, `specs/triceps_pushdown.mjs`. QA hard checks pass with no new flags | output |
| A22 | all | Each touched plates page and each scratch layers page is built twice with equal sha256 | output |
| A23 | all | No row flips: each stays `approved-plate`, with no generated file | test |
| A24 | all | Plates approved at the READY sha, or the row HELD with its files at main's bytes | the supervisor's result comment |
| A25 | all | The READY head contains the latest main; check, test:tz, the gate and CI are green; no closing keywords in commits or the body (F-COMMIT-KEYWORDS) | CI links, grep |

## Mutations
Each turns its row red. Post the red lines.

| id | mutation | red |
|---|---|---|
| m1 | the stop back to `stopZ: 'front'` and main's size | A1 |
| m2 | the inset back to main's region (head cut, one arm) | A2 |
| m3 | the touch box back, so the link drops | A2 |
| m4 | the Pause removed, or moved to the top as a Hold | A3 |
| m5 | a constant without its quote | A3 |
| m6 | `ARCH` back to 30 | A4 |
| m7 | `BOTTOM_KNEE` back to 90 | A5 |
| m8 | the c13 line removed, or a 15-word line | A6 |
| m9 | close_grip's inset removed, or its Right arm at 90° | A7 |
| m10 | the solid Right bar back in the Wrong pane | A8 |
| m11 | main's `ARCH_PTS` (the corner) | A9 |
| m12 | main's risk text | A10 |
| m13 | `END_DROP` 0.1 | A11 |
| m14 | the Trunk zoom in front view | A12 |
| m15 | the wedge drawn inside the outline (main's) | A13 |
| m16 | the trap row back to `parts: ['neck-left','neck-right']` | A14 |
| m17 | the crouch ghost back | A15 |
| m18 | the template's default changed (the parent proof goes red) | A16 |
| m19 | the pushdown end lean removed | A16 |
| m20 | `ELBOWS_FORWARD` back to the spec Mistake's values | A17 |
| m21 | "chest forward" back, or a byte outside the tempo fragment moved | A18 |
| m22 | oadr's boxes removed | A19 |
| m23 | the dashed support limb back | A20 |
| m24 | one byte of `eq/smith.mjs` or of another plate | A21 |

## Stops (post and wait)
- A route needs any of these (beyond a ruled default-off opt-in): `vendor/**`, `layers/engine/**`, `hands/**`, `zoom/inline.mjs`, `qa/zoom.mjs`, `eq/smith.mjs`, `eq/inclineBench.mjs`, `eq/parts.mjs`, another spec, pilot A's `incline_dumbbell_press.mjs` or `triceps_pushdown.mjs`.
- A copy-lint cap blocks a ruled line. Caps are never loosened.
- weighted_dip: no balanced pose exists with the legs hanging (the bisect throws), or the elbow leaves D-LIB17-DIPBAL's balanced range.
- burpee: the engine cannot draw the ruled pose map, for example the start ghost is hidden in the Mistake view, or the merge keeps plank keys.
- incline_dp: c2's arm-clear curve cannot reach a 20 px gap.
- h2l: the side view needs more than the ruled crop opt-in.
- pushdown: the parent proof cannot stay byte-equal.
- oadr: boxes alone cannot clear H4 or C10, or #435 has not merged when the dry run runs.
- Any byte of another plate, zoom entry or pinned page moves.
- #434, #435 or #436 changes a file this card edits after the PLAN.
- A walker crosses 480 s. Two failed tries of one approach with no new evidence.

## Never
- `tools/plates/vendor/**`, `tools/plates/layers/engine/**`, `tools/plates/library/hands/**`, `gen/**`, `tools/plates/generate.mjs`, `copy-lint.mjs`.
- `eq/smith.mjs`, `eq/dipBars.mjs`, `eq/inclineBench.mjs`, `eq/parts.mjs`, `zoom/inline.mjs`, `qa/zoom.mjs`, `templates/CURL.mjs`.
- `specs/incline_dumbbell_press.mjs` and `specs/triceps_pushdown.mjs`; any other spec, sheet, research card or quotes file.
- Batch stages (no flip); committed `pages/*.layers.json`.
- `src/**` except regenerated header lines; `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `package*.json`.
- `escobar-worker/**`, `native/wear/**`, signing and keystores, saved-data shapes (`src/core/models.ts`, `store.ts`, migrations).
- Loosening any check: no skip, no wider tolerance, no removed mutation.

## Risks
- **Earlier rulings collide with the fixes:** D-LIB17-DIPBAL, D-LIB22-POSEMAP, D-LIB11-PANEL1, the ruled tempo maps, the text-zoom row, the copy-lint caps, and the hand gap rulings. Mitigation: every collision is a ruling asked before any build, and each has a Stop.
- **Shared files with open lanes.** W10 (#434), F-HARNESS-FEEL-GRIP (#435) and F-INCLINE-INSET (#436) touch MANIFEST, the lb02 and pilot-b golden files, the head-inset form and the held-id checks. Mitigation: smith bench and close_grip wait for #436, and oadr waits for #435; merge main with merge commits; MANIFEST only by `manifestOf`; the D-PF6C-PINS list is ruled before any edit.
- **A fresh panel fails again.** Four rows have already failed the same item twice. Mitigation: build to the critics' exact numbers with red-before tests; HOLD after round 2; no further fresh start without a new route.
- **The pushdown parent proof breaks.** Mitigation: an opt-in param with the parent's default, and m18.
- **Supervisor time.** Two plates sets here and two layers sets later. Mitigation: at most 8 tiles per set; smith squat by delta check.
- **The incline_dp sheet may draw pilot A's spec, not `__lb2`.** If so, P1 does not reach the sheet. Mitigation: the PLAN names the source before building.
- **CI time** (about 94 min a run). Mitigation: one push per step.

## Forecast [est]
- 6c: PLAN 3 h; build and tests 10-14 h; plates panel 2-3 h (supervisor); fix round 4-6 h; pins, CI and review 4-6 h. **About 3-4 working days**, starting after #436 merges.
- 6d: PLAN 3 h; build and tests 12-16 h; panel 2-3 h; fix round 4-6 h; pins, CI and review 4-6 h. **About 3-5 working days**; oadr's part waits on #435.
- Run in parallel, both merge in about 4-5 working days [est]. One card for all 10 would take about 6-8 days [est].
- Then each sheet's layers round 1 runs in W11 or W12.
- Uncertainty:
  - rulings that amend earlier ones (dip, burpee);
  - a crop opt-in (about +1 day);
  - the three open PRs;
  - the CI queue;
  - the weekly usage limit.

## Unverified
- **D-W10-LOADLINE and D-W10-IDPRISK.** These names come from the supervisor's start message. No #434 comment carries them (all 9 comments were searched). The substance is in 6923360626.
- **Which spec the lb02 layers sheet draws for incline_dp.** The sheet imports pilot A's spec (`howto :16`), but W10's critics quote "OFF THE PAD", which is `__lb2`'s tell (`:257`). Pilot A's tell is "Low back arches" (`incline_dumbbell_press.mjs:213`).
- Whether the engine can draw burpee with the plank as the end pose and a full standing Mistake (`plate.mjs:48` merges over the end), and whether the start ghost shows in the Mistake view.
- Whether a `view: 'side'` crop on a front plate can be an opt-in like `backView`, or needs the engine to render the parts side-on.
- Whether `checks/ship-w10.ts` (#434) pins the held specs' bytes, and how `platefix4-pins.ts` reacts when its listed files change.
- Whether any guard ties a sheet's mistake fix text to the card's words (smith squat's "chest up").
- Whether smith squat's tempo strip is its own plate fragment.
- Every critic pixel number (PNG scale), and the FIX texts cut off in `w10-findings.md`.
- The causes of pullover's machine parts not reading (layer, size or cover). The parts exist in the composer.
- No page was built and no plate was rendered here.

## ## Supervisor rulings (2026-11-16; these win over the text above)
Two W10 rulings this card carries were stated in the W10 verdict (#434 6923360626) without ids; they are named here:
- **D-W10-LOADLINE:** weighted_dip prints its card's c13 load progression (`tierA.safetyPoints` lists it). D-TEXT-PROGRESSION covers exercise progressions, not load steps.
- **D-W10-IDPRISK:** incline_dumbbell_press prints card `risks[0]` (c15, c10) word for word, including the instruction "Have a spotter hold your wrists."

Rulings on the questions above:
- **D-PF6C-SPLIT** (Q-PF6C-1): yes. One document, two PRs and two builders. **6c** takes the 4 second-failure rows (smith_machine_bench_press, weighted_dip, close_grip_bench_press, incline_dumbbell_press). **6d** takes the other 6. Each PR has its own plates set of at most 8 tiles; smith squat's tempo is a delta check.
- **D-PF6C-FRESH** (Q-PF6C-2): yes. 6c's rows get a fresh round 1 (the F-FLY-START form), but only after a real redraw proven by a test that is red before the change. A failure after the one fix round holds the row again.
- **D-PF6C-PAUSE** (Q-PF6C-3): yes. Use decline's Pause form for smith bench and smith squat. Each card's `tempo` key matches, in the D-W10-JUMPSQ two-key form. The ruled tables in `lib11-pilot-b.test.ts:528-572` and `lb6-plates.test.ts:1660-1694` move as named other-card edits that are at least as strict. "Chest up" is a card edit in the same form.
- **D-PF6C-AMEND** (Q-PF6C-4): yes. The five earlier rulings are amended as listed. Each amendment is named in the PR with its old ruling id and the new text; the pushdown template opt-in keeps the parent's proof byte-equal.
- **D-PF6C-INSET** (Q-PF6C-5): yes. close_grip gets a spec-only head-end inset in incline's #436 form. h2l's Trunk side-view crop is a default-off opt-in; needing an engine change is a Stop.
- **D-PF6C-COPYCAP** (Q-PF6C-6), amended: no card risk is dropped to make room. weighted_dip's c13 line merges into its existing Setup `load` step, keeping the c8 plate cue, within the cap; the PLAN shows the exact text. If that cannot fit, it is a Stop. incline_dp prints `risks[0]` as two lines ("In US hospital data, dropped weights are the top cause of lifting injuries." / "Have a spotter hold your wrists."), within the risks count cap. The ruled exceptions go into the panel prompt as ruled sentences (PANELS 1.5).

Lanes: 6d starts when W9's lane frees; 6c starts when #436's lane frees.

## Rulings asked
1. **Q-PF6C-1: one card, or split into 6c and 6d.** Recommended: **split, with this one document serving both.** 6c takes the four second-failure rows (smith bench, weighted_dip, close_grip, incline_dp). 6d takes the six round-1 rows (h2l, pullover, burpee, pushdown, smith squat, oadr). Why:
   - The golden pages do not overlap: 6c re-pins pilot-b, lb02 and lb07; 6d re-pins lb03, lb05, lb06 and lb10. Only MANIFEST and `platefix4-pins.ts` are shared.
   - The round rules differ: a fresh round 1 for 6c, the D-PFC-ROUND1 fix round for 6d.
   - The blockers differ: 6c waits on #436, 6d's oadr on #435. One can merge without the other.
   - Each half fills one plates set of at most 8 tiles (6 and 7 tiles), so the panel count is the same either way.
   - Each builder carries about half the load. 10 rows on 7 pages is a heavy single lane.
2. **Q-PF6C-2: a fresh round 1 for the four second-failure rows.** Recommended: **yes**, in the F-FLY-START form (#340 6540319537; `plan-w9.md:149`), on these conditions:
   - each failed item gets a real redraw to the critics' numbers, proven by a test that is red on main's drawing;
   - its plates panel here is round 1, and its sheet look in the ship wave is round 1 (D-PFC-ROUND1);
   - a fail after the one fix round holds the row, with no further fresh start unless a new route exists.
   - Why: D-LIB13-PANEL2 stops re-judging the same drawing, not judging a new one. PF5's 13 fresh rounds and incline_bb's approval in a fresh round 1 after three failures (6920821621) show it works. smith squat's ship-wave look stays its W10 fix check (tempo strip only).
3. **Q-PF6C-3: the bottom pause and the two card text edits.** Recommended: **yes.**
   - Add a 1 s `Pause` constant in decline's form (D-LIB10-NOTE Q5; `lb2/tempo.json` constants) to `pilot-b/tempo.json` and `lb6/tempo.json` r2. Set each card's machine `tempo` key to match. Move the ruled tables (`lib11-pilot-b.test.ts:528-572`, `lb6-plates.test.ts:1660-1694`) to the new exact sets, with the old mutations kept.
   - Edit smith squat's `handlingMistakes[2].fix` to "chest up" (claims plus c6) in the D-W10-JUMPSQ named-key form, with the `lb6/cards.sha.json` r2 pin recomputed and a `recopied` record.
   - Why: the guards tie the spec to the card and to tempo.json, so no single file can change alone. c22's quotes state the order and the seconds. smith bench's c18 is WEAK, but its card already names the 1 s bottom pause (card `:568`). The W10 critics flagged both.
4. **Q-PF6C-4: amend five earlier drawing rulings, one row each.** Recommended: **yes to (a)-(e)**, each with a Stop if the drawing cannot follow:
   - (a) D-LIB11-PANEL1: smith bench's stop becomes fii c3's catch of about 16 × 10 px on the upright, behind the arm.
   - (b) D-LIB17-DIPBAL option P: the bottom legs keep the top's slight bend; the shoulder position and lean, which the solver already sets, give the balance.
   - (c) D-LIB22-POSEMAP: burpee's solid key pose becomes the plank, with the standing landing as the one ghost, no crouch ghost, and the Mistake as a full standing pose.
   - (d) pullover: the Pivot close-up is drawn once the pivot is (its text-zoom entry removed); the Hand close-up stays D-SHIP-HANDW6.
   - (e) pushdown: one opt-in template param for the end lean (claim c10), with the parent proof unchanged.
   - Why: in every case 2-3 critics asked for exactly this, and the old ruling fixed a value, not a principle a test proves.
5. **Q-PF6C-5: the two view problems.** Recommended:
   - (a) close_grip: a head-end inset on the plate's Mistake view in the approved ring form, spec only, plus c3's side-view Wrong pane.
   - (b) h2l Trunk: a `view: 'side'` close-up opt-in in `render/closeup/crop.mjs`, in the `backView` form, default off, with a byte proof over every other close-up. If it needs the engine, Stop, and h2l's L5 waits for F-PLATE-SIDEVIEW.
   - Why: close-ups use the plate's view (`crop.mjs:52-56`). close_grip failed side-on twice. All three h2l critics asked for a side view.
6. **Q-PF6C-6: lines under the copy-lint caps, and the named exceptions.** Recommended:
   - (a) weighted_dip: the c13 line replaces Risks[2] ("A swinging plate…", c8), in the D-W8B-RISKSLINE form, at 14 words or fewer, for example "Add weight once body weight is easy, 2 to 10 percent at a time." c8 is still covered by setup step 2 and mistake `swing`.
   - (b) incline_dp: `risks[0]` printed as two risk lines, word for word: the house sentence (13 words, c15) and "Have a spotter hold your wrists." (c10). That makes 3 risks.
   - (c) Four ruled sentences for the panels: smith's Hand chip (D-SHIP-HANDW4), smith's shoulder-row cause (D-FEEL-NOMEANS), pullover's Hand close-up (D-SHIP-HANDW6) and smith squat's lockout cue (D-TEXT-GOLDEN).
   - Why: the caps are never loosened (setup 5/5 and risks 3/3 on weighted_dip; 19 words against 14 for incline). `hands/**` is outside a plate card. A ruled sentence keeps critics judging the drawing (PANELS §1).
