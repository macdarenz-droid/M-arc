export const meta = {
  name: 'w2-triage',
  description: 'LR-29 w2: dedupe 92 critic findings from 4 runs, verify each against the real head adversarially, rule the two open questions, and write per-owner fix packets',
  phases: [{ title: 'Dedupe' }, { title: 'Verify' }, { title: 'Rule' }, { title: 'Packets' }],
}
const A = args
const CTX = `Research worktree (read-only; never edit, commit or push): ${A.wt}, branch claude/libht-verify-w2 @ ${A.head} = W2A a33d8f3a + W2B d4f30c70 + the8 e6381fa4 merged on research 9dbc7e0a. Files: docs/research/howto/{cards,quotes,shared}/*.json, verify/*.md, CARD-V2.md, RULINGS.md (LR-1..LR-29), and content.md via \`git -C ${A.wt} show origin/claude/howto-options:docs/howto/library/inputs/content.md\`. Supervisor rulings in force: D-LIB9-FACTPOSE (a plate fact's pose is the pose its quote states; a setup quote is the start pose only), D-W2-TEMPO (LR-15 tempo: ACSM 1-2 s is for intermediate/advanced only, so tempo claims are WEAK or a named drawing convention), section 13 Q1 of lib4-cards.md (topFault; \`git -C ${A.wt} show origin/claude/sup-lib4-cards:docs/supervisor/verify/lib4-cards.md\`). Network: curl only (desktop UA); PubMed through NCBI efetch; never WebFetch or WebSearch. Rules: never invent a way out or a source (LR-3); never soften a safety line; shown lines in plain words with no study wording (LR-27); nothing loosened.
File owners: W2A = cards/{chin_up,hanging_knee_raise,assisted_pull_up,shoulder_press}.json, their quotes/, shared/dumbbell-kickup.json, quotes/shared-dumbbell-kickup.json. THE8 = cards/{dumbbell_lateral_raise,barbell_back_squat,pull_up,hanging_leg_raise,lat_pulldown,seated_cable_row,leg_press,machine_chest_press}.json, their quotes/, verify/the8.md. HELPER = every other card or quotes file (the W2B files).`

const DEDUPE = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, owner: { type: 'string', enum: ['W2A', 'THE8', 'HELPER', 'SUPERVISOR'] }, files: { type: 'array', items: { type: 'string' } }, fields: { type: 'string' }, severity: { type: 'string' }, claim: { type: 'string' }, evidence: { type: 'string' }, proposedFix: { type: 'string' }, runs: { type: 'array', items: { type: 'string' } } }, required: ['id', 'owner', 'files', 'fields', 'severity', 'claim', 'evidence', 'proposedFix', 'runs'] } } }, required: ['items'] }
phase('Dedupe')
const dd = await agent(`${CTX}

Read ${A.findings}: 92 findings from 4 blind critic runs on this head (run 'valid-4' is the valid one; its two planted errors are already removed; the 'invalid-*' runs were invalid only because their plants fell outside the reviewed scope, so their findings are real claims to check). Merge findings that name the same defect (same file and field, or the same rule break across a listed set of files) into one item; keep every distinct defect. Split a multi-owner finding into one item per owner. Use the highest severity any run gave. Owner SUPERVISOR is only for the two open questions (W2A's BarBend vs dumbbell-kickup c5 conflict; single_arm_lat_pulldown plate.mistake drawable) and any cross-card rule question (for example one rule for the 8's plate.mistake pick, or plate.tempo.pause values for 'Pause momentarily'), and also a coverage note: the critic's file list left out quotes/{chin_up,hanging_knee_raise,assisted_pull_up}.json (they exist on the head). Ids W2-1, W2-2, ... Return every item.`, { label: 'dedupe', phase: 'Dedupe', schema: DEDUPE })
const items = dd?.items || []
log(`${items.length} canonical items`)

const VER = { type: 'object', properties: { real: { type: 'boolean' }, severity: { type: 'string', enum: ['blocker', 'high', 'medium', 'low', 'none'] }, reason: { type: 'string' }, edits: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, field: { type: 'string' }, old: { type: 'string' }, new: { type: 'string' } }, required: ['file', 'field', 'old', 'new'] } }, gapOrNote: { type: 'string' } }, required: ['real', 'severity', 'reason', 'edits'] }
const verified = await pipeline(items.filter(i => i.owner !== 'SUPERVISOR'), it =>
  agent(`${CTX}

A blind critic claims this defect on the head. Check it against the real files and, where it turns on a source, re-read the source by curl/efetch. Try to REFUTE it; default to real=false when the evidence does not hold. If real, give the exact edits: for each, the file, the JSON field path, the old value copied exactly from the head, and the new value. New shown text must come only from the card's own claims and quotes (or a cited inherit line that the parent card really carries, LR-8), in plain words, and never weaker on safety. When no source supports a needed line, the edit removes the unsupported words and gapOrNote gives the gap or notes text to add (dated 2026-10-18), never an invented line. Keep JSON valid in your head: give values as they would appear in JSON.
${JSON.stringify(it, null, 1)}`, { label: `verify:${it.id}`, phase: 'Verify', schema: VER }).then(v => ({ ...it, verdict: v })))

const sup = items.filter(i => i.owner === 'SUPERVISOR')
phase('Rule')
const RULE = { type: 'object', properties: { rulings: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, question: { type: 'string' }, ruling: { type: 'string' }, why: { type: 'string' }, edits: { type: 'array', items: { type: 'object', properties: { owner: { type: 'string' }, file: { type: 'string' }, field: { type: 'string' }, old: { type: 'string' }, new: { type: 'string' } }, required: ['owner', 'file', 'field', 'old', 'new'] } } }, required: ['id', 'question', 'ruling', 'why', 'edits'] } } }, required: ['rulings'] }
const rulings = await agent(`${CTX}

You are the supervisor's judge for these open questions and cross-card rule items (each with the critic runs' views, which disagree in places):
${JSON.stringify(sup, null, 1)}
For each, read the cards' own claims and quotes (and re-fetch a source when the answer turns on its words), and rule. For single_arm_lat_pulldown, CARD-V2's drawable rule and section 13 Q1 decide: say whether drawable stays true with the past-end pull as plate.mistake, or becomes false, from the card's own quotes; if the quotes cannot show which fault is most common, say that and rule the safe reading. For any rule across the 8 (plate.mistake pick, tempo.pause), give one rule and the per-card edits it implies. For the coverage note, say what the recheck must add. Give exact edits with owners. Plain short sentences.`, { label: 'rule', phase: 'Rule', schema: RULE })

const real = verified.filter(Boolean).filter(x => x.verdict?.real)
phase('Packets')
const packets = await agent(`${CTX}

Build the fix packets for one LR-29 fix round. Inputs:
VERIFIED REAL ITEMS: ${JSON.stringify(real.map(x => ({ id: x.id, owner: x.owner, severity: x.verdict.severity, reason: x.verdict.reason, edits: x.verdict.edits, gapOrNote: x.verdict.gapOrNote })), null, 1)}
RULINGS: ${JSON.stringify(rulings, null, 1)}
Check the edits for conflicts (two edits on one field), merge them, and check each old value is exactly on the head (git -C ${A.wt} show HEAD:<file> | jq). Write three files:
- ${A.out}/packet-W2A.md, ${A.out}/packet-THE8.md, ${A.out}/packet-HELPER.md: for the owner, a numbered list; each item = id, severity, file, field, exact old, exact new (or gap/notes text), one-line reason. At the top: "Fix exactly these and nothing else; then re-run your A1-A6 / validation, have your Sonnet fetcher check every new or changed quote, push once, and post FIXED with the sha." Note any field the owner's card reserved that this packet now routes to them by name.
- ${A.out}/w2-findings.md: the table of every canonical item (id, owner, severity, real/rejected, one-line reason) plus the rulings, for verify/w2.md.
Return: counts per owner and severity, the rejected count, and any old value that did not match the head.`, { label: 'packets', phase: 'Packets' })
return { items: items.length, real: real.length, rejected: verified.filter(Boolean).filter(x => !x.verdict?.real).map(x => ({ id: x.id, why: x.verdict?.reason })), rulings, packets }