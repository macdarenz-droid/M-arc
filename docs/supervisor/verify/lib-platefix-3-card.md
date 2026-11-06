# LIB-PLATEFIX-3: plate faults found in the wave panels

Status `ready` (supervisor, 11-05 ~08:45 UTC; W4 rows 11-06). Base: latest origin/main; branch `claude/lib-platefix-3`. Model: Opus. Form: LIB-PLATEFIX-1 and -2 (plate fixes, plates panel, then a layers check of the sheets that use the plates).

## Items (each id waits for this card; the wave posts give the critics' places and fixes)
| id | plate | fault | source |
|---|---|---|---|
| underhand_lat_pulldown | LB1 | the end pose has the elbow in front of the trunk; it must be down and back (c6); the leader ends on the shoulder | #384 6648454032 |
| assisted_pull_up | LB1 | Mistake ARMS BENT does not read: draw the whole bent arm (elbow about 90°) above the solid layer, clearly apart from the hang; failed R5 twice | #384 6653062201 |
| cross_body_hammer_curl | lb5 | Mistake shrug about 13 px: use the smallest value the panel can read, within plausible shoulder elevation (ruling 2 in 6652647984); merge the shrug and ear tells; end near the opposite shoulder (c2) | #392 |
| bayesian_cable_curl | lb5 | the "Upper arm about 45°" arc goes at the shoulder, measured against a vertical (c3); the Mistake cable twin ends at the dashed handle | #392 |
| cable_curl | lb5 | Right bottom bend about 20° (c13); offset the Mistake pose; drop the cable zigzag | #392 |
| wrist_curl | lb5 | scale and frame so the wrist reads; add the card's hand close-up (c5) on the sheet | #392 |
| bulgarian_split_squat | lb4 | the Mistake overlay: knee flat on the floor, hips lower (c3, c8) | #392 |
| step_up | lb4 | the trace starts at the start hip and goes up onto the box (c4) | #392 |
| pistol_squat | lb4 | drop the "Knee forward" tell (K1, p8). It needs a tell-set and deviation change. | #392 30b0ea6f note |
| jump_squat (staged) | lb4 | one open hip path, back then down; the "Hips high" cue is j5-unsupported | #392 |
| concentration_curl (staged) | lb5 | Right and Wrong hinge the same (c1, c2) | #392 |
| barbell_overhead_press | pilot-a | keep the FOREARMS VERTICAL pill and drop the duplicate measure label; draw the start-pose forearm clearly; draw the head clear of the lockout arm (c5, c6) | #385 PLATEFIX second recheck |
| incline_dumbbell_curl | lb5 | the incline back pad stops in mid-air on its own post; extend it along its line to meet the seat (equipment, R2 [3,3,5]) | #392 W5 recheck plates |
| dumbbell_overhead_triceps_extension | lb5 | the Mistake BACK ARCHES barely changes the back outline: draw a clearly deeper dashed lumbar curve behind the solid back, ribcage tipped back | #392 W5 recheck |
| wall_sit | lb4 | two 90° labels: the "90 DEGREES" checkpoint becomes "HIPS about 90°" with its leader on the hip crease (w2), or is removed | #392 W5 recheck |
| incline_barbell_bench_press | lb02 | plate Mistake: the flared elbow is a knot on the shoulder (R5 [2,2,3]); draw a full red dashed upper arm out from the shoulder; layers L5 (elbow overlay) and L7 (duplicate "BENCH AT 30°"/"BENCH 30°" labels) | #391 6682615402, 6653791551 |
| smith_machine_bench_press | pilot-b | elbow flare does not read in side view (L5 [3,3,3]): a head-end inset or close-up, Right about 45° vs Wrong level with the shoulders (c3, c7) | #391 6682615402 |
| back_extension | lb03 | Pad height Wrong: the pad must sit above the hip, on the belly (c2); Right below the hip crease (c1) (L5 [3,3,3]) | #391 6682615402 |
| sumo_deadlift (staged) | lb03 | start trunk visibly more upright than conventional (c4, c13): hips closer to the bar, chest up (L1 [3,3,3]); higher hips Mistake follows it | #391 6682615402, 6653791551 |
| landmine_row, t_bar_row | lb03 | none now: both passed the W4 recheck (6682615402) | — |
| dumbbell_pullover | lb02 | the body map has no inner-elbow part (L4): goes with F-BODYMAP-FRONTDELT (same file) | #391 6653791551 |
| barbell_bench_press | pilot-a | L7 Hand gap-ruled (HANDW4); hips-lifted close-up needs a multi-joint pose | #391 6653791551 |
| incline_dumbbell_press | lb02 | plate Mistake overlay (L5); L7 Hand (HANDW2) and the bench-angle panel geometry | #391 6653791551 |
| decline_bench_press | lb02 | L7 Hand, and the feet-loose geometry | #391 6653791551 |
| W6 and W7 items | lb06-lb10 | the lists their PANEL FIX posts give | #393, #394 |

## Rules
- Fix only the listed elements. Each change cites its claim and gets a red-before, green-after test.
- Pins move only in `[golden update]` commits (D-CROP-PIN), with old and new shas listed.
- Authoring QA and the hard checks pass, and the flags equal EXPECTED.
- A plates panel (calibrated, R1-R11) runs on every changed plate. Then a layers check runs on the sheets that show it. An item that fails twice is held (D-LIB13-PANEL2).
- Never: sheets beyond the listed alt or tell text, cards, vendor, CI, or golden B.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Post `LIB-PLATEFIX-3 PLAN @ <sha>` on a draft PR, with the measured current and target values per item. Wait for the ruling.
2. Build in item order. Post `PLATES READY @ <sha>` with the plates page shas.

## Pins (supervisor 11-06)
- A plate whose earlier entry exists only in an unmerged wave chain is re-pinned in place there by the wave (D-REPIN-UNMERGED). Once a wave has merged, a changed plate needs a superseding entry, which is `'owner'` with his words (D-LIB-O5 point 5). The supervisor posts his words on this PR when they exist. Until then, build and panel the fixes, and hold only the pin commit.

