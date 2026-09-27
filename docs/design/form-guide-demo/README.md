# Form guide demo: design source

This folder holds the full source of the rendered demo canvas: the owner's SPLIT 1 UPPER BODY with 3 animated exercises. The design itself is `docs/GUIDE-UPGRADE-ARCHITECTURE.md`. This is a demo only, with no app code.

- `UPGRADE-BRIEF.md`: the next task, which makes the motion smoother and the figure more detailed. It also explains how the builds work.
- `spec.md`: the screens, copy, tokens and each exercise's truth table.
- `rig-final/RIG.md`: the shared figure rig. The low-poly style won the judging.
- `anim-*/PLAYER.md`: each animated player (keyframes, zooms, Pictures poses and QA history).
- `project/*.dc.html` and `canvas.json`: the canvas files as published on 2026-09-27.
- `FORMAT-RULES.md`: the canvas file format.

## Status (2026-09-27)
- **Machine Chest Press:** passed QA round 3.
- **Dumbbell Lateral Raise:** passed QA round 2. The final canvas pass rebuilt its zoom chips from its PLAYER.md.
- **Lat Pulldown:** all 9 round-2 issues are fixed in round 3.
  - Its QA reads "fail" only because `spec.md` 3.2 still has the old values.
  - The supervisor signed off decisions D1-D3 (`anim-lat-pulldown/PLAYER.md` §9). They agree with spec.md's own key-pose table: an end elbow of about 30-35°, not the 65-75° in the prose.
  - **PLAYER.md §9 wins over spec.md 3.2.**
  - One low, non-blocking issue is left: the far elbow starts and stops a little sharply.
- **Known doc lag:** `spec.md` 3.1 and `rig-final/RIG.md` §9 and §15-19 still hold the older chest press numbers. The current ones are in `anim-machine-chest-press/PLAYER.md` §3 and §13.
- **Owner feedback:** the owner likes the demo but wants smoother motion and more figure detail. See `UPGRADE-BRIEF.md`.
