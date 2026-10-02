// LIB-3: the plate QA gate (library plan 3.2 PQ-H1..H10, 3.3 F1-F7), node half. The browser half (H1 boxes, H4,
// H5, F2, F5) and its mutations run in tools/plates/library/qa/selftest.mjs, because Chromium is not installed when
// CI runs `npm run check`; LIB-4 wires that script into CI (D-LIB3-ci).
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const qa = (f: string) => new URL(`../../tools/plates/library/qa/${f}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let I: any, proof: any, pin: any, eng: any, labels: any, markup: any, muts: any, node: any, base: any;
const T = 180_000;

beforeAll(async () => {
  [I, proof, pin, eng, labels, markup, muts, node] = await Promise.all(['index.mjs', 'proof.mjs', 'pin.mjs', 'engine.mjs', 'labels.mjs', 'markup.mjs', 'mutations.mjs', 'node.mjs'].map(f => import(/* @vite-ignore */ qa(f))));
  base = await proof.cleanBase();
}, T);
afterAll(() => base?.drop());

const report = (chromeId: string) => base.reports.get(chromeId);
const nodeKeys = (r: any) => I.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
/** Test double of the browser half: what browser.mjs returns for a card with no problems (F5 as measured on the 8). */
const cleanBrowser = (ids: string[]) => new Map(ids.map(id => [id, { H1: [], H4: [], H5: [], flags: { F2: { value: 0.3, raised: false }, F5: { value: 3.57, raised: true } }, metrics: {} }]));

describe('LIB-3 pins: measured on the approved 8, never set by hand', { timeout: T }, () => {
  it('vocabulary.json equals a fresh measurement of the 8 golden fragments', () => {
    expect(pin.measureVocabulary(base.cands)).toEqual(base.pins.vocabulary);
  });
  it('envelope.json (node half) equals a fresh measurement on the 8', () => {
    const fresh = pin.measureNodeEnvelope(base.cands, base.E);
    for (const [k, v] of Object.entries(fresh)) expect([k, base.pins.envelope[k]]).toEqual([k, v]);
  });
  it('the browser half of envelope.json is present (selftest.mjs re-measures it)', () => {
    expect(Object.keys(base.pins.envelope.H5).sort()).toEqual(['ember', 'emerald', 'midnight', 'paper', 'silent-black']);
    expect(base.pins.envelope.F2).toHaveLength(2);
    expect(Object.keys(base.pins.envelope.H4zoom)).toEqual(['340', '360', '390']);
    expect(base.pins.envelope.H4zoom['390']).toBe(1);
  });
  it('the re-derived end landmarks land on the engine report keyJoints (H3/H9 parity with plate.mjs)', () => {
    for (const c of base.cands.filter((x: any) => x.spec)) {
      const r = base.E.renderPlate(c.spec, { id: `${c.plate.prefix}-n` }), L = eng.poseLandmarks(base.E, c.spec), cam = eng.cameraOf(c.spec, r.report);
      for (const j of r.report.keyJoints) { const p = cam.P(L.lm.end[j.k]); expect(Math.hypot(p[0] - j.p[0], p[1] - j.p[1])).toBeLessThan(0.3); }
    }
  });
});

describe('LIB-3 clean run on the approved 8', { timeout: T }, () => {
  it('every node problem of the 8 is one of its named exemptions', () => {
    for (const [, r] of base.reports) expect([r.id, nodeKeys(r)]).toEqual([r.id, []]);
  });
  it('every node exemption of the 8 matches a real problem (none unused, apart from the browser ones)', () => {
    const browserKeys = /^(H4\.|H1\.(ink|edge|overlap|joint|font|hscroll)|H5\.|F2$|F5$)/;
    for (const [, r] of base.reports) expect([r.id, r.unusedExemptions.filter((k: string) => !browserKeys.test(k))]).toEqual([r.id, []]);
  });
  it('a report without its browser half is never ok', () => {
    for (const [, r] of base.reports) { expect(r.ok).toBe(false); expect(r.hard['PQ-H4'].problems.map((p: any) => p.key)).toEqual(['browser:not-run']); }
  });
  it('with a clean browser half (test double) each of the 8 is ok', async () => {
    const ctx = { ...base.ctx, browser: cleanBrowser(base.cands.map((c: any) => c.id)) };
    for (const c of base.cands) expect([c.id, (await I.runQa(c, ctx)).ok]).toEqual([c.id, true]);
  });
  it('new plates inherit none of the 8\'s exemptions (the pull-up cloned as a new H plate)', async () => {
    const c = base.cands.find((x: any) => x.chromeId === 'pull-up');
    const r = await I.runQa({ ...c, id: 'lib_chin_up', mode: 'H' }, { ...base.ctx, browser: cleanBrowser(['lib_chin_up']) });
    expect(r.ok).toBe(false);
    expect(nodeKeys(r)).toEqual(expect.arrayContaining(['H6:no-card', 'H9.moving-line:eq3.line.0']));
    expect(r.flags.F5.blocks && r.flags.F7.blocks).toBe(true);
    const named = await I.runQa({ ...c, id: 'lib_chin_up', mode: 'H', exemptions: ['F5', 'F7'] }, { ...base.ctx, browser: cleanBrowser(['lib_chin_up']) });
    expect([named.flags.F5.blocks, named.flags.F7.blocks, named.flags.F5.approved]).toEqual([false, false, true]);
  });
  it('mode approved is refused for any id outside the 8', async () => {
    const c = base.cands.find((x: any) => x.chromeId === 'pull-up');
    const r = await I.runQa({ ...c, id: 'lib_chin_up' }, { ...base.ctx, browser: cleanBrowser(['lib_chin_up']) });
    expect(nodeKeys(r)).toContain('mode');
  });
  it('H6 passes when the card facts are drawn within ±2° and the tempo matches (control for M14/M15)', async () => {
    const c = base.cands.find((x: any) => x.chromeId === 'pull-up');
    const r = await I.runQa({ ...c, research: { plateFacts: [{ kind: 'angle', measure: true, deg: c.spec.measure.expect + 1.9 }], tempo: c.spec.tempo, topFault: null } }, base.ctx);
    expect(r.hard['PQ-H6'].problems).toEqual([]);
  });
});

describe('LIB-3 mutations: each check turns red on its planted mutation, the clean target does not', { timeout: T }, () => {
  it('every hard check and every flag has at least one planted mutation', () => {
    const all = [...muts.SPEC_MUTATIONS, ...muts.CANDIDATE_MUTATIONS, ...muts.PAGE_MUTATIONS].map((m: any) => m.check ?? m.flag);
    expect([...new Set(all)].sort()).toEqual([...I.HARD, ...I.FLAGS].sort());
  });
  it('the browser mutations are exactly the H1 browser half, H4, H5, F2 and F5 (selftest.mjs runs them)', () => {
    expect([...new Set(proof.BROWSER_MUTATIONS.map((m: any) => m.check ?? m.flag))].sort()).toEqual(['F2', 'F5', 'PQ-H1', 'PQ-H4', 'PQ-H5']);
  });
  it('the plan\'s seven named mutations are all planted', () => {
    const ids = [...muts.SPEC_MUTATIONS, ...muts.CANDIDATE_MUTATIONS].map((m: any) => m.id);
    for (const n of ['label 1 px onto the figure', 'contact 1 cm off', 'Trace below the minimum', 'Mistake equal to the end pose', 'a moving line part', 'a raw-spec override', 'a colour literal'])
      expect(ids.some((i: string) => i.endsWith(n))).toBe(true);
  });
  for (const name of ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'F1', 'F4', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'F3', 'F6', 'F7']) {
    it(`${name} turns red`, async () => {
      const m = proof.NODE_MUTATIONS.find((x: any) => x.id.startsWith(`${name} `));
      expect(m).toBeTruthy();
      const p = await proof.prove(m, base);
      expect({ id: p.id, red: p.red, cleanKeys: p.cleanKeys }).toEqual({ id: m.id, red: true, cleanKeys: [] });
    }, T);
  }
  it('M1 is exactly 1 px: the position 1 px back is clean', async () => {
    const c = base.cands.find((x: any) => x.chromeId === 'pull-up'), a = muts.SPEC_MUTATIONS[0].prepare(base.E, c.spec);
    const at = (box: any) => base.E.renderPlate({ ...c.spec, callouts: c.spec.callouts.map((x: any) => (x.key === 'chin' ? { ...x, box } : x)) }, { id: 'p-n' }).report.issues;
    expect(Math.abs(a.box.left - a.cleanAt.left) + Math.abs(a.box.top - a.cleanAt.top)).toBe(1);
    expect(at(a.cleanAt)).toEqual([]);
    expect(at(a.box).some((i: string) => i.startsWith('figure:Chin over bar'))).toBe(true);
  });
});

describe('LIB-3 generator seam: the generator refuses a report that is not ok (D-LIB3-5)', { timeout: T }, () => {
  // Test double of LIB-2's generator: it may emit a plate only through gatePlate(runQa(...)).
  const emit = async (c: any, ctx: any) => { I.gatePlate(await I.runQa(c, ctx)); return `src/howto/generated/ht-${c.chromeId}.ts`; };
  it('emits an ok plate', async () => {
    const c = base.cands.find((x: any) => x.chromeId === 'leg-press');
    await expect(emit(c, { ...base.ctx, browser: cleanBrowser([c.id]) })).resolves.toBe('src/howto/generated/ht-leg-press.ts');
  });
  it('refuses a plate with a failing hard check, naming the check', async () => {
    const m = muts.CANDIDATE_MUTATIONS.find((x: any) => x.id.startsWith('M9 ')), c = m.apply(base.cands.find((x: any) => x.chromeId === 'pull-up'));
    await expect(emit(c, { ...base.ctx, browser: cleanBrowser([c.id]) })).rejects.toThrow(/plate QA refused lib_pull_up:[\s\S]*PQ-H2 normalSvg: colour literal #e11d48/);
  });
  it('refuses a plate with a raised flag without a named exemption', async () => {
    const m = muts.CANDIDATE_MUTATIONS.find((x: any) => x.id.startsWith('F6 ')), c = m.apply(base.cands.find((x: any) => x.chromeId === 'pull-up'));
    await expect(emit(c, { ...base.ctx, browser: cleanBrowser([c.id]) })).rejects.toThrow(/F6 raised without a named exemption \(supervisor, owner-visible on the sheet\)/);
  });
  it('refuses when the browser half did not run, and refuses a missing report', async () => {
    await expect(emit(base.cands[1], base.ctx)).rejects.toThrow(/browser checks not run/);
    expect(() => I.gatePlate(null)).toThrow(/plate QA refused/);
  });
});

describe('LIB-3 label-search helper', { timeout: T }, () => {
  it('proposes a box for an unboxed label that renders with no engine issue, deterministically', () => {
    const s = base.cands.find((x: any) => x.chromeId === 'pull-up').spec;
    const bare = { ...s, callouts: s.callouts.map(({ box, ...r }: any) => (r.key === 'elbows' ? r : { ...r, box })) };
    const opt = { keys: ['elbows'], prefers: [undefined, 'left'], offsets: [[0, 0], [4, 0]] };
    const a = labels.searchLabels(base.E, bare, opt), b = labels.searchLabels(base.E, bare, opt);
    expect(a.proposals).toEqual(b.proposals);
    expect(a.proposals.map((p: any) => p.key)).toEqual(['elbows']);
    expect(a.proposals[0].box).toEqual({ left: expect.any(Number), top: expect.any(Number) });
    expect(a.verify.issues).toBe(0);
    const applied = base.E.renderPlate(a.spec, { id: 'ls-n' });
    expect(labels.score(applied).leaderMax).toBe(a.verify.leaderMax);
  }, T);
});

describe('LIB-3 markup helpers', { timeout: T }, () => {
  it('measures M/L/H path lengths exactly and refuses commands it cannot measure', () => {
    expect(markup.pathLength('M0 0L3 4H10')).toBe(12);
    expect(() => markup.pathLength('M0 0A5 5 0 0 1 10 0')).toThrow(/unsupported/);
  });
  it('allows #fff/#000 only inside a mask, and no var(', () => {
    expect(node.colourProblems('<mask id="a"><rect fill="#fff"/><use fill="#000"/></mask><path d="M0 0"/>', 't')).toEqual([]);
    expect(node.colourProblems('<path fill="#fff" d="M0 0"/>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:#fff', 'H2.colour:t:fill=#fff']);
    expect(node.colourProblems('<path style="stroke:red" d="M0 0"/>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:style']);
    expect(node.colourProblems('<path class="x" style="--o:var(--a)"/>', 't').map((p: any) => p.key)).toEqual(['H2.var:t']);
    expect(node.colourProblems('<mask id="a"><rect fill="#f00"/></mask>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:#f00', 'H2.colour:t:fill=#f00']);
    // the full scan runs inside a mask too (review M-1): named colours, colour functions and style colours are red there
    expect(node.colourProblems('<mask id="a"><rect fill="red"/></mask>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:fill=red']);
    expect(node.colourProblems('<mask id="a"><rect fill="rgb(255,0,0)"/></mask>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:fn', 'H2.colour:t:fill=rgb(255,0,0)']);
    expect(node.colourProblems('<mask id="a"><rect style="fill:#fff"/></mask>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:style']);
    expect(node.colourProblems('<mask id="a" fill="#fff"><rect fill="#fff"/></mask>', 't').map((p: any) => p.key)).toEqual(['H2.colour:t:#fff', 'H2.colour:t:fill=#fff']);
  });
  it('a partial or empty browser half is refused, cell by cell, and an unmeasured contrast class is raised (review H-1, L-2)', async () => {
    const B = await import(/* @vite-ignore */ qa('browser.mjs'));
    const empty = B.judge(null, undefined, base.pins.envelope);
    expect(empty.H1.map((p: any) => p.key)).toEqual(B.THEMES.flatMap((t: string) => B.WIDTHS.flatMap((w: number) => ['normal', 'mistake'].map(m => `H1.browser:incomplete:${t}:${w}:${m}`))));
    expect(empty.H5.map((p: any) => p.key)).toEqual(B.THEMES.flatMap((t: string) => Object.keys(base.pins.envelope.H5[t]).map(c => `H5.unmeasured:${t}:${c}`)));
  });
});
