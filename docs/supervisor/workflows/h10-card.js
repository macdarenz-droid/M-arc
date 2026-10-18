export const meta = {
  name: 'h10-card',
  description: 'Draft the small LIB-3b card that closes the PQ-H10 value and envelope gap, then check it adversarially and fix it',
  phases: [{ title: 'Draft' }, { title: 'Check' }, { title: 'Fix' }],
}
const A = args
const CTX = `Repo: ${A.repo} (a clone; run git fetch -q origin first). Read only: never edit, commit or push in the repo. Write only the file named below.
Facts to read yourself (never trust this prompt over the code):
- origin/main @ ${A.main}: tools/plates/library/qa/node.mjs (validateParams and h10, near the "PQ-H10" banner), tools/plates/library/derive.mjs (PARAMS, paramProblems, derive), tools/plates/library/qa/envelope.json, tools/plates/library/candidate.mjs (the D/T derivation block near :70-80, schema: PARAMS), and every test that calls validateParams, h10 or paramProblems (git grep on origin/main; LIB-3's M21-M23 use a test schema with \`enum\`).
- The supervisor's record of the gap: \`git show origin/claude/sup-lib4-cards:docs/supervisor/verify/lib4-cards.md\`, section 13 item (f) "Known H10 gap" and section 13.1's medium finding on candidate.mjs:74 vs validateParams, and the Q5 line ("goes to a separate small card before any D row exists on any branch. LIB-9a does not touch qa/").
- Card format: docs/supervisor/verify/lib-5-card.md on origin/claude/sup-lib4-cards (field names and order: id, model, base, branch, depends_on, build_prerequisites, merge_prerequisites, write_scope, reserved_paths, outcome, deliverable, evidence, finish, read_first, Do, Acceptance with mutations, risk_and_recovery, return). Rules: AGENTS.md (file ownership, "a bug fix needs a test that fails before and passes after", nothing loosened, plain short words).
- Open PRs that may touch the same files. Check each head with \`git diff --name-only origin/main...<sha>\` over tools/plates/library/qa/**, derive.mjs, candidate.mjs and tests/howto/library-qa*.test.ts: ${A.heads}.`

const draft = await agent(`${CTX}

Task: draft card LIB-3b, "PQ-H10 checks values and the envelope on the real path". Write it to ${A.out}.
Must hold:
1. Root cause stated from the code with file:line on ${A.main}: validateParams reads s.enum and s.min/s.max, while PARAMS writes {type:'enum', values} and numbers with no range; the envelope is never passed on the real path; empty params pass. Reproduce on main with a throwaway script (outside the repo, in your scratch dir) that runs validateParams with schema PARAMS: show 'bar.kind':'banana', 'camera.maxScale':99, 'handedness':7 and {} all give no H10.value. Put the exact output in the card's evidence section as the "before" proof.
2. Pick the fix by reading the code, and say why in two lines. Options include making h10 also apply derive.mjs paramProblems(params, envelope) with the real envelope, or making validateParams read PARAMS's values, or both. The real path must reject a bad enum value, a wrong type, a number outside the envelope, an unknown key, a raw-spec key, a view key, and empty params. Keep every existing H10 problem key and message (H10.raw, H10.unknown, H10.value, H10.byte, H10:missing); new rejections reuse H10.value or get a new key that the card names. State what happens today with envelope.json naming no PARAMS key (every D param then fails): that is the correct strict result until an approved envelope row exists, and the card must not add envelope rows (owner/supervisor approval, LIB-10's job) — check this claim against envelope.json and its readers before writing it.
3. write_scope: exactly the files the fix and its tests need. If the fix is in qa/node.mjs, say that qa/ is LIB-3's merged code, no open PR edits it (from your collision check; list the result), and LIB-9a stays out of qa/ (section 13 Q5). If a candidate.mjs edit is needed, check the collision with LIB-9a #245 (it edits candidate.mjs in Do 4) and say how to avoid it (prefer a fix that does not touch candidate.mjs).
4. Acceptance rows, each with a mutation that must turn red: the four "before" inputs each red on the real path (candidateOf -> runQa, or h10 on a real candidate, never a hand-built one); a clean in-memory D copy green except for envelope (say exactly which problem it gets today); an existing-test row (every existing H10 test unedited and green); a no-loosening row (diff of the old checks). Name the test file and test names.
5. Lane: it is a LIB builder card and waits for a free slot under D-LIB-LANE-ACTIVE (max 4 active: LIB-4a, LIB-4b, LIB-4c, LIB-9a now). merge_prerequisites: review PASS, checks green on a head with latest main; it must merge before any D or T row exists on any branch (LIB-10 depends on it).
6. model: claude-opus-5-5 unless every step is mechanical. Builder follows .claude/skills/builder/SKILL.md. Branch claude/lib-3b-h10-values. base: origin/main @ ${A.main}.
Write short plain sentences, no filler. Return: the card path, the chosen fix in one line, the reproduction output, and the collision table.`, { label: 'draft', phase: 'Draft' })

const lenses = [
  { k: 'strict', p: 'Lens: correctness and no loosening. Does the chosen fix truly reject every bad input on the REAL path (candidateOf output fed to runQa / h10)? Run the before-proof yourself on main. Read validateParams, h10, paramProblems, derive() and every caller. Find any input class still passing, any existing problem key or message the card would change, any test the card would need to edit, any claim about envelope.json or its readers that is false, and any mutation that would not actually turn red.' },
  { k: 'card', p: 'Lens: card fitness. Check write_scope against the fix (too wide or missing a file), collisions with the open PR heads (run the diffs yourself), lane and merge rules against AGENTS.md and lib4-cards.md (D-LIB-LANE-ACTIVE, section 13 Q5), the field format against lib-5-card.md, every file:line citation on main, and every acceptance row having a named test and a red mutation. Flag vague words, invented names or functions, and anything that asks the builder to add envelope rows or touch .github, package files or another lane\'s files.' },
]
const checks = await parallel(lenses.map(l => () => agent(`${CTX}

Read the draft card at ${A.out} (written by another agent; do not edit it). ${l.p}
Return findings as JSON: each with severity (blocker/high/medium/low), the card line quoted, what is wrong with evidence (file:line or command output), and the exact replacement text.`, {
  label: `check:${l.k}`, phase: 'Check',
  schema: { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string' }, quote: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'quote', 'problem', 'fix'] } } }, required: ['findings'] },
})))
const all = checks.filter(Boolean).flatMap(c => c.findings)
log(`${all.length} findings from ${checks.filter(Boolean).length} checkers`)
if (!all.length) return { draft, findings: [], fix: 'none needed' }
const fix = await agent(`${CTX}

The card at ${A.out} has these checker findings:
${JSON.stringify(all, null, 1)}
Verify each against the code yourself (a checker can be wrong). Apply every finding you confirm to ${A.out}; for each you reject, say why with evidence. Return a table: finding -> applied/rejected -> reason.`, { label: 'fix', phase: 'Fix' })
return { draft, findings: all, fix }