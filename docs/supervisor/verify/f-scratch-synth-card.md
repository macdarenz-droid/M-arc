# F-SCRATCH-SYNTH: synthetic scratch ids for the LIB-4b and LIB-4c sets

Status `ready` (supervisor, 11-05 ~03:10 UTC). Source: the SHIP W7 PLAN ruling, Q-W7-8 (#394 6647954465, D-SHIP-W7-SCRATCH). Base: latest origin/main. Model: Opus.

## Problem
A scratch or fixture target that already has a `batches/` row makes the registry throw (D-LIB-SCRATCHIDS; registry.mjs:34-35, :52; rows of every stage count). Once W3-W7 move their rows, no library id is a clash-free target. Two sets still name real library ids:
- LIB-4b: `tools/plates/library/fidelity/fixture.mjs:27-29` (underhand_lat_pulldown, chest_supported_row, cable_chest_press);
- LIB-4c: `tools/plates/library/ci/scratch.mjs:21-26` (jumping_jacks, one_arm_dumbbell_row, t_bar_row, landmine_row, sled_push, smith_machine_incline_press).

CI stays green, but a tree rebuilt by those CLIs throws. W3's Q-W3-6 swap is folded into this card.

## Goal
Both sets use synthetic ids in the D-LIB8M-SCRATCH7B form, as lib7b already does for lib_scratch_pull_row (`tests/library/fixtures/lib7b/fixture.mjs:3-5, :18, :28-33, :47-55`):
- a synthetic id is added only to the temp tree's `exercises.json` and `coverage-archetypes.json`, as a `copyOf` a real id's spec and card;
- it is refused if it is in the real `exercises.json` or is a `batches/` row.

Every current check stays for every other entry.

## Files it may touch (write_scope)
- `tools/plates/library/ci/scratch.mjs` (copyOf entries, `setProblems`, `TAKEN`), `tools/plates/library/fidelity/fixture.mjs` (its 3 targets);
- the test lines that name those ids, renamed and listed (lib11-pilot-b.test.ts:352-355, lib8r-pilot-a2.test.ts:338-340, lib8r-pilot-a3.test.ts:598-600, lib-5v.test.ts:132-141, and any other use you find by grep);
- one new test file.
- Never: the real `exercises.json`, batches, sheets, specs, pages, cards, CI workflows.

## Acceptance (each red with a mutation)
- A target in any of the three sets (lib7b, LIB-4b, LIB-4c) that has a `batches/` row on the head is red. Mutation: lib_hip_thrust as a target.
- A `copyOf` id that is in the real `exercises.json` is red.
- The old `setProblems` refusals stay red at the listed lines.
- Both CLIs rebuild their tree on today's main and after a scratch move of every W3-W7 row (show both).
- If `transformSources` or `copyProblems` refuse a synthetic id (lib-5v.test.ts:132, :141), stop and post `F-SCRATCH-SYNTH QUESTION` before changing either.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Steps
1. Read `.claude/skills/builder/SKILL.md`, this card and the Q-W7-8 ruling. Make branch `claude/f-scratch-synth` from origin/main, with a draft PR. Post `F-SCRATCH-SYNTH PLAN @ <sha>` and wait for the ruling.
2. Build, then post `F-SCRATCH-SYNTH READY @ <full sha>`. A fresh reviewer follows. It merges before W7, and whichever of it and a wave lands second keeps both sides.
