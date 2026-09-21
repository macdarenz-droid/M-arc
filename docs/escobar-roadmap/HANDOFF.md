# HANDOFF → Escobar proactive-coach build

**Status:** design complete, 3 of 14 specs written, 11 specs outstanding.
**Written by:** Claude Opus 5 (design/architecture pass), 2026-09-21.
**For:** the next model to continue — design work at T3, implementation at T1/T2.

---

## Project

**M/ARC** — a Preact + TypeScript fitness tracker. Cloudflare Worker proxy
(`proxy/`) fronts Claude Sonnet 5, the in-app coach persona is **Escobar**.
Repo root `/home/user/M-arc`, working branch
`claude/phase-9-readiness-preference-ckw91g`.

**Goal of this workstream:** Escobar today is a chat assistant behind an
"Ask a question" button. Turn it into a proactive coach woven through the app —
intervening at the right moments, learning from real logged data, surfacing
advice where the person already is.

---

## Read these first, in this order

1. **`00-CODEBASE-BRIEF.md`** (this folder) — 16k-word ground-truth map of the
   codebase, produced by 8 agents that read the real source: every
   deterministic signal already computable, the Finding/Proposal contract and
   its seams, the full AppState shape, the live-logging flow, every screen, the
   proxy/quota/caching plumbing with real numbers, everything already
   proactive, and the hard constraints. **Trust this over memory.** It is the
   reason the specs name real functions instead of invented ones.
2. **`01-SCOREBOARD.md`** — 30 canonical features, each scored by three
   independent judges on value / effort / architectural fit, ranked by a
   composite. Also lists what was dropped at merge and why.
3. **`spec-1..3-*.md`** — three complete, implementation-ready specs.
4. **`docs/COACH_BRAIN.md`** — the project's own decision log. Every entry
   explains why something is shaped the way it is. Append to it when you ship.

---

## What was done

A 130-agent workflow: 8 parallel codebase readers → shared brief → 8
independent design lenses (pre-set moments, post-session, daily/ambient,
long-horizon, *new brain signals nobody computes yet*, zero-network,
conversational hooks, recovery/body) → semantic merge to 30 canonical features
→ 90 scoring agents (3 complementary judges each) → spec writing.

**111 of 130 agents completed.** The run died on a session limit during the
spec round. Everything upstream of that survived and is captured in this folder.

### Complete and usable
- The codebase brief (`00-CODEBASE-BRIEF.md`)
- All 30 candidates scored and ranked (`01-SCOREBOARD.md`)
- 3 full specs, 60–70k chars each (`spec-1`, `spec-2`, `spec-3`)

### Lost to the session limit — must be redone
- **Specs 4–14** (11 features, all ranked, none specced — see table below)
- **Adversarial verification of specs 1–3.** This matters: the verify pass
  greps the real repo to confirm every file path, function and type a spec
  names actually exists. It did not run. **Treat specs 1–3 as unverified** and
  fact-check each referenced symbol before implementing.
- **Roadmap synthesis** (phase sequencing) and the **completeness critic**
  (what moments nothing covers). Both worth redoing.

---

## The ranked shortlist

Composite = `value*2 + differentiation + fit − noiseRisk*0.5 − effort*0.8`.
Effort is 1–10 for a mid-tier agent working from a good spec.

| # | Score | Feature | Effort | Network | Spec |
|---|---|---|---|---|---|
| 1 | 24.8 | Swap at the rack: mid-session substitutes with real targets | 4 | optional | ✅ |
| 2 | 24.1 | Effort-graded rest timer | 3 | never | ✅ |
| 3 | 24.0 | Morning verdict: check-in answered against your own normal | 5 | never | ✅ |
| 4 | 23.5 | Live autoregulation: in-session target answering the sets you just did | 5 | never | ❌ |
| 5 | 22.9 | Warm-up ramp for the first heavy compound | 2 | never | ❌ |
| 6 | 22.8 | The exercise you always drop (chronic skip) | 4 | never | ❌ |
| 7 | 22.5 | Week in review | 5 | never | ❌ |
| 8 | 21.8 | Lift trajectory: velocity, projection date, falsifiable expiry | 4 | never | ❌ |
| 9 | 21.5 | Unfinished coach items: re-raised dismissals and stranded drafts | 5 | never | ❌ |
| 10 | 21.2 | Session debrief: plan vs actual on the finish screen | 6 | never | ❌ |
| 11 | 21.1 | Effort-rating repair and calibration | 3 | never | ❌ |
| 12 | 20.6 | PR in reach (pre-set record badge) | 3 | never | ❌ |
| 13 | 20.5 | The day that died (consistency drift) | 5 | never | ❌ |
| 14 | 20.3 | One rep short: near-miss records | 4 | never | ❌ |

Candidates 15–30 are in the scoreboard with full scoring detail — several are
strong (pre-set soreness brief, recovery debt) and were cut only by the top-14
cap, not by merit.

**The headline finding: 12 of the top 14 need zero network calls.** The
deterministic brain already computes almost everything required. This is a
brain-and-UI workstream, not a prompting workstream — which also means it
works offline and costs nothing against the per-device daily quota.

**Shared foundation:** `src/brain/live.ts` is a new file that features 1, 2, 4,
5 and 15 all build on. **Build it once, first.** Specs 1–3 each describe it;
they agree on the module's shape and say to append rather than overwrite.

---

## Constraints any implementation must respect

Non-negotiable, enforced throughout the existing codebase:

1. **The deterministic brain decides; the LLM only phrases.** New logic goes in
   `src/brain/**` as pure functions. Never compute a displayed number in a prompt.
2. **Every number traces to real logged data.** `allowedNumbers`/`validateText`
   in `src/brain/coach/explainer.ts` drop any answer citing an ungrounded figure.
3. **Nothing changes user data until an explicit tap.** Every proposal is
   accept/dismiss. Never write state from a suggestion appearing.
4. **Raw body measurements never leave the device.** `validateGrounding` in
   `proxy/src/handler.ts` refuses payloads carrying them. Derived BMI is the one
   audited exception.
5. **Offline-first.** The online coach is opt-in and quota-limited. Every feature
   needs a defined degraded state with it switched off.
6. **Named non-goals:** no injury prediction, no diagnosis, no individualized
   medical guidance.

**Quality bar before any commit** (this repo holds to it strictly):
`npx tsc --noEmit` (app + `proxy/`) → `npx vitest run` (both) → `npm run build`
→ `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (5-theme visual gate)
→ live Playwright verification of the actual feature → a `docs/COACH_BRAIN.md`
decision-log entry → commit → push → confirm CI green.

---

## Recommended next steps

**Step 1 — finish the design (T3: Astra / Opus).** Write specs 4–14 using
specs 1–3 as the template, and run the verification pass on 1–3. The spec
format that worked: user story, brain work with exact file paths and exported
signatures, contract changes, files to create/modify, UI spec with real copy
templates and placeholder sources, data flow, network/offline, named test
cases, acceptance criteria, and an explicit **do-NOT** list aimed at traps a
cheaper model would fall into. The do-NOT list is what makes these
Sonnet-executable.

**Step 2 — verify.** For each spec, grep every referenced path, function, type
and state field against the real repo. A spec naming a function that does not
exist is worse than no spec.

**Step 3 — implement (T1/T2: Sonnet).** Build `src/brain/live.ts` first, then
features in scoreboard order. One feature per commit, full quality bar each time.

---

## Prior context

Tiers 0–3 of an earlier "Escobar intelligence audit" are **complete, shipped
and CI-green** — deload-aware targets, provenance-aware grounding, a stats
snapshot, per-sentence grounding, an honest app map, self-model/correction/
warmth/date-reasoning rules, persisted chat memory and stated constraints, and
a typed `actions[]` envelope. See `docs/COACH_BRAIN.md`. Do not re-propose them.

**Outstanding deploy:** proxy changes from that work need `cd proxy && npm run
deploy` from an authenticated machine; the app needs its usual Netlify deploy.

## Raw artifacts

Full workflow output (all agent returns, including the 3 specs verbatim):
`/tmp/claude-0/-home-user-M-arc/357e94e5-a98c-5e96-b108-df6a3a9bb9ab/tasks/w1n3pvw0z.output`
— session-scoped, will not survive container recycling. This folder is the
durable copy.
