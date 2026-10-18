# LIB-3c design note

Card: `docs/supervisor/verify/lib-3c-card.md` (claude/sup-lib4-cards @ 95928e1). Rulings: D-LIB3b-H7, D-LIB10-RANGES, D-LIB10-CHILDPROOF, D-LIB3c-SHARED, D-LIB9-AUTHORQA. Lines are on main 2078913c plus the Do 1 commit (candidate.mjs = #245's file).

Measured on the LIB-2b fixture (node 22, this container): a page build of one id 0.46-0.52 s (each spawns a process); `rendersOf` of the fixture plate 0.44 s; a fresh `?h7=n` import plus a full render set 0.34 s, byte-equal to the first render. The child rebuilt alone, as `derive(vendored pull_up from a mirror, { 'camera.maxScale': 1 }, { 'camera.maxScale': [0.9, 1.1] })` keyed as the fixture's card id, equals the fixture's page plate on all 9 fragments, so the `[[], true]` rows of library-qa-h10.test.ts stay clean with the child proof on.

## a. PQ-H7 from a fresh import

- `h7(c, ctx, R)` becomes async. Today's second in-process render and its comparison (node.mjs:191-192) stay as they are.
- Then a third render set from a freshly imported spec, compared with R, `svg` and `overlay` of every render:
  - `approved`: `await ctx.engine.spec(specIdOf(c.chromeId))` (engine.mjs:21 re-imports with `?qa=n`).
  - H, D, T: `await c.freshSpec()`, which candidate.mjs carries: `import(<row.src file URL>?h7=<n>)`, n a module counter.
  - A difference gives `H7.determinism:<k>.<f>` with the text `a fresh import of the spec renders <k> differently in <f>`. When the in-process comparison already gave that key, the fresh one is not added again (one problem per key).
  - An engine candidate of mode H, D or T with no `freshSpec` (or an `approved` one whose engine has no `spec`): `H7.determinism:fresh-missing`. A fresh import or fresh render that throws: `H7.determinism:fresh-threw`. Neither throws, neither is skipped. R null (the render threw) skips both comparisons as today: PQ-H1 is red (`H1.engine:render-threw`).
  - M8 (a per-call counter in the wrapper's closure) is reset by a fresh import of the wrapper, so the fresh set equals R and only the in-process render catches it; that is why the in-process render stays.
- Composers: a `?h7=n` (or `?qa=n`) import re-evaluates the spec module only. A module it imports (a composer in eq/, a layers module) stays cached, so a value fixed at import time in a composer is not caught by the fresh import.
  - A fresh process closes it: each page build is its own process (build-page.mjs:69-76, :97).
  - So h7Builds is **wired**, not removed: candidate.mjs carries `rebuild()`, the row's plate built alone through buildPlatesPage (as rebuildParent does), returned as its 9 fragments in one string. `h7Builds(c, c.rebuild)` (unchanged body: two builds, `H7.determinism:build`) runs from h7 for H, D and T rows. Two processes each draw their own import-time value, so the composer case turns `H7.determinism:build` red. Cost: two page builds per library row (about 1 s).
  - An H, D or T engine candidate with no `rebuild` gives `H7.determinism:fresh-missing` too (one key for "candidate.mjs's fresh loaders are missing").
  - `approved` gets no build pair: the 8's vendored tree is hash-locked (buildPlatesPage refuses an unlocked vendor, build-page.mjs:84-85), and each of the 8 is pinned in GOLDEN.json, so a composer of the 8 cannot change without failing the lock. Its spec-level import-time case is the fresh import above (3c-A2's mirror row).
  - Shipped bytes are also rebuilt in a fresh CI process by L1 (howto-rebuild) once LIB-4c is on main (3c-A8).
- index.mjs:38: `'PQ-H7': await h7(c, env, R)`.

## b. PARAMS ranges

- `tools/plates/library/qa/param-ranges.json`:
  ```json
  { "$comment": "...", "families": {
      "<family>": { "ruling": "D-…", "params": {
          "<PARAMS key>": { "range": [min, max] | [value, ...], "basis": ["<basis of range[0]>", "<basis of range[1]>" | ...] } } } } }
  ```
  `range` is exactly the envelope row derive.mjs:14 reads. `basis` is parallel to `range`: one non-empty string per bound or per value (a batch golden plate entry or a verified card claim, D-LIB10-RANGES 3). Committed with `"families": {}` (no row is ruled).
- Family of a row: T is `row.template`; D is `D:<row.parent>`. candidate.mjs sets `derivation.family`.
- Loader `qa/param-ranges.mjs`: `loadRanges(file = qa/param-ranges.json)` reads the file on every call (no cache). A missing file is `{}` (no family). It throws on: a file that is not `{ families: {...} }`; a family whose `ruling` is not a string matching `/^D-[A-Z0-9-]+$/`; a family with no `params` object or no key; a key that is not an own PARAMS key; a `range` that rowOk (node.mjs:278-280) calls malformed; a `basis` that is not an array of non-empty strings as long as `range`; any other field.
  - rowOk becomes `export const rowOk` (the one `-` line in node.mjs's H10 block outside h10 itself); the loader imports it, so the loader and PQ-H10 cannot disagree on "malformed".
  - `familyObject(family, envelope, ranges)`: for each own PARAMS key, the family row's `range` when the family names the key, else `envelope[key]` when the envelope names it. This is D-LIB3c-SHARED's one object.
- h10 for a D or T row: `obj = familyObject(d.family, ctx.envelope, loadRanges())`, then `paramEnvelopeProblems(d.params, out, obj)` (byte-identical function). The same `obj` is passed to `d.rebuildChild(obj)`. Only h10 imports the loader, by a dynamic `import('./param-ranges.mjs')` inside the D/T branch, so the approved and H paths never load it; pin.mjs, selftest.mjs and loadPins never reach it. No spec or template imports the file (3c-A4 test).
- On the real path ctx.envelope is envelope.json, which names no PARAMS key (library-qa-h10.test.ts:125), so a key with no family row fails closed with `H10.envelope:<key>`, as today. With a test envelope that names the key and no family row, the key is checked against the test envelope (the fallback): this is what keeps library-qa-h10.test.ts unedited and green.
- The child proof runs only when validateParams and paramEnvelopeProblems found no problem. A derivation with clean params and no `rebuildChild` gives `H10.child:threw`; node.mjs:298's early return stays, so M21-M23 keep their keys (their params are not clean).
- Rows proposed: none. No family row exists until the supervisor rules one (D-LIB10-RANGES 4, 4b).

## c. The child proof

- candidate.mjs gains, beside rebuildParent, `rebuildChild(obj)` and, for T, `rebuildTemplateParent()`. Each writes one module to a fresh temp directory and builds a plates page with buildPlatesPage, through `groupsConfig` for one id with `config.specs[<card key>]` set to that module's absolute path (build-page.mjs:78-81, :95):
  - D: `import parent from <parent spec>; import { derive } from <derive.mjs>; export default derive(parent, <row.params>, <obj>);`, keyed as the row (cardIdOf(row)), so svg ids and the card id match the batch page.
  - T: `import { make } from <templates/<name>.mjs>; import { facts } from <row.src>; export default make(<row.params>, facts);`, keyed as the row.
  - T parent: `import { make, parentParams, parentFacts } from <template>; export default make(parentParams, parentFacts);`, keyed as the parent (its golden spec id for one of the 8, else cardIdOf(parent)), compared with `parentFragments`. A difference gives `H10.byte:<k>` with the text `parent rebuilt through its template: <k> differs from its pinned fragment`. rebuildParent (from its own source) stays and runs as today.
  - The parent spec: for one of the 8, `<mirror>/exercises/<specId>.mjs` of a makeMirror() kept until buildPlatesPage returns (never tools/plates/vendor in place); for a library parent, its `row.src` file in place. The temp directory and mirror are removed in `finally`.
  - Params and obj are written as JSON literals (clean params only reach it).
- h10: the child's 9 fragments are compared with `fragmentsOf(c.plate)`. A difference gives `H10.child:<fragment>` (`the plate on the batch page differs from its derivation rebuilt alone in <fragment>`); a throw (or no rebuildChild) gives `H10.child:threw`. For T with no rebuildTemplateParent, `H10:missing` (no early return).
- candidate.mjs refuses a T row whose `template` is not a string matching `/^[A-Za-z0-9_-]+$/` naming an existing `tools/plates/library/templates/<name>.mjs` (fail closed), before anything is imported.
- Test sources: the tree's test D sources derive from the vendored pull_up through a mirror, as above; test templates are written into the temp tree only.

## d. Cost

| Row | Added | Seconds (measured) |
|---|---|---|
| approved (each of the 8) | one fresh import and render set | about 0.3-0.5 |
| H | fresh render set + two page builds (h7Builds) | about 1.4 |
| D | H's + one child page build | about 1.9 |
| T | D's + one template-parent page build | about 2.4 |

Against LIB-4c's per-shard budget (#246 @ 68f15560 ci/plan.mjs:13-15: SHARD_TARGET_S 900, JOB_BUDGET_S 1800): 14 LB rows of T would add about 34 s to one shard, under 4% of 900 s. gen/plates.mjs:133-141 caches a report in-process only, so each generate run pays it once per row. Final timings go in the PR (3c-A9).

## e. Lines of the Do 1 hunk touched

- None of the hunk's own lines change (AUTHORING_REFUSED, howtoOf, the candidateOf signature, the refusal line, the source-file loop, the How-to import, the exemptions line).
- Next to it: the return object's first line (`id, chromeId, mode, spec, ...`) gains `freshSpec, rebuild`. It is two lines above the exemptions line, with the unchanged research line between. The T `template` check and the derivation's new fields sit inside the D/T block, at least three unchanged lines from any hunk line. The new imports, the module counter and the rebuild helper sit above `researchOf`, away from the hunk.
- 3c-A11's `git merge-tree` shows whether git still reports a conflict there; if it does, #245 takes main's file whole (merge_prerequisites).
