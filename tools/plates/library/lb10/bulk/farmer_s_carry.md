# farmer_s_carry (LB10 bulk, LIB-22 Do 7) — helper notes for the builder

Spec `tools/plates/library/specs/farmer_s_carry.mjs`, How-to `tools/plates/library/howto/lib_farmer_s_carry.howto.mjs`.
Branch head read: `537b7f83`. Status: **drawn, not held by H3; NOSECS** (no `tempo`, D-LIB22-SECS). F7 expected
(drawable false; topFault `rush` ≠ the drawn key `long`).

## Pose (DESIGN §8: identity map; start = card plate.start, end = card plate.end)

- Start: standing tall, feet flat side by side, hip-width (c3); knees 15° (c6 not locked); trunk, lumbar and neck 0
  (c4); arms hanging straight at the sides (shoulder 0, elbow 0, c4); scapulae 1 cm down and 1 cm back (c5);
  a dumbbell in each fist, handle front-to-back (neutral grip, c3; reverse_lunge's form), far one z `back`, near z `front`.
- End: the near (right) foot one short step (0.35 m) ahead, flat; the far leg keeps its start knee (15°) and ankle
  (13.2°) and rolls onto its ball (heel up 13.0°); centre of mass midway between the two contacts; near knee 20.0°.
  Hips drop 0.3 cm.
- Via (one ghost, leg.r): mid-swing, the near foot half way with its sole 3 cm up.
- Mistake (c25 'regular-sized steps', c8): the near foot 0.70 m ahead, solved the same way: far heel 24.3° up, hips
  3.7 cm lower, near knee 23.6°. The near dumbbell lies inside the Mistake outline (masked by the engine), so it is
  redrawn as a red dashed guide (D-LIB22-IMPLEMENT); the start dumbbells are redrawn dashed in the end view (`startdb`).

## SIZES (proposed `lb10/sizes.json` rows; none is set by PQ-H3)

```json
"farmer_s_carry": {
 "FOOT_X": { "value": 0.0875, "unit": "m", "basis": "claim: c3 fv-farmers 'Stand between the weights with your feet about hip-width apart': the ankles under the engine's hip-joint centres (body.mjs REF.hjcX 0.05 H = 0.0875 m), every foot contact 0.0 cm; the side view does not show the width" },
 "KNEE_SOFT": { "value": 15, "unit": "deg", "basis": "convention: leg_press.mjs:13, :23 ('knees 15 deg short of lockout'; D-LIB16-LOCK's rule), for c6 ggr-farmers 'locking out your knees'" },
 "SCAP_ELEV": { "value": -1, "unit": "cm", "basis": "convention: dumbbell_biceps_curl.mjs:57 (#109 @ dcac4a38) SCAP elev -1 'shoulders set down', for c5 bb-farmers 'keep your shoulders back and down' (c5 fv-farmers: 'Avoid forcing ... an exaggerated shoulders-back position', so the convention's small set)" },
 "SCAP_PRO": { "value": -1, "unit": "cm", "basis": "convention: dumbbell_biceps_curl.mjs:57 (#109 @ dcac4a38) SCAP pro -1 'slightly back', for c5 bb-farmers 'back and down'" },
 "STRIDE": { "value": 0.35, "unit": "m", "basis": "stated reason: c8 ggr-farmers 'taking short, deliberate steps': half of M_STRIDE's regular step (DESIGN section 11, accepted 6355155831 item 5)" },
 "M_STRIDE": { "value": 0.7, "unit": "m", "basis": "stated reason: c25 bb-farmers 'regular-sized steps': an adult's normal walking step, about 0.7 m for the 1.75 m figure (normal stride about 1.4 m, two steps)" },
 "VIA_LIFT": { "value": 0.03, "unit": "m", "basis": "stated reason: the ghost's swinging foot just clears the floor at mid-swing: its sole 3 cm up, above normal gait's minimum toe clearance of 1 to 2 cm" },
 "BODY_KG": { "value": 75, "unit": "kg", "basis": "convention: lb7/sizes.json weighted_dip BODY_KG 75 (#299 @ 5a9f004c), the 1.75 m figure's mass for the balance" },
 "DB_SHARE": { "value": 0.25, "unit": "fraction", "basis": "claim: c18 ggr-farmers 'Dumbbells that are approximately 25% of your body weight in each hand are a great place to start'" },
 "DB_KG": { "value": "solved", "unit": "kg", "basis": "DB_SHARE x BODY_KG = 18.75 kg in each hand, at the grips in the centre of mass (A18)" },
 "trace": { "value": "ball.r", "unit": "point", "basis": "claim: c8 ggr-farmers 'taking short, deliberate steps': the stepping (near) foot (DESIGN section 12; D-LIB22-SIDES: the card names no side)" }
}
```

Checked with A17's `sizeProblems` logic on these rows against the spec's exports: no problem (bulkB/sizes-check).

## Trace, H3, balance, 3D

- Trace `ball.r` (c8), trim [10, 12]. **Measured** (proto/h3q): Trace 28.1 px (≥ 22.11), Mistake deviation 51.2 px
  (≥ 11.39; the `long` anchor, end toe → Mistake toe). Not held.
- Balance (Winter 2009 on the drawn landmarks + 18.75 kg at each grip), z in m:
  start 0.000 (base: both feet, heel −0.119 … toe 0.133); end 0.206 (base: far ball 0.063 … near toe 0.483); Mistake
  0.381 (base 0.063 … 0.833). Body alone: 0.001 / 0.207 / 0.383. All inside.
- 3D (RADII×H capsules, hex heads as swept spheres of the 5.95 cm corner radius): dumbbell vs thighs/shanks, worst
  per pose: start +1.41 cm, via +0.56 cm, end +0.56 cm, Mistake +0.61 cm (near head vs near thigh). Forearms vs
  thighs +1.27 cm. Nothing through the body. Feet: no heel, ball or toe below the floor in any pose or along the blend
  (lowest 0.0 cm); the far toe pad on the floor (toe landmark 1.0 / 0.7 cm, the rigid foot's pad, reverse_lunge's lift).
- Soft knees in the view's plane: knee 5.61 cm off the hip-ankle line (need 5.05) at start (both), end and Mistake
  (far leg). Add to the test's SOFT table: `farmer_s_carry: [['start','r',15],['start','l',15],['end','l',15]]`.

## Facts and checks (H6)

- plateFacts (card): `contact wrist.l`, `wrist.r`, start (c3). Checks: each wrist `at` its start landmark, tol 0.5
  (0 cm drawn; the dumbbell is drawn at the grip, so each hand is on its handle by construction).
- Other checks: near heel and ball on the floor in every pose (0 cm); far heel and ball on the floor at start;
  far toe on the floor and far heel ≥3 cm up at end and Mistake (1.0 / 0.7 cm; heel 1.9 / 6.3 cm above the 3 cm plane).

## Labels (placed with proto/place.mjs scans; report.mjs ok:true in dark, paper and Mistake)

| key | text | anchor | box |
|---|---|---|---|
| torso | Tall torso | chest | 184, 120 |
| shoulders | Shoulders down | backUpper | 16, 48 |
| arms | Arms long | elbow.r, off −6 px (the elbow's back edge; the leader leaves the arm and the torso within its first 8 px) | 16, 156 |
| long (tell 1, the ruled key) | Steps too long | toe.r, Mistake | 224, 280 |
| short (tell 2) | Long stride | knee.r, Mistake, off +7 px | 224, 232 |

Cues (words): torso 8, shoulders 6, arms 6, long 9, short 8.

## report.mjs / tests

- report.mjs ok:true (coverage 0.139, longest leader 68.2 px, 5 boxed). F1: none (146.29 px/m).
- lb10-plates.test.ts with this spec in the tree: every per-spec drawing rule passes (tells/keys, anchors, guides,
  arrows, leaders vs Trace/floor/equipment, leader crossings, phantoms, cues, callouts = checkpoints, NOSECS no tempo,
  Do 6 b fact checks). Red only on the shared lists: A2 slice list, A3 count (4), A5 and A9 rows/held lists, A10 ids,
  A17 (no sizes.json row yet). NOSECS: it is in `NOSECS` already, so HELD covers it.

## Open questions

1. The second tell. DESIGN §8 names `short` ("the stride past the short step", c8). No placement of a tell anchored
   on the end (short-step) foot clears the end and Mistake figures (scans at the end toe and heel: 0 placements), so
   `short` is drawn as "Long stride" at the Mistake knee (the leading knee of the over-long stride). If the
   supervisor reads that as the same sign as `long`, the alternative is one tell with a D-LIB10-SKULL1 record (c25 and
   c8 state one sign, the step length).
2. M_STRIDE 0.70 m and VIA_LIFT 0.03 m are stated gait numbers (normal step about 0.7 m; minimum toe clearance about
   1–2 cm), not card claims; I could not re-read a source for them here.
3. The engine dumbbell is the reference size (a ~9.5 kg hex in cast iron by its drawn size), while the balance uses c18's
   18.75 kg; larger heads would cut the 0.56 cm thigh clearance. Kept the anchor's (dumbbell_biceps_curl) size.
4. "Shoulders down" sits on `backUpper` (the shoulder-blade region of the back) with a long leader up-left (68 px): the
   shoulder joint is inside the torso outline in a standing side view, so no anchor on the joint clears the figure.
