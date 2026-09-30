# Research card v2 (library How-to)

This follows docs/howto/library/inputs/content.md section 3.2. There is one JSON file per exercise, `cards/<id>.json`, where `<id>` is the exercises.json id without the `lib_` prefix. Cards hold facts and claims, not user copy: the sheet's words are written later, under the copy lint.

```jsonc
{
  "id": "dumbbell_bench_press",           // no lib_ prefix
  "libId": "lib_dumbbell_bench_press",
  "name": "Dumbbell Bench Press",
  "family": "BENCH",                       // template family or pattern, as in the library plan (6.1/6.2)
  "tier": "A",                             // from census.json
  "archetype": { "hand": "press-dumbbell", "contact": ["palm-heel"] },   // GA section 3 and appendix B names
  "parent": null,                          // or the parent card id (difference card)
  "inherit": [],                           // children only: [{ "field": "grip.thumb", "why": "true for this child because ..." }]

  "claims": [
    { "id": "c1", "text": "plain fact, one sentence",
      "tags": ["DATA"],                    // DATA | MECH | CONSENSUS | WEAK (combine only as the 8 do, e.g. ["MECH","WEAK"])
      "sources": ["acsm-bench"],
      "quotes": [{ "source": "acsm-bench", "text": "<= 50 verbatim words", "where": "abstract | section name | paragraph" }] }
  ],
  "sources": [
    { "id": "acsm-bench", "url": "https://...", "title": "...", "kind": "guideline | peer-reviewed | coach | textbook",
      "year": 2021, "pmid": null }         // the fetcher adds "access" (full|abstract|summary|unreachable) and "checked" (ISO date)
  ],

  "plate": {                               // what the Technical Plate needs (golden-A standard)
    "view": "side | front | three-quarter", "viewWhy": "claim id or reason",
    "equipment": "what is drawn, positions that matter (bench angle, bar height)",
    "start": "joint positions in words and rough angles, each with a claim id",
    "end": "the same, for the end position",
    "checkpoints": [                       // exactly 3, the top form checkpoints; they become callouts
      { "label": "1-3 words", "what": "what it means", "claim": "c2" } ],
    "mistake": { "what": "the single most common fault the engine can draw from this view",
                 "why": "why it is common or risky", "claim": "c5",
                 "drawable": true },       // false when the top fault needs a view the plate lacks: then name the most common drawable fault
    "tells": [ { "text": "how you know you are doing it right (<= 8 words)", "claim": "c6" } ],   // 1-3
    "tempo": { "up": 1, "down": 2, "pause": 0, "claim": "c7" },
    "variantLine": null                    // when exercises.json lists two kinds of equipment: which one is drawn, and which claims hold for both
  },

  "grip":  { "type": "", "width": "", "thumb": "", "handContact": "", "wrist": "", "claims": [] },
  "setup": [ { "step": "", "claim": "" } ],              // up to 5
  "posture": [ { "point": "", "claim": "" } ],           // up to 6
  "handlingMistakes": [ { "mistake": "", "fix": "", "claim": "" } ],   // up to 3, most common and most risky first
  "feel": { "primary": [ { "muscleId": "", "claim": "" } ], "secondary": [], "watch": [],
            "rows": [ { "where": "", "means": "", "fix": "", "claim": "", "redFlag": null } ] },  // up to 4
  "risks": [ { "risk": "", "claim": "" } ],              // up to 3
  "redFlags": [ "wrist" ],                               // shared blocks: wrist | shoulder | knee | elbow | back (new)
  "zooms": [ { "key": "", "kind": "hand | posture", "right": "", "wrong": "", "claim": "" } ],   // 2-4
  "libraryDiff": { "add": [], "remove": [], "why": "" },  // muscles vs src/data/exercises.json, with a reason each
  "anchorSource": "id of at least one exercise-specific technique source read in full"
}
```

The rules:
- Every factual line points to a claim, and every claim has at least one source with a verbatim quote of at most 50 words. There are no free-text citations.
- Every listed source is cited by at least one claim, so there are no orphan sources.
- Muscle ids come from `src/data/muscles.ts` on main. `core`, `brachialis` and `rotator_cuff` are text-only.
- Never infer from another exercise without saying so in the claim, with the tag `MECH` or `WEAK`.
- Tier-A exercises (spinal loading, overhead, high skill) carry the safety points the safety checker will look for:
  - safeties or J-hooks where they apply;
  - a bar path clear of the neck;
  - load progression.
