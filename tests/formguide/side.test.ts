// FG-6: the side figure (docs/FORM-GUIDE-PRODUCTION.md §3). A1 path budget, A2 bench press and squat stills inside the
// camera, A3 every side muscle has its overlay pair, the mirror rule, the arm layering, the supine and prone poses
// through every §5 check (the side rig wired into check/view.ts rigFor here, as the PR asks the supervisor to wire it).
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { THEMES, THEME_IDS, themeToCss } from '@/theme/themes';
import { CHANNELS, JOINTS, type ChannelId, type Pose } from '@/formguide/rig/joints';
import { FLOOR } from '@/formguide/rig/figureFront';
import { SIDE_MUSCLES, figureSide } from '@/formguide/rig/figureSide';
import { bodyPal, mix, themeReader, FIGURE_TOKENS } from '@/formguide/rig/paint';
import { SIDE_POSE_IDS, sideFrame, sideGuideRig, sideHandAt, sidePivot, sidePoint, solveSideArm, applyPose, bindFigure, css, type Frame, type StyleTarget } from '@/formguide/rig/pose';
import { OVERLAYS } from '@/formguide/check/overlays';
import { bbox, compile, countPaths, colourLiterals } from '@/formguide/check/svg';
import { VIEWBOXES, type ExerciseGuide } from '@/formguide/model';
import { STILLS, stillMarkup } from './sideGallery';
import { walk } from './svgWalk';

vi.mock('@/formguide/check/view', async orig => {
  const m = await orig<typeof import('@/formguide/check/view')>();
  const { sideGuideRig: side } = await import('@/formguide/rig/pose');
  return { ...m, rigFor: (g: ExerciseGuide, view: Parameters<typeof m.rigFor>[1]) => (view === 'side' ? side(g) : m.rigFor(g, view)) };
});

const read = themeReader('silent-black');
const build = (o: Partial<Parameters<typeof figureSide>[1]> = {}, theme = read) => figureSide(theme, { id: 'fs', ...o });
const cssOf = (f: Frame) => (k: string) => (f[k]?.ops ? css(f[k]!.ops!) : undefined);
const swap = (p: Pose): Pose => Object.fromEntries(Object.entries(p).map(([k, v]) => [k.replace(/_([lr])$/, (_m, s: string) => (s === 'l' ? '_r' : '_l')), v]));
/** An asymmetric pose, so a missed side swap shows. */
const ASYM: Pose = { shoulder_flex_r: 70, elbow_flex_r: 40, shoulder_flex_l: -20, elbow_flex_l: 100, hip_flex_r: 30, knee_flex_r: 45, ankle_flex_r: 10, hip_flex_l: -10, knee_flex_l: 5, torso_lean: -12, breath: 0.8 };

describe('A1 the side figure is at most 260 paths', () => {
  it('path count recorded and within the §3 hard cap; the source within 10 KB gzip', () => {
    const n = countPaths(build());
    console.info(`[FG-6] side figure: ${n} paths (mistake ${countPaths(build({ mistake: true }))}, mirrored ${countPaths(build({ mirror: true }))}); figureSide.ts gzip ${gzipSync(readFileSync('src/formguide/rig/figureSide.ts')).length} B`);
    expect(n).toBeLessThanOrEqual(260);
    expect(countPaths(build({ mistake: true }))).toBe(n);
    expect(countPaths(build({ mirror: true }))).toBe(n);
    expect(gzipSync(readFileSync('src/formguide/rig/figureSide.ts')).length).toBeLessThanOrEqual(10 * 1024);
  });
  it('the budget test bites: a figure padded past 260 paths fails it', () => {
    const padded = build() + '<path d="M0 0h1"/>'.repeat(261 - countPaths(build()));
    expect(countPaths(padded)).toBeGreaterThan(260);
  });
});

describe('the side figure paints from tokens in every theme', () => {
  it.each(THEME_IDS)('%s: 17 joint groups, every var() defined, every url(#) defined, every colour a token or a paint.ts mix', id => {
    const r = themeReader(id), svg = figureSide(r, { id: 'fs' }), w = walk(svg, () => undefined);
    expect(w.classes.filter(c => c.startsWith('fg-j ')).map(c => c.slice('fg-j j-'.length)).sort()).toEqual([...JOINTS].sort());
    const defined = new Set([...themeToCss(THEMES[id]).matchAll(/(--[\w-]+):/g)].map(m => m[1]!).concat(['--l', '--d', '--oc', '--sp', '--rim', '--ph']));
    expect([...new Set([...svg.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]!))].filter(v => !defined.has(v))).toEqual([]);
    const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!));
    expect([...svg.matchAll(/url\(#([^)]+)\)/g)].map(m => m[1]!).filter(x => !ids.has(x))).toEqual([]);
    const allowed = new Set<string>();
    for (const m of [false, true]) Object.values(bodyPal(r, m)).forEach(c => allowed.add(c));
    for (const t of Object.keys(FIGURE_TOKENS) as (keyof typeof FIGURE_TOKENS)[]) if (r(t).startsWith('#')) { allowed.add(mix(r, t, 'white', 0)); allowed.add(mix(r, t, 'white', 1)); }
    allowed.add(mix(r, 'pants-hi', 'white', 0.22));
    for (const s of [svg, figureSide(r, { id: 'fs', mistake: true })]) {
      expect([...s.matchAll(/#[0-9a-f]{6}\b/gi)].map(m => m[0]).filter(h => !allowed.has(h))).toEqual([]);
      expect(colourLiterals(s, { hex: false })).toEqual([]);
    }
  });
});

describe('A2 bench press and squat stills sit inside the standing camera', () => {
  const vb = VIEWBOXES.standingFront;
  it.each(STILLS.map(s => [s().name, s] as const))('%s', (_n, make) => {
    const s = make(), fig = bbox(compile(build({ mirror: s.o.mirror })), s.frame), eq = s.parts.map(p => bbox(compile(p), {}));
    const b = [fig, ...eq].reduce((a, c) => ({ x0: Math.min(a.x0, c.x0), y0: Math.min(a.y0, c.y0), x1: Math.max(a.x1, c.x1), y1: Math.max(a.y1, c.y1) }));
    console.info(`[FG-6] ${s.name}: box ${b.x0.toFixed(1)},${b.y0.toFixed(1)}..${b.x1.toFixed(1)},${b.y1.toFixed(1)} in [${vb.join(' ')}]`);
    expect(b.x0).toBeGreaterThanOrEqual(vb[0]); expect(b.y0).toBeGreaterThanOrEqual(vb[1]);
    expect(b.x1).toBeLessThanOrEqual(vb[0] + vb[2]); expect(b.y1).toBeLessThanOrEqual(vb[1] + vb[3]);
    // the posed markup carries the frame as inline CSS transforms (as the player writes them), one per frame key
    const posedSvg = stillMarkup('silent-black', s);
    expect((posedSvg.match(/;transform:/g) ?? []).length).toBe(Object.values(s.frame).filter(x => x.ops).length);
  });
  it('the bench press grips the bar: the hand is the bar centre, the back is on the pad, the feet on the floor', () => {
    for (const make of STILLS.slice(0, 2)) {
      const s = make(), hand = sideHandAt(s.frame, 'r');
      expect(Math.hypot(s.aim![0] - hand[0], s.aim![1] - hand[1])).toBeLessThan(0.01);
      expect(sidePoint(s.frame, 'back')[1]).toBeLessThanOrEqual(FLOOR - 133.32 + 1e-6);
      expect(sidePoint(s.frame, 'foot_r')[1]).toBeCloseTo(FLOOR, 1);
    }
  });
  it('the squat keeps the near foot flat on its spot and the bar on the traps', () => {
    const top = STILLS[2]!(), bottom = STILLS[3]!();
    for (const s of [top, bottom]) {
      expect(sidePoint(s.frame, 'foot_r')[0]).toBeCloseTo(206, 6);
      expect(sidePoint(s.frame, 'foot_r')[1]).toBeCloseTo(FLOOR, 6);
      const h = sideHandAt(s.frame, 'r'), bar = sidePoint(s.frame, 'shoulder_r');
      expect(Math.hypot(h[0] - bar[0], h[1] - bar[1])).toBeLessThan(0.01);
    }
    expect(sidePivot(bottom.frame, 'pelvis')[1]).toBeGreaterThan(sidePivot(top.frame, 'pelvis')[1] + 100);   // the hips drop
  });
});

describe('A3 every muscle of the side list has an overlay', () => {
  it('the drawn list is §3\'s side list, and every one has a tint and a band on the near side, both facings', () => {
    expect([...SIDE_MUSCLES].sort()).toEqual([...OVERLAYS.side].sort());
    for (const [mirror, near] of [[false, 'r'], [true, 'l']] as const) {
      const svg = build({ mirror });
      for (const m of OVERLAYS.side) for (const k of ['t', 'b']) expect(svg, `${k}-${m}_${near}`).toMatch(new RegExp(`class="fg-p fg-${k}-${m}_${near}"[^>]*opacity="0"`));
    }
  });
  it('the check bites: removing one overlay is caught', () => {
    const svg = build().replace(/<path class="fg-p fg-t-calves_r"[^>]*\/>/, '');
    const missing = OVERLAYS.side.filter(m => !svg.includes(`fg-t-${m}_r"`));
    expect(missing).toEqual(['calves']);
  });
  it('roles paint the tint: target, help, and quiet (mistake colour on the mistake figure)', () => {
    const svg = build({ roles: { chest: 'target', triceps: 'help', lower_back: 'quiet' } });
    expect(svg).toMatch(/fg-t-chest_r" d="[^"]+" fill="var\(--target\)"/);
    expect(svg).toMatch(/fg-t-triceps_r" d="[^"]+" fill="var\(--help\)"/);
    expect(svg).toMatch(/fg-t-lower_back_r" d="[^"]+" fill="var\(--quiet\)"/);
    expect(build({ mistake: true, roles: { lower_back: 'quiet' } })).toMatch(/fg-t-lower_back_r" d="[^"]+" fill="var\(--mistake\)"/);
  });
});

describe('the mirror rule: facing left is the drawing reflected about x = 200 with the sides swapped', () => {
  const pts = ['hand_r', 'hand_l', 'foot_r', 'foot_l', 'back', 'hip', 'shoulder_r', 'knee_l', 'ankle_r'] as const;
  const flip = (a: string) => a.replace(/_([lr])$/, (_m, s: string) => (s === 'l' ? '_r' : '_l'));
  it.each(SIDE_POSE_IDS)('%s: every attachment point and joint mirrors its swapped twin', id => {
    const f = sideFrame(id, ASYM), g = sideFrame(id, swap(ASYM), { mirror: true });
    for (const a of pts) {
      const p = sidePoint(f, a), q = sidePoint(g, flip(a) as typeof a, true);
      expect(q[0], a).toBeCloseTo(400 - p[0], 6); expect(q[1], a).toBeCloseTo(p[1], 6);
    }
    for (const j of JOINTS) { const p = sidePivot(f, j), q = sidePivot(g, flip(j) as typeof j, true); expect(q[0], j).toBeCloseTo(400 - p[0], 6); expect(q[1], j).toBeCloseTo(p[1], 6); }
  });
  it('the markup agrees: the mirrored figure is wrapped in the mirror and names its near limbs _l', () => {
    const f = sideFrame('standing', ASYM), g = sideFrame('standing', swap(ASYM), { mirror: true });
    const a = walk(build(), cssOf(f)), b = walk(build({ mirror: true }), cssOf(g));
    for (const j of JOINTS) { const p = a.frames[j]!, q = b.frames[flip(j)]!; expect(q[4], j).toBeCloseTo(400 - p[4], 3); expect(q[5], j).toBeCloseTo(p[5], 3); }
    const nearArm = (svg: string) => /<g class="fg-arms-front"><g class="fg-j j-(shoulder_[lr])"/.exec(svg)?.[1];
    expect(nearArm(build())).toBe('shoulder_r');
    expect(nearArm(build({ mirror: true }))).toBe('shoulder_l');
  });
  it('the rule bites: without the side swap the mirrored figure does not match', () => {
    const f = sideFrame('standing', ASYM), g = sideFrame('standing', ASYM, { mirror: true });
    const p = sidePoint(f, 'hand_r'), q = sidePoint(g, 'hand_l', true);
    expect(Math.abs(q[0] - (400 - p[0])) + Math.abs(q[1] - p[1])).toBeGreaterThan(5);
  });
});

describe('arm layering: the far arm behind the trunk, the near arm in front of everything', () => {
  it.each([false, true])('mirror %s', mirror => {
    const svg = build({ mirror }), near = mirror ? 'l' : 'r', far = mirror ? 'r' : 'l';
    const order = (re: RegExp) => svg.search(re);
    const behind = order(/<g class="fg-arms-behind">/), trunk = order(/class="fg-p fg-breath"/), nearLeg = order(new RegExp(`class="fg-j j-hip_${near}"`));
    const hips = order(new RegExp(`fg-t-glutes_${near}`)), front = order(/<g class="fg-arms-front">/);
    expect(svg.slice(behind, trunk)).toMatch(new RegExp(`j-shoulder_${far}"`));
    expect(behind).toBeLessThan(trunk); expect(trunk).toBeLessThan(nearLeg); expect(nearLeg).toBeLessThan(hips); expect(hips).toBeLessThan(front);
    expect(svg.slice(front)).toMatch(new RegExp(`^<g class="fg-arms-front"><g class="fg-j j-shoulder_${near}"`));
    expect(svg.slice(front).match(/fg-j j-shoulder_/g)).toHaveLength(1);   // the near arm is the last thing drawn
  });
  it('the near arm moves as a child of the chest though it sits in the pelvis group', () => {
    const f = sideFrame('standing', { ...ASYM, torso_lean: -30 }), w = walk(build(), cssOf(f));
    for (const j of ['shoulder_r', 'elbow_r', 'wrist_r'] as const) {
      const fk = sidePivot(f, j), M = w.frames[j]!;
      expect(Math.hypot(M[4] - fk[0], M[5] - fk[1]), j).toBeLessThan(0.05);   // the CSS text is written to 1e-4 per matrix entry
    }
    // leaning the trunk carries the near shoulder with it
    expect(sidePivot(sideFrame('standing', { torso_lean: -30 }), 'shoulder_r')[0]).toBeGreaterThan(sidePivot(sideFrame('standing', {}), 'shoulder_r')[0] + 50);
  });
  it('the layer channel toggles nothing in the side view (§3: the near arm is always in front)', () => {
    expect(sideFrame('standing', { layer: 1 })).toEqual(sideFrame('standing', { layer: 0 }));
  });
});

describe('poses and the arm solve', () => {
  it('lying poses rest on their surface; standing and seated keep the feet on the floor', () => {
    const sup = sideFrame('lying_supine', {}), pr = sideFrame('lying_prone', {});
    expect(Math.max(sidePoint(sup, 'hip')[1], sidePoint(sup, 'back')[1])).toBeCloseTo(FLOOR, 6);
    expect(sidePivot(sup, 'head')[0]).toBeLessThan(sidePivot(sup, 'pelvis')[0]);   // supine: head to the left
    expect(sidePivot(pr, 'head')[0]).toBeGreaterThan(sidePivot(pr, 'pelvis')[0]);  // prone: head to the right, face down
    const bench = sideFrame('lying_supine', {}, { surface: 400 });
    expect(Math.max(sidePoint(bench, 'hip')[1], sidePoint(bench, 'back')[1])).toBeCloseTo(400, 6);
    expect(sidePoint(sideFrame('seated', {}), 'foot_r')[1]).toBeCloseTo(FLOOR, 6);
  });
  it.each([[80, 60], [30, 120], [-30, 10]])('solveSideArm finds shoulder %s°, elbow %s° again from the hand', (sf, ef) => {
    for (const mirror of [false, true]) {
      const pose: Pose = { torso_lean: -15, shoulder_flex_l: sf, elbow_flex_l: ef, shoulder_flex_r: sf, elbow_flex_r: ef };
      const s = mirror ? 'l' : 'r', hand = sideHandAt(sideFrame('standing', pose, { mirror }), s, mirror);
      const got = solveSideArm('standing', { torso_lean: -15 }, s, hand, { mirror });
      expect(got.shoulder_flex).toBeCloseTo(sf, 6); expect(got.elbow_flex).toBeCloseTo(ef, 6);
    }
  });
  it('writes only transform and opacity, one write per key, every key bound', () => {
    const svg = build(), classes = walk(svg, () => undefined).classes.filter(c => /\bfg-[jp]\b/.test(c));
    const root = { querySelectorAll: (sel: string) => classes.filter(c => c.split(' ').includes(sel.slice(1))).map(c => ({ classList: c.split(' ') })) } as unknown as ParentNode;
    const bound = bindFigure(root), writes: string[] = [];
    const els = Object.fromEntries(Object.keys(bound).map(k => [k, { style: new Proxy({}, { set: (_o, p) => { writes.push(`${k}.${String(p)}`); return true; } }) } as unknown as StyleTarget]));
    const f = sideFrame('lying_supine', ASYM, {}, { 't-chest_r': 0.5, 'b-chest_r': 0.9 });
    expect(Object.keys(f).filter(k => !(k in bound))).toEqual([]);
    applyPose(els, f);
    expect(writes.length).toBe(Object.keys(f).length);
    expect(writes.filter(w => !/\.(transform|opacity)$/.test(w))).toEqual([]);
  });
  it('every channel at its AAOS ends gives finite transforms in every side pose', () => {
    for (const id of SIDE_POSE_IDS) for (const v of [-80, 0, 150]) {
      const p = Object.fromEntries(CHANNELS.map(c => [c, v])) as Record<ChannelId, number>;
      for (const [k, x] of Object.entries(sideFrame(id, p))) expect(x.ops!.flat().filter(n => typeof n === 'number').every(Number.isFinite), `${id} ${k}`).toBe(true);
    }
  });
});

describe('supine and prone files pass every §5 check through the side rig', () => {
  it.each(['lib_barbell_bench_press', 'lib_superman'])('%s', async id => {
    const { runChecks, report, CHECKS } = await import('@/formguide/check');
    const { inputFor, guideOf } = await import('@/formguide/check/node');
    const path = `tests/formguide/fixtures/side/${id}/${id}.ts`, g = guideOf(await import(`./fixtures/side/${id}/${id}.ts`), path);
    expect(typeof sideGuideRig(g)).toBe('object');
    const rs = runChecks(inputFor(path, g));
    console.info(report(id, rs));
    expect(rs.map(r => r.check)).toEqual([...CHECKS]);
    expect(rs.filter(r => !r.ok).flatMap(r => r.fails)).toEqual([]);
  });
});
