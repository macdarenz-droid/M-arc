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

## Motion test (owner picked C, 2026-10-03)
`motion/C-motion.mp4` shows C doing the press at the approved tempo (press 1 s, hold 0.3 s, return 1.5 s, rest 0.5 s, 24 fps), with the chest lit and the helpers lighter in every frame.
- **Keys:** 6 Meshy edits of `C-smooth.webp` (`motion/k*.webp`, gpt-image-2-5-sunburst, 12 credits each), each guided by the 3D pilot's pose at t = 0.25, 0.5, 0.625, 0.75, 0.875 and 1.0 s. Only the arms and lever arms change; legs and machine come back at 0 px shift.
- **Still parts:** `tools/howto-2d/comp.py` takes everything except the moving area from the first drawing, so legs, torso edges and machine never flicker. Measured: 0.13 grey levels of change in the lower body across the video.
- **In-betweens:** `tools/howto-2d/lit.py` uses optical flow (OpenCV DIS) between keys. Where the two flows disagree it shows the nearer key instead of blending, which removed the double handles seen with 4 keys.
- **Muscles:** each key has its own colour map (`motion/mk*`, `motion/nk*`, 12 credits each). The torso keeps the first map's labels; arms take the key's. The first key prompt painted the lats as triceps on 3 keys; adding "lats stay grey" fixed it (`nk*`).
- **Known flaws:**
  - The weight stack does not rise.
  - The chest highlight has a straight top edge in a few frames.
  - The near lever arm bends slightly near the shoulder for a moment late in the press.
  - The drawing is light-on-white; the dark themes need a plan.
- **Cost:** 180 credits for the test (keys, maps and one redo). One exercise in one view is about 170 credits: drawing 12, its map 12, then 6 keys × (12 + 12).
- **Tools:** the scripts need Python with opencv-python-headless, numpy and pillow (offline build tools, not app dependencies). Run them in a folder holding the key and map PNGs.
