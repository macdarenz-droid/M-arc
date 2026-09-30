# Design C, "hybrid": Technical Plate "How to do it" in the app

Status: plan only. Nothing was edited, committed or pushed. Base: main fba3f37 (wt-arch at 6041f6c has the same src, tests, scripts and .github).
Golden reference: branch `claude/howto-options` at commit `bc0f378`, folder `docs/howto/technical-plate/`.
The owner's rule (2026-09-30) is the top constraint of this design: the approved plates ship exactly as they are, and the new work only adds layers.

---

## 0. Facts I verified for this design (they change the plan)

| # | Fact | How I checked it |
|---|---|---|
| F1 | **The golden commit cannot rebuild itself.** `bc0f378` has no `ref-src/` folder and no font file. Yet `engine/plate.mjs:8` imports `../ref-src/plate.mjs` (all of PLATE_CSS), and `build-page.mjs:7-8` imports `ref-src/plate.mjs` (the approved **lateral raise** plate is `refPlate`, not the engine) and `ref-src/themes.mjs`. `engine/sheet.mjs` reads `engine/inter-latin-wght-normal.woff2` when the module loads. `ref-src` is committed on no branch at all (`git log --all -- '*ref-src/plate.mjs'` is empty). It exists only in the scratchpad `plates2/ref-src`. | git ls-tree / git log |
| F2 | **bc0f378 plus `plates2/ref-src` plus that font regenerates the approved gallery byte for byte.** `node build-page.mjs` on Node 22.22.2 writes `technical-plates.html`. `cmp` against `git show bc0f378:…/technical-plates.html` passes (sha256 `e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48`, 860,766 B). It takes about 3.0 s. The pinned inputs are `ref-src/plate.mjs` md5 `31e7bfe3555c0c456ed4417f503dc93f` and `ref-src/themes.mjs` md5 `37495b3d37d1a6a284a380c9e517fb18`. | htplan/_regen |
| F3 | The engine files and 7 exercise specs in `plates2` today are byte-identical to bc0f378 (geom, body, equipment, layout, plate, and all 7 `exercises/*.mjs`). The How-to work so far only adds new files. | diff |
| F4 | **Every theme token the golden CSS reads has the same value in the app at fba3f37, in all 5 themes.** The only exception is `--mistake`, which the app does not have. The golden values are silent-black #eb5757, paper #c0392b, ember #b36bff, emerald #f04438, midnight #ff5c5c. The non-theme token block (`engine/tokens.css` compared with styles.css tokens:start…end) also has 0 differences. | htplan/_cmpthemes.mjs |
| F5 | The golden page's `--font` is `'Inter Variable', Inter, …`, but the page never loads 'Inter Variable'. It pulls static Inter from Google Fonts (network). The app ships `@fontsource-variable/inter` `inter-latin-wght-normal.woff2`, which is the same file as the engine's woff2 (md5 `260c81a4…`). | md5 |
| F6 | **Width trap.** The golden card is 390 px with a 1 px border and 15 px padding, so the plate is 358 px wide (zoom 1). The app's `.sheet-panel` has a 1 px border and 16 px padding (styles.css:286), so at 390 px the plate would be **356 px** (zoom 0.994). That is not pixel-identical. The How-to body must bleed 1 px on each side. | styles.css |
| F7 | Class clashes. Inside the plate SVG, no class matches an app rule except `.dot`, and the app's `.dot` rule only applies inside `.watch-pill`, so it has no effect here. The real clash is the wrapper `figure.plate` against the app's global `.plate` chip (styles.css:522). The golden page chrome also uses classes the app already has (`eyebrow`, `hint`, `sr-only`, `sheet-head`, `sheet-grab`, `seg`, `grow`). | grep over 16 golden SVGs |
| F8 | Golden payload per exercise card (the plate, the mistake plate, the spliced guides, overlay, tells and tempo) is 12.7 KB gz for the lateral raise, 18.3–21.3 KB for leg press, squat and chest press, and 24.1–28.9 KB for lat pulldown, seated row, hanging leg raise and pull-up. The golden CSS is 23.9 KB raw / 6.5 KB gz including the page chrome. | htplan measure |
| F9 | Contrast of the golden `--mistake`: against `--map-body` it is 4.90 / 4.28 / 5.03 / 4.13 / 3.55; against `--surface-2` it is 5.25 / 4.68 / 5.53 / 4.54 / **4.12** (order: silent-black, paper, ember, emerald, midnight). All pass 3:1. **Midnight's 11 px "Tells" labels are 4.12:1 on the sheet (surface-2), which is under WCAG AA 4.5:1 for small text.** This is part of the approved plate, so I report it and do not change it (see R12). | computed |
| F10 | The golden figure selection logic (build-page.mjs JS, about 60 lines) is the only interactive behaviour of the plate: callout aria-pressed; the `.leader.on`/`.anchor.on` toggle with r 1.5→2.5; the `data-guide` display; the cue line; the mistake swap with the X icon and sr-only "Mistake:"; `.tracing` with the ghosts' `--gd` computed from `data-t` or `data-th`. | read |

**Action before any build card (supervisor, today):** commit `plates2/ref-src/{plate.mjs,themes.mjs}` to `claude/howto-options` next to bc0f378's folder, as a docs-only commit on that mockup branch. Record the md5s from F2. Until then, the only copy of the approved lateral raise geometry and of PLATE_CSS is a scratchpad file that another agent is still working in.

---

## 1. The fidelity contract (what "exactly like the approved gallery" means, and how it is proven)

The same engine output is shipped, so the check is **byte identity** and not "close enough". The only freedom is the page around the plate, and a pixel diff covers that. Five layers, each proving one link in the chain:

| Layer | Claim | Check | Where |
|---|---|---|---|
| L0 Vendor lock | The engine, the ref-src, the 7 specs and build-page in the repo are exactly the approved sources | sha256 manifest `tools/plates/vendor/MANIFEST.json` (each file hashed against the bc0f378 blob, or the F2 md5 for ref-src), checked by a unit test | vitest |
| L1 Golden identity | The vendored sources still produce the approved gallery | the test builds a temp mirror (vendor + fontsource woff2), runs `build-page.mjs`, and asserts sha256 == `e2bea90c…` (stored in `tests/howto/golden/GOLDEN.json`) | vitest, about 3 s |
| L2 Shipped bytes | What the app bundles equals what the gallery shows | for each of the 8 exercises, the strings in `src/howto/generated/ht-<slug>.ts` equal the strings extracted from the L1 gallery: normal `svg` (with guides spliced), tagged normal overlay, mistake `svg`, tagged mistake overlay, tells, cue texts, tempo, alt, mistake alt. Exact `===`, no normalising. | vitest |
| L3 Pixel parity | The app's DOM and CSS draw those bytes the same way | Playwright at 390×844 CSS px, DPR 2. Screenshot the region from the plate top to the tempo bottom in the app (the real Sheet, the real CSS) and in the golden page (regenerated by L1). Compare 8 exercises × 5 themes × {normal, mistake}, plus every callout selection in silent-black and paper, plus a 360 px pass in silent-black | new gate block `HT-4` |
| L4 Motion parity | Trace plays the same | for each exercise: the `getAnimations()` list on the traced figure (target class, keyframes, duration, delay, easing, fill) equals the golden's. Pixel compare at t = 0.6 / 1.2 / 1.8 / 2.7 s with the animations paused at those times (`anim.currentTime`), in silent-black. Reduced motion: the end state is pixel-identical to the golden reduced-motion state | gate block `HT-4` |

L3 details, so the rule cannot be bent:
- **Same inputs on both sides.** Both pages load the same woff2 (F5). The harness aborts the golden's Google Fonts request (`page.route`) and adds `@font-face{font-family:'Inter Variable';src:url(<node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2>)}`. It waits for `document.fonts.ready` on both. This is the **one declared normalisation**. It is an environment change; the golden HTML bytes stay the same.
- **Same geometry.** The app asserts `.ht-plate-fit` is exactly 358.0 CSS px wide at 390 px and that the figure's computed `zoom` is 1 (F6). The golden region and the app region must have identical device-pixel sizes; if not, the check fails and the pixels are not compared.
- **The comparison runs in the browser and needs no new dependency.** Both PNGs are decoded into a canvas and compared with `getImageData`. Pass rule: **no pixel differs by more than 1/255 in any channel, and at most 0.02 % of pixels (about 110 of 556 k at 716×776 device px) differ by exactly 1.** Sanity rule: the golden rendered twice must give 0 differing pixels, or the harness itself is not deterministic and the block fails.
- **The check must bite.** The PR's mutation table must show it failing when (a) one callout moves 1 px, (b) one token changes by one step (for example `--text-3` in paper), (c) the 1 px bleed is removed, (d) the mistake SVG is swapped with another exercise's.
- **Threshold changes are decisions, not edits.** If CI shows anti-aliasing noise above the rule, the builder finds the cause (a transform, `will-change`, or a compositing layer from the Sheet's entry animation; the capture waits for `getAnimations().length === 0` on the sheet). Raising the threshold needs a supervisor decision in COACHING-DECISIONS.md, with the diff images attached to the PR.

**Golden update procedure.** A plate changes only by (1) a spec or engine change in `tools/plates/vendor` (or a new spec file), (2) a regenerated gallery, (3) the owner seeing the new gallery (contact sheet), (4) a new pinned commit on `claude/howto-options`, and (5) an add-only entry in `GOLDEN.json` `{ref, sha256, approvedBy, date, why}`, called out in the PR with a reviewer's sign-off. The L1/L2 tests read the latest entry. Old entries stay as history.

**New layers get the same treatment.** When the owner has seen the finished How-to mockup (hands, posture, feel), the supervisor pins it the same way (golden B). Each new-layer card adds L2 byte checks for its own build-time SVGs (the hand pairs, the posture wrong-crops) and L3/L4 pixel and motion checks for its states (S2, S3, S4, S5 end frame), in all 5 themes. The mockup builder must give each state a stable selector or button the harness can drive; I list this as an input needed from the mockup lane.

---

## 2. Where the owner's rule overrides the architecture doc (GRIP-AND-FEEL)

GA was written before the owner's fidelity rule. Where the two conflict, the rule wins. Each item below becomes a recorded decision (D-HT2, section 13).

| GA item | Why it conflicts | v1 decision |
|---|---|---|
| R2: one of the 3 callouts on `push` is always "Heel of palm" | It changes the chest press callouts, labels and positions | Callouts stay exactly as approved. "Heel of palm" is the caption of the **Hand** chip and the first line of the hand zoom. |
| R3: on push, the Mistake pill shows the wrist fault, and the body mistake moves to a posture zoom | It changes the approved Mistake view and its tells | Mistake stays the approved body mistake with its tells. The wrist fault is the hand zoom's "Wrong" panel. |
| R15/R16: hotspots and a dotted hand ring drawn on the plate | It adds pixels to the approved plate and can steal taps from callout buttons | No hotspots and no ring on the plate in v1. The "Look closer" chip row below the pills is the only way in. Proposing a ring later means a golden update. |
| GA 5.2: a posture crop scales the on-screen plate (1 → 2.2) | Allowed. It is a state (S3), not the S0 plate. | Kept. The crop reuses the same SVG string (section 5.3). |
| GA 5.4: 24 KB gz per-exercise chunk | The approved plates alone are 24–29 KB gz for 4 of the 8 (F8). Meeting 24 KB would mean redrawing them. | The budget becomes 36 KB gz for the base chunk. Zoom renders and hand SVGs go in their own chunks (section 8). |
| GA 5.3: feel mode added to MuscleMap | MuscleMap is in the main chunk. The feel mode (shimmer, clip, states) would grow main. | Its own `FeelMap` component in the lazy chunk. It imports the path data from `@/svg/bodyMuscles`, which is already in main, so there are no duplicate bytes. MuscleMap is unchanged. |
| GA D3: shimmer with EASE.standard × 2 | The mockup uses a 5.2 s single run with a built-in gap, cubic-bezier(.45,0,.55,1), and says why | Follow the mockup (it is what the owner will approve). C12 reads the constants. |

---

## 3. Module layout

```
tools/plates/                         build time only, never bundled (Node 22, no new dependency)
  vendor/                             VERBATIM, hash-locked (L0)
    engine/{geom,body,equipment,layout,plate,index,sheet,themes}.mjs, tokens.css, SPEC.md   from bc0f378
    ref-src/{plate,themes}.mjs        from the pinned ref-src commit (F1/F2)
    exercises/{7 specs}.mjs           from bc0f378
    build-page.mjs                    from bc0f378 (golden regeneration only)
    MANIFEST.json                     {path: sha256, source: "bc0f378:<path>" | "<ref-src commit>:<path>"}
  layers/                             new-layer engine modules, verbatim from golden B once pinned
    hand.mjs, hand-pairs.mjs, feelmap.mjs (constants only), end-on-inset.mjs
  generate.mjs                        content + vendor → src/howto/generated/**   (--check mode = regenerate in memory and diff)
  golden.mjs                          builds the temp mirror, runs build-page, extracts per-card strings (used by L1, L2, L3)
  css.mjs                             golden CSS → src/slices/howto/css/plate.css (mechanical rewrite, section 7)
  fidelity/harness.mjs                Playwright helpers for the L3/L4 gate block (compare in canvas)

src/howto/                            app code
  types.ts                            the data model (section 4); imported by tools and app
  ids.ts                              GENERATED, in MAIN: HOWTO_IDS, PUSH_IDS, HOWTO_LABEL = 'How to do it'. Under 1 KB for 8 ids, about 4 KB at 153.
  archetypes.ts                       hand and contact archetypes, RED_FLAG, DISCLAIMER (lazy)
  content/<slug>.ts                   AUTHORED How-to content per exercise (`satisfies HowToContent`). Build input only; never imported at runtime (test).
  generated/
    index.ts                          GENERATED: LOADERS: Record<LibId, () => import('./ht-<slug>')>
    ht-<slug>.ts                      GENERATED base chunk: plates, text, feel data, zoom descriptors
    ht-<slug>-zoom.ts                 GENERATED: posture wrong-crop renders (only if the exercise has them)
    hand-<key>.ts                     GENERATED: one hand pair SVG per (archetype, orientation, handle, fault), shared

src/slices/howto/
  lazy.tsx                            in MAIN: HowToSheet wrapper (the ShareSheet pattern), howToLoadFailed toast
  HowToSheet.tsx                      the lazy shell: Sheet, section order, S0–S7 state machine
  PlateView.tsx                       inserts the golden strings; usePlateState ports the gallery JS (F10)
  sections/index.ts                   ordered section list; each later card adds one line
  sections/{LookCloser,Hand,Posture,Feel,Setup,Mistakes,Risks,Sources}.tsx
  FeelMap.tsx                         own component on @/svg/bodyMuscles (section 2)
  css/plate.css                       GENERATED from the golden CSS (css.mjs)
  css/{sheet,hand,posture,feel,text}.css   hand-written, scoped under .ht, one file per card
```

Chunk names come from file names. `ht-machine-chest-press-<hash>.js`, `hand-push-vertical-bentback-<hash>.js` and `HowToSheet-<hash>.js` never match the old-guide ban `^(FormGuidePlayer|ExercisePlayer|lib_[a-z_]+)-`. **No vite.config change is needed.** Slug = the id without `lib_`, with `_` replaced by `-`, which is also the golden's `pre` (build-page.mjs `id.replace(/_/g,'-')`), so element ids stay exactly as in the golden.

---

## 4. Data model (TypeScript)

```ts
// src/howto/types.ts  (tools import from src, never the other way round)
import type { MuscleId } from '@/data/muscles';
import type { BodyPartId } from '@/svg/bodyMuscles';           // the exported part id union (builder: confirm its export name)

export type LibId = `lib_${string}`;
export type EvidenceTag = 'DATA' | 'MECH' | 'CONSENSUS' | 'WEAK';
export interface Source { id: string; cite: string; url?: string; kind: 'paper' | 'book' | 'org' | 'library' | 'research-file';
  access: 'full' | 'abstract' | 'unreachable'; checked: string }        // null is not allowed (mockup D1 → C8 fails)
export interface Claim { tags: EvidenceTag[]; sources: string[]; note?: string }

// ---------- authored: src/howto/content/<slug>.ts ----------
export interface HowToContent {
  schema: 1; id: LibId; rev: number; level: 1 | 2; extends?: string;
  plate: { kind: 'engine'; spec: string } | { kind: 'reference' } | { kind: 'none' };  // spec = tools/plates/vendor/exercises/<file>
  handling: HandlingSpec | NoHandling;
  contacts: ContactArchetypeId[];                   // 1-3
  setup: SetupStep[];                               // first 3 shown, then "All steps"
  posture: PostureCheckpoint[];
  mistakes: HandlingMistake[];                      // handling mistakes (not the plate Mistake, which is frozen)
  risks: Risk[];                                    // per-exercise risks; the red-flag wording is the one RED_FLAG
  feel: FeelSpec;
  zooms: ZoomSpec[];                                // max 4, "Where to feel it" chip is implicit and last
  copy: { gripLine?: string; setupLine: string; feelLine: string; mistakeLine?: string };
  sources: string[];                                // ids in docs/research/howto/sources.json
}
export interface HandlingSpec { archetype: HandArchetypeId; orientation: Orientation; handle: HandleProfile;
  thumb: { mode: ThumbMode }; overBody?: boolean; right: HandPose; faults: HandFault[]; notes?: string[]; claim: Claim }
export interface NoHandling { archetype: 'none'; why?: string }
export interface HandPose { view: 'radial' | 'end-on'; forearm: number; wrist: { ext: number; dev: number };
  contactAt: number; fingers: 'wrapped' | 'open' | 'hook'; thumb: ThumbMode; squeeze: 0 | 1 | 2; handle: HandleProfile;
  load: 'along-forearm' | 'across' }
export interface HandFault { key: string; label: string; pose: Partial<HandPose>;
  markers: ('lever-arc' | 'slip-arrow' | 'skin-ridge' | 'tendon' | 'load-through-wrist')[]; alt: string; claim: Claim }
export interface SetupStep { kind: 'seat' | 'pad' | 'pin' | 'handle' | 'feet' | 'grip' | 'brace' | 'unrack' | 'start';
  text: string; zoom?: string; claim?: Claim }
export interface PostureCheckpoint { key: string; label: string; right: string; wrong: string; zoom?: string; claim: Claim }
export interface HandlingMistake { key: string; label: string; what: string; why: string; fix: string; zoom?: string; claim: Claim }
export interface Risk { key: string; text: string; claim: Claim }                 // never its own red-flag wording (C8)
export interface FeelSpec { primary: MuscleId[]; secondary: MuscleId[]; watch: MuscleId[]; side: 'both' | 'one';
  rows: FeelRow[]; libraryDiff?: { why: string } }
export interface FeelRow { key: string; where: string; means: string; fix: string;
  at: { muscles?: MuscleId[]; parts?: BodyPartId[] }; claim: Claim }
export interface ZoomSpec { key: string; kind: 'hand' | 'posture'; chip: string; caption: string; // caption ≤ 14 words
  hand?: { camera: string; inset?: 'end-on'; thumbPage?: boolean };
  posture?: { crop: { cx: number; cy: number; size: number };                 // in plate px (358 box)
              right: { from: 'n' }; wrong: { from: 'm' } | { still: string };  // still = own pose, rendered at build time
              marks?: string[] };
  alt: { right: string; wrong: string } }

// ---------- built: src/howto/generated/ht-<slug>.ts (`satisfies BuiltHowTo`, so tsc checks the generator's output) ----------
export interface PlateFigure { svg: string; overlay: string; firstKey: string; cues: { key: string; cue: string }[] }
export interface BuiltHowTo {
  schema: 1; id: LibId; name: string; level: 1 | 2;
  hashes: { content: string; engine: string; golden: string | null };    // golden = GOLDEN.json entry sha, null for Level 1
  plate: null | { view: 'side' | 'front'; normal: PlateFigure; mistake: PlateFigure | null;
    tells: { key: string; text: string; cue: string }[]; tempo: { phase: string; s: number; move?: boolean }[];
    alt: string; mistakeAlt: string };
  zooms: BuiltZoom[];                                   // hand → { handKey }, posture → { viewBox, marksSvg, wrong: 'm' | {chunk:true} }
  feel: Omit<FeelSpec, 'libraryDiff'> & { textOnly: MuscleId[] };      // core, brachialis, rotator_cuff land in textOnly (C2)
  setup: SetupStep[]; posture: PostureCheckpoint[]; mistakes: HandlingMistake[]; risks: Risk[];
  sources: (Source & { tags: EvidenceTag[] })[]; copy: HowToContent['copy'];
}
```

Why plates are stored as strings and not as a geometry AST: the owner's rule needs byte identity with the golden. Re-serialising paths on the phone would be a port of `plate.mjs`'s serializer, which would need its own byte-identity proof on every engine change. It also saves no bytes, because the gzipped string is already compact. The heavy geometry (IK, label search, hand wrap) runs only at build time. The phone does only state, theme (all colour is `var(--token)`), animation and layout. That is the hybrid.

Plate specs stay as the verbatim `.mjs` files, because they contain equipment callbacks that import engine helpers. The content (everything new) is typed TS data in `src/howto/content`, bundled for the generator with esbuild (a devDependency with precedent: `npm run logo`). Converting the plate specs to TS later is allowed only if L2 still passes byte for byte.

---

## 5. Runtime

### 5.1 Mount from the Train card (Train.tsx, the smallest change, owned by HT-4)
- `:12` add `import { HowToSheet } from '@/slices/howto/lazy'` and `import { hasHowTo, HOWTO_LABEL, isPush } from '@/howto/ids'`.
- `:616` add `const [howToOpen, setHowToOpen] = useState(false)`. The name must not be `guideOpen`, which A1 still bans.
- `:770-772` inside `.why-row`, after the toggle: `{ex && !ex.custom && hasHowTo(ex.id) && <button type="button" class="ht-entry" onClick={() => setHowToOpen(true)}><IconPlay size={18}/> {HOWTO_LABEL}</button>}`. Custom exercises and exercises without a generated module never show it (lesson L4: no fallback).
- `:916-917` between PlateSheet and SubstituteSheet: `{howToOpen && ex && <HowToSheet exerciseId={ex.id} name={ex.name} onClose={() => setHowToOpen(false)}/>}`.
- styles.css gets one `/* HT-4: How-to entry button */` block for `.ht-entry` only: 44 px min height, and it wraps in `.why-row`, which is already flex-wrap.
- `lazy.tsx` copies `src/slices/share/lazy.tsx:1-22` exactly, with `import('./HowToSheet')` and `howToLoadFailed()` → "Could not load the guide." plus a Reload action.
- No change to App.tsx or main.tsx. `Sheet` gets one optional prop `eyebrow?: string` (primitives.tsx: `<h2 id>{eyebrow && <span class="eyebrow sheet-eyebrow">{eyebrow}</span>}{title}</h2>`), a small additive change called out in the PR.

### 5.2 The plate (PlateView)
- `figure.ht-plate[data-mode=normal]` gets `dangerouslySetInnerHTML={{__html: normal.svg + normal.overlay}}` and is set **once** (memoised, never re-rendered), so Trace and selection are never reset by Preact. The precedent for injecting generated SVG is src/ui/Logo.tsx:7,12.
- The mistake figure is inserted on the first Mistake tap, then kept. This saves parsing about 57 KB of SVG when the sheet opens. The pixels are compared after the tap, so fidelity is unaffected.
- `usePlateState` is a line-by-line port of the golden JS (F10): the same attributes, classes, r values, `--gd` computation, the X icon markup and the sr-only text. Clicks are handled on the figure with `closest('.plate-callout')`. The cue line, pills, tells and tempo are Preact JSX that produce the golden's markup (the same classes and structure; L3 proves it).
- Scale: the golden `fit()` (CSS zoom = min(1, w/358)) with a ResizeObserver, plus the golden 9 px bleed under 350 px.

### 5.3 New layers (below the pills, nothing on the plate moves)
Order: "Look closer" chips (Hand first for hand archetypes; leg press is the exception) → tempo (golden) → "Where you should feel it" → "Set up" → "Common handling mistakes" → "Risks and when to stop" → "Where this comes from".
- **Hand (S2):** the golden-B hand pair SVG, loaded from `hand-<key>` on first open. It takes the plate box's place (the plate hides, it is not scaled). The "Right" and "Wrong" words and the tick/cross are printed in the SVG (they are required in Ember, because the mistake colour is violet there).
- **Posture (S3):** right crop = a copy of `normal.svg` with a new viewBox and ids renamed `‹pre›-n-` → `‹pre›-z‹k›-` by one pure, unit-tested function (no duplicate ids in the document). Wrong crop = the same from `mistake.svg`, or a `still` pose from `ht-<slug>-zoom`. The transition is scale 1 → 2.2 around the crop centre, 240 ms EASE.enter; the exit is 160 ms EASE.exit; reduced motion crossfades at 150/100 ms.
- **Feel (S4-S6):** `FeelMap` on `@/svg/bodyMuscles`. Main muscles use `--ht-feel-main`, helpers use the roles helper mix, watch is a dashed `--mistake` outline shown only in S6, and `core`, `brachialis` and `rotator_cuff` are text only (no alias). Shimmer: a clipPath of the main paths, one `rect.ht-feel-band`, transform only, one 5.2 s run after 300 ms at 50 % in view (IntersectionObserver in a hook; no inline script). The band does not exist in the DOM under reduced motion.
- **Zoom back:** `registerSheet('howto-zoom', close)` while a zoom is open, so Android back closes the zoom before the sheet.
- **State:** every open starts at S0, and nothing is stored (R8). No localStorage key and no store field.

---

## 6. FG-OFF guard re-scope (exact assertions)

This goes in the HT-4 PR, the same PR that adds the entry, so no loosened state ever reaches main. It edits FG-OFF's blocks, so it needs the supervisor's written OK and decision **D-HT1** (section 13).

**tests/workout/no-form-guide.test.ts**

| Assertion | Status | Replacement (at least as strict for its purpose) |
|---|---|---|
| A1: Train.tsx has no `btn-how-to` | KEEP | — |
| A1: Train.tsx has no `/FormGuideSheet\|hasGuide\|guideOpen/` | KEEP | — |
| A1: styles.css has no `.btn-how-to` | KEEP | — |
| A1: Train.tsx has no 'How to do it' | REPLACE | A1'a: the literal `How to do it` occurs in exactly **one** src file, `src/howto/ids.ts` (HOWTO_LABEL). That is stricter than before for every other file. A1'b: Train.tsx imports from the How-to only `@/slices/howto/lazy` and `@/howto/ids`. A1'c: the entry is gated by `hasHowTo(ex.id)` and `!ex.custom`; `hasHowTo` is true exactly for the ids in `LOADERS` and false for the other 145 library ids (a table test). |
| A2: no src/formguide or slices/formguide, and no src file matching `/formguide\|ExercisePlayer\|FormGuidePlayer\|\.form-guide\b\|\bfg4?-/` | KEEP unchanged | It already scans the generated `src/howto/generated/*.ts`, so the generated SVG is covered too. |
| A3: the 14 removed tokens are banned in src, index.html and THEMES keys | NARROW by exactly one name: `mistake` | A3': the other 13 stay banned exactly as they are. A3'': every theme has `mistake` equal to the approved values {#eb5757, #c0392b, #b36bff, #f04438, #ff5c5c} (equal to `negative` except Ember, per D-FG1). `var(--mistake)` may be read only in `src/slices/howto/**`, not in styles.css or anywhere else. Contrast ≥ 3:1 on `--map-body`, `--surface-1` and `--surface-2` (C9). |
| NEW A4 | ADD | The static import graph from `src/main.tsx` (static `import` only, not `import()`) reaches no `src/howto/**` except `ids.ts` and no `src/slices/howto/**` except `lazy.tsx`. `src/howto/content/**` is never imported by any runtime module. |

Why `--mistake` comes back under its old name: A3 guards against the removed FG-1 figure palette coming back without a decision. Here the owner approved a mistake colour again, with the same meaning and values as D-FG1. Renaming it to slip past the regex would bring the same thing back while the guard claims it is gone. So it returns openly, the guard is narrowed by that one name in writing, and it gets a value-exact, scope-limited positive check.

**scripts/screenshot-gate.mjs, FG-OFF block (:5583-5634)**

| Probe | Status | Replacement |
|---|---|---|
| chunk name `^(FormGuidePlayer\|ExercisePlayer\|lib_[a-z_]+)-.*\.js$` fails | KEEP unchanged | — |
| assets scanned for `(?<![\w])fg4?-[a-z]`, `form-guide`, `marc-formguide-rig`, `FormGuidePlayer` | KEEP unchanged | — |
| assets scanned for `/How to do it/` | REPLACE | The string occurs in `index-*.js` (count ≥ 1) and in **no other** asset. |
| Train page (Silent Black and Paper): no `.btn-how-to` and no `.form-guide` | KEEP | — |
| Train page: no "How to do it" text | REPLACE | On the seeded first card (lib_dumbbell_lateral_raise, which has a How-to) there is exactly one `button.ht-entry` with text "How to do it", ≥ 44×44 CSS px. Tapping it opens a dialog that contains `.ht-plate-fit`. On a card for an exercise without content (seeded custom exercise), there is no `.ht-entry`. |
| PASS phrase `FG-OFF (… no "How to do it" on Train)` | REWORD | `FG-OFF (old form-guide chunks, markup and tokens absent; How-to entry only where content exists)` |

---

## 7. Theme tokens and CSS

- **Theme contract (themes.ts): add one token, `mistake`, in all 5 themes, with the F4 values.** theme.test's "same keys in every theme" stays green. This is its own small card (HT-2), flagged in the PR as a theme-contract change.
- **No other theme token.** `--ht-feel-main: color-mix(in srgb, var(--accent) 75%, var(--text))` is a local variable on `.ht` (FEEL_MAIN_MIX is 25 in every theme, so there is no per-theme value). The shimmer and zoom timings are `--ht-*` locals.
- **Namespacing.** Every How-to rule sits under `.ht` (the sheet body root). `css.mjs` rewrites the golden CSS mechanically, with a unit test for each rule:
  1. The class selector `.plate` (regex `\.plate(?![\w-])`) becomes `.ht-plate`, and every selector gets the `.ht ` prefix. The SVG classes inside keep their names (bytes are unchanged).
  2. Page-only rules are dropped: `--pg-*`, `.pg-*`, `.group*`, `#sheets`, `.segmented/.seg`, the token copy and `allThemesCss()`, `.sheet-card/-grab/-head`, `.eyebrow`, `.hint`, `.sr-only`, `h3` (the app's own rules, which F4 and F7 show are equal, apply instead). The page's `:focus-visible` colour is replaced by the app's.
  3. Literal values the app lints forbid (`2.4s`, `160ms`, `80ms`, `2.3s`, the `cubic-bezier(...)`, px font sizes, `border-radius: 1px`) move into one `/* ht-tokens:start */ … /* ht-tokens:end */` block on `.ht`, with **identical** values. The rule bodies then read `var(--ht-…)`. L3/L4 prove the computed values match.
- **Lint coverage gap closed without editing other tasks' tests:** a new `tests/howto/css.test.ts` applies to `src/slices/howto/css/*.css` the same rules as QA-R7-4 (every `var()` is a theme token, an `--ht-*` defined in the file, or on the allow list), styles.tokens (time and bezier only inside ht-tokens, `font-size` only `var(--fs-*)` or an `--ht-*` defined in ht-tokens, `border-radius` only `var(--radius-*)` or ht-tokens, no `infinite`), and UI-1 (no keyframes named `exercise-*`). It also checks that every selector starts with `.ht`.
- **The app's `.plate` chip is protected:** a gate probe checks that PlateSheet's chip computed style (display inline-grid, height 40 px, border colour) is unchanged with the How-to CSS loaded.

---

## 8. Budgets (numbers, checked in CI by gate block HT-4 on `www/assets`)

| Asset | Measured basis | Budget (hard fail) |
|---|---|---|
| main `index-*.js` | 633,893 B raw / 187,830 B gz at fba3f37 | ≤ 640,000 raw and ≤ 190,000 gz. How-to may add at most ids.ts + lazy.tsx + the entry (about 1.5 KB raw now). A content probe also checks that main has no `plate-svg`, `u-stroke`, `ht-feel-band`, or any string of any content file. The supervisor may move the ceiling for other lanes by decision. |
| `HowToSheet-*.js` (shell JS) | new | ≤ 60 KB raw / 18 KB gz |
| How-to CSS (lazy CSS chunk) | golden plate/sheet parts about 12 KB raw; mockup HAND_CSS 3.6 KB + FEEL_CSS 4.6 KB | ≤ 28 KB raw / 8 KB gz |
| `ht-<slug>-*.js` base chunk | F8: 12.7–28.9 KB gz per plate set, plus about 4 KB gz of text | ≤ 150 KB raw / 36 KB gz each |
| `ht-<slug>-zoom-*.js` | mockup still crop about 7–8 KB gz each | ≤ 24 KB gz each |
| `hand-<key>-*.js` | a hand pair is 19.8 KB raw / 6.7 KB gz | ≤ 30 KB raw / 10 KB gz each |
| all How-to assets, first 8 exercises | about 8 × 25 + hands 8 × 7 + shell | ≤ 1.6 MB raw / 420 KB gz (re-set per batch by decision; the SW precaches everything, sw-version.mjs:6) |

Speed (the phone does no geometry):
- App start: unchanged by design (no How-to code in main; checked by A4 and the main content probe). No prefetch in v1.
- Sheet open: one dynamic import (shell + one base chunk, local APK assets), then one `innerHTML` of about 30–47 KB of SVG. Target: first frame under 100 ms on a budget Android phone. **No frame timing in CI (GA R47); this is a recorded device check on the exact APK.** Tripwires in CI instead: the element count of the open sheet in S0 is ≤ 700 (normal plate 173 + chrome); the mistake plate is not in the DOM until first used.
- Animations: transform and opacity only (C18, a `getAnimations()` keyframe probe). Shimmer ends at 5.5 s. Trace ends at 2.56 s. Nothing runs after end + 1 s (C12, computed from the constants).

Honest costs:
- APK and PWA grow by about 250–420 KB gz for the first 8.
- The generated TS files are about 1 MB raw in git for 8 exercises.
- CI gets about +5 s of vitest (L0-L2, twice because of MARC_PERF) and, **as an estimate I have not measured**, +90–150 s per gate job for about 110 pixel comparisons (it runs in both gate jobs).
- Each later plate batch costs owner review time for a new golden.

---

## 9. Offline

Everything is static and bundled. The SW precaches every file in `www/assets`, lazy chunks included (sw-version.mjs:6). In the APK they are local assets. There are no fonts beyond Inter Variable, no CDN and no fetch. A check rejects `fetch(`, `XMLHttpRequest` or `http` URLs in How-to chunks, except inside the `sources` strings, which are plain text opened in the system browser only on tap. The "Saved offline" hint stays (golden). Gate: with the network offline, the sheet still opens after a reload (copy the EscobarSheet offline probe). The build-B check passes: a chunk from the previous build still loads. A failed chunk load shows the toast and Reload (probe copied from ShareSheet's).

---

## 10. Accessibility and reduced motion

- Golden a11y kept as is: callouts are real buttons with aria-pressed and a 44 px hit area; the cue line is `aria-live="polite"`; the mistake cue has sr-only "Mistake:"; the figure has an sr-only figcaption alt; tempo is `role="img"` with a spoken label.
- The Sheet gives dialog semantics, focus, Back and drag-to-close.
- New: each zoom is a region named by its heading ("Hand: right and wrong"). Each half is `role="img"` with alt.right or alt.wrong, and has a printed Right/Wrong word plus an icon. Focus returns to the chip that opened it.
- The map is one `role="img"` per view, labelled from the FeelSpec, with paths aria-hidden. Every muscle is also named in text.
- Rows are buttons with aria-expanded, and "Show 2 more" is read in full.
- Chips, pills and rows are ≥ 44×44 CSS px (gate C10).
- Reduced motion (`html[data-motion=reduce]`, which is the app's own switch in motion.ts plus the OS setting): Trace shows the end state at once (the golden rule), zooms crossfade at 150/100 ms, the shimmer band is not rendered, and there is no smooth scroll. Gate C11: no running animation after opening a zoom or the feel section, and no `.ht-feel-band` in the DOM.
- Known limit: Midnight tells are 4.12:1 (F9). Report it to the owner as a possible deliberate golden update. It is not fixed silently.

---

## 11. Test strategy

**Unit (vitest; node env, no DOM):**
- `tests/howto/vendor.test.ts` covers L0.
- `golden.test.ts` covers L1 and L2 (120 s timeout).
- `generate.test.ts` (C14): `generate.mjs --check` gives an empty diff, and every generated file has a "GENERATED, do not edit" header plus the content hash.
- `ids.test.ts`: ids.ts equals the LOADERS keys equals the content files, and PUSH_IDS equals the push archetype ids.
- `entry.test.ts`: A1'a–c and A4.
- `css.test.ts`: section 7.
- `crop.test.ts`: the id-rename function; no duplicate ids across normal + mistake + all crops of one How-to.
- `content.test.ts`, run on every content file:
  - C1 cross-field rules;
  - C2 muscle ids (isMuscleId, drawn regions, text-only ids, primary≠watch, parts exist);
  - C3 hand zoom required when handling is not none;
  - C4 thumb rules;
  - C5 wrist, contact and lever from the hand geometry (hand.mjs report `ok`);
  - C6 coverage (every exercises.json id is content, a Level-1 stub or on the explicit `NO_HOWTO` list with a reason);
  - C7 copy lint (section 9 of the arch report; new fields only; the golden plate strings are frozen by L2 and are exempt);
  - C8 evidence (every claim has sources, no source has null or unreachable-only access, no own red-flag wording);
  - C15 review stamp: the content hash is in `docs/research/howto/reviews.json` (added in HT-10; before that, the test only checks the hash is computed);
  - C17 no network.
- `theme.test.ts` gets an add-only block `HT-2`: mistake values and C9 contrast from themes.ts, not a copy.
- `feel.test.ts`: the shimmer constants give an end ≤ 5.5 s, and the C12 limit is computed from them.

**Gate (add-only blocks, each with its own PASS phrase):**
- `HT-4`: the entry and the re-scoped FG-OFF probes, L3/L4 fidelity (8 × 5 × 2, callout states, 360 px, reduced motion), budgets, main content probe, `.plate` chip unchanged, offline/build-B/load-fail, no page errors, no new localStorage keys (the list before and after opening equals `marc.theme`, `marc.motion`, `marc.dev` and the store key).
- `HT-6`, `HT-7`, `HT-8`, `HT-9`: each layer's states in 5 themes against golden B (L2 for build-time SVG, L3 pixels), C10 tap targets, C11 reduced motion, C12 no endless animation, C18 transform/opacity only, TalkBack names (a role/name probe).

**Device checks (recorded in the PR, on the exact APK):** open time; zoom and shimmer smoothness on a budget phone; WebView SVG cost of the 284-element mistake plate; Android font scale inside the WebView; the owner's hand-photo match (GA R59).

---

## 12. Content pipeline (153 exercises)

1. **The 8 approved plates first (HT-3).** Their plate strings are the golden. The generator emits them with empty new layers. HT-4 ships them in the app: the owner gets exactly the gallery on his phone.
2. **New layers for the same 8 (HT-5 data, HT-6..9 UI).**
   - Research card, then source verification (NCBI, access and checked recorded), then the Appendix A fixes (lateral raise "EMG study", seated row citations, the long squat and HLR feel lines, the chest press 58-word wrist fix and its own red-flag wording), then `content/<slug>.ts`, then C1–C8 green.
   - Then render review in 5 themes plus reduced motion by a fresh reviewer, then the owner's contact sheet, then golden B.
3. **Next batch (recommended, pending O4): the 26 push exercises** (GA:1186-1191 lists the ids; the library fields alone cannot reproduce "26").
   - Each new plate needs a new engine spec, then a contact-sheet gallery (build-page style) that the owner approves, then a new GOLDEN.json entry. There is no plate without an approved golden.
   - Hand pairs are shared by key, so the batch mostly reuses `hand-push-*` chunks.
4. **Level 1 (archetype only: hand zoom, grip line, still roles map, no plate) for the rest**, only after that archetype passed review (C6 stubs).
   - Whether a Level-1 sheet with no plate should show "How to do it" at all is an owner-visible choice. I recommend yes, but only after the owner sees one on his phone.
5. **Batch gate:** without the paid physio/coach review (O1), content ships to main (the owner's APK). Publishing to other users waits for the owner (releases are owner-only anyway).

---

## 13. Decisions to record (COACHING-DECISIONS.md)

- **D-HT1 (supervisor, citing the owner's 2026-09-30 approval "Then start building. U got my approval." and the fidelity rule):** the How-to returns as the Technical Plate. It records the FG-OFF re-scope, row by row as in section 6, and `--mistake` re-introduced with the D-FG1 values. The old guide's names, chunks, markup and 13 tokens stay banned.
- **D-HT2:** the owner's fidelity rule overrides GA R2, R3, R15/16, 5.4 (24 KB) and 5.3 (MuscleMap mode), as in section 2. The shimmer timing follows the mockup (D3).
- **D-HT3:** the golden procedure: GOLDEN.json is add-only, a golden changes only with the owner's contact-sheet approval, and the L3 threshold is the section 1 value.
- Pending owner items (plan around them; nothing blocks):
  - O1 paid review before wide release;
  - O2 the disclaimer, "This is coaching guidance, not medical advice." (recommended wording, flagged, one constant);
  - O3 evidence tags shown (recommended yes; built behind a const that the owner's answer flips);
  - O4 next batch;
  - the "already seen" note (not built; new saved data);
  - Midnight tells contrast (F9).

---

## 14. Build cards (merge order = number; builds run ahead in parallel)

Common to every card:
- `base` is the current main SHA when the card starts.
- `connectivity` is offline and bundled.
- `reserved_paths`: native/wear/**, src/native/wearEngine.ts, WatchLab.tsx, the Settings watch row, escobar-worker/**, .github/**, signing, models.ts, store.ts, migrations, package.json and the lockfile, App.tsx and main.tsx, plus every path not in `write_scope`.
- `read_first`: this design, SPEC.md, the approved gallery, the GA sections named on the card, the naming rules (no `lib_*` chunk, no `fg-`/`form-guide`, only `--mistake` from the A3 list).
- `return`: the PR URL, head SHA, evidence map and mutation table.
- "Hard" means a design note on the PR before bulk building (AGENTS.md).

| id | outcome | write_scope | depends_on | size | key acceptance |
|---|---|---|---|---|---|
| **HT-1** Golden lock + types | The approved plates can be rebuilt from the repo, byte for byte | `tools/plates/vendor/**`, `tools/plates/golden.mjs`, `src/howto/types.ts`, `tests/howto/{vendor,golden}.test.ts`, `tests/howto/golden/GOLDEN.json` | ref-src pinned (section 0) | M | L0; L1 sha == e2bea90c…; mutation: a 1-byte change to plate.mjs fails both |
| **HT-2** Mistake token | The approved mistake colour exists in all 5 themes | `src/theme/themes.ts` (mistake only), NFG A3 narrowing, `tests/theme.test.ts` block HT-2 | — | S | A3' and A3'' exact values; C9 contrast; the 13 other tokens still fail |
| **HT-3** Generator + 8 plates | Generated, bundle-ready plate modules equal the golden | `tools/plates/{generate,css}.mjs`, `src/howto/{ids.ts,generated/**,content/*.ts (plate refs only)}`, `src/slices/howto/css/plate.css`, `tests/howto/{generate,ids,css}.test.ts` | HT-1 | M-hard | L2 exact for 8; C14 no diff; ids == loaders; css rewrite rules each unit-tested; not reachable from main (A4 test added here) |
| **HT-4** Plate sheet in the app | "How to do it" on the Train card opens the approved plate, pixel-identical | `src/slices/howto/{lazy.tsx,HowToSheet.tsx,PlateView.tsx,usePlateState.ts,sections/index.ts,css/sheet.css}`, Train.tsx (the 4 spots in 5.1), primitives.tsx (`eyebrow` prop), styles.css block HT-4, NFG A1 re-scope, `tests/howto/entry.test.ts`, FG-OFF gate block edit + new gate block HT-4, `tools/plates/fidelity/**`, D-HT1..3 | HT-2, HT-3 | L-**hard** | L3/L4 all 80 + states + 360 px; budgets; offline/build-B/load-fail; FG-OFF re-scope exactly as section 6; no new stored keys; `.plate` chip unchanged; mutations (a)–(d) |
| **HT-5** New-layer content, 8 exercises | Verified grips, posture, feel, setup, mistakes, risks, sources as typed data | `src/howto/content/*.ts` (new fields), `src/howto/archetypes.ts`, `docs/research/howto/{sources.json,<id>.json}`, `tests/howto/content.test.ts` | HT-1 (types) | M | C1–C8 green on all 8; the Appendix A fixes applied; D1/D4/D5 settled in types |
| **HT-6** Proper grips (hand close-ups) | Right vs wrong hand zoom per exercise, plus the push hint line | `tools/plates/layers/{hand,hand-pairs,end-on-inset}.mjs`, generated `hand-*.ts`, `sections/{LookCloser,Hand}.tsx`, `css/hand.css`, gate block HT-6, Train.tsx push hint only (after HT-4 merges) | HT-4, HT-5, golden B | L-hard | L2 hand SVG == golden B; L3 5 themes; C5 lever `ok`; Ember Right/Wrong words; back closes the zoom first |
| **HT-7** Posture close-ups | Right/wrong crops of the approved plate for each checkpoint | generated `ht-*-zoom.ts`, `sections/Posture.tsx`, crop id-rename util, `css/posture.css`, gate block HT-7 | HT-4, HT-5, golden B | M-hard | crop ids unique; L3 vs golden B; 240/160 ms, reduced motion 150/100; the S1↔S3 rules |
| **HT-8** Muscle highlight + shimmer | "Where you should feel it" map with main, helper and watch, plus a 2-pass shimmer | `src/slices/howto/FeelMap.tsx`, `sections/Feel.tsx`, `css/feel.css`, `tests/howto/feel.test.ts`, gate block HT-8 | HT-4, HT-5, golden B | M-hard | C2; C9 feel-main ≥ 3:1 (from themes.ts); C11/C12/C18; L3 S4 in 5 themes, L4 band timing; MuscleMap untouched |
| **HT-9** Setup, mistakes, risks, sources | Text sections with one red-flag and disclaimer constant | `sections/{Setup,Mistakes,Risks,Sources}.tsx`, `css/text.css`, gate block HT-9 | HT-4, HT-5 | S-M | C7/C8 on screen; "All steps" and "Show 2 more"; evidence tags behind the O3 const; the disclaimer flagged |
| **HT-10** Presses batch + Level-1 stubs | 26 push exercises (after O4) and archetype stubs, with review stamps | `tools/plates/vendor/exercises/<new>.mjs` (new specs, each with a golden entry), `src/howto/content/**`, `docs/research/howto/reviews.json` (add-only), C6/C15 | HT-6..9, owner golden approval per batch | L | every new plate has an owner-approved GOLDEN.json entry; C6 full coverage; budgets per chunk |

Parallel lanes (at most 4 builders, per the delivery report):
- Wave 1: HT-1, HT-2, then HT-3 and HT-5 on HT-1's head.
- Wave 2: HT-4 on HT-3's head (design note first).
- Wave 3: HT-6, HT-7, HT-8 and HT-9 once golden B is pinned. They build on HT-4's head, and each owns its own section file and CSS file. The only shared line is `sections/index.ts`, where both sides are kept when merging.

Merges go one per CI cycle (about 26 min), so HT-1…HT-9 is about 4 h of merge time after review.

---

## 15. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | ref-src (the lateral raise and PLATE_CSS) lost or changed in the scratchpad before it is pinned | Pin it now (section 0). HT-1's L1 hash fails on any change. |
| R2 | Node or V8 floating-point differences change the generated bytes | Coordinates are rounded to 2 decimals (geom.mjs:4). L1 runs on CI's Node 22 on every push, so drift turns red, not silent. The supervisor may pin an exact Node 22.x (.nvmrc) if it ever drifts. |
| R3 | App CSS leaks into the plate (the global button, svg or `.plate` rules) | `.ht` scope plus L3 on every theme; `.plate` renamed to `.ht-plate`; the reverse probe on the chip |
| R4 | The 356 px sheet width silently zooms the plate | An exact 358 px and zoom 1 assertion before any pixel compare (F6) |
| R5 | Anti-aliasing noise makes L3 flaky, and someone loosens it | The threshold is a decision (D-HT3); the harness self-check (golden vs golden = 0); captures wait for the sheet animation to finish |
| R6 | The golden page and the app use different fonts | The same woff2 on both sides (F5); `document.fonts.ready` |
| R7 | FG-OFF protections quietly weakened | Row-by-row replacement in section 6, D-HT1, the supervisor's sign-off, and the old-name bans kept verbatim |
| R8 | Main chunk growth or How-to code in main | A4 import-graph test, the main content probe, the main ceiling |
| R9 | Payload too big as batches grow (SW precache, APK) | Per-chunk and total budgets; hand pairs shared by key; zoom renders in sub-chunks; later option: store the mistake SVG as a delta of the normal one and rebuild the exact string at runtime (L2 still checks the rebuilt string) |
| R10 | Duplicate SVG ids (the sheet exit overlaps the next open, or crops) | Ids prefixed with the exercise slug (golden) plus the crop rename; a duplicate-id test per How-to |
| R11 | Unescaped overlay text (plate.mjs:270-271) | Content is repo-static. The generator allows only `<br>` in overlay text, with a unit test. L2 still compares against the golden strings. |
| R12 | Midnight tells at 4.12:1, under AA for 11 px text | Ask the owner (a deliberate golden update if he wants it fixed); record it in the PR |
| R13 | Golden B (hands, posture, feel) not approved in time | HT-3/HT-4 (the plates) do not depend on it; HT-6..9 build against the mockup head and merge only after the pin |
| R14 | The generator (.mjs) is not typechecked | Generated files end in `satisfies BuiltHowTo`, so tsc checks the output; unit tests cover the generator |
| R15 | WebView cost of 284 elements and 120 `<use>` on a budget phone | The mistake plate is inserted lazily; device check on the exact APK; a change to the SVG itself would be a golden update, never a silent simplification |
| R16 | Content ships before a professional review | O1: main only (the owner's phone); publishing is owner-only |
| R17 | Later edits to the gate PASS line conflict | One phrase per block, both sides kept; the supervisor re-reviews after each main merge |
