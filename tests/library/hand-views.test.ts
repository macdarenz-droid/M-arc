// LIB-12 (plan 2.3): the hand views palm-flat, cupped, front-rack and ball-contact, the battle-rope pair, and the gap
// keys, as hands/hand-<key>.mjs modules in LIB-7's loader (D-LIB12-1). Acceptance A1-A7 of the LIB-12 design note (#191).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let pairs: any, hand: any, common: any, PF: any, CU: any, FR: any, BA: any, mods: any[];
const CLAIMS = JSON.parse(readFileSync(new URL('../../tools/plates/library/hands/lib12-claims.json', import.meta.url), 'utf8'));

// The census scope of each LIB-12 key (sources in each module's CENSUS: census.json aggregates for palm-flat 10 and the
// implement 5, plan 2.3 for cupped 2, front-rack 1, ball-contact 2; the pair keys from plan 2.3 and LIB-7 §2).
const SCOPE: Record<string, { drawn: string[]; gaps: string[] }> = {
  'palm-flat': { drawn: ['bear_crawl', 'bird_dog', 'burpee', 'diamond_push_up', 'incline_push_up', 'mountain_climbers', 'pike_push_up', 'push_up'], gaps: ['bench_dip', 'renegade_row'] },
  cupped: { drawn: ['goblet_squat'], gaps: ['dumbbell_overhead_triceps_extension'] },
  'front-rack': { drawn: ['front_squat'], gaps: [] },
  'ball-contact': { drawn: ['wall_ball'], gaps: ['medicine_ball_slam'] },
  'battle-rope': { drawn: ['battle_ropes'], gaps: [] },
  implement: { drawn: [], gaps: ['jump_rope', 'kettlebell_swing', 'sled_pull'] },
  'dip-bar': { drawn: [], gaps: ['weighted_dip'] },
  'ab-wheel': { drawn: [], gaps: ['ab_wheel_rollout'] },
};
/** The LIB-12 sweep: every count asserted through `sweep` (red on empty input), per key drawn + gap = scope. */
function lib12Sweep(all: any[]) {
  const sweep = common.sweep, mine: any[] = sweep(all.filter(m => m.OWNER === 'LIB-12'), 8, 'LIB-12 keys');
  sweep(mine.filter(m => Object.keys(m.IDS).length), 5, 'drawn keys');
  sweep(mine.filter(m => !Object.keys(m.IDS).length), 3, 'gap keys');
  let drawn = 0, gaps = 0;
  for (const m of mine) {
    const s = SCOPE[m.KEY];
    if (!s) throw new Error(`no scope for ${m.KEY}`);
    const [d, g] = [Object.keys(m.IDS).sort(), Object.keys(m.GAPS).sort()];
    if (d.join() !== s.drawn.join() || g.join() !== s.gaps.join()) throw new Error(`${m.KEY}: drawn [${d}] gaps [${g}] differ from scope drawn [${s.drawn}] gaps [${s.gaps}]`);
    sweep([...Object.keys(m.IDS), ...Object.keys(m.GAPS)], s.drawn.length + s.gaps.length, `${m.KEY} scope`);
    if (m.CENSUS.count !== s.drawn.length + s.gaps.length && m.KEY !== 'implement') throw new Error(`${m.KEY}: census ${m.CENSUS.count}`);
    drawn += Object.keys(m.IDS).length; gaps += Object.keys(m.GAPS).length;
  }
  sweep(Array(drawn), 12, 'drawn ids'); sweep(Array(gaps), 9, 'gap ids');
  return pairs.indexOf(all);   // throws when an id is in two keys
}
/** The spec renderPair builds (pairs.mjs), built here so a test can swap or change the halves. */
const specOf = (m: any, id: string, fault: string, swap = false) => {
  const cfg = m.IDS[id], V = m.VARIANTS[cfg.variant], F = V.faults[fault];
  const right = m.VIEW === 'radial' ? { ...V.right, handle: { profile: m.HANDLE.profile, diameterMm: m.HANDLE.diameterMm } } : V.right, wrong = { ...right, ...F.pose };
  return { uid: `t-${id.replace(/_/g, '-')}`, camera: 'side', loadAxis: V.loadAxis, markers: F.markers, right: swap ? wrong : right, wrong: swap ? right : wrong,
    rightNote: V.rightNote, wrongNote: F.label, alt: { right: V.alt, wrong: F.alt } };
};
const drawnPairs = () => mods.filter(m => m.OWNER === 'LIB-12' && m.render).flatMap(m => Object.entries(m.IDS).flatMap(([id, c]: any) => c.faults.map((f: string) => ({ m, id, f }))));

beforeAll(async () => {
  pairs = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  hand = await import(/* @vite-ignore */ url('tools/plates/layers/engine/hand.mjs'));
  common = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-common.mjs'));
  PF = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-palm-flat.mjs'));
  CU = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-cupped.mjs'));
  FR = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-front-rack.mjs'));
  BA = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-ball.mjs'));
  mods = pairs.MODULES;
});

describe('LIB-12 A5: sweeps (drawn + gap = census scope per key)', () => {
  it('8 keys, 12 drawn, 9 gaps, each id in exactly one key', () => {
    const idx = lib12Sweep(mods);
    for (const s of Object.values(SCOPE)) { for (const id of s.drawn) expect(idx.drawn.has(id)).toBe(true); for (const id of s.gaps) expect(idx.gaps.has(id)).toBe(true); }
  });
  it('mutation: empty input is red', () => { expect(() => lib12Sweep([])).toThrow(/no items/); });
  it('mutation: a gap module removed is red', () => { expect(() => lib12Sweep(mods.filter(m => m.KEY !== 'dip-bar'))).toThrow(/LIB-12 keys: 7 items/); });
  it('mutation: a gap id drawn is red', () => {
    const imp = mods.find(m => m.KEY === 'implement'), pf = mods.find(m => m.KEY === 'palm-flat');
    const { kettlebell_swing: _k, ...rest } = imp.GAPS;
    const bad = mods.map(m => (m === imp ? { ...m, IDS: { kettlebell_swing: pf.IDS.push_up }, VARIANTS: pf.VARIANTS, GAPS: rest } : m));
    expect(() => lib12Sweep(bad)).toThrow(/sweep drawn keys: 6 items, expected 5/);                     // a gap key became a drawn key
    const { bench_dip: _b, ...pfGaps } = pf.GAPS;                                                              // a gap drawn inside a drawn key
    const bad2 = mods.map(m => (m === pf ? { ...m, IDS: { ...pf.IDS, bench_dip: pf.IDS.push_up }, GAPS: pfGaps } : m));
    expect(() => lib12Sweep(bad2)).toThrow(/palm-flat: drawn \[bear_crawl,bench_dip,.*\] gaps \[renegade_row\] differ from scope/);
  });
  it('mutation: an id in two keys is red', () => {
    const fr = mods.find(m => m.KEY === 'front-rack');
    const bad = mods.map(m => (m === fr ? { ...m, GAPS: { goblet_squat: 'x' } } : m));
    expect(() => pairs.indexOf(bad)).toThrow(/goblet_squat is in/);
  });
});

describe('LIB-12 A2 + A3: geometry per view, Right and Wrong not swapped (R8 machine half)', () => {
  it('every drawn pair and fault passes its view checks', () => {
    const list = common.sweep(drawnPairs(), 20, 'view pairs');   // palm-flat 8 x 2 faults + goblet + front squat + wall ball + battle ropes
    for (const { m, id, f } of list) expect([id, f, m.render(specOf(m, id, f)).report.problems]).toEqual([id, f, []]);
  });
  it('every drawn id and fault renders through LIB-7\'s renderPair with no problem', () => {
    const ids = mods.filter(m => m.OWNER === 'LIB-12').flatMap(m => Object.entries(m.IDS).flatMap(([id, c]: any) => c.faults.map((f: string) => [id, f])));
    for (const [id, f] of common.sweep(ids, 20, 'renderPair pairs')) expect([id, f, pairs.renderPair(id, { fault: f }).report.problems]).toEqual([id, f, []]);
  });
  it('battle_ropes renders through pairs.mjs on golden-B renderHandPair with the explicit 38 mm rope', () => {
    const r = pairs.renderPair('battle_ropes');
    expect([r.report.right.handleDiameterMm, r.report.right.thumb, r.report.wrong.thumb, r.spec.camera, r.report.camera]).toEqual([38, 'wrapped', 'wrapped', 'above', 'above']);
    expect([r.svg.includes('>SEEN FROM ABOVE<'), r.svg.includes('MACHINE')]).toEqual([true, false]);
    expect(r.svg).toContain('h-mark thin');                                     // the tendon marker on the squeezed Wrong
  });
  it('mutation: Right and Wrong swapped is red for every key', () => {
    for (const { m, id, f } of drawnPairs()) expect(m.render(specOf(m, id, f, true)).report.problems.length, `${id}/${f}`).toBeGreaterThan(0);
  });
  const red = (m: string, half: (p: any, o?: any) => any, problems: (r: any, f?: any) => string[], right: any, wrong: any, fault?: string) => {
    const rep = { right: half(right).report, wrong: half(wrong, { role: 'wrong' }).report };
    return problems(rep, fault).join('\n') || `${m}: no problem found`;
  };
  it('mutation: palm-flat Right forearm tilted 10 deg is red', () => { expect(red('pf', PF.palmFlatHalf, PF.palmFlatProblems, { forearmTilt: 10 }, { cup: 10 }, 'cupped-palm')).toMatch(/forearm 10 deg/); });
  it('mutation: palm-flat cupped Wrong with no gap is red', () => { expect(red('pf', PF.palmFlatHalf, PF.palmFlatProblems, {}, { cup: 0 }, 'cupped-palm')).toMatch(/mid-palm gap 0/); });
  it('mutation: palm-flat hand-ahead Wrong at 10 deg is red', () => { expect(red('pf', PF.palmFlatHalf, PF.palmFlatProblems, {}, { forearmTilt: 10 }, 'hand-ahead')).toMatch(/tilt 10 deg/); });
  it('mutation: goblet Right 40 mm off the chest is red', () => { expect(red('cu', CU.cuppedHalf, CU.cuppedProblems, { chestGapMm: 40 }, { chestGapMm: 60 })).toMatch(/right: weight 40 mm/); });
  it('mutation: front-rack Right bar lifted 15 mm is red', () => {
    expect(red('fr', FR.frontRackHalf, FR.frontRackProblems, { barLiftMm: 15 }, { barLiftMm: 20, barForwardMm: 40, upperArmDeg: -25, barInPalm: true })).toMatch(/right: bar 15 mm above/);
  });
  it('mutation: front-rack Wrong with the bar on the fingers is red', () => {
    expect(red('fr', FR.frontRackHalf, FR.frontRackProblems, {}, { barLiftMm: 20, barForwardMm: 40, upperArmDeg: -25, barInPalm: false })).toMatch(/bar not in the palm/);
  });
  it('mutation: wall-ball Wrong hands at 47 deg (under) is red', () => { expect(red('ba', BA.ballHalf, BA.ballProblems, {}, { contactDeg: 47, forearmDeg: 25 })).toMatch(/wrong: palm 47 deg/); });
});

describe('LIB-12 palm-flat reuses LIB-26 flat-palm rules, not flatPalm itself (D-LIB12-6)', () => {
  it('flatPalm lifts the fingertips ~15 mm off the floor at 1.75 m, which c2 rules out at close-up scale', async () => {
    const body = await import(/* @vite-ignore */ url('tools/plates/vendor/engine/body.mjs'));
    const px = (v: number) => v * 1750, r0 = px(body.RADII.fore[2]), HL = 0.108 * 1750;
    const { poly } = body.flatPalm([0, -r0], [HL, -r0], px);
    const tipLift = -Math.max(...poly.filter((p: number[]) => p[0]! > 0.9 * HL).map((p: number[]) => p[1]!));
    expect(tipLift).toBeGreaterThan(10);
  });
  it('the palm-flat Right joins its forearm at the wrist and lies on the floor from heel to fingertip', () => {
    const r = PF.palmFlatHalf({}).report;
    expect([r.lowestY, r.floorSpan >= 0.9, r.floorPoints >= 3]).toEqual([0, true, true]);
  });
});

describe('LIB-12 A4: every drawn element cites a pinned claim', () => {
  const refsOf = (m: any) => Object.values(m.VARIANTS ?? {}).flatMap((V: any) => [...V.claims, ...Object.values(V.drawn).flat(), ...Object.values(V.faults).flatMap((F: any) => F.claims)])
    .concat(Object.values(m.IDS).flatMap((c: any) => c.claims));
  const resolve = (refs: string[]) => refs.filter(r => !(r in CLAIMS.claims));
  it('the pinned extract is research 95342b1 and unchanged', () => {
    expect(CLAIMS.research).toBe('95342b1');
    expect(createHash('sha256').update(JSON.stringify(CLAIMS.claims)).digest('hex')).toBe(CLAIMS_SHA);
  });
  it('all refs resolve; every fault and drawn element has one; goblet cites only its own card', () => {
    for (const m of mods.filter(q => q.OWNER === 'LIB-12')) {
      expect([m.KEY, resolve(refsOf(m))]).toEqual([m.KEY, []]);
      for (const V of Object.values(m.VARIANTS ?? {}) as any[]) {
        for (const [k, c] of Object.entries(V.drawn)) expect([k, (c as string[]).length > 0]).toEqual([k, true]);
        for (const [k, F] of Object.entries(V.faults) as any) expect([k, F.claims.length > 0]).toEqual([k, true]);
      }
    }
    expect(refsOf(mods.find(m => m.KEY === 'cupped')).every((r: string) => r.startsWith('cards/goblet_squat.json#'))).toBe(true);
  });
  it('mutation: c99 is red; goblet citing shared/cupped-thumb.json#c2 is red', () => {
    expect(resolve(['shared/palm-flat.json#c99'])).toEqual(['shared/palm-flat.json#c99']);
    const cu = mods.find(m => m.KEY === 'cupped'), bad = { ...cu, IDS: { goblet_squat: { ...cu.IDS.goblet_squat, claims: ['shared/cupped-thumb.json#c2'] } } };
    expect(refsOf(bad).every((r: string) => r.startsWith('cards/goblet_squat.json#'))).toBe(false);
  });
});

describe('LIB-12 A6: close-up QA (H2 vocabulary, H7 determinism)', () => {
  const vocab = () => {
    const els = new Set<string>(), attrs = new Set<string>(), classes = new Set<string>();
    const PAIRS = { push: 0, pull: 0, hang: 0 };
    return import(/* @vite-ignore */ url('tools/plates/layers/engine/hand-pairs.mjs')).then((hp: any) => {
      for (const k of Object.keys(PAIRS)) {
        const svg = hand.renderHandPair({ ...hp.PAIRS[k], uid: `g-${k}` }).svg;
        for (const m of svg.matchAll(/<([a-zA-Z]+)([^>]*)>/g)) { els.add(m[1]); for (const a of m[2].matchAll(/([a-zA-Z-:]+)="/g)) attrs.add(a[1]); }
        for (const m of svg.matchAll(/class="([^"]+)"/g)) for (const c of m[1].split(' ')) classes.add(c);
      }
      return { els, attrs, classes };
    });
  };
  const cssClasses = () => new Set([...hand.HAND_CSS.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m: any) => m[1]));
  function h2(svg: string, uid: string, V: { els: Set<string>; attrs: Set<string>; classes: Set<string> }) {
    const bad: string[] = [], css = new Set([...cssClasses(), ...V.classes]), ids = [...svg.matchAll(/ id="([^"]+)"/g)].map(m => m[1]!);
    for (const m of svg.matchAll(/<([a-zA-Z]+)([^>]*)>/g)) {
      if (!V.els.has(m[1]!)) bad.push(`element ${m[1]}`);
      for (const a of m[2]!.matchAll(/([a-zA-Z-:]+)="/g)) if (!V.attrs.has(a[1]!)) bad.push(`attribute ${a[1]}`);
    }
    for (const m of svg.matchAll(/class="([^"]+)"/g)) for (const c of m[1]!.split(' ')) if (!css.has(c)) bad.push(`class ${c}`);
    if (/#[0-9a-fA-F]{3,8}\b(?!-)|rgba?\(|hsla?\(|var\(/.test(svg.replace(/url\(#[^)]+\)/g, '').replace(/href="#[^"]+"/g, ''))) bad.push('colour literal');
    if (new Set(ids).size !== ids.length) bad.push('duplicate id');
    for (const id of ids) if (!id.startsWith(uid)) bad.push(`id ${id} not prefixed ${uid}`);
    return bad;
  }
  it('H2: every LIB-12 pair uses golden-B hand vocabulary, classes of HAND_CSS or golden-B pairs only, no colour literal, uid-prefixed unique ids', async () => {
    const V = await vocab();
    for (const { m, id, f } of drawnPairs()) { const s = specOf(m, id, f); expect([id, f, h2(m.render(s).svg, s.uid, V)]).toEqual([id, f, []]); }
    const br = pairs.renderPair('battle_ropes', { uid: 't-br' });
    expect(h2(br.svg, 't-br', V)).toEqual([]);
  });
  it('mutation H2: a colour literal and a duplicated id are red', async () => {
    const V = await vocab(), m = mods.find(q => q.KEY === 'cupped'), s = specOf(m, 'goblet_squat', 'weight-away'), svg = m.render(s).svg;
    expect(h2(svg.replace('<path class="h-divider"', '<path fill="#f00" class="h-divider"'), s.uid, V)).toContain('colour literal');
    const dup = svg.replace('</defs>', `<path id="${s.uid}-r-p0" d="M0 0"/></defs>`);
    expect(h2(dup, s.uid, V)).toContain('duplicate id');
  });
  it('H7: two builds are byte-identical; mutation: a random uid differs', () => {
    for (const { m, id, f } of drawnPairs()) expect(m.render(specOf(m, id, f)).svg).toBe(m.render(specOf(m, id, f)).svg);
    const m = mods.find(q => q.KEY === 'front-rack'), s = specOf(m, 'front_squat', 'bar-off-shoulders');
    const rnd = () => m.render({ ...s, uid: `t-${Math.random().toString(36).slice(2, 8)}` }).svg;
    expect(rnd()).not.toBe(rnd());
  });
});

describe('LIB-12 A7: inputsFor covers each id\'s view files', () => {
  // What each LIB-12 id's drawing reads: its key file and, for a drawn view, the view file and view-common.
  const needs = (m: any) => [m.FILE, ...(m.VIEW === 'radial' ? [] : [`tools/plates/library/hands/view-${m.VIEW}.mjs`, 'tools/plates/library/hands/view-common.mjs'])];
  const missing = (m: any, list: string[]) => needs(m).filter(f => !list.includes(f));
  it('every drawn id lists its key file, view file and view-common, and no other LIB-12 view', () => {
    for (const m of mods.filter(q => q.OWNER === 'LIB-12')) for (const id of Object.keys(m.IDS)) {
      const ins = pairs.inputsFor(id);
      expect([id, missing(m, ins)]).toEqual([id, []]);
      expect([id, ins.filter((f: string) => /hands\/view-(?!common)/.test(f) && f !== `tools/plates/library/hands/view-${m.VIEW}.mjs`)]).toEqual([id, []]);
    }
  });
  it('mutation: a list without the view file is red', () => {
    const cu = mods.find(m => m.KEY === 'cupped'), ins = pairs.inputsFor('goblet_squat').filter((f: string) => !f.endsWith('view-cupped.mjs'));
    expect(missing(cu, ins)).toEqual(['tools/plates/library/hands/view-cupped.mjs']);
  });
});

describe('LIB-12 on LIB-7\'s pilot and critic sheet (review Blocker, #191 @ 1ff38b6)', () => {
  it('problemsOf reads each LIB-12 key\'s own checks: [] for every drawn id; a planted swap is red', async () => {
    const C = await import(/* @vite-ignore */ url('tools/plates/library/hands/checks.mjs'));
    const S = await import(/* @vite-ignore */ url('tools/plates/library/hands/sheet.mjs'));
    const ids = common.sweep(mods.filter(m => m.OWNER === 'LIB-12').flatMap(m => Object.keys(m.IDS)), 12, 'sheet ids');
    for (const id of ids) { const { spec, pages } = C.renderedPages(id, pairs.INDEX); expect([id, C.problemsOf(spec, pages)]).toEqual([id, []]); }
    const idx = pairs.indexOf(S.planted(mods, [{ id: 'goblet_squat', op: 'swap' }])), { spec, pages } = C.renderedPages('goblet_squat', idx);
    expect(C.problemsOf(spec, pages).join('\n')).toMatch(/goblet_squat\/weight-away: right: weight 60 mm off the chest/);
  });
  it('buildSheet runs with every module loaded, shows every LIB-12 id and resolves every LIB-12 claim', async () => {
    const S = await import(/* @vite-ignore */ url('tools/plates/library/hands/sheet.mjs'));
    const html = JSON.stringify(await S.buildSheet());
    for (const id of mods.filter(m => m.OWNER === 'LIB-12').flatMap(m => Object.keys(m.IDS))) expect([id, html.includes(id)]).toEqual([id, true]);
    const refs = Object.keys(CLAIMS.claims).filter(r => html.includes(`${r}: (unresolved)`));
    expect(refs).toEqual([]);
    for (const m of mods.filter(q => q.OWNER === 'LIB-12' && Object.keys(q.IDS).length)) expect([m.KEY, m.FLAGS]).toEqual([m.KEY, ['sizes and pose values: drawing values (D-LIB12-2, D-LIB12-9)']]);
    expect(html.includes('sizes and pose values: drawing values (D-LIB12-2, D-LIB12-9)')).toBe(true);
  }, 180_000);
});

describe('LIB-12 A1: golden B\'s 8 close-ups unchanged with every hand-*.mjs loaded', () => {
  it('compareCloseups on the 8 === [] after all key modules are imported', async () => {
    expect(mods.filter(m => m.OWNER === 'LIB-12').length).toBe(8);
    const cmp = await import(/* @vite-ignore */ url('tools/plates/library/render/compare.mjs'));
    const opts = (await import(/* @vite-ignore */ url('tools/plates/library/render/closeups-8.mjs'))).CLOSEUP_OPTIONS;
    expect(await cmp.compareCloseups(Object.keys(opts), opts)).toEqual([]);
  }, 180_000);
  it('mutation: a module that scales HAND_PROP on import changes a golden-B close-up', async () => {
    const cmp = await import(/* @vite-ignore */ url('tools/plates/library/render/compare.mjs'));
    const opts = (await import(/* @vite-ignore */ url('tools/plates/library/render/closeups-8.mjs'))).CLOSEUP_OPTIONS;
    const seg = hand.HAND_PROP.index.seg, keep = seg[0];
    seg[0] = keep * 1.01;
    try { expect((await cmp.compareCloseups(['seated_cable_row'], opts)).length).toBeGreaterThan(0); } finally { seg[0] = keep; }
  }, 120_000);
});

const CLAIMS_SHA = '6ad0a1da3c26819b875361f36db041889c38f83f0976983a175c834e63a54cf6';
