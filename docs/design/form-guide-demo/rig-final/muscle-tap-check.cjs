// muscle-tap-check.cjs: muscle info on tap (spec.md 2.10). Shared by rig-final/shoot.cjs and every player's shoot.cjs.
// It drives the page like a finger and a keyboard would and checks, in this order:
//   1. every muscle in EX.muscles has at least one halo hotspot in the stage (an invisible copy of each of its region
//      polygons, class hot, role button, tabindex 0, the right aria-label, no animation class of its own) whose hit box is
//      at least 44 x 44 px at t 0 and t 0.25 (the fill box grown by half the non-scaling stroke, or the client box), and
//      one stroke-less core copy per polygon (class hot hot-core, painted after every halo, so a tap on the muscle's own
//      fill always opens that muscle: D-R7);
//   2. at t 0.3 a tap on the target opens the bubble with the exact text, the bold common name, the dot in the muscle's
//      colour (the same computed colour as the region's fill), the .sel outline on that muscle's polygons only, the rep
//      pill and camera label still shown and the camera at 1x; nothing in the layout moves; a second tap closes it;
//   3. the same for every helper (dot = the helper colour), then a zoom chip replaces an open muscle bubble with the
//      chip's caption (accent dot, no .sel) and a second tap on the chip closes everything;
//   4. keyboard: Enter on the focused target opens, Space closes; a tap on the stage background closes;
//   5. every muscle's text fits two lines in the canvas font (Roboto loaded, bubble at most 54.5 px tall);
//   6. in Pictures mode no hotspot is hit-testable anywhere over the stage;
//   7. hotspots are excluded from the other checks by class: none is animated (.anim) and none matches a zoom subject.
// open(query) -> { page, ctx } (the caller's opener); cfg: { label, picsQuery }; check(ok, msg).
async function muscleTapCheck(open, cfg, check) {
  const L = cfg.label, picsQuery = cfg.picsQuery || '?mode=pics';
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const norm = t => t.replace(/\s+/g, ' ').trim();
  // browser-side helpers, installed on window once per page
  const H = `
    window.stageHots = () => [...document.querySelectorAll('.stage .scene .hot:not(.hot-core)')].filter(el => !el.closest('.pics'));
    window.stageCores = () => [...document.querySelectorAll('.stage .scene .hot-core')].filter(el => !el.closest('.pics'));
    window.box = el => { const r = el.getBoundingClientRect(); const b = el.getBBox(), m = el.getScreenCTM(), half = parseFloat(getComputedStyle(el).strokeWidth) / 2; const pt = (x, y) => ({ x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f });
      const c = [pt(b.x, b.y), pt(b.x + b.width, b.y), pt(b.x, b.y + b.height), pt(b.x + b.width, b.y + b.height)];
      const l = Math.min(...c.map(p => p.x)) - half, rr = Math.max(...c.map(p => p.x)) + half, t = Math.min(...c.map(p => p.y)) - half, bb = Math.max(...c.map(p => p.y)) + half;
      return { w: Math.max(r.width, rr - l), h: Math.max(r.height, bb - t), cx: (l + rr) / 2, cy: (t + bb) / 2 }; };
    window.centre = el => { const b = el.getBBox(), m = el.getScreenCTM(); const x = b.x + b.width / 2, y = b.y + b.height / 2; return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; };
    window.bubble = () => { const el = document.querySelector('.bubble'); const shown = el && !el.hidden && getComputedStyle(el).display !== 'none';
      return { shown, text: shown ? el.textContent.replace(/\\s+/g, ' ').trim() : '', name: shown ? (el.querySelector('b') || {}).textContent || '' : '', dot: shown ? getComputedStyle(el.querySelector('.dot')).backgroundColor : '', h: shown ? el.getBoundingClientRect().height : 0 }; };
    window.sel = () => [...document.querySelectorAll('.stage .scene .sel')].filter(el => !el.closest('.pics'));
    window.vis = q => { const el = document.querySelector(q); return !!el && !el.hidden && getComputedStyle(el).display !== 'none'; };
    window.layout = () => { const s = document.querySelector('.stage').getBoundingClientRect(), c = document.querySelector('.cap-row').getBoundingClientRect(); return [s.top, s.height, c.top, c.height].map(v => v.toFixed(1)).join(','); };
    window.camScale = () => { const t = getComputedStyle(document.querySelector('.cam')).transform; return t === 'none' ? 1 : new DOMMatrix(t).a; };
  `;
  const muscles = await (async () => { const { page, ctx } = await open('?t=0'); const m = await page.evaluate(() => EX.muscles); await ctx.close(); return m; })();
  const text = m => `${m.common} (${m.anatomical}), ${m.role === 'main' ? 'target' : 'helps'}. ${m.line}`;
  const target = muscles.find(m => m.role === 'main'), helpers = muscles.filter(m => m.role !== 'main');

  // 1. hotspots and their hit boxes at t 0 and t 0.25
  for (const t of [0, 0.25]) {
    const { page, ctx } = await open(`?t=${t}`);
    await page.evaluate(H);
    const r = await page.evaluate(muscles => {
      return muscles.map(m => { const hs = stageHots().filter(el => el.dataset.muscle === m.region), cs = stageCores().filter(el => el.dataset.muscle === m.region);
        return { id: m.id, n: hs.length, cores: cs.length, ok: hs.every(el => el.getAttribute('role') === 'button' && el.getAttribute('tabindex') === '0' && el.getAttribute('aria-label') === `${m.common}, ${m.role === 'main' ? 'target muscle' : 'helps'}` && !el.classList.contains('anim')),
          min: hs.length ? Math.min(...hs.map(el => { const b = box(el); return Math.min(b.w, b.h); })) : 0 }; });
    }, muscles);
    check(r.every(x => x.n >= 1 && x.cores === x.n && x.ok && x.min >= 44), `${L} muscle tap: at t ${t} every muscle has its halo hotspot(s) with button semantics and a hit box of at least 44 px, plus a core copy per polygon (${r.map(x => `${x.id}: ${x.n} halo${x.n === 1 ? '' : 's'} + ${x.cores} core${x.cores === 1 ? '' : 's'}, ${x.min.toFixed(0)} px`).join('; ')})`);
    await ctx.close();
  }

  // 2-4. tapping at t 0.3
  {
    const { page, ctx } = await open('?t=0.3');
    await page.evaluate(H);
    const tap = async region => { const c = await page.evaluate(region => { for (const el of stageCores().filter(el => el.dataset.muscle === region)) { const p = centre(el); const hit = document.elementFromPoint(p.x, p.y); if (hit && hit.classList.contains('hot') && hit.dataset.muscle === region) return p; } return null; }, region);
      if (!c) { check(false, `${L} muscle tap: ${region} has no visibly tappable point at this phase (every core polygon centre is covered by another part)`); return; }
      await page.mouse.click(c.x, c.y); await page.evaluate(frame); };
    const state = () => page.evaluate(() => ({ b: bubble(), sel: sel().map(el => el.getAttribute('data-class') || el.getAttribute('class')), selN: sel().length, selHelp: sel().filter(el => el.classList.contains('mh')).length, selMain: sel().filter(el => el.classList.contains('mm')).length, pill: vis('.pill-row'), label: vis('.cam-label'), cam: camScale(), layout: layout(),
      mainFill: getComputedStyle(document.querySelector('.stage .scene .mm')).fill, helpFill: (document.querySelector('.stage .scene .mh') ? getComputedStyle(document.querySelector('.stage .scene .mh')).fill : ''), accent: getComputedStyle(document.querySelector('.stage .scene .guide')).stroke,
      selStroke: sel().length ? getComputedStyle(sel()[0]).stroke : '', selWidth: sel().length ? getComputedStyle(sel()[0]).strokeWidth : '', textColor: getComputedStyle(document.querySelector('.cap')).color,
      polys: Object.fromEntries(EX.muscles.map(m => [m.id, [...document.querySelectorAll('.stage .scene .mm, .stage .scene .mh')].filter(el => !el.closest('.pics') && (el.getAttribute('data-class') || '') === 'cls' + m.Id).length])) }));
    const before = await state();
    await tap(target.region);
    let s = await state();
    check(s.b.shown && s.b.text === text(target) && s.b.name === target.common && s.b.dot === s.mainFill, `${L} muscle tap: tapping the target at t 0.3 shows "${s.b.text}" with the bold name "${s.b.name}" and the dot in the target colour (${s.b.dot} = the region's fill)`);
    check(s.selN === s.polys[target.id] && s.selMain === s.selN && s.selHelp === 0 && s.selStroke === s.textColor && s.selWidth === '1.5px', `${L} muscle tap: the .sel outline (${s.selStroke}, ${s.selWidth}) is on the target's ${s.selN} polygon(s) only`);
    check(s.pill && s.label && Math.abs(s.cam - 1) < 1e-6 && s.layout === before.layout, `${L} muscle tap: the rep pill and camera label stay, the camera stays at 1x and nothing in the layout moves (stage and caption row ${s.layout})`);
    await tap(target.region);
    s = await state();
    check(!s.b.shown && s.selN === 0, `${L} muscle tap: a second tap on the target closes the bubble and clears the outline`);
    for (const m of helpers) {
      await tap(m.region); s = await state();
      check(s.b.shown && s.b.text === text(m) && s.b.name === m.common && s.b.dot === s.helpFill && s.selN === s.polys[m.id] && s.selHelp === s.selN, `${L} muscle tap: tapping ${m.common} shows "${s.b.text}" with the dot in the helper colour (${s.b.dot}) and the outline on its ${s.selN} polygon(s)`);
    }
    // a zoom chip replaces the open muscle bubble; a second tap on the chip closes everything
    await page.click('.chips .chip:nth-child(1)'); await page.waitForTimeout(400);
    s = await state();
    const chip0 = await page.evaluate(() => EX.chips[0].caption);
    check(s.b.shown && s.b.text === chip0 && s.b.name === '' && s.b.dot === s.accent && s.selN === 0 && !s.pill, `${L} muscle tap: a zoom chip replaces the muscle bubble with its caption ("${s.b.text}", accent dot, no outline, pill hidden)`);
    await page.click('.chips .chip:nth-child(1)'); await page.waitForTimeout(400);
    s = await state();
    check(!s.b.shown && Math.abs(s.cam - 1) < 1e-6 && s.pill, `${L} muscle tap: a second tap on the chip closes it, nothing restored (bubble hidden, camera 1x, pill back)`);
    // keyboard: Enter opens, Space closes; the stage background closes
    await page.evaluate(region => { const el = [...document.querySelectorAll('.stage .scene .hot')].filter(el => !el.closest('.pics') && el.dataset.muscle === region)[0]; el.focus(); }, target.region);
    await page.keyboard.press('Enter'); await page.evaluate(frame); const k1 = await state();
    await page.keyboard.press('Space'); await page.evaluate(frame); const k2 = await state();
    check(k1.b.shown && k1.b.text === text(target) && !k2.b.shown, `${L} muscle tap: keyboard, Enter on the focused target opens the bubble and Space closes it`);
    await tap(target.region);
    await page.waitForTimeout(120);   // a second tap comes later than the logic's 80 ms guard (which keeps a runtime that passes no event from closing what the hotspot just opened)
    const st = await page.evaluate(() => { const r = document.querySelector('.stage').getBoundingClientRect(); return { x: r.left + 330, y: r.top + 150 }; });
    await page.mouse.click(st.x, st.y); await page.evaluate(frame); s = await state();
    check(!s.b.shown && s.selN === 0, `${L} muscle tap: a tap on the stage background closes the muscle bubble`);
    // 5. two lines in Roboto
    const rows = [];
    for (const m of muscles) { await tap(m.region); const r = await page.evaluate(async () => { await document.fonts.ready; const b = bubble(); return { h: b.h, roboto: [...document.fonts].some(f => /roboto/i.test(f.family) && f.status === 'loaded') }; }); rows.push({ id: m.id, ...r }); await tap(m.region); }
    check(rows.every(r => r.roboto && r.h <= 54.5), `${L} muscle tap: every muscle text fits two lines in Roboto (bubble heights ${rows.map(r => `${r.id} ${r.h.toFixed(0)} px`).join(', ')}; two lines = 54 px)`);
    // 7. excluded from the other checks by class
    const ex = await page.evaluate(() => { const hs = [...document.querySelectorAll('.stage .scene .hot')]; return { n: hs.length, anim: hs.filter(el => el.classList.contains('anim')).length, subject: hs.filter(el => el.matches('.ov, .ovs, .guide, .trail, .mm, .mh, .gw')).length }; });
    check(ex.n > 0 && ex.anim === 0 && ex.subject === 0, `${L} muscle tap: ${ex.n} hotspots (halos and cores) carry no animation class and match no zoom subject or muscle class, so the smoothness, muscle-visibility and keep-clear checks never see them`);
    await ctx.close();
  }

  // 6. Pictures mode: no hotspot is hit-testable anywhere over the stage
  {
    const { page, ctx } = await open(picsQuery);
    const r = await page.evaluate(() => { const s = document.querySelector('.stage').getBoundingClientRect(); let hits = 0, n = 0;
      for (let x = 4; x < s.width; x += 8) for (let y = 4; y < s.height; y += 8) { n++; const el = document.elementFromPoint(s.left + x, s.top + y); if (el && (el.classList.contains('hot') || (el.closest && el.closest('.hot')))) hits++; }
      return { hits, n }; });
    check(r.n > 0 && r.hits === 0, `${L} muscle tap: in Pictures mode no hotspot is hit-testable (${r.n} points over the stage, ${r.hits} hit)`);
    await ctx.close();
  }
}

module.exports = { muscleTapCheck };
