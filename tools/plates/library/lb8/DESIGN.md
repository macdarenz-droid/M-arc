# LB8 H plates: design note (LIB-18)

Card: `docs/supervisor/verify/lib-18-card.md` on `claude/sup-lib4-cards` @ `7b673962` (Do 1), with its D-LIB18-*
rulings and lib4-cards sections 12-31. Plan: `claude/howto-options` @ `b41ac833`. Research: the LB8 research head
`596dbe0748f11d13b431ee11d38d1742771925f1` on `claude/libht-research` (LB8 merge `53cb2845`, #294: LR-29 VALID); the
12 cards and quotes are byte copies from it (`lb8/cards.sha.json`). Census: `docs/howto/library/inputs/census.json` @
`4a9fd86`. Patterns copied with `git show` from LB7 (#299 @ `5a9f004c`), LB6 (#297 @ `2979a4a2`) and pilot A (#109 @
`dcac4a38`); pilot B (#278 @ `d3b231d6`) is read only. Base: main `1ffd0dac`.

Nothing here ships (D-LIB18-AHEAD): every LB8 row stays at stage `drawing` or `review` in `lb8/rows.json`, outside
`batches/`; `tests/howto/lb8-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids (A5).
lying_leg_curl and standing_leg_curl are planned here against pilot B's `legCurlMachine` @ `d3b231d6` and drawn only
after 'LIB-18 resume' (D-LIB18-LEGCURL). seated_leg_curl is pilot B's plate (pB, plan 6.1:694-696) and is in no LB8
file.

Values marked **measured** are the engine's, node side (renderPlate report, qa/node.mjs `deviation`, the Trace path
length) at this head; QA evidence counts only after Do 6's verdict (Do 2). Values marked [est] are hand estimates from
body.mjs segment lengths, to be replaced by measurements as each plate is drawn.

## 1. Engine and modes

- **Engine.** Every LB8 spec imports only `tools/plates/library/engine.mjs`, eq/parts.mjs and the LB8 composers under
  `eq/` (D-LIB9-ENGINE). Specs copy code from the 8 on main and from pilot A and LB7 heads with `git show`; they never
  import a spec (D-LIB9-CLONE; A3 tests it). Every copied root finder throws on a bracket with no root; each records
  what it solves to (hip_thrust: START_TILT bracket -89..-20 deg solves to -37.82 deg; M_TILT bracket -110..-65 solves
  to -83.44 deg).
- **Modes: all twelve are H; no D row** (plan 6.2 :717 "H13", :753-755 no mark). A D spec is its parent with only
  PARAMS paths set (derive.mjs:4-12: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness,
  stance.width), and of those the vendor engine reads only `spec.camera` (vendor/engine/plate.mjs:81-95). What each id
  needs outside PARAMS (each alone makes it H; plan 3.1:272):

| id | census closest | outside PARAMS |
|---|---|---|
| hack_squat | leg_press (E) | equipment: `hackSled`, a carriage on rails with shoulder pads (c1, c3), not the 45° sled and seat; pose: standing in the sled, the trunk on the moving pad (c2), not seated; Mistake: the rounding at the bottom on a moving pad (c8, c10); tempo 1/3/1 |
| pendulum_squat | leg_press (E) | equipment: `pendulum`, a swinging arm (c1-c3), not the sled; pose: stand and lean, not seated; Mistake: the heel lift (c9, c15); tempo 1/3/0 |
| leg_extension | leg_press (N) | equipment: `legExtMachine` (seat, back pad, shin roller lever, c1-c3); motion: knee extension with the foot free (c7); Mistake: the back off the pad (c5, c6) |
| lying_leg_curl | leg_press (N) | pose class: prone (c1), not seated; equipment: pilot B's `legCurlMachine`; motion: knee flexion (c7) |
| standing_leg_curl | leg_press (N) | pose class: stand and single leg (c2, c3); equipment: `legCurlMachine`; one working leg |
| seated_calf_raise | leg_press (N) | equipment: `calfMachine`, the knee-pad lever and platform (c1-c3); motion: the ankle only, knees fixed at 90 (c13) |
| standing_calf_raise | barbell_back_squat (N) | equipment: `calfMachine`, shoulder pads and platform (c1, c2), not the barbell; motion: the ankle only (c7) |
| bodyweight_calf_raise | barbell_back_squat (N) | equipment: a step (`box`, c3), no load; motion: the ankle only (c4) |
| hip_thrust | leg_press (N) | pose class: bridge (the upper back on a bench edge, c2); equipment: a barbell on the hips and a flat bench end-on (c1-c4); motion: hip extension pivoting on the bench (c9) |
| glute_bridge | leg_press (N) | pose class: bridge on the floor (c1); no equipment; motion: hip extension (c3, c4) |
| cable_kickback | lat_pulldown (N) | pose class: hinge, single leg (c2), not seated; equipment: low pulley and `ankleCuff` (c1), not the lat bar; motion: hip extension of one leg (c5) |
| resisted_hip_flexion | hanging_leg_raise (F) | pose class: stand, single leg (c1, c12), not hanging; equipment: low pulley behind and `ankleCuff` (c1, c2); one leg; tempo 2/2/2 |

- **D test (Do 3).** No id could meet it: each needs a pose class, an equipment rig or a motion its census closest
  does not have. No reason found to post for a D row.

## 2. Per id

| id | tier | view | mode | clone source (D-LIB18-CLONE) | composer / primitives | hand (census; drawn) |
|---|---|---|---|---|---|---|
| hack_squat | B | side | H | leg_press (the 8): the carriage read back from the feet (:56), the butt wink about the lumbar pivot (:85-93) | **hackSled** (new, slice); floor | balance; fists on the handles |
| pendulum_squat | B | side | H | leg_press; reverse_lunge (#109) for the heel on its ball (:17-22) | **pendulum** (new, bulk); floor | balance; fists on the handles |
| leg_extension | C | side | H | leg_press; machine_chest_press and lat_pulldown (the 8) for the seat | **legExtMachine** (new, bulk) | balance; fists on the side handles |
| lying_leg_curl | C | side | H | leg_press | `legCurlMachine` (pilot B, imported from main after it lands; D-LIB18-LEGCURL) | balance; fists on the handles |
| standing_leg_curl | C | side | H | leg_press; single_leg_romanian_deadlift (#109) for the stance and its centre of mass (:19-36) | `legCurlMachine` (pilot B, from main) | balance; fists on the handles |
| seated_calf_raise | C | side | H | leg_press (the heel peel on the ball, :94-100); the seated 8's seat; reverse_lunge (#109) for the rigid foot (:17-22, :124-127) | **calfMachine** (new, slice; seated form) | balance; fists on the handles |
| standing_calf_raise | B | side | H | barbell_back_squat (the 8, standing); reverse_lunge | **calfMachine** (standing form, bulk) | balance; fists on the handles |
| bodyweight_calf_raise | C | side | H | barbell_back_squat; reverse_lunge | vendor `box` (the step), floor | none; arms by the sides (c1's first option) |
| hip_thrust | A | side | H | leg_press (the lumbar-pivot rotation, the knee arc); bench_dip (#299) for the vendor bench end-on and the throwing bisection | vendor `bench` end-on; the barbell, its pad and plates from `poly` (they move in the Mistake, PQ-H9); floor | on-body; fists on the bar (card zoom bar-in-crease: no key draws it, reported for the ship card) |
| glute_bridge | C | side | H | leg_press; hip_thrust (this card) for the bridge solve | floor | none; arms by the sides |
| cable_kickback | C | side | H | lat_pulldown (the 8) for the cable code; romanian_deadlift and barbell_row (#109) for the hinge; single_leg_romanian_deadlift for the stance | **ankleCuff** (new, slice); vendor cableColumn, floor | balance; fists on the frame |
| resisted_hip_flexion | C | side | H | hanging_leg_raise (the 8) for the arch; single_leg_romanian_deadlift for the stance | **ankleCuff**; vendor cableColumn behind, floor | balance; one fist on the frame |

seated_leg_curl (LB8, pB): pilot B's plate, reused as pilot B pins it (D-LIB10-PA's pattern); not drawn here.

## 3. Composers (Do 4; D-LIB18-COMPOSERS, -FRAME)

Each is a function of world numbers returning PRIMITIVES items only (equipment.mjs:316 on main, `poly` included), with
eq/parts.mjs helpers (`sideBar`, `perItem`), in LB7's dipBars and LB6's pulloverMachine pattern, reading no file. Every
pad, seat, platform, rail and lever is joined to its frame by a drawn post, bracket or rail (machine_pullover's seat
post and pad bracket, ed11b956). A part that moves between the end pose and the Mistake is a `poly` (PQ-H9, plan
2.1:126-128); a `line` is never used for a moving part (A2 tests it on the drawn items). Sizes in `lb8/sizes.json`
under the composer's name, exported as constants (A17).

- **hackSled** (slice; anchor hack_squat): two parallel rails at the machine's incline seen side-on (the near covers
  the far), the carriage (back pad, shoulder pads, handles near the head) riding them, the large foot plate fixed at
  the rails' low end with its bracket, fail-safe stops at the bottom of the rail, a base frame on the floor (c1, c3,
  c16, c18; plate.equipment). The carriage moves with the body (read back from the drawn back, leg_press's `travelOf`
  pattern), so every carriage part is a `poly`. Static: rails, foot plate, stops, frame.
- **pendulum** (bulk; anchor pendulum_squat): a swinging arm on a pivot ahead of and above the lifter carrying the
  shoulder pads and back pad, the platform fixed under the feet, the latch, the frame (c1-c3). The arm and its pads move
  (`poly`); the platform and frame are static. The arm geometry decides c3 ("throughout") with c5-c6's upright torso:
  sized by a stated physical basis; S3 if it cannot hold.
- **legExtMachine** (bulk; anchor leg_extension): census "seat + backPad + kneePad (shin roller) + line lever + stack":
  seat on its post, back pad on its bracket, the lever about the knee-height pivot boss carrying the shin roller, the
  stack and the frame (c1-c3). The lever and roller move (`poly`, never the census's `line` lever); seat, back pad,
  pivot boss and frame are static.
- **calfMachine** (slice; anchor seated_calf_raise, with standing_calf_raise on the same sheet): one file drawing both
  forms on one platform (census "kneePad lever or shoulder pads + box platform"): the seated form (a lever pivoting at
  the front carrying the knee pad across the thighs just above the knees, c1, c2; the seat; handles and the safety
  lever, c5, c6) and the standing form (the shoulder-pad carriage on its upright; handles, c1, c2). The lever or
  carriage moves with the body (`poly`); the platform (`box` on a post), seat and frame are static.
- **ankleCuff** (slice; anchor cable_kickback, with resisted_hip_flexion on the same sheet): census "box on the ankle
  landmark": the cuff strap round the working ankle and its ring where the cable clips (c1). It moves with the ankle,
  so its parts are `poly`. The cable is the vendor cableColumn's (section 4).
- Not here: `legCurlMachine` is pilot B's (eq/legCurlMachine.mjs @ `d3b231d6`; plan 2.1:138), imported from main by
  the two leg curls once pilot B lands, never copied, forked or edited (D-LIB18-LEGCURL; A16). Read at `d3b231d6`: it
  builds the seat, seat post, back pad and thigh pad unconditionally (`seat[2]`, `back`, `thigh` are dereferenced),
  so the lying curl (no seat, no back pad) and the standing curl (no seat, no back pad) cannot pass `null` as its
  header's later-users note suggests without a TypeError [unverified until drawn on main's version]: S7, ruled for
  pilot B's owner card.

## 4. Cables (D-LIB18-CABLE)

- cable_kickback: from the column's pulley at its lowest setting (c1) to the cuff's ring on the working (right, near)
  ankle, in front of the lifter (facing the pulley, c2): a side-view cable in the leg's plane, drawn in every pose by
  the vendor cableColumn (pulley, column, stack lifted by the cable's extension). The Mistake cable is a dashed Mistake
  guide drawn on top, unbroken from the pulley rim to the Mistake ring, never a `poly` twin hidden in the body (#299
  6348157337 item 1; 6349108629); the stack stays at the end lift in the Mistake (D-LIB17-B4).
- resisted_hip_flexion (bulk): from the ankle ring back to the low pulley behind the lifter (facing away, c1, c2), the
  same way.
- Where a card leaves the path open, LIB-16's rule applies (behind the figure or clear of the outline); no path is
  moved off a card.

## 5. Pose-class and convention anchors (depends_on; D-LIB18-CLASSES, -LEGCURL)

| id | class anchor | rig anchor | convention anchor |
|---|---|---|---|
| hack_squat | recline: proven (leg_press) | **hackSled**: hack_squat itself | |
| pendulum_squat | stand, lean: proven (back squat) | **pendulum**: pendulum_squat itself | drawable fault: dumbbell_biceps_curl (#109) |
| leg_extension | seat: proven | **legExtMachine**: leg_extension itself | |
| lying_leg_curl | **prone**: lying_leg_curl is its first user, on the LB8 sheet (plan 2.2:165) | legCurlMachine: seated_leg_curl (pilot B) | drawable fault |
| standing_leg_curl | stand; **single leg**: single_leg_romanian_deadlift (#109) | legCurlMachine: seated_leg_curl (pilot B) | drawable fault |
| seated_calf_raise | seat: proven | **calfMachine**: seated_calf_raise itself | drawable fault |
| standing_calf_raise | stand: proven | **calfMachine**: seated_calf_raise (same sheet) | drawable fault |
| bodyweight_calf_raise | stand: proven | | drawable fault |
| hip_thrust | **bridge**: hip_thrust is its first user, on the LB8 sheet (plan 2.2:165) | | |
| glute_bridge | **bridge**: hip_thrust (same sheet) | | |
| cable_kickback | **hinge**: romanian_deadlift, barbell_row (#109) and straight_arm_pulldown (LB1 #245); **single leg**: single_leg_romanian_deadlift | **ankleCuff**: cable_kickback itself | |
| resisted_hip_flexion | stand; **single leg**: single_leg_romanian_deadlift | **ankleCuff**: cable_kickback (same sheet) | |

Every anchor gates the plate's sheet or merge, not its drawing (plan 3.1:293-299). None of pilot A's, pilot B's or
LB1's anchors is pinned on main yet.

## 6. Expected flags

- **F5 on every plate** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly
  3.57 only.
- **F7 on pendulum_squat, lying_leg_curl, standing_leg_curl, seated_calf_raise, standing_calf_raise and
  bodyweight_calf_raise only** (D-LIB18-F7): drawable false; each topFault is the key of its handlingMistakes[0],
  which differs from the drawn key (section 9).
- **No F1** (D-LIB18-CALF): every plate is drawn at a scale inside 123.9-146.3 px/m (the reference 146.29 or `fit`
  capped there). A fault too small at that scale is held (section 15), never zoomed here.
- **No F6**: all 12 cards' plate.view is side, equal to the census view.
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault' (qa/node.mjs:360). Expected.
- F2 (coverage), F3 (longest leader) and F4 (boxed labels) are measured by authoring QA and posted with the slice; any
  raised flag outside this set is posted with its value and range and ruled before READY, never dodged.

## 7. R10 items (tier A: hip_thrust)

R10: "the right pose never shows an unsafe setup" (PANELS.md 5). Each is a drawn-item test (A15).

- The bar padded (c4, c5: a pad drawn round the bar in every pose) and in the hip crease, held by both hands (c3: each
  grip on the bar in every pose, ±0.5 cm), the bar centred over the hips (c3 "keep it centered over the hips": the bar
  centre over the pelvis's front at the crease in every pose).
- The upper back on the bench edge in every pose, pivoting, never sliding (c2, c9: backUpper on the edge, ±0.5 cm).
- The bench drawn as a sturdy flat bench on its legs, end-on (c1 "a sturdy bench").
- Feet flat on the floor in every pose (c1, c15: soles on their floor points, heels down).
- Ribs down, spine neutral in the right poses (c8, c12, c13: trunk 0, no lumbar bend).
- The plates on or above the floor at the bottom (D-LIB18-FRAME): the bottom is where the first of the plates and the
  buttock reaches the floor.
- tierA.wayOut is null on the card (a gap the card states): no way-out line or drawing is invented.
- The card's 3 zooms (bar-in-crease, ribs-down, shins-vertical) are the ship card's: no zoom view is drawn here, and
  bar-in-crease (kind hand) has no hand key on main (merge_prerequisites).

## 8. Slice ids: tempo, poses, fault→key, facts, trace, balance, sizes and PQ-H3 (measured)

Each slice block follows the rules of sections 9-13 below (the tempo rule, the pose map, the facts rules, the size rule). The ids appear in plan order.

### hack_squat (slice; drawn)

- **Tempo** (c20-c22): `[{ phase: 'Lower', s: 3, move: true }, { phase: 'Push', s: 1, move: true }, { phase: 'Hold', s: 1 }]`
  (Motra 3-1-1 read in its tooltip's order; its middle second, the bottom pause, is in tempo.text only, LR-33; the top
  pause 1 is the c21 convention).
- **Pose map**: identity (start = the top, legs extended with the 15° soft knee, c3, c7; end = the bottom, c4, c5).
- **Geometry** (S3 checked: holds): rails at 45° (leg_press.mjs:18 as the convention); the foot plate level (c5
  "parallel to the floor" and c7 "parallel to the footplate" are one line on a level plate). At the bottom: knee
  **measured 90.0°** (arc 90.2°), thigh 0.0° to the plate, ankle 0.0° (whole foot flat, c6, c14), buttock and upper back
  0.0 cm off the pad (c2). Top: knee 15° (leg_press.mjs:13, :23), ankle -37.3°. Bisections (each throws on an empty
  bracket): TILT -47.0096°, SOLE_Z 0.4989 m, TRAVEL 0.2455 m, RAIL_LO -0.5039 m. TOE_OUT 8°, not leg_press's 15°: at
  15° the soles sit 0.8-1.5 cm off the plate (the engine allows 0.5 cm); at 8° the toe lies in the knee's bend plane
  (c13) and the contacts hold within 0.2 cm.
- **Fault→key**: plate.mistake "At the bottom, the lower back rounds and lifts off the back pad" (c8, c10, c9; drawable
  true) = handlingMistakes[0] → drawn key `lift` ("Hips off pad", c8 "lift their lower back off the back pad", c9
  "having your hips leave the backrest"), second tell `round` ("Lower back rounds", c10 "your lower back rounds");
  topFault `lift`. The Mistake: leg_press's butt wink, the pelvis rolled M_ROLL 25° about the lumbar pivot (c10's "ever
  so slightly" read with the convention, D-LIB18-SIZE); the faulty back contour is a dashed guide (sacrum 6.4 cm,
  buttock 7.9 cm off the pad). Both tells are met from the front: the back lies on the pad with the carriage and rails
  behind it, and the Mistake buttock is inside the solid end figure.
- **Facts** (proposed):

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Go down as far as your mobility allows. Your upper and lower legs should be at a right angle at the bottom." (c4; plate.end cites c4) | `angle knee.l 90`, `knee.r 90` ("legs") | end (end) |
| "Keep your back and glutes glued to the back pad throughout the range of motion." (c2, "throughout") | `contact backUpper, buttock` | start (start), end (end) |
| "place your shoulders against the shoulder pads" (c1, setup) | `contact trap.l, trap.r` (the shoulder tops under the pads; "shoulders") | start (start) |
| "Put your feet on the plate" (c1, setup) | `contact heel.l, ball.l, heel.r, ball.r` ("feet") | start (start) |
| "Hold the machine's handles in a comfortable position with a neutral grip." (c18, setup) | `contact wrist.l, wrist.r` | start (start) |
| "pushing through your whole feet" (c6; plate.end cites c6) | `contact heel.l, ball.l, heel.r, ball.r` ("whole feet") | end (end) |

- **Not facts**: c7 "parallel to the footplate or deeper" (an "or", D-LIB17-ORCHOICE); c7 and Motra's slight bend (no
  number: KNEE_TOP 15°); c5 "thighs at least parallel" (a segment angle with no PANELS.md 7 joint: held by a drawn-item
  test); c12 "shoulder-width", "slightly out" (widths: FOOT_X, TOE_OUT); c13 knees over the toes (frontal); c3 the locks
  and c16 the lever (no drawable state); c14 the heel lift (a fault's sign; the whole-foot contact covers it); the rail
  angle and plate tilt (equipment numbers with no measure callout, D-LIB8M-FACTS).
- **Trace**: `knee.r` (plate.frames "Trace follows the knee"). **measured 26.4 px at trim [6, 8]** (leg_press.mjs:132,
  the clone source's trim); **18.2 px at DRAWING-GUIDE §2's "about [10, 12]"**: question 2.
- **Balance**: machine-held, inside the back-pad and foot contacts: the centre of mass 30.8-31.3 cm ahead of the upper
  back's contact and 68.7-86.4 cm behind the toes in every drawn pose and ghost.
- **Sizes**: lb8/sizes.json `hack_squat` and `hackSled`. PLATE_Y 0.20 m has a frame-stack basis only (no source gives a
  hack squat's platform height).
- **PQ-H3**: the Mistake **measured 15.8 px** (the `round` tell, anchored at the pelvis's `seat` landmark plus a px
  offset to the groin: that rigid pelvis point's own drawn motion, 15.5-17.5 px; the `lift` anchor alone 5.5 px; the
  nearest named landmark, `hips`, gives 10.9 px): question 3.
- **Labels**: "Slight knee bend" anchors on the start knee in a closed pocket (end thigh above, rail and pad end left,
  plate below, start shin, ghosts and the end shin right; 45-55 px free for a 68 × 28 px box): every exit crosses a
  line, and the drawn one crosses the rail once (0.4 px): a named-nit candidate (D-LIB15-NIT1; question 4).
- F4: 6 boxed labels (inside 2-6).

### seated_calf_raise (slice; drawn; held)

- **Tempo** (c19, c9): `[{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]`
  (Motra 2-1-2; its bottom second and BarBend's 3 s bottom pause are in tempo.text only; the top second is sourced, c9).
- **Pose map**: identity (start = the bottom stretch, end = the top).
- **Geometry**: trunk upright, thigh level and shin vertical at the start (knee 90.0°), the balls on the platform's top
  face, heels START_DF 20° below (6.2 cm); end END_PF 50° plantar flexion about the same ball; the hips stay on the seat,
  so the knees rise 11 cm and lift the pad (c1); end knee 88.2° on the drawn hip-knee-ankle angle (c13 ±2). The lever's
  roller is solved onto the drawn thigh in every pose (gap 0-0.6 mm). The knee arc is drawn on the start knee (on the
  end knee its leader would start inside the start phantom's thigh).
- **Fault→key**: plate.mistake "Heels moving only part way" (c10, c12; drawable false) → drawn key `range` ("Half reps",
  c12 "half reps get half results!"); handlingMistakes[0] "Bouncing at the bottom." (c10, c11) → topFault `bounce`,
  which differs (F7 raised). M_PART 0.5 (c12's half reps).
  - **One-tell record** (seated_calf_raise): fault: the heels moving only part way. Claim ids read: c10 (Motra's list,
    item 2 "Incomplete range of motion"), c12 (Motra "Lower heels to maximum dorsiflexion ... raise to full ankle
    extension"; Fitness Volt "half reps get half results!"), c8. No second sign stated: both claims name the one sign,
    the heel's range; the knees and pad stopping lower follow from it and no claim states them.
- **Facts** (proposed):

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit on the seated calf raise machine with thighs secured under the pad and knees bent at 90 degrees." (c1, setup) | `angle knee.l 90`, `knee.r 90` ("knees") | start (start) |
| "Keep knees bent at 90 degrees" (c13; plate.end cites c13) | `angle knee.l 90`, `knee.r 90` | end (end) |
| "Place balls of feet on the platform with heels hanging off" (c3, setup) | `contact ball.l, ball.r` | start (start) |
| "Grip handles and release the safety lever by pressing through your toes." (c6, setup step; unhedged) | `contact wrist.l, wrist.r` | start (start) |

- **Not facts**: c4 "shins are vertical" (a segment angle: tested 0.0° at the start); c2 "just above the knees" (a
  place: a size); c5, c13 "back straight" (no number: tested upright ±2°); c7 "heels below the platform" (a position);
  c3 "hip-width", "toes forward" (frontal); c5 "or the sides of the seat" (an "or"); c12's two stretch depths (a
  conflict the card resolves as "deep, comfortable": START_DF); c8 "push through the balls of your feet" (a motion cue:
  the end balls are held by a check; the verifier decides); StrengthLog's c1 "toes and the ball of your feet on the
  foot support" (S4 below).
- **Trace**: `heel.r` (D-LIB18-CALF). **measured 11.8 px at trim [6, 8]** (leg_press.mjs:154's heel trace); the
  untrimmed path is 25.5 px: **S2, held**.
- **Mistake**: **measured 12.2 px** (passes).
- **S4 (toe through the platform), measured on the drawn foot outline, the ball fixed on the platform**: the toe starts
  to enter at 8.9° plantar flexion; 1.0 cm in at 21.8°; 0.48 cm at the Mistake (15°); **2.93 cm at the card's top (50°)**
  in a 3.5 cm platform. No card-true top keeps the toe out: **held**; the route is the owner's (D-LIB18-CALF).
- **Balance**: between the seat and the balls: the centre of mass 15.0-15.4 cm ahead of the seat point and 47.4-47.8 cm
  behind the balls in every pose.
- **Sizes**: lb8/sizes.json `seated_calf_raise` and `calfMachine`. START_DF 20° and END_PF 50° rest on the textbook
  ankle norms (AAOS, as Norkin & White cite them), not opened this session: question 6. TOWER_GAP 0.58 m is a layout
  basis that makes a long (0.88 m) lever arm: a critic may score it (R2).

### hip_thrust (slice; drawn)

- **Tempo** (c22; D-LIB18-TEMPO): `[{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]`
  (pause 1 and up/down are the card's drawing convention, c22 WEAK; R-LB7-6, LR-33). No bottom pause on the card
  (Contreras allows touching the floor or reversing mid-air, tempo.text).
- **Pose map**: identity. Start = plate.start (the bottom), end = plate.end (the top). The Mistake is drawn against the
  end pose.
- **Fault→key**: plate.mistake "Lower back arched (overextended) with the ribs up" (c11, c12, c13; drawable true) →
  drawn key `arch` (tell 1 "Back arched", c11 "arch the lower back"; c13 "overextending your back"), tell 2 `ribs`
  ("Ribs up", c12 Healthline "If your ribs are up and your lower back is arched"). handlingMistakes[0] "Arching the
  lower back." (c11, c12) = the same fault → topFault `arch`; F7 not raised.
  - Both tells anchor on the Mistake torso's top outline (the waist and the lower ribs), met from the open space above.
    The lower back's underside is enclosed in every render: the bench edge, the end back and the start phantom's back
    meet at the pivot (c9), so a leader there would cross the start phantom; the arch reads on the torso's bend from
    above.
- **Facts** (proposed; the verifier decides):

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Place your feet on the floor, about shoulder-width apart, with bent knees." (c1, setup) | `contact heel.l, ball.l, heel.r, ball.r` ("feet") | start (start) |
| "Place your hands on the bar to stabilize it." (c1, setup) | `contact wrist.l, wrist.r` ("hands"; PANELS.md 7: the hand on the implement at the wrist) | start (start) |
| "with the hands holding the bar into position throughout the movement" (c3) | `contact wrist.l, wrist.r` ("throughout": start and end) | start (start), end (end) |
| "allows the bottom of your shoulder blades to rest on the edge" (c2, setup) | `contact backUpper` (the nearest model landmark, D-LIB18-FACTS) | start (start) |
| "make sure your back acts as a pivot point around the bench" (c9; plate.end cites c9) | `contact backUpper` | end (end) |
| "focus on pushing through the heels throughout the set" (c15) | `contact heel.l, heel.r` ("throughout": start and end) | start (start), end (end) |
| "Your knees should form a ~90-degree angle at the top." (c8; plate.end cites c8) | `angle knee.l 90`, `knee.r 90` ("knees") | end (end) |

- **Not facts**: c1, c2 "shoulder-width" / "hip width": a width the side view cannot show. c3 "positioned in the crease
  of the hip": the model has no hip-crease landmark (PANELS.md 7's kinds); held by a check-free drawn-item test (the bar
  centre PAD_R off the pelvis's front outline at the hip joint's height, in every pose) and R10. c6 "your shins are
  vertical" and c8 "torso should be parallel to the ground", "a straight line from shoulders to knees": angles to the
  floor with no model joint (PANELS.md 7 maps none of them); held by drawn-item tests (the shin plumb ±1°, the shoulder,
  hip and knee level ±1 cm at the top). c24 "just wider than hip width": a width (GRIP_X). c23 the neck: the sources
  conflict (card notes), so the head is drawn in line. c4 "a pad or mat": an item, drawn (R10).
- **Trace**: `hip.r` (c8 "Push the bar towards the ceiling by extending your hips"; the bar rides the pelvis and the
  engine traces landmarks only). **measured 28.2 px** (trim [10, 12]): passes.
- **Balance**: between the upper back on the bench edge and the heels (c2, c15): the centre of mass (body plus the
  bar's load at the crease) lies between the edge and the heels in every drawn pose (a two-contact base).
- **Sizes**: lb8/sizes.json `hip_thrust` (PAD_R 0.045 m, GRIP_X 0.2 m, PLATE_D 0.45 m, SLEEVE_D 0.05 m, BENCH_W 0.29 m,
  M_ARCH 12°, FLOOR_BACK, FLOOR_FRONT; BENCH_TOP solved 0.3728 m, START_TILT solved -37.82°, M_TILT solved -83.44°).
- **PQ-H3**: the Mistake **measured 4.1 px** (the `arch` anchor; `ribs` 1.7 px) < 11.39 px: **S2, held** (section
  15). The 12° arch on a body pinned at the bench edge and the feet moves little. The three readings of c11-c13 were
  measured with the same anchors (node, 146.29 px/m), and none reaches the line, so the hold does not hang on the
  modelling choice:

| Mistake model (all M_ARCH 12°, backUpper on the edge, feet planted) | largest tell-anchor move |
|---|---|
| drawn: the bar at the top's height (c12 Contreras: the lockout reached by arching) | 4.1 px |
| the thorax as at the top, the pelvis tipped 12° about the lumbar pivot | 6.2 px |
| the pelvis as at the top, the thorax turned 12° on the edge (hips higher) | 7.2 px |

### cable_kickback (slice; drawn)

- **Tempo** (c14; D-LIB18-TEMPO): `[{ phase: 'Kick back', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }]`
  (pause 1 sourced, PureGym c6/c14; up and down the card's convention, R-LB7-6). BarBend's 1-2 s warm-up pause is not
  the working rep (card tempo.text).
- **Pose map**: identity. The torso, hands and standing leg are the same in start and end (c7, c8, c10); only the
  working (right, near) leg moves (D-LIB18-SIDES: c5 names the right leg; no mirror).
- **Hinge** (c2, a choice): PureGym's "about 45 degrees" drawn (the only number a source gives); BarBend's "lightly"
  in "not facts". The back flat (trunk 0, c8).
- **Fault→key**: plate.mistake "Lower back arching as the leg kicks back" (c7, c8; drawable true) → drawn key `arch`
  ("Lower back arches", c7 "Do not allow your lower back to arch"). handlingMistakes[0] "Not bracing, lower back
  arching." (c7) = the same → topFault `arch`; F7 not raised.
  - **One-tell record** (cable_kickback; D-LIB10-SKULL1, #290 6345185694): fault: the lower back arching (plate.mistake,
    handlingMistakes[0]). Claim ids read: c7 (all three quotes), c8 (both quotes), c4. No second sign stated: c7's
    "flare your upper back" and "sway your hips" are other faults; c8's "using momentum to swing" is c9's fault; "poor
    form is likely to recruit the lower back" is muscle use, not a visible sign.
  - The Mistake: the pelvis tipped forward M_ARCH (12°) about the hip joints and the lumbar extended 12° (trunk -12),
    the thorax keeping its angle; the working hip keeps its end angle, so the leg rises with the pelvis. The hands hold
    the column, so the thorax moves 3.6 cm and the elbows bend 18° → 41° to keep the grips; the arms and torso are left
    out of `mistake.parts` (lat_pulldown's far-arm precedent) and the faulty back contour is a dashed guide on top.
- **Facts** (proposed):

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Attach the cuff to your ankle." (c1, setup) | `contact ankle.r` (the drawn working ankle; the cuff band on it) | start (start) |
| "secure your grip on the cable machine as stability points" (c4, unhedged; "Using your hands") | `contact wrist.l, wrist.r` | start (start) |
| "Place most of your weight on the non-working leg." (c2, setup) | `contact heel.l, ball.l` (the standing foot) | start (start) |

- **Not facts**: c2 "You can hold on to the pulley machine for support if needed" (hedged; the hand fact cites c4);
  c2 BarBend "lightly hinge" and PureGym's 45° (a choice between sources, and a segment angle PANELS.md 7 maps to no
  joint: held by a drawn-item test, the thorax 45° ±2 from vertical); c3 Fitbod's upright stance (another setup); c4
  "free leg to brace, press into the machine" (not drawn: the free leg stands); c5 "slightly flexed" (no number: the
  sized KNEE_SOFT, tested in the view's plane); c6 "as far as possible" and c13 "as far as you comfortably can" (no
  number: END_HIP_EXT); c10 "toe straight down" (a segment angle: tested, heel-to-toe within 2° of vertical); the end
  hand contact: held by a check (no "throughout").
- **Trace**: `ankle.r` (c5 "extend it behind you"). **measured 54.1 px**: passes.
- **Balance**: the standing foot, heel to toe (c2); the hands steady only. **measured** centre of mass from the
  standing mid-sole: start +1.4, ghosts +0.3 and -0.6, end -1.4, Mistake -0.8 cm (±2 cm and inside heel to toe).
- **Sizes**: lb8/sizes.json `cable_kickback` (STANCE_X, STANCE_KNEE 15°, KNEE_SOFT 15°, END_HIP_EXT 15°,
  START_TOE_CLEAR 0.02 m, START_ANKLE 0°, ELBOW_SOFT 18°, M_ARCH 12°, PULLEY_Y 0.10 m, FLOOR_*) and `ankleCuff`.
  END_HIP_EXT's basis (the hip's extension stop with the pelvis held, 10-15° in clinical tables) is not yet checked
  against a primary source (Roach & Miles 1991, Phys Ther 71:656, could not be opened): question 6.
- **PQ-H3**: the Mistake **measured 4.3 px** (the `arch` tell at the Mistake sacrum, on the dashed arch guide; other
  back points 4.3-5.3 px) < 11.39 px: **S2, held** (section 15). The leg rides the pelvis (knee 13.1 px, ankle 26.1 px),
  but no claim states the leg's rise as a sign of the arch, so it carries no tell.
- **Measured flag outside the ruled set**: **F2 0.645** (range 0.191-0.549): the 2.1 m column with its moving stack and
  the kick-back foot far behind fill the plate at the reference scale. Posted for the ruling; nothing changed to dodge it.

## 9. Tempo map (D-LIB18-TEMPO): bulk and leg curls

Rule (LB7 section 8): concentric ← `up`, eccentric ← `down`, `Hold` ← `pause` after the concentric only if pause > 0.
No Rest. Order = drawn order (start → end → back).

| id | card up/down/pause (claim) | phase array | tempo.text only |
|---|---|---|---|
| pendulum_squat | 1/3/0 (c18, c19) | `[{ phase: 'Lower', s: 3, move: true }, { phase: 'Push', s: 1, move: true }]` (drawn start is the top) | BoxLife's bottom "pause for a second" (c19); XcelerateGyms' breath hold at the bottom |
| leg_extension | 2/2/1 (c15, c16) | `[{ phase: 'Extend', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` | Motra's 1 s bottom pause (c15) |
| lying_leg_curl | 1/3/1 (c18, c20) | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 3, move: true }]` | Motra's 1 s bottom pause (c18); Fitness Volt's optional 2-3 s lowering (c19) agrees with the 3 |
| standing_leg_curl | 1/2/1 (c15, c16) | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` | none (no bottom pause on the card) |
| standing_calf_raise | 2/2/1 (c19, c20) | `[{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` | Motra's 1 s bottom pause at the stretch (c19) |
| bodyweight_calf_raise | 2/2/1 (c15) | the same as standing_calf_raise | Motra's 1 s bottom pause (c15) |
| glute_bridge | 1/2/1 (c15) | `[{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` | Healthline's 30 s hold (c13) is another way to do it, not a phase |
| resisted_hip_flexion | 2/2/2 (c8, c15) | `[{ phase: 'Lift', s: 2, move: true }, { phase: 'Hold', s: 2 }, { phase: 'Lower', s: 2, move: true }]` | Motra's middle 1 s, at the bottom (c8) |

- Pause sources: sourced on standing_leg_curl (c16 Hevy "Hold the position for a second"), bodyweight_calf_raise
  (c5 Peloton "a second or two", drawn 1, the low end), glute_bridge (c15 PureGym "for a second"),
  resisted_hip_flexion (c15 Outside "2-3 seconds", drawn 2, the minimum). The 1 s is a WEAK convention on
  leg_extension (c16), lying_leg_curl (c20) and standing_calf_raise (c20). Up/down are WEAK conventions on
  pendulum_squat's up (c18), standing_leg_curl (c15) and glute_bridge (c15) (R-LB7-6).

## 10. Pose map, fault→key map, one-tell records: bulk and leg curls

| id | spec `start` = card | spec `end` = card |
|---|---|---|
| all 8 | plate.start | plate.end |

All identity; no card gives a reason against it. Notes:
- pendulum_squat: start is the top (standing, c1-c4), end the bottom (c3-c6, c9), as plate.frames says.
- Calf raises: start is the bottom (heels low, c9/c10; c2/c3), end the top (c7; c4). The start foot sits mostly under
  the end foot: redraw the hidden start heel/foot as a dashed phantom (D-LIB18-DRAW); the Trace starts at it.
- lying_leg_curl / standing_leg_curl: start knee nearly straight / straight (c6; c4), end curled (c7; c4).
- The Mistake is the end pose plus an override (Q2 (f)) on all 8.

Fault→key (13 Q1(a)); first tell carries the drawn key:

| id | plate.mistake (claim; drawable) | drawn key (other tells) | handlingMistakes[0] | topFault |
|---|---|---|---|---|
| pendulum_squat | heels lift off the platform at the bottom (c9, c15; false) | `heels` (one tell; record below) | dropping into the bottom (c10, c20) | `drop` (F7) |
| leg_extension | back arching off the back pad as the legs extend (c5, c6; true) | `arch` (`off`: c6 Liftosaur "Allowing your back to lift from the support.", Motra "Allowing back to arch off the seat") | the same ("Arching your back.", c5, c6, c4) | `arch` |
| lying_leg_curl | lower back arching as the legs curl (c9, c10; false) | `arch` (one tell; record below) | knees off the machine's axis (c2, c1) | `axis` (F7) |
| standing_leg_curl | lower back arching as the leg curls (c13; false) | `arch` (one tell; record below) | dropping the weight down (c7, c5) | `drop` (F7) |
| standing_calf_raise | knees locked straight while the heels rise and lower (c6, c5; false) | `lock` (one tell; record below) | bouncing at the bottom (c6, c9) | `bounce` (F7) |
| bodyweight_calf_raise | heels moving only part way up or down (c8, c2; false) | `part` (one tell; record below) | moving too fast or bouncing (c9, c8) | `bounce` (F7) |
| glute_bridge | lower back overarching at the top, the hips pushed too high (c6, c7; true) | `arch` (`high`: c6 ACE "Avoid pushing your hips too high as this generally increases the amount of hyperextension (arching) in your low back") | the same ("Overarching the lower back.", c7, c6, c2) | `arch` |
| resisted_hip_flexion | leaning back and arching the lower back to lift higher (c7, c18, c5, c11; true) | `lean` (`arch`: c7 Kovo "Don't lean back or arch your lower back to lift higher", c18 Motra "Excessive lower back arch.") | the same ("Leaning back to lift higher.", c7, c12, c5) | `lean` |

- glute_bridge `high`: plate.mistake.what itself names "the hips pushed too high", so it is a sign of the one fault;
  but handlingMistakes[2] lists "Pushing the hips too high." as its own item. Ruling needed: keep `high` as the second
  tell (c6 ties it to the arch) or make glute_bridge one-tell.
- resisted_hip_flexion: a third tell `high` (the thigh above level, c7 "to lift higher") is possible; it needs its own
  size (none sourced), so not proposed. First tell `lean` because handlingMistakes[0] words it so.
- The 6 F7 topFaults differ from their drawn keys (A8): drop≠heels, axis≠arch, drop≠arch, bounce≠lock, bounce≠part.

**One-tell records (D-LIB10-SKULL1).**
- pendulum_squat: fault c9/c15 (heels lifting). Claim ids read: c9 ("Heels rising: Insufficient ankle mobility
  prevents the heels staying flat through the full depth."), c15 ("Lifting heels off the platform during the descent.
  This shifts weight forward and strains your knees."), c7, plate.tells. "Shifts weight forward" is a consequence with
  no drawn position or size; no second visible sign stated.
- lying_leg_curl: fault c9/c10 (the arch). Claim ids read: c9 (all six quotes), c10, c8, c13. Hips lifting (c8;
  c9 "not from lifting your hips or arching your lower back") is a separate listed fault (handlingMistakes[2]); c10's
  "back pain and discomfort" is a consequence; no second visible sign stated.
- standing_leg_curl: fault c13. Claim ids read: c13 (both quotes), c3 ("keeping your upper body still"), c9 ("body
  swinging": the load/momentum fault). No second visible sign stated.
- standing_calf_raise: fault c6/c5 (locked knees). Claim ids read: c6 ("Locking knees"), c5 (four quotes, the right
  position only). No second visible sign stated.
- bodyweight_calf_raise: fault c8/c2 (partial range). Claim ids read: c8 ("Partial range"), c2, c4, c5. Only the top
  is drawn (Mistake against the end pose), so "part way down" gives no second tell; no second visible sign stated.

## 11. Facts plan (D-LIB8M-FACTS, 22's scope, D-LIB13-FACTS2, D-LIB18-FACTS, -SIDES): bulk and leg curls

Feet flat on a support → heel and ball each side (cable_chest_press precedent, #297 card); back on a flat pad →
backUpper and buttock (D-LIB11-SACRUM; machine_pullover precedent). Every contact gets a `checks` entry (H6).

| id | quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|---|
| pendulum_squat | "Adjust the machine so you can position your shoulders under the pads and feet on the platform." (c1, setup) | `contact heel.l, ball.l, heel.r, ball.r` ("feet") | start (start) |
| pendulum_squat | "keep your back pressed against the backrest throughout the movement" (c3) | `contact backUpper, buttock` | start (start) and end (end) |
| pendulum_squat | "Grip handles firmly." (c16, "Step 1: setup") | `contact wrist.l, wrist.r` ("handles") | start (start) |
| leg_extension | "Sit on the leg extension machine with your back against the pad." (c1, setup) | `contact seat` [verify decides: sitting on the machine = the seat] | start (start) |
| leg_extension | "Keep your back pressed against the backrest throughout the exercise." (c4) | `contact backUpper, buttock` | start and end |
| leg_extension | "Leg Pad Position: Adjust the pad so it rests on the lower part of your shins, just above your feet." (c2, Setup) | `contact ankle.l, ankle.r` ("rests on"; the lower shin's end landmark) [verify decides] | start (start) |
| leg_extension | "Sit back in the chair and hold on to the handles by your sides." (c3, Step 1) | `contact wrist.l, wrist.r` | start (start) |
| leg_extension | "your legs are bent at 90 degrees" (c3, Step 1); "knees bent at a 90-degree angle" (c3, Starting Position) | `angle knee.l 90`, `knee.r 90` | start (start) |
| lying_leg_curl | "Lie on your stomach on the machine" (c1, ACE Step 1) | `contact chest`, `navel` (the trunk's front, PANELS 7) [verify decides] | start (start) |
| lying_leg_curl | "Ensure your hips remain on the machine throughout the movement." (c5, NASM) | `contact navel` (the pelvis's only front landmark; no ASIS landmark) | start and end (start fact cites c5, not c1) |
| lying_leg_curl | "Hold the handles, gently tighten your abs" (c5, FV); "Grasp the handles" (c5, Motra) | `contact wrist.l, wrist.r` | start (start) |
| standing_leg_curl | "placing your thighs against the supportive pad, grab the handles, and have the back of your legs against the lower pad" (c2, setup) | `contact thighTop.l, thighTop.r` ("thighs"); `contact wrist.l, wrist.r` ("handles"); `contact ankle.r` (the lower pad) | start (start) |
| standing_leg_curl | "plant your left foot firmly on the floor" (c3; plate.start cites c3) | `contact heel.l, ball.l` (named side) | start (start) |
| standing_calf_raise | "step onto the platform with balls of feet on the edge, heels hanging off" (c1, setup) | `contact ball.l, ball.r` | start (start) |
| standing_calf_raise | "Place the shoulder pads against your shoulders" (c1, StrengthLog step 1) | `contact shoulderTop.l, shoulderTop.r` [verify decides] | start (start) |
| standing_calf_raise | "Position shoulders under pads, grasp handles" (c2, setup) | `contact wrist.l, wrist.r` | start (start) |
| standing_calf_raise | "Place your toes and the ball of your feet on the foot support." (c1, StrengthLog) | `contact toe.l, toe.r` — cannot hold at the stretched start with a rigid foot (toe lifts ~3.7 cm at 15° dorsiflexion): S4/S3, post | start (start) |
| bodyweight_calf_raise | "Stand up onto your tiptoes, lifting the heels off the floor." (c4; plate.end cites c4); "press through the balls of your feet" (c4) | `contact ball.l, ball.r` [verify decides; rigid foot: the ball is the drawn support] | end (end) |
| glute_bridge | "Lie flat on your back with arms straight by your side, knees bent hip-width apart, and feet flat on the floor." (c1, setup) | `contact backUpper, buttock`; `contact heel.l, ball.l, heel.r, ball.r` | start (start) |
| glute_bridge | "press your heels into the floor for more stability" (c3; plate.end cites c3) | `contact heel.l, heel.r` | end (end) |
| glute_bridge | "Your shin and thigh should roughly be at a 90 degree angle." (c4; plate.end cites c4) | `angle knee.l 90`, `knee.r 90` (generic singular on a two-leg bridge; if read as one side, `knee.r`) | end (end) |
| resisted_hip_flexion | "Attach an ankle cuff to a low cable and strap it to your working ankle." (c2, setup) | `contact ankle.r` (no side named; drawn right, D-LIB18-SIDES) | start (start) |
| resisted_hip_flexion | "Face away from the machine and hold the frame for balance." (c2; unhedged, so it beats c1's "if needed") | `contact wrist.l` (one hand, no side named; the far hand keeps the near arm off the working hip) [choice of side] | start (start) |

**Not facts**, each with its reason:
- pendulum_squat c1 "shoulders under the pads": a place, not a touch; held by a check. c2 "hip-width" / "shoulder-width": a
  width the side view cannot show (and a conflict, card notes). c4 "parallel to the floor or slightly lower" and c6 "at or
  below parallel": an "or" (D-LIB17-ORCHOICE); the plate draws parallel. c5/c6 "torso upright": no number. c6 "knees track
  over the toes": a place; check. c7 "Push through the full foot heel and ball": a motion cue not cited by plate.start/end;
  c9 "the heels staying flat through the full depth": the fault's description, not an instruction; the end heels are held by
  a check and a drawn-item test (bench_dip's end heels) — open item 3. c21 "without locking out hard": no number (size).
- leg_extension c1 "knees align with the machine's pivot": a place (geometry); check. c2 "just above your ankles": a place
  near something (size). c3 "lower shins behind the pad": a place. c7 "parallel with the ground": an angle to the floor
  with no joint convention; held by a check (shank within ±5° of level). c7/c8 "straight but not locked", "nearly fully
  extended": no number (size). c4 "Draw your navel towards your spine": no fact kind.
- lying_leg_curl c1 "close to the edge of the bench", c3 "just above the heel": places (sizes; ruled). c3 "Set the roller
  against the lower calf": the ruling lists c3 as a size; if the verifier reads "against" as a contact it is `ankle.l/.r`
  start — open item 4. c6 "nearly straight": no number. c7 "bent more than 90 degrees, or ... vertical ..., or ... close to
  touching your butt": an "or" (ruled). c1 "aligning the mid-point of your knee joint with the axis": a place; check.
- standing_leg_curl c1 "just above the heel of the working leg": a place (size). c2 "Lean forward" vs "maintain an upright
  posture": a conflict, no number; the plate draws one (open item 5). c2's plural "legs" against the lower pad: only the
  working (right) leg has one (c1, c3's left foot on the floor), so only `ankle.r` — open item 6. c4 "foot becomes higher
  than your knee": a relation, no number; check. c6 knee steady: a place; check (knee ±1 cm start/end). c11 switch legs: no
  mirror drawn (D-LIB18-SIDES).
- standing_calf_raise c1/c2 "shoulders under pads": a place; c1 StrengthLog's "against" carries it. c4 "parallel and
  hip-width": a width. c5 "slightly bent": no number (size). c7 "as high as you can", "fully extending ankles": no number.
  c10 "full but comfortable stretch": no number. c11 "Stay upright": no number; check.
- bodyweight_calf_raise c1 "arms by your sides, or place your hands on a wall or chair for balance if needed": an "or" and
  hedged (ruled); the plate draws the arms by the sides. c2 "flat or slightly below": an "or" (ruled); the plate draws
  slightly below. c3 "heels hanging off the edge": no touch (WEAK, the eccentric variation). c1 "hip-width", "toes forward":
  width / front view. c7 "straight but unlocked": no number (size).
- glute_bridge c1 "arms straight by your side": no touch stated (the card's grip.handContact is the card's reading, not a
  quote); check. c2 "your lower back is flat against the floor" (setup): a contact on the low back; the model's surface
  point there is `sacrum`, ruled out on a flat support by D-LIB11-SACRUM unless the drawn tuck holds it — open item 7.
  c4 "shoulders, hips and knees are in a straight line": no number, no joint; check (hip on the shoulder-knee line ±1 cm).
  c12 "knees and toes in the same line": front view.
- resisted_hip_flexion c1 "holding stable object for balance if needed": hedged (ruled); c2 carries the hand. c5 "thigh
  parallel to floor or knee near chest": an "or" (ruled); the plate draws thigh parallel. c5 "full hip extension": no
  number (size). c3 "bending knee toward chest": no number. c6 "Hips level, no rotation": front view. c13/c14 the band
  version (shoe loop, wall): not the drawn cable version. End cuff on the ankle: held by a check (no "throughout").

## 11a. Trace points (D-LIB18-TRACE) and balance bases (D-LIB18-BALANCE): bulk and leg curls

| id | trace point (claim) | support base (claims) |
|---|---|---|
| pendulum_squat | `knee.r` (plate.frames "Trace follows the knee"; c4 "bending your knees") | machine-held: within the shoulder pads (c1), back pad (c3) and the feet on the platform (c1, c2) |
| leg_extension | `ankle.r` (c7 "Exhale to extend your lower legs") | within the seat (c1 "Sit on the leg extension machine") and back pad (c1, c4) |
| lying_leg_curl | `heel.r` under the roller (c7 Motra "curl your heels toward your glutes"; ACE "moving the resistance pad") | within the bench pad under chest and hips (c1 "Lie on your stomach on the machine", c5) |
| standing_leg_curl | `heel.r` (c3 "pulling your heel up toward your glutes"; c4) | between the standing foot (c3 "plant your left foot firmly on the floor") and the thigh pad (c2) |
| standing_calf_raise | `heel.r` (c7 "raise your heels as high as you can") | the forefoot on the platform edge (c1), with the shoulder-pad load at the shoulders (c1, c2); hands balance only (c3) |
| bodyweight_calf_raise | `heel.r` (c4 "lift your heels as high off the ground as possible") | the forefoot on the step edge (c3, c4) |
| glute_bridge | `hip.r` (c4 "push your hips towards the ceiling") | between the upper back (c1 "Lie flat on your back") and the heels (c3 "press your heels into the floor") |
| resisted_hip_flexion | `knee.r` (plate.frames; c2 "Drive your knee up and forward") | the standing foot (c12 "keep your standing leg steady"); the hand on the frame steadies only (c2) |

## 12. Size table (D-LIB18-SIZE; proposals for `lb8/sizes.json` at the bulk)

Main-line bases verified on `1ffd0dac` (tools/plates/vendor/; working tree identical): leg_press.mjs:13 and :23 (knees
15° short of lockout), :18-19 and :28 (footplate PHI 15, "with a square plate the heels need 45 deg of dorsiflexion"),
:87 (M_ROLL 25), :95 (HEEL_LIFT 12); hanging_leg_raise.mjs:69 (trunk -12), :52/:54 (pelvis tucked 25°, tilt -25);
barbell_back_squat.mjs:30 (standing "knees 5 deg soft"); seated_cable_row.mjs:25 (low pulley 0.44 m); engine/
equipment.mjs:85 (column 2.1 m), :157 (bench top 0.43 m, 6 cm pad), :181 (seat 40 cm, 7 cm pad), :186 (backPad t 0.07),
:204 (kneePad r 0.055), :300 (pulley r 0.045).

| id | name | value | basis |
|---|---|---|---|
| pendulum_squat | START_KNEE | 5° [proposed] | c21 "Extend fully at the top without locking out hard" + barbell_back_squat.mjs:30 (standing, knees 5° soft); alt. leg_press.mjs:13/:23 15° (open item 1) |
| pendulum_squat | END depth | thighs parallel | c4 (one option of its "or") |
| pendulum_squat | END shin | knee over the toe: shin ~29° forward | c6 "knees track over the toes": asin(21.0/43.1) |
| pendulum_squat | PLATFORM tilt, height | 0° (flat), top 0.15 m | stated: c1 names no angle; at 29° the ankle dorsiflexes 29°, inside weight-bearing range, so no wedge (c9's wedge is the fault's fix, not the setup) |
| pendulum_squat | PIVOT, ARM_LEN, SWING | pivot ahead of and above the shoulder pads; solved so the back pad turns ≤ 15° start→end | stated: c6 "The torso remains upright the arc of the machine naturally maintains this position" (open item 2, S3 risk) |
| pendulum_squat | SHOULDER_PAD, BACK_PAD | kneePad r 0.055 on shoulderTop; backPad t 0.07, tangent to backUpper/buttock | equipment.mjs:204, :186; c1, c3 |
| pendulum_squat | M_HEEL (Mistake) | 12° heel-up about the ball | leg_press.mjs:95 (HEEL_LIFT 12), named by D-LIB18-SIZE; toe pad stays 0.4 cm above the platform (out at < 15.2°) |
| leg_extension | SEAT_TOP | solved: knee at the pivot, the foot 5 cm above the floor at knee 90 | stated: shank 43.1 + ankle 6.8 + 5 cm clearance ≈ 0.55 m |
| leg_extension | BACK_RECLINE | 15° behind vertical [proposed] | stated: the pad tangent to backUpper and buttock with the thighs level on the seat (c1, c3); no claim gives an angle |
| leg_extension | ROLLER r, contact | 0.055 m; on the shin 8 cm above the ankle joint | equipment.mjs:204; c2 "just above your ankles" |
| leg_extension | KNEE_SOFT (end) | 15° | leg_press.mjs:13/:23 for c7/c8 "not locked" (D-LIB18-SIZE) |
| leg_extension | M_ARCH (Mistake) | 12° (pelvis tips forward 12°, lumbar extends 12°) | hanging_leg_raise.mjs:69 (as LB6 M_ARCH, lb6/sizes.json) |
| leg_extension | LEVER, PIVOT boss, STACK, HANDLE | lever 4 cm tube; boss r 0.03; handle by the seat | stated (legCurlMachine's sizes, d3b231d6 header, as convention); c3 |
| lying_leg_curl | BENCH_TOP | 0.43 m, flat | equipment.mjs:157 (plate.equipment "flatBench") |
| lying_leg_curl | KNEE_OUT | knee joint 4 cm past the bench end | c1 "close to the edge of the bench" |
| lying_leg_curl | PIVOT | level with the knee joint | c1 (axis) |
| lying_leg_curl | ROLLER contact | 6 cm above the heel landmark on the back of the calf; r 0.055 | c3 "just above the heel"; c4 "lowest comfortable position"; equipment.mjs:204 |
| lying_leg_curl | START_KNEE | 15° | c6 "nearly straight, but do not force them into a painful locked position" + leg_press.mjs:13/:23 |
| lying_leg_curl | END_KNEE | 100° [proposed] | c7 "bent more than 90 degrees" (one option): 10° past 90 |
| lying_leg_curl | M_ARCH (Mistake) | 12° (thorax lifts, hips stay) | hanging_leg_raise.mjs:69 |
| standing_leg_curl | START_KNEE (working) | 0° | c4 "extend your knee fully" (the card asks it, so 0° is card-true) |
| standing_leg_curl | STANCE_KNEE | 5° | barbell_back_squat.mjs:30 (standing soft knee; no lock the card does not ask for) |
| standing_leg_curl | LEAN | hip 10° flexed [proposed] | c2 Hevy "Lean forward on the machine" (one side of c2's conflict) |
| standing_leg_curl | END_KNEE | 110° [proposed] | c4 "until your foot becomes higher than your knee": the ankle ~15 cm above the knee with the thigh near vertical |
| standing_leg_curl | PIVOT, THIGH pad | pivot at the working knee (~0.50 m); thigh pad on thighTop | c6; c2; legCurlMachine p.thigh |
| standing_leg_curl | M_ARCH (Mistake) | 12° | hanging_leg_raise.mjs:69 |
| standing_calf_raise | KNEE_SOFT | 15° | leg_press.mjs:13/:23 for c5 "slightly bent" (D-LIB18-SIZE) |
| standing_calf_raise | START_DF | 15° heel-down about the ball [proposed] | stated: c10 "full but comfortable stretch": short of the ~20° passive end range; heel 4.7 cm below the edge |
| standing_calf_raise | END_PF | as high as the rigid foot allows card-true | c7 "as high as you can"; capped by the toe (S4): toe pad touches at 15.2° |
| standing_calf_raise | PLATFORM height/depth | 0.15 m / 0.30 m | stated: the start heel (4.7 cm down) clears the base by ≥ 5 cm; depth under the forefoot |
| standing_calf_raise | SHOULDER_PAD, HANDLE | kneePad r 0.055 on shoulderTop; handle at the pad | equipment.mjs:204; c1 "to your height", c2, c3 |
| standing_calf_raise | M_LOCK (Mistake) | knee 0° | c6 "Locking knees" (full extension is the fault) |
| bodyweight_calf_raise | KNEE_SOFT | 15° | leg_press.mjs:13/:23 for c7 "straight but unlocked" (open item 1: 5° from barbell_back_squat.mjs:30 reads "straight" better) |
| bodyweight_calf_raise | START_DF | 10° [proposed] | c2 "slightly below" (the drawn option) |
| bodyweight_calf_raise | END_PF | as standing_calf_raise | c4; S4 cap |
| bodyweight_calf_raise | STEP height/depth | 0.15 m / 0.28 m (vendor box) | stated: a stair riser; the start heel clears the floor |
| bodyweight_calf_raise | M_PART (Mistake) | half the drawn rise [proposed] | stated: c8 "Partial range" gives no fraction; the midpoint |
| glute_bridge | END_KNEE | 90° | c4 (fact) |
| glute_bridge | END line | shoulder, hip, knee collinear: thigh 22° above level, hip 0.30 m up | c4; solved: shoulder 0.126 m up, trunk 47 cm, thigh 42.9 cm, ankle on its 6.8 cm |
| glute_bridge | FEET | fixed start→end, from the end solve | c1, c3 (feet flat, heels down) |
| glute_bridge | START tuck | lumbar flexion just enough to bring the low back to the floor | c2 (solved, physical); hanging_leg_raise.mjs:52/:54 tucks 25° as the ceiling |
| glute_bridge | M_ARCH (Mistake) | 12° | hanging_leg_raise.mjs:69 |
| glute_bridge | M_HIGH (Mistake) | hips raised by the 12° arch with shoulders and feet fixed (solved) [proposed] | c6 "pushing your hips too high ... increases ... arching": the rise follows the arch, no separate number |
| resisted_hip_flexion | PULLEY_Y | 0.12 m (lowest) | stated: c1/c2 "low cable": pulley r 0.045 (equipment.mjs:300) over a 5 cm base + 2.5 cm gap; below the start ankle |
| resisted_hip_flexion | COLUMN distance | the far hand reaches the upright: ~0.55 m behind the hips | stated: c2 "hold the frame" with the arm at most 45° extended; card unsourced "Distance from the column" |
| resisted_hip_flexion | START_HIP | 15° extension [proposed] | c5 "full hip extension behind body", plate.frames "slightly behind the body" |
| resisted_hip_flexion | END_HIP, END_KNEE | 90° (thigh level), 90° (shank plumb) [proposed] | c5 thigh parallel (drawn option); c3 "bending knee": the shank hangs |
| resisted_hip_flexion | STANCE_KNEE | 5° | barbell_back_squat.mjs:30 |
| resisted_hip_flexion | M_ARCH / lean (Mistake) | trunk 12° (thorax 12° back) | hanging_leg_raise.mjs:69 |
| resisted_hip_flexion | CUFF | box on the ankle (census `ankleCuff`) | slice's ankleCuff sizes |

## 13. PQ-H3 estimates [est] (deviationMin 11.39 px, traceLenMin 22.11 px): bulk and leg curls

| id | Mistake: largest tell-anchor move, end → Mistake | Trace |
|---|---|---|
| pendulum_squat | heel 12° about the ball: 18.2 × sin 12° = 3.8 cm → **~5.5 px: below, S2 likely** (card names it) | knee, top → parallel: ~26 cm → ~38 px |
| leg_extension | pelvis 12° forward, thorax carried off the pad: lumbar/backMid ~3.3 cm → **~5 px**; up to ~9 px if the upper back leaves too: **at risk** (pullover's arch measured 15.4 px only with its head tell) | ankle, knee 90° → 15°: ~56 cm arc → ~82 px |
| lying_leg_curl | thorax 12° up about the lumbar pivot: backUpper ~4.8 cm → **~7 px; at risk** (the head, ~14 cm/20 px, is not the arch's sign) | heel, 15° → 100°: ~67 cm → ~98 px |
| standing_leg_curl | as lying: backUpper ~7 px, backMid ~3 px: **at risk** | heel, 0° → 110°: ~86 cm → ~126 px |
| standing_calf_raise | knee 15° → 0°: knee 5.6 cm off the hip-ankle line → **~8.2 px: below, S2 likely** (matches horizontal_leg_press's 8.2 px) | heel about the ball, 18.2 cm radius: 15° + 15° (S4 cap) → ~14 px; 15° + 40° → ~26 px: **below unless the top passes the toe cap** |
| bodyweight_calf_raise | half the rise: 3.4 px (15° top) to 8 px (40° top): **below, S2 likely** | 10° + 15° → ~12 px; 10° + 40° → ~23 px: **at risk** |
| glute_bridge | hip/sacrum under the 12° arch: ~3.3-4 cm → **~5-6 px**; to ~10 px with the extra hip rise (M_HIGH): **at risk** | hip, lying → top: ~0.14 → 0.30 m up, ~17 cm → **~24 px: marginal pass** |
| resisted_hip_flexion | thorax 12° back: head ~14 cm → ~20 px; neck ~12.6 px; shoulders ~9.6 px: **passes if `lean` anchors at the head/neck** (the sign is the trunk's lean; anchor picked on the sign, not H3) | knee, 15° ext → 90° flex: ~79 cm → ~115 px |

A fault below the line is reported at its card-true size and held (D-LIB18-SIZE, -CALF; route LIB-ZOOM); never enlarged.

### Likely Stops (bulk and leg curls)

- S2 (held under D-LIB8-shrug): pendulum_squat Mistake ~5.5 px; standing_calf_raise Mistake ~8.2 px; bodyweight_calf_raise
  Mistake 3-8 px; the two calf heel Traces 12-26 px (below unless the top passes the toe cap); the four arches (leg_extension,
  the two leg curls, glute_bridge) ~3-10 px on back-surface anchors [est]; glute_bridge Trace ~24 px marginal.
- S4: standing_calf_raise and bodyweight_calf_raise: the rigid toe (21.0 cm ahead, 1.9 cm up) enters the platform/step past
  15.2° of heel rise about the ball, far short of "as high as you can" (c7) / "on the tiptoes" (c4). Reverse_lunge's method
  (dcac4a38 specs/reverse_lunge.mjs:19-22) caps the top at 15.2°; card-true needs more → held, owner's route. Also
  StrengthLog's "Place your toes and the ball of your feet on the foot support" (c1) cannot hold at the stretched start
  (toe ~3.7 cm up at 15°).
- S3: bodyweight_calf_raise "standing tall" (c1) with the centre of mass over the forefoot: a ~8° whole-body lean from the
  ankle (ball 14 cm ahead, centre of mass ~0.93 m up); standing_calf_raise the same with c11 "Stay upright". pendulum_squat:
  back on the swinging pad in both poses (c3 "throughout") with the torso upright (c5, c6) if the arm turns the pad by more
  than a few degrees. glute_bridge's top solves (thigh 22°, knee 90°, feet flat, ankle 22° plantarflexed), so no conflict
  expected at the nominal sizes.
- S7: legCurlMachine @ `d3b231d6` builds seat, seat post, back pad and thigh pad unconditionally (`seat[2]`,
  `back`, `thigh` dereferenced): lying_leg_curl (no seat, no back pad, no thigh pad on its card) and standing_leg_curl
  (no seat, no back pad) cannot pass `null` as the header's "Later users" note says without a TypeError. Neither has a bench
  pad either (lying uses vendor `bench`, equipment.mjs:157). [unverified until drawn on main's version.]
- S1: none expected: every fault moves a body joint the engine has (lumbar `trunk`, `ankle`, `knee` to 0°).

### Bulk planning items not settled

1. "Slight/unlocked" knee size where the quote says straight: pendulum c21 "Extend fully", bodyweight c7 "straight but
   unlocked". D-LIB18-SIZE names leg_press 15°; barbell_back_squat.mjs:30's 5° standing soft knee may read truer. Ruling.
2. pendulum_squat arm geometry (pivot, arm length, swing): no claim or main plate gives it; it decides whether c3's
   back-on-pad "throughout" and c5's upright torso hold together (S3).
3. pendulum_squat end heels: c9 (cited by plate.end) describes the fault, not a right-pose instruction; proposed check-only.
4. lying_leg_curl c3 "Set the roller against the lower calf": the ruling calls c3 a size; "against" may be a contact
   (`ankle.l/.r`).
5. standing_leg_curl c2's lean-forward vs upright conflict: proposed lean 10° (Hevy).
6. standing_leg_curl c2's plural "legs against the lower pad" on a one-roller machine: proposed `ankle.r` only.
7. glute_bridge c2 "lower back is flat against the floor": `sacrum` only if the drawn tuck holds it (D-LIB11-SACRUM).
8. glute_bridge `high` as a second tell vs handlingMistakes[2]'s separate "Pushing the hips too high."
9. resisted_hip_flexion: which hand holds the frame (proposed `wrist.l`), and whether `lean`'s anchor on the head/neck is
   the sign (it decides pass/fail).
10. Contact readings marked [verify decides]: leg_extension `seat` and `ankle` (c1, c2), lying_leg_curl `chest`/`navel`
    (c1), standing_calf_raise `shoulderTop` (c1), bodyweight_calf_raise end balls (c4).
11. All PQ-H3 numbers are hand estimates from body.mjs segment lengths; the arch values depend on which part the drawn
    override moves (pelvis vs thorax) — hip_thrust's and cable_kickback's slice measurements (4.1 and 4.3 px, section 8) recalibrate them downward.

## 14. H slice (Do 2; D-LIB18-SLICE)

hip_thrust, hack_squat with eq/hackSled.mjs, seated_calf_raise with eq/calfMachine.mjs and cable_kickback with
eq/ankleCuff.mjs are drawn on this branch (section 8). Their renders, the drawn-item tests, the
QA table and A9 go in the 'LB8 SLICE READY' post. Held rows' renders come only from `lb8/build.mjs --held`. Every slice
plate passes pilot A's report.mjs with ok:true (dark, paper and Mistake; DRAWING-GUIDE §5).

## 15. Held ids

| id | ruling | why (measured at the ruled sizes) | route |
|---|---|---|---|
| hip_thrust | D-LIB8-shrug (D-LIB18-SIZE, S2) | the card-true 12° lumbar arch (hanging_leg_raise.mjs:69) measures 4.1 px < 11.39 px; the other two readings of c11-c13 give 6.2 and 7.2 px (section 8); the Trace passes (28.2 px) | LIB-ZOOM (#279) on main and extended to the arch, then 'LIB-18 resume' |
| cable_kickback | D-LIB8-shrug (D-LIB18-SIZE, S2) | the card-true 12° arch measures 4.3 px < 11.39 px (the braced upper body holds the back still); the Trace passes (54.1 px) | LIB-ZOOM, as above |
| seated_calf_raise | D-LIB8-shrug (D-LIB18-CALF, S2) and D-LIB18-CALF S4 | the heel Trace at the card-true range measures 11.8 px < 22.11 px; the rigid toe is 2.93 cm inside the platform at the card's top (enters past 8.9°) | the owner's route for S4 (D-LIB18-CALF), brought by the supervisor; LIB-ZOOM for S2 |

Held rows are in no rows file; their specs, tests and (after Do 6 b) card keys stay.

## 16. Risks and mitigations

1. **The arch Mistakes are small on a braced body** (hip_thrust 4.1 px, cable_kickback 4.3 px measured; leg_extension,
   both leg curls and glute_bridge estimated 3-10 px): at the 12° convention the back moves a few centimetres when the
   upper back, hands or pads hold the trunk. Held under D-LIB8-shrug with the LIB-ZOOM route; never enlarged
   (question 1). resisted_hip_flexion's lean moves the whole trunk and may pass.
2. **The calf raises' rigid foot** (seated_calf_raise measured; the two standing ones estimated past 15°): S4, the
   owner's route (D-LIB18-CALF); their heel Traces are short as well (S2).
3. **Trace trims** (hack_squat): the clone source's [6, 8] passes, the guide's "about [10, 12]" does not (question 2).
4. **Labels in closed pockets** (hack_squat's soft knee, hip_thrust's bar inside its plate ring): named-nit candidates
   with their scans (question 4).
5. **Pilot B's composer** may need an edit for the two leg curls (S7, unverified until drawn on main's version).
6. **Bulk unknowns**: pendulum_squat's arm geometry decides c3 with c5-c6 (S3); bodyweight_calf_raise's upright body
   over the forefoot (S3); the bulk heel lift and knee lock are estimated below the line (S2).
7. **Scratch ids** (D-LIB18-SCRATCHIDS): none targets an LB8 id; the full `npm test` (A12) runs every fixture test.
8. **Shared appends**: docs/COACHING-DECISIONS.md is append-only; conflicts keep both sides.
9. **Test manners** (D-LIB18-TESTS): an afterEach macrotask, one yield per spec in every render loop, and generate and
   every whole-page build in an awaited child process from the first commit (A19 pins them).

## 17. Questions for the supervisor ('LB8 NOTE RULED')

1. **The arch convention on braced bodies.** At hanging_leg_raise.mjs:69's 12° (D-LIB18-SIZE), hip_thrust's and
   cable_kickback's arches measure 4.1 and 4.3 px (deviationMin 11.39), whichever reading of the claims is drawn
   (hip_thrust: 4.1, 6.2, 7.2 px). Proposed: hold both under D-LIB8-shrug (S2), route LIB-ZOOM, as the card's
   risk_and_recovery says; expect the same for leg_extension, the two leg curls and glute_bridge. cable_kickback's
   rising leg (26.1 px) carries no tell, because no claim states it as a sign of the arch.
2. **Trace trim.** hack_squat traces the knee at leg_press.mjs:132's trim [6, 8] (its clone source): 26.4 px; at
   DRAWING-GUIDE §2's "about [10, 12]" it is 18.2 px (held). The trim was not chosen by H3, but both are conventions:
   which binds? seated_calf_raise is short either way (11.8 px at [6, 8]).
3. **hack_squat's `round` anchor.** The second tell sits on the pelvis's front (the `seat` landmark plus a px offset to
   the groin: 15.8 px, that point's own drawn motion); the nearest named landmark, `hips`, gives 10.9 px (held). Is a
   landmark-plus-offset anchor on the rolled pelvis acceptable for "the lower back rounds"?
4. **Named-nit candidates** (D-LIB15-NIT1): hack_squat's "Slight knee bend" leader crosses the rail once (scan in
   section 8); hip_thrust's "Bar in crease" callout and "Back arched" tell cross the barbell's 45 cm plate ring to
   reach the bar and the waist (the ring surrounds both); hip_thrust's knee arc sits in the closed angle under the
   thigh, and every leader under 130 px from it crosses the thigh (a clean box needs one past F3's 82 px).
5. **Facts plan** (section 10), in particular: the "throughout" contacts (hack_squat c2, hip_thrust c3 and c15,
   pendulum_squat c3, leg_extension c4, lying_leg_curl c5); hip_thrust's backUpper on the bench edge at start (c2) and
   end (c9); cable_kickback's standing-foot contact from c2; seated_calf_raise's end balls (c8) as a check only.
6. **Unverified size bases**, each a stated reason with numbers but no opened primary source: cable_kickback END_HIP_EXT
   15° (the hip's extension stop; Roach & Miles 1991 could not be opened); seated_calf_raise START_DF 20° and END_PF 50°
   (the AAOS norms). Accept as stated physical reasons, or route to research?
7. **F2 on cable_kickback**: 0.645 (range 0.191-0.549), the 2.1 m column with its stack and the kicked-back foot at the
   reference scale. Proposed as a named flag; nothing changed to dodge it.
8. **hack_squat's TOE_OUT 8°** (not leg_press's 15°), so the soles hold the plate within 0.2 cm (c13).
9. The tempo map (section 8), the pose map (identity for all 12) and the fault→key map with the six F7 topFault keys
   (`drop`, `axis`, `drop`, `bounce`, `bounce`, `bounce`; section 9).
10. The bulk planning items in section 13's last list ("Bulk planning items not settled") (the pendulum arm, the unlocked-knee size where a quote says
    straight, glute_bridge's `high` tell against handlingMistakes[2], resisted_hip_flexion's frame hand and `lean`
    anchor, lying_leg_curl c3's "against the lower calf").
