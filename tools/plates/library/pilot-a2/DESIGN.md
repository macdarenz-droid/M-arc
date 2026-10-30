# PILOT-A2: pilot A's held rows (LIB-8R RESUME PLAN)

Card: `docs/supervisor/verify/lib-8r-card.md` @ `b5206a78` (claude/sup-lib4-cards), rulings D-LIB8R-* (lib4-cards §46).
Main at start: `c7bdad7a` (train 44). Research head: claude/libht-research `0d832e18`; the 4 cards and quotes are its blobs
(box_jump a4d66424/078d5bad, reverse_lunge 86a3b2bf/93ecd9da, dumbbell_fly 1066e646/7a8a679e,
bent_over_dumbbell_rear_delt_fly 0e05ed0e/ffe68ca7), the ones the card names; copied byte for byte (`cards.sha.json`).

Nothing here ships. Rows stay at stage `drawing`/`review` in `pilot-a2/rows.json`, outside `batches/`, until the pin (Do 7).
build.mjs and qa.mjs are copies of pilot-b's (never imported); the rows.json read follows lb7/build.mjs.

## 0. Baseline measured at the start (specs as on main, tempo from the strip rows in a scratch edit)

Node QA (runQa, no browser) on `candidateOf(id, { all, authoring: true })`; pxPerM 146.3 on all four. Bars: deviation
11.39 px, trace 22.11 px.

| id | view drawn on main | trace px | deviation px | node problems | flags |
|---|---|---|---|---|---|
| box_jump | side | 176.9 | 28.0 | H6:no-card | F3 125.6, F4 1, F7 (no topFault yet) |
| reverse_lunge | side | 69.7 | 35.6 (old Mistake, c6 lean) | H6:no-card | F3 46.9, F4 0, F7 |
| dumbbell_fly | front, no pitch | 100.2 | 44.4 (old Mistake, depth) | H6:no-card | F3 45.1, F7 |
| rear-delt fly | side | 53.5 | 25.5 (old Mistake, swing) | H4 overlap swing/hips; H6:no-card | F3 42.2, F4 1, F6 side, F7 |

H6:no-card goes once the 3 card keys are in (Do 2). The browser run with box_jump also showed F2 0.7.

## 1. Per id

| | box_jump | reverse_lunge | dumbbell_fly | bent_over_dumbbell_rear_delt_fly |
|---|---|---|---|---|
| Clone source | itself, as drawn on main `c7bdad7a` (D-LIB8R-AIR) | itself on main; the normal plate stays byte-identical (D-LIB8R-REVLUNGE) | itself on main (arc, elbow bend, bench, supine() from dumbbell_bench_press); the hand-built TORSO dome and XRAY head go, the engine's volume trunk replaces them | the front alt on main (posesAt(90), front floor, datum, shrug); body, hinge, COM solve from the main file |
| View fields | side; none | side; none | front; `camera.pitch` **45** (D-SPIKE-pitch), `torso: 'volume'`; `armsFront` only if the hands draw under the chest (not seen at 45 in a scratch render: arms, chest and legs read in order) | front; `camera.pitch` **15**, `torso: 'volume'` (D-SPIKE-hinge) |
| Mistake (card) | landing with straight knees (c5), as drawn | flared ribcage (c18), redrawn | wrists bent out of neutral (c13), redrawn | shrug (c3), card drawable false |
| Mistake pose | as drawn | the end pose with the lumbar extended M_ARCH 12° (pelvis as the end pose's), so the thorax tips back 12° and the ribcage front lifts; arms kept plumb | the end pose's joint angles (reach released) with both wrists bent M_WRIST; the dumbbells follow the hand | the end pose with scap elev M_SHRUG 5 cm (the alt's pose) |
| Tells (first = topFault key) | `straight` "Knees straight" (c5) first; see question Q1 on `stiff` | `flare` "Ribs flare" (c18 "flaring the ribcage"), one tell | `wrists` "Wrists bend" (c13), one tell | `shrug` "Shoulders shrug" (c3), one tell |
| topFault (Q1(a) map) | `straight` (c5) | `flare` (c18) | `wrists` (c13) | `swing` (c5, c4): the ruled key of the top fault; differs from the drawn `shrug`, so F7 stays raised (decision 9) |
| Zoom (D-LIBZOOM-EXTEND) | none (dev 28.0, trace 176.9 at plate scale) | Mistake view, circle centred on the ribcage front (`chest` tell anchor, end and Mistake both in the source ring), k 1.5-2 | Mistake view, circle on the near hand and dumbbell (`grip.r`), k 2 | front: Mistake view on `shoulderTop.r`, ladder up to k 4; expected to fail (below) |
| PQ-H3 estimate (scratch, never a basis) | Mistake 28.0, Trace 176.9: pass | Mistake 9.0 px at plate scale → k 1.5 gives 13.5, k 2 gives 18.0; Trace 69.7 (unchanged) | Mistake at M_WRIST 30°: 6.5 px → k 2 gives 13.0; Trace 85.5 at pitch 45 | front Mistake 1.3 px (shrug foreshortened toward the camera) → k 4 gives 5.2 < 11.39: **S3 expected**; Trace 128.3 |
| Expected flags | F5; F2, F3, F4 measured (main: F2 0.7, F3 125.6, F4 1) | F5; F3, F4 measured | F5; F3 measured (96.8 at pitch 45) | F5, F7; F3, F4 measured; F6 only on the fallback |

### rear-delt fly: the expected route (D-LIB8R-FLIES)
The front view at pitch 15 reads (hinged trunk, head, arms at level). Its shrug moves the shoulder along the trunk axis,
which points almost at the camera: 1.3 px at plate scale, 5.2 px at k 4. If the drawn run confirms it, the front view is
held under S3 (never enlarged). The fallback the ruling allows: the side view showing the card's own plate.mistake
unchanged (the shrug, scap elev 5 cm, `shrug` tell), measured 7.4 px at plate scale in a scratch edit, so a Mistake zoom
at k 2 gives about 14.8 px. It then gets QA and one panel, with F6 named. The side plate keeps main's side poses (TOP 75);
the front view becomes the sheet extra. Files: the plate file is `bent_over_dumbbell_rear_delt_fly.mjs` (the row's src),
the other view is `__alt.mjs`, and `posesAt` stays exported from the plate file so the alt keeps importing.

### dumbbell_fly
`makeFly` stays exported (the side alt imports it). The pitched front view shows the chest, head, arc and knees together
(scratch render, pitch 45). The camera `y0` and floor are re-fit so the feet sit on the floor line inside the plate. The
stop-line datum and Soft elbows/Stop at chest/Dumbbells parallel callouts stay (card checkpoints).

### reverse_lunge
Only `mistake` changes. A7 pins the sha256 of the spec's export minus `mistake`, `tempo` and `pilot`, JSON-serialised:
`026964f91f030268d49bc52cf1adf46c265d9fcd27349e01e30c6f3bc87cc0dd` at `c7bdad7a` (measured; the same with the strip tempo
added). The old pitch/weight Mistake, its arc arrow and M_PLUMB go.

### box_jump
`pilot` note dropped; `tempo` from the strip rows. Poses unchanged. A8 adds the checks on the full-extension ghost.

## 2. Sizes (`sizes.json`, D-LIB17-SIZE form; never PQ-H3)

New rows only for numbers this card adds or that have no basis yet; every existing constant of the 4 specs gets a row
with the basis its header already states (claim id, an approved plate's value, or the stated reason), values unchanged.
New numbers:

| id | name | value | basis |
|---|---|---|---|
| reverse_lunge | M_ARCH | 12° lumbar extension | convention: hanging_leg_raise.mjs:69 (the 8) trunk −12 "lower back arches (lumbar extension 12 deg)"; LB8 sizes.json:118 and :620 use it for the same sign |
| dumbbell_fly | PITCH | 45° | D-SPIKE-pitch (COACHING-DECISIONS.md:2222) |
| dumbbell_fly | M_WRIST | 30° | stated reason: a bend that reads as the hand off the forearm's line; no card claim or approved plate gives one (section 6) |
| rear-delt | PITCH | 15° | D-SPIKE-hinge (COACHING-DECISIONS.md:2224) |
| rear-delt | M_SHRUG | 5 cm | convention: golden A dumbbell_lateral_raise shrug (ref-src/plate.mjs:147 "shrug_cm 5"), as lb7/sizes.json:522 |
| rear-delt | TOP (front) | 90° | claim c3 "about level with the body" (the alt's posesAt(90)) |

## 3. Facts (D-LIB8M-FACTS, scope of 22)
No number with a claim in any of the 4 cards' plate.start or plate.end: box_jump ("feet about hip width", c1), reverse_lunge
("hip to shoulder width", "roughly vertical"), dumbbell_fly ("shoulder-width", "level with the shoulders or chest"), rear-delt
("level with the body"). box_jump's 30-45 cm (c8) is plate.equipment with no measure callout. So `plateFacts` is [] on all 4.

Amended by CARD FIELDS (D-LIB8R-FACTS2, cfpa2 and cfpa2r on #340): contacts a quote states for a drawn pose are facts;
the facts written are in the cards (box_jump soles at start c2 and end c4; reverse_lunge toe.l at the end c4; dumbbell_fly
backUpper and buttock c1, c2, wrists c3; rear-delt fly wrists c1).

Not facts:
- reverse_lunge c15 "Bend both knees to 90°": c15 is the tempo reverse lunge, a progression; plate.end does not cite it,
  and the drawn exercise is the plain reverse lunge (D-LIB8R-PROGFACT). The knees stay as drawn.
- dumbbell_fly c2 head and shoulders: no back-of-head landmark (`head` is the crown, 9.0 cm above the pad); `shoulder.*`
  are joint centres (9.1 cm), so the shoulders are carried by `backUpper`. c2's feet "floor/riser" is an or-choice
  (D-LIB17-ORCHOICE).
- box_jump c8 30-45 cm: plate.equipment, no measure callout.

## 4. Tempo (`tempo.json`)
- box_jump (untimed): exactly tempoOf(strip/rows.json): `[{ Take-off, move, Explosive }, { Step down, move }]`.
- reverse_lunge (untimed): `[{ Lower, move, Slow }, { Rise, move, Quicker }]`.
- dumbbell_fly (timed, D-LIB8M-TEMPO): Lower ← down 2, Raise ← up 2 (c10; pause 0, no Hold).
- rear-delt (timed): Raise ← up 1, Lower ← down 2 (c10; pause 0).

## 5. Not here
- barbell_shrug: stays held; its spec and held line are LIB-13s' (D-LIB13-PA, lib-13-card.md:318, :321, :361).
- incline_dumbbell_press: stays held; ships with LB2 as `lib_incline_dumbbell_press` (D-LIB10-IDP-A); its spec stays a pinned
  input of pilot A (D-LIB8R-IDPSPEC).

## 6. Question for PLAN RULED
- **Q1 box_jump's second tell.** `stiff` "Stiff landing" names the same fault as `straight` (D-LIB8M-TF1 point 3 held five
  plates for that). Proposal: drop `stiff`, keep one tell; the pose and `straight` stay byte-identical. Without a ruling it
  goes to the blind pass as drawn (Do 3 changes only the note and tempo).
- M_WRIST 30° is a stated reason under D-LIB17-SIZE (no source or approved plate gives a wrist-bend size); fixed here before
  any PQ-H3 run on the drawn plate.

## 7. Drawn (Do 3, Do 4; after 'LIB-8R PLAN RULED' and 'LIB-8 resume')

Rulings applied: D-LIB8R-BJTELL (box_jump's `stiff` dropped), M_WRIST 30°, the rear-delt route (front first, then the
side fallback). Page: two builds `90ab915182ea6c2a04604475e0839e7b0128da79836c14991c2d2f2129696181` (711639 B).
qa.mjs (node and browser, `candidateOf(id, { all, authoring: true })`, zero exemptions): all 10 hard checks pass on all 4.

| id | view fields | zoom | trace px | deviation px (zoom) | raised flags | held |
|---|---|---|---|---|---|---|
| box_jump | side | none | 176.9 | 27.4 | F2 0.72, F3 125.6, F4 0, F5 3.57 | no |
| reverse_lunge | side | Mistake, k 1.5 (the smallest; 13.5 px) | 69.7 | 9.0 (13.5) | F3 47.9, F4 0, F5 3.57 | no |
| dumbbell_fly | front, pitch 45, volume trunk | Mistake, k 2 (1.5 gives 9.9 px) | 85.5 | 6.6 (13.1) | F3 106.8, F5 3.57 | no |
| rear-delt fly | side (fallback); front alt at pitch 15, volume | Mistake, k 2 (1.5 gives 11.1 px) | 53.5 | 7.4 (14.8) | F2 0.17, F3 98.1, F5 3.57, F6 side, F7 shrug | front view held (S3) |

F5 cell (scratch, D-LIB8M-QA): 3.569 in midnight at 340 px, Mistake view, on the selected Mistake tell of each plate:
`button.plate-callout.m[straight|flare|wrists][pressed]`, `button.plate-callout.two.m[shrug][pressed]`.

Notes:
- **rear-delt front run (S3):** at pitch 15 with the volume trunk the shrug's tell-anchor deviation is 1.3 px; inside the
  zoom it is 1.9, 2.5, 3.8 and 5.1 px at k 1.5, 2, 3 and 4, all below 11.39 px. Its card chunk is 180.3 KB (> H7's
  150 KB). So the front view is held, never enlarged. The side view carries the card's plate.mistake unchanged (the same
  `scap { elev 5, pro -3 }`), F6 named. The front view stays as `__alt.mjs`, a sheet extra.
- **dumbbell_fly's ghosts:** one. With the volume trunk, H7's card chunk is 152.4 KB with 1 ghost, 159.2 KB with 2 and
  165.9 KB with 3 (limit 153.6 KB). The floor line runs under the feet at the approved y 339 (`y0` set from FOOT_Z and the
  pitch). It spans ±0.5 m, so the zoom finds room in the lower left. The tell and two callouts have placed boxes (H1/H4).
- **A7 and the zoom key:** reverse_lunge's export minus `mistake`, `tempo`, `pilot` and `zoom` keeps main's sha256
  `026964f9…`. The zoom is Mistake-view only. The test also pins the normal render's svg and overlay bytes, measured
  from main's spec: svg `0744dcf3…`, overlay `cbf84381…`.
- `push.negotiate true` in the container's git config made pushes send no objects (GitHub: "missing necessary objects").
  `git -c push.negotiate=false push` works.

## 8. Panel mx4, round 1 fixes (#340 6534832450)

box_jump is approved and byte-identical: its 9 fragment sha256 values are unchanged from `2e4aa3ff`. The page is now
`ecb8966f97668936f5fb5235f1bede7c79e93b7a79eb65ad02f3ed908184660a` (built twice). qa.mjs: all 10 hard checks pass on all 4
with zero exemptions, and the flags equal the expected set.
- **reverse_lunge R11:** the `flare` tell anchor is now the mid-point of `chest` and `backMid` in the Mistake pose, so the
  ring sits on the lower ribs and low back: centre (181.8, 218.7), r 20.8, at k 2.5. 2.5 is the smallest k of 2 or more
  that passes; k 2 gives 11.0 px. Zoom deviation is 13.8 px. The normal plate is unchanged (A7).
- **dumbbell_fly R2:** the pitched bench is drawn as world `poly` items: the pad (top face and foot-end face), and at each
  end an upright with a cross foot. The sizes are the engine bench primitive's defaults, so it is dumbbell_bench_press's
  bench. The figure does not move.
- **dumbbell_fly R5:** the hand is a 4 cm wide segment from the wrist to the handle (HAND_W). It is redrawn dashed at the
  card's 30°.
- **dumbbell_fly R11:** waits on a zoom/QA tool fix. `zoom/inline.mjs:153` drops `camera.pitch`, and `qa/engine.mjs:36-40`
  `cameraOf` projects with no pitch; evidence is in #340 6534849228. With the true projection the fly's tell deviation is
  4.97 px, so its k will be 2.5, not 2, once the tool is fixed.
- **rear-delt R4:** the Soft elbows leader ends a third of the way down the forearm (`along elbow.r → wrist.r, t 0.33`),
  at (198.2, 198.1). The elbow itself projects onto the shoulder. No pose changes.
