# PILOT-A3: reverse_lunge on trunk.bow and dumbbell_fly F-FLY-START (RESUME PLAN)

Card: `docs/supervisor/verify/pilot-a3-card.md` (claude/sup-lib4-cards @ efa952db or newer), rulings D-A3-* confirmed as
written (lib4-cards §48). Base: #348 head `bf4b8d4d` (LIB-SPINE), until main carries train 54. This plan is rebased onto
that main before any push of drawn work. Nothing ships; rows stay at stage `drawing` in `pilot-a3/rows.json` until the
pin. build.mjs and qa.mjs are copies of pilot-a2's, never imported.

## 0. Measured again on the base (`bf4b8d4d`)

- PILOT-A3 page with the two held specs, built twice: `5c273282…9949`. This is a scratch baseline only.
- reverse_lunge, the end pose written `trunk: { flex: 0 }`, Mistake `trunk: { flex: 0, bow: 12 }`. Landmark moves
  (px):

  | landmark | px |
  |---|---|
  | head, shoulder.r, chest, backUpper, hip.r, knee.l, elbow.r | 0.00 |
  | backMid | 0.70 |
  | seat | 3.09 |
  | lumbar | 4.10 |
  | sacrum | 4.28 |
  | buttock | 4.30 |
  | navel | 4.65 |

  These equal the card's table. Against `{ flex: 0, bow: 0 }`, lumbar differs by 0 m (Low 2).
- dumbbell_fly, as held: chunk 152,973 B raw (card: 152,973); trace 85.5; deviation 4.97 px plate; zoom k 2.5 →
  12.42 px; ring (66, 256) r 52, source (52.88, 178.14) r 20.8.
- reverse_lunge, as held: chunk 128,522 B; trace 69.7.

## 1. reverse_lunge (D-A3-REVBOW, -REVTELL, -REVZOOM, -REVEXPORT)

- **Pose.** pose()'s trunk becomes `{ flex: 0 }` in start, via and end (D-SPINE-MIX). MISTAKE = the end pose with
  `trunk: { flex: 0, bow: M_ARCH }`, so the pelvis and thorax are the end pose's. M_ARCH = M_TILT = 12.
  - M_TILT's sizes basis is rewritten to the bow: "the pelvis tips 12° under the held thorax (`trunk.bow`), which is the
    12° lumbar extension". Its old "rib front forward" text is no longer true.
- **Guides.** The chest arrow goes, because the chest moves 0.00 px. No guide is added; the dashed outline and the zoom
  carry the fault.
- **Tell.** key `flare` (the topFault), text "Low back arches", anchor `{ at: 'lumbar', pose: 'mistake' }`, auto-placed.
  - Cue (11 words, ≤ 15): "The ribcage flares and the pelvis stays untucked, arching the low back."
  - Fallback if the blind pass does not answer `flare` (D-A3-REVTELL): "Pelvis untucked" on sacrum at k 3 (12.83 px),
    with a tell `box`, because auto-placed it is H1.ink red.
- **Zoom.** `{ view: 'mistake', k: 3 }`, the smallest ladder k that passes: lumbar 4.10 px gives 12.31 px at k 3 and
  10.26 at k 2.5. The source ring is centred at about (173.56, 242.31), r 17.33. It holds the elbow dot, backMid,
  lumbar and sacrum in both poses.
- **Normal plate.** The svg (`0744dcf3…`) and overlay (`cbf84381…`) bytes are unchanged. The export sha check maps a
  trunk that is exactly `{ flex: x }` to x before hashing, so the literal `026964f9…` stays (D-A3-REVEXPORT).
- **Expected flags:** F3, F4, F5.

## 2. dumbbell_fly (D-A3-FLYSTART, -FLYHAND)

- **R2, start dumbbells.** The hex rings are replaced by one dashed closed side-on silhouette per dumbbell. It has 13
  points in the x-z plane at each start grip, from the primitive's sizes (head 0.119, headLen 0.07, handle 0.13):
  - across x: ±head·0.866/2 for the heads, ±0.008 for the handle;
  - along z: ±(handle/2 + headLen) and ±handle/2.
  - Expected: 15.1 × 28.0 px, the end dumbbell's bbox; 3.4 px from the bench pad poly; 8.0 px from the drawn Trace.
- **R5, faulty hand.** One closed Mistake `dashed` guide per side: the Mistake pose's own hand poly (handPoly of
  wrist → grip in the Mistake pose). It is drawn on top of the masked pose and is not enlarged; M_WRIST stays 30.
  - Expected: 23.0° on screen from the forearm (30.0° in 3D), inside the source ring.
- **Chunk.** Expected 153,494 B raw (limit 153,600; 106 B left). If more than that, the guides become open 4-point
  paths (about 40 B less [est]). No ghost or part is dropped without a ruling (S3).
- **Zoom:** unchanged at k 2.5, 12.42 px.
- **Expected flags:** F3, F5.

## 3. 2 px clearance (D-A3-CLEAR)

| part | plane | gap | test |
|---|---|---|---|
| fly start silhouettes ↔ bench pad poly | body plane (screen) | 3.4 px | tested, ≥ 2 px |
| fly start silhouettes ↔ drawn Trace | screen | 8.0 px | tested, ≥ 2 px |
| fly start heads ↔ start forearm | in depth | ≥ 6.3 cm from the forearm axis (forearm radius ≤ 4.55 cm) | listed |
| reverse_lunge dumbbells ↔ thighs | in depth | start 1.5 / 1.5 cm; via 1 0.3 / 0.4; via 2 0.3 / 3.8; end 0.1 / 9.7 | listed (circumscribed cylinders) |

The hands on the handles are card contacts.

## 4. Tests and lane files (D-A3-TESTHOME)

- reverse_lunge's and dumbbell_fly's rows leave pilot-a2/sizes.json, tempo.json and cards.sha.json for pilot-a3/.
  `lib_dumbbell_fly` leaves pilot-a2/qa.mjs EXPECTED, and pilot-a2/DESIGN.md §11 gets one line naming the move.
- Line map: lib8r-pilot-a2.test.ts @ bf4b8d4d → lib8r-pilot-a3.test.ts. The PR lists the new line numbers; A13's
  mapping test pins this map.

  | old | content | new |
  |---|---|---|
  | :13-15 | IDS / ROWS / HELD_HERE | pilot-a2's IDS becomes ROWS; pilot-a3 gets IDS = its two ids |
  | :47 | mode H per row | same check on pilot-a3 rows |
  | :61-67 | held lines of the two ids | the held-line test in pilot-a3; after the pin, "moved: pinned in PILOT-A3" |
  | :73-74 | held ids added to the PILOT-A2 rows are red | kept as stricter: either id in any PILOT-A2 file is red |
  | :85-87 | the two ids' plate facts | verbatim |
  | :128 | seconds added to reverse_lunge's card and spec | verbatim |
  | :134 | RULED topFault keys | the two ids' keys |
  | :147-153 | the tell names c18's / c13's fault | /Low back arches/ (c18) and /Wrists bend/ (c13) |
  | :157-158 | the old deep tell first on the fly | verbatim |
  | :162-217 | normal plate, REAR_HEEL mutation, the R5 flare and R11 ring | normal bytes verbatim; the export sha with the D-A3-REVEXPORT normaliser; R5/R11 become A3/A4 (bow and ring) |
  | :246-264 | the fly's views; makeFly | the fly half, verbatim |
  | :266-283 | sizes rows | pilot-a3/sizes.json, M_TILT's new basis |
  | :330-331 | the zoom k | reverse_lunge 3, dumbbell_fly 2.5 |

## 5. Not here

- barbell_shrug: LIB-13s.
- incline_dumbbell_press: LB2.
- box_jump and the rear-delt fly: pinned in PILOT-A2 and byte-identical (A2).

## 6. Built (Wave 1)

- Page built twice: `bebd7730740e635c663db6dea19e65123c58b0f0c2622da07330f1c1f40a7878` (465,732 B), identical.
- QA, node and browser, zero exemptions: all 10 hard checks pass on both. Flags equal EXPECTED:
  - reverse_lunge F3 46.9, F4 0, F5 3.57 (label text 3.6:1); trace 69.7, deviation 4.10 px, 12.31 in the k 3 zoom;
    chunk 126,448 B.
  - dumbbell_fly F3 115, F5 3.57; trace 85.5, deviation 4.97 px, 12.42 in the k 2.5 zoom; chunk 153,494 B, as planned,
    so the open-path fallback is not used.
- Measured on the drawn fly: the start silhouettes are 15.08 × 27.93 px; the end dumbbell is 15.07 × 27.93. They sit
  3.43 px from the pad and 8.04 px from the trimmed Trace. The hand guides turn 23.00° on screen (30.00° in 3D).
- reverse_lunge's dumbbell-to-thigh 3D listing, from the test's model: the head as its circumscribed cylinder and the
  thigh with the engine's limbR profile. Values in cm, l / r:
  - start 1.47 / 1.47;
  - via 1 0.27 / 0.36;
  - via 2 0.23 / 3.72;
  - end 0.11 / 9.70.
  These agree with the card's to within 0.08 cm; the card's script is not in the repo.
- Left as they were: the dumbbell_fly.mjs comments at :93, :116 and :138, and the reverse_lunge.mjs SIZES comment at
  :90. They still say "pilot-a2/sizes.json", but they sit outside the card's write_scope lines.
- dumbbell_fly.mjs:122-136: the new helpers `startDb`, `merge`, `lmMis` and `MISTAKE_HANDS` sit outside the card's
  listed lines (:77-79, :133, :163). They only define the start phantom and the Mistake guides that those lines use
  (:149, :179). A7 pins the guides to the engine's own Mistake hand polys within 1e-6 px (review Low 1, #362 6550343299).
- lib8r-pilot-a2.test.ts: these lines changed outside the map, because the map's own moves force them:
  - :45, the HELD_HERE use, which goes with :15;
  - the titles of the tempo and tell mutation tests, which named the moved ids;
  - the A9 view and sizes mutations, which now run on the PILOT-A2 rows (the rear-delt pitch; BOX_H and HEEL_BACK).
  In lib8r-pilot-a3.test.ts, M5 runs on the fly: reverse_lunge's selected shin guide cannot be spliced into a page
  whose start equals its end (vendor build-page.mjs guideFor).
