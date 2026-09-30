# Census: How to do it for the whole library (153 exercises)

Date 2026-09-30. Library read from `origin/main` (cae1725), `src/data/exercises.json`. Machine-readable twin: `census.json` (every table below is generated from it; the per-exercise rows are in section 8). Nothing in any repo was edited; probes and scripts live only in this folder.

## 0. The answer in numbers

- **8 done, 145 to build.** Closeness of the 145 to an approved plate: **4 same plate with a parameter change**, **45 same family with a new pose** (or the same primitives recomposed), **9 same movement but a new equipment drawing**, **87 new movement**. So the approved 8 do not stretch by parameter: only 4 exercises reuse a plate with a constant changed (chin-up, hanging knee raise, close-grip and underhand pulldown).
- **Engine readiness of the 145** (worst case per exercise, section 1.4): R1 41 buildable from existing primitives in a pose an approved plate already proves; R2 51 buildable from existing primitives, pose new to the plates (solved in my probe, untuned); R3 30 need a machine or bench composed from existing parts (no engine code change); R4 20 need a new equipment drawing in `equipment.mjs`; R5 3 cannot be drawn by the engine at all (body roll or yaw).
- **Plate fit tier** (my judgement, section 1.5): tier 1 fits the standard plate 107 of 145 (the 8 approved are tier 1 too, so 115 in the column), tier 2 needs a decision 26, tier 3 does not fit the plate concept 12.
- **Equipment the engine lacks** (section 4.1): 20 exercises need a drawing that is not in `equipment.mjs` (smith 5, rope 3, ropeLikely 2, landmine 2, sled 2, dipBars 1, romanChair 1, hackSled 1, pendulum 1, jumpRope 1, kettlebell 1, battleRope 1); 33 more need a machine or bench composed from existing parts.
- **Pose capabilities the engine lacks:** roll and yaw (3 exercises: side plank, Russian twist, bicycle crunch). Every other pose class is expressible; none besides seated, reclined, standing, hanging and leaned is proven by an approved plate. My probe solved supine, incline, decline, prone, plank, quadruped, single-leg, split, kneeling, bridge, floor-sit and standing-overhead poses (section 2.3), untuned.
- **Layers under the plate:** 131 exercises need a hand close-up (all but `none`). Golden B has drawn 6 of the 9 hand archetypes that have a hand (hold, on-body, hang, pull, push, balance). Never drawn: palm-flat (10 exercises), curl (13), implement (5). The hand renderer only draws a hand closing round a round handle seen end-on (section 2.5). The feel map paints 21 of 24 muscle ids; **6 exercises have no paintable primary muscle** (section 4.4).
- **28 natural batches** share one template (section 5). Largest: conditioning and carries 12 (custom, no shared template), floor core 11, standing curls 9 (plus supported curls 4), lunges 8, hinge 7, cable raises and rear delts 7, bench presses 6, triceps 6, free squats 6.

## 1. Method and definitions

**Read (not assumed):** `engine/equipment.mjs`, `body.mjs`, `layout.mjs`, `plate.mjs`, `sheet.mjs`, `SPEC.md` (plates2, byte-identical (diff) to the app vendor copy for body.mjs, equipment.mjs and SPEC.md; golden B engine copies of body, equipment, layout and geom are identical too); golden B `hand.mjs`, `hand-pairs.mjs`, `feelmap.mjs`, `bodymap-parts.mjs`; the 7 engine plate specs and the golden B README; the HT plan (2.7, 2.9, 4.2, 5, 6); GA architecture (3.1, 3.2, appendix B); the app on main (`ids.ts`, `plates.json`, `gen/plates.mjs`, `src/data/muscles.ts`, `src/svg/bodyMuscles.ts`).

**Probes I ran** (read-only imports of the engine; scripts `probe-poses.mjs`, `probe-render.mjs`, `probe-eq.mjs` in this folder, image `probe.png`): they call `normPose`, `resolve`, `fk`, `landmarks` and `renderPlate` with new pose classes, and `PRIMITIVES.legPress45` and `PRIMITIVES.latBar` with new parameters. They prove a pose resolves and renders; they do not prove plate quality.

**Hand archetype** is parsed from GA appendix B (script asserts 153 ids, each once, counts 26/10/19/5/28/13/7/18/5/22 as the GA states). **Contact archetype:** GA 3.2 gives definitions and totals only, no per-id list; I derived the split from the GA descriptions and it reproduces every GA total exactly (seat-back 20, bench-lying 13, foot-platform 6, pivot-pad 4, brace-pad 7, floor-body 22, hang-support 6, standing-feet 75; asserted). Secondary contacts are the ones GA 3.2 names (knee pad on the 4 pulldowns; pivots on leg extension, seated leg curl, hip abduction and adduction). Treat the per-id contact column as derived, not GA-confirmed.

### 1.1 Closeness to an approved plate

Approved: LR = dumbbell lateral raise, SQ = barbell back squat, PU = pull-up, HLR = hanging leg raise, LPD = lat pulldown, SCR = seated cable row, LP = leg press, MCP = machine chest press. "Closest" = the approved spec I would clone first (same equipment set, pose class or joint action). Classes, in precedence order:
- **P** = same plate, parameter change.
- **F** = same family, new pose (or recomposed existing parts).
- **E** = same movement, needs a new equipment drawing.
- **N** = new movement (no approved plate has this joint action or body position).
- Precedence: N wins over E (a new movement that also needs new equipment is N, with the equipment listed). E only when a needed item is missing from `equipment.mjs` and the movement itself is covered by an approved plate. F may use existing parts recomposed (for example a chest-supported row machine from `backPad`, `seat` and `chestPress`).

### 1.2 Pose status codes

- **P** proven in an approved plate. **S** solved by the engine in my probe (resolves, mostly renders, untuned). **M** follows from the same model, not probed. **X** not expressible in `body.mjs`. Per exercise the worst status of its poses is used.

### 1.3 Equipment status codes

- **exists** a primitive in `PRIMITIVES` draws it. **exists-param** an existing primitive with a parameter no approved plate uses (checked by code or probe). **compose** not in `equipment.mjs`; buildable from `box`, `line`, `pulley`, `seat`, `backPad`, `kneePad`, `pivotArm` (chestPress) with no engine change, but it needs a design and a contact sheet. **missing** needs new drawing code (a new primitive, or for single-use items a box/line composition).

### 1.4 Readiness

R0 approved. R1 exists or exists-param, poses all P. R2 exists or exists-param, some pose S or M. R3 some equipment is compose. R4 some equipment is missing. R5 some pose is X. Precedence R5 over R4 over R3 over R2 over R1.

### 1.5 Tier (does a Technical Plate fit?)

- **1** the standard plate fits (two poses, one traced point, a Mistake, tempo). **2** it fits after a decision: an isometric hold (start = end, so Trace has nothing to trace), a view conflict, a very small motion at the reference scale (146.29 px/m), a fault that needs roll or yaw, or an airborne or ballistic frame. **3** it does not fit as designed: the action is rotation the pose model cannot express, or it is cyclic, travelling, or an implement path. Tier is my judgement from the engine limits; the owner decides tier 3.

## 2. What the engine has today (from reading engine/*.mjs)

### 2.1 Equipment primitives: 20

`floor, dumbbell, pullupBar, stack, cableColumn, latBar, vHandle, rowFootplate, bench, seat, backPad, kneePad, legPress45, chestPress, barbell, rackUpright, cable, pulley, box, line` (`PRIMITIVES` in equipment.mjs; probe-eq confirms 20).
- The 7 approved engine specs use 19 of them. `dumbbell` is used by no approved spec (lateral raise is drawn by the reference module `ref-src`); it is exercised by `_test_front.mjs` (front view) and a draft engine lateral raise that is not approved, and HT-1 locks `_test_front` and `_test_side` as reference fixtures. **28 of the 145 new exercises depend on the dumbbell primitive** (section 4.1), so its first real plate is a fidelity checkpoint.
- Sizes are real-world defaults (SPEC 5): bench 1.2 m x 29 cm, top 0.42 to 0.45 m; barbell 20 kg 2.2 m, 450 mm plates (side view draws the near plate as an outline over the figure); cable column 2.1 m; rack 76 mm tube with a J-hook and no safety arms.
- `bench` is flat only (no angle parameter): an incline or decline bench is composed. `legPress45` takes `rail.angle` (probe: angle 0 draws a horizontal leg press, plate normal (0,0,-1)) but has no front-view drawing. `latBar` with `drop: 0` draws one straight bar. `chestPress` is a side-view lever primitive; its front-view use is not verified. SPEC 8: bars with angled sleeves, EZ bars, ropes and machines not listed need `box`/`line` parts or a new primitive.

### 2.2 Body model

- Pose schema: `root {at, tilt}` (pelvis pitch, any angle), `trunk`, `neck`, `scap {elev, pro}`, `shoulder {elev, plane, rot}` (or flex/ext/abd), `elbow`, `wrist`, `hip {flex, abd, rot}`, `knee`, `ankle`, `reach` (hand IK), `plant` (foot IK, per side). Everything is per-side capable, so single-arm and single-leg poses are expressible.
- Fixed: the figure always faces +z; two cameras only (front, side left or right); one set of limb radii; a fist circle instead of a hand; no foot inversion; no whole-body yaw or lateral trunk lean (SPEC 8); `normPose` has no roll or yaw field (probe I). Front view of a forward-flexed trunk is a foreshortened frontal outline.
- `rootOnSeat` puts the `seat` landmark on a surface. Lying flat, the back and buttock contour sit about 8 to 10 cm below `seat` (probe A: `seat` y 0.43, `backUpper` y 0.35), so lying poses must place a back landmark with `landmarksOf` and verify with `checks {plane}`, not use `rootOnSeat`. Kneeling has no knee-on-floor IK either (probe G): use angles plus a `checks` plane.
- Plate chrome: the sheet always shows the Trace and Mistake pills and (in Mistake) up to 3 tells; up to 3 callouts of 1 to 3 words with one-sentence cues; a tempo strip. In the engine, `trace`, `measure`, `mistake` and `tempo` are optional; with the locked golden chrome a plate needs all of them (plan 2.7 F3). Plate is 358 px square.

### 2.3 Pose probes (probe-poses.mjs, main engine, H 1.75 m)

| Probe | Pose | Result |
|---|---|---|
| A | supine on a flat bench, bar over the shoulders | tilt -90; hands 0 cm, feet 0.5 cm; renders with bench + barbell (33 KB svg), no issues |
| B | incline, tilt -45, hands on a bar | hands 0 cm |
| C | prone, tilt +90, knee 60 | resolves by angles; no contact solve; not rendered |
| D | push-up plank, hands and toes on the floor | hands 0 cm, toes 0.6 to 2.4 cm (untuned); renders (60 KB svg); figure visible in probe.png |
| E | standing overhead press, bar at 2.02 m | hands 0 cm, shoulder elevation 156 deg; renders in front view |
| F | single-leg RDL: one plant, free leg back, tilt 70 | foot 0.1 cm; renders |
| G | kneeling upright, knee 90 | angles only; no knee contact solve |
| H | quadruped, tilt 88, hip 90, knee 90 | hands 0 cm |
| I | side plank (roll) | not expressible: root has only at and tilt |
| J | split stance, rear foot on the ball | front foot 0.2 cm, rear 2.4 cm (untuned) |
| K | hip thrust top: tilt -12, feet planted | feet 0.5 cm |
| L | floor sit, torso leaned back | resolves; no contacts |
| M | decline, tilt -105 | angles only; not rendered |

Contact errors above 0.5 cm are flagged by the engine report (`contact:` issues); the probes are not tuned, so they only show the pose classes are within reach of the solver.

### 2.4 Which pose classes the approved plates prove

Standing (back squat side, lateral raise front), seated upright (lat pulldown, machine chest press, seated row), reclined (leg press pelvis tilt -60; lat pulldown mistake -28), hanging (pull-up, hanging leg raise), arms overhead (pull-up, lat pulldown), forward lean (back squat thorax 40 deg). Front view is proven only by the lateral raise (reference module) and the engine gallery; a seated front view (lat pulldown) exists only in the engine gallery, not in an approved plate.

### 2.5 Layer engines (golden B)

- **Hand** (`hand.mjs`): draws one hand closing round a round handle seen end-on, `view: 'radial'` only (`handGeometry` throws for any other view). 12 handle profiles: press-vertical, press-horizontal, machine-grip, bar-28, bar-32, round-bar, pulldown-bar, dumbbell, v-handle, d-handle, leg-press-handle, pad-handle. Load kinds push, pull, gravity, on-body. Thumb modes wrapped, wrapped-light, hook, loose, spread, over, beside. `hand-pairs.mjs` carries test pairs for push, pull and hang. Not modelled: a flat palm on the floor (palm-flat), a cupped thumb, rope, band, kettlebell or ball, dip bars, an ab-wheel handle, a front rack.
- **Feel map** (`feelmap.mjs`): paints the 21 muscle ids that have a region on the body map; `core`, `brachialis` and `rotator_cuff` are text-only (they come back in `textOnly`).
- **Copy lint** (`copy-lint.mjs`): 450 visible words per exercise, 3 handling mistakes, 4 feel rows, 5 setup steps, 3 risks, fixed limits per field; the owner safety line must match exactly.

## 3. Aggregates

### 3.1 By movement family (my grouping, 27 families)

| Value | Exercises |
|---|---|
| Curl (elbow flexion) and wrist curl | 13 |
| Conditioning and carries | 12 |
| Row | 10 |
| Lunge, split squat, single leg | 8 |
| Squat (free, Smith, bodyweight) | 8 |
| Vertical pull | 8 |
| Hip hinge | 7 |
| Horizontal press (machine, bench, cable) | 7 |
| Triceps extension | 7 |
| Rear delt and cuff | 6 |
| Anti-extension and static core | 5 |
| Chest fly | 5 |
| Overhead press | 5 |
| Traps (shrug, upright row) | 5 |
| Trunk flexion (crunch) | 5 |
| Calf raise | 4 |
| Glute and hip extension | 4 |
| Hip flexion and leg raise | 4 |
| Incline press | 4 |
| Knee machines (extension, curl) | 4 |
| Lateral and front raise | 4 |
| Leg press and squat machines | 4 |
| Push-up | 4 |
| Rotation and lateral core | 4 |
| Dip | 2 |
| Hip abduction and adduction | 2 |
| Pullover | 2 |

### 3.2 By equipment

Raw `equipment` strings: 35 distinct values. Exercises counted once per option (an exercise listed "Cable / Machine" counts under both):

| Equipment option | Exercises |
|---|---|
| Bodyweight | 39 |
| Dumbbell(s) | 29 |
| Machine | 29 |
| Cable | 27 |
| Barbell | 24 |
| Smith Machine | 5 |
| EZ Bar | 4 |
| Resistance Band | 3 |
| Kettlebell | 2 |
| Medicine Ball | 2 |
| Sled | 2 |
| Ab Wheel | 1 |
| Battle Ropes | 1 |
| Dip Station | 1 |
| Jump Rope | 1 |
| Landmine | 1 |
| Leg Press | 1 |
| Plate-Loaded | 1 |
| T-Bar | 1 |
| Trap Bar | 1 |
| Weight | 1 |

Raw string counts, top: Bodyweight 34, Cable 22, Machine 21, Dumbbells 16, Barbell 14, Smith Machine 5, Dumbbell 4, Dumbbells / Barbell 4; the other 27 values have 1 to 4 each (full list in `census.json` `aggregates.byRawEquipment`).

### 3.3 By hand archetype (GA appendix B)

| Value | Exercises |
|---|---|
| hold | 28 |
| push | 26 |
| none | 22 |
| pull | 19 |
| balance | 18 |
| curl | 13 |
| palm-flat | 10 |
| on-body | 7 |
| hang | 5 |
| implement | 5 |

### 3.4 By primary contact archetype (derived, see section 1)

| Value | Exercises |
|---|---|
| standing-feet | 75 |
| floor-body | 22 |
| seat-back | 20 |
| bench-lying | 13 |
| brace-pad | 7 |
| foot-platform | 6 |
| hang-support | 6 |
| pivot-pad | 4 |

### 3.5 Closeness to the approved 8

| Closest approved | P | F | E | N | Total |
|---|---|---|---|---|---|
| LR | 0 | 7 | 1 | 16 | 24 |
| SQ | 0 | 14 | 1 | 17 | 32 |
| PU | 1 | 1 | 0 | 1 | 3 |
| HLR | 1 | 4 | 0 | 14 | 19 |
| LPD | 2 | 3 | 0 | 9 | 14 |
| SCR | 0 | 6 | 3 | 3 | 12 |
| LP | 0 | 2 | 2 | 10 | 14 |
| MCP | 0 | 8 | 2 | 17 | 27 |
| **all 145** | 4 | 45 | 9 | 87 | 145 |

By the data's own `pattern` field, 40 of the 145 share a pattern with an approved exercise (shoulder_abduction, squat, vertical_pull, hip_flexion, horizontal_pull, horizontal_push) and 105 sit in one of 27 other patterns with no approved plate. Pattern-sharing is not the same as plate reuse: push-ups share `horizontal_push` with the chest press but need a new body position (class N).

### 3.6 Readiness and tier (145 new)

| Readiness | Exercises |
|---|---|
| R2 existing parts, pose to prove | 51 |
| R1 existing parts, proven pose | 41 |
| R3 compose from existing parts | 30 |
| R4 new equipment drawing | 20 |
| R5 engine cannot draw (yaw/roll) | 3 |

| Tier | Exercises (all 153) |
|---|---|
| 1 | 115 |
| 2 | 26 |
| 3 | 12 |

| Class by readiness (145) | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| P | 4 | 0 | 0 | 0 | 0 |
| F | 13 | 22 | 10 | 0 | 0 |
| E | 0 | 0 | 0 | 9 | 0 |
| N | 24 | 29 | 20 | 11 | 3 |

View: 130 side, 23 front (recommended; frontal-plane movements are drawn in front view).

## 4. What the engine lacks, and for how many exercises

### 4.1 Equipment (145 new exercises; an exercise counts once per item)

| Item | Status | Exercises | Route | Which |
|---|---|---|---|---|
| Smith machine (`smith`) | missing | 5 | new primitive (recommended: 2 or more users) | smith_machine_bench_press, smith_machine_incline_press, smith_machine_shoulder_press, smith_machine_shrug, smith_machine_squat |
| cable rope attachment (`rope`) | missing | 3 | new primitive (recommended: 2 or more users) | rope_triceps_pushdown, overhead_cable_triceps_extension, sled_pull |
| cable rope attachment (standard for this lift; the data only says Cable) (`ropeLikely`) | missing | 2 | new primitive (recommended: 2 or more users) | face_pull, cable_crunch |
| landmine / T-bar (angled bar on a floor pivot) (`landmine`) | missing | 2 | new primitive (recommended: 2 or more users) | t_bar_row, landmine_row |
| sled (`sled`) | missing | 2 | new primitive (recommended: 2 or more users) | sled_push, sled_pull |
| dip bars on a frame (`dipBars`) | missing | 1 | new primitive or box/line composition (single user) | weighted_dip |
| Roman chair / 45 deg back extension bench (`romanChair`) | missing | 1 | new primitive or box/line composition (single user) | back_extension |
| hack squat sled (`hackSled`) | missing | 1 | new primitive or box/line composition (single user) | hack_squat |
| pendulum squat arm (`pendulum`) | missing | 1 | new primitive or box/line composition (single user) | pendulum_squat |
| jump rope (`jumpRope`) | missing | 1 | new primitive or box/line composition (single user) | jump_rope |
| kettlebell (`kettlebell`) | missing | 1 | new primitive or box/line composition (single user) | kettlebell_swing |
| battle ropes (`battleRope`) | missing | 1 | new primitive or box/line composition (single user) | battle_ropes |
| adjustable bench (incline or upright) (`inclineBench`) | compose | 7 | compose from existing parts | incline_dumbbell_press, incline_barbell_bench_press, smith_machine_incline_press, dumbbell_shoulder_press, smith_machine_shoulder_press, arnold_press, incline_dumbbell_curl |
| leg curl machine (seated, lying, standing) (`legCurlMachine`) | compose | 3 | compose from existing parts | seated_leg_curl, lying_leg_curl, standing_leg_curl |
| pec deck (fly / reverse fly) (`pecDeck`) | compose | 2 | compose from existing parts | pec_fly, rear_delt_fly |
| ankle cuff (`ankleCuff`) | compose | 2 | compose from existing parts | cable_kickback, resisted_hip_flexion |
| hip abduction / adduction machine (`hipAbdAddMachine`) | compose | 2 | compose from existing parts | hip_abduction, hip_adduction |
| calf raise machine (seated / standing) (`calfMachine`) | compose | 2 | compose from existing parts | seated_calf_raise, standing_calf_raise |
| medicine ball (`medBall`) | compose | 2 | compose from existing parts | medicine_ball_slam, wall_ball |
| wall (`wall`) | compose | 2 | compose from existing parts | wall_ball, wall_sit |
| resistance band (`band`) | compose | 2 | compose from existing parts | resistance_band_row, resistance_band_pull_apart |
| decline bench + ankle hooks (`declineBench`) | compose | 1 | compose from existing parts | decline_bench_press |
| lateral raise machine (`latRaiseMachine`) | compose | 1 | compose from existing parts | machine_lateral_raise |
| assisted pull-up machine (`assistMachine`) | compose | 1 | compose from existing parts | assisted_pull_up |
| chest-supported row machine (`chestRowMachine`) | compose | 1 | compose from existing parts | chest_supported_row |
| pullover machine (`pulloverMachine`) | compose | 1 | compose from existing parts | machine_pullover |
| preacher arm pad (`preacherPad`) | compose | 1 | compose from existing parts | preacher_curl |
| leg extension machine (`legExtMachine`) | compose | 1 | compose from existing parts | leg_extension |
| crunch machine (`crunchMachine`) | compose | 1 | compose from existing parts | machine_crunch |
| ab wheel (`abWheel`) | compose | 1 | compose from existing parts | ab_wheel_rollout |
| optional weight (medicine ball) (`medBallOptional`) | compose | 1 | compose from existing parts | russian_twist |
| single cable handle (`singleHandle`) | exists-param | 11 | reuse existing primitive with a parameter | cable_chest_press, cable_fly, low_to_high_cable_fly, high_to_low_cable_fly, cable_lateral_raise, cable_rear_delt_fly, cable_external_rotation, single_arm_triceps_pushdown, single_arm_lat_pulldown, bayesian_cable_curl, pallof_press |
| straight bar (`straightBar`) | exists-param | 5 | reuse existing primitive with a parameter | triceps_pushdown, straight_bar_triceps_pushdown, straight_arm_pulldown, cable_shrug, cable_curl |
| EZ bar (`ezBar`) | exists-param | 4 | reuse existing primitive with a parameter | skull_crusher, ez_bar_curl, preacher_curl, reverse_curl |
| horizontal leg press (`legPressFlat`) | exists-param | 1 | reuse existing primitive with a parameter | horizontal_leg_press |

Rope items: `rope` (3: rope pushdown, overhead cable extension, sled pull) plus `ropeLikely` (2: face pull and cable crunch, where the data only says Cable) = 5 exercises need a rope drawing; the architecture (GA 3.1.1) already flags the rope hand rule. Engine facts per item are in `census.json` `meta.needs`.

Existing primitives the new exercises lean on most: floor 145, dumbbell 28, cable 24, seat 17, flatBench 15, barbell 15, backPad 13, kneePad 8, rack 6, pivotArm 6.

### 4.2 Poses

| Pose tag | Status | Exercises (all 153) |
|---|---|---|
| stand | P | 53 |
| seat | P | 24 |
| hinge | S | 17 |
| supine | S | 15 |
| overhead | P | 13 |
| plank | S | 9 |
| split | S | 9 |
| single | S | 6 |
| airborne | M | 5 |
| hang | P | 5 |
| recline | P | 5 |
| incline | S | 4 |
| support | M | 4 |
| kneel | S | 3 |
| lean | P | 3 |
| bridge | S | 2 |
| floorsit | S | 2 |
| prone | S | 2 |
| quad | S | 2 |
| yaw | X | 2 |
| decline | S | 1 |
| roll | X | 1 |
| wall | M | 1 |

Motion flags (not poses): cyclic 4, walk 4, multi 1.
Exercises whose worst pose is P: 76 (8 approved + 68); S: 64; M: 10; X: 3.

**Not expressible (X):** roll and yaw. Needed as the movement by side plank (roll), Russian twist and bicycle crunch (yaw). **Faults that need roll or yaw** and so cannot be shown in the Mistake view: one-arm dumbbell row (torso rotation), renegade row (hip rotation), single-arm lat pulldown (sideways lean), Pallof press (rotation), bird dog (hip rotation), single-leg RDL (hip opening). Those keep a Technical Plate but need a different mistake.

### 4.3 View constraints

- Only two views exist. Movements in the horizontal or frontal plane while lying (dumbbell fly) are ambiguous: side view hides the width, front view is end-on to a lying body. Bent-over rear-delt fly has the same conflict (flexed trunk in front view is foreshortened, SPEC 8).
- `legPress45` has no front-view drawing, so nothing in that family can be drawn from the front. Seated front view exists only in the engine gallery; 5 exercises (pec fly, rear-delt fly, machine lateral raise, hip abduction, hip adduction) depend on it and on front-view arms of the pivot primitive, which is unverified.

### 4.4 Layers

- **Hand close-ups not yet drawn:** palm-flat 10, curl 13, implement 5 = 28 exercises with an archetype golden B never drew. Of the drawn archetypes, hand cases the renderer cannot yet draw (my reading of `hand.mjs`): rope (5 exercises above), band (resistance band row and pull-apart; also resisted hip flexion if the band is chosen), a cupped hold (dumbbell overhead triceps extension, goblet squat), front rack (front squat), ab-wheel handle, and every implement.
- **Feel map, no paintable primary muscle (6):** cable_external_rotation, plank, mountain_climbers, medicine_ball_slam, bear_crawl, bird_dog. Their primaries are only `core` or `rotator_cuff`, which are text-only. A card decision is needed (name a painted muscle such as abs or obliques as the main region, or ship text-only). Also 6 exercises have one text-only primary beside a paintable one: hammer_curl, cross_body_hammer_curl, reverse_curl, ab_wheel_rollout, pallof_press, dead_bug.
- **Scale:** the plan measured 250 to 420 KB gzip for the first 8 (2.9), so about 31 to 52 KB per exercise; at that rate 153 exercises would be about 4.8 to 8.0 MB gzip before HT-11 delta encoding (target at least 35 % smaller per base chunk; the plan requires it before about 40 plates). Arithmetic only, not measured. The gate matrix is 8 exercises x 5 themes x {normal, mistake} = 80 base pairs today; 153 would be 1,530 base pairs before the callout and width variants, against a 40-minute job timeout (plan R14).
- **Gate control:** `lib_barbell_bench_press` is the gate negative control (plan A5, R17); the first presses batch must switch it deliberately in the same PR.

## 5. Natural batches (one template each)

| Batch | Title | Template to clone | Count | Closeness | Readiness | Equipment gaps | Poses not proven |
|---|---|---|---|---|---|---|---|
| B01 | Bar hang and body pull | pull_up.mjs | 4 | F2 P2 | R1:2 R2:1 R3:1 | assistMachine | kneel, supine |
| B02 | Cable pulldown variants | lat_pulldown.mjs | 4 | F2 P2 | R1:3 R2:1 | - | hinge |
| B03 | Supported and band rows | seated_cable_row.mjs | 2 | F2 | R3:2 | band, chestRowMachine | floorsit |
| B04 | Hinged free-weight rows | new hinge template (barbell_back_squat.mjs for the bar) | 5 | E2 F3 | R2:3 R4:2 | landmine | hinge, support |
| B05 | Seated lever machines, side view | machine_chest_press.mjs | 4 | F2 N2 | R1:2 R3:2 | crunchMachine, pulloverMachine | - |
| B06 | Seated machines, front view | new front-view seated template (lat pulldown gallery probe) | 5 | F1 N4 | R3:5 | hipAbdAddMachine, latRaiseMachine, pecDeck | - |
| B07 | Bench press family (free weight) | machine_chest_press.mjs + bench + rack | 6 | F6 | R2:3 R3:3 | declineBench, inclineBench | decline, incline, supine |
| B08 | Smith machine | one new Smith drawing | 5 | E4 N1 | R4:5 | inclineBench, smith | incline, supine |
| B09 | Overhead press (free weight) | standing or seated overhead template | 3 | N3 | R1:1 R3:2 | inclineBench | - |
| B10 | Push-up and plank support | new plank template | 5 | N5 | R2:5 | - | plank |
| B11 | Dips | dip bars (new) | 2 | N2 | R2:1 R4:1 | dipBars | support |
| B12 | Standing cable press and fly | cable + front view (lateral raise view) | 4 | F1 N3 | R1:3 R2:1 | - | split |
| B13 | Lying arm work | bench + dumbbell/EZ bar | 3 | N3 | R2:3 | - | supine |
| B14 | Raises, rear delts, cuff, face pull | dumbbell_lateral_raise (ref-src) + cable | 7 | E1 F2 N4 | R1:4 R2:1 R3:1 R4:1 | band, ropeLikely | hinge |
| B15 | Shrugs and upright row | standing hold + scap.elev | 4 | F4 | R1:4 | - | - |
| B16 | Triceps at the cable and overhead | lat_pulldown.mjs cable set | 6 | N6 | R1:4 R4:2 | rope | - |
| B17 | Standing curls | one curl template (dumbbell, bar, cable) | 9 | N9 | R1:8 R2:1 | - | split |
| B18 | Supported curls and wrist curl | bench / pad + dumbbell | 4 | N4 | R1:2 R3:2 | inclineBench, preacherPad | incline |
| B19 | Free squat family | barbell_back_squat.mjs | 6 | F6 | R1:3 R2:2 R3:1 | wall | airborne, wall |
| B20 | Leg press and sled machines | leg_press.mjs | 4 | E2 F2 | R1:2 R4:2 | hackSled, pendulum | - |
| B21 | Lunge and split squat | new split-stance template | 8 | F8 | R2:8 | - | single, split |
| B22 | Hip hinge | new hinge template | 7 | N7 | R2:5 R4:2 | kettlebell, romanChair | hinge, single, support |
| B23 | Glute and hip | new bridge template | 4 | F1 N3 | R2:2 R3:2 | ankleCuff | bridge, hinge, single |
| B24 | Knee pad machines | leg_press.mjs seat + pad set | 4 | N4 | R3:4 | legCurlMachine, legExtMachine | prone, single |
| B25 | Calf raise | box + machine | 3 | N3 | R1:1 R3:2 | calfMachine | - |
| B26 | Floor core | new floor-lying template | 11 | F3 N8 | R2:9 R3:1 R4:1 | abWheel, ropeLikely | kneel, plank, prone, quad, supine |
| B27 | Rotation and lateral core | blocked by yaw/roll | 4 | N4 | R1:1 R5:3 | medBallOptional | floorsit, roll, supine, yaw |
| B28 | Conditioning and carries | custom (no template) | 12 | N12 | R1:1 R2:5 R3:2 R4:4 | battleRope, jumpRope, medBall, rope, sled, wall | airborne, hinge, plank, quad |

Members are in section 8 (`batch` column) and `census.json` `aggregates.batches`.

**Cross-batch unlocks** (one drawing serves several batches): Smith machine serves B08 (5). Incline bench serves B07, B08, B09, B18 (7). Rope serves B16, B14, B26, B28 (5). Landmine serves B04 (2). Pec deck serves B06 (2). Ankle cuff serves B23 (2). Medicine ball serves B28 (2). Leg curl machine serves B24 (3).

**Cheapest first:** the 4 P exercises, then R1 (41 exercises, no new capability), then the R2 batches once one supine, one plank, one hinge and one split plate have proven each pose class against the approved bar. This is an observation from the counts, not a schedule.

## 6. Custom and unusual cases

- **Bodyweight only (34):** no equipment to draw, so the plate is the body alone. Five more list bodyweight as one option: back_extension, step_up, single_leg_romanian_deadlift, glute_bridge, russian_twist.
- **Conditioning pattern (11) and the carry:** sled_push, sled_pull, burpee, mountain_climbers, jumping_jacks, high_knees, jump_rope, battle_ropes, medicine_ball_slam, wall_ball, bear_crawl; carry: farmer_s_carry.
- **Stretches and mobility: none.** No exercise in the library is a stretch, mobility or warm-up drill (the 153 patterns are strength, core and conditioning), so the Technical Plate concept never has to teach a held stretch.
- **Isometric holds (start = end):** plank, side_plank, wall_sit, hollow_body_hold, pallof_press. Two dynamic-hold cases: bird_dog, dead_bug. The locked chrome shows a Trace pill that would trace nothing.
- **Needs roll or yaw (engine cannot draw): side_plank, russian_twist, bicycle_crunch.**
- **Cyclic or travelling (9):** sled_push, sled_pull, farmer_s_carry, burpee, mountain_climbers, high_knees, jump_rope, battle_ropes, bear_crawl. A still plate shows one frame of the action.
- **Airborne (5):** jumping_jacks, high_knees, jump_rope, box_jump, jump_squat. `root.at` is free so the pose is expressible; the plate teaches the takeoff or landing only.
- **Tier 3, plate may not fit (12):** side_plank, russian_twist, sled_push, sled_pull, farmer_s_carry, burpee, mountain_climbers, high_knees, jump_rope, battle_ropes, bear_crawl, bicycle_crunch. Owner decision: skip the plate (Level 1 How-to without a plate is plan item O8, not built), or a different plate concept (for example a stance plate for the carries and sled work).
- **Tier 2, fits after a decision (26):** decline_bench_press, dumbbell_fly, weighted_dip, bent_over_dumbbell_rear_delt_fly, cable_external_rotation, single_arm_lat_pulldown, one_arm_dumbbell_row, dumbbell_shrug, barbell_shrug, smith_machine_shrug, cable_shrug, wrist_curl, walking_lunge, plank, pallof_press, jumping_jacks, kettlebell_swing, box_jump, medicine_ball_slam, wall_ball, renegade_row, jump_squat, wall_sit, flutter_kicks, hollow_body_hold, bird_dog.
- **Very small motion:** shrugs (3 to 5 cm) and wrist curl (about 13 px of fist travel at 146.29 px/m) need a zoomed camera (`camera.maxScale`) or the close-up to carry the teaching.

## 7. Facts the design can rely on

- 8 of 153 have the How-to today (`HOWTO_IDS` in `ids.ts`); `hasHowTo` gates the button. Approved plates are locked by `GOLDEN.json` hashes; one plate is drawn by `ref-src` (lateral raise), 7 by engine specs (`plates.json`).
- The approved specs average about 145 lines of tuned geometry per plate (7 specs, 1,017 lines) and about 355 lines of layer spec per exercise (8 files, 2,838 lines); every plate was iterated against contacts, checks, cited angles and label placement (SPEC 7). Nothing here shortens that loop; the census only sizes the work.
- **The engine is byte-locked.** `tools/plates/vendor/MANIFEST.json` pins by sha256 `engine/equipment.mjs`, `body.mjs`, `plate.mjs`, `layout.mjs`, `sheet.mjs`, `index.mjs` and the 7 plate specs; `plate.mjs` imports `PRIMITIVES` from `equipment.mjs`. So every new primitive (section 4.1) and any pose capability (roll, yaw) is an edit to a locked file: a `[golden update]` PR under plan 2.8 that must leave all 8 approved fragments byte-identical (L2), or an additive module wired at build time. That is an architecture choice, not a census finding.
- Research cards exist for the approved 8 only (`grip/research/`); 145 more cards are needed for the layers. GA 3.1 lists archetypes with no verified source yet (palm-flat, curl, implement, and per-card items), so those cards must supply sources first.

## 8. Per-exercise census (153 rows)

Legend: closeness P/F/E/N/A (A = approved) against LR SQ PU HLR LPD SCR LP MCP; poses show status in brackets; needs in **bold** are `missing`, plain gaps are `compose`, `exists-param` items are marked with a star; tier 1/2/3; batch from section 5. Hand/contact: hand archetype / primary contact (secondary in brackets).

| # | id | equipment | pattern | primary | hand / contact | closest (class) | view | poses | needs gaps | tier | batch | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | machine_chest_press | Machine | horizontal_push | chest | push / seat-back | A | side | recline(P) | - | 1 | B00 | Approved plate (golden A). |
| 2 | dumbbell_bench_press | Dumbbells | horizontal_push | chest | push / bench-lying | MCP (F) | side | supine(S) | - | 1 | B07 | Pose class supine is new (probe A). Dumbbell kick-up is a GA handling zoom. |
| 3 | barbell_bench_press | Barbell | horizontal_push | chest | push / bench-lying | MCP (F) | side | supine(S) | - | 1 | B07 | Gate negative control today (plan A5/R17): must be switched on purpose in the PR that ships the first press. |
| 4 | smith_machine_bench_press | Smith Machine | horizontal_push | chest | push / bench-lying | MCP (E) | side | supine(S) | **smith** | 1 | B08 | Needs the Smith machine drawing. |
| 5 | incline_machine_press | Machine | incline_push | upper_chest | push / seat-back | MCP (F) | side | recline(P) | - | 1 | B05 | Same lever primitive as the approved chest press, inclined arm path. |
| 6 | incline_dumbbell_press | Dumbbells | incline_push | upper_chest | push / bench-lying | MCP (F) | side | incline(S) | inclineBench | 1 | B07 | Incline bench composed from seat plus backPad(angle). |
| 7 | incline_barbell_bench_press | Barbell | incline_push | upper_chest | push / bench-lying | MCP (F) | side | incline(S) | inclineBench | 1 | B07 | Incline bench composed; rack J-hook exists. |
| 8 | smith_machine_incline_press | Smith Machine | incline_push | upper_chest | push / bench-lying | MCP (E) | side | incline(S) | **smith**, inclineBench | 1 | B08 | Needs the Smith machine drawing. |
| 9 | decline_bench_press | Barbell | horizontal_push | chest | push / bench-lying | MCP (F) | side | decline(S) | declineBench | 2 | B07 | Torso beyond -90 pitch solved without drawing (probe M). Ankle hooks and decline pad composed. |
| 10 | cable_chest_press | Cable | horizontal_push | chest | push / seat-back | MCP (F) | side | stand(P),split(S) | singleHandle* | 1 | B12 | Two-column crossover in life; one column shows in side view. |
| 11 | pec_fly | Machine | chest_adduction | chest | hold / seat-back | MCP (N) | front | seat(P) | pecDeck | 1 | B06 | Arms sweep in the horizontal plane: front view only; pec-deck arms composed (front view of the pivot-arm primitive is not verified). |
| 12 | cable_fly | Cable | chest_adduction | chest | hold / standing-feet | MCP (N) | front | stand(P) | singleHandle* | 1 | B12 | Two columns at plus/minus x, front view. |
| 13 | low_to_high_cable_fly | Cable | chest_adduction | upper_chest | hold / standing-feet | MCP (N) | front | stand(P) | singleHandle* | 1 | B12 | Diagonal cable path. |
| 14 | high_to_low_cable_fly | Cable | chest_adduction | chest | hold / standing-feet | MCP (N) | front | stand(P) | singleHandle* | 1 | B12 | Diagonal cable path. |
| 15 | dumbbell_fly | Dumbbells | chest_adduction | chest | hold / bench-lying | MCP (N) | front | supine(S) | - | 2 | B13 | View conflict: lying, the arc is in the frontal plane. Side view hides the width, front view is end-on to the body. |
| 16 | push_up | Bodyweight | horizontal_push | chest | palm-flat / floor-body | MCP (N) | side | plank(S) | - | 1 | B10 | Plank support: solved and rendered in the probe, untuned. |
| 17 | incline_push_up | Bodyweight | horizontal_push | chest | palm-flat / floor-body | MCP (N) | side | plank(S) | - | 1 | B10 | Hands on a bench (bench primitive). |
| 18 | weighted_dip | Dip Station | vertical_push | chest, triceps | push / hang-support | PU (N) | side | support(M) | **dipBars** | 2 | B11 | Dip bars missing (parallel bars on a frame); belt and plate not drawn either. |
| 19 | shoulder_press | Machine | vertical_push | front_delts, side_delts | push / seat-back | MCP (N) | side | seat(P),overhead(P) | - | 1 | B05 | Machine press with an overhead arm path; same lever primitive. |
| 20 | dumbbell_shoulder_press | Dumbbells | vertical_push | front_delts, side_delts | push / seat-back | MCP (N) | side | seat(P),overhead(P) | inclineBench | 1 | B09 | Upright adjustable bench composed. |
| 21 | barbell_overhead_press | Barbell | vertical_push | front_delts, side_delts | push / standing-feet | SQ (N) | side | stand(P),overhead(P) | - | 1 | B09 | Standing, bar over the head (probe E). |
| 22 | smith_machine_shoulder_press | Smith Machine | vertical_push | front_delts, side_delts | push / seat-back | MCP (N) | side | seat(P),overhead(P) | **smith**, inclineBench | 1 | B08 | Needs the Smith machine drawing. |
| 23 | arnold_press | Dumbbells | vertical_push | front_delts, side_delts | push / seat-back | MCP (N) | side | seat(P),overhead(P) | inclineBench | 1 | B09 | Palm rotation (shoulder rot) is small in the plate; the hand close-up shows it. |
| 24 | dumbbell_lateral_raise | Dumbbells | shoulder_abduction | side_delts | hold / standing-feet | A | front | stand(P) | - | 1 | B00 | Approved plate, drawn by the reference module (ref-src), not by an engine spec. The newer engine spec in plates2 is not approved (plan R2). |
| 25 | cable_lateral_raise | Cable | shoulder_abduction | side_delts | hold / standing-feet | LR (F) | front | stand(P) | singleHandle* | 1 | B14 | Same view and pose, low cable and one arm. |
| 26 | machine_lateral_raise | Machine | shoulder_abduction | side_delts | balance / seat-back | LR (F) | front | seat(P) | latRaiseMachine | 1 | B06 | Lever machine composed; front view of the pivot arm primitive is not verified. |
| 27 | dumbbell_front_raise | Dumbbells | shoulder_flexion | front_delts | hold / standing-feet | LR (F) | side | stand(P) | - | 1 | B14 | Flexion instead of abduction: side view. |
| 28 | rear_delt_fly | Machine | horizontal_abduction | rear_delts | pull / seat-back | LR (N) | front | seat(P) | pecDeck | 1 | B06 | Pec deck facing the pad, composed. |
| 29 | cable_rear_delt_fly | Cable | horizontal_abduction | rear_delts | hold / standing-feet | LR (N) | front | stand(P) | singleHandle* | 1 | B14 | Crossed cables. |
| 30 | bent_over_dumbbell_rear_delt_fly | Dumbbells | horizontal_abduction | rear_delts | hold / standing-feet | LR (N) | front | hinge(S) | - | 2 | B14 | View conflict: hinged trunk is a foreshortened outline in front view (SPEC 8); side view hides the arm sweep. |
| 31 | face_pull | Cable | horizontal_pull | rear_delts | pull / standing-feet | SCR (E) | side | stand(P) | **ropeLikely** | 1 | B14 | Same pull pattern as the seated row; the rope attachment is missing (standard for a face pull, the data only says Cable). |
| 32 | cable_external_rotation | Cable | shoulder_external_rotation | rotator_cuff | pull / standing-feet | LR (N) | front | stand(P) | singleHandle* | 2 | B14 | Forearm sweep about the arm axis; small range at plate scale. |
| 33 | upright_row | Cable / Barbell | vertical_pull | side_delts, upper_traps | pull / standing-feet | LR (F) | front | stand(P) | - | 1 | B15 | Cable or barbell (data says both); barbell drawn. Elbows-lead cue as in the approved lateral raise. |
| 34 | triceps_pushdown | Cable | elbow_extension | triceps | push / standing-feet | LPD (N) | side | stand(P) | straightBar* | 1 | B16 | Cable, high pulley and bar are reusable from the lat pulldown; the movement is new. |
| 35 | rope_triceps_pushdown | Cable | elbow_extension | triceps | push / standing-feet | LPD (N) | side | stand(P) | **rope** | 1 | B16 | Rope attachment missing. |
| 36 | straight_bar_triceps_pushdown | Cable | elbow_extension | triceps | push / standing-feet | LPD (N) | side | stand(P) | straightBar* | 1 | B16 | Near-identical to triceps_pushdown: one template. |
| 37 | single_arm_triceps_pushdown | Cable | elbow_extension | triceps | push / standing-feet | LPD (N) | side | stand(P) | singleHandle* | 1 | B16 | One handle. |
| 38 | overhead_cable_triceps_extension | Cable | elbow_extension | triceps | push / standing-feet | LPD (N) | side | stand(P),overhead(P) | **rope** | 1 | B16 | Rope per the architecture (3.1.1); arm overhead, elbow behind the head. |
| 39 | dumbbell_overhead_triceps_extension | Dumbbell | elbow_extension | triceps | push / standing-feet | LR (N) | side | stand(P),overhead(P) | - | 1 | B16 | One dumbbell held vertically in two hands (dumbbell axis parameter). |
| 40 | skull_crusher | EZ Bar / Barbell | elbow_extension | triceps | push / bench-lying | MCP (N) | side | supine(S) | ezBar* | 1 | B13 | EZ bar seen end-on in side view is the barbell drawing; zig-zag needs a front view. |
| 41 | close_grip_bench_press | Barbell | horizontal_push | triceps | push / bench-lying | MCP (F) | side | supine(S) | - | 1 | B07 | Same plate as the barbell bench press with a narrower hand offset. |
| 42 | bench_dip | Bodyweight | vertical_push | triceps | palm-flat / bench-lying | MCP (N) | side | support(M) | - | 1 | B11 | Hands on the bench behind the body. |
| 43 | lat_pulldown | Cable / Machine | vertical_pull | lats | pull / seat-back [brace-pad] | A | side | seat(P),overhead(P) | - | 1 | B00 | Approved plate. |
| 44 | close_grip_pulldown | Cable / Machine | vertical_pull | lats | pull / seat-back [brace-pad] | LPD (P) | side | seat(P),overhead(P) | - | 1 | B02 | Same plate: handle and hand offset parameters. |
| 45 | underhand_lat_pulldown | Cable / Machine | vertical_pull | lats | pull / seat-back [brace-pad] | LPD (P) | side | seat(P),overhead(P) | - | 1 | B02 | Same plate: underhand grip is a hand parameter. |
| 46 | single_arm_lat_pulldown | Cable | vertical_pull | lats | pull / seat-back [brace-pad] | LPD (F) | side | seat(P),overhead(P) | singleHandle* | 2 | B02 | The defining fault is a sideways lean: no roll in the pose model. |
| 47 | pull_up | Bodyweight | vertical_pull | lats | hang / hang-support | A | side | hang(P) | - | 1 | B00 | Approved plate. |
| 48 | chin_up | Bodyweight | vertical_pull | lats, biceps | hang / hang-support | PU (P) | side | hang(P) | - | 1 | B01 | Same plate: underhand grip, elbows closer. |
| 49 | assisted_pull_up | Machine | vertical_pull | lats | hang / brace-pad | PU (F) | side | hang(P),kneel(S) | assistMachine | 1 | B01 | Assist platform composed (knee pad on a moving platform plus handles). |
| 50 | chest_supported_row | Machine | horizontal_pull | mid_back | pull / brace-pad | SCR (F) | side | seat(P),lean(P) | chestRowMachine | 1 | B03 | Chest pad plus lever handles, composed. |
| 51 | seated_cable_row | Cable | horizontal_pull | mid_back | pull / foot-platform | A | side | seat(P) | - | 1 | B00 | Approved plate. |
| 52 | barbell_row | Barbell | horizontal_pull | mid_back | pull / standing-feet | SCR (F) | side | hinge(S) | - | 1 | B04 | Same row pattern, standing hinge (probe F). |
| 53 | pendlay_row | Barbell | horizontal_pull | mid_back | pull / standing-feet | SCR (F) | side | hinge(S) | - | 1 | B04 | Torso parallel, bar from the floor. |
| 54 | one_arm_dumbbell_row | Dumbbell | horizontal_pull | lats | pull / brace-pad | SCR (F) | side | hinge(S),support(M) | - | 2 | B04 | Hand and knee on the bench; torso rotation is the typical fault and cannot be drawn. |
| 55 | t_bar_row | T-Bar / Machine | horizontal_pull | mid_back | pull / brace-pad | SCR (E) | side | hinge(S) | **landmine** | 1 | B04 | Angled bar on a floor pivot (T-bar or landmine): missing. |
| 56 | landmine_row | Landmine | horizontal_pull | mid_back | pull / standing-feet | SCR (E) | side | hinge(S) | **landmine** | 1 | B04 | Angled bar on a floor pivot: missing. |
| 57 | straight_arm_pulldown | Cable | shoulder_extension | lats | hold / standing-feet | LPD (F) | side | stand(P),hinge(S) | straightBar* | 1 | B02 | Standing, small hinge, arms straight: new pose on the same cable set. |
| 58 | machine_pullover | Machine | shoulder_extension | lats | balance / seat-back | LPD (F) | side | seat(P) | pulloverMachine | 1 | B05 | Lever machine composed. |
| 59 | dumbbell_pullover | Dumbbell | shoulder_extension | lats, chest | hold / bench-lying | LPD (N) | side | supine(S) | - | 1 | B13 | Arms arc overhead while lying. |
| 60 | dumbbell_shrug | Dumbbells | scapular_elevation | upper_traps | hold / standing-feet | LR (F) | front | stand(P) | - | 2 | B15 | About 3 to 5 cm of scapula travel: tiny motion at plate scale (scap.elev is proven in approved mistakes). |
| 61 | barbell_shrug | Barbell | scapular_elevation | upper_traps | hold / standing-feet | LR (F) | side | stand(P) | - | 2 | B15 | Same small-motion issue. |
| 62 | smith_machine_shrug | Smith Machine | scapular_elevation | upper_traps | hold / standing-feet | LR (E) | side | stand(P) | **smith** | 2 | B08 | Smith drawing plus the small-motion issue. |
| 63 | cable_shrug | Cable | scapular_elevation | upper_traps | hold / standing-feet | LR (F) | side | stand(P) | straightBar* | 2 | B15 | Same small-motion issue. |
| 64 | back_extension | Bodyweight / Machine | hip_hinge | lower_back | none / brace-pad | SQ (N) | side | hinge(S),support(M) | **romanChair** | 1 | B22 | Roman chair or 45-degree bench missing. |
| 65 | dumbbell_biceps_curl | Dumbbells | elbow_flexion | biceps | curl / standing-feet | LR (N) | side | stand(P) | - | 1 | B17 | New movement (elbow flexion); dumbbell standing hold as in the lateral raise. |
| 66 | alternating_dumbbell_curl | Dumbbells | elbow_flexion | biceps | curl / standing-feet | LR (N) | side | stand(P) | - | 1 | B17 | One template with the dumbbell curl. |
| 67 | barbell_curl | Barbell | elbow_flexion | biceps | curl / standing-feet | SQ (N) | side | stand(P) | - | 1 | B17 | Barbell hangs at the thighs. |
| 68 | ez_bar_curl | EZ Bar | elbow_flexion | biceps | curl / standing-feet | SQ (N) | side | stand(P) | ezBar* | 1 | B17 | EZ bar end-on = barbell drawing in side view. |
| 69 | hammer_curl | Dumbbells | elbow_flexion | brachialis, biceps | curl / standing-feet | LR (N) | side | stand(P) | - | 1 | B17 | Neutral grip. |
| 70 | cross_body_hammer_curl | Dumbbells | elbow_flexion | brachialis, biceps | curl / standing-feet | LR (N) | front | stand(P) | - | 1 | B17 | Front view: the curl crosses the body. |
| 71 | cable_curl | Cable | elbow_flexion | biceps | curl / standing-feet | LPD (N) | side | stand(P) | straightBar* | 1 | B17 | Low pulley. |
| 72 | bayesian_cable_curl | Cable | elbow_flexion | biceps | curl / standing-feet | LPD (N) | side | stand(P),split(S) | singleHandle* | 1 | B17 | Arm behind the body, cable from behind. |
| 73 | preacher_curl | Machine / EZ Bar | elbow_flexion | biceps | curl / pivot-pad | MCP (N) | side | seat(P) | preacherPad, ezBar* | 1 | B18 | Angled arm pad composed. |
| 74 | incline_dumbbell_curl | Dumbbells | elbow_flexion | biceps | curl / standing-feet | LR (N) | side | incline(S) | inclineBench | 1 | B18 | Arms hang behind the torso. |
| 75 | concentration_curl | Dumbbell | elbow_flexion | biceps | curl / brace-pad | LR (N) | side | seat(P) | - | 1 | B18 | Elbow braced on the inner thigh. |
| 76 | reverse_curl | EZ Bar / Barbell | elbow_flexion | forearms, brachialis | curl / standing-feet | SQ (N) | side | stand(P) | ezBar* | 1 | B17 | Overhand grip; bar or EZ bar. |
| 77 | wrist_curl | Dumbbell / Barbell | wrist_flexion | forearms | curl / standing-feet | LR (N) | side | seat(P) | - | 2 | B18 | The moving joint is the wrist: about 13 px of fist travel at the reference scale. Needs a zoomed camera (maxScale) or the hand close-up. |
| 78 | leg_extension | Machine | knee_extension | quads | balance / seat-back [pivot-pad] | LP (N) | side | seat(P) | legExtMachine | 1 | B24 | Seat, back pad, shin roller, lever: composed. |
| 79 | seated_leg_curl | Machine | knee_flexion | hamstrings | balance / seat-back [pivot-pad] | LP (N) | side | seat(P) | legCurlMachine | 1 | B24 | Composed. |
| 80 | lying_leg_curl | Machine | knee_flexion | hamstrings | balance / pivot-pad | LP (N) | side | prone(S) | legCurlMachine | 1 | B24 | Prone solved by joint angles only (probe C, no contact solve). |
| 81 | standing_leg_curl | Machine | knee_flexion | hamstrings | balance / pivot-pad | LP (N) | side | stand(P),single(S) | legCurlMachine | 1 | B24 | One leg planted, one curling. |
| 82 | leg_press | Plate-Loaded / Machine | squat | quads, glutes | balance / foot-platform | A | side | recline(P) | - | 1 | B00 | Approved plate. |
| 83 | horizontal_leg_press | Machine | squat | quads, glutes | balance / foot-platform | LP (F) | side | seat(P) | legPressFlat* | 1 | B20 | legPress45 with rail.angle 0 draws (probe). |
| 84 | hack_squat | Machine | squat | quads | balance / foot-platform | LP (E) | side | recline(P) | **hackSled** | 1 | B20 | Sled with shoulder pads on rails: missing. |
| 85 | pendulum_squat | Machine | squat | quads | balance / foot-platform | LP (E) | side | stand(P),lean(P) | **pendulum** | 1 | B20 | Swinging arm on a pivot: missing. |
| 86 | barbell_back_squat | Barbell | squat | quads | on-body / standing-feet | A | side | stand(P) | - | 1 | B00 | Approved plate. |
| 87 | front_squat | Barbell | squat | quads | on-body / standing-feet | SQ (F) | side | stand(P) | - | 1 | B19 | Front rack: high elbows and extended wrists (pose new). |
| 88 | goblet_squat | Dumbbell / Kettlebell | squat | quads | on-body / standing-feet | SQ (F) | side | stand(P) | - | 1 | B19 | Dumbbell held vertically at the chest; kettlebell is the data's alternative. |
| 89 | smith_machine_squat | Smith Machine | squat | quads | on-body / standing-feet | SQ (E) | side | stand(P) | **smith** | 1 | B08 | Needs the Smith machine drawing. |
| 90 | bulgarian_split_squat | Dumbbells / Barbell | single_leg_squat | quads, glutes | hold / standing-feet | SQ (F) | side | split(S) | - | 1 | B21 | Rear foot on a bench; split solved (probe J). |
| 91 | walking_lunge | Dumbbells / Barbell | lunge | quads, glutes | hold / standing-feet | SQ (F) | side | split(S) | - | 2 | B21 | Locomotion: the plate shows one step. Data lists dumbbells or barbell. |
| 92 | reverse_lunge | Dumbbells / Barbell | lunge | quads, glutes | hold / standing-feet | SQ (F) | side | split(S) | - | 1 | B21 | Step back. |
| 93 | forward_lunge | Dumbbells / Barbell | lunge | quads, glutes | hold / standing-feet | SQ (F) | side | split(S) | - | 1 | B21 | Step forward. |
| 94 | step_up | Dumbbells / Bodyweight | single_leg_squat | quads, glutes | hold / standing-feet | SQ (F) | side | split(S),single(S) | - | 1 | B21 | Box primitive. |
| 95 | romanian_deadlift | Barbell | hip_hinge | hamstrings | hold / standing-feet | SQ (N) | side | hinge(S) | - | 1 | B22 | Hinge is a new movement; barbell and pose are close to the squat plate. |
| 96 | dumbbell_romanian_deadlift | Dumbbells | hip_hinge | hamstrings | hold / standing-feet | SQ (N) | side | hinge(S) | - | 1 | B22 | Same template as the barbell RDL. |
| 97 | single_leg_romanian_deadlift | Dumbbell / Bodyweight | hip_hinge | hamstrings | hold / standing-feet | SQ (N) | side | hinge(S),single(S) | - | 1 | B22 | Probe F solved and rendered; hip opening is a rotation and cannot be drawn. |
| 98 | conventional_deadlift | Barbell | hip_hinge | hamstrings, glutes, lower_back | hold / standing-feet | SQ (N) | side | hinge(S) | - | 1 | B22 | Bar on the floor: 45 cm plates put the bar at 22.5 cm. |
| 99 | sumo_deadlift | Barbell | hip_hinge | glutes, adductors | hold / standing-feet | SQ (N) | side | hinge(S) | - | 1 | B22 | Stance width shows only in a front view; drawn in side view. |
| 100 | hip_thrust | Barbell / Machine | hip_extension | glutes | on-body / bench-lying | LP (N) | side | bridge(S) | - | 1 | B23 | Upper back on a bench (probe K). |
| 101 | glute_bridge | Bodyweight / Barbell | hip_extension | glutes | none / floor-body | LP (N) | side | bridge(S) | - | 1 | B23 | Floor bridge. |
| 102 | cable_kickback | Cable | hip_extension | glutes | balance / standing-feet | LPD (N) | side | hinge(S),single(S) | ankleCuff | 1 | B23 | Ankle cuff on a low pulley. |
| 103 | hip_abduction | Machine | hip_abduction | glutes, abductors | balance / seat-back [pivot-pad] | LP (N) | front | seat(P) | hipAbdAddMachine | 1 | B06 | Frontal-plane movement: front view; legPress45 has no front-view drawing and seated front view exists only in the engine gallery. |
| 104 | hip_adduction | Machine | hip_adduction | adductors | balance / seat-back [pivot-pad] | LP (N) | front | seat(P) | hipAbdAddMachine | 1 | B06 | Same as hip abduction. |
| 105 | seated_calf_raise | Machine | plantar_flexion | calves | balance / pivot-pad | LP (N) | side | seat(P) | calfMachine | 1 | B25 | Knee pad lever over the thighs, foot on a platform. |
| 106 | standing_calf_raise | Machine | plantar_flexion | calves | balance / brace-pad | SQ (N) | side | stand(P) | calfMachine | 1 | B25 | Shoulder pads and a platform edge. |
| 107 | leg_press_calf_raise | Leg Press | plantar_flexion | calves | balance / foot-platform | LP (F) | side | recline(P) | - | 1 | B20 | Ball of foot on the plate; ankle only. |
| 108 | crunch | Bodyweight | spinal_flexion | abs | none / floor-body | HLR (N) | side | supine(S) | - | 1 | B26 | Spine flexion lying. |
| 109 | cable_crunch | Cable | spinal_flexion | abs | on-body / floor-body | HLR (N) | side | kneel(S) | **ropeLikely** | 1 | B26 | Kneeling; rope is standard (data says Cable). |
| 110 | machine_crunch | Machine | spinal_flexion | abs | balance / seat-back | HLR (N) | side | seat(P) | crunchMachine | 1 | B05 | Lever machine composed. |
| 111 | resisted_hip_flexion | Cable / Resistance Band | hip_flexion | hip_flexors | balance / standing-feet | HLR (F) | side | stand(P),single(S) | ankleCuff | 1 | B23 | Same joint action, standing with a cable (data also allows a band). |
| 112 | hanging_leg_raise | Bodyweight | hip_flexion | abs | hang / hang-support | A | side | hang(P) | - | 1 | B00 | Approved plate. |
| 113 | hanging_knee_raise | Bodyweight | hip_flexion | abs | hang / hang-support | HLR (P) | side | hang(P) | - | 1 | B01 | Same plate: knee angle parameter. |
| 114 | reverse_crunch | Bodyweight | spinal_flexion | abs | none / floor-body | HLR (F) | side | supine(S) | - | 1 | B26 | Pelvis curl: same abs and hip action as the hanging raise, lying. |
| 115 | plank | Bodyweight | anti_extension | core | none / floor-body | HLR (N) | side | plank(S) | - | 2 | B26 | Isometric: start and end are the same pose; the Trace pill has nothing to trace. |
| 116 | side_plank | Bodyweight | anti_lateral_flexion | obliques | none / floor-body | HLR (N) | front | roll(X) | - | 3 | B27 | Body on its side: roll is not in the pose model. |
| 117 | ab_wheel_rollout | Ab Wheel | anti_extension | core, abs | push / floor-body | HLR (N) | side | kneel(S),plank(S) | abWheel | 1 | B26 | Kneeling to a stretched plank; wheel composed. |
| 118 | russian_twist | Bodyweight / Weight | rotation | obliques | on-body / floor-body | HLR (N) | front | floorsit(S),yaw(X) | medBallOptional | 3 | B27 | The action is trunk rotation: yaw is not in the pose model. |
| 119 | pallof_press | Cable | anti_rotation | core, obliques | hold / standing-feet | SCR (N) | side | stand(P) | singleHandle* | 2 | B27 | Anti-rotation hold; the rotation fault cannot be drawn. |
| 120 | dead_bug | Bodyweight | anti_extension | core, abs | none / floor-body | HLR (N) | side | supine(S) | - | 1 | B26 | Opposite arm and leg lower. |
| 121 | sled_push | Sled | conditioning | quads, glutes | push / standing-feet | LP (N) | side | lean(P) +walk | **sled** | 3 | B28 | Travelling load; sled missing; a still plate shows a stance only. |
| 122 | sled_pull | Sled | conditioning | quads, glutes | pull / standing-feet | SCR (N) | side | hinge(S) +walk | **sled**, **rope** | 3 | B28 | Travelling load with a harness or rope. |
| 123 | farmer_s_carry | Dumbbells / Trap Bar | carry | forearms, upper_traps | hold / standing-feet | SQ (N) | side | stand(P) +walk | - | 3 | B28 | Locomotion under load; a still plate shows a stance only (data lists a trap bar as the alternative). |
| 124 | burpee | Bodyweight | conditioning | chest | palm-flat / standing-feet | SQ (N) | side | stand(P),plank(S) +multi | - | 3 | B28 | Four or more phases (squat, plank, push-up, jump). |
| 125 | mountain_climbers | Bodyweight | conditioning | core | palm-flat / floor-body | HLR (N) | side | plank(S) +cyclic | - | 3 | B28 | Cyclic alternation. |
| 126 | jumping_jacks | Bodyweight | conditioning | quads | none / standing-feet | LR (N) | front | stand(P),airborne(M) | - | 2 | B28 | Two-pose plate is drawable (arms down and feet together vs arms up and feet apart); cyclic. |
| 127 | high_knees | Bodyweight | conditioning | hip_flexors | none / standing-feet | HLR (N) | side | stand(P),airborne(M) +cyclic | - | 3 | B28 | Cyclic run in place. |
| 128 | jump_rope | Jump Rope | conditioning | calves | implement / standing-feet | LR (N) | front | stand(P),airborne(M) +cyclic | **jumpRope** | 3 | B28 | Rope missing; cyclic. |
| 129 | kettlebell_swing | Kettlebell | hip_hinge | glutes | implement / standing-feet | SQ (N) | side | hinge(S) | **kettlebell** | 2 | B22 | Ballistic: hinge start and standing end; the bell arc can be traced; kettlebell missing. |
| 130 | box_jump | Bodyweight | squat | quads | none / standing-feet | SQ (F) | side | stand(P),airborne(M) | - | 2 | B19 | Airborne; plyo box is the generic box primitive. |
| 131 | battle_ropes | Battle Ropes | conditioning | side_delts | implement / standing-feet | LR (N) | side | hinge(S) +cyclic | **battleRope** | 3 | B28 | Rope waves: the movement is the rope. |
| 132 | medicine_ball_slam | Medicine Ball | conditioning | core | implement / standing-feet | SQ (N) | side | stand(P),overhead(P) | medBall | 2 | B28 | Ball composed from a circle; overhead start, floor end. |
| 133 | wall_ball | Medicine Ball | conditioning | quads | implement / standing-feet | SQ (N) | side | stand(P),overhead(P) | medBall, wall | 2 | B28 | Squat plus throw; ball and wall composed. |
| 134 | bear_crawl | Bodyweight | conditioning | core | palm-flat / floor-body | MCP (N) | side | quad(S) +walk | - | 3 | B28 | Locomotion on all fours. |
| 135 | renegade_row | Dumbbells | horizontal_pull | lats | palm-flat / floor-body | SCR (N) | side | plank(S) | - | 2 | B10 | Plank plus row; anti-rotation is the point and rotation cannot be drawn. |
| 136 | bodyweight_squat | Bodyweight | squat | quads | none / standing-feet | SQ (F) | side | stand(P) | - | 1 | B19 | Back-squat pose keys without the bar. |
| 137 | jump_squat | Bodyweight | squat | quads | none / standing-feet | SQ (F) | side | stand(P),airborne(M) | - | 2 | B19 | Airborne frame: pose is free (root.at) but the plate teaches the landing only. |
| 138 | bodyweight_lunge | Bodyweight | lunge | quads | none / standing-feet | SQ (F) | side | split(S) | - | 1 | B21 | Same split pose keys without weights. |
| 139 | bodyweight_split_squat | Bodyweight | single_leg_squat | quads | none / standing-feet | SQ (F) | side | split(S) | - | 1 | B21 | Static split stance. |
| 140 | pistol_squat | Bodyweight | single_leg_squat | quads | none / standing-feet | SQ (F) | side | single(S) | - | 1 | B21 | Single-leg deep squat (probe F single-leg); free leg forward. |
| 141 | wall_sit | Bodyweight | squat | quads | none / standing-feet | SQ (F) | side | wall(M) | wall | 2 | B19 | Isometric hold: no start to end travel. |
| 142 | bodyweight_calf_raise | Bodyweight | plantar_flexion | calves | none / standing-feet | SQ (N) | side | stand(P) | - | 1 | B25 | Forefoot on an edge (box). |
| 143 | inverted_row | Bodyweight | horizontal_pull | mid_back | pull / hang-support | SCR (F) | side | supine(S) | - | 1 | B01 | Body horizontal under a low bar; pullupBar takes any height. |
| 144 | pike_push_up | Bodyweight | vertical_push | front_delts | palm-flat / floor-body | MCP (N) | side | plank(S) | - | 1 | B10 | Hips-high inverted V, vertical push. |
| 145 | diamond_push_up | Bodyweight | horizontal_push | triceps | palm-flat / floor-body | MCP (N) | side | plank(S) | - | 1 | B10 | The diamond hand position is invisible in side view; the hand close-up carries it. |
| 146 | v_up | Bodyweight | spinal_flexion | abs | none / floor-body | HLR (F) | side | supine(S) | - | 1 | B26 | Arms and legs meet in a V. |
| 147 | bicycle_crunch | Bodyweight | rotation | obliques | none / floor-body | HLR (N) | front | supine(S),yaw(X) | - | 3 | B27 | Trunk rotation: yaw is not in the pose model; only the knee drive can be drawn. |
| 148 | flutter_kicks | Bodyweight | hip_flexion | hip_flexors | none / floor-body | HLR (F) | side | supine(S) | - | 2 | B26 | Small alternating kicks: two poses barely differ. |
| 149 | hollow_body_hold | Bodyweight | anti_extension | abs | none / floor-body | HLR (N) | side | supine(S) | - | 2 | B26 | Isometric hold. |
| 150 | bird_dog | Bodyweight | anti_rotation | core | palm-flat / floor-body | HLR (N) | side | quad(S) | - | 2 | B26 | Quadruped solved (probe H); a held reach with little travel; hip rotation fault cannot be drawn. |
| 151 | superman | Bodyweight | hip_extension | lower_back | none / floor-body | HLR (N) | side | prone(S) | - | 1 | B26 | Prone lift (angles only). |
| 152 | resistance_band_row | Resistance Band | horizontal_pull | mid_back | pull / standing-feet | SCR (F) | side | floorsit(S) | band | 1 | B03 | Band composed from line; seated on the floor. |
| 153 | resistance_band_pull_apart | Resistance Band | horizontal_abduction | rear_delts | pull / standing-feet | LR (N) | front | stand(P) | band | 1 | B14 | Band is not an engine item (composed from line). |

## 9. Not verified, and risks the census cannot close

- **Contact archetype per id** is derived (section 1). **Closest approved, closeness, tier and batch** are my judgement from reading the specs and engine; the counts inside them are exact, the class boundaries are arguable. Roll and yaw are the only hard engine limits I found; every S and M pose is untuned.
- **No probe checked plate quality** (silhouette, label placement, Mistake view) for any new exercise; SPEC 7 says the real workflow finds errors only after render, contacts, checks and angle review. Also unverified: front view of `chestPress` and the pec-deck arms; seated front view beyond the gallery; the `kneePad` roller as an ankle or shin roller; a plate with a very small motion.
- **Golden update path:** every new plate is a new `GOLDEN.json` entry with owner approval of the contact sheet (plan 2.8, HT-12 pattern); the approved 8 must stay byte-identical, so any engine change for new equipment must leave the 8 plates at 0 px (HT-1 L0 to L4).
- **Copy volume:** the compact-copy lint (450 visible words per exercise) is per exercise; 145 more research cards and copy sets are not counted here.
- **Custom exercises** (user-added) never show the button (plan 2.4: `!ex.custom && hasHowTo(ex.id)`; not re-verified in `Train.tsx`), so the 153 are the whole scope.
