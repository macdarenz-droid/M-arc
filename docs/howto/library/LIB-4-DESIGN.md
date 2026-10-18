# LIB-4: library CI design

Card LIB-4b (`docs/supervisor/verify/lib4-cards.md`, section 4), with rulings D-LIB4-SCOPE, D-LIB4-OPEN, D-LIB4-FIXTURE, D-LIB4-FIXTURE-2 and the design-note rulings in section 11 (11.1 wins). LIB-4b writes the runner, contract and fixture sections; LIB-4c adds a CI section.

Gate groups are named by their `gate.runs` key; `node scripts/gate-blocks.mjs --list` prints their lines.

## 1. Contract (fixed; LIB-4c codes against it)

- `libraryTuples(ids, { root }) → [{ id, theme, state }]` in `tools/plates/library/fidelity/tuples.mjs`, from source only:
  - callout and tell keys: the id's generated plate module `src/howto/generated/ht-<slug>.ts` (`normal` and `mistake` `{ firstKey, cues }`), bound to the pin (D-LIB4b-KEYS). `plateKeys` recomputes the `cues` fragment as `fragmentsOf` does and requires it to equal the pinned entry: the latest GOLDEN.json `plate` entry for the 8; for a library id, the latest `plate` entry in the one `tests/howto/golden/library/*.json` file that holds it, after every such file passes `verifyBatchChain`. It also requires `cues[0].key === firstKey`. Otherwise it throws, naming the id and the file; it never returns fewer tuples. `N:<k>`/`M:<k>` rows come from `cues.slice(1)`;
  - zoom keys, hand pages, feel rows, Show buttons, Grip and the push hint: `sourceOf(id)`;
  - `HT_THEMES`, `HT_FULL`, 390 px and `NARROW` = 360/340 px.
- Theme-less rows: a per-id row has theme `*` exactly when its width is `*` (L2, PQH, HT-4 A5 and the size rows). `libraryTuples` and the runner's `rowProblems` assert it. PQH has a browser half, so these rows are "theme-less", not "node-only".
- `LIB_ONCE.shard(k)`: `('shard-<k>', 'silent-black', 'self/0px@390')` and `('shard-<k>', 'silent-black', 'self/1px-control@390')`.
- `LIB_ONCE.run` (contract amendment, 11.1 item 8): `qa-selftest/browser@*`, `guard/L-sections@390`, `guard/HT7-l3text@390`, `guard/HT9-A3-dup@390`, all `('*', 'silent-black')`.
- `state` = `<check>/<sub-state>@<width or *>`; `parseState` reads it back, and every row's `check` and `width` must agree with it.
- `libraryFidelity(browser, port, { ids, pages, P = 1 }) → { rows, px, seconds, sizes, stats }`, with `pages[id] = { plates, layers }`. `px` maps each pixel tuple `id|theme|state` to its max px off. Rows follow `writeProof`'s shape and cover the tuples exactly once: a tuple nothing proved is a fail row ("not proven"), and a state proved from the DOM but not expected from the source is a fail row too.
- `onceStates(browser, port, k)`: the per-shard self rows; on shard 1 also `qa/selftest.mjs` and the three guards.
- CLI: `node tools/plates/library/fidelity.mjs --ids <golden8|id,…> [--P n] [--families …] [--themes …] [--fixture name:id]`, and `--once <k> [--blind <guard>]`.

## 2. D-LIB4-SCOPE table

2,947 tuples on the 8. "Gate prints" quotes the HT blocks' lines from the merged-head gate run (Chromium 141, 2026-10-17); the B1 test pins the mapping.

| Family | Source | State formula (per id) | Rows on the 8 | Gate prints |
|---|---|---|---|---|
| entry | HT-3 A1, A3 (`ht3Behaviour`) | `entry/open@390` (paper): one 44 px "How to do it" button; it opens the sheet at S0 (title = exercises.json name, eyebrow, one pressed callout = firstKey, no Mistake figure, Mistake off, ≤ 700 elements) | 8 | A1 per plate; S0 623 |
| L2 | plan 3.6 L2; HT-2 A9; HT-3b A2 | `L2/page@*` (plates page fragments = entry), `L2/chunk@*` (bundled chunk fragments = entry), `L2/chunk-size@*` (A9's 150 KB / 36 KB gz and the budgets.json entry) | 24 | A9 sizes = the row's sizes |
| L2b | `ht3Fidelity` | per theme `L2b/{title,N,M,sections}@390`; HT_FULL `L2b/N:<k>@390`, `L2b/M:<k>@390`, `L2b/M:restore@390`, `L2b/{N,M,sections}@{360,340}` | 328 | 216 L2b walks (+ 40 title + 72 sections) |
| F3 | `ht3Fidelity` | as L2b without title and sections | 216 | 216 F3 compares |
| L3 | `ht3Fidelity` | per theme `L3/{N,M,T2400,R-end}@390`; HT_FULL `L3/N:<k>`, `L3/M:<k>`, `L3/M:restore`, `L3/slot-api`, `L3/T{600,1200,1800}` `@390`, `L3/{N,M}@{360,340}` | 360 | 344 pixel pairs (+ 16 slot-api) |
| L4 | `ht3Fidelity` | per theme `L4/anims@390`; HT_FULL `L4/{ends,motion}@390` | 72 | 40 Trace lists (+ 32) |
| HT4 | HT-4 | `HT4/A5-{protected,fragments,poses}@*`; per theme `HT4/A6@390` | 64 | A6 8 × 5 |
| HT6 | HT-6 | hand id, per theme `HT6/{grip,page-<i>,open-anim,close-anim,A4,chip,reduced}@390`; HT_FULL `HT6/{A4-mistake,origin,A6,A8-hint}@390`; silent-black `HT6/{A7-lazy,back}@390` | 385 | 105 pages; A6 64 pairs (16 rows × 4); 16 origins |
| HT7 | HT-7 | per theme `HT7/A2@390`; paper `HT7/A2:reduced@390`; per posture key `HT7/<k>:{L3,L4,A4,restore,A5,chip}@390`; paper `HT7/<k>:reduced@390`; silent-black first key `HT7/<k>:control@390`; `HT7/A5-size@*` | 560 | 96 L3 pairs, 80 lists, 16 reduced, 8 controls |
| HT8 | HT-8 | per theme `HT8/{L4,S5-end,S4}@390`, `HT8/S6-<row>@390`; HT_FULL `HT8/{S5-mid,reduced}@390`; silent-black `HT8/{lazy,C12}@390`; `HT8/size@*` | 336 | 272 pairs, 40 lists, 32 rows |
| HT9 | HT-9 (C19, Show, Order, HT-9) | per theme `HT9/C19`, `HT9/{setup,risks,disclaimer}-{L3,copy}`, `HT9/A3`; HT_FULL `HT9/show-<n>`, `HT9/A5`; silent-black `HT9/order`; all `@390` | 378 | C19 40; Show 34 of 17; A1 120; A4 120; A3 40; A5 64 pairs |
| HT10 | `ht10Sweep`, `runHt10` | per theme `HT10/{sweep,reduced,a2}@390` | 120 | `HT10_PER_ID` tuples |
| PQH | LIB-3 `runQa` + `browserResults` | `PQH/PQ-H1@*` … `PQH/PQ-H10@*`, `PQH/flags@*`; each passes only when `report.ok` | 88 | selftest clean run |
| offline | HT-3b A4a | `offline/open@390` (silent-black), localStorage keys unchanged | 8 | squat only |

The hand-page rule (`wrong.length` + 1 with `thumbPage`) gives HT-6's 13 pages. PQ-H7's `s0` is the plate article's element count, not the app sheet's; the app sheet's S0 is in `entry/open`.

### Exemptions (ruled, 11.3)

| # | Check | Ruling |
|---|---|---|
| X1 | HT-1 golden self-check | Accepted: `LIB_ONCE.shard`. |
| X2 | HT-2 L1; HT-6 A7's 8-chunk count and the 8's hand ceilings | Accepted for these parts only (L1 every gate; library hands ship as `handpair-<key>`, LIB-4a's chunk sets). The other size checks are rows (D-LIB4b-SIZE). |
| X3 | `presentControls`; `ht3SectionGuards` | Accepted; the section guards become `guard/L-sections@390`. A3's S0 facts are in `entry/open`. |
| X4 | HT-3b A1, A3, A4b-d, A5 | Accepted once per run. A5's real coverage: HT-3b scans HowToSheet and the 8's ht- chunks; library chunks get C17 from HT-10 A4 `assets` and LIB-2 A26. A2 is the size rows. |
| X5 | HT-7's 30 label opens; the planted L3-text probes | Accepted; the probes run through T3 as `guard/HT7-l3text@390`. |
| X6 | HT-8 early chip; shimmer tripwire | Accepted. |
| X7 | HT-9 HT-3b A3 split; the A3 duplicate-line fixture | Accepted; the fixture runs through T5 as `guard/HT9-A3-dup@390`. |
| X8 | HT-4 L0-B | Accepted (LIB-4c L1 for library pages). |
| X8b | `validateLateralRaiseCrops` | Accepted (ref-src lateral raise only). |
| X8c | HT4-A6's `capture('#nope')` throw probe | Accepted (imported, covered by HT-4). |

`HT4/A5-poses@*` stays for every library id (D-LIB4b-POSES): the rule is derived from the reference spec and the id's How-to fault poses, never the 8's enumerated tables. On the 8, T1 keeps HT-4's exact path.

## 3. Twins

Every text a twin re-implements is pinned in `tools/plates/library/fidelity/twins/pins.json` as `{ key: { sha256, map } }` (D-LIB4b-TWINS). A gate group's text is `parseGate`'s `statements.map(s => src.slice(s.start, s.end)).join('\n')`; a function's text is its source plus, in file order, every non-exported module-level binding it reaches. B3 fails with "re-check the library twin" naming the key. `map` is the assertion map (D-LIB4b-MAP): each assertion of a pinned text, in order, to a state formula, an exemption id, `def` or `collect:<var>`.

| Twin | Pinned text | Re-implemented in |
|---|---|---|
| T1 | `gate:HT-4`; goldenB `classifyPose`, `classifyMistakePose`, `validateCalls`, `protectedFieldProblems`, `fragmentProblems` | `twins/ht4.mjs` |
| T2 | `gate:HT-6` | `twins/ht6.mjs` |
| T3 | `gate:HT-7` | `twins/ht7.mjs` |
| T4 | `gate:HT-8` | `twins/ht8.mjs` |
| T5 | `gate:HT-9` (4 statements) | `twins/ht9.mjs` |
| T6 | `gate:HT-3b` | `twins/offline.mjs`; `fidelity.mjs` `sizeJob` (A2) |
| T7 | `gate:HT-3`; harness `ht3Fidelity` (with `animList`, `freezeAt`, `unfreeze`, …) and `ht3Behaviour` | `fidelity/plate.mjs`; `fidelity.mjs` `entryJob`, launch args |
| T8 | `gate:HT-2` | `fidelity.mjs` `l2Job`, `sizeJob` |
| — | ht10.mjs `runHt10` | `fidelity.mjs` `ht10Job` (a2 composition, thresholds) |

Reused, not twinned: the harness primitives, `ht10Sweep`, goldenB.mjs's driver and exported checks, LIB-3's `runQa`/`browserResults`/`candidatesOf`.

## 4. Harness options (D-LIB4-OPEN, D-LIB4b-OPEN2)

Additive only; every default is today's value:
- `openAppTrain(…, { order = HT_ORDER, custom = HT_CUSTOM })`;
- `ht10Sweep(…, { order, custom, indexOf = id => HT_PLATES.findIndex(p => p[0] === id) })`, forwarding `order` and `custom`;
- `ht10GoldenCounts(browser, { html = readFileSync(HT10_GOLDEN_B), ids = HT_PLATES.map(p => p[0]) } = {})`.

## 5. Fixture (D-LIB4-FIXTURE, -2, -3, -4; D-LIB4b-F5, D-LIB4b-COPYEDITS)

Day-1 result (#232): LIB-2's generator at 54d37f2d emitted no plate or layer chunk for a library row. LIB-2b (on main) closes that gap. `tools/plates/library/fidelity/fixture.mjs` builds B5's scratch ids on a scratch tree only: LIB-4b's head plus #181 (LIB-6), never pushed.

- **Ids (11.1 items 5, 14).** There are 3 ids, each with its own pair key:
  - `lib_underhand_lat_pulldown` from `lat_pulldown` (`lib4b-scratch-a`);
  - `lib_chest_supported_row` from `seated_cable_row` (`-b`);
  - `lib_cable_chest_press` from `machine_chest_press` (`-c`).
  
  Each copies the source's spec and How-to. Each relative import is re-pointed at its original target, and the ids, name and research card are swapped. A byte-diff test proves nothing else differs. A spec id is never one of the 8's (D-LIB4b-POSES (5)). The shared-key proof belongs to LIB-7 (D-LIB4-FIXTURE-4).
- **Copy edits (D-LIB4b-COPYEDITS).** Two cues are edited minimally, and each edit names the refusal it answers:
  - the lat pulldown cue loses "top of the" (PQ-H8, 16 words);
  - the seated row cue becomes two sentences (PQ-H8, semicolon).
  
  Golden B's own two cues are golden-B follow-up 12 and are not changed.
- **Steps.**
  - `stage`: sources, the batch file `zz-lib4b.json` and its page configs.
  - `page`: the batch layers page, built by LIB-6 through `layersSpecOf`.
  - `pin`: the batch golden file over the tree's own plates and layers pages, plus a scratch QA card per id in LIB-3's shape. Its plateFacts come from the clone's own engine report, and its topFault is the selected Mistake tell. The step also writes the pair loader, each panel cut from that id's own block. Each scratch plate entry carries `exemptions: ['F5']`, with the 8's reason quoted verbatim (D-LIB4b-F5).
  - `budgets`: after `npm run build`, each `ht-`, `posture-` and `feel-` chunk at measured + 10 %.
  - `pages`: the runner's `--pages` file.
- **PQH.** LIB-2b's `candidateOf(id, { root, platesHtml, engine })` from `tools/plates/library/candidate.mjs`.
- **HT4-A5 for a library id (D-LIB4b-POSES).** `twins/ht4.mjs` `libraryA5` works on LIB-6's build of the id's batch page, captured through HT-4's recording shim on a mirror of `tools/plates`.
  - Each call is attributed to `base`, `cam`, the plate's `-n`/`-m`, or a declared posture zoom side. An unattributed call fails, and so does a declared side with no call.
  - Calls not on a Wrong side must draw a reference pose. A Wrong side may also draw its declared fault pose.
  - `fidelity/poses-proof.mjs` runs (7) on LIB-6's build of the 8.
- **Results.** See section 6.

## 6. Results

Filled in from the final-head runs (D-LIB4b-COUNTS: values quoted from the runs; "unverified" where a check was not run).
