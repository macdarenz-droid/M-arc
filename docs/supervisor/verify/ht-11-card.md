Card HT-11: byte-preserving delta encoding of the Mistake SVG, plus crop reuse (size, 2026-10-19)

id: HT-11
model: claude-opus-5-5 (format design and size trade-offs are judgement)
mode: auto
title: 'Builder: HT-11 plate delta encoding'
branch: claude/ht-11-delta (new, from main 565ea5a4). Your first push opens draft PR 'HT-11: byte-preserving delta encoding of the Mistake SVG and crop reuse'.
lane: LIB builder slot (library plan order row 11; D-LIB-LANE-ACTIVE).
why now: library plan 5.1, "HT-11 must merge before LB3" (LIB-13 depends on HT-11 and LIB-10). The 8 + LB1 + LB2 come to 34 plates in the app; the plan's limit is about 40.

Read first:
- .claude/skills/builder/SKILL.md, then AGENTS.md.
- docs/howto/build-plan/HOWTO-BUILD-PLAN.md (claude/howto-options): :190 (L2), :407 (HT-11), :440 (R9), and HT-7's card (:42, sharing is HT-11 work).
- docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md (claude/howto-options) 5.1, the whole section.
- docs/howto/library/LIB-2-DESIGN.md on main :150-156 (D-LIB2-total: HT-11 may only lower the means) and tools/plates/library/budgets/total.mjs.
- tools/plates/gen/plates.mjs, zooms.mjs, hands.mjs, feel.mjs; src/howto/generated/loaders.ts and one ht-*.ts; the app code that reads a plate's SVG strings; tests/howto/budgets.json; the generate and zoom tests that run L2 and L2-B.

Goal:
- Every base chunk (ht-*.js) ships at least 35 % fewer gzip bytes than on main 565ea5a4, measured per chunk on all 8.
- The app renders byte-identical SVG strings: each decoded fragment `===` its golden fragment (L2, L2-B unchanged), with the same sha256 against GOLDEN.json.
- Crop reuse: where a zoom, hand or feel chunk repeats bytes that its base chunk or another chunk loaded before it already ships, it references them instead, if the note proves a gain.

Stops (these override every other line):
1. Byte-preserving or nothing. L2 and L2-B compare the decoded string, not the encoded one, with `===`. No test, probe, gate block or budget is loosened, skipped or deleted; no golden fixture or GOLDEN.json entry changes.
2. Budgets only go down. tests/howto/budgets.json rows you change are set to measured + 10 % (rounded up), setBy HT-11, with the reason. The measured means in totals[0] (D-LIB2-total) are lowered to the post-HT-11 measurement; no ceiling is raised anywhere, including HowToSheet-*.js for the decoder.
3. No new dependency (package.json, package-lock.json are supervisor files), no compression library, no `eval`, `new Function` or WebAssembly. The decoder is a small pure function over strings.
4. Write scope: tools/plates/gen/**, src/howto/** (the decoder and generated modules), the app lines that read plate strings, tests/howto/**, and your own HT-11 blocks in scripts/screenshot-gate.mjs and tests/theme.test.ts (add-only; never edit another task's block). Never touch native/wear/**, src/native/wearEngine.ts, WatchLab.tsx, escobar-worker/**, .github/**, App.tsx, main.tsx, src/core/models.ts, src/core/store.ts, signing or keystore steps.
5. Never write to the owner. Never re-run CI to green without a root cause. Merge commits only (`git pull --no-rebase`, merge origin/main); never rebase, amend or force.

Do:
0. Design note, before any build commit. Post 'HT-11 NOTE READY @ <sha>' on the PR, then wait for 'HT-11 NOTE RULED'. The note holds:
   - the format: how the Mistake SVG is encoded against the Normal SVG (copy and insert ops, or the like), why it is byte-preserving, and the decoder's size in bytes;
   - a prototype measurement on all 8 base chunks: raw and gz before and after, per chunk, from a scratch build (not committed);
   - crop reuse: each place you found where a chunk repeats bytes another loaded chunk ships, the bytes per place, and whether the referenced chunk is always loaded first (a zoom opens from the sheet, so its base is loaded; say so with the code line);
   - decode cost: time to decode the largest plate in node, 100 runs, median and max;
   - the files and lines you will touch, the tests you add, and each risk with its mitigation (for example: an op that splits a multi-byte character, a stale encoded string, a gate screenshot that changes).
1. Build the ruled format in the generator and the decoder in the app. Generated modules stay produced by `generate`, never by hand.
2. Tests (fail before, pass after):
   - a round-trip test: for every plate and every encoded fragment, decode(encode(s)) === s, including a case with non-ASCII text and an empty delta;
   - a mutation: one flipped op makes L2 red;
   - a size test: each base chunk's gz is at most 65 % of its main 565ea5a4 measurement (the 8 values pinned in the test with their source);
   - L2 and L2-B pass unchanged, on the decoded strings.
3. Gate: `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` green; screenshots unchanged against main (state the probe that proves it).
4. Re-measure, set the budgets (stop 2), run `npm run check` and `npm run test:tz`. Merge origin/main (merge commit), regenerate if generated modules conflict, push once, and post 'HT-11 READY: <full sha>' with a table: chunk, raw and gz before, after, percent, new ceiling.

finish: merged on main in a merge train before LIB-13 (LB3) merges. In-flight LIB branches regenerate their modules when they merge main after it. You will notice: nothing in the app (identical drawings); the APK and each base chunk get smaller.
risks: (1) a conflict with lane branches that touch generated ht-*.ts (#109): resolved by regenerating, never by hand; (2) an op that breaks a character or an attribute: the round-trip test and L2 catch it; (3) a decoder bug that only shows on device: the gate renders the real app with decoded strings.
