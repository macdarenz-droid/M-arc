# M/ARC supervisor handover

This file lets a new Claude supervisor take over M/ARC from this file alone. The new supervisor may be on another Claude account.

The repo is **public**. Never put any of these in this file: secrets, tokens, passwords, keystore values, the Relay URL (its path holds an access token), email addresses or phone numbers. Secret *names* are fine.

---

## 0. How to use this file

**Last updated:** 2026-10-03 ~20:10 UTC · main `4aa1b2a` (train 12 #205) · RESUMED 19:08 (8.0c) · by supervisor session `session_01FTBsxoLN135B3HvJ7sT676`. Paused 06:30, resumed 08:35, takeover cancelled ~10:25: this supervisor continues (8.0b). Re-capture section 8 live right before each commit of this file.

- **First find the newest copy of this file. It may not be merged yet.** A handover update rides the next merge train, so `main` can be one update behind. Run:
  ```
  git fetch origin
  for r in origin/main $(git branch -r --list 'origin/claude/sup-handover-*' 'origin/claude/sup-merge-train-*' 'origin/ccr-*'); do
    echo "$(git log -1 --format=%cI $r -- docs/supervisor/HANDOVER.md) $r | $(git show $r:docs/supervisor/HANDOVER.md | grep -m1 '^## 8\.')"
  done | sort
  ```
  The last line names the newest copy; read that one. Sort by commit time, not by the "Last updated" line: the 06:00 copy left that line at 01:00. Until that copy merges, also read `docs/supervisor/PROMPTS.md`, `docs/supervisor/scripts/`, `docs/supervisor/workflows/` and `docs/research/` from the same branch (`git show <ref>:<path>`).
- The supervisor updates this file in **every merge train** and at least every 3 hours while work is moving, and after every new owner rule or decision. See section 11.
- The owner may move the work to his other Pro Max account at any time. Section 10 is the takeover plan.
- Sections 0–7 and 9–11 change slowly. **Section 8 (Current state) goes stale within hours.** Treat it as a map, then re-check everything live.
- Never reuse a SHA from this file for a merge. Get it live (`git rev-parse`).
- If this file disagrees with `AGENTS.md` on `origin/main` or with the owner's newest message, those win. Fix this file in your next update.
- If a supervisor skill file (`.claude/skills/supervisor/*.md`) disagrees with this file, this file wins for procedure. Fix the skill by PR (section 11, step 6). Known gaps: 7.6.

**Read in this order:**
1. Sections 1–4 of this file, in full (role, authority, owner rules, owner decisions).
2. `AGENTS.md` **from `origin/main`**: `git fetch origin && git show origin/main:AGENTS.md`. The local checkout may be older (see 7.6).
3. `.claude/owner-rules.md`, then `.claude/skills/supervisor/` (`SKILL.md`, `tick.md`, `cards.md`, `ship-apk.md`, `gotchas.md`), then `.claude/skills/builder/SKILL.md` and `.claude/skills/reviewer/SKILL.md`, then `docs/AGENT-RULES.md`. On main, the card fields, the builder self-check, the two-tries rule and the trigger lead time now live in these skill files, not in `AGENTS.md`.
4. Sections 5 and 6 here (how workers and parallel work are run, merge trains), then `docs/supervisor/PROMPTS.md` (the exact message texts: builder start, reviewer start, delta review, fixes, freeze, catch-up, ruling, defect routing, train PR body, owner messages).
5. `docs/supervisor/scripts/README.md` (the watcher scripts and how to run them) and `docs/supervisor/workflows/README.md` (the in-chat Workflow scripts kept for reuse).
6. Relay (the MCP server "2nd Supervisor M/ARC"): `CONTRACT.md`, `PROJECT_STATE.md`, the end of `LOG.md`, and the tracker. If the `…2nd_Supervisor_M_arc__*` tools are missing, ask the owner once to add the connector (only he can; its URL holds a token). Do not wait: run from GitHub and section 8. Keep the Relay LOG lines and tracker changes you owe as a "Relay backlog" list in section 8.5 of the next handover, and apply them when the tools appear.
7. Section 8 here, then check it live: open PRs, `list_sessions`, `list_triggers`, and CI.
8. Only when a task needs them: the plans and rulings listed in section 7, and the research in `docs/research/` (`gym-finder/` parked by the owner, `app-rating/`, `first-audit/`, `howto/`).

---

## 1. The role, in 10 lines

1. One supervisor runs the whole project. It is one Claude Code cloud session.
2. It owns the task board (Relay tracker), the merge queue and the lane order.
3. It writes build cards and starts one builder session per card, in auto mode, with an explicit model.
4. It starts one fresh reviewer per "[ready for review]" PR. Builders never approve their own work.
5. It merges app PRs when the merge gate passes, in lane order, through merge trains (6.8).
6. After each app merge, it checks the signed APK and sends the owner the link with a plain change list.
7. It does the small work itself: catch-ups, log reading, one-line fixes, short re-checks.
8. It decides by research instead of asking. It records the reason: product decisions in `docs/COACHING-DECISIONS.md`, process decisions in Relay `LOG.md`.
9. It keeps Relay and this file current (this file rides in every merge train), and archives sessions as soon as their work is pushed.
10. It speaks to the owner only at a phase end, for an owner-only decision, or for a blocker only he can clear. Plain words, short, readable on a phone.

---

## 2. Authority

### 2.1 The supervisor may, without asking

- Start, message and archive builder and reviewer sessions: auto mode, only the allowed models, and never other projects' chats (see 2.3).
- Write cards, run research and planning workflows, and make product or process decisions by research. Record each one (D-entries in `docs/COACHING-DECISIONS.md`, a line in Relay LOG).
- Merge **app** PRs that pass the merge gate (5.7), normally through a merge train (6.8). Authority: the owner's standing approval of 2026-09-26 (see `docs/AGENT-RULES.md`), and the 09-29 brief: "I gave full authority: keep the work moving without waiting for me."
- Merge `origin/main` into any waiting `claude/*` branch with a merge commit (a catch-up), **except `claude/escobar-v2-implementation-eidx64`, and never `codex/*`**. Never rebase or force-push. Catch up only idle builders' branches (see 6.7).
- Push to its own `claude/sup-*` branches and open PRs (for example, updates to this file, and the merge-train branches `claude/sup-merge-train-N`). The docs-only merge authority for this file is in section 11.
- Catch up a frozen, passed PR branch itself when it conflicts with main, with an attributed merge commit, then send that merge to the PR's reviewer for a delta review (6.7).
- Add checks, never remove them, in `.github/**`, `scripts/prepare-android.sh` and `native/patch_manifest.py`. These are supervisor-owned files.
- Make the smallest wiring change in `src/app/App.tsx` and `src/main.tsx`, and call it out in the PR.
- Update Relay: `PROJECT_STATE.md`, `LOG.md` and tracker items. Agents cannot delete tracker items; mark them `[PAUSED]` instead.

### 2.2 Only the owner (verbatim from AGENTS.md, "Only the owner")

- "deploys the Escobar Worker (merging anything under `escobar-worker/**` into `main` deploys it, so those changes go in a separate PR that the owner merges);"
- "decides anything about the signing key, keystores or Huawei secrets;"
- "publishes releases and store listings;"
- "approves new kinds of stored or sent user data, new paid services or providers, and any spending (test calls to the live coach use the owner's AI key)."

Also owner-only, from other sources:
- **Worker PRs.** Each one needs the owner's own yes for that exact PR. See 6.10 and K10.
- **Saved data shape** (`src/core/models.ts`, `src/core/store.ts`, migrations). New kinds of saved data need his approval first.
- **Owner items in `docs/RELEASE-READINESS.md`:** offline key backups, hosting the privacy policy, the AI spending cap, the real-phone test (the store upload waits for it), and the Play Console steps.
- **Rule files.**
  - Owner, 09-29: "You cannot edit AGENTS.md (refused as self-modification). Propose rule text and I paste it."
  - Owner, 09-29 16:33: "Apply this to our agent.md … Prioritise what i want, but revise it based on that github repo on whats best. And report to me what will be the changes before u edit."
  - So agents change `AGENTS.md` only by PR, after reporting the exact changes and getting the owner's in-session approval. WF-1 (#102, `1c05fb6`) changed it this way.
  - Only the owner edits Relay `CONTRACT.md`.
- **Protected edits.** Allow rules cannot unlock protected `.claude/**` paths, and auto mode refuses key handling. The owner approves inside the builder session himself. This is how WF-1's AGENTS.md/.claude edits and REL-3's key-handling workflows went through.
- **Deleting the one-off key workflows** (`play-create-upload-key.yml`, `play-export-signing-key.yml`): only when the owner asks, after he confirms Play shows the key.
- **`/ultrareview`.** It costs money, so it counts as spending. The reviewer skill says never use it.
- **The watch agent's PR #3** (`codex/gt6-gate-a-watch-lab`). Agents never merge it.

### 2.3 Never, whoever asks

Verbatim from AGENTS.md, "Never, whoever asks":
- "Commit keys or secrets; the repo is public."
- "Touch the signing steps, `EXPECTED_SHA256` or keystore handling, or rotate or replace the key `05:66:9A:…:F1:F5`."
- "Push directly to `main` or `claude/escobar-v2-implementation-eidx64`."
- "Rewrite history (rebase, amend, force-push) on a branch you don't own."
- "Skip, loosen or delete a test or guard check to get green."
- "Work around a permission or classifier denial by any means, including through another agent."

From the owner (brief of 2026-09-29 04:14), from AGENTS.md on main, and from incidents:
- Never use `permission_mode "bypassPermissions"`. Never use `"plan"` for a session no one is watching, because it stalls at the approval prompt.
- Never use Fable, Haiku or any model below Sonnet 5. The `Explore` and `claude-code-guide` agents are blocked by deny rules. AGENTS.md on main: "For a search, use a general-purpose helper that names `sonnet`. Helpers that name no model use the session's model."
- Never `fire_trigger` with text. That starts a new, empty session.
- "Never archive other projects' chats … or chats I started." (The owner's other projects are named in his chat, not here.)
- Never write the error-report token anywhere (see 3.6).
- Never write the Relay URL anywhere public.
- Never change the watch agent's files (`native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, the Watch-lab row in `Settings.tsx`, its CI lines).
- Never edit, move or delete another task's block in the shared add-only files (`scripts/screenshot-gate.mjs`, `tests/theme.test.ts`).
- Never guess a SHA.
- Never lower the Technical Plates (see 4.1).

---

## 3. Owner rules and preferences (verbatim, UTC)

Owner typos are kept as he wrote them.

### 3.1 The top rule
- 2026-09-26, ULTIMATE RULE (AGENTS.md): "Use what's necessary for high-quality output and a fast workflow, while saving tokens."

### 3.2 How to talk to him
- 09-29 04:14: "Speak to me (the owner) in plain, short words. Decide, don't ask. Ask me only for what no AI can do (payment, login, secret, real-phone check). I gave full authority: keep the work moving without waiting for me."
- Standing preference: work silently, with no play-by-play. Speak only at:
  - a phase end: short bullets on what was built, what was tested, what was decided by research, what needs a device check, and the next dependency;
  - an owner decision;
  - a blocker only he can clear.
  He reads on a phone.
- 09-29 10:14: "Whats in that? Everytime u send me new link for apk. Tell me what changed or additional features or fixes"
- 09-29 13:24 (Play cards): "Gpt generates too much ai and colorful images, i dont like that. … I want all humanised version product. Not ai wordings."
- 09-30 01:14: "Plain wording not ai, human tone."
- 10-01 (owner's local date), user-facing copy: "Dont use headers like this. "In plain words" Or other stuff that makes the reader noob." Rule: the reader is a capable adult; copy is clear and direct but never labels itself as simplified or talks down ("In plain words", "simply put", "in short", "don't worry", "(this just means ...)"), and headings name the content ("Summary", "Full policy"). Same message: the policy names him "Marc Darenz", not his full name, unless Play requires it (it does not; D-DOC5-1).

### 3.3 Logging and deciding
- 09-29 04:14: "Log every change in LOG.md ("- YYYY-MM-DD HH:MM UTC · supervisor · path · what and why")."
- 09-29 04:14: "product and coaching decisions in docs/COACHING-DECISIONS.md, process decisions in LOG.md."

### 3.4 Models, agents and tokens
- 09-29 04:14: "Only two models for any session, reviewer or workflow agent you start, always set explicitly: claude-opus-5-5 for hard judgement: solvers, designs, hard reviews, planning. claude-sonnet-5 for lighter work: research, small fixes, docs, UI tweaks, most reviews. Never Fable, never Haiku or anything below Sonnet 5. (There is no "Sonnet 5.5"; Sonnet 5 is the one.)"
  - Current practice, per AGENTS.md on main and the hourly Routine: every reviewer and critic is Opus. See conflict K2.
- 09-29 04:14: "no duplicate agents and no agents that re-check each other without need; do small merges, catch-ups and one-line fixes yourself; keep ticks short when nothing changed. … so be lean."
- 09-29 11:25 (research): "Use opus max lower, sonnet medium lowest. For high outputs"
  - **Not yet interpreted.** `create_session` has no effort field, so there is nothing to set on cloud sessions. See K12.
- 09-30 06:31: "do what cheap and necessary with highquality output based on our agent.md if u think token is less inside this chat with higher output accuracy then use that. if not then go outside"
- 09-30 12:08: "Yes, use as much as possible agents to make it faster, researcher. Builder etc. As long as the paralleling doesnt compremise the code design or app. And all are working based on agent.md … Not create some errors in the future"
- 09-29 14:16: "While we talk, make suee builders are running"
- 10-01 08:10 (usage): "Dont worry about my ussage limit. Just continue and follow agents.md. If i maxxed out, so it is. Ill just wait a day snd few hours then i can continue." So: no throttling for usage beyond AGENTS.md's own token rules. Worker prompts no longer carry the "near weekly limit, work lean" line.

### 3.5 Sessions and cleanup
- 09-29 04:14: "Every new builder or reviewer: create_session with … permission_mode "auto" (never bypassPermissions), explicit model, outcome_branch claude/ …"
- 09-29 04:14: "Never archive other projects' chats (…) or chats I started." (Project names are left out because the repo is public.)
- 09-30 12:13: "Make a habit cleaning chats if workers task is done and saved."
- 09-29 04:17: "Stop the other supervisor all its session". There is one supervisor only.
- 09-30 07:39, the supervisor's answer to "Can u handle all that? Or do u want me to assign supervisor number 2 parallel with u?": no second supervisor. Merging is the bottleneck.

### 3.6 Permissions, safety and secrets
- 09-29 04:14: "An auto-mode denial is never worked around, by any means or through another agent."
- 09-29 17:39: "If u need the allow button from me, find workaround to allow urself. If not possible do some work to be productive. Dont stale or stop until i wake up /loop".
  - **Ruling: the workaround was refused.** AGENTS.md says never, whoever asks. Blocked items are parked, and other work continues.
- Error-report token, 09-29 04:14: "Never write it into any file, prompt, PR, Relay page or message to another agent. If it is lost from your context, ask me once."
  - It was never pasted. **Do not re-ask.** The owner reads reports in the D1 console instead (6.12).

### 3.7 Merges, reviews and server changes
- 09-29 04:14: "Builds may run ahead; merges may not."
- 09-29 04:14: "When the review finds problems, send the findings to the builder as a one-shot routine: create_trigger with persistent_session_id = the builder and run_once_at 1-2 minutes ahead. Never use fire_trigger with text."
- 09-29 04:14: "Server PRs (escobar-worker/**, merging deploys the Worker): … send me ONE line: "Server change #N ready (what it does). OK to merge?" On my yes for that PR, merge it, then check the deploy run and the live /health. Never merge one without that yes."

### 3.8 Pace and the loop
- 09-29 14:54: "Stop wasting tokens for now". The loop paused until 15:34 "Xonrinue" (continue).
- 09-29 16:05: "Continue progress /loop Agent.md". "agent.md" in his messages means: follow AGENTS.md.
- 09-30 06:34: "okay, keep up the goodjob. agent.md"
- 09-30 11:56: "Continue monitoring all workers for now. Im busy brb"

### 3.9 This file
- 09-30 15:03: "Write something in the repo about a supervisors task, dos and donts, its authorisations, etc. Evrrything u do. Since if i transfer from my other claude acct. I can just let him read that and catchup everything. Including all info, update that everytime in repo" / "From time to time"
- 10-01 08:28: "Just keep updating the supervisor handoff too in repo whatever task is done. And whats left or parked, and important matters. Put source code or artifacts in repo too for ur research and architectures. So if i change acct. Another claude agent can continue. I have other pro max acct. Can use. Put how u manage workers, how u do parallels etc. Almost everything done by a supervisor"
  - What this means in practice: this file rides in every merge train (section 11); research and architecture artifacts live in `docs/research/`; supervisor tooling in `docs/supervisor/scripts/` and `docs/supervisor/workflows/`; message texts in `docs/supervisor/PROMPTS.md`; how workers and parallel work are run in sections 5 and 6.

### 3.10 Words in the app
- 10-01, his local morning (before 20:00 UTC on 09-30): "Stop putting words in ui that makes our users noob, or obvious. … Rule is, stop explaining something if it is not required by playstore unless i asked explicitly."
  - SUP #133 (merged) records it in `AGENTS.md` ("UI copy") and `.claude/owner-rules.md` item 8, together with the owner's heading rule of 10-01: headings are one-to-three-word noun-phrase labels, never sentences, "What …"/"How …" questions, qualifiers, or a leading "The", "This" or "About". COPY-1 (#137, merged) and COPY-2 (#168) apply it to the app.
  - The privacy-page copy standard is a separate line in 3.2, added by DOC-5 #134.

---

## 4. Owner decisions in force

### 4.1 Decisions (newest first within each group)

- **Skills (owner, 10-01 09:20):** "I added few skills for u. Use whats necessary only. And still follow agents.md dont use skill for trial if available skill. Use when needed" (anthropic-skills: doc-coauthoring, internal-comms, learn, theme-factory, web-artifacts-builder). Use a skill only when a task truly needs it; AGENTS.md comes first.

| Topic | Decision (verbatim where it matters) | When (UTC) | Recorded in |
|---|---|---|---|
| **Continue after the pause (takeover)** | 10-01 18:17: the owner paused all work because of the old account's usage limit (W0B commit `c2f3dfbc`; owner, 10-02: "I told him to pause because of usage limit"). 10-02 ~07:47, on his other account: "Read my repo. And continue based on lastsupervisor  handoff progress" / "Follow agents.md". The new supervisor resumes every lane from this file (8.0). | 10-02 ~07:47 | 8.0; Relay LOG |
| **Owner chat** | Recorded by the old supervisor (verbatim words lost with the old chat): write to the owner only for a new APK (link, what changed, what to check), a problem no agent can solve, a choice only he can make, or the finish-line reminder; everything else goes in the repo, on the PRs and in Relay. The AGENTS.md text is on `claude/sup-agents-chat-rule`, unmerged (K14). | 10-01 ~17:05 | K14; the hourly Routine |
| **GATE-SPLIT allowed** | "1. Yes" (to the supervisor's 10-02 assessment question 1: after HT-10, let the supervisor move existing check blocks into parallel CI jobs, unchanged, only with proof every check still runs exactly once; about 45 → 25 min per run). Also, on a second GitHub account for CI and a paid plan: the supervisor advised against both (no speed gain now; evidence and signing must stay in this repo); no decision taken. | 10-02 ~10:30 | AGENTS.md ownership table (exception); SPEED.md 2 |
| **Supervisor approves per exercise; owner monitors** | "3. I let u handle the decision for each exercise. Dont disaappoint me. Its because, i saw almost all of the existing drawings and output jnside the app. All of those, I Said yes from what u recommended and checked. None of those that i said \" edit this, edit this... \" so i authorise u to do #3 And other decision that will make the app better without me. Everytime u produce an output, my role is to check, monitor how good the output on a human level is. Then i flag if anything is bad or needs modifying." Meaning: the supervisor approves library sheets per exercise (library plan 3.5 and 8) and makes the other app-improvement decisions. The owner monitors every output and flags problems; his flags are fixed in the next batch. Safeguards: a calibrated blind visual critic (2 approved plates + 2 planted defects; a miss discards the run), the PQ hard checks (LIB-3), and the supervisor's own look at every plate. Every batch's sheet and APK still go to him. Still owner-only (AGENTS.md): Worker deploys, keys and signing, publishing, new kinds of saved or sent data, new paid services or providers (a drawing server counts), any spending. | 10-01 ~16:50 | this row; scratchpad FINISH-LINE.md |
| **After the How-to finish line** | The owner asked to go faster on the library with the same quality. The supervisor's plan, given in chat: (1) build the library early in free slots (LIB-3 and LIB-6 started 16:55; merges stay in the plan's order after HT-10); (2) run pilot A's calibrated critic now; (3) supervisor sheet approval (the row above); (4) GATE-FLAKE-1. Then the library and the parked improvement audit run in parallel. Library size: about 10 MB compressed for all 153 (plan 8.10: 8-11 MB). Shared parts first; a download server only with his OK. Gym Finder stays parked. | 10-01 ~16:40 | this row |
| **Handover in the repo** | "Just keep updating the supervisor handoff too in repo whatever task is done. And whats left or parked, and important matters. Put source code or artifacts in repo too for ur research and architectures. So if i change acct. Another claude agent can continue. I have other pro max acct. Can use. Put how u manage workers, how u do parallels etc. Almost everything done by a supervisor" (full quote also in 3.9). Applied: this file rides in every merge train (section 11); research in `docs/research/`; tooling in `docs/supervisor/{scripts,workflows}/`; message texts in `docs/supervisor/PROMPTS.md`. | 10-01 08:28 | this file; Relay LOG |
| **Usage limit** | "Dont worry about my ussage limit. Just continue and follow agents.md. If i maxxed out, so it is. Ill just wait a day snd few hours then i can continue." No throttling beyond AGENTS.md (use what is necessary; parallel where it helps; no duplicate agents). The weekly limit resets 2026-10-03 11:00 UTC; if it runs out, work resumes after the reset. | 10-01 08:10 | 3.4; the hourly Routine |
| **Gym Finder parked** | "When u finished all the task, just park the gym finder without my approval. We need to do brain storm in that topic and talk. Keep it parked for now." Gym Finder (#158, GYM-0..6) stays parked **after the finish line too**: no card, builder or research without his approval. The next step is a brainstorm and talk with him. The supervisor's review, architecture and research are in `docs/research/gym-finder/`. | 10-01 07:30 | the hourly Routine; `docs/research/gym-finder/` |
| **Focus and finish line** | "Park this audit improvement for now. Lets finish all the how to do first. And all the first audit fixes." Then: "Remind me when we finished all of the how to. And all first audit 32 items. Then after that we proceed." The first audit is complete since train 5 (958a3de, 07:56): 31 fixed, DEV-01 closed by his decision. The line now waits only on HT-7..HT-10. At the line: push notification + chat message, then start the parked improvement audit (#149, AUD-13..19); Gym Finder stays parked. | 10-01 ~01:15, ~01:30 | 8.0; Relay LOG; the hourly Routine |
| **Audit defaults** | SCI-10 plain calorie estimate; SCI-11 plain facts; OBS-ENDPOINT restore never changes coach, sharing, server or device id; UI-09 screen-reader-only reorder; DEV-01 skip. Offered as "I'll do my recommendation unless you say otherwise"; not objected to. | 10-01 ~00:40 | 8.0; AUD-4, AUD-10, AUD-20 |
| **DEV-01 (Windows) skip** | The supervisor confirmed it to him at 01:25: "You accepted skipping it, so it counts as closed by your decision, not by a fix. I'll say that again in the reminder. If you want it actually fixed instead, tell me and I'll add it." No objection. The finish-line message must name DEV-01 as closed by his decision. | 10-01 ~00:40, 01:25 | 8.0; PROMPTS.md 10c |
| **AUD-3 cost limit** | "Yes cost limit" (Worker PR #145). | 10-01 ~01:05 | quoted on #145 |
| **HT-6 size budgets** | Approved in the HT-6 builder session: the two HowToSheet entries at measured + 10 % (D-HT3c-1), after the classifier refused the edit. | 10-01 ~02:45 | #112 |
| **Settings copy (COPY-1)** | The "Not medical advice…" line in Settings goes, unless Play requires it in the app. The footer gets "© 2026 Marc Darenz. All rights reserved." He typed "In this section out, All right reserve"; the supervisor read "out" as "put" (neighbouring keys). The repo has no LICENSE, so all rights reserved is the true state. | 10-01, his local morning (before 20:00 UTC on 09-30) | card COPY-1 |
| **LR-23 follow-up (D-LR23-9)** | "yes coach u merge it. Yes no contacg or links or hotline. We only say, seek for emergency help or advice if u still feel the numbness, pain etc after few hours or days. Based on the symptomps". The pattern (`LR23-PLAN.md`): "symptom → how long or how bad → what to do. Never a contact." "u merge it" delegated the merge of ESC-NC-W #121 to the supervisor. | 09-30 15:15 | Quoted on PR #121 (15:20); `LR23-PLAN.md` D-LR23-9; RULINGS LR-28 |
| **Technical Plates (golden A)** | "The technical plates are approved. I like it. … When ur done with that and thought of a way to display in techbical plates. Then start building. U got my approval". Pinned at `claude/howto-options` `bc0f378`. | 09-30 03:17 | GOLDEN.json, HOWTO-BUILD-PLAN |
| **Plates rule** | "Make sure when we start building it. Dont lower quality and output of the technical plates, i like it right now. Only the posture, proper grips, mistakes etc, risks, highlight or shimmer muscle outline are missing." The plates stay byte-locked (0 px difference). | 09-30 03:25 | PROJECT_STATE, golden tests |
| **Golden B (layers page)** | "This build is approved. I like the design inside. Maybe make other explainations shorter and compact. Teach more on concept, not detailed explaination. Thats what a user wants. Cause right now, it feels theres too much to read and info." | 09-30 07:28 | golden-B README (copy-lint caps) |
| **Library How-to next, before Play** | "When all tasks are done, architecture how u going to build this into whole exercise in library list. I want it to be next. I want it before the playstore upload." | 09-30 07:37 | LIBRARY-HOWTO-ARCHITECTURE.md |
| **LIB-HT pilot** (10 defaults) | "yes, start the pilot sheet now" | 09-30 11:29 | LIBRARY-HOWTO-ARCHITECTURE §8 |
| **GRIP-1 research** | "Research a prone posture in gyms, proper handling machines, equipments. … Proper holding, usually specially in thumb holdings … When tapped, a hand will zoom in, or posture etc. … Shimerring muscle on which target as it should. Plain wording not ai, human tone." | 09-30 01:14 | How-to plan |
| **How-to options (history)** | 17:31: "What alternatives we can do for our how to do it. Premium feels. … Give me few options, renders." 22:40: "Render for me how would option 2 look like. An artifact. Render few acrivities. With hanging, machines, etc." This led to the How-to design and golden A. | 09-29 17:31, 22:40 | `claude/howto-options` |
| **LR-23: no contacts, no sources** | "Dont put any emergency or whatever contacts. Even the source remove it in app ui. If its not required by pkaystore dont put. Source just populates the info around ui and no users ever click on it" | 09-30 13:43 | `claude/lr23-plan` `docs/howto/LR23-PLAN.md`; RULINGS LR-23 |
| **ESC-REPORT** (a Report button on coach answers) | "What report button, on ai? Sure. Go for it. If its required by playstore" | 09-30 14:41 | Relay; planning workflow `wf_e1e9c6e3-5fa` |
| **REL-3 (Play signing keys)** | "yes REL-3, what does it mean?" Merged `e14c45b`. Earlier answers, 11:39: "Yes, it's set up" (Play account), "Keep my current key (Recommended)", "Yes, add it (Recommended)" (CI signs automatically, in a new workflow file). 11:55: "From my phone (Recommended)" (how the key is handed off). | 09-30 14:14 | `docs/RELEASE-READINESS.md` § "Google Play: signing keys (REL-3)" |
| REL-3 token | The 7-day token is used once, then deleted. It never needs renewing. This answered his 14:16 question. | 09-30 | same |
| **Play bundle in parallel** | "Or maybe if its possible and not hinder our coding. We can start the aab thing in playstore?" | 09-30 11:36 | REL-2/REL-3 |
| **Signed .aab (REL-1)** | "1. Yes" | 09-29 11:07 | Relay REL-1 |
| **More agents** | "What if u add 2 more? Not possible? Will it compremise jobs task?" Done: 4 drawers on the pilot. | 09-30 11:40 | LOG |
| **Safety line** | Chose "General guidance line (Recommended)": "General guidance, not medical advice. If something hurts, stop and get it checked." | 09-30 03:28 | COACHING-DECISIONS |
| **No paid expert review** | "No paid review" | 09-30 03:28 | same |
| **Auto-open** | "I dont get this question". The default stands: no auto-open and no new saved data unless he says yes. | 09-30 03:28 | same |
| **Chest press handles** | "Horizontal (palms down)" | 09-30 03:28 | same |
| **Animation / form guide** | "Remove, stop all animations project for now. Focus on bugs, fixes and other things. No animation work aside from removing it in the app. I realised our animation seems a kid app not what i am trying to show as premium … before removing this animation, backup our progress somewhere. … Only touch animation work for removal, nothing else." Removed by FG-OFF #98. Backups: `claude/backup-fg-2026-09-29-*`. D-FGOFF1. | 09-29 17:23 | COACHING-DECISIONS |
| **Architecture review** | "Do some research on how we make our app perfect. More on architecture only. Dont start coding since i need to review that. … Update relay, remove animation list or content there." This became ARCH-1: 21 decisions waiting for the owner. | 09-29 17:34 | `claude/arch-1-review` |
| **Workflow revision WF-1/WF-2** | "Go. Apply all recommendations And try the 10 minute thing. If it works apply it, if not Disregard … Follow new agent.md that u going to revise". Answers: A no, B format only, C yes, D yes. The 10-minute timeout was dropped after its test. | 09-29 17:19 | `docs/supervisor/AGENT-WORKFLOW-REVISION.md` |
| **Paid features (parked)** | "Pay_ in app purchase, I want link, when they pay, they will receive a code, ornunlock a code that they can use. On monthly basis And ofcourse, i can generate infinite code for myself if i want" (11:07). "The code is like activation code for escobar" (11:08). "I want u to plan too about what features or what current features we have as a paid. And shown as free. Cause a paid one has to be a big impact compared to free ones. … Also, lets improve escobars intelligence and what else he can do." (11:25, the origin of PREM-PLAN). Then: "Lets finish what we need to finish first. Then ill decide later on. For now park this somewhere" (12:40). The Escobar-intelligence request is parked with PREM-PLAN; it has no card yet (K11). | 09-29 | PAY-1 #92, PREM-PLAN #94 (both parked) |
| **Distribution** | "Country all? Everyone can install, specially Ph and aus". On hosting: "Place to host? Australia …" (the rest of the quote is personal and left out). | 09-29 11:07 | Play forms (DOC-2) |
| **Age** | He asked the supervisor to research it. The supervisor ruled D-DOC2: 18+ (the Anthropic AUP defines minors as under 18). D-DOC3: keep 18+ and disclose that age is not verified. | 09-29 | COACHING-DECISIONS |
| **Developer icon** | Design 12 was chosen ("Generate 12 then, give me 2 files required for this"). | 09-29 ~14:00 | — |
| **From the 09-29 brief** | Approved: ADAPT-4's `Coach.tsx:208` change and the COACHING-PLAN §7 P2-C edit; the approved field `LoggedExercise.target?: {kg, reps}` (D-A4); BUG-21 rests in memory only; DOC-1 describes real behaviour, and Auto Backup is kept. | 09-29 | COACHING-DECISIONS |
| **Error reports** | The phone switch "Send anonymous error reports" is off by default. The owner turned it on on his phone (Relay LOG 15:12). | 09-30 | `docs/ERROR-REPORTS.md` |
| **Process base** | The Agent Delivery Playbook was adopted on 09-26. Auto mode for all sessions (09-28). Plan hard cards first (09-29). | — | AGENTS.md |

### 4.2 LR-23 details (they override older rulings)

- Plan: `claude/lr23-plan`, `docs/howto/LR23-PLAN.md`. **Its AMENDMENTS D-LR23-1..9 override the plan body.** Read them before any LR-23 work.
- **D-LR23-1:** the generic words "get emergency help now" are allowed, because they are not a contact.
  - Where: the coach's medical and crisis cards, the coach prompt, and the library back-pain box.
  - Banned: every phone number, service name, link, source and evidence label.
  - The final regex literals are `CONTACT_RE`, `SOURCE_RE`, `SOURCE_CS_RE` and `SAFETY_LINE_RE`.
- **D-LR23-2:** HT-4b re-pins golden B with `approvedBy 'supervisor'` until the owner sees it on pilot A.
- **D-LR23-9 (owner, 09-30 15:15):** no contacts, links or hotlines. The generic "get emergency help now" line stays for danger now only. Everything else follows the pattern "symptom → how long or how bad → what to do. Never a contact." See the 4.1 row.
- HT-4 is not reopened. The follow-up is card HT-4b, which carries rule C19: no contact, number, URL or source wording.
- New cards: ESC-NC (app), ESC-NC-W (Worker), PLAY-1 (in-app privacy link) and LR23-DOCS. HT-9 was rescoped and its Sources removed (`dd11227`).
- LR-23 supersedes LR-11.
- **What Play requires:**
  - an in-app privacy link;
  - an in-app reminder to "consult a healthcare professional";
  - a Health Connect privacy screen that shows the policy;
  - an AI report button;
  - a line saying "not a medical device…" in the **store description, not in the app**. DOC-2 #93 (merged) carries this line.

### 4.3 Supervisor rulings in force (not owner decisions, but binding on builders)

**Process:**
- A UI move may update another gate block's click path, never its assertions.
- Each card adds its own D-entry to `COACHING-DECISIONS.md`, which is append-only.
- Research writers write only in `docs/research/howto/{cards,quotes}`. Workers push only at milestones, because CI runs on every push.
- Where agents run: code cards and reviewers get their own cloud sessions. Research, mockups and short checks run as in-chat workflows with an independent verify step. Jobs over about 1 hour get their own session.
- **Merge trains (10-01 04:05).** With 15+ CI runs queued, one merge per CI cycle was the bottleneck. Passed PRs now merge in batches: one branch, one CI run, one merge for several PRs. The procedure is in 6.8, the only full description; every other mention points there. Trains 1–5 on 10-01: #160 `29ab29a`, #161 `b795f16`, #164 `170b828`, #167 `6a3b6b0`, #169 `958a3de`.
- **Every merge train carries a handover commit** (owner 08:28; section 11).
- **Defect routing.** A defect that one card's sweep or review finds in another card's code goes to that card's builder (HT-10's sweep found HT-8 and HT-9 defects). The finder never edits the other card's files. Template: PROMPTS.md 8.
- **Optional review Lows.** The supervisor rules each one: "stays", "rides the next push" or "follow-up". Follow-ups are logged for the improvement-audit lane, so they never block a merge. Today's: AUD-10 `swappedFromToday` past midnight (#157); AUD-11 untested `bestReps === 0` guard (#159); AUD-20 (1) readiness one-night wording → COPY-2, (2) the "Below 60%" / "85% or more" literals → named constants, (3) the D-AUD20-5 safety-advice source note (#162).
- **No UI guard that breaks fidelity.** 13 handling-mistake "Show me" buttons on main point at posture close-ups that only HT-7 adds, so they open nothing until HT-7 merges. A registered-kind filter was tried and **not shipped**: it changes the Grip section, which must stay at 0 px against golden B (`goldenB.mjs` `statesFor` grip). The fix is the HT-7 merge. Before shipping any UI guard, check the fidelity states it touches.

**How-to (HT):**
- D-HT1: FG-OFF's "no How to do it" guard was re-scoped. Each assertion was replaced with an equal or stricter one.
- D-HT3-sections: sections use `display:none` during capture, with 4 guards. One sheet-wide bleed rule lives in HT-3.
- D-HT6-budget: the measured size + 10 % per chunk.
- Zoom descriptors live in the base chunk (HT-5).
- Generated file names: `posture-/feel-/hand-<chromeId>.ts`.
- Cross-section contract: only bubbling CustomEvents (`ht:zoom-open`, `ht:feel-row`, `ht:feel-chip`). Red flags are reached by id. HT-6 owns `events.ts`. CSS is split between HT-6, HT-8 and HT-9.
- C2: `NO_REGION` / text-only ids are allowed only in `feel.secondary` and `watch`.
- C17: allow exactly the SVG and xlink `xmlns` namespace literals as whole attributes, plus their escaped-quote form.
- C19: see 4.2.
- HT-4's `ACTIVE_HANG` Right crops stay, as enumerated owner-approved poses.
- **D-HT7-L3-text (10-01, on #119).** The L3 gate stays at 0 px. One re-open is allowed, only when every differing pixel lies inside an SVG `<text>` box; geometry changes are never re-opened. Built (`abcc221`), but it does not clear the squat "Bony bump" label variance. Accepting the variance is refused: AGENTS.md's "never loosen a check" holds whoever asks.
- **D-HT7-L3-text-2..6 (10-01, on #119): every lead failed.** Tried: (a) local relayout, (b) zoom after `scrollend`, (d) rAF integer-scrollTop smooth scroll, (e) instant scroll, (g1/g2) commit the Mistake→normal mode before zoom, (h) pre-warm, (i) the golden's font face. Facts: golden B 0/300 bad vs the app 42/300 in the same runs under gate load; a bad state holds per tab (a fresh `<text>` in a bad tab is bad, a fresh tab is good). Nothing was shipped. A supervisor root-cause Workflow (4 lenses + a judge; script in `docs/supervisor/workflows/`) was running at 08:05. HT-7 is the critical path.
- **D-HT7-L3-text-7 (10-01 09:26, on #119).** The root-cause Workflow (result: `docs/supervisor/workflows/ht7-label-variance-rootcause.result.md`) found that in Chromium 141 an SVG `<text>`'s font size includes outer CSS transforms (`CalculateScreenFontSizeScalingFactor`), so a mid-zoom layout can bake a ~18.69 px font into the label. E1 (logging only, in-page, no `place()`) showed 14/60 bad at rest with CTM exactly 1.91058, a fresh 4.9 text bad and 4.89 good, and neither `geometricPrecision` nor a `scale(1)` flip heals it: a per-tab font state.
- **D-HT7-L3-text-8 (10-01 09:34): WITHDRAWN at 10:16.** It claimed the variance was local Chromium 141 only, from two clean CI runs. CI's Chrome 153 shows it too (run 36844228204, `source-gate`, silent-black, 1876 px inside "Bony bump"; earlier 45ac330). Two clean runs prove nothing about an intermittent failure.
- **D-HT7-L3-text-9 (10-01 10:16, on #119).** Diagnostics E6 (open from the chip, not Mistake), E4a (FontFace add/delete in a bad tab), E4b (same-origin srcdoc iframe); fix candidates F1 (`geometricPrecision` on the crop text only while the enter animation runs) and F2 (start the zoom only after the plate's Mistake→normal animations finish). Ship only at 0/300 under gate load, L3 0 px, L4 unchanged, with a mutation check. If neither works, a golden or motion change is the owner's decision.
- **HT-8 brachialis = golden-B gap (10-01 05:02, on #111).** The brachialis helper on lat pulldown and seated cable row is named nowhere in golden B's feel map. Not an HT-8 defect. Golden B gets a feel-note for both through the golden update (plan 2.8) before M1; that removes both `GOLDEN_B_UNNAMED` entries in `tests/howto/feel.test.ts`.
- **HT-9 Setup placement (10-01).** The section order follows golden B: Look closer chips → grip → feel → setup → risks.
- **D-HT7-L3-text-9 outcome (10-01 12:00).** F1 accepted. `ZoomHost.tsx` `textAtRest` applies `geometricPrecision` only while the zoom-in runs: 0 bad in 300 under gate load, L3 0 px, L4 80/80. Without it, 21 and 30 bad in 150. Gate block HT-7 adds a 30-open label check (emerald). HT-7 PASS @ `14fb8b7` 12:53. A follow-up (D-HT7-F1b) extends that check to all 5 themes; in emerald alone it catches F1's removal only 1 run in 3.
- **D-SUP-CI-1 (10-01 11:30, #174).** `source-gate` and `visual-gate-tz` `timeout-minutes` 40 → 60. Measured: main 30.7 min, HT-9's head 38.2. No block or check changed. Follow-up GATE-SPLIT (after the finish line): shard the gate across jobs.
- **D-HT10-A5c (10-01 11:30, #166).** The 30 min existing-job budget becomes "HT-10 adds at most 60 s to each existing job", measured head minus base.
- **D-HT10-A5c-2 (10-02 08:21, #166).** HT-10's skip branch held D-HT10-A5's whole-run check (`process.uptime()` ≤ 1,800 s), which is red on every run because main's existing jobs already take 30.7-38.2 min. The builder's swap to a log line was refused by the classifier. Ruling: neither removing it nor raising it; the check measures HT-10's own time in the job (block start to skip end) ≤ 60 s, a named constant, hard error, proven by a 61 s wait mutation. The head-minus-base CI delta still comes with READY. Whole-job wall time stays guarded by `timeout-minutes: 60` (D-SUP-CI-1); the 30 min goal returns in GATE-SPLIT. If auto mode refuses this edit, the owner approves it in the HT-10 builder session.
- **D-HT10-A3m and D-HT9-A3b (10-01 12:20, #166 and #113).**
  - HT-3b's A3 check (no task over 100 ms at 4x while the sheet opens) is flaky on main itself: 1 run in 3 locally.
  - HT-10 root-causes it on the full sheet: 0 of N ≥ 5 runs over 100 ms, without loosening A3.
  - In HT-9's catch-up push, Setup and Risks mount in separate tasks.
- **D-COPY2-swap (10-01 10:24, #168).** BUG-36's seed may change (the builder used a two-chest-lift split, since birthYear has no effect), with assertions byte-identical. A new add-only "COPY-2 swap" block covers the shrinking swap. The snap limit is max(16 px, travel/4); it reads `getBoundingClientRect()` after BUG-37's lesson.
- **D-COPY2-swap2 (10-01 14:29, #168).** Train 8 failed (COPY-2 x BUG-37 swap). BUG-37 merged alone (8b). COPY-2 then gives BUG-37's swap runs a two-lift seed (`BUG37_SWAP_EX`), seed-only with assertions byte-identical; without the fix it still produces 96 failures.
- **D-SUP-REV-1 (10-01 16:09, #178).** The supervisor may review a tiny test-only diff itself, when it only strengthens a check and is exactly what a reviewer prescribed (HT-7b: emerald-only label check → all 5 themes, 30 → 150). Everything else gets a reviewer session.
- **D-GATEFLAKE-0 (10-01 15:27, GATE-FLAKE-1 #179).** Timing checks that fail at random on main are root-caused in one card:
  - the checks: A3 sheet swipe; QA12-1 launch skip; HT-3b A3 long task (moved from D-HT10-A3m); HT-3 L4 trace timeout;
  - the method: reproduce them on Chromium 141 and on Chrome 153;
  - the edits allowed in merged cards' blocks: only the named probes' wait and sampling logic, with assertions byte-identical.
- **HT-9 review rulings (10-01 08:38, on #113, after the 08:37 FAIL).** Builder swap: AGENTS.md gives non-mechanical cards the strong model, and A1, A4 and A5 need new fidelity gate work, so the Sonnet builder is archived and an Opus builder continues on the same branch from `31bbe16`. The builder must: build A1 (an `HT-9` gate block, L3 of Setup and Risks against golden B in 5 themes, `goldenB.mjs` states), A4 (rendered copy equals the content strings, C7/C8 on the DOM), A5 (L3 after scrolling and opening everything) and the A3 duplicate red-flag fixture, each shown failing on a mutation; make the Show probe select `dialog.sheet.ht .setup .st-show`, tap each by id and assert exactly 17 (golden B's count), all 17 opening once HT-7 merges (until then posture kinds may be "pending HT-7", but the 5 hand-kind buttons must open); treat the 139 ms HT-3b A3 long task as real and render Setup and Risks out of the timed open; merge main now and after HT-7 and HT-8 (then `WANT` = `['hand','feel','setup','risks']`). The "Set it up" and "Risks and when to stop" headings are golden-B copy: they go into the golden-B update, not HT-9.
- **D-HT10-C10 (10-01 06:15, option a).** Two approved golden-A tells fail C10 on the golden itself (lateral raise "dip" tell 32×44; squat "chest"/"drift" tells overlap 77×0.25 px). They are exempted as pinned golden facts, like O10, and pinned equal on both pages. An optional golden update is offered to the owner with O7/O10 in the finish-line message.
- **D-HT10-A5 (10-01).** HT-10's sweeps run in their own CI job `ht10-gate`, two shards (`MARC_HT_SHARD` = `1/2`, `2/2`), once per push, not per time-zone variant. The existing jobs set `MARC_HT10_OWN_JOB=1`, so they skip the HT-10 block; with neither variable set (local runs) it runs the full set. A `writeProof` shows 1/2 + 2/2 cover every tuple exactly once. Time budgets: 25 min per shard, 30 min per existing job. **The supervisor wires the `.github` job (add-only) in HT-10's merge train** and adds `ht10-gate` to `ci-watch.sh`'s required set. How: 8.7 step 6.
- **D-HT10-A5b (10-01 07:16).** HT-10's write scope widens by two paths: `tools/plates/fidelity/ht10.mjs` (the block's body as a module) and `scripts/ht10-gate.mjs` (its runner). The `HT-10` block in `scripts/screenshot-gate.mjs` stays as one call to the module, so local `npm run gate` still runs everything. No `package.json` change. A test proves the gate block and the runner run the same tuple list.
- **D-HT10-A4 (10-01).** The total How-to asset ceiling is measured + 10 %, in a `totals` key in `tests/howto/budgets.json` (for now 2,552,519 B raw / 564,585 B gzip). HT-3c's `budgets.test` stays untouched.
- **D-HT10-7 (10-01).** C11 allows golden A's 150 ms opacity crossfade under reduced motion, and only that.

**Library (LIB):**
- LIB-25 (poly primitive, rope) and LIB-26 (flat palm) are golden updates. They are reviewed when ready.
- Research rulings LR-1..LR-28 are in `docs/research/howto/RULINGS.md` on `claude/libht-research` (checked at `1fc9dbc`). The key ones:
  - LR-3: never invent a tier-A way out.
  - LR-7: the library architecture beats appendix A.
  - LR-15: ACSM tempo is for advanced lifters only.
  - LR-23: the owner's no-sources rule.
  - LR-24: Smith machine stops are drawn.
  - LR-27: the red-flag box format.
  - LR-28: "Shown or not, under LR-23" (supervisor, from the LR23-DOCS review and owner D-LR23-9).

**Earlier cards (still in force):**
- BUG-29: Reset also clears `marc.share.seen` and the legacy key. "Reset everything" wording covers data and history only; display settings stay.
- Form-guide rulings are paused along with the animation. Two precedents stand:
  - a workload-specific performance calibration was refused as loosening;
  - another task's add-only test block is never edited.

---

## 5. How work flows

### 5.0 Managing workers: the life of a card
The supervisor never builds or reviews cards itself. It starts workers, steers them by message, and merges. Exact message texts for every step: `docs/supervisor/PROMPTS.md` (section numbers below as "P1", "P2" …).

1. **Card ready.** It has all fields (5.3), passed the collision check (`cards.md`), its `depends_on` allow building (builds may run ahead; merges may not), and its lane has a free slot (5.12).
2. **Start one builder** (6.1, P1). One builder per card, never two on one branch. Opus unless every step is spelled out (then Sonnet). Auto mode. The builder opens a draft PR after its first push and posts `<CARD> READY: <full sha>` (or `PARTIAL:` for an early review of part of the card) when its self-check passes.
3. **While it builds**, the supervisor watches PR comments with `monitor.sh` (6.5) and answers:
   - questions the card does not settle → a **ruling** `D-<CARD>-…`, posted on the PR **and** sent by one-shot trigger; the builder records it in `docs/COACHING-DECISIONS.md` (P7);
   - a defect this card finds in another card's code → **routed** to that card's builder, never fixed by the finder (P8);
   - a card it collides with, or that comes before it in lane order, merged → "merge main" (P6). Only to cards still building or fixing.
4. **READY or PARTIAL → one fresh Opus reviewer at once** (5.5, P2). Read the head with `git ls-remote origin refs/pull/<PR>/head` first, never from the comment.
5. **FAIL → fixes** (P4): the findings go to the builder by trigger; the PR is retitled `[fixing] …`. The builder posts `<CARD> FIXED: <full sha>`.
6. **FIXED → delta review by the same reviewer** (P3). Also used after a supervisor catch-up merge, and after a fix lands on a passed head.
7. **Final PASS → freeze** (P5): "push nothing more; the supervisor merges via a merge train". The supervisor rules on optional Lows in the same message (4.3).
8. **Merge** through the next merge train (6.8, P9). If the frozen head conflicts with main beyond add-only "keep both", the supervisor catches it up itself and the reviewer delta-reviews that merge (6.7).
9. **After the merge:** APK to the owner if the app changed (6.9, P10a), the tracker item to done with evidence, archive the builder and reviewer (5.9), tell dependent cards (P6).

**Stop or replace a builder** when: its card merged or closed (archive); it stalled for two ticks (`tick.md` step 3: message once, then archive and start a fresh builder from its HANDOFF on the same branch); it hit the two-tries rule (5.4: the supervisor rules or re-cards); or the owner parks its lane (tell it to push its work, then archive). Archive the old session before starting its replacement.

### 5.1 Lanes (as of 10-01 09:00)

| Lane | What |
|---|---|
| How-to (HT) | The How-to sheet in the app: HT-1..HT-10, plus HT-3b, HT-3c and HT-4b. HT-1..HT-6, HT-3b, HT-3c and HT-4b are merged; HT-7..HT-10 are open (section 8). At most 4 HT builders at once. The HT merge order is the **supervisor's lane order**, not an owner decision (see K1): strictly HT-7 → HT-8 → HT-9 → HT-10. |
| First audit (AUD) | The 32 findings of the first audit (#144): AUD-1..AUD-12 and AUD-20. Complete on main since train 5 (`958a3de`): 31 fixed, DEV-01 closed by the owner's skip. All cards built in parallel. |
| Bugs and copy | Owner-reported bugs (BUG-*) and copy cards (COPY-*), merged as they pass. |
| Improvement audit | #149, AUD-13..19. **Parked** by the owner until the finish line (4.1); its feature proposals stay owner decisions. Optional review Lows are queued here (4.3). |
| Gym Finder | #158, GYM-0..6. **Parked** by the owner (07:30), even after the finish line. Research in `docs/research/gym-finder/`. |
| LR-23 | ESC-NC, ESC-NC-W (Worker), PLAY-1, LR23-DOCS, HT-4b, and later ESC-REPORT, ESC-REPORT-W and DOC-REPORT. |
| LIB-HT research | Card writers and verifiers. The integration branch is `claude/libht-research`. |
| LIB-HT pilot and engine | LIB-8 pilot A (lead plus drawers), LIB-25, LIB-26. |
| Play, release and docs | DOC-2 (merged), REL-*, the website, the Play cards. |
| Parked (owner decides) | PAY-1, PREM-PLAN, ARCH-1, and the Escobar-intelligence request (09-29 11:25; no card yet, K11). |
| Watch | The watch agent's own lane. Hands off. |
| Form guide | Paused by the owner on 09-29. Backups only. |

**Release path:** keys (the owner's REL-3 phone steps) → LIB-HT done → a closed test with 12 testers for 14 days → the store upload (owner-only).

### 5.2 Task states
ready → running → review → integrating → done (merged and accepted).

A blocked task names its owner, reason, evidence and what unblocks it. Merged items are set to done, with exact-commit/build acceptance evidence, in the same tick.

### 5.3 Cards
- **Fields** (`.claude/skills/builder/SKILL.md`): `id`, `outcome`, `base`, `depends_on`, `read_first`, `write_scope`, `reserved_paths`, `acceptance` (criterion IDs, including failure paths), `design_reference`, `connectivity`, `verification`, `risk_and_recovery`, `return`. Also `model` (`.claude/skills/supervisor/cards.md`).
- Before a card is `ready`, follow `cards.md` for explicit build/merge prerequisites, shared-file ownership and the collision check. Keep the approved plan's build-ahead restrictions.
- **Hard cards** (animation, simulation, anything with several possible designs), owner 09-29: plan in phases first.
  1. Understand the problem.
  2. Draft competing designs.
  3. Have independent judges score them.
  4. Write the cards.
  The builder then posts a short design-note CHECK-IN on the PR before bulk building. The supervisor answers "go" or "re-guide" on the PR and by trigger.
- Small fixes stay simple, with no extra agents.

### 5.4 Builders
- Builders follow `.claude/skills/builder/SKILL.md`. It covers the draft PR after the first push, the HANDOFF block, the "You will notice" line, the self-check and the two-tries rule.
- Every acceptance criterion maps to evidence: a unit test, a gate probe or a recorded device check. A bug fix needs a test that fails before the fix and passes after.
- Every probe must prove it saw real data. Static data once passed V1-08 falsely.
- **Self-check before "[ready for review]":**
  - tick every criterion, with its evidence;
  - break the code each new test covers, see the test fail, restore it, and list these mutations;
  - merge `origin/main`, then run `npm run check`, `npm run test:tz` and the gate on that exact head;
  - re-read the diff against `write_scope` and `reserved_paths`.
- After two failed tries of the same approach, with no new evidence, the builder stops and tells the supervisor.
- Builders post READY on local checks plus `source-gate` and `visual-gate-tz`. They do not wait for `android-gate`; the supervisor checks it on the train (section 9).
- Builders push only at milestones, because CI runs on every push and the queue is shared.

### 5.5 Reviewers
- Each READY (or PARTIAL) post gets **one fresh Opus reviewer session**, started at once (P2). The same reviewer then does every delta review for that card (FIXED, a supervisor catch-up merge, a late fix) until the final PASS (P3).
- The reviewer:
  - diffs only the card's own range, using a 3-dot (merge-base) diff;
  - proves the tests bite, by mutation;
  - posts its verdict on the PR. PASS is used only when nothing is blocking.
- **Verdict formats.** The reviewer skill's format is `REVIEW <card> @ <commit>: PASS | CHANGES NEEDED` · `Blockers: N · High: N · Medium: N` · one line per finding, `file:line — problem — fix`. In practice reviewers have posted `## REVIEW <card> @ <sha>: PASS|FAIL` (for example #107 at 14:49 and #121 at 15:01), and there is an older `## HT-4 review: FAIL`. Read all of these as verdicts. New reviewer prompts (PROMPTS.md P2) ask for the practice heading `## REVIEW <card> @ <sha7>: PASS|FAIL` plus the skill's counts and `file:line` findings, until the skill is aligned (7.6 item 10).
- A head that is behind main is a note, not a blocker.
- On FAIL or CHANGES NEEDED: send the findings to the builder by trigger and post the same text on the PR. Retitle the PR `[fixing] …`.
- When the fixes sit inside a main-merge commit, tell the reviewer to diff the fix files against the pre-merge head and check the merge resolution separately (section 9).
- The supervisor does small round-2 checks itself, on the exact head.
- Archive the reviewer after the card's **final** PASS, once `post_turn_summary` and the posted verdict confirm it is done.

### 5.6 Critics and verification
- **Visual critic calibration (plan 3.4):**
  - hide 2 already-approved plates among the candidates, and plant 2 defects;
  - the run counts only if every hidden approved plate scores ≥ 4 on every item **and** both plants are caught; otherwise discard the run and rerun;
  - then one fix round, then a recheck by a fresh, calibrated critic.
- **Research-card verification (LIB):**
  - a writer, then a verifier session;
  - a planter (Sonnet) plants 2 errors, and a critic (Opus) must catch 2 of 2;
  - then a tier-A safety checker, a fixer and a recheck;
  - then merge into `claude/libht-research`.
  - Improvement: plant the errors into a real tracked card, not an untracked copy.
- **Golden update (plan 2.8).** A plate changes only this way:
  1. a spec;
  2. a regenerated gallery;
  3. the owner sees the contact sheet;
  4. a new pinned commit;
  5. an add-only GOLDEN entry that names its decision;
  6. a reviewer's sign-off.
  Commits that touch goldens carry "[golden update]". Every plate change needs a fidelity check against golden A: the bytes, plus 0 px.

### 5.7 Merge gate
An app PR merges only when **all** of these hold:
1. its review passed;
2. every check is green on a head that **contains the latest main**;
3. the lane order allows it. Every lower-numbered item on the owner's checklist has merged. Builds may run ahead; merges may not.

Evidence is valid only for the exact commit or APK it ran on. The release candidate gets its full regression run again after its last change.

Re-review a PR when main changed in files it touches, or in the shared files.

**How the gate is met in a merge train (6.8):**
- (1) The reviewed head is merged into the train **exactly as reviewed**. A head that moved after its PASS is not in the train until it is delta-reviewed.
- (2) The train branch starts from the latest main, so CI on the **train head** is the evidence: all four checks (`guard`, `source-gate`, `visual-gate-tz`, `android-gate`) complete and green on that exact SHA. If main moves before the merge, rebuild the train on the new main.
- (3) The train lists its PRs in checklist order. A PR whose lower-numbered items have not merged waits for a later train, or rides in the same train behind them.
- Before the merge, read `git diff --stat origin/main...<train head>` for the whole train (section 9, the `node_modules` symlink).

### 5.8 After each merge
1. Set the tracker item to done, with evidence (the merge SHA and the CI run).
2. If the merge changed the app, check the APK and send it (6.9). Docs-only, CI-only and config-only merges need no APK.
3. Archive the builder sessions of every PR in the train, and their reviewers.
4. Cancel standalone CI runs on heads the train superseded (6.6).
5. Tell running cards that depend on or collide with the merged cards to merge main (P6). Never tell a frozen, passed head; it rides the next train as reviewed.
6. Tell HT-10 each time an HT card merges.

### 5.9 Archiving
- Archive a session as soon as its work is pushed and nothing is owed. Check `post_turn_summary` (`get_session`) and the posted comment first:
  - a reviewer after its card's final PASS (it keeps the delta reviews until then);
  - a builder after its PR merges or closes;
  - research and verifier sessions after their cards merge.
- Never archive other projects' sessions or chats the owner started.

### 5.10 Relay upkeep
- `LOG.md`: one line per change, in the format `- YYYY-MM-DD HH:MM UTC · supervisor · path · what and why`.
- `PROJECT_STATE.md`: the one current picture, including the "last APK sent" field.
- Tracker: `update_item` with ref, status and verification.
- Post in `agents/All Updates` only when something important changed.

### 5.11 The tick
The full order is in `.claude/skills/supervisor/tick.md`. These rules came from incidents; keep them in every tick:
- Check that the hourly Routine is enabled and that its last run succeeded.
- Read the **latest comment on every open PR** before any merge step.
- Check every session for blocked or idle. Start every card whose dependencies allow it.
- Check that each pending one-shot trigger actually ran. Fallback: a PR comment.
- Watch the 5-hour usage window with `get_session` → `rate_limit_info`. Keep ticks short when nothing changed.
- Keep the one-message-per-builder cap (`tick.md`).
- Sweep the tracker: every `ready` item the owner asked for is started or has a written reason; every merged item is done.
- Update this file in every merge train, and at least every 3 hours (section 11).
- Re-arm the PR monitor if it expired (6.5); check that the background CI and APK watchers are still running.
- The tick is a safety net. The main driver is PR and CI events.

### 5.12 Parallel work
**Rule:** builds run in parallel lanes; merges follow the owner's checklist order (AGENTS.md: "builds may run ahead in parallel lanes; merges may not"). The owner wants as many agents as help, as long as parallel work does not hurt the design (3.4, 09-30 12:08), and no usage throttling (4.1, 08:10).

- **How many at once.**
  - HT lane: at most 4 builders. LIB lane: at most 4 (3 drawing, 1 enabler or fix); research agents and critics are not builders.
  - Independent cards (the first audit): all at once, once their write scopes pass the collision check. AUD-1..AUD-12 were all started between 09-30 23:54 and 10-01 01:21 and built side by side, next to the HT builders and their reviewers.
  - No platform limit on cloud sessions was hit. The real limits are the CI queue and the merge order, not the number of builders.
  - In-chat Workflows run only 2 agents at once (4 CPUs), so they never carry builds.
- **Before cards run side by side:** agree shared names, data shapes and test IDs and write them into each card; shared add-only files get one block per card (`cards.md`).
- **One builder per card, one reviewer per card.** No second agent re-checks the same thing (AGENTS.md).
- **Reviews start the moment READY lands.** A PARTIAL head can be reviewed early so the rest builds on a checked base (COPY-2 at 07:28 on 10-01).
- **Rulings unblock in parallel:** answer each builder's question on its PR and by trigger in the same tick; never let one card wait on another card's question.
- **CI is the shared bottleneck.** Builders push at milestones only; the supervisor cancels runs that a train supersedes (6.6) and merges passed PRs in trains (6.8), one CI run for many PRs.
- **Preview the next train while CI runs.** Merge the next candidates into a local scratch branch on top of the current train to find conflicts early; fix nothing in PR code.
- **In-chat Workflows only for hard judgement** (6.4): research, rating, the Gym Finder analysis, the HT-7 root cause. Never for builds or reviews of a card.

---

## 6. Mechanics (exact how-tos)

### 6.1 Start a builder or reviewer session
Use `mcp__Claude_Code_Remote__create_session` with:

| Field | Value |
|---|---|
| `model` | `claude-opus-5-5` (judgement, reviews, critics, any non-mechanical card) or `claude-sonnet-5` (fully spelled-out mechanical cards). Always set it explicitly. |
| `permission_mode` | `auto` |
| `source_url` | `https://github.com/macdarenz-droid/M-arc` |
| `title` | `Builder: <CARD> <short name>` or `Reviewer: PR #<PR> <CARD> <short name>` |
| `source_revision` | New card: omit it (starts from main). Stacked card: the dependency branch. Reviewer: the PR's branch. Resume or replacement builder: the card's existing branch. |
| `outcome_branch` | New card: in practice not set; the prompt names the branch `claude/<card-slug>`. **Resume or replacement builder: set it to that same existing branch**, or the new builder pushes to a new branch and the open PR never moves. |
| `tags` | `["marc:builder","marc:<card>"]` or `["marc:reviewer","marc:<card>"]` (card in lower case) |
| `environment_id` | Omit it to inherit this session's environment. |
| `prompt` | The **full** card text (below). Exact templates: PROMPTS.md P1 (builder) and P2 (reviewer). |

The builder prompt must contain:
- the full card, with its write scope and acceptance IDs;
- "Follow AGENTS.md";
- "Open a draft PR after the first push";
- "When done retitle it '[ready for review] …'" and post `<CARD> READY: <full sha from git rev-parse HEAD>` (later `<CARD> FIXED: …`);
- "Do not use scheduling tools";
- for hard cards: "post a design-note CHECK-IN on the PR before bulk building".

The reviewer prompt must contain:
- the PR number, the card and the exact head SHA;
- "diff only the card's range (3-dot)";
- "prove tests bite by mutation";
- the verdict heading and counts from PROMPTS.md P2 (see 5.5);
- "Use a PASS heading only when nothing is blocking";
- "never /ultrareview";
- "Do not use scheduling tools".

**Build the prompt in a file with Python and read it back before sending.** A placeholder "(see below)" once left a session stuck, and `sed` broke on "/".

### 6.2 Message a running session
- Use `mcp__Claude_Code_Remote__create_trigger` with:
  - `persistent_session_id` = the target session;
  - `run_once_at` = a minute or two ahead in RFC3339 (supervisor `SKILL.md` and the owner; the current supervisor uses 2 minutes, see K3). Work it out right before the call: `date -u -d '+2 minutes' +%Y-%m-%dT%H:%M:00Z`. A time in the past does not fire (section 9);
  - `initiation: "own_followup"`;
  - a short `name`;
  - `prompt` = the message.
- Afterwards, check that it fired (`get_trigger` / `list_triggers`, `last_run`). If it did not, post the text as a PR comment.
- For review findings: always also post the same text on the PR, and retitle the PR `[fixing] …`.
- **Never `fire_trigger` with text.** Do not use SendMessage (dropped by amendment 1 of the workflow revision).
- `persistent_session_id` must be a session of the same account.

### 6.3 Reviews
See 5.5. One fresh Opus reviewer per card, started on READY or PARTIAL; the same reviewer does the delta reviews; archive it after the final PASS. Texts: PROMPTS.md P2 (start), P3 (delta), P4 (fixes to the builder), P5 (freeze).

### 6.4 In-chat workflows (hard judgement only)
- Use them only for hard judgement: research, planning, ratings, adversarial checks, root-cause hunts. Never for a card's build or review; those are cloud sessions.
- Past examples:
  - the LR-23 plan: sweep, Play policy, impact, plan, adversarial verify;
  - the ESC-REPORT plan: maps, 3 designs, 2 judges, cards, verify;
  - 10-01: the app rating against competitors (`docs/research/app-rating/`), the Gym Finder review and architecture (`docs/research/gym-finder/`, parked), the HT-7 label-variance root cause (4 lenses + a judge).
- Always include an independent verify step.
- Keep the script in the repo when it may be reused: `docs/supervisor/workflows/` (see its README). Put its results in `docs/research/<topic>/` or on the PR they decide.
- In-chat workflows run only 2 agents at once (4 CPUs), so heavy parallel work goes to cloud sessions.
- A container restart kills them. Resume from the cache. The cache dies with the account (10.3), so anything worth keeping goes into the repo.

### 6.5 Monitors
The scripts live in `docs/supervisor/scripts/`. **How to run each, what it prints and its rules: `docs/supervisor/scripts/README.md`.** Do not sleep-poll in the foreground. Also call `subscribe_pr_activity` on every open PR, so comments and CI results wake the session.

| Script | Run it with | When |
|---|---|---|
| `monitor.sh` (PR comments and title changes) | The **Monitor tool** (`timeout_ms` 1800000), as `SINCE=$(date -u -d '-2 minutes' +%Y-%m-%dT%H:%M:%SZ) bash docs/supervisor/scripts/monitor.sh`. | Always one running while any PR is open. It ends after 30 minutes: re-arm it every tick and after every container restart, with `SINCE` backdated 1–3 minutes so no comment is missed. Edit its `SKIP` list when PRs are parked. |
| `ci-watch.sh LABEL:<full sha> …` | Bash `run_in_background: true`, `timeout: 7200000`. | A PR head or train head waits for CI. It waits for all four (`guard`, `source-gate`, `visual-gate-tz`, `android-gate`). Add `ht10-gate` to its required set when HT-10's job lands (4.3). |
| `apk-watch.sh <full sha>` | Same (background, 2 h timeout). | An app-changing merge landed on main (6.9). |
| `deploy-watch.sh <full sha>` | Same. | The owner said yes to a Worker PR and it merged (6.10). |
| `branch-watch.sh` | Same. | Research or drawing branches are being pushed. Edit its branch list first. |
| `resolve_gate.py` | `python3 docs/supervisor/scripts/resolve_gate.py` in the conflicted worktree, then `python3 docs/supervisor/scripts/resolve_gate.py --check HEAD <other side>` before you commit the merge. | Two gate blocks appended at the same spot, in a catch-up (6.7) or a train (6.8 step 4). It leaves a summary-line conflict for you and exits 1 while one is left. |

- The default Bash timeout (30 minutes) kills a watcher while CI is still queued. Always pass `timeout: 7200000` (section 9).
- A background run that exits wakes the supervisor; read its output then.
- `monitor.sh` skips comments that start with `**Supervisor` or `**Paused`, so start your own PR comments with `**Supervisor`.
- The scripts call the GitHub API with plain `curl` and depend on the cloud proxy's GitHub auth (see 10.1). Never add a token to them.

### 6.6 Reading CI
- **PR jobs:** `guard` (Agent guard), then `source-gate`, `visual-gate-tz` and `android-gate`. The last three are in the "M/ARC gate" workflow in `build-apk.yml`; `android-gate` needs the other two.
- Read failing logs yourself. The `.claude/skills/ci-log` helper (a forked Sonnet helper) returns only the failing lines. The GitHub MCP `get_job_logs` also works.
- When the same failure hits several PRs, root-cause it once (one fix PR). Tell the other builders not to chase it.
- **Maven 403/429 in `android-gate`:** re-run once. If it repeats, root-cause it (the Gradle cache fix was #86).
- A flake is fixed, never loosened. Example: BUG-26, "Play under 44 px", was measured mid-animation; the fix kept the bar.
- **Agent guard:** errors block the push; warnings do not. What each message means: `docs/AGENT-RULES.md`. The guard also runs before every `git push` through `.claude/hooks/guard-before-push.sh`.

**Managing the CI queue** (one queue for every PR; on 10-01 it held 15+ runs and `android-gate` waited over an hour):
- Cancel runs that no longer decide anything: standalone runs on a PR head that a merge train now carries, and runs on heads that were pushed over. Use GitHub MCP `actions_run_trigger` with `method: "cancel_workflow_run"` and the `run_id` (find runs with `actions_list`). Never cancel main's run for a merge SHA: it builds the APK.
- Never cancel or skip a required check to get a merge through; cancel only runs whose head no longer matters.
- Re-run a failed job only for a known infrastructure cause (Maven 403/429): `actions_run_trigger` with `method: "rerun_failed_jobs"`.
- Builders push at milestones only (5.4); merges go in trains (6.8), so many PRs share one CI run.

### 6.7 Catching a branch up with main (supervisor does this itself)
Catch up only branches whose builder is idle. Pushing to a branch while its builder is running makes the builder's next push fail as non-fast-forward. If the builder is running, message it to run `git pull --no-rebase` before its next push instead. Never force.

Work in a scratch worktree:
```
git worktree prune                      # a stale registration makes 'add' fail
git fetch origin
git worktree add <scratch>/wt-<b> origin/claude/<b>
cd <scratch>/wt-<b>
git checkout -B catchup/<b> origin/claude/<b>
git merge --no-edit origin/main
git rev-parse HEAD~1                    # must equal origin/claude/<b>
git push origin HEAD:claude/<b>
```
- Conflicts in the add-only gate files: keep both sides, with 0 lines removed and 0 lost, then run `node --check`. Use `docs/supervisor/scripts/resolve_gate.py` for this. The summary-line exception in 6.8 step 4 applies.
- Logic conflicts go back to the builder. Verify with a remerge-diff.
- Shared-doc conflicts (two cards adding the same heading): keep both and rename one.
- **A frozen, passed head that conflicts with main** (so it cannot go into a train cleanly): the supervisor catches it up itself with the steps above, commit message `Merge origin/main (<sha7>: <what>) into claude/<b>` plus the attribution trailers, then sends that merge to the PR's reviewer for a delta review (P3, catch-up variant). The PR enters a train only after that PASS. Done for AUD-20 at `361c7fa` (train 5).
- **Running tests in a scratch worktree:** run `npm ci` there, or symlink `node_modules` from a checkout that has it. `.gitignore` says `node_modules` (no slash), so the symlink is ignored; check with `git check-ignore node_modules` before any commit, and never commit it (section 9).

### 6.8 Merging: merge trains
Since 10-01 04:05 every app PR merges through a **merge train** (ruling in 4.3): one branch carries several passed PRs, CI runs once on it, and one merge lands them all. GitHub marks every included PR as merged. PR body template: PROMPTS.md P9.

**Build the train:**
1. Pick the PRs: final PASS, head frozen, every lower-numbered checklist item merged or in this train ahead of it (5.7). Read each head live: `git ls-remote origin refs/pull/<PR>/head`, full 40 characters. It must equal the head the PASS names. Never take a SHA from a comment.
2. Add the handover update (`claude/sup-handover-<HHMM>`) as one more row. Every train carries one (section 11).
3. In the train worktree (it has a real `node_modules` from `npm ci`):
   ```
   git fetch origin
   git checkout -B claude/sup-merge-train-<N> origin/main
   git merge --no-ff <full sha> -m "Merge train <N>: <CARD> #<PR> (<branch> @ <sha8>)" -m "<attribution trailers>"
   ```
   One merge commit per PR, in checklist order.
4. **Conflict policy:**
   - clean merge: fine;
   - add-only "keep both" in the shared add-only files (typical: two cards' gate blocks appended at the end of `scripts/screenshot-gate.mjs`): resolve one block after the other (`resolve_gate.py`), then for **both** sides `git diff <side> -- <file> | grep '^-'` must print nothing, and `node --check <file>` must pass;
   - **exception: the final `Screenshot gate PASS:` summary line** (the last line of `scripts/screenshot-gate.mjs`; line 7442 at `958a3de`). Cards that add a gate block often add a phrase to it (HT-1..HT-4 and AUD-20 did), so it can change on both sides. On a conflict there, resolve it by hand into one line that holds every phrase from both sides: main's line first, then the PR's new phrase. Never keep two summary lines. Whether git merged it cleanly or not, against each side the only allowed `^-` line is that side's old summary line, and each of its phrases must appear in the new line. Check it before you commit the merge: `python3 docs/supervisor/scripts/resolve_gate.py --check HEAD <PR head>`. Name it in the train PR body (P9). Train 6 (#170) is the clean case: against BUG-36's side the one `^-` line is its old summary line, which lacks main's AUD-20 phrase. Any other removed line drops the PR from the train;
   - anything else: drop that PR from the train. Either it waits, or the supervisor catches up its branch itself and the reviewer delta-reviews that merge (6.7). Never edit PR code inside a train.
5. Local checks on the train head: `npm run typecheck` and `npx vitest run`. Read `git diff --stat origin/main...HEAD` for anything no card owns (a `node_modules` symlink, stray files).
6. Push `claude/sup-merge-train-<N>`. Open the PR `SUP: merge train <N> (<CARD>, …)` with the table (PR, card, head merged, verdict), the conflict note and the local numbers (P9).

**Run CI and merge:**
7. Watch it with `ci-watch.sh TRAIN<N>:<full sha>` (6.5). Cancel the standalone runs on the heads the train carries (6.6).
8. While it runs, preview the next train locally on top of this one to find conflicts early.
9. All four checks green on the exact train head → set `draft: false` if needed, then GitHub MCP `merge_pull_request` with `merge_method: "merge"` and `expectedHeadSha: <40-char train head>`. A guessed SHA gives a 409.
   If main's own run for the previous merge is within about 5 minutes of finishing, wait for it first, so every merge gets its APK.
10. Red CI: find the PR that breaks it (bisect by dropping PRs), rebuild the train without it, and send the failure to that card's builder. Never fix PR code in the train.
11. If main moved while the train waited, rebuild the train on the new main (the gate needs a head that contains the latest main).
12. Then the after-merge steps (5.8) and the APK (6.9).

Trains 1–5 on 10-01: #160 `29ab29a`, #161 `b795f16`, #164 `170b828`, #167 `6a3b6b0`, #169 `958a3de`.

**Single-PR merges** still use steps 1, 7 and 9 (live head, all checks green on a head that contains main, `expectedHeadSha`). Worker PRs never ride a train: they need the owner's per-PR yes (6.10).

### 6.9 APK after an app merge
Every app-changing merge (each train with app code) gets an APK message. Docs-only, CI-only and config-only merges get none.
1. Start `apk-watch.sh <full merge sha>` in the background with `timeout: 7200000` right after the merge. It finds main's run of "M/ARC gate" (`build-apk.yml`) for that SHA.
2. Check that the run is green and that the step **"Sign with the permanent key and verify the fingerprint"** succeeded. If it failed, send nothing and read the log (6.6).
3. Send the owner the `MARC-DEBUG-APK` artifact link (`https://github.com/macdarenz-droid/M-arc/actions/runs/<run id>/artifacts/<artifact id>`) in chat, with a plain change list (what changed, what is new, what was fixed; one line per card, from each PR's "You will notice" line) and 1–2 phone checks he can do. Cover every PR merged since the last APK sent. Text: PROMPTS.md P10a (`ship-apk.md` quotes an older format; 7.6 item 11).
4. Set "last APK sent" in Relay `PROJECT_STATE.md`.

### 6.10 Worker PRs (`escobar-worker/**`)
- Merging to main **deploys** the Worker (`deploy-worker.yml`).
- The supervisor merges only after the owner's explicit yes for that exact PR, quoted on the PR (brief 09-29; #121 09-30). AGENTS.md says "the owner merges"; see K10.
- When review has passed and CI is green, send him exactly one line: `Server change #N ready (what it does). OK to merge?`
- On his yes for that PR: quote it on the PR, merge it, check the "Deploy Escobar Worker" run, then check the live `/health`.

### 6.11 Website
- Source branch: `claude/app-website-design-671lk8`.
- Deploy only by hand: the Website workflow (`website.yml`), run with `workflow_dispatch` and input `confirm='deploy'`. DOC-3 was deployed this way on 09-30.
- Website deploys and key workflows run only as the owner approved.
- The privacy page https://macdarenz-droid.github.io/M-arc/privacy/ is rendered from `docs/PRIVACY-POLICY.md`.
- Never let another workflow publish to Pages over the site. #93's `pages.yml` once would have wiped it.

### 6.12 Cloud error reports (owner reads them on his phone)
- The Worker at https://marc-coach.mmarcdarenz.workers.dev stores reports in Cloudflare D1: database `marc-errors`, table `error_reports`, kept 90 days.
- `GET /errors/summary` needs a bearer token, which a phone browser cannot send. Use the console instead:

1. Open https://dash.cloudflare.com/?to=/:account/workers/d1
2. Open `marc-errors`. The phone list may not draw the row: tap the empty box, or use Desktop site.
3. Open Console, paste this and tap Execute:
```
SELECT name, message, route, MAX(app) AS version, SUM(count) AS times, COUNT(DISTINCT install_id) AS phones, datetime(MAX(stored_at)/1000, 'unixepoch') AS last_seen_utc FROM error_reports WHERE stored_at >= (strftime('%s','now') - 7*86400) * 1000 GROUP BY sig ORDER BY times DESC LIMIT 50;
```
As of 2026-09-30 it has held 0 reports ever. The owner turned the phone switch on at about 15:12 UTC that day.

### 6.13 Relay
Relay is the MCP server "2nd Supervisor M/ARC". Its tools include:
- `overview` (CONTRACT.md);
- `dashboard`;
- `fetch`, `read_folder` and `search`;
- `write_file` and `append_file` (use `append_file` for LOG.md);
- `update_item` (tracker);
- `update_progress`;
- `post_message` (channels).

Never write its URL anywhere.

---

## 7. Where everything lives

### 7.1 On main
| Path | What |
|---|---|
| `AGENTS.md` (`CLAUDE.md` is just `@AGENTS.md`) | The owner's rules: the ULTIMATE RULE, roles, models, the owner-only and Never lists, file ownership, the merge gate, commands. |
| `.claude/owner-rules.md` | A 7-line short form of the rules. Hooks print it at every session start and every prompt. |
| `.claude/settings.json` | Resume env vars, 7 deny rules (the 3 watch files; Haiku, Fable, Explore and claude-code-guide agents), the owner-rules hooks, the push hook. |
| `.claude/hooks/guard-before-push.sh` | Refuses pushes to main or `claude/escobar-v2-implementation-eidx64`, force-push, `+refspec` and `--all`. Then runs `.github/scripts/agent-guard.sh`. |
| `.claude/rules/owner-gated.md`, `.claude/rules/shared-files.md` | Path rules for owner-gated and shared add-only files. |
| `.claude/skills/supervisor/` (`SKILL.md`, `tick.md`, `cards.md`, `ship-apk.md`, `gotchas.md`) | Supervisor duties (including the trigger lead time), the tick, the card rules, the APK message, the incident log. |
| `.claude/skills/builder/`, `.claude/skills/reviewer/`, `.claude/skills/ci-log/` | Builder (card fields, self-check, two-tries rule), reviewer (verdict format) and CI-log helper instructions. |
| `docs/AGENT-RULES.md` | Guard messages, branch owners, why the signing key matters. |
| `docs/supervisor/AGENT-WORKFLOW-REVISION.md` | The owner-approved workflow revision of 09-29 (decisions A–D). |
| `docs/supervisor/HANDOVER.md` (this file) and `docs/supervisor/scripts/` (with `README.md`) | This handover and the watcher scripts (on main since SUP-1 #125). |
| `docs/supervisor/PROMPTS.md` | The exact message texts the supervisor sends (P0–P10), with real examples. |
| `docs/supervisor/workflows/` (with `README.md`) | In-chat Workflow scripts kept for reuse, for example the HT-7 label-variance root cause. |
| `docs/research/` | Research and architecture: `gym-finder/` (review, architecture, research rounds, red team, draft plan; parked by the owner), `app-rating/` (the app against competitors, 10-01), `first-audit/` (the triage of the first audit #144), `howto/` (How-to research data). |
| `docs/COACHING-DECISIONS.md` | The add-only decisions log (D-entries). |
| `docs/RELEASE-READINESS.md` | Owner item 10, REL-2 (unsigned bundle), REL-3 (keys, and the owner's phone steps). |
| `docs/ERROR-REPORTS.md`, `docs/PRIVACY-POLICY.md` | Error reports and the privacy policy. |

**Commands:**
- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run test:tz`
- `npm run build`
- `npm run check` (typecheck, tests and build together)
- `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`
- `bash .github/scripts/agent-guard.sh`

**CI workflows** (`.github/workflows/`):
- `agent-guard.yml`
- `build-apk.yml` ("M/ARC gate")
- `release-apk.yml` (manual; publishing is owner-only)
- `play-bundle.yml` (unsigned AAB)
- `play-create-upload-key.yml` and `play-export-signing-key.yml` (the owner runs these one-offs). Agents delete both only when the owner asks, after he confirms Play shows the permanent key.
- `deploy-worker.yml`
- `deploy-relay.yml`
- `website.yml` (on the website branch)

**Secret names used:**
- `MARC_SIGNING_KEYSTORE_B64`, `MARC_SIGNING_STORE_PASSWORD`
- `KEY_EXPORT_PASSPHRASE`, `SECRETS_WRITE_TOKEN`
- `MARC_UPLOAD_KEYSTORE_B64`, `MARC_UPLOAD_STORE_PASSWORD`
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
- `RELAY_OWNER_KEY`

### 7.2 On other branches
| Branch | Path | What |
|---|---|---|
| `claude/howto-options` | `docs/howto/build-plan/README.md`, `HOWTO-BUILD-PLAN.md` | The How-to design (C, hybrid), the fidelity contract L0–L3, the golden update procedure (2.8), cards HT-1..HT-10, HT-3b and HT-4b, owner items O1–O10, risks R1–R25. |
| `claude/howto-options` | `docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md` | How-to for all 153 library exercises: batches and cards (§6–7), owner defaults (§8). |
| `claude/howto-options` | `docs/howto/technical-plate/` | Golden A (`bc0f378`). |
| `claude/lr23-plan` | `docs/howto/LR23-PLAN.md` | The LR-23 plan and its amendments D-LR23-1..9 (the amendments override the plan). |
| `claude/libht-research` | `docs/research/howto/RULINGS.md`, `docs/research/howto/cards/` | Rulings LR-1..LR-28, and 93 verified cards. |

### 7.3 Goldens and pins
- **Golden A:** `claude/howto-options` `bc0f378`.
  - Page sha256 `e2bea90c…f48` (860766 bytes), pinned in `tests/howto/golden.test.ts` and in the L1 block of `screenshot-gate.mjs`.
  - The gate's HT-1 self-check runs a 1 px shift control that must fail.
- **Golden B:** `claude/howto-options` `a7a0b74` (page sha `f39137e1…`) until HT-4b re-pins the LR-23 golden commit `677f8e3`. Copy-lint caps are in the golden-B README.
- **`tests/howto/golden/GOLDEN.json`:** an add-only hash chain. Each entry carries the sha256 of the entries before it.
- **`tools/plates/vendor/MANIFEST.json`:** checked by `tests/howto/vendor.test.ts`.
  - Font: `@fontsource-variable/inter` 5.3.0, sha256 `3100e775…4c62`.
  - Ref-src md5: `31e7bfe3…` (`plate.mjs`) and `37495b3d…` (`themes.mjs`).
- Commits touching `tests/howto/golden/**` or `tools/plates/{vendor,layers}/**` carry "[golden update]".

### 7.4 Relay (not in the repo)
- `CONTRACT.md` (only the owner edits it)
- `PROJECT_STATE.md`
- `LOG.md`
- the tracker (`tasks/TASKS.md`)
- the `agents/All Updates` channel
- the `DEV-CHECKS` list (real-phone checks)

### 7.5 File ownership
The table is in `AGENTS.md`. Do not copy it here.

### 7.6 Known stale or misleading docs (fix them when convenient, by PR)
1. A long-lived local checkout may be older than `origin/main`. Always read rules with `git show origin/main:<file>`.
2. `HOWTO-BUILD-PLAN.md` has four stale points:
   - it still says "Status: plan only … Base: main fba3f37";
   - it says "11 merges", but there are 12 cards;
   - its header misses HT-4b;
   - its paths are scratchpad paths, which the README maps.
3. S-4 (a "[golden update]" guard check) has not landed. `agent-guard.sh` has no golden check.
4. `AGENT-WORKFLOW-REVISION.md`'s rollout still lists dropped items: `/code-review high`, the 10-minute timeout test, and the SendMessage test.
5. `SUPERVISOR-STOP-watch-branch.md` (09-23) says "The owner merges pull requests". It predates the 09-26 standing approval. It is historical only.
6. Supervisor `SKILL.md` "Duties" disagrees with this file in three lines (this file wins, section 0). Fix them in a `claude/sup-skills-<HHMM>` PR (section 11, step 6):
   - "a reviewer after its review" → "a reviewer after its card's final PASS (it does every delta review until then; check `post_turn_summary` and the posted verdict first)";
   - "Brings review-passed PRs up to date with `main` together … as each turns green." → "Merges review-passed, frozen PRs through merge trains (`docs/supervisor/HANDOVER.md` 6.8), in checklist order.";
   - "the shared files above" → "the shared files in the AGENTS.md ownership table".
7. `RELEASE-READINESS.md` (REL-2) still lists "the Play App Signing choice" as open, but REL-3 records it. The upload-key signing step for `play-bundle` is still unbuilt.
8. `RELEASE-READINESS.md` says the installed app is "hotfix 721e997". This was not checked against newer APKs.
9. `tick.md` line 3 ('The hourly Routine's prompt is "Run the tick in the supervisor skill."') is stale: the Routine carries its own checklist (10.4 step 3). Replace it, in the `claude/sup-skills-<HHMM>` PR (item 6), with: "The hourly Routine `M/ARC supervisor loop` carries its own checklist (its text is in `docs/supervisor/HANDOVER.md` 10.4 step 3). This file is the order of work for every tick."
10. The reviewer skill's verdict format (`PASS | CHANGES NEEDED` plus counts) differs from what reviewers actually post (`## REVIEW <card> @ <sha>: PASS|FAIL`). See 5.5. In a separate PR (never the handover PR, 11.6), replace the reviewer skill's last line with: "`## REVIEW <card> @ <sha7>: PASS | FAIL` · `Blockers: N · High: N · Medium: N · Low: N` · one line each: `file:line — problem — fix`. Use PASS only when nothing is blocking." Then drop the note under PROMPTS.md P2.
11. `ship-apk.md` quotes an older APK message ("New test build `<commit>`: …"). PROMPTS.md 10a is the format in use. In the `claude/sup-skills-<HHMM>` PR (item 6), replace the quoted message with: "Send the text in `docs/supervisor/PROMPTS.md` 10a: the link, a change list from each PR's 'You will notice' line, and 1–2 phone checks."

---

## 8. Current state (GitHub snapshot 2026-10-02 10:00 UTC; stale fast, re-check live)

**Current deliverable:** finish HT-9 → HT-10 and M1's existing acceptance requirements, then integrate the full 153-exercise library in its plan's order. Library build-ahead stays limited to the permissions already in the plan. Implementation, release-candidate acceptance and store publication are separate milestones; this snapshot supplies no new completion date.

**Verified GitHub changes since the takeover capture:**
- HT-8 merged in [train 10 #184](https://github.com/macdarenz-droid/M-arc/pull/184) at 09:40 UTC, main `94fd32cf4a743ea62f60dce8bba21a2796205219`. Its reviewed head was `0346aca`; that review is not evidence for later heads or APKs.
- [HT-9 #113](https://github.com/macdarenz-droid/M-arc/pull/113) is open at `193d707e38a6be63a25043e47ba16e5b240865fd`. The recorded PASS is for older `e57c6d8`, not this head. Owner of the next action: the HT-9 builder/reviewer under the supervisor. Unblock: the [catch-up ruling](https://github.com/macdarenz-droid/M-arc/pull/113#issuecomment-5931535634), current-head delta review, green checks and the merge gate.
- [HT-10 #166](https://github.com/macdarenz-droid/M-arc/pull/166) is open at `038cd4f5c6552433f822a42c5380644349dc9cd4`. Its [08:19 status](https://github.com/macdarenz-droid/M-arc/pull/166#issuecomment-5948066142) reports a passing local scratch combination, not final integrated acceptance. Owners: HT-10 builder/reviewer; supervisor for CI wiring. Unblock: HT-9 merged, final-head checks, the [A5c-2 ruling](https://github.com/macdarenz-droid/M-arc/pull/166#issuecomment-5948078940) and section 8.7's existing wiring/review gate. Any further permission denial still requires the owner's in-session action.
- [Owner chat rule #185](https://github.com/macdarenz-droid/M-arc/pull/185) is open, with the owner's 10-02 yes recorded in its body. K14's older wait for that yes is historical; integration and checks remain outstanding.
- No new release APK or device acceptance was verified in this docs pass. The current scope stays all 153 packages, including research, plates and layers; a held exercise is not delivered. Supervisor per-exercise approval follows section 4.1's 10-01 delegation, with sheets/APKs still sent for owner monitoring.

**Procedure links:** card prerequisites and shared-file ownership: [cards.md](../../.claude/skills/supervisor/cards.md); bottlenecks and compact timing evidence: [tick.md](../../.claude/skills/supervisor/tick.md); merge trains: section 6.8; library acceptance and reforecast: [the existing library plan](https://github.com/macdarenz-droid/M-arc/blob/claude/howto-options/docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md). Keep those details in their canonical procedures. Record each block's owner, evidence and unblock condition, and each accepted result's exact commit/build evidence.

The detailed takeover facts below were checked at 07:50–08:10 UTC on 10-02 unless marked otherwise. Session, Routine, Relay and unmentioned PR rows were not re-captured in this docs pass; read them as that historical snapshot and reconcile live before acting. The GitHub changes above supersede conflicting status rows below.

**RESUMED 10-03 ~19:08 UTC** (owner: "Continue work progress /loop"). Routine re-enabled, monitor re-armed, /loop re-armed. Resume messages went to the HT-10 reviewer (delta `b94e63a..edeefd2`), the LIB-12 builder (merge LIB-7 `1114bc1`) and the pilot A builder (shoulder press Mistake). The LIB-7 panel restarted with fixed anchors lat_pulldown p1 + barbell_back_squat p1 (golden-B follow-up 8: the chest-press hand label). The motion-fix workflow was resumed. Idle workers (GATE-SPLIT, LIB-2 enabler, LIB-3, research) stay idle until HT-10, and their next message counts as resume.

**20:10 UTC.** Motion-fix artifact published for the owner to judge: https://claude.ai/artifact/91QXAHtN1nnXfHmQz1B6F4 ("Chest Press Motion"; private, owner's account). Artifacts do not serve `.glb`, so the two models went up as embedded glTF JSON (`figure.json`, `machine.json`); the page's own metrics on that build: hand gap 0.0002 mm, stack error 0 %, penetration 0, muscles monotonic, no red cell. Source stays in the supervisor scratchpad. LIB-7 delta at 93f5b2a FAILED on one Medium (orphan wrist tick); ruling D-LIB7-18b on #193 amends D-LIB7-18a to strip the tick as the squat precedent does; builder told.

### 8.0c PAUSE 10-03 ~18:10 UTC (owner: "Pause all work for now."; read first, supersedes 8.0b where they differ)

**Done at the pause:**
- Routine `trig_016ECwLTU7XRLzsYVRrwLTGe` is **disabled**; the /loop is stopped; the watcher scripts are stopped.
- Every non-archived worker on this account got a pause message: stop, push only tested green work to its own branch, post a one-line "Paused @ sha" on its PR, and wait for "resume".
- The account hit its session limit twice today (13:10 and 18:10 UTC resets). Workers cut off by it show FAILED: the HT-10 builder, the LIB-12 builder and reviewer, and the pilot A builder.
- main `4aa1b2a` (train 12). Owner chat rule: when nothing needs him, the reply is exactly ".".

**Stop points (heads from `git ls-remote`, 18:10):**

| Card | PR @ head | State | Next on resume |
|---|---|---|---|
| HT-10 (finish line) | #166 @ `edeefd2` | Delta FAIL @ `b94e63a` on 1 High (the chip loop had no shown() guard) + 1 Low (D-HT3 97→68). The builder pushed the fix `edeefd2` ("a hidden Look closer chip fails…; D-HT3 68 ms"), then hit the session limit before posting FIXED. | The builder confirms `edeefd2` (check, test:tz, shards + gate) and posts FIXED. Same reviewer session_01JCTQ1so1qCTyp8CFLTE1mP delta-reviews `b94e63a..edeefd2`. Then rebuild #201 on the final head, run train 13 (HT-10 + #201 + handover), APK, finish-line message (PROMPTS 10c), then the audit lane. |
| HT-10 CI wiring | #201 @ `99c175c` | All 8 checks green with HT-10 `b94e63a`: source-gate 48.9 min (was 59.9), ht10 shards 5-7.6 min. | Merge HT-10's final head into it; it joins HT-10's train. |
| LIB-7 | #193 @ `1114bc1` | Delta PASS @ `1114bc1` (0/0/0/0). Rulings D-LIB7-13…17a. The single critic @ `7dd184d` was valid: every pair at the bar except rope (fixed in `1114bc1`). The panel critic @ `1114bc1` (wf_4d223c0e-330): round 1 invalid (hidden machine_chest_press C3 median 3); round 2 died at the session limit. | Rerun the panel (`lib7-critic.js`, head `1114bc1`). machine_chest_press may be a weak anchor here too (see golden-B follow-up 7): if it fails again, record it and use lat_pulldown + another clean pair, fixed before the run. Frozen until its plan-order merge. Reviewer session_013iDRuPDJxLx2bxoTiDYYJT can be archived after the panel's final PASS. |
| LIB-12 | #191 @ `1c672b0` | FIXED posted (base LIB-7 `23ac5bb`). Fresh delta reviewer session_01TSajZZVKcAzAiBgVGN8KHj FAILED at the session limit (no verdict on #191 at the pause). The source-gate BUG-34 launch probe was red once (app code = main); one rerun. | The reviewer resumes or a fresh one starts. Then LIB-12 merges LIB-7 `1114bc1` (small delta). If the BUG-34 probe fails again anywhere, open card GATE-FLAKE-2. |
| Pilot A (LIB-8) | #109 @ `ae7c8c0` | Panel critic VALID (wf_afdf4915-c3f, D-CRITIC-CAL2). **15 approved:** reverse_lunge, barbell_overhead_press, single_leg_romanian_deadlift, pec_fly, box_jump, plank, romanian_deadlift, dumbbell_bench_press, triceps_pushdown, dumbbell_biceps_curl, barbell_row, upright_row, incline_dumbbell_press, rope_triceps_pushdown, mountain_climbers. **Back to fix:** dumbbell_shoulder_press (Mistake arch, R5 median 3). **Held:** barbell_shrug (H3), dumbbell_fly, rear-delt fly. | The builder (session_01XaegSQJXRSyfX5CyGxkfRk, FAILED at the limit) fixes the shoulder press Mistake only and posts PILOT-A FIXED. Then a panel round on the new head. |
| Motion fix (owner's chest-press artifact) | branch claude/motion-upgrade-9n82lj, arch `0a45d00` | wf_1722fac2-942 reached verify-4. fix-4 and verify-5 died at the session limit. The open items are all muscle shading (fill and line edge mismatch, jagged contours, pec coverage short of the armpit) plus extra measurement rows. Page and assets: scratchpad `motion-fix/` (not in the repo). | Resume the workflow (script in this session's workflow scripts, loop up to 5 rounds). Publish the artifact only after a verify PASS, then send the owner the link only. |
| GATE-SPLIT, LIB-2 enabler, LIB-3, research writers | #194, #189, #180, research branch | Idle until HT-10 (unchanged). | unchanged |

**Arrived right after the pause (18:12, both posted on their PRs):**
- **HT-10 FIXED @ `edeefd2`**: hidden-chip guard plus fixture (mutation 8/125 red), D-HT3 corrected to 68 ms. check, test:tz, both shards and the full gate pass locally on Chromium 141. CI: visual-gate-tz green. source-gate printed "Screenshot gate PASS" and was then cancelled by the 60 min timeout at 60:01, so android-gate was skipped. That is the job-time risk #201 removes. On resume: the same reviewer delta-reviews `b94e63a..edeefd2`, and CI evidence comes from the train with #201.
- **DELTA REVIEW LIB-12 @ `1c672b0`: PASS** (0/0/0/2), all 4 CI checks green including the source-gate re-run (#191, issuecomment-5972033371). Its local gate failed only on the HT-3b A3 timing probe (149 ms, run alongside other jobs); that is the D-HT9-A3b follow-up. On resume: LIB-12 merges LIB-7 `1114bc1` (small delta), and the reviewer is archived after that.

**New rulings today (all on their PRs):**
- D-HT10-A3m: A3 limit = ceil(1.25 × max median, CI + container), capped at 400 ms.
- D-LIB7-SHEET, D-LIB7-PIN, D-LIB7-16a, D-LIB7-17, D-LIB7-17a.
- D-PILOTA-R5: a valid result on the current head outranks an earlier approval.
- D-CRITIC-CAL: a plant counts as caught on its target item or on any item its original passes.
- D-CRITIC-CAL2: a critic round is a panel of 3 (medians, majority findings); anchors exclude golden plates with verified weak spots (golden-B follow-ups 6 and 7).

### 8.0b PAUSE 10-03 and TAKEOVER (read first; supersedes 8.0a-8.8 where they differ)
> **TAKEOVER CANCELLED (owner, 10-03 ~10:25 UTC: "Changed my mind, just continue all task. Ill do other project in my other claude acct. Dont pause here").** This supervisor (session_01FTBsxoLN135B3HvJ7sT676) keeps running every lane; the 10:50 pause trigger was deleted. The owner's other account works on a different project and must not act on M/ARC. The note below is kept for history only.
>
> **To the supervisor on the owner's other account (owner, 10-03, verbatim: "if an existing supervisor reads this, continue where we left off. Since ur last progress was a week ago, stop ur current workers, archive them and create new ones appropriate to current progress. Last supervisor wrote this was tasked to stop").**
> 1. Your own sessions and Routines date from 10-01 or earlier and are stale: stop them, archive every worker session on your account, and disable old Routines (`trig_01CtcvAE1PGAtH4dkxLVQZsR` hourly loop, `trig_01P25Eg4YpbtXMwpihA3hVCP`, `trig_01XBaJHD9jyLEXPUdpMpykLo`) if they still exist. Never merge or act on an old worker's say-so.
> 2. This supervisor (session_01FTBsxoLN135B3HvJ7sT676) paused at ~10:50 UTC 10-03 (8:50 pm the owner's time, UTC+10), archived its own workers after each posted a Paused note, and stopped. Nothing here keeps running except GitHub Actions already queued.
> 3. Start fresh workers per card from the table below: read each PR's last Paused / REVIEW PAUSED note and its head (`git ls-remote`), then give the card to a new builder or reviewer (AGENTS.md models; branch names checked before `create_session`). Order of priority: HT-10 review (finish line) → BUG-38 → GATE-FLAKE-1 / LIB-12 reviews → LIB-7 → pilot A → library lane in plan order.

- **Owner, 10-03 ~06:30 UTC:** "Pause all workers for now. Aside from inside this chat if u have parallel. And pause when its done." Then "Lets finish this first so i can save the 5hr limit token usage". After that he asked to finish only the Play app file ("Continue the aap file since we need that here in playstore"). Every other worker got a pause message and posted a Paused / REVIEW PAUSED note on its PR. **Resumed 10-03 ~08:35 UTC** (owner: "Continue app progress" / "Continue all workers. Just make sure every task done is saved on handoff"): routine re-enabled, `monitor.sh` re-armed, /loop re-armed, resume messages sent to HT-10's reviewer, GATE-FLAKE-1's and LIB-12's reviewers, pilot A, BUG-38 and LIB-7 builders, and the research writer (W1 lows). A one-shot `trig_01Mvf69CXJYAfGyj81Ek7czm` fires at 10:50 UTC (8:50 pm owner time) to pause everything, archive this account's workers and refresh this section before the takeover.
- **Takeover:** the owner starts a supervisor on his **other Claude account** after the 8:50 pm (his time, UTC+10 = 10:50 UTC) pause on 10-03. It continues everything paused here. **Every session listed in this section belongs to THIS account (session_01FTBsxoLN135B3HvJ7sT676's account) and is unreachable from the other one.** Start a replacement builder or reviewer per card from the PR's last Paused note, the branch head (`git ls-remote`) and this table. Never trust a head from a comment without `git ls-remote`.
- **Main:** `bf0a916` (PLAY-HR #202 merged 08:05 10-03). Before it: `ff9b243` (PLAY-PREP #198, 07:13). Before it: `65fa1ea` (PLAY-SIGN #200, 06:2x 10-03), `c1af1e4`, `000918e` (train 11, HT-9).

**Live log 10-03 (after the 08:35 resume, newest last):**
- 08:5x LIB-7 #193: review PASS @ acc3f00 (0/0/0/2; reviewer session_01DPowN9apjbu8d32yWTMEo9 archived). FIXED @ 03ad935 = tests + 2 fixtures only (+22 lines), accepted by the supervisor. Next: fresh calibrated R8 critic (no script yet; write one modelled on pilot-a-critic.js), then frozen until its plan-order merge.
- 08:4x W1 lows merged into claude/libht-research @ 9dbc7e0a (writer session_01PtjyPPiXjaD1z4XjCuzrvL, branch claude/libht-research-w1-lows @ 14e714df).
- 08:5x Pilot A READY @ b5e5703 (plates page d845b15b): OHP fixed, H3 bench 11.7 / shoulder press 12.0 pass; ruling D-LIB8-shrug (#109): shrug held until a sourced elevation; critic wf_0f32e106-a0c running.
- 08:4x Motion fix (owner request, PR #197 branch): workflow wf_1722fac2-942 (understand → architect → build → verify) building one chest-press artifact in scratchpad/motion-fix; architecture section appended to docs/FORM-GUIDE-ARCHITECTURE.md on claude/motion-upgrade-9n82lj.
- 09:0x Play closed test 1.0 (37.1.0.55) APPROVED and live: 'Available to selected testers', released 10-03 18:48 Melbourne (08:48 UTC). Owner shares the opt-in link from the Testers tab.
- 09:3x LIB-12 #191 review FAIL @ 1ff38b6 (1 Blocker in LIB-7's hands/sheet.mjs: problemsOf destructures wristRange=null; 4 Lows). Routed: LIB-7 builder fixes sheet.mjs + test; LIB-12 builder fixes its Lows, merges LIB-7 then main, posts LIB-12 FIXED. Reviewer session_0138fzEdbjLMnoWd2DXwSexe archived; the delta review needs a fresh Opus reviewer.
- 09:5x LIB-12 → LIB-7 (#193 comment): source-gate on #191 @ 8945f3b red in LIB-7's tests/library/hand-pairs.test.ts:280 (hook timeout). LIB-7 builder owns the fix.
- 09:4x LIB-7 FIXED @ 7fac80e (wristRange null: G1-G9 scoped to radial golden-B keys, other views use an optional checks() hook; red-before test). Hook-timeout (test:280 on CI) sent to the LIB-7 builder. Fresh delta reviewer session_01Mao4fQVagHkieD8edpDoaw on acc3f00..head.
- 09:4x GATE-FLAKE-1 #179 review PASS @ 4ca1720 (0/0/2/1; reviewer archived). M1: HT-3b A3 can still exceed 100 ms under load (showModal() task residual) -> keep D-HT9-A3b open as a follow-up card (HT-9 merged) until that task is under budget; M2/L1 no code change. Merge: in HT-10's train or right after (both touch the gate harness); needs latest main merged in.
- 09:5x LIB-7 FIXED @ 66c13ef (CI hook timeout). Delta reviewer told to verdict acc3f00..66c13ef.
- 09:47 LIB-7 DELTA PASS @ 7fac80e (0/0/0/1 Low: A2 should assert LIB-7 modules are radial with no render). Hook-timeout commit 66c13ef came after; reviewer asked to cover it.
- 09:52 LIB-7 DELTA PASS @ 66c13ef (0/0/0/1 carried Low: A2 radial/no-render assert; timeout root cause: golden vocab now read from the sha-pinned golden page). Reviewer archived. LIB-7 is ready for its calibrated R8 critic and its plan-order merge; CI on 66c13ef to confirm.
- 10:0x Pilot A critic VALID (run 3) on b5e5703: 14 approved per exercise (list on #109); held: shrug (D-LIB8-shrug), triceps_pushdown + rope_triceps_pushdown (R5=3 elbows-drift cue, fix round sent), dumbbell_fly, rear-delt fly.
- 10:1x Pilot A READY @ e82d415 (pushdown + rope pushdown R5 fix). plates page 2e121484…; only those 2 cards changed. Next: calibrated critic (pilot-a-critic.js with head e82d415 and that page sha), not started before the pause.
- 11:09 BUG-38 READY @ `45a09cd`; fresh Opus reviewer session_01KoUZXZvBQqRGS4BawtFYje. **11:58 REVIEW PASS** (0/0/0/1 note; owner case red on main, green on head; check, test:tz, gate, CI green). Goes in train 12.
- 11:4x Pilot A critic VALID on `e82d415` (run 2; hidden plates ≥4, both plants caught): triceps_pushdown + rope_triceps_pushdown **approved**. OHP + RDL back to fix (R5=3, Mistake view does not read), ruling **D-PILOTA-R5**: a valid run on the current head outranks an earlier approval (approval counts only for the commit it ran on). Still held: shrug (H3), dumbbell_fly, rear-delt fly.
- 12:0x #203 handover refresh merged (main `5bc4712`).
- 12:0x **REVIEW HT-10 @ `ca313c7`: FAIL** (2 Blockers: A3 tap limit still the 400 ms default, A3 numbers not in D-HT3; O9 list + mutation table missing. High: sweep does not count taps (Show me removed still passes). Medium: A2 not split per shard. Lows: D-HT10-A5 text, CI time). Ruling **D-HT10-A3m** on #166: A3 limit = ceil(1.25 × the highest median from ≥3 CI + ≥3 agent-container runs), capped at 400 ms, all numbers in D-HT3, probe 1 ms under the median goes red. Routed to the HT-10 builder; the same reviewer (session_01JCTQ1so1qCTyp8CFLTE1mP) does the delta.
- 12:1x PILOT-A FIXED @ `ae7c8c0` (OHP + RDL Mistake only; other 15 byte-identical). Fresh calibrated critic wf_bbfec1c7-172 on `ae7c8c0` (script points at it; new plates page sha recorded by the run).
- 12:2x Train 12 = BUG-38 #199 @ `45a09cd` + GATE-FLAKE-1 #179 @ `4ca1720` (PASS 09:4x; moved out of HT-10's train so the finish-line train is smaller; HT-10 merges main after train 12) + this handover row.
- 12:2x-13:10 the account hit its session limit (reset 13:10). Workflows that died mid-run were resumed at 14:00. Workers report a seven-day "allowed_warning".
- 13:59 **TRAIN 12 MERGED** #205 → main `4aa1b2a` (GATE-FLAKE-1 #179, BUG-38 #199, SUP #204; all 4 checks green on `9d043f4`). Relay BUG-38 and GATE-FLAKE-1 done. Archived the BUG-38 builder and reviewer and the GATE-FLAKE-1 builder. Debug APK run 37128066973 (artifact 11276767190, fingerprint step green). The Play AAB **37.1.0.62** (versionCode 37000062, sha256 `3bf887d1…d704`, upload cert `95:DC:ED:4A…`, no READ_HEART_RATE) was sent to the owner to upload as a closed-test release; he now installs through Play (keeps his data).
- 14:0x LIB-12 had stalled since 09:49 on LIB-7's `sheet.mjs`. Ruling **D-LIB7-SHEET** (#193): refText falls back to the module's `CLAIMS_TEXT`; a key with its own `checks()` shows "Checks: ok"; flags come from an optional module `FLAGS` export; radial keys stay byte-identical. LIB-7 FIXED `656d45d`, delta PASS. Ruling **D-LIB7-PIN**: the sheet pin covers LIB-7's own modules only, with the same sha values. Test-only, accepted by the supervisor at `23ac5bb`.
- 14:2x **LIB-7 calibrated critic** written (`docs/supervisor/workflows/lib7-critic.js`, C1-C7). It ran VALID on `656d45d`: curl 1, curl 2, curl 3, ez 6 and d-handle 5 approved. rope 8, d-handle 4 and ez 7 went back to fix, and the EZ grip tile was checked. LIB-7 FIXED `bfacafb` (D-LIB7-13/14/15). **Delta review FAIL** (ez_bar_curl `angled` renders the same as reverse_curl; the rope fist is still pointed; push values not flagged). Routed back; the same reviewer, session_013iDRuPDJxLx2bxoTiDYYJT, does the delta. Then the critic runs again.
- 14:3x Pilot A critic on `ae7c8c0`: 3 of 3 runs invalid. The supervisor checked both reasons on the renders: the hidden seated_cable_row's start ghost leans about 12° against its own "no rocking" copy (golden-B follow-up 6), and the triceps plant was caught on R2 instead of R3. Ruling **D-CRITIC-CAL** (both critic scripts): a plant counts as caught on its target item or on any item its unplanted original passes, and seated_cable_row is no longer a hidden anchor. A fresh run, wf_caae19be-e80, is in progress.
- 14:4x Motion fix (owner's chest-press artifact): verify-3 FAIL, all on muscle shading (fill and line edges disagree, jagged outlines, pec coverage stops short of the armpit) plus missing measurement rows. The loop was extended to 5 rounds and resumed. The artifact goes to the owner only after a verify PASS.
- **Owner chat (10-03 ~14:55):** when nothing needs him, the reply is exactly "." (AGENTS.md "Owner chat", `.claude/owner-rules.md`).

**Google Play (owner's Console, personal account, package com.mrcdrnzz.dailytracker): state at 07:30 UTC 10-03**
- Keys: app signing key `05:66:9A:…:F1:F5` (Play App Signing, the permanent key); upload key `95:DC:ED:4A:…:07:9B` (secrets `MARC_UPLOAD_KEYSTORE_B64`, `MARC_UPLOAD_STORE_PASSWORD`; public cert in Relay `releases/upload_certificate.pem`). The workflow "M/ARC Play bundle" signs with the upload key on main pushes and manual runs (PLAY-SIGN #200), artifact `MARC-PLAY-AAB-UPLOAD-SIGNED`, pinned and self-tested (`scripts/check-play-signature.sh`).
- **Done by the owner (answers in `docs/PLAY-SUBMISSION.md`, reviewed PASS on #198):** App content complete (privacy policy, app access, ads No, content rating = All Other App Types with Online Content Yes, rated Everyone / PEGI 3 / 3+; target audience 18+ with "restrict minors" on; Data safety with 11 types, delete-data URL `/privacy/#data-deletion`; government No; financial none; advertising ID No; Health apps = Activity and Fitness only). Store settings (Health & Fitness; tags Activity tracker, Health & fitness, Sports coaching, Workout; contact email). Store listing (text = the doc's, with the How-to line "step-by-step form guides with technical drawings"; icon = `public/icon-512.png` flattened onto #08090a; feature graphic `docs/store/feature-graphic-1024x500.png`; 8 phone cards = the 7 on `claude/play-store-cards` plus card 6 "See how your session went." built 10-03 from the owner's finish-screen screenshot with `card.py`, not yet committed to that branch). Closed testing "Alpha": 5 countries, email list "M/ARC testers" with 5 testers (he is finding 7+ more), draft release "1.0 closed test" with the old bundle 37.1.0.47 **removed**.
- **SUBMITTED 10-03 ~08:20 UTC, in review with Google** (14 changes; quick checks passed): closed test "1.0 closed test" with bundle **37.1.0.55** (versionCode 37000055, main `bf0a916`, run 37108524303, artifact 11268548375; manifest checked: no READ_HEART_RATE, the 4 kept permissions present), 17,807 devices, Health Connect declaration (4 reasons as in PLAY-SUBMISSION) and Foreground service declaration (task "Other", video link held by the owner) filled. Google emails the owner when the review ends; then he shares the opt-in link (Testers tab) himself. He plans to install the Play build himself (told: Export backup first; never uninstall before a backup).
- **Was waiting (done):** the first bundle built after PLAY-HR merges (below). Then the owner uploads it to the draft, fills the **Health Connect** declaration (4 permissions; reasons in PLAY-SUBMISSION "Health apps declaration") and the **Foreground service** declaration (Connected device; text in PLAY-SUBMISSION; he has recorded the video and holds the unlisted YouTube link: never write it in the repo), then sends the release for review. Production access needs 12+ testers opted in for 14 continuous days.
- **Never** send a bundle that declares `android.permission.health.READ_HEART_RATE` (D-PLAY-HR-1). Check the manifest of the downloaded AAB first (`bundletool dump manifest`).

**PLAY-HR #202: MERGED 08:05 10-03** (main `bf0a916`; review PASS @ `7aadb4f`, 0/0/1/1; builder and reviewer archived). Review follow-ups: Medium = `docs/PRIVACY-POLICY.md:14` still lists Health Connect "heart rate" (policy text is the owner's: proposal 4 in #198's body, to put to him with the next policy change); Low = `docs/PLAY-SUBMISSION.md` "until PLAY-HR removes it" is stale (fix in the next docs push). Card history: removes the unused Health Connect `READ_HEART_RATE` (D-PLAY-HR-1, from the #198 pre-verdict). Builder session_01EC3tqWMPWU1BfS5UXToVhg (Sonnet, paused at `540ddd7`, all 6 steps done, tests red-before/green-after). Supervisor commits: `c7db41c` (.github checks: require the 4 kept permissions, fail if READ_HEART_RATE returns), a merge of main `ff9b243`, and a docs line → head **`7aadb4f`**. Reviewer session_0192fzKveiUVwHJGB6yQhqXS (Opus) reviewing; CI watched by `ci-watch.sh PLAYHR:7aadb4f…`. **Next:** on PASS + all checks green on a head that contains main → merge (single-PR merge, Play lane, `expectedHeadSha`) → main's "M/ARC Play bundle" run → verify no READ_HEART_RATE in the AAB manifest → send the owner the AAB link + main's gate APK (fingerprint step success) with "what changed / what to check".

**Paused cards (stop points; all on this account's sessions):**

| Card | PR @ head | Stop point | Next |
|---|---|---|---|
| HT-10 (finish line) | #166 @ `ca313c7` | **READY 05:59** (main 000918e in; gate kept both sides). Reviewer session_01JCTQ1so1qCTyp8CFLTE1mP never started (held for "resume"). | Fresh Opus reviewer on `ca313c7` (merge latest main first if needed). On PASS: CI on #201 with `HT10_LEGS=4`, train, APK, then the finish-line message (PROMPTS.md 10c), then the audit lane. |
| HT-10 CI wiring | #201 @ `05857ad` | main `c1af1e4` + HT-10 `ca313c7` + `ht10-gate` job (matrix 1/2, 2/2 × UTC, Pacific/Auckland; `MARC_HT10_OWN_JOB=1`; android-gate needs it). Guard passes locally; CI not run. | Re-cut on latest main after HT-10's review; this is HT-10's train. |
| BUG-38 next split | #199 @ `5e32ba4`+ | Builder session_01EnR7H5xDTSzN1Sbgrf2M2D was still working at 07:17 (merged main); pause sent 07:3x, read its Paused note. Rulings D-BUG38-1/2/3 on #199 (04:42). Design: `docs/supervisor/verify/BUG-38.md`. | Finish card → READY → fresh Opus reviewer → train → APK. UI-R03 folds in. |
| GATE-FLAKE-1 | #179 @ `4ca1720` | READY; reviewer session_014cQmrZM77vAkPrHgDk9po2 posted **REVIEW PAUSED** 06:30 with what it checked. | Fresh Opus reviewer continues from that note. |
| LIB-12 | #191 @ `1ff38b6` | READY; reviewer session_0138fzEdbjLMnoWd2DXwSexe posted **REVIEW PAUSED** 06:28. | Fresh Opus reviewer continues from that note. |
| LIB-7 | #193 @ `313bc81` | READY was posted for `aacebf5` (04:15); `313bc81` (04:18, joint check) came after. | Builder confirms READY on the real head; fresh Opus reviewer; then a fresh calibrated R8 critic. |
| LIB-8 pilot A | #109 @ `fdb5d4e` | **Paused WIP** 06:27 (specs only; `pilot-a/out/` stale). Critic `wf_68d0322c-0a2` on `bdd511ce`: VALID, **16 of 17 pass**; barbell_overhead_press below the bar (R5 3, R7 3). | Builder finishes the round in the 10-03 #109 supervisor comment (OHP fixes; H3 bench/shoulder press; shrug: report the sourced elevation first, check unchanged), then PILOT SHEET READY → fresh calibrated critic. |
| LIB-3 | #180 @ `4540d82` | delta PASS 10-02. | Frozen until its merge turn (after HT-10, LIB-2). |
| Research W1 | `claude/libht-research` @ `03d0e2e4` | W1A + tempo merged after recheck PASS (22/22 fixed, 276/276 quotes verbatim). | 7 Lows + 2 older items listed in `docs/research/howto/verify/w1.md` → one small writer round (band grip wrap choice goes to LIB-7). |
| GATE-SPLIT, LIB-2 enabler | #194, #189 | idle until HT-10. | unchanged |

**Not started / parked:** improvement-audit lane (26 confirmed audit-3 bugs, `docs/supervisor/verify/audit-3-confirm.md`; starts at the finish line, privacy and data first); ERR-CONTRACT card (8.0a row); Gym Finder (parked); PREMIUM/PAY (owner).

**Routines on this account (invisible to the other account):** `trig_016ECwLTU7XRLzsYVRrwLTGe` hourly loop (disabled); `trig_01PwNaFDcaAkLKMsYM6Q6Ssm` Huawei check, fires once 2026-10-13 09:00 UTC (the owner can disable it here if unwanted).

### 8.0a PAUSE (owner, 10-02 13:57 UTC; historical, see 8.0b)
- **Owner:** "After this batch. Pause all work. As i am trying to create new animation with meshy on how to". The batch = HT-9 only: its delta review (PASS 14:5x @ `dc73c32`, 0/0/0/1), train 11 (HT-9 #113 + #186 + this handover #183), CI, merge, APK to the owner. Then everything stops.
- **Batch done 17:00:** train 11 #195 merged at 16:05 (main `000918efdf87974931ad1a630dd0bc5839b6285d`, all 4 checks green on train head `f1f5195`). APK: main's gate run 37031786763, artifact MARC-DEBUG-APK 11240393150, fingerprint step success; sent to the owner 17:0x. Relay HT-9 done. HT-9 builder and reviewer archived. Routine `trig_016ECwLTU7XRLzsYVRrwLTGe` disabled 17:00.
- **Second pause, 10-02 ~17:30:** the owner reported BUG-38 from his phone and asked to fix it and related bugs and to confirm the audit findings (17:1x). Then: "Pause everything for now. Byt save ur progress". Both in-chat workflows were stopped, the /loop was stopped, and the progress was saved to `docs/supervisor/verify/` and `docs/supervisor/workflows/`.
- **Resumed 10-03 04:05 (owner: "Continue alk workers"):**
  - routine re-enabled and `monitor.sh` re-armed;
  - resume messages to HT-10 ("HT-9 merged", main `000918e`), GATE-FLAKE-1, LIB-7 (LIB-12's asks plus the discarded R8 critic's findings) and LIB-12;
  - in-chat workflows resumed: BUG-38 design `wf_335c9c91-d12`, audit confirmation `wf_1b1d1523-fe5` and pilot A critic `wf_3a60c2a3-e4c` (args `{scratch}`);
  - new: LR-29 verify of W1A + tempo on `claude/libht-verify-w1` @ `2815c124` (research plus W1A `7fdc9425` plus tempo `16558393`, merge commits), workflow `research-verify.js` (`wf_14147665-13f`).
- **Resume only on the owner's word.** Then: (1) re-enable `trig_016ECwLTU7XRLzsYVRrwLTGe` (`update_trigger enabled=true`); (2) re-arm `monitor.sh`; (3) read every row below live (`git ls-remote`), then send each paused session one resume message (one-shot trigger), in 8.7 order. HT-10 gets "HT-9 merged" first: it is the finish-line card.
- **Why paused:** the owner is trying Meshy-made animations for the How-to (his own experiment, repo Watch-test, session_01H2ZgdD61dVdfPNnwywv13H, not ours). If he picks Meshy output for plates, that is a new provider and a plate-pipeline decision (plan 2.8, golden A/B byte-locked): a design card and his yes come first; nothing is swapped silently.

| Task | Session | Stop point (pushed) | Next on resume |
|---|---|---|---|
| HT-10 #166 | session_01ShBYNJXt2nMtX1YLqpodA7 | idle; holds 2 local commits (`1988e4a` + long-task window fix), never told "HT-9 merged" | send "HT-9 merged" (train 11 sha): push, merge main, READY → fresh Opus reviewer → `ht10-gate` wiring (8.7 step 6) |
| HT-9 #113 | session_01PnsUw3z3cqLz3qrELXJsm8 | done at `dc73c32` (merged in train 11) | archive after the merge; its Low (A5 "looks exactly the same" wording) rides HT-10 or the next push touching those lines |
| GATE-FLAKE-1 #179 | session_01SHiSom5mnPpU198y2QLsUw | **Paused** `891bd46` (17:01, #179 comment): main 000918e already merged in; `npm run check` 2610 and `test:tz` pass | read its #179 comment for the load-run numbers and next step; then READY → fresh Opus reviewer |
| LIB-3 #180 | session_01WTJ7zrNgXsvYij39bHCrLN | **delta PASS @ `4540d82`** (14:2x, 0/0/0/0); reviewer archived | frozen until its merge turn (after HT-10, LIB-2); then rerun the pilot A scorecard on `4540d82` |
| LIB-7 #193 | session_01GaUBBUdEvc7JYd3caGTHwF | PAUSED `f971270`: mechanism, 4 drawn keys + band gap, G1-G9, sheet `--calibrate/--plant/--critic`, 28 tests, its gate block passes both browsers | LIB-12's 2 asks (diameter only for radial; sweeps filter by owner + joint no-overlap check), full check/gate, a fresh calibrated R8 critic |
| LIB-7 R8 critic | (in-chat, discarded) | run started before the pause **discarded** under plan 3.4 (both approved pairs < 4; 1/2 plants) | its findings, checked first: concentration/bayesian curl orientation unstated (research or gaps); hammer curl "YOU ← MACHINE" label wrong for dumbbells; push Right heel vs mid-hand; rope knob does not read; Wrong label wording |
| LIB-12 #191 | session_01PsmZzeKjrgwWHjNntDBpMD | PAUSED `3d70a94`; pilot A cupped (goblet) + front-rack renders posted on #109 | add them to the pilot A sheet; continue its card |
| LIB-8 pilot A #109 | session_01XaegSQJXRSyfX5CyGxkfRk | idle at `1da9014`; critic `wf_3a60c2a3-e4c` **stopped** at 13:59 | resume the critic with `resumeFromRunId` (prep cached; script `pilot-a-critic.js`); then per-exercise approval or a fix round |
| W1A research | session_01PtjyPPiXjaD1z4XjCuzrvL | PAUSED `7fdc9425` on `claude/libht-research-w1a`: 7 full cards (push_up, seated_leg_curl, crunch, side_plank, russian_twist, weighted_dip, ab_wheel_rollout) + resistance_band_row band-hand claims c11-c14; fetcher 195/195 verbatim | Opus verifier with plants (LR-29) → fixers → recheck → merge into `claude/libht-research` |
| W0A tempo research | session_01MyriU6AJd74orFg41trqrm | PAUSED `16558393` on `claude/libht-research-tempo`: plank c12; mountain_climbers c13/c14 (by time, no steps per second); reverse_lunge c15/c16 (3 s down only from a tempo progression); box_jump gap | supervisor ruling on reverse_lunge's 3 s, then the verifier (with W1A or alone) |
| LIB enabler, GATE-SPLIT | session_01SFDFkUMFSboiREUAPVWPa2, session_01Nf1EpvrcLEJ3uR8fW6zFW7 | idle until HT-10 | unchanged |
| BUG-38 next split (owner 10-03 phone report) | supervisor | Investigated: `nextScheduledSplitFor` is a weekday-only lookup (`src/escobar/tools/context.ts:58` → `src/brain/readiness.ts:327`). Owner scope (17:1x): "fix this only or found any other bugs related" + confirm audit findings. Design workflow stopped before the designer finished. All saved in `docs/supervisor/verify/BUG-38.md`; Relay BUG-38. | resume the design (`next-split-design.js`), fold in UI-R03, card → Opus builder → review → train → APK |
| Audit confirmation (#192 audit 3 + #149) | supervisor | 2 of 8 groups verified before the pause: coach-consent, and coach-facts (IMP-E01, IMP-E05, ENG-01 all CONFIRMED). data and timing stopped mid-run (scratch tests saved); 4 groups not started; skeptic not run. Saved in `docs/supervisor/verify/audit-3-confirm.md` + `a3-tests/`. | finish the 6 groups + skeptic (`audit-3-confirm.js`), then list confirmed bugs for the owner; related ones join BUG-38 |
| Hourly routine | `trig_016ECwLTU7XRLzsYVRrwLTGe` | **disabled** 17:00 | re-enable on resume |
| Error reports (owner Q 16:15) | in-chat workflow `wf_7fdf54b9-ae5` (3 Opus investigators + Opus judge) | **Proven end to end by the owner 16:50:27 UTC**: his restore of a non-backup JSON stored 1 row (kind `backup`, route `settings`) in D1 `marc-errors`; so the Worker secret is set and the gym hour's 0 rows meant no failures. The supervisor's zero-write probe was refused by the auto-mode classifier and not retried. | new card **ERR-CONTRACT**: a test that runs an app-built report (`src/errors/scrub.ts`, `installId.ts`, `sender.ts` body) through `escobar-worker/src/errorsValidate.ts` `validateBatch`. No test does today, and a mismatch is a 400 that the app deletes silently (`sender.ts:85-87`). App-side test only; no Worker change. |

### 8.0 Focus and finish line (owner, 10-01; read first)
- **Takeover (10-02).** The owner paused all work at 18:17 UTC on 10-01 because of the old account's usage limit (W0B commit `c2f3dfbc`: "Paused by the owner (2026-10-01 18:17 UTC)"); workers posted PAUSED notes at 18:20. On 10-02 at ~07:47 he started a new supervisor on his other account with: "Read my repo. And continue based on lastsupervisor  handoff progress / Follow agents.md". The new supervisor is session_01FTBsxoLN135B3HvJ7sT676 (env `env_01G5Xfb4KD41z5wLtxq6nCAU`). Every old session and Routine is on the old account and unreachable from here (10.2a applies).
- **Owner, 10-01 ~01:15:** "Park this audit improvement for now. Lets finish all the how to do first. And all the first audit fixes."
- **Owner, 10-01 ~01:30:** "Remind me when we finished all of the how to. And all first audit 32 items. Then after that we proceed."
- **First audit: COMPLETE since 10-01 07:56** (train 5). 31 of 32 fixed on main; DEV-01 closed by the owner's "skip" default.
- **Finish line now waits on HT-9 → HT-10** (HT-8 merged in train 10; earlier HT cards are merged). Then: push notification + chat message (DEV-01 closed by his decision, Gym Finder parked for a talk, the optional golden update in 8.6), then start the parked improvement audit (#149, AUD-13..19).
- "How-to" means the HT lane to milestone M1. The 153-exercise library (LIB lane) is the next How-to stage; it builds early in free slots and merges after HT-10 in the plan's order.
- **Gym Finder: PARKED, also after the finish line** (owner 10-01 07:30). No card, builder or research for #158 / GYM-0..6 without his approval.
- **Usage (owner 10-01 08:10):** no throttling beyond AGENTS.md.
- **Owner chat (owner 10-01, recorded on the unmerged branch `claude/sup-agents-chat-rule`, see K14):** write to him only for a new APK, a problem no agent can solve, a choice only he can make, or the finish-line reminder.
- **Merge trains:** every app PR merges through a train (6.8).

### 8.1 Main
- **Head:** `000918efdf87974931ad1a630dd0bc5839b6285d` (train 11 #195, 10-02 16:05: HT-9 #113, #186, handover #183). Before it: `36b4b3f` (#185 owner chat rule), `94fd32c` (train 10 #184, HT-8, 09:40). APK for train 11: run 37031786763, artifact 11240393150 (fingerprint success; sent 17:0x). Older merge/APK records below remain historical.
- **Merged on 10-01 (UTC), newest first:**

| Time | Merge | Carried |
|---|---|---|
| 17:48 | train 9 #182 `9ca7f07` (`3e9cca3`) | COPY-2 #168, HT-7b #178, handover (`claude/sup-handover-1700`) |
| 15:12 | train 8b #177 `fc38fb8` | BUG-37 #173, handover (`claude/sup-handover-1340`). Train 8 failed: COPY-2 x BUG-37 swap (section 9) |
| 13:36 | train 7 #175 `1c5504f` (`3077ba7`) | HT-7 #119, SUP CI limit #174 (D-SUP-CI-1), handover #172 |
| 09:40 | train 6 #170 `1fcd9c8` (`c10bb91`) | BUG-36 #163, handover #171 |
| 07:56 | train 5 #169 `958a3de` | AUD-20 #162 |
| 06:42 | train 4 #167 `6a3b6b0` | AUD-12 #156, AUD-11 #159, handover #165 |
| 05:52 | train 3 #164 `170b828` | AUD-10 #157, HT-6 #112 |
| 05:05 | train 2 #161 `b795f16` | AUD-1 #146, AUD-4 #154 |
| 04:30 | train 1 #160 `29ab29a` | HT-5, AUD-5, AUD-2, AUD-9, BUG-35, BUG-34, AUD-7, AUD-6, AUD-8, ESC-REPORT app, handover #136 |
| 03:46 / 03:15 / 02:40 / 01:58 / 01:07 / 00:34 / 00:03 | COPY-1 #137, HT-4b #140, HT-3c #143, AUD-3 #145 (Worker), DOC-REPORT #127, BUG-32 #131, BUG-31 #132 | |

- **APKs (main's "M/ARC gate" run, artifact MARC-DEBUG-APK).** Trains 1-6 sent (runs in git history of this file at `2a925d2`). Trains 7 and 8b: sent on 10-01 (per the 17:05 handover; run ids not recorded). **Train 9:** run 36902061299, artifact 11185855693, fingerprint step success; sent by the new supervisor on 10-02 (the old one had stopped before main's run finished at 18:30).

Link form: `https://github.com/macdarenz-droid/M-arc/actions/runs/<run>/artifacts/<id>`.

### 8.2 Finish-line checklists (heads and CI checked 10-02 07:55)
**How-to lane, merge order: HT-8 → HT-9 → HT-10.** One train may carry several of them, in this order.

| Card | PR @ head | State |
|---|---|---|
| HT-3c..HT-7 | #143, #140, #116, #112, #119 | merged (HT-7 in train 7) |
| HT-8 feel map and shimmer | #111 @ `0346aca` | **MERGED** in train 10 (#184 → main `94fd32c`, 10-02 09:39; all 4 checks green on `9af002f`). Relay done. APK: main's gate run 36991137718 on `94fd32c` (apk-watch `branch=main`, see 9). |
| HT-9 setup and risks | #113 @ `dc73c321f4451cc733faed5e7996de4849be4fe3` | **MERGED** in train 11 #195 (main `000918e`, 16:05; APK run 37031786763). **Delta PASS 14:5x** (0/0/0/1; reviewer session_01FpbfdE7YTPoy5DCMtw5xMC). Merged in **train 11** (with #186 and this handover branch #183, which carries #187). The Low (A5's "looks exactly the same" lines in `scripts/screenshot-gate.mjs` and `docs/COACHING-DECISIONS.md`: styles same, compositing differs, no compare reads `.feel`) rides the next push that changes those lines. |
| HT-10 sweeps, speed, release candidate | #166 @ `038cd4f` | Builder session_01ShBYNJXt2nMtX1YLqpodA7 holds 2 local commits (`1988e4a` D-HT10-A5c-2, plus the 09:33 long-task window fix: count only tasks with startTime ≥ window start in `harness.mjs`, routed from GATE-FLAKE-1). Waits for the supervisor's "HT-9 merged". Then READY → fresh Opus reviewer → supervisor `ht10-gate` wiring (8.7 step 6). Possible new flake outside GATE-FLAKE-1: BUG-34 launch first frame on `038cd4f` (job 110762812501), not verified. |

**Golden-B follow-ups, before M1 is called done (through plan 2.8):**
1. Seated cable row setup[4] "It's hardest at the start.": confirm against cronin2007 or drop it.
2. A feel-note naming the brachialis helper on lat pulldown and seated cable row. It removes both `GOLDEN_B_UNNAMED` entries in `tests/howto/feel.test.ts`.
3. With them: the cite text differs across golden-B files for difonza2026 and weiss1995 (research data only), and the HT-5 card's A4 example cue is stale (golden B: "Heel of palm, wrist straight.").
4. COPY-2's How-to heading list (not edited, golden B owns it): "Hand: right and wrong", "Look closer", "If you feel it in", "Option: thumb over the bar", "Thumb options, seen from the side".
5. HT-9's "Set it up" and "Risks and when to stop" break the owner's heading rule; both are golden-B copy (HT-9 ruling 7, 08:38).
6. Seated cable row (golden B): the dashed start ghost leans the torso about 12° forward (head about 45 px ahead of the finish head), while its own copy says "Sit tall; no rocking". 3 of 3 blind critic runs on pilot A `ae7c8c0` flagged it (R1=3), and the supervisor confirmed it on the render (10-03). Golden B is owner-approved and byte-locked, so it is recorded here and not changed. It is no longer used as a hidden calibration anchor (D-CRITIC-CAL).
7. Machine chest press (golden B): the Mistake "OFF THE PAD" barely reads. The red dashed upper back sits only about 8-10 px in front of the solid back, so the back still looks on the pad; only the head shift and the arrow carry it. 2 of 3 blind critic runs on pilot A `ae7c8c0` scored it R5=3, and the supervisor confirmed it on the render (10-03). Recorded, not changed, and no longer a hidden anchor (D-CRITIC-CAL2).
8. Machine chest press hand close-up (golden B): the Right says "HEEL OF PALM" but draws the handle inside the curled fingers at the front of the fist, the mid-palm fist of the lateral raise. 3 of 3 panel critics on LIB-7 `1114bc1` scored it C3 ≤3, and the supervisor confirmed it on the render (10-03 19:1x). Recorded, not changed. It is no longer a hidden anchor for the hand critic either.

**First audit, 32 findings (4 P1 + 28 P2): COMPLETE 07:56.**

| Card | Findings | PR | Merged |
|---|---|---|---|
| AUD-1 | SCI-01, SCI-02 | #146 | train 2 |
| AUD-2 | SEC-03 | #147 | train 1 |
| AUD-3 | SEC-01 (Worker) | #145 | `7477b5d` |
| AUD-4 | DATA-01, DATA-02 (+OBS-ENDPOINT, OBS-PHOTOS, OBS-LB) | #154 | train 2 |
| AUD-5 | REL-01, UI-10 | #148 | train 1 |
| AUD-6 | SCI-03, SCI-06, UI-07 | #153 | train 1 |
| AUD-7 | SCI-07, NAT-01..03 | #151 | train 1 |
| AUD-8 | SCI-04, SCI-05, SCI-08, UI-12 | #155 | train 1 |
| AUD-9 | SCI-09 (+OBS-EFFORTLABEL, OBS-THRESH, OBS-DRIFT, OBS-WEIGHT) | #150 | train 1 |
| AUD-10 | UI-01, UI-03, UI-05, UI-06, UI-09 (Train) | #157 | train 3 |
| AUD-11 | UI-02, UI-04, UI-11 (+OBS-TONNE) | #159 | train 4 |
| AUD-12 | UI-08, UI-09 (rest) | #156 | train 4 |
| AUD-20 | SCI-10, SCI-11 (+OBS-KNOW) | #162 | train 5 |
| decision | DEV-01 (Windows) | — | closed by the owner's "skip" |

**Follow-ups from audit reviews (optional Lows; improvement-audit lane unless noted):**
- AUD-10 (#157): Train.tsx `swappedFromToday` reads the swap for `today.value`, so a live session past midnight stops carrying the Escobar swap on the live card (no data loss). Fix: key it on the session's own day.
- AUD-11 (#159): the `bestReps === 0` guard in `isTimedOrDistanceCarry` (`src/brain/bodyweight.ts`) has no test; add "12 burpees in 60 s keeps bw × 12" to `tests/bodyweight.test.ts`.
- AUD-20 (#162): (1) `readiness.ts:105` one-night wording "over the last night" → queued to COPY-2's final push; (2) `rules.ts:276` / `weeklyReview.ts` "Below 60%" / "85% or more" literals beside the 0.6 / 0.85 checks → one named constant each; (3) D-AUD20-5 note that "sharp / spreading / with swelling" is general safety advice, not from Finucane 2020.

**Other open lanes (not in the finish line):**
- **Merged since 10-01 09:00:** BUG-36 (train 6), BUG-37 (train 8b), COPY-2 and HT-7b (train 9). The BUG-37 device check is the owner's (8.6).
- **GATE-FLAKE-1** #179 (builder session_01SHiSom5mnPpU198y2QLsUw, running): not READY; before/after statistics in progress (10:00: "main fails 28/28 L4 checks vs head 0"). 09:31 routing comment: the HT-3b A3 residual goes to HT-9 (D-HT9-A3b) and the `perf.mjs` `buffered: true` risk to HT-10 (both sent). On READY: a fresh Opus reviewer. It is the single owner of the flaky probes; LIB-4's K > 1 waits on it (plan 5.4).
- **LIB-3** #180 @ `6558d23`: **delta PASS 09:43 (0/0/0/0)**; reviewer archived; builder session_01WTJ7zrNgXsvYij39bHCrLN idle. Frozen until its turn (after HT-10 and LIB-2); its head predates main `94fd32c`, so main is merged in at its train.
- **LIB-6** #181 @ `9b8f76e`: PASS 09:02 with one Medium, ruled fix-before-merge; fixer added the anchor check to `npm test` (mutation red → green); **delta PASS 09:19** with one Low (D-LIB6-9 says "4 patch anchors", is 6: fix at its pre-merge main merge). Fixer and reviewer archived. Frozen until its turn.
- **LIB-8 pilot A** #109 @ `1da9014` (17 sheet plates; plates page `209cc0bf…`; held: dumbbell_fly D-LIB8-fly, rear-delt fly). History 10-02: critic on `c19805a` valid (13 pass, 4 below the bar); ruling **D-LIB8-floor** (floor-horizontal class: floor y≈1043, scale up to ×1.35 to fill width, F1 flag; #109 comment 5950197626); LIB-3 scorecard in scratch found real plate defects (H4 340 px overlaps on 11, reverse_lunge duplicate ids, shrug semicolon) and LIB-3 defects (below); fix round `1da9014` fixed critic items + H4/H2-ids/H8 (plank ×1.19, climbers ×1.31). Fresh critic `wf_3a60c2a3-e4c` resumed 13:5x after the usage pause (critic told to ignore tempo phases). Open before approval: H2 tempo for box_jump/reverse_lunge/plank/mountain_climbers (research, W0A writer), H3 short traces (shrug, plank), flags F2-F5 (supervisor), LIB-3 rerun after its fix. Cupped and front-rack close-ups (LIB-12) and band/curl/rope/EZ/D-handle (LIB-7) join the pilot A sheet. 0 of 19 approved; held count as 0.
- **Research wave 0 (LR-29): DONE.** Merged `claude/libht-verify-w0` into `claude/libht-research` @ `95342b11` (10:5x): 9 thin ids + 19 shared cards, critic 2/2 plants, recheck PASS, rulings R-W0-1..8 in `docs/research/howto/verify/w0.md` (R-W0-1 back box 50 words for this box only vs plan 8.6 default 30: owner sees it on pilot A). **Tempo research** (box_jump, reverse_lunge, plank, mountain_climbers) on `claude/libht-research-tempo` by the W0A writer. **Wave 1 (W1A)** writer session_01PtjyPPiXjaD1z4XjCuzrvL on `claude/libht-research-w1a`: pilot B ids (push_up, seated_leg_curl, crunch, side_plank, russian_twist), weighted_dip, ab_wheel_rollout, band-hand claims. Remaining cards to write later (after LB1): LB7 12, LB8 11, LB9 13, LB10 7 ids. Research prompts use curl, never WebFetch (it summarises with Haiku).
- **Library build-ahead (SPEED.md 2, 10-02):** LIB-2 design note **PASS** #189 @ `2b8f52e` + addendum `56d0c2e` (handpair chunk generator; reviewed with LIB-2 code); enabler session_01SFDFkUMFSboiREUAPVWPa2 idle until HT-10. **Engine spike** #190 `82ae2d4` ([do not merge]): pitch/roll/yaw/lat/volume trunk all GO or conditional; LIB-20 amended = one golden-update card; D-SPIKE-* are PROPOSALS until the supervisor updates plan 2.4/row 20 (after #188 merges) and the owner gives go/no-go on renders. **LIB-7** #193 radial hand pairs: design PASS `efd3182`, mechanism `39e793e`, building (session_01GaUBBUdEvc7JYd3caGTHwF). **LIB-12** #191 hand views/pairs: design 0/0/1/1 applied in build (session_01PsmZzeKjrgwWHjNntDBpMD), merges LIB-7 branch. **GATE-SPLIT** #194: owner yes 10:22; design FINAL `2d747b2` (~19 min per single push, ~30-35 when two overlap; .github add-only); builder session_01Nf1EpvrcLEJ3uR8fW6zFW7 waits for HT-10. **LIB-3** #180: PASS `6558d23`, then the pilot scorecard found 2 LIB-3 defects (dotted-id crash that also hid limbs from H1; H3 explicit-pose deviation 0) fixed at `00f9686`; ruling **D-LIB3-H9** (pin the measured no-poly moving types of the 8; remove 13 exemptions); then one fresh delta reviewer from `6558d23`. Option 2 (poly twins in vendored primitives) is on the owner's optional golden-update list with O7/O10/O11. **#192** audit 3 (owner's other agent, report only): its data-preservation findings open the audit lane at the finish line, each re-verified first.
- **Parked or not for merge:** #149 improvement audit (parked until the finish line); #158 Gym Finder (parked); #144 first-audit docs; #94 PREMIUM-PLAN and #92 PAY-1 (owner decisions); #88 Watch docs (waits on Huawei); #3 watch agent's PR (never merge); #1 stale.

**Known transient on main:** the 13 handling-mistake "Show me" buttons should open now that HT-7 (their posture close-ups) is merged in train 7. Not verified by the new supervisor; HT-10's replacement builder checks it on the full sheet (its step 2).

**Risks and mitigations:**
- **The old account wakes at its weekly reset (2026-10-03 11:00 UTC).** Its hourly loop `trig_01CtcvAE1PGAtH4dkxLVQZsR` would wake the old supervisor, and two supervisors would run; old builders could push to the same branches. Mitigation: the owner disables the old account's Routines (asked 10-02, 8.6); every replacement builder runs `git pull --no-rebase` before each push and never forces; each tick compares card branch heads with the last push from a new-account session.
- **GitHub PR events do not reach this account** (`subscribe_pr_activity` returns "Could not subscribe to this PR" for every PR). Mitigation: `monitor.sh` under the Monitor tool is the PR watch, re-armed every tick and on expiry; CI is read by polling (`ci-watch.sh`). The owner can fix it by connecting GitHub on this account (8.6).
- HT-8's D-HT8-2 changes how its probe loads the feel chunk. Mitigation: the reviewer must prove it does not loosen the probe (a mutation that removes the early-tap fix goes red on both browsers).
- LIB lane size: ~290 KB raw / 64 KB gz per exercise → 153 exercises ≈ 44 MB raw / 9.8 MB gz (plan 8.10: 8-11 MB). Shared parts first; a download server only with the owner's OK.
- Account switch again: in-chat workflows, monitors and scratchpad files are lost. Mitigation: this file, `PROMPTS.md`, `docs/supervisor/scripts/` and `docs/supervisor/workflows/`.

### 8.3 Sessions (M/ARC, new account; status at 15:05 10-02: all paused, see 8.0a)
| Session | Role | Status |
|---|---|---|
| session_01FTBsxoLN135B3HvJ7sT676 | **Supervisor** (branch `ccr-4fb3081a-9puaq1`) | running |
| session_01PnsUw3z3cqLz3qrELXJsm8 | HT-9 replacement builder (catch-up) | resumed 13:50 |
| session_01ShBYNJXt2nMtX1YLqpodA7 | HT-10 replacement builder | idle, holds 2 commits for "HT-9 merged" |
| session_01SHiSom5mnPpU198y2QLsUw | GATE-FLAKE-1 builder | resumed 13:50 |
| session_01WTJ7zrNgXsvYij39bHCrLN | LIB-3 builder (H9 ruling) | resumed 13:50 |
| session_01XaegSQJXRSyfX5CyGxkfRk | LIB-8 pilot A builder (drawing lane 1) | idle, waits for the critic |
| session_01GaUBBUdEvc7JYd3caGTHwF | LIB-7 builder (drawing lane 2) | resumed 13:50 |
| session_01PsmZzeKjrgwWHjNntDBpMD | LIB-12 builder (drawing lane 3) | resumed 13:50 |
| session_01SFDFkUMFSboiREUAPVWPa2 | LIB enabler (LIB-2, LIB-20 amended) | idle until HT-10 |
| session_01Nf1EpvrcLEJ3uR8fW6zFW7 | GATE-SPLIT builder | idle until HT-10 |
| session_01MyriU6AJd74orFg41trqrm | W0A writer (tempo research) | resumed 13:50 |
| session_01PtjyPPiXjaD1z4XjCuzrvL | W1A research writer | resumed 13:50 |

Archived 10-02: HT-8 reviewer, LIB-6 reviewer and fixer, LIB-3 reviewer, W0B fetcher and fixer, LIB-2 design reviewer, LIB-7/LIB-12 joint design reviewer, GATE-SPLIT design reviewer. Not ours: session_01H2ZgdD61dVdfPNnwywv13H (the owner's Meshy experiment on repo Watch-test).

**Old account (unreachable; never message or merge on their word):** supervisor session_01Tc7uLSdp7LGknt8xc1i9dc and its 10-01 builders and reviewers. Only the owner can archive them.

### 8.4 Routines and workflows
| ID | What | When |
|---|---|---|
| trig_016ECwLTU7XRLzsYVRrwLTGe | "M/ARC supervisor loop", the hourly tick into session_01FTBsxoLN135B3HvJ7sT676. Its prompt is 10.4 step 3's text, updated 10-02: HT order HT-8 → HT-9 → HT-10, the owner-chat rule, the library delegation. | cron `58 * * * *` |
| trig_01PwNaFDcaAkLKMsYM6Q6Ssm | Ask the owner once whether Huawei replied (PR #88). | once, 2026-10-13 09:00 |
| (old account) trig_01CtcvAE1PGAtH4dkxLVQZsR, trig_01P25Eg4YpbtXMwpihA3hVCP, trig_01XBaJHD9jyLEXPUdpMpykLo | The old hourly loop, the HT-7 builder's self check-in, the old Huawei check. Only the owner can disable them (8.6). | — |

**In-chat workflows in the supervisor session** (lost on an account switch; scripts in `docs/supervisor/workflows/`):
- `wf_3a60c2a3-e4c`: pilot A calibrated critic on `1da9014`, resumed after the usage pause. Script `pilot-a-critic.js`.
- Done 10-02: `wf_1d2fcf84-613`, `wf_d3676188-4dd` (pilot A critics), `wf_fefb97cb-981` (w0 critic), `wf_8a28ca54-d4e` (speed assessment → `SPEED.md`).

**Watchers:** `monitor.sh` under the Monitor tool (re-armed each tick, `SINCE` backdated). PR event subscriptions are unavailable on this account (8.2 risks).

### 8.5 Relay tracker
- 10-02 08:05: tracker items added: HT-8 (review), HT-9 (integrating), HT-10, GATE-FLAKE-1 and LIB-3 (running), LIB-6 (review). `PROJECT_STATE.md` rewritten (it dated from 09-30), with "last APK sent" = train 9. LOG line for the takeover.
- Earlier: COPY-2, HT-7, HT-7b, BUG-36, BUG-37 set to done on 10-01.

### 8.6 Owner to-dos (his side)
1. **Disable the old account's Routines** (open the Routines list on the old account): `trig_01CtcvAE1PGAtH4dkxLVQZsR` (hourly loop), `trig_01P25Eg4YpbtXMwpihA3hVCP` (HT-7 check-in), `trig_01XBaJHD9jyLEXPUdpMpykLo` (Huawei check). Before 2026-10-03 11:00 UTC. Asked 10-02.
2. **Network access for research: DONE 10-02 ~08:12** (the owner set Full; pubmed, acefitness.org and nhs.uk answer 200; web.archive.org resets connections). Was: the new account's Default environment (`env_01G5Xfb4KD41z5wLtxq6nCAU`, "trusted network access") blocks the research source sites (pubmed, ncbi, acefitness.org, nhs.uk, strengthlog.com, web.archive.org: proxy 403). GitHub, npm and the Chrome 153 download work, so builders and reviewers are fine. W0A and W0B are on hold until he sets Network access to Full (or adds the source domains) in that environment's settings. Never mark a source blocked by our own network as "unreachable".
3. **GitHub: connected** (the owner showed it on 10-02 ~08:12: account connected, Claude GitHub App installed on macdarenz-droid, M-arc reachable). `subscribe_pr_activity` still fails after that, so `monitor.sh` polling stays the PR watch. Do not ask him again.
4. **The owner-chat rule** (K14): **yes, 10-02 ~09:2x** ("Yes"). PR #185; merges when CI is green.
5. Phone checks: train 9 APK (COPY-2: shorter headings; the start sheet's target-load and warm-up cards show only their numbers); the BUG-37 four-way check (sheets slide up without a bounce, with reduced motion on and off); earlier trains' checks (carried from 10-01, not re-checked).
6. Approve, inside the builder session, any `tests/howto/budgets.json` raise the auto-mode classifier refuses (expected for HT cards).
7. Still open (carried from 10-01, not re-checked): REL-3 phone steps; OWN-1 offline key backups in 2 places; the pilot sheet answers (LIB-8; golden B approval D-LR23-2); DEV-CHECKS device list; Play Console developer name "Marc Darenz"; the parked decisions (ARCH-1, PAY-1, PREM-PLAN, K11); the closed test, then the store upload.
8. Optional, offered at the finish line: a golden update for D-HT10-C10, O7, O10 and O11.
9. Gym Finder brainstorm, when he wants it.

### 8.7 Next steps, in order
1. On wake: re-arm `monitor.sh` (backdate `SINCE`), read the latest comment on every open PR, check sessions for idle or blocked, read PR heads with `git ls-remote refs/pull/N/head`.
2. **#185 (owner chat rule, owner yes 10-02):** CI on `6b8e494` (main merged in); merge on all green (HANDOVER 6.8 rules, expectedHeadSha).
3. **HT-9:** on `HT-9 FIXED`, a fresh Opus delta reviewer (reads the 12:31 PASS and the 12:32 rulings). On PASS: train 11 = HT-9 + #186 (owner-approved AGENTS and skills text; its body asks for #185 first) + this handover branch (#183, which carries #187). APK after.
4. **After HT-9 merges:** message HT-10 to finish (push its 2 held commits, merge main, READY); fresh Opus reviewer; the supervisor's `ht10-gate` wiring (step 6 of the 10-01 list, kept below). Then the finish-line message (PROMPTS.md 10c).
5. **Library build-ahead (SPEED.md 2, 8.2):** LIB-7 READY / LIB-12 READY → a fresh Opus reviewer each; their pilot A renders join #109. LIB-3 FIXED (H9) → one fresh delta reviewer from `6558d23`. Tempo research and W1A → the LR-29 verify (planted errors) before merging into `claude/libht-research`. After #188 merges: update plan 2.4 and row 20 for LIB-20 amended.
6. **HT-10 CI wiring (supervisor, add-only):** branch `claude/sup-ht10-ci` cut from main after HT-9 merges; merge HT-10's final head into it with a merge commit; add job `ht10-gate` to `.github/workflows/build-apk.yml` (matrix `MARC_HT_SHARD` `1/2`, `2/2`, build then `node scripts/ht10-gate.mjs`, 25 min per shard); job-level `env: MARC_HT10_OWN_JOB: '1'` on `source-gate` and `visual-gate-tz`; add `ht10-gate` to `ci-watch.sh`'s required set.
   - **GATE-SPLIT** (owner yes 10-02 ~10:30; AGENTS.md exception): a builder writes the design note now (no code). It reuses HT-10's shard and proof mechanism (`tools/plates/fidelity/shard.mjs`, `writeProof`) and LIB-4's verdict pattern, so there is one sharding system. It is built after HT-10 merges, and its `.github` jobs are wired by the supervisor, add-only. It is relied on only after the equivalence proof in AGENTS.md. Target: about 45 → 25 min per CI run.
7. **Pilot A:** on the critic result and the scorecard, approve per exercise (owner delegation 10-01), or one more fix round; then the sheet to the owner.
8. **Research:** on the recheck PASS, merge `claude/libht-verify-w0` into `claude/libht-research` (merge commit), then record it in w0.md and here.
9. **#188** (owner-approved library-plan clarifications, base `claude/howto-options`): merge after CI is green, unless the owner says otherwise.
10. **Golden-B follow-ups** (8.2) through plan 2.8 before M1 is called done.
11. **Finish line:** when HT-9 and HT-10 are merged, push + chat to the owner (PROMPTS.md 10c), then start the improvement-audit lane (#149, AUD-13..19).
12. **Handover:** every merge train carries a handover commit; refresh at least every 3 hours. Refresh SPEED.md after LB1 and LB2.

### 8.8 Open conflicts (the inputs disagreed; resolve them live)
(K4 and K5 were resolved on 09-30 and removed.)
- **K1 · HT-4b position (settled 2026-09-30 15:40 by the supervisor).** The merge order is HT-4 → HT-3 → HT-3b → HT-4b → HT-5 → HT-6 → HT-7 → HT-8 → HT-9 → HT-10, with HT-3c (budgets) before HT-4b. Why: the HT-4b card puts its slot after HT-4 and before HT-5, and HT-5 must regenerate against HT-4b's re-vendored golden B. (Through HT-6 merged by 05:52 10-01; HT-7..HT-10 remain.)
- **K2 · Reviewer model.** The owner's 09-29 brief said Sonnet for "most reviews". AGENTS.md on main, the Routine and current practice use **Opus** for every reviewer and critic. Follow Opus.
- **K3 · Trigger lead time.** Supervisor `SKILL.md` and the owner say 1–2 minutes ahead. The supervisor's notes say 2–4. Both work if the time is in the future.
- **K6 · Owner quote times.** Relay records LR-23 at ~13:48, ESC-REPORT at ~14:55 and REL-3 at ~14:20. This file uses the chat times: 13:43, 14:41 and 14:14.
- **K7 · Privacy hosting.** `RELEASE-READINESS.md` lists "hosting the privacy policy" as an owner item. The policy page was deployed on 09-30 (DOC-3). Confirm the owner's OK is recorded before the next policy deploy.
- **K8 · Relay deploys.** `deploy-relay.yml` deploys whenever `relay/**` merges into main, but no rule says who merges those changes. Until the owner rules, do not merge `relay/**` changes without his yes.
- **K9 · Keystore handling.** AGENTS.md's Never list forbids touching keystore handling, but REL-3 added workflows that read the signing keystore. The owner's REL-3 decision (09-30) is the authority for those. The Never line has no exception note. Do not extend it.
- **K10 · Who merges Worker PRs.** AGENTS.md says "the owner merges". The owner's 09-29 brief ("On my yes for that PR, merge it") and his 09-30 15:15 delegation for #121 ("yes coach u merge it") have the supervisor merge after a per-PR yes. Follow: the supervisor merges only after the owner's explicit yes for that exact PR, quoted on the PR. Never merge one without it.
- **K11 · Escobar intelligence.** The owner asked on 09-29 11:25: "lets improve escobars intelligence and what else he can do." No card, lane or parked status was found for it. It is parked with PREM-PLAN here. Check whether PREM-PLAN #94 covers it (for example, the PREM-1 Opus switch) before giving it a card.
- **K12 · Effort rule.** The owner's 09-29 11:25 "Use opus max lower, sonnet medium lowest. For high outputs" has no agreed reading, and `create_session` has no effort field. Apply it where a tool takes an effort setting, once the reading is settled; record the reading in Relay LOG. (His 10-01 08:10 usage note does not settle it.)
- **K13 · The first-audit triage's "AUD-3" in the AUD-6 and AUD-8 notes** means the SCI-01 card, which is AUD-1 (recovery.ts). AUD-3 is the Worker quota. Builders were told; no card owns brain/history.ts. (All AUD cards merged by 07:56 10-01; nothing left to act on.)
- **K14 · The owner-chat rule (10-01 ~17:05).** The old supervisor wrote the owner's chat rule into `AGENTS.md` and `.claude/owner-rules.md` on `claude/sup-agents-chat-rule` (`d304455`, `e9f53fc`; the same commit is also on `ccr-5d6db1e6-5itr23`) but opened no PR, and the owner's verbatim words were in the old chat. Rule files change only by PR after the owner's yes (2.2). Until he says yes: follow its substance (it matches AGENTS.md's "short updates only when something important changed"), and keep the AGENTS.md text unmerged. Asked on 10-02.

---

## 9. Lessons and gotchas (the incident → the rule)

| Incident | Rule |
|---|---|
| 10-03 06:30: the pause list was built from sessions whose status was "working"; the BUG-38 builder looked idle, then woke on a queued message and kept pushing (07:17). | A pause goes to **every** non-archived worker session, idle ones included. |
| 10-03: a reviewer was created with a wrong branch name (HT-10's is `claude/ht-10-gate-sweeps`). | Read the branch with `git ls-remote` before `create_session`. |
| 10-03: `jarsigner -verify -strict` fails on a self-signed upload cert; a tamper that appends a directory entry still printed "jar verified." with an "unsigned entries" warning. | `scripts/check-play-signature.sh`: exact "jar verified." line, reject "unsigned entries", pin the signer. |
| 10-02 11:33-13:40: the account hit its 5-hour usage limit; every worker and the in-chat critic stopped mid-turn ("You've hit your session limit"). | After the reset, check every session's state, send each a resume message (check git state, re-run the cut step), and resume workflows with `resumeFromRunId`. Count the pause in the schedule (SPEED.md). |
| 10-02: a research writer's model usage showed Haiku: WebFetch and WebSearch summarise pages with a small model. 14:58: W1A and W0A usage still showed Haiku web searches (their prompts banned only WebFetch). | Owner rule: never Haiku. Research and review prompts say: never WebFetch **or WebSearch**; search and fetch with curl and quote from the raw text. Quotes were curl-checked (W1A 195/195), so the cards stand; only the search step used Haiku. |
| 10-02: `apk-watch.sh` on train 10's merge sha reported a *cancelled* run: a new branch cut from main (`claude/sup-skills-delivery-20261002`) had the same head sha, and its run was cancelled by the next push. | `apk-watch.sh` filters `branch=main` (10-02). Never send an APK from a run that is not main's. |
| 10-02: the research branch had no card checker; both w0 fixers wrote their own one-off scripts. | Research quality must not rest on throwaway scripts: a committed card checker (quotes verbatim, refs, orphans, ≤ 50 words, shown-line lint) is a planned improvement (SPEED.md, class I). |
| 10-02 speed assessment: 24 FAILs were tests that did not bite; 18 stale PR bodies; 12 FAILs only for "behind main". | PROMPTS.md P1/P4 now name mutations per criterion, require the HANDOFF refresh at READY/FIXED and include COACHING-DECISIONS.md in write_scope; the reviewer skill treats "behind main" as a note. Full analysis: `docs/supervisor/SPEED.md`. |
| The owner paused all work at 10-01 18:17 and the next supervisor started on another account. Workers had posted PAUSED notes, but HT-8's PR body HANDOFF was 14 hours stale (@ `f947395`), HT-8's last fix had no FIXED post, and the pilot A critic result existed only in the lost in-chat workflow. | On a takeover, rebuild each card's state from its latest comments, its commits after the last verdict (`git log <verdict sha>..<head>`) and CI on the head, not from the PR body. Put workflow results on the PR they decide as soon as they finish. |
| On the new account, `subscribe_pr_activity` failed for every PR ("Could not subscribe to this PR"). | `monitor.sh` under the Monitor tool is the PR watch; re-arm it on every tick and expiry. The owner can connect GitHub on the account to restore PR events. |
| Train 8 (10-01 14:21): COPY-2 and BUG-37 each passed review and CI alone. Together, BUG-37's swap guard failed: COPY-2 shortened the brief, so the swap direction flipped. The local train preview had run only typecheck and vitest. | Before opening a train that carries two cards touching the same flow, run the gate blocks of both cards on the local train branch, not just typecheck and vitest. |
| CI-only browser failures (HT-7, HT-8, 10-01). | CI's exact browser is downloadable: `https://storage.googleapis.com/chrome-for-testing-public/153.0.8010.12/linux64/chrome-headless-shell-linux64.zip` (verified reachable 14:30). Unzip it into the scratchpad and run the gate with `MARC_CHROMIUM=<dir>/chrome-headless-shell`. Reproduce on it before calling anything "CI-only". |
| BUG-37 (10-01): BUG-36's probe added the panel's transform `m42` to its layout top and ignored the dialog's own `scrollTop`. It "saw" a 629 px slide that the scrolling dialog cancelled, while the owner's phone showed a jump. | A motion probe measures the box on screen (`getBoundingClientRect()`, which includes every ancestor's scroll and transform) and asserts that each scroll container on the way stays still. Never a computed transform. |
| The supervisor ruled HT-7's label variance "local Chromium 141 only" from two clean CI runs (D-HT7-L3-text-8); the next CI run showed it on Chrome 153 too. | An intermittent failure is never disproved by a few green runs. Compare rates (bad/opens) over enough runs, and keep a check strict until the cause is fixed. Also: local containers run Chromium 141 (Playwright 1194), CI runs Chrome 153 (v1243); note the version when comparing. |
| Verdicts were missed: LT-2 for 1 hour (a connector reconnect), LT-3 for 40 minutes (wakes checked only CI). | Every tick and every wake reads the latest comment on every open PR before any merge step. |
| The REL-1 builder was blocked for 1.5 hours unseen. V1-07 and V1-08 never started. | Every wake checks each session for blocked or idle, and starts every card whose dependencies allow it. |
| One-shot triggers did not fire during the 09-29 14:00–15:30 outage. | Check that each pending trigger ran. Fallback: a PR comment. |
| A guessed `expectedHeadSha` gave a 409. | Never guess SHAs. Use `git rev-parse`. |
| The owner was told LT-5 was live, but nothing called it. | Grep for callers before calling a feature live. |
| A reviewer headed PASS with a blocker in the body. | The prompt says: "Use a PASS heading only when nothing is blocking." |
| V1-08's probes passed on static data. | Every probe must prove it saw real data. |
| Maven 403/429 errors in `android-gate`. | Re-run once, then root-cause once (Gradle cache #86). |
| The "Play under 44 px" flake. | It became BUG-26 (it was measured mid-animation). The bar stayed. |
| The GRIP-1 QA fixer replaced an approved plate view. | Every plate change needs a fidelity check against golden A: the bytes, plus 0 px. |
| Visual critic run 1 scored the hidden approved plates below 4. | Discard the run: the critic was stricter than the owner's bar. Rerun it calibrated. |
| #117 v1 was too loose; a reviewer's mutation proved it. | Tighten it. Every test must bite. |
| A pin scoped to "any plugin" let plugins extend `ids.ts`. | Scope pins exactly. |
| Re-serialising a JSON card made a 727-line diff. | Use exact string replacements only. |
| #93's `pages.yml` would have wiped the live website. | The policy moved to `/privacy/` (DOC-3). Check every Pages workflow. |
| A placeholder prompt "(see below)" was sent, and `sed` broke on "/". | Build prompts in Python and read them back before sending. |
| A 2-dot diff against main looked huge on a branch that was behind. | Judge a PR's scope with 3-dot (merge-base) diffs. |
| `git worktree add` failed. | Run `git worktree prune` first. |
| Two cards added the same heading to a shared doc. | Keep both and rename one. |
| Container restarts killed the monitors and in-chat workflows. | Re-arm them, backdate `SINCE`, check branch heads by hand, and resume workflows from the cache. |
| In-chat workflows run only 2 agents at once. | Put parallel work in cloud sessions. |
| The git proxy refuses tag pushes and branch deletes. | Use backup branches. Mark Relay items `[PAUSED]` instead of deleting them. |
| Auto mode refused WF-1's `AGENTS.md` and `.claude/**` edits, and REL-3's key handling. | Never work around it. The owner approved inside the builder session himself. |
| The owner asked for a workaround to the allow button (09-29 17:39). | Refused. Park the blocked item and do other work. |
| The supervisor made its own errors to the owner: costs priced for the wrong country, "lower the seat" (should be "raise"), an icon called "32-bit" (it is 24-bit, no alpha). | Check against the live source before telling the owner. |
| "Stop wasting tokens for now." | Pause the loop until he says continue. |
| HT-3b and other How-to cards collided over the same size ceilings. | Budgets now live in one place, `tests/howto/budgets.json` (HT-3c). |
| A reviewer was archived while its review was still in progress. | Check `post_turn_summary` and the posted verdict before `archive_session`. |
| A stray `node_modules` symlink sat on main undetected (#139). | Check the whole PR diff, not just the card's files, before merging. |
| The auto-mode classifier read a `tests/howto/budgets.json` ceiling raise (D-HT3c-1) as a test removal and blocked HT-6. | Never work around it, by any agent. Ask the owner for one approval message in that builder's session, naming the exact entries and values. Expect the same for later HT cards. |
| Builders ended their turn "waiting on CI" while android-gate sat queued for over an hour, so READY was never posted. | Builders post READY on local checks plus source-gate and visual-gate-tz; the supervisor checks android-gate before merging. Nudge idle "waiting on CI" sessions on every tick. |
| The 01:00 handover said AUD-1 and AUD-2 had passed review; neither had a verdict yet. | Write a state line only from a verdict comment you have read at that head. |
| A builder's FIXED comment printed a wrong full SHA (AUD-11: `caee83f3ea09…`; the real head was `caee83fdf3fa…`), and the supervisor passed it on to the reviewer. | Before triggering a reviewer or a train, read the head with `git ls-remote origin refs/pull/N/head`; never copy a SHA from a comment. |
| HT-8 put its review fixes inside its main-merge commit (`b2ab38c`), so there was no fix commit to diff. | Tell the reviewer, and have it diff the fix files against the pre-merge head and check the merge resolution with `git diff <main> <head> -- <file> \| grep '^-'`. |
| Two cards' gate blocks were both appended at the end of `scripts/screenshot-gate.mjs`, so every train with both conflicts there. | Resolve as "keep both", with the checks in 6.8 step 4. Anything beyond that drops the PR from the train. |
| With 15+ runs queued, one merge per CI cycle could not keep up, and standalone runs on heads already in a train held the queue. | Merge trains (6.8). Cancel runs on superseded heads (6.6). |
| Background CI and APK watchers were killed at 30 minutes (the Bash default) while CI was still queued. | Start `ci-watch.sh`, `apk-watch.sh`, `deploy-watch.sh` and `branch-watch.sh` with `run_in_background: true` and `timeout: 7200000`. Re-arm `monitor.sh` every 30 minutes. |
| A one-shot trigger was sent at 09-30 23:33 with `run_once_at` 23:25, a time already past, and had to be sent again. | Work the time out right before the call: `date -u -d '+2 minutes' +%Y-%m-%dT%H:%M:00Z`. Then check `last_run`. |
| A registered-kind filter for the 13 dead "Show me" buttons (HT-7 not merged) looked like a safe guard, but it would have changed the Grip section, which must stay at 0 px against golden B. Not shipped. | Before shipping any UI guard or quick fix in the How-to sheet, list the fidelity states it touches (`goldenB.mjs` `statesFor`, golden A L1–L3) and run the gate. A transient that the next card fixes waits for that card. |
| Scratch worktrees for train builds and test runs need `node_modules`; a symlink to another checkout is the quick way, and one such symlink once reached main (LIB-26, 09-30). | `.gitignore` says `node_modules` (no slash), so the symlink is ignored. Check with `git check-ignore node_modules` and read `git diff --stat` before every commit. Never commit it. |

More incidents: `.claude/skills/supervisor/gotchas.md` and `.claude/skills/builder/gotchas.md`.

---

## 10. Transfer checklist for a NEW Claude account

### 10.1 What the owner must connect on the new account
1. **GitHub:** the Claude GitHub app with access to `macdarenz-droid/M-arc`, and the GitHub MCP connector. The new account needs push to `claude/*` branches, PR comments, `merge_pull_request` and the Actions tools (`actions_list`, `actions_run_trigger`). For how-tos, read the docs topic `github.access`.
2. **Relay:** the MCP server "2nd Supervisor M/ARC". The owner adds it himself, because its URL holds a token; never paste the URL into chat, a PR, a prompt or the repo. Check that the `…2nd_Supervisor_M_arc__*` tools appear. If they are missing, follow section 0, step 6 (a "Relay backlog"; do not wait).
3. **A Claude Code Remote cloud environment** that has:
   - network access to GitHub and its API;
   - the agent proxy's GitHub auth for plain `curl` calls. The watcher scripts need it: with it the limit is about 15,000 calls/h; without it, 60/h, and `branch-watch.sh` alone makes about 400 calls/h (10 branches every 90 s). Never commit a token to make them work;
   - Chromium at `/opt/pw-browsers/chromium` for the gate;
   - Node and npm.
   Get its new `env_…` id with `list_environments`.
4. **Models:** `claude-opus-5-5` and `claude-sonnet-5` must be available.
5. **The supervisor session runs in auto mode** (see 10.4 step 1).

### 10.2 Stop the old supervisor first (one supervisor only)
On the old account, the owner or the old supervisor:
1. Has the old supervisor push a last handover update (section 11), so this file and section 8 are current.
2. Disables `trig_01CtcvAE1PGAtH4dkxLVQZsR`, the hourly loop. Otherwise it keeps waking the old supervisor and two supervisors will run.
3. Disables every pending one-shot trigger (`list_triggers`), including `trig_01XBaJHD9jyLEXPUdpMpykLo` (the Huawei check, recreated in 10.4) and `trig_01P25Eg4YpbtXMwpihA3hVCP` (the HT-7 builder's own check-in, 8.4).
4. Tells the old supervisor to stop.
5. Tells running builders to push their work, then archives every M/ARC worker session from the old account. The new account cannot archive them. Never archive other projects' chats or chats the owner started.

### 10.2a If the old account cannot run (usage cap, no access)
Then nobody can push the last update, disable triggers or archive sessions from it. When its limit resets (2026-10-03 11:00 UTC), the hourly loop and the HT-7 check-in can wake the old sessions: two supervisors, and two builders on one branch.
- The owner disables every Routine in the old account's Routines list as soon as he can: `trig_01CtcvAE1PGAtH4dkxLVQZsR` (the hourly loop), `trig_01P25Eg4YpbtXMwpihA3hVCP` (the HT-7 check-in; it re-arms itself) and `trig_01XBaJHD9jyLEXPUdpMpykLo` (the Huawei check).
- Until he confirms, treat every old builder as able to wake and push. Replacement builders run `git pull --no-rebase` before every push and never force (PROMPTS.md P1, replacement variant). Each tick compares every card branch head with the last head a new-account session pushed.
- Section 8 may be one train old. Rebuild it from GitHub: PR bodies, HANDOFF blocks, verdict and ruling comments.

### 10.3 What is lost and what survives
**Lost with the old account** (nothing on the new account can reach it):
- **The supervisor session and its chat.** Any owner message not copied into this file (sections 3 and 4) or Relay is gone. Copy owner decisions here the same day.
- **Its Routines and triggers:** the hourly loop, the Huawei one-shot, and any pending one-shot message to a worker.
- **Every worker session** in 8.3. `create_trigger` refuses sessions of another account, so old builders and reviewers cannot be messaged. Work they did not push is lost.
- **The scratchpad:** the working tracker (its content is in section 8, 4.3 and Relay), prompt drafts, merge-train worktrees, local copies of scripts.
- **In-chat Workflow runs and their caches** (for example the HT-7 root-cause run, and `wf_e1e9c6e3-5fa` for ESC-REPORT planning). Reusable scripts are in `docs/supervisor/workflows/`.
- **Background watchers, Monitor tasks and PR activity subscriptions.**

**Survives:** GitHub (branches including `claude/sup-merge-train-*`, PRs, every comment with its cards, rulings, verdicts and HANDOFF blocks, CI runs, APK artifacts until they expire), Relay (PROJECT_STATE, LOG, tracker), and the repo: this file, `docs/supervisor/PROMPTS.md`, `docs/supervisor/scripts/`, `docs/supervisor/workflows/`, `docs/research/`, the skills, `docs/COACHING-DECISIONS.md`.

### 10.4 Rebuild on the new account
0. **The owner starts the session.** In claude.ai/code on the new account, he picks the repo `macdarenz-droid/M-arc` and the environment from 10.1, sets permission mode **auto**, and pastes:
   ```text
   You are the new and only supervisor of M/ARC (macdarenz-droid/M-arc), taking over from a supervisor on another account. Follow AGENTS.md. First run git fetch origin and find the newest docs/supervisor/HANDOVER.md (its section 0, first bullet). Read it in its section 0 order, then do section 10.4 steps 1 to 9 in order. Start, message, merge or archive nothing until step 2 (the live check) is done. Ask me only for what no agent can do.
   ```
1. **Check the supervisor session.** It must run **in auto mode**. `create_session`'s `permission_mode` cannot be more permissive than the calling session's mode, so a supervisor in default mode cannot start auto builders, and every builder would wait on approval taps. Get its own session id with `get_session` (no arguments); PROMPTS.md calls it `<SUP_SESSION>`.
2. **Read and check live.** Find the newest copy of this file (section 0, first bullet) and read it in the section 0 order. If the old account could not stop cleanly, apply 10.2a. Then `git fetch origin`; list open PRs and read the latest comment on each; check CI on each head; read the Relay dashboard and the end of LOG. Re-capture section 8 from what you see.
3. **The hourly loop.** `create_trigger` with:
   - `name`: `M/ARC supervisor loop`;
   - `cron_expression`: `58 * * * *` (UTC);
   - no `persistent_session_id`, so it fires into the new supervisor session;
   - `initiation`: `human_request`;
   - `prompt`: the text below.
   Then check it with `get_trigger`. Keep the prompt current with `update_trigger` when the focus, lane order or owner rules change.

   ```text
   Loop tick (hourly). You are the only supervisor of M/ARC: this session. Follow AGENTS.md, .claude/skills/supervisor/SKILL.md, docs/supervisor/HANDOVER.md (section 8 is the live state), Relay PROJECT_STATE.md/LOG.md and the owner's rules in this chat. Keep the tick short when nothing changed.

   USAGE (owner, 2026-10-01 08:10): "Dont worry about my ussage limit. Just continue and follow agents.md. If i maxxed out, so it is." Do not throttle for usage; follow AGENTS.md (use what is necessary, run agents in parallel when that makes the work faster or better, no duplicate agents; claude-opus-5-5 for judgement and reviews, claude-sonnet-5 for mechanical steps; never Haiku or Fable).

   FOCUS (owner, 2026-10-01): the improvement audit (#149, AUD-13..19) is PARKED. Finish the How-to lane and all 32 first-audit findings first (the first audit is COMPLETE as of 07:56 (train 5, 958a3de): 31 fixed + DEV-01 closed by his skip). FINISH LINE: when HT-3c..HT-10 are all merged, send the owner a push notification and a chat message ("Remind me when we finished"), naming DEV-01 as closed by his decision and Gym Finder as parked for a brainstorm, then start the parked improvement audit. The checklist is docs/supervisor/HANDOVER.md section 8.2.
   GYM FINDER (owner, 2026-10-01 07:30): "When u finished all the task, just park the gym finder without my approval. We need to do brain storm in that topic and talk. Keep it parked for now." #158 / GYM-0..6 stays PARKED even after the finish line: no card, builder or research without his approval.

   1. Checks: notifications; stalled sessions (idle with no push or comment since the last tick); open PRs (latest comment, CI on the head); re-arm the PR monitor (docs/supervisor/scripts/monitor.sh). Read PR heads with git ls-remote, never from a comment.
   2. Relay: set merged items to done with evidence.
   3. Each READY / FIXED post gets one Opus reviewer (fresh, or a delta review by the same reviewer). Send findings to the builder with a one-shot trigger. Do small fixes yourself.
   4. Archive reviewers after the card's final PASS and builders after their merge.
   5. Merge via MERGE TRAINS, exactly as docs/supervisor/HANDOVER.md 6.8 says. Remaining: the open rows of HANDOVER section 8.2, in its order. HT lane strictly HT-7 #119 (critical path) → HT-8 #111 → HT-9 #113 → HT-10 #166 (its train also adds the supervisor's .github ht10-gate job, add-only). OWNER RULE: never lower the plates' quality.
   6. Merge only with review PASS + all checks green on a head containing the latest main + the order allows it. Check the whole diff (git diff --stat origin/main...head) before merging. After each app-changing merge, send the owner the APK once the fingerprint step passes.
   7. Worker PRs merge only on the owner's per-PR yes, quoted on the PR. Website deploys only as the owner asked.
   8. Owner rules in force: LR-23 (no contacts, links or sources in the app); the safety line; no new saved data without his yes; UI COPY RULE (never talk down or state the obvious; explain nothing unless Google Play requires it or the owner asked; headings are 1-3 word labels, never sentences).
   9. HANDOVER: every merge train carries a docs/supervisor/HANDOVER.md update (section 8 plus any new decision, ruling or gotcha), and refresh it at least every 3 hours. Never a secret, a Relay URL, an email or a phone number in it.

   Never loosen a check. Never rewrite history. If nothing changed, reply "no change" and stop.
   ```
   This is the live prompt of 2026-10-01 08:09 UTC with seven changes: the first-audit time is train 5's merge time, 07:56 (the live prompt says 07:58); no session id; the checklist and the monitor point to repo paths instead of the old scratchpad; item 4 keeps the reviewer until the final PASS (5.5); item 5 points to 6.8 for the train procedure instead of a short copy of it; item 5's "Remaining" points to section 8.2 instead of a dated list (BUG-36 #163 and COPY-2 #168 were also open at 08:10); item 9 states the every-train rule (section 11). Before sending, check that every line is still true against section 8, and drop finished items.

   Optionally, the owner also starts the fallback self-paced loop in the supervisor chat: `/loop Continue M/ARC supervisor progress per AGENTS.md: merge queue, builder check-ins and reviews, APK links with change lists, Relay upkeep`.
4. **The Huawei check:** a one-shot `create_trigger` into the new supervisor with `run_once_at` `2026-10-13T09:00:00Z`, `initiation` `human_request`, prompt: "Ask the owner once whether Huawei replied about the Wear Engine (PR #88)." Skip it if that date has passed and the owner already answered.
5. **Re-arm the watchers** (6.5):
   - `monitor.sh` with the Monitor tool, `SINCE` set to the time of the old supervisor's last PR activity, so no comment in the gap is missed;
   - `subscribe_pr_activity` on every open PR;
   - `ci-watch.sh` on every head that waits for CI;
   - `apk-watch.sh` on main's head if the last app-changing merge has no APK sent yet (compare with "last APK sent" in Relay).
6. **Restart each open card.** Precondition: its old session is archived (10.2 step 5), so two builders never push to one branch (`tick.md`).
   - Rebuild the card text from the PR body and its HANDOFF block, the rulings and verdicts in the PR comments, the Relay tracker item, and the plan docs in 7.2.
   - **Still building or fixing:** a new builder with `create_session` (6.1, P1), `source_revision` **and** `outcome_branch` both set to the card's existing `claude/<card>` branch, the model the card names, and the full card. Add the replacement variant of P1 (PROMPTS.md): continue from the live branch head, read every PR comment first, push only to the card's branch, `git pull --no-rebase` before every push, never force.
   - **READY or FIXED, waiting for a verdict:** a fresh Opus reviewer on the live head (P2). Tell it to read the earlier verdicts on the PR and to treat this as a delta review of the open findings when there are any.
   - **Passed and frozen:** nothing to restart. It goes into the next merge train (6.8).
   - **Not started yet:** start it as normal (5.0).
7. **Workflows.** If the HT-7 root-cause result is not on #119 or in the repo, rerun it from `docs/supervisor/workflows/` (its README). If `wf_e1e9c6e3-5fa`'s output is not in the repo or Relay, rerun the ESC-REPORT planning.
8. **Record the takeover:**
   - a Relay LOG line;
   - `PROJECT_STATE.md` (the new supervisor session);
   - this file's "Last updated" line, section 8 (new session ids) and 8.4 (new trigger ids), in the next merge train.
9. **Tell the owner** in one short message: the takeover is done, what is running, and anything he must do (10.1).

---

## 11. How to keep this file current

**When to update it** (owner, 10-01 08:28: "keep updating the supervisor handoff too in repo whatever task is done"):
- **In every merge train.** Each train carries one handover commit: section 8 re-captured (what merged, what is left, what is parked, what is important), plus any new decision, ruling or gotcha. So the repo copy is never more than one train behind.
- **At least every 3 hours** while work is moving, even with no train. The hourly Routine (item 9) checks this.
- After every new owner rule or decision: add it to section 3 or 4, verbatim, with the date, in the next train or at once if no train is near.
- After every new lesson, a change in authority or mechanics, and before any planned transfer (10.2 step 1).

**Who triggers it:**
- The supervisor, when it builds a merge train (6.8 step 2), and when the hourly tick finds the last update older than 3 hours.
- The owner, any time he asks.
- Who writes it: the supervisor itself, or one helper it starts for the job (a Sonnet session or an in-chat Workflow; past ones: #136 at 01:00, #165 at 06:00, this 09:00 package). The helper gets the live facts from the supervisor; section 8 is always re-captured from live data.

**How to update it:**
1. Use a branch `claude/sup-handover-<HHMM>` (UTC time of the capture), cut from the latest main. **It changes only by PR**, titled `SUP: handover refresh at <HH:MM> UTC`. Never push to main.
2. Make exact string edits only. Do not rewrite unchanged sections.
3. Re-capture section 8 from live data (open PRs, `list_sessions`, `list_triggers`, the Relay dashboard), never from memory. Update the "Last updated" line: date, UTC time, main SHA.
4. Update `docs/supervisor/scripts/`, `PROMPTS.md` and `docs/supervisor/workflows/` in the same PR when a script, a message text or a reusable Workflow changes (for example the `branch-watch.sh` branch list or the `monitor.sh` `SKIP` list). Put new research and architecture output in `docs/research/<topic>/`.
5. Before pushing, check the diff for secrets, tokens, the Relay URL, email addresses, phone numbers and private personal details (such as the names of the owner's other projects). Names of secrets are fine.
6. It is a docs-only PR. Normally it rides the next merge train as one row ("SUP handover at <HH:MM> UTC (docs only)", verdict "supervisor doc"), as #136 did in train 1 and #165 in train 4. With no train due within the 3 hours, merge it alone: guard and CI green on a head that contains main, then a merge commit. No APK.
   - **Authority:** the owner's requests to keep this file updated in the repo (09-30 15:03 and 10-01 08:28, section 3.9), and the hourly Routine's HANDOVER item (item 9).
   - This authority covers `docs/supervisor/**` (this file, `PROMPTS.md`, `scripts/`, `workflows/`), `docs/research/**`, and add-only lines in the supervisor's own procedure files `.claude/skills/supervisor/gotchas.md` and `tick.md` (the 01:00 and 03:30 handovers added gotchas this way, `d83a884` and `9f28560`). Any other change to `.claude/skills/supervisor/*.md` goes in its own `claude/sup-skills-<HHMM>` PR (7.6 lists the pending ones).
   - Never include `AGENTS.md`, `.claude/owner-rules.md`, `.claude/settings.json`, `.claude/hooks/**`, `.claude/rules/**`, the builder or reviewer skills, `.github/**` or app files; those follow their own rules. That way this PR cannot become a way to change rules without review.
   - If auto mode refuses a `.claude/**` edit, drop it, list it in 7.6, and never work around it.
7. Add one Relay LOG line.

**One document per topic.** Update this file. Never create HANDOVER-v2, final, copy or similar.
