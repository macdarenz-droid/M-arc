# LIB-2: scale core (design note)

Card LIB-2 of the library plan (`claude/howto-options:docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md`, sections
2.7, 5.1-5.5 and the LIB-2 row of 7). Status: **design note only**. No LIB-2 code is written before HT-10 (#166)
merges and LIB-1 reports its numbers. Every file and line below was read on `origin/main` at `94fd32c`.

## 1. Goal

Turn every place that names the 8 approved exercises into data, so a batch adds rows, not code. The 8 must come out
byte-identical: golden A `e2bea90c…` (860,766 B), every generated file under `src/howto/**` and
`src/slices/howto/css/**`, and the pilot A plates page `f4dc5ec3…`.

## 2. Prerequisites

| Kind | What | Why |
|---|---|---|
| Build | HT-10 #166 merged | It adds `fidelity/shard.mjs` (`htShard`, `htTuples`, `writeProof`), the `totals` entry in `tests/howto/budgets.json` and `fidelity/harness.mjs` changes LIB-2 must build on, not race. |
| Build | LIB-1 numbers | Real typecheck and vitest time with ~460-500 generated files, `ids.ts` bytes at 153, `ht-index` chunk size, tap-to-plate with 153 loaders. Every "est." in 5 below is replaced by them before code starts. |
| Build | HT-9 #113 merged or rebased onto | It touches `scripts/screenshot-gate.mjs` and `tests/howto/budgets.json`, the same files LIB-2 reads for budgets. |
| Merge | LIB-1 report accepted by the supervisor; HT-10 in `main`; `origin/main` merged into the LIB-2 head with a merge commit | AGENTS merge rule. |
| Merge, after | LIB-3 #180, LIB-6 #181, LIB-8 #109 merge `main` after LIB-2 | They import `golden.mjs` names that LIB-2 moves (8). |

## 3. What names the 8 today (the full list)

| File | What is written in | LIB-2 change |
|---|---|---|
| `tools/plates/golden.mjs:24-41` | `PINS` (golden A sha, bytes, font, ref-src md5) and `LIB_OF` (chrome id → lib id) | `LIB_OF` is derived from `tools/plates/plates.json` (every row already has `chromeId`). `PINS` moves to `tests/howto/golden/pins.json`, inside the HT guard, so a pin change needs `[golden update]`. `golden.mjs` re-exports both names, so callers do not change. |
| `tools/plates/golden.mjs:56` | `verifyVendor` source regex: a literal list of 6 commits | The allowed sources are read from `tests/howto/golden/pins.json` `vendorSources[]`, each with its decision id. Same set, same message. |
| `tools/plates/gen/plates.mjs:15-19, 74` | inputs are the whole vendor folder, `plates.json`, the golden fixture; `HOWTO_IDS` emitted from the 8 | Per-id inputs (6). `ids.ts` emission moves to a new plugin `gen/ids.mjs` (7). |
| `tools/plates/gen/content.mjs:46-49` | inputs: every `exercises/<id>.howto.mjs` for every row | Per-output inputs (6). |
| `tools/plates/gen/hands.mjs:127-131` | `HAND_MEASURED` table keyed by the 8 chrome ids | Moves to `tools/plates/library/budgets/hands.json`; `handCeiling` reads it. Values unchanged. |
| `tools/plates/gen/feel.mjs:23-26`, `gen/zooms.mjs:20-23` | inputs: the whole golden-B layers folder + `plates.json` | Per-output inputs (6). |
| `tools/plates/fidelity/harness.mjs:184-187` | `HT_PLATES` pairs | Derived from `plates.json` rows in file order (the same order as today; a test pins it). |
| `tools/plates/fidelity/harness.mjs:194-203` | `firstWithoutHowTo()` parses `HOWTO_IDS = [...]` from `ids.ts` with a regex | Calls the generated `hasHowTo` through a Node-side mirror `tools/plates/library/ids-node.mjs` (7), because the list literal disappears. |
| `src/howto/ids.ts` | `HOWTO_IDS` literal list, `HowToId` union, `HOWTO_HINTS` | Hash-set encoding (7). |
| `src/howto/types.ts:13` | `LibId`, a literal union of the 8 | Generated `src/howto/lib-id.ts` from `plates.json` + `library/batches/*.json` (7). |
| `src/howto/generated/index.ts:4` | `LOADERS: Record<LibId, …>` in the main `HowToSheet` chunk | Moves to its own `ht-index` chunk (7). |
| `tools/plates/layers/artifact/shoot2.mjs` | golden-B ids and flags | **Not edited**: it is a vendored golden-B file (`layers/MANIFEST.json`). Its callers (`fidelity/goldenB.mjs`) keep calling it for the 8; library pages use LIB-6's builder. |
| HT-5..HT-8 layer generators: `gen/content.mjs`, `gen/hands.mjs`, `gen/zooms.mjs`, `gen/feel.mjs` | read only golden B's 8 specs | Each reads a per-id source path from the registry (5): golden B for the 8, `tools/plates/library/howto/<id>.howto.mjs` for a library id. For the 8 the path and bytes read are the same as today. |
| HT-9 (#113, open) | adds `sections/Setup.tsx`, `Risks.tsx`, no generator | Nothing to move; re-checked when it merges. |
| HT-10 (#166, open) | `fidelity/ht10.mjs`, `shard.mjs` take id lists as arguments | Fed from the registry; no edit to HT-10's blocks. |

## 4. The library tree

```
tools/plates/library/
  registry.mjs        the one reader: rows of plates.json (the 8) + batches/*.json (library), validated
  batches/<batch>.json  id -> { src, slug, prefix, chromeId, mode: H|P|T|D, parent?, params?, batch, status }
  specs/ templates/ eq/ hands/ render/ howto/ qa/    (specs, eq from LIB-8; render from LIB-6; qa from LIB-3)
  derive.mjs          D/T helpers + PARAMS validator (5)
  build-page.mjs      plates page builder (2.7), taken over from LIB-8 (9)
  ids-node.mjs        Node mirror of the hash set (tests, harness)
  MANIFEST.json       every library source -> sha256 + approving golden entry hash
tests/howto/golden/
  pins.json           golden A pins + allowed vendor sources (moved out of golden.mjs)
  library/<batch>.json  per-batch hash chain (6)
```

`plates.json` keeps the 8 untouched (its bytes are an input of every generated file today). Library rows never go
into it; they live in `batches/*.json`, so adding a batch changes no input of the 8's files.

## 5. The 8 and the library as data

- **Registry.** `registry.mjs` exports `rows()` (the 8 then the library, each batch file in checklist order), `libOf`,
  `idsShipped()` (rows whose `status` is `shipped`) and `sourceOf(id)`. It throws on a duplicate id, a chrome id or
  prefix clash, an id not in `src/data/exercises.json`, or an unknown `mode`.
- **D/T helpers (`derive.mjs`).**
  - `D` (derived from one of the 8) and `T` (template child) plates are a parent spec plus `params`.
  - `PARAMS` is the closed list of keys a child may set, each with a type and range: grip width, bar kind, bench
    angle within the template's approved envelope, load primitive, handedness, stance.
  - `derive(parent, params)` refuses an unknown key, an out-of-range value, a `view` change (templates are one view,
    plan 1) and any key LIB-3's envelope does not name. A refusal names the key and the batch file.
- **coverage.ts status.** HT-4's `CoverageEntry` gains three statuses, generated from the registry:
  - `review`: built, waiting on the owner's sheet; no button.
  - `blocked:evidence`: research could not verify a claim; carries `reason`; no button.
  - `held`: the owner or a ruling held it (e.g. `D-LIB8-fly`); carries `decision`; no button.
  - `approved` and `pending` keep their meaning. `hasHowTo(id)` is true only for `approved` ids that ship.
  - Today's file is hand-edited by HT-4 rule ("edited by hand only to record a card's own archetype change"). LIB-2
    generates it; the archetype column comes from a data file holding today's values exactly, so the generated file
    equals today's bytes plus the GENERATED header. That header is the one change to an existing file's text, and it
    is called out in the PR.

## 6. Hashes and goldens

- **Per-file `inputsSha256`.** The HT-2 core (`lib/inputs.mjs`) already hashes per output over the writers plus
  their `inputs()`. The problem is that each plugin's `inputs()` is one static list for all its outputs, so a new
  batch row stales the 8's files. Fix, without touching the frozen core in the same PR:
  - an output may carry its own `inputs` array; `render()` uses it instead of the plugin-wide list when present;
  - this is a core change, so it is its own commit titled "HT-2 core: per-output inputs", with a unit test;
  - each plugin then returns, per output, only that id's files plus the shared files it reads.
  - For the 8 the hash changes once (the input list narrows), so every header line changes once. **This is not a
    byte-identity break of anything pinned**: L1/L2 compare page and fragment bytes, which have no header. The PR
    lists the header-only diff and proves it is header-only by a test that strips line 1 and compares.
- **Per-batch golden files with a parent-hash chain.** `tests/howto/golden/library/<batch>.json`, one per batch and
  per pilot. The first entry's `parent` is the current head entry hash of `GOLDEN.json`; each next entry's `parent` is
  the previous entry's sha256. Entries are those of plan 3.5 (`plates-page`, `layers-page`, per-id `plate` with 9
  fragment shas and `layers`, template sha, card stamp hash, exemptions, `approvedBy`, words, date, decision).
  `verifyChain` from `golden.mjs` is reused per file. Two batches never write the same file, so parallel batches
  never conflict at a chain tail.
- **Derived fixtures.** No library page or fixture is committed. CI rebuilds each pinned page from its sources with
  the plates page builder and compares sha256 (L1). The 8's committed fixtures stay as HT-1 left them.

## 7. App side

- **`ids.ts`.** `hasHowTo(id) = id.startsWith('lib_') && SET.includes(h(id))`, where `h` is FNV-1a 32-bit folded to
  30 bits, written as 5 base-64 characters, over the **shipped ids only**, so an unknown id is false.
  - The generator hashes every id in `exercises.json` and refuses a collision between a shipped id and any other id
    (salting is the recorded fallback; 4-character hashes if LIB-1 measures over budget).
  - `exercises.json` becomes an input of `ids.ts`, so a new id fails `generate --check` until regenerated.
  - Hints: deduplicated by text, one index per id. `howToHint(id)` replaces `HOWTO_HINTS[id]`.
  - `ids-node.mjs` imports the same pure functions (one source, tested equal).
- **Generated `LibId`.** `src/howto/lib-id.ts` (generated, types only) holds the union of every registry id;
  `types.ts` re-exports it. `HowToId` becomes `LibId & { readonly __howto: true }` (branded), so `hasHowTo` stays a
  type guard. Types cost 0 bytes; the footprint test proves it.
- **`ht-index` chunk.** `LOADERS` moves from `generated/index.ts` into `generated/ht-index.ts`, imported dynamically
  by the sheet in parallel with the sheet chunk. Its budget is set once at measured + 10 %. The `HowToSheet` budget
  and the main content probe stay unchanged.
- **Total-size re-set (plan 5.1).** HT-10 sets `totals[0]` to 564,585 B gz (measured 513,259 B + 10 %). LIB-2 turns
  it into a rule over integers: `gzMax = ceil(513,259 × 11 × N / 80)` for N shipped ids (the 8's measured mean plus
  10 %, times N; the product is rounded once, not per id). For N = 8 this gives 564,585 B, exactly HT-10's value, so nothing moves today; each batch is checked against its own N. HT-11 may
  only lower the mean. Recorded as decision D-LIB2-total.
- **Library negative control.** Already data-driven on `main` (`firstWithoutHowTo`, harness.mjs:194; gate
  screenshot-gate.mjs:6149). LIB-2 only rewires it to call `hasHowTo` instead of parsing the list literal. No gate
  block is edited. When LB2 ships bench press the control moves on by itself; HT plan R17's manual switch is not
  needed.

## 8. How "the 8 stay byte-identical" is proven

1. **L1:** `node tools/plates/golden.mjs --check` rebuilds golden A from the vendored sources: `e2bea90c…`, 860,766 B.
2. **Builder:** `build-page.mjs` with the 8's registry rows rebuilds the same bytes (LIB-8's test, moved).
3. **Generated files:** `generate --check` passes, and a test strips the header line from every generated file and
   compares with the same files at the base commit, byte for byte (header-only diff).
4. **L2:** each `ht-<slug>.ts` fragment `===` its GOLDEN entry (unchanged `gen/plates.mjs` check).
5. **L3:** HT-3's fidelity run on the 8 is unchanged (same harness, `HT_PLATES` derived, a test pins its order).
6. **Pilot A:** the pilot A plates page rebuilds `f4dc5ec3…` from LIB-8's specs through the registry.
7. **App:** the exhaustive unit test of plan 5.2: for every id in `exercises.json`,
   `hasHowTo(id) === (id in LOADERS)` and the hint equals the generated content's. Custom ids are false.

## 9. Files LIB-2 owns, and collisions

**New (LIB-2 owns):** `tools/plates/library/{registry,derive,ids-node}.mjs`, `library/batches/`,
`library/MANIFEST.json`, `library/budgets/hands.json`, `tools/plates/gen/ids.mjs`, `src/howto/lib-id.ts`,
`src/howto/generated/ht-index.ts`, `tests/howto/golden/pins.json`, `tests/howto/golden/library/` (format only; entries
are added by the supervisor's `[golden update]` commits), `tests/howto/library-core.test.ts`.

**Edited (called out in the PR):** `tools/plates/golden.mjs` (PINS/LIB_OF become reads; exported names unchanged),
`tools/plates/lib/inputs.mjs` + `generate.mjs` (per-output inputs, own commit), `tools/plates/gen/*.mjs` (inputs,
registry), `tools/plates/fidelity/harness.mjs` (`HT_PLATES`, `firstWithoutHowTo` only), `src/howto/{ids,types,
coverage}.ts`, `src/howto/generated/index.ts`, `src/slices/howto/lazy.tsx` (smallest wiring for `ht-index`),
`tests/howto/{ids,hint,footprint}.test.ts` (move to `howToHint`, same four failure paths; no assertion loosened).

**Collisions (both frozen as passed; LIB-2 never edits their paths):**
- **HT-10 #166** writes `fidelity/harness.mjs` (+631 lines), `shard.mjs`, `ht10.mjs`, `perf.mjs`,
  `tests/howto/budgets.json`, `scripts/screenshot-gate.mjs`. LIB-2 builds after it merges and touches only
  `HT_PLATES` and `firstWithoutHowTo` in `harness.mjs`.
- **LIB-3 #180** owns `tools/plates/library/qa/**`. LIB-2 imports nothing from it; LIB-3 imports `LIB_OF`, `PINS`
  from `golden.mjs`, which keep their names.
- **LIB-6 #181** owns `tools/plates/library/render/**`, `build-layers-page.mjs`, `tests/library/closeups.test.ts`.
  No overlap.
- **LIB-8 #109** already wrote `tools/plates/library/build-page.mjs`, `engine.mjs` and its test. The plan gives the
  plates page builder to LIB-2. Decision D-LIB2-builder: LIB-2 takes those three files **byte for byte** from LIB-8's
  head into its PR (with LIB-8's builder named in the commit), so LIB-8 merges `main` with no conflict; LIB-2 only
  adds the registry input. No rewrite.

## 10. Acceptance tests (each with the mutation that must turn it red)

| Id | Test | Mutation that turns it red |
|---|---|---|
| L2-A1 | `golden.mjs --check` passes; page `e2bea90c…`, 860,766 B | change one byte of `tests/howto/golden/pins.json` `pageSha256` |
| L2-A2 | builder rebuilds golden A from registry rows of the 8 | swap two rows in `plates.json` order |
| L2-A3 | header-only diff of every generated file vs base | change one character in `gen/hands.mjs` output text |
| L2-A4 | a new batch row changes no header of the 8's files | make `gen/content.mjs` return the plugin-wide inputs again |
| L2-A5 | `generate --check` fails when `exercises.json` gains an id until regenerated | drop `exercises.json` from `gen/ids.mjs` inputs |
| L2-A6 | exhaustive `hasHowTo(id) === (id in LOADERS)`, hint equality, custom false | add a non-shipped id to the hash set |
| L2-A7 | unknown `lib_` id with no collision is false | encode the complement set (the rejected hybrid design) |
| L2-A8 | collision refusal | force `h` to return a constant |
| L2-A9 | `ids.ts` ≤ 2,048 B and `ids.ts` + `lazy.tsx` ≤ 3,072 B on the 8 and on a synthetic 153-id build | inline the list literal |
| L2-A10 | `ht-index` is its own chunk, not in `HowToSheet-*.js`; its budget is measured + 10 % | import `LOADERS` statically |
| L2-A11 | `derive` refuses unknown key, out-of-range value, view change | accept any key |
| L2-A12 | registry refuses duplicate id, prefix clash, id not in `exercises.json` | remove the duplicate check |
| L2-A13 | coverage statuses: `review`, `blocked:evidence`, `held` give no button | let `hasHowTo` return true for `held` |
| L2-A14 | chain: each batch file's first `parent` = `GOLDEN.json` head; each next = previous sha | edit one entry's `why` |
| L2-A15 | total rule gives 564,585 B for N = 8 and fails a batch over its N × mean | round per id (`ceil(mean × 1.1) × N` gives 564,592) |
| L2-A16 | `firstWithoutHowTo()` = today's value on the 8 and moves on when an id ships | hard-code `lib_barbell_bench_press` |
| L2-A17 | pilot A page rebuilds `f4dc5ec3…` | change one PARAMS default |
| L2-A18 | `HT_PLATES` order equals today's literal order | sort rows by id |

Plus the AGENTS checks on the exact head: `npm run check`, `npm run test:tz`, the gate.

## 11. Risks

- **Header churn** in every generated file at once: one reviewable header-only commit, proven by L2-A3.
- **Generated-file count** slows typecheck or vitest at 153: LIB-1 measures; fallback `.js` + `.d.ts` (supervisor
  decision), never a skipped check.
- **`coverage.ts` becomes generated:** today's hand-edit rule moves to its data file; the PR says so.
- **LIB-8 builder takeover** could fork two copies: the files move byte for byte and LIB-8 merges `main` after.
- **Hash collision across future ids:** refused at generate time, so it can never ship silently.
