Card BOX-CAP: a named 50-word limit for the back-pain box only (owner decision 6, option 1; D-LIB5-BOX, R-W0-1; 2026-10-18)

id: BOX-CAP
model: claude-opus-5-5 (not mechanical: finding every place that counts the box, and the identity rule)
mode: auto
title: 'Builder: BOX-CAP back-pain box limit'
branch: claude/box-cap (new). Draft PR 'BOX-CAP: a named 50-word limit for the back-pain box'.
base: claude/lib-5-shared-layers @ 1d1fe9ea732cc58ac1d68d8084bc9f5e0dc1aac6, LIB-5's reviewed head, which holds validate.mjs and the library lint. If LIB-5's head moves in review, merge the new head with a merge commit. Once LIB-5 is on main, merge origin/main.

**Why this card exists**
- The owner chose option 1 on 2026-10-18 ~13:15 UTC: the 50-word back-pain box, which keeps all six NHS emergency triggers. The research record:
  - `claude/libht-research` @ `0393aac9`, where shared/back-pain-box.json is `owner-approved`;
  - verify/w0.md R-W0-1.
- R-W0-1: "The cap for this one box is 50 words; every other box stays at 30. Where the box lint counts words, add a named limit for this box only. Show it failing at 51 and passing at 50 or under."
- D-LIB5-BOX (lib4-cards 12 item 12): this is its own card, under his recorded answer, and LIB-5 never makes the change. It merges after LIB-5 and before LIB-5's Do 9 PR (`claude/lib-5-back-box`), which copies the box. LB1 cannot merge before Do 9 (LR-28), so this card is on LB1's critical path.

**Where the box is counted today** (on the base; re-check each line):
- tools/plates/layers/artifact/copy-lint.mjs:50 `RED_FLAG_BOX_MAX_WORDS = 30` and :335. This is golden B, reserved, and stays byte-identical.
- tests/howto/checks/c7.ts:38 `redFlagBoxWords: 30` and :299, the per-sheet box check.
- tools/plates/library/lint/index.mjs:48 (lintShared).
- tools/plates/library/research/validate.mjs:106-109: a settled box is held to golden B's cap.
- tests/howto/library-lint.test.ts:36-37 pins c7's and golden B's caps at [30, 30]. That pin stays unchanged.
- Name any other place you find in the PR.

**Do:**
1. Define the limit once, in a new library module: `tools/plates/library/lint/box-caps.mjs` exporting `NAMED_BOX_CAPS = { 'back-pain-box': 50 }` and `boxCapOf(key)`. boxCapOf returns the named cap for a listed key, and golden B's imported RED_FLAG_BOX_MAX_WORDS for every other key. Never copy 30 or 50 into another file.
2. Apply it by identity, never by text or count, at every counting place outside golden B:
   - validate.mjs: settled red-flag boxes use `boxCapOf(card.key)`.
   - lint/index.mjs: the shared box lint uses the box's key.
   - c7.ts: the per-sheet check uses the cap of the box the sheet's redFlag links. If c7 cannot see the box's key from the sheet, post the smallest wiring that gives it one, before you build it. LIMITS.redFlagBoxWords stays 30 and stays the default.
3. golden B's copy-lint.mjs and its 30 stay byte-identical, and so do the 8's sheets.
4. Write tests/howto/box-cap.test.ts with the acceptance rows below, red first where stated.
5. Record D-BOXCAP-1 in docs/COACHING-DECISIONS.md (append): the owner's answer, the identity rule, and that every other box stays at 30.

write_scope: tools/plates/library/lint/box-caps.mjs (new); validate.mjs's cap lines and import; lint/index.mjs's cap line and import; c7.ts's per-sheet cap line(s) and import, plus at most the wiring that gives c7 the box key; tests/howto/box-cap.test.ts (new); docs/COACHING-DECISIONS.md (append).
reserved_paths: tools/plates/layers/** and vendor/** (golden B); src/**; every docs/research/** file (Do 9 copies the box); library-lint.test.ts's [30, 30] pin; every other limit, budget and gate block; .github/**; package*.json.

**Acceptance** (tests/howto/box-cap.test.ts; each mutation is shown red, then restored):
- BC-1: the back-pain box at 50 words passes, and at 51 fails, in validate.mjs, the library lint and c7. That is 3 sites × 2 cases. The 50-word case is red on the base, and the 51-word case is red after.
- BC-2: any other box at 31 words still fails in the same 3 sites, and at 30 passes. golden B's copy-lint.mjs is byte-identical to the base (a sha256 pin).
- BC-3: identity. A 50-word box under any key other than 'back-pain-box' fails. The back-pain box with its text changed but its key kept is still capped at 50.
- BC-4: `validateSharedFile('back-pain-box.json')` on a copy of `claude/libht-research` @ `0393aac9`'s shared/back-pain-box.json and its quotes file is green. On the base it fails with "box has 50 words, at most 30".
- Mutations:
  - NAMED_BOX_CAPS['back-pain-box'] set to 49: BC-1 red.
  - boxCapOf returning 50 for every key: BC-2 and BC-3 red.
  - validate.mjs back on RED_FLAG_BOX_MAX_WORDS: BC-4 red.
  - c7's site back on LIMITS.redFlagBoxWords: BC-1 (c7) red.

**Verify:** npm ci; npm run check; npm run test:tz; MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate. `git diff --stat origin/claude/lib-5-shared-layers...HEAD` (or origin/main once LIB-5 has merged) shows only write_scope files.

finish: merged in the train right after LIB-5, then LIB-5's Do 9 PR. You will notice: nothing visible. The box text ships with Do 9.
