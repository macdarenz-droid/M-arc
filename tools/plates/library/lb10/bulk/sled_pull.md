# sled_pull (LB10 bulk, LIB-22 Do 7): helper notes

Spec `tools/plates/library/specs/sled_pull.mjs`, How-to `tools/plates/library/howto/lib_sled_pull.howto.mjs`. Drawn on
`claude/lib-22-lb10` @ `5c1aceca`. NOSECS: no `tempo`. `eq/sled.mjs` is **not edited**: the pull form already puts the
hitch ring on the lifter's edge (`rearZ`, the sled in front, +z, the figure facing it), which matches the card
("Sled ... in front of the lifter", c1 "Start facing the sled"). Main's `eq/rope.mjs` draws every strand unedited
(`strandOutline`, parameters only: `knob = thick`, `knobLen 0.002`, `below 0`): **no S7**.

## Drawing

- Start (c1, c2): both feet flat and level; trunk upright (tilt 0, trunk 0, neck 0); both fists on the one rope at the
  midline, each arm ELBOW_BEND short of straight; the near (upper) fist at the hips' height, the far (lower) fist
  GRIP_GAP below and behind it on the same shoulder circle ("one stacked over the other"). Rope: hitch ring → upper fist →
  lower fist → tail to a 3-turn coil on the floor under the start's lower fist (plumb at the start).
- End (plate.frames, c3): the near foot (r) stepped STEP straight back, planted flat (`sole.r` on the floor); the hips
  keep their height and move back with the centre of mass; arms and trunk unchanged.
- Drag (Q9): the sled's rear edge = SLED_Z + (hips z − start hips z) on the drawn landmarks; in the Mistake the sled
  stays where the end left it. Dashed start sled (`startsled`, 9 outlines) and start rope (`startrope`, 3 outlines),
  `type: 'line'`, `cls: 'eq-line m-line'`, end view only (left out of the Mistake view, where red dashes mark the fault).
- Via ghost (1, `leg.r`): the stepping foot flat, FOOT_CLEAR off the floor, halfway.
- Mistake (c8): pelvis M_TILT −14, lumbar M_ARCH −12 (trunk 21.9° behind vertical); the sled static, the rope's run kept,
  the arms keep their end joint angles, so the hips sag forward and down (M_Z, M_Y solved) until the upper fist is back
  on the rope's run, the stepped-back knee kept at KNEE_SOFT. No guide (a plumb from the faulty hips lies inside the solid
  figure; an arrow between the heads cannot clear the solid head by 6 px).

## Sizes (proposed sizes.json rows; none is set by PQ-H3)

| name | value | basis |
|---|---|---|
| PX_PER_M | 126 | convention: sled_push's scale (sizes.json sled_push PX_PER_M), the same `sled` at the same scale on the one sheet; inside F1's 123.9-146.29 |
| FOOT_X | 0.145 m | c2 "Plant your feet shoulder-width apart": the widest flat stance whose rigid-foot plant keeps every report contact ≤ 0.5 cm in start, end and Mistake (scan 0.10-0.20 m by 0.005: 0.145 → 0.5 cm, 0.150 → 0.6 cm in the Mistake); coordinator's correction of D-LIB22-STANCE (0.227 misses by 0.6-1.6 cm) |
| KNEE_SOFT | 15° | leg_press.mjs:13, :23 ("knees 15 deg short of lockout", D-LIB16-LOCK) for c2 "keeping your knees soft": the straightest knee of the step (the stepped-back knee in the end, and in the Mistake) |
| HIP_Y | solved 0.894 m | the hips' one height through the step (so hands and rope keep theirs, Q9) at which the end's stepped-back knee is KNEE_SOFT; gives start knees 29.4° (c2 "quarter-squat") |
| ELBOW_BEND | 18° | machine_chest_press.mjs:45 (18° short of straight) for c1 "arms slightly bent" |
| GRIP_GAP | 0.07 m | c1 "one stacked over the other": the two drawn fists touching (2 × RADII.fist 0.02 H, body.mjs:27) |
| STEP | solved 0.252 m | c3 "short" step: the stepping toe at the stance heel, the shortest step that sets the foot wholly behind ((REF.toe − (REF.heel + 0.008)) H, body.mjs:25, :155-156) |
| SLED_Z | 0.9 m | stated (framing): the sled's rear edge 0.9 m ahead of the start soles, clear of the coil (0.21-0.47 m) and the step, the start sled's front inside the plate at PX_PER_M; moved from 1.0 m for the left label room (labels, not H3; H3's trace does not depend on it) |
| FOOT_CLEAR | 0.025 m | mountain_climbers.mjs:49 @ dcac4a38 (the gliding foot) for c3 "short, quick, and controlled" / c5 "small shuffles"; via ghost only |
| COIL_D | 0.266 m | stated: plate.equipment "a short coil": one foot length across (WINTER.foot · H) |
| COIL_TURNS | 3 | stated: a short pile, three turns high (8.4 cm) |
| ROPE_T, ROPE_SAG | 0.028 m, 0.006 m | main's eq/rope.mjs defaults (`thick`, `sag`; rope_triceps_pushdown's rope, the `rope` rig's anchor) |
| M_TILT, M_ARCH | −14°, −12° | hanging_leg_raise.mjs:69 (the 8's approved lean and arch) for c8 "pitch your torso back and let your lower back take the load" |
| DRAG | solved −0.1218 m | the hips' z change start → end (Q9) |
| ROPE_RUN | solved 0.8223 m | the hitch-to-upper-fist run at the start |
| M_Z, M_Y | solved 0.0919, 0.8067 m | the Mistake root: the upper fist on ROPE_RUN from the static end hitch; the stepped-back knee KNEE_SOFT |
| trace | `ball.r` | plate.frames "Trace follows the stepping foot" (DESIGN.md section 12) |

Root finders (copied bisect, throws on no root): HIP_Y in [0.70, 0.93] → 0.8943; START_Z (balance) in [−0.6, 0.4] →
−0.0072; END_Z → −0.1290; M_Y in [0.5, HIP_Y+0.05] → 0.8067; M_Z in [END_Z−0.1, END_Z+0.3] → 0.0919.

## Drag numbers (drawn items; `drag.mjs`)

- Hip shift −0.1218 m; sled shift (runner's rear z) −0.1218 m: equal (0.0 cm). Mistake sled − end sled 0.0000.
- Rope run (hitch outline start → upper fist): start 0.8223, end 0.8223, Mistake 0.8223 m (Δ 0.0 cm).
- Static-sled variant (sled left at its start place in the end): the run would be 0.8992 m, +7.7 cm → violates (> 1 cm).
- Test to add (integration): sled shift = hip shift ±1 cm; run(start) = run(end) ±1 cm; mutation: the sled static
  (rearZ = SLED_Z in every pose) → run +7.7 cm, red.

## Trace and H3 (h3q.mjs, qa/node deviation and the drawn trace path)

- Trace `ball.r`: **10.1 px < traceLenMin 22.11** (STEP 0.252 m = 31.8 px at 126 px/m, minus the trim [10, 12], the
  sled_push/kettlebell_swing convention). **S2: held under D-LIB8-shrug** (route LIB-ZOOM). Not enlarged. The step's
  size was fixed (heel-to-toe) before H3 was measured; open question 2.
- Mistake deviation **23.3 px** ≥ 11.39.

## Balance (Winter CoM on drawn landmarks, body only; the rope's light tension (c1) is not counted)

| pose | CoM z | base (heel..toe, both feet) | |
|---|---|---|---|
| start | +0.015 (solved over the soles, z 0) | −0.119 .. +0.133 | inside |
| via | −0.044 | stance foot −0.119 .. +0.133 (stepping foot in the air) | inside |
| end | −0.111 (solved over the soles' midpoint −0.126) | −0.371 .. +0.133 | inside |
| Mistake | +0.008 | −0.371 .. +0.133 | inside (no rope pull claimed) |

## 3D clearances

- Fists vs legs (capsules RADII × H, fist 0.02 H): start 23.4 cm, end 21.6 cm, Mistake 27.8 cm. Rope outline vs legs:
  20.3 / 19.3 / 13.3 cm. Fists vs the torso (ellipse section from body.mjs torsoSide × torsoHalf, `inbody.mjs`): 21.8 cm+.
- Elbows vs the torso (same model, elbow cap 0.022 H): far 1.2 cm, near 3.8 cm in every pose (the Mistake keeps the end's
  arm angles). An earlier Mistake (arms keeping their world direction) put both elbows 6 cm inside the waist: rejected.
- Coil vs feet: the coil spans z 0.205-0.471 m, the toes end at 0.133 m (x overlap of the round coil, ±0.133 vs feet
  inner edge 0.097, does not matter: no z overlap). Runners on the floor (lowest px 339.00 = floor) in every pose.
- Feet: every heel and ball on the floor in start, end and Mistake (checks 0 cm); report contacts 0.5 cm.
- Soft bends in the side plane: knees off the hip-ankle line start 10.9/10.9, end 11.2/5.6, Mistake 20.1/5.6 cm (15°:
  full offset 5.6, 90 % 5.06); elbows 5.1/5.1 cm every pose (18°: full 5.2, 90 % 4.7). Elbow pole [0, −1, −0.4]
  (c4 "elbows tucked": down and back, the bend in the side plane).

## `checks` backing each fact (renderPlate report.checks; all 0.0 cm)

- c1 start `wrist.l`, `wrist.r` (at the start wrists, tol 0.5) — card fact.
- c4 end `wrist.l`, `wrist.r` (at the end wrists, tol 0.5) — new fact (#305 6356860734).
- c2 start `sole.l`, `sole.r` (floor plane, tol 1) — new fact (CF re-verify).
- c3 end `sole.r` (floor plane, tol 1) — card fact.
- Also: heels and balls on the floor in all poses (tol 0.5); c2 `shoulder.r` over the hips (plane z = hips) start and
  end (tol 1).

## Labels (report.mjs ok:true; place.mjs/lx.mjs; no leader crossings)

| key | text | anchor | box |
|---|---|---|---|
| squat | Quarter<br>squat | knee.r | 24, 240 |
| stack | Shoulders<br>over hips | backUpper | 24, 144 |
| steps | Short<br>steps<br>back | heel.r | 16, 276 |
| lean (tell 1, ruled key) | Torso pitched<br>back | mistake head | 16, 56 |
| stack (tell 2) | Shoulders<br>behind<br>hips | mistake backUpper | 24, 176 |

`backUpper` (the drawn upper back at the shoulder blades) is used for both "shoulders" labels: the shoulder joint lies
~15 px inside the trunk outline in side view, so every leader to it crosses the figure; `shoulderTop.r` admits only
boxes right of the figure, whose leaders run over the start figure. Longest leader 47.7 px.

## report.mjs

`ok: true` on sled_pull-dark, sled_pull-paper and sled_pull-mistake-dark (no browser or engine issue). Coverage 0.162.

## Tests (`npx vitest run tests/howto/lb10-plates.test.ts`): 124 passed, 3 failed — integration only

1. "the slice is drawn" (exact id list) — add sled_pull.
2. A3 "every drawn LB10 spec passes" — `files().length` 4 → 5 (closureOf on sled_pull passes the per-file rule: vendor
   MANIFEST in, nothing under layers/, vendor/exercises/, hands/, fidelity/, ci/, fixtures, no other spec).
3. A17 — needs `sizes.json` `ids.sled_pull` (table above; solved rows STEP, HIP_Y, DRAG, ROPE_RUN, M_Z, M_Y; `trace`
   ball.r). The `sled` composer's constants are unchanged.

Every per-spec drawing rule passes on sled_pull (anchors, leaders 6 px, leader/figure, leader/text, phantom crossings,
red-arrow clearance (no arrow), datum (none), engine issues, cues ≤ 15 words, callouts = checkpoints, H9, checks and
contacts, phantomMissing for `rope`), and every sled_push test is green. To add at integration: `startsled` to
avoidOf's start-part exclusions only if wanted (it is stricter now and passes), `sled` to phantomMissing's parts, SOFT
rows (`sled_pull`: end knee.r 15, start knees 29.4 bend; elbows 18), and the drag test above.

## Held

Held: NOSECS (D-LIB22-SECS) and S2 (Trace 10.1 px < 22.11, D-LIB8-shrug, route LIB-ZOOM).

## Open questions

1. Quarter squat: the ruled KNEE_SOFT 15 is used as the step's straightest knee; the constant hip height then gives start
   knees 29.4°. If the supervisor reads c2's "quarter-squat" as a deeper bend, a basis is needed (none is drawn here).
2. STEP: "short" read as heel-to-toe (0.252 m). Its Trace is under traceLenMin (S2). No longer step is drawn (that would
   be an H3-driven size); DESIGN.md's farmer_s_carry STRIDE 0.35 m [proposed] is another reading of "short", for a ruling.
3. Mistake: with the sled static and the rope's run fixed, a 26° lean (M_TILT + M_ARCH) is only reachable with the hips
   sagging forward 22 cm and down 8.8 cm (front knee 55.7°). It reads as lean-back with hips sagging (c8), but the lower
   body changes too; critic risk (the lean reads as a forward shift). Alternatives: let the rope lengthen in the Mistake
   (rope slips), or smaller M_TILT/M_ARCH (needs another approved basis).
4. The tail hanging plumb onto a 3-turn flat coil reads in side view like a pole on a stack of bars (render). A looser
   pile needs sized numbers (loop tilt) with a basis; flagged for the critic.
5. GRIP_GAP is along the shoulder circle (both elbows 18°), so the lower fist sits 4.2 cm lower and 5.6 cm behind; the
   rope kinks at the upper fist. Card c1 does not say which hand is on top; the near (r) hand is drawn upper/front.
