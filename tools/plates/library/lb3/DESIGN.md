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

A fact with no pose defaults to the spec's `end` (node.mjs h6), so every fact about the spec's start says pose
`start`. Do 6 writes each fact's pose as this map's image of the pose its quote states. The phantom rule (Q2 (c))
applies wherever a start part is hidden: the start bar dot of the deadlifts and the Pendlay row (as pilot A's).

Fault→key (13 Q1(a)); each spec's first tell carries the key:

| id | plate.mistake (claim) | drawable | first tell key | topFault |
|---|---|---|---|---|
| pendlay_row | back rounded at the start, reaching the bar (c8, c23) | true | `round` | `round` |
| t_bar_row | rounded back over the bar (c7) | true | `round` | `round` |
| landmine_row | rounded lower back over the bar (c9, c11) | true | `round` | `round` |
| one_arm_dumbbell_row | short range: the shoulder blade not pulled back at the top, the dumbbell stopping short of the hip (c10) | false | `short` | `momentum` (c10's top fault, speed only; ≠ `short`) |
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
| sumo_deadlift | c2: stance 70 ± 11 vs 32 ± 8 cm, toe-out 42 ± 8 vs 14 ± 6° (competitive lifters); c4: trunk 5-10° more vertical than conventional | **none proposed (question Q2)** | stance width shows only from the front (card viewWhy); no fact kind measures a stance width or a foot angle (H6 kinds: angle by joint or measure, contact, height; 22 point 1: report, never invent a key); c4 is relative to another plate. Drawn card-true anyway: mid-soles 70 cm apart, toes out 42°, and the sumo trunk 7.5° (c4 midpoint) more vertical than conventional_deadlift's drawn trunk, each a drawn-item test |
| back_extension | c7 "slightly below parallel": no number | `plateFacts: []` | |

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
| dumbbell_shrug | LIB-13s | D-LIB8-shrug; D-LIB13-SHRUG (ruling 6) | LIB-ZOOM's convention is ruled and extended to the shrugs |
| cable_shrug | LIB-13s | D-LIB8-shrug; D-LIB13-SHRUG | as above |
| barbell_shrug | pilot A held (pilot-a/plates.json @ `48d49bb`), then LIB-13s | D-LIB8-shrug; D-LIB13-PA | as above |

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
