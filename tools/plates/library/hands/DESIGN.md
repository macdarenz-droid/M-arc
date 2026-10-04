# Hand pairs (LIB-7 design, shared with LIB-12)

Plan: `LIBRARY-HOWTO-ARCHITECTURE.md` 2.3, 2.6, 2.7, 3.1-3.6 and §7.
Research: `claude/libht-research` 95342b1, in `docs/research/howto/{shared,cards}`.
Census: `docs/howto/library/inputs/census.json`.
Rulings: the supervisor on #193, 2026-10-02 11:16.

## 1. Mechanism (owned by LIB-7; LIB-12 adds `hand-<key>.mjs` files only)

### Key module
Each key is one file, `hands/hand-<key>.mjs`. It exports:
- `KEY`, `OWNER` (`'LIB-7'` or `'LIB-12'`) and `VIEW` (`'radial'`, or a LIB-12 view name);
- `render?`, a function `(spec) -> { svg, report }`. It is left out for radial;
- `HANDLE`: `{ profile, diameterMm, extras? }`. `diameterMm` is always given, because golden-B `hand.mjs:115` would otherwise fall back to 32 mm;
- `VARIANTS`: `{ <variant>: { archetype, loadAxis, wristRange, contact, right, faults: { <fault>: { label, side, pose, markers, claims } }, claims } }`;
- `checks?(spec, pages)`: a non-radial key's own geometry checks. The radial checks G1-G9 run only for radial keys drawn by golden B's renderer, and a non-radial key's `wristRange` may be null;
- `INPUTS?`, `VIEW_FILES?`: extra files the drawing reads (for `inputsFor`). A variant may carry its own `handle`, which overrides `HANDLE`;
- `IDS`: `{ <card id, no lib_>: { variant, orientation, faults: [<fault>], claims } }`.
- `GAPS`: `{ <card id>: reason }`. These ids belong to this key's census scope but are not drawn.

### Loader (`hands/pairs.mjs`)
- It discovers modules by filename, so there is no shared registry to edit. It builds `HAND_OF_ID` and throws if an id is drawn twice, or is drawn by one key and listed as a gap by another.
- `pairSpec(id)` returns the record a pair needs: camera, loadAxis, right, the wrong pages, notes, alt and extras.
- `renderPair(id, opts)` calls `module.render ?? renderHandPair` (golden-B, unchanged), then applies the extras: the force-line strip (D-LIB7-7), bend-label placement (D-LIB7-6) and the thumb-side camera label (D-LIB7-4).
- `inputsFor(id)` lists everything that drawing depends on, for LIB-2's per-output `inputsSha256`: the static import closure of `pairs.mjs`, `zoom.mjs` and the id's key file (with `VIEW_FILES`), plus the key's declared `INPUTS` (the rope's sizes are matched to `eq/rope.mjs`). Other key files are never in it, so a change to another key never marks this id stale.

### Zoom wrapper (`hands/zoom.mjs`, new path)
- It builds the hand zoom page from `renderPair`, reusing LIB-6 helpers (`zoomTop`, `captions`, `pagerOf`, `feelLink`, `esc`).
- LIB-6's `closeup/hand.mjs` is not edited, so the 8 still go through it (A1).

### App chunk (D-LIB7-1)
- The chunk is `src/howto/generated/handpair-<key>.ts`. That name does not collide with HT-6's `hand-<chromeId>.ts`, and `tests/howto/hands.test.ts` is never edited.
- The generator belongs to LIB-2 (supervisor ruling), so LIB-7 does not build it.

### Id form
- Modules key ids by card id (`ez_bar_curl`); census uses `lib_` + card id. A3 checks the mapping both ways.

### Reuse of golden-B (D-LIB7-3)
- `renderHandPair` is called unchanged.
- `HAND_PROP` and `HAND_OF_H` feed the placement check G4.
- `HAND_CSS` styles the sheet and gate pages.
- No golden-B value is read for a diameter; each module passes its own.

## 2. Drawn pairs: 4 keys, 7 variants, 12 ids (the two push rows are parked, D-LIB7-19a)
Claim refs are `<file>#<cid>`, relative to `docs/research/howto/`.

**Sizes are drawing values (D-LIB7-2).** These follow golden-B `HANDLES` and main's `eq/rope.mjs`:
- dumbbell 32 mm with a 120 mm head ring;
- bar and EZ 28 mm;
- rope 28 mm with its 46 mm knob, pinned to `eq/rope.mjs:54`: a plain section, the knob dashed over the fist (D-LIB7-13);
- D-handle 30 mm.

**Wrong angles are approved precedents, flagged (D-LIB7-5).** Their sizes are not sourced:
- curled −30 (lat pulldown);
- bent back +35, with the handle moved to 1.05 on a push (chest press).

**Archetype defaults that a card delegates to** are marked GA and flagged on the sheet.

**Orientation and camera (D-LIB7-4).**
- The camera follows the rule in golden-B `engine/hand.mjs:8-9`: the radial view sees the handle end-on, so a vertical handle is "seen from above" and a horizontal bar "seen from the side".
- Orientation is carried per id from its claim:
  - underhand or overhand bar → `side`;
  - neutral (handle vertical) → `above`;
  - unstated orientation → the label "Seen from the thumb side", which states no orientation (the card for `single_arm_triceps_pushdown` asks for this). Only with a vertical forearm: a level forearm shows the palm up or down, so a level-forearm id with no orientation claim is a gap (D-LIB7-12, G8).
  - a neutral grip on a hand-held weight is "seen from above" without golden B's YOU/MACHINE row, which names a machine (D-LIB7-11, G8).
- **G8** checks the screen direction of the palm. Underhand puts the palm up. Overhand puts it down (`mirror`).

| key/variant | id: orientation (claim) | right | wrong faults |
|---|---|---|---|
| curl/dumbbell | dumbbell_biceps_curl: under (cards/dumbbell_biceps_curl.json#c1); alternating_dumbbell_curl: under (cards/alternating_dumbbell_curl.json#c2); incline_dumbbell_curl: under (cards/incline_dumbbell_curl.json#c11); hammer_curl: neutral (shared/curl.json#c2); cross_body_hammer_curl: neutral (cards/cross_body_hammer_curl.json#c1) | thumb wrapped (shared/curl.json#c1, #c2); wrist straight, ext 0 in −10..10 (shared/curl.json#c3, #c4); middle of palm 0.6 (GA; curl.json gap 1) | `curled` −30 and `bent-back` +30 (shared/curl.json#c3, #c4, #c5) |
| curl/bar | barbell_curl: under (cards/barbell_curl.json#c1); cable_curl: under (cards/cable_curl.json#c1) | same as curl/dumbbell | `bent-back` (cards/barbell_curl.json#c8, cards/cable_curl.json#c9); `curled` (shared/curl.json#c3) |
| ez/curl | ez_bar_curl: under (cards/ez_bar_curl.json#c1, #c2); preacher_curl: under (cards/preacher_curl.json#c1); reverse_curl: **over** (cards/reverse_curl.json#c1) | thumb wrapped (shared/curl.json#c1); wrist straight (cards/ez_bar_curl.json#c8, cards/preacher_curl.json#c8, cards/reverse_curl.json#c6) | `bent-back` (same claims); `curled` (shared/curl.json#c3) |
| ez/push (**parked**, D-LIB7-19a: a gap until golden-B follow-up 9) | skull_crusher: over, palms toward the feet (cards/skull_crusher.json#c1) | thumb wrapped (#c1); wrist neutral, ext 0..15 (cards/skull_crusher.json#c3, GA push); heel 0.3 (GA push) | `bent-back` +35, contact 1.05 (cards/skull_crusher.json#c3); along-forearm, lever checks on |
| rope/push | rope_triceps_pushdown: neutral (shared/rope-rule.json#c3, an inference the card flags) | against the knob (shared/rope-rule.json#c1; not the Right note, D-LIB7-17); Right note "Middle of palm"; thumb wrapped (#c2); wrist straight (#c4); middle of the palm .6, curl 2's square fist (`ga:rope-fist-mid`, D-LIB7-16; rope-rule gap 1) and loadAxis across, lever check off | `curled` −30 (shared/rope-rule.json#c6) |
| d-handle/push (**parked**, D-LIB7-19a: a gap until golden-B follow-up 9) | single_arm_triceps_pushdown: unstated (cards/single_arm_triceps_pushdown.json, grip.type) | thumb wrapped (#c2); wrist neutral (#c9); heel 0.3 (GA push) | `bent-back` +35, contact 1.05 (#c9 inverse, as the card's `wrongNote` records) |
| d-handle/pull | single_arm_lat_pulldown: unstated | base of fingers 1.0, thumb wrapped (inherited from lat_pulldown, recorded in the card); wrist not curled (cards/single_arm_lat_pulldown.json#c15) | `curled` −30 (#c15) |

**Faults that cannot be drawn in the radial view** are recorded but not drawn. These are wrist twists:
- hammer_curl (cards/hammer_curl.json#c5);
- cross_body_hammer_curl (#c7).

## 3. Gaps: 18 ids, asserted not drawn (16, plus the 2 parked push ids, D-LIB7-19a)
- **band** (the module has `GAPS` only; the supervisor's ruling):
  - resistance_band_row: no hand zoom and no hand fault on the card. Pilot A's band kind waits on research for a band-hand claim. A 20 mm drawing value applies only once a pair exists.
  - resistance_band_pull_apart: no card.
- **rope:**
  - overhead_cable_triceps_extension: rope-rule gap 3 (needs a source first), and the card's Wrong is an elbow fault.
  - face_pull, cable_crunch: no card.
- **d-handle:**
  - bayesian_cable_curl: no claim names the grip orientation (D-LIB7-12).
  - cable_chest_press: c3 names no bend direction (supervisor ruling, the same as the flys).
  - cable_fly, low_to_high_cable_fly: c4/c6 name no direction.
  - high_to_low_cable_fly: no hand zoom.
  - cable_lateral_raise, cable_rear_delt_fly, cable_external_rotation, pallof_press: no card.
- **curl:**
  - concentration_curl: no claim names the grip orientation (D-LIB7-12).
  - wrist_curl: exempt (shared/wrist-curl-exemption.json).

**Owned elsewhere:**
- sled_pull goes to LIB-12 (implements).
- dumbbell_overhead_triceps_extension goes to LIB-12 (cupped).

**Scope check.** LIB-7's census scope has 30 ids, and 12 drawn + 18 gaps = 30 (14 + 16 before D-LIB7-19a). The scope is:
- `byHandArchetype.curl` (13);
- `equipmentByNeed`: band (2), ezBar not already counted (skull_crusher), rope minus sled_pull (2), ropeLikely (2), and singleHandle minus bayesian_cable_curl (10).

## 4. Acceptance (`tests/library/hand-pairs.test.ts`, vitest), each with the mutation that turns it red

**A1. Golden B stays byte-identical.**
- The test imports every `hand-*.mjs` first. Then LIB-6's `compareCloseups` on all 8 must return [].
- It also pins the sha of golden-B `engine/hand.mjs` and `hand-pairs.mjs`.
- Mutations: a module that scales `HAND_PROP.index.seg[0]` by 1.01 on import; 1 byte added to `hand-pairs.mjs`.

**A2. Geometry per variant**, read from the `renderPair` report.

| Check | What it asserts | Mutation |
|---|---|---|
| G1 | Right ext is inside `wristRange` | right ext 20 |
| G2 | Each wrong is on its claimed side (`curled` < lo, `bent-back` > hi), so Right and Wrong cannot swap | flip a fault's side; swap right and wrong |
| G3 | Thumb is `wrapped` | thumb `loose` |
| G4 | Contact category (heel ≤ .3, mid .6, base 1.0), with the u along the palm checked against `HAND_PROP.index.mcp` × `HAND_OF_H` | contact 1.0 on push |
| G5 | `report.handle` and `handleDiameterMm` equal `HANDLE` | `diameterMm` dropped, so 32 is used |
| G6 | Along-forearm gives `report.ok`; rope has `checks` {} with the reason recorded | push wrong at contact .3 |
| G6b | A force line only where golden B draws one: along-forearm loads (chest press) and pulls (lat pulldown); none on a gravity curl (lateral raise) or the rope (D-LIB7-7) | the curl's `loadLine: false` removed |
| G9 | No bend value over the hand's outline (label placement, D-LIB7-6) | a moved label put back |
| G8 | Palm direction and camera match the orientation, and the orientation equals the claim (the claim text holds a phrase from the pinned list: under = "underhand", "palms up", "palms-forward", "palms forward", "supinated"; over = "overhand", "palms down", "palms toward the feet"; neutral = "neutral", "palms facing the body", "palms facing each other") | reverse_curl drawn underhand |

**A3. Sweeps.** `sweep(items, n)` throws when there are 0 items or the count is not n. It covers:
- 4 drawn keys plus band as a gap key;
- 7 variants;
- 12 drawn ids (14 before D-LIB7-19a; LIB-7's keys only: sweeps filter by `OWNER`, so LIB-12's keys never move them);
- 16 gap ids;
- joint check: no id is claimed by a LIB-7 and a LIB-12 module;
- scope 30 = census, with each `lib_` id once and its census archetype matching;
- every `<file>#<cid>` resolving in that file at research 95342b1, through a pinned extract (`hands/claims.json`).

Mutations: [] input; a key file removed; an id in two keys; a gap id drawn; `shared/curl.json#c99`; `cards/rope_triceps_pushdown.json#c1` cited for the knob (that claim is the pulley, so the text check fails).

**A4. Close-up QA**, as LIB-3 will run it. It runs here now and again on LIB-3 when that merges.

| Check | What it asserts | Mutation |
|---|---|---|
| H2 | Element, attribute and class vocabulary ⊆ golden-B hand SVGs; no colour literal; ids uid-prefixed and unique | `fill="#123"`; a duplicated id |
| H7 | Two builds are byte-identical; per-id SVG size ≤ the golden-B hand-chunk ceiling | a random uid |
| `inputsFor` | The import closure: every file the id reads, no other key file | a new import must appear in the closure |

**A5. Gate block "LIB-7"** (add-only), on Chromium 141 and Chrome 153.
- Each drawn pair renders through `hands/zoom.mjs` in 5 themes at 390, 360 and 340 px.
- It checks:
  - H4: no horizontal scroll, and the SVG stays inside the box;
  - H5: contrast for each `h-*` ink class ≥ golden B's minimum, measured in the same job;
  - Right ≠ Wrong pixels;
  - two renders give a 0 px diff;
- It is red when 0 pairs load.
- Mutations: 0 pairs; wrong = right; `HAND_CSS` stripped.

Every test is shown red with its mutation and at 0 without it (gotcha V1-08).

## 5. R8 critic and sheets
- **Machine half:** G2, G3, G4 and G8.
- **Sheet:** `hands/sheet.mjs` builds a private sheet.
  - Each pair is shown at 390 px in Silent Black and Paper.
  - It sits beside its closest approved golden-B hand at the same scale: curl beside the lateral raise, pull beside the lat pulldown, push beside the chest press.
  - The sheet also shows the claims, flags and ids.
- **Critic run:** one fresh Opus critic scores R8 (plus R2, R3 and R7).
  - Two approved golden-B hands are mixed in unlabelled. A score below 4 discards the run.
  - The supervisor plants two defects with `--plant <json>` (applied in memory, never committed). A missed defect discards the run.
- **Pass:** every score ≥ 4. One fix round, then the supervisor.
- LIB-12 uses the same sheet and `--plant`.
- Pilot A shows curl, EZ, rope and D-handle (ruling). The band kind waits on research.

## 6. Build decisions (recorded as D-LIB7-6 to D-LIB7-12 in docs/COACHING-DECISIONS.md)
- **D-LIB7-6, bend labels.** A bend value whose box would cover its half's outline moves to the first free spot on rings round its wrist, forearm side first. Golden B moves such labels by hand (LIB-6 `bendLabel`). The gate measures the real boxes.
- **D-LIB7-7, force lines.** No force line on curls (gravity across a level forearm, as on golden B's lateral raise) or on the rope (no source gives its direction).
- **D-LIB7-9, no knob ring.** The rope's 46 mm knob lies behind the fist in the view from above. A ring drawn there drew no pixel in the gate (the page with and without it was identical), so it is not drawn. "Against the knob" is carried by the Right note and the alt text. (Superseded: D-LIB7-13 dashes the knob, D-LIB7-17 relabels the Right.)
- **D-LIB7-8, panel height.** Level-forearm pairs (curl, rope) use a 170 px panel. The scale is unchanged at 262 and at 140 px, so this only cuts empty space (lateral raise 130, pull-up 250).
- **D-LIB7-10, Wrong labels.** One pair of words everywhere: "Wrist curled" (flexed) and "Wrist bent back" (extended). These are shared/curl.json's labels and golden B's chest press label. rope-rule's "Wrists curl" names the same fault.
- **D-LIB7-11, no machine row on hand-held weights.** golden B's "seen from above" row prints YOU ← MACHINE →. A neutral grip on a dumbbell keeps the words "Seen from above" only. The rope keeps the row (it hangs from the cable machine).
- **D-LIB7-12, a level forearm needs a stated orientation.** A curl drawn with a level forearm shows the palm up or down. concentration_curl and bayesian_cable_curl have no orientation claim, so they are gaps. The single-handle pushdown and pulldown stay drawn: their forearm is vertical, and the thumb-side label states no orientation.
- **LIB-12 asks (supervisor OK, 10-02).** `pairSpec` needs a diameter only for radial keys or a key with a handle profile. Every LIB-7 count filters by `OWNER`.
- **R8 finding c (push Right reads mid-hand), checked, not changed. Superseded by D-LIB7-14 (§7).** The push Right uses contactAt .3, golden B's chest-press heel value, and G4 measures the drawn contact at the heel position. The forearm is vertical, as in the pushdown and skull crusher, so the picture differs from the level chest press but not in placement.

## 7. Calibrated critic fixes (supervisor, 2026-10-03; the critic's valid run on #193)
- **D-LIB7-13, rope (replaces D-LIB7-9).**
  - The rope is drawn as one plain section: golden B's handle core ring and cross are removed, because they belong to a rigid handle.
  - The 46 mm knob (`eq/rope.mjs:54`) is drawn coaxial with the strand, dashed over the fist with golden B's hidden-equipment line (`h-eq-thin`), in both halves.
  - ~~The rope moves into the fingers, contactAt 1.15.~~ Superseded by D-LIB7-16: that fist tapers to a point.
  - Check G7: a rope with a core, without its knob, or with a knob off the strand fails. It fails on the 23ac5bb drawing.
- **D-LIB7-14, push Right (single_arm_triceps_pushdown, skull_crusher).**
  - The handle sits low in the heel, as on golden B's approved squat Right (contactAt -0.1, wrist 8°; the squat file explains -0.1 as 0.45 of the palm length). It replaces the chest-press 0.3, which drew the handle against the finger fold.
  - The Right force line is re-aimed from its handle end through the wrist pivot. The sheet flags -0.1 and 8° as drawing values.
  - Checks:
    - G4: the heel category is now -0.1.
    - G6: the Right line passes within 0.5 px of the pivot.
  - Both fail on the 23ac5bb drawing.
- **D-LIB7-15, EZ angled grip.**
  - ez_bar_curl's claims name the angled grip: `cards/ez_bar_curl.json#c1` "underhand on its angled sections", and #c2 "semi-supinated (half-way between palms up and palms in)".
  - It gets its own orientation, `angled`, labelled "Seen along the angled grip". It is drawn palm up (D-LIB7-16).
  - The id therefore leaves the shared straight-bar tile and the approved list until the next critic run.
  - preacher_curl's claim (#c1 "take the curl bar with an underhand grip") names no angle, so it stays underhand in that tile.
  - A test fails when an id whose claims name the angled section is drawn as anything other than `angled`.
- **D-LIB7-16, delta review on #193 @ bfacafb.**
  - EZ angled grip drawn palm up: bfacafb drew it palm down, byte-identical to reverse_curl. The camera looks along the angled section, and the hand closes square to that section, so it shows as an underhand grip does from the side; "Seen along the angled grip" carries the angle. ez_bar_curl therefore draws as preacher_curl does, apart from its camera words. G8 now checks `angled` (palm up) and fails when the mirror is left out.
  - Rope fist squared: golden B's fist closes to a point once the handle sits at .85 or more along the palm (measured: front 13.9 mm wide at .85, 12.4 at 1.15; 22.7 at .6, curl 2 23.5). The rope uses curl 2's fist, contactAt .6. Ruling D-LIB7-16a, case 1: no rope_triceps_pushdown claim names where the load sits (shared/rope-rule.json c1 to c6 name the knob, the full grip, the neutral grip and the straight wrist; its gap 1 says no source places the load), so the contact is the flagged drawing value `ga:rope-fist-mid`; `ga:rope-fingers` is removed (unused). G7 fist front: every level-forearm Right is at least 20 mm wide within 4 mm of its front.
  - Push flags on the sheet; the push alt text says "The push runs through the wrist".
- **D-LIB7-17 (ruling D-LIB7-17a), rope label.** Case 1 by claim: `shared/rope-rule.json#c1` puts the hand against the knob. But no one view shows both #c1 and the #c6 fault: the wrist curls about the thumb-to-little-finger axis, which is the rope's own axis. The view from above (the thumb side) shows the curl in its plane and the rope and knob end-on under the fist; a view from the side of the body shows the rope and knob but turns the curl toward the camera. #c6 decides: the view stays, the Right note is the drawn contact "Middle of palm" (`ga:rope-fist-mid`), the knob wording leaves the note and the alt text, and #c1 stays cited for the knob. The knob rim: none of it reaches past the fist outline; it lies at least 2.6 mm (1.8 px) inside it in both halves (measured on 360 rim points against the halves' outlines), so the whole ring stays dashed. G7 fails a dashed knob whose rim shows past the fist.
- **D-LIB7-18, push Right load line (3-critic panel @ 1114bc1, C7, 2 of 3). Superseded by D-LIB7-18a.** The Right line ran about 15° off the forearm axis (from the contact through the pivot) while the Wrong's runs along it. It is now drawn straight down the forearm axis through the pivot, from the level of the contact, the same length; G6 fails a Right line more than 2° off the axis (1114bc1's measures 15°). The handle is not moved: golden B's palm puts the contact 12.3 px (handle centre 28.2 px) off the axis at the squat pose (contactAt -0.1, wrist 8°). The contact reaches the axis only at wrist 15° with contactAt about .3 (measured -0.4 px), which puts the handle 16 px higher, back against the finger fold the first critic run rejected, and draws the strain mark on the Right. So the handle stays in the heel and the line starts on the axis level with it.
- **D-LIB7-18a, push Right without a force line (delta review @ 60ea214 failed: the line no longer started at the contact, and the reference wrist tick was stripped).** Golden-B squat Right precedent: the Right of single_arm_triceps_pushdown and skull_crusher draws no force line; it keeps the contact dot low in the heel, the wrist pivot and the engine's reference wrist tick. The Wrong is unchanged (its line behind the wrist is the lever it shows). G6 fails a push Right on the heel that draws a force line or loses its tick or contact dot; G6's pivot and axis checks stay for any Right whose line is routed through the pivot (`loadThroughPivot`), tested on a planted variant.
- **D-LIB7-18b (amends D-LIB7-18a; delta review @ 93f5b2a, Medium).** Golden B's squat `loadLine: 'guide'` is no arrow and no tick (`barbell_back_squat.howto.mjs:19-20`, its render strips the Right's arrow and tick, `:119-120`); D-LIB7-18a's "reference wrist tick" misread it. The push Right now drops the tick with the line; the contact dot in the heel and the pivot stay. G6: a push Right with no force line draws no wrist tick.
- **D-LIB7-19 (panel critic @ f3e285c, all 3 critics in both rounds, C3 = 3).** The two push Rights labelled HEEL OF PALM drew the handle mid-fist, about 83 px (2×) above the pivot and in front of the forearm, because they copied golden B's squat Right, which has the same defect (golden-B follow-up 9). The ruling asked for the handle low in the heel and over the forearm. Measured through golden B's engine (d-handle push Right, f3e285c: handle centre 42.1 px above the pivot and 28.2 px off the axis, radius 16.0 px): no pose at wrist 8-35° and contactAt -0.8 to -0.2 has both the height at most 23.1 px (0.55×) and the axis through the circle. A low handle always sits at least 25 px in front of the axis, and only about 35° (the Wrong's fault) brings the axis through it, high up (grid on #193).
- **D-LIB7-19a (ruling, option 1).** single_arm_triceps_pushdown and skull_crusher become gaps citing golden-B follow-up 9: 12 drawn, 18 gaps, 22 pages. The push design is parked, not deleted: `radial-rules.mjs pushVariant`, the d-handle and ez `push` variants (each module's comment keeps the id's orientation, fault and claims), `rightNoLoad`, the D-LIB7-14/18a/18b decisions and G4/G6's push checks all stay. The push-only checks are idle while no push is drawn and keep their failure paths through a test fixture that draws the two ids again as they were (`redrawPush`). No tolerance changed. When plan 2.8 fixes follow-up 9, the ids move back to `IDS` and must meet D-LIB7-19's two rules, added to G4 then.
- **Approved drawings unchanged.** The critic-approved pages are pinned by one sha256, computed on 23ac5bb: curl 1, curl 2, curl 3 without ez_bar_curl, reverse_curl and single_arm_lat_pulldown. The sheet's own pins were re-pinned once for these fixes.
