# F-ZOOM-PITCH: carry `camera.pitch` through the zoom circle and QA's projection

Card, 2026-10-30. Supervisor: session_01PeNM9HeWPrhrcscMwXzupy. Line numbers are on main `6cf4ea2a`.

## Why now
LIB-8R's dumbbell_fly is the first plate with LIB-20's `camera.pitch` (45°) that has a zoom. Panel mx4 scored its R11 2/2/2: the circle does not copy its ring (#340 6534832450). The builder's diagnosis (#340 6534849228) found that the pitch is lost in two library files:
- `tools/plates/library/zoom/inline.mjs:153` builds the circle's spec with `camera: { pxPerM: c.pxPerM * k, x0, y0 }`. That replaces `spec.camera` whole, so `pitch` is dropped and the circle renders unpitched.
- `tools/plates/library/qa/engine.mjs:36-40`: `cameraOf()` projects `[x0 + x·pxPerM, y0 − y·pxPerM]` with no pitch term. The engine projects `y0 − (y·cos p − z·sin p)·pxPerM` (vendor `plate.mjs` makeCamera). `cameraOf` feeds the ring's focus (`inline.mjs:135` → `faultOf`) and the QA measures (`qa/node.mjs:122`; `qa/zoom.mjs:65, :84, :119`).
- Measured on the fly's `grip.r` anchor: the deviation is 6.57 px without pitch and 4.97 px with it. The ring sits about 10 px below the real hand.

This is a units-and-geometry correction, not a rule change: with `pitch` absent (0), both formulas are identical.

## Scope (files it may touch)
- `tools/plates/library/zoom/inline.mjs`: the circle's camera keeps every field of `spec.camera` (`pitch` included) and overrides only `pxPerM`, `x0` and `y0`.
- `tools/plates/library/qa/engine.mjs`: `cameraOf()` applies the engine's pitched projection. It reads `pitch` from the spec's camera, because the vendor report's camera (`vendor/engine/plate.mjs:313`) carries none; cite the line you read it from. With pitch 0 the result must be byte-for-byte the same numbers.
- Every other caller of `cameraOf` that needs the spec passed in: list each one in the PR.
- `tools/plates/library/MANIFEST.json`: one `[golden update]` commit for the closure hashes of the files above, as F-ZOOM-2 did. C0 must be `[]` after it and red before it.
- New: `tests/howto/f-zoom-pitch.test.ts`. Also `tools/plates/library/zoom/DESIGN.md` (a section) and `docs/COACHING-DECISIONS.md` (one entry).
- **Never:** `vendor/**`, any spec, any lane's batch files, `.github/**`, `src/**`. No threshold, bar, ladder or check changes.

## Do
1. Branch `claude/fix-zoom-pitch` from origin/main, and open a draft PR 'F-ZOOM-PITCH'.
2. Make the two corrections with the smallest code change.
3. Write the tests below, each with its red mutation.
4. Prove that nothing on main moves (A3).
5. Measure the fixed numbers on LIB-8R's dumbbell_fly in a scratch run from `claude/lib-8-resume`, and post them (A5). Never commit to that branch.
6. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, detached with logs. Then post 'F-ZOOM-PITCH READY @ <sha>'.

## Acceptance
| # | Row | Evidence | Red mutation |
|---|---|---|---|
| A1 | `cameraOf` matches the engine's projection | For 3 world points at pitch 0, 15° and 45°, `cameraOf(...).P` equals vendor makeCamera's projection to 1e-9. | Drop the pitch term: red at 15° and 45°. |
| A2 | The circle copies its ring on a pitched plate | On a pitched fixture spec, 4 landmarks drawn in the circle sit at focus + k × (plate position − ring centre), within 0.05 px. | Drop `pitch` from the circle's camera: red. |
| A3 | Nothing on main moves | Before and after equal, for: every plates page main builds (pilot A `5d0e562f…5ba8`, pilot B `ff3e017c…`, every LB page in the registry, listed with shas); every main plate's node and zoom QA report (keys and values, JSON-equal); and every approved zoom's ring and circle numbers. | None; this is a byte-equality proof. |
| A4 | Pins | C0 `[]` after the golden update, red before it. `generate.mjs --check` passes. | Revert the MANIFEST commit: C0 red. |
| A5 | The fly | Scratch numbers for dumbbell_fly's `grip.r`: the pitched deviation (expected about 4.97 px), the smallest ladder k that passes H3.zoom, and the ring centre. The lane builds the zoom itself. | — |
| A6 | Checks | check, test:tz and gate green locally; CI green. | — |

## Rulings recorded
- **D-ZOOM-PITCH:** the circle and every QA projection use the plate's own camera, pitch included. A plate with no pitch is unchanged. A pitched plate's measures are now the drawn ones, so its zoom k may change. The lane re-measures and never enlarges a fault.

## Risks
- **A main plate whose spec carries a `camera.pitch` field would move.** Mitigation: A3 lists every main spec's camera, and none may carry pitch (the diagnosis says none does; prove it with a grep).
- **Another caller of `cameraOf` that has no spec at hand.** Mitigation: pass the camera in explicitly, and never default a pitched plate to 0 silently. A pitched spec with no camera passed in throws.

## Forecast
About 2-3 h for the builder, then one fresh Opus review and a merge train. Nothing visible ships, so there is no APK.
