# Design A: build-time drawings for the Technical Plate "How to do it"

Planner: designer A. Scope: the plan only. Nothing in the app was edited, committed or pushed.
Base: main fba3f37 (checked: origin/main is still fba3f37). Golden reference: bc0f378 (branch claude/howto-options), `docs/howto/technical-plate/`.
Owner rule (2026-09-30, verbatim): "Make sure when we start building it. Dont lower quality and output of the technical plates, i like it right now. Only the posture, proper grips, mistakes etc, risks, highlight or shimmer muscle outline are missing."

## 0. Decisions at a glance

1. **The engine runs only at build time.** A TypeScript port lives in `scripts/howto/`. It writes one generated TS module per exercise into `src/howto/generated/`, and **those files are committed**. The app ships a thin Preact sheet. The sheet inserts the pre-rendered markup and handles taps, Trace, Mistake, zooms and the shimmer with CSS and a few DOM class toggles, exactly the way the golden gallery does.
2. **Fidelity is proved on bytes first, then on computed styles, then on pixels** (section 1):
   - the shipped plate markup is byte-identical to the golden page's markup;
   - every element in the golden block has the same computed style and box as in the golden page;
   - a 390 px CSS, DPR 2 pixel diff of 8 exercises × 5 themes × {normal, mistake} passes, plus the selected-callout states, Trace frames and 360 px.
3. **The golden output is reproducible, and I checked it.** Running bc0f378's `build-page.mjs` with `plates2/ref-src/` and the Inter woff2 added gives a `technical-plates.html` that is **byte-identical** to the committed one: md5 14d3451c013cd406f3ec813cc64f3e62, sha256 e2bea90c…dcf48, git blob 265629db. Evidence: `htplan/_repro/`.
   - bc0f378 alone cannot rebuild it: `ref-src/plate.mjs` (the hand-made lateral raise plate, sha256 9bd75197…ee52) and the font are missing from that commit. HT-1 commits them.
4. **`--mistake` comes back under its own name** as a justified re-introduction:
   - the golden CSS uses `var(--mistake)` 10 times;
   - its five values are exactly D-FG1's;
   - FG-OFF A3 stops banning only that one name and gains an exact-value assertion.
   Renaming it only to get past A3 would be exactly the "dodge the guard" the rules forbid.
5. **Where the owner rule and the GRIP-AND-FEEL draft disagree, the owner rule wins** (D-HT2, section 15):
   - no "Heel of palm" callout on the plate;
   - the push Mistake pill keeps the golden body mistake;
   - no dotted ring or hotspots on the plate;
   - new sections go **below the tempo strip**, so the golden block stays contiguous and pixel-checkable.
6. **Chunks:** one lazy shell chunk `HowToSheet-*` and one lazy chunk per exercise, `ht-<slug>-*`. The main chunk gains only an id set, the button and the loader. The old guide's `lib_*` names are never used.

## 1. The fidelity contract (how the owner rule is met)

### 1.1 What counts as "the plate"

The **golden block** is everything in a gallery card from the top of `.plate-fit` down to the bottom of `.tempo`:
- the plate SVG: dots grid, datum, floor, equipment, dashed start pose, 3 ghosts, end pose with joint marks, trace with arrow, measure arc, leaders and anchors, spliced selected-callout guides;
- the overlay: meta, callout buttons, arc label;
- the cue line, the Trace / Mistake / "Saved offline" controls, the Tells list (in mistake mode) and the tempo strip.

Behaviour counts too: callout selection (aria-pressed, leader `.on`, anchor r 1.5 to 2.5, guide shown), mistake swap, Trace timing (2.4 s path, ghosts at `data-t`/`data-th`, arrow at 2.3 s, arc at 2.4 s), the reduced-motion end state, and fit-to-width zoom (`zoom = min(1, w/358)`, 9 px bleed under 350 px).

The sheet header is not part of the golden block. The app uses its own `Sheet` header, with the same "How to do it" eyebrow above the exercise name.

### 1.2 Layer 1: byte identity (vitest, every PR)

- The generator reproduces bc0f378 `build-page.mjs` step for step, for the fragments the app ships:
  - `renderPlate` for normal and mistake;
  - `guideFor`/`withGuides` splices;
  - `tagButtons` (ids `<slug>-n-<key>`, `data-cue`);
  - figcaption alt text, the tells `<ol>` and `tempoStrip`.
  For the lateral raise it uses the ported reference plate (`refExercise`), not the newer engine spec in plates2. The approved picture is the reference plate.
- `tests/howto/plate-golden.test.ts` extracts every fragment from the committed fixture `tests/howto/golden/technical-plates.html` (the sha256 is pinned in the test). For all 8 exercises it asserts `generated === golden`, byte for byte, for:
  - normal figure inner HTML (SVG with guides, overlay, figcaption);
  - mistake figure inner HTML;
  - tells HTML;
  - tempo HTML;
  - the cue list (key, text, cue).
- **Themes:** the plate SVG holds no theme colour. I checked: `var(` never appears in it, and the only literal colours are the mask's `#fff`/`#000`. So byte identity holds in all 5 themes by construction. Theme fidelity lives only in CSS, which layers 2 and 3 check.
- **Coverage beyond the 8:** HT-2 also pins fixtures from the reference engine at bc0f378 for `_test_front`, `_test_side` and every `selected: <key>` render. A test fails if a key of `PRIMITIVES` is not covered by any fixture. Paths the 8 plates never hit are then still proved.
- **Freshness (C14):** each generated file's header holds `inputsSha256`, taken over the engine sources, the spec, the content file and the generator. A fast unit test recomputes it, so a stale file fails without re-rendering. The full regenerate-and-diff runs in the HT-2 gate block.

### 1.3 Layer 2: computed-style and box parity (gate block HT-5)

- Load the golden fixture page and the app sheet in the same Chromium. Viewport 390×844, `deviceScaleFactor: 2`, same theme.
- Fonts: route the fixture's `fonts.googleapis.com` request to an `@font-face 'Inter'` that serves the app's own `@fontsource-variable/inter` latin woff2. md5 260c81a4… is the same file the engine measured labels with in sheet.mjs. No network is used.
- Walk the golden block in both pages in document order; the markup is identical, so the nodes pair 1:1. For each node, compare:
  - the rect relative to the block origin, within ±0.01 px;
  - `getComputedStyle` for fill, stroke, stroke-width, stroke-dasharray, stroke-linecap, stroke-linejoin, opacity, fill-opacity, stroke-opacity, display, visibility, color, background-color, border-*-color/width, border-radius, font-family, font-size, font-weight, letter-spacing, line-height, text-transform, transform, zoom, pointer-events, mask, clip-path and marker-*.
  - Values must be exactly equal.
- The wrapper class names differ on purpose (`.plate` becomes `.ht-plate`, see 1.5), so class strings are not compared on wrappers. The inner markup is byte-equal anyway.

### 1.4 Layer 3: pixel diff (gate block HT-5)

- Clip the golden block in both pages. First assert that the two clips have the same CSS size, within 0.5 px.
- Screenshot both at DPR 2 and diff them in the page with canvas `getImageData`. No new dependency.
- **Threshold:** pass only if **no pixel differs by more than 24/255 in any channel, AND at most 0.02 % of pixels differ at all**. A 716 px wide block at typical height is about 600-900k px, so at most about 120-180 px may differ, and only by anti-aliasing noise.
  - The HT-5 builder reports the measured noise. I expect 0: same engine, font, CSS values and browser.
  - If real noise is above the ceiling, the builder stops and reports it. Raising the threshold is a supervisor decision, never a builder fix.
- **Matrix:**
  - 8 exercises × 5 themes × {normal with the default callout, mistake with the first tell} = 80 pairs;
  - Silent Black and Paper, each callout selected and each tell selected: about 96 pairs;
  - Trace, in 2 themes: all animations paused with `getAnimations()` and set to t = 0.6, 1.2, 1.8 and 2.4 s in both pages. 64 pairs;
  - 360 px width (zoom 0.916), in 2 themes × {N, M}: 32 pairs. At 360 the gallery card and the app sheet both give a 328 px plate box, as computed in 1.5.
  - About 270 pairs in all. Estimated at about 60-90 s of gate time, run in 4 parallel contexts. The gate today takes 784 s.
- **Mutation proof, required in the PR:** each of these must fail the check:
  - move one callout 1 px;
  - set one ghost's `--o` from .12 to .13;
  - change `--mistake` in one theme by one step;
  - drop the -1 px bleed;
  - rename `.ht-plate` back to `.plate`, so the app's plate-chip rule leaks in.

### 1.5 Keeping the app's CSS from touching the plate

- The only clashes the golden block has with app globals are:
  - `.plate`, the wrapper `<figure>`: the app's plate-sense chip is at styles.css:522;
  - gallery chrome classes the app also owns: `.eyebrow`, `.hint`, `.grow`, `.sr-only`, `.dot` (`.dot` only as `.watch-pill .dot`, so it cannot match).
  None of the SVG's inner classes collide. I checked all of them against styles.css.
- **Fix:**
  - the figure wrapper becomes `ht-plate` and the fit box becomes `ht-plate-fit`;
  - every golden selector is rewritten by one declared, tested map (`.plate` to `.ht-plate`, `.plate-fit` to `.ht-plate-fit`, `.cue-line` to `.ht-cue`, `.tells` to `.ht-tells`, `.tempo*` to `.ht-tempo*`, `.howto-pill` to `.ht-pill`, `.howto-offline` to `.ht-offline`);
  - the map is applied by the generator to the chrome fragments (tells, tempo) and by hand in howto.css;
  - a unit test proves the map is injective, touches only class tokens, and that reversing it on the shipped fragments gives the golden bytes. The SVG and overlay need no rewrite; they ship verbatim.
- **Width:**
  - The app's `.sheet-panel` content box at 390 px is 390 − 2 (border) − 32 (padding) = **356 px**. The gallery card's is 390 − 2 − 30 = **358 px**.
  - The golden block therefore sits in `.ht-golden { margin-inline: -1px }`, which makes it 358 px. At 390 px that gives a 1:1 plate; at 360 px, 328 px, the same as the gallery.
  - The layer-2 box check makes this exact.
- **Lint-compliant CSS with the same computed values:**
  - The golden CSS has bare time literals (160ms, 2.3s, 2.4s), `border-radius: 1px` and `grid-template-columns: 104px`. The app's style lints forbid the first two outside tokens.
  - howto.css declares local custom properties on `.ht` with the identical values (`--ht-trace: 2.4s`, `--ht-arrow-at: 2.3s`, `--ht-arrow-dur: 160ms`, `--radius-tick: 1px`) and reads them.
  - Layer 2 proves the computed values did not move. The lint extensions (section 11) are aimed at howto.css too.

### 1.6 Changing a plate later

- `tests/howto/golden/approved.json` holds one entry per exercise: `{slug, fragments: {normal, mistake, tells, tempo}: sha256, approvedBy, date, source}`.
  - The 8 entries are seeded from the bc0f378 fixture.
  - A test asserts that the generated fragments hash to the latest approved entry.
- Changing a plate means adding a new entry with `supersedes` and a `decision: "D-…"` reference. The fixture page is then re-rendered from the new generator and reviewed in 5 themes.
  - A unit test enforces the file as add-only: old entries are never edited, and every superseding entry names a decision.
  - The PR must title-flag "golden update", and a fresh reviewer approves it.
- **New exercises** (for example the 26 presses) join `approved.json` only after the owner approves their contact sheet. Until then their entry is `status: "draft"`, and a draft slug is not in `HOWTO_IDS`, so its entry button does not show.

## 2. Module layout

Build time (never bundled; typechecked through `scripts/**/*.ts`):
```
scripts/howto/
  engine/geom.ts body.ts equipment.ts layout.ts plate.ts   port of bc0f378 engine (types added, logic unchanged)
  engine/refplate.ts          port of plates2/ref-src/plate.mjs (lateral raise reference plate)
  engine/hand.ts endOnInset.ts crops.ts                    port of plates2 hand.mjs, howto/end-on-inset.mjs, cropPanel
  engine/plateCss.ts          REF_CSS + ENGINE_CSS strings (source for howto.css parity test only)
  page.ts                     guideFor/withGuides/tagButtons/tempoStrip/tells, exactly as build-page.mjs
  specs/<slug>.ts             8 plate specs (code: per-pose callbacks), typed PlateSpec
  generate.ts                 CLI: --all | --slug x | --check (diff vs committed) | --sheet (contact sheet)
  contactSheet.ts             review page for owner/reviewer (writes to node_modules/.cache, never committed)
scripts/build-howto.mjs       esbuild bundle of generate.ts -> node_modules/.cache/howto-gen.mjs (precedent: build-convert.mjs, "logo")
```

Runtime (the app):
```
src/howto/types.ts            content + generated types (section 4)
src/howto/archetypes.ts       hand/contact archetypes, RED_FLAG (one constant), copy templates
src/howto/entry.ts            MAIN chunk: HOWTO_IDS (approved slugs only), PUSH_HINT_IDS, hasHowTo(); no imports but types
src/howto/content/<slug>.ts   researched card as HowTo (copy, setup, posture, feel, zooms, sources); satisfies HowTo
src/howto/generated/ht-<slug>.ts   HT-GENERATED: plate fragments, crops, hand pairs + re-export of content
src/howto/generated/index.ts  LOADERS: Record<LibId, () => import('./ht-<slug>')>  (imported by the sheet only)
src/howto/feel.ts             feelMapSvg(): pure string builder over @/svg/bodyMuscles (already in main)
src/slices/howto/lazy.tsx     HowToSheet lazy wrapper (copy of share/lazy.tsx incl. load-failure toast)
src/slices/howto/HowToSheet.tsx     layout + state machine S0-S7
src/slices/howto/PlateView.tsx      golden behaviour port (select, mistake, trace, fit)
src/slices/howto/Zoom.tsx           hand + posture zooms (S2/S3)
src/slices/howto/FeelSection.tsx    feel map, legend, rows, shimmer hook (S4-S6)
src/slices/howto/TextSections.tsx   Set up, Handling mistakes, Risks and red flags, Where this comes from
src/slices/howto/howto.css          namespaced (.ht-*) golden CSS + layer CSS; imported by HowToSheet only
tests/howto/**                      unit tests + golden fixtures
docs/research/howto/<slug>.json, sources.json, reviews.json   research cards (not bundled), review stamps
```

Every new class starts with `ht-` and every file name avoids `lib_`, `fg-` and `formguide`. The header comment of the lateral raise reference plate names `src/formguide/...`. It stays in `scripts/`, which A2 does not scan, and the generator never copies it into `src/`.

## 3. Data flow

```
research card (docs/research/howto/<slug>.json, verified) --hand-written--> src/howto/content/<slug>.ts (satisfies HowTo)
plate spec (scripts/howto/specs/<slug>.ts)                                         |
            \--> generate.ts: renderPlate(N), renderPlate(M), guides, tagButtons, tells, tempo  (golden path, unchanged)
                             + crops (still renders per ZoomSpec), hand pairs (per HandlingSpec), ids prefixed <slug>-
                             + engine checks (IK, contacts, angles, labels, lever) -> any issue = exit 1
                             --> src/howto/generated/ht-<slug>.ts  (committed; header: inputsSha256, engine version)
build: vite -> index-*.js (entry.ts: ids + button)  HowToSheet-*.js/.css (shell)  ht-<slug>-*.js (per exercise)
runtime: tap "How to do it" -> import(HowToSheet) -> LOADERS[id]() -> innerHTML of the normal figure
         -> mistake figure on first Mistake tap -> zoom markup on first open -> feel map after first frame
```

The generator refuses to write if any engine report has `issues.length > 0`, if any hand check fails, or if two ids collide within one exercise.

## 4. Data model (TypeScript)

The content types follow GRIP-AND-FEEL §4. I have fixed the mockup/GA differences (D1-D5 of the arch report) here.

```ts
// src/howto/types.ts
export type LibId = `lib_${string}`;
export type Slug = string;                                   // library id without "lib_"
export type EvidenceTag = 'DATA' | 'MECH' | 'CONSENSUS' | 'WEAK';
export interface Source { id: string; cite: string; url?: string; kind: 'paper' | 'book' | 'library' | 'guide';
  access: 'open' | 'abstract' | 'paywalled' | 'unreachable'; checked: string /* ISO date, never null */ }
export interface Claim { tags: EvidenceTag[]; sources: string[]; note?: string }

export type HandArchetypeId = 'push' | 'pull' | 'hang' | 'hold' | 'curl' | 'on-body' | 'balance' | 'palm-flat' | 'implement' | 'none';
export type ThumbMode = 'wrapped' | 'over' | 'hooked' | 'cupped' | 'pinch' | 'loose' | 'none';   // 'loose' added (mockup)
export type HandleProfile = 'round-bar' | 'd-handle' | 'rope' | 'dumbbell' | 'kettlebell' | 'ez' | 'pad'
  | 'strap' | 'lever' | 'neutral-bar' | 'press-vertical' | 'pulldown-bar' | 'plate';            // mockup values added
export interface HandPose { view: 'radial' | 'end-on'; forearm: number; wrist: { ext: number; dev: number };
  contactAt: number; fingers: number; thumb: ThumbMode; squeeze: number; handle: HandleProfile; load: 'along' | 'across' }
export interface HandFault { key: string; label: string; pose: HandPose; markers: Array<'lever-arc' | 'slip-arrow' | 'skin-ridge' | 'tendon' | 'load-through-wrist'>;
  alt: string; why: Claim }
export interface HandlingSpec { archetype: Exclude<HandArchetypeId, 'none'>; orientation: 'pronated' | 'supinated' | 'neutral' | 'mixed';
  thumb: { mode: ThumbMode; why: Claim }; right: HandPose; faults: HandFault[]; gripLine: string; notes?: { right: string; wrong: string } }
export interface NoHandling { archetype: 'none'; why?: string }

export interface SetupStep { kind: 'seat' | 'pad' | 'foot' | 'grip' | 'stance' | 'bar' | 'pin' | 'range' | 'other'; text: string; claim: Claim }
export interface PostureCheckpoint { key: string; label: string; right: string; wrong: string; zoom?: string; claim: Claim }
export interface FeelRow { key: string; where: string; means: string; fix: string;         // means/fix <= 30 words
  at: { muscles?: MuscleId[]; parts?: BodyPartId[] }; showMe?: string; claim: Claim }
export interface FeelSpec { primary: MuscleId[]; secondary: MuscleId[]; watch: MuscleId[];  // 'watch' (not 'avoid')
  side: 'both' | 'one'; line: string; rows: FeelRow[]; libraryDiff?: { why: string } }
export interface ZoomSpec { key: string; kind: 'hand' | 'posture'; chip: string; caption: string;   // caption <= 14 words
  hand?: { camera: string; inset?: 'end-on'; thumbPage?: boolean };
  crop?: { center: PointRef; sizePx: number; right: 'start' | 'end' | { still: string }; wrong: 'mistake' | { still: string } };
  alt: { right: string; wrong: string } }
export interface Risk { key: string; text: string; claim: Claim }                      // exercise-specific; red flags use RED_FLAG
export interface HowTo { schema: 1; id: LibId; rev: number; extends?: LibId;
  handling: HandlingSpec | NoHandling; contacts: string[]; setup: SetupStep[]; posture: PostureCheckpoint[];
  handlingMistakes: HandFault['key'][]; risks: Risk[]; feel: FeelSpec; zooms: ZoomSpec[];        // zooms.length <= 4
  copy: { setupLine: string; mistakeLine: string; feelLine: string }; sources: Source[] }

// generated (src/howto/generated/ht-<slug>.ts)
export interface GoldenPlate {            // byte-identical to the golden gallery fragments
  normal: { html: string; cues: Array<{ key: string; text: string; cue: string }> };
  mistake: { html: string; cues: Array<{ key: string; text: string; cue: string }>; tellsHtml: string } | null;
  tempoHtml: string; name: string; view: 'side' | 'front' }
export interface ZoomArt { key: string; rightSvg: string; wrongSvg: string; pages?: string[] }  // ids prefixed <slug>-z<key>-
export interface GeneratedHowTo { schema: 1; slug: Slug; id: LibId; inputsSha256: string; plate: GoldenPlate;
  zooms: ZoomArt[]; content: HowTo | null }   // null until HT-4 content lands; the sheet then shows the golden block only
```

The plate spec types (`PlateSpec`, `Pose`, `Landmarks`, `PlateReport`) live in `scripts/howto/engine/types.ts`. They are build-time only.

`HOWTO_IDS` in `entry.ts` is generated from `approved.json`: only approved slugs get an entry button. It is a `ReadonlySet<string>` of 8 ids, about 300 B.

## 5. Sheet and mount from the Train card

### Entry (Train.tsx, in the one card that owns hot files)

- An import next to :12: `import { HowToSheet } from '@/slices/howto/lazy'` and `import { hasHowTo } from '@/howto/entry'`.
- A state next to :616: `const [howOpen, setHowOpen] = useState(false)`. New name; the old `guideOpen` stays banned.
- In the `.why-row` at :770-772, after the toggle:
  `{ex && !ex.custom && hasHowTo(ex.id) && <button type="button" class="ht-entry" onClick={() => setHowOpen(true)}><IconPlay size={18}/> How to do it</button>}`
  - At least 44×44 px.
  - The row is already flex-wrap.
- Between :916 and :917: `{howOpen && ex && <HowToSheet exerciseId={ex.id} name={ex.name} onClose={() => setHowOpen(false)} />}`.
- No App.tsx or main.tsx change.
- The push hint line (GA R6) goes in HT-6, and only for ids in both `HOWTO_IDS` and `PUSH_HINT_IDS`. That is chest press in v1.

### The sheet (the order is decided in D-HT2)

1. `Sheet` header. It needs one small optional `eyebrow?: string` prop in primitives.tsx (additive; call sites are unchanged), set to "How to do it", with the exercise name as the title.
2. **The golden block** (`.ht-golden`): plate-fit and figure(s), cue line, Trace / Mistake / Saved offline, Tells, tempo. It is unchanged from the gallery.
3. "Look closer" chip row: Hand first where the archetype has hands, except leg press; at most 4 chips; the last chip is "Where to feel it". Chips open zooms S2/S3 in the plate box.
4. "Grip": the grip line, the thumb rule, and handling mistakes, each with Right/Wrong words and icons.
5. "Where you should feel it": the feel map, a 2-entry legend, rows (3, then "Show 2 more"). S4/S5/S6.
6. "Set up": the first 3 steps, then "All steps".
7. "Risks and red flags": the exercise risks, then the one shared `RED_FLAG`, then the disclaimer line "This is coaching guidance, not medical advice." That wording is flagged pending the owner's call (O2).
8. "Where this comes from": collapsed; sources with evidence tags (O3, recommended yes).

### States

- S0-S7 as in GA §2.2.
- S1/S2/S3 share the plate box. A zoom replaces the golden figure while it is open and restores it on close. The figure DOM stays mounted and hidden, so the golden state survives.
- The zoom registers `registerSheet('howto-zoom', close)`, so Android back closes the zoom first.
- Every open starts at S0. Nothing is remembered.

### PlateView

- It sets `dangerouslySetInnerHTML` once per figure, from memoized strings; Preact never re-sets them.
- Behaviour is ported one-for-one from the golden script, by event delegation on the figure's `.plate-callout`:
  - toggle `.on` on `:scope > path.leader:not(.m)` and `circle.anchor`, and anchor r 1.5/2.5;
  - `[data-guide]` display;
  - the cue text, or in mistake mode the X icon plus sr-only "Mistake: ".
- Trace: add `.tracing` and end on `animationend`. With `reduced()` true, show the end state at once.
- Fit: a ResizeObserver sets `zoom = min(1, w/358)`.
- A unit test pins the list of golden-script behaviours. The gate's layer 2 and 3 then prove the result.

## 6. FG-OFF guard re-scope (in the HT-5 PR; D-HT1 cites the owner's approval of 2026-09-30)

Principle: every assertion that guards the old animated guide stays word for word. Only the assertions that banned *any* How-to are replaced, each by a positive assertion at least as strict for its purpose.

### tests/workout/no-form-guide.test.ts

| Assertion today | Fate | Replacement / addition |
|---|---|---|
| A1 `train` not contains `'How to do it'` | **replaced** | A1-HT: Train.tsx contains `How to do it` exactly once, inside a `<button ... class="ht-entry"` whose JSX is guarded by `hasHowTo(ex.id)` and `!ex.custom`. |
| A1 `train` not contains `'btn-how-to'` | kept, widened | No file under src contains `btn-how-to`. |
| A1 `train` not matches `/FormGuideSheet\|hasGuide\|guideOpen/` | kept, widened | The same regex over every src file. |
| A1 styles.css not contains `.btn-how-to` | kept | Also howto.css. |
| A2 (dirs, `formguide\|ExercisePlayer\|FormGuidePlayer\|\.form-guide\b\|\bfg4?-`) | **kept unchanged** | Add: `src/howto/generated/*` and `src/slices/howto/*` pass it. |
| A3 removed-token regex over src and index.html | kept for 13 names | `mistake` is removed from the list; target, help, quiet, pants, pants-hi, pants-sh, ink, iron, iron-hi, iron-sh, eye, floor and guide stay banned. |
| A3 theme keys | kept for 13 keys | Add A3-HT: `THEMES[id].tokens.mistake` equals exactly silent-black `#eb5757`, paper `#c0392b`, ember `#b36bff`, emerald `#f04438`, midnight `#ff5c5c`. `themeToCss` emits `--mistake:<that>`. `--mistake` is read only by `src/slices/howto/howto.css`, so a grep over the other src files finds nothing. |

New tests in the same file:
- **A4-HT, main-graph purity.** Walk the static imports from `src/main.tsx`, excluding `import()`. The only `src/howto/**` module reachable is `src/howto/entry.ts`. `entry.ts` has no runtime imports and is at most 2,048 B. `src/slices/howto/HowToSheet.tsx` and `src/howto/generated/**` are reachable only through `import()`.
- **A5-HT, no content means no entry.** `HOWTO_IDS` equals the approved slugs in `approved.json`. Each has a generated file and a `LOADERS` key. `LOADERS` has no extra keys. No fallback component exists (CD:765 lesson).

### scripts/screenshot-gate.mjs, FG-OFF block

This edits another task's block. It is an explicit exception, called out in the PR and signed off by the supervisor under D-HT1.

| Probe today | Fate | Replacement |
|---|---|---|
| Chunk names `^(FormGuidePlayer\|ExercisePlayer\|lib_[a-z_]+)-.*\.js$` | **kept unchanged** | none |
| Asset text probes `fg4?-`, `form-guide`, `marc-formguide-rig`, `FormGuidePlayer` | **kept unchanged** | none |
| Asset text probe `/How to do it/` over all JS and CSS | **replaced** | The literal may appear only in `index-*.js` (the button) and `HowToSheet-*.js` (the eyebrow). Any other asset that holds it fails. |
| A1 browser: no `.btn-how-to` on the card | kept | none |
| A1 browser: no "How to do it" text on Train | **replaced** | In Silent Black and Paper, the open lateral-raise card has exactly one `.ht-entry` button with the name "How to do it" and a box at least 44×44. The bench-press card (no approved content) has none. |
| A1 browser: no `.form-guide` on Train | kept | Also after the sheet opens. |
| PASS-line phrase | reworded | `FG-OFF (no old form-guide chunk, player or markup; How-to entry only where approved) verified`. |

## 7. Theme tokens

- **`--mistake`**, re-introduced in `ThemeTokens` with the 5 values above (identical to D-FG1 and to the golden themes; Ember is violet because its negative equals its accent).
  - Why the old name: the golden CSS reads `--mistake`, so the CSS text of the plate rules stays golden, and the meaning is the same.
  - A3 keeps the other 13 FG-1 tokens banned. The old guide cannot come back through them, and its code, chunks and markup stay banned by A2 and the gate.
- **`--feel-main`**: a local property on `.ht`, not a theme token: `color-mix(in srgb, var(--accent) 75%, var(--text))`. FEEL_MAIN_MIX is 25 in every theme, so no per-theme value is needed, and `themes.ts` changes by only one key.
- **Local, not tokens:** `--o`, `--i` and `--gd`, which the generated markup and PlateView set inline; `--feel-from`, `--feel-to`, `--feel-delay` and `--feel-map-h`; and the `--ht-*` timing properties from 1.5. All are defined in howto.css or set inline, and all go on the How-to lint allow list with that reason.
- **No other token changes.** Every other token the golden reads already exists in the app with identical values. I diffed the mockup's themes against the app's themes.ts, and the only differences are the 14 FG-1 keys. The styles.css token block equals the mockup's tokens.css.

## 8. Bundle and speed budget (numbers)

Measured (htplan/_golden-sizes.mjs, on the golden cards, i.e. what the app ships per exercise for the plate block):

| Exercise | Raw | gzip -9 | brotli |
|---|---|---|---|
| lateral raise | 63,784 | 12,635 | 10,028 |
| back squat | 93,624 | 21,195 | 11,341 |
| pull-up | 124,991 | 28,775 | 13,736 |
| hanging leg raise | 118,172 | 28,180 | 14,234 |
| lat pulldown | 111,985 | 24,012 | 11,938 |
| seated cable row | 117,834 | 25,618 | 12,792 |
| leg press | 94,265 | 18,191 | 10,298 |
| chest press | 100,033 | 20,268 | 10,103 |
| **all 8** | **824,688** | **176,442** (one stream) | |

- **The owner rule makes GA's 24 KB gz per-exercise budget impossible.** 4 of the 8 plate blocks alone are over it, because gzip's 32 KB window cannot share the normal and mistake geometry.
- A byte-preserving delta encoding would help: the mistake markup rebuilt at runtime into the identical string, proved by the same byte test. It is left for a later size card (HT-10) and is not in v1, to keep v1 simple.

Budgets (gate block HT-5, then raised once by HT-6 and HT-7 in their own blocks):

| Asset | v1 plates (HT-5) | With layers (after HT-7) | Basis |
|---|---|---|---|
| Main `index-*.js` | structural: A4-HT, plus a coarse ceiling of 700,000 B raw | same | 633,893 B today. The entry adds about 1 KB. |
| `HowToSheet-*.js` | ≤ 40,000 raw / 13,000 gz | ≤ 70,000 / 22,000 | component, PlateView, loaders; later zoom and feel code |
| `HowToSheet-*.css` | ≤ 16,000 raw / 4,000 gz | ≤ 30,000 / 7,000 | golden plate and sheet CSS is about 12 KB; hand and feel CSS about 8 KB (mockup) |
| each `ht-<slug>-*.js` | ≤ 140,000 raw / 32,000 gz | ≤ 280,000 / 64,000 | max measured plate 125 KB / 28.8 KB; chest press layers +109 KB raw / +28 KB gz (hand pair and inset, 2 crop zooms) |
| all How-to assets together | ≤ 1.2 MB raw / 280 KB gz | ≤ 2.4 MB raw / 560 KB gz | precache and install-size cap |

- Each ceiling is about the measured value plus 10 %. The HT-5 builder records the real numbers in the PR. A ceiling may only be lowered to fit what was measured, never raised without a supervisor decision.
- For 153 exercises, plates at this size would be about 15-35 MB raw. That is not viable. Section 12 limits plates to researched exercises, and HT-10 (delta encoding plus crop reuse) must land before any batch past about 40 plates.

Speed:
- No engine at runtime, so there is no 266 ms-per-plate label solve.
- On open: fetch two local chunks from the APK, then one `innerHTML` of the normal figure (32-47 KB).
- The mistake figure is inserted on the first Mistake tap, zoom art when a zoom first opens, and the feel map after the first frame (rAF×2), or when it scrolls within 1 viewport.
- Target: first sheet frame under 100 ms on a budget Android phone. This is a device check with a recorded baseline; frame timing is not checked in CI (GA R47).
- The gate logs the time from tap to plate (under 4× CPU throttle) as information only.

## 9. Offline

- All content is static and bundled. `sw-version.mjs` precaches every asset, so the How-to chunks work offline in the PWA. In the APK they are local files.
- No `fetch(`, XMLHttpRequest or font URL appears in any How-to chunk (C17 gate probe). The gallery's Google Fonts link and its localStorage theme key exist only in the test fixture and never ship.
- **Chunk-load failure:** the `share/lazy.tsx` pattern: close the sheet, and show the toast "Could not load the guide." with Reload. The gate probe aborts the `HowToSheet-*` request and then the `ht-<slug>-*` request, and each must show the toast with no page error.
- The build-B carry-over probe (like EscobarSheet at gate :2091) proves an already-open app can still open the How-to after an update.

## 10. Accessibility and reduced motion

- Golden a11y is kept as is:
  - callouts are real buttons with aria-pressed;
  - the figcaption carries the sr-only alt;
  - the cue line is aria-live="polite";
  - the tempo is role="img" with its spoken label;
  - in mistake mode the cue reads "Mistake: …".
- Zooms:
  - a region labelled by its heading ("Hand: right and wrong"), then the camera label;
  - each half is role="img" with alt.right or alt.wrong;
  - Right/Wrong are printed words with a tick or cross (required: Ember's mistake colour is violet);
  - focus moves to the heading on open and back to the opener on close.
- The feel map is one role="img" per view with paths aria-hidden, and every muscle is also named in text. Rows are buttons with aria-expanded.
- Every control is at least 44×44 (gate C10). The 11 px callouts come from the golden, and under 350 px they keep the golden 9 px bleed.
- **Reduced motion** (`html[data-motion="reduce"]`, the same attribute the app's `reduced()` reads):
  - Trace shows the end state at once (golden);
  - zooms crossfade over 150 ms, then 100 ms on close;
  - the zoom-to-zoom change is instant;
  - no `.feel-band` is in the DOM, backed by CSS `display: none`;
  - no smooth scroll.
- **Shimmer:**
  - one run of 5.2 s with a built-in gap, after 300 ms at 50 % in view;
  - `cubic-bezier(.45,0,.55,1)`, as a How-to motion token (D-HT3: the mockup's reason is that EASE.standard flicks);
  - transform only; never infinite;
  - tapping the map replays it.

## 11. Test strategy

### Unit tests (vitest; node environment, no DOM needed)

- `plate-golden.test.ts`: layer 1. Fixture sha256 pin; 8 × {N, M, tells, tempo, cues} byte equality; `approved.json` hash match; namespace-map round trip.
- `engine-ref.test.ts`: the reference-engine fixtures for `_test_*` and the selected renders; coverage of every `PRIMITIVES` key.
- `generated-fresh.test.ts`: the `inputsSha256` header matches the recomputed inputs. It needs no render. The full regenerate-and-diff runs in the gate.
- `ids.test.ts`: no duplicate `id=` within one exercise's shipped markup; no `fg-`, `lib_` or `formguide` in the generated files.
- `escape.test.ts`: overlay text passes the generator's escaper; only `<br>` is allowed.
  - The golden overlay already contains exactly these strings. The escaper must be the identity on them, which the byte test proves.
- `content.test.ts`: C1 (cross-field), C2 (muscle ids, no primary/watch overlap, core/brachialis/rotator_cuff text only), C3-C5 (hand rules; lever limits with the written reasoning required by D2), C7 (copy lint), C8 (every claim sourced; `access`/`checked` never null; no own red-flag wording), C16 (alt texts), R38 library diff.
- `feel.test.ts`: `feelMapSvg()` output is byte-equal to the frozen mockup `renderFeelMap` output for the 8 feel specs, with `avoid` renamed to `watch`. The shimmer constants give 5.5 s; C12 is computed from them.
- `hand-golden.test.ts` / `crop-golden.test.ts`: generated hand pairs and crops are byte-equal to the layer golden, the frozen plates2 mockup output (HT-3).
- theme.test.ts, new add-only block `HT-5`:
  - `--mistake` values;
  - C9 contrast from themes.ts: `--feel-main` vs `--map-body` ≥ 3:1, `--mistake` vs `--map-body` and `--surface-1` ≥ 3:1, `--accent` vs `--surface-1` ≥ 3:1;
  - the QA-R7-4 twin for howto.css (every var() is a token, defined in howto.css, or on a named allow list);
  - the UI-1 twin: no `exercise-` keyframes in howto.css.
- styles.tokens twin block for howto.css: no bare time literals outside `.ht` custom properties; no cubic-bezier outside them; no infinite animation; font-size only `var(--fs-*)`; radius only `var(--radius-*)`.
  - It is added as a new describe block that reads howto.css, so the existing assertions are untouched.
- no-form-guide.test.ts: section 6.

### Gate blocks (add-only, one per card; the FG-OFF edit is the single exception)

- **HT-2:** runs `howto-gen --check`: regenerate everything, byte-diff against the committed files, exit 0 required. Pure Node, about 10-30 s for 8.
- **HT-5:**
  - fidelity layers 2 and 3 (section 1);
  - entry at 44 px; open and close; Back closes it;
  - 5 themes × 360 and 390 px with no page errors and no horizontal scroll;
  - the app's plate-sense chip is unchanged: its computed style is checked before and after a How-to has been opened;
  - chunk budgets and names;
  - offline reload and build-B carry-over;
  - load-failure toast;
  - no localStorage keys other than the existing four; the saved state is unchanged byte for byte after opening, tapping, Tracing and toggling Mistake.
- **HT-6:**
  - chip order;
  - each zoom opens and closes, focus returns, Android back closes the zoom before the sheet;
  - zoom pixel parity against the layer golden (same method, same threshold);
  - C10 tap targets;
  - C18: the keyframes animate only transform and opacity.
- **HT-7:**
  - the feel map at rest: pixel parity against the layer golden;
  - the shimmer frames at t = 0.3, 1.5 and 3.0 s: pixel parity with animations paused;
  - C11 reduced motion: no running animation and no `.feel-band`;
  - C12: nothing still running after 6.5 s (computed);
  - rows expand and pause the shimmer;
  - in S6 the watch outline is dashed and unfilled.

### CI

- Everything runs in the existing jobs: `npm run check` for the vitest tests, then the gate, plus the Auckland gate.
- `package.json` gains one script, `howto:gen` = `node scripts/build-howto.mjs && node node_modules/.cache/howto-gen.mjs`. It adds no dependency (esbuild is already a devDependency) and is a supervisor-owned change.
- The generator is not part of `npm run build`, because the output is committed.

### Why commit the generated files, not generate them in CI

- Reviewers see plate diffs in the PR, which a golden update needs.
- The build and APK job need no engine, so prepare-android is untouched.
- The build stays fast.
- The drift check (HT-2 gate block) makes a stale commit impossible to merge.
- Cost: about 1.8 MB of text for 8 exercises with layers. Each golden update adds more git history.

## 12. Content pipeline

### The 8 approved exercises land first

- **Plates** (HT-2) are byte-copied behaviour of the approved gallery.
- **Layers** (HT-3, HT-4) come from the 8 verified research cards (`grip/research/*.json`), through the field mapping in arch report R40.
- Known card fixes are applied before the spec, and the first content builder re-runs the lint on all 8: seated row citations, the lateral raise "EMG study", squat and hanging leg raise feel lines too long, the chest-press wrist fix of 58 words with its own red-flag wording, and D4 "passes behind the wrist".
- The hand, crop and feel art for the 8 follows the frozen layer mockup. Exercises the mockup did not finish get the same renderer, reviewed on a contact sheet.

### Per batch, after the 8 (the recommendation is presses first, O4)

1. The research card, then a second agent verifies the sources (NCBI E-utilities).
2. A plate spec in `scripts/howto/specs/`.
3. The generator with engine checks.
4. A contact sheet in 5 themes plus reduced motion; a fresh reviewer's render review.
5. The owner approves the plates, which adds them to `approved.json`. Until then they are drafts with no entry button.
6. Content lint in CI.
7. A device check on the exact APK.

### Two more rules

- **153 coverage:**
  - Level 2 (a plate plus a researched card) is the only level that shows an entry in v1.
  - Level 1 archetype stubs (the hand zoom only) exist as data and are C6-checked, but get no entry until the owner decides whether a How-to without a plate may ship. That is a new pending item, O7. The owner approved plates, so a plate-less How-to would be a different product.
- **O1** (paid physio/coach review): until the owner decides, content ships only in builds the owner installs. The C15 review stamps in `reviews.json` are recorded but not blocking. A switch in `entry.ts` (`REVIEW_REQUIRED = false`) is documented for when the owner decides. Nothing about this is stored per user.

## 13. Build cards

Checklist order is also merge order. The cards use the AGENTS.md fields; below they are shortened to the fields that differ.

| id | outcome | depends_on | write_scope (short) | key acceptance | hard card? |
|---|---|---|---|---|---|
| **HT-1** Contract and golden | Types, archetypes and golden fixtures are in main; decisions recorded | none | `src/howto/types.ts`, `src/howto/archetypes.ts`, `tests/howto/golden/**` (fixture HTML, `approved.json`, reference outputs), `tests/howto/golden.test.ts`, `docs/COACHING-DECISIONS.md` (D-HT1..3) | A1 fixture sha256 = e2bea90c…; A2 `approved.json` seeded for 8; A3 the fixture reproduces from bc0f378 plus ref-src and font, with the command documented; A4 types compile | no. The supervisor may do it. |
| **HT-2** Plate engine port and generator | `npm run howto:gen` writes 8 plate modules byte-identical to the golden | HT-1 | `scripts/howto/engine/{geom,body,equipment,layout,plate,refplate,plateCss,types}.ts`, `scripts/howto/{page,generate}.ts`, `scripts/howto/specs/*.ts`, `scripts/build-howto.mjs`, `src/howto/generated/**`, `src/howto/entry.ts`, `tests/howto/{plate-golden,engine-ref,generated-fresh,ids,escape}.test.ts`, gate block HT-2, package.json script (supervisor OK) | 8 × N/M/tells/tempo/cues byte-equal; the reference fixtures equal; every primitive covered; an engine issue exits 1 (failure path); a stale file fails | **yes**. Design note: the port order, file by file, with the golden test green after every commit. |
| **HT-3** Layer engines (hands, crops) | Hand pairs and posture crops are generated for the 8, byte-equal to the frozen layer mockup | HT-2 (branch base), HT-1 | `scripts/howto/engine/{hand,endOnInset,crops}.ts`, generator additions, `tests/howto/{hand,crop}-golden.test.ts`, the layer golden fixture | lever checks (D2 reasoning written down); unknown view throws; ids unique | **yes** |
| **HT-4** Content for the 8 | 8 `src/howto/content/<slug>.ts` files pass C1-C8 and C16 | HT-1 | `src/howto/content/**`, `docs/research/howto/**`, `tests/howto/content.test.ts` | the copy lint fails on each banned pattern (fixture strings); C8 fails on a null access; the card fixes are applied | no |
| **HT-5** Sheet, entry, fidelity gate, guard re-scope | Opening "How to do it" on the 8 shows the approved plates, pixel-identical in 5 themes | HT-2 (HT-4 not needed: content may be null) | `src/slices/howto/{lazy,HowToSheet,PlateView}.tsx`, `howto.css` (golden part), Train.tsx (entry), primitives.tsx (`eyebrow`), `themes.ts` (`mistake`), `no-form-guide.test.ts`, theme.test.ts block HT-5, the styles.tokens twin, gate block HT-5 plus the FG-OFF block edit, D-HT1 | section 1 layers 2 and 3 over the full matrix; section 6 table; budgets; offline; load-failure toast; no new storage | **yes**, owns every hot file |
| **HT-6** Grip, posture, mistakes, risks | The zooms and the Grip, Set up, Risks and Sources sections work in the sheet | HT-3, HT-4, HT-5 | `Zoom.tsx`, `TextSections.tsx`, the howto.css `HT-6` block, the HowToSheet mount lines, the Train.tsx push hint (one line), gate block HT-6 | S2/S3 transitions and back; focus; zoom pixel parity; RED_FLAG single source; disclaimer flagged | yes (design note) |
| **HT-7** Feel map and shimmer | "Where you should feel it" with the shimmer outline, rows, reduced motion | HT-4, HT-5 | `src/howto/feel.ts`, `FeelSection.tsx`, the howto.css `HT-7` block, `tests/howto/feel.test.ts`, theme.test block HT-7 (C9), gate block HT-7 | byte parity with the mockup feel map; C9, C11 and C12; watch only in S6 | yes (design note) |
| **HT-8** Release candidate | Full regression on the finished build plus device checks; the owner's contact sheet | HT-5..HT-7 | PR evidence only; small fixes | a budget phone first frame baseline; SVG cost of the mistake plate; system font scale; 360 px; owner photo match (O6); five-second test | no |
| **HT-9** Next batch (26 presses, O4) | Specs and content for the presses as drafts; entries appear only after owner approval | HT-5 (merge), HT-4 pattern | `scripts/howto/specs/<press>.ts`, `src/howto/content/<press>.ts`, `approved.json` (drafts) | the engine check is clean; lint clean; a contact sheet for the owner | per batch |
| **HT-10** Size (before about 40 plates) | The per-exercise chunk is at least 35 % smaller with byte-identical markup | HT-5 | generator encoding plus a PlateView decode | the byte test on decoded strings is unchanged; budgets lowered | yes |

Parallel lanes:
- HT-2, HT-4 and (once HT-2 has a branch head) HT-3 build together.
- HT-5 builds against HT-2's head and merges after it.
- HT-6 and HT-7 build in parallel on HT-5's head. They touch separate files, plus one mount line each and their own CSS block.

That is 3-4 builders at once. Merges: HT-1, 2, 4, 3, 5, 6, 7, then 8. At about 26 minutes per merge, that is about 3.5 hours of merge time after review passes.

Every card's `reserved_paths` lists:
- watch files, escobar-worker, `.github/**`, signing, `models.ts`/`store.ts`/migrations, App.tsx, main.tsx;
- other cards' blocks;
- package.json (except HT-2's one script, with the supervisor's OK).

Every card's `read_first` lists the naming rules: no `lib_`, `fg-` or `formguide`, and the `ht-` prefix.

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The TS port changes a float or a string, so the plates drift | Byte test on all golden fragments after every commit; reference fixtures for untouched paths; esbuild without minify for the generator; the Node major pinned in CI (22). A supervisor call on `.nvmrc` for the exact 22.x. |
| The golden cannot be rebuilt later (bc0f378 lacks ref-src and the font) | HT-1 commits the fixture HTML (the oracle) and the reproduction recipe. ref-src becomes `refplate.ts` with its own byte test. |
| App CSS leaks into the plate (`.plate` chip, `.hint`, `.eyebrow`) | Namespacing map; computed-style parity per element; the "chip unchanged" probe. |
| 356 vs 358 px sheet width shrinks the plate by 0.6 % | `.ht-golden` −1 px bleed; the layer-2 box check at ±0.01 px. |
| Font version differs from what the owner saw (Google Inter) | The engine measured with the app's woff2 (the same md5), and both sides of the harness use it. The owner device check covers the real phone. |
| Pixel noise tempts someone to raise the threshold | The threshold is fixed in D-HT1. Raising it is a supervisor decision with evidence. The mutation table proves the check bites. |
| Chunk size (up to 280 KB raw per exercise) and install growth | Budgets per asset and in total; the mistake and zoom art inserted lazily; HT-10 before scaling; plates only for researched exercises. |
| WebView cost of the 284-element mistake SVG, with a mask | Inserted only on the first Mistake tap; device check in HT-8. |
| The CSS `zoom` behaviour differs on old WebViews (below 358 px only) | The golden uses the same method, so the harness proves 360 px in Chromium; device check at 360 px. |
| Hot-file conflicts (the gate PASS line, Train.tsx, howto.css) | One card owns each hot file; separate CSS blocks per card; keep-both merges; supervisor re-review. |
| The FG-OFF edit is seen as loosening | Section 6 table: every removed assertion has a stricter replacement in the same PR, recorded in D-HT1 with the owner's quote. |
| Content ships before a professional review (O1) | Owner-only builds until O1 is decided; review stamps recorded; the disclaimer wording is flagged (O2). |
| The engine has no general collision check | The author's `checks`, the engine issues gate, and contact-sheet review by a fresh reviewer in 5 themes. |
| `--mistake` returning revives FG-1 | Only that one token, with pinned values; the 13 others and all old code, chunks and markup stay banned. |
| Generated files edited by hand | The "HT-GENERATED, do not edit" header, the `inputsSha256` test and the gate regenerate-diff. |

## 15. Where the owner rule overrides the GRIP-AND-FEEL draft (D-HT2)

- **GA R2** (push: one callout is always "Heel of palm") would change the chest-press plate's callouts. Instead, the heel-of-palm cue goes in the hand zoom, the Grip section and the EntryCard hint.
- **GA R3** (push: the Mistake pill shows the wrist fault) would change the approved Mistake view. Instead, the golden Mistake stays, and the wrist fault is the hand zoom's Wrong half plus a Grip "handling mistakes" row.
- **GA R15-R16** (hotspots and a dotted hand ring on the plate) would add pixels to the plate and compete with callout taps. Instead, zooms open from the chip row, which GA already names as the guaranteed path.
- **GA R1 order** (chips between the pills and the tempo) would split the golden block. The chips move to just below the tempo, so the golden block stays one contiguous region.
- **GA 24 KB gz per exercise** cannot be met without changing the plate bytes. It is replaced by the measured budgets in section 8.

## 16. Evidence I ran (in htplan/)

- `_repro/`: bc0f378 engine, specs and build-page, plus plates2 `ref-src/` and the woff2, gives `technical-plates.html` byte-identical to bc0f378 (`cmp` clean).
- `_cmp-themes.mjs`: the mockup themes vs the app themes.ts. The only differences are the 14 FG-1 keys. The token block in styles.css equals tokens.css (empty diff).
- `_golden-sizes.mjs`: the per-exercise golden block sizes in section 8.
- Golden SVG scan:
  - 16 plate SVGs, with no `var(` and no theme colour (only the mask's `#fff`/`#000`);
  - no `fg-` ids and no "How to do it" inside the SVGs;
  - golden class names checked against the app's global selectors: the only real collision is `.plate`.
- The font: the plates2 woff2 and the app's `@fontsource-variable/inter` latin woff2 have the same md5, 260c81a4….
