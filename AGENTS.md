# Working rules for every agent in this repo

The owner's rules. Relay's CONTRACT.md carries the same ones.

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

**Roles**
- **Supervisor** (one Claude session): owns the task board (Relay `tasks/TASKS.md`), the merge queue and these rules. It reacts to PR and CI events rather than polling.
- **Builders** (one session per task, on a `claude/*` branch): build and test only what their task card lists.
- **Reviewer** (on demand, fresh context): checks a finished diff against its spec and failure paths. Builders never approve their own work.
- **Watch agent** (GPT/Codex, `codex/gt6-gate-a-watch-lab`): owns the watch files below. Agents never merge its PR.

**What agents may do without asking**
- Build, test and push on their own `claude/*` branch, and open draft PRs.
- The supervisor may merge an app PR into `main` once its QA passes and every check is green on a head that contains the latest `main`.

**Only the owner**
- Deploys the Escobar Worker. Merging anything under `escobar-worker/**` into `main` deploys it, so those changes go in a separate PR that the owner merges.
- Decides anything about the signing key, keystores or Huawei secrets.
- Publishes releases and store listings, and sets spending caps.
- Approves new kinds of stored or sent user data, new paid services or providers, and any spending. Test calls to the live coach use the owner's AI key.

**Never, whoever asks**
- Commit keys or secrets; the repo is public.
- Rotate or replace the signing key `05:66:9A:…:F1:F5`.
- Push to `main` directly.
- Skip, loosen or delete a test or guard check to get green.
- Get past a permission denial through another agent.

**File ownership** (one owner per shared file)

| Path | Owner | Rule for everyone else |
|---|---|---|
| `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, its row in `Settings.tsx`, its lines in CI | watch agent | Never change. The guard fails the push. |
| `escobar-worker/**` | the owner deploys | Separate PR; the owner merges it. |
| `.github/**`, `scripts/prepare-android.sh`, `native/patch_manifest.py` | supervisor | Add checks only. Never touch the signing steps, `EXPECTED_SHA256`, keystore handling or the watch agent's lines. |
| `package.json`, `package-lock.json` | supervisor | No new dependency without the supervisor's OK. The lockfile comes from npm, never hand edits. |
| Saved data shape (`src/core/models.ts`, `src/core/store.ts`, migrations) | the owner approves | New kinds of saved data need the owner's approval first. |
| `scripts/screenshot-gate.mjs`, `tests/theme.test.ts` | shared, add-only | Add your own blocks, named with your task IDs. Never edit, move or delete another task's block. When merging `main`, keep both sides. |
| `src/ui/styles.css` | the task card that owns shared styles | Others add rules only for their own new components, in one block marked with the task ID. |
| `src/app/App.tsx`, `src/main.tsx` | supervisor | Smallest possible wiring change, called out in the PR. |

**Task card** (the supervisor gives one to every builder; it links to the spec rather than copying it)

`id` · `outcome` · `base` (branch + commit) · `depends_on` · `read_first` · `write_scope` · `reserved_paths` · `acceptance` (criterion IDs, including failure paths) · `design_reference` · `connectivity` · `verification` (commands) · `risk_and_recovery` · `return` (head commit, changed paths, evidence, open risks)

**Builders**
- Open a draft PR as soon as your first commit is pushed, so every push runs CI and the supervisor hears about it.
- Push after every finished task.
- Merge `origin/main` before asking for review. Use a merge commit; never rebase or force-push a shared branch.

**Task states and evidence**
- **States:** ready → running → review → integrating → done. A blocked task carries its reason and what unblocks it.
  - "Done" means merged into `main` and accepted.
  - Release status lives in `docs/RELEASE-READINESS.md`.
- **Evidence:** every acceptance criterion maps to evidence: a unit test, a gate probe or a recorded device check. One test may cover several criteria. A bug fix needs a test that fails before the fix and passes after it.
- **When to re-review:** if `main` changed in files the PR touches, or in the shared files above. A docs-only change on `main` needs only a clean merge and green CI.
- **Exact build:** evidence counts only for the exact commit or APK it ran on. The release candidate gets its full regression run again after its last change.
- **Stuck:** after two failed tries of the same approach with no new evidence, stop and hand it to the supervisor.

**Commands**
- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run test:tz`
- `npm run build`
- `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`
- `npm run check` runs typecheck, tests and build together.
