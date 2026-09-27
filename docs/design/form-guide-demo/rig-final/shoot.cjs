// shoot.cjs: every check for the final rig, plus the screenshots in shots/.
// Run after `node gen.mjs`:  node shoot.cjs      (exit code 1 when any check fails)
const { chromium } = require('/home/user/M-arc/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname, OUT = path.join(DIR, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const poses = JSON.parse(fs.readFileSync(path.join(DIR, 'poses.json'), 'utf8'));
const fails = [];
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };
const f1 = v => Number(v).toFixed(1);

// ---- 1. Biomechanics truth table (spec 3.1 and 3.5), from the solved poses -------------
const T = poses.chestPress.truth;
check(T.startInside >= 75, `chest press: setup elbow inside angle ${f1(T.startInside)} >= 75 (spec about 90)`);
check(T.endInside >= 155 && T.endInside <= 168, `chest press: pressed elbow inside angle ${f1(T.endInside)} within 155-168 (spec 160-165, no lockout)`);
check(T.startOut >= 45 && T.startOut <= 60, `chest press: setup arm out from side ${f1(T.startOut)} within 45-60`);
check(T.endForward >= 70 && T.endForward <= 90, `chest press: pressed arm forward ${f1(T.endForward)} within 70-90 (spec about 80)`);
check(T.startElbowX >= 145 && T.startElbowX <= 149.5, `chest press: setup elbow x ${f1(T.startElbowX)} within 145-149.5 (off the back pad, a little behind the shoulder)`);
check(T.minFu >= 0.55, `chest press: upper arm drawn length fu never below 0.55 (min ${T.minFu.toFixed(3)})`);
const gz = poses.chestPress.series.gz;
check(gz.every((v, i) => i === 0 || v < gz[i - 1]), `chest press: sideways hand path moves steadily inward (${f1(gz[0])} -> ${f1(gz[gz.length - 1])}, strictly decreasing over 101 steps)`);
check(poses.chestPress.maxDrift < 0.5, `chest press: analytic hand-to-handle gap between samples ${poses.chestPress.maxDrift.toFixed(3)} < 0.5`);
const L = poses.lateralRaise.truth;
check(L.startA >= 10 && L.startA <= 15 && L.endA >= 85 && L.endA <= 90, `lateral raise: arm out from side ${L.startA} -> ${L.endA} (spec 10-15 -> 85-90)`);
check(L.topGripY >= L.shoulderY, `lateral raise: hands never above shoulder height (top grip y ${f1(L.topGripY)} >= ${L.shoulderY})`);

for (const c of poses.contrast) check(c.line >= 3 && c.lineBody >= 3 && c.frame >= 3 && c.metal >= 3 && c.cable >= 3, `${c.id}: figure outline ${c.line.toFixed(2)} on stage and ${c.lineBody.toFixed(2)} over the body, frame ${c.frame.toFixed(2)}, metal ${c.metal.toFixed(2)}, cable ${c.cable.toFixed(2)} (all >= 3)`);

// ---- 2. Browser checks and screenshots -------------------------------------------------
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const errors = [];
  const open = async (file, query, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: opts.scale || 2, reducedMotion: opts.rm ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${file}${query}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${file}${query}: ${m.text()}`); });
    await page.goto('file://' + path.join(DIR, file) + query);
    await page.waitForTimeout(opts.wait || 350);
    return { page, ctx };
  };
  const shot = async (page, name) => { await (await page.$('.player')).screenshot({ path: path.join(OUT, name) }); };
  const EX = [
    { id: 'cp', file: 'chest-press.html', chips: ['grip', 'path', 'seat'], ua: '.cp-ua' },
    { id: 'lr', file: 'lateral-raise.html', chips: ['shoulders', 'path', 'elbows'], ua: '.lr-ua-r' },
  ];

  // 2a. required matrix: t = 0, 0.25, 0.5, 0.75 in dark (silent-black) and paper
  for (const ex of EX) for (const theme of ['silent-black', 'paper']) for (const t of [0, 0.25, 0.5, 0.75]) {
    const { page, ctx } = await open(ex.file, `?theme=${theme}&t=${t}`);
    await shot(page, `${ex.id}_${theme}_t${t}.png`);
    await ctx.close();
  }
  // 2b. chest press setup frames the design review asked to re-shoot
  for (const t of [0, 0.05, 0.1, 0.125]) { const { page, ctx } = await open('chest-press.html', `?t=${t}`); await shot(page, `cp_setup_t${t}.png`); await ctx.close(); }
  // 2c. zoom chips (caption bubble, overlays), Pictures grid, three other themes
  for (const ex of EX) {
    for (const z of ex.chips) { const { page, ctx } = await open(ex.file, `?t=0.125&zoom=${z}`, { wait: 600 }); await shot(page, `${ex.id}_zoom-${z}.png`); await ctx.close(); }
    for (const theme of ['silent-black', 'paper']) { const { page, ctx } = await open(ex.file, `?mode=pics&theme=${theme}`); await shot(page, `${ex.id}_pictures_${theme}.png`); await ctx.close(); }
    { const { page, ctx } = await open(ex.file, `?mode=pics&zoom=path`, { wait: 600 }); await shot(page, `${ex.id}_pictures-still-path.png`); await ctx.close(); }
    for (const theme of ['ember', 'emerald', 'midnight']) { const { page, ctx } = await open(ex.file, `?theme=${theme}&t=0.125`); await shot(page, `${ex.id}_${theme}_t0.125.png`); await ctx.close(); }
  }
  { const { page, ctx } = await open('chest-press.html', `?t=0.05&zoom=grip&theme=paper`, { wait: 600 }); await shot(page, `cp_zoom-grip_paper.png`); await ctx.close(); }

  // 2d. hand stays on the handle over 200 phases, measured in the browser (no probe elements)
  {
    const { page, ctx } = await open('chest-press.html', '?t=0');
    const r = await page.evaluate(async (g) => {
      const svg = document.querySelector('.scene');
      const at = (el, x, y) => { const m = el.getCTM(), p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; };
      const hand = document.querySelector('.arm-near .cp-hd'), lever = document.querySelector('.lever-near'), ua = document.querySelector('.arm-near');
      let gap = 0, sh = 0;
      for (let i = 0; i <= 200; i++) {
        window.__rig.freeze(i / 200);
        await new Promise(res => requestAnimationFrame(res));
        const h = at(hand, 0, 16), l = at(lever, g.P[0], g.P[1] + g.R), s = at(ua, 0, -62);
        gap = Math.max(gap, Math.hypot(h[0] - l[0], h[1] - l[1]));
        sh = Math.max(sh, Math.hypot(s[0] - g.shoulder[0], s[1] - g.shoulder[1]));
      }
      return { gap, sh };
    }, poses.chestPress.geo);
    check(r.gap < 0.5, `chest press (browser, 201 phases): worst hand-to-handle gap ${r.gap.toFixed(3)} < 0.5`);
    check(r.sh < 0.01, `chest press (browser): shoulder joint drift ${r.sh.toFixed(4)}`);
    // bounds: nothing leaves the stage at the key phases
    const out = await page.evaluate(async () => {
      const box = document.querySelector('.stage').getBoundingClientRect(); let bad = [];
      for (const t of [0, 0.125, 0.25, 0.625]) {
        window.__rig.freeze(t); await new Promise(res => requestAnimationFrame(res));
        document.querySelectorAll('#rig-cp > g, #rig-cp > path').forEach(el => { const b = el.getBoundingClientRect(); if (b.left < box.left - 0.5 || b.right > box.right + 0.5 || b.top < box.top - 0.5 || b.bottom > box.bottom + 0.5) bad.push(t + ':' + el.getAttribute('class')); });
      }
      return bad;
    });
    check(out.length === 0, `chest press: every group inside the stage at t 0, 0.125, 0.25, 0.625 ${out.join(' ')}`);
    await ctx.close();
  }
  {
    const { page, ctx } = await open('lateral-raise.html', '?t=0');
    const r = await page.evaluate(async () => {
      const svg = document.querySelector('.scene');
      const at = (el, x, y) => { const m = el.getCTM(), p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; };
      const fr = document.querySelector('.lr-fa-r'), fl = document.querySelector('.lr-fa-l'), ur = document.querySelector('.arm-r');
      let mirror = 0, sh = 0, above = -1e9;
      for (let i = 0; i <= 200; i++) {
        window.__rig.freeze(i / 200); await new Promise(res => requestAnimationFrame(res));
        const a = at(fr, 22, 16), b = at(fl, -22, 16), s = at(ur, 22, -62);
        mirror = Math.max(mirror, Math.abs((a[0] - 179) + (b[0] - 179)), Math.abs(a[1] - b[1]));
        sh = Math.max(sh, Math.hypot(s[0] - 201, s[1] - 94)); above = Math.max(above, 94 - a[1]);
      }
      return { mirror, sh, above };
    });
    check(r.mirror < 0.01, `lateral raise (browser): left and right hands mirror each other (error ${r.mirror.toFixed(4)})`);
    check(r.sh < 0.01, `lateral raise (browser): shoulders fixed, no shrug (drift ${r.sh.toFixed(4)})`);
    check(r.above <= 0, `lateral raise (browser): grip never above the shoulder line (worst ${r.above.toFixed(2)} above)`);
    await ctx.close();
  }

  // 2e. reduced motion: element-level pause that the root style hole cannot override; Pictures grid shown
  for (const ex of EX) {
    const { page, ctx } = await open(ex.file, '', { rm: true });
    const r = await page.evaluate((sel) => ({
      rootPlay: getComputedStyle(document.querySelector('.player')).getPropertyValue('--play').trim(),
      state: getComputedStyle(document.querySelector(sel)).animationPlayState,
      cap: getComputedStyle(document.querySelector('.c1')).animationPlayState,
      pics: getComputedStyle(document.querySelector('.pics')).display,
      hint: document.querySelector('.hint').textContent,
      animDisabled: document.querySelector('.mode button').disabled,
    }), ex.ua);
    check(r.state === 'paused' && r.cap === 'paused', `${ex.id} reduced motion: animations paused (figure ${r.state}, caption ${r.cap})`);
    check(r.pics === 'grid', `${ex.id} reduced motion: Pictures grid shown (${r.pics})`);
    check(/reduce motion/.test(r.hint) && r.animDisabled, `${ex.id} reduced motion: hint says why, Animation button disabled`);
    // force the worst case: the root style says running, the element must stay paused
    const forced = await page.evaluate((sel) => { const el = document.querySelector('.player'); el.style.setProperty('--play', 'running'); return getComputedStyle(document.querySelector(sel)).animationPlayState; }, ex.ua);
    check(forced === 'paused', `${ex.id} reduced motion: stays paused even when the root style hole says running (${forced})`);
    await shot(page, `${ex.id}_reduced-motion.png`);
    await ctx.close();
  }

  // 2f. loop on/off, Replay restart with the -a/-b sets, speed change
  for (const ex of EX) {
    let { page, ctx } = await open(ex.file, '?loop=1');
    let r = await page.evaluate((sel) => ({ fig: getComputedStyle(document.querySelector(sel)).animationIterationCount, rep: getComputedStyle(document.querySelector('.r1')).animationIterationCount, cap: getComputedStyle(document.querySelector('.c1')).animationIterationCount }), ex.ua);
    check(r.fig === 'infinite' && r.cap === 'infinite' && r.rep === 'infinite', `${ex.id} loop on: figure, captions and rep pill repeat (${r.fig}, ${r.cap}, ${r.rep})`);
    await ctx.close();
    ({ page, ctx } = await open(ex.file, '?loop=0'));
    r = await page.evaluate((sel) => ({ fig: getComputedStyle(document.querySelector(sel)).animationIterationCount, rep: getComputedStyle(document.querySelector('.r1')).animationIterationCount, name: getComputedStyle(document.querySelector(sel)).animationName }), ex.ua);
    check(r.fig === '3' && r.rep === '1' && /-a$/.test(r.name), `${ex.id} loop off: 3 reps, rep pill once, keyframe set -a (${r.fig}, ${r.rep}, ${r.name})`);
    await page.evaluate(() => { window.__rig.stopClock(); window.__rig.setState({ playing: false, ended: true }); });
    const label = await page.getAttribute('.btn-icon', 'aria-label');
    const endedText = await page.evaluate(() => !document.querySelector('[data-if="showEnded"]').hidden);
    await page.click('.btn-icon');
    r = await page.evaluate((sel) => ({ cls: document.querySelector('.player').className, name: getComputedStyle(document.querySelector(sel)).animationName, play: getComputedStyle(document.querySelector(sel)).animationPlayState, label: document.querySelector('.btn-icon').getAttribute('aria-label') }), ex.ua);
    check(label === 'Replay' && endedText && /gen-b/.test(r.cls) && /-b$/.test(r.name) && r.play === 'running' && r.label === 'Pause', `${ex.id} Replay: ended state, then restart through keyframe set -b (${label} -> ${r.name}, ${r.play})`);
    await page.click('.speed button:nth-child(2)');
    r = await page.evaluate((sel) => ({ dur: getComputedStyle(document.querySelector(sel)).animationDuration, name: getComputedStyle(document.querySelector(sel)).animationName, slow: !document.querySelector('.pill-accent').hidden }), ex.ua);
    check(r.dur === '8s' && /-a$/.test(r.name) && r.slow, `${ex.id} 0.5x: 8 s rep, restarted from setup (${r.name}), Slow motion pill shown`);
    await ctx.close();
  }

  // 2f2. zoom views: only the scene and its bubble. The rep pill and camera label hide, and each chip's
  // subject stays inside the stage and above the bubble for the whole rep (41 phases).
  const SUBJECT = { grip: '.ov-grip', path: '.guide', seat: '.ov-seat:first-of-type', shoulders: '.ov-shoulders', elbows: '.ov-elbows' };
  for (const ex of EX) for (const z of ex.chips) {
    const { page, ctx } = await open(ex.file, `?t=0&zoom=${z}`, { wait: 600 });
    const r = await page.evaluate(async (sel) => {
      const vis = q => { const el = document.querySelector(q); return !!el && !el.hidden && getComputedStyle(el).display !== 'none'; };
      const st = document.querySelector('.stage').getBoundingClientRect(), bu = document.querySelector('.bubble').getBoundingClientRect();
      let worst = { out: -1e9, under: -1e9 }, n = 0;
      for (let i = 0; i <= 40; i++) {
        window.__rig.freeze(i / 40); await new Promise(res => requestAnimationFrame(res));
        document.querySelectorAll(sel).forEach(el => {
          if (el.closest('.pics')) return;
          n++;
          const b = el.getBoundingClientRect();
          worst.out = Math.max(worst.out, st.left - b.left, b.right - st.right, st.top - b.top);
          worst.under = Math.max(worst.under, b.bottom - bu.top);
        });
      }
      return { pill: vis('.pill-row'), label: vis('.cam-label'), bubble: vis('.bubble'), worst, n: n / 41 };
    }, SUBJECT[z]);
    check(!r.pill && !r.label && r.bubble, `${ex.id} zoom ${z}: rep pill and camera label hidden, bubble shown (pill ${r.pill}, label ${r.label})`);
    check(r.n > 0 && r.worst.out <= 0.5 && r.worst.under <= 0.5, `${ex.id} zoom ${z}: the chip's subject (${r.n} part${r.n > 1 ? 's' : ''}) stays inside the stage and above the bubble over the rep (closest: ${(-r.worst.out).toFixed(1)} px from a stage edge, ${(-r.worst.under).toFixed(1)} px above the bubble)`);
    await ctx.close();
  }
  { const { page, ctx } = await open('chest-press.html', '?t=0');
    const r = await page.evaluate(() => ({ pill: !document.querySelector('.pill-row').hidden, label: !document.querySelector('.cam-label').hidden }));
    check(r.pill && r.label, `chest press, no zoom: rep pill and camera label shown (${r.pill}, ${r.label})`);
    await ctx.close(); }
  for (const [file, q, name] of [['lateral-raise.html', '?t=0.75&zoom=elbows', 'lr_zoom-elbows_t0.75.png'], ['lateral-raise.html', '?t=0.25&zoom=elbows&theme=paper', 'lr_zoom-elbows_t0.25_paper.png'], ['chest-press.html', '?t=0.25&zoom=seat', 'cp_zoom-seat_t0.25.png'], ['lateral-raise.html', '?mode=pics&zoom=elbows', 'lr_pictures-still-elbows.png']]) {
    const { page, ctx } = await open(file, q, { wait: 600 }); await shot(page, name); await ctx.close();
  }

  // 2g. Paper machine outline contrast comes from the root style hole (no data-theme attribute)
  {
    const { page, ctx } = await open('chest-press.html', '?theme=paper&t=0');
    const r = await page.evaluate(() => ({ stroke: getComputedStyle(document.querySelector('.eq')).stroke, bg: getComputedStyle(document.querySelector('.stage')).backgroundColor, attr: document.querySelector('.player').hasAttribute('data-theme') }));
    const rgb = s => { const v = s.match(/[\d.]+/g).map(Number); return /^color\(srgb/.test(s) ? v.slice(0, 3).map(x => x * 255) : v.slice(0, 3); };
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [a, b, d] = c.map(f); return 0.2126 * a + 0.7152 * b + 0.0722 * d; };
    const A = lum(rgb(r.stroke)), B = lum(rgb(r.bg)), ratio = (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
    check(ratio >= 3 && !r.attr, `paper: machine outline ${ratio.toFixed(2)}:1 on the stage (>= 3), set without a data-theme attribute [${r.stroke} on ${r.bg}]`);
    await ctx.close();
  }
  // 2h. Pictures tiles are <use> clones of the one rig: four different poses must render
  {
    const { page, ctx } = await open('chest-press.html', '?mode=pics');
    const sizes = [];
    for (let i = 0; i < 4; i++) { const el = (await page.$$('.tile svg'))[i]; sizes.push((await el.screenshot()).toString('base64')); }
    check(new Set(sizes).size === 4, `chest press Pictures: the 4 tiles render 4 different poses from one rig`);
    await ctx.close();
  }
  { const { page, ctx } = await open('parts.html', '', { scale: 2 }); await page.setViewportSize({ width: 780, height: 900 }); await page.screenshot({ path: path.join(OUT, 'parts-sheet.png'), fullPage: true }); await ctx.close(); }

  check(errors.length === 0, `no page errors (${errors.length}) ${errors.slice(0, 3).join(' | ')}`);
  await browser.close();
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL CHECKS PASSED');
  fs.writeFileSync(path.join(DIR, 'checks.txt'), fails.length ? 'FAILED:\n' + fails.join('\n') + '\n' : 'ALL CHECKS PASSED\n');
  process.exit(fails.length ? 1 : 0);
})();
