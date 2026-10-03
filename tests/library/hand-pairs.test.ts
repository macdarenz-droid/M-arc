// LIB-7 (hands/DESIGN.md §4): the radial hand pairs. A1 golden B unchanged with every pair module loaded; A2 the
// C5-style geometry per drawn id (G1-G9) with a planted defect per check; A3 counted sweeps (keys, variants, drawn ids,
// gaps, census scope, claim refs and the facts their texts carry); A4 the close-up QA LIB-3 will run (vocabulary, colour
// literals, ids, determinism, size, inputsFor). The pixel checks are the gate block "LIB-7" (tools/plates/library/hands/gate.mjs).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let P: any, C: any, Z: any, sheet: any, page: any, cmp: any, opts: any, closeups: any, hand: any, layers: any, gen: any;
const CLAIMS = JSON.parse(readFileSync('tools/plates/library/hands/claims.json', 'utf8'));
const CENSUS = JSON.parse(readFileSync('tools/plates/library/hands/census-scope.json', 'utf8'));

// sha256 over every string the 8's close-up API returns (compare.mjs apiCalls, `name\0value\0` each), taken on the frozen
// base 9b8f76e, where LIB-6 proves each string === golden B's frozen script. A shared golden-B export changed by any
// module (HAND_PROP is mutable) moves these.
const API_SHA: Record<string, string> = {
  dumbbell_lateral_raise: '737346be995fbc2a53dd18b38404e42ee004b68e3462a8298e443b166ff3509f',
  pull_up: 'e4a8e9899426ef470052e0f7d7d84a26f7dbc8394e0148d7501651599aa2f5b1',
  hanging_leg_raise: '34473519ae8031e1e2bfcbe7138471bffb2fb9f92c0d26461882916bd45db7f3',
  lat_pulldown: '7fb4292f24edda4b77c9a648c9a9620bf510d0c370bb1101d84cf58f16fb13a1',
  seated_cable_row: '4421085222cdcef1f6a6af6d791201cfef0077de8233d43f3372feecc1fab9f0',
  machine_chest_press: '4e4b097d45a1ac426a2ca0a18e69b9b0fa169b1ec86e6dfc12d45dd0ec43429b',
  barbell_back_squat: '83c9d0734ffc3520d8ae49d1b4caee82d796218c5e5d5c0d67a3f8aeae067c79',
  leg_press: '83197adf7faaafda471b2976bba5904c0c1a780ea2e576d06ed443275a540bf4',
};
const ENGINE_SHA: Record<string, string> = {
  'tools/plates/layers/engine/hand.mjs': '0132b54b5cac1ecc32b218d18a397d4b9bfb78564b0b6342aec0bc3980c00299',
  'tools/plates/layers/engine/hand-pairs.mjs': '7fed75c3689a3b76cede1969cc50db3d3870edb08dee86fbc84cd4ec21a5bbec',
};

async function apiSha(id: string) {
  const mod = await import(/* @vite-ignore */ url(`tools/plates/layers/exercises/${id}.howto.mjs`));
  const api = closeups.closeupApi(mod, opts[id]), h = createHash('sha256');
  for (const [n, f] of cmp.apiCalls(api, mod.default)) h.update(`${n}\0${f()}\0`);
  return h.digest('hex');
}
async function approvedSvgs(): Promise<string[]> {
  const out: string[] = [];
  for (const id of Object.keys(opts)) {
    const mod = await import(/* @vite-ignore */ url(`tools/plates/layers/exercises/${id}.howto.mjs`));
    for (const [, f] of cmp.apiCalls(closeups.closeupApi(mod, opts[id]), mod.default)) for (const m of String(f()).matchAll(/<svg class="hand-svg"[\s\S]*?<\/svg>/g)) out.push(m[0]);
  }
  return out;
}

// copies of the loaded key modules with one change (files untouched)
const clone = () => P.MODULES.map((m: any) => ({ ...m, HANDLE: structuredClone(m.HANDLE), VARIANTS: structuredClone(m.VARIANTS ?? {}), IDS: structuredClone(m.IDS ?? {}), GAPS: { ...(m.GAPS ?? {}) } }));
const withMods = (f: (mods: any[]) => void) => { const mods = clone(); f(mods); return mods; };
const key = (mods: any[], k: string) => mods.find((m: any) => m.KEY === k);
// LIB-7's drawn ids only: LIB-12's keys share the loader and never change these counts (LIB-12 ask, supervisor OK 10-02)
const lib7Drawn = () => [...P.INDEX.drawn].filter(([, e]: any) => e.mod.OWNER === 'LIB-7').map(([id]: any) => id);

beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/hands/checks.mjs'));
  Z = await import(/* @vite-ignore */ url('tools/plates/library/hands/zoom.mjs'));
  sheet = await import(/* @vite-ignore */ url('tools/plates/library/hands/sheet.mjs'));
  page = await import(/* @vite-ignore */ url('tools/plates/library/hands/page.mjs'));
  cmp = await import(/* @vite-ignore */ url('tools/plates/library/render/compare.mjs'));
  closeups = await import(/* @vite-ignore */ url('tools/plates/library/render/closeups.mjs'));
  opts = (await import(/* @vite-ignore */ url('tools/plates/library/render/closeups-8.mjs'))).CLOSEUP_OPTIONS;
  hand = await import(/* @vite-ignore */ url('tools/plates/layers/engine/hand.mjs'));
  layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
  gen = await import(/* @vite-ignore */ url('tools/plates/gen/hands.mjs'));
});

describe('LIB-7 A1: golden B unchanged with every hand-*.mjs loaded', () => {
  it('the 8 close-ups === the frozen golden-B scripts (LIB-6 compare), after loading all key modules', async () => {
    expect(P.MODULES.length).toBeGreaterThan(0);
    expect(await cmp.compareCloseups(Object.keys(opts), opts)).toEqual([]);
  }, 180_000);
  it('the 8 close-up APIs hash to their pins', async () => {
    expect(Object.keys(API_SHA).sort()).toEqual(Object.keys(opts).sort());
    for (const id of Object.keys(API_SHA)) expect([id, await apiSha(id)]).toEqual([id, API_SHA[id]]);
  }, 60_000);
  it('golden-B engine hand files are byte-pinned', () => {
    for (const [f, h] of Object.entries(ENGINE_SHA)) expect([f, sha(readFileSync(f))]).toEqual([f, h]);
  });
  it('failure path: a module that changes a shared golden-B export on import moves a pin', async () => {
    const seg = hand.HAND_PROP.index.seg, keep = seg[0];
    try { seg[0] = keep * 1.01; expect(await apiSha('pull_up')).not.toBe(API_SHA.pull_up); } finally { seg[0] = keep; }
    expect(await apiSha('pull_up')).toBe(API_SHA.pull_up);
  }, 60_000);
});

describe('LIB-7 A2: geometry of every drawn pair (G1-G9)', () => {
  it('every drawn id has pages and no problem', () => {
    const ids = C.sweep(lib7Drawn(), 14, 'LIB-7 drawn ids');
    for (const id of ids) {
      const { spec, pages } = C.renderedPages(id);
      expect(pages.length).toBeGreaterThan(0);
      expect([id, C.problemsOf(spec, pages)]).toEqual([id, []]);
    }
  });
  const bites = (mods: any[], id: string, re: RegExp) => expect(C.pairProblems(id, P.indexOf(mods)).join('\n')).toMatch(re);
  it('G1: a Right wrist outside the range fails', () => bites(withMods(m => { key(m, 'curl').VARIANTS.dumbbell.right.wrist.ext = 20; }), 'hammer_curl', /G1 right wrist 20 outside -10..10/));
  it('G2: a Wrong on the other side of its claim fails', () => bites(withMods(m => { key(m, 'curl').VARIANTS.dumbbell.faults.curled.side = 'extended'; }), 'hammer_curl', /G2 wrong wrist -30 not extended/));
  it('G1/G2: Right and Wrong swapped fails', () => {
    const idx = P.indexOf(sheet.planted(P.MODULES, [{ id: 'ez_bar_curl', op: 'swap' }]));
    expect(C.pairProblems('ez_bar_curl', idx).join('\n')).toMatch(/G1 right wrist 30 outside/);
  });
  it('G3: a loose thumb fails', () => bites(withMods(m => { key(m, 'rope').VARIANTS.push.right.thumb = 'loose'; }), 'rope_triceps_pushdown', /G3 right thumb loose/));
  it('G4: a push handle on the fingers fails', () => bites(withMods(m => { key(m, 'd-handle').VARIANTS.push.right.contactAt = 1.0; }), 'single_arm_triceps_pushdown', /G4 right contact at/));
  it('G5: no explicit diameter throws; a renderer fallback is caught', () => {
    expect(() => P.pairSpec('rope_triceps_pushdown', P.indexOf(withMods(m => { delete key(m, 'rope').HANDLE.diameterMm; })))).toThrow(/no explicit handle diameter/);
    const { spec, pages } = C.renderedPages('rope_triceps_pushdown');
    pages[0].report.right.handleDiameterMm = 32;
    expect(C.problemsOf(spec, pages).join('\n')).toMatch(/G5 right handle rope 32 mm, want rope 28 mm/);
  });
  it('G6: a push Wrong in the heel (lever not behind the wrist) fails', () => bites(withMods(m => { key(m, 'ez').VARIANTS.push.faults['bent-back'].pose.contactAt = 0.3; }), 'skull_crusher', /G6 lever checks/));
  it('G6: a force line on a gravity curl fails', () => bites(withMods(m => { delete key(m, 'curl').VARIANTS.bar.loadLine; }), 'barbell_curl', /G6 force line drawn/));
  it('G8: an underhand id drawn palm down fails', () => {
    const { spec, pages } = C.renderedPages('barbell_curl'), m = pages[0].report.measured.right;
    m.handle[1] = m.wrist[1] + 10;                                   // the handle below the wrist: palm down
    expect(C.problemsOf(spec, pages).join('\n')).toMatch(/G8 palm down for underhand/);
  });
  it('G8: the thumb-side label is required where orientation is unstated', () => {
    const { spec, pages } = C.renderedPages('single_arm_triceps_pushdown');
    pages[0].svg = pages[0].svg.replace('aria-label="Seen from the thumb side.', 'aria-label="Seen from the side.');
    expect(C.problemsOf(spec, pages).join('\n')).toMatch(/G8 camera "Seen from the side", want "Seen from the thumb side"/);
  });
  it('G8: a level forearm with no stated orientation fails (D-LIB7-12)', () => {
    const idx = P.indexOf(withMods(m => { delete key(m, 'curl').GAPS.concentration_curl; key(m, 'curl').IDS.concentration_curl = { variant: 'dumbbell', orientation: 'unstated', faults: ['curled'], claims: [] }; }));
    expect(C.pairProblems('concentration_curl', idx).join('\n')).toMatch(/G8 a level forearm with no stated orientation/);
  });
  it('G8: a YOU/MACHINE row on a dumbbell fails, and the rope keeps its row (D-LIB7-11)', () => {
    const { spec, pages } = C.renderedPages('hammer_curl');
    expect(pages[0].svg).not.toMatch(/>MACHINE</);
    expect(C.problemsOf(spec, pages)).toEqual([]);
    pages[0].svg = pages[0].svg.replace('</svg>', '<text x="1" y="1">MACHINE</text></svg>');     // golden B's row back on a dumbbell
    expect(C.problemsOf(spec, pages).join('\n')).toMatch(/G8 a YOU\/MACHINE row with no machine/);
    const rope = C.renderedPages('rope_triceps_pushdown');
    expect(rope.pages[0].svg).toMatch(/>MACHINE</);
    expect(C.problemsOf(rope.spec, rope.pages)).toEqual([]);
    rope.pages[0].svg = rope.pages[0].svg.replace('>MACHINE<', '><');
    expect(C.problemsOf(rope.spec, rope.pages).join('\n')).toMatch(/G8 the YOU\/MACHINE row is missing/);
  });
  it('one pair of Wrong labels: "Wrist curled" (flexed) and "Wrist bent back" (extended) (D-LIB7-10)', () => {
    const LABEL: Record<string, string> = { flexed: 'Wrist curled', extended: 'Wrist bent back' };
    const bad = (mods: any[]) => mods.filter((m: any) => m.OWNER === 'LIB-7').flatMap((m: any) => Object.entries<any>(m.VARIANTS ?? {}).flatMap(([v, V]) =>
      Object.entries<any>(V.faults).filter(([, F]) => F.label !== LABEL[F.side]).map(([k, F]) => `${m.KEY}/${v}.${k}: ${F.label}`)));
    expect(bad(P.MODULES)).toEqual([]);
    expect(bad(withMods(m => { key(m, 'd-handle').VARIANTS.push.faults['bent-back'].label = 'Bent back'; }))).toEqual(['d-handle/push.bent-back: Bent back']);
  });
  it('G9: a bend value put back on the hand fails', () => {
    const { spec, pages } = C.renderedPages('barbell_curl'), p = pages[1], mv = p.report.labelsMoved[0];
    expect(mv).toBeTruthy();
    p.svg = p.svg.replace(`x="${mv.to[0]}" y="${mv.to[1]}"`, `x="${mv.from[0]}" y="${mv.from[1]}"`);
    expect(C.problemsOf(spec, [p]).join('\n')).toMatch(/G9 wrong label 30° on the hand/);
  });
});

// phrases a grip-orientation claim must hold (DESIGN §4 G8)
const PHRASES: Record<string, RegExp> = {
  under: /underhand|palms up|palms-up|palms-forward|palms forward|supinated/i,
  over: /overhand|palms down|palms toward the feet/i,
  neutral: /neutral|palms facing the body|palms facing each other/i,
};
// what a claim cited for each element must talk about (a wrong claim number reads as the wrong fact)
const FACT: Record<string, RegExp> = { knob: /clubbed end|knob/i, thumb: /thumb/i, wrist: /wrist/i, fault: /wrist|flex|bend|bent/i };
function claimProblems(mods: any[], claims: Record<string, string>) {
  const bad: string[] = [];
  const check = (ref: string, fact: RegExp | null, at: string) => {
    if (ref.startsWith('ga:')) { if (!P.CONVENTIONS[ref]) bad.push(`${at}: unknown convention ${ref}`); return; }
    if (!(ref in claims)) { bad.push(`${at}: ${ref} unresolved`); return; }
    if (fact && !fact.test(claims[ref]!)) bad.push(`${at}: ${ref} does not state ${fact}`);
  };
  for (const m of mods.filter((x: any) => x.OWNER === 'LIB-7')) {
    for (const [v, V] of Object.entries<any>(m.VARIANTS ?? {})) {
      for (const [el, refs] of Object.entries<any>(V.claims)) for (const r of refs) check(r, FACT[el] ?? null, `${m.KEY}/${v}.${el}`);
      for (const [k, F] of Object.entries<any>(V.faults)) { if (!F.claims.length) bad.push(`${m.KEY}/${v}.${k}: no claim`); for (const r of F.claims) check(r, FACT.fault!, `${m.KEY}/${v}.${k}`); }
    }
    for (const [id, c] of Object.entries<any>(m.IDS ?? {})) {
      if (c.orientation === 'unstated') { for (const r of c.claims) check(r, null, id); continue; }
      if (!c.claims.length) bad.push(`${id}: no orientation claim`);
      for (const r of c.claims) check(r, PHRASES[c.orientation]!, `${id} (${c.orientation})`);
    }
  }
  return bad;
}

describe('LIB-7 A3: counted sweeps, census scope and claims', () => {
  const lib7 = () => P.MODULES.filter((m: any) => m.OWNER === 'LIB-7');
  it('sweep throws on empty input and on a wrong count', () => {
    expect(() => C.sweep([], 1, 'x')).toThrow(/nothing to check/);
    expect(() => C.sweep([1, 2], 3, 'x')).toThrow(/2, expected 3/);
    expect(C.sweep(new Set([1, 2]), 2, 'x')).toEqual([1, 2]);
  });
  it('5 LIB-7 key files: 4 drawn keys and band (gaps only), 7 variants, 14 drawn ids, 16 gaps', () => {
    const mods = C.sweep(lib7(), 5, 'LIB-7 keys');
    expect(mods.map((m: any) => m.KEY)).toEqual(['band', 'curl', 'd-handle', 'ez', 'rope']);
    expect(C.sweep(mods.filter((m: any) => Object.keys(m.IDS ?? {}).length), 4, 'drawn keys').map((m: any) => m.KEY)).toEqual(['curl', 'd-handle', 'ez', 'rope']);
    expect(Object.keys(key(mods, 'band').IDS ?? {})).toEqual([]);
    C.sweep(mods.flatMap((m: any) => Object.keys(m.VARIANTS ?? {}).map(v => `${m.KEY}/${v}`)), 7, 'variants');
    C.sweep(mods.flatMap((m: any) => Object.keys(m.IDS ?? {})), 14, 'drawn ids');
    C.sweep(mods.flatMap((m: any) => Object.keys(m.GAPS ?? {})), 16, 'gap ids');
  });
  it('scope: drawn + gaps = the census ids of the LIB-7 kinds (30), sled_pull excepted (LIB-12), each once, archetypes matching', () => {
    const scope = new Set<string>([...CENSUS.byHandArchetype.curl, ...CENSUS.equipmentByNeed.band, ...CENSUS.equipmentByNeed.ezBar,
      ...CENSUS.equipmentByNeed.rope, ...CENSUS.equipmentByNeed.ropeLikely, ...CENSUS.equipmentByNeed.singleHandle]);
    scope.delete('lib_sled_pull');
    const lib = C.sweep(scope, 30, 'census scope');
    const mine = lib7().flatMap((m: any) => [...Object.keys(m.IDS ?? {}), ...Object.keys(m.GAPS ?? {})]);
    expect(C.sweep(mine, 30, 'LIB-7 ids').map((i: string) => `lib_${i}`).sort()).toEqual([...lib].sort());
    for (const [id, e] of P.INDEX.drawn) if (e.mod.OWNER === 'LIB-7') expect([id, CENSUS.archetype[`lib_${id}`]]).toEqual([id, e.mod.VARIANTS[e.cfg.variant].archetype]);
  });
  it('failure paths: a key file missing, an id in two keys, a gap id drawn', () => {
    const noRope = clone().filter((m: any) => m.KEY !== 'rope');
    expect(() => C.sweep(noRope.filter((m: any) => m.OWNER === 'LIB-7'), 5, 'LIB-7 keys')).toThrow(/4, expected 5/);
    expect(() => P.indexOf(withMods(m => { key(m, 'ez').IDS.hammer_curl = { variant: 'curl', orientation: 'neutral', faults: ['curled'], claims: [] }; }))).toThrow(/hammer_curl is in curl and ez/);
    expect(() => P.indexOf(withMods(m => { key(m, 'd-handle').IDS.cable_fly = { variant: 'push', orientation: 'unstated', faults: ['bent-back'], claims: [] }; }))).toThrow(/cable_fly is in d-handle and d-handle/);
  });
  it('joint check: no id is claimed by a LIB-7 and a LIB-12 module (drawn or gap)', () => {
    // LIB-7's real modules plus one planted LIB-12 module (a key and an id in no card), so LIB-12's real keys never collide
    const lib7 = () => clone().filter((m: any) => m.OWNER === 'LIB-7');
    const lib12 = { KEY: 'zz-planted', OWNER: 'LIB-12', VIEW: 'zz-view', FILE: 'x', render: () => ({ svg: '', report: {} }),
      VARIANTS: { v: { archetype: 'palm-flat', right: { view: 'zz-view' }, faults: { f: { label: 'x', side: 'flexed', pose: {}, claims: [] } } } }, IDS: {} as any, GAPS: {} as any };
    expect(() => P.indexOf([...lib7(), { ...lib12, IDS: { zz_planted_id: { variant: 'v', orientation: 'unstated', faults: ['f'], claims: [] } } }])).not.toThrow();
    expect(() => P.indexOf([...lib7(), { ...lib12, IDS: { hammer_curl: { variant: 'v', orientation: 'unstated', faults: ['f'], claims: [] } } }])).toThrow(/hammer_curl is in curl and zz-planted/);
    expect(() => P.indexOf([...lib7(), { ...lib12, GAPS: { cable_fly: 'x' } }])).toThrow(/cable_fly is in d-handle and zz-planted/);
    expect(() => P.indexOf(P.MODULES)).not.toThrow();                // the real modules of every owner, as loaded
  });
  it('diameter: a radial key without one fails; a non-radial view without a handle is allowed (LIB-12 ask)', () => {
    expect(() => P.pairSpec('rope_triceps_pushdown', P.indexOf(withMods(m => { delete key(m, 'rope').HANDLE.diameterMm; })))).toThrow(/no explicit handle diameter/);
    const flat = { KEY: 'zz-flat', OWNER: 'LIB-12', VIEW: 'palm-flat', FILE: 'x', render: () => ({ svg: '<svg></svg>', report: {} }),
      VARIANTS: { floor: { archetype: 'palm-flat', right: { view: 'palm-flat' }, faults: { f: { label: 'x', side: 'flexed', pose: {}, claims: [] } } } },
      IDS: { zz_planted_id: { variant: 'floor', orientation: 'unstated', faults: ['f'], claims: [] } } };
    const s = P.pairSpec('zz_planted_id', P.indexOf([flat]));
    expect([s.handle, s.right.handle, s.extras]).toEqual([null, {}, {}]);
    expect(() => P.pairSpec('zz_planted_id', P.indexOf([{ ...flat, HANDLE: { profile: 'floor' } }]))).toThrow(/no explicit handle diameter/);
  });
  it('the claims extract is the research commit\'s, and every ref resolves and states its fact', () => {
    expect(CLAIMS.research).toBe('95342b1');
    for (const r of Object.keys(CLAIMS.claims)) expect(CLAIMS.files).toHaveProperty(r.split('#')[0]!);
    expect(claimProblems(P.MODULES, CLAIMS.claims)).toEqual([]);
  });
  it('failure paths: an unknown claim, a claim number that names another fact, reverse_curl drawn underhand', () => {
    const c99 = withMods(m => { key(m, 'curl').VARIANTS.dumbbell.claims.thumb = ['shared/curl.json#c99']; });
    expect(claimProblems(c99, CLAIMS.claims).join('\n')).toMatch(/shared\/curl.json#c99 unresolved/);
    const pulley = withMods(m => { key(m, 'rope').VARIANTS.push.claims.knob = ['cards/rope_triceps_pushdown.json#c1']; });
    const withPulley = { ...CLAIMS.claims, 'cards/rope_triceps_pushdown.json#c1': 'Fix a rope to the cable pulley at its top position (above head height).' };
    expect(claimProblems(pulley, withPulley).join('\n')).toMatch(/rope_triceps_pushdown.json#c1 does not state/);
    const under = withMods(m => { key(m, 'ez').IDS.reverse_curl.orientation = 'under'; });
    expect(claimProblems(under, CLAIMS.claims).join('\n')).toMatch(/reverse_curl \(under\): cards\/reverse_curl.json#c1 does not state/);
  });
  it('the rope strand is the plate composer\'s (eq/rope.mjs thick 0.028)', () => {
    expect(readFileSync('tools/plates/library/eq/rope.mjs', 'utf8')).toMatch(/thick = 0\.028\b/);
    expect(key(P.MODULES, 'rope').HANDLE.diameterMm).toBe(28);
  });
});

const COLOUR = /#[0-9a-f]{3,8}(?![\w-])|\brgba?\(|\bhsla?\(|\bvar\(|\sstyle=/i;
function vocab(svgs: string[]) {
  const el = new Set<string>(), at = new Set<string>(), cls = new Set<string>();
  for (const s of svgs) {
    for (const m of s.matchAll(/<([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*\/?>/g)) {
      el.add(m[1]!);
      for (const a of m[2]!.matchAll(/([\w:-]+)="([^"]*)"/g)) { at.add(a[1]!); if (a[1] === 'class') a[2]!.split(/\s+/).forEach(c => cls.add(c)); }
    }
  }
  return { el, at, cls };
}
function markupProblems(svg: string, uid: string, gold: ReturnType<typeof vocab>) {
  const bad: string[] = [], v = vocab([svg]);
  for (const [k, set] of [['element', 'el'], ['attribute', 'at'], ['class', 'cls']] as const) for (const x of v[set]) if (!gold[set].has(x)) bad.push(`${k} ${x} not in golden B`);
  const col = svg.match(COLOUR); if (col) bad.push(`colour literal ${col[0]}`);
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!);
  if (new Set(ids).size !== ids.length) bad.push('duplicate id');
  for (const i of ids) if (!i.startsWith(`${uid}-`)) bad.push(`id ${i} not prefixed ${uid}`);
  return bad;
}

describe('LIB-7 A4: close-up QA (LIB-3 PQ-H2, PQ-H7) and inputsFor', () => {
  let gold: ReturnType<typeof vocab>;
  beforeAll(async () => { gold = vocab(await approvedSvgs()); });
  it('H2: markup within golden B\'s vocabulary, no colour literal, ids unique and uid-prefixed', () => {
    let n = 0;
    for (const id of lib7Drawn()) for (const w of P.pairSpec(id).wrong) {
      const uid = `q-${n++}`, { svg } = P.renderPair(id, { fault: w.key, uid });
      expect([id, w.key, markupProblems(svg, uid, gold)]).toEqual([id, w.key, []]);
    }
    expect(n).toBe(24);
  });
  it('H2 failure paths: a new element, a colour literal, a duplicated id, a foreign id', () => {
    const { svg } = P.renderPair('hammer_curl', { uid: 'q' });
    expect(markupProblems(svg.replace('</svg>', '<ellipse class="h-new"/></svg>'), 'q', gold).join('\n')).toMatch(/element ellipse.*\n?.*class h-new/s);
    expect(markupProblems(svg.replace('class="h-eq"', 'fill="#123" class="h-eq"'), 'q', gold).join('\n')).toMatch(/colour literal #123/);
    const d = svg.match(/<path id="(q-[^"]+)" d="[^"]*"\/>/)!;
    expect(markupProblems(svg.replace('</defs>', `${d[0]}</defs>`), 'q', gold)).toContain('duplicate id');
    expect(markupProblems(svg.replace(`id="${d[1]}"`, 'id="x-1"'), 'q', gold).join('\n')).toMatch(/id x-1 not prefixed q/);
  });
  it('H7: two builds are byte-identical; each id\'s hand zoom fits the largest golden-B hand chunk ceiling', () => {
    const cap = gen.handCeiling('pull-up');
    for (const id of lib7Drawn()) {
      const z = Z.pairZoom(id, page.zoomTextsOf(id));
      const html = P.pairSpec(id).wrong.map((w: any) => z.handZoom(w.key)).join('');
      const again = P.pairSpec(id).wrong.map((w: any) => z.handZoom(w.key)).join('');
      expect(again === html).toBe(true);
      expect([id, html.length <= cap.raw, gzipSync(html).length <= cap.gz]).toEqual([id, true, true]);
    }
  });
  it('inputsFor: the id\'s key file and everything the drawing imports, no other key file, all present', () => {
    for (const id of lib7Drawn()) {
      const files = P.inputsFor(id), mine = P.INDEX.drawn.get(id).mod.FILE;
      for (const f of files) expect([f, existsSync(join(layers.ROOT, f))]).toEqual([f, true]);
      for (const f of ['tools/plates/library/hands/pairs.mjs', 'tools/plates/library/hands/zoom.mjs', 'tools/plates/library/hands/radial-rules.mjs',
        'tools/plates/layers/engine/hand.mjs', 'tools/plates/layers/engine/geom.mjs', 'tools/plates/library/render/closeup/common.mjs', mine]) expect(files).toContain(f);
      expect(files.filter((f: string) => /\/hand-[a-z-]+\.mjs$/.test(f) && f.includes('library/hands/'))).toEqual([mine]);
    }
    expect(P.inputsFor('rope_triceps_pushdown')).toContain('tools/plates/library/eq/rope.mjs');
  });
  it('inputsFor failure path: an import the key adds is picked up (closure, not a hand list)', () => {
    const closure = P.importClosure(['tools/plates/library/hands/hand-ez.mjs']);
    expect([...closure].sort()).toEqual(['tools/plates/library/hands/hand-ez.mjs', 'tools/plates/library/hands/radial-rules.mjs']);
  });
});
