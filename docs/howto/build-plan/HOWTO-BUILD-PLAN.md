# How-to build plan: the Technical Plate in the app

Status: plan only. Nothing edited, committed or pushed. Base: main `fba3f37`.
Golden reference: `claude/howto-options` @ `bc0f378`, `docs/howto/technical-plate/` (the approved gallery).
Owner authority: "Then start building. U got my approval." and the fidelity rule, both 2026-09-30:
"Dont lower quality and output of the technical plates, i like it right now. Only the posture, proper grips, mistakes etc, risks, highlight or shimmer muscle outline are missing."
Cards: `htplan/cards/HT-1.md` … `HT-10.md`, plus `HT-3b.md`.
Revision: critic fixes 1-23 applied (2026-09-30). Each fix is tagged "critic fix N" where it lands.

---

## 1. Decision

**Chosen: design C, "hybrid".** Judge totals: C 9 + 7.5 + 8.5 = **25**, A 8 + 8.5 + 8 = 24.5, B 2 + 5 + 4 = 11. No tie. C also won the product lens (judge 3: fidelity and speed to the owner's phone).

**What it means in plain words.** The app does not redraw the plates. The approved drawing code is copied into the repo exactly as it is, locked by hashes, and run only when we build. It writes the finished drawings as text that ships inside the app. The phone just shows that text, colours it with the theme, and plays Trace. So what the owner sees on the phone is, byte for byte, what he approved in the gallery. Nobody ports or "simplifies" anything. I re-checked the key fact: the engine and 7 specs in the scratchpad still match `bc0f378` byte for byte. `bc0f378` plus the scratchpad `ref-src` rebuilds the gallery exactly (sha256 `e2bea90c…dcf48`).

**Why C over A.** A ports the engine (about 1,600 lines) to TypeScript and then has to prove the port byte for byte. That is slower, adds drift risk, and it sits on the path to the owner's first plates. C ships the same bytes with no port. B draws on the phone, so it cannot prove the owner rule on his device, and it is 10 to 25 times slower to show a plate.

**Grafted from A:**
- The "Look closer" chips go **below** the tempo strip. The approved block (plate top to tempo bottom) then stays one piece that we check pixel for pixel. This fixes C's one inconsistency.
- A computed-style and box parity walk (L2b). It names the leaking CSS rule when a pixel check fails.
- Hashes per exercise in an add-only `GOLDEN.json` with `supersedes` and a decision id, so one batch cannot quietly move an older plate.
- Reference fixtures for engine paths the 8 plates never use.
- An `inputsSha256` header in every generated file, so a stale file fails fast.
- The feel map mounts after the first frame; zoom art is inserted on first open.
- Budget ceilings: the measured value + 10 %, never raised without a decision. `ids.ts` ≤ 2,048 B.
- The later delta-encoding size card (queued, required before about 40 plates).
- Content is typed (`HowToContent`), but it is **generated** from the vendored golden-B `*.howto.mjs`, never typed a second time. One source, so the app text cannot drift from the mockup (critic fix 5).

**Grafted from B:**
- The How-to's own footprint in main is capped at 3,072 B (esbuild-minified `ids.ts` + `lazy.tsx`). An app-wide main ceiling is a separate supervisor decision, S-5 (critic fix 13).
- A DOM and aria equality check (F3) for the cue line, pills, tells and tempo.
- A 340 px pass.
- A probe that no How-to chunk loads before Train is idle.
- A long-task watch while the sheet opens.
- A hard tap-to-plate guard.
- A custom exercise as a second "no button" control.
- The layer sources frozen at a pushed commit before any layer card.

**New, from the judge's measurement:** the shimmer band is not compositor-only in Chromium (about 980 ms of main-thread work over its 5.5 s run at 4x CPU throttle, against 283 ms idle). The app must not add to that cost, and it must not behave differently from the mockup (critic fix 4). So:
- the app ships golden B's feel behaviour as it is: both views' bands play together, one `role=img` on the whole map (read once), `display:none` for the band under reduced motion;
- "pause when scrolled out of view" is an S-2 entry condition for the mockup; it ships only if golden B has it;
- a gate tripwire: the app's shimmer main-thread time is ≤ 1.2 × the golden-B page's, measured in the same harness and job;
- a recorded frame-time check on a budget phone.

---

## 2. Architecture of the in-app How-to

### 2.1 Principle
All geometry is computed at build time, with the verbatim approved engine. The phone does four things: it inserts pre-rendered strings, holds state, lets the theme CSS colour the plate, and plays CSS animation. The plate SVGs contain no `var(` and no theme colour (only the mask's `#fff`/`#000`). So one string is correct in all 5 themes. Theme fidelity lives in CSS, and L2b/L3 prove it.

### 2.2 Module layout
```
tools/plates/                      build time only, never bundled (Node 22, esbuild already a devDependency)
  vendor/                          VERBATIM from bc0f378 + pinned ref-src; MANIFEST.json {path: sha256, source} (HT-1)
    engine/*.mjs, tokens.css, SPEC.md, exercises/*.mjs (7 + _test_front/_test_side), ref-src/{plate,themes}.mjs, build-page.mjs
  layers/                          VERBATIM from the golden-B commit: hand.mjs, hand-pairs.mjs, end-on-inset.mjs, feelmap.mjs,
                                   bodymap-parts.mjs, the shared RED_FLAG/DISCLAIMER module, <slug>.howto.mjs, howto/render-*.mjs,
                                   the layer page builder; own MANIFEST (HT-4)
  plates.json                      id -> { src: 'exercises/<file>.mjs' | 'ref-src', slug, prefix, chromeId } (HT-2)
                                   e.g. lateral raise: src ref-src, slug dumbbell-lateral-raise, prefix lr, chromeId lateral-raise
  golden.mjs                       temp mirror + build-page -> gallery; extracts per-exercise fragments (HT-1)
  generate.mjs, lib/**             core (HT-2): finds plugins by glob tools/plates/gen/*.mjs (no registry line to edit);
                                   --check = regenerate in memory and diff; writes each output's own inputsSha256
  gen/plates.mjs (HT-2) · gen/content.mjs (HT-5) · gen/hands.mjs (HT-6) · gen/zooms.mjs (HT-7) · gen/feel.mjs (HT-8)
  css.mjs                          golden CSS -> src/slices/howto/css/plate.css (tested mechanical rewrite) (HT-2)
  fidelity/harness.mjs             Playwright helpers: font routing, width asserts, canvas diff, L2b walk, F3 DOM compare, L4 anims (HT-1, HT-3)
  fidelity/perf.mjs                CPU throttle, long-task and TaskDuration helpers (HT-3b; reused by HT-8, HT-10)
  fidelity/goldenB.mjs             golden-B page state driver: open a hand/posture zoom, a feel row, a section (HT-4); layer cards only call it
src/howto/
  types.ts                         LibId, PlateFigure, BuiltPlate, GoldenEntry (HT-1); BuiltHowTo with optional layer fields (HT-2)
  content-types.ts                 HowToContent + parts (HT-4, from GA section 4 + the frozen golden-B *.howto.mjs)
  ids.ts                           GENERATED, the only How-to module in MAIN, <= 2,048 B: HOWTO_IDS, HOWTO_LABEL, hasHowTo() (HT-2);
                                   HOWTO_HINTS, the push grip hint per id, from golden B's handling.cue (HT-5)
  archetypes.ts                    GENERATED from golden B's shared module: RED_FLAG, DISCLAIMER (O2, flagged); no SHOW_EVIDENCE (LR-23) (HT-5)
  generated/index.ts               GENERATED LOADERS: Record<LibId, () => import('./ht-<slug>')>
  generated/ht-<slug>.ts           GENERATED base chunk: plate strings, tells, tempo, cues, alt (HT-2); section text and descriptors (HT-5)
  generated/ht-<slug>-zoom.ts      GENERATED posture crops, extracted from the golden-B build (HT-7)
  generated/ht-<slug>-feel.ts      GENERATED feel-map states, pre-rendered by the vendored feelmap.mjs (HT-8)
  generated/hand-<key>.ts          GENERATED hand pair SVG, shared by key (3 distinct pairs today) (HT-6)
src/slices/howto/
  lazy.tsx                         MAIN: HowToSheet wrapper (copy of share/lazy.tsx) + howToLoadFailed toast
  HowToSheet.tsx                   lazy shell: Sheet, section order, S0-S7 state
  PlateView.tsx, usePlateState.ts  inserts golden strings once; line-for-line port of the gallery's ~60-line script;
                                   owns the zoom slot API (HT-3, section 2.5)
  sections/index.ts                ordered section registry (one line per card; keep both sides on merge)
  zoom/ZoomHost.tsx, zoom/registry.ts   zoom states S2/S3 inside HT-3's zoom slot; Android back closes the zoom first (HT-6)
  sections/{LookCloser,Hand,HandlingMistakes,Posture,Feel,Setup,Risks}.tsx
  feel/useFeelMap.ts               line-for-line port of golden B's FEEL_JS (a behaviour list pins it); no SVG is built at runtime (HT-8)
  css/plate.css, css/feel.css (GENERATED), css/{sheet,hand,posture,text}.css   all selectors under .ht
```
Chunk names come from file names: `HowToSheet-*`, `ht-<slug>-*`, `hand-<key>-*`. None matches the old-guide ban `^(FormGuidePlayer|ExercisePlayer|lib_[a-z_]+)-`, so vite.config does not change. The chunk slug is the id without `lib_`, with `_` replaced by `-`. It is **not** always the golden's id prefix: the lateral raise uses `lr-n-…` in its SVG and `lateral-raise-…` in its chrome. So `plates.json` records `prefix` and `chromeId` per exercise, and every id stays exactly as in the golden (critic fix 18).

**Generated-file ownership (critic fix 7).** No card edits a registry line: plugins are found by glob. Each generated file carries an `inputsSha256` over **its own inputs only**: the core (`generate.mjs`, `lib/**`), the vendored files it reads, and the plugins that write it. Adding `hands.mjs` or `zooms.mjs` therefore stales no other file. Writers per file: `ht-<slug>.ts` and `ids.ts` = plates (HT-2), then content (HT-5), which are sequential; every other generated file has exactly one writer. The core is frozen after HT-2; a change to it is its own small PR that regenerates everything.

### 2.3 Data model (summary; full types on the cards)
- `BuiltHowTo` (defined by HT-2 in `types.ts`, layer fields optional until their card lands; every generated file ends in `satisfies BuiltHowTo`, so tsc checks the generator's output) has these fields:
  - `schema`, `id`, `name`;
  - `hashes {inputsSha256, golden}`;
  - `plate {view, normal: PlateFigure, mistake: PlateFigure, tells, tempo, alt, mistakeAlt}`;
  - `zooms`, `feel`, `setup`, `posture`, `mistakes` (handling), `risks`, `sources`, `copy`.
- `PlateFigure = {svg, overlay, firstKey, cues[]}`. These are exact strings from the golden. The phone never re-serializes them.
- `HowToContent` (generated by HT-5 from the vendored golden-B `*.howto.mjs`; nobody types the content twice) is the GA section 4 model: `HandlingSpec`/`NoHandling`, `SetupStep`, `PostureCheckpoint`, `HandlingMistake`, `Risk`, `FeelSpec`, `ZoomSpec` and `Claim`/`Source`. It has no `plate` field: plate identity is golden data in `tools/plates/plates.json`. Body-part ids are strings, checked against `FRONT_PARTS`/`BACK_PARTS` (C2), because `bodyMuscles.ts` exports no id union.
- No stored data. No store field, no localStorage key, no sent data. Every open starts at S0.

### 2.4 Mount point and sheet order
- **Train.tsx** (the smallest change, HT-3):
  - one import line at `:12`;
  - `const [howToOpen, setHowToOpen] = useState(false)` in `EntryCard` (not `guideOpen`, which stays banned);
  - in `.why-row` (`:770-772`): `{ex && !ex.custom && hasHowTo(ex.id) && <button type="button" class="ht-entry" …><IconPlay size={18}/> {HOWTO_LABEL}</button>}`;
  - between `:916` and `:917`: `{howToOpen && ex && <HowToSheet …/>}`;
  - HT-6 adds one more line, the push grip hint: `{ex && !ex.custom && HOWTO_HINTS[ex.id] && <p class="hint muted">{HOWTO_HINTS[ex.id]}</p>}`. The text comes from `ids.ts`, never typed in TSX (critic fix 8).
- `Sheet` gets optional `eyebrow?: string` and `class?: string` props (primitives.tsx, additive, called out). The header (an `h2`, the Close X, centred) is **app chrome** by D-HT2; the golden's head is an `h3` with an eyebrow, `align-items:flex-end`, no Close. HT-3 styles only the eyebrow and title text, under the `ht-sheet` class, so their computed text styles equal the golden's `.sheet-eyebrow` and `h3` (L2b, critic fix 17).
- styles.css gets one `/* HT-3 */` block for `.ht-entry` only. No App.tsx or main.tsx change.
- **Sheet order:**
  1. `Sheet` header: eyebrow "How to do it", title = the exercise name.
  2. **The golden block**, untouched, inside one `.ht-golden` wrapper: plate-fit and figure, cue line, Trace / Mistake / Saved offline, Tells, tempo.
  3. "Look closer" chips: Hand first for hand archetypes except leg press; at most 4; "Where to feel it" last.
  4. Grip line and thumb rule, then "Common handling mistakes".
  5. "Where you should feel it".
  6. "Set up": 3 steps, then "All steps".
  7. "Risks and when to stop": the exercise risks, the shared red-flag blocks, then the DISCLAIMER, once and last.
  No sources, evidence labels or contacts are shown (owner decision LR-23, 2026-09-30); they stay in the data.
  Final placement inside 3-7 follows golden B. Items 1-2 are fixed by the owner rule.
- **Zooms** (S2 hand, S3 posture) take the plate box's place through HT-3's **zoom slot API** (critic fix 11): `setPlateHidden(bool)` sets `hidden` and `inert` on the plate box, so TalkBack skips it; `clearMistake()`; `snapshot()` / `restore(s)` of the plate state; and a slot element in the plate box. HT-3 fixes the API in its design note and unit-tests it; HT-6 and HT-7 only call it. The golden figure stays mounted, so closing the zoom restores the plate exactly (L3 re-check).
- **The owner rule overrides GRIP-AND-FEEL (D-HT2):**
  - the approved chest-press callouts stay ("Elbows 45°" included). The mockup's override (`machine_chest_press.howto.mjs:216-225`: "Heel of palm", "Blades on pad", "Handles mid-chest") is removed **in the mockup** before S-2, not only in the app (critic fix 2). "Heel of palm" becomes the Hand chip caption;
  - the Mistake pill keeps the approved body mistake (the wrist fault is the hand zoom's Wrong panel);
  - no hotspots and no dotted ring on the plate;
  - the 24 KB gz per-exercise budget becomes 36 KB, because 4 approved plates alone are 24-29 KB gz;
  - the feel map is its own component (MuscleMap is untouched);
  - the feel map follows golden B exactly: timing, both bands together, one `role=img`, reduced motion (critic fix 4);
  - the sheet header is app chrome (above).

### 2.5 Runtime and speed
- The normal figure gets `dangerouslySetInnerHTML` **once** (memoised; Preact never re-sets it). The precedent is `src/ui/Logo.tsx`.
- The mistake figure is inserted on the first Mistake tap.
- Zoom art (hand chunks, still crops) loads and is inserted on first open.
- The feel map mounts after two `requestAnimationFrame`s, or when it comes within one viewport (IntersectionObserver), whichever is later. Mounting happens before the map is seen, so it changes no pixel or timing that golden B shows.
- **Feel map and shimmer (critic fix 4):**
  - every state's markup is pre-rendered at build time by the vendored `renderFeelMap` (rest, playing, each row open, reduced motion) and inserted as a string, like the plates. There is no TypeScript port of `feelmap.mjs`;
  - `FEEL_CSS` goes through the same tested rewrite as the plate CSS;
  - golden B's `FEEL_JS` (play, replay on tap, row open) is reproduced line for line in `useFeelMap.ts`, pinned by a behaviour list, like `usePlateState`;
  - nothing is added that golden B does not do: both bands play together, one `role=img`, and the band gets `display:none` under reduced motion (so it has no running animation);
  - it runs once for 5.5 s (2 passes) and never loops; transform and opacity only.
- **Trace:** 2.4 s path, arrow at 2.3 s, then it ends. Reduced motion shows the end state at once (the golden rule).
- **Fit (critic fix 1):** golden `zoom = min(1, w/358)` via ResizeObserver, and the golden rules untouched, including its `.plate-fit { margin-inline: -9px }` below 350 px. Everything from plate top to tempo bottom sits in **one** wrapper, `.ht-golden { margin-inline: -1px }`. The app's `.sheet-panel` (styles.css:286) has 16 px padding plus a 1 px border; the golden `.sheet-card` has 15 px plus 1 px. Without the bleed the whole block (plate, cue line, controls, tells, tempo) would be 356 px wide instead of 358. With it, every part gets the golden's width at every viewport width, and the golden's own 9 px bleed then works unchanged.
- **App start is untouched:** no How-to code in main except `ids.ts` and `lazy.tsx`, and no prefetch.

### 2.6 Tokens and CSS
- **One new theme token, `mistake`, with the D-FG1 values:**

  | Theme | `--mistake` |
  |---|---|
  | silent-black | `#eb5757` |
  | paper | `#c0392b` |
  | ember | `#b36bff` |
  | emerald | `#f04438` |
  | midnight | `#ff5c5c` |

  It is readable only under `src/slices/howto/**`.
- Every other value is an `--ht-*` local on `.ht`, with values identical to the golden:
  - `--ht-feel-main: color-mix(in srgb, var(--accent) 75%, var(--text))`;
  - the Trace timings;
  - `border-radius: 1px`.
- **`css.mjs` rewrites the golden CSS mechanically, with a unit test for each rule:**
  - `.plate` → `.ht-plate` and `.plate-fit` → `.ht-plate-fit` (the only clash is the app's `.plate` chip at styles.css:522; I checked that `.tempo`, `.tells`, `.cue-line`, `.howto-*`, `.leader`, `.anchor` and `.tracing` are unused in the app);
  - a `.ht ` prefix on every selector;
  - page-only rules dropped (the app's equal rules apply);
  - lint-banned literals moved into one `ht-tokens` block with identical values.
- **`tests/howto/css.test.ts` applies the app's style lints to `src/slices/howto/css/*.css`** (today's lints only read styles.css):
  - token-only `var()`;
  - times and beziers only inside ht-tokens;
  - font sizes from `--fs-*` or ht-tokens;
  - radius from `--radius-*` or ht-tokens;
  - no `infinite`;
  - no `exercise-*` keyframes;
  - every selector starts with `.ht`;
  - inline custom properties in `style=""` come from an enumerated allow list, like the QA-R7-4 inline set: `--o`, `--i`, `--gd`, `--feel-from`, `--feel-to`, `--feel-delay` (the golden's and golden B's own). Any other name fails (critic fix 21).
- **`css.mjs` drops the golden's per-theme blocks.** They define the 13 still-banned FG tokens 5 times each without reading them. A test asserts that none of the 13 names appears in any generated CSS (critic fix 22).
- **Theme coupling test** (HT-2, fast unit test): every token that the generated CSS reads through `var()` has the same value in `src/theme/themes.ts` as in the vendored `ref-src/themes.mjs`, per theme. A failure names the token and the theme. A theme change that touches the plate then goes through a golden update, instead of surfacing as an L3 failure in an unrelated PR (critic fix 16).

### 2.7 Fidelity contract (the owner rule, proven at every link)
| Layer | Claim | Check | Where |
|---|---|---|---|
| L0 | The vendored sources and the font are the approved ones | sha256 of each file in `vendor/` and `layers/` against its MANIFEST (bc0f378 blob, ref-src md5 `31e7bfe3…`/`37495b3d…`, golden-B blob); sha256 of `node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2` = `3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62` (md5 `260c81a4…`, fontsource 5.3.0). A font update would move both sides of L3 together, so it must fail here (critic fix 14) | vitest |
| L1 | They still rebuild the approved gallery | temp mirror + app woff2, run `build-page.mjs`, sha256 == `e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48` (860,766 B); golden-B page likewise; `generate --check` gives an empty diff | gate block HT-2 (runs once per gate job, not 4× in vitest) |
| L2 | The app ships the golden bytes | for each of the 8: normal svg (guides spliced), tagged overlay, mistake svg, mistake overlay, tells, tempo, cues, alt, mistake alt, compared with `===` to the fragments extracted from the committed golden fixture; each fragment's sha256 equals its latest `GOLDEN.json` entry; `inputsSha256` header is fresh | vitest |
| L2b | App CSS does not leak | walk the golden block in both pages node by node: rect ±0.01 px, plus an exact list of computed properties (fill, stroke*, opacity*, display, visibility, color, background-color, border*, font-*, letter-spacing, line-height, transform, zoom, pointer-events, mask, clip-path, marker-*). Also the sheet eyebrow and title: their text properties equal the golden's `.sheet-eyebrow` and `h3` (critic fix 17) | gate HT-3 |
| F3 | Chrome markup and aria are the golden's | the figure's innerHTML equals the golden's; canonical DOM (tag, attributes except the 2 mapped wrapper classes, text) of cue line, pills, tells, tempo equals the golden's, including aria-pressed, aria-live, the tempo aria-label and the figcaption | gate HT-3 |
| L3 | It draws the same pixels | 390×844, DPR 2, region = the `.ht-golden` box (plate top to tempo bottom). Matrix: 8 × 5 themes × {normal with the default callout, mistake with the first tell}; every callout and tell selected in Silent Black and Paper; 360 px and 340 px (bleed) in 2 themes × {N, M}. **Pass: no channel off by more than 1/255, and at most 0.02 % of pixels off by exactly 1.** Before comparing, `.ht-golden` and `.ht-plate-fit` must equal the golden's card-content and `.plate-fit` widths exactly (358.0 px at 390 with zoom 1; also at 360 and 340), and the region sizes must be equal. Captures wait for `getAnimations().length === 0` on the sheet. The golden rendered twice must give 0 px. | gate HT-3 |
| L4 | Trace plays the same | the `getAnimations()` list of the traced figure (target, keyframes, duration, delay, easing, fill) equals the golden's; paused frames at t = 0.6 / 1.2 / 1.8 s in Silent Black and Paper; the t = 2.4 s end frame and the reduced-motion end state as L3 pixel checks for all 8 × 5 themes, so Trace colours are proven in every theme (critic fix 15) | gate HT-3 |

- **Only one declared normalisation:** both pages load the app's Inter woff2 (md5 `260c81a4…`, the same file the engine measured labels with). The golden's Google Fonts request is routed, so the golden HTML bytes are unchanged.
- **Every mutation below must make the check fail** (table required in the HT-3 PR):
  - a callout moved 1 px;
  - a ghost `--o` changed from .12 to .13;
  - `--text-3` in Paper changed by 1 step;
  - `--mistake` in one theme changed by 1 step;
  - the `.ht-golden` bleed dropped (the cue line and tempo then measure 356 px);
  - the woff2 swapped for another fontsource build (L0);
  - one Paper token that the plate CSS reads changed in `themes.ts` (theme coupling test);
  - `.ht-plate` renamed back to `.plate`;
  - a mistake SVG swapped with another exercise's.
- **Standard criterion G0 on every card from HT-2 on:** "approved plates unchanged against golden":
  - L0 and L2 green;
  - from HT-3 on, the HT-3 gate block green on the PR head;
  - no path changed under `tests/howto/golden/**`, `tools/plates/vendor/**` or `tools/plates/layers/**` unless the card says so.

### 2.8 Golden update procedure (D-HT3)
A plate changes only in this order:
1. a spec or engine change in the vendored folder;
2. a regenerated gallery;
3. the owner sees the contact sheet;
4. a new pinned commit on `claude/howto-options`;
5. an add-only `GOLDEN.json` entry `{kind, slug, ref, pageSha256, fragments{…}, approvedBy, date, why, supersedes, decision}`;
6. a reviewer's sign-off, with "golden update" in the PR title.

A unit test checks that `GOLDEN.json` is a hash chain: each entry carries the sha256 of the entries before it, so an edited old entry fails. It also checks that every superseding entry names a decision. The supervisor adds (add-only, in `.github`) an agent-guard check: every **non-merge** commit in `merge-base(origin/main, HEAD)..HEAD` that touches `tests/howto/golden/**` or `tools/plates/{vendor,layers}/**` must carry `[golden update]` in its message (`git log --no-merges <base>..HEAD -- <paths>`). Reading only the head message would break, because the rules make the head a merge of `origin/main` (critic fix 12). The pixel threshold is a decision; changing it is never a builder fix.

### 2.9 Budgets and speed tripwires (hard fails in the gate, measured on `www/assets`)
| Asset / metric | Basis | Limit |
|---|---|---|
| How-to footprint in main (critic fixes 8, 13) | main is 633,893 B raw / 187,830 B gz at fba3f37 (for information) | esbuild-minified `ids.ts` + `lazy.tsx`, with imports external, ≤ 3,072 B (unit test, one build). Content probe on `index-*.js`: no `plate-svg`, `u-stroke`, `feel-band`, and no string from any generated How-to file **except exactly the exports of `ids.ts`** (the label and the push hints). An app-wide main ceiling is not an HT check (S-5) |
| `src/howto/ids.ts` | new | ≤ 2,048 B, no runtime imports (unit test) |
| `HowToSheet-*.js` | new | start ≤ 60 KB raw / 18 KB gz; HT-3b lowers it to measured + 10 % |
| How-to CSS | golden plate/sheet ~12 KB raw; mockup hand + feel CSS ~8 KB | ≤ 28 KB raw / 8 KB gz, then measured + 10 % |
| `ht-<slug>-*.js` | 12.6-28.9 KB gz per plate set + ~4 KB text | ≤ 150 KB raw / 36 KB gz each |
| `ht-<slug>-zoom-*.js` | mockup still crop ~7-8 KB gz | ≤ 24 KB gz each |
| `hand-<key>-*.js` | 19.8 KB raw / 6.7-6.9 KB gz measured | ≤ 30 KB raw / 10 KB gz each |
| `ht-<slug>-feel-*.js` | new (pre-rendered states) | start ≤ 24 KB gz each; HT-8 lowers it to measured + 10 % |
| All How-to assets, first 8 | ~250-420 KB gz | ≤ 1.6 MB raw / 420 KB gz (re-set per batch by decision) |
| Requests before Train is idle | none today | no `HowToSheet-`, `ht-`, `hand-` request from launch until Today/Train is idle |
| Open-sheet elements in S0 | normal plate 173 + chrome | ≤ 700; mistake plate absent until first tap |
| Tap-to-plate at 4x CPU throttle | measured insert 23-40 ms at 4x | logged; hard fail if the median of 5 is over 400 ms (HT-10 recomputes it as measured + margin, never above 400) |
| Long tasks while opening, 4x | new | none over 100 ms (PerformanceObserver `longtask`) |
| Shimmer main-thread time, 4x | the golden-B page, measured in the same harness and job (median of 3); the judge saw ~980 ms vs 283 ms idle | app ≤ 1.2 × golden B (critic fix 4: not a self-set baseline) |
| Endless motion (C12) | shimmer 5.5 s, Trace 2.56 s | nothing running after end + 1 s, computed from the constants |

Every ceiling is the measured value + 10 %, lowered to fit the measurement and never raised without a supervisor decision. The recorded device checks run on the exact APK: open time, p95 frame time for Trace and the shimmer on a budget phone, the WebView cost of the 284-element mistake plate, and Android font scale.

### 2.10 Offline
- Everything is static and bundled. The service worker precaches every file in `www/assets` (sw-version.mjs:6). In the APK, all assets are local.
- C17: no `fetch(`, `XMLHttpRequest`, `Worker` or http(s) URL in any How-to source or chunk. The only exemptions are the SVG and xlink namespace literals (LR-23, D-LR23-7). No `<a>`, no `target=`, and every `href` starts with `#`.
- C19 (LR-23, HT-4b): no source, citation, evidence label, link, phone number, helpline or emergency-service wording in any How-to string or file, checked with the shared patterns in `tests/guards/no-contacts.ts`.
- Gate:
  - with the network offline, the sheet opens after a reload;
  - a chunk from the previous build still loads (build-B);
  - a failed chunk load shows the toast "Could not load the guide." with Reload;
  - the localStorage keys before and after opening are identical.

### 2.11 Tests (where each check lives)
- **Unit (vitest, node env):**
  - HT-1: `vendor.test` (L0 incl. the font), `golden.test` (fixture sha, fragment extraction, GOLDEN chain, reference fixtures + PRIMITIVES coverage).
  - HT-2: `generate.test` (L2, per-file inputsSha256), `ids.test`, `css.test` (lints, inline allow list, the 13-token drop), `class-map.test`, `theme-parity.test`, and the A3/A4 parts of `no-form-guide`.
  - HT-3: the A1/A5 parts of `no-form-guide`, `plate-state.test` (the pinned gallery-script behaviours and the zoom slot API).
  - HT-3b: `footprint.test` (esbuild size of `ids.ts` + `lazy.tsx`).
  - HT-4: `layers-vendor.test` (L0-B), `goldenB-derivation.test` (golden B holds only golden-A plates), `content.test` with C1-C4, C6-C8, C15 (stub), C16 (data), C17 (source), and negative fixtures.
  - HT-4b (LR-23): the re-vendored golden B, C17 with no URL exception except the SVG and xlink namespaces, `c19.ts` with fixtures M1-M9 and the D-LR23-1 extras, and the pattern parity test against `tests/guards/no-contacts.ts`.
  - HT-5: the content checks green on the generated content of all 8; `archetypes` and `HOWTO_HINTS` generated.
  - HT-6: C5 hand geometry, hand L2-B, `hint.test`.
  - HT-7: `zooms.test` (L2-B `===`; no duplicate ids per How-to).
  - HT-8: `feel.test` (L2-B `===` for every state; the FEEL_JS behaviour list; C9 feel contrast; C12 constants).
  - `theme.test.ts` gets the add-only block `HT-2`.
- **Gate (add-only blocks with their own PASS phrases; the FG-OFF block edit is the one sanctioned exception, D-HT1):**
  - `HT-1` harness self-check;
  - `HT-2` regenerate (L1);
  - `HT-3` entry + plate fidelity;
  - `HT-3b` footprint probe, speed tripwires, offline and build-B;
  - `HT-6` / `HT-7` / `HT-8` / `HT-9`: that layer's states in 5 themes against golden B, driven by HT-4's `goldenB.mjs`;
  - `HT-10`: cross-cutting sweeps, performance, gate time.

---

## 3. Proposed decision D-HT1: FG-OFF guard re-scope

> **D-HT1 (supervisor, 2026-09-30).** Authority: the owner's approval on 2026-09-30, "Then start building. U got my approval.", and his fidelity rule of the same day. The How-to returns as the approved Technical Plate. It does **not** bring back the old animated form guide (FG-1/V1, removed by FG-OFF on 2026-09-29, backup `claude/backup-fg-2026-09-29-main`).
> - Every assertion that guards against the old guide stays word for word.
> - Only the assertions that banned *any* "How to do it" are replaced, each by assertions at least as strict for its purpose.
> - `--mistake` returns openly with the D-FG1 values, scoped to the How-to. The other 13 FG-1 tokens stay banned.
> - The change lands in two PRs, and main is never in a loosened state:
>   - the token narrowing (A3) lands in the same commit as the token (HT-2), and the same PR writes D-HT1's A3 part into `docs/COACHING-DECISIONS.md` (critic fix 10);
>   - the A1 and gate replacements land in the same PR as the entry button (HT-3), which completes D-HT1 in that file.
> - Each PR carries the mutation proofs below.

**tests/workout/no-form-guide.test.ts** (the `describe` and `it` titles are reworded to say "old form guide")

| # | Assertion today | Fate | Replacement / addition |
|---|---|---|---|
| U1 | Train.tsx `not.toContain('How to do it')` | **Kept verbatim; purpose replaced** | The line stays: Train.tsx never hard-codes the label (it renders `{HOWTO_LABEL}`). Its old purpose ("no button") is replaced by A1-HT.a-c and A5 below |
| U2 | Train.tsx `not.toContain('btn-how-to')` | Kept, widened | no file under `src/` contains `btn-how-to` |
| U3 | Train.tsx `not.toMatch(/FormGuideSheet\|hasGuide\|guideOpen/)` | Kept, widened | the same regex over every src file |
| U4 | styles.css `not.toContain('.btn-how-to')` | Kept, widened | also every `src/slices/howto/css/*.css` |
| U5 | `existsSync('src/formguide') === false` | Kept verbatim | none |
| U6 | `existsSync('src/slices/formguide') === false` | Kept verbatim | none |
| U7 | no src file matches `/formguide\|ExercisePlayer\|FormGuidePlayer\|\.form-guide\b\|\bfg4?-/` | Kept verbatim | It already covers `src/howto/generated/**`. `tools/plates/vendor/**` is deliberately not scanned: ref-src/plate.mjs:2-3 has a comment naming `src/formguide/…`, and vendored files are hash-locked. Compensating check: A4 proves nothing under `tools/` is imported by `src/`, and the gate's G2 scans every built asset |
| U8 | the 14-name token regex over src + index.html | **Narrowed by exactly `mistake`** | the 13 others (`target help quiet pants pants-hi pants-sh ink iron iron-hi iron-sh eye floor guide`) stay banned over src + index.html. Added A3-HT.a: `--mistake` appears only in files under `src/slices/howto/**` |
| U9 | `themeToCss(THEMES[id])` does not match the regex | **Narrowed by `mistake`** | Added A3-HT.b: `themeToCss` holds exactly one `--mistake:<value>`, with the exact value below |
| U10 | no theme has any of the 14 token keys | **Narrowed by `mistake`** | Added A3-HT.c: `tokens.mistake` is exactly silent-black `#eb5757`, paper `#c0392b`, ember `#b36bff`, emerald `#f04438`, midnight `#ff5c5c`. A3-HT.d (theme.test block HT-2): contrast ≥ 3:1 against `--map-body`, `--surface-1` and `--surface-2` in every theme, computed from themes.ts (C9) |
| A1-HT.a | new | Added | the literal `How to do it` occurs in exactly one src file, `src/howto/ids.ts`, exactly once (`HOWTO_LABEL`) |
| A1-HT.b | new | Added | Train.tsx has exactly one `class="ht-entry"`, guarded by `ex && !ex.custom && hasHowTo(ex.id) &&`, with label `{HOWTO_LABEL}` and state `howToOpen`. `ht-entry` appears nowhere else in src, except the styles.css block marked `HT-3` |
| A1-HT.c | new | Added | Train.tsx imports How-to code only from `@/slices/howto/lazy` and `@/howto/ids` |
| A4 | new | Added | The static import graph from `src/main.tsx` (static `import` only) reaches `src/howto/ids.ts` and `src/slices/howto/lazy.tsx` and nothing else under `src/howto/**` or `src/slices/howto/**`. No `src/` file imports `tools/**`. Every module under `src/howto/generated/**` is reached only through a dynamic `import()`. `ids.ts` has no runtime imports and is ≤ 2,048 B |
| A5 | new | Added | `hasHowTo(id)` is true exactly for the approved `plates` slugs in `GOLDEN.json` (8 in M1). It is false for every other id in `exercises.json` (a table test, 145 ids) and for a custom id. `HOWTO_IDS` equals the `LOADERS` keys, which equal the generated `ht-*.ts` files. There is no fallback component |

**scripts/screenshot-gate.mjs, FG-OFF block (`:5583-5634`)**

| # | Probe today | Fate | Replacement |
|---|---|---|---|
| G1 | chunk name `^(FormGuidePlayer\|ExercisePlayer\|lib_[a-z_]+)-.*\.js$` fails | Kept verbatim | none |
| G2 | JS/CSS assets scanned for `(?<![\w])fg4?-[a-z]`, `form-guide`, `marc-formguide-rig`, `FormGuidePlayer` | Kept verbatim | none |
| G3 | the same scan for `/How to do it/` | **Replaced** | the string occurs in `index-*.js` (count ≥ 1) and in **no other** JS or CSS asset |
| G4 | the lateral-raise card is open (the `.why-toggle` is visible) | Kept verbatim | none |
| G5 | no `.btn-how-to` on the open card | Kept verbatim | none |
| G6 | no "How to do it" text on the Train page | **Replaced** | In Silent Black and Paper: the open lateral-raise card has exactly one `button.ht-entry` whose accessible name is "How to do it", with a box ≥ 44×44 CSS px. The Train page holds that text exactly once. The bench-press card (`lib_barbell_bench_press`, no approved content) has no `.ht-entry`. Tapping the entry opens a dialog containing `.ht-plate-fit`. (The custom-exercise control lives in the new HT-3 block, so the FG-OFF seed stays unchanged.) |
| G7 | no `.form-guide` on the Train page | Kept, widened | also none inside the open How-to sheet |
| G8 | `pageerror` pushes an error | Kept verbatim | none |
| PASS | `FG-OFF (no form-guide chunk or markup, no "How to do it" on Train)` | Reworded | `FG-OFF (no old form-guide chunk, player, markup or removed tokens; How-to entry only where approved content exists)` |

**Mutation proofs required:**
- HT-2 (each must fail):
  - add `--target` to any src CSS;
  - set Ember's `mistake` to `#ff6363`;
  - read `var(--mistake)` in styles.css.
- HT-3 (each must fail):
  - hard-code "How to do it" in Train.tsx;
  - drop `!ex.custom`;
  - add a LOADERS key without a GOLDEN entry;
  - import `HowToSheet` statically in Train.tsx;
  - add the label to a second chunk;
  - name a chunk `lib_x-…`.

`D-FGOFF1` (the UI-2 block in theme.test removed with the button) stays as it is. Nothing comes back from UI-2.

**Also recorded:**
- **D-HT2:** the owner rule overrides GRIP-AND-FEEL R2, R3, R15/R16, the 24 KB gz budget and the MuscleMap feel mode; the chips go below the tempo (this overrides GA R1); the chest-press callout override is removed in the mockup; the feel map follows golden B exactly; the sheet header (h2, Close X, centred) is app chrome, with only the eyebrow and title text styles matched to the golden; the lateral-raise callout hit-box overlap (O10) is part of the approved plate and exempt from C10 by name.
- **D-HT3:** the golden procedure (2.8) with the commit-range guard; the L3 threshold of 1/255 and 0.02 %; the performance tripwires (2.9), including shimmer ≤ 1.2 × golden B; golden B is pinned by the supervisor (section 5, O5) only after the S-2 entry conditions hold; the font-scale pass rule (O9).

---

## 4. Build cards

### 4.0 Before HT-1 (supervisor actions, no builder)
- **S-1 (today):** commit `plates2/ref-src/{plate.mjs, themes.mjs}` (md5 `31e7bfe3555c0c456ed4417f503dc93f` and `37495b3d37d1a6a284a380c9e517fb18`) to `claude/howto-options` next to bc0f378's folder, as a docs-only commit. Today it exists only in a scratchpad that another agent is still working in. No branch has it: the branch head is `465ced6`, which has no ref-src.
- **S-2 (when the layer mockup is finished):** commit the layer sources to `claude/howto-options` at one pushed commit, **golden B**:
  - `engine/{hand,hand-pairs,feelmap,bodymap-parts}.mjs` and the shared RED_FLAG/DISCLAIMER module;
  - `howto/*.mjs`;
  - `exercises/*.howto*.mjs`;
  - the layer page builder and its output page.

  **Entry conditions.** The supervisor pins golden B only when all of these hold, and sends any miss back to the mockup lane (critic fixes 2, 4, 5):
  1. **Golden B holds only golden-A plates.** Every `*.howto.mjs` takes its plate unchanged from the golden-A spec, with no callout overrides. The lateral raise takes it from `ref-src/plate.mjs`, not from the newer `exercises/dumbbell_lateral_raise.mjs`. Today two files break this and must be fixed **in the mockup**: `machine_chest_press.howto.mjs:216-225` overrides the callouts, and `dumbbell_lateral_raise.howto.mjs:10` imports the newer spec.
  2. Every posture crop that re-renders the plate (`howto/render-*.mjs` call `renderPlate`) starts from the golden-A spec. HT4-A5 proves it.
  3. The GA appendix-A text fixes are applied in the mockup's `*.howto.mjs`. The app takes its text only from there.
  4. One shared module holds `RED_FLAG` and `DISCLAIMER` (the architecture's wording, flagged O2). Today `RED_FLAG` lives in `leg_press.howto.mjs:90`, and the mockup has no disclaimer.
  5. The layer page renders every new section for all 8 in 5 themes: hand zoom, posture zoom, handling mistakes, feel map (rest, playing, each row open, reduced motion), setup, risks (with the disclaimer).
  6. "Pause the shimmer when scrolled out of view" is added to `FEEL_JS`, as behaviour only with no pixel change. If the mockup lane does not add it, the app does not either.

  Then a fresh reviewer checks golden B against GA and the verified research cards, and the owner gets the contact sheet (O5).
- **S-3:** post D-HT1..3 as proposed text on the HT-2 and HT-3 PRs. D-HT1's A3 part goes into COACHING-DECISIONS.md with HT-2; the rest of D-HT1, D-HT2 and D-HT3 go in with HT-3.
- **S-4 (add-only, supervisor-owned):** the agent-guard `[golden update]` check over the commit range (2.8).
- **S-5 (supervisor decision, not an HT check):** whether the app gets an app-wide main-chunk ceiling. Main is ~634 KB with no gate budget today; an HT block must not set one for every other lane.
- **S-6 (tell the other lanes when HT-4 merges):** the C6 coverage check fails any PR that adds an id to `exercises.json` without a row in `src/howto/coverage.ts`.

### 4.1 Card list
| id | title | lane | depends_on | model | size |
|---|---|---|---|---|---|
| HT-1 | Golden lock: vendored approved sources, font pin, golden fixtures, CI fidelity check | P | S-1 | Opus | M |
| HT-2 | Generator core, the 8 plate modules, `BuiltHowTo`, `--mistake` token and A3 narrowing | P | HT-1 | Opus | L (hard, design note) |
| HT-4 | Golden-B lock, golden-B state driver, golden-A derivation test, CI content checks | C | HT-1, S-2 | Sonnet | M |
| HT-4b | LR-23 follow-up: golden-B re-vendor, C17 rewrite, C19 "no sources or contacts" check | C | HT-4, ESC-NC | Sonnet | M |
| HT-3 | The sheet: Train entry, PlateView and zoom slot API, FG-OFF re-scope, plate fidelity gate | P | HT-2 | Opus | L (hard, design note) |
| HT-3b | Speed, offline and footprint: How-to footprint probe, tripwires, build-B, chunk budgets | P | HT-3 | Sonnet | M |
| HT-5 | Content generator for the 8 from golden B, archetypes, push hints, content verification | C | HT-2, HT-4, HT-4b, S-2 | Sonnet | S-M |
| HT-6 | Proper grips: hand close-ups, zoom host, Look closer chips, handling mistakes, push hint | L1 | HT-3, HT-5 | Opus | L (hard, design note) |
| HT-7 | Posture close-ups (right and wrong crops, generated from golden B) | L2 | HT-6 (zoom host commit), HT-5 | Opus | M (hard, design note) |
| HT-8 | "Where you should feel it": muscle highlight and shimmer outline | L3 | HT-3, HT-5 | Opus | M (hard, design note) |
| HT-9 | Set up, Risks and when to stop | L4 | HT-3, HT-5, HT-4b | Sonnet | S-M |
| HT-10 | Gate blocks: whole-sheet sweeps, final speed numbers, release candidate | G | HT-3b, HT-6, HT-7, HT-8, HT-9 | Opus | M |

HT-3 was split (critic fix 23): the entry, the FG-OFF re-scope and the fidelity checks stay together in HT-3, because the entry must never land without the proof; speed, offline and budgets move to HT-3b.

**Lanes and timing (at most 4 builders at once):**
- **Wave 1:** HT-1. Its first pushed commit (`src/howto/types.ts` + the vendor folder) lets HT-2 and HT-4 base on it.
- **Wave 2:**
  - HT-2 (lane P);
  - HT-4 (lane C, once S-2 is done).
- **Wave 3:** HT-3 on HT-2's head (design note first). HT-5 on HT-2's and HT-4's heads.
- **Wave 4:**
  - HT-3b on HT-3's head;
  - HT-6, HT-8 and HT-9 on HT-3's head once HT-5 has pushed;
  - HT-7 on HT-6's zoom-host commit.
  Never more than 4 builders at once; the supervisor starts HT-9 last if the cap is hit.
- **Wave 5:** HT-10, starting when HT-6 merges; its perf harness can begin on HT-3b's head.

**Merge order (the owner's checklist order):** HT-1 → HT-2 → HT-4 → HT-3 → HT-3b → HT-4b → HT-5 → HT-6 → HT-7 → HT-8 → HT-9 → HT-10. HT-4b (LR-23) merges after HT-4 and before HT-5; HT-5 to HT-9 take LR-23 after it (D-LR23-6).
- HT-4 goes before HT-3: it is independent, and merging it early unblocks lane C (critic fix 23).
- 11 merges. Each PR must merge `main` and re-run CI after the previous merge, and the gate gains about 240 pixel pairs in each of its 2 jobs under a 40-minute timeout. Plan on **1.5 to 2 days** of merge time after reviews; "one per 25-minute cycle" is only the floor.
- **Milestone M1a**, after HT-3: the owner has the 8 approved plates, Trace and Mistake on his phone, behind "How to do it". The sections below the tempo are empty. The M1a device-check list starts with the font-scale rule (O9). HT-3b follows one merge later with the speed proofs.
- **Milestone M1**, after HT-10: the full first milestone for all 8 exercises: plate, Trace, Mistake, hand and posture close-ups, the feel map with shimmer, setup steps, and risks with the disclaimer.

Every card's acceptance includes **G0** (2.7).

### 4.2 Queued after M1 (cut when M1 is merged; not part of the 11 cards)
- **HT-11, size:** byte-preserving delta encoding of the mistake SVG against the normal one, plus crop reuse. The target is ≥ 35 % smaller per base chunk, and L2 checks the decoded string with `===`. It is required before any batch takes the plate count past about 40. Opus, M.
- **HT-12 is replaced** (2026-09-30) by the library plan, `docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md`: the owner asked for How-to on every library exercise before the Play Store upload. HT-11 stays and is scheduled there.

---

## 5. Owner items (pending decisions; nothing blocks)
| # | Item | How the plan proceeds meanwhile |
|---|---|---|
| O1 | Paid physio/coach review before the content ships widely | Build and merge to main (the owner's own APK). Publishing is owner-only anyway. `reviews.json` + C15 stamps are ready (HT-4 stub). No release to other users until O1 is answered |
| O2 | Wording of the "not medical advice" line | **Closed 2026-09-30.** The owner chose "General guidance, not medical advice. If something hurts, stop and get it checked.". It is the one constant `DISCLAIMER` (golden B `howto/shared.mjs`, then `archetypes.ts`) |
| O3 | Show evidence labels | Closed 2026-09-30: no sources or evidence labels in the UI; they stay in the data (LR-23) |
| O4 | Next exercise batch | **Answered 2026-09-30:** the whole library, before the Play Store upload (`docs/howto/library/`) |
| O5 | The finished layer mockup (golden B) | The supervisor pins it after a fresh review. The owner gets the contact sheet and then the APK after each layer merge. Layer merges do not wait for his reply, because he approved the design and listed exactly these layers as missing. If he wants a change, it is a deliberate golden-B update (2.8) |
| O6 | The "already seen" note (auto-open the hand zoom once) | Not built: it is new stored data. v1 works without it |
| O7 | Midnight "Tells" labels at 4.12:1 on the sheet (under AA 4.5:1 for 11 px text) | Part of the approved plate, so it is unchanged. Offer it as a possible deliberate golden update. It is never fixed silently |
| O8 | A How-to with no plate (Level 1) for exercises without an approved plate | Not in M1. No button without an approved plate (A5) |
| O10 | The approved lateral-raise plate's "No shrug" and "Elbows lead" callouts have overlapping 44 px hit boxes (measured on the golden at 390×844) | Part of the approved plate, so unchanged in the app. HT-10's C10 exempts exactly this pair by name. Offered to the owner as a possible golden update, like O7. Never changed in the app alone |
| O9 | Phone checks on the exact APK | Open time; Trace and shimmer smoothness; TalkBack; font scale; hand-close-up realism. A list is sent with the HT-3 and HT-10 APKs. **Font-scale pass rule, decided now (critic fix 19):** at the phone's largest system font size, the `.ht-golden` block must look the same as at 100 % (callout labels do not grow or move against the drawing); the text sections below it may grow. Nothing sets WebView `textZoom` today (docs/ARCHITECTURE-REVIEW.md:548), so whether it passes is **not verified**. It is the first item on the M1a list. If it fails, the fix is a supervisor decision recorded in D-HT2 and never changes plate bytes |

---

## 6. Risks and mitigations
| # | Risk | Mitigation |
|---|---|---|
| R1 | ref-src or the layer sources are lost or changed in the scratchpad before they are pinned | S-1 today, S-2 at the layer freeze; L0/L1 fail on any byte change |
| R2 | The golden lateral raise gets replaced by the newer `plates2/exercises/dumbbell_lateral_raise.mjs` (not in bc0f378) | `plates.json` maps lateral raise to `ref-src`; L2 compares with the golden fixture, so a swap fails |
| R3 | Node/V8 floating-point drift changes the generated bytes | Coordinates are rounded to 2 dp (geom.mjs). L1 and `generate --check` run on CI's Node 22 in every gate job, so drift turns red, never silent. The supervisor pins an exact 22.x if it happens |
| R4 | App CSS leaks into the plate (the `.plate` chip, globals) | `.ht` scope; the `.plate` → `.ht-plate` map; the L2b walk names the rule; L3; a reverse probe that PlateSheet's `.plate` chip style is unchanged |
| R5 | The 356 px sheet silently scales or narrows the golden block | one `.ht-golden` wrapper with a -1 px bleed around plate, cue line, controls, tells and tempo; the golden rules untouched; width asserts on `.ht-golden` and `.ht-plate-fit` at 390, 360 and 340 before any compare |
| R6 | Pixel noise tempts someone to loosen L3 | Threshold fixed by D-HT3; golden-vs-golden self-check = 0 px; captures wait for animations; any change needs a decision with diff images |
| R7 | FG-OFF protections are quietly weakened | D-HT1 row by row; the old-guide bans kept verbatim; token narrowing and entry land in the same PR as their feature; mutation proofs; supervisor sign-off |
| R8 | Main chunk growth or How-to code in main | A4 graph test; the footprint test (`ids.ts` + `lazy.tsx` ≤ 3,072 B); a main content probe that exempts exactly the `ids.ts` exports; a no-request-before-idle probe. An app-wide ceiling is S-5 |
| R9 | Payload grows with batches (APK, SW precache) | Per-chunk and total budgets; hand pairs shared by key; zoom sub-chunks; HT-11 delta encoding before about 40 plates |
| R10 | Shimmer main-thread cost on budget phones (SVG transform not compositor-only) | Runs once for 5.5 s, never loops; pause-out-of-view only through golden B (S-2 condition 6); gate tripwire app ≤ 1.2 × the golden-B page in the same job; recorded p95 frame time on a budget phone. A cheaper look would be a golden-B update, never a silent change |
| R11 | Duplicate SVG ids (sheet exit overlapping the next open, crops) | Slug-prefixed ids from the golden; tested crop id rename; duplicate-id test per How-to |
| R12 | Golden B churns while layer cards build | Layer cards build against the S-2 commit; the L0 manifest pins it; a later mockup change is a golden-B update, not a silent rebase |
| R13 | Merge conflicts on generated files, `sections/index.ts`, `generate.mjs` | Plugins found by glob, so no registry line; per-file `inputsSha256` over each file's own inputs; one writer per generated file except the sequential HT-2 → HT-5 pair; generated files are never hand-merged (re-run `node tools/plates/generate.mjs`); keep both sides of the section registry |
| R14 | Gate time grows (~300 pixel pairs) | Measured in the HT-3 PR, with a budget set there. If it is exceeded, HT-10 shards the matrix by theme across the two existing gate jobs (the supervisor wires the env var). States are never dropped |
| R15 | Content wrong or unsafe before professional review | Verified research cards; C7/C8 checks; one RED_FLAG and one DISCLAIMER; O1 keeps it on the owner's APK only |
| R16 | The WebView cost of the 284-element mistake plate | Inserted lazily; a recorded device check; changing the SVG would be a golden update, never a silent simplification |
| R17 | The gate's negative control (bench press) gains content in a library batch | Every "no How-to" control reads HT-3's shared helper (the first library id with no How-to), never a literal id (supervisor 2026-09-30) |
| R18 | Unescaped overlay text | Repo-static content; the generator allows only `<br>` in overlay text (unit test); L2 still compares with the golden |
| R19 | The generator (.mjs) is not typechecked | Output ends in `satisfies BuiltHowTo`; unit tests cover the generator |
| R20 | A fontsource update moves glyphs on both sides, so L3 stays green while plates drift | L0 pins the woff2 sha256 `3100e775…4c62`; an update is a golden update |
| R21 | Golden B quietly carries plates that are not the approved ones | S-2 entry condition 1; HT4-A5 derivation test (imports, deep-equal specs, crop inputs, page fragments `===` golden A) |
| R22 | Theme edits in unrelated PRs break L3 far from the cause | theme-parity unit test names the token; any change to a plate token goes through a golden update |
| R23 | C6 coverage fails other lanes that add exercises | S-6 notice to all builders; the failure message names the missing id and the file to edit |
| R24 | Android font scale distorts the plate on the owner's phone | pass rule fixed now (O9); device check first on the M1a list; any fix is a recorded decision, never a plate change |
| R25 | App tests loosened to fit a golden-B mismatch | text or behaviour fixes go into golden B first (2.8); layer cards compare `===` / L3 against golden B with no declared-difference list |
