// Independent round-3 re-check of the QA r2 issues, measured in Chromium the way QA measured them.
// usage: node indep.cjs <page.html> [label]   (page = the harness index.html or the canvas render dc-render.html)
// It sets every scene animation's time directly (paused), then reads the drawn geometry back.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const page0 = path.resolve(process.argv[2]), label = process.argv[3] || path.basename(page0);
const REP = 4000;
(async () => {
  const b = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const out = { label };
  const open = async (q = '', cls = null) => {
    const ctx = await b.newContext({ viewport: { width: 420, height: 560 } });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + page0 + q); await p.waitForTimeout(400);
    if (cls !== null) await p.evaluate(c => { const r = document.querySelector('.player'); r.setAttribute('class', c); r.style.setProperty('--play', 'paused'); r.style.setProperty('--delay', '0s'); }, cls);
    await p.waitForTimeout(450);
    return { p, ctx, errs };
  };
  // helpers injected into the page
  const H = () => {
    window.__setT = t => { document.getAnimations().forEach(a => { const el = a.effect && a.effect.target; if (!el || !el.closest || el.closest('.pics') || el.closest('.inset')) return; if (!el.closest('.scene')) return; a.pause(); a.currentTime = t * 4000; }); };
    const svg = () => document.querySelector('.stage svg.scene');
    window.__pt = (el, x, y) => { const m = el.getScreenCTM(); const s = svg().getBoundingClientRect(); const P = new DOMPoint(x, y).matrixTransform(m); return [P.x - s.left, P.y - s.top]; };
    window.__scr = (el, x, y) => { const m = el.getScreenCTM(); const P = new DOMPoint(x, y).matrixTransform(m); return [P.x, P.y]; };
    window.__visible = el => { if (el.classList && el.classList.contains('hot')) return false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
    window.__topAt = (x, y) => { const els = document.elementsFromPoint(x, y); for (const e of els) { if (e.tagName === 'svg' || e.tagName === 'g') continue; if (!window.__visible(e)) continue; return e; } return null; };
    window.__cat = e => { if (!e) return 'none'; if (e.closest('.lp-cable-f')) return 'cable'; if (e.closest('.far-arm')) return 'farArm'; if (e.classList.contains('lp-hook')) return 'hook'; if (e.closest('.lp-bar')) return 'bar'; if (e.closest('.machine-back')) return 'machine'; if (e.closest('.arm-near')) return 'nearArm'; if (e.closest('.figure')) return 'body'; if (e.closest('.far-side')) return 'farLeg'; return e.getAttribute('class') || e.tagName; };
  };
  // ---------- A. cable coverage, C. near end, D. nesting, B. elbow smoothness (unzoomed) ----------
  {
    const { p, ctx, errs } = await open('?t=0', 'player gen-a');
    await p.evaluate(H);
    out.nesting = await p.evaluate(() => { const bars = [...document.querySelectorAll('.stage .scene .lp-bar')]; return { bars: bars.length, inNearHand: bars.filter(e => e.closest('.lp-hd') && e.closest('.arm-near')).length, hookInHand: !!document.querySelector('.stage .scene .lp-hd .lp-hook'), barOutsideHand: document.querySelectorAll('.stage .scene .lp-barline').length - document.querySelectorAll('.stage .scene .lp-hd .lp-barline').length }; });
    const ts = []; for (let i = 0; i <= 100; i++) ts.push(i / 100); ts.push(0.025, 0.03, 0.035, 0.81, 0.84);
    const cable = [], nearEnd = [];
    for (const t of ts.sort((a, b) => a - b)) {
      await p.evaluate(t => window.__setT(t), t);
      const r = await p.evaluate(() => {
        const ln = document.querySelector('.stage .scene .lp-cable-f line');
        const A = window.__scr(ln, +ln.getAttribute('x1'), +ln.getAttribute('y1')), B = window.__scr(ln, +ln.getAttribute('x2'), +ln.getAttribute('y2'));
        const cats = {}; let n = 0;
        for (let k = 1; k <= 39; k++) { const w = k / 40; const x = A[0] + (B[0] - A[0]) * w, y = A[1] + (B[1] - A[1]) * w; const c = window.__cat(window.__topAt(x, y)); cats[c] = (cats[c] || 0) + 1; n++; }
        const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
        // near overhang of the bar: from the grip (0,16) in the hand frame out to the near tip (-9.75, 27.85)
        const hd = document.querySelector('.stage .scene .arm-near .lp-hd');
        const barEl = document.querySelector('.stage .scene .lp-hd .lp-bar path');
        const pts = barEl.getAttribute('d').match(/-?[\d.]+/g).map(Number); // M x0 y0 L x1 y1 ...
        const tip = [pts[0], pts[1]], bend = [pts[2], pts[3]];
        // bar points are in the lp-bar group's frame (rotated about the grip 0,16): use that element's CTM
        let vis = 0, tot = 0, outer = 0, outerTot = 0; const segs = [[bend, tip]];
        for (let k = 0; k <= 20; k++) { const w = k / 20; const x = bend[0] + (tip[0] - bend[0]) * w, y = bend[1] + (tip[1] - bend[1]) * w; const P = window.__scr(barEl, x, y); const c = window.__cat(window.__topAt(P[0], P[1])); tot++; if (c === 'bar') vis++; if (w >= 0.5) { outerTot++; if (c === 'bar') outer++; } }
        return { cats, n, len, nearEnd: vis / tot, nearOuter: outer / outerTot };
      });
      cable.push({ t, ...r });
    }
    out.cable = {
      worstFarArm: Math.max(...cable.map(c => c.cats.farArm || 0)),
      worstBody: Math.max(...cable.map(c => (c.cats.body || 0) + (c.cats.nearArm || 0))),
      visibleShare: { min: Math.min(...cable.map(c => (c.cats.cable || 0) / c.n)), at: cable.reduce((m, c) => ((c.cats.cable || 0) / c.n < (m.cats.cable || 0) / m.n ? c : m)).t },
      t0: cable.find(c => c.t === 0).cats, t0len: cable.find(c => c.t === 0).len,
      over35pct: cable.filter(c => 1 - (c.cats.cable || 0) / c.n > 0.35).map(c => c.t),
    };
    out.nearEnd = { minShare: Math.min(...cable.map(c => c.nearEnd)), minOuter: Math.min(...cable.map(c => c.nearOuter)), worstAt: cable.reduce((m, c) => (c.nearEnd < m.nearEnd ? c : m)).t };
    // B. elbow: drawn angle and elbow point speed per 20 ms (t step 0.005 at 1x)
    const series = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200; await p.evaluate(t => window.__setT(t), t);
      series.push(await p.evaluate(t => {
        const ua = document.querySelector('.stage .scene .arm-near.lp-ua'), fa = document.querySelector('.stage .scene .arm-near .lp-fa'), hd = document.querySelector('.stage .scene .arm-near .lp-hd');
        const S = window.__pt(ua, 0, -62), E = window.__pt(fa, 0, -24), G = window.__pt(hd, 0, 16);
        const u = [S[0] - E[0], S[1] - E[1]], v = [G[0] - E[0], G[1] - E[1]];
        const ang = Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI;
        const fua = document.querySelector('.stage .scene .far-arm .lp-fua'), ffa = document.querySelector('.stage .scene .far-arm .lp-ffa');
        const fE = window.__pt(ffa, 150.29, 173.79);
        return { t, S, E, G, ang, fE };
      }, t));
    }
    const step = (a, b, k) => Math.hypot(b[k][0] - a[k][0], b[k][1] - a[k][1]);
    const sp = series.slice(1).map((s, i) => ({ t: s.t, e: step(series[i], s, 'E'), g: step(series[i], s, 'G'), fe: step(series[i], s, 'fE'), a: Math.abs(s.ang - series[i].ang) }));
    const phase = (lo, hi) => sp.filter(s => s.t > lo + 1e-9 && s.t <= hi + 1e-9);
    const dip = arr => { const mx = Math.max(...arr); let w = 0, pre = -1; const suf = []; let m = -1; for (let i = arr.length - 1; i >= 0; i--) { m = Math.max(m, arr[i]); suf[i] = m; } for (let j = 0; j < arr.length; j++) { if (j > 0 && j < arr.length - 1) w = Math.max(w, Math.min(pre, suf[j + 1]) - arr[j]); pre = Math.max(pre, arr[j]); } return mx ? w / mx : 0; };
    const peaks = arr => { let n = 0; for (let i = 1; i < arr.length - 1; i++) if (arr[i] > arr[i - 1] + 1e-6 && arr[i] >= arr[i + 1]) n++; return n; };
    const f2 = v => +v.toFixed(2);
    out.elbow = {
      angAt: { '0': f2(series[0].ang), '0.025': f2(series[5].ang), '0.05': f2(series[10].ang), '0.78': f2(series[156].ang), '0.81': f2(series[162].ang) },
      pull: { elbowStep: phase(0, 0.25).map(s => f2(s.e)), angleStep: phase(0, 0.25).map(s => f2(s.a)), gripStep: phase(0, 0.25).map(s => f2(s.g)), farElbowStep: phase(0, 0.25).map(s => f2(s.fe)) },
      ret: { elbowStep: phase(0.375, 0.875).map(s => f2(s.e)), angleStep: phase(0.375, 0.875).map(s => f2(s.a)), gripStep: phase(0.375, 0.875).map(s => f2(s.g)) },
    };
    out.elbow.dips = {}; out.elbow.localPeaks = {};
    for (const ph of ['pull', 'ret']) for (const k of Object.keys(out.elbow[ph])) { out.elbow.dips[ph + '.' + k] = f2(dip(out.elbow[ph][k]) * 100); out.elbow.localPeaks[ph + '.' + k] = peaks(out.elbow[ph][k]); }
    out.elbow.angleChange_0025_005 = f2(series[5].ang - series[10].ang);
    out.elbow.ret_078_081 = f2(series[162].ang - series[156].ang);
    out.errors = errs;
    await ctx.close();
  }
  // ---------- E/F. close-ups at the setup pose, and the Pictures stills ----------
  const crop = async (cls, t) => {
    const { p, ctx } = await open('?t=0', cls);
    await p.evaluate(H);
    if (t !== null) await p.evaluate(t => window.__setT(t), t);
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const st = document.querySelector('.stage').getBoundingClientRect();
      const rel = el => { const r = el.getBoundingClientRect(); return { top: +(r.top - st.top).toFixed(1), bottom: +(r.bottom - st.top).toFixed(1), left: +(r.left - st.left).toFixed(1), right: +(r.right - st.left).toFixed(1) }; };
      const bub = [...document.querySelectorAll('.bubble')].find(e => getComputedStyle(e).display !== 'none' && +getComputedStyle(e).opacity > 0);
      const legs = document.querySelector('.stage .scene .figure > g.j:not(.lp-torso)');
      return {
        farArm: rel(document.querySelector('.stage .scene .far-arm')),
        pulley: rel(document.querySelector('.stage .scene .machine-back circle.eqm[cx="146.3"]') || document.querySelector('.stage .scene .machine-back > circle.eqm')),
        cable: rel(document.querySelector('.stage .scene .lp-cable-f line')),
        nearFist: rel(document.querySelector('.stage .scene .arm-near .lp-hd polygon.b')),
        feet: legs ? rel(legs) : null,
        bubble: bub ? rel(bub) : null, bubbleText: bub ? bub.textContent.trim() : null,
      };
    });
    await ctx.close(); return r;
  };
  out.crops = {
    grip_t0: await crop('player gen-a zoom-1', 0), path_t0: await crop('player gen-a zoom-2', 0), pad_t0: await crop('player gen-a zoom-3', 0),
    pics_grip: await crop('player gen-b pictures zoom-1', null), pics_path: await crop('player gen-b pictures zoom-2', null), pics_pad: await crop('player gen-b pictures zoom-3', null),
  };
  // ---------- G. inset bar vs the scene bar; H. the Path caption ----------
  {
    const { p, ctx } = await open('?t=0', 'player gen-a zoom-1');
    out.inset = await p.evaluate(() => {
      const fig = document.querySelector('.inset-fig'); const vb = fig.getAttribute('viewBox');
      const paths = [...fig.querySelectorAll('path,polyline,line')].map(e => ({ cls: e.getAttribute('class'), d: e.getAttribute('d') || e.getAttribute('points') }));
      return { vb, paths };
    });
    out.pathCaption = await p.evaluate(() => [...document.querySelectorAll('.bubble-2')].map(e => e.textContent.trim()));
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
