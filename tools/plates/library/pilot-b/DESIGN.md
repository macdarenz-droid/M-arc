# Pilot B plates: design note (LIB-11)

Card: `docs/supervisor/verify/lib-11-card.md` @ `70eb1460` (claude/sup-lib4-cards), Do 1, with its rulings D-LIB11-*
and the supervisor's rulings on the final card. Research: the named head
`38d5f9c608b492587b3f923382ccb02bea8f1345` ('PILOT B research head', #277 comment 6266806550; focused LR-29 verify VALID,
pb-research-verify.md @ `712e2433`). Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`. Plan: claude/howto-options
@ `a5e87d9e`. Main at start: `565ea5a4` (train 30).

Nothing here ships before the pin (Do 11): every row stays at stage `drawing` or `review` in `pilot-b/rows.json`,
outside `batches/`; `tests/howto/lib11-pilot-b.test.ts` A7 enforces it.

Cards (Do 5 a): the research head was posted before this branch started, so Do 5 a0 copied the 5 cards and quotes
straight from it, byte for byte (`cards.sha.json`). side_plank and russian_twist are read from the same head for the
E-R5 renders only (Do 8), in the scratch worktree; their files are reserved here and never committed.

## 1. Engine and mode

- Every spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE). Code from
  pilot A (#109) and LB2 (#265) is copied, never imported (D-LIB9-CLONE); each copy names its source sha (D-LIB11-SMITH).
  Every copied root finder throws on a bracket with no root.
- Mode H for all 5 (D-LIB10-PA's mode rule: candidate.mjs:94 throws for 'P'; the template-parent link lives on later
  children). No template is built (D-LIB11-TEMPLATES).

## 2. Per id

| id | tier | mode and reason | clone source (approving sha) | census closest | composer / primitives | view |
|---|---|---|---|---|---|---|
| smith_machine_bench_press | A | H: D-LIB10-BENCH-H (BENCH is not built) and PARAMS has no Smith value (derive.mjs:4-12: neither `load.primitive` nor `bar.kind` names one); plan 6.2's T mark does not hold | barbell_bench_press @ `2dcbac1` (#265, LB2; D-LIB10-CRIT1), whose supine class is dumbbell_bench_press's (pilot A, approved @ `013f84e`, 21.4: the supine anchor); the Mistake's ghost-arm capsule from close_grip_bench_press @ `2dcbac1` | census gap `smith` | **smith** (new; anchor), vendor bench, barbell, pulley (bar end) | side |
| seated_leg_curl | C | H: its own parent; no PARAMS key names the machine; no template (D-LIB11-TEMPLATES) | none (no pilot A or LB2 plate has this pose class) | golden leg_press (seated machine) | **legCurlMachine** (new; anchor) | side |
| crunch | B | H: the SUPCORE parent, no template (D-LIB11-TEMPLATES) | dumbbell_bench_press's `supine()` (pilot A @ `013f84e`) at floor top 0; the floor camera of plank and mountain_climbers (pilot A @ `013f84e`, `e6f39ff`; D-LIB8-floor) | — (floor) | floor only | side |
| cable_fly | B | H: the CFLY parent, no template (D-LIB11-TEMPLATES) | pec_fly @ `013f84e` (arm circle, soft elbow, sweep) and upright_row @ `94c551f` (standing base, the front-view anchor, 21.6) | — | vendor cableColumn ×2 (with stacks), `line` D-handles; no composer | front |
| push_up | C | H: the PUSHUP parent, no template (D-LIB11-TEMPLATES) | plank (pilot A @ `013f84e`): the plank-class body and the floor camera | — (floor) | floor only | side |

Pose-class and convention anchors each id uses (depends_on): smith → dumbbell_bench_press (supine bench, `013f84e`);
push_up → plank (`013f84e`) and D-LIB8-floor; cable_fly → upright_row (front view, `94c551f`); crunch → D-LIB8-floor
(plank, mountain_climbers); seated_leg_curl → none in pilot A (golden leg_press is the census closest). No pilot B card
is drawable:false at the research head, so the drawable-fault convention (dumbbell_biceps_curl's F7) is not used.

Pose map (Q2(b)): for every id, card plate.start = spec `start` and plate.end = spec `end`. The Mistake is drawn
against the end pose (plate.mjs:78, :208), and every card's fault is a fault of the end pose or of the move into it.
smith's drawn start is the card's own (bar unhooked on straight arms over the mid-chest, c2, c5), not the free bar's
start over the shoulders. **push_up is the one exception (NOTE AMENDED): spec `start` = card plate.end (bottom, chest
on the floor) and spec `end` = card plate.start (top, arms straight).** At the bottom the straight body is about a hand's
width off the floor, so sagging hips would pass through it; at the top the sag reads against the solid straight body,
as in pilot A's plank. The tempo order follows the drawn start: Press, then Lower.

## 3. Composers (Do 3)

Each is `(lm, ctx) => item[]` through `perItem` (parts.mjs), PRIMITIVES types only, no file read, its sizes listed under
"Unsourced numbers" in its header and in the spec that uses it.

- **smith** (`eq/smith.mjs`; anchor smith_machine_bench_press). Parts: the rail (the guide rod: a 3 cm sideBar, vertical,
  through the bar's centre: c8's "completely straight bar path"), the hook rail (vendor rackUpright and its hole row, 9 cm
  footward of the rod), the carriage (a sideBar sleeve on the rod at the bar), its hook (a `poly` J from the carriage to
  the hook rail's face, c5), the safety stop (a `box` collar on the rod, its top below the bar's lowest drawn point, c4),
  a top cross-member and a floor beam. The composer throws when the bar's centre is off the rail. Moving parts (start to
  end): carriage and hook, which move with the bar. Between end and Mistake nothing moves (the bar stays on its line; only
  the arms flare), and the carriage (backPad) and hook (poly) carry `poly` anyway (PQ-H9). The stops are drawn by smith.mjs
  from primitives, never a fork of pilot A's safetyArms. In the side view the stop sits beside the chest, so the spec
  redraws its hidden outline as a dashed phantom in the end pose (13 Q2 (c)).
  Later users (plan 2.1:137) and what each needs, so the anchor is not redrawn: smith_machine_incline_press (an incline
  bench drawn by its spec under the same rail), smith_machine_shoulder_press (a seat; `top`, `stopY`), smith_machine_squat
  (a standing lifter, bar on the back; `stopY` low, the floor beam clear of the feet via `base`), smith_machine_shrug (the
  bar at hip height; `stopY`). None needs a new part; an angled rail would need a new option (not offered: the rail
  angle 0° is an unsourced number).
- **legCurlMachine** (`eq/legCurlMachine.mjs`; anchor seated_leg_curl). Parts: seat and seat post, back pad, thigh pad
  (a roller on thighTop just above the knee, c2), the lever turning about a pivot at the knee joint (c1) with the ankle
  pad (a roller on the back of the lower leg just above the shoe, c3), pivot boss and post, side handle (c5), floor
  beam. Moving parts (start to end): the lever (sideBar backPad) and the ankle pad (kneePad); both carry `poly`. Between
  end and Mistake nothing moves (only the ankle changes).
  Later users (plan 2.1:138): lying_leg_curl (no seat, back pad or thigh pad; a bench pad from its spec; pivot, lever and
  ankle pad unchanged), standing_leg_curl (the thigh pad becomes a knee pad in front of the thigh; the pivot post at the
  standing knee height).
- No other composer is proposed.

## 4. Expected flags

LIB-3 flags (A4's equality, measured on qa.mjs's table):
- F5 on every plate (14.4; D-LIB9-F5): the selected Mistake tell in Midnight at 3.57 only. qa.mjs shows 3.6 on all four
  slice plates; the element and the exact value are confirmed in the Mistakes slice post.
- F1 on crunch (D-LIB8-floor; held). **push_up raises no F1 (measured, NOTE AMENDED):** its floor camera
  `{ fit: { right: 76 }, maxScale: 1.35, y0: 339 }` gives 144.57 px/m, inside 123.91-146.29. At the full fit (177.18 px/m)
  'Chest to floor' has no clear box (`edge:` and `figure:…:270cells`), so the smaller scale follows Q-R2-3 (the smaller
  overshoot when labels need room); the scale is pinned ±0.5 px/m in the test.
- F7: none (all 5 cards drawable:true at the research head).
- F2 on cable_fly: a named flag (NOTE RULED, #278 6267313038, item 2; as LB3's pendlay F2): cover 0.628 against 0.549,
  the two full-height columns outside the open hands. No unsourced size is picked to pass it.
- No other flag is planned; any other raised flag is a defect to fix.

Sheet flags (shown as their own lines): the two new rigs, smith and legCurlMachine, each with its later users; any
drawing convention the supervisor rules (D-LIB13-LANDMINE-2).

## 5. smith's R10 items (tier A)

Stops set (the stop's top below the bar's lowest drawn point, c4); bar path clear of the neck (the rail stands at the
mid-chest, 22.6 cm footward of the neck landmark; the bar never leaves it, c8); bar hooks (on the carriage, reaching
the hook rail, c5). Each is a drawn-item test (A13: a stop deleted turns it red).

## 6. Hand zooms (none built)

push_up: palm-flat (`hand-palm-flat`, LIB-12 #191; both faults shown on the sheet, Do 10). smith: the card's
`bar-low-palm` zoom (inherited, parent c5): no LIB-7 key yet. cable_fly: a single D-handle in a neutral grip: no LIB-7
key yet. seated_leg_curl and crunch: no zoom on the card.

## 7. Tempo map (for the supervisor to rule; Q3, 14.7, D-LIB8M-TEMPO)

Rows: moving phases `{phase, s, move: true}`; Hold `{phase, s}` right after the concentric, present iff pause > 0. Order
follows the drawn start. No constants are proposed.

| id | plate.tempo (up/down/pause, claim) | rows |
|---|---|---|
| smith_machine_bench_press | 1/2/0, c12 c18 | Lower ← down, Press ← up |
| seated_leg_curl | 1/2/0, c7 c13 | Curl ← up, Return ← down |
| crunch | 1/2/1, c12 c3 c5 c11 | Curl ← up, Hold ← pause, Lower ← down |
| cable_fly | 1/2/1, c12 c5 | Close ← up, Hold ← pause, Open ← down |
| push_up | 1/2/0, c13 | Press ← up, Lower ← down (drawn start = the bottom, pose map above) |

smith's tempo.text names a 1 s bottom pause (Motra's 2-1-1, c18, WEAK) that is not written in `pause` (LR-33). The
quote does not say which digit is which phase, so it is not a constant here (14.7: a constant needs a quote that states
its seconds). Question 3 asks the supervisor to confirm.

## 8. Fault→key map (13 Q1(a))

| id | plate.mistake (claim) | key | other handlingMistakes keys (not drawn) |
|---|---|---|---|
| smith_machine_bench_press | elbows flared wide instead of about 45° (c7, c3) | `flare` | arch (c7, c17), bounce (c7, c3) |
| seated_leg_curl | feet flexed up as if standing, pushing with the calves (c10) | `flexed` | — |
| crunch | jerking up with the hip flexors, pelvis tipping, low back lifting (c6) | `lowback` | — |
| cable_fly | elbows bending and straightening into a press (c6) | `press` | — |
| push_up | hips sag, low back arches (c5) | `sag` | — |

All drawable:true, so topFault = the plate.mistake key and the first tell carries it.

## 9. Facts (D-LIB8M-FACTS with 22's scope; D-LIB11-FACTS2: quoted contacts in drawn poses are facts too)

Ruled: 'PILOT B MAPS RULED @ 6ade71ef' (#278 6269835256). Each fact's pose is the spec pose that the ruled pose map gives
for the pose its quote states; a setup quote states the start pose only (D-LIB9-FACTPOSE). Contacts go through H6's
`checks` path, so each has a spec check on that landmark and pose.

| id | fact | quantity / contact | claim |
|---|---|---|---|
| smith_machine_bench_press | `angle sh.r.elev end 45` | the 3D angle between the upper arm and the trunk at the bottom (engine shoulder elevation; NOTE RULED item 1) | c3 |
| smith_machine_bench_press | `contact grips end` | "until it touches your chest": the bar (grip midpoint) at the touch point on the mid-chest | c3 |
| smith_machine_bench_press | `contact backUpper start` | "Lie on the bench" (setup) | c1 |
| smith_machine_bench_press | `contact sole.r start`, `contact sole.l start` | "feet flat on the floor" (setup) | c2 |
| seated_leg_curl | `contact backUpper start` | "keep your back flat against it" (setup) | c4 |
| seated_leg_curl | `contact seat start` | "ground your hips down into the seat", before the curl | c5 |
| seated_leg_curl | `contact thighTop.r start` | "the thigh pad will be snug just above your knees" (setup) | c2 |
| seated_leg_curl | `contact grip.r start` | "grasp the handles on either side of you", before the curl | c5 |
| push_up | `contact wrist.r end` | "place your palms flat on the mat" (card plate.start = spec end; the flat palm sits the wrist at the forearm's distal radius, LIB-26) | c1 |
| push_up | `contact chest start` | "until your chest or chin touch the mat/floor" (card plate.end = spec start) | c3 |
| cable_fly | none (`[]`) | no quote gives a number, and "bring both hands together" (c5) does not say the hands touch | — |

Not facts, each with its reason: seated_leg_curl's ankle pad "under your legs just above your shoes" (c3) is a contact
on the lower shank, where the body model has no landmark, so H6 cannot check it; it is proven by the drawn-item test
(A2) instead and no key is invented. "Knees in line with the machine's joint" (c1) is an alignment, not a contact (the
spec's `knee.r` check proves it). Contacts are never carried to the end pose by inference ("thighs, hips and back
unchanged" is card text over setup quotes). crunch's heel distance stays a drawn-item test (NOTE RULED item 4).

## 10. Unsourced numbers (no card gives them)

- smith rig: rail angle 0° (vertical), rod 3 cm, hook rail 7.6 cm 9 cm footward, carriage 6 × 5 cm, hook 1.5 cm with
  a 2 cm lip, stop collar 6 × 4 cm, STOP_BELOW 2 cm, frame top 2.1 m, floor beam span. smith spec: BENCH_Z −0.46 (6 cm
  headward of the anchor's, so the head stays on the pad with the bar at mid-chest), GRIP_X 0.30 (LB2's), PLATE_D 0.45.
- legCurlMachine: seat pad 40 × 36 × 7 cm at 0.56 m, back pad 7 cm, rollers 5.5 cm radius, lever 4 cm, pivot boss 3 cm,
  pivot post 6 cm, handle 3 cm, floor beam 5 cm; spec: TILT −10, HIP_FLEX 80, KNEE_START 10, KNEE_END 120 (c6 "as far as
  you can"), ANKLE_RIGHT −30, MIS_ANKLE 0, ANKLE_T 0.85.
- cable_fly: column spacing ±1.24 m, width 0.24 m, height 2.1 m (vendor default), COL_Z −0.35 (the step forward, depth
  only), pulley 5 cm above the shoulder, ELBOW 20 and OPEN_ANGLE 10 (pec_fly's), handle 12 cm, MIS_ELBOW 90, camera
  124 px/m. **Column spacing and height decide F2** (question 2).
- crunch: END_CURL 25°, hand rest point, elbow and knee poles, MIS_TILT 14°, floor length.
- None is proposed as a drawing-convention flag yet; the supervisor rules any (D-LIB13-LANDMINE-2).

## 11. Template feasibility screen (non-binding)

- CFLY: low_to_high and high_to_low need a pulley height. PARAMS has no such key (`bar.kind` 'd-handle' and
  `load.primitive` 'cable' exist; no height), so a new key such as `pulley.height` would be needed. cable_fly draws the
  pulley from one constant, so a template can lift it to a parameter unchanged.
- PUSHUP: incline (hands raised), pike (hips high) and diamond (hands together) are none of PARAMS' keys (`grip.width`
  could carry the diamond hand spacing only if the hands are the "grip"; incline and pike need new keys).
- SUPCORE (5 children: cable_crunch, machine_crunch, reverse_crunch, bicycle_crunch, and the 5th per plan 6.1): load,
  machine and leg action are not PARAMS keys; `load.primitive` could name cable/machine but not the rig geometry.
- Each parent is drawn from named constants so a later template can copy its code unchanged.

## 12. Small-motion pre-check (D-LIB11-SMALL), fixed before measuring

crunch: px/m by D-LIB8-floor's fill-the-width rule, `camera: { fit: true, maxScale: 1.35, y0: 339 }` (cap 146.29 × 1.35 =
197.49 px/m); the fit gives 191.76 px/m. Trace point `backUpper` (the engine's mid-blade point: the shoulder-blade lift,
c3 and c4; DRAWING-GUIDE.md:29), trim [4, 6] as plank. Neither moved after the measure.
**Measured: trace 9.4 px (< traceLenMin 22.11), Mistake deviation 7.6 px (< deviationMin 11.39). crunch is HELD**
(below), never exaggerated: the card-true blade lift is 10.1 cm, about 19 px untrimmed at this scale.

## 13. Held

| id | reason | ruling |
|---|---|---|
| crunch | card-true PQ-H3: trace 9.4 px, deviation 7.6 px at the fixed scale and trace point | D-LIB11-SMALL: HELD with the shrugs and t_bar_row under LIB-ZOOM. SUPCORE has no anchor; LB9 re-plans. The spec stays in specs/ as the measured evidence; no row |

## 14. E-R5 render plan (Do 8; after 'E-R5 SCOPE RULED')

Check #190's head `82ae2d40` out into a temporary worktree outside the repo; add only scratch specs under its
`tools/plates/library/spike/`. Draw side_plank and russian_twist from their cards at the research head: right poses and
each card's own plate.mistake (hips sinking; hips and knees swinging), never the arms-only twist. Both cards are
drawable:false (the top faults, breath-holding and fast twists, have no drawable sign), so the post says the top fault is
not drawn. russian_twist: clasped hands, no ball. Re-render dumbbell_fly (pitch 45) and the rear-delt fly (pitch 15,
volume trunk) from the spike's own specs. 390 px, Silent Black and Paper, normal and Mistake; engine report ok and
contacts; the post carries every sha and the full scratch text (A15). If a Mistake needs a field the spike lacks (a
pelvis turn for "hips and knees swinging"), the post says so.

## 15. Questions for the supervisor (all ruled: 'PILOT B NOTE RULED @ a5a7238c', #278 6267313038)

Rulings: 1 accepted (3D shoulder elevation, section 9); 2 F2 is a named flag (section 4); 3 confirmed, no bottom-pause
constant; 4 confirmed, drawn-item test only; crunch HELD accepted. The questions as asked:


1. smith's 45°: drawn as the 3D shoulder elevation the engine reports (upper arm from the thorax axis). The alternative
   reading, 45° seen from above, has no engine angle; the fact above uses elev. Rule the reading.
2. cable_fly F2 (coverage 0.628 > 0.549 at 124 px/m): two full-height columns outside the open hands. Measured: at the
   reference 146.29 px/m the columns at ±0.98 m sit where the open hands are (start grip x −0.867 m, pulley x −0.88 m);
   at 124 px/m with columns at ±1.24 m, F2 0.628; under 0.549 needs about 1.9 m columns at ±1.2 m, which is picking
   unsourced sizes to pass a flag. Rule: F2 as a named flag, a column convention, or research (route 1).
3. smith tempo: confirm no bottom-pause constant (section 7).
4. crunch heel distance: confirm "no H6 form, drawn-item test only" (section 9).

## 16. Risks

- smith's flared elbow points out to the side, so in the side view the flared upper arm projects onto the shoulder: the
  Mistake shows a red dashed arm from the shoulder to the bar, a dashed shoulder line and an arrow. R5 is the critic's.
- smith's two tells ("Elbows flare wide" at the elbow, "Level with shoulders" on the shoulder line) both come from the
  card's one fault and its "instead of at about 45 degrees"; a reviewer may read them as one sign marked twice.
- seated_leg_curl's Mistake is a small red dashed foot and an arc-arrow (deviation 16.3 px vs 11.39).
- cable_fly's two tells both sit on the elbows (bend, drop); the hands pulling back to the chest is depth only.
- crunch held → SUPCORE (LB9) re-plans. A held or rejected anchor re-plans only its dependents (plan risk 3).
- #109 or #191 late: the sheet and the pin wait; the slices go ahead.
