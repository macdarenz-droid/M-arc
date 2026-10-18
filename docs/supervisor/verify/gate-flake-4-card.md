Card GATE-FLAKE-4: BUG-34's launch probe races its own captures (train 25 CI miss; D-GATESPLIT-FLAKES repeat; 2026-10-18)

id: GATE-FLAKE-4
model: claude-opus-5-5 (not mechanical: a timing fix in another task's block that must be shown equal or stricter)
mode: auto
title: 'Builder: GATE-FLAKE-4 BUG-34 launch probe race'
branch: claude/gate-flake-4 (new). Your first push opens draft PR 'GATE-FLAKE-4: BUG-34 launch probe is race-free'.
lane: the HT/gate lane, under its own cap. It holds no LIB lane slot (D-LIB-LANE-ACTIVE does not apply). Start when you get this card.

Stops (these override every other line in this card):
1. Nothing is loosened. Every number the Ruling keeps stays. No window is widened, no threshold lowered, no timeout raised (the block's 8000 ms waits stay), no check removed, no context, theme or rate cut. A red run is root-caused with --trace, never re-run to green. If the fix cannot be green under these rules, stop and report on the PR.
2. Edit only the lines the Ruling lists. Any other line of any block: stop and report (.claude/rules/shared-files.md).
3. Never commit scratch work: mutated gate copies, the busy-process loads, a scratch worktree.
4. Never write to the owner.

CI manners: GATE-SPLIT's train has merged, so only the limit of one push per 2 hours until READY applies, unless the supervisor asks for a push. Never use [skip ci]. Never cancel, re-run or dispatch another card's run.

base: origin/main @ b99a9e25 or newer (72c94fc6 plus train 25).
- BUG-34's block (:5234-5371) is byte-equal on 72c94fc6 and b99a9e25 (checked: same sha256 of those lines), and index.html is unchanged between them. So every line number below holds on both.
- The gate has 103 groups on b99a9e25 (102 on 72c94fc6; LIB-4a's block came in train 25). tests/gate-split.test.ts:55 pins 103.
- Merge origin/main with a merge commit before review and again before READY. `git pull --no-rebase` before each push. Never force-push, rebase or amend. If the branch moves without your push, stop and report.

depends_on: none open. Merged: BUG-34 (its block, tests/bug34.test.ts, index.html's overlay), GATE-SPLIT (the shards, gate-times.json, gate-blocks.mjs), GATE-FLAKE-3 #224 (the model: a race-free capture plus a lag repro).

build_prerequisites: none.

merge_prerequisites:
- The supervisor's AGENTS.md pointer line for this card's edits to BUG-34's block, in the scripts/screenshot-gate.mjs row, on main or in the same train (lib4-cards.md section 7 item 4; precedent af874ccd for LIB-4a). The builder never edits AGENTS.md.
- A fresh Opus review PASS against this card. The reviewer checks each edited line against the Ruling list.
- Every check green on a head that contains the latest main, with every gate shard green in both time zones (UTC and Pacific/Auckland). Under today's gate-times.json, BUG-34 runs in UTC job 2/4 and Pacific/Auckland job 4/4.
- No collision. At 03:00 UTC on 2026-10-18 no origin branch (305 checked) changes BUG-34's block text against its merge base, and none changes index.html. Merge order: none forced. Checklist order still applies.

shared-file owners:
- scripts/screenshot-gate.mjs: shared, add-only (AGENTS.md). BUG-34's block is BUG-34's (merged). Only the Ruling's lines change. No block is added, so `node scripts/gate-blocks.mjs --count` stays 103 and tests/gate-split.test.ts is untouched. The guard line :5240 `if (gate.runs('BUG-34'))` stays.
- scripts/gate-times.json: GATE-SPLIT's. The supervisor refreshes it after merges (scripts/gate-times.mjs). Only the "BUG-34" value, and only under Do 6.
- docs/COACHING-DECISIONS.md: append only.
- AGENTS.md: the supervisor's. Not edited.

hard card: no design note. The fix was prototyped and run while this card was written (Cause, Repro and Appendix A, below). Build it as written, plus the additions in Do 3. Where the code and this text differ, the Acceptance rows decide.

Ruling D-GF4-R (supervisor, 2026-10-18; plan risks 16 and 22; lib4-cards.md section 7 item 4; D-GATEFLAKE-0; precedent GATE-FLAKE-3 #224, D-GF3-1):
D-GATEFLAKE-0 allowed only wait and sampling edits in merged blocks, with the assertions byte-identical. Here the A2 assertions must read frames recorded in the page instead of round-trip samples, so their text changes. That is allowed only for the lines below, and only because Acceptance S4 and S5 show each change equal or stricter. Line numbers are on main b99a9e25 (= 72c94fc6):
- E1 :5237-5239, the block's comment: wording only. "holds the bundle back 1500 ms" becomes "holds the bundle until the context closes". Add that A2 reads frames recorded in the page.
- E2 :5261 and :5285: strayInk takes and passes a `word` argument (with its comment lines above :5261).
- E3 one line inserted after :5271: a pixel inside `word` is skipped, before `ink++`.
- E4 :5296: sample() also returns `word`, with the lines that compute it inserted above. `word` is the word's box in CSS px, 12 px wider on each side, once the word's own `launch-reveal` animation has currentTime >= 1050 ms (its delay). Otherwise it is null.
- E5 :5300: the route holds the bundle until the context closes (a handler that never continues), instead of 1500 ms from the request.
- E6 :5310-5317: the init script's tick records every frame from the first one that has the line and dot: the rAF time, the offset, the dot's centre in mark units, and booted. The paint observer also keeps first-contentful-paint (FCP). `anim` (firstAnimated) is kept as it is.
- E7 :5334-5336: wait for a recorded frame at least 700 ms after FCP (or the line gone). Read the frames once and stop the recorder. Pick f0 (the last frame at or before FCP, or the first recorded frame when none is that early: a later f0 only makes the f0-fA checks harder), fA (the first at or after FCP + 100 ms) and fB (the first at or after FCP + 700 ms). A missing FCP or an empty recording is its own error (`no first-contentful-paint entry or no recorded frame`, as in Appendix A). The "gone" error also fires when fA or fB is missing.
- E8 :5338: the booted check reads fB in place of s3.
- E9 :5346: strayInk gets s.word. One guard line is added after it: when s.word is set, its top edge in mark units must be 54.6 or more (the path's lowest point, y 50, plus the dot's radius 3.1, plus 1.5). Otherwise it is an error naming the context. So the skip only covers pixels more than 4.6 units below every point of the path, where only the word paints. It never covers the line, the dot, or anything ahead of them on the path (the SMIL build's cap at 56,40 and dot at 0,0). The skip hides any ink in the box, not only the word's. It applies only to a sample read once the word is due. On main such a capture was red from the word itself (race 2), with one narrow exception: a capture taken just before 1050 ms whose state was read just after it, where main still counted the box. That case is the only one where A1 counts less than main, and it goes in D-GF4-3. The guard runs in Node, where DOMPoint does not exist, so it inverts s.ctm with plain arithmetic.
  - The guard runs only when a sample has the word due. A plain run never reaches it: s1 and s2 land far before 1050 ms (checked: no context of a plain run had the word due). S2's `--lag 1200 --lag-on all` row reaches it in every context.
  - Measured on `--lag 1200 --lag-on all` (checked against this card): 55.11 at +100 ms (the reveal has finished), 55.46-55.80 at first paint, in every theme at 1x and 4x.
  - The value depends on the word's font (its ascent). This sandbox has Inter as a system font. CI's runner has no Inter: its log installs Liberation, FreeSans, IPAGothic, Unifont, WenQuanYi Zen Hei and Loma, and Noto Color Emoji is already present. So the overlay word falls back to one of those there. Measured here with the word forced to each font: DejaVu Sans 55.80, Liberation Sans 56.14, FreeSans 57.86, IPAGothic 56.83, Unifont 56.49, WenQuanYi Zen Hei Mono 55.45, Loma 53.39 (below 54.6). Which font CI actually uses is unmeasured. E11 logs the value, so S8 shows it.
- E10 :5351-5353: A2 reads f0, fA and fB. The drop and dot checks compare f0 with fA. The 10-unit rule compares fB with every recorded frame up to FCP + 300 ms. One dot line is added after the 10-unit rule: the dot at fB must be more than 0.1 units from the dot in every recorded frame up to FCP + 300 ms. Its error names that frame's time.
  - Why the dot line: main read s1 43-100 ms after FCP on a quiet machine, so main's dot check also caught a glide that stops in those first frames. f0 is the frame at FCP, so f0 against fA alone does not catch it. Seed dot-freeze-40 (checked against this card): main red 3 of 3 at 1x and 4x, Appendix A green 3 of 3, Appendix A plus this line red 3 of 3.
  - Margin by design: up to FCP + 345 ms the dot is at most 39.0 units along the path. At fB it is at the glide's end, 56.1 units along on the same leg. So it is at least 17 units away, against the 0.1 threshold.
- E11 :5370: the log line says "held until the context closes". It adds the smallest A2 margin over the 10 contexts, and the smallest E9 top edge (or "none" when no sample had the word due). Margin = the smallest x.off - fB.off - 10 over the frames up to FCP + 300 ms.
Every other line of :5234-5371 stays byte-identical. These numbers stay: 100 ms (the :5332 wait, and fA), 700 ms, 10 units, 0.1 units of dot movement, 0.6 units off the path, 50 ink pixels, 24/255, 3.1 + 1.5 units, `< 100`, the 8000 ms waits, and A3's offset 0, dot at (30, 50) within 0.3, and 0 animations. The 1500 ms goes: holding the bundle until close is the same condition, held longer. 300 ms (the window of the 10-unit rule and of E10's dot line) and 54.6 are new, and each only makes a check stricter.

outcome: BUG-34's probe can no longer turn red from capture or round-trip delay. It still catches every seeded defect main catches, including a dot glide that stops in its first frames (dot-freeze-40, which Appendix A alone misses). On a quiet machine it also catches, every time, one that main catches only some of the time (creep: main was green in 1 of 3 runs while this card was written, and again 1 of 3 when it was checked).
deliverable: one PR.
evidence: S1-S8.
finish: merged, with BUG-34 green in every gate shard of both time zones on the PR's READY head and on the train head. You will notice: nothing in the app. Only the gate changes.

design_reference:
- This card's Cause, Repro and Appendix A.
- COACHING-DECISIONS on main: D-BUG34-1 to D-BUG34-4 (the overlay's curves and the probe); D-GF3-1 and D-GF3-2 (the model); D-GATESPLIT-FLAKES (the earlier local miss, sent to GATE-FLAKE-1 #179, now closed, so this card takes it).
- docs/supervisor/HANDOVER.md D-GATEFLAKE-0 (:299) and the gotcha at :925 (a 4x miss that shows in CI becomes a GATE-FLAKE card, root-caused, never re-run to green).
- index.html :29-44 (the launch keyframes) and :207-213 (__marcLaunchT0); tests/bug34.test.ts (it pins the curves the margins rest on).
- docs/qa/GATE-SPLIT-DESIGN.md 3.4 and E10 (solo runs); scripts/gate-split.mjs planFor (:20-28).

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On main b99a9e25: scripts/screenshot-gate.mjs :5234-5371 (BUG-34) and :5375 (the next guard); index.html :29-44 and :205-216; tests/bug34.test.ts; tests/gate/gf3-c11-race.mjs (the probe shape: header, ROOT, server, exit code); scripts/c11-anims.mjs; scripts/gate-blocks.mjs (--list, --count, --check); scripts/gate-split.mjs :20-30; scripts/gate-times.json :32 ("BUG-34": 8.7); docs/COACHING-DECISIONS.md, section "GATE-FLAKE-3".
- The CI miss: train 25 head bdd309be, job "gate-shard (4/4, Pacific/Auckland)". Use the ci-log skill for its lines.

write_scope:
- scripts/screenshot-gate.mjs: the Ruling's lines E1-E11 only.
- tests/gate/gf4-bug34-race.mjs (new): the repro and proof probe.
- scripts/gate-times.json: the "BUG-34" value, only under Do 6.
- docs/COACHING-DECISIONS.md: append the section "GATE-FLAKE-4" (D-GF4-1, D-GF4-2, D-GF4-3).
No helper file is needed. The probe runs the block's own bytes, so no code has to be shared between them.

reserved_paths:
- Every other line of scripts/screenshot-gate.mjs, every other block included.
- index.html (this is not an app defect), src/**, tests/bug34.test.ts.
- tests/gate-split.test.ts, scripts/gate-blocks.mjs, gate-split.mjs, ci-verdict.mjs, gate-times.mjs, error-list.mjs, c11-anims.mjs, tests/gate/gf3-c11-race.mjs.
- tests/theme.test.ts, src/ui/styles.css, .github/**, package.json, package-lock.json, AGENTS.md.

Do:
1. Branch from origin/main. Run `npm ci` and `npm run build`.
2. The probe first (the test that fails before). Commit tests/gate/gf4-bug34-race.mjs with the block unchanged, then run S1 on that commit. The probe:
   - Has a header comment like gf3-c11-race.mjs: what it proves, that it needs `npm run build`, and its usage.
   - Runs BUG-34's block bytes unchanged. It slices from `if (gate.runs('BUG-34'))` to the next `if (gate.runs(`, and runs the slice as an AsyncFunction with the parameters browser, gate, errors, themes, PORT and console. gate.runs returns true only for 'BUG-34'.
   - Source: the working tree's scripts/screenshot-gate.mjs. `--gate <file>` runs another copy (the mutations). `--old` runs `git show 72c94fc6:scripts/screenshot-gate.mjs`; that slice must have sha256 d46e95eb519b2a6e778d9c795ddd16fa9afbcfefca71a9d3353d9b9ba7e2fab5, or the probe exits 2 and prints the hash it got. b99a9e25 gives the same slice.
   - Serves www/ with `vite preview --port 4181 --strictPort`, and launches Chromium from MARC_CHROMIUM, as gf3-c11-race.mjs does.
   - Wraps only what the block calls: browser.newContext (adds the seed and --t0-lag init scripts), ctx.newCDPSession (adds --lag after a Page.captureScreenshot reply), and ctx.newPage and ctx.close (for --trace).
   - Options: `--lag ms`; `--lag-on 1|2|all` (a context's first capture, its second, or both); `--t0-lag ms` (the main thread is busy for that long once #launch, the overlay's div, is parsed, before any of its SVG and before the overlay script: a slow parse); `--seed name`; `--theme t` (default: all 5); `--runs n`; `--expect green|red` (default green); `--trace` (per context: the samples, FCP, the frame count, the largest frame gap, and the A2 margin: for --old s2.off - s3.off - 10, for the new block E11's margin).
   - Exits 0 only when exactly n runs ran and each matched --expect. A run is red when the block pushed any error. It prints each run's errors.
   - The --t0-lag init script: `new MutationObserver((ms, mo) => { if (document.getElementById('launch')) { mo.disconnect(); const e = performance.now() + ${T0_LAG}; while (performance.now() < e); } }).observe(document, { childList: true, subtree: true });`
     Why #launch and not #launch-dot (the prototype's trigger): with the stall on #launch-dot, 1 of 17 runs of the fixed block was red while this card was checked. In that run (ember 4x), the line's and the dot's clocks had started about 1066 ms before __marcLaunchT0, in a frame painted before the stall: at FCP + 14 ms the line was at 4.65 and the dot at its end. The dot check, the 10-unit rule and E10's dot line were red, and main's reads would fail the same page too (its s2 and s3 both read 0 there). That is a page that skipped its animation behind a stall, not the race this card fixes, and no paint anchor can tell it from a real skip. A stall before any overlay element exists still gives race 3 (main red 2 of 2, `the app booted before the samples`) and the earlier empty first-paint that M6 needs. The fixed block was 10 of 10 green with it.
   - SEEDS. Each is an init script added before the page's own scripts. Use these definitions as they are:
     const onSel = (sel, f) => `new MutationObserver((ms, mo) => { const p = document.querySelector('${sel}'); if (p) { mo.disconnect(); (${f})(p); } }).observe(document, { childList: true, subtree: true });`;
     const onPath = f => onSel('#launch-path', f);
     const keyframes = k => `p => { const s = document.createElement('style'); s.textContent = '@keyframes bug34x { ${k} }'; document.head.append(s); p.style.animationName = 'bug34x'; }`;
     const SEEDS = {
       // the line never animates (paused before its first frame)
       'never': onPath(`p => { p.style.animationPlayState = 'paused'; }`),
       // the line runs at a fifth of its speed
       'slow-5x': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-draw'); if (a) a.playbackRate = 0.2; else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
       // the line stalls for 500 ms once its own time reaches 250 ms, then runs on
       'stall-500': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-draw'); if (a && a.currentTime >= 250) { a.pause(); setTimeout(() => a.play(), 500); } else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
       // the line stops 150 ms after the overlay script ran
       'freeze-150': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-draw'); if (a && performance.now() - window.__marcLaunchT0 >= 150) a.pause(); else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
       // the line drops 30 units in its first 195 ms, then stops
       'early-freeze': onPath(keyframes('0% { stroke-dashoffset: 100 } 16% { stroke-dashoffset: 70 } 100% { stroke-dashoffset: 70 }')),
       // the line waits 600 ms before it starts
       'late-600': onPath(`p => { p.style.animationDelay = '600ms'; }`),
       // the dot loses its motion path, so it sits at the mark's (0, 0) (the SMIL frozen frame)
       'dot-origin': onSel('#launch-dot', `d => { d.style.offsetPath = 'none'; }`),
       // the word shows from the first frame instead of after 1050 ms
       'word-early': onSel('#launch .launch-word', `w => { w.style.animationDelay = '0ms'; }`),
       // the line drops 40 units by 244 ms, then creeps: 9 units over the next 476 ms
       'creep': onPath(keyframes('0% { stroke-dashoffset: 100 } 20% { stroke-dashoffset: 60 } 59.0164% { stroke-dashoffset: 51 } 100% { stroke-dashoffset: 0 }')),
       // the dot stops once its own time reaches 40 ms (a glide that freezes in its first frames)
       'dot-freeze-40': `(() => { const f = () => { const a = document.getAnimations().find(x => x.animationName === 'launch-glide'); if (a && a.currentTime >= 40) a.pause(); else requestAnimationFrame(f); }; requestAnimationFrame(f); })()`,
     };
3. Apply Appendix A to BUG-34's block (`git apply -p1`; it applies cleanly to b99a9e25). Then make these changes, which the prototype lacks:
   a. E4: find the word's animation by name (`a.animationName === 'launch-reveal'`), not with `getAnimations()[0]`.
   b. E9: the guard line, in plain arithmetic on s.ctm.
   c. E1 and E11: the comment and log wording, the margin and the E9 top edge in the log.
   d. E10: the dot line after the 10-unit rule.
   e. Check that `git diff origin/main -- scripts/screenshot-gate.mjs` shows only E1-E11.
4. Run S2-S6 and `node scripts/gate-blocks.mjs --check`.
5. Run the mutations M1-M6 on scratch copies with --gate. Never commit them.
6. gate-times.json. Time BUG-34 alone, before (main) and after (your head): 3 runs each, with TZ=UTC and with TZ=Pacific/Auckland, using `MARC_GATE_JOB=45/103` (BUG-34's solo job under planFor on b99a9e25; work it out again with planFor if main moves). Take the seconds from screenshots/gate-proof-*.json, meta.seconds.
   - If the larger after median is within 10% of the larger before median, leave gate-times.json alone.
   - Otherwise set "BUG-34" to the larger after median x 0.93 (D-GATESPLIT-LIB2's local-to-CI ratio).
   - Record both medians in D-GF4-2 either way.
7. Read only, no edit: the gate's other 4x-throttled reads (main b99a9e25 :8167, :8498, :8624, :8641, :8944). For each, write one line: does it compare values read in separate round trips (captures, evaluates or fixed waits) with no bound on the time between them? This is D-GF4-3's list for the supervisor, as D-GF3-3 was.
8. Append to COACHING-DECISIONS.md a section "## GATE-FLAKE-4: BUG-34's launch probe races its captures (2026-10-18)":
   - D-GF4-1 Decided (cause and fix): the Cause below in short, then E1-E11, and why each is equal or stricter.
   - D-GF4-2 Reproduction and proof: the probe's commands and counts (S1-S5), the seed table, the two margin medians and the gate-times result.
   - D-GF4-3 Not fixed here: Do 7's list, the A1 residual (risk_and_recovery), and E9's narrow word-skip case (a capture just before 1050 ms read just after it).
9. Merge origin/main. Run S6 and S7 on that exact head. Push, and mark READY with the S-row map.

Acceptance (each with mutations that must turn red; list them in the PR):
- S1 Main's read is red under capture delay (the fail-before test). On the commit with the block unchanged:
  - `--old --lag 200 --lag-on 2 --runs 20 --expect red` exits 0 (20 of 20 red);
  - `--old --lag 350 --lag-on 2 --trace` shows the CI shape: errors like `silent-black 4x: at 745 ms strokeDashoffset is 45.4163, want at least 10 below 46.6808`, with s2 traced near 600 ms;
  - `--old --t0-lag 1000 --runs 3 --expect red` exits 0 (`the app booted before the samples`).
  The same three commands on the head (without --old, and with --expect green) exit 0.
- S2 The new block is green under delay, all 5 themes at 1x and 4x. Each exits 0: plain `--runs 20`; `--lag 800 --lag-on 2 --runs 20`; `--lag 800 --lag-on 1 --runs 20`; `--lag 1200 --lag-on all --runs 5`; `--t0-lag 1000 --runs 5`.
- S3 Real load. 8 busy processes (`node -e 'for(;;){}'`, scratch only, stopped after the run). The new block `--runs 10` exits 0. Under the same load, record main's (--old) red count; while this card was written, main was red in 3 of 4 all-theme runs. Record the machine's core count (this card's runs: 4 cores).
- S4 Seeded defects stay red. For each seed below, `--theme silent-black --runs 3 --expect red` exits 0 on the new block with no lag, with `--lag 800 --lag-on 2` and with `--lag 350 --lag-on 1`, and on --old with no lag:
  - never (the line never animates), slow-5x (it runs at a fifth of its speed), stall-500 (it stalls for 500 ms once its own time reaches 250 ms);
  - freeze-150, early-freeze, late-600, dot-origin and word-early.
  - creep: red on the new block at all three lag settings (3 of 3 each). On --old, record the result only: it is marginal there (green 1 of 3 while this card was written, and 1 of 3 when it was checked).
  - dot-freeze-40 (the dot stops at its own 40 ms): red on the new block at all three lag settings and on --old. Checked against this card: E10's dot line in place, red 3 of 3 with no lag and 2 of 2 at each lag; --old red 3 of 3; Appendix A alone green 3 of 3 (M7).
  Measured while writing this card (1 run each, Silent Black, 1x and 4x): every seed red as stated, on main and on the prototype. A seed at a third of the speed is green on both: it still drops 17-19 units by design, so it is not a defect this rule targets and is not in the list.
- S5 Nothing loosened:
  - `git diff origin/main -- scripts/screenshot-gate.mjs` holds only E1-E11. The PR lists each hunk against its E number.
  - Every number the Ruling keeps is unchanged. The PR lists each one with its old and new line.
  - The 10-unit rule leaves no more slack than main. Take the 20 plain runs of S2 and 20 plain `--old --trace` runs on the same machine (their exit code is not part of this row). For each run take its smallest margin over its 10 contexts (main: s2.off - s3.off - 10; the new block: E11's margin). The median of the new block's 20 values must be at most the median of main's 20. By the designed curve, the new block's margin is at least 10.5 when the line starts within one frame of FCP (at least 4.8 if it starts up to 150 ms earlier); main's is 14-26 on a quiet machine. 3 plain runs each when this card was checked: main 15.19, 16.75, 19.49; Appendix A plus E10's dot line 10.62 in all 3.
  - E9's guard holds in all 10 contexts of S2's `--lag 1200 --lag-on all` runs; a plain run never has the word due, so it cannot show this. The PR gives the smallest top edge at first paint and at +100 ms (checked: 55.46 and 55.11).
  Mutations (each on a scratch copy run with --gate; each turns the named row red):
  - M1 the 10-unit rule's +300 window cut to +100: creep passes, so S4's creep row is red (checked while writing this card: 2 of 2 green on the mutant);
  - M2 the word skip without its currentTime >= 1050 condition: word-early passes, so S4's word-early row is red (checked: 2 of 2 green on the mutant);
  - M3 the word box widened from 12 to 14 px: E9's guard is red on `--lag 1200 --lag-on all --runs 1` (checked: 54.42 at +100 ms in every context). A plain run cannot show this: no sample has the word due, so the guard never runs;
  - M4 the route pattern no longer matches the bundle (`/\/assets\/index-[^/]*\.jsx$/`): a plain run is red with `the app booted before the samples`;
  - M5 the 10-unit rule compared with fA only: S5's margin row is red (the median rises above main's);
  - M6 f0, fA and fB timed from first-paint instead of FCP (the recorder read and the E7 wait): `--t0-lag 1000 --runs 6` exits 1, with errors that name a frame about 1000 ms before __marcLaunchT0 (not a crash). First-paint is an earlier, empty frame only in some contexts, so one run can be green: checked with the #launch stall, 4 of 6 runs red, each in one or two 4x contexts (first-paint 1004-1090 ms before FCP). With the #launch-dot stall, 2 of 2. The head is green on the same command (S2);
  - M7 E10's dot line removed (Appendix A as given): dot-freeze-40 passes, so S4's dot-freeze-40 row is red (checked: 3 of 3 green on the mutant).
- S6 `npm run check` and `npm run test:tz` are green. tests/bug34.test.ts is unchanged and green. `node scripts/gate-blocks.mjs --check` passes, and `--count` is 103 (or main's count after a merge).
- S7 The full gate is green in both time zones on the final merged head: `TZ=UTC MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, and the same with `TZ=Pacific/Auckland`. The PR quotes BUG-34's log line from each.
- S8 CI: the READY head's run is green in every gate shard of both time zones. The PR quotes BUG-34's log line, with its margin, from the UTC and Pacific/Auckland shards. A red shard is root-caused, never re-run to green.

verification: the PR body maps each S row to its command, exit code and run count, on the exact head sha. Before READY, merge origin/main and re-run, on that head: S1's head side, S2's plain and `--lag 800 --lag-on 2` rows, S6 and S7.

risk_and_recovery:
- A seed this card says is red passes the new block: the fix misses a defect. Fix it inside E1-E11. If that is not possible, stop and report. Never change a seed to make it red.
- The new block is red on a plain, lag or load run: trace it (--trace: frame gaps, FCP, margin). Never re-run to green. Never widen a window or lower a number. Report what the trace shows.
- E9's guard fails in some context: stop and report. Never move the 12 px margin or the 54.6. In CI the word renders in a fallback font (no Inter on the runner). Every fallback measured here clears 54.6 except Loma (53.39), so a CI red on the guard names the font question for the supervisor.
- S5's margin row fails: the new rule is looser than main somewhere. Stop and report both distributions.
- The recorder reads style and layout once per frame. Under 4x that can drop frames, but never moves them. Load can only make fA and fB later and the early frames fewer, which can only widen the 10-unit gap and the dot line's gap. Report S2's largest 4x frame gap.
- main changes BUG-34's block, index.html's overlay or tests/bug34.test.ts: merge it, re-run S1-S5, and check the design margins again (a new curve changes them).
- A1's stray check still reads its state after the capture, as on main. A late read can only widen `reach`. It cannot hide the dot at (0, 0): dot-origin stays red at every lag. This is unchanged here and goes in D-GF4-3.
- Another block is red on your head: not yours. Post the job and its error line on the PR for the supervisor (a new GATE-FLAKE card if it is a timing probe). Never edit that block.
- Two failed tries of one approach: stop and report.
- CI load: pushes follow CI manners. A supervisor request is the only extra push.

return: PR number and head sha; one line per S row (command, exit code, run count); the S4 seed table; both S5 margin medians; the mutation red lines; BUG-34's solo seconds before and after in both time zones, and whether gate-times.json changed; the D-GF4-3 list; the CI run id and BUG-34's two log lines.

Cause (investigated 2026-10-18 on main 72c94fc6's build, Chromium 141.0.7390.37, 4 cores)
- The CI miss: train 25 head bdd309be (main 72c94fc plus CI-only and docs changes), job "gate-shard (4/4, Pacific/Auckland)". Its only error: `launch first frame (BUG-34) silent-black 4x: at 740 ms strokeDashoffset is 45.8355, want at least 10 below 46.6814` (:5353). Its summary line: silent-black 4x {"firstPaint":84,"firstAnimated":91}.
- s1 is read after the first CDP capture. s2 is read after a wait to s1.t + 100 ms, a second CDP capture and two frames. s3 is read at 700 ms or later. :5353 needs s3.off < s2.off - 10, but nothing bounds how late s2 is.
- On a quiet machine s2 lands at about 240-320 ms. The line moves 24-36 units between s2 and s3, so the check passes.
- The curve is flat around its 720 ms keyframe (index.html :37 and :42: both easings have zero slope there). Between 617 and 733 ms the line moves only 0.846 units. With s3 at 700-760 ms, s2 must land before about 406-418 ms of animation time. That leaves about 150 ms for capture and round-trip delay.
- On the designed curve, CI's s3 (45.8355) is the value at 733.4 ms. So the line started 7 ms after the overlay script (firstAnimated 91, firstPaint 84) and ran on time. CI's s2 (46.6814) is the value at 616.7 ms. So s2 was taken about 360 ms late.
- The times are the page's performance.now(). CPU throttling slows the code, not the clock. At 4x the two captures and frame waits are slower, which pushes s2 later.
- D-GATESPLIT-FLAKES's local miss (45.42 against 55.04) is the same mechanism, with s2 at about 417 ms.
- Not an app defect. Under 8 busy processes, every recorded frame matched the designed curve at the animation's own currentTime within 0.084 units. currentTime equalled frame time minus start within 1 ms, so the line never stalled. The line started with the first paint (8-45 ms before FCP). CSS animations follow the clock: a slow phone drops frames, but each frame shows the right place.
- Three more races in the block, from the same root:
  1. "the dot did not move within 100 ms" when the first capture is 620 ms or more late (the dot's 720 ms glide has ended).
  2. Stray ink at "+100 ms" when the second capture lands after 1050 ms: the word "M/ARC" counts as stray. Seen: `midnight 4x +100 ms (2081 ms): 1540 painted pixels ... first at (24.0, 62.2)`.
  3. The 1500 ms hold is timed from the request (:5300), but the samples from the overlay script. Under load the request came up to 496 ms earlier. With a 1 s parse delay main fails `the app booted before the samples (881 ms), so the bundle delay did not hold`.

Repro (the prototype probe; Do 2 commits its final form)
- Extra delay on the second capture, and main's red contexts out of 10: 0 ms: 0; 100 ms: 1; 150 ms: 6; 200 ms: 10.
- `--lag 350 --lag-on 2`: all 10 contexts red, for example `emerald 4x: at 762 ms strokeDashoffset is 45.8355, want at least 10 below 46.4477` (CI's s3 value exactly).
- 8 busy processes, no injected delay: main red in 1 of 6 and in 6 of 10 Silent Black runs, and in 3 of 4 all-theme runs (`ember 4x: at 758 ms strokeDashoffset is 45.8373, want at least 10 below 53.7879`). The prototype was green in 8 of 8 and 4 of 4.
- The prototype is green at 100, 150, 200, 350 and 800 ms on the second capture, 350 and 800 ms on the first, 1200 ms on both, a 1 s parse delay, and 3 plain runs. Main is red at each of those delays.
- The prototype's block passes `node scripts/gate-blocks.mjs --check` with 0 problems (102 groups on 72c94fc6).

Appendix A: the prototype (BUG-34's block only; line numbers are main's; `git apply -p1` applies it cleanly to b99a9e25)
--- a/scripts/screenshot-gate.mjs
+++ b/scripts/screenshot-gate.mjs
@@ -5258,7 +5258,9 @@
   // into the mark's units: how many there are, and how many lie farther than the dot's radius plus
   // 1.5 units (edges, the settle scale) from the part of the path travelled so far, 0 to `reach`
   // (+1.5). Distance to that part, not to the nearest leg: near a corner the next leg can be closer.
-  const strayInk = (b64, bg, ctm, cssWidth, reach) => pix.evaluate(async ([b64, bg, ctm, cssWidth, reach, P]) => {
+  // `word`: the word's box in CSS px once its reveal is due by the state read after the capture (else null), so a
+  // capture that lands after the reveal does not count the word as stray (GATE-FLAKE-4).
+  const strayInk = (b64, bg, ctm, cssWidth, reach, word) => pix.evaluate(async ([b64, bg, ctm, cssWidth, reach, P, word]) => {
     const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + b64; });
     const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
     const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
@@ -5269,6 +5271,7 @@
     for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
       const k = (y * cv.width + x) * 4;
       if (Math.max(Math.abs(d[k] - bg[0]), Math.abs(d[k + 1] - bg[1]), Math.abs(d[k + 2] - bg[2])) <= 24) continue;
+      if (word && (x + 0.5) / ratio >= word[0] && (x + 0.5) / ratio <= word[2] && (y + 0.5) / ratio >= word[1] && (y + 0.5) / ratio <= word[3]) continue;
       ink++;
       const m = new DOMPoint((x + 0.5) / ratio, (y + 0.5) / ratio).matrixTransform(inv);
       let near = Infinity, acc = 0;
@@ -5282,7 +5285,7 @@
       if (near > 3.1 + 1.5) { stray++; if (!first) first = `(${m.x.toFixed(1)}, ${m.y.toFixed(1)})`; }
     }
     return { ink, stray, first };
-  }, [b64, bg, ctm, cssWidth, reach, P]);
+  }, [b64, bg, ctm, cssWidth, reach, P, word]);
   // Read two animation frames later, so the state is never behind the capture taken just before it.
   const sample = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(() => done((() => {
     const launch = document.getElementById('launch');
@@ -5293,11 +5296,16 @@
     const r = dot.getBoundingClientRect();
     const c = new DOMPoint(r.x + r.width / 2, r.y + r.height / 2).matrixTransform(m.inverse());
     const bg = getComputedStyle(launch).backgroundColor.match(/\d+/g).map(Number);
-    return { t: performance.now() - window.__marcLaunchT0, off: parseFloat(getComputedStyle(path).strokeDashoffset), dx: c.x, dy: c.y, ctm: [m.a, m.b, m.c, m.d, m.e, m.f], bg, booted: !!window.__bug34Ready, anims: document.getAnimations().filter(a => launch.contains(a.effect && a.effect.target)).length };
+    // The word's box once its own animation has passed the O1 reveal delay (1050 ms), else null.
+    const wEl = launch.querySelector('.launch-word'), wr = wEl.getBoundingClientRect(), wa = wEl.getAnimations()[0];
+    const word = wa && wa.currentTime >= 1050 ? [wr.left - 12, wr.top - 12, wr.right + 12, wr.bottom + 12] : null;
+    return { t: performance.now() - window.__marcLaunchT0, off: parseFloat(getComputedStyle(path).strokeDashoffset), dx: c.x, dy: c.y, ctm: [m.a, m.b, m.c, m.d, m.e, m.f], bg, word, booted: !!window.__bug34Ready, anims: document.getAnimations().filter(a => launch.contains(a.effect && a.effect.target)).length };
   })())))));
   const open = async (theme, rate, extra) => {
     const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: extra.os || 'no-preference' });
-    await ctx.route(/\/assets\/index-[^/]*\.js$/, async r => { await new Promise(res => setTimeout(res, 1500)); await r.continue(); });
+    // GATE-FLAKE-4: the bundle is held until the context closes. A hold timed from the request let a slow parse before
+    // __marcLaunchT0 use it up, so the app could boot while the samples were being taken.
+    await ctx.route(/\/assets\/index-[^/]*\.js$/, () => {});
     const page = await ctx.newPage();
     page.on('pageerror', e => errors.push(`${tag} ${theme}: ${e.message}`));
     const cdp = await ctx.newCDPSession(page);
@@ -5307,12 +5315,21 @@
       if (motion) localStorage.setItem('marc.motion', motion);
       let inner;
       Object.defineProperty(window, '__marcLaunchReady', { configurable: true, get() { return inner && (() => { window.__bug34Ready = true; inner(); }); }, set(fn) { inner = fn; } });
-      window.__bug34 = {};
-      new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-paint') window.__bug34.fp = e.startTime; }).observe({ type: 'paint', buffered: true });
-      const tick = () => {
-        const p = document.getElementById('launch-path');
-        if (p && window.__bug34.anim === undefined && parseFloat(getComputedStyle(p).strokeDashoffset) < 100) window.__bug34.anim = performance.now();
-        if (window.__bug34.anim === undefined) requestAnimationFrame(tick);
+      window.__bug34 = { frames: [] };
+      new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.name === 'first-paint') window.__bug34.fp = e.startTime; if (e.name === 'first-contentful-paint') window.__bug34.fcp = e.startTime; } }).observe({ type: 'paint', buffered: true });
+      // GATE-FLAKE-4: A2 reads the line and dot of every frame from the first one that has them, recorded here in the
+      // page at the frame's own time (the rAF time its animations were computed at), so no capture or round trip can
+      // move the times A2 measures at.
+      const tick = ts => {
+        const p = document.getElementById('launch-path'), dot = document.getElementById('launch-dot');
+        if (p && dot) {
+          const off = parseFloat(getComputedStyle(p).strokeDashoffset);
+          if (window.__bug34.anim === undefined && off < 100) window.__bug34.anim = performance.now();
+          const r = dot.getBoundingClientRect();
+          const c = new DOMPoint(r.x + r.width / 2, r.y + r.height / 2).matrixTransform(p.parentNode.getScreenCTM().inverse());
+          window.__bug34.frames.push({ t: ts, off, dx: c.x, dy: c.y, booted: !!window.__bug34Ready });
+        }
+        if (!window.__bug34.stop) requestAnimationFrame(tick);
       };
       requestAnimationFrame(tick);
     }, [theme, extra.motion || null]);
@@ -5331,11 +5348,17 @@
     if (!s1) { errors.push(`${tag} ${at}: #launch was gone at first paint`); await ctx.close(); continue; }
     await page.waitForFunction(t => performance.now() - window.__marcLaunchT0 >= t, s1.t + 100, { timeout: 8000 });
     const png2 = await shot(); const s2 = await sample(page);
-    await page.waitForFunction(() => performance.now() - window.__marcLaunchT0 >= 700, null, { timeout: 8000 });
-    const s3 = await sample(page);
-    if (!s2 || !s3) { errors.push(`${tag} ${at}: #launch was gone before the samples were taken`); await ctx.close(); continue; }
+    // Until the recorder has a frame 700 ms after the overlay's first paint (or the line is gone).
+    await page.waitForFunction(() => { const b = window.__bug34, f = b.frames; return !document.getElementById('launch-path') || (b.fcp !== undefined && f.length && f[f.length - 1].t >= b.fcp + 700); }, null, { timeout: 8000 });
+    const rec = await page.evaluate(() => { window.__bug34.stop = true; const t0 = window.__marcLaunchT0; return { fcp: window.__bug34.fcp - t0, frames: window.__bug34.frames.map(f => ({ ...f, t: f.t - t0 })) }; });
+    // A2 times from the overlay's first paint (first-contentful-paint; first-paint can be an earlier, empty frame): f0
+    // is the frame shown then, fA the first frame 100 ms or more after it, fB the first frame 700 ms or more after it.
+    const fp = rec.fcp, fr = rec.frames;
+    if (!Number.isFinite(fp) || !fr.length) { errors.push(`${tag} ${at}: no first-contentful-paint entry or no recorded frame`); await ctx.close(); continue; }
+    const f0 = fr.filter(x => x.t <= fp).pop() ?? fr[0], fA = fr.find(x => x.t >= fp + 100), fB = fr.find(x => x.t >= fp + 700);
+    if (!s2 || !fA || !fB) { errors.push(`${tag} ${at}: #launch was gone before the samples were taken`); await ctx.close(); continue; }
     // The probe only means something while the bundle is still held back.
-    if (s1.booted || s2.booted || s3.booted) errors.push(`${tag} ${at}: the app booted before the samples (${Math.round(s3.t)} ms), so the bundle delay did not hold`);
+    if (s1.booted || s2.booted || fB.booted) errors.push(`${tag} ${at}: the app booted before the samples (${Math.round(fB.t)} ms), so the bundle delay did not hold`);
     // A1: at first paint and +100 ms the dot is on the path, and nothing is painted off the path or
     // ahead of how far the dot and line have got (the SMIL build froze on the dot at 0,0 and a cap at 56,40).
     const cssWidth = await page.evaluate(() => innerWidth);
@@ -5343,14 +5366,17 @@
       const dot = nearest(s.dx, s.dy);
       if (dot.d > 0.6) errors.push(`${tag} ${at} ${n} (${Math.round(s.t)} ms): the dot is ${dot.d.toFixed(1)} units off the path, at (${s.dx.toFixed(1)}, ${s.dy.toFixed(1)})`);
       const reach = Math.max(dot.s, (100 - s.off) / 100 * L);
-      const px = await strayInk(png, s.bg, s.ctm, cssWidth, reach);
+      const px = await strayInk(png, s.bg, s.ctm, cssWidth, reach, s.word);
       if (px.stray > 0) errors.push(`${tag} ${at} ${n} (${Math.round(s.t)} ms): ${px.stray} painted pixels off the path or past the dot, first at ${px.first} (a stray dot or cap)`);
       if (n === '+100 ms' && px.ink < 50) errors.push(`${tag} ${at} +100 ms: only ${px.ink} painted pixels, so there is nothing to measure`);
     }
     // A2: the line and dot visibly move within 100 ms of first paint, and keep moving.
-    if (!(s2.off < s1.off && s2.off < 100)) errors.push(`${tag} ${at}: strokeDashoffset did not drop within 100 ms of first paint (${s1.off} at ${Math.round(s1.t)} ms, ${s2.off} at ${Math.round(s2.t)} ms)`);
-    if (!(Math.hypot(s2.dx - s1.dx, s2.dy - s1.dy) > 0.1)) errors.push(`${tag} ${at}: the dot did not move within 100 ms of first paint`);
-    if (!(s3.off < s2.off - 10)) errors.push(`${tag} ${at}: at ${Math.round(s3.t)} ms strokeDashoffset is ${s3.off}, want at least 10 below ${s2.off}`);
+    // On the recorded frames (GATE-FLAKE-4); load can only make fA and fB later and the early frames fewer.
+    if (!(fA.off < f0.off && fA.off < 100)) errors.push(`${tag} ${at}: strokeDashoffset did not drop within 100 ms of first paint (${f0.off} at ${Math.round(f0.t)} ms, ${fA.off} at ${Math.round(fA.t)} ms)`);
+    if (!(Math.hypot(fA.dx - f0.dx, fA.dy - f0.dy) > 0.1)) errors.push(`${tag} ${at}: the dot did not move within 100 ms of first paint`);
+    // Keeps moving: fB is at least 10 below every frame up to 300 ms after first paint.
+    const behind = fr.find(x => x.t <= fp + 300 && !(fB.off < x.off - 10));
+    if (behind) errors.push(`${tag} ${at}: at ${Math.round(fB.t)} ms strokeDashoffset is ${fB.off}, want at least 10 below ${behind.off} (at ${Math.round(behind.t)} ms)`);
     if (rate === 4) timings.push(`${theme} ${JSON.stringify(await page.evaluate(() => ({ firstPaint: Math.round(window.__bug34.fp), firstAnimated: Math.round(window.__bug34.anim) })))}`);
     await ctx.close();
   }
