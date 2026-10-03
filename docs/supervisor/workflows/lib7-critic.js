export const meta = {
  name: 'lib7-calibrated-critic',
  description: 'Blind, calibrated visual critic for LIB-7 hand pairs (plan 3.4, close-ups): prepare a shuffled set of hand-pair crops with 2 hidden approved golden-B pairs and 2 planted defects, run a panel of 3 fresh Opus critics (medians, majority findings), check calibration, one more round if invalid',
  phases: [
    { title: 'Prepare', detail: 'render the LIB-7 sheet, hidden approved pairs and two planted copies into a blind set' },
    { title: 'Critic', detail: 'a panel of 3 fresh Opus critics scores every hand pair C1-C7; medians decide' },
  ],
}

const SCR = args.scratch
const ITEMS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
const PREP_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    problem: { type: 'string' },
    workdir: { type: 'string' },
    branchHead: { type: 'string' },
    sheetSha: { type: 'string' },
    referenceIds: { type: 'array', items: { type: 'string' } },
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          key: { type: 'string' },
          ids: { type: 'array', items: { type: 'string' } },
          kind: { type: 'string', enum: ['drawn', 'approved', 'plant'] },
          plantItem: { type: 'string' },
          plantDescription: { type: 'string' },
        },
        required: ['label', 'key', 'kind'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['ok', 'workdir', 'candidates'],
}

const scoreProps = Object.fromEntries(ITEMS.map(k => [k, { type: 'integer' }]))
const CRITIC_SCHEMA = {
  type: 'object',
  properties: {
    pairs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          scores: { type: 'object', properties: scoreProps, required: ITEMS },
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: { item: { type: 'string' }, problem: { type: 'string' }, where: { type: 'string' }, fix: { type: 'string' } },
              required: ['item', 'problem', 'fix'],
            },
          },
        },
        required: ['label', 'scores', 'findings'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['pairs'],
}

phase('Prepare')
const prep = await agent(`You prepare the input set for a BLIND, CALIBRATED visual critic of the M/ARC library hand pairs, card LIB-7 (PR #193), following plan section 3.4. Work only in the scratch directory ${SCR}/critic-l7 (create it). Never commit, push or edit any tracked file in any branch. Planted copies are never committed.

Repo: /home/user/M-arc (GitHub macdarenz-droid/M-arc; run git fetch origin). Read only what you need:
- Plan: docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md on origin/claude/howto-options, section "3.4 Visual critic" (git show origin/claude/howto-options:<path>).
- LIB-7: branch origin/claude/lib-7-radial-pairs (head 1114bc10315497c8776df35546225327b2c84e3e expected; record the real head). Tooling is in tools/plates/library/hands/: DESIGN.md, pairs.mjs (MODULES, renderPair, pairSpec), sheet.mjs (node tools/plates/library/hands/sheet.mjs <out> [--calibrate] [--plant plant.json] [--critic] [--chromium <path>]; --plant ops: {"id","op":"swap"} swaps Right and Wrong of the id's first page, {"id","op":"pose","pose":{...}} merges into its Right pose), the drawn keys hand-*.mjs, claims.json.
- The approved golden-B hand close-ups (the owner-approved bar) are rendered by the same close-up API (sheet.mjs approvedHand / closeups.mjs).

Steps:
1. Start clean: git worktree remove --force ${SCR}/critic-l7/wt if it exists, then delete everything else under ${SCR}/critic-l7/ EXCEPT result-*.json. git worktree prune; git worktree add ${SCR}/critic-l7/wt origin/claude/lib-7-radial-pairs; npm ci in it. Chromium: /opt/pw-browsers/chromium.
2. Build the normal sheet with --critic (no plants, no calibrate) and record the sha256 of hand-pairs-silent-black.html. Rebuild once and confirm the same sha; report any difference, do not fix it.
3. Candidates. One candidate per distinct drawn picture (one sheet tile). For each, screenshot ONLY the drawn hand pair (the Right and Wrong drawings with their own labels; NOT the tile title, ids, claims, flags, checks line or the golden-B reference shown beside it) at 390 px CSS width, device scale 2, in Silent Black (dark.png) and Paper (paper.png). Write a facts.json per candidate: the exercise ids it serves and the claim texts the tile cites (the facts the drawing must match: grip, thumb, handle, wrist, the named fault). No variant names, file paths, module names or owner names.
4. Hidden approved pairs: 2 approved golden-B hand pairs that resemble the drawn ones (the sheet's own --calibrate uses lat_pulldown p2 and pull_up p1; reuse them unless they would be obvious). Crop them exactly like step 3, same size, same two themes, with facts.json from their golden-B claims in the same shape. Nothing in the crop may differ in kind from a drawn candidate (no "Pair A" title, no different frame).
5. Reference: 4 other approved golden-B hand pairs (not the 2 hidden ones), cropped the same way, into ${SCR}/critic-l7/reference/<id>-<page>-{dark,paper}.png.
6. Plants: build a second sheet with --plant (plant.json in ${SCR}/critic-l7/plants/) holding 2 defects on 2 DIFFERENT drawn ids:
   (a) {"op":"swap"}: Right and Wrong swapped (target C1);
   (b) {"op":"pose"}: one clear contact or thumb defect a careful coach would see and the engine allows, e.g. the thumb drawn open where the facts say it wraps, or the fingers clearly off the handle (target C2 or C3). Look at the render yourself and make sure the defect is visible at 390 px.
   Crop only those 2 planted tiles like step 3. They are EXTRA copies: the unplanted originals stay in the set. Their facts.json equals the original's.
7. Assemble ${SCR}/critic-l7/set/H01 .. Hnn (all drawn + 2 hidden approved + 2 plants), shuffled by sha256(key + "m-arc-lib7:" + short head) so position reveals nothing. Each folder holds dark.png, paper.png, facts.json; nothing else. Also write set/README.md with one line per H##: the exercise ids only. Grep every facts.json and README for plant, golden, approved, calibr, variant, LIB-, D-LIB, hand-, .mjs: nothing may match.
8. Do NOT write the answer key to any file. Return it only in your structured output.

Return: ok (false with problem if anything blocks), workdir (${SCR}/critic-l7), branchHead, sheetSha, referenceIds, candidates (label, key = the sheet tile key or approved id/page, ids, kind drawn|approved|plant, and for plants plantItem + plantDescription), notes (render differences, sizes, anything the supervisor must know).`, { label: 'prepare blind set', phase: 'Prepare', schema: PREP_SCHEMA })

if (!prep || !prep.ok) {
  return { stage: 'prepare', prep }
}

const labels = prep.candidates.map(c => c.label).sort()
const criticPrompt = (n) => `You are a fresh, independent visual critic (run ${n}) for M/ARC's exercise How-to hand close-ups: technical drawings of a hand on gym equipment, a "Right" grip beside a "Wrong" one, shown in a phone app at 390 px wide (the images are 780 px wide, 2x). The owner approved a reference set; new pairs must reach the same bar. Judge each candidate on its own merits against that bar. Look at every image yourself with the Read tool.

Inputs (read only these paths; do not look anywhere else on disk):
- Reference (owner-approved pairs, the quality bar and house style): ${prep.workdir}/reference/*.png (dark = Silent Black theme, paper = Paper theme).
- Candidates: ${prep.workdir}/set/<label>/ with dark.png, paper.png and facts.json (the verified facts the drawing must match). ${prep.workdir}/set/README.md lists them. Candidates: ${labels.join(', ')}.

Rubric, score 1-5 per item for every candidate (5 = as good as the approved reference; 4 = acceptable, at the approved bar; 3 or less = a real problem a careful designer or coach would fix):
- C1 Right and Wrong the correct way round: the Right drawing shows the grip the facts cue; the Wrong shows the named fault, clearly;
- C2 thumb placement matches the facts (around, over or beside the handle as stated);
- C3 handle contact: the handle sits where the facts say (palm, fingers, heel of the hand), the fingers actually close on it, nothing floats or passes through;
- C4 wrist alignment: as the facts say in Right (for example straight or stacked); the fault visible in Wrong when the fault is a wrist fault;
- C5 the hand reads as a hand at 390 px: finger count, joints bending the right way, proportions, nothing fused or broken;
- C6 equipment truth: handle, rope, bar or band drawn with a believable shape, thickness and attachment, and the same equipment drawn the same way as in the reference;
- C7 consistent with the reference: line weight, colours, legibility in both themes, labels and leaders on what they name.

For every item scored 3 or less, give a finding: the item, the problem, where (pixel coordinates in the 780-px-wide image and which image), and a concrete fix. Be exact and honest; do not invent problems to look strict, and do not pass a real problem to look kind.

Return every candidate in ${labels.join(', ')} with scores and findings. The label field must be exactly the folder name (for example "H01"): the calibration check matches on it.`

phase('Critic')
// D-CRITIC-CAL2 (10-03): a round is a PANEL of 3 independent critics. Per pair and item the score is the median of the
// three; a finding counts when at least 2 of the 3 critics score that item 3 or less. Calibration runs on the medians.
const median = (xs) => { const v = xs.filter(x => typeof x === 'number').sort((a, b) => a - b); return v.length ? v[Math.floor((v.length - 1) / 2)] : null }
const runs = []
let final = null
for (let r = 1; r <= 2 && !final; r++) {
  const panel = (await parallel([1, 2, 3].map(i => () => agent(criticPrompt(`${r}.${i}`), { label: `critic ${r}.${i}`, phase: 'Critic', schema: CRITIC_SCHEMA })))).filter(Boolean)
  if (panel.length < 3) { runs.push({ round: r, valid: false, reasons: [`only ${panel.length} of 3 critics returned`] }); continue }
  const agg = prep.candidates.map(c => {
    const per = panel.map(res => res.pairs.find(p => p.label === c.label)).filter(Boolean)
    const scores = Object.fromEntries(ITEMS.map(k => [k, median(per.map(p => p.scores[k]))]))
    const findings = ITEMS.flatMap(k => {
      const low = per.filter(p => typeof p.scores[k] === 'number' && p.scores[k] <= 3).length
      const fs = per.flatMap(p => (p.findings || []).filter(f => f.item === k))
      return low >= 2 ? [{ item: k, flaggedBy: low, problems: fs.map(f => ({ problem: f.problem, where: f.where, fix: f.fix })) }] : []
    })
    return { label: c.label, scores, findings, raw: per.map(p => p.scores), seen: per.length }
  })
  const byLabel = Object.fromEntries(agg.map(p => [p.label, p]))
  const reasons = []
  for (const c of prep.candidates) {
    const p = byLabel[c.label]
    if (!p || p.seen < 3) { reasons.push(`${c.label} missing from ${3 - (p ? p.seen : 0)} critic(s)`); continue }
    if (c.kind === 'approved') {
      const low = ITEMS.filter(k => p.scores[k] < 4)
      if (low.length) reasons.push(`hidden approved ${c.key} (${c.label}) median below 4: ${low.map(k => k + '=' + p.scores[k]).join(', ')}`)
    }
    if (c.kind === 'plant') {
      // D-CRITIC-CAL: caught on its target item, or on any item where the unplanted original scores >= 4 (the drop is the plant's)
      const target = c.plantItem && p.scores[c.plantItem]
      const orig = prep.candidates.find(o => o.kind === 'drawn' && JSON.stringify(o.ids) === JSON.stringify(c.ids))
      const op = orig && byLabel[orig.label]
      const other = op ? ITEMS.filter(k => p.scores[k] < 4 && op.scores[k] >= 4) : []
      if (!((typeof target === 'number' && target < 4) || other.length)) reasons.push(`plant ${c.key} (${c.label}, ${c.plantItem}: ${c.plantDescription}) not caught (median ${target})`)
      else if (!(typeof target === 'number' && target < 4)) log(`plant ${c.key} (${c.label}) caught on ${other.join(', ')} instead of ${c.plantItem}`)
    }
  }
  const valid = reasons.length === 0
  runs.push({ round: r, valid, reasons })
  log(`critic round ${r} (panel of 3): ${valid ? 'VALID' : 'discarded: ' + reasons.join('; ')}`)
  if (valid) final = { pairs: agg, notes: panel.map(x => x.notes).filter(Boolean).join('\n---\n') }
}

const key = Object.fromEntries(prep.candidates.map(c => [c.label, c]))
const mapped = final ? final.pairs.map(p => ({ ...p, key: key[p.label] && key[p.label].key, ids: key[p.label] && key[p.label].ids, kind: key[p.label] && key[p.label].kind })) : null
return { prep: { branchHead: prep.branchHead, sheetSha: prep.sheetSha, referenceIds: prep.referenceIds, notes: prep.notes, candidates: prep.candidates }, runs, final: mapped, criticNotes: final && final.notes }
