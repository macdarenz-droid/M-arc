# Held 6: routes for the rows with no ruled route (draft for the supervisor)

Draft, 2026-11-01. Nothing pushed or posted.

**Base.** main `5bcbddcf`; lib4-cards = `docs/supervisor/verify/lib4-cards.md` on `claude/sup-lib4-cards` `7d93173b`
("lib4"); research head `claude/libht-research`. Paths without a prefix are under `tools/plates/library/` on main.

**Rules used**
- Bars: Trace 22.11 px, deviation 11.39 px (qa/envelope.json:12-13).
- Zoom circle: r 52, 6 px gap, 8 px margin, 44 px meta band, k 1.5-4 (zoom/inline.mjs:15). The place search scans the
  whole plate on a 2 px grid (inline.mjs:139-150).
- A zoom is allowed only on a view that fails at plate scale (qa/zoom.mjs:117, :122-123). Its bar is met at the
  zoom's own scale (:118, :125), and its source ring must hold the tell in both poses (:126).

**Method.** All numbers come from scratch runs on a detached worktree of main; the scripts were never committed.
- Each variant was built as a one-plate page and run through `runQa` with both halves, node and browser (authoring, no
  exemptions), as the lane QA does (lb9/qa.mjs:14-24).
- "All hard checks pass" means 10 of 10, except `H7.determinism`. That one is a scratch artifact: H7 rebuilds the
  spec file from disk, which a variant does not edit, and it never fires on an unchanged spec.
- Leader entries are measured as lb9-plates.test.ts:1296-1302 does: px inside a figure, past the leader's first 8 px.

**Out for every row (brief item 4).** These loosen a check:
- kMax above 4;
- a circle smaller than r 52 (it changes ZOOM.r, inline.mjs:15);
- a lower bar, or a QA exception (SMITHZOOM was withdrawn as one, lib4:4590);
- a size picked for H3 ("PQ-H3 is never a basis", lb10/sizes.json `rule`).

LIB-SPINE segments with the D-LB9R3 split, applied as -12 × SPLIT, were measured on the three arch rows. They release
none: hip_thrust `arch` 2.70 px, pallof_press 0.53 px, resisted_hip_flexion `lean` 3.67 px. The split is also sourced
for flexion only (lb9/DESIGN.md:496-511).

## 1. hip_thrust

**Blocker.** D-LIB18-RINGKEEP: no tell reaches 11.39 px at k ≤ 4 (lib4:4445; lb8/DESIGN.md:671, :797).
- Re-measured: `arch` (backMid→sacrum ½, hip_thrust.mjs:227) moves 1.870 px, and `ribs` (:228) 1.377 px. At k 4 that
  is 7.48 px, red. lb8/DESIGN.md:671's "2.3 px" is stale.
- Node and browser QA give one red row: H3.deviation.

| route | measured | verdict |
|---|---|---|
| **A. Bow.** The Mistake is the end pose plus `trunk: { flex: 0, bow: 12 }` (D-SPINE-BOW, vendor body.mjs:141-176), the method approved for reverse_lunge (reverse_lunge.mjs:89, :136, :139; mx18, lib4:4576). `arch` sits on `lumbar`, with a Mistake zoom. | `lumbar` 4.104 px. k 3 gives 12.31 px; k 2.5 gives 10.26 px (red). Ring at (270,174). All hard checks pass. `ribs` 1.86 px. The `arch` leader enters the figures 16.33 / 17.82 px; main's already enters 21.70 / 25.04 px. | **proposed** |
| B. `arch` on `lumbar`, Mistake unchanged (single pivot) | 2.956 px. k 4 gives 11.82 px; k 3.5 gives 10.34 px (red). All hard checks pass. | not proposed. The single-pivot `lumbar` is a pelvis point (body.mjs:22). Swapping lb8q's surface point for it because it moves more is what D-LIB18-ROUND refused (#306 6355447835 Q3). |
| C. Another tell | `ribs` 1.377 px. The head moves 5.74 px but is not the named part. | no |
| D. A box move or a wider place search | The zoom already finds a place at every k: (292,202) on main. Size blocks, not place. | no |

**Ruling needed.**
1. The hip_thrust arch is drawn as `trunk.bow` M_ARCH 12 (D-A3-REVBOW form). The thorax, bar and feet stay at the end
   pose, and backUpper stays on the edge.
2. `arch` goes on `lumbar`, with a Mistake zoom at k 3.
3. `ribs`: either drop it, with a one-tell record and "ribs" kept in the cue (as reverse_lunge.mjs:136 does), or keep it
   at 1.86 px. The supervisor picks.

Build notes:
- barIn's cache key needs a number trunk (hip_thrust.mjs:121), so it must accept the object form.
- Every pose must use the object form (D-SPINE-MIX, vendor plate.mjs:41-42).

Risks:
- The lb8q R4/R11 points come back. Mitigation: the ring now sits on the lumbar dip the critics asked for.
- The card's "ribs up" is no longer a thorax turn. Mitigation: the panel approved reverse_lunge's bow, which shows "the
  ribcage flares" with the thorax held.

## 2. resisted_hip_flexion

**Blocker.** `lean` 2.7 px, `arch` 5.1 px; "with the Mistake zoom at its only free disc (288,138), no placement of its two
boxes passes" (lb8/DESIGN.md:672, :798).
- Re-measured: `lean` (backMid, resisted_hip_flexion.mjs:235) 2.744 px; `arch` (sacrum, :236) 5.088 px.
- With the boxes as drawn, zoomOf finds no place at any k, in either view.
- QA gives one red row: H3.deviation.

| route | measured | verdict |
|---|---|---|
| **A. `lean` on `head`**, box {236,60}. Approved "Leaning back" tells sit on the head: kettlebell_swing.mjs:137 (lb10/DESIGN.md:442) and chest_supported_row.mjs:117. | 15.379 px, which passes at plate scale with no zoom. All hard checks pass. Leader 56.1 px, 0 px into either figure. A box scan finds 10 clean boxes in F3's range. | **proposed** |
| B. `lean` on `backUpper` | 3.256 px; the balance re-solve moves the hips forward 5.09 px | no |
| C. Bow | A held thorax removes the lean, which is the card's first sign (handlingMistakes[0]). | no |
| D. A Mistake zoom on `arch` | Main has no place at any k. The scan found that both boxes would have to move, which is outside D-LIB18-ZOOMPLACE's one box (lib4:4412). | no |

**Ruling needed.** Read #306 Q10.9 ("`lean` … on the part the claim names, never chosen by H3"): "Leans back" (c7) names the
leaning upper body, anchored on the head as for kettlebell_swing. lb8/DESIGN.md:607 already said so before H3 was
measured ("the sign is the trunk's lean").
- Risk: this reads as chosen by H3, since backUpper fails. Mitigation: two approved plates use the same words, and
  kettlebell_swing uses the same 12° convention (lb10/DESIGN.md:367).

## 3. pallof_press

**Blocker.** D-LIB21-PALLOFHOLD (lb9/DESIGN.md:311) has two halves. S2: the arch moves 1.03 px. S4: the side view hides
the sideways cable.
- The zoom would need k ≥ 11.1 (lb9/DESIGN.md:419-421). F-RESEARCH-2 found no sourced size (lib4:4489).
- Re-measured: 1.026 px, so k 4 gives 4.10 px. QA gives one red row: H3.deviation.

F-RESEARCH-2's result (research `docs/research/howto/verify/lb9.md:322-323`):
- Q1(a): no source gives a size.
- Q1(b) is ANSWERED by **c20** (FitnessVolt, no size): "lift the chest and extend the lumbar spine … bring the lower ribs
  over the pelvis".
- c20 is on the research card (cards/pallof_press.json:501). Main's copy ends at c19.

| route | measured | verdict |
|---|---|---|
| **A. A second tell `chest`, "Chest lifts" (c20)**, on the `chest` landmark (the part c20 names), with a Mistake zoom. The drawing is unchanged: the move is the 12° arch's own geometry, so there is no new number. | 8.983 px. k 1.5 gives 13.47 px. Ring at (88,96) with box {100,164}. All hard checks pass. Leader 65.7 px, 0 px into either figure. | **proposed** |
| B. Bow 12, `arch` on `lumbar`, zoom k 3 | 4.104 px gives 12.31 px, and all hard checks pass. But the leader enters 14.56 / 15.77 px, which lb9 bans unless it is named (lb9-plates.test.ts:1288-1310). It needs a back-contour anchor, and it drops c20's chest lift. | fallback |
| C. The turned view (lb9/DESIGN.md:413-418, root.yaw Y) with A | At Y 30° the chest moves 8.21 px, so k 1.5 gives 12.3 px [est: assumes the fit scale stays 146.29]. The cable then shows. | compatible with A |
| D. The sternum | 11.29 px, under 11.39. c20 names the chest, not the sternum. | no |

**Ruling needed.**
1. F-PALLOF-ARCH closes on Q1(b): c20's chest lift is a second tell of the same fault. The one-tell record in
   lb9/DESIGN.md §8 is updated, and the Mistake zoom sits on that tell (D-LIBZOOM-EXTEND).
2. The LB9 lane re-copies pallof_press's card from the research head, which updates the A11 byte-copy pins.
3. S4: either accept the side view as drawn, or require §20's turned view. A works either way; the turned-view number is
   [est].

- Risk: R11, the zoom shows the chest while the plate is about the low back. Mitigation: c20 states the chest lift as the
  sign, and both tells are drawn.

## 4. jump_rope

**Blocker.** The Trace is 5.3 px, and k 4 gives 21.3 px, under 22.11 (lb10/DESIGN.md:483). It needs k ≥ 4.15 (lib4:4458).
- Re-measured: 5.32 px; k 4 gives 21.30 px, as pinned in f-zoom-2.test.ts:169-173.
- **New:** main also fails H8.ban:alt:semicolon. jump_rope.mjs:97 reads "…turning the rope; a low hop…".

| route | measured | verdict |
|---|---|---|
| **A. A pointed foot in the air.** The end ankle is -10°, box_jump.mjs:118's flight ankle on an approved plate (the standing ankle is +10.6°). The lowest foot point stays at HOP 3.8 cm, and the Mistake's at M_HOP 15 cm. Basis: c11 "A basic jump comes from the ankles" and c10 "landing softly on the balls of the feet". | The sole.r Trace is 9.37 px. A normal zoom at k 2.5 gives 23.41 px; k 2 gives 18.73 px (red). The source ring closes inside the frame (D-LIB22-RINGFIT). The Mistake stays at 16.38 px. With the alt's ";" rewritten, all hard checks pass. | **proposed** |
| B. HOP 2 in (c9's top) | not measured | no: the HOP basis is the midpoint (lb10/sizes.json:402-406), and H3 cannot be a basis |
| C. A camera scale above 146.29 (F1 named) | not measured | no: the scale would be picked for H3. russian_twist's F1 was named for F2 cover (lb9/DESIGN.md:450-452). |
| D. Another trace point or view | The whole foot lifts by HOP in any view. | no |

**Ruling needed.**
1. The airborne frame (D-LIB22-AIRBORNE, lb10/DESIGN.md:142-145, "box_jump's method") takes box_jump's flight ankle -10
   under c10 and c11. It becomes a new lb10/sizes.json row, fixed before H3. HOP stays the lowest point.
2. The alt loses its semicolon.

- Risk: this reads as a new number added for H3. Mitigation: its basis is a card claim plus an approved plate's value,
  which are D-LIB22-SIZE basis kinds. The hop height is unchanged, and k is the smallest step that passes.
- If the pointed foot is ruled not card-true, the row goes on the named list at the RC (S4 form).

## 5. cable_rear_delt_fly

**Blocker.** The shoulder roll moves 4.4 px, and no r 52 circle fits at any k (lb7/DESIGN.md:408; D-LIB17-RDFHOLD,
lib4:4450, :4457).
- Re-measured: `roll` and `up` move 4.389 px (cable_rear_delt_fly.mjs:157-158). zoomOf finds no place at any k, in
  either view.
- An ink-only scan, with labels and leaders ignored, finds no place for r 52 plus the 6 px gap. The widest ink-free disc
  holds a circle of **r 40** at most, at (106,200), in both views.

| route | measured | verdict |
|---|---|---|
| A box move (D-LIB18-ZOOMPLACE) or a wider search | Ink blocks, not labels, and the search already covers the whole plate. | no |
| A smaller camera scale inside F1 (down to 123.91) | The columns and the figure shrink with the scale, but the circle stays r 52 px [est: no gain] | no |
| A larger sourced Mistake (M_ELEV and M_PRO are 3 cm by convention, pull_up.mjs:36) | Size is not the blocker: 4.39 px would pass at k 3, giving 13.2 px [est]. | no |
| Another card fault: [0] the swing (not drawable from the front, per the card's plate.mistake.why) or [2] elbows locked or bending (c4, c6, no sourced size) | It needs a CARD-V2:36 "drawable" ruling, an LR-31 re-pick and research. | not proposed (long) |

**Proposed: the named list at the release candidate (S4 form, D-LIB18-CALF-S4, lib4:4370-4372).** The reason: the
card-true fault is 4.39 px, under 11.39 px. Neither view has an ink-free place for the r 52 circle (the widest fits
r 40), so no zoom works within the rules. Renders: `lb7/build.mjs --held`.

## 6. russian_twist

**Blocker.** D-LIB21-RTWIST and F-RTWIST-TELL (lb9/DESIGN.md:313, :484-488; lib4:4488).
- Option 1, a Mistake zoom, gives H3.zoom:not-needed. Option 2, a larger pelvis turn, has no solve above 0.8.
- #326 6409808767 refused (a), a 52.21 / 41.22 px front entry, and (b), the shin anchor.
- Re-measured, node and browser QA on main:
  - H6:no-card: the card has no plateFacts, tempo or topFault. Do 7b is pending (lb9/DESIGN.md:472).
  - The tell is still on the refused shin point (russian_twist.mjs:136).

| route | measured | verdict |
|---|---|---|
| **A. "Knees swing" on the red RIGHT knee's outline** (knee.r + [-6.84, -6.84] px), box {12,188}. That knee carried the approved entry before the arm fix (lb9-plates.test.ts:1293; lb9/DESIGN.md:445). | Leader 78.0 px. It goes 3.42 px into the end figure, 6.84 px into the Mistake figure and 0 px into the ball. Deviation 23.64 px. Every hard check passes except H6:no-card. | **proposed** |
| The red left knee's outline, every box (16 points, 8 px grid, F3's range) | No clean box. The least entry is 0 / 21.09 px, into its own red leg. | no |
| A larger pelvis turn, share 0.5 to 1.5 | The red left knee stays within 22.9 px of the ball's centre, and the ball's radius is 22.7 px, so it never clears the ball. | no |
| LIB-SPINE `trunk.yaw` segments | The knee's place depends only on root.yaw and the legs (russian_twist.mjs:78-80). | no |
| Camera pitch 20 to 50 | The red left knee stays 0-7 px from the ball rim [est: ball r 0.115 m] and 8.5-14.1 px from the forearm's axis. | no |

**Ruling needed.** Sign a named front entry for "Knees swing" on the red right knee: 3.42 px into the end figure and 6.84
px into the Mistake figure. That is the D-LIB18-LIFT form already approved for this tell at 15.94 / 13.95 px (#326
6405804435 item 4). Then come the Do 7b card fields with CARD FIELDS, and a panel round.
- Risk: the red right knee sits partly behind the solid knees and may not read. Mitigation: the entry is smaller than the
  one already approved, and the panel judges R4.

## Summary

| row | route | rows released | ruling | effort [est] |
|---|---|---|---|---|
| hip_thrust | A: bow 12, `arch` on `lumbar`, Mistake zoom k 3 (12.31 px) | 1 | D-SPINE-BOW for hip_thrust's arch; `ribs` kept or dropped | 3 h + 0.75 h QA + panel |
| resisted_hip_flexion | A: `lean` on `head`, box {236,60} (15.38 px, no zoom) | 1 | Q10.9 reading: "Leans back" on the head (kettlebell_swing precedent) | 1 h + 0.75 h + panel |
| pallof_press | A: c20 `chest` tell, Mistake zoom k 1.5 (13.47 px) | 1 | close F-PALLOF-ARCH on Q1(b); re-copy the card; S4 side or turned view | 2 h (+2 h turned) + 0.75 h + panel |
| jump_rope | A: airborne ankle -10 (box_jump.mjs:118), normal zoom k 2.5 (23.41 px), alt fix | 1 | the airborne ankle under c10/c11 | 2 h + 0.75 h + panel |
| cable_rear_delt_fly | named list at the release candidate (S4 form) | 0 (decided at the RC) | put it on the named list | 0.25 h |
| russian_twist | A: tell on the red right knee, named entry 3.42 / 6.84 px | 1, after Do 7b | sign the entry | 1 h + Do 7b and CARD FIELDS + 0.75 h + panel |

Lanes [est]: one LB8 resume (hip_thrust, resisted_hip_flexion), one LB9 resume (pallof_press, russian_twist), and
jump_rope with the next LB10 or LIB-SMALL resume. Up to 5 rows are released and 1 goes to the named list. Every route
still needs its panel round.

## Supervisor rulings (11-01 ~02:30 UTC; status `ready`, queued for slots)
- **D-HELD6-HIPTHRUST:**
  - The arch is drawn as `trunk.bow` M_ARCH 12 in the D-A3-REVBOW form. The thorax, bar and feet stay at the end pose, and backUpper stays on the edge. 12 is listed as an unsourced drawing size (the convention reverse_lunge's approved bow uses).
  - `arch` goes on `lumbar`, with a Mistake zoom at k 3 (12.31 px, the smallest passing rung).
  - **`ribs` is dropped**: a one-tell record, with "ribs" kept in the cue, as reverse_lunge.mjs:136 does. A 1.86 px tell does not read.
  - Every pose uses the object trunk form (D-SPINE-MIX).
- **D-HELD6-RHF:** "Leans back" (c7) names the leaning upper body, so the tell goes on `head`, box {236,60}, 15.38 px with no zoom. This is the kettlebell_swing and chest_supported_row form. Under #306 Q10.9 it is the part the claim names, and lb8/DESIGN.md:607 chose it before H3 was measured, so H3 did not choose it.
- **D-HELD6-PALLOF:**
  - F-PALLOF-ARCH closes on Q1(b). c20's chest lift is a second, sourced tell of the same fault. The one-tell record in lb9/DESIGN.md §8 is updated, and the Mistake zoom at k 1.5 (13.47 px) sits on that tell.
  - The LB9 lane re-copies the card from the research head, so the A11 pins move, and CARD FIELDS covers any key that changes.
  - **The side view stays as drawn.** The turned view's number is only [est].
- **D-HELD6-JUMPROPE:** the airborne frame takes box_jump's approved flight ankle of −10° under c10 and c11 (D-LIB22-AIRBORNE, "box_jump's method"), as a new lb10/sizes.json row whose basis is the claim plus the approved plate. HOP stays the lowest point. The normal zoom is at k 2.5 (23.41 px), and the semicolon comes out of the alt. If the panel finds the pointed foot is not card-true (R1), the row goes to the named list (S4).
- **D-HELD6-RDF:** cable_rear_delt_fly goes on the **named list at the release candidate** (S4 form): no zoom place exists (only r 40 fits, and r 52 is needed). It is never enlarged.
- **D-HELD6-RTWIST:** the named front entry for "Knees swing" on the red right knee is signed at 3.42 / 6.84 px, the D-LIB18-LIFT form. It is smaller than the 15.94 / 13.95 px entry approved in #326 6405804435 item 4. Then Do 7b card fields, CARD FIELDS and a panel round.
- **Lanes, each started when a LIB slot frees, after LIB-SUPCORE:**
  - **HELD-A** (LB8 resume, then lb10): hip_thrust and resisted_hip_flexion, and jump_rope once #358 has merged.
  - **HELD-B** (LB9 resume): pallof_press and russian_twist. It goes before SUPCORE's wave 2 writes lb9; whichever lane is second merges main first.
