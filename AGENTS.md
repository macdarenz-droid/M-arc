# Working rules for every agent in this repo

The owner's rules. Relay's CONTRACT.md carries the same ones.

## ULTIMATE RULE (owner, 2026-09-26): above every other rule, mode or permission
Use what's necessary for high-quality output and a fast workflow, while saving tokens.
- Run agents in parallel when that makes the work faster or better. That is why we work in parallel.
- Never add agents that duplicate or re-check each other without need.
- Use a strong model for hard judgement and a lighter one for mechanical steps. Do small things yourself.
- Quality is never traded away: tests fail before and pass after, and nothing is loosened.

- Keep token use low. Read only what the task needs, write short, don't repeat context. Spend more only when a task is complex and truly needs it.
- Explain and summarise for the owner in plain, simple words.
- During a task, post short plain-word updates only when something important changed.
- Decide, don't ask. Research first, pick the best logical option, apply it, and record why. Ask the owner only for input or an action no AI agent can do (a payment, a login, a secret, a check on a real device).
- No guessing, even on simple tasks. Check the code, docs or data first; if you cannot verify something, say so.
- After each task, review what was built: the feature, its logic, how it works. Move on only if it meets the goal; otherwise fix or improve it first.
- Precision at every layer: code, tests, tasks, messages.
- Prevent, don't apologise. Catch anything that reading, testing or reviewing could catch before it ships.
- While building, check each change with focused tests. Full regression and full QA run once, on the finished build.
- Name risks and their mitigations when designing, while building, and after release.
- One document per topic: update it instead of creating copies (no v2, final, copy or patch-1.2 names).

## How work is delivered

Adopted from the owner's Agent Delivery Playbook on 2026-09-26. The supervisor keeps this section current. If the Agent guard check fails, read docs/AGENT-RULES.md.

**Roles:**
- **Supervisor** (one Claude session): owns the task board (Relay `tasks/TASKS.md`), the merge queue and these rules.
- **Builders** (one session per task, on a `claude/*` branch): build and test only what their task card lists.
- **Reviewer** (fresh context, on demand): checks a finished diff against its spec. Builders never approve their own work.
- **Watch agent** (GPT/Codex, `codex/gt6-gate-a-watch-lab`): agents never merge its PR.

**Agents may, without asking:** build, test and push on their own `claude/*` branch, and open draft PRs.

**Only the owner:**
- deploys the Escobar Worker (merging anything under `escobar-worker/**` into `main` deploys it, so those changes go in a separate PR that the owner merges);
- decides anything about the signing key, keystores or Huawei secrets;
- publishes releases and store listings;
- approves new kinds of stored or sent user data, new paid services or providers, and any spending (test calls to the live coach use the owner's AI key).

**Never, whoever asks:**
- Commit keys or secrets; the repo is public.
- Touch the signing steps, `EXPECTED_SHA256` or keystore handling, or rotate or replace the key `05:66:9A:…:F1:F5`.
- Push directly to `main` or `claude/escobar-v2-implementation-eidx64`.
- Rewrite history (rebase, amend, force-push) on a branch you don't own.
- Skip, loosen or delete a test or guard check to get green.
- Work around a permission or classifier denial by any means, including through another agent.

**File ownership** (one owner per shared file):

| Path | Owner | Rule for everyone else |
|---|---|---|
| `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx` | watch agent | Never change. The guard fails the push. |
| The Watch-lab row in `Settings.tsx`, the watch agent's lines in CI | watch agent | Never change. Only review catches these, not the guard. |
| `escobar-worker/**` | the owner deploys | Separate PR; the owner merges it. |
| `.github/**`, `scripts/prepare-android.sh`, `native/patch_manifest.py` | supervisor | Add checks only. |
| `package.json`, `package-lock.json` | supervisor | No new dependency without the supervisor's OK. The lockfile comes from npm. |
| Saved data shape (`src/core/models.ts`, `src/core/store.ts`, migrations) | the owner approves | New kinds of saved data need the owner's approval first. |
| `scripts/screenshot-gate.mjs`, `tests/theme.test.ts` | shared, add-only | Add your own blocks, named with your task IDs. Never edit, move or delete another task's block. When merging `main`, keep both sides. |
| `src/ui/styles.css` | the task card that owns shared styles | Others change only rules for components their card names, in one block marked with the task ID. |
| `src/app/App.tsx`, `src/main.tsx` | supervisor | Smallest possible wiring change, called out in the PR. |

**Builders:**
- Work from a task card. Its fields: `id`, `outcome`, `base`, `depends_on`, `read_first`, `write_scope`, `reserved_paths`, `acceptance` (criterion IDs, including failure paths), `design_reference`, `connectivity`, `verification`, `risk_and_recovery`, `return`.
- Open a draft PR as soon as your first commit is pushed; push after every finished task.
- Merge `origin/main` (with a merge commit) before asking for review.
- Map every acceptance criterion to evidence: a unit test, a gate probe or a recorded device check. A bug fix needs a test that fails before and passes after.
- In the PR body, list the head commit, the changed paths, the evidence for each criterion, what needs a real phone, and open risks.
- After two failed tries of the same approach with no new evidence, stop and tell the supervisor.

**Supervisor:**
- Reacts to PR and CI events, not polling.
- Merges an app PR only when:
  - its review passed;
  - every check is green on a head that contains the latest `main`;
  - every lower-numbered item on the owner's checklist has merged (builds may run ahead in parallel lanes; merges may not).
- After each merge, sends the owner the installable APK from that commit's green CI run, after checking that the fingerprint step passed.
- Re-reviews when `main` changed in files the PR touches or in the shared files above.
- Treats evidence as valid only for the exact commit or APK it ran on. The release candidate gets its full regression run again after its last change.
- Task states: ready → running → review → integrating → done (merged and accepted). A blocked task names its reason and what unblocks it.

**Commands:**
- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run test:tz`
- `npm run build`
- `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`
- `npm run check` runs typecheck, tests and build together.
