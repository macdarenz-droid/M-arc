# LB2 plates: design note (LIB-10)

Card: `docs/supervisor/verify/lib-10-card.md` @ `be4b18f` (Do 1). Rulings: lib4-cards section 15 @ `be4b18f`
(D-LIB10-RANGES, D-LIB10-CHILDPROOF, D-LIB10-AHEAD, D-LIB10-TEMPLATES, D-LIB10-PA, D-LIB10-DECLINE, D-LIB10-FACTS,
D-LIB10-ANCHORS, D-LIB10-PARENTS, items 10-11), with sections 12-14 (D-LIB9-*, D-LIB5-TEMPO8, D-LIB9-F5). Plan:
`claude/howto-options` @ `4a9fd86`. Research: cards read at `claude/libht-research` @ `0393aac`; Do 6 copies the head the
supervisor names (LR-31 and LR-33 applied). Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`. Pilot A code is
read and copied from #109 @ `e6f39ff` (D-LIB8FIX-CARRY), never imported or merged.

Nothing here ships (D-LIB10-AHEAD): every LB2 row stays at stage `drawing` or `review` in `lb2/rows.json`, outside
`batches/`; `tests/howto/lb2-plates.test.ts` A9 enforces it.

## 1. Engine, modes and the T rule

- **Engine.** Every LB2 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE).
  Specs and templates copy pilot A code; they never import a pilot A spec (D-LIB9-CLONE; A3 tests it).
- **T rule (Do 1, plan 3.1:236).** A child is T only if it differs from its template parent only through derive.mjs
  PARAMS keys (:4-12) and the D-LIB10-FACTS schema. Anything else makes it H.
- **Result (proposed):** P2 T4 H6 for LB2's 12 (D-LIB10-DECLINE with arnold_press H). Drawn here: 3 T (BENCH), 4 H.

## 2. Per id

Anchors: the 8 = golden A, `tests/howto/golden/GOLDEN.json` `ref bc0f378`; pilot A = `e6f39ff` (16 approvals,
D-PILOTA-R5; carried only where FX8 holds, D-LIB8FIX-CARRY). View: side for all 7 (card `plate.view` = census `view`), so
F6 is never expected. Census closest: machine_chest_press (bc0f378) for all but dumbbell_pullover (lat_pulldown, bc0f378);
machine_chest_press is excluded as a hidden anchor (D-CRITIC-CAL2), so it is never the drawing source.

| id | mode and reason | template parent / clone source (approving sha) | composer / primitives | hand zoom: pair key |
|---|---|---|---|---|
| barbell_bench_press | T (BENCH). Differs from dumbbell_bench_press through `load.primitive` barbell and `bar.kind` straight; rack, safeties and the bottom rule follow from them in the template (3); callouts, tells, tempo, cue, alt and the Mistake (`hipsLift`) are facts | dumbbell_bench_press (e6f39ff) | safetyArms (+hookY) and vendor rackUpright, vendor barbell | `bar-low-palm`: no LIB-7 key yet |
| incline_barbell_bench_press | T (BENCH). As above plus `bench.angle` 30 (c1); the incline rig comes from incline_dumbbell_press, the pinned incline anchor (plan 3.1:243-244) | dumbbell_bench_press (e6f39ff); incline branch from incline_dumbbell_press (e6f39ff) | inclineBench (pilot A, read only), safetyArms, barbell | `bar-low-palm`: no key yet |
| close_grip_bench_press | T (BENCH) if Q1 (a) is ruled; else H. As barbell_bench_press plus `grip.width` (c1: hands in line with the shoulders). Mistake builder `elbowFlareHigh` | dumbbell_bench_press (e6f39ff) | safetyArms, barbell | `bar-low-palm`: no key yet |
| decline_bench_press | H (D-LIB10-DECLINE). New pose class (declined) and rig; 'decline' is not a BENCH value until its plate is pinned | dumbbell_bench_press's supine code (e6f39ff), copied | **declineBench** (new, single use), vendor barbell | `bar-low-palm`: no key yet |
| arnold_press | H (proposed; Q6). Its start (dumbbells in front of the chest, palms facing you, c1) and the palm turn are not PARAMS keys (derive.mjs:4-12) nor facts; SEATPRESS is not built (D-LIB10-TEMPLATES) | dumbbell_shoulder_press (e6f39ff), copied | inclineBench (pilot A, read only), vendor dumbbell | `arnold-palm-turn`: no key yet |
| skull_crusher | H (own parent). New joint action (elbow only, census `N`) | dumbbell_bench_press's supine code (e6f39ff), copied | vendor bench, vendor barbell end-on as the EZ bar (Q3) | `wrist-neutral-ez`: `ez/push` (LIB-7 @ 55e91e9, parked, D-LIB7-19a) |
| dumbbell_pullover | H (own parent). New joint action (shoulder extension, census `N`) | dumbbell_bench_press's supine code (e6f39ff), copied | vendor bench, vendor dumbbell held vertically | `cupped-dumbbell`: no key yet |

Not drawn here (D-LIB10-PA): dumbbell_bench_press (P:BENCH), dumbbell_shoulder_press (P:SEATPRESS), incline_dumbbell_press
(T mark; stays as pinned), barbell_overhead_press (H; redFlags back) are reused unchanged, with no row here. dumbbell_fly
stays held (pilot A `held`, D-LIB8-fly) and is in no LB2 file. As an option, the T slice may show that BENCH's incline
branch rebuilds incline_dumbbell_press byte for byte (D-LIB10-PA).

No hand block is built. Six cards have a hand zoom with no LIB-7 key: the four barbell ones (`bar-low-palm`),
arnold_press (`arnold-palm-turn`) and dumbbell_pullover (`cupped-dumbbell`); the LIB-7 fixer proposes them.

## 3. Templates (BENCH now; SEATPRESS not built)

- **BENCH** (`templates/BENCH.mjs`, after pilot A is on main, D-LIB10-TEMPLATES). `make(params, facts)` copies
  dumbbell_bench_press's code (D-LIB9-CLONE (a)-(c)); its dumbbell path is the parent's code unchanged, so the byte proof
  `make(parentParams, parentFacts)` = the parent's 9 pinned fragments, rebuilt alone. Never edit the parent to pass.
- **PARAMS keys and proposed ranges** (D-LIB10-RANGES: the supervisor's ruling quotes the family row; LIB-10 never edits
  `qa/param-ranges.json`):
  - `load.primitive`: [dumbbell, barbell]. Basis: dumbbell_bench_press (pinned, dumbbell); barbell_overhead_press
    (pinned, barbell).
  - `bar.kind`: [straight]. Basis: barbell_overhead_press (pinned straight bar).
  - `bench.angle`: [0, 45]. Basis: dumbbell_bench_press (pinned, 0); incline_dumbbell_press (pinned, 45). 'decline'
    (negative) waits for decline_bench_press's pin (D-LIB10-DECLINE).
  - `grip.width`: [0.454, 0.84] m only if Q1 (a) is ruled. Basis: the body model's shoulder-joint width (0.454) with
    close_grip_bench_press c1; dumbbell_bench_press's bottom grips (2 x 0.42, pinned).
- **Per T child, the claim on its own card that states each param** (D-LIB10-RANGES item 3; the verifier checks it):
  - barbell_bench_press: `load.primitive` barbell, `bar.kind` straight: plate.equipment ("barbell"), c6.
  - incline_barbell_bench_press: the same, plus `bench.angle` 30: c1 ("30 degrees").
  - close_grip_bench_press: the same as barbell_bench_press, plus `grip.width` 0.454: c1 ("hands in line with the
    shoulders"), read on the body model (Q1 (a)).
  T rows take their params and claims in rows.json at the T slice; the rows carry mode, parent and template now.
- **The barbell bottom rule (in the template, not a fact).** The bar rests on the drawn chest, the forearm is vertical in
  the side view and the upper arm has its full length; the touch point on the chest then follows from the grip width and
  the bench angle. A test reads each child's touch on the drawn chest against its card (mid-chest c2/c8; low chest where
  the ribs end c4; upper chest c7). If a child's card fact does not come out of the rule within ±1 cm, that child is H.
- **Facts schema (D-LIB10-FACTS), closed, unknown keys throw:** `callouts` [{key, text, landmark, box?, cue}],
  `tells` [{key, text, landmark, box?, cue}], `cue`, `tempo` (from the verified card), `alt`, `mistakeAlt`,
  `mistake` {builder: `hipsLift` | `archOffPad` | `elbowFlareHigh`, with its named magnitudes: `lift` (m) for hipsLift,
  `arch` (m) for archOffPad, `flare` (deg) and `high` (m) for elbowFlareHigh}. Never poses, equipment, camera, trace,
  measure, checks, datum, ghosts or view. The incline measure arc is drawn by the template whenever `bench.angle` > 0.
- **Byte-proof plan (A7):** a test builds `make(parentParams, parentFacts)` alone through the plates page and compares
  its 9 fragments with pilot A's pinned entry on main; mutations: one byte of a template constant, a facts key outside
  the schema (throws), one parent fragment changed in memory.
- **SEATPRESS:** not built here (arnold_press H, Q6); it waits for its first T child in a later batch.

## 4. Composers (Do 4)

- `declineBench` (new, single use; anchor decline_bench_press): the declined pad and frame, the leg post and foot rollers
  (c1), the rack upright with a J-hook (c1, c7), one safety arm (c6). All static; reads no file; PRIMITIVES only
  (backPad via sideBar, box, kneePad, rackUpright). Its sizes are assumptions, listed in its header and in the spec's
  "Unsourced numbers".
- **Barbell rack (BENCH children):** pilot A's approved `safetyArms` (anchor barbell_overhead_press) with `hookY`, and
  the vendor `rackUpright`: no new composer, no new anchor (Do 1). Safety pins slightly below the bottom bar (BB c6).
- **EZ bar:** no composer (Q3).
No other composer is proposed, so Do 4's "other composers" step has nothing to wait for.

## 5. Expected flags

- **F5 on all 7** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly 3.57 only.
- **F7: none** at `0393aac` (all 7 cards are `drawable: true`). If LR-31 makes a card drawable:false, F7 is expected on
  it and the note is re-posted.
- No other flag is planned; any other raised flag is a defect to fix. Coverage (F2) and the longest leader (F3) are
  measured at Do 8; the decline's 'Lower-chest touch' leader is the one to watch.

## 6. R10 items (safety drawn)

- barbell_bench_press, close_grip_bench_press: J-hooks; safety pins slightly below the bottom (BB c6; close-grip
  inherits parent c6); bar path from over the shoulders to the chest, never over the neck.
- incline_barbell_bench_press: J-hooks and safety catches (c6); upper-chest touch, clear of the neck.
- decline_bench_press: J-hook on the rack behind the lifter (c1, c7); safety arms at the sides (c6); lower-chest touch
  (c5), never toward the neck (the Mistake shows the high touch).
- skull_crusher: no rack (card: none); the end bar stops just above the forehead (c5). Spotter (c16) is copy only.
- arnold_press, dumbbell_pullover: no rack (dumbbells).

## 7. Tempo map (for the supervisor to rule; Q3 and 14.7)

Rule (D-LIB9-CARDFIELDS, LR-33): the concentric phase takes `up`, the eccentric `down`, and `Hold` takes `pause` right
after the concentric, only if pause > 0. No Rest. No constant without a quote that states its seconds.

| id | card up/down/pause (claim) | drawn start | phase array |
|---|---|---|---|
| barbell_bench_press | 1/2/0 (c17) | top | Lower 2, Press 1 |
| incline_barbell_bench_press | 1/2/0 (c14) | top | Lower 2, Press 1 |
| close_grip_bench_press | 1/2/0 (c9) | top | Lower 2, Press 1 |
| decline_bench_press | 1/2/1 (c8) | top | waits for LR-33 (Q5) |
| arnold_press | 1/2/0 (c12) | bottom | Press 1, Lower 2 |
| skull_crusher | 1/2/0 (c13) | top | Lower 2, Extend 1 |
| dumbbell_pullover | 1/2/0 (c18) | top (arms over the chest) | Lower 2, Pull 1 |

- **decline_bench_press (Q5).** c8's quote puts the pause at the bottom: "a count of two on the downward movement. Pause
  for a count of one. A count of one on the upward movement." If LR-33 keeps it there, the proposal is a constant with
  that quote (14.7, as leg_press's bottom Pause): Lower 2, Pause 1, Press 1. If LR-33 moves it after the concentric:
  Lower 2, Press 1, Hold 1. Not drawn until the research head is named.
- **Pose map:** none. Every drawn start equals the card's plate.start (top for the presses, the skull crusher and the
  pullover; the bottom for arnold_press, whose card starts there).

## 8. Fault→key map (13 Q1(a); for the supervisor to rule; re-proposed after LR-31)

| id | plate.mistake (claim) | first tell key |
|---|---|---|
| barbell_bench_press | hips lifting off the bench (c10) | `hips` |
| incline_barbell_bench_press | low back arching away from the pad (c9) | `arch` |
| close_grip_bench_press | elbows drifting from the ribs, bar landing high (c2) | `flare` |
| decline_bench_press | bar landing high on the chest, toward the neck (c5) | `high` |
| arnold_press | back arching away from the pad (c3) | `arch` |
| skull_crusher | upper arms drifting back toward the head (c7) | `drift` |
| dumbbell_pullover | elbows bending a lot (c7) | `bend` |

No Mistake is drawn until LR-31 is applied on a named research head (card build_prerequisites).

## 9. H slice (Do 2 a): what is drawn now

- **decline_bench_press:** `declined()` (the anchor's supine solve on a 15° pad; trunk -3.6°, neck -1.9°); hooked legs
  (hip 30°, knee 100°, ankle -25°) with the rollers on the ankle fronts; start: locked arms, bar over the shoulder
  joints (copied top reach); end: the bar's underside on the lower chest (thorax height 0.685 H; 13 cm footward of the
  shoulder, between the chest landmark and the navel); rack bar over the brow, J-hook where the elbows are still 25°
  bent (c7); safety arm 3 cm under the bar at the touch. No Mistake, no tempo yet.
- **skull_crusher:** supine on a flat bench, the pad ending 2 cm past the crown (c10); the elbow straight over the
  shoulder joint in every pose (upper arm vertical within 2° at t = 0..1, c5); 6 via keys so the bar's trace and the
  ghosts follow the arc round the elbow; end: grip centre 5 cm over the brow (elbow 119°); EZ bar end-on with 30 cm
  plates. Tempo Lower 2, Extend 1 (proposed, 7). No Mistake yet.
- The two-build plates-page sha256 needs the cards on the branch: build-page.mjs refuses a row with no sources
  (build-page.mjs:88), and the sources come from the card. It is posted with Do 6's copy. The slice renders were made
  with the `0393aac` card sources in a scratch page (not committed).

## 10. Unsourced numbers (13.3 must-fix 14)

Each spec header lists its own. decline_bench_press: PAD_Y 0.60, HIP_FLEX 30, KNEE_FLEX 100, ANKLE -25, ROLLER_R 0.055,
the rack over the brow, RACK_ELBOW 25, SAFETY_BELOW 0.03, GRIP_X 0.30, LOW_CHEST 0.685 H, PLATE_D 0.45, the declineBench
sizes. skull_crusher: BENCH_TOP and FOOT_Z (the anchor's), HEAD_END 0.02, GRIP_X 0.16, TOP_ELBOW 4, FOREHEAD_GAP 0.05,
EZ_PLATE_D 0.30. The BENCH barbell default grip width (Q1) is a template constant listed in the template header.

## 11. Work split (if a second drawer joins, `claude/lib-10-lb2-b`)

- Family BENCH (this branch): BENCH, barbell_bench_press, incline_barbell_bench_press, close_grip_bench_press, and the
  H slice (decline_bench_press, skull_crusher).
- Family H (second drawer): arnold_press, dumbbell_pullover, spec files only.
- rows.json, build.mjs, qa.mjs, tempo.json, cards.sha.json and the tests stay here; the second drawer is merged in with
  a merge commit.

## 12. Risks and mitigations

- **BENCH children may not be T** (Q1): the bottom rule might not land a card's touch point within ±1 cm. Mitigation:
  a drawn-item test per child; a miss makes it H (+2.5 Opus-hours each [est]).
- **Pilot A's merge is late:** templates and T children wait; the H plates, declineBench and the cards go ahead.
- **LR-31 changes a Mistake:** that plate's Mistake is re-planned and its fault→key entry re-proposed.
- **The EZ bar reads as a plain barbell side-on** (Q3): its camber is frontal. R2 judges it.
- **Decline legs** (no card number for the leg angles): the critic may judge the hooked legs; all angles are listed as
  unsourced and can change without touching a card fact.
- **D-LIB-SCRATCHIDS:** no scratch fixture targets an LB2 id; none is run here.
- **Gate blocks name lib_barbell_bench_press** (17 lines) and three reused ids: whether a How-to button moves pixels is
  for the ship card [unverified].

## 13. Questions for the supervisor

1. **Q1 (BENCH T rule).** (a) May a T child's param value be the body-model reading of a relational claim
   (close_grip_bench_press c1 "hands in line with the shoulders" → grip.width 0.454 m), checked by the verifier as that
   computation? Recommended: yes, else close_grip is H. (b) barbell_bench_press and incline_barbell_bench_press give no
   grip number ("slightly wider than shoulder-width"), so they take no `grip.width` param and use one template barbell
   default, listed as unsourced. (c) The barbell bottom rule (3) lives in the template; each child's touch point is a
   test outcome, never an input.
2. **Q2 (rack).** BENCH barbell children use pilot A's safetyArms (+hookY) and the vendor rackUpright: no new composer.
3. **Q3 (EZ bar).** The vendor barbell end-on with 30 cm plates (the 45 cm plate ringed the head; unsourced), no
   composer.
4. **Q4 (skull_crusher start).** Upper arms vertical (c5, a checkpoint) puts the start bar over the shoulder joints,
   12.3 cm footward of the chin; c2 says "above the face". Recommended: c5 governs the drawing.
5. **Q5 (decline tempo).** Section 7, after LR-33.
6. **Q6 (arnold_press).** H, so SEATPRESS is not built in LB2.
7. **Q7 (decline rack).** The racked bar over the brow ("the rack slightly behind you", c1); the upright crosses the head
   in side view because the uprights stand at the bench's sides.
