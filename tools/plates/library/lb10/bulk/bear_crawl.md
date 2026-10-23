# bear_crawl (LB10 bulk, LIB-22 Do 7) — helper notes for the builder

Spec `tools/plates/library/specs/bear_crawl.mjs`, How-to `tools/plates/library/howto/lib_bear_crawl.howto.mjs`.
Branch head read: `537b7f83`. Status: **drawn; HELD (D-LIB8-shrug: the card-true 2-inch step's Trace is 0 px drawn,
< traceLenMin 22.11)**. Tempo `[{ phase: 'Work', s: '15–30', move: true }]` = tempo.json's ruled row (c10) and the card's
`tempo` key. F1 expected (D-LIB22-FLOOR): **197.49 px/m** (×1.35). No F7 (drawable true; topFault `hips` = first tell).
Not on rows.json while held: add `bear_crawl` to the test's HELD list and DESIGN §15's held table.

## Pose (identity map)

- Start (c3, c4): table-top on hands and toes: trunk and neck 0 (back flat); arms straight and plumb with flat palms
  (wrist 90) under the shoulder joints (hands at the shoulder joints' width, c1); thighs plumb, knees under the hip
  joints, the knee joints at kneecap radius + 2 in (c3 "lift knees 2 inches"); feet at right angles to the shins,
  toe tips down (mountain_climbers' ankle 0), hip-width (legs in the hips' planes, c3). Root, tilt (80.4°), hip,
  knee, shoulder solved. Hands and feet are then held as reach/plant targets.
- End (c4 "move right arm and left leg forward 2 inches", D-LIB22-SIDES first diagonal: right = near): near hand and
  far foot 5.08 cm forward on the floor; pelvis tilt kept; root solved so both arms stay straight (1° short of the
  singular extension) to their hands (the trunk follows 2.5 cm); each palm flat (wrists 86.9° / 91.9° solved);
  knees still hovering (c8).
- Mistake (c5 "don't lift your butt", c2, c8): the pelvis turns 18.8° (hips up), the shoulders stay where both straight
  arms reach; hands and feet stay. Hips 0.682 m vs shoulders 0.607 m (7.5 cm above). Tells: `hips` "Hips rise" at
  the Mistake buttock (c5), `level` "Hips above shoulders" at the Mistake upper back (c2).

## SIZES (proposed `lb10/sizes.json` rows)

```json
"bear_crawl": {
 "KNEE_HOVER": { "value": 0.0508, "unit": "m", "basis": "claim: c3 ace-bc-shape 'lift knees 2 inches off the ground' (2 in = 5.08 cm, the kneecap's lowest point: the knee joint RADII.kneeCap x H + 5.08 cm up, mountain_climbers' kneecap check)" },
 "STEP": { "value": 0.0508, "unit": "m", "basis": "claim: c4 'move right arm and left leg forward 2 inches' (2 in = 5.08 cm)" },
 "M_TILT": { "value": 18.8, "unit": "deg", "basis": "convention: mountain_climbers.mjs:88 HIKE_HIP 30 (#109 @ dcac4a38) as drawn there: its Mistake turns the pelvis 18.8 deg (tilt 72.9 -> 91.7, measured), for c5 bb-bc 'When you lift your knees, don’t lift your butt, too'; HIKE_HIP's own 30 deg of hip flexion cannot be reached with the hands and feet planted (it peaks at +25.7 deg)" },
 "END_ELBOW": { "value": 1, "unit": "deg", "basis": "stated reason: the arms straight as at the start (c11 ace-bc-shape 'a lot like a moving high plank'), 1 deg short of full extension where the engine's two-bone arm is singular (kettlebell_swing TOP_KNEE 1, lb10/sizes.json)" },
 "trace": { "value": "wrist.r", "unit": "point", "basis": "plate.frames 'Trace follows the stepping hand' (c4's right arm, the near side)" }
}
```

DESIGN §11 proposed `M_HIP 30`; it is replaced by `M_TILT 18.8` for the reason in its basis (see open question 2).

## Trace, H3, balance, 3D

- Trace `wrist.r`, trim [4, 6] (plank.mjs's): the hand moves 5.08 cm × 197.49 = 10 px, all inside the trims, so no
  Trace path is drawn: **measured 0.0 px < 22.11 → held** (S2), route LIB-ZOOM, as DESIGN §13 estimated (~10 px).
  No via (the card gives no hand lift); the hand slides on the floor between the poses (the ghost at t 0.5 has the
  palm flat on the floor).
- Mistake deviation **32.7 px** (≥ 11.39).
- Balance (Winter, z in m): start −0.278, end −0.253, Mistake −0.252; base: toes −0.980 / −0.929 … hands 0 / 0.051
  (both hands and feet down in every pose, c3, c4). Inside.
- Contacts 0 cm (hands and feet) in every pose; palms flat (wrists 0 cm off the WRIST_Y plane); toes on the floor.
- 3D: arms vs legs ≥ +34 cm. Trunk (upper 70 %) vs thighs: +4.6 cm start, +4.1 end, +1.1 Mistake, +4.4 ghost (capsule estimate).
- Knees: start 0 cm off the 2 in plane; end both knee joints 1.1 cm above the "kneecap 4 cm clear" plane (c8).

## Facts and checks (H6)

- plateFacts: `contact wrist.l`, `wrist.r`, start (c3 "Drive palms into the floor"). Checks: each wrist `at` its start
  landmark (0 cm); palms flat (WRIST_Y plane, all poses, 0 cm); toes on the floor (all poses, 0 cm); knees at the
  hover at start (0 cm) and kneecaps ≥4 cm clear at the end.

## Labels (report.mjs ok:true in dark, paper and Mistake)

| key | text | anchor | box |
|---|---|---|---|
| hands | Hands<br>under<br>shoulders | along shoulder.r→wrist.r t 0.6, off +6 px (the near forearm's front edge) | 262, 260 |
| knees | Knees<br>hover | knee.l, off +8 px (the leading far knee's front) | 180, 280 |
| hips | Hips level | sacrum | 96, 152 |
| hips (tell 1, ruled key) | Hips rise | buttock, Mistake | 64, 152 |
| level (tell 2) | Hips above<br>shoulders | backUpper, Mistake | 192, 120 |

Cues (words): hands 12, knees 9, hips 9, tell hips 11, level 6. The Mistake arrow from the end hip was dropped: it ran
inside the end figure (the 6 px rule); the red outline shows the rise.

## report.mjs / tests

report.mjs ok:true (coverage 0.144, longest leader 26.8 px). lb10-plates.test.ts: every per-spec drawing rule passes;
red only on the shared lists (A2 slice, A3 count, A5/A9/A10 because bear_crawl is not yet in HELD, A17 no sizes.json row).

## Open questions

1. **S3 (c2 vs c3 on the body):** with straight arms (c11 "a moving high plank"), hands under the shoulders and knees
   under the hips with a 2-inch hover (c3), the engine's hip joints sit 7.8 cm below its shoulder joints (back rising
   ~10° to the head), so c2's "hips and shoulders at the same height" cannot hold literally. Solved options: (a) as
   drawn: the back flat (trunk 0), the checkpoint read as the back held flat with the hips not above the shoulders;
   (b) elbows bent ~61° to drop the shoulders 7.8 cm (no claim bends the elbows); (c) knees hovering ~13 cm (breaks
   c3's 2 in). Drawn as (a), pending a ruling.
2. M_HIP 30 (DESIGN §11, from HIKE_HIP) is not reachable here as hip flexion; drawn as HIKE_HIP's measured pelvis turn
   (18.8°). Needs the ruling to accept the changed row.
3. No via for the hand's lift (no claim sizes it); the Trace is not drawn at this size either way.
