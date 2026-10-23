# LB10 H plates: design note (LIB-22)

Card: `docs/supervisor/verify/lib-22-card.md` on `claude/sup-lib4-cards` @ `9427ad00` (Do 1), with its D-LIB22-*
rulings and lib4-cards sections 12-31. Plan: `claude/howto-options` @ `b41ac833`. Research: the LB10 research head
`596dbe0748f11d13b431ee11d38d1742771925f1` on `claude/libht-research` (LB10 merge `8d750bfe`, #296: LR-29 VALID); the 12
cards and quotes are byte copies from it (`lb10/cards.sha.json`). Census: `docs/howto/library/inputs/census.json` @
`4a9fd86`. Patterns copied with `git show` from LB7 (#299 @ `5a9f004c`), LB4 (#289 @ `6846c5af`) and pilot A (#109 @
`dcac4a38`), never imported. Base: main `1ffd0dac`.

Nothing here ships (D-LIB22-AHEAD): every LB10 row stays at stage `drawing` or `review` in `lb10/rows.json`, outside
`batches/`; `tests/howto/lb10-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids with a tempo
strip (A5; D-LIB22-SECS). mountain_climbers (LB10's thirteenth row) is pilot A's plate (pA) and is in no LB10 file.

Status of this note: ruled ('LB10 NOTE RULED', #305 6355155831: Q1-Q9 accepted with the limits recorded in section 17);
updated with the slice. Values marked **measured** come from the engine (renderPlate report, qa/node.mjs `deviation`,
the Trace path, the Winter centre of mass in the tests) on the slice at this head; values marked [est] are estimates. QA evidence comes only after Do 6's verdict (Do 2).

## 1. Engine and modes

- **Engine.** Every LB10 spec imports only `tools/plates/library/engine.mjs`, the five LB10 composers under `eq/` and
  main's `eq/parts.mjs` and `eq/rope.mjs` (D-LIB9-ENGINE, D-LIB22-ROPE). Specs copy code from the 8 on main and from
  pilot A and LB heads with `git show`; they never import a spec (D-LIB9-CLONE; A3 tests it). Every copied root finder
  throws on a bracket with no root, and the note records what each solves to (section 11).
- **Modes: all 12 are H; no D row** (plan 6.2 :719 "H13", :759-760 no mark). A D spec is its parent with only PARAMS
  paths set (derive.mjs:4-12: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness,
  stance.width), and of those the vendor engine reads only `spec.camera` (vendor/engine/plate.mjs:81-95). Three census
  closests (dumbbell_lateral_raise) have no spec at all (ref-src; D-LIB22-CLONE). What each id needs outside PARAMS
  (each alone makes it H; plan 3.1:272):

| id | census closest | outside PARAMS |
|---|---|---|
| sled_push | leg_press | pose class: standing lean on the balls of the feet, not seated; equipment: `sled` (new), no sled rails or plate; motion: a stride (cycle), not knee extension on a plate |
| sled_pull | seated_cable_row | pose class: standing quarter squat, not seated; equipment: `sled` and main's `rope` (a long rope from a sled hitch, a coil at the feet), not a cable column; motion: a backward step |
| farmer_s_carry | barbell_back_squat | equipment: two engine dumbbells at the sides, no barbell; motion: a walking step, not a squat; no tempo seconds |
| burpee | barbell_back_squat | pose classes: stand and plank (floor), no bar; motion: standing to a straight-arm plank (two poses, `via`); pose map (D-LIB22-POSEMAP) |
| jumping_jacks | dumbbell_lateral_raise (ref-src, no spec) | no engine parent; airborne class; motion: legs and arms abduct together, landing; front view by the engine |
| high_knees | hanging_leg_raise | pose class: standing on one forefoot, not hanging; no bar; motion: one knee drive (cycle), the opposite arm |
| jump_rope | dumbbell_lateral_raise (ref-src, no spec) | no engine parent; equipment: `jumpRope` (new); airborne hop with a free root; front view |
| battle_ropes | dumbbell_lateral_raise (ref-src, no spec) | no engine parent; side view, not front; equipment: `battleRope` (new); pose class: hinge |
| medicine_ball_slam | barbell_back_squat | equipment: `medBall` (new), no barbell; motion: overhead on the toes to a hinge-squat with the ball on the floor |
| wall_ball | barbell_back_squat | equipment: `medBall` and LB4's `wall` (main, after #289), no barbell; motion: squat with the ball at the chest |
| bear_crawl | machine_chest_press | pose class: quadruped on hands and feet (floor), not seated; no machine; motion: a diagonal step |
| kettlebell_swing | barbell_back_squat | equipment: `kettlebell` (new), no barbell; motion: the hinge and the swing arc; tempo 1/1/0 (c26), not the parent's |

- **D test (Do 3).** No id here could meet it: each needs a pose class, equipment or motion its census closest does
  not have, and three have no parent spec. No reason found to post for a D row.

## 2. Per id

| id | tier | view | clone source (D-LIB22-CLONE) and what else is copied | composer / primitives | hand (merge_prerequisites; drawn) |
|---|---|---|---|---|---|
| sled_push | B | side | leg_press (the 8: the lean's M_ROLL rounding); mountain_climbers (#109: the cycle plate, one stride); reverse_lunge (#109: the rigid foot on its ball) | **sled** (new, slice), floor | no key (card hand zoom 'hands' is a ship gap); fists on the posts |
| sled_pull | B | side | seated_cable_row (the 8: the rope line to the hands); romanian_deadlift, barbell_row (#109: the hinge); mountain_climbers (cycle) | **sled** (pull form, bulk), main's `rope` (ropeGeometry, strandOutline), floor | hand-implement GAP (hand-implement.mjs:7); fists on the rope |
| farmer_s_carry | A | side | barbell_back_squat (the 8: standing stance); dumbbell_biceps_curl (#109: the engine dumbbell); mountain_climbers (cycle) | two vendor dumbbells, floor | no key ('grip' zoom gap); fists on the handles |
| burpee | B | side | barbell_back_squat (the 8: standing); plank (#109: the plank body, the palm on the floor); mountain_climbers (`via`) | floor | palm-flat (hand-palm-flat.mjs:27-28, shared key); flat palms (LIB-26) |
| jumping_jacks | C | front | upright_row (#109: the engine front view); box_jump (#109: the landing frame) | floor | none (census none) |
| high_knees | C | side | hanging_leg_raise (the 8: the knee drive and the Mistake arch, :67-69); box_jump (airborne frame); reverse_lunge (the foot on its ball) | floor | none |
| jump_rope | B | front | upright_row (#109: the front view); box_jump (#109: root.at free, airborne) | **jumpRope** (new, slice), floor | hand-implement GAP (hand-implement.mjs:4-7); fists on the handles |
| battle_ropes | C | side | romanian_deadlift (#109: the hinge) | **battleRope** (new, bulk), floor | hand-battle-rope (hand-battle-rope.mjs:27, death-grip; camera the owner's, D-LIB12FIX-ROPE); fists |
| medicine_ball_slam | A | side | barbell_back_squat (the 8: the squat); barbell_overhead_press (#109: the straight arms overhead); reverse_lunge (on the toes) | **medBall** (new, slice), floor | hand-ball-contact GAP (hand-ball-contact.mjs:28); fists on the ball |
| wall_ball | A | side | barbell_back_squat (the 8); wall_sit (#289, read only: the wall's place) | **medBall**, main's `wall` after #289 (D-LIB22-WALL), floor | hand-ball-contact GAP (:28) |
| bear_crawl | C | side | machine_chest_press (the 8: census closest, its reach arms only); plank and mountain_climbers (#109: the floor line, the palm, ×1.35) | floor | palm-flat (shared key, :27-28); flat palms |
| kettlebell_swing | A | side | barbell_back_squat (the 8: stance and the side view); romanian_deadlift (#109: KNEE 15, the hinge solve); single_leg_romanian_deadlift (#109: the Winter centre of mass) | **kettlebell** (new, slice), floor | hand-implement GAP (hand-implement.mjs:4-7); fists on the handle |

mountain_climbers: pilot A's plate (pA, plan 6.1:689; :759), reused as pilot A pins it; it is the cycle convention's
anchor here (D-LIB22-CLASSES) and is in no LB10 file.

## 3. Composers (Do 4; D-LIB22-COMPOSERS, -FRAME, -IMPLEMENT)

Each composer is `(params) => item[]` returning PRIMITIVES types only (equipment.mjs:316: `poly`, `box`, `line`,
`backPad` through eq/parts.mjs `sideBar`/`frontBar`), reads no file, and is taken by a spec through
`perItem(fn, N_ITEMS)` (parts.mjs:35). Drawn-item tests run per pose on the real specs (13.1), never on helper maths.

- **`kettlebell`** (eq/kettlebell.mjs; single use, anchor kettlebell_swing; slice). Parts: the bell body (a circle
  with its flat base, `poly` curve) and the horns-and-handle neck (`poly`): with both hands side by side on the handle
  (c2) the handle runs across the body (world x), so in side view it is end-on inside the fists and the two horns
  overlap into one neck. The bell hangs on along the arm line (shoulder → grip), continuing the straight, loose arms
  (c7). **Every part moves** (the swing; the lean back moves the arms), so both carry `poly` (PQ-H9). Nothing to join:
  the handle is in the hands (A2: each fist on the handle, ±1 cm). The start bell (hidden by the moving-equipment rule
  of the start layer) is redrawn dashed in the end pose (`eq-line m-line`, D-LIB22-DRAW).
- **`medBall`** (eq/medBall.mjs; anchor medicine_ball_slam, later user wall_ball; slice). One ball, a `poly` circle
  (curve) with a seam line drawn as a second thin `poly` lens, never `pulley` (a solid circle with no `poly`,
  equipment.mjs:300; A2 mutation). Moving (overhead → floor; and wall_ball's chest → squat), so `poly`. The hands hold
  it at its sides in the overhead start (c15), and at the end the ball rests on the floor (the lowest outline point on
  the floor line, ±1 px, A18).
- **`sled`** (eq/sled.mjs; two users, both in LB10, anchor sled_push; slice draws the push form; sled_pull's drag moves
  the whole sled by the hips' displacement between its start and end, NOTE RULED 9). Parts (side view):
  the sled body (a low skid, `sideBar`), two runners under it (`sideBar`, on the floor line: their lowest points on
  y 0), the loading horn with plates (`sideBar` peg and plates as `poly` rectangles), and the two upright posts
  (`sideBar`, the near post z `mid`, the far post z `back`) rising from the body's rear edge, each joined to the body
  by a drawn bracket (`poly` gusset, D-LIB22-FRAME: no free-floating handle). The pull form (bulk, sled_pull) adds the
  rope hitch: a ring on a bracket at the sled's edge nearer the lifter (`poly`), from which main's `rope` strand runs.
  **sled_push: static**, every part at one place in every pose (A2 ±1 px), so the Mistake needs no twin. **sled_pull:
  a drag** (Q9 ruling, #305 6355155831): in the end pose the sled moves in the walking direction by the hips'
  displacement, so the rope keeps its length and light tension (c1); its start place is redrawn dashed (sled and rope
  phantom).
- **`jumpRope`** (eq/jumpRope.mjs; single use, anchor jump_rope; slice; front view). Parts: two handles (`poly`
  capsules in the fists, their rope ends toward the rope) and the rope (one thin closed `poly` strand from handle to
  handle). Start: the rope arcs overhead (plate.frames); end: it passes under the soles (plate.frames, c9), its lowest
  point on or above the floor line and below both soles (A18). The rope's length is fixed by c1 (the handle ends at
  the armpits standing on its middle: rope = 2 × (armpit height − handle length) + the feet's width), and each pose's
  arc shape is solved to that length (a sized shape, D-LIB22-IMPLEMENT). **Moving** (start → end → Mistake), so `poly`.
- **`battleRope`** (eq/battleRope.mjs; single use, anchor battle_ropes; bulk). Parts: two rope ends (`poly` strands,
  3.8 cm thick, c8) from each fist forward to the plate edge toward the off-plate anchor (plate.equipment), with a
  wave whose amplitude and wavelength are sized numbers (D-LIB22-IMPLEMENT), the near and far ropes in opposite phase
  (c3). **Moving**, so `poly`; each rope runs unbroken from the hand to the plate edge in every pose and in the Mistake
  (A15). The far rope is z `back`, the near rope z `mid`.

Joins and contacts (A2, A18): the sled's posts on brackets on the body and its runners on the floor; the rope from the
hitch to the hands (sled_pull); each battle rope from the fist to the plate edge; the jump rope from handle to handle;
the ball in both hands overhead (medicine_ball_slam start) and on the floor at the end; the bell's handle in the fists.

`rope` (sled_pull, D-LIB22-ROPE): main's eq/rope.mjs `strandOutline` draws one strand from the hitch (its `from`) to
the hands; the coil at the feet (plate.equipment, c5) is a `poly` spiral outline in the spec. If rope.mjs cannot draw
the long strand card-true unedited (it was written for a 30 cm triceps rope), S7 with renders. `wall` (wall_ball,
D-LIB22-WALL): main's eq/wall.mjs once #289 is on main, planned against `6846c5af`; the target above head height is a
`poly` mark on the wall face drawn in the spec.

## 4. Pose-class, rig and convention anchors (depends_on; D-LIB22-CLASSES, -AIRBORNE, -CYCLE, -FRONT, -FLOOR)

| id | class anchor | convention anchors | rig anchor |
|---|---|---|---|
| sled_push | lean (proven, the 8) | cycle (mountain_climbers) | **sled**: sled_push itself |
| sled_pull | hinge: romanian_deadlift, barbell_row | cycle | sled (sled_push, same sheet); rope: rope_triceps_pushdown |
| farmer_s_carry | stand (proven); engine dumbbell: dumbbell_biceps_curl | cycle; drawable fault (dumbbell_biceps_curl) | |
| burpee | plank: plank (pilot A) and push_up (pilot B) | cycle (`via`); drawable fault | |
| jumping_jacks | airborne: box_jump (held, D-LIB8M-NOSTRIP); front view: upright_row | cycle; airborne; drawable fault | |
| high_knees | airborne: box_jump (held) | cycle; airborne | |
| jump_rope | airborne: box_jump (held); front view: upright_row | cycle; airborne (mid-air hop: owner, decision 3) | **jumpRope**: jump_rope itself |
| battle_ropes | hinge: romanian_deadlift, barbell_row | cycle | **battleRope**: battle_ropes itself |
| medicine_ball_slam | standing overhead: barbell_overhead_press | drawable fault | **medBall**: medicine_ball_slam itself |
| wall_ball | stand (proven) | | medBall (same sheet); wall: wall_sit (#289) |
| bear_crawl | quadruped: bird_dog (LB9 sheet first) | cycle; D-LIB8-floor (plank, mountain_climbers) | |
| kettlebell_swing | hinge: romanian_deadlift, barbell_row | | **kettlebell**: kettlebell_swing itself |

Every anchor gates the plate's sheet, not its drawing (plan 3.1:293-299). None is pinned on main yet.

- **Cycle** (D-LIB22-CYCLE): one half-cycle or stride per plate, as each card states; the Trace on the driving point
  (section 12). `via` poses only where a straight blend leaves the real joint path: burpee's squat with the hands down
  (c2, c3), kettlebell_swing's swing arc (two via poses, the bell between the knees, c5, and in front at hip height,
  c7), each never drawn solid and never carrying a fact, tell or anchor (sizes.json `VIA*` rows with their claims).
- **Airborne** (D-LIB22-AIRBORNE): jumping_jacks draws the closed stance and the landing ('Soft knees', c5, c6);
  high_knees keeps the stance foot down ('Balls of feet', c4); jump_rope's end is the mid-air hop itself (plate.end,
  c9), drawn card-true with root.at free (box_jump's method); it has no landing checkpoint ('Low hop', c9). That
  differs from plan 1:95-96 ("takeoff or landing frames only"); the owner judges it with box_jump (decision 3).
- **Front view** (D-LIB22-FRONT, S4): section 13.
- **Floor** (D-LIB22-FLOOR): bear_crawl only (section 5).

## 5. Expected flags

- **F5 on every plate** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly
  3.57 only.
- **F7 on farmer_s_carry, burpee, jumping_jacks and medicine_ball_slam only** (D-LIB22-F7): drawable false; each
  topFault is the key of its handlingMistakes[0], which differs from the drawn key (section 9).
- **F1 on bear_crawl only** (D-LIB22-FLOOR): the floor-horizontal plate takes pilot A's floor camera
  `{ fit: true, maxScale: 1.35, y0: 339 }` (mountain_climbers.mjs, plank.mjs @ `dcac4a38`), fixed by the
  fill-the-width rule before anything is measured; its px/m is posted when drawn [est about 190 px/m, mountain_climbers
  measured 191.92]. burpee draws a standing pose and a plank: it keeps the reference scale (146.29 px/m) unless the
  bulk shows with a measured reason that its plank does not fit; any F1 it raises is posted and ruled. No small-motion
  F1 (D-LIB22-SIZE).
- **No F6**: every card's plate.view equals its census view (front: jumping_jacks, jump_rope; side: the other 10).
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault' (qa/node.mjs:360). Expected.
- F2 (coverage), F3 (longest leader) and F4 (boxed labels) are measured by authoring QA and posted; any raised flag
  outside this set is posted with its value and range and ruled before READY. [est] F2 risk on battle_ropes (two long
  ropes to the plate edge) and kettlebell_swing (the swing arc and the hike); measured kettlebell_swing coverage
  0.167 (report.mjs), inside 0.100-0.246.

## 6. R10 items (tier A: farmer_s_carry, medicine_ball_slam, wall_ball, kettlebell_swing)

R10: "the right pose never shows an unsafe setup" (PANELS.md 5). Each item is a drawn-item test (A15), from each card's
tierA block, zooms and risks.

- **kettlebell_swing** (tierA.wayOut c20, c21; zooms kb-grip, kb-back, kb-top; risks c12, c14, c24): the back flat in
  every right pose (trunk 0 relative to the pelvis, c13); the feet planted, heels and toes on the floor in every pose
  (c17); the hiked bell well above the floor and high between the legs, never toward the ground (c11, c5); the head
  in line with the trunk (neck 0, c18); both hands on the handle in every pose (c24 full grip); at the top the body
  stacked over the ankles, no lean back (c8, c14). The way out (stop, set the bell down) is a ship-time text item,
  not a pose.
- **medicine_ball_slam** (tierA.wayOut null: a gap, reported by the ship card; zooms slam-hips, pickup-back,
  ball-grip; risks): a soft slam ball (drawn without bounce marks, c9); the ball lands between the feet, clear of the
  toes (c10: "be careful not to throw the ball onto your toes"; the ball's outline clear of the near toe by at least
  1 cm); the back flat at the end (trunk 0, c5); no lean back overhead (c2: "make sure not to lean backward", the
  thorax not behind the hips at the start); the face clear of the ball path (c8).
- **farmer_s_carry** (tierA.wayOut c15, c16; zooms shoulders, grip, torso): shoulders back and down (scapulae not
  elevated, c5); arms long at the sides (elbows straight, c4); the torso upright (c4, c9); the weights level and
  beside the body, not in front (c9: no lateral shift; the dumbbells at the hips' depth); knees not locked (c6: a
  soft knee in the stance leg); the steps short (c8, c25).
- **wall_ball** (planned, drawn on its resume; tierA.wayOut null: a gap): the stance at arm's length from the wall
  (c2); the ball close to the body in every pose (c9); the feet on the floor (c17); the chest up and the weight in the
  heels at the bottom (c6); the face clear of the wall and the ball's path (c10).

## 7. Tempo map (D-LIB22-SECS, -TEMPO; 13 Q3, 14.7, D-LIB8M-TEMPO)

Rule: the concentric takes `up`, the eccentric `down`; `Hold` takes `pause` right after the concentric only if
pause > 0; any other static phase, and a cycle plate's Work and Rest, is a constant only with a quote that states its
seconds; a range is the quote's string. Form: pilot A's rows (pilot-a/tempo.json @ `dcac4a38`), in `lb10/tempo.json`.
Order follows the drawn order (start → end). The constant rows carry the claim and the quote verbatim, as
pilot-a/tempo.json does; A7 and A11 build them from the table, never through research/validate.mjs's buildTempo (:171
refuses a moving constant).

| id | card (claim) | phase array (ruled, Q1) |
|---|---|---|
| kettlebell_swing | up 1, down 1, pause 0 (c26) | `[{ phase: 'Drive', s: 1, move: true }, { phase: 'Swing down', s: 1, move: true }]` (the drawn start is the hike, so the hip drive comes first; no Hold) |
| high_knees | null; c8 "To start, aim for 30 seconds, with a 30-second rest between each set." | `[{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 30 }]` |
| battle_ropes | null; c9 "Continue this movement for 30 seconds. Take a 30-second break and repeat for 3–4 reps or move on to the next exercise." | `[{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 30 }]` |
| jumping_jacks | null; c9 "Perform jumping jacks in intervals: 30-60 seconds of work followed by brief rest periods." | `[{ phase: 'Work', s: '30–60', move: true }]` (no Rest: "brief rest periods" states no seconds) |
| bear_crawl | null; c10 "It can be beneficial to crawl for 15 to 30 seconds at a time until you can build up to more." | `[{ phase: 'Work', s: '15–30', move: true }]` (no Rest) |
| jump_rope | null; c16 "Spend 30 seconds practicing jumping rope, followed by 1 minute of rest." | `[{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 60 }]` (ruled: Rest 60 because the quote states "1 minute" of rest after the work) |

- **NOSECS** (D-LIB14-NOSECS unchanged): sled_push, sled_pull, farmer_s_carry, burpee, medicine_ball_slam and wall_ball
  have no tempo row; their specs carry no `tempo`; they stay off rows.json, the page, QA and the critic until the strip
  card is on main and 'LIB-22 resume' (section 15). The scan for "second"/"minute" on all 12 quote files agrees with
  D-LIB22-SECS (sled_pull c12, burpee c23, medicine_ball_slam c12, wall_ball c16: not phases of the drawn rep).
- The range strings keep the quote's own dash: jumping_jacks' quote writes "30-60" with a hyphen; the strip shows
  '30–60' (an en dash, as pilot A's plank row '10–60' from "10–60"). Ruled (Q1): ranges kept as ranges, with an en dash.
- kettlebell_swing has no Rest (13 Q3) and no Hold (pause 0).

## 8. Pose map (13 Q2 (b)), the Mistake's pose and the fault→key map (13 Q1(a))

| id | spec `start` = card | spec `end` = card |
|---|---|---|
| burpee | plate.end (the straight-arm plank) | plate.start (standing after the landing) |
| the other 11 | plate.start | plate.end |

- **burpee** (D-LIB22-POSEMAP): its fault, a hard landing without the knees slightly bent (c11), belongs to the card's
  plate.start, so the spec draws the plank as `start` and the standing landing as `end`, and the Mistake (stiff
  knees) is drawn against that end (plate.mjs:78). Every plateFacts pose goes through the map; a fact with no pose is
  the spec's `end`; the verifier is given the map (rules.md).
- No other id has its fault at the card's start. Checked: wall_ball's fault (standing too far, the body tilting
  forward, c3) is drawn against the spec's end (the squat bottom: the feet further from the wall and the trunk tipped
  forward over them, the wall static). Ruled (Q8): accepted if the fault's claim names the bottom; cited at its resume.
- **Phantoms** (Q2 (c), D-LIB22-DRAW): moving equipment is never drawn in the engine's start layer, so each start
  implement is redrawn dashed in the end pose: kettlebell_swing's start bell, medicine_ball_slam's start ball
  overhead, jump_rope's start rope overhead; and any start limb the end figure covers (sled_push's start rear leg). Ghosts
  follow the joint path; kettlebell_swing's arms are written as joint angles in every key pose (the reach solved once),
  so the hands and the bell swing on arcs, never on straight chords.

Fault→key (13 Q1(a)); each spec's first tell carries the drawn key. Tells are visible signs of the one fault in the
claims' words (CARD-V2:68); the cards' plate.tells are right-pose cues (CARD-V2:37).

| id | plate.mistake (claim; drawable) | drawn key (other tells) | handlingMistakes[0] | topFault |
|---|---|---|---|---|
| sled_push | pushing with a rounded back (c7; true) | `round` "Back rounds" (c7) (`line` "Line breaks": head to hips no longer straight, c3) | the same | `round` |
| sled_pull | torso pitched back, the lower back taking the load (c8; true) | `lean` "Torso pitched back" (c8) (`stack` "Shoulders behind hips", c2) | the same | `lean` |
| farmer_s_carry | steps too long for a beginner (c25, c8; false) | `long` "Steps too long" (c25) (`short`: the stride past the short step, c8) | rushing the walk (c7) | `rush` (F7) |
| burpee | a hard landing, knees not slightly bent (c11; false) | `landing` "Stiff landing" (one tell; record below) | rushing the transitions (c9) | `rush` (F7) |
| jumping_jacks | toes twisted outward (c12; false) | `toes` "Toes out" (one tell; record below) | jerky, uncontrolled landings (c6, c14, c5) | `jerky` (F7) |
| high_knees | knee so high the lower back arches and the trunk tips back (c5; true) | `arch` "Back arches" (c5) (`high` "Knee too high", c5) | the same | `arch` |
| jump_rope | jumping too high over the rope (c9; true) | `high` "Too high" (one tell; record below) | the same | `high` |
| battle_ropes | shoulder blades lift or hunch forward (c6; true) | `shrug` "Shoulders lift" (c6 "elevate") (`hunch` "Shoulders hunch", c6) | the same | `shrug` |
| medicine_ball_slam | slamming with the arms only, hips and knees straight (c4, c3; false) | `arms` "Arms only" (c4) (`legs` "Hips and knees straight", c3, c4) | slamming too softly (c16, c3) | `soft` (F7) |
| wall_ball | standing too far, the ball thrown forward, the body tilting forward (c3, c4; true) | `far` "Too far" (c3) (`tilt` "Body tilts forward", c3) | the same | `far` |
| bear_crawl | hips rise above the back line (c5, c2, c8; true) | `hips` "Hips rise" (c5) (`level` "Hips above shoulders", c2) | the same | `hips` |
| kettlebell_swing | leaning back at the top (c14, c13; true) | `lean` "Leaning back" (c14) (`arch` "Low back arches", c14, c15) | the same | `lean` |

Every drawable-true card's handlingMistakes[0] is its plate.mistake (checked at `596dbe07`; the D-LIB15-XBODY check);
each drawable-false card's handlingMistakes[0] is speed or a sign the plate cannot hold still (D-LIB22-F7).

**One-tell records (D-LIB10-SKULL1; #290 6345185694).**
- jump_rope: fault c9 (jumping too high); claim ids read: c9 (all four quotes: "no more than 1 to 2 inches", "roughly
  1-2 inches", "½” - 1”", "just clear it"), c10 (the knee bend on the way up and down: a different sign, the frog
  hop, its own fault), c11, c12, plate.mistake; no second visible sign stated, so one tell.
- burpee: fault c11 (a hard landing); claim ids read: c11 (five quotes: "land on slightly bent knees", "Land softly
  with bent knees", "Hard landing on jump", "As soon as you land with knees bent"), c8, c13, c17; the one stated sign
  is the knees not bent; no second sign stated (c13's flat feet are the take-off), so one tell.
- jumping_jacks: fault c12 (toes twisted outward); claim ids read: c12 (both quotes), c5, c6, c14; no second visible
  sign stated ("slouching" in the same quote is a separate fault the front view cannot show), so one tell.

## 9. Card keys

Written after 'LB10 NOTE RULED' (Do 6 b), from the ruled sections 7, 8 and 10, on 11 cards (wall_ball gets its keys
after it is drawn, D-LIB22-WALL). Each key is inserted at the end of the card's own bytes, in the file's own indent;
cards.sha.json keeps each card's sha256 without them.

| id | plateFacts (landmark pose/cardPose claim) | tempo | topFault |
|---|---|---|---|
| kettlebell_swing | wrist.l, wrist.r start c2; wrist.r end c24 (CF fix 1) | Drive 1 (move), Swing down 1 (move): plate.tempo up, down | `lean` |
| medicine_ball_slam | wrist.l, wrist.r start c15; toe.l, toe.r start c2 | none (NOSECS) | `soft` (F7) |
| sled_push | wrist.l, wrist.r start c1; ball.l, ball.r start c8; ball.l, ball.r end c8; wrist.l, wrist.r end c9 (CF fix 2) | none (NOSECS) | `round` |
| jump_rope | wrist.l, wrist.r start c2; ball.l, ball.r start c10 (CF fix 3) | Work 30 (move), Rest 60: c16 | `high` |
| sled_pull | wrist.l, wrist.r start c1; sole.l, sole.r start c2 (CF re-verify); sole.r end c3; wrist.l, wrist.r end c4 (CF fix 4) | none (NOSECS) | `lean` |
| farmer_s_carry | wrist.l, wrist.r start c3 | none (NOSECS) | `rush` (F7) |
| burpee | wrist.l, wrist.r start / card end c2 (pose map) | none (NOSECS) | `rush` (F7) |
| high_knees | ball.l, ball.r start c4 (CF fix 5); ball.l end c4 | Work 30 (move), Rest 30: c8 | `arch` |
| battle_ropes | wrist.l, wrist.r start c1; sole.l, sole.r end c13 (CF fix 6) | Work 30 (move), Rest 30: c9 | `shrug` |
| bear_crawl | wrist.l, wrist.r start c3 | Work "15–30" (move): c10 | `hips` |
| jumping_jacks | none (no stated contact; no `[]`, lib4-cards :2316) | Work "30–60" (move): c9 | `jerky` (F7) |

CF fix round (#305 6356860734: 6 accepted findings, 2 rejected: medicine_ball_slam's c15 wrists stay, jump_rope's Rest
stays) added the facts marked "CF fix". validateCardFile gives no problem for the five cards with both plateFacts and tempo, and exactly the :216 problem
("plateFacts and tempo go in together or not at all") for the five NOSECS cards (plateFacts, no tempo, as LB4's do)
and for jumping_jacks (tempo, no plateFacts; D-LIB22-JJ, #305 option 1: held at H6:no-card).

## 10. Facts plan (D-LIB8M-FACTS, 22's scope, D-LIB13-FACTS2, D-LIB22-FACTS, -SIDES)

Read on the copied quotes. A setup quote states the start pose only (D-LIB9-FACTPOSE); the card's plate.start and
plate.end claim citations decide the pose of non-setup quotes only (through the pose map for burpee); a setup
position that is not the drawn start states no fact of it; a contact is never carried to another pose; plural or
paired parts state each side; a grip or hold quote states the hand on the implement at the start, checked at the
wrist (PANELS.md 7). Each contact gets a `checks` entry in its spec (H6).

| id | quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|---|
| kettlebell_swing | "Hinge at your hips and grip the kettlebell with both hands, palms facing down." (c2, setup; "both hands") | `contact wrist.l`, `wrist.r` | start (start) |
| medicine_ball_slam | "Gripping the ball firming, extend your arms and bring the ball overhead." (c15; plate.start cites c15) | `contact wrist.l`, `wrist.r` | start (start) |
| medicine_ball_slam | "on your toes from the force of your drive" (c2, SL); "come up onto your toes" (c2, BodBot) ("toes": both) | `contact toe.l`, `toe.r` (the toe pad on the floor) | start (start) |
| sled_push | "Stand behind the sled and grab hold of the handles with both hands." (c1, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| sled_push | "Ensure that only the balls of your feet make contact with the ground" (c8; plate.start and plate.end cite c8; "feet": both) | `contact ball.l`, `ball.r` | start (start) and end (end) |
| jump_rope | "Grab the handles with a relaxed grip toward the end of the handles" (c2, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| sled_pull (bulk) | "the rope gripped firmly in both hands" (c1, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| sled_pull (bulk) | "think of driving through your midfoot" (c3; plate.end cites c3) | `contact sole.r` (the stepping foot, near side, D-LIB22-SIDES) | end (end) |
| farmer_s_carry (bulk) | "grab each dumbbell" (c3, setup); "wrap your thumb" (c13) | `contact wrist.l`, `wrist.r` | start (start) |
| burpee (bulk) | "place your hands flat on the floor in front of your feet shoulder-width apart" (c2; plate.end cites c2, c3: not a setup step on the card's own reading, its setup list quotes it as a movement step) | `contact wrist.l`, `wrist.r` | start (card end, through the map) |
| high_knees (bulk) | "spring between the ball of each foot" (c4; plate.end cites c4) | `contact ball.l` (the stance foot; the right knee drives, c2) | end (end) |
| battle_ropes (bulk) | "holding one rope in each hand" (c1, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| bear_crawl (bulk) | "Drive palms into the floor" (c3, setup) | `contact wrist.l`, `wrist.r` | start (start) |
| wall_ball (planned) | "a medicine ball held at chest height with both hands" (c1, setup) | `contact wrist.l`, `wrist.r` | start (start) |

jumping_jacks: `[]` proposed: no quote states a contact with equipment or a support, and its numbers are widths (c2,
c4: hip-width, a little wider than shoulder-width) the body model has no fact kind for.

**Not facts**, each with its reason:
- kettlebell_swing c6 MF "hinging your torso until it is parallel with the floor": a segment angle to the floor, not a
  model joint (D-LIB22-FACTS); drawn (START_INCL 90) and held by a check and a drawn-item test. c13 "Maintain a neutral
  spine throughout": no number; drawn trunk 0 in every pose, held by a test. c8 "ankles, knees, hips, and shoulders
  all in alignment": no number; held by a collinearity test. c9 "about chest height": a height (a size: the bell
  centre at the chest landmark's height). c1 "about a foot in front of you", "12 to 18 inches": the bell's setup place
  on the floor, a setup position that is not the drawn start (the hike). c5 "forearms close to thighs": a body part
  against the body, not equipment or a support; held by a test. c6, c5 "knees slightly", c7 "arms straight": no number.
- medicine_ball_slam c1 (feet, knees, the ball at the chest): the setup position, not the drawn start (the ball
  overhead) (D-LIB22-FACTS). c3 "straight down between your feet": a place of the ball, not a body contact; held by a
  check (the ball between the feet, on the floor). c2 "arms extended", c5 "back flat", c4 "Bend your knees and hips":
  no number.
- sled_push c1 BarBend "about halfway down", Fitness Volt "roughly their center": a place on the handle; held by a
  check (the grip at the handle's middle ±1 cm). c3 BarBend "your spine is parallel to the ground": a segment angle to
  the floor; drawn (TRUNK_INCL 90) and held by a check. c9 "the same body angle through the entire push" and c11 "Keep
  your arms in the same position throughout, whether that's straight or bent": "throughout" with no number (and c11
  an "or" choice); held by a test (the trunk inclination and elbow equal in start and end). c4 "either with your arms
  straight or elbows flexed" and c12 "underneath or just behind your hips": "or" choices (D-LIB17-ORCHOICE); the plate
  draws straight arms (BarBend's and Fitness Volt's "locked") and the stance foot just behind the hips. c3 "shoulders
  straight behind your hands": a place; held by a check (the shoulder at the grip's height ±1 cm).
- jump_rope c9 "1 to 2 inches": a height, a size (D-LIB22-FACTS). c4 "feet together", c8 "hip height": widths and
  places. c5 "elbows ... close to the ribs": body on body. c10 "slight bend": no number.
- The bulk ids' not-facts lists follow the same rules at the bulk (D-LIB22-FACTS lists the candidates: high_knees c3
  and wall_ball c6 bounds, held by checks since PANELS.md 7 has no bound form; bear_crawl c3, c4 and wall_ball c2
  distances, sizes; jumping_jacks c5 and wall_ball c6 "or" choices; sled_push c4 and c12 above).

## 11. Size table (D-LIB22-SIZE; `lb10/sizes.json`)

Every number a card does not give, fixed before PQ-H3, each with its basis (a claim, an approved plate's file:line,
or a stated reason in numbers; never PQ-H3). Each drawn spec exports its table as `SIZES` and each composer its
constants; A17 compares them with `lb10/sizes.json` both ways and checks every basis. The spec headers list them under
"Unsourced numbers". kettlebell_swing and `kettlebell` are in sizes.json with full bases now; the other three slice
ids' rows are written with the slice, and the bulk rows below are proposals [proposed], written at the bulk.

| id | name | value | basis (short) |
|---|---|---|---|
| kettlebell_swing | FOOT_X, TOE_OUT | 0.18 m, 17° | upright_row.mjs:44 (#109): the widest stance the rigid foot allows (contact ≤ 0.5 cm), for c1 "about shoulder-width", c1 HK "toes pointed slightly outward" |
| kettlebell_swing | KNEE | 15° | romanian_deadlift.mjs KNEE (#109 @ `dcac4a38`, the hinge's "about 15 deg") for c6 "knees only slightly bent" |
| kettlebell_swing | START_INCL | 90° (the shoulder-hip line level) | c6 MF "hinging your torso until it is parallel with the floor" (held by a check) |
| kettlebell_swing | GRIP_T | 0.35 | stated: c5 "high into the groin, forearms close to thighs": the straight arms aim at the near thigh's axis a third of the way down from the hip |
| kettlebell_swing | GRIP_X | 0.045 m | c2 "both hands next to each other on the handle": the hand centres 9 cm apart (stated, one hand breadth) |
| kettlebell_swing | BAL_Z | the ankle joint's z | c17 GGR "the weight back on your heels": the body and bell balance over the ankle (heel side of mid-foot) in the hike and the via poses |
| kettlebell_swing | VIA1, VIA2 | [55°, 12°, −5°], [22°, 5°, 45°] (trunk incl, knee, arm angle) | c5 HK "the small triangle above your knees" (the bell between the knees on the way through); c7 "drive hips forward ... propel the bell forward" (the bell in front at hip height with the hips still flexed); ghosts only |
| kettlebell_swing | END_PHI | solved 83.4° | c9 "about chest height": the bell centre at the chest landmark's height |
| kettlebell_swing | END stack | root over the ankles, knees 0 | c8 "vertically stacked with your ankles, knees, hips, and shoulders all in alignment"; HK "pulling your kneecaps up strongly" |
| kettlebell_swing | M_TILT, M_ARCH | −14°, −12° | hanging_leg_raise.mjs:69 (the 8's approved arch and lean: tilt −14, trunk −12), for c14 "leaning backward at the top" |
| kettlebell_swing | BELL_KG (solved), BODY_KG, TOP_KNEE | 16.04 kg, 75 kg, 1° | the drawn bell's mass (bellMass, NOTE RULED 7) sized to c25's 16 kg; lb7/sizes.json weighted_dip (#299); c8 HK knees straight |
| kettlebell | bodyD, reach, hornT, neckW, baseFlat, handleW, density | 0.162, 0.151, 0.033, 0.07 m; 0.6; 0.10 m; 7.2 kg/L | stated: a solid cast-iron bell of c25's 16 kg (sizes.json bases); bellMass gives 16.04 kg |
| medicine_ball_slam | BALL_D | 0.23 m | stated: a 4.5 kg (10 lb, c11) slam ball about 9 in across |
| medicine_ball_slam | FOOT_X, TOE_OUT | 0.12 m, 10° | c1 (shoulder-width / ACE hip-width); the widest whose rigid-foot contacts stay within 0.5 cm |
| medicine_ball_slam | START on toes | heel-up 45°, the toe pad on the floor | reverse_lunge.mjs:52 REAR_HEEL 45 (#109) for c2 "on your toes" |
| medicine_ball_slam | START arms, START_KNEE | straight, the hands on the ball's sides; 2° | barbell_overhead_press (#109) lockout; c2 "ball overhead, arms up", "Extend your knees" |
| medicine_ball_slam | START_Z (solved), BALL_KG, BODY_KG | 0.181 m; 4.5 kg; 75 kg | c2 "hips slightly forward ... on your toes": balanced over the forefoot with the ball overhead; c11's 10-pound ball |
| medicine_ball_slam | END_ARM; END_INCL, END_Z (solved); VIA_N | 0.97; 41.6°, −0.19 m; 5 | c3, c4 (the hands follow the slam down); c5 ACE spine parallel to the shin; balance; c3's arc |
| medicine_ball_slam | M_INCL, M_FLEX | 10°, 30° | c4 "arms only ... without bending the hips and knees" (stated) |
| sled_push | TRUNK_INCL | 90° | c3 BarBend "your spine is parallel to the ground" (held by a check) |
| sled_push | HIP_Y, POST_X | 0.80 m, 0.25 m | stated (sizes.json); the hands level with the shoulders (c3), at the posts' middle (c1) |
| sled_push | FAR_DZ, REAR_KNEE, FRONT_DZ, VIA_LIFT | −0.12, 10°, 0.10, 0.12 m | c12 (just behind the hips), c12 (driving leg), c10 (short steps), c8 (knees high) |
| sled_push | HEEL_UP | 15° | c8: the largest heel-up whose ball stays within the 1 cm contact (0.9 cm), heels 5.7 cm up |
| sled_push | PX_PER_M, HUMP, M_Z (solved) | 126 px/m, 0.06 m | framing (the scene's width); romanian_deadlift's HUMP guide; the Mistake's arms still reach the posts |
| sled_push | M_ROLL | 25° lumbar flexion | leg_press.mjs:87 (the 8's rounding, M_ROLL 25) for c7 "a rounded back" |
| sled | len, body, runners, struts, posts, horn, plates, bracket, hitch | (sizes.json) | stated: a push sled 80 cm long, posts to 1.47 m (solved from the grip at their middle) |
| jump_rope | HOP | 0.038 m (1.5 in) | c9 "1 to 2 inches": the midpoint (the range is 1 in wide, under PANELS.md 7's 4: a size, not a fact) |
| jump_rope | KNEE_SOFT | 15° | leg_press.mjs:13, :23 ("knees 15 deg short of lockout") for c10 "slightly bent" |
| jump_rope | HAND_OUT, HAND_FWD, FOOT_X | 0.12, 0.05, 0.05 m | c8, c5 Elevate, c4 |
| jump_rope | M_HOP | 0.15 m | stated: c9 "you aren't in a high jump competition": four times c9's 2 in top, a tuck-free jump [proposed] |
| jump_rope, jumpRope | ROPE_LEN, OVER_W (solved); OVER_CLEAR, UNDER_W, FLOOR_GAP; handleLen, handleT, ropeT | c1's length, the overhead arc as long as the rope; 0.10, 0.32, 0.004 m; 0.15, 0.026, 0.005 m | c1, c4, c9 (sizes.json) |
| all side-view soft knees | KNEE_SOFT | 15° | leg_press.mjs:13, :23 (D-LIB16-LOCK's rule) for sled_pull c2, burpee c11, high_knees c1/c4, battle_ropes c2 [proposed] |
| sled_pull | ELBOW_BEND | 18° | machine_chest_press.mjs:45 for c1 "arms slightly bent" [proposed] |
| sled_pull, high_knees | M_TILT, M_ARCH | −14°, −12° | hanging_leg_raise.mjs:69 for c8 "pitch your torso back" and c5 "arch into your back" [proposed] |
| bear_crawl | KNEE_HOVER, STEP | 0.05 m, 0.05 m | c3 "lift knees 2 inches", c4 "2 inches" |
| bear_crawl | M_HIP | 30° | mountain_climbers.mjs:88 HIKE_HIP 30 (#109) [proposed] |
| battle_ropes | M_ELEV, M_PRO | 3 cm, 3 cm | pull_up.mjs:36's ±3 cm reversed (as LB7 cable_rear_delt_fly) [proposed]; ROPE_T 0.038 m (c8, 1.5 in) |
| high_knees | END thigh | 90° hip flexion (the bound) | c3 "at least 90 degrees of flexion" [proposed] |
| farmer_s_carry | STRIDE, M_STRIDE | 0.35 m, 0.70 m | stated: c8 "short, deliberate steps" vs c25 "regular-sized steps" [proposed] |
| jumping_jacks | M_ROT | 30° external hip rotation | stated: c12 "twisting your toes outward": past the start's toes forward [proposed] |
| wall_ball | STAND_DIST | 0.57 m (22.5 in, the toes to the wall) | c2 Box Life "20-25 inches" midpoint (5 in wide ≥ 4: a size) [proposed] |

## 12. Balance bases and trace points (D-LIB22-BALANCE, -TRACE)

Balance: the Winter (2009) centre of mass (single_leg_romanian_deadlift.mjs:19-36 @ `dcac4a38`) on the drawn
landmarks, plus any carried load at its contact. Test: inside the base where it spans two contacts; ±2 cm where it is
a point. Bases, each with its claim:

| id | pose(s) | base (claim) | measured at this head |
|---|---|---|---|
| kettlebell_swing | start, via, end, Mistake | the feet, heel to toe (c1), with the drawn bell (16.04 kg, bellMass) at its centre | start −0.077 m (solved over the ankle, c17), via −0.077 / −0.077, end +0.090, Mistake −0.012 (heel −0.115, toe +0.126); body alone +0.012 / −0.094 / −0.182 / −0.043 / −0.129 (logged) |
| medicine_ball_slam | start, end, Mistake | on the toes the forefoot (ball to toe; c2), the 4.5 kg ball overhead in the hands; flat feet heel to toe at the end and in the Mistake (the ball on the floor, not carried) | **measured**: start +0.093 m (solved over the forefoot, ball +0.061 to toe +0.124: START_Z), end +0.014, Mistake −0.021 (heel −0.117, toe +0.131) |
| sled_push | start, end, Mistake | between the stance foot's ball and the hands on the posts (c1, c3, c12): the sled takes the lean | **measured**: inside in every pose (a test) |
| jump_rope | start | both feet (c4) | [est] inside; the hop is airborne: logged only (plan 2.2:157) |
| sled_pull | all | the feet, with the rope's light tension (c1, c2) | bulk |
| farmer_s_carry | all | the stance foot, or both feet in the step, with both dumbbells (c3, c8) | bulk |
| burpee | start (plank), end (standing) | the hands and toes (c2, c3); the feet (c1) | bulk |
| jumping_jacks | start, end | both feet (c2, c4) | bulk |
| high_knees | end, Mistake | the stance foot's ball (c4) | bulk |
| battle_ropes | all | the feet (c1) | bulk |
| bear_crawl | all | the hands and feet down in each pose (c3, c4) | bulk |
| wall_ball | all | the feet, with the ball at the chest (c1, c6) | planned |

Trace points (sizes.json `trace` rows):

| id | point | source |
|---|---|---|
| kettlebell_swing | `grip.r` (the bell's handle, in the fists; the bell centre is not a landmark and hangs 19 cm on along the same arm line) | plate.frames "the bell arc can be traced" |
| medicine_ball_slam | `grips` (the hands on the ball, overhead to the ball on the floor) | c3, slammed straight down between the feet |
| sled_push | `ball.r` (the rear foot, driven through) | c8, c10; plate.end "the rear foot driven through to the front on the ball of the foot" |
| jump_rope | `sole.r` (the feet clearing the rope) | c9; plate.frames "the turn is not traced" |
| sled_pull | `ball.r` (the stepping foot) | plate.frames "Trace follows the stepping foot" |
| farmer_s_carry | `ball.r` (the stepping foot) | c8 |
| burpee | `ball.r` (the feet jumping in under the body, plank → standing) | c5 "Jump your feet in and under your body" |
| jumping_jacks | `grip.r` (the hands rising overhead) | c2 |
| high_knees | `knee.r` (the driving knee) | plate.frames |
| battle_ropes | `grip.r` (the near hand) | plate.frames |
| bear_crawl | `wrist.r` (the stepping hand) | plate.frames |
| wall_ball | `hips` (into the squat) | c6 |

## 13. PQ-H3 (deviationMin 11.39 px, traceLenMin 22.11 px; qa/envelope.json) and the front view

| id | Mistake: largest tell-anchor move, end → Mistake | Trace |
|---|---|---|
| kettlebell_swing | **measured 49.7 px** (tell `lean` on the head) | **measured 186.3 px** (the handle's arc) |
| medicine_ball_slam | **measured 83.7 px** (the hands; at 134 px/m) | **measured 314.7 px** |
| sled_push | **measured 34.7 px** (tell `line` on the dropped head; `round` on the Mistake back (`backMid`, Mistake pose)) | **measured 45.9 px** (the driving foot's ball; at 126 px/m) |
| jump_rope | **measured 16.4 px** (the feet, 0.15 − 0.038 m) | **measured 5.3 px** (the hop, 3.8 cm at 146.29 px/m): **below traceLenMin**, held (S2) |
| sled_pull | [est] over 20 px | [est] about 45 px |
| farmer_s_carry | [est] about 50 px (the stepping foot) | [est] about 50 px |
| burpee | [est] **5-7 px** (the knee, 15° → 0°): **likely below deviationMin**, held (S2) | [est] over 100 px |
| jumping_jacks | [est] about 15 px (the toe, 30°) | [est] over 100 px |
| high_knees | [est] about 25 px | [est] about 60 px |
| battle_ropes | [est] **about 4-7 px** (3 cm scapulae; LB5's 5 cm shrug measured 7.3 px): **likely held** (S2) | [est] about 50 px |
| bear_crawl | [est] over 30 px | [est] **about 10 px** (2 in at ×1.35): **below traceLenMin**, held (S2) |
| wall_ball | [est] over 20 px | [est] about 60 px |

A too-small fault or Trace is reported with its card-true size and held under D-LIB8-shrug (D-LIB22-SIZE, S2), route
LIB-ZOOM; never enlarged, widened, cropped, re-scaled or moved to another point.

**Front view (D-LIB22-FRONT, S4).** jumping_jacks' 'Soft knees' (c5, c6) and 'Shoulders over hips' (c5), and
jump_rope's slightly bent knees (c10) and its tell anchors at the knees, are sagittal signs: in the engine's front
view a sagittal knee bend foreshortens to a few pixels and the shoulder-over-hip stack is a fore-aft position the
front view cannot show. Their knees are drawn at the sized bend (KNEE_SOFT 15°, never 0°) and no test pretends it
shows. The view is never changed, no joint is bent out of its plane, and no checkpoint is dropped. **Ruled (#305
6356763967): accepted**; no callout or test may claim the bend shows in the front view; c10 is carried by the drawn
angle and the cue text; jumping_jacks follows the same rule.

## 14. H slice (Do 2; D-LIB22-SLICE)

kettlebell_swing (eq/kettlebell.mjs), medicine_ball_slam (eq/medBall.mjs), sled_push (eq/sled.mjs) and jump_rope
(eq/jumpRope.mjs), drawn on this branch; their renders (390 px, Paper and Silent Black, beside the closest approved
plate or anchor), unit tests, the two-build plates-page sha256, the QA table for the rows on rows.json, the measured
H3 values beside the size rows, the balance offsets and report.mjs per plate go in 'LB10 SLICE READY'. Only
kettlebell_swing has a strip from the start; the other three render only from `lb10/build.mjs --held`.

## 15. Held ids and NOSECS rows

| id | ruling | why | route |
|---|---|---|---|
| sled_push, sled_pull, farmer_s_carry, burpee, medicine_ball_slam | D-LIB22-SECS (D-LIB14-NOSECS) | tempo null, no quote states seconds of a drawn phase | the strip card on main, then 'LIB-22 resume' |
| wall_ball | D-LIB22-WALL; D-LIB22-SECS | `wall` is on #289 (open); tempo null | #289 on main, then 'LIB-22 resume' (drawn); the strip card for its row |
| any cycle row whose constant is not ruled | D-LIB22-SECS | | the ruling or the strip card |
| jump_rope | D-LIB8-shrug (D-LIB22-SIZE, S2) | the card-true hop (1.5 in, c9) gives a Trace of **5.3 px** < 22.11 px (measured); its Mistake passes (16.4 px) | LIB-ZOOM (#279) on main, extended to the motion |
| burpee, battle_ropes, bear_crawl [est] | D-LIB8-shrug (S2) | Mistake or Trace likely under the minimum (section 13) | LIB-ZOOM |

Held rows are in no rows file; their specs, tests and card keys stay. Each is confirmed or cleared by measurement.

## 16. Risks and mitigations

1. **Small motions** (jump_rope's hop, bear_crawl's 2-inch step, battle_ropes' shoulder blades, burpee's knee bend):
   held under D-LIB8-shrug with the LIB-ZOOM route; never enlarged.
2. **Ballistic balance** (kettlebell_swing): with the bell hiked far back, a static balance puts the hips only about
   12 cm behind the ankles; the plate balances the hike over the ankle (c17, heels) and the top stacked over the
   ankles inside the base (+0.097 m, toe +0.126 m). If the critic reads the hike as too upright, the conflict between
   "hips pushed back" (c6) and a static balance is posted as S3 with the numbers; never moved off the card.
3. **The hike behind the top** (kettlebell_swing): the dashed start (the hinge, the plate's first two checkpoints)
   lies partly behind the solid standing figure; ghosts limited to the arm and bell, the start bell redrawn dashed;
   the critic judges R1/R5.
4. **S3 on sled_push** [unverified until drawn]: the lean parallel to the floor (c3), the shoulders level with the
   hands (c3), the grip at the post's middle (c1) and the heels off the floor (c8) fix the post height; posted if any
   two cannot hold.
5. **S7 on sled_pull**: main's rope.mjs strand is written for a short triceps rope; a long sled rope with a sag may
   need an edit: renders and the needed change posted; never forked.
6. **Front-view signs** (S4, ruled D-LIB22-FRONT, #305 6356763967): jumping_jacks' and jump_rope's knees are drawn at
   KNEE_SOFT 15°, never 0°; a sagittal bend cannot show in a front view, so no callout or test claims it shows there;
   c10 is carried by the drawn angle and the cue text.
7. **The sled's step: a drag** (sled_pull's plate.frames: "the rear foot stepped back with the sled a little closer").
   Ruled (Q9): the sled follows the lifter by the hips' displacement, so the rope length stays constant. A drag test (the
   sled shift equals the hip shift, the rope length unchanged) with a static-sled mutation; the start sled and rope
   drawn dashed. A static sled would lengthen the rope: not card-true.
8. **Shared appends**: docs/COACHING-DECISIONS.md is append-only; conflicts keep both sides.
9. **CI RPC**: the test file carries the afterEach yield, the per-spec yield and the child-process renders from its
   first commit (D-LIB22-TESTS).

## 17. Questions for the supervisor (ruled: 'LB10 NOTE RULED', #305 6355155831)

1. The tempo map (section 7, `lb10/tempo.json`): kettlebell_swing's Drive/Swing down; the five cycle constants, in
   particular jump_rope's Rest 60 ("1 minute") and the range strings' en dash.
2. The pose map (section 8): identity for 11; burpee per D-LIB22-POSEMAP.
3. The fault→key map (section 8), the four F7 topFault keys (`rush`, `rush`, `jerky`, `soft`) and the three one-tell
   records.
4. The facts plan (section 10): medicine_ball_slam's toe contacts (c2 "on your toes"), sled_push's ball contacts at
   start and end (c8 cited by both), burpee's palm contacts through the map, kettlebell_swing's c13 "neutral spine
   throughout" as not a fact.
5. The size table (section 11 and sizes.json): the slice values; the bulk proposals marked [proposed].
6. The trace points (section 12): kettlebell_swing at the handle (`grip.r`), medicine_ball_slam at the hands on the
   ball, burpee at the feet.
7. The balance bases (section 12), in particular kettlebell_swing's over the ankle (c17).
8. wall_ball's Mistake drawn against the squat bottom (section 8).
9. sled_pull's static sled with the lifter stepping back (risk 7).

**Ruled (#305 6355155831), and what the slice does with it:**
1. Tempo: accepted. jump_rope keeps Rest 60 (its quote states "followed by 1 minute of rest"); no other card has a Rest.
2. Pose map: identity for 11; burpee per D-LIB22-POSEMAP.
3. Fault keys, the F7 keys and the one-tell records: accepted as named flags.
4. Facts: medicine_ball_slam's toes at the start only; sled_push's balls of the feet at start and end ("Your heel should
   never touch the ground" counts as throughout); burpee's palms through the map; kettlebell_swing c13 not a fact.
5. Sizes: accepted on the usual terms (sizes.json both ways, no PQ-H3 basis).
6. Trace points: accepted with their claim bases (sizes.json `trace` rows).
7. Balance: kettlebell_swing's balance includes the **drawn bell's mass** at its centre: the bell's mass now comes from
   its drawn size (eq/kettlebell.mjs `bellMass`, cast iron, 16.04 kg; the drawn bell resized to 16.2 cm so its mass is
   c25's 16 kg), and the centre of mass stays inside the heel-toe base in start, both via poses, top and Mistake
   (measured in section 12; a test).
8. wall_ball's Mistake against the squat bottom, if its claim names the bottom: checked at its resume (c3, c4).
9. sled_pull is a drag: in the end pose the sled moves in the walking direction by the hips' displacement, so the rope's
   length and its light tension stay constant; the Trace follows the stepping foot (bulk).

## 18. Named nits: jump_rope's ring (D-LIB22-HOPNIT; #305 6355887979, widened 6356244552)

In jump_rope's end view (front, top of the hop) the drawn rope runs from handle to handle under the feet. The dashed
start rope (the phantom) runs from handle to handle over the head. Together they close a ring around the whole figure,
so every anchor on the body sits inside it.

**Scans** (box left 16–330, top 24–330 in 12 px steps, then 8 px steps; the renderer's own checks; no crossing of
the end or Mistake figure; 6 px from the Trace, the floor and every equipment outline, the leader's first 8 px exempt):
- `hop` (anchor `ankle.r`, also `knee.r`): 0 placements that clear the rope;
- `elbows` (anchor `elbow.r`) and `hands` (anchor `grip.l`), with the phantom added to the avoided lines: 0 placements.

**Ruled exceptions** (exactly four; A15 names each with its view and line; `high` added by #305 6356835486 after
the anchor moved onto the raised Mistake sole, item 1 of 6356763967: 0 placements clear the rope there):

| callout | line | box | crossings | angle | leader |
|---|---|---|---|---|---|
| `hop` | the rope strand | left 80, top 304 | 1 | 57.7° | 28.2 px |
| `elbows` | `startrope` | left 24, top 152 | 1 | 89.8° | 43.5 px |
| `hands` | `startrope` | left 240, top 184 | 1 | 70.8° | 36.5 px |
| `high` (Mistake view) | the rope strand | left 208, top 304 | 1 | 83.4° | 29.3 px |

Limits: one crossing of the named line at 45° or more; no other crossing (text, end figure, Mistake figure, another
line); 6 px from everything else. Mutations, each red: a fifth exception (one not needed), an exception moved to
another id, and a second crossing on each of the four. The guide arrow stays 24 px beside the raised sole; the anchor
test never counts a guide arrow (`m-arrow`) as an anchor's part.

Also from this check (card line 243, "never cross … the start phantom"): medicine_ball_slam's `overhead` crossed its
own phantom ball once. It is now anchored on the phantom ball's edge (`grip.r` start, `off [-15.41, 0]`, the drawn
radius 0.115 m × 134 px/m), accepted in 6356244552. No other plate crosses its phantom.

## 19. 3D body checks (#305 6356763967 items 2-3; 6356835486; correction 6357040314)

Segments as capsules of radius RADII × H (body.mjs:28), the foot a heel–toe capsule of half-width WINTER.footW·H/2.

- **kettlebell_swing, D-LIB22-HIKE3D (ruled option (i)).** At the hike the forearms press into the thighs (c5 "high
  into the groin, keeping forearms close to thighs"); the rigid thigh capsules meet near the groin, so no card-true
  hike clears them. Measured at FOOT_X 0.18: start −11.1 cm, via0 +9.8, via1 +31.5. The exception covers body
  against body only (forearm or upper arm against thigh), in the start and the ghosts next to it, capped at 11.1 +
  0.5 cm; never equipment, never the bell against the body (D-LIB22-FRAME's 1 cm). The cap sits 0.7 cm from the
  geometric limit (forearm and thigh axes meeting, −11.85 cm), so the mutation lays a forearm along the thigh's axis.
  via0's bell sits 12.8 cm below the knees and clears the thighs by 11.4 cm; its basis is re-cited to c5 BarBend
  "sweep the kettlebell back between your legs" (3b).
- **Stance, D-LIB22-STANCE amended (6357040314, ruled).** 0.227 m failed the engine's rigid-foot plant (contact errors
  0.6-1.6 cm, over the 0.5 cm limit; my first S3 table had quoted spec checks, not plant contacts). Each stance is the
  widest the plant holds within 0.5 cm, pinned by a test with a 1 cm wider mutation: kettlebell_swing 0.18 (0.185:
  0.6 cm); medicine_ball_slam 0.13 (0.13: 0.5 cm; 0.135: 0.6 cm), so the ruled "0.12" is corrected to the measured
  limit and its 1 cm wider mutation turns red as asked.
- **medicine_ball_slam's ball, option (c).** BALL_DZ 0.07: the ball's centre 7 cm in front of mid-foot, still between
  the feet (c3). 3D clearances: end foot +1.1, shank +0.8 cm; Mistake foot +1.2, shank +4.3 cm (centred: shank −1.6,
  the mutation). Re-measured: H3 deviation 83.7 px, Trace 314.7 px; balance start +0.092 m (ball 0.061 to toe 0.124),
  end +0.017, Mistake −0.022; report.mjs ok:true.
