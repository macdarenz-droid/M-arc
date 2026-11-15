// LIB-PLATEFIX-5 item 4 (card verify/lib-platefix-5-card.md; PLAN RULED #419 6849391955), F-UNDERHANDPQH1: generate refused the
// approved underhand_lat_pulldown plate once its row is `shipped` (#413 6761832489): the "Elbows down, back" box sat on the back
// (PQ-H1 normal figure, 28 cells) and the longest leader was under F3's floor (45.71; range 49.33-82.26). D-W8A-UNDERHANDHOLD: a
// PQ-H1 hard fail is a plate fix, never an exemption. Read from runQa's node half on the spec as the page builds it (the generate
// gate's hard rows and F3), and from the engine's drawn svg. platefix3-lb1.test.ts:33 (leader on the elbow, >= 30 deg off the upper
// arm) stays unchanged and green.
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 300_000;
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let qaEng: any, qaIdx: any, build: any, cand: any, golden: any, plate: any, bp: any, ulp: any, pins: any, E: any, mirror = '', all: any;
beforeAll(async () => {
  [qaEng, qaIdx, build, cand, plate] = await Promise.all(['qa/engine.mjs', 'qa/index.mjs', 'lb1/build.mjs', 'candidate.mjs', '../vendor/engine/plate.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  ulp = (await import(/* @vite-ignore */ lib('specs/underhand_lat_pulldown.mjs'))).default;
  pins = qaIdx.loadPins();
  mirror = golden.makeMirror();
  E = await qaEng.loadEngine(mirror);
  bp = await import(/* @vite-ignore */ lib('build-page.mjs'));
  all = build.lb1All();
}, T);
afterAll(() => { if (mirror) qaEng.dropMirror(mirror); });

const F3 = () => pins.envelope.F3 as number[];
// The spec as the page builds it: a scratch module that imports the real spec and sets the elbows box (null: the spec as is), the
// plates page built from it (the lb1-plates pageWith form), and the pinned-path candidate of that page, so F3 reads the drawn leaders.
const ID = 'underhand_lat_pulldown';
const candWith = async (box: any) => {
  const dir = mkdtempSync(join(tmpdir(), 'pf5-ulp-')), file = join(dir, `${ID}.mjs`);
  const src = pathToFileURL(join(process.cwd(), `tools/plates/library/specs/${ID}.mjs`)).href;
  writeFileSync(file, `import s from ${JSON.stringify(src)};\nconst box = ${JSON.stringify(box)};\n`
    + `export default box ? { ...s, callouts: s.callouts.map(c => (c.key === 'elbows' ? { ...c, box } : c)) } : s;\n`);
  try {
    const spec = (await import(/* @vite-ignore */ pathToFileURL(file).href)).default;
    const { html } = await bp.buildPlatesPage({ groups: [{ id: 'lb1', title: 'LB1', ids: [ID] }], sources: { [ID]: ['pf5'] }, specs: { [ID]: file } });
    return { ...(await cand.candidateOf(`lib_${ID}`, { all, platesHtml: html.toString('utf8'), engine: E })), spec };
  } finally { rmSync(dir, { recursive: true, force: true }); }
};
const run = async (box: any = null) => {
  const r = await qaIdx.runQa(await candWith(box), { engine: E, pins });
  const hard = qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  return { hard, f3: r.flags.F3, leaderMax: r.metrics?.leaderMax as number };
};

describe('PF5 item 4 underhand_lat_pulldown: the elbows box off the figure (PQ-H1) and F3 in range', { timeout: T }, () => {
  it(`the envelope is the one the refusal named (F3 [49.33, 82.26])`, () => {
    expect(F3().map(v => +v.toFixed(2))).toEqual([49.33, 82.26]);
  });
  it('no hard problem in the node half (no PQ-H1 on the elbows box), and F3 is not raised: the longest leader is inside the envelope', async () => {
    const { hard, f3, leaderMax } = await run();
    expect(hard).toEqual([]);
    expect(f3.raised, `F3 ${JSON.stringify(f3.value)}`).toBe(false);
    expect(leaderMax).toBeGreaterThanOrEqual(F3()[0]!);
    expect(leaderMax).toBeLessThanOrEqual(F3()[1]!);
  });
  it('mutation: the box back at main\'s { left: 2, top: 222 } is red (PQ-H1 normal figure on "Elbows down, back", F3 45.71 raised)', async () => {
    const { hard, f3, leaderMax } = await run({ left: 2, top: 222 });
    expect(hard.some((k: string) => /^H1\.engine:normal:figure:Elbows/.test(k)), hard.join(' ')).toBe(true);
    expect(f3.raised).toBe(true);
    expect(+leaderMax.toFixed(2)).toBe(45.71);
  });
  // Degrees between the "Elbows down, back" leader (the one ending on the end elbow) and the end upper arm; null: no such leader.
  const leaderDeg = (spec: any) => {
    const r = plate.renderPlate(spec, { id: 'pf5' }), cam = qaEng.cameraOf(spec, r.report);
    const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: E.PRIMITIVES, body: E.body }, spec);
    const e = cam.P(L.lm.end['elbow.r']), s = cam.P(L.lm.end['shoulder.r']);
    const ls = [...r.svg.matchAll(/<path class="leader[^"]*" d="M(-?[\d.]+) (-?[\d.]+)L(-?[\d.]+) (-?[\d.]+)/g)].map(m => m.slice(1, 5).map(Number));
    const l = ls.find(x => Math.hypot(x[0]! - e[0], x[1]! - e[1]) <= 1);
    if (!l) return null;
    const d = Math.abs((Math.atan2(l[3]! - l[1]!, l[2]! - l[0]!) - Math.atan2(s[1] - e[1], s[0] - e[0])) * 180 / Math.PI) % 360;
    return d > 180 ? 360 - d : d;
  };
  const boxed = (box: any) => ({ ...ulp, callouts: ulp.callouts.map((c: any) => (c.key === 'elbows' ? { ...c, box } : c)) });
  it('the elbows leader still ends on the end elbow and meets it at least 30 deg off the upper arm (PF3 item 1, unchanged)', () => {
    expect(leaderDeg(ulp)).toBeGreaterThanOrEqual(30);
  });
  it('mutation: the box at PF3\'s first place (top 180, the leader along the upper arm) is red', () => {
    expect(leaderDeg(boxed({ left: 2, top: 180 }))).toBeLessThan(30);
  });
});
