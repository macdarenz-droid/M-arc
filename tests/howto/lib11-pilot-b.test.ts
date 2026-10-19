// LIB-11 (lib-11-card Do 2, Do 3, Do 4; acceptance A2, A3, A5, A7, A9, A13): the pilot B build-ahead plates. Node only:
// the browser half of the plate QA runs in tools/plates/library/pilot-b/qa.mjs. Every test reads what is drawn (the
// items a spec emits, the engine's landmarks and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const PILOT_B = ['smith_machine_bench_press', 'cable_fly', 'push_up', 'seated_leg_curl', 'crunch'];
const DRAWN = ['smith_machine_bench_press', 'seated_leg_curl', 'cable_fly', 'push_up'];   // drawn, not held (rows.json)
const HELD = ['crunch'];                                                       // D-LIB11-SMALL (DESIGN.md section 13)
const ROWS = 'tools/plates/library/pilot-b/rows.json';
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

describe('LIB-11 A5: pilot-b/rows.json holds exactly the drawn ids that are not held', () => {
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

describe('LIB-11 A7: nothing is pinned before the pin commit (D-LIB10-AHEAD ceiling)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  it('every row is at stage drawing or review, and no pilot B id is shipped with rows.json read as a batch file', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => DRAWN.includes(r.id.slice(4))).length).toBe(DRAWN.length);
    expect(reg.shippedIds(rows).filter((i: string) => PILOT_B.includes(i.slice(4)))).toEqual([]);
  });
  it('mutation: a row set to approved-plate is red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_cable_fly: { ...rows.lib_cable_fly, stage: 'approved-plate' } })).toEqual(['lib_cable_fly: approved-plate']);
  });
  /** Whole-value hits of a pilot B id: `lib_<id>`, `<id>`, its hyphen slug, or `library/specs/<id>.mjs`. */
  const VALUES = (id: string) => [`lib_${id}`, id, id.replace(/_/g, '-'), `library/specs/${id}.mjs`, `tools/plates/library/specs/${id}.mjs`];
  const isPb = (v: unknown) => typeof v === 'string' && PILOT_B.some(id => VALUES(id).includes(v));
  /** A batch file: its rows keys and each row's src, slug, prefix and chromeId, as whole field values. */
  const batchScan = (name: string, text: string) => {
    const out: string[] = [], j = JSON.parse(text);
    for (const [k, r] of Object.entries<any>(j.rows ?? {})) {
      if (isPb(k)) out.push(`${name}: row ${k}`);
      for (const f of ['src', 'slug', 'prefix', 'chromeId']) if (isPb(r?.[f])) out.push(`${name}: ${k}.${f} ${r[f]}`);
    }
    return out;
  };
  /** A golden JSON: each entry's id; a layers HTML: id="card-…", data-ex and data-id. */
  const goldenScan = (name: string, text: string) => {
    const out: string[] = [];
    if (name.endsWith('.json')) for (const e of JSON.parse(text).entries ?? []) if (isPb(e?.id)) out.push(`${name}: entry ${e.id}`);
    if (name.endsWith('.html')) for (const m of text.matchAll(/(?:id="card-([^"]*)"|data-ex="([^"]*)"|data-id="([^"]*)")/g)) { const v = m[1] ?? m[2] ?? m[3]; if (isPb(v)) out.push(`${name}: ${v}`); }
    return out;
  };
  const common = (name: string, text: string) => [...(/pilot-b/i.test(name) ? [`${name}: a pilot B file name`] : []), ...(/"batch"\s*:\s*"PILOT-B"/.test(text) ? [`${name}: names batch PILOT-B`] : [])];
  const scanDir = (dir: string, f: (n: string, t: string) => string[]) => (existsSync(dir) ? readdirSync(dir).filter(n => /\.(json|html)$/.test(n)).flatMap(n => { const t = readFileSync(join(dir, n), 'utf8'); return [...common(n, t), ...f(n, t)]; }) : []);
  it('the structural scan finds no pilot B id in batches/ or tests/howto/golden/library/', () => {
    expect(scanDir('tools/plates/library/batches', batchScan)).toEqual([]);
    expect(scanDir('tests/howto/golden/library', goldenScan)).toEqual([]);
  });
  it('controls stay green: a "walkout from a push-up" sources line, lib_cable_crunch / cable-crunch, lib_incline_push_up', () => {
    const ctl = JSON.stringify({ batch: 'LB9', rows: {
      lib_inchworm: { src: 'library/specs/inchworm.mjs', slug: 'inchworm', prefix: 'inchworm', chromeId: 'inchworm', sources: ['walkout from a push-up'] },
      lib_cable_crunch: { src: 'library/specs/cable_crunch.mjs', slug: 'cable-crunch', prefix: 'cable-crunch', chromeId: 'cable-crunch' },
      lib_incline_push_up: { src: 'library/specs/incline_push_up.mjs', slug: 'incline-push-up', prefix: 'incline-push-up', chromeId: 'incline-push-up' } } });
    expect([...common('lb9.json', ctl), ...batchScan('lb9.json', ctl)]).toEqual([]);
  });
  it('every real id in exercises.json that contains a pilot B id is listed, and none matches the scan', () => {
    const ex: string[] = readJson('src/data/exercises.json').map((e: any) => e.id);
    const holders = ex.filter(e => PILOT_B.some(id => e !== `lib_${id}` && e.includes(id))).sort();
    expect(holders).toEqual(['lib_bicycle_crunch', 'lib_cable_crunch', 'lib_diamond_push_up', 'lib_high_to_low_cable_fly', 'lib_incline_push_up',
      'lib_low_to_high_cable_fly', 'lib_machine_crunch', 'lib_pike_push_up', 'lib_reverse_crunch']);
    for (const h of holders) expect(isPb(h) || isPb(h.slice(4)) || isPb(h.slice(4).replace(/_/g, '-')), h).toBe(false);
  });
  it('mutations: rows.json copied into batches/, a golden entry lib_crunch, a page-only PILOT-B entry in other.json are red', () => {
    expect(batchScan('x.json', readFileSync(ROWS, 'utf8')).length).toBeGreaterThanOrEqual(DRAWN.length);
    expect(common('pilot-b.json', readFileSync(ROWS, 'utf8')).length).toBe(2);
    expect(goldenScan('x.json', '{"entries":[{"kind":"plate","id":"lib_crunch"}]}')).toEqual(['x.json: entry lib_crunch']);
    expect(common('other.json', '{"entries":[{"kind":"page","batch":"PILOT-B"}]}')).toEqual(['other.json: names batch PILOT-B']);
    expect(goldenScan('x.layers.html', '<article id="card-push-up" data-ex="lib_push_up"></article>')).toEqual(['x.layers.html: push-up', 'x.layers.html: lib_push_up']);
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
