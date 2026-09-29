// FG-1: the front figure (A1-A4). Node build of the SVG markup; transforms composed by tests/formguide/svgWalk.ts.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { THEMES, THEME_IDS, themeToCss } from '@/theme/themes';
import { JOINTS } from '@/formguide/rig/joints';
import { figureFront } from '@/formguide/rig/figureFront';
import { themeReader, bodyPal, mix, FIGURE_TOKENS } from '@/formguide/rig/paint';
import { applyPose, bindFigure, css, frontFrame, handAt, type Frame, type StyleTarget } from '@/formguide/rig/pose';
import { at, walk } from './svgWalk';
import { colourLiterals } from './colourLint';
import { deltaEHex } from './deltaE';
import { MOMENTS, labChannels, pose2d, screenFist } from './fixtures/labFront';

const build = (theme = THEME_IDS[0]!, mistake = false) => figureFront(themeReader(theme), { id: 'fg0', mistake, dumbbell: { kg: 7 } });
const cssOf = (f: Frame) => (k: string) => (f[k]?.ops ? css(f[k]!.ops!) : undefined);

describe('A1 the front figure renders in every theme from tokens only', () => {
  it.each(THEME_IDS)('%s: well formed, 17 joint groups, every var() is a theme or figure token', id => {
    const svg = build(id), w = walk(svg, () => undefined);
    const joints = w.classes.filter(c => c.startsWith('fg-j ')).map(c => c.slice('fg-j j-'.length));
    expect(joints.sort()).toEqual([...JOINTS].sort());
    const defined = new Set([...themeToCss(THEMES[id]).matchAll(/(--[\w-]+):/g)].map(m => m[1]!));
    for (const v of ['--l', '--d', '--oc', '--sp', '--rim', '--ph']) defined.add(v);   // set on the figure's root
    const used = [...new Set([...svg.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]!))];
    expect(used.filter(v => !defined.has(v))).toEqual([]);
    // every url(#id) points at a gradient the figure defines
    const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!));
    expect([...svg.matchAll(/url\(#([^)]+)\)/g)].map(m => m[1]!).filter(r => !ids.has(r))).toEqual([]);
  });
  it('every resolved colour in the markup is a theme token or a paint.ts mix of one', () => {
    for (const id of THEME_IDS) {
      const read = themeReader(id), allowed = new Set<string>();
      for (const m of [false, true]) Object.values(bodyPal(read, m)).forEach(c => allowed.add(c));
      for (const t of Object.keys(FIGURE_TOKENS) as (keyof typeof FIGURE_TOKENS)[]) if (read(t).startsWith('#')) { allowed.add(mix(read, t, 'white', 0)); allowed.add(mix(read, t, 'white', 1)); }
      allowed.add(mix(read, 'pants-hi', 'white', 0.22));
      for (const svg of [build(id), build(id, true)]) {
        const hex = [...svg.matchAll(/#[0-9a-f]{6}\b/gi)].map(m => m[0]);
        expect(hex.length).toBeGreaterThan(0);
        expect(hex.filter(h => !allowed.has(h))).toEqual([]);
        expect(colourLiterals(svg, { hex: false })).toEqual([]);
      }
    }
  });
  it('the markup lint catches a planted named colour or colour function (review finding 1)', () => {
    const svg = build();
    for (const [from, to] of [['fill="none"', 'fill="white"'], ['fill="none"', 'stroke="oklch(0.5 0.1 20)"'], ['fill="none"', 'fill="lab(50% 40 59)"'],
      ['fill="none"', 'style="color:red"'], ['fill="none"', 'fill="color-mix(in srgb, red, blue)"'], ['fill="none"', 'fill="hwb(1 2% 3%)"']] as const) {
      expect(svg).toContain(from);
      expect(colourLiterals(svg.replace(from, to), { hex: false }), to).not.toEqual([]);
    }
  });
  it('the body follows --accent (each theme paints differently) and the mistake follows --mistake', () => {
    const bases = THEME_IDS.map(id => bodyPal(themeReader(id), false).base);
    expect(bases).toEqual(THEME_IDS.map(id => THEMES[id].tokens.accent.toLowerCase()));
    expect(bodyPal(themeReader('paper'), true).base).toBe(mix(themeReader('paper'), { from: 'accent', toward: 'mistake', t: 0.62 }, 'white', 0));
    expect(build('paper', true)).not.toBe(build('paper'));
  });
  // Review finding 2: in Ember accent = negative, so a mistake tinted toward --negative painted like the correct figure.
  // CIEDE2000 >= 15 is a clear, at-a-glance difference (2.3 is just noticeable; graphic-arts tolerances stop near 5).
  it.each(THEME_IDS)('%s: the mistake body is clearly a different colour from the correct body (CIEDE2000 >= 15)', id => {
    const read = themeReader(id), dE = deltaEHex(bodyPal(read, false).base, bodyPal(read, true).base);
    console.info(`[FG-1] ${id}: mistake vs correct body base CIEDE2000 ${dE.toFixed(1)}`);
    expect(dE).toBeGreaterThanOrEqual(15);
    // the keep-quiet warning paints in --mistake and must not vanish into the mistake body (>= 10: plainly visible)
    expect(build(id, true)).toContain('fill="var(--mistake)"');
    const warn = deltaEHex(bodyPal(read, true).base, read('mistake').toLowerCase());
    console.info(`[FG-1] ${id}: keep-quiet warning vs mistake body CIEDE2000 ${warn.toFixed(1)}`);
    expect(warn).toBeGreaterThanOrEqual(10);
  });
  it('--mistake equals --negative wherever --negative already differs from --accent', () => {
    for (const id of THEME_IDS) {
      const t = THEMES[id].tokens;
      if (t.negative.toLowerCase() !== t.accent.toLowerCase()) expect(t.mistake, id).toBe(t.negative);
      else expect(deltaEHex(t.mistake.toLowerCase(), t.accent.toLowerCase()), id).toBeGreaterThanOrEqual(25);
    }
  });
});

describe('A2 budgets', () => {
  it('path count at most 260 (§3 hard cap) and figureFront.ts at most 10 KB gzip', () => {
    const w = walk(build(), () => undefined);
    const paths = w.tags.path ?? 0;
    console.info(`[FG-1] front figure: ${paths} paths, ${w.tags.polygon ?? 0} polygons, ${w.tags.ellipse ?? 0} ellipses, ${w.tags.text ?? 0} texts; markup ${build().length} B`);
    expect(paths).toBeLessThanOrEqual(260);
    const gz = gzipSync(readFileSync('src/formguide/rig/figureFront.ts')).length;
    console.info(`[FG-1] figureFront.ts gzip ${gz} B`);
    expect(gz).toBeLessThanOrEqual(10 * 1024);
  });
});

describe('A3 the lab key moments: the right hand within 1 unit of the lab', () => {
  it.each(MOMENTS)('%s (%s, t=%s s)', (_n, mode, t) => {
    const Q = pose2d(mode, t, 0), lab = screenFist(Q);
    const f = frontFrame('standing', labChannels(Q));
    // from the markup and the written CSS, composed as the browser does
    const w = walk(build('silent-black', mode === 'mistake'), cssOf(f));
    const M = w.frames.wrist_r!, hand: [number, number] = [M[4], M[5]];
    const err = Math.hypot(hand[0] - lab[0], hand[1] - lab[1]);
    console.info(`[FG-1] ${_n}: lab hand (${lab[0].toFixed(3)}, ${lab[1].toFixed(3)}), rig ${err.toFixed(4)} units off`);
    expect(err).toBeLessThan(1);
    // and the rig's own forward kinematics agree with the markup (the CSS text is written to 1e-4)
    const fk = handAt(f, 'r');
    expect(Math.hypot(fk[0] - hand[0], fk[1] - hand[1])).toBeLessThan(0.01);
  });
  it('the left hand mirrors the right about the body centre line when sway is zero', () => {
    const f = frontFrame('standing', { ...labChannels(pose2d('correct', 1.2, 0)), sway: 0 });
    const r = handAt(f, 'r'), l = handAt(f, 'l');
    expect(l[0]).toBeCloseTo(400 - r[0], 6);
    expect(l[1]).toBeCloseTo(r[1], 6);
  });
  it('seated: the feet stay on the floor and the hips drop by the fore-shortened thighs', () => {
    const f = frontFrame('seated', {});
    const w = walk(build(), cssOf(f));
    for (const s of ['r', 'l']) {
      const A = w.frames[`ankle_${s}`]!;
      expect(at(A, 228, 566)[1]).toBeCloseTo(566, 2);   // the sole's floor line stays on the floor (CSS text to 1e-4)
    }
    expect(w.frames.pelvis![5]).toBeGreaterThan(100);
  });
});

describe('A4 applyPose writes only transform and opacity', () => {
  const fakes = (keys: string[]) => {
    const writes: string[] = [];
    const el = (k: string): StyleTarget => new Proxy({ style: new Proxy({} as StyleTarget['style'], { set: (o, p, v) => { writes.push(`${k}.${String(p)}`); (o as Record<string, unknown>)[p as string] = v; return true; }, get: () => { throw new Error('read'); } }) }, {
      get: (o, p) => { if (p !== 'style') throw new Error(`touched ${k}.${String(p)}`); return o.style; },
      set: (_o, p) => { throw new Error(`set ${k}.${String(p)}`); },
    });
    return { els: Object.fromEntries(keys.map(k => [k, el(k)])), writes };
  };
  it('walks every write of every key for the lab moments and a tinted pose', () => {
    const svg = build();
    // bind from the markup's classes through bindFigure, with a node stand-in for querySelectorAll
    const classes = walk(svg, () => undefined).classes.filter(c => /\bfg-[jp]\b/.test(c));
    const root = { querySelectorAll: (sel: string) => classes.filter(c => c.split(' ').includes(sel.slice(1))).map(c => ({ classList: c.split(' ') })) } as unknown as ParentNode;
    const bound = Object.keys(bindFigure(root));
    const tints = { 't-side_delts_r': 0.4, 'b-side_delts_r': 0.9, 't-upper_traps_l': 0.2 };
    for (const [, mode, t] of MOMENTS) {
      const f = frontFrame('standing', labChannels(pose2d(mode, t, 0)), tints);
      expect(Object.keys(f).filter(k => !bound.includes(k))).toEqual([]);    // every frame key has a group
      const { els, writes } = fakes(bound);
      applyPose(els, f);
      expect(writes.length).toBe(Object.keys(f).length);
      expect(writes.map(w => w.split('.')[1]).filter(p => p !== 'transform' && p !== 'opacity')).toEqual([]);
      for (const [k, xf] of Object.entries(f)) expect(writes).toContain(`${k}.${xf.ops ? 'transform' : 'opacity'}`);
    }
    for (const j of JOINTS) expect(bound).toContain(j);
  });
});
