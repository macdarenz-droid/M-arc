# M/ARC supervisor handover

This file lets a new Claude supervisor take over M/ARC from this file alone. The new supervisor may be on another Claude account.

The repo is **public**. Never put any of these in this file: secrets, tokens, passwords, keystore values, the Relay URL (its path holds an access token), email addresses or phone numbers. Secret *names* are fine.

---

## 0. How to use this file

**Last updated:** 2026-09-30 ~15:30 UTC · main `6730bac` (DOC-2 #93) · by supervisor session `session_01Tc7uLSdp7LGknt8xc1i9dc` on the owner's current account. Section 8 was captured at about 15:30 UTC. Re-capture it live right before each commit of this file.

- The supervisor updates this file from time to time: at least every 3 hours while work is moving, and after every new owner rule or decision. See section 11.
- Sections 0–7 and 9–11 change slowly. **Section 8 (Current state) goes stale within hours.** Treat it as a map, then re-check everything live.
- Never reuse a SHA from this file for a merge. Get it live (`git rev-parse`).
- If this file disagrees with `AGENTS.md` on `origin/main` or with the owner's newest message, those win. Fix this file in your next update.

**Read in this order:**
1. Sections 1–4 of this file, in full (role, authority, owner rules, owner decisions).
2. `AGENTS.md` **from `origin/main`**: `git fetch origin && git show origin/main:AGENTS.md`. The local checkout may be older (see 7.6).
3. `.claude/owner-rules.md`, then `.claude/skills/supervisor/` (`SKILL.md`, `tick.md`, `cards.md`, `ship-apk.md`, `gotchas.md`), then `.claude/skills/builder/SKILL.md` and `.claude/skills/reviewer/SKILL.md`, then `docs/AGENT-RULES.md`. On main, the card fields, the builder self-check, the two-tries rule and the trigger lead time now live in these skill files, not in `AGENTS.md`.
4. Relay (the MCP server "2nd Supervisor M/ARC"): `CONTRACT.md`, `PROJECT_STATE.md`, the end of `LOG.md`, and the tracker.
5. Section 8 here, then check it live: open PRs, `list_sessions`, `list_triggers`, and CI.
6. Only when a task needs them: the plans and rulings listed in section 7.

---

## 1. The role, in 10 lines

1. One supervisor runs the whole project. It is one Claude Code cloud session.
2. It owns the task board (Relay tracker), the merge queue and the lane order.
3. It writes build cards and starts one builder session per card, in auto mode, with an explicit model.
4. It starts one fresh reviewer per "[ready for review]" PR. Builders never approve their own work.
5. It merges app PRs when the merge gate passes, one at a time, in lane order.
6. After each app merge, it checks the signed APK and sends the owner the link with a plain change list.
7. It does the small work itself: catch-ups, log reading, one-line fixes, short re-checks.
8. It decides by research instead of asking. It records the reason: product decisions in `docs/COACHING-DECISIONS.md`, process decisions in Relay `LOG.md`.
9. It keeps Relay and this file current, and archives sessions as soon as their work is pushed.
10. It speaks to the owner only at a phase end, for an owner-only decision, or for a blocker only he can clear. Plain words, short, readable on a phone.

---

## 2. Authority

### 2.1 The supervisor may, without asking

- Start, message and archive builder and reviewer sessions: auto mode, only the allowed models, and never other projects' chats (see 2.3).
- Write cards, run research and planning workflows, and make product or process decisions by research. Record each one (D-entries in `docs/COACHING-DECISIONS.md`, a line in Relay LOG).
- Merge **app** PRs that pass the merge gate (5.7). Authority: the owner's standing approval of 2026-09-26 (see `docs/AGENT-RULES.md`), and the 09-29 brief: "I gave full authority: keep the work moving without waiting for me."
- Merge `origin/main` into any waiting `claude/*` branch with a merge commit (a catch-up), **except `claude/escobar-v2-implementation-eidx64`, and never `codex/*`**. Never rebase or force-push. Catch up only idle builders' branches (see 6.7).
- Push to its own `claude/sup-*` branches and open PRs (for example, updates to this file). The docs-only merge authority for this file is in section 11.
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

---

## 4. Owner decisions in force

### 4.1 Decisions (newest first within each group)

| Topic | Decision (verbatim where it matters) | When (UTC) | Recorded in |
|---|---|---|---|
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

### 5.1 Lanes (as of 09-30)

| Lane | What |
|---|---|
| How-to (HT) | The How-to sheet in the app: HT-1..HT-10, plus HT-3b and HT-4b. HT-1 and HT-2 are merged. At most 4 HT builders at once. The HT merge order is the **supervisor's lane order**, not an owner decision (see K1). |
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

A blocked task names its reason and what unblocks it. Merged items are set to done, with evidence, in the same tick.

### 5.3 Cards
- **Fields** (`.claude/skills/builder/SKILL.md`): `id`, `outcome`, `base`, `depends_on`, `read_first`, `write_scope`, `reserved_paths`, `acceptance` (criterion IDs, including failure paths), `design_reference`, `connectivity`, `verification`, `risk_and_recovery`, `return`. Also `model` (`.claude/skills/supervisor/cards.md`).
- Before a card is `ready`, run the collision check against other cards' write scopes (`cards.md`).
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

### 5.5 Reviewers
- Each "[ready for review]" PR gets **one fresh Opus reviewer session** per round.
- The reviewer:
  - diffs only the card's own range, using a 3-dot (merge-base) diff;
  - proves the tests bite, by mutation;
  - posts its verdict on the PR. PASS is used only when nothing is blocking.
- **Verdict formats.** The reviewer skill's format is `REVIEW <card> @ <commit>: PASS | CHANGES NEEDED` · `Blockers: N · High: N · Medium: N` · one line per finding, `file:line — problem — fix`. In practice reviewers have posted `## REVIEW <card> @ <sha>: PASS|FAIL` (for example #107 at 14:49 and #121 at 15:01), and there is an older `## HT-4 review: FAIL`. Read all of these as verdicts. New reviewer prompts use the skill's format (see 7.6).
- A head that is behind main is a note, not a blocker.
- On FAIL or CHANGES NEEDED: send the findings to the builder by trigger and post the same text on the PR. Retitle the PR `[fixing] …`.
- The supervisor does small round-2 checks itself, on the exact head.
- Archive the reviewer after its verdict.

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

### 5.8 After each merge
1. Set the tracker item to done, with evidence (the merge SHA and the CI run).
2. If the merge changed the app, check the APK and send it (6.9). Docs-only, CI-only and config-only merges need no APK.
3. Archive the builder session.
4. Catch up the waiting PRs together, so their CI runs in parallel. Then merge them in order as each turns green.

### 5.9 Archiving
- Archive a session as soon as its work is pushed and nothing is owed:
  - a reviewer after its verdict;
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
- Update this file at least every 3 hours (section 11).
- The tick is a safety net. The main driver is PR and CI events.

---

## 6. Mechanics (exact how-tos)

### 6.1 Start a builder or reviewer session
Use `mcp__Claude_Code_Remote__create_session` with:

| Field | Value |
|---|---|
| `model` | `claude-opus-5-5` (judgement, reviews, critics, any non-mechanical card) or `claude-sonnet-5` (fully spelled-out mechanical cards). Always set it explicitly. |
| `permission_mode` | `auto` |
| `source_url` | `https://github.com/macdarenz-droid/M-arc` |
| `source_revision` | For a stacked card: the dependency branch. To resume: the card's branch. |
| `outcome_branch` | `claude/<card-slug>`. To resume a card: its existing branch. |
| `tags` | `["marc:builder","marc:<card>"]` or `["marc:reviewer","marc:<card>"]` |
| `environment_id` | Omit it to inherit this session's environment. |
| `prompt` | The **full** card text (below). |

The builder prompt must contain:
- the full card, with its write scope and acceptance IDs;
- "Follow AGENTS.md";
- "Open a draft PR after the first push";
- "When done retitle it '[ready for review] …'";
- "Do not use scheduling tools";
- for hard cards: "post a design-note CHECK-IN on the PR before bulk building".

The reviewer prompt must contain:
- the PR number, the card and the exact head SHA;
- "diff only the card's range (3-dot)";
- "prove tests bite by mutation";
- the verdict format from `.claude/skills/reviewer/SKILL.md` (see 5.5);
- "Use a PASS heading only when nothing is blocking";
- "never /ultrareview";
- "Do not use scheduling tools".

**Build the prompt in a file with Python and read it back before sending.** A placeholder "(see below)" once left a session stuck, and `sed` broke on "/".

### 6.2 Message a running session
- Use `mcp__Claude_Code_Remote__create_trigger` with:
  - `persistent_session_id` = the target session;
  - `run_once_at` = a minute or two ahead in RFC3339 (supervisor `SKILL.md` and the owner; the current supervisor used 2–4 minutes, see K3);
  - `initiation: "own_followup"`;
  - a short `name`;
  - `prompt` = the message.
- Afterwards, check that it fired (`get_trigger` / `list_triggers`, `last_run`). If it did not, post the text as a PR comment.
- For review findings: always also post the same text on the PR, and retitle the PR `[fixing] …`.
- **Never `fire_trigger` with text.** Do not use SendMessage (dropped by amendment 1 of the workflow revision).
- `persistent_session_id` must be a session of the same account.

### 6.3 Reviews
See 5.5. One reviewer per round, fresh context, Opus. Archive it after its verdict.

### 6.4 In-chat workflows (research, planning, adversarial checks)
- Past examples:
  - the LR-23 plan: sweep, Play policy, impact, plan, adversarial verify;
  - the ESC-REPORT plan: maps, 3 designs, 2 judges, cards, verify.
- Always include an independent verify step.
- In-chat workflows run only 2 agents at once (4 CPUs), so heavy parallel work goes to cloud sessions.
- A container restart kills them. Resume from the cache.

### 6.5 Monitors
The scripts live in `docs/supervisor/scripts/`. They are committed together with this file in the sup-1 PR; until that PR merges they exist only in the old supervisor session's scratchpad. Run each with the **Monitor tool**. The tool expires every 30 minutes; re-arm it after each expiry and after every container restart. Do not sleep-poll in the foreground. Also use `subscribe_pr_activity` on every open PR, plus notifications.

| Script | Does | Run |
|---|---|---|
| `monitor.sh` | Prints one line per new PR comment or title change on open PRs. Skips the PRs in its `SKIP=` line (now `1 3 36 88 92 94 95 96 97`). Ignores comments that start with `**Supervisor` or `**Paused`, so start your own PR comments with `**Supervisor`. | `SINCE=2026-09-30T15:00:00Z bash docs/supervisor/scripts/monitor.sh`. Use `SINCE` to backdate after a restart; the default is 2 minutes ago. |
| `branch-watch.sh` | Prints `push <branch> <sha7>` when a watched branch moves. Checks every 90 s. The branch list is on **line 5**; edit it when lanes change. | `bash docs/supervisor/scripts/branch-watch.sh` |
| `ci-watch.sh` | Waits until `guard`, `source-gate` and `visual-gate-tz` all **exist** and every run is complete, then prints `CI <label> <sha7>: name=conclusion …`. Exits when all SHAs are done. | `bash docs/supervisor/scripts/ci-watch.sh HT-4:<sha> DOC-2:<sha>` |
| `apk-watch.sh` | Waits for the build-apk run on a SHA, then prints the run id, its conclusion, the signing and fingerprint step results, and the artifacts (name, id, expired). | `bash docs/supervisor/scripts/apk-watch.sh <full sha>` |
| `resolve_gate.py` | The helper for conflicts in the add-only gate files (6.7). | Read its header for usage. |

Why ci-watch.sh waits for all three jobs: an early version reported as soon as `guard` alone existed.

The scripts call the GitHub API with plain `curl` and depend on the cloud proxy's GitHub auth (see 10.1).

### 6.6 Reading CI
- **PR jobs:** `guard` (Agent guard), then `source-gate`, `visual-gate-tz` and `android-gate`. The last three are in the "M/ARC gate" workflow in `build-apk.yml`; `android-gate` needs the other two.
- Read failing logs yourself. The `.claude/skills/ci-log` helper (a forked Sonnet helper) returns only the failing lines. The GitHub MCP `get_job_logs` also works.
- When the same failure hits several PRs, root-cause it once (one fix PR). Tell the other builders not to chase it.
- **Maven 403/429 in `android-gate`:** re-run once. If it repeats, root-cause it (the Gradle cache fix was #86).
- A flake is fixed, never loosened. Example: BUG-26, "Play under 44 px", was measured mid-animation; the fix kept the bar.
- **Agent guard:** errors block the push; warnings do not. What each message means: `docs/AGENT-RULES.md`. The guard also runs before every `git push` through `.claude/hooks/guard-before-push.sh`.

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
- Conflicts in the add-only gate files: keep both sides, with 0 lines removed and 0 lost, then run `node --check`. Use `docs/supervisor/scripts/resolve_gate.py` for this.
- Logic conflicts go back to the builder. Verify with a remerge-diff.
- Shared-doc conflicts (two cards adding the same heading): keep both and rename one.

### 6.8 Merging
1. Get the head SHA live: `git rev-parse origin/claude/<b>`, full 40 characters. Never guess it; a guessed SHA caused a 409.
2. Set `draft: false` if the PR is a draft.
3. Call GitHub MCP `merge_pull_request` with `merge_method: "merge"` and `expectedHeadSha: <40-char sha>`.

Also:
- One merge per CI cycle (about 18–35 minutes).
- If main's own run is within about 5 minutes of finishing, wait for it first, so every stretch of merges has an APK.

### 6.9 APK after an app merge
1. Find main's green run of "M/ARC gate" (`build-apk.yml`) for the merge SHA. `apk-watch.sh <sha>` does this.
2. Check that the step **"Sign with the permanent key and verify the fingerprint"** succeeded.
3. Send the owner the `MARC-DEBUG-APK` artifact link (`https://github.com/macdarenz-droid/M-arc/actions/runs/<run id>/artifacts/<artifact id>`) with a plain change list: what changed, what is new, what was fixed.
4. Set "last APK sent" in Relay `PROJECT_STATE.md`. The format is in `.claude/skills/supervisor/ship-apk.md`.

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
| `docs/supervisor/HANDOVER.md` (this file) and `docs/supervisor/scripts/` | This handover and the monitor scripts. **On main only after sup-1 merges.** |
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
1. The local checkout `/home/user/M-arc` (detached at `9d02343`) has an older `AGENTS.md`. Read rules from `origin/main`.
2. `HOWTO-BUILD-PLAN.md` has four stale points:
   - it still says "Status: plan only … Base: main fba3f37";
   - it says "11 merges", but there are 12 cards;
   - its header misses HT-4b;
   - its paths are scratchpad paths, which the README maps.
3. S-4 (a "[golden update]" guard check) has not landed. `agent-guard.sh` has no golden check.
4. `AGENT-WORKFLOW-REVISION.md`'s rollout still lists dropped items: `/code-review high`, the 10-minute timeout test, and the SendMessage test.
5. `SUPERVISOR-STOP-watch-branch.md` (09-23) says "The owner merges pull requests". It predates the 09-26 standing approval. It is historical only.
6. Supervisor `SKILL.md` says "the shared files above", but that table is in AGENTS.md.
7. `RELEASE-READINESS.md` (REL-2) still lists "the Play App Signing choice" as open, but REL-3 records it. The upload-key signing step for `play-bundle` is still unbuilt.
8. `RELEASE-READINESS.md` says the installed app is "hotfix 721e997". This was not checked against newer APKs.
9. `tick.md` line 3 ('The hourly Routine's prompt is "Run the tick in the supervisor skill."') is stale. The Routine's prompt holds the full checklist (8.4).
10. The reviewer skill's verdict format (`PASS | CHANGES NEEDED` plus counts) differs from what reviewers actually post (`## REVIEW <card> @ <sha>: PASS|FAIL`). See 5.5. Align them.

---

## 8. Current state (2026-09-30 ~15:30 UTC; stale fast, re-check live)

### 8.1 Main
- Head: `6730bac` (DOC-2 #93, merged 15:22 UTC). It is docs-only (`COACHING-DECISIONS`, `PLAY-SUBMISSION.md`, `PRIVACY-POLICY.md`), so no APK is needed.
- Recent merges:
  - REL-3 #115 `e14c45b`
  - BUG-29 #114 `5cc34dc`
  - HT-2 pin test #117 `07c9892`
  - REL-2 #108 `cab641c`
  - HT-2 #105 `cae1725`
  - HT-1 #104 `cff87d2`
  - WF-2 #103 `3c46dc0`
  - WF-1 #102 `1c05fb6`
- DOC-3 #110 merged into the website branch (`2373589`) and is deployed.
- Other branch heads (15:30): `claude/howto-options` `6b86baa` (LR23-DOCS review fixes), `claude/lr23-plan` `e4bfb08`, `claude/play-1-in-app-policy` `99b4ef0`.

### 8.2 Open PRs
| PR | Card | Head | State | Waiting on |
|---|---|---|---|---|
| #107 | HT-4 golden-B lock `[fixing]` | 81d5d95 | CI green; behind main | Round 3 FAILED: the enumerated pose pins, plus a low C17 anchor finding. The builder is fixing both, plus escaped-quote C17, in one commit. Then a round-4 reviewer. **First in the HT order.** |
| #106 | HT-3 How-to sheet `[ready for review]` | c599235 | CI green; behind main | Its delta reviews passed (section capture `0714378`, bleed `e2d7868`). It waits for HT-4 to merge, then a catch-up. |
| #118 | HT-3b speed and offline | e2363e9 | CI green; behind main | The order: after HT-3. |
| #116 | HT-5 content generator | 19fc2bf | CI green; behind main | The order (see K1). |
| #112 | HT-6 grips, hand zoom | 8c5b6d0 | CI running; behind main | The builder is running the full gate locally. The order. |
| #119 | HT-7 posture close-ups | e64c38f | source-gate FAILED (C17) | Red until HT-4's C17 fix lands. Also needs HT-6's also-row sync. |
| #111 | HT-8 feel map and shimmer | a8de1cf | source-gate FAILED (C17) at the earlier head; re-check | The same C17 wait. An earlier note said the builder asked how to define the "tripwire (net)". **Unverified:** the PR body defines it itself ("the median tap window minus the median idle window"), and its HANDOFF "Waiting on" names #117, HT-6's CSS and HT-3/4/5/6 merging, not the supervisor. Check the builder's session and triggers before answering. |
| #113 | HT-9 set-up and risks | dd11227 | CI running; behind main | Sources already removed. Its later "HT-9 C19" gate block needs the ESC-NC guard and HT-4b first. |
| #122 | ESC-NC (app, LR-23) | cd3895b | CI mostly green; contains main | The builder is still building. Then review. |
| #121 | ESC-NC-W (Worker) `[ready for review]` | fb6a6af | CI running; main moved since | Review PASSED at `17ce3eb`; `eafff05` later added the D-LR23-9 wording (check that delta yourself, 5.5). Owner said yes on 09-30 and told the supervisor to merge #121. Merge when CI is green on the current head, then check the deploy run and `/health`. |
| #120 | LIB-25 poly primitive `[golden update]` | 8480052 | CI green; behind main | A merge slot from the supervisor, then review once it is titled ready. |
| #123 | LIB-26 flat palm `[golden update]` | 50fe854 | CI running; behind main | Stacked on #120. The same process. |
| #109 | LIB-8 pilot A (19 pattern plates) | 6387d83 | CI partly green; behind main | Legs-core's `mountain_climbers` needs LIB-26's flat palm; the lead's presses are still to come. Then a calibrated recheck critic, then the pilot sheet to the owner. Merges after LIB-2..LIB-4. |
| #94 | PREM-PLAN `[parked]` | 08a0fef | green | The owner: 4 decisions. |
| #92 | PAY-1 `[parked]` | c8829be | green | The owner: price and data approval. |
| #88 | Wear Engine application 3 (docs) | 62dbdeb | green | The owner: Huawei's reply. A Routine checks on 10-13. |
| #3 | GT6 watch lab (codex) | 8fc26d8 | — | The watch agent. **Never merge.** |
| #1 | Coach brain design | 9201140 | stale | No card or lane. Leave it. |

**HT merge order (the supervisor's lane order, not settled; see K1):**
- Fixed start: HT-4 #107 → HT-3 #106 → HT-3b #118.
- After HT-3b the sources disagree:
  - the build plan, the Routine's LR-23 bullet and the live PR notes: HT-4b → HT-5 #116 → HT-6 #112 → HT-7 #119 → HT-8 #111 → HT-9 #113 → HT-10;
  - the Routine's item 5 (and this file's earlier text): HT-5 … HT-10, then HT-4b.
- Settle K1 before merging anything after HT-3b.

**Library order:** LIB-25 #120 and LIB-26 #123 are the engine golden updates → the legs-core fix → the recheck critic → the pilot sheet to the owner, with the tempo question.

### 8.3 Running and idle sessions (M/ARC, owner's current account; statuses from ~15:12, re-check live)
| Session | Role | Model | Status |
|---|---|---|---|
| session_01Tc7uLSdp7LGknt8xc1i9dc | **Supervisor** (env `env_01Q4EctZ7hnAkbtoGSeRp3Kh`) | Opus | active |
| session_012au82Rjsy7wuXunToMGWWh | Reviewer: LR23-DOCS | Opus | verdict posted: PASS at 15:22 (`3f1bc49`); archive |
| session_01CYz8c6ViJhmktGdTHKe5nj | Builder: PLAY-1 (branch `claude/play-1-in-app-policy`, `99b4ef0`) | Opus | running |
| session_01Sj9sKFMGHCEuY9ZYoHdYzp | Builder: ESC-NC #122 | Opus | running |
| session_01MQ4hHgRP67Wb6QBQ881nHC | Builder: LR23-DOCS (done: golden B `677f8e3`, cards `f9568ca`, research `1fc9dbc`; review fixes on `claude/howto-options` `6b86baa`) | Opus | idle; review passed, archive |
| session_016SJvqQFXkpXzX1qJwJJKzy | Builder: ESC-NC-W #121 | Sonnet | idle |
| session_014BuXk6RhFgH9Ev7G5oPMGQ | Builder: HT-4 #107 (fixing) | Sonnet | idle (gate running) |
| session_01Jark5f37C56oQaSpFsGNqY | Builder: HT-3 #106 | Opus | idle |
| session_01V9STYSVSiJMKv46npD4DMU | Builder: HT-3b #118 | Sonnet | idle |
| session_01TojyzXtcz3DucYjhNoHpKs | Builder: HT-5 #116 | Sonnet | idle |
| session_017W69UPzNEuk87SJye8gtM8 | Builder: HT-6 #112 | Opus | idle (local gate) |
| session_01TLQREDwJgfPP2gbHAmEu9T | Builder: HT-7 #119 | Opus | idle |
| session_01H5UEjJKi59q226yyhWp9So | Builder: HT-8 #111 | Opus | idle |
| session_01JY7nLdZ112XUkSfYEukdvL | Builder: HT-9 #113 | Sonnet | idle |
| session_01K2cJ5wL9yrEVDzD652Aopm | Builder: LIB-25 #120 and LIB-26 #123 | Opus | idle |
| session_01RFiJ26snbpASbeBRXtDcY3 | LIB-8 lead #109 | Opus | idle |
| session_01RiyaTXJTTd47mi9FGYN3Q3 | Drawer: arms and machines (`9d3b0a3`, READY) | Opus | idle |
| session_01GCLapa58edPUhGCJ7vMhXy | Drawer: hinge and rows (`1bb7a3d`, READY) | Opus | completed |
| session_019sM1eRfB8C2weX3GUirQY1 | Drawer: legs and core | Opus | need_input (waits on the flat palm) |
| session_019xm4v7MYwsyabgwGXXZnZY | Best-practice review | Opus | completed; can be archived |
| session_016zEoEcLZ9ezrNEtxJ6tPaS | Watch docs handover (target of the 10-13 Routine) | Opus | completed; keep it |
| session_01L64AhnYjCfzhbqBbUcKK8J | Website design concepts | Opus | completed |

**Other projects' sessions are in the same list. Touch only M/ARC sessions (tagged `marc:*` or titled for an M/ARC card). Never touch the rest.**

### 8.4 Routines (owner's current account)
| ID | What | When |
|---|---|---|
| trig_01CtcvAE1PGAtH4dkxLVQZsR | "M/ARC supervisor loop". The hourly tick into the supervisor session. Its prompt holds the full tick checklist, the current lane order and the HANDOVER item (updated 15:06; checked with `get_trigger`). Update the prompt when the order changes. | cron `58 * * * *` |
| trig_01ArbGSmYEUErUDfr4mZP3vd | LIB-8 lead: merge the legs-core fix, rebuild the sheet, post "PILOT SHEET READY". | once, 09-30 15:26 |
| trig_01E6uvusg1B39q9HjybuwUr2 | HT-3: check CI; catch up after HT-4 merges. | once, 15:21 |
| trig_01BRL7DPhbWCpo5ZtvwoxyHQ | HT-8: merge moved heads, re-run the feel tests and the gate. | once, 15:18 |
| trig_01RWtESp3CxGq5TP9TzntC56 | HT-6: act on the local gate run. | once, 15:42 |
| trig_01FW3ZqybsafyYup7uZxLxBK | HT-9: stay current; the C19 block after the ESC-NC guard and HT-4b. | once, 15:43 |
| trig_01UoRfQk1Rsbpdcnajz5bmh5 | HT-7: merge moved heads; waits on #112 and #107. | once, 15:51 |
| trig_01LM69abWrcN9EhVqQKwsqNY | LIB-25/26: CI and threads; both stay draft until given a slot. | once, 16:00 |
| trig_01XBaJHD9jyLEXPUdpMpykLo | Watch docs session: ask the owner once whether Huawei replied. | once, 2026-10-13 09:00 |

There is also an in-chat planning workflow, `wf_e1e9c6e3-5fa` (ESC-REPORT). It produces the cards ESC-REPORT (app), ESC-REPORT-W (Worker; needs the owner's per-PR yes) and DOC-REPORT.

### 8.5 Relay tracker snapshot
- Stage: Build. Architecture 55 %. 119 items: 78 done, 24 blocked, 0 open bugs.
- **Running:** REL-1, LIB-HT, LIB-8, HT-7, OWN-NOSRC, LIB-26, ESC-REPORT, ESC-NC, PLAY-1.
- **Review:** PROC-1, ARCH-1 (owner), HT-3, HT-4, ESC-NC-W.
- **Ready:** OWN-1 (owner: back up the signing key and Huawei secrets offline, in 2 places), LIB-WAYOUT, LIB-TEMPO.
- **Blocked:**
  - the final QA chain: C-8, C-9, C-XC, C-10;
  - OWN-2, OWN-4, LIB-1;
  - the paused animation cards: F-GUIDE, FG-7, FG-8, V1-07..V1-11, V1-19;
  - DEV-CHECKS, REL-PLAY, PAY-1, PREMIUM, PREM-PLAN, DOC-2, REL-AI-REPORT, HT-4b.
- **Drift to fix:**
  - HT-3b, HT-5, HT-6, HT-8, HT-9, LIB-25 and LR23-DOCS have no tracker rows;
  - DOC-2 must be set to done (#93 merged 15:22, `6730bac`);
  - REL-AI-REPORT still reads parked (ESC-REPORT has probably replaced it).

### 8.6 Owner to-dos (his side)
1. The REL-3 phone steps (`docs/RELEASE-READINESS.md`).
2. ESC-NC-W #121: done on his side. Owner said yes on 09-30 and told the supervisor to merge #121. Later, ESC-REPORT-W needs his own yes for that PR.
3. OWN-1: offline key backups, in 2 places.
4. View the pilot sheet (with the tempo question). This also covers the golden B approval (D-LR23-2).
5. Device checks (the DEV-CHECKS list in Relay). Play card 1 retake; card 6 finish screen.
6. Parked, for him to decide later: ARCH-1 (21 decisions); PAY-1; PREM-PLAN; the Escobar-intelligence request (K11). PREM-PLAN's 4 decisions are:
   - heart-rate rest and 3 themes to Premium;
   - the 5-answer starter;
   - prices and AI budgets;
   - the PREM-1 Opus switch.
7. The closed test (12 testers × 14 days). Then the store upload.
8. Advised: set a spend limit on the AI key. Before a US release: he or a lawyer checks US state AI-chat laws (California SB 243, a New York law).
9. **Closed:** whether the generic "get emergency help now" line should go. Answered 09-30 15:15 (D-LR23-9): no contacts, links or hotlines; the line stays for danger now only; everything else follows "symptom → how long or how bad → what to do".
10. **Done, do not re-ask:** error reports were switched on (09-30). The error-report token was never pasted; do not ask for it.

### 8.7 Next steps, in order
1. On wake:
   - re-arm the monitors (backdate `monitor.sh` with `SINCE`) and check branch heads by hand;
   - check that every one-shot trigger in 8.4 fired;
   - read the latest comment on every open PR.
2. DOC-2 #93 merged at 15:22 (`6730bac`), docs-only, no APK. Tracker item set to done.
3. #121 ESC-NC-W: Owner said yes on 09-30 and told the supervisor to merge #121. Merge when CI is green on the current head, then check the deploy run and `/health`. First check the `eafff05` delta (added after the review).
4. HT-4 #107: take the builder's fix commit → a fresh Opus round-4 reviewer → catch up → merge. Then S-6: tell the other lanes about the coverage check. Then HT-7 and HT-8 go green on C17.
5. HT-3 #106: catch up after HT-4 → CI → merge. Then HT-3b. Settle K1 before the next HT merge.
6. LR23-DOCS: the review PASSED (verdict in `claude/lr23-plan` `docs/howto/LR23-DOCS-REVIEW.md`). Its mediums and lows were fixed by the supervisor (`claude/howto-options` 6b86baa, page bytes unchanged; `claude/libht-research` b1cd0ac, ruling LR-28). Reviewer and builder archived. Start HT-4b when HT-4 has merged.
7. ESC-NC #122 and PLAY-1: review each when titled ready.
8. ESC-REPORT: the planning workflow finished (verdict FAIL, all fixable card edits). Supervisor rulings: drop the Worker owner page and its new secret (the owner read the D1 console on his phone on 09-30, so that path is verified); always show Report and always send to the built-in Worker (Play); order Worker PR → app PR (after the live `POST /reports {}` returns 400) and app PR after ESC-NC. A fixer and recheck workflow (`wf_c6098b07-690`) produces the final cards (to be committed as `docs/escobar/ESC-REPORT-CARDS.md`); then start the three builders.
9. LIB-25 and LIB-26: review, then the legs-core fix, the recheck critic, and the pilot sheet to the owner.
10. LIB research: the next waves are LB7–LB10.
11. HT-8's "tripwire (net)" question: unverified. Check the builder's session and triggers before answering (see the #111 row).
12. Supervisor open actions from How-to plan 4.0:
    - S-2: pin golden B (via HT-4 and HT-4b);
    - S-3: post D-HT1..D-HT3 (status not verified);
    - S-4: the "[golden update]" guard check (not landed);
    - S-5: decide an app-wide main-chunk ceiling (status not verified).
13. Merge the sup-1 PR (this file plus `docs/supervisor/scripts/`, including `resolve_gate.py`, the helper that keeps both sides of a `scripts/screenshot-gate.mjs` merge conflict).
14. Fix the tracker drift (8.5). Archive the completed sessions that are no longer needed.

### 8.8 Open conflicts (the inputs disagreed; resolve them live)
(K4 and K5 were resolved on 09-30 and removed.)
- **K1 · HT-4b position (settled 2026-09-30 15:40 by the supervisor).** The merge order is HT-4 → HT-3 → HT-3b → HT-4b → HT-5 → HT-6 → HT-7 → HT-8 → HT-9 → HT-10. Why: the HT-4b card puts its slot after HT-4 and before HT-5, and HT-5 must regenerate against HT-4b's re-vendored golden B. The Routine prompt carries the same order.
- **K2 · Reviewer model.** The owner's 09-29 brief said Sonnet for "most reviews". AGENTS.md on main, the Routine and current practice use **Opus** for every reviewer and critic. Follow Opus.
- **K3 · Trigger lead time.** Supervisor `SKILL.md` and the owner say 1–2 minutes ahead. The supervisor's notes say 2–4. Both work if the time is in the future.
- **K6 · Owner quote times.** Relay records LR-23 at ~13:48, ESC-REPORT at ~14:55 and REL-3 at ~14:20. This file uses the chat times: 13:43, 14:41 and 14:14.
- **K7 · Privacy hosting.** `RELEASE-READINESS.md` lists "hosting the privacy policy" as an owner item. The policy page was deployed on 09-30 (DOC-3). Confirm the owner's OK is recorded before the next policy deploy.
- **K8 · Relay deploys.** `deploy-relay.yml` deploys whenever `relay/**` merges into main, but no rule says who merges those changes. Until the owner rules, do not merge `relay/**` changes without his yes.
- **K9 · Keystore handling.** AGENTS.md's Never list forbids touching keystore handling, but REL-3 added workflows that read the signing keystore. The owner's REL-3 decision (09-30) is the authority for those. The Never line has no exception note. Do not extend it.
- **K10 · Who merges Worker PRs.** AGENTS.md says "the owner merges". The owner's 09-29 brief ("On my yes for that PR, merge it") and his 09-30 15:15 delegation for #121 ("yes coach u merge it") have the supervisor merge after a per-PR yes. Follow: the supervisor merges only after the owner's explicit yes for that exact PR, quoted on the PR. Never merge one without it.
- **K11 · Escobar intelligence.** The owner asked on 09-29 11:25: "lets improve escobars intelligence and what else he can do." No card, lane or parked status was found for it. It is parked with PREM-PLAN here. Check whether PREM-PLAN #94 covers it (for example, the PREM-1 Opus switch) before giving it a card.
- **K12 · Effort rule.** The owner's 09-29 11:25 "Use opus max lower, sonnet medium lowest. For high outputs" has no agreed reading, and `create_session` has no effort field. Apply it where a tool takes an effort setting, once the reading is settled; record the reading in Relay LOG.

---

## 9. Lessons and gotchas (the incident → the rule)

| Incident | Rule |
|---|---|
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

More incidents: `.claude/skills/supervisor/gotchas.md` and `.claude/skills/builder/gotchas.md`.

---

## 10. Transfer checklist for a NEW Claude account

### 10.1 What the owner must connect on the new account
1. **GitHub:** the Claude GitHub app with access to `macdarenz-droid/M-arc`. The new account needs push to `claude/*` branches, plus PR comment and merge rights through the GitHub MCP. For how-tos, read the docs topic `github.access`.
2. **Relay:** the MCP server "2nd Supervisor M/ARC". The owner adds it himself, because its URL holds a token; never paste the URL into chat, a PR, a prompt or the repo. Check that the `…2nd_Supervisor_M_arc__*` tools appear.
3. **A Claude Code Remote cloud environment** that has:
   - network access to GitHub and its API;
   - the agent proxy's GitHub auth for plain `curl` calls. The monitor scripts need it: with it the limit is about 15,000 calls/h; without it, 60/h, and `branch-watch.sh` alone makes about 400 calls/h (10 branches every 90 s). Never commit a token to make them work;
   - Chromium at `/opt/pw-browsers/chromium` for the gate;
   - Node and npm.
   Get its new `env_…` id with `list_environments`.
4. **Models:** `claude-opus-5-5` and `claude-sonnet-5` must be available.

### 10.2 Stop the old supervisor first (one supervisor only)
On the old account, the owner or the old supervisor:
1. Disables `trig_01CtcvAE1PGAtH4dkxLVQZsR`, the hourly loop. Otherwise it keeps waking the old supervisor and two supervisors will run.
2. Disables or lets expire the one-shot triggers in 8.4.
3. Tells the old supervisor to stop, after its last update of this file.
4. Lets running builders push their work, then archives them from the old account. Never archive other projects' chats.

### 10.3 What the new account cannot reach
- Every session in 8.3. `create_trigger` refuses sessions of another account, so old builders cannot be messaged. PR comments stay visible, but an old builder only reads them if something wakes it.
- The 9 Routines in 8.4.
- In-chat workflows and their cache (for example `wf_e1e9c6e3-5fa`), and the old scratchpad (copies of plans and helper scripts). The monitor scripts survive only if the sup-1 PR merged.
- **What survives:** GitHub (branches, PRs, comments, CI, artifacts), Relay, and everything in the repo (this file, the skills, the scripts once merged).

### 10.4 Rebuild on the new account
1. Start the supervisor session on the repo **in auto mode**. `create_session`'s `permission_mode` cannot be more permissive than the calling session's mode, so a supervisor in default mode cannot start auto builders, and every builder would wait on approval taps. Read this file (section 0 order), then check section 8 live.
2. **The hourly loop:** `create_trigger` with:
   - `name "M/ARC supervisor loop"`;
   - `cron_expression "58 * * * *"`;
   - no `persistent_session_id`, so it fires into the new supervisor;
   - `initiation "human_request"`;
   - a prompt that holds: "Run the tick in `.claude/skills/supervisor/tick.md`, per AGENTS.md", the checks in 5.11, the current lane order from 8.2 (settled per K1), and "update `docs/supervisor/HANDOVER.md` by a docs PR at least every 3 h".
3. Optionally, the owner starts the fallback self-paced loop: `/loop Continue M/ARC supervisor progress per AGENTS.md: merge queue, builder check-ins and reviews, APK links with change lists, Relay upkeep`.
4. **The Wear Engine check:** a one-shot `create_trigger` at `run_once_at 2026-10-13T09:00:00Z` into the new supervisor: "ask the owner once whether Huawei replied (PR #88)".
5. Re-arm the monitors (6.5). Call `subscribe_pr_activity` on every open PR.
6. **Unfinished cards:**
   - Hard precondition: the old builder is archived first. `tick.md`: "archive the original before starting its replacement, so two builders never push to one card."
   - For each card whose builder was on the old account, start a new builder with `source_revision` = its branch **and** `outcome_branch` = that same existing `claude/<card>` branch, plus the full card. Otherwise the new builder pushes to a new branch and the open PR never moves. Add: "continue from the branch head; read every PR comment first".
   - For cards in review, start a fresh reviewer.
   - If `wf_e1e9c6e3-5fa`'s output is not in the repo or Relay, rerun the ESC-REPORT planning.
7. Record the takeover:
   - a Relay LOG line;
   - `PROJECT_STATE.md` (the new supervisor session);
   - update this file's "Last updated" line and section 8 by PR.

---

## 11. How to keep this file current

**When to update it:**
- At least every 3 hours while work is moving. The hourly Routine carries this item.
- After every new owner rule or decision: add it to section 3 or 4, verbatim, with the date.
- After every new lesson, a change in authority or mechanics, and before any planned transfer.

**How to update it:**
1. Use a branch `claude/sup-<n>-…` (the first is `claude/sup-1-handover`), cut from the latest main. **It changes only by PR.** Never push to main.
2. Make exact string edits only. Do not rewrite unchanged sections.
3. Re-capture section 8 from live data (open PRs, `list_sessions`, `list_triggers`, the Relay dashboard), never from memory. Update the "Last updated" line: date, UTC time, main SHA.
4. Update `docs/supervisor/scripts/` in the same PR when a script changes, for example the `branch-watch.sh` line 5 list or the `monitor.sh` `SKIP` list.
5. Before pushing, check the diff for secrets, tokens, the Relay URL, email addresses, phone numbers and private personal details (such as the names of the owner's other projects). Names of secrets are fine.
6. It is a docs-only PR: guard and CI green on a head that contains main, then the supervisor merges it with a merge commit. No APK.
   - **Authority:** the owner's 09-30 15:03 request to keep this file updated in the repo, and the hourly Routine's HANDOVER item ("merged when CI is green").
   - This authority covers only `docs/supervisor/HANDOVER.md` and `docs/supervisor/scripts/**`. Never put `AGENTS.md`, `.claude/**`, `.github/**` or any app file in this PR; those follow their own rules. That way it cannot become a way to change rules without review.
7. Add one Relay LOG line.

**One document per topic.** Update this file. Never create HANDOVER-v2, final, copy or similar.
