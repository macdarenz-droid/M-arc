# In-chat Workflows

An in-chat Workflow is a script run by the supervisor's session with the Workflow tool. The script starts many agents, in parallel where that helps, and returns one result to the supervisor.

## What they are for here

**Hard judgement only.** Research, rating, analysis of a proposal, a root-cause hunt: places where independent views plus a judge beat one view. Examples so far: the app rating (`docs/research/app-rating/`), the Gym Finder review (`docs/research/gym-finder/`), the HT-7 root cause (below).

**Never builds.** Code is built by one builder session per card on a `claude/*` branch, reviewed by a fresh reviewer (see `docs/supervisor/HANDOVER.md` and `.claude/skills/builder/SKILL.md`). A Workflow does not commit, push or comment on a PR. Early in this project a few Workflows did build code; do not copy that.

**Models and cost.** Agents inherit the session model. Use a Workflow only when the question is hard enough to be worth several agents (`AGENTS.md`: never add agents that duplicate each other). Do the small things yourself.

## Shapes that worked

- **Lenses and a judge** (HT-7 root cause): four agents each read the evidence through one lens and return ranked hypotheses; one judge verifies the strongest claims against the code and returns a ranked list, an experiment plan and fixes.
- **Parallel readers, then a red team** (Gym Finder): three agents answer three questions about the same proposal (what it is, how it fits the code, what outside rules apply). A fourth attacks the supervisor's plan.
- **Two parallel researchers** (app rating): one reads the code, one reads the market.

Each agent prompt names the repo, says "read only", and asks for file paths for every claim and "not verified" for anything unchecked.

## How to run one

1. Read the script and its `args` file. Update `args` (for HT-7: the current PR head and the newest evidence).
2. Call the Workflow tool with `script` set to the file's text (or `scriptPath` set to the file) and `args` set to the JSON object. Pass `args` as a real JSON object, not as a string.
3. The result gives a run id and a transcript folder. `journal.jsonl` in that folder holds each agent's return value; read it if a result looks empty. The supervisor saved the Gym Finder and rating results from there.
4. To continue after a pause or a script edit, relaunch with `scriptPath` and `resumeFromRunId`. The unchanged start of the script is served from cache.
5. Save the outcome in the repo: a research folder for a research result, or an addendum to the card or ruling for a decision. Do not leave it in chat only.

Scripts cannot use `Date.now()`, `Math.random()` or a bare `new Date()`. Pass any time in through `args`.

## Scripts in this folder

| File | What it does | State |
|---|---|---|
| `ht7-label-variance-rootcause.js` | HT-7 (#119): the "Bony bump" SVG label in the posture close-up sometimes lays out 25.2705 wide instead of 25.3114, which fails the L3 pixel check against golden B (881 px). Four lenses (SVG text scaling, font cache, app environment, measurement harness) then a judge. Must keep L3 at 0 px, change no golden or plate, loosen no check. | **Result pending.** Run `wf_0d39b52a-1a0` (task `wo2y8z1e0`), launched 2026-10-01 08:04 UTC. |
| `ht7-label-variance-rootcause.args.json` | Its input: the HT-7 head `75fd1a2` and the builder's measured evidence (rates, failed fixes a to i, per-frame trace, font facts, environment). | Rerun with a newer head if HT-7 moves. |
| `marc-rating.js` | App rating: two read-only researchers in parallel (the code on main, the market). No args. Output: `docs/research/app-rating/`. | Done 10-01. |
| `gym-finder-review.js` | Gym Finder (#158): three read-only agents in parallel (proposal, codebase fit, external constraints). No args. Output: `docs/research/gym-finder/gf-0.md` to `gf-2.md`. | Done 10-01. Gym Finder is **parked**: no rerun without the owner's approval. |
| `gym-finder-redteam.js` | Gym Finder: one red-team agent attacks the draft plan. It reads its inputs from `origin/main:docs/research/gym-finder/`. Output: `docs/research/gym-finder/gf-redteam.md`. | Same as above. |

### HT-7 result

Pending. The supervisor appends here when the run ends: the top three hypotheses, the experiments run and their outcomes, the fix that shipped (or the decision if none could), and the ruling ID. Until then HT-7 is the critical path with no known fix; see `docs/supervisor/HANDOVER.md`, section 8.

## Other scripts from this session

Many other Workflows ran in this supervisor session (for example the How-to plans and plate critics, the architecture review ARCH-1, the library How-to architecture, the Escobar report plan). Their scripts live only in the session's folder on the current account and are lost on an account switch; they are not kept here. Their results are in the research folders, the cards and `docs/COACHING-DECISIONS.md`. To redo one, rebuild it from the shape above and the matching research README.
