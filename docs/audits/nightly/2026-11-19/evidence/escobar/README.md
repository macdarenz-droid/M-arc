# Escobar evidence

Audited application commit: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`.

`probes-output.jsonl` and `ui-leaf-probes-output.jsonl` retain the original successful results. Source probes use `@/` for application imports and `@tests/` for existing fixture helpers. The build scripts resolve both aliases, TypeScript configuration, application version and esbuild from the **explicit checkout argument**. They do not depend on this report's directory depth or the auditor's original workspace.

Use a disposable checkout with its existing lockfile dependencies installed. These commands bundle and execute local synthetic probes only; they do not contact a model, deployed Worker or reporting endpoint. The scripts change synthetic in-process state and write bundles only to the supplied output directory (or an OS temporary directory when omitted).

From the repository root, with an absolute scratch output directory of your choice:

```sh
node docs/audits/nightly/2026-11-19/evidence/escobar/build-probes.mjs . /absolute/scratch/escobar
node /absolute/scratch/escobar/probes.mjs
node docs/audits/nightly/2026-11-19/evidence/escobar/build-ui-leaf-probes.mjs . /absolute/scratch/escobar
node /absolute/scratch/escobar/ui-leaf-probes.mjs
```

On Windows, use a path such as `C:/Temp/marc-escobar-audit` in place of `/absolute/scratch/escobar`. Quote paths containing spaces. Both build scripts print their output bundle path. Do not choose a production source directory for generated bundles.

The bug probes assert the **observed defect**, so a successful run reproduces it on the audited commit; those assertions should fail when a builder fixes the cause. Other cases check the named prior fixes. These are audit reproductions, not a replacement for production regression tests. Later commits may legitimately change behavior or fixtures; record their exact SHA separately.

`build-ui-leaf-probes.mjs` adds a test-only export for the otherwise private pure `LiftTrend` leaf while bundling. Its source logic is unchanged. The probe inspects Preact VNode children; it does not mount DOM, run interaction hooks, or prove browser/device behavior.

For the original Worker checks, from the checkout root:

```sh
node node_modules/typescript/bin/tsc --noEmit -p escobar-worker/tsconfig.json
cd escobar-worker
node node_modules/vitest/vitest.mjs run --maxWorkers=2
```

The Worker suite uses fake provider and storage interfaces. Its dependencies must be installed from `escobar-worker/package-lock.json`; the original audit reused an installed dependency directory only after exact lockfile identity was verified.

`make-coverage.mjs <checkout>` can rebuild the inventory beside this evidence, using TypeScript from that checkout. It refuses a different application commit because the human review notes belong to the recorded SHA. Its function/call extraction is a navigation aid, not runtime coverage. `write-evidence-manifest.mjs` refreshes evidence hashes beside itself.

Relocation was verified by copying only the two probe sources, their two entry build scripts and `probe-build.mjs` into a separate directory with the final `docs/audits/nightly/2026-11-19/evidence/escobar` layout, then building against the pinned checkout from an unrelated working directory. Both bundles exited 0 and reproduced the original JSON records. See `portability-verification.json`; original outputs were preserved. Generated `.mjs` probe bundles are disposable and need not be published.
