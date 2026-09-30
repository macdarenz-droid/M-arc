# Common to every HT card

Every card below says "common" for a field when this text applies.

- **base:** the current `origin/main` SHA when the card starts (fba3f37 today), or the named parent card's pushed head when the card is stacked. Merge `origin/main` with a merge commit before asking for review.
- **reserved_paths (common):**
  - `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, and the Watch-lab row in `Settings.tsx`;
  - `escobar-worker/**`, `.github/**`, `scripts/prepare-android.sh`, `native/patch_manifest.py`;
  - every signing, keystore and `EXPECTED_SHA256` step;
  - `package.json`, `package-lock.json`;
  - `src/core/models.ts`, `src/core/store.ts`, migrations;
  - `src/app/App.tsx`, `src/main.tsx`;
  - `tests/howto/golden/**`, `tools/plates/vendor/**` and `tools/plates/layers/**`, except in the card that creates them or in a PR titled "golden update";
  - other tasks' blocks in `scripts/screenshot-gate.mjs` and `tests/theme.test.ts` (add-only; FG-OFF is edited only by HT-3 under D-HT1);
  - the generator core `tools/plates/{generate.mjs, lib/**}` after HT-2 (plugins are found by glob, so no card adds a registry line), and generated files written by another card's plugin;
  - `tools/plates/fidelity/goldenB.mjs` except in HT-4 and HT-4b (layer cards only call its state driver);
  - every path not in the card's `write_scope`.
- **G0, "approved plates unchanged against golden":** a criterion on every card from HT-2 on.
  - L0 and L2 are green.
  - From HT-3 on, the HT-3 gate block is green on the PR head, with its L2b, F3, L3 and L4 checks.
  - Nothing changed under the golden paths unless the card is a golden update.
- **connectivity (common):**
  - All How-to content is static, bundled and offline.
  - No new stored or sent user data: no store field, no localStorage key, no network call.
  - No new dependency.
  - The engine runs only at build time, in Node 22.
- **verification (common):**
  - While building, run the card's focused tests.
  - Before "[ready for review]": merge `origin/main`, then run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` on that exact head.
  - Prove that each new test bites: break the code it covers, see the test fail, restore it. List these mutations in the PR.
  - Re-read the diff against `write_scope` and `reserved_paths`.
- **return (common):**
  - the PR URL and head SHA;
  - the changed paths;
  - evidence per criterion id;
  - the mutation table;
  - measured numbers (sizes, timings);
  - what needs a real phone;
  - open risks.
- **Hard cards** post a short design note on the PR before bulk building. The supervisor reads it the next tick.
- **Reviewer:** a fresh Opus session, which checks the diff against the card and the plan. Builders never approve their own work.
- **Golden B is the only reference for the new layers.** A layer card never ships a text, timing or behaviour that golden B does not have, and has no "declared differences" list. A needed change goes into golden B first (plan 2.8), then the card compares `===` / L3 against the new pin.
- **Plan:** `htplan/HOWTO-BUILD-PLAN.md`, with sections 2.7 (fidelity), 2.9 (budgets) and 3 (D-HT1).
- **Merge order:** HT-1 → HT-2 → HT-4 → HT-3 → HT-3b → HT-4b → HT-5 → HT-6 → HT-7 → HT-8 → HT-9 → HT-10. HT-4b (LR-23) merges after HT-4 and before HT-5; HT-5 to HT-9 take LR-23 after it (D-LR23-6).

**Controls (supervisor, 2026-09-30):** any "no How-to" control reads the shared helper from HT-3 (the first library id in `exercises.json` order with no How-to), never a literal exercise id. The library plan ships more exercises, and a literal control would turn red.
