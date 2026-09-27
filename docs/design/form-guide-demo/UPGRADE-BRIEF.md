# Upgrade brief: smoother motion, more detailed figure

The task for whoever upgrades the 3 animated form-guide players next. Update this file in place.

## What the owner asked (2026-09-27)
"Improve the animation more, i like it but more smooth and details on figure." The owner's screenshots showed the Dumbbell Lateral Raise (front view) and the Machine Chest Press (side view). The owner likes the design; keep its look, controls and layout.

## Status (2026-09-27, upgrade built; final numbers in the PR body of #36)
Done on branch `claude/marc-form-guide-smoothness-fiuy2y` (draft PR #36 into `claude/marc-regression-architecture-gegkbq`):
- **Smoothness check:** `smooth-check.cjs` (shared), wired into the rig's and every player's `shoot.cjs`. Proof that it bites: `smoothness-before.txt` holds its output on the original build (30 failures; e.g. chest press lift (a) 26 %, (b) 29 %, (c) 7.3x; lat pulldown (b) 93 %, (c) 19.5x). On the upgraded build every player passes; worst values after round 3 (the lat pulldown each time): (a) 0.12 %, (b) 6.79 %, (c) 2.39x, (d) 3.22 deg.
- **Timing:** minimum-jerk moves; a pose every 0.5 % of the rep, 0.25 % in the 1 s lift (the fallback below, taken for headroom: decisions D-L2, D-R1); 4-decimal keyframes (D-S3). The chest press keeps its hand on a fitted pace curve (D-S4); the lat pulldown's path, elbow direction and shoulder blades are single fitted curves (`anim-lat-pulldown/fit-motion.mjs`, D-L1).
- **Figure:** RIG.md §20 (head, clothing, muscle facets, hands that wrap the handle, 3-tone token shading, rim line, contact shadows, target-muscle glow on the move timing, torso secondary motion as facets, equipment detail); polish round 2 removed the elbow ring, thickened the forearm, made the thumb read at 1x, and rebalanced the tones (D-R1..D-R6).
- **Muscle info on tap (round 3, spec 2.10, RIG.md §21):** in all three players a tap on a coloured muscle opens one bubble with its common name, anatomical name, role and a one-line cue (dot in the muscle's colour, outline on the muscle); `rig-final/muscle-tap-check.cjs` runs in every `shoot.cjs`, and the canvas checkers probe the same taps on the artboards (D-R7..D-R12).
- **Three independent reviews** (one per player, 89-161 frames each) drove the polish round; their defects are all closed.
- **Canvas:** the 3 `Player-*.dc.html` files carried by exact-match edits; parity checkers for all three (`canvas-check.cjs` for the chest press and the lateral raise, `dc-stage.cjs` for the lat pulldown). `canvas-preview/` renders all 13 artboards as a normal page, published to the owner because this account has no Design canvas type (D-P1).
- **Docs:** the doc lag in step 4 of the order of work is cleared (spec 2.3, 2.4, 2.5, 3.1, 3.2, 3.5, 3.7; RIG.md §9, §15, §17).
- **Next:** the app build from `docs/GUIDE-UPGRADE-ARCHITECTURE.md` 5.0 (R1) and its card GU-7a.

## Scope
- In: the shared figure rig, the 3 players, and their 3 canvas artboards.
- Out: app code (`src/`, `tests/`, `scripts/`), the flow and theme artboards, and new features. This is a design demo only.

## Where everything is (this folder is the full, working source)
- `rig-final/gen.mjs`: the shared rig and the one source of timing. `node rig-final/gen.mjs` writes `chest-press.html`, `lateral-raise.html`, `parts.html`, `poses.json` and the generated block in `RIG.md`.
- `anim-machine-chest-press/build.mjs`: copies the rig into `rig/`, runs it, and writes `index.html` (the test harness) and `PLAYER.md`.
- `anim-dumbbell-lateral-raise/build.mjs`: builds from `rig-final/lateral-raise.html` and `poses.json`, and writes `index.html` and `PLAYER.md`.
- `anim-lat-pulldown/gen.mjs`: a standalone rig for this player. It writes `index.html`, `poses.json` and `PLAYER.md`.
- `*/shoot.cjs`: the checks and screenshots for each player (Playwright). Each writes `checks.txt` and saves shots in `shots/`, which git ignores. `quick.cjs` and `crop.cjs` are helpers.
- Shared checkers, required by every `shoot.cjs`: `smooth-check.cjs` (the smoothness check below), `rig-final/muscle-check.cjs` (the target muscle stays visible at the hardest point), `rig-final/caption-check.cjs` (the caption row never overflows; it draws with `rig-final/fonts/Roboto-latin.woff2`, OFL, harness-only, because the canvas uses Roboto and this sandbox cannot fetch Google Fonts).
- `anim-lat-pulldown/fit-motion.mjs`: refits the lat pulldown's motion constants when its path, grip or shoulder-blade geometry changes.
- Canvas checkers, which test the shipped artboard rather than the harness:
  - `anim-machine-chest-press/canvas-check.cjs` and `anim-dumbbell-lateral-raise/canvas-check.cjs` render the artboard with a stand-in canvas runtime, run its probes, and check parity with the harness (same CSS apart from the listed canvas-only edits, same keyframes, same stage);
  - `anim-lat-pulldown/dc-stage.cjs` compares `Player-LatPulldown.dc.html` with the harness rule by rule and writes `dc-render.html`;
  - `anim-lat-pulldown/indep.cjs <page.html>` measures either page;
  - `canvas-preview/` (`node build.mjs && node check.cjs`) renders all 13 artboards through a stand-in runtime and checks each player's stage against its harness.
- PLAYER.md files also name `work/` tools. Those were scratch files and are not kept, apart from the canvas checkers above.
- `project/*.dc.html` and `project/canvas.json`: the published canvas files, which are what the owner sees. The 3 `Player-*.dc.html` files were assembled from each player's pieces (PLAYER.md, Pieces A-C) and then edited for the canvas (text zoom `--tz`, fonts). A rebuild does NOT update them, so carry every change into them by exact-match edits.
- `FORMAT-RULES.md` holds the canvas file format rules. `spec.md` holds the screens and each exercise's truth table.

**Setup:**
1. Run `npm ci` in the repo root. The scripts find Playwright in the repo's `node_modules`.
2. Choose the browser the same way the repo's gate does: set `MARC_CHROMIUM` to a Chrome or Chromium binary, for example `MARC_CHROMIUM=/opt/pw-browsers/chromium` in Claude Code cloud sessions. Without it, the scripts use Playwright's bundled browser.

**Baseline before the upgrade, checked 2026-09-27 on a fresh copy (commit 5c0e884; the lat pulldown's exit 3 is gone since step 4 of the order of work):**
- all 4 builds reproduce the committed files byte for byte;
- the rig, chest press and lateral raise `shoot.cjs` scripts print ALL CHECKS PASSED;
- `canvas-check.cjs` and `dc-stage.cjs` pass;
- the lat pulldown `shoot.cjs` exits 3 with "NO FAILURES; 4 DECIDED". That is by design. Its four `decidedCheck(` calls (lines 33, 34, 38 and 44) mark spec values that decisions D1-D3 changed. The script does not read `spec.md`, so step 4 of the order of work changes those calls, and after that it must exit 0.

## Why the motion looked jerky before the upgrade
At 5c0e884, `rig-final/gen.mjs:239-244` timed each move with `inOut`, which is two cubic-bezier halves (`easeIn .4,0,1,1` / `easeOut 0,0,.6,1`). The poses are sampled into keyframe stops joined by straight lines, so speed changes in steps between stops. `anim-lat-pulldown/gen.mjs:240-241` has the same timing. Its known leftover is that the far elbow starts and stops a little sharply.

## Smoothness target (apply exactly)
1. **Timing:** replace `inOut` with a minimum-jerk profile for each move phase, `p(x) = 10x³ − 15x⁴ + 6x⁵`. Speed and acceleration are then zero at the start and end of every move, with no kink at mid-move. Keep the rep structure: lift 0-25%, hold to 37.5%, return to 87.5%, reset pause to 100%. Keep the 1 s up / 2 s down tempo unless a truth table says otherwise.
2. **Density:** solve a pose every 0.5% of the rep while the body moves. Holds need only their boundary stops. Join stops with straight lines, and keep the `-a`/`-b` restart pairs.
3. **Secondary motion:** subtle, inside the truth tables, and at most 3° unless the exercise needs more.
   - The torso braces slightly and the head stays steady.
   - The shoulder blades move naturally for each exercise:
     - lat pulldown: down and back;
     - chest press: they stay back;
     - lateral raise: the traps stay down.
   - The wrists stay neutral.
   - The equipment and the hands stay locked together at every stop.
   - It must not move anything an existing check holds fixed. Show the brace and the shoulder-blade movement as facet and shape changes inside the torso, not as joint moves. The checks cover:
     - the shoulder joint centres, with drift under 0.01 (`rig-final/shoot.cjs:84` and `:113`, `anim-machine-chest-press/shoot.cjs:82`, `anim-dumbbell-lateral-raise/shoot.cjs:95`);
     - the lateral raise's 15° elbow bend and level dumbbells (`anim-dumbbell-lateral-raise/shoot.cjs:99-100`).
4. **A numeric smoothness check,** added to the rig's and each player's `shoot.cjs`.
   - **How to sample:** read every drawn joint angle and the grip point via `?t=`, which freezes rep 1 at a fraction from 0 to 1 of the 4 s rep. Use steps of 1/480, which is 120 samples per second at 1×. Also read the keyframe stops themselves.
   - **It passes only if, for each move phase (lift and return), all of these hold:**
     - (a) Over the first and the last 1/120 s of the phase, the speed is at most 1% of the phase's top speed.
     - (b) The speed changes by at most 8% of the phase's top speed between two samples 1/120 s apart. Steps in speed are what the eye sees as judder.
     - (c) At the keyframe stops, the change in acceleration from one stop to the next is at most 3× its median over the phase. A spike means a kink. Apply this to angles that move at least 10° in the phase.
     - (d) No joint angle changes by more than 4° between two samples 1/120 s apart, at 1× speed.
   - **Print the numbers.**
   - **Prove the check first:**
     - it must FAIL on the current build before you change the timing;
     - it must PASS after;
     - record both outputs.
   - **Simulated numbers** (`python3 rig-final/smooth-sim.py`, on the rep progress curve as drawn):

     | Check | Today (`inOut`, 39 stops) | Target (min-jerk, 0.5% stops) |
     |---|---|---|
     | (a) | 12-14% | 0.05-0.2% |
     | (b) | 19-22% | 3-6% |
     | (c) | 4.0-5.5× | 2.2-2.3× |

     Density alone or min-jerk alone still fails (a).
   - **Why not a limit on raw acceleration at 120 samples per second:** straight lines between stops make it spike about 5× even on the perfect curve. Don't add that limit.
   - **If a joint angle fails while the progress curve passes,** fix the motion (for example the pole curve or the secondary motion). If (b) still fails, use 0.25% stops in the 1 s lift only, and keep each player under 450 KB. Never raise a limit.

## Figure detail target (same low-poly faceted style, readable at 358×460)
- **Head:**
  - skull and jaw shape, an ear, and in side views a subtle nose and brow line;
  - a darker hair cap;
  - no eyes or mouth, so it never looks uncanny;
  - a neck, with the trapezius sloping into the shoulders.
- **Clothing:**
  - a fitted T-shirt with a neckline and a sleeve hem at mid upper arm;
  - shorts with the hem above the knee, in a cloth tone distinct from skin;
  - shoes with a sole and a toe cap.
- **Muscles as facets:**
  - the deltoid cap (front, side and rear), pecs, lats, biceps, triceps and a forearm taper;
  - glutes, quads, hamstrings and calves;
  - rounded elbows and knees.
- **Hands:** a palm, four fingers that visibly wrap the handle, and a thumb. No blocky mitts.
- **Shading:**
  - 3 tones per surface (light, mid, dark), made with `color-mix()` from the theme tokens;
  - a thin lighter rim outline;
  - a soft contact shadow on the floor or seat;
  - tokens only: no hard-coded hex outside the token definitions.
- **Target muscle glow:** the accent glow on the target muscle (lateral delt, pecs or lats) rises with contraction on the same timing and is strongest at the hardest point. It never flashes.
- **Equipment:**
  - grip texture on the handles;
  - seat and back-pad seams;
  - weight plates with a selector pin;
  - the cable, with pulley rims;
  - dumbbells with hex heads and knurled handles.
- **Keep unchanged:**
  - every control, caption, zoom chip, Pictures tile and reduced-motion behaviour;
  - the player contract;
  - each `Player-*.dc.html` under 450 KB.

## Order of work
1. Upgrade the shared rig once in `rig-final/gen.mjs`, and document the new parts, tokens, sampler and check in `RIG.md`.
2. Rebuild each player on it:
   - chest press and lateral raise through their `build.mjs`;
   - lat pulldown in its own `gen.mjs`, with the same changes. Run `node gen.mjs`, then `node shoot.cjs`, then `node gen.mjs` again, because PLAYER.md is written from `checks.txt` and `measured.json`.
   - `anim-machine-chest-press/build.mjs` (32 calls) and `anim-dumbbell-lateral-raise/build.mjs` (16 calls) patch the rig through exact-match anchors (`one()`). If a rig change moves an anchor, the build stops with "expected 1 match". Update the anchor in the same commit, and never drop a patch.
3. Carry each player into its `project/Player-*.dc.html` by exact-match edits. The harness (`index.html`) and the artboard must match; prove it with the canvas checkers where they exist.
4. Clear the doc lag in `spec.md`, and keep the one doc per topic:
   - Apply `anim-lat-pulldown/PLAYER.md` §9 (decisions D1-D3, signed off; ignore its older "wait for sign-off" headings) to section 3.2.
   - Then turn the four `decidedCheck(` calls in `anim-lat-pulldown/shoot.cjs` (lines 33, 34, 38, 44) into `check(` calls, with the same conditions and the new spec wording, so it exits 0. The conditions stay exactly as they are.
   - Apply the chest press numbers from `anim-machine-chest-press/PLAYER.md` §3 and §13 to section 3.1.
   - In `RIG.md`, edit only the hand-written §9, §15 and §17: label their chest press numbers as the rig proof's own, and point to PLAYER.md §13 for the player's.
   - Leave `RIG.md` §16 (the rig's own check results) and §19 alone. §19 is generated: `node gen.mjs` rewrites it.
   - Update `spec.md` 2.3 (paint), 2.4 (rig) and the Easing column of 2.5 (now minimum-jerk) to match the new rig.

## Quality bar (per player, before publishing)
Use an independent check, not the builder's own word.
- **Frames:** 24 across one rep at 358×460 and device scale factor 3, in a dark theme and in Paper. Also capture:
  - every zoom and the Pictures mode;
  - the idle and ended states, with Roboto loaded as the canvas does;
  - 0.5× speed, where the computed duration doubles;
  - reduced motion, which shows static key poses.

  Look at every frame.
- **Checks:** the smoothness check and every existing `shoot.cjs` check pass.
- **Correctness:**
  - the truth table and range of motion hold;
  - the equipment is in the hands in every frame, and fixed joints stay fixed;
  - nothing is clipped, and the caption row never overflows.
- **Format:** `FORMAT-RULES.md` holds, colours are token-only, there is no script-built DOM, and each file is under 450 KB.

## Publish and hand back
- **Canvas:** the first demo canvas belongs to another Claude account, so you can't open or update it. Everything it holds is in `project/`.
  - Publish the upgraded demo as a **new** Design canvas on your own account, with all 13 artboards and `canvas.json` from `project/`.
  - Publish the files unchanged, with no design system added: they already use the tokens from `spec.md`.
  - Set `canvas.json` `createdOnFiles.at` to the current time.
  - Run all QA on the local files before publishing.
  - Give the owner the link, and say the canvas is private to your account.
  - If your account has no Design type, publish the 3 players' harness pages (`anim-*/index.html`) as a normal page instead, and say so.
- **Code:**
  - Branch from `claude/marc-regression-architecture-gegkbq` to a new `claude/*` branch, or use the `claude/*` branch your session is given.
  - Don't merge `origin/main` into it. That base is 40 commits behind main, so a merge would pull app code into the diff; AGENTS.md's merge-main step is for PRs into main. If the base branch moves, merge `origin/claude/marc-regression-architecture-gegkbq` instead.
  - Commit the source changes and open a draft PR into `claude/marc-regression-architecture-gegkbq`.
  - Update this brief and `README.md` in place. (Done: the Status section above.)
- **Relay:**
  - Post short progress notes to the M/ARC project's Relay.
  - When you finish, add one line to `LOG.md`: what changed, the commit and the check numbers.
  - No URLs or secrets in Relay.
- **Rules:** follow `AGENTS.md`. Never touch app code, keys or secrets, or `main`, and never merge anything.
