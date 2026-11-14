// F-DL-LIFTOFF (docs/supervisor/verify/f-dl-liftoff-card.md; PLAN #427 6871996081, RULED by the supervisor: Q-DL-1..5 yes,
// SHOOT_KNEE 15, the head stays cut). conventional_deadlift's dl-liftoff close-up: the shot-up Wrong drawn as the house
// dashed Mistake over the Right (D-DL-FORM), a red drop arrow beside the buttock from the Right hip's height to the Wrong
// hip's height (Q-DL-2), the knees nearly straight, the floor and the plate inside the frame, and the Mistake's plate ring
// left out of the Wrong crop's equipment (Q-DL-1). C1-C7 measure the zoom as lb03 draws it (pages/lb03.closeups.mjs):
// "plate px" = the plate camera's px, "panel px" = the 171 px crop. C8-C10 run on a scratch tree whose lb03 layers
// config holds the ids in the W8b form (1fdf6975's order; nothing committed flips, D-DL-NOFLIP).
// Red on main d92830c2: C1 (solid Wrong), C2 (rise 14.2), C3 (no drop), C4 (knee 30.0), C6 (Wrong dot on the Right hip),
// C7 (floor 5.4, plate 3.6 from the right edge), C8 (the card is main's). Kept (green on main): C5, C6 (a solid Wrong's string anchor lands on its own hip; m7 is its red), C9, C10.
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = process.cwd();
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T_MS = 600_000, PANEL = 171, KEY = 'dl-liftoff';
const HOWTO = 'tools/plates/library/howto/lib_conventional_deadlift.howto.mjs';
type V = number[];
const d2 = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const nums = (s: string) => (s.match(/-?[\d.]+/g) ?? []).map(Number);
const sha = (s: string | Buffer) => createHash('sha256').update(s).digest('hex');

let cu: any, crop: any, vb: any, mergeDeep: any, mod: any, howto: any, engine: any, api: any, OPT: any, CAM: any, Z: any;
beforeAll(async () => {
  [cu, crop] = await Promise.all(['render/closeups.mjs', 'render/closeup/crop.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  vb = await import(/* @vite-ignore */ new URL('../../tools/plates/vendor/engine/body.mjs', import.meta.url).href);
  mergeDeep = (await import(/* @vite-ignore */ lib('render/closeup/common.mjs'))).mergeDeep;
  OPT = (await import(/* @vite-ignore */ lib('pages/lb03.closeups.mjs'))).CLOSEUP_OPTIONS.conventional_deadlift;
  const specFile = join(ROOT, 'tools/plates/library/specs/conventional_deadlift.mjs');
  mod = await import(/* @vite-ignore */ lib('howto/lib_conventional_deadlift.howto.mjs'));
  howto = mod.default;
  engine = await cu.engineOf(specFile);
  api = cu.closeupApi(mod, OPT, { engine, specFile });
  CAM = engine.renderPlate(howto.plate, { id: 'base' }).report.camera;
  Z = howto.zooms.find((q: any) => q.key === KEY);
}, T_MS);

const H = 1.75, R = Math.PI / 180, PLATE_R = 0.225;   // spec PLATE_R (card c23: 45 cm plates)
const P = (w: V): V => [CAM.x0 + w[2]! * CAM.pxPerM, CAM.y0 - w[1]! * CAM.pxPerM];   // side view, facing right (spec)
const kneeOf = (lm: any) => {
  const a = [0, 1, 2].map(i => lm['hip.r'][i] - lm['knee.r'][i]), b = [0, 1, 2].map(i => lm['ankle.r'][i] - lm['knee.r'][i]);
  return 180 - Math.acos((a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!) / Math.hypot(...a) / Math.hypot(...b)) / R;
};

/** The zoom as lb03 draws it: both halves, their plate px -> panel px maps, the crop specs and the two poses' landmarks. */
function measure(z: any) {
  const html = api.postureZoom(z), [Rh, Wh] = html.split('<div class="plate z-wrap">').slice(1) as [string, string];
  const map = (s: string) => { const [vx, vy, sz] = nums(/viewBox="([^"]*)" class="z-plate"/.exec(s)![1]!), k = PANEL / sz!; return { k, to: (q: V): V => [(q[0]! - vx!) * k, (q[1]! - vy!) * k] }; };
  const probe = { points: [] as any[], specs: [] as any[] };
  const half = crop.engineCrop(howto, OPT.crop, engine, probe);
  half(z, 'right'); half(z, 'wrong');
  const spec = (role: string) => probe.specs.find((s: any) => s.role === role).spec;
  const END = howto.plate.poses.end, wrongPose = mergeDeep(END, z.wrong.pose);   // solid ('own') or dashed, the same pose
  return { html, Rh, Wh, mR: map(Rh), mW: map(Wh), sR: spec('right'), sW: spec('wrong'), END, wrongPose, lR: vb.landmarksOf(END, H), lW: vb.landmarksOf(wrongPose, H) };
}
const dots = (s: string) => [...s.matchAll(/<circle class="z-anchor (?:ok|m)" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/g)].map(q => [+q[1]!, +q[2]!]);

/** Every acceptance row C1-C7 that fails for zoom `z` (the names, with the measured values). */
function problems(z: any): string[] {
  const m = measure(z), out: string[] = [], k = m.mW.k;
  const hipR = m.mW.to(P(m.lR['hip.r'])), hipW = m.mW.to(P(m.lW['hip.r']));
  // C1: the dashed Wrong over the Right: both poses of the Wrong call are the spec's end pose, its Mistake the shot-up pose
  const shoot = mergeDeep(m.END, mod.stills.shoot.pose);
  const c1 = [JSON.stringify(m.sW.poses.start) === JSON.stringify(m.END), JSON.stringify(m.sW.poses.end) === JSON.stringify(m.END),
    !!m.sW.mistake && JSON.stringify(m.sW.mistake.pose) === JSON.stringify(shoot), m.Wh.includes('<g class="m-pose" mask="url(#dl-liftoff-wrong-mmask)">'),
    m.Wh.includes('<mask id="dl-liftoff-wrong-mmask"'), m.sR.mistake === undefined, !m.Rh.includes('m-pose'),
    // Q-DL-1: the Wrong crop draws no Mistake plate ring (the floor, the hand and the barbell only)
    m.sW.equipment.length === 3 && m.sW.equipment.every((e: any) => typeof e !== 'function' || ![].concat(e(m.lW, { pose: 'mistake', mistake: true, start: m.lW, q: null }) ?? []).some((it: any) => it?.part === 'mplate'))];
  if (!c1.every(Boolean)) out.push(`C1 overlay [${c1.join(',')}]`);
  // C2: the hip rises at least 18 panel px, at the same x within 2 px
  const rise = hipR[1]! - hipW[1]!, dx = Math.abs(hipW[0]! - hipR[0]!);
  if (!(rise >= 18 && dx <= 2)) out.push(`C2 rise ${rise.toFixed(1)} dx ${dx.toFixed(1)}`);
  // C3 (Q-DL-2): one up arrow in the Wrong crop only, vertical at the Right hip x - 26 plate px (+-2 panel px), from the
  // Right hip's height to the Wrong hip's height (+-1 panel px), at least 18 panel px tail to tip
  const drops = [...m.Wh.matchAll(/<path class="z-drop" d="M(-?[\d.]+) (-?[\d.]+)V(-?[\d.]+)"\/><path class="z-drop-head" d="M[-\d.]+ [-\d.]+L(-?[\d.]+) (-?[\d.]+)L/g)];
  const rDrops = (m.Rh.match(/class="z-drop/g) ?? []).length, wAll = (m.Wh.match(/class="z-drop"/g) ?? []).length;
  if (drops.length !== 1 || wAll !== 1 || rDrops !== 0) out.push(`C3 drops wrong ${wAll} right ${rDrops}`);
  else {
    const [x, y0, , tx, ty] = drops[0]!.slice(1).map(Number) as V, len = y0! - ty!;
    if (!(Math.abs(x! - (hipR[0]! - 26 * k)) <= 2 && tx === x && Math.abs(y0! - hipR[1]!) <= 1 && Math.abs(ty! - hipW[1]!) <= 1 && ty! < y0! && len >= 18))
      out.push(`C3 arrow x ${x} (want ${(hipR[0]! - 26 * k).toFixed(1)}) tail ${y0} (hip ${hipR[1]!.toFixed(1)}) tip ${ty} (hip ${hipW[1]!.toFixed(1)}) len ${len.toFixed(1)}`);
  }
  // C4: the Wrong knee 20 deg of flexion or less, the Right's 64.0
  const kR = kneeOf(m.lR), kW = kneeOf(m.lW);
  if (!(kW <= 20 && Math.abs(kR - 64.0) < 0.05)) out.push(`C4 knee ${kR.toFixed(1)} -> ${kW.toFixed(1)}`);
  // C5: the bar did not move, and both feet are on the floor in both poses (0.5 panel px)
  const bar = d2(m.mW.to(P(m.lR.grips)), m.mW.to(P(m.lW.grips)));
  const feet = ['heel.r', 'ball.r', 'heel.l', 'ball.l'].flatMap(f => [m.lR, m.lW].map(l => Math.abs(l[f][1]) * CAM.pxPerM * k));
  if (!(bar <= 0.5 && Math.max(...feet) <= 0.5)) out.push(`C5 bar ${bar.toFixed(2)} feet ${Math.max(...feet).toFixed(2)}`);
  // C6: the dots on each half's own hip (1 panel px); texts, captions and alts unchanged
  const [dR] = dots(m.Rh), [dW] = dots(m.Wh), hipRR = m.mR.to(P(m.lR['hip.r']));
  const words = JSON.stringify([z.callout.right.text, z.callout.wrong.text, z.caption, z.alt]) === JSON.stringify(['Hips wait', 'Hips shoot up',
    { right: 'Legs start the pull, hips wait for the bar.', wrong: 'Hips shoot up before the bar moves.' },
    { right: 'Side view, bar on the floor. Knees bent, hips low enough for the legs to start the pull.', wrong: 'Side view. The bar is still on the floor. The hips have risen, the knees nearly straight.' }]);
  if (!(dR && dW && d2(dR, hipRR) <= 1 && d2(dW, hipW) <= 1 && words)) out.push(`C6 dots R ${dR && d2(dR, hipRR).toFixed(1)} W ${dW && d2(dW, hipW).toFixed(1)} words ${words}`);
  // C7: the floor 20 panel px or more above the bottom edge; hips, sacra, necks, the knee and the plate 8 px or more inside
  for (const [role, h, mp] of [['right', m.Rh, m.mR], ['wrong', m.Wh, m.mW]] as const) {
    const fl = /<path class="floorline" d="M(-?[\d.]+) (-?[\d.]+)H/.exec(h);
    const gap = fl ? PANEL - mp.to([0, +fl[2]!])[1]! : NaN;
    const g = P(m.lR.grips), pr = PLATE_R * CAM.pxPerM;
    const pts: [string, V][] = [...[m.lR, m.lW].flatMap((l, i) => ['hip.r', 'sacrum', 'neck', 'knee.r'].map(n => [`${n}${i ? 'W' : 'R'}`, mp.to(P(l[n]))] as [string, V])),
      ['plateL', mp.to([g[0]! - pr, g[1]!])], ['plateR', mp.to([g[0]! + pr, g[1]!])], ['plateT', mp.to([g[0]!, g[1]! - pr])]];
    const edge = Math.min(...pts.map(([, q]) => Math.min(q[0]!, q[1]!, PANEL - q[0]!, PANEL - q[1]!)));
    if (!(gap >= 20 && edge >= 8)) out.push(`C7 ${role} floor ${gap.toFixed(1)} edge ${edge.toFixed(1)} (${pts.filter(([, q]) => Math.min(q[0]!, q[1]!, PANEL - q[0]!, PANEL - q[1]!) < 8).map(([n]) => n).join(',')})`);
  }
  return out;
}

describe('F-DL-LIFTOFF C1-C7: the dl-liftoff zoom as lb03 draws it', () => {
  it('green: every row holds on the zoom', () => { expect(problems(Z)).toEqual([]); }, T_MS);
  it('the posted bounds: rise 19.1 panel px, knee 64.0 -> 15.0, k = 171/180', () => {
    const m = measure(Z), k = m.mW.k, hipR = m.mW.to(P(m.lR['hip.r'])), hipW = m.mW.to(P(m.lW['hip.r']));
    expect(+(hipR[1]! - hipW[1]!).toFixed(1)).toBe(19.1);
    expect([+kneeOf(m.lR).toFixed(1), +kneeOf(m.lW).toFixed(1)]).toEqual([64.0, 15.0]);
    expect(k).toBeCloseTo(171 / 180, 9);
  }, T_MS);
  // in-process mutations of the zoom object (m2, m3, m4, m7, m8 of the card; m1, m5, m6 are file mutations, posted)
  const variant = (f: (z: any) => any) => f({ ...Z, wrong: { ...Z.wrong }, crop: { ...Z.crop }, callout: { ...Z.callout }, guides: Z.guides.map((g: any) => ({ ...g })) });
  it('red m2: solid: true put back (the drop kept) -> C1', () => {
    expect(problems(variant(z => ({ ...z, wrong: { ...z.wrong, solid: true } }))).join('\n')).toMatch(/^C1 overlay/m);
  }, T_MS);
  it('red m3: the drop removed -> C3', () => {
    expect(problems(variant(z => ({ ...z, guides: [] }))).join('\n')).toMatch(/^C3 drops wrong 0 right 0/m);
  }, T_MS);
  it('red m4: the drop reversed (Wrong hip to Right hip, pointing down) -> C3', () => {
    expect(problems(variant(z => ({ ...z, guides: [{ ...z.guides[0], from: { ...z.guides[0].to, pose: 'mistake' }, to: { ...z.guides[0].from, pose: 'right' } }] }))).join('\n')).toMatch(/^C3 arrow/m);
  }, T_MS);
  it('red m7: the Wrong anchor back to the string hip.r (it lands on the Right hip) -> C6', () => {
    expect(problems(variant(z => ({ ...z, callout: { ...z.callout, wrong: { ...z.callout.wrong, anchor: 'hip.r' } } }))).join('\n')).toMatch(/^C6 dots/m);
  }, T_MS);
  it('red m8: main\'s crop window ([0, 10], 200) -> C7 (and C2)', () => {
    const got = problems(variant(z => ({ ...z, crop: { center: { at: 'hip.r', pose: 'right', off: [0, 10] }, sizePx: 200 } }))).join('\n');
    expect(got).toMatch(/^C7 right floor 5\.4/m);
    expect(got).toMatch(/^C2 rise 17\.2/m);
  }, T_MS);
  it('red Q-DL-1: the spec\'s equipment back (the Mistake plate ring drawn) -> C1', () => {
    expect(problems(variant(z => ({ ...z, wrong: { base: z.wrong.base, pose: z.wrong.pose } }))).join('\n')).toMatch(/^C1 overlay \[true,true,true,true,true,true,true,false\]/m);
  }, T_MS);
});

/* ------------------------------------------------------------------ C8-C10: a scratch tree with lb03 staged (W8b form) */
const COPY = ['package.json', 'scripts', 'src', 'tools', 'tests/howto/golden', 'docs/research/howto'];
const LB03 = 'tools/plates/library/pages/lb03.layers.json', CROP = 'tools/plates/library/render/closeup/crop.mjs';
const BLP = 'tools/plates/library/build-layers-page.mjs';
const W8B_ORDER = ['lib_pendlay_row', 'lib_landmine_row', 'lib_dumbbell_romanian_deadlift', 'lib_conventional_deadlift', 'lib_sumo_deadlift',
  'lib_t_bar_row', 'lib_barbell_shrug', 'lib_cable_shrug', 'lib_dumbbell_shrug', 'lib_smith_machine_shrug'];   // 1fdf6975's lb03 group
const MAIN_CARD = 'e0a154bd9d8408039c62ff62750d498ccde155049dab17e244e58b50e084bc1d';   // the conventional card the W8b panel judged
const SUMO_CARD = 'b1c29f89112a13a7bc104e7a7cf584cc4afa72c4dbe3273e4ed842f2d8d3dd0b';   // sumo's W8b PASS card (198,677 chars)
const trees: string[] = [];
afterAll(() => { for (const t of trees) rmSync(t, { recursive: true, force: true }); });
/** Replaces `a` (exactly once) by `b`. */
const swap = (a: string, b: string) => (s: string) => { expect(s.split(a).length - 1, a).toBe(1); return s.replace(a, b); };
/** Child processes run async, so the vitest worker's rpc is never blocked by a 15 s build. */
const run = async (T: string, args: string[]) => {
  try { return (await promisify(execFile)(process.execPath, args, { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28 })).stdout; }
  catch (e: any) { throw new Error(e.stderr || e.stdout || String(e)); }
};
/** Runs `fn` with `edits` applied to T's files, then puts the files back. */
async function mutated<R>(T: string, edits: Record<string, (s: string) => string>, fn: () => Promise<R>): Promise<R> {
  const keep = Object.keys(edits).map(p => [p, readFileSync(join(T, p), 'utf8')] as const);
  try {
    for (const [p, before] of keep) { const after = edits[p]!(before); expect(after, `${p}: the mutation must change the file`).not.toBe(before); writeFileSync(join(T, p), after); }
    return await fn();
  } finally { for (const [p, before] of keep) writeFileSync(join(T, p), before); }
}
/** The lb03 layers config with the W8b group: main's group plus the missing ids, in 1fdf6975's order. */
const staged = (s: string) => {
  const c = JSON.parse(s), ids: string[] = c.groups[0].ids;
  for (const id of ids) expect(W8B_ORDER, id).toContain(id);
  c.groups[0].ids = W8B_ORDER.slice();
  for (const [id, key] of [['lib_dumbbell_romanian_deadlift', 'dumbbell_romanian_deadlift'], ['lib_conventional_deadlift', 'conventional_deadlift'], ['lib_sumo_deadlift', 'sumo_deadlift'], ['lib_dumbbell_shrug', 'dumbbell_shrug']]) c.closeups[id!] ??= { optionsKey: key };
  return `${JSON.stringify(c, null, 2)}\n`;
};
const page = async (T: string) => {
  const out = join(T, 'lb03.scratch.html');
  await run(T, ['scripts/howto-rebuild.mjs', '--page', 'tests/howto/golden/library/lb03.json', 'layers-page', out]);
  return readFileSync(out, 'utf8');
};
const cardOf = (html: string, id: string) => { const a = html.indexOf(`<article class="sheet-card" id="card-${id}"`), b = html.indexOf('</article>', a); expect(a).toBeGreaterThan(-1); return html.slice(a, b); };
/** The card less its two changed blocks: the dl-liftoff zoom (from its zx div, the last zoom, to the grip section) and
 *  the feel section (D-DL-L4, to the setup section). */
const lessChanged = (card: string) => {
  const i = card.indexOf('<div class="zx" id="conventional-deadlift-zoom-dl-liftoff"'), j = card.indexOf('<section class="hw-sec grip"', i);
  const k = card.indexOf('<section class="hw-sec feel" id="conventional-deadlift-feel"', j), l = card.indexOf('<section class="hw-sec setup"', k);
  expect(i).toBeGreaterThan(-1); expect(j).toBeGreaterThan(i); expect(k).toBeGreaterThan(j); expect(l).toBeGreaterThan(k);
  return [card.slice(0, i), card.slice(j, k), card.slice(l)];
};
/** main d92830c2's dl-liftoff zoom, SHOOT_KNEE and feel (m1: "the same page built without the change"). */
const toMain = (s: string) => [
  swap('LE = landmarksOf(END, H), SHOOT_KNEE = 15;', 'LE = landmarksOf(END, H), SHOOT_KNEE = 30;'),
  swap("crop: { center: { at: 'hip.r', pose: 'right', off: [20, 35] }, sizePx: 180 },", "crop: { center: { at: 'hip.r', pose: 'right', off: [0, 10] }, sizePx: 200 },"),
  swap('wrong: { base: \'end\', pose: SHOOT, equipmentList: LIFT_EQ },\n    guides: [{ kind: \'drop\', from: { at: \'hip.r\', pose: \'right\', off: [-26, 0] }, to: { at: \'hip.r\', pose: \'mistake\', off: [-26, 0] } }],', 'wrong: { base: \'end\', pose: SHOOT, solid: true },'),
  swap("wrong: { text: 'Hips shoot up', anchor: { at: 'hip.r', pose: 'mistake' } },", "wrong: { text: 'Hips shoot up', anchor: 'hip.r' },"),
  ...FEEL_TO_MAIN,
].reduce((a, f) => f(a), s);
/** main's feel (D-DL-L4 reverted): lower back Also working, the old feel line, no watchMain. */
const FEEL_TO_MAIN = [
  swap("    { muscleId: 'hamstrings', plain: 'The back of the thighs should feel the work.' },\n    { muscleId: 'lower_back', plain: 'The lower back works hard in this lift.' },\n",
    "    { muscleId: 'hamstrings', plain: 'The back of the thighs should feel the work.' },\n"),
  swap("  secondary: [\n    { muscleId: 'quads',", "  secondary: [\n    { muscleId: 'lower_back', plain: 'The lower back works hard in this lift.' },\n    { muscleId: 'quads',"),
  swap("  watchMain: true,\n", ''),
  swap("'You should feel this in your glutes, hamstrings and lower back. Front thighs help off the floor.'", "'You should feel this in your glutes and hamstrings, not your back. Front thighs help off the floor.'"),
];
async function ht4(T: string, libId: string, chrome: string): Promise<string[]> {
  const code = `
    import { recorder } from './tools/plates/library/fidelity/rows.mjs';
    import { runNode } from './tools/plates/library/fidelity/twins/ht4.mjs';
    const R = recorder(), ctx = { R, root: process.cwd() };
    await runNode(ctx, { lib: ${JSON.stringify(libId)}, chrome: ${JSON.stringify(chrome)} });
    console.log(JSON.stringify(R.problems));`;
  return JSON.parse((await run(T, ['--input-type=module', '-e', code])).trim().split('\n').pop()!) as string[];
}

describe('F-DL-LIFTOFF C8-C10: the scratch lb03 page (W8b form) and HT4 on the real row', () => {
  let T = '', A = '';
  beforeAll(async () => {
    T = mkdtempSync(join(tmpdir(), 'f-dl-liftoff-'));
    trees.push(T);
    for (const p of COPY) if (existsSync(join(ROOT, p))) cpSync(join(ROOT, p), join(T, p), { recursive: true });
    symlinkSync(join(ROOT, 'node_modules'), join(T, 'node_modules'), 'dir');
    writeFileSync(join(T, LB03), staged(readFileSync(join(T, LB03), 'utf8')));
    A = await page(T);
  }, T_MS);
  it('C8: built twice, the page is the same', async () => {
    expect(sha(await page(T))).toBe(sha(A));
  }, T_MS);
  it('C8: only the Liftoff block and the feel section of the conventional card differ from the page built without the change (m1: main\'s zoom and feel)', async () => {
    const B = await mutated(T, { [HOWTO]: toMain }, () => page(T));
    const a = cardOf(A, 'conventional-deadlift'), b = cardOf(B, 'conventional-deadlift');
    expect(sha(b)).toBe(MAIN_CARD);   // the page without the change carries the judged card
    expect(sha(a)).not.toBe(MAIN_CARD);
    expect(A.replace(a, '')).toBe(B.replace(b, ''));
    expect(lessChanged(a)).toEqual(lessChanged(b));
  }, T_MS);
  it('C9: sumo_deadlift\'s card is byte-equal to its W8b PASS card', () => {
    const c = cardOf(A, 'sumo-deadlift');
    expect([c.length, sha(c)]).toEqual([198_677, SUMO_CARD]);
  }, T_MS);
  it('C10: conventional_deadlift has HT4/A5-protected, A5-fragments and A5-poses clean', async () => {
    expect(await ht4(T, 'lib_conventional_deadlift', 'conventional-deadlift')).toEqual([]);
  }, T_MS);
  // D-DL-L4 (panel L4 [4,3,3], #427): the lower back is Main (card feel.primary, c15), the feel line names it, and both
  // lower-back rows keep the dashed watch outline (D-DL-WATCHMAIN: feel.watchMain, opt-in, a build-layers-page.mjs patch)
  const feelOf = (html: string) => { const c = cardOf(html, 'conventional-deadlift'), a = c.indexOf('<section class="hw-sec feel" id="conventional-deadlift-feel"'), b = c.indexOf('<section class="hw-sec setup"', a); expect(a).toBeGreaterThan(-1); return c.slice(a, b); };
  const marks = (sec: string) => [...sec.matchAll(/<g class="feel-mark" data-row="([^"]+)"><g class="feel-quiet">[\s\S]*?<\/g><g class="feel-watch">/g)].map(q => q[1]);
  const MAIN = 'Where you should feel it. Main: glutes, hamstrings, lower back. Also working: quads, inner thighs, upper traps, forearms.';
  it('D-DL-L4: lower back Main, the card-true feel line, the watch outline on both lower-back rows', () => {
    const F = howto.feel, ids = (x: any[]) => x.map(m => m.muscleId);
    expect([ids(F.primary), ids(F.secondary), ids(F.watch), F.watchMain]).toEqual([['glutes', 'hamstrings', 'lower_back'], ['quads', 'adductors', 'upper_traps', 'forearms'], ['lower_back'], true]);
    expect(F.feelLine).toBe('You should feel this in your glutes, hamstrings and lower back. Front thighs help off the floor.');
    const sec = feelOf(A);
    expect(sec).toContain(`aria-label="${MAIN}"`);
    expect(sec).toContain(F.feelLine);
    expect(sec).not.toContain('not your back');
    expect(marks(sec)).toEqual(['low-back-over', 'low-back']);
  }, T_MS);
  it('red (flag ignored): the library patch drops the watch mark on a Main muscle -> no outline on either row', async () => {
    const B = await mutated(T, { [BLP]: swap("'const watch = (r.at?.muscles ?? []).filter(m => watchIds.has(m) && (F.watchMain === true || !priIds.has(m)));'", "'const watch = (r.at?.muscles ?? []).filter(m => watchIds.has(m) && !priIds.has(m));'") }, () => page(T));
    const sec = feelOf(B);
    expect(sec).toContain(`aria-label="${MAIN}"`);
    expect(marks(sec)).toEqual([]);
  }, T_MS);
  it('red m11: the dashed Wrong\'s Mistake pose moved 1 cm -> C10, the declared-fault text', async () => {
    const got = await mutated(T, { [CROP]: swap("if (role === 'wrong' && !solid) spec.mistake = { pose: poseOf(z.wrong),",
      "if (role === 'wrong' && !solid) spec.mistake = { pose: z.key === 'dl-liftoff' ? mergeDeep(poseOf(z.wrong), { root: { at: poseOf(z.wrong).root.at.map((v, i) => i === 1 ? v + 0.01 : v) } }) : poseOf(z.wrong),") },
    () => ht4(T, 'lib_conventional_deadlift', 'conventional-deadlift'));
    expect(got.length).toBeGreaterThan(0);
    expect(got.join('\n')).toMatch(/mistake\.pose matches neither the reference mistake pose nor its declared fault pose/);
  }, T_MS);
});

/* ------------------------------------------------------- D-DL-WATCHMAIN: the exact set of how-tos that set the flag */
const HOWTO_DIRS = ['tools/plates/library/howto', 'tools/plates/layers/exercises'];
/** Every how-to under `root` whose feel sets watchMain (any value), as repo paths, sorted. Text scan of the source, so a
 *  how-to that fails to import still counts. */
const watchMainIds = (root: string) => HOWTO_DIRS.flatMap(d => readdirSync(join(root, d)).filter(f => f.endsWith('.howto.mjs'))
  .filter(f => /\bwatchMain\s*:/.test(readFileSync(join(root, d, f), 'utf8'))).map(f => `${d}/${f}`)).sort();
describe('F-DL-LIFTOFF D-DL-WATCHMAIN: only conventional_deadlift sets feel.watchMain', () => {
  it('green: the exact set', () => {
    expect(watchMainIds(ROOT)).toEqual([HOWTO]);
  });
  it('red: the flag on a second id (sumo_deadlift)', () => {
    const T = mkdtempSync(join(tmpdir(), 'f-dl-watchmain-'));
    trees.push(T);
    for (const d of HOWTO_DIRS) cpSync(join(ROOT, d), join(T, d), { recursive: true });
    const SUMO = 'tools/plates/library/howto/lib_sumo_deadlift.howto.mjs';
    writeFileSync(join(T, SUMO), swap('const feel = {\n', 'const feel = {\n  watchMain: true,\n')(readFileSync(join(T, SUMO), 'utf8')));
    expect(watchMainIds(T)).toEqual([HOWTO, SUMO]);
    expect(watchMainIds(T)).not.toEqual([HOWTO]);
  });
});
