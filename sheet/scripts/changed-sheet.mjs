// scratch: pilot A changed-ids sheet (Do 12 form, D-LIB8M-SHEET), only what changed since sheet 7e5deff7 (page 43a264e5)
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join } from 'node:path';
const [root, head, pageSha, out, hands, mode] = process.argv.slice(2);   // mode 'files': images as img/<name>.png beside out
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const png = f => {
  if (mode !== 'files') return `data:image/png;base64,${readFileSync(f).toString('base64')}`;
  mkdirSync(join(dirname(out), 'img'), { recursive: true }); copyFileSync(f, join(dirname(out), 'img', basename(f)));
  return `img/${basename(f)}`;
};
const ev = n => join(root, 'tools/plates/library/pilot-a/evidence', n);
const fig = (f, cap) => `<figure><img src="${png(f)}" alt="${esc(cap)}" width="390"><figcaption>${esc(cap)}</figcaption></figure>`;
const card = n => JSON.parse(readFileSync(join(root, 'docs/research/howto/cards', `${n}.json`), 'utf8'));
const P = card('plank'), M = card('mountain_climbers');
const j = v => typeof v === 'string' ? v : JSON.stringify(v);

const handRows = [
  { id: 'goblet_squat', kind: 'Cupped hold', before: [fig(ev('lib12-cupped-silent-black.png'), 'Before · Silent Black'), fig(ev('lib12-cupped-paper.png'), 'Before · Paper')],
    after: 'No close-up. The hand view moved to GAPS (D-LIB12FIX-R8-GAPS, #191 6274835211); redraw is follow-up F-LIB12-R8B.',
    scores: 'R8 round 2 @ 6b6e5ab: C5 [2,4,3], reads as a clamp. Round 1 @ 2aa3732: C5 [2,1,1], C6 [3,3,3].' },
  { id: 'front_squat', kind: 'Front rack', before: [fig(ev('lib12-front-rack-silent-black.png'), 'Before · Silent Black'), fig(ev('lib12-front-rack-paper.png'), 'Before · Paper')],
    after: 'No close-up. The hand view moved to GAPS (D-LIB12FIX-R8-GAPS); redraw is follow-up F-LIB12-R8B.',
    scores: 'R8 round 2 @ 6b6e5ab: C1 [2,3,3], C2, C3 [2,3,2], C5 and C7 below the bar; the shoulder is hidden, so the bar reads as held in the hand. Round 1: C1 [3,2,3], C4 [3,4,3], C5 [2,2,2], C7 [3,3,3].' },
  { id: 'mountain_climbers', kind: 'Palm flat (new)', before: ['<p class="none">Not on the approved sheet.</p>'],
    after: [fig(join(hands, 'mountain_climbers-silent-black.png'), 'After · Silent Black (Palm cupped; Hand ahead)'), fig(join(hands, 'mountain_climbers-paper.png'), 'After · Paper')].join(''),
    scores: 'R8 round 2 @ 6b6e5ab: PASS on both pages (every median ≥ 4). Round 1 @ 2aa3732: C5 [3,3,3]; Palm cupped page C3 [3,3,4].' },
  ...[['dumbbell_biceps_curl', 'Curl (LIB-7, new)'], ['rope_triceps_pushdown', 'Rope (LIB-7, new)'], ['ez_bar_curl', 'EZ bar (LIB-7, new)']].map(([id, kind]) => ({ id, kind,
    before: ['<p class="none">Not on the approved sheet: #193 was not on main then.</p>'],
    after: [fig(join(hands, `${id}-silent-black.png`), 'After · Silent Black'), fig(join(hands, `${id}-paper.png`), 'After · Paper')].join(''),
    scores: 'LIB-7 pair (renderPair, main 5158609 #193); critic scores from the supervisor.' })),
];

// research items (lb9/lb10-research-verify.md "Routed"; D-SUP-LB8-PILOTS): owner choice, current vs proposed; no card changed
const ch = (ref, sev, field, cur, prop, note = '') => ({ ref, sev, field, cur, prop, note });
const plank = [
  ch('plank-R1', 'high', 'plate.mistake.what (top fault)', P.plate.mistake.what, 'Hips hiked up. (claims c4, c13)',
    `The pick by source count: hiked hips 2 (ACE, Harvard), sag 1. Drawn Mistake today: the sag. why becomes "ACE and Harvard both tell the lifter to avoid it (c4, c13)". handlingMistakes[0] becomes "Hips hiked up." / "Don't bend at your hips." (c4, c13); the sag moves to [1] with plank-R2's fix, the shrug to [2].`),
  ch('plank-R2', 'medium', 'handlingMistakes[0].fix (sag)', P.handlingMistakes[0].fix, "Brace your trunk. Can't hold it? Rest on your knees. (claims c4, c2, c14)",
    'c14 is a new Harvard claim: "If you can\'t hold the position, modify the exercise by resting your weight on your knees instead of your feet".'),
  ch('plank-R3', 'low', 'handlingMistakes[2]', `${P.handlingMistakes[2].mistake} / ${P.handlingMistakes[2].fix}`, 'Removed (no source names it as a mistake). setup keeps "keep breathing" (c6).'),
  ch('plank-R4', 'low', 'plate.mistake.what (only if R1 is not chosen)', P.plate.mistake.what, 'Low back sags. (c4)'),
  ch('plank-R5', 'low', 'zooms', `hip-line right "${P.zooms[0].right}" · wrong "${P.zooms[0].wrong}" · shoulder-stack wrong "${P.zooms[1].wrong}"`,
    'hip-line right "No sagging low back, no hiked hips." · wrong "Low back sagging." (c4) · shoulder-stack wrong "Shoulders shrugged, not over the elbows." (c5)'),
  ch('plank-R6', 'low', 'posture[3]', P.posture[3].point, 'Harder version: tilt the pelvis backward and draw the shoulder blades together. (c11)'),
  ch('plank-R7', 'low', 'feel.rows[1].means (low-back pain)', P.feel.rows[1].means, '(empty); fix stays "Stop the exercise." (c8)'),
];
const mr = M.feel.rows[2];
const mc = [
  ch('mountain_climbers-R1', 'medium', 'feel.rows[2] (wrist pain)', `means "${mr.means}" · fix "${mr.fix}" · claim ${j(mr.claim)} · fixNote "${mr.fixNote}"`,
    'means "" · fix "Stop the exercise." · claims c12, c22 · redFlag wrist kept · fixNote drops "no source says it relieves the wrist" (c21 now says the bench puts less weight on the wrists).',
    'Your call too: whether this row also offers c21\'s option (hands on a bench, or dumbbells to keep the wrists neutral).'),
  ch('mountain_climbers-R2', 'medium', 'handlingMistakes[0].fix', M.handlingMistakes[0].fix, 'Keep your hips level; slow down. (claims c16, c18)'),
  ch('mountain_climbers-R3', 'low', 'risks[1]', M.risks[1].risk, 'Bouncing on your toes can add impact and make control harder. (c7)'),
  ch('mountain_climbers-R4', 'low', 'plate.checkpoints[0].claim', j(M.plate.checkpoints[0].claim), '["c2","c6"]'),
  ch('mountain_climbers-R5', 'low', 'plate.tells[1].claim', j(M.plate.tells[1].claim), '["c4","c16"]'),
  ch('mountain_climbers-R6', 'low', 'zooms[0] (hand)', `right "${M.zooms[0].right}" · claim ${j(M.zooms[0].claim)}`, 'claim ["c2","c6","c19"]; "Palm flat" gets a quote or a drawing-convention note (LR-4).'),
  ch('mountain_climbers-R7', 'low', 'zooms[1].claim', j(M.zooms[1].claim), '["c4","c3","c16"]'),
  ch('mountain_climbers-R8', 'low', 'feel.rows[0].means', M.feel.rows[0].means, 'You might feel these muscles working. (c11)'),
  ch('mountain_climbers-R9', 'low', 'unsourced, grip.note (not shown in the app)', `unsourced has "Breathing." and "Whether fists or push-up handles help a sore wrist." · grip.note "${M.grip.note}"`,
    'Both lines leave unsourced (now c17, c21); grip.note drops the fists-or-handles clause.'),
];
const table = (rows) => `<table><thead><tr><th>Item</th><th>Line</th><th>Now</th><th>Proposed</th><th>Your answer</th></tr></thead><tbody>${rows.map(r =>
  `<tr id="${r.ref}"><td><b>${r.ref}</b><br><span class="sev">${r.sev}</span></td><td>${esc(r.field)}</td><td>${esc(r.cur)}</td><td>${esc(r.prop)}${r.note ? `<p class="note">${esc(r.note)}</p>` : ''}</td><td class="ans">Keep now · Use proposed</td></tr>`).join('')}</tbody></table>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pilot A changes</title>
<style>:root{--bg:#fff;--fg:#16181b;--mut:#5b6068;--line:#d9dce1;--acc:#4a56c9}@media (prefers-color-scheme:dark){:root{--bg:#141618;--fg:#e9ebee;--mut:#9aa0a8;--line:#30343a;--acc:#8b93ff}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif}main{max-width:1100px;margin:0 auto;padding:16px}h1{font-size:22px}h2{font-size:18px;border-top:1px solid var(--line);padding-top:14px}
.sha{font-family:ui-monospace,monospace;font-size:12px;word-break:break-all}.row{border:1px solid var(--line);border-radius:10px;padding:12px;margin:12px 0}.shots{display:flex;flex-wrap:wrap;gap:12px}
figure{margin:0;max-width:390px}img{max-width:100%;height:auto;border:1px solid var(--line);border-radius:8px}figcaption,.note,.sev,.none{color:var(--mut);font-size:13px}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:700px){.cols{grid-template-columns:1fr}}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid var(--line);padding:6px;vertical-align:top;text-align:left}
.ans{white-space:nowrap;color:var(--acc)}.tw{overflow-x:auto}</style></head><body><main>
<h1>Pilot A · changes since the approved sheet</h1>
<p>Approved: sheet <span class="sha">7e5deff7…</span> @ 48d49bb, plates page <span class="sha">43a264e5…</span> ("Pilot a ok", 2026-10-19).</p>
<p>This head: ${esc(head)}. Plates page sha256 <span class="sha">${esc(pageSha)}</span>: unchanged, so no plate picture moved.</p>
<h2>Hand close-ups</h2>
${handRows.map(r => `<div class="row" id="hand-${r.id}"><p><b>${esc(r.id.replace(/_/g, ' '))}</b> · ${esc(r.kind)}</p><p class="note">Critic: ${esc(r.scores)}</p><div class="cols"><div><p>Before</p><div class="shots">${r.before.join('')}</div></div><div><p>After</p><div class="shots">${typeof r.after === 'string' && !r.after.startsWith('<') ? `<p>${esc(r.after)}</p>` : r.after}</div></div></div></div>`).join('\n')}
<h2>Plank wording</h2>
<p class="note">Research findings, not yet on the card. Your answer decides each line.</p>
<div class="tw">${table(plank)}</div>
<h2>Mountain climbers wording</h2>
<div class="tw">${table(mc)}</div>
</main></body></html>`;
writeFileSync(out, html);
console.log(createHash('sha256').update(html).digest('hex'), Buffer.byteLength(html));
