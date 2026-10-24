# LB9 H plates: design note (LIB-21)

Card: `docs/supervisor/verify/lib-21-card.md` on `claude/sup-lib4-cards` @ `760f774f` (Do 1), with its D-LIB21-*
rulings (all confirmed as written in 'LIB-21 start', 2026-10-24) and lib4-cards sections 12-33. Plan:
`claude/howto-options` @ `b41ac833`. Research head (D-LIB21-HEAD, named in 'LIB-21 start'): `claude/libht-research` @
`f574bb4b761ded9010a61b59881b6eae125b58e0`; the 8 cards and quotes are byte copies from it (`lb9/cards.sha.json`),
byte-identical to `8e4e7769` (checked at the start). Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`.
Patterns copied with `git show`, never imported: LB10 (#305 @ `a9c64e11`), LB8 (#306 @ `d76fc305`), LB1 (#245 @
`9e5d9666`), pilot A (#109 @ `dcac4a38`). Base: main `0f1f73de`.

Nothing here ships (D-LIB21-AHEAD): every LB9 row stays at stage `drawing` or `review` in `lb9/rows.json`, outside
`batches/`; `tests/howto/lb9-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids with a tempo
strip (A5).

Scope in this start ('LIB-21 start'): slice = ab_wheel_rollout, cable_crunch and bird_dog (bird_dog added as the
first quadruped plate on a floor camera); bulk = superman and pallof_press; group (b) side_plank, russian_twist and
bicycle_crunch held for LIB-20 (D-LIB21-ER5). Values marked **measured** come from the engine (renderPlate report,
qa/node.mjs `deviation`, the Trace path, the Winter centre of mass) at this head; values marked [est] are estimates.
QA evidence counts only after Do 6's verdict (Do 2).

Not in this card (each in no LB9 file; A5 tests it):
- plank (pA): pilot A's #109 plate, redrawn there to "Hips hiked up." and pinned with its 12 (D-LIB8M-PLANKREDRAW,
  D-LIB21-PLANK). Read here as a pattern and an anchor only.
- crunch (P:SUPCORE, pB): pilot B's #278 plate (specs/crunch.mjs), reused as pilot B pins it (D-LIB21-TEMPLATES).
- reverse_crunch, dead_bug, v_up, flutter_kicks, hollow_body_hold (T): SUPCORE children; they start after crunch is
  owner-approved and the SUPCORE template exists (anchor rule :293-294; D-LIB10-TEMPLATES). flutter_kicks is LIB-STRIP's
  row for the later LB9 T card (D-STRIP-NOTSCOPE).

## 1. Engine and modes

- **Engine.** Every LB9 spec imports only `tools/plates/library/engine.mjs`, the LB9 composer `eq/abWheel.mjs`, and
  main's `eq/parts.mjs` and `eq/rope.mjs` (D-LIB9-ENGINE, D-LIB21-ROPE). Code from the 8, pilot A and LB heads is
  copied, never imported (D-LIB9-CLONE; A3). Every copied root finder throws when it finds no root.
- **Modes: all 8 are H; no D row** (plan 6.2 :718 "H9", :756-758). A D spec is its parent with only PARAMS set
  (derive.mjs:4-12: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness, stance.width).
  Each id needs at least one thing outside PARAMS (each alone makes it H; plan 3.1:272):

| id | census closest | outside PARAMS |
|---|---|---|
| cable_crunch | hanging_leg_raise | pose class kneel, not hanging; equipment: cable column and main's `rope`, no bar; motion: spine flexion with still hips, not hip flexion |
| ab_wheel_rollout | hanging_leg_raise | pose classes kneel and plank; equipment `abWheel` (new) and a knee pad, no bar; motion: a roll-out to a straight line |
| bird_dog | hanging_leg_raise | pose class quadruped on the floor; no bar; motion: opposite arm and leg raised; floor camera |
| superman | hanging_leg_raise | pose class prone on the floor; no bar; motion: arms and legs lifted a few inches |
| pallof_press | seated_cable_row | pose class standing, not seated; equipment single handle side-on to the column; motion: a press out, anti-rotation hold |
| side_plank (b) | hanging_leg_raise | `root.roll` (LIB-20), front view, the hold convention |
| russian_twist (b) | hanging_leg_raise | `trunk.yaw`, `root.yaw` (LIB-20), front view, floor-sit, `medBallOptional` (new) |
| bicycle_crunch (b) | hanging_leg_raise | `trunk.yaw` (LIB-20), front view, supine |

- **No D row** (Do 3): none of the 8 is its closest with PARAMS only.

## 2. Per id

| id | group | clone (D-LIB21-CLONE) | composer | hand (ship-time gap) | state |
|---|---|---|---|---|---|
| ab_wheel_rollout | a, slice, tier A | hanging_leg_raise; plank (#109), assisted_pull_up (#245), bear_crawl (#305) | `abWheel` (this PR) | push: ab-wheel gap (hand-ab-wheel.mjs:4) | drawn |
| cable_crunch | a, slice | hanging_leg_raise; rope_triceps_pushdown (#109), assisted_pull_up (#245) | main's `rope` | on-body: rope gap (hand-rope.mjs:34) | drawing |
| bird_dog | a, slice | hanging_leg_raise; plank, mountain_climbers (#109), bear_crawl (#305) | none (a mat bar, eq/parts.mjs) | palm-flat: main's shared key (hand-palm-flat.mjs:27) | drawn |
| superman | a, bulk | hanging_leg_raise; plank (#109) | none (a mat) | none | after 'LB9 BULK GO' |
| pallof_press | a, bulk | seated_cable_row; rope_triceps_pushdown's column (#109) | vendor `cableColumn`, single handle | hold: d-handle gap (hand-d-handle.mjs:30) | after 'LB9 BULK GO' |
| side_plank | b | hanging_leg_raise; upright_row (front view) | none | none | after LIB-20 on main |
| russian_twist | b | hanging_leg_raise; resistance_band_row (#245), upright_row | `medBallOptional` (at resume) | on-body | after LIB-20 on main |
| bicycle_crunch | b | hanging_leg_raise; crunch (#278), upright_row | none | none | after LIB-20 on main |

Hands: no hand module is built (D-LIBHANDS-COUNT); the gaps go to the ship card.

## 3. Composers (Do 4; D-LIB21-COMPOSERS, -FRAME, -IMPLEMENT)

- **`abWheel`** (`eq/abWheel.mjs`, this PR; single use, plan 2.1:141): returns PRIMITIVES `poly` items only, through
  perItem (parts.mjs:35):
  - the wheel: a closed `poly` circle (curve), 18 cm across, standing on the floor (axle at its radius), z `center`.
    It moves start → end, so it is a `poly`, never `pulley` (equipment.mjs:300 has no `poly`). It does not move
    between the end and the Mistake (the arch keeps the shoulders, hands and wheel; section 8).
  - the hub: a `poly` circle on the axle.
  - the two handles, a pair (D-LIB18-PADS): each a tube on the axle line from the hub face to 6 cm past the hand's
    grip centre; side view shows each end-on on the axle. The far one sits behind the far fist (z `back`); the near one
    is an outline drawn over the near fist (z `front`), as hanging_leg_raise draws its bar end-on (:118-119).
    `abWheelGeometry` gives the solids (disc, tubes) for the 3D tests.
  - the knee pad (`kneelPad`): a flat 3 cm pad on the floor under the knees, shins and feet (parts.mjs `sideBar`, the
    vendor `backPad` primitive), static.
  - Joins (D-LIB21-FRAME): both handles meet the hub face on the one axle; the pad lies on the floor line.
  - **D-LIB21-KNEEPAD (ruled Q1):** the ruling names the vendor `kneePad` for the pad. `kneePad` is an
    11 cm roller (equipment.mjs:203-204, "knee / thigh roller pad"), a leg-curl roller, not a flat kneeling pad, so
    drawing it would misstate the card's "a soft pad under the knees" (c1). The flat pad is drawn with existing
    primitives (D-LIB21-COMPOSERS' "compose from existing parts"). Accepted ('LB9 NOTE RULED', #312 6382248634).
- **`rope`** (main's eq/rope.mjs, imported, never edited; D-LIB21-ROPE): cable_crunch's rope from the high pulley,
  strands beside the head. Any edit it would need is S7.
- **Cable column** (pallof_press, cable_crunch): vendor `cableColumn` and `stack`; pallof_press's single handle is a
  `poly` (it moves from the chest to arm's length).
- **`medBallOptional`**: built at the (b) resume (Do 7b), a `poly` circle with a sized diameter; #305's eq/medBall.mjs
  read as a pattern only.
- Mats: bird_dog's and superman's mats are side bars on the floor (parts.mjs `sideBar`), static; not composers.

## 4. Pose-class, rig and convention anchors (depends_on; D-LIB21-CLASSES, -FLOOR, -FRONT)

All are sheet or merge gates, not drawing gates, except LIB-20 for the (b) rows.

| id | pose class (anchor, pinned first) | rig / convention |
|---|---|---|
| cable_crunch | kneel (assisted_pull_up, LB1) | `rope` (rope_triceps_pushdown, pilot A) |
| ab_wheel_rollout | kneel (assisted_pull_up); plank class (plank, pilot A; push_up, pilot B) | `abWheel` (its own plate, LB9 sheet) |
| bird_dog | quadruped: **first user**, approved on the LB9 sheet (bear_crawl waits for it) | hold convention (plank); D-LIB8-floor |
| superman | prone (lying_leg_curl, LB8, held on LIB-18 for `legCurlMachine`: superman may roll [est]) | D-LIB8-floor |
| pallof_press | stand (proven on the 8) | hold convention (plank); cable column, single handle |
| side_plank | roll (first); engine front view (upright_row) | hold convention; drawable-fault convention (dumbbell_biceps_curl) |
| russian_twist | floor-sit (resistance_band_row, LB1); front view | drawable-fault convention; `medBallOptional` |
| bicycle_crunch | supine (crunch, pilot B); front view | drawable-fault convention |

## 5. Expected flags (D-LIB21-FLAGS)

- **F5 on every plate** at exactly the approved chrome's 3.57:1 (D-LIB9-F5, 14.4).
- **F1 on bird_dog and superman** (D-LIB21-FLOOR): pilot A's floor camera `{ fit: true, maxScale: 1.35, y0: 339 }`,
  fixed by the fill-the-width rule before anything is measured. bird_dog **measured 151.49 px/m** (its reach spans
  about 2 m, so below plank's 174.22). superman [est about 170 px/m]. ab_wheel_rollout and cable_crunch keep a
  reference-like fit (`fit` with hanging_leg_raise's margins); ab_wheel_rollout **measured 134.56 px/m**, inside the 8's
  123.9-146.3, so no F1.
- **F7 on the 3 (b) ids only** (D-LIB21-F7), once drawn.
- **Named F3 on bird_dog (D-LIB21-F3DOG, ruled Q2):** its leaders are short (longest **measured 26.5 px**, below the envelope's 49.33
  minimum of the approved range [49.33, 82.26]); the labels sit right above the figure. Not a defect; proposed as a
  named flag in LB8's form (D-LIB18-F3KICK), pinned at 26.5 px ± 0.1 in qa.mjs `F3_NAMED` with a red mutation, never
  cleared by lengthening a leader.
- **No F6**: every card's plate.view equals its census view.
- **No small-motion F1** (D-LIB21-SIZE).
- **Before Do 6 b** every drawn id shows `H6:no-card` and F7 'no card top fault' (qa/node.mjs:360). Expected.
- qa.mjs holds the ruled set (`F7_IDS`, `F1_NAMED` bird_dog 151.49, `F3_NAMED` bird_dog 26.5).

## 6. R10 items (tier A: ab_wheel_rollout)

R10: "the right pose never shows an unsafe setup" (PANELS.md 5). From tierA.safetyPoints, zooms and risks; each a
drawn-item test (A15):
- the back straight in every right pose: trunk 0 and neck 0 relative to the pelvis at the start and the end (c2,
  zoom back-line);
- the end a straight line from the knees to the head (hip 0, c2), with no arch (c3);
- the kneeling version (c7: the easier version; the standing roll-out is the version in the fall cases, c8): the knees
  on the pad in every pose;
- a moderate roll-out, short of full extension (c7, zoom range): the arms short of in line with the trunk
  (END_SHOULDER 135 < 180);
- the wheel on the floor and both hands on its handles in every pose (no wheel lifted, no hand off).
- Not drawable, ship-time text: the wall as a range limiter (c7), the readiness test (c6); tierA.wayOut is null (a
  gap, the ship card reports it).

## 7. Tempo map (D-LIB21-TEMPO; 13 Q3, D-LIB8M-TEMPO)

Form: pilot A's rows, in `lb9/tempo.json`. Order follows the drawn order (start → end). No constant rows: every (a)
phase comes from the card's plate.tempo.

| id | card (claim) | phase array |
|---|---|---|
| cable_crunch | up 2, down 3, pause 1 (c16; D-SUP-LB9-TEMPODIR Reading A) | Crunch 2 (move), Hold 1, Return 3 (move) |
| ab_wheel_rollout | up 1, down 2, pause 0 (c14; down = the roll-out) | Roll out 2 (move), Roll back 1 (move); no Hold |
| bird_dog | up 3, down 3, pause 3 (c20, c21) | Reach 3 (move), Hold 3, Return 3 (move) |
| superman | up 1, down 2, pause 3 (c19) | Lift 1 (move), Hold 3, Lower 2 (move) |
| pallof_press | up 1, down 3, pause 2 (c13, c12) | Press 1 (move), Hold 2, Return 3 (move) |

- ab_wheel_rollout draws the roll-out first (its eccentric is `down`, c14), so "Roll out" takes `down`.
- No Rest anywhere: no card states rest seconds of a drawn phase.
- The (b) rows at their resume: side_plank and russian_twist per D-LIB21-SECS (research F-LB9-2); bicycle_crunch
  Crunch 2 (up), Return 2 (down), no Hold (c16).

## 8. Pose map, the Mistake's pose and the fault→key map (13 Q1(a), Q2 (b); D-LIB21-POSEMAP)

Pose map: identity for all 8 (spec start = plate.start, end = plate.end; the Mistake against the end, plate.mjs:78).
Each card's fault belongs to its plate.end (checked: the arch as the arms reach; the hips during the pull; the arch as
the leg rises; the head in the hold; the arch while pressing).

| id | plate.mistake (claim; drawable) | drawn key (other tells) | handlingMistakes[0] | topFault |
|---|---|---|---|---|
| ab_wheel_rollout | low back arching as the arms reach overhead (c3, c13; true) | `arch` "Low back arches" (one tell; record below) | the same fault | `arch` |
| cable_crunch | moving the hips to pull (c8, c3; true) | `hips` "Hips move" (one tell; record below) | the same | `hips` |
| bird_dog | low back arching as the leg rises (c8, c7; true) | `arch` "Low back arches" (`high` "Leg too high", c7 "avoid lifting the leg too high") | the same | `arch` |
| superman | head lifted to look up (c6; true) | `head` [planned] | the same | `head` |
| pallof_press | lower back over-arching (c8; true) | `arch` [planned] | the same | `arch` |
| side_plank | hips sinking (c5; false) | `sink` [planned] | holding the breath (c6) | `breath` (F7) |
| russian_twist | hips and knees swinging with the trunk (c4, c5; false) | `hips` [planned] | twisting without control (c8) | `control` (F7) |
| bicycle_crunch | hips rotating with the trunk (c8; false) | `hips` [planned] | pulling on the neck (c9) | `neck` (F7) |

Every drawable-true card's handlingMistakes[0] is its plate.mistake (checked at `f574bb4b`; the D-LIB15-XBODY check).

**Mistake poses.**
- ab_wheel_rollout: the lumbar extends M_ARCH (-30°, plank.mjs:103's approved sag; D-LIB21-ABSAG, ruled Q4); the shoulders and knees stay where they are, so the arms, hands
  and wheel do not move (plank.mjs's sag keeps its forearms and toes the same way); root, pelvis tilt and hip angle
  solved. The arch lies inside the solid end figure: its true contour (the engine's dashed outline) and a 12 px red
  arrow onto the arched low back (lib4-cards 32-33).
- bird_dog: the lumbar extends M_ARCH (12°); the shoulders, the down hand, the down knee and toes stay; the raised leg
  keeps its hip angle, so the pelvis turn lifts it 8.3° past parallel (c7 "avoid lifting the leg too high").

**Phantoms** (Q2 (c), D-LIB21-DRAW): ab_wheel_rollout's start wheel and start near arm lie partly under the end thigh,
so their hidden outline runs are redrawn as dashed hidden lines (hanging_leg_raise.mjs's method). bird_dog's hidden
start limbs lie exactly behind the far arm and near leg in side view, so their dashed outline barely shows; the Trace
starts at the hidden start ankle.

**One-tell record (D-LIB10-SKULL1; #290 6345185694).**
- pallof_press: fault c8 (and c9); claim ids read: c5, c8 ("Over-arching the lower back ... keep a neutral spine"),
  c9 ("Overarching the lower back, or rounding it"), c10. One stated sign: the lower back over-arching; the trunk leaning
  back and the handle coming back are the fault's geometry, not signs a claim states. So one tell.
- cable_crunch: fault c8 (and c3); claim ids read: c8 (Fitness Volt: "You will see a lot of people doing this
  exercise by moving their hips too, but that's a mistake ... Done correctly, only your spine should move."; Motra:
  "Using hips to pull"), c3 (Motra: "keeping hips stationary", "Hips still and elevated", "Spine flexes, not hips").
  The stated signs are the hips moving (c8, c3) and the spine not flexing (c3, the inverse of c8). The second lies inside
  the solid end figure (the Mistake's straight back is 2-4 px inside it), so no leader can reach it without crossing the
  figure; it is drawn as the red dashed back line inside the torso and named in the one tell's cue ("The hips move back
  to pull while the spine stays straight."). So one tell.
- ab_wheel_rollout: fault c3 (and c13); claim ids read: c3 ("Extend your hips toward the floor and let your chest sink
  forward toward the ground. Avoid arching your lower back as you extend your arms above your head."), c13 (lumbar
  extension or torso rotation), c5 (rolling too fast: speed), c2 (the right line). The one stated sign is the low back
  arching; the hips dropping is the arch's geometry, not a sign a claim states as the fault (c3 asks the hips to extend
  toward the floor in the right pose), so one tell.

## 9. Card keys (Do 6 b, after 'LB9 NOTE RULED')

Written on the 5 (a) cards from the ruled sections 7, 8 and 10; the (b) cards get theirs after they are drawn.
Each key is appended at the end of the card's own bytes, in its indent; cards.sha.json keeps each card's sha256 without
them.

## 10. Facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2, D-LIB21-FACTS, -SIDES)

A setup quote states the start pose only (D-LIB9-FACTPOSE); plate.start and plate.end claim citations decide the pose
of a non-setup quote; paired parts state each side; a grip quote states the hand on the implement at the start,
checked at the wrist. Each fact gets a `checks` entry in its spec (H6).

| id | candidate facts (landmark, pose, claim) | not facts (reason) |
|---|---|---|
| ab_wheel_rollout | wrist.l, wrist.r start c1 ("Kneel and grip a wheel ... with your hands set shoulder-width apart"); knee.l, knee.r start c1 ("Sit with your knees on a soft pad") | c2 "a straight line from your knees to your head": a line, held by the datum and the end's hip 0 (a check, not a contact); c3 "chest sink forward toward the ground": no number |
| cable_crunch | wrist.l, wrist.r start c2 ("secure each hand at the base"); knee.l, knee.r start c1 ("Sit down on your knees") | c5 "elbows near thighs": no contact stated ("near"), a 3D cap (A18); c2 "lay the attachment across your traps": the rope on the body, the bearing rule, not a landmark |
| bird_dog | wrist.l, wrist.r start c2 ("place your hands on the mat"); knee.l, knee.r start c1 ("Kneel on an exercise mat") | c4, c5 "at, or near parallel": a segment angle held by a check unless PANELS.md 7 maps it; c11 "pressing down into the ground with your non-moving hand, knee, and toes" (Q3: c11 is not cited by plate.end, so by the rule no end pose; listed for the verifier) |
| superman | navel start c1 ("Lie prone (on your stomach) on a mat"); navel end c2 ("while keeping your core on the ground", cited by plate.end) | c3 "3-6 inches": a size (sizes.json), 3 wide; c2 "four to five inches": a size |
| pallof_press | wrist.l, wrist.r start c3 ("Grip one handle in both hands"); sole.l, sole.r start c2 ("Stand with the feet hip-width apart") | c5 "press the handle straight out": a path, not a contact; c1 the pulley "directly to the right of the body": S4 (section 13) |

Sides (D-LIB21-SIDES): bird_dog draws c4's left leg and c5's right arm (the right arm near, the left leg far);
c14 "repeat with the opposite arm and leg" is its each-side claim (recorded in the spec). ab_wheel_rollout and
cable_crunch are symmetric. pallof_press: section 13.

## 11. Size table (D-LIB21-SIZE; `lb9/sizes.json`)

Every number a card does not give, fixed before PQ-H3, each with a basis; PQ-H3 is never a basis. The slice's rows
are written in sizes.json with the slice; the spec headers name them under "Unsourced numbers".

| id | key | value | basis |
|---|---|---|---|
| ab_wheel_rollout | PAD_T | 0.03 m | stated reason: a foam kneeling pad (c1 "soft pad"), 3 cm, 4 px at the plate's scale so it reads as a pad |
| ab_wheel_rollout | BEAR | 0.0025 m | the bearing rule (#306 6358957999): the pad top 0.25 cm under the lowest drawn leg point, inside the 0.5 cm cap (LB8's seat value, lb8-plates.test.ts:1876) |
| ab_wheel_rollout | SHIN_RISE | 0° | stated reason: the shins lie flat along the pad in a kneel; the ankle is solved from it |
| ab_wheel_rollout | WHEEL_GAP | 0.03 m | c1 "just in front of the knees": the wheel's rear edge 3 cm in front of the kneecaps |
| ab_wheel_rollout | END_ELBOW | 5° | convention: bear_crawl.mjs END_ELBOW's reason (#305), straight arms short of the singular full extension (hanging_leg_raise's hang about 5°) |
| ab_wheel_rollout | END_SHOULDER | 135° | c3 "arms reach forward overhead" (past 90° to the trunk) and c7 a moderate roll-out of the kneeling version: halfway between overhead (90°) and the full roll-out with the arms in line with the trunk (180°) |
| ab_wheel_rollout | M_ARCH | -30° | convention: plank.mjs:103 SAG_LUMBAR -30, the approved plank sag (D-LIB21-ABSAG, ruled Q4: the roll-out's end is a prone line held by the arms, the plank's class) |
| ab_wheel_rollout | wheel r, width, hub, handle | 0.09, 0.05, 0.025, 0.03, +0.06 m | stated reason: a "small wheel" (c1), 18 cm across; handles 3 cm thick; eq/abWheel.mjs AB_WHEEL. No source gives sizes |
| ab_wheel_rollout | trace | grip.r, [10, 12] | c2 "slowly roll the wheel forward": the hands on the wheel; trim = hanging_leg_raise.mjs:124 (D-LIB18-TRIM) |
| bird_dog | MAT_T | 0.01 m | stated reason: a foam exercise mat (c1, c2, c22), 10 mm; no source states it |
| bird_dog | MAT_LEN | 1.73 m | stated reason: a 68 in exercise mat, longer than the start's 1.17 m toe-to-fingertip span; no source states it |
| bird_dog | M_ARCH | -12° | convention: hanging_leg_raise.mjs:69 (D-LIB21-SIZE allows it or plank.mjs:103's -30) |
| bird_dog | trace | ankle.l, [10, 12] | c4 "extend your left hip", c7 "As the leg is raised": the rising foot; trim = hanging_leg_raise.mjs:124 |
| cable_crunch | (from the slice) | | |
| superman | lift | c3 "3-6 inches": drawn at 3 in (the lowest the range allows, D-SUP-LB9-RANGE's reading) [proposed] | |
| superman | M_NECK | the head lift: a neck extension sized from a basis named at the bulk [proposed] | |
| pallof_press | KNEE | 15° | convention: leg_press.mjs:13, :23 (15° short of lockout) for c2 "knees slightly bent" |
| pallof_press | M_ARCH | -12° | convention: hanging_leg_raise.mjs:69 |

## 12. Balance bases and trace points (D-LIB21-BALANCE, -TRACE)

| id | base (claims) | measured |
|---|---|---|
| ab_wheel_rollout | the knees, shins and feet on the pad (c1 "kneel on a soft pad") and the hands on the wheel (c1, c2) | the centre of mass lies between the toes and the wheel contact in every pose and ghost (start z −0.020 m, just behind the knee joints at 0; end 0.523; Mistake 0.527; toes about −0.6, wheel 0.17 → 1.45 m) |
| cable_crunch | the knees and shins (c1) | from the slice |
| bird_dog | all four at the start (c1, c2); the down hand and down knee (and toes, c11) in the reach | end 0.08 cm from the hand–knee line (+1.18 cm inside the palm–knee–toe hull); Mistake 0.22 cm (+1.44); ghosts 1.11 and 0.61 cm |
| superman | the floor contact of the trunk and thighs (c1, c2) | [planned] |
| pallof_press | the feet, with the cable's pull (c2, c4) | [planned] |

Trace points: ab_wheel_rollout `grip.r` (c2: the wheel rolled forward); bird_dog `ankle.l` (c4, c7: the rising foot);
cable_crunch from the slice (candidates: the elbows or shoulders curling toward the thighs, c3, c5); superman the feet
lifting (c2); pallof_press the handle pressed straight out (c5, c6).

## 13. PQ-H3 (deviationMin 11.39 px, traceLenMin 22.11 px) and the views

| id | Mistake deviation | Trace | state |
|---|---|---|---|
| ab_wheel_rollout | **measured 13.6 px** at M_ARCH -30° (8.5 px at the earlier -12°) | **147.5 px** | passes at the ruled size (D-LIB21-ABSAG); the panel judges whether it reads as natural, and holds it there if forced |
| bird_dog | **measured 13.3 px** (the `high` tell on the raised shank) | **57.7 px** | passes at the ruled sizes |
| cable_crunch | from the slice | from the slice | |
| superman [est] | head lift: small (a neck turn of about 20-30° moves the crown about 5-8 cm, about 9-14 px at 170 px/m) | the 3 in lift: about 8 cm, about 13 px (< 22.11): likely held | |
| pallof_press [est] | 12° arch: about 4 px (LB8 measured 4.1-4.3 px at 12°) | handle out about 45 cm, about 65 px | the Mistake likely held |

- pallof_press (S4, D-LIB21-FRONT): c1 puts the pulley "directly to the right of the body" with the cable "parallel
  with the chest". In the engine's side view facing right the figure's right is the near side, so the column stands
  between the figure and the camera and the cable runs along the depth axis. With `facing: 'left'` the near side is
  the left, so the column (on the right) is behind the figure and still runs along the depth axis. Either way the cable
  is seen end-on. Renders at the bulk; S4 if it cannot be drawn card-true.

## 14. H slice (Do 2; D-LIB21-SLICE as changed in 'LIB-21 start')

ab_wheel_rollout, cable_crunch and bird_dog, posted as 'LB9 SLICE READY' with 390 px renders in Paper and Silent Black
beside hanging_leg_raise and pilot A's plank (ab_wheel_rollout, bird_dog) and rope_triceps_pushdown (cable_crunch),
the unit tests with their mutations, the two-build sha256, the QA table, each Mistake's H3 and Trace beside its size
row, each balance offset, each 3D clearance and bearing value, and report.mjs per plate.

## 15. Held ids

| id | ruling | route |
|---|---|---|
| cable_crunch | D-LIB21-CCHOLD (#312, after 6383637352): the recheck's R1 (the trunk folds at the engine's one lumbar pivot, a 67.5 px hip–shoulder chord at 780 against 138.2 at the start) needs distributed spinal flexion, which the vendored engine lacks | a LIB-SPINE engine card (F-SPINE-1); R2/R7 fixes and its verified card fields kept; then 'LIB-21 resume' |

| superman | D-LIB21-SIZE (D-LIB8-shrug, S2): the card-true 3 in lift (c3) moves the Trace point (ankle.r, c2) 6.95 cm, 9.8 px at 140.91 px/m, under the trim, so no Trace draws (traceLen 0 < 22.11; hands 10.6 px, toe 12.2 px) | LIB-ZOOM (#279) on main and extended to the motion, then 'LIB-21 resume' |
| pallof_press | D-LIB21-SIZE (S2): the 12° arch (hanging_leg_raise.mjs:69) moves the low-back tell anchor 1.03 px (< 11.39); and S4: from the side the cable runs along the depth axis, so the anti-rotation set-up cannot be read | a ruling on S4 (a front view, D-LIB21-FRONT) and LIB-ZOOM for the arch |

ab_wheel_rollout was held at -12° and released by D-LIB21-ABSAG; it and bird_dog are approved (slice panel and recheck).

Held ids are drawn and tested, and appear in `lb9/build.mjs` HELD (the `--held` page, renders only), never in rows.json.

## 16. (b) rows plan (D-LIB21-ER5; lib-20-card.md and `claude/lib-20-engine` @ `471339d3`'s SPEC.md, read only)

LIB-20's SPEC.md (unmerged) documents `root.roll`, `root.yaw`, `trunk: { flex, yaw, lat }`, `camera.pitch` (front view)
and `torso: 'volume'`. Re-read on main at the resume; a (b) spec sets only fields main's SPEC.md documents.
- side_plank: `root.roll` (the body on its side), front view; the Mistake (hips sinking) by `trunk.lat`; the hold
  constant per D-LIB21-SECS.
- russian_twist: `trunk.yaw` for the turn; `root.yaw` for the Mistake (hips swinging, D-ER5-YAW); the lean back (c3)
  is sagittal on a front view: S4 unless `camera.pitch` shows it.
- bicycle_crunch: `trunk.yaw`; `camera.pitch` likely (the spike: "reads only near top-down"); the field that turns the
  lying pelvis for the Mistake is named from main's SPEC.md at the resume (`root.yaw` on a supine body is the
  candidate); the lower back on the floor (c6) is S4 on a front view unless the pitch shows it.

## 17. Risks and mitigations

- The 12° arches are under deviationMin (pallof_press likely; ab_wheel_rollout measured 8.5 px at 12° before
  D-LIB21-ABSAG): held and routed to LIB-ZOOM, never enlarged (D-LIB21-SIZE).
- Labels and the engine's occupancy: the engine counts every in-between pose's whole body as drawn for label
  placement (plate.mjs occupancy adds the ghost poses' shapes even when `ghosts.parts` draws only some), so labels sit
  above the swept band. Mitigation: boxed labels with short vertical leaders; report.mjs ok:true on every plate.
- 3D and bearing (D-LIB21-FRAME): the knee pad and mats are placed from the drawn outlines (0.25 cm bearing on
  ab_wheel_rollout; 0 cm on bird_dog); tests measure every pose and ghost.
- pallof_press's cable along the depth axis (S4): renders first, then a ruling.
- superman's prone anchor (lying_leg_curl) is held on LIB-18: superman may roll at the sheet.
- LIB-20 late: the (b) rows wait; the (a) rows do not.

## 18. Rulings ('LB9 NOTE RULED', #312 6382248634)

- Q1 D-LIB21-KNEEPAD: accepted, the flat `sideBar` knee pad.
- Q2 D-LIB21-F3DOG: accepted, bird_dog's F3 named at 26.5 px ± 0.1 with a red mutation.
- Q3: accepted, c11 is not an end fact; the CARD FIELDS verify checks it.
- Q4 D-LIB21-ABSAG: not held; ab_wheel_rollout's arch uses plank.mjs:103's -30° (13.6 px). The calibrated panel judges
  whether it reads as natural; if forced, it is held then.
- Q5: the tempo map, pose map, facts plan and sizes accepted as written.
- pallof_press S4: side-view renders at the bulk; a front view goes to a ruling only if the cable cannot be read.
- D-LIB21-ROPENIT (#312, after 6382529719): cable_crunch's "Rope by head" box at 200/238, its leader 4.98 px from the
  steep strand (about 34°, no crossing), is a named nit, pinned in lb9-plates.test.ts with a red mutation (200/232).

- CARD FIELDS VERIFIED @ 931714d2 (one fix round: cable_crunch wrist.l/r end c2; ab_wheel_rollout knee.l/r end c7).
- D-LIB21-TRAPS: BarBend's "lay the attachment across your traps" (c2) is not a fact: an "or" choice beside
  Motra's hands near the shoulders; StrengthLog's beside-the-head position (setup line 4, plate.start) is the drawn one.
- D-LIB21-CCFLAGS: cable_crunch's F2 0.623 and F3 26.2 are named flags (qa.mjs, pinned with red mutations).

- Slice panel (#312 6383060997, VALID): ab_wheel_rollout APPROVED (kept byte-identical). Fix round:
  - cable_crunch R2: main's rope with its ferrule on the cable line in every pose (no turn); the head-frame grip point
    beside the temple, its height solved from ROPE_MARGIN; GRIP_GAP removed. R7: the Mistake cable is one dashed guide
    stroke (`mistakeTwin: false`). D-LIB21-ROPENIT withdrawn: the "Rope by head" leader now clears the strand by 7.28 px.
  - bird_dog R5: M_ARCH -30 (plank.mjs:103); the low back drops 10.6 px at 780. R4 (D-LIB21-DOGGHOST): ghosts.count 0
    and "Hands, knees under" right of the down arm, its leader on the down hand.
  - Named flags re-measured after the fixes: bird_dog F3 33.5 (the "Leg too high" box raised clear of the Mistake leg),
    cable_crunch F2 0.622 and F3 26.05.

Asked with the slice (ruled as D-LIB21-CCFLAGS): cable_crunch's F2 (coverage 0.623: the high-pulley cable spans the plate) and F3
(longest leader 26.2 px: labels beside their parts) as named flags in D-LIB18-F3KICK's form.
