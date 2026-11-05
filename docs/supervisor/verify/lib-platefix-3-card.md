# LIB-PLATEFIX-3: plate faults found in the wave panels

Status `ready` (supervisor, 11-05 ~08:45 UTC). Base: latest origin/main; branch `claude/lib-platefix-3`. Model: Opus. Form: LIB-PLATEFIX-1 and -2 (plate fixes, plates panel, then a layers check of the sheets that use the plates).

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
| W4 items | lb02/lb03 | the list the W4 PANEL FIX post gives | #391 |

## Rules
- Fix only the listed elements. Each change cites its claim and gets a red-before, green-after test.
- Pins move only in `[golden update]` commits (D-CROP-PIN), with old and new shas listed.
- Authoring QA and the hard checks pass, and the flags equal EXPECTED.
- A plates panel (calibrated, R1-R11) runs on every changed plate. Then a layers check runs on the sheets that show it. An item that fails twice is held (D-LIB13-PANEL2).
- Never: sheets beyond the listed alt or tell text, cards, vendor, CI, or golden B.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Post `LIB-PLATEFIX-3 PLAN @ <sha>` on a draft PR, with the measured current and target values per item. Wait for the ruling.
2. Build in item order. Post `PLATES READY @ <sha>` with the plates page shas.
