// GU-7a-1 step 6: Guide.stage() draws the demo's stage (R1-9, R1-10), its Pictures tiles are the sampled poses, and the
// muscle hotspots follow R1-15.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { guides } from '@/formguide/index';
import { MUSCLE_IDS } from '@/data/muscles';

const read = (f: string) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');
const IDS: [string, string][] = [['machineChestPress', 'lib_machine_chest_press'], ['dumbbellLateralRaise', 'lib_dumbbell_lateral_raise'], ['latPulldown', 'lib_lat_pulldown']];
const HOT = /<polygon class="hot[ "][^>]*\/>/g;
const attr = (a: string, n: string) => (new RegExp(` ${n}="([^"]*)"`).exec(a) || [])[1] ?? '';
/** the drawn shapes in order, as `tag class points|d`, after removing data-* attributes, .hot polygons and whitespace */
const shapes = (m: string) => [...m.replace(HOT, '').replace(/ data-[\w-]+="[^"]*"/g, '').matchAll(/<(polygon|path|rect|line|ellipse|circle)\b([^>]*)>/g)]
  .map(x => `${x[1]} ${attr(x[2]!, 'class')} ${attr(x[2]!, 'points')}${attr(x[2]!, 'd')}`.replace(/\s+/g, ' '));
const hots = (m: string) => [...m.matchAll(HOT)].map(x => `${/hot-core/.test(x[0]) ? 'core' : 'halo'} ${attr(x[0], 'points')}`);

describe('stage markup = the demo stage (R1-9)', () => {
  for (const [fx, id] of IDS) {
    const g = guides[id]!, st = g.stage('dark');
    it(`${fx}: the same shapes with the same class and points/d in the same order`, () => {
      const want = shapes(read(`${fx}.stage.html`)), got = shapes(st.svg);
      expect(got.length).toBeGreaterThan(100);
      expect(got).toEqual(want);
      expect(g.stage('light')).toBe(st);
    });
    it(`${fx}: the muscle hotspots (halos and cores) sit where the demo's do, in the same order`, () => {
      expect(hots(st.svg)).toEqual(hots(read(`${fx}.stage.html`)));
    });
    it(`${fx}: hotspot markup per R1-15: a MuscleId, button semantics, a 30 px or wider transparent stroke`, () => {
      const halos = [...st.svg.matchAll(/<polygon class="hot"[^>]*\/>/g)].map(x => x[0]);
      expect(halos.length).toBeGreaterThan(0);
      const roles = Object.values(g.spec.roles);
      for (const h of halos) {
        const m = attr(h, 'data-muscle');
        expect(MUSCLE_IDS).toContain(m);
        expect(roles).toContain(m);
        expect(h).toMatch(/ role="button" tabindex="0" aria-label="[^"]+, (target muscle|helps)"/);
        expect(+/stroke-width:(\d+)px/.exec(attr(h, 'style'))![1]!).toBeGreaterThanOrEqual(30);
        expect(attr(h, 'style')).toContain('fill:transparent;stroke:transparent');
      }
      // every painted role region has a hotspot; every role polygon names its muscle for the player's outline
      expect(new Set(halos.map(h => attr(h, 'data-muscle')))).toEqual(new Set(roles));
      for (const m of roles) expect(st.svg).toMatch(new RegExp(`class="m[mh][^"]*" data-muscle="${m}"`));
    });
    it(`${fx}: the Pictures tiles are the rig posed at picsAt: inline values equal sampleMove at the nearest stop`, () => {
      const s = g.sample(), tiles = st.tiles.split('<div class="tile">').slice(1);
      expect(tiles).toHaveLength(4);
      tiles.forEach((t, i) => {
        const u = g.spec.picsAt[i]!, pcs = s.stops.map(pc => pc / 100);
        let at = 0; pcs.forEach((x, j) => { if (Math.abs(x - u) < Math.abs(pcs[at]! - u)) at = j; });
        for (const grp of s.groups) {
          const f = grp.frames[at]!, want = f.transform !== undefined ? `transform:${f.transform}` : f.opacity !== undefined ? `opacity:${f.opacity}` : `stroke-dashoffset:${f.strokeDashoffset}`;
          const els = [...t.matchAll(new RegExp(`class="(?:[^"]* )?${grp.className}(?: [^"]*)?"[^>]*>`, 'g'))].map(x => x[0]);
          expect(els.length, grp.className).toBeGreaterThan(0);
          for (const e of els) expect(e, grp.className).toContain(want);
        }
        expect(t).not.toMatch(/class="hot|<use|--delay/);
        expect(t).toContain(`<span class="badge">${i + 1}</span><p>${g.spec.pics[i]}</p>`);
      });
    });
    it(`${fx}: no id repeats across the stage and the tiles; every url(#id) points at an id`, () => {
      const all = st.svg + st.tiles, ids = [...all.matchAll(/ id="([^"]+)"/g)].map(x => x[1]!);
      expect(new Set(ids).size).toBe(ids.length);
      for (const [, r] of all.matchAll(/url\(#([^)]+)\)/g)) expect(ids).toContain(r);
    });
  }
  it('the lat pulldown Grip inset equals the demo inset', () => {
    expect(guides.lib_lat_pulldown!.insetHtml()).toBe(`<div class="inset"><span class="inset-label">Front view</span>${read('latPulldown.inset.html').trim()}</div>`);
    expect(guides.lib_machine_chest_press!.insetHtml()).toBeNull();
  });
  it('failure path: a moved polygon point breaks the shape equality', () => {
    const want = shapes(read('machineChestPress.stage.html'));
    const moved = shapes(guides.lib_machine_chest_press!.stage('dark').svg.replace(/points="([\d.-]+),/, (_, x: string) => `points="${+x + 1},`));
    expect(moved).not.toEqual(want);
  });
});

describe('Guide contract (api.ts) and Stage.css', () => {
  it('guides are keyed by library exercise id, spec ids cp/lp/lr, 3 chips, 4 pictures', () => {
    expect(Object.keys(guides).sort()).toEqual(['lib_dumbbell_lateral_raise', 'lib_lat_pulldown', 'lib_machine_chest_press']);
    for (const [id, g] of Object.entries(guides)) {
      expect(g.spec.exerciseId).toBe(id);
      expect(g.spec.chips).toHaveLength(3);
      expect(g.spec.rep).toBe(4);
      expect(g.stage('dark').svg.startsWith(`<g class="cam"><g id="rig-${g.spec.id}">`)).toBe(true);
    }
  });
  it('Stage.css holds origins, zoom cameras and overlays, and no CSS animation', () => {
    for (const g of Object.values(guides)) {
      const css = g.stage('dark').css;
      expect(css).toMatch(/\.zoom-1 \.cam\{transform:translate\(179px,138px\) scale\([\d.]+\) translate/);
      expect(css).toMatch(/transform-origin:/);
      expect(css).not.toMatch(/animation-name|@keyframes|gen-a|gen-b/);
    }
    expect(guides.lib_machine_chest_press!.stage('dark').css).toContain('.cp-lever{transform-origin:203.5px 58px}');
    expect(guides.lib_dumbbell_lateral_raise!.stage('dark').css).toContain('.lr-fa-r{transform-origin:22px -24px;transform:rotate(15deg)}');
  });
});
