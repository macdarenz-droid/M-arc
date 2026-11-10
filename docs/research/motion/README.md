# Motion research

Research for the 3D motion guide (`docs/FORM-GUIDE-ARCHITECTURE.md`), one pair of files per exercise, made 2026-10-02.

- `<lib_id>.json`: equipment to model and its parts and sizes, setup steps, posture at start, middle and end, grip, range and tempo, breathing, muscles (app `MuscleId`s), mistakes, key facts, visual references, open questions, sources (with what was actually read).
- `<lib_id>.verify.json`: an adversarial check of every claim (`confirmed`, `corrected`, `unverified`, `refuted`) and a list of what would look wrong if animated as written. Where the two disagree, the verify file wins.

Status: 8 exercises, 432 claims checked: 300 confirmed, 83 corrected, 48 unverified, 1 refuted. Main correction across all 8: literature joint angles do not fit a real machine together, so poses are solved from the equipment geometry (IK), not keyed from angles.
