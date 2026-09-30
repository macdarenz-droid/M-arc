# Design B: runtime engine. The Technical Plate "How to do it", built in the app

Author: designer B (planning only; nothing in the app was edited, committed or pushed).
Base: main fba3f37. Golden reference: `claude/howto-options` @ bc0f378, folder `docs/howto/technical-plate/`.
Owner rules this design answers to:
- Approval, 2026-09-30: "Then start building. U got my approval."
- 2026-09-30: "Dont lower quality and output of the technical plates, i like it right now. Only the posture, proper grips, mistakes etc, risks, highlight or shimmer muscle outline are missing."

Evidence scripts I wrote for this design (all in `htplan/`):
- `_gold-check.mjs`: rebuilds all 16 approved plate SVGs and checks each one is byte-present in the approved gallery.
- `_rt/time.mjs` and `_rt/rt.js`: a browser bundle of the engine, timed in Chromium 1194 with CPU throttling.
- `_theme-diff.mjs`: gallery theme values vs the app's `src/theme/themes.ts`.
- `gold/`: bc0f378's engine files and `technical-plates.html`.

---

## 0. Verdict first (honest)

Design B ports the Node engine to TypeScript in `src/howto/engine/` and draws each plate on the phone from its spec when the sheet opens. The drawing runs in a Web Worker, inside lazy chunks.

**What B does well**

- **Fidelity can be proven byte for byte.** The plate SVG uses only class names and `var(--token)`, so the same string is correct in every theme. I re-ran the approved engine with the approved specs, spliced the guide lines in the way the gallery does, and **all 16 approved plate SVGs (8 normal, 8 mistake) came out byte-identical to the ones inside the approved `technical-plates.html`** (`_gold-check.mjs`: 16 reproduced, 0 missing). The TS port only has to reproduce the same strings, and a unit test can check that exactly.
- **Theme colours already match.** Every token the gallery shares with the app has the same value in all 5 themes (`_theme-diff.mjs`: 0 changed). The only gallery token the plates read that the app lacks is `--mistake`. The other 13 old figure tokens are in the gallery's theme blocks but no plate reads them.
- **Font already matches.** The engine measured its labels with the same Inter Variable file the app ships (md5 260c81a4…, identical to `@fontsource-variable/inter`).
- **Smallest payload.** A spec is 1.5-2.6 KB gzipped. A pre-rendered plate plus its mistake plate is 13-27 KB gzipped.

**What B costs (measured, not guessed)**

Time to render one plate, Chromium, this container. 4x throttle is about a mid-range phone and 6x a budget phone; that mapping is an estimate, so a device check is required.

| Exercise | Normal 1x | Normal 4x | Normal 6x | Mistake 4x | Mistake 6x |
|---|---|---|---|---|---|
| lateral raise (reference renderer) | 10 ms | 36 ms | 60 ms | 28 ms | 39 ms |
| lat pulldown | 81 | 367 | 476 | 147 | 192 |
| pull-up | 84 | 391 | 604 | 464 | 612 |
| hanging leg raise (+1 guide) | 118 (+86) | 468 (+533) | 675 (+765) | 518 | 737 |
| seated cable row | 96 | 547 | 706 | 140 | 184 |
| machine chest press | 227 | 733 | 1,282 | 307 | 472 |
| barbell back squat | 185 | 957 | 1,493 | 501 | 703 |
| leg press | 217 | 1,105 | 1,261 | 782 | 1,099 |
| first (cold) call, chest press | 370 | 1,333 | 1,792 | – | – |

- Plate drawing cannot meet the architecture's "first frame under 100 ms" on its own.
- The design keeps the **sheet** under that budget, because the text sections and a same-size plate frame show at once. The **plate** is drawn off the main thread and pre-drawn while the user is on the Train card. That gives an instant plate on a prewarm hit, and 0.4-1.8 s on a cold budget phone.

**Kill switch (named up front)**

- If the device check misses the plate-ready budget (section 7), B falls back to drawing at build time. That is Design A, using **the same TS engine**, so none of the port or fidelity work is thrown away.
- The fallback is card HT-5b (section 12), already scoped.

**B-only risk: floating point**

- Byte identity proven in Node and CI Chromium does not by itself prove byte identity inside the phone's WebView.
- The engine rounds every coordinate to 2 decimals, and the label search makes discrete choices from float costs.
- Mitigation: an on-device self-check (section 6.5) plus a recorded device check. Build-time rendering would not have this risk.

---

## 1. The fidelity rule and how it is met

### 1.1 What "golden" means, exactly

- **G-HTML**: `docs/howto/technical-plate/technical-plates.html` at bc0f378. It is 860,766 bytes, sha256 `e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48`. It holds, for each of the 8 exercises:
  - the normal SVG (with hidden `lead-guide` paths spliced in);
  - the mistake SVG;
  - the overlay HTML (meta, callout buttons, arc label);
  - the cue line, Trace and Mistake pills, the "Saved offline" hint, the Tells list and the tempo strip;
  - the full CSS: `PLATE_CSS` = the reference CSS plus `ENGINE_CSS`, and the card CSS.
- HT-1 copies it byte for byte to `tests/howto/golden/technical-plates.html`. `tests/howto/golden/MANIFEST.json` records the source commit, the source path and the sha256.
- The copy lives in `tests/`, so it is never bundled and ships in no chunk.
- **Important finding: bc0f378 cannot rebuild itself.**
  - `engine/plate.mjs` imports `../ref-src/plate.mjs`.
  - The Dumbbell Lateral Raise plate in the gallery comes from `ref-src/plate.mjs`, a separate hand-made renderer, not from the engine.
  - `ref-src/` is **not in bc0f378**. It exists only in this session's scratch folder (`plates2/ref-src/`).
  - The same is true of `hand.mjs`, `feelmap.mjs`, `hand-pairs.mjs`, `bodymap-parts.mjs`, `howto/end-on-inset.mjs` and the `*.howto.mjs` specs.
  - Card HT-0 freezes all of them into `claude/howto-options` before any build starts.
  - The golden itself is the HTML, so the fidelity test does not depend on the sources. The builders do.

### 1.2 Three layers of checks (all automated, all in CI)

**F1: geometry, byte-identical (vitest, Node; card HT-2, file `tests/howto/golden-plates.test.ts`)**

- For each of the 8 exercises, the TS port's output is compared byte for byte with the strings pulled out of G-HTML:
  - `renderExercise(slug)` gives `normalSvg` (guides spliced) and `mistakeSvg`;
  - `tagButtons(overlay)` gives `normalOverlay` and `mistakeOverlay`;
  - `cues`, `tells`, `tempo` and `alt` (the `aria-label` and figcaption text).
  - That is 16 SVGs, 16 overlays and 8 × 4 text fields.
- The ids and the guide splice are the gallery's own:
  - ids are `<slug-with-dashes>-n` and `-m`, and `lr-n` / `lr-m` for the lateral raise;
  - button ids are `${ex}-${mode}-${key}`;
  - the `lead-guide` splice uses `display:none` and `data-guide`.
  - So the strings must be `===`. The test prints the first differing offset and 80 characters of context.
- **The extractor is itself tested.** It must find exactly 8 `article.sheet-card` blocks and 16 `svg.plate-svg`, and the file's sha256 must equal the MANIFEST value. A broken extractor therefore fails, and can never pass empty.
- The engine report must be clean for all 16 renders (`issues.length === 0`), as the mockup required.
- Machine chest press gets its missing `measure.expect` (170 degrees drawn, reported by the engine reader). `expect` only asserts; it draws nothing, so F1 still passes. The test also checks this.
- **Determinism:** each render runs twice and the outputs must be equal.
- **Mutation proof (for the PR):**
  - change `f()` rounding to 3 decimals, and F1 fails;
  - swap two equipment z-levels, and F1 fails;
  - drop `<br>` from one callout, and F1 fails.

**F2: pixels, all 5 themes (gate block `HT-5`, Playwright Chromium)**

- The gate opens two pages at a 390 × 844 CSS px viewport, device scale 2.
  - **Golden page:** G-HTML served from a local file.
    - The Google Fonts `<link>` is removed, because CI and the app have no CDN.
    - The app's own Inter Variable woff2 is injected as `@font-face 'Inter Variable'`. It is the same file the engine measured, and the gallery's `--font` already names 'Inter Variable' first.
    - The theme is set by attribute (`#sheets[data-theme]`) and `data-motion="reduce"`, so the static end state shows.
    - The owner looked at the gallery with the Google static Inter. We compare against G-HTML rendered with the app's font. This is recorded in D-HT1. The label layout was measured on the app's font, so this is the correct reference.
  - **App page:** the built app (`www`). A seeded workout opens each exercise's How-to from the Train card.
- **Compared region:** the plate block, one element screenshot per state. It runs from the top of `.plate-fit` / `.ht-plate-fit` to the bottom of the tempo strip, and covers the plate, overlay labels, cue line, pills, Tells and tempo. That makes 716 × H device px.
- **States:**
  - (a) normal, first callout selected (the default);
  - (b) mistake;
  - (c) every other callout selected, with its guide line where one exists.
  - All in all 5 themes: 8 × 5 × (2 + extra callouts), about 150 shots.
  - (d) Trace frames at t = 0.6, 1.2, 1.8 and 2.4 s, in Silent Black and Paper, motion on. Every `document.getAnimations()` is paused and `currentTime` is set on both pages, so the frames are deterministic.
- **Diff:** in the page, with no new dependency.
  - Both PNGs are loaded into an `<canvas>` with `createImageBitmap`. The page walks `getImageData` and counts pixels whose largest channel difference is **greater than 2/255**.
  - **Threshold: 0 such pixels, and equal width and height.**
  - Both sides use the same Chromium, font file, markup and CSS values, so the expected diff is exactly 0.
  - Any non-zero count fails. The gate writes both PNGs and a diff PNG to the gate's screenshot folder for the reviewer.
- **Widths:** 390 px and 360 px. At 360 px the golden page zooms the plate to 328/358 with its own `fit()` code, and the app runs the same `fit()`. At 340 px the <350 px bleed rule is checked too.
- **Width trap caught while designing:**
  - The app's `.sheet-panel` has `padding: 16px` plus a `1px` border, so its content is 356 px wide at a 390 px viewport (styles.css:286).
  - The gallery's `.sheet-card` uses 15 px + 1 px, so its content is 358 px.
  - A plain port would draw every plate at a 0.994 zoom and fail F2 everywhere.
  - Fix: `.ht-plate-fit { margin-inline: -1px }`. That puts the plate at x = 16..374 on both pages, the exact golden spot.
  - F2 proves the fix; a static assertion (`getBoundingClientRect().width === 358` at 390 px) backs it.

**F3: DOM structure (gate block `HT-5`)**

- For every state, `figure.innerHTML` on the app page equals `figure.innerHTML` on the golden page, after both are serialised by the same browser.
- Only the wrapper class differs (`plate` vs `ht-plate`), and `innerHTML` excludes the wrapper.
- For the cue, pills, Tells and tempo, a canonical DOM comparison (tag, sorted attributes, text) must be equal. Two differences are allowed: the class prefix `ht-` and the element ids in an allow-list.
- This catches invisible regressions that F2 cannot see, such as `aria-pressed`, `aria-live`, the tempo `aria-label` and figcaption text.

### 1.3 Golden updates (the only way a plate may change)

- A plate may change only in a PR titled with `[golden update]`. That PR:
  - (1) edits `tests/howto/golden/**` and MANIFEST;
  - (2) attaches a before/after contact sheet (the gate's PNGs, all 5 themes);
  - (3) names the change in the PR body;
  - (4) gets a fresh reviewer's approval, plus the owner's for any visible change.
- Added guard (supervisor-owned, add-only check in `.github/scripts/agent-guard.sh`): a push that changes `tests/howto/golden/**` fails unless the head commit message contains `[golden update]`. This is the supervisor's call; I propose it, I do not write it.
- Engine changes made for new exercises (for example a future top view for presses) must keep all approved goldens byte-identical. F1 enforces this on every push.

### 1.4 Exactly what the new work adds

Nothing inside the plate block changes. New sections go **below** it, in the fixed order GA §2.1 sets:
- "Look closer" chips, opening the hand zoom (S2) and the posture zoom (S3);
- "Where you should feel it", with main, helper and watch muscles, the shimmer and rows;
- "Set up";
- "Handling mistakes";
- "Risks and when to stop";
- "Where this comes from".

There are two deliberate, recorded differences from the gallery, both outside the plate block:
1. **Header.** The app's `Sheet` has a close button and its own grab handle. The golden has no close button. The eyebrow "How to do it" plus the exercise name reproduce the golden typography through one new optional prop, `eyebrow?: string`, on `Sheet`.
2. **Zoom hand-off (GA R10).** S2 and S3 share the plate box, so while a zoom is open the plate box shows the zoom. The un-zoomed plate is still exactly the golden (F2 states a-d).

---

## 2. Module layout (paths)

```
src/howto/
  ids.ts                 MAIN CHUNK. HOWTO_IDS: ReadonlySet<LibId>, PUSH_HINT_IDS, hasHowTo(id). No other imports.
  types.ts               types only (erased at build). Content contract, section 4.
  archetypes.ts          hand archetypes, contact archetypes, RED_FLAG (the single red-flag wording, GA R31)
  engine/                pure TS, no DOM, no Node API (lint-tested); used by the worker, the main-thread fallback and tests
    geom.ts body.ts equipment.ts layout.ts plate.ts     port of engine/*.mjs @ bc0f378 (identical files in plates2)
    refLateralRaise.ts   port of ref-src/plate.mjs (the approved lateral raise; frozen by HT-0)
    guides.ts            guideFor / withGuides / tagButtons (from build-page.mjs:136-148 and :97-110)
    hand.ts              port of engine/hand.mjs + howto/end-on-inset.mjs
    feel.ts              pure feel-map maths: lit parts per view, band geometry, text-only ids (from feelmap.mjs)
    reprefix.ts          renames the ids of a rendered SVG for crops (proven equal to a fresh render, section 9)
    escape.ts            escapes overlay text, allowing only <br> (plate.mjs:270-271 injects it raw today)
    render.ts            renderExercise(slug, want): the one entry the worker and the fallback call
  specs/htspec_<slug>.ts  plate specs as TS modules (they hold functions), one per exercise; the worker loads them by import.meta.glob
  content/htcontent_<slug>.ts  How-to content (handling, setup, posture, feel, copy, sources) `satisfies HowTo`; the UI loads it by import.meta.glob
  worker.ts              module worker: { slug, want[] } -> { slug, normal, mistake?, hands?, crops?, hash } strings
  client.ts              worker client: in-memory result cache (Map), prewarm queue, fallback to main-thread render()
  ui/
    HowToSheet.tsx       the sheet body; section order per GA §2.1
    PlateBlock.tsx       reproduces the golden card markup: plate-fit, figures, cue line, pills, Tells, tempo
    HandZoom.tsx PostureZoom.tsx FeelMap.tsx Sections.tsx (Setup, HandlingMistakes, Risks, Sources)
    howto.css            every How-to rule, all under the root `.ht`; the plate rules are the golden CSS with `.plate` -> `.ht-plate`
src/slices/howto/lazy.tsx  copy of src/slices/share/lazy.tsx: useState(Comp), import('@/howto/ui/HowToSheet'), live flag, load-fail toast
tests/howto/**           unit tests (section 9); golden/ fixtures
```

**Chunk names** (Vite takes them from file names, so vite.config.ts does not change):

| Chunk | Contents |
|---|---|
| `HowToSheet-<hash>.js` and `.css` | the UI |
| `worker-<hash>.js` | the worker, emitted to `www/assets` |
| `render-<hash>.js` | the main-thread fallback |
| `htspec_<slug>-<hash>.js` | one plate spec |
| `htcontent_<slug>-<hash>.js` | one exercise's content |

- None of these match the FG-OFF ban `^(FormGuidePlayer|ExercisePlayer|lib_[a-z_]+)-`.
- `<slug>` is the library id without `lib_` (`barbell_back_squat`). `ids.ts` maps slug to `lib_*`.
- If Vite names the worker file differently (`worker-*` vs `worker.ts-*`), the HT-5 gate probe pins the pattern that is actually produced.

**Import direction:**
- `src/howto/**` may import `@/svg/bodyMuscles`, `@/data/muscles`, `@/ui/motion`, `@/ui/primitives` and `@/theme/themes` (types only).
- Nothing outside `src/howto/**` may import from it except:
  - `src/slices/howto/lazy.tsx` (dynamic import only);
  - `Train.tsx` (`@/howto/ids` only).
- A unit test enforces this with an import-graph walk (section 9, test U4).

---

## 3. Data flow

```
Train EntryCard (main chunk)
  | hasHowTo(ex.id)?  (ids.ts, a set of ≤153 slugs; custom exercises and ids with no content are never true)
  |-- idle prewarm: Train is visible and this card is the current exercise and requestIdleCallback fired (≥1 s after Train mounts)
  |     -> import('@/howto/client') -> worker.postMessage({ slug, want: ['normal','mistake','guides'] })   // memory cache only
  '-- tap "How to do it" (button.ht-open, 44 px)
        -> <HowToSheetLazy> (slices/howto/lazy.tsx) -> import HowToSheet chunk (+ .css)
        -> first frame: header, plate frame (358 box, surface-2, border-subtle, datum line), cue line from content,
           pills (Mistake aria-disabled until ready), tempo, all text sections
        -> client.get(slug): cache hit => plate now; miss => worker renders normal -> postMessage -> PlateBlock sets
           innerHTML (dangerouslySetInnerHTML, repo-static, escaped) -> then mistake, guides, hand pairs, posture crops
        -> import(`../content/htcontent_${slug}.ts`) (runs in parallel with the render)
Worker failure (constructor throws, error event, or no reply in 8 s)
        -> client falls back to import('@/howto/engine/render') on the main thread (same code, same output)
Chunk-load failure (offline after an update, a corrupt cache)
        -> like shareLoadFailed(): the sheet closes, toast "Could not load the guide." with a Reload action
```

- There is no persistence of any kind: no localStorage, no store field, no IndexedDB.
- The cache is a module-level `Map` that lives until the WebView reloads.
- Every open starts at S0 (GA R8).

---

## 4. Data model (TypeScript)

`types.ts` takes GA §4 as the base. Below are the interfaces this design pins. The mockup gaps (D1-D5 in the architecture report) are settled here.

```ts
export type LibId = `lib_${string}`;
export type Slug = string;                              // LibId without 'lib_'
export type ThemeId = 'silent-black' | 'paper' | 'ember' | 'emerald' | 'midnight';

// ---- plate spec (SPEC.md §4, unchanged semantics; functions allowed) ----
export type Vec3 = [number, number, number];
export interface Pose { root?: { at: Vec3; tilt?: number }; trunk?: number; neck?: number;
  scap?: { elev?: number; pro?: number }; shoulder?: { elev: number; plane?: number; rot?: number };
  elbow?: number; wrist?: number; hip?: number | { flex: number; abd?: number; rot?: number }; knee?: number; ankle?: number;
  reach?: Partial<Record<'l' | 'r', { at: Vec3; pole?: Vec3 }>>; plant?: Partial<Record<'l' | 'r', PlantTarget>>; }
export interface PlantTarget { at: Vec3; normal: Vec3; toe?: Vec3; ref?: string; pole?: Vec3 }
export type PointRef = string | Vec3 | { at: string; pose: 'start' | 'end' } | { dir: [number, number] } | 'up' | 'down' | 'forward' | 'back';
export interface EquipCtx { pose: 'start' | `ghost${number}` | 'end' | 'mistake'; start: Landmarks; mistake: boolean }
export type EquipItem = { type: EquipmentType; z?: 'back' | 'center' | 'mid' | 'front'; part?: string; [k: string]: unknown };
export interface Callout { key: string; text: string; anchor: string; cue: string;
  box?: { left: number; top: number }; prefer?: 'left' | 'right' | 'above' | 'below'; guide?: PointRef[]; zoom?: string }
export interface PlateSpec {
  id: Slug; name: string; view: 'front' | 'side'; facing?: 'right' | 'left'; viewLabel?: string;
  body?: { height: number }; camera?: { x0?: number; y0?: number; pxPerM?: number };
  poses: { start: Pose; end: Pose; via?: Pose[] };
  equipment: (EquipItem | ((lm: Landmarks, ctx: EquipCtx) => EquipItem | EquipItem[]))[];
  startParts?: string[]; ghosts?: { count?: number; parts?: string[]; opacity?: [number, number] };
  trace?: { point: string; trim?: [number, number]; samples?: number };
  measure?: { vertex: string; from: PointRef; to: PointRef; radius?: number; title: string; value: string; expect?: number; box?: unknown; prefer?: string };
  datum?: ({ y: string | number; from: PointRef | number; to: PointRef | number; mistake?: boolean } | { x: string | number; from: unknown; to: unknown; mistake?: boolean } | { line: [PointRef, PointRef]; mistake?: boolean })[];
  marks?: string[]; armsFront?: boolean;
  callouts: Callout[];                                   // ≤3; on 'push' one is "Heel of palm" at 'grip' (GA R2); a later card, never on the 8 goldens unless via a golden update
  tempo: { phase: string; s: number; move?: boolean }[];
  mistake?: { pose: Pose; parts?: string[]; guides?: MistakeGuide[]; tells: Callout[] };
  checks?: ContactCheck[]; alt: string;
}
export interface RenderedPlate { svg: string; overlay: string; cues: Callout[]; report: PlateReport }

// ---- rendered bundle posted by the worker (strings only; structured-clone safe) ----
export interface ExerciseRender {
  slug: Slug; normal: { svg: string; overlay: string }; mistake?: { svg: string; overlay: string };
  hands?: { key: string; svg: string }[]; crops?: { key: string; right: string; wrong: string }[];
  hash: Record<string, string>;                          // FNV-1a per string, for the on-device self-check (6.5)
}

// ---- evidence ----
export type EvidenceTag = 'DATA' | 'MECH' | 'CONSENSUS' | 'WEAK';
export interface Source { id: string; cite: string; url?: string; kind: 'paper' | 'book' | 'org' | 'library';
  access: 'open' | 'abstract' | 'paywalled' | 'unreachable'; checked: string /* ISO date; null not allowed (D1) */ }
export interface Claim { tags: EvidenceTag[]; sources: string[]; note?: string }

// ---- hand ----
export type HandArchetypeId = 'push' | 'pull' | 'hang' | 'hold' | 'curl' | 'on-body' | 'balance' | 'palm-flat' | 'implement' | 'none';
export type ThumbMode = 'wrapped' | 'over' | 'cupped' | 'hooked' | 'pinch' | 'flat' | 'loose';     // 'loose' added (mockup D1)
export type HandleProfile = 'round-thin' | 'round-thick' | 'barbell' | 'dumbbell' | 'cable-d' | 'rope' | 'v-bar'
  | 'lat-bar' | 'pullup-bar' | 'machine-horizontal' | 'press-vertical' | 'pulldown-bar' | 'strap';        // mockup profiles added (D1)
export interface HandPose { view: 'radial' | 'dorsal' | 'end-on'; forearm: number; wrist: { ext: number; dev?: number };
  contactAt: number; fingers?: { curl?: number }; thumb: ThumbMode; squeeze?: number;
  handle: { profile: HandleProfile; d?: number }; load: { kind: 'push' | 'pull' | 'hang' | 'hold' } }
export interface HandFault { key: string; label: string; pose: HandPose; markers: ('lever-arc' | 'slip-arrow' | 'skin-ridge' | 'tendon' | 'load-through-wrist')[];
  alt: string; why: Claim }
export interface HandlingSpec { archetype: HandArchetypeId; orientation: 'horizontal' | 'vertical' | 'neutral';
  camera: 'side' | 'above' | 'end-on'; loadAxis: 'along-forearm' | 'across'; right: HandPose; faults: HandFault[];
  thumb: { mode: ThumbMode; offerOver: boolean; page2?: boolean }; notes?: { right: string; wrong: string };
  gripLine: string; cue: string; claims: Claim[] }
export interface NoHandling { archetype: 'none'; why?: string }

// ---- posture, setup, feel, risks ----
export interface SetupStep { kind: 'seat' | 'pad' | 'pin' | 'handle' | 'feet' | 'grip' | 'brace' | 'bar' | 'get-in'; text: string; claim?: Claim }
export interface PostureCheckpoint { key: string; label: string; right: string; wrong: string; zoom?: string; claim: Claim }
export interface ZoomSpec { key: string; kind: 'hand' | 'posture'; chip: string;
  crop?: { center: PointRef; sizePx: number };           // posture: crop of the on-screen plate (GA R42)
  wrong?: { from: 'mistake' } | { still: string };        // 'still' = its own pose, rendered by the worker
  callouts?: Callout[]; caption: string /* ≤14 words */; alt: { right: string; wrong: string } }
export interface FeelRow { where: string; means: string /* ≤30 words */; fix: string /* ≤30 words, verb first */;
  at: { muscles?: MuscleId[]; parts?: BodyPartId[] }; claim: Claim }
export interface FeelSpec { primary: MuscleId[]; secondary: MuscleId[]; watch: MuscleId[] /* name 'watch', not 'avoid' (D5) */;
  side?: 'one'; feelLine: string; rows: FeelRow[]; libraryDiff?: { why: string } }
export interface Risk { key: string; text: string; claim: Claim }   // rows never hold red-flag wording; RED_FLAG is shared
export interface HowTo {
  schema: 1; id: LibId; rev: number; extends?: string;
  plate?: Slug;                                          // spec in specs/htspec_<slug>.ts; absent = Level 1 (no plate)
  handling: HandlingSpec | NoHandling; contacts: string[]; setup: SetupStep[]; posture: PostureCheckpoint[];
  handlingMistakes: { key: string; text: string; fix: string; claim: Claim }[]; risks: Risk[];
  feel: FeelSpec; zooms: ZoomSpec[] /* ≤4 */; copy: { setupLine: string; mistakeLine: string; gripLine?: string };
  sources: Source[]; level: 1 | 2;
}
```

Notes:
- Review stamps stay out of content. They go to `docs/research/howto/reviews.json` (supervisor, add-only; GA R34).
- The lever limits `{ maxRightMm: 15, minWrongMm: 20 }` stay as in `hand.mjs:41`. HT-3 must write down their reasoning (D2).
- The hand-pairs alt text "passes behind the wrist" is rewritten to "back-of-hand side" (D4). The hand pairs are not approved goldens yet, so this is allowed. See section 10.

---

## 5. Mount from the Train card

In `src/slices/workout/Train.tsx`, the smallest change, in the lane that owns Train.tsx (HT-5):

- `:12`: add `import { HowToSheetLazy } from '@/slices/howto/lazy'` and `import { hasHowTo, pushHint } from '@/howto/ids'`.
- `:616`, after the other `useState` hooks: `const [howOpen, setHowOpen] = useState(false)`. It is a new name: `guideOpen`, `hasGuide` and `btn-how-to` stay banned.
- `:770-772`, inside `.why-row` after the why toggle:
  `{ex && !ex.custom && hasHowTo(ex.id) && <button type="button" class="btn btn-quiet ht-open" onClick={() => setHowOpen(true)}>How to do it</button>}`
  - The row already wraps (`.why-row` flex-wrap, styles.css:533).
  - The 44 px minimum comes from `.btn`, and the gate asserts it.
- `:779`: the "Push with the heel of your hand." `hint muted` line, only when `pushHint(ex.id)` (GA R6). Its id list is in `ids.ts`.
- `:916`, between PlateSheet and SubstituteSheet: `{howOpen && ex && <HowToSheetLazy libId={ex.id} name={ex.name} onClose={() => setHowOpen(false)} />}`.
- Idle prewarm: a `useEffect` in EntryCard. It runs only for the current (open) exercise, only when `hasHowTo`, and only when `navigator.hardwareConcurrency > 1`. It calls `requestIdleCallback` with a 1,000 ms delay, then does `import('@/howto/client').then(c => c.prewarm(slug))`, and cancels on unmount.
- Sheet: `<Sheet title={name} eyebrow="How to do it" onClose>`. That needs one optional `eyebrow` prop in `src/ui/primitives.tsx` (flagged in the PR; the default output is unchanged).
- Android back closes the zoom first: `registerSheet('howto-zoom', close)` (GA R12).
- No change to App.tsx or main.tsx.
- In `styles.css`, only one `/* HT-5: How-to entry */` block: `.ht-open` layout and nothing else. Every other How-to rule lives in `src/howto/ui/howto.css`, which ships in the lazy CSS.

---

## 6. FG-OFF guard re-scope (exact)

**Authority and record**

- Decision **D-HT1** in `docs/COACHING-DECISIONS.md`, written by the supervisor in HT-0.
- It cites the owner's approval of 2026-09-30 and his fidelity rule, and lists every row below.
- The re-scope is split so that no PR ever lands a looser state:
  - the token part lands in HT-1, with its replacement asserts;
  - the entry part lands in HT-5, with the entry and its positive tests, in the same commit.
- The FG-OFF gate block is another task's block in an add-only file, so the supervisor's sign-off is named in the HT-5 card and flagged in the PR (the D-FGOFF1 / PR #98 precedent).

### 6.1 `tests/workout/no-form-guide.test.ts`

| Assertion today | Fate | Replacement (at least as strict for its purpose) |
|---|---|---|
| A1: Train.tsx has no `btn-how-to` | **kept** | |
| A1: Train.tsx has no `FormGuideSheet\|hasGuide\|guideOpen` | **kept** | |
| A1: styles.css has no `.btn-how-to` | **kept** | |
| A1: Train.tsx has no "How to do it" | **replaced** (HT-5) | A1': (a) Train.tsx contains "How to do it" **exactly once**, inside a `<button` whose class has `ht-open`, in a JSX expression that tests `hasHowTo(`. (b) Train.tsx imports from `@/howto/` only `@/howto/ids`, and from `@/slices/howto/` only `lazy`. (c) There is no static `import` of `@/howto/(engine\|ui\|content\|specs\|client\|worker)` anywhere in the main graph (the U4 import walk). (d) `ids.ts` holds only slugs that have both `specs/htspec_<slug>.ts` and `content/htcontent_<slug>.ts`, so no id opens an empty or wrong guide (lesson L4: the old guide played chest press for lat pulldown). |
| A2: no `src/formguide`, no `src/slices/formguide` | **kept** | |
| A2: no src file matches `/formguide\|ExercisePlayer\|FormGuidePlayer\|\.form-guide\b\|\bfg4?-/` | **kept** | Add A2+: no file under `src/howto/**` is named `lib_*`, and `src/howto/**` contains no `fg-`, `form-guide`, `rig` or `ExercisePlayer`. |
| A3: `--(mistake\|target\|help\|quiet\|pants…\|guide)` never referenced; no such theme key | **narrowed by one token** (HT-1) | A3': the ban list keeps the other **13** tokens, byte for byte. `mistake` is re-introduced as one justified token. Every theme's `mistake` must equal exactly: silent-black `#eb5757`, paper `#c0392b`, ember `#b36bff`, emerald `#f04438`, midnight `#ff5c5c` (D-FG1 semantics, the same values as the golden theme blocks). `var(--mistake)` may appear only in `src/howto/**` (and in `themes.ts` through `themeToCss`); any hit in `styles.css` or another slice fails. The contrast check C9 must pass (section 9). |

Why `--mistake` keeps its old name instead of a new one such as `--mistake-x`:
- The golden CSS reads `var(--mistake)` 10 times.
- A renamed token would be the same colour and meaning under a new name, which only gets round A3's regex. That is loosening in disguise.
- A named re-introduction, with exact values and a scope limit, is stricter than the old ban for what the ban was for: stopping the old figure palette from coming back.

### 6.2 FG-OFF gate block (`scripts/screenshot-gate.mjs:5583-5634`)

| Probe | Fate | Replacement |
|---|---|---|
| Chunk names `^(FormGuidePlayer\|ExercisePlayer\|lib_[a-z_]+)-.*\.js$` fail | **kept, unchanged** | New HT-5 probe: the set of How-to chunks is exactly `HowToSheet-*`, `worker-*` (pinned name), `render-*`, `htspec_<slug>-*` and `htcontent_<slug>-*`, one each per slug in `ids.ts`, each within budget (section 7). |
| Built JS/CSS contain none of `fg4?-[a-z]`, `form-guide`, `marc-formguide-rig`, `FormGuidePlayer` | **kept, unchanged** | The same probe also runs over the worker's rendered SVG strings for the 8 exercises (the uid prefixes must never produce `fg-`). |
| Built JS/CSS contain no `/How to do it/` | **replaced** | The string occurs in exactly two assets: `index-*.js` (the button) and `HowToSheet-*.js` (the eyebrow). Any other asset containing it fails. |
| Train A1: no `.btn-how-to`, no `.form-guide` | **kept** | |
| Train A1: no "How to do it" text on the Train page | **replaced** | In Silent Black and Paper, first card `lib_dumbbell_lateral_raise`: exactly one `button.ht-open` with accessible name "How to do it", at least 44 × 44, and a tap opens a dialog labelled with the exercise name whose eyebrow reads "How to do it". A **negative control**: a card for an exercise with no content (and a custom exercise) shows **no** `.ht-open`. |
| PASS line phrase `FG-OFF (no form-guide chunk or markup, no "How to do it" on Train) verified` | **reworded** | `FG-OFF (no old form-guide chunk, markup or tokens) verified` plus a separate HT phrase. |

### 6.3 Other guards the build must respect (none loosened)

- **theme.test QA-R7-4, styles.tokens lints.** They read only `styles.css`, so a lazy `howto.css` would escape them.
  - New test `tests/howto/css.test.ts` applies the same rules to `howto.css`:
    - every `var()` is a theme token, a `--ht-*` defined in `howto.css`, or on the existing allow list;
    - no bare time literal outside the `.ht { --ht-* }` definition block;
    - no `cubic-bezier(` outside that block;
    - `font-size` only through `var(--fs-*)`;
    - `border-radius` only through `var(--radius-*)` or a `--ht-*`.
  - The golden literals (2.4s, 2.3s, 160ms, 80ms, the 1px tempo radius, the feel band's 5.2s and 300ms, and `cubic-bezier(.45,0,.55,1)`) become `--ht-*` custom properties with the same values. The computed styles are identical, so F2 still holds.
- **UI-1.** No keyframes are named `exercise-*`. The How-to keyframes are `ht-plate-trace`, `ht-plate-ghost`, `ht-plate-fade` and `ht-feel-band`. Renaming keyframes is invisible, and F2 plus F3 confirm it.
- **The app's `.plate` chip.** Gate probe: the PlateSheet chip's computed `display`/`height`/`border-color` are equal before and after the How-to sheet has opened once (lazy CSS is global once loaded).
- **palace-anchors.** No palace registry entry is added.

---

## 7. Theme tokens, bundle and speed budgets

### 7.1 Tokens

- **Added to `ThemeTokens`:** `mistake` only (section 6.1), in all 5 themes, so theme.test's key-set check still passes.
- **Not theme tokens:** `--ht-feel-main` is defined in `howto.css` as `color-mix(in srgb, var(--accent) 75%, var(--text))`. That is the mockup's FEEL_MAIN_MIX = 25 in every theme, the same shape as `--accent-text`. The theme contract stays minimal.
- The other feel variables (`--ht-feel-from/-to/-delay/-map-h`) are local.
- Mockup page variables (`--pg-*`, `--wrap`) are never copied.
- `--o`, `--i` and `--gd` are written inline on SVG ghosts by the engine. They are golden bytes, so they are kept, and they are added to the How-to CSS lint's inline list.

### 7.2 Bundle budgets (new HT-5 gate probe on `www/assets`; bytes gzip -9 and raw)

| Asset | Measured or estimated | Budget |
|---|---|---|
| `index-*.js` (main) | 633,893 raw at fba3f37 | HT growth ≤ 3,072 raw, shown in the PR as a before/after table. The gate also enforces an absolute ceiling of 650,000 raw (a supervisor-owned number) and checks main holds no engine marker (`plate-svg`, `lead-guide`, `0.186,` Winter constant, `HowToSheet` code). |
| `worker-*.js` (engine: plate, ref lateral raise, hand, glob loader) | plate engine measured 19.8 KB gz (with a 1.5 KB CSS string that moves out), ref 4.9, hand ≈ 7 | ≤ 34 KB gz, ≤ 100 KB raw |
| `render-*.js` (main-thread fallback, same code) | same | ≤ 34 KB gz (disk only; loaded only if the worker fails) |
| `HowToSheet-*.js` | viewer, zooms, feel map, sections | ≤ 24 KB gz |
| `HowToSheet-*.css` | golden CSS about 5.5 KB raw, hand 3.6, feel 4.6, card chrome | ≤ 8 KB gz |
| `htspec_<slug>-*.js` | measured 1.5-2.6 KB gz | ≤ 4 KB gz each |
| `htcontent_<slug>-*.js` | about 3-5 KB gz estimated from the research cards | ≤ 8 KB gz each |
| All How-to assets, 8 exercises | about 120 KB gz | ≤ 200 KB gz (the old guide's cap was 150 KB gz for the whole feature; this is above it because it carries 2 engine copies and 5 new layers) |

- **Scaling to 153 exercises** (only Level 2 exercises carry a spec): at most about 1.9 MB gz under B, against about 6.9 MB gz with pre-rendered plates (Design A, about 45 KB gz each with hands and crops). This is B's main reason to exist.
- **Service worker precache.** Every asset is precached automatically (`scripts/sw-version.mjs`), so the How-to works offline with no extra code. The total budget above caps the install growth.

### 7.3 Speed budgets

| Moment | Budget | Evidence |
|---|---|---|
| App start | 0 How-to bytes requested before Train is visible and idle ≥ 1 s | gate: request log from launch to the Today screen, no `HowToSheet`, `worker` or `htspec` request |
| Tap to sheet visible (header, plate frame, text) | < 100 ms after the chunk is cached | device check (GA: set after a baseline); CI is not used for frame timing (GA R47) |
| Tap to plate drawn, prewarm hit | ≤ 150 ms | device check |
| Tap to plate drawn, cold | ≤ 1,500 ms p50 on the owner's phone | device check. CI only guards against disaster: at 4x throttle, fail above 4,000 ms (the measured worst is 1,333 cold) and log the value |
| Mistake ready after the plate | ≤ 800 ms on the owner's phone | device; the pill is `aria-disabled` with a spinner until ready |
| Main thread while rendering | engine never runs on the main thread when Worker exists | unit U4 (the UI chunk does not import the engine); gate: `longtask` observer during the open at 4x, no task > 200 ms after the chunk parses |
| Prewarm on Train | no visible jank | device: p95 frame ≤ 32 ms while scrolling Train during prewarm |

**Kill criterion.** If the cold p50 is above 1,500 ms or prewarm causes jank on the owner's phone, the supervisor starts **HT-5b** (render at build time with the same TS engine). The goldens, F1-F3 and the UI stay as they are; only `client.ts` changes to read pre-rendered strings.

**Optional speed card (only if needed):** a "baked label layout".
- The label search is about half the render time (engine profile: placeLabels 24.7%, Occ.poly 12.7%).
- Cache each spec's chosen label boxes in the spec file, so the runtime skips the search.
- Allowed only if F1 stays byte-identical.

---

## 8. Offline, accessibility, reduced motion

**Offline**
- Everything is bundled and precached. There is no fetch, no XHR and no URL loads (C17 test).
- Source links open the system browser only on tap.
- Fonts are the app's own. "Saved offline" stays as in the golden.
- Gate: go offline after load, open the How-to, and the plate renders with its F3 structure.
- Gate "build B": the chunk and worker carry over, copying the EscobarSheet probe.
- Chunk-load failure: route-abort `HowToSheet-*`, then the toast and Reload appear and the sheet closes.
- Worker blocked (`addInitScript` deletes `window.Worker`): the fallback renders the same bytes. F3 is re-run in one theme.

**Accessibility**
- The plate block reproduces the golden:
  - callouts are real buttons with `aria-pressed` and a 44 px hit area;
  - the cue line is `aria-live="polite"`;
  - the tempo is `role="img"` with a spoken label;
  - the figcaption carries the alt text;
  - in Mistake mode an X icon and sr-only "Mistake:" appear.
- The new layers follow GA R14-R18:
  - Right and Wrong are printed words plus icons (never colour alone; the Ember mistake colour is violet);
  - each zoom is a region labelled by its heading, and each half is `role="img"` with its alt;
  - the map is one `role="img"` per view, with its paths `aria-hidden`;
  - rows are buttons with `aria-expanded`;
  - focus returns to the opener on close.
- Gate C10: every control is ≥ 44 × 44 and no hotspots overlap. Gate C16: the alt, the labels and the word-plus-icon pair are all present.

**Reduced motion**
- Driven by `html[data-motion="reduce"]` and the app's `reduced()` helper, plus the golden's `prefers-reduced-motion` rule.
- Trace shows the end state at once (golden).
- Zooms crossfade in 150 ms, or show instantly per GA R11.
- The feel band is not rendered at all, backed by `.ht [data-motion=reduce] .ht-feel-band{display:none}`.
- Gate C11: with reduce on, no animation is still running after a zoom or the feel section opens, and there is no `.ht-feel-band` node.
- Gate C12: nothing is still running after `delay + passes × duration + gaps + 1 s`, computed from the exported constants, never a typed number.
- Keyframes animate only `transform` and `opacity` (C18, checked through `getAnimations()`).

---

## 9. Test strategy

**Unit tests (vitest; the files are new, so no ownership clash)**

- **U1 `tests/howto/golden-plates.test.ts`:** F1 (section 1.2), the report is clean, determinism, the chest press `expect`.
- **U2 `tests/howto/engine-purity.test.ts`:**
  - `src/howto/engine/**` uses no `document`, `window`, `node:`, `Buffer`, `structuredClone` (replaced by an explicit clone, and F1 proves it equivalent), `Math.random` or `Date`;
  - `tsc` strict passes;
  - no `any` in exported types.
- **U3 `tests/howto/escape.test.ts`:** overlay text is escaped, and only `<br>` survives.
- **U4 `tests/howto/import-graph.test.ts`:**
  - walk the static imports from `src/main.tsx`: only `src/howto/ids.ts` may be reached;
  - the `HowToSheet` graph does not reach `src/howto/engine/**`;
  - only `lazy.tsx` and `Train.tsx` import `@/howto`.
- **U5 `tests/howto/ids.test.ts`:** every id in `ids.ts` has a spec and content; every content id exists in `exercises.json` and is not custom; the push-hint ids equal the `push` archetype set.
- **U6 `tests/howto/reprefix.test.ts`:** `reprefix(render(spec, {id:'a'}).svg, 'a', 'b') === render(spec, {id:'b'}).svg` for all 8 exercises, and there are no duplicate ids across one sheet's strings (normal, mistake, crops, hands).
- **U7 `tests/howto/hand.test.ts`:**
  - byte goldens for the approved hand pairs (section 10);
  - C4 thumb rule;
  - C5 wrist, contact and lever;
  - a wrist-bend fault drawn only in the radial view.
- **U8 `tests/howto/content.test.ts`:**
  - C1 cross-field;
  - C2 muscle ids (isMuscleId; no brachialis or rotator_cuff shimmer; core text-only; nothing both primary and watch);
  - C3 hand zoom present;
  - C6 coverage (every id in `ids.ts`);
  - C7 copy lint (banned characters, words, structures and lengths, GA §6.2);
  - C8 evidence (no claim without a registry source, no `null` access or checked, no own red-flag wording);
  - C15 review-stamp hash (warn-only until O1, then enforced).
- **U9 `tests/howto/css.test.ts`:** the `howto.css` lints (section 6.3), including checking that every `.plate` selector was renamed and that nothing outside `.ht` is styled.
- **U10 `tests/howto/feel.test.ts`:**
  - `feel.ts` maths: lit parts, one-side marking, no ALIAS (brachialis is not painted on the biceps);
  - C12 timing constants.
- **`tests/theme.test.ts`, add-only block `HT-1`:**
  - `mistake` present in all 5 themes with the exact values;
  - C9 contrast from `themes.ts`: `--ht-feel-main` vs `--map-body` ≥ 3:1, `--mistake` vs `--map-body` and vs `--surface-1` ≥ 3:1, `--accent` vs `--surface-1` ≥ 3:1.
  - The contrast is computed from the real `themes.ts` values, not the mockup's stale `themes.mjs`.
- **Changed guard tests:** section 6.1, reviewed as their own diff hunk.

**Gate blocks (add-only, named per card, appended before `browser.close()`)**

- **`HT-5`:**
  - F2 and F3 across 5 themes, at 390, 360 and 340 px;
  - the chunk set and budgets;
  - app-start with no How-to requests;
  - the entry positive and negative controls;
  - offline, build B, chunk failure, worker blocked;
  - the `.plate` chip unchanged;
  - no page errors;
  - Back closes it;
  - no duplicate DOM ids;
  - the 4x-throttle disaster guard.
- **`HT-6`:** hand and posture zooms: C10 and C16, open/close focus return, Android back closes the zoom first, crossfade under reduce. Once their goldens are approved, a pixel golden for each zoom in 5 themes.
- **`HT-7`:** the feel map: C11, C12 and C18, the shimmer starts after 300 ms at 50% in view, a map tap replays it, watch shows only in S6, and a pixel golden against the approved mockup render.
- **`HT-8`:** the text sections: order, the "not medical advice" line present with the recommended wording (flagged), and "Where this comes from" collapsed by default.

**Device checks (recorded in the PR, on the exact APK)**

- **HT-5:**
  - (1) the on-device self-check: in dev mode (`marc.dev`, an existing key), a "Plate self-check" row renders the 16 golden plates and compares FNV-1a hashes against the hashes bundled in the worker chunk (16 × 8 bytes). It must read 16/16.
  - (2) plate-ready timings, cold and prewarmed, on the owner's phone.
  - (3) Train scroll during prewarm.
  - (4) the TalkBack path.
  - (5) Android system font scale at 100% and 130%. Labels are px, so the plate must stay as drawn; record this.
- **HT-6:** the owner's photo match and the 5-second test (GA R59).

---

## 10. The new layers and their goldens

The owner approved the plates. The grip, posture, feel and risk layers are the "missing" parts, and the mockup is being finished now. They follow the same rule, one step later:

1. The mockup layer is finished in plates2 and frozen into `claude/howto-options` by HT-0 (or a follow-up freeze).
2. The owner reviews that layer's contact sheet (5 themes).
3. Once he approves, the layer's output becomes golden in the same way:
   - hand pairs are pure strings, so they get byte goldens (U7);
   - the feel map is Preact, so it gets pixel goldens against the mockup page render at 390 px and device scale 2, in 5 themes, rest state plus band frames at fixed `currentTime` (gate HT-7);
   - posture crops are id-re-prefixed plate strings plus an overlay group, so they get byte goldens (U6 plus a new crop golden).
4. Until the owner approves a layer, its card may merge with the mockup output as a **provisional** golden (reviewer-approved). The layer then ships only to the owner's phone (see O1). Promoting it to approved is a `[golden update]` PR.

Posture crops at runtime:
- The right crop is the normal plate string re-prefixed to `-cr` and wrapped in an `<svg viewBox=crop>`. This is a string operation with no new render, proven equal to a fresh render by U6.
- The wrong crop is the mistake string re-prefixed to `-cw`, or a worker render of its `still` pose.

Mockup items that are text-only in v1:
- no top view (chest press start depth, lateral raise arm path);
- no front view of the 45° leg press;
- the strap drawing (A5).
These stay text checkpoints, as GA R42 says.

---

## 11. Content pipeline for 153 exercises; the 8 approved first

**Levels (GA R39)**

| Level | Entry | Contents |
|---|---|---|
| 0 | none (no `.ht-open`) | nothing |
| 1 | archetype only | hand zoom, grip line and cue, still roles map (no shimmer), setup text; no plate, rows or posture zooms; allowed only after the archetype passed review |
| 2 | full | a plate spec plus a researched card |

**Order**

1. **The 8 approved exercises, v1.** Plates come straight from the golden. Content comes from the 8 verified research cards (`docs/howto/grip-and-feel/research/*.json` @ 465ced6), with the GA Appendix A fixes applied before spec:
   - seated row: remove the citations inside its fixes;
   - lateral raise: remove the "EMG study" line;
   - squat and hanging leg raise: shorten the feel lines;
   - chest press: cut the wrist fix to ≤ 30 words and remove its own red-flag wording;
   - `front_delts` watch becomes a text row.
   HT-4 re-runs the C7 lint over all 8.
2. **Batch 2: the 26 push/press exercises** (O4, recommended).
   - The exact ids are the GA list (GA:1186-1191). The supervisor pastes them into the HT-9 card, because they cannot be derived from library fields.
   - Each needs a research card, source verification (a second agent, NCBI), coach review (O1), a plate spec in `specs/`, the engine's own checks (report clean, `expect` set, contact checks), a contact sheet in 5 themes (gate artifacts, never committed PNGs), the owner's approval, then a golden freeze (`tests/howto/golden/specs/<slug>.json`: SVG strings plus sha256) and the id added to `ids.ts`.
3. **The rest, by archetype** (pull, hang, hold, …). Level 1 stubs cover coverage (C6) until a Level 2 card exists.

**Authoring loop inside B**

- Author the spec in `src/howto/specs/`.
- Run `npx vitest run tests/howto` to see the engine report and lint.
- Run the gate locally to get the contact sheet PNGs.
- No Node-only engine copy remains; the mockup folder becomes read-only history.
- **Release gating (O1):** until paid physio and coach review happens, only exercises with a `reviews.json` stamp enter `ids.ts`, or the owner explicitly scopes a build to his phone. v1 ships the 8 to the owner's phone for his check.

---

## 12. Build cards (IDs, dependencies, lanes)

All cards share these fields:
- **base:** latest main.
- **connectivity:** offline, bundled.
- **reserved_paths:** watch files, `escobar-worker/**`, `.github/**` and signing, `package*.json`, `src/core/models.ts`, `store.ts`, migrations, `App.tsx`, `main.tsx`, `vite.config.ts`.
- **read_first:** this doc, SPEC.md, the GA doc, AGENTS.md, and the naming rules (no `lib_*` files, no `fg-`, `--mistake` scope).
- **Hard cards** (HT-2, 3, 5, 6, 7) post a design note on the PR before bulk building.
- **Reviewer:** a fresh Opus.

| Card | Outcome | depends_on | write_scope | Key acceptance |
|---|---|---|---|---|
| **HT-0** (supervisor, docs) | The mockup sources are frozen and the rules recorded | none | `claude/howto-options`: `docs/howto/technical-plate/{ref-src,engine/hand*.mjs,engine/feelmap.mjs,engine/bodymap-parts.mjs,howto/**,exercises/*.howto.mjs}`; main: `docs/COACHING-DECISIONS.md` D-HT1 | Every file `_gold-check.mjs` needs exists at a pushed commit; D-HT1 lists every row of section 6; the 26 press ids pasted; folder names OK'd; sign-off to edit the FG-OFF block given in writing |
| **HT-1** Contract, token, goldens | Types, an empty `ids.ts`, the `mistake` token under A3', the golden fixture | HT-0 | `src/howto/{types,ids,archetypes}.ts`, `src/theme/themes.ts` (+`mistake`), `tests/workout/no-form-guide.test.ts` (A3 → A3' only), `tests/theme.test.ts` block HT-1, `tests/howto/golden/**`, `tests/howto/golden-extract.ts`, `tests/howto/ids.test.ts` | Golden sha256 matches; extractor finds 8 and 16; A3' asserts exact values and scope; the 13 other tokens still banned (mutation: add `--target` somewhere → red); C9 passes; `ids.ts` empty, so no UI |
| **HT-2** Plate engine port (hard) | The TS engine draws the 8 approved plates byte-identically | HT-1 | `src/howto/engine/{geom,body,equipment,layout,plate,refLateralRaise,guides,escape,reprefix,render}.ts`, `src/howto/specs/htspec_*.ts` (8), `tests/howto/{golden-plates,engine-purity,escape,reprefix}.test.ts` | F1 16/16 plus overlays and text; report clean; determinism; purity; mutation table; bundle measurement of the engine |
| **HT-3** Hand engine port (hard) | Right and wrong hand pairs for the 8, drawn by the TS engine | HT-1 (builds in parallel with HT-2) | `src/howto/engine/hand.ts`, `src/howto/archetypes.ts` (hand part), `tests/howto/hand.test.ts`, `tests/howto/golden/hands/**` | Byte goldens against the frozen mockup (provisional until the owner approves); C4 and C5; lever reasoning written; D4 alt fix |
| **HT-4** Content for the 8 (data) | Setup, posture, handling mistakes, risks, feel, sources for the 8 | HT-1 (parallel) | `src/howto/content/htcontent_*.ts` (8), `tests/howto/content.test.ts`, `docs/research/howto/sources.json` | C1, C2, C3, C6, C7, C8 green; the Appendix A fixes applied; no GENERAL.md copy |
| **HT-5** Plate viewer and entry (hard; owns the hot files) | "How to do it" on the Train card opens the sheet with the exact approved plates | HT-2 merged; HT-4 content for the header and cue (can stub) | `src/howto/{client,worker}.ts`, `src/howto/ui/{HowToSheet,PlateBlock}.tsx`, `src/howto/ui/howto.css`, `src/slices/howto/lazy.tsx`, `Train.tsx` (section 5 lines only), `src/ui/primitives.tsx` (`eyebrow` prop), `styles.css` block HT-5, `no-form-guide.test.ts` A1 → A1', the FG-OFF gate block (sanctioned edit) plus gate block HT-5, `tests/howto/{import-graph,css}.test.ts`, `ids.ts` (fill the 8) | F2 0 px diff in 5 themes, 390/360/340 px, all states; F3 equal; budgets; start with no How-to requests; offline, build B, chunk fail, worker blocked; `.plate` chip unchanged; A1' and the gate replacements; device: self-check 16/16 and timings (kill criterion) |
| **HT-5b** (contingency) | Pre-rendered plates if the device misses the budget | HT-5 device result | `tools/plates/prerender.ts`, `src/howto/generated/**`, `client.ts` | Same F1-F3 goldens pass unchanged; the chunk budgets per exercise re-set |
| **HT-6** Hand and posture zooms (hard) | "Look closer" chips open right-and-wrong hand and posture close-ups over the plate | HT-3, HT-5 | `src/howto/ui/{HandZoom,PostureZoom}.tsx`, `howto.css` block HT-6, gate block HT-6 | S2 and S3 transitions per GA R11; Back order; C10 and C16; crop goldens; the un-zoomed plate is still F2-identical |
| **HT-7** Feel map and shimmer (hard) | "Where you should feel it" with the main muscles filled and a 2-pass shimmer outline | HT-4, HT-5 | `src/howto/engine/feel.ts`, `src/howto/ui/FeelMap.tsx` (own component in the lazy chunk, importing `@/svg/bodyMuscles`; MuscleMap is not changed, which keeps main unchanged; recorded in D-HT1 as a deviation from GA R43), `howto.css` block HT-7, `tests/howto/feel.test.ts`, gate block HT-7 | C2, C9, C11, C12, C18; watch only in S6; shimmer timing per D3 (the mockup's 5.2 s single run with the symmetric easing, recorded); pixel golden against the mockup |
| **HT-8** Text sections | Set up, Handling mistakes, Risks and red flags, Sources, the disclaimer | HT-4, HT-5 | `src/howto/ui/Sections.tsx`, `howto.css` block HT-8, gate block HT-8 | GA order; the RED_FLAG constant used; "This is coaching guidance, not medical advice." (flagged O2); evidence tags in Sources only (O3) |
| **HT-9** Presses batch (data) | 26 push exercises get plates and content | HT-5 to HT-8 merged; O1 before a wide release | `src/howto/specs/htspec_*.ts`, `src/howto/content/htcontent_*.ts`, `tests/howto/golden/specs/**` (after the owner's approval) | Engine report clean; contact sheets approved; goldens frozen; budgets per chunk |

**Lanes and pace**

- Lanes: A (HT-2 → HT-5), B (HT-3 → HT-6), C (HT-4 → HT-8), D (HT-7 after HT-4). That is 4 builders at most, matching history.
- Only HT-5 touches `Train.tsx`, `styles.css`, the FG-OFF block and the PASS line. HT-6 to HT-8 each own a separate component file plus one slot line in `HowToSheet.tsx`, which gives trivial keep-both conflicts.
- Merge order: HT-1 → HT-2 → HT-3 → HT-4 → HT-5 → HT-6 → HT-7 → HT-8, one per CI cycle (about 25 min). That is about 3.5 h of merge time after reviews, then HT-9 later.
- Before HT-5 merges, nothing is reachable (`ids.ts` is empty), and no How-to code reaches any chunk because nothing imports it. The FG-OFF A1 assertions stay untouched until then.

---

## 13. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | Runtime render too slow on real phones (measured 0.4-1.8 s at 4-6x) | Worker, prewarm, memory cache, instant text and plate frame; device kill criterion; HT-5b (same engine at build time); optional baked label layout under F1 |
| R2 | The WebView's floating point differs from Node's, so a label moves on the phone only | Rounding to 2 decimals; the on-device self-check with bundled hashes (dev mode); a recorded device check; if it ever mismatches, HT-5b removes the class of problem |
| R3 | A "close enough" port | F1 byte equality over 16 SVGs, overlays and text; F2 0-pixel diff in 5 themes and 3 widths; F3 DOM equality; goldens change only via `[golden update]` plus a reviewer and the owner |
| R4 | Golden sources not reproducible (ref-src, hand, feel only in scratch) | HT-0 freezes them; the golden itself is the committed HTML with its sha256 |
| R5 | Width trap: the app sheet gives 356 px and the plate needs 358 | `.ht-plate-fit{margin-inline:-1px}`; the F2 and width asserts |
| R6 | CSS collisions (`.plate` chip, `.hint`, `.eyebrow`, `.grow`, `.dot`) | Everything under `.ht`, the wrapper renamed `ht-plate`, the viewer uses `ht-` classes; the chip-unchanged probe; F2 catches any leak |
| R7 | FG-OFF re-scope seen as loosening | Section 6 table: every removed assert has a stricter replacement; the token and entry changes land atomically with their positives; D-HT1; supervisor sign-off |
| R8 | Main chunk or app start slowed | U4 import walk; the main-growth table; the gate's absolute ceiling and marker scan; no requests before Train is idle |
| R9 | The lazy CSS escapes the app lints | U9 applies QA-R7-4, the motion, font and radius rules to `howto.css` |
| R10 | An id with no content opens a wrong guide (the old L4 bug) | U5 plus the gate's negative control; no fallback content, ever |
| R11 | Worker blocked, or a module worker unsupported in the Capacitor WebView | Main-thread fallback with the same bytes (the gate proves it); device check on the APK |
| R12 | Specs are code (functions), so review is harder | TS types, `satisfies`, engine report checks and contact sheets per batch; specs contain no copy text beyond labels and cues, which the lint also covers |
| R13 | Content ships before professional review | O1: `ids.ts` gating by review stamp; the owner's phone only until then |
| R14 | Duplicate SVG ids when crops or hands reuse the plate | `reprefix` plus U6 plus the gate's duplicate-id probe |
| R15 | The install grows with every batch | Per-chunk and total budgets in the gate; B's per-exercise cost is about 4-12 KB gz |
| R16 | Gate time grows (about 150 extra screenshots) | Element-only shots at 716 px, in-page diff; I estimate 2-3 min extra, not measured. If it is too slow, split the pixel matrix across the two existing gate jobs by theme, never by dropping states |
