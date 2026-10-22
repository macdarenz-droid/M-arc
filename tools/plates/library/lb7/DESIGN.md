# LB7 H plates: design note (LIB-17)

Card: `docs/supervisor/verify/lib-17-card.md` on `claude/sup-lib4-cards` @ `0fb82c0e` (Do 1), with its D-LIB17-*
rulings and lib4-cards sections 12-31. Plan: `claude/howto-options` @ `b41ac833`. Research: the LB7 research head
`8d750bfe0dd9863862da88761268505d0089f5b2` on `claude/libht-research` (LB7 merge `6d253b9e`, #288: LR-29 VALID on all
13); the 9 cards and quotes are byte copies from it (`lb7/cards.sha.json`). Census: `docs/howto/library/inputs/census.json`
@ `4a9fd86`. Patterns copied from LB3 (#274 @ `a6f4bd07`) and LB6 (#297); pilot A (#109 @ `ff7c5c4f`) is read only.
Base: main `66ff5500`.

Nothing here ships (D-LIB17-AHEAD): every LB7 row stays at stage `drawing` or `review` in `lb7/rows.json`, outside
`batches/`; `tests/howto/lb7-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids with tempo
seconds (A5; D-LIB17-SECS keeps cable_rear_delt_fly and renegade_row off it).

Measured values below marked **measured** are the engine's, node side (renderPlate report, qa/node.mjs `deviation` and
the Trace path length) at this head; QA evidence comes only after Do 6's verdict (Do 2).

## 1. Engine and modes

- **Engine.** Every LB7 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE).
  Specs copy code from the 8 on main and from pilot A and LB3 heads with `git show`; they never import a spec
  (D-LIB9-CLONE; A3 tests it). Every copied root finder throws on a bracket with no root (cable_lateral_raise's `solve`,
  bracket -60..0 deg, solves END_ROT = -26.2 deg), and renegade_row's copied Newton solve throws when it does not
  converge or meets a singular step.
- **Modes: all nine are H; no D row** (plan 6.2 :716 "H10", :749-752 no mark). A D spec is its parent with only PARAMS
  paths set (derive.mjs:4-12: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness,
  stance.width), and of those the vendor engine reads only `spec.camera` (vendor/engine/plate.mjs:81-95). The census
  closest of five ids, dumbbell_lateral_raise, has no spec at all (ref-src; D-LIB17-CLONE), so none of those five has a
  parent spec to derive from. What each id needs outside PARAMS (each alone makes it H; plan 3.1:272):

| id | census closest | outside PARAMS |
|---|---|---|
| cable_lateral_raise | dumbbell_lateral_raise (ref-src, no spec) | no engine parent; equipment: a cable column with a low pulley and one single handle (c1), not two dumbbells; one arm (c2); tempo 2/2/1 (c22, c23), not the parent's |
| dumbbell_front_raise | dumbbell_lateral_raise (ref-src, no spec) | no engine parent; view side, not front (card plate.view); motion: shoulder flexion forward (c5, c8), not abduction; Mistake: the hip swing (c12), not the shrug |
| cable_rear_delt_fly | dumbbell_lateral_raise (N, ref-src) | no engine parent; equipment: a crossover with two high pulleys and crossed cables (c1, c2); motion: horizontal abduction from straight ahead (c4, c6); no tempo seconds |
| face_pull | seated_cable_row | pose class: standing, not seated; equipment: a rope (main's eq/rope.mjs) on a pulley at head height (c1), not the V-handle at the feet; motion: the pull to the face with the elbows high (c5, c7); tempo 2/3/1 (c16, c17) |
| cable_external_rotation | dumbbell_lateral_raise (N, ref-src) | no engine parent; equipment: a cable column and one handle (c1); motion: the shoulder's rotation (body.mjs:60) about a still upper arm (c3, c5) |
| resistance_band_pull_apart | dumbbell_lateral_raise (N, ref-src) | no engine parent; equipment: a band between the fists (c1), which no primitive or parent draws; motion: horizontal abduction from in front (c4, c5) |
| renegade_row | seated_cable_row (N) | pose class: the plank (census byPoseTag.plank), not seated; equipment: two hex dumbbells on the floor (c6); one-arm row; no tempo seconds |
| weighted_dip | pull_up (N) | pose class: the support (census byPoseTag.support), not hanging; equipment: `dipBars` (census gap), belt, chain and plate (c8); motion: the elbows bend with the hands fixed below (c4); tempo 1/2/0 (c4, c9) |
| bench_dip | machine_chest_press (N) | pose class: the support, not seated; equipment: a flat bench behind (c1), not the press; hands flat (c2); tempo 1/2/1 (c16, c17) |

- **D test (Do 3).** No id here could meet it: each needs a pose class, equipment or motion its census closest does
  not have, and five have no parent spec. No reason found to post for a D row.

## 2. Per id

| id | tier | view | mode | clone source (D-LIB17-CLONE) | composer / primitives | hand (merge_prerequisites; drawn) |
|---|---|---|---|---|---|---|
| cable_lateral_raise | C | front | H | upright_row (#109; the engine front view: stance and shoulder datum; no arc, it sat on the Trace's path); the 8's cable code (cableColumn) | vendor cableColumn, floor; single handle from `poly` (D-LIB17-HANDLE) | hand-d-handle GAP on main (hand-d-handle.mjs:27-29); fist drawn |
| dumbbell_front_raise | C | side | H | dumbbell_biceps_curl (#109; the engine dumbbell, the standing side view) | vendor dumbbell, floor | 'hold': in no key (census-scope.json:31); fist drawn |
| cable_rear_delt_fly | C | front | H | upright_row (#109); lat_pulldown and seated_cable_row (the 8) for the cable code | two vendor pulleys and cables on a crossover frame from `line`/`poly`; two single handles (D-LIB17-HANDLE) | hand-d-handle GAP (hand-d-handle.mjs:27-29); fists drawn |
| face_pull | C | side | H | seated_cable_row (the 8): the cable to the handle, the stack | main's eq/rope.mjs (anchor rope_triceps_pushdown, plan 2.1:135), vendor cableColumn, floor | hand-rope GAP (hand-rope.mjs:33); fists drawn |
| cable_external_rotation | C | front | H | upright_row (#109) | vendor cableColumn, floor; single handle from `poly` (D-LIB17-HANDLE) | hand-d-handle GAP (hand-d-handle.mjs:27-29); fist drawn |
| resistance_band_pull_apart | C | front | H | upright_row (#109) | the band from `poly` in the spec (D-LIB17-BAND), floor | hand-band GAP (hand-band.mjs:6); fists drawn |
| renegade_row | A | side | H | plank (#109) for the straight-body solve and datum; seated_cable_row (the 8) for the row; dumbbell_biceps_curl (#109) for the engine dumbbell | two vendor dumbbells; the Mistake's turned hex from `poly`; floor | palm-flat GAP on #191 (hand-palm-flat.mjs:30-31); card hand null; fists on the handles |
| weighted_dip | A | side | H | pull_up (the 8): the hanging feet, the shoulders down and back, the bend arc; one_arm_dumbbell_row (#274) for the support arm | **dipBars** (new, slice); belt, chain and plate from `poly` in the spec (D-LIB17-DIP); floor | hand-dip-bar GAP on #191 (hand-dip-bar.mjs:4); fists on the bars |
| bench_dip | B | side | H | machine_chest_press (the 8): the seat-height reference and the end bend; one_arm_dumbbell_row (#274) for the flat palm on a bench | vendor bench, floor | palm-flat GAP on #191 (hand-palm-flat.mjs:30-31); flat palms (the engine's LIB-26 hand) |

The 5 LB7 ids not drawn here (lib-17-card "LB7 ids"):

| id | reason |
|---|---|
| push_up | pilot B's plate (P:PUSHUP), reused as pilot B pins it (D-LIB10-PA's pattern) |
| incline_push_up, pike_push_up, diamond_push_up | T rows: PUSHUP children, which cannot start before push_up is pinned (D-LIB10-TEMPLATES; plan 3.1:293-294) |
| bent_over_dumbbell_rear_delt_fly | pilot A's plate, held on pilot A ("needs a front-view bent-over torso", pilot-a/MERGE.md:29 @ `ff7c5c4f`), route LIB-20's volume trunk (plan 2.4) |

## 3. Composer `dipBars` (Do 4; D-LIB17-COMPOSERS, -DIP)

`eq/dipBars.mjs`, single use (weighted_dip, its anchor; plan 2.1:129-130, :141), landing in this PR. A function of
world numbers returning PRIMITIVES items only (`backPad` as a straight bar through eq/parts.mjs `sideBar`, class `eq`
with `poly`), in LB3's romanChair pattern, with no file reads; the spec takes it through `perItem(fn, DIP_BARS_ITEMS)`.

- Parts (card plate.equipment "Parallel dip bars on a frame", c1, c2): two parallel bars at the hands' width
  (x = +-BAR_X), seen from the side, where the near bar covers the far one; an upright under each bar behind the
  lifter, the bars running forward from it (a dip tower: the frame stays clear of the hanging body in every pose); a
  floor beam under each upright.
- z: the far bar, both uprights and both floor beams `back`; the near bar `mid` (in front of the trunk and near leg,
  behind the near arm), so the near fist closes over it.
- Static: every part sits at one place in start, end and Mistake (A2). The belt, chain and plate move with the body,
  so the spec draws them as `poly`, not the composer (D-LIB17-DIP).
- Sizes (`lb7/sizes.json` `dipBars`, exported as `DIP_BARS`): bar tube 4.5 cm, bars 60 cm, uprights 6 cm and 12 cm
  above the bars, floor beams 6 cm from 15 cm behind to 95 cm in front of the uprights; bar height and width are
  the spec's (BAR_Y, BAR_X).

## 4. Single handles, the band, the rope and the cables (D-LIB17-HANDLE, -BAND, -CABLE)

- **Single handles** (cable_lateral_raise, cable_external_rotation; cable_rear_delt_fly one per hand): drawn in each
  spec from `poly`, never from #245's eq/dHandle.mjs or LB5's or LB6's spec handles (read as patterns). The grip bar
  runs along the fist's grip axis: vertical in cable_external_rotation (the forearm level, thumb up), front to back in
  cable_lateral_raise (the hanging and raised neutral grip, seen end-on inside the fist, so only the strap shows); the
  strap runs from both grip ends to the ring HANDLE_STRAP (10 cm, the convention dHandle.mjs:4-5 states) toward the
  pulley. Every handle part is a `poly` (drawn in the Mistake view). If #245 lands first, a switch to main's handle is
  a separate step with a pixel diff (not needed for READY).
- **The band** (resistance_band_pull_apart, bulk): a `poly` strip from fist to fist in the front view, in front of the
  chest at shoulder height (c1, c5), its thickness and class citing band.mjs:8-9 @ `9e5d9666` as a convention
  (sizes.json at the bulk). It moves between the end pose and the Mistake, so it is a `poly` (PQ-H9). band.mjs is never
  imported, copied or forked; after #245 is on main a separate step tries main's composer unedited.
- **The rope** (face_pull, bulk): main's eq/rope.mjs through `perItem(rope, ROPE_ITEMS)`, unedited. If it cannot draw
  the rope ends apart near the ears with the elbows high (c5-c7), the renders are posted and the fix is ruled for the
  rope's owner card.
- **Cables** (D-LIB17-CABLE): cable_lateral_raise from the low pulley across the front of the body to the outside hand
  (c5; notes "drawn in front"); cable_external_rotation from the elbow-height pulley across the front of the stomach
  (c6); both are the vendor cableColumn's cable (z `center`: above the body layer in the front view, under the arm
  when it is drawn ahead), from the pulley to the handle's ring in every pose. The stack stays at the end pose's lift in
  the Mistake (only the fault changes there). In the Mistake pose a thin `poly` twin of the cable runs from the pulley
  rim to the Mistake ring (the column's cable is a line, which the Mistake view never redraws; DRAWING-GUIDE.md 4):
  cable_lateral_raise's twin is long and reads loud on the Mistake plate (slice renders); it is card truth ("from its
  pulley to the handle in every pose"). No cable crosses the head outline. cable_rear_delt_fly (bulk): two cables from
  the high pulleys, crossed in front at eye level at the start (c2, c4), ending at the hands in front of the face
  (the card's own start). Drawn (bulk): the start crossing is solved to the ear's height (START_ELEV 106 deg). At the
  end (arms out to the sides, c6, c7) the crossed cables from the high pulleys still meet in front of the face and run
  across the head outline in the front view; that is the card's path (crossed cables, high pulleys, c1, c2), never
  moved off it (D-LIB17-CABLE), and posted with the renders for the supervisor. The cables also close over both
  shoulder tops, so the three callouts and two tells anchored at the shoulders meet the arm's underside from the open
  space below it (no leader within 6 px of a cable). face_pull (bulk): from the head-height pulley to the rope, side view.

## 5. Pose-class and convention anchors (depends_on; D-LIB17-PILOTB)

| id | front view (upright_row) | engine dumbbell / drawable fault (dumbbell_biceps_curl) | class anchor | rig anchor |
|---|---|---|---|---|
| cable_lateral_raise | yes | | stand | single handle (none, plan 2.1:142) |
| dumbbell_front_raise | | engine dumbbell | stand | |
| cable_rear_delt_fly | yes | drawable fault (F7) | stand | single handle (none) |
| face_pull | | | stand | rope: rope_triceps_pushdown (#109) |
| cable_external_rotation | yes | drawable fault (F7) | stand | single handle (none) |
| resistance_band_pull_apart | yes | | stand | band: resistance_band_row (LB1 #245) |
| renegade_row | | engine dumbbell | **plank**: plank (pilot A) and push_up (pilot B), both before its sheet | |
| weighted_dip | | | **support**: one_arm_dumbbell_row (LB3 #274) | **dipBars**: weighted_dip itself |
| bench_dip | | drawable fault (F7) | **support**: one_arm_dumbbell_row (LB3 #274) | |

Every anchor gates the plate's sheet, not its drawing (plan 3.1:293-299). None is pinned on main yet.

## 6. Expected flags

- **F5 on every plate** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly
  3.57 only.
- **F7 on cable_rear_delt_fly, cable_external_rotation and bench_dip only** (D-LIB17-F7): drawable false; each
  topFault is the key of its handlingMistakes[0], which differs from the drawn key (section 9).
- **No F1**: every plate is drawn at a scale inside 123.9-146.3 px/m: the reference 146.29 (cable_lateral_raise,
  cable_external_rotation, renegade_row) or the engine `fit` (weighted_dip: **measured** 137.22 after the option P redraw, the bars and the top
  position's head fill the height). cable_external_rotation passes PQ-H3 at the reference scale (section 12), so
  D-LIB17-ER's F1 route does not arise.
- **No F6**: every card's plate.view equals its census view (front: cable_lateral_raise, cable_rear_delt_fly,
  cable_external_rotation, resistance_band_pull_apart; side: the other 5).
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault' (qa/node.mjs:360). Expected.
- F2 (coverage), F3 (longest leader) and F4 (boxed labels) are measured by authoring QA and posted; any raised flag
  outside this set is posted with its value and range and ruled before READY. **Measured on the slice: F2 0.579 on
  cable_lateral_raise** (range 0.191-0.549: the 2.1 m column, the cable across the body and the arm's sweep with 3
  ghosts, at the reference scale); proposed as a named flag, nothing changed to dodge it. F3 and F4 are inside their
  ranges on the three rows.

## 7. R10 items (tier A: renegade_row, weighted_dip)

R10: "the right pose never shows an unsafe setup" (PANELS.md 5). Each item is a drawn-item test (A15).

- **weighted_dip** (D-LIB17-DIP): the plate hangs low (its centre at mid-shin at the top, c8) and still: plumb under
  the belt and face-on in every pose, no swing drawn (c8); the shoulders down and back in every right pose (scapulae
  3 cm down, c3, c6); the bottom no deeper than c4 allows (elbow bend 90, upper arm level: "parallel or slightly
  below"); the torso lean at most BOTTOM_LEAN (c5 "at most a slight forward lean"); the feet clear of the floor.
- **renegade_row**: hex dumbbells (c6, c10: not round, not kettlebells), each flat on a face on the floor under its
  shoulder in the right poses (c2, c6); the wrists neutral, in line with the forearms (c9 "Keep the wrists neutral";
  wrist 0); the body one straight line head to heels (c3), the hips and shoulders level (c14).

## 8. Tempo map (D-LIB17-TEMPO; 13 Q3, 14.7, D-LIB8M-TEMPO)

Rule: the concentric takes `up`, the eccentric `down`; `Hold` takes `pause` right after the concentric only if
pause > 0; any other static phase is a constant only with a quote that states its seconds (none used). No Rest. Form:
pilot A's rows (pilot-a/tempo.json @ `ff7c5c4f`), in `lb7/tempo.json`. Order follows the drawn order (start → end).

| id | card up/down/pause (claim) | phase array |
|---|---|---|
| cable_lateral_raise | 2/2/1 (c22, c23) | `[{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` |
| dumbbell_front_raise | 1/3/1 (c19, c20) | `[{ phase: 'Raise', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 3, move: true }]` |
| face_pull | 2/3/1 (c16, c17) | `[{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 3, move: true }]` |
| cable_external_rotation | 2/2/1 (c18, c19) | `[{ phase: 'Turn out', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }]` |
| resistance_band_pull_apart | 2/2/1 (c15, c16) | `[{ phase: 'Pull apart', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }]` |
| weighted_dip | 1/2/0 (c4, c9) | `[{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }]` (the drawn start is the top) |
| bench_dip | 1/2/1 (c16, c17) | `[{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }]` |

- No row for cable_rear_delt_fly or renegade_row (null/null/null; D-LIB17-SECS): their specs carry no `tempo`.
- Motra's 1 s bottom pause (cable_lateral_raise c23, dumbbell_front_raise c20, face_pull c16, cable_external_rotation
  c19, resistance_band_pull_apart c15) and the other versions' bottom pauses (weighted_dip c15, bench_dip c18) are in
  tempo.text only; research left them out on purpose (LR-33), so they are not drawn. A7 pins it.
- The five pause-1 WEAK conventions (cable_lateral_raise c22, dumbbell_front_raise c19, face_pull c17,
  resistance_band_pull_apart c16, bench_dip c17) and cable_external_rotation's sourced second (ACE, c18) are drawn as
  the cards say (LR-33).

## 9. Pose map (13 Q2 (b)), the Mistake's pose and the fault→key map (13 Q1(a))

The engine draws the Mistake as the end pose plus an override (plate.mjs:78), so each fault is drawn against the end
pose (Q2 (f)), except renegade_row, whose pose is proposed below.

| id | spec `start` = card | spec `end` = card |
|---|---|---|
| all 9 | plate.start | plate.end |

All identity: weighted_dip's and bench_dip's cards name the top as plate.start and the bottom as plate.end, and the
spec draws them so (the drawn start is the top). A fact with no pose defaults to the spec's `end` (node.mjs h6), so
every start fact names pose `start`.

- **renegade_row (proposed; the supervisor rules it).** The fault happens as the dumbbell returns to the floor (c9),
  not at the row's end. Proposed: the Mistake pose is the near arm back down, its dumbbell landing on a corner (the hex
  turned M_TURN 30 deg, the axis on the corner's circumradius above the floor), **compared with the right landing:
  the far dumbbell, which sits flat on a face in the same side-view place** (both are under the shoulders), so the
  red turned hex lies over the solid flat one. The engine's deviation still measures end → Mistake; with the one
  tell anchored on the corner (a fixed world point) it reads 0 px, and anchored on the grip it would read the row's
  return (the dumbbell from the ribs to the floor), which is not the fault. The card-true size is section 12's.
- **Phantoms (Q2 (c)).** weighted_dip: the straight start arm runs down the end forearm's plumb line, so its covered
  part is redrawn as hidden lines over the end figure (pull_up's hang outline). cable_external_rotation: the start
  forearm across the stomach lies under the end torso fill, so the start arm's outline and the start handle are
  redrawn dashed in the end layer (machine_chest_press.mjs:80-107). cable_lateral_raise: the start handle (the start
  layer drops moving equipment). Ghosts follow the engine's joint path; no straight limb bends between poses.

Fault→key (13 Q1(a)); each spec's first tell carries the drawn key:

| id | plate.mistake (claim; drawable) | drawn key (other tells) | handlingMistakes[0] | topFault |
|---|---|---|---|---|
| cable_lateral_raise | arm above shoulder height, beyond 90 (c19, c7; true) | `above` (`past`: beyond 90 at the hand) | the same | `above` |
| dumbbell_front_raise | swinging up with the hips pushed forward (c12, c13; true) | `swing` (`hips`: the hips pushed forward, c12; the counter-lean drawn for balance, unlabelled; ruled) | the same | `swing` |
| cable_rear_delt_fly | shoulders not kept rolled back and down (c5; false) | `roll` (`up`: the shoulders up, in c5's words rolled, back, down) | swinging, the lower back overextending (c9, c10) | `swing` (F7) |
| face_pull | elbows dropping below shoulder height (c9, c10; true) | `drop` (`low`: the hands toward the chin) | the same | `drop` |
| cable_external_rotation | elbow flaring out, away from the side (c9; false) | `flare` (`side`: the upper arm off the side) | swinging with momentum (c12, c13) | `swing` (F7) |
| resistance_band_pull_apart | shoulders shrugging upward (c8; true) | `shrug` (one tell, record below; ruled: c13/c14 name muscles, not a sign) | the same | `shrug` |
| renegade_row | lowered too quickly, lands on a corner (c9; true) | `corner` (one tell; record below) | the same | `corner` |
| weighted_dip | cutting reps short, well above parallel (c14, c7; true) | `short` (`parallel`: the upper arm above level) | the same | `short` |
| bench_dip | dropping too low, upper arms well below level (c8; false) | `low` (`parallel`: c8's "Stop when your upper arms are parallel to the floor"; ruled) | elbows flaring out (c7) | `flare` (F7) |

Tells are 2-3 visible signs of the one fault, words from the claims (CARD-V2:68); the cards' plate.tells are
right-pose cues (CARD-V2:37), so the Mistake tells restate plate.mistake.what with the claims' words.

**One-tell record (D-LIB10-SKULL1; #290 6345185694).** renegade_row: fault c9 (the corner landing); claim ids read:
c9 (both quotes: "Dumbbells set down too hard, or onto a corner, can hurt the wrists"; BarBend's "This can jostle your
wrists ..."), c8, c15, and plate.mistake; no second visible sign stated (the jostled wrist is a consequence the quotes
name, with no drawn position or size), so the plate has one tell.
resistance_band_pull_apart (bulk): fault c8 (the shrug); claim ids read: c8, c3 ("keep the shoulders down; avoid
shrugging"), c13, c14 (target muscles and EMG, no sign); no second visible sign stated, so one tell.

## 10. Facts plan (D-LIB8M-FACTS, 22's scope, D-LIB13-FACTS2, D-LIB17-FACTS)

Read on the copied quotes (ruled: LB7 NOTE RULED, #299 6347885720). A setup quote states the start pose only
(D-LIB9-FACTPOSE); the card's plate.start/plate.end claim citations decide the pose of non-setup quotes only; a contact
is never carried to another pose; "both" or a plural paired part states each side; a hand contact is checked at the wrist
(PANELS.md 7); contacts only for drawn poses, none from a height or a place near something. Each fact will cite the
claim whose quote states it; each contact gets a `checks` entry in its spec (H6).

| id | quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|---|
| cable_lateral_raise | "grip the handle with the outside hand" (c2, setup; plate.start cites c2) | `contact wrist.l` | start (start) |
| cable_lateral_raise | "lift the handle outward to your side, until your upper arm is horizontal" (c7; plate.end cites c7) | `angle sh.l.elev 90` (PANELS.md 7's `sh.r.elev` reading: the upper arm against the upright trunk) | end (end) |
| dumbbell_front_raise | "holding a dumbbell in each hand" (c1, setup) | `contact wrist.l`, `wrist.r` ("each hand": both) | start (start) |
| dumbbell_front_raise | "until your arms are level with your shoulders" (c8; plate.end cites c8) | `angle sh.l.elev 90`, `sh.r.elev 90` ("arms": both) | end (end) |
| cable_rear_delt_fly | "Take the left cable in your right hand and the right cable in your left hand" (c2, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| face_pull | "grasp ends with neutral grip" (c2, setup) | `contact wrist.l`, `wrist.r` (the two rope ends) | start (start) |
| cable_external_rotation | "Grip the handle with the far hand" (c2, setup) | `contact wrist.l` | start (start) |
| cable_external_rotation | "bend your elbow to 90 degrees" (c3, setup; also Motra's "elbow bent at 90 degrees") | `angle elbow.l 90` | start (start) |
| resistance_band_pull_apart | "Grip a resistance band ... overhand grip" (c1, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| resistance_band_pull_apart | "Start with arms extended forward at shoulder height" (c5; plate.start cites c5) | `angle sh.l.elev 90`, `sh.r.elev 90` | start (start) |
| resistance_band_pull_apart | "Pull band apart horizontally until arms align with shoulders" (c4; plate.end cites c4) | `angle sh.l.elev 90`, `sh.r.elev 90` | end (end) |
| renegade_row | "gripping the pair of dumbbells" (c1, setup; a pair: both) | `contact wrist.l`, `wrist.r` | start (start) |
| weighted_dip | "Set your hands evenly on the bars" (c2, setup; "hands": both) | `contact wrist.l`, `wrist.r` | start (start) |
| weighted_dip | "Secure a dip belt around your waist" (c8, setup) | `contact navel` (the belt's front at the waist), bound by a check and a test that the drawn start belt covers the navel point (ruled) | start (start) |
| bench_dip | "Place both hands flat on the bench" (c2, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| bench_dip | "keeping the heels on the ground" (c3, setup steps: "1. Positioning") | `contact heel.l`, `heel.r` | start (start) only; the heels on the floor at the end are held by a `checks` entry and a drawn-item test, no end fact (ruled) |
| bench_dip | "until your arms form a 90-degree angle" / "your elbow forms a 90-degree angle" (c5; plate.end cites c5) | `angle elbow.l 90`, `elbow.r 90` | end (end) |

**Not facts**, each with its reason:
- cable_lateral_raise c4 "slight elbow bend", c9 "slight elbow bend throughout": no number (the bend is a size,
  D-LIB16-LOCK). c3 "the cable has tension": no fact kind. c5 "in front of or behind": a choice, no number.
- cable_lateral_raise c7 Motra "parallel to floor": the same pose as SL's "upper arm is horizontal", one fact per pose
  and joint.
- dumbbell_front_raise c2 "lightly touching the fronts of your thighs": a dumbbell against the mid-thigh, where the body
  model has no landmark (thighTop is just above the knee, 17 cm lower); so no contact (ruled). START_FLEX draws it: a
  drawn-item test binds the dumbbell against the front thigh line at the start (±1 cm), as renegade_row's ribs. c2 "elbows extended or holding a
  slight bend", Motra "soft bend": no number. c3 "feet slightly wider than hip-width": a width the side view cannot show.
- cable_rear_delt_fly c4 "the cables cross at about eye level": where an item is, not a touch (D-LIB17-FACTS); c4 and c6
  "slight bend": no number. c7 "about parallel to the body": no number and no joint convention for it.
- face_pull c1 "at about head or eye height", c5 "at eye level", c7 "hands near ears": a height or a place near
  something, no contact (D-LIB17-FACTS). c3 "feet hip-width apart", "a couple of steps back": a width and an
  equipment distance with no measure callout (D-LIB8M-FACTS).
- cable_external_rotation c3 "upper arm and elbow against your side", c9 "Elbow glued to side": a body part against
  the body, not against equipment or a support (PANELS.md 7's contact kinds); held by `checks` (the elbow on the side
  line) and a drawn-item test instead. c10 "parallel to ground": no number; held by a check (the grip at the elbow's
  height). c1 "at elbow height": a height of an item, not a touch.
- resistance_band_pull_apart c5 "pull until arms are in line with torso or band touches chest": an "or" between two end
  points states a choice, not a contact that always happens (the card's plate.end: "band at or near the chest");
  ruled D-LIB17-ORCHOICE (#299 6348241751), the same reason as cable_lateral_raise c5's "in front of or behind".
- resistance_band_pull_apart c1 "knees slightly bent": no number; c1 "hands wider than shoulders": a width, no fact
  kind.
- renegade_row c4 "until the dumbbell touches your ribcage": the body model has no landmark on the side of the ribcage
  (`chest` is the front of the thorax); held by a drawn-item test (the dumbbell's inner head at the ribs). c2 "hands
  underneath your shoulders": a place, not a touch; held by a check. c1 "feet wider than hip-width": a width.
- weighted_dip c4 "until your elbows are bent at 90 degrees" (F-LB7-1 @ `e5ed66ca`; D-LIB17-DIPBAL option P, #299
  6348947992): a rough cue, not a fact. With the hands on the bars the body plus plate must balance over the grips, and
  at the parallel line with c5's slight lean the balanced elbow is 115.7° (the ruling quotes about 112.5), with the
  upper arm 14° above level and the shoulder on the parallel line. The card keeps the quote; plateFacts has no elbow
  angle. Drawn and tested: the shoulder on the parallel line (±1 cm), the elbow at END_FLEX (±0.5°), body plus the 20 kg
  plate at the belt point over the grips (±2 cm) in every pose; the body alone is −3.6 / −4.5 / −4.4 cm (start, end,
  Mistake), logged only.
- weighted_dip c1 "about shoulder-width", "within two inches outside": a width the side view cannot show; drawn as BAR_X
  (section 11). c8 "near the shins or feet": near something (D-LIB17-FACTS). c4 SL "until your shoulder is below your
  elbow": the deeper of c4's two readings; the card follows the parallel line (its notes), so the 90 deg fact is BarBend's.
- bench_dip c4 "keeping your butt close to the bench": close to, no contact (D-LIB17-FACTS). c5 "upper arm is parallel
  to the ground": an angle to the floor, not a joint angle, and the torso leans back slightly (c20); held by a
  drawn-item test. c1 "about shoulder-width apart": a width the side view cannot show.

## 11. Size table (D-LIB17-SIZE; `lb7/sizes.json`)

Every number a card does not give, fixed before PQ-H3, each with its basis (a claim, an approved plate's file:line, or
a stated reason; never PQ-H3). Each drawn spec exports its table as `SIZES` and `dipBars` its constants; A17 compares
them with `lb7/sizes.json` both ways and checks every basis. The spec headers list them under "Unsourced numbers".
The four slice ids are in sizes.json with their full bases (not repeated here); the table below is the summary and
the bulk proposals.

| id | name | value | basis (short) |
|---|---|---|---|
| cable_external_rotation | FOOT_X, KNEE_SOFT | 0.18 m, 5° | upright_row.mjs:44-45 (#109) |
| cable_external_rotation | START_ROT | -55° | stated: the forearm's inner edge just in front of the navel, the fist past the midline (c4) |
| cable_external_rotation | END_ROT | +20° | c6 (ACE): the fist 3 cm outside the upper arm's outline |
| cable_external_rotation | M_ABD (Mistake) | 20° abduction | stated: the elbow 11 cm off the side line, more than the upper arm's radius, so a gap shows (c9) |
| cable_external_rotation | COLUMN_X, PULLEY_Z, HANDLE_*, FLOOR_* | | stated (layout; distance not sourced, card notes); handle conventions (equipment.mjs:30, dHandle.mjs:4-5, LB6 HANDLE_R) |
| cable_lateral_raise | ELBOW_BEND | 18° | machine_chest_press.mjs:45 (D-LIB16-LOCK) for c4, c9 "slight elbow bend" |
| cable_lateral_raise | START_ELEV, START_PLANE | 12°, plane 135 | stated: c5 the handle in front of the body: the fist in front of the near thigh |
| cable_lateral_raise | LEAD | 8° | ref-src/plate.mjs:3 (golden A's approved lateral raise, "lead 8") for c6, c13 |
| cable_lateral_raise | M_OVER (Mistake) | 20° past level | stated: c19 "above 90", clearly beyond Motra's "or slightly above" (c7) |
| cable_lateral_raise | PULLEY_Y | 0.12 m | c1 "at its lowest point" |
| weighted_dip | BAR_X | 0.2266 m | c1 "about shoulder-width": the shoulder joints' width |
| weighted_dip | BAR_Y, POST_FRONT | 1.10 m, 0.50 m | physical (D-LIB17-DIP; option P): the lowest height in 5 cm steps keeping the feet and plate FLOOR_GAP (0.15 m) above the floor at the bottom; the uprights in front of the lifter, clear of the plate |
| weighted_dip | TOP_LEAN, BOTTOM_LEAN | 4°, 15° | c5 "nearly upright", "at most a slight forward lean" |
| weighted_dip | KNEE, HIP_ADD, ANKLE | 20°, 6°, -22° | c3 "slight knee bend", "crossing the ankles"; pull_up.mjs:30 |
| weighted_dip | SCAP_ELEV, SCAP_PRO | -3, -3 cm | pull_up.mjs:36 for c3, c6 |
| weighted_dip | PLATE_D, HOLE_D | 0.45, 0.05 m | equipment.mjs:261 (the vendor barbell plate and sleeve) |
| weighted_dip | CHAIN_LEN | solved 0.705 m | c8 "hang it low, near the shins": the plate centre at mid-shin at the top |
| weighted_dip | M_DEPTH (Mistake) | 0.5 | c14 "half reps": the shoulder halfway down from the top (1.768 m) to the parallel line (1.442 m), on the balanced path |
| weighted_dip | END_Y, TOP_Z, END_FLEX | solved: the parallel line; balanced; 115.7° | D-LIB17-DIPBAL option P (#299 6348947992): the bottom shoulder on the parallel line, the elbow the balanced value (the ruling quotes about 112.5) |
| weighted_dip | TOP_THIGH, BOTTOM_KNEE, BOTTOM_THIGH | -15°, 90°, -40° | physics: the plate clear of the shins (slice item 3) and the balance; c3 states the top only (condition 1) |
| weighted_dip | BODY_KG, PLATE_KG | 75 kg, 20 kg | the balance: body plus the 45 cm (20 kg) plate at the belt point (condition 3, amended) |
| weighted_dip | BELT_W, BELT_T, CHAIN_W, POST_BACK, FLOOR_* | | stated |
| renegade_row | DB_X | 0.2266 m | c1 "shoulder-width", c2 "under the shoulders" |
| renegade_row | END_BACK, END_OUT | 0.21, 0.08 m | c4 "until it brushes the ribcage": the lower ribs, the inner head clear of them |
| renegade_row | M_TURN (Mistake) | 30° | c9 "onto a corner": a corner straight down |
| renegade_row | ANKLE, LINE_RUN; TOE_Z | 0°, 0.22 m; -1.25 m | plank.mjs @ `ff7c5c4f`; stated (layout: the straight body is solved) |
| **bulk proposals** | | | |
| dumbbell_front_raise | FOOT_X, KNEE_SOFT | from dumbbell_biceps_curl (#109) | convention (c3's width is not visible from the side) |
| dumbbell_front_raise | ELBOW_BEND | 18° | machine_chest_press.mjs:45 (D-LIB16-LOCK) for c2 "soft bend" |
| dumbbell_front_raise | START_FLEX | the dumbbells at the fronts of the thighs | c1, c2 (solved: the grip just in front of the thigh line) |
| dumbbell_front_raise | M_HIP, M_LEAN (Mistake) | hips 8 cm forward, trunk 12° back [proposed] | stated: c12 "pushing the hips forward" with the body's counter-lean; no approved plate draws this swing (dumbbell_biceps_curl's Mistake is the elbow drift) |
| face_pull | PULLEY_Y, COLUMN_Z | eye height; two steps back | c1 "head or eye height"; c3 "a couple of steps back" (2 × 0.152 H foot lengths, stated) |
| face_pull | END grip | hands by the ears, elbows at shoulder height and behind | c5, c7 |
| face_pull | M_DROP (Mistake) | elbows 15 cm below the shoulder line [proposed] | stated: c9, c10 "below shoulder height", the upper arm clearly sloping down |
| cable_rear_delt_fly | PULLEY_Y, PULLEY_X | the column tops 2.1 m, ±1.0 m | equipment.mjs:85 (the vendor column height); stated (a crossover's width) |
| cable_rear_delt_fly | ELBOW_BEND | 18° | machine_chest_press.mjs:45 (D-LIB16-LOCK) for c4 "not locked", c6 "slight bend" |
| cable_rear_delt_fly | END elevation | the arms out at about 80° (back and slightly down) | c6 "slightly downward", c7 "about parallel to the body" |
| cable_rear_delt_fly | M_ELEV, M_PRO (Mistake) | scapulae 3 cm up, 3 cm forward [proposed] | pull_up.mjs:36's ±3 cm (the 8's down-and-back), reversed |
| resistance_band_pull_apart | M_SHRUG (Mistake) | 5 cm | the approved lateral raise's shrug (ref-src/plate.mjs:147, "shrug_cm 5"): the same fault, the first basis (6343211054 item 1) |
| resistance_band_pull_apart | BAND_T | from band.mjs:8-9 @ `9e5d9666` | convention (D-LIB17-BAND) |
| resistance_band_pull_apart | ELBOW_BEND | 18° | machine_chest_press.mjs:45 for c1, c5 "slightly bent" |
| bench_dip | BENCH_TOP | 0.42 m | one_arm_dumbbell_row.mjs (#274 @ `a6f4bd07`) BENCH_TOP (the vendor bench's low end) |
| bench_dip | M_FLEX (Mistake) | the upper arm 25° below level [proposed] | stated: c8 "well below" level, clearly past c5's "slightly above" reading |

## 12. PQ-H3 (deviationMin 11.39 px, traceLenMin 22.11 px; qa/envelope.json)

| id | Mistake: largest tell-anchor move, end → Mistake | Trace (the D-LIB17-TRACE point) |
|---|---|---|
| cable_external_rotation | **measured 16.5 px** (the elbow, 20° abduction) | **measured 34.5 px** (the hand, grip.l): passes; no zoom, no F1 (D-LIB17-ER) |
| cable_lateral_raise | **measured 33.2 px** (the hand, 20° past level) | **measured 122.9 px** (the handle) |
| weighted_dip | **measured 25.7 px** (option P: the head, the half rep; tell `short`) | **measured 23.4 px** (the shoulder, at 137.22 px/m; 21.5 px at BAR_Y 1.25 before the re-solve) |
| renegade_row | **measured 0.0 px** with the tell on the corner; the card-true sign, the hex turned 30° onto a corner against the flat one, moves its corners **measured 4.9 px** at 146.29 px/m (each turned vertex against the nearest flat one): **below deviationMin** | **measured 78.9 px** (the near dumbbell) |
| dumbbell_front_raise | the hips 8 cm forward and the shoulders about 10 cm back: about 15 px [est] | the dumbbells' arc, about 0.8 m: over 100 px [est] |
| face_pull | the elbow 15 cm down: about 22 px [est] | the rope at the hands, about 0.35 m: about 50 px [est] |
| cable_rear_delt_fly | the shoulder line 3 cm up: about 4-5 px [est]: **measured 4.4 px at the bulk, held** (section 14) | the handles, about 0.8 m: over 100 px [est]; measured 93.5 px |
| resistance_band_pull_apart | the shrug at 5 cm: about 7.3 px [est] (LB5's shrug measured 7.3 px, #290 6340849204): **likely below** | the hands, about 0.55 m: about 80 px [est] |
| bench_dip | the shoulder about 8-10 cm lower: about 12-15 px [est]: **at risk** | the shoulder, about 0.25 m: about 36 px [est] |

A too-small fault is reported with its card-true size and held under D-LIB8-shrug (D-LIB17-SIZE, S2), route LIB-ZOOM;
never enlarged, widened, cropped or re-scaled.

## 13. H slice (Do 2; D-LIB17-SLICE)

weighted_dip with eq/dipBars.mjs, cable_external_rotation, cable_lateral_raise and renegade_row (renders and
drawn-item tests only, D-LIB17-SECS). Drawn on this branch; their renders, tests, QA table and A9 go in the slice
post. renegade_row's renders come only from `lb7/build.mjs --held`.

## 14. Held ids

| id | ruling | why | route |
|---|---|---|---|
| cable_rear_delt_fly | D-LIB17-SECS (D-LIB14-NOSECS); and D-LIB8-shrug (D-LIB17-SIZE, S2) | tempo null (c9: slow and controlled, no seconds; LR-33, R-LB7-6); the card-true shoulder roll (scapulae 3 cm up, 3 cm forward) measures 4.4 px < 11.39 px (section 12) | the strip card, then 'LIB-17 resume'; LIB-ZOOM (#279) on main for the zoom circle |
| renegade_row | D-LIB17-SECS (D-LIB14-NOSECS); and D-LIB8-shrug (D-LIB17-SIZE, S2) | tempo null (LR-33); the card-true corner landing moves 4.9 px < 11.39 px (section 12) | the strip card, then 'LIB-17 resume'; LIB-ZOOM (#279) on main for the zoom circle |
| resistance_band_pull_apart | D-LIB8-shrug (D-LIB17-SIZE, S2) | the card-true shrug at M_SHRUG 5 cm (ref-src/plate.mjs:147) measures 7.3 px < 11.39 px (engine deviation; section 12's estimate held); the Trace is 57.6 px | LIB-ZOOM (#279) on main for the zoom circle |

Held rows are in no rows file; their specs, tests and card keys stay.

## 15. Risks and mitigations

1. **Small faults** (renegade_row now; resistance_band_pull_apart's shrug, cable_rear_delt_fly's shoulder roll and
   bench_dip's depth at risk): held under D-LIB8-shrug with the LIB-ZOOM route; the slice shows renegade_row held.
2. **The Mistake reads poorly where the faulty pose overlaps the end figure** (weighted_dip's half rep, the
   renegade_row hex): the red arm is redrawn as dashed guides over the figures (one_arm_dumbbell_row's pattern) and
   a datum (the parallel line) shows depth; the critic judges R5.
3. **cable_lateral_raise's Mistake cable twin is loud** (a long red dashed line across the body): card truth (the cable
   to the handle in every pose); posted with the slice for a look.
4. **Front-view foreshortening**: cable_external_rotation's end forearm points mostly at the viewer (card-true, the
   census view); the start forearm across the stomach and the start phantom carry the turn.
5. **renegade_row S1**: the corner landing is drawable (a `poly` hex), but too small at the reference scale (S2).
6. **Bulk**: main's eq/rope.mjs may not draw face_pull's rope ends at the ears (post, never fork); the front-view
   crossover cables of cable_rear_delt_fly cross in front of the face at the start (card truth, D-LIB17-CABLE).
7. **Scratch ids** (D-LIB17-SCRATCHIDS): LIB-2b's fixture writes its own cable_lateral_raise spec and How-to over this
   branch's paths in its temporary tree; the full `npm test` (A12) runs it; a red is S5.
8. **Shared appends**: docs/COACHING-DECISIONS.md is append-only; conflicts keep both sides.

## 16. Questions for the supervisor (ruled: 'LB7 NOTE RULED', #299 6347885720: Q1-Q7 accepted, with the changes in sections 9-11)

1. The tempo map (section 8, `lb7/tempo.json`): as D-LIB17-TEMPO.
2. The pose map (section 9): identity for all 9; renegade_row's Mistake compared with the flat far dumbbell.
3. The fault→key map (section 9) and the three F7 topFault keys (`swing`, `swing`, `flare`).
4. The facts plan (section 10): in particular cable_external_rotation's elbow-at-side as "not facts" (a body-on-body
   contact), weighted_dip's belt as `contact navel` at the start, bench_dip's heel contact at start and end (plate.end
   cites c3, whose quotes are setup steps), and the shoulder-elevation 90 readings.
5. The size table (section 11 and sizes.json): the slice values; the bulk proposals marked [proposed].
6. The trace points (sizes.json `trace` rows): weighted_dip the shoulder (c4's quote); bulk: bench_dip the shoulder
   (proposed; c5 names the elbow bend, the shoulder is the upper arm's moving end), dumbbell_front_raise the dumbbell
   (c8), face_pull the rope at the hands (c5), resistance_band_pull_apart the hands (c4), cable_rear_delt_fly the
   handles (c6).
7. renegade_row: held under D-LIB8-shrug as well as D-LIB17-SECS (section 14).
