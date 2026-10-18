Card LIB-3b: PQ-H10 checks values and the envelope on the real path (fix card for LIB-3; lib4-cards.md section 13 Q5 (f) and section 13 Fixes' medium on candidate.mjs:74 (:1394); 2026-10-18)

id: LIB-3b
model: claude-opus-5-5 (not mechanical: the key rule, a real-path test on the LIB-2b fixture, and the mutation proofs)
mode: auto
title: 'Builder: LIB-3b PQ-H10 values and envelope'
branch: claude/lib-3b-h10-values (new). Your first allowed push opens draft PR 'LIB-3b: PQ-H10 checks values and the envelope on the real path'.

base: origin/main @ b99a9e25 (train 25; LIB-2, LIB-3 #180, LIB-2b #234 and LIB-4a #233 are on main). From 72c94fc6 to b99a9e25, of the code and test files this card cites on main only tests/howto/library-core.test.ts changed (L2-A11 moved from :174-201 to :180-207), so every other line cited on 72c94fc6 holds on b99a9e25. Merge origin/main with a merge commit before review and before READY. Run `git pull --no-rebase` before each push. Never rebase, amend or force-push.

depends_on: LIB-2 (derive.mjs), LIB-3 #180 (qa/), LIB-2b #234 (candidate.mjs, tests/howto/fixtures/lib2b/fixture.mjs). All merged.

build_prerequisites:
- Lane (D-LIB-LANE-ACTIVE): this is a LIB builder card. It holds a slot. The cap is 4 active LIB builders. HANDOVER.md:835 on b99a9e25 lists LIB-4a (then in review), LIB-4b, LIB-4c and LIB-9a; LIB-4a #233 has since merged in train 25, so it holds no slot. The supervisor writes the live count in the start message. Start only when the supervisor sends 'LIB-3b start' by session message (the PR does not exist yet; later messages also come as a PR comment). Never start on any other event.
- Its place (an amendment to D-LIB-LANE-ACTIVE's freed-slot order, lib4-cards.md:1030 on 279cf08f, as HANDOVER.md:835 on b99a9e25 records it: 'LIB-5 (Do 2 on), then LIB-3b, LIB-4d, LIB-8 fixes'; the supervisor writes it into section 12 item 2 when this card is committed): the first freed slot after LIB-5 (Do 2 on), ahead of LIB-4d and the LIB-8 fixes card, or earlier any slot that would otherwise sit empty. Where the LIB-7 fixer, LIB-6-PM and LIB-9a's second drawer sit relative to it is the supervisor's to record in that same item. No D or T row can appear before it: LB1's 14 rows are ruled H (section 13 Q5), and LIB-9a's 0-D assertion (lb1-plates.test.ts:601 on e035bdf3, Q5 (d)) stays until this card is on main, although plan 6.2 (:670 on 4a9fd86) lists LB1 as D9 H5. When a park is needed, it parks first.
- If the supervisor tells you to park, stop at your next local commit, push nothing, and wait for 'LIB-3b resume'.
- CI manners (D-LIB-CIMANNERS, lib4-cards.md section 12 item 1, read as in section 14 'What the builder does next' item 4): the GATE-SPLIT train has merged, so only this applies: at most one push per 2 hours until READY unless the supervisor asks for one. Never use [skip ci].

merge_prerequisites:
- A fresh Opus review PASS against this card.
- Every check green on a head that contains the latest main.
- The owner's checklist order: the supervisor numbers this card. Lower-numbered items merge first.
- LIB-3b merges before LIB-9a #245. The supervisor adds to #245's merge_prerequisites: 'LIB-3b on main; lb1-plates.test.ts:790 and :801 (on e035bdf3) expect the keys in LIB-3b's risk_and_recovery'.
- Before it merges, the supervisor has posted on #245 the two LIB-9a rows that change (risk_and_recovery, second item).
- Order, not a prerequisite of this card (lib4-cards.md:1404): no card adds a D or T row (registry rows, batches/, rows.json) on any branch until this card is on main. The supervisor holds such cards and adds 'LIB-3b on main' to LIB-10's merge_prerequisites (plan :766 lists only LIB-9 and pilot A today). A D/T row appearing first does not block this card. LB1 has 0 D rows (section 13 Q5 (d)).

hard card: no (no design note; Do 2 sets the rule).

outcome:
Gap today (on 72c94fc6; the same on b99a9e25):
- derive.mjs PARAMS (:4-12) writes enums as `{ type: 'enum', values }` (:7, :9, :10) and numbers as `{ type: 'number' }` with no range (:5, :6, :8, :11). The range lives only in the envelope (paramProblems :22-27).
- validateParams (qa/node.mjs:262-273) reads `s.enum` (:268) and `s.min`/`s.max` (:269). So with schema PARAMS no enum value is checked and no number range applies. Only the key name and the number type bite.
- A key named after an Object.prototype member (constructor, toString, hasOwnProperty, and __proto__ from JSON.parse) passes validateParams, because `schema?.[k]` (:266) finds the inherited member. So { constructor: 1 } passes the whole node half today.
- candidate.mjs:73-74 passes `schema: PARAMS` on the real path.
- h10 (node.mjs:274-282) takes no ctx, and runQa calls `h10(c)` (index.mjs:38). So the envelope that runQa holds (index.mjs:32, envelope.json via loadPins :19) never reaches PQ-H10. LIB-2-DESIGN.md:72-74 said "when LIB-3 merges, its qa/envelope.json is passed in". That was never wired. Outside its own tests (library-core.test.ts L2-A11), nothing on main calls derive() (git grep).
- Empty params give no problem: validateParams loops over `params ?? {}` (:264), so `{}` returns [].
- LIB-3's M21-M23 use a test schema with `enum` and `min`/`max` (mutations.mjs:116), which hides this.
After this card:
- On the real path (candidateOf -> runQa), PQ-H10 refuses a bad enum value, a wrong type, a number outside the envelope, an unknown key (inherited names included), a raw-spec key, a view key and empty params. It applies derive.mjs's own paramProblems with the real PARAMS and envelope.json. A malformed envelope row fails closed. It no longer trusts the schema a candidate carries (3b-A5b).
- Every existing H10 key and message stays (H10.raw, H10.unknown, H10.value, H10.byte, H10:missing). Two new keys: H10.envelope:<key> and H10.empty.
- M23 (mutations.mjs:103, empty params) also gets H10.empty after this card. Its proof matches only the H10.byte:normalSvg prefix (proof.mjs:11), so it stays red for its own reason.
- envelope.json names no PARAMS key today. Its keys are measuredOn, traceLenMin, deviationMin, altWordsMax, F1, F3, F4, H9lineTypes, perPlate, H5, F2 and H4zoom. Its readers (git grep on main) are qa/index.mjs:19 and :32, node.mjs:95, :137, :242 and :287, browser.mjs:114-177, proof.mjs:18, :27, :37 and :47, mutations.mjs:45 (traceLenMin) and :143 (P1), pin.mjs, selftest.mjs:25 (compares the whole file), :28 and :44, and library-qa.test.ts:26-39, :170-171 and :196-198. None of them reads a PARAMS key. library-qa.test.ts:26-29 compares only the measured keys, but selftest.mjs:25 fails when the file differs in any way from a fresh measurement of the 8. So every D/T param is red with H10.envelope until a supervisor ruling gives PARAMS ranges a home (risk_and_recovery). That is the correct strict result. This card adds no row.

deliverable: one PR.

evidence: rows 3b-A1..3b-A10 below (with 3b-A1b and 3b-A5b), each with its mutation shown red and then restored. Also the before and after outputs.
Before proof (origin/main @ 72c94fc6, run outside the repo on a `git archive` copy after `npm ci`; (1) gives the same output on b99a9e25, where qa/, derive.mjs, candidate.mjs and envelope.json are unchanged):
(1) validateParams with schema PARAMS, then paramProblems with envelope.json, then the PARAMS keys that envelope.json names, from the repo root:
  node --input-type=module -e "const fs=await import('node:fs');const {validateParams}=await import('./tools/plates/library/qa/node.mjs');const {PARAMS,paramProblems}=await import('./tools/plates/library/derive.mjs');const env=JSON.parse(fs.readFileSync('tools/plates/library/qa/envelope.json','utf8'));for(const p of [{'bar.kind':'banana'},{'camera.maxScale':99},{handedness:7},{}])console.log(JSON.stringify(p),JSON.stringify(validateParams(p,PARAMS)),JSON.stringify(paramProblems(p,env)));console.log(JSON.stringify(Object.keys(PARAMS).filter(k=>k in env)))"
  output:
  {"bar.kind":"banana"} [] ["bar.kind: the envelope does not name it"]
  {"camera.maxScale":99} [] ["camera.maxScale: the envelope does not name it"]
  {"handedness":7} [] ["handedness: the envelope does not name it"]
  {} [] ["params: none given (a D/T row needs at least one)"]
  []
  validateParams (second column) gives no H10.value, and no problem at all, for all four; paramProblems (third column) refuses each; envelope.json names no PARAMS key (last line).
  Also: validateParams({ constructor: 1 }, PARAMS) gives [], and paramProblems({ constructor: 1 }, <envelope.json>) throws 'p.values.includes is not a function' (toString, hasOwnProperty and __proto__ throw "Cannot read properties of undefined (reading 'includes')").
(2) The real path: the LIB-2b fixture tree (F.fixtureTree()), with its row lib_cable_lateral_raise replaced in memory by mode 'D', parent 'lib_pull_up' and params, then candidateOf -> h10(c), and nodeHalf(runQa(c, { engine })):
  {"camera.maxScale":1} | schema===PARAMS: true | h10: [] | runQa node half ok: true | problems: []
  {"bar.kind":"banana"} | schema===PARAMS: true | h10: [] | runQa node half ok: true | problems: []
  {"camera.maxScale":99} | schema===PARAMS: true | h10: [] | runQa node half ok: true | problems: []
  {"handedness":7} | schema===PARAMS: true | h10: [] | runQa node half ok: true | problems: []
  {} | schema===PARAMS: true | h10: [] | runQa node half ok: true | problems: []
  So today a D plate with any of the four passes the whole node half.
The supervisor ran a throwaway prototype of the Do 2 rule and a test file of these rows (not a reference; build your own), on a git-archive copy of 72c94fc6, then again (round 3, with A10's [0, Infinity] case added) on b99a9e25. On the base: 24 of its 34 tests red (every value, empty, inherited-name, A5b, A6, A7 and A10 check, and rope); the controls and the A5 guards green, as Do 1 says. With the prototype: 34/34 green; the clean copy with the pinned envelope gave exactly ["PQ-H10 H10.envelope:camera.maxScale"]; with the test envelope the controls gave ok true, and banana, 99 and 7 each gave exactly one H10.value. library-qa.test.ts, library-core.test.ts and library-rows.test.ts passed unedited (56 + 39 + 32 = 127, on both bases). M21, M22 and M23 then raise exactly H10.raw:poses, H10.unknown:gripWidth and H10.empty + H10.byte:normalSvg, all still red. Every mutation m1-m15 and m3b gave the red line listed below (on 72c94fc6), and m12b did on b99a9e25. The new file took 29 s.

finish: merged on main. Until then the supervisor holds every card that adds a D or T row (merge_prerequisites, Order). On main every D/T candidate's PQ-H10 applies derive.mjs's rule against envelope.json. You will notice: nothing visible (no library row is D or T, and the 8 are unchanged).

design_reference: none (no UI). The rule is derive.mjs paramProblems (:15-30).

connectivity: none. No stored or sent user data, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md (before your first commit, and again on every start or wake); .claude/rules/shared-files.md.
- On main @ b99a9e25 (the same lines on 72c94fc6, except library-core.test.ts):
  - tools/plates/library/qa/node.mjs:15-19 (RAW_SPEC_KEYS, P) and :260-282 (PQ-H10);
  - qa/index.mjs:19, :30-39 (env, the h10 call);
  - tools/plates/library/derive.mjs (all 45 lines);
  - candidate.mjs:66-81 (spec from row.src; the derivation with schema: PARAMS);
  - qa/envelope.json; qa/pin.mjs:1-3 and :56-67 (--write rewrites the file from the measurement); qa/selftest.mjs:22-31 (the whole-file pin check); qa/mutations.mjs:98-116 (M21-M23, the test-double derivation); qa/proof.mjs:2-11 and :52-63 (how a mutation is red);
  - tests/howto/library-qa.test.ts:18-39 and :86-105; tests/howto/library-core.test.ts:180-207 (L2-A11);
  - tests/howto/library-rows.test.ts:400-421 (the real-path pattern: turl = F.url(root, p) at :17, modules imported from the fixture tree, golden.makeMirror and eng.loadEngine, candidateOf, gateNodeHalf, dropMirror in finally);
  - tests/howto/fixtures/lib2b/fixture.mjs:1-30 (header, ID :20), :49 (BATCH_ROW), :125-131 (fixtureTree, drop, url);
  - tools/plates/gen/plates.mjs:8-10 (the qa/ import cycle note) and :132-145 (gateNodeHalf calls runQa(c, { engine }), so the pinned envelope applies).
- docs/supervisor/verify/lib4-cards.md on origin/claude/sup-lib4-cards: section 12 items 1 and 2 (D-LIB-CIMANNERS, D-LIB-LANE-ACTIVE), section 13 Q5 (a)-(f), section 13 Fixes' medium on candidate.mjs:74 (:1394) and "Supervisor follow-ups" (:1404).
- docs/supervisor/verify/lib-5-card.md on the same branch: write_scope :169-171 (LIB-5's qa/ and library-qa.test.ts edits).
- Plan, docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md on claude/howto-options @ 4a9fd86: :285 (PQ-H10), :292 (3.3), :671 and :766 (LB2, LIB-10). docs/howto/library/LIB-2-DESIGN.md:67-75 on main.
- LIB-9a #245 @ e035bdf3 (read only; it moved from 6285b4fc on 2026-10-18, so find the tests by name if it moves again): tests/howto/lb1-plates.test.ts:601 and :778-803.

write_scope (exactly these):
- tools/plates/library/qa/node.mjs:
  - one import line: `import { PARAMS, paramProblems } from '../derive.mjs';` (derive.mjs imports nothing, so there is no cycle; gen/plates.mjs:8-10 explains the one cycle to avoid);
  - one new exported helper for the Do 2 rule: `export function paramEnvelopeProblems(params, flagged, envelope)`, where `flagged` is validateParams' problem list; it returns problems as `{ key, text }`;
  - h10's signature `h10(c)` -> `h10(c, ctx = {})`, and added lines only after `const out = validateParams(...)` (:278): `out.push(...paramEnvelopeProblems(d.params, out, ctx.envelope))`.
  - validateParams (:262-273) stays byte-identical. Every other h10 line stays as it is.
- tools/plates/library/qa/index.mjs: :38 `'PQ-H10': await h10(c)` -> `await h10(c, env)`. Also allowed: one added comment line in the header (:9-12) saying PQ-H10 reads ctx.envelope (added, never an edited line).
- tests/howto/library-qa-h10.test.ts (new).
- qa/ is LIB-3's merged code (#180). No open PR head edits these paths (table below). LIB-9a stays out of qa/ (section 13 Q5 (f) and "Supervisor follow-ups": "LIB-9a does not touch qa/"). LIB-5's card will edit qa/approved.mjs, qa/exemptions.json and two clone inputs of library-qa.test.ts (lib-5-card.md:169-171). None of them is in this card's write_scope, and A8 diffs against the merge base, so either merge order works.
- No candidate.mjs edit. That avoids LIB-9a #245, which edits candidate.mjs (:51-62, :74-76, :94 on e035bdf3).

Collision check (`git diff --name-only origin/main...<head>` over tools/plates/library/qa/**, derive.mjs, candidate.mjs, tests/howto/library-qa*.test.ts, tests/howto/library-core.test.ts, tests/howto/library-rows.test.ts, tests/howto/fixtures/lib2b/** and tests/howto/lb1-plates.test.ts; run 2026-10-18 ~02:25 UTC on main b99a9e25 after `git fetch origin`):
| Card | Head | Files it changes in those paths |
|---|---|---|
| LIB-4a #233 | merged in train 25 (0b2d3c18 is on main b99a9e25) | none left |
| LIB-4a scratch #237 | refs/pull/237/head @ 05a5ce58 | none |
| LIB-4b #232 | origin/claude/lib-4b-runner @ 575fa75b | none |
| LIB-4c #246 | origin/claude/lib-4c-library-ci @ 0e703495 | tests/howto/library-core.test.ts by three-dot diff only (LIB-4a's change, already on main); merge-tree shows none |
| LIB-9a #245 | refs/pull/245/head @ e035bdf3 | candidate.mjs (not in this card's scope) and its new tests/howto/lb1-plates.test.ts. That test (:778-803) calls qaNode.h10(c) and asserts exact keys: a test collision, not a file collision (merge_prerequisites, risk_and_recovery) |
| LIB-5 #244 | refs/pull/244/head @ 9628a35c | none (design note only) |
| LIB-6 #181 | refs/pull/181/head @ 9b8f76e6 | none |
| LIB-7 #193 | refs/pull/193/head @ 55e91e9f | none |
| LIB-12 #191 | refs/pull/191/head @ 0d268a71 | none |
Every other open PR head (#88, #92, #94, #109, #144, #149, #158, #188, #190, #192, #197, #209, #221, #242, #243, #249) changes none of these paths; #251 and #252 merged in train 25. #1 and #3 share no history with main (`git diff origin/main...<head>` prints 'no merge base'); `git ls-tree -r --name-only <head>` shows neither holds any of these paths.
Only #246 has two merge bases with main, and `git diff A...B` then uses one of them (git warns). `git merge-tree --write-tree origin/main <head>`, then `git diff --name-only origin/main <tree>` over the same paths, gives the same lists for every other head and none for #246.
Re-run this check on the head you send for review, and post it in the PR.

reserved_paths (read only; everything outside write_scope is reserved, in particular):
- tools/plates/library/derive.mjs and candidate.mjs;
- tools/plates/library/qa/envelope.json: no PARAMS row. No PARAMS row can live there today, approved or not: plan 3.3 :292 (the envelope is measured on the 8, nothing set by hand); selftest.mjs:23-25 fails when envelope.json differs from a fresh measurement of the 8 (LIB-4b runs it as qa-selftest/browser@*, fidelity.mjs:249-251 on f1df4a7e); pin.mjs --write (:60-64) rewrites the file from the measurement alone and drops such a row. Where approved PARAMS ranges come from (a measurement, or a separate owner-approved file that runQa merges into ctx.envelope) is a supervisor ruling that LIB-10 needs before its first D/T row. This card only fails closed and never edits selftest.mjs or pin.mjs;
- qa/mutations.mjs, proof.mjs, pin.mjs, selftest.mjs, browser.mjs, vocabulary.json, exemptions.json, approved.mjs;
- tests/howto/library-qa.test.ts, library-core.test.ts, library-rows.test.ts: unedited;
- tests/howto/fixtures/** (used as is), tests/howto/golden/**, tools/plates/library/batches/**, registry.mjs, tools/plates/gen/**;
- tests/howto/lb1-plates.test.ts (LIB-9a's; not on main);
- .github/**, package.json, package-lock.json, the AGENTS add-only files (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css), native/wear/**, src/**. No gate block. No new dependency.

Do:
1. Branch from origin/main @ b99a9e25. Write tests/howto/library-qa-h10.test.ts first (rows 3b-A1..3b-A7, 3b-A1b, 3b-A5b and 3b-A10). Run it on the unchanged base and keep the output. 3b-A1, A1b, A2, A3, A4, A5b, A6, A7 and A10 must be red there. In 3b-A5 the rope row and the three inherited-name rows are red on the base (each resolves ok true with []); the camera.maxScale '1', gripWidth, tempo, view and view.yaw rows are guards (already green).
2. The fix, in node.mjs and index.mjs only:
   - h10(c, ctx = {}). The early returns stay. `out = validateParams(d.params, d.schema)` stays as it is.
   - Then add `paramEnvelopeProblems(d.params, out, ctx.envelope)`:
     - params null, not an object, or with no keys: one problem `H10.empty`. Its text is paramProblems(params, envelope)[0], unchanged.
     - Otherwise, for each key k that validateParams did not already flag (no p in `flagged` with p.key.slice(p.key.indexOf(':') + 1) === k), pick the key with derive.mjs:19-23's own tests, in this order, on the same k and envelope:
       - k === 'view' || k.startsWith('view.') -> H10.raw:k;
       - !Object.hasOwn(PARAMS, k) -> H10.unknown:k, with the text `${k}: not a PARAMS key` (derive.mjs:21's words). Do not call paramProblems for it: an inherited name (constructor, toString, __proto__) makes validateParams :266 and paramProblems :20 read the inherited member, and paramProblems then throws at :27;
       - !envelope?.[k] -> H10.envelope:k (new);
       - a malformed row -> H10.envelope:k with the text `${k}: the envelope row ${JSON.stringify(row)} is malformed`. A number key's row must be an array of exactly two finite numbers with min <= max. An enum key's row must be a non-empty array whose items are all in PARAMS[k].values. Any other row is malformed. The helper checks this before it calls paramProblems for the value, because derive.mjs does not: for a number key, a row that is not two finite numbers passes every number ({ min, max }, [], true, [NaN, NaN], [-Infinity, Infinity]) or every number at or above its lower bound ([1], [0, Infinity]; JSON.parse reads 1e999 as Infinity), because derive.mjs:26 compares with undefined, NaN or Infinity, and for an enum key a string row matches substrings (derive.mjs:27, 'straight ez'.includes('ez'));
       - else H10.value:k.
     - Never parse paramProblems' text and never read d.schema. In the raw, envelope (not named) and value branches the text is paramProblems({ [k]: v }, envelope)[0], unchanged. If it returns no line, add no problem.
   - The H10.byte loop stays as it is and comes last. Order: validateParams' problems, then the new ones, then H10.byte.
   - index.mjs:38 passes env, so the real path uses envelope.json (or a ctx.envelope a test injects, or the pins a test injects). With no ctx or no envelope, every PARAMS key that validateParams did not flag gives H10.envelope: it fails closed.
   Why this fix (two lines):
   - PARAMS has no number range, so making validateParams read `values` alone cannot reject 99. A second copy of derive's value rule in qa/ could also drift from what derive() enforces. Applying paramProblems, with the real PARAMS and the pinned envelope, makes the gate and derive() agree by construction (the gate is stricter only on inherited names and malformed rows, where derive() throws or lets values through), and it no longer trusts the schema a candidate carries.
   - Skipping keys that validateParams already flagged keeps one problem per key, so M21, M22 and LIB-9a's A7/A4 rows keep their exact keys. Red or green does not change, because those keys are already red. It needs no candidate.mjs edit, which avoids #245.
3. Run the new file green. Run tests/howto/library-qa.test.ts, library-core.test.ts and library-rows.test.ts unedited, all green.
4. Run every mutation in the Acceptance rows: a temporary edit, the red output, then restore. List each one in the PR with its red line. Never commit a mutation.
5. Merge origin/main (merge commit). Re-run the collision check. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` on that exact head. Tick each row in the PR body. Add the HANDOFF block and the line "You will notice: nothing visible."

Acceptance (file tests/howto/library-qa-h10.test.ts, describe 'LIB-3b PQ-H10 on the real path'):
Setup, all in memory: F = tests/howto/fixtures/lib2b/fixture.mjs. In beforeAll, once: root = F.fixtureTree(); import candidate.mjs (cand), batch-golden.mjs (bg), registry.mjs (reg), derive.mjs (der: PARAMS and paramProblems in the rows below are der.PARAMS and der.paramProblems), golden.mjs, qa/engine.mjs (eng), qa/index.mjs (I) and qa/node.mjs (node) from the tree with F.url(root, p), as library-rows.test.ts:401-406 does; mirror = golden.makeMirror(); E = await eng.loadEngine(mirror); pins = I.loadPins() (the tree's qa/index.mjs); base = reg.rows(); row = F.ID's row; html = await bg.platesPage(row, base). In afterAll: eng.dropMirror(mirror), then F.drop(root). dAll(params) is base with F.ID's row replaced, not added, by { ...row, mode: 'D', parent: 'lib_pull_up', params }. c = await cand.candidateOf(F.ID, { platesHtml: html, engine: E, all: dAll(params) }). report = cand.nodeHalf(await I.runQa(c, { engine: E, ...env })), where env is {} (pinned) or { envelope: TEST_ENV }. keys(report) lists the hard-check problem keys as 'PQ-Hn key', without 'browser:not-run'. TEST_ENV = { ...pins.envelope, 'camera.maxScale': [0.9, 1.1], 'bar.kind': ['straight', 'ez'], handedness: ['both'] } exists in the test only and is never written. Never hand-build a candidate or a derivation; a change to candidateOf's output (as mutations.mjs and Q5 (a) do) is allowed where a row says so. Nothing is written to rows.json, batches/ or tests/howto/golden/. In every row, each new problem's text equals paramProblems({ [k]: v }, envelope)[0] for that row's envelope, except H10.empty (its text is paramProblems(params, envelope)[0]), the H10.unknown text for an inherited name and the malformed-row text, which the rows state.
- 3b-A1 'bar.kind banana is red with H10.value; straight is clean (test envelope)': under TEST_ENV, banana gives exactly ['PQ-H10 H10.value:bar.kind'] and straight gives [] with ok true. Under the pinned envelope, banana gives exactly ['PQ-H10 H10.envelope:bar.kind'].
- 3b-A1b 'the pinned envelope reaches PQ-H10': report = cand.nodeHalf(await I.runQa(c, { engine: E, pins: { ...pins, envelope: TEST_ENV } })), with no ctx.envelope, gives [] and ok true for { 'camera.maxScale': 1 }, and exactly ['PQ-H10 H10.value:camera.maxScale'] for 99.
- 3b-A2 'camera.maxScale 99 is red with H10.value; 1 is clean (test envelope)': exactly ['PQ-H10 H10.value:camera.maxScale'], and [] with ok true.
- 3b-A3 'handedness 7 is red with H10.value; both is clean (test envelope)': exactly ['PQ-H10 H10.value:handedness'], and [] with ok true.
- 3b-A4 'empty params are red with H10.empty': {} gives exactly ['PQ-H10 H10.empty'] under both envelopes.
- 3b-A5 'every other refusal gives one problem': under TEST_ENV, exactly one key each: 'camera.maxScale':'1' gives H10.value:camera.maxScale (validateParams' existing text); 'bar.kind':'rope' (in PARAMS values, not in the envelope list) gives H10.value:bar.kind; gripWidth:0.5 gives H10.unknown:gripWidth; tempo:[] gives H10.raw:tempo; view:'front' gives H10.raw:view; 'view.yaw':10 gives H10.unknown:view.yaw. Under both envelopes, { constructor: 1 }, { toString: 'x' } and JSON.parse('{"__proto__":1}') each give exactly ['PQ-H10 H10.unknown:<key>'] with the text '<key>: not a PARAMS key'.
- 3b-A5b 'a loosened candidate schema cannot pass': on candidateOf's output, set c.derivation.schema = { ...PARAMS, gripWidth: { type: 'number' }, 'view.yaw': { type: 'number' }, 'bar.kind': { enum: ['banana'] } } in memory. Under TEST_ENV: { gripWidth: 0.5 } gives exactly ['PQ-H10 H10.unknown:gripWidth'] with the text 'gripWidth: not a PARAMS key'; { 'view.yaw': 10 } gives exactly ['PQ-H10 H10.raw:view.yaw']; { 'bar.kind': 'banana' } gives exactly ['PQ-H10 H10.value:bar.kind'].
- 3b-A6 'the clean copy with the pinned envelope gets only H10.envelope:camera.maxScale':
  - premise: Object.keys(PARAMS).filter(k => k in pins.envelope) equals [];
  - { 'camera.maxScale': 1 } with no injected envelope gives exactly ['PQ-H10 H10.envelope:camera.maxScale'], with text 'camera.maxScale: the envelope does not name it' and ok false;
  - every other hard check passes;
  - the same params under TEST_ENV give ok true.
- 3b-A7 'h10 without an envelope fails closed': node.h10(c) with no ctx, on the clean candidate, gives exactly ['H10.envelope:camera.maxScale'].
- 3b-A10 'a malformed envelope row fails closed': under TEST_ENV with 'camera.maxScale' set to { min: 0.9, max: 1.1 }, [1], true and JSON.parse('[0, 1e999]') (that is [0, Infinity]) in turn, { 'camera.maxScale': 99 } gives exactly ['PQ-H10 H10.envelope:camera.maxScale'] each time, with the malformed-row text. With 'bar.kind' set to 'straight ez', { 'bar.kind': 'ez' } gives exactly ['PQ-H10 H10.envelope:bar.kind'].
- 3b-A8 'existing tests unedited and green': library-qa.test.ts (all, including M21, M22, M23), library-core.test.ts (L2-A11) and library-rows.test.ts all pass. On the head sent for review and on the READY head, after `git fetch origin`: `git diff --exit-code "$(git merge-base origin/main HEAD)" -- tests/howto/library-qa.test.ts tests/howto/library-core.test.ts tests/howto/library-rows.test.ts tests/howto/fixtures/lib2b tools/plates/library/qa/mutations.mjs tools/plates/library/qa/selftest.mjs tools/plates/library/qa/pin.mjs tools/plates/library/derive.mjs tools/plates/library/candidate.mjs tools/plates/library/qa/envelope.json` prints nothing. It diffs the merge base (the main sha you last merged) against the working tree. Run it on a clean tree (`git status --porcelain` prints nothing): then it shows exactly this PR's own changes, and an uncommitted mutation (m11) shows too. These are PR evidence, not a vitest row.
- 3b-A9 'no loosening' (PR evidence, same clean tree): `git diff -U0 "$(git merge-base origin/main HEAD)" -- tools/plates/library/qa/node.mjs tools/plates/library/qa/index.mjs | grep -E '^-' | grep -vE '^--- (a/|/dev/null)'` prints exactly two lines: `-export async function h10(c) {` and index.mjs's old line 38. The allowed header comment is one added line, never an edited one. validateParams :262-273 and the rest of h10 are byte-identical to the merge base.
Mutations (each red, then restored; list each in the PR):
- m1 (A1-A4, A6, A7): h10's added call removed (main's behaviour). The value rows, the empty row, A6 and A7 turn red. This is the before proof.
- m2 (A1-A3 controls): h10 passes undefined, not ctx.envelope. straight, 1 and both get H10.envelope and turn red.
- m3 (the real wiring): index.mjs:38 back to h10(c). The same control rows turn red through runQa.
- m3b (A1b): index.mjs:38 as `h10(c, ctx)` (the raw ctx, not env). A1b turns red.
- m4 (A5 rope): derive.mjs:27 without `|| !env.includes(v)` (temporary, never committed). The rope row turns red.
- m5 (A2): derive.mjs:26 range test removed (temporary). The 99 row turns red.
- m6 (A4): the H10.empty branch removed. A4 turns red.
- m7 (A6, A7): every new problem keyed H10.value (no H10.envelope). A6, A7 and A1's pinned line turn red.
- m8 (one problem per key): the skip of keys validateParams already flagged removed. The camera.maxScale '1', gripWidth, tempo, view and view.yaw rows of A5 turn red (two problems each).
- m9 (A1-A3): every key skipped. The value rows turn red.
- m10 (A9): one character changed in validateParams' `s.enum` line (main :268; :269 on the branch, below the new import line), not committed. The A9 command prints a third line.
- m11 (A8): one line added to library-qa.test.ts, not committed. The A8 command prints a diff.
- m12 (A10): the row check removed. A10 turns red (ok true).
- m12b (A10 infinite bound): the row check's Number.isFinite test removed (only typeof x === 'number' left). Only A10's [0, Infinity] case turns red (ok true).
- m13 (A5 inherited names): the Object.hasOwn guard removed. Those rows turn red: envelope.constructor, .toString and .__proto__ are inherited and truthy, so each key reaches the row check and gets H10.envelope:<key> with the malformed-row text, or runQa throws if the row check calls PARAMS[k].values.includes. Never exactly ['PQ-H10 H10.unknown:<key>'].
- m14 (A5b): the helper keys its raw and unknown branches as H10.value. A5b turns red.
- m15 (A5b): the new rule reads d.schema instead of PARAMS. A5b turns red.

verification: the PR body maps 3b-A1..A10 (with A1b and A5b) to their tests and m1-m15 (with m3b and m12b) to their red lines. On every head sent for review and on the READY head, it posts A8, A9 and the collision table, each run on that exact head.

risk_and_recovery:
- envelope.json names no PARAMS key, so every D/T param is red with H10.envelope until that ruling gives PARAMS ranges a home. That is the intended strict result. Never add a row, never let a missing row pass, never use a test envelope outside tests.
- Supervisor item: rule where approved PARAMS ranges live (a measurement pinned by pin.mjs, or a separate owner-approved file that runQa merges into ctx.envelope) before LIB-10's first D/T row. A row hand-added to envelope.json turns selftest.mjs:25 red (qa-selftest/browser@* in LIB-4b's CI), and pin.mjs --write drops it.
- LIB-9a #245 (e035bdf3), lb1-plates.test.ts:778-803, calls qaNode.h10(c) with no ctx and asserts exact keys. After this card two rows change. Clean ({ 'camera.maxScale': 1 }, :789-792): [] becomes ['H10.envelope:camera.maxScale']. One byte (:799-802): ['H10.byte:tempo'] becomes ['H10.envelope:camera.maxScale', 'H10.byte:tempo']. gripWidth (:793-795) and tempo (:796-798) stay as they are, because of the skip rule. Checked: on a git-archive copy of e035bdf3 with a prototype of Do 2, exactly those two tests go red. Section 13 Q5 (c) "the clean copy is green on PQ-H10" is then superseded; the supervisor amends it and tells LIB-9a, which changes those two expectations when it merges main.
- If #245 is on main anyway when you merge main: stop and report. Main's lb1-plates.test.ts:790 and :801 (line numbers on e035bdf3) then go red with this card, and only a change in the same PR keeps main green. The supervisor amends this card's write_scope to add exactly those two expectations; until that amendment, this card never edits lb1-plates.test.ts.
- LIB-9a's 0-D assertion (lb1-plates.test.ts:601 on e035bdf3, Q5 (d)) guards this gap. Lifting it after this card merges is a supervisor ruling, not this card's job.
- The fixture tree costs time (0.8 s to build, about 1.3 s per candidateOf plus runQa on 72c94fc6; A5 alone makes 12 runQa calls). vite.config.ts:24-29 sets no timeout, so vitest's defaults (5 s per test, 10 s per hook) apply: give the describe { timeout: 180_000 } and the beforeAll 180_000, as library-qa.test.ts does (:9, :14, :22). npm test runs the file once (its MARC_PERF=1 run includes only tests/perf/**, vite.config.ts:26-27) and test:tz twice (package.json:22), so 3 runs. If it still goes over, raise the timeout and report. Never drop a row.
- If fixture.mjs changes on main (for example LIB-5's D-LIB5-SCRATCH lines), adapt only the test's setup. Never hand-build a candidate.
- A malformed envelope row does not always throw in derive.mjs: for a number key it lets every number through ({ min, max }, true, [NaN, NaN], [-Infinity, Infinity]), or every number at or above a lone or finite lower bound ([1], or [0, Infinity], which JSON.parse gives for [0, 1e999]), and for an enum key a string row matches substrings. Do 2's row check makes the gate fail closed on it (3b-A10). paramProblems throws only on an enum key whose row is neither an array nor a string (an object, true or a number), and only when the value is in PARAMS values; otherwise derive.mjs:27 stops at the first test.
- derive.mjs itself reads PARAMS[k] and envelope?.[k] without an own-property test (:20, :22), so derive() throws a TypeError on an inherited name. That fails closed. The gate no longer reaches it (Do 2's hasOwn guard). For the supervisor: an Object.hasOwn fix in derive.mjs goes to its owner if wanted; this card never edits derive.mjs.
- Out of scope, for the supervisor: nothing calls derive(), and candidate.mjs:66 takes a D row's spec from row.src. So H10 does not prove the drawn spec equals derive(parent, params); H2-H9 still run on that spec.
- Two failed tries of one approach: stop and report.

return:
- PR number and head sha;
- the collision table re-run on that head;
- the before output of 3b-A1..A7, A1b, A5b and A10 (red on the base you branched from, b99a9e25) and the after output (green);
- the mutation list m1-m15 (with m3b and m12b), each with its red line;
- the exact new keys for LIB-9a's two rows, for the supervisor to relay;
- npm run check, npm run test:tz and gate output on the final head.
