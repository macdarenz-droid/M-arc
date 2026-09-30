# Design: "How to do it" for the whole library, family templates first

Date 2026-09-30. Base: main `cae1725` (HT-1, HT-2 merged), golden A `bc0f378` (`e2bea90c…`), golden B `b3a90af` (`5aab1aca…`).
Inputs: `census.md`/`census.json`, `pipeline.md`, `content.md` (this folder), the HT plan and cards, GA, golden B, engine `SPEC.md`, main.
Family mapping: `design/families.py` (asserts every one of the 153 ids is in exactly one family; output `design/families.json`,
`design/appendix.md`). Nothing in any repo was changed. Numbers marked **est.** are estimates; the rest come from a file or a script.

---

## 0. In plain words (for the owner)

- **Everything in the library gets the full How-to**: the Technical Plate (Trace, Mistake, tells, tempo) and every layer
  under it. 145 exercises to build. No exercise is left out by plan. An exercise is only left out if it cannot reach the
  approved quality, and then only with your yes, by name, before the Play Store build. Your own custom exercises never
  get one (a guide written for a library exercise could be wrong for yours).
- **How:** the 153 exercises fall into **21 movement families** (bench, hinge, curl, floor core and so on). For each
  family we build one drawing template and one layer template. Where a family already has one of your approved plates
  (5 families), the template must redraw that plate **byte for byte** before it may draw anything new. Where it has none
  (16 families), you first approve one "pilot" plate for it, on one pilot sheet. Then every other exercise is a short
  list of settings plus its own checked research card.
- **Quality proof, in order:** automatic checks that no new plate is worse than your approved 8 on any measurable point;
  a fresh critic that compares each new plate side by side with the family's approved plate; then **one sheet per
  family for you**. Only plates you approved can ship, and CI proves on every build that each shipped plate is exactly
  the one you approved.
- **What you see and when:** a pilot sheet first (about a week in), then family sheets in about 7 rounds of 3-4
  families. After each family merges you get the APK; the button appears only on that family's approved exercises.
- **Effort:** about 700-1,100 agent-hours (est.). With 4 build lanes: **about 4 weeks** (range 3-6), most of it in
  the family builds, not in waiting. Details and assumptions in 6.5.
- **Your items:** approve the family order once, the pilot sheet, 21 family sheets (in about 7 rounds), a few phone
  checks, and, only if needed, a named list of left-out exercises. No new saved or sent data, no new paid service.

---

## 1. Scope

### 1.1 Who gets what

| Group | Ids | What they get |
|---|---|---|
| Approved today | 8 | Unchanged. Their plates and layers stay byte-identical; nothing in this program edits them |
| Library, to build | 145 | Full How-to: plate (normal, Trace, Mistake, tells, tempo) + hand and posture close-ups, handling mistakes, feel map with shimmer, setup, risks with red-flag boxes, sources, evidence labels, the owner's line verbatim |
| Custom exercises | any | Never. No button (`!ex.custom`), as today. Linking one to a library guide would need a stored link = new saved data |

The 145 by family (full lists in the appendix; `families.py`):

| # | Family | Ids (new) | Anchor | Tier A | Tier 2 / 3 | Needs new drawing (R3 compose / R4 new) |
|---|---|---|---|---|---|---|
| F01 | SCAB seated cable pull | 7 (5) | approved LPD + SCR | 0 | 1 / 0 | 2 / 0 |
| F02 | HANG hang from a bar | 6 (4) | approved PU + HLR | 3 | 0 / 0 | 1 / 0 |
| F03 | BNCH lying on a bench | 11 (11) | pilot barbell_bench_press | 11 | 2 / 0 | 3 / 2 |
| F04 | SQAT squat | 9 (8) | approved SQ | 6 | 4 / 0 | 2 / 1 |
| F05 | HNGE hip hinge | 7 (7) | pilot romanian_deadlift | 7 | 1 / 0 | 0 / 2 |
| F06 | HROW hinged row | 6 (6) | pilot barbell_row | 4 | 2 / 0 | 0 / 2 |
| F07 | OHPR overhead press | 4 (4) | pilot barbell_overhead_press | 4 | 0 / 0 | 2 / 1 |
| F08 | SLEV lever machines, side view | 10 (9) | approved MCP | 1 | 0 / 0 | 7 / 0 |
| F09 | SLED leg press and sleds | 5 (4) | approved LP | 0 | 0 / 0 | 0 / 2 |
| F10 | CURL curls | 13 (13) | pilot dumbbell_biceps_curl | 0 | 1 / 0 | 2 / 0 |
| F11 | TRIC triceps, standing | 6 (6) | pilot triceps_pushdown | 2 | 0 / 0 | 0 / 2 |
| F12 | RAIS raise and fly, front view | 9 (8) | pilot cable_lateral_raise (LR is ref-src) | 0 | 1 / 0 | 1 / 0 |
| F13 | SCBL standing cable, side view | 7 (7) | pilot cable_chest_press | 0 | 1 / 0 | 2 / 1 |
| F14 | SPLT lunge, split, single leg | 8 (8) | pilot reverse_lunge | 1 | 1 / 0 | 0 / 0 |
| F15 | SFRT seated machine, front view | 5 (5) | pilot pec_fly | 0 | 0 / 0 | 5 / 0 |
| F16 | SHRG small range: shrug, calf raise | 6 (6) | pilot barbell_shrug | 1 | 4 / 0 | 1 / 1 |
| F17 | PLNK hands on the floor | 11 (11) | pilot push_up | 3 | 3 / 3 | 1 / 0 |
| F18 | DIPS dips | 2 (2) | pilot bench_dip | 1 | 1 / 0 | 0 / 1 |
| F19 | BRDG bridge, hip thrust | 2 (2) | pilot hip_thrust | 1 | 0 / 0 | 0 / 0 |
| F20 | FLOR floor core | 11 (11) | pilot crunch | 0 | 2 / 3 | 0 / 1 (+3 R5) |
| F21 | COND conditioning | 8 (8) | each id is its own pilot (concept sheet) | 2 | 2 / 6 | 1 / 4 |
| | **Total** | **153 (145)** | 5 anchored, 16 pilot | **47** | **26 / 12** | **30 / 20 (+3)** |

Why these 21 and not the census's 28 batches: a family is one **rig** (body support, view, equipment frame) plus one
**motion class**, so one template really drives every member. Batches that shared a rig were merged (for example the
bench presses, lying arm work and Smith bench work are one bench rig with an angle and a load parameter). Tier and
tier-A counts are from `census.json` and `content.md` appendix B; `families.py` asserts 153 ids and 47 tier-A.

### 1.2 Exclusions

**No exercise is excluded by design.** The library has no stretches or mobility drills (census 6). Conditioning and
cardio-like moves (12 tier-3 ids) get a plate under a concept the owner approves (1.3). The only ways an id can end up
without a How-to at release:

| Case | Candidates | Rule |
|---|---|---|
| Engine cannot reach the approved quality | russian_twist, bicycle_crunch (need trunk yaw, E-2 spike) | If the spike fails its bar (2.2), the id goes on the owner's named list with that reason |
| Evidence too thin | content.md 3.4 likely-thin list (battle_ropes, bear_crawl, high_knees, jumping_jacks, flutter_kicks, sled_pull, pendulum_squat, bayesian_cable_curl, resisted_hip_flexion, renegade_row); researched in the first research wave | `blocked:evidence` in `coverage.ts`, owner's named list |
| Owner rejects a plate twice | any | owner's named list, or he asks for another round |

**What an id without a How-to shows:** exactly what all 145 show today: no "How to do it" button, the Train card is
unchanged, no "coming soon". `coverage.ts` holds a row with `queued | researching | building | blocked:<reason> |
left-out:<reason>`. The release-candidate check fails if any row is not `done` or an owner-approved `left-out`.

### 1.3 Tier 2 and tier 3: one concept each, decided once on the pilot sheet

The locked chrome always has two poses, a Trace, a Mistake with tells, and tempo. Every tier-2/3 case fits it under one
of six concepts; the owner decides each concept once, on one example, before the family is built:

| Concept | Ids (26 tier 2 + 12 tier 3) | Plate | Example on the pilot sheet |
|---|---|---|---|
| Hold: teach the set-up into the hold | plank, side_plank, wall_sit, hollow_body_hold, pallof_press, bird_dog | start = the common sag or slump, end = the held line; Trace = hips moving into line; tempo "Set / Hold / Rest" | plank |
| Small range: zoomed camera | 4 shrugs, wrist_curl, cable_external_rotation, flutter_kicks | existing `camera.maxScale`; the lint's minimum Trace length (3.4) must be met | barbell_shrug (SHRG pilot) |
| View conflict | dumbbell_fly, bent_over_dumbbell_rear_delt_fly, decline_bench_press, weighted_dip, walking_lunge | pick the view that shows the fault; the other plane goes to a posture close-up | dumbbell_fly |
| Airborne or ballistic: take-off and landing frames | jumping_jacks, box_jump, jump_squat, kettlebell_swing, medicine_ball_slam, wall_ball | two ground-contact frames; Trace on the hip or the implement | box_jump |
| Fault needs roll or yaw | one_arm_dumbbell_row, renegade_row, pallof_press, bird_dog, single_leg_romanian_deadlift (single_arm_lat_pulldown is fixed by E-1) | the plate's Mistake uses the next most common drawable fault; the rotation fault is a handling-mistake row in the layers | one_arm_dumbbell_row |
| Cycle or travel: one cycle, two phases | mountain_climbers, high_knees, jump_rope, battle_ropes, bear_crawl, sled_push, sled_pull, farmer_s_carry, burpee | start/end = the two phases of one stride or cycle; Trace on the driving point; tempo = rhythm. Burpee: the drop to plank and back (its riskiest phase); the other phases are setup steps | mountain_climbers |

side_plank is drawn after E-1 (roll). russian_twist and bicycle_crunch depend on E-2.

### 1.4 Order

Anchored families first (cheapest, proven by byte reproduction), then the families the owner trains most, riskiest
content early so safety findings surface early, conditioning last because it carries the most concept decisions:
F01 SCAB, F02 HANG, F03 BNCH, F04 SQAT, F05 HNGE, F06 HROW, F07 OHPR, F08 SLEV, F09 SLED, F10 CURL, F11 TRIC, F12 RAIS,
F13 SCBL, F14 SPLT, F15 SFRT, F16 SHRG, F17 PLNK, F18 DIPS, F19 BRDG, F20 FLOR, F21 COND. This replaces the queued
HT-12 presses batch (its 26 push ids are spread over F03, F07, F08, F11, F17, F18, F21).

---

## 2. Engine work first

Principle: **touch the byte-locked engine as little as possible.** New equipment is composed in new, additive kit
modules that no approved spec imports, so it cannot move an approved plate. Locked files (`body.mjs`,
`equipment.mjs`, golden B `hand.mjs`) change only where composition cannot express the drawing, each in a
`[golden update]` PR that proves every approved plate and hand pair byte-identical (L1, L2, L2-B, 0 px).

### 2.1 Work items and what each unlocks

| Id | Work | Where | Unlocks (new ids) |
|---|---|---|---|
| E-1 | `root.roll` and `trunk.lean` (optional, default 0; rotZ in `fk`, so the default multiplies by an exact identity) | `body.mjs` (locked) | side_plank (plate, front view) and the sideways-lean fault of single_arm_lat_pulldown: **2**; also a lean Mistake option for one-sided loads |
| E-2 | Trunk yaw, **front view only** (rotate the thorax template; side view stays unsupported). Time-boxed spike | `body.mjs` (locked) | russian_twist, bicycle_crunch: **2**. Pass bar: plate lint green and the critic plus owner accept a 2-plate sheet; else 1.2 list |
| E-3a | One generic closed-polygon primitive `poly` (any angle, `eq`/`eq-solid`). Today `box` is axis-aligned and `line` is an open polyline (`equipment.mjs:301-302`), so angled pads and edge-on plates need it | `equipment.mjs` (locked, additive entry) | used by the kit items below that need angled solids |
| E-3b | Kit, new drawings (census R4): Smith 5, rope attachment 5, landmine/T-bar 2, sled 2, dip bars, Roman chair, hack sled, pendulum arm, kettlebell, battle rope, jump rope 1 each | `tools/plates/library/kit/equipment/*.mjs` | **20** ids |
| E-3c | Kit, compositions of existing parts (census R3): adjustable bench (incline/upright) 7, decline bench 1, leg curl machine 3, pec deck 2, ankle cuff 2, hip abd/add machine 2, calf machine 2, medicine ball 2, wall 2, band 2, and 1 each: lateral raise machine, assist machine, chest-supported row, pullover machine, preacher pad, leg extension, crunch machine, ab wheel, optional med ball | same | **30** ids |
| E-3d | New parameters of existing primitives, no code: single handle 11, straight bar 5, EZ bar 4 (end-on in side view = the barbell drawing), horizontal leg press 1 (`legPress45` with `rail.angle: 0`, probe-checked) | template params | 21 ids (overlap with the above) |
| E-4 | Hand renderer modes: `palm-flat` 10, rope grip 6 (5 rope + battle ropes), cupped 2 (goblet squat, DB overhead extension), ball 2 (slam, wall ball), band 2, handle profiles for kettlebell and jump rope 2, the front-rack exemption 1. `curl` (13) needs no new mode: it is today's closing hand on round handles with new poses | golden B `hand.mjs` (locked) | **about 25** hand close-ups (26 if resisted_hip_flexion uses the band); 131 need a hand close-up in all |
| E-5 | Rigs (template code, no engine edit): placement and contact checks for the pose classes the approved 8 never proved: hinge 17, supine 15, plank 9, split 9, single-leg 6, airborne 5, incline 4, support 4, kneel 3, bridge 2, floor-sit 2, prone 2, quadruped 2, decline 1, wall 1 (census 4.2, over 153). Lying poses place a back landmark with `landmarksOf` + `checks {plane}`, not `rootOnSeat` (census probe A) | `tools/plates/library/kit/rigs/*.mjs` | each rig is proven by the pilot that first uses it |

Totals over the 145: 92 need no new drawing (R1 41 + R2 51), 30 need a composition, 20 a new drawing, 3 an engine
capability. The first approved use of the `dumbbell` primitive (28 ids depend on it) is the CURL pilot; if it is not at
quality, the kit carries a better dumbbell, and the locked primitive (used only by the `_test_*` reference fixtures)
stays as it is. Front-view pivot arms (5 SFRT ids) are unverified; the pec_fly pilot proves or kills them first.
Auto-label improvements are opt-in options only: changing the default placer would move the approved plates'
auto-placed labels (36 % of their labels) and fail L1.

### 2.2 Proof for every engine change

- L1 over every approved page (the golden A page and each family page) and L2 on every shipped fragment: byte-identical.
- The mutation table in the PR: turning the new option on for one approved spec must fail L1 (proves L1 sees it).
- Reference fixtures for the new paths (`ref-fixtures/`, hash-pinned, add-only), like HT-1's `_test_front/_test_side`.

---

## 3. Plate production

### 3.1 Where the new sources live

```
tools/plates/library/                       new; hash-locked per family once approved (guard: [golden update])
  MANIFEST.json                             {path: {sha256, family, approvedPage}}
  kit/rigs/<rig>.mjs                        body support, camera, contact checks, default ghosts and trace point
  kit/equipment/<item>.mjs                  compositions of engine primitives (+ poly)
  kit/mistake.mjs                           guide builders from landmarks (arc at a joint, arrow along a segment)
  families/<FAM>.mjs                        export default (params) => spec; export const PARAMS (schema) and HOOKS
  families/<FAM>.layers.mjs                 the family's layer template (4.2)
  exercises/<id>.plate.mjs                  export default FAM({ ~20-40 lines of params })
  exercises/<id>.howto.mjs                  the sheet's copy, claims and overrides (4.2)
  family-page.mjs                           builds a family's A page and B page from a list of ids
docs/research/howto/<id>.json, sources.json, reviews.json     (content.md 3.2)
tests/howto/golden/families/<FAM>.json      the family's golden shard (3.5)
```

The approved 8 keep their own spec files in `tools/plates/vendor/` and ship from them; templates never replace them.
`family-page.mjs` is derived from the vendored `build-page.mjs`, whose exercise list is hard-coded (`GROUPS`,
`build-page.mjs:130-134`); it must rebuild `e2bea90c…` byte for byte when given the 8 (LIB-1 proof).

A param file (illustrative shape, not tuned values):
```js
import bench from '../families/BNCH.mjs';
export default bench({
  id: 'lib_incline_dumbbell_press', load: 'dumbbells', bench: { angle: 30 },
  start: { elbow: 10, shoulder: { flex: 80 } }, end: { elbow: 95 },
  callouts: [{ key: 'blades', text: 'Blades<br>set', anchor: 'backUpper', cue: '…' }, …],   // from the card's top checkpoints
  mistake: { key: 'flare', pose: { shoulder: { abd: 80 } }, tells: […] },                    // the card's most common fault
  tempo: [['Lower', 2], ['Press', 1], ['Rest', 0.5]],                                       // with its claim
  cite: { 'end.elbow': 'claim:idp-depth', 'bench.angle': 'claim:idp-angle' },               // angle -> research claim
});
```

### 3.2 A template is proven before it draws anything new

- **Anchored families (SCAB, HANG, SLEV, SLED, SQAT): byte reproduction.** A vitest test renders
  `FAM(params(anchor))` and requires all 9 fragments (`normalSvg … mistakeAlt`) `===` the anchor's `GOLDEN.json`
  fragments. The anchor's param file must validate against `PARAMS`: no raw-spec escape hatch, so the proof cannot be
  a copy of the old spec. Bespoke approved code (the pull-up's `hangOutline`, the row's 1 mm twin handle) becomes a
  named `HOOK` of the family. Label `box` positions are params (hand boxes are part of the approved method: 29 of 45).
  If a template cannot reproduce its anchor after two tries with no new evidence, the family is treated as a pilot
  family (next point); the approved plate is never touched.
- **Pilot families (15 + COND): the owner approves one pilot plate first**, built at first-8 quality from the
  template, on one pilot sheet together with the six concept examples of 1.3. The approved pilot is the family's anchor.
  RAIS is a pilot family: the approved lateral raise is hand-drawn (`ref-src`), so no template can reproduce it; the
  cable_lateral_raise pilot is shown next to it for the owner to judge.

### 3.3 Per-exercise flow

1. The verified research card (4.4) supplies the plate facts: top checkpoints (callouts), the most common fault
   (Mistake and tells), tempo, and each cited angle range.
2. The builder writes `<id>.plate.mjs` (20-40 lines) and runs `family-page.mjs`; the plate lint (3.4) must be green.
3. The builder checks the render in 2 themes itself, then posts a design check-in on the draft PR after the first two
   plates of the family (AGENTS "plan hard cards"); the supervisor re-guides early if the look drifts.
4. The plate critic (3.4) runs once per family, then the owner's family sheet (3.4), then the golden entries (3.5).

### 3.4 How "not worse than the approved 8" is proven

**Automated, in the generator (it refuses to emit a failing plate, as the copy lint throws today), LIB-2:**

| Check | Rule | Why |
|---|---|---|
| Engine report | `report.ok` in every render (label edge and overlap, figure and joint hits, IK contact ≤ 0.5 cm, `checks`, measure ≤ 2°), plus the browser-measured issues. Today it is only a `console.warn` (`build-page.mjs`) | pipeline 12: a new plate with a 1 cm contact miss would pass L0-L4 |
| Angle claims | every angle in `cite` resolves (engine `angles` report) inside the card's claimed range ± 2°; uncited tuned angles are listed in the PR | the approved method: every pose angle backed by a source |
| Quality envelope | exported constants measured on the approved 7 engine plates (+ LR where measurable), like `copy-lint.mjs`: camera scale and figure size range, callout count 3 and tells 1-3, max leader length, min label-to-figure clearance, min Trace length in px, min visible Mistake outline, max element count (S0 ≤ 700), chunk ≤ 150 KB raw / 36 KB gz, no `var(`/colour in the SVG, C10 44 px hit boxes with no exemption (the LR's O10 exemption is not inherited) | each metric is "within the approved range or better"; nothing is set by hand |
| New-plate copy lint | content.md 4: GA 6.2 bans, callout 1-3 words, cue ≤ 15 words, no semicolons, alt ≤ 51 words | the golden-A plate strings are exempt by name; new plates are new copy |

Each rule gets a mutation in the LIB-2 PR (for example: a hand 1 cm off the handle, a label moved onto the thigh, a
Trace shortened below the minimum) that must turn it red.

**Plate critic (fresh claude-opus-5-5, once per family):** sees the family page, the anchor at the same scale, and the
cards; never the builder's reasoning. Rubric: joints and contacts anatomically right in both poses; equipment at real
size; the Mistake shows the fault its tells name, readable in 2 s; callouts point at the right body part; labels where
a designer would put them; Trace visible and meaningful; same look as the anchor. **Planted-defect test:** the
supervisor plants two defects in a copy of one plate that automation cannot catch (for example a callout on the wrong
body part, a bar path behind mid-foot); a miss rejects the critic's findings and a fresh critic reruns. Two rounds
without new evidence go to the supervisor.

**Owner family sheet:** a private Artifact built from the exact PR head: the family anchor first, then every new plate
(normal and Mistake, Silent Black and Paper), tier-A first, then each sheet's layers at 390 px, and a box listing any
concept decision or new warning wording. He approves the family or names ids to change; only those are redone and
re-shown. Rejected ids stay out of `HOWTO_IDS`; the rest may merge.

### 3.5 How an approved plate becomes a golden

- **Per-family golden shards** `tests/howto/golden/families/<FAM>.json`, each its own hash chain (the existing
  `GOLDEN.json` stays as the 8's frozen chain). Entries: `page-a` and `page-b` `{pageSha256, bytes, builtFrom,
  approvedBy: 'owner', date, decision}`, then one `plate` and one `layers` entry per id with fragment hashes. Two
  families in flight never edit the same file, which a single chained file would force (pipeline 10: it conflicts at
  the tail). Tests: every shard chain intact; every id in `HOWTO_IDS` has exactly one latest plate and layer entry
  across all shards; every `supersedes` names a decision; no id in two shards.
- **Pages are hash-pinned, not committed.** CI rebuilds each family page from the locked sources and requires its
  sha256 to equal the approved one (L1); fragments are then cut from that rebuilt page (L2). Same proof strength as the
  committed golden A page, without the est. 16.5 MB (A pages) + 45.6 MB (B pages) + 40.5 MB (reference fixtures) of
  fixtures that full coverage would add (pipeline 10). The 8's committed fixtures stay as they are.
- **Golden updates** (plan 2.8, unchanged in spirit): a deliberate change to an approved plate is a new entry with
  `supersedes` and a decision id, a before/after sheet for the owner, and `[golden update]` in every non-merge commit
  that touches `tools/plates/library/**` or `tests/howto/golden/**` (the supervisor extends the guard's path list,
  add-only). An unintended change fails L1 on that family's page on the next CI run.

---

## 4. Layer production

### 4.1 One data-driven close-up renderer (LIB-3, golden-B update with no byte change)

Today each exercise has its own 29-44 KB close-up script in two diverged copies (pipeline 3). LIB-3 replaces them with
one renderer driven by the `*.howto.mjs` data, with the bespoke parts as named marker plugins (`hookThumb`,
`fingerBaseMarks`, `bladeOutlines`, the thumb page). **Proof:** it rebuilds golden B `5aab1aca…` byte for byte, and
the 80-region fidelity check stays at 0 px. Fallback if an old script has a quirk it cannot reproduce: that one of the
8 keeps its frozen legacy script (output unchanged); the new renderer must still reproduce at least the five
`howto/render-*.mjs` exercises exactly before any library family uses it. HT-11's crop reuse (a viewBox on the plate
SVG instead of a re-render) lands with or before it.

### 4.2 Shared once per family vs written per exercise

| Shared (family layer template or archetype module, verified once) | Per exercise (`<id>.howto.mjs`, from its own card) |
|---|---|
| Hand-pair keys for the family's archetypes and handles (pairs are shared by key) | Handling overrides: orientation, width, handle choice, thumb options, `loadAxis` |
| Posture crop windows **by landmark** (for example "blades: box around shoulder.r and backUpper, pad 0.12"), cut from each member's own approved plate: no per-exercise script | Which 2 crops, their captions and Right/Wrong alt text |
| Contact-archetype checkpoints and equipment-move setup steps (unrack/rerack, kick-up, seat, pin, foot bar) | 5 setup steps (machine settings differ), 6-7 posture checkpoints |
| Shared risk lines (bar over the face, breath-holding, jump landing) and red-flag boxes per joint (+ the new back box) | Feel spec (always re-researched, never inherited), 3 handling mistakes, ≤ 3 risks, `riskFlags` |
| Chip order and section structure (unchanged golden B design) | Evidence labels (a paper's tag is per use), sources |

Content facts (measured, content.md 2): only 35 of 674 strings are shared across the 8, so templates cut drawing and
research work, not writing. Families of near-copies use **difference cards** (51 children inherit line by line with a
reason; 94 full cards).

### 4.3 Feel map gaps

Six ids have no paintable primary muscle (plank, mountain_climbers, medicine_ball_slam, bear_crawl, bird_dog: `core`;
cable_external_rotation: `rotator_cuff`). Rule: the card names drawn regions with a `libraryDiff` reason where true
(abs, obliques). Where no drawn region is honest (cable_external_rotation), the sheet uses a **text-only feel state**,
which is a golden-B design addition shown to the owner on that family's sheet (F12). No new body-map region: the app's
`bodyMuscles.ts` is shared with other features.

### 4.4 Research cards and verification

As designed in content.md 3 (not repeated here): card v2 in `docs/research/howto/`, quote-backed atomic claims, a
Sonnet source fetcher, a fresh Opus critic, an Opus safety checker for the 47 tier-A ids, the supervisor's 10 %
re-fetch and planted-mistake test per family, and C15 stamps in `reviews.json` tied to the content hash (strict now:
no paid review). Research runs **one family ahead** of the plates, because the card is the plate's input. Wave 1
also does the 19 group cards (palm-flat, curl, implements, rope rule, cupped thumb, front rack, prone checkpoints,
equipment moves, back box) and the likely-thin ids, so evidence blockers show up in week 1.

### 4.5 Short copy from the start

Every sheet is written under golden B's exported limits (450 visible words, 15-word sentences, setup 5 × 12 words,
3 mistakes, 4 feel rows, ≤ 3 risks and ≤ 3 red-flag boxes), with the owner's line matched exactly. The card holds
facts only, so nothing long is written and cut later. The lint runs in the family-page build (throws) and again as C7
on the generated app content. Add-only extensions from content.md 4 (medical-claim bans, the variant line for the 23
multi-equipment ids, family consistency, `RED_FLAG_ROWS` pinned at stamp time). "Concept first" is judged by the PR
reviewer against golden B.

---

## 5. App and CI at scale

### 5.1 Size

| Item | Today | At 153 | Plan |
|---|---|---|---|
| Plate chunks | 178 KB gz (8) | 3.4 MB gz; est. 2.2 MB after HT-11 (-35 %) | HT-11 merges before the plate count passes 40 (before F05). Per-chunk budget stays 150 KB / 36 KB, enforced by the plate lint |
| Layer chunks | not built | est. 2-5 MB gz (15-30 KB gz per exercise, hand pairs shared by key, crops reusing the plate SVG) | measured on F01; per-chunk budgets of plan 2.9 unchanged |
| APK | 4.37 MB | est. 9-12 MB | re-projected after every family; the supervisor reports it with each APK |
| Total How-to budget | ≤ 1.6 MB raw / 420 KB gz "re-set per batch" | | one decision now: total = sum of per-exercise measured + 10 %; per-chunk ceilings never raised |
| Repo | | committed generated files est. 10 MB plates + 10-25 MB layers | pages hash-pinned, not committed (saves about 100 MB, 3.5); per-file `inputsSha256` so a family rewrites only its own files |

### 5.2 `ids.ts` and the main bundle

153 ids in today's format are 4,432 B against the 2,048 B limit (breaks at about 60 ids). LIB-5 keeps the limit and
changes the encoding: `ids.ts` holds a 32-bit FNV-1a hash per shipped id (base36, about 8 B each: about 1.7 KB at 153
incl. the function) and `hasHowTo(id)` checks the set. An exhaustive unit test runs every `exercises.json` id and fails
on any false positive or negative; custom ids never reach it (`!ex.custom`, and they start with `custom_`). The id
union type moves to a type-only generated file (no bytes in the bundle). Push hints: one hint text per archetype plus
membership by hash, and `howToHint(id)` replaces the direct `HOWTO_HINTS[ex.id]` lookup in `Train.tsx` (a one-line
wiring change, called out; the rope pushdown gets no heel-of-palm hint, GA 3.1.1). The main footprint test
(`ids.ts` + `lazy.tsx` ≤ 3,072 B) is unchanged. The lazy `LOADERS` index grows about 60 B per id (+8.7 KB raw in the
`HowToSheet` chunk at 153): its budget becomes `measured base + 60 B × ids`, decided once. No new dependency: the hash is a few lines in the generator and in `ids.ts`.

### 5.3 Generator

- LIB-1 turns the 8 hard-coded places into data (pipeline 10): `LIB_OF`, `PINS` (one page to a list of pages), the
  vendor source regex `bc0f378|1a1e33b` (to "an approved page in a golden entry"), `shoot2` ids and the fidelity
  script's fixed ref. Proof: regenerate the 8 with zero byte change.
- One plugin reads `tools/plates/library/` and writes `ht-<slug>*.ts` per id; each file's `inputsSha256` covers only
  its own inputs (the plan's intent; today one shared value re-headers every file). `index.ts`, `ids.ts` and
  `coverage.ts` are regenerated on every merge of `main`, never hand-merged.

### 5.4 Gate time and sharding, with every shipped plate still proven

- **Load:** 27.2 s per plate per job (measured, HT-3) + est. 26 s per exercise for layer states = about 53 s per
  exercise: **about 136 min** at 153 against a 40-min job timeout.
- **When it breaks:** today's job is 16.2 min; with M1's layers for the 8 est. about 20 min; each full exercise adds
  about 53 s; with a 10 % margin that is about 26 exercises. So sharding (LIB-6) must merge before F03.
- **LIB-6:** a new `howto-proof` matrix job (supervisor wires it in `.github`, add-only) runs the How-to pixel checks
  (L2b, F3, L3, L4 and the layer states) plus each family's L1 page rebuild, in N shards. `tools/plates/shards.json`
  (generated) packs ids by measured seconds; N = ceil(total / 15 min): about 10 shards at 153, **each about 15 min +
  about 5 min setup**, so a CI run stays about 20-25 min of wall time.
- **Nothing is skipped:** every shard writes a proof manifest (id, state, theme, check, result); a final
  `howto-proof-all` job computes the full expected matrix from `HOWTO_IDS` × states × themes and fails on any missing
  or duplicate row. A unit test proves every shipped id is in exactly one shard. Each shard also runs the
  golden-vs-golden self-check (0 px). The golden and the app are rendered live in the same browser in the same shard,
  so no stored screenshots can drift across machines.
- **Once, not twice:** today both gate jobs run the HT-3 block. At 153 each state runs once per CI run, as plan R14
  already allowed ("shard the matrix across the two existing gate jobs; states are never dropped"). A new unit test
  proves no How-to source or generated file reads the date, time zone or `Intl`, which is why the TZ job adds nothing
  for these checks. This is decision D-LIB-3 (supervisor).
- **One sanctioned edit:** if the merged HT-3/HT-6..9 gate blocks iterate `HOWTO_IDS` (to verify on M1's code), they
  must take their id list from the shard function (default = all ids, so unsharded behaviour is unchanged). That edits
  other tasks' gate blocks, so it is a named supervisor decision like D-HT1, with mutation proofs that a dropped id
  turns `howto-proof-all` red.
- **Cost:** about 13 jobs per CI run. GitHub-hosted runners are free for public repos (GitHub's documented rule; the
  account's plan and its concurrent-job limit, 20 on Free, are not verified here). Parallel lanes pushing at once may
  queue. No spending.

### 5.5 Offline

Everything stays static and bundled; no network code (C17). In the APK all assets are local and the service worker is
not registered (`main.tsx:74`, `!isNative()`). The web build precaches every asset (`scripts/sw-version.mjs`), so the
PWA's first install grows by est. 5-8 MB gz: noted, not changed (offline is a product rule). The gate's offline probe
opens one sheet per family offline, and a unit test checks every `ht-*`/`hand-*` chunk is in the precache list.

---

## 6. Delivery

### 6.1 PRs (about 33, plus 0-5 redo PRs)

**Phase 0, before start (supervisor; part of "when all tasks are done"):** M1 merged (HT-1..HT-10) with L3 green on
CI; HT-4 re-pinned to `b3a90af`; golden B's 35 null source fields filled; the HT-5 disclaimer text fixed to the owner's
line; decisions D-LIB-1..6 logged (6.4).

**Phase 1, foundations (11 PRs, run in parallel, merge in this order):**

| Card | Outcome | Model | Size | Golden update |
|---|---|---|---|---|
| LIB-1 | Golden core at scale: family shards, hash-pinned pages, `family-page.mjs`, `tools/plates/library/` + MANIFEST, per-file inputs; the 8 regenerate byte-identical | Opus | L, design note | yes (no byte change) |
| LIB-2 | Plate quality gate: `report.ok`, angle claims, envelope constants from the 8, new-plate copy lint, mutations | Opus | M | no |
| LIB-4 | Content v2: card schema, source registry, strict C15 stamps, lint extensions, coverage release check, back-pain box (wording is a supervisor decision the owner sees on F05's sheet) | Sonnet | M | golden B shared module: yes |
| LIB-3 | Data-driven layer renderer + family layer API; golden B rebuilt byte-identical | Opus | L, design note | yes (no byte change) |
| LIB-5 | `ids.ts` hash set, hints per archetype, LOADERS budget formula | Sonnet | S | no |
| LIB-E1 | Roll and lean | Opus | M | yes |
| LIB-E3 | `poly` + equipment kit, each item on an equipment sheet the critic checks (may split into E3a/E3b) | Opus | L | `poly`: yes |
| HT-11 | Delta encoding + crop reuse (queued card) | Opus | M | yes (L2 on decoded strings) |
| LIB-6 | Sharded How-to proof + aggregator | Opus | M | no |
| LIB-E4 | Hand modes (palm-flat, rope, cupped, ball, band, handle profiles) | Opus | L, design note | yes (the 8's pairs unchanged) |
| LIB-E2 | Yaw spike, time-boxed at 8 builder-hours; merges only if it passes | Opus | S | yes |

**Phase 2, templates and pilots (no separate PRs; they ride in the family PRs):** 5 anchor reproductions and 15
pilots, plus the 6 concept examples and the 8 COND concept plates. Pilots whose rig needs no new equipment start as
soon as LIB-2 has a pushed commit (14 of 15; pec_fly waits for the kit). One owner pilot sheet (possibly two halves).

**Phase 3, 21 family PRs** (`claude/lib-<fam>`), in the 1.4 order. Each holds: family template and layer template,
param and `howto.mjs` files, research cards, generated files, the golden shard, coverage rows set to `done`. The
supervisor adds the `reviews.json` stamps after checking the reports.

**Phase 4, release candidate (1 PR):** coverage check strict, full regression and full QA on the final head, the
owner's device list (O9: font scale first). Only the owner publishes.

### 6.2 Who does what, per step (claude-opus-5-5 for judgement, claude-sonnet-5 for mechanical)

| Step | Agent | Model |
|---|---|---|
| Family research card writer (parent + difference cards) | research lane, up to 4 | Opus |
| Source fetcher (E-utilities, quotes, `access`/`checked`) | 1 per family | Sonnet |
| Research critic; safety checker (tier A) | fresh, 1 each per family | Opus |
| Template, pilot, param files, sheets' copy (`howto.mjs`) | family builder, 1 per family branch | Opus |
| Plate critic | fresh, 1 per family | Opus |
| Generation, contact-sheet assembly, PR evidence table, merge-`main` + regenerate | family builder's mechanical steps, or a helper | Sonnet |
| PR review (diff against card, write scope, reader's view of the sheets) | fresh, 1 per PR; does not re-judge plate looks the owner approved | Opus |
| Stamps, 10 % re-fetch, planted tests, small fixes, merges, APK to owner | supervisor | itself |

Nobody repeats another's check: the plate critic judges pictures, the research critic judges claims, the safety
checker runs only its tier-A list, the PR reviewer judges the diff and the reader's view.

### 6.3 Lanes and merge order

- **Up to 4 builder lanes** (the HT plan's cap) plus the research lane (up to 4 writers, 1 fetcher, 1 critic, 1 safety
  checker per family). Builds run ahead; merges follow the checklist.
- **Checklist:** LIB-1, LIB-2, LIB-4, LIB-3, LIB-5, LIB-E1, LIB-E3, HT-11, LIB-6, LIB-E4, LIB-E2, then F01 to F21,
  then LIB-RC. Hard gates inside it: LIB-6 before F03 (gate time), HT-11 before F05 (40 plates), LIB-E4 before the
  first family that uses a new hand mode (F01's resistance_band_row needs `band`).
- **Stalled family rule (asked of the owner once, O-LIB-1):** a family waiting on its own sheet moves to the end of
  the checklist, so it does not block the families behind it. Merge order otherwise never changes.
- **Merge pace:** each merge needs a fresh CI run on a head containing the latest `main`: about 33 × 25-40 min = 14-22
  hours of serial merge time, spread over the program.

### 6.4 Approvals

**Owner (about 11 touchpoints):**
1. O-LIB-1: the family order and the stalled-family rule (once, at the start).
2. The pilot and concept sheet: 15 pilots + 6 concept examples (1.3; barbell_shrug is both), 20 plates; may come in two halves.
3. Family sheets in about 7 rounds: (F01-F02), (F03-F05), (F06-F09), (F10-F13), (F14-F17), (F18-F21) plus redo ids.
   The back-pain box wording rides on F05's sheet; the text-only feel state on F12's.
4. Five-second hand tests on his phone for each new hand-pair key used by a tier-A sheet (GA 6.3), on the APK of the
   family that brings it.
5. Only if needed: the named left-out list, before the Play Store build.
6. The release-candidate device check. Then he publishes.

**Supervisor decisions (decide and log):** D-LIB-1 hash-pinned pages and per-family shards; D-LIB-2 the plate
envelope rule (within the approved range or better); D-LIB-3 sharding with the aggregator and once-per-run states, and
the gate-block id-list edit; D-LIB-4 `ids.ts` hash encoding and hints per archetype; D-LIB-5 total-asset and LOADERS
budget formulas; D-LIB-6 the negative control: F03 adds bench press content, so the bench-press "no button" control is
switched in that PR (R17) and the seeded custom exercise becomes the lasting control; plus the content decisions of
content.md 10.

### 6.5 Time estimate

**Assumptions:** the supervisor runs every day; 4 builder lanes and the research lane are each busy about 12-16 hours
a day; measured pace: an HT card takes hours, a merge's CI about 20 min (25 min with shards); the first 8 plates took
about a day of design **while the engine was being built**; the owner answers a sheet within 24 h; about 20 % of plates
need a redo round.

| Work | Count | Hours each (est.) | Agent-hours |
|---|---|---|---|
| Foundation PRs | 11 | 2-18 | 76-116 |
| Anchor reproductions | 5 families | 4-6 | 20-30 |
| Pilot template + first plate at first-8 quality | 15 | 4-6 | 60-90 |
| Other plates (COND concept plates included) | 130 | 1-2 | 130-260 |
| Plate critic rounds | 21 | 1.5-2 | 32-42 |
| Family layer templates | 21 | 2-3 | 42-63 |
| Sheets (`howto.mjs` under the lint, crops chosen) | 145 | 0.75-1 | 109-145 |
| Family PR assembly (Sonnet) + fresh review (Opus) | 21 + 11 reviews | 1-3 | 64-85 |
| **Build lanes subtotal** | | | **533-831** |
| Research: 94 full cards, 51 difference cards, 19 group cards, verification per family | | 1-1.5 / 0.3-0.5 / 0.5 / 3-4 | 182-261 |
| **Total** | | | **about 715-1,090** |

**Calendar:** build lanes are the critical path: 533-831 h over 4 lanes at 12-16 h a day = **9-17 working days**. Add
foundations sequencing (the first family cannot merge before about day 6-8), owner rounds and redo rounds: **about 4
weeks expected, 3 weeks at best, 6 weeks at worst.** Research (182-261 h on its own lane) runs ahead and is not on the
critical path if wave 1 starts with the foundations. Six build lanes would cut the build time by about a third, but
not the owner rounds or the serial merges, and would raise merge conflicts on the generated index; the supervisor may
go to 6 once F01 and F02 have shown the pipeline works.

What is not estimated: how often a template needs a second pilot, and the yaw spike's outcome. After F02 the
supervisor re-projects the whole schedule from measured per-plate and per-sheet hours and tells the owner if the
estimate moved by more than a week.

---

## 7. Risks, mitigations, and what goes live when

### 7.1 Risks

| # | Risk | Mitigation |
|---|---|---|
| L1 | Template plates look "generated" and fall below the approved look | anchor byte reproduction or an owner-approved pilot per family; plate lint envelope measured on the 8; family critic side by side with the anchor, calibrated by planted defects; owner sheet per family; label boxes stay a param |
| L2 | An engine or kit change moves an approved plate | kit is additive (no approved spec imports it); locked edits default to exact identity; L1 rebuilds every approved page on every run; `[golden update]` guard over the new paths |
| L3 | The template reproduction proof is vacuous (a raw copy of the old spec) | anchor param files must validate against `PARAMS`, no escape hatch; the reviewer reads the anchor param file against the template |
| L4 | CI time passes the 40-min timeout | LIB-6 before F03; N from measured seconds; per-shard time tripwire at 25 min; harness speed-ups allowed only if the same comparisons run |
| L5 | Sharding silently drops an id or state | aggregator computes the full expected matrix; unit test for one-shard-per-id; mutation proof |
| L6 | Pixel-exact L3 flakes at 1,500+ comparisons | the program starts only after M1's L3 is stable; golden and app rendered live in the same browser; captures wait for animations; a flake is root-caused once, never retried silently or loosened |
| L7 | APK and repo grow too much | HT-11 before F05; pages hash-pinned; per-file inputs; size re-projected after every family |
| L8 | `ids.ts` or main bundle over budget | hash encoding with an exhaustive test; the footprint test unchanged |
| L9 | Golden chain conflicts between parallel families | one shard file per family; generated files never hand-merged |
| L10 | Research errors at volume (about 2 real errors per first draft today) | content.md 3: quotes, fetcher, fresh critic, safety checker, 10 % re-fetch, planted mistakes, C15 stamps on the content hash |
| L11 | Thin evidence | likely-thin ids researched in wave 1; `blocked:evidence`; owner's named list, never a thin sheet |
| L12 | Tier-3 and yaw ids cannot reach the bar | concepts decided on the pilot sheet; E-2 time-boxed with a pass bar; failure goes to the owner's list with the reason |
| L13 | The owner's review load becomes the bottleneck | pilots and critic clear problems before he looks; about 7 rounds, not 21 sessions; only changed ids are re-shown; stalled-family rule |
| L14 | A parent-card error spreads to its children | child inherits line by line with a reason; the parent's hash chains into its children's stamps |
| L15 | Rotation faults (5 ids) cannot be drawn | the plate uses the next drawable fault; the rotation fault is a handling-mistake row |
| L16 | The dumbbell primitive (28 ids) is not at quality | the CURL pilot is the checkpoint; a kit dumbbell if needed; the locked one stays |
| L17 | Other lanes add exercises during the program | C6 coverage: a new id needs a `queued` row; it joins the family that fits or a final batch |
| L18 | Token cost | Sonnet for fetching and mechanical steps; templates shrink per-exercise authoring to 20-40 lines; one critic per family, not per plate; no duplicate reviewers |
| L19 | Web PWA first install grows by est. 5-8 MB gz | noted in 5.5; the APK is unaffected; a change would be a supervisor decision |

### 7.2 What goes live when

- **Each family merge:** the supervisor sends the owner the APK from that commit's green CI run (fingerprint step
  checked). The "How to do it" button appears on that family's approved and merged ids only; every other id looks as
  it does today. Ids the owner has not approved stay out of `HOWTO_IDS` even if their files exist.
- **Expected sequence:** foundations in week 1; the pilot sheet around day 5-7; F01 (SCAB) on the owner's phone around
  day 6-8; then roughly one to two families a day on average; F21 around week 4 (range 3-6).
- **Nothing reaches other users** until the owner publishes. The release candidate is cut when every `coverage.ts` row
  is `done` or an owner-approved `left-out`; it gets its full regression again after its last change.

---

## Appendix: all 153 ids by family

Markers: **bold** = approved today; A = tier A (content.md); t2/t3 = plate tier; R3 = composed equipment; R4 = new
drawing; R5 = engine capability. Generated by `design/families.py`.

| Code | Family | Anchor | Ids | New | Members |
|---|---|---|---|---|---|
| HANG | Hang from a bar | approved: pull_up,hanging_leg_raise | 6 | 4 | **pull_up** (approved), **hanging_leg_raise** (approved), chin_up [A], hanging_knee_raise [A], assisted_pull_up [A,R3], inverted_row |
| SCAB | Seated cable pull | approved: lat_pulldown,seated_cable_row | 7 | 5 | **lat_pulldown** (approved), **seated_cable_row** (approved), close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown [t2], chest_supported_row [R3], resistance_band_row [R3] |
| SLEV | Lever machines, side view | approved: machine_chest_press | 10 | 9 | **machine_chest_press** (approved), incline_machine_press, shoulder_press [A], machine_pullover [R3], machine_crunch [R3], leg_extension [R3], seated_leg_curl [R3], seated_calf_raise [R3], lying_leg_curl [R3], standing_leg_curl [R3] |
| SLED | Leg press and sled machines | approved: leg_press | 5 | 4 | **leg_press** (approved), horizontal_leg_press, leg_press_calf_raise, hack_squat [R4], pendulum_squat [R4] |
| SQAT | Squat | approved: barbell_back_squat | 9 | 8 | **barbell_back_squat** (approved), front_squat [A], goblet_squat [A], smith_machine_squat [A,R4], bodyweight_squat, jump_squat [A,t2], box_jump [A,t2], wall_sit [t2,R3], wall_ball [A,t2,R3] |
| RAIS | Standing raise and fly, front view | pilot: cable_lateral_raise (LR is ref-src) | 9 | 8 | **dumbbell_lateral_raise** (approved), cable_lateral_raise, cable_rear_delt_fly, resistance_band_pull_apart [R3], upright_row, cable_external_rotation [t2], cable_fly, low_to_high_cable_fly, high_to_low_cable_fly |
| SCBL | Standing cable and free-weight, side view | pilot: cable_chest_press | 7 | 7 | dumbbell_front_raise, face_pull [R4], cable_chest_press, straight_arm_pulldown, pallof_press [t2], cable_kickback [R3], resisted_hip_flexion [R3] |
| SFRT | Seated machine, front view | pilot: pec_fly | 5 | 5 | pec_fly [R3], rear_delt_fly [R3], machine_lateral_raise [R3], hip_abduction [R3], hip_adduction [R3] |
| BNCH | Lying on a bench | pilot: barbell_bench_press | 11 | 11 | barbell_bench_press [A], dumbbell_bench_press [A], incline_dumbbell_press [A,R3], incline_barbell_bench_press [A,R3], decline_bench_press [A,t2,R3], close_grip_bench_press [A], smith_machine_bench_press [A,R4], smith_machine_incline_press [A,R4], skull_crusher [A], dumbbell_fly [A,t2], dumbbell_pullover [A] |
| OHPR | Overhead press, free weight and Smith | pilot: barbell_overhead_press | 4 | 4 | barbell_overhead_press [A], dumbbell_shoulder_press [A,R3], arnold_press [A,R3], smith_machine_shoulder_press [A,R4] |
| HNGE | Hip hinge | pilot: romanian_deadlift | 7 | 7 | romanian_deadlift [A], dumbbell_romanian_deadlift [A], single_leg_romanian_deadlift [A], conventional_deadlift [A], sumo_deadlift [A], kettlebell_swing [A,t2,R4], back_extension [A,R4] |
| HROW | Hinged row | pilot: barbell_row | 6 | 6 | barbell_row [A], pendlay_row [A], one_arm_dumbbell_row [t2], t_bar_row [A,R4], landmine_row [A,R4], bent_over_dumbbell_rear_delt_fly [t2] |
| SPLT | Lunge, split and single-leg squat | pilot: reverse_lunge | 8 | 8 | bulgarian_split_squat, walking_lunge [t2], reverse_lunge, forward_lunge, step_up, bodyweight_lunge, bodyweight_split_squat, pistol_squat [A] |
| CURL | Curl | pilot: dumbbell_biceps_curl | 13 | 13 | dumbbell_biceps_curl, alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, cross_body_hammer_curl, cable_curl, bayesian_cable_curl, reverse_curl, preacher_curl [R3], incline_dumbbell_curl [R3], concentration_curl, wrist_curl [t2] |
| TRIC | Triceps, standing | pilot: triceps_pushdown | 6 | 6 | triceps_pushdown, rope_triceps_pushdown [R4], straight_bar_triceps_pushdown, single_arm_triceps_pushdown, overhead_cable_triceps_extension [A,R4], dumbbell_overhead_triceps_extension [A] |
| SHRG | Small range, standing: shrug and calf raise | pilot: barbell_shrug | 6 | 6 | dumbbell_shrug [t2], barbell_shrug [A,t2], smith_machine_shrug [t2,R4], cable_shrug [t2], standing_calf_raise [R3], bodyweight_calf_raise |
| PLNK | Hands on the floor (plank, push-up, all fours) | pilot: push_up | 11 | 11 | push_up, incline_push_up, diamond_push_up, pike_push_up [A], renegade_row [A,t2], plank [t2], ab_wheel_rollout [A,R3], mountain_climbers [t3], bear_crawl [t3], bird_dog [t2], burpee [t3] |
| DIPS | Dips | pilot: bench_dip | 2 | 2 | weighted_dip [A,t2,R4], bench_dip |
| FLOR | Floor core, lying | pilot: crunch | 11 | 11 | crunch, reverse_crunch, v_up, flutter_kicks [t2], hollow_body_hold [t2], dead_bug, bicycle_crunch [t3,R5], superman, side_plank [t3,R5], russian_twist [t3,R5], cable_crunch [R4] |
| BRDG | Bridge and hip thrust | pilot: hip_thrust | 2 | 2 | hip_thrust [A], glute_bridge |
| COND | Conditioning | pilot: each id (concept sheet) | 8 | 8 | sled_push [t3,R4], sled_pull [t3,R4], farmer_s_carry [A,t3], jumping_jacks [t2], high_knees [t3], jump_rope [t3,R4], battle_ropes [t3,R4], medicine_ball_slam [A,t2,R3] |
