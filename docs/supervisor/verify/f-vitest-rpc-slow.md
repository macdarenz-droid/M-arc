# Slowest tests on M/ARC main

Commit: 5bcbddcf. Tests: 5442, files: 272. Test of 10 s or more: 62. Run wall time: 1291.69 s.

## (a) 30 slowest tests

| # | file | test | seconds |
|---|---|---|---|
| 1 | tests/howto/library-ci.test.ts | C4 class 3: the per-output inputs map, proven against every generated header D-LIB4c-3: a new composer imported only by the fixture id's spec selects all (ids.ts, ids-node.mjs and sources.json list it); a path only per-id files list (the batch's layersConfig) selects that id; one the 8's outputs list selects all | 201.20 **(>=10s)** |
| 2 | tests/howto/library-lint.test.ts | LIB-5 S7 generator cases: E1's row in per-case copies of E1's tree (D-LIB5-FIXTURE) cases, each refused with its exact message; the control (inherit []) and the unedited tree generate | 116.92 **(>=10s)** |
| 3 | tests/howto/lib-5v.test.ts | LIB-5v V3/V4: the generator refuses a bad line on any shipped row (E1's tree) cases (1)-(4) and the 450 case, each with its exact message; a clean line generates and ships | 65.56 **(>=10s)** |
| 4 | tests/howto/c15-stamps.test.ts | LIB-5 Do 6: the stamp gate in E1's tree (D-LIB5-SCRATCH 3, 7; S8) mutations, each red: entries emptied (every shipped id named, while checkC15 passes the empty file); marker removed; E1's stamp dropped | 64.17 **(>=10s)** |
| 5 | tests/howto/library-shared.test.ts | LIB-5 S4: E1's row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS) mutations through the generator, each red: a box over its named 50; a kept trigger dropped; nhs-back removed from boxClaim | 56.19 **(>=10s)** |
| 6 | tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) mutations: each zoom removed is red on the plate-scale bar; resistance_band_pull_apart at k 1.5 and bench_dip's trace on the still heel are red at the zoom | 55.62 **(>=10s)** |
| 7 | tests/howto/library-ci.test.ts | C4 class 3: the per-output inputs map, proven against every generated header the map is proven on the real tree and on the fixture tree: every header equals inputsSha256(writers, collected inputs) | 44.28 **(>=10s)** |
| 8 | tests/howto/library-rows.test.ts | E1/E3/E7 failure paths: the generator throws, naming the id and the file 7 mutations, each refused | 42.42 **(>=10s)** |
| 9 | tests/howto/lib-4d.test.ts | LIB-4d R2: ownRowsTree drops every batch row, its golden file, its pages and the files only it had; else it is the plain copy | 40.37 **(>=10s)** |
| 10 | tests/howto/library-core.test.ts | L2-A4: a new library batch row stales none of the 8's generated files with a synthetic batch row, the 54 fingerprinted files keep their header and the 8 ht- modules their hashes: line; the id files see the row | 39.26 **(>=10s)** |
| 11 | tests/howto/lb8-plates.test.ts | LIB-18 A4: runQa node half on an LB8 plate (lib_hack_squat), LIB-3 M1-M7 and a colour literal A4 M1 a label 1 px onto the figure (the Thighs to parallel callout) turns PQ-H1 red; 1 px back is clean | 34.60 **(>=10s)** |
| 12 | tests/howto/lb8-plates.test.ts | LIB-18 A15 (D-LIB18-PADS): no pad, roller, seat or bench sits inside the body, on every drawn LB8 spec each named item clears the body or touches it within 0.5 cm, in every pose, via and ghost (depths logged) | 27.29 **(>=10s)** |
| 13 | tests/howto/library-shared.test.ts | LIB-5 S4: E1's row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS) control: the unedited tree generates and writes red-flag-back.ts; with the card removed QA refuses first (PQ-H6) | 25.36 **(>=10s)** |
| 14 | tests/library/lib7b.test.ts | 7b-A2 on a scratch tree: the real pipeline with the scratch rows shipped on real LIB-7 keys generate: each pair row's zoom-<chromeId>.css (hands.mjs + handpairs.mjs) holds its pair scope's rules before HX_TAIL; the handpair files are written | 23.94 **(>=10s)** |
| 15 | tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) each zoomed spec asks for its ruled zoom, and its plate fails PQ-H3 on that view at plate scale (why the zoom exists) | 23.79 **(>=10s)** |
| 16 | tests/howto/library-rows.test.ts | E1: a shipped library row gets every output generate --check and npm run build pass on the tree | 23.57 **(>=10s)** |
| 17 | tests/howto/lb5-plates.test.ts | LIB-15 A9: nothing ships (D-LIB15-AHEAD) generate --check is green, and no generated file is read from lb5/, the LB5 specs, the composer or How-to sources | 22.93 **(>=10s)** |
| 18 | tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) the node half has no problem on either zoomed plate; the bar is met inside the circle at k, never lowered | 22.62 **(>=10s)** |
| 19 | tests/howto/lb3-plates.test.ts | LIB-13 A9: nothing ships (D-LIB13-AHEAD) generate --check is green, and no generated file is read from lb3/, the LB3 specs, composers or How-to sources | 21.61 **(>=10s)** |
| 20 | tests/howto/lb6-plates.test.ts | LIB-16 A9: nothing ships (D-LIB16-AHEAD) generate --check is green, and no generated file is read from lb6/, the LB6 specs, the composers or How-to sources | 21.31 **(>=10s)** |
| 21 | tests/howto/lb7-plates.test.ts | LIB-17 A10: the LB7 plates page is deterministic (PQ-H7) two builds of the LB7 rows are byte-identical | 21.06 **(>=10s)** |
| 22 | tests/howto/lb2-plates.test.ts | LIB-10 A9: nothing ships (D-LIB10-AHEAD) generate --check is green, and no generated file is read from lb2/, the LB2 specs, composers or How-to sources | 21.00 **(>=10s)** |
| 23 | tests/howto/c15-stamps.test.ts | LIB-5 Do 6: the stamp gate in E1's tree (D-LIB5-SCRATCH 3, 7; S8) fixtureTree() marks the tree and writes one scratch stamp for E1, and generate passes the gate | 20.79 **(>=10s)** |
| 24 | tests/howto/lb1-plates.test.ts | LIB-9a A9: nothing ships (D-LIB4-ENTRY-2) generate --check is green, and no generated file is read from lb1/, the LB1 specs or How-to sources | 20.57 **(>=10s)** |
| 25 | tests/howto/lb4-plates.test.ts | LIB-14 A9: nothing ships (D-LIB14-AHEAD) generate --check is green, and no generated file is read from lb4/, the LB4 specs, the wall composer or How-to sources | 20.51 **(>=10s)** |
| 26 | tests/howto/library-ci.test.ts | C4 class 3: the per-output inputs map, proven against every generated header class 3 is off when the map is not proven: its paths fall to class 4 | 20.02 **(>=10s)** |
| 27 | tests/howto/lb8-plates.test.ts | LIB-18 A9: nothing ships (D-LIB18-AHEAD) generate --check is green, and no generated file is read from lb8/, the LB8 specs, composers or How-to sources | 20.01 **(>=10s)** |
| 28 | tests/howto/lb9-plates.test.ts | LIB-21 A9 (D-LIB21-AHEAD): the rows never ship; generate is unchanged generate --check is green, and no generated file reads lb9/, the LB9 specs, composers or How-to sources (awaited child process) | 19.87 **(>=10s)** |
| 29 | tests/howto/lb7-plates.test.ts | LIB-17 A9: nothing ships (D-LIB17-AHEAD) generate --check is green, and no generated file is read from lb7/, the LB7 specs, dipBars or How-to sources | 19.51 **(>=10s)** |
| 30 | tests/howto/library-qa-h10-child.test.ts | LIB-3c 3c-A4 PARAMS ranges (D-LIB10-RANGES, D-LIB3c-SHARED) pinned envelope: no family, no key or no file gives H10.envelope; a test envelope that names the key is the fallback | 19.44 **(>=10s)** |

## (b) per file

Total = sum of test durations. Wall = file end minus start (includes setup and import).

| file | tests | total s | wall s | slowest test | slowest s |
|---|---|---|---|---|---|
| tests/howto/lb8-plates.test.ts | 448 | 321.12 **(>=10s)** | 336.10 | LIB-18 A4: runQa node half on an LB8 plate (lib_hack_squat), LIB-3 M1-M7 and a colour literal A4 M1 a label 1 px onto the figure (the Thighs to parallel callout) turns PQ-H1 red; 1 px back is clean | 34.60 **(>=10s)** |
| tests/howto/lb7-plates.test.ts | 209 | 303.99 **(>=10s)** | 319.37 | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) mutations: each zoom removed is red on the plate-scale bar; resistance_band_pull_apart at k 1.5 and bench_dip's trace on the still heel are red at the zoom | 55.62 **(>=10s)** |
| tests/howto/library-ci.test.ts | 59 | 281.35 **(>=10s)** | 380.26 | C4 class 3: the per-output inputs map, proven against every generated header D-LIB4c-3: a new composer imported only by the fixture id's spec selects all (ids.ts, ids-node.mjs and sources.json list it); a path only per-id files list (the batch's layersConfig) selects that id; one the 8's outputs list selects all | 201.20 **(>=10s)** |
| tests/howto/lb5-plates.test.ts | 89 | 139.68 **(>=10s)** | 140.32 | LIB-15 A9: nothing ships (D-LIB15-AHEAD) generate --check is green, and no generated file is read from lb5/, the LB5 specs, the composer or How-to sources | 22.93 **(>=10s)** |
| tests/howto/library-shared.test.ts | 31 | 132.78 **(>=10s)** | 151.42 | LIB-5 S4: E1's row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS) mutations through the generator, each red: a box over its named 50; a kept trigger dropped; nhs-back removed from boxClaim | 56.19 **(>=10s)** |
| tests/howto/lb4-plates.test.ts | 116 | 122.93 **(>=10s)** | 123.54 | LIB-14 A9: nothing ships (D-LIB14-AHEAD) generate --check is green, and no generated file is read from lb4/, the LB4 specs, the wall composer or How-to sources | 20.51 **(>=10s)** |
| tests/howto/library-lint.test.ts | 28 | 117.80 **(>=10s)** | 138.70 | LIB-5 S7 generator cases: E1's row in per-case copies of E1's tree (D-LIB5-FIXTURE) cases, each refused with its exact message; the control (inherit []) and the unedited tree generate | 116.92 **(>=10s)** |
| tests/howto/lb3-plates.test.ts | 108 | 106.77 **(>=10s)** | 107.95 | LIB-13 A9: nothing ships (D-LIB13-AHEAD) generate --check is green, and no generated file is read from lb3/, the LB3 specs, composers or How-to sources | 21.61 **(>=10s)** |
| tests/howto/lb10-plates.test.ts | 167 | 105.67 **(>=10s)** | 105.68 | LIB-22 A15: Mistakes, tells, cues, callouts, leaders and soft bends (DESIGN.md sections 8-12) every callout and tell anchor sits on an item drawn in its pose (within 3 px) | 17.13 **(>=10s)** |
| tests/howto/lib8r-pilot-a3.test.ts | 50 | 105.57 **(>=10s)** | 108.64 | PILOT-A3 A8, A10: runQa node half on each plate, the zooms, the fly chunk, LIB-3 M1-M7 (moved from :330-331) A4, A7 mutations: the next k down (reverse_lunge 2.5, dumbbell_fly 2) turns H3 red | 13.66 **(>=10s)** |
| tests/howto/library-qa.test.ts | 56 | 101.86 **(>=10s)** | 101.88 | LIB-3 mutations: each check turns red on its planted mutation, the clean target does not M1 turns red | 8.26 |
| tests/howto/library-qa-h10.test.ts | 18 | 96.91 **(>=10s)** | 96.91 | LIB-3b PQ-H10 on the real path 3b-A10 a malformed envelope row fails closed | 12.66 **(>=10s)** |
| tests/howto/lb6-plates.test.ts | 131 | 96.27 **(>=10s)** | 98.29 | LIB-16 A9: nothing ships (D-LIB16-AHEAD) generate --check is green, and no generated file is read from lb6/, the LB6 specs, the composers or How-to sources | 21.31 **(>=10s)** |
| tests/howto/c15-stamps.test.ts | 11 | 86.10 **(>=10s)** | 107.52 | LIB-5 Do 6: the stamp gate in E1's tree (D-LIB5-SCRATCH 3, 7; S8) mutations, each red: entries emptied (every shipped id named, while checkC15 passes the empty file); marker removed; E1's stamp dropped | 64.17 **(>=10s)** |
| tests/howto/library-rows.test.ts | 32 | 84.42 **(>=10s)** | 84.43 | E1/E3/E7 failure paths: the generator throws, naming the id and the file 7 mutations, each refused | 42.42 **(>=10s)** |
| tests/howto/lb1-plates.test.ts | 106 | 84.21 **(>=10s)** | 84.24 | LIB-9a A9: nothing ships (D-LIB4-ENTRY-2) generate --check is green, and no generated file is read from lb1/, the LB1 specs or How-to sources | 20.57 **(>=10s)** |
| tests/howto/library-qa-h10-child.test.ts | 14 | 78.52 **(>=10s)** | 78.53 | LIB-3c 3c-A4 PARAMS ranges (D-LIB10-RANGES, D-LIB3c-SHARED) pinned envelope: no family, no key or no file gives H10.envelope; a test envelope that names the key is the fallback | 19.44 **(>=10s)** |
| tests/howto/lb9-plates.test.ts | 178 | 74.87 **(>=10s)** | 75.64 | LIB-21 A9 (D-LIB21-AHEAD): the rows never ship; generate is unchanged generate --check is green, and no generated file reads lb9/, the LB9 specs, composers or How-to sources (awaited child process) | 19.87 **(>=10s)** |
| tests/howto/lib-5v.test.ts | 12 | 65.92 **(>=10s)** | 83.90 | LIB-5v V3/V4: the generator refuses a bad line on any shipped row (E1's tree) cases (1)-(4) and the 450 case, each with its exact message; a clean line generates and ships | 65.56 **(>=10s)** |
| tests/howto/lb2-plates.test.ts | 97 | 63.89 **(>=10s)** | 64.50 | LIB-10 A9: nothing ships (D-LIB10-AHEAD) generate --check is green, and no generated file is read from lb2/, the LB2 specs, composers or How-to sources | 21.00 **(>=10s)** |
| tests/howto/library-core.test.ts | 39 | 49.96 **(>=10s)** | 49.99 | L2-A4: a new library batch row stales none of the 8's generated files with a synthetic batch row, the 54 fingerprinted files keep their header and the 8 ht- modules their hashes: line; the id files see the row | 39.26 **(>=10s)** |
| tests/howto/lib8r-pilot-a2.test.ts | 28 | 43.43 **(>=10s)** | 45.02 | LIB-8R A2, A3, A12, A13: the PILOT-A2 pin (Do 7) and the untouched pilot A and pilot B pins A2: pilot A and pilot B rebuild to their pinned pages, and each pinned plate equals its golden fragments (153 equalities) | 8.67 |
| tests/howto/lib-4d.test.ts | 4 | 40.57 **(>=10s)** | 40.57 | LIB-4d R2: ownRowsTree drops every batch row, its golden file, its pages and the files only it had; else it is the plain copy | 40.37 **(>=10s)** |
| tests/howto/lib-zoom.test.ts | 19 | 39.59 **(>=10s)** | 39.60 | LIB-ZOOM mutations: each row turns red on its planted fault normal-view zoom: the source ring moved 30 px off the trace, and the trace cut short inside the circle | 8.32 |
| tests/howto/lib-strip.test.ts | 21 | 27.86 **(>=10s)** | 28.36 | A7, A8: H6 and H8 through runQa on a candidate built from the fixture card H6: silent on the card and on the 8; each new key fires on its case | 14.31 **(>=10s)** |
| tests/library/lib7b.test.ts | 14 | 25.28 **(>=10s)** | 25.28 | 7b-A2 on a scratch tree: the real pipeline with the scratch rows shipped on real LIB-7 keys generate: each pair row's zoom-<chromeId>.css (hands.mjs + handpairs.mjs) holds its pair scope's rules before HX_TAIL; the handpair files are written | 23.94 **(>=10s)** |
| tests/library/hand-pairs.test.ts | 47 | 19.72 **(>=10s)** | 19.74 | LIB-7 A1: golden B unchanged with every hand-*.mjs loaded the 8 close-ups === the frozen golden-B scripts (LIB-6 compare), after loading all key modules | 11.12 **(>=10s)** |
| tests/howto/library-qa-h7.test.ts | 12 | 18.49 **(>=10s)** | 18.49 | LIB-3c 3c-A2 PQ-H7 from a fresh import (library row) control: the unedited spec gives no PQ-H7 problem | 2.66 |
| tests/howto/f-zoom-2.test.ts | 13 | 16.57 **(>=10s)** | 16.57 | F-ZOOM-2 A2-A4: renegade_row released at k 3 A3 red: k 2 (11.28 px) and k 1.5 (8.46 px) are under the 11.39 px bar | 5.37 |
| tests/howto/lib8-pin.test.ts | 39 | 16.01 **(>=10s)** | 16.02 | LIB-8M A10: the pilot A page through the registry a second build gives the same bytes | 7.34 |
| tests/howto/library-cards8.test.ts | 14 | 15.68 **(>=10s)** | 35.00 | LIB-5 S3 and S12 on the S3 fixture card: candidateOf and runQa in a copy of E1's tree (D-LIB5-FIXTURE 4) mutations through researchOf and runQa, each red | 13.00 **(>=10s)** |
| tests/library/closeups.test.ts | 5 | 12.65 **(>=10s)** | 12.65 | LIB-6 close-up renderer, API level every close-up string of all 8 === the frozen golden-B script's | 10.61 **(>=10s)** |
| tests/howto/library-manifest.test.ts | 4 | 12.61 **(>=10s)** | 32.25 | C0: L0-lib on this tree MANIFEST.json lists exactly the pinned rows: pilot A's 13, pilot B's 4, PILOT-A2's 2 and PILOT-A3's 2 here, and no problem | 7.30 |
| tests/library/hand-views.test.ts | 32 | 11.86 **(>=10s)** | 11.86 | LIB-12 A1: golden B's 8 close-ups unchanged with every hand-*.mjs loaded compareCloseups on the 8 === [] after all key modules are imported | 9.02 |
| tests/library/layers-engine.test.ts | 5 | 10.56 **(>=10s)** | 10.56 | LIB-6-PM engine per plate the 8's page is still golden B (PAGE_SHA256), with every new patch applied | 8.04 |
| tests/howto/lib11-pilot-b.test.ts | 46 | 6.70 | 7.89 | LIB-11 A9: the pilot B plates page is deterministic (PQ-H7) two builds give the same sha256 | 2.07 |
| tests/gate-split.test.ts | 29 | 6.22 | 6.23 | E3: job selection is a partition unset, empty and 1/1 each run every group and write -1of1; K = 3 jobs are disjoint and cover every group | 1.56 |
| tests/howto/delta.test.ts | 10 | 5.47 | 5.47 | HT-11 D5: each base chunk ships at least 35 % fewer gz bytes than on main 565ea5a4 a vite build of this tree: each built ht-<slug>-*.js gz <= 65 % of its main value | 5.00 |
| tests/library/layers-back.test.ts | 3 | 4.86 | 4.86 | LIB-6-PM back box on the layers page the back-flagged page rejects with LIB-5's placeholder: the child prints Error: <id>: BACK_BOX_WAITS | 1.81 |
| tests/library/lib7-fix.test.ts | 29 | 3.55 | 3.55 | LIB-7-FIX PK4: adding a key moves no existing key's files (b) files: a scratch worktree of HEAD with a new key module and words file lists the same files, bytes and closure | 0.93 |
| tests/escobar/loop.test.ts | 32 | 2.90 | 2.91 | agent loop (§13) runs a full 6-step conversation: parallel reads, a chart, a proposal, a memory write and a repair round | 0.30 |
| tests/howto/library-fidelity.test.ts | 28 | 2.81 | 2.81 | LIB-4b contract every tuple of the 8 is unique per (id, theme), names a known check and encodes its width | 0.87 |
| tests/howto/library-manifest-back.test.ts | 4 | 2.72 | 2.72 | LIB-6-PM L0-lib back line (D-LIB6PM-L0) mutation: one byte of the tree's back-pain-box.json is red in C0, naming the file | 1.13 |
| tests/ci-verdict.test.ts | 22 | 2.38 | 2.39 | E5: gate-verdict the serial arrangement passes only on workflow_dispatch | 0.53 |
| tests/library/lib7c.test.ts | 25 | 1.78 | 1.87 | LIB-7c 7c-A5: approved pages and sheets pinned (D-CRITIC-CAL3, D-PILOTA-R5) the six approved ids draw their approved pages byte for byte; the sheets are the approved ones | 0.54 |
| tests/howto/flat-palm.test.ts | 7 | 1.68 | 1.68 | LIB-26 flat palm _test_flat renders with a clean engine report, and the moving palm is outlined in the Mistake view | 0.90 |
| tests/howto/lib8-pilot-a.test.ts | 35 | 1.55 | 1.86 | LIB-8-FIX every spec pilot-a/plates.json names still imports (finding 3) romanian_deadlift imports | 0.77 |
| tests/howto/library-back-page.test.ts | 5 | 1.46 | 1.46 | S5-L: the back box on E1's back-flagged layers page red: one box byte drifted; the back box at its named limit + 1; another box at 31; a sheet whose words.total is 450 | 1.26 |
| tests/howto/generate.test.ts | 14 | 1.39 | 1.39 | HT2-A2 (freshness): every generated file starts with a fresh header over its own inputs only each header's inputsSha256 is recomputed from its writers and their inputs, with no render | 1.07 |
| tests/howto/zooms.test.ts | 69 | 0.95 | 0.95 | HT7-A2: no duplicate id in one How-to, none between two the normal, mistake, hand and crop figures of each How-to, and all 28 pairs of How-tos | 0.60 |
| tests/escobar/read.test.ts | 90 | 0.85 | 0.86 | read tools on the six months fixture get_overview runs and stays under its byte cap | 0.07 |
| tests/escobar/brief.test.ts | 16 | 0.84 | 0.84 | situation brief (§11.2) sends only changed lines between full briefs, plus the always-present ones | 0.26 |
| tests/howto/f-zoom-pitch.test.ts | 3 | 0.76 | 0.76 | F-ZOOM-PITCH A2: the circle copies its ring on a pitched plate 4 landmarks in the circle sit at circle centre + k × (plate position − ring centre), within 0.05 px | 0.68 |
| tests/aud4-restore-integrity.test.ts | 13 | 0.75 | 0.75 | DATA-02: a reset in another tab is not written back "Delete conversations" notifies the other tab, and its next save keeps the old ones gone | 0.28 |
| tests/howto/hands.test.ts | 66 | 0.70 | 0.70 | HT6-A2 (C5): the hand geometry report is ok for every HandlingSpec hanging-leg-raise | 0.15 |
| tests/escobar/aud-2-coach-off.test.ts | 7 | 0.63 | 0.63 | the loop checks the switch before every request (AUD-2) audit repro: off before the tool result is handled, so no second request | 0.37 |
| tests/howto/poly.test.ts | 10 | 0.61 | 0.63 | LIB-25 poly primitive a moving poly part is outlined in the Mistake view; an open line in its place is not | 0.59 |
| tests/escobar/bug-20-privacy.test.ts | 6 | 0.60 | 0.60 | BUG-20 Escobar privacy: gated insights and the minor flag A3: with both on, the weight and heart insights go out unchanged | 0.14 |
| tests/howto/feel.test.ts | 48 | 0.59 | 0.59 | HT8-A1: every state is golden B's vendored output, byte for byte the 8 shipped sections === the sections golden B renders now (feelSection from the mirror) | 0.20 |
| tests/escobar/a3-coach-01-retry-sharing.test.ts | 3 | 0.56 | 0.56 | COACH 01: retry after sharing is switched off upstream_busy: first request carries the weight, the retry does not | 0.29 |
| tests/escobar/online-recheck.test.ts | 3 | 0.55 | 0.55 | after a dropped answer (QA-R4a-6) Escobar checks again when the back-off ends, without the sheet being reopened | 0.33 |
| tests/howto/shard.test.ts | 11 | 0.54 | 0.54 | D-HT10-A5b: the gate block and scripts/ht10-gate.mjs run the same tuples unset runs every tuple; 1/2 + 2/2 run every tuple exactly once | 0.48 |
| tests/library/lib12-fix.test.ts | 20 | 0.52 | 0.52 | LIB-12-FIX R8-FR: front-rack is golden B's hand under the bar at reference scale (critic C1, C4, C5, C7; a GAPS key since round 2, its view kept) palm up or back to the shoulder, wrist bent back, bar on the fingers, the bar's + mark, scale within 20 % of golden B's pull pair | 0.12 |
| tests/bug24.test.ts | 7 | 0.49 | 0.49 | BUG-24: the rebuild judges each step as exerciseHistory over its prefix would stepJudge equals judgedPair on the prefix, for random histories with typos, repeats, warm-ups, drops and out-of-order days | 0.46 |
| tests/a3-qa-cache-01-reset-cache.test.ts | 5 | 0.48 | 0.48 | A3 QA CACHE 01 Settings "Reset everything" removes the plaintext backup/CSV copies exportText left in the app cache | 0.29 |
| tests/workout/no-form-guide.test.ts | 15 | 0.45 | 0.46 | D-HT1 A4: the How-to is reached from main only through ids.ts ids.ts, main's one How-to module, statically reaches nothing else; generated/** is reached only through import() | 0.28 |
| tests/coach-feedback.test.ts | 10 | 0.41 | 0.41 | COACH-FB: store paths CFB-6 the chat snooze_insight effect uses the same helper (targeted Undo) | 0.13 |
| tests/errors.test.ts | 42 | 0.37 | 0.37 | the local queue (A3) 100,001 enqueues of one signature give count 100,000, the Worker's cap (round-2 review) | 0.32 |
| tests/howto/lib-4a.test.ts | 10 | 0.36 | 0.46 | A1/A2: the no-How-to control at full coverage (D-LIB4-CTRL) A1 + A2 at 153: firstWithoutHowTo() is null, HT_ORDER is the 8 then the custom exercise, and every id ships (true/true) | 0.15 |
| tests/store.test.ts | 19 | 0.28 | 0.29 | quarantine (ST-01) keeps unreadable main data aside, flags the boot, and the copy survives later edits | 0.06 |
| tests/copy-1.test.ts | 49 | 0.28 | 0.28 | COPY-1: no explaining, no stating the obvious (D-COPY1-1) the Escobar empty state is the one short line | 0.26 |
| tests/deload-accept.test.ts | 3 | 0.28 | 0.28 | acceptDeload chains back-to-back lighter weeks (BUG-15) no session since the first week: the window starts at the first week, seven more days | 0.15 |
| tests/escobar/other-tab.test.ts | 1 | 0.28 | 0.28 | another tab resets Escobar (QA-R1-9) this tab drops the old conversations instead of writing them back | 0.28 |
| tests/escobar/show.test.ts | 21 | 0.28 | 0.28 | show component summaries (§9) week_summary summarises the six-month fixture with at most 12 points | 0.08 |
| tests/session.test.ts | 52 | 0.27 | 0.27 | recovery calibration sees what the app showed (QA-R2b-3, QA-R2b-5, QA-R2b-6) a rebuild learns the same, and keeps what a compressed (retro) finish learned | 0.13 |
| tests/howto/library-research.test.ts | 14 | 0.26 | 0.26 | LIB-5 S1: the 38 shared research files equal the named research heads 9eaa248 and 0393aac (back box) mutation: a 20th card is red | 0.06 |
| tests/howto/box-cap.test.ts | 13 | 0.25 | 0.26 | BC-3: the limit follows the key, never the text or the count lintLibraryRow passes boxKeys[flag] to boxReach: a 50-word back box is green with { back: 'back-pain-box' } and red without | 0.19 |
| tests/bug25.test.ts | 3 | 0.24 | 0.24 | BUG-25: the rebuild takes the previous session in day order, as finish does random histories with out-of-order days: the rebuild equals finishing each session in start order | 0.22 |
| tests/adapt4-own-week.test.ts | 19 | 0.23 | 0.24 | Coach card wiring (supervisor scope extension 2026-09-29): the card uses the plan plannedDays 2, no schedule, trained twice last week → the card shows on Monday, about last week | 0.14 |
| tests/howto/content.test.ts | 75 | 0.21 | 0.62 | HT4b-A4/A5: C19 no sources or contacts, each rule proven by a bad fixture naming it (d) every generated feel-*.ts passes (one per approved exercise, HT-8) | 0.04 |
| tests/today-card.test.ts | 6 | 0.21 | 0.21 | UI-R03: a day off is shared by readiness and Escobar Escobar brief and overview do not present a day taken off as a scheduled Push day | 0.11 |
| tests/a3-data-01-custom-exercise-repair.test.ts | 4 | 0.21 | 0.21 | A3 DATA 01 a backup with a custom exercise lacking muscle metadata is accepted and the recovery reader still runs | 0.14 |
| tests/escobar/executor.test.ts | 14 | 0.20 | 0.20 | executor wraps read results as {data, facts} and registers facts | 0.09 |
| tests/session-bug19.test.ts | 15 | 0.20 | 0.20 | BUG-19 A4: rest leaves out the set itself and any pause (DATES-F5) after an app restart a gap in a paused session is unknown: delayed, and no rest (plan scenario 6) | 0.06 |
| tests/howto/sections-risks.test.ts | 4 | 0.20 | 0.20 | HT9-A3: Risks ("Risks and when to stop") renders every risk row, and for all real exercises one red-flag block per riskFlags entry, golden-B order, with golden-B ids | 0.08 |
| tests/howto/budgets.test.ts | 6 | 0.18 | 0.18 | HT-3c B3: tests/howto/budgets.json LIB-7-FIX (D-LIB7FIX-BUDGET): every pair key a shipped row uses has a handpair-<key>-*.js entry within the cap, and none is stale | 0.16 |
| tests/howto/lib-spine.test.ts | 18 | 0.17 | 0.17 | LIB-SPINE A3 the bow holds the thorax the back outline is continuous: no gap and no crossing between neighbouring section samples, and no kink from the bow blend (bow 6, 12, 20) | 0.05 |
| tests/selectors.test.ts | 3 | 0.17 | 0.17 | sessionsToday (QA8-4) includes a session that started before midnight and ended today, checked within 6 hours of ending | 0.11 |
| tests/recovery-bug17.test.ts | 20 | 0.16 | 0.16 | A6: a rebuild learns exactly what finish stored (RECOVERY-F7) replaying finish over a varied half-year gives the same model as rebuildRecoveryModel | 0.09 |
| tests/howto/content-gen.test.ts | 15 | 0.16 | 0.16 | HT5-A1: generated, not typed every content field ht-<slug>.ts holds is === the value content.mjs derived from the vendored golden-B file | 0.06 |
| tests/clock.test.ts | 5 | 0.15 | 0.15 | the clock (R2.1) thirty one-second ticks inside a minute evaluate recovery once | 0.08 |
| tests/android-manifest.test.ts | 3 | 0.15 | 0.15 | patch_manifest.py QA4-3: an entry a plugin already added still gets the cap, and a second run adds nothing twice | 0.09 |
| tests/escobar/report.test.ts | 23 | 0.14 | 0.14 | ESC-REPORT R4: nothing is saved a full report (dev mode, then the network path) writes nothing and leaves the stored conversation as it was | 0.06 |
| tests/heart-bug21.test.ts | 26 | 0.13 | 0.13 | A1: heart-guided rest and the main-lift floor (D-A1 point 4) review r2: with no in-memory record (an app restart) the timer is the floor, even after an accessory set | 0.08 |
| tests/escobar/schema.test.ts | 9 | 0.13 | 0.13 | tool schema uses no keyword the API rejects, and item counts only 0 or 1 | 0.11 |
| tests/howto/css.test.ts | 14 | 0.12 | 0.12 | HT2-A6 inline custom properties in generated markup every style="" custom property in every generated string is on the allow list | 0.05 |
| tests/plan.test.ts | 12 | 0.12 | 0.12 | evaluatePlan 0 sets, unknown refs, no days, too long and far over band all block | 0.03 |
| tests/a3-data-02-stale-tab-save.test.ts | 7 | 0.12 | 0.12 | A3 DATA 02 crash-screen reset (storage cleared) elsewhere, event not yet delivered: the stale tab flush does not restore old data | 0.04 |
| tests/bug18.test.ts | 26 | 0.11 | 0.11 | BUG-18 x BUG-17: finish and the rebuild learn the same recovery model with a held typo an earlier session with a typo set gives the same model at finish and in a rebuild | 0.08 |
| tests/howto/plate-state.test.ts | 16 | 0.11 | 0.11 | HT3-A4: the inserted golden block is the gallery card, byte for byte for all 8: the S0 block with the mistake figure inserted and the zoom slot left out equals the fixture block | 0.09 |
| tests/readiness-bug16.test.ts | 24 | 0.11 | 0.11 | A1 + A5: input combinations fuzz: over random mixes, reduce always has a check-in or 2+ drivers, and load alone is always green | 0.04 |
| tests/escobar/bug-32-safety-card.test.ts | 9 | 0.11 | 0.11 | BUG-32 the pre-screen card sits under the message that raised it in a long conversation the card shows right after the crisis bubble, before the reply, not at the top | 0.05 |
| tests/split-plan.test.ts | 20 | 0.11 | 0.11 | BUG-38 readiness BUG-38 owner: todayReadiness.postSessionAdvice === "Today's session is done. Recover well; SPLIT 2 - LOWER AND CORE is next on Sun." | 0.06 |
| tests/escobar/privacy.test.ts | 7 | 0.11 | 0.11 | privacy when health sharing is off (ES-12) readiness_gauge drops health drivers and keeps the rest | 0.10 |
| tests/escobar/session.test.ts | 11 | 0.11 | 0.11 | old coach chat carry-over (QA-R4b-1) imports once for someone who already had Escobar on, and never twice | 0.03 |
| tests/howto/library-authorqa.test.ts | 4 | 0.10 | 0.10 | LIB-3c 3c-A1 (D-LIB9-AUTHORQA): the authoring option returns the candidate with exemptions [] and reads no pin; the default path with no pin still throws | 0.09 |
| tests/exercises.test.ts | 10 | 0.10 | 0.11 | the heavy main-lift damage floor (QA-R7-2, QA-R7-3) comes from DAMAGE_HEAVY_MAIN, so changing it changes the model | 0.08 |
| tests/escobar/knowledge.test.ts | 26 | 0.10 | 0.10 | explain_method (§16.2) effort_calibration has a summary under 600 chars, inputs, constants and personal values | 0.04 |
| tests/howto/hint.test.ts | 4 | 0.10 | 0.10 | HT6-A8: the push hint howToHint gives golden B's cue for push exercises with an approved How-to, and nothing for any other exercises.json id | 0.09 |
| tests/howto/library-scale.test.ts | 9 | 0.10 | 16.33 | L2-A22: the sheet chunk holds no per-id map (D-LIB2-sheet-maps) chunkMaps: an own hand chunk wins over a hand pair, a pair fills in, and an unwritten posture or feel chunk has no entry | 0.06 |
| tests/plateauRule.test.ts | 26 | 0.10 | 0.10 | A1: +2.5 kg every 3 weeks (about 0.8% a week) is progress, not a plateau no lighter-week offer for two such lifts | 0.02 |
| tests/coach.test.ts | 36 | 0.09 | 0.10 | readiness.effort-calibration fires once a max set at the same load beats a rated set by 2+ reps, 3+ times | 0.01 |
| tests/old-android-floor.test.ts | 8 | 0.09 | 0.09 | OLD-ANDROID-1b floor (d) every inline classic script in index.html is ES5 | 0.09 |
| tests/escobar/palace-anchors.test.ts | 1 | 0.09 | 0.09 | palace anchors every anchor is rendered somewhere as a data-palace or palace attribute | 0.09 |
| tests/cues.test.ts | 6 | 0.08 | 0.09 | the 'change it up' plateau (QA2-FC-9) suggestNext gives the change-it-up note on 8 flat weeks, so Train passes it through | 0.03 |
| tests/adapt5-volume-band.test.ts | 25 | 0.08 | 0.08 | V4 (E-1): the plateau lever reads the usual trained week, not last week alone V4: last week missed, usual week 8 chest sets in band → the lever does not say low volume | 0.01 |
| tests/howto/vendor.test.ts | 11 | 0.08 | 0.08 | HT1-A6 vendored files stay outside src nothing in src imports tools/** | 0.04 |
| tests/howto/layers-vendor.test.ts | 13 | 0.08 | 0.09 | HT4-A1 layer vendor lock (L0-B) fails on a MANIFEST entry pointing at a different commit than the S-2 pin | 0.01 |
| tests/escobar/a3-imp-e02-toast-conversation.test.ts | 2 | 0.08 | 0.08 | IMP-E02: the Undo toast is bound to its own conversation A's toast tapped while B is visible undoes A's own change and B stays visible | 0.07 |
| tests/howto/engine-er5.test.ts | 15 | 0.08 | 0.08 | 20-A11 volume trunk and depth order the trunk and head are closed hull paths; a trunk nearer the camera than the knees goes in chest, its head in headF | 0.02 |
| tests/share-cards.test.ts | 27 | 0.07 | 0.08 | F12 share card data quarter in kg: range, sessions, sets, volume, records and muscle sets come from the brain | 0.01 |
| tests/aud20.test.ts | 18 | 0.07 | 0.07 | AUD-20 SCI-11: coach progress and consistency copy states facts plateau: the coach's policy, not "the stimulus stopped changing" | 0.03 |
| tests/escobar/apply-reminders.test.ts | 1 | 0.07 | 0.07 | reminders turned on through Escobar (QA2-FB-2) Apply is the person's tap: it asks for notification permission and schedules the reminders | 0.07 |
| tests/howto/goldenB-derivation.test.ts | 18 | 0.07 | 0.07 | HT4-A5: golden B holds only golden-A plates (fast proofs; the live-build proofs run in the HT-4 gate block) failure path: a changed abd value on the lateral raise's top-height Wrong crop fails | 0.05 |
| tests/live-retarget-next.test.ts | 17 | 0.06 | 0.06 | D-A4 (a): the target is stored at commit and kept when the session finishes setEntryTarget keeps the first target only, and finishSession saves it on the exercise | 0.02 |
| tests/escobar/apply.test.ts | 11 | 0.06 | 0.06 | undo inverses (ES-02) start session → a set logged → undo leaves the session alone | 0.02 |
| tests/readyTimes.test.ts | 15 | 0.06 | 0.06 | tile time text stays within the 2-column wrap budget over a 24h sweep, tileText is at most 16 chars and each dash-separated part at most 8 | 0.03 |
| tests/progression.test.ts | 81 | 0.06 | 0.06 | progression confirms once at the top, then increases (two for two) | 0.01 |
| tests/native/haptics.test.ts | 11 | 0.06 | 0.06 | haptics without a NativeUi plugin (Capacitor fallback) tick() calls nothing | 0.02 |
| tests/plate-sense.test.ts | 45 | 0.05 | 0.06 | suggestNext with equipment never returns a load off the ladder, and states it in lb | 0.02 |
| tests/escobar/no-contacts.test.ts | 18 | 0.05 | 0.05 | ESC-NC A3 the crisis and medical cards still appear through both routes, with the new copy the app’s own word check raises them for the owner’s two phone-check lines | 0.02 |
| tests/howto/golden.test.ts | 14 | 0.05 | 0.05 | HT1-A3 per-exercise golden entries the fragments are exact slices of the gallery card (plate top to tempo bottom), guides spliced into the normal svg | 0.01 |
| tests/recovery.test.ts | 22 | 0.05 | 0.05 | recovery model v2 (impulse-response) ready-time orders easy < ideal < max, in the ballpark the plan illustrates (~24/34/47h) | 0.02 |
| tests/escobar/ui.test.ts | 14 | 0.05 | 0.05 | What Escobar knows: saved day (QA-R4b-8) is the phone's local day | 0.01 |
| tests/escobar/store.test.ts | 17 | 0.05 | 0.05 | conversation store size guard never drops the active conversation; it trims its oldest turns (ES-18) | 0.02 |
| tests/escobar/a3-5-menu.test.ts | 3 | 0.05 | 0.05 | A3-5 AC6: one profile source resolveProfile( is called only inside src/brain/units.ts | 0.02 |
| tests/pwa.test.ts | 7 | 0.05 | 0.05 | service worker cache (QA-R5b-3) holds at most the current and the previous build after many deploys | 0.04 |
| tests/bug-40-records.test.ts | 3 | 0.05 | 0.05 | BUG-40: Records chip counts every record; Show all lists them (AC2) chip is 18, not 12; 12 rows and a Show all button before tap; every record after | 0.03 |
| tests/howto/footprint.test.ts | 3 | 0.05 | 0.05 | HT3b-A1: How-to footprint in main src/howto/ids.ts, esbuild-minified, is <= 2,048 B | 0.02 |
| tests/escobar/palace.test.ts | 21 | 0.05 | 0.05 | find_in_app ranking returns at most 5 and nothing for empty or nonsense queries | 0.01 |
| tests/howto/ht10-budgets.test.ts | 5 | 0.04 | 0.67 | D-HT10-A4: the How-to total ceiling keeps the ceiling within measured .. measured + 10 % (rounded up), per shipped id past the 8 (LIB-2 rule) | 0.04 |
| tests/native/keepAwake.test.ts | 4 | 0.04 | 0.04 | keepAwake on native on(true) calls NativeUi.keepAwake({on:true}), on(false) calls it with {on:false} | 0.03 |
| tests/progress-trend.test.ts | 7 | 0.04 | 0.04 | the Exercise progress card trend follows the lift mode (QA2-FC-1) an assisted lift needing less help is improving, not slipping | 0.03 |
| tests/adapt3.test.ts | 23 | 0.04 | 0.04 | ADAPT-3 A-1: progress from reps when few sets are rated P1: 3×12 at 40 kg twice, 1 of 3 rated ideal, no rep drop → one standard step | 0.01 |
| tests/workout/aud-10.test.ts | 7 | 0.04 | 0.04 | AUD-10 UI-01: Skip today keeps the sets already logged commit 60 x 8, Skip today, Finish: the set is saved and the counters match the saved session | 0.01 |
| tests/a3-2b-preload-cache.test.ts | 6 | 0.04 | 0.04 | A3-2b pre-load reset clears every cache AC2: on Android, the start-up reset leaves CACHE/MARC Exports and CACHE/MARC Share empty | 0.02 |
| tests/native/a3-imp-n03-wakelock-late-grant.test.ts | 3 | 0.04 | 0.04 | IMP-N03 obsolete wake-lock grants are released Off while the request is pending leaves zero held locks | 0.03 |
| tests/escobar/verify.test.ts | 164 | 0.04 | 0.04 | safety pre-screen (§19) I want to kill myself → crisis | 0.01 |
| tests/native/a3-imp-n02-health-after-reset.test.ts | 4 | 0.04 | 0.04 | IMP-N02 another tab replaces the state during a read another tab clearing storage drops the read | 0.02 |
| tests/balance-weekly.test.ts | 11 | 0.04 | 0.04 | coach flags missing effort ratings and imbalance with plain words | 0.01 |
| tests/bug-39-streak.test.ts | 11 | 0.04 | 0.04 | BUG-39 AC1: the owner moved weekdays but hit every planned week {wed}: 9 on 15 Oct, 11 on 18 Oct | 0.01 |
| tests/escobar/a3-eng-01-gym-menu.test.ts | 5 | 0.04 | 0.04 | ENG-01 current gym/menu across target, warm-up and live retarget live retarget after a failed first set lands on gym B's menu (Train.tsx:736-737 composition) | 0.01 |
| tests/session-bug28.test.ts | 6 | 0.03 | 0.03 | BUG-28: finishing with 0 logged sets returns null, so nothing renders the "Session saved" screen | 0.02 |
| tests/share-qa4.test.ts | 30 | 0.03 | 0.04 | QA4-1: assisted exercises add no volume Stats (weekSummary, weeklyVolumeHistory) and the card agree | 0.00 |
| tests/notifications.test.ts | 11 | 0.03 | 0.04 | notifications (UI-02, PL-09) training reminders are never exact | 0.03 |
| tests/escobar/a3-imp-e03-profile-undo.test.ts | 3 | 0.03 | 0.03 | IMP-E03: profile Undo 80 -> apply 82 -> Undo: no insight says 82 was saved | 0.03 |
| tests/reminders.test.ts | 5 | 0.03 | 0.03 | resyncReminders skips a day already trained (QA8-3, QA8-4) schedules today when nothing has been trained yet | 0.02 |
| tests/aud-8.test.ts | 15 | 0.03 | 0.03 | AUD-8 UI-12: the insight target equals the live target on a red-readiness day both read 60 kg for two sets | 0.01 |
| tests/escobar/a3-imp-e01-load-factor.test.ts | 3 | 0.03 | 0.03 | IMP-E01 coach and live target use the same active factor control: no override, Train and Escobar agree | 0.02 |
| tests/escobar/actions.test.ts | 12 | 0.03 | 0.03 | proposal validation (§10.2) program must pass evaluate_plan and fit the split cap | 0.02 |
| tests/howto/chips.test.ts | 37 | 0.03 | 0.03 | the markup equals golden B's page the page order under the tempo is: wrist line, chips, grip | 0.01 |
| tests/escobar/a3-imp-e05-live-clock.test.ts | 5 | 0.03 | 0.03 | IMP-E05 pause and rest agree with Train paused 10 minutes in with 60 s of rest left, asked 10 minutes later | 0.02 |
| tests/bug-41-progress-trend.test.ts | 10 | 0.03 | 0.03 | BUG-41: the progress line and its trend read one series A3: every mode: the trend is exactly trend() of the plotted rows and values, all above 0 | 0.01 |
| tests/bodyweight.test.ts | 59 | 0.03 | 0.03 | Progression and records ignore body weight (pins) records stay best_reps only | 0.01 |
| tests/howto/ids.test.ts | 6 | 0.03 | 0.03 | HT2-A5: ids.ts HOWTO_IDS are the approved plates slugs in GOLDEN.json; LOADERS keys equal them; they equal the generated files | 0.01 |
| tests/escobar/f13b.test.ts | 8 | 0.03 | 0.03 | F13b: week_summary volumeKg is unchanged; withBodyweightKg appears only when sharing.body is on | 0.01 |
| tests/copy-2-headings.test.ts | 37 | 0.03 | 0.03 | COPY-2: every static heading in the app is a short label finds headings to check (never passes on nothing) | 0.01 |
| tests/escobar/session-reset.test.ts | 1 | 0.03 | 0.03 | Escobar store replaced (ES-07) send → reset conversations store → send leaves exactly one stored conversation | 0.03 |
| tests/escobar/bug-31-cite-tags.test.ts | 17 | 0.03 | 0.03 | BUG-31 A2 splitCitations and stripCitationTags splitCitations strips brief-form tags, known or not, and gathers their ids in reading order | 0.01 |
| tests/deload.test.ts | 9 | 0.03 | 0.03 | deloadTrigger (F3.3) suggests a deload when two or more main lifts have plateaued or declined | 0.02 |
| tests/theme.test.ts | 21 | 0.02 | 0.02 | How-to mistake token contrast (HT-2) emerald: --mistake >= 3:1 against --map-body, --surface-1 and --surface-2 | 0.01 |
| tests/howto/lib8-composers.test.ts | 9 | 0.02 | 0.02 | LIB-8 pecDeck (front view) draws PEC_DECK_ITEMS items (+2 with uprights, -2 with direct), the same on every call | 0.01 |
| tests/weeklyReview.test.ts | 19 | 0.02 | 0.03 | isStale flags 6 sessions at the same load with no e1RM movement | 0.01 |
| tests/recovery-aud6.test.ts | 10 | 0.02 | 0.02 | AUD-6 UI-07: a ready muscle short of full shows its day, not "Now" the model's own ready-not-full state shows a day | 0.01 |
| tests/backup.test.ts | 12 | 0.02 | 0.02 | sessions without a date (QA-R1-2, QA-R1-3) a restored session missing its day gets it from its start; one with neither is dropped | 0.01 |
| tests/howto/class-map.test.ts | 4 | 0.02 | 0.02 | HT2-A6 class map touches only class tokens: reversing it on every mapped golden selector gives the original | 0.01 |
| tests/old-android-native.test.ts | 6 | 0.02 | 0.02 | OLD-ANDROID-1a G1: Android 14 types stay inside Api34 has a nested Api34 class and no Android 14 type outside it | 0.01 |
| tests/aud9-weekly-plan-rules.test.ts | 17 | 0.02 | 0.02 | AUD-9 OBS-DRIFT: effort drift only reads the same work harder ratings at a rising load are neither harder nor stable | 0.01 |
| tests/aud1.test.ts | 16 | 0.02 | 0.02 | AUD-1 SCI-01: recovery calibration skips modes where kg is not the lifted load an assisted pull-up with less assistance (improvement) teaches the model nothing, at finish and in replay | 0.01 |
| tests/prs.test.ts | 6 | 0.02 | 0.02 | personal records first session is a baseline, later heavier load is a record | 0.02 |
| tests/fidelity.test.ts | 24 | 0.02 | 0.02 | warm-ups and drop sets (QA-R6-6, QA-R6-8, QA-R6-9) 'Last:' hints line up with the working sets | 0.01 |
| tests/howto/lib8-stamps.test.ts | 6 | 0.02 | 0.02 | LIB-8M stampProblems: real stamps are the supervisor's, complete and closed refuses 'owner', 'stamps (O5)' and a missing approvedBy | 0.01 |
| tests/effortBars.test.ts | 14 | 0.02 | 0.02 | fmtTotal (OBS-TONNE) a 5-figure lb total is not shown as tonnes — "t" is a metric tonne, only right for kg | 0.02 |
| tests/muscleTimeline.test.ts | 6 | 0.02 | 0.02 | readyDayWindow (O2 muscle panel) across midnight: lo and hi land on different calendar days | 0.02 |
| tests/a3-eng-06-duration-baseline.test.ts | 3 | 0.02 | 0.02 | ENG-06: duration drift baseline five "Log a past session" records (retro, user-typed 30 min) are not a trusted baseline | 0.02 |
| tests/trend.test.ts | 7 | 0.02 | 0.02 | plateauStatus for assisted work (BR-06) less assistance is progress, more is decline | 0.02 |
| tests/bug18-finish.test.ts | 1 | 0.02 | 0.02 | BUG-18 x BUG-17: finishSession and the rebuild agree with a held typo the stored recovery model equals the rebuilt one | 0.02 |
| tests/workout/a3-ui-r04-edit-provenance.test.ts | 4 | 0.02 | 0.02 | UI-R04: History corrections and timing provenance changing reps 8 -> 6 marks that set edited; the untouched set stays live | 0.01 |
| tests/pre.test.ts | 11 | 0.02 | 0.02 | workingLoadTarget gives a load target once there is enough history | 0.01 |
| tests/goal.test.ts | 20 | 0.02 | 0.02 | goal policy object lean/growth (range starts at 6+): reps-under-range step-down still fires | 0.01 |
| tests/a3-ui-r05-onboarding-hold.test.ts | 4 | 0.02 | 0.02 | UI-R05: the opened onboarding form survives the last field control: with height also missing, the same steps keep the sheet and Save stores 81 kg | 0.01 |
| tests/escobar/transport.test.ts | 8 | 0.02 | 0.02 | http transport posts to /v2/turn with the device header and yields events | 0.01 |
| tests/retarget.test.ts | 22 | 0.02 | 0.02 | LT-2 A1: the worked rows of §3 row 3: barbell 60 × 8, strength_muscle main, 1.25 kg plates → 62.5 for 6 to 7; without them 65 for 4 to 5 | 0.01 |
| tests/a3-eng-03-review-week.test.ts | 1 | 0.02 | 0.02 | ENG-03: reviewed week is judged on its own interval a 12-set session in the current week does not flag last week (6 chest sets) as over | 0.02 |
| tests/substitute-carry-over.test.ts | 5 | 0.02 | 0.02 | LT-6 carry-over start after a swap A4: once the substitute has its own history, its own history wins | 0.01 |
| tests/escobar/calc.test.ts | 11 | 0.02 | 0.02 | calculate plate_breakdown with the gym bar and an explicit bar | 0.01 |
| tests/volume.test.ts | 12 | 0.02 | 0.02 | muscleVolumeStatus judges completed weeks (BR-07) a Monday with nothing logged yet is not "under" | 0.01 |
| tests/unit-copy.test.ts | 3 | 0.02 | 0.02 | coach text in pounds (QA-R3b-2, QA-R3b-5) the fallback load target speaks lb | 0.01 |
| tests/native/a3-imp-n01-notification-race.test.ts | 6 | 0.02 | 0.02 | IMP-N01 latest notification intent wins training: turning reminders off while an On request waits for permission ends Off with nothing queued | 0.01 |
| tests/workout/a3-ui-r01-substitute-keeps-sets.test.ts | 5 | 0.02 | 0.02 | UI-R01: substitution keeps committed work committed bench 60 x 8, marked Done, then substituted: Finish still saves the bench set | 0.01 |
| tests/post.test.ts | 13 | 0.02 | 0.02 | durationDriftInsight flags a session 20%+ longer than the usual median | 0.01 |
| tests/readiness-adapt2.test.ts | 13 | 0.02 | 0.02 | ADAPT-2 B-1: an ordinary check-in reads normal from the first check-ins R1: 20 usual check-in days, today the same, 4 weeks of sessions, 90 % recovered → green, normal | 0.01 |
| tests/router.test.ts | 7 | 0.02 | 0.02 | exercise ids from history (QA-R1-6) keeps an id that is logged but not in the library, and still drops a made-up one | 0.01 |
| tests/live-retarget.test.ts | 19 | 0.01 | 0.02 | LT3-A3: never "add load" once set 1 is above the plan no effort or rep count above the plan gives a heavier load or a "Try" line | 0.01 |
| tests/workout/a3-eng-05-recovery-rebuild.test.ts | 2 | 0.01 | 0.02 | ENG-05: recovery calibration after history mutations retiming a session across the 7-day comparison window rebuilds the model | 0.01 |
| tests/howto/theme-parity.test.ts | 4 | 0.01 | 0.01 | HT2-A7 theme parity: themes.ts vs the vendored ref-src themes, for every token plate.css reads the vendored and app theme sets are the same 5 themes | 0.01 |
| tests/a3-eng-07-debrief-prior.test.ts | 1 | 0.01 | 0.01 | ENG-07: past-session debrief a backfilled 55 kg workout between 50 kg and 60 kg keeps its record on Finish, as Escobar reports | 0.01 |
| tests/r6-features.test.ts | 10 | 0.01 | 0.01 | a week whose planned days are all off (QA-R6-4, QA-R6-10, QA-R6-12) Escobar's overview leaves days off out of planned | 0.00 |
| tests/health-bridge.test.ts | 13 | 0.01 | 0.01 | a later partial sync keeps what the morning sync had (QA-R5a-1) sleep and resting HR survive a sync where those reads failed, and the failure is reported | 0.00 |
| tests/a3-ui-r06-live-gym-delete.test.ts | 1 | 0.01 | 0.01 | UI-R06: live gym deletion bench stays lb and the live gym stays resolvable after Settings deletes the in-use gym | 0.01 |
| tests/aud7-heart-inputs.test.ts | 15 | 0.01 | 0.01 | NAT-02: paused time adds no heart samples, energy or zones the audit script: 09:00-10:00 with a 50-minute pause saves about 10 minutes, not 60 | 0.01 |
| tests/error-boundary.test.ts | 6 | 0.01 | 0.01 | the error card (QA-R1-8) QA2-FB-1: the save on unload does not write the crashing state back after the reset | 0.01 |
| tests/effortBias.test.ts | 7 | 0.01 | 0.01 | rirObservations pairs a same-load max set with a non-max set within 14 days | 0.01 |
| tests/migrate.test.ts | 9 | 0.01 | 0.01 | legacy migration loadState prefers saved state, then legacy, without touching the old key | 0.00 |
| tests/a3-eng-04-warmup-only.test.ts | 4 | 0.01 | 0.01 | ENG-04: warm-up-only sessions premise: the past-session save path stores a warm-up-only session | 0.01 |
| tests/ui/pending.test.ts | 2 | 0.01 | 0.01 | showAfter (I19) never shows when the operation resolves before the delay | 0.01 |
| tests/a3-7b-onboarding-hold-replace.test.ts | 5 | 0.01 | 0.01 | A3-7b: the hold on "Update" (review) case 5: Update holds the review form; clearing height mid-form keeps it, and Save stores the new weight | 0.01 |
| tests/live.test.ts | 12 | 0.01 | 0.01 | a missed set on the empty bar (QA2-FC-6) never says to drop to the same bar; it keeps the load and changes the reps and rest | 0.01 |
| tests/escobar/a3-imp-e06-haptics-runtime.test.ts | 3 | 0.01 | 0.01 | IMP-E06: coach haptics setting reaches the runtime switch Apply "off" while on: the next haptic is silent | 0.01 |
| tests/ui/styles.tokens.test.ts | 17 | 0.01 | 0.01 | styles.css motion token lint (F1) has no bare time literal in transition/animation outside the token block, unless allow-listed | 0.00 |
| tests/readiness.test.ts | 16 | 0.01 | 0.01 | readinessBaselines computes 7d/28d resting HR and 14d sleep median with gaps | 0.00 |
| tests/heartStore.test.ts | 5 | 0.01 | 0.01 | heartStore evicts the oldest session beyond the 60-session cap | 0.01 |
| tests/escobar/tools-sync.test.ts | 1 | 0.01 | 0.01 | Worker tool definitions stay in sync (§12.8) escobar-worker/src/tools.generated.json matches schema.ts and modes.ts (run npm run escobar:tools) | 0.01 |
| tests/profile-status.test.ts | 8 | 0.01 | 0.01 | BUG-8 A: the Profile sheet wires Sex straight from profile.sex presses no Sex option when profile.sex was never saved | 0.00 |
| tests/share-bug13.test.ts | 2 | 0.01 | 0.01 | BUG-13: the Week card around a week boundary on the workout day itself (the pinned gate clock) the card has sets to share | 0.01 |
| tests/heart.test.ts | 37 | 0.01 | 0.01 | hrMax prefers the manual override | 0.00 |
| tests/howto/no-contacts-parity.test.ts | 2 | 0.01 | 0.01 | HT4b-A6: copy-lint.mjs and tests/guards/no-contacts.ts hold identical LR-23 patterns all four patterns match in .source and .flags | 0.01 |
| tests/escobar/a3-imp-e04-deleted-gym.test.ts | 2 | 0.01 | 0.01 | IMP-E04: Apply rechecks the referenced gym gym deleted while the proposal is pending: not applied, no orphan, other gym unchanged | 0.01 |
| tests/a3-7b-replace-listener-throws.test.ts | 2 | 0.01 | 0.01 | D-A3-7b-3: a throwing replace listener Reset still completes and the hold still clears | 0.01 |
| tests/escobar/a3-5b-train-count.test.ts | 3 | 0.01 | 0.01 | A3-5b: one done-count rule for Train and the coach is the rule Train's card used before: isWorkingSet | 0.01 |
| tests/watch.test.ts | 3 | 0.01 | 0.01 | watchDevices batch (PL-13) reads the whole list from one event | 0.01 |
| tests/dates.test.ts | 12 | 0.01 | 0.01 | dates formats local day keys | 0.00 |
| tests/share-native.test.ts | 7 | 0.01 | 0.01 | QA4-11: shared cards do not pile up in the cache Share clears Cache/MARC Share (errors ignored) before writing the new card | 0.00 |
| tests/substitute.test.ts | 10 | 0.01 | 0.01 | substitutesFor (F3.7) only offers exercises sharing a primary muscle | 0.00 |
| tests/escobar/state.test.ts | 11 | 0.01 | 0.01 | EscobarState defaults freshState carries an off, private-by-default coach | 0.00 |
| tests/heart-capture.test.ts | 4 | 0.01 | 0.01 | live heart capture (UI-21) records each measurement once, even when it is delivered again | 0.00 |
| tests/exposure.test.ts | 6 | 0.01 | 0.01 | exposure splits emphasis across primary and secondary muscles and sums to 100 | 0.00 |
| tests/escobar/ledger.test.ts | 6 | 0.01 | 0.01 | ledger extractNumbers handles thousands and decimal commas | 0.00 |
| tests/native/play-1-policy.test.ts | 4 | 0.01 | 0.01 | PLAY-1 LR-23: the link label, the healthcare line and the Health Connect screen text carry no contact or source | 0.00 |
| tests/howto/sections-setup.test.ts | 9 | 0.01 | 0.01 | HT9-A2: Setup ("Set it up") numbers every step and shows no "All steps" button when the count is within SETUP_VISIBLE (golden B today: 5 of 5) | 0.00 |
| tests/workout/a3-eng-02-set-cuts.test.ts | 6 | 0.01 | 0.01 | ENG-02: reductions apply to the current plan prior 6 sets, current plan 3, red day: 2 usable rows | 0.00 |
| tests/a3-ui-r06-gyms-sheet.test.ts | 1 | 0.01 | 0.01 | UI-R06: Gyms sheet hides Delete gym on the live gym and keeps it on the other | 0.01 |
| tests/howto/lib8-chain.test.ts | 9 | 0.01 | 0.01 | LIB-8M verifyChain on GOLDEN.json (unchanged: owner only) GOLDEN.json itself passes | 0.00 |
| tests/volume-chart.test.ts | 2 | 0.01 | 0.01 | weekly volume chart order (QA-R6-2) draws oldest to newest, so the last bar is this week | 0.00 |
| tests/escobar/o4-effort-privacy.test.ts | 3 | 0.00 | 0.00 | O4: lift_trend effort split a bodyweight lift counts its sets as 0 kg (no body weight reaches the model) when sharing.body is off | 0.00 |
| tests/workout/set-aside.test.ts | 4 | 0.00 | 0.00 | Train set rows follow the set cut (BUG-15) A4: a lighter week sets the third planned row aside | 0.00 |
| tests/workout/next-up.test.ts | 13 | 0.00 | 0.01 | A1/A9: the next-up set label targetKgPh prefers today's target, then last time, then bw, then empty | 0.00 |
| tests/reorder.test.ts | 1 | 0.00 | 0.00 | live session reorder moves an exercise up or down and keeps its sets | 0.00 |
| tests/energy.test.ts | 12 | 0.00 | 0.00 | age is null without a birth year | 0.00 |
| tests/muscleView.test.ts | 22 | 0.00 | 0.00 | BUG-23: Muscle.view matches the SVG side that draws it chest (view: front) | 0.00 |
| tests/workout/ask-weight.test.ts | 16 | 0.00 | 0.01 | LT-4 §2: the ask-weight chip fires only when the menu is unknown and the cap broke fires on an assumed menu that earned a rung, on a ladder | 0.00 |
| tests/onboarding.test.ts | 12 | 0.00 | 0.00 | profileCompleteness counts the four coach-facing fields | 0.00 |
| tests/e1rm.test.ts | 8 | 0.00 | 0.00 | effectiveOneRm max effort assumes zero reps in reserve | 0.00 |
| tests/a3-qa-csv-01-formula-cells.test.ts | 3 | 0.00 | 0.00 | A3 QA CSV 01 split, exercise and note cells never start with a formula trigger (= + - @) | 0.00 |
| tests/hideOnScroll.test.ts | 7 | 0.00 | 0.00 | nextHideState (BUG-22) hides after scrolling down past the slop | 0.00 |
| tests/bug34.test.ts | 4 | 0.00 | 0.00 | launch overlay (BUG-34) has no SMIL animation left in #launch, and no script starts one | 0.00 |
| tests/history-setlabel.test.ts | 6 | 0.00 | 0.00 | setLabel (UI-04): a carry/sled set shows distance, time and load together a carry with load, distance and time shows all three | 0.00 |
| tests/ui/gesture.test.ts | 6 | 0.00 | 0.00 | rubber() (A3) is 0 at 0 distance | 0.00 |
| tests/muscles.test.ts | 2 | 0.00 | 0.00 | classifyMuscleText (ST-12) every label round-trips | 0.00 |
| tests/back.test.ts | 2 | 0.00 | 0.00 | Android back order (R5.3) Escobar, then the top sheet, then the panel, then Today, then minimise | 0.00 |
| tests/ui/gesture-track.test.ts | 1 | 0.00 | 0.00 | track() wrong-axis abort (QA11-2) a horizontal move locks the x-tracker but never calls onCancel on a y-tracker sharing the element | 0.00 |
| tests/a3-ui-r02-same-name-ids.test.ts | 2 | 0.00 | 0.00 | UI-R02: known exercise IDs are authoritative a session logged for B does not appear in A history | 0.00 |
| tests/workout/rest.test.ts | 4 | 0.00 | 0.00 | I1: restBarKeyframes starts empty and always ends full | 0.00 |
| tests/parse.test.ts | 3 | 0.00 | 0.00 | input parsers (UI-13) loads take a comma as the decimal point and stay in range | 0.00 |
| tests/ui/sheetStack.test.ts | 1 | 0.00 | 0.00 | closeTopSheet() skips a sheet already closing (QA11-7) reaches the sheet below one that is mid-exit instead of re-triggering it | 0.00 |
| tests/escobar/detent.test.ts | 6 | 0.00 | 0.00 | resolveEscobarRelease (I7) a released drag close to full, at rest, stays full | 0.00 |
| tests/share-seen.test.ts | 1 | 0.00 | 0.00 | share seen (BUG-29) clears the seen-comparisons list | 0.00 |
| tests/toast.test.ts | 1 | 0.00 | 0.00 | toasts (QA-R2c-3) the same message twice is a new toast, so its timer restarts | 0.00 |
| tests/workout/celebrate.test.ts | 2 | 0.00 | 0.00 | F9: celebrateOnce is true the first time a key is seen, false after | 0.00 |
| tests/bodyfat.test.ts | 2 | 0.00 | 0.00 | navyBodyFat (BR-01) uses the metric constants on centimetres | 0.00 |
| tests/native/health-connect-plugin.test.ts | 2 | 0.00 | 0.00 | HealthConnectNativePlugin.java never mentions READ_HEART_RATE | 0.00 |
| tests/native/capacitor-config.test.ts | 1 | 0.00 | 0.00 | capacitor.config.json F11: sets the WebView background to Silent Black so no light frame shows before the app paints | 0.00 |

## (c) Tests of 10 s or more (62)

mode is read per test: "child process" if the test, a helper it calls, or the describe's beforeAll/beforeEach runs execFile/spawn; otherwise "in-process". detail names what was found (page build, render, qa, helper).

| file | test | seconds | mode | detail |
|---|---|---|---|---|
| tests/howto/library-ci.test.ts | C4 class 3: the per-output inputs map, proven against every generated header D-LIB4c-3: a new composer imported only by the fixture id's spec selects all (ids.ts, ids-node.mjs and sources.json list it); a path only per-id files list (the batch's layersConfig) selects that id; one the 8's outputs list selects all | 201.20 | child process | exec in test; helpers inTree[child]; beforeAll/Each child |
| tests/howto/library-lint.test.ts | LIB-5 S7 generator cases: E1's row in per-case copies of E1's tree (D-LIB5-FIXTURE) cases, each refused with its exact message; the control (inherit []) and the unedited tree generate | 116.92 | child process | helpers node[child] |
| tests/howto/lib-5v.test.ts | LIB-5v V3/V4: the generator refuses a bad line on any shipped row (E1's tree) cases (1)-(4) and the 450 case, each with its exact message; a clean line generates and ships | 65.56 | child process | helpers node[child] |
| tests/howto/c15-stamps.test.ts | LIB-5 Do 6: the stamp gate in E1's tree (D-LIB5-SCRATCH 3, 7; S8) mutations, each red: entries emptied (every shipped id named, while checkC15 passes the empty file); marker removed; E1's stamp dropped | 64.17 | child process | page/search call in test; helpers gen[child] |
| tests/howto/library-shared.test.ts | LIB-5 S4: E1's row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS) mutations through the generator, each red: a box over its named 50; a kept trigger dropped; nhs-back removed from boxClaim | 56.19 | child process | helpers node[child] |
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) mutations: each zoom removed is red on the plate-scale bar; resistance_band_pull_apart at k 1.5 and bench_dip's trace on the still heel are red at the zoom | 55.62 | in-process | page/search call in test; helpers mutated[in],keys[in]; beforeAll/Each  in-proc |
| tests/howto/library-ci.test.ts | C4 class 3: the per-output inputs map, proven against every generated header the map is proven on the real tree and on the fixture tree: every header equals inputsSha256(writers, collected inputs) | 44.28 | child process | helpers run[child]; beforeAll/Each child |
| tests/howto/library-rows.test.ts | E1/E3/E7 failure paths: the generator throws, naming the id and the file 7 mutations, each refused | 42.42 | child process | run() helper spawns node tools/plates/generate.mjs (manual read) |
| tests/howto/lib-4d.test.ts | LIB-4d R2: ownRowsTree drops every batch row, its golden file, its pages and the files only it had; else it is the plain copy | 40.37 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/howto/library-core.test.ts | L2-A4: a new library batch row stales none of the 8's generated files with a synthetic batch row, the 54 fingerprinted files keep their header and the 8 ht- modules their hashes: line; the id files see the row | 39.26 | in-process | page/search call in test |
| tests/howto/lb8-plates.test.ts | LIB-18 A4: runQa node half on an LB8 plate (lib_hack_squat), LIB-3 M1-M7 and a colour literal A4 M1 a label 1 px onto the figure (the Thighs to parallel callout) turns PQ-H1 red; 1 px back is clean | 34.60 | in-process | page/search call in test; helpers node[in],candOf[in] |
| tests/howto/lb8-plates.test.ts | LIB-18 A15 (D-LIB18-PADS): no pad, roller, seat or bench sits inside the body, on every drawn LB8 spec each named item clears the body or touches it within 0.5 cm, in every pose, via and ghost (depths logged) | 27.29 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/howto/library-shared.test.ts | LIB-5 S4: E1's row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS) control: the unedited tree generates and writes red-flag-back.ts; with the card removed QA refuses first (PQ-H6) | 25.36 | child process | helpers node[child] |
| tests/library/lib7b.test.ts | 7b-A2 on a scratch tree: the real pipeline with the scratch rows shipped on real LIB-7 keys generate: each pair row's zoom-<chromeId>.css (hands.mjs + handpairs.mjs) holds its pair scope's rules before HX_TAIL; the handpair files are written | 23.94 | in-process | page/search call in test |
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) each zoomed spec asks for its ruled zoom, and its plate fails PQ-H3 on that view at plate scale (why the zoom exists) | 23.79 | in-process | page/search call in test; helpers keys[in]; beforeAll/Each  in-proc |
| tests/howto/library-rows.test.ts | E1: a shipped library row gets every output generate --check and npm run build pass on the tree | 23.57 | child process | helpers run[child] |
| tests/howto/lb5-plates.test.ts | LIB-15 A9: nothing ships (D-LIB15-AHEAD) generate --check is green, and no generated file is read from lb5/, the LB5 specs, the composer or How-to sources | 22.93 | in-process | page/search call in test |
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) the node half has no problem on either zoomed plate; the bar is met inside the circle at k, never lowered | 22.62 | in-process | page/search call in test; helpers node[in],keys[in]; beforeAll/Each  in-proc |
| tests/howto/lb3-plates.test.ts | LIB-13 A9: nothing ships (D-LIB13-AHEAD) generate --check is green, and no generated file is read from lb3/, the LB3 specs, composers or How-to sources | 21.61 | in-process | page/search call in test |
| tests/howto/lb6-plates.test.ts | LIB-16 A9: nothing ships (D-LIB16-AHEAD) generate --check is green, and no generated file is read from lb6/, the LB6 specs, the composers or How-to sources | 21.31 | in-process | page/search call in test |
| tests/howto/lb7-plates.test.ts | LIB-17 A10: the LB7 plates page is deterministic (PQ-H7) two builds of the LB7 rows are byte-identical | 21.06 | in-process | page/search call in test |
| tests/howto/lb2-plates.test.ts | LIB-10 A9: nothing ships (D-LIB10-AHEAD) generate --check is green, and no generated file is read from lb2/, the LB2 specs, composers or How-to sources | 21.00 | in-process | page/search call in test |
| tests/howto/c15-stamps.test.ts | LIB-5 Do 6: the stamp gate in E1's tree (D-LIB5-SCRATCH 3, 7; S8) fixtureTree() marks the tree and writes one scratch stamp for E1, and generate passes the gate | 20.79 | child process | helpers gen[child] |
| tests/howto/lb1-plates.test.ts | LIB-9a A9: nothing ships (D-LIB4-ENTRY-2) generate --check is green, and no generated file is read from lb1/, the LB1 specs or How-to sources | 20.57 | in-process | page/search call in test |
| tests/howto/lb4-plates.test.ts | LIB-14 A9: nothing ships (D-LIB14-AHEAD) generate --check is green, and no generated file is read from lb4/, the LB4 specs, the wall composer or How-to sources | 20.51 | in-process | page/search call in test |
| tests/howto/library-ci.test.ts | C4 class 3: the per-output inputs map, proven against every generated header class 3 is off when the map is not proven: its paths fall to class 4 | 20.02 | child process | helpers run[child],changed[child],inTree[child]; beforeAll/Each child |
| tests/howto/lb8-plates.test.ts | LIB-18 A9: nothing ships (D-LIB18-AHEAD) generate --check is green, and no generated file is read from lb8/, the LB8 specs, composers or How-to sources | 20.01 | child process | exec in test; page/search call in test; helpers ids[in] |
| tests/howto/lb9-plates.test.ts | LIB-21 A9 (D-LIB21-AHEAD): the rows never ship; generate is unchanged generate --check is green, and no generated file reads lb9/, the LB9 specs, composers or How-to sources (awaited child process) | 19.87 | child process | exec in test; page/search call in test; helpers ids[in] |
| tests/howto/lb7-plates.test.ts | LIB-17 A9: nothing ships (D-LIB17-AHEAD) generate --check is green, and no generated file is read from lb7/, the LB7 specs, dipBars or How-to sources | 19.51 | child process | exec in test; page/search call in test; helpers ids[in] |
| tests/howto/library-qa-h10-child.test.ts | LIB-3c 3c-A4 PARAMS ranges (D-LIB10-RANGES, D-LIB3c-SHARED) pinned envelope: no family, no key or no file gives H10.envelope; a test envelope that names the key is the fallback | 19.44 | in-process | page/search call in test; helpers keys[in] |
| tests/howto/library-shared.test.ts | LIB-5 S4: E1's row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS) riskFlags gains back -> the library lint counts the 50-word box: pull-up's 449 + 50 is over 450, naming the row | 19.24 | child process | helpers node[child] |
| tests/howto/lb4-plates.test.ts | LIB-14 panel lb4p fix round (#289 6410190090): items 1-7 on drawn items item 2: front_squat's dropped arm is the drawn arm (its end outlines, every drawn length kept) rotated about the faulty shoulder to the Mistake elbow's direction, with a dashed elbow joint circle and a red arrow along the drop; mutations: the arrow or the joint circle removed, or the copy not rotated, are red | 18.43 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/howto/lb10-plates.test.ts | LIB-22 A15: Mistakes, tells, cues, callouts, leaders and soft bends (DESIGN.md sections 8-12) every callout and tell anchor sits on an item drawn in its pose (within 3 px) | 17.13 | in-process | page/search call in test |
| tests/howto/lb10-plates.test.ts | LIB-22 A9 (D-LIB22-AHEAD): the rows never ship; generate is unchanged generate --check is green, and no generated file reads lb10/, the LB10 specs, composers or How-to sources (awaited child process) | 16.92 | child process | exec in test; page/search call in test; helpers ids[in] |
| tests/howto/library-shared.test.ts | LIB-5 D-LIB5-GATE: library-gate.mjs writes only red-flag-back.ts and stays inside C17 render(): the paths attributed to library-gate.mjs are exactly [src/howto/red-flag-back.ts], and no other header names it | 16.10 | in-process | page/search call in test; helpers gatePaths[in] |
| tests/howto/lb5-plates.test.ts | LIB-15 A10: the LB5 plates page is deterministic (PQ-H7) two builds of the drawn LB5 ids are byte-identical | 16.00 | in-process | page/search call in test |
| tests/howto/lb8-plates.test.ts | LIB-18 Mistakes, tells, cues and callouts (DESIGN.md sections 9-10) A15: every callout and tell anchor sits on an item drawn in its pose (within 3 px) | 15.95 | in-process | page/search call in test |
| tests/howto/library-shared.test.ts | LIB-5 S6: the shared modules equal their cards (D-LIB5-SPLIT; research 9eaa248, lib4-cards 14.5) no data value reaches src/** or a generator output (0 hits before these modules, recorded on #244); a notes string in a generated file is red | 15.49 | in-process | page/search call in test |
| tests/howto/lb3-plates.test.ts | LIB-13 A4: runQa node half on an LB3 plate (lib_conventional_deadlift), LIB-3 M1-M7 and a colour literal A4 M1 a label 1 px onto the figure (the Flat back callout) turns PQ-H1 red; 1 px back is clean | 15.28 | in-process | page/search call in test; helpers node[in],candOf[in]; beforeAll/Each  in-proc |
| tests/howto/lib-strip.test.ts | A7, A8: H6 and H8 through runQa on a candidate built from the fixture card H6: silent on the card and on the 8; each new key fires on its case | 14.31 | in-process | helpers cand[in],keys[in]; beforeAll/Each  in-proc |
| tests/howto/lb7-plates.test.ts | LIB-17 resume 3 A2: the 8 approved LB7 plates stay byte-identical (page c457ee86 on main 6d34542c) mutation: one byte changed in bench_dip's alt is red | 13.75 | in-process | page/search call in test; helpers keys[in],fragProblems[in],incProblems[in]; beforeAll/Each  in-proc |
| tests/howto/lib8r-pilot-a3.test.ts | PILOT-A3 A8, A10: runQa node half on each plate, the zooms, the fly chunk, LIB-3 M1-M7 (moved from :330-331) A4, A7 mutations: the next k down (reverse_lunge 2.5, dumbbell_fly 2) turns H3 red | 13.66 | in-process | page/search call in test; helpers mutated[in]; beforeAll/Each  in-proc |
| tests/howto/lb7-plates.test.ts | LIB-17 resume 3 A2: the 8 approved LB7 plates stay byte-identical (page c457ee86 on main 6d34542c) the 8 approved plates' fragments on this head equal main's | 13.64 | in-process | page/search call in test; helpers fragProblems[in]; beforeAll/Each  in-proc |
| tests/howto/lb8-plates.test.ts | LIB-18 A10: the LB8 plates page is deterministic (PQ-H7) two builds of the LB8 rows are byte-identical (in a child process) | 13.32 | in-process | helpers ids[in],node[in] |
| tests/howto/library-qa-h10-child.test.ts | LIB-3c 3c-A5 the child proof (D-LIB10-CHILDPROOF) control: a clean D child and a clean T child, with test family rows present, give no H10 problem; no rebuild module is left behind | 13.27 | in-process | page/search call in test; helpers pageFor[in] |
| tests/howto/lb7-plates.test.ts | LIB-17 resume 3 A2: the 8 approved LB7 plates stay byte-identical (page c457ee86 on main 6d34542c) incline_push_up (approved, mx13) keeps its 9 fragment shas; mutation: one byte in its Mistake alt is red | 13.26 | in-process | page/search call in test; helpers keys[in],incProblems[in]; beforeAll/Each  in-proc |
| tests/howto/lib8r-pilot-a3.test.ts | PILOT-A3 A8, A10: runQa node half on each plate, the zooms, the fly chunk, LIB-3 M1-M7 (moved from :330-331) A10 M4 the Mistake equal to the end pose, and M5 the start equal to the end, turn PQ-H3 red | 13.11 | in-process | page/search call in test; helpers mutated[in]; beforeAll/Each  in-proc |
| tests/howto/lb3-plates.test.ts | LIB-13 A10: the LB3 plates page is deterministic (PQ-H7) two builds of the drawn LB3 ids are byte-identical | 13.03 | in-process | page/search call in test |
| tests/howto/lb5-plates.test.ts | LIB-15 A15: Mistakes, tells, cues, leaders and the R10 items, on drawn items (DESIGN.md sections 7, 9) no leader comes within 6 px of the Trace, a cable or the pad; mutation: a leader boxed across the pad is red | 13.03 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/howto/library-cards8.test.ts | LIB-5 S3 and S12 on the S3 fixture card: candidateOf and runQa in a copy of E1's tree (D-LIB5-FIXTURE 4) mutations through researchOf and runQa, each red | 13.00 | in-process | page/search call in test; helpers withCard[in]; beforeAll/Each  in-proc |
| tests/howto/library-qa-h10.test.ts | LIB-3b PQ-H10 on the real path 3b-A10 a malformed envelope row fails closed | 12.66 | in-process | page/search call in test |
| tests/howto/lb7-plates.test.ts | LIB-17 resume 3 A2: the 8 approved LB7 plates stay byte-identical (page c457ee86 on main 6d34542c) diamond_push_up (approved, mx15) keeps its 9 fragment shas; mutation: one byte in its alt is red | 12.39 | in-process | page/search call in test; helpers keys[in]; beforeAll/Each  in-proc |
| tests/howto/lb7-plates.test.ts | LIB-17 Mistakes, tells, cues and callouts (DESIGN.md sections 9-10) A15: every callout and tell anchor sits on an item drawn in its pose (within 3 px) | 12.36 | in-process | page/search call in test |
| tests/howto/lb4-plates.test.ts | LIB-14 A4: runQa node half on an LB4 plate (lib_wall_sit), LIB-3 M1-M7 and a colour literal A4: pistol_squat (in rows.json since the strip release) raises F7 on its node half; its topFault set to its drawn key drops F7, so the ruled expected set fails | 11.43 | in-process | page/search call in test; helpers node[in],research[in]; beforeAll/Each  in-proc |
| tests/howto/library-qa-h10-child.test.ts | LIB-3c 3c-A4 PARAMS ranges (D-LIB10-RANGES, D-LIB3c-SHARED) one object: H10's value check and the child rebuild read the same object (family row first, then ctx.envelope) | 11.21 | in-process | page/search call in test; helpers keys[in] |
| tests/library/hand-pairs.test.ts | LIB-7 A1: golden B unchanged with every hand-*.mjs loaded the 8 close-ups === the frozen golden-B scripts (LIB-6 compare), after loading all key modules | 11.12 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/howto/lb8-plates.test.ts | LIB-18 hack_squat A18: physics on drawn items, every drawn pose and ghost every pad, the plate, the rail and the posts are joined to the frame | 10.88 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/library/closeups.test.ts | LIB-6 close-up renderer, API level every close-up string of all 8 === the frozen golden-B script's | 10.61 | in-process | no named build/exec call; imports and calls library modules inside the worker |
| tests/howto/lb9-plates.test.ts | LIB-21 A10: the LB9 plates page is deterministic (PQ-H7; built in an awaited child process) two builds of the LB9 rows are byte-identical | 10.58 | child process | exec in test; page/search call in test; helpers sha[in],ids[in] |
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) renegade_row mutations: the pair removed is red at the zoom; k 2 (11.28 px) is red; the zoom removed is red at plate scale | 10.44 | in-process | page/search call in test; helpers mutated[in],keys[in]; beforeAll/Each  in-proc |
| tests/howto/lb5-plates.test.ts | LIB-15 A2 / Do 4: the preacherPad composer and the drawn plates draw PRIMITIVES only the drawn plates pass PQ-H9 | 10.28 | in-process | page/search call in test |
| tests/howto/lib8r-pilot-a3.test.ts | PILOT-A3 A8, A10: runQa node half on each plate, the zooms, the fly chunk, LIB-3 M1-M7 (moved from :330-331) reverse_lunge: every node hard check passes with zero exemptions; the node flags are the expected set | 10.02 | in-process | it.each: qa(await candOf(id)) (manual read) |

Counts by mode: {"child process":17,"in-process":45}

## (d) 10 slowest in-process tests (these block the vitest worker)

| file | test | seconds |
|---|---|---|
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) mutations: each zoom removed is red on the plate-scale bar; resistance_band_pull_apart at k 1.5 and bench_dip's trace on the still heel are red at the zoom | 55.62 |
| tests/howto/lib-4d.test.ts | LIB-4d R2: ownRowsTree drops every batch row, its golden file, its pages and the files only it had; else it is the plain copy | 40.37 |
| tests/howto/library-core.test.ts | L2-A4: a new library batch row stales none of the 8's generated files with a synthetic batch row, the 54 fingerprinted files keep their header and the 8 ht- modules their hashes: line; the id files see the row | 39.26 |
| tests/howto/lb8-plates.test.ts | LIB-18 A4: runQa node half on an LB8 plate (lib_hack_squat), LIB-3 M1-M7 and a colour literal A4 M1 a label 1 px onto the figure (the Thighs to parallel callout) turns PQ-H1 red; 1 px back is clean | 34.60 |
| tests/howto/lb8-plates.test.ts | LIB-18 A15 (D-LIB18-PADS): no pad, roller, seat or bench sits inside the body, on every drawn LB8 spec each named item clears the body or touches it within 0.5 cm, in every pose, via and ghost (depths logged) | 27.29 |
| tests/library/lib7b.test.ts | 7b-A2 on a scratch tree: the real pipeline with the scratch rows shipped on real LIB-7 keys generate: each pair row's zoom-<chromeId>.css (hands.mjs + handpairs.mjs) holds its pair scope's rules before HX_TAIL; the handpair files are written | 23.94 |
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) each zoomed spec asks for its ruled zoom, and its plate fails PQ-H3 on that view at plate scale (why the zoom exists) | 23.79 |
| tests/howto/lb5-plates.test.ts | LIB-15 A9: nothing ships (D-LIB15-AHEAD) generate --check is green, and no generated file is read from lb5/, the LB5 specs, the composer or How-to sources | 22.93 |
| tests/howto/lb7-plates.test.ts | LIB-17 resume: the LIB-ZOOM circles (D-LIBZOOM-EXTEND; DESIGN.md section 17) the node half has no problem on either zoomed plate; the bar is met inside the circle at k, never lowered | 22.62 |
| tests/howto/lb3-plates.test.ts | LIB-13 A9: nothing ships (D-LIB13-AHEAD) generate --check is green, and no generated file is read from lb3/, the LB3 specs, composers or How-to sources | 21.61 |
