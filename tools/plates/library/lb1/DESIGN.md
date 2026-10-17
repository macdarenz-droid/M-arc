# LB1 plates: design note (LIB-9a)

Card: `docs/supervisor/verify/lib-9a-card.md` @ `19a6017` (Do 1). Rulings: lib4-cards sections 1, 11.1 and 12 @ `19a6017`
(D-LIB4-ENTRY-2, D-LIB9-ENGINE, D-LIB9-AUTHORQA, D-LIB9-CARDFIELDS, D-LIB-CIMANNERS, D-LIB-LANE-ACTIVE, D-LIB5-BOX).
Plan: `claude/howto-options` @ `4a9fd86`. Research read on `claude/libht-research` @ `9dbc7e0` (the copy for Do 6 waits for
the head the supervisor names). Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`.

Nothing here ships: every LB1 row stays at stage `drawing` or `review` in `lb1/rows.json`, outside `batches/`.

## 1. Engine and modes

- **Engine.** Every LB1 spec imports only `tools/plates/library/engine.mjs` (the vendored golden-A engine) and composers
  under `eq/`. No spec or composer imports anything under `tools/plates/layers/` (D-LIB9-ENGINE). `poly` and the flat palm
  are available.
- **PARAMS check (confirmed).** Of the PARAMS paths in `derive.mjs` (`camera.maxScale`, `grip.width`, `bar.kind`,
  `bench.angle`, `load.primitive`, `handedness`, `stance.width`), the engine reads only `spec.camera`
  (`vendor/engine/plate.mjs:81-95`; a grep of `vendor/engine/*.mjs` finds no read of the other six). A D child can
  therefore change only the camera.
- **Result: all 14 rows are H.** Plan 6.2 expected D9 H5. Every D candidate fails the D rule twice over:
  1. its card's `plate.tempo` differs from the parent's tempo array, and `tempo` is not a PARAMS key (PQ-H6 compares
     the spec's tempo with the card's exactly);
  2. its card's 3 checkpoints, its Mistake and its tells differ from the parent's callouts and tells.
  The parent fields that are false for each child are listed in the table (section 2). 9 D become H: chin_up,
  hanging_knee_raise, close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown, incline_machine_press,
  shoulder_press, horizontal_leg_press, leg_press_calf_raise. Cost per plan risk: about +2.5 Opus-hours each [est].
- **Consequence for the acceptance list.** With no D row, A7 (D parent rebuild) and the "raw-spec override on a D row"
  mutation (A4) have no LB1 subject. Both are still proven, on a test candidate copied from one LB1 row with
  `mode: 'D'` and a derivation, so the checks are shown to bite (lb1-plates.test.ts). If the supervisor prefers, a row
  can stay D only where every parent string is true; none qualifies today.

## 2. Per id

Clone sources: the 8 = golden A, `tests/howto/golden/GOLDEN.json` entry `ref bc0f378` (owner, 2026-09-30); pilot A =
`e6f39ff` (#109). View: side for all 14 (card `plate.view` = census `view`), so F6 is never expected.

| id | mode, false parent fields | clone source (approving sha) | composer / primitives | pose class | hand zoom: pair key |
|---|---|---|---|---|---|
| chin_up* | H. pull_up: alt "Overhand grip" (card c1: palms toward the face); callouts Chin over bar / Elbows down / Shoulders down vs card Shoulders set / Elbows in front / Chin to bar; tempo 1/0.5/2/0.5 vs 2/1/2 | pull_up (bc0f378) | pullupBar | hang | hand: no key yet |
| hanging_knee_raise* | H. hanging_leg_raise: pose (straight legs vs knees bent above the hips, c5); callout "Legs straight"; tell "Knees only" names the child's correct pose as a fault; tempo 1.5/0.5/2/1 vs 1/1/2 | hanging_leg_raise (bc0f378) | pullupBar | hang | hand: no key yet |
| assisted_pull_up* | H (own parent). No parent spec | pull_up (bc0f378) for the hang and grip IK | **assistMachine** (new) | hang + kneel (kneel anchor, plan 2.2) | hand: no key yet |
| inverted_row | H (own parent) | dumbbell_bench_press (e6f39ff, supine `checks {plane}`) | pullupBar lowered + rackUpright | supine | hand: no key yet |
| close_grip_pulldown | H. lat_pulldown: alt "the wide bar"; latBar vs V-handle (c1); callouts Bar to chest / Elbows down / Shoulders down vs Thighs pinned / Elbows to hips / Handle below chin; lean grows start to end vs no extra lean (c4); tempo 1/0.5/2/0.5 vs 2/2 | lat_pulldown (bc0f378) | vHandle, lat_pulldown's station | seat | hand: no key yet |
| underhand_lat_pulldown | H. lat_pulldown: alt "wide bar", grip overhand wide vs underhand about shoulder width (c1); callouts; Mistake swing + shrug vs momentum rock (c7); tempo | lat_pulldown (bc0f378) | latBar, station | seat | hand: no key yet |
| single_arm_lat_pulldown | H. lat_pulldown: one arm, single handle (c1); callouts; Mistake; tempo 2/1/2 | lat_pulldown (bc0f378) | **dHandle** (new, `poly`), station | seat | hand: `d-handle/pull` (LIB-7 @ 55e91e9) |
| straight_arm_pulldown | H (own parent) | romanian_deadlift / barbell_row hinge (e6f39ff), after the pilot A code review (Do 5 d) | cableColumn (high pulley), latBar straight | stand + hinge | none on the card |
| chest_supported_row | H (own parent) | seated_cable_row (bc0f378) | **chestRowMachine** (new) | seat + lean | none on the card |
| resistance_band_row | H (own parent) | seated_cable_row (bc0f378) | **band** (new) | floor-sit (first user, own sheet) | none on the card (band hand waits on research, LIB-7 hand-band.mjs GAPS) |
| incline_machine_press | H. machine_chest_press: arm path horizontal vs up and forward to forehead height (c2); handle height mid-chest vs upper chest (c1); callout "Elbows 45°"; tempo 1/0.3/1.5/0.5 vs 2/1/2 | machine_chest_press (bc0f378) | chestPress (pivot placed for the inclined path), backPad reclined, seat | recline | none on the card |
| shoulder_press* | H. machine_chest_press: overhead path (census gap pivotArmOverhead: drawn with chestPress, pivot above and behind); callouts; Mistake arch vs round; tempo | machine_chest_press (bc0f378) | chestPress, backPad upright, seat | seat + overhead | none on the card |
| horizontal_leg_press | H. leg_press: rail 45° vs level (rail angle 0); start at the bottom (knees 90°) vs the parent's top start; Mistake lock vs hips lift; tempo 2/0.5/1/0.5 vs 2/1/2 | leg_press (bc0f378) | legPress45 `rail.angle 0` | seat | none on the card |
| leg_press_calf_raise | H. leg_press: knee action vs ankle action (c4); balls of the feet on the platform edge (c1); callouts; Mistake; tempo | leg_press (bc0f378) | legPress45 (45°) | recline | none on the card |

\* tier A. "No key yet": 6 cards have a hand zoom and no LIB-7 key (chin_up, hanging_knee_raise, assisted_pull_up,
inverted_row, close_grip_pulldown, underhand_lat_pulldown). No hand block is built here; the LIB-7 fixer proposes their
keys (D-LIB9-HANDPAGE).

## 3. Expected flags

- **F5 on all 14** (D-LIB9-F5 is open): the selected-Mistake-tell chrome contrast, 3.57:1. Listed, never exempted or
  fixed locally.
- **F1 on leg_press_calf_raise, if zoomed.** The ankle moves the platform about 8-10 cm [est], about 12 px at the 8's
  scale, under PQ-H3's shortest approved Trace (22.1 px). If the drawn Trace is short, `camera.maxScale` zooms it and F1
  is raised (plan 1, small-motion zoom), with an alt text saying the view is enlarged.
- **F7 on single_arm_lat_pulldown: not expected, ruling asked.** The card asks for F7 (the plan's drawable-fault list,
  census note "the defining fault is a sideways lean"). But the verified card @ `9dbc7e0` sets
  `plate.mistake.drawable: true` (elbow driven back past the end, shoulder rolling forward; c10, c13), and
  D-LIB9-CARDFIELDS makes `topFault` "the card's mistake key". So the drawn Mistake equals `topFault` and F7 stays
  down. Proposal: expect no F7 here; if the supervisor wants the lean named as the top fault, the card needs a research
  change first (`drawable: false` with the lean sourced), not a field written here.
- No other flag is planned. Any other raised flag is a defect to fix, never an addition to the list.

## 4. Card fields (D-LIB9-CARDFIELDS)

- `topFault` = the first tell key of the plate (what `candidateOf` reads as `mistakeFault`). Proposed keys: chin_up
  `kip`, hanging_knee_raise `swing`, assisted_pull_up `partial`, inverted_row `sag`, close_grip_pulldown `low`,
  underhand_lat_pulldown `rock`, single_arm_lat_pulldown `past`, straight_arm_pulldown `bend`, chest_supported_row
  `lean`, resistance_band_row `slump`, incline_machine_press `blades`, shoulder_press `arch`, horizontal_leg_press
  `lock`, leg_press_calf_raise `lock`.
- `plateFacts` only for numbers that a claim's verbatim quote states, each naming that claim. A bound ("no more than
  about 30 degrees") or a range is not a point fact: the drawing stays inside it, and it is not written as a fact.
  The fields are written in Do 6 from the head the supervisor names, never from a spec.
- **Tempo map** (for the supervisor to rule). Rule: the spec's phase array follows the movement from the drawn start
  pose. The concentric phase takes `plate.tempo.up`, the eccentric phase takes `plate.tempo.down`, and a `Hold` phase of
  `plate.tempo.pause` seconds sits at the end of the concentric phase, where every one of the 14 cards puts its pause
  (checked against each tempo claim's quote). `pause: 0` gives no Hold phase. No Rest phase: pilot A's approved specs
  have none, and no LB1 card sources a rest, so **no named constant is needed**. (Alternative, not recommended: the 8's
  Rest 0.5 s, cited to lat_pulldown and pull_up; it would be the only unsourced number in the strip.) A11's "Rest
  changed in one card" mutation then becomes "a Rest phase added to one card" (an unmapped `s`, red).

| id | card up/down/pause (claim) | phase array |
|---|---|---|
| chin_up | 2/2/1 (c8) | Pull 2, Hold 1, Lower 2 |
| hanging_knee_raise | 1/2/1 (c9) | Lift 1, Hold 1, Lower 2 |
| assisted_pull_up | 2/3/1 (c9) | Lower 3, Pull 2, Hold 1 (drawn start = the top, see 6) |
| inverted_row | 1/2/1 (c6) | Pull 1, Hold 1, Lower 2 |
| close_grip_pulldown | 2/2/0 (c10) | Pull 2, Return 2 |
| underhand_lat_pulldown | 2/2/0 (c12) | Pull 2, Return 2 |
| single_arm_lat_pulldown | 2/2/1 (c14) | Pull 2, Hold 1, Return 2 |
| straight_arm_pulldown | 2/2/1 (c15, c7) | Pull 2, Hold 1, Return 2 |
| chest_supported_row | 2/2/1 (c12, c5) | Pull 2, Hold 1, Return 2 |
| resistance_band_row | 2/2/0 (c10) | Pull 2, Return 2 |
| incline_machine_press | 2/2/1 (c8, c3) | Press 2, Hold 1, Return 2 |
| shoulder_press | 2/2/1 (c12, c6) | Press 2, Hold 1, Return 2 |
| horizontal_leg_press | 2/2/1 (c12, c13) | Press 2, Hold 1, Return 2 |
| leg_press_calf_raise | 2/2/1 (c15) | Raise 2, Hold 1, Lower 2 |

  For the pulldowns "up" is read as the concentric pull; all five pulldown cards are 2/2, so the reading changes no
  number.

## 5. Composers

Each is `(lm, ctx) => item[]`, built only from PRIMITIVES types, reads no file, and is wrapped with `perItem()` so each
part has its own engine key. Any part that moves between the end pose and the Mistake is `poly` (or a stack or cable,
the pinned H9 line types). Shared poly shapes: `eq/polybar.mjs` (`polyBar`, `polyPad`).
- `assistMachine`: tower, handle arm and bar, knee pad on a lever (pad top one kneecap radius under the knee, lever
  length constant in every pose), cable to the stack, mount step, stack pin. Sizes are assumed typical commercial ones;
  no card claim gives sizes.
- `chestRowMachine`: seat, upright chest pad, lever handles at shoulder height on a pivot arm (moving, `poly`).
- `band`: a band looped round the soles, two strands to the hands (moving, `poly`), drawn for the floor-sit row.
- `dHandle` (named here as an LB1 composer): a single D-handle on the cable for single_arm_lat_pulldown (moving, `poly`).

## 6. Drawing decisions that need a look

- **assisted_pull_up draws the top as the start pose.** The card's start is the hang and its end is the chin over the
  bar. The engine draws the Mistake as an outline of what differs from the end pose, masked by the solid end figure. The
  card's Mistake (a half hang with bent arms, c8) lies inside the top figure's silhouette, so drawn against the top it
  was mostly hidden (tried and rendered). With the top as the start and the straight-arm hang as the end, the bent arms
  and the high pad of the Mistake stand clear of the solid hang, and the solid figure shows the card's "Knees on pad"
  and "arms straight" checkpoint. Both positions are still drawn, and the tempo strip starts with the 3 s lowering the
  card stresses (c9, c16). If the supervisor rules against it, the fallback is the card's order with the Mistake drawn
  as guides only.
- **Kneel class (plan 2.2, probe C).** Knees by angles, root placed so the knee sits on the pad, contact proven by a
  `checks` plane at one kneecap radius above the pad top (start, end and Mistake).
- **Tall machines and F1.** The pulldown station and the assist tower are 2.2-2.3 m tall, so `fit` lands at 126-130
  px/m, inside F1 (123.9-146.3) with little room. A taller part would push the scale below F1; machines are kept at the
  8's heights.

## 7. Work split (if a second drawer joins, `claude/lib-9-lb1-b`)

- Family M (machines, this branch): the pulldown station ids, chest_supported_row, straight_arm_pulldown, and the
  presses and leg presses.
- Family B (bodyweight and floor, second drawer): chin_up, hanging_knee_raise, inverted_row, resistance_band_row.
  assisted_pull_up stays here (slice, kneel anchor).
- rows.json, build.mjs, qa.mjs, tempo.json, cards.sha.json and the tests stay on this branch; the second drawer adds
  spec files only and is merged in with a merge commit.

## 8. Risks and mitigations

- **All D become H** (+time). Mitigation: clone the parent's station code verbatim, change only what the card needs,
  and review the diff against the parent.
- **The slice's Mistake readability** (R5) is the weakest rubric item so far; both slice plates were redrawn to put the
  fault outside the end silhouette. The supervisor's look decides before the other 12.
- **Machine sizes are assumptions** (no card claim). Mitigation: typical commercial sizes, stated in each composer
  header, the same way the 8 state theirs.
- **Research head moves** (wave 2). Mitigation: Do 6's re-copy rule; `cards.sha.json` makes any drift red.
- **LIB-5's back-box placeholder** (D-LIB5-BOX route b): the plate QA path does not call the layer generator, so it
  should not reach the accessor; if any LB1 path does, stop and report (never stub it).
- **D-LIB-SCRATCHIDS:** LIB-4b's B5 fixture targets two LB1 ids; it is never run on this branch.
- **F2 coverage on tall rigs:** checked in the preview runs (assist tower 0.43, pulldown station 0.38, inside
  0.19-0.55).

## 9. Open points for the supervisor's look

1. **F7 on single_arm_lat_pulldown** (section 3): expect none, since the verified card's Mistake is drawable.
2. **assisted_pull_up start = the top** (section 6).
3. **Tempo map** (section 4): no Rest phase, so no named constant.
4. **A2's second mutation as worded does not bite.** "A knee pad that moves in the Mistake as a box with no poly": a
   `box` carries a closed outline (vendor `geom.mjs` `bar()` returns `{ d, poly }`), so `plate.mjs:209-213` draws it in
   the Mistake and H9 accepts it (`qa/node.mjs` `movingLines` passes any item with `poly`). lb1-plates.test.ts pins that
   fact (a moving box pad: H9 green) and proves the intent with the pad drawn by a part with no closed outline that the 8
   never move (a moving `rackUpright`, as LIB-3's M6): H9.moving-line red. Ruling asked: accept that as A2's mutation.
5. **No D row** (section 1): A7 and the "raw-spec override on a D row" mutation are proven on a test candidate.
