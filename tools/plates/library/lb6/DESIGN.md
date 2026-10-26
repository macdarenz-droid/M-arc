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
