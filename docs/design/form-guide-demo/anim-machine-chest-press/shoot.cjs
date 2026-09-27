// shoot.cjs: checks and screenshots for the Machine Chest Press player harness (index.html).
// Run after `node build.mjs`:  node shoot.cjs   (exit code 1 when any check fails; writes checks.txt)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname, OUT = path.join(DIR, process.env.SHOTS || 'shots');
fs.mkdirSync(OUT, { recursive: true });
const CP = JSON.parse(fs.readFileSync(path.join(DIR, 'rig', 'poses.json'), 'utf8')).chestPress; // written by build.mjs
const geo = CP.geo, SET = CP.setup, TR = CP.truth;
const fails = [];
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };
const f2 = v => Number(v).toFixed(2);

// Hand path from the rig's solve (RIG.md section 9, with PLAYER.md section 13): grip x is linear in the path place
// s = pace(PACE, p), and p follows the minimum-jerk timing (UPGRADE-BRIEF.md). Only used to predict key positions.
const minJerk = x => x * x * x * (10 + x * (-15 + 6 * x));
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
const pace = (w, p) => { const n = w.length, tot = w.reduce((a, b) => a + b, 0); let c = 0, s = 0; for (let k = 1; k <= n; k++) { c += w[k - 1] / tot; s += c * binom(n, k) * p ** k * (1 - p) ** (n - k); } return s; };
const pOf = u => pace(SET.PACE, u <= 0.25 ? minJerk(u / 0.25) : u <= 0.375 ? 1 : u <= 0.875 ? 1 - minJerk((u - 0.375) / 0.5) : 0);
const gripAt = u => { const x = SET.X0 + (SET.X1 - SET.X0) * pOf(u); return [x, SET.P[1] + Math.sqrt(SET.R ** 2 - (x - SET.P[0]) ** 2)]; };
const X0 = SET.X0, X1 = SET.X1;

(async () => {
  const browser = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const errors = [];
  const open = async (query, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: 2, reducedMotion: opts.rm ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${query}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${query}: ${m.text()}`); });
    await page.goto('file://' + path.join(DIR, 'index.html') + query);
    await page.waitForTimeout(opts.wait || 400);
    return { page, ctx };
  };
  const shot = async (page, name) => { await (await page.$('.player')).screenshot({ path: path.join(OUT, name) }); };
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  // 1. Required screenshots ------------------------------------------------------------------
  for (let i = 0; i < 8; i++) { const t = i / 8; const { page, ctx } = await open(`?t=${t}`); await shot(page, `cp_dark_t${t.toFixed(3)}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?theme=paper&t=0.5'); await shot(page, 'cp_paper_t0.500.png'); await ctx.close(); }
  for (const [z, t] of [[1, 0], [1, 0.125], [2, 0.25], [2, 0.625], [3, 0], [3, 0.125], [3, 0.25], [3, 0.625]]) { const { page, ctx } = await open(`?zoom=${z}&t=${t}`, { wait: 700 }); await shot(page, `cp_zoom-${z}_t${t}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures'); await shot(page, 'cp_pictures.png'); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures&theme=paper'); await shot(page, 'cp_pictures_paper.png'); await ctx.close(); }
  for (const z of [1, 2, 3]) { const { page, ctx } = await open(`?mode=pictures&zoom=${z}`, { wait: 700 }); await shot(page, `cp_pictures-still-zoom-${z}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?theme=paper&t=0'); await shot(page, 'cp_paper_t0.000.png'); await ctx.close(); }
  { const { page, ctx } = await open('', { rm: true }); await shot(page, 'cp_reduced-motion.png'); await ctx.close(); }
  for (const th of ['ember', 'emerald', 'midnight']) { const { page, ctx } = await open(`?theme=${th}&t=0.125`); await shot(page, `cp_${th}_t0.125.png`); await ctx.close(); }

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

  // 3. Movement: hand on handle, shoulder fixed, key positions, stage bounds ------------------
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(async (g) => {
      const svg = document.querySelector('.scene');
      const at = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(el.getCTM()); return [q.x, q.y]; };
      const hand = document.querySelector('.arm-near .cp-hd'), lever = document.querySelector('.lever-near'), ua = document.querySelector('.arm-near');
      let gap = 0, sh = 0; const keys = {};
      for (let i = 0; i <= 200; i++) {
        window.__rig.freeze(i / 200);
        await new Promise(res => requestAnimationFrame(res));
        const h = at(hand, 0, 16), l = at(lever, g.P[0], g.P[1] + g.R), s = at(ua, 0, -62);
        gap = Math.max(gap, Math.hypot(h[0] - l[0], h[1] - l[1]));
        sh = Math.max(sh, Math.hypot(s[0] - g.shoulder[0], s[1] - g.shoulder[1]));
        if (i % 25 === 0) keys[i / 200] = h;
      }
      return { gap, sh, keys };
    }, geo);
    check(r.gap < 0.5, `hand stays on the handle over 201 phases (worst gap ${r.gap.toFixed(3)} units, limit 0.5)`);
    check(r.sh < 0.01, `shoulder joint fixed over the rep (drift ${r.sh.toFixed(4)})`);
    let worst = 0; const rows = [];
    for (const [t, h] of Object.entries(r.keys)) { const w = gripAt(+t); worst = Math.max(worst, Math.hypot(h[0] - w[0], h[1] - w[1])); rows.push(`${t}:(${f2(h[0])},${f2(h[1])})`); }
    check(worst < 0.3, `grip follows the rig's timed hand path at t 0..1 step 0.125 (worst ${worst.toFixed(3)}): ${rows.join(' ')}`);
    const k = r.keys;
    check(Math.abs(k[0][0] - X0) < 0.2 && Math.abs(k[0.25][0] - X1) < 0.2 && Math.abs(k[0.375][0] - X1) < 0.2 && Math.abs(k[0.875][0] - X0) < 0.2 && Math.abs(k[1][0] - X0) < 0.2,
      `tempo: setup at 0, pressed at 25 % and still pressed at 37.5 %, back at 87.5 % and 100 %`);
    const out = await page.evaluate(async () => {
      const box = document.querySelector('.stage').getBoundingClientRect(); const bad = [];
      for (let i = 0; i <= 16; i++) {
        window.__rig.freeze(i / 16); await new Promise(res => requestAnimationFrame(res));
        document.querySelectorAll('#rig-cp > g, #rig-cp > path').forEach(el => { const b = el.getBoundingClientRect(); if (b.width && (b.left < box.left - 0.5 || b.right > box.right + 0.5 || b.top < box.top - 0.5 || b.bottom > box.bottom + 0.5)) bad.push(i / 16 + ':' + el.getAttribute('class')); });
      }
      return bad;
    });
    check(out.length === 0, `every scene group inside the stage at 17 phases ${out.join(' ')}`);
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
    check(caps.every(c => c === 'ok'), `phase captions: Press out at 10 %, Pause at 30 %, Back slowly at 60 %, Reset at 95 % (${caps.join(' ')})`);
    await ctx.close();
  }

  // 3b. Truth table (spec 3.1): numbers from the solve, then the drawn elbow in the browser ----------
  {
    const change = TR.endForward - TR.startForward;
    check(TR.startInside >= 80 && TR.startInside <= 95 && TR.endInside >= 155 && TR.endInside <= 168, `elbow inside angle about 90 at setup (${f2(TR.startInside)}) and 155-168 pressed, no lockout (${f2(TR.endInside)})`);
    check(TR.startOut >= 45 && TR.startOut <= 60, `setup arm out from the side 45-60 degrees (${f2(TR.startOut)})`);
    check(TR.startForward <= -10 && TR.startForward >= -18, `setup elbows a little behind the body: arm forward angle -18 to -10 (${f2(TR.startForward)})`);
    check(TR.endForward >= 75 && TR.endForward <= 85, `pressed arm about 80 degrees forward (${f2(TR.endForward)})`);
    check(change >= 88 && change <= 100, `shoulder travel about 95 degrees (${f2(change)} = ${f2(TR.startForward)} to ${f2(TR.endForward)})`);
    check(TR.minFu >= 0.55, `upper arm never drawn shorter than 0.55 of its length (min ${TR.minFu.toFixed(3)})`);
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(async (g) => {
      const svg = document.querySelector('.scene');
      const at = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(el.getCTM()); return [q.x, q.y]; };
      const st = document.querySelector('.stage').getBoundingClientRect();
      const pad = document.querySelector('.machine-front rect[x="124.5"]').getBoundingClientRect();
      let gap = 1e9; const elbows = [];
      for (let i = 0; i <= 40; i++) {
        window.__rig.freeze(i / 40); await new Promise(res => requestAnimationFrame(res));
        // exact: every outline-polygon point through its own transform (client boxes of rotated shapes are loose)
        document.querySelectorAll('.arm-near polygon.olk').forEach(el => { const m = el.getScreenCTM(); for (const pt of el.points) gap = Math.min(gap, pt.x * m.a + pt.y * m.c + m.e - pad.right); });
        if (i === 0) elbows.push(at(document.querySelector('.arm-near .cp-fa'), 0, -24));
      }
      const shin = document.querySelector('.figure polygon.olk[points^="-5.5,49"]').getBoundingClientRect();
      const seat = document.querySelector('.ov-seat').getBoundingClientRect();
      return { gap, elbow: elbows[0], seatRight: seat.right - st.left, shinLeft: shin.left - st.left, ovSeat: document.querySelectorAll('.ov-seat').length };
    }, geo);
    check(Math.hypot(r.elbow[0] - SET.E0[0], r.elbow[1] - SET.E0[1]) < 0.3 && r.elbow[0] <= geo.shoulder[0] - 4, `drawn setup elbow at (${f2(r.elbow[0])}, ${f2(r.elbow[1])}), ${f2(geo.shoulder[0] - r.elbow[0])} units behind the shoulder (at least 4)`);
    check(r.gap >= 2.05, `arm stays off the back pad over 41 phases: arm shape at least 2.05 from the pad, so the 1.5 arm outline and the 0.55 pad stroke never touch (closest ${f2(r.gap)})`);
    check(r.ovSeat === 1 && r.seatRight <= r.shinLeft - 1, `seat outline is the pad only and stops before the near shin (outline right ${f2(r.seatRight)}, shin left ${f2(r.shinLeft)})`);
    const tip = await page.evaluate(() => document.querySelector('.bub-2').textContent.trim());
    check(!/straight/i.test(tip), `Path tip does not promise a straight line; the lever arc dips a little ("${tip}")`);
    await ctx.close();
  }

  // 3c. Round 3: what a side camera really shows (QA round 3) ----------------------------------
  // The pause must LOOK bent from the side, not only in 3D: the drawn elbow (shoulder, elbow, grip
  // as painted) sits at least 3.9 below the shoulder-to-grip line, drawn angle 155-169 (a straight
  // arm reads as a lockout, the mistake the guide warns about).
  {
    const { page, ctx } = await open('?t=0.3');
    const r = await page.evaluate(async () => {
      const svg = document.querySelector('.scene');
      const at = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(el.getCTM()); return [q.x, q.y]; };
      const out = [];
      for (const t of [0.25, 0.3, 0.375]) {
        window.__rig.freeze(t); await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
        const S = at(document.querySelector('.arm-near'), 0, -62), E = at(document.querySelector('.arm-near .cp-fa'), 0, -24), G = at(document.querySelector('.arm-near .cp-hd'), 0, 16);
        const u = [S[0] - E[0], S[1] - E[1]], v = [G[0] - E[0], G[1] - E[1]];
        const ang = Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI;
        const L = Math.hypot(G[0] - S[0], G[1] - S[1]), h = ((G[0] - S[0]) * (E[1] - S[1]) - (G[1] - S[1]) * (E[0] - S[0])) / L;
        out.push({ t, ang, h });
      }
      return out;
    });
    check(r.every(q => q.ang >= 155 && q.ang <= 169 && q.h >= 3.9), `pause looks bent from the side, not locked: drawn elbow angle 155-169 and elbow at least 3.9 below the shoulder-to-grip line (${r.map(q => `t ${q.t}: ${f2(q.ang)} deg, ${f2(q.h)} below`).join('; ')})`);
    await ctx.close();
  }
  // Pictures tile 1: no cut-off stack bracket or cable stub at its top edge (QA round 3). The corner
  // above the top plate where the bracket sits (scene x 44-57, y 106-111, clear of the tile's round
  // corner) must show only the
  // tile background (badge hidden while probing, so only the drawing counts). Control: the same corner with the bracket forced back on must NOT be plain, so
  // the probe really looks where the bracket is. Also: the whole figure, head to floor, is in the tile.
  {
    const { page, ctx } = await open('?mode=pictures');
    const geoT = await page.evaluate(() => {
      const svg = document.querySelector('.tile svg'), vb = svg.viewBox.baseVal, b = svg.getBoundingClientRect();
      const k = Math.min(b.width / vb.width, b.height / vb.height);                    // 'meet', xMidYMid
      const x0 = vb.x + vb.width / 2 - b.width / k / 2, y0 = vb.y + vb.height / 2 - b.height / k / 2;
      const fig = document.querySelector('.figure'), fb = fig.getBBox(), m = fig.transform.baseVal.consolidate().matrix;
      return { clip: { x: b.left + (44 - x0) * k, y: b.top + (106 - y0) * k, width: 13 * k, height: 5 * k }, top: y0, bottom: y0 + b.height / k, head: fb.y + m.f, floor: document.querySelector('.floor').y1.baseVal.value };
    });
    const plain = async () => {
      const b64 = (await page.screenshot({ clip: geoT.clip })).toString('base64');
      return page.evaluate(async (src) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + src; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data, count = {};
        for (let i = 0; i < d.length; i += 4) { const key = d[i] + ',' + d[i + 1] + ',' + d[i + 2]; count[key] = (count[key] || 0) + 1; }
        const bg = Object.keys(count).sort((a, b) => count[b] - count[a])[0].split(',').map(Number);   // the plain background
        let off = 0;
        for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 12) off++;
        return off;
      }, b64);
    };
    await page.evaluate(() => document.querySelectorAll('.tile .badge').forEach(el => { el.style.visibility = 'hidden'; }));  // look at the drawing itself
    const offNow = await plain();
    await page.evaluate(() => document.querySelector('.tile use').style.setProperty('--stack-top', '1'));
    const offForced = await plain();
    check(offNow === 0 && offForced > 0, `Pictures tile 1: no cut-off stack bracket or cable at its top edge (corner pixels off the background: ${offNow}; with the bracket forced on: ${offForced})`);
    check(geoT.head >= geoT.top + 1 && geoT.floor + 1 <= geoT.bottom, `Pictures tiles show the whole figure: head top ${f2(geoT.head)} inside the tile top ${f2(geoT.top)}, floor ${f2(geoT.floor)} inside the tile bottom ${f2(geoT.bottom)}`);
    await ctx.close();
  }

  // 4. Bounded 3 reps, real end, Replay through the -b set, speed ---------------------------
  {
    const { page, ctx } = await open('');
    let r = await page.evaluate(() => { const ua = getComputedStyle(document.querySelector('.cp-ua')); return { it: ua.animationIterationCount, rep: getComputedStyle(document.querySelector('.r1')).animationIterationCount, cap: getComputedStyle(document.querySelector('.c1')).animationIterationCount, name: ua.animationName, play: ua.animationPlayState, dur: ua.animationDuration, delay: ua.animationDelay }; });
    check(r.it === '3' && r.cap === '3' && r.rep === '1' && r.name === 'cp-ua-a' && r.play === 'running' && r.dur === '4s' && r.delay === '0s', `default harness: 3 reps (figure ${r.it}, captions ${r.cap}, rep pill ${r.rep} cycle), ${r.name}, ${r.play}, --dur ${r.dur}, --delay ${r.delay}`);
    await page.waitForTimeout(12400);
    r = await page.evaluate(() => ({ label: document.querySelector('.btn-icon').getAttribute('aria-label'), ended: !document.querySelector('[data-if="showEnded"]').hidden, states: document.getAnimations().filter(a => a.animationName && a.animationName.startsWith('cp-')).map(a => Math.round(a.currentTime)) }));
    // The 200 ms timer may stop the set a few ms before the CSS end; the last 0.5 s of a rep (11.5-12 s) is the still reset pose.
    check(r.label === 'Replay' && r.ended && r.states.length > 0 && r.states.every(t => t >= 11500 && t <= 12000), `after 12 s: every animation stopped in the reset window of rep 3 (${[...new Set(r.states)].join(',')} ms of 11500-12000) , button says ${r.label}, ended text shown`);
    const endPose = await page.evaluate(() => { const svg = document.querySelector('.scene'); const p = svg.createSVGPoint(); p.x = 0; p.y = 16; const q = p.matrixTransform(document.querySelector('.arm-near .cp-hd').getCTM()); return [q.x, q.y]; });
    check(Math.abs(endPose[0] - X0) < 0.2, `after 3 reps the setup pose holds (grip x ${f2(endPose[0])})`);
    await page.click('.btn-icon');
    r = await page.evaluate(() => ({ cls: document.querySelector('.player').className, name: getComputedStyle(document.querySelector('.cp-ua')).animationName, cap: getComputedStyle(document.querySelector('.c1')).animationName, play: getComputedStyle(document.querySelector('.cp-ua')).animationPlayState, label: document.querySelector('.btn-icon').getAttribute('aria-label') }));
    check(/gen-b/.test(r.cls) && r.name === 'cp-ua-b' && r.cap === 'cap1-b' && r.play === 'running' && r.label === 'Pause', `Replay restarts through the -b set (${r.name}, ${r.cap}, ${r.play}, button ${r.label})`);
    await page.click('.speed button:nth-child(2)');
    r = await page.evaluate(() => ({ dur: getComputedStyle(document.querySelector('.cp-ua')).animationDuration, name: getComputedStyle(document.querySelector('.cp-ua')).animationName, slow: !document.querySelector('.pill-accent').hidden }));
    check(r.dur === '8s' && r.name === 'cp-ua-a' && r.slow, `0.5x: 8 s rep, restarted from setup (${r.name}), Slow motion pill shown`);
    await page.click('.btn-icon');
    r = await page.evaluate(() => ({ play: getComputedStyle(document.querySelector('.cp-ua')).animationPlayState, label: document.querySelector('.btn-icon').getAttribute('aria-label') }));
    check(r.play === 'paused' && r.label === 'Play', `Pause holds the frame (${r.play}, button ${r.label})`);
    await ctx.close();
  }
  { const { page, ctx } = await open('?loop=1'); const r = await page.evaluate(() => [getComputedStyle(document.querySelector('.cp-ua')).animationIterationCount, getComputedStyle(document.querySelector('.r1')).animationIterationCount]); check(r[0] === 'infinite' && r[1] === 'infinite', `?loop=1: figure and rep pill repeat (${r})`); await ctx.close(); }
  {
    const { page, ctx } = await open('?autoplay=0');
    const r = await page.evaluate(() => ({ play: getComputedStyle(document.querySelector('.cp-ua')).animationPlayState, idle: !document.querySelector('[data-if="showIdle"]').hidden, label: document.querySelector('.btn-icon').getAttribute('aria-label') }));
    check(r.play === 'paused' && r.idle && r.label === 'Play', `autoplay off: setup pose, "Tap Play" line, Play button (${r.play})`);
    await ctx.close();
  }

  // 5. Zoom states as root classes ---------------------------------------------------------
  const CAM = { 1: [206, 157, 2], 2: [204, 160, 1.6], 3: [150, 190, 1.7] };
  // Subject per chip: Grip = the ring on the hand; Path = the dashed hand path; Seat = every seat overlay part plus the
  // near handle (the cue is the handle height against the chest). Nothing highlighted may pass behind the bubble.
  const SUBJECT = { 1: '.ov-grip', 2: '.guide', 3: '.ov-seat, .lever-near .hd' };
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
        ovGrip: getComputedStyle(document.querySelector('.ov-grip')).opacity, ovSeat: getComputedStyle(document.querySelector('.ov-seat')).opacity,
        farLever: getComputedStyle(document.querySelector('.far-lever')).opacity, pressed: [...document.querySelectorAll('.chip')].map(b => b.getAttribute('aria-pressed')).join(','),
        trans: getComputedStyle(document.querySelector('.cam')).transition, out, under, n: n / 41,
      };
    }, { z, sel: SUBJECT[z] });
    const [cx, cy, s] = CAM[z];
    const camOk = Math.abs(r.m[0] - s) < 1e-3 && Math.abs(r.m[1] - s) < 1e-3 && Math.abs(r.m[2] - (179 - s * cx)) < 0.01 && Math.abs(r.m[3] - (138 - s * cy)) < 0.01;
    check(/(^| )zoom-/.test(r.cls) && r.cls.includes('zoom-' + z) && camOk && /transform 0\.32s/.test(r.trans), `zoom-${z}: root class "${r.cls}", camera scale ${s} centred on (${cx}, ${cy}), 320 ms transition`);
    check(r.bubbles.join() === String(z) && !r.pill && !r.label, `zoom-${z}: only bubble ${z} shows; rep pill and camera label hidden`);
    const ovOk = z === 1 ? r.ovGrip === '1' && r.ovSeat === '0' && r.farLever === '0' : z === 3 ? r.ovSeat === '1' && r.ovGrip === '0' && r.farLever === '1' : r.ovGrip === '0' && r.ovSeat === '0' && r.farLever === '1';
    check(ovOk && r.pressed === [1, 2, 3].map(i => String(i === z)).join(','), `zoom-${z}: overlays (grip ${r.ovGrip}, seat ${r.ovSeat}, far lever ${r.farLever}), chip pressed ${r.pressed}`);
    check(r.n > 0 && r.out <= 0.5 && r.under <= 0.5, `zoom-${z}: subject (${r.n} part${r.n > 1 ? 's' : ''}) inside the stage and above the bubble over 41 phases (closest ${(-r.out).toFixed(1)} px from an edge, ${(-r.under).toFixed(1)} px above the bubble)`);
    await ctx.close();
  }
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(() => ({ pill: getComputedStyle(document.querySelector('.pill-row')).display, label: getComputedStyle(document.querySelector('.cam-label')).display, bub: [...document.querySelectorAll('.bubble')].map(b => getComputedStyle(b).display).join(','), m: getComputedStyle(document.querySelector('.cam')).transform }));
    check(r.pill !== 'none' && r.label !== 'none' && r.bub === 'none,none,none' && r.m === 'none', `no zoom: rep pill and camera label shown, no bubble, camera at 1x`);
    // chip click toggles the class on and off (live logic, not the query)
    await page.click('.chip:nth-child(2)'); const on2 = await page.evaluate(() => document.querySelector('.player').className);
    await page.click('.chip:nth-child(2)'); const off2 = await page.evaluate(() => document.querySelector('.player').className);
    check(/zoom-2/.test(on2) && !/zoom-/.test(off2), `tapping Path sets zoom-2, tapping it again clears it ("${on2}" -> "${off2}")`);
    await ctx.close();
  }

  // 6. Pictures mode and stills --------------------------------------------------------------
  {
    const { page, ctx } = await open('?mode=pictures');
    const r = await page.evaluate(() => ({ cls: document.querySelector('.player').className, pics: getComputedStyle(document.querySelector('.pics')).display, play: getComputedStyle(document.querySelector('.cp-ua')).animationPlayState, line: !document.querySelector('[data-if="showPicsLine"]').hidden, hint: !document.querySelector('[data-if="hintPics"]').hidden, caps: [...document.querySelectorAll('.tile p')].map(p => p.textContent) }));
    check(/pictures/.test(r.cls) && r.pics === 'grid' && r.play === 'paused' && r.line && r.hint, `Pictures: root class "${r.cls}", grid shown, stage paused, summary line and hint`);
    check(r.caps.join('|') === 'Setup: handles at mid-chest|Press straight out|Arms almost straight, no lock|Back slowly, 2 s', `Pictures captions: ${r.caps.join(' / ')}`);
    const shotsB64 = [];
    for (const el of await page.$$('.tile svg')) shotsB64.push((await el.screenshot()).toString('base64'));
    check(new Set(shotsB64).size === 4, `Pictures: the 4 tiles show 4 different poses from the one rig`);
    await ctx.close();
  }
  {
    const { page: a, ctx: ca } = await open('?t=0.31');
    const want = await a.evaluate(() => { const svg = document.querySelector('.scene'); const p = svg.createSVGPoint(); p.x = 0; p.y = 16; const q = p.matrixTransform(document.querySelector('.arm-near .cp-hd').getCTM()); return [q.x, q.y]; });
    await ca.close();
    for (const [z, pose] of [[1, 0], [2, 0.31], [3, 0]]) {
      const { page, ctx } = await open(`?mode=pictures&zoom=${z}`, { wait: 700 });
      const r = await page.evaluate(() => { const svg = document.querySelector('.scene'); const p = svg.createSVGPoint(); p.x = 0; p.y = 16; const q = p.matrixTransform(document.querySelector('#rig-cp').getCTM().inverse().multiply(document.querySelector('.arm-near .cp-hd').getCTM())); const line = [...document.querySelectorAll('.cap-row .cap > [data-if]')].filter(el => !el.hidden).map(el => el.textContent); return { h: [q.x, q.y], pics: getComputedStyle(document.querySelector('.pics')).display, bub: getComputedStyle(document.querySelector('.bub-' + new URLSearchParams(location.search).get('zoom'))).display, line }; });
      const target = pose ? want : gripAt(0);
      const wantLine = pose ? 'Arms almost straight, no lock' : 'Setup: handles at mid-chest';
      check(r.pics === 'none' && r.bub === 'flex' && Math.hypot(r.h[0] - target[0], r.h[1] - target[1]) < 0.3 && r.line.length === 1 && r.line[0] === wantLine, `Pictures still zoom-${z}: grid hidden, bubble shown, pose ${pose ? 3 : 1} (grip ${f2(r.h[0])}, ${f2(r.h[1])}), caption line "${r.line.join(' | ')}" (want "${wantLine}")`);
      await ctx.close();
    }
  }

  // 6b. The caption row fits its 358 px width in every state -----------------------------------
  {
    const rows = [];
    for (const q of ['?t=0.1', '?t=0.3', '?t=0.6', '?t=0.95', '?mode=pictures', '?mode=pictures&zoom=1', '?mode=pictures&zoom=2', '?mode=pictures&zoom=3']) {
      const { page, ctx } = await open(q);
      const r = await page.evaluate(() => { const row = document.querySelector('.cap-row'); const tempo = document.querySelector('.tempo'); return { over: row.scrollWidth - row.clientWidth, tempo: !!tempo && !tempo.closest('[hidden]') && !tempo.hidden }; });
      rows.push({ q, ...r }); await ctx.close();
    }
    check(rows.every(r => r.over <= 0), `caption row fits 358 px in every state (${rows.map(r => r.q + ':' + r.over).join(' ')})`);
    check(rows.filter(r => r.q.includes('pictures')).every(r => !r.tempo) && rows.filter(r => !r.q.includes('pictures')).every(r => r.tempo), `tempo note in Animation only, never in Pictures (grid or still)`);
  }

  // 7. Reduced motion -------------------------------------------------------------------------
  {
    const { page, ctx } = await open('', { rm: true });
    const r = await page.evaluate(() => ({ fig: getComputedStyle(document.querySelector('.cp-ua')).animationPlayState, cap: getComputedStyle(document.querySelector('.c1')).animationPlayState, pics: getComputedStyle(document.querySelector('.pics')).display, hint: !document.querySelector('[data-if="hintRm"]').hidden, anim: document.querySelector('.mode button').disabled, play: document.querySelector('.btn-icon').disabled }));
    check(r.fig === 'paused' && r.cap === 'paused' && r.pics === 'grid' && r.hint && r.anim && r.play, `reduced motion: paused, key poses shown, hint says why, Play and Animation disabled`);
    const forced = await page.evaluate(() => { const el = document.querySelector('.player'); el.style.setProperty('--play', 'running'); el.className = 'player gen-a'; return [getComputedStyle(document.querySelector('.cp-ua')).animationPlayState, getComputedStyle(document.querySelector('.pics')).display]; });
    check(forced[0] === 'paused' && forced[1] === 'grid', `reduced motion: stays paused and shows the key poses even when the root says running and not pictures (${forced})`);
    await page.click('.chip:nth-child(3)');
    const still = await page.evaluate(() => ({ pics: getComputedStyle(document.querySelector('.pics')).display, trans: getComputedStyle(document.querySelector('.cam')).transitionDuration }));
    check(still.pics === 'none' && still.trans === '0s', `reduced motion: a zoom chip opens a still with no camera glide (${still.trans})`);
    await ctx.close();
  }

  // smoothness (UPGRADE-BRIEF.md target 4): every joint angle and the grip at 120 samples per second, plus the keyframe stops
  { const { smoothCheck } = require('../smooth-check.cjs'); const { page, ctx } = await open('?t=0'); await smoothCheck(page, { label: 'chest press', grips: [{ name: 'hand', sel: '.arm-near .cp-hd', x: 0, y: 16 }] }, check); await ctx.close(); }
  check(errors.length === 0, `no page errors (${errors.length}) ${errors.slice(0, 3).join(' | ')}`);
  await browser.close();
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL CHECKS PASSED');
  fs.writeFileSync(path.join(DIR, 'checks.txt'), fails.length ? 'FAILED:\n' + fails.join('\n') + '\n' : 'ALL CHECKS PASSED\n');
  process.exit(fails.length ? 1 : 0);
})();
