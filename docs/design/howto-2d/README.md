# How-to 2D figure: three designs

Owner request (2026-10-03): a whole 2D figure doing the exercise, smooth, with muscle detail, where every muscle can be mapped and lit like the recovery body map. Three designs first; the owner picks one, then we plan. Exercise: Machine Chest Press, three-quarter front view.

| Design | Look | How it was made | Meshy model |
|---|---|---|---|
| A, `A-anatomy.webp` | Anatomy plate: every muscle outlined, fibre lines, grey | Pose, camera and machine copied from the 3D pilot render | gpt-image-2, image-to-image (12 credits) |
| B, `B-map.webp` | The app's body-map look: flat muscle panels with gaps, dark, no face | 3D pilot render for the pose, the app body map as the style guide | nano-banana-pro, image-to-image (9) |
| C, `C-smooth.webp` | Smooth human: skin, shorts, shoes, muscle definition | 3D pilot render for the pose, the words-only try (`C-smooth-from-words.webp`) for the look | gpt-image-2, image-to-image (12) |

`C-smooth-from-words.webp` came from words only. Its elbows sit at shoulder height, about 90° out from the body, against the researched 45–70°, so a pose guide is needed.

## Mapping
Each `*-muscles.webp` is a second Meshy edit (gpt-image-2-5-sunburst, 12 credits) that fills every visible muscle with one flat key colour: chest red, upper chest orange, front delts yellow, side delts lime, biceps dark green, triceps cyan, forearms sky blue, abs blue, obliques purple, serratus magenta, traps pink, quads brown, adductors olive, calves and shins navy.
- **Alignment:** edges match the drawing at 0 px shift (phase correlation) for all three, so the colour regions sit exactly on the drawing.
- **Lighting a muscle:** we classify pixels to the nearest key colour and tint that region. All 14 muscles were found on all three. B's side delts are only a sliver (50 px).
- **What a view can map:** only muscles that face the camera. Back muscles (lats, rear delts, glutes, hamstrings) need a back or side view.
- **Records:** every task and prompt is in `tools/motion/meshy-ledger.json`.
