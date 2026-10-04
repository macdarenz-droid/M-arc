export const meta = {
  name: 'research-verify',
  description: 'LR-29 research verify: plant 2 errors in a history-free copy, run a blind Opus critic with a tier-A safety check and a source re-fetch, check calibration, rerun if invalid',
  phases: [
    { title: 'Prepare', detail: 'copy the wave files without git history and plant 2 errors (one tier A)' },
    { title: 'Critic', detail: 'fresh blind Opus critic; calibration = both plants caught; up to 3 runs' },
  ],
}
// Args: {"scratch": "<scratchpad>", "worktree": "<dir with the verify branch checked out>", "head": "<full sha>", "label": "w1", "files": ["docs/research/howto/cards/x.json", ...], "notes": "<wave-specific asks for the critic>"}
const A = args
const W = `${A.scratch}/v${A.label}`
const RULES = `Never use WebFetch or WebSearch (they summarise with a small model). Fetch pages with curl -sL and a desktop browser user agent; a PubMed id uses its PubMed abstract page, a DOI its publisher page. Never edit the repo worktree, never commit or push. Cite file and field paths. No guessing: say "not verified" when you could not check something.`

phase('Prepare')
const prep = await agent(`You prepare a blind research-verify set (M/ARC library How-to research, ruling LR-29).
1. In ${A.worktree} confirm HEAD is ${A.head} (git rev-parse HEAD). Create ${W}/copy/ (delete it first if it exists) and copy these files into it with their repo-relative paths, but WITHOUT any git metadata: ${A.files.join(', ')}. Also copy docs/research/howto/CARD-V2.md and docs/research/howto/RULINGS.md into ${W}/copy/ref/, and from origin/claude/howto-options (git show) docs/howto/library/inputs/content.md into ${W}/copy/ref/content.md. Nothing else.
2. Plant exactly 2 errors in the COPY only (never in ${A.worktree}):
   - P1, tier A: change one safety-relevant shown line (a stop sign, a way out, a "never" rule or a red-flag line) so it becomes unsafe or contradicts its own claim's quote, in a way a careful expert would catch.
   - P2: change one number or direction in a shown technique line (tempo seconds, a range, an angle, left/right, up/down) so it contradicts its claim's quote.
   Keep the JSON valid (node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>). Change nothing else, and do not touch quote files, notes or gaps for the plants.
3. Return the answer key ONLY in your output (never write it to disk), P1 first: for each plant the file, the JSON path, the original text and the planted text.`, {
  label: 'prepare', phase: 'Prepare', model: 'opus',
  schema: { type: 'object', required: ['ok', 'copyDir', 'plants'], properties: {
    ok: { type: 'boolean' }, copyDir: { type: 'string' },
    plants: { type: 'array', items: { type: 'object', required: ['file', 'path', 'original', 'planted'], properties: {
      file: { type: 'string' }, path: { type: 'string' }, original: { type: 'string' }, planted: { type: 'string' } } } } } },
})
if (!prep || !prep.ok || prep.plants.length !== 2) return { error: 'prepare failed', prep }

const FINDINGS = { type: 'object', required: ['findings', 'refetched'], properties: {
  refetched: { type: 'object', required: ['sources', 'checked', 'verbatim', 'problems'], properties: {
    sources: { type: 'number' }, checked: { type: 'number' }, verbatim: { type: 'number' }, problems: { type: 'array', items: { type: 'string' } } } },
  findings: { type: 'array', items: { type: 'object', required: ['file', 'path', 'severity', 'problem', 'evidence', 'fix'], properties: {
    file: { type: 'string' }, path: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'high', 'medium', 'low'] },
    problem: { type: 'string' }, evidence: { type: 'string' }, fix: { type: 'string' } } } } } }

phase('Critic')
const runs = []
let valid = null
for (let i = 1; i <= 3 && !valid; i++) {
  const r = await agent(`You are a blind critic of exercise research cards for M/ARC's How-to library (ruling LR-29). Work only from ${W}/copy/ (the cards and quotes) and ${W}/copy/ref/ (CARD-V2.md, RULINGS.md, content.md). ${RULES}
Check every card against the rules:
- CARD-V2 shape. Every factual line points to a claim, and every claim has a source with a verbatim quote of at most 50 words that actually supports it. Check the quote supports the claim, not only that it exists.
- The rulings, especially:
  - LR-3: never invent a tier-A way out;
  - LR-15: ACSM tempo is for advanced lifters only;
  - LR-23: no sources or contacts in shown fields;
  - LR-25, LR-27 and LR-28 (shown-field wording; safety lines run symptom, then how long or how bad, then what to do);
  - LR-29.
- content.md 3.4's evidence bar for thin ids, and the muscles.
- The UI copy rule: shown text never explains, talks down or states the obvious, and headings are 1-3 word labels.
- TIER-A SAFETY: read every safety line as if a beginner follows it literally. Anything unsafe, incomplete, or contradicting its quote is a blocker.
- Re-fetch at least 10 % of the sources (pick across cards, include every tier-A source), and check their quotes verbatim (whitespace, quotes and dashes normalised). Report the counts.
${A.notes || ''}
Report every real problem with its severity. Do not report style preferences as problems. You do not know whether any errors were planted; review everything equally.`, {
    label: `critic run ${i}`, phase: 'Critic', model: 'opus', schema: FINDINGS })
  if (!r) { runs.push({ run: i, error: 'no result' }); continue }
  const norm = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const hits = p => r.findings.filter(f => {
    if (!f.file.endsWith(p.file.split('/').pop())) return false
    const fp = norm(f.path), pp = norm(p.path)
    if (fp && pp && (fp.includes(pp) || pp.includes(fp))) return true
    const frag = norm(p.planted).split(' ').filter(w => w.length > 3).slice(0, 6).join(' ')
    return frag && norm(f.problem + ' ' + f.evidence).includes(frag)
  })
  const caught = prep.plants.map(p => hits(p).length > 0)
  const tierA = hits(prep.plants[0]).some(f => f.severity === 'blocker' || f.severity === 'high')
  const ok = caught.every(Boolean) && tierA
  runs.push({ run: i, caught, tierA, valid: ok, findings: r.findings.length })
  log(`critic run ${i}: plants caught ${caught.filter(Boolean).length}/2, tier-A as blocker/high: ${tierA} -> ${ok ? 'VALID' : 'invalid'}`)
  if (ok) valid = r
}
return { head: A.head, plants: prep.plants, runs, result: valid }
