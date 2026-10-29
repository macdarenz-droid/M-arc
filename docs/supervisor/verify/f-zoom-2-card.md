Card F-ZOOM-2: an opt-in vertex pair for a rotation fault (D-LIB17-ZOOMPAIR); F-ZOOM-TRIM and the narrow-plate circle decided from measurements (supervisor card, 2026-10-26)

id: F-ZOOM-2
model: claude-opus-5-5 (it changes what a shared QA row measures; not mechanical)
mode: auto
title: 'Builder: F-ZOOM-2 zoom.pair'
branch: claude/f-zoom-2 (new; no such branch on origin on 10-26). The first push opens draft PR 'F-ZOOM-2: opt-in zoom.pair for a rotation fault (D-LIB17-ZOOMPAIR)'.
lane: a tools fix card, like F-ZOOM-INK (#329). It merges ahead of LIB-17's renegade_row resume.
base: origin/main @ `c7bdad7a` (train 44: #327 merged) or newer. Every line below was read at `c7bdad7a`. Re-read each line on your base and use the line you find there.
depends_on: none open. The ruling's condition, "written after #327 merges" (#332 6409786985), is met.
build_prerequisites: 'F-ZOOM-2 start' from the supervisor.
merge_prerequisites: a fresh Opus review PASS against this card; every check green on a head that contains the latest main; checklist order (AGENTS.md). Nothing under escobar-worker/**.

## Stops (these override every other line)
1. Nothing is loosened. These stay as they are: the bars traceLenMin 22.11 and deviationMin 11.39 (qa/envelope.json:12-13); every H3.zoom and H4.zoom row (qa/zoom.mjs:75-110), H4.zoom:ink included (:104); `ZOOM` r 52, margin 8, meta band 44, gap 6, k 1.5-4 (zoom/inline.mjs:15); the trace trim (vendor plate.mjs:174-176); exemptions and envelope.
2. No spec file changes. renegade_row's `zoom` field is LIB-17's (#332), after this card merges. No page, plate or approved byte changes (A6).
3. A row that could pass only by loosening stays held, and the card says so (items b and c).
4. Never commit scratch files. Never write to the owner.

## Why now
- renegade_row is held because its fault is a rotation about a fixed tell anchor (`M_HEX[0]`, specs/renegade_row.mjs:130). `faultOf` measures the tell anchor's move from end to Mistake (inline.mjs:47-57, :52), so it reads 0 px at every k (D-LIB17-ZOOMPAIR, #332 6409786985).
- F-ZOOM-TRIM (superman, #326 6405804435 item 2) and the cable_rear_delt_fly placement question (#332 6410506295, D-LIB17-RDFHOLD) are batched here (lib4-cards §44).

## Scope: three items, decided

### (a) zoom.pair: BUILT
- Shape: a Mistake entry may carry `pair: [flat, turned]`, two world points `[x, y, z]` in metres: the same drawn vertex, flat (end pose) and turned (Mistake pose).
- Field rules, added in `entryProblems` (inline.mjs:36-43; the key list is :39). zoomOf then throws (:115-116) and QA reports H3.zoom:field (qa/zoom.mjs:77). Red when:
  - `pair` is on a `view: 'normal'` entry;
  - `pair` is not exactly two points of three finite numbers;
  - the two points are equal.
- `faultOf` (inline.mjs:47-57): when the Mistake entry has `pair`, it returns `{ key: zoom.tell ?? 'pair', end: cam.P(flat), mistake: cam.P(turned), d }` and reads no tell. With no pair, the existing loop runs byte for byte.
- These existing lines then follow the pair with no edit:
  - zoomOf centres the source ring and places the circle on the pair (:121, :124, :127-135);
  - QA's deviation is `d × k` (qa/zoom.mjs:64);
  - the content row requires both pair points inside the drawn source ring (:99), read from the page markup.
- New QA row `H3.zoom:pair:mistake`, in zoomRows, only when the entry has `pair`. Camera: cameraOf(spec, R.normal.report) (qa/engine.mjs:36-42). Drawn items: equipmentItems(ctx.engine, spec, R.normal.report, ['end', 'mistake']) (qa/engine.mjs:65-82). Red when:
  - `flat` is more than 0.01 px from every `poly` vertex of an end-pose equipment item;
  - `turned` is more than 0.01 px from every `poly` vertex of a Mistake-pose equipment item;
  - `turned` is more than 0.01 px from the Mistake-pose anchor of the spec's Mistake tells (zoom.tell's tell, when set), resolved as inline.mjs:52 resolves it. This condition is stricter than the ruling. It follows D-LIB18-RINGKEEP (#325 6412694847): the zoom magnifies what its own tell names, so no larger-moving vertex elsewhere can be picked.
- `H3.zoom:not-needed:mistake` also fires when the entry has `pair` and the pair's plate-scale distance (`fault.d`) is ≥ deviationMin. This is a strict addition beside qa/zoom.mjs:97, which reads only the tell anchors (0 px here).
- qa/node.mjs is not edited. h3 already hands a zoomed Mistake view to these rows (node.mjs:135, :140).

### (b) F-ZOOM-TRIM: decided from the code. It is not a correction, and it is not built
- The trim is a length in output px. SPEC.md:105 gives `trim: [startPx, endPx]`, and the engine drops samples within t0/t1 px of the path's ends, measured on projected points (plate.mjs:174-176).
- zoomOf renders the same spec, trim included (`...spec`, inline.mjs:138-140), at k × the camera into the same 358 px space. It inlines that render with no transform (:141-142, :151). So inside the circle the trim is t screen px, as on the plate.
- The arrowhead (6/±3 px, plate.mjs:180) and the stroke widths are also kept at screen size.
- Measured over the plate's own path, main's zoom already trims t/k plate px, which is k times less than the plate trims. There is no units bug that costs superman length. The units-consistent reading (the plate's trimmed region magnified, t·k zoom px) trims more:
  - it gives superman 0 px at every k;
  - it would turn the approved cable_chest_press normal zoom red (63.04 → 19.81 px at k 3; LB6 page `e4260472…6848`).
- Only a trim smaller than t inside the zoom (t/k, or a per-spec zoom trim) lengthens superman's Trace. That is a new drawing rule, not a fix. It also changes cable_chest_press's approved zoom bytes (63.04 → 77.46 px at t/k).
- superman also has no place for the circle at any k (below). So a trim rule alone releases nothing. Nothing is built here.

### (c) cable_rear_delt_fly: no rule-keeping placement. It is not built
- The tell `roll` moves 4.39 px at 146.29 px/m. With r 52 (inline.mjs:15), zoomOf finds no place at any k in 1.5-4. The same holds at r 48, 44, 40, 36 and 32.
- The first place is at r 30, at (98, 190): 11.0 px at k 2.5 and 13.2 px at k 3. At r 52, ink alone blocks every place: with the labels left out there is still none (the first place is r 40, at (252, 200)). Moving labels would not help (#332 6410502652).
- r 30 is a 60 px circle against the ruled 104 px circle (zoom/DESIGN.md:15). No readability bar for a circle under r 52 exists on main.
- Making one up would be a new rule, which the D-LIB17-RDFHOLD route allows only "if one exists". The row stays held.

## Held rows: what this card does to each (measured on main `c7bdad7a`, scratch, not committed)

| row | blocker | measured | F-ZOOM-2 |
|---|---|---|---|
| renegade_row (#332, LB7) | rotation fault; faultOf 0 px | pair `[[DB.l[0], RR.apothem, RR.gz + RR.circum], M_HEX[0]]` (the far hex's drawn vertex 0, which is the tell's vertex before the 30° turn) = 5.640 px at 146.29 px/m. Times k: 1.5 → 8.46, 2 → 11.28, 2.5 → 14.10, 3 → 16.92, 4 → 22.56. Circle (126, 188) at every k. Source ring (236.4, 328.7), r 17.33 at k 3, closes at y 346.0 < 358 (D-LIB22-RINGFIT). Full LB7 QA at k 3 (#332 head `dc19a3bd` with main's zoom/qa files and a scratch pair): no H2/H3/H4 zoom key, and PQ-H3 passes. | **Releases the H3 hold** (k ≥ 2.5; LIB-17 picks k, e.g. its planned k 3 → 16.92 px). Still red there, and LIB-17's to fix: `H4.overlap:normal:line\|feet` and `H8.words:mistake.corner.label` ("Lands on a corner" is 4 words). #332's 4.9 px was vertex 1 (4.938 px), not the tell's vertex. |
| superman (#326, LB9) | F-ZOOM-TRIM; no place | Raw ankle path 9.80 px (trim [10, 12], superman.mjs:164). Clipped Trace at k 2.5/3/3.5/4, with the labels left out so that it places: main 2.04/6.73/12.14/16.33; t·k 0 at every k; t/k 15.31/21.42/27.86/32.65; [0, 0] 23.47/28.17/32.86/37.55. With its labels in: no place at any k. Only the `low` box ({22, 266}, superman.mjs:168) blocks it; without it the circle sits at (62, 250) at k 2.5 and (68, 254) at k 3-4. | **Stays held.** Two blockers, both outside this card: a trim rule (b), and a normal-view label move (D-LIB18-ZOOMPLACE covers Mistake labels only). For LB9's ruling: spec trim [0, 0] (jump_rope.mjs:85's precedent) plus `low` moved gives 23.47 px at k 2.5. |
| jump_rope (#331, LB10) | H3.zoom:trace at kMax | trim [0, 0] (jump_rope.mjs:85), so no trim rule changes it. Raw 5.33 px; k 4 → 21.30 px < 22.11; circle (298, 288). It needs k ≥ 4.15. | **Stays held.** It would pass only with k > 4, which loosens the k ladder (Stop 1). |
| cable_rear_delt_fly (#332, LB7) | no place | (c) above | **Stays held** (D-LIB17-RDFHOLD). |

## Files
- write_scope:
  - tools/plates/library/zoom/inline.mjs: `entryProblems` and `faultOf` only, plus their doc comments;
  - tools/plates/library/qa/zoom.mjs: `zoomRows` gains the pair row and the not-needed line. Export the pair check as `pairProblems(spec, E, report)` so tests call it directly;
  - tools/plates/library/MANIFEST.json: one `[golden update]` commit only, the zoom/inline.mjs hash (MANIFEST.json:83) on the 17 rows whose closure holds it (precedent `5b5ba0a7`), regenerated with `manifestText(await manifestOf())` (ci/manifest.mjs:95, :104);
  - tests/howto/f-zoom-2.test.ts (new, node only);
  - tools/plates/library/zoom/DESIGN.md: append a section "F-ZOOM-2" (the field, its rows, this card's numbers);
  - docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- reserved (read only): tools/plates/vendor/**; every specs/** file; qa/node.mjs, qa/browser.mjs, qa/envelope.json, qa/exemptions.json; zoom/rows.json, zoom/approved.json, zoom/ink-check.mjs, zoom/build.mjs; every lane directory; scripts/screenshot-gate.mjs (no block: nothing in the browser changes); package.json and package-lock.json; tests other than the new file.
- Collision check (10-26): no open lane PR touches zoom/ or qa/ (#325, #331, #332, #289, #109: `git diff --name-only origin/main...pr` empty).

## Do
1. Re-read every cited line on your base. Record each page sha (A6) on that base before any edit.
2. inline.mjs: item (a)'s field rules and the `faultOf` pair branch. The pair branch comes before the tell loop; the loop is unchanged.
3. qa/zoom.mjs: `pairProblems` and the two zoomRows lines. No other row's text or key changes.
4. tests/howto/f-zoom-2.test.ts:
   - Build candidates as lib-zoom.test.ts:36-44 does (`mutated()`: a scratch module that imports the real spec, then buildPlatesPage, candidateOf and runQa).
   - Give renegade_row its registry row in memory, as lb7/build.mjs:72-86 (heldData, buildHeldPage) does.
   - The release fixture is main's renegade_row plus `zoom: { view: 'mistake', k: 3, pair }`, with the pair built from the spec's exports (DB, RR, M_HEX).
   - Keep each test well under vitest's limit (D-LIB8M-RPC (b): builds go through buildPlatesPage's child process).
5. Run the byte proofs (A6). Then the `[golden update]` re-pin, and show C0 `[]`.
6. DESIGN.md section and COACHING entry.
7. Merge origin/main (with a merge commit). Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` on the merged head. Post 'F-ZOOM-2 READY @ <sha>' with the A-rows' evidence.

## Acceptance (each row: evidence, and a mutation that must be red)

| # | criterion | evidence | red mutation |
|---|---|---|---|
| A1 | field shape | `zoomFieldProblems` unit cases; zoomOf throws | `pair: [p, p]` → "the two points are equal"; `pair` on a normal entry; a 2-number point; a third point |
| A2 | faultOf uses the pair only when present | release fixture: `fault.d` 5.640 ± 0.005 px, key `'pair'` (zoom.tell's key when set); horizontal_leg_press and cable_chest_press `faultOf` deep-equal to main's | the pair branch also taken with no pair (e.g. `pair ?? tells`) → the A6 zoom page sha `a0ef8eab…` and the LB6 sha are red |
| A3 | the bar is met at the zoom's scale, unchanged | fixture k 3: deviation 16.92 ± 0.01, no `H3.zoom:*` or `H4.zoom:*` key, no H3 key | k 2 → `H3.zoom:deviation` (11.28 < 11.39); k 1.5 → red (8.46) |
| A4 | the pair lies inside the source ring | fixture: `H3.zoom:content:mistake` absent | the built page's `pz-src` cx − 20 → `H3.zoom:content:mistake` |
| A5 | each pair point is a drawn vertex, and turned is the tell's anchor | `pairProblems` is `[]` on the fixture | flat = `DB.l` (hex centre, not a vertex); flat moved 1 mm in z; flat = `M_HEX[3]` (a Mistake-only vertex); turned = `M_HEX[1]` (drawn, but not the tell's anchor): each `H3.zoom:pair:mistake` |
| A6 | every page and approved plate byte-identical | page sha256 before and after on the same base: zoom (horizontal_leg_press) `a0ef8eab…ccece0`, LB6 (cable_chest_press) `e4260472…526848`, LB1 `242262d4…`, LB2 `cb267416…`, LB3 `6ff09d4c…`, LB5 `921cb1d5…`, LB7 `1972ed5b…`, LB8 `ca51e441…`, LB9 `b96db9fa…`, LB10 `22b7d177…` (all measured at `c7bdad7a`, and unchanged with a scratch pair branch); pilot A L1 `5d0e562f…5ba8` (lib8-pin.test.ts:39) and pilot B `ff3e017c…583f` (lib11-pilot-b.test.ts:279) green; C0 `[]` after the re-pin; zoom/ink-check.mjs PAGE_SHA green; horizontal_leg_press's and cable_chest_press's authoring QA reports deep-equal before and after | a one-byte change in ZOOM_CSS → every zoom-page pin red; the re-pin skipped → C0 red |
| A7 | not-needed with a pair | fixture clean | pair `[flat vertex 3, M_HEX[0]]` (17.15 px at plate, both drawn, turned = anchor) → `H3.zoom:not-needed:mistake` |
| A8 | trim unchanged (item b) | test pins: superman (with `low` dropped) k 4 clipped Trace 16.33 ± 0.05; jump_rope k 4 clippedTrace 21.30 ± 0.05 (< 22.11); cable_chest_press normal zoom 63.04 ± 0.05 | a scratch zoom trim of t/k → the cable_chest_press pin and the LB6 sha are red |
| A9 | full suite | `npm run check`, `npm run test:tz`, the gate (every shard, both time zones) on the READY head; CI green | — |

## Rulings recorded (summaries; the posted text wins)
- D-LIB17-ZOOMPAIR (#332 6409786985): opt-in `zoom.pair: [flat, turned]` of drawn vertices; faultOf uses it only when it is present; every other spec stays byte-identical; mutations: equal pair, pair outside the ring, a point off a drawn vertex.
- F-ZOOM-TRIM (#326 6405804435 item 2; lib4-cards §43): superman held; "a zoom-scale trim rule, to be designed once #327 has merged".
- D-LIB17-RDFHOLD (#332 6410506295): cable_rear_delt_fly held; F-ZOOM-2 looks for a placement that keeps every check, "and only if one exists".
- D-LIB16-ZOOMVIEWS (lib4-cards §41): one entry per view; a `[golden update]` re-pin for zoom/inline.mjs, with both pilot pages byte-identical.
- D-ZOOM-INK (§43, §44): the H1 clip fix stays as merged.
- D-LIB18-RINGKEEP (#325 6412694847): the zoom magnifies what its own tell names; H3.zoom refuses a motion too small to see. This is the basis for A5's tell-anchor condition.
- D-LIB22-RINGFIT (#331 6415452903 item 4): a source ring closes inside the plate frame. renegade_row's does (346.0 < 358).
- New, proposed for the supervisor:
  - D-FZOOM2-TRIM: the zoom keeps its screen-px trim (t/k plate px; main's behaviour). Neither reading is a units bug (line 48 names t·k zoom px the units-consistent one), so nothing changes. A smaller zoom trim is a rule change. superman stays held for LB9's own ruling (spec trim and the `low` box).
  - D-FZOOM2-RDF: there is no rule-keeping circle for cable_rear_delt_fly at r 52, and no readability bar exists for r 30. It stays held.

## Risks and mitigations
- A pair picked to inflate the fault. The pair must be drawn vertices, with `turned` the tell's anchor, inside the ring and under the bar at plate scale (A4, A5, A7). The reviewer checks that `flat` is the same vertex before the turn (the index matches `M_HEX`'s).
- zoom/inline.mjs is in 17 MANIFEST rows' closure. One `[golden update]` commit, C0 `[]`, and the page and pilot shas in A6.
- The pair row's cost: equipmentItems re-solves the poses. It runs only when `pair` is present, so no other plate's QA time changes.
- Lane merges: no open PR edits zoom/ or qa/ (checked 10-26). LIB-17 merges main after this card, then adds the field.
- renegade_row is not fully released by this card. Its two non-zoom rows (H4.overlap, H8.words) stay LIB-17's, and the card's READY says so.

## Forecast [est]
About 4 Opus-hours: code 1 h; tests and mutations 1.5 h; byte proofs and the re-pin 0.5 h; local check, tz and gate 1 h of attention (the gate takes longer on the clock). Review adds calendar time. Allow up to 2× if review asks for a fix round.

## Measurement provenance
Scratch runs on 10-26:
- in a detached worktree of main `c7bdad7a`: a copy of zoomOf with trim, radius and label switches, and the pair branch;
- in one of #332 `dc19a3bd`, with main's zoom/qa files: renegade_row's full LB7 QA.

Nothing was committed. The numbers are for the card's tests to pin again on the builder's base.
