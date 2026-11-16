# F-PALMFLAT-APPTYPE: the app's HandPose type knows the palm-flat pose fields

Owner: supervisor (drafted 11-16; status `ruled` 2026-11-16). Base: origin/main `46e564ce` (train 100). Every file:line below was read on that commit.

Builder: `claude-sonnet-5`, with every step spelled out below; a fresh Opus reviewer follows. This is a type-only card: no screen changes, no runtime change, no stage flips.

Sources:
- W8c #429: LAYERS READY 6895186807 and rulings 6895200917 (D-W8C-MCHOLD);
- `docs/howto/library/LIB-SHIP-DESIGN.md` "W8c rulings and layers evidence";
- `plan-w9.md`, `lib-ship-w9-card.md`.

Scratch check (supervisor scratchpad `w9/main/scratch-tc/`, never committed): `tsc` (the repo's own, from a worktree's node_modules) on the two palm-flat literals below, first against main's `content-types.ts`, then against the patched copy, then main's copy restored.

## Why now
- mountain_climbers' sheet, hand panel and crop are approved for round 2 (W8a 6760254084; #424; the scratch card at `0523227e`). W8c held it only because its generated chunk fails typecheck (D-W8C-MCHOLD, 6895200917).
- It is the first shipped row with a palm-flat hand zoom. push_up and the other palm-flat rows ship with none (their fault poses are `{}`).
- W9 takes mountain_climbers if this card merges by W9's LAYERS READY (lib-ship-w9-card.md S4). That is +1 toward the 142.

## The red
- `npm run typecheck` on W8c's scratch flip failed on `src/howto/generated/ht-mountain-climbers.ts`. TS2353: "'forearmTilt' does not exist in type 'Partial<HandPose>'". loaders.ts then rejects the chunk (6895186807).
- **Reproduced here.** These two literals, which mirror the sheet, give 2 × TS2353 on `forearmTilt` (exit 2) against main's type. TypeScript names only the first unknown key per literal, so `cup` is hidden behind it.
  - the fault: `{ key: 'hand-ahead', label: 'Hand ahead', pose: { forearmTilt: 25, cup: 0 }, markers: [], alt } satisfies HandFault`;
  - the handling: `{ archetype: 'palm-flat', …, pose: { forearmTilt: 0, cup: 0 }, faults: [fault], … } satisfies HandlingSpec`.

### Where the fields come from
- **The palm-flat view draws its own pose**, `{ forearmTilt, cup }`, not a radial HandPose:
  - `tools/plates/library/hands/view-palm-flat.mjs:13-15` (the pose comment) and `:19` (`PALM_FLAT_DEFAULT = { forearmTilt: 0, cup: 0 }`);
  - the key's `VARIANTS.floor` (`hand-palm-flat.mjs:15`: `right: { forearmTilt: 0, cup: 0 }`; `:19` `cupped-palm` pose `{ cup: 10 }`; `:21` `hand-ahead` pose `{ forearmTilt: 25 }`).
- **The sheet copies the key's record:** `lib_mountain_climbers.howto.mjs:65-80`. `handling.pose: RIGHT_POSE` (:198) and `handling.faults: FAULTS` (:199), and each fault pose is the right pose merged with the fault's change (:78).
- **The app types:**
  - `HandPose` is `src/howto/content-types.ts:78-90`;
  - `HandFault.pose` is `Partial<HandPose>` (:97);
  - `HandlingSpec.pose?` is `Partial<HandPose>` (:144);
  - the zoom's `hand.right?` is `Partial<HandPose>` (:237).
  HandPose has no `forearmTilt` or `cup`.
- **The generated chunk** ends `} satisfies BuiltHowTo;` (written by `gen/plates.mjs:93`; content patched in by `gen/content.mjs:128-140`). So every object literal in it gets TypeScript's excess-property check.

## The change (smallest)
Two optional readonly fields on `HandPose`, in the form of the view-only `rollDeg?` already there (:88-89, "'end-on' view only"). Plus one bullet in the header's list of additions (:8-24).

```ts
  /** 'end-on' view only: how far the little-finger end sits above the thumb end (+ = little finger higher). */
  readonly rollDeg?: number;
  /** 'palm-flat' key only (hands/view-palm-flat.mjs): forearm lean from vertical in degrees, + = the hand ahead of the shoulder. */
  readonly forearmTilt?: number;
  /** 'palm-flat' key only: the palm lifted about the heel in degrees, 0 = flat. */
  readonly cup?: number;
```

- **Measured in scratch with this change:** the two literals typecheck (exit 0).
- **A misspelt key is still refused:** `{ forearmTil: 25 } satisfies Partial<HandPose>` under `// @ts-expect-error` stays an error, so the directive is used and tsc exits 0.

### Saved-data-neutral
- `content-types.ts` types the bundled, read-only How-to content. It is not the saved-data shape (`src/core/models.ts`, `src/core/store.ts`, migrations; AGENTS.md file ownership).
- Nothing is stored, sent or migrated, so the owner's approval for new kinds of saved data does not apply.
- Interfaces emit no JavaScript, so no bundle byte, generated file or APK byte moves.
- `content-types.ts` is in no MANIFEST row (0 hits in `tools/plates/library/MANIFEST.json`) and in no generator's inputs (grep of `tools/plates/gen`). No test pins its bytes.

### Rejected options
- (a) **Strip `forearmTilt` and `cup` in the generator** (`gen/content.mjs`). The chunk would no longer equal the sheet, and the drawn hand's pose numbers would be lost from the app data. It also changes a generator, so headers move (D-PFS-HEADERS).
- (b) **A `PalmFlatPose` union** on `HandFault.pose`, `HandlingSpec.pose` and `hand.right`. More lines, and every reader must narrow, for the same effect.
- (c) **An index signature** (the `PoseOverride` form, :220). This loosens the excess check for every row, so a misspelt key would pass. Refused: never loosen.
- (d) **Edit mountain_climbers' sheet** to drop the fields. That breaks D-SHIP-GRIP (a)'s pin of the sheet's record against the live key (`lib-ship.test.ts`; sheet :62-64), and it moves the card W9 carries.

## Rulings asked
1. **Q-PF-1: two optional fields on HandPose** (the `rollDeg?` form), not a union or a generator change.
   - Recommended: yes. It is the smallest change, it emits nothing, and it keeps the excess check strict.
2. **Q-PF-2: the drift guard reads the key, not a copy.** A vitest asserts that the type-checked key list equals the pose keys the palm-flat key and view actually use: `Object.keys(PALM_FLAT_DEFAULT)`, plus every `VARIANTS.floor.faults[*].pose` key in `hand-palm-flat.mjs`. A new palm-flat pose key then fails until the type follows.
   - Recommended: yes.
3. **Q-PF-3: no other hand view is widened here.** A future view with its own pose keys gets its own card.
   - Recommended: yes.

## Scope and write_scope
- `src/howto/content-types.ts`: the two fields after `rollDeg?` (:89), plus one header bullet. Nothing else. This is a src/ change, so call it out in the PR (AGENTS.md: the smallest change).
- A new `tests/howto/f-palmflat-apptype.test.ts`. tsconfig includes `tests`, so `npm run typecheck` checks it.
- Never touch:
  - `gen/**`; `hands/**`; any `howto/**` sheet; specs; golden pages and pins; `MANIFEST.json`; batch stages (W9's);
  - `src/core/**`, `src/slices/**`, `src/app/**`, `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `package*.json`;
  - `escobar-worker/**`, `native/wear/**`, signing and keystores.

## Steps (every step spelled out)
1. Read `.claude/skills/builder/SKILL.md`. Branch `claude/f-palmflat-apptype` from origin/main. Open a draft PR 'F-PALMFLAT-APPTYPE'.
2. Write `tests/howto/f-palmflat-apptype.test.ts` with:
   - `export const PALM_FLAT_POSE_KEYS = ['forearmTilt', 'cup'] as const satisfies readonly (keyof HandPose)[];`
   - the two literals above, as `satisfies HandFault` and `satisfies HandlingSpec`, built from `PALM_FLAT_DEFAULT`'s numbers;
   - `// @ts-expect-error` on `{ forearmTil: 25 } satisfies Partial<HandPose>`, and on `{ forearmTilt: '25' } satisfies Partial<HandPose>`;
   - one vitest `it` that imports `PALM_FLAT_DEFAULT` from `view-palm-flat.mjs` and `VARIANTS` from `hand-palm-flat.mjs`, and asserts that the sorted union of their pose keys equals the sorted `PALM_FLAT_POSE_KEYS` (Q-PF-2).
3. Run `npm run typecheck` on the base and post the red lines: TS2322 on the key list (`'"forearmTilt"' is not assignable to type 'keyof HandPose'`, reproduced in scratch), and TS2353 on the literals.
4. Post `F-PALMFLAT-APPTYPE PLAN @ <sha>` with the red, the exact lines, and the dry-run recipe (step 6). Wait for 'F-PALMFLAT-APPTYPE PLAN RULED'.
5. Add the two fields and the header bullet. Run `npm run typecheck`, the new test, `npm test -- tests/howto` and `node tools/plates/generate.mjs --check`.
6. **Scratch dry run** (never committed). Use the W8c recipe (6895186807):
   - in a scratch worktree, apply W8c's three mountain_climbers changes (lib-ship-w8c-card.md, "What each id needs");
   - flip it with a scratch stamp and a provisional pilot-a page entry;
   - run `node tools/plates/generate.mjs`, `npm run typecheck` and `npm run build`.
   Post the exit codes. If a second type error appears, post it (Stops).
7. Merge origin/main with a merge commit. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once. Post `F-PALMFLAT-APPTYPE READY @ <full sha>`.

## Acceptance
| id | check | evidence |
|---|---|---|
| P1 | The palm-flat literals and the key list typecheck. On main: TS2322 and TS2353 (exit 2) | `npm run typecheck`, red on the base and green after |
| P2 | Still strict: both `@ts-expect-error` lines are used, so a misspelt key and a wrong type stay errors | `npm run typecheck` |
| P3 | Drift guard: the view's and key's pose keys equal `PALM_FLAT_POSE_KEYS` | the vitest |
| P4 | The scratch flip of mountain_climbers: generate, typecheck and build exit 0 | posted output |
| P5 | Nothing else moves: the diff is `content-types.ts` plus the new test; `generate --check` is clean; MANIFEST is unchanged; the `npm run build` output hashes are unchanged except where the merge of main moves them | `git diff --stat`; command output |
| P6 | The READY head contains the latest main; check, test:tz, the gate and CI are green | CI links |

## Mutations
Each must turn a named check red. Post the red lines.

| id | mutation | red |
|---|---|---|
| m1 | remove `cup?` | P1 (TS2353 `cup`; TS2322 on the key list) |
| m2 | type `forearmTilt?: string` | P1 (TS2322), P2 (the wrong-type directive is unused, TS2578) |
| m3 | add `readonly [key: string]: unknown` to HandPose | P2 (TS2578, unused directive) |
| m4 | add a pose key to a scratch copy of `VARIANTS.floor` faults | P3 |

## Rules
- PLAN first, then READY. A fresh Opus reviewer follows READY.
- **Never loosen a check:** no index signature, no `any`, no `@ts-ignore`, no `skipLibCheck` change.
- **No flip here (the D-RP-NOFLIP form).** W9 flips mountain_climbers with its round-2 check.
- No closing keywords in commits or the PR body.

### Stops
- The scratch flip shows a second type error in `ht-mountain-climbers.ts`, or in its handpair or posture chunk. Post it with file:line, and do not widen another type without a ruling.
- Any bundle, generated or MANIFEST byte moves.

## Risks
- **A hidden second error.** TypeScript reports one unknown key per literal, so `cup`, or another field, may surface after `forearmTilt`. Mitigation: P4's real scratch flip, and the Stops.
- **The type drifts from the key.** Mitigation: P3 reads the live key and view.
- **W9 timing.** Mitigation: about half a day. If it misses LAYERS READY, mountain_climbers waits for W10 (W9 S4).

## Forecast [est]
- PLAN 1 h, build and tests 1 h, scratch dry run 1-1.5 h, CI about 94 min, review 1 h. **READY in about half a day, merged in about 1 day.**
- Uncertainty: P4 finding a second error.

## Not verified
- The real generated `ht-mountain-climbers.ts` after the change. Only the two mirrored literals were type-checked here.
- That no runtime code reads `handling.pose` for palm-flat rows. The grep of `src/` (outside `generated/`) found `HandPose` only in `content-types.ts`.
- That the drift test can import `hand-palm-flat.mjs` in vitest without its view files' closure problem. The sheet's comment (:62-64) says the key module reads files outside the MANIFEST-locked trees. If the import fails, the test reads `view-palm-flat.mjs` alone and the fault keys from the sheet's pinned copy, and the PLAN says so.

## Supervisor rulings (2026-11-16; these win over the text above)
All three are accepted as recommended:
- **D-PF-TYPE** (Q-PF-1): two optional HandPose fields. This is type-only and changes no saved data, so no owner approval is needed.
- **D-PF-DRIFT** (Q-PF-2): the drift guard reads the key itself.
- **D-PF-SCOPE** (Q-PF-3).

Show tsc red before and green after, and show that a misspelt key is still rejected. `src/howto/content-types.ts` is app source; call it out in the PR.

