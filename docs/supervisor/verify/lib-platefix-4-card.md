# LIB-PLATEFIX-4 (PF4)

Owner: supervisor (written 11-09). Branch: `claude/lib-platefix-4`. Builder: Opus. The card form is LIB-PLATEFIX-3 (`lib-platefix-3-card.md`). It is independent of the wave order. Source plan: `plan-w8.md` section 3 (inventory of the 70 unshipped rows, classes A/B/C/D).

## Scope

PF4 covers groups 1, 4 and 5 of plan-w8.md section 3. Groups 2 and 3 (the head-end inset and the view/posture zooms) form PF4b, a later card. The hands items are separate F-HAND-* cards.

Each held id starts a **fresh round 1** (precedent F-FLY-START: dumbbell_fly was given a fresh round 1 in PILOT-A3). Build to the exact fixes the earlier critics wrote (pf7, pf8, pf10, pfc and the wave panels). Cite each finding by its comment id.

**Group 1, close-up geometry (`pages/<batch>.closeups.mjs`):**
- Do barbell_bench_press first (item 19, hips-lifted multi-joint pose). It unblocks close_grip_bench_press, decline_bench_press, incline_barbell_bench_press, smith_machine_bench_press and smith_machine_incline_press.
- Then:
  - decline_bench_press: feet loose (item 21);
  - incline_dumbbell_press: bench-angle panel (item 20);
  - back_extension: pad height (item 16);
  - hack_squat: knee lockout and the Mistake wedge (E3);
  - jumping_jacks: knee zoom and toes;
  - wall_ball: wall-distance tilt and clip;
  - side_plank: raised shoulder.
- **D-PLAN-W8C** adds the W6 close-ups that scored [2,2,2] or [2,3,2]: cable_external_rotation (twist), diamond_push_up (blades) and cable_chest_press (back). They are redrawn here, so their last round is not spent on unchanged drawings. hip_adduction width joins if its check fails.

**Group 4, spec poses and Mistake overlays:**
- one_arm_dumbbell_row, burpee, machine_pullover, high_to_low_cable_fly, cable_curl (the ring only), smith_machine_squat, concentration_curl (item 12) and dumbbell_fly.
- v_up (F-VUP-V: the V ghost, the trace direction and the LOW BACK DOWN leader; the engine pose-swap option is allowed).
- jump_rope's Mistake overlay (F-JUMPROPE-HAND covers only the hand).
- pendulum_squat's Trace, after its plate.frames research edit lands (RESEARCH-ROUTES-4).
- straight_bar re-clone (D-PF2-PUSHDOWN-T), only if H10 is red on main.

**Group 5, framing (F-PLATE-CROP, a library crop):** superman, hip_adduction and v_up.

## Acceptance (the LIB-PLATEFIX-3 form)

- Per item:
  - the fix answers the cited finding;
  - a test is red on main and green after;
  - mutations bite;
  - every other plate, zoom and page fragment is byte-proven unchanged (`fragmentsOf`).
- QA hard checks pass with no new flags.
- PLATES READY with page shas built twice. Then one supervisor plates panel per group (R1-R11, plants and anchors), one fix round, a recheck, and HOLD after that (D-LIB13-PANEL2). New findings in round 2 get one fix and a check (D-SHIP-W5-NEWFIND).
- After the plates panel, a layers check of every sheet that shows a changed plate, in the D-PFC-ROUND1 form.
- Pins:
  - plates `page`/`plate` entries on main are superseded by appended `'owner'` D-OWNER-REPIN entries;
  - `layers-page` entries are `'supervisor'` (point 4);
  - entries only in this lane are edited in place (D-REPIN-UNMERGED);
  - the MANIFEST commit carries `[golden update]`.
- Shared pages follow D-PLATEFIX-SECOND (the second lane to merge rebuilds twice, appends, and runs cardcmp).
- No closing wording in commits or the body (F-COMMIT-KEYWORDS). A fresh Opus reviewer follows. Merge with the latest main.

## Out of scope

- PF4b (head-end inset and views).
- The F-HAND-* cards.
- Flipping any row: the W8 lanes do that.
- Anything under `escobar-worker/**`, `native/wear/**`, signing or keystore.
- Any change to saved-data shapes.

## Risks

- A fresh panel can fail again. Mitigation: build to the critics' exact fixes, and run one panel per group.
- Shared pages with W8a/W8b. Mitigation: D-PLATEFIX-SECOND.
- CI walk time. Mitigation: F-GEN-WALK-SPEED lands first; if a walker crosses 480 s first, tell the supervisor.
