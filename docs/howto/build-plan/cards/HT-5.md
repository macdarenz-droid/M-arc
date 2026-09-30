# HT-5: Content generator for the 8 (from golden B), archetypes, push hints, content verification

Lane C · Sonnet · S-M · merge slot 6 (after HT-3b)

- **id:** HT-5
- **outcome:** The 8 approved exercises get their How-to content for every new layer (grips, posture, handling mistakes, feel, setup, risks, sources), **generated** from the vendored golden-B `*.howto.mjs`. Nobody types the content a second time, so the app text equals golden B by construction (critic fix 5). The content checks pass on the generated content, and the plate strings stay unchanged.
- **base:** HT-2's and HT-4's pushed heads (merge both), then main after HT-4 merges.
- **depends_on:** HT-2 (generator core, `BuiltHowTo`), HT-4 (vendored layers, `content-types.ts`, checks), S-2 (critic fix 6).
- **read_first:**
  - the vendored golden-B `layers/exercises/*.howto.mjs` and the shared RED_FLAG/DISCLAIMER module;
  - GA section 4 (data model) and appendix A;
  - the verified research cards `grip/research/*.json` and `GENERAL.md` (for the verification pass);
  - the plan, sections 2.2 (generated-file ownership), 2.3 and 5 (O2, O3).
- **write_scope:**
  - `tools/plates/gen/content.mjs` (found by glob; no registry line);
  - the regenerated `src/howto/generated/ht-<slug>.ts` (content fields only) and `src/howto/ids.ts` (adds `HOWTO_HINTS`);
  - the generated `src/howto/archetypes.ts` (`RED_FLAG`, `DISCLAIMER`, `SHOW_EVIDENCE = true`);
  - `docs/research/howto/{sources.json, <id>.json}` (generated from the golden-B `SOURCES`);
  - `tests/howto/content-gen.test.ts`.
- **reserved_paths:** common, plus `src/slices/**`, `tools/plates/gen/plates.mjs`, and every golden-B file (a text fix goes into golden B first, plan 2.8).
- **acceptance:**
  - **HT5-A1 (generated, not typed):** `gen/content.mjs` maps each vendored `<slug>.howto.mjs` (minus its `plate`) to `HowToContent`, and the output ends in `satisfies BuiltHowTo`. Every user-visible string in the output is `===` to the string in golden B.
    - Failure paths: hand-editing a generated text field fails freshness (per-file `inputsSha256`); a mapping that drops a golden-B field fails the field-coverage test (every key the golden-B specs use is mapped or listed as page-only in the design note).
  - **HT5-A2 (checks):** C1-C4, C6-C8, C16 (data) and C17 pass on the generated content of all 8. Every source carries `access` and `checked` (no nulls). A failure here is a golden-B defect: report it to the supervisor for a golden-B update; never patch the app copy.
  - **HT5-A3 (plates unchanged):** after regeneration, L2 (HT2-A1) still passes for every plate string, and every header is fresh.
  - **HT5-A4 (hints; critic fix 8):** `ids.ts` exports `HOWTO_HINTS`, holding golden B's `handling.cue` for push-archetype exercises with an approved plate (the chest press today: "Push with the heel of your hand."), and nothing for others. `ids.ts` stays ≤ 2,048 B with the hints counted. The main content probe exempts exactly the `ids.ts` exports.
  - **HT5-A5 (one red flag, one disclaimer):** `archetypes.ts` is generated from golden B's shared module: one `RED_FLAG`, and `DISCLAIMER` exactly "This is coaching guidance, not medical advice." The PR flags the wording for the owner (O2). No content row has its own red-flag wording (C8).
  - **HT5-A6 (sizes):** each base chunk is ≤ 150 KB raw / 36 KB gz (measured list), and the HT-3b footprint probe stays green.
  - **G0.**
- **design_reference:** golden B; GA section 4 and appendix A.
- **connectivity:** common. Source URLs are plain text only.
- **verification:** common, plus a fresh reviewer who reads each of the 8 generated contents against its research card and lists any disagreement for a golden-B update.
- **risk_and_recovery:**
  - If golden B and a research card disagree, the fix goes into golden B (plan 2.8) and HT-5 regenerates. The app never carries a text golden B does not have.
  - A medical-sounding claim goes to the owner's review list (O1).
  - If the design note finds a golden-B field with no place in `HowToContent`, HT-4's types get it in a small fix PR; never drop a mockup field.
- **return:** common, plus the reviewer's disagreement list (empty, or sent to the mockup lane).
