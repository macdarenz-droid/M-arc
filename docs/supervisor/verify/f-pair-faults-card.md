# F-PAIR-FAULTS: a row draws only the pair-key faults its card supports

Status `ready` (supervisor, 11-04 ~15:20 UTC). Found by LIB-SHIP W2 (#379 "W2 PANEL FIX", Q-W2-14). Base: latest origin/main. Model: Opus.

## Problem
When a sheet uses a pair key's hand panel (`pairPanel(<key>)`), the app and the layers page draw **every** fault of that key, using the key's approved words. Example: mountain_climbers uses `palm-flat-floor-over`, so its sheet shows a "Palm cupped" page. The card's grip note says no source supports that fault. The card's own hand Wrong is "hands ahead of the shoulders, weight shifted back" (c2/c6/c19). The sheet's own FAULTS list already holds only hand-ahead, but the pair panel ignores it.

## Goal
A row may name the subset of its pair key's faults that its card supports (`pairFaults`), with per-row words where the card words them. Rows that name none draw exactly what they draw today.

## Files it may touch (write_scope)
The pair-panel path only:
- `tools/plates/library/build-layers-page.mjs` (`withPairPanels`);
- `tools/plates/library/hands/pairs.mjs` (`pairPanel`, `pairPanelProblems`);
- `tools/plates/gen/zooms.mjs` (the app's generated zoom), and their generated outputs (regenerated, never hand-edited);
- one new test file, `tests/howto/pair-faults.test.ts`.

MANIFEST changes only in a `[golden update]` commit, keyed by `manifestOf`, in the D-CROP-PIN form. Never touch research cards, specs, the vendor engine or CI.

## Acceptance
- **A1:** a row with `pairFaults: ['hand-ahead']` draws only that fault page, in the layers page and in the app's generated zoom. A row with no `pairFaults` is byte-equal to today.
- **A2:** golden B's 8 sheets, the curl, every pinned page and every generated file of a row without `pairFaults` stay byte-equal. Show this with `generate.mjs` and the page sha256s. MANIFEST moves only the keys of the files this card changes; prove it with a blanked-keys test.
- **A3, reds, each with a mutation:**
  - a `pairFaults` entry that is not a fault of the key;
  - an entry whose fault the card does not support (no card claim or hand-zoom wrong cites it);
  - an empty `pairFaults` list;
  - removing the filter.
- **A4:** mountain_climbers can name `pairFaults: ['hand-ahead']`. Show it as a fixture or scratch render only. Its sheet flips in a later LIB-SHIP wave, not in this card.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Make branch `claude/f-pair-faults` from origin/main, with a draft PR.
2. Post `F-PAIR-FAULTS PLAN @ <sha>`: the field name and shape, where it is read, and the red list. Wait for the ruling.
3. Build, then post `F-PAIR-FAULTS READY @ <full sha>` with A1-A4. A fresh reviewer follows.
