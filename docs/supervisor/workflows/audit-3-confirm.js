export const meta = {
  name: 'audit-3-confirm',
  description: 'Confirm or refute every open audit finding (audit 3 + improvement audit) against main 000918e with reproduction tests',
  phases: [
    { title: 'Reproduce', detail: 'one Opus verifier per area writes scratch failing tests on main' },
    { title: 'Skeptic', detail: 'one Opus skeptic re-runs every CONFIRMED repro and tries to refute it' },
  ],
}

const S = '/tmp/claude-0/-home-user-M-arc/3ce718af-58e5-5eb0-aea0-2faec1f835c0/scratchpad'
const WT = S + '/train10'
const BASE = `You verify audit findings for the M/ARC gym app. The code under test is main at 000918efdf87974931ad1a630dd0bc5839b6285d, checked out (detached, node_modules installed) at ${WT}. Work ONLY in that directory.
Reports: ${S}/audit-3.md (audit 3, baseline 94fd32c; main has only added HT-9's How-to Setup/Risks sections since) and ${S}/improvement-audit.md (the earlier improvement audit, IDs ENG-0x, UI-R0x, IMP-E0x, IMP-N0x). Read only the sections for your findings.
For EACH finding assigned to you:
1. Read the cited source on main and decide whether the claimed code path still exists unchanged.
2. Reproduce it with a scratch vitest test in ${WT}/tests/_a3/<your-group>/ (create the folder; one file per finding is fine). The test must assert the CORRECT behaviour, so it FAILS on main if the bug is real. Run only your folder: cd ${WT} && npx vitest run tests/_a3/<your-group>. Use fake timers/controlled clocks and in-memory state; stub fetch/XHR/WebSocket and native plugins; never call any live server, the coach endpoint or a paid model.
3. Verdict per finding: CONFIRMED (the test fails on main for the claimed reason; paste the assertion failure line), NOT REPRODUCED (explain why: fixed since, wrong premise, intended policy), or SOURCE-ONLY (cannot be reproduced in unit tests, e.g. native timing or store text; then cite the exact code/text and say how sure you are).
4. Severity in user terms (data loss, wrong advice, privacy, cosmetic) and the smallest correct fix in one or two sentences.
Never edit files outside tests/_a3/<your-group>/. Never commit, push or open PRs. Never use WebFetch or WebSearch. Cite file:line. No guessing.
Return a Markdown table: ID | verdict | evidence (test file + failing assertion, or file:line) | severity | fix, followed by short notes.`

const GROUPS = [
  { key: 'coach-consent', ids: 'COACH 01 (retry resends after sharing is switched off); IMP-E02 and IMP-E03 (undo hits the wrong conversation / overwrites newer profile data); IMP-E04 (Apply accepts a deleted referenced gym); IMP-E06 (haptic preference vs runtime)' },
  { key: 'coach-facts', ids: 'IMP-E01 and IMP-E05 (Escobar gets different workout facts than the live screen: active factor, pause/rest/done counts); ENG-01 (current gym/menu across target, warmup and live retarget)' },
  { key: 'data', ids: 'DATA 01 (custom exercise import can produce an unreadable saved state); DATA 02 (a stale tab can restore data before reset events arrive); QA CSV 01 (CSV export text can become spreadsheet formulas); QA CACHE 01 (Reset does not clear app-owned export copies)' },
  { key: 'timing', ids: 'UI 05 (completed workouts can end in the future); ENG-05 (history insertion and timing correction leave recovery calibration stale); ENG-02 (red readiness and lighter weeks use stale set counts); UI-R01 (substitution erases committed work); UI-R04 (edited content loses truthful timing provenance)' },
  { key: 'history', ids: 'UI-R02 (known distinct exercise IDs merge history); UI-R06 (live gym deletion silently changes context); ENG-03 (later-week sessions change a prior week verdict); ENG-04 (warmup-only sessions count as completed workouts); ENG-06 (untrusted duration baseline); ENG-07 (future history contaminates a past debrief)' },
  { key: 'schedule', ids: 'UI-R03 (day-off intent is not shared: Today shows rest while the coach still warns about the scheduled split; day-off, Undo and next-session copy must agree); UI-R05 (onboarding draft disappears when the last profile field is filled). ALSO the owner\'s new bug BUG-38: after doing SPLIT 3 on a day another split was scheduled, readiness says "SPLIT 3 is next on Sun" (src/brain/readiness.ts:327 via nextScheduledSplitFor, src/escobar/tools/context.ts:58). Reproduce BUG-38 too, and list every other place where the plan (state.schedule) is read without considering sessions actually done or day-off exceptions.' },
  { key: 'native', ids: 'IMP-N01 (an older alert request can undo a newer cancellation); IMP-N02 (a health read can repopulate data after Reset); IMP-N03 (a late web wake lock survives switching it off)' },
  { key: 'store', ids: 'PLAY 01 (store submission draft understates the AI report data flow) and the custom server encryption claim. These are text checks: compare the repo\'s store/privacy drafts (search docs/ for Data safety, privacy policy, store listing) with what the code actually sends (src/escobar/**, src/errors/**, the content report path). No tests needed; cite text and code.' },
]

phase('Reproduce')
const results = await pipeline(GROUPS,
  g => agent(`${BASE}\nYour group folder: tests/_a3/${g.key}/\nYour findings: ${g.ids}`, { label: `verify:${g.key}`, phase: 'Reproduce', model: 'opus' }).then(r => ({ key: g.key, r })),
)
const ok = results.filter(Boolean)
log(`${ok.length}/${GROUPS.length} groups verified`)

phase('Skeptic')
const skeptic = await agent(`${BASE}
You are the skeptic for all groups. The verifiers' tables are below. For every finding marked CONFIRMED:
- re-run its test (npx vitest run <file>) and confirm it fails on main;
- read the test: does it exercise the real code path (not a mock that creates the bug), and does the asserted "correct" behaviour match the app's documented intent (docs/COACHING-DECISIONS.md, the card or code comments)? A deliberate, documented policy is NOT a bug;
- downgrade to NOT A BUG or UNSURE with a reason when it fails these checks.
For SOURCE-ONLY items, check the cited code yourself and give your confidence.
Output ONE final Markdown table for all findings: ID | final verdict (CONFIRMED / NOT A BUG / FIXED ON MAIN / SOURCE-ONLY high|low / UNSURE) | one-line evidence | severity | related to the next-split bug BUG-38? (yes/no) | smallest fix. Then a list of the scratch test files that prove each CONFIRMED item (they stay unmerged in ${WT}/tests/_a3/ for the builders).

${ok.map(x => `=== ${x.key} ===\n${x.r}`).join('\n\n')}`, { label: 'skeptic', phase: 'Skeptic', model: 'opus' })

return { groups: ok, skeptic }