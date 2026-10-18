// LIB-6: the thumb page (golden B's thumbPage() in howto/render-pull_up/-hanging_leg_raise/-lat_pulldown.mjs): a 2 x 2
// grid of small hands, the same pose with each thumb mode, no load line. Every cell is drawn at one scale (K px per mm)
// and cropped to the hand plus a short piece of forearm, at 1:1. Options (named, per exercise):
//   riskRole  - a cell marked `risk` is drawn in the Wrong role with its markers and the sheet's load axis, and its
//               figure gets the `risk` class (pull-up);
//   hookThumb - a cell with `thumbOverBar` gets the hook thumb under the bar section (pull-up);
//   thumbMark - a dot-and-leader "THUMB" label placed clear of the hand outline (lat pulldown).
import { renderHand } from '../../../layers/engine/hand.mjs';
import { esc, f, I, nums } from './common.mjs';
import { hookThumb, stripLoad } from './hand-marks.mjs';

const K = 0.95, CW = 171, CH = 176;
const handBox = (svg, uid) => { let b = [1e9, 1e9, -1e9, -1e9];
  for (const m of svg.matchAll(new RegExp(`<path id="${uid}-([a-z0-9-]+)" d="([^"]+)"`, 'g'))) { if (m[1] === 'fore') continue;
    const n = m[2].match(/-?[\d.]+/g).map(Number); for (let i = 0; i < n.length - 1; i += 2) b = [Math.min(b[0], n[i]), Math.min(b[1], n[i + 1]), Math.max(b[2], n[i]), Math.max(b[3], n[i + 1])]; }
  return b; };

// "Thumb" leader label: a dot on the thumb's end segment (tdp), a thin leader out to a small label. The label box
// (padded 6-7 px) must hold no point of the hand's outline (every part path, sampled), the leader must not cross another
// part's outline point either; among the clear spots the shortest leader wins.
function thumbMark(rsvg, i, x0, y0) {
  const tn = nums(rsvg.match(new RegExp(`<path id="th${i}-tdp" d="([^"]+)"`))[1]), tp = [];
  for (let j = 0; j < tn.length - 1; j += 2) tp.push([tn[j], tn[j + 1]]);
  const ta = [tp.reduce((a, p) => a + p[0], 0) / tp.length, tp.reduce((a, p) => a + p[1], 0) / tp.length];
  const LW = 44, LH = 11, hp = [];
  for (const m of rsvg.matchAll(new RegExp(`<path id="th${i}-([a-z0-9-]+)" d="([^"]+)"`, 'g'))) { const n = nums(m[2]);
    for (let j = 0; j + 3 < n.length; j += 2) for (let u = 0; u <= 4; u++) hp.push([n[j] + (n[j + 2] - n[j]) * u / 4, n[j + 1] + (n[j + 3] - n[j + 1]) * u / 4, m[1]]); }
  let bestL = null;
  for (let ly = y0 + 8 + LH; ly <= y0 + CH - 6; ly += 2) for (let lx = x0 + 8; lx + LW <= x0 + CW - 8; lx += 2) {
    const bx = [lx - 7, ly - LH - 6, lx + LW + 7, ly + 6];
    if (hp.some(([x, y]) => x > bx[0] && x < bx[2] && y > bx[1] && y < bx[3])) continue;
    const e = [Math.max(lx, Math.min(ta[0], lx + LW)), Math.max(ly - LH, Math.min(ta[1], ly))];   // nearest point of the box
    const L = Math.hypot(e[0] - ta[0], e[1] - ta[1]); if (L < 18) continue;
    let cross = 0; for (let u = 0.25; u <= 1; u += 0.02) { const q = [ta[0] + (e[0] - ta[0]) * u, ta[1] + (e[1] - ta[1]) * u];
      cross += hp.filter(([x, y, id]) => !/^t(pp|dp)$/.test(id) && Math.hypot(x - q[0], y - q[1]) < 1.6).length; }
    const cost = cross * 60 + L; if (!bestL || cost < bestL.cost) bestL = { lx, ly, e, cost, cross, L };
  }
  const { lx, ly, e } = bestL, u = [(e[0] - ta[0]) / bestL.L, (e[1] - ta[1]) / bestL.L], le = [e[0] - u[0] * 3, e[1] - u[1] * 3];
  return `<g class="th-mark" aria-hidden="true"><path d="M${f(ta[0])} ${f(ta[1])}L${f(le[0])} ${f(le[1])}"/><circle cx="${f(ta[0])}" cy="${f(ta[1])}" r="1.75"/>`
    + `<text x="${f(lx)}" y="${f(ly - 1)}">THUMB</text></g>`;
}

/** The thumb page for `cells` (the howto module's THUMB_PAGE). */
export function thumbPage(cells, loadAxis, opts = {}) {
  const out = cells.map((t, i) => {
    const probe = renderHand(t.pose, { width: CW, height: 900, uid: `th${i}` });
    const W = 20 + (CW - 20) * K / probe.report.scalePxPerMm;          // width-limited fit: k grows with the width
    const r = renderHand(t.pose, opts.riskRole
      ? { width: W, height: 900, uid: `th${i}`, role: t.risk ? 'wrong' : 'right', markers: t.markers ?? [], loadAxis, alt: t.alt }
      : { width: W, height: 900, uid: `th${i}`, role: 'right', alt: t.alt });
    const b = handBox(r.svg, `th${i}`), wr = r.svg.match(/h-joint wrist" cx="([\d.]+)" cy="([\d.]+)"/).map(Number);
    const top = Math.min(b[1], wr[2]), bot = Math.max(b[3], wr[2] + 30), y0 = Math.min(b[1] - 8, (top + bot) / 2 - CH / 2), x0 = (b[0] + b[2]) / 2 - CW / 2;
    let svg = stripLoad(r.svg.replace(/viewBox="[^"]*"/, `viewBox="${f(x0)} ${f(y0)} ${CW} ${CH}"`));
    // hook: the bar section goes under the thumb, the thumb under the index finger (the engine draws the section on
    // top of the fist, which hides a hook thumb completely)
    if (opts.hookThumb && t.thumbOverBar) {
      const hx = svg.match(/<circle class="h-eq" [^>]*\/><circle class="h-eq-core" [^>]*\/><path class="h-eq-core" [^>]*\/>/)[0];
      const hook = hookThumb(t.pose, r.svg, r.report.scalePxPerMm, `th${i}`, t.thumbOverBar.tipAngle);
      svg = svg.replace(hx, '').replace(/<g class="h-thumb">[\s\S]*?<\/g><\/g><path class="h-patch"[^>]*\/><path class="h-crease"[^>]*\/><path class="h-nail"[^>]*\/>/, hook.el)
        .replace('</defs>', hook.defs + '</defs>').replace(/(<g class="h-skin">[\s\S]*?<\/g><\/g>)/, `$1${hx}`);
    }
    if (opts.thumbMark) svg = svg.replace(/<\/svg>$/, thumbMark(r.svg, i, x0, y0) + '</svg>');
    return `<figure class="th-cell${t.default ? ' def' : ''}${opts.riskRole && t.risk ? ' risk' : ''}"><figcaption><span class="th-title">${t.default ? I.check(16) : ''}${esc(t.title)}</span><span class="th-note">${esc(t.note)}</span></figcaption>${svg}</figure>`;
  }).join('');
  return `<div class="th-cam eyebrow">Thumb options, seen from the side</div><div class="th-grid">${out}</div>`;
}
