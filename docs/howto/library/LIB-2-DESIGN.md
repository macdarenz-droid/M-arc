# LIB-2: scale core (design note)

Card LIB-2 of the library plan (`claude/howto-options:docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md`, sections
1, 2.7, 5.1-5.5 and the LIB-2 row of 7). Status: **design note only**. No LIB-2 code is written before HT-10 (#166)
merges and LIB-1 reports its numbers. Every file and line below was read on `origin/main` at `94fd32c`.
Revised after reviews "REVIEW LIB-2 design @ 1258c90" (15 findings) and "@ d61cefd" (8 findings); all addressed.

## 1. Goal

Turn every place that names the 8 approved exercises into data, so a batch adds rows, not code. The 8 must come out
unchanged: golden A `e2bea90c…` (860,766 B), the golden-B layers page, and the bodies of the 45 generated files
LIB-2 does not rewrite (6.1). The 5 generated files it does rewrite or add are proven by their own tests (6.1).

## 2. Prerequisites

| Kind | What | Why |
|---|---|---|
| Build | HT-10 #166 merged | It adds `fidelity/shard.mjs` (`htShard`, `htTuples`, `writeProof`), the `totals` entry in `tests/howto/budgets.json` and `fidelity/harness.mjs` changes that LIB-2 builds on, not races. |
| Build | LIB-1 numbers | Real typecheck and vitest time with ~460-500 generated files, `ids.ts` bytes at 153, `ht-index` chunk size, tap-to-plate with 153 loaders. Every "est." in 7 is replaced by them before code starts. |
| Merge | LIB-1 report accepted by the supervisor; HT-10 in `main`; `origin/main` merged into the LIB-2 head with a merge commit | AGENTS merge rule. |
| Merge, after | LIB-3 #180, LIB-6 #181, LIB-8 #109 merge `main` after LIB-2 | They import names that LIB-2 keeps stable (9). |

HT-9 #113 is **not** a prerequisite: its only overlap is 24 lines of `tests/howto/budgets.json`, which a `main` merge
covers.

## 3. What names the 8 today (the full list)

| File | What is written in | LIB-2 change |
|---|---|---|
| `tools/plates/golden.mjs:24-41` | `PINS` (golden A sha, bytes, font, ref-src md5) and `LIB_OF` (chrome id → lib id) | `LIB_OF` is derived from `tools/plates/plates.json` (every row already has `chromeId`). `PINS` moves to `tools/plates/pins.json` (the plan 5.3 data move); `golden.mjs` re-exports both names, so callers do not change. `pins.json` joins `gen/plates.mjs`'s inputs (beside `golden.mjs`, `gen/plates.mjs:17`), so a pin edit stales the 8's files (L2-A20). The values stay asserted by `vendor.test.ts:51,55` and `golden.test.ts:58`, unedited. |
| `tools/plates/golden.mjs:56` | `verifyVendor` source regex: a literal list of 6 commits | The allowed sources are read from `pins.json` `vendorSources[]`, each with its decision id. Same set, same message. |
| `tools/plates/gen/plates.mjs:15-19, 74` | inputs are the whole vendor folder, `plates.json`, the golden fixture; `HOWTO_IDS` emitted from the 8 | Per-output inputs (6.1). `ids.ts` emission moves to a new plugin `gen/ids.mjs` (7). `moduleText` and `viewOf` keep their signatures and output (9). |
| `tools/plates/gen/content.mjs:46-49` | inputs: every `exercises/<id>.howto.mjs` for every row | Per-output inputs (6.1). |
| `tools/plates/gen/hands.mjs:127-131` | `HAND_MEASURED` table keyed by the 8 chrome ids | Moves to `tools/plates/library/budgets/hands.json`; `handCeiling` reads it. Values unchanged. |
| `tools/plates/gen/feel.mjs:23-26`, `gen/zooms.mjs:20-23` | inputs: the whole golden-B layers folder + `plates.json` | Per-output inputs (6.1). |
| `tools/plates/fidelity/harness.mjs:184-187` | `HT_PLATES` pairs | `HT_PLATES = rows().map(r => [r.chromeId, r.id])` over `plates.json` rows in file order, which is today's literal order (L2-A18). HT-10's `ht10Sweep` (`ids = HT_PLATES.map(…)`, #166 harness.mjs:1256), its `htTuples` call (:1569) and `ht10.mjs:42,98` all default to `HT_PLATES`, so deriving it feeds them with **no HT-10 line edited**. |
| `tools/plates/fidelity/harness.mjs:194-203` | `firstWithoutHowTo()` parses `HOWTO_IDS = [...]` from `ids.ts` with a regex | Calls `hasHowTo` from `tools/plates/library/ids-node.mjs` (7), because the list literal goes away. |
| `src/howto/ids.ts` | `HOWTO_IDS` literal list, `HowToId` union, `HOWTO_HINTS` | Hash-set encoding (7). |
| `src/howto/types.ts:13` | `LibId`, a literal union of the 8 | Generated from `exercises.json` (7). |
| `src/howto/generated/index.ts:4` | `LOADERS: Record<LibId, …>` in the main `HowToSheet` chunk | Moves to its own `ht-index` chunk (7). |
| `tools/plates/layers/artifact/shoot2.mjs` and HT-3's fidelity reference (one fixed golden page in `harness.mjs`) | golden-B ids and flags; the 8's golden page | **Kept as code, by decision D-LIB2-shoot2**: `shoot2.mjs` is a vendored golden-B file (`layers/MANIFEST.json`) and may not be edited; HT-3's reference stays the 8's page. Library ids never go through either: LIB-4's runner `library/fidelity.mjs` calls `openGolden({ html })` with each pinned library page, and LIB-6's layers builder replaces `shoot2` for library pages. So plan 5.3's "becomes data" is met for every id that is not one of the 8, and LIB-23 does not reopen it. |
| HT-5..HT-8 layer generators: `gen/content.mjs`, `gen/hands.mjs`, `gen/zooms.mjs`, `gen/feel.mjs` | read only golden B's 8 specs | Each reads a per-id source path from the registry (5): golden B for the 8, `tools/plates/library/howto/<id>.howto.mjs` for a library id. For the 8 the paths and bytes read are today's. |

## 4. The library tree

```
tools/plates/pins.json              golden A pins + allowed vendor sources (moved out of golden.mjs)
tools/plates/library/
  registry.mjs        the one reader: rows of plates.json (the 8) + batches/*.json (library), validated
  batches/<batch>.json  id -> { src, slug, prefix, chromeId, mode: H|P|T|D, parent?, params?, batch, stage }
  specs/ templates/ eq/ hands/ render/ howto/ qa/    (specs, eq from LIB-8; render from LIB-6; qa from LIB-3)
  derive.mjs          D/T helpers + PARAMS validator (5)
  build-page.mjs      plates page builder (2.7), taken over from LIB-8 (9)
  ids-node.mjs        generated Node twin of ids.ts (7)
  MANIFEST.json       every library source -> sha256 + approving golden entry hash
tests/howto/golden/library/<batch>.json   per-batch hash chain (6.2)
```

`plates.json` keeps the 8 untouched (its bytes are an input of the 8's generated files). Library rows never go into
it; they live in `batches/*.json`, so adding a batch changes no input of the 8's files.

## 5. The 8 and the library as data

- **Registry.** `registry.mjs` exports `rows()` (the 8 then the library, batch files in checklist order), `libOf`,
  `shippedIds()` (rows whose stage is `shipped`) and `sourceOf(id)`. It throws on a duplicate id, a chrome id or
  prefix clash, an id not in `src/data/exercises.json`, an unknown `mode` or `stage`, and on zero rows.
- **D/T helpers (`derive.mjs`).**
  - `D` (derived from one of the 8) and `T` (template child) plates are a parent spec plus `params`.
  - `PARAMS` is the closed list of keys a child may set, each with a type and range: grip width, bar kind, bench
    angle, load primitive, handedness, stance, and **camera scale** (`camera.maxScale`, so `leg_press_calf_raise`
    stays D, plan 1 "small-motion zoom"; a scale outside the envelope is flag F1, never a margin).
  - `derive(parent, params, envelope)` takes the envelope **as an argument**. It refuses an unknown key, a value
    outside the envelope's range for that key, and a `view` change (templates are one view, plan 1). In LIB-2 the
    tests inject a fixture envelope; when LIB-3 merges, its `qa/envelope.json` is passed in by the generator. LIB-2
    has no import from LIB-3.
- **`coverage.ts` stage (decision D-LIB2-status).** The plan's vocabulary is used as a new field, `stage`:
  `queued | researching | drawing | review | approved-plate | shipped | blocked:<reason> | left-out:<decision>`
  (plan 1). HT-4's `status` field stays as its C6 contract, so `tests/howto/checks/c6.ts` compiles and passes
  unedited. The mapping is one rule, tested over all 153 ids: `status: 'approved'` ⇔ `stage: 'shipped'`; every
  other stage has `status: 'pending'` with its `archetype`. `hasHowTo(id)` is true only for `shipped`. LIB-23's C6R
  reads `stage` (`shipped`, `left-out:<decision>`). The file becomes generated from the registry plus an archetype
  data file holding today's values, so its text changes (new field, GENERATED header); no "same bytes" claim is made.

## 6. Hashes and goldens

### 6.1 Per-output `inputsSha256`

- **Today.** The HT-2 core (`lib/inputs.mjs`, `generate.mjs`) writes the hash in two places: the header line, and,
  through `ctx.hashFor(path)` (`generate.mjs:40`), the `hashes: { inputsSha256: … }` line inside the 8 `ht-*.ts`
  bodies (`gen/plates.mjs:56,116`, `gen/content.mjs:121,169`). Both use each plugin's one static `inputs()` list, so a
  new batch row would change the 8's files.
- **Change (one commit titled "HT-2 core: per-output inputs", with its own unit test):**
  - an output may carry its own `inputs` array; `render()` uses it for the header instead of the plugin-wide list;
  - `ctx.hashFor(path, inputs)` takes the same per-output list, so the body's `hashes:` line and the header agree;
  - each plugin passes, per output, only that id's files plus the shared files it reads.
- **Generated files before and after.** Today there are 47 (1 `ids.ts` + 1 `archetypes.ts` + 33
  `src/howto/generated/*` + 12 `src/slices/howto/css/*`). After LIB-2 there are **50**:
  - **45 untouched in body:** 32 `generated/*` (all but `index.ts`), `archetypes.ts` and the 12 css files. Their
    header changes, and the 8 `ht-*.ts` among them also change their `hashes:` line. Nothing else in them changes.
  - **5 rewritten or new:** `ids.ts` (body becomes the hash set), `generated/index.ts` (loses `LOADERS`), and the new
    `generated/ht-index.ts`, `lib-id.ts` and generated `coverage.ts`. They are proven by L2-A6 (`hasHowTo` ⇔
    `LOADERS`, 153 ids), L2-A9 (`ids.ts` size), L2-A10 (`ht-index` chunk) and L2-A13 (stage mapping, `c6.ts`).
  - A test asserts exactly 50 generated files after the change (red on 49 or 51, and on an empty output).
- **Identity proof for the 45, in CI's depth-1 checkout** (no base commit needed):
  `tests/howto/fixtures/generated-bodies.json` is committed **before** the core change, with
  `sha256(body without line 1 and without the `hashes:` line)` for those 45 files only. The test regenerates in
  memory, asserts exactly **45** listed files are produced, and compares every entry. Red cases: an empty output
  list, a missing file, one changed byte in any body.
- **Budgets.** The 8 `ht-*` bodies ship in the app chunks. The hash is fixed-length hex, so raw chunk bytes stay the
  same, but the gz sizes can move by a few bytes. `budgets.test.ts:36-37` require
  `measuredGz ≤ gzMax ≤ ceil10(measuredGz)`, so the 8 `ht-*` entries are re-measured and `gzMax`/`rawMax` re-set to
  measured + 10 % under the `budgets.json:2` rule (`setBy: 'LIB-2'`, with the reason). Each may move a few bytes up
  or down. `budgets.test.ts` is not edited.

### 6.2 Per-batch golden files

- **File:** `tests/howto/golden/library/<batch>.json` = `{ base: { index, hash }, entries: [...] }`, one per batch and
  per pilot.
- **`base`** names an **existing** `GOLDEN.json` entry, not the head: `hash = sha256(JSON.stringify(GOLDEN.entries
  .slice(0, index + 1)))`. `GOLDEN.json` is append-only, so a later append (LIB-20, a LIB-25-style golden update)
  never changes that prefix hash.
- **`entries[i].prev`** = `sha256(JSON.stringify(entries.slice(0, i)))` within the file, the same rule as
  `verifyChain` (`golden.mjs:157-172`), and the same `supersedes` (file-local index), `approvedBy`, `date` and
  `decision` rules. Entry fields are those of plan 3.5.
- **`verifyBatchChain(file, goldenEntries)`** (new, in `golden.mjs`): runs `verifyChain(file.entries)` and checks
  that `base.index < goldenEntries.length` and `base.hash` equals the prefix hash at `base.index`.
- Two batches never write the same file, so parallel batches never conflict at a chain tail.
- **Derived fixtures.** No library page or fixture is committed. CI rebuilds each pinned page from its sources with
  the plates page builder and compares sha256 (L1). The 8's committed fixtures stay as HT-1 left them.

## 7. App side

- **`ids.ts`.** `hasHowTo(id) = id.startsWith('lib_') && SET.includes(h(id))`, where `h` is FNV-1a 32-bit folded to
  30 bits, written as 5 base-64 characters, over the **shipped ids only**, so an unknown id is false.
  - The generator hashes every id in `exercises.json` and refuses a collision between a shipped id and any other id
    (salting is the recorded fallback; 4-character hashes if LIB-1 measures over budget).
  - `exercises.json` is an input of `ids.ts`, so a new id fails `generate --check` until regenerated.
  - Hints: deduplicated by text, one index per id. `howToHint(id)` replaces `HOWTO_HINTS[id]`.
- **`ids-node.mjs`, one source.** The `gen/ids.mjs` plugin emits both `src/howto/ids.ts` and
  `tools/plates/library/ids-node.mjs` from one template string: the same `SET` literal and the same hash-function
  text, only the TypeScript annotations differ. A test asserts the two `SET` literals are byte-identical and that
  `hasHowTo` gives the same answer in both for all **153** `exercises.json` ids (count asserted; empty list red).
- **`LibId` from `exercises.json` (plan 5.2).** `src/howto/lib-id.ts` (generated, types only) is the union of all 153
  `exercises.json` ids, so it does not change per batch. `types.ts` re-exports it. `HowToId` becomes
  `LibId & { readonly __howto: true }` (branded), so `hasHowTo` stays a type guard. Types cost 0 bytes; the footprint
  test proves it.
- **`ht-index` chunk.** `LOADERS` moves from `generated/index.ts` into `generated/ht-index.ts`, imported dynamically
  by the sheet in parallel with the sheet chunk. It is typed `Partial<Record<LibId, () => Promise<{ default: BuiltHowTo }>>>`,
  because `LibId` has 153 ids and `LOADERS` only the shipped ones (today's `Record<LibId, …>` would fail typecheck).
  L2-A6 makes "every shipped id has a loader, and only those" exact. Its budget is set once at measured + 10 %. The `HowToSheet` budget
  and the main content probe stay unchanged.
- **Total-size rule (plan 5.1), both limits.** HT-10 sets `totals[0]` to `gzMax` 564,585 B and `rawMax` 2,552,519 B
  (measured 513,259 / 2,320,471 B, + 10 %). LIB-2 makes both a rule over integers for N shipped ids:
  `gzMax = ceil(513,259 × 11 × N / 80)`, `rawMax = ceil(2,320,471 × 11 × N / 80)`. For N = 8 they give 564,585 and
  2,552,519, HT-10's values exactly. HT-11 may only lower the means. Decision D-LIB2-total (corrected).
- **Library negative control.** Already data-driven on `main` (`firstWithoutHowTo`, harness.mjs:194; gate
  screenshot-gate.mjs:6149). LIB-2 only rewires it to `ids-node.mjs`'s `hasHowTo`. No gate block is edited.

## 8. How "the 8 stay unchanged" is proven

1. **L1:** `node tools/plates/golden.mjs --check` rebuilds golden A from the vendored sources: `e2bea90c…`, 860,766 B.
2. **Builder (L2-A2):** `build-page.mjs` with the 8's registry rows rebuilds the same bytes. LIB-8's
   `build-page.test.mjs` uses `node:test`, which vitest never runs (`vite.config.ts:26` includes only
   `tests/**/*.test.ts`), so the proof lives in `tests/howto/library-core.test.ts`.
3. **Generated files:** `generate --check` passes, and the body-hash test of 6.1 (47 files, header and `hashes:` line
   excluded) passes.
4. **L2:** each `ht-<slug>.ts` fragment `===` its GOLDEN entry (unchanged `gen/plates.mjs` check).
5. **L3:** HT-3's fidelity run on the 8 is unchanged (same harness; `HT_PLATES` derived; L2-A18 pins its order).
6. **App:** the exhaustive unit test of plan 5.2 over all 153 ids.

**Pilot A is not proven in LIB-2.** Its page `f4dc5ec3…` comes from LIB-8's `pilot-a/build.mjs`, `pilot-a/plates.json`
and `specs/*` (#109, not on `main`). The proof moves to **LIB-8's merge**: after LIB-8 merges `main` (with LIB-2), its
pilot page built through the registry must equal its pinned sha. **Owner of that proof:** LIB-8's builder adds it
to LIB-8's delta after its `main` merge (a test in `tests/howto/library-core.test.ts`), and the supervisor adds the line
"pilot A page through the registry = pinned sha" to LIB-8's card acceptance.

## 9. Files LIB-2 owns, and collisions

**New (LIB-2 owns):** `tools/plates/pins.json`, `tools/plates/library/{registry,derive,ids-node}.mjs`,
`library/batches/`, `library/MANIFEST.json`, `library/budgets/hands.json`, `tools/plates/gen/ids.mjs`,
`src/howto/lib-id.ts`, `src/howto/generated/ht-index.ts`, `tests/howto/golden/library/` (format only; entries are
added by the supervisor's `[golden update]` commits), `tests/howto/fixtures/generated-bodies.json`,
`tests/howto/library-core.test.ts`.

**Edited (called out in the PR):** `tools/plates/golden.mjs` (PINS/LIB_OF become reads; `verifyBatchChain` added;
exported names unchanged), `tools/plates/lib/inputs.mjs` + `generate.mjs` (per-output inputs and `hashFor`, own
commit), `tools/plates/gen/*.mjs` (inputs, registry), `tools/plates/fidelity/harness.mjs` (`HT_PLATES`,
`firstWithoutHowTo` only), `src/howto/{ids,types,coverage}.ts`, `src/howto/generated/index.ts`,
`src/slices/howto/lazy.tsx` (smallest wiring for `ht-index`), `tests/howto/{ids,hint,footprint}.test.ts` (move to
`howToHint`, same four failure paths; no assertion loosened), `tests/howto/budgets.json` (gz of the 8 `ht-*` chunks,
the totals rule).

**Collisions (frozen PRs; LIB-2 never edits their paths):**
- **HT-10 #166** writes `fidelity/harness.mjs` (+631 lines), `shard.mjs`, `ht10.mjs`, `perf.mjs`,
  `tests/howto/budgets.json`, `scripts/screenshot-gate.mjs`. LIB-2 builds after it merges and touches only
  `HT_PLATES` and `firstWithoutHowTo` in `harness.mjs`.
- **LIB-3 #180** owns `tools/plates/library/qa/**`. LIB-2 imports nothing from it. LIB-3 imports, and LIB-2 keeps
  stable:
  - from `golden.mjs`: `buildGallery`, `extractPlates`, `makeMirror`, `LIB_OF`, `FIXTURE`;
  - from `gen/plates.mjs`: `moduleText` and `viewOf` (its H7 sizes chunks with `moduleText(…, '0'.repeat(64))`);
  - from `fidelity/harness.mjs`: `interLoaded`, `openGolden`, `settle`.
  A test (L2-A19) pins `sha256(moduleText(id, plate, entry, '0'.repeat(64)))` for the 8 (count 8 asserted) so its
  signature and output stay byte-identical.
- **LIB-6 #181** owns `tools/plates/library/render/**`, `build-layers-page.mjs`, `tests/library/closeups.test.ts`.
  No overlap (its `HOWTO_IDS` is the vendored golden-B builder's, not `ids.ts`).
- **LIB-8 #109** already wrote `tools/plates/library/build-page.mjs`, `engine.mjs` and `test/build-page.test.mjs`.
  Decision D-LIB2-builder: LIB-2 takes `build-page.mjs` and `engine.mjs` **byte for byte** from LIB-8's head, adds
  the registry input, and carries the proof in its vitest file (8.2), so LIB-8 merges `main` with no conflict.

## 10. Acceptance tests (each with the mutation that must turn it red)

Every sweep asserts its count and has an empty-input case that must fail.

| Id | Test | Count asserted | Mutation that turns it red |
|---|---|---|---|
| L2-A1 | `golden.mjs --check` passes; page `e2bea90c…`, 860,766 B | — | change one byte of `pins.json` `pageSha256` |
| L2-A2 | builder rebuilds golden A from registry rows of the 8 (vitest) | 8 rows; 0 rows red | swap two rows in `plates.json` order |
| L2-A3 | body hashes of every generated file (header and `hashes:` line out) equal the committed list | 45 files listed, 50 generated; 0 red | change one character in `gen/hands.mjs` output text |
| L2-A4 | adding a synthetic batch row changes no header or `hashes:` line of the 8's files | 50 files; 0 red | make `gen/content.mjs` return the plugin-wide inputs again |
| L2-A5 | `generate --check` fails when `exercises.json` gains an id until regenerated | — | drop `exercises.json` from `gen/ids.mjs` inputs |
| L2-A6 | `hasHowTo(id) === (id in LOADERS)` and hint equality; custom ids false | 153 ids; empty list red | add a non-shipped id to the hash set |
| L2-A7 | an unknown `lib_` id with no collision is false | — | encode the complement set (the rejected hybrid design) |
| L2-A8 | collision refusal | — | force `h` to return a constant |
| L2-A9 | `ids.ts` ≤ 2,048 B and `ids.ts` + `lazy.tsx` ≤ 3,072 B on the 8 and on a synthetic 153-id build | — | inline the list literal |
| L2-A10 | `ht-index` is its own chunk, not in `HowToSheet-*.js`; its budget is measured + 10 % | — | import `LOADERS` statically |
| L2-A11 | D/T proof: a synthetic D row (`lib_leg_press` + `{ camera.maxScale: 1.2 }`, fixture envelope) derives a spec that differs from the parent in exactly that key; `derive` refuses an unknown key, an out-of-envelope value, a view change | 1 row; 3 refusals | make `derive` return the parent unchanged; accept any key |
| L2-A12 | registry refuses duplicate id, prefix clash, id not in `exercises.json`, zero rows | 8 rows | remove the duplicate check |
| L2-A13 | stage mapping: `approved` ⇔ `shipped`; only `shipped` gives a button; `c6.ts` passes unedited | 153 ids; empty red | let `hasHowTo` return true for `approved-plate` |
| L2-A14 | `verifyBatchChain`: each entry's `prev`; `base` = prefix hash of an existing GOLDEN entry; appending a synthetic entry to a copy of `GOLDEN.json` keeps every batch file green | N entries per file; 0-entry file red | edit one entry's `why`; verifier mutation: compare `base.hash` with the hash of all current GOLDEN entries (the head), then append one entry, and the test must go red |
| L2-A15 | total rule gives 564,585 gz and 2,552,519 raw for N = 8, and fails a batch over its N on either | — | round per id (`ceil(mean × 1.1) × N` gives 564,592); drop the raw rule |
| L2-A16 | `firstWithoutHowTo()` = today's value on the 8 and moves on when an id ships | — | hard-code `lib_barbell_bench_press` |
| L2-A17 | `ids.ts` and `ids-node.mjs` have byte-identical `SET` literals and agree on every id | 153 ids; empty red | edit one hash character in the Node twin |
| L2-A18 | derived `HT_PLATES` equals today's literal pairs in order | 8 pairs; 0 red | sort rows by id |
| L2-A19 | `moduleText(…, '0'.repeat(64))` sha for each of the 8 equals the committed value (LIB-3's H7 contract) | 8; 0 red | add a newline to `moduleText`'s output |
| L2-A20 | `generate --check` fails after a `tools/plates/pins.json` edit until regenerated | — | drop `pins.json` from `gen/plates.mjs` inputs |

Plus the AGENTS checks on the exact head: `npm run check`, `npm run test:tz`, the gate.

## 11. Risks

- **Hash-line churn** in all headers and the 8 `hashes:` lines at once: one reviewable core commit, proven by
  L2-A3; gz of the 8 chunks re-recorded.
- **Generated-file count** slows typecheck or vitest at 153: LIB-1 measures; fallback `.js` + `.d.ts` (supervisor
  decision), never a skipped check.
- **`coverage.ts` becomes generated:** today's hand-edit rule moves to its archetype data file; the PR says so.
- **LIB-8 builder takeover** could fork two copies: the files move byte for byte and LIB-8 merges `main` after.
- **Hash collision across future ids:** refused at generate time, so it can never ship silently.
