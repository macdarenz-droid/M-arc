# REVIEW LR23-DOCS: PASS

Fresh-context reviewer, 2026-09-30. Spec: `LR23-PLAN.md` sections 7, 8 and 9 on `claude/lr23-plan` (de4857d), as amended by D-LR23-1 to D-LR23-8.

The three commits do what the amended plan asks. No blockers and no high findings. The plates are byte-identical and 0 px against golden A bc0f378, so the owner's rule is kept. Fix the medium findings before the HT-4b builder starts. They are all doc edits.

## 1. claude/howto-options 677f8e3 (golden B)

Everything I re-proved myself on 677f8e3, in `docs/howto/golden-b`:
- **Build:** `node artifact/build-page.mjs` gives lint 0. The page sha256 is `e7b8141368e59cf993f29555efce53bc06f36131d8e283c79e11a9f2614c928a`, 2,320,561 bytes. Both match the README.
- **Fidelity:** `node artifact/fidelity-check.mjs` PASSED: 104 byte fragments and 80 pixel regions (8 exercises × 5 themes × normal and Mistake), 0 failures, 0 px.
- **State check:** `node artifact/shoot2.mjs` reports `"problems": []` in 5 themes. The structure line ends `… hw-sec > ht-disclaimer` on every sheet.
- **Hand test:** `node engine/hand-test.mjs` gives `ok: true`.

**Why `technical-plates.html` changed.** It is the built page, so the source edits show up in it. The diff has only these parts:
- The `.srcs`, `.src-*`, `.ev*` and `.pg-foot details` CSS rules are removed, and so is `.srcs > summary svg` in the reduced-motion rule.
- Each sheet's `<details class="hw-sec srcs">` is replaced by `<p class="ht-disclaimer" id="<slug>-disclaimer">`.
- The header line changed.
- The footer's "cited joint angles (Winter 2009…)" line and its sources `<details>` are removed.

No plate fragment is in the diff. The fidelity check confirms it: every plate's bytes equal golden A, and 0 px differ in 80 pixel regions. The README records the header decision: the plan's shorter header moved the plates by half a pixel, and the builder kept the line height rather than loosen the check. That is sound.

**Lint mutations.** I made each edit, rebuilt, and restored the file. The rebuild then gave the same sha256 again, and the tree was clean.

| Mutation | Result |
|---|---|
| `SHOW_EVIDENCE = true` in `shared.mjs` | fails: `shared.SHOW_EVIDENCE [sources and evidence labels are never shown …]` |
| "Call 999." in `RED_FLAG_KNEE.now` | fails: `[no contact or emergency wording (LR-23)] "999"` |
| "Go to A&E." in `RED_FLAG_KNEE.now` | fails: `[no contact …] "A&E"` |
| "(Muyor 2023)" in pull_up `setup[0]` | fails: `[no source or evidence wording] "(Muyor 2023)"`, plus the registry-name rule |
| "Weiss 1995" in `setup[0]` | fails: SOURCE_CS_RE, plus the registry name "Weiss" |
| "NSCA teaches" in `setup[0]` | fails: SOURCE_CS_RE "NSCA" |
| Back-box fixture, now "…bladder or bowel changes? Get emergency help now." (in-process, `lintShared`) | passes every LR-23 rule: 0 LR-23 violations; all 4 regexes false on "Get emergency help now." |
| The same back box with "Call 999." / "Go to A&E." / "Ring your GP." | fails with 3, 2 and 1 LR-23 violations |

**Other checks:**
- **Patterns:** copy-lint's four `export const` pattern lines, `cmp`'d against the D-LR23-1 block in the plan, are byte-identical (REGEX-IDENTICAL).
- **Disclaimer:** it is word for word and appears 8 times in 8 sheets. Each is the last node of its sheet, after the Risks section with its red-flag boxes, which shoot2 also checks.
- **Nothing source-shaped left:** the page has 0 `srcs`, 0 `src-`, 0 `class="ev`, 0 "Sources", 0 label words and 0 `SHOW_EVIDENCE`.
- **Links:** the page has 2 `<a>`, both in the page chrome and outside every sheet: the in-page jump `href="#machine-chest-press-chip-hand"` and the body-map licence credit (github.com/vulovix/body-muscles). The README keeps the credit as a licence notice. It is not in any `.ht` card, and C19 blocks `<a>` in the app.

**Findings:**
- **Low: a false claim.**
  - Where: `artifact/copy-lint.mjs`, the pattern comment ("Byte-identical copy of tests/guards/no-contacts.ts on main"), and README §LR-23 ("byte for byte the same as `tests/guards/no-contacts.ts` on main").
  - What: that file is not on main (e14c45b). ESC-NC has not created it yet.
  - Fix: say "the D-LR23-1 literals; ESC-NC creates `tests/guards/no-contacts.ts` and the HT-4b parity test pins the two". This touches no page bytes.
- **Low: violations are reported twice.**
  - Where: `lintShared`.
  - What: a box line that hits a pattern is reported twice, once by `checkText` (kind prose) and once by `noContact`. It is cosmetic.
  - Fix: optional; skip the pattern pass in `checkText` for box paths.
- **Info: the back box and the "today" rule.**
  - What: the golden-B box rule "the urgent line must say today" would reject the D-LR23-1 back box, as expected, since golden B has no back box. The library's add-only urgent-line rule (kept in f9568ca) must be what allows "Get emergency help now." there.

## 2. claude/howto-options f9568ca (cards and plans)

Sections 8 and 9 are applied as amended:
- **Back box:** it keeps "Get emergency help now." and its add-only lint rule in LIBRARY-HOWTO-ARCHITECTURE.md and content.md. Only "Call 999" is gone: the draft, the risk row (reworded, with the reason recorded in COACHING-DECISIONS) and the lint item. The cancelled R6 edits were not applied.
- **HT-4b:** the card has all 13 task-card fields. It holds:
  - D-LR23-2: 'supervisor', the why text, 'owner' only after the owner sees pilot A, and a failure test for 'owner';
  - D-LR23-6: HT-4 is not reopened, and the merge slot is after HT-4, before HT-5;
  - D-LR23-7: no allowedUrls; the SVG and xlink namespaces in their whole-attribute form with an optional backslash; both fixtures;
  - C19 (a)-(d);
  - SOURCE_CS_RE wherever SOURCE_RE runs;
  - the registry-name check;
  - M1-M9 (M3 is "Go to A&E."), the 4 extra fixtures, and the passing back-box fixture;
  - M10 as a self-contained stub.
- **Other cards:** HT-3b, HT-5, HT-9, HT-10, HOWTO-BUILD-PLAN.md, GRIP-AND-FEEL and the library docs match. C19 ownership is consistent: HT-4b owns the unit checks, HT-9 the gate block, and HT-10 re-runs it with M10-M12. Nothing was loosened beyond what the plan asks.

**Findings:**
- **Medium: HT-4b write_scope is missing a file.**
  - Where: `cards/HT-4b.md`, write_scope and HT4b-A1.
  - What: HT-4 (`HT-4.md:22`) writes a `layers` entry with the page sha256 in `tests/howto/golden/GOLDEN.json`. The re-vendor changes that sha256, but HT-4b's write_scope only lists `howto-layers.html`. The builder would have to either leave a stale pin or write outside its scope.
  - Fix: add "the `layers` entry in `tests/howto/golden/GOLDEN.json`" to write_scope and A1.
- **Medium: some rules have no failure fixture.**
  - Where: `HT-4b.md`, outcome ("Every rule is proven by a failure fixture") and HT4b-A5.
  - What: the rules without one are:
    - the registry author and organisation check;
    - C19(c) escaped values (`class=\"srcs\"`, `xlink:href=\"https://…\"`);
    - `url` or `cite` keys, or a `sources` export, under `src/howto/generated`;
    - a `src-*` class (M8 covers only `ev`).
  - Fix: add one failing fixture for each to A5.
- **Medium: C19 (a) and (b) can pass on nothing.**
  - Where: `HT-4b.md`, C19 (a) and (b).
  - What: at HT-4b's slot (before HT-5), `archetypes.ts` and the 8 generated sheets may not exist yet, so (a) and (b) could pass without checking anything.
  - Fix:
    - run them at HT-4b on the vendored golden-B `shared.mjs` and `*.howto.mjs`;
    - require a count of 8 sheets, so an empty run fails;
    - state that HT5-A2 turns them on against the generated content.
- **Low: HT9-A1 lost its "expanded" state.**
  - Where: `HT-9.md:26`.
  - What: the plan asked for "collapsed and expanded" to be struck, and it was. But golden B shows every setup step with no expand button, so no expanded setup state is left to compare. That is acceptable.
  - Fix: optional; if the collapse code can ever show, add "setup collapsed and expanded when a toggle renders".
- **Low: build-plan/README.md:17.** "O3: show the evidence labels." is kept next to its closing note, and the two read as a contradiction. Fix: "O3 (closed by LR-23): …".
- **Low: GRIP-AND-FEEL-ARCHITECTURE.md:70 and :87.** Two lines still describe evidence tags as shown or as an open question. Fix: touch both lines up to match LR-23.
- **Low: HOWTO-BUILD-PLAN.md:260.** The HT-4 line still says "C17 (source)". Fix: add "(superseded by HT-4b)".

## 3. claude/libht-research 1fc9dbc (research cards)

What I checked:
- **RULINGS.md:** LR-27 is add-only (+1 line, −0). It matches D-LR23-1: R1-R5, the back box as amended (30 words), only "Call 999" removed, and LR-11's urgent line and its lint rule kept.
- **The 39 changed lines in 21 cards:** each is an exact string swap. Putting the old strings back reproduces the parent files byte for byte in all 21. Key order, line count and the trailing newline are unchanged, and every file parses as JSON. Claims, quotes and sources are unchanged, and no file under `quotes/` changed.
- **The new wording:** every line still follows from its claim's quotes. Each dropped referral row links a shared `redFlag` box.
- **Regex sweep** over the visible fields of all 93 cards (CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, SAFETY_LINE_RE): **0 hits**.
  - Fields treated as visible: `name`, `setup[].step`, `posture[].point`, `handlingMistakes[]`, `feel.rows[].where/means/fix`, `risks[].risk`, `zooms[].right/wrong`, `plate.checkpoints[]`, `plate.mistake.what`, `plate.tells[].text`, `loadProgression`, `barPath`, `breathing`, `tierA.wayOut`.

**Findings:**
- **Medium: LR-27 leaves some card fields unclassified.**
  - Where: `RULINGS.md` LR-27, its card-lines sentence.
  - What: it does not say whether `plate.mistake.why`, `grip.{type,width,thumb,handContact,wrist}` and `plate.tempo.text` are shown. About 120 SOURCE_RE and SOURCE_CS_RE hits sit there, with no contact or safety hits. Examples:
    - "ACE names…" in about 25 `plate.mistake.why` fields;
    - "Not given by any source read" in `grip.*`;
    - "…EMG study (c9)" and "(ACE)" in `plank` `plate.tempo.text`.
  - The drawing fields (`equipment`, `start`, `variantLine`) have another 20 hits.
  - Fix: one sentence in LR-27 declaring these fields research data, never shown. If a sheet will ever show them, scrub them the same way.
- **Low: the back rows have no doctor line yet.**
  - Where: `landmine_row` rows[2], `pendlay_row` rows[2] and `t_bar_row` rows[2].
  - What: "see a GP" was removed as R5 requires, and the rows now link `redFlag: back`. But the back box is still a pending link (LR-26), so until it ships these sheets show no doctor line for worsening back pain.
  - Fix: record in LIB-5 or the stamp card that these sheets cannot ship before the back box.
- **Low: `dumbbell_biceps_curl.json` risks[1] reads more into the quote than it says.**
  - What: "Dropped weights, mostly free weights, are…" mixes up the quote's 90.4% (all injuries that involved free weights) with dropped weights. The old wording had the same mix-up.
  - Fix: "Across all weight training, dropped weights are the most common way people get badly hurt."
- **Low: `chin_up.json` rows[2].fix says the same thing twice.** "…stop chin-ups and don't train through it". Fix: drop "and don't train through it" or "stop chin-ups and".
- **Info: not verified.** LR-27's "a fresh critic checked… 3 findings fixed" has no evidence in the commit.

## Commands run
- `git fetch origin claude/lr23-plan claude/howto-options claude/libht-research main`; `git worktree add` at 677f8e3; `npm ci` (for playwright).
- `node artifact/build-page.mjs`: lint 0; `sha256sum`/`wc -c` gave e7b81413…928a, 2320561.
- `node artifact/fidelity-check.mjs`: PASSED, 0 failures, 0 px.
- `node artifact/shoot2.mjs`: `"problems": []`.
- `node engine/hand-test.mjs`: `ok: true`.
- Mutation loop (`sed`, build, `git checkout`): 6/6 fail as expected. The final rebuild gave the same sha256.
- A back-box fixture script run in-process against `lintShared`: the pass fixture has 0 LR-23 violations, and the 3 mutants fail.
- `cmp` of the plan's pattern block against copy-lint's pattern lines: identical.
- `grep` counts on the page for links, `srcs`, `src-`, `ev`, label words, "Sources" and the disclaimer.
- `git diff 677f8e3~1 677f8e3`, and `git diff f9568ca~1 f9568ca` read through against sections 8 and 9 as amended.
- `git diff --numstat/--word-diff 21868f6 1fc9dbc`. A node script put the old strings back (byte-identical in 21/21 files), compared every value and key order (39 changes), ran `JSON.parse`, printed each changed line's claim quotes, and ran the regex sweep over all 93 cards.
