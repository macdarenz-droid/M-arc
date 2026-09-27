# Final shared rig: one low-poly figure for every form-guide player

Status: final rig for the 10 `Player-*.dc.html` artboards. Base: the winning "rig-lowpoly", with every must-fix item from both judges fixed and the listed grafts from "rig-pill" applied. Checked in Chromium on 2026-09-26 (section 16). QA round 1 fixes are in: pole vectors and the grip-x rule written out (sections 9 and 19), the dumbbell's place stated and its shapes added (sections 4, 7 and 19), the lateral raise Elbows chip re-centred (section 15), and a keep-clear rule for zoom views (sections 2 and 11).

## In plain words

- This is the recipe for the little person in every exercise demo: where each joint is, what each body part looks like, which theme colour paints what, and how it moves without an arm coming off or a hand leaving its handle.
- The chest press now starts with the handles further forward, so the elbow starts at about 90 degrees, as a real setup does. A blue line grows from where the handle starts to where it is now, so a beginner can see how far to push and where to stop.
- The same drawing makes the four "Pictures", so they always match the animation. When a phone is set to reduce motion, the pictures show in place of the animation, and nothing can switch it back on.
- In a close-up (a zoom chip), the rep counter and the view label step aside, so nothing moving slides under them, and the lateral raise "Elbows" close-up now keeps both elbows in view for the whole rep.
- Two working proofs: `chest-press.html` (side view) and `lateral-raise.html` (front view). Each is a full player: stage, captions, zoom chips, Play, speed, Animation or Pictures.

## 1. Files

| File | What it is |
|---|---|
| `gen.mjs` | The single source. Every point, joint, pose solve and keyframe lives here. It writes both harnesses, `parts.html`, `poses.json` and the generated block at the end of this file. Run `node gen.mjs`. |
| `chest-press.html`, `lateral-raise.html` | Harnesses, built the same way as an artboard (section 14): one root style string, class strings, and the artboard's logic class. A small stand-in for x-dc writes the logic's values into the page. |
| `parts.html` | Rest poses of the side, front and top views, plus framing guides for the 358 x 276 and 358 x 300 stages. |
| `shoot.cjs` | Every check (section 16) and every screenshot in `shots/`. Run `node shoot.cjs`; it exits 1 on any failure and writes `checks.txt`. |
| `poses.json` | Solved numbers: key poses, truth-table angles, contrast table. `shoot.cjs` reads it. |
| `quick.cjs`, `crop.cjs`, `montage.py` | Viewing helpers (one screenshot, a 4x crop, a contact sheet). Not deliverables. |
| `qa-r1/`, `qa-r2/` | QA evidence: the first review's shots, and the contact sheets used to check this round's fixes. Not deliverables. |

Harness query (stands in for props and state, harness only): `?theme=<id>&t=<0..1>&zoom=<chip>&mode=pics&loop=0&autoplay=0&speed=0.5`. `t` freezes rep 1 at that point (it sets `--play: paused` and `--delay` in the same root style string the artboard uses).

## 2. Stage, camera and framing

- Player stage: 358 x 276 CSS px (spec 2.2), `<svg class="scene" viewBox="0 0 358 276">`, so 1 rig unit = 1 CSS px. The stage border is a `::after` overlay (`inset: 0`, 1px `--border-subtle`), so the SVG never shifts by the border (a shifted SVG moves every `transform-origin` by about 0.3 units).
- A 358 x 300 stage (the machine guide, spec 4) uses the same scene: set `viewBox="0 0 358 300"`, wrap the scene in one static `<g transform="translate(0 24)">`, and the floor moves to y 282. A 358 x 180 still (warm-up) uses the same scene with a viewBox crop, like the Pictures tiles. The player itself stays 276 tall: at 300, the hint row would end at 476, past the 460 root.
- Floor: `<line class="floor">` from x 16 to 342 at y 258 (`--border`, 1 unit).
- Keep clear, unzoomed (dashed boxes in `parts.html`): the rep pill plus "Slow motion" pill, x 10-182, y 10-34; the camera label, x 250-348, y 10-28. Safe area for figure and moving equipment: x 16-342, y 40-258. Static frame parts (a stack, a top beam) may sit under the pills only if nothing there moves.
- Keep clear, zoomed: while a zoom chip is on, the rep pill row and the camera label are hidden (`showRepPill` and `showCamLabel` are false), so a zoomed scene can use the whole stage. The only overlay is the caption bubble, x 12-346, y 210-264 (stage px, after the zoom). The chip's subject (its ring, outline or path) must stay inside the stage and above the bubble for the whole rep; `shoot.cjs` measures this at 41 phases for every chip.
- Camera per exercise, from spec section 9: side view for presses, pulls, curls and pushdowns; front view for the lateral raise; top view for the rear delt fly and Around the World; three-quarter view for arm circles. The camera label says it ("Side view", "Front view", "Top view", "Three-quarter view").
- Placing the figure: ONE static wrapper per figure layer, `<g transform="translate(Hx Hy)">`, where (Hx, Hy) is the rig origin on the stage. Every `transform-origin` inside stays in rig units. Checked in Chromium: with `transform-box: view-box`, origins are read in the element's local frame, so they stay right under a translated parent.
- Framing rule: stand or sit the figure so its feet are on the floor (y 258) and its working joint sits near the stage centre line (x 150-179). Moving equipment must stay inside the safe area over the whole rep; `shoot.cjs` checks every scene group at t 0, 0.125, 0.25 and 0.625.

## 3. Joints and proportions (rig units)

| Segment | Length | Drawn width |
|---|---|---|
| Head | about 20 wide (23 with the nose, side view) x 23.5 tall | |
| Neck | 4 to 6 visible | 9 to 13 |
| Torso, hip joint to shoulder joint | 62 | side 26 to 28 deep; front 42 at the shoulders, 28 at the waist |
| Upper arm | 38 | 11 to 12 |
| Forearm, elbow to grip centre | 40 | 9.6 to 7.2 |
| Thigh | 50 | 17 to 12 |
| Shin, knee to ankle | 47 | 11 to 8 |
| Foot | sole at ankle + 5 (y 102); side view heel -6 to toe 17.5 | |

| Joint (rest pose) | Side view (origin = hip joint, faces +x) | Front view (origin = midway between the hips; screen-right shown, left = negate x) | Top view, seated or standing (origin = midway between the shoulders, faces -y) |
|---|---|---|---|
| Hip | (0, 0) | (10, 0) | under the torso, not drawn |
| Shoulder | (0, -62) | (22, -62) | (22, 0) |
| Elbow | (0, -24) | (22, -24) | (22, 38) |
| Grip centre | (0, 16) | (22, 16) | (22, 78) |
| Knee | (0, 50) | (10, 50) | not drawn |
| Ankle | (0, 97) | (10, 97) | not drawn |
| Head centre | (3, -82) | (0, -83) | (0, -2) |

Every limb is drawn hanging straight down (+y) in its local frame. Poses come only from rotations about these joints, plus foreshortening scales; shapes are never redrawn per pose.

A lifter lying face up and seen from above (Around the World) is seen from the front, so that move uses the front-view parts and joints. Three-quarter view (arm circles): front-view parts with the torso, neck and head group `scaleX(0.91)` about x 0 (shoulders 40 apart, as spec 3.10), and the far arm in the far tones of section 5.

## 4. Group nesting (copy this exactly)

Class `j` = `transform-box: view-box`. Class `anim` = the shared animation settings (section 8). Each moving group also has its own class, which sets `transform-origin` and the `-a`/`-b` animation names. `XX` = the exercise prefix (`cp`, `lr`, and so on).

Side view, near arm (the only arm drawn: in a true side view the far arm hides behind it):

```html
<g class="figure-arm" transform="translate(150 206)">          <!-- rig origin = hip on the stage -->
  <g class="j anim XX-ua">                                     <!-- origin 0,-62; rotate(-phi) -->
    <g class="j anim XX-ul">[upperArm OUTLINE]</g>[deltoid OUTLINE]
    <g class="j anim XX-ul">[upperArm FILL]</g>[deltoid FILL]  <!-- XX-ul: scaleY(fu) about 0,-62 -->
    <g class="j anim XX-fa">                                   <!-- origin 0,-24; translateY(-(1-fu)*38px) rotate(-(psi-phi)) -->
      [elbowCap OUTLINE]<g class="j anim XX-fl">[forearm OUTLINE]</g><g class="j anim XX-hd">[fist OUTLINE]</g>
      [elbowCap FILL]<g class="j anim XX-fl">[forearm FILL]</g>   <!-- XX-fl: scaleY(ff) about 0,-24 -->
      <g class="j anim XX-hd">[fist FILL][held bar or dumbbell][grip ring overlay]</g>  <!-- XX-hd: translateY(-(1-ff)*40px) -->
    </g>
  </g>
</g>
```

Side view, leg (static inline transforms; standing = no rotations; seated shown):

```html
<g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)">[hipCap][thigh]
  <g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)">[kneeCap][shin][foot]</g>
</g>
```

Front view, one arm (screen-right `-r`; screen-left `-l` uses mirrored points, negated angles, origin x negated):

```html
<g class="j anim XX-ua-r">                        <!-- origin 22,-62; rotate(-A) raises the arm out to the side -->
  [upperArmR OUTLINE][deltoidR OUTLINE][upperArmR FILL][deltoidR FILL]
  <g class="j XX-fa-r">                           <!-- origin 22,-24; rotate(+bend), static or animated -->
    [elbowCapR OUTLINE][forearmR OUTLINE][fistR OUTLINE][elbowCapR FILL][forearmR FILL][fistR FILL]
    [elbow ring overlay]
    <g class="j anim XX-db-r">[dumbbell]</g>      <!-- origin 22,16 (the grip); rotate(A - bend) keeps it level on screen;
                                                     end face centred at (22,21), 5 below the grip: shapes in section 19 -->
  </g>
</g>
```

When a front-view arm moves toward the camera (a front raise), add the `ul`, `fl` and `hd` groups exactly as in the side view.

Top view, one arm (seated or standing lifter, camera above): the same nesting as the side view with the top-view parts, `ua-r` origin (22, 0), `ul-r` origin (22, 0), `fa-r` and `fl-r` origin (22, 38), `hd-r` translate only. At rest the arm points +y (toward the hips). Pointing forward is `rotate(180deg)`. The screen-right arm sweeps out with `rotate(180deg + sigma)` and the screen-left arm with `rotate(180deg - sigma)`. So spec 3.6 angles, which it measures from "arms pointing forward", become `180 + spec angle`. Arm height above or below the shoulder shows as `ul` `scaleY(cos elevation)`. The torso, then the head, are separate layers drawn over the shoulder ends of the arms.

Draw order inside a scene, back to front: floor; machine back parts (base, stack, frame, cable, pulley); far-side group `translate(5 -3)` (far lever, far leg; never a far arm); seat and pads; body layer (torso, neck, head, near leg); near lever, handle and hub; path guide and progress trail; near arm; static zoom overlays. Front view: floor, body layer (legs, neck, torso, head), path guide and trail, screen-left arm, screen-right arm.

Held equipment: free weights (dumbbell, bar) live INSIDE the hand group, so the grip can never come apart. Machine handles live in the MACHINE (on the lever), because a lever turns about its own pivot, and the hand is solved onto the handle at every baked sample (section 9).

## 5. Paint: which token paints what

Every value is a theme token or a `color-mix()` of tokens. The derived variables sit on `.player` in the page CSS. The two theme-dependent rig variables, `--fg-line` and `--fg-frame`, are written by `rigVars(theme)` into the root style string next to `themeVars(theme)`, because artboards never set a `data-theme` attribute.

| Role | Class | Fill | Stroke (visible width) |
|---|---|---|---|
| Body | `b` | `--body` = `color-mix(in srgb, var(--map-body) 88%, var(--text))` | outline pass `olk`: `--fg-line` = text 60% (dark) or 70% (light) into `--surface-1`, 3 under the fill, so 1.5 shows |
| Low-poly facet | `fc` | `--body-facet` = map-body 78% into text | `--map-line` 0.6 |
| Main muscle | `mm` | `var(--accent)`, opacity 0.75 to 1 with the lift (effort cue) | text 35% into transparent, 0.6 |
| Helper muscle | `mh` | `--muscle-help` = accent 45% into `--body` | same |
| Far leg (depth cue) | `bf` / `olkf` | `--body-far` = map-body 50% into surface-1 | `--fg-line-far` = text 30%, 2.4 under (1.2 shows) |
| Frame, pads, plates, rails | `eq` | `var(--surface-3)` | `--fg-frame` = text 38% (dark) or 56% (light) into surface-1, 1.1 |
| Moving metal: lever, pulley, dumbbell heads, bracket | `eqm` | `var(--surface-3)` | `--fg-metal` = text 72% into surface-1, 1.2 |
| Handle grip, dumbbell end cap | `hd` | `--fg-metal` | none |
| Far lever and far handle | `eqf` / `hdf` | `--body-far` / `--fg-line-far` | `--fg-line-far` 1.1 |
| Stack pin | `pin` | `var(--accent)` | none |
| Guide rods | `rod` | none | `--fg-frame` 1.1 |
| Cable | `cable` | none | `--fg-cable` = text 55% into surface-1, 1.25, round caps |
| Hand path guide | `guide` | none | accent 1.5, dashed 4 3, opacity 0.6 |
| Progress trail | `trail` | none | accent 2, round caps, `pathLength="1"`, `stroke-dasharray: 1 1`, animated `stroke-dashoffset` |
| Zoom overlays, direction arrows | `ovs`, `arrow`, `arrow-head` | head: accent | accent 2, round caps and joins |
| Floor | `floor` | | `--border` 1 |

Accent is used only for the working muscles, the stack pin, the path guide, the progress trail, zoom overlays and direction arrows. Handles are metal (spec 2.3). Body, facet, muscle, equipment, rod, cable and floor strokes use `vector-effect: non-scaling-stroke`, so foreshortening never thickens or thins a line. Their widths are `calc(var(--sw) * N px)`: `--sw` is 1 on the stage and 0.75 in Pictures tiles. Guides, trail and overlays scale with the zoom camera on purpose (they get bolder when zoomed).

Two-pass layers (one outline per layer): each body LAYER draws every part's outline first (`olk`, 3 wide), then every part's fill, facets and muscles, inside the same groups. The fills hide the inner half of each stroke, so only the layer's silhouette keeps a 1.5 outline, and no seam shows where parts overlap (deltoid over upper arm, elbow, hip, knee). Layers: body (torso, neck, head, near leg), upper arm (upper arm and deltoid, inside `ua`), lower arm (elbow cap, forearm, fist, inside `fa`). The lower arm is drawn over the upper arm, so the elbow keeps a round joint line. Top view: the head is its own layer over the torso. Equipment keeps plain centred strokes.

Contrast is measured, not guessed: see the table in the generated block. The figure outline is at least 4.6:1 on the stage and at least 3.1:1 over the body (an arm over the torso) in every theme; the machine frame is at least 3.18:1. In Paper the outline is 70 % text (dark themes 60 %), because the lifted body fill is darker than the stage there, and 60 % gave only 2.46:1 over the body. `--map-line` alone is about 1.6:1 at this size, so it paints only the inner facet lines, as on the app's muscle map.

## 6. Muscles and the effort cue

- Each part lists regions (generated block). A region paints `mm` if the exercise gives that muscle the role "main", `mh` if "helps", `fc` if it is marked as a facet, and nothing otherwise. Names: `chest`, `abs`, `obliques`, `lats`, `midBack`, `upperTraps`, `frontDelts`, `sideDelts`, `rearDelts`, `biceps`, `triceps`, `forearms`, `quads`, `calves`.
- Regions on the arm move with the arm (side delts face up when the arm is raised, as in life). The far leg shows no muscles.
- Effort cue: main-muscle polygons carry `anim XX-eff`, a flat opacity animation from 0.75 at the setup pose to 1.0 at the end pose, on the same samples. It never drops below 0.75, because the muscle still works in the stretched position. No glow and no halo.

## 7. Equipment drawing style

- Machines: frame, columns, beams and rails are rounded rectangles (`rx` 1.5 to 2) in `eq`. Pads are rounded rectangles (`rx` 4) in `eq`. Seat posts and brackets are plain `eq` rectangles. Draw only what explains the move: the frame that holds the moving part, the part the body touches, and the weight.
- Weight stack: 10 plates, each 48 x 12, with 1.5 gaps, from y 112.5 (x 26-74); guide rods at x 32 and 68. The pin (accent, 9 x 4, `rx` 2) goes in plate 6, and plates 1 to 6 move as one group (`XX-stack`, translateY). A top bracket (`eqm` 10 x 6.5) sits where the cable pulls. The stack lift is half the handle travel (a 2:1 cam).
- Levers: an `eqm` bar 5.2 wide from the pivot to the handle, a hub circle r 7 (`eqm`) with an r 2 `rod` centre on top, and the handle as a vertical `hd` grip 6.4 x 26 (`rx` 3), so it shows above and below the fist. The whole lever is one group rotating about the pivot.
- Cables and pulleys: pulleys are `eqm` circles r 5.2 to 6. Cables are `cable` lines tangent to the pulleys. A vertical run that shortens with the stack uses `scaleY((run - lift) / run)` about its top end, on the same samples.
- Dumbbells, front view (seen end-on from a little above): a hex end face (r 8, `sy` 0.92, `eqm`), a 3.8-deep top band (`eqm`) and an `hd` end cap (hex r 2.7). All three are centred at (22, 21) in the arm's frame (screen-left: -22, 21), 5 units below the grip and rotation point (22, 16), so the fist shows above the weight. Copy the three polygons from section 19; do not centre them on the grip. The dumbbell counter-rotates by minus the sum of the arm rotations, so it stays level. Side view: two `eqm` hex heads (r 7) joined by a 4-wide `hd` handle, held in the fist. Top view: a bar with two heads, 22 long, across the palm (spec 3.9).
- Bench: an `eq` rounded rectangle (`rx` 6) for the pad on two `eq` legs; top view: the pad only, x 161-197 (spec 3.9).
- Bars (lat pulldown): an `hd` bar 44 wide seen a little from the front (a 4-tall rounded rectangle), hung on a `cable` from a pulley.
- Far side: only the far leg and the far lever or handle, offset `translate(5 -3)`, in the far tones. Never a far arm or far hand: at 2x zoom it reads as a second hand. The far lever hides while the Grip chip is on (`.zoom-grip .far-lever { opacity: 0 }`).

## 8. Motion: variables, timing and restart

Root style string (the artboard's `style` hole on the root):

`width:358px;height:460px;` + `themeVars(theme)` + `;` + `rigVars(theme)` + `;--play:running|paused;--dur:<rep seconds>s;--iter:3|infinite;--sets:1|infinite;--delay:<seconds>s`

| Variable | Meaning |
|---|---|
| `--play` | `running` or `paused`, for every animated element |
| `--dur` | one rep: 4 s at 1x, 8 s at 0.5x (Around the World 5 s, Arm Circles 2 s) |
| `--iter` | figure, equipment and captions: 3 (inside About, bounded) or `infinite` (loop on) |
| `--sets` | rep pill (one 3-rep cycle): 1 or `infinite` |
| `--delay` | 0s normally. A negative value starts part-way through the rep; Pictures tiles and stills use it to pick a pose. |
| `--sw` | stroke scale: 1 on the stage, 0.75 in tiles |

Shared rules:

```css
.j{transform-box:view-box}
.anim{animation-duration:var(--dur);animation-delay:var(--delay);animation-play-state:var(--play);animation-iteration-count:var(--iter);animation-fill-mode:both;animation-timing-function:linear}
.capx{/* same as .anim */animation-timing-function:step-end}
.repx{animation-duration:calc(var(--dur) * 3);animation-delay:var(--delay);animation-play-state:var(--play);animation-iteration-count:var(--sets);animation-fill-mode:both;animation-timing-function:step-end}
```

- Rep timing (spec 2.5): lift 0-25 % (mid pose at 12.5 %), hold to 37.5 %, return to 87.5 % (mid at 62.5 %), reset pause to 100 %. The spec's ease-in then ease-out pair is baked into the samples, so keyframes play linear between samples.
- Rep time u (0 to 1) to move progress p (0 = setup pose, 1 = end pose): u <= 0.25: p = inOut(u / 0.25); u <= 0.375: p = 1; u <= 0.875: p = 1 - inOut((u - 0.375) / 0.5); after that p = 0. inOut(x) = 0.5 easeIn(2x) for x < 0.5, else 0.5 + 0.5 easeOut(2x - 1); easeIn = `cubic-bezier(.4,0,1,1)`, easeOut = `cubic-bezier(0,0,.6,1)`. Every keyframe stop is a pose solved at p(u).
- Baked samples: every 1.25 % during the lift and every 3.125 % during the return, 39 stops per group. Reason: with only three key poses, two joints turning at once swing the hand several units off the handle between poses. Measured with samples: at most 0.075 units in the browser.
- Restart with two keyframe sets: every `@keyframes` is written twice, `name-a` and `name-b`. The root carries `class="player gen-{{ gen }}"`, and each moving class has `.gen-a .XX-ua{animation-name:XX-ua-a}.gen-b .XX-ua{animation-name:XX-ua-b}`. Changing `gen` changes every animation's name, which restarts it from 0 %. Flip `gen` on Replay, on a speed change, on a mode change, and when a Pictures still opens or closes. The class goes on the ROOT, not on the stage, because the captions and the rep pill live outside the stage.
- Captions: four spans stacked in one grid cell (`.stack`), each `capx c1..c4` with hard-step opacity keyframes (0-25 %, 25-37.5 %, 37.5-87.5 %, 87.5-100 %). The rep pill uses three `repx r1..r3` spans over one 3-rep cycle. They share the figure's variables, so they cannot drift from it.
- Paused before the first Play = the 0 % keyframe = the setup pose. After 3 reps (loop off), fill-mode keeps the 100 % frame, which equals 0 %. The logic's 200 ms timer then sets `ended`, and the button becomes Replay.
- Speed: the change restarts from the setup pose (a `gen` flip) and keeps playing. Changing `animation-duration` mid-rep would make the figure jump.

## 9. Solving poses

- Angles: in side and top views, measured from straight down (+y), positive toward +x. SVG `rotate(θ)` is positive clockwise, so the upper-arm rotate = `-phi` and the forearm rotate (relative) = `-(psi - phi)`.
- Arms in the camera plane (curls, pushdowns, lateral raise): a 2D 2-bone solve, or plain forward angles as the spec gives them.
- Arms that leave the camera plane (presses, rows, rear delt fly, Around the World, arm circles): the 3D pole-vector solve (`solve3` in `gen.mjs`, from rig-pill). Inputs: shoulder S and grip G in 3D (z = sideways, out from the body midline toward the camera for the near arm), lengths 38 and 40, and a pole direction for the elbow. The elbow sits on the circle of possible elbows, at the point nearest the pole. Drawn lengths are the projections: `fu = |E - S|xy / 38`, `ff = |G - E|xy / 40`. Keyframes: `ua` rotate(-phi), `ul` scaleY(fu), `fa` translateY(-(1 - fu) x 38) rotate(-(psi - phi)), `fl` scaleY(ff), `hd` translateY(-(1 - ff) x 40).
- Choosing the pole: pick the setup elbow you want, set `pole0` = direction from the shoulder to that elbow, and blend to `pole1` for the end pose: `pole(p) = norm((1 - p) pole0 + p pole1)`, normalised at every sample. The chest press picks the setup elbow (149, 166), 1 unit behind and 22 below the shoulder, so fu = 0.58 and the elbow stays off the back pad. Its z is whatever keeps the upper arm 38 long: 30.97.
- Chest press numbers (also printed from the build in section 19): `pole0 = norm([-1, 22, 30.97])`, `pole1 = norm([-0.1, 0.6, 0.8])`. p is linear in grip x: `x = 187 + 39 p`; grip y = `58 + sqrt(100^2 - (x - 206.5)^2)`; lever rotate = `-asin((x - 206.5) / 100)`; grip z = `38.56 - 32.56 p` (38.56 = the elbow's 30.97 plus the forearm's sideways part at setup; 6 at the end). With these, the shoulder (150, 144, 0) and the lengths 38 and 40, `solve3` gives every elbow in the key-pose table.
- Sideways hand path: z runs straight from start to end with the move (chest press: 38.6 to 6), so the hands move steadily inward and the rig stays correct if it is reused for a top or three-quarter camera.
- Check every new move against its spec truth table in numbers: elbow inside angle (3D), arm out from side (`asin(Ez / 38)`), arm forward (`atan2(Ex - Sx, Ey - Sy)`). `gen.mjs` writes them into `poses.json` and the table below; `shoot.cjs` fails the build if they leave range.

## 10. Path guide and progress trail

- The guide is the full hand path, dashed. The progress trail is the same path drawn solid in accent, from the start to where the hand is now: `pathLength="1"`, `stroke-dasharray: 1 1`, and `stroke-dashoffset` animated from 1 to 0 with the move (baked on the same samples as the arm, as the share of path length covered).
- The path follows the bottom tip of what the hand holds, so the forearm never hides it. Chest press: the handle's bottom end (lever radius 100 + 13). Lateral raise: the grip path moved 14 down, just under the dumbbell.
- During the return the trail shrinks back with the hand, so it always shows how much of the range is done and where to stop.

## 11. Zoom camera, overlays and the caption bubble

- The scene sits in `<g class="cam zoom-{{ zoom }}">`. Each chip has one CSS rule: `.cam.zoom-<id>{transform:translate(179px,138px) scale(s) translate(-cx px,-cy px)}` with `transform-box: view-box; transform-origin: 0 0; transition: transform 320ms cubic-bezier(.32,.72,0,1)`. The animation keeps running while zoomed.
- Overlays start at `opacity: 0` (150 ms fade) and show with `.zoom-<id> .ov-<id>{opacity:1}`. Grip: an accent ring r 12 inside the hand group, so it follows the hand. Path: the always-on guide and trail. Parts (seat, elbows, shoulders): an accent 2-unit outline on that part, or a guide line lifted 4 to 5 units off it when the part already carries a muscle tint (lateral raise Shoulders), plus direction arrows where the cue is a direction ("keep down").
- Put the chip target where the subject is, so it lands at the stage centre (179, 138), above the bubble. When the subject is a pair (both elbows, both shoulders), centre on the midline between them, so both stay in view for the whole rep. Then check the keep-clear rule in section 2 for the whole rep, not one frame.
- While a chip is on, the rep pill row and the camera label hide, so nothing moving passes under them in a close-up. They come back when the chip is turned off.
- Caption bubble (spec 2.2): absolute, left 12, right 12, bottom 12; `--surface-2`, 1px `--border`, radius `--radius-md`, padding 8px 12px, 13px/18px `--text`, then an 8px `--accent` dot (margin-top 5) and the chip's caption. It shows only while a chip is on.

## 12. Pictures mode

- Grid: absolute over the stage (`inset: 1px`), padding 6, gap 6, 2 x 2 tiles of 169 x 128, `--surface-1` behind, radius `--radius-lg`. Tile: `--surface-2`, radius `--radius-md`. Top to bottom: the pose picture (169 x 90), then the caption (12px/16px `--text-2`, at most 2 lines, padding 0 8 6). The badge is an 18px circle at 6,6: `--accent-soft` laid over `--surface-2` (opaque, so machine parts never show through it), a 2px `--surface-2` ring, and an `--accent` 11px/700 number.
- The pictures are the rig itself, not copies: wrap the whole scene in `<g id="rig-XX">` (unique per player) and draw each tile as `<svg viewBox="<tile box>"><use href="#rig-XX" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -<pose>)"/></svg>`. The pose comes from the `use` element's own variables, so no extra keyframes and no static pose markup are needed. Checked: the four tiles render four different poses.
- Key poses: 1 = 0 %, 2 = 12.5 %, 3 = 31 %, 4 = 62.5 % (Around the World 0, 20, 45, 70 %). Tiles 2 and 4 carry an accent arrow (2 units, filled head) beside the hand path in the move's direction, drawn in the tile's own SVG in scene units.
- Tile box: a crop of the scene around the figure and the working equipment (chest press 96 104 160 158; lateral raise 66 56 226 208). The picture fills the 90 height; the sides show a little more of the scene.
- A zoom chip in Pictures mode swaps the grid for one large still of pose 1 (pose 3 for Path) at that zoom, with the bubble. The logic flips `gen` and sets `--play: paused; --delay: -pose x dur`, so the stage shows exactly that pose, and the caption line shows that pose's caption.
- The grid is always in the markup. Its class string (`pics`, `pics on`, `pics zoomed`) decides whether it shows, so the reduced-motion CSS can force it on (section 13). Do not wrap it in `sc-if`.
- Caption line in Pictures mode: one short rep summary ("Press out 1 s, pause, back 2 s"), with no tempo note. Hint: "Four key moments of one rep."

## 13. Reduced motion

```css
@media (prefers-reduced-motion: reduce){
  .anim,.capx,.repx{animation-play-state:paused!important}   /* element level: the root style hole cannot undo it */
  .pics:not(.zoomed){display:grid!important}                 /* the pictures, never a blank or frozen frame */
  .cam,.ov{transition:none!important}
  .pill-row{display:none!important}
}
```

- The logic reads `matchMedia('(prefers-reduced-motion: reduce)')` once in the constructor. It starts in Pictures mode, disables Play and "Animation", and the hint says "Pictures shown because your phone is set to reduce motion." Zoom chips still open stills, with no transition.
- A root-level `--play: paused` in the media query is NOT enough: the root's inline style string wins over it. Checked: with the element-level rule, the figure stays paused even when the root string says `running`.
- The real app keys this off `html[data-motion="reduce"]` and `reduced()` from `src/ui/motion.ts`, not the media query (spec 2.8).

## 14. Porting a harness into a `Player-*.dc.html` artboard

| Harness | Artboard (FORMAT-RULES skeleton) |
|---|---|
| `<style>` in `<head>` | `<helmet><style>` (plus `<script src="./support.js"></script>` in head) |
| `data-style="rootStyle"` on `.player` | `style="width: 358px; height: 460px; box-sizing: border-box; {{ rootStyle }}"` |
| `data-class="rootClass"`, `camClass`, `picsClass` | `class="{{ rootClass }}"` and so on |
| `data-if="x"` | `<sc-if value="{{ x }}" hint-placeholder-val="{{ true }}">…</sc-if>` |
| `data-text="hint"`, `bubbleText` | `{{ hint }}`, `{{ bubbleText }}` |
| `data-pressed`, `data-label`, `data-disabled` | `aria-pressed="{{ x }}"`, `aria-label="{{ playLabel }}"`, `disabled="{{ x }}"` |
| `data-click="togglePlay"` | `onClick="{{ togglePlay }}"` |
| the three `data-chip` buttons | `<sc-for list="{{ chips }}" as="chip" hint-placeholder-count="3">` with `aria-pressed="{{ chip.pressed }}" onClick="{{ chip.pick }}"` and `{{ chip.label }}` |
| `THEMES`, `themeVars`, `rigVars`, `EX`, `on`, `class Component extends DCLogic` | paste as is into `<script type="text/x-dc" data-dc-script>` |
| props from the query string | `data-props` per spec 2.1 (theme, autoplay, loop, `$preview` 358 x 460) |
| the `class DCLogic` stand-in, `bind()`, the boot code, `?t`, the harness note | delete |

The harness has no probe elements. Checks measure real parts through `getCTM()`.

## 15. The two proofs

Machine Chest Press, side view (`chest-press.html`):
- Figure: hip (150, 206), shoulder (150, 144), knee (200, 206), ankle (200, 253), head centre (153, 124). Torso, head, hips, legs and wrist do not move.
- Machine: base rail x 20-182, y 250-258; stack as section 7; column x 88-100, y 52-250; top beam x 22-214, y 44-54; pulley (55, 61) r 5.2; cable from the stack bracket up over the pulley and along y 55.8 to the lever hub; seat pad x 118-200, y 214-224 on a post x 150-159; back pad x 124.5-137.5, y 108-212 on a bracket x 100-126, y 168-176.
- Lever: pivot (206.5, 58), 100 to the grip centre. The grip travels x 187 to 226 on a flat arc (y 156.1 at the ends, 158 mid-press); the lever turns 11.24 degrees each side of straight down. The stack lifts (grip x - 187) x 0.5, from 0 to 19.5.
- Chips: Grip (206, 157, 2.0), Path (204, 160, 1.6), Seat (150, 190, 1.7). Muscles: main Chest; helps Front shoulders, Triceps.

Dumbbell Lateral Raise, front view (`lateral-raise.html`):
- Hip centre (179, 156); shoulders (157, 94) and (201, 94), fixed (no shrug); head centre (179, 73).
- Arms: screen-right `rotate(-A)`, screen-left `rotate(+A)`, A = 12 to 88 degrees; the elbow bend stays 15 degrees (inside angle 165). Screen-right grip (206.8, 171.1) to (277.2, 107.0), 13 below shoulder height at the top.
- Chips: Shoulders (179, 90, 2.2), Path (179, 135, 1.2), Elbows (179, 113, 2.2). Muscles: main Side shoulders; helps Upper traps. Elbows is centred on the midline, so both elbows and both rings stay inside the stage and at least 13 px above the bubble for the whole rep (at 224 the screen-left ring was cut by the stage edge and left the stage near the top).

## 16. Checks run (`node shoot.cjs`, Chromium)

| Check | Result |
|---|---|
| Chest press truth table: setup elbow inside angle >= 75; pressed 155-168; setup arm out from side 45-60; pressed arm forward 70-90; setup elbow x 145-149.5 | 89.2; 163.4; 54.6; 75.7; 149.0 |
| Upper arm fu never below 0.55 over the rep | min 0.565 (setup 0.580) |
| Contrast, every theme: figure outline on the stage and over the body, frame, metal, cable all at least 3:1 | yes (table in section 19) |
| Sideways hand path strictly inward over 101 steps | 38.6 to 6.0 |
| Hand on handle: analytic (between samples) and in the browser (201 phases, `getCTM`) | 0.069 and 0.075 units (limit 0.5; the fist is 12 wide) |
| Shoulder drift (both moves), left/right mirror (lateral raise), grip never above the shoulder line | 0, 0, top grip 13 below |
| Every chest press scene group inside the stage at t 0, 0.125, 0.25, 0.625 | yes |
| Reduced motion: figure and captions paused, still paused when the root string says running, grid shown, hint, Animation disabled (both moves) | yes |
| Loop on: figure, captions and rep pill `infinite`. Loop off: 3, 3 and 1 | yes |
| Replay: ended state, then a restart through the `-b` set, running. 0.5x: 8 s rep, restart, Slow motion pill | yes |
| Paper machine outline on the stage, without a `data-theme` attribute (computed colour read back from the page) | 3.20:1 (was 2.08:1) |
| Pictures: the 4 `use` tiles render 4 different poses | yes |
| Every zoom chip (both moves): rep pill and camera label hidden, bubble shown; the chip's subject inside the stage and above the bubble at 41 phases | yes. Closest: lateral raise Elbows 24.7 px from the stage edge and 13.5 px above the bubble; chest press Seat pad 10.8 px above the bubble |
| Unzoomed: rep pill and camera label shown | yes |
| Page errors | 0 |

Screenshots viewed (`shots/`): both moves at t 0, 0.25, 0.5 and 0.75 in Silent Black and Paper; the chest press setup at t 0, 0.05, 0.1 and 0.125; every zoom chip, plus Grip in Paper; the QA cases re-shot (lateral raise Elbows at t 0.75, at t 0.25 in Paper and as a Pictures still; chest press Seat at t 0.25); Pictures (both themes) and the Path still; reduced motion; Ember, Emerald and Midnight at t 0.125; the parts and framing sheet.

## 17. Differences from the spec, and the spec edits to apply

Only the files in `rig-final/` were written. These edits make spec.md agree with this rig (one document per topic); apply them in spec.md.

| Spec | Now | Why |
|---|---|---|
| 2.3 body fill `--map-body` | `color-mix(in srgb, var(--map-body) 88%, var(--text))`; facets 78 %; helpers mix into the body | `--map-body` equals `--surface-3`, the pad colour, so the torso merged into the back pad |
| 2.3 outline 1.5 centred | 1.5 visible, drawn as a 3-wide stroke under the fills, per layer | one silhouette per layer, no seams at the shoulder and elbow |
| 2.3 frame outline (not set) | `--fg-frame` 38 % dark or 56 % light, from `rigVars()` in the root style string | the Paper override keyed on `data-theme` never fired in artboards (2.08:1) |
| 2.3 `--fg-line` text 60 % | 60 % dark, 70 % light, from `rigVars()` | with the lifted body fill, 60 % in Paper gave 2.46:1 over the body; 70 % gives 3.2:1 and stays above the frame |
| 2.3 handle `--fg-metal` 6 x 18 | `--fg-metal` 6.4 x 26 | at 18 the fist covered it; the accent handle read as stray dots |
| 2.5 `class="stage gen-{{ gen }}"` | `class="player gen-{{ gen }}"` on the root; `--sets` for the rep pill; `--delay` | captions and the rep pill sit outside the stage; loop needs the pill to repeat too |
| 2.2 stage overlays: rep pill and camera label always shown | hidden while a zoom chip is on; the bubble is the only overlay in a zoom view | in the chest press Seat zoom the lever passed under the camera label and the stack under the rep pill |
| 2.7 tile picture 92 tall | 90 tall; badge opaque with a ring | two caption lines fit in 128; machine parts behind the badge |
| 2.8 reduced motion | element-level `!important` pause, grid forced by class | a root `--play` in the media query loses to the inline style |
| 3.1 carriage on a top track, rod to the handle | lever arms from the top beam, pivot (206.5, 58), length 100; far lever at (5, -3) | the brief asked for lever arms; the long lever keeps the path within 2 units of level |
| 3.1 handle x 170 to 226, lift 0 to 28 | handle x 187 to 226 (y 156.1 to 158), lift (x - 187) x 0.5 = 0 to 19.5 | at x 170 the setup elbow was 57 to 68 degrees and sat on the back pad; now 89 degrees, as the truth table says |
| 3.1 key pose table (fu 0.55 / 0.80 / 1.00) | the generated 3D-solve table below | fu 0.58 / 0.68 / 0.98, with the angles checked against the truth table |
| 3.1 back pad x 118-130, rail x 60-300, top track | back pad x 124.5-137.5, rail x 20-182, top beam x 22-214 | the back touches the pad; the feet stand on the floor |
| 3.1 chips Grip 198,156; Path 190,150,1.5 | Grip 206,157,2.0; Path 204,160,1.6 (Seat unchanged) | centred on the new handle travel and trail |
| 3.1 mistake fix "lower until the plates almost touch" | "Fix: stop just before your arms are straight, and lower slowly so the plates touch lightly." | the animation rests the plates in the 0.5 s reset, as the caption "Reset" says; now the copy matches the picture |
| 3.5 head centre (179, 77) | (179, 73) | at 77 the chin covered the neck |
| 3.5 chip Grip (242, 139, 2.0) "Light grip. Palms face the floor at the top." | Shoulders (179, 90, 2.2) "Keep your shoulders down, away from your ears. No shrug." | the hands are hidden behind the end-on dumbbells, so a grip cue cannot be shown; shrugging is a listed common mistake and this view shows it |
| 3.5 chip Path (179, 120, 1.25) | (179, 135, 1.2) | at 120 the bottom of the path sat under the caption bubble |
| 3.5 chip Elbows (224, 113, 2.2) | (179, 113, 2.2) | at 224 the screen-left elbow ring was cut by the stage edge, and left the stage near the top of the rep |
| 3.5 dumbbell handle end in accent | metal | accent is kept for muscles, pin, paths, overlays, arrows |
| Side views: far-side arm | no far arm; far leg and far lever only | at 2x zoom the far fist read as a second hand |
| 3.6 arm angles "from pointing forward" | rig angle = 180 + spec angle | the rig's rest pose hangs +y; same numbers otherwise |

## 18. Risks and how they are handled

| Risk | Handling |
|---|---|
| Someone edits a keyframe by hand and the hand leaves the handle | Change `gen.mjs` and rebuild; `shoot.cjs` fails when the gap passes 0.5 or a truth-table angle leaves its range. |
| Pages are larger because every keyframe set is written twice | About 50 to 62 KB per page, generated, never typed. The real app drives the same samples with the Web Animations API and needs neither copy. |
| Two players on one page with the same `rig-XX` id | Ids are unique per player (`rig-cp`, `rig-lr`, and so on); the About sheet mounts one player at a time. |
| `<use>` clones take their styles from the original's place | Checked in Chromium; the tiles depend on it. If another engine differs, the tiles still show a pose (the setup pose), never a blank. |
| Body fill vs stage is only 1.4 to 1.8:1 | On purpose, as on the app's map: the 1.5 outline carries the shape (at least 4.6:1). |
| Midnight: accent on the stage 2.98:1, main muscle on the body 1.63:1, helper 1.22:1 | Each muscle polygon has its own thin outline, the figure outline carries the shape, and the muscles are named in text. A stronger Midnight tint would need a token the app does not have. |
| `color-mix()` needs Chrome 111 or later | The app already uses it on the muscle map. |
| A 3D solve can flip the elbow if the poles are badly chosen | Poles are picked from a chosen setup elbow; the truth-table checks and the fu floor catch a flip. |
| The progress trail with `pathLength` on a sampled path | Uniform samples along the arc; the trail end is checked by eye at every shot phase. |
| The framing for a 358 x 300 stage is shown on the parts sheet only | The same translate rule is used for the machine guide; check it there when it is built. |
| A new chip target cuts its subject at some point in the rep, not in the one frame someone looked at | The zoom keep-clear check in `shoot.cjs` runs every chip over 41 phases; copy it for every new player. |
| Someone misses the rep count while zoomed, because the pill hides | The caption line under the stage keeps showing the step ("Press out, 1 s"), and the pill returns when the chip is turned off. |

## 19. Part shapes and measured numbers (generated)

Copy-paste form: every part is an outline polygon (outline pass) and the same points as a fill polygon (fill pass), then its regions. Change a region's class to `mm` or `mh` when the exercise gives that muscle a role; keep `fc` for facets; drop a non-facet region otherwise.

<!-- generated:start (node gen.mjs rewrites this block) -->

**Side view parts (faces +x; rig origin = hip joint)**

```html
<!-- neck  (lives in: figure root) -->
<polygon class="olk" points="-5,-63 -4.5,-73.5 5,-72.5 7,-64"/>  <!-- outline pass -->
<polygon class="b" points="-5,-63 -4.5,-73.5 5,-72.5 7,-64"/>  <!-- fill pass -->
<!-- torso  (lives in: figure root) -->
<polygon class="olk" points="-7,-67 -2,-70.5 6,-69.5 11,-65 15,-56 15.5,-46 12.5,-36 10,-25 9.5,-13 10.5,-3 7.5,6 -3,8.5 -10.5,6 -12.5,-3 -10.5,-15 -9.8,-26 -11.8,-40 -12.2,-52 -10.5,-62"/>  <!-- outline pass -->
<polygon class="b" points="-7,-67 -2,-70.5 6,-69.5 11,-65 15,-56 15.5,-46 12.5,-36 10,-25 9.5,-13 10.5,-3 7.5,6 -3,8.5 -10.5,6 -12.5,-3 -10.5,-15 -9.8,-26 -11.8,-40 -12.2,-52 -10.5,-62"/>  <!-- fill pass -->
<polygon class="fc" data-region="chest" points="4,-66.5 11,-65 15,-56 15.5,-46 12.5,-36 5,-39 3,-52"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="abs" points="12.5,-36 10,-25 9.5,-13 10.5,-3 3,-6 3,-24 5,-39"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="lats" points="-12.2,-52 -4,-55 -2,-40 -6,-28 -9.8,-26 -11.8,-40"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="upperTraps" points="-7,-67 -2,-70.5 2,-66 -3,-58 -10.5,-62"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="seat" points="-3,8.5 -10.5,6 -12.5,-3 -10.5,-15 -3,-9 1,3"/>
<!-- head  (lives in: figure root) -->
<polygon class="olk" points="-7,-86 -4.5,-92 3,-94 10,-91.5 13,-86 14,-82 16,-79.5 13.5,-77.5 12.5,-73.5 7,-71 1,-72 -4,-75.5"/>  <!-- outline pass -->
<polygon class="b" points="-7,-86 -4.5,-92 3,-94 10,-91.5 13,-86 14,-82 16,-79.5 13.5,-77.5 12.5,-73.5 7,-71 1,-72 -4,-75.5"/>  <!-- fill pass -->
<polygon class="fc" data-region="ear" points="-0.5,-83.5 3,-85 4.5,-81 3,-77.5 -0.5,-79"/>
<!-- upperArm  (lives in: ua > ul) -->
<polygon class="olk" points="-5.5,-64 5.5,-64 6.2,-50 4.6,-27 0,-23 -4.6,-27 -6.2,-48"/>  <!-- outline pass -->
<polygon class="b" points="-5.5,-64 5.5,-64 6.2,-50 4.6,-27 0,-23 -4.6,-27 -6.2,-48"/>  <!-- fill pass -->
<polygon class="fc" data-region="biceps" points="0.3,-64 5.5,-64 6.2,-50 4.6,-27 0.3,-25"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="triceps" points="-5.5,-64 0.3,-64 0.3,-25 -4.6,-27 -6.2,-48"/>  <!-- mm if main, mh if helps, omit otherwise -->
<!-- deltoid  (lives in: ua) -->
<polygon class="olk" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.5,-57 5,-50 -1,-48.5 -6.5,-54"/>  <!-- outline pass -->
<polygon class="b" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.5,-57 5,-50 -1,-48.5 -6.5,-54"/>  <!-- fill pass -->
<polygon class="fc" data-region="frontDelts" points="0.5,-69.3 4,-69 7.5,-64.5 7.5,-57 5,-50 1.5,-56"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="rearDelts" points="-6.5,-66 -2.5,-69.5 0.5,-69.3 1.5,-56 -1,-48.5 -6.5,-54"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- elbowCap  (lives in: fa) -->
<polygon class="olk" points="4.25,-22.24 1.76,-19.75 -1.76,-19.75 -4.25,-22.24 -4.25,-25.76 -1.76,-28.25 1.76,-28.25 4.25,-25.76"/>  <!-- outline pass -->
<polygon class="b" points="4.25,-22.24 1.76,-19.75 -1.76,-19.75 -4.25,-22.24 -4.25,-25.76 -1.76,-28.25 1.76,-28.25 4.25,-25.76"/>  <!-- fill pass -->
<!-- forearm  (lives in: fa > fl) -->
<polygon class="olk" points="-4.8,-25 4.8,-25 5,-13 3.6,7 -3.6,7 -4.6,-13"/>  <!-- outline pass -->
<polygon class="b" points="-4.8,-25 4.8,-25 5,-13 3.6,7 -3.6,7 -4.6,-13"/>  <!-- fill pass -->
<polygon class="fc" data-region="forearms" points="0.2,-25 4.8,-25 5,-13 3.6,7 0.2,7"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- fist  (lives in: fa > hd) -->
<polygon class="olk" points="-4.2,6 4.2,6 6,11 6.5,19 3.5,23 -3,23 -5.5,18.5 -5.2,11"/>  <!-- outline pass -->
<polygon class="b" points="-4.2,6 4.2,6 6,11 6.5,19 3.5,23 -3,23 -5.5,18.5 -5.2,11"/>  <!-- fill pass -->
<polygon class="fc" data-region="facet" points="4.2,6 6,11 6.5,19 3.5,23 1.5,15"/>
<!-- hipCap  (lives in: thigh) -->
<polygon class="olk" points="7.76,3.21 3.21,7.76 -3.21,7.76 -7.76,3.21 -7.76,-3.21 -3.21,-7.76 3.21,-7.76 7.76,-3.21"/>  <!-- outline pass -->
<polygon class="b" points="7.76,3.21 3.21,7.76 -3.21,7.76 -7.76,3.21 -7.76,-3.21 -3.21,-7.76 3.21,-7.76 7.76,-3.21"/>  <!-- fill pass -->
<!-- thigh  (lives in: thigh) -->
<polygon class="olk" points="-8.5,-3 8.5,-3 8.2,20 6,47 0,51 -6,47 -8.4,22"/>  <!-- outline pass -->
<polygon class="b" points="-8.5,-3 8.5,-3 8.2,20 6,47 0,51 -6,47 -8.4,22"/>  <!-- fill pass -->
<polygon class="fc" data-region="quads" points="0.3,-3 8.5,-3 8.2,20 6,47 0.3,48"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- kneeCap  (lives in: shin) -->
<polygon class="olk" points="5.54,52.3 2.3,55.54 -2.3,55.54 -5.54,52.3 -5.54,47.7 -2.3,44.46 2.3,44.46 5.54,47.7"/>  <!-- outline pass -->
<polygon class="b" points="5.54,52.3 2.3,55.54 -2.3,55.54 -5.54,52.3 -5.54,47.7 -2.3,44.46 2.3,44.46 5.54,47.7"/>  <!-- fill pass -->
<!-- shin  (lives in: shin) -->
<polygon class="olk" points="-5.5,49 5.5,49 5,62 4,94 -4,94 -7,64"/>  <!-- outline pass -->
<polygon class="b" points="-5.5,49 5.5,49 5,62 4,94 -4,94 -7,64"/>  <!-- fill pass -->
<polygon class="fc" data-region="calves" points="-5.5,49 0,49 0,94 -4,94 -7,64"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- foot  (lives in: shin) -->
<polygon class="olk" points="-5,93 3,93 8,97.5 17,99.5 17.5,102 -6,102 -6.5,97.5"/>  <!-- outline pass -->
<polygon class="b" points="-5,93 3,93 8,97.5 17,99.5 17.5,102 -6,102 -6.5,97.5"/>  <!-- fill pass -->
```

**Front view parts (screen-right side; screen-left = same points with x negated; rig origin = midway between the hips)**

```html
<!-- neck  (lives in: figure root) -->
<polygon class="olk" points="-5,-79 5,-79 6.5,-64 -6.5,-64"/>  <!-- outline pass -->
<polygon class="b" points="-5,-79 5,-79 6.5,-64 -6.5,-64"/>  <!-- fill pass -->
<!-- torso  (lives in: figure root) -->
<polygon class="olk" points="-6.5,-69.5 -2.5,-65.5 2.5,-65.5 6.5,-69.5 17,-66.5 21,-63 20,-52 16.5,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.5,-38 -20,-52 -21,-63 -17,-66.5"/>  <!-- outline pass -->
<polygon class="b" points="-6.5,-69.5 -2.5,-65.5 2.5,-65.5 6.5,-69.5 17,-66.5 21,-63 20,-52 16.5,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.5,-38 -20,-52 -21,-63 -17,-66.5"/>  <!-- fill pass -->
<polygon class="fc" data-region="upperTraps" points="6.5,-69.5 17,-66.5 21,-63 12,-63 4.5,-65.5"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="upperTraps" points="-6.5,-69.5 -17,-66.5 -21,-63 -12,-63 -4.5,-65.5"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="chest" points="0.5,-63.5 19.8,-62 19.5,-52 15.5,-44 0.5,-45"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="chest" points="-0.5,-63.5 -19.8,-62 -19.5,-52 -15.5,-44 -0.5,-45"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="obliques" points="16.5,-38 14,-26 15,-14 16.5,-4 9,-9 9,-41"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="obliques" points="-16.5,-38 -14,-26 -15,-14 -16.5,-4 -9,-9 -9,-41"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- head  (lives in: figure root) -->
<polygon class="olk" points="0,-95 7,-93 10,-87 9.5,-80 6,-74 0,-71.5 -6,-74 -9.5,-80 -10,-87 -7,-93"/>  <!-- outline pass -->
<polygon class="b" points="0,-95 7,-93 10,-87 9.5,-80 6,-74 0,-71.5 -6,-74 -9.5,-80 -10,-87 -7,-93"/>  <!-- fill pass -->
<polygon class="fc" data-region="facet" points="0,-95 7,-93 10,-87 9.5,-80 6,-74 0,-71.5"/>
<!-- upperArmR  (lives in: ua-r) -->
<polygon class="olk" points="16.8,-64 27.5,-64 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/>  <!-- outline pass -->
<polygon class="b" points="16.8,-64 27.5,-64 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/>  <!-- fill pass -->
<polygon class="fc" data-region="biceps" points="19,-59 25,-59 25.5,-36 22,-31 19,-36"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- deltoidR  (lives in: ua-r) -->
<polygon class="olk" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- outline pass -->
<polygon class="b" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- fill pass -->
<polygon class="fc" data-region="sideDelts" points="23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 24.5,-57.5"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="frontDelts" points="16.8,-65 23,-66 24.5,-57.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- elbowCapR  (lives in: fa-r) -->
<polygon class="olk" points="26.25,-22.24 23.76,-19.75 20.24,-19.75 17.75,-22.24 17.75,-25.76 20.24,-28.25 23.76,-28.25 26.25,-25.76"/>  <!-- outline pass -->
<polygon class="b" points="26.25,-22.24 23.76,-19.75 20.24,-19.75 17.75,-22.24 17.75,-25.76 20.24,-28.25 23.76,-28.25 26.25,-25.76"/>  <!-- fill pass -->
<!-- forearmR  (lives in: fa-r) -->
<polygon class="olk" points="17.4,-25 26.8,-25 27,-13 25.6,7 18.4,7 17.2,-13"/>  <!-- outline pass -->
<polygon class="b" points="17.4,-25 26.8,-25 27,-13 25.6,7 18.4,7 17.2,-13"/>  <!-- fill pass -->
<polygon class="fc" data-region="forearms" points="22.2,-25 26.8,-25 27,-13 25.6,7 22.2,7"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- fistR  (lives in: fa-r) -->
<polygon class="olk" points="17.8,6 26.2,6 27.2,12 27,20 24.5,23.5 19,23.5 16.8,19.5 16.8,12"/>  <!-- outline pass -->
<polygon class="b" points="17.8,6 26.2,6 27.2,12 27,20 24.5,23.5 19,23.5 16.8,19.5 16.8,12"/>  <!-- fill pass -->
<polygon class="fc" data-region="facet" points="22,6 26.2,6 27.2,12 27,20 24.5,23.5 22,23.5"/>
<!-- thighR  (lives in: figure root (static legs)) -->
<polygon class="olk" points="2,-4 18,-4 18,18 16,47 10,50.5 4,47 2.5,20"/>  <!-- outline pass -->
<polygon class="b" points="2,-4 18,-4 18,18 16,47 10,50.5 4,47 2.5,20"/>  <!-- fill pass -->
<polygon class="fc" data-region="quads" points="10,-4 18,-4 18,18 16,47 10,49"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- kneeCapR  (lives in: figure root) -->
<polygon class="olk" points="15.36,52.22 12.22,55.36 7.78,55.36 4.64,52.22 4.64,47.78 7.78,44.64 12.22,44.64 15.36,47.78"/>  <!-- outline pass -->
<polygon class="b" points="15.36,52.22 12.22,55.36 7.78,55.36 4.64,52.22 4.64,47.78 7.78,44.64 12.22,44.64 15.36,47.78"/>  <!-- fill pass -->
<!-- shinR  (lives in: figure root) -->
<polygon class="olk" points="4.5,49 15.5,49 16,62 14,94 6,94 4,62"/>  <!-- outline pass -->
<polygon class="b" points="4.5,49 15.5,49 16,62 14,94 6,94 4,62"/>  <!-- fill pass -->
<polygon class="fc" data-region="calves" points="10,49 15.5,49 16,62 14,94 10,94"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- footR  (lives in: figure root) -->
<polygon class="olk" points="5.5,93 14.5,93 17,99 16.5,102 4.5,102 4,99"/>  <!-- outline pass -->
<polygon class="b" points="5.5,93 14.5,93 17,99 16.5,102 4.5,102 4,99"/>  <!-- fill pass -->
```

**Top view parts, seated or standing lifter (faces -y; rig origin = midway between the shoulder joints)**

```html
<!-- torso (shoulders and upper back from above)  (lives in: figure root) -->
<polygon class="olk" points="-10,-12 10,-12 21,-8.5 27,-1.5 26,6 20,11 8,13.5 -8,13.5 -20,11 -26,6 -27,-1.5 -21,-8.5"/>  <!-- outline pass -->
<polygon class="b" points="-10,-12 10,-12 21,-8.5 27,-1.5 26,6 20,11 8,13.5 -8,13.5 -20,11 -26,6 -27,-1.5 -21,-8.5"/>  <!-- fill pass -->
<polygon class="fc" data-region="upperTraps" points="6,-7 19,-6 23,-1 9,3"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="upperTraps" points="-6,-7 -19,-6 -23,-1 -9,3"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="fc" data-region="midBack" points="0,2 9,3 20,11 8,13.5 0,13.5"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="midBack" points="0,2 -9,3 -20,11 -8,13.5 0,13.5"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- head (from above, nose toward -y)  (lives in: figure root) -->
<polygon class="olk" points="0,-12 5,-11 8.5,-7.5 10,-2 8.5,4 4.5,7.5 0,8.5 -4.5,7.5 -8.5,4 -10,-2 -8.5,-7.5 -5,-11"/>  <!-- outline pass -->
<polygon class="b" points="0,-12 5,-11 8.5,-7.5 10,-2 8.5,4 4.5,7.5 0,8.5 -4.5,7.5 -8.5,4 -10,-2 -8.5,-7.5 -5,-11"/>  <!-- fill pass -->
<polygon class="fc" data-region="nose" points="-2.2,-11.6 0,-15 2.2,-11.6"/>
<polygon class="fc" data-region="crown" points="-8.5,4 -4.5,7.5 0,8.5 4.5,7.5 8.5,4 0,1"/>
<!-- deltoidR  (lives in: ua-r) -->
<polygon class="olk" points="17,-6 22,-8.5 28,-7 30.5,-1 29.5,6 25,9 19,8 16,2"/>  <!-- outline pass -->
<polygon class="b" points="17,-6 22,-8.5 28,-7 30.5,-1 29.5,6 25,9 19,8 16,2"/>  <!-- fill pass -->
<polygon class="fc" data-region="frontDelts" points="17,-6 22,-8.5 28,-7 30.5,-1 23,0"/>  <!-- mm if main, mh if helps, fc otherwise -->
<polygon class="fc" data-region="rearDelts" points="30.5,-1 29.5,6 25,9 19,8 23,0"/>  <!-- mm if main, mh if helps, omit otherwise -->
<!-- upperArmR  (lives in: ua-r > ul-r) -->
<polygon class="olk" points="16.8,-2 27.5,-2 28.2,14 26.6,35 22,39 17.4,35 16.2,14"/>  <!-- outline pass -->
<polygon class="b" points="16.8,-2 27.5,-2 28.2,14 26.6,35 22,39 17.4,35 16.2,14"/>  <!-- fill pass -->
<!-- elbowCapR  (lives in: fa-r) -->
<polygon class="olk" points="26.25,39.76 23.76,42.25 20.24,42.25 17.75,39.76 17.75,36.24 20.24,33.75 23.76,33.75 26.25,36.24"/>  <!-- outline pass -->
<polygon class="b" points="26.25,39.76 23.76,42.25 20.24,42.25 17.75,39.76 17.75,36.24 20.24,33.75 23.76,33.75 26.25,36.24"/>  <!-- fill pass -->
<!-- forearmR  (lives in: fa-r > fl-r) -->
<polygon class="olk" points="17.4,37 26.8,37 27,49 25.6,69 18.4,69 17.2,49"/>  <!-- outline pass -->
<polygon class="b" points="17.4,37 26.8,37 27,49 25.6,69 18.4,69 17.2,49"/>  <!-- fill pass -->
<polygon class="fc" data-region="forearms" points="22.2,37 26.8,37 27,49 25.6,69 22.2,69"/>  <!-- mm if main, mh if helps, fc otherwise -->
<!-- fistR  (lives in: fa-r > hd-r) -->
<polygon class="olk" points="17.8,68 26.2,68 27.2,74 27,82 24.5,85.5 19,85.5 16.8,81.5 16.8,74"/>  <!-- outline pass -->
<polygon class="b" points="17.8,68 26.2,68 27.2,74 27,82 24.5,85.5 19,85.5 16.8,81.5 16.8,74"/>  <!-- fill pass -->
<polygon class="fc" data-region="facet" points="22,68 26.2,68 27.2,74 27,82 24.5,85.5 22,85.5"/>
```

**Equipment parts (copy-paste; stage units unless a group is named)**

```html
<!-- front-view dumbbell, screen-right hand. Lives in fa-r > db-r (rotation origin 22,16 = the grip).
     End face centred at (22, 21): 5 below the grip, so the fist shows above it. Screen-left: negate every x. -->
<polygon class="eqm" points="14,21 18,14.63 26,14.63 30,21 30,17.2 26,10.83 18,10.83 14,17.2"/>
<polygon class="eqm" points="30,21 26,27.37 18,27.37 14,21 18,14.63 26,14.63"/>
<polygon class="hd" points="24.7,21 23.35,23.15 20.65,23.15 19.3,21 20.65,18.85 23.35,18.85"/>
<!-- chest press lever (near). One group rotating about the pivot (206.5, 58); grip centre 100 below the pivot at rest. -->
<g class="j anim cp-lever lever-near">
<polygon class="eqm" points="203.9,58 209.1,58 209.1,146 203.9,146"/>
<rect class="hd" x="203.3" y="145" width="6.4" height="26" rx="3"/>
</g>
<circle class="eqm" cx="206.5" cy="58" r="7"/>
<circle class="rod" cx="206.5" cy="58" r="2"/>
<!-- far lever: the same group inside <g class="far-side" transform="translate(5 -3)"> -->
<g class="j anim cp-lever far-lever">
<polygon class="eqf" points="203.9,58 209.1,58 209.1,146 203.9,146"/>
<rect class="hdf" x="203.3" y="145" width="6.4" height="26" rx="3"/>
</g>
<!-- stack plates 1-6, pin and top bracket: one group, translateY(-lift) -->
<rect class="eq" x="26" y="112.5" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="126" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="139.5" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="153" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="166.5" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="180" width="48" height="12" rx="1.5"/>
<rect class="pin" x="73" y="184" width="9" height="4" rx="2"/>
<rect class="eqm" x="45" y="106" width="10" height="6.5" rx="1"/>
```

Chest press solve inputs (so every sample can be rebuilt from this file): p runs 0 to 1 over the move and is linear in grip x: x = 187 + 39 p; grip y = 58 + sqrt(100^2 - (x - 206.5)^2); lever rotate = -asin((x - 206.5) / 100); grip z = 38.56 + (6 - 38.56) p. pole0 = norm([-1, 22, 30.97]) = [-0.0263, 0.5789, 0.8149]; pole1 = norm([-0.1, 0.6, 0.8]) = [-0.0995, 0.5970, 0.7960]; pole(p) = norm((1 - p) pole0 + p pole1). Shoulder (150, 144, 0), upper arm 38, forearm 40; the setup elbow (149, 166, 30.97) is the elbow nearest pole0. The rep timing maps rep time to p (section 8).

### Measured numbers from this build

Machine Chest Press key poses (stage units; z = sideways, out from the shoulder toward the camera; angles in degrees; SVG rotate + = clockwise):

| p | Grip (x, y, z) | Elbow (x, y, z) | Lever | Upper arm | fu | Forearm | ff | Elbow inside angle | Arm out from side | Arm forward | Stack lift |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 187, 156.08, 38.56 | 149, 166, 30.97 | 11.24 | 2.6 | 0.58 | -107.23 | 0.982 | 89.2 | 54.58 | -2.6 | 0 |
| 0.25 | 196.02, 157.45, 31.03 | 156.7, 164.81, 31.08 | 6.02 | -17.84 | 0.575 | -82.75 | 1 | 94.1 | 54.89 | 17.84 | 4.51 |
| 0.5 | 206.06, 158, 22.64 | 166.8, 163.54, 27.92 | 0.25 | -40.69 | 0.678 | -57.35 | 0.991 | 105.41 | 47.29 | 40.69 | 9.53 |
| 0.75 | 216.99, 157.45, 13.52 | 177.66, 160.45, 20.2 | -6.02 | -59.26 | 0.847 | -35.12 | 0.986 | 126.47 | 32.11 | 59.26 | 14.99 |
| 1 | 226, 156.08, 6 | 186.13, 153.19, 7.37 | -11.24 | -75.73 | 0.981 | -10.12 | 0.999 | 163.44 | 11.18 | 75.73 | 19.5 |

Worst hand-to-handle gap half-way between baked samples (analytic): 0.01 units. Smallest upper-arm fu over the rep: 0.565.

Dumbbell Lateral Raise key poses:

| p | Arm out from side A | Elbow inside angle | Screen-right grip (stage) |
|---|---|---|---|
| 0 | 12 | 165 | (206.81, 171.11) |
| 0.25 | 31 | 165 | (231.6, 165.02) |
| 0.5 | 50 | 165 | (253.05, 151.19) |
| 0.75 | 69 | 165 | (268.84, 131.13) |
| 1 | 88 | 165 | (277.23, 107.02) |

Contrast of the derived paints (WCAG ratio; stage = --surface-1):

| Theme | Outline on stage | Outline on body | Frame | Metal | Cable | Accent | Body vs stage | Body vs pads | Helps vs body | Main vs body |
|---|---|---|---|---|---|---|---|---|---|---|
| silent-black | 6.85 | 4.32 | 3.42 | 9.48 | 5.92 | 4.05 | 1.59 | 1.42 | 1.52 | 2.56 |
| paper | 4.66 | 3.23 | 3.20 | 4.93 | 3.12 | 3.59 | 1.44 | 1.23 | 1.52 | 2.49 |
| ember | 7.23 | 4.29 | 3.56 | 10.03 | 6.23 | 6.55 | 1.69 | 1.45 | 1.82 | 3.88 |
| emerald | 6.17 | 3.79 | 3.23 | 8.37 | 5.38 | 8.98 | 1.63 | 1.41 | 2.29 | 5.52 |
| midnight | 5.72 | 3.14 | 3.18 | 7.56 | 5.05 | 2.98 | 1.82 | 1.40 | 1.22 | 1.63 |

Keyframe stops per animated group: 153, written twice (-a and -b).

<!-- generated:end -->
