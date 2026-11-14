// F-BSS-REARKNEE (F-HT4-RIGHTPOSE part 2, f-ht4-rightpose-card.md): bulgarian_split_squat's Rear knee close-up. Both
// halves show a full-width floor line well inside the panel, a visible gap under the Right knee, and the Wrong kneecap
// on the floor, with the rear knee, shin and bench still filling the frame (L7). Measured on the built crop svgs
// (render/closeup/crop.mjs engineCrop, lb04's crop options) and on engine landmarks projected with the crop's camera
// (the engineCrop probe: the crop's own projected centre fixes the camera the test uses).
//   C7 floor in view: the floor line >= FLOOR_MIN panel px above the bottom edge; the crop's x range inside the floor's
//      drawn extent.
//   C8 gap and contact: the Right kneecap's lowest point >= GAP_MIN panel px above the floor line; the Wrong's within
//      CONTACT_MAX of it.
//   C9 L7 kept: knee.l and ankle.l of each half's pose, the bench's front top corner and its top edge's height >= EDGE_MIN
//      panel px from every edge.
// Each `red:` case is a card mutation (m9-m13) applied in memory; it must turn its check red.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { BSS_KEY, BSS_MAIN, BSS_MAIN_OFF, BSS_ROWS, bssMainZoom, bssProblems, restoreBSS } from './f-bss-rearknee-pins';

const ROOT = new URL('../../', import.meta.url);
const href = (p: string) => new URL(p, ROOT).href;
const path = (p: string) => new URL(p, ROOT).pathname;
const SPEC = 'tools/plates/library/specs/bulgarian_split_squat.mjs';
const HOWTO = 'tools/plates/library/howto/lib_bulgarian_split_squat.howto.mjs';

// The card's proposals (C7-C9), as ruled at PLAN.
const FLOOR_MIN = 20, GAP_MIN = 15, CONTACT_MAX = 1, EDGE_MIN = 8;

const load = async () => {
  const [crop, cu, common, opts, mod, body] = await Promise.all([
    'tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeups.mjs', 'tools/plates/library/render/closeup/common.mjs',
    'tools/plates/library/pages/lb04.closeups.mjs', HOWTO, 'tools/plates/vendor/engine/body.mjs',
  ].map(p => import(/* @vite-ignore */ href(p))));
  const engine = await cu.engineOf(path(SPEC));
  return { crop, engine, mergeDeep: common.mergeDeep, OPTS: opts.CLOSEUP_OPTIONS.bulgarian_split_squat.crop, howto: mod.default, RADII: body.RADII };
};

type M = { role: string; backTop: number; floorBottom: number; floorX: [number, number]; vx: number; s: number; gap: number; edges: Record<string, number> };
/** Both halves' numbers for the howto `howto` with its rear-knee zoom `z` (the howto's own when omitted). */
async function measure(over: { zoom?: (z: any) => any; plate?: (p: any) => any } = {}): Promise<M[]> {
  const { crop, engine, mergeDeep, OPTS, howto: h0, RADII } = await load();
  const howto = { ...h0, plate: over.plate ? over.plate(h0.plate) : h0.plate };
  const z0 = howto.zooms.find((z: any) => z.key === 'rear-knee');
  expect(z0, 'the rear-knee zoom').toBeTruthy();
  const z = over.zoom ? over.zoom(z0) : z0;
  const H = howto.plate.body?.height ?? 1.75, KC = RADII.kneeCap * H;
  const poseOf = (ref: any) => typeof ref === 'string' ? howto.plate.poses[ref] : mergeDeep(howto.plate.poses[ref.base], ref.pose);
  const bench = howto.plate.equipment.find((e: any) => e.type === 'bench');
  const out: M[] = [];
  for (const role of ['right', 'wrong']) {
    const probe = { points: [] as any[], specs: [] as any[] };
    const html: string = crop.engineCrop(howto, OPTS, engine, probe)(z, role);
    const [vx, vy, s] = html.match(/viewBox="(-?[\d.]+) (-?[\d.]+) (\d+) \d+" class="z-plate"/)!.slice(1).map(Number) as [number, number, number];
    const floors = [...html.matchAll(/class="floorline"[^>]*d="M(-?[\d.]+) (-?[\d.]+)H(-?[\d.]+)"|d="M(-?[\d.]+) (-?[\d.]+)H(-?[\d.]+)"[^>]*class="floorline"/g)];
    expect(floors.length, `${role}: one floor line`).toBe(1);
    const [fx0, fy, fx1] = (floors[0]![1] ? floors[0]!.slice(1, 4) : floors[0]!.slice(4, 7)).map(Number) as [number, number, number];
    // the crop's camera: side view facing right, x = x0 + z ppm, y = y0 - y ppm; fixed from the centre the crop projected
    const c = probe.points[0], w0 = c.w, p0 = c.px;
    const ppm = engine.renderPlate(howto.plate, { id: 'base' }).report.camera.pxPerM;
    const P = (w: number[]) => [p0[0] + (w[2]! - w0[2]) * ppm, p0[1] - (w[1]! - w0[1]) * ppm];
    for (const q of probe.points) { const e = P(q.w); expect(Math.hypot(e[0]! - q.px[0], e[1]! - q.px[1]), `${role}: the test's camera is the crop's`).toBeLessThan(0.01); }
    const k = 171 / s, T = ([x, y]: number[]) => [(x! - vx) * k, (y! - vy) * k];
    const lm = engine.landmarksOf(role === 'right' ? poseOf(z.right) : poseOf(z.wrong), H);
    const knee = lm['knee.l'], low = T(P([0, knee[1] - KC, knee[2]]))[1]!, floorY = T([0, fy])[1]!;
    const front = bench.at[2] + bench.width / 2, corner = T(P([0, bench.at[1], front])), top = corner[1]!;
    const e = (p: number[]) => Math.min(p[0]!, p[1]!, 171 - p[0]!, 171 - p[1]!);
    const backTop = T(P([0, bench.at[1], front - bench.width]))[0]!;
    out.push({ role, backTop, floorBottom: 171 - floorY, floorX: [fx0, fx1], vx, s, gap: floorY - low,
      edges: { 'knee.l': e(T(P(knee))), 'ankle.l': e(T(P(lm['ankle.l']))), 'bench corner': e(corner), 'bench top': Math.min(top, 171 - top) } });
  }
  return out;
}
const c7 = (ms: M[]) => ms.flatMap(m => [
  ...(m.floorBottom >= FLOOR_MIN ? [] : [`${m.role}: floor ${m.floorBottom.toFixed(1)} px above the bottom edge < ${FLOOR_MIN}`]),
  ...(m.vx >= m.floorX[0] && m.vx + m.s <= m.floorX[1] ? [] : [`${m.role}: crop x [${m.vx}, ${m.vx + m.s}] outside the floor [${m.floorX.join(', ')}]`])]);
const c8 = (ms: M[]) => ms.flatMap(m => m.role === 'right'
  ? (m.gap >= GAP_MIN ? [] : [`right: kneecap ${m.gap.toFixed(1)} px above the floor < ${GAP_MIN}`])
  : (Math.abs(m.gap) <= CONTACT_MAX ? [] : [`wrong: kneecap ${m.gap.toFixed(1)} px off the floor > ${CONTACT_MAX}`]));
const c9 = (ms: M[]) => ms.flatMap(m => Object.entries(m.edges).filter(([, v]) => !(v >= EDGE_MIN)).map(([n, v]) => `${m.role}: ${n} ${v.toFixed(1)} px from an edge < ${EDGE_MIN}`));
const withCrop = (crop: any) => ({ zoom: (z: any) => ({ ...z, crop: { ...z.crop, ...crop, center: { ...z.crop.center, ...crop.center } } }) });

describe('F-BSS-REARKNEE: the Rear knee close-up', { timeout: 120_000 }, () => {
  it('C7: the floor line is well inside both halves and spans their full width', async () => { expect(c7(await measure())).toEqual([]); });
  it('C8: a gap under the Right kneecap; the Wrong kneecap on the floor', async () => { expect(c8(await measure())).toEqual([]); });
  it('C9: knee, ankle and bench top stay inside both halves (L7)', async () => { expect(c9(await measure())).toEqual([]); });
  it('C9 (Q-BSS-2 ruling): the bench\'s back top corner runs past the left edge, as in main\'s approved crop', async () => {
    // a known fact pinned, so a later crop change shows: main's off [-40, -24] and window A share x, so both read -5.5
    for (const ms of [await measure(), await measure(withCrop({ center: { off: [-40, -24] } }))]) expect(ms.map(m => [m.role, +m.backTop.toFixed(1)])).toEqual([['right', -5.5], ['wrong', -5.5]]);
  });
  it('red m9: main\'s crop window (off [-40, -24]) fails C7', async () => {
    expect(c7(await measure(withCrop({ center: { off: [-40, -24] } })))).toEqual([
      expect.stringMatching(/^right: floor 3\.1 px above the bottom edge < 20$/), expect.stringMatching(/^wrong: floor 3\.1 px above the bottom edge < 20$/)]);
  });
  it('red m10: the Right drawn at the Wrong\'s pose fails C8 (gap)', async () => {
    expect(c8(await measure({ zoom: z => ({ ...z, right: z.wrong }) }))).toEqual([expect.stringMatching(/^right: kneecap .* px above the floor < 15$/)]);
  });
  it('red m11: the Wrong kneecap lifted 1 cm fails C8 (contact)', async () => {
    expect(c8(await measure({ zoom: z => ({ ...z, wrong: { ...z.wrong, pose: { ...z.wrong.pose, root: { ...z.wrong.pose.root, at: [z.wrong.pose.root.at[0], z.wrong.pose.root.at[1] + 0.01, z.wrong.pose.root.at[2]] } } } }) })))
      .toEqual([expect.stringMatching(/^wrong: kneecap .* px off the floor > 1$/)]);
  });
  it('red m12: a floor that stops inside the panel fails C7 (width)', async () => {
    const short = (p: any) => ({ ...p, equipment: p.equipment.map((e: any) => e.type === 'floor' ? { ...e, to: -0.4 } : e) });
    expect(c7(await measure({ plate: short }))).toEqual([expect.stringMatching(/^right: crop x .* outside the floor/), expect.stringMatching(/^wrong: crop x .* outside the floor/)]);
  });
  it('red m13: a crop moved so the ankle and bench top leave the frame fails C9', async () => {
    expect(c9(await measure(withCrop({ center: { off: [-40, 30] } })))).toEqual(expect.arrayContaining([expect.stringMatching(/^right: ankle\.l .* < 8$/), expect.stringMatching(/^wrong: bench top .* < 8$/)]));
  });
  it('red (review Low 2, pins EDGE_MIN): the crop 7 plate px left puts the Right knee.l 5.1 px from the right edge', async () => {
    expect(c9(await measure(withCrop({ center: { off: [-47, -12] } })))).toEqual([expect.stringMatching(/^right: knee\.l 5\.1 px from an edge < 8$/)]);
  });
});

// ---- C10: card scope, on a scratch lb04 layers page with bulgarian staged in the W8b form (1fdf6975's group and
// closeups entries; the config is never committed). Built in a scratch tree with the tree's own modules (a child process),
// once as this head and once with main 9139c29c's crop window. ----
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const RUN = process.cwd();
const COPY = ['package.json', 'scripts', 'src', 'tools', 'tests/howto/golden', 'docs/research/howto'];
const LB04 = 'tools/plates/library/pages/lb04.layers.json';
const JUDGED = '3649e98cde40c5c02890463ca2b853bf4ebcdb6c7efdba8fcae445a8a7633323';   // W8b's judged card (lb04.layers.html @ 1fdf6975)
const PANEL_CARD = 'bcd016a4ce10c3f2f56ce8eea1cd492621aeed7c6e6c0d931223394b58fcbb99';   // PANEL READY 6869383847: the card the panel judges
const trees: string[] = [];
afterAll(() => { for (const t of trees) rmSync(t, { recursive: true, force: true }); });
const withBss = (s: string) => {
  const c = JSON.parse(s), ids: string[] = c.groups[0].ids;
  expect(ids).not.toContain('lib_bulgarian_split_squat');
  ids.splice(ids.indexOf('lib_bodyweight_split_squat') + 1, 0, 'lib_bulgarian_split_squat');
  c.closeups.lib_bulgarian_split_squat = { optionsKey: 'bulgarian_split_squat' };
  return `${JSON.stringify(c, null, 2)}\n`;
};
function scratchPage(mainWindow: boolean): string {
  const T = mkdtempSync(join(tmpdir(), 'f-bss-rearknee-'));
  trees.push(T);
  for (const p of COPY) if (existsSync(join(RUN, p))) cpSync(join(RUN, p), join(T, p), { recursive: true });
  symlinkSync(join(RUN, 'node_modules'), join(T, 'node_modules'), 'dir');
  writeFileSync(join(T, LB04), withBss(readFileSync(join(T, LB04), 'utf8')));
  if (mainWindow) {
    const h = readFileSync(join(T, HOWTO), 'utf8'), now = "off: [-40, -12] }, sizePx: 100 }";
    expect(h.split(now).length - 1).toBe(1);
    writeFileSync(join(T, HOWTO), h.replace(now, `off: [${BSS_MAIN_OFF.join(', ')}] }, sizePx: 100 }`));
  }
  const code = `
    import { layersSpecOf } from './tools/plates/library/layers-spec.mjs';
    import { buildLayersPage } from './tools/plates/library/build-layers-page.mjs';
    import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
    const stageDir = mkdtempSync(join(tmpdir(), 'bss-stage-'));
    try { writeFileSync('out.layers.html', await buildLayersPage(layersSpecOf('tools/plates/library/batches/lb04.json', { stageDir, root: process.cwd() }))); }
    finally { rmSync(stageDir, { recursive: true, force: true }); }`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return readFileSync(join(T, 'out.layers.html'), 'utf8');
}
const cardIds = (h: string) => [...h.matchAll(/<article class="sheet-card" id="card-([^"]+)"/g)].map(m => m[1]!);
const cardOf = (h: string, id: string) => { const a = h.indexOf(`<article class="sheet-card" id="card-${id}"`); return h.slice(a, h.indexOf('</article>', a)); };
/** C10's problems for `now` against `base` (the same page with main's crop window). */
async function scopeProblems(now: string, base: string): Promise<string[]> {
  const { divAt } = await import(/* @vite-ignore */ href('tools/plates/library/build-layers-page.mjs'));
  const ids = cardIds(base), bad: string[] = [];
  if (cardIds(now).join() !== ids.join()) bad.push(`cards ${cardIds(now)} != ${ids}`);
  for (const id of ids) if (id !== 'bulgarian-split-squat' && cardOf(now, id) !== cardOf(base, id)) bad.push(`${id}: card differs`);
  const strip = (h: string) => ids.reduce((o, id) => o.replace(cardOf(h, id), ''), h);
  if (strip(now) !== strip(base)) bad.push('outside the cards differs');
  const x = cardOf(now, 'bulgarian-split-squat'), y = cardOf(base, 'bulgarian-split-squat');
  if (x.length !== y.length) bad.push('bulgarian card length differs');
  let i = 0; while (i < y.length && x[i] === y[i]) i++;
  let j = 0; while (j < y.length - i && x[x.length - 1 - j] === y[y.length - 1 - j]) j++;
  const z0 = y.indexOf('<div class="zx" id="bulgarian-split-squat-zoom-rear-knee"'), z1 = z0 + divAt(y, z0).length;
  if (i < y.length && (z0 < 0 || i < z0 || y.length - j > z1)) bad.push(`bulgarian card differs at [${i}, ${y.length - j}], outside the Rear knee block [${z0}, ${z1}]`);
  return bad;
}
describe('F-BSS-REARKNEE C10: card scope on the scratch lb04 page', { timeout: 900_000 }, () => {
  let now = '', base = '';
  it('built twice equal; main\'s window gives W8b\'s judged card; only the Rear knee block moves; the card is the one the panel judges', async () => {
    now = scratchPage(false); base = scratchPage(true);
    expect(sha(scratchPage(false))).toBe(sha(now));
    expect(sha(cardOf(base, 'bulgarian-split-squat'))).toBe(JUDGED);
    expect(sha(cardOf(now, 'bulgarian-split-squat'))).toBe(PANEL_CARD);
    expect(await scopeProblems(now, base)).toEqual([]);
  });
  it('red m14: one byte changed outside the Rear knee block', async () => {
    expect(now).not.toBe('');
    const x = cardOf(now, 'bulgarian-split-squat'), at = x.indexOf('<div class="zx" id="bulgarian-split-squat-zoom-rear-knee"') - 1, y = x.slice(0, at) + '~' + x.slice(at + 1);   // the byte just before the Rear knee block
    expect([at > 0, x[at] !== '~']).toEqual([true, true]);
    expect(await scopeProblems(now.replace(x, () => y), base)).toEqual([expect.stringMatching(/^bulgarian card differs at .* outside the Rear knee block/)]);
    const f = cardOf(now, 'front-squat');
    expect(await scopeProblems(now.replace(f, () => f.replace('class=', 'class =')), base)).toEqual(expect.arrayContaining(['front-squat: card differs']));
  });
});

// ---- C11: the MANIFEST blanked-keys test (F-W8A-ASSISTED A1 form): only the bulgarian how-to key moved, in its 12 rows. ----
describe('F-BSS-REARKNEE C11: the MANIFEST blanked-keys test', () => {
  const man = () => JSON.parse(readFileSync(path('tools/plates/library/MANIFEST.json'), 'utf8'));
  it('the key pins the current file in its 12 rows, and restoring main\'s value leaves only that key differing (the 3 D-RP-PINS lines use the same restore)', () => {
    const m = man();
    expect(bssProblems(m)).toEqual([]);
    expect(Object.values<any>(m.rows).filter(r => BSS_KEY in r.files).length).toBe(BSS_ROWS);
    const r = restoreBSS(structuredClone(m));
    for (const row of Object.values<any>(r.rows)) if (BSS_KEY in row.files) expect(row.files[BSS_KEY]).toBe(BSS_MAIN);
    expect(sha(readFileSync(path(BSS_KEY)))).not.toBe(BSS_MAIN);
  });
  it('red m15: a second key moved, or a stale bulgarian key', () => {
    const m = man(), [id, r] = Object.entries<any>(m.rows).find(([, x]) => BSS_KEY in x.files)!;
    const other = Object.keys(r.files).find(k => k !== BSS_KEY)!, was = r.files[other];
    m.rows[id].files[other] = '0'.repeat(64);
    expect(restoreBSS(structuredClone(m)).rows[id].files[other]).not.toBe(was);   // restoreBSS never hides another key
    const s = man(); s.rows[id].files[BSS_KEY] = BSS_MAIN;
    expect(bssProblems(s)).toEqual([expect.stringMatching(new RegExp(`^${id}: .* != current`))]);
    expect(() => restoreBSS(s)).toThrow(/restoreBSS/);
  });
  it('bssMainZoom changes only bulgarian\'s rear-knee crop offset', async () => {
    const { howto } = await load(), z = howto.zooms.find((q: any) => q.key === 'rear-knee');
    const m = bssMainZoom('bulgarian_split_squat', z);
    expect({ ...m, crop: { ...m.crop, center: { ...m.crop.center, off: z.crop.center.off } } }).toEqual(z);
    expect(m.crop.center.off).toEqual([-40, -24]);
    expect(bssMainZoom('bodyweight_split_squat', z)).toBe(z);
    expect(bssMainZoom('bulgarian_split_squat', { ...z, key: 'other' }).crop).toBe(z.crop);
  });
});

// ---- C12: HT4 on the real row, with part 1 (F-HT4-RIGHTPOSE, #425) on this head and this card's crop: bulgarian staged
// on lb04 as C10 stages it, HT4's runNode run in a scratch tree with the tree's own modules (f-ht4-rightpose.test.ts's
// ht4() form). Red case: the Right crop drawing a pose that is neither a reference pose nor the declared Right. ----
const CROP_MJS = 'tools/plates/library/render/closeup/crop.mjs';
function ht4Tree(edits: Record<string, (s: string) => string> = {}): string[] {
  const T = mkdtempSync(join(tmpdir(), 'f-bss-rearknee-ht4-'));
  trees.push(T);
  for (const p of COPY) if (existsSync(join(RUN, p))) cpSync(join(RUN, p), join(T, p), { recursive: true });
  symlinkSync(join(RUN, 'node_modules'), join(T, 'node_modules'), 'dir');
  for (const [p, f] of Object.entries({ [LB04]: withBss, ...edits })) {
    const before = readFileSync(join(T, p), 'utf8'), after = f(before);
    expect(after, `${p}: the edit must change the file`).not.toBe(before);
    writeFileSync(join(T, p), after);
  }
  const code = `
    import { recorder } from './tools/plates/library/fidelity/rows.mjs';
    import { runNode } from './tools/plates/library/fidelity/twins/ht4.mjs';
    const R = recorder(), ctx = { R, root: process.cwd() };
    await runNode(ctx, { lib: 'lib_bulgarian_split_squat', chrome: 'bulgarian-split-squat' });
    console.log(JSON.stringify(R.problems));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return JSON.parse(r.stdout.trim().split('\n').pop()!) as string[];
}
describe('F-BSS-REARKNEE C12: HT4 on bulgarian_split_squat with part 1 and this crop', { timeout: 600_000 }, () => {
  it('green: protected, fragments and poses clean', () => {
    expect(readFileSync(path(HOWTO), 'utf8')).toContain("off: [-40, -12] }, sizePx: 100 }");
    expect(ht4Tree()).toEqual([]);
  });
  it('red: the Right crop drawing an undeclared pose (the Right pose tilted 1 deg more) is a poses problem', () => {
    const a = "const shown = solid ? (o.solidPose === 'merged' ? wrongPose(z) : poseOf(z.wrong)) : right;";
    const b = "const shown = solid ? (o.solidPose === 'merged' ? wrongPose(z) : poseOf(z.wrong)) : (z.key === 'rear-knee' ? mergeDeep(right, { root: { tilt: (right.root?.tilt ?? 0) + 1 } }) : right);";
    const got = ht4Tree({ [CROP_MJS]: (s: string) => { expect(s.split(a).length - 1).toBe(1); return s.replace(a, () => b); } });
    expect(got).toEqual(expect.arrayContaining([expect.stringMatching(/HT4\/A5-poses@.*: bulgarian_split_squat\|rear-knee-right: poses\.(start|end) matches neither a reference pose nor its declared Right pose/)]));
  });
});
