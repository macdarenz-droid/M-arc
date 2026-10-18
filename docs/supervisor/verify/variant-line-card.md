Card LIB-5v: variant line field (D-LIB5-VARIANT 4, lib4-cards.md section 14 Supervisor actions 14; drafted 2026-10-18)

id: LIB-5v
model: claude-opus-5-5 (not mechanical: a new shown field across the type, the lint, the generator, C7 and the sheet, with a fidelity probe)
mode: auto
title: 'Builder: LIB-5v variant line field'
branch: claude/lib-5v-variant-line (new). Your first push opens draft PR 'LIB-5v: variant line field'.

Owner and slot (D-LIB-LANE-ACTIVE, section 12 items 2 and 21; supervisor confirms, see Open):
- Lane: LIB. It holds one active slot from 'LIB-5v start' to READY.
- Builder: the LIB-5 session, on this new branch once LIB-5 is on main. It takes the slot LIB-5's merge frees, so no queue wait. Fallback: a fresh Opus builder, queued after LIB-8-FIX, which moves ahead when its deadline is next and parks with LIB-3b, LIB-4d and LIB-8-FIX.
- Merge slot: 7a, after pilot A #109 (7) and before LIB-9 (8). It blocks none of #181, #193 or #109.
- Deadline: on main before the first merge that ships a row whose src/data/exercises.json equipment has '/', other than VARIANT_LINE_EXEMPT's two ids. Today that merge is LIB-9 (LB1's lib_close_grip_pulldown and lib_underhand_lat_pulldown). READY before LIB-9 READY. LIB-5's sweep tripwire turns any earlier '/' ship red on main.

Stops (these override every other line):
1. Start only on one supervisor message or PR comment 'LIB-5v start' with the active-builder count. Never on a merge, a CI result or a self-wake. On 'park', stop at your next local commit and push nothing.
2. Nothing is loosened.
   - Every LIB-5 test, assertion and mutation stays: the 23-id pin, eightWithSlash, the tripwire and its mutations, D-LIB5-WORDS (a)'s eight totals, and the card half.
   - VARIANT_LINE_EXEMPT keeps exactly its two ids.
   - No limit, budget, timeout or pattern changes. tools/plates/layers/** (golden B) is not edited, and the 8 stay byte-identical.
3. If the Do 5 probe is red on any family because of the line, stop and post it on the PR. The supervisor rules the placement.
4. If any generated file on main changes (`generate --check`, or `git diff` under src/howto/** and tools/plates/library/** outside write_scope), stop and report.
5. This card ships no user-visible line. Fixture lines live under tests/** and in scratch trees only. Never write to the owner.

CI manners (D-LIB-CIMANNERS, as read in the LIB-4d card): at most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci]. Never cancel, re-run or dispatch another card's run.

base: origin/main once LIB-5 (#244) is on it. Line numbers below are on main b99a9e2, or on #244 @ 5592280 where marked. #244's lines will move, so find each anchor by its quoted text on your base. Stop if a quoted text differs. Merge origin/main with a merge commit before review and again before READY. Never rebase, amend or force-push.

depends_on: LIB-5 (lint/index.mjs, gen/library-gate.mjs and the library-lint.test.ts sweep). LIB-4b #232 and LIB-4c #246 (fixture files, both merge before LIB-5). LIB-6 #181 only inside the Do 5 scratch tree, as LIB-4b's B5 used it.

build_prerequisites: LIB-5 on main, the supervisor's rulings under Open, and 'LIB-5v start'.

merge_prerequisites: a fresh Opus review PASS against this card; every check green on a head that contains the latest main; merge slot 7a (every lower checklist item merged).

shared-file owners (each edit ruled here, add-only):
- tools/plates/library/lint/index.mjs, tools/plates/gen/library-gate.mjs and tests/howto/library-lint.test.ts: LIB-5 (merged). LIB-5's Do 9 under route (b) (claude/lib-5-back-box) may still edit library-gate.mjs and content-types.ts (RiskJoint 'back'). Those lines are disjoint from this card's; keep both sides.
- tests/howto/checks/c7.ts: HT-4 (merged; no open card owns tests/howto/checks/**). This card is its owner for one block marked LIB-5v (D-LIB5-VARIANT 4).
- src/howto/content-types.ts: HT-4 (merged). One property only.
- src/slices/howto/HowToSheet.tsx and css/sheet.css: HT-3 (merged). One line, and one rule block marked LIB-5v.
- tools/plates/library/fidelity/fixture.mjs: LIB-4b (merged). Add-only, inside transformSources. LIB-4c's ci/scratch.mjs imports transformSources and is not edited.
- docs/COACHING-DECISIONS.md: append only.

outcome: a row's How-to can carry one shown variant line, `copy.variantLine`.
- The generator refuses it outside the caption class, for every shipped row.
- It counts toward the 450 visible words in the generator, the sweep and C7. C7 and C19 scan it.
- The sheet shows it above the plate.
- On main nothing visible changes: no shipped row has '/' and a line, and the 8 never carry one.
deliverable: one PR. evidence: V1-V10. finish: merged in slot 7a, before the deadline. You will notice: nothing, until LB1 ships.

Saved data, connectivity: none. The line is static, generated app content (ht-<slug>.ts). It adds no storage key, no stored or sent user data, no network call and no dependency. No owner approval is needed under AGENTS.md.

design_reference:
- lib4-cards.md section 14: OPEN-5 (D-LIB5-VARIANT) points 1-6, ITEM-7 (D-LIB5-VARIANT8), NEW-8 (D-LIB5-WORDS) and NEW-1 (D-LIB5-GATE).
- Plan content.md 4, row 'Variant line' (claude/howto-options @ 4a9fd86, docs/howto/library/inputs/content.md:271): a caption-class line of 10 words or fewer, required when equipment contains '/'. Plan 4.4 (LIBRARY-HOWTO-ARCHITECTURE.md:466).
- Why `copy.variantLine`, not a top-level key: content.mjs writes `copy` whole (BASE_KEYS :32, baseFieldsText :107-111), and BuiltHowTo.copy is `HowToContent['copy']` (src/howto/types.ts:130). So content.mjs, the core and every generated header stay unchanged. Golden B's copyFields lists copy.* by name (copy-lint.mjs:200, :244-246), so it never sees the field. That is why this card puts the line in reach itself.
- Why above the plate: LIB-4b's twins compare each library row's app sheet with its batch layers page. Golden B's page has no line. Below the plate, the line would push the Look closer chips down against the zoom slot, which can change HT-6's 'origin from Mistake' (#232 twins/ht6.mjs; gate :6744-6759 for the 8). Above the plate, the golden block and the sections move together. The Do 5 probe tests this; it is not assumed.

read_first: AGENTS.md; .claude/skills/builder/SKILL.md; the design_reference sections. On your base:
- tools/plates/library/lint/index.mjs (whole);
- tools/plates/gen/library-gate.mjs (whole);
- tests/howto/library-lint.test.ts: the VARIANT describe (#244 @ 5592280 :128-162) and the sweep (:230-252);
- tests/howto/checks/c7.ts :115-155 and :266-310; tests/howto/checks/c19.ts :68-75;
- tools/plates/layers/artifact/copy-lint.mjs :192-252 and :276-318 (read only);
- tools/plates/gen/content.mjs :25-112 (read only); src/howto/content-types.ts :298-327; src/howto/types.ts :100-135;
- src/slices/howto/HowToSheet.tsx, PlateView.tsx :1-45 and css/text.css (the token set);
- tools/plates/library/fidelity/fixture.mjs :24-31 and :76-102; tools/plates/library/ci/scratch.mjs :19-26;
- tests/howto/budgets.json, the HowToSheet-*.js and HowToSheet-*.css entries.

write_scope:
- src/howto/content-types.ts:317: `copy` gains `readonly variantLine?: string`, with a one-line doc comment that cites D-LIB5-VARIANT.
- tools/plates/library/lint/index.mjs:
  - variantLineOf becomes `H => (H?.default ?? H)?.copy?.variantLine`. It is still the one accessor, and it takes a module namespace or loadContent's content.
  - variantLine(): an exempt id with a non-empty line is red: 'variant line on an exempt golden-B id (D-LIB5-VARIANT8)'. Everything else in it stays.
  - sheetWords(): the total adds `words(line)` when variantLineOf(M) is a non-empty string.
  - New export shownCopyFields(H) = copyFields(H), plus `{ path: 'copy.variantLine', text, kind: 'caption' }` when a line exists.
- tools/plates/gen/library-gate.mjs, outputs(): after the familyRefusal throw and before `if (row.mode === 'golden') continue;`, for every shipped row:
  - import M = sourceOf(row.id);
  - read the row's equipment from EXERCISES_JSON, which registryInputs() already lists, so inputs() is unchanged;
  - call `variantLine({ id: row.id, equipment, line: variantLineOf(content), names: sourceNamePatterns([M]) })`;
  - on any violation, throw `${row.id}: copy.variantLine: ` plus each `rule (detail)`, joined with '; '.
- tests/howto/checks/c7.ts: one block after the copy.cueLine checkLength line (:275): `scan('copy.variantLine', …)`, `checkLength('copy.variantLine', … ?? '', LIMITS.captionWords, null)` and `shown('copy.variantLine', …)`.
- src/slices/howto/VariantLine.tsx (new): `VariantLine({ howTo })` returns `<p class="ht-variant">{line}</p>`, or null when there is no line.
- src/slices/howto/HowToSheet.tsx: one line before :36 (`<PlateView …/>`): `<VariantLine howTo={howTo.built} />`, plus its import.
- src/slices/howto/css/sheet.css: one block marked LIB-5v: `.ht .ht-variant { margin: 0 0 var(--sp-2); font-size: var(--fs-small); line-height: var(--lh-small); color: var(--text-2); }`. These are existing tokens; no new token.
- tools/plates/library/fidelity/fixture.mjs, transformSources (:76-91): when the target's exercises.json equipment has '/', insert one fixture line after the clone's one `  copy: {` line (lat_pulldown.howto.mjs:326, seated_cable_row.howto.mjs:327): `    variantLine: '<second kind>.',`. That is one word ('Machine.' for B5's lib_underhand_lat_pulldown and for LIB-4c's lib_t_bar_row). Use `once()`. One word, because each pool sheet already reads 449 (D-LIB5-WORDS (a)), and 450 is the limit.
- tests/howto/library-lint.test.ts:
  - the tripwire passes each row's loadContent content to variantLineOf, not the registry row;
  - two cases are added to that test (V6);
  - the sweep's `C19.checkC19Copy(CL.copyFields(c), …)` becomes `L.shownCopyFields(c)`.
  No existing `expect` is removed or weakened.
- tests/howto/lib-5v.test.ts (new), and fixtures under tests/howto/fixtures/lib5v/ (new).
- docs/COACHING-DECISIONS.md: append D-LIB5v-FIELD (copy.variantLine and why), D-LIB5v-PLACE (above the plate, with the probe result) and D-LIB5v-EXEMPT (exempt ids carry no line).

reserved_paths: tools/plates/layers/**; tools/plates/gen/content.mjs, ids.mjs, plates.mjs; tools/plates/generate.mjs; tools/plates/lib/**; tools/plates/library/registry.mjs, research/**, howto/**, specs/**, batches/**, ci/**; every generated file (src/howto/generated/**, src/howto/ids.ts, …); src/slices/howto/PlateView.tsx and sections/**; tests/howto/budgets.json and every budget; tests/howto/checks/* except c7.ts's block; docs/research/**; scripts/**, tests/theme.test.ts, src/ui/styles.css; src/core/**; .github/**, package.json, package-lock.json; the watch agent's paths. VARIANT_LINE_EXEMPT's value.

Do:
1. On 'LIB-5v start', branch from origin/main and check every anchor above by its text.
2. Write the V-tests first (lib-5v.test.ts and the two library-lint.test.ts cases). Run them on the unchanged base and record each red line: the red-before evidence.
3. Make the write_scope edits.
4. V3's generator cases run in per-case temp copies of E1's tree, as LIB-5's generator cases do (D-LIB5-FIXTURE 6). E1's row lib_cable_lateral_raise has equipment 'Cable'. A case edits only its temp copy: a '/' case sets that row's equipment in the copy's src/data/exercises.json to 'Cable / Machine'; case (3) edits the copy's pull_up.howto.mjs. The room is taken from sheetWords(E1 module) at run time, never assumed; room + 1 must be 10 words or fewer, else stop and report.
5. Probe, as soon as the code compiles (scratch worktree from your head, with #181 merged; never pushed):
   - Run LIB-4b's B5 fixture `all`. With the fixture line, lib_underhand_lat_pulldown generates and shows 'Machine.'.
   - Run LIB-4b's runner on that id exactly as #232's B5 evidence ran it, and list each family's result.
   - Take sheet screenshots at 390 px in two themes (light and dark), with and without the line. Post them; never commit them.
   - Run LIB-4c's scratch.mjs `build` for its 6 ids; lib_t_bar_row generates with 'Machine.'.
   - Post 'LIB-5v PROBE @ <sha>' with the results.
6. Append the three decisions.
7. Run V10 on the merged head.

Acceptance (in the PR: each row's evidence, its red-before line and each mutation's red line):
| ID | Criterion | Evidence | Mutations (each red) |
|---|---|---|---|
| V1 | The type holds a string line only | lib-5v.test.ts holds `const ok: HowToContent['copy'] = { setupLine: '', mistakeLine: '', variantLine: 'x' }` and a `// @ts-expect-error` line with `variantLine: 3`. `npm run typecheck` is green | Property removed → typecheck red (excess property). Typed `unknown` → TS2578 (unused @ts-expect-error) |
| V2 | Pure rules | variantLineOf reads `copy.variantLine` from a namespace and from content, and gives undefined without one. variantLine: an exempt id with 'Machine.' → the exempt rule; an exempt id with no line → []; every LIB-5 case unchanged. shownCopyFields adds exactly one 'caption' field when there is a line, and none otherwise | Accessor back to `() => undefined` → V2, V3 case 2 and V6 red. Exempt check removed → the exempt-with-line case is green, so the test is red. Field dropped from shownCopyFields → red |
| V3 | The generator refuses a bad line on any shipped row | Four E1-tree cases, each with its exact message: (1) '/' and no line → `lib_cable_lateral_raise: copy.variantLine: variant line required: equipment names two kinds (Cable / Machine)`; (2) '/' and a clean line within the room → generates, and the row's generated ht-<slug>.ts holds the same `variantLine`; (3) lib_pull_up's How-to (one of the 8, no '/') given a line in the temp copy → `lib_pull_up: copy.variantLine: variant line on a row whose equipment names one kind (…)`; (4) an 11-word line on the '/' row → `… caption > 10 words (11 words)` | Call removed from library-gate.mjs → (1), (3) and (4) generate. The call moved after the golden skip → (3) generates |
| V4 | The line counts toward 450 | sheetWords on pull-up's namespace (449, D-LIB5-WORDS (a)): a 1-word line totals 450 with no violation; a 2-word line totals 451 with the '(sheet)' violation. In the generator, the E1 '/' case at room+1 words throws library lint `(sheet): visible words > 450 (451)` | The sheetWords addition removed → 451 is green. D-LIB5-WORDS (a)'s eight totals stay unchanged (no line) |
| V5 | C7 scans, caps and counts the line | On pull-up's loadContent content: a 'semicolon; here' line gives `C7: copy.variantLine: contains semicolon`; an 11-word line gives `C7: copy.variantLine: 11 words, at most 10`. Lines of n = 1..60 neutral words: the first n with a visible-words finding gives exactly `C7: visible words 451, at most 450`. The PR records C7's count without a line | Each of the block's three lines removed → its case red. Without `shown`, no n gives a visible finding |
| V6 | The sweep reaches the field | The tripwire reads each shipped row's content, and stays [] on main. Added cases: injected underhand content with 'Machine.' → []; injected lib_pull_up content with a line → red (one kind). checkC19Copy(L.shownCopyFields(c with 'Call 999.')) gives C19's contact finding on copy.variantLine. Every pre-existing VARIANT and sweep `expect` is kept (PR lists the count before and after) | The tripwire back to `variantLineOf(r)` → the underhand clean-line case is red. shownCopyFields without the line → the C19 case is red |
| V7 | The sheet shows the line above the plate | lib-5v.test.ts: VariantLine with a line returns a 'p' vnode with class 'ht-variant' and the raw text as children (Preact escapes `<&"` on render); with no line, null. HowToSheet.tsx's text has the `<VariantLine` line directly before `<PlateView`. The 8's sheet DOM is unchanged (the gate is green). Probe screenshots posted | The HowToSheet line removed → the text assertion is red. VariantLine returning a 'div' → red |
| V8 | Fidelity holds with a line | Probe: every LIB-4b runner family on lib_underhand_lat_pulldown, with the line, is green. Stop 3 if one is not | — |
| V9 | The fixture tools still generate | B5 `stage`, plus the generator, on a scratch tree: lib_underhand_lat_pulldown generates with 'Machine.' at 450 words. The same holds for LIB-4c's lib_t_bar_row. A lib-5v.test.ts case calls transformSources and checks the line is one word and inserted once | Insertion removed → the generator throws `lib_underhand_lat_pulldown: copy.variantLine: variant line required: …`. A two-word line → `(sheet): visible words > 450 (451)` |
| V10 | Scope and no regression | `git diff origin/main...HEAD` touches only write_scope. `generate --check` is green, and no generated file is in the diff. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` are green on the merged head. The gate's A2 HowToSheet-*.js/.css line is printed before and after, with no budget raised (if over: stop). library-scale.test.ts and lib-4a.test.ts are run and listed. CI is green. LIB-4c's affected selection gives 'all' ids for the lint edits, as expected | — |

verification: the PR body maps V1-V10 to runs on the exact head, with the base sha and the probe tree's sha. Before READY: merge origin/main, re-run V1-V7, V9 and V10 on that head, and re-run the probe if HowToSheet.tsx, sheet.css or LIB-4b's fidelity code changed on main since the last probe.

risk_and_recovery:
- Placement shifts a fidelity measure (V8 red). Stop. The supervisor rules: either place the line elsewhere, or add a layers-page patch through LIB-6's builder (LIB-6-PM's patch pattern), so the batch page shows the line too.
- Budget: the HowToSheet chunks grow by a few bytes. Their headroom on main is UNVERIFIED (budgets.json was measured at HT-9: 28,076 / 9,752 B of 30,884 / 10,728 B, JS). If over, stop; no budget is raised.
- Word budget: LB1's two '/' sheets must fit their line inside 450 words. That is authoring work for LIB-9, never a reason to raise the limit.
- A LIB-5 test assumes the generator lints only library rows, and the variant call on the 8 turns it red. Stop and report; never edit the assertion.
- LIB-5 Do 9 (route (b)) lands after this card: keep both sides in library-gate.mjs and content-types.ts.
- Copy: no real line ships here. Each LB1 line is LIB-9's, checked at its review against content.md 4 and AGENTS.md's UI-copy rule. If a line cannot pass, the supervisor asks the owner.

return: PR number and head sha; V1-V10 evidence lines, with each red-before and mutation red line; the probe sha, each runner family's result and the screenshot links; the A2 HowToSheet sizes before and after; anything stopped under Stops 3 or 4.

Collision check (open PR heads against main b99a9e2, 2026-10-18 after 14.4; `git diff --name-only <merge-base> <head>` over this card's paths, 26 open PRs):
| Head | Touches | Result |
|---|---|---|
| LIB-5 #244 @ 5592280 | lint/index.mjs, library-gate.mjs, library-lint.test.ts | a prerequisite: merged before start |
| LIB-4b #232 @ 316679e; LIB-4c #246 @ 52c853e | fidelity/fixture.mjs; ci/scratch.mjs | merged before LIB-5; this card edits transformSources only |
| #209 (do not merge, LIB-1 rehearsal) | HowToSheet.tsx | never lands |
| every other open head | none of these paths | no collision |

Open for the supervisor before 'LIB-5v start':
1. Owner and slot: the LIB-5 session or a fresh builder; merge slot 7a.
2. The exempt-id tightening (D-LIB5v-EXEMPT). It amends D-LIB5-VARIANT8 to be stricter. Without it, an exempt id carrying a line would skip every scan of a shown line.
3. Owner visibility. The batch layers page (golden B's scripts) will not show the line. Rule how the owner sees each LB1 line before approval: (a) LIB-9's approval post quotes each line, or (b) a layers-page patch (LIB-6-PM pattern).
4. The fixture-line edit in LIB-4b's fixture.mjs (needed by D-LIB5-VARIANT 3's B5 case and LIB-4c's lib_t_bar_row).
5. Optional: pre-rule the line's form ('Shown with a barbell. Dumbbells: same rules.') against the UI-copy rule now, so LIB-9 does not find out at review.

Ruled by the supervisor (session_01HtNEBU3oDR8NyHKK3uCwUi, 2026-10-18 ~05:30 UTC). These answer the Open list above. The card is `ready` and starts only on 'LIB-5v start'.
1. Owner and slot: the LIB-5 session continues on claude/lib-5v-variant-line once LIB-5 is on main, in the slot LIB-5's merge frees. Fallback: a fresh Opus builder, queued as written. Merge slot 7a. The id is LIB-5v.
2. D-LIB5v-EXEMPT is accepted. An exempt id that carries a line is red. This is stricter than D-LIB5-VARIANT8, and nothing is loosened; VARIANT_LINE_EXEMPT keeps its two ids.
3. Owner visibility: (a). LIB-9's per-exercise approval post quotes each LB1 line next to its plate, and the APK that ships them shows the line in the sheet. No layers-page patch.
4. The add-only transformSources edit in LIB-4b's fidelity/fixture.mjs is accepted, as written.
5. Line form (UI-copy rule, AGENTS.md): one label of at most 10 words, two short noun-phrase parts, the drawn equipment first, for example "Shown on a cable. Machine: same form." It never explains, never talks down and never says "simply", "just" or "note". LIB-9 writes each line under this form, and copy-lint and C7 check it.
6. The design choices are accepted: `copy.variantLine`, placement above the plate, and C19 reach in the sweep (stricter than D-LIB5-VARIANT 4's C7 alone). If the Do 5 probe goes red on placement, Stop 3 applies.
