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
- `INPUTS?`, `VIEW_FILES?`: extra files the drawing reads (for `inputsFor`). A variant may carry its own `handle`, which overrides `HANDLE`;
- `IDS`: `{ <card id, no lib_>: { variant, orientation, faults: [<fault>], claims } }`.
- `GAPS`: `{ <card id>: reason }`. These ids belong to this key's census scope but are not drawn.

### Loader (`hands/pairs.mjs`)
- It discovers modules by filename, so there is no shared registry to edit. It builds `HAND_OF_ID` and throws if an id is drawn twice, or is drawn by one key and listed as a gap by another.
- `pairSpec(id)` returns the record a pair needs: camera, loadAxis, right, the wrong pages, notes, alt and extras.
- `renderPair(id, opts)` calls `module.render ?? renderHandPair` (golden-B, unchanged), then applies the extras: the rope knob ring, and the thumb-side camera label (D-LIB7-4).
- `inputsFor(id)` lists everything that drawing depends on, for LIB-2's per-output `inputsSha256`: `pairs.mjs`, the id's key file, its view file (`layers/engine/hand.mjs` for radial), `zoom.mjs`, and the LIB-6 render files it uses (`render/closeup/common.mjs`, `thumb.mjs`). A change to another key never marks this id stale.

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
- The rope ring reuses the existing `h-eq-thin` class, the way golden-B draws a dumbbell head.
- No golden-B value is read for a diameter; each module passes its own.

## 2. Drawn pairs: 4 keys, 8 variants, 16 ids
Claim refs are `<file>#<cid>`, relative to `docs/research/howto/`.

**Sizes are drawing values (D-LIB7-2).** These follow golden-B `HANDLES` and main's `eq/rope.mjs`:
- dumbbell 32 mm with a 120 mm head ring;
- bar and EZ 28 mm;
- rope 28 mm with a 46 mm knob ring, pinned to `eq/rope.mjs:54`;
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
  - unstated orientation → the label "Seen from the thumb side", which states no orientation (the card for `single_arm_triceps_pushdown` asks for this).
- **G8** checks the screen direction of the palm. Underhand puts the palm up. Overhand puts it down (`mirror`).

| key/variant | id: orientation (claim) | right | wrong faults |
|---|---|---|---|
| curl/dumbbell | dumbbell_biceps_curl: under (cards/dumbbell_biceps_curl.json#c1); alternating_dumbbell_curl: under (cards/alternating_dumbbell_curl.json#c2); incline_dumbbell_curl: under (cards/incline_dumbbell_curl.json#c11); hammer_curl: neutral (shared/curl.json#c2); cross_body_hammer_curl: neutral (cards/cross_body_hammer_curl.json#c1); concentration_curl: unstated | thumb wrapped (shared/curl.json#c1, #c2); wrist straight, ext 0 in −10..10 (shared/curl.json#c3, #c4); middle of palm 0.6 (GA; curl.json gap 1) | `curled` −30 and `bent-back` +30 (shared/curl.json#c3, #c4, #c5) |
| curl/bar | barbell_curl: under (cards/barbell_curl.json#c1); cable_curl: under (cards/cable_curl.json#c1) | same as curl/dumbbell | `bent-back` (cards/barbell_curl.json#c8, cards/cable_curl.json#c9); `curled` (shared/curl.json#c3) |
| ez/curl | ez_bar_curl: under (cards/ez_bar_curl.json#c1, #c2); preacher_curl: under (cards/preacher_curl.json#c1); reverse_curl: **over** (cards/reverse_curl.json#c1) | thumb wrapped (shared/curl.json#c1); wrist straight (cards/ez_bar_curl.json#c8, cards/preacher_curl.json#c8, cards/reverse_curl.json#c6) | `bent-back` (same claims); `curled` (shared/curl.json#c3) |
| ez/push | skull_crusher: over, palms toward the feet (cards/skull_crusher.json#c1) | thumb wrapped (#c1); wrist neutral, ext 0..15 (cards/skull_crusher.json#c3, GA push); heel 0.3 (GA push) | `bent-back` +35, contact 1.05 (cards/skull_crusher.json#c3); along-forearm, lever checks on |
| rope/push | rope_triceps_pushdown: neutral (shared/rope-rule.json#c3, an inference the card flags) | against the knob (shared/rope-rule.json#c1); thumb wrapped (#c2); wrist straight (#c4); fingers 1.0 and loadAxis across, lever check off (GA 3.1.1; rope-rule gap 1) | `curled` −30 (shared/rope-rule.json#c6) |
| d-handle/push | single_arm_triceps_pushdown: unstated (cards/single_arm_triceps_pushdown.json, grip.type) | thumb wrapped (#c2); wrist neutral (#c9); heel 0.3 (GA push) | `bent-back` +35, contact 1.05 (#c9 inverse, as the card's `wrongNote` records) |
| d-handle/pull | single_arm_lat_pulldown: unstated | base of fingers 1.0, thumb wrapped (inherited from lat_pulldown, recorded in the card); wrist not curled (cards/single_arm_lat_pulldown.json#c15) | `curled` −30 (#c15) |
| d-handle/curl | bayesian_cable_curl: unstated | as curl/dumbbell (shared/curl.json, `appliesTo`) | `curled` and `bent-back` (shared/curl.json#c3, #c4) |

**Faults that cannot be drawn in the radial view** are recorded but not drawn. These are wrist twists:
- hammer_curl (cards/hammer_curl.json#c5);
- cross_body_hammer_curl (#c7).

## 3. Gaps: 14 ids, asserted not drawn
- **band** (the module has `GAPS` only; the supervisor's ruling):
  - resistance_band_row: no hand zoom and no hand fault on the card. Pilot A's band kind waits on research for a band-hand claim. A 20 mm drawing value applies only once a pair exists.
  - resistance_band_pull_apart: no card.
- **rope:**
  - overhead_cable_triceps_extension: rope-rule gap 3 (needs a source first), and the card's Wrong is an elbow fault.
  - face_pull, cable_crunch: no card.
- **d-handle:**
  - cable_chest_press: c3 names no bend direction (supervisor ruling, the same as the flys).
  - cable_fly, low_to_high_cable_fly: c4/c6 name no direction.
  - high_to_low_cable_fly: no hand zoom.
  - cable_lateral_raise, cable_rear_delt_fly, cable_external_rotation, pallof_press: no card.
- **curl:**
  - wrist_curl: exempt (shared/wrist-curl-exemption.json).

**Owned elsewhere:**
- sled_pull goes to LIB-12 (implements).
- dumbbell_overhead_triceps_extension goes to LIB-12 (cupped).

**Scope check.** LIB-7's census scope has 30 ids, and 16 drawn + 14 gaps = 30. The scope is:
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
| G7 | The rope ring is concentric with the handle, with r = 23 mm × k | ring moved by 1 mm |
| G8 | Palm direction and camera match the orientation, and the orientation equals the claim (the claim text holds a phrase from the pinned list: under = "underhand", "palms up", "palms-forward", "palms forward", "supinated"; over = "overhand", "palms down", "palms toward the feet"; neutral = "neutral", "palms facing the body", "palms facing each other") | reverse_curl drawn underhand |

**A3. Sweeps.** `sweep(items, n)` throws when there are 0 items or the count is not n. It covers:
- 4 drawn keys plus band as a gap key;
- 8 variants;
- 16 drawn ids;
- 14 gap ids;
- scope 30 = census, with each `lib_` id once and its census archetype matching;
- every `<file>#<cid>` resolving in that file at research 95342b1, through a pinned extract (`hands/claims.json`).

Mutations: [] input; a key file removed; an id in two keys; a gap id drawn; `shared/curl.json#c99`; `cards/rope_triceps_pushdown.json#c1` cited for the knob (that claim is the pulley, so the text check fails).

**A4. Close-up QA**, as LIB-3 will run it. It runs here now and again on LIB-3 when that merges.

| Check | What it asserts | Mutation |
|---|---|---|
| H2 | Element, attribute and class vocabulary ⊆ golden-B hand SVGs; no colour literal; ids uid-prefixed and unique | `fill="#123"`; a duplicated id |
| H7 | Two builds are byte-identical; per-id SVG size ≤ the golden-B hand-chunk ceiling | a random uid |
| `inputsFor` | Covers the files the id reads | a key file dropped from the list |

**A5. Gate block "LIB-7"** (add-only), on Chromium 141 and Chrome 153.
- Each drawn pair renders through `hands/zoom.mjs` in 5 themes at 390, 360 and 340 px.
- It checks:
  - H4: no horizontal scroll, and the SVG stays inside the box;
  - H5: contrast for each `h-*` ink class ≥ golden B's minimum, measured in the same job;
  - Right ≠ Wrong pixels;
  - two renders give a 0 px diff;
  - the rope ring has ink.
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
