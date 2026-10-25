// LIB-11 (lib-11-card Do 2, Do 3, Do 4; acceptance A2, A3, A5, A7, A9, A13): the pilot B build-ahead plates. Node only:
// the browser half of the plate QA runs in tools/plates/library/pilot-b/qa.mjs. Every test reads what is drawn (the
// items a spec emits, the engine's landmarks and report), never a helper's own maths.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const PILOT_B = ['smith_machine_bench_press', 'cable_fly', 'push_up', 'seated_leg_curl', 'crunch'];
const DRAWN = ['smith_machine_bench_press', 'seated_leg_curl', 'cable_fly', 'push_up'];   // drawn, not held (batches/pilot-b.json)
const HELD = ['crunch'];                                                       // D-LIB11-SMALL (DESIGN.md section 13)
const ROWS = 'tools/plates/library/batches/pilot-b.json';   // pilot-b/rows.json until the pin (Do 11)
const COMPOSERS = ['smith', 'legCurlMachine'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

let eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, reg: any, pins: any;
const mods: Record<string, any> = {};
beforeAll(async () => {
  [eng, body, qaNode, qaEng, qaIdx, plate, closure, reg] = await Promise.all([
    'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'registry.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  pins = qaIdx.loadPins();
  for (const id of [...new Set([...DRAWN, ...HELD])]) mods[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
}, T);
const spec = (id: string) => mods[id].default;

const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const posesOf = (s: any) => ['start', 'end', ...(s.mistake?.pose ? ['mistake'] : [])];
/** Every equipment item a spec draws in one pose (functions called as the engine calls them). */
const itemsIn = (s: any, pose: string, { mistake = pose === 'mistake' } = {}) => {
  const L = qaEng.poseLandmarks(Eng(), s), lm = L.lm[pose] ?? null;
  const ctx = { pose, start: L.lm.start, mistake, body: L.body };
  const out: any[] = [];
  s.equipment.forEach((e: any, i: number) => {
    for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
  });
  return { items: out, lm };
};
const h9 = (s: any) => {
  let R: any = null;
  try { R = { normal: plate.renderPlate(s, { id: 'x-n' }), mistake: plate.renderPlate(s, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec: s, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins.envelope }, R).map((p: any) => p.key);
};
/** A sideBar item's centre line ends (eq/parts.mjs: a backPad in its surface form, the line shifted t/2 along its normal). */
const barLine = (it: any): [number[], number[]] => {
  const [hi, lo] = it.surface, u = [0, hi[1] - lo[1], hi[2] - lo[2]], k = Math.hypot(u[1]!, u[2]!), n = [0, -u[2]! / k, u[1]! / k];
  const o = n.map(v => v * it.t / 2);
  return [lo.map((v: number, i: number) => v - o[i]!), hi.map((v: number, i: number) => v - o[i]!)];
};

describe('LIB-11 A2 / Do 3: the slice plates and composers draw PRIMITIVES only', { timeout: T }, () => {
  it('composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const f of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${f}.mjs`, 'utf8');
      expect(src, f).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, f).not.toMatch(/layers\//);
    }
  });
  it('every item each plate draws is a PRIMITIVES type, in every drawn pose; PQ-H9 passes', () => {
    for (const id of [...DRAWN, ...HELD]) {
      for (const pose of posesOf(spec(id))) for (const it of itemsIn(spec(id), pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
      expect(h9(spec(id)), id).toEqual([]);
    }
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = spec('smith_machine_bench_press');
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws each drawn plate with no engine issue and every check and contact within tolerance', () => {
    for (const id of DRAWN) {
      const r = plate.renderPlate(spec(id), { id: 'x' }).report;
      expect(r.issues ?? [], id).toEqual([]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(1);
      for (const c of r.checks) if ('aboveCm' in c) expect(c.aboveCm, `${id} ${c.landmark} ${c.pose}`).toBeGreaterThan(0);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-11 A2 / A13: smith on smith_machine_bench_press, per drawn pose (c4, c5, c8; R10)', { timeout: T }, () => {
  const id = 'smith_machine_bench_press';
  /** The rig as drawn in one pose: the rod's line, the bar end (the `bar` pulley), the hook, the hook rail, the stop. */
  const rigIn = (items: any[]) => ({
    rod: items.filter(it => it.type === 'backPad' && it.surface && Math.abs(it.t - 0.03) < 1e-9).map(barLine),
    bar: items.filter(it => it.type === 'pulley' && it.part === 'bar'),
    hook: items.filter(it => it.type === 'poly' && it.part === 'hook'),
    rail: items.filter(it => it.type === 'rackUpright'),
    stop: items.filter(it => it.type === 'box'),
  });
  /** Problems with one pose's drawn rig: the bar centre on the rod's one vertical line (c8), the hook reaching the hook
   *  rail's face (c5), the stop's top under the bar's lowest drawn point (c4), and the rod clear of the neck (R10). */
  const smithProblems = (items: any[], lm: any) => {
    const g = rigIn(items), out: string[] = [];
    if (g.rod.length !== 1 || g.bar.length !== 1 || g.hook.length !== 1 || g.rail.length !== 1 || g.stop.length !== 1) return [`parts: rod ${g.rod.length}, bar ${g.bar.length}, hook ${g.hook.length}, rail ${g.rail.length}, stop ${g.stop.length}`];
    const [a, b] = g.rod[0]!, bar = g.bar[0], z = a[2]!;
    if (Math.abs(b[2]! - z) > 1e-6) out.push(`rod not vertical: ${a[2]} -> ${b[2]}`);
    if (Math.abs(bar.at[2] - z) > 0.005) out.push(`bar ${((bar.at[2] - z) * 100).toFixed(1)} cm off the rod line`);
    const face = g.rail[0].at[2] - 0.076 / 2, hookZ = Math.max(...g.hook[0].pts.map((p: number[]) => p[2]));
    if (Math.abs(hookZ - face) > 0.005) out.push(`hook ${((hookZ - face) * 100).toFixed(1)} cm off the hook rail`);
    const stopTop = g.stop[0].at[1] + g.stop[0].h / 2;
    if (!(stopTop < bar.at[1] - bar.r)) out.push(`stop top ${stopTop.toFixed(3)} not below the bar's lowest point ${(bar.at[1] - bar.r).toFixed(3)}`);
    if (lm && !(Math.abs(z - lm.neck[2]) >= 0.15)) out.push(`rod ${((z - lm.neck[2]) * 100).toFixed(1)} cm from the neck`);
    return out;
  };
  it('in start, end and Mistake: bar on the rod line, hook on the hook rail, stop under the bar, rod clear of the neck', () => {
    for (const pose of posesOf(spec(id))) { const { items, lm } = itemsIn(spec(id), pose); expect(smithProblems(items, lm), pose).toEqual([]); }
  });
  it('the bar centre is on one vertical line across the whole drawn path (t = 0 .. 1)', () => {
    const s = spec(id), H = { height: 1.75 }, keys = [s.poses.start, ...(s.poses.via ?? []), s.poses.end].map((p: any) => body.normPose(p, H));
    const zs = [0, 0.25, 0.5, 0.75, 1].map(t => body.landmarks(body.fk(body.poseAt(keys, t, H).q, H)).grips[2]);
    for (const zz of zs) expect(Math.abs(zz - mods[id].RAIL_Z), `${zz}`).toBeLessThan(0.005);
  });
  const mutate = (pose: string, f: (it: any) => any) => { const { items, lm } = itemsIn(spec(id), pose); return smithProblems(items.map(f), lm); };
  it('mutation: the bar moved 2 cm off its line in the Mistake is red', () => {
    expect(mutate('mistake', it => (it.part === 'bar' ? { ...it, at: [it.at[0], it.at[1], it.at[2] + 0.02] } : it)).some(p => /off the rod line/.test(p))).toBe(true);
  });
  it('mutation: a hook 1 cm off its rail is red', () => {
    expect(mutate('end', it => (it.part === 'hook' ? { ...it, pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! - 0.01]) } : it)).some(p => /off the hook rail/.test(p))).toBe(true);
  });
  it('mutation: a stop raised above the bar\'s lowest point is red', () => {
    expect(mutate('end', it => (it.type === 'box' ? { ...it, at: [it.at[0], it.at[1] + 0.05, it.at[2]] } : it)).some(p => /stop top/.test(p))).toBe(true);
  });
  it('mutation (A13, R10): a stop deleted is red', () => {
    const { items, lm } = itemsIn(spec(id), 'end');
    expect(smithProblems(items.filter(it => it.type !== 'box'), lm)[0]).toMatch(/stop 0/);
  });
  it('the composer refuses a bar off the rail (c8)', async () => {
    const { smith } = await import(/* @vite-ignore */ lib('eq/smith.mjs'));
    expect(() => smith({ railZ: 0, bar: [0, 1, 0.02], stopY: 0.5 })).toThrow(/off the rail/);
  });
  it('the end elbows are at 45 deg from the torso (c3) and the Mistake elbows at about 90 (flared, c7), by the engine report', () => {
    const a = plate.renderPlate(spec(id), { id: 'x' }).report.angles, el = (p: string) => +a[p]['sh.r'].match(/elev (-?[\d.]+)/)[1];
    expect(Math.abs(el('end') - 45)).toBeLessThanOrEqual(2);
    expect(el('mistake')).toBeGreaterThan(80);
  });
});

describe('LIB-11 A2: legCurlMachine on seated_leg_curl, per drawn pose (c1, c2, c3)', { timeout: T }, () => {
  const id = 'seated_leg_curl';
  /** Problems with one pose's drawn machine against that pose's landmarks: the pivot boss within 1 cm of the knee joint
   *  (c1); the thigh pad touching the thigh just above the knee (c2); in each right pose the ankle pad on the lower leg
   *  just above the shoe (c3: in the lowest 25 % of the shank, above the ankle). */
  const legProblems = (items: any[], lm: any, right: boolean) => {
    const out: string[] = [], k = lm['knee.r'], a = lm['ankle.r'], hip = lm['hip.r'];
    const boss = items.find(it => it.type === 'pulley'), pads = items.filter(it => it.type === 'kneePad');
    const ankle = pads.find(it => it.part === 'lever'), thigh = pads.find(it => it.part !== 'lever');
    if (!boss || !ankle || !thigh) return ['parts missing'];
    const d = Math.hypot(boss.at[1] - k[1], boss.at[2] - k[2]);
    if (d > 0.01) out.push(`pivot ${(d * 100).toFixed(1)} cm from the knee`);
    // thigh pad: its contact within 1 cm of the thigh's top surface line, between 70 % and 100 % of hip→knee
    const along = (p: number[], u: number[], v: number[]): [number, number] => { const w = [v[1]! - u[1]!, v[2]! - u[2]!], L = Math.hypot(w[0]!, w[1]!); return [((p[1]! - u[1]!) * w[0]! + (p[2]! - u[2]!) * w[1]!) / (L * L), Math.abs((p[1]! - u[1]!) * w[1]! - (p[2]! - u[2]!) * w[0]!) / L]; };
    const [tt] = along(thigh.at, hip, k), top = lm['thighTop.r'];
    if (!(tt > 0.7 && tt < 1)) out.push(`thigh pad at ${tt.toFixed(2)} of the thigh`);
    if (Math.hypot(thigh.at[1] - top[1], thigh.at[2] - top[2]) > 0.01) out.push('thigh pad off the thigh');
    if (right) {
      const [ta, off] = along(ankle.at, k, a);
      if (!(ta >= 0.75 && ta < 1)) out.push(`ankle pad at ${ta.toFixed(2)} of the shank`);
      if (off > 0.06) out.push(`ankle pad ${(off * 100).toFixed(1)} cm off the shank`);
    }
    return out;
  };
  it('in start, end and Mistake: pivot at the knee, thigh pad above the knee; ankle pad above the shoe in the right poses', () => {
    for (const pose of posesOf(spec(id))) { const { items, lm } = itemsIn(spec(id), pose); expect(legProblems(items, lm, pose !== 'mistake'), pose).toEqual([]); }
  });
  const mutate = (pose: string, f: (it: any) => any) => { const { items, lm } = itemsIn(spec(id), pose); return legProblems(items.map(f), lm, pose !== 'mistake'); };
  it('mutation: the pivot moved 3 cm is red', () => {
    expect(mutate('end', it => (it.type === 'pulley' ? { ...it, at: [it.at[0], it.at[1], it.at[2] + 0.03] } : it)).some(p => /pivot/.test(p))).toBe(true);
  });
  it('mutation: the thigh pad 3 cm off the thigh is red', () => {
    expect(mutate('start', it => (it.type === 'kneePad' && it.part !== 'lever' ? { ...it, at: [it.at[0], it.at[1] + 0.03, it.at[2]] } : it)).some(p => /thigh pad/.test(p))).toBe(true);
  });
  it('mutation: the ankle pad moved 5 cm up the calf in the end pose is red', () => {
    const { lm } = itemsIn(spec(id), 'end'), k = lm['knee.r'], a = lm['ankle.r'], L = Math.hypot(a[1] - k[1], a[2] - k[2]), u = [0, (k[1] - a[1]) / L, (k[2] - a[2]) / L];
    expect(mutate('end', it => (it.part === 'lever' && it.type === 'kneePad' ? { ...it, at: it.at.map((v: number, i: number) => v + u[i]! * 0.05) } : it)).some(p => /ankle pad/.test(p))).toBe(true);
  });
});

describe('LIB-11 push_up: the floor scale (D-LIB8-floor; Q-R2-3)', { timeout: T }, () => {
  it('is pinned at 144.57 px/m (±0.5), inside F1 (no F1 raised)', () => {
    const r = plate.renderPlate(spec('push_up'), { id: 'x' }).report;
    expect(Math.abs(r.camera.pxPerM - 144.57)).toBeLessThanOrEqual(0.5);
    expect(r.camera.pxPerM).toBeLessThanOrEqual(pins.envelope.F1[1]);
  });
});

describe('LIB-11 D-LIB9-CLONE b: each copied root finder throws on a bracket with no root', () => {
  it('smith_machine_bench_press', () => {
    const m = mods.smith_machine_bench_press;
    expect(() => m.bisect((x: number) => x - 5, 0, 1)).toThrow(/no solution/);
    expect(m.bisect((x: number) => x - 0.25, 0, 1)).toBeCloseTo(0.25, 9);
  });
  it('crunch (held): its bisect', () => {
    expect(() => mods.crunch.bisect((x: number) => x - 5, 0, 1)).toThrow(/no solution/);
  });
  it('push_up: its Newton solve throws when the residual has no root', () => {
    const m = mods.push_up, pose = (q: any) => ({ root: { at: [0, q.y, 0], tilt: 0 } });
    expect(() => m.solve({ y: 1 }, pose, () => [1])).toThrow(/did not converge/);
    expect(m.solve({ y: 1 }, pose, (lm: any) => [lm.hips[1] - 0.9]).y).toBeCloseTo(0.9, 5);
  });
});

describe('LIB-11 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => [...DRAWN, ...HELD].map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
    ...c.filter(p => p.startsWith('tools/plates/library/spike/')),
  ];
  it('every pilot B spec passes', () => {
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lib11-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/smith_machine_bench_press.mjs';
  it('mutation: readFileSync added to a composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/smith.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing a pilot A or LB2 spec (another specs/ file) is red', () => {
    const root = scratch(r => {
      writeFileSync(join(r, 'tools/plates/library/specs/barbell_bench_press.mjs'), "export const supine = () => null;\nexport default {};\n");
      const p = join(r, F); writeFileSync(p, `import { supine as _s } from './barbell_bench_press.mjs';\n${readFileSync(p, 'utf8')}`);
    });
    try { expect(problems(F, closure.closureOf([F], root))).toEqual(['tools/plates/library/specs/barbell_bench_press.mjs']); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-11 A5: batches/pilot-b.json holds exactly the drawn ids that are not held', () => {
  const IDS = DRAWN.map(i => `lib_${i}`);
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of IDS) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!IDS.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  it('each drawn id exactly once in the raw text, nothing else; each held id is in DESIGN.md\'s held table', () => {
    expect(a5(readFileSync(ROWS, 'utf8'))).toEqual([]);
    const design = readFileSync('tools/plates/library/pilot-b/DESIGN.md', 'utf8'), held = design.slice(design.indexOf('## 13. Held'));
    for (const h of HELD) expect(new RegExp(`^\\| ${h} \\| .+\\| D-LIB11-SMALL`, 'm').test(held), h).toBe(true);
  });
  it('mutations: a dropped row, a duplicated row, a pilot A id and a held id added are red', () => {
    const text = readFileSync(ROWS, 'utf8'), j = readJson(ROWS);
    const drop = { ...j, rows: { ...j.rows } }; delete drop.rows.lib_cable_fly;
    expect(a5(JSON.stringify(drop, null, 1))).toEqual(['lib_cable_fly x0']);
    const dup = text.replace('  "lib_cable_fly": {', `  "lib_cable_fly": ${JSON.stringify(j.rows.lib_cable_fly)},\n  "lib_cable_fly": {`);
    expect(a5(dup)).toEqual(['lib_cable_fly x2']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_plank: j.rows.lib_cable_fly } }, null, 1))).toEqual(['extra lib_plank']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_crunch: j.rows.lib_cable_fly } }, null, 1))).toEqual(['extra lib_crunch']);
  });
  it('every row points at its own spec, carries its census view and mode H; batch PILOT-B, censusRef 4a9fd86; no template', () => {
    const j = readJson(ROWS), view: Record<string, string> = { lib_cable_fly: 'front' };
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect([r.slug, r.prefix, r.chromeId]).toEqual(Array(3).fill(id.slice(4).replace(/_/g, '-')));
      expect(r.view, id).toBe(view[id] ?? 'side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'PILOT-B', censusRef: '4a9fd86' });
    expect(existsSync('tools/plates/library/templates')).toBe(false);
  });
});

describe('LIB-11 A7 / A8: the pin (Do 11; PILOT B PIN GO #278 6393170019 @ 1d7f28d2)', { timeout: T }, () => {
  const GOLD = 'tests/howto/golden/library/pilot-b.json', PAGE = 'ff3e017c98f73b6d049808a6ffea057a7fa350eed764d9ceedb9a582fa22583f';
  const GO: Record<string, string[]> = { lib_smith_machine_bench_press: ['F5'], lib_seated_leg_curl: ['F5'], lib_cable_fly: ['F2', 'F5'], lib_push_up: ['F5'] };
  let golden: any, html = '';
  beforeAll(async () => {
    golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
    html = (await (await import(/* @vite-ignore */ lib('pilot-b/build.mjs'))).buildPbPage()).html.toString('utf8');
  }, T);
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => r.stage !== 'approved-plate').map(([id, r]) => `${id}: ${r.stage}`);
  /** The golden file against the built page and the GO: [problems]. */
  const pinProblems = (file: any, page: string) => {
    const out: string[] = [...golden.verifyBatchChain(file, readJson('tests/howto/golden/GOLDEN.json').entries)];
    const [pg, ...pl] = file.entries;
    if (pg?.kind !== 'page' || pg.pageSha256 !== PAGE || golden.sha256(page) !== PAGE || pg.bytes !== Buffer.byteLength(page)) out.push('page entry');
    const plates = golden.extractPlates(page);
    if (pl.map((e: any) => e.id).join() !== plates.map((p: any) => `lib_${p.chromeId.replace(/-/g, '_')}`).join()) out.push('plate entries are not the page\'s plates in page order');
    for (const e of pl) {
      const p = plates.find((x: any) => `lib_${x.chromeId.replace(/-/g, '_')}` === e.id);
      if (!p || JSON.stringify(e.fragments) !== JSON.stringify(golden.fragmentsOf(p))) out.push(`${e.id}: fragments`);
      if (JSON.stringify(e.exemptions) !== JSON.stringify(GO[e.id])) out.push(`${e.id}: exemptions ${e.exemptions}`);
      if (e.decision !== 'D-LIB-PILOTB' || e.approvedBy !== 'supervisor') out.push(`${e.id}: approval`);
    }
    return out;
  };
  it('every pilot B row is approved-plate, none is shipped, and the held crunch has no row', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems(rows)).toEqual([]);
    expect(Object.keys(rows).sort()).toEqual(DRAWN.map(i => `lib_${i}`).sort());
    expect(reg.shippedIds(reg.rows()).filter((i: string) => PILOT_B.includes(i.slice(4)))).toEqual([]);
    expect(readJson(ROWS).pages).toEqual({ plates: 'tools/plates/library/pages/pilot-b.json', layers: 'tests/howto/golden/library/pilot-b.layers.html', layersConfig: 'tools/plates/library/pages/pilot-b.layers.json' });
  });
  it('the golden file holds the page and the 4 plates with the GO\'s exemptions exactly; its chain is valid', () => {
    expect(pinProblems(readJson(GOLD), html)).toEqual([]);
  });
  it('the held crunch is in no batch, page or golden file', () => {
    const hits = ['tools/plates/library/batches', 'tools/plates/library/pages', 'tests/howto/golden/library'].flatMap(d => readdirSync(d).filter(n => n.endsWith('.json'))
      .filter(n => /"lib_crunch"|"library\/specs\/crunch\.mjs"|"chromeId": "crunch"/.test(readFileSync(join(d, n), 'utf8'))).map(n => `${d}/${n}`));
    expect(hits).toEqual([]);
  });
  it('mutations: a row at review, an exemption added, a fragment changed, a crunch entry and a moved page byte are red', () => {
    const rows = readJson(ROWS).rows, g = readJson(GOLD);
    expect(stageProblems({ ...rows, lib_cable_fly: { ...rows.lib_cable_fly, stage: 'review' } })).toEqual(['lib_cable_fly: review']);
    const ex = structuredClone(g); ex.entries[1].exemptions = [...ex.entries[1].exemptions, 'F1'];
    expect(pinProblems(ex, html).some(p => p.endsWith('exemptions F5,F1'))).toBe(true);
    const fr = structuredClone(g); fr.entries[2].fragments.mistakeSvg = '0'.repeat(64);
    expect(pinProblems(fr, html).some(p => p.endsWith(': fragments'))).toBe(true);
    const cr = structuredClone(g); cr.entries.push({ ...cr.entries[4], id: 'lib_crunch' });
    expect(pinProblems(cr, html).length).toBeGreaterThan(0);
    expect(pinProblems(g, html.replace('Smith Machine Bench Press', 'Smith Machine Bench Pres'))).toContain('page entry');
  });
});

describe('LIB-11 D-LIB11-SCRATCHIDS (a) and D-LIB11-SCRATCHA: no scratch target is a pinned id', () => {
  it('the scratch set is clean; a set targeting lib_barbell_row (pilot A) or lib_smith_machine_bench_press (pilot B) is refused', async () => {
    const C = await import(/* @vite-ignore */ lib('ci/scratch.mjs'));
    expect(C.setProblems(C.SCRATCH_4C)).toEqual([]);
    const swap = (key: string, id: string) => C.SCRATCH_4C.map((s: any) => (s.key === key ? { ...s, id } : s));
    expect(C.setProblems(swap('lib4c-scratch-a', 'lib_barbell_row'))).toEqual(['lib_barbell_row is a pilot A id (D-LIB11-SCRATCHIDS)']);
    expect(C.setProblems(swap('lib4c-scratch-e', 'lib_smith_machine_bench_press'))).toEqual(['lib_smith_machine_bench_press is a pilot B id (D-LIB11-SCRATCHIDS)']);
    expect(C.PILOT_A.map((i: string) => `lib_${i}`).sort()).toEqual(Object.keys(readJson('tools/plates/library/batches/pilot-a.json').rows).sort());
  });
});

describe('LIB-11 A9: the pilot B plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds give the same sha256', async () => {
    const b = await import(/* @vite-ignore */ lib('pilot-b/build.mjs'));
    const t0 = Date.now(), one = b.sha256((await b.buildPbPage()).html), two = b.sha256((await b.buildPbPage()).html);
    expect(one).toBe(two);
    expect(Date.now() - t0).toBeLessThan(45_000);   // each build is one child process, well under vitest's 60 s RPC limit
  });
});

describe('LIB-11 A10, A6 and Q1 (Do 5 b): the card fields, the ruled tempo map and the plate facts', { timeout: T }, () => {
  // The ruled table ('PILOT B MAPS RULED @ 6ade71ef', #278 6269835256): phase names, order and source per id; no constants.
  // Copied from the ruling, never read from tempo.json or a spec.
  const RULED: Record<string, [string, string][]> = {
    smith_machine_bench_press: [['Lower', 'down'], ['Press', 'up']], seated_leg_curl: [['Curl', 'up'], ['Return', 'down']],
    cable_fly: [['Close', 'up'], ['Hold', 'pause'], ['Open', 'down']], push_up: [['Press', 'up'], ['Lower', 'down']],
  };
  const POSE_MAP: Record<string, Record<string, string>> = { push_up: { start: 'plate.end', end: 'plate.start' } };
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const built = (rows: any[], pt: any) => rows.flatMap((r: any) => (r.from === 'pause' ? (pt.pause > 0 ? [{ phase: r.phase, s: pt.pause }] : []) : [{ phase: r.phase, s: pt[r.from], move: true }]));
  const tempoProblems = (tj: any, cards: Record<string, any>, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not the ruled (empty) set');
    if (JSON.stringify(tj.poseMap ? Object.fromEntries(Object.entries<any>(tj.poseMap).map(([k, v]) => [k, { start: v.start, end: v.end }])) : {}) !== JSON.stringify(POSE_MAP)) bad.push('poseMap: not the ruled map');
    if (JSON.stringify(Object.keys(tj.ids).sort()) !== JSON.stringify(DRAWN.slice().sort())) bad.push('ids: not the drawn 4');
    for (const id of DRAWN) {
      const t = tj.ids[id], c = cards[id], pt = c.plate.tempo;
      if (JSON.stringify(t?.rows?.map((r: any) => [r.phase, r.constant ? 'const' : r.from])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (JSON.stringify(t?.claim) !== JSON.stringify(pt.claim)) bad.push(`${id}: claim`);
      const hold = c.tempo.some((p: any) => p.phase === 'Hold');
      if (hold !== pt.pause > 0) bad.push(`${id}: Hold present ${hold} but pause ${pt.pause}`);
      if (c.tempo.some((p: any) => p.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (JSON.stringify(c.tempo) !== JSON.stringify(built(t?.rows ?? [], pt))) bad.push(`${id}: card tempo != the array built from the ruled table and plate.tempo`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(c.tempo)) bad.push(`${id}: spec tempo != card tempo`);
    }
    return bad;
  };
  const clean = () => ({ tj: readJson('tools/plates/library/pilot-b/tempo.json'), cards: Object.fromEntries(DRAWN.map(id => [id, cardOf(id)])),
    specs: Object.fromEntries(DRAWN.map(id => [id, spec(id)])) as Record<string, any> });
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  it('tempo.json, every card tempo and every spec tempo follow the ruled map', () => {
    const { tj, cards, specs } = clean();
    expect(tempoProblems(tj, cards, specs)).toEqual([]);
  });
  it('mutations (i)-(vi) and a changed second are each red', () => {
    const red = (f: (s: any) => void) => { const s = copy({ tj: clean().tj, cards: clean().cards }); s.specs = { ...clean().specs }; f(s); return tempoProblems(s.tj, s.cards, s.specs).length > 0; };
    const setAll = (s: any, id: string, rows: any[] | null, tempo: any[]) => { if (rows) s.tj.ids[id].rows = rows; s.cards[id].tempo = tempo; s.specs[id] = { ...s.specs[id], tempo }; };
    expect(red(s => { setAll(s, 'seated_leg_curl', null, [...s.cards.seated_leg_curl.tempo, { phase: 'Rest', s: 1 }]); }), '(i) Rest added').toBe(true);
    expect(red(s => { s.tj.constants['seated_leg_curl.Rest'] = { s: 1, claim: 'c7', quote: 'x' }; }), '(ii) a constant').toBe(true);
    expect(red(s => { setAll(s, 'cable_fly', null, s.cards.cable_fly.tempo.map((p: any) => (p.phase === 'Hold' ? { ...p, s: 2 } : p))); }), '(iii) Hold s').toBe(true);
    expect(red(s => { const rows = [...s.tj.ids.push_up.rows.slice(0, 1), { phase: 'Hold', from: 'pause' }, ...s.tj.ids.push_up.rows.slice(1)];
      setAll(s, 'push_up', rows, [s.cards.push_up.tempo[0], { phase: 'Hold', s: 0 }, s.cards.push_up.tempo[1]]); }), '(iv) Hold 0 on push_up').toBe(true);
    expect(red(s => { const rows = s.tj.ids.cable_fly.rows.filter((r: any) => r.from !== 'pause'); setAll(s, 'cable_fly', rows, built(rows, s.cards.cable_fly.plate.tempo)); }), '(v) Hold removed').toBe(true);
    expect(red(s => { const rows = s.tj.ids.smith_machine_bench_press.rows.map((r: any) => ({ ...r, from: r.from === 'up' ? 'down' : r.from === 'down' ? 'up' : r.from }));
      setAll(s, 'smith_machine_bench_press', rows, built(rows, s.cards.smith_machine_bench_press.plate.tempo)); }), '(vi) up/down swapped').toBe(true);
    expect(red(s => { s.cards.push_up.tempo[0].s = 3; }), 'one tempo second').toBe(true);
  });
  // D-LIB8M-CARDS: the three keys are one text block before the final brace; replacing it by `\n}` gives the research copy.
  const cardsSha = readJson('tools/plates/library/pilot-b/cards.sha.json');
  const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
  const BLOCK = /,\n( +)"plateFacts": [^\n]*,\n\1"tempo": [^\n]*,\n\1"topFault": [^\n]*\n}\n$/;
  const unkeyed = (text: string) => (BLOCK.test(text) ? text.replace(BLOCK, '\n}\n') : null);
  it('each card differs from its research-head copy (38d5f9c6) only in the three-key block; each quotes file is a byte copy', () => {
    expect(cardsSha.researchHead).toBe('38d5f9c608b492587b3f923382ccb02bea8f1345');
    for (const id of DRAWN) {
      const text = readFileSync(`docs/research/howto/cards/${id}.json`, 'utf8');
      expect(sha(unkeyed(text) ?? ''), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
      expect(Object.keys(JSON.parse(text)).slice(-3), id).toEqual(KEYS);
    }
    for (const id of HELD) expect(sha(readFileSync(`docs/research/howto/cards/${id}.json`)), id).toBe(cardsSha.cards[id]);
  });
  it('mutation: any other card key edited is red', () => {
    const text = readFileSync('docs/research/howto/cards/cable_fly.json', 'utf8').replace('"view": "front"', '"view": "side"');
    expect(sha(unkeyed(text) ?? '')).not.toBe(cardsSha.cards.cable_fly);
  });
  const KEY: Record<string, string> = { smith_machine_bench_press: 'flare', seated_leg_curl: 'flexed', cable_fly: 'press', push_up: 'sag' };
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable
    ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault'])
    : (card.topFault !== drawnKey ? [] : ['drawable:false but topFault equals the drawn fault']));
  it('Q1: every card is drawable:true, its topFault is the ruled key, and each first tell carries it', () => {
    for (const id of DRAWN) { const c = cardOf(id); expect(c.plate.mistake.drawable, id).toBe(true); expect(topFaultProblems(c, KEY[id]!), id).toEqual([]); expect(spec(id).mistake.tells[0].key, id).toBe(c.topFault); }
  });
  it('Q1 mutation: drawable:false with topFault equal to the drawn key is red', () => {
    const c = cardOf('push_up'); c.plate.mistake.drawable = false;
    expect(topFaultProblems(c, 'sag')).toEqual(['drawable:false but topFault equals the drawn fault']);
  });
  /** Kind on every fact, one form per fact, a claim of the card's own, a contact's cardPose equal to the pose its quote
   *  states, and a pose that is the ruled image of that card pose (CARD FIELDS RULED item 1, D-LIB11-FACTS2). */
  const CARD_POSE: Record<string, Record<string, string>> = {   // fact claim -> the card pose its quote states
    smith_machine_bench_press: { c1: 'start', c2: 'start', c3: 'end' }, seated_leg_curl: { c2: 'start', c4: 'start', c5: 'start' },
    cable_fly: { c3: 'start', c8: 'end' }, push_up: { c1: 'start', c3: 'end' },
  };
  const specPose = (id: string, cardPose: string) => { const m = POSE_MAP[id] ?? { start: 'plate.start', end: 'plate.end' }; return Object.keys(m).find(k => m[k] === `plate.${cardPose}`); };
  const factProblems = (id: string, c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
    ...(f.kind === 'contact' && f.cardPose !== CARD_POSE[id]?.[f.claim] ? [`${i}: cardPose ${f.cardPose}`] : []),
    ...(f.pose === specPose(id, f.cardPose ?? CARD_POSE[id]?.[f.claim] ?? '') ? [] : [`${i}: pose ${f.pose}`]),
  ]);
  it('every plate fact has a kind, one form, a claim of its own card and the ruled pose; each How-to names its card', async () => {
    for (const id of DRAWN) {
      expect(factProblems(id, cardOf(id)), id).toEqual([]);
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
    // the ruled contact set (CARD FIELDS RULED @ 24d2b68, #278 6272494659): landmark@pose per card, nothing more or less
    const RULED_CONTACTS: Record<string, string[]> = {
      smith_machine_bench_press: ['chest@end', 'backUpper@start', 'buttock@start', 'grip.r@start', 'grip.l@start', 'sole.r@start', 'sole.l@start'],
      seated_leg_curl: ['backUpper@start', 'buttock@start', 'seat@start', 'thighTop.r@start', 'thighTop.l@start', 'thighUnder.r@start', 'thighUnder.l@start', 'grip.r@start', 'grip.l@start'],
      cable_fly: ['grip.r@start', 'grip.l@start', 'grip.r@end', 'grip.l@end'], push_up: ['wrist.r@end', 'wrist.l@end', 'chest@start'],
    };
    for (const id of DRAWN) expect(cardOf(id).plateFacts.filter((f: any) => f.kind === 'contact').map((f: any) => `${f.landmark}@${f.pose}`).sort(), id).toEqual(RULED_CONTACTS[id]!.slice().sort());
  });
  it('mutations: a fact with both joint and measure: true, and a start fact named with the unmapped pose, are red', () => {
    const c = cardOf('smith_machine_bench_press'); c.plateFacts.push({ kind: 'angle', joint: 'knee.r', measure: true, deg: 30, pose: 'end', claim: 'c3' });
    expect(factProblems('smith_machine_bench_press', c)).toEqual([`${c.plateFacts.length - 1}: both joint and measure`]);
    const p = cardOf('push_up'); p.plateFacts = p.plateFacts.map((f: any) => (f.claim === 'c1' ? { ...f, pose: 'start' } : f));
    expect(factProblems('push_up', p).some((x: string) => /pose start/.test(x))).toBe(true);
    const q = cardOf('push_up'); q.plateFacts = q.plateFacts.map((f: any) => (f.claim === 'c3' ? { ...f, cardPose: 'start' } : f));
    expect(factProblems('push_up', q).some((x: string) => /cardPose start/.test(x))).toBe(true);
  });
  const h6 = (s: any, research: any) => {
    const R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec: s, research }, { engine: Eng(), pins }, R).map((p: any) => p.key);
  };
  const research = (id: string) => { const c = cardOf(id); return { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault }; };
  it('A6: PQ-H6 is green on every drawn plate against its card', () => {
    for (const id of DRAWN) expect(h6(spec(id), research(id)), id).toEqual([]);
  });
  it('A6 mutations: smith\'s 45° fact +3°, the card path removed, a contact on an unchecked landmark are red', () => {
    const r = research('smith_machine_bench_press'), s = spec('smith_machine_bench_press');
    expect(h6(s, { ...r, plateFacts: r.plateFacts.map((f: any) => (f.kind === 'angle' ? { ...f, deg: f.deg + 3 } : f)) })).toEqual(['H6.fact:0:angle:sh.r.elev']);
    expect(h6(s, null)).toEqual(['H6:no-card']);
    expect(h6(s, { ...r, plateFacts: [...r.plateFacts, { kind: 'contact', landmark: 'chin', pose: 'end', claim: 'c3' }] }).some((k: string) => k.startsWith('H6.fact:'))).toBe(true);
  });
});
