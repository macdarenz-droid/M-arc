# Form guide demo: design source

This folder holds the full source of the rendered demo canvas: the owner's SPLIT 1 UPPER BODY with 3 animated exercises. The design itself is `docs/GUIDE-UPGRADE-ARCHITECTURE.md`. This is a demo only, with no app code.

- `UPGRADE-BRIEF.md`: the smoothness and figure-detail upgrade (its status, targets and checks). It also explains how the builds work.
- `spec.md`: the screens, copy, tokens and each exercise's truth table.
- `rig-final/RIG.md`: the shared figure rig. The low-poly style won the judging.
- `anim-*/PLAYER.md`: each animated player (keyframes, zooms, Pictures poses and QA history).
- `project/*.dc.html` and `canvas.json`: the canvas files (upgraded 2026-09-27).
- `canvas-preview/`: renders the 13 artboards as a normal web page through a small stand-in runtime.
- `smooth-check.cjs`, `smoothness-before.txt`: the numeric smoothness check and its output on the original build.
- `FORMAT-RULES.md`: the canvas file format.

## Status (2026-09-27, after the smoothness and figure upgrade)
- **All three players** (Machine Chest Press, Lat Pulldown, Dumbbell Lateral Raise) have minimum-jerk motion with a solved pose every 0.5 % of the rep (0.25 % in the lift) and the detailed figure of `rig-final/RIG.md` §20. Each passed an independent review and the polish round that followed. Every `shoot.cjs` prints ALL CHECKS PASSED, including the numeric smoothness check (`smooth-check.cjs`); `smoothness-before.txt` shows the same check failing on the original build. Tapping a coloured muscle opens its name, role and a one-line cue (spec 2.10), checked by `rig-final/muscle-tap-check.cjs`.
- **Canvas:** the 3 `Player-*.dc.html` files match their harnesses (parity checkers in each player folder). `canvas-preview/` renders all 13 artboards as a normal page for accounts without the Design canvas type.
- **Docs:** `spec.md` and `rig-final/RIG.md` are current; the lat pulldown's decisions D1-D3 are applied in `spec.md` 3.2 and its checks are plain checks.
- **Decisions** taken during the upgrade are in `docs/COACHING-DECISIONS.md` (D-S1..D-S5, D-L1..D-L12, D-R1..D-R6, D-P1).
- **Next:** the app build, planned in `docs/GUIDE-UPGRADE-ARCHITECTURE.md` section 5.0 (R1) with task card GU-7a.
