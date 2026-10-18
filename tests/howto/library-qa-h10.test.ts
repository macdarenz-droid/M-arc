// LIB-3b: PQ-H10 applies derive.mjs's own rule (PARAMS and paramProblems) against the pinned envelope on the real path
// (candidateOf -> runQa), on the LIB-2b fixture row turned into a D child of lib_pull_up in memory. Nothing is written
// to rows.json, batches/ or tests/howto/golden/; TEST_ENV lives only in this file.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as F from './fixtures/lib2b/fixture.mjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 180_000;
let root: string, cand: any, I: any, node: any, der: any, eng: any, mirror: string, E: any, pins: any, base: any[], row: any, html: string, TEST_ENV: any;

beforeAll(async () => {
  root = F.fixtureTree();
  const im = (p: string) => import(/* @vite-ignore */ F.url(root, p));
  let bg: any, reg: any, golden: any;
  [cand, bg, reg, der, golden, eng, I, node] = await Promise.all(['tools/plates/library/candidate.mjs', 'tools/plates/library/batch-golden.mjs', 'tools/plates/library/registry.mjs',
    'tools/plates/library/derive.mjs', 'tools/plates/golden.mjs', 'tools/plates/library/qa/engine.mjs', 'tools/plates/library/qa/index.mjs', 'tools/plates/library/qa/node.mjs'].map(im));
  mirror = golden.makeMirror();
  E = await eng.loadEngine(mirror);
  pins = I.loadPins();
  base = reg.rows();
  row = base.find((r: any) => r.id === F.ID);
  html = await bg.platesPage(row, base);
  TEST_ENV = { ...pins.envelope, 'camera.maxScale': [0.9, 1.1], 'bar.kind': ['straight', 'ez'], handedness: ['both'] };
}, T);
afterAll(() => { if (mirror) eng.dropMirror(mirror); if (root) F.drop(root); });

const dAll = (params: unknown) => base.map(r => (r.id === F.ID ? { ...row, mode: 'D', parent: 'lib_pull_up', params } : r));
const candidate = (params: unknown) => cand.candidateOf(F.ID, { platesHtml: html, engine: E, all: dAll(params) });
const keys = (r: any) => I.HARD.flatMap((h: string) => r.hard[h].problems.filter((p: any) => p.key !== 'browser:not-run').map((p: any) => `${h} ${p.key}`));
/** The node-half report for `params`; `ctx` is {} (pinned envelope), { envelope } or { pins }; `edit` changes candidateOf's output. */
async function qa(params: unknown, ctx: any = {}, edit: (c: any) => void = () => {}) {
  const c = await candidate(params);
  edit(c);
  const report = cand.nodeHalf(await I.runQa(c, { engine: E, ...ctx }));
  return { report, keys: keys(report), h10: report.hard['PQ-H10'].problems };
}
const first = (p: unknown, env: unknown) => der.paramProblems(p, env)[0];

describe('LIB-3b PQ-H10 on the real path', { timeout: T }, () => {
  it('3b-A1 bar.kind banana is red with H10.value; straight is clean (test envelope)', async () => {
    const bad = await qa({ 'bar.kind': 'banana' }, { envelope: TEST_ENV });
    expect(bad.keys).toEqual(['PQ-H10 H10.value:bar.kind']);
    expect(bad.h10[0].text).toBe(first({ 'bar.kind': 'banana' }, TEST_ENV));
    const ok = await qa({ 'bar.kind': 'straight' }, { envelope: TEST_ENV });
    expect([ok.keys, ok.report.ok]).toEqual([[], true]);
    const pinned = await qa({ 'bar.kind': 'banana' });
    expect(pinned.keys).toEqual(['PQ-H10 H10.envelope:bar.kind']);
    expect(pinned.h10[0].text).toBe(first({ 'bar.kind': 'banana' }, pins.envelope));
  });

  it('3b-A1b the pinned envelope reaches PQ-H10', async () => {
    const ctx = { pins: { ...pins, envelope: TEST_ENV } };
    const ok = await qa({ 'camera.maxScale': 1 }, ctx);
    expect([ok.keys, ok.report.ok]).toEqual([[], true]);
    const bad = await qa({ 'camera.maxScale': 99 }, ctx);
    expect(bad.keys).toEqual(['PQ-H10 H10.value:camera.maxScale']);
    expect(bad.h10[0].text).toBe(first({ 'camera.maxScale': 99 }, TEST_ENV));
  });

  it('3b-A2 camera.maxScale 99 is red with H10.value; 1 is clean (test envelope)', async () => {
    const bad = await qa({ 'camera.maxScale': 99 }, { envelope: TEST_ENV });
    expect(bad.keys).toEqual(['PQ-H10 H10.value:camera.maxScale']);
    expect(bad.h10[0].text).toBe(first({ 'camera.maxScale': 99 }, TEST_ENV));
    const ok = await qa({ 'camera.maxScale': 1 }, { envelope: TEST_ENV });
    expect([ok.keys, ok.report.ok]).toEqual([[], true]);
  });

  it('3b-A3 handedness 7 is red with H10.value; both is clean (test envelope)', async () => {
    const bad = await qa({ handedness: 7 }, { envelope: TEST_ENV });
    expect(bad.keys).toEqual(['PQ-H10 H10.value:handedness']);
    expect(bad.h10[0].text).toBe(first({ handedness: 7 }, TEST_ENV));
    const ok = await qa({ handedness: 'both' }, { envelope: TEST_ENV });
    expect([ok.keys, ok.report.ok]).toEqual([[], true]);
  });

  it('3b-A4 empty params are red with H10.empty', async () => {
    for (const [ctx, env] of [[{}, pins.envelope], [{ envelope: TEST_ENV }, TEST_ENV]]) {
      const r = await qa({}, ctx);
      expect(r.keys).toEqual(['PQ-H10 H10.empty']);
      expect(r.h10[0].text).toBe(first({}, env));
    }
  });

  const A5: [Record<string, unknown>, string, string | null][] = [
    [{ 'camera.maxScale': '1' }, 'H10.value:camera.maxScale', 'camera.maxScale="1" is not a number in [undefined, undefined]'],
    [{ 'bar.kind': 'rope' }, 'H10.value:bar.kind', null],
    [{ gripWidth: 0.5 }, 'H10.unknown:gripWidth', 'PARAMS key gripWidth is not in the template\'s PARAMS'],
    [{ tempo: [] }, 'H10.raw:tempo', 'PARAMS key tempo is a raw-spec override'],
    [{ view: 'front' }, 'H10.raw:view', 'PARAMS key view is a raw-spec override'],
    [{ 'view.yaw': 10 }, 'H10.unknown:view.yaw', 'PARAMS key view.yaw is not in the template\'s PARAMS'],
  ];
  for (const [p, key, text] of A5) {
    it(`3b-A5 every other refusal gives one problem: ${JSON.stringify(p)} gives ${key} (test envelope)`, async () => {
      const r = await qa(p, { envelope: TEST_ENV });
      expect(r.keys).toEqual([`PQ-H10 ${key}`]);
      expect(r.h10[0].text).toBe(text ?? first(p, TEST_ENV));
    });
  }
  for (const k of ['constructor', 'toString', '__proto__']) {
    it(`3b-A5 every other refusal gives one problem: the inherited name ${k} gives H10.unknown (both envelopes)`, async () => {
      for (const ctx of [{}, { envelope: TEST_ENV }]) {
        const p = JSON.parse(`{"${k}":${k === 'toString' ? '"x"' : 1}}`);
        expect(Object.hasOwn(p, k)).toBe(true);
        const r = await qa(p, ctx);
        expect(r.keys).toEqual([`PQ-H10 H10.unknown:${k}`]);
        expect(r.h10[0].text).toBe(`${k}: not a PARAMS key`);
      }
    });
  }

  it('3b-A5b a loosened candidate schema cannot pass', async () => {
    const loosen = (c: any) => { c.derivation.schema = { ...der.PARAMS, gripWidth: { type: 'number' }, 'view.yaw': { type: 'number' }, 'bar.kind': { enum: ['banana'] } }; };
    const grip = await qa({ gripWidth: 0.5 }, { envelope: TEST_ENV }, loosen);
    expect(grip.keys).toEqual(['PQ-H10 H10.unknown:gripWidth']);
    expect(grip.h10[0].text).toBe('gripWidth: not a PARAMS key');
    const yaw = await qa({ 'view.yaw': 10 }, { envelope: TEST_ENV }, loosen);
    expect(yaw.keys).toEqual(['PQ-H10 H10.raw:view.yaw']);
    expect(yaw.h10[0].text).toBe(first({ 'view.yaw': 10 }, TEST_ENV));
    const banana = await qa({ 'bar.kind': 'banana' }, { envelope: TEST_ENV }, loosen);
    expect(banana.keys).toEqual(['PQ-H10 H10.value:bar.kind']);
    expect(banana.h10[0].text).toBe(first({ 'bar.kind': 'banana' }, TEST_ENV));
  });

  it('3b-A6 the clean copy with the pinned envelope gets only H10.envelope:camera.maxScale', async () => {
    expect(Object.keys(der.PARAMS).filter(k => k in pins.envelope)).toEqual([]);
    const r = await qa({ 'camera.maxScale': 1 });
    expect(r.keys).toEqual(['PQ-H10 H10.envelope:camera.maxScale']);
    expect(r.h10.map((p: any) => p.text)).toEqual(['camera.maxScale: the envelope does not name it']);
    expect(r.report.ok).toBe(false);
    for (const h of I.HARD.filter((x: string) => x !== 'PQ-H10')) expect([h, r.report.hard[h].pass]).toEqual([h, true]);
    const ok = await qa({ 'camera.maxScale': 1 }, { envelope: TEST_ENV });
    expect(ok.report.ok).toBe(true);
  });

  it('3b-A7 h10 without an envelope fails closed', async () => {
    const c = await candidate({ 'camera.maxScale': 1 });
    expect((await node.h10(c)).map((p: any) => p.key)).toEqual(['H10.envelope:camera.maxScale']);
  });

  it('3b-A10 a malformed envelope row fails closed', async () => {
    for (const bad of [{ min: 0.9, max: 1.1 }, [1], true, JSON.parse('[0, 1e999]')]) {
      const r = await qa({ 'camera.maxScale': 99 }, { envelope: { ...TEST_ENV, 'camera.maxScale': bad } });
      expect([bad, r.keys]).toEqual([bad, ['PQ-H10 H10.envelope:camera.maxScale']]);
      expect(r.h10[0].text).toBe(`camera.maxScale: the envelope row ${JSON.stringify(bad)} is malformed`);
    }
    const r = await qa({ 'bar.kind': 'ez' }, { envelope: { ...TEST_ENV, 'bar.kind': 'straight ez' } });
    expect(r.keys).toEqual(['PQ-H10 H10.envelope:bar.kind']);
    expect(r.h10[0].text).toBe('bar.kind: the envelope row "straight ez" is malformed');
  });
});
