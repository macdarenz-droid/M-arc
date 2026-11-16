# F-UNDERHAND-FAMILY: underhand_lat_pulldown's inherit map compares only what the card inherits

Owner: supervisor (drafted 11-16; status `draft`). Base: origin/main `46e564ce` (train 100). Every file:line below was read on that commit.

Builder: `claude-sonnet-5`, with every step spelled out below; a fresh Opus reviewer follows. This is a tool card: no app screen changes, no stage flips, no saved or sent data.

Sources:
- W8c #429: PLAN 6893620770, PLAN RULED 6893626415 (D-W8C-UNDERHAND);
- `docs/howto/library/LIB-SHIP-DESIGN.md` "W8c PLAN" (the static red) and the W3 rows for Q-W3-2/Q-W3-3;
- PF5 #419 (6851987591, D-PF5-HANDPAIR 6852356177);
- `plan-w9.md`, `lib-ship-w9-card.md`.

Scratch check (supervisor scratchpad `w9/scripts/fam.mjs`, `fam2.mjs`, never committed): `familyRefusal` and a leaf diff run on an extracted copy of `46e564ce`, with the proposed line swapped in and then swapped back.

## Why now
- underhand_lat_pulldown's plate (PF5) and sheet (PF5 layers plus D-PF5-HANDPAIR) are approved. W8c held it only because the family check refuses it once it is shipped (D-W8C-UNDERHAND):
  - `gen/library-gate.mjs:58-59` throws;
  - generate stops.
- W9 carries it if this card merges by W9's LAYERS READY (lib-ship-w9-card.md S4). That is +1 toward the 142.

## The red (reproduced on `46e564ce`)
`familyRefusal('lib_underhand_lat_pulldown', …)` with lat_pulldown as the shipped parent returns:

> `lib_underhand_lat_pulldown: family: posture: bar comes down in front of the face, never behind the head: posture[key=path].detail "The bar comes down in front of your face and stops just below your chin. Never behind the head." !== parent lib_lat_pulldown's "The bar travels past your chin to the top of your chest. Never behind the head." (D-LIB5-FAMILY)`

- **The cause.** The map entry `family.mjs:69` compares the whole `posture[key=path]` and the whole `zooms[key=pad]`.
- **Q-W3-2/Q-W3-3** proposed narrower paths (LIB-SHIP-DESIGN.md, W3 table) that were never applied.
- **The check runs only on shipped rows** (family.mjs:134, library-gate.mjs:51-59), so no wave met it until W8c's dry run.

## Leaf facts
These come from the `leaves()` diff on `46e564ce`. `claim` subtrees are left out, as family.mjs:122-125 does.

| map path | parent leaves | child leaves | equal | differ |
|---|---|---|---|---|
| `posture[key=path]` | 5 | 4 | 3 (`.key`, `.label` "Bar in front", `.anchor.at` "chin") | `.detail`: the child's own c6 stop point (Q-W3-9; sheet `lib_underhand_lat_pulldown.howto.mjs:243-245`). `.zoom` "path": the parent only; the child has no path zoom ("no zoom link", sheet :242) |
| `zooms[key=pad]` | 43 | 41 | 41 | `.feelRow` "low-back" and `.feelPrompt`: the parent only. Q-W3-8 (sheet :161): "feelRow and feelPrompt are not compared; this card dropped the low-back row" |

- `.heading` matches only since #423. Its `5fa1795c` changed the child's "Knee pad: right and wrong" to "Knee pad". So this card's base must contain `46e564ce`.
- The card's inherit[] names exactly two fields (`cards/underhand_lat_pulldown.json`):
  - "posture: bar comes down in front of the face, never behind the head";
  - "zooms: seat height / thigh pad crop".

## The change (smallest)
One line, `tools/plates/library/lint/family.mjs:69`, plus a one-line comment above it naming this card.

```js
// F-UNDERHAND-FAMILY (<ruling id>): the path row keeps the parent's label and anchor (Q-W3-9 made its detail the card's
// own c6); the pad zoom is the W3 PAD list (Q-W3-8: no feel link), as close_grip_pulldown's (:37).
lib_underhand_lat_pulldown: { 'posture: bar comes down in front of the face, never behind the head': ['posture[key=path].label', 'posture[key=path].anchor'], 'zooms: seat height / thigh pad crop': PAD },
```

- **`PAD` is family.mjs:24**, the existing W3 knee-pad list. It holds `key, chip, heading, kind, crop, right, wrong, guides, callout, caption, alt` and leaves out `feelRow` and `feelPrompt`.
- **The form already exists:**
  - TXT and ROW (:23, :31) compare a posture row leaf by leaf;
  - close_grip_pulldown (:37) uses PAD less two keys.
- **Measured in scratch** with this line:
  - `familyRefusal` → `null`;
  - a child label "Bar low" → red (`posture[key=path].label "Bar low" !== parent … "Bar in front"`);
  - a pad `crop.sizePx` of 141 → red (`… 141 !== parent … 140`).
  - With main's line put back, the red above returns.

**Why this is not a loosening.** D-LIB9a-MAP's W3 rule (family.mjs:20-22) is "a child keeps the parent's leaves except the ones its own card or a panel fix changed". Q-W3-9 ruled the path detail to be the child's own. Today's entry is unpassable by a card-true sheet, so it protects nothing. The new entry still fails closed on every inherited leaf: 2 path leaves and 41 pad leaves, each with a red below.

**The inherited sentence.** Card inherit[0]'s claim is "never behind the head". The child's detail ends with the parent's last sentence, "Never behind the head.". Q-UF-2 pins it with a test, so dropping it is red without a new comparator kind in family.mjs.

**Rejected options:**
- (a) Edit the sheet so its detail equals the parent's. That breaks card c6 (the stop point) and moves the card W9 carries (S1 there).
- (b) Drop the path field from inherit[]. That is a research-card edit, and it is not card-true: the card does inherit the claim.
- (c) A substring or "ends with" comparator in family.mjs. That is a new rule kind for one row; the test pin does the same job.

## Saved data
None. The change is a lint table in `tools/`.
- No app file, no generated file and no stored or sent field moves.
- `MANIFEST.json` has no `lint/family.mjs` key (0 hits).
- `red-flag-back.ts`'s header inputs are the back box and its card only (`library-gate.mjs:37`).
- The PLAN confirms `generate --check` is clean.

## Rulings asked
1. **Q-UF-1: its own PR,** not folded into W9 under lib-ship-card's "INHERIT_MAP entries only, as ruled" write_scope.
   - Recommended: own PR. It gets its own red-before/green-after review, W9 stays a carry wave, and it is small enough to land before W9's LAYERS READY.
2. **Q-UF-2: the inherited sentence is pinned by a test,** not by family.mjs.
   - The test asserts that the child's `posture[key=path].detail` ends with the last sentence of the parent's `loadContent('lib_lat_pulldown')` detail, read at test time, not as a literal. The red is the sentence dropped.
   - Recommended: yes.
3. **Q-UF-3: the sheet stays byte-equal.** Its comment at :242 ("label, detail and anchor equal lat_pulldown's") is stale since Q-W3-9; record that in the PR, and do not edit it.
   - Recommended: yes. A sheet edit would move its MANIFEST key, and W9's carry reference.

## Scope and write_scope
- `tools/plates/library/lint/family.mjs`: line 69 and one comment line above it. Nothing else.
- A new `tests/howto/f-underhand-family.test.ts`.
- Never touch:
  - research cards and quotes; `howto/**` sheets; specs; golden pages and pins; `MANIFEST.json`;
  - batch stages and layers configs (W9's);
  - `gen/**`, `src/**`, `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `package*.json`;
  - `escobar-worker/**`, `native/wear/**`, signing and keystores, saved-data shapes (AGENTS.md).

## Steps (every step spelled out)
1. Read `.claude/skills/builder/SKILL.md`. Branch `claude/f-underhand-family` from origin/main (`46e564ce` or newer; it must contain #423). Open a draft PR 'F-UNDERHAND-FAMILY'.
2. Post `F-UNDERHAND-FAMILY PLAN @ <sha>` with:
   - the red above, re-run on the base;
   - the leaf table re-run;
   - the exact line and comment;
   - the test list (Acceptance);
   - the other tests that read `INHERIT_MAP`: `lib-ship.test.ts` E5 (:659-684) and the W4 filters (:493-616), and `library-lint.test.ts`. Show that they pass unchanged.
   Wait for 'F-UNDERHAND-FAMILY PLAN RULED'.
3. Write the test file first and run it on the base. U1 is red there, so post the red line.
4. Change the line. Run the test file, `lib-ship.test.ts`, `library-lint.test.ts`, `npm run typecheck` and `node tools/plates/generate.mjs --check`.
5. **Scratch dry run** (never committed): flip underhand in a scratch worktree with a scratch stamp and its lb01 row (lib-ship-w9-card.md), then run `node tools/plates/generate.mjs`. Post that the library gate passes for it, or the next red.
6. Merge origin/main with a merge commit. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once. Post `F-UNDERHAND-FAMILY READY @ <full sha>`.

## Acceptance
| id | check | evidence |
|---|---|---|
| U1 | `familyRefusal` for lib_underhand_lat_pulldown, with the real sheet, card and parent (`loadContent`), is `null`. On main it is the exact red above | the test (red on main, green after) |
| U2 | The 2 path leaves and the 41 pad leaves are each compared: the mutations m1-m4 turn red | the test |
| U3 | The inherited sentence (Q-UF-2) | the test |
| U4 | Every other `INHERIT_MAP` entry is byte-equal to main (the diff is one line plus one comment), and every shipped row's `familyRefusal` stays `null` (generate's library gate) | `git diff`; `generate --check` |
| U5 | Nothing else moves: `generate --check` is clean, MANIFEST.json is unchanged, and no `src/` or generated file is in the diff | command output; `git diff --stat` |
| U6 | The scratch flip (step 5) passes generate's library gate for underhand | posted output |
| U7 | The READY head contains the latest main; check, test:tz, the gate and CI are green | CI links |

## Mutations
Each must turn a named test red. Post the red lines.

| id | mutation (in the test, on a copy of the content) | red |
|---|---|---|
| m1 | the child's path `label` changed | U2 |
| m2 | the child's path `anchor.at` changed | U2 |
| m3 | one pad leaf changed (`crop.sizePx` 141; then `wrong.equipment.kneePad.dy`) | U2 |
| m4 | the pad zoom removed from the child | U2 (`atPath` throws) |
| m5 | "Never behind the head." dropped from the child's path detail | U3 |
| m6 | main's line 69 restored (a copy of the map) | U1 |
| m7 | an `INHERIT_MAP` field of underhand mapped to `[]` | lib-ship E5 (:659-684), kept |

## Rules
- PLAN first, then READY. A fresh Opus reviewer follows READY.
- **Never loosen a check.** The `===` compare, `leaves()`, `atPath()` and every other entry stay as they are.
- **No flip here (the D-RP-NOFLIP form).** W9 flips underhand, with its carry against PF5's lb01 card (lib-ship-w9-card.md).
- No closing keywords in commits or the PR body.

### Stops
- Any other row's `familyRefusal` or lint result changes.
- `generate --check` or MANIFEST moves.
- The scratch flip meets a second red (for example `gen/hands.mjs:62`, "no scoped close-up CSS", if its lb01 row is missing). Post it and name its owner. Do not fix it here.

## Risks
- **The pin set is too narrow.** Mitigation: every leaf that card inherit[] covers is compared (2 + 41), each with a red, and Q-UF-2 pins the sentence.
- **#423-dependent equality.** The pad heading matches only after `5fa1795c`. Mitigation: the base must contain `46e564ce`, and U1 runs on it.
- **W9 timing.** Mitigation: this card is about half a day. If it misses LAYERS READY, underhand waits for W10 (W9 S4); nothing else waits.

## Forecast [est]
- PLAN 1 h, build and tests 2 h, scratch dry run 1 h, CI about 94 min, review 1-2 h. **READY in about half a day, merged in about 1 day.**
- Uncertainty: the scratch flip finding a second red (Stops).

## Not verified
- The full generate run with underhand flipped. Only `familyRefusal` was run here.
- That `library-lint.test.ts` has no line that pins line 69's exact paths (grep found `INHERIT_MAP` reads in lib-ship.test.ts and library-lint.test.ts; none names underhand).
- That `red-flag-back.ts`'s header does not hash family.mjs, inferred from `inputsFor` (library-gate.mjs:37).

Supervisor rulings: (none yet)
