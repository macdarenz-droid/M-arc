# Form guide demo: design specs

These are the source specs behind the rendered demo canvas (the owner's SPLIT 1 UPPER BODY, with 3 animated exercises). The design itself is `docs/GUIDE-UPGRADE-ARCHITECTURE.md`. Demo only: no app code.

- `SPEC.md`: the screens, copy, tokens and per-exercise truth tables.
- `RIG.md`: the shared figure rig. The low-poly style won the judging.
- `PLAYER-*.md`: each animated player (keyframes, zooms, Pictures poses, QA history).
- The live artboards are the canvas files `project/*.dc.html`. Read them with the Artifact tool from the canvas the supervisor handoff names.

## Status (2026-09-27)
- **Machine Chest Press:** QA round 3 PASS.
- **Dumbbell Lateral Raise:** passed in round 2. The final canvas pass rebuilt its zoom chips from its PLAYER.md.
- **Lat Pulldown:** all 9 round-2 issues fixed in round 3.
  - Its QA reads "fail" only because SPEC.md 3.2 still has the old values. The supervisor signed off decisions D1-D3 (PLAYER-lat-pulldown.md section 9), because they agree with SPEC.md's own key-pose table: an end elbow of about 30-35°, not the 65-75° in the prose.
  - **PLAYER-lat-pulldown.md section 9 wins over SPEC.md 3.2.** Apply its ready edit to SPEC.md before porting.
  - One low, non-blocking issue is left: the far elbow starts and stops a little sharply.
- **Known doc lag:** SPEC.md 3.1 and RIG.md sections 9 and 15-19 still hold the older chest press numbers. PLAYER-machine-chest-press.md sections 3 and 13 hold the current ones.
