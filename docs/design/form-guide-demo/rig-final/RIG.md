# Final shared rig: one low-poly figure for every form-guide player

Status: final rig for the 10 `Player-*.dc.html` artboards. Base: the winning "rig-lowpoly", with every must-fix item from both judges fixed and the listed grafts from "rig-pill" applied. Checked in Chromium on 2026-09-26 (section 16). QA round 1 fixes are in: pole vectors and the grip-x rule written out (sections 9 and 19), the dumbbell's place stated and its shapes added (sections 4, 7 and 19), the lateral raise Elbows chip re-centred (section 15), and a keep-clear rule for zoom views (sections 2 and 11). Figure detail upgrade (2026-09-27, UPGRADE-BRIEF.md): clothes, head, hands, three tones per surface, a rim line, contact shadows, the target-muscle glow, secondary-motion facets and equipment detail (section 20). Round 2 (2026-09-27, three reviewers, owner's bar "premium, smooth and good details"): one silhouette per arm, thicker tapered forearms, a readable thumb, the closed grip on the dumbbell, tone separation in Paper and in dark themes, the glow clipped to the body, 0.25 % stops in the lift, the caption row drawn with the canvas font, and three new checks (section 20, decisions D-R1 to D-R6). Round 3 (2026-09-27, owner request): tap a muscle to see its common name, its anatomical name, its role and one line about it, in the muscle's colour (section 21, spec 2.10, D-R7 to D-R9).

## In plain words

- This is the recipe for the little person in every exercise demo: where each joint is, what each body part looks like, which theme colour paints what, and how it moves without an arm coming off or a hand leaving its handle.
- The chest press now starts with the handles further forward, so the elbow starts at about 90 degrees, as a real setup does. A blue line grows from where the handle starts to where it is now, so a beginner can see how far to push and where to stop.
- The same drawing makes the four "Pictures", so they always match the animation. When a phone is set to reduce motion, the pictures show in place of the animation, and nothing can switch it back on.
- In a close-up (a zoom chip), the rep counter and the view label step aside, so nothing moving slides under them, and the lateral raise "Elbows" close-up now keeps both elbows in view for the whole rep.
- The person now wears a fitted T-shirt, shorts and shoes, and has hair, an ear, a nose line and a jaw, but no eyes or mouth. Each hand holds its handle with a palm, four fingers and a thumb. Every surface has a light, a middle and a dark shade, all mixed from the theme's own colours, and a soft shadow sits under the feet and the seat.
- The working muscle glows a little more as it works harder and is brightest at the hardest point; it fades back on the way down and never flashes. The belly firms and the shoulder blades show a small shape change during the move, without moving any joint.
- Two working proofs: `chest-press.html` (side view) and `lateral-raise.html` (front view). Each is a full player: stage, captions, zoom chips, Play, speed, Animation or Pictures.

## 1. Files

| File | What it is |
|---|---|
| `gen.mjs` | The single source. Every point, joint, pose solve and keyframe lives here. It writes both harnesses, `parts.html`, `poses.json` and the generated block at the end of this file. Run `node gen.mjs`. |
| `chest-press.html`, `lateral-raise.html` | Harnesses, built the same way as an artboard (section 14): one root style string, class strings, and the artboard's logic class. A small stand-in for x-dc writes the logic's values into the page. |
| `parts.html` | Rest poses of the side, front and top views, plus framing guides for the 358 x 276 and 358 x 300 stages. |
| `shoot.cjs` | Every check (section 16) and every screenshot in `shots/`. Run `node shoot.cjs`; it exits 1 on any failure and writes `checks.txt`. |
| `muscle-check.cjs`, `caption-check.cjs`, `muscle-tap-check.cjs` | Shared checks (sections 20 and 21), required by this and by every player's `shoot.cjs`: the target muscle stays visible at the hardest point; the caption row never overlaps or leaves the player, drawn with the canvas font; a tap on a muscle opens its info bubble (spec 2.10). |
| `fonts/Roboto-latin.woff2` | The canvas font (Roboto, latin subset, 43 KB, from Google Fonts) for offline shoots: the harness pages declare it as a local `@font-face` after the Google Fonts link. Harness only; the artboards load the link. |
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
| Head | about 20 wide (22.6 with the nose, side view; 23.8 with the ears, front view) x 23.2 to 23.6 tall | |
| Neck | 4 to 8 visible | 11 to 16, widening into the trapezius slope |
| Torso, hip joint to shoulder joint | 62 | side 26 to 28 deep; front 42 at the shoulders, 28 at the waist |
| Upper arm | 38 | 11 to 12 |
| Forearm, elbow to grip centre | 40 | 9.8 at the elbow, 12.4 over the brachioradialis bulge (thumb side, 4 to 10 below the elbow), 8 at the wrist |
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

Every body layer is drawn three times inside the same groups: OUTLINE, RIM, FILL (section 5). The blocks below show OUTLINE and FILL; the RIM pass (the same polygons, class `rim`) goes between them. An arm is ONE layer: the lower arm's joint chain (`XX-fa` > `XX-fl` / `XX-hd`) is repeated inside each of the upper arm's three passes (`armLayer()` in `gen.mjs`), so the lower arm's outline and rim lie under the upper arm's fill and no outline arc crosses the arm at the elbow. The repeated chains carry the same class and keyframes; the smoothness sampler reads each keyframe name once.

Side view, near arm (the only arm drawn: in a true side view the far arm hides behind it):

```html
<g class="figure-arm" transform="translate(150 206)">          <!-- rig origin = hip on the stage -->
  <g class="j anim XX-ua">                                     <!-- origin 0,-62; rotate(-phi) -->
    <g class="j anim XX-ul">[upperArm OUTLINE]</g>[deltoid OUTLINE]                     <!-- XX-ul: scaleY(fu) about 0,-62 -->
    <g class="j anim XX-fa">[elbowCap OUTLINE]<g class="j anim XX-fl">[forearm OUTLINE]</g><g class="j anim XX-hd">[fist OUTLINE]</g></g>
    <g class="j anim XX-ul">[upperArm RIM]</g>[deltoid RIM]
    <g class="j anim XX-fa">[elbowCap RIM]<g class="j anim XX-fl">[forearm RIM]</g><g class="j anim XX-hd">[fist RIM]</g></g>
    <g class="j anim XX-ul">[upperArm FILL]</g>[deltoid FILL]
    <g class="j anim XX-fa">                                   <!-- origin 0,-24; translateY(-(1-fu)*38px) rotate(-(psi-phi)); the same chain three times -->
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
  [upperArmR OUTLINE][deltoidR OUTLINE]<g class="j XX-fa-r">[elbowCapR OUTLINE][forearmR OUTLINE][fistR OUTLINE]</g>
  [upperArmR RIM][deltoidR RIM]<g class="j XX-fa-r">[elbowCapR RIM][forearmR RIM][fistR RIM]</g>
  [upperArmR FILL][deltoidR FILL]
  <g class="j XX-fa-r">                           <!-- origin 22,-24; rotate(+bend), static or animated; the same group three times -->
    [elbowCapR FILL][forearmR FILL][fistR FILL]
    [elbow ring overlay]
    <g class="j anim XX-db-r">[dumbbell]</g>      <!-- origin 22,16 (the grip); rotate(A - bend) keeps it level on screen;
                                                     knurled handle from inside the fist down into the head; end face centred at (22,29.3), 13.3 below the grip: shapes in section 19 -->
  </g>
</g>
```

When a front-view arm moves toward the camera (a front raise), add the `ul`, `fl` and `hd` groups exactly as in the side view.

Top view, one arm (seated or standing lifter, camera above): the same nesting as the side view with the top-view parts, `ua-r` origin (22, 0), `ul-r` origin (22, 0), `fa-r` and `fl-r` origin (22, 38), `hd-r` translate only. At rest the arm points +y (toward the hips). Pointing forward is `rotate(180deg)`. The screen-right arm sweeps out with `rotate(180deg + sigma)` and the screen-left arm with `rotate(180deg - sigma)`. So spec 3.6 angles, which it measures from "arms pointing forward", become `180 + spec angle`. Arm height above or below the shoulder shows as `ul` `scaleY(cos elevation)`. The torso, then the head, are separate layers drawn over the shoulder ends of the arms.

Draw order inside a scene, back to front: floor; machine back parts (base, stack, frame, cable, pulley); far-side group `translate(5 -3)` (far lever, far leg; never a far arm); seat and pads; body layer (torso, neck, head, near leg); near lever, handle and hub; path guide and progress trail; near arm; static zoom overlays. Front view: floor, body layer (legs, neck, torso, head), path guide and trail, screen-left arm, screen-right arm.

Held equipment: free weights (dumbbell, bar) live INSIDE the hand group, so the grip can never come apart. Machine handles live in the MACHINE (on the lever), because a lever turns about its own pivot, and the hand is solved onto the handle at every baked sample (section 9).

## 5. Paint: which token paints what

Every value is a theme token or a `color-mix()` of tokens. The derived variables sit on `.player` in the page CSS. The theme-dependent rig variables are written by `rigVars(theme)` into the root style string next to `themeVars(theme)`, because artboards never set a `data-theme` attribute: `--fg-line`, `--fg-frame`, and the shading inputs `--lit` / `--shd` (what a light or dark facet mixes toward: text / bg in dark themes, bg / text in light ones), `--hi` / `--lo` (how much of the base a light or dark facet keeps: 90 % / 78 % dark, 76 % / 90 % light) and `--rim-k` (62 % dark, 35 % light). Dark themes shade mostly by darkening and light ones mostly by lightening, so the outline keeps its contrast.

| Role | Class | Fill | Stroke (visible width) |
|---|---|---|---|
| T-shirt (the body base tone), light / dark facets | `t` / `th` / `tl` | `--tee` = `--body` = `color-mix(in srgb, var(--map-body) 88%, var(--text))`; `--tee-hi` = tee `--hi` into `--lit`; `--tee-lo` = tee `--lo` into `--shd` | outline pass `olk`: `--fg-line` = text 60% (dark) or 70% (light) into `--surface-1`, 3 under the fill, so 1.5 shows |
| Skin (head, neck, arms below the sleeve, legs below the shorts), light / dark | `b` / `bh` / `bl` | `--skin` = body 92% into text; `--skin-hi`, `--skin-lo` as above | same |
| Shorts, light / dark | `p` / `ph` / `pl` | `--shorts` = body 78% into text; `--shorts-hi`, `--shorts-lo` | same |
| Shoe, toe cap, collar; sole | `s` / `sh` / `sl`; `so` | `--shoe` = body 50% into `--shd`; `--shoe-hi`, `--shoe-lo`; `--sole` = body 45% into `--lit` | same |
| Hair cap, sheen | `hr` / `hrh` | `--hair` = body 50% into `--shd`; `--hair-hi` | same |
| Rim (silhouette) | `rim` | none | rim pass: `--rim` = body `--rim-k` into `--lit`, 1.1 under the fill, so 0.55 shows just inside the outline |
| Low-poly facet (top view only) | `fc` | `--body-facet` = map-body 78% into text | `--map-line` 0.6 |
| Main muscle | `mm` | `var(--accent)`, opacity 0.75 to 1 with the lift (effort cue) | text 35% into transparent, 0.6 |
| Helper muscle | `mh` | `--muscle-help` = accent 45% into `--body` | same |
| Target-muscle glow | `gw` | none | accent, 5 wide, stroke-opacity 0.3, under the main muscle; element opacity = the move progress p (section 20) |
| Secondary-motion facet | tone class + `tn` | its tone, fill-opacity 0.75; element opacity = p | none |
| Contact shadow | `shd` | `--scrim`, fill-opacity 0.16, three stacked ellipses | none |
| Far leg (depth cue) | `bf` / `pf` / `sf` / `olkf` | `--body-far` = map-body 50% into surface-1; far shorts `--shorts-far` and far shoe `--shoe-far` = shorts / shoe 45% into surface-1 | `--fg-line-far` = text 30%, 2.4 under (1.2 shows) |
| Frame, pads, plates, rails | `eq` | `var(--surface-3)` | `--fg-frame` = text 38% (dark) or 56% (light) into surface-1, 1.1 |
| Moving metal: lever, pulley, dumbbell heads, bracket | `eqm` | `var(--surface-3)` | `--fg-metal` = text 72% into surface-1, 1.2 |
| Handle grip, dumbbell handle and end cap | `hd` | `--fg-metal` | none |
| Equipment faces: plain / light / dark (plate bevels, dumbbell top faces and recessed end) | `eqs` / `eqh` / `eql` | `--equip`, `--equip-hi` = equip `--hi` into `--lit`, `--equip-lo` = equip `--lo` into `--shd` | none |
| Grip texture (handle ribs, dumbbell knurl) | `knurl` | none | `--metal-lo` = fg-metal 50% into surface-1, 0.7 |
| Pad seams (stitching) | `seam` | none | `--seam` = fg-frame 70% into equip, 0.7, dashed 1.6 1.2 |
| Pulley and hub rims | `prim` | none | `--fg-metal` 0.7 |
| Far lever and far handle | `eqf` / `hdf` | `--body-far` / `--fg-line-far` | `--fg-line-far` 1.1 |
| Stack pin | `pin` | `var(--accent)` | none |
| Guide rods | `rod` | none | `--fg-frame` 1.1 |
| Cable | `cable` | none | `--fg-cable` = text 55% into surface-1, 1.25, round caps |
| Hand path guide | `guide` | none | accent 1.5, dashed 4 3, opacity 0.6 |
| Progress trail | `trail` | none | accent 2, round caps, `pathLength="1"`, `stroke-dasharray: 1 1`, animated `stroke-dashoffset` |
| Zoom overlays, direction arrows | `ovs`, `arrow`, `arrow-head` | head: accent | accent 2, round caps and joins |
| Floor | `floor` | | `--border` 1 |

Accent is used only for the working muscles and their glow, the stack pin, the path guide, the progress trail, zoom overlays and direction arrows. Handles are metal (spec 2.3). Body, rim, facet, muscle, equipment, rod, cable, floor, knurl, seam and rim strokes use `vector-effect: non-scaling-stroke`, so foreshortening never thickens or thins a line. Their widths are `calc(var(--sw) * N px)`: `--sw` is 1 on the stage and 0.75 in Pictures tiles. Guides, trail and overlays scale with the zoom camera on purpose (they get bolder when zoomed).

Three-pass layers (one outline and one rim per layer): each body LAYER draws every part's outline first (`olk`, 3 wide), then every part's rim (`rim`, 1.1 wide), then every part's fill, tone facets, glow and muscles, inside the same groups (`layer()` in `gen.mjs`). The fills hide the inner half of each stroke, so only the layer's silhouette keeps a 1.5 outline with a 0.55 lighter rim just inside it, and no seam shows where parts overlap (deltoid over upper arm, elbow, hip, knee). The far leg has no rim. Layers: body (torso, neck, head, near leg) and the arm (upper arm, deltoid, elbow cap, forearm and fist: one silhouette, section 4). The lower arm's fill is drawn over the upper arm's, and a small dark crease facet on the inner side of the 12-sided elbow cap (r 4.8) marks the joint; no outline crosses the arm at the elbow (the ring it drew before read as a cut, worst in the hold). Top view: the head is its own layer over the torso. Equipment keeps plain centred strokes.

Contrast is measured, not guessed: see the table in the generated block. The figure outline is at least 4.6:1 on the stage and at least 3.1:1 over the body (an arm over the torso) in every theme; the machine frame is at least 3.18:1. In Paper the outline is 70 % text (dark themes 60 %), because the lifted body fill is darker than the stage there, and 60 % gave only 2.46:1 over the body. `--map-line` alone is about 1.6:1 at this size, so it paints only the inner facet lines, as on the app's muscle map. The T-shirt keeps the body tone, so both of these numbers still hold for an arm over the torso; the detail paints have their own measured table (section 20).

## 6. Muscles and the effort cue

- Each part lists regions (generated block). A region paints `mm` if the exercise gives that muscle the role "main", `mh` if "helps", its tone class (section 20) if it has a tone or a cloth, and nothing otherwise (a muscle kept only for roles). Names: `chest`, `abs`, `obliques`, `lats`, `midBack`, `upperTraps`, `frontDelts`, `sideDelts`, `rearDelts`, `biceps`, `triceps`, `forearms`, `quads`, `calves`, and new with the figure detail: `glutes`, `hamstrings` (side view). A muscle that crosses a clothing edge is split into two regions with the same name (biceps and triceps at the sleeve hem, quads and hamstrings at the shorts hem), so a role paints both halves.
- Regions on the arm move with the arm (side delts face up when the arm is raised, as in life). The far leg shows no muscles.
- Effort cue: main-muscle polygons carry `anim XX-eff`, a flat opacity animation from 0.75 at the setup pose to 1.0 at the end pose, on the same samples. It never drops below 0.75, because the muscle still works in the stretched position.
- Target-muscle glow: each main-muscle region also gets a `gw` polygon under it (an accent halo, 5 wide, stroke-opacity 0.3) carrying `anim XX-ten`, whose opacity is the move progress p on the same samples: 0 at setup, rising through the lift, 1 in the hold (the hardest point), falling through the return, 0 in the reset, so the rep restart never flashes (section 20).

## 7. Equipment drawing style

- Machines: frame, columns, beams and rails are rounded rectangles (`rx` 1.5 to 2) in `eq`. Pads are rounded rectangles (`rx` 4) in `eq`, each with a stitched seam (`seam`) 2.1 inside its edge. Seat posts and brackets are plain `eq` rectangles. Draw only what explains the move: the frame that holds the moving part, the part the body touches, and the weight.
- Weight stack: 10 plates, each 48 x 12, with 1.5 gaps, from y 112.5 (x 26-74); guide rods at x 32 and 68. Every plate has a lighter top bevel (`eqh`, 45.6 x 1.2, 1.1 below its top). The pin (accent, 9 x 4, `rx` 2, with an accent knob r 2.6 at its end) goes in plate 6, and plates 1 to 6 move as one group (`XX-stack`, translateY). A top bracket (`eqm` 10 x 6.5) sits where the cable pulls. The stack lift is half the handle travel (a 2:1 cam).
- Levers: an `eqm` bar 5.2 wide from the pivot to the handle, a hub circle r 7 (`eqm`) with an r 2 `rod` centre on top, and the handle as a vertical `hd` grip 6.4 x 26 (`rx` 3), so it shows above and below the fist, with grip ribs (`knurl`) at 8.2, 9.6 and 11 above and below its centre, where the fist does not cover it (near handle only). The far handle is 21 tall (13 above its centre, 8 below), so its lower end stays behind the near fist instead of doubling it. The whole lever is one group rotating about the pivot.
- Cables and pulleys: pulleys are `eqm` circles r 5.2 to 6, with a rim ring (`prim`, r 3.2) and an `hd` hub (r 1.2); the lever hub gets a `prim` ring r 4.6. Cables are `cable` lines tangent to the pulleys. A vertical run that shortens with the stack uses `scaleY((run - lift) / run)` about its top end, on the same samples.
- Dumbbells, front view (seen end-on from the front and a little above): a short `hd` handle stub inside the fist (y 17.6 to 21.2; end-on, the handle itself is inside the hand, so no knurl shows in this view), then the index finger and thumb as a ring closed round it (a `bh` band 7.8 wide, y 17.2 to 20, with a `bl` crease under it), then the head: a 2.2-deep top band (`eqm` outline) split into its three hex faces (`eqs`, `eqh`, `eql`: mid, light, dark) and the hex end face (r 6.6, `sy` 0.92, `eqm`) with a thin `prim` hex rim (r 3.8) for the recessed cap (a dark centre read as a nut at phone size). The head is centred at (22, 28.5) in the arm's frame (screen-left: -22, 28.5), 12.5 below the grip and rotation point (22, 16), so its top band overlaps the lower part of the fist and the hand reads as closed round the handle. Copy the polygons from section 19; do not centre them on the grip. The dumbbell counter-rotates by minus the sum of the arm rotations, so it stays level. Side view: two `eqm` hex heads (r 7) joined by a 4-wide `hd` handle, held in the fist. Top view: a bar with two heads, 22 long, across the palm (spec 3.9).
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

- Rep timing (spec 2.5): lift 0-25 % (mid pose at 12.5 %), hold to 37.5 %, return to 87.5 % (mid at 62.5 %), reset pause to 100 %. The timing curve is baked into the samples, so keyframes play linear between samples.
- Rep time u (0 to 1) to move progress p (0 = setup pose, 1 = end pose), `progress()` in `gen.mjs`: u <= 0.25: p = mj(u / 0.25); u <= 0.375: p = 1; u <= 0.875: p = 1 - mj((u - 0.375) / 0.5); after that p = 0. mj(x) = 10x^3 - 15x^4 + 6x^5 (minimum jerk: speed and acceleration are zero at both ends of every move, no kink mid-move). Every keyframe stop is a pose solved at p(u); the chest press maps p to a hand place through `pace()` (see the comment in `gen.mjs`).
- Baked samples (`SAMPLES`): a stop every 0.25 % of the rep in the 1 s lift and every 0.5 % in the 2 s return (0.01 s between stops either way at 1x; D-R1), the holds only at their boundaries: 203 stops per group, angles and scales written to 1e-4 (`n4`). Reason: with few key poses, two joints turning at once swing the hand off the handle between poses, and coarse stops make the speed change in visible steps. The smoothness check in section 20 measures the result.
- Restart with two keyframe sets: every `@keyframes` is written twice, `name-a` and `name-b`. The root carries `class="player gen-{{ gen }}"`, and each moving class has `.gen-a .XX-ua{animation-name:XX-ua-a}.gen-b .XX-ua{animation-name:XX-ua-b}`. Changing `gen` changes every animation's name, which restarts it from 0 %. Flip `gen` on Replay, on a speed change, on a mode change, and when a Pictures still opens or closes. The class goes on the ROOT, not on the stage, because the captions and the rep pill live outside the stage.
- Captions: four spans stacked in one grid cell (`.stack`), each `capx c1..c4` with hard-step opacity keyframes (0-25 %, 25-37.5 %, 37.5-87.5 %, 87.5-100 %). The rep pill uses three `repx r1..r3` spans over one 3-rep cycle. They share the figure's variables, so they cannot drift from it.
- Paused before the first Play = the 0 % keyframe = the setup pose. After 3 reps (loop off), fill-mode keeps the 100 % frame, which equals 0 %. The logic's 200 ms timer then sets `ended`, and the button becomes Replay.
- Speed: the change restarts from the setup pose (a `gen` flip) and keeps playing. Changing `animation-duration` mid-rep would make the figure jump.

## 9. Solving poses

- Angles: in side and top views, measured from straight down (+y), positive toward +x. SVG `rotate(θ)` is positive clockwise, so the upper-arm rotate = `-phi` and the forearm rotate (relative) = `-(psi - phi)`.
- Arms in the camera plane (curls, pushdowns, lateral raise): a 2D 2-bone solve, or plain forward angles as the spec gives them.
- Arms that leave the camera plane (presses, rows, rear delt fly, Around the World, arm circles): the 3D pole-vector solve (`solve3` in `gen.mjs`, from rig-pill). Inputs: shoulder S and grip G in 3D (z = sideways, out from the body midline toward the camera for the near arm), lengths 38 and 40, and a pole direction for the elbow. The elbow sits on the circle of possible elbows, at the point nearest the pole. Drawn lengths are the projections: `fu = |E - S|xy / 38`, `ff = |G - E|xy / 40`. Keyframes: `ua` rotate(-phi), `ul` scaleY(fu), `fa` translateY(-(1 - fu) x 38) rotate(-(psi - phi)), `fl` scaleY(ff), `hd` translateY(-(1 - ff) x 40).
- Choosing the pole: pick the setup elbow you want, set `pole0` = direction from the shoulder to that elbow, and blend to `pole1` for the end pose: `pole(p) = norm((1 - p) pole0 + p pole1)`, normalised at every sample. The chest press picks the setup elbow (149, 166), 1 unit behind and 22 below the shoulder, so fu = 0.58 and the elbow stays off the back pad. Its z is whatever keeps the upper arm 38 long: 30.97. This is the rig proof's own setup elbow; the chest press player moves it (see `anim-machine-chest-press/PLAYER.md` section 13).
- Chest press numbers, the rig proof's own (also printed from the build in section 19; the chest press player patches several of these on top — `anim-machine-chest-press/PLAYER.md` section 13 has the player's own numbers): `pole0 = norm([-1, 22, 30.97])`, `pole1 = norm([-0.1, 0.6, 0.8])`. p is linear in grip x: `x = 187 + 39 p`; grip y = `58 + sqrt(100^2 - (x - 206.5)^2)`; lever rotate = `-asin((x - 206.5) / 100)`; grip z = `38.56 - 32.56 p` (38.56 = the elbow's 30.97 plus the forearm's sideways part at setup; 6 at the end). With these, the shoulder (150, 144, 0) and the lengths 38 and 40, `solve3` gives every elbow in the key-pose table.
- Sideways hand path: z runs straight from start to end with the move (chest press: 38.6 to 6), so the hands move steadily inward and the rig stays correct if it is reused for a top or three-quarter camera.
- Check every new move against its spec truth table in numbers: elbow inside angle (3D), arm out from side (`asin(Ez / 38)`), arm forward (`atan2(Ex - Sx, Ey - Sy)`). `gen.mjs` writes them into `poses.json` and the table below; `shoot.cjs` fails the build if they leave range.

## 10. Path guide and progress trail

- The guide is the full hand path, dashed. The progress trail is the same path drawn solid in accent, from the start to where the hand is now: `pathLength="1"`, `stroke-dasharray: 1 1`, and `stroke-dashoffset` animated from 1 to 0 with the move (baked on the same samples as the arm, as the share of path length covered).
- The path follows the bottom tip of what the hand holds, so the forearm never hides it. Chest press: the handle's bottom end (lever radius 100 + 13). Lateral raise: the grip path moved 20 down, just under the dumbbell.
- During the return the trail shrinks back with the hand, so it always shows how much of the range is done and where to stop.

## 11. Zoom camera, overlays and the caption bubble

- The scene sits in `<g class="cam zoom-{{ zoom }}">`. Each chip has one CSS rule: `.cam.zoom-<id>{transform:translate(179px,138px) scale(s) translate(-cx px,-cy px)}` with `transform-box: view-box; transform-origin: 0 0; transition: transform 320ms cubic-bezier(.32,.72,0,1)`. The animation keeps running while zoomed.
- Overlays start at `opacity: 0` (150 ms fade) and show with `.zoom-<id> .ov-<id>{opacity:1}`. Grip: an accent ring r 12 inside the hand group, so it follows the hand. Path: the always-on guide and trail. Parts (seat, elbows, shoulders): an accent 2-unit outline on that part, or a guide line lifted 4 to 5 units off it when the part already carries a muscle tint (lateral raise Shoulders), plus direction arrows where the cue is a direction ("keep down").
- Put the chip target where the subject is, so it lands at the stage centre (179, 138), above the bubble. When the subject is a pair (both elbows, both shoulders), centre on the midline between them, so both stay in view for the whole rep. Then check the keep-clear rule in section 2 for the whole rep, not one frame.
- While a chip is on, the rep pill row and the camera label hide, so nothing moving passes under them in a close-up. They come back when the chip is turned off.
- Caption bubble (spec 2.2): absolute, left 12, right 12, bottom 12; `--surface-2`, 1px `--border`, radius `--radius-md`, padding 8px 12px, 13px/18px `--text`, then an 8px dot (margin-top 5) and the text. It shows while a chip is on (accent dot, the chip's caption) or while a muscle is tapped (the muscle's colour, `<b>Common name</b> (anatomical), role. Line.`, section 21). One state holds both: `bubble: { kind: 'zoom' | 'muscle', id } | null`.

## 12. Pictures mode

- Grid: absolute over the stage (`inset: 1px`), padding 6, gap 6, 2 x 2 tiles of 169 x 128, `--surface-1` behind, radius `--radius-lg`. Tile: `--surface-2`, radius `--radius-md`. Top to bottom: the pose picture (169 x 90), then the caption (12px/16px `--text-2`, at most 2 lines, padding 0 8 6). The badge is an 18px circle at 6,6: `--accent-soft` laid over `--surface-2` (opaque, so machine parts never show through it), a 2px `--surface-2` ring, and an `--accent` 11px/700 number.
- The pictures are the rig itself, not copies: wrap the whole scene in `<g id="rig-XX">` (unique per player) and draw each tile as `<svg viewBox="<tile box>"><use href="#rig-XX" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -<pose>)"/></svg>`. The pose comes from the `use` element's own variables, so no extra keyframes and no static pose markup are needed. Checked: the four tiles render four different poses.
- Key poses: 1 = 0 %, 2 = 12.5 %, 3 = 31 %, 4 = 62.5 % (Around the World 0, 20, 45, 70 %). Tiles 2 and 4 carry an accent arrow (`arrowSvg(a, 1.5)`, class `arrow-lg`: 3 units, filled head 9 long) beside the hand path in the move's direction, drawn in the tile's own SVG in scene units.
- Tile box: a crop of the scene around the figure and the working equipment (chest press 96 104 160 158; lateral raise 66 51 226 213, which leaves 10 units of headroom above the head). The picture fills the 90 height; the sides show a little more of the scene.
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
| the muscle hotspots' `data-hot="i"` (section 21) | `onClick="{{ tapChest }}" onKeyDown="{{ keyChest }}"` per muscle (named after its id: `tapFrontDelts`, `keySideDelts`, and so on); `data-class="clsChest"` on the role polygons becomes `class="{{ clsChest }}"`; `data-click="tapStage"` on the stage becomes `onClick="{{ tapStage }}"` |
| the bubble's `data-style="bubbleDotStyle"`, `data-text="bubbleName"` and `data-text="bubbleRest"` | `style="{{ bubbleDotStyle }}"` on the dot, `<b>{{ bubbleName }}</b> {{ bubbleRest }}` (plain text holes only; the bold name is its own element) |
| `THEMES`, `themeVars`, `rigVars`, `EX`, `on`, `class Component extends DCLogic` | paste as is into `<script type="text/x-dc" data-dc-script>` |
| props from the query string | `data-props` per spec 2.1 (theme, autoplay, loop, `$preview` 358 x 460) |
| the `class DCLogic` stand-in, `bind()`, the boot code, `?t`, the harness note | delete |

The harness has no probe elements. Checks measure real parts through `getCTM()`.

## 15. The two proofs

Machine Chest Press, side view (`chest-press.html`); the numbers below are the rig proof's own — the chest press player patches several of them (`anim-machine-chest-press/PLAYER.md` section 13 has the player's own numbers):
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
| 3.5 chip Grip (242, 139, 2.0) "Light grip. Palms face the floor at the top." | Shoulders (179, 90, 2.2) "Keep your shoulders down, away from your ears. No shrug." | the hand now shows above the dumbbell head, but a light grip and which way the palms face still cannot be shown from the front; shrugging is a listed common mistake and this view shows it |
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
| Figure detail turns into noise at 1x or in the 169 x 90 tiles | Detail is fill-only facets inside the existing parts; lines (rim, knurl, seam, rims) scale with `--sw`. Checked by eye at device scale 1 and 3, in the tiles and every zoom (section 20). |
| Detail makes the pages heavy | About 17 KB (chest press) and 20 KB (lateral raise) more per page, 6.6 KB of it the one secondary-motion channel. Every player stays far under 450 KB (section 20). |
| A new paint drifts off the theme tokens | `shoot.cjs` scans the page CSS and markup for any colour literal, and the contrast table is computed from the CSS itself, not from a copy of the recipe. |
| The glow or a secondary-motion facet flashes at a rep restart | One opacity channel on the move progress: 0 at setup and in the reset, checked over 481 samples, with a step limit of 0.02 per 1/120 s. |
| Secondary motion moves a joint that a check holds fixed | It is opacity only, inside the torso, with no `rotate()`: the smoothness sampler never sees it as a joint, and the shoulder drift, elbow bend and level dumbbell checks still run. |
| The harness cannot reach Google Fonts, so the caption row is measured in a wider fallback font | The harness loads Roboto like the canvas (the same link) and also from a local latin copy (`fonts/Roboto-latin.woff2`, 43 KB); the shoots answer the Google link with an empty stylesheet, so they are offline and deterministic. `.cap` shrinks with an ellipsis before it can push the tempo note out, whatever font draws it (D-R3). |
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
<polygon class="olk" points="-6.2,-78 1.2,-76 3.2,-72.6 6.8,-66 5,-62.5 -5.5,-62.5 -7,-67"/>  <!-- outline pass -->
<polygon class="rim" points="-6.2,-78 1.2,-76 3.2,-72.6 6.8,-66 5,-62.5 -5.5,-62.5 -7,-67"/>  <!-- rim pass -->
<polygon class="b" points="-6.2,-78 1.2,-76 3.2,-72.6 6.8,-66 5,-62.5 -5.5,-62.5 -7,-67"/>  <!-- fill pass -->
<polygon class="bh" data-region="throat" points="1.2,-76 3.2,-72.6 6.8,-66 4.4,-66.2 0.6,-72.6 -1.4,-75.6"/>
<polygon class="bl" data-region="nape" points="-6.2,-78 -3.4,-77.4 -4.8,-69 -7,-67"/>
<!-- torso  (lives in: figure root) -->
<polygon class="olk" points="-6.4,-72.6 -1.5,-70.8 3.8,-68.6 7.2,-66.6 11.4,-64.6 15,-57 15.8,-48.5 14.2,-41.2 11.8,-36.4 10.2,-26 9.8,-14 10.8,-4 7.8,6 -3,8.5 -10.5,6 -12.8,-3 -10.8,-15 -10,-26 -11.9,-40 -12.3,-52 -11.2,-60.5 -9.2,-67.2"/>  <!-- outline pass -->
<polygon class="rim" points="-6.4,-72.6 -1.5,-70.8 3.8,-68.6 7.2,-66.6 11.4,-64.6 15,-57 15.8,-48.5 14.2,-41.2 11.8,-36.4 10.2,-26 9.8,-14 10.8,-4 7.8,6 -3,8.5 -10.5,6 -12.8,-3 -10.8,-15 -10,-26 -11.9,-40 -12.3,-52 -11.2,-60.5 -9.2,-67.2"/>  <!-- rim pass -->
<polygon class="t" points="-6.4,-72.6 -1.5,-70.8 3.8,-68.6 7.2,-66.6 11.4,-64.6 15,-57 15.8,-48.5 14.2,-41.2 11.8,-36.4 10.2,-26 9.8,-14 10.8,-4 7.8,6 -3,8.5 -10.5,6 -12.8,-3 -10.8,-15 -10,-26 -11.9,-40 -12.3,-52 -11.2,-60.5 -9.2,-67.2"/>  <!-- fill pass -->
<polygon class="p" data-region="shorts" points="10.5,-7 10.8,-4 7.8,6 -3,8.5 -10.5,6 -12.8,-3 -11.87,-8.6"/>
<polygon class="pl" data-region="waistband" points="10.5,-7 -11.87,-8.6 -12.1,-7.2 10.64,-5.6"/>
<polygon class="pl" data-region="glutes" points="-3,8.5 -10.5,6 -12.8,-3 -12.1,-6.8 -6,-4.6 -1.6,2"/>  <!-- mm if main, mh if helps, pl otherwise -->
<polygon class="th" data-region="upperTraps" points="-6.6,-71.1 -1.8,-69.3 0.6,-66.4 -3.6,-61 -11.2,-60.5 -9.2,-67.2"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="tl" data-region="collar" points="-6.4,-72.6 -1.5,-70.8 3.8,-68.6 7.2,-66.6 6.4,-65.4 3.2,-67.3 -1.8,-69.3 -6.6,-71.1"/>
<polygon class="mm" data-region="midBack" points="-11.2,-60.5 -3.6,-61 -5.4,-54.6 -12.3,-52"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="tl" data-region="lats" points="-12.3,-52 -5.4,-54.6 -2.6,-42 -4.8,-30 -10,-26 -11.9,-40"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="tl" data-region="armpit" points="-3.4,-56.4 1.4,-56 0.8,-48.6 -1.8,-47.4"/>
<polygon class="th" data-region="latFold" points="-2.6,-42 -4.8,-30 -3.2,-29.6 -0.8,-41"/>
<polygon class="tl" data-region="underChest" points="12.7,-38.6 12.2,-35.6 7,-36.2 8.4,-38.2"/>
<polygon class="mm" data-region="abs" points="11.4,-33.8 10.2,-26 9.8,-14 10.5,-7 5.8,-7.4 5.6,-24 6.6,-36.4"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="mm" data-region="obliques" points="5.6,-24 5.8,-7.4 -4,-8.2 -4.8,-19 -0.4,-27"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="th" data-region="chest" points="9.4,-64.4 12.8,-61.2 15.3,-52 8,-50.2 3.6,-52 1.4,-56 4.6,-61.4"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="th" data-region="chest" points="15.3,-52 14.7,-44 12.7,-38.6 8.4,-38.2 3.6,-42 0.8,-48.6 3.6,-52 8,-50.2"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="tl" data-region="brace" points="10.2,-26 9.8,-14 10.5,-7 8.6,-7.2 8,-14 8.4,-26.4"/>  <!-- secondary motion: add "tn anim XX-ten" -->
<polygon class="tl" data-region="bladeEdge" points="-8.8,-60.2 -7.4,-60 -9,-50.8 -10.4,-51"/>  <!-- secondary motion: add "tn anim XX-ten" -->
<!-- head  (lives in: figure root) -->
<polygon class="olk" points="-7.2,-85.5 -5.6,-90.8 -1.5,-93.8 4.5,-94 9.6,-91.6 12.2,-87.6 13,-84.6 12.4,-83.2 13.4,-81.4 15.4,-78.6 13.3,-77.4 13.2,-75.8 12.8,-73.5 11,-71.2 5.6,-70.8 1.8,-73.6 -1.5,-75.2 -5.8,-78.4"/>  <!-- outline pass -->
<polygon class="rim" points="-7.2,-85.5 -5.6,-90.8 -1.5,-93.8 4.5,-94 9.6,-91.6 12.2,-87.6 13,-84.6 12.4,-83.2 13.4,-81.4 15.4,-78.6 13.3,-77.4 13.2,-75.8 12.8,-73.5 11,-71.2 5.6,-70.8 1.8,-73.6 -1.5,-75.2 -5.8,-78.4"/>  <!-- rim pass -->
<polygon class="b" points="-7.2,-85.5 -5.6,-90.8 -1.5,-93.8 4.5,-94 9.6,-91.6 12.2,-87.6 13,-84.6 12.4,-83.2 13.4,-81.4 15.4,-78.6 13.3,-77.4 13.2,-75.8 12.8,-73.5 11,-71.2 5.6,-70.8 1.8,-73.6 -1.5,-75.2 -5.8,-78.4"/>  <!-- fill pass -->
<polygon class="hr" data-region="hair" points="10.38,-90.4 9.6,-91.6 4.5,-94 -1.5,-93.8 -5.6,-90.8 -7.2,-85.5 -6.3,-81 -3,-82.4 -1.4,-85.6 2,-87.2 5.8,-88 8.2,-89.4"/>
<polygon class="hrh" data-region="hairSheen" points="4.5,-94 -1.5,-93.8 -3.6,-92.2 1.4,-92.6 6.6,-92.9"/>
<polygon class="bh" data-region="forehead" points="10.38,-90.4 8.2,-89.4 5.8,-88 2,-87.2 -1.4,-85.6 1.4,-84.8 5,-85.6 8.8,-85.4 9.8,-87.6"/>
<polygon class="bh" data-region="ear" points="-0.4,-83.8 2.4,-85.2 4.6,-82.8 4.4,-78.8 2.6,-76.6 0.2,-78.2"/>
<polygon class="bl" data-region="earInner" points="0.6,-82.6 2.4,-83.6 3.4,-82 3.2,-79.4 2.2,-78.2 0.8,-79.4"/>
<polygon class="bh" data-region="face" points="9.2,-84 12.4,-83.2 13.4,-81.4 15.4,-78.6 13.3,-77.4 13.2,-75.8 10,-75.6 8,-79.6"/>
<polygon class="bl" data-region="brow" points="8.8,-85.4 13,-84.6 12.4,-83.2 9.4,-84.2"/>
<polygon class="bl" data-region="jaw" points="12.8,-73.5 11,-71.2 5.6,-70.8 1.8,-73.6 7,-73.4"/>
<!-- upperArm  (lives in: ua > ul) -->
<polygon class="olk" points="-5.5,-64 5.5,-64 6.3,-53 6.5,-45 5.4,-34 4.4,-27 2.2,-23.8 0,-23 -4.6,-27 -6.2,-48"/>  <!-- outline pass -->
<polygon class="rim" points="-5.5,-64 5.5,-64 6.3,-53 6.5,-45 5.4,-34 4.4,-27 2.2,-23.8 0,-23 -4.6,-27 -6.2,-48"/>  <!-- rim pass -->
<polygon class="b" points="-5.5,-64 5.5,-64 6.3,-53 6.5,-45 5.4,-34 4.4,-27 2.2,-23.8 0,-23 -4.6,-27 -6.2,-48"/>  <!-- fill pass -->
<polygon class="t" data-region="sleeve" points="-5.5,-64 5.5,-64 6.3,-53 6.5,-45 6.3,-43 -5.74,-42 -6.2,-48"/>
<polygon class="th" data-region="biceps" points="2.2,-64 5.5,-64 6.3,-53 6.5,-45 6.3,-43 2.4,-42.7"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="bh" data-region="biceps" points="2.4,-42.7 6.3,-43 5.4,-34 4.4,-27 2.2,-25.2 1.8,-34"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="tl" data-region="triceps" points="-5.5,-64 -2.4,-64 -2.6,-42.3 -5.74,-42 -6.2,-48"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="bl" data-region="triceps" points="-5.74,-42 -2.6,-42.3 -2,-32 -2.4,-25.2 -4.6,-27"/>  <!-- mm if main, mh if helps, bl otherwise -->
<polygon class="tl" data-region="sleeveHem" points="6.3,-43 -5.74,-42 -5.85,-43.4 6.44,-44.4"/>
<!-- deltoid  (lives in: ua) -->
<polygon class="olk" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.8,-57 5.6,-50.6 0.6,-49 -4.4,-50 -6.5,-54.4"/>  <!-- outline pass -->
<polygon class="rim" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.8,-57 5.6,-50.6 0.6,-49 -4.4,-50 -6.5,-54.4"/>  <!-- rim pass -->
<polygon class="t" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.8,-57 5.6,-50.6 0.6,-49 -4.4,-50 -6.5,-54.4"/>  <!-- fill pass -->
<polygon class="th" data-region="frontDelts" points="2.4,-69.2 4,-69 7.5,-64.5 7.8,-57 5.6,-50.6 3,-49.8 2.2,-61"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="mm" data-region="sideDelts" points="-2.2,-69.4 2.4,-69.2 2.2,-61 3,-49.8 0.6,-49 -3.2,-49.7 -2.4,-61"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="tl" data-region="rearDelts" points="-6.5,-66 -2.5,-69.5 -2.2,-69.4 -2.4,-61 -3.2,-49.7 -4.4,-50 -6.5,-54.4"/>  <!-- mm if main, mh if helps, tl otherwise -->
<!-- elbowCap  (lives in: fa) -->
<polygon class="olk" points="4.64,-22.76 3.39,-20.61 1.24,-19.36 -1.24,-19.36 -3.39,-20.61 -4.64,-22.76 -4.64,-25.24 -3.39,-27.39 -1.24,-28.64 1.24,-28.64 3.39,-27.39 4.64,-25.24"/>  <!-- outline pass -->
<polygon class="rim" points="4.64,-22.76 3.39,-20.61 1.24,-19.36 -1.24,-19.36 -3.39,-20.61 -4.64,-22.76 -4.64,-25.24 -3.39,-27.39 -1.24,-28.64 1.24,-28.64 3.39,-27.39 4.64,-25.24"/>  <!-- rim pass -->
<polygon class="b" points="4.64,-22.76 3.39,-20.61 1.24,-19.36 -1.24,-19.36 -3.39,-20.61 -4.64,-22.76 -4.64,-25.24 -3.39,-27.39 -1.24,-28.64 1.24,-28.64 3.39,-27.39 4.64,-25.24"/>  <!-- fill pass -->
<polygon class="bl" data-region="elbowCrease" points="2.6,-27.2 4.4,-24 2.6,-20.8 1.6,-24"/>
<!-- forearm  (lives in: fa > fl) -->
<polygon class="olk" points="-4.8,-25 5,-25 6.4,-19.5 6.2,-14 4.9,-3 4,7 -4,7 -4.5,-6 -4.9,-17"/>  <!-- outline pass -->
<polygon class="rim" points="-4.8,-25 5,-25 6.4,-19.5 6.2,-14 4.9,-3 4,7 -4,7 -4.5,-6 -4.9,-17"/>  <!-- rim pass -->
<polygon class="b" points="-4.8,-25 5,-25 6.4,-19.5 6.2,-14 4.9,-3 4,7 -4,7 -4.5,-6 -4.9,-17"/>  <!-- fill pass -->
<polygon class="bh" data-region="forearms" points="0.6,-25 5,-25 6.4,-19.5 6.2,-14 4.9,-3 4,7 0.8,7"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="bl" data-region="forearmUnder" points="-4.8,-25 -2.6,-25 -2.2,7 -4,7 -4.5,-6 -4.9,-17"/>
<!-- fist  (lives in: fa > hd) -->
<polygon class="olk" points="-3.7,6.4 3.7,6.4 5.6,9.2 7.2,13 7.3,16.6 6.2,19.6 4.8,21.2 2.2,21.8 -0.6,21.8 -3.2,21.5 -5.2,20.6 -6,17.6 -5.8,12.4 -4.8,9"/>  <!-- outline pass -->
<polygon class="rim" points="-3.7,6.4 3.7,6.4 5.6,9.2 7.2,13 7.3,16.6 6.2,19.6 4.8,21.2 2.2,21.8 -0.6,21.8 -3.2,21.5 -5.2,20.6 -6,17.6 -5.8,12.4 -4.8,9"/>  <!-- rim pass -->
<polygon class="b" points="-3.7,6.4 3.7,6.4 5.6,9.2 7.2,13 7.3,16.6 6.2,19.6 4.8,21.2 2.2,21.8 -0.6,21.8 -3.2,21.5 -5.2,20.6 -6,17.6 -5.8,12.4 -4.8,9"/>  <!-- fill pass -->
<polygon class="bl" data-region="palmHeel" points="-3.7,6.4 -4.8,9 -5.8,12.4 -4.6,12.8 -3.4,7.4"/>
<polygon class="bl" data-region="fingerGaps" points="3.3,15.8 3.3,18.6 4.6,20.4 3.4,21.4 2.2,21.8 -0.6,21.8 -3.2,21.5 -5.2,20.6 -6,17.6 -5.9,15.6"/>
<polygon class="bh" data-region="finger1" points="0.9,15.8 3.1,15.6 3.3,18.6 2.9,20.9 1.5,21.5 0.8,18.8"/>
<polygon class="bh" data-region="finger2" points="-1.5,15.8 0.5,15.8 0.4,18.8 0.3,21.6 -1.3,21.7 -1.7,18.8"/>
<polygon class="bh" data-region="finger3" points="-3.8,15.8 -1.9,15.8 -2,18.8 -2.1,21.6 -3.5,21.4 -4,18.8"/>
<polygon class="bh" data-region="finger4" points="-5.9,15.8 -4.2,15.8 -4.4,18.8 -4.4,21.2 -5.3,20.6 -6,17.6"/>
<polygon class="bl" data-region="thumbCrease" points="1.5,7.4 3.6,9.6 4.4,13.4 4,18.2 5.2,19.6 4.6,20.4 3.2,18.6 3.4,13.4 2.6,10 0.8,8.1"/>
<polygon class="bh" data-region="thumb" points="3.2,6.6 5.6,9.2 7.2,13 7.3,16.6 6.6,18.6 5.2,19.6 4,18.2 4.4,13.4 3.6,9.6 1.8,7.6"/>
<!-- hipCap  (lives in: thigh) -->
<polygon class="olk" points="8.11,2.17 5.94,5.94 2.17,8.11 -2.17,8.11 -5.94,5.94 -8.11,2.17 -8.11,-2.17 -5.94,-5.94 -2.17,-8.11 2.17,-8.11 5.94,-5.94 8.11,-2.17"/>  <!-- outline pass -->
<polygon class="rim" points="8.11,2.17 5.94,5.94 2.17,8.11 -2.17,8.11 -5.94,5.94 -8.11,2.17 -8.11,-2.17 -5.94,-5.94 -2.17,-8.11 2.17,-8.11 5.94,-5.94 8.11,-2.17"/>  <!-- rim pass -->
<polygon class="p" points="8.11,2.17 5.94,5.94 2.17,8.11 -2.17,8.11 -5.94,5.94 -8.11,2.17 -8.11,-2.17 -5.94,-5.94 -2.17,-8.11 2.17,-8.11 5.94,-5.94 8.11,-2.17"/>  <!-- fill pass -->
<!-- thigh  (lives in: thigh) -->
<polygon class="olk" points="-8.5,-3 8.5,-3 8.9,10 8.3,22 6.4,40 4.6,47.6 0,51 -3.8,49.8 -6,46 -7.8,32 -8.5,16"/>  <!-- outline pass -->
<polygon class="rim" points="-8.5,-3 8.5,-3 8.9,10 8.3,22 6.4,40 4.6,47.6 0,51 -3.8,49.8 -6,46 -7.8,32 -8.5,16"/>  <!-- rim pass -->
<polygon class="b" points="-8.5,-3 8.5,-3 8.9,10 8.3,22 6.4,40 4.6,47.6 0,51 -3.8,49.8 -6,46 -7.8,32 -8.5,16"/>  <!-- fill pass -->
<polygon class="p" data-region="shorts" points="-8.5,-3 8.5,-3 8.9,10 8.3,22 6.82,36 -7.09,37.5 -7.8,32 -8.5,16"/>
<polygon class="ph" data-region="quads" points="3,-3 8.5,-3 8.9,10 8.3,22 6.82,36 3.2,36.4"/>  <!-- mm if main, mh if helps, ph otherwise -->
<polygon class="bh" data-region="quads" points="3.2,36.4 6.82,36 6.4,40 4.6,47.6 2.4,49.4 1.6,42"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="pl" data-region="hamstrings" points="-8.5,-3 -3.4,-3 -3.6,37 -7.09,37.5 -7.8,32 -8.5,16"/>  <!-- mm if main, mh if helps, pl otherwise -->
<polygon class="bl" data-region="hamstrings" points="-7.09,37.5 -3.6,37 -2.8,48.6 -3.8,49.8 -6,46"/>  <!-- mm if main, mh if helps, bl otherwise -->
<polygon class="pl" data-region="shortsHem" points="6.82,36 -7.09,37.5 -7.27,36.1 6.97,34.6"/>
<!-- kneeCap  (lives in: shin) -->
<polygon class="olk" points="5.8,51.55 4.24,54.24 1.55,55.8 -1.55,55.8 -4.24,54.24 -5.8,51.55 -5.8,48.45 -4.24,45.76 -1.55,44.2 1.55,44.2 4.24,45.76 5.8,48.45"/>  <!-- outline pass -->
<polygon class="rim" points="5.8,51.55 4.24,54.24 1.55,55.8 -1.55,55.8 -4.24,54.24 -5.8,51.55 -5.8,48.45 -4.24,45.76 -1.55,44.2 1.55,44.2 4.24,45.76 5.8,48.45"/>  <!-- rim pass -->
<polygon class="b" points="5.8,51.55 4.24,54.24 1.55,55.8 -1.55,55.8 -4.24,54.24 -5.8,51.55 -5.8,48.45 -4.24,45.76 -1.55,44.2 1.55,44.2 4.24,45.76 5.8,48.45"/>  <!-- fill pass -->
<polygon class="bh" data-region="patella" points="0,44 3,44.8 5.2,47 6,50 5.2,53 3,55.2 0,56"/>
<!-- shin  (lives in: shin) -->
<polygon class="olk" points="-5.5,49 5.5,49 5.4,60 4.4,80 3.8,94 -4,94 -5.4,84 -7,66 -6.8,58"/>  <!-- outline pass -->
<polygon class="rim" points="-5.5,49 5.5,49 5.4,60 4.4,80 3.8,94 -4,94 -5.4,84 -7,66 -6.8,58"/>  <!-- rim pass -->
<polygon class="b" points="-5.5,49 5.5,49 5.4,60 4.4,80 3.8,94 -4,94 -5.4,84 -7,66 -6.8,58"/>  <!-- fill pass -->
<polygon class="bl" data-region="calves" points="-5.5,49 -2,49.5 -2.2,62 -3.4,78 -5.4,84 -7,66 -6.8,58"/>  <!-- mm if main, mh if helps, bl otherwise -->
<polygon class="bh" data-region="shinFront" points="2.6,49.6 5.5,49 5.4,60 4.4,80 3.8,94 2,94 2.4,72"/>
<!-- foot  (lives in: shin) -->
<polygon class="olk" points="-5.6,92.2 3.4,92.4 7.4,96.2 13.6,97.8 17.2,99.2 17.9,101 17.6,102 -6.2,102 -6.8,99 -6.6,95"/>  <!-- outline pass -->
<polygon class="rim" points="-5.6,92.2 3.4,92.4 7.4,96.2 13.6,97.8 17.2,99.2 17.9,101 17.6,102 -6.2,102 -6.8,99 -6.6,95"/>  <!-- rim pass -->
<polygon class="s" points="-5.6,92.2 3.4,92.4 7.4,96.2 13.6,97.8 17.2,99.2 17.9,101 17.6,102 -6.2,102 -6.8,99 -6.6,95"/>  <!-- fill pass -->
<polygon class="sl" data-region="collar" points="-5.6,92.2 3.4,92.4 4.4,93.4 -6.1,93.6"/>
<polygon class="sh" data-region="toeCap" points="11,97.2 13.6,97.8 17.2,99.2 17.67,100.4 11.8,100.4 10.4,98.6"/>
<polygon class="so" data-region="sole" points="-6.52,100.4 17.67,100.4 17.9,101 17.6,102 -6.2,102"/>
```

**Front view parts (screen-right side; screen-left = same points with x negated; rig origin = midway between the hips)**

```html
<!-- neck  (lives in: figure root) -->
<polygon class="olk" points="-5.2,-80 5.2,-80 5.6,-73 8.2,-67.4 6.4,-64 -6.4,-64 -8.2,-67.4 -5.6,-73"/>  <!-- outline pass -->
<polygon class="rim" points="-5.2,-80 5.2,-80 5.6,-73 8.2,-67.4 6.4,-64 -6.4,-64 -8.2,-67.4 -5.6,-73"/>  <!-- rim pass -->
<polygon class="b" points="-5.2,-80 5.2,-80 5.6,-73 8.2,-67.4 6.4,-64 -6.4,-64 -8.2,-67.4 -5.6,-73"/>  <!-- fill pass -->
<polygon class="bl" data-region="neckSide" points="5.2,-78 5.6,-73 8.2,-67.4 6,-67 4.2,-72.4"/>
<polygon class="bl" data-region="neckSide" points="-5.2,-78 -5.6,-73 -8.2,-67.4 -6,-67 -4.2,-72.4"/>
<polygon class="bl" data-region="underChin" points="-5.4,-73.4 5.4,-73.4 5.6,-71 0,-69.4 -5.6,-71"/>
<!-- torso  (lives in: figure root) -->
<polygon class="olk" points="0,-65.8 3.4,-67 6.2,-71.2 11.6,-69 17.2,-66.2 21,-62.6 20.2,-52 16.6,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.6,-38 -20.2,-52 -21,-62.6 -17.2,-66.2 -11.6,-69 -6.2,-71.2 -3.4,-67"/>  <!-- outline pass -->
<polygon class="rim" points="0,-65.8 3.4,-67 6.2,-71.2 11.6,-69 17.2,-66.2 21,-62.6 20.2,-52 16.6,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.6,-38 -20.2,-52 -21,-62.6 -17.2,-66.2 -11.6,-69 -6.2,-71.2 -3.4,-67"/>  <!-- rim pass -->
<polygon class="t" points="0,-65.8 3.4,-67 6.2,-71.2 11.6,-69 17.2,-66.2 21,-62.6 20.2,-52 16.6,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.6,-38 -20.2,-52 -21,-62.6 -17.2,-66.2 -11.6,-69 -6.2,-71.2 -3.4,-67"/>  <!-- fill pass -->
<polygon class="p" data-region="shorts" points="0,-7 16.05,-7 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -16.05,-7"/>
<polygon class="ph" data-region="shortsFront" points="0,-5.6 12.6,-5.6 13.2,-1.6 12,3.6 5.4,9.2 0,10.2 -5.4,9.2 -12,3.6 -13.2,-1.6 -12.6,-5.6"/>
<polygon class="pl" data-region="fly" points="-0.45,-5.6 0.45,-5.6 0.35,8.2 -0.35,8.2"/>
<polygon class="pl" data-region="waistband" points="16.05,-7 -16.05,-7 -16.2,-5.6 16.2,-5.6"/>
<polygon class="th" data-region="upperTraps" points="6.2,-71.2 11.6,-69 17.2,-66.2 21,-62.6 13,-63.4 7.4,-67.6"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="th" data-region="upperTraps" points="-6.2,-71.2 -11.6,-69 -17.2,-66.2 -21,-62.6 -13,-63.4 -7.4,-67.6"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="tl" data-region="collar" points="0,-65.8 3.4,-67 6.2,-71.2 7.4,-70.7 4.2,-65.6 0,-64.4 -4.2,-65.6 -7.4,-70.7 -6.2,-71.2 -3.4,-67"/>
<polygon class="tl" data-region="underChest" points="16.4,-45.4 8.6,-43.2 1,-44.6 1,-42.6 8.6,-41 15.9,-43.4"/>
<polygon class="tl" data-region="underChest" points="-16.4,-45.4 -8.6,-43.2 -1,-44.6 -1,-42.6 -8.6,-41 -15.9,-43.4"/>
<polygon class="tl" data-region="lats" points="20.2,-52 16.6,-38 15.2,-33.4 14.8,-40.6 16.8,-45.6 19.9,-53"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="tl" data-region="lats" points="-20.2,-52 -16.6,-38 -15.2,-33.4 -14.8,-40.6 -16.8,-45.6 -19.9,-53"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="tl" data-region="obliques" points="15.2,-33.4 14,-26 15,-14 16.05,-7 9.6,-7.8 9.4,-37.6 14.8,-40.6"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="tl" data-region="obliques" points="-15.2,-33.4 -14,-26 -15,-14 -16.05,-7 -9.6,-7.8 -9.4,-37.6 -14.8,-40.6"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="mm" data-region="abs" points="0,-42.6 8.6,-41 9.4,-37.6 9.6,-7.8 0,-7.4 -9.6,-7.8 -9.4,-37.6 -8.6,-41"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="th" data-region="chest" points="1,-64.2 13,-63.4 20,-61.6 19.9,-53 16.4,-45.4 8.6,-43.2 1,-44.6"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="th" data-region="chest" points="-1,-64.2 -13,-63.4 -20,-61.6 -19.9,-53 -16.4,-45.4 -8.6,-43.2 -1,-44.6"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="tl" data-region="brace" points="8.6,-38 10,-37.8 10.4,-9.6 9,-9.6"/>  <!-- secondary motion: add "tn anim XX-ten" -->
<polygon class="tl" data-region="brace" points="-8.6,-38 -10,-37.8 -10.4,-9.6 -9,-9.6"/>  <!-- secondary motion: add "tn anim XX-ten" -->
<polygon class="tl" data-region="collarbone" points="7.4,-67.6 13,-63.4 20.4,-62.4 20.2,-61 13,-61.5 7,-66"/>  <!-- secondary motion: add "tn anim XX-ten" -->
<polygon class="tl" data-region="collarbone" points="-7.4,-67.6 -13,-63.4 -20.4,-62.4 -20.2,-61 -13,-61.5 -7,-66"/>  <!-- secondary motion: add "tn anim XX-ten" -->
<!-- head  (lives in: figure root) -->
<polygon class="olk" points="0,-95 5.6,-94 8.8,-90.6 9.7,-86.8 11.1,-86.9 11.9,-84.4 11.3,-80.6 9.5,-79.4 8.3,-77 5.4,-73.6 2.4,-71.8 0,-71.4 -2.4,-71.8 -5.4,-73.6 -8.3,-77 -9.5,-79.4 -11.3,-80.6 -11.9,-84.4 -11.1,-86.9 -9.7,-86.8 -8.8,-90.6 -5.6,-94"/>  <!-- outline pass -->
<polygon class="rim" points="0,-95 5.6,-94 8.8,-90.6 9.7,-86.8 11.1,-86.9 11.9,-84.4 11.3,-80.6 9.5,-79.4 8.3,-77 5.4,-73.6 2.4,-71.8 0,-71.4 -2.4,-71.8 -5.4,-73.6 -8.3,-77 -9.5,-79.4 -11.3,-80.6 -11.9,-84.4 -11.1,-86.9 -9.7,-86.8 -8.8,-90.6 -5.6,-94"/>  <!-- rim pass -->
<polygon class="b" points="0,-95 5.6,-94 8.8,-90.6 9.7,-86.8 11.1,-86.9 11.9,-84.4 11.3,-80.6 9.5,-79.4 8.3,-77 5.4,-73.6 2.4,-71.8 0,-71.4 -2.4,-71.8 -5.4,-73.6 -8.3,-77 -9.5,-79.4 -11.3,-80.6 -11.9,-84.4 -11.1,-86.9 -9.7,-86.8 -8.8,-90.6 -5.6,-94"/>  <!-- fill pass -->
<polygon class="hr" data-region="hair" points="0,-95 5.6,-94 8.8,-90.6 9.7,-86.8 8.7,-87.4 7.6,-89.8 4.6,-91.2 0,-91.8 -4.6,-91.2 -7.6,-89.8 -8.7,-87.4 -9.7,-86.8 -8.8,-90.6 -5.6,-94"/>
<polygon class="hrh" data-region="hairSheen" points="-4.6,-94.1 1.6,-94.9 4.2,-93.4 -1.8,-93"/>
<polygon class="bh" data-region="forehead" points="0,-91.8 4.6,-91.2 7.6,-89.8 8.7,-87.4 6.4,-86.2 0,-86.6 -6.4,-86.2 -8.7,-87.4 -7.6,-89.8 -4.6,-91.2"/>
<polygon class="bh" data-region="ear" points="9.7,-86.8 11.1,-86.9 11.9,-84.4 11.3,-80.6 9.5,-79.4 9.3,-83"/>
<polygon class="bh" data-region="ear" points="-9.7,-86.8 -11.1,-86.9 -11.9,-84.4 -11.3,-80.6 -9.5,-79.4 -9.3,-83"/>
<polygon class="bl" data-region="earInner" points="10.2,-85.6 11.2,-84.6 10.9,-81.4 9.9,-80.8 9.6,-83.4"/>
<polygon class="bl" data-region="earInner" points="-10.2,-85.6 -11.2,-84.6 -10.9,-81.4 -9.9,-80.8 -9.6,-83.4"/>
<polygon class="bl" data-region="cheek" points="6.4,-85.6 9.3,-86.2 9.3,-83 9.5,-79.4 8.3,-77 5.4,-73.6 4.6,-77.4"/>
<polygon class="bl" data-region="cheek" points="-6.4,-85.6 -9.3,-86.2 -9.3,-83 -9.5,-79.4 -8.3,-77 -5.4,-73.6 -4.6,-77.4"/>
<polygon class="bl" data-region="nose" points="0.2,-84.4 1.5,-79.8 0.1,-78.9"/>
<!-- upperArmR  (lives in: ua-r) -->
<polygon class="olk" points="16.8,-64 27.5,-64 28.4,-53 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/>  <!-- outline pass -->
<polygon class="rim" points="16.8,-64 27.5,-64 28.4,-53 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/>  <!-- rim pass -->
<polygon class="b" points="16.8,-64 27.5,-64 28.4,-53 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/>  <!-- fill pass -->
<polygon class="t" data-region="sleeve" points="16.8,-64 27.5,-64 28.4,-53 28.2,-48 27.82,-43 16.52,-42.4 16.2,-48"/>
<polygon class="th" data-region="biceps" points="19.6,-61 24.8,-61 25,-42.8 19.6,-42.55"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="bh" data-region="biceps" points="19.6,-42.55 25,-42.8 25.2,-35 22.4,-30.6 19.6,-35"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="tl" data-region="triceps" points="16.8,-64 18.6,-64 18.4,-42.5 16.52,-42.4 16.2,-48"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="bl" data-region="triceps" points="16.52,-42.4 18.4,-42.5 18.8,-29 17.4,-27"/>  <!-- mm if main, mh if helps, bl otherwise -->
<polygon class="tl" data-region="sleeveHem" points="27.82,-43 16.52,-42.4 16.44,-43.8 27.93,-44.4"/>
<!-- deltoidR  (lives in: ua-r) -->
<polygon class="olk" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- outline pass -->
<polygon class="rim" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- rim pass -->
<polygon class="t" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- fill pass -->
<polygon class="th" data-region="sideDelts" points="23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 24.5,-57.5"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="mm" data-region="frontDelts" points="16.8,-65 23,-66 24.5,-57.5 26.8,-47.5 21,-49 16.8,-56.5"/>  <!-- mm if main, mh if helps, omit otherwise -->
<!-- elbowCapR  (lives in: fa-r) -->
<polygon class="olk" points="26.64,-22.76 25.39,-20.61 23.24,-19.36 20.76,-19.36 18.61,-20.61 17.36,-22.76 17.36,-25.24 18.61,-27.39 20.76,-28.64 23.24,-28.64 25.39,-27.39 26.64,-25.24"/>  <!-- outline pass -->
<polygon class="rim" points="26.64,-22.76 25.39,-20.61 23.24,-19.36 20.76,-19.36 18.61,-20.61 17.36,-22.76 17.36,-25.24 18.61,-27.39 20.76,-28.64 23.24,-28.64 25.39,-27.39 26.64,-25.24"/>  <!-- rim pass -->
<polygon class="b" points="26.64,-22.76 25.39,-20.61 23.24,-19.36 20.76,-19.36 18.61,-20.61 17.36,-22.76 17.36,-25.24 18.61,-27.39 20.76,-28.64 23.24,-28.64 25.39,-27.39 26.64,-25.24"/>  <!-- fill pass -->
<polygon class="bl" data-region="elbowCrease" points="19.4,-27.2 17.6,-24 19.4,-20.8 20.4,-24"/>
<!-- forearmR  (lives in: fa-r) -->
<polygon class="olk" points="17.2,-25 27,-25 28.2,-19 28,-13 26.8,-2 26,7 18,7 17.5,-6 17.1,-17"/>  <!-- outline pass -->
<polygon class="rim" points="17.2,-25 27,-25 28.2,-19 28,-13 26.8,-2 26,7 18,7 17.5,-6 17.1,-17"/>  <!-- rim pass -->
<polygon class="b" points="17.2,-25 27,-25 28.2,-19 28,-13 26.8,-2 26,7 18,7 17.5,-6 17.1,-17"/>  <!-- fill pass -->
<polygon class="bh" data-region="forearms" points="22.6,-25 27,-25 28.2,-19 28,-13 26.8,-2 26,7 22.9,7"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="bl" data-region="forearmInner" points="17.2,-25 19.2,-25 19.8,7 18,7 17.5,-6 17.1,-17"/>
<!-- fistR  (lives in: fa-r) -->
<polygon class="olk" points="18.4,6.4 25.6,6.4 26.8,7.8 27.7,9.2 27.3,10.3 28.1,11.6 27.7,12.8 28.4,14.2 28,15.4 28.5,16.8 28,19 26.4,20.9 23.4,21.8 20.2,21.5 17.8,20 16.4,17.2 15.9,13.2 16.4,9.6"/>  <!-- outline pass -->
<polygon class="rim" points="18.4,6.4 25.6,6.4 26.8,7.8 27.7,9.2 27.3,10.3 28.1,11.6 27.7,12.8 28.4,14.2 28,15.4 28.5,16.8 28,19 26.4,20.9 23.4,21.8 20.2,21.5 17.8,20 16.4,17.2 15.9,13.2 16.4,9.6"/>  <!-- rim pass -->
<polygon class="b" points="18.4,6.4 25.6,6.4 26.8,7.8 27.7,9.2 27.3,10.3 28.1,11.6 27.7,12.8 28.4,14.2 28,15.4 28.5,16.8 28,19 26.4,20.9 23.4,21.8 20.2,21.5 17.8,20 16.4,17.2 15.9,13.2 16.4,9.6"/>  <!-- fill pass -->
<polygon class="bl" data-region="grip" points="26.8,7.8 27.7,9.2 27.3,10.3 28.1,11.6 27.7,12.8 28.4,14.2 28,15.4 28.5,16.8 28,19 26.4,20.9 23.4,21.8 20.2,21.5 17.8,20 16.4,17.2 15.9,13.2 18.8,11.4 23.2,8"/>
<polygon class="bh" data-region="finger4" points="26.6,8 27.5,9.1 27.1,10.1 23.8,9.8 23.5,8.3"/>
<polygon class="bh" data-region="finger3" points="27.4,10.5 27.9,11.6 27.5,12.6 24,12.2 23.9,10.6"/>
<polygon class="bh" data-region="finger2" points="27.6,13 28.2,14.2 27.8,15.1 24.2,14.8 24.1,13.2"/>
<polygon class="bh" data-region="finger1" points="27.8,15.5 28.3,16.8 27.8,18.8 26.2,20.5 23.4,21.3 20.2,21 18.4,19.9 19.4,18.7 21.8,19.3 24,18.7 24.4,15.7"/>
<polygon class="bh" data-region="thumb" points="16,10.4 17.2,8.8 18.6,10.6 20.6,14.4 21.1,17 20,18.2 18.4,17.5 16.6,14.4"/>
<!-- thighR  (lives in: figure root (static legs)) -->
<polygon class="olk" points="2,-4 18,-4 18.4,10 18,20 16,44 13.6,49 10,50.5 6,49 4,46 2.8,30 2.4,16"/>  <!-- outline pass -->
<polygon class="rim" points="2,-4 18,-4 18.4,10 18,20 16,44 13.6,49 10,50.5 6,49 4,46 2.8,30 2.4,16"/>  <!-- rim pass -->
<polygon class="b" points="2,-4 18,-4 18.4,10 18,20 16,44 13.6,49 10,50.5 6,49 4,46 2.8,30 2.4,16"/>  <!-- fill pass -->
<polygon class="p" data-region="shorts" points="2,-4 18,-4 18.4,10 18,20 16.95,34 2.7,34.6 2.8,30 2.4,16"/>
<polygon class="ph" data-region="quads" points="4.6,-4 15.6,-4 16.4,10 16.1,20 15.3,34.1 4.7,34.5 4.2,20 4.4,10"/>  <!-- mm if main, mh if helps, ph otherwise -->
<polygon class="pl" data-region="thighOuter" points="15.6,-4 18,-4 18.4,10 18,20 16.95,34 15.3,34.1 16.1,20 16.4,10"/>
<polygon class="bh" data-region="quads" points="6.4,34.5 14,34.3 14.6,44 12.4,48.2 9,48.6 6.6,43"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="pl" data-region="shortsHem" points="16.95,34 2.7,34.6 2.66,33.2 17.05,32.6"/>
<!-- kneeCapR  (lives in: figure root) -->
<polygon class="olk" points="15.6,51.5 14.1,54.1 11.5,55.6 8.5,55.6 5.9,54.1 4.4,51.5 4.4,48.5 5.9,45.9 8.5,44.4 11.5,44.4 14.1,45.9 15.6,48.5"/>  <!-- outline pass -->
<polygon class="rim" points="15.6,51.5 14.1,54.1 11.5,55.6 8.5,55.6 5.9,54.1 4.4,51.5 4.4,48.5 5.9,45.9 8.5,44.4 11.5,44.4 14.1,45.9 15.6,48.5"/>  <!-- rim pass -->
<polygon class="b" points="15.6,51.5 14.1,54.1 11.5,55.6 8.5,55.6 5.9,54.1 4.4,51.5 4.4,48.5 5.9,45.9 8.5,44.4 11.5,44.4 14.1,45.9 15.6,48.5"/>  <!-- fill pass -->
<polygon class="bh" data-region="patella" points="4.2,50 4.98,47.1 7.1,44.98 10,44.2 12.9,44.98 15.02,47.1 15.8,50"/>
<!-- shinR  (lives in: figure root) -->
<polygon class="olk" points="4.5,49 15.5,49 16.9,60 16.4,68 15.2,78 14,94 6,94 5,78 3.6,68 3.1,60"/>  <!-- outline pass -->
<polygon class="rim" points="4.5,49 15.5,49 16.9,60 16.4,68 15.2,78 14,94 6,94 5,78 3.6,68 3.1,60"/>  <!-- rim pass -->
<polygon class="b" points="4.5,49 15.5,49 16.9,60 16.4,68 15.2,78 14,94 6,94 5,78 3.6,68 3.1,60"/>  <!-- fill pass -->
<polygon class="bl" data-region="calves" points="15.5,49 16.9,60 16.4,68 15.2,78 14,94 12.8,92 13.6,74 13.6,56"/>  <!-- mm if main, mh if helps, bl otherwise -->
<polygon class="bl" data-region="calves" points="4.5,49 3.1,60 3.6,68 4.8,78 6,94 7.2,92 6.4,74 6.4,56"/>  <!-- mm if main, mh if helps, bl otherwise -->
<!-- footR  (lives in: figure root) -->
<polygon class="olk" points="5.5,92.4 14.5,92.4 17.2,96.6 18,99.4 17.6,102 3.4,102 2.8,99.4 3.6,96.4"/>  <!-- outline pass -->
<polygon class="rim" points="5.5,92.4 14.5,92.4 17.2,96.6 18,99.4 17.6,102 3.4,102 2.8,99.4 3.6,96.4"/>  <!-- rim pass -->
<polygon class="s" points="5.5,92.4 14.5,92.4 17.2,96.6 18,99.4 17.6,102 3.4,102 2.8,99.4 3.6,96.4"/>  <!-- fill pass -->
<polygon class="sl" data-region="collar" points="5.5,92.4 14.5,92.4 15,93.6 5.2,93.6"/>
<polygon class="sh" data-region="toeCap" points="5.6,96 14.8,96 17,98.4 17.3,100.4 3.6,100.4 3.4,98.4"/>
<polygon class="so" data-region="sole" points="3,100.4 17.8,100.4 17.6,102 3.4,102"/>
```

**Top view parts, seated or standing lifter (faces -y; rig origin = midway between the shoulder joints)**

```html
<!-- torso (shoulders and upper back from above)  (lives in: figure root) -->
<polygon class="olk" points="-10,-12 10,-12 21,-8.5 27,-1.5 26,6 20,11 8,13.5 -8,13.5 -20,11 -26,6 -27,-1.5 -21,-8.5"/>  <!-- outline pass -->
<polygon class="rim" points="-10,-12 10,-12 21,-8.5 27,-1.5 26,6 20,11 8,13.5 -8,13.5 -20,11 -26,6 -27,-1.5 -21,-8.5"/>  <!-- rim pass -->
<polygon class="t" points="-10,-12 10,-12 21,-8.5 27,-1.5 26,6 20,11 8,13.5 -8,13.5 -20,11 -26,6 -27,-1.5 -21,-8.5"/>  <!-- fill pass -->
<polygon class="mm" data-region="upperTraps" points="6,-7 19,-6 23,-1 9,3"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="mm" data-region="upperTraps" points="-6,-7 -19,-6 -23,-1 -9,3"/>  <!-- mm if main, mh if helps, omit otherwise -->
<polygon class="tl" data-region="midBack" points="0,2 9,3 20,11 8,13.5 0,13.5"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="tl" data-region="midBack" points="0,2 -9,3 -20,11 -8,13.5 0,13.5"/>  <!-- mm if main, mh if helps, tl otherwise -->
<!-- head (from above, nose toward -y)  (lives in: figure root) -->
<polygon class="olk" points="0,-12 5,-11 8.5,-7.5 10,-2 8.5,4 4.5,7.5 0,8.5 -4.5,7.5 -8.5,4 -10,-2 -8.5,-7.5 -5,-11"/>  <!-- outline pass -->
<polygon class="rim" points="0,-12 5,-11 8.5,-7.5 10,-2 8.5,4 4.5,7.5 0,8.5 -4.5,7.5 -8.5,4 -10,-2 -8.5,-7.5 -5,-11"/>  <!-- rim pass -->
<polygon class="hr" points="0,-12 5,-11 8.5,-7.5 10,-2 8.5,4 4.5,7.5 0,8.5 -4.5,7.5 -8.5,4 -10,-2 -8.5,-7.5 -5,-11"/>  <!-- fill pass -->
<polygon class="b" data-region="nose" points="-2.2,-11.6 0,-15 2.2,-11.6"/>
<polygon class="hrh" data-region="crown" points="-8.5,4 -4.5,7.5 0,8.5 4.5,7.5 8.5,4 0,1"/>
<!-- deltoidR  (lives in: ua-r) -->
<polygon class="olk" points="17,-6 22,-8.5 28,-7 30.5,-1 29.5,6 25,9 19,8 16,2"/>  <!-- outline pass -->
<polygon class="rim" points="17,-6 22,-8.5 28,-7 30.5,-1 29.5,6 25,9 19,8 16,2"/>  <!-- rim pass -->
<polygon class="t" points="17,-6 22,-8.5 28,-7 30.5,-1 29.5,6 25,9 19,8 16,2"/>  <!-- fill pass -->
<polygon class="th" data-region="frontDelts" points="17,-6 22,-8.5 28,-7 30.5,-1 23,0"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="mm" data-region="rearDelts" points="30.5,-1 29.5,6 25,9 19,8 23,0"/>  <!-- mm if main, mh if helps, omit otherwise -->
<!-- upperArmR  (lives in: ua-r > ul-r) -->
<polygon class="olk" points="16.8,-2 27.5,-2 28.4,9 28.2,14 26.6,35 22,39 17.4,35 16.2,14"/>  <!-- outline pass -->
<polygon class="rim" points="16.8,-2 27.5,-2 28.4,9 28.2,14 26.6,35 22,39 17.4,35 16.2,14"/>  <!-- rim pass -->
<polygon class="b" points="16.8,-2 27.5,-2 28.4,9 28.2,14 26.6,35 22,39 17.4,35 16.2,14"/>  <!-- fill pass -->
<polygon class="t" data-region="sleeve" points="16.8,-2 27.5,-2 28.4,9 28.2,14 27.82,19 16.52,19.6 16.2,14"/>
<polygon class="th" data-region="biceps" points="19.6,1 24.8,1 25,19.2 19.6,19.45"/>  <!-- mm if main, mh if helps, th otherwise -->
<polygon class="bh" data-region="biceps" points="19.6,19.45 25,19.2 25.2,27 22.4,31.4 19.6,27"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="tl" data-region="triceps" points="16.8,-2 18.6,-2 18.4,19.5 16.52,19.6 16.2,14"/>  <!-- mm if main, mh if helps, tl otherwise -->
<polygon class="bl" data-region="triceps" points="16.52,19.6 18.4,19.5 18.8,33 17.4,35"/>  <!-- mm if main, mh if helps, bl otherwise -->
<polygon class="tl" data-region="sleeveHem" points="27.82,19 16.52,19.6 16.44,18.2 27.93,17.6"/>
<!-- elbowCapR  (lives in: fa-r) -->
<polygon class="olk" points="26.64,39.24 25.39,41.39 23.24,42.64 20.76,42.64 18.61,41.39 17.36,39.24 17.36,36.76 18.61,34.61 20.76,33.36 23.24,33.36 25.39,34.61 26.64,36.76"/>  <!-- outline pass -->
<polygon class="rim" points="26.64,39.24 25.39,41.39 23.24,42.64 20.76,42.64 18.61,41.39 17.36,39.24 17.36,36.76 18.61,34.61 20.76,33.36 23.24,33.36 25.39,34.61 26.64,36.76"/>  <!-- rim pass -->
<polygon class="b" points="26.64,39.24 25.39,41.39 23.24,42.64 20.76,42.64 18.61,41.39 17.36,39.24 17.36,36.76 18.61,34.61 20.76,33.36 23.24,33.36 25.39,34.61 26.64,36.76"/>  <!-- fill pass -->
<polygon class="bl" data-region="elbowCrease" points="19.4,34.8 17.6,38 19.4,41.2 20.4,38"/>
<!-- forearmR  (lives in: fa-r > fl-r) -->
<polygon class="olk" points="17.2,37 27,37 28.2,43 28,49 26.8,60 26,69 18,69 17.5,56 17.1,45"/>  <!-- outline pass -->
<polygon class="rim" points="17.2,37 27,37 28.2,43 28,49 26.8,60 26,69 18,69 17.5,56 17.1,45"/>  <!-- rim pass -->
<polygon class="b" points="17.2,37 27,37 28.2,43 28,49 26.8,60 26,69 18,69 17.5,56 17.1,45"/>  <!-- fill pass -->
<polygon class="bh" data-region="forearms" points="22.6,37 27,37 28.2,43 28,49 26.8,60 26,69 22.9,69"/>  <!-- mm if main, mh if helps, bh otherwise -->
<polygon class="bl" data-region="forearmInner" points="17.2,37 19.2,37 19.8,69 18,69 17.5,56 17.1,45"/>
<!-- fistR  (lives in: fa-r > hd-r) -->
<polygon class="olk" points="18.4,68.4 25.6,68.4 26.8,69.8 27.7,71.2 27.3,72.3 28.1,73.6 27.7,74.8 28.4,76.2 28,77.4 28.5,78.8 28,81 26.4,82.9 23.4,83.8 20.2,83.5 17.8,82 16.4,79.2 15.9,75.2 16.4,71.6"/>  <!-- outline pass -->
<polygon class="rim" points="18.4,68.4 25.6,68.4 26.8,69.8 27.7,71.2 27.3,72.3 28.1,73.6 27.7,74.8 28.4,76.2 28,77.4 28.5,78.8 28,81 26.4,82.9 23.4,83.8 20.2,83.5 17.8,82 16.4,79.2 15.9,75.2 16.4,71.6"/>  <!-- rim pass -->
<polygon class="b" points="18.4,68.4 25.6,68.4 26.8,69.8 27.7,71.2 27.3,72.3 28.1,73.6 27.7,74.8 28.4,76.2 28,77.4 28.5,78.8 28,81 26.4,82.9 23.4,83.8 20.2,83.5 17.8,82 16.4,79.2 15.9,75.2 16.4,71.6"/>  <!-- fill pass -->
<polygon class="bl" data-region="grip" points="26.8,69.8 27.7,71.2 27.3,72.3 28.1,73.6 27.7,74.8 28.4,76.2 28,77.4 28.5,78.8 28,81 26.4,82.9 23.4,83.8 20.2,83.5 17.8,82 16.4,79.2 15.9,75.2 18.8,73.4 23.2,70"/>
<polygon class="bh" data-region="finger4" points="26.6,70 27.5,71.1 27.1,72.1 23.8,71.8 23.5,70.3"/>
<polygon class="bh" data-region="finger3" points="27.4,72.5 27.9,73.6 27.5,74.6 24,74.2 23.9,72.6"/>
<polygon class="bh" data-region="finger2" points="27.6,75 28.2,76.2 27.8,77.1 24.2,76.8 24.1,75.2"/>
<polygon class="bh" data-region="finger1" points="27.8,77.5 28.3,78.8 27.8,80.8 26.2,82.5 23.4,83.3 20.2,83 18.4,81.9 19.4,80.7 21.8,81.3 24,80.7 24.4,77.7"/>
<polygon class="bh" data-region="thumb" points="16,72.4 17.2,70.8 18.6,72.6 20.6,76.4 21.1,79 20,80.2 18.4,79.5 16.6,76.4"/>
```

**Equipment parts (copy-paste; stage units unless a group is named)**

```html
<!-- front-view dumbbell, screen-right hand. Lives in fa-r > db-r (rotation origin 22,16 = the grip).
     Handle stub, then the index finger and thumb as a ring closed round it (skin tones), then the head: centred at (22, 28.5), 12.5 below the grip, its top band over the lower part of the fist (seen a little from above). Screen-left: negate every x. -->
<rect class="hd" x="20.2" y="17.6" width="3.6" height="3.6"/>
<polygon class="bh" points="18.6,17.2 25.4,17.2 25.9,18.5 25.3,20 18.7,20 18.1,18.5"/>
<polygon class="bl" points="18.7,20 25.3,20 25,20.8 19,20.8"/>
<polygon class="eqm" points="15.4,28.5 18.7,23.24 25.3,23.24 28.6,28.5 28.6,26.3 25.3,21.04 18.7,21.04 15.4,26.3"/>
<polygon class="eqs" points="15.4,28.5 18.7,23.24 18.7,21.04 15.4,26.3"/>
<polygon class="eqh" points="18.7,23.24 25.3,23.24 25.3,21.04 18.7,21.04"/>
<polygon class="eql" points="25.3,23.24 28.6,28.5 28.6,26.3 25.3,21.04"/>
<polygon class="eqm" points="28.6,28.5 25.3,33.76 18.7,33.76 15.4,28.5 18.7,23.24 25.3,23.24"/>
<polygon class="prim" points="25.8,28.5 23.9,31.53 20.1,31.53 18.2,28.5 20.1,25.47 23.9,25.47"/>
<!-- chest press lever (near). One group rotating about the pivot (206.5, 58); grip centre 100 below the pivot at rest. -->
<g class="j anim cp-lever lever-near">
<polygon class="eqm" points="203.9,58 209.1,58 209.1,146 203.9,146"/>
<rect class="hd" x="203.3" y="145" width="6.4" height="26" rx="3"/>
<path class="knurl" d="M203.3 147h6.4M203.3 148.4h6.4M203.3 149.8h6.4M203.3 166.2h6.4M203.3 167.6h6.4M203.3 169h6.4"/>
</g>
<circle class="eqm" cx="206.5" cy="58" r="7"/>
<circle class="rod" cx="206.5" cy="58" r="2"/>
<!-- far lever: the same group inside <g class="far-side" transform="translate(5 -3)"> -->
<g class="j anim cp-lever far-lever">
<polygon class="eqf" points="203.9,58 209.1,58 209.1,146 203.9,146"/>
<rect class="hdf" x="203.3" y="145" width="6.4" height="21" rx="3"/>
</g>
<!-- stack plates 1-6, pin and top bracket: one group, translateY(-lift) -->
<rect class="eq" x="26" y="112.5" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="126" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="139.5" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="153" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="166.5" width="48" height="12" rx="1.5"/>
<rect class="eq" x="26" y="180" width="48" height="12" rx="1.5"/>
<path class="eqh" d="M27.2 113.6h45.6v1.2h-45.6zM27.2 127.1h45.6v1.2h-45.6zM27.2 140.6h45.6v1.2h-45.6zM27.2 154.1h45.6v1.2h-45.6zM27.2 167.6h45.6v1.2h-45.6zM27.2 181.1h45.6v1.2h-45.6z"/>
<rect class="pin" x="73" y="184" width="9" height="4" rx="2"/>
<circle class="pin" cx="82.6" cy="186" r="2.6"/>
<rect class="eqm" x="45" y="106" width="10" height="6.5" rx="1"/>
```

Chest press solve inputs (so every sample can be rebuilt from this file): p runs 0 to 1 over the move and is linear in grip x: x = 187 + 39 p; grip y = 58 + sqrt(100^2 - (x - 206.5)^2); lever rotate = -asin((x - 206.5) / 100); grip z = 38.56 + (6 - 38.56) p. pole0 = norm([-1, 22, 30.97]) = [-0.0263, 0.5789, 0.8149]; pole1 = norm([-0.1, 0.6, 0.8]) = [-0.0995, 0.5970, 0.7960]; pole(p) = norm((1 - p) pole0 + p pole1). Shoulder (150, 144, 0), upper arm 38, forearm 40; the setup elbow (149, 166, 30.97) is the elbow nearest pole0. The rep timing maps rep time to p (section 8).

### Measured numbers from this build

Machine Chest Press key poses (stage units; z = sideways, out from the shoulder toward the camera; angles in degrees; SVG rotate + = clockwise):

| p | Grip (x, y, z) | Elbow (x, y, z) | Lever | Upper arm | fu | Forearm | ff | Elbow inside angle | Arm out from side | Arm forward | Stack lift |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 187, 156.08, 38.56 | 149, 166, 30.97 | 11.24 | 2.6 | 0.58 | -107.23 | 0.982 | 89.2 | 54.58 | -2.6 | 0 |
| 0.25 | 196.61, 157.51, 30.53 | 157.28, 164.74, 31 | 5.67 | -19.33 | 0.578 | -81.09 | 1 | 94.6 | 54.66 | 19.33 | 4.81 |
| 0.5 | 206.38, 158, 22.38 | 167.13, 163.49, 27.76 | 0.07 | -41.31 | 0.683 | -56.65 | 0.991 | 105.88 | 46.94 | 41.31 | 9.69 |
| 0.75 | 217.09, 157.44, 13.44 | 177.76, 160.41, 20.1 | -6.08 | -59.41 | 0.849 | -34.91 | 0.986 | 126.73 | 31.94 | 59.41 | 15.04 |
| 1 | 226, 156.08, 6 | 186.13, 153.19, 7.37 | -11.24 | -75.73 | 0.981 | -10.12 | 0.999 | 163.44 | 11.18 | 75.73 | 19.5 |

Worst hand-to-handle gap half-way between baked samples (analytic): 0.00 units. Smallest upper-arm fu over the rep: 0.565.

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

Figure detail paints (section 20; outline = --fg-line):

| Theme | Outline on T-shirt light / dark | Outline on skin / light / dark | Skin vs T-shirt | Shorts vs skin | Shorts vs pads | Shoe vs stage | Rim vs outline | Knurl on handle | Seam on pad | Main vs T-shirt |
|---|---|---|---|---|---|---|---|---|---|---|
| silent-black | 3.20 / 5.00 | 3.40 / 2.57 / 4.19 | 1.27 | 1.92 | 3.46 | 1.16 | 1.42 | 2.11 | 2.15 | 2.56 |
| paper | 3.62 / 2.49 | 2.85 / 3.30 / 2.22 | 1.14 | 1.46 | 2.04 | 3.55 | 4.35 | 1.97 | 1.94 | 2.49 |
| ember | 3.15 / 5.05 | 3.35 / 2.53 / 4.21 | 1.28 | 1.93 | 3.57 | 1.19 | 1.40 | 2.14 | 2.17 | 3.88 |
| emerald | 2.87 / 4.40 | 3.04 / 2.35 / 3.72 | 1.25 | 1.81 | 3.19 | 1.18 | 1.37 | 2.01 | 2.04 | 5.52 |
| midnight | 2.45 / 3.70 | 2.57 / 2.06 / 3.16 | 1.22 | 1.68 | 2.87 | 1.26 | 1.29 | 1.89 | 1.88 | 1.63 |

Keyframe stops per animated group: 203, written twice (-a and -b).

<!-- generated:end -->

## 20. Figure detail: parts, paint, glow, secondary motion and the checks

Added 2026-09-27 for the owner's "more details on figure" (UPGRADE-BRIEF.md, figure detail target and smoothness target 3) and refined in round 2 for "premium, smooth and good details" (docs/COACHING-DECISIONS.md D-R1 to D-R6). Same low-poly faceted style, camera framing, controls and layout; only the figure and the equipment gained detail.

### Parts

Every part is `{ base, cloth?, regions }`. `cloth` is `skin` (default), `tee`, `shorts`, `shoe`, `sole` or `hair`. A region is `{ poly, cloth?, tone?: 'hi' | 'lo', muscle?, name?, ten?, far? }`. The painter (`fillPart`) draws the base in its cloth tone, then every non-role region in order in its tone class, then the `ten` facets (only when the exercise passes its channel), then the glow (clipped to the part), then the role muscles (`mh`, `mm`), so a highlighted muscle is never hidden by a facet. `far: true` regions (the thigh's shorts) also paint on the far leg, in the far tones.

| View | What is new |
|---|---|
| Side | Head: skull and jaw profile with a subtle nose and brow ridge, hair cap and sheen, a lit forehead plane under the hairline, an ear (a lit outer shape with a dark inner facet), a lit face plane, jaw shadow and brow line; no eyes or mouth. Neck leaning a little forward with a lit throat and a dark nape; the torso's top rises into the neck at the back, so the trapezius slopes down into the shoulder. Torso in the T-shirt: collar band, light upper traps, dark lats with a lit fold along their front edge and an armpit shadow under the delt, the shoulder blade (`midBack`, roles only), the pec as a two-facet fan whose fibres converge back toward the armpit with its top edge tucked under the front delt, an under-chest shadow, abs and obliques (roles only), and the shorts below a waistband shadow, with dark glutes. Deltoid cap: front light, side mid, rear dark, with a rounded lower edge that reads as the sleeve when the arm is foreshortened. Upper arm: sleeve to mid upper arm (19 to 20 below the shoulder) with a hem band; biceps light and triceps dark, each split at the hem. Elbow and knee caps are 12-sided (round at every size); the elbow cap (r 4.8, so the player's setup elbow stays 2.2 off the back pad) carries a small dark crease on its inner side, the knee a light kneecap. Forearm: 9.8 wide at the elbow, swelling to 12.4 over the brachioradialis on the thumb side (4 to 10 below the elbow) and tapering to 8 at the wrist, light on top and dark underneath. Hand round the vertical handle: palm heel, four fingers over a dark backing (the gaps read as finger lines), and the thumb as a lit wedge 3 wide along the top of the hand that crosses the handle and ends in front of it over the index finger, with a dark crease under it; the handle shows above and below the fist. Thigh: shorts to 13 above the knee with a hem band, quads light and hamstrings dark, each split at the hem. Shin: dark calf, light shin front. Shoe: collar, light toe cap, light sole. |
| Front | Head: jaw and cheekbones, ears in the silhouette (lit, with a dark inner facet), hair cap and sheen, a lit forehead band under the hairline, dark cheek planes, a nose shade; no eyes or mouth. Neck widening into the trapezius, dark sides and an under-chin shadow. Torso in the T-shirt: crew collar band, light traps and pecs, under-chest shadow, dark lats and obliques, abs for roles, shorts with a waistband shadow, a lit front panel and a thin fly seam (no dark U at the front). Deltoid: side light, front mid. Upper arm: sleeve, hem band, light biceps, dark triceps edge. Elbow cap (r 4.8, inner crease) and the same tapered forearm as the side view (12.2 over the bulge, 8 at the wrist). Hand round a handle that points at the camera: a dark grip backing, three stepped finger knuckles, the index finger curling round and the thumb across the inner side. Thighs in the shorts to 16 above the knee: a wide light quad panel with a dark outer strip; calves 13.8 wide at the bulge with dark edges; shoe with collar, a 14.2-wide toe cap and sole. |
| Top | Torso and deltoid in the T-shirt, the head is the hair cap with a skin nose and a lit crown, the arms are the front-view arm parts moved (`trPart`), so they carry the sleeve and hands too. |

The arm is one layer (section 4): the lower arm's outline and rim are drawn inside the upper arm's passes, so no outline arc crosses the elbow; the only mark at the joint is the crease facet.

### Paint

All tokens are in the section 5 table: `--skin`, `--tee` (= `--body`), `--shorts` (body 70 % into text), `--shoe`, `--sole`, `--hair` (sheen `--hair-hi` at 68 %), each with `-hi` and `-lo` where used, `--rim`, far `--shorts-far` and `--shoe-far`, and for equipment `--equip-hi` (`--eq-hi`: 82 % dark, 40 % light), `--equip-lo`, `--metal-lo` (fg-metal 64 % into the stage) and `--seam`. Three tones per surface: `X-hi = color-mix(X var(--hi), var(--lit))`, `X-lo = color-mix(X var(--lo), var(--shd))`, with the scheme inputs from `rigVars()` (`--lo` is 78 % in dark themes and 84 % in light ones, so light, mid and dark separate at 1x on Paper). Light comes from the front and above: tops of forms and forward faces light, sides and undersides dark.

The T-shirt keeps the body tone on purpose: the torso stays as far from the back pad as before and the outline over it stays at least 3.14:1, so an arm crossing the torso reads exactly as it did. Skin is lifted a little (body 92 % into text) and the shorts more (70 %), so the clothes read by value in every theme, the shorts clearly lighter than the skin in dark themes. The contrast of every new paint is computed from the CSS and printed in the generated block ("Figure detail paints").

Contact shadows: `shadow(cx, cy, rx, ry)` draws three stacked ellipses in `--border` at fill-opacity 0.6 (radii 1, 0.72, 0.44), no filter: a faint light pool on the near-black stages, a soft dark one on Paper. Chest press under the feet (208, 258, rx 17) and under the thighs on the seat (166, 214.4, rx 34); lateral raise under the feet (179, 258, rx 30). They are their own groups outside `.figure`, so the figure's safe-area boxes are unchanged.

### Target-muscle glow and secondary motion (one channel)

Each exercise has one extra keyframe channel, `XX-ten`, written with `kf()` on `SAMPLES` as `-a` / `-b` sets: `opacity: p` (the move progress). Two kinds of elements run it:

- the glow: a `gw` polygon under every main-muscle region (chest press: the two pec facets; lateral raise: both side delts), an accent halo whose opacity follows p, so it rises with the lift, is strongest in the hold (the hardest point) and fades on the way down. It is clipped to the part's own silhouette (`<clipPath>` of the base polygon, ids `XX-ten-clipN`), so it never spills past the outline as a fringe; the `<use>` tiles resolve the same clip in their own user space;
- the secondary-motion facets (`ten: true` regions, class `tn`, tone fill at 0.75): shape changes inside the torso, never joint moves. Side view (chest press, and the lat pulldown when it copies these parts): `brace`, the belly wall firming along the front of the abdomen, and `bladeEdge`, the inner edge of the shoulder blade showing as the blades are held back. Front view (lateral raise): `brace`, the borders of the abs, and `collarbone`, the collarbone line showing as the shoulders stay down (no shrug). The head and wrists do not move.

The lateral raise adds a second opacity channel, `lr-hlp`, on the upper-trap helper polygons (`mh`): 1 at setup easing to 0.7 through the hold and back, so the trap tint gives way to the delts as they take over ("traps stay down"). Neither channel has a `rotate()`, so the smoothness sampler does not treat them as joints, and they cannot move the shoulders, the elbow bend, the dumbbells or the hands: the shoulder drift, mirror, bend, level and hand-on-handle checks all still pass. p is 0 at 0 % and 100 %, so the rep restart and the `-a` / `-b` swap start from the same value and nothing flashes.

### Equipment

Chest press: grip ribs (`knurl`, `--metal-lo` at 0.6 units, low enough that the fingers dominate the hand) on the near handle where the fist does not cover it; the far handle 21 tall (13 above, 8 below its centre) so its lower end stays behind the near fist; stitched seams on the seat and back pad; a light bevel on every plate (`--equip-hi`) and a knob on the selector pin; pulley and hub rims. Lateral raise: the dumbbell of section 7 (finger ring, three-face top band, thin rim for the recessed cap), and tile arrows 1.5 x larger with 10 units of headroom above the head in the tiles.

### The checks

The numeric smoothness check is `../smooth-check.cjs`, shared by this `shoot.cjs` and every player's. It reads the page as drawn: every animated group in the stage scene whose keyframes contain `rotate()` is a joint angle (its local rotation from the parent and own CTM), plus the grip point(s), at t = i / 480 of the rep (120 samples per second at 1x), and it reads the written keyframe stops from the raw `<style>` text. A self-test compares the drawn angle with the written stop (worst 0.0000 degrees here). Per move phase (lift 0-25 %, return 37.5-87.5 %) it passes only if (a) the speed over the first and last 1/120 s is at most 1 % of the phase's top speed, (b) the velocity changes by at most 8 % of the top speed between samples 1/120 s apart, (c) at the keyframe stops the change of acceleration is at most 3 x its median (angles moving 10 degrees or more), and (d) no joint angle changes by more than 4 degrees between samples. This build (0.25 % stops in the lift, D-R1): chest press (a) 0.09 % / 0.05 %, (b) 4.08 % / 4.08 %, (c) 2.00 x / 2.00 x, (d) 1.47 degrees; lateral raise (a) 0.21 % / 0.05 %, (b) 3.09 % / 3.08 %, (c) 2.35 x / 2.35 x, (d) 1.19 degrees (lift / return). Before D-R1 the lift's (b) was 6.98 % (chest press) and 6.16 % (lateral raise), its (c) 2.64 x and 2.16 x. The players' own numbers are in their PLAYER.md section 11 and `checks.txt`.

Added with the figure detail (all in `shoot.cjs`, all passing):

- contrast of the detail paints, all five themes: outline over the T-shirt and skin facets at least 2 (the T-shirt base itself is the section 16 check, at least 3), skin vs T-shirt at least 1.1, shorts vs skin at least 1.25 and vs pads at least 1.5, T-shirt vs pads at least 1.2, rim vs outline at least 1.25, knurl at least 1.8, seam at least 1.5;
- tokens only: the page CSS and the player markup of both harnesses and `parts.html` contain no hex, `rgb()`/`hsl()`-style or named colour; only the token definitions (THEMES, `themeVars()` and the root style string they produce) may;
- glow and secondary motion, both exercises: the glow polygons and the facets share one channel with no `rotate()`; over 481 samples the opacity is 0 at t 0 and t 1, never falls in the lift, is at its maximum (1.000) through the hold, never rises in the return, and changes by at most 0.02 between samples 1/120 s apart; the lateral raise's trap tint is 1 at setup and at the restart, 0.7 through the hold, monotone either side, largest step 0.005;
- the target muscle stays visible at the hardest point (`muscle-check.cjs`, shared with the players): the accent pixels of the main muscle in the hold, with the effort cue, glow, helpers and every other accent element neutralised, are at least 97 % of those at setup (chest press 543 vs 230, the arm no longer covers the pec; lateral raise 544 vs 540);
- the caption row (`caption-check.cjs`, shared with the players): in idle, ended, the four captions and Pictures the caption box stays left of the tempo box and both stay inside the player, and Roboto (the canvas font, loaded from the local copy) drew the row with no state clipped. The shoots answer the Google Fonts link with an empty stylesheet, so they run offline; `.cap` shrinks with an ellipsis before it could ever push the tempo note out.

Readability: looked at in Silent Black and Paper at t 0, 0.125, 0.25 and 0.625, every zoom, and Pictures, at device scale 1, 2 and 3, plus Ember, Emerald and Midnight. File sizes after round 2: `chest-press.html` 193.8 KB, `lateral-raise.html` 143.9 KB; players `anim-machine-chest-press/index.html` 195.7 KB and `anim-dumbbell-lateral-raise/index.html` 145.0 KB (limit 450 KB; the denser lift stops cost about 38 and 31 KB).

## 21. Muscle info on tap (spec 2.10, round 3)

The owner: "when you click a muscle, show the common name, its real muscle name and info: the target muscle, the secondary muscles, with colours." One design for every player and the app (GUIDE-UPGRADE-ARCHITECTURE.md R1-15).

### What is drawn

- Each exercise names its muscles once, in `gen.mjs`, as `muscleTable([{ region, id, common, anatomical, role, line }], roles, label)`: `region` is the rig's region name, `id` the app's muscle id (`src/data/muscles.ts`), `role` is `main` or `help`. The build stops when the table's roles are not exactly the rig's `roles` map, or a line does not end with a full stop. The table goes into `EX.muscles` (with `Id`, the camel-case id, and `cls`, the polygon's class string) for the logic.
- The painter (`fillPart` with `opt.tap`) gives every role polygon a class hole (`data-class="cls<Id>"`, so the tapped region gets `.sel`: a 1.5-unit `--text` outline) and paints, last in its part and the target's after the helpers', a **halo hotspot**: an invisible copy of the polygon, class `hot`, `stroke-width: 30px` (or 44 px minus the region's shortest side for a thin region, set inline: 41 px on the triceps, 39 on the front delts, 37 on the side delts, 36 on the traps) with `vector-effect: non-scaling-stroke` and `pointer-events: all`, so every tap target is at least 44 px on its short side; it carries `role="button"`, `tabindex="0"`, `aria-label="<Common name>, target muscle"` (or `helps`), `data-muscle="<region>"` and `data-hot="<index>"`. It sits inside the same animated group as its region, so it follows the motion.
- A halo must never take a tap meant for a neighbouring muscle's own fill (with the arm drawn over the torso, the front delt's halo covered the whole chest at the hold, and the side delt's the traps), so every region also gets a **core**: the same polygon with `stroke-width: 0` (class `hot hot-core`, no button semantics), collected per joint chain by `fillPart` (`opt.cores`, `opt.coreKey`) and painted by the exercise after every halo, in drawing order: the torso's cores in a static group (`figure-hot` in the chest press; the end of `.figure` in the lateral raise), then the arm's cores in a repeated arm chain (`<g class="j anim cp-ua"><g class="j anim cp-ul">…</g>…</g>`; `<g class="j anim lr-ua-r">…</g>`) with the same keyframes, which the smoothness sampler reads once. So a tap on a muscle's visible fill always opens that muscle, and the halo only claims the empty space around it (D-R7). Note that `pointer-events: all` hit-tests the stroke geometry even when the stroke paints nothing: a core needs `stroke-width: 0`, not `stroke: none`.
- Pictures mode has no hotspots: `.pics .hot { pointer-events: none }` reaches the `<use>` clones, and the grid covers the stage.

### What the logic does

- One state field, `bubble: { kind: 'zoom', id } | { kind: 'muscle', id } | null`, replaces the zoom-only state: a zoom and a muscle bubble never show together. `pickZoom(id)` toggles a zoom bubble; `tapMuscle(id, e)` toggles a muscle bubble (animation only; it stops the event and notes the time); `keyMuscle(id, e)` accepts Enter and Space; `tapStage(e)` closes a muscle bubble on a tap of the stage background (never a zoom, never a tap inside the bubble, and not within 80 ms of a hotspot tap, so a runtime that does not pass the event still works).
- `renderVals()` adds, per muscle, `cls<Id>` (the polygon class, plus `sel` while tapped), `tap<Id>` and `key<Id>`; plus `hots` (the same handlers as a list, for the harness's `data-hot` binding), `tapStage`, `bubbleDotStyle` (`background:var(--muscle-main | --muscle-help | --accent)`), `bubbleName` (the bold common name, empty for a zoom), `bubbleRest` (`(anatomical), target|helps. Line.`, or the chip's caption) and `bubbleText` (the whole line, plain). The rep pill and the camera label stay while a muscle bubble is open; a zoom chip replaces a muscle bubble with its caption, and a second tap on the chip closes everything.
- The bubble markup is `<span class="dot" data-style="bubbleDotStyle"></span><span class="bt"><b data-text="bubbleName"></b> <span data-text="bubbleRest"></span></span>`; the harness query `?muscle=<id>` opens a muscle bubble for screenshots.

### The lines

Machine Chest Press: **Chest** (pectoralis major), target. Pushes the handles away; hardest as the arms straighten. **Front delts** (anterior deltoid), helps. Lifts the upper arms forward with the chest. **Triceps** (triceps brachii), helps. Straightens the elbows at the end of the press.

Dumbbell Lateral Raise: **Side delts** (lateral deltoid), target. Lifts the arms out to the sides; hardest near shoulder height. **Upper traps** (upper trapezius), helps. Steadies the shoulder blades; keep them down, no shrug. (The spec's longer traps line, 118 characters, wraps to three lines; the bubble holds two: D-R8.)

### The check (`muscle-tap-check.cjs`)

`muscleTapCheck(open, { label, picsQuery }, check)`, run by this `shoot.cjs` and by every player's: every muscle has its halo hotspot(s) with button semantics and a hit box of at least 44 px at t 0 and t 0.25, plus a core per polygon; at t 0.3 a tap where the target is visible (the first core polygon whose centre hit-tests to that muscle; a muscle with no such point fails) shows the exact text, the bold name and the dot in the region's own computed fill colour, the `.sel` outline on that muscle's polygons only, the pill and label still shown, the camera at 1x and the stage and caption row unmoved; a second tap closes; the same for every helper (helper colour); a zoom chip replaces the muscle bubble with its caption (accent dot, no outline) and a second chip tap closes; Enter on the focused target opens and Space closes; a tap on the stage background closes; every text fits two lines in Roboto (bubble at most 54 px); in Pictures mode no hotspot is hit-testable over the stage; no hotspot carries an animation class or matches a zoom subject or muscle class. The muscle-visibility check hides `.hot` while it counts.
