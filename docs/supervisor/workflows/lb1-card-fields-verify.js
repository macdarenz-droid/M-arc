export const meta = {
  name: 'lb1-card-fields-verify',
  description: 'D-LIB9-CARDFIELDS: blind Opus content check of the 14 LB1 cards machine fields with one planted wrong number',
  phases: [{ title: 'Prepare' }, { title: 'Verify' }],
}
const S = '/tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad'
const W = `${S}/vlb1cf`
const HEAD = '5fe445d2ed8f61f24b558916fe43dccb609e7d3f'
const RULES = `Read files only; never push, commit, comment or message. Never use WebFetch or WebSearch. No guessing: say "not verified" when you could not check something.`
phase('Prepare')
const prep = await agent(`You prepare a blind check set (M/ARC, ruling D-LIB9-CARDFIELDS). ${RULES}
1. In /home/user/M-arc run \`git fetch -q origin claude/lib-9-lb1\`. Create ${W}/copy/ (delete it first if it exists). From commit ${HEAD} (use \`git show ${HEAD}:<path>\`), copy into ${W}/copy/ with repo-relative paths and NO git metadata: docs/research/howto/cards/<id>.json and docs/research/howto/quotes/<id>.json for the 14 LB1 ids (chin_up, hanging_knee_raise, assisted_pull_up, inverted_row, close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown, straight_arm_pulldown, chest_supported_row, resistance_band_row, incline_machine_press, shoulder_press, horizontal_leg_press, leg_press_calf_raise), tools/plates/library/lb1/tempo.json, tools/plates/library/lb1/DESIGN.md (it holds the topFault key map and the pose map), and docs/research/howto/CARD-V2.md from origin/claude/libht-research. Also write ${W}/copy/ref/rules.md containing, verbatim, section 12 item 9 and section 13 (Q1, Q2, Q3 and their conditions) of docs/supervisor/verify/lib4-cards.md from origin/claude/sup-lib4-cards.
2. Plant exactly ONE wrong value in the COPY only, in one card's machine fields (plateFacts, tempo or topFault): for example a fact's deg or landmark or pose changed so that it no longer matches its claim's quote, or one tempo s changed so it no longer follows tempo.json and plate.tempo. Keep the JSON valid. Change nothing else.
3. Return the answer key ONLY in your output (never on disk): file, JSON path, original, planted.`, { label: 'prepare', phase: 'Prepare', schema: { type: 'object', required: ['ok', 'plant'], properties: { ok: { type: 'boolean' }, plant: { type: 'object', required: ['file', 'path', 'original', 'planted'], properties: { file: { type: 'string' }, path: { type: 'string' }, original: { type: 'string' }, planted: { type: 'string' } } } } } })
if (!prep?.ok) return { error: 'prepare failed', prep }
const F = { type: 'object', required: ['cards', 'findings'], properties: {
  cards: { type: 'array', items: { type: 'object', required: ['id', 'verdict'], properties: { id: { type: 'string' }, verdict: { type: 'string', enum: ['ok', 'problem'] }, note: { type: 'string' } } } },
  findings: { type: 'array', items: { type: 'object', required: ['file', 'path', 'severity', 'problem', 'evidence', 'fix'], properties: { file: { type: 'string' }, path: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'high', 'medium', 'low'] }, problem: { type: 'string' }, evidence: { type: 'string' }, fix: { type: 'string' } } } } } }
phase('Verify')
const runs = []; let valid = null
for (let i = 1; i <= 3 && !valid; i++) {
  const r = await agent(`You are a blind content verifier for the machine fields of 14 exercise research cards (M/ARC library, ruling D-LIB9-CARDFIELDS). Work only from ${W}/copy/. ${RULES}
Each card has three top-level keys added for the plate checker: plateFacts, tempo and topFault. The rules are in ${W}/copy/ref/rules.md and CARD-V2.md; the maps are tools/plates/library/lb1/tempo.json and DESIGN.md (topFault key map and pose map). For EVERY card check:
1. plateFacts: each entry names one claim, and that claim's verbatim quote (in the quotes file) states exactly this fact: the joint or landmark, the pose (through the ruled pose map; a fact with no pose means the end pose), and for an angle the number as the quote gives it. No fact comes from anywhere else. A fact the quotes state as a point value (not a range or bound) that the card should carry but does not is a finding. Where plateFacts is empty, confirm no quote states a point fact of this plate's positions and say so in the card note.
2. tempo: the array equals what the ruled Q3 map gives from tempo.json's row for this id and the card's plate.tempo (up, down, pause), with the exact shape {phase, s, move: true} / {phase, s}, Hold present only if pause > 0, no Rest, no constants. Recompute it yourself.
3. topFault: it equals the key that the ruled Q1 map gives for this card's plate.mistake (drawable true: plate.mistake's key; drawable false: the card's named top fault). It never names another handlingMistakes entry.
4. Nothing else in the card differs from CARD-V2's shape for these three keys.
Report each card ok or problem, and every problem as a finding with severity. You do not know whether an error was planted; check every card equally.`, { label: `verify run ${i}`, phase: 'Verify', schema: F })
  if (!r) { runs.push({ run: i, error: 'no result' }); continue }
  const p = prep.plant
  const norm = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const caught = r.findings.some(f => f.file.includes(p.file.split('/').pop().replace('.json', '')) && (norm(f.path).includes(norm(p.path).split(' ').slice(0, 2).join(' ')) || norm(f.problem + ' ' + f.evidence).includes(norm(p.planted))))
  runs.push({ run: i, caught, findings: r.findings.length })
  log(`verify run ${i}: plant caught ${caught}`)
  if (caught) valid = r
}
return { head: HEAD, plant: prep.plant, runs, result: valid }