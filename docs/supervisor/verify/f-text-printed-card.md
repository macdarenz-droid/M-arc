# F-TEXT-PRINTED: a guard so no claim lands only in a field the user never sees

Status `ready` (supervisor, 11-05 ~08:10 UTC). Source: D-TEXT-PRINTED (#392 6652647984) and the audit of main `e623d3ef` (scratchpad `audit-printed-result.md`). Base: latest origin/main; branch `claude/f-text-printed`. Model: Opus.

## Findings on main (audit, file:line in the audit file)
- Neither the app nor the layers page prints `copy.setupLine`, `copy.mistakeLine`, `copy.cueLine`, posture details or the feel muscles' plain lines. The app prints only `copy.variantLine` (`src/slices/howto/VariantLine.tsx:6`), and `sections/Posture.tsx:59` renders nothing.
- `copy-lint.mjs:23-26` wrongly says the app prints these fields.
- Of the 17 shipped ids, nothing safety-relevant is lost. Three claims are cited only in unprinted fields:
  - cable_fly c8 and dumbbell_biceps_curl c13: both texts are still printed elsewhere;
  - dumbbell_biceps_curl c7 ("dumbbells may hang slightly out to keep the wrist straight", in `handling.width.text`): never shown.

## Goal
1. A lint, add-only and run in `lintLibraryRow` and on the reference sheets: every claim id a sheet cites must appear in at least one printed slot. A printed slot is a step, caption, mistake, risk, feel row, grip line, plate label or alt. A claim cited only in an unprinted field is red.
2. Correct the copy-lint comment so it says which fields the app does not print.
3. Show dumbbell_biceps_curl c7 in a printed slot (the grip line or a step), card-true and cited. Re-pin what that moves in a `[golden update]` commit.

## Files it may touch (write_scope)
- `tools/plates/library/lint/**` (add-only rule) and `copy-lint.mjs` (the comment only);
- dumbbell_biceps_curl's sheet source;
- tests for the above;
- the pins that move.
- Never: other sheets, cards, plates, CI.

## Acceptance (each red with a mutation)
- The lint is red on a fixture whose claim is cited only in `copy.cueLine`, and green on main's 17 sheets after the c7 fix. Mutation: put c7 back only in `handling.width.text`, and the lint is red.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Steps
Read `.claude/skills/builder/SKILL.md`, post `F-TEXT-PRINTED PLAN @ <sha>` on a draft PR, wait for the ruling, then build and post READY. It merges before W3, and the waves reuse the lint.
