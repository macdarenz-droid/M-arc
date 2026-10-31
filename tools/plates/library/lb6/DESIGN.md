# LB6 H plates: design note (LIB-16)

Card: `docs/supervisor/verify/lib-16-card.md` on `claude/sup-lib4-cards` @ `4b3c3a6f` (Do 1), with its D-LIB16-*
rulings and lib4-cards sections 12-31. Plan: `claude/howto-options` @ `b41ac833`. Research: the LB6 research head
`a8e66f32e34e1746075ffa4da35ea18c80dd4776` on `claude/libht-research` (LR-29 VALID on all 13 of #287,
`lb6-research-verify.md`); the 3 cards and quotes are byte copies from it (`lb6/cards.sha.json`), byte-identical at
`3812989f`. Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`. LB3 patterns are copied from #274 @
`a6f4bd07` and LB4's from #289 @ `4adde423`; pilot A (#109 @ `ff7c5c4f`) is read only. Base: main `5158609c`.

Nothing here ships (D-LIB16-AHEAD): every LB6 row stays at stage `drawing` or `review` in `lb6/rows.json`, outside
`batches/`; `tests/howto/lb6-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids (A5).

## 1. Engine and modes

- **Engine.** Every LB6 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE).
  Specs copy code from the 8 on main; they never import a vendor spec (D-LIB9-CLONE; A3 tests it). Every copied root
  finder throws on a bracket with no root, and each bracket's solved value is recorded in the spec header.
- **Modes: all three are H; no D row** (plan 6.2 :715 "H3", :745-747 no mark). A D spec is its parent with only
  PARAMS paths set (derive.mjs:4-12: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness,
  stance.width), and of those the vendor engine reads only `spec.camera` (vendor/engine/plate.mjs:81-95). What each
  id needs outside PARAMS:

| id | census closest | outside PARAMS (each alone makes it H; plan 3.1:272) |
|---|---|---|
| cable_chest_press | machine_chest_press | pose class: standing in a split stance (c2), not seated; equipment: a cable column with a single handle instead of the seat, back pad and lever (c1); tempo: the parent's Press 1 / Hold 0.3 / Return 1.5 / Rest 0.5 (machine_chest_press.mjs:164) is not the card's (c16: 2/2/0) and H6 compares tempo exactly (qa/node.mjs:176); Mistake: the parent's "round and lock" (:67-70) is two faults, the card's is the lock alone (D-LIB16-LOCK). |
| machine_pullover | lat_pulldown | equipment: the `pulloverMachine` composer (census gap); motion: the arms rotate overhead to the belt about a shoulder-height pivot (c3, c4), not a pull down to the chest; Mistake: the back arching off the pad (c8), not "lean and heave"; tempo (c14: 2/2/1). |
| machine_crunch | hanging_leg_raise (closeness N) | equipment: the `crunchMachine` composer (census gap); pose class: seated, not hanging; motion: a spinal curl in a seat (c4); Mistake: the arms pulling (c14), not the swing; tempo (c15: 2/2/0). |

- **D test (Do 3).** No id here could meet it: each needs a pose, equipment and tempo its parent does not have. No
  reason found to post for a D row.

## 2. Per id

View: side for all 3 (card `plate.view` = census `view`), so F6 is never expected. No tier-A card, so no R10 items.

| id | tier | mode | clone source (D-LIB16-CLONE) | composer / primitives | hand (merge_prerequisites) |
|---|---|---|---|---|---|
| cable_chest_press | C | H | machine_chest_press (main) for the arms on the press line, the end bend (:45) and the dashed start-arm phantom (:88-107) | vendor cableColumn (column, pulley, cable, stack), floor; the single handle from `line` and `poly` in the spec (D-LIB16-HANDLE, section 4) | d-handle GAP on main (hands/hand-d-handle.mjs:23); fist drawn |
| machine_pullover | B | H | lat_pulldown (main) for the seat, the seated root and the arm path; machine_chest_press (main) for the back pad laid tangent to the back and the lever outline (D-LIB16-CLONE) | **pulloverMachine** (new, bulk) | `balance` (hands/census-scope.json:62): no key; `pullover-hands` zoom is a gap for the ship card; open hands drawn flat (c6; the engine's flat palm) |
| machine_crunch | B | H | hanging_leg_raise (main) for the curl and the dashed Mistake method; machine_chest_press (main) for the seat, the back pad, the feet and the pivot-arm handle | **crunchMachine** (new, slice) | `balance` (census-scope.json:114): no key; fist drawn |

The 13 LB6 ids not drawn here (lib-16-card "LB6 ids"):

| id | reason |
|---|---|
| smith_machine_squat | D row: its parent spec and PARAMS are a later card's call |
| cable_fly, smith_machine_bench_press | pilot B plates, reused as pilot B pins them (D-LIB10-PA's pattern) |
| pec_fly | pilot A plate, reused as pinned |
| smith_machine_incline_press, smith_machine_shoulder_press, smith_machine_shrug | T rows: template parents (BENCH, SEATPRESS, SHRUG) and the `smith` rig need pilot B pinned (D-LIB10-TEMPLATES; plan 3.1:293-294) |
| low_to_high_cable_fly, high_to_low_cable_fly | T rows: CFLY parent is pilot B's cable_fly |
| machine_lateral_raise, rear_delt_fly, hip_abduction, hip_adduction | T rows: their FSEAT parent (pilot A) and the `latRaiseMachine`, `pecDeck`, `hipAbdAddMachine` rigs need their pilots pinned |

## 3. Composers (Do 4; D-LIB16-COMPOSERS)

Both are single use, their users are their anchors, and they land in this PR (plan 2.1:129-130, :141). Each is a
function of world points returning PRIMITIVES items only (equipment.mjs:316 on main), built in LB3's romanChair
pattern (`eq/parts.mjs` `sideBar`, `perItem`), with no file reads. No composer on another open PR is imported, copied
or forked.

- **crunchMachine** (`eq/crunchMachine.mjs`, machine_crunch; drawn in the slice). Parts (card plate.equipment; c2, c3;
  the drawing note "shin roller and handles by the shoulders"):
  - static: the floor beam, the upright behind the back pad, the seat arm and the pivot arm (`sideBar`), the seat pad
    (`seat`), the back pad (`backPad` in its surface form, laid tangent to the back of the start pose, the 8's
    method), the padded shin roller (`kneePad`) on its post;
  - moving between start and end: the movement arm, a `chestPress` (lever, neutral grip, pivot boss; all polys). Its
    pivot sits on the trunk's bend axis (the engine's one lumbar pivot, body.mjs:22, :112-116, in the start pose), so
    the handles turn with the shoulders as the spine curls: c1 mo-crunch "Adjust machine for proper alignment with
    torso". The lever is drawn at z `mid`, over the trunk and under the near arm, so it reads from the side.
  - **between the end pose and the Mistake nothing moves**: the arm stays at the end's angle (section 11, M_ARM). So
    no part needs a `poly` twin for the Mistake; the arm still carries polys, so a later change that moves it stays
    drawn in the Mistake view.
- **pulloverMachine** (`eq/pulloverMachine.mjs`, machine_pullover; drawn in the bulk on 'LB6 BULK GO'). Parts
  (plate.equipment; c1-c4): the seat and the back pad (static), the seat belt across the lap (a thin `poly` strap on
  the thighs, static), the foot bar in front of the shins (static; the drawn poses have the feet off it, c3), the frame
  upright, and the movement arm: a lever pivoting on the frame at shoulder height, `PIVOT_UP` above the shoulder joint
  centre (c1 "shoulders slightly below the axis"), carrying the elbow pads (the backs of the upper arms rest on them,
  c3) and the bar the open hands rest on (c3, c6). The arm moves start → end (overhead → the belt, c3, c4).
  **Between the end pose and the Mistake** the arm stays at the belt (the card's fault is the back, c8), so no part
  moves; the back pad, belt and foot bar are static. The arm is built from `poly` outlines in any case.
  As drawn (bulk): 14 items, 16 after the panel fix (a seat post down to the floor beam and a back pad bracket to
  the upright, #297 6353020731). Static: floor beam, upright behind the back pad, top beam over the shoulder, the drop to
  the pivot hub, the foot bar post, seat, back pad (`PAD_LEN` 1.0 m, so the head rests on it, c7), the belt (a `poly`
  strap across the thighs `BELT_T` along them), the foot bar end-on, the pivot hub (vendor `pulley`). Moving (`part:
  'arm'`): the arm tube from the hub to the elbow pad, the elbow pad (a slab along the upper arm, its face through the
  elbow), the strut to the crossbar and the crossbar end-on. The arm angle is solved, not chosen: start THETA0 puts the
  bar `BAR_BEHIND` behind the back of the head; end THETA1 puts the bar `BAR_OVER_BELT` over the belt.
- Tests (A2): per drawn pose (start, end, Mistake), every static part at one place (±1 px); each moving part drawn
  in the Mistake view; the ruled contacts on the drawn items (machine_crunch: the buttock on the pad at start and
  end, the shins on the roller at start, the wrists on the handles at start; machine_pullover: the back and buttock on
  the pad and the elbows on the elbow pads at start and end, the hands on the bar at start, the shoulder at the pivot,
  the head on the pad; mutations: the back pad 2 cm, the back 2 cm off the pad at end, the neck +8° at start).

## 4. The single handle and the cable (cable_chest_press; D-LIB16-HANDLE)

- #245 (LB1, eq/dHandle.mjs) is not on main at `5158609c`, so the single handle is drawn in the spec from vendor
  primitives: a `poly` grip bar (13 cm, the vendor dumbbell handle, equipment.mjs:30) and a `poly` strap to the cable
  ring, as LB5's note did for bayesian_cable_curl (lb5/DESIGN.md:55, :308 @ `92a3a52f`). The vendor `vHandle`
  (equipment.mjs:128) is a two-grip handle and is not used. The handle moves between the end and the Mistake (the
  lock carries it forward), so it is `poly` (PQ-H9); A2's line mutation applies to it.
- One column shows in side view (census note). The near column is not drawn; the far column's cable runs from its
  pulley to the far hand's handle at z `center`, behind the trunk and under the near arm (cableColumn draws the handle
  segment at `center`, equipment.mjs:100), so it is never drawn on top of the trunk, head or near arm (Do 7). The
  stack lifts by the cable's travel (`rest` = the start handle). The cable and stack move between the end and the
  Mistake; both are approved moving-line types (qa/envelope.json H9lineTypes: cableColumn, stack).

## 5. Pose-class and convention anchors (depends_on)

| id | seat (the 8's chest press) | split (reverse_lunge, pilot A, held) | own rig anchor | drawable fault |
|---|---|---|---|---|
| cable_chest_press | | **yes: held** (D-LIB16-SPLIT) | | yes |
| machine_pullover | yes | | **pulloverMachine** | yes |
| machine_crunch | yes | | **crunchMachine** | yes |

- cable_chest_press is drawn H now and goes on no sheet until reverse_lunge is redrawn to its new pick,
  owner-approved and pinned (D-LIB16-SPLIT); otherwise it rolls (plan 3.5:376). No other split anchor is substituted.
- The single handle has no anchor (plan 2.1:142). machine_crunch is not a SUPCORE child (D-LIB16-CRUNCH).

## 6. Expected flags

- **F5 on every plate** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly
  3.57 only.
- **No F7**: all 3 cards are drawable true, and each topFault is the drawn key (section 9).
- **No F1**: every plate is drawn at the reference 146.29 px/m.
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault' (qa/node.mjs:360). Expected.
- **F2 on machine_crunch (ruled a named flag, Q10):** authoring QA gives coverage 0.161 against the pinned 0.191-0.549
  (qa/envelope.json F2): a compact seated figure at the reference scale; the sheet carries it, nothing is added to dodge
  it. `lb6/qa.mjs` EXPECTED holds it. F3 (49.3-82.3 px) and F4 (2-6 boxed labels) are inside their ranges and tested (A15). Any other
  raised flag is posted with its value and range and ruled before READY.

## 7. R10 items

None: no tier-A card (cable_chest_press C, machine_pullover B, machine_crunch B).

## 8. Tempo map (D-LIB16-TEMPO; 13 Q3, 14.7, D-LIB8M-TEMPO)

Rule: the concentric takes `up`, the eccentric `down`; `Hold` takes `pause` right after the concentric only if
pause > 0; any other static phase is a constant only with a quote that states its seconds. No Rest. Form: pilot A's
rows (pilot-a/tempo.json @ `ff7c5c4f`), in `lb6/tempo.json`.

| id | card up/down/pause (claim) | phase array (drawn order start → end) |
|---|---|---|
| cable_chest_press | 2/2/0 (c15, c16) | `[{ phase: 'Press', s: 2, move: true }, { phase: 'Return', s: 2, move: true }]` |
| machine_pullover | 2/2/1 (c14) | `[{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }]` |
| machine_crunch | 2/2/0 (c15) | `[{ phase: 'Crunch', s: 2, move: true }, { phase: 'Return', s: 2, move: true }]` |

- Motra's 1 s bottom pause (cable_chest_press c16, machine_crunch c15) has its seconds in a quote, so a constant
  phase is allowed but not required; research left it in `tempo.text` on purpose (LR-33; R-LB6-7), so it is not drawn
  and the strip equals the card's up, down and pause. A7 pins it.
- machine_pullover's pause 1 is a WEAK drawing convention for the pause at the belt (c14, LR-33), drawn as the card
  says (D-LIB16-SECS).

## 9. Pose map (13 Q2 (b)) and fault→key map (13 Q1(a))

The engine draws the Mistake as the end pose plus an override (plate.mjs:78), so every fault here, at the end of its
concentric, is drawn against the end pose (Q2 (f)).

| id | spec `start` = card | spec `end` = card |
|---|---|---|
| cable_chest_press | plate.start (handles at the chest, c3, c4; but see section 13) | plate.end (arms pressed, c3, c5) |
| machine_pullover | plate.start (arm overhead, c2, c3, c6, c7) | plate.end (arm at the belt, c4, c7) |
| machine_crunch | plate.start (upright, c2, c3) | plate.end (curled, c4, c2) |

All identity. A fact with no pose defaults to the spec's `end` (node.mjs h6), so every start fact names pose `start`.
The phantom rule (Q2 (c)) applies where a start part is hidden: cable_chest_press's start near arm and handle under
the end trunk (the 8's chest press phantom). Correction (slice look #297 6346404542 item 2): machine_crunch's start
fist and grip are hidden by the end head and lever, so they are redrawn as a dashed phantom (`START_PHANTOM`, end pose
only); machine_pullover's start palm, forearm and bar are hidden the same way and get the same phantom. A test checks
each phantom is drawn and lies on the hidden start part (with a removal and a 15 cm shift mutation).

Fault→key; each spec's first tell carries the key, and topFault is that key (all drawable true):

| id | plate.mistake (claim) | first tell key (other tells) | topFault |
|---|---|---|---|
| cable_chest_press | elbows locked straight at the front (c17, c5) | `lock` (`line`: the arm ends in one straight line) | `lock` |
| machine_pullover | back arched off the pad: the lower back and head pull away (c8) | `arch` (`head`: the head off the pad) | `arch` |
| machine_crunch | the arms dragging the handles down, the trunk upright (c14) | `arms` (`upright`: the trunk not curling) | `arms` |

Tells are 2-3 visible signs of the one fault (Q-D5-4; D-LIB10-SKULL1). The cards' `plate.tells` are right-pose
cues (CARD-V2:37), so the Mistake tells restate `plate.mistake.what`.

## 10. Facts plan (D-LIB8M-FACTS, 22's scope, D-LIB13-FACTS2, D-LIB16-FACTS)

Every number and contact a quote gives for a drawn pose, read on the copied quotes; a setup quote states the start
pose only (D-LIB9-FACTPOSE) unless the card's own plate.start/plate.end cites it for another pose; "both" or a
plural paired part states each side (#289 6342086947); a hand contact is checked at the wrist (PANELS.md 7).

| id | quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|---|
| cable_chest_press | "Keep the feet planted on the floor." (c2; plate.start and setup[] cite c2, plate.end does not; "the feet": both) | `contact heel.r`, `ball.r`, `heel.l`, `ball.l` | start (start); the end-pose facts removed in the fix round (#297 6346317646) |
| cable_chest_press | "holding one d-handle in each hand" (c1; setup[] cites c1; "each hand": both) | `contact wrist.r`, `wrist.l` (added in the fix round) | start (start) |
| cable_chest_press | "Keep the elbows just below 90 degrees ..." (c3; a start setup quote; plate.start cites c3) | `angle elbow.r 90`, `angle elbow.l 90` (the elbows: both), note "just below 90" | start (start). **Section 13 (S3)** |
| machine_pullover | "position back flat against the back pad" (c2, setup); "Torso and head should remain back touching the back pad." (c7, start and end) | `contact backUpper`, `contact buttock` (a back on a flat pad ends at `buttock`, D-LIB11-SACRUM) | start (start) from c2 and c7; end (end) from c7 |
| machine_pullover | "place the back of the upper arm on the elbow pads" (c3, setup); "pulling at the elbow pads" (c4, end) | `contact elbow.r`, `elbow.l` (the pads sit at the elbows; the arms: both) | start (c3), end (c4) |
| machine_pullover | "Position the hands on the movement arm" (c3, setup) | `contact wrist.r`, `wrist.l` | start (start) |
| machine_crunch | "Sitting with the hips pressed against the back of the seat" (c2; plate.start and plate.end both cite c2 for the hips) | `contact buttock` | start (start), end (end) |
| machine_crunch | "push the shins against the padded roller" (c2; plate.start cites it, plate.end does not) | `contact knee.r`, `ankle.r`, `knee.l`, `ankle.l` (the shin at its two ends; "the shins": both) | start (start) |
| machine_crunch | "Grasp the handles in both hands" (c3, setup) | `contact wrist.r`, `wrist.l` | start (start) |

**cable_chest_press start (D-LIB16-CCP-START, #297 6343632260, option (a)).** Measured with the engine: with the
elbows at 90° (c3) and the handles at the nipple line (c4) the grip centre stops 32.4 cm in front of the chest
landmark; c5's "about one inch before touching the chest" would fold the elbow to 35° inside; reading c3 as the arms'
angle would raise the upper arm to 88° (straight out to the side, c7's flaring fault); c7's 45° "throughout" cannot
hold at the pressed end, where the upper arm sits at about 77°. So the start is drawn as plate.start states it, c5's
inch and c7's 45° are not facts, and F-LB6-6 (which claim sets the bottom) is logged for research.

**Written (Do 6 b) on all 3 cards**, appended last (`lb6/cards.sha.json` unchanged): plateFacts as the table above,
tempo built from `lb6/tempo.json` and each card's plate.tempo, topFault `lock`, `arch`, `arms`.

**Not facts**, each with its reason:
- cable_chest_press c1 "chest height", c4 "roughly where your nipples are": where an item is, not a touch; no
  height in metres (D-LIB16-FACTS). Drawn: the handle 12.8 cm below the shoulder joint (section 11).
- cable_chest_press c1 "a foot or two in front of the cables": an equipment distance with no measure callout
  (D-LIB8M-FACTS); drawn at its midpoint (section 11).
- cable_chest_press c3 "just outside shoulder width": a width the side view cannot show; no fact kind.
- cable_chest_press c5 "about one inch before touching the chest": no fact kind for a gap; section 13.
- cable_chest_press c5 "almost locked", c17 "slight elbow bend": no number (the end bend is a size, D-LIB16-LOCK).
- cable_chest_press c7 "Keep your elbows at a 45-degree angle from your body throughout the movement": section 13.
- machine_pullover c1 "shoulders slightly below the axis of rotation": a place relative to the pivot, not a touch;
  a drawn-item test instead. c2 and c5's foot-bar contacts: getting in and out; c3 takes the feet off before the
  drawn start (D-LIB16-FACTS). c4 "Hold the bar in tight to the seat belt": equipment on equipment.
- machine_pullover c7's head: the body model has no landmark on the back of the head (`head` is the crown, `ear`
  the centre), so no fact; a drawn-item test holds the head's back outline on the pad.
- machine_crunch c3 mo-crunch "grasp the handles with elbows bent at 90 degrees": Motra's machine is not shown to be
  the drawn kind (the card draws ACE's, handles by the shoulders, D-LIB16-VLINE), and with the hands by the
  shoulders a 90° elbow cannot hold: at 90° the grip centre sits 47 cm from the shoulder joint (engine: upper arm
  0.326 m, forearm to grip 0.342 m). Drawn: the elbow bent about 140° (section 11).
- machine_crunch c3 fb-crunch "handles overhead ... a pad on your shoulders": the other machine kind, not drawn.
- machine_crunch c4 "Flex spine until ribs approach pelvis": no number; c4 "until arms are extended": Motra's
  return, the other machine kind.

## 11. Size table (D-LIB16-SIZE; `lb6/sizes.json`)

Every number a card does not give, fixed before PQ-H3, each with its basis (a claim, an approved plate's file:line on
main, or a stated reason; never PQ-H3). Each drawn spec exports its table as `SIZES` and each composer its constants;
A17 compares them with `lb6/sizes.json` both ways and checks every basis. The spec headers list them under
"Unsourced numbers".

| id | name | value | basis |
|---|---|---|---|
| machine_crunch | SEAT_TOP | 0.46 m | machine_chest_press.mjs:28 |
| machine_crunch | SEAT_Z | 0.10 m | machine_chest_press.mjs:140 |
| machine_crunch | FEET_X, FEET_Z | 0.10, 0.47 m | machine_chest_press.mjs:31 |
| machine_crunch | GRIP_X | 0.22 m | machine_chest_press.mjs:32 |
| machine_crunch | GRIP_FWD, GRIP_UP | 0.20, 0.12 m | stated: handles by the shoulders (drawing note, c3) with the elbow about 140° (bent-arm rule ≤ 150°, #289 6341498444 item 2) |
| machine_crunch | CURL | 40° | hanging_leg_raise.mjs:54 (its curl: pelvis -25 + lumbar 15), here at the lumbar pivot with the pelvis held (c2, c4) |
| machine_crunch | ROLLER_T | 0.62 knee→ankle | stated: the roller on the lower shin (c2), clear of the ankle |
| machine_crunch | PAD_LEN, PAD_BELOW | 0.62, 0.08 m | machine_chest_press.mjs:141; stated (down to the seat) |
| machine_crunch | FRAME_BACK, BEAM_OUT, FLOOR_BACK, FLOOR_FRONT | 0.15, 0.10, 0.20, 0.30 m | stated (frame clearance, layout) |
| machine_crunch | M_TRUNK (Mistake) | 0° | c14 as the card reads it: the trunk stays upright |
| machine_crunch | M_ARM (Mistake) | 40° (= CURL) | stated: the arm at the end's angle, the same stack travel |
| crunchMachine | seatLen, padT, tubeT, rollerR, grip | 0.40, 0.07, 0.06, 0.055, 0.14 m | vendor seat, backPad, kneePad, chestPress defaults (equipment.mjs:181, :186, :204, :248); romanChair beamT (#274) |
| cable_chest_press | FEET_X | 0.10 m | machine_chest_press.mjs:31 |
| cable_chest_press | STAGGER | 0.53 m mid-sole to mid-sole | stated: c2 "one foot in front of the other", the front heel a foot length ahead of the rear toe (2 × 0.152 H) |
| cable_chest_press | ROOT_DROP | 0.06 m | stated: both legs reach the floor in the stagger with soft knees (23°); the hips over the middle of the ankles |
| cable_chest_press | GRIP_DY, GRIP_DX | 12.8 cm below, 3 cm outside the shoulder joint | machine_chest_press.mjs:41 (the nipple line, c4); c3 "just outside shoulder width" |
| cable_chest_press | START_FLEX | 91° (89° inside) | c3 "just below 90 degrees" (D-LIB16-CCP-START) |
| cable_chest_press | END_FLEX | 18° short of straight | machine_chest_press.mjs:45 (D-LIB16-LOCK) |
| cable_chest_press | M_FLEX (Mistake) | 0° | c17, c5: locked straight |
| cable_chest_press | COLUMN_BACK | 0.46 m rear heel → pulley | c1 "a foot or two": the midpoint; the pulley at the start handle's height (c1 "chest height") |
| cable_chest_press | HANDLE_GRIP, HANDLE_R, HANDLE_STRAP | 0.13, 0.008, 0.10 m | equipment.mjs:30 (13 cm handle); stated (grip bar, strap) |
| cable_chest_press | FLOOR_BACK, FLOOR_FRONT | 0.25, 0.25 m | stated (layout) |
| machine_pullover | PIVOT_UP | 3 cm above the shoulder joint | c1 "slightly below the axis" |
| machine_pullover | BAR_BEHIND, BAR_OVER_BELT | 3 cm behind the back of the head; 3 cm over the belt | c3 (overhead, behind the head), c4 (to the belt); stated clearance |
| machine_pullover | ELBOW_FLEX | 90° | c3 (bent arms on the pads) |
| machine_pullover | M_ARCH, M_NECK (Mistake) | 12° lumbar extension, the neck 12° forward | hanging_leg_raise.mjs:69 (12° arch); c8 the head off the pad, the same 12° |
| machine_pullover | SEAT_TOP, SEAT_Z, FEET_X, FEET_Z | 0.46, 0.10, 0.10, 0.47 m | machine_chest_press.mjs:28 (seat); machine_crunch's seated row |
| machine_pullover | BELT_T, PAD_LEN, PAD_BELOW | 0.25 along the thigh, 1.0, 0.08 m | stated: the belt across the lap (c2); the pad up to the head (c7) |
| machine_pullover | FRAME_BACK, FOOT_BAR_UP, FOOT_BAR_FWD, BEAM_OUT, FLOOR_BACK, FLOOR_FRONT | 0.15, 0.30, 0.10, 0.10, 0.20, 0.30 m | stated (frame clearance, the foot bar in front of the shins, c2, layout) |
| pulloverMachine | seatLen, padT, tubeT, armT, elbowPadLen, barR, beltW, beltT, footBarR, hubR | 0.40, 0.07, 0.06, 0.05, 0.20, 0.016, 0.05, 0.015, 0.03, 0.045 m | vendor seat, backPad, chestPress grip, pulley defaults; romanChair beamT; stated (arm, pad, belt, foot bar) |

`sizes.json` holds every row above with its basis (the "proposed" block is gone); A17 compares each spec's SIZES both
ways.

## 12. PQ-H3 estimates (before drawing; deviationMin 11.39 px, traceLenMin 22.11 px; qa/envelope.json)

At the reference 146.29 px/m:

| id | largest tell-anchor move, end → Mistake | Trace |
|---|---|---|
| machine_crunch | backUpper turns back 40° about the lumbar pivot, radius about 0.23 m: about 0.16 m → about 23 px [est] | the handle (grip.r) on its arc about the pivot, radius about 0.48 m over 40°: about 0.34 m → about 49 px before the end trims [est] |
| machine_crunch, **measured** (authoring QA) | 30.5 px | 28.3 px after the trims (the shoulder top, first drawn: 15.1 px, not used; D-LIB16-CRUNCH-TRACE) |
| cable_chest_press, **measured** (node-side) | 3.0 px: held (section 15) | 6.6 px: held |
| cable_chest_press | the elbow, 18° → 0°: it moves onto the shoulder-grip line, about 5 cm → about 7.6 px [est]: **below deviationMin**; the grip moves about 1 cm | reading (a) of section 13: the grip 0.45 → 0.65 m, about 0.20 m → 29 px before trims, about 7 px after [est]: **below traceLenMin**; reading (b): about 0.50 m → 73 px |
| machine_pullover | the arch at M_ARCH 12°: the low back about 3-5 cm off the pad, the head about 4-6 cm: about 5-9 px [unverified until drawn]: **at risk** | the bar on its arc from overhead to the belt, about 0.9 m → well over 100 px |
| machine_pullover, **measured** (authoring QA) | 15.4 px: passes (not held) | 111.8 px, the elbow (elbow.r) after the trims (the bar's grip, first drawn: 150.7 px, not used; D-LIB16-PULLOVER-TRACE) |

A too-small fault is reported with its card-true size and held under D-LIB8-shrug with the LIB-ZOOM route
(D-LIB16-SIZE); it is never enlarged. cable_chest_press is expected to be held (D-LIB16-LOCK); the slice still shows
it, marked held.

## 13. Stop S3: cable_chest_press's start cannot hold c3, c4 and c5 together

Measured with the engine (H 1.75 m; the handle at the nipple line, 12.8 cm below the shoulder joint, c4; the hands
just outside the shoulders, c3):

| start handle place | elbow flexion | upper arm elevation | gap, handle to the chest landmark |
|---|---|---|---|
| c3 read as the elbow joint, just below 90° | 90.9° (inside 89°) | 63.6° | 32.4 cm |
| c5 "about one inch before touching the chest" | 145.2° (inside 35°) | 65.6° | 2.5 cm |
| c5's inch with c3 read as the arms' angle, "arms just below 90 degrees" | 145.2° | 88° (the upper arm straight out to the side) | 2.5 cm |

- With the elbow at 90° the grip centre is 47 cm from the shoulder joint, so the handles stop about 32 cm in front of
  the chest: c5's inch cannot hold. With the handles an inch from the chest the elbow folds to about 35° inside.
- Reading c3 as the arms' angle ("Keep your arms just below 90 degrees") holds c5's inch, but draws the upper arms
  straight out to the side, the flared elbows that c7 lists as a mistake ("Flaring your elbows ... Keep your elbows
  at a 45-degree angle from your body throughout the movement").
- c7's 45° "throughout" read as the 3D upper-arm-to-trunk angle (PANELS.md 7's `sh.r.elev` ruling) cannot hold at the
  end: pressing straight ahead at the nipple line with the elbows 18° short of straight puts the upper arm at about
  77° (engine); at 45° the near-straight arm would put the hands about 47 cm below the shoulder. Bells of Steel's cue
  is about flaring, which the side view cannot show.
- The card's own plate.start cites c3 and c4 only ("handles at about nipple height, elbows just below 90 degrees,
  wrists over the elbows (c3, c4)"); c5 is cited by plate.end.

Options (Q6). Card truth decides; nothing is tuned off the card (D-LIB10-BENCH-H):
- **(a) plate.start as written (recommended):** elbows just below 90° at the start (facts `elbow.r` and `elbow.l`
  90), handles at the nipple line about 32 cm in front of the chest; c5's inch and c7's 45° are "not facts" with the
  reasons above. Cost: the press travels about 0.20 m, so the Trace is about 7 px after the trims [est], below
  traceLenMin, and the lock is about 7.6 px, below deviationMin: the plate is held under D-LIB8-shrug (D-LIB16-SIZE)
  with the LIB-ZOOM route. A research follow-up (proposed F-LB6-6) asks which of c3 and c5 sets the bottom.
- (b) c5's bottom: handles an inch from the chest, the elbow folding to about 35° inside; c3 then has no drawn value
  (it is not a fact), which departs from plate.start's words.
- (c) research settles c3's reading first (F-LB6-6), and cable_chest_press waits.

**Ruled (D-LIB16-CCP-START, #297 6343632260): option (a).** Drawn as plate.start states it; held (section 15).

## 14. H slice (Do 2; D-LIB16-SLICE)

machine_crunch with eq/crunchMachine.mjs; cable_chest_press after Q6's ruling. Posted as 'LB6 SLICE READY @ <sha>'
with 390 px renders in Paper and Silent Black beside the 8's hanging_leg_raise and machine_chest_press, the unit
tests, the two-build plates-page sha256, the Do 8 QA table for the rows in rows.json, each Mistake's measured H3
deviation and Trace length beside its size row, A9 and every mutation red and then restored.

## 15. Held ids

A held id is drawn as its card says, passes its drawn-item tests, and is in no rows file and on no QA'd page.

| id | held under | measured at its ruled sizes (node-side, qa/node.mjs) | route |
|---|---|---|---|
| cable_chest_press | D-LIB8-shrug (D-LIB16-SIZE, -LOCK, -CCP-START) | Trace 6.6 px (traceLenMin 22.11), largest tell-anchor move 3.0 px (deviationMin 11.39); also F2 0.56 (above 0.549) and F3 40.2 px (below 49.3) | LIB-ZOOM's zoom circle on the elbow once #279 is on main and 'LIB-16 resume'; F-LB6-6 may change its start |

machine_pullover may join it (its arch, section 12) once drawn.

**Released ('LIB-16 resume', #327):** cable_chest_press carries one zoom per view (D-LIB16-ZOOMVIEWS, #327
6405117790) and joins rows.json (section 18). No LB6 id is held now.

## 16. Risks and mitigations

1. cable_chest_press's lock and Trace are below the PQ-H3 minimums at the card's sizes: held, zoom route (section 12).
2. The S3 conflict on cable_chest_press (section 13): posted, not drawn until ruled.
3. machine_pullover's arch below deviationMin: measured 15.4 px once drawn (section 12), so it is not held.
4. The cable reads as passing through the body: it runs behind the trunk at z `center`; if it still reads as through
   the body, it is reported with renders.
5. machine_crunch's movement arm drawn over the trunk (z `mid`) crowds the callouts: leaders are tested to stay 6 px
   clear of the Trace, the lever, the roller, the seat and the pads (A15). Two anchors are contacts on the back pad
   itself (normal "Hips back", the buttock on the pad, c2; Mistake "Trunk upright", the upright back on the pad), so
   their leaders cross that pad and the upright behind it once, at the anchor end; the test exempts only those two
   leaders from the pad and its frame, and every other line still binds them (Q8). machine_pullover's "Back on pad"
   (the back on the pad, c7) and "Back arches" (the Mistake back off it, c8) are pad contacts of the same kind and get
   the same exemption; Q8 named only the crunch labels, so this extension is put to the supervisor in the bulk post.
6. The pullover's lever cannot keep the elbows on the pads in every drawn pose [unverified until drawn]: S3, never
   moved off the card.
7. machine_crunch's Mistake leaves the arm where the end has it, so the faulty arm lies over the end trunk, where the
   engine's mask hides it: it is redrawn as red dashed lines over the figure (the 8's phantom method).
8. A later research head changes one of the 3 cards (F-LB6-3's Marquette re-fetch included): the note follows it; the
   verifier and QA re-run for that card.
9. A COACHING-DECISIONS append conflict: keep both sides.
10. The bent-arm check read the engine's elbow flexion (0 = straight) as the lessons' inside angle, so a straight arm
    passed (found by the card's A15 mutation, review 6355888923). D-LIB16-BENT (accepted, 6356785268): a bent arm has
    flexion 30-150, at most 150 deg inside and not folded shut. Mutations: machine_pullover's start elbow at 170 deg inside
    (flexion 10) and machine_crunch's folded elbow are red; both drawn plates pass.

## 17. Questions for the supervisor ('LB6 NOTE RULED')

**Ruled on #297 (6343632260, 2026-10-22): Q1-Q10 accepted.** Q1 D-LIB16-TEMPO (a test builds each strip only from
`lb6/tempo.json` and the card; one value off by 1 s is red); Q3 facts as listed under today's CARD FIELDS rules; Q5 the
size table; Q6 D-LIB16-CCP-START option (a), held under D-LIB8-shrug if under PQ-H3, F-LB6-6 logged; Q7 the `poly`
handle (a later switch to #245's is a separate step with a pixel diff); Q8 only "Hips back" and "Trunk upright" cross
the pad; Q9 D-LIB16-CRUNCH-TRACE: the handle (`grip.r`), on the basis of the anchor source's own motion cue, ACE's
"Grasp the handles in both hands, and pull down on them to lean forward." (c3, named in plate.start), with
DRAWING-GUIDE section 2's handle grip as a trace point; Q10 F2 0.161 a named flag.


- **Q1 tempo map (section 8):** the three phase arrays, D-LIB16-TEMPO as drafted; Motra's bottom pause not drawn.
- **Q2 pose map (section 9):** identity for all 3.
- **Q3 facts (section 10):** the listed contacts and cable_chest_press's elbow facts (subject to Q6); the "not facts"
  list, including machine_crunch's Motra 90° and machine_pullover's head.
- **Q4 fault→key (section 9):** `lock`, `arch`, `arms`.
- **Q5 size table (section 11, `lb6/sizes.json`):** the bases, the SIZES-export form A17 reads, and machine_crunch's
  Mistake (trunk upright, arm at the end's angle).
- **Q6 cable_chest_press S3 (section 13):** (a), (b) or (c).
- **Q7 single handle (section 4):** drawn in the spec from `poly` (#245 not on main).
- **Q8 leaders to a pad contact (section 16 item 5):** a callout anchored on a pad contact crosses that pad once at
  its anchor end, as the 8's machine_chest_press "Blades on pad" does (anchor backUpper on its pad,
  machine_chest_press.mjs:161); all other leaders keep 6 px from every pad.
- **Q9 machine_crunch's Trace:** the handle (`grip.r`), as the 8's machine plates trace the handle; the shoulder top
  first drawn gave 15.1 px after the trims (its arc about the lumbar pivot is short), so it is reported, not used.
- **Q10 F2 on machine_crunch:** measured 0.161 against the 8's 0.191-0.549 (qa/envelope.json F2): a compact seated
  figure at the reference scale. Proposed as a named flag (as pendlay_row's F2, #274 6267110489); nothing is added to
  dodge it.

### Bulk (machine_pullover, after 'LB6 BULK GO' #297 6346404542)

- Trace: the elbow (`elbow.r`), not the grip. The grip's arc runs in front of the head and the whole upper right, so
  it closed in the pivot and the start elbow: no leader to either could reach open space without crossing it. The
  card's cue is the elbows driving the pads (c3), so the elbow's arc is the motion the plate teaches
  (D-LIB16-PULLOVER-TRACE).
- "Shoulders at pivot" points at the drop that carries the pivot hub, at its front edge above the head (`PIVOT_DROP`,
  1.84 m). The hub sits behind the shoulder, hidden by the figure and closed in by the Trace, so no leader reaches it
  (D-LIB16-PIVOT-ANCHOR).
- "Push with elbows" meets the start elbow's outer edge (2, -6 px off the joint centre): the start forearm's phantom
  outline rings the joint centre, so a leader to the centre runs within 6 px of it.
- Labels: pivot box 214/24, elbows 184/72, pad 28/174; Mistake arch 22/174, head 166/84. Every leader is 6 px clear of
  the Trace, the equipment and the phantom, outside the figures, and no two hit boxes overlap (PQ-H4).
- QA (lb6/qa.mjs): all 10 hard checks pass; flags F5 only (the ruled set); leaderMax 55, Trace 111.8 px, deviation
  15.4 px.
- Panel fix (#297 6353020731, R2 "the seat and back pad float"): a centre seat post (a 6 cm frame tube, the width of
  the 8's chest press seat post) from the cushion's underside to the floor beam, and a level bracket from the upright
  to the back pad's back face at the middle of its two contact points. The figure is unchanged. Test: the seat pad
  reaches the floor beam without the back pad, and the back pad without the seat pad; red with the post or the
  bracket removed. Page 2668c838…e84e; QA unchanged (all 10 pass, F5 only).

## 18. LIB-16 resume (D-LIB-ORDER-3; base main `9c3287cd`)

Held rows of this card and their blockers on main:

| row | held under | blocker | on main? |
|---|---|---|---|
| cable_chest_press zoom plate | D-LIB8-shrug (D-LIB16-SIZE, -LOCK, -CCP-START) | LIB-ZOOM #279 | yes |
| cable_chest_press slice item 3 (#297 6346404542: column and floor clipped at the left edge; "Spine neutral" leader along the low back; `lock` and `line` show one sign) | slice look | none (waited for this resume) | n/a |
| F-LB6-6 (which claim sets the bottom) | research follow-up | claude/libht-research | not yet; the card is unchanged, so the plate is drawn from today's card and redrawn only if F-LB6-6 changes it |
| cable_chest_press sheet (reverse_lunge anchor) | D-LIB16-SPLIT | reverse_lunge pinned | ship card, not this resume |

Measured on main (node, `zoom/inline.mjs` zoomOf; spec unchanged):
- Mistake: the `lock` tell moves 2.98 px at plate scale. A Mistake zoom at k 4 (the maximum) gives 11.91 px against
  deviationMin 11.39; at k 3.8 it gives 11.31 (red).
- Normal: the Trace is 6.6 px after the trims, under traceLenMin 22.11, so the normal view fails PQ-H3 too. Today's
  normal plate has no place for a circle that clears ink, labels and leaders (zoomOf throws at k 2 and k 3).
- LIB-ZOOM's field is one `{ view, k }` per spec (`zoomFieldProblems` rejects a list; qa/zoom.mjs raises
  `H3.zoom:unexpected` on a second view). One zoom therefore cannot clear both bars: the ruling asked on the resume PR.

Slice item 3, built (spec `specs/cable_chest_press.mjs`):
- Camera x0 170 → 190: the column, its base and the floor's back end sit 8 px or more inside the plate (they were cut
  at x -12). Boxes: stance 266/262, spine 74/174, lock 166/40; "Handles at nipples" 262/188, anchored on the handle bar's
  lower end (grip.r + 9 px), so its leader drops clear of the vertical bar (6 px rule) and the top right stays free.
- "Spine neutral" leaves the back down and to the left: 9.0 px from the figure beyond its first 12 px (it ran 2.7 px
  along the low back).
- D-LIB10-SKULL1 per id: cable_chest_press has one tell, `lock`. Fault: the elbows locked straight at the front (c17,
  c5). Claims read: c17 ("Locking elbows at extension", "keep a slight bend") and c5 ("without fully locking the
  elbows"). No second visible sign is stated; "No bend left" showed the same straight elbow, so it is dropped.
- Tests: tests/howto/lb6-plates.test.ts "LIB-16 resume: cable_chest_press slice item 3", each with its mutation.
- Zoom fit after the re-layout (zoomOf): Mistake k 4 at (270, 232), 11.91 px; a normal zoom fits at k 3 or 3.5 at
  (298, 96) (source ring 17.3 or 14.9 px, Trace span 28.8 px), but not at k 1.5 to 2.5.

Zooms, built (D-LIB16-ZOOMVIEWS, #327 6405117790; `zoom: [{ view: 'normal', k: 3 }, { view: 'mistake', k: 4 }]`):
- The convention takes a list of at most one zoom per view (`zoom/inline.mjs` zoomList, zoomFor; a single { view, k }
  is unchanged). qa/zoom.mjs and qa/node.mjs check each view against its own entry. qa/browser.mjs counts a zoom's
  clipped render as ink only inside its circle (H1; the clip is not seen by isPointInFill).
- Authoring QA (`lb6/qa.mjs lib_cable_chest_press`): all 10 hard checks pass. Normal zoom at (298, 96), Trace 63.0 px
  in the circle; Mistake zoom at (270, 232), deviation 11.91 px. Raised flags F5 3.57 (ruled) and F2 0.580 against
  0.191-0.549: a named flag (D-LIB16-F2CCP, #327 6405365741; card-true width, the 53 cm stagger c2 and the column
  46 cm behind the rear heel c1), in `lb6/qa.mjs` EXPECTED for cable_chest_press only.
- The approved machine_pullover and machine_crunch fragments equal main's page 2668c838 (test pins them).
- H1 mutations (browser, one label stepped 1 px at a time on the built page): "Handles at nipples" as one line, from
  (284, 14) down onto the normal zoom circle: clean at 0 px, red at 1 px (ink at 290,44, the ring); inside the circle
  the ring and its disc count as ink, so any label there is red. "Spine neutral" from (74, 186) left onto the column,
  outside both circles: clean at 13 px, red at 14 px (ink at 67,194). With the clip disc widened to r 400 the clipped
  render counts again: H1.ink on normal meta, normal spine and mistake meta (the fix reverted gives the same three).
- Panel lb4p (#327 6410191598) R5 fix: one solid red line along the locked arm's axis, Mistake shoulder to Mistake
  handle centre (a `line` guide, drawn as `m-arrow`), in the plate and through the Mistake zoom; the dashed outline
  stays and no segment changes. A15's dashed-or-arrow and 6 px clearance rules exempt exactly this guide (`AXIS` in
  lb6-plates.test.ts). Page e4260472…6848; QA as before (all 10 pass; F2 0.58, F5 3.57).

## 19. Resume 2 (LIB-16R2): PLAN

Card: `docs/supervisor/verify/lib-16r2-card.md` on claude/sup-lib4-cards @ `aa985b8b`, rulings D-LIB16R2-1 to -9
(lib4-cards §48). Base: main `6d34542c` (train 51). Research: `a48b0594` (claude/libht-research); the 9 cards and quotes
are byte copies from it, the same blobs as at the LB6 research head `a8e66f32` (cards.sha.json `r2`). Nothing ships
(D-LIB16-AHEAD). Measures below come from scratch drafts on this base (never committed before 'LB6 R2 PLAN RULED'):
the engine's landmarks and shapes, `renderPlate(...).report`, and LIB-3's runQa (node and browser) through `lb6/qa.mjs`
on a scratch rows file. "[est]" marks a number not yet drawn.

### 19.1 Modes, re-checked on `6d34542c` (D-LIB16R2-MODES)

derive.mjs:4-12 is unchanged (7 keys: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness,
stance.width). All 9 rows are H with the card's reasons (its mode table); no row sets `parent`, `template` or `params`,
no template, family row or ranges PR is built. Clone sources are copied, never imported (D-LIB9-CLONE); each copied
root finder throws on a bracket with no root.

| id | clone source (copied) | copied bracket → solved value on this base |
|---|---|---|
| low_to_high_cable_fly | cable_fly (pilot B): the fixed-elbow arm sphere, the elbow pole, the `via` keys, the columns, handles, front cables and the press Mistake; upright_row's standing base via cable_fly | Mistake depth `MIS_Z` (closed form, throws if no root): 0.420 m (grip 20.1 cm nearer the face than the end's 0.621). New: the stance root, scanned down in 2 mm steps from the straight-leg height until both feet sit within 0.3 cm: 0.920 m (knees 5.9° and 7.6°) |
| high_to_low_cable_fly | the same | stance root 0.920 m as above; the crossed grip (closed form on the sphere, throws if no root): x +0.08, y 1.196, z 0.548 |
| smith_machine_squat | the 8's barbell_back_squat (vendor): `key()`, the bar weights `W` in the thorax frame, the hands, the feet; smith_machine_bench_press: the rig call, the bar end dot, the stop | `key()` has no bracket (a closed 2×2 solve); the bar z is pinned to the rail by moving the root. Solved: bar top 1.484 m, bar low 0.972 m |
| smith_machine_shoulder_press | dumbbell_shoulder_press (pilot A): the seated reclined base (`reclined()` copied from incline_dumbbell_press), feet, scap; smith_machine_bench_press: rig, bar, stop, the flare Mistake's elbow circle (`elbowOn`, `flaredElbow`) | `reclined` tilt bracket [-100, 20] → -22.01°; neck bracket [-40, 40] → -5.21°; hinge (0, 0.433, -0.099) at back 20° from vertical |
| smith_machine_incline_press | smith_machine_bench_press (the bar line, the 45° elbow circle `elbowAt`, the flare Mistake); incline_barbell_bench_press (LB2): the incline supine solve (`reclined`) and the upper-chest touch | `reclined` tilt → -62.01°; neck → -5.21°; hinge (0, 0.423, -0.152) at back 60° from vertical (30° from horizontal); `elbowAt` scans 360 1° steps then bisects, throws if none |
| machine_lateral_raise | pec_fly (pilot A): the seated base (`rootOnSeat`, TILT, FEET, the pad plane through backUpper and buttock); cable_lateral_raise (LB7 on main): the front-view abduction arc | [at draw] |
| rear_delt_fly | pec_fly: the seated base and the horizontal arm circle about each shoulder's vertical axis, reversed (start closed, end open) at shoulder height | `CLOSE_ANGLE` closed form (acos) as pec_fly |
| hip_abduction, hip_adduction | pec_fly's seated base; the engine's hip `abd` (body.mjs:82, :112) | [at draw] |

### 19.2 Per row: pose map, fault→key map, tempo map

Every row's plate start = card plate.start and plate end = card plate.end (D-LIB8M pose map). Bottom or top pauses that
Motra gives in a 3-number tempo (its tooltip order eccentric, bottom pause, concentric, top pause) are named, not drawn
(the cards' own tempo texts; lb7/DESIGN.md:181-183).

| id | view, scale | pose map (start → end) | drawn Mistake key (claim) | topFault (card) | tempo phases (card up/down/pause) |
|---|---|---|---|---|---|
| low_to_high_cable_fly | front, 124 px/m (cable_fly's) | arms down and out, 40° below level, 10° ahead (c4) → hands meet at chin height in front (c5: plate.end "about face level", checkpoint "chest to face height") | `press`: the elbows bend to 90°, the hands pulled toward the face (c11) | lean (c7), drawable false: F7 | Close 2 (move), Hold 1, Open 2 (2/2/1; c12, c15) |
| high_to_low_cable_fly | front, 124 | arms up and out, 30° above level, 10° ahead, the hands under the pulleys (c4) → hands meet 10 cm below the chest landmark (c5) | `cross`: each hand 8 cm past the midline, the right in front (c8) | the arms behind the torso at the start, or lean (card topFault at CARD FIELDS); drawable false: F7 | Close 2, Hold 1, Open 2 (2/2/1; c12) |
| machine_lateral_raise | front, 146.29 | arms at the sides, pads just above the elbows (c3) → upper arms horizontal ±5° (c5) | `high`: arms raised past level, about 14° [est] (c5) | rushing or momentum per card; drawable false: F7 | Raise 2, Hold 1, Lower 3 (2/3/1; c13; Motra's bottom pause c16 named) |
| rear_delt_fly | front, 146.29 | arms forward at shoulder height, handles near the midline (c2) → arms out in line with the shoulders (c5) | `shrug`: scapulae 5 cm up (c17) | rushing (c19); drawable false: F7 | Pull 1, Hold 1, Return 3 (1/3/1; c14, c18; Motra's bottom pause named) |
| hip_abduction | front, 146.29 | knees together, pads on the outer thighs (c1, c4) → legs apart about 30° [est] (c3, c4) | `short`: the knees open only about 10° (c12) | per card; drawable false: F7 | Push out 2, Hold 1, Return 2 (2/2/1; c10 bottom pause named) |
| hip_adduction | front, 146.29 | legs apart to a light stretch about 30° [est] (c2) → pads nearly touching (c3) | `wide`: the start spread to about 45° (c2) | per card; drawable false: F7 | Squeeze 2, Hold 1, Return 2 (2/2/1; c9 bottom pause named) |
| smith_machine_squat | side, 146.29 | standing, bar on the upper traps (c1), mid-soles 11 cm ahead of the rail (c2) → thighs parallel (c6; drawn thigh 1.1° below level) | `under`: the feet back under the rail, same hips and trunk, so the knees sit far past the toes (c3) | `under` (drawable true) | Lower 3, Drive up 1 (1/3/0; c22: Motra's 1 s bottom pause named) |
| smith_machine_shoulder_press | side, 146.29 | bar just short of lockout over the head (c6, c8) → upper arms level, elbows about 10 cm in front of the shoulders (c5, c6), bar passing the nose (c3) | `flare`: the elbows out level with the shoulders, at the shoulder's z (c10, c5) | `flare` (drawable true) | Lower 2, Press 2 (2/2/0; c19 bottom pause named) |
| smith_machine_incline_press | side, 146.29 | bar on straight arms over the upper chest (c1, c4) → bar touching the upper chest, elbows 60° from the torso (c3: 45-75°) | `flare`: the elbows level with the shoulders (c6, c3) | `flare` (drawable true) | Lower 3, Press 1 (1/3/0; c14 bottom pause named) |

The F7 rows' topFault keys come from each card's rankNote at CARD FIELDS; each differs from the drawn key (A7).

### 19.3 Facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2; contacts at both ends of a segment, PANELS §3)

Drafted from the copied quotes (every quote verbatim from docs/research/howto/quotes/<id>.json). The builder's calls on
the rows a draft marked open, each with its reason:
- Hands on the handles at the end (low_to_high c5, rear_delt c4): **not facts**. "until the handles are in front" and
  "pull the handles back" place the hands; they do not say they touch (PANELS §3). The start wrist contacts stand.
- hip_adduction's pads: "against inner thighs above knees" gives **`knee.r`, `knee.l` only** at the start (the hip end is
  not above the knee). c3's end squeeze does not say "against": not a fact. A3's both-ends pad check is a drawn-item
  test on the composer, not a fact.
- Footrests (both hip rows): **`sole.r`, `sole.l`** (one point per foot on a footrest; smith_machine_bench_press's
  form for "feet flat").
- smith_machine_incline_press start: "Lie back" names no surface: **not a fact**; "feet flat" has one surface, the floor:
  **`sole.r`, `sole.l`**. End: "touches your upper chest": **`sternum`** (the upper-chest landmark, 5.5 cm above `chest`);
  `sh.r.elev 60`, `sh.l.elev 60` (incline_barbell_bench_press's 45-75 midpoint form).
- Bench angles (shoulder press ~70, incline 30-45): no measure callout, so **no fact** (incline_dumbbell_curl's form).
- smith_machine_shoulder_press c6 Motra "elbows at 45 degrees": **not a fact** (the bar-to-chest end the card sets aside).

Rules applied, as lb6/DESIGN.md:183-185 and PANELS.md:175-190 state them:
- Every number and contact a quote gives for a drawn pose. A setup quote states the start pose only (D-LIB9-FACTPOSE).
  A non-setup quote takes the pose(s) whose plate.start/plate.end cite its claim **for that item** (the item-level reading
  is the precedent: machine_crunch c2 is cited by both poses, yet the shins are start-only because "plate.end does not"
  name them, lb6/DESIGN.md:196). A contact is never carried to another pose by inference.
- "both"/a plural paired part states each side (#289 6342086947); a hand contact is checked at the wrist (PANELS.md 7).
- A contact along a segment is checked at both ends (the thigh at hip and knee); a back on a pad ends at `buttock`
  (D-LIB11-SACRUM); "Sit on the <machine/bench>" gives `seat` (leg_extension c1, seated_calf_raise c1 precedent).
- Upper arm "horizontal"/"level with"/"in line with the shoulders" = `sh.<s>.elev` 90 against the upright trunk
  (cable_lateral_raise c7, dumbbell_front_raise c8, resistance_band_pull_apart c4/c5 precedent).
- A range [a, b] with b − a ≥ 4 is written as its midpoint with a note. An "or" is not a fact (D-LIB17-ORCHOICE,
  lb8/DESIGN.md:212, :486). A segment-to-floor angle has no PANELS.md 7 joint (lb8/DESIGN.md:212).
- An equipment number is a fact only with a measure callout (D-LIB8M-FACTS scope, lib4-cards :4123).
- Pose map: identity on all 9 rows (spec start = plate.start, spec end = plate.end), so `pose` = `cardPose` throughout.
- UNSURE marks a row where I could not settle whether a rule applies; the builder decides and records why.

#### low_to_high_cable_fly (front; start = arms open, end = hands meet)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Position the cable handles level with the region between your knees and hips, and grasp each handle firmly." (c1, setup); also "grip each handle" (c3 puregym, setup) | `contact wrist.r`, `wrist.l` ("each handle": both) | start (start) |
| UNSURE: "Squeeze the chest muscles to bring your arms back up and in front until the handles are in front of your chest." (c5 puregym; plate.end cites c5) | `contact wrist.r`, `wrist.l`, if "bring ... until the handles are in front" counts as the hands on the handles (cable_fly c8 precedent: "Press the cable handles so they are in front of your chest" gave end grip contacts). Against: PANELS "a quote that places the item ... without saying it touches does not support the fact". | end (end) |

Not facts:
- c1 "between your knees and hips", "lowest setting": equipment height, no measure callout (D-LIB8M-FACTS).
- c3 "staggered-stance position ... with one leg forward": no contact word (no floor named).
- c4 "do not allow your hands to move past the midline of your body (level of your armpit)": a limit place, not a touch; no number. c4/c6 "slight bend in your elbows", "neutral wrist": no number.
- c5 ace "until your hands meet level with your face or above your head": hand on hand (no fact kind) and an "or" (D-LIB17-ORCHOICE); c5 puregym "in front of your chest" disagrees (card draws face level).
- c10 "Start by pressing the cable handles together in front of your chest, palms facing each other.": c10 is not cited by plate.start/end; palms facing: no number.
- c16 "only go as far as hands in line with chest": c16 not cited by plate.start/end; a place.

#### high_to_low_cable_fly (front; start = arms open, end = hands meet)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Position the cable handles approximately level with the top of your head and grasp each handle firmly." (c1, setup) | `contact wrist.r`, `wrist.l` | start (start) |

Not facts:
- c1 "approximately level with the top of your head": equipment height, no number.
- c1 "Assume a staggered-stance position": no contact word.
- c3 "slight bend in your elbows", "neutral wrist position": no number.
- c4 "do not allow your hands to move past the midline of your body (level of your armpit)": a limit place; no number.
- c5 "until your hands meet below the level of your chest": hand on hand (no fact kind); the quote names no handle, so no end hand-on-handle contact; "below" gives no number.
- c6, c8, c9 (bent-forward crossover tips): not cited by plate.start/end.

#### machine_lateral_raise (front; start = arms at sides, end = upper arms horizontal)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit with back against pad, place arms on pads with elbows slightly bent and feet flat on floor." (c2, setup; plate.end cites c2 for the back) | `contact seat`; `contact backUpper`, `buttock` (D-LIB11-SACRUM) | seat: start; back: start (start) and end (end) |
| same c2 quote, "feet flat on floor"; "Keep your feet flat on the floor, shoulder-width apart." (c2 vg) | `contact heel.r`, `ball.r`, `heel.l`, `ball.l` | start (start) only: plate.end names the back, not the feet (crunch c2 item-level precedent) |
| "the pads resting just above the elbows." (c3 ace); "Adjust the machine so that the pads are leaning against your elbows." (c3 sl); setup c3 | `contact elbow.r`, `elbow.l` (machine_pullover c3 precedent: pads at the elbows) | start (start) |
| "Grip handles if available and engage core." (c3 mo, setup) | `contact wrist.r`, `wrist.l` | start (start) |
| "Lift your arms out to your sides, until your upper arms are horizontal." (c5 sl); "until your elbows are even with your shoulders" (c5 laf); also "raise to parallel with floor" (c6 mo) | `angle sh.r.elev 90`, `angle sh.l.elev 90`, claim c5, note "upper arm horizontal, read as shoulder elevation 90 against the upright trunk (PANELS.md 7's sh.r.elev reading)" | end (end) |

Not facts:
- c1 "shoulders align with machine's pivot point", "shoulders are level with the handles": a place relative to the machine, not a touch; a drawn-item test.
- c2 "elbows slightly bent": no number. c2 vg "shoulder-width apart": a width (and front view: the composer's foot width, a size).
- c4 "lift the pads upward by pressing out through the elbows": c4 is not cited by plate.end, so no end elbow-pad contact (not carried by inference). UNSURE whether the builder wants a research follow-up; the composer holds the pads on the arms anyway (A3).
- c5 vg "parallel to the floor, or slightly higher": an "or" (D-LIB17-ORCHOICE); the card follows Motra.
- c5 mo "Raising arms above shoulder level", c6 "Avoid excessive shrugging": faults, no number.
- c15 ace "Sit facing the machine ... Keeping the arms bent at 90 degrees": the other machine kind (ACE faces the machine; the card draws Motra's back-on-pad kind), and c15 is not cited by plate.start/end (machine_crunch mo-crunch precedent).
- c9 "Stop just before the weight stack rests": equipment on equipment.

#### rear_delt_fly (front; start = arms forward, end = arms out to the sides)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit facing the machine with chest pressed against the pad and handles adjusted to shoulder height." (c1 mo, setup) | `contact seat`; `contact chest` (world-coordinate contact, D-LIB16R2-PECDECK) | start (start) |
| "Keep your chest in contact with the pad throughout the movement." (c6 mo; plate.end cites c6 for the chest) | `contact chest` | end (end) |
| "Grasp the handles with a neutral or overhand grip, keeping elbows slightly bent." (c3 mo); "grab the handles with an overhand or neutral grip at shoulder height" (c2 fv, setup) | `contact wrist.r`, `wrist.l`, claim c3 | start (start) |
| "Extend your arms straight in front of you and grab the handles ... at shoulder height." (c2 fv, setup); "grip the handles at shoulder height" (c2 sl) | `angle sh.r.elev 90`, `angle sh.l.elev 90`, claim c2, note as resistance_band_pull_apart c5 ("arms extended forward at shoulder height") | start (start) |
| "Exhale and pull the handles back in a wide arc until arms align with shoulders." (c4 mo); "Pull until arms are inline with shoulders" (c5 mo) | `angle sh.r.elev 90`, `angle sh.l.elev 90`, claim c4 (pull_apart c4 precedent "until arms align with shoulders") | end (end) |
| UNSURE: same c4 quote "pull the handles back" (plate.end cites c4 for the arms) | `contact wrist.r`, `wrist.l` if "pull the handles" states the hands on the handles at the end (cable_fly c8 precedent); plate.end names the arms, not the hands | end (end) |

Not facts:
- c1/c2 "handles adjusted to shoulder height": equipment height, no number (held by the sh.elev 90 start fact).
- c3 "slight bend in your elbows", "shouldn't be extended straight", "don't bend your elbows too much": no number.
- c5 fv "Your elbows should be behind your torso at the top.": the end point the card set aside (card follows Motra).
- c7 "upright torso", "neck in a neutral position": no number.
- c8 "scapular retraction", c17 "Shrugging shoulders": faults, no number.
- c13 "Do not let the weight stack at the bottom": equipment; c14/c18 seconds: tempo, not a pose.

#### hip_abduction (front; start = knees together, end = legs apart)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit on the hip abduction machine with back against the pad, feet on footrests, and pads snug against outer thighs." (c1, setup) | `contact seat`; `contact backUpper`, `buttock` | start (start) |
| "Back flat against pad" (c5; plate.end cites c5 for the back) | `contact backUpper`, `buttock` | end (end) |
| same c1 quote, "feet on footrests" | `contact sole.r`, `sole.l` (UNSURE landmark: `sole` vs `heel`+`ball`; depends on the footrest shape in hipAbdAddMachine) | start (start) |
| same c1 quote, "pads snug against outer thighs" | `contact hip.r`, `knee.r`, `hip.l`, `knee.l` (the thigh at both ends, PANELS; card A3 "leg pads on the outer ... thighs, each contact checked at both segment ends") | start (start) |
| "Exhale and push legs outward against pads, squeezing outer hips." (c3; plate.end cites c3) | `contact hip.r`, `knee.r`, `hip.l`, `knee.l` | end (end) |
| "Grip handles for stability and engage core." (c2 mo); "sit down, and grip the handles." (c2 sl, setup) | `contact wrist.r`, `wrist.l` | start (start) |

Not facts:
- c1 "Adjust seat for knees to align with pivot point.": a place relative to the pivot, not a touch; a drawn-item test.
- c4 "From knees together": knee on knee (no fact kind); "full comfortable hip abduction", c3 "comfortably apart", "as far as possible": no number.
- c5 "Keep upper body still throughout.", "No momentum": no number.
- c12 "Letting pads crash together": equipment on equipment, a fault.
- Feet at the end: plate.end does not name them (item-level), so start only.

#### hip_adduction (front; start = legs apart, end = thighs together)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit on the hip adduction machine with back against the pad, adjust thigh pads against inner thighs above knees, feet on footrests, and grip side handles." (c1, setup) | `contact seat`; `contact backUpper`, `buttock`; `contact wrist.r`, `wrist.l`; `contact sole.r`, `sole.l` (UNSURE landmark, as hip_abduction) | start (start) |
| same c1 quote, "thigh pads against inner thighs above knees" | `contact hip.r`, `knee.r`, `hip.l`, `knee.l` per card A3 (both segment ends). UNSURE: "above knees" puts the pad on the lower thigh only, so the hip end may not touch; alternative `knee.r`, `knee.l` only. Needs the builder's call (A3 says both ends). | start (start) |
| "Keep back flat against pad" (c4; plate.end cites c4) | `contact backUpper`, `buttock` | end (end) |
| UNSURE: "Exhale and squeeze thighs together to bring pads inward until they nearly touch." (c3; plate.end cites c3) | `contact hip.r`, `knee.r`, `hip.l`, `knee.l` (or knee only, as above), if "squeeze thighs together to bring pads inward" states the thighs on the pads (it does not say "against") | end (end) |

Not facts:
- c1 sl "sit down with your legs outside the pads": restates the setup; no new landmark.
- c2 "light stretch in inner thighs", "Avoid excessive stretch": no number.
- c3 "until they nearly touch": pad to pad, equipment on equipment; no number. c2 "adduct until pads lightly touch": the same.
- c4 "Keep spine neutral", "Keep movements slow": no number. c4 "Arching back off pad": a fault.
- c5 "Use weight selector pin securely.": equipment.

#### smith_machine_squat (side; start = standing, end = bottom)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Step underneath and position it across your upper traps, not on your neck." (c1, setup) | `contact trap.r`, `trap.l` | start (start) only: plate.end does not cite c1; the end bar-on-traps is a clearance exemption (D-LIB16R2-CLEAR), not a fact |
| "Grip the bar just outside your shoulders and rotate it forward to unlock." (c5, setup) | `contact wrist.r`, `wrist.l` | start (start) |
| "Keep your chest up, spine neutral, and heels grounded." (c6; plate.end cites c6 for "heels down") | `contact heel.r`, `heel.l` ("heels": both; heels only, the quote names no ball) | end (end) |

Not facts:
- c1 "Adjust the bar so it rests just below shoulder level.": equipment height, no number; setup.
- c2 "Stand with your feet about shoulder-width apart": "stand" names no floor contact; shoulder-width is a width the side view cannot show.
- c2 "a few inches in front of the bar's path"; motra "3-6 inches forward of the bar": a foot-to-equipment distance; no fact kind for a horizontal gap and no measure callout (D-LIB8M-FACTS; lb6 cable_chest_press c1 precedent); drawn as a size.
- c2 sl "feet directly below the bar": the placement the card sets aside (c3 names it a mistake).
- c5 "Keep your wrists neutral, elbows under the bar, and chest lifted.": places, no number.
- c6 "Lower until your thighs are at least parallel to the floor, or deeper if flexibility allows.": a segment-to-floor angle with no PANELS.md 7 joint, and an "or" (lb8/DESIGN.md:212 hack_squat c5, D-LIB17-ORCHOICE); a drawn-item test.
- c7 "Stop just short of locking out your knees": c7 not cited by plate.start; no number.
- c8 "just below your lowest squat depth": equipment on equipment (stops vs bar).
- c20 "press through your heels to stand tall": c20 is cited by setup[] only for the brace; the press is the rep, not cited by plate.start/end.

#### smith_machine_shoulder_press (side; start = bar near lockout over the head, end = bar lowered in front of the face)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit with back against the pad, feet flat on the floor." (c4 motra, setup); "press your upper back into the bench" (c4 fv) | `contact seat` (start only); `contact backUpper`, `buttock` | back: start (start) and end (end; plate.end cites c4 "back still on the pad"); seat: start |
| same c4 quotes, "feet flat on the floor" / "Plant your feet flat on the ground" | `contact heel.r`, `ball.r`, `heel.l`, `ball.l` | start (start) only (plate.end names the back, not the feet) |
| "Grip the bar slightly wider than shoulders with palms forward." (c5 motra, setup); "Wrap your thumbs around the bar." (c13, setup) | `contact wrist.r`, `wrist.l`, claim c5 | start (start) only (plate.end cites c5 for the elbows, not the hands) |
| UNSURE: "Position an adjustable bench at ... roughly 70-degree angle" (c1 fv) | `angle measure:true 70` only if the plate draws a measure callout (incline_dumbbell_press c1 precedent); proposed no callout, so no fact | start |

Not facts:
- c1 motra "bench at 90 degrees": the other setup the card set aside.
- c2/c3 "just enough room to pass your nose", "The bar should be able to just miss your nose": a gap, no fact kind (lb6 ccp c5 precedent); held by the clearance test.
- c5 "wider than shoulder width": a width the side view cannot show. c5 "elbows should be in front of your shoulders but not directly in front of you": a place, no number.
- c6 fv "stop just short of full arm extension": no number.
- c6 fv "upper arms should be roughly parallel to the floor or slightly below": an "or" (D-LIB17-ORCHOICE), "roughly", and a segment-to-floor angle with no joint (on a ~70° back pad `sh.elev` is not 90); a drawn-item test.
- c6 motra "lower the bar slowly to upper chest, elbows at 45 degrees" and sl "lower it to ... the top of your chest": the end point the card's claim text sets aside ("StrengthLog and Motra lower the bar to the top of the chest"); plate.end does not state 45 (22's scope: a set-aside quote is not a fact). UNSURE only in that c6 is cited by plate.end as a claim; the 45° belongs to Motra's 90° bench and bar-to-chest end, not the drawn face-level end.
- c7 stops; c8 "Rotate your wrists forward to unlock": equipment on equipment; getting in and out.
- c18 "rest on the heel of your palm, close to your wrists": c18 not cited by plate.start/end (the wrist fact already covers the hand).

#### smith_machine_incline_press (side; start = bar on straight arms, end = bar touching the upper chest)

| quote (claim) | proposed plateFacts | pose (cardPose) |
|---|---|---|
| "Sit on an inclined bench, pull your shoulder blades together and down, and hold your chest up." (c2 sl, setup) | `contact seat` | start (start) |
| UNSURE: "Lie back with feet flat, grip bar slightly wider than shoulders, and unrack by rotating." (c4 motra, setup) | `contact backUpper`, `buttock` if "Lie back" counts as the back on the bench (smith_machine_bench_press took them from c1 "Lie on the bench", which names the bench; this quote does not) | start (start) |
| same c4 quote, "feet flat" | `contact heel.r`, `ball.r`, `heel.l`, `ball.l` (UNSURE: the quote names no floor; smith_machine_bench_press used `sole` for "feet flat on the floor", lb6 ccp used heel+ball) | start (start) |
| "Grip the bar slightly wider than shoulder-width apart." (c2 sl); same c4 quote (setup) | `contact wrist.r`, `wrist.l`, claim c2 | start (start) |
| "Lower the bar with control until it touches your upper chest." (c3 sl); "Touch bar lightly to chest without bouncing." (c3 motra) | `contact sternum` (the upper chest: `sternum` sits 5.5 cm above `chest`, body.mjs:166). UNSURE landmark: smith_machine_bench_press used `chest` for "touches your chest" | end (end) |
| "Inhale and lower bar controlled to upper chest, elbows at 45-75 degrees." (c3 motra) | `angle sh.r.elev 60`, `angle sh.l.elev 60` ("elbows": both), note "c3 \"elbows at 45-75 degrees\"; 60 is the midpoint of 45-75" (incline_barbell_bench_press c7 precedent: 45-75 → sh.r.elev 60; range 30 ≥ 4). UNSURE: this quote lacks that precedent's "relative to your torso" | end (end) |
| UNSURE: "Position an adjustable incline bench at 30-45 degrees" (c1) | a measure fact only if the plate draws a callout; then the range rule gives 37.5 while plate.equipment draws 30 ("at 30 degrees, inside the 30-45 range"), a clash that needs a ruling. Proposed: no callout, so no fact (lb5 incline_dumbbell_curl precedent) | start |

Not facts:
- c1 "aligning the bar over your upper chest": a place, not a touch. c1 "Avoid angles over 45 degrees": a limit, equipment.
- c2 "pull your shoulder blades together and down, and hold your chest up": no number.
- c5 "Set the safety stops just below your lowest movement point", motra "just above chest": equipment on equipment / a gap.
- c6 "Arching back excessively", "Locking elbows at top": faults, no number.
- c12 "Lower bar until it touches upper chest near clavicles": c12 not cited by plate.start/end (it supports the `sternum` choice only).
- Start "straight arms": no quoted number.

### 19.4 Unsourced numbers (13.3 must-fix 14; never sized to pass a bar, Q-D5-3)

| id | numbers no claim gives (drawn value) |
|---|---|
| low_to_high_cable_fly | STAGGER 0.20 m and FOOT_X 0.12 m (the stagger needs a narrower base for both feet to sit within 0.3 cm); OPEN_DOWN 40°, OPEN_ANGLE 10°; the pulley at the knee-hip midpoint (0.706 m; c1 gives the band); the end at chin height (1.519 m); ELBOW 20°, CLOSE_GAP 0.05, MIS_ELBOW 90°, MIS_POLE (cable_fly's); COL_X/W/H, COL_Z, HANDLE (cable_fly's) |
| high_to_low_cable_fly | as above, with OPEN_UP 30°, the pulley at the crown (1.743 m; c1 "about the top of the head"), END_DROP 0.10 m, MIS_CROSS 0.08 m, MIS_DZ 0.06 m (at the panel fix: MIS_CROSS 0.11 m, MIS_DY 0.06 m, FIST_R 0.035 m; 19.15) |
| smith_machine_squat | FEET_AHEAD 0.11 m (inside c2's 7.6-15.2 cm); FOOT_X, TOE_OUT, GRIP_X, BAR_T (the 8's); the end hip height 0.43 m and trunk 28° (thighs parallel, drawn 1.1° below level); the rig's sizes (eq/smith.mjs); STOP_BELOW 0.02; PLATE_D 0.45 |
| smith_machine_shoulder_press | back pad 20° from vertical (c1 "roughly 70 degrees" from the floor); GRIP_X 0.30; TOP_ELBOW; the bar's 1.4 cm (2 px) gap in front of the nose (c3 "just miss"); the end elbow 9.8 cm in front of the shoulder; the rig's sizes |
| smith_machine_incline_press | back pad 60° from vertical (card equipment: 30°); GRIP_X 0.30; END_ELEV 60° (c3: 45-75°); the touch height on the upper chest (incline_barbell_bench_press's); the rig's sizes |
| machine_lateral_raise | the over-raise (~14° past level, [est]); the composer's sizes (19.6) |
| rear_delt_fly | MIS_ELEV 5 cm (the shrug size); ELBOW 20° |
| hip_abduction, hip_adduction | the end and start spreads (~30°), the Mistake spreads (~10° and ~45°); the composer's sizes |

### 19.5 Clearance table (D-LIB16R2-CLEAR; 2 px on the plate in every drawn pose)

What binds: every load part and every machine part that sits at the body's depth. Parts that stand beside the body in
x (a side view's rods, hook rails, frame and plates; a front view's columns behind the body) are drawn at z 'back' and
cross the outline only in projection, so they are listed as depth, not tested (the D-LIB15R2-BARSTART amendment's form:
the shaft binds, the end-on plate circle does not). The card's own contacts are the exceptions, each named. Measured on
the drafts (plate px):

| id | part, body region | contacts excepted (claim) | start / end / Mistake | 0-value mutation |
|---|---|---|---|---|
| low_to_high_cable_fly | each cable, head | the handle in the hand (c3) | 119.3 / **11.9** / 11.9 | the end at nose height |
| low_to_high_cable_fly | each cable, legs (thigh, shank, foot) | | 76.9 / 45.6 / 45.6 | the pulleys at the floor |
| high_to_low_cable_fly | each cable, head | | 90.8 / 37.7 / 32.2 | the pulleys at shoulder width over the head |
| high_to_low_cable_fly | each cable, legs | | 130.4 / 28.6 / 29.5 | the end at knee height |
| both cable flies | cable over the torso and arms | none: the hands are in front of the body (depth); the cable runs from a column behind to a hand in front, so in the front view it crosses the shoulder and arm in projection | not tested | |
| smith_machine_squat | bar shaft (r 2.5 cm), the neck (the torso outline beyond the `neck` landmark along the lumbar→neck axis) | the upper traps (c1) | **5.06** / 5.06 / 5.06 | BAR_T at the neck landmark |
| smith_machine_squat | bar shaft, head | | 12.8 / 12.8 / 12.8 | |
| smith_machine_squat | stop | depth: the stop is on the rails beside the body; drawn in front as smith_machine_bench_press's (D-LIB11-PANEL1) | not tested | |
| smith_machine_shoulder_press | bar shaft, head (the nose) | none | **2.0** [est] in every pose (the rail set 2 px in front of the frontmost head point) | the rail on the nose line |
| smith_machine_shoulder_press | bar shaft, legs and trunk | the hands on the bar (c5) | [at draw] | |
| smith_machine_incline_press | bar shaft, head and neck | the upper chest at the touch (c3) | [at draw] | the touch at the neck |
| machine_lateral_raise | arm pads, levers, handles vs head and trunk | the pads just above the elbows (c3), the hands on the handles (c3), the back on the pad, the seat | [at draw] | a pad 2 cm into the arm |
| rear_delt_fly | levers and handles vs head | the hands on the handles (c2); the chest pad (c1, c6; world fact, D-LIB16R2-PECDECK) | [at draw] | |
| hip_abduction | leg pads vs the other leg and the trunk | the pads on the outer thighs (c1), the feet on the footrests, the back on the pad, the seat, the hands on the handles (c2) | [at draw] | a pad 2 cm into the thigh |
| hip_adduction | as hip_abduction, inner thighs (c1) | | [at draw] | |

### 19.6 Composers (wave 2; D-LIB16R2-COMPOSERS; pecDeck's pattern: frontBar, perItem; PRIMITIVES only; no file reads)

**latRaiseMachine** (`eq/latRaiseMachine.mjs`, front view; anchor machine_lateral_raise). Parts and sizes (lb6/sizes.json
`latRaiseMachine`; assumed, typical commercial machine):
- static: seat 36 cm wide (`seat`), back pad 30 × 70 cm (`backPad`, z 'back'), centre column 8 cm and a top housing 7 cm
  (`frontBar`), the two pivot bosses r 4 cm level with and in front of each shoulder joint (c1; `pulley`, z 'back');
- moving (`part: 'arm'`, each with `poly`, PQ-H9): each lever (`poly` bar 5 cm) from its pivot along the upper arm's
  outer side, the arm pad (`poly`, 6 × 18 cm) on the outer upper arm just above the elbow (c3), and the handle (`poly`
  13 cm) at the hand. Drawn in the Mistake view (the over-raise moves them).

**hipAbdAddMachine** (`eq/hipAbdAddMachine.mjs`, front view, seated; anchor hip_abduction; both users on the LB6 sheet).
Option `side: 'outer' | 'inner'`.
- static: seat, back pad, centre column (as above), two footrests under the feet (`box`), two side handles by the
  hips (`poly`), the pivot housing under the seat front;
- moving (`part: 'leg'`, `poly`): each leg arm from the housing to its knee pad, and the knee pad (`poly`, 8 × 20 cm)
  on the outer (abduction) or inner (adduction) thigh just above the knee (c1). Drawn in the Mistake view.
- Contacts checked at both segment ends: the pad against the thigh at the knee and 15 cm up the thigh.

Tests (A3): per drawn pose each static part at one place (±1 px); each moving part carries `poly` and is drawn in the
Mistake view; both listed under "LIB-16" in tests/howto/fixtures/eq-composers.json; every lane's A16 block stays green.

### 19.7 PQ-H3 (deviationMin 11.39 px, traceLenMin 22.11 px; qa/envelope.json) and zooms

| id | Mistake deviation | Trace | zoom |
|---|---|---|---|
| low_to_high_cable_fly | **20.0 px** (draft, runQa) | **80.6 px** | none |
| high_to_low_cable_fly | **8.3 px** with the draft's elbow tells; with the tell on the crossing hand, the hand moves 13 cm (−5 → +8 cm): **16.1 px** (computed, x only) | **85.5 px** | none expected. If the panel wants the tell on the elbows: Mistake zoom k 1.5 measured **12.38 px** at circle (258, 278), source (160.22, 182.99) r 34.67; k 2 16.51 px |
| smith_machine_squat | **16.4 px** (draft) | **50.1 px** | none |
| smith_machine_shoulder_press | ~14.3 px [est: the elbow 9.8 cm forward → 0] | ~50 px [est] | none [est] |
| smith_machine_incline_press | ~24 px [est: 60° → 90° elevation] | ~45 px [est] | none [est] |
| machine_lateral_raise | ~20 px [est: 14° past level; card scratch 16.5 px at 110°] | over 60 px [est] | none [est] |
| rear_delt_fly | **8.0 px** (draft, the shrug at 5 cm on `shoulderTop.r`; card scratch 7.31) | **93.8 px** | **Mistake zoom k 1.5** (the smallest rung): **12.05 px** in the circle at (72, 264) r 52, source (145.85, 179.56) r 34.67; no H2/H3/H4.zoom key raised; k 2: 16.07 px, same place. S4 does not apply: the housing over the shoulders leaves the lower left free |
| hip_abduction | ~15 px [est: 10° → 30°, card scratch knee 31.4 px at 30°] | ~31 px [est] | none [est] |
| hip_adduction | ~20 px [est] | ~31 px [est] | none [est] |

### 19.8 Expected flags (lb6/qa.mjs EXPECTED; flags never gate, D-LIB8FIX-ENV)

- F5 on all 9 at 3.57 (D-LIB9-F5).
- F7 on the 6 drawable-false ids (D-LIB16R2-F7): low_to_high_cable_fly, high_to_low_cable_fly, machine_lateral_raise,
  rear_delt_fly, hip_abduction, hip_adduction; each topFault differs from the drawn key.
- Seen on the drafts and to be fixed or named at PLATES READY: F2 0.6 on both cable flies (columns at the plate's
  edges, coverage over 0.549: cable_fly's form; proposed named, D-LIB16-F2CCP's form), F2 0.177 on the squat (a
  standing side figure, under 0.191; proposed named). F3 and F4 are layout and are fixed by boxes where a box clears
  them; any other flag is posted with its value and range.

### 19.9 R10 items (tier A)

smith_machine_squat, smith_machine_shoulder_press, smith_machine_incline_press: R10 scored at panel (wave 1).

### 19.10 Risks found while measuring

- **high_to_low_cable_fly's crossing** clears the bar only when the tell sits on the crossing hand (16.1 px); on the
  elbows it is 8.3 px and takes the k 1.5 zoom measured above. Proposed: the tell on the hand, no zoom.
- **The squat's stop is hidden at depth.** At the bottom the stop sits on the rail line under the bar, inside the
  side-view outline of the upper back. Drawn at z 'back' it is invisible; drawn in front it covers the back as
  smith_machine_bench_press's stop covers the chest (pinned, D-LIB11-PANEL1). Proposed: in front, as the anchor.
- **Front-view hands at chin height** (low_to_high) cover the chin, not the face; card truth holds ("about face
  level"; checkpoint "chest to face height"). A critic's finding on it goes to the supervisor.
- **The stagger** shows only as depth in the front view (both cable flies); drawn because c3 states it.

### 19.11 Questions for 'LB6 R2 PLAN RULED'

1. The clearance scope of 19.5: depth parts (side-view rods, hook rails, frame, plates; front-view columns; the
   cables' crossing of the torso and arms) are listed, not tested; the squat's neck is the torso outline beyond the
   `neck` landmark along the lumbar→neck axis.
2. The squat's and the shoulder press's stops drawn in front (the bench press anchor's form).
3. The F2 values in 19.8 named (cable flies over the range, squat under it).
4. The facts calls in 19.3 (hands at the end not facts; hip_adduction knee-only pads; `sole` on footrests; the
   incline's `sternum`).

### 19.12 Wave 1, built (after 'LB6 R2 PLAN RULED', #354 6543628951)

Specs: `specs/{low_to_high_cable_fly, high_to_low_cable_fly, smith_machine_squat, smith_machine_shoulder_press,
smith_machine_incline_press}.mjs`, each with its header (clone sources, claims, geometry, labels) and an exported
`SIZES` equal to `lb6/sizes.json` `r2`; tempo rows in `lb6/tempo.json` `r2`; rows appended to `lb6/rows.json` (mode H,
stage drawing). Changes from the PLAN drafts:
- high_to_low_cable_fly: the tell `cross` sits on the crossing hand (ruled), one arrow under the hand; no zoom.
- smith_machine_squat: the Mistake feet keep the start's knee pole, so they sit flat (0.2 cm; without it 0.8 cm, over
  the engine's 0.5 cm); a second tell `knees` (the knees far past the toes, the card's own consequence, c3).
- smith_machine_shoulder_press: the end upper arm 10° below level (c6 "or slightly below"), where the bar reaches
  nose height (1.167 m against the nose tip at 1.172 m), so the bar passes the nose (c3); the stop is the composer's
  default 6 × 4 cm collar, so it stays off the face (the bench press anchor's 25 cm catch would cross the chin).
- smith_machine_incline_press: the touch on the upper chest solved from the elbows at 60° (c3) with a plumb forearm
  (LB2's), thorax height 0.777 H; the rail at the touch's z.

Clearance (A5, plate px, min over poses; the shoulder press and incline along the bar's whole path in 1 cm steps):
cable to head 11.9 (low_to_high) and 32.2 (high_to_low); cable to legs 45.6 and 28.6; squat bar shaft to neck 5.06,
to head 12.8; shoulder press bar shaft to head 2.20, to neck 8.3; incline bar shaft to head 24.2, to neck 22.7.

Authoring QA (`lb6/qa.mjs`, node and browser, page `13de1bad…9b1ca1`, two equal builds):

| id | hard checks | raised flags | pxPerM | leaderMax | traceLen | deviation |
|---|---|---|---|---|---|---|
| low_to_high_cable_fly | all pass but H6:no-card (before CARD FIELDS) | F2 0.628, F3 46.3, F5 3.57, F7 | 124 | 46.3 | 80.6 | 20.0 |
| high_to_low_cable_fly | as above | F2 0.628, F3 90.3, F5 3.57, F7 | 124 | 90.3 | 85.5 | 16.1 |
| smith_machine_squat | as above | F2 0.177, F5 3.57, F7 (no card topFault yet) | 146.3 | 70.8 | 50.1 | 15.9 |
| smith_machine_shoulder_press | as above | F5 3.57, F7 (no card topFault yet) | 146.3 | 75.7 | 42.2 | 14.9 |
| smith_machine_incline_press | as above | F5 3.57, F7 (no card topFault yet) | 146.3 | 75.0 | 49.6 | 23.8 |

F3 on both cable flies is proposed as a named flag (the leaders' lengths, LB5 17.3's form; F3's range 49.33-82.26).
The smith rows' F7 and every row's H6:no-card clear at CARD FIELDS (topFault `under`, `flare`, `flare`).

### 19.13 Card fields (Do 4; after 'LB6 R2 PLAN RULED')

The 3 keys appended last on all 9 cards (each card's other keys unchanged: cards.sha.json `r2` still matches):
`plateFacts` as 19.3 with the ruled calls, `tempo` the 19.2 strip from each card's plate.tempo, `topFault` the key of
handlingMistakes[0]: low_to_high_cable_fly `lean`, high_to_low_cable_fly `lean`, machine_lateral_raise `swing`,
rear_delt_fly `rush`, hip_abduction `jerk`, hip_adduction `swing` (F7, each differs from the drawn key), and
smith_machine_squat `under`, smith_machine_shoulder_press `flare`, smith_machine_incline_press `flare` (the drawn keys).
validateCardFile gives [] on all 9. Authoring QA on wave 1 with the fields: all 10 hard checks pass on all 5; flags equal
the ruled set (`lb6/qa.mjs`). The wave 2 rows' contact facts are met by their specs' checks when drawn.

### 19.14 Wave 2, built (composers, the hip rows, the lateral raise and the rear delt fly)

- **eq/hipAbdAddMachine.mjs** (anchor hip_abduction; `side: 'outer' | 'inner'`): static seat, back pad, centre column,
  floor beam and two side handles (grip and post); moving with each leg (`part: 'leg'`, all `poly`): the pad against
  the thigh, the leg arm down to the footrest, the footrest under the sole (stops 2 cm short of the midline). 14 items.
- **eq/latRaiseMachine.mjs** (anchor machine_lateral_raise): static seat, back pad, centre column, housing and the
  pivot bosses at the shoulder joints (c1); moving with each arm (`part: 'arm'`, all `poly`): the lever along the
  outside of the upper arm (from a quarter of its length; its root behind the shoulder is depth), the pad from 70 to
  95 % of the upper arm (just above the elbow, c3) and the handle at the hand. 12 items.
- Both read no file, return PRIMITIVES only and are listed under LIB-16 in tests/howto/fixtures/eq-composers.json. Each
  spec reads its pad faces from the engine's own front-view outline of the limb in that pose (the drawn pose is
  rebuilt from its knee or elbow, since the limbs move by one angle).
- hip_abduction: hips 90° flexed, knees 90°; abduction −4° (the legs' outlines meet: knees together, c4) → 30°;
  Mistake 10°. hip_adduction: 30° (light stretch, c2) → the angle where the pads stand 2 cm apart (solved by bisection: 6.51°;
  "nearly touch", c3; 2 cm is the closest at which each pad clears the other thigh by 2 px); Mistake 45°. Traces on the
  knee (trims 3 and 0 px; adduction's knee travels 0.17 m).
- machine_lateral_raise: shoulder elevation 12° → 90° in the frontal plane, elbows 20°; Mistake 110° (cable_lateral_
  raise's 20° over). rear_delt_fly: pecDeck unedited, the chest pad at the chest's depth (world contact, c1, c6), the
  elbow pole level so the upper arms stay at 90° elevation (c2, c5), end 10° ahead of the side line (upper arm in the
  frontal plane); the shrug 5 cm (5.5 cm at shoulderTop) with the Mistake zoom at k 1.5 (12.07 px; the circle now at
  (68, 96), top left, after the label boxes).
- Clearance (A5 wave 2): every lever, pad, arm, footrest and handle clears the head, and the other leg (hip rows) or
  the trunk (lateral raise pads and levers), by 2 px in every pose; the pads rest on their limbs within 1 px.
- Flags: F7 on all four (named); F3 118.5 on rear_delt_fly (the chest leader from the sternum past the frame upright;
  proposed named).

### 19.15 Panel mx12 fix round and CARD FIELDS fix (#354 6544652523, 6544339239)

- smith_machine_shoulder_press and smith_machine_incline_press APPROVED at 6c8a5c24; their 18 fragments are pinned.
- high_to_low_cable_fly (R5): each faulty hand 11 cm past the midline (the panel's places), the right 6 cm above the
  left, each on its own sphere, so the forearms cross as an X; a dashed ring at each faulty hand; one arrow per hand.
  Deviation 20.2 px at plate scale, so no zoom (a zoom there would raise H3.zoom:not-needed).
- low_to_high_cable_fly (R5): the faulty elbows aim down and a little out ([−0.3, −1, 0]), so each sits 19 px off its
  shoulder-to-hand line, under the hand; the arm lengths are the engine's. Deviation 21.7 px; F3 clears (74.3 px).
- smith_machine_squat (R2): the floor beam runs from 20 cm behind to 30 cm in front of the rod, under the rails and the
  feet (a frame part beside the body, PLAN RULED point 1). No body change.
- CARD FIELDS: machine_lateral_raise loses the end backUpper and buttock and the seat contact; rear_delt_fly loses the
  seat contact; smith_machine_shoulder_press loses the end backUpper and buttock, and its seat contact cites c6.
