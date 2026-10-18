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

Values are quoted from the runs (D-LIB4b-COUNTS); "unverified" means a check was not run. All runs used Chromium 141.0.7390.37 in the container (nproc 4).

### B5: library path, final tree

Tree: 575fa75 + #181 9b8f76e, scratch only. 575fa75 and this branch's later heads differ only in `.github/` and `docs/`. Steps: `fixture.mjs <tree> all`, `generate` and `--check` (PASS, 78 files), `npm run build`, fixture budgets.

- **Rows:** 1,100 of 1,100 pass, which equals `libraryTuples` of the 3 ids. Max px off is 0 on all 3. The run took 2,793.5 s at P=1.
- **Seconds per id:** underhand lat pulldown 933.3, chest-supported row 929.4, cable chest press 930.4.
- **Seconds per family:**

  | Family | Seconds |
  |---|---|
  | L2 | 0 |
  | HT7 | 201.9 |
  | HT8 | 228.4 |
  | PQH | 136.7 |
  | entry | 24.1 |
  | offline | 6.4 |
  | HT4 | 97.5 |
  | plate | 425.1 |
  | HT6 | 306.5 |
  | HT9 | 393.2 |
  | HT10 | 973.4 |

- **F5:** 3.57:1 on the 3 ids, the same as on lat pulldown, seated row and machine chest press (D-LIB4b-F5).
- **HT6/A7-lazy:** runs in a fresh browser context per (id, theme), because `openAppTrain` opens a new context.

**Mutations**

| Mutation | Result |
|---|---|
| (a) 1 px `translateX` on the chest-supported row's plate, page CSS | 68 of 357 plate rows fail, all of them that id's (L3 and L2b). The other two ids stay at 0 px. |
| (b) One source byte changed (that id's spec start tilt, 8 → 9) | Only that id's 11 PQH rows fail. PQH/PQ-H7 fails too, because the report is not ok; the root is PQ-H1 (measure 79.8 vs 87). A deliberately nondeterministic pulley radius did not trip `H7.determinism` (33 of 33 pass); why is unverified. |
| (c) Research card removed (cable chest press) | `QaRefused: plate QA refused lib_cable_chest_press: PQ-H6 no verified card plate facts` |
| (d) F5 exemption removed from the underhand lat pulldown | Only that id's `PQH/flags` fails ("F5 raised without a named exemption"); its other PQH rows fail as "report not ok". The re-pin is byte-identical. |
| (e) The seated row copy edit reverted | `QaRefused: plate QA refused lib_chest_supported_row: PQ-H8 normal.tall.cue "Sit tall; no rocking, the torso finishes upright.": semicolon` |
| POSES (7) | 48 calls; PASS. A Right override `{ base: 'end', pose: { neck: 4 } }` on the underhand pulldown's pad zoom fails only `HT4/A5-poses` (11 of 12 pass). |

### B7: P decision (dry run, 624d7e8 + LIB-4a 4a2c12e)

| P | Rows | Max px | Wall time |
|---|---|---|---|
| 1 | 2,947 of 2,947 | 0 | 7,511 s |
| 4 | 2,947 of 2,947 | 0 | 2,036 s |

- Rows and px are identical across all 1,009 pixel tuples, so `par.mjs` gives P = 4. That is a 3.69× speed-up.
- A forced 1-row difference keeps P = 1.

### B7: P decision on the final head (316679e)

Chromium 141.0.7390.37, nproc 4, `--ids golden8`, both runs on the same head and build.

| P | Rows | Max px | Wall time | Job seconds summed |
|---|---|---|---|---|
| 1 | 2,947 of 2,947 | 0 on all 8 | 8,422.3 s | 8,421 |
| 4 | 2,947 of 2,947 | 0 on all 8 | 2,379.7 s | 9,356 |

- `par.mjs p1.json p4.json 4 4`: "P = 4: identical rows and px" over 2,947 rows and 1,009 pixel tuples. Speed-up 3.54×; each job runs about 11 % longer under load.
- e607bb5 set `DEFAULT_P = 4`. **Withdrawn**: the B2 re-run at P = 4 on e607bb5 (Chromium 141) had 2,944 of 2,947 rows pass. The 3 red rows were machine chest press, paper, `HT9/show-1..3@390`. `settleApp` timed out after the tap on `machine-chest-press-step-4-show` (the hand close-up), so no frame was free of animations within 8 s. The other two rows failed only because the crash ended the loop. Chrome 153 at P = 4 on the same head was 2,947 of 2,947.
- Root cause: not found. Not reproduced in 4 further runs on that head with a local-only `settleApp` patch that logs what is still animating: one full run and three HT6/HT9/HT10 runs at P = 4. Not reproduced either by 10 to 40 standalone tap loops under 3 CPU hogs, CDP CPU throttling at 4, 8, 20 and 40, or IntersectionObserver callbacks delayed by 400 and 800 ms.
- One mechanism is proven to make `settleApp` hang: once the feel map's sweep (`feel-sweep`, 5,200 ms) has started, scrolling the map out of view pauses it (`useFeelMap.ts` hold observer, by design), and a paused animation stays in `document.getAnimations()`. That is not linked to this row: the feel sweep never started on the Show path in any repro.
- The cause cannot be shown not to depend on P, so the default is back to `DEFAULT_P = 1` (function and CLI). Unit test: the default is 1, and setting it to 4 turns that test red. The HT-9 Show twin's crash row now lists whatever is still animating, so a recurrence names its cause.
- Seconds per family at P=4 (summed job seconds): L2 0.2, entry 71.4, plate 1,511, HT4 466.1, HT6 1,077.1, HT7 705.7, HT8 799.2, HT9 1,243, HT10 2,896.6, PQH 555.7, offline 29.6.
- Chunk sizes from the P=4 run (raw/gz bytes) are identical to the P=1 run's.

### B2 and B8: the 8 on the final head, Chromium 141

Head 21c66d5, which holds LIB-4a 0b2d3c1 and main b99a9e2; later commits change only `docs/`. The run was `--ids golden8 --P 1`.

- **Rows:** 2,947 of 2,947 pass. Max px off is 0 on all 8 ids. The run took 7,522.1 s.
- **Seconds per id:**

  | Id | Seconds |
  |---|---|
  | lateral raise | 928.8 |
  | back squat | 934.3 |
  | pull-up | 934.9 |
  | hanging leg raise | 940.6 |
  | lat pulldown | 956.0 |
  | seated row | 949.1 |
  | leg press | 932.4 |
  | machine chest press | 945.4 |

- **Seconds per family:**

  | Family | Seconds |
  |---|---|
  | L2 | 0.1 |
  | HT7 | 553.0 |
  | HT8 | 625.9 |
  | PQH | 354.2 |
  | entry | 65.1 |
  | offline | 17.3 |
  | HT4 | 272.4 |
  | plate | 1,163.4 |
  | HT6 | 841.0 |
  | HT9 | 1,071.0 |
  | HT10 | 2,558.1 |

### B2, B5 and B8 to B10 on the final head

Heads: 7679566 (main 0628270), then 2b59a24 (main 2078913, LIB-3b: `qa/node.mjs` and `qa/index.mjs`). Chromium 141, nproc 4, default P = 1.

- **B2, Chromium 141, on 7679566.** `--ids golden8` ran in 4 family chunks because container restarts came about 1.5 h apart. Every chunk seeds the same 8 ids.

  | Chunk | Rows | Seconds |
  |---|---|---|
  | HT10 | 120 of 120 | 2,568.6 |
  | plate + HT4 | 1,040 of 1,040 | 1,436.4 |
  | HT9 + HT8 | 714 of 714 | 1,698.2 |
  | HT6 + HT7 + PQH + entry + L2 + offline | 1,073 of 1,073 | 1,810.6 |

  - The union against `libraryTuples(golden8)`: 2,947 rows, 2,947 unique, 0 missing, 0 extra, 0 fail.
  - 1,009 pixel tuples, max px off 0 on all 8 (HT-3 prints 0). Total 7,513.8 s.
  - On 2b59a24 the PQH family ran again because LIB-3b changed QA: 88 of 88 pass, 396.5 s.
- **B2, Chrome 153.0.8010.12** (CI run 39118115597, scratch 693bcff = e607bb5 plus the scratch workflow, P = 4): 2,947 of 2,947 pass, max px off 0 on all 8, 2,064.5 s.
- **B2 failure fixtures** (Chrome 153, silent-black, P = 4). The section pass guard was also run on Chromium 141.

  | Fixture | Result |
  |---|---|
  | `section:lib_dumbbell_lateral_raise` | Pass, as in HT-3's sections guard 1 (a pass guard): 356 of 356 rows. Lateral raise compared 16 pixel pairs (at least 4), max px off 0. |
  | `leak-section:lib_dumbbell_lateral_raise` | Exit 1. 27 red rows, all lateral raise L2b and L3. L2b catches the word-spacing leak, as in guard 2. |
  | `shift:lib_dumbbell_lateral_raise` | Exit 1. 16 red rows, all lateral raise L3. |
  | `ht10-inject:lib_barbell_back_squat` | Exit 1. 1 red row, back squat `HT10/sweep`. |

- **Size equalities** (gate on 7679566):
  - `L2/chunk-size` equals HT-2 A9's printed raw/gz for all 8 `ht-` chunks.
  - It also equals HT-3b A2's printed sizes for the same 8 chunks.
  - A2's `HowToSheet-*` budgets are build-wide (X4).
- **entry/open:** passes on the 8, in the HT6 + HT7 + PQH + entry + L2 + offline chunk.
- **B5 on the final tree** (2b59a24 + #181 9b8f76e, scratch only, never pushed):
  - Setup: `fixture.mjs <tree> all`, `generate` and `--check` (PASS, 78 files), `npm run build`, fixture budgets.
  - Result: 1,100 of 1,100 pass, equal to `libraryTuples` of the 3 ids. Max px off 0 on all 3. 2,907.0 s.
- **`--once 1`** (on 7679566): 6 of 6 pass:
  - `self/0px@390` and `self/1px-control@390` (shard 1);
  - `qa-selftest/browser@*`;
  - `guard/L-sections@390`, `guard/HT7-l3text@390` and `guard/HT9-A3-dup@390`.

  It took 1,194.7 s, of which the QA self-test took 1,125.4 s.
- **The 3 `--blind` runs** (`--skip-selftest`, so `qa-selftest/browser@*` reads "not proven"). Each turns only its own guard red:
  - `L-sections`: "guard 2: a section CSS leak into the golden block (.ht p word-spacing) was not caught by L2b while the sections were hidden";
  - `HT7-l3text`: "a path moved 1 px reads pass (undefined), not an immediate non-text failure";
  - `HT9-A3-dup`: "a second copy of the wrist red-flag line in Setup was not caught ([])".

  Each took about 67 s.
- **B8:** the per-id and per-family seconds are the tables above and in "B2 and B8". The once rows took 1,194.7 s at k = 1 (69.3 s without the self-test).
- **B9** (on 7679566, split as CI runs it): gate jobs 1/4 to 4/4 (UTC) PASS, 579 s, 817 s, 762 s and 927 s. `ht10-gate` 1/2 and 2/2 PASS (63 and 62 tuples). Mutations:
  - `openAppTrain`'s `order` default reversed: gate job 4/4 is red. HT-3 compares 0 pixel pairs (it expects at least 300), and a later block's `openHowTo` times out.
  - `ht10GoldenCounts`'s `ids` default without its first id: `ht10-gate` 1/2 is red ("golden B has no card for lateral-raise to count its Look closer chips", 15 problems).
- **B10** (on 2b59a24): `npm run check` (3,062 tests), `npm run test:tz` (3,062 in each time zone) and `generate --check` (60 files) pass. The gate passed on 7679566. Between the two heads only `tools/plates/library/qa/**`, one new test and docs changed.

### offline/open timeout (LIB-4c review, 10-18)

- **Report:** `lib_landmine_row silent-black offline/open@390: A4: offline reload did not render the app`, 2 of 2 runs, in LIB-4c's local `howto-shard 6/7` (Chromium 141). It was the third local occurrence; CI on Chrome 153 never showed it.
- **Not reproduced here** on the same tree (scratch 42716893 + LIB-4c 68f1556, `howto-rebuild`, `npm run build`):
  - `howto-shard 6/7`: 364 of 364 rows, 978.6 s;
  - the offline twin alone on `lib_landmine_row`: 2 of 2 pass.
- **What the message itself proves:** with no service worker, the offline `page.reload()` throws at once (`net::ERR_INTERNET_DISCONNECTED`; mutation: unregister the worker first). So in the report the reload got a document from the worker, but the app never started. The likely path is a cached `index.html` whose `/assets/` scripts were not in the cache. Which script was missing, and why, is unverified.
- **Built in:** when the reload renders no app, the row now records the page's URL, title and text, the worker's controller and registration states, each cache with its entry count, and the failed requests. It then stops, so the 30 s `htFlow` wait no longer hides the first failure. The twin's checks are unchanged.
  - Mutation: delete `/assets/index-*` from the cache before going offline. The row fails and names `/assets/index-….js net::ERR_FAILED`, `controller: true` and the app's "could not start" screen.
  - The 8: 8 of 8 offline rows pass.
