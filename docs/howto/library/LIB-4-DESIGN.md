# LIB-4: library CI design

Card LIB-4b (`docs/supervisor/verify/lib4-cards.md` on `claude/sup-lib4-cards`, section 4), rulings D-LIB4-SCOPE, D-LIB4-OPEN, D-LIB4-FIXTURE and D-LIB4-FIXTURE-2. LIB-4b writes the runner, contract and fixture sections; LIB-4c adds a CI section.

Line numbers are on LIB-4b's head (main c14212af + #189 + #180 + LIB-4a 0bfab28). Gate groups are named by their `gate.runs` key; `node scripts/gate-blocks.mjs --list` prints their lines.

## 1. Contract (fixed; LIB-4c codes against it)

- `libraryTuples(ids, { root }) → [{ id, theme, state }]` in `tools/plates/library/fidelity/tuples.mjs`, from source only:
  - callout and tell keys: the id's generated plate module `src/howto/generated/ht-<slug>.ts` (`normal.cues`, `mistake.cues`);
  - zoom keys, hand pages, feel rows, Show buttons, Grip and the push hint: `sourceOf(id)`;
  - `HT_THEMES`, `HT_FULL`, 390 px and `NARROW` = 360/340 px.
- `LIB_ONCE.shard(k)`: `('shard-<k>', 'silent-black', 'self/0px@390')` and `('shard-<k>', 'silent-black', 'self/1px-control@390')`. `LIB_ONCE.run`: `('*', 'silent-black', 'qa-selftest/browser@*')`.
- `state` = `<check>/<sub-state>@<width or *>`. `parseState` reads it back; the runner asserts each row's `check` and `width` against it.
- Node-only checks (L2, PQH, HT-4 A5) carry theme `*`.
- `libraryFidelity(browser, port, { ids, pages, P = 1 }) → { rows, px, seconds, stats }`, `pages[id] = { plates, layers }`. Rows follow `writeProof`'s shape. Keys are enumerated from the DOM.
- `onceStates(browser, port, k)`: the per-shard self rows; shard 1 also runs `qa/selftest.mjs`.

**Correction to the card's source list.** The card names "the batch golden entry (callout and tell keys)". A golden entry holds only fragment sha256s (`GOLDEN.json` entries; plan 3.5 for batch files), so it has no keys. The keys come from the generated plate module instead. `generate --check` already holds that module to the pinned entry (the L2 row checks it per id).

## 2. D-LIB4-SCOPE table

Counts are on the 8, from `libraryTuples` (2,907 tuples: 357-369 per id). "Gate prints" is the count the HT block observes and prints on this head.

| Family | Source (block, line) | State formula (per id) | Rows on the 8 | Gate prints |
|---|---|---|---|---|
| entry | HT-3 A1, `ht3Behaviour` harness.mjs:801 | `entry/open@390` (paper): one 44 px "How to do it" button; tapping it opens the sheet | 8 | A1 per plate |
| L2 | plan 3.6 L2; HT-2 A9 sg.mjs:6496; `gen/plates.mjs` `problemsOf` | `L2/page@*`: the plates page's fragments = the entry; `L2/chunk@*`: the bundled `ht-<slug>` chunk's fragments = the entry | 16 | A9 per row |
| L2b | `ht3Fidelity` harness.mjs:614 | per theme: `L2b/title@390`, `L2b/N@390`, `L2b/M@390`, `L2b/sections@390`; HT_FULL: `L2b/N:<k>@390` per normal key after the first, `L2b/M:<k>@390` per tell after the first, `L2b/M:restore@390`, `L2b/{N,M,sections}@{360,340}` | 328 | `l2b` walks |
| F3 | `ht3Fidelity` | as L2b, without title and sections | 216 | `f3` compares |
| L3 | `ht3Fidelity` | per theme: `L3/{N,M,T2400,R-end}@390`; HT_FULL: `L3/N:<k>`, `L3/M:<k>`, `L3/M:restore`, `L3/slot-api` (HT3-A6), `L3/T{600,1200,1800}`, all `@390`, and `L3/{N,M}@{360,340}` | 360 (344 pixel pairs + 16 slot-api) | `pairs` ≥ 300 |
| L4 | `ht3Fidelity` | per theme `L4/anims@390`; HT_FULL `L4/ends@390` (Trace ends by itself, aria-pressed false), `L4/motion@390` (0.6 s ≠ 2.4 s) | 72 | `anims` |
| HT4 | HT-4 sg.mjs:7476 (A5, A6) | `HT4/A5-{protected,fragments,poses}@*`; per theme `HT4/A6@390` (state-driver self-check on the id's layers page) | 64 | A6 40 passes |
| HT6 | HT-6 sg.mjs:6582 | for an id with a hand zoom, per theme: `HT6/grip`, `HT6/page-<i>` (L3, C16, words and icons), `HT6/{open-anim,close-anim,A4,chip,reduced}`; HT_FULL `HT6/{A4-mistake,origin,A6-N,A6-M,A8-hint}`; silent-black `HT6/{A7-lazy,back}`; all `@390` | 401 | 105 pages, A6 ≥ 32 |
| HT7 | HT-7 sg.mjs:7171 | per posture key `k`, per theme: `HT7/<k>:{L3,L4,A4,restore,A5,chip}@390`; paper `HT7/<k>:reduced@390`; silent-black, first key `HT7/<k>:control@390` | 504 | pairs ≥ 80 |
| HT8 | HT-8 sg.mjs:7967 | per theme: `HT8/{L4,S5-end,S4}@390`, `HT8/S6-<row>@390` per feel row; HT_FULL `HT8/{S5-mid,reduced}@390`; silent-black `HT8/{lazy,C12}@390` | 328 | pairs ≥ 200 |
| HT9 | HT-9 group sg.mjs:7575 (C19, Show, Order, HT-9) | per theme: `HT9/C19`, `HT9/{setup,risks,disclaimer}-{L3,copy}`, `HT9/A3`; HT_FULL `HT9/show-<n>` per Show button, `HT9/A5-{N,M}`; silent-black `HT9/order`; all `@390` | 394 | Show 17, A1 120, A5 ≥ 32 |
| HT10 | `ht10Sweep` harness.mjs:1307, `runHt10` ht10.mjs | per theme `HT10/{sweep,reduced,a2}@390` (`HT10_PER_ID`) | 120 | 8 × 5 × 3 |
| PQH | LIB-3 `runQa` (qa/index.mjs:30) with `browserResults` | `PQH/PQ-H1@*` … `PQH/PQ-H10@*`, `PQH/flags@*`; each passes only when `report.ok` | 88 | selftest clean run |
| offline | HT-3b A4a sg.mjs:6842 | `offline/open@390` (silent-black): offline reload, then this id's sheet opens | 8 | squat only |

The hand-page rule (`wrong.length` + 1 with `thumbPage`) gives 13 pages on the 8, HT-6's own count. B1 pins it.

### Exemptions (each needs the supervisor's named ruling)

| # | Check | Why it is not a per-id row |
|---|---|---|
| X1 | HT-1 golden self-check | Once per shard: `LIB_ONCE.shard`. |
| X2 | HT-2 L1, A9 sizes; HT-6 A7, HT-7 A5 and HT-8 chunk sizes | Build-wide chunk facts. They are covered by LIB-2's budgets rule (L2-A23, A25), LIB-4a's exact chunk sets and HT-10 A4 totals. LIB-4c's L1 covers page rebuilds. |
| X3 | HT-3 `ht3Behaviour` A3/A8 (S0 element budget, Back, drag-to-close, focus, no stored data), `presentControls`, `ht3SectionGuards` | Sheet-component behaviour and harness controls, proven on one plate. HT10 `a2`/`sweep` cover S0 and A2 per id. |
| X4 | HT-3b A1-A3, A4b-d, A5 | Build-wide or once-per-run (main chunk, budgets, launch speed, build-B carry-over, chunk-load toast, PlateSheet chip, C17). A4a is per id: `offline`. |
| X5 | HT-7 D-HT7-L3-text-9 (30 opens of the squat's "Bony bump") and the planted L3-text probes (leg press foot) | They pin one flake fix and prove the L3 text rule itself. The twin uses the same `l3`/`reopen` rule for every id. |
| X6 | HT-8 early "Feel it" chip and the shimmer tripwire | Once-per-run behaviour and perf on one plate; HT-10 `speed` is once per run. |
| X7 | HT-9 HT-3b A3 split and the A3 duplicate-line fixture | Once per run (plate index 0). |
| X8 | HT-4 L0-B; HT-4 A5 `poses` for library ids | L0-B is golden B's lock (LIB-4c L1 for library pages). `validateCalls` checks against `ENUMERATED_POSES`, which lists the 8's poses only. **Question:** exempt `HT4/A5-poses` for library ids (PQ-H covers poses), or keep the row and add a library pose list (LIB-2b or LIB-9)? Until ruled, the row stays and is red for a library id. |

## 3. Twins

The per-id checks that live in gate blocks cannot be imported. The runner re-implements each one in `tools/plates/library/fidelity/twins/`. Each twin carries `{ key, sha256 }`: its gate group and the sha256 of `parseGate`'s text of that group. B3's test fails ("re-check the library twin") when a pinned group changes.

| Twin | Gate group | What it re-implements per id |
|---|---|---|
| T1 | `HT-4` | A5 protected fields, fragments and poses; A6 `selfCheck` per theme |
| T2 | `HT-6` | grip and hand pages L3, words and icons, C16, C11 open/close and reduced, A4 (open, close, Mistake, Back), origin from Mistake, chip box, A6, A7 lazy load, A8 hint |
| T3 | `HT-7` | posture L3 (with the D-HT7-L3-text re-open rule and the 0.5 px control), L4, C18, A4, restore, A5 fetch, A6 halves and chip, A2 |
| T4 | `HT-8` | L4 band list, S5/S4/S6 L3, C12, reduced rest, lazy chunk, row boxes |
| T5 | `HT-9` (4 statements: C19, Show, Order, HT-9) | C19, Show by id, order, Setup/Risks/disclaimer L3 and copy, A3, A5 |
| T6 | `HT-3b` | A4a: offline open per id |
| T7 | `HT-3` | the HT-3 thresholds (pairs, controls) |

Also pinned, as a stricter extension of B3: the source text of `ht3Fidelity` and `ht3Behaviour` (harness.mjs). The runner's L-family re-implements `ht3Fidelity` (the card: read, do not reuse), so a harness edit must also re-check it.

Reused, not twinned: the harness primitives (`openAppTrain`, `openHowTo`, `openGolden`, `region`, `capture`, `diffPng`, `meetsRule`, `presentGolden`, `ownLayers`, `l2bWalk`, `blockMarkup`, …), `ht10Sweep`, goldenB.mjs's driver, and LIB-3's `runQa`/`browserResults`/`candidatesOf`.

## 4. Harness options (D-LIB4-OPEN)

Additive only; the defaults keep every existing call byte-identical in behaviour:
- `openAppTrain(…, { order = HT_ORDER, custom = HT_CUSTOM })`;
- `ht10Sweep(…, { order, custom, indexOf = id => HT_PLATES.findIndex(p => p[0] === id) })`, forwarding `order` and `custom` to its `openAppTrain`;
- **further option needed:** `ht10GoldenCounts(browser, { html = readFileSync(HT10_GOLDEN_B), ids = HT_PLATES.map(p => p[0]) })`. The sweep's tap counts (chips, Show buttons, feel rows) must come from the id's own layers page.

## 5. Fixture (D-LIB4-FIXTURE, D-LIB4-FIXTURE-2)

Day-1 result (#232): LIB-2's generator at 54d37f2d emits no plate or layer chunk for a library row, and its per-output inputs leave out the composers a How-to imports. Ruling D-LIB4-FIXTURE-2: card LIB-2b fixes both. B5 runs once LIB-2b posts READY. `fidelity/fixture.mjs` then builds 3 scratch ids from the 8's specs and golden-B How-to sources (id and chromeId swapped), with pages from `buildPlatesPage` and LIB-6's `build-layers-page.mjs`, on a scratch branch only.

**PQH for a library id** needs a QA candidate (`qa/index.mjs` header: "LIB-2 supplies one per library id"). No builder exists on #189. Until LIB-2b or LIB-9 supplies one, a library id's PQH rows fail; they are never skipped (B6).
