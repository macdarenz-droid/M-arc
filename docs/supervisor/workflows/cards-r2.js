export const meta = {
  name: 'cards-r2',
  description: 'Second adversarial check-and-fix round on the LIB-4d and LIB-8-FIX cards (re-run reproductions and mutation red lines on current main)',
  phases: [{ title: 'Check' }, { title: 'Fix' }],
}
const A = args
const BASE = `Repo clone ${A.repo}; run \`git fetch -q origin\` and fetch open PR heads you need (git fetch -q origin pull/<n>/head:refs/remotes/pr/<n>). Read-only in the repo; probes in your own dir under ${A.scratch}. Main is now ${A.main} (train 25 merged LIB-4a #233 and #251). Card format: lib-5-card.md on origin/claude/sup-lib4-cards; rulings: lib4-cards.md there (section 12 items 2, 20, 21; section 13.2 D-LIB9-CLONE). AGENTS.md rules (nothing loosened; a fix has a test red before and green after; plain words). Report only real defects with evidence; do not re-raise style points; earlier rounds already applied many fixes.`
const CARDS = [{ k: '4d', out: A.out4d }, { k: '8fix', out: A.out8 }]
const res = await pipeline(CARDS,
  c => parallel([
    'Lens: correctness. Re-run the card\'s reproductions on current main and a prototype of its fix (outside the repo); check every stated red line and timing is real, every mutation really turns red, every file:line is right, nothing is loosened (no timeout raised beyond what the card names and justifies, no assertion weakened).',
    'Lens: fitness. write_scope vs fix, ownership (AGENTS.md table), collisions with every open PR head (diff them now), lane and merge rules, field format, invented names; for LIB-8-FIX also whether D-LIB8FIX-ENV and D-LIB8FIX-CARRY as proposed are sound and strict.',
  ].map((lens, i) => () => agent(`${BASE}\n\nRead the card at ${c.out} (do not edit it). ${lens}\nReturn findings: severity, quote, problem with evidence, exact replacement text.`, { label: `check:${c.k}:${i}`, phase: 'Check', schema: { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string' }, quote: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'quote', 'problem', 'fix'] } } }, required: ['findings'] } }))).then(cs => cs.filter(Boolean).flatMap(x => x.findings)),
  (f, c) => f.length ? agent(`${BASE}\n\nThe card at ${c.out} has these second-round findings:\n${JSON.stringify(f, null, 1)}\nVerify each yourself. Apply every confirmed one to ${c.out}; reject the rest with evidence. Return counts by severity applied/rejected and a one-line reason each.`, { label: `fix:${c.k}`, phase: 'Fix' }).then(x => ({ k: c.k, n: f.length, sev: f.map(y => y.severity), fix: x })) : { k: c.k, n: 0 })
return res