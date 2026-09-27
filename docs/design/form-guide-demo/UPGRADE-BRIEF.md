# Upgrade brief: smoother motion, more detailed figure

The task for whoever upgrades the 3 animated form-guide players next. Update this file in place.

## What the owner asked (2026-09-27)
"Improve the animation more, i like it but more smooth and details on figure." The owner's screenshots showed the Dumbbell Lateral Raise (front view) and the Machine Chest Press (side view). The owner likes the design; keep its look, controls and layout.

## Scope
- In: the shared figure rig, the 3 players, and their 3 canvas artboards.
- Out: app code (`src/`, `tests/`, `scripts/`), the flow and theme artboards, and new features. This is a design demo only.

## Where everything is (this folder is the full, working source)
- `rig-final/gen.mjs`: the shared rig and the one source of timing. `node rig-final/gen.mjs` writes `chest-press.html`, `lateral-raise.html`, `parts.html`, `poses.json` and the generated block in `RIG.md`.
- `anim-machine-chest-press/build.mjs`: copies the rig into `rig/`, runs it, and writes `index.html` (the test harness) and `PLAYER.md`.
- `anim-dumbbell-lateral-raise/build.mjs`: builds from `rig-final/lateral-raise.html` and `poses.json`, and writes `index.html` and `PLAYER.md`.
- `anim-lat-pulldown/gen.mjs`: a standalone rig for this player. It writes `index.html`, `poses.json` and `PLAYER.md`.
- `*/shoot.cjs`: the checks and screenshots for each player (Playwright). Each writes `checks.txt` and saves shots in `shots/`, which git ignores. `quick.cjs` and `crop.cjs` are helpers.
- `project/*.dc.html` and `project/canvas.json`: the published canvas files, which are what the owner sees. The 3 `Player-*.dc.html` files were assembled from each player's pieces (PLAYER.md, Pieces A-C) and then edited for the canvas (text zoom `--tz`, fonts). A rebuild does NOT update them, so carry every change into them by exact-match edits.
- `FORMAT-RULES.md` holds the canvas file format rules. `spec.md` holds the screens and each exercise's truth table.

Verified on 2026-09-27 from a fresh copy of this folder:
- all 4 build commands reproduce the committed files byte for byte;
- `node anim-machine-chest-press/shoot.cjs` → ALL CHECKS PASSED.

The `shoot.cjs` scripts load Playwright from `/home/user/M-arc/node_modules/playwright`, so run `npm ci` in the repo root first, or change that path. The browser is `/opt/pw-browsers/chromium`.

## Why the motion looks jerky today
`rig-final/gen.mjs:239-244` times each move with `inOut`, which is two cubic-bezier halves (`easeIn .4,0,1,1` / `easeOut 0,0,.6,1`). The poses are sampled into keyframe stops joined by straight lines, so speed changes in steps between stops. `anim-lat-pulldown/gen.mjs:240-241` has the same timing. Its known leftover is that the far elbow starts and stops a little sharply.

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
4. **A numeric smoothness check,** added to the rig's and each player's `shoot.cjs`. Sample every drawn joint angle and the grip point 120 times per second of real time via `?t=`. It passes only if:
   - speed is zero at every phase boundary;
   - during motion, no frame-to-frame acceleration is more than 3× that phase's median;
   - no joint angle changes by more than 4° between two samples 1/120 s apart, at 1× speed.

   Print the numbers.

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
   - lat pulldown in its own `gen.mjs`, with the same changes.
3. Carry each player into its `project/Player-*.dc.html`. The harness (`index.html`) and the artboard must match.
4. Clear the doc lag in `spec.md`, and keep the one doc per topic:
   - Apply `anim-lat-pulldown/PLAYER.md` §9 (decisions D1-D3, signed off) to section 3.2.
   - Apply the chest press numbers from `anim-machine-chest-press/PLAYER.md` §3 and §13 to section 3.1 and to `RIG.md` §9 and §15-19.

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
- **Canvas:** the owner's canvas is private to the owner.
  - If the owner shares it with your account with **edit** access, read it first, then republish only the changed files under `project/`.
  - Otherwise, create a new Design canvas from these `project/` files and give the owner its link.
- **Code:** commit the source changes on a `claude/*` branch with a draft PR, and update this brief and `README.md` in place. If you can't push, give the owner a patch file.
- **Rules:** follow `AGENTS.md`. Never touch app code, keys or secrets, or `main`.
