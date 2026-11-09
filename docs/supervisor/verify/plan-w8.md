# Plan after W6 + W7: W8 and PLATEFIX-4 (toward D-OWNER-LIB142)

Researcher draft for the supervisor, 2026-11-09. Read-only research. Refs: main `de91dd21` (train 81), W6 `claude/lib-ship-w6` `8709105a` (#393), W7 `claude/lib-ship-w7` `a3e5b6e7` (#394), `claude/sup-lib4-cards` `5943a803` (lib4-cards.md §48), plus the PR comments quoted by id (read with `gh api`).

## 0. Baseline arithmetic

| | count | source |
|---|---|---|
| exercises.json ids | 153 | coverage.ts on main |
| shipped on main | 46 | coverage.ts on main (8 golden + 38 library) |
| W6 flip | 7 | face_pull, pike_push_up, machine_lateral_raise, dumbbell_front_raise, incline_push_up, machine_crunch, cable_lateral_raise (#393 6689822595; W6 lane coverage.ts shows exactly these 7 `shipped`) |
| W7 flip | 19 | not committed yet (W7 lane coverage.ts has all 29 at `approved-plate`). Derived from the rulings: the 11 approved in 6682947098 (ab_wheel_rollout, bird_dog, bear_crawl, cable_kickback, farmer_s_carry, kettlebell_swing, leg_extension, medicine_ball_slam, resisted_hip_flexion, reverse_crunch, sled_push: found by elimination from that comment's lists), + cable_crunch (6683570453) = 12; + hollow_body_hold, high_knees (pfc, 6701001868) = 14; + glute_bridge, dead_bug, standing_leg_curl (pfr, 6701937875) = 17; + lying_leg_curl, sled_pull (D-PF10-W7JOIN, 6711372615) = 19. **The 19-id list is derived, so treat it as unverified until W7 commits its flip.** |
| shipped after W6 + W7 | **72** | 46 + 7 + 19 |
| named list, never in the 142 (D-OWNER-LIB142) | 11 | hip_thrust, pallof_press, russian_twist, flutter_kicks, bicycle_crunch, overhead_cable_triceps_extension, cable_rear_delt_fly, seated/standing/bodyweight/leg_press calf raises |
| **in scope and not shipped after W6 + W7** | **70** | 153 − 72 − 11. The target of 142 = 72 + 70, so **every one of the 70 must ship**. |

The 70 split as 44 at `approved-plate` on main (W1-W5 holds), 16 at `approved-plate` in the W6 lane, and 10 at `approved-plate` in the W7 lane. On main, all 26 W6/W7 rows are still `queued` (build-ahead rows).

## 1. Table of the 70

Stage: `main` / lane. AP = `approved-plate`, Q = `queued`. Classes:
- **A**: nothing but a flip after a layers check. The plate is approved on main, or it is unchanged and its blocker is gone.
- **A2**: an earlier ruling said "no change, the recheck judges it as drawn", and no recheck was found. Recheck it as drawn; a fail means a hold (D-LIB13-PANEL2), and the row moves to B.
- **A↑**: A, but its card parent is in B, so it waits for that parent (D-LIB10-PARENTS).
- **B**: a plate, close-up or engine fix.
- **C**: research or card work.
- **D**: left out, S3, or the owner's call.

### Pilots (W1/W2 holds; pages pinned on main)
| id | batch | stage | why not shipped (ruling) | class | unblock |
|---|---|---|---|---|---|
| pec_fly | pilot-a | AP | D-SHIP-PECFLY-HOLD: "PQ-H4 overlap of 11.58 px² … plus its 'Shoulder pain' row duplicates the RED_FLAG_SHOULDER line". PF2 approved the plate (pf4, #395 6648800268) and main has an `'owner'` D-OWNER-REPIN entry | A | layers check. Also F-PECFLY-FEELROW, the duplicate feel row (from the #395 review Medium). Its exact scope is unverified. |
| barbell_overhead_press | pilot-a | AP | PF1 fix round, then 3b item 23 approved in pf10 (#408 6704679655). D-PF3B-OHPHEAD; owner re-pin 11-07 on main | A | layers check of the sheet on the 3b plate |
| mountain_climbers | pilot-a | AP | #384 6653062201: "it moves to the next wave and is staged here". L4: the feel line names more than the map shades. L7: the hand close-up and the Hip line panels are framed too small. "It flips after its own focused check" | A (+ sheet fix) | L4 copy/map and L7 close-up framing, then a focused check |
| seated_leg_curl | pilot-b | AP | SHIP W2 Q7: "held (no posture zoom; gen/zooms.mjs:71 requires one)". The route F-ZOOM-NONE merged (train 69, #388) | A | put it back on the pilot-b layers page, then a layers check |
| crunch | pilot-b2 | AP | SHIP W2 Q6: "plate.css lacks inline-zoom pz-* rules". The route F-PLATE-ZOOMCSS merged (train 67). PF1 approved the plate (CHIN SET leader; owner re-pin) | A | layers check (the plate changed after W2's layers check) |
| dumbbell_fly | pilot-a3 | AP | "held after their last round (D-LIB13-PANEL2, #395 6655186998)" (platefix2-plates.test.ts:1-2). pf3: R5 "the wrist bend doesn't read", R7 "hexagons into circles" | B | PF4 fresh round (F-FLY-START precedent) |
| bent_over_dumbbell_rear_delt_fly | pilot-a2 | AP | same hold. R1 "front view can't show the hinge"; R5/R11 the shrug | B | PF4: chosen-focus posture zoom, option (a) |
| box_jump | pilot-a2 | AP | Q-W2-6: "held S3 (no shared ankle red-flag box; new app content … own later card from c14 after the owner's approval)" | C/D | an ankle red-flag box card from c14, plus approval of the new box text. Whether D-OWNER-RECOMMENDED covers that approval is unverified (supervisor's call) |

### W3 (lb01)
| id | batch | stage | why | class | unblock |
|---|---|---|---|---|---|
| underhand_lat_pulldown | lb01 | AP | PF3 item 1, approved in pf7 (#405 6685743439); D-PF3-W3MERGE (owner re-pin 11-06) | A | layers check |
| assisted_pull_up | lb01 | AP | W3 held it (R5 failed twice, 6653062201), then 3b item A approved it in pf10 (owner re-pin 11-07). Its W3 layers approval stands | A | layers check of the sheet on the new plate |
| incline_machine_press | lb01 | AP | D-SHIP-W3-NOPAIR (#384 6681221802): "Stage incline_machine_press and shoulder_press off W3"; follow-up **F-HAND-MACHINEPUSH**. "Both ids keep their panel approvals" | B | hands lane: a machine-handle push key (`hand-d-handle.mjs` pushVariant) and a hands panel |
| shoulder_press | lb01 | AP | same | B | same |

### W4 (lb02, lb03, pilot-b): `tests/howto/checks/ship-w4.ts` W4_WAITING on main, D-SHIP-W4-FLIPSET (#391 6682985023)
| id | batch | stage | why | class | unblock |
|---|---|---|---|---|---|
| barbell_bench_press | lb02 | AP | "lb02's ids are held". Open item: PF3 item 19, "the hips-lifted close-up needs a multi-joint close-up pose [G] in `lb02.closeups.mjs`". It moved to 3b (6683313760) but is not in 3b's plan (6699658080) | B | PF4: a multi-joint close-up pose. It is the parent of 4 rows, so it blocks them |
| incline_barbell_bench_press | lb02 | AP | **D-PF3B-HOLD15**: R5 failed again "after two fix rounds, plus R7 and R11"; **F-INCLINE-INSET** | B | PF4 fresh round: a head-end inset with a dashed source ring (D-PF3B-INSETRING form); move the 30° label off the leader (R7) |
| incline_dumbbell_press | lb02 | AP | PF3 item 20 (Mistake outline) approved and folded into the lb02 pin. The "bench-angle panel" geometry (item 20) moved to 3b and was not built | B | PF4: close-up geometry in lb02.closeups.mjs |
| close_grip_bench_press | lb02 | AP | "held until barbell_bench_press ships; round 2 judged with the LIB-PLATEFIX-3 recheck". No round-2 check found | A↑ | after bbp: a round-2 layers check (L5 flare via the Elbow-path Wrong pose) |
| decline_bench_press | lb02 | AP | PF3 item 21: "the feet-loose close-up geometry is [G] in `lb02.closeups.mjs`". It moved to 3b and was not built | B | PF4: close-up geometry |
| arnold_press | lb02 | AP | "held at the W4 layers panel (ruling E3, #391 6653540190): no sourced way to end a failed rep alone (LIB-WAYOUT)" | C | research for a sourced way-out. If none exists: a ruling, or S3 |
| skull_crusher | lb02 | AP | same E3 / LIB-WAYOUT | C | same |
| dumbbell_pullover | lb02 | AP | "lb02's ids are held". Its one item was L4: "the body map has no inner-elbow part", routed to F-BODYMAP-FRONTDELT. That merged (train 76): "adds the inner-elbow and back-of-knee pain parts" | A | map the red-flag row to the inner-elbow part (the D-PFR-L4 form), then a layers check. This row creates the first lb02 layers page |
| one_arm_dumbbell_row | lb03 | AP | PF3 held after pf8 (6688665575): "R1 [4,3,3] (support arm bent about 90°) and R5 [3,3,2]" | B | PF4: support arm straight; the red working arm hangs from the shoulder |
| dumbbell_romanian_deadlift | lb03 | AP | "held until romanian_deadlift ships (#385)". RDL shipped (train 77) | A | delta check (plate unchanged) |
| conventional_deadlift | lb03 | AP | "staged; round 2 judged with the LIB-PLATEFIX-3 recheck". Round 2 (L2 grip step, L5 rounded-back Start Wrong, 6682615402) was not judged. Its parent RDL has shipped | A | round-2 layers check |
| sumo_deadlift | lb03 | AP | "staged; L1 routed to LIB-PLATEFIX-3". PF3 item 17 was approved in pf8; round 2 L2 is still to judge | A | round-2 layers check, in the same head as its parent conventional |
| back_extension | lb03 | AP | "L5 routed to LIB-PLATEFIX-3 (the Wrong pad moves above the hip)" = PF3 item 16 [G], moved to 3b and not built | B | PF4: the "Pad height" close-up geometry |
| dumbbell_shrug | lb03 | AP | "to LIB-PLATEFIX-3 (round-2 L1)". PF3 ruled "4. dumbbell_shrug: no change … the panel judges" (6684669717). It was not among pf7's 32 changed plates, so not re-judged | A2 | round-2 check as drawn |
| smith_machine_bench_press | pilot-b | AP | "L5 routed to LIB-PLATEFIX-3 (a head-end inset)". Built as 3b item 22, approved after D-PF3B-INSETRING (6705141445); owner re-pin on main | A↑ | its card parent is barbell_bench_press (B). Layers check once bbp ships |

### W5 (lb04, lb05): D-SHIP-W5-FLIPSET table, main LIB-SHIP-DESIGN.md "W5. Flip set"
| id | batch | stage | why | class | unblock |
|---|---|---|---|---|---|
| goblet_squat | lb04 | AP | "S3 (Q-W5-7)": thumb, wrist and way-out. RESEARCH-ROUTES part 2: "goblet_squat stay[s] held" | C/D | a new source, or a ruled route (GAP by ruling 8 or a convention); else the owner's later-update list |
| jump_squat | lb04 | AP | "box_jump held, plate.frames unruled (Q-W5-2)". PF3 item 6 was approved in pf8 | C | a research edit that drops `plate.frames` from inherit[] (F-LB1-SETUP form, as Q-W7-9 freed reverse_crunch); or ship it with box_jump |
| wall_sit | lb04 | AP | "LIB-PLATEFIX-3 (6654466055)". PF3 item 7 approved in pf7 | A | layers check |
| pistol_squat | lb04 | AP | "LIB-PLATEFIX-3 … item 2". PF3 item 5 approved in pf7 | A | layers check |
| step_up | lb04 | AP | same route. PF3 item 4 approved in pf8 | A | layers check |
| forward_lunge | lb04 | AP | "parent reverse_lunge in #385". It shipped (train 77) | A | delta check |
| walking_lunge | lb04 | AP | same | A | delta check |
| bulgarian_split_squat | lb04 | AP | "parent in #385; Mistake overlay LIB-PLATEFIX-3". PF3 item 3 approved in pf8 | A | layers check |
| cable_curl | lb05 | AP | PF3 held after pf8: "R5 [4,3,3] (a 19° elbow bend reads as locked) and R11 [3,3,2] (the ring is too big)" | B | PF4: elbow ring r≈30, about 3.4x (pf8 fix); poses kept |
| bayesian_cable_curl | lb05 | AP | PF3 item 9 approved in pf7 | A | layers check |
| concentration_curl | lb05 | AP | "Q1 (F-CARD-CONCCURL-RISK)". The research card merged (#403), but PF3 item 12 was "not built … stays staged; later-update list" (6684669717) | B | PF4: the same hinge in Right and Wrong at 32° (6683313760 ruling 12) |
| dumbbell_overhead_triceps_extension | lb05 | AP | PF3 item 14 approved in pf7 | A | layers check |
| cross_body_hammer_curl | lb05 | AP | PF3 item 8 approved in pf7 | A | layers check |
| wrist_curl | lb05 | AP | PF3 item 11: "wrist_curl unchanged" was accepted as built. Its hand close-up goes to **F-HAND-FINGERTIP**. "The plates panel and the layers check decide whether wrist_curl ships without it." Neither has run | A2 | check as drawn. If it fails: F-HAND-FINGERTIP or a wrist zoom (B) |
| single_arm_triceps_pushdown | lb05 | AP | "parent triceps_pushdown in #385". It shipped (train 77) | A | delta check |
| incline_dumbbell_curl | lb05 | AP | PF3 item 13: "no change … The plates panel re-judges R2. If it fails again, the id is held." It is not in pf7 or pf8, so not re-judged (unverified) | A2 | R2 re-judged as drawn, then a layers check |
| straight_bar_triceps_pushdown | lb05 | AP | "parent … in #385; straight_bar also H10 (#395)". D-SHIP-W5-H10: "#385 head … PQ-H10 red on 6 fragments". D-PF2-PUSHDOWN-T (the re-clone) is not on main (grep) | B (unverified) | re-clone the PUSHDOWN template from PF1's approved parent, run the plates check, then the layers check. If H10 already passes on main, this row is A |

### W6 (lb06, lb07): 16 at AP in the lane, Q on main
| id | batch | why | class | unblock |
|---|---|---|---|---|
| smith_machine_incline_press | lb06 | "staged (Q-W6-9)": card parent incline_barbell_bench_press, which is held under D-PF3B-HOLD15 | B (via parent) | after incline_bb: the leaf table and a layers check |
| cable_chest_press | lb06 | D-SHIP-W6-BACKREACH is now met (main's back box appliesTo has it, 56 ids). Waiting for the PF3 recheck: PF3 "8 … cable_chest_press: no change … The recheck judges each id as drawn" (6684669717). L5 [2,3,2] (locked arm), L1 back close-up | A2 (high risk) | recheck as drawn, or PF4's faded-Right-under-solid-Wrong option |
| low_to_high_cable_fly | lb06 | **D-PF3B-LTHHOLD**: "a front view cannot show the reach"; **F-LTH-VIEW** | B | PF4: a side or 3/4 view, or the trunk close-up as a side view; one "press" tell |
| high_to_low_cable_fly | lb06 | PF3 held after pf8: "R5 … crossed hands are still a tangle. R4 … share one leader stub" | B | PF4: red forearms as an X below the solid fists; SOFT ELBOWS gets its own leader |
| machine_pullover | lb06 | PF3 held after pf8: "R4 [2,2,2] (the leader ends on the frame post), R5 and R11" | B | PF4: leader to the pivot hub; head 25-30 px off the pad; zoom ring on the lumbar gap |
| rear_delt_fly | lb06 | PF3 held after pf8: "R5 … R11 …, the shrug still reads only through the arrows". L4 is a recorded exception (D-BODYMAP-NOCUFF) | B | PF4: shoulder contour raised toward the jaw; source ring on jaw, neck and shoulder |
| smith_machine_shoulder_press | lb06 | BACKREACH is met. "E4 and smith_machine_shoulder_press: yes, to PLATEFIX-3b with the head-end inset" (6683319630), but it is not in 3b's plan | B | PF4: a head-end inset (`project: 'head'`, on main since 3b) |
| smith_machine_squat | lb06 | pf9: "R3 [3,4,2] regressed (forearm and hand off the bar) → HELD" (#405 6689821636) | B | PF4 fresh round: R2 rails, R3 bar on the traps, R5 fault leg on top |
| hip_abduction | lb06 | PF3 "5 … no amplitude change"; the recheck judges it as drawn. L5 range close-up [3,3,4] | A2 | recheck as drawn |
| hip_adduction | lb06 | the same, plus L7 framing → **F-PLATE-CROP** (6684669717 item 17). L5 start-width close-up [3,3,3] | B | PF4: library crop; close-up contrast |
| bench_dip | lb07 | "held (S3)" Q-W6-5, F-CARD-BENCHDIP-HAND. RESEARCH-ROUTES part 2: stays held | C/D | a new source or a ruled convention; else the later-update list |
| cable_external_rotation | lb07 | waiting for the PF3 recheck (6683879377). L4 is a recorded exception. PF3's addendum has no CER item, so nothing was built. L5 torso-twist close-up [2,2,2] | A2 (high risk) | recheck as drawn, or a PF4 close-up twist (shoulders turned against the hips) |
| diamond_push_up | lb07 | PF3 "7 … no change" (6684669717). L5 shoulder-blade close-up [2,2,2]; L1 | A2 (high risk) | recheck as drawn, or a PF4 close-up redraw |
| renegade_row | lb07 | "held (S3)" Q-W6-6, F-CARD-RENEGADE-HAND plus way-out; research part 2: stays held | C/D | as bench_dip |
| resistance_band_pull_apart | lb07 | BACKREACH is met. PF3 "3. resistance_band_pull_apart: to 3b, with #395's `focus`" (6684669717), but it is not in 3b's plan. L5 [2,2,2] | B | PF4: the `focus` posture zoom, with the ring between shoulder and ear (item-8 form); elbow view (E4) |
| weighted_dip | lb07 | PF3 "6 … no change" (the bars were not raised). L5 shoulders close-up [3,4,3]. Way-out is a recorded LIB-WAYOUT gap | A2 | recheck as drawn |

### W7 (lb08-lb10): 10 at AP in the lane, Q on main (derived from §0)
| id | batch | why | class | unblock |
|---|---|---|---|---|
| battle_ropes | lb10 | **D-SHIP-W7-ROPES**: "held until the owner answers: grip as text only, or a later update" | D | the owner, or the supervisor applying Q-W7-2's recommended option (b) under D-OWNER-RECOMMENDED. That is the supervisor's call, and it is unverified that the rule covers this case |
| side_plank | lb09 | "side_plank is HELD … The fix is a raised bottom shoulder with a shorter neck gap in the Wrong panel" (#394 6688202259, D-LIB13-PANEL2) | B | PF4 close-up (E3 shrug), fresh round |
| jump_rope | lb10 | **D-PFR-JUMPROPE** (6701937875): L7 missing hand zoom and grip; the L7 Mistake figure "drawn about 165 px to the side"; L4 Wrists row marks nothing. **F-JUMPROPE-HAND** | B | PF4: Mistake overlay; the lane adds the hand zoom, grip section and wrist row |
| v_up | lb09 | **D-PF3B-HOLDVUP**: "v_up L7 again, L1, R4"; **F-VUP-V** | B | PF4: the V as a full dashed figure (needs the engine option for the pose swap); leader to the underside; F-PLATE-CROP |
| burpee | lb10 | PF3 held after pf8: "R5 [2,2,2], the stiff landing is within about 12 px of the soft one". The pose swap "fails PQ-H1" | B | PF4: a 30° soft-landing knee; the Wrong as dashed straight legs, offset |
| pendulum_squat | lb08 | PF3 held after pf8: "R6 … the Trace is a 45 px knee stub. It needs the research card edit to `plate.frames`" | B + C | research edit, then PF4: the Trace as a pendulum arc about the pivot |
| hack_squat | lb08 | D-SHIP-W7-ROUTE: "Recheck after PLATEFIX-3 delivers". PF3 did not change it. Its addendum [M][E] (a wedge between pad and lower back; E3 guide lines) "the W7 lane builds … after this PR merges". L5 knee-lockout close-up [2,2,3] | B | PF4/E3: the Mistake wedge and the close-up lockout contrast |
| superman | lb09 | L7 framing → **F-PLATE-CROP** (6684669717 item 17) | B | PF4: library crop |
| wall_ball | lb10 | "13 … wall_ball tilt: no change". L8: the wall-distance close-up clips the Wrong and does not tilt it | B | PF4/close-up: Wrong trunk ≥ 45° near the Right, inside the panel |
| jumping_jacks | lb10 | "14. jumping_jacks: the knee zoom and toe arrows are W7-lane work (#394). The plate stance stays." L1 [3,4,3]: legs drawn straight under SOFT KNEES. L5: the toes Wrong. E1 and E2 merged in PF3 | B | close-up knee zoom (soft vs locked); toe Wrong turned 30-45° |

## 2. Counts

| class | rows | ids |
|---|---|---|
| A | 21 | pec_fly, barbell_overhead_press, mountain_climbers, seated_leg_curl, crunch, underhand_lat_pulldown, assisted_pull_up, dumbbell_pullover, dumbbell_romanian_deadlift, conventional_deadlift, sumo_deadlift, wall_sit, pistol_squat, step_up, forward_lunge, walking_lunge, bulgarian_split_squat, bayesian_cable_curl, dumbbell_overhead_triceps_extension, cross_body_hammer_curl, single_arm_triceps_pushdown |
| A2 | 8 | dumbbell_shrug, wrist_curl, incline_dumbbell_curl, cable_chest_press, hip_abduction, cable_external_rotation, diamond_push_up, weighted_dip |
| A↑ | 2 | close_grip_bench_press, smith_machine_bench_press (both wait for barbell_bench_press) |
| B | 31 | 30 own fixes + smith_machine_incline_press (via its parent incline_bb). straight_bar's B is unverified |
| C | 3 | arnold_press, skull_crusher (LIB-WAYOUT), jump_squat (plate.frames route) |
| C/D | 4 | box_jump, goblet_squat, bench_dip, renegade_row (S3; research part 2 found no source) |
| D | 1 (+11) | battle_ropes, plus the 11 named-list rows |

**If A, A2, A↑ and B are all done:** 72 + 21 + 8 + 2 + 31 = **134**. Every A2 row lands either way: it passes as drawn, or it fails and its fix goes to PF4. The last **8 rows to 142** are C, C/D and D: arnold_press, skull_crusher, jump_squat, box_jump, goblet_squat, bench_dip, renegade_row and battle_ropes. Each needs a research result or a ruling (or the owner, for battle_ropes and box_jump's new box text). **142 cannot be reached by plate work alone.** Start those 8 routes now, alongside W8.

## 3. Proposal

### W8: the A rows (21), plus the 3 mild A2 rows and the 2 A↑ rows once bbp lands
Each id whose plate changed since its last layers check (all except forward_lunge, walking_lunge, single_arm_triceps_pushdown and dumbbell_romanian_deadlift) gets a **layers check of its sheet in the D-PFC-ROUND1 form**: that check counts as round 1, then one fix round, and a second failure means a hold (D-LIB13-PANEL2). pfc found sheet faults on 6 of 8 such sheets, so budget for a fix round. The 4 with unchanged plates get the W5-FLIPSET delta check ("return with a delta check in their wave").

| lane | page(s) | ids | notes |
|---|---|---|---|
| W8a (shared pinned pages) | pilot-a, pilot-b, pilot-b2 layers; lb01 layers | pec_fly, barbell_overhead_press, mountain_climbers (sheet fix L4/L7), seated_leg_curl, crunch, underhand_lat_pulldown, assisted_pull_up | every page is pinned on main, so each re-pin is an appended superseding entry: `'supervisor'` point 4 for layers-page, D-BODYMAP-APPEND. pec_fly carries F-PECFLY-FEELROW |
| W8b | lb02 (new first layers page), lb03, lb04, lb05 layers | dumbbell_pullover; dumbbell_romanian_deadlift, conventional_deadlift → sumo_deadlift (same head, parent first), dumbbell_shrug (A2); wall_sit, pistol_squat, step_up, forward_lunge, walking_lunge, bulgarian_split_squat; bayesian_cable_curl, dumbbell_overhead_triceps_extension, cross_body_hammer_curl, single_arm_triceps_pushdown, wrist_curl (A2), incline_dumbbell_curl (A2) | lb03, lb04 and lb05 have layers pages on main (supersede); lb02 starts its chain. jump_squat stays staged until its C route lands |
| W8c (after W6 merges) | lb06, lb07 layers | A2: cable_chest_press, hip_abduction, cable_external_rotation, diamond_push_up, weighted_dip | **Recommendation:** do not spend their last round on unchanged drawings that scored [2,2,2]/[2,3,2] (CER, diamond, cable_chest_press). Send their close-up redraws into PF4 group 1, then check them. hip_abduction [3,3,4] and weighted_dip [3,4,3] can be checked as drawn. This is the supervisor's choice: the standing ruling says "the recheck judges each id as drawn" |

The merge order stays W6 → W7 → W8a → W8b → W8c (strict order). W8 lanes can build ahead under D-OWNER-PARALLEL.

### PLATEFIX-4: the B rows (31), grouped by engine or feature
Card form: LIB-PLATEFIX-3. Each held id starts a **fresh round 1**, citing the F-FLY-START precedent (dumbbell_fly was given "a fresh round 1 in PILOT-A3"). After its plates panel, run a layers check of every sheet that shows the plate.

1. **Close-up geometry (`pages/<batch>.closeups.mjs`; dropped from 3b):** barbell_bench_press hips-lifted multi-joint pose (item 19; **do it first**, because it unblocks close_grip, decline, incline_bb, smith_machine_bench_press and smith_machine_incline_press); decline_bench_press feet-loose (item 21); incline_dumbbell_press bench-angle panel (item 20); back_extension pad height (item 16); hack_squat knee lockout plus the Mistake wedge (E3); jumping_jacks knee zoom and toes; wall_ball wall-distance tilt and clip; side_plank raised shoulder; and the W8c A2 fallbacks (CER twist, diamond blades, cable_chest_press back, hip_adduction width).
2. **Head-end inset (`project: 'head'`, on main):** incline_barbell_bench_press (F-INCLINE-INSET: source ring as D-PF3B-INSETRING, R7 label), smith_machine_shoulder_press (E4).
3. **Views and posture zooms (#395 `focus`, E4 top or side views):** low_to_high_cable_fly (F-LTH-VIEW), resistance_band_pull_apart, rear_delt_fly, bent_over_dumbbell_rear_delt_fly (option (a)).
4. **Spec poses and Mistake overlays [P][M]:** one_arm_dumbbell_row, burpee, machine_pullover, high_to_low_cable_fly, cable_curl (ring only), smith_machine_squat, concentration_curl (item 12), dumbbell_fly, v_up (F-VUP-V; engine pose-swap option), jump_rope Mistake overlay, pendulum_squat Trace (after the plate.frames research edit), straight_bar re-clone (D-PF2-PUSHDOWN-T, if H10 is red).
5. **Framing (F-PLATE-CROP, a library crop; "new engine work"):** superman, hip_adduction (and v_up).
6. **Hands lane (separate cards, not in PF4):** F-HAND-MACHINEPUSH (incline_machine_press, shoulder_press), F-JUMPROPE-HAND (sheet hand zoom, grip, wrist row), F-HAND-FINGERTIP (wrist_curl, only if A2 fails).

Split as PF3 did: PF4 (groups 1, 4, 5) and PF4b (groups 2 and 3, the engine-view work), so the slow engine items do not hold the rest.

### C and D routes (start now; they gate the last 8)
- RESEARCH-ROUTES-4:
  - LIB-WAYOUT sources for arnold_press and skull_crusher;
  - jump_squat and pendulum_squat `plate.frames` inherit edits;
  - a new search for goblet_squat, bench_dip and renegade_row;
  - box_jump's ankle red-flag box from c14.
- Supervisor rulings:
  - battle_ropes: Q-W7-2 option (b) under D-OWNER-RECOMMENDED, or ask the owner;
  - box_jump's box text approval.
- Fallback for each: a GAP by ruling 8, or a convention (D-SHIP-HANDW* form). If neither works, the row cannot meet 142 and goes to the owner as a choice.

## 4. Risks and mitigations
1. **The 142 rides on the 8 C/D rows.** Any of them holding (no source, owner says later) makes 142 unreachable. Mitigation: run their routes in parallel now. Give the owner the honest ceiling (134 + whatever C/D lands) at the next APK.
2. **Last rounds already spent.** D-LIB13-PANEL2 has held 15 rows after two fails. Fresh round 1 in a new card is precedent (F-FLY-START), but each fresh panel can fail again. Mitigation: build to the pf8 critics' exact fixes; run one PF4 panel per group.
3. **The parent bottleneck.** barbell_bench_press blocks 5 rows; incline_bb blocks smith_machine_incline_press. Mitigation: bbp's close-up is PF4's first item. If the incline inset fails again, smith_machine_incline_press fails with it.
4. **Shared pinned pages.** W8a and PF4 both re-pin pilot-a/pilot-b/lb01-lb05 pages. Mitigation: D-PLATEFIX-SECOND (the second to merge rebuilds twice, appends, and runs cardcmp). Keep W8 to sheets, and PF4 to unshipped plates and their close-ups.
5. **CI walk time.** library-ci C4 363 s, library-rows FEEL 377 s and lib7b A2 309 s run under 600 s limits and grow with every row. +29-62 rows will pass the limits. Mitigation: F-GEN-WALK-SPEED lands before W8, as the supervisor already planned.
6. **W7 housekeeping.** W7 must still add the `left-out:D-OWNER-LIB142` rows for overhead_cable_triceps_extension and cable_rear_delt_fly to lb05.json/lb07.json after W6 merges (Q-W7-7). They are `queued` in the W7 lane today.
7. **Unverified points:** the W7 19-id list (derived); the exact scope of F-PECFLY-FEELROW; straight_bar's H10 on main; whether incline_dumbbell_curl, wrist_curl and dumbbell_shrug were ever re-judged (none was found in pf7, pf8 or pf10); whether D-OWNER-RECOMMENDED covers battle_ropes and box_jump's box text.
