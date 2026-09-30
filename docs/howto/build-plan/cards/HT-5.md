# HT-5: Content generator for the 8 (from golden B), archetypes, push hints, content verification

Lane C · Sonnet · S-M · merge slot 6 (after HT-3b)

- **id:** HT-5
- **outcome:** The 8 approved exercises get their How-to content for every new layer (grips, posture, handling mistakes, feel, setup, risks; sources are generated as research data only), **generated** from the vendored golden-B `*.howto.mjs`. Nobody types the content a second time, so the app text equals golden B by construction (critic fix 5). The content checks pass on the generated content, and the plate strings stay unchanged.
- **base:** HT-2's and HT-4's pushed heads (merge both), then main after HT-4 merges. LR-23 (D-LR23-6): merge main again after HT-4b merges and regenerate.
- **depends_on:** HT-2 (generator core, `BuiltHowTo`), HT-4 (vendored layers, `content-types.ts`, checks), HT-4b (the LR-23 re-vendor, C17 rewrite and C19), S-2 (critic fix 6).
- **read_first:**
  - the vendored golden-B `layers/exercises/*.howto.mjs` and the shared RED_FLAG/DISCLAIMER module;
  - GA section 4 (data model) and appendix A;
  - the verified research cards `grip/research/*.json` and `GENERAL.md` (for the verification pass);
  - the plan, sections 2.2 (generated-file ownership), 2.3 and 5 (O2; O3 is closed by LR-23);
  - `docs/howto/LR23-PLAN.md` (branch `claude/lr23-plan`), section 8 "HT-5" and its AMENDMENTS.
- **write_scope:**
  - `tools/plates/gen/content.mjs` (found by glob; no registry line);
  - the regenerated `src/howto/generated/ht-<slug>.ts` (content fields only) and `src/howto/ids.ts` (adds `HOWTO_HINTS`);
  - the generated `src/howto/archetypes.ts` (`RED_FLAG`, `DISCLAIMER`; no `SHOW_EVIDENCE`, LR-23);
  - `docs/research/howto/{sources.json, <id>.json}` (generated from the golden-B `SOURCES`);
  - `tests/howto/content-gen.test.ts`.
- **reserved_paths:** common, plus `src/slices/**`, `tools/plates/gen/plates.mjs`, and every golden-B file (a text fix goes into golden B first, plan 2.8).
- **acceptance:**
  - **HT5-A1 (generated, not typed):** `gen/content.mjs` maps each vendored `<slug>.howto.mjs` (minus its `plate`) to `HowToContent`, and the output ends in `satisfies BuiltHowTo`. Every user-visible string in the output is `===` to the string in golden B.
    - Failure paths: hand-editing a generated text field fails freshness (per-file `inputsSha256`); a mapping that drops a golden-B field fails the field-coverage test (every key the golden-B specs use is mapped or listed as page-only in the design note).
  - **HT5-A2 (checks):** C1-C4, C6-C8, C16 (data), C17 and C19 pass on the generated content of all 8. Every source carries `access` and `checked` (no nulls). A failure here is a golden-B defect: report it to the supervisor for a golden-B update; never patch the app copy.
  - **HT5-A3 (plates unchanged):** after regeneration, L2 (HT2-A1) still passes for every plate string, and every header is fresh.
  - **HT5-A4 (hints; critic fix 8):** `ids.ts` exports `HOWTO_HINTS`, holding golden B's `handling.cue` for push-archetype exercises with an approved plate (the chest press today: "Push with the heel of your hand."), and nothing for others. `ids.ts` stays ≤ 2,048 B with the hints counted. The main content probe exempts exactly the `ids.ts` exports.
  - **HT5-A5 (shared red flags, one disclaimer):** `archetypes.ts` is generated from golden B's shared module (`howto/shared.mjs` at the pinned golden B):
    - the red-flag blocks `RED_FLAG` (wrist), `RED_FLAG_SHOULDER`, `RED_FLAG_KNEE` and `RED_FLAG_ELBOW`, byte for byte;
    - `DISCLAIMER` exactly the owner's line "General guidance, not medical advice. If something hurts, stop and get it checked." (owner decision 2026-09-30; O2 closed).
    No content row has its own red-flag wording (C8).
  - **HT5-A7 (LR-23, owner 2026-09-30):** `content.mjs` stops emitting `SHOW_EVIDENCE`, and `content-gen.test.ts` asserts `expect('SHOW_EVIDENCE' in archetypes).toBe(false)`. The C17 caller is updated to HT-4b's signature (no `allowedUrls`). `docs/research/howto/{sources.json,<id>.json}` stay as research data. Source ids in `ht-*.ts` are not trimmed: they are unrendered data, and C19 (c) blocks `url` and `cite` keys under `src/howto/generated`.
    - Failure path: re-emitting `SHOW_EVIDENCE` fails the test and C19 (a).
  - **HT5-A6 (sizes):** each base chunk is ≤ 150 KB raw / 36 KB gz (measured list), and the HT-3b footprint probe stays green.
  - **G0.**
- **design_reference:** golden B; GA section 4 and appendix A.
- **connectivity:** common. No URL is ever written under `src/`; source URLs live only in `docs/research/howto/`.
- **verification:** common, plus a fresh reviewer who reads each of the 8 generated contents against its research card and lists any disagreement for a golden-B update.
- **risk_and_recovery:**
  - If golden B and a research card disagree, the fix goes into golden B (plan 2.8) and HT-5 regenerates. The app never carries a text golden B does not have.
  - A medical-sounding claim goes to the owner's review list (O1).
  - If the design note finds a golden-B field with no place in `HowToContent`, HT-4's types get it in a small fix PR; never drop a mockup field.
- **return:** common, plus the reviewer's disagreement list (empty, or sent to the mockup lane).
