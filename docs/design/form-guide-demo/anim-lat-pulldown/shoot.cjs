// shoot.cjs: every check for the Lat Pulldown player, plus the screenshots in shots/.
// Run after `node gen.mjs`:  node shoot.cjs   (exit 1 on any FAIL, 2 on any OPEN, 0 when all pass; writes checks.txt and
// measured.json)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname, OUT = path.join(DIR, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const P = JSON.parse(fs.readFileSync(path.join(DIR, 'poses.json'), 'utf8')).latPulldown;
const lines = [], fails = [], openItems = [];
const check = (ok, msg) => { const l = (ok ? 'PASS ' : 'FAIL ') + msg; console.log(l); lines.push(l); if (!ok) fails.push(msg); };
// OPEN: a spec value this build does not meet and that waits for a recorded decision. It never counts as a pass:
// the summary names it and the exit code is 2 (1 when anything FAILs).
const openCheck = (ok, msg, why) => { const l = (ok ? 'PASS ' : 'OPEN ') + msg + (ok ? '' : ` -- NOT MET: ${why}`); console.log(l); lines.push(l); if (!ok) openItems.push(msg); };
const f1 = v => Number(v).toFixed(1);


// ---- 1. Truth table (spec 3.2), from the solved poses --------------------------------
const T = P.truth, G = P.geo;
check(T.topInside >= 160 && T.topInside <= 175, `top: elbow inside angle ${f1(T.topInside)} within 160-175 (spec about 170, not locked)`);
check(T.topElev >= 160 && T.topElev <= 180, `top: upper arm ${f1(T.topElev)} deg from the torso line (the real joint angle), within 160-180 (spec 3.2: arms overhead, about 170)`);
check(T.topElev2D >= 165, `top: the side view draws the upper arm ${f1(T.topElev2D)} deg from the torso line, so the arms read as overhead (limit 165)`);
const rom = T.topElev - T.endElev;
check(rom >= 130 && rom <= 150, `shoulder range of motion ${f1(rom)} deg (spec about 140; range 130-150)`);
check(T.endElev >= 20 && T.endElev <= 30.5, `end: upper arm ${f1(T.endElev)} deg from the torso line, within 20-30 (spec: elbows down by the sides)`);
check(T.endBehind > 0 && T.endBehind2D > 0 && T.endBehind2D <= 30.5, `end: elbow ${f1(T.endBehind)} behind the shoulder joint; the side view shows the upper arm ${f1(T.endBehind2D)} deg behind the torso line (spec: slightly behind; its key-pose table has 30.5)`);
check(T.endInside >= 30 && T.endInside <= 45, `end: elbow inside angle ${f1(T.endInside)} within 30-45 (spec 3.2 truth table: about 35, 30-45; decision D1: hands a little wider than the shoulders and arms overhead at the top leave the elbow about 35 at the chest)`);
check(Math.abs(G.Y1 - 150) < 0.01 && G.Y0 > 60 && G.Y0 < 72 && Math.abs(T.liftEnd - 0.5 * P.cableTravel) < 0.01 && Math.abs(G.PF.x - G.C0[0]) < 0.06, `bar: grip centre from (${f1(G.X0)}, ${f1(G.Y0)}), just above the raised shoulder, down to (${f1(G.X1)}, ${f1(G.Y1)}) at the top of the chest; stack lift 0 to ${f1(T.liftEnd)}, half the ${f1(P.cableTravel)} the cable pays out; front pulley at x ${G.PF.x}, straight above the hook at the top, so the cable hangs straight down between the hands in the setup pose (spec 3.2 anchors and equipment, decision D1)`);
// D2 (QA r3): the Path caption no longer says "straight", because the path curves forward above the head
{
  const cap2 = P.chips[1].caption, pathForward = G.XF - G.X0;
  check(!/straight/i.test(cap2) || pathForward <= 2, `Path caption "${cap2}" is spec 3.2's and does not say "straight": the bar moves ${f1(pathForward)} forward above the head before it passes the face, as the dashed guide shows (decision D2)`);
}
// D3 (QA r3): Grip and Pad close-up targets differ from the spec; Path is back on the spec's own target
{
  const z = G.zooms, same = (a, b) => a.cx === b[0] && a.cy === b[1] && a.s === b[2];
  check(same(z.Z2, [150, 112, 1.4]), `Path close-up target ${z.Z2.cx}, ${z.Z2.cy}, ${z.Z2.s} is the spec's own (150, 112, 1.4): it holds the pulley, the whole path, the face and the chest above the bubble`);
  check(!same(z.Z1, [156, 111, 1.8]) && !same(z.Z3, [192, 200, 2.2]), `close-up targets Grip ${z.Z1.cx}, ${z.Z1.cy}, ${z.Z1.s} and Pad ${z.Z3.cx}, ${z.Z3.cy}, ${z.Z3.s} are spec 3.2's chip table values, not the first draft's Grip 156, 111, 1.8 and Pad 192, 200, 2.2, which cut off the pulley and the far fist at the setup pose and put the feet under the "feet flat" bubble (decision D3; checked in the browser below)`);
}
check(Math.abs(T.tile2.at - 0.125) < 1e-9 && T.tile2.elbowBelowGrip >= 30 && T.tile2.forearmFromVertical <= 15, `tile 2 "Drive your elbows down" at the spec's 12.5 % of the rep: the forearm stands ${f1(T.tile2.forearmFromVertical)} deg from vertical under the bar and the elbow is ${f1(T.tile2.elbowBelowGrip)} below the hand, so the elbow is in view, driving down (limits 15 deg, 30)`);
check(T.minFu >= 0.55, `upper arm drawn length never below 0.55 (min ${T.minFu.toFixed(3)}), so it never looks stubby or points straight at the camera (chest-press rig limit 0.55)`);
// QA r3: the bar lives in the near hand group, so the near hand cannot leave it; between baked samples (at 1/4, 1/2, 3/4
// of every gap) the far fist must stay on the bar's far grip, and the cable's free end must stay inside the hook dot (r 2.4)
check(P.drift.far < 0.5, `analytic far hand to bar's far grip between baked samples ${P.drift.far.toFixed(3)} < 0.5 (the near hand holds the bar in its own group, so its gap is 0)`);
check(P.drift.cable < 2, `analytic cable end to the hook between baked samples ${P.drift.cable.toFixed(3)} < 2 (the hook dot has radius 2.4, so the join never shows)`);
check(P.drift.nearPath < 1, `analytic near hand to the solved path between baked samples ${P.drift.nearPath.toFixed(3)} < 1 (the dashed guide runs through the solved path; the fist is 12 wide)`);
// QA r3: every joint's speed rises once and falls once in the pull and in the return (per keyframe gap, as the CSS plays it)
{
  const SM = P.smoothness, f2 = a => a.map(v => v.toFixed(1)).join(' ');
  const names = { ua: 'upper arm (lp-ua)', fa: 'forearm (lp-fa)', fua: 'far upper arm (lp-fua)', ffa: 'far forearm (lp-ffa)', elbowAngle: 'drawn elbow angle', elbow: 'elbow point', farElbow: 'far elbow point', hand: 'hand' };
  const bad = Object.entries(SM.dips).filter(([k, v]) => v > 0.02).map(([k, v]) => `${names[k]} dip ${(v * 100).toFixed(1)} %`);
  check(bad.length === 0, `smooth motion (analytic, per keyframe gap): every joint speeds up once and slows down once in the pull and in the return; worst dip below a running peak ${(SM.worst * 100).toFixed(2)} % of that phase's top speed (limit 2 %)${bad.length ? ': ' + bad.join('; ') : ''}. Forearm, degrees per 1.25 % of the rep, pull: ${f2(SM.pull.fa)} | return: ${f2(SM.ret.fa)} (QA r2 measured 0.3, 6.0, 19.8, 14.9, 8.6, 8.2, 8.0 at the start of the pull)`);
}
const ins = P.series.inside;
const lastOpen = ins.slice(0, 95).every((v, i) => i === 0 || v <= ins[i - 1] + 1e-9);
const netOpen = ins[100] - Math.min(...ins);
check(lastOpen && netOpen <= 0.3, `elbow closes steadily through the pull (${f1(ins[0])} -> ${f1(ins[100])}); it opens only ${netOpen.toFixed(2)} deg in the last 5 % (limit 0.3)`);
check(Math.abs(G.inset.handsApart / G.inset.shouldersOutside - 1.19) < 0.05, `grip: hands ${G.inset.handsApart} apart, ${(G.inset.handsApart / G.inset.shouldersOutside).toFixed(2)} times the outside shoulder width (${G.inset.shouldersOutside}): "a little wider than your shoulders" (spec 3.2 Grip caption and About step 2)`);

// ---- Figure detail (RIG.md section 20; the same checks as rig-final/shoot.cjs) -------------
// Paints: the outline over the T-shirt and skin facets, the cloth tones against skin and pads, the rim, knurl and seam
// lines, all five themes, computed from the CSS the page uses (gen.mjs contrastTable()).
for (const c of JSON.parse(fs.readFileSync(path.join(DIR, 'poses.json'), 'utf8')).contrast) {
  const facets = [c.lineTeeHi, c.lineTeeLo, c.lineSkin, c.lineSkinHi, c.lineSkinLo];
  check(c.line >= 3 && c.lineBody >= 3 && c.frame >= 3 && c.metal >= 3 && c.cable >= 3 && Math.min(...facets) >= 2 && c.skinTee >= 1.1 && c.shortsSkin >= 1.25 && c.shortsPad >= 1.5 && c.bodyPad >= 1.2 && c.rimLine >= 1.25 && c.knurl >= 1.8 && c.seam >= 1.5,
    `${c.id}: figure outline ${c.line.toFixed(2)} on stage and ${c.lineBody.toFixed(2)} over the body, frame ${c.frame.toFixed(2)}, metal ${c.metal.toFixed(2)}, cable ${c.cable.toFixed(2)} (>= 3); outline over the T-shirt facets ${c.lineTeeHi.toFixed(2)} / ${c.lineTeeLo.toFixed(2)} and skin ${c.lineSkin.toFixed(2)} (light ${c.lineSkinHi.toFixed(2)}, dark ${c.lineSkinLo.toFixed(2)}) (>= 2); skin vs T-shirt ${c.skinTee.toFixed(2)} (>= 1.1), shorts vs skin ${c.shortsSkin.toFixed(2)} (>= 1.25) and vs pads ${c.shortsPad.toFixed(2)} (>= 1.5), T-shirt vs pads ${c.bodyPad.toFixed(2)} (>= 1.2); rim vs outline ${c.rimLine.toFixed(2)} (>= 1.25), knurl ${c.knurl.toFixed(2)} (>= 1.8), seam ${c.seam.toFixed(2)} (>= 1.5)`);
}
// Tokens only (UPGRADE-BRIEF.md, shading): no colour literal in the page CSS (the artboard's <style>, piece A) or the
// player markup. The only literals allowed are the token definitions: THEMES / themeVars() in the script and the root
// style string they produce on .player (stripped before the scan).
{
  const LIT = [/(^|[\s:(,="'])#[0-9a-fA-F]{3,8}(?![\w-])/, /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i, /(?<![\w-])(?:white|black|red|green|blue|gr[ae]y|silver|yellow|orange|purple|navy|teal|maroon|olive|lime|aqua|fuchsia|pink|brown|gold|GrayText|CanvasText|Canvas)(?![\w-])/i];
  const src = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const css = src.slice(src.indexOf('<style>') + 7, src.indexOf('</style>'));
  const markup = src.slice(src.indexOf('<div class="player'), src.indexOf('<p class="harness-note"')).replace(/(<div class="player[^"]*")((?:\s+(?!style=)[\w-]+="[^"]*")*)\s+style="[^"]*"/g, '$1$2');
  const hits = [];
  for (const [where, text] of [['CSS', css], ['markup', markup]]) for (const re of LIT) { const m = text.match(re); if (m) hits.push(`${where}: "${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ')}"`); }
  check(hits.length === 0 && markup.length > 1000, `index.html: no colour literal in the page CSS or the player markup, every paint is a token or a color-mix() of tokens (${hits.length ? hits.join(' | ') : 'CSS ' + css.length + ' chars, markup ' + markup.length + ' chars scanned'})`);
}

(async () => {
  // The harness loads the canvas's Roboto from Google Fonts. Behind a TLS-terminating proxy (a cloud session) Chromium does
  // not trust the proxy CA but Node does (NODE_EXTRA_CA_CERTS), so the font requests are fetched on the Node side, with
  // verification on, as canvas-preview/check.cjs does. Without a proxy Chromium fetches them itself.
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || '';
  const browser = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {}), ...(proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {}) });
  const errors = [];
  const open = async (query, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: opts.scale || 2, reducedMotion: opts.rm ? 'reduce' : 'no-preference' });
    if (proxy) await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async route => route.fulfill({ response: await route.fetch() }));
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      const eff = e => { let o = 1; for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      window.__geomPts = el => {
        const leaves = el.matches('polygon,polyline,path,circle,line,rect') ? [el] : [...el.querySelectorAll('polygon,polyline,path,circle,line,rect')];
        const out = [];
        for (const e of leaves) {
          if (eff(e) === 0) continue;
          const m = e.getScreenCTM(), P = (x, y) => { const q = new DOMPoint(x, y).matrixTransform(m); out.push([q.x, q.y]); }, a = k => +e.getAttribute(k);
          if (e.tagName === 'polygon' || e.tagName === 'polyline') for (const q of e.points) P(q.x, q.y);
          else if (e.tagName === 'circle') for (let k = 0; k < 32; k++) P(a('cx') + a('r') * Math.cos(k * Math.PI / 16), a('cy') + a('r') * Math.sin(k * Math.PI / 16));
          else if (e.tagName === 'line') { P(a('x1'), a('y1')); P(a('x2'), a('y2')); }
          else if (e.tagName === 'rect') { P(a('x'), a('y')); P(a('x') + a('width'), a('y')); P(a('x'), a('y') + a('height')); P(a('x') + a('width'), a('y') + a('height')); }
          else if (e.tagName === 'path') { const L = e.getTotalLength(); for (let k = 0; k <= 48; k++) { const q = e.getPointAtLength(L * k / 48); P(q.x, q.y); } }
        }
        return out;
      };
      window.__geomBox = (el, st) => { const pts = window.__geomPts(el); if (!pts.length) return null; const xs = pts.map(p => p[0] - st.left), ys = pts.map(p => p[1] - st.top); return { left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) }; };
    });
    page.on('pageerror', e => errors.push(`${query}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${query}: ${m.text()}`); });
    await page.goto('file://' + path.join(DIR, 'index.html') + query);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(opts.wait || 400);
    return { page, ctx };
  };
  const shot = async (page, name) => { await (await page.$('.player')).screenshot({ path: path.join(OUT, name) }); };

  // ---- 2. Required screenshots -------------------------------------------------------
  for (let i = 0; i < 8; i++) { const t = i * 0.125; const { page, ctx } = await open(`?t=${t}`); await shot(page, `lp_silent-black_t${t}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?t=0.5&theme=paper'); await shot(page, 'lp_paper_t0.5.png'); await ctx.close(); }
  const Z = [[1, 'grip', 0.125], [2, 'path', 0.19], [3, 'pad', 0.25]];
  for (const [n, id, t] of Z) { const { page, ctx } = await open(`?t=${t}&zoom=${n}`, { wait: 700 }); await shot(page, `lp_zoom-${n}-${id}_t${t}.png`); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures'); await shot(page, 'lp_pictures.png'); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures&theme=paper'); await shot(page, 'lp_pictures_paper.png'); await ctx.close(); }
  { const { page, ctx } = await open('?mode=pictures&zoom=2', { wait: 700 }); await shot(page, 'lp_pictures-still-path.png'); await ctx.close(); }
  { const { page, ctx } = await open('', { rm: true }); await shot(page, 'lp_reduced-motion.png'); await ctx.close(); }
  { const { page, ctx } = await open('?t=0&speed=0.5'); await shot(page, 'lp_slow-motion_t0.png'); await ctx.close(); }
  for (const [n, id] of [[1, 'grip'], [2, 'path']]) { const { page, ctx } = await open(`?t=0.25&zoom=${n}`, { wait: 700 }); await shot(page, `lp_zoom-${n}-${id}_t0.25.png`); await ctx.close(); }
  { const { page, ctx } = await open('?t=0&theme=paper'); await shot(page, 'lp_paper_t0.png'); await ctx.close(); }
  for (const th of ['ember', 'emerald', 'midnight']) { const { page, ctx } = await open(`?t=0.19&theme=${th}`); await shot(page, `lp_${th}_t0.19.png`); await ctx.close(); }

  // ---- 3. Browser checks ---------------------------------------------------------------
  // 3a. hands stay on the bar: the near grip point of the near hand group vs the near grip on the bar, and the far
  // fist's grip point vs the far grip on the bar (QA r2 issue 2: both hands on the bar), 201 phases
  {
    const { page, ctx } = await open('?t=0');
    const gap = await page.evaluate(({ X0, Y0, FG, FS0 }) => {
      const root = document.getElementById('player'), svg = document.querySelector('.scene');
      const hd = document.querySelector('.stage .figure-arm .lp-hd'), bar = document.querySelector('.stage .figure-arm .lp-hd .lp-bar'), fhd = document.querySelector('.stage .far-arm .lp-fhd');
      const map = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(svg.getScreenCTM().inverse().multiply(el.getScreenCTM())); };
      let near = 0, far = 0;
      for (let i = 0; i <= 200; i++) {
        root.style.setProperty('--delay', (-4 * i / 200) + 's');
        const a = map(hd, 0, 16), b = map(bar, 0, 16), c = map(fhd, FS0[0], FS0[1] + 78), d = map(bar, FG[0], 16 + FG[1]);
        near = Math.max(near, Math.hypot(a.x - b.x, a.y - b.y)); far = Math.max(far, Math.hypot(c.x - d.x, c.y - d.y));
      }
      return { near, far };
    }, { FG: G.FAR_GRIP, FS0: G.FS0 });
    const nested = await page.evaluate(() => { const all = [...document.querySelectorAll('#rig-lp .lp-barline')]; return { count: all.length, inHand: all.filter(e => e.closest('.figure-arm .lp-hd .lp-bar')).length }; });
    check(nested.count === 2 && nested.inHand === 2, `the lat bar is inside the near hand group (spec 2.4, RIG section 4: held equipment lives in the hand group, so the grip can never come apart): ${nested.inHand} of ${nested.count} bar layers (the whole bar under the fist, its near end over it) are in the hand group`);
    check(gap.near < 0.05, `near hand on the bar in the browser over 201 phases: worst gap ${gap.near.toFixed(3)} units (limit 0.05: same group)`);
    check(gap.far < 0.5, `far hand on the bar's far grip in the browser over 201 phases: worst gap ${gap.far.toFixed(3)} units (limit 0.5)`);
    // 3b. moving parts stay in the safe area unzoomed (x 16-342, y 40-258)
    const safe = await page.evaluate(() => {
      const root = document.getElementById('player'), stage = document.querySelector('.stage').getBoundingClientRect();
      const sel = ['.stage .figure-arm', '.stage .far-arm', '.stage .lp-bar', '.stage .lp-stack', '.stage .figure', '.stage .trail'];
      let bad = [];
      for (let i = 0; i <= 40; i++) {
        root.style.setProperty('--delay', (-4 * i / 40) + 's');
        for (const s of sel) { const r = window.__geomBox(document.querySelector(s), stage); if (!r) continue; const x0 = r.left, y0 = r.top, x1 = r.right, y1 = r.bottom;
          if (x0 < 16 - 0.5 || x1 > 342 + 0.5 || y0 < 40 - 0.5 || y1 > 258 + 0.5) bad.push(`${s}@${i}: ${x0.toFixed(1)},${y0.toFixed(1)},${x1.toFixed(1)},${y1.toFixed(1)}`); }
      }
      return bad;
    });
    check(safe.length === 0, `figure, both arms, bar, stack and line inside the safe area (x 16-342, y 40-258) at 41 phases${safe.length ? ': ' + safe.slice(0, 3).join('; ') : ''}`);
    // 3b1. the "still to go" line (QA r2 issue 4): it never shows above the hand, and it starts at least 5 below the grip
    const togo = await page.evaluate(() => {
      const root = document.getElementById('player'), path = document.querySelector('.stage .trail'), svg = document.querySelector('.scene');
      const hd = document.querySelector('.stage .figure-arm .lp-hd'), L = path.getTotalLength();
      const map = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(svg.getScreenCTM().inverse().multiply(el.getScreenCTM())); };
      let worst = 1e9, shown = 0;
      for (let i = 0; i <= 40; i++) {
        root.style.setProperty('--delay', (-4 * i / 40) + 's');
        const off = -parseFloat(getComputedStyle(path).strokeDashoffset);
        if (off >= 0.999) continue;
        shown++;
        const a = path.getPointAtLength(off * L), h = map(hd, 0, 16);
        worst = Math.min(worst, a.y - h.y);
      }
      return { worst, shown };
    });
    check(togo.shown > 10 && togo.worst >= 5, `"still to go" line: shown in ${togo.shown} of 41 phases, always starting below the hand (closest start ${f1(togo.worst)} below the grip; limit 5), so nothing solid runs up from the fist next to the cable`);
    await ctx.close();
  }
  // 3b2. keep clear of the pills (QA r1 issues 1-2): at 0.5x both pills show; no scene part (moving or still) may sit
  // under either pill at any of 41 phases, and the Slow motion pill has a solid backing
  {
    const { page, ctx } = await open('?t=0&speed=0.5');
    const r = await page.evaluate(() => {
      const root = document.getElementById('player'), st = document.querySelector('.stage').getBoundingClientRect();
      const box = el => { const b = el.getBoundingClientRect(); return [b.left - st.left, b.top - st.top, b.right - st.left, b.bottom - st.top]; };
      const pills = [...document.querySelectorAll('.pill-row .pill')].filter(e => getComputedStyle(e).display !== 'none' && !e.closest('[hidden]')).map(box);
      const parts = [...document.querySelectorAll('#rig-lp polygon, #rig-lp rect, #rig-lp circle, #rig-lp line, #rig-lp path')].filter(e => !e.closest('.ov'));
      const hits = new Set();
      for (let i = 0; i <= 40; i++) {
        root.style.setProperty('--delay', (-8 * i / 40) + 's');
        for (const e of parts) { const [x0, y0, x1, y1] = box(e); if (x1 - x0 <= 0 && y1 - y0 <= 0) continue;
          for (const [a, b, c, d] of pills) if (x0 - 1 < c && x1 + 1 > a && y0 - 1 < d && y1 + 1 > b) hits.add(`${e.getAttribute('class')}@${i}`); }
      }
      const slow = document.querySelector('.pill-accent'), cs = getComputedStyle(slow);
      const lowest = Math.min(...parts.map(e => box(e)[1]).filter(v => Number.isFinite(v)));
      return { pills: pills.map(p => p.map(v => +v.toFixed(1))), hits: [...hits], bg: cs.backgroundColor, img: cs.backgroundImage, top: lowest };
    });
    const opaque = !/rgba\(.*,\s*0?\.\d+\)$/.test(r.bg) && r.bg !== 'transparent' && /gradient/.test(r.img);
    check(r.pills.length === 2 && r.hits.length === 0, `keep clear: no scene part under the rep pill or the Slow motion pill at 41 phases (pills ${r.pills.map(p => `x ${p[0]}-${p[2]} y ${p[1]}-${p[3]}`).join(', ')}; highest scene part starts at y ${f1(r.top)})${r.hits.length ? ': ' + r.hits.slice(0, 4).join('; ') : ''}`);
    check(opaque, `Slow motion pill has a solid backing (accent tint over ${r.bg})`);
    await ctx.close();
  }
  // 3b3. the whole weight stack (plates, rods, pin, bracket, rear cable and pulley) hides in the Grip and Path close-ups,
  // where it sat cut into slivers on the stage's left edge (QA r1 issue 5, QA r2 issue 6), and shows elsewhere
  {
    const vis = {};
    for (const q of ['?t=0', '?t=0&zoom=1', '?t=0&zoom=2', '?t=0&zoom=3', '?mode=pictures&zoom=1', '?mode=pictures&zoom=2']) {
      const { page, ctx } = await open(q, { wait: 400 });
      vis[q] = await page.evaluate(() => {
        const eff = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity; return +o.toFixed(3); };
        return Math.max(...[...document.querySelectorAll('.stage .lp-stackset rect, .stage .lp-stackset line, .stage .lp-stackset circle')].map(eff));
      });
      await ctx.close();
    }
    check(vis['?t=0'] === 1 && vis['?t=0&zoom=3'] === 1 && vis['?t=0&zoom=1'] === 0 && vis['?t=0&zoom=2'] === 0 && vis['?mode=pictures&zoom=1'] === 0 && vis['?mode=pictures&zoom=2'] === 0, `weight stack (plates, rods, pin, bracket, rear cable and pulley): shown unzoomed and in the Pad close-up, hidden in the Grip and Path close-ups and their stills (most visible part: ${JSON.stringify(vis)})`);
  }
  // 3b4. arm over the face (QA r1 issue 4, QA r2 issue 5): at 401 phases, (a) the fist or forearm shape over the head
  // shape (the old measure), (b) any near-arm part (upper arm, deltoid, elbow, forearm, fist) over the face's front edge
  // (forehead, nose, mouth, chin). While the bar passes the face (grip between the forehead and the chin), (b) must
  // never happen, so the "bar comes down in front of your face" cue is always seen. Tile 2 must be clear of the face.
  {
    const { page, ctx } = await open('?t=0');
    const res = await page.evaluate(({ tile2, X0, Y0, FACE }) => {
      const root = document.getElementById('player'), svg = document.querySelector('.scene');
      const tp = el => { const m = el.getCTM(); return [...el.points].map(q => { const r = new DOMPoint(q.x, q.y).matrixTransform(m); return [r.x, r.y]; }); };
      const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) c = !c; } return c; };
      const edge = (P, closed = true) => { const o = []; const n = closed ? P.length : P.length - 1; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % P.length]; for (let k = 0; k < 8; k++) o.push([a[0] + (b[0] - a[0]) * k / 8, a[1] + (b[1] - a[1]) * k / 8]); } if (!closed) o.push(P[P.length - 1]); return o; };
      const head = document.querySelector('.stage .figure .lp-head polygon.b');
      const arm = document.querySelector('.stage .figure-arm');
      const hd = arm.querySelector('.lp-hd polygon.b'), fl = arm.querySelector('.lp-fl polygon.b');
      // every near-arm part's own shape (upper arm, deltoid, elbow, forearm, fist): skin parts paint .b, the deltoid and
      // sleeve paint the T-shirt tone .t since the figure detail (RIG.md section 20)
      const parts = [...arm.querySelectorAll('polygon.b, polygon.t')];
      const bar = document.querySelector('.stage .figure-arm .lp-bar');
      const map = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(svg.getScreenCTM().inverse().multiply(el.getScreenCTM())); };
      const at = u => root.style.setProperty('--delay', (-4 * u) + 's');
      const overHead = () => { const H = tp(head), A = tp(hd), F = tp(fl); return [...edge(A), ...edge(F)].some(s => inside(s, H)) || edge(H).some(s => inside(s, A) || inside(s, F)); };
      // face front edge: the head points from the brow to the chin (brow, nose tip, under the nose, mouth, chin; indices
      // FACE.edge in poses.json, since the figure-detail head has more points); the top corner of the forehead and the
      // underside of the jaw are left out, because an arm held overhead in a true side view always passes over the
      // temple and the jaw beside them
      const profile = () => edge(tp(head).slice(FACE.edge[0], FACE.edge[1] + 1), false);
      const overFace = () => { const pr = profile(); return parts.some(p => { const Q = tp(p); return pr.some(s => inside(s, Q)); }); };
      const seg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
      const pd = (P, Q) => { let m = 1e9; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; for (let k = 0; k < 16; k++) { const s = [a[0] + (b[0] - a[0]) * k / 16, a[1] + (b[1] - a[1]) * k / 16]; for (let j = 0; j < Q.length; j++) m = Math.min(m, seg(s, Q[j], Q[(j + 1) % Q.length])); } } return m; };
      const gap = u => { at(u); if (overHead()) return 0; const H = tp(head), A = tp(hd), F = tp(fl); return Math.min(pd(A, H), pd(H, A), pd(F, H), pd(H, F)); };
      const H0 = tp(head), yTop = Math.min(...H0.slice(FACE.top[0], FACE.top[1] + 1).map(p => p[1])), yChin = H0[FACE.chin][1];
      const onH = [], onF = [], passing = [];
      for (let i = 0; i <= 400; i++) { const u = i / 400; at(u); const g = map(bar, 0, 16).y; if (overHead()) onH.push(u); const f = overFace(); if (f) onF.push(u); if (g >= yTop && g <= yChin && f) passing.push(u); }
      const wins = on => { const w = []; let s0 = null, prev = null; for (const t of on) { if (s0 === null) s0 = t; else if (t - prev > 0.003) { w.push([s0, prev]); s0 = t; } prev = t; } if (s0 !== null) w.push([s0, prev]); return w; };
      return { head: { win: wins(onH), total: onH.length / 401 * 4 }, face: { win: wins(onF), total: onF.length / 401 * 4 }, passing: passing.length, yTop, yChin, tile2Gap: gap(tile2), oldTile2Gap: gap(0.2) };
    }, { tile2: P.truth.tile2.at, X0: G.X0, Y0: G.Y0, FACE: G.face });
    fs.writeFileSync(path.join(DIR, 'measured.json'), JSON.stringify({ armOverFace: res }, null, 1));
    const pc = v => `${+(v * 100).toFixed(2)}`, ws = w => w.length ? w.map(x => `${pc(x[0])}-${pc(x[1])} %`).join(', ') : 'never';
    lines.push(`INFO fist or forearm over the head shape (401 phases, the round-1 measure): ${ws(res.head.win)} of the rep, ${res.head.total.toFixed(2)} s of each 4 s rep at 1x (was 1.28 s)`); console.log(lines[lines.length - 1]);
    lines.push(`INFO any near-arm part over the face's front edge (brow to chin): ${ws(res.face.win)} of the rep, ${res.face.total.toFixed(2)} s of each 4 s rep at 1x; these are the moments the upper arm sweeps down past the face while the bar is still above the head, or comes back up`); console.log(lines[lines.length - 1]);
    check(res.passing === 0, `face stays in view while the bar passes it (grip between the forehead, y ${f1(res.yTop)}, and the chin, y ${f1(res.yChin)}): no arm part over the face's front edge at any of those phases (${res.passing} found)`);
    check(res.tile2Gap >= 3, `tile 2 pose (${pc(P.truth.tile2.at)} %): fist and forearm ${res.tile2Gap.toFixed(1)} clear of the face, so the outlines do not touch (limit 3)`);
    await ctx.close();
  }
  // 3r3. QA round 3 (layer order, the near end of the bar, the close-ups, the inset, smooth motion in the browser)
  {
    const { page, ctx } = await open('?t=0');
    const vis = await page.evaluate(({ PF, BP, SAMPLES }) => {
      const root = document.getElementById('player');
      const visible = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
      const topAt = (x, y) => document.elementsFromPoint(x, y).find(visible);
      const cp = (el, x, y) => new DOMPoint(x, y).matrixTransform(el.getScreenCTM());
      const line = document.querySelector('.stage .lp-cable-f line'), hook = document.querySelector('.stage .figure-arm .lp-hook'), barP = document.querySelector('.stage .figure-arm .lp-barline');
      const at = u => root.style.setProperty('--delay', (-4 * u) + 's');
      const name = e => e ? (e.getAttribute('class') || e.tagName) + (e.closest('.far-arm') ? '@far-arm' : e.closest('.figure-arm') ? '@near-arm' : '') : 'none';
      // (a) the front cable: 39 points from the pulley's bottom to the hook's edge, the topmost visible element
      const phases = [...Array.from({ length: 41 }, (_, i) => i / 40), ...Array.from({ length: 21 }, (_, i) => 0.8 + i * 0.01), ...Array.from({ length: 9 }, (_, i) => i * 0.005)];
      let worstCable = 0, worstAt = 0, miss = 0; const coveredBy = {};
      for (const u of phases) {
        at(u);
        const a = cp(line, PF.x, PF.y + PF.r), hk = hook.getBBox(), hc = cp(hook, hk.x + hk.width / 2, hk.y + hk.height / 2), r = hook.getBoundingClientRect().width / 2;
        const L = Math.hypot(hc.x - a.x, hc.y - a.y), stop = (L - r - 1) / L;
        let cov = 0;
        for (let k = 0; k < 39; k++) { const w = stop * (k + 0.5) / 39, e = topAt(a.x + (hc.x - a.x) * w, a.y + (hc.y - a.y) * w); if (e !== line) { if (!e || !e.closest('#rig-lp')) { miss++; continue; } cov++; coveredBy[name(e)] = (coveredBy[name(e)] || 0) + 1; } }
        if (cov / 39 > worstCable) { worstCable = cov / 39; worstAt = u; }
      }
      // (b) the near end of the bar: from 10 units out to its tip must show at every phase
      const tipL = [BP[0][0], 16 + BP[0][1]], bendL = [BP[1][0], 16 + BP[1][1]];
      let hidden = 0, minFrac = 1, maxFrac = 0; const hiddenBy = {};
      for (let i = 0; i <= 40; i++) {
        at(i / 40);
        let shown = 0;
        for (let k = 0; k < 12; k++) {
          const w = (k + 0.5) / 12, x = bendL[0] + (tipL[0] - bendL[0]) * w, y = bendL[1] + (tipL[1] - bendL[1]) * w, pnt = cp(barP, x, y), e = topAt(pnt.x, pnt.y);
          if (e && e.classList.contains('lp-barline') && e.closest('.figure-arm')) shown++; else if (w > 0.5) { hidden++; hiddenBy[name(e)] = (hiddenBy[name(e)] || 0) + 1; }
        }
        minFrac = Math.min(minFrac, shown / 12); maxFrac = Math.max(maxFrac, shown / 12);
      }
      // (c) smooth motion as the browser plays it: the drawn arm at every keyframe stop
      const ua = document.querySelector('.stage .figure-arm .lp-ua'), fa = ua.querySelector('.lp-fa'), hd = fa.querySelector('.lp-hd');
      const svg = document.querySelector('.scene'), inv = svg.getScreenCTM().inverse();
      const sp = (el, x, y) => new DOMPoint(x, y).matrixTransform(inv.multiply(el.getScreenCTM()));
      const st = SAMPLES.map(pc => { at(pc / 100); const S = sp(ua, 0, -62), E = sp(fa, 0, -24), Gp = sp(hd, 0, 16); const u = [S.x - E.x, S.y - E.y], v = [Gp.x - E.x, Gp.y - E.y]; return { pc, E, ang: Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI }; });
      const phase = (from, to, fn) => st.map((s, i) => i).filter(i => i > 0 && st[i].pc > from + 1e-9 && st[i].pc <= to + 1e-9).map(i => fn(st[i], st[i - 1]) / (st[i].pc - st[i - 1].pc) * 1.25);
      const dip = s => { const mx = Math.max(...s); let w = 0, pre = -1; const suf = []; let m = -1; for (let i = s.length - 1; i >= 0; i--) { m = Math.max(m, s[i]); suf[i] = m; } for (let j = 0; j < s.length; j++) { if (j > 0 && j < s.length - 1) w = Math.max(w, Math.min(pre, suf[j + 1]) - s[j]); pre = Math.max(pre, s[j]); } return w / mx; };
      const angF = (a, b) => Math.abs(a.ang - b.ang), ptF = (a, b) => Math.hypot(a.E.x - b.E.x, a.E.y - b.E.y);
      const sm = { angPull: phase(0, 25, angF), angRet: phase(37.5, 87.5, angF), elbPull: phase(0, 25, ptF), elbRet: phase(37.5, 87.5, ptF) };
      const dips = Object.fromEntries(Object.entries(sm).map(([k, v]) => [k, dip(v)]));
      at(0.025); const a025 = st.find(s => Math.abs(s.pc - 2.5) < 1e-9).ang, a05 = st.find(s => Math.abs(s.pc - 5) < 1e-9).ang;
      return { worstCable, worstAt, coveredBy, miss, hidden, hiddenBy, minFrac, maxFrac, sm, dips, a025, a05 };
    }, { PF: G.PF, BP: G.BAR_PTS, SAMPLES: P.samples });
    check(vis.worstCable <= 0.05, `front cable drawn over the far arm and the body: at most ${(vis.worstCable * 100).toFixed(0)} % of 39 points along it covered at any of 71 phases (worst at t ${vis.worstAt.toFixed(3)}; limit 5 %; QA r2 found 22 of 39 on the far arm at t 0)${Object.keys(vis.coveredBy).length ? '; covered by ' + JSON.stringify(vis.coveredBy) : ''}; ${vis.miss} of ${71 * 39} points fell between pixels`);
    check(vis.hidden === 0, `near end of the bar: its outer half shows at all 41 phases (nothing hides it: it is nearer the camera than the arm and the chest); share of its bent part in view ${(vis.minFrac * 100).toFixed(0)}-${(vis.maxFrac * 100).toFixed(0)} % over the rep${vis.hidden ? '; hidden by ' + JSON.stringify(vis.hiddenBy) : ''}`);
    const worstB = Math.max(...Object.values(vis.dips));
    { const mf = path.join(DIR, 'measured.json'), m = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {}; m.r3 = { cableCoveredWorst: vis.worstCable, nearEndHidden: vis.hidden, nearEndShown: [vis.minFrac, vis.maxFrac], a025: vis.a025, a05: vis.a05, browserDips: vis.dips, elbowPull: vis.sm.elbPull, elbowReturn: vis.sm.elbRet }; fs.writeFileSync(mf, JSON.stringify(m, null, 1)); }
    check(worstB <= 0.02, `smooth motion in the browser (the drawn arm read back at all ${P.samples.length} keyframe stops): the drawn elbow angle and the elbow point each speed up once and slow down once per phase (worst dip ${(worstB * 100).toFixed(2)} %, limit 2 %); drawn elbow angle ${f1(vis.a025)} at t 0.025 and ${f1(vis.a05)} at t 0.05 (QA r2: 173.7 -> 139.0); elbow point per 1.25 % of the rep, pull: ${vis.sm.elbPull.map(v => v.toFixed(1)).join(' ')}`);
    await ctx.close();
  }
  // close-ups at the setup pose and their Pictures stills show the pulley, the whole cable and both hands, inside the
  // stage and above the bubble (QA r3); the Pad close-up shows the feet above its bubble
  {
    const res = {};
    for (const q of ['?t=0&zoom=1', '?t=0&zoom=2', '?mode=pictures&zoom=1', '?mode=pictures&zoom=2', '?t=0&zoom=3', '?mode=pictures&zoom=3']) {
      const { page, ctx } = await open(q, { wait: 700 });
      res[q] = await page.evaluate(({ PF }) => {
        const st = document.querySelector('.stage').getBoundingClientRect(), n = +document.getElementById('player').className.match(/zoom-(\d)/)[1];
        const bTop = document.querySelector('.bubble-' + n).getBoundingClientRect().top - st.top;
        const box = el => { const b = window.__geomBox(el, st); return [b.left, b.top, b.right, b.bottom]; };
        const pulley = [...document.querySelectorAll('.stage .machine-back circle.eqm')].find(c => Math.abs(+c.getAttribute('cx') - PF.x) < 0.01);
        const knee = [...document.querySelectorAll('.stage .figure g.j')].filter(g => /rotate\(90deg\)/.test(g.getAttribute('style') || '')).pop();
        const parts = n === 3 ? { feet: knee, pad: document.querySelector('.stage .ov-pad') } : { pulley, cable: document.querySelector('.stage .lp-cable-f line'), farArm: document.querySelector('.stage .far-arm'), nearFist: document.querySelector('.stage .figure-arm .lp-hd polygon.b') };
        const out = {}; for (const [k, el] of Object.entries(parts)) out[k] = box(el).map(v => +v.toFixed(1));
        return { bTop: +bTop.toFixed(1), w: st.width, parts: out };
      }, { PF: G.PF });
      await ctx.close();
    }
    const bad = [];
    // the far arm is not the subject of a close-up, so it may run down behind the bubble; it must not stick out of the top
    for (const [q, r] of Object.entries(res)) for (const [k, b] of Object.entries(r.parts)) if (b[1] < 0 || (k !== 'farArm' && (b[0] < 0 || b[2] > r.w || b[3] > r.bTop))) bad.push(`${q} ${k} ${b.join(',')} (bubble top ${r.bTop})`);
    const g = res['?t=0&zoom=1'].parts, p3 = res['?t=0&zoom=3'];
    check(bad.length === 0, `close-ups at the setup pose and their stills: Grip and Path show the front pulley, the whole cable and the near fist inside the stage and above the bubble, and the far arm does not stick out of the top (Grip: pulley top ${g.pulley[1]}, far arm top ${g.farArm[1]}); Pad shows the feet above its bubble (feet bottom ${p3.parts.feet[3]}, bubble top ${p3.bTop})${bad.length ? ': ' + bad.join('; ') : ''}`);
  }
  // the Grip close-up keeps the far arm inside the stage for the whole rep, and the far hand out from under the inset
  {
    const { page, ctx } = await open('?t=0&zoom=1', { wait: 700 });
    const r = await page.evaluate(() => {
      const root = document.getElementById('player'), st = document.querySelector('.stage').getBoundingClientRect(), ib = document.querySelector('.inset').getBoundingClientRect();
      const fa = document.querySelector('.stage .far-arm'), ff = document.querySelector('.stage .far-arm .lp-fhd');
      const I = { left: ib.left - st.left, right: ib.right - st.left, top: ib.top - st.top, bottom: ib.bottom - st.top };
      let top = 1e9, under = 0;
      for (let i = 0; i <= 40; i++) { root.style.setProperty('--delay', (-4 * i / 40) + 's'); const b = window.__geomBox(fa, st); top = Math.min(top, b.top); const f = window.__geomBox(ff, st); if (f.right > I.left && f.left < I.right && f.bottom > I.top && f.top < I.bottom) under++; }
      return { top, under };
    });
    check(r.top >= 0 && r.under === 0, `Grip close-up over 41 phases: the far arm stays inside the stage (highest point ${f1(r.top)}) and the far hand never goes under the front-view inset (${r.under} found)`);
    // the inset draws the same bar as the scene: 150 long, straight between +-48, ends bent down 6, and all of it in view
    const ins = await page.evaluate(() => {
      const svg = document.querySelector('.inset-fig'), vb = svg.viewBox.baseVal, bar = svg.querySelector('.lp-barline'), bb = bar.getBBox();
      const pts = bar.getAttribute('d').match(/-?[\d.]+/g).map(Number);
      return { vb: [vb.x, vb.y, vb.width, vb.height], bb: [bb.x, bb.y, bb.width, bb.height], pts };
    });
    const [x0, y0, x1, y1, x2, y2, x3, y3] = ins.pts;
    const shape = Math.abs(x0 + 75) < 0.01 && Math.abs(x1 + 48) < 0.01 && Math.abs(x2 - 48) < 0.01 && Math.abs(x3 - 75) < 0.01 && Math.abs(y0 - y1 - 6) < 0.01 && Math.abs(y1 - y2) < 0.01 && Math.abs(y3 - y2 - 6) < 0.01;
    const inView = ins.bb[0] - 2 >= ins.vb[0] && ins.bb[0] + ins.bb[2] + 2 <= ins.vb[0] + ins.vb[2];
    const sceneShape = Math.abs(G.BAR_PTS[3][0] - G.BAR_PTS[0][0] - 0.25 * 150) < 0.01;
    check(shape && inView && sceneShape, `Grip inset bar matches the scene's bar: 150 long, straight between +-48, both ends bent down 6, hands at +-36, and the whole bar inside the inset (bar x ${ins.bb[0].toFixed(1)} to ${(ins.bb[0] + ins.bb[2]).toFixed(1)}, view x ${ins.vb[0]} to ${ins.vb[0] + ins.vb[2]})`);
    await ctx.close();
  }
  // 3c. zoom states: overlays hidden, bubble shown, subject inside the stage and above the bubble over the whole rep
  for (const [n, id] of Z) {
    const { page, ctx } = await open(`?t=0&zoom=${n}`, { wait: 700 });
    const r = await page.evaluate(({ n, id }) => {
      const root = document.getElementById('player'), st = document.querySelector('.stage').getBoundingClientRect();
      const vis = s => { const el = document.querySelector(s); return !!el && getComputedStyle(el).display !== 'none'; };
      const bubble = document.querySelector('.bubble-' + n), bTop = bubble.getBoundingClientRect().top - st.top;
      const subj = id === 'grip' ? ['.stage .ov-grip'] : id === 'path' ? ['.stage .guide'] : ['.stage .ov-pad', '.cam > .ov-pad'];
      let top = 1e9, bottom = -1e9, left = 1e9, right = -1e9;
      for (let i = 0; i <= 40; i++) {
        root.style.setProperty('--delay', (-4 * i / 40) + 's');
        for (const s of subj) { const b = window.__geomBox(document.querySelector(s), st); top = Math.min(top, b.top); bottom = Math.max(bottom, b.bottom); left = Math.min(left, b.left); right = Math.max(right, b.right); }
      }
      const ovOpacity = +getComputedStyle(document.querySelector(id === 'path' ? '.stage .lp-over' : subj[0])).opacity;
      // Grip only: the front-view inset is shown and the ring never goes under it
      const inset = document.querySelector('.inset'), ib = inset.getBoundingClientRect(), insetShown = getComputedStyle(inset).display !== 'none';
      let underInset = 0;
      const ibs = { left: ib.left - st.left, right: ib.right - st.left, top: ib.top - st.top, bottom: ib.bottom - st.top };
      if (id === 'grip') for (let i = 0; i <= 40; i++) { root.style.setProperty('--delay', (-4 * i / 40) + 's'); const b = window.__geomBox(document.querySelector('.stage .ov-grip'), st); if (b.right > ibs.left && b.left < ibs.right && b.bottom > ibs.top && b.top < ibs.bottom) underInset++; }
      const guideOp = +getComputedStyle(document.querySelector('.stage .guide')).opacity, trailOp = +getComputedStyle(document.querySelector('.stage .trail')).opacity;
      return { pill: vis('.pill-row'), label: vis('.cam-label'), bubble: vis('.bubble-' + n), others: [1, 2, 3].filter(k => k !== n).some(k => vis('.bubble-' + k)), bTop, top, bottom, left, right, ovOpacity, stW: st.width, stH: st.height, insetShown, underInset, inset: [ib.left - st.left, ib.top - st.top, ib.right - st.left, ib.bottom - st.top].map(v => +v.toFixed(1)), guideOp, trailOp };
    }, { n, id });
    check(!r.pill && !r.label && r.bubble && !r.others, `zoom-${n} (${id}): rep pill and camera label hidden, its own bubble shown, the other bubbles hidden`);
    check(r.top >= 0 && r.left >= 0 && r.right <= r.stW && r.bottom <= r.bTop, `zoom-${n} (${id}): subject inside the stage and above the bubble over 41 phases (top ${f1(r.top)}, bottom ${f1(r.bottom)} vs bubble ${f1(r.bTop)}, x ${f1(r.left)}-${f1(r.right)})`);
    check(r.ovOpacity > 0.5, `zoom-${n} (${id}): overlay shown (opacity ${r.ovOpacity}${id === 'path' ? '; the path and the "still to go" line drawn over the arm' : ''})`);
    if (id === 'grip') {
      check(r.insetShown && r.underInset === 0, `zoom-1 (grip): front-view inset shown (x ${r.inset[0]}-${r.inset[2]}, y ${r.inset[1]}-${r.inset[3]}), and the ring is never under it over 41 phases (${r.underInset} found)`);
      check(r.guideOp === 0 && r.trailOp === 0, `zoom-1 (grip): path guide and "still to go" line hidden, so no blue line runs beside the hand and the cable (QA r2 issue 4)`);
    } else check(!r.insetShown, `zoom-${n} (${id}): front-view inset hidden`);
    await ctx.close();
  }
  // 3d. unzoomed: pill and label shown, no bubble, overlays hidden
  {
    const { page, ctx } = await open('?t=0.125');
    const r = await page.evaluate(() => ({ pill: getComputedStyle(document.querySelector('.pill-row')).display !== 'none', label: getComputedStyle(document.querySelector('.cam-label')).display !== 'none', bubbles: [...document.querySelectorAll('.bubble')].some(b => getComputedStyle(b).display !== 'none'), ov: [...document.querySelectorAll('.stage .ov')].map(e => +getComputedStyle(e).opacity), over: +getComputedStyle(document.querySelector('.stage .lp-over')).opacity, inset: getComputedStyle(document.querySelector('.inset')).display, guide: +getComputedStyle(document.querySelector('.stage .guide')).opacity }));
    check(r.pill && r.label && !r.bubbles && r.ov.every(o => o === 0) && r.over === 0 && r.inset === 'none' && r.guide > 0.5, 'unzoomed: rep pill and camera label shown, no bubble, overlays, over-the-arm path copy and inset hidden, path guide shown');
    // 3e. bounded reps and restart through the -b set
    const it = await page.evaluate(() => { const el = document.querySelector('.stage .lp-ua'); return { iter: getComputedStyle(el).animationIterationCount, name: getComputedStyle(el).animationName, pill: getComputedStyle(document.querySelector('.repx.r1')).animationIterationCount }; });
    check(it.iter === '3' && it.pill === '1' && it.name === 'lp-ua-a', `bounded: figure ${it.iter} reps, rep pill ${it.pill} cycle, keyframe set ${it.name}`);
    await ctx.close();
  }
  {
    const { page, ctx } = await open('');
    await page.evaluate(() => { const r = document.getElementById('player'); r.style.setProperty('--dur', '0.25s'); window.__lp.S.gen = 'b'; r.className = r.className.replace('gen-a', 'gen-b'); });
    await page.waitForTimeout(1300);
    const r = await page.evaluate(() => ({ S: { ...window.__lp.S }, name: getComputedStyle(document.querySelector('.stage .lp-ua')).animationName, label: document.querySelector('.btn-icon').getAttribute('aria-label'), ended: !document.querySelector('[data-if="showEnded"]').hidden }));
    check(r.name === 'lp-ua-b' && r.S.ended && r.label === 'Replay' && r.ended, `3 reps then stop: animationend after the -b restart sets Replay (set ${r.name}, label ${r.label})`);
    await page.click('.btn-icon'); await page.waitForTimeout(100);
    const r2 = await page.evaluate(() => ({ name: getComputedStyle(document.querySelector('.stage .lp-ua')).animationName, play: getComputedStyle(document.querySelector('.stage .lp-ua')).animationPlayState }));
    check(r2.name === 'lp-ua-a' && r2.play === 'running', `Replay restarts through the other keyframe set (${r2.name}, ${r2.play})`);
    await ctx.close();
  }
  // 3f. Pictures: grid shown by the root class, four different poses; still for Path uses pose 3
  {
    const { page, ctx } = await open('?mode=pictures');
    const shown = await page.evaluate(() => getComputedStyle(document.querySelector('.pics')).display);
    const bufs = [];
    for (const el of await page.$$('.tile svg')) bufs.push((await el.screenshot()).toString('base64'));
    check(shown === 'grid' && new Set(bufs).size === 4, `pictures: grid shown (${shown}); the 4 tiles render 4 different pictures (poses ${P.picsAt.map(v => v * 100).join(', ')} % of the rep)`);
    await ctx.close();
    const s = await open('?mode=pictures&zoom=2', { wait: 700 });
    const st = await s.page.evaluate(() => ({ grid: getComputedStyle(document.querySelector('.pics')).display, delay: getComputedStyle(document.querySelector('.stage .lp-ua')).animationDelay, caps: !document.querySelector('[data-if="showCaps"]').hidden, still: [...document.querySelectorAll('[data-if="showStill1"],[data-if="showStill3"]')].filter(e => !e.hidden).map(e => e.textContent) }));
    check(st.grid === 'none' && st.delay === '-1.24s' && !st.caps && st.still.join('|') === 'Bar to the top of your chest', `pictures + Path chip: one still at pose 3 (delay ${st.delay}), picture caption "${st.still.join('|')}" shown, no phase caption`);
    await s.ctx.close();
    for (const z of [1, 3]) {
      const g = await open(`?mode=pictures&zoom=${z}`, { wait: 700 });
      const sg = await g.page.evaluate(() => ({ caps: !document.querySelector('[data-if="showCaps"]').hidden, still: [...document.querySelectorAll('[data-if="showStill1"],[data-if="showStill3"]')].filter(e => !e.hidden).map(e => e.textContent) }));
      check(!sg.caps && sg.still.join('|') === 'Thighs under the pad, arms long', `pictures + chip ${z}: picture caption "${sg.still.join('|')}" under the setup pose, no phase caption`);
      await g.ctx.close();
    }
  }
  // 3g. reduced motion: paused even when the root string says running; grid shown; hint; Animation disabled
  {
    const { page, ctx } = await open('', { rm: true });
    const r = await page.evaluate(() => { document.getElementById('player').style.setProperty('--play', 'running'); const el = document.querySelector('.stage .lp-ua'); return { play: getComputedStyle(el).animationPlayState, cap: getComputedStyle(document.querySelector('.capx')).animationPlayState, grid: getComputedStyle(document.querySelector('.pics')).display, hint: !document.querySelector('[data-if="hintRm"]').hidden, anim: document.querySelector('[data-click="toAnim"]').disabled, pill: getComputedStyle(document.querySelector('.pill-row')).display }; });
    check(r.play === 'paused' && r.cap === 'paused' && r.grid === 'grid' && r.hint && r.anim && r.pill === 'none', `reduced motion: figure ${r.play}, captions ${r.cap}, grid display ${r.grid}, hint shown ${r.hint}, Animation disabled ${r.anim}`);
    await ctx.close();
  }
  // 3h. Paper: frame outline read back from the page, without a data-theme attribute
  {
    const { page, ctx } = await open('?theme=paper');
    const c = await page.evaluate(() => { const e = document.querySelector('.stage .eq'); return { stroke: getComputedStyle(e).stroke, bg: getComputedStyle(document.querySelector('.stage')).backgroundColor }; });
    const num = s => { const v = s.match(/[\d.]+/g).map(Number); return s.startsWith('color(') ? v.slice(0, 3).map(x => x * 255) : v.slice(0, 3); };   // color-mix() reads back as color(srgb r g b)
    const lum = rgb => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = rgb.map(f); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const a = lum(num(c.stroke)), b = lum(num(c.bg)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    check(ratio >= 3, `paper: machine frame outline ${ratio.toFixed(2)}:1 on the stage (>= 3; read back as ${c.stroke})`);
    await ctx.close();
  }
  // Target-muscle glow and secondary motion (UPGRADE-BRIEF.md, figure detail and smoothness target 3; as rig-final/shoot.cjs
  // 2j). The glow on the lats (.gw) and the brace / shoulder-blade facets (.tn) share one opacity channel on the move's
  // timing. Over 481 samples of the rep: 0 at setup and at the rep restart (t 0 and 1, so no flash when a rep starts
  // again), never falls during the pull, strongest in the hold at the chest (the hardest point), never rises during the
  // return, and never changes by more than 0.02 between samples 1/120 s apart. It carries no rotate(), so it can never
  // move a joint.
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(async (ch) => {
      const L = window.__lp, setT = t => { L.S.t = t; L.S.playing = false; L.S.ended = false; L.bind(); };
      const inStage = [...document.querySelectorAll('.stage .scene .' + ch)].filter(el => !el.closest('.pics'));
      const glow = inStage.filter(el => el.classList.contains('gw')), ten = inStage.filter(el => el.classList.contains('tn'));
      const names = [...new Set(inStage.map(el => getComputedStyle(el).animationName))];
      const kf = [...document.querySelectorAll('style')].map(s => s.textContent).join('').match(new RegExp('@keyframes ' + ch + '-a\\{[^@]*'));
      const o = [];
      for (let i = 0; i <= 480; i++) { setT(i / 480); await new Promise(res => requestAnimationFrame(res)); o.push([glow[0], ten[0]].map(el => +getComputedStyle(el).opacity)); }
      return { nGlow: glow.length, nTen: ten.length, names, rotate: kf ? /rotate/.test(kf[0]) : null, o };
    }, 'lp-ten');
    const g = r.o.map(v => v[0]), t = r.o.map(v => v[1]), lift = [0, 120], hold = [120, 180], ret = [180, 420];
    const step = Math.max(...g.slice(1).map((v, i) => Math.abs(v - g[i]))), maxAll = Math.max(...g), maxHold = Math.min(...g.slice(hold[0], hold[1] + 1));
    const mono = (a, b, dir) => g.slice(a, b + 1).every((v, i, arr) => i === 0 || dir * (v - arr[i - 1]) >= -1e-6);
    check(r.nGlow > 0 && r.nTen > 0 && r.names.length === 1 && r.rotate === false && t.every((v, i) => Math.abs(v - g[i]) < 1e-6),
      `lat pulldown: ${r.nGlow} glow polygon(s) on the lats and ${r.nTen} secondary-motion facet(s) share one opacity channel (${r.names.join(', ')}), no rotate()`);
    check(g[0] <= 0.001 && g[480] <= 0.001 && mono(lift[0], lift[1], 1) && mono(ret[0], ret[1], -1) && maxHold >= maxAll - 1e-6 && maxAll >= 0.99 && step <= 0.02,
      `lat pulldown: glow 0 at setup (${g[0].toFixed(3)}) and at the rep restart (${g[480].toFixed(3)}), rises through the pull, strongest in the hold at the chest (${maxHold.toFixed(3)} of max ${maxAll.toFixed(3)}), falls through the return, largest step between samples 1/120 s apart ${step.toFixed(4)} (limit 0.02)`);
    await ctx.close();
  }
  // Visible accent at the hardest point (review 2026-09-27, D-L9): the target muscle must show at least as much accent in
  // the hold (t 0.3, glow full) as at the setup pose (t 0). Measured as drawn: every 0.5 stage px over the boxes of the
  // lats' .mm and .gw elements, the topmost element must be one of them (so a part in front does not count), weighted
  // by its effective opacity (and the glow's stroke-opacity), so a faint halo counts for what it shows.
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(async () => {
      const L = window.__lp, out = [];
      const eff = e => { let o = 1; for (let x = e; x && x.nodeType === 1 && !x.classList.contains('scene'); x = x.parentElement) o *= +getComputedStyle(x).opacity; return o; };
      for (const t of [0, 0.3]) {
        L.S.t = t; L.S.playing = false; L.S.ended = false; L.bind(); await new Promise(r => requestAnimationFrame(r)); await new Promise(r => requestAnimationFrame(r));
        const acc = [...document.querySelectorAll('.stage .scene .mm, .stage .scene .gw')].filter(e => !e.closest('.pics'));
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (const e of acc) { const b = e.getBoundingClientRect(); x0 = Math.min(x0, b.left); y0 = Math.min(y0, b.top); x1 = Math.max(x1, b.right); y1 = Math.max(y1, b.bottom); }
        let area = 0, raw = 0; const by = {};
        for (let y = y0; y <= y1; y += 0.5) for (let x = x0; x <= x1; x += 0.5) {
          const e = document.elementFromPoint(x, y); if (!e || !acc.includes(e)) continue;
          const w = (e.classList.contains('gw') ? +getComputedStyle(e).strokeOpacity : 1) * eff(e); area += w * 0.25; raw += 0.25;
          const k = e.classList.contains('gw') ? 'glow' : e.parentElement.classList.contains('lp-flare') ? 'flare' : e.classList.contains('lp-ten') ? 'lower lat' : 'core'; by[k] = (by[k] || 0) + w * 0.25;
        }
        out.push({ t, area: +area.toFixed(1), raw: +raw.toFixed(1), by: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, +v.toFixed(1)])) });
      }
      return out;
    });
    const [a, b] = r;
    { const mf = path.join(DIR, 'measured.json'), m = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {}; m.visibleAccent = r; fs.writeFileSync(mf, JSON.stringify(m, null, 1)); }
    check(b.area >= a.area, `visible lats accent at the hardest point: hold (t 0.3) ${b.area} vs setup (t 0) ${a.area} px of accent (area x opacity, 0.5 px grid; hold: ${Object.entries(b.by).map(([k, v]) => `${k} ${v}`).join(', ')}; setup: ${Object.entries(a.by).map(([k, v]) => `${k} ${v}`).join(', ')}; raw ${b.raw} vs ${a.raw}); the hold must show at least as much`);
    await ctx.close();
  }
  // The bar never crosses the face (review 2026-09-27): the bar's layers in the near hand (drawn over the head) sampled at
  // 41 points each, at 41 phases: no sample inside the head polygon.
  {
    const { page, ctx } = await open('?t=0');
    const r = await page.evaluate(async () => {
      const L = window.__lp;
      const tp = el => { const m = el.getCTM(); return [...el.points].map(q => { const r = new DOMPoint(q.x, q.y).matrixTransform(m); return [r.x, r.y]; }); };
      const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) c = !c; } return c; };
      const head = document.querySelector('.stage .figure .lp-head polygon.b'), bars = [...document.querySelectorAll('.stage .figure-arm .lp-bar .lp-barline')];
      let bad = 0, at = [];
      for (let i = 0; i <= 40; i++) { const t = i / 40; L.S.t = t; L.S.playing = false; L.S.ended = false; L.bind(); await new Promise(r => requestAnimationFrame(r));
        const H = tp(head); let n = 0;
        for (const bar of bars) { const Lb = bar.getTotalLength(), m = bar.getCTM(); for (let k = 0; k <= 40; k++) { const q = bar.getPointAtLength(Lb * k / 40), s = new DOMPoint(q.x, q.y).matrixTransform(m); if (inside([s.x, s.y], H)) n++; } }
        if (n) { bad += n; at.push(`${n} at t ${t}`); } }
      return { bars: bars.length, bad, at };
    });
    check(r.bars === 2 && r.bad === 0, `the bar never crosses the face: ${r.bad} of ${r.bars * 41 * 41} bar samples (2 layers x 41 points x 41 phases) inside the head polygon${r.at.length ? ' (' + r.at.join(', ') + ')' : ''}`);
    await ctx.close();
  }
  // Caption row (review 2026-09-27): with the canvas's font, the caption text and the tempo note never overlap and never
  // leave the player, in every state that shows them: idle, ended, the four phase captions, the Pictures line and the
  // two Pictures stills.
  {
    const states = [['idle', '?t=0', S => { S.t = null; S.playing = false; S.ended = false; }], ['ended', '?t=0', S => { S.t = null; S.playing = false; S.ended = true; }],
      ['caption 1', '?t=0.1'], ['caption 2', '?t=0.3'], ['caption 3', '?t=0.5'], ['caption 4', '?t=0.9'], ['pictures', '?mode=pictures'], ['still 1', '?mode=pictures&zoom=1'], ['still 3', '?mode=pictures&zoom=2']];
    const bad = [], seen = [];
    for (const [name, q, setup] of states) {
      const { page, ctx } = await open(q, { wait: 700 });
      if (setup) await page.evaluate(fn => { const L = window.__lp; (0, eval)('(' + fn + ')')(L.S); L.bind(); }, setup.toString());
      const r = await page.evaluate(() => {
        const pl = document.getElementById('player').getBoundingClientRect();
        const vis = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || e.hidden || +cs.opacity === 0) return false; } return true; };
        const texts = [...document.querySelectorAll('.cap-row .cap span, .cap-row .tempo')].filter(el => !el.querySelector('span') && el.textContent.trim() && vis(el)).map(el => { const b = el.getBoundingClientRect(); return { text: el.textContent.trim(), l: +(b.left - pl.left).toFixed(1), r: +(b.right - pl.left).toFixed(1) }; });
        return { texts, w: pl.width, font: getComputedStyle(document.querySelector('.cap')).fontFamily.split(',')[0], loaded: document.fonts.check('600 15px Roboto') };
      });
      seen.push(`${name}: ${r.texts.map(t => `"${t.text}" ${t.l}-${t.r}`).join(' | ')}`);
      for (const t of r.texts) if (t.l < -0.5 || t.r > r.w + 0.5) bad.push(`${name}: "${t.text}" ${t.l}-${t.r} leaves the player (0-${r.w})`);
      for (let i = 0; i < r.texts.length; i++) for (let j = i + 1; j < r.texts.length; j++) { const a = r.texts[i], b = r.texts[j]; if (Math.min(a.r, b.r) - Math.max(a.l, b.l) > -2) bad.push(`${name}: "${a.text}" and "${b.text}" overlap or touch (${a.l}-${a.r} vs ${b.l}-${b.r})`); }
      if (!r.loaded || !/Roboto/i.test(r.font)) bad.push(`${name}: caption font ${r.font}, Roboto loaded ${r.loaded}`);
      await ctx.close();
    }
    check(bad.length === 0, `caption row in Roboto: the caption text and the tempo note stay inside the player and at least 2 px apart in ${states.length} states (${seen.join('; ')})${bad.length ? ': ' + bad.join('; ') : ''}`);
  }
  // smoothness (UPGRADE-BRIEF.md target 4): every joint angle and the grip at 120 samples per second, plus the keyframe stops
  { const { smoothCheck } = require('../smooth-check.cjs'); const { page, ctx } = await open('?t=0'); await smoothCheck(page, { label: 'lat pulldown', freeze: 'lp', grips: [{ name: 'near hand', sel: '.stage .figure-arm .lp-ua .lp-fa .lp-hd', x: 0, y: 16 }] }, check); await ctx.close(); }
  check(errors.length === 0, `page errors: ${errors.length}${errors.length ? ' ' + errors.join(' | ') : ''}`);
  await browser.close();
  const summary = fails.length ? `${fails.length} FAILED${openItems.length ? `, ${openItems.length} OPEN` : ''}` : openItems.length ? `NO FAILURES; ${openItems.length} OPEN (a spec value not met that waits for a decision)` : 'ALL PASS';
  console.log(summary);
  fs.writeFileSync(path.join(DIR, 'checks.txt'), lines.join('\n') + `\n${summary}\n`);
  process.exit(fails.length ? 1 : openItems.length ? 2 : 0);
})();
