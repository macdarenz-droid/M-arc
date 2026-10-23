# Research index

One folder per topic. Each folder has its own `README.md` with status, what each file is and how it was made. Update the folder, do not copy it (no v2 or final names). Never put secrets, keys, the Relay URL, emails or personal phone numbers here: the repo is public.

| Folder | Topic | Status |
|---|---|---|
| `gym-finder/` | Review, integration map, external constraints, red team and staged build plan for a Gym Finder feature. | **Parked by the owner**, 2026-10-01 07:30 UTC. Nothing starts without his approval. |
| `app-rating/` | M/ARC feature and build inventory at `f1e514a`, a competitor scan, and the rating the owner received. | Delivered 2026-10-01. A snapshot, not a task. |
| `first-audit/` | Supervisor triage of the Codex audit's P2 findings, and the card and PR for each of the 32 findings. | Done. |
| `howto/` | Generated How-to data (one record for each of 8 exercises, sources, reviews), written by `tools/plates/generate.mjs`. Do not edit by hand. | Used by the How-to lane (HT cards). |
| `motion/` | Motion upgrade (3D guide) research for the 8 Split 1 exercises: `<id>.json` is the research (equipment, setup, posture, grip, muscles, mistakes, key facts, sources) and `<id>.verify.json` is the adversarial fact check of every claim. Made 2026-10-02 by research and verifier agents. | Input to `docs/FORM-GUIDE-ARCHITECTURE.md`. Use the verify file's corrections over the research text. |

Supervisor tooling and past workflow scripts are not research: see `docs/supervisor/scripts/` and `docs/supervisor/workflows/`.
