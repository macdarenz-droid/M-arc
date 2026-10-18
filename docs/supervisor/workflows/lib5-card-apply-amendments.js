export const meta = {
  name: 'lib5-card-apply-amendments',
  description: 'Apply section 14 card amendments 1-43 to the LIB-5 card exactly, then check the result against section 14',
  phases: [{ title: 'Apply' }, { title: 'Check' }, { title: 'Fix' }],
}
const S = '/tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad'
const CTX = `Files: the LIB-5 card ${S}/msg/final-LIB-5.txt (current text; also in ${S}/wt-cards/docs/supervisor/verify/lib-5-card.md, identical); section 14 ${S}/notes/lib5-section14.md ("### Card amendments" lists 43 numbered amendments, each an exact replacement or addition with source ids). Never touch the repo worktree's git state; never push, comment or message.`
phase('Apply')
const a = await agent(`${CTX}\n\nWrite ${S}/msg/LIB-5-card-v2.txt: the card with ALL 43 amendments applied exactly as section 14 states them (quoted old text replaced by the new text; additions placed where the amendment says). Keep every other byte of the card unchanged. Keep the card's existing structure and wording style. Where an amendment's old text is not found verbatim, apply it at the place it clearly means and list it. Also add one line under the card's title: "Amended by docs/supervisor/verify/lib4-cards.md section 14 (D-LIB5-NOTE); where they differ, section 14 wins." Return: a table amendment # -> applied exactly / applied at nearest place (why) / not applied (why).`, { label: 'apply', phase: 'Apply' })
phase('Check')
const CH = { type: 'object', properties: { problems: { type: 'array', items: { type: 'object', properties: { amendment: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['amendment', 'problem', 'fix'] } } }, required: ['problems'] }
const c = await agent(`${CTX}\n\nIndependently check ${S}/msg/LIB-5-card-v2.txt against section 14's 43 card amendments and against the original card: (1) each amendment is present and says exactly what section 14 says (no paraphrase that changes meaning); (2) nothing else changed (diff the two files: every changed hunk must map to an amendment); (3) the amended card does not contradict section 14's rulings. Report only real problems.`, { label: 'check', phase: 'Check', schema: CH })
phase('Fix')
const f = (c?.problems?.length) ? await agent(`${CTX}\n\nA checker found these problems in ${S}/msg/LIB-5-card-v2.txt:\n${JSON.stringify(c.problems, null, 1)}\nVerify each; fix the real ones in that file, minimally. Return a one-line result per problem.`, { label: 'fix', phase: 'Fix' }) : 'none'
return { apply: a, problems: c?.problems?.length ?? -1, fix: f }