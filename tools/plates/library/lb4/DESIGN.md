# LB4 plates: design note (LIB-14)

Card: `docs/supervisor/verify/lib-14-card.md` on `claude/sup-lib4-cards` @ `9d24e30c` (Do 1), with its D-LIB14-*
rulings and lib4-cards sections 12-31. Plan: `claude/howto-options` @ `b41ac833`. Research: the LB4 research head
`3812989f59c000705731f7944d7a1a275e86045d` on `claude/libht-research` (LR-29 VALID on all 14,
`lb4-research-verify.md`); the 6 cards and quotes are byte copies from it (`lb4/cards.sha.json`). Census:
`docs/howto/library/inputs/census.json` @ `4a9fd86`. Pilot A code is read and copied from #109 @ `ff7c5c4f`, never
imported or merged; LB3 patterns from #274 @ `a6f4bd07`. Base: main `5158609c` (LIB-7 #193).

Nothing here ships (D-LIB14-AHEAD): every LB4 row stays at stage `drawing` or `review` in `lb4/rows.json`, outside
`batches/`; `tests/howto/lb4-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids (A5). Until the
no-seconds strip landed (D-LIB14-NOSECS) it was wall_sit alone. LIB-STRIP (#309) is on main `bec24ebd` and merged in
('LIB-14 resume'), so rows.json holds front_squat, goblet_squat, bodyweight_squat, wall_sit and pistol_squat; step_up
is drawn, unit-tested and still held under D-LIB14-STEPUP (section 13).

## 1. Engine and modes

- **Engine.** Every LB4 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE).
  Specs copy code from the 8 (`tools/plates/vendor/exercises/barbell_back_squat.mjs` on main) or pilot A; they never
  import a vendor or pilot A spec (D-LIB9-CLONE; A3 tests it). Every copied root finder throws on a bracket with no
  root; each bracket is re-derived and its solved value recorded in the spec header.
- **Modes (D-LIB14-MODES): all six are H; no D row.** The plan's marks for these six were D3 (front_squat,
  goblet_squat, bodyweight_squat) H3 (wall_sit, step_up, pistol_squat). A D spec is the parent with only PARAMS paths
  set (derive.mjs:4-12, :39-45 on `5158609c`), and of those the vendor engine reads only `spec.camera`
  (vendor/engine/plate.mjs:81-95). What each id needs outside PARAMS:

| id | plan | outside PARAMS (each alone makes it H; plan 3.1:272) |
|---|---|---|
| front_squat | D | tempo: the parent's Lower 2 / Drive up 1 / Brace 1 (barbell_back_squat.mjs:126) is not on the card (c21: up, down, pause null), and H6 compares tempo exactly (qa/node.mjs:176). Mistake: the parent's tells lead with `hips` (:134-136); the card's fault is the elbows dropping (c7). Start pose: the bar in the front rack (c2, c4, c7), not on the upper back. Equipment: the rack upright and safety bars (c14). |
| goblet_squat | D | tempo (g7: null). Mistake: torso lean with the weight drifting off the chest (g6). Start pose: the dumbbell upright at the chest, elbows by the ribs (g2); no bar. Equipment: one dumbbell, upright (the vendor `dumbbell` with its `axis` option). |
| bodyweight_squat | D | tempo (b7: null). Mistake: heels lift (b4). Start pose: hands by the sides (b1), no bar; end: shin and torso parallel (b6). Equipment: floor only. |
| wall_sit | H | hold convention, the `wall` composer, its own tempo (one Hold row, w6). |
| step_up | H | split/single-leg pose class, box, two dumbbells. |
| pistol_squat | H | single-leg pose class, drawable-false Mistake (F7). |

  Cost about +2.5 Opus-hours each for the three planned D rows [est]. LB4's marks become D0 P1 T5 H8 (supervisor docs
  action). Nothing is loosened: an H plate runs every check (D-LIB10-DECLINE).
- **D test (Do 3).** No id here could meet it: each of the three planned D ids needs a tempo the parent does not have
  and a Mistake the parent does not draw. No reason found to post for a D row.

## 2. Per id

Anchor heads: the 8's barbell_back_squat (main, golden A); pilot A at `ff7c5c4f` with the owner's "Pilot a ok"
(#109 6266791221, 10-19 12:10) for single_leg_romanian_deadlift, plank and dumbbell_biceps_curl; box_jump and
reverse_lunge held. View: side for all 6 (card `plate.view` = census `view`), so F6 is never expected.

| id | tier | mode | clone source (head) / census closest | composer / primitives | hand zoom: key | view |
|---|---|---|---|---|---|---|
| front_squat | A | H | barbell_back_squat (main `5158609c`) / barbell_back_squat | vendor barbell, rackUpright (upright + safety bar), floor | `front-rack`: in GAPS on #191 (`8bea5afc`, hands/hand-front-rack.mjs:26-29); none built | side |
| goblet_squat | A | H | barbell_back_squat (main) + dumbbell_biceps_curl's dumbbell use (`ff7c5c4f`) / barbell_back_squat | vendor dumbbell (`axis` upright), floor | `cupped`: in GAPS on #191 (hands/hand-cupped.mjs:25-29); none built | side |
| bodyweight_squat | C | H | barbell_back_squat (main) / barbell_back_squat | floor | none (archetype none, hands/census-scope.json:140) | side |
| wall_sit | C | H | bodyweight_squat's leg solve (this branch) and plank's hold convention (`ff7c5c4f`) / barbell_back_squat | **wall** (new, Do 4), floor | none (census-scope.json:145) | side |
| step_up | B | H | single_leg_romanian_deadlift's balance solve (`ff7c5c4f`) and barbell_back_squat's plant / barbell_back_squat | vendor box, dumbbell ×2 drawn as one (near hand), floor | `hold`: no key yet (census-scope.json:98) | side |
| pistol_squat | A | H | single_leg_romanian_deadlift's balance solve (`ff7c5c4f`) / barbell_back_squat | floor | none (census-scope.json:144) | side |

The 8 ids not drawn here and their blocks:

| id | block |
|---|---|
| box_jump | pilot A plate, held (D-LIB8M-NOSTRIP, lib4-cards :3305-3311); card changed by D-SUP-LB4-PACOPY |
| reverse_lunge | pilot A plate, held (D-LIB8M-NOSTRIP); pick now the flared ribcage (F-LB4-1), redrawn at re-approval (D-SUP-LB4-REVLUNGE) |
| bulgarian_split_squat, walking_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat | SPLIT template children: the byte proof needs reverse_lunge pinned (D-LIB10-TEMPLATES, lib4-cards :3161-3164) |
| jump_squat | airborne convention open until the no-seconds strip exists (lib4-cards :3310); anchor box_jump held |

## 3. Templates

None. No family is proposed T here (the SPLIT children are not on this card).

## 4. Composer (Do 4)

- **wall** (`eq/wall.mjs`; user and anchor wall_sit; later user wall_ball, LB10, census batch B28; plan 2.1:139). A
  plain wall seen side-on: one filled vertical slab whose face is the plane the back rests on, standing on the floor
  line. Built in LB3's romanChair pattern: `(lm, ctx) => item[]`, PRIMITIVES types only (`eq/parts.mjs` `sideBar`,
  i.e. a `backPad` in its surface form), no file reads. Options: `face` (the world z of the wall face; the slab
  extends behind it), `h` (height), `t` (thickness), `y0` (bottom, default the floor). The wall is static in every
  pose, so it needs no `poly` twin (PQ-H9; plan 2.1:126-128). Its assumed sizes (height 1.9 m, thickness 12 cm) go
  under "Unsourced numbers" in wall_sit's header (no card claim gives them).
- A per-pose drawn-item test on the real spec (13.1): the face at one fixed x (±1 px) in entry, held and Mistake
  (A2).
- **Anchor order:** the composer is approved on wall_sit before any other user (A1). wall_ball is not on this card.
- No other composer is proposed. The rack upright is the vendor `rackUpright` (its `hook` for the safety bar); the
  box and dumbbell are vendor primitives (equipment.mjs:30, :301). If the vendor dumbbell's `axis` cannot draw the
  upright goblet dumbbell, that is reported, and a composer only by ruling (risk 7).

## 5. Pose-class and convention anchors (depends_on)

| id | squat (barbell_back_squat, the 8) | single leg (single_leg_romanian_deadlift, pilot A) | split (reverse_lunge, pilot A, held) | dumbbell (dumbbell_biceps_curl, pilot A) | hold (plank, pilot A) | wall pose class + `wall` composer | drawable fault (dumbbell_biceps_curl; LB3 one_arm_dumbbell_row) |
|---|---|---|---|---|---|---|---|
| front_squat | yes | | | | | | |
| goblet_squat | yes | | | yes | | | |
| bodyweight_squat | yes | | | | | | |
| wall_sit | yes | | | | yes | **anchor** | |
| step_up | yes | yes | **yes: held** (D-LIB14-STEPUP) | yes | | | |
| pistol_squat | yes | yes | | | | | yes (F7) |

- **step_up's split-anchor gap (D-LIB14-STEPUP).** Census poses ['split', 'single'] put step_up in the split class
  (anchor reverse_lunge, plan 2.2:155). reverse_lunge is held and will be redrawn to its new pick. step_up is drawn
  now and held with the NOSECS rows; it goes on a sheet only after reverse_lunge is redrawn, owner-approved and
  pinned; otherwise it rolls (plan 3.5:376). No other split anchor is substituted.
- None of the six goes on a sheet before pilot A's yes is on main (depends_on).

## 6. Expected flags

- **F5 on every plate** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly
  3.57 only.
- **F7 on pistol_squat** (D-LIB14-PISTOL): drawable false. The top fault, bouncing out of the bottom
  (handlingMistakes[0], p8), is seen only as speed; the plate draws the heel lift (p8, the next listed fault the side
  view shows; the knee cave needs a front view). Spec `pilot: { drawableFault: '...' }`. topFault `bounce` ≠ the drawn
  key `heel`, so F7 stays raised and needs the owner's named yes on the LB4 sheet.
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault'. Expected (Do 2).
- No other flag is planned. F2 (coverage) is the one to watch on wall_sit: the wall slab adds ink beside the figure
  [unverified until drawn]. Any other raised flag is posted with its value and range and ruled before READY.

## 7. R10 items (tier A: front_squat, goblet_squat, pistol_squat)

| id | R10 items drawn in the right pose (claims) |
|---|---|
| front_squat | rack upright with the safety bar just below the bottom bar height (c14); bar on the shoulders, not held up by the hands (c3); elbows high at the start and the bottom (c4, c7); whole foot down, heels on the floor (c10, c12) |
| goblet_squat | dumbbell upright against the chest at the start and the bottom (g1, g5); elbows close to the ribs (g2); chest up (g4, g8); heels on the floor |
| pistol_squat | free leg straight and off the floor in every pose (p2, p5); standing foot flat at the bottom (p3); arms forward for balance (p1) |

Each item has one drawn-item test (A15), and the test counts them against this table.

## 8. Tempo map (for the supervisor to rule; 13 Q3, 14.7, D-LIB8M-TEMPO)

Rule: the concentric takes `up`, the eccentric `down`; `Hold` takes `pause` right after the concentric only if
pause > 0; any other static phase is a constant only with a quote that states its seconds; a range is the quote's
string. No Rest.

| id | card up/down/pause (claim) | static phase with quoted seconds | phase array |
|---|---|---|---|
| wall_sit | null/null/null (w6) | Hold: w6 "2-5 sets of 30-60-second holds" (cat-wallsit, Programming) | `[{ phase: 'Hold', s: '30-60' }]` |
| front_squat, goblet_squat, bodyweight_squat, step_up, pistol_squat | null/null/null (c21, g7, b7, c2, p8) | none | **no row** until D-LIB14-NOSECS's release; never seconds |

**Released ('LIB-14 resume', LIB-STRIP on main `bec24ebd`, D-STRIP-B).** A no-seconds card's tempo is
`tempoOf(rows)` from LIB-STRIP's verified `tools/plates/library/strip/rows.json` (its `cards`, or `fallbackA` under
D-STRIP-AFALL), never a row of `lb4/tempo.json`, which keeps wall_sit's timed Hold only. Card `tempo` and spec `tempo`
are byte-equal to it; no seconds are added.

| id | strip rows (claim, `says`) | card and spec tempo |
|---|---|---|
| front_squat | Lower: Controlled (c21, "Controlled descent"); Drive up: blank (c21) | `[{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true }]` |
| goblet_squat | Lower and Drive up: Controlled (g9, "Smooth and controlled") | `[{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true, word: 'Controlled' }]` |
| bodyweight_squat | fallbackA (D-STRIP-AFALL): both blank (b7) | `[{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }]` |
| pistol_squat | Lower and Drive up: Slow (p8, "Slow and controlled") | `[{ phase: 'Lower', move: true, word: 'Slow' }, { phase: 'Drive up', move: true, word: 'Slow' }]` |
| step_up | strip row exists (Rise blank; Lower: Controlled, c2) | **none**: still held under D-LIB14-STEPUP; listed in `tests/howto/fixtures/held-pairing.json` (D-PLATEFACTS-HELD) |

- wall_sit: one Hold row in the form of plank's (pilot-a/tempo.json:17 @ `ff7c5c4f`): `{ "phase": "Hold",
  "constant": "30-60", "claim": "w6", "quote": "<w6's quote>" }`. The constant is the quote's string byte for byte:
  an ASCII hyphen (0x2D), unlike plank's '10–60' (en dash). The spec tempo is `[{ phase: 'Hold', s: '30-60' }]`, as
  plank's `s: '10–60'`. No Set and no Rest phase: no quote gives their seconds (plan 1:81's "Set / Hold / Rest" read
  through D-LIB8M-TEMPO, as plank's was; the card's own text says "Rest length is not sourced"). w3's "usually 30-60
  seconds" agrees; w6 is the card's tempo claim.
- `lb4/tempo.json` will hold the rule, the research head, `constants` (wall_sit's Hold) and `ids` with wall_sit only.

## 9. Pose map (13 Q2 (b)) and fault→key map (13 Q1(a))

The engine draws the Mistake as the end pose plus an override (plate.mjs:78) and outlines what differs from the end
pose, so a fault the card places at its start needs the start drawn as the spec's `end` (Q2 (f)).

| id | spec `start` = card | spec `end` = card | why |
|---|---|---|---|
| front_squat, goblet_squat, bodyweight_squat, pistol_squat | plate.start | plate.end | identity: each fault is at the bottom (c7, g6, b4, p8) |
| wall_sit | plate.start (entry: standing, back and buttocks on the wall, w2, w5) | plate.end (the held pose, w2, w4) | identity: the hold convention (entry dashed, held solid; plank's). The Mistake (feet too close, knees past the toes, w8) is a held pose, drawn against the held pose |
| step_up | **plate.end** (standing tall on the box, c1) | **plate.start** (lead foot on the box, trail foot on the floor, c1, c6) | ruled (D-LIB14-STEPUP-POSE). The card's own words: plate.start "One whole foot on the box, the other on the floor (c1, c6)"; plate.end "Standing tall on the box on the lead leg (c1)"; the test pins both and the map. The fault, the trunk thrown forward to get up (c1), happens as the rise starts, so it is drawn against the start position. Trade-off: the drawn order (top → step position) reverses c4's "starts with the lifting part"; the Trace still runs between the two card poses. Alternative: identity, with the Mistake as a lurch drawn against the standing-tall end, which is not where c1 places it. **Q2 below.** |

A fact with no pose defaults to the spec's `end` (node.mjs h6), so every fact about the spec's start names pose
`start`. Do 6 b writes each fact's pose as this map's image of the pose its quote states. The phantom rule (Q2 (c))
applies wherever a start part is hidden: front_squat's start bar dot (as the 8's START_DOT) and goblet_squat's start
dumbbell if the end torso hides it.

Fault→key (13 Q1(a)); each spec's first tell carries the key:

| id | plate.mistake (claim) | drawable | first tell key (tells) | topFault |
|---|---|---|---|---|
| front_squat | elbows drop and the chest falls forward, the bar rolls off the shoulders (c7) | true | `elbows` (`chest`; the `bar` tell dropped at the slice look: the bar's drift is 2.8 cm) | `elbows` |
| goblet_squat | torso leans far forward, chest droops, weight drifts from the body (g6) | true | `lean` (`drift`) | `lean` |
| bodyweight_squat | heels lift at the bottom, weight rolls onto the toes (b4) | true | `heels` (`toes`) | `heels` |
| wall_sit | feet too close to the wall, knees past the toes (w8) | true | `feet` (`knees`) | `feet` |
| step_up | trunk thrown forward to get up (c1) | true | `lean` (`push`: the trail foot doing the work, c1 "minimal assistance from the other foot") | `lean` |
| pistol_squat | standing heel lifts at the bottom (p8) | **false** | `heel` (`knee`: the knee shoots forward over the toes as the heel rises) | `bounce` (handlingMistakes[0], "Bouncing out of the bottom", p8; ≠ `heel`) |

Tells are 2-3 visible signs of the one fault (Q-D5-4; D-LIB10-SKULL1). The cards' `plate.tells` (e.g. pistol's "Slow
down, no bounce", step_up's "Lower slowly, no drop") are cue lines about good form, not still signs of the drawn fault,
so the Mistake tells restate `plate.mistake.what` (as plank's and one_arm_dumbbell_row's).

## 10. Facts plan (D-LIB8M-FACTS, 22's scope; D-LIB13-FACTS2) and unsourced numbers

Every number and every contact a quote gives for a drawn pose (quotes read on the copied quotes files):

| id | number or contact in a start/end quote | proposed plateFacts | reason |
|---|---|---|---|
| wall_sit | w2 "90-degree angles at the hip and knee" (held) | `angle knee.r 90 end` (w2), `angle hip.r.flex 90 end` (w2) | engine knee flexion 90 = a 90° knee; hip flex is femur vs pelvis, 90 with the pelvis upright on the wall. Also the measure arc at the knee with `expect: 90` |
| wall_sit | w5 "back and buttocks remain in contact with the wall"; w4 "back flat against the wall" | `contact backUpper` and `contact buttock`, poses start (entry, w2/w5) and end (held, w4/w5) | spec `checks` planes on the wall face; 0 cm |
| wall_sit | w4 "knees directly above your ankles" | none as a fact (no fact kind measures a vertical alignment); a drawn-item test: knee.r z = ankle.r z ±1 cm in the held pose | 22 point 1: report, never invent a key. **Q3** |
| front_squat | c8 toes out 15-30° | none | a foot angle shows only from the front; no fact kind measures it. Drawn 20° toe-out (inside the range, the parent's value), unsourced as a drawn value |
| front_squat | c2 bar "touching the throat lightly"; c3 "the shoulders hold the bar" | `contact shoulderTop.r` at start and end: a `checks` plane through the bar's underside (bar radius + clothing) | the bar sits on the shoulders in both poses; 0 cm. **Q3** asks whether the throat touch is a second contact (`chin`/`neck` have no front-of-throat landmark; proposed: not a fact) |
| goblet_squat | g1/g2 dumbbell "at chest height", "in front of the chest"; g5 "at chest height for the whole rep" | `contact chest` at start and end: a `checks` plane on the dumbbell's back face | the dumbbell against the chest; 0 cm |
| bodyweight_squat | b6 "weight spread between the balls and heels" (end); b7 heels flat | `contact heel.r`, `contact ball.r`, pose end | the floor plane; 0 cm |
| step_up | c1/c6 "whole foot" on the box (card start = spec end) | `contact heel.r`, `contact ball.r` on the box top, pose end (card start); and pose start (card end, standing on the box) | 0 cm |
| step_up | c11 "18-inch (45.7 cm) box" | none | the c11 quote (Simenz) does not state the height (only the claim text does), and the height is a study setup, not a form rule; never a fact without a measure callout and a ruling |
| pistol_squat | p3 "planted foot flat on the ground" (end) | `contact heel.l`, `contact ball.l` (stance foot), pose end | 0 cm |

Unsourced numbers (13.3 must-fix 14; each spec header lists its own): the wall's height (1.9 m) and thickness (12
cm); wall_sit's foot distance from the wall (follows from w4's knee-over-ankle at 90°), entry stance; the rack
upright height and the safety bar's offset below the bottom bar (5 cm; c14 says "just below"), the barbell plates (45
cm); front_squat's elbow height ("upper arms near level", c4/c7) and trunk angle at the bottom (not on the card); the
goblet dumbbell size (the vendor default) and the torso angle; bodyweight_squat's arm position in the descent (the
card's unsourced list); step_up's box height (45 cm drawn, a drawing value), box size, dumbbell size, trail-foot
spot; pistol_squat's torso angle at the bottom (card unsourced list), free-leg height, arm angle; every Mistake
magnitude (illustrative, never enlarged to pass a check: Q-D5-3).

**CARD FIELDS fix round (#289 6341470610).** front_squat gains `contact wrist.r` at start and end (c4: the hands
on the bar; the fingertip rack's wrist plane, checked per pose). c8's "toes out 15-30 degrees" is not a fact: the body
model reports no foot turn-out angle (the plant's toe direction is an input, not a reported joint angle, and the side
view cannot show it), the same rule as a contact with no landmark; the feet are drawn at 20 deg, inside the range.
goblet_squat drops `contact chest` (no quote says the weight touches the chest: g1/g5 "at chest height", g2 "in front
of the chest") and gains `contact wrist.r`, `wrist.l` at start (g1, both hands cupping the weight) and `heel.r`,
`ball.r` at end (g4, "push both feet into the floor"). bodyweight_squat's heel and ball cite b7 ("keeping the heels
flat on the floor"). step_up gains the trailing foot's heel.l and ball.l on the floor at spec `end` (card start, c1);
the hands-on-dumbbells fact from c5 is declined (c5 is the stance before the first step, which the plate draws in no
pose). **Re-verify tightenings (6342086947):** front_squat's end `wrist.r` fact is removed (c4 is a setup quote: it
states the start pose only); step_up gains `wrist.r`, `wrist.l` at spec `end` (card start; plate.start cites c5); a
quote naming a paired part in the plural states both sides, so goblet_squat (g4) and bodyweight_squat (b7) gain
`heel.l`, `ball.l` at end. Each new fact has its `checks` plane.

## 11. PQ-H3 estimates (before drawing; each [unverified until drawn])

deviationMin 11.39 px and traceLenMin 22.11 px (qa/envelope.json) at about 146 px/m:

| id | largest tell-anchor move, end → Mistake | Trace |
|---|---|---|
| front_squat | elbow drop ~0.15-0.2 m → ~22-29 px | the bar (grip) path, ~0.45 m → ~65 px |
| goblet_squat | sternum forward ~0.15 m → ~22 px | the dumbbell path, ~0.45 m |
| bodyweight_squat | heel lift ~3-4 cm → ~4-6 px at the heel; the knee forward with it ~6-8 cm → ~9-12 px. **At risk.** | hip path, ~0.45 m |
| wall_sit | feet ~15 cm nearer the wall: knee forward ~15 cm → ~22 px | hip, entry → held: ~0.45 m down → ~65 px |
| step_up | sternum forward ~0.25 m → ~37 px | hip path, ~0.5 m |
| pistol_squat | heel lift ~3-4 cm → ~5 px; knee forward ~6 cm → ~9 px. **At risk.** | hip path, ~0.55 m |

A too-small fault is reported with its card-true size, never enlarged (Q-D5-3); any zoom route is the supervisor's
ruling (as D-LIB13-SHRUG). The heel lift is drawn with the engine's plant (`ref: 'ball'`, the foot pitched about the
ball, vendor body.mjs:214-236), the knee following.

**Heel-lift convention (slice look item 1, #289 6341498444).** Pilot A's reverse_lunge.mjs:17-22 (#109 @ `ff7c5c4f`),
copied: the rigid foot is pitched heel-up about the ball and the ball lifted so the toe pad, the lowest outline point,
touches the floor (a drawn-item test holds it within 0.5 px; `toe.r` stays above the floor by check). Size: the cards
describe the onset of a lift (pistol p8 "may try and creep up"; bodyweight b4 "stop earlier if the heels start to
lift"), so the heel is drawn 3.5 cm up, this section's 3-4 cm midpoint, where it clears the floor line by about 5 px;
never sized to pass PQ-H3. pistol_squat measured node-side (qa/node.mjs `deviation`, not QA evidence): heel tell 10.2
px, knee tell 19.7 px (the weight moves over the ball, so the hips and knee travel forward), largest 19.7 px against
11.39. bodyweight_squat follows the same convention in the bulk; if its size is red it is held under D-LIB8-shrug with
the LIB-ZOOM route.

## 11a. Bulk record (LB4 BULK GO, #289 6341498444)

- **bodyweight_squat:** feet 26 cm apart, toes out 10°; the centre of mass solved over mid-foot; bottom: hip and knee
  centres level (b4), the thorax at the shin's angle (38.7°, fixed-point, b6), lumbar 5°; arms by the sides at the
  start (b1) and forward at the bottom (unsourced; hanging arms put the fists on the floor). Mistake (b4): both heels
  3.5 cm up on the toe-pad convention, the weight over the balls; node-side deviation: heel tell 10.1 px, toes (knee)
  tell 14.4 px (largest 14.4 against 11.39; QA after the strip release).
- **goblet_squat:** the vendor dumbbell upright, rigid with the thorax, its back face 0.5-0.6 cm in front of the chest
  (g1, g2, g5; no contact, per the CARD FIELDS fix); hands cupping the upper head's underside (wrist planes: the g1
  contact facts); elbows 136° and down by the ribs (g2), 44-56 cm apart against shoulders 45 cm. Bottom: hip 2 cm below
  the knee (g4), thorax 28°; the centre of mass with a 0.2 body-mass dumbbell over mid-foot. Mistake (g6): thorax 50°
  with the hips held, the dumbbell 12 cm further off the chest; upper body and dumbbell traced dashed.
- **step_up:** 45 cm box (box_jump's precedent; c11's 45.7 cm is in no quote), 128 px/m so the top pose fits. Step
  position: lead knee 105°, trail knee 10°, trail foot 50 cm behind; top: lead knee 5°, trailing foot lifted 1.4 cm
  clear of the box, the centre of mass with the dumbbells over the lead mid-foot. Mistake (c1): thorax 40° with the
  hips held (the sternum 23 cm forward), and the trailing heel 3.5 cm up on its toe pad (the push).

## 12. H slice (Do 2; D-LIB14-SLICE)

wall_sit with eq/wall.mjs, pistol_squat, front_squat. Posted as 'LB4 SLICE READY @ <sha>' with 390 px renders in Paper
and Silent Black beside barbell_back_squat, and pilot A's single_leg_romanian_deadlift (beside pistol_squat) and plank
(beside wall_sit) from a temporary worktree of #109 @ `ff7c5c4f`; the unit tests; the two-build plates-page sha256 and
the Do 8 QA table for wall_sit (the only row). pistol_squat and front_squat: renders from the in-memory held page and
drawn-item tests only. A9 and every mutation red then restored.

## 13. Held ids (D-LIB14-NOSECS, D-LIB14-STEPUP)

| id | held under | release condition |
|---|---|---|
| step_up | D-LIB14-NOSECS and D-LIB14-STEPUP | NOSECS is released (LIB-STRIP on main `bec24ebd`), but reverse_lunge is still held on main (pilot-a/plates.json: "held": the strip follow-up; not redrawn or pinned), so step_up stays held and rolls (plan 3.5:376) |

Released on 'LIB-14 resume' (main `bec24ebd`): front_squat, goblet_squat, bodyweight_squat and pistol_squat (section 8's
released table). They are in rows.json, on the plates page, through QA and to the critic.

Held specs build, carry no `tempo`, pass their drawn-item tests, and are in no rows file and on no committed or QA'd
page (A8).

## 14. Risks and mitigations

1. Heel-lift Mistakes below deviationMin (bodyweight_squat, pistol_squat): report the card-true size; supervisor rules.
2. wall_sit's back does not stay on the wall as the hips descend [unverified until drawn]: the root and pelvis tilt
   are solved so backUpper and buttock sit on the face (`checks`); A2 tests it.
3. front_squat elbows high: the engine arm with the bar on the shoulders needs the hands at the bar with high
   elbows; if IK cannot place the hand on the bar with upper arms near level, a fingertip-rack hand (c3, c5) is drawn
   and reported.
4. pistol_squat balance: the free leg forward and the hips back must keep the centre of mass over the stance foot;
   the root is SOLVED as single_leg_romanian_deadlift's (Winter masses). If no card-true pose balances, report.
5. Collisions on pistol_squat: the free leg straight forward at the bottom may cross the floor line; the bottom
   depth (hamstring on calf, p3) is limited so the free heel stays above the floor (`checks`).
6. step_up's split anchor stays held at sheet time: step_up rolls.
7. The vendor dumbbell's `axis` draws the goblet dumbbell end-on or as a bar: reported; composer only by ruling.
8. A later research head changes an LB4 card: the note follows it; the verifier and QA re-run for that card.
9. A shared COACHING-DECISIONS append conflict: keep both sides.

## 15. Questions for the supervisor

Ruled on #289 (6338977366, 2026-10-22): Q1-Q4 accepted as proposed: D-LIB14-TEMPO (with the en-dash mutation),
D-LIB14-STEPUP-POSE (each pose matches the card's words, pinned by a test), D-LIB14-FACTS (each fact with its claim id;
front_squat's shoulder-top contact cites c3, "a shelf for the bar to sit in"; goblet_squat's chest contact g1 at the
start and g5 at the end; bodyweight_squat b6; step_up c6 on the card's start and c1 on its end; pistol_squat p3),
D-LIB14-FAULTKEY. A heel lift that cannot pass PQ-H3 card-true is posted with its measurements before any workaround.


- **Q1 (tempo map, section 8):** wall_sit's single Hold row `'30-60'` (w6, ASCII hyphen) and no row for the five.
- **Q2 (pose map, section 9):** step_up drawn top → step position (swap), so the trunk lurch reads against the card's
  start; or identity.
- **Q3 (facts, section 10):** wall_sit's two angle facts and four contact facts; front_squat's shoulder contact only
  (not the throat); goblet_squat's chest contact; the knee-over-ankle alignment as a drawn-item test, not a fact.
- **Q4 (fault→key, section 9):** the keys above, pistol_squat's topFault `bounce`.
