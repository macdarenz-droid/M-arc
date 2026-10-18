# LB2 plates: design note (LIB-10)

Card: `docs/supervisor/verify/lib-10-card.md` @ `95928e1f` (Do 1). Rulings: lib4-cards section 15 and 15.1
(D-LIB3c-SHARED) @ `95928e1f` (D-LIB10-RANGES, D-LIB10-CHILDPROOF, D-LIB10-AHEAD, D-LIB10-TEMPLATES, D-LIB10-PA,
D-LIB10-DECLINE, D-LIB10-FACTS, D-LIB10-ANCHORS, D-LIB10-PARENTS, items 10-11), with sections 12-14 (D-LIB9-*,
D-LIB5-TEMPO8, D-LIB9-F5), and this note's ruling D-LIB10-NOTE (#265, comment 6255216039). Plan: `claude/howto-options`
@ `6550ce28`. Research: `claude/libht-research-lb2` @ `2b6747f8` (named on #265, comment 6255125324; LR-31 and LR-33
applied, LR-29 verify VALID); first read at `claude/libht-research` @ `0393aac`. Census: `docs/howto/library/inputs/census.json` @ `4a9fd86`. Pilot A code is
read and copied from #109 @ `e6f39ff` (D-LIB8FIX-CARRY), never imported or merged.

Nothing here ships (D-LIB10-AHEAD): every LB2 row stays at stage `drawing` or `review` in `lb2/rows.json`, outside
`batches/`; `tests/howto/lb2-plates.test.ts` A9 enforces it.

## 1. Engine, modes and the T rule

- **Engine.** Every LB2 spec imports only `tools/plates/library/engine.mjs` and composers under `eq/` (D-LIB9-ENGINE).
  Specs and templates copy pilot A code; they never import a pilot A spec (D-LIB9-CLONE; A3 tests it).
- **T rule (Do 1, plan 3.1:236).** A child is T only if it differs from its template parent only through derive.mjs
  PARAMS keys (:4-12) and the D-LIB10-FACTS schema. Anything else makes it H.
- **Result (ruled, D-LIB10-BENCH-H, #265 comment 6256170884):** P2 T0 H9 for LB2's 12. All 7 drawn here are H; BENCH is
  not built in LB2. The Q1(c) table (3a) showed no BENCH child reaching its touch target at a grip its card allows, so
  each BENCH plate's bottom comes from its own card's facts; where those cannot all hold on the body, the builder
  stops and posts the per-card conflict, never tuning a value off its card. The template and PARAMS rulings (15 (i),
  (ii)) stay in force for later batches.

## 2. Per id

Anchors: the 8 = golden A, `tests/howto/golden/GOLDEN.json` `ref bc0f378`; pilot A = `e6f39ff` (16 approvals,
D-PILOTA-R5; carried only where FX8 holds, D-LIB8FIX-CARRY). View: side for all 7 (card `plate.view` = census `view`), so
F6 is never expected. Census closest: machine_chest_press (bc0f378) for all but dumbbell_pullover (lat_pulldown, bc0f378);
machine_chest_press is excluded as a hidden anchor (D-CRITIC-CAL2), so it is never the drawing source.

| id | mode and reason | template parent / clone source (approving sha) | composer / primitives | hand zoom: pair key |
|---|---|---|---|---|
| barbell_bench_press | H (D-LIB10-BENCH-H). **Held for a ruling:** c2 (mid-chest, forearms perpendicular to the floor) and c3 (upper arms 45-60°) cannot both hold on this body; a mid-chest touch with a side-view vertical forearm puts the upper arm at 68-71° (#265 comment 6256258126). Mistake `path` (c25, c8) | dumbbell_bench_press's supine code (e6f39ff), copied | vendor rackUpright x2 + parts.mjs sideBar pin, vendor barbell | `bar-low-palm`: no LIB-7 key yet |
| incline_barbell_bench_press | H (D-LIB10-BENCH-H). Facts feasible: upper chest with a side-view vertical forearm gives 53-60°, inside c7's 45-75°. Waits for pilot A on main (its rig is pilot A's inclineBench, imported). Mistake `flare` (c8, c9) | dumbbell_bench_press's supine code and incline_dumbbell_press's reclined solve (e6f39ff), copied | inclineBench (pilot A, imported), vendor rackUpright, barbell | `bar-low-palm`: no key yet |
| close_grip_bench_press | H (D-LIB10-BENCH-H). Drawn: grips in line with the shoulder joints (c1, read from landmarks: 2 × 0.2266 m), the bar on the chest where the ribs end (c4, thorax 0.66 H), the elbow by the ribs (c2); the card gives no forearm rule. Mistake `flare` (c2) | dumbbell_bench_press's supine code (e6f39ff), copied | vendor rackUpright x2 (head-side J-hook) + parts.mjs sideBar pin, vendor barbell | `bar-low-palm`: no key yet |
| decline_bench_press | H (D-LIB10-DECLINE). New pose class (declined) and rig; 'decline' is not a BENCH value until its plate is pinned | dumbbell_bench_press's supine code (e6f39ff), copied | **declineBench** (new, single use), vendor barbell | `bar-low-palm`: no key yet |
| arnold_press | H (ruled, Q6). Imports pilot A's inclineBench, so it waits for pilot A on main. Its start (dumbbells in front of the chest, palms facing you, c1) and the palm turn are not PARAMS keys (derive.mjs:4-12) nor facts; SEATPRESS is not built (D-LIB10-TEMPLATES) | dumbbell_shoulder_press (e6f39ff), copied | inclineBench (pilot A, read only), vendor dumbbell | `arnold-palm-turn`: no key yet |
| skull_crusher | H (own parent). New joint action (elbow only, census `N`) | dumbbell_bench_press's supine code (e6f39ff), copied | vendor bench, vendor barbell end-on as the EZ bar (Q3) | `wrist-neutral-ez`: `ez/push` (LIB-7 @ 55e91e9, parked, D-LIB7-19a) |
| dumbbell_pullover | H (own parent). New joint action (shoulder extension, census `N`) | dumbbell_bench_press's supine code (e6f39ff), copied | vendor bench, vendor dumbbell held vertically | `cupped-dumbbell`: no key yet |

Not drawn here (D-LIB10-PA): dumbbell_bench_press (P:BENCH), dumbbell_shoulder_press (P:SEATPRESS), incline_dumbbell_press
(T mark; stays as pinned), barbell_overhead_press (H; redFlags back) are reused unchanged, with no row here. dumbbell_fly
stays held (pilot A `held`, D-LIB8-fly) and is in no LB2 file. As an option, the T slice may show that BENCH's incline
branch rebuilds incline_dumbbell_press byte for byte (D-LIB10-PA).

No hand block is built. Six cards have a hand zoom with no LIB-7 key: the four barbell ones (`bar-low-palm`),
arnold_press (`arnold-palm-turn`) and dumbbell_pullover (`cupped-dumbbell`); the LIB-7 fixer proposes them.

## 3. Templates (not built in LB2: D-LIB10-BENCH-H; this section is kept as the record of the Q1 rulings)

- **BENCH** (`templates/BENCH.mjs`, after pilot A is on main, D-LIB10-TEMPLATES). `make(params, facts)` copies
  dumbbell_bench_press's code (D-LIB9-CLONE (a)-(c)); its dumbbell path is the parent's code unchanged, so the byte proof
  `make(parentParams, parentFacts)` = the parent's 9 pinned fragments, rebuilt alone. Never edit the parent to pass.
- **PARAMS keys and proposed ranges** (D-LIB10-RANGES: the supervisor's ruling quotes the family row; LIB-10 never edits
  `qa/param-ranges.json`):
  (ruled, D-LIB10-NOTE 11; the supervisor's ruling quotes the family row once the basis pins are on main)
  - `load.primitive`: [dumbbell, barbell]. Basis: dumbbell_bench_press (dumbbell) and barbell_overhead_press (barbell),
    pinned entries on main after the LIB-8 merge card.
  - `bar.kind`: dropped (no child card states "straight"); the barbell load draws the vendor straight bar as a
    template constant.
  - `bench.angle`: [0, 45] deg from horizontal. Basis: dumbbell_bench_press (0) and incline_dumbbell_press (45). Decline
    stays out until its plate is pinned. The incline measure arc reads 30° from horizontal, never 60° from vertical.
  - `grip.width`: [0.453, 0.453] m. Basis: close_grip_bench_press c1 on the body model. With `load.primitive: dumbbell`
    it throws.
- **Per T child, the claim on its own card that states each param** (D-LIB10-RANGES item 3; the verifier checks it). A
  child sets only the keys whose value differs from parentParams:
  - barbell_bench_press: `load.primitive` barbell: c1 ("grip a barbell").
  - incline_barbell_bench_press: `load.primitive` barbell: c5 ("unrack a barbell"); `bench.angle` 30: c1
    (Rodríguez-Ridao "at a bench inclination of 30°"; Boostcamp "30 to 45 degrees").
  - close_grip_bench_press: `load.primitive` barbell: c1 ("Lie face up on a barbell bench, then reach up and grip the
    bar"); `grip.width` 0.453: c1, ACE "grip the bar with the hands directly in line with the shoulders", computed as
    `2 × |landmarksOf(base)['shoulder.r'][0]|` at the template's SCAP, rounded to 1 mm (0.2266 m → 0.453; the ruling
    wrote 0.454 from TOP_X 0.227). A unit test recomputes it from engine landmarks (|Δ| ≤ 0.5 mm). If the verifier
    judges that c1 (which also holds StrengthLog's "around shoulder-width apart, or slightly wider" and Lockie's "~95%
    of biacromial distance") does not single out the shoulder-joint reading, close_grip is H.
- **Barbell default grip (Q1(b), ruled):** barbell_bench_press and incline_barbell_bench_press set no `grip.width`; one
  barbell-branch template constant, listed unsourced, tested to be wider than 0.453. decline_bench_press's GRIP_X 0.30
  (decline c3, the same phrase) will equal half that constant, or the note says why not.
  T rows take their params and claims in rows.json at the T slice; the rows carry mode, parent and template now.
- **The barbell bottom rule (in the template, not a fact; Q1(c)).** Stated completely: the bar's underside rests on
  the drawn chest surface (thorax-frame depth 0.072 H, as the parent's nipple-line point); the forearm is plumb (vertical
  in the side and the front view: the elbow straight under the grip, at the grip's x); the upper arm has its full
  length L1 from the shoulder joint at the template's SCAP. Those three fix the touch height, the elbow and so the
  upper-arm angle from the grip width and the bench angle; no other constant enters. Angle convention: both the 3D angle
  between the upper arm and the torso axis (hips→neck) and the angle seen from above (the parent's BOTTOM_ABD
  convention) are reported. Targets on the body model: mid-chest (BB c2) = the parent's nipple line, thorax 0.72 H;
  "where the ribs end" (close c4) = the thorax's lower edge in the body model, 0.66 H (body.mjs:123); upper chest
  (incline c7) = incline_dumbbell_press's UPPER_CHEST, 0.77 H. Each relation is a drawn-item test at ±1 cm / ±2°.
- **3a. Q1(c) feasibility (solved on the engine, scratch script; flat = the parent's supine body, incline = 30° from
  horizontal with incline_dumbbell_press's reclined solve):**

  | child | grip W (m) | touch (thorax H) | target | miss | touch footward of the shoulder | upper arm 3D / from above | card angle |
  |---|---|---|---|---|---|---|---|
  | barbell_bench_press | 0.50 / 0.60 / 0.70 | 0.625 / 0.630 / 0.641 | 0.72 | 14-17 cm low | 26-29 cm | 35-43° / 5-27° | c3 45-60° |
  | close_grip_bench_press | 0.453 | 0.624 | 0.66 | 6.3 cm low | 28.7 cm | 34.3° / 0.1° (elbow by the ribs) | c2 by the ribs |
  | incline_barbell_bench_press | 0.50 / 0.60 / 0.70 | 0.713 / 0.718 / 0.728 | 0.77 | 7-10 cm low | 18-20 cm | 28-37° / 5-25° | c7 45-75° |

  Width the rule needs to reach each target: mid-chest W 0.965 (upper arm 72.7° 3D, 69.3° from above); ribs' end
  W 0.805; upper chest W 0.90 (55.1° 3D). So under the plumb rule no child meets its touch target at a grip its card
  allows ("slightly wider than shoulder-width"; "in line with the shoulders"), and barbell_bench_press's c2 (mid-chest)
  and c3 (45-60°) cannot both hold with a plumb forearm on this body: a mid-chest touch puts the elbow 11.5 cm footward
  of the shoulder, which is 69° from the torso axis in 3D. The parent reaches mid-chest only with a side-view-vertical
  forearm leaning in 11.5° in the front plane (dumbbell_bench_press.mjs:23-26); a barbell at W 0.60 with the parent's
  60°/22° elbow would lean in about 33°. The supervisor rules the way on (#265).
- **Facts schema (D-LIB10-FACTS; ruled with five corrections, D-LIB10-NOTE 12), closed, unknown keys throw:**
  `callouts` [{key, text, anchor, box?, cue}], `tells` [{key, text, anchor, box?, cue}], `tempo` (built from the ruled
  map and the card), `alt`, `mistakeAlt`, `mistake` {builder, magnitudes}. Builders: the parent's `hipsLift` {lift},
  the bar-path builder for barbell_bench_press (c25: pressed straight up off the chest instead of up and back) {drift},
  `elbowFlare` {flare} (incline c8, c9: the elbow level with the shoulder), `elbowFlareHigh` {flare, high}
  (close_grip c2). Each magnitude is typed and bounded in the template, throws outside its bounds and is listed as
  unsourced in the child's header. Anchor grammar, closed: an engine landmark name; `{ at: <landmark>, pose: 'end' |
  'mistake', off? }`; or a named anchor the chosen builder exports (as the parent's `gapBot`). Never coordinates; guides
  come only from the builder. `tells[0].key` is the ruled key (section 8), tested with a mutation. No top-level `cue`
  (the parent exports none). Never poses, equipment, camera, trace, measure, checks, datum, ghosts or view. The incline
  measure arc is drawn by the template whenever `bench.angle` > 0.
- **Byte-proof plan (A7):** a test builds `make(parentParams, parentFacts)` alone through the plates page and compares
  its 9 fragments with pilot A's pinned entry on main; mutations: one byte of a template constant, a facts key outside
  the schema (throws), one parent fragment changed in memory. The optional incline_dumbbell_press byte proof is dropped
  (D-LIB10-NOTE 11 condition 4).
- **SEATPRESS:** not built here (arnold_press H, Q6); it waits for its first T child in a later batch.

## 4. Composers (Do 4)

- `declineBench` (new, single use; anchor decline_bench_press): the declined pad and frame, the leg post and foot rollers
  (c1), the rack upright with a J-hook (c1, c7), one safety arm (c6). All static; reads no file; PRIMITIVES only
  (backPad via sideBar, box, kneePad, rackUpright). Its sizes are assumptions, listed in its header and in the spec's
  "Unsourced numbers".
- **Barbell rack (BENCH children, now H):** close_grip_bench_press draws two vendor `rackUpright`s (the head-side one with
  the vendor J-hook, which points the way the figure faces: into the rack, toward the feet) and a safety pin drawn with
  `eq/parts.mjs` `sideBar` (on main), slightly below the bottom, its hidden span redrawn dashed. No new composer, no
  fork (#265 comment 6256258126). The record of Q2 as ruled for the T route follows.
- **Barbell rack (Q2 as ruled for the T route):** pilot A's approved `safetyArms` (anchor barbell_overhead_press) with its
  existing `hookY`, and the vendor `rackUpright`. Open point, proved at the T slice with drawn-item tests: safetyArms'
  hook sits on the FRONT upright's rear face and points −z, while the lifter's head is at −z, so one rack must (a) open
  the hook into the rack with the racked bar headward of the start bar and reachable (BB c1), (b) run the safety under
  the touch and past it (BB c6), (c) keep the bar above the pins in every pose (c6). If that needs anything beyond
  safetyArms' existing options, the builder stops and proposes a bench-rack composer (never editing safetyArms.mjs), and
  barbell_bench_press becomes its H anchor.
- **EZ bar (Q3 ruled):** no composer; EZ_PLATE_D 0.30 is a per-plate unsourced number, not an LB2 convention. If a later
  EZ user reuses it, skull_crusher is its anchor and ez_bar_curl, preacher_curl and reverse_curl wait for its pin.
No other composer is proposed, so Do 4's "other composers" step has nothing to wait for.

## 5. Expected flags

- **F5 on all 7** (D-LIB9-F5, 14.4): `exemptions: ['F5']` for the selected Mistake tell in Midnight at exactly 3.57 only.
- **F7: none** at `2b6747f8` (all 7 cards are `drawable: true` after LR-31). If a later head makes a card drawable:false,
  F7 is expected on it and the note is re-posted.
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

Ruled (D-LIB10-NOTE 9 and Q5, research `2b6747f8`; lb2/tempo.json). Rule (D-LIB9-CARDFIELDS, LR-33): the concentric phase takes `up`, the eccentric `down`, and `Hold` takes `pause` right
after the concentric, only if pause > 0. No Rest. No constant without a quote that states its seconds.

| id | card up/down/pause (claim) | drawn start | phase array |
|---|---|---|---|
| barbell_bench_press | 1/2/1 (c26, c18, c17; R-LB2-8) | top | Lower 2, Press 1, Hold 1 |
| incline_barbell_bench_press | 1/2/0 (c14) | top | Lower 2, Press 1 |
| close_grip_bench_press | 1/2/0 (c9) | top | Lower 2, Press 1 |
| decline_bench_press | 1/2/0 (c8) + bottom constant | top | Lower 2, Pause 1 (constant, c8), Press 1 |
| arnold_press | 1/2/0 (c12) | bottom | Press 1, Lower 2 |
| skull_crusher | 1/3/0 (c17, c13; R-LB2-1) | top | Lower 3, Extend 1 |
| dumbbell_pullover | 1/2/0 (c18) | top (arms over the chest) | Lower 2, Pull 1 |

- **decline_bench_press (Q5, ruled).** At `2b6747f8` c8 is up 1, down 2, pause 0, with the bottom 1 s in tempo.text.
  The Pause is a ruled constant: claim c8, WorkoutLabs "Pause for a count of one." (lb2/tempo.json `constants`). If
  the verifier rejects the count-as-seconds reading, the array is Lower 2, Press 1; 1 s is never assumed.
- **Pose map:** none. Every drawn start equals the card's plate.start (top for the presses, the skull crusher and the
  pullover; the bottom for arnold_press, whose card starts there).

## 8. Fault→key map (13 Q1(a); ruled at `2b6747f8`, D-LIB10-NOTE 10)

| id | plate.mistake (claim) | first tell key |
|---|---|---|
| barbell_bench_press | the bar pressed straight up off the chest instead of up and back toward the shoulders (c25; c8) | `path` |
| incline_barbell_bench_press | elbows flaring out as the bar comes down (c8, c9) | `flare` |
| close_grip_bench_press | elbows drifting from the ribs, bar landing high (c2) | `flare` |
| decline_bench_press | bar landing high on the chest, toward the neck (c5) | `high` |
| arnold_press | back arching away from the pad (c3) | `arch` |
| skull_crusher | upper arms drifting back toward the head (c7) | `drift` |
| dumbbell_pullover | elbows bending a lot (c7) | `bend` |

Re-plan (D-LIB10-NOTE 10): barbell_bench_press's Mistake is a new bar-path builder: the bar raised straight up over
the touch point, against the solid diagonal Trace up and back toward the shoulders (c8), with a dashed vertical and a
dashed ghost bar at the top; the parent's `hipsLift` stays only as the parent's builder. incline_barbell_bench_press's
Mistake is `elbowFlare`: the elbow raised level with the shoulder at the bottom, drawn as a dashed ghost upper arm with
an arc from the end elbow, read in the side view as the elbow at shoulder height. Both are drawn at the T slice.

## 9. H slice (Do 2 a): what is drawn now

- **decline_bench_press:** `declined()` (the anchor's supine solve on a 15° pad; trunk -3.6°, neck -1.9°); hooked legs
  (hip 30°, knee 100°, ankle -25°) with the rollers on the ankle fronts; start: locked arms, bar over the shoulder
  joints (copied top reach); end: the bar's underside on the lower chest (thorax height 0.685 H; 13 cm footward of the
  shoulder, between the chest landmark and the navel); rack bar over the brow, J-hook where the elbows are still 25°
  bent (c7); safety arm 3 cm under the bar at the touch, its span behind the torso redrawn dashed in the end pose (R5).
  'Blades together' anchors on the upper back headward of the arm (thorax 0.84 H), its label under the pad (R6).
  Tempo Lower 2, Pause 1, Press 1. Mistake `high` (c5): the bar touches at the top of the sternum (thorax 0.80 H),
  19.1 cm headward of the end touch; bar to chin 33.7 cm at the end, 14.2 cm in the Mistake. Drawn as a dashed bar
  ring, a dashed ghost forearm (the engine masks the faulty arm inside the body) and an arrow; tells `high` (the bar
  lands high) and `neck` (near the neck, on the chin, with a dashed line from the bar).
- **skull_crusher:** supine on a flat bench, the pad ending 2 cm past the crown (c10); the elbow straight over the
  shoulder joint in every pose (upper arm vertical within 2° at t = 0..1, c5); 6 via keys so the bar's trace and the
  ghosts follow the arc round the elbow; end: grip centre 5 cm over the brow (elbow 119°); EZ bar end-on with 30 cm
  plates. Tempo Lower 3, Extend 1 (c17, c13). 'Wrists neutral' anchors on the start wrist, beside the straight arm in
  open space, so its leader stays clear of the Trace and the ghost bars (R1). 'Bar to forehead' anchors on the bar
  inside the plate ring, so its leader crosses the ring once from any side (R2, recorded). The 30 cm plate ring
  overlaps the head in projection (R3): kept, true in projection, the head drawn over it; R2 judges. Mistake `drift`
  (c7): the upper arm tips 25° back, the elbow 13.8 cm headward, the forearm keeping its end direction, so the bar is
  carried back over the crown (13.2 cm clear); a dashed plumb from the shoulder and a dashed bar ring. One tell: the
  card's fault has one visible sign (the upper arm off the vertical); a second sign would repeat it, and "bar behind
  the head" is allowed by c4. For a per-id ruling (Q-D5-4).
- **close_grip_bench_press (H, D-LIB10-BENCH-H):** the anchor's supine body; grips at |shoulder.r x| = 0.2266 m (c1);
  start: straight arms over the shoulder joints; end: the bar's underside on the chest at thorax 0.66 H (c4), 22.5 cm
  footward of the shoulder; the elbow aimed down and footward, 7.5 cm out from the shoulder line, by the ribs (c2), so
  the forearm leans toward the head (the card gives no forearm rule). Rack as section 4. Tempo Lower 2, Press 1 (c9).
  Mistake `flare` (c2): the bar lands at thorax 0.77 H, 19.2 cm headward (19.2 cm from the chin, never the neck), the
  elbow swings 25 cm out; dashed ghost upper arm and forearm, a dashed bar ring, arrows from the end bar and elbow;
  tells `flare` and `high`.
- **Q4 (ruled):** c5 governs the start: the start bar sits over the shoulder joints, 12.3 cm footward of the chin (c2
  says "above your face"). No plateFacts fact is written from c2 at pose `start`; the verifier is told both.
- Render defects R7 (the upright behind the head) and R8 (the floating knee, unsourced leg angles) are recorded; a test
  asserts the upright is drawn behind the figure.
- The two-build plates-page sha256 needs the cards on the branch: build-page.mjs refuses a row with no sources
  (build-page.mjs:88), and the sources come from the card. It is posted with Do 6's copy. The slice renders are made
  with the `2b6747f8` card sources in a scratch page (not committed).

## 10. Unsourced numbers (13.3 must-fix 14)

Each spec header lists its own. decline_bench_press: PAD_Y 0.60, HIP_FLEX 30, KNEE_FLEX 100, ANKLE -25, ROLLER_R 0.055,
the rack over the brow, RACK_ELBOW 25, SAFETY_BELOW 0.03, GRIP_X 0.30, LOW_CHEST 0.685 H, PLATE_D 0.45, the declineBench
sizes. skull_crusher: BENCH_TOP and FOOT_Z (the anchor's), HEAD_END 0.02, GRIP_X 0.16, TOP_ELBOW 4, FOREHEAD_GAP 0.05,
EZ_PLATE_D 0.30, DRIFT 25 (the Mistake's tip). decline_bench_press also: HIGH_CHEST 0.80 H (the Mistake touch). The
BENCH barbell default grip width (Q1(b)) is a template constant listed in the template header.

## 11. Work split (if a second drawer joins, `claude/lib-10-lb2-b`)

- This branch: decline_bench_press, skull_crusher, close_grip_bench_press, barbell_bench_press (after its conflict is
  ruled), incline_barbell_bench_press (after pilot A is on main).
- Family H (second drawer): dumbbell_pullover first (vendor parts only); arnold_press after pilot A is on main (it
  imports pilot A's inclineBench). Spec files only. arnold_press as H costs about +2.5 Opus-hours [est].
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

## 13. Questions for the supervisor (ruled as D-LIB10-NOTE, #265 comment 6255216039; kept for the record)

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
