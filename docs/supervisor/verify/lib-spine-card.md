# LIB-SPINE: spine segments, a lumbar bow and pitched depth order in the vendored engine

Card, 2026-10-31 (merges F-SPINE-1, F-REVLUNGE-ARCH and F-ENGINE-PITCHDEPTH). Status `ready`. The supervisor confirmed every D-SPINE-* ruling below as written (lib4-cards §48). Start on 'LIB-SPINE start', after train 48 (#347) merges.

Sources (every file:line was read at these heads; [est] marks an estimate):
- main `151de0b8` (train 47). The vendored engine is byte-identical on train 48's head `1f024b1f` (#347 = F-ZOOM-PITCH #342 + LB4 #289), so vendor lines are the same on both. Library lines marked "#347" are on `1f024b1f`.
- claude/sup-lib4-cards `8870cc7e` (lib4-cards.md); claude/sup-handover-1445 `9e69aebd` (HANDOVER.md, verify/PANELS.md); claude/howto-options `c35e0a45` (the engine source: body.mjs, plate.mjs and SPEC.md have the same blobs as vendor, checked).
- #340 @ `4dc78aad` (reverse_lunge's held spec); #340 comments 6534832450, 6538120823, 6538237946, 6539264024; #326 6409858442 and 6409862229 (bicycle_crunch).
- The scratch run (below) was on a detached worktree of `1f024b1f`. Its engine diff is reference only, never applied as is: docs/supervisor/verify/lib-spine-scratch.diff on this branch. Make the edits at the source (Do 3).

id: LIB-SPINE
model: claude-opus-5-5 (an edit to locked engine files; the default-path proof and the mutation design need judgement)
mode: auto
title: 'Builder: LIB-SPINE engine fields (spine segments, lumbar bow, view depth)'
branch: claude/lib-spine (new, from the latest main, which must contain train 48). The first push opens a draft PR '[golden update] LIB-SPINE: three opt-in engine fields, no approved byte moves'.
lane: one LIB slot under D-LIB-LANE-ACTIVE (lib4-cards:1023). It is an engine card and draws no exercise. It merges before the lane resumes that use it: reverse_lunge's redraw, then LB9's cable_crunch. The supervisor names the checklist slot in 'LIB-SPINE start'.

## Why now
- 9 held rows have no route but this card (held inventory §5, rows A and B):
  - reverse_lunge was held after three panel rounds (D-LIB8M-CARDTRUE; #340 6539264024). The 12° arch draws as an upper-trunk shift. Route F-REVLUNGE-ARCH (lib4-cards:4487).
  - cable_crunch (D-LIB21-CCHOLD, lb9/DESIGN.md:309): the curl folds at the one lumbar pivot. The chord is 67.5 px at the end against 138.2 px at the start, at 780 px.
  - bicycle_crunch (D-LIB21-BICYCLE, lib4-cards:4435): the front draw order sorts by world z (body.mjs:297-298, :366-367), and the elbow stays far from the opposite knee.
  - Behind reverse_lunge's pin: step_up and 5 SPLIT T rows (inventory §5 B).
  - Also behind it: the sheets of three approved rows, bayesian_cable_curl, dumbbell_overhead_triceps_extension (lb5/DESIGN.md:359) and cable_chest_press (lb6/DESIGN.md:431).
- The engine draws the trunk from one pivot only:
  - `Lw = pelvis(REF.lumbar)`, then `thorax = Lw + Rt·(r − lumbar)` (body.mjs:22, :126-128);
  - the outline blends linearly from the pelvis to the thorax between 0.60 and 0.66 H (:132-139).
- It is the longest job of the three next cards, so it starts first (inventory §6 row 3).

## Vendor change (for D-SPINE-VENDOR)
No layer outside vendor can do this:
- renderPlate imports `fk` and `bodyShapes` from its own body.mjs (vendor plate.mjs:5) and calls them in drawPose (:50-52).
- Every page builder and the zoom circle render through that vendored renderPlate (zoom/inline.mjs:9; library/engine.mjs:3 re-exports vendor body.mjs).
- The front groups are decided inside bodyShapes (body.mjs:296-304) and volumeTrunk (:365-367). A spec reaches them only through `armsFront`.
- QA never edits the engine (qa/engine.mjs:1-3). A library wrapper would have to re-implement renderPlate.

Exact lines on main (vendor/engine; the source edits on claude/howto-options are identical):

| file:line | today | change (each runs only when its field is set) |
|---|---|---|
| body.mjs:85-86, :94-102 (trunkN, normPose) | `trunk` is a number or `{ flex, yaw, lat }` | Also accept arrays for `flex`, `yaw` and `lat` (one entry per spine pivot) and `bow` (deg). `q.trunk`, `trunkYaw` and `lat` stay numbers (the sums), so plate.mjs:323 `r1(q.trunk)` keeps working. |
| body.mjs:120-130 (fk frames) | one pivot, Rt = Rp·rotX(flex)… | Segments: rotations about the pivots `SPINE_PIV` (H, on the spine line z = REF.lumbar[2]), composed from the top pivot down. Bow: the pelvis frame takes `rotX(bow)`, and the thorax keeps the frame without the bow. |
| body.mjs:132-139 (skin) | linear .60–.66 blend | Segments: each pivot turns over ±`SPINE_HW`. Bow: a smoothstep blend between the pelvis and thorax transforms over `BOW_ZONE`. |
| body.mjs:155 (fk return) | — | Add `spine` (the outline map). `L` and `Rt` keep `thorax(r) = L + Rt·H·(r − REF.lumbar)`, because cable_crunch.mjs:161 rebuilds the thorax this way. |
| body.mjs:176-179 (landmarks) | lumbar = `sk.L`; chest, backUpper, backMid on the thorax; navel on the pelvis | With a field set, lumbar, chest, backUpper, backMid and navel follow the spine map. |
| body.mjs:296-298, :307, :365-367 | world z | `opts.depth === 'view'` and the front view: depth = z·cos p + y·sin p for the leg rule (:298). The volume trunk is 'chest' only when it is nearer than the nearest knee (:366). The arm rule (:297) is unchanged. |
| plate.mjs:52 (drawPose) | opts `{ armsFront, hand, torso }` | Add `depth: spec.depth` and `pitch` read from the spec, not the camera. The fit path rebuilds camCfg without `pitch` (plate.mjs:107). |
| plate.mjs:28-36 (mistakePose) | D-LIB20-TRUNK throw | Throw on a mix of the number and array forms across start, via, end and Mistake, and on a `bow` without the object form (D-SPINE-MIX). |
| SPEC.md | — | One line per field: its default, its view scope and the merge rule. |
| exercises/_test_spine.mjs (new) | — | One engine test spec that uses all three fields (D-SPINE-FIXTURE). |

## Write scope
(a) claude/howto-options, `docs/howto/technical-plate/` only: engine/body.mjs, engine/plate.mjs (the rows above), engine/SPEC.md, and new exercises/_test_spine.mjs. One `[golden update]` source commit; a review fix is a new source commit. Never rebase, amend or force-push.

(b) claude/lib-spine:
- tools/plates/vendor/: the byte copies of (a), and their MANIFEST.json entries (source, sha256, gitBlob);
- tools/plates/pins.json: one `vendorSources` entry and its message;
- tools/plates/golden.mjs: the probe list at :228 only;
- tests/howto/golden/ref-fixtures/_test_spine.{n,m}.html (new, written from the probe);
- the literal pins, moved to their new true values only: vendor.test.ts :36, :47 and the list sha256; golden.test.ts :136-139; library-core.test.ts :134;
- the generated files' header and `hashes:` lines (generate.mjs);
- tools/plates/library/MANIFEST.json: closure hashes only, in the `[golden update]` commit;
- new tests/howto/lib-spine.test.ts;
- docs/COACHING-DECISIONS.md: the D-SPINE-* entries;
- docs/evidence/lib-spine/*.png: _test_spine, normal and Mistake, in Paper and Silent Black;
- the PR body.

Never:
- any spec on any branch: reverse_lunge, cable_crunch and bicycle_crunch are their lanes' work;
- pilot-a2/**, lb*/**, zoom/**, qa/** (none needs an edit: the zoom circle keeps top-level spec fields and the pitch, #347 inline.mjs:154);
- tools/plates/layers/** (golden B's separate engine copy), and every existing ref fixture;
- tests/howto/golden/library/**, GOLDEN.json, qa/envelope.json, scripts/screenshot-gate.mjs;
- .github/**, src/** (except the generated header lines), package*.json, escobar-worker/**.

No threshold, bar, the k ladder, the house gap or any check (H1-H10, F1-F7, H3/H3.zoom) changes.

## Do
1. Start on 'LIB-SPINE start'. Record the baseline in the PR body:
   - golden A L1 `e2bea90c…cf48` (860,766 B), which pages/golden-a.json rebuilds;
   - the page shas: pilot A `5d0e562f51ddbbeb0ebcf16fb80c121b5a783d7a421575ec2f84ecffa1bd5ba8` (1,325,644 B) and pilot B `ff3e017c98f73b6d049808a6ffea057a7fa350eed764d9ceedb9a582fa22583f` (409,765 B), both from `scripts/howto-rebuild.mjs --page`;
   - every lane page main builds (lb1-lb10, zoom, strip; pilot-a2 if #340 has merged);
   - the 56 ref fixtures;
   - C0 [] and `generate --check` clean.
2. Write the design note in the PR body before any engine edit: the three fields, each one's default path, and the pivots and zone with their basis (D-SPINE-SEGS, D-SPINE-BOW).
3. Make the edits at the source (a). Then re-vendor in one commit, `[golden update] LIB-SPINE: engine fields re-vendored`, following lib-20-card.md's vendoring path steps 3-8 (LIB-20 `3fe48018` is the precedent). The library MANIFEST.json re-pin joins that commit.
4. Write the tests below, each with its red mutation.
5. Repeat the scratch measures on the head (A8) and post them. They are evidence for the lanes, not gates.
6. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` detached, with logs. Merge origin/main with a merge commit, re-run A1 and A7, then post 'LIB-SPINE READY @ <sha>'.

Stops (post on the PR and wait):
- S1 An approved byte moves (A1).
- S2 A seventh field, or any need to edit layers/**, qa/** or zoom/**.
- S3 A check would have to move to pass.
- S4 Two failed tries of one approach with no new evidence.

## Acceptance
| # | Row | Evidence | Red mutation |
|---|---|---|---|
| A1 | No approved byte moves | Before equals after for golden A L1, the pilot A and pilot B pages (shas above), every lane page main builds, the 56 ref fixtures, and every spec's renderPlate output (svg, overlay and report) for normal and Mistake. The scratch got 222/222 equal on `1f024b1f`. | Turn view depth on for every pitched front view instead of the flag: `_test_pitch.n`/`.m` go red (scratch: DIFF). |
| A2 | Segments reduce to the single pivot | `trunk: { flex: [0, θ, 0, 0], yaw: [0, ψ, 0, 0] }` gives every thorax, arm, head and leg landmark within 1e-9 m of `{ flex: θ, yaw: ψ }`, for θ ∈ {−30, 12, 45, 90} and ψ ∈ {0, 30}. The scratch gap was 3.2e-16 m. | A pivot at 0.63 instead of REF.lumbar 0.62: red. |
| A3 | Bow holds the thorax | `bow: b` against the same pose without it: hips, knees and feet move ≤ 1e-9 m. Head, shoulders, sternum, chest and backUpper move ≤ 1e-9 m. Sacrum and buttock turn b about the hip axis. The back outline is continuous, with no gap or crossing between neighbouring section samples. | The thorax carried by the tipped pelvis: head red. A linear blend in place of the smooth one: continuity red. |
| A4 | View depth | On _test_spine (supine, front, pitch 75, 80 and 88, one knee drawn toward the chest): with `depth: 'view'` the bent thigh is in 'legs' and the volume torso in 'body'. Without the flag it is 'body', as today. | Drop the flag read: red. Compare with the mean of the knees: the torso goes 'chest' at 88 (red). Apply view depth to the arm rule: the fists behind the head go to 'arms', over the head (red). |
| A5 | Mixing throws | A number trunk in one key pose and arrays in another throw a message naming D-SPINE-MIX, and so does `bow` with a number trunk. | Remove the throw: red. |
| A6 | New fixture | `_test_spine.{n,m}` are probe renders committed byte for byte. golden.mjs `--check` passes, and PRIMITIVES coverage is unchanged. | Edit one fixture byte: red. |
| A7 | Pins | C0 is [] after the re-pin and red before it. `generate --check` passes. verifyVendor is clean. Each literal pin is listed old → new. | Revert the MANIFEST commit: C0 red. |
| A8 | Lane numbers on the head | The table below, re-measured. | — |
| A9 | Checks | check, test:tz and gate green locally; CI green on the head that contains main. | — |

## Measured in scratch (`1f024b1f`, plate px at 146.29 px/m unless marked; bars: deviationMin 11.39 px, traceLenMin 22.11 px, qa/envelope.json:12-13; zoom k 1.5–4, zoom/inline.mjs:15; inside the zoom H3 uses k × deviation, qa/zoom.mjs:65)

| row | today | with LIB-SPINE | released? |
|---|---|---|---|
| reverse_lunge (Mistake: M_ARCH 12, M_TILT 12, reverse_lunge.mjs:89-90 on #340) | Single pivot: head, chest, backUpper and shoulder all shift 5.27 px (≈11.5 px at 780; the critics' "about 10 px", 6539264024). | Spreading the 12° over rigid segments does not fix it: the upper body still shifts 4.31–5.97 px. A rigid chain that holds the thorax needs wrapped angles (±370–410°): impossible. **`bow: 12`** (pelvis tips 12° under the held thorax; zone 0.585–0.70 H) puts head, shoulder, chest and backUpper at 0.00 px. Moves: backMid 0.70, waist back edge (lumbar 4.10; contour at 0.615 H 4.39), navel 4.65, sacrum 4.28, buttock 4.30; hips, knees and rear toe 0. H3 at plate scale ≤ 4.65 < 11.39, so it needs the zoom: waist back edge × k 3 = 12.3–13.2 px (k 2.5 = 10.3–11.0 fails), navel × k 2.5 = 11.6. The current anchor (sternum→lumbar t 0.7) gives 2.87 px (k 4 = 11.5). | **Yes, to its lane:** redraw the Mistake with `bow: 12` (M_ARCH = M_TILT = 12 unchanged), the tell at the waist's back edge, and the smallest passing k (3 expected). |
| cable_crunch (end curl solved to ELBOW_GAP, cable_crunch.mjs:202-204) | Single pivot: end/start hip–shoulder chord 0.489 (73.6/150.6 at 780/358; the panel's 67.5/138.2 is the same ratio). Back sagitta 18.3 px at 780; trace 58.3 px. | Per-segment flex over 4 pivots (L5/S1, L3, T12, T7), TRUNK_END re-solved (100.7–104.9°). Split 0.15/0.2/0.3/0.35: chord 0.588, sagitta 29.3, trace 28.0. Equal split: 0.564, 27.5, 37.2. Split 0.35/0.3/0.2/0.15: 0.546, 25.0, 47.7. In every case H3 (hips) is 27.9–30.9 px, the rope clears ≥ 0.23 cm, and report issues are []. The render reads as a rounded C curl, not a fold (my look; the panel decides). | **Yes, to 'LIB-21 resume':** redraw the end with a sourced split (lb9/sizes.json, D-LIB17-SIZE). The trace must stay ≥ 22.11. |
| bicycle_crunch (no spec) | World-z order: at pitch 75/80/88 the bent knee's thigh is in 'body', under the trunk (knee−hip −0.298 m in z). | `depth: 'view'`: knee−hip +0.164/+0.194/+0.239 m. The thigh moves to 'legs', drawn over the trunk at 75, 80 and 88, with the nearest-knee chest rule. The mean rule put the torso in 'chest', over the knee, at 80 and 88. The fists stay behind the head. Reach (elbow.r–knee.l joint centres): single 0.366 m against spread 0.377 m (curl ≤ 40, yaw ≤ 45, hip ≤ 120), and 0.183 against 0.181 m at the grid's limits (curl 70, yaw 70, hip ≤ 140). | **No.** The depth order fixes the far-limb overlap, but the spine segments do not close the reach, so the remaining blocker is not an engine limit. It stays held; route **F-BICYCLE-REACH** (D-SPINE-BICYCLE). |

## Rulings recorded (confirmed by the supervisor, 2026-10-31)
- **D-SPINE-VENDOR:** the three fields go into the vendored engine by LIB-20's vendoring path, for the reasons and at the lines above. No approved byte moves, so no owner session is needed (lib-20-card.md, plan 3.5).
- **D-SPINE-OPTIN:** every field is opt-in.
  - An array `flex`, `yaw` or `lat` turns on the segments; a number keeps the single pivot.
  - `trunk.bow` turns on the bow.
  - The top-level spec field `depth: 'view'` turns on view depth. It is top level so that the zoom circle (#347 inline.mjs:154) and the fit camera (plate.mjs:107) keep it.
  - Why not default view depth on for every pitched view: it changes `_test_pitch`'s golden ref fixtures and the rear-delt fly alt (pitch 15, volume). Measured: DIFF on both. dumbbell_fly (45) and russian_twist (20) did not change.
- **D-SPINE-SEGS:** the pivots are 0.60 (the default blend's start, body.mjs:134), 0.62 (REF.lumbar, :22), 0.68 (backMid, :179) and 0.75 (backUpper, :179), with SPINE_HW 0.015 [est; the builder states the basis in SPEC.md].
  - The split between pivots belongs to the spec. It is a lane size with a basis, never an engine constant.
- **D-SPINE-BOW:** reverse_lunge's arch is `trunk.bow`, a pelvis tip under a held thorax. Rigid segments cannot hold the thorax (measured above).
  - BOW_ZONE runs from 0.585 (the sacrum landmark, body.mjs:179) to 0.70 [est].
  - The blend shears the lumbar outline by about the base's 2 cm move [est], the same kind of blend as the engine's .60–.66 one (:135).
- **D-SPINE-MIX:** in the D-LIB20-TRUNK form (plate.mjs:28-36).
- **D-SPINE-FIXTURE:** one new engine test spec, `_test_spine`. It is front view, supine, `depth: 'view'` at pitch 80, with segments in the end pose and a bow in the Mistake, so one fixture pair pins all three.
- **D-SPINE-REVLUNGE-ROUTE:**
  - If PILOT-A2 (#340) is not yet pinned, reverse_lunge's redraw runs in LIB-8R's lane and rejoins PILOT-A2 as a first entry.
  - If PILOT-A2 is already pinned, it becomes a one-row batch PILOT-A3 (first entries, approvedBy supervisor). It never becomes a second PILOT-A2 page entry, which needs approvedBy 'owner' (golden.mjs:156-160).
  - step_up's resume (LB4) and the SPLIT T card follow its pin.
- **D-SPINE-BICYCLE:** bicycle_crunch stays held. The next LB9 resume writes F-BICYCLE-REACH, a design note with the measured reach and the pose limits, and the supervisor rules what c5's "nears" means as a drawn gap. No check is loosened. It uses `depth: 'view'` from this card.

## Golden update scope
- **Changes (lock files only):**
  - vendor MANIFEST.json (body.mjs, plate.mjs, SPEC.md, the new _test_spine.mjs);
  - pins.json `vendorSources`;
  - the golden.mjs probe list;
  - new ref fixtures `_test_spine.{n,m}`;
  - the generated header and `hashes:` lines;
  - library MANIFEST.json closure hashes for all 17 pinned rows (13 pilot A, 4 pilot B), plus PILOT-A2's rows if #340 pins first (collision rule, HANDOVER:1080).
- **Unchanged:**
  - golden A (L1), golden B, every existing ref fixture;
  - pilot A and pilot B pages and their batch goldens;
  - GOLDEN.json, every lane page.
- Commits that touch goldens carry "[golden update]" (HANDOVER:421-428).

## Panel route afterwards (PANELS.md §1)
- This card draws no plate, so it gets no panel. The _test_spine PNGs are evidence only.
- Each lane resume posts 'PLATES READY' and gets a calibrated §1 panel: hidden anchors pull_up and lat_pulldown (D-LIB14-ANCHORS), 2 plants, one fix round, then a focused recheck. A second fail holds the id (D-LIB8M-CARDTRUE).
  - reverse_lunge: target items R5 and R11 (its three failed rounds).
  - cable_crunch: R1, in the LB9 resume's set (D-LIB13-PANEL2; R2 and R7 fixes kept, lb9/DESIGN.md:309).

## Risks and mitigations
- **An approved byte moves on the default path.** A1 is a full byte proof, S1 stops the work, and the code-path guards run only when a field is set.
- **A MANIFEST collision with train 48 or #340's pin.** Merge main before READY and re-pin in the same `[golden update]` commit (HANDOVER:1080). C0 is checked at every head.
- **The fit camera drops `pitch`** (plate.mjs:107). In scratch the flag silently did nothing until drawPose passed the spec's pitch. A4 at a fit camera covers it.
- **Specs that rebuild the thorax from `sk.L` and `sk.Rt`** (cable_crunch.mjs:161). Both new paths keep the identity, and A2 tests it.
- **The bow reads as a low-back arch, not ribs.** reverse_lunge's tell text follows c18 ("flaring the ribcage … instead of tucking the pelvis under"). Wording is the lane's call under D-LIB8M-CARDTRUE, and the fault is never enlarged.
- **reverse_lunge's zoom ring placement.** The ring may need to move a box (D-LIB18-ZOOMPLACE). It needs k 3; if no place fits, it stays held (S3 of its lane).
- **cable_crunch's trace shortens** (58.3 → 28.0–47.7 px). The lane picks a sourced split that keeps the trace ≥ 22.11 px and never trims the bar.
- **bicycle_crunch is expected to ship.** It stays held (D-SPINE-BICYCLE). This card releases 8 of the 9 rows at most: reverse_lunge, cable_crunch, step_up and 5 SPLIT T.
- **golden B's engine copy.** tools/plates/layers/** never changes (S2).

## Forecast
- **Builder:** 6-8 Opus-hours [est] for three field edits at the source, the re-vendor, about 10 tests with mutations, the fixture, the re-pin and one full regression.
- **Review and merge:** one fresh Opus review, about 1.5 h [est], then a merge train. Nothing in the app changes, so there is no APK.
- **Lanes after it:**
  - reverse_lunge's redraw and zoom: 3-4 h [est], plus a panel round of about 1.5 h [est] and a fix round if needed;
  - cable_crunch's end redraw: 2-3 h [est], plus its panel;
  - then step_up's resume, and the SPLIT T card at about 1.5 h + 0.75 h QA per T row (plan §9).
- **Uncertainty:** the panel outcomes for reverse_lunge and cable_crunch, and the bicycle ruling. Implementation, release-candidate acceptance and store publication are tracked separately.
