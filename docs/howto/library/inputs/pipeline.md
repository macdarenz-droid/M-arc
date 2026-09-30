# How to do it for the whole library: how the first 8 were built, and what scales

Status: analysis for the library-wide How-to architecture. Nothing in any repo was changed.
Base: main `cae1725` (HT-1 and HT-2 merged). Open: HT-3 #106 and HT-4 #107. Golden B: `claude/howto-options` `b3a90af`.
Date: 2026-09-30. Every number below comes from a file, a PR or a CI run, and each one names its source. Estimates are marked **est.**

---

## 0. Short version

- The 8 plates are **hand-crafted drawings made with an engine's help**. The engine does the body, the joints, the ghosts, Trace and the mistake outline. A person (an agent) sets every pose angle, every equipment coordinate, 64 % of the label positions, the mistake pose and its arrows, the tempo and all the words. The lateral raise was not made by the engine at all.
- The layers (golden B) are worse for scale. Each exercise needs its own close-up render script of 29-44 KB, and those scripts come in two copy-pasted families.
- The app side scales well. Adding an exercise to the generator, the loaders, the lazy chunks and the L2 byte check costs almost nothing per plate.
- **What breaks at 153:** gate time (about 135 min per gate job against a 40-min timeout), the `ids.ts` budget (it breaks at about 60 ids), fixture and repo size (about 100 MB of golden fixtures), the owner's approval load, and a golden-lock core that has the 8 written into it by hand.

---

## 1. The pipeline the first 8 went through

| # | Step | Output (first 8) | Who |
|---|---|---|---|
| 1 | Research card: grip, setup, posture, mistakes, feel, sources, each source checked by a second agent | `grip/research/<slug>.json`, 19-29 KB each (avg 24.4 KB) | agent + verifier |
| 2 | Plate spec: poses, equipment, callouts, mistake, tempo, alt | `exercises/<id>.mjs`, 102-177 lines, 7.8-13.7 KB | agent |
| 3 | Render + engine report, then critique and fix rounds | scratch `plates2/critic` (62 files), `critic2` (180), `fix_pull_up` (20), `fix_squat`, `fixf` (52), `verify_*` | agent + critics |
| 4 | Gallery page, owner approval = **golden A** | `bc0f378` gallery, sha `e2bea90c…`, 860,766 B | owner |
| 5 | Layer spec: handling, hand poses, zooms, feel, setup, risks, sources | `exercises/<id>.howto.mjs`, 283-407 lines, 23-38 KB (avg 32.3 KB) | agent |
| 6 | Close-up renderers: hand pairs, posture crops, feel map | `howto/render-<id>.mjs` or `exercises/<id>.howto-render.mjs`, 29-44 KB (avg 37.3 KB) | agent |
| 7 | Layer page + copy lint + state check + fidelity check, 2 verifiers, owner, then **golden B** | page `5aab1aca…`, 2,386,760 B | verifiers, owner |
| 8 | Vendor into the app verbatim, hash-locked | HT-1 `tools/plates/vendor/` (27 files), HT-4 `tools/plates/layers/` (49 files) | builder |
| 9 | Generate app modules from the vendored sources | HT-2 `src/howto/generated/ht-<slug>.ts` ×8, `index.ts`, `ids.ts`, `plate.css` | builder |
| 10 | Show them in the app, and prove pixel identity in CI | HT-3 sheet + gate blocks | builder, reviewer |

Hand-written source per exercise: about **105 KB** (plate spec 11.1 + layer spec 32.3 + render script 37.3 + research card 24.4, averages over the 8). All of it is judgement work, not typing.

---

## 2. How a plate spec is written (read: `pull_up.mjs`, `seated_cable_row.mjs`, engine `SPEC.md`)

A spec is one JS module with a `default` object. `SPEC.md` section 4 lists its fields: `view`, `camera`, `poses {start, end, via?}`, `equipment[]`, `checks[]`, `ghosts`, `trace`, `measure`, `datum`, `callouts` (≤ 3), `tempo`, `mistake {pose, guides, tells}` and `alt`.

What the author actually does, from the two specs:
- **Poses by joint angles, each backed by a source.** The pull-up top is written as: pelvis 4° back, trunk -6°, neck -14°, hip 16°, knee 10°, and the chin 5.2 cm over the bar. The header cites ACE, Snarr 2017, Youdas 2010 and others. The seated row gives the torso 8° forward at the reach, the footrest at 20°, the knees 29°→21°, and the seat top at 45 cm ("commercial low-row benches 43-48 cm").
- **Equipment in metres.** Examples: the pull-up bar at 2.25 m and 55 cm off the wall; the row pulley at `[0, 0.44, 1.17]`, chosen so the cable run is one straight line; a 12-plate stack.
- **Bespoke geometry when the engine falls short.** The pull-up has a 50-line hidden-line routine, `hangOutline()`, with its own Catmull-Rom sampler and a point-in-polygon test, so the dead-hang shows through the top pose. The seated row adds an invisible "1 mm twin" handle to work around an engine rule (its comment: "Remove once plate.mjs compares with the end pose"). Function-type equipment appears in 6 of 7 specs.
- **Contact checks** that the engine verifies. Examples: the pelvis sits on the bench within 0.5 cm; the thigh stays above the pad; the chin is at least 4.5 cm over the bar at the top and under it in the mistake.
- **Labels.** Callout text (1-3 words), a one-sentence cue, an anchor landmark (often with a pixel offset), and usually a hand-set `box: {left, top}`.
- **Mistake.** A partial pose merged over the end pose, 1-3 guides (arc arrows with a hand-set centre, radius and angles), and 2-3 tells.
- **Tempo** is typed per exercise (for example Pull 1 / Hold 0.5 / Lower 2 / Rest 0.5). Nothing derives it.
- **Alt text.**

---

## 3. What the engine automates and what was tuned by hand

| Part | Engine does it | Tuned by hand (evidence) |
|---|---|---|
| Body drawing | Winter proportions; silhouette, caps, fists; far limbs in a lighter stroke (`SPEC.md` 2) | none |
| Joint solving | FK, and IK for hands on handles and feet on plates, with a contact-error report (`SPEC.md` 3, 6) | every joint angle, root, tilt, IK target and pole |
| Equipment | 20 primitives with real sizes (`SPEC.md` 5) | every coordinate; custom geometry in 6/7 specs |
| Camera | `fit: true` or margins | 3 of 7 specs set `x0/y0` by hand; 2 set fit margins |
| Ghosts, dashed start, Trace | auto from the poses; `trace.point` and trim | which parts ghost, the trim in px |
| Measure arc | draws the angle and flags > 2° against `expect` | the rays, the value text, `expect`, and often the box |
| **Label placement** | auto: 2 px grid, 8 px margins, cost = leader length + figure crossings + leader crossings (`SPEC.md` 4, `layout.mjs placeLabels`) | **29 of 45 labels (64 %) hand-boxed**, 1 `prefer` (squat 4/7, leg raise 5/7, pulldown 6/6, leg press 3/7, chest press 2/6, pull-up 4/6, row 5/6) |
| Callouts and tells | leaders, pills, `aria-pressed` | the text, anchor, offset and cue |
| Mistake view | the dashed `--mistake` outline of only what differs from the end pose | the mistake pose, the guides (arc centre, r, a0, a1), the tells |
| Tempo | the strip | phases and seconds typed |
| Lateral raise | none | **the whole plate is hand-drawn** (`ref-src/plate.mjs`, 18 KB) |
| Hand close-ups | `hand.mjs` draws any `HandPose` from measured hand proportions | 3 shared pairs (`hand-pairs.mjs`: push, pull, hang), plus per-exercise extras such as `hookThumb` and `fingerBaseMarks` in the render scripts |
| Posture crops | they reuse the plate camera and `renderPlate` (48 calls across 7 exercises, HT-4 note) | the crop windows, the right and wrong poses, the labels |
| Feel map | `feelmap.mjs` from muscle ids (primary, secondary, avoid, pain) | the rows, the pain parts, the "means" and "fix" text |

Render-script duplication (my count of identical non-blank lines): the 5 `howto/render-*.mjs` share 53-62 % of their lines with each other. The 3 `exercises/*.howto-render.mjs` share only 13-15 %. So there are two diverged frameworks, and 40-85 % of each script is written for that one exercise.

---

## 4. The checks that exist

| Check | What it proves | Where | Runs in CI? |
|---|---|---|---|
| Engine report (`render.mjs`) | `engineIssues`: label edge, overlap, figure and joint hits on estimated boxes, IK contact > 0.5 cm, `checks`, measure > 2°. `browserIssues`: the same on measured boxes, plus font loaded, no horizontal scroll, sheet fits. `ok` when all lists are empty | vendored `engine/render.mjs`, `plate.mjs:279-297` | **No.** An authoring tool only; no test or gate reads it (git grep on main) |
| L0 | vendored bytes, font sha, and MANIFEST pinned by a literal | `vendor.test.ts` | yes (vitest) |
| L1 | the vendored engine rebuilds golden A byte for byte (`e2bea90c…`) | gate block HT-2 (`generate --check`, about 5 s + 3 s build) | yes |
| L2 | each shipped fragment (9 per plate) `===` the golden and re-hashes to `GOLDEN.json` | `generate.test.ts` | yes |
| L2b / F3 / L3 / L4 | CSS leak walk, DOM and aria equality, pixels (≤ 1/255, ≤ 0.02 %), Trace animation lists | gate block HT-3 (#106) | yes, once HT-3 merges |
| Fidelity check (golden B vs A) | 104 byte fragments + 80 pixel regions, 0 px | `artifact/fidelity-check.mjs` | no (a pin-time tool); HT4-A5 derivation test moves it into vitest |
| Derivation test | golden B holds only golden-A plates: source deep-equal, the 48 crop calls, fragments `===` | `goldenB-derivation.test` (HT-4, in build) | yes, once HT-4 merges |
| Copy lint | 26 exported numeric caps (15-word sentences, 450 visible words, setup 5×12, ...), GA 6.2 bans, the owner's line verbatim, pinned red-flag rows | `artifact/copy-lint.mjs`, run first by the build (it throws); C7 in HT-4 | at build; in CI via HT-4 |
| State check (`shoot2.mjs`) | every layer state opens, is visible, is inside 390 px, with no page errors, 8 × 5 themes; screenshots in 2 themes. **Presence, not pixels** | `artifact/shoot2.mjs`; becomes `fidelity/goldenB.mjs` (HT-4) | via the layer gate blocks (HT-6..9) |
| Hand test | the hand renderer's geometry | `engine/hand-test.mjs` | C5 in HT-6 |
| Plan-level checks | C1-C18 (GA 6.1), budgets (plan 2.9), `[golden update]` guard (2.8) | various | as each card lands |

---

## 5. How the app uses the plates (main `cae1725`)

- `tools/plates/generate.mjs` (core, frozen after HT-2) runs every plugin in `tools/plates/gen/*.mjs`. `gen/plates.mjs` rebuilds the gallery from the vendored engine in a temp mirror. It **refuses** unless the page sha is `e2bea90c…` and every fragment matches its latest `GOLDEN.json` entry. Then it writes the fragments as JSON string literals.
- Outputs:
  - `src/howto/generated/ht-<slug>.ts` (one per exercise, ending `satisfies BuiltHowTo`, with an `inputsSha256` header);
  - `generated/index.ts` (`LOADERS: Record<LibId, () => import('./ht-<slug>')>`, 796 B);
  - `src/howto/ids.ts` (`HOWTO_IDS`, `HOWTO_LABEL`, `hasHowTo`, 706 B, the only How-to module in main);
  - `src/slices/howto/css/plate.css` (9,526 B, a mechanical rewrite by `css.mjs`).
- Vite turns each dynamic import into a lazy chunk `ht-<slug>-*.js`. Nothing loads before the button is tapped.
- HT-3 (#106): Train shows the button only when `ex && !ex.custom && hasHowTo(ex.id)`. `HowToSheet` is lazy, and `PlateView` inserts the strings once.
- `plates.json` maps each id to `{src, slug, prefix, chromeId}`. `golden.mjs` also has a hand-written `LIB_OF` map with 8 entries.

---

## 6. Measured sizes (HT-2 PR #105, A9 table; git on main)

| Plate | Generated `.ts` B | Chunk raw B | Chunk gz B |
|---|---|---|---|
| lateral raise | 65,341 | 63,001 | 12,535 |
| back squat | 94,925 | 92,839 | 21,072 |
| pull-up | 126,702 | 124,238 | 28,610 |
| hanging leg raise | 119,766 | 117,386 | 27,998 |
| lat pulldown | 113,987 | 111,189 | 23,863 |
| seated cable row | 119,895 | 117,043 | 25,459 |
| leg press | 95,858 | 93,568 | 18,076 |
| chest press | 101,485 | 99,249 | 20,137 |
| **sum / avg** | 837,959 / 104,745 | 818,513 / 102,314 | 177,750 / 22,219 |

- Limits (plan 2.9): 150 KB raw / 36 KB gz per plate chunk; the largest today is the pull-up (124 KB / 28.6 KB).
- The plan puts all How-to assets for the first 8, layers included, at about 250-420 KB gz, which is **31-52 KB gz per exercise**. The budget is ≤ 1.6 MB raw / 420 KB gz for the 8.
- Other planned layer chunks: hand pair 19.8 KB raw / 6.7-6.9 KB gz, shared by key; zoom ≤ 24 KB gz; feel ≤ 24 KB gz.
- Today's debug APK artifact is 4,374,299 B (run 36682004894 on `cae1725`), and the `www` artifact is 382,600 B.
- HT-3 S0 has 286 elements (limit 700). The mistake plate has 284 elements, inserted lazily.

---

## 7. Gate time (CI runs + HT-3 PR)

- **Today (main `cae1725`, run 36682004894):** the gate step takes 13 m 13 s in `source-gate` and 12 m 54 s in `visual-gate-tz`, and the `source-gate` job takes 16 m 10 s end to end. Each job has a **40-min timeout** (`build-apk.yml`), and both run the full `npm run gate`.
- **HT-3 block (PR #106, A9):**
  - it adds **217.7 s per gate job** for 8 plates (232.7 s on an earlier head);
  - it compares 344 pixel pairs, 216 L2b walks, 216 F3 compares and 40 Trace animation lists;
  - by phase, about 45 % is L2b/F3, 40 % captures and 15 % diffs;
  - proposed budget: ≤ 256 s per job.
  - The plan had estimated 60-90 s (and "about 240 pixel pairs" per job); the real number is 2.4-3.6 times that.
- **Per plate:** **27.2 s per job** (0.63 s per pixel pair, walks included).
- **Layers (HT-6..9, not built), est.:**
  - golden B's state list per exercise (shoot2: grip and mistakes, risks, 2-4 zooms with page 2, feel rest, playing, 4 rows, reduced motion, setup, sources, plus the wrist line for push) is about 14-16 states × 5 themes, so about 70-80 L3 pairs;
  - at the capture-plus-diff rate (≈ 0.35 s per pair) that is **about 25-28 s per exercise per job**;
  - plate plus layers ≈ **53 s per exercise per job**.
- **Status:** HT-3's own CI is red today. Runs 1175, 1185 and 1187 failed. The commit messages say CI's headless Chromium composites and lays out differently from local, and HT-3 moved to full Chromium. Pixel-exact L3 on CI is still being stabilised.

---

## 8. HT-11 and HT-12 as planned (plan 4.2)

- **HT-11, size:** byte-preserving delta encoding of the mistake SVG against the normal one, plus crop reuse. The target is ≥ 35 % smaller per base chunk, and L2 checks the decoded string with `===`. It is required before the plate count passes about 40. Model: Opus, size M.
- **HT-12, presses batch (after O4):** 26 push exercises. Each gets a new engine spec, an owner-approved contact sheet and a `GOLDEN.json` entry. Draft slugs stay out of `HOWTO_IDS`. C6 coverage and C15 stamps apply. It must switch the gate's negative control (bench press, R17) in the same PR. Model: Opus, size L.
  - Of the 25 new push ids, my readiness split (section 11) is: 10 fit today's primitives, 14 need a new primitive (Smith, rope, straight and stirrup handles, dip station, EZ bar, press machines, ab wheel), and 1 hits an engine limit (sled push).

---

## 9. What drives the effort per exercise

1. **Biomechanics judgement.** Every angle and contact is set by hand and justified with sources. This does not automate. It is also where quality comes from.
2. **Label layout.** 64 % of labels were hand-placed after looking at the render. Auto-placement is "good, not perfect" (`SPEC.md` 8).
3. **Missing equipment or engine features.** Section 11 counts about 61 exercises that need a new primitive and 19 that hit an engine limit.
4. **Close-up renderers.** 29-44 KB of per-exercise script. They are the largest single hand-written file per exercise, in two diverged families.
5. **Copy.** About 440 visible words per exercise (433-449 today, cap 450). Getting there took 851 → 0 lint violations, 2 verifiers (32 findings), a refix and a recheck.
6. **First-of-kind research.** GA 3.1 marks `palm-flat` (10), `curl` (13) and `implement` (5) as "no verified source yet"; the first card of each kind must supply it. The 8 cover 6 of the 10 hand archetypes with 3 drawn hand pairs.
7. **Review and approval.** Critique rounds, 2 fresh verifiers per golden, and the owner's contact sheet.

---

## 10. What breaks at 153 (8 → 153; 145 new)

| Item | Today (8) | At 153 (linear from the 8 unless noted) | Limit | Breaks at |
|---|---|---|---|---|
| Plate chunks | 818 KB raw / 178 KB gz | 15.7 MB raw / **3.4 MB gz**; with HT-11 (-35 %) about 2.2 MB gz | per-chunk 150 KB / 36 KB (fine); total 1.6 MB / 420 KB "re-set per batch" | total budget at about 19 plates |
| All How-to assets | 250-420 KB gz (plan est.) | **4.8-8.0 MB gz**, about 30 MB raw (est.) | same | about 8 exercises (it is set for 8) |
| APK | 4.37 MB (artifact) | about 9-12 MB (est.; assets deflated about like gz) | none set; Play 200 MB | not a hard break; a download-size choice |
| Gate time per job (HT blocks) | +217.7 s (plates only) | plates 69 min + layers about 67 min (est.) ≈ **135 min** | 40-min job timeout; about 20 min free after today's 16.2 min job (10 % margin) | about 22 full exercises, or about 43 plates alone, per job at the full matrix |
| `ids.ts` | 706 B | **4,432 B** in today's format (506 B fixed + 25.7 B per id), plus HT-5 push hints | 2,048 B (`ids.test.ts:57`) | **about 60 ids**, fewer with hints |
| Main footprint (`ids.ts` + `lazy.tsx`, minified) | small | the id strings alone are about 3,470 B | 3,072 B | about 100 ids (est.; `lazy.tsx` size not measured) |
| `GOLDEN.json` | 10,707 B, 9 entries (1,081 B per plate) | about 171 KB, about 160 entries | none | a hash chain: two batches in flight always conflict at the tail, so batches append **one after another** |
| Golden A fixture | 860,766 B, one page | 16.5 MB as one page (107.6 KB per plate) | L1 pins **one** sha (`golden.mjs PINS.pageSha256`) | the 1st new plate: the core needs multi-page pins |
| Golden B page | 2,386,760 B | 45.6 MB as one page (298 KB per exercise) | GitHub warns at 50 MB per file | needs pages per batch |
| Ref-fixtures | 44 files, 2.1 MB (5.5 files, 265 KB per plate) | about 842 files, **40.5 MB** | none | repo weight: about **100 MB** of golden fixtures in total, in a public repo |
| Generated files | 11 (then about 3 per exercise + shared hands after M1) | about 460-500 files, **about 16 MB** of plate `.ts` alone | none | every batch rewrites **all** headers (next row) |
| `inputsSha256` | one value (`3b8531…`) on all 11 files | any vendor or GOLDEN change re-headers all about 460 files | plan 2.2 wants "its own inputs only" | a batch PR touches every generated file, and parallel lanes conflict |
| Owner approval | 1 plate gallery, 1 layer mockup, 1 copy update, M1a device list | batches of about 25 give about 6 × (plate sheet of about 50 drawings + layer sheet of about 375 panels + APK device check) ≈ **18 owner sessions** | owner-only | the plan sets no review cadence |
| Hard-wired 8 | `LIB_OF` (8), `PINS` (1 page), `verifyVendor` sources regex `bc0f378|1a1e33b`, `shoot2 IDS/FLAGS` (8), fidelity-check vs `bc0f378` | every one must become data | the core is frozen after HT-2 ("its own PR") | the 1st new plate |

Arithmetic: gz 153 × 22,219 = 3.40 MB. Gate 153 × 27.2 s = 69.4 min, plus 153 × 75 pairs × 0.35 s = 66.9 min. Fixtures 153 × 264,752 = 40.5 MB, 153 × 107,596 = 16.5 MB, 153 × 298,345 = 45.6 MB.

---

## 11. Engine readiness of the library (provisional)

My classification, from each id's name, equipment and pattern, checked against the primitive list and `SPEC.md` 8. It is not verified by rendering.

- **Done (8).**
- **E1, today's primitives are enough (65):**
  - barbell, dumbbell, bench and rack presses and flyes;
  - DB and BB curls;
  - rows;
  - chin-up, knee raise and pulldown variants with the lat bar or V-handle;
  - squats, lunges and deadlifts;
  - hip thrust and bridge;
  - floor core work and push-ups.
- **E2, needs a new primitive (61):**
  - Smith machine (5), EZ bar (4);
  - rope, stirrup and straight-bar cable handles (about 20 cable moves);
  - selectorised machines: pec deck, rear-delt, lateral raise, shoulder press, incline press, leg extension, 3 leg curls, hack and pendulum squat, horizontal leg press, hip ab and adduction, 2 calf machines, machine crunch, pullover, assisted pull-up, chest-supported row;
  - T-bar, landmine, dip station, roman chair, kettlebell (2), ab wheel, bands (2), single-arm pulldown handle.
- **E3, hits an engine limit (19):**
  - no whole-body yaw or lateral lean: side plank, Russian twist, bicycle crunch;
  - moves with several phases or repeating cycles that do not fit one start → end plate: burpee, mountain climbers, jumping jacks, high knees, bear crawl, box jump, jump squat, battle ropes, jump rope, walking lunge, slam, wall ball, sled push and pull, carry, renegade row.

---

## 12. Found while reading (for the supervisor)

- **HT-4 vendors the old golden-B pin.** #107's `layers/MANIFEST.json` pins `16a8edc` (page `472030…`, 2,451,995 B). Golden B is now `b3a90af` (page `5aab1aca…`, the compact copy). HT-5 onward would build old copy unless HT-4 moves to `b3a90af`.
- **The engine's own quality report is not a CI check.** A new plate with a label collision or a 1 cm contact miss would pass L0-L4, because those only prove "same as approved". At scale, `report.ok` should gate generation.
- **The golden-lock core has the 8 written into it by hand** (section 10, last row). Scaling needs a core-change PR first, and that PR must regenerate the 8 with no byte change.
- **One shared `inputsSha256`.** `gen/plates.mjs inputs()` lists every vendored file plus `GOLDEN.json`, so every plate module is stale whenever anything changes.

---

## 13. Levers the architecture can pull (each keeps the owner's quality rule)

- **Per-batch goldens.** One approved gallery page and pin per batch: L1 checks a list of pages, and `LIB_OF`, `PINS` and the source regex move into `plates.json` or `GOLDEN.json`. Per-exercise `inputsSha256`.
- **CI proof at 153 without dropping states.**
  - L2 bytes stay per plate on every run (they are cheap).
  - The pixel matrix gets sharded across more parallel jobs: about 7 shards per gate job type to fit 135 min under 20 min each. Adding jobs is a supervisor, add-only `.github` change.
  - Or the tz job runs only the TZ-sensitive blocks. Either way it needs a supervisor decision, because R14 says "states are never dropped".
- **Engine work first:**
  - primitives for E2 (rope, stirrup, Smith, EZ bar, a generic selectorised machine);
  - better auto-labels, to cut the 64 % hand-placed labels;
  - a fix for the 1 mm twin workaround.
  - An engine change must not move the approved plates' bytes (L1).
- **One shared close-up renderer driven by data**, replacing the per-exercise scripts. It is a golden-B update: it has to rebuild the 8 with `===` and 0 px.
- **`ids.ts`.**
  - At full coverage `hasHowTo` is just `!ex.custom`.
  - During rollout, a compact encoding (a bitset over the `exercises.json` order is about 28 chars), or hints per archetype instead of per id.
  - Changing the 2,048 B budget needs a decision.
- **Size.** HT-11 before about 40 plates (planned). The total-asset budget is re-set per batch by decision.
- **Owner load.**
  - Batches by archetype and equipment family (presses first, as planned).
  - A contact sheet that shows only the new plates, after a fresh reviewer has already passed them.
  - One APK device check per batch.
