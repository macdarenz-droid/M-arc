# Engine spike: camera pitch, front hinge, E-R5 (do not merge)

Scratch only (plan 7, LIB-20 "spike yes (scratch)"). Branch `claude/lib-engine-spike`, based on LIB-8 pilot A
(`c19805a`) so the held specs can be rendered. The engine edits here are **not** a re-vendor: `vendor/MANIFEST.json`
carries the label `SPIKE:` and `golden.mjs` accepts it only on this branch, so nothing here can pass for a real pin.

## Engine changes prototyped (all default 0 / off)

| Field | File | What it does |
|---|---|---|
| `camera.pitch` (deg) | `vendor/engine/plate.mjs` `makeCamera` | front view only: screen-up = y cos p − z sin p (camera raised on the viewer's side, looking down). At 0 the original projection function is used, not a multiply by cos 0. |
| `root.roll` (deg) | `vendor/engine/body.mjs` `normPose`, `fk` | the whole body turns about the forward axis (z): pelvis frame `rotZ(roll)·rotX(tilt)`. |
| `trunk.yaw` (deg) | same | the thorax (and head) turns about its own long axis: `Rt = Rp·rotX(flex)·rotY(yaw)`. `trunk` may stay a number. |
| `trunk.lat` (deg) | same | thorax side bend, `rotZ(lat)` before the yaw. Not in plan 2.4: needed for the side plank's sag Mistake. |
| `torso: 'volume'` (spec) | `body.mjs` `bodyShapes` + `volumeTrunk`, `plate.mjs` | trunk and head as hulls of neighbouring elliptic sections (width from the front outline, depth from the side outline), so a trunk seen end-on or from a pitched camera keeps its volume. Front view: a trunk nearer the camera than the knees goes to a new group `chest` drawn over the legs, and its head to `headF` over that. |

## Byte identity of the default path

`node tools/plates/library/spike/identity.mjs` (L1: pages built, L0 skipped because the spike edits vendored bytes):

- golden A `e2bea90c…`, 860,766 B: IDENTICAL
- golden B layers page `e7b81413…`, 2,320,561 B: IDENTICAL (its engine is a separate vendored copy)
- pilot A plates page `f4dc5ec3…`, 1,643,179 B: IDENTICAL

Mutations (default changed from 0 to 1), each must turn L1 red:

| Mutation | golden A | pilot A |
|---|---|---|
| `pitch ?? 1` | IDENTICAL (blind: no engine-drawn front view in golden A) | DIFFERS `a3b481bb…` |
| `roll ?? 1` | DIFFERS `780e2ad6…` | build fails (contact check) |
| `yaw ?? 1` | DIFFERS `c9f163d6…` | build fails (contact check) |
| `lat ?? 1` | DIFFERS `967d7bd3…` | not run (golden A already red) |

**Finding:** golden A alone cannot catch a pitch regression. The pitch card's L1 must include a pinned page with an
engine-drawn front view (pilot A's `upright_row` / `pec_fly`, or a new engine fixture in the card).

## Renders (`evidence/`, 390 px, Silent Black, Mistake, Paper; before = what the locked engine draws)

| Id | Before | After | Verdict |
|---|---|---|---|
| `dumbbell_fly` | level camera: thighs hide chest and head (hand-built dome + x-ray) | pitch 45: head, chest, arm arc, knees and feet all read; floor line at the feet (spec only) | **GO** on pitch alone; volume optional (rounder head) |
| `bent_over_dumbbell_rear_delt_fly` (front) | torso a band, legs over it, no head | pitch 35 alone: still legs over a band (**pitch alone is not enough**); pitch 15 + volume trunk + depth order: hinged back, head hanging in front, arms out | **GO (conditional)**: needs pitch + volume trunk + depth order; the shrug Mistake still moves little on screen (not measured) |
| `side_plank` | (no roll: a standing figure) | roll 70 solved so the elbow is under the shoulder and the lower foot on the floor; sag Mistake via `trunk.lat` + hip abduction | **GO** with roll; Mistake needs `trunk.lat` |
| `russian_twist` | (no yaw: chest square) | yaw ±35 + pitch 20 + volume: seated lean-back, chest turned, hands across; arms-only Mistake reads | **GO** |
| `bicycle_crunch` | (no yaw, level camera from the feet) | yaw ±30 + pitch 80 (labelled "Top view") + volume: lying curl, elbows wide, one knee in, one leg long | **CONDITIONAL**: reads only near top-down; elbow-to-knee crossing weak; critic decides |

None of these renders has been through the calibrated critic; R1/R4/R6/R7 ≥ 4 is an acceptance test of each card, not
claimed here.
