// LIB-SHAPES A4 (#377, PLAN RULED point 4): the gate block's body. The built app ships only the 8, so each fixture
// shape reaches the screen through a test-only route swap: the built ht-<id> chunk is served as a wrapper module that
// imports the original (under ?lib-shapes-orig), re-exports its exact export names and edits its one content object in
// memory with fixture.mjs's shapeOf. Nothing in src/ or www/ changes. Fails closed: the original must hold exactly one
// export statement and exactly one content object with the id, each route must be hit exactly once, and the sheet
// must lose its Hand chip (and, for `none`, its Grip) or the block is red.
import { join } from 'node:path';
import { shapeOf } from './fixture.mjs';

const ORIG = 'lib-shapes-orig';
export const SHAPES = [
  { id: 'lib_leg_press', pre: 'leg-press', chunk: 'ht-leg-press-', shape: 'none',
    chips: ['back-on-pad', 'foot', 'feel'], order: ['look', 'feel', 'setup', 'risks'] },
  { id: 'lib_machine_chest_press', pre: 'machine-chest-press', chunk: 'ht-machine-chest-press-', shape: 'nozoom',
    chips: ['seat-height', 'blades', 'feel'], order: ['look', 'grip', 'feel', 'setup', 'risks'] },
];
export const THEMES = ['silent-black', 'paper'];

/** The wrapper module for one built chunk's text (throws unless the anchors match exactly once). */
export function wrapperOf(orig, origUrl, id, shape) {
  const ex = [...orig.matchAll(/export\s*\{([^}]*)\}\s*;?\s*$/g)];
  if (ex.length !== 1) throw new Error(`${id}: ${ex.length} export statements at the chunk's end (want 1)`);
  const names = ex[0][1].split(',').map(s => s.trim().split(/\s+as\s+/).pop()).filter(Boolean);
  if (!names.length) throw new Error(`${id}: no export names`);
  if (orig.split(`id:"${id}"`).length !== 2) throw new Error(`${id}: the content id is not in the chunk exactly once`);
  const u = JSON.stringify(origUrl);
  return `import * as M from ${u};\n`
    + `const shapeOf = ${shapeOf.toString()};\n`
    + `const hits = Object.values(M).filter(v => v && typeof v === 'object' && v.id === ${JSON.stringify(id)});\n`
    + `if (hits.length !== 1) throw new Error('LIB-SHAPES: ${id}: ' + hits.length + ' content objects (want 1)');\n`
    + `const o = hits[0], s = shapeOf(o, ${JSON.stringify(shape)});\n`
    + `for (const k of Object.keys(o)) if (!(k in s)) delete o[k];\n`
    + `Object.assign(o, s);\n`
    + `globalThis.__libShapes = [...(globalThis.__libShapes ?? []), ${JSON.stringify(id)}];\n`
    + `export { ${names.join(', ')} } from ${u};\n`;
}

/** Runs the block: both shapes x both themes at 390 px. `P` records a problem; returns the screenshot count. */
export async function libShapesGate({ browser, port, OUT, P, H, writeFileSync }) {
  let shots = 0;
  for (const theme of THEMES) {
    // service workers blocked in this context only: a context route never sees a request the service worker answers
    // (precedent: HT-8's early-chip check in the gate)
    const noSw = { newContext: o => browser.newContext({ ...o, serviceWorkers: 'block' }) };
    const { ctx, page } = await H.openAppTrain(noSw, port, theme, { onError: m => P(`${theme}: page error: ${m}`) });
    const hits = Object.fromEntries(SHAPES.map(s => [s.id, 0]));
    try {
      await ctx.route(/\/assets\/ht-(leg-press|machine-chest-press)-[\w-]+\.js(\?.*)?$/, async route => {
        const url = route.request().url();
        if (url.includes(ORIG)) return route.continue();
        const s = SHAPES.find(x => url.includes(`/assets/${x.chunk}`));
        try {
          hits[s.id]++;
          const res = await route.fetch();
          const body = wrapperOf(await res.text(), `${url}${url.includes('?') ? '&' : '?'}${ORIG}`, s.id, s.shape);
          await route.fulfill({ status: 200, contentType: 'text/javascript', body });
        } catch (e) { P(`${theme} ${s.id}: route swap: ${e.message}`); await route.abort(); }
      });
      for (const s of SHAPES) {
        const idx = H.HT_ORDER.indexOf(s.id);
        if (idx < 0) { P(`${theme} ${s.id}: not in the seeded split`); continue; }
        await H.openHowTo(page, idx);
        // Feel mounts when near (Feel.tsx whenNear): scroll the panel through, then wait for it
        await page.evaluate(() => { const p = document.querySelector('dialog.sheet.ht .sheet-panel'); p.scrollTop = p.scrollHeight; });
        await page.locator(`dialog.sheet.ht #${s.pre}-feel`).waitFor({ state: 'attached', timeout: 8000 }).catch(() => P(`${theme} ${s.id}: the feel section never mounted`));
        await H.settleApp(page);
        const r = await page.evaluate(pre => {
          const d = document.querySelector('dialog.sheet.ht'), panel = d.querySelector('.sheet-panel');
          const at = { look: d.querySelector('.ht-look .zx-chips-wrap'), grip: d.querySelector('.ht-grip'), feel: d.querySelector(`#${pre}-feel`),
            setup: d.querySelector(`#${pre}-setup`), risks: d.querySelector(`#${pre}-risks`) };
          const order = Object.entries(at).filter(([, e]) => e).sort(([, a], [, b]) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)).map(([k]) => k);
          const visible = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !e.closest('[hidden]'); };
          const small = [...d.querySelectorAll('[data-section] button, [data-section] a[href]')].filter(visible)
            .map(e => { const r = e.getBoundingClientRect(); return { t: (e.id || e.textContent.trim()).slice(0, 40), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; })
            .filter(x => x.w < 44 || x.h < 44);
          return {
            swapped: globalThis.__libShapes ?? [],
            chips: [...d.querySelectorAll('.ht-look .zx-chip')].map(b => b.id.slice(`${pre}-chip-`.length)),
            hand: !!d.querySelector(`#${pre}-chip-hand, #${pre}-zoom-hand`), grip: !!at.grip, also: !!d.querySelector(`#${pre}-also`),
            gripLead: d.querySelector('.ht-grip .grip-lead')?.textContent ?? null,
            order, small,
            overflow: [document.scrollingElement.scrollWidth - innerWidth, panel.scrollWidth - panel.clientWidth,
              ...[...d.querySelectorAll('[data-section]')].map(e => Math.round(e.getBoundingClientRect().right - panel.getBoundingClientRect().right))].filter(v => v > 0),
          };
        }, s.pre);
        const T = `${theme} ${s.id} (${s.shape})`;
        if (!r.swapped.includes(s.id)) P(`${T}: the fixture swap did not run (the sheet is the shipped one)`);
        if (r.hand) P(`${T}: a Hand chip or hand close-up is on the sheet`);
        if (r.also) P(`${T}: the "Also check your wrist" row is on the sheet`);
        if (s.shape === 'none' && r.grip) P(`${T}: a Grip section is on the sheet`);
        if (s.shape === 'nozoom' && !r.gripLead) P(`${T}: no grip words on the sheet`);
        if (JSON.stringify(r.chips) !== JSON.stringify(s.chips)) P(`${T}: chips ${r.chips.join(', ')}, want ${s.chips.join(', ')}`);
        if (JSON.stringify(r.order) !== JSON.stringify(s.order)) P(`${T}: section order ${r.order.join(' > ')}, want ${s.order.join(' > ')}`);
        if (r.small.length) P(`${T}: tap targets under 44 px: ${r.small.map(x => `${x.t} ${x.w}x${x.h}`).join(', ')}`);
        if (r.overflow.length) P(`${T}: horizontal overflow ${r.overflow.join(', ')} px`);
        const panel = page.locator('dialog.sheet.ht .sheet-panel');
        await panel.evaluate(p => { p.scrollTop = 0; });
        await H.settleApp(page);
        writeFileSync(join(OUT, `lib-shapes-${s.shape}-${theme}.png`), await page.screenshot({ animations: 'disabled', caret: 'hide' }));
        shots++;
        await H.closeHowTo(page);
      }
      for (const s of SHAPES) if (hits[s.id] !== 1) P(`${theme} ${s.id}: the chunk route was hit ${hits[s.id]} times (want 1)`);
    } finally { await ctx.close(); }
  }
  return shots;
}
