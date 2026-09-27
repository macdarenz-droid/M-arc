// smooth-check.cjs: the numeric smoothness check (UPGRADE-BRIEF.md, smoothness target 4).
// Shared by rig-final/shoot.cjs and every anim-*/shoot.cjs. It reads the page as drawn:
//   - every joint angle: each animated group in the stage scene whose keyframes rotate it, read as its
//     local rotation (parent CTM inverse x own CTM), at t = i / 480 of the 4 s rep (120 samples per second at 1x);
//   - the grip point(s): a point in a hand group, in scene units, at the same samples;
//   - the keyframe stops themselves: the rotate() values written in each @keyframes rule (raw <style> text).
// Per move phase (lift 0-25 %, return 37.5-87.5 %) it passes only if:
//   (a) over the first and the last 1/120 s the speed is at most 1 % of the phase's top speed;
//   (b) between two samples 1/120 s apart the velocity changes by at most 8 % of the phase's top speed
//       (signed for an angle, as a vector for the grip point, so a bounce or a direction flip counts);
//   (c) at the keyframe stops, the change in acceleration from one stop to the next is at most 3 x its median
//       over the phase, for every angle that moves at least 10 degrees in the phase;
//   (d) no joint angle changes by more than 4 degrees between two samples 1/120 s apart (whole rep, 1x).
// (a) and (b) apply to the grip point(s) and to every angle that moves at least 10 degrees in the phase
// (docs/COACHING-DECISIONS.md, form guide D-S1). A sampler self-test compares the angles read in the browser
// with the written stops, so the two readers can never drift apart.
const N = 480, REP = 4, DT = REP / N;                       // samples per rep, rep length (s), 1/120 s
const PHASES = [['lift', 0, 0.25], ['return', 0.375, 0.875]];
const LIM = { a: 0.01, b: 0.08, c: 3, d: 4, travel: 10 };

// Runs in the page: collect the channels, then sample them. freeze = 'rig' (window.__rig.freeze) or 'lp'
// (the lat pulldown harness: S.t and bind()).
async function sampleInPage({ N, freeze, grips, root }) {
  const setT = freeze === 'lp'
    ? t => { const L = window.__lp; L.S.t = t; L.S.playing = false; L.S.ended = false; L.bind(); }
    : t => window.__rig.freeze(t);
  const frame = () => new Promise(res => requestAnimationFrame(res));
  // Keyframes from the raw <style> text, exactly as written (CSSOM re-serialises numbers to 6 significant digits).
  const rules = {};
  for (const st of document.querySelectorAll('style')) {
    const css = st.textContent, re = /@keyframes\s+([\w-]+)\s*\{/g; let m;
    while ((m = re.exec(css))) {
      let i = re.lastIndex, depth = 1, key = '', frames = [];
      while (i < css.length && depth > 0) {
        const ch = css[i];
        if (ch === '{') { depth++; if (depth === 2) { const end = css.indexOf('}', i); frames.push({ keyText: key.trim(), body: css.slice(i + 1, end) }); key = ''; i = end; depth = 1; } }
        else if (ch === '}') depth--;
        else key += ch;
        i++;
      }
      rules[m[1]] = frames;
    }
  }
  const rotSum = s => { let a = 0, m, re = /rotate\((-?[\d.e+-]+)deg\)/g, hit = false; while ((m = re.exec(s || ''))) { a += +m[1]; hit = true; } return hit ? a : null; };
  const scene = document.querySelector(root);
  const chans = [], seen = new Set();
  for (const el of scene.querySelectorAll('.anim')) {
    if (el.closest('.pics')) continue;
    for (const nm of getComputedStyle(el).animationName.split(',').map(s => s.trim())) {
      const r = rules[nm]; if (!r) continue;
      const base = nm.replace(/-[ab]$/, '');
      if (seen.has(base)) continue;
      const stops = [];
      for (const k of r) { const tf = (k.body.match(/(?:^|;)\s*transform\s*:([^;]*)/) || [])[1]; const v = rotSum(tf); if (v === null) continue; for (const kt of k.keyText.split(',')) stops.push([kt.trim() === 'from' ? 0 : kt.trim() === 'to' ? 1 : parseFloat(kt) / 100, v]); }
      if (!stops.length) continue;
      seen.add(base);
      stops.sort((x, y) => x[0] - y[0]);
      chans.push({ name: base, el, stops });
    }
  }
  const svg = scene, inv = () => svg.getScreenCTM().inverse();
  const local = el => { const m = el.parentNode.getScreenCTM().inverse().multiply(el.getScreenCTM()); return Math.atan2(m.b, m.a) * 180 / Math.PI; };
  const unwrap = (v, ref) => v + 360 * Math.round((ref - v) / 360);
  const gEls = grips.map(g => ({ ...g, el: document.querySelector(g.sel) }));
  const missing = gEls.filter(g => !g.el).map(g => g.sel);
  const read = () => {
    const I = inv();
    return {
      ang: chans.map(c => local(c.el)),
      grip: gEls.filter(g => g.el).map(g => { const q = new DOMPoint(g.x, g.y).matrixTransform(I.multiply(g.el.getScreenCTM())); return [q.x, q.y]; }),
    };
  };
  const ang = chans.map(() => []), grip = gEls.filter(g => g.el).map(() => []);
  for (let i = 0; i <= N; i++) {
    setT(i / N); await frame();
    const r = read();
    r.ang.forEach((v, k) => ang[k].push(i ? unwrap(v, ang[k][i - 1]) : unwrap(v, chans[k].stops[0][1])));
    r.grip.forEach((p, k) => grip[k].push(p));
  }
  // self-test: read the drawn angle exactly at a spread of written stops
  let selfErr = 0, selfN = 0;
  for (const c of chans) {
    const k = chans.indexOf(c), picks = c.stops.filter((_, j) => j % Math.max(1, Math.floor(c.stops.length / 8)) === 0);
    for (const [u, v] of picks) { setT(u); await frame(); selfErr = Math.max(selfErr, Math.abs(unwrap(local(c.el), v) - v)); selfN++; }
    void k;
  }
  return { chans: chans.map((c, k) => ({ name: c.name, stops: c.stops, samples: ang[k] })), grips: gEls.filter(g => g.el).map((g, k) => ({ name: g.name, samples: grip[k] })), missing, selfErr, selfN };
}

// Numbers for one 1-D channel (angle) or 2-D channel (grip) over one phase.
function phaseStats(samples, i0, i1, vec) {
  const vel = [];
  for (let i = i0; i < i1; i++) vel.push(vec ? [(samples[i + 1][0] - samples[i][0]) / DT, (samples[i + 1][1] - samples[i][1]) / DT] : (samples[i + 1] - samples[i]) / DT);
  const mag = v => (vec ? Math.hypot(v[0], v[1]) : Math.abs(v));
  const peak = Math.max(...vel.map(mag));
  let jump = 0;
  for (let i = 1; i < vel.length; i++) jump = Math.max(jump, vec ? Math.hypot(vel[i][0] - vel[i - 1][0], vel[i][1] - vel[i - 1][1]) : Math.abs(vel[i] - vel[i - 1]));
  const seg = samples.slice(i0, i1 + 1);
  const travel = vec ? null : Math.max(...seg) - Math.min(...seg);
  return { peak, edge: peak ? Math.max(mag(vel[0]), mag(vel[vel.length - 1])) / peak : 0, jump: peak ? jump / peak : 0, travel };
}
// (c): change of acceleration between neighbouring keyframe stops inside the phase, max / median.
function stopJerk(stops, a, b) {
  const s = stops.filter(([u]) => u >= a - 1e-9 && u <= b + 1e-9).map(([u, v]) => [u * REP, v]);
  const vv = [], tm = [];
  for (let i = 1; i < s.length; i++) { const dt = s[i][0] - s[i - 1][0]; if (dt <= 0) continue; vv.push((s[i][1] - s[i - 1][1]) / dt); tm.push((s[i][0] + s[i - 1][0]) / 2); }
  const acc = [];
  for (let i = 1; i < vv.length; i++) acc.push((vv[i] - vv[i - 1]) / (tm[i] - tm[i - 1]));
  const jk = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i] - acc[i - 1]));
  if (jk.length < 3) return { ratio: Infinity, n: s.length };
  const srt = [...jk].sort((x, y) => x - y), med = srt.length % 2 ? srt[(srt.length - 1) / 2] : (srt[srt.length / 2 - 1] + srt[srt.length / 2]) / 2;
  return { ratio: med > 0 ? Math.max(...jk) / med : Infinity, n: s.length };
}

// page: an open Playwright page at the player (any t). cfg: { label, freeze: 'rig' | 'lp', grips: [{ name, sel, x, y }],
// root: scene selector }. check(ok, msg) is the caller's check function. Returns the numbers.
async function smoothCheck(page, cfg, check) {
  const r = await page.evaluate(sampleInPage, { N, freeze: cfg.freeze || 'rig', grips: cfg.grips, root: cfg.root || '.stage .scene' });
  const L = cfg.label, pc = v => (v * 100).toFixed(2) + ' %', f2 = v => v.toFixed(2);
  check(r.missing.length === 0 && r.grips.length === cfg.grips.length, `${L} smoothness: sampler found ${r.chans.length} joint angles (${r.chans.map(c => c.name).join(', ')}) and ${r.grips.length} grip point(s)${r.missing.length ? '; missing ' + r.missing.join(', ') : ''}`);
  check(r.selfN > 0 && r.selfErr <= 0.01, `${L} smoothness: sampler self-test, drawn angle vs written stop at ${r.selfN} stops, worst ${r.selfErr.toFixed(4)} deg (limit 0.01)`);
  let dWorst = { v: 0, name: '' };
  for (const c of r.chans) for (let i = 0; i < N; i++) { const d = Math.abs(c.samples[i + 1] - c.samples[i]); if (d > dWorst.v) dWorst = { v: d, name: c.name, t: i / N }; }
  const out = { d: dWorst, phases: {} };
  for (const [ph, a, b] of PHASES) {
    const i0 = Math.round(a * N), i1 = Math.round(b * N);
    const rows = [];
    for (const g of r.grips) rows.push({ name: g.name + ' (grip)', ...phaseStats(g.samples, i0, i1, true), c: null, gate: true });
    for (const c of r.chans) {
      const s = phaseStats(c.samples, i0, i1, false), gate = s.travel >= LIM.travel;
      rows.push({ name: c.name, ...s, c: gate ? stopJerk(c.stops, a, b) : null, gate });
    }
    const gated = rows.filter(x => x.gate), angled = rows.filter(x => x.c);
    const worst = (arr, f) => arr.reduce((w, x) => (f(x) > f(w) ? x : w), arr[0]);
    const wa = worst(gated, x => x.edge), wb = worst(gated, x => x.jump), wc = angled.length ? worst(angled, x => x.c.ratio) : null;
    console.log(`  ${L} ${ph}: ` + rows.map(x => `${x.name}${x.travel !== null ? ` [${f2(x.travel)} deg]` : ''} a ${pc(x.edge)} b ${pc(x.jump)}${x.c ? ` c ${f2(x.c.ratio)}x/${x.c.n} stops` : ''}${x.gate ? '' : ' (under 10 deg: d only)'}`).join('; '));
    check(wa.edge <= LIM.a, `${L} smoothness (a) ${ph}: speed over the first and last 1/120 s at most ${pc(wa.edge)} of the phase's top speed (${wa.name}; limit 1 %)`);
    check(wb.jump <= LIM.b, `${L} smoothness (b) ${ph}: largest velocity step between samples 1/120 s apart ${pc(wb.jump)} of the top speed (${wb.name}; limit 8 %)`);
    check(!!wc && wc.c.ratio <= LIM.c, `${L} smoothness (c) ${ph}: change of acceleration between keyframe stops at most ${wc ? f2(wc.c.ratio) : 'n/a'} x its median (${wc ? wc.name + ', ' + wc.c.n + ' stops' : 'no angle moves 10 deg'}; ${angled.length} angle(s) of 10 deg or more; limit 3 x)`);
    out.phases[ph] = { a: wa.edge, aBy: wa.name, b: wb.jump, bBy: wb.name, c: wc ? wc.c.ratio : null, cBy: wc ? wc.name : null, rows: rows.map(x => ({ name: x.name, travel: x.travel, a: x.edge, b: x.jump, c: x.c ? x.c.ratio : null })) };
  }
  check(dWorst.v <= LIM.d, `${L} smoothness (d): largest joint angle step between samples 1/120 s apart ${dWorst.v.toFixed(2)} deg (${dWorst.name}${dWorst.t !== undefined ? ' at t ' + dWorst.t.toFixed(4) : ''}; limit 4 deg)`);
  return out;
}

module.exports = { smoothCheck, N, LIM };
