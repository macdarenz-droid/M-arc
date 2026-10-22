# LB5 plates: design note (LIB-15)

Card: `docs/supervisor/verify/lib-15-card.md` on `claude/sup-lib4-cards` @ `b03d88c8` (Do 1), with its D-LIB15-*
rulings and lib4-cards sections 12-31. Plan: `claude/howto-options` @ `b41ac833`. Research: the LB5 research head
`3812989f59c000705731f7944d7a1a275e86045d` on `claude/libht-research` (#286 merged as `befca2cd`; LR-29 VALID on
all 16, `lb5-research-verify.md`); the 9 cards and quotes are byte copies from it (`lb5/cards.sha.json`). Census:
`docs/howto/library/inputs/census.json` @ `4a9fd86`. Pilot A code is read and copied from #109 @ `ff7c5c4f`, never
imported or merged; LB3 patterns from #274 @ `a6f4bd07`. Base: main `5158609c` (LIB-7 #193).

Nothing here ships (D-LIB15-AHEAD): every LB5 row stays at stage `drawing` or `review` in `lb5/rows.json`, outside
`batches/`; `tests/howto/lb5-plates.test.ts` A9 enforces it. rows.json holds only drawn, non-held ids (A5).
incline_dumbbell_curl waits for pilot A on main (D-LIB15-INCLINE): it is in this note, not in rows.json.

## 1. Engine and modes

- **Engine.** Every LB5 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE):
  main's `eq/rope.mjs` and `eq/parts.mjs`, the new `eq/preacherPad.mjs`, and (incline_dumbbell_curl, once pilot A is
  on main) `eq/inclineBench.mjs`. Specs copy code from the 8 or pilot A; they never import a vendor or pilot A spec
  (D-LIB9-CLONE; A3 tests it). Every copied root finder throws on a bracket with no root; each bracket is re-derived
  and its solved value recorded in the spec header.
- **Modes: all nine are H** (plan 6.2 :714 "P2 T8 H9", :739-743: none of the 9 carries a P or T mark). No 8 or pilot
  A plate is a parent of any of them (each census row reads "new movement", closeness N), so there is no parent to
  derive from. A D spec is a parent with only PARAMS paths set (derive.mjs:4-12, :39-45 on `5158609c`), and the vendor
  engine reads only `spec.camera` of those paths (vendor/engine/plate.mjs:81-95). What each id needs outside PARAMS,
  measured against its census closest:

| id | census closest | outside PARAMS (each alone makes it H; plan 3.1:272) |
|---|---|---|
| overhead_cable_triceps_extension | lat_pulldown | pose (standing, back to a low pulley, arms overhead; the 8's is seated), the rope (no PARAMS path draws it; `bar.kind: 'rope'` is a name, the composer is not), the cable from below, tempo (1/1/2 with Hold, c21), Mistake (lower-back arch, c9) |
| dumbbell_overhead_triceps_extension | dumbbell_lateral_raise (no spec: ref-src, qa/node.mjs:156 'H6:not-engine') | no engine parent at all; pose (split stance, arms overhead), one dumbbell vertical in two hands, tempo, Mistake (arch, c9) |
| cross_body_hammer_curl | dumbbell_lateral_raise (no spec) | no engine parent; front view curl across the body, neutral grip, tempo, Mistake (wrist twist, c7) |
| cable_curl | lat_pulldown | pose (standing, facing a low pulley), a straight bar from below, tempo, Mistake (arms straight at the bottom, c13) |
| bayesian_cable_curl | lat_pulldown | pose (split stance facing away from a low pulley, arm behind the trunk), single handle, tempo, Mistake (upper arm swings forward, c5) |
| preacher_curl | machine_chest_press | the `preacherPad` (census gap), the EZ bar, pose (seated, arms on an angled pad), tempo, Mistake (arms off the pad, c5) |
| incline_dumbbell_curl | dumbbell_lateral_raise (no spec) | no engine parent; `inclineBench` (pilot A), incline pose, tempo, Mistake (elbows drift forward, c4) |
| concentration_curl | dumbbell_lateral_raise (no spec) | no engine parent; seated hinge, arm braced on the inner thigh, flat bench, tempo, Mistake (elbow in the knee, c4) |
| wrist_curl | dumbbell_lateral_raise (no spec) | no engine parent; seated, forearm on the thigh, the wrist as the moving joint, tempo, Mistake (lean or arm extension, c3) |

- **D test (Do 3).** None of the 9 could meet it: for 5 the census closest has no engine spec, and for the 4 others
  the pose, the equipment and the Mistake all differ from the parent. No reason found to post for a D row.

## 2. Per id

Anchor heads: the 8 on main (`5158609c`, golden A: lat_pulldown, machine_chest_press). Pilot A at `ff7c5c4f`, with the
owner's "Pilot a ok" (#109 6266791221, 10-19 12:10): rope_triceps_pushdown, barbell_overhead_press,
dumbbell_biceps_curl, upright_row, dumbbell_shoulder_press approved; incline_dumbbell_press and reverse_lunge held
(pilot-a/plates.json @ `ff7c5c4f`). Clone sources per D-LIB15-CLONE.

| id | tier | mode | clone source (head) | composer / primitives | hand zoom: key | view |
|---|---|---|---|---|---|---|
| overhead_cable_triceps_extension | A | H | rope_triceps_pushdown (`ff7c5c4f`: station, rope use, elbow-pinned arm solve) + lat_pulldown (main: column) + barbell_overhead_press (`ff7c5c4f`: overhead arms) | `rope` (main eq/rope.mjs), pulley, cable, stack, box/line (the column, as rope_triceps_pushdown), floor | rope: GAP (hand-rope.mjs:32); none built | side |
| dumbbell_overhead_triceps_extension | A | H | dumbbell_biceps_curl (`ff7c5c4f`: dumbbell use, hidden-part method) + barbell_overhead_press (`ff7c5c4f`: overhead pose) | vendor `dumbbell` (`axis` vertical), floor | cupped: LIB-12's key, GAP on #191 (hand-cupped.mjs:30 @ `8bea5afc`; hands/DESIGN.md:102) | side |
| cross_body_hammer_curl | C | H | dumbbell_biceps_curl + upright_row (`ff7c5c4f`: front view) | vendor `dumbbell` ×2, floor | curl, dumbbell variant, neutral (hand-curl.mjs:20; shared-key clause) | **front** |
| cable_curl | C | H | lat_pulldown (main: column, cable) + dumbbell_biceps_curl (`ff7c5c4f`: curl arm) | cableColumn or box/line column, pulley, cable, stack, a straight bar (vendor `barbell` with no plates, or `latBar` straight), floor | curl, bar variant (hand-curl.mjs:22; shared-key clause) | side |
| bayesian_cable_curl | C | H | lat_pulldown (main) + dumbbell_biceps_curl (`ff7c5c4f`) | column, pulley, cable, stack, single handle (vendor `vHandle` is a two-grip handle, so a `line`/`poly` D-handle from primitives, as plan 2.1's existing parts), floor | d-handle: GAP (hand-d-handle.mjs:22) | side |
| preacher_curl | C | H | machine_chest_press (main: seat, seated figure) + dumbbell_biceps_curl (`ff7c5c4f`: curl arm) | **`preacherPad`** (new, Do 4), vendor `seat`, vendor `barbell` end-on (EZ, D-LIB15-PREACHER), floor | ez key, curl variant (hand-ez.mjs:17; shared-key clause) | side |
| incline_dumbbell_curl | C | H, **waits for pilot A on main** | dumbbell_biceps_curl (`ff7c5c4f`) | pilot A `inclineBench` imported from main (never copied), vendor `dumbbell`, floor | curl, dumbbell variant, under (hand-curl.mjs:16; shared-key clause) | side |
| concentration_curl | C | H | dumbbell_biceps_curl (`ff7c5c4f`) | vendor `bench`, `dumbbell`, floor | curl: GAP (hand-curl.mjs:26) | side |
| wrist_curl | C | H | dumbbell_biceps_curl (`ff7c5c4f`) | vendor `bench`, `dumbbell`, floor | exempt: GAP (hand-curl.mjs:27) | side |

Every LB5 spec draws its hands as the engine fist (or pilot A's flat hand where a palm lies on a surface); no LB5
file imports anything under `hands/` (A9). Views: each card's `plate.view` equals the census `view`, so F6 is never
expected.

The 10 LB5 ids not drawn here:

| id | block |
|---|---|
| triceps_pushdown, dumbbell_biceps_curl | P rows: pilot A plates, reused as pilot A pins them (D-LIB10-PA's pattern) |
| rope_triceps_pushdown | T row: pilot A plate, reused as pinned |
| straight_bar_triceps_pushdown, single_arm_triceps_pushdown | T children of PUSHDOWN: the byte proof needs triceps_pushdown pinned, and pilot A is not on main (D-LIB10-TEMPLATES, lib4-cards :3161-3164) |
| alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, reverse_curl | T children of CURL: the byte proof needs dumbbell_biceps_curl pinned (same rule) |

## 3. Templates

None. No family is proposed T here (the PUSHDOWN and CURL children are not on this card).

## 4. Composer (Do 4)

- **preacherPad** (`eq/preacherPad.mjs`; user and anchor preacher_curl; single use, plan 2.1:141). A preacher bench's
  arm pad seen side-on, as preacher_curl's card names it (c1, c2): an upholstered wedge whose sloped front face carries
  the backs of the upper arms and whose top edge sits under the armpits, with the chest against its back face; on a
  post to a floor base. Built in LB3's romanChair pattern: `(lm, ctx) => item[]`, PRIMITIVES types only (`poly` for the
  pad, `eq/parts.mjs` `sideBar` for the post and the base), no file reads. Options: `top` (the world point of the pad's
  top edge, the armpit line), `angle` (the arm face's slope from vertical), `len` (arm face length), `t` (pad depth at
  the top), `floorZ` (the base's two ends). The pad is static in every pose, so no `poly` twin is needed (PQ-H9; plan
  2.1:126-128). Returns several items of one type, so the spec takes it through `perItem`.
- The seat is the vendor `seat` primitive in the spec (census need "seat: exists"), not part of the composer.
- **EZ bar (D-LIB15-PREACHER; D-LIB10-NOTE Q3):** the vendor `barbell` seen end-on, no composer; the camber is frontal
  and does not show side-on. Its plate diameter is preacher_curl's own unsourced number (0.23 m, a 5 kg iron plate,
  chosen so the plate clears the face and the pad at the top of the curl); it does **not** reuse skull_crusher's
  EZ_PLATE_D, and no row takes `bar.kind: 'ez'`, so Q3's condition 2 does not bind.
- Unsourced numbers (preacher_curl's header, 13.3 must-fix 14): the arm face slope (45° from vertical, a typical
  preacher bench), face length (38 cm), pad depth at the top (12 cm), post (5 cm tube), seat height (set so the pad top
  sits under the armpits with the feet flat, c2: solved, then recorded), plate diameter 0.23 m, bar length (1.2 m, a
  typical EZ bar; drawn end-on, so only its sleeve and plate show).
- A per-pose drawn-item test on the real spec (13.1, A2): the pad at one fixed place (±1 px) in start, end and
  Mistake; the upper-arm contact on the face in start and end, off it in the Mistake.
- No other composer is proposed. The rope is main's `rope`; columns, pulleys, cables, stacks, bench, seat, dumbbell
  and barbell are vendor primitives (equipment.mjs). If the vendor dumbbell's `axis` cannot draw
  dumbbell_overhead_triceps_extension's vertical dumbbell held in both hands, or a box/line D-handle does not read on
  bayesian_cable_curl, that is reported, and a composer only by ruling (risks 4, 9).

## 5. Pose-class and convention anchors (depends_on)

| id | stand (the 8 / pilot A) | overhead (barbell_overhead_press) | split (reverse_lunge, **held**) | incline (incline_dumbbell_press, **held**) | dumbbell (dumbbell_biceps_curl) | front view (upright_row) | rope (rope_triceps_pushdown) | preacherPad | drawable fault (dumbbell_biceps_curl; LB3 one_arm_dumbbell_row) |
|---|---|---|---|---|---|---|---|---|---|
| overhead_cable_triceps_extension | yes | yes | (shoulder-width stance: no, D-LIB15-SPLIT point 3) | | | | yes | | |
| dumbbell_overhead_triceps_extension | yes | yes | **yes** (D-LIB15-SPLIT) | | yes | | | | |
| cross_body_hammer_curl | yes | | | | yes | yes | | | yes (F7) |
| cable_curl | yes | | | | | | | | |
| bayesian_cable_curl | yes | | **yes** (D-LIB15-SPLIT) | | | | | | |
| preacher_curl | | | | | | | | **anchor** | |
| incline_dumbbell_curl | | | | **yes** (D-LIB15-INCLINE) | yes | | | | yes (F7) |
| concentration_curl | | | | | yes | | | | |
| wrist_curl | | | | | yes | | | | yes (F7) |

- **Split (D-LIB15-SPLIT).** bayesian_cable_curl (census split) and dumbbell_overhead_triceps_extension (its card
  draws a split stance, c1) are drawn H now and go on no sheet until reverse_lunge is redrawn, owner-approved and
  pinned; otherwise each rolls (plan 3.5:376). The note posts no evidence against the split class for the dumbbell
  extension: its stance is the same front-and-back stagger.
- **Incline (D-LIB15-INCLINE).** incline_dumbbell_curl is drawn only after pilot A is on main and merged in, importing
  `../eq/inclineBench.mjs`; its sheet waits for incline_dumbbell_press, redrawn and pinned.
- overhead_cable_triceps_extension is drawn shoulder-width (c4 allows it), so it stays outside the split class.
- None of the 9 goes on a sheet before pilot A's yes is on main (depends_on).

## 6. Expected flags

- **F5 on every plate** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly
  3.57 only.
- **F7 on cross_body_hammer_curl, incline_dumbbell_curl and wrist_curl** (D-LIB15-F7). Each spec carries
  `pilot: { drawableFault: '...' }`; each topFault is the ruled key of its handlingMistakes[0] and differs from the
  drawn key (section 9), so F7 stays raised and needs the owner's named yes on the LB5 sheet.
- **F1 on wrist_curl only if** D-LIB15-WRIST's zoom route is ruled after the reference-scale render (section 11).
- **Before Do 6 b** every drawn id also shows `H6:no-card` and F7 'no card top fault'. Expected (Do 2).
- Others to watch [unverified until drawn]: F2 (coverage) on the cable plates, whose column adds ink (the 8's
  lat_pulldown sits inside the band; rope_triceps_pushdown 0.183), and on cross_body_hammer_curl's front view; F3
  (leader length) on the seated plates. Any other raised flag is posted with its value and range and ruled before
  READY. No flag is tuned away.

## 7. R10 items (tier A: overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension)

| id | R10 items drawn in the right pose (claims) |
|---|---|
| overhead_cable_triceps_extension | low pulley behind the lifter, the cable running up behind the trunk to the rope and clear of the neck and head in every pose (c1, plate.equipment); rope in both hands behind the head at the start (c1, c3); upper arms by the ears in start and end (c7); slight forward lean from the hips with a straight back (c5); arms straight overhead at the end, elbows not locked (c6); feet flat on the floor |
| dumbbell_overhead_triceps_extension | split stance, both feet flat (c1); one dumbbell held vertically in both hands (c1, c4); upper arms vertical in both poses (c6); about 90° at the elbow at the bottom with the dumbbell behind and clear of the head (c5); elbows not locked at the top (c4); braced torso, head in line (c3) |

Each item gets one drawn-item test (A15), and the test counts them against this table.

## 8. Tempo map (for the supervisor to rule; 13 Q3, 14.7, D-LIB8M-TEMPO)

Rule: the concentric takes `up`, the eccentric `down`; `Hold` takes `pause` right after the concentric only if
pause > 0; any other static phase is a constant only with a quote that states its seconds; a range is the quote's
string. No Rest. The phase order follows the drawn order (section 9's pose map). Form: pilot A's rows
(pilot-a/tempo.json @ `ff7c5c4f`; dumbbell_biceps_curl.mjs:145 'Curl 1, Lower 2'; rope_triceps_pushdown.mjs:176).

| id | card up/down/pause (claim) | drawn order | spec tempo |
|---|---|---|---|
| overhead_cable_triceps_extension | 1/2/1 (c21) | hands behind head → overhead | `[{ phase: 'Extend', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` |
| dumbbell_overhead_triceps_extension | 1/2/1 (c18) | bottom → top (swap, section 9) | `[{ phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` |
| cross_body_hammer_curl | 1/2/1 (c11) | bottom → top | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` |
| cable_curl | 1/2/0 (c10) | top → bottom (swap, section 9) | `[{ phase: 'Lower', s: 2, move: true }, { phase: 'Curl', s: 1, move: true }]` |
| bayesian_cable_curl | 1/2/0 (c12) | bottom → top | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }]` |
| preacher_curl | 1/2/0 (c14) | bottom → top | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }]` |
| incline_dumbbell_curl | 1/2/0 (c12) | bottom → top | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }]` |
| concentration_curl | 1/2/1 (c12) | bottom → top | `[{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` |
| wrist_curl | 2/2/0 (c10) | neutral → curled | `[{ phase: 'Curl', s: 2, move: true }, { phase: 'Lower', s: 2, move: true }]` |

- The three pause-1 cards whose pause is a WEAK convention (overhead_cable_triceps_extension c21,
  dumbbell_overhead_triceps_extension c18, concentration_curl c12) draw the Hold as the card says (D-LIB15-SECS, LR-33);
  cross_body_hammer_curl's pause 1 is the same kind of convention (c11). A7 pins each.
- No other static phase: overhead_cable_triceps_extension's bottom pause (c13) and wrist_curl's bottom hold (c3) are
  named only in text with no seconds, so neither is a phase (D-LIB8M-TEMPO). No seconds are added.
- `lb5/tempo.json` holds the rule, the research head and `ids` with each row as `{ phase, from: 'up'|'down'|'pause',
  move }` (LB3's form); `constants` is empty.

## 9. Pose map (13 Q2 (b)) and fault→key map (13 Q1(a))

The engine draws the Mistake as the end pose plus an override (plate.mjs:78) and outlines what differs from the end
pose, so a fault the card places at its start needs the start drawn as the spec's `end` (Q2 (f)).

| id | spec `start` | spec `end` | why |
|---|---|---|---|
| overhead_cable_triceps_extension, cross_body_hammer_curl, bayesian_cable_curl, preacher_curl, incline_dumbbell_curl, concentration_curl, wrist_curl | plate.start | plate.end | identity: each fault happens as the weight rises, at the card's end (c9 "as the rope is pushed overhead", c7, c5, c5 "as the body heaves the weight up", c4, c4/c3, c3) |
| dumbbell_overhead_triceps_extension | **plate.end** (bottom: elbows about 90°, dumbbell behind the head, c5, c6) | **plate.start** (top: arms vertical, elbows not locked, c4) | the card's start is the top (c4). The fault, the back arching as the dumbbell is pressed up (c9, c12), happens at the press, so it is drawn against the top; the drawn order is the press (bottom → top), the concentric |
| cable_curl | **plate.end** (top: elbows fully bent, bar near the shoulders, c3) | **plate.start** (bottom: arms down, elbows slightly bent, c13) | the fault is at the bottom ("arms fully extended at the bottom", c13), so it is drawn against the bottom; the drawn order is the lowering (top → bottom), and the Trace still runs between the two card poses |

A fact with no pose defaults to the spec's `end` (node.mjs h6), so every fact about the spec's start names pose
`start`. Do 6 b writes each fact's pose as this map's image of the pose its quote states (`cardPose` keeps the card's).
The phantom rule (Q2 (c)) applies wherever a start part is hidden: the start arm and dumbbell of the curls where the
end figure covers them (dumbbell_biceps_curl's method), the start rope or bar where the body hides it.

Fault→key (13 Q1(a)); each spec's first tell carries the key:

| id | plate.mistake (claim) | drawable | first tell key (other tells) | topFault |
|---|---|---|---|---|
| overhead_cable_triceps_extension | lower back arching as the rope is pushed overhead (c9) | true | `arch` (`ribs`: the chest and ribs tip back over the arched low back) | `arch` |
| dumbbell_overhead_triceps_extension | back arching as the dumbbell is pressed up (c9, c12) | true | `arch` (`ribs`) | `arch` |
| cross_body_hammer_curl | wrists twisting off neutral during the lift (c7, c5) | **false** (D-LIB15-XBODY: the card's field reads true; F-LB5-1 sets it false) | `twist` (`palm`: the palm turns up off the body) | `range` (handlingMistakes[0], "Arm fully straight at bottom.", c15; ≠ `twist`) |
| cable_curl | arms fully extended at the bottom, tension lost (c13) | true | `straight` (`drop`: the bar sinks lower) | `straight` |
| bayesian_cable_curl | upper arm swinging forward so the shoulder helps (c5) | true | `swing` (`shoulder`: the shoulder takes over) | `swing` |
| preacher_curl | upper arms lifting off the pad as the body heaves the bar up (c5) | true | `lift` (`heave`: the torso rocks back off the pad) | `lift` |
| incline_dumbbell_curl | elbows drifting forward as the dumbbells rise (c4, c3) | **false** | `elbows` (`shoulder`) | `wrists` (handlingMistakes[0], "Wrists bending under the dumbbells.", c11; ≠ `elbows`) |
| concentration_curl | elbow wedged into the knee crease instead of the arm on the inner thigh (c4, c3) | true | `knee` (`thigh`: the upper arm leaves the inner thigh) | `knee` |
| wrist_curl | arms extending or the body leaning forward to move the weight (c3) | **false** | `lean` (`arm`: the forearm lifts off the thigh as the arm straightens) | `grip` (handlingMistakes[0], "Weight rolling to the fingertips.", c5; ≠ `lean`) |

Tells are 2-3 visible signs of the one fault (Q-D5-4; D-LIB10-SKULL1). The cards' `plate.tells` ("Upper arms stay by
your ears", "Only your hand moves") are cue lines about good form, not still signs of the drawn fault, so the Mistake
tells restate `plate.mistake.what` (as plank's, one_arm_dumbbell_row's and LB4's).

## 10. Facts plan (D-LIB8M-FACTS, 22's scope; D-LIB13-FACTS2) and unsourced numbers

Every number and every contact a quote gives for a drawn pose (quotes read on the copied quotes files):

| id | number or contact in a start/end quote | proposed plateFacts | reason |
|---|---|---|---|
| overhead_cable_triceps_extension | none: c1 "upper arms next to your ears", c4 "shoulder-width", c5 "lean forward slightly", c6 "not locked out" give no number and no contact | `[]` | t_bar_row's and landmine_row's precedent (empty list, H6 then checks tempo). The ear line is a drawn-item test (A15, R10) |
| dumbbell_overhead_triceps_extension | c5 "until your elbows reach a 90 degree bend" (card end = spec start) | `angle elbow.r 90`, pose `start` (cardPose `end`), c5; and the measure arc at the elbow with `expect: 90` | engine elbow flexion 90 = a 90° bend |
| dumbbell_overhead_triceps_extension | c4, c6 "arms vertical to the floor", "upper arms vertical" | none as a fact (a direction; no fact kind measures it): a drawn-item test, upper arm within ±2° of vertical in both poses | 22 point 1: report, never invent a key |
| dumbbell_overhead_triceps_extension | c5 "avoid making contact with the back of your head" | none (a clearance): a `checks` `above` plane and a drawn-item test | not a contact |
| cross_body_hammer_curl | c14 "elbows close to shoulder-width apart", c1 feet "close to shoulder-width" | `[]` | widths with no number |
| cable_curl | c3 elbows "close" to the torso | `[]` | "close", no number and no contact |
| bayesian_cable_curl | c2 "at about a 45-degree angle relative to the floor"; c3 "at most, at a 45-degree angle relative to the floor" (start) | `angle` with `measure: true`, deg 45, pose `start` (cardPose `start`), c2: the measure arc at the shoulder from the vertical ray to the start elbow, `expect: 45` | the upper arm 45° behind vertical is the same line as 45° to the floor (card plate.start); an absolute angle, so the measure arc (not the shoulder angle, which is relative to the leaning trunk) |
| preacher_curl | c1 "upper arms and chest are in contact with the pad" (start); c2 "chest and upper arms are against the pad"; c4 "upper arms pressed against the pad" (end) | `contact elbow.r` (start, end; the plane of the arm face offset by the elbow's radius: the back of the upper arm on the pad), `contact chest` (start), c1, c4 | D-LIB13-FACTS2; the end chest contact is not stated by c4 ("upper arms"), so only the start one (D-LIB9-FACTPOSE: never carried) |
| preacher_curl | c2 "feet flat on the ground" (start) | `contact heel.r`, `contact ball.r`, pose `start`, c2 | the floor plane |
| preacher_curl | c2 "top of the pad ... under your armpits" | none as a fact (no armpit landmark): a drawn-item test, the pad top within 2 cm below and in front of the shoulder joint's underside, start | 22 point 1 |
| incline_dumbbell_curl | c1 "between 45 and 65 degrees" (bench) | none unless the plate shows it with a measure callout (an equipment number; D-LIB8M-FACTS); proposed: no callout, so no fact. Written when drawn (finish) | 22's scope |
| incline_dumbbell_curl | c2 "Lean back against the pad" (start) | `contact backUpper`, pose `start` (and end only if a quote states it: c11's "keep the head, shoulders and buttocks against the bench" is inferred from the seated curl, so ruled at drawing) | written when drawn |
| concentration_curl | c1 "Brace your upper arm — your triceps — against your left inner thigh" (start); c7 "triceps starts losing touch with your leg" (end: the stop point, still in touch) | `contact elbow.r`, poses `start` and `end`: a `checks` plane on the inner face of the near thigh, offset by the upper-arm radius (the triceps on the inner thigh) | D-LIB13-FACTS2 |
| concentration_curl | c1 "Sit on the edge of a weight bench" | `contact seat`, pose `start` | the bench top; 0 cm |
| wrist_curl | c1 "rest your forearm against your thigh" (start) | `contact wrist.r`, poses `start` and `end`: a `checks` plane on the thigh's top line, offset by the forearm's distal radius (the forearm's far end on the thigh, the hand past the knee) | the forearm stays still (c1, c3); the elbow end of the forearm lies on the thigh too, but one contact per fact is enough to prove it |
| wrist_curl | c2 "approximately a 90 degree bend at the elbows" | none: c2 is ACE's kneeling version on a bench, not the drawn seated version (D-LIB9-FACTPOSE) | |

Unsourced numbers (13.3 must-fix 14; each spec header lists its own): every pulley height on the low-pulley plates
(about 15 cm, "lowest position", c1), the column and stack (the 8's lat_pulldown sizes), the rope (the composer's
sizes), the straight bar (1.2 m cable bar) and single handle sizes; overhead_cable_triceps_extension's step from the
stack (about 0.6 m) and lean angle; dumbbell_overhead_triceps_extension's stance length and dumbbell (vendor default);
cross_body_hammer_curl's dumbbells (vendor default) and the top-of-arc point; cable_curl's soft bottom elbow angle (c13
"slightly bent": 18°) and step back; bayesian_cable_curl's split stance and trunk lean; preacher_curl's pad and seat
(section 4) and EZ plate (0.23 m); concentration_curl's bench height (45 cm), hinge angle, knee width; wrist_curl's
bench height, thigh slope, dumbbell; every Mistake magnitude (illustrative, never enlarged to pass a check: Q-D5-3).

## 11. PQ-H3 estimates (before drawing; each [unverified until drawn])

deviationMin 11.39 px and traceLenMin 22.11 px (qa/envelope.json) at about 146 px/m. Deviation is the largest move of
a tell anchor's body point from the end to the Mistake pose (qa/node.mjs `deviation`); equipment moves do not count.

| id | largest tell-anchor move, end → Mistake | Trace |
|---|---|---|
| overhead_cable_triceps_extension | backUpper back ~0.10 m as the low back arches → ~15 px | grip arc about the elbow, ~0.34 m radius × ~1.7 rad → ~85 px |
| dumbbell_overhead_triceps_extension | backUpper back ~0.10 m → ~15 px | grip arc, ~90° sweep → ~75 px |
| cross_body_hammer_curl | **~0 px. At risk, close to certain.** The engine has no forearm rotation (vendor body.mjs:132: the hand frame turns only about the wrist's flexion axis), so a wrist twist moves no body landmark; only the drawn dumbbell turns (its handle from side-on to end-on in this view). hands/hand-curl.mjs:17-18 records the same limit for the radial view ("rotations the radial view can't show") | grip arc to the opposite shoulder, ~0.6 m → ~85 px |
| cable_curl | grip ~0.34 m from the elbow, the soft bend (18°) to straight → ~0.11 m → ~15 px. **At risk** (it scales with the unsourced soft bend) | grip arc, ~125° → ~0.74 m |
| bayesian_cable_curl | elbow swings from 45° behind vertical to ~10° forward → ~0.3 m → ~44 px | grip arc, ~0.6 m |
| preacher_curl | elbow lifts off the face ~0.08-0.1 m, shoulders rock back ~0.08 m → ~12-15 px. **At risk** | bar arc, ~0.6 m |
| incline_dumbbell_curl | elbow forward ~0.15 m → ~22 px | grip arc, ~0.6 m |
| concentration_curl | elbow from mid inner thigh to the knee crease ~0.1-0.12 m → ~15-18 px | grip arc, ~0.6 m |
| wrist_curl | sternum forward with the lean ~0.15 m → ~22 px | **grip about the wrist, 8.7 cm × ~1.3 rad (neutral → ~75° curl) ≈ 0.11 m → ~16 px before the trim. Fails at the reference scale** (census: "about 13 px of fist travel") |

- A too-small fault is reported with its card-true size, never enlarged (Q-D5-3). cross_body_hammer_curl's twist is
  drawn card-true and measured; if H3 fails it is reported with its render (risk 3; D-LIB15-XBODY's research route for
  the next drawable fault is research's call), and the plate is held under D-LIB8-shrug.
- wrist_curl follows D-LIB15-WRIST: drawn at the reference scale first and measured; if H3 fails, the zoomed render
  (`camera.maxScale`, F1, the whole figure, bench and dumbbell in frame) is posted for the supervisor's ruling, never a
  wider wrist range off the card. No zoom view shows an angle number.

## 12. H slice (Do 2; D-LIB15-SLICE)

overhead_cable_triceps_extension (rope, overhead), preacher_curl with eq/preacherPad.mjs, wrist_curl,
cross_body_hammer_curl. Posted as 'LB5 SLICE READY @ <sha>' with 390 px renders in Paper and Silent Black beside
lat_pulldown and pilot A's rope_triceps_pushdown and barbell_overhead_press (beside overhead_cable_triceps_extension),
machine_chest_press (beside preacher_curl), dumbbell_biceps_curl (beside wrist_curl), upright_row and
dumbbell_biceps_curl (beside cross_body_hammer_curl), pilot A from a temporary worktree of #109 @ `ff7c5c4f`; the unit
tests; the two-build plates-page sha256 and the Do 8 QA table for the rows in rows.json; A9 and every mutation red then
restored. Bulk: dumbbell_overhead_triceps_extension, cable_curl, bayesian_cable_curl, concentration_curl on 'LB5 BULK
GO'; incline_dumbbell_curl after pilot A is on main.

## 13. Held ids

| id | held under | release condition |
|---|---|---|

None yet. A slice or bulk plate that cannot pass a hard check card-true is added here with its ruling (D-LIB8M-CARDTRUE).
incline_dumbbell_curl is not held: it is not drawn yet (D-LIB15-INCLINE).

## 14. Risks and mitigations

1. Mistakes below deviationMin (cross_body_hammer_curl near certain; cable_curl, preacher_curl at risk) and wrist_curl's
   Trace below traceLenMin: report the card-true size with the render; the supervisor rules (D-LIB15-WRIST for
   wrist_curl, D-LIB8-shrug otherwise). Never enlarged.
2. The rope's cable from the low pulley behind the heels to the hands behind the head crosses the back or the head
   [unverified until drawn]: the pulley sits far enough behind and the forward lean opens the gap; A15's cable test
   catches a crossing; a crossing is redrawn with the rope composer's `ferrule` override, never by editing eq/rope.mjs.
   If it cannot be drawn card-true, it is reported.
3. cross_body_hammer_curl's front-view twist: drawn as the dumbbell's handle turning out of the frontal plane (the
   vendor `dumbbell` `axis`), which shows but moves no landmark (section 11). Reported with its render.
4. The vendor `dumbbell` `axis` option does not draw the vertical dumbbell held in both hands (dumbbell extension): the
   far hand sits behind the near one in the side view, so one fist and one dumbbell show; if the head-on-top reading
   fails, reported, composer only by ruling.
5. preacher_curl's EZ bar does not read side-on (R2 below 4): D-LIB10-NOTE Q3 condition 3 (an EZ composer ruled
   before drawing, skull_crusher its anchor).
6. Contact facts on limbs (preacher_curl, concentration_curl, wrist_curl) use a joint landmark and a plane offset by
   the engine's limb radius (vendor body.mjs RADII); the drawn outline must touch the surface. A2 and A15 test the drawn
   outline, not the offset maths.
7. The split anchor stays held at sheet time: bayesian_cable_curl and dumbbell_overhead_triceps_extension roll. The
   incline anchor stays held: incline_dumbbell_curl rolls.
8. Pilot A merges late: incline_dumbbell_curl waits; READY covers the other rows and lists it.
9. bayesian_cable_curl's single handle: the vendor `vHandle` has two grips; a single D-handle is drawn from `line` and
   `poly` items in the spec (plan 2.1 "existing parts"); if it does not read, reported.
10. A later research head changes an LB5 card (F-LB5-1, F-LB5-2): the note follows it; the verifier and QA re-run for
    that card.
11. A shared COACHING-DECISIONS append conflict: keep both sides.

## 15. Questions for the supervisor

- **Q1 (tempo map, section 8):** the nine rows above; cable_curl's order Lower → Curl (drawn top → bottom).
- **Q2 (pose map, section 9):** dumbbell_overhead_triceps_extension and cable_curl swapped (the fault at the card's
  start); the other seven identity.
- **Q3 (facts, section 10):** the facts above; empty lists for overhead_cable_triceps_extension, cross_body_hammer_curl
  and cable_curl; the limb contacts as joint landmarks on offset planes; directions and the armpit line as drawn-item
  tests, not facts.
- **Q4 (fault→key, section 9):** the keys above, with topFault `range` (cross_body_hammer_curl), `wrists`
  (incline_dumbbell_curl) and `grip` (wrist_curl).
- **Q5 (H3, section 11):** cross_body_hammer_curl's twist moves no landmark in this engine, so H3's deviation is
  expected near 0 px. It is drawn and measured in the slice; the result goes to you before any hold.
