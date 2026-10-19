# LIB-6-PM design note

Card LIB-6-PM (#181). Rulings: D-LIB9-ENGINE, D-LIB6PM-PLATE, D-LIB6PM-ANCHORS, D-LIB5-PAGE, D-LIB6PM-FIXTURE, D-LIB6PM-CAP, D-LIB6PM-WAITS, D-LIB6PM-L0. Checked on the Do 1 head (#181 9b8f76e6 + main 2078913c).

## a. Engine per plate

**Which engine a spec uses.** `engineNameOf(specFile, { root })` in `render/closeups.mjs` reads the spec file's whole static import closure with esbuild (the same `buildSync` metafile call `layers-spec.mjs` importsOf uses; esbuild is already a dependency):
- `vendor` when a closure file sits under `…/tools/plates/vendor/engine/`. On the page this is the staged copy under `library/tools/plates/vendor/engine/` in the mirror, which layersSpecOf writes for a spec that imports `tools/plates/library/engine.mjs`.
- `layers` when a closure file sits under `…/tools/plates/layers/engine/`, or under `<root>/engine/` (the mirror's own layers engine).
- Both: it throws `close-ups: <file>: the spec imports both engines`.
- Neither: `layers` (the default).
The spec is `exercises/<card>.mjs` (card = howto id, except `dumbbell_lateral_raise` → `lateral_raise`). Only the spec decides. A How-to may import golden B's hand engine and `landmarksOf` from layers body.mjs (pull_up.howto.mjs:26-27), so its own closure is not read. Results are cached per file.

**The engine object.** `{ name, renderPlate, landmarksOf, legPressFace }`.
- `LAYERS_ENGINE` is exported by `crop.mjs` and built from its own layers imports (plate.mjs, body.mjs, plus equipment.mjs for legPressFace).
- `engineOf(specFile, { root, layers })` returns `layers` (default `LAYERS_ENGINE`) for a layers spec. For a vendor spec it imports `plate.mjs`, `body.mjs` and `equipment.mjs` from the vendor engine folder found in that spec's closure. On the page that is the mirror copy, so the spec and its renderer share one module instance.
- The repo's vendor engine is never imported statically. `engine.mjs` notes that its index.mjs reads a woff2 that exists only in a mirror.

**Threading.**
- `closeupApi(mod, options, { engine = LAYERS_ENGINE, specFile, root } = {})` passes the engine to `SHELLS[shell](mod, options, engine)`.
- zoom: `zoomApi(mod, o, engine = LAYERS_ENGINE)` → `engineCrop(howto, o.crop, engine)`. `engineCrop(howto, o, engine = LAYERS_ENGINE)` uses `engine.renderPlate` / `engine.landmarksOf` at every call (:31, :43, :63-66, :85, :104, :140). refSrcCrop is unchanged: it draws the approved ref-src drawing, not an engine plate.
- zbox: `zboxApi(mod, options, engine = LAYERS_ENGINE)` puts `engine` on `ctx`. zbox.mjs :36 and :51 call `ctx.engine.*`. In zbox-geometry.mjs, `CAMERAS.fitted(spec, o, engine = LAYERS_ENGINE)`, while STILLS, GUIDES, seatPad and reclinePad read `ctx.engine`.
- zbox-hand.mjs and hand.mjs are unchanged. They draw hands with golden B's hand engine, and the vendor engine has no hand.mjs.
- Each changed call keeps its arguments and order, so the 8, E1 and B5 (all layers specs, default engine) produce the same bytes.

**The engine check (explicit; it never compares bytes).**
- `closeupApi` computes `expected = specFile ? engineNameOf(specFile, { root }) : 'layers'`. If `engine.name !== expected`, it throws `close-ups: <id>: crop engine <x>, but its spec imports the <y> engine`.
- With no `specFile`, only the layers engine is accepted, so the API-level tests of the 8 also check the default.
- The plate block makes the same check (below).

**Patches.** Both are applied for every plan and spec; the engine is picked at run time.
- `renderer dispatch` (existing anchor, extended replacement): `__lib.closeupApi(mod, opts, { root, specFile, engine: await __lib.engineOf(specFile, { root }) })`.
- New anchor `plate engine` in the mirrored build-page.mjs: the exact-once block `const specExercise = async id => {\n  const spec = (await import(pathToFileURL(join(root, 'exercises', `${id}.mjs`)).href)).default;\n  const pre = id.replace(/_/g, '-');\n`.
  - It is replaced by a module-scope `const __lib = await import(RENDERER_URL), __layersPlate = renderPlate;` before it, and the same lines with `, renderPlate = await __lib.plateEngine(id, join(root, 'exercises', `${id}.mjs`), { root, layers: { name: 'layers', renderPlate: __layersPlate } })` appended to the `const pre` declaration (the inner `renderPlate` is the engine's renderPlate).
  - The inner `renderPlate` shadows the import inside specExercise only, which covers :59 and :63 (guides), its only calls. `__layersPlate` is bound in the module scope (an inner `renderPlate` in its own initializer would be in its TDZ), so it is the mirror's own import.
  - `plateEngine` runs engineOf plus the same check (naming the id), so a layers spec keeps the mirror's own `renderPlate`, exactly as today.
  - Vendor PLATE_CSS equals layers PLATE_CSS, so no CSS changes.
- Checked: the vendor renderPlate on a pull-up clone with `hand: 'flat'` and a `poly` part renders (0 issues, a palm path). The layers renderPlate throws `unknown equipment type: poly`.

**Modules the page loads by URL:**
- RENDERER_URL (render/closeups.mjs);
- REGION_FIX_URL;
- the batch's optionsUrl;
- BACK_BOX_URL, flagged pages only (b);
- for a vendor spec, the vendor engine files in the mirror (staged from the spec's closure, so already in its L0 set).
closeups.mjs imports esbuild, a package, so no repo file joins BUILDERS.

## b. Back patches (Do 5, after LIB-5 is on main)

Applied by patchHowtoLayers for every plan:
- `RF` (exact-once): `const RF = { true: 'wrist', shoulder: 'shoulder', knee: 'knee', elbow: 'elbow' };` → `… elbow: 'elbow', back: 'back' };`.
- `back holder` (exact-once): the line `import { lintAll, formatViolations, FEEL_ROWS_MAX, SETUP_MAX_STEPS } from './copy-lint.mjs';\n` → the same line plus `const __BACK = {};   // LIB-6-PM: the back box, loaded only for a page with a back-flagged sheet\n`.
- The dispatch load, inside the existing `renderer dispatch` replacement (its anchor is unchanged): `  if (mods.some(M => (M.default.riskFlags ?? []).includes('back'))) __BACK.backBox = (await import(BACK_BOX_URL)).backBox;`. The dispatch line sits after `mods` is filled and linted (howto-layers.mjs:300-305), and risksSection runs later (:316-317).
- `FLAG` (exact-once): `… elbow: RED_FLAG_ELBOW };` → `… elbow: RED_FLAG_ELBOW, get back() { try { return __BACK.backBox(); } catch (e) { throw new Error(\`${howto.id}: ${e.message}\`); } } };`.
  - With LIB-5's placeholder, the child prints `Error: lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`, and runNode carries it in the rejection (build-layers-page.mjs:103). PM-A5 matches that line.
- `BACK_BOX_URL` is exported as `pathToFileURL(join(HERE, 'shared', 'back-box.mjs')).href`. Nothing imports back-box.mjs statically.
- Nothing under tools/plates/layers/** or copy-lint.mjs is written. Only the mirror copy is patched.

## c. Fixture helper and S5-L

- `tests/howto/fixtures/lib5/back-page.mjs` makes D-LIB6PM-FIXTURE's four exact-once replacements in E1's How-to text, each of which throws if it does not match once. Any boundary-variant edit stays inside S5-L's word row.
- Measured on E1's staged tree (stageTree + golden B lintHowto, 2026-10-18):

  | Sheet | total | spec | safety | violations |
  |---|---|---|---|---|
  | E1 | 449 | 348 | 101 | 0 |
  | E1 with the three flag edits | 390 | 348 | 42 | 0 |

  copy-lint.mjs:313 drops 'back', so with the box at its 50-word limit the total is 390 + 50 = 440 ≤ 450, as the ruling measured.
- S5-L (Do 7) reads `RED_FLAG_BACK` from src/howto/red-flag-back.ts and the limit through `box-caps.mjs` boxReach's key 'back-pain-box'; it never copies them. Both waits for Do 9.

## d. L0-lib (Do 6, after LIB-4c and LIB-5 are on main)

- In filesOf, add-only: if any row of `row.batchFile`'s batch has a How-to whose `riskFlags` include 'back', add:
  - `tools/plates/library/shared/back-box.mjs`;
  - its esbuild import closure (importClosure, already in manifest.mjs);
  - `docs/research/howto/shared/back-pain-box.json`.
- riskFlags is read by importing each batch row's How-to (sourceOf), as the page does.

## e. Cost

Measured when each test file exists; posted in the PR (PM-A10).

## Risks

| Risk | Mitigation |
|---|---|
| The vendor engine differs on a layers clone | The default stays layers, and no pinned fixture changes engine. |
| A shadowed `renderPlate` misses a call | specExercise has two calls, :59 and :63, both in the shadowed scope. The fixture page proves the plate block went through the vendor engine (a `poly` part renders, and the layers engine would throw). |
| esbuild's view of the closure differs from Node's | It is the same resolver layersSpecOf and L0 use. Both engines found → throw. |
