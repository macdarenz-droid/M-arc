# Escobar throughout M/ARC: Sonnet Medium execution package

Prepared 2026-09-21 against application baseline `564df825a281eb1c95cf71ab8bc82355b4f3c900`.

This package turns the Garmin-inspired concept into bounded implementation work for **Claude Sonnet at Medium effort**. It is documentation, not a claim that these new features have shipped. The earlier Escobar roadmap (F0 and features 1–14) is complete and remains the baseline.

Start with [HANDOFF.md](HANDOFF.md). Execute the ordered patches in [02-IMPLEMENTATION-WORKFLOW.md](02-IMPLEMENTATION-WORKFLOW.md), obey the contracts in [01-ARCHITECTURE.md](01-ARCHITECTURE.md), and prove the cases in [03-REGRESSION-MATRIX.md](03-REGRESSION-MATRIX.md). Maintain [PROGRESS.md](PROGRESS.md). The supporting product research is [00-CONCEPT-AND-RESEARCH.md](00-CONCEPT-AND-RESEARCH.md).

The result in plain words:

- One quiet Escobar presence across the app, with a shared conversation and useful local explanations.
- Steady or Direct wording, with identical facts and training decisions.
- Workout feedback that separates an achievement from following the agreed plan.
- Accepted adjustments respected; missing information described honestly.
- An optional personal objective and reviews using actual recorded evidence.
- Regression checks, review, branch commits, exact-commit CI and a downloadable APK included in completion.

There are nine implementation patches, preceded by baseline verification and followed by a final integrated audit. This is an execution workflow for a coding agent, not a new GitHub Actions YAML file or a change to the app's runtime AI model. The existing `M/ARC gate` remains the release gate.

These requirements reduce regression risk; no workflow can guarantee the absence of all bugs. A failed test, unresolved correctness finding or missing final artifact prevents a completion claim.
