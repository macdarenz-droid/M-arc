# Handoff card

- **id:** GF-HANDOFF
- **outcome:** Publish the existing theme-aware map prototype, research and builder specification in the repository, without implementing the production feature.
- **base:** `3d3e4e11abcd2527dfa48d0b76ff1d3e5e9751b2` on main.
- **depends_on:** Owner's map/theme design request; original and improvement audits remain separate references.
- **read_first:** `AGENTS.md`, builder skill and gotchas, this folder's README, existing Gym Finder research and theme QA.
- **write_scope:** `docs/gym-finder/**`, `docs/research/user-adaptation-research.md`, `docs/research/escobar-evolution-research.md`.
- **reserved_paths:** All production source, native code, Worker, app dependencies, CI, shared tests and root audit documents.
- **acceptance:** H1 runnable/source preview present; H2 current vs proposed features clear; H3 data acquisition and provenance documented; H4 five/future-theme mapping and QA present; H5 one builder entry page with audit links; H6 only declared docs/prototype paths changed and no secrets.
- **design_reference:** The owner-reviewed map/details concept in `prototype/source.html`.
- **connectivity:** Static preview uses CDN scripts/fonts. No live Places, pricing, location or Escobar integration.
- **verification:** Existing browser prototype checks in QA/theme notes; verify package links and exported source; verify published file hashes and changed paths. Full app build/regression is not claimed for this docs-only delivery. Keep PR draft for implementation planning/review.
- **risk_and_recovery:** Main risk is mistaking fixtures for production data; prominent labelling and explicit integration requirements address it. Removing this docs-only directory has no app runtime impact. Do not merge or deploy on the owner's behalf.
- **return:** Draft PR and exact README/source/spec links for the builder.
