# LB3 plates: design note (LIB-13)

Card: `docs/supervisor/verify/lib-13-card.md` @ `5144ecc6` (Do 1), with its D-LIB13-* rulings and lib4-cards sections
12-24 @ `5144ecc6`. Plan: `claude/howto-options` @ `a5e87d9e`. Research: the LB3 research head
`2dd60ae0349b06a4aac88a11347edac5536f8424` (the merge of #272 into `claude/libht-research`, posted on #272, comment
6264368447); the 8 cards and quotes are byte copies from it (`lb3/cards.sha.json`). Census:
`docs/howto/library/inputs/census.json` @ `4a9fd86`. Pilot A code is read and copied from #109 @ `48d49bb`, never
imported or merged; LB2 patterns from #265 @ `2dcbac1`. Base: main `565ea5a4` (train 30).

Nothing here ships (D-LIB13-AHEAD): every LB3 row stays at stage `drawing` or `review` in `lb3/rows.json`, outside
`batches/`; `tests/howto/lb3-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids (A5), so it grows
as each plate is drawn.

## 1. Engine, modes and the T rule

- **Engine.** Every LB3 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE).
  Specs copy pilot A code; they never import a pilot A spec (D-LIB9-CLONE; A3 tests it). Every copied root finder
  throws on a bracket with no root, and each bracket is re-derived and its solved value recorded in the spec header.
- **T rule (Do 1; plan 3.1:236-248).** A child is T only if it differs from its template parent only through
  derive.mjs PARAMS keys (`camera.maxScale`, `grip.width`, `bar.kind`, `bench.angle`, `load.primitive`, `handedness`,
  `stance.width`; derive.mjs:4-12 on `565ea5a4`) and the D-LIB10-FACTS schema (callouts, tells, cue, tempo, alt,
  mistakeAlt, and a Mistake from the template's fault builders; never poses, equipment, camera, trace, measure,
  checks, datum or ghosts). A template is built only if at least 3 members, parent included, pass (plan 3.1:240).
- **Result: P3 T0 H5 for LB3's 13 non-shrug ids (8 drawn + 5 pinned-or-held pilot A); neither HROW nor HINGE is
  built.** Plan 6.2 expects P3 T7 H5 for all 15; the changes, each named:
  - HROW (barbell_row parent; plan size 4): pendlay_row is H (ruling 4: the floor start and the dead stop are no
    PARAMS key, and a pose is never a fact). t_bar_row and landmine_row are H: the landmine rig is in neither
    `load.primitive` nor `bar.kind` (derive.mjs:7-9), and a rig with its own anchor joins a family only after that
    anchor's plate is pinned (plan 3.1:243-245; 15 (i) 3), as D-LIB10-DECLINE ruled for decline. Qualifying members:
    1 of 4. **HROW is not built.**
  - HINGE (romanian_deadlift parent; plan size 4): conventional_deadlift and sumo_deadlift are H (ruling 4: floor
    start; sumo's wide stance and toe-out move the feet, which is a pose). dumbbell_romanian_deadlift alone could
    differ only through `load.primitive: 'dumbbell'` plus a new fault builder (the arched back while standing up, c10;
    the parent's builder is the rounded lower back, c7), but 2 qualifying members of 4 is below 3. **HINGE is not
    built; dumbbell_romanian_deadlift is H** (D-LIB10-BENCH-H; D-LIB10-TEMPLATES), copying romanian_deadlift's code.
  - Each H in place of a planned T costs about +2.5 Opus-hours [est]: 6 children, about +15 h, already inside the
    card's 40-48 h forecast (8 H plates × 4 h).
  - SHRUG (barbell_shrug, cable_shrug, and LB6's smith_machine_shrug) is LIB-13s's, not decided here.
- No feasibility table (Q1 (c)) is owed: no family is proposed T. If the supervisor rules HINGE T for
  dumbbell_romanian_deadlift anyway, the table, PARAMS ranges and fault builders are posted before its first child's
  approval, and the slice waits for pilot A on main (ruling 4; build_prerequisites).

## 2. Per id

Anchors: pilot A approvals at `e6f39ff` (16, D-PILOTA-R5), carried to `48d49bb` by D-LIB8FIX-CARRY / D-LIB8M-CARRY
where the fragments are unchanged [byte-identity at `48d49bb` unverified here: LIB-8M's fix tables say so];
dumbbell_biceps_curl at `83735ab` (D-LIB8M-CRIT1); upright_row at `94c551f` (D-LIB8M-CRIT3). Golden A
`tests/howto/golden/GOLDEN.json`. View: side for all 8 (card `plate.view` = census `view`), so F6 is never expected.

| id | mode and reason | clone source (head) / census closest | composer / primitives | hand zoom: key | view |
|---|---|---|---|---|---|
| pendlay_row | H (ruling 4): floor start, dead stop each rep (c3), torso parallel (c2) | barbell_row (#109 `48d49bb`) / seated_cable_row (golden A, `bc0f378`) | vendor barbell, floor | none on the card | side |
| t_bar_row | H: landmine rig not a PARAMS value; rig anchor landmine_row not pinned (ruling 5) | barbell_row (`48d49bb`) / seated_cable_row | **landmine** (new; anchor landmine_row), vendor vHandle under the bar 22.9 cm from the plates (c1 midpoint) | `tbar-grip`: no key yet (LIB-7c's `v-handle-pull-neutral-overhead` is the overhead pulldown variant; a row variant is needed) | side |
| landmine_row | H, **landmine anchor** (ruling 5): same rig reason | barbell_row (`48d49bb`) / seated_cable_row | **landmine** (new), hands one above the other just behind the plates (c4) | `landmine-grip`: no key yet (`bar-row-over` is 32 mm pull on a pull-up bar; this is the 28 mm shaft, stacked hands) | side |
| one_arm_dumbbell_row | H, **support anchor** (plan 2.2:159; ruling 7); drawable:false, F7 expected | barbell_row's hinge solve and dumbbell_biceps_curl's dumbbell use (`48d49bb`) / seated_cable_row | vendor bench, dumbbell, floor; far hand `hand: 'flat'` on the bench | none on the card | side |
| dumbbell_romanian_deadlift | H (section 1: HINGE not built) | romanian_deadlift (`48d49bb`) / barbell_back_squat | vendor dumbbell ×1 drawn (near hand), floor | `dbrdl-grip`: no key yet (no hold key exists) | side |
| conventional_deadlift | H (ruling 4) | romanian_deadlift (`48d49bb`) / barbell_back_squat | vendor barbell, 45 cm plates resting on the floor (bar centre 22.5 cm up, c23), floor | `dl-grip`: no key yet (no bar-hold key) | side |
| sumo_deadlift | H (ruling 4) | conventional_deadlift (this branch, after its approval) and romanian_deadlift (`48d49bb`) / barbell_back_squat | vendor barbell (as the parent), floor | `sumo-grip`: no key yet | side |
| back_extension | H (own parent; census N) | romanian_deadlift's hinge (`48d49bb`) / barbell_back_squat | **romanChair** (new, single use) | none (hand archetype none) | side |

Not drawn here (D-LIB13-PA): barbell_row (P:HROW, topFault 'swing'), romanian_deadlift (P:HINGE, 'round'),
single_leg_romanian_deadlift ('round'), upright_row ('chin'; approved @ `94c551f`) are reused unchanged, with no LB3 row
(registry.mjs:34-36 throws on a second row). The shrugs (dumbbell_shrug, cable_shrug; barbell_shrug held on pilot A)
are LIB-13s's (ruling 6); they sit in section 13's held table.

**Hand zooms.** No hand block is built (D-LIBHANDS-COUNT binds no LB3 card). Five cards have a hand zoom with no LIB-7
(#193 @ `9c70344`) or LIB-7c (#271 @ `88ad31b`) key: t_bar_row (V-handle row, neutral), landmine_row (stacked overhand
on the shaft), and the three holds dumbbell_romanian_deadlift, conventional_deadlift, sumo_deadlift (no hold-archetype
key exists). Wrists drawn as each card records (R-LB3-5): the pull cards (pendlay_row, t_bar_row, landmine_row,
one_arm_dumbbell_row) bent back about 35°; the hold cards (dumbbell_romanian_deadlift, conventional_deadlift,
sumo_deadlift) neutral. If F-LB3-3 rules one hold or pull wrist across cards, the affected hands are redrawn,
re-QA'd and re-critiqued. **Pinned-id flag:** the bar-hold key that conventional_deadlift and sumo_deadlift need
would also map romanian_deadlift (hold, `rdl-grip` zoom on #109 `48d49bb`); a barbell pull/row key for the LB3 rows
would map barbell_row (`row-grip`) and upright_row (`urow-grip`). single_leg_romanian_deadlift has no hand zoom. Under
D-LIB7FIX-PERKEY's exception such a key adds to the pinned row's MANIFEST set.

## 3. Templates

None built (section 1). This section stays empty unless a ruling makes a family T.

## 4. Composers (Do 4)

Both follow LB2's declineBench pattern: `(lm, ctx) => item[]`, PRIMITIVES types only, existing primitives and
`eq/parts.mjs` helpers, no file reads; their assumed sizes go under "Unsourced numbers" in each spec that uses them.
A per-pose drawn-item test on the real spec (13.1), as lb2-plates.test.ts:106-174.

- **landmine** (`eq/landmine.mjs`; users t_bar_row and landmine_row, one batch and one sheet, plan 2.1:140; anchor
  landmine_row, ruling 5; flagged on the sheet as a new rig). Parts: the floor pivot (a fixed sleeve and base plate on
  the floor, drawn with `box`/`poly`, static), and the moving bar from the pivot to the loaded free end, with the near
  plate. The bar moves with the hands, so it is a `poly` in every pose (H9; plan 2.1:126-128; plate.mjs:213) and its
  near plate a `pulley` ring or `poly` circle that carries poly in the Mistake. Options: `pivot` (world point on the
  floor), `to` (the bar point the hands hold, from the spec's grip), `beyond` (bar length past the hands to the plate
  collar), `plateD`. The pivot end stays at one fixed floor point in every pose (A2: ±1 px). t_bar_row adds the vendor
  `vHandle` hooked under the bar 8-10 in (drawn 9 in = 22.9 cm) from the plates (c1), its grips at the hands.
  - Layout per card: landmine_row (c1, c2, c4; "layout inferred from c1, c2", unsourced): pivot behind the lifter on
    the floor, the bar running forward between the feet, the lifter straddling the loaded end, hands just behind the
    plates. t_bar_row (c1, c2): the same rig, the lifter standing over the bar facing the plates, the V-handle under
    the bar. Pivot distance and bar length (a 2.2 m Olympic bar, the vendor barbell's `barLen`) are unsourced.
- **romanChair** (`eq/romanChair.mjs`; back_extension, single use, plan 2.1:141). The 45° frame on the floor, the hip
  pad under the top of the thighs just below the hip bones (c1, c2), the foot plate with the heel pad (c3). Static: no
  `poly` twin. Built from `backPad` (the angled hip pad and the foot plate), `kneePad` (the heel roller) and `box`/
  `line` frame members. Its sizes are unsourced (pad length, frame height, the 45° itself; section 10).
- No other composer is proposed. Pilot A's safetyArms, inclineBench and pecDeck are not used, never edited or forked.
- **Anchor order:** landmine is approved on landmine_row before t_bar_row is approved (A1; M6).

## 5. Pose-class and convention anchors

| id | hinge (romanian_deadlift, barbell_row; pilot A) | support (one_arm_dumbbell_row, LB3) | engine dumbbell (dumbbell_biceps_curl, pilot A `83735ab`) | drawable-fault convention (plan 1:85-88) |
|---|---|---|---|---|
| pendlay_row, t_bar_row, landmine_row, conventional_deadlift, sumo_deadlift | yes | | | |
| one_arm_dumbbell_row | yes | **anchor** (drawn first, ruling 7) | yes | **yes** (F7; the curl's F7 named yes, D-LIB8M-TF1 4) |
| dumbbell_romanian_deadlift | yes | | yes | |
| back_extension | yes | yes (brace-pad; approved only after one_arm_dumbbell_row, ruling 7) | | |

None of the 8 goes on a sheet before pilot A's yes is on main (depends_on). back_extension is redrawn if the owner
rejects the support anchor (ruling 7).

## 6. Expected flags

- **F5 on all 8** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly 3.57
  only.
- **F2 on pendlay_row** (named flag, ruled #274 6267110489): cover 0.163, a held hinge.
- **F7 on one_arm_dumbbell_row**: drawable false (plan 1:85-88). Its top fault, momentum (c10, first on StrengthLog's
  list), is seen only as speed; the plate draws the next fault on the same list, the short range (c10). Spec
  `pilot: { drawableFault: '...' }`. topFault 'momentum' ≠ the drawn key 'short', so F7 stays raised and needs the
  owner's named yes on the LB3 sheet (13 Q1; D-LIB8FIX-ENV).
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault' (the three keys are not yet on
  the cards). Expected, not defects (Do 2 a).
- No other flag is planned. Any other raised flag is posted with its value and range and ruled before READY
  (ruling 13). F2 (coverage) and F3 (leaders) are measured at Do 8; the long landmine bar and the Roman chair frame
  widen the framing, so F2's lower bound is the one to watch.

## 7. R10 items (tier A: 7 of the 8; one_arm_dumbbell_row is tier C)

No LB3 card requires a rack, J-hooks or safeties. The right pose never shows an unsafe setup:

| id | R10 items drawn in the right pose (claims) |
|---|---|
| pendlay_row | back flat and level at the floor start, never rounded to reach the bar (c2, c8); the bar set down on the floor, plates resting on the floor line (c3) |
| t_bar_row | back straight, chest parallel (c3); the bar pinned at the pivot, the plates clear of the floor at the bottom; the handle path to the lower chest (c4) |
| landmine_row | back straight, braced, torso roughly parallel (c3, c5); bar pinned at the floor pivot; the loaded end in front of the feet, never under the lifter's face |
| dumbbell_romanian_deadlift | flat back, stop where it would round (c8, c10); dumbbells on the legs (c4); gaze to the floor at the bottom (c7: neck in line) |
| conventional_deadlift | flat back from floor to lockout (c7); bar over mid-foot, shins close (c1); bar close to the legs (c6) |
| sumo_deadlift | chest up, back flat (c13, c15); bar against the shins (c13); hips and knees lock together at the top (c14, c15) |
| back_extension | pad below the hip bones, never at the waist (c1, c2); feet secured on the foot plate under the heel pad (c3); top in one straight line, no arch past it (c5) |

## 8. Tempo map (for the supervisor to rule; Q3, 14.7, D-LIB8M-TEMPO)

Rule: the concentric phase takes `up`, the eccentric `down`; `Hold` takes `pause` right after the concentric, only if
pause > 0. No Rest. No constant: pendlay_row's floor stop (c3) and conventional_deadlift's dead start (c12) give no
seconds, so no static phase is drawn for them (`lb3/tempo.json` `constants` is empty). Phase order follows the drawn
order (section 9's pose map).

| id | card up/down/pause (claim) | drawn start (spec `start`) | phase array |
|---|---|---|---|
| pendlay_row | 1/2/0 (c14) | top: bar at the chest (card plate.end) | Lower 2, Pull 1 |
| t_bar_row | 1/2/1 (c15) | bottom: arms straight (card plate.start) | Pull 1, Hold 1, Lower 2 |
| landmine_row | 1/2/0 (c12) | bottom (card plate.start) | Pull 1, Lower 2 |
| one_arm_dumbbell_row | 2/2/0 (c14) | bottom (card plate.start) | Pull 2, Lower 2 |
| dumbbell_romanian_deadlift | 1/2/0 (c20) | top: standing (card plate.start) | Lower 2, Stand 1 |
| conventional_deadlift | 1/2/0 (c12) | top: standing (card plate.end) | Lower 2, Lift 1 |
| sumo_deadlift | 1/2/0 (c21) | top: standing (card plate.end) | Lower 2, Lift 1 |
| back_extension | 1/2/1 (c8, c21) | top: straight line (card plate.end) | Lower 2, Raise 1, Hold 1 |

back_extension's Hold is right after the concentric (Raise); drawn from the top, it closes the cycle.

## 9. Pose map (Q2 (b)) and fault→key map (13 Q1(a))

The engine draws the Mistake as the end pose plus an override (plate.mjs:78) and outlines what differs from the end
pose (plate.mjs:208), so a fault at the card's start pose needs the start drawn as the spec's `end` (Q2 (f)). Read on
`565ea5a4`'s vendor plate.mjs (the same file pilot A uses).

| id | spec `start` = card | spec `end` = card | why |
|---|---|---|---|
| pendlay_row | plate.end (bar at the chest) | plate.start (bar on the floor) | the fault, the rounded back, is at the floor start (c8, c23) |
| conventional_deadlift | plate.end (standing) | plate.start (bar on the floor) | the back rounds as the bar leaves the floor (c8) |
| sumo_deadlift | plate.end (standing) | plate.start (bar on the floor) | the hips shoot up before the bar leaves the floor (c12) |
| back_extension | plate.end (top, straight line) | plate.start (bottom, hinged over the pad) | the back rounds over the pad at the bottom (c6, c19) |
| t_bar_row, landmine_row, one_arm_dumbbell_row, dumbbell_romanian_deadlift | plate.start | plate.end | identity: the fault reads against the card's end pose |

Ruled: LB3 NOTE RULED, #274 comment 6264733030 (sections 1, 6, 8, 9 and 10 accepted; Q1 and Q2 drawn-item tests added).

A fact with no pose defaults to the spec's `end` (node.mjs h6), so every fact about the spec's start says pose
`start`. Do 6 writes each fact's pose as this map's image of the pose its quote states. The phantom rule (Q2 (c))
applies wherever a start part is hidden: the start bar dot of the deadlifts and the Pendlay row (as pilot A's).

Fault→key (13 Q1(a)); each spec's first tell carries the key:

| id | plate.mistake (claim) | drawable | first tell key | topFault |
|---|---|---|---|---|
| pendlay_row | back rounded at the start, reaching the bar (c8, c23) | true | `round` | `round` |
| t_bar_row | rounded back over the bar (c7) | true | `round` | `round` |
| landmine_row | rounded lower back over the bar (c9, c11) | true | `round` | `round` |
| one_arm_dumbbell_row | short range, the bottom half: the arm never straightens at the bottom (c10; D-LIB13-ONEARM-M) | false | `short` | `momentum` (c10's top fault, speed only; ≠ `short`) |
| dumbbell_romanian_deadlift | back arches to stand up (c10) | true | `arch` | `arch` |
| conventional_deadlift | lower back rounds as the bar leaves the floor (c8) | true | `round` | `round` |
| sumo_deadlift | hips shoot up before the bar leaves the floor (c12) | true | `hips` | `hips` |
| back_extension | back rounds over the pad instead of the hips hinging (c6, c19) | true | `round` | `round` |

one_arm_dumbbell_row draws the top half of c10's short range (the end pose is the top); the bottom half ("the arm
never straightens") is the card's tell c10 and the copy, not the Mistake.

## 10. Facts plan (D-LIB8M-FACTS, 22's scope) and unsourced numbers

Every number a claim gives in plate.start or plate.end, read on the 8 copied cards (claims cited there, quotes
checked):

| id | number in a start/end claim | fact | reason |
|---|---|---|---|
| pendlay_row, t_bar_row, one_arm_dumbbell_row, dumbbell_romanian_deadlift, conventional_deadlift | none | `plateFacts: []` | "parallel", "slightly bent", "halfway down the shins" give no number |
| landmine_row | c3: Cissik "at least a 45 degree angle between your upper body and the ground" | **none proposed (question Q1)** | a lower bound from the source the card sets aside ("the drawn pose follows REP": roughly parallel); a fact at 45° would contradict the drawn, card-true parallel torso |
| sumo_deadlift | c2: stance 70 ± 11 vs 32 ± 8 cm, toe-out 42 ± 8 vs 14 ± 6° (competitive lifters); c4: trunk 5-10° more vertical than conventional | **none proposed (question Q2)** | stance width shows only from the front (card viewWhy); no fact kind measures a stance width or a foot angle (H6 kinds: angle by joint or measure, contact, height; 22 point 1: report, never invent a key); c4 is relative to another plate. Drawn: the sumo trunk 7.5° (c4 midpoint) more vertical than conventional_deadlift's drawn trunk, a drawn-item test (Q2 ruled). The feet are drawn 30 cm apart, toes out 10°, not c2's 70 cm and 42°: the engine foot has no roll (section 11) |
| back_extension | c7 "slightly below parallel": no number | `plateFacts: []` | |

**Contact facts (D-LIB13-FACTS2, #274 comment 6267284075).** A quoted contact for a drawn pose is a fact too ("[]
only when no quote gives a number or a contact for a pose the plate draws"). One `contact` fact per checked landmark,
`pose` the pose map's image of `cardPose`; each landmark has a spec `checks` plane, and H6 needs it within 1 cm:

| id | contact (claim) | spec pose (card pose) | landmarks: the plane |
|---|---|---|---|
| pendlay_row | bar to the abs or chest (c4) | start (end) | chest, navel: the navel-to-chest line, CLEAR (2 cm, shaft and clothing) behind the top bar; 0 cm |
| one_arm_dumbbell_row | support knee and hand on the bench (c1) | start (start), end (end) | knee.l, wrist.l: the bench-top planes; 0 cm (end added on the verifier's tightening, #274 6269741671) |
| conventional_deadlift | shins to the bar (c1) | end (start) | knee.r, ankle.r: parallel to the shin, its radius at the bar plus the shaft radius behind the bar; 0.5 cm (BAR_GAP) |
| dumbbell_romanian_deadlift | dumbbells on the legs (c4) | start (start), end (end) | hip.r, knee.r on the thigh plane at start; knee.r, ankle.r on the shin plane at end; 0.5 cm (BAR_GAP, the hex face) |
| sumo_deadlift | bar against the shins (c13) | end (start) | knee.r, ankle.r: as conventional_deadlift; 0.5 cm |
| back_extension | thighs on the pad (c3 on the card's start; c1 on its end: c1 is the quote that places the pad on the thighs, c2 is the pad-height mistake) | end (start), start (end) | hip.r, knee.r: the thigh axis, thighR(PAD_T) behind the pad face; 0 cm |

A15 (Do 7 lessons) on drawn items: every Mistake arrow (the only solid red part; the Mistake figure and the other guides
are dashed) stays at least 6 px clear of the solid end figure, measured on the Mistake svg against the engine's
bodyShapes; one_arm_dumbbell_row's arrow now stops 6 px short of the end grip and sumo_deadlift's sits 2 px further
back. Each tier-A R10 item in section 7 has one drawn-item check, and the test counts them against the table.

The drawn via poses are not facts (the cards name start and end). A test moves each fact pose's whole body 2 cm along
its plane's normal (root, reach and plant targets together): exactly that pose's facts go red.

Equipment numbers (fact only with a measure callout): conventional_deadlift's 45 cm plates / 22.5 cm bar (c23) and
t_bar_row's 8-10 in handle position (c1) have no measure callout (a measure is an angle), so they are not facts. They
are drawn exactly (bar centre 0.225 m over the floor at the floor pose; handle 0.229 m from the plates) and tested on
drawn items (A2; the deadlift bar height test). back_extension's 45° chair is in the card's equipment text, but no
quote on the card states "45" (c15's claim text names the 45-degree Roman chair; its quotes do not), so it is drawn
45° and listed as unsourced, never a fact.

Unsourced numbers (13.3 must-fix 14; each spec header lists its own): trunk and knee angles where the card says only
"parallel" / "slightly bent" (pendlay_row, t_bar_row, landmine_row, one_arm_dumbbell_row); landmine_row's whole rig
layout ("inferred from c1, c2"); the landmine pivot distance, sleeve and base sizes; the bar length past the hands;
the V-handle's 9 in (the 8-10 in midpoint is a drawing choice, the range is c1's); the bench height and the support
knee/hand spacing of one_arm_dumbbell_row; every romanChair size and its 45°; conventional and sumo lockout details
(the bar on the thighs is c6, c10, c14; its height follows the body); the Mistake magnitudes (illustrative, as pilot A's
M_TUCK); toe-out where a card gives none.

## 11. H slice (Do 2 a, ruling 12)

landmine_row with `eq/landmine.mjs`, one_arm_dumbbell_row and conventional_deadlift, posted as 'LB3 SLICE READY @ <sha>
(H)' with 390 px renders in Paper and Silent Black beside barbell_row and romanian_deadlift (pilot A, rendered from a
temporary worktree of #109 `48d49bb`), the unit tests, the two-build plates-page sha256 and the Do 8 QA table, A9 and
each mutation shown red then restored. Authoring QA counts as evidence only after Do 6's verdict.

- **conventional_deadlift (H).** Spec start = standing (card plate.end), spec end = the bar on the floor (card
  plate.start; pose map, section 9). Floor: the 45 cm plates on the floor line (bar centre 0.225 m, c23), the bar over
  mid-foot, the arms vertical in the side view, the trunk SOLVED (67.6° from vertical) so the bar is 5 mm in front of
  the shin (c1, c3, c4); knee 64°, hips 0.705 m. Top: trunk upright, knees 2°, the arm hanging 10.7° forward so the bar
  rests on the thighs over mid-foot (c6, c10). Five via poses on the mid-foot plumb line keep the bar path vertical and
  out of the legs (c6; a test samples t = 0..1). Tempo Lower 2, Lift 1. Mistake `round` (c8): the bar 2 cm off the
  floor, pelvis tucked 30°, lumbar flexed (solved 37°) so the vertical arms still reach the bar; a dashed hump guide;
  tells `round` and `tuck`. 'Bar over midfoot' ends on the mid-foot plumb line under the bar; 'Bar close' on the bar at
  the shin.
- **one_arm_dumbbell_row (H, support anchor).** The far knee and far flat palm on a flat bench (top 0.42 m), the near
  foot on the floor, the near arm working. The pelvis tilt is SOLVED (94.85°) so the drawn back line is level (c4); the
  far thigh vertical (knee under the hip), the far wrist under the far shoulder (c2; checks). With all three on one
  flat bench the support elbow bends about 75° (the arm is longer than the thigh): card-true, flagged for R1/R3. Start:
  the working arm plumb by joint angles (c5); end: the dumbbell at the hip, the elbow driven back (c6, c9). Tempo Pull 2,
  Lower 2. Mistake `short` (c10, the bottom half; panel fix 2): the arm never straightens at the bottom; tells
  `short` and `lower`; `pilot.drawableFault` names momentum (F7).
- **landmine_row (H, landmine anchor; D-LIB13-LANDMINE-2, research head 892d6516).** The card's layout (pivot behind,
  plates in front, shoulders ahead of the weight) with c20 (MECH, from the T-bar row): the row goes "as far as possible
  before the plates make contact with your torso". The end is solved at the first contact as the bar turns up about the
  pivot: the nearest point of the plate or of the bar's surface sits 5 mm off the engine's drawn torso and head outline
  (bodyShapes); hand rise 30.6 cm. Trunk 80° from vertical, knees 30°. Tempo Pull 1, Lower 2. Mistake `round` (c9, c11):
  pelvis tucked 30°, lumbar 40°, hump guide; tells `round` and `tuck`. Q1 (D-LIB13-Q1b, #274 comment 6267110489): c3's
  drawn pose follows REP ("roughly parallel to the floor"); Cissik's "at least a 45 degree angle between your upper
  body and the ground" is the differing source c3 records, not a bound on the drawing. The test checks REP's words: the
  near hip-to-shoulder line at start within 15° of horizontal (75-105° from vertical; drawn 80°).
- **Plate (drawing convention, D-LIB13-LANDMINE-2 2-3).** One 10 lb iron plate per side, 228 mm across and 31 mm thick
  (Rogue Machined Olympic Plates: "10LB: 228MM", "10LB Plate Width 1.22\"", roguefitness.com, read 2026-10-19). It is
  the largest catalogue iron plate that passes PQ-H3 card-true on landmine_row: the 25 lb plate (300 mm) leaves a
  17.8 px Trace. Sheet note on both landmine plates: "plate size: drawing convention (228 mm)". A4's expected flag set
  for these ids is F5 plus this sheet note.
- **t_bar_row: HELD (D-LIB13-TBAR, #274 comment 6265616772; D-LIB13-LANDMINE-2 route 3; D-LIB8M-CARDTRUE).** Stage
  review, no lb3/rows.json row, off the page and the pin, on the follow-up list; it joins the LIB-ZOOM small-motion
  question and moves with LIB-13s once that convention is ruled (F-LB3-6). Its card keys are written once in Do 6 b.
  The measured record: the V-handle hangs 22 cm under the bar, 9 in from the plates (c1), so the plate corner meets the
  sternum after a hand rise of 10.8 cm (195 mm plate), 12.1 cm (162 mm, the smallest Rogue change plate), 10.5 cm
  (228 mm), and at most 17.3 / 18.5 cm with a 15 cm handle (195 / 162 mm). PQ-H3 needs about 30 cm. Raised feet (c23)
  do not help: the bottom is set by the hanging arms, not the floor. The spec stays on the branch for LIB-13s.
- **pendlay_row (H, ruling 4; in the rows slice by D-LIB13-TBAR).** Spec start = the bar at the chest (card plate.end),
  spec end = the bar on the floor (card plate.start; pose map, section 9). The pelvis tilt is SOLVED (92.5°) so the
  drawn back line is level (c2), held in both poses (c4). Floor: the 45 cm plates on the floor line, the bar over
  mid-foot, the arms straight; knees 20° ("slightly bent", c10); the root SOLVED for the knee and the bar over mid-foot,
  so the shoulders sit ahead of the bar and the arms lean 21° back from vertical, as pilot A's approved barbell_row,
  whose card also says "arms straight down". A level back with plumb arms is not drawable on this body with 45 cm
  plates (the hip joint would have to sit above its standing height), so plumb arms were not used. Top: the bar on the
  torso front between the navel and the chest, straight above the floor bar, the elbow straight above it. Tempo Lower 2,
  Pull 1. Mistake `round` (c8, c23): the bar still on the floor, pelvis tucked 30°, lumbar flexed (solved 42°), the
  hump guide; tells `round` and `tuck`. Stance: mid-soles 24 cm apart, as barbell_row (wider stances leave the IK foot
  off the floor with this level trunk; the side view hides it).
  - **F2 0.163, a named flag (ruled, #274 comment 6267110489; plan 8 decision 9):** coverage under the envelope's
    [0.191, 0.549]: a held hinge where only the arms and the bar move. On the owner sheet with its value and reason;
    never padded. A4's expected set on pendlay_row: F2 and F5.
- **sumo_deadlift (H, ruling 4; hinge bulk, LB3 hinge BULK GO).** Pose map as conventional_deadlift (spec end = the
  floor start). Floor: the trunk 60.1° from vertical, 7.5° (c4's 5-10°, its midpoint) more upright than
  conventional_deadlift's drawn 67.6° (Q2, the drawn-item test and its swap mutation); lumbar 3°; straight arms reach
  the bar over mid-foot; the root SOLVED so the bar is 5 mm in front of the near shin (c13). Feet 30 cm apart, toes out
  10°: the engine foot has no roll, so c2's 70 cm and 42° leave the heel or ball 0.6-2.1 cm off the floor (36-70 cm
  stances at 20-42°; the check's limit is 0.5 cm). The side view hides the stance (card viewWhy); the text carries it.
  Grip 36 cm apart, inside the knees (unsourced). Mistake `hips` (c12): the bar still on the floor, the hips raised
  10 cm, the trunk angle SOLVED so the straight arms still reach the bar. Tempo Lower 2, Lift 1.
- **dumbbell_romanian_deadlift (H; HINGE not built).** romanian_deadlift's hinge solve (48d49bb, copied) with the bar
  swapped for a pair of dumbbells: hands 24 cm apart; the hex face 5 mm off the drawn leg (the hex half across the flats
  in place of the shaft radius, c4); the bottom trunk SOLVED so the dumbbell centre is at mid-shin (c3); knees 15°. The
  start is drawn standing tall with the arm SOLVED to rest the dumbbell on the thigh; the root-finder brackets are
  scanned in 1 cm steps (the clone's fixed brackets missed the root with the dumbbell's larger radius). Mistake `arch`
  (c10): at the half-way via, pelvis +25°, lumbar -25°, a dashed arch guide; tells `arch` and `hips`. Tempo Lower 2,
  Stand 1.
- **back_extension (H, own parent; support class after one_arm_dumbbell_row, ruling 7).** The 45° Roman chair
  (eq/romanChair.mjs): legs along the bench at 45° from vertical, knees 5°. The legs are held by joint angles (the hip
  flexes as much as the pelvis tilts past the top), not by foot IK: the foot plate is not level and the plant IK left
  the soles 7.9 cm off it; the soles' plane checks hold in every pose. The hip pad's top face is SOLVED onto the near
  thigh's front 18% of the way from the hip to the knee (c1, c2; a test moves the pad 5 cm and goes red). Top: one
  straight line (c5); bottom: the thorax 100° from vertical, slightly below parallel (c7); arms crossed on the chest by
  IK (c4). Mistake `round` (c6, c19): the pelvis held at 60°, the lumbar flexed to the same thorax depth, the hump
  guide; tells `round` and `hips`. Tempo Lower 2, Raise 1, Hold 1.
- **Panel fix round (D-LIB13-PANEL1, #274 6278550928; one round, the 4 passing plates byte-identical).**
  - back_extension (R2, R3): the romanChair hip pad was drawn turned into the thigh (its normal picked "up", which at
    45 deg points into the leg), so only two corners showed. The pad is now one `poly`, 50 cm along the thigh front
    (6 cm of it above the contact point) and 22 cm deep, its face on the contact line; an upright stands under the
    raised end of the 45 deg beam; the foot plate is a `poly` on the sole line (heel to ball), square to the shin, the
    soles checked on it (heel, ball, both soles). Drawn-item tests and two mutations (the pad turned, the plate laid
    level).
  - pendlay_row (R3): the engine draws the fist at the grip point, a hand's length past the wrist, so with the grip on
    the bar centre the forearm ended 5-7 px beside the bar. The grip target now sits WRAP 3 cm past the bar along the
    hand, so the bar's sleeve ring lies between the forearm's end and the fist (tested: both gaps under 1 cm; mutation:
    the old grip leaves a forearm gap over 1 cm). The straight arm needs that reach, so the hips and shoulders are
    lowered together (root 2.9 cm lower, back level, root z kept): the floor knee bends 35.7 deg. The 10-30 deg knee
    bound was this note's own reading of "slightly bent"; the test now reads the card's c1 on the drawn plates:
    pendlay_row's floor hip above conventional_deadlift's and its knee straighter, bent at least 10 deg.
  - one_arm_dumbbell_row: R3, the support hand is the engine's flat palm, its wrist angle SOLVED so the palm lies
    level. R5, the Mistake grip moved low and back (M_DY 0.50 under, M_DZ 0.30 behind the shoulder), so the forearm
    and dumbbell hand show in open space (tested at least 90% of each outline; the old half-way grip fails it); the
    upper arm still crosses the bent support arm. R1 (a straight support arm) is not drawable card-true (c1, c2, c4:
    a 0.42 m shoulder-to-wrist chord against 0.573 m for a 20 deg elbow) and waits on the ruling asked in #274
    6278674941.
- **Panel fix round 2 (D-LIB13-PANEL2, #274 6279411612; pendlay_row and one_arm_dumbbell_row only, the 5 approved
  plates byte-identical).**
  - pendlay_row (R2): round 1's WRAP put the fist 3 cm past the bar, so the fist ring sat off the plate's centre and
    read as a bar ring that had come apart. The grip is back on the bar centre: the plate, its inner ring, the sleeve
    ring, the centre dot and the fist share one centre (as the approved squat), and round 1's root drop is undone (the
    floor knee is 20 deg again). The hand is drawn as conventional_deadlift's hand poly (copied), from the forearm's
    end over the bar, so round 1's R3 (the hand reaches the bar) holds. Tests: one centre within 0.5 mm in every pose;
    the hand poly holds the wrist and the bar centre at the floor and in the Mistake; mutations: the 423acc1 bar 3 cm
    off the fist, and the hand dropped, each red. Round 1's forearm-gap test measured the WRAP drawing and is replaced
    by these two.
  - one_arm_dumbbell_row (R5): the Mistake is c10's bottom half (D-LIB13-ONEARM-M in docs/COACHING-DECISIONS.md): the
    arm short of straight at the bottom, the grip M_RISE 15 cm up and M_FWD 18 cm forward of the straight-arm start,
    the upper arm 3 deg off plumb, the elbow bent about 41 deg. Measured on the engine's bodyShapes with the Mistake
    mask: any grip swung back toward the hip runs the upper arm inside the torso outline (the shoulder joint sits
    inside it), and a plumb arm overlaps the support arm, which hangs from the same shoulder in this view; this grip is
    the only near-plumb one that keeps the forearm and the dumbbell hand at least 90% in open space. The blade (the top
    half) shows no still sign, so its tell is dropped; the second tell is `lower` (the dumbbell never comes all the
    way down), and the arrow points down to the start dumbbell.
- **Panel fix round 3 (D-LIB13-PANEL3, #274 6335029737; one_arm_dumbbell_row's Mistake view only).** The recheck
  read the round-2 red arm as scraps: the engine masks the Mistake outline inside the faulty body, so it vanished under
  the support arm. The red working arm is now traced as dashed guides (its shoulder cap, upper arm, elbow cap and
  forearm, outer outline only, taken from the engine's bodyShapes) plus the end-on dumbbell hex; the engine draws
  guides in the Mistake layer, above every figure and the bench. The pose is set by joint angles at the ruled elbow:
  the upper arm 25 deg behind plumb, the elbow bent 70 deg (the dumbbell about 9 cm above the straight-arm start), and
  the arrow runs from the dumbbell's edge down to the start dumbbell. Round 2's open-space test (the masked forearm at
  least 90% visible) and its 10-deg plumb bound measured the round-2 drawing; they are replaced by the guide-trace test
  and the ruled 25 deg (±3).
- **Straight arms with the bent-back wrist (all pull plates).** The engine's IK turns the forearm by the hand's bend
  (about 9°, body.mjs solveReach), so the pull specs reach at 99.98% of the IK's own full length: the arm reads straight
  with the report's elbow at about 11°.

## 12. Work split (if a second drawer joins)

- Drawer A (this branch): rows (landmine composer, landmine_row, t_bar_row, pendlay_row, one_arm_dumbbell_row); owns
  lb3/rows.json, DESIGN.md, cards.sha.json, tempo.json, build.mjs, qa.mjs and lb3-plates.test.ts.
- Drawer B: hinges (romanChair, conventional_deadlift, sumo_deadlift, dumbbell_romanian_deadlift, back_extension);
  adds only its own specs and its composer and hands its rows lines to A, merged in with a merge commit.
- Risks of the split: sumo_deadlift copies conventional_deadlift's code (one drawer for both); back_extension waits
  for one_arm_dumbbell_row's approval (cross-drawer anchor); two drawers share the 2-hour push limit.

## 13. Held ids

| id | held by | ruling | until |
|---|---|---|---|
None. LIB-13s released every row this table held: t_bar_row and barbell_shrug in wave 1, then cable_shrug,
dumbbell_shrug and smith_machine_shrug in wave 2 (section 16), each a row in `lb3/rows.json`.

## 14. Risks and mitigations

- **The landmine bar reads wrongly side-on**, or does not stay on the pivot and hands [unverified until drawn]: A2's
  geometry tests (pivot ±1 px in every pose, free end within 1 cm of the grip) catch it; R2 judges it on the anchor.
  The bar is long (about 2 m), so the camera may need `fit`; F2/F1 are measured at Do 8, never tuned away.
- **one_arm_dumbbell_row's kneeling support** has no contact IK for the knee (plan 2.2: kneel, probe C): the bench
  knee is set by hip/knee angles and proved with a `checks` plane under 0.5 cm; the far hand uses `reach` with
  `hand: 'flat'`. If the far support limbs read poorly (drawn lighter, `.far`), R3 judges it; fix in the spec only.
- **sumo's side view**: the wide stance and toe-out foreshorten the feet and thighs. Card-true (c2) even if it reads
  oddly; R1 judges it. If one card's facts cannot all hold, stop and post the conflict (D-LIB10-BENCH-H).
- **Pilot A changes** a reused or clone-source plate before it merges: the copies here are re-read at the named head;
  the reused 4 follow LIB-8M's pins.
- **F-LB3-3** (wrists) or **F-LB3-5** (variantLine notes) change a card: re-copy, re-key, re-verify that card, re-QA
  its plate.
- **dumbbell_romanian_deadlift's and sumo_deadlift's card variantLine** sit on rows whose equipment has one kind: never
  shown (D-LIB13-VLINE); LIB-13 never edits them.
- **D-LIB13-SCRATCHIDS**: no scratch fixture targets an LB3 id; none is run here.
- **Gate**: scripts/screenshot-gate.mjs names lib_barbell_row (a reused id) and none of the 8 [counted at the ship
  card; unverified].

## 15. Questions for the supervisor

1. **Q1 (landmine_row c3, the 45° bound).** c3 cites both REP's "roughly parallel" and Cissik's "at least a 45 degree
   angle between your upper body and the ground", and says the drawn pose follows REP. Recommended: no plate fact
   from c3 (the bound belongs to the source the card sets aside; a parallel torso is about 0-15° to the ground). If a
   fact is required, it can only be a bound, which no H6 kind holds, so it would need a new kind (not this card's).
2. **Q2 (sumo_deadlift c2, c4 numbers).** Recommended: no plate fact (no H6 kind for stance width or foot angle; c4 is
   relative); drawn card-true with the drawn-item tests in section 10, and the verifier told both.
3. **Q3 (pose maps).** Section 9's four non-identity maps (pendlay_row, conventional_deadlift, sumo_deadlift,
   back_extension), with the tempo arrays in section 8. The fallback for each, if the critic names the order or R5 < 4,
   is LB1's Q2 (g): the card's order, the Mistake still a pose, the map set to identity, tempo reordered, the verifier
   re-run for that card.
4. **Q4 (fault→key and one_arm_dumbbell_row's topFault).** Section 9's table; `momentum` for the drawable-false top
   fault.
5. **Q5 (modes).** Section 1: HROW and HINGE not built; all 8 H.

## 16. LIB-13s: the shrugs and t_bar_row (PLAN)

Card: `docs/supervisor/verify/lib-13s-card.md` @ `dd30aa1a` (claude/sup-lib4-cards), rulings D-LIB13S-1 to -10
confirmed as written (lib4-cards §48). Base: main `6b32d576` (train 53). Research: `a48b059400a74d5c9e3aceed21cf1aa67ab6f118`;
the 4 shrug cards and quotes are byte copies from it (16.6). Every number below marked "measured" was re-run on this
base with the wave-1 edits in the working tree (scratch scripts, never committed); [est] marks a value not yet drawn.

### 16.1 Modes (re-checked on `6b32d576`)

All 5 are H (D-LIB13S-MODES). derive.mjs:4-12 PARAMS on this base are still the 7 keys of section 1; none names a
landmine, a Smith machine, a hand place or a head angle. No template, family row or ranges PR. SHRUG has 2 qualifying
members of 3 (barbell_shrug, cable_shrug; smith_machine_shrug fails on the Smith rig and its bent elbows), under
section 1's 3.

| id | tier | view | clone source (copied, never imported) | rig | drawable / F7 | wave |
|---|---|---|---|---|---|---|
| barbell_shrug | A | side | itself (specs/barbell_shrug.mjs on main) | vendor barbell, floor | false: top fault rolling (c3), drawn bent arms (c4); F7 | 1 |
| t_bar_row | A | side | itself (specs/t_bar_row.mjs on main) | eq/landmine.mjs unedited, vendor vHandle | true (c7) | 1 |
| cable_shrug | B | side | barbell_shrug's wave-1 bytes | vendor cableColumn, low pulley, straight bar | true (c5) | 2 |
| dumbbell_shrug | B | front | upright_row (front stance and camera); barbell_shrug (shrug key, hand capsule) | vendor dumbbell ×2, end-on | true (c6) | 2 |
| smith_machine_shrug | B | side | barbell_shrug; smith_machine_bench_press (rig call) | eq/smith.mjs unedited (`railZ`, `stopY`, `base`) | true (c3) | 2 |

Copied brackets and their solved values: barbell_shrug has no bracket (its bar solve is a 6-step fixed point,
`key()`). t_bar_row's ROOT_Y bracket [0.5, 0.935] solves to 0.907 m (measured, unchanged by the feet); its contact
scans start at the start angle and throw past 0.6 rad. The clones record theirs in their headers when drawn.

### 16.2 Pose, fault→key and tempo maps (D-LIB8M-TEMPO)

Every row is identity: spec `start` = card plate.start (the bottom: shoulders down, or the row's straight arms), spec
`end` = card plate.end. Each fault reads against the card's end pose.

| id | plate.mistake (claim) | first tell key | topFault | card tempo up/down/pause | phase array |
|---|---|---|---|---|---|
| barbell_shrug | elbows bend to pull (c4); top fault rolling (c3) not drawable | `elbows` | `roll` (D-LIB13S-TOPFAULT; F7 named) | 1/2/0 (c7) | Lift 1, Lower 2 |
| t_bar_row | rounded back over the bar (c7) | `round` | `round` (on main, unchanged) | 1/2/1 (c15) | Pull 1, Hold 1, Lower 2 |
| cable_shrug | elbows bend to curl the bar (c5) | `elbows` | `elbows` | 1/2/1 (c7, c16) | Lift 1, Hold 1, Lower 2 |
| dumbbell_shrug | elbows bend to pull the dumbbells (c6) | `elbows` | `elbows` | 1/2/1 (c11) | Lift 1, Hold 1, Lower 2 |
| smith_machine_shrug | head pushed forward (c3) | `head` | `head` | 2/2/0 (c11) | Lift 2, Lower 2 |

smith_machine_shrug's 1 s bottom pause (c11) is named in tempo.json's `constants` note, not drawn: it sits between
the lowering and the shrug, and the card writes it outside `pause` (its tempo text).

### 16.3 Facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2, D-LIB9-FACTPOSE; the cflb6r2 model)

A setup quote states the start pose only; a contact is a fact only with a quote that names it, checked at both ends of
a segment; a seat contact needs a "sit on" quote (none here: every shrug stands).

| id | start/end claims read | numbers | contacts | plateFacts |
|---|---|---|---|---|
| barbell_shrug | c2, c4 | none ("as high as possible", "slightly bent") | c4 "in front of the body": a place, not a contact | `[]` |
| cable_shrug | c2, c3, c4, c5 | none | c2 "stand close to the pulley": a place, not a contact | `[]` |
| dumbbell_shrug | c1, c2, c3, c4 | none (c10 "slightly longer range": no number, never enlarged) | c1 "at your sides": a place | `[]` |
| smith_machine_shrug | c1, c2 | "mid-thigh height" names no metres (a height fact needs `m`); "shoulder-width" shows no width side-on | none | `[]` |
| t_bar_row | on main | unchanged | unchanged | on main, unchanged |

**CARD FIELDS fix (cf13s VALID, supervisor 10-31):** each setup grip quote states the start pose's hand contact, so the
start hand contacts are facts: barbell_shrug wrist.l and wrist.r (c1), dumbbell_shrug wrist.l and wrist.r (c4),
cable_shrug wrist.l and wrist.r (c1), smith_machine_shrug wrist.r (c1). Each has a spec `checks` entry at the drawn start
wrist (the CURL template's form); barbell_shrug's read 0 cm. The table above is the PLAN as ruled; this fix replaces its
`[]` column.

Placed items that are not facts get drawn-item tests (A4): smith's start bar between the hip and knee heights (c1),
dumbbell_shrug's grips beside the thighs (c1), cable_shrug's pulley ahead of the toes (c2).

### 16.4 Unsourced numbers

- SHRUG 5 cm on every shrug (barbell_shrug.mjs:55; the card says "as high as possible"). Never enlarged to pass a bar.
- barbell_shrug: KNEE_SOFT 5°, FOOT_X 0.10 m, M_PULL 15 cm (illustrative), BAR_GAP 15 mm (D-LIB13S-CLEAR: the 2 px
  rule, not a card number).
- t_bar_row: FOOT_X 0.19 m with toes out 17° (D-LIB13S-TBARFEET; c2 "about shoulder-width" is 45 cm on this body;
  the side view drops x, plate.mjs:44-45), plus the header's existing list.
- cable_shrug: the pulley place (top 0.205 m, as cable_curl.mjs:74's 16 cm pulley; z 0.25-0.45 m, ahead of the toe tip
  at 0.210 m) [est until drawn].
- dumbbell_shrug: grip half-width 0.26 m (the narrowest that clears 2 px, 16.5), the foot stance copied from upright_row.
- smith_machine_shrug: the elbow bend (c1 "slight": proposed 10-15°, the drawn-item range in A4), the head angle (proposed
  20° neck flexion, see 16.6), rail z ≥ 0.122 m.

### 16.5 Clearance (D-LIB13S-CLEAR; #354 6543628951 point 1; the BARSTART amendment)

Tested: each load part in the body's own plane against the drawn body outline (the engine's Catmull-Rom spline through
bodyShapes, arms and fists left out), 2 px = 1.37 cm at 146.29 px/m, in every drawn pose. Measured on this base:

| id | part | start | end | Mistake | status |
|---|---|---|---|---|---|
| barbell_shrug | bar shaft (r 14 mm) | 2.19 px (thigh.l) | 2.19 px (thigh.l) | 2.17 px (torso) | tested; main had 0.44 / 0.44 / −3.26 |
| t_bar_row | bar surface from the hook out, hook ring, grips (torso and head) | 28.14 | 5.96 | 2.00 (bar, at the head) | tested; main's Mistake 0.47 |
| t_bar_row | plate | 19.75 | 0.46 | 3.24 | tested except the end: c23's contact, the one exception |
| dumbbell_shrug | end-on hex (11.9 cm) to the thigh, front view | 2.57 [est] | 3.07 [est] | 4.07 [est] | tested, hands at ±0.26 m (±0.25: 1.10) |
| cable_shrug | bar shaft | 2.19 [est] | 2.19 [est] | 2.17 [est] | tested |
| smith_machine_shrug | bar end (r 2.5 cm) to the thighs | ≥ 2 [est] | ≥ 2 [est] | ≥ 2 [est] | tested, rail z ≥ 0.122 m |

Listed, not tested (beside the body in depth): barbell_shrug's end-on plates (z back); t_bar_row's landmine bar from the
pivot to the hook, which runs between the straddled legs (c24; −7.4 to −9.7 px in 2D) and the floor pivot; cable_shrug's
cable and column (the cable passes in front of the legs in depth); smith_machine_shrug's rails, hook rail, carriage,
stops, frame and base.

t_bar_row's Mistake rule: the rise stops at the first angle where the bar surface (every 1 mm), the hook ring, the
grips or a plate corner comes within 2 px of the drawn torso and head outline (spline). The end keeps c23's first
contact at CLEAR 5 mm on the raw outline (unchanged).

### 16.6 Zooms (D-LIB13S-ZOOM; D-LIBZOOM-EXTEND)

Clipped Trace in the zoom (bar 22.11 px), measured on this base:

| id | view, k | ladder 1.5 / 2 / 2.5 / 3 / 3.5 / 4 | circle; source ring |
|---|---|---|---|
| barbell_shrug | normal, 3.5 | 10.52 / 14.02 / 17.52 / 21.02 / **24.54** / 28.04 | (110, 274) r 52; (176, 122.99) r 14.86 |
| t_bar_row | normal, 3 (trim [10, 12] kept) | 2.62 / 10.47 / 19.21 / **27.23** / 35.44 / 43.30 | (200, 126) r 52; (258.62, 280.21) r 17.33 |
| cable_shrug | normal, 3.5 [est] | as barbell_shrug [est] | measured when drawn (the column stands right of the parent's circle) |
| dumbbell_shrug | normal, 3.5 [est] | prototype 24.54 at 3.5 | prototype (76, 188); remeasured with the drawn labels |
| smith_machine_shrug | normal, 3.5 [est]; a Mistake zoom only if the head tell is under 11.39 px | | measured when drawn |

smith_machine_shrug's head: the engine neck only flexes (body.mjs `rotX(q.neck)`), so "head pushed forward" draws as a
tipped head; the tell sits on the crown (`head`). At 20° the crown moves 13.01 px (card scratch), over the 11.39 bar,
so no Mistake zoom is needed at that angle [est until drawn]. The angle is unsourced and is never chosen to pass a bar.

### 16.7 Flags (D-LIB13S-FLAGS; measured)

| id | flag | value | approved range | call |
|---|---|---|---|---|
| all 5 | F5 | 3.57:1 | 4.5 | expected (D-LIB9-F5) |
| barbell_shrug | F7 | draws `elbows`, top fault `roll` | | named (D-LIB13S-TOPFAULT) |
| barbell_shrug | F2 | cover 0.139 | 0.191-0.549 | named: a standing figure at full scale whose only move is 5 cm; never padded |
| barbell_shrug | F3 | longest leader 45.79 px | 49.33-82.26 | named: short leaders on a tall figure; shorter is not a defect |
| barbell_shrug | F4 | 0 hand-placed label boxes | 2-6 | named: every label is placed by the engine (qa/node.mjs:110 counts `box` fields). The card's reason "ghosts off" is corrected here: F4 counts boxes, not ghosts |
| t_bar_row | none but F5 | | | sheet note "plate size: drawing convention (228 mm)" (section 4) |
| clones | F2, F3, F4 as measured when drawn | | | each posted with its value and range before PLATES READY 2 |

### 16.8 QA on this base (wave-1 edits applied)

`lb3/qa.mjs lib_barbell_shrug lib_t_bar_row`: barbell_shrug passes every hard check but H6 (no card keys yet, 16.2);
t_bar_row passes all 10, flags F5 only (on main it was H1.engine red: feet plant 1.0 cm, and H2.alt 53 words; now 0.4 cm
and 51 words). The 7 approved plates build page `6ff09d4c…08c6` on their own, and their 63 fragments are unchanged in
the full page.

### 16.9 Order of work

PLAN → RULED; cards at start (copies done; cards.sha.json LIB-13s section, tempo.json); wave 1 (barbell_shrug CLEAR +
zoom; t_bar_row feet + Mistake stop + alt + zoom) with tests A1-A6 for those two → PLATES READY 1; CARD FIELDS for the 4
shrug cards; wave 2 from barbell_shrug's approved bytes → PLATES READY 2; merge main, READY.

### 16.10 Panel mx16 (wave 1 round 1 @ `01b66192`, #359 6548509170)

barbell_shrug APPROVED. t_bar_row's fix round (R1 [3,4,3], R3 [3,3,4]):
- **R1:** the V-handle hangs HANDLE_L 9 cm from the hook ring to the grip (was the vendor vHandle's 22 cm; the panel's
  bound "a V of at most about 30 px at 2x" is 15 px, 10.3 cm). The floor pivot, the end bar and the plates stay where mx16
  saw them (the pivot SOLVED from the mx16 start; END_A unchanged, end grip z 0.161 m). The start bar angle is SOLVED so
  the handle meets straight arms. The end grip rises to 0.585 m, so the end elbow bends 84° (80-90° tested), level with
  the torso's underside, the upper arm along the torso.
- **R3:** the handle is drawn from poly parts: a shaft from the grip up to a 2 cm ring round the bar at the hook, and a
  12 cm grip turned square to the forearm in the side plane, through the fist. The card's 35° wrist (R-LB3-5) is an
  extension of a neutral (palms-facing) grip, which bends out of the side plane, so the side view draws the wrist straight
  and the fist sits on the forearm's axis (tested within 0.5 px). Asked of the supervisor with the PANEL FIX post.
- **Knock-ons:** the end grip's 24.5 cm rise makes k 1.5 the smallest ladder k (35.69 px; the ring holds the Trace, which
  k 3's ring no longer does). The larger source ring crossed the auto-placed "Soft knees" label (H1.ink), so that label
  gets a box under the ring (F4 counts 5 boxes, inside 2-6). Every rising part still clears 2 px; the Mistake bar
  stops at 2.00 px; the feet stay 0.19 m with toes out 17°.

### 16.11 Wave 2 (cable_shrug, dumbbell_shrug, smith_machine_shrug)

Cloned from barbell_shrug's bytes as approved in mx16 (@ `01b66192`; byte-equal at `2e2ff417` and pinned), copied, never
imported. All H, all with the parent's normal zoom at k 3.5 (24.54 px; k 3 gives 21.02).

| id | drawn | measured | flags (value, range) |
|---|---|---|---|
| cable_shrug | the parent's body, bar and Mistake; the vendor cableColumn with its low pulley (centre 16 cm up, 6 cm ahead of the toe tip, c2); the cable to the bar's centre | bar shaft 2.19 / 2.19 / 2.17 px | F5 only |
| dumbbell_shrug | front view: upright_row's stance; straight arms at the sides, grips 26 cm out; the vendor dumbbell end-on; Mistake: the elbows bend out and pull the dumbbells 15 cm up (dashed hexes, one arrow per hand) | hexes 2.57 / 3.07 / 4.07 px (0.25 m gives under 2) | F2 0.187 (0.191-0.549), F4 0 (2-6): named, the parent's reasons (a standing figure whose only move is 5 cm; every label engine-placed) |
| smith_machine_shrug | eq/smith.mjs unedited: rail at z 0.13 m, stops 2 cm under the start bar's underside (drawn in front), floor beam under the rails; elbows bent 12° (c1 "slight", 10-15° tested); the bar at 0.748 m, between the knee (0.498) and the hip (0.927); Mistake: the neck flexed 20°, the tell on the crown | bar end 3.20 / 3.28 / 3.28 px; the crown moves 13.0 px (over 11.39: no Mistake zoom) | F2 0.145 (0.191-0.549): named, the parent's reason |

Layout changes from the parent, each measured: cable_shrug's column fills the right, so its three labels are boxed on the
left above the zoom, the datum lines start at x 130 (were 60) so they do not run under those labels, and the elbow measure
is left off (no place for its label within F3's leader range; "Straight arms" carries c5). smith_machine_shrug's two
head-level labels are boxed on the left, 48 px apart (the engine stacked them 22 px apart: H4.overlap), with the same
datum change. The hit boxes need 44 css px between label rows (H4.overlap at 340 px).
