export const meta = {
  name: 'next-split-after-swap',
  description: 'Root-cause and design the fix for "next split" ignoring which split was actually done',
  phases: [
    { title: 'Investigate', detail: 'the next-split pipeline and its consumers; the plan model, decisions and edge cases' },
    { title: 'Design', detail: 'one Opus designer writes the rule, the card and the failing-first tests' },
  ],
}

const CTX = `M/ARC gym app, repo /home/user/M-arc, main at 000918e (read-only: do not edit, commit or push anything).
Owner's bug (2026-10-03, Saturday): his weekly plan has SPLIT 1 UPPER BODY, SPLIT 2 LOWER AND CORE, SPLIT 3, SPLIT 4 CONDITIONING. He skipped SPLIT 2 (leg day) and did SPLIT 3 instead today. The Today screen then shows: card "SPLIT 3 done, 21 sets logged"; Readiness "Amber · calibrating 60": "the muscles for SPLIT 3 on Sun are not fully recovered. training load is well above your recent weeks." and "Today's session is done. Recover well; SPLIT 3 is next on Sun." His words: "whatever split i do, it should not blindly guess whats my nxt split specially when its done."
Known so far: src/brain/readiness.ts:142-143,181-182,247-248,327 uses input.next = nextScheduledSplitFor (src/escobar/tools/context.ts:58), which is nextScheduled(state.schedule, day): a pure weekday calendar lookup that ignores the sessions actually done. src/brain/coach/rules.ts:245 also reads a "next" split.
Rules: cite file:line for every claim; never guess (say "not verifiable" instead). Never use WebFetch or WebSearch. Do not run the app against any live service.`

const ANGLES = [
  { key: 'pipeline', prompt: `${CTX}
Your angle: THE PIPELINE AND EVERY CONSUMER. Find nextScheduled (and scheduledSplitFor) and every place that shows or uses "today's split", "the next split" or the weekly plan: readiness (Today card text and drivers), coach rules (src/brain/coach/rules.ts), Escobar tool context and tools (src/escobar/**), the Today screen's split card ("SPLIT 3 done"), the Train tab's default selected split chip and "Start <split>" button, weekly stats ("You hit your planned sessions", "Strong week"), any reminders or notifications, the watch/wear bridge only if it reads it (do not propose changes there: watch-agent owned files are off limits). For each: file:line, what it computes, what it shows the user, and what it would show in the owner's case. Also say exactly how a finished session is tied to a split (field names) and how "done today" is decided. List the existing tests that pin current behaviour (file:line) and say which would need to change.` },
  { key: 'model', prompt: `${CTX}
Your angle: THE PLAN MODEL, PAST DECISIONS AND EDGE CASES. Read the saved model (src/core/models.ts: schedule, splits, sessions), docs/COACHING-DECISIONS.md entries on the schedule / QA8-2 / next split / swaps (search "QA8-2", "schedule", "swap", "next split", "Escobar swap", "swappedFromToday"), and any decision about rotation vs fixed weekdays. Answer: (1) Is the plan meant as fixed weekdays or as an ordered rotation? Quote the decisions. (2) Is there an existing "swap" concept (e.g. Train.tsx swappedFromToday from AUD-10, an Escobar swap tool) and how does it record which split replaced which? (3) List the real-use edge cases the fix must handle, each with the expected result: skip one split and do the next; do a split early; do two splits in one day; rest day after; a split not on any weekday; the same split twice in a week; a past session logged later ("Log a past session"); week boundary (Sun/Mon); a split edited or deleted; no schedule at all. (4) Any constraint: no new kinds of saved data without the owner's yes (AGENTS.md) - say whether a fix can be pure derivation from existing sessions + schedule.` },
]

phase('Investigate')
const found = (await parallel(ANGLES.map(a => () =>
  agent(a.prompt, { label: `investigate:${a.key}`, phase: 'Investigate', model: 'opus' }).then(r => ({ key: a.key, r }))))).filter(Boolean)
log(`${found.length}/2 investigations in`)

phase('Design')
const design = await agent(`${CTX}
You are the designer. Two investigators reported below. Re-open the key files yourself to confirm the root cause before designing.
Produce a task card for a builder (the repo's builder skill: .claude/skills/builder/SKILL.md; the card format in .claude/skills/supervisor/cards.md - read both). Requirements:
1. Root cause in 2-3 plain sentences, with file:line.
2. The rule: a single pure function (one source of truth) that answers "what is next" from the existing schedule + sessions only (no new saved data), used by readiness, coach rules, Escobar context and the Train tab default chip if it uses the same idea. Recommend ONE rule and say why (e.g. weekdays decide WHEN; the split is the one most overdue in plan order, and never one already done since its last scheduled slot), and how it treats each edge case the model investigator listed. Keep "today's scheduled split" display honest after a swap (today the card should reflect what was done and what was skipped, if anything is shown).
3. write_scope (exact files), acceptance criteria each mapped to evidence (unit tests that FAIL on main 000918e and pass after; name each test and its fixture, including the owner's exact case: Sat, SPLIT 3 done, SPLIT 2 skipped, Sun scheduled SPLIT 3 -> next must not be SPLIT 3), and the supervisor-named mutation per criterion.
4. UI copy rule from AGENTS.md (no explaining or talking down; headings 1-3 words). Any new user-facing sentence must be quoted in the card.
5. Risks and mitigations; what is out of scope.
Output the card as Markdown, then a 4-line plain-words summary for the owner (what is wrong, what it will do instead, one example with his splits).

${found.map(f => `=== ${f.key} ===\n${f.r}`).join('\n\n')}`, { label: 'design', phase: 'Design', model: 'opus' })

return { found, design }