// shoot.cjs: checks and screenshots for the Dumbbell Lateral Raise player harness (index.html).
// Run after `node build.mjs`:  node shoot.cjs   (exit code 1 when any check fails; writes checks.txt)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname, OUT = path.join(DIR, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };
const f2 = v => Number(v).toFixed(2);

// Spec 3.5 / RIG.md 15: A = 12 -> 88 degrees, forearm bend 15 constant, shoulders (157,94) and (201,94).
const A0 = 12, A1 = 88, BEND = 15, SR = [201, 94], SL = [157, 94];
const minJerk = x => x * x * x * (10 + x * (-15 + 6 * x)); // minimum-jerk timing baked into the samples (UPGRADE-BRIEF.md)
const pOf = u => u <= 0.25 ? minJerk(u / 0.25) : u <= 0.375 ? 1 : u <= 0.875 ? 1 - minJerk((u - 0.375) / 0.5) : 0;
const rad = d => d * Math.PI / 180;
// Screen-right grip: shoulder + R(-A) * [(0,38) + R(+15)(0,40)]   (SVG rotate, y down)
const gripAt = u => {
  const A = rad(A0 + (A1 - A0) * pOf(u)), b = rad(BEND);
  const x = -40 * Math.sin(b), y = 38 + 40 * Math.cos(b);
  return [SR[0] + x * Math.cos(A) + y * Math.sin(A), SR[1] - x * Math.sin(A) + y * Math.cos(A)];
};

(async () => {
  const browser = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const errors = [];
  const open = async (query, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: 2, reducedMotion: opts.rm ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${query}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${query}: ${m.text()}`); });
    // offline shoots: the harness draws Roboto from its local copy (rig-final/fonts), so the Google Fonts link is answered with an
    // empty stylesheet here and never logs a network error (the artboard loads the same link for real)
    await page.route(/fonts\.googleapis\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await page.goto('file://' + path.join(DIR, 'index.html') + query);
    await page.waitForTimeout(opts.wait || 400);
    return { page, ctx };
  };
  const shot = async (page, name) => { await (await page.$('.player')).screenshot({ path: path.join(OUT, name) }); };

  // 1. Required screenshots ------------------------------------------------------------------
  for (let i = 0; i < 8; i++) { const t = i / 8; const { page, ctx } = await open(`?t=${t}`); await shot(page, `lr_dark_t${t.toFixed(3)}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?theme=paper&t=0.5'); await shot(page, 'lr_paper_t0.500.png'); await ctx.close(); }
  for (const [z, t] of [[1, 0.25], [2, 0.125], [3, 0.25]]) { const { page, ctx } = await open(`?zoom=${z}&t=${t}`, { wait: 700 }); await shot(page, `lr_zoom-${z}_t${t}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?zoom=3&t=0', { wait: 700 }); await shot(page, 'lr_zoom-3_t0.png'); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures'); await shot(page, 'lr_pictures.png'); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures&theme=paper'); await shot(page, 'lr_pictures_paper.png'); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures&zoom=2', { wait: 700 }); await shot(page, 'lr_pictures-still-zoom-2.png'); await ctx.close(); }
  { const { page, ctx } = await open('', { rm: true }); await shot(page, 'lr_reduced-motion.png'); await ctx.close(); }
  for (const th of ['ember', 'emerald', 'midnight']) { const { page, ctx } = await open(`?theme=${th}&t=0.125`); await shot(page, `lr_${th}_t0.125.png`); await ctx.close(); }

  // 2. Bindings: every hole the markup uses comes from renderVals(); themes -------------------
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(() => { const v = window.__rig.renderVals(); return { missing: window.__used.filter(k => !(k in v)), handlers: ['pick1', 'pick2', 'pick3', 'togglePlay', 'speedTo1', 'speedToHalf', 'toAnim', 'toPics'].every(k => typeof v[k] === 'function') }; });
    check(r.missing.length === 0 && r.handlers, `every markup binding exists in renderVals() (missing: ${r.missing.join(',') || 'none'})`);
    await ctx.close();
  }
  for (const th of ['silent-black', 'paper', 'ember', 'emerald', 'midnight']) {
    const { page, ctx } = await open(`?theme=${th}&t=0`);
    const r = await page.evaluate((th) => ({ s1: getComputedStyle(document.querySelector('.player')).getPropertyValue('--surface-1').trim(), want: THEMES[th].s1, bg: getComputedStyle(document.querySelector('.stage')).backgroundColor }), th);
    check(r.s1 === r.want, `theme ${th}: stage paints --surface-1 ${r.s1} (${r.bg})`);
    await ctx.close();
  }

  // 3. Movement: tempo table, shoulders fixed, mirror, shoulder line, elbow bend, level dumbbells ---
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(async () => {
      const svg = document.querySelector('.scene');
      const at = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(el.getCTM()); return [q.x, q.y]; };
      const ang = el => { const m = el.getCTM(); return Math.atan2(m.b, m.a) * 180 / Math.PI; };
      const uaR = document.querySelector('.arm-r'), uaL = document.querySelector('.arm-l');
      const faR = document.querySelector('.lr-fa-r'), faL = document.querySelector('.lr-fa-l');
      const dbR = document.querySelector('.lr-db-r'), dbL = document.querySelector('.lr-db-l');
      let shR = [0, 0], shL = [0, 0], mirror = 0, above = -1e9, elbowAbove = -1e9, bend = 0, level = 0, minA = 1e9, maxA = -1e9;
      const samples = [];
      for (let i = 0; i <= 200; i++) {
        window.__rig.freeze(i / 200);
        await new Promise(res => requestAnimationFrame(res));
        const sR = at(uaR, 22, -62), sL = at(uaL, -22, -62), gR = at(dbR, 22, 16), gL = at(dbL, -22, 16), eR = at(faR, 22, -24), eL = at(faL, -22, -24);
        shR = [Math.max(shR[0], Math.abs(sR[0] - 201)), Math.max(shR[1], Math.abs(sR[1] - 94))];
        shL = [Math.max(shL[0], Math.abs(sL[0] - 157)), Math.max(shL[1], Math.abs(sL[1] - 94))];
        mirror = Math.max(mirror, Math.hypot(gR[0] + gL[0] - 358, gR[1] - gL[1]), Math.hypot(eR[0] + eL[0] - 358, eR[1] - eL[1]));
        above = Math.max(above, 94 - gR[1], 94 - gL[1]);
        elbowAbove = Math.max(elbowAbove, 94 - eR[1], 94 - eL[1]);
        const A = -ang(uaR);
        minA = Math.min(minA, A); maxA = Math.max(maxA, A);
        bend = Math.max(bend, Math.abs((ang(faR) - ang(uaR)) - 15), Math.abs((ang(faL) - ang(uaL)) + 15));
        level = Math.max(level, Math.abs(ang(dbR)), Math.abs(ang(dbL)));
        samples.push({ t: i / 200, A, AL: ang(uaL), g: gR });
      }
      return { shR, shL, mirror, above, elbowAbove, bend, level, minA, maxA, samples };
    });
    check(Math.max(...r.shR, ...r.shL) < 0.01, `both shoulder joints fixed at (201, 94) and (157, 94), no shrug (drift ${f2(Math.max(...r.shR, ...r.shL))})`);
    check(r.mirror < 0.01, `left and right hands and elbows mirror each other over 201 phases (error ${r.mirror.toFixed(4)})`);
    check(r.above <= -12, `hands never reach the shoulder line (closest ${f2(-r.above)} below; truth table: never above shoulder height)`);
    check(r.elbowAbove <= 0, `elbows never above the shoulder line (closest ${f2(-r.elbowAbove)} below)`);
    check(r.bend < 0.01, `elbow bend stays 15 degrees (inside angle 165) over the rep (error ${r.bend.toFixed(4)})`);
    check(r.level < 0.01, `dumbbells stay level on screen (worst tilt ${r.level.toFixed(4)} degrees)`);
    check(Math.abs(r.minA - 12) < 0.05 && Math.abs(r.maxA - 88) < 0.05, `arm out from the side ${f2(r.minA)} to ${f2(r.maxA)} degrees (truth table 10-15 to 85-90)`);
    const byT = t => r.samples.find(s => Math.abs(s.t - t) < 1e-9);
    const table = [[0, 12], [0.125, 50], [0.25, 88], [0.375, 88], [0.625, 50], [0.875, 12], [1, 12]];
    const rows = table.map(([t, want]) => { const s = byT(t); return { t, want, got: s.A, ok: Math.abs(s.A - want) < 0.3 && Math.abs(s.AL - s.A) < 0.01 }; });
    check(rows.every(x => x.ok), `tempo table A at 0/12.5/25/37.5/62.5/87.5/100 %: ${rows.map(x => `${x.t * 100}%=${f2(x.got)}(${x.want})`).join(' ')}`);
    let worst = 0;
    for (const s of r.samples) { const w = gripAt(s.t); worst = Math.max(worst, Math.hypot(s.g[0] - w[0], s.g[1] - w[1])); }
    check(worst < 0.5, `grip follows the timed path over 201 phases (worst ${worst.toFixed(3)} units): start (${f2(byT(0).g[0])}, ${f2(byT(0).g[1])}), top (${f2(byT(0.25).g[0])}, ${f2(byT(0.25).g[1])}); spec (206.8, 171.2) to (277.2, 107)`);
    check(Math.hypot(byT(0).g[0] - 206.8, byT(0).g[1] - 171.2) < 0.2 && Math.hypot(byT(0.25).g[0] - 277.2, byT(0.25).g[1] - 107) < 0.2, `grip start and top match spec 3.5 within 0.2 units`);
    // Safe area (RIG.md section 2): figure and moving equipment inside x 16-342, y 40-258 all rep.
    const out = await page.evaluate(async () => {
      const st = document.querySelector('.stage').getBoundingClientRect(); const bad = []; let minTop = 1e9, minL = 1e9, maxR = -1e9;
      for (let i = 0; i <= 40; i++) {
        window.__rig.freeze(i / 40); await new Promise(res => requestAnimationFrame(res));
        document.querySelectorAll('.arm-r, .arm-l, .figure').forEach(el => { const b = el.getBoundingClientRect(); const L = b.left - st.left, R = b.right - st.left, T = b.top - st.top, B = b.bottom - st.top; minTop = Math.min(minTop, T); minL = Math.min(minL, L); maxR = Math.max(maxR, R); if (L < 16 - 0.5 || R > 342 + 0.5 || T < 40 - 0.5 || B > 258 + 1.5) bad.push(i / 40 + ':' + el.getAttribute('class') + `(${L.toFixed(1)},${T.toFixed(1)},${R.toFixed(1)},${B.toFixed(1)})`); });
      }
      return { bad, minTop, minL, maxR };
    });
    check(out.bad.length === 0, `figure and dumbbells inside the safe area x 16-342, y 40-258 at 41 phases (x ${f2(out.minL)}-${f2(out.maxR)}, top ${f2(out.minTop)}) ${out.bad.slice(0, 3).join(' ')}`);
    // phase captions: exactly one visible, the right one, in each window
    const caps = await page.evaluate(async () => {
      const res = [];
      for (const [t, want] of [[0.1, 'c1'], [0.3, 'c2'], [0.6, 'c3'], [0.95, 'c4']]) {
        window.__rig.freeze(t); await new Promise(res => requestAnimationFrame(res));
        const vis = ['c1', 'c2', 'c3', 'c4'].filter(c => getComputedStyle(document.querySelector('.' + c)).opacity === '1');
        res.push(vis.length === 1 && vis[0] === want ? 'ok' : `t${t}:${vis.join('+')}`);
      }
      return res;
    });
    check(caps.every(c => c === 'ok'), `phase captions: Raise at 10 %, Pause at 30 %, Lower at 60 %, Reset at 95 % (${caps.join(' ')})`);
    // effort cue: main muscle 0.75 at setup, 1 at the top
    const eff = await page.evaluate(async () => {
      const o = [];
      for (const t of [0, 0.25]) { window.__rig.freeze(t); await new Promise(res => requestAnimationFrame(res)); o.push(+getComputedStyle(document.querySelector('.lr-eff')).opacity); }
      return o;
    });
    check(Math.abs(eff[0] - 0.75) < 0.01 && Math.abs(eff[1] - 1) < 0.01, `effort cue on the side shoulders: opacity ${eff[0]} at setup, ${eff[1]} at the top`);
    await ctx.close();
  }

  // 4. Bounded 3 reps, real end, Replay through the -b set, speed ---------------------------
  {
    const { page, ctx } = await open('');
    let r = await page.evaluate(() => { const ua = getComputedStyle(document.querySelector('.lr-ua-r')); return { it: ua.animationIterationCount, rep: getComputedStyle(document.querySelector('.r1')).animationIterationCount, cap: getComputedStyle(document.querySelector('.c1')).animationIterationCount, name: ua.animationName, play: ua.animationPlayState, dur: ua.animationDuration, delay: ua.animationDelay }; });
    check(r.it === '3' && r.cap === '3' && r.rep === '1' && r.name === 'lr-ua-r-a' && r.play === 'running' && r.dur === '4s' && r.delay === '0s', `default harness: 3 reps (figure ${r.it}, captions ${r.cap}, rep pill ${r.rep} cycle), ${r.name}, ${r.play}, --dur ${r.dur}, --delay ${r.delay}`);
    await page.waitForTimeout(12400);
    r = await page.evaluate(() => ({ label: document.querySelector('.btn-icon').getAttribute('aria-label'), ended: !document.querySelector('[data-if="showEnded"]').hidden, states: document.getAnimations().filter(a => a.animationName && a.animationName.startsWith('lr-')).map(a => Math.round(a.currentTime)) }));
    // The 200 ms timer may stop the set a few ms before the CSS end; the last 0.5 s of a rep (11.5-12 s) is the still reset pose.
    check(r.label === 'Replay' && r.ended && r.states.length > 0 && r.states.every(t => t >= 11500 && t <= 12000), `after 12 s: every animation stopped in the reset window of rep 3 (${[...new Set(r.states)].join(',')} ms of 11500-12000), button says ${r.label}, ended text shown`);
    const endPose = await page.evaluate(() => { const svg = document.querySelector('.scene'); const p = svg.createSVGPoint(); p.x = 22; p.y = 16; const q = p.matrixTransform(document.querySelector('.lr-db-r').getCTM()); return [q.x, q.y]; });
    check(Math.hypot(endPose[0] - 206.81, endPose[1] - 171.11) < 0.2, `after 3 reps the setup pose holds (grip ${f2(endPose[0])}, ${f2(endPose[1])})`);
    await page.click('.btn-icon');
    r = await page.evaluate(() => ({ cls: document.querySelector('.player').className, name: getComputedStyle(document.querySelector('.lr-ua-r')).animationName, cap: getComputedStyle(document.querySelector('.c1')).animationName, play: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState, label: document.querySelector('.btn-icon').getAttribute('aria-label') }));
    check(/gen-b/.test(r.cls) && r.name === 'lr-ua-r-b' && r.cap === 'cap1-b' && r.play === 'running' && r.label === 'Pause', `Replay restarts through the -b set (${r.name}, ${r.cap}, ${r.play}, button ${r.label})`);
    await page.click('.speed button:nth-child(2)');
    r = await page.evaluate(() => ({ dur: getComputedStyle(document.querySelector('.lr-ua-r')).animationDuration, name: getComputedStyle(document.querySelector('.lr-ua-r')).animationName, slow: !document.querySelector('.pill-accent').hidden }));
    check(r.dur === '8s' && r.name === 'lr-ua-r-a' && r.slow, `0.5x: 8 s rep, restarted from setup (${r.name}), Slow motion pill shown`);
    await page.click('.btn-icon');
    r = await page.evaluate(() => ({ play: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState, label: document.querySelector('.btn-icon').getAttribute('aria-label') }));
    check(r.play === 'paused' && r.label === 'Play', `Pause holds the frame (${r.play}, button ${r.label})`);
    await ctx.close();
  }
  { const { page, ctx } = await open('?loop=1'); const r = await page.evaluate(() => [getComputedStyle(document.querySelector('.lr-ua-r')).animationIterationCount, getComputedStyle(document.querySelector('.r1')).animationIterationCount]); check(r[0] === 'infinite' && r[1] === 'infinite', `?loop=1: figure and rep pill repeat (${r})`); await ctx.close(); }
  {
    const { page, ctx } = await open('?autoplay=0');
    const r = await page.evaluate(() => ({ play: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState, idle: !document.querySelector('[data-if="showIdle"]').hidden, label: document.querySelector('.btn-icon').getAttribute('aria-label') }));
    check(r.play === 'paused' && r.idle && r.label === 'Play', `autoplay off: setup pose, "Tap Play" line, Play button (${r.play})`);
    await ctx.close();
  }

  // 5. Zoom states as root classes ---------------------------------------------------------
  const CAM = { 1: [179, 90, 2.2], 2: [179, 135, 1.2], 3: [179, 113, 2.2] };
  // Subject per chip: Shoulders = the two shoulder lines and arrows; Path = both dashed hand paths; Elbows = both elbow rings.
  const SUBJECT = { 1: '.ov-shoulders', 2: '.guide', 3: '.ov-elbows' };
  for (const z of [1, 2, 3]) {
    const { page, ctx } = await open(`?t=0&zoom=${z}`, { wait: 700 });
    const r = await page.evaluate(async ({ z, sel }) => {
      const vis = q => { const el = document.querySelector(q); return !!el && !el.hidden && getComputedStyle(el).display !== 'none'; };
      const m = new DOMMatrix(getComputedStyle(document.querySelector('.cam')).transform);
      const st = document.querySelector('.stage').getBoundingClientRect(), bu = document.querySelector('.bub-' + z).getBoundingClientRect();
      let out = -1e9, under = -1e9, n = 0;
      for (let i = 0; i <= 40; i++) {
        window.__rig.freeze(i / 40); await new Promise(res => requestAnimationFrame(res));
        document.querySelectorAll(sel).forEach(el => { if (el.closest('.pics')) return; n++; const b = el.getBoundingClientRect(); out = Math.max(out, st.left - b.left, b.right - st.right, st.top - b.top); under = Math.max(under, b.bottom - bu.top); });
      }
      return {
        cls: document.querySelector('.player').className, m: [m.a, m.d, m.e, m.f],
        bubbles: [1, 2, 3].filter(i => vis('.bub-' + i)), pill: vis('.pill-row'), label: vis('.cam-label'),
        ovSh: getComputedStyle(document.querySelector('.ov-shoulders')).opacity, ovEl: getComputedStyle(document.querySelector('.ov-elbows')).opacity,
        pressed: [...document.querySelectorAll('.chip')].map(b => b.getAttribute('aria-pressed')).join(','),
        trans: getComputedStyle(document.querySelector('.cam')).transition, out, under, n: n / 41,
      };
    }, { z, sel: SUBJECT[z] });
    const [cx, cy, s] = CAM[z];
    const camOk = Math.abs(r.m[0] - s) < 1e-3 && Math.abs(r.m[1] - s) < 1e-3 && Math.abs(r.m[2] - (179 - s * cx)) < 0.01 && Math.abs(r.m[3] - (138 - s * cy)) < 0.01;
    check(r.cls.includes('zoom-' + z) && camOk && /transform 0\.32s/.test(r.trans), `zoom-${z}: root class "${r.cls}", camera scale ${s} centred on (${cx}, ${cy}), 320 ms transition`);
    check(r.bubbles.join() === String(z) && !r.pill && !r.label, `zoom-${z}: only bubble ${z} shows; rep pill and camera label hidden`);
    const ovOk = z === 1 ? r.ovSh === '1' && r.ovEl === '0' : z === 3 ? r.ovEl === '1' && r.ovSh === '0' : r.ovSh === '0' && r.ovEl === '0';
    check(ovOk && r.pressed === [1, 2, 3].map(i => String(i === z)).join(','), `zoom-${z}: overlays (shoulders ${r.ovSh}, elbows ${r.ovEl}), chip pressed ${r.pressed}`);
    check(r.n > 0 && r.out <= 0.5 && r.under <= 0.5, `zoom-${z}: subject (${r.n} parts) inside the stage and above the bubble over 41 phases (closest ${(-r.out).toFixed(1)} px from an edge, ${(-r.under).toFixed(1)} px above the bubble)`);
    await ctx.close();
  }
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(() => ({ pill: getComputedStyle(document.querySelector('.pill-row')).display, label: getComputedStyle(document.querySelector('.cam-label')).display, bub: [...document.querySelectorAll('.bubble')].map(b => getComputedStyle(b).display).join(','), m: getComputedStyle(document.querySelector('.cam')).transform }));
    check(r.pill !== 'none' && r.label !== 'none' && r.bub === 'none,none,none' && r.m === 'none', `no zoom: rep pill and camera label shown, no bubble, camera at 1x`);
    await page.click('.chip:nth-child(2)'); const on2 = await page.evaluate(() => document.querySelector('.player').className);
    await page.click('.chip:nth-child(2)'); const off2 = await page.evaluate(() => document.querySelector('.player').className);
    check(/zoom-2/.test(on2) && !/zoom-/.test(off2), `tapping Path sets zoom-2, tapping it again clears it ("${on2}" -> "${off2}")`);
    await ctx.close();
  }

  // 6. Pictures mode and stills --------------------------------------------------------------
  {
    const { page, ctx } = await open('?mode=pictures');
    const r = await page.evaluate(() => ({ cls: document.querySelector('.player').className, pics: getComputedStyle(document.querySelector('.pics')).display, play: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState, line: !document.querySelector('[data-if="showPicsLine"]').hidden, hint: !document.querySelector('[data-if="hintPics"]').hidden, caps: [...document.querySelectorAll('.tile p')].map(p => p.textContent) }));
    check(/pictures/.test(r.cls) && r.pics === 'grid' && r.play === 'paused' && r.line && r.hint, `Pictures: root class "${r.cls}", grid shown, stage paused, summary line and hint`);
    check(r.caps.join('|') === 'Stand tall, elbows soft|Lift out to the sides|Stop at shoulder height|Lower slowly, 2 s', `Pictures captions: ${r.caps.join(' / ')}`);
    const shotsB64 = [];
    for (const el of await page.$$('.tile svg')) shotsB64.push((await el.screenshot()).toString('base64'));
    check(new Set(shotsB64).size === 4, `Pictures: the 4 tiles show 4 different poses from the one rig`);
    await ctx.close();
  }
  {
    const want = gripAt(0.31);
    for (const [z, pose] of [[1, 0], [2, 0.31], [3, 0]]) {
      const { page, ctx } = await open(`?mode=pictures&zoom=${z}`, { wait: 700 });
      const r = await page.evaluate(() => { const svg = document.querySelector('.scene'); const p = svg.createSVGPoint(); p.x = 22; p.y = 16; const q = p.matrixTransform(document.querySelector('#rig-lr').getCTM().inverse().multiply(document.querySelector('.lr-db-r').getCTM())); return { h: [q.x, q.y], pics: getComputedStyle(document.querySelector('.pics')).display, bub: getComputedStyle(document.querySelector('.bub-' + new URLSearchParams(location.search).get('zoom'))).display, caps: !document.querySelector('[data-if="showCaps"]').hidden, tempo: !document.querySelector('[data-if="showTempo"]').hidden, still: [...document.querySelectorAll('[data-if="showStill1"],[data-if="showStill3"]')].filter(e => !e.hidden).map(e => e.textContent) }; });
      const target = pose ? want : [206.81, 171.11];
      const cap = pose ? 'Stop at shoulder height' : 'Stand tall, elbows soft';
      check(r.pics === 'none' && r.bub === 'flex' && !r.caps && !r.tempo && r.still.join('|') === cap && Math.hypot(r.h[0] - target[0], r.h[1] - target[1]) < 0.3, `Pictures still zoom-${z}: grid hidden, bubble shown, pose ${pose ? 3 : 1} (grip ${f2(r.h[0])}, ${f2(r.h[1])}), picture caption "${r.still.join('|')}", no phase caption or tempo`);
      await ctx.close();
    }
  }

  // 7. Reduced motion -------------------------------------------------------------------------
  {
    const { page, ctx } = await open('', { rm: true });
    const r = await page.evaluate(() => ({ fig: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState, cap: getComputedStyle(document.querySelector('.c1')).animationPlayState, pics: getComputedStyle(document.querySelector('.pics')).display, hint: !document.querySelector('[data-if="hintRm"]').hidden, anim: document.querySelector('.mode button').disabled, play: document.querySelector('.btn-icon').disabled }));
    check(r.fig === 'paused' && r.cap === 'paused' && r.pics === 'grid' && r.hint && r.anim && r.play, `reduced motion: paused, key poses shown, hint says why, Play and Animation disabled`);
    const forced = await page.evaluate(() => { const el = document.querySelector('.player'); el.style.setProperty('--play', 'running'); el.className = 'player gen-a'; return [getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState, getComputedStyle(document.querySelector('.pics')).display]; });
    check(forced[0] === 'paused' && forced[1] === 'grid', `reduced motion: stays paused and shows the key poses even when the root says running and not pictures (${forced})`);
    await page.evaluate(() => { document.querySelector('.player').className = 'player gen-a pictures'; });
    await page.click('.chip:nth-child(3)');
    const still = await page.evaluate(() => ({ pics: getComputedStyle(document.querySelector('.pics')).display, trans: getComputedStyle(document.querySelector('.cam')).transitionDuration }));
    check(still.pics === 'none' && still.trans === '0s', `reduced motion: a zoom chip opens a still with no camera glide (${still.trans})`);
    await ctx.close();
  }

  // smoothness (UPGRADE-BRIEF.md target 4): every joint angle and the grip at 120 samples per second, plus the keyframe stops
  { const { smoothCheck } = require('../smooth-check.cjs'); const { page, ctx } = await open('?t=0'); await smoothCheck(page, { label: 'lateral raise', grips: [{ name: 'right hand', sel: '.lr-fa-r', x: 22, y: 16 }, { name: 'left hand', sel: '.lr-fa-l', x: -22, y: 16 }] }, check); await ctx.close(); }
  // The target muscle stays visible at the hardest point (rig-final/muscle-check.cjs), and the caption row never overlaps
  // or leaves the player in idle, ended, the four captions and Pictures, drawn with the canvas font (caption-check.cjs).
  {
    const { muscleAreaCheck } = require('../rig-final/muscle-check.cjs');
    const { captionRowCheck } = require('../rig-final/caption-check.cjs');
    const ended = () => { window.__rig.stopClock(); window.__rig.setState({ playing: false, ended: true }); };
    { const { page, ctx } = await open('?t=0'); await muscleAreaCheck(page, { label: 'lateral raise' }, check); await ctx.close(); }
    await captionRowCheck(q => open(q), { label: 'lateral raise', states: [['?autoplay=0', 'idle'], ['?loop=0', 'ended', ended], ['?t=0.1', 'caption 1'], ['?t=0.3', 'caption 2'], ['?t=0.6', 'caption 3'], ['?t=0.95', 'caption 4'], ['?mode=pictures', 'Pictures']] }, check);
  }
  // Secondary motion, lateral raise: the upper-trap helper tint eases off (1 -> 0.7) as the delts take over, on the move's
  // timing and opacity only (the traps stay down, no shrug): 1 at setup and at the rep restart, never rises in the lift,
  // 0.7 through the hold, never falls in the return, largest step between samples 1/120 s apart at most 0.01.
  {
    const { page, ctx } = await open('?t=0');
    const o = await page.evaluate(async () => {
      const el = document.querySelector('.stage .scene .mh.lr-hlp'); if (!el) return null;
      const out = []; for (let i = 0; i <= 480; i++) { window.__rig.freeze(i / 480); await new Promise(res => requestAnimationFrame(res)); out.push(+getComputedStyle(el).opacity); } return out;
    });
    const mono = (a, b, dir) => o.slice(a, b + 1).every((v, i, arr) => i === 0 || dir * (v - arr[i - 1]) >= -1e-6);
    const step = o ? Math.max(...o.slice(1).map((v, i) => Math.abs(v - o[i]))) : 1;
    check(!!o && Math.abs(o[0] - 1) < 1e-3 && Math.abs(o[480] - 1) < 1e-3 && mono(0, 120, -1) && o.slice(120, 181).every(v => Math.abs(v - 0.7) < 1e-3) && mono(180, 420, 1) && step <= 0.01,
      `lateral raise: upper-trap helper tint eases 1 -> 0.7 with the lift and back (traps stay down): ${o ? `${o[0].toFixed(2)} at setup, ${o[120].toFixed(2)} through the hold, ${o[480].toFixed(2)} at the restart, largest step ${step.toFixed(4)}` : 'no .mh.lr-hlp element'}`);
    await ctx.close();
  }

  check(errors.length === 0, `no page errors (${errors.length}) ${errors.slice(0, 3).join(' | ')}`);
  await browser.close();
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL CHECKS PASSED');
  fs.writeFileSync(path.join(DIR, 'checks.txt'), fails.length ? 'FAILED:\n' + fails.join('\n') + '\n' : 'ALL CHECKS PASSED\n');
  process.exit(fails.length ? 1 : 0);
})();
