# Library batch rows

One `<batch>.json` per batch or pilot (`{ "batch": "LB1", "rows": { "<lib id>": { "src", "slug", "prefix", "chromeId",
"mode": "H|P|T|D", "parent"?, "params"?, "stage" } } }`), read by `../registry.mjs` in file-name order. The approved 8
stay in `tools/plates/plates.json`. Stages: library plan section 1.
