# LIB-ZOOM design note: a zoom view for a fault too small to see on the plate

Card: `docs/supervisor/verify/lib-zoom-card.md` @ `7c389904` (D-LIBZOOM-NOW). Base: #245 head `38b436d` + origin/main
(`714858b`). Owner rule: no angle number in any zoom view (2026-10-18).

The renders in `evidence/` come from a scratch prototype (not committed). The prototype draws the zoom with a second
render of the same spec by the same engine. It does not change the engine, the 8, LB1 or any other lane's files. The
other lanes' specs were read from their own heads with `git show` (#109 `48d49bb`, #274 `616cebb`, #278 `a5a7238`) and
are not committed here.

## The two options

### Option 1: an inline zoom circle on the plate (recommended)

The circle is a 104 px circle on the plate, in the view whose fault or motion is too small. Inside it, the same spec is
drawn again by the same engine at k times the plate's camera, centred on the fault, and clipped to the circle. A dashed
source ring (radius 52/k) marks the region on the plate that the circle magnifies. The circle holds no text.

- **Reuses:** the vendored engine's `renderPlate` (a camera override only, as the golden-B crops already use), the
  plate's own masks, mistake layer and trace classes, the occupancy grid for placement, and QA's `deviation()` and
  `pathLength()`.
- **Adds:**
  - Renderer: one library-side post-step, `zoom/inline.mjs`, never under vendor/**. It reads an opt-in spec field
    `zoom: { view: 'normal' | 'mistake', k }` and appends one `<g class="plate-zoom">` to that view's svg. Specs
    without the field are not touched.
  - CSS: two classes (`pz-ring`, `pz-src`) on existing theme tokens.
  - QA, in node: H3 at the zoom's own scale (below). Placement: the circle sits inside the plate with an 8 px margin,
    below the meta band; it keeps a gap of at least 6 px to the figure and equipment (occupancy); no leader crosses it,
    and it does not overlap its source ring. Content: the source ring holds the tell anchor in both poses, or the whole
    trace. The zoom group holds no `<text>`, and a lint row fails on angle text (`/\d\s*°|degree/i`) anywhere in a
    zoom (owner rule; a planted "15°" turns it red). `k` must be from 1.5 to 4.
  - QA, in browser: no label box or 44 px hit box overlaps the circle at 390, 360 or 340 px (beside H4), and H5
    contrast holds for `pz-ring` in all 5 themes.
  - Gate: the H3 mutations for the zoom (listed below), plus the placement and lint rows.
- **PQ-H3 without loosening:** the bars stay 22.11 px (trace) and 11.39 px (deviation). For a view with a zoom, they are
  measured inside the circle at the zoom's own scale. Deviation is the tell anchor's end to mistake move, times k (the
  same `deviation()` as today). Trace is the zoom render's trace path, clipped to the circle. A view without a zoom is
  measured on the plate as today. A zoom that does not reach a bar at its own scale is red. A zoom is allowed only on a
  view that fails at plate scale, so it never decorates a plate that passes.
- **Bytes:** the 8 and LB1 do not use the field, so they render the same bytes, pinned by their existing page sha
  tests. Only horizontal_leg_press's own plate changes, and it is held today.

### Option 2: the golden-B posture zoom (`ZoomSpec` kind 'posture')

A chip opens Right and Wrong crops in the plate box's place (LIB-6, #181).

- **Reuses:** LIB-6's `engineCrop` and its zoom or zbox sheet (`render/closeup/*`) and the approved "Look closer"
  convention.
- **Adds:**
  - #181 is still open, so this PR would depend on it.
  - The library How-to row needs new user copy (chip, heading, captions, alt). horizontal_leg_press's How-to is an id
    only today; LIB-9 writes it later.
  - Posture crops draw no trace (`cropSpec` sets `trace: undefined`), so crunch, shrug and t_bar_row would need a new
    trace crop.
  - QA would need a new H3 path that reads a How-to zoom.
- **PQ-H3:** k = 171/sizePx. horizontal_leg_press at sizePx 72 gives k 2.375 and a deviation of 8.17 → **19.40 px**,
  which passes. But the plate's own Mistake view still shows 8.2 px. Passing H3 through a chip elsewhere comes close to
  exempting the plate: the user who taps Mistake still sees no fault.
- **Bytes:** none changed (a separate sheet).

### Why option 1

1. The fault shows where the user looks: on the Mistake view, with no extra tap.
2. The owner chose this shape: the inline knee close-up, "option A" (#245 6250897460).
3. It needs no new copy, and it does not wait for #181 or LIB-9.
4. One rule covers both H3 bars: trace in the normal view, deviation in the Mistake view.
5. Risk: the circle covers part of the plate. Mitigation: the placement rules in node and browser above. In the
   prototype, crunch's Mistake leader ("Low back lifts") crosses the circle. The leader rule catches this, and the
   build makes placement avoid leaders.

## Measures at the zoom's own scale (prototype)

| plate | motion class | view | plate px | k | zoom px | bar |
|---|---|---|---|---|---|---|
| horizontal_leg_press | knee lock | Mistake | deviation 8.17 | 2 | **16.34** | 11.39 |
| barbell_shrug | shoulder elevation | normal | trace 7.01 | 3.5 | **24.54** | 22.11 |
| t_bar_row | short row rise | normal | trace 0 (trimmed away) | 3 | **27.47** | 22.11 |
| crunch | blade lift | normal | trace 9.39 | 2.5 | **38.80** | 22.11 |
| crunch | blade lift | Mistake | deviation 7.56 | 2.5 | **18.89** | 11.39 |

The other bar already passes at plate scale for barbell_shrug (deviation 28.92), t_bar_row (13.05) and
horizontal_leg_press (trace 36.91). The prototype measures the trace over the whole zoom path. In these renders every
trace sits inside its circle; the build clips it to the circle.

## Renders (390 px viewport, plate 358 px, shown at half size)

- `evidence/option1-hlp-{paper,silent-black}.png`: approved leg_press normal and Mistake, then horizontal_leg_press
  normal and Mistake with the knee circle.
- `evidence/option2-hlp-{paper,silent-black}.png`: leg_press normal and Mistake, horizontal_leg_press normal and Mistake
  as drawn, then the Right/Wrong close-up sheet (sizePx 72).
- `evidence/option1-classes-{paper,silent-black}.png`: t_bar_row normal, barbell_shrug normal, crunch normal and Mistake.

## Build plan after the ruling (scope: horizontal_leg_press and the convention)

1. `zoom/inline.mjs` (the post-step) and its wiring in the library candidate render. The spec field is opt-in.
2. QA: the zoom path in H3, the placement and content rows, the no-angle lint row, and browser H4 and H5 for the
   circle.
3. Tests and mutations, each red when planted: k × deviation under the bar; a trace leaving the circle; a circle over a
   label; a leader crossing the circle; a planted "15°"; text in the zoom; a zoom on a view that passes at plate scale.
4. horizontal_leg_press gets `zoom: { view: 'mistake', k: 2 }`. All 10 hard checks pass, and the critic scores 4 or more.
   The pinned page sha of the 8 and of LB1 stay unchanged.
5. Page placement: at `38b436d`, horizontal_leg_press is still a row of `lb1/rows.json`, so it is on the LB1 page.
   - If #245 drops it before merging (the 12 plates), this PR adds it back as its own row and the LB1 bytes stay pinned.
   - If #245 keeps it, its plate on that page changes in this PR only, and the other 12 plates stay byte-identical.
   - Asked for the ruling.

## As built (after LIB-ZOOM NOTE RULED, #279)

- `zoom/inline.mjs`:
  - `zoomOf` (placement and render), `applyZooms` (the post-step of `build-page.mjs`), `plateZooms` (`candidate.mjs`
    moves each zoom group out of the plate svg into `plate.zoom`, so the plate-scale checks read the engine plate alone).
  - A dashed link joins the source ring to the circle, so the two read as one pair (ruling condition 3).
  - Placement takes the nearest spot to the fault that clears the figure and equipment by 6 px and stays off every
    label box, leader and the link.
- `qa/zoom.mjs`, the rows (keys):
  - `H2.zoom:text`, `H2.zoom:angle`;
  - `H3.zoom:{field,unexpected,missing,shape,k,not-needed,trace,deviation,content}`;
  - `H4.zoom:{margin,ink,leader,label,source}`.
  - `qa/node.mjs` h3 skips the plate-scale bar only on the zoomed view.
- `qa/browser.mjs`:
  - `H4.zoom:{label,hit}:<width>:<mode>:<key>` at 390, 360 and 340 px;
  - the ring is held to the ink floor (H5) in all 5 themes;
  - plate coverage ignores the zoom.
- `anchorInPose` moved from `qa/node.mjs` to `qa/engine.mjs` and is re-exported from `qa/node.mjs`. Without the move,
  `build-page.mjs` → `zoom/inline.mjs` → `qa/node.mjs` → `gen/plates.mjs` → `batch-golden.mjs` → `build-page.mjs` is a
  cycle, and vitest hung on it.
- horizontal_leg_press: `zoom: { view: 'mistake', k: 2 }`. The deviation is 8.17 px at plate scale and 16.34 px in the
  zoom. Renders: `evidence/built-hlp-{paper,silent-black}.png` (leg_press normal and Mistake, then horizontal_leg_press
  normal and Mistake).
