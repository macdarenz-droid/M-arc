# PILOT-B2: crunch on spine segments (LIB-SUPCORE PLAN, wave 1)

Card: `docs/supervisor/verify/lib-supcore-card.md` @ `cbe90cdc` (claude/sup-lib4-cards), Do 1, with its "Supervisor
rulings" (D-SUPCORE-1 to -13 confirmed; the main-pivot fallback needs a new ruling; a PIN GO comes before the pin
commit). Research: `a48b059400a74d5c9e3aceed21cf1aa67ab6f118` (crunch's card on main is that blob, sha256 `8e45ee15…fe13`,
no three keys yet). Base: main `5bcbddcf`. Every number below was re-measured on this branch's working tree at that base
(scratch scripts outside the repo); [est] marks an estimate.

Nothing here ships. Before the pin, crunch is built from `pilot-b2/rows.json` (stage `drawing`), read as one more
batch file and never written under `batches/`. Pilot B's page stays `ff3e017c…` (A2).

## 1. Route and mode

- crunch is H, pilot B's held SUPCORE parent (pilot-b/DESIGN.md §2, §13). It is released by the spine segments and two
  zooms (D-SUPCORE-CRUNCH). No split reaches either H3 bar at plate scale (§2), so both zooms are needed in every variant.
- Pinned as the one-row batch PILOT-B2 (D-SUPCORE-PIN, §9). Pilot B's batch, page and golden files never change.
- Clone sources stay as they are in the spec (`supine()`, `bisect`, the floor camera, D-LIB9-CLONE); `bisect` and
  `supine` stay exported and unchanged (lib11-pilot-b.test.ts:197-199).

## 2. Spine split (D-SUPCORE-SPLIT)

Every key pose and the Mistake write `trunk: { flex: [L5/S1, L3, T12, T7] }` (D-SPINE-MIX). SPLIT = [0, 0, 1, 0]:

| pose | flex | note |
|---|---|---|
| start | [0, LYING.trunk, 0, 0] | the supine solve's 3.6° arch at L3, as on main ([0, 1, 0, 0] equals main's number trunk) |
| end | [0, LYING.trunk, END_CURL, 0] | the 25° curl at T12 only |
| Mistake | [0, LYING.trunk − MIS_TILT, END_CURL, 0] | pelvis tilt +MIS_TILT, taken back at L3 as on main (crunch.mjs:85-90) |

Basis: c3 ("feet, tailbone and low back stay on the mat while the upper back lifts off"; the ACE quote the card cites:
"Your feet, tailbone and lower back should remain in contact with the mat at all times") zeroes the lumbar
pivots (L5/S1 .60, L3 .62); backUpper, the blades of c4, sits on the T7 pivot (body.mjs:34, :231), so only a T12 turn
lifts the blades with the low back down. END_CURL 25 and MIS_TILT 14 stay unsourced (§8).

Re-measured (191.76 px/m; bars 22.11 / 11.39 px):

| variant | curl | blade lift cm | raw trace px | deviation px lowback / pelvis | outline under start backMid, end − start |
|---|---|---|---|---|---|
| main, L3 [0, 1, 0, 0] | 25° | 10.1 | 19.60 | 7.56 / 4.22 | +4.58 cm (8.8 px) |
| sourced .123/.341/.246/.290 | 25° | 6.3 | 12.57 | 7.54 / 4.31 | +2.57 cm |
| same, solved to 10.1 cm | 39.08° | 10.1 | 19.81 | 7.53 / 4.36 | +3.94 cm |
| c3-restricted T12/T7 .459/.541 | 25° | 2.6 | 5.98 | 7.56 / 4.22 | +0.42 cm |
| same, solved to 10.1 cm | 81.97° | 10.1 | 20.71 | 7.56 / 4.22 | +1.31 cm |
| **T12 only [0, 0, 1, 0]** | **25°** | **5.6** | **11.27** | **7.56 / 4.22** | **+0.94 cm (1.8 px)** |
| T12 only, solved to 10.1 cm | 44.29° | 10.1 | 19.97 | 7.56 / 4.22 | +1.65 cm |

- Outline metric: the lowest point of the drawn torso path (the engine's spline, sampled by qa/zoom.mjs pathPoints) at
  the plate x of the start pose's backMid, in cm above the floor line. Every row matches the card's numbers except main's
  (+4.58 here, +4.37 on the card); the card did not record its method for that row. The chosen row is equal (0.94).
- T12 only: lumbar, sacrum and buttock move 0.00 cm start → end; backUpper ends 5.62 cm above the floor (check :125).
- Plate-scale QA on T12 (no zoom): Trace 0.9 px, deviation 7.6 px. Both fail, so both zooms (§3).
- The back-curve share (D-LB9R3-CURL's window metric, 52 % at .67 H on the card) was not re-measured here; it is named
  for R1 only and is not a test (ruling 3).

## 3. Zooms (D-LIBZOOM-EXTEND, D-LIB16-ZOOMVIEWS)

`zoom: [{ view: 'normal', k: 3 }, { view: 'mistake', k: 2 }]`. Ladders on T12, smallest k first ("ring outside": the
source ring does not close inside the 358 px frame, D-LIB22-RINGFIT):

| view | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | pick | source ring |
|---|---|---|---|---|---|---|---|---|
| normal (Trace in the circle) | 6.34 ring outside | 12.21 ring outside | 17.61 | **23.24** | 28.77 | 33.82 | **k 3** | (133.22, 333.62) r 17.33 |
| Mistake (lowback on backMid) | 11.34 ring outside | **15.11** | 18.89 | 22.67 | 26.45 | 30.23 | **k 2** | (156.35, 330.34) r 26 |

- With the §4 label fixes and the §5 near hand, QA places the normal circle at (194, 206) and the Mistake circle at
  (190, 196); no H2.zoom, H3.zoom or H4.zoom key.
- The normal margin is small (23.24 against 22.11). A4 pins it; a change that drops it under the bar is S2 (hold).

## 4. Layout (D-SUPCORE-LAYOUT)

The held draft never ran full QA (pilot-b/DESIGN.md §12 stopped at the pre-check), so these reds are new findings:

| red on main's draft | fix | after |
|---|---|---|
| H1.engine:normal:figure and H1.ink:normal:blades (the 'blades' box {8, 300} on the figure) | box {56, 216}, off the figure | pass |
| H4.small:normal:chin ("Chin<br>set": hit box under 44 px) | "Chin set" on one line, box {24, 160} | pass |
| F3 (the Mistake 'lowback' tell's auto-placed leader: 156 px on main, 161.2 with both zooms) | a tell `box`, §4.1 | — |

No fact, check, cue or word changes: the chin label keeps its two words.

### 4.1 F3

PENDING (box search running).

## 5. Near hand (D-SUPCORE-CROSS)

The near (right) hand moves off the chest; the far (left) hand stays at 0.035 m. 3D gap between the forearm capsules
(the drawn taper, geom.mjs limbR on RADII.fore; min over both segments), in cm:

| near hand off the chest | start | end | Mistake |
|---|---|---|---|
| 0.035 m (main) | −8.02 | −7.21 | −7.21 |
| 0.10 m | −1.60 | −1.50 | −1.50 |
| **0.12 m** | **+0.19** | **+0.09** | **+0.09** |
| 0.13 m | +1.04 | +0.85 | +0.85 |

- Pick 0.12 m, the smallest whole-cm offset with a gap ≥ 0 in every drawn pose. It is an unsourced drawing number
  (§8). c2's quote as the card cites it (bb-crunch, "cross your arms over your chest") names no hand-on-chest contact, so the near forearm resting over
  the far one is card-true; no near-hand chest fact is written (the CARD FIELDS verify decides under the plural and
  near-side rules).
- My capsule measure gives larger overlaps than the card's (−6.19 / −5.92 cm at 0.035 m; 0.12 m gave +1.81 / +1.41 cm
  there). A6 uses this measure, which is the stricter of the two.

## 6. 2 px clearance (D-SUPCORE-CLEAR)

Floor line y 339; each drawn shape's lowest point, plate px (T12, near hand 0.12 m):

| pose | contacts (quoted) | lowest non-contact parts |
|---|---|---|
| start | torso (buttock and back) −0.16, head −0.16 (the supine solve's skull rest; c1 "Lie on your back on a mat"), feet 0.00 (c1, c3) | shank 7.80, thigh 10.80 |
| end | torso (buttock) 0.00, feet 0.00 (c3) | shank 7.80, thigh 10.80, upper arm 28.17 |
| Mistake | torso (buttock) 0.00, feet 0.00 | shank 7.78, thigh 10.67, upper arm 35.72 |

Body on body, beside each other in depth (3D gap, cm; the PILOT-A3 A9 form): fore.l|fore.r +0.19 / +0.09 / +0.09;
thigh.l|thigh.r 0.70 in every pose; fore|thigh same side 6.13 / 1.50 / 4.44, crossed side ≥ 12.0. Equipment: floor only.
No part lies in the body's own plane against another, so the in-plane rule has no pair here.

## 7. QA and expected flags (pilot-b2/qa.mjs EXPECTED)

Scratch QA on this tree (node and browser, zero exemptions; page built twice, equal):
- Hard checks: all pass except H6:no-card, expected until CARD FIELDS (the card has no three keys yet; the lb9/DESIGN.md
  form).
- Flags: F1 191.76 (D-LIB8-floor's ruled flag, crunch.mjs:31-33), F5 3.57 (D-LIB9-F5), F7 until CARD FIELDS. F3 per
  §4.1.

## 8. Card fields plan (Do 3) and unsourced numbers

- tempo: up 1, pause 1, down 2 (card plate.tempo, c12) → Curl 1, Hold 1, Lower 2 (spec :133, unchanged).
- topFault: 'lowback', the drawn Mistake key (card mistake, c6).
- plateFacts: the CARD FIELDS step proposes them from c1-c4, c7 (feet flat and on the mat, tailbone and low back on
  the mat, blades just off the floor, arms crossed over the chest); the verify decides.
- Unsourced numbers (listed in the spec header): END_CURL 25°, MIS_TILT 14°, HAND (far hand rest), NEAR_OFF 0.12 m (new),
  ELBOW_POLE, KNEE_POLE, FLOOR, and the label boxes.

## 9. Pin plan (Do 4, after 'PILOT-B2 PIN GO')

One `[golden update]` commit in PILOT-A3's form: batches/pilot-b2.json (stage approved-plate, mode H, censusRef
4a9fd86; `pages` names the three paths, and neither layers file is written), pages/pilot-b2.json,
tests/howto/golden/library/pilot-b2.json (one page and one plate entry, first entries, approvedBy 'supervisor', decision
'D-LIB-PILOTB2'), the MANIFEST row, `node tools/plates/generate.mjs`, the D-SUPCORE-PINLINES edits; pilot-b2/rows.json
deleted.

## 10. Tests (tests/howto/lib11-pilot-b2.test.ts)

A1-A8 and their mutations as the card lists; whole-page builds run in awaited child processes (D-LIB13S-RPC). The
D-SUPCORE-TESTHOME moves (lib11-pilot-b.test.ts :13, :15, :251-254, :305-309, :326-338, :439) land with CARD FIELDS,
with an old line → new line map in the PR (A12).

## 11. Held and fallback

Nothing held. If R1 fails twice on the T12 curl, the row is held under D-LIB13-PANEL2 unless the supervisor rules the
measured main-pivot fallback (zooms k 2 / k 2: 28.59 / 15.11 px). The builder never switches on its own.

## 12. Risks

- The T12 curl reads as a kink (one pivot, SPINE_HW ±0.015). Renders below for R1; an engine change is S3.
- Small normal-zoom margin (§3).
- The lifted near hand (12 cm off the chest) may read as floating; the alt names the arms crossed over the chest.
- A label move shifts a zoom place: the ladders are re-run after every box change (A4).
