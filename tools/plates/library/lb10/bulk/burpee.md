# burpee (LB10 bulk, LIB-22 Do 7) — helper notes for the builder

Spec `tools/plates/library/specs/burpee.mjs`, How-to `tools/plates/library/howto/lib_burpee.howto.mjs`.
Branch head read: `537b7f83`. Status: **drawn; HELD (D-LIB8-shrug: Mistake deviation 7.1 px < 11.39) and NOSECS**
(no `tempo`). F7 expected (drawable false; topFault `rush` ≠ the drawn key `landing`). One tell (DESIGN §8 record).

## Pose map (D-LIB22-POSEMAP; tempo.json poseMap)

spec `start` = card plate.end (the straight-arm plank); spec `end` = card plate.start (standing after the landing);
the Mistake (a hard landing, c11) is drawn against the spec's end. plateFacts' `pose: start` = card end (c2).

- Start (plank, c2, c3, c6, c15): trunk, hips, knees, neck 0; arms straight and plumb, flat palms (wrist 90, LIB-26,
  `hand: 'flat'`), wrists at z 0 under the shoulder joints (hands the shoulder joints' width apart, c2); feet at
  right angles to the shins, toe tips down (mountain_climbers' ankle 0). Pelvis tilt 72.9°. The feet are then held as
  plant targets on their balls (so the blend to the squat slides them along the floor, c5 "Jump your feet in").
- Via (one ghost, parts leg.l, leg.r, trunk, arm.r): the squat with the hands down: feet flat on the standing spot
  (c13), hands on the plank's hand spots (c2, c3), hip joints 2 cm below the knee joints (c14), elbows over the knees
  (c5 "knees close to your elbows"), arms straight; tilt 66.0° solved. Never solid, no fact, tell or anchor.
- End (standing, c1, c11): feet flat 0.15 m out, toe tips at the wrists' line (c2 "in front of your feet"); knees
  15° (c11); trunk upright, arms hanging at the sides (c1 "hands by your sides"); root z solved so the centre of mass
  is over the mid-soles.
- Mistake (c11): knees 1° (straight), feet and balance unchanged (the hips rise 0.7 cm).

## SIZES (proposed `lb10/sizes.json` rows)

```json
"burpee": {
 "FOOT_X": { "value": 0.15, "unit": "m", "basis": "claim: c1 pg-burpee 'Stand tall with feet shoulder width apart' (one source hip-width, one feet together): the widest stance at which the rigid foot's plant contacts stay within 0.5 cm (0.15 m: 0.5 cm; 0.16 m: 0.6 cm), as kettlebell_swing 0.18 and medicine_ball_slam 0.12; the side view does not show the width" },
 "KNEE_SOFT": { "value": 15, "unit": "deg", "basis": "convention: leg_press.mjs:13, :23 ('knees 15 deg short of lockout'; D-LIB16-LOCK's rule), for c11 fv-burpee 'Always land on slightly bent knees'" },
 "M_KNEE": { "value": 1, "unit": "deg", "basis": "claim: c11 (the hard landing 'without the knees slightly bent', motra-burpee 'Hard landing on jump'): the knees straight, 1 deg short of full extension where the engine's two-bone leg is singular (kettlebell_swing TOP_KNEE 1, lb10/sizes.json)" },
 "VIA_DROP": { "value": 0.02, "unit": "m", "basis": "claim: c14 'Your hips should be below the level of your knees when you put your hands on the floor': the via's hip joints 2 cm below the knee joints (just below; a ghost only, D-LIB22-CYCLE)" },
 "trace": { "value": "ball.r", "unit": "point", "basis": "claim: c5 fv-burpee 'Jump your feet in and under your body' (the feet, NOTE RULED 6355155831 item 6)" }
}
```

## Trace, H3, balance, 3D

- Trace `ball.r`, trim [10, 12]: **measured** 149.7 px (≥ 22.11). It runs from the plank ball (6 cm up) to the
  squat, a near-straight line just above the floor line, then stays (via → end the feet do not move).
- Mistake deviation **7.1 px** < deviationMin 11.39 (the knee, 15° → 1°): **held** under D-LIB8-shrug (S2), route
  LIB-ZOOM, as DESIGN §13 estimated (5–7 px). Card-true; never enlarged.
- Balance (Winter, z in m): start −0.354 inside hands (0 … palm) and toes (−1.258); end −0.133 = mid-soles (base heel
  −0.252 … toe 0.000); Mistake −0.133. Via −0.145 (feet flat, hands down).
- Scale: reference 146.29 px/m (no F1); x0 250 so the plank's toes and head fit.
- Contacts: end and Mistake feet 0.5 cm (the plant limit), start feet 0 cm.
- 3D (RADII×H capsules): arms vs legs ≥ +2.75 cm in start, end, Mistake and the ghost. **Ghost (squat): the trunk's
  upper 70 % (chest half depth .072 H tapering to .058 H) against the thighs: −7.8 cm** — see open question 1.
- Floor: no heel, ball, toe or palm below the floor in start, ghost, end or Mistake. Along the blend (not a drawn pose)
  the toe tip dips 0.23 cm at t = 0.083 (plank → squat).
- Soft knees: 5.61 cm off the hip-ankle line (need 5.05), end, both legs. SOFT table entry:
  `burpee: [['end','r',15],['end','l',15]]`.

## Facts and checks (H6)

- plateFacts: `contact wrist.l`, `wrist.r`, pose `start` (card end, c2). Checks: each wrist `at` its start landmark,
  tol 0.5 (0 cm) and on the WRIST_Y plane (palm flat, 0 cm); toes on the floor at start (0 cm); heels and balls on
  the floor at end and Mistake (0.1 cm).

## Labels (report.mjs ok:true in dark, paper and Mistake)

| key | text | anchor | box |
|---|---|---|---|
| plank | Straight plank | start:backMid | 76, 120 |
| neck | Neck neutral | start:head | 244, 96 |
| soft | Soft landing | knee.r, off −6 px (the knee's back edge) | 96, 216 |
| landing (one tell) | Stiff landing | knee.r, Mistake | 64, 228 |

Cues (words): plank 9, neck 8, soft 6, landing 8. The first two checkpoints are plank signs, so they sit on the
dashed start figure (the standing end figure covers part of it). The leaders run 106 px (neck) and ~100 px (plank).

## report.mjs / tests

report.mjs ok:true (coverage 0.142, longest leader 106.1 px). lb10-plates.test.ts: every per-spec drawing rule
passes; red only on the shared lists (A2 slice, A3 count, A5/A9 rows, A10 ids, A17 no sizes.json row). It is in NOSECS
(so held already).

## Open questions

1. **3D, the squat ghost (S3-type, body on body):** with the hands on the plank's spots, the hips below the knees (c14)
   and the elbows by the knees (c5), the engine's rigid trunk passes into the thighs by about 7.8 cm (capsule
   estimate; the thighs at x ±0.09–0.12 m sit under the trunk's width). Real chests rest on/between soft thighs.
   Options: (a) a named body-on-body exception for this ghost only, like D-LIB22-HIKE3D; (b) knees out (toe-out + knee
   pole) with a sized toe-out the card does not give; (c) drop the via (but plan 1:84 asks for `via` on the burpee).
   Drawn as (a), pending a ruling.
2. Stance FOOT_X 0.15 per the coordinator's correction (plant limit), not 0.227.
3. VIA_DROP 0.02 m is "just below" for a bound claim (c14).
4. The dashed plank and the solid standing figure overlap (the feet land just behind the hands, c2, c5): the critic
   judges legibility; no leader crosses the end or Mistake figure.
