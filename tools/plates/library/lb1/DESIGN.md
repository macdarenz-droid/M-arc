# LB1 plates: design note (LIB-9a)

Card: `docs/supervisor/verify/lib-9a-card.md` @ `19a6017` (Do 1). Rulings: lib4-cards sections 1, 11.1 and 12 @ `19a6017`
(D-LIB4-ENTRY-2, D-LIB9-ENGINE, D-LIB9-AUTHORQA, D-LIB9-CARDFIELDS, D-LIB-CIMANNERS, D-LIB-LANE-ACTIVE, D-LIB5-BOX), and
this note's rulings, D-LIB9a-NOTE (lib4-cards section 13 @ `8669e21`; Q1-Q5 below). Plan: `claude/howto-options` @
`4a9fd86`. Research: the 14 cards and quotes are byte copies from `claude/libht-research` @ `9eaa248` (Do 6, re-copied from
the post-wave-2 head the supervisor named on #245, comment 6246213504; first copied from `9dbc7e0`). Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`.

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
- **Envelope fact.** `qa/envelope.json` names no PARAMS key, so `derive()` given that envelope (derive.mjs:2-3) refuses
  every param today: no row can be a valid D.
- **Consequence for the acceptance list (Q5).** With no D row, A7 (D parent rebuild) and A4's "raw-spec override on a D
  row" have no LB1 subject. Both are proven in Do 4 (lb1-plates.test.ts) on the real path: candidateOf(...,
  { authoring: true }) on an in-memory D copy of lib_close_grip_pulldown with its plan parent lib_lat_pulldown and
  params { 'camera.maxScale': n }, then h10. Clean first, then a key outside PARAMS (H10.unknown), a raw-spec key
  (H10.raw) and one byte of a parent fragment (H10.byte), each red. The clean result means "H10's checks bite", never
  "a valid D". The test asserts 14 H and 0 D in rows.json.
- **Known H10 gap (recorded, not fixed here: qa/ is reserved).** On the real path `validateParams` (qa/node.mjs) checks
  only key names: it ignores PARAMS `values`, number ranges and the envelope, and allows empty params
  ('bar.kind':'banana', 'camera.maxScale':99 and 'handedness':7 all pass H10 on main). candidate.mjs passes PARAMS as the
  schema, whose `{type:'enum', values}` shape validateParams does not read. The supervisor routes the fix before any D
  row exists on any branch.

## 2. Per id

Clone sources: the 8 = golden A, `tests/howto/golden/GOLDEN.json` entry `ref bc0f378` (owner, 2026-09-30); pilot A =
`e6f39ff` (#109). View: side for all 14 (card `plate.view` = census `view`), so F6 is never expected.

| id | mode, false parent fields | clone source (approving sha) | composer / primitives | pose class | hand zoom: pair key |
|---|---|---|---|---|---|
| chin_up* | H. pull_up: alt "Overhand grip" (card c1: palms toward the face); callouts Chin over bar / Elbows down / Shoulders down vs card Shoulders set / Elbows in front / Chin to bar; tempo 1/0.5/2/0.5 vs 2/1/2 | pull_up (bc0f378) | pullupBar | hang | hand: no key yet |
| hanging_knee_raise* | H. hanging_leg_raise: pose (straight legs vs knees bent above the hips, c5); callout "Legs straight"; tell "Knees only" names the child's correct pose as a fault; tempo 1.5/0.5/2/1 vs 1/1/2 | hanging_leg_raise (bc0f378) | pullupBar | hang | hand: no key yet |
| assisted_pull_up* | H (own parent). No parent spec | pull_up (bc0f378) for the hang and grip IK | **assistMachine** (new) | hang + kneel (kneel anchor, plan 2.2) | hand: no key yet |
| inverted_row | H (own parent) | census closest seated_cable_row (bc0f378); supine anchor dumbbell_bench_press (e6f39ff, or the head D-PILOTA-R5 names; supine `checks {plane}`) | pullupBar lowered + rackUpright | supine | hand: no key yet |
| close_grip_pulldown | H. lat_pulldown: alt "the wide bar"; latBar vs V-handle (c1); callouts Bar to chest / Elbows down / Shoulders down vs Thighs pinned / Elbows to hips / Handle below chin; lean grows start to end vs no extra lean (c4); tempo 1/0.5/2/0.5 vs 2/2 | lat_pulldown (bc0f378) | vHandle, lat_pulldown's station | seat + overhead | hand: no key yet |
| underhand_lat_pulldown | H. lat_pulldown: alt "wide bar", grip overhand wide vs underhand about shoulder width (c1); callouts; Mistake swing + shrug vs momentum rock (c7); tempo | lat_pulldown (bc0f378) | latBar, station | seat + overhead | hand: no key yet |
| single_arm_lat_pulldown | H. lat_pulldown: one arm, single handle (c1); callouts; Mistake; tempo 2/1/2 | lat_pulldown (bc0f378) | **dHandle** (new, `poly`), station | seat + overhead | hand: `d-handle/pull` (LIB-7 @ 55e91e9) |
| straight_arm_pulldown | H (own parent) | census closest lat_pulldown (bc0f378); hinge anchors romanian_deadlift / barbell_row (e6f39ff, or the head D-PILOTA-R5 names), after the pilot A code review (Do 5 d) | cableColumn (high pulley), latBar straight | stand + hinge | none on the card |
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
- **F7 follows research (Q1).** topFault comes from the card (section 4), so the expected F7 is a research fact: on a
  drawable:true card the drawn Mistake carries topFault and F7 stays down; on a drawable:false card F7 is raised and
  needs the owner's yes. At `9eaa248` (LR-31) three cards are drawable:false, so F7 is expected raised on
  assisted_pull_up, resistance_band_row and shoulder_press. LR-32 answered single_arm_lat_pulldown (Q1(b)): it stays
  drawable:true with the past-end pull, so no F7. LIB-9a never edits the card beyond its three keys.
- **F1 on resistance_band_row (D-LIB8-floor, ruling Q-D5-1, lib4-cards 13.3).** The floor sit uses plank's camera
  (`fit`, `maxScale 1.35`, `y0 339`); the floor runs to 1.60 m so the 'band' label fits right of the foot, and the fit
  lands at 159 px/m (x1.087). A named exemption by id and key on the LB1 sheet, the supervisor's to sign.
- No other flag is planned. Any other raised flag is a defect to fix, never an addition to the list.

**Held plates (13.3).** leg_press_calf_raise (H3 trace and toe-plate contact, D-LIB8-shrug; spec not committed until it
is re-planned) and horizontal_leg_press (end knee redrawn at the card-true 15°; H3 deviation 8.2 px < 11.39, so held under
Q-D5-3 / D-LIB8-shrug; spec committed at 15°). Neither is bent to pass a check; the owner's design option decides them.

## 4. Card fields (D-LIB9-CARDFIELDS)

- **topFault (Q1).** Written by Do 6 from the card, never from a spec, through this ruled map of each card's
  plate.mistake to a key: chin_up `kip`, hanging_knee_raise `swing`, assisted_pull_up `partial`, inverted_row `sag`,
  close_grip_pulldown `low`, underhand_lat_pulldown `past` (LR-31; `rock` at `9dbc7e0`), single_arm_lat_pulldown
  `past`, straight_arm_pulldown `bend`, chest_supported_row `lean`, resistance_band_row `slump`, incline_machine_press
  `blades`, shoulder_press `arch`, horizontal_leg_press `lock`, leg_press_calf_raise `lock`. Two cases: drawable:true,
  topFault is the key of plate.mistake; drawable:false, it is the key of the top fault the card itself names
  (mistake.why or handlingMistakes), which differs from the drawn Mistake's key, so F7 is raised. At `9eaa248` three
  cards are drawable:false, each a speed fault, with keys proposed for the supervisor's ruling: assisted_pull_up
  `fast` (lowering too fast, c16), resistance_band_row `snap` (the band snapping back, c5), shoulder_press `drop`
  (the handles dropping on the way down, c6). The spec's first Mistake tell carries plate.mistake's key and draws
  that fault.
- `plateFacts` only for numbers that a claim's verbatim quote states, each naming that claim. A bound ("no more than
  about 30 degrees") or a range is not a point fact: the drawing stays inside it, and it is not written as a fact.
  The fields are written in Do 6 from the head the supervisor names, never from a spec.
- **Tempo map (ruled, Q3; lb1/tempo.json).** The spec's phase array follows the movement from the drawn start pose. The
  concentric phase takes `plate.tempo.up`, the eccentric phase `plate.tempo.down`, and a `Hold` of `plate.tempo.pause`
  comes right after the concentric phase, if and only if pause > 0 (every LB1 card puts its pause there, checked
  against each tempo claim's quote). Shape `{phase, s, move: true}` for a moving phase and `{phase, s}` for Hold. No
  Rest phase: no LB1 card sources a rest, so the set of named constants is empty. A11's mutations are Q3's (i)-(vi).

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
the pinned H9 line types). `eq/polybar.mjs` (`polyBar`, `polyPad`) is accepted by name as a composer-support file under
the same rules: a new file, pure, PRIMITIVES-only output, no file reads, covered by the import scan.
- `assistMachine`: tower, handle arm and bar, knee pad on a lever, cable to the stack, mount step, stack pin. It is
  driven by named per-pose pad-top heights (never by the lifter's landmarks), the pad on a circle of radius `lever`
  round the pivot; the start pad, bracket and lever are added to the end pose as a dashed outline. Sizes are assumed
  typical commercial ones; no card claim gives sizes.
- `chestRowMachine`: seat, upright chest pad, lever handles at shoulder height on a pivot arm (moving, `poly`).
- `band`: a band looped round the soles, two strands to the hands (moving, `poly`), drawn for the floor-sit row.
- `dHandle` (named here as an LB1 composer): a single D-handle on the cable for single_arm_lat_pulldown (moving, `poly`).
The tests read the drawn items in every pose (lever ends at the pivot and lever end, rails at the ring, handle on the
lever circle), never the helper maths alone.

## 6. Drawing decisions

- **assisted_pull_up draws the top as the start pose (Q2).** The card's start is the hang and its end is the chin over
  the bar. The engine builds the Mistake as the end pose plus an override (plate.mjs:78) and outlines what differs from
  the end pose (:208), drawn over the end figure (:265). So a bottom-of-rep fault reads correctly only against a hang
  end, as on leg_press. With the top as the start, the half hang's bent arms and raised pad show against the solid
  straight-arm hang, which carries the card's "Knees on pad" and straight-arms checkpoint. This plate differs on purpose
  from pull_up, which draws the top solid: this card's fault is at the bottom. Pose map for the card's facts: card
  plate.start (the hang) = spec 'end', card plate.end (chin over the bar) = spec 'start', Mistake = 'mistake'
  (recorded in lb1/tempo.json). The start layer draws no moving equipment (plate.mjs:110-114), so the top pose's pad,
  bracket and lever are a dashed phantom in the end pose. The critic judges it blind; the bound fallback is Q2 (g).
- **Kneel class (plan 2.2, probe C).** Knees by angles, roots solved once onto named pad heights and written as
  constants, contact proven by `checks` planes at one kneecap radius above each pose's pad top (start, end, Mistake).
- **Leaders (D-LIB9a-SLICE).** Labels sit in open space with short leaders that never run within 6 px of the trace or
  a cable. close_grip_pulldown: 'chin' right of the handle with a level leader, 'thighs' right of the knee reaching the
  thigh just in front of the roller, 'elbows' below the lean-back label so the two leaders never cross. Both fit only
  with the column 18 cm further back than lat_pulldown's (1.04/1.30 m vs 0.86/1.12 m); the LB1 pulldowns share that
  station (R7 within LB1). assisted_pull_up keeps three leaders that cross a drawn part, because no open side exists: the knee-pad
  contact ('Knees on pad', 'Pad stays up') is closed in by the shin on the pad, the pad and bracket below and, in the
  Mistake, the red half-hang legs above; the bent elbow's only open side ('Arms bent') is the 45 px gap to the tower,
  and the 47 px button does not fit in it.
- **One Mistake tell (Q-D5-4; lib4-cards 13.4 Q-R2-2).** Q-D5-4 asks for 2-3 tells wherever the card names more
  than one visible sign that can be placed (DRAWING-GUIDE:24, :40). Two plates keep one tell, as ruled:
  - horizontal_leg_press (`lock`): the card's mistake names one sign, "Snapping the knees straight and locking them"
    (c7, c4, c8). Measured: the end knee is 15.0 deg, the Mistake knee 0.5 deg. The heels (c7) and the low back (c4) are
    right-form tells or other faults; drawing them would add a second fault (DRAWING-GUIDE:24, :37).
  - inverted_row (`sag`), on the placement ground only: the fold's only open-side edge is the buttock, which `sag`
    marks, and `sag`'s cue says "the body folds"; a second tell there is one sign twice (DRAWING-GUIDE:40). The other
    side of the fold lies inside the solid end figure. Boxes tried for a 'Folds at hips' tell on the Mistake hip
    (measured at this head): (230, 230) leader 67.0 px, 40.5 px of it through the solid end figure; (200, 200) 57.5 px,
    36.3 px through it; (270, 250) 106.7 px (over F3's 82.26), 44.5 px through it. Round 2's box gave 91 px through the
    solid thigh (builder's figure, not re-measured).
  - incline_machine_press is not one of them: its second tell `roll` marks c5's forward roll on the red handle, in the
    open top right (13.4 must-fix 5).
  - underhand_lat_pulldown was a one-tell plate (`rock`) at `9dbc7e0`. Its LR-31 Mistake, the past-end pull, has two
    signs the card names ("pulling the bar further down", "the elbows start moving backwards"), drawn as `past` and
    `back`, close_grip's pair.
- **Do 6 re-copy at `9eaa248`: drawing changes.** underhand_lat_pulldown's Mistake is now the past-end pull (LR-31):
  the bar 25.7 cm below the end bar, the elbows 7.4 cm behind the end backMid (red cap 8.9 px clear), the set lean
  kept. shoulder_press draws the close handles with the elbows pointing forward (card variantLine, W2-10, LR-2, c7):
  grip centres +-15 cm, the start elbow 23 cm in front of the shoulder. Every other plate is unchanged.
- **Tall machines and F1.** The pulldown station and the assist tower are 2.2-2.3 m tall, so `fit` lands at 126-133
  px/m, inside F1 (123.9-146.3) with little room. Machines are kept at the 8's heights.

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
- **H10 value and envelope gap** (Q5 f): see section 1. qa/ is reserved, so the supervisor routes the fix to a separate
  qa/ card before any D row exists on any branch; rows.json stays 14 H, 0 D (tested).
- **F2 coverage on tall rigs:** checked in the preview runs (assist tower 0.43, pulldown station 0.38, inside
  0.19-0.55).

## 8a. Critic plan (Do 8)

- The calibrated critic (plan 3.4, after D-LIB9-F5) judges assisted_pull_up blind; Q2 (g)'s bound fallback stays armed
  for that run (D-LIB9a-SLICE). Note for the critic: on its Mistake view the bent arm is the fault, and it should read
  before the heavier red pad dashes (the pad dashes show only that the pad did not sink).
- Plan 3.4 R8 (close-ups) and R9 (feel regions) cannot be scored in LIB-9a: there are no close-ups or feel stills yet.
  No LB1 approval counts as a full 3.4 pass until LIB-9 (or LIB-6/7) adds them and the critic scores R8 and R9.

## 9. Rulings (D-LIB9a-NOTE, lib4-cards section 13 @ `8669e21`)

1. Q1: topFault from the card (section 4); single_arm's expected F7 waits for research.
2. Q2: start = the top, with the pose map, the phantom pad and the bound fallback (section 6).
3. Q3: the tempo map with no Rest and no constants; the ruled table lives in the test (section 4).
4. Q4: A2's second mutation is the real knee pad drawn as a moving `rackUpright`, exact key
   `H9.moving-line:eq<i>.rackUpright.1`: a moving item with no poly whose type is not in H9lineTypes (rackUpright's hole
   marks, j=1, the key family of LIB-3's M6). The "moving box pad: H9 green" test stays as a record of the engine, with
   its premise asserted. A4 still runs LIB-3's M6 through runQa.
5. Q5: the D path is proven on an in-memory D copy of lib_close_grip_pulldown (section 1).
6. Q-A (#245, comment 6242372604): registry.mjs stays byte-identical, because goldenInputs (registry.mjs:61) makes it an
   input of every generated file; candidate.mjs resolves the How-to source of a row in the injected rows with sourceOf's
   own rule, and a test proves it equals sourceOf for every main row and the 14 LB1 rows. This is D-LIB9-AUTHORQA's
   sourceOf part.
7. D-LIB9a-HOWTOID (lib4-cards 13.1): LB1 How-to sources hold `id` beside `research` (071e078c), because library-scale's
   synthetic N = 153 reader checks the id of any existing source. Nothing else goes in those files.
8. D-LIB9-FACTPOSE: a fact's pose is the pose its quote states.

