# Plan after W8c: W9 to W13 (toward D-OWNER-LIB142)

Researcher draft for the supervisor, 2026-11-16; status `draft`. Read-only research: nothing was built, flipped or posted.

Refs:
- main `46e564ce` (train 100, #423), read with `git show` / `git archive`;
- W8c #429 head `4607c03f` (contains `46e564ce`);
- claude/sup-lib4-cards `f4bbb209` (plan-w8.md, lib-ship-card.md, lib-ship-w8c-card.md, lib-platefix-4/5-card.md, f-dl-liftoff-card.md, research-routes-card.md, panels/*-findings.md);
- HANDOVER 8.0t (claude/sup-handover worktree `9f3689bd`);
- PR comments by id, read with `gh api`.

Scratch checks (scripts in the supervisor scratchpad `w9/`, never committed):
- a leaf diff of underhand_lat_pulldown against lat_pulldown with `family.mjs`;
- a `tsc` run of the palm-flat pose literals against `content-types.ts`.

[unverified] marks what no run here checked.

## 0. Baseline

| | count | source |
|---|---|---|
| exercises.json ids | 153 | `src/howto/coverage.ts` |
| shipped on main `46e564ce` | 81 | coverage.ts on main: 81 `stage: 'shipped'` rows |
| W8c flip | 3 | seated_leg_curl, assisted_pull_up, dumbbell_shrug (#429 6895226756; coverage.ts on `4607c03f`: 84 shipped) |
| shipped after W8c | **84** | 81 + 3 |
| named list, never in the 142 | 11 | 9 `left-out:D-OWNER-LIB142` plus 2 `queued` (cable_rear_delt_fly and overhead_cable_triceps_extension, still Q-W7-7) |
| **to ship for 142** | **58** | 153 − 84 − 11. Every one of the 58 must ship. |

- All 58 are `approved-plate` in their batch files (coverage.ts on `4607c03f`: 58 `approved-plate`, 9 left-out, 2 queued).
- No row lacks an approved plate, so "not drawn" is empty.
- 4 rows have only a stub How-to sheet (`export default { id, research }`, 261-317 B in `tools/plates/library/howto/`): smith_machine_incline_press, goblet_squat, bench_dip and renegade_row. Each needs its sheet written before any layers check.

## 1. The 58 rows

Status:
- **AP**: approved-plate, no hold ruling on it;
- **AP-H**: approved-plate, held by the cited ruling;
- **AP-S**: approved-plate with a stub sheet.

"Round 1" is a fresh blind layers panel in the D-PFC-ROUND1 form. "Round 2" is the supervisor's crop check after one fix (D-LIB13-PANEL2). A second failure holds the row.

| # | id | page (batch) | status | what blocks it (citation) | freed by | wave |
|---|---|---|---|---|---|---|
| 1 | mountain_climbers | pilot-a | AP-H | D-W8C-MCHOLD (#429 6895200917): the generated `ht-mountain-climbers.ts` fails typecheck, TS2353 `forearmTilt` not in `Partial<HandPose>` (src/howto/content-types.ts:78-90) | **F-PALMFLAT-APPTYPE**, then round 2 (L3 and the hand panel) | W9 (if the tool card has merged) |
| 2 | bent_over_dumbbell_rear_delt_fly | pilot-a2 | AP-H | D-LIB13-PANEL2 hold (#395 6655186998; plan-w8.md:38: "front view can't show the hinge", the shrug). PF4 group 3 was never built (not in the #410 HANDOFF, 6761897411) | PF6b: a chosen-focus posture zoom, option (a) | W12 |
| 3 | box_jump | pilot-a2 | AP-H | Q-W2-6 S3: no shared ankle red-flag box (plan-w8.md:39). RR4 drafted the box (c18, c19; #414 A8). F-ANKLE-BOX is owed (HANDOVER 8.0t 11-10 ~08:45, D-RR4-ANKLECAP) | **F-ANKLE-BOX**, then round 1 | W13 |
| 4 | dumbbell_fly | pilot-a3 | AP-H | pf14 R5 failed again (F-FLY-WRIST, #410 6756215536). PF5 stop Q-PF5-3: a one-landmark focus fails `H3.zoom:posture:fill` (qa/zoom.mjs:122; #419 6849384938). Held at main's bytes (6857928317) | **F-ZOOM-FOCUS1** (tool), then a fresh plates round | W12 |
| 5 | smith_machine_bench_press | pilot-b | AP | W4 L5 [3,3,2] (panels/w4-findings.md:85). The inset plate (3b item 22) was approved (6705141445), but round 2 was never judged (plan-w8.md:66). Its card parent is barbell_bench_press | round 2, after bbp ships | W10 |
| 6 | incline_machine_press | lb01 | AP-H | D-SHIP-W3-NOPAIR (#384 6681221802): no machine-handle push pair (family.mjs:39-44) | **F-HAND-MACHINEPUSH** (hands lane), then a layers check | W12 |
| 7 | shoulder_press | lb01 | AP-H | the same | the same | W12 |
| 8 | underhand_lat_pulldown | lb01 | AP-H | D-W8C-UNDERHAND (#429 6893626415): `familyRefusal` red on `posture[key=path].detail` (map at family.mjs:69) | **F-UNDERHAND-FAMILY**, then carry: PF5 panel 6851987591 plus D-PF5-HANDPAIR 6852356177 | W9 (if the tool card has merged) |
| 9 | barbell_bench_press | lb02 | AP | none. lyr-pf11 passed the sheet (#410 6750587189 @ `7b4e4866`) | — | W9 |
| 10 | incline_barbell_bench_press | lb02 | AP-H | D-PF3B-HOLD15 (plan-w8.md:53): R5 failed after two rounds, plus R7 and R11. The head-end inset was never built (#410 HANDOFF) | **F-INCLINE-INSET** (PF6b, fresh round 1, F-FLY-START) | W12 |
| 11 | incline_dumbbell_press | lb02 | AP | lyr-pf11 L5 [3,3,3] led to D-PF4-20B (6750587189). The 20b plate was approved in pf13 (6752705237); round 2 of L5 was never judged | round 2 | W10 |
| 12 | close_grip_bench_press | lb02 | AP | W4 L1 [3,3,2] and L5 [2,2,2] (w4-findings.md:39-46). Round 2 was never judged (plan-w8.md:55). Card parent bbp | round 2, after bbp ships | W10 |
| 13 | decline_bench_press | lb02 | AP | lyr-pf11 L6 [3,4,3]. The D-W8B-DECLINEFEEL text fix was never applied: W8b did not take lb02's PF4 rows (6750587189). Card parent bbp | the ruled text fix, then round 2 | W10 |
| 14 | arnold_press | lb02 | AP-H | E3 (#391 6653540190): no sourced way to end a failed rep (LIB-WAYOUT). RR4 A1 found NO SOURCE (#414 HANDOFF) | **the NO SOURCE fallback ruling** (supervisor), then a layers check | W13 |
| 15 | skull_crusher | lb02 | AP-H | the same; RR4 A2 NO SOURCE (F-RR4-1) | the same | W13 |
| 16 | one_arm_dumbbell_row | lb03 | AP | plate redrawn and approved in pf12 (#410 6751563503). The sheet has had no layers check since, although lib-platefix-4-card.md:41 asks for one | round 1 | W10 |
| 17 | conventional_deadlift | lb03 | AP | none. #427 merged (train 97). L5 PASS 6872578643 @ `2404f774`; L4 round-2 PASS 6874288878 @ `e8e15f7a`; card `318f30ab…` | — | W9 |
| 18 | sumo_deadlift | lb03 | AP | none. W8b PASS 6856272493 @ `1fdf6975`, card `b1c29f89…` (f-dl-liftoff-card.md:12). Its parent conventional ships in the same head | — | W9 |
| 19 | back_extension | lb03 | AP-H | lyr-pf11 L7 [3,3,3]: a no-grip sheet drops the handling-mistakes block, routed to **F-NOGRIP-MISTAKES** (6750587189) | F-NOGRIP-MISTAKES (renderer; re-pins every no-grip sheet), then round 2 | W11 |
| 20 | goblet_squat | lb04 | AP-S | Q-W5-7 S3: thumb, wrist and way-out (plan-w8.md:71). RR4 A5 NO SOURCE ×3 (F-RR4-2). Stub sheet (270 B) | the fallback ruling, then the sheet and round 1 | W13 |
| 21 | jump_squat | lb04 | AP-H | main's `cards/jump_squat.json` inherit[] still names `plate.frames`. RR4's edit `9244e049` (inherit `[]`) exists only on research head `207b8de8`. D-RR4-JUMPSQ allows it (research-routes-card.md:50-53) | copy the card from `207b8de8` (D-RR-HEAD form, as PF5 did for pendulum_squat), then a delta check against its W5 card (LIB-SHIP-DESIGN "W5. Flip set": "return with a delta check") | W10 |
| 22 | step_up | lb04 | AP-H | W8b: L1 failed a second time, plus L5 and L7 (#417 6856272493) | **F-STEPUP-START** (fresh round) | W11 |
| 23 | bulgarian_split_squat | lb04 | AP | none. #426 merged (train 98; delta PASS 6898578441). Panel PASS 6869858026 @ `ea5cbca8`, card `bcd016a4…bb99` | — | W9 |
| 24 | cross_body_hammer_curl | lb05 | AP-H | W8b: L3 (the hand row) and a second L5 failure (6856272493) | **F-HAMMER-TWIST** (fresh round) | W11 |
| 25 | cable_curl | lb05 | AP | none. PF5 approved the plate; the sheet failed only L3, and D-PF5-HANDPAIR cleared it (6851987591, 6852356177) | — | W9 |
| 26 | incline_dumbbell_curl | lb05 | AP-H | D-W8B-INCLINE (6856468001): the shared `curl-dumbbell-under` note (L3) and the seated camera (L7) | **F-CURL-UNDER-NOTE** + **F-SEATED-CAM** | W12 |
| 27 | concentration_curl | lb05 | AP-H | D-PF5-CONCSTAGED (lib-platefix-5-card.md:9-11): no sourced common hinge | **F-CONC-HINGE** (research), then a plates round | W13 |
| 28 | wrist_curl | lb05 | AP-H | W8b L4, L5 and L7 failed; held under Q-W8b-6 (6856272493) | **F-HAND-FINGERTIP** (hands lane) | W12 |
| 29 | straight_bar_triceps_pushdown | lb05 | AP | the plate was re-cloned and approved (pf12, plus crop check 6752448386). No layers check since | round 1 | W10 |
| 30 | smith_machine_incline_press | lb06 | AP-S | Q-W6-9: its card parent incline_barbell_bench_press is held (plan-w8.md:92). Stub sheet (317 B) | after incline_bb ships: write the sheet, then round 1 | W13 |
| 31 | cable_chest_press | lb06 | AP | none. PF5 round-2 PASS 6853178277 @ `50a35bb6` | — | W9 |
| 32 | low_to_high_cable_fly | lb06 | AP-H | D-PF3B-LTHHOLD: "a front view cannot show the reach" (plan-w8.md:94). Never built | **F-LTH-VIEW** (PF6b) | W12 |
| 33 | high_to_low_cable_fly | lb06 | AP | plate approved in pf13 (6752705237); no layers check since | round 1 | W10 |
| 34 | machine_pullover | lb06 | AP | the same | round 1 | W10 |
| 35 | rear_delt_fly | lb06 | AP-H | W6 L1 and L5 [2,2,2] (w6-findings.md:94-106). Held after pf8 (plan-w8.md:97); PF4 group 3 not built | PF6b: shoulder contour and source ring | W12 |
| 36 | smith_machine_shoulder_press | lb06 | AP-H | W6 L5 [3,3,3] (w6-findings.md:64). The head-end inset was never built (plan-w8.md:98) | PF6b inset | W12 |
| 37 | smith_machine_squat | lb06 | AP | plate approved in pf13. No layers check since. Its `wrong.under` crop is covered by F-HT4-UNDER (#418) | round 1 | W10 |
| 38 | hip_abduction | lb06 | AP | W6 L5 [3,3,4] (w6-findings.md:107). Ruled "judged as drawn" (#405 6684669717 item 5) and never rechecked | round 2 as drawn | W10 |
| 39 | hip_adduction | lb06 | AP | none. PF5 round 1 approved (6851987591) | — | W9 |
| 40 | weighted_dip | lb07 | AP | W6 L5 [3,4,3] (w6-findings.md:24). Ruled "no change" (6684669717 item 6) and never rechecked. The way-out is a recorded gap | round 2 as drawn | W10 |
| 41 | cable_external_rotation | lb07 | AP | none. PF5 round 1 approved under D-BODYMAP-NOCUFF (6851987591) | — | W9 |
| 42 | bench_dip | lb07 | AP-S | Q-W6-5 S3 (plan-w8.md:102). RR4 A6: thumb DISAGREE, wrist NO SOURCE. Stub sheet (261 B) | the fallback ruling, then the sheet and round 1 | W13 |
| 43 | diamond_push_up | lb07 | AP | none. PF5 round-2 PASS 6853178277. L7 is under D-PF5-DIAMONDCAM; the hand is a GAP (hands/no-zoom.json:135-139) | — | W9 |
| 44 | renegade_row | lb07 | AP-S | Q-W6-6 S3 (plan-w8.md:105). RR4 A7 NO SOURCE ×3. Stub sheet (270 B) | the fallback ruling, then the sheet and round 1 | W13 |
| 45 | resistance_band_pull_apart | lb07 | AP-H | W6 L5 [2,2,2] (w6-findings.md:56). The `focus` posture zoom was never built (plan-w8.md:106) | PF6b | W12 |
| 46 | hack_squat | lb08 | AP-H | D-PF5-HACKHOLD (#419 6852366101): the plate Mistake went back to main's bytes; the knee-lock close-up stays | **F-HACK-PAD**, then a plates round and L5 | W11 |
| 47 | pendulum_squat | lb08 | AP-H | D-PF5-PENDHEEL (6852366101): plate R5, the heel. Its layers were approved in round 1 (6851987591) | **F-PEND-HEEL** (its card says how the LIB-18 pins and c2/c11 allow a heel gap) | W11 |
| 48 | glute_bridge | lb08 | AP-H | D-SHIP-W7-HOLD2 (#394 6753333493): gate A3 S0 754 > 700 elements | **F-GLUTEBRIDGE-S0** | W11 |
| 49 | side_plank | lb09 | AP | none. PF5 round-2 PASS 6853178277 | — | W9 |
| 50 | v_up | lb09 | AP-H | D-PF3B-HOLDVUP. D-PF4-VUPSWAP (#410 6751721161): the V figure and the Trace need an engine opt-in | **F-VUP-SWAP** (engine) and F-PLATE-CROP, then plates and layers rounds | W12 |
| 51 | superman | lb09 | AP-H | W7 L7 [3,3,3], framing (w7-findings.md:22), routed to **F-PLATE-CROP** (D-PF4-CROPCARD) | F-PLATE-CROP | W12 |
| 52 | sled_pull | lb10 | AP-H | D-SHIP-W7-SLEDHOLD (#394 6753040245): gate A3 S0 795 > 700 | **F-SLEDPULL-S0** | W11 |
| 53 | burpee | lb10 | AP | W7 L1, L5 [2,2,2] and L7 (w7-findings.md:58-66). The plate was redrawn and approved in pf13. No layers check since | round 1 | W10 |
| 54 | jumping_jacks | lb10 | AP-H | D-W8C-JJ (lib-ship-w8c-card.md:27): `c51ae277` (toe-out) was reverted by `9b2eb113` (D-PF5-JJ) | W9 re-applies the sheet hunk; round 2 | W9 |
| 55 | high_knees | lb10 | AP-H | D-SHIP-W7-HOLD2 (6753333493): HT8/HT9 fail, because the feel section never mounts on a riskFlags `[]` row | **F-NOREDFLAG-GATE** | W11 |
| 56 | jump_rope | lb10 | AP-H | D-PFR-JUMPROPE (#394 6701937875): L7 hand zoom and grip, and the Wrists row. The plate was redrawn in pf13 | **F-JUMPROPE-HAND** (hands lane), then a layers round | W12 |
| 57 | battle_ropes | lb10 | AP-H | D-SHIP-W7-ROPES (#394 6647954465): the owner question (grip as text only, or a later update). Also W7 L4 [3,3,3] and L5 [3,4,3] (w7-findings.md:44-48) | Q-W7-2 option (b) under D-OWNER-RECOMMENDED, then one fix round | W13 |
| 58 | wall_ball | lb10 | AP | none. PF5 round-2 PASS 6853178277 | — | W9 |

## 2. Counts by blocker

| blocker class | rows | ids (# above) |
|---|---|---|
| standing verdict, ship now (carry) | 11 | 9, 17, 18, 23, 25, 31, 39, 41, 43, 49, 58 |
| ruled in-wave fix plus round 2 | 1 | 54 |
| small tool card, written now | 2 | 1, 8 |
| layers check owed, no tool | 13 | round 1: 16, 29, 33, 34, 37, 53; round 2: 5, 11, 12, 13, 38, 40; card copy plus delta: 21 |
| gate or renderer tool card | 4 | 19, 48, 52, 55 |
| plate, close-up or engine fix in a fresh round | 13 | 2, 4, 10, 22, 24, 32, 35, 36, 45, 46, 47, 50, 51 |
| hands or camera lane | 5 | 6, 7, 26, 28, 56 |
| research, ruling or owner (C/D) | 8 | 3, 14, 15, 20, 27, 42, 44, 57 (3 of them stubs) |
| child of a held parent, stub sheet | 1 | 30 |
| **total** | **58** | |

## 3. Waves and tool cards, in merge order

1. **#429 W8c** (train 101): 84.
2. **F-UNDERHAND-FAMILY** and **F-PALMFLAT-APPTYPE** (cards written with this plan). Each touches only its own file plus one test, and either may merge first. Both must land before W9's LAYERS READY, or their row waits (W9 S4).
3. **W9** (`lib-ship-w9-card.md`): 11 carries, jumping_jacks' round 2, and the 2 conditional rows. **84 → 96, or 98 with both conditional rows.**
4. **W10, the layers wave** (card owed: `lib-ship-w10-card.md`). The 13 rows in class "layers check owed":
   - one blind panel for the 6 round-1 rows, plus hip_abduction and weighted_dip as drawn (see Open choices);
   - crop checks for the 4 bench round-2 rows (incline_dp, decline, close_grip, smith bench; bbp shipped in W9);
   - the jump_squat card copy and its delta check.
   - Pages: lb02-lb07, lb10, pilot-b.
   - It builds ahead in scratch from W9's PLAN (D-OWNER-PARALLEL) and merges after W9. **About 96 → 107** at a 0.8 pass rate [est].
5. **Tool batch 1**, merging as each is ready and before W11's LAYERS READY:
   - **F-GATE-O1-TAPCLOCK** (throughput; needs the supervisor's AGENTS exception 6 PR first);
   - **F-GEN-HELD-CLEAN**;
   - **F-NOGRIP-MISTAKES**;
   - **F-W7-S0** (F-SLEDPULL-S0 and F-GLUTEBRIDGE-S0 in one card: the same A3 S0 rule);
   - **F-NOREDFLAG-GATE**;
   - **PF6a**: F-HACK-PAD, F-PEND-HEEL, F-STEPUP-START and F-HAMMER-TWIST, each a fresh round 1.
6. **W11:** the 8 rows of tool batch 1 (back_extension round 2; deltas for sled_pull, glute_bridge and high_knees; the PF6a ids). **About 107 → 113** [est].
7. **Tool batch 2:**
   - F-ZOOM-FOCUS1, F-VUP-SWAP and F-PLATE-CROP (engine and QA);
   - **PF6b**: F-INCLINE-INSET, the smith shoulder inset, F-LTH-VIEW, rear_delt_fly, band pull-apart and bent-over rear delt fly;
   - the hands lane: F-HAND-MACHINEPUSH, F-HAND-FINGERTIP, F-CURL-UNDER-NOTE + F-SEATED-CAM, F-JUMPROPE-HAND, and F-LAYERS-HANDPAIR before any hands-lane panel.
8. **W12:** the 14 rows of tool batch 2. **About 113 → 124** [est].
9. **C/D routes, started now** (rulings cost no lane):
   - the NO SOURCE fallback ruling for 5 rows (HANDOVER 8.0t 11-10 ~08:45);
   - the battle_ropes ruling, Q-W7-2 (b);
   - F-ANKLE-BOX;
   - F-CONC-HINGE (research);
   - the 4 stub sheets, written in scratch ahead of their wave.
10. **W13:** the 9 C/D rows and smith_machine_incline_press. **About 124 → 132** [est].
11. **W14, and W15 if needed:** catch-up for rows held a second time or tool cards that land late, each in a fresh round in a new card (F-FLY-START). **→ 142.**

Throughput cards free no row, but every wave pays for their absence:
- **F-GATE-O1-TAPCLOCK:** the O1 launch-skip probe, seen red twice; #429 6898918927.
- **F-GEN-HELD-CLEAN:** generate leaves a held id's files, so every hold is removed by hand (6895200917).
- **F-RPC2-BUDGET-CI:** the worker-lag budget script is not in CI; a supervisor add-only step.
- **F-BENCHDIP-EVAL:** shrinks the D-RPC2-EXC list.
- **F-C4-CACHE:** library walk times.

## 4. Lanes (up to 4 builders)

| lane | now | next | after that |
|---|---|---|---|
| L1 (Opus) | W9: PLAN when #429 merges | W10 (its scratch build can start at W9 READY) | W11 |
| L2 (Sonnet, every step spelled out) | F-UNDERHAND-FAMILY | F-GEN-HELD-CLEAN, then F-NOGRIP-MISTAKES (Opus: renderer, re-pins) | F-NOREDFLAG-GATE |
| L3 (Sonnet) | F-PALMFLAT-APPTYPE | F-W7-S0 (Opus: a look check per row) | F-ZOOM-FOCUS1 |
| L4 (Opus) | **F-INCLINE-INSET** (the critical path, below) | PF6a | PF6b's other rows, then the hands lane |

- **The supervisor is the other bottleneck.** W9 needs 2 round-2 crop checks. W10 needs a panel of up to 8 sheets plus 4 crop checks. PF6a and PF6b each need a plates panel.
- So run at most one panel per wave, in sets of 8 tiles or fewer (the pf13 form), and batch the crop checks.
- CI runs about 94 min per full run (run 43542476170). Pushes stay one per step.

## 5. Critical path

1. **incline_barbell_bench_press → smith_machine_incline_press (the longest chain).** The steps are F-INCLINE-INSET (a fresh plates round 1, plus one fix round), then incline_bb's layers round in W12, then smith incline's sheet written (it is a stub), then its round 1 in W13. That is two waves deep after a tool card, so F-INCLINE-INSET starts now in L4.
2. **The 5 NO SOURCE rows (arnold_press, skull_crusher, goblet_squat, bench_dip, renegade_row).** Nothing moves until the fallback ruling, and 3 of them still need their sheets written. If the fallback is refused for any of them, 142 cannot be reached by work alone, and that becomes the owner's choice.
3. **v_up:** an engine card (F-VUP-SWAP), then a plates round, then a layers round, all inside W12.

## 6. Forecast in waves (no dates)

- **If every row passes its first round:** 5 ship waves after W8c (W9-W13).
- **Likelier: 6-7 waves [est].** Of rows that came in held, about half needed another round:
  - W8a shipped 3 of 7;
  - W8b shipped 9 of 17;
  - W8c shipped 3 of 6;
  - PF5 approved 8 of 13 (the PR summaries cited above).
- W9's carries should land at 11 or 12 of 12, because no new judgement is involved.
- **Per wave:** W8b took 14 h from PLAN to READY for 17 ids, plus about 1.6 h for a review fix. A full CI run is about 94 min. A carry wave is shorter, because it has no panel.

## 7. Assumptions

- W8c merges as train 101 with exactly 84 shipped, and no rule or owner decision changes the 142 (D-OWNER-LIB142).
- D-OWNER-RECOMMENDED (lib4-cards.md:4830) lets the supervisor apply the recommended option for the NO SOURCE fallback and battle_ropes. The box_jump ankle box text was approved in RR4's verify (D-RR4-ANKLECAP) [unverified that this covers the owner's 11-04 "ask when that card is ready"].
- Each tool card in batch 1 is about a day or less of build plus review [est]. The engine cards (F-VUP-SWAP, F-ZOOM-FOCUS1) take longer [est].
- The weekly usage limit allows the runs. The next reset is Fri 11-20 08:00 UTC, and the 80 % pause rule holds.

## 8. Risks and mitigations

1. **The last 8 C/D rows decide 142.** Five have NO SOURCE, three of those have no sheet, concentration_curl waits on research, box_jump on a new box, and battle_ropes on a ruling.
   - Rule the fallback and battle_ropes now.
   - Write the stub sheets in scratch in a free lane.
   - Give the owner the honest ceiling (142 − the refused rows) with the next APK if any fallback is refused.
2. **Second-failure holds.** About half of the held rows needed another round (section 6), and each hold moves a row one wave later.
   - Every fix card builds to the critics' exact numbers and starts a fresh round 1 (F-FLY-START).
   - Run one panel per group.
   - Plan for W14-W15.
3. **Shared files, CI and the ids.ts limit.** Every wave re-pins the same pages and touches the same exact-set guards, MANIFEST, budgets and reviews.json.
   - A full CI run is about 94 min, and the gate O1 probe has flaked twice.
   - IDS_MAX is 2,048 B. lib-ship-card.md "Measured" gives 2,021 B with 12 distinct hints at 142 ids and 2,055 B (over the limit) with 13. Today ids.ts is 1,569 B with 6 hints, and 13 push ids are still unshipped.
   - Mitigations: strict merge order; regenerate after every main merge (lesson 4); F-GATE-O1-TAPCLOCK early; shared hint texts under D-SHIP-HINTS; ids.ts bytes in every PLAN.
4. **Panels judge an image the app does not show** (F-LAYERS-HANDPAIR). This affects cable_curl and underhand now (D-PF5-HANDPAIR), and every hands-lane row later.
   - The supervisor crop-checks the app render.
   - F-LAYERS-HANDPAIR lands before the W12 hands rows.
5. **barbell_bench_press is a gate fixture in 17 lines** (scripts/screenshot-gate.mjs, for example :1752, :6046, :8486). Shipping it adds the How-to pill and a hint line to those Train cards.
   - W9 Q-W9-3: bbp ships only if the scratch gate is green. The gate is add-only, so another block's red holds bbp and never edits that block.
6. **Supervisor time.** Panels, crop checks and the delta checks all run through one session.
   - Batch the crop checks.
   - Use sets of 8 tiles.
   - Use a Sonnet helper for mechanical re-pins.

## 9. Open choices (recommended options)

- **hip_abduction and weighted_dip "as drawn":** judged in W10's blind panel, not by the supervisor alone. It is a re-judge of an unchanged drawing that failed once, so fresh eyes are fairer. A fail holds the row for a close-up redraw in PF6a.
- **jump_squat's card copy:** done inside W10 in the D-RR-HEAD form (bytes from `207b8de8`, with a `recopied` record), as PF5 did for pendulum_squat. This needs a W10 write_scope ruling, because ship waves never edit research cards.
- **F-UNDERHAND-FAMILY as its own PR,** not folded into W9 under lib-ship-card's INHERIT_MAP write_scope. It gets its own red-before/green-after review, and W9 stays a carry wave.

## 10. Not verified

- The card shas of the 11 carries on W9's base: no page was built here. Each carry assumes its card equals the judged card plus #423's replacements.
- bbp's judged card: lyr-pf11 names the page (`4c4cf718` @ `7b4e4866`), not a card sha.
- That the PF5 rows' `closeups` rows (the 6850595073 recipe) are all W9 needs. A `pair` field for cable_curl is possible.
- The F-W7-S0, F-NOREDFLAG-GATE, F-PEND-HEEL and F-HACK-PAD fixes: their size and files are not traced.
- Whether close_grip's W4 fix (the Elbow-path Wrong) is in its sheet on main.
- The gate effect of shipping bbp, incline_dp and smith bench.
- The How-to total gz on `4607c03f`. budgets.json `totals` still carries the HT-11 measurement (333,813 B gz), so it was not re-measured here.

Supervisor rulings: (none yet)
