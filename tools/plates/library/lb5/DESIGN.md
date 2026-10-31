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
| cross_body_hammer_curl | dumbbell_lateral_raise (no spec) | no engine parent; front view curl across the body, neutral grip, tempo, Mistake (the shrug, c5, c6; F-LB5-1, after the wrist twist, c7, proved undrawable) |
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
  and does not show side-on. Its plate diameter is preacher_curl's own unsourced number (0.23 m, a drawn
  value); it does **not** reuse skull_crusher's
  EZ_PLATE_D, and no row takes `bar.kind: 'ez'`, so Q3's condition 2 does not bind.
- Unsourced numbers (preacher_curl's header, 13.3 must-fix 14): the pad's arm face is built from the body (the line
  along the back of the upper arm, so its slope is the upper arm's: SH_FLEX), 34 cm long; its chest face runs from the
  top edge through the chest; the pad 5 cm thick under the arm face's low end; post 6 cm tube, floor foot 44 cm; seat
  height 60 cm (pad top under the armpits with the feet flat, c2); plate diameter 0.23 m; bar drawn end-on.
  Drawn: the top edge sits where the upper arm leaves the torso outline in the side view (the visible armpit), because
  the shoulder joint is 12.6 cm behind the chest front in the engine body (body.mjs landmarks `chest`).
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
- **F2 on concentration_curl** (D-LIB15-F2, #290 6345185694): cover 0.16 at the reference scale, a seated hinged
  figure; a named flag the sheet carries, no zoom, nothing tuned.
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
| overhead_cable_triceps_extension | 1/2/1 (c21, c13; the claim pair the card gives) | hands behind head → overhead | `[{ phase: 'Extend', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]` |
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

Ruled (D-LIB15-POSE, #290 6340022161): each swapped spec pose matches the card's own words for that phase:
dumbbell_overhead_triceps_extension spec start = c5 ("lowering the dumbbell behind your head ... until your elbows
reach a 90 degree bend") and c6 (upper arms vertical), spec end = c4 ("press the dumbbell overhead, extending your
elbows until your arms are vertical ... not completely locked"), Mistake c9 ("you may be tempted to arch your back" when the
weight is too heavy) and c12 ("Arching lower back"), drawn at the press; cable_curl spec start = c3 ("raise the handle up towards your
shoulders"), spec end = c13 ("the bottom of the movement ... keep your arm slightly bent"), Mistake c13 ("lose tension at
the bottom of the movement when your arms are fully extended"). A test pins the map.

A fact with no pose defaults to the spec's `end` (node.mjs h6), so every fact about the spec's start names pose
`start`. Do 6 b writes each fact's pose as this map's image of the pose its quote states (`cardPose` keeps the card's).
The phantom rule (Q2 (c)) applies wherever a start part is hidden: the start arm and dumbbell of the curls where the
end figure covers them (dumbbell_biceps_curl's method), the start rope or bar where the body hides it.

Fault→key (13 Q1(a)); each spec's first tell carries the key:

| id | plate.mistake (claim) | drawable | first tell key (other tells) | topFault |
|---|---|---|---|---|
| overhead_cable_triceps_extension | lower back arching as the rope is pushed overhead (c9) | true | `arch` (`ribs`: the chest and ribs tip back over the arched low back) | `arch` |
| dumbbell_overhead_triceps_extension | back arching as the dumbbell is pressed up (c9, c12) | true | `arch` (`ribs`) | `arch` |
| cross_body_hammer_curl | working shoulder shrugging as the dumbbell rises (c5, c6; research a8e66f32, F-LB5-1) | **false** | `shrug` (`ear`: the gap between the shoulder and the ear closes) | `straight` (handlingMistakes[0], "Arm fully straight at bottom.", c15; ≠ `shrug`) |
| cable_curl | arms fully extended at the bottom, tension lost (c13) | true | `straight` (`drop`: the bar sinks lower) | `straight` |
| bayesian_cable_curl | upper arm swinging forward so the shoulder helps (c5) | true | `swing` (`shoulder`: the shoulder takes over) | `swing` |
| preacher_curl | upper arms lifting off the pad as the body heaves the bar up (c5) | true | `lift` (`heave`: the torso rocks back off the pad) | `lift` |
| incline_dumbbell_curl | elbows drifting forward as the dumbbells rise (c4, c3) | **false** | `elbows` (`shoulder`) | `wrists` (handlingMistakes[0], "Wrists bending under the dumbbells.", c11; ≠ `elbows`) |
| concentration_curl | elbow wedged into the knee crease instead of the arm on the inner thigh (c4, c3) | true | `knee` (`thigh`: the upper arm leaves the inner thigh) | `knee` |
| wrist_curl | arms extending or the body leaning forward to move the weight (c3) | **false** | `lean` (`arm`: the forearm lifts off the thigh as the arm straightens) | `grip` (handlingMistakes[0], "Weight rolling to the fingertips.", c5; ≠ `lean`) |

Tells are 2-3 visible signs of the one fault (Q-D5-4; D-LIB10-SKULL1). The cards' `plate.tells` ("Upper arms stay by
your ears", "Only your hand moves") are cue lines about good form, not still signs of the drawn fault, so the Mistake
tells restate `plate.mistake.what` (as plank's, one_arm_dumbbell_row's and LB4's).

One-tell plates (D-LIB10-SKULL1 per id, #290 6345185694): one tell where the card's claims state no second visible sign
of the one fault. Claims read on the copied quotes files:

| id | fault | claims read | record |
|---|---|---|---|
| cable_curl | arms fully extended at the bottom, the biceps losing tension | c13 | no second sign stated |
| bayesian_cable_curl | the upper arm swinging forward so the shoulder helps | c5 (both quotes) | no second sign stated |
| concentration_curl | the elbow wedged into the knee crease | c3 (both quotes), c4 (both quotes) | no second sign stated ("leverage" is a cause, not a visible sign) |
| overhead_cable_triceps_extension (held) | the lower back arching | c9 (both quotes) | no second sign stated |
| dumbbell_overhead_triceps_extension (held) | the back arching | c9, c12 ("Arching lower back"; its other three lines are other faults) | no second sign stated |
| straight_bar_triceps_pushdown | leaning over the bar or arching the back (one tell names both, the parent's) | c11 | no second sign stated |
| single_arm_triceps_pushdown | leaning or arching to press the handle down | c17 | no second sign stated |
| barbell_curl | the elbows moving back to cheat the bar up | c5, c4 | no second sign stated |
| ez_bar_curl | the elbows drifting forward at the top | c4, c5 | no second sign stated |
| reverse_curl | swinging the bar up with momentum | c5 | no second sign stated |
| alternating_dumbbell_curl | the working elbow swinging forward | c5, c4 | no second sign stated |

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

Fix round (CARD FIELDS verify, #290 6349063103), applied to the cards' plateFacts:
- Added, each side of a plural paired part: preacher_curl `elbow.l` start (c1) and end (c4), `heel.l` and `ball.l` start
  (c2); concentration_curl `heel` and `ball`, `.r` and `.l`, start and end (c5 "throughout the lift").
- Added, the hands on the implement at the card's start (checked at the wrist, LB6 and LB7's precedent):
  overhead_cable_triceps_extension both (c3 "positioning hands behind your head", the rope), dumbbell_overhead_triceps_
  extension both (c1 "wrap both hands", spec end), cross_body_hammer_curl both (c1 "a dumbbell in each hand"), cable_curl
  both (c1 "hands about shoulder-width apart", spec end), bayesian_cable_curl `wrist.r` (c1 "the handle in one hand"),
  preacher_curl `wrist.r` (c1 "Grip the curl bar"; c1 names no hands in the plural), concentration_curl and wrist_curl
  as below.

Not facts:
- dumbbell_overhead_triceps_extension `elbow.r` 90 (c5): "until your elbows reach a 90 degree bend or until your upper
  arms begin to move backwards" gives two stop points joined by "or", a choice (D-LIB17-ORCHOICE). The 90° stays drawn,
  with its measure arc.
- concentration_curl `elbow.r` end (c7): "once your triceps starts losing touch ... or once your upper arm stops being
  perpendicular" is a choice (D-LIB17-ORCHOICE), and no other non-setup quote states the triceps on the thigh at the end.
  The contact stays drawn, held by a `checks` entry.
- wrist_curl `wrist.r` end (c1): c1 is a setup quote and states the start only (D-LIB9-FACTPOSE). The forearm-on-thigh
  start is also no fact: c1's first two quotes give "thigh, or alternatively a bench", a choice, and its third ("one
  forearm on each of your legs") is the two-arm version, while the plate draws one arm. Both contacts stay drawn, held by
  `checks`. The card keeps `wrist.r` start c1 for the hand on the dumbbell ("Grab a dumbbell").
- Free hands: concentration_curl c5 ("You can also grip your right knee or the weight bench") and bayesian_cable_curl c7
  ("out to the side or place it on your hip") are choices.
- concentration_curl's working side: D-LIB15-MIRROR stands on c14 (F-LB5-2, research baf2ff09: "Keep your reps even on
  both sides"), so the plate draws the mirror of c1's named left; `elbow.r` start stays and `wrist.r` start (c1 "Grasp a
  dumbbell") is added.

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
| overhead_cable_triceps_extension | D-LIB8-shrug (#290 6343211054 item 1): at the approved arch size (M_ARCH 25) the tell-anchor deviation is 9.98 px < 11.39; the arch is never sized to pass H3. Then D-LIB15R2-ZOOM (lib4-cards §48, the D-LIB17-RDFHOLD form): no r 52 zoom place at any k 1.5-4, because figure and equipment ink alone blocks every place (labels and leaders switched off) | a new placement convention ruled by the supervisor, or a sourced arch size; never a smaller circle or a loosened check |

Released in resume 2 (D-LIB15R2-ZOOM, section 17): dumbbell_overhead_triceps_extension (Mistake zoom k 1.5),
cross_body_hammer_curl (Mistake zoom k 2) and wrist_curl (normal zoom k 3, D-LIB15R2-WRISTBOX). Their earlier holds
(D-LIB8-shrug, D-LIB15-TWIST, F-LIB15-1) named LIB-ZOOM as the route; it is on main (D-LIBZOOM-EXTEND).

A held spec stays drawn as is, builds and is in no rows file and on no QA'd page (D-LIB8M-PAGESET).

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

## 15. Questions for the supervisor (ruled: #290 6340022161, Q1-Q4 accepted with limits, Q5 held)

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

## 16. Bulk (LB5 BULK GO, #290 6343211054)

Drawn on the GO: cable_curl, bayesian_cable_curl, concentration_curl (rows.json with preacher_curl), and
dumbbell_overhead_triceps_extension (released in 6343237796; red on H3 at M_ARCH 25, so held, section 13). Sizes and bases
(each spec header lists its own; unsourced numbers as section 10):

| id | drawn sizes and their basis | Mistake | H3 deviation (min 11.39) |
|---|---|---|---|
| cable_curl | elbow 140 top (dumbbell_biceps_curl :55), 18 soft bottom (machine_chest_press.mjs:45, c13); upper arm vertical (c3) | elbow 0, arms fully straight (c13) | 11.69 px |
| bayesian_cable_curl | upper arm 45 behind vertical (c2, c3; the measure, `expect: 45`); lean 11 (rope_triceps_pushdown 8 + 3, c2); elbow 140 end (dumbbell_biceps_curl :55) | upper arm 45 forward (dumbbell_biceps_curl :61, c5) | 61.6 px |
| dumbbell_overhead_triceps_extension | split stance (bayesian_cable_curl's); upper arms vertical (c6; SH_FLEX 178, overhead_cable_triceps_extension's); elbow 90 bottom (c5, the fact and measure), 8 top (c4; overhead_cable_triceps_extension's, item 7); dumbbell vertical, the hands under the top head (c1, c4) | LB3 dumbbell_romanian_deadlift's arch, M_ARCH 25 (c9; :109) | 10.56 px (red: held) |
| concentration_curl | elbow on the inner thigh at 0.62 of its length (c1, c3); elbow 120 end (dumbbell_biceps_curl :63, c7); hinge tilt solved | elbow at the knee crease, tilt solved (c4) | 28.45 px |

Item fixes (6343211054 items 2-7):
- overhead_cable_triceps_extension (held): one tell, the DRDL dashed arch and an arrow pointing forward into the lumbar,
  its tip 15 cm behind the faulty lumbar point (6 px clearance, 13.1). "Hip lean" is anchored at the navel with its box
  in front: the cable fan from the low pulley fills the back side, so any box there puts its leader within 6 px of a
  cable or across the buttock. The Mistake tell "Low back arches" keeps its lumbar anchor (it carries H3); its leader
  crosses 7 px of the faulty torso for the same reason.
- wrist_curl (held): "Forearm supported" boxed in front of the forearm, above the hand; "Palms up" moved up to make room.
- preacher_curl: anchors at the armpit (pad top) and the arm-pad contact; faulty arm on top; the pad-gap mark; measure
  radius 30.
- One tell per plate on overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension, cable_curl, bayesian_cable_curl and concentration_curl: each
  card names one fault; ruled per id (#290 6345185694), recorded in section 9.

Flags (authoring QA, 4 rows): F5 only on preacher_curl, cable_curl and bayesian_cable_curl. concentration_curl raises
F2: cover 0.16 < 0.191 at the reference scale (146.3 px/m; seated, hinged figure), a named flag (D-LIB15-F2, section 6).

D-LIB15-MIRROR (#290 6349063103): concentration_curl's c1 sources name the left arm and the left thigh, with the free
hand on the right knee (c5). The plate may draw the mirror image only if a claim states that each side is trained. None
does: no claim or quote on the card mentions the other arm, switching sides, or each side. So the ruling's own branch
applies: the facts take c1's named side and the plate is redrawn left-handed. That redraw changes the plates page the
critic panel is running on (4a84a64e…), so it is posted on #290 before it is done.

Critic panel fix round (D-CRITIC-CAL3, #290 6349640307), concentration_curl only:
- R5: the faulty arm is drawn on top as closed dashed outlines of the faulty upper arm, elbow, forearm and fist, at
  the body's own lengths (bayesian_cable_curl's MIS_ARM). The upper arm now reads as one capsule from the faulty shoulder
  to the elbow at the knee, and the tell's leader ends on that elbow (its 4 px offset is removed). The pose and sizes are
  unchanged.
- R7: the grip keys go from 6 chords to 48, one per Trace sample, so the Trace follows the arc about the elbow. A test
  fails a Trace with any turn over 6° or 2.5× the median (its mutation: the keys cut back to 6 chords).
- Held plates, for when they resume: cross_body_hammer_curl's Trace turns 10.8° at one key (median 0.2°), and
  wrist_curl's 4.0° (median 1.0°). Both are redrawn smooth then.
- F-LB5-2 (#302, research baf2ff09) added c14 and the card notes. The card and quotes are re-copied (cards.sha.json),
  so the mirror stands on a claim and no redraw is needed.

Named nit (D-LIB15-NIT1, #290 6351388427, ruled option 3): on concentration_curl, the "Slow lowering" leader runs
straight up from the grip at x 273.5 (plate px) through the "ELBOW" text (x 262-326, y 172-204). The plate stays as
approved at page 921cb1d5. Scan of every move of that box, its leader or the ELBOW label (engine report and leader checks):

| what moved | result |
|---|---|
| "Slow lowering" box, 5 anchor offsets x every 12 px | 18 positions clear the text and the measure leader; all sit below the dumbbell and their leaders run 0.0-0.2 px from the Trace (rule: 6 px) |
| anchor 12 px left of the grip, box {150, 100} | clears the text by 2-4 px; leader 113 px (F3 > 82) and across the head |
| anchor at the start-pose grip, box {276, 300} | leader 56 px, across the solid near shin |
| ELBOW label right, {286, 200} or {276, 172} | its leader crosses or touches (0.5 px) the "Slow lowering" leader |
| ELBOW label below the grip, {292, 216} | its leader runs through the forearm and the dumbbell |
| ELBOW label above the "Slow lowering" box | leader 96-115 px (F3) and over the face |
| ELBOW label left | collides with the head and neck or the left callouts |


## 17. Resume 2 (LIB-15R2): PLAN

Card: `docs/supervisor/verify/lib-15r2-card.md` on claude/sup-lib4-cards @ `167f273e`, rulings D-LIB15R2-1 to -9
(lib4-cards §48). Base: main `a72b52b5` (train 48: F-ZOOM-PITCH and LB4). Research: `a48b0594` (claude/libht-research);
the 7 new cards and quotes are byte copies from it (cards.sha.json `r2Head`); incline_dumbbell_curl's card is the same
blob there as on main. Nothing ships (D-LIB15-AHEAD).

### 17.1 Zoom rows (wave 1), re-measured on `a72b52b5`

Bars 22.11 px (Trace) and 11.39 px (deviation), qa/envelope.json; ladder 1.5-4. Numbers equal the card's scratch
measures (`1f024b1f`, `151de0b8`), except where 17.2's re-key changes the wrist_curl ladder (marked).

| id | region (view) | k | value at k (bar) | circle; source ring | smaller k |
|---|---|---|---|---|---|
| dumbbell_overhead_triceps_extension | the `arch` tell, end → Mistake (Mistake) | 1.5 | 15.85 px (11.39) | (260, 192); (167.16, 191.76) r 34.67 | none on the ladder |
| cross_body_hammer_curl | the `shrug` tell (Mistake) | 2 | 14.63 px (11.39) | (76, 172); (145.85, 124.67) r 26 | k 1.5: 10.97 px < 11.39 |
| wrist_curl | the grip's path (normal) | 3 | 34.97 px (22.11) | (178, 140); (288.75, 251.62) r 17.33 | k 2.5: 25.26 px* meets the bar, but its ring (r 20.8) lies under the measure-arc label (H1.ink:normal:arc, the card's measure); k 1.5 11.65*, k 2 20.20* |

\* with the wrist_curl Trace at 20 samples (17.2); the card's 48-sample ladder was 12.63 / 20.06 / 28.32 / 34.97.
overhead_cable_triceps_extension stays held (section 13).

### 17.2 Ruled moves and Trace re-keys (A4, A10)

- wrist_curl: the normal-view "Forearm supported" box {254, 200} → {112, 200} (D-LIB15R2-WRISTBOX). Its leader still
  ends on its anchor (`elbow.r` +6 px), the forearm.
- cross_body_hammer_curl (the card's owed fixes, one box per view): the normal "Shoulders down" callout boxed at
  {204, 66} (was auto-placed overlapping "Arc across": H4.overlap normal arc|shoulders) and the Mistake "Shoulder near
  ear" tell boxed at {84, 58} (was overlapping "Shoulder shrugs": H4.overlap mistake shrug|ear; the auto layout then
  moves "Shoulder shrugs" off the source ring: H1.ink:mistake:shrug clears). Found by a scan of every 8 px box place
  per key (engine report clean, hit boxes apart, longest leader at most 82.26, the zoom placed with every label clear
  of its ring and circle): 85 places for `shoulders`, 1 for `ear`, 4 for `shrug`; {84, 58} keeps the circle at (76,
  172) and the 14.63 px. Leaders still end on their anchors (shoulderTop.l, trap.r). Authoring QA at this head: all 10
  hard checks pass, node and browser; flags F2 0.164, F5 3.57, F7 shrug.
- Trace re-keys (lb5-plates.test.ts Trace test, #290 6349640307 R7: no turn over 6° or 2.5× the median):
  - cross_body_hammer_curl: SEG 8 → 48 key poses on the same arc (concentration_curl's fix). The turns at the 7 key
    joins (9.2-10.8°) were the chords between 8 keys; now max 2.19°, median 1.67°. start and end are unchanged (the
    same `gripAt(0)` and `gripAt(1)`); only `poses.via` changes. Zoom unchanged (14.63 px at k 2).
  - wrist_curl: `trace.samples` 48 (engine default) → 20. Only the wrist moves, so `poses` has no `via`; the plate
    Trace is 5.2 px long and its 48-sample chords are 0.31 px, where the svg's 0.01 px rounding makes turns of 0-3.95°
    (median 1.02). At 20 samples the chords are about 0.78 px: max 3.95°, median 3.09° (passes). 16 also passes
    (4.49 / 4.46); 10-14 fail or leave too few points. Poses, trim and the drawn path's ends are unchanged.
- A4's pin: each zoom row's export, JSON-serialised without `zoom`, the ruled boxes and the re-keyed field
  (cross_body_hammer_curl `poses.via`, wrist_curl `trace.samples`), equals its sha256 at `151de0b8`.

### 17.3 Flags on the zoom rows (fix or name)

Flags inform the owner and never gate (D-LIB8FIX-ENV); each named one goes on the sheet with its value and range.

| id | flag (value, range) | proposal | why |
|---|---|---|---|
| dumbbell_overhead_triceps_extension | F3 47.3 (49.33-82.26) | name | the longest leader is short because every label sits close to its part; lengthening a leader to reach the range would be layout for a flag |
| dumbbell_overhead_triceps_extension | F4 0 (2-6) | name | the engine's own layout passes every hard check; hand-boxing labels at their auto places changes nothing drawn |
| cross_body_hammer_curl | F2 0.164 (0.191-) | name | front view of a standing figure with two dumbbells (concentration_curl's D-LIB15-F2 form) |
| cross_body_hammer_curl | F4 | not raised | the two boxes above give 2 hand-boxed labels (range 2-6) |
| wrist_curl | F3 94.8 (49.33-82.26) | name | a Mistake tell's leader (the lean, to the upper back); moving it would be a second box move (S2 names it for the zoom; kept out here too) |
| wrist_curl | F2, F5, F7 | as ruled | D-LIB15-F2, D-LIB9-F5, D-LIB15-F7 |

### 17.4 Modes (D-LIB15R2-MODES)

T: straight_bar_triceps_pushdown (PUSHDOWN); barbell_curl, ez_bar_curl, reverse_curl (CURL). H: single_arm_triceps_
pushdown (torso vertical c16, one arm, single handle c2), alternating_dumbbell_curl (split stance c3, one arm curled
c1), hammer_curl (split stance c2, neutral grip c1), incline_dumbbell_curl (no parent; inclineBench). A pose or stance
outside PARAMS makes a row H (plan 3.1:272, D-LIB10-FACTS). The plan marks become P2 T4 H13 (a supervisor docs action;
rope_triceps_pushdown is pinned H in batches/pilot-a.json).

### 17.5 Templates (D-LIB10-TEMPLATES, -CHILDPROOF, -FACTS)

Each template is a new file `tools/plates/library/templates/<NAME>.mjs` that copies its parent spec's code (D-LIB9-CLONE),
reads `params` only through the PARAMS paths below, and exports `make(params, facts)`, `parentParams`, `parentFacts`,
`FACTS` (the closed schema) and `BUILDERS`. A missing param takes the parent's value. `make` throws on an unknown param,
an unknown facts key (for example `poses`, `equipment`, `camera`, `trace`, `measure`, `checks`, `ghosts`, `view`), an
unknown builder or a magnitude outside the builder's list. The parent proof, `make(parentParams, parentFacts)` rebuilt
alone, must equal the parent's 9 pinned fragments (pilot-a.json:261 and :383) before any child is drawn (S3).

**CURL** (parent lib_dumbbell_biceps_curl, H, batches/pilot-a.json:160; pinned entry pilot-a.json:261)
- PARAMS read: `load.primitive` ('dumbbell' | 'barbell'), `stance.width` (m, mid-sole to mid-sole; FOOT_X = width / 2).
- parentParams `{ 'load.primitive': 'dumbbell', 'stance.width': 0.28 }` (0.28 / 2 === 0.14 exactly, the parent's FOOT_X).
- Load: 'dumbbell' is the parent's end-on hex and its dashed start hex. 'barbell' is the vendor `barbell` end-on at
  `grip.r`, plateD 0.23 and plates [0.03] (the template's own plate size, D-LIB15R2-EZ; preacher_curl's drawn EZ plate),
  with a dashed start plate circle instead of the hex; the hidden start forearm is cut by that circle.
- Facts schema (closed): `id`, `name`, `callouts` ([{ key, text, anchor, box?, cue }], 3), `tempo`, `mistake`
  ({ builder, dir?, tells: [{ key, text, anchor, cue }], 1-3 }), `alt`, `mistakeAlt?`, `pilot?` ({ drawableFault }).
- Builders and bounded magnitudes (all drawn; no card gives a size, Q-D5-3):
  - `elbows`, dir 'forward': the parent's builder byte for byte (MIS_FLEX 45, MIS_ELBOW 120, MIS_MARGIN 0.10 in front
    of the shoulder plane; its faulty-arm guides, side line and arrow).
  - `elbows`, dir 'back': shoulder extension 30 (MIS_FLEX −30), MIS_ELBOW 140 (the end pose's, so the forearm stays near the top of the curl), the elbow at least 0.10 m behind the
    shoulder plane (the mirrored check); same guides.
  - `swing` (reverse_curl c5): the trunk rocks back from the hips (pelvis tilt −12, trunk −6) while the upper arms swing
    forward 30 (MIS_FLEX 30) at MIS_ELBOW 120; guides: the faulty torso and arm outlines dashed, an arc arrow at the hips.
- parentFacts: the parent's callouts, tempo, Mistake (`elbows` forward with its two tells) and alt, byte for byte.

**PUSHDOWN** (parent lib_triceps_pushdown, H, batches/pilot-a.json:224; pinned entry pilot-a.json:383)
- PARAMS read: `bar.kind` ('straight' only: the parent's latBar, triceps_pushdown.mjs:167).
- parentParams `{ 'bar.kind': 'straight' }`.
- Facts schema (closed): `id`, `name`, `callouts` (3), `tempo`, `mistake` ({ builder: 'lean', tells }), `alt`,
  `mistakeAlt?`, `pilot?`. Builder `lean`: the parent's (MIS_TILT 42, MIS_ARCH 14, MIS_SHOULDER 25, MIS_ELBOW 75,
  MIS_HIPS 0.07, MIS_DROP 0.008) byte for byte; no other magnitude.
- Eligibility stays plan 3.1:275's 4 members, though only one child is T.

**Proposed family rows** (for claude/sup-param-ranges, D-LIB15R2-RANGES; D-LIB10-RANGES 3: each bound or value with its
basis, a pinned plate or a verified claim):

```json
"CURL": { "ruling": "D-LIB15R2-RANGES", "params": {
  "load.primitive": { "range": ["dumbbell", "barbell"], "basis": [
    "the pinned parent lib_dumbbell_biceps_curl draws the dumbbell (tests/howto/golden/library/pilot-a.json:261; dumbbell_biceps_curl.mjs:123)",
    "barbell_curl c1, ez_bar_curl c1 and reverse_curl c1 hold a bar in both hands (research a48b0594); the EZ bar is the vendor barbell end-on (D-LIB15R2-EZ)"] },
  "stance.width": { "range": [0.22, 0.28], "basis": [
    "0.22 m, feet hip width: barbell_curl c2; the value is the pinned lib_triceps_pushdown's hip-width stance (triceps_pushdown.mjs:38, feet at +-0.11 m; pilot-a.json:383)",
    "0.28 m, feet shoulder width: the pinned parent lib_dumbbell_biceps_curl (dumbbell_biceps_curl.mjs:48, FOOT_X 0.14; pilot-a.json:261)"] } } },
"PUSHDOWN": { "ruling": "D-LIB15R2-RANGES", "params": {
  "bar.kind": { "range": ["straight"], "basis": [
    "the pinned parent lib_triceps_pushdown draws the straight bar (triceps_pushdown.mjs:167; pilot-a.json:383); straight_bar_triceps_pushdown c1"] } } }
```

### 17.6 Per row

| id | mode | params (claim) or clone source |
|---|---|---|
| straight_bar_triceps_pushdown | T PUSHDOWN | `bar.kind: 'straight'` (c1); poses, rig and builder the parent's (c3, c4, c11 = the parent's) |
| barbell_curl | T CURL | `load.primitive: 'barbell'` (c1), `stance.width: 0.22` (c2 hip width); builder `elbows` back (c4 "never back", c5) |
| ez_bar_curl | T CURL | `load.primitive: 'barbell'` (c1, D-LIB15R2-EZ); stance the parent's (c3 hip- to shoulder-width); builder `elbows` forward (c4, c5) |
| reverse_curl | T CURL (registry parent dumbbell_biceps_curl, D-LIB10-PARENTS) | `load.primitive: 'barbell'` (c1 overhand bar); stance the parent's (c2); builder `swing` (c5) |
| single_arm_triceps_pushdown | H | clone triceps_pushdown: TILT/TRUNK 0 (c16 torso vertical), the working arm on eq/dHandle.mjs (c2, imported), the free arm hanging |
| alternating_dumbbell_curl | H | clone dumbbell_biceps_curl with bayesian_cable_curl's split stance (c3); the near arm curls, the far arm stays at the start (c1) |
| hammer_curl | H | clone dumbbell_biceps_curl, split stance (c2), dumbbell side-on (vendor `dumbbell` `axis`, as dumbbell_overhead_triceps_extension; c1, c5) |
| incline_dumbbell_curl | H | clone dumbbell_biceps_curl on `../eq/inclineBench.mjs` (imported), seated, back on the pad (c2), arms behind the torso line (c2, c3) |

### 17.7 Tempo, pose and fault→key maps (8 new cards)

Tempo (D-LIB8M-TEMPO; section 8's rule): straight_bar_triceps_pushdown 1/2/1 (c12) Press 1, Hold 1, Return 2;
barbell_curl 1/2/0 (c13) Curl 1, Lower 2; ez_bar_curl 1/2/1 (c14) Curl 1, Hold 1, Lower 2; reverse_curl 1/2/0 (c15)
Curl 1, Lower 2; single_arm_triceps_pushdown 1/2/1 (c10) Press 1, Hold 1, Return 2; alternating_dumbbell_curl 1/2/0
(c10), hammer_curl 1/2/0 (c12), incline_dumbbell_curl 1/2/0 (c12) Curl 1, Lower 2. No Rest.

Pose map: identity on all 8 (spec start = card start, spec end = card end); each fault happens at the card's end
(the top of the curl, the bottom of the press).

| id | plate.mistake (claim) | drawable | first tell key | topFault |
|---|---|---|---|---|
| straight_bar_triceps_pushdown | leaning over the bar or arching (c11) | true | `lean` | `lean` |
| barbell_curl | elbows moving back (c5, c4) | false | `elbows` | `wrists` (hm0 c8) |
| ez_bar_curl | elbows drifting forward at the top (c4, c5) | false | `elbows` | `wrists` (hm0 c8) |
| reverse_curl | swinging the arms (c5) | true | `swing` | `swing` |
| single_arm_triceps_pushdown | leaning or arching (c17) | true | `lean` | `lean` |
| alternating_dumbbell_curl | working elbow swinging (c5, c4) | false | `elbows` | `wrist` (hm0 c7) |
| hammer_curl | elbows moving forward (c6, c4) | true | `elbows` | `elbows` |
| incline_dumbbell_curl | elbows drifting forward (c4, c3) | false | `elbows` | `wrists` (hm0 c11) |

### 17.8 Facts plan and unsourced numbers

Every number and every contact a start/end quote gives for a drawn pose (quotes read on the copied quotes files;
section 10's rules: D-LIB9-FACTPOSE, D-LIB17-ORCHOICE, the hands on the implement checked at the wrist, each side of a
plural paired part). Written as the 3 keys at Do 4; incline_dumbbell_curl's once drawn.

| id | number or contact in a start/end quote | proposed plateFacts | reason |
|---|---|---|---|
| straight_bar_triceps_pushdown | c1 "grip the bar firmly in both hands" (setup) | `contact wrist.r`, `contact wrist.l`, pose `start`, c1 | hands on the implement, both sides |
| straight_bar_triceps_pushdown | c10 "the bar did not touch the body during full extension" | none (a clearance): the parent's `checks` plane in front of the thigh, end | not a contact |
| barbell_curl | c1 "Grip a bar ... hands about shoulder-width apart" (setup) | `contact wrist.r`, `contact wrist.l`, `start`, c1 | both hands |
| barbell_curl | c1 "wrists, elbows, and shoulders are in a straight line" | none (an alignment): a drawn-item test, start | no fact kind measures it |
| ez_bar_curl | c1 "Hold an EZ bar with an underhand grip on the angled sections" (setup) | `contact wrist.r`, `start`, c1 | no plural hands (preacher_curl c1's precedent) |
| reverse_curl | c1 "Grip a bar with an overhand (pronated) grip", "hands in a straight line with shoulders and elbows" (setup) | `contact wrist.r`, `contact wrist.l`, `start`, c1 | plural hands |
| single_arm_triceps_pushdown | c2 "grasp it firmly with a full grip" (setup) | `contact wrist.r`, `start`, c2 | one hand on the handle; "handle or rope" is the attachment, not the grasp |
| single_arm_triceps_pushdown | c16 "keeping your torso aligned vertically with the floor" | none (a direction): drawn-item test, torso within ±2° of vertical, both poses (A8) | no fact kind measures it |
| alternating_dumbbell_curl | c2 "Hold a pair of dumbbells ... arms hanging by your sides" (setup) | `contact wrist.r`, `contact wrist.l`, `start`, c2 | a pair |
| hammer_curl | c1 "Stand holding dumbbells in your hands ... elbows fully extended" (setup) | `contact wrist.r`, `contact wrist.l`, `start`, c1 | plural; "fully extended" is no number |
| incline_dumbbell_curl | c1 "Grab a pair of dumbbells, and sit down on an inclined bench" (setup) | `contact wrist.r`, `contact wrist.l`, `contact seat`, `start`, c1 | concentration_curl's seat precedent |
| incline_dumbbell_curl | c2 "Lean back against the pad" (setup) | `contact backUpper`, `start`, c2 | section 10's row |
| incline_dumbbell_curl | c2 "hang down at your sides, perpendicular to the floor" | none (a direction): drawn-item test, start | |
| incline_dumbbell_curl | c4 "Keep your elbows pinned back and tucked against the bench for the duration of the set" | `contact elbow.r`, `contact elbow.l`, start and end, c4, on the pad's edge [unverified until drawn: if the geometry cannot hold it, reported at drawing] | not setup; "for the duration" covers both poses |
| incline_dumbbell_curl | c1 "between 45 and 65 degrees" | none (an equipment range; section 10) | |

Not facts: c4 "at your side or ... slightly forward" (barbell_curl, reverse_curl), stance "hip or shoulder-width" and
"or in a staggered stance", "one or both elbows" (D-LIB17-ORCHOICE); "close", "by the sides", "alongside" (no number,
no contact; cable_curl's precedent); the resting hand of alternating_dumbbell_curl at the end (c1 is setup); incline
c11 (ACE's seated curl, MECH, not the drawn exercise); reverse_curl c10 (an isokinetic lab number); no card says "feet
flat", so no heel or ball contacts. Card-text note for research: alternating_dumbbell_curl's second c3 quote says
"neutral grip (palms facing your body)" against its c2 "palms forward"; the plate draws c2.

Unsourced numbers (each spec or template header lists its own): the pushdown station, bar and lean (the parent's);
the 0.22 m stance's value (triceps_pushdown's); the CURL bar (vendor barbell, plateD 0.23, plates [0.03]); hand width;
elbow 0°/140° (the parent's); the soft knees; the D-handle (dHandle.mjs) and free-arm pose; the split-stance length
(bayesian_cable_curl's); the incline bench angle within 45-65°, seat and pad; every Mistake magnitude (17.5).

### 17.9 PQ-H3 estimates [est, unverified until drawn] and expected flags

| id | deviation (end → Mistake) | Trace |
|---|---|---|
| barbell_curl | elbow 30° back, about 0.17 m → ~25 px | grip arc about the elbow, ~0.3 m × 2.4 rad → ~100 px |
| ez_bar_curl, hammer_curl, alternating_dumbbell_curl | elbow 45° forward (the parent's 37 px) | as the parent (~100 px) |
| reverse_curl | upper back rocks ~0.13 m → ~19 px | ~100 px |
| straight_bar_triceps_pushdown | the parent's lean (pinned, passes) | the parent's |
| single_arm_triceps_pushdown | lean from vertical, ~0.2 m at the upper back → ~28 px | as the parent |
| incline_dumbbell_curl | elbow forward ~0.15 m → ~22 px | ~0.6 m |

Expected flags: F5 on every id (3.57:1, D-LIB9-F5); F7 on alternating_dumbbell_curl, barbell_curl, ez_bar_curl
(D-LIB15R2-F7) and on cross_body_hammer_curl, incline_dumbbell_curl, wrist_curl (D-LIB15-F7); F2 as ruled
(concentration_curl, wrist_curl) plus cross_body_hammer_curl if 17.3 is accepted; the CURL children inherit the
parent's F2 and F4 [unverified until drawn]; every other flag measured is named at the sheet (predicted / measured).

### 17.10 Order and stops

Wave 1 (zoom rows) → PLATES READY 1; card fields after RULED; wave 2a (H rows); wave 2b (templates, parent proofs,
then the T rows; their QA counts only after the family rows merge). Stops S1-S5 as the card.

### 17.11 Build-ahead status (wave 2)

- Templates: CURL and PUSHDOWN pass their parent proofs (all 9 fragments equal; one template byte changed moves 3).
- H rows drawn and in rows.json: hammer_curl, alternating_dumbbell_curl, single_arm_triceps_pushdown,
  incline_dumbbell_curl. Their LB5 A15 fixes against the clone sources: single_arm_triceps_pushdown re-keyed to 48
  and its faulty upper arm dashed, no arc arrow; hammer_curl and alternating_dumbbell_curl drop the elbow measure arc
  and the Mistake arrow, and alternating drops the hidden start forearm (each leader or arrow sat on the Trace or the
  solid end figure); incline_dumbbell_curl's measure radius 28 and no arrow. Authoring QA: only H6:no-card (Do 4).
- T rows: stopped (#349 6540834642). The pinned parents' Trace keys, Mistake arrows and measure leader fail LB5's A15
  drawn-item tests, and a template cannot change them (D-LIB10-FACTS). The 4 T specs are out of the branch until
  ruled (drawn at 20431f58).
- Card fields (Do 4, after RULED): the 3 keys on incline_dumbbell_curl, single_arm_triceps_pushdown,
  alternating_dumbbell_curl and hammer_curl, as 17.7 and 17.8. One change from 17.8: incline's c4 elbow contact is no
  fact. The arm hangs beside the pad (7.3 cm from the pad face's plane in the side view), and no side-view plane
  measures a contact with the pad's side. It stays drawn. The hands get `checks` at their start place (cross_body_hammer_
  curl's precedent). Authoring QA on the 4: all 10 hard checks pass, node and browser. Named flags (17.3's form):
  F3 47.1 on alternating_dumbbell_curl (short leaders), and F4 0 on alternating_dumbbell_curl and incline_dumbbell_curl
  (no hand-placed labels).
- After D-LIB15R2-TPARENT and -TEMPLDIR (#349 6540842602, 6540882818): CURL, PUSHDOWN and the 4 T rows are restored.
  Each template gains `checks` for both wrists at their start place, for the hand-contact facts (the H rows' form).
  `checks` do not reach the 9 fragments, so both parent proofs still pass. Facts-set boxes on the T rows keep their
  leaders 6 px clear: barbell_curl `still` {96, 60} and `elbows` {80, 140}, ez_bar_curl and reverse_curl `elbows`
  {80, 100}, straight_bar_triceps_pushdown `wrists` {40, 250}. All 8 cards carry the 3 keys.
- Panel mx9 fix round (#349 6541830086), on alternating_dumbbell_curl, barbell_curl and incline_dumbbell_curl:
  - alternating_dumbbell_curl R4: the resting forearm is drawn dashed again (the hidden start forearm, which is where
    the far arm hangs), holding the dashed start dumbbell. The 'Other arm still' leader ends on that forearm
    (`wrist.l` −5, −5 px), and the `elbows` label is boxed at {80, 110} so both leaders clear the dashed lines by 6 px.
  - barbell_curl R1: the CURL `elbows` dir 'back' builder also draws the load, dashed, at the faulty hand. The faulty
    forearm is the engine's own outline at the drawn length (the extents are equal, 47.1 px), which a test pins within
    1 px. The forward builder and the parent proof are byte-identical.
  - incline_dumbbell_curl R2/R3/R6: the Trace follows the arc about the elbow (48 key poses), so the ghosts sit on it.
    The pad's face, hidden behind the arm and back, is drawn dashed from the seat's rear edge (the hinge) up the back.
    The pad stays at 55° from the floor, and the back and buttocks rest on it (0 cm). The measure is radius 20 with its
    label boxed at {45, 295}, and the `bench` label is boxed at {40, 180}. QA: all 10 hard checks pass; F3 and F4 are
    no longer raised on incline.
