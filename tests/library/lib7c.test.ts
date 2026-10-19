// LIB-7c (hands/DESIGN.md §10; lib-7c-card.md): the LB1 hand pairs, keys `bar` and `v-handle`. 7c-A1 modules, keys and
// counts; 7c-A2 handles = the plate composers; 7c-A3 claims (LIB-7's checker copied word for word, proven equal, plus
// LIB-7c's own rules); 7c-A4 drawing rules and close-up QA (LIB-7's H2, H7 and ink rule, copies proven equal); 7c-A6 panels.
// Every rule has its mutation in the same describe. The pixel checks are the gate block "LIB-7c" (lib7c-gate.mjs).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let P: any, C: any, Z: any, page: any, gen: any, hand: any, layers: any, PN: any, hp: any, RR: any, common: any;
const CLAIMS = JSON.parse(readFileSync('tools/plates/library/hands/lib7c-claims.json', 'utf8'));
const CENSUS = JSON.parse(readFileSync('tools/plates/library/hands/census-scope.json', 'utf8'));
const CLAIMS_SHA = '6c4d2b5b7109bafdeaeb1cbbd6e908f5ae3e547b69148d4a37c7a0fef1a86530';

beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/hands/checks.mjs'));
  Z = await import(/* @vite-ignore */ url('tools/plates/library/hands/zoom.mjs'));
  page = await import(/* @vite-ignore */ url('tools/plates/library/hands/page.mjs'));
  PN = await import(/* @vite-ignore */ url('tools/plates/library/hands/panel.mjs'));
  RR = await import(/* @vite-ignore */ url('tools/plates/library/hands/radial-rules.mjs'));
  gen = await import(/* @vite-ignore */ url('tools/plates/gen/hands.mjs'));
  hp = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
  hand = await import(/* @vite-ignore */ url('tools/plates/layers/engine/hand.mjs'));
  layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
  common = await import(/* @vite-ignore */ url('tools/plates/library/render/closeup/common.mjs'));
});

// D-LIB7c-KEYS: the six ids and the key each is ruled to. GAPPED: the ids D-LIB7c-SHIP moved to GAPS (none so far).
const RULED: Record<string, string> = {
  chin_up: 'bar-hang-under', hanging_knee_raise: 'bar-hang-over', assisted_pull_up: 'bar-hang-over',
  inverted_row: 'bar-row-over', underhand_lat_pulldown: 'bar-pulldown-under', close_grip_pulldown: 'v-handle-pull-neutral-overhead',
};
const SIX = Object.keys(RULED).sort();
const GAPPED: string[] = [];
const lib7c = (mods: any[]) => mods.filter((m: any) => m.OWNER === 'LIB-7c');
const drawnOf = (mods: any[]) => lib7c(mods).flatMap((m: any) => Object.keys(m.IDS ?? {}));
const gapsOf = (mods: any[]) => lib7c(mods).flatMap((m: any) => Object.keys(m.GAPS ?? {}));
const lib7cDrawn = () => drawnOf(P.MODULES);
const clone = () => P.MODULES.map((m: any) => ({ ...m, HANDLE: structuredClone(m.HANDLE), VARIANTS: structuredClone(m.VARIANTS ?? {}), IDS: structuredClone(m.IDS ?? {}), GAPS: { ...(m.GAPS ?? {}) } }));
const withMods = (f: (mods: any[]) => void) => { const mods = clone(); f(mods); return mods; };
const key = (mods: any[], k: string) => mods.find((m: any) => m.KEY === k);
const card = (id: string) => `cards/${id}.json`;
// the ruled drawing of each of the six, so a gapped id's claims stay checked (as hand-pairs.test.ts's PARKED push ids)
const REDRAW: Record<string, [string, any]> = {
  chin_up: ['bar', { variant: 'hang', orientation: 'under', faults: ['curled'], claims: [`${card('chin_up')}#grip.type`] }],
  hanging_knee_raise: ['bar', { variant: 'hang', orientation: 'over', faults: ['curled'], claims: [`${card('hanging_knee_raise')}#grip.type`, `${card('hanging_knee_raise')}#c2`] }],
  assisted_pull_up: ['bar', { variant: 'hang', orientation: 'over', faults: ['curled'], claims: [`${card('assisted_pull_up')}#grip.type`, `${card('assisted_pull_up')}#c1`] }],
  inverted_row: ['bar', { variant: 'row', orientation: 'over', faults: ['curled'], claims: [`${card('inverted_row')}#grip.type`, `${card('inverted_row')}#c2`] }],
  underhand_lat_pulldown: ['bar', { variant: 'pulldown', orientation: 'under', faults: ['curled'], claims: [`${card('underhand_lat_pulldown')}#grip.type`, `${card('underhand_lat_pulldown')}#c1`] }],
  close_grip_pulldown: ['v-handle', { variant: 'pull', orientation: 'neutral-overhead', faults: ['curled'], claims: [`${card('close_grip_pulldown')}#grip.type`, `${card('close_grip_pulldown')}#c1`] }],
};
const redraw = (mods: any[]) => { for (const id of gapsOf(mods)) { const [k, cfg] = REDRAW[id]!, m = key(mods, k); delete m.GAPS[id]; m.IDS[id] = structuredClone(cfg); } return mods; };

/** 7c-A1: modules, variants and the six ids, exact. */
function scopeProblems(mods: any[]) {
  const bad: string[] = [], mine = lib7c(mods), drawn = drawnOf(mods), gaps = gapsOf(mods);
  const sw = (items: any[], n: number, what: string) => { try { C.sweep(items, n, what); } catch (e: any) { bad.push(e.message); } };
  sw(mine, 2, 'LIB-7c modules');
  if (mine.map((m: any) => m.KEY).join() !== 'bar,v-handle') bad.push(`modules ${mine.map((m: any) => m.KEY)}`);
  sw(mine.flatMap((m: any) => Object.keys(m.VARIANTS).map(v => `${m.KEY}/${v}`)), 4, 'LIB-7c variants');
  if ([...drawn, ...gaps].sort().join() !== SIX.join()) bad.push(`drawn + gaps ${[...drawn, ...gaps].sort()} are not the six`);
  for (const id of drawn) if (gaps.includes(id)) bad.push(`${id} drawn and a gap`);
  for (const m of mine) for (const [id, cfg] of Object.entries<any>(m.IDS ?? {})) {
    const a = m.VARIANTS[cfg.variant]?.archetype, want = CENSUS.archetype[`lib_${id}`];
    if (a !== want) bad.push(`${id}: archetype ${a}, census ${want}`);
  }
  return bad;
}
/** 7c-A1: each drawn id on its ruled key, and words files for exactly the drawn keys. */
function keyProblems(mods: any[], wordFiles: string[]) {
  const bad: string[] = [], K = P.keyIndexOf(P.indexOf(mods)), D = new Set<string>();
  for (const id of drawnOf(mods)) { const k = K.keyOf.get(id); D.add(k); if (k !== RULED[id]) bad.push(`${id}: key ${k}, ruled ${RULED[id]}`); }
  const files = wordFiles.filter(f => /^(bar|v-handle)-.*\.json$/.test(f)).map(f => f.slice(0, -5)).sort();
  if (files.join() !== [...D].sort().join()) bad.push(`words files ${files} are not the drawn keys ${[...D].sort()}`);
  return bad;
}
const WORD_FILES = () => readdirSync('tools/plates/library/hands/words');
const LINE69 = (src: string, d: number) => src.split('\n')[68]!.includes(`C.sweep(P.keysOf(), ${8 + d}, 'pair keys')`);

describe('LIB-7c 7c-A1: modules and keys (D-LIB7c-KEYS, D-LIB7FIX-KEY)', () => {
  it('2 modules, 4 variants, drawn ids + gap ids = the six, disjoint; archetypes = census; gaps as ruled', () => {
    expect(scopeProblems(P.MODULES)).toEqual([]);
    expect(gapsOf(P.MODULES).sort()).toEqual(GAPPED);
    expect(C.sweep(lib7cDrawn(), 6 - GAPPED.length, 'LIB-7c drawn ids')).toHaveLength(6 - GAPPED.length);
  });
  it('each drawn id on its ruled key; one words file per drawn key; HAND_OF_ID maps exactly the drawn ids', () => {
    expect(keyProblems(P.MODULES, WORD_FILES())).toEqual([]);
    const mapped = Object.keys(P.HAND_OF_ID).map(l => l.slice(4)).filter(id => SIX.includes(id)).sort();
    expect(mapped).toEqual([...lib7cDrawn()].sort());
    for (const id of lib7cDrawn()) expect(P.HAND_OF_ID[`lib_${id}`]).toBe(RULED[id]);
  });
  it('lib7-fix.test.ts:69 is the exact sweep 8 + |D|', () => {
    const D = new Set(lib7cDrawn().map(id => RULED[id])).size;
    expect(LINE69(readFileSync('tests/library/lib7-fix.test.ts', 'utf8'), D)).toBe(true);
  });
  it('gap ids keep their claims checked: the re-draw fixture draws the ruled six', () => {
    const gapped = withMods(m => { const b = key(m, 'bar'); b.GAPS.chin_up = 'planted'; delete b.IDS.chin_up; });
    expect(drawnOf(redraw(gapped)).sort()).toEqual(SIX);
    expect(claimProblems(redraw(clone()), CLAIMS.claims)).toEqual([]);
    expect(lib7cRuleProblems(redraw(gapped), CLAIMS.claims)).toEqual([]);
  });
  it('mutations: a seventh id, one of the six in neither IDS nor GAPS, different faults on one key, a wrong archetype, a gapped key\'s words file, :69 at 8', () => {
    expect(scopeProblems(withMods(m => { key(m, 'bar').IDS.zz_seventh = structuredClone(key(m, 'bar').IDS.inverted_row); })).join('\n')).toMatch(/are not the six/);
    expect(scopeProblems(withMods(m => { delete key(m, 'bar').IDS.inverted_row; })).join('\n')).toMatch(/are not the six/);
    expect(() => P.keyIndexOf(P.indexOf(withMods(m => { key(m, 'bar').IDS.assisted_pull_up.faults = []; }))))
      .toThrow(/key bar-hang-over: hanging_knee_raise has faults \[curled\], assisted_pull_up has \[\]/);
    expect(scopeProblems(withMods(m => { key(m, 'bar').VARIANTS.hang.archetype = 'pull'; })).join('\n')).toMatch(/hanging_knee_raise: archetype pull, census hang/);
    const gapped = withMods(m => { const b = key(m, 'bar'); b.GAPS.chin_up = 'planted'; delete b.IDS.chin_up; });
    expect(keyProblems(gapped, WORD_FILES()).join('\n')).toMatch(/words files .* are not the drawn keys/);
    const src = readFileSync('tests/library/lib7-fix.test.ts', 'utf8').split('\n');
    src[68] = src[68]!.replace(/C\.sweep\(P\.keysOf\(\), \d+,/, 'C.sweep(P.keysOf(), 8,');
    expect(LINE69(src.join('\n'), new Set(lib7cDrawn().map(id => RULED[id])).size)).toBe(false);
  });
});

/** 7c-A2: each variant's handle, read from the plate composers' source (golden-B engine/equipment.mjs). */
function handleProblems(mods: any[]) {
  const eq = readFileSync('tools/plates/layers/engine/equipment.mjs', 'utf8'), bad: string[] = [];
  const mm = (re: RegExp) => { const m = eq.match(re); if (!m) throw new Error(`no ${re}`); return Math.round(+m[1]! * 1000); };
  const pullup = mm(/export function pullupBar\(\{[^}]*\bd = ([\d.]+)/), lat = mm(/export function latBar\(\{[^}]*\bd = ([\d.]+)/);
  // the vHandle grip: bar(A, B, t) with t a half-thickness (geom.mjs:56), so the grip is 2t across
  const vh = 2 * mm(/'eq-solid', bar\(\[g\[0\], g\[1\] - 0\.06 \* m\], \[g\[0\], g\[1\] \+ 0\.06 \* m\], ([\d.]+) \* m/);
  if (!/half-thickness t/.test(readFileSync('tools/plates/layers/engine/geom.mjs', 'utf8'))) bad.push('geom.mjs bar(): t is no longer a half-thickness');
  if (vh !== hand.HANDLES['v-handle'].d) bad.push(`vHandle grip ${vh} mm, HANDLES['v-handle'] ${hand.HANDLES['v-handle'].d}`);
  const want: Record<string, number> = { 'bar/hang': pullup, 'bar/row': pullup, 'bar/pulldown': lat, 'v-handle/pull': vh };
  for (const m of lib7c(mods)) for (const [v, V] of Object.entries<any>(m.VARIANTS)) {
    const d = V.handle?.diameterMm;
    if (d !== want[`${m.KEY}/${v}`]) bad.push(`${m.KEY}/${v}: ${d} mm, the plate draws ${want[`${m.KEY}/${v}`]} mm`);
  }
  return bad;
}

describe('LIB-7c 7c-A2: handles match the plates (D-LIB7c-HANDLE)', () => {
  it('hang and row 32 mm (pullupBar d), pulldown 28 mm (latBar d), v-handle 30 mm (2 x 0.015 = HANDLES[\'v-handle\'])', () => {
    expect(handleProblems(P.MODULES)).toEqual([]);
    expect(lib7c(P.MODULES).flatMap((m: any) => Object.values<any>(m.VARIANTS).map(V => V.handle.diameterMm))).toEqual([32, 32, 28, 30]);
  });
  it('G5: the explicit handle in both halves of every page', () => {
    for (const id of lib7cDrawn()) {
      const { spec, pages } = C.renderedPages(id);
      for (const p of pages) for (const r of ['right', 'wrong']) expect([id, r, p.report[r].handle, p.report[r].handleDiameterMm]).toEqual([id, r, spec.handle.profile, spec.handle.diameterMm]);
    }
  });
  it('mutations: hang at 28 mm, pulldown at 32 mm, v-handle at 32 mm', () => {
    expect(handleProblems(withMods(m => { key(m, 'bar').VARIANTS.hang.handle.diameterMm = 28; })).join('\n')).toMatch(/bar\/hang: 28 mm, the plate draws 32 mm/);
    expect(handleProblems(withMods(m => { key(m, 'bar').VARIANTS.pulldown.handle.diameterMm = 32; })).join('\n')).toMatch(/bar\/pulldown: 32 mm, the plate draws 28 mm/);
    expect(handleProblems(withMods(m => { key(m, 'v-handle').VARIANTS.pull.handle.diameterMm = 32; })).join('\n')).toMatch(/v-handle\/pull: 32 mm, the plate draws 30 mm/);
  });
});

// ---- 7c-A3: LIB-7's checker, hand-pairs.test.ts:300-331, word for word with one substitution (proven below) ----
// phrases a grip-orientation claim must hold (DESIGN §4 G8)
const PHRASES: Record<string, RegExp> = {
  under: /underhand|palms up|palms-up|palms-forward|palms forward|supinated/i,
  over: /overhand|palms down|palms toward the feet/i,
  neutral: /neutral|palms facing the body|palms facing each other/i,
  angled: /angled section|semi-supinated|half-way between palms up and palms in/i,
};
// a grip claim that names the EZ bar's angled section must be drawn as 'angled', never as plain underhand (D-LIB7-15)
const ANGLED = /angled section|semi-supinated/i;
// what a claim cited for each element must talk about (a wrong claim number reads as the wrong fact)
const FACT: Record<string, RegExp> = { knob: /clubbed end|knob/i, thumb: /thumb/i, wrist: /wrist/i, fault: /wrist|flex|bend|bent/i };
function claimProblems(mods: any[], claims: Record<string, string>) {
  const bad: string[] = [];
  const check = (ref: string, fact: RegExp | null, at: string) => {
    if (ref.startsWith('ga:')) { if (!P.CONVENTIONS[ref]) bad.push(`${at}: unknown convention ${ref}`); return; }
    if (!(ref in claims)) { bad.push(`${at}: ${ref} unresolved`); return; }
    if (fact && !fact.test(claims[ref]!)) bad.push(`${at}: ${ref} does not state ${fact}`);
  };
  for (const m of mods.filter((x: any) => x.OWNER === 'LIB-7c')) {
    for (const [v, V] of Object.entries<any>(m.VARIANTS ?? {})) {
      for (const [el, refs] of Object.entries<any>(V.claims)) for (const r of refs) check(r, FACT[el] ?? null, `${m.KEY}/${v}.${el}`);
      for (const [k, F] of Object.entries<any>(V.faults)) { if (!F.claims.length) bad.push(`${m.KEY}/${v}.${k}: no claim`); for (const r of F.claims) check(r, FACT.fault!, `${m.KEY}/${v}.${k}`); }
    }
    for (const [id, c] of Object.entries<any>(m.IDS ?? {})) {
      if (c.orientation === 'unstated') { for (const r of c.claims) check(r, null, id); continue; }
      if (!c.claims.length) bad.push(`${id}: no orientation claim`);
      for (const r of c.claims) check(r, PHRASES[c.orientation]!, `${id} (${c.orientation})`);
      if (c.orientation !== 'angled' && c.claims.some((r: string) => ANGLED.test(claims[r] ?? ''))) bad.push(`${id}: its claims name the angled EZ grip, drawn ${c.orientation}`);
    }
  }
  return bad;
}
// ---- end of the copy ----
// D-LIB7c-CAMERA: the checker reads `neutral-overhead` as the `neutral` phrase list
const AS_PHRASE: Record<string, string> = { 'neutral-overhead': 'neutral' };
const forChecker = (mods: any[]) => mods.map((m: any) => ({ ...m, IDS: Object.fromEntries(Object.entries<any>(m.IDS ?? {}).map(([id, c]) => [id, { ...c, orientation: AS_PHRASE[c.orientation] ?? c.orientation }])) }));
const CONTACT_OF: Record<string, string> = { hang: 'ga:hang-base', pull: 'ga:pull-base' };

/** LIB-7c's added rules (D-LIB7c-ORIENT, -CONTACT, -FAULT, -CAMERA): (i) first orientation phrase of #grip.type, (ii) per-id
 *  coverage of every element, (iii) the archetype's convention, (iv) every ga: ref declared, (v) `neutral` only level. */
function lib7cRuleProblems(mods: any[], claims: Record<string, string>) {
  const bad: string[] = [], conv = P.declarationsOf(mods).CONVENTIONS;
  for (const m of lib7c(mods)) {
    for (const [id, c] of Object.entries<any>(m.IDS ?? {})) {
      const gt = `${card(id)}#grip.type`, drawn = AS_PHRASE[c.orientation] ?? c.orientation;
      if (!c.claims.includes(gt)) { bad.push(`${id}: does not cite ${gt}`); continue; }
      const text = claims[gt] ?? '', at: [string, number][] = [];
      for (const [o, re] of Object.entries(PHRASES)) { const i = text.search(re); if (i >= 0) at.push([o, i]); }
      { const i = text.search(ANGLED); if (i >= 0) at.push(['angled', i]); }
      const first = Math.min(...at.map(a => a[1])), win = [...new Set(at.filter(a => a[1] === first).map(a => a[0]))];
      if (win.length !== 1) bad.push(`${id}: ${win.length ? `first orientation phrase is a tie (${win})` : 'no orientation phrase'} in #grip.type`);
      else if (win[0] !== drawn) bad.push(`${id}: first orientation phrase is ${win[0]}, drawn ${c.orientation}`);
      if (c.orientation === 'neutral' && m.VARIANTS[c.variant].right.forearm !== 90) bad.push(`${id}: neutral with forearm ${m.VARIANTS[c.variant].right.forearm}, not level`);
    }
    for (const [v, V] of Object.entries<any>(m.VARIANTS)) {
      const ids = Object.entries<any>(m.IDS ?? {}).filter(([, c]) => c.variant === v).map(([id]) => id);
      const els: [string, string[]][] = [['thumb', V.claims.thumb ?? []], ['wrist', V.claims.wrist ?? []], ...Object.entries<any>(V.faults).map(([k, F]): [string, string[]] => [k, F.claims])];
      for (const [el, refs] of els) for (const id of ids) if (!refs.some(r => r.startsWith(`${card(id)}#`))) bad.push(`${m.KEY}/${v}.${el}: no ref from ${id}'s card`);
      if ((V.claims.contact ?? []).join() !== CONTACT_OF[V.archetype]) bad.push(`${m.KEY}/${v}: contact ${V.claims.contact}, the ${V.archetype} convention is ${CONTACT_OF[V.archetype]}`);
      const refs = [...Object.values<any>(V.claims).flat(), ...Object.values<any>(V.faults).flatMap((F: any) => F.claims)];
      for (const r of refs) if (r.startsWith('ga:') && !(r in conv)) bad.push(`${m.KEY}/${v}: ${r} is not declared`);
    }
  }
  return bad;
}
// the text of `from` up to the end of the first function after it that closes with `  return bad;\n}`
const block = (src: string, from: string) => { const a = src.indexOf(from), b = src.indexOf('\n  return bad;\n}\n', a); if (a < 0 || b < 0) throw new Error(`no block ${from}`); return src.slice(a, b + 16); };

describe('LIB-7c 7c-A3: claims (D-LIB7c-ORIENT, -CONTACT, -FAULT)', () => {
  it('lib7c-claims.json is research 9eaa2480, pinned, and every LIB-7c ref resolves in it', () => {
    expect(CLAIMS.research).toBe('9eaa2480');
    expect(createHash('sha256').update(JSON.stringify(CLAIMS)).digest('hex')).toBe(CLAIMS_SHA);
    for (const r of Object.keys(CLAIMS.claims)) expect(CLAIMS.files).toHaveProperty(r.split('#')[0]!);
    expect(Object.keys(CLAIMS.files).sort()).toEqual(SIX.map(card));
  });
  it('the checker is hand-pairs.test.ts:300-331 word for word, with the one substitution', () => {
    const lib7 = block(readFileSync('tests/library/hand-pairs.test.ts', 'utf8'), '// phrases a grip-orientation claim must hold');
    const mine = block(readFileSync('tests/library/lib7c.test.ts', 'utf8'), '// phrases a grip-orientation claim must hold');
    expect(lib7.split("x.OWNER === 'LIB-7'")).toHaveLength(2);
    expect(mine).toBe(lib7.replace("x.OWNER === 'LIB-7'", "x.OWNER === 'LIB-7c'"));
  });
  it('LIB-7\'s checker and LIB-7c\'s rules pass on every LIB-7c module', () => {
    expect(claimProblems(forChecker(P.MODULES), CLAIMS.claims)).toEqual([]);
    expect(lib7cRuleProblems(P.MODULES, CLAIMS.claims)).toEqual([]);
  });
  it('mutations: the copy changed, chin_up#c1 as orientation, inverted_row under, hang contact ga:pull-base, #c14 dropped, a claim text changed', () => {
    const lib7 = block(readFileSync('tests/library/hand-pairs.test.ts', 'utf8'), '// phrases a grip-orientation claim must hold');
    const mine = block(readFileSync('tests/library/lib7c.test.ts', 'utf8'), '// phrases a grip-orientation claim must hold');
    expect(mine.replace('const ANGLED = /angled section|semi-supinated/i;', 'const ANGLED = /angled section/i;')).not.toBe(lib7.replace("x.OWNER === 'LIB-7'", "x.OWNER === 'LIB-7c'"));
    const c1 = withMods(m => { key(m, 'bar').IDS.chin_up.claims = [`${card('chin_up')}#c1`]; });
    expect(claimProblems(forChecker(c1), CLAIMS.claims).join('\n')).toMatch(/chin_up \(under\): cards\/chin_up.json#c1 does not state/);
    expect(lib7cRuleProblems(c1, CLAIMS.claims).join('\n')).toMatch(/chin_up: does not cite cards\/chin_up.json#grip.type/);
    const under = withMods(m => { key(m, 'bar').IDS.inverted_row.orientation = 'under'; });
    expect(lib7cRuleProblems(under, CLAIMS.claims).join('\n')).toMatch(/inverted_row: first orientation phrase is over, drawn under/);
    const contact = withMods(m => { key(m, 'bar').VARIANTS.hang.claims.contact = ['ga:pull-base']; });
    expect(lib7cRuleProblems(contact, CLAIMS.claims).join('\n')).toMatch(/bar\/hang: contact ga:pull-base, the hang convention is ga:hang-base/);
    const c14 = withMods(m => { const F = key(m, 'bar').VARIANTS.hang.faults.curled; F.claims = F.claims.filter((r: string) => r !== `${card('assisted_pull_up')}#c14`); });
    expect(lib7cRuleProblems(c14, CLAIMS.claims).join('\n')).toMatch(/bar\/hang.curled: no ref from assisted_pull_up's card/);
    const text = structuredClone(CLAIMS); text.claims[`${card('chin_up')}#c1`] = text.claims[`${card('chin_up')}#c1`].replace('A', 'a');
    expect(createHash('sha256').update(JSON.stringify(text)).digest('hex')).not.toBe(CLAIMS_SHA);
    const tie = { ...CLAIMS.claims, [`${card('chin_up')}#grip.type`]: 'Neutral.' };
    expect(lib7cRuleProblems(P.MODULES, tie).join('\n')).toMatch(/chin_up: first orientation phrase is neutral, drawn under/);
    const none = { ...CLAIMS.claims, [`${card('chin_up')}#grip.type`]: 'Full closed grip.' };
    expect(lib7cRuleProblems(P.MODULES, none).join('\n')).toMatch(/chin_up: no orientation phrase in #grip.type/);
    const undeclared = withMods(m => { key(m, 'bar').VARIANTS.row.claims.contact = ['ga:zz-undeclared']; });
    expect(lib7cRuleProblems(undeclared, CLAIMS.claims).join('\n')).toMatch(/bar\/row: ga:zz-undeclared is not declared/);
  });
});

// ---- 7c-A4: LIB-7's close-up QA, hand-pairs.test.ts:455-474 word for word (proven below) ----
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
// ---- end of the copy ----
function approvedSvgs(): string[] {
  const html = readFileSync('tests/howto/golden/howto-layers.html');
  expect(layers.sha256(html)).toBe(layers.PAGE_SHA256);
  const out = [...html.toString('utf8').matchAll(/<svg class="hand-svg"[\s\S]*?<\/svg>/g)].map(m => m[0]);
  expect(out).toHaveLength(18);
  return out;
}
// hand-pairs.test.ts:205-206 (the different-palm ink rule's ink), word for word
  const handInk = (id: string, fault: string) => { const uid = `hp-${id.replace(/_/g, '-')}-${fault}`;
    return [...P.renderPair(id, { fault }).svg.matchAll(new RegExp(`<path id="${uid}-[rw]-[a-z0-9-]+" d="([^"]+)"`, 'g'))].map(q => q[1]).join('|'); };
/** hand-pairs.test.ts:222-231's rule over the given ids: two ids of one variant with different palm directions never
 *  draw the same hand. ink: the hand ink of (id, fault). */
function inkProblems(ids: string[], ink: (id: string, f: string) => string) {
  const bad: string[] = [];
  for (const a of ids) for (const b of ids) {
    const A = P.pairSpec(a), B = P.pairSpec(b);
    if (a >= b || A.pair !== B.pair || !!A.right.mirror === !!B.right.mirror) continue;
    for (const w of A.wrong) if (B.wrong.some((x: any) => x.key === w.key) && ink(a, w.key) === ink(b, w.key)) bad.push(`${a} = ${b} (${w.key})`);
  }
  return bad;
}
/** D-LIB7c-CAMERA, measured (report.measured): at forearm 180 the Right handle centre lies on one side of the wrist for
 *  every id of one palm direction (mirrored: under), and on the other side for the rest. */
function palmProblems(rows: { id: string; mirror: boolean; m: any }[]) {
  const bad: string[] = [], side = (r: any) => Math.sign(r.m.handle[0] - r.m.wrist[0]);
  for (const mirror of [true, false]) {
    const s = new Set(rows.filter(r => r.mirror === mirror).map(side));
    if (s.size > 1 || s.has(0)) bad.push(`${mirror ? 'under' : 'over'}: Right handle not on one side of the wrist`);
  }
  const u = rows.find(r => r.mirror), o = rows.find(r => !r.mirror);
  if (u && o && side(u) === side(o)) bad.push('under and over draw the handle on the same side of the wrist');
  return bad;
}
const palmRows = (ids: string[], measuredOf = (id: string) => P.renderPair(id).report.measured.right) => ids.map(id => ({ id, mirror: !!P.pairSpec(id).right.mirror, m: measuredOf(id) }));
/** The hang (D-LIB7c-HANDLE, -FAULT): golden B hanging_leg_raise's Right (exercises/hanging_leg_raise.howto.mjs:92-93),
 *  no force line, head or tick, the contact dot kept; the Wrong is the Right with the wrist alone at -30. */
function hangProblems(spec: any, svg: string) {
  const bad: string[] = [], src = readFileSync('tools/plates/layers/exercises/hanging_leg_raise.howto.mjs', 'utf8').match(/const RIGHT_POSE = \{[^\n]*\n[^\n]*/)![0];
  const num = (re: RegExp) => +src.match(re)![1]!, str = (re: RegExp) => src.match(re)![1];
  const R = spec.right, want = { forearm: num(/forearm: ([\d.]+)/), ext: num(/ext: ([\d.-]+)/), contactAt: num(/contactAt: ([\d.]+)/), curl: num(/curl: ([\d.]+)/),
    thumb: str(/thumb: '(\w+)'/), squeeze: str(/squeeze: '(\w+)'/), load: str(/load: \{ kind: '(\w+)'/) };
  const got = { forearm: R.forearm, ext: R.wrist.ext, contactAt: R.contactAt, curl: R.fingers.curl, thumb: R.thumb, squeeze: R.squeeze, load: R.load.kind };
  if (JSON.stringify(got) !== JSON.stringify(want)) bad.push(`${spec.id}: hang Right ${JSON.stringify(got)}, golden B ${JSON.stringify(want)}`);
  for (const F of spec.wrong) {
    const W = structuredClone(common.mergePose(R, F.pose));
    if (W.wrist.ext !== -30) bad.push(`${spec.id}/${F.key}: wrist ${W.wrist.ext}, not -30`);
    W.wrist.ext = R.wrist.ext;
    if (JSON.stringify(W) !== JSON.stringify(R)) bad.push(`${spec.id}/${F.key}: the Wrong differs from the Right beyond the wrist`);
  }
  for (const c of ['h-load', 'h-load-head', 'h-tick']) if (svg.includes(`class="${c}`)) bad.push(`${spec.id}: ${c} drawn on a hang`);
  if (!svg.includes('class="h-contact"')) bad.push(`${spec.id}: no contact dot`);
  return bad;
}
const ariaOf = (svg: string) => svg.match(/aria-label="([^"]*)"/)?.[1] ?? '';

describe('LIB-7c 7c-A4: drawing rules and close-up QA (D-LIB7c-FAULT, -CAMERA, -HANDLE)', () => {
  let gold: ReturnType<typeof vocab>;
  beforeAll(() => { gold = vocab(approvedSvgs()); });
  it('G1-G9 pass for every drawn id (checks.mjs unedited)', () => {
    for (const id of C.sweep(lib7cDrawn(), 6 - GAPPED.length, 'LIB-7c drawn ids')) expect([id, C.pairProblems(id)]).toEqual([id, []]);
  });
  it('the hang: golden B\'s Right, no force line, contact dot kept; the Wrong at the wrist alone', () => {
    for (const id of lib7cDrawn().filter(id => P.pairSpec(id).variant === 'hang')) {
      const s = P.pairSpec(id);
      for (const w of s.wrong) expect(hangProblems(s, P.renderPair(id, { fault: w.key }).svg)).toEqual([]);
      expect(s.wrong.map((w: any) => w.pose)).toEqual([{ wrist: { ext: -30 } }]);
      expect([s.rightNote, s.wrong[0].label, s.extras.stripLoadLine]).toEqual(['Base of fingers', 'Wrist curled', true]);
    }
  });
  it('row, pulldown and v-handle pull are LIB-7\'s pullVariant unchanged', () => {
    for (const [k, v] of [['bar', 'row'], ['bar', 'pulldown'], ['v-handle', 'pull']]) {
      const V = key(P.MODULES, k!).VARIANTS[v!];
      expect(V).toEqual(RR.pullVariant({ thumbClaims: V.claims.thumb, wristClaims: V.claims.wrist, curledClaims: V.faults.curled.claims, handle: V.handle }));
    }
  });
  it('overhead palm, measured: under on one side of the wrist, over on the other, no facing row; the V-handle from the thumb side', () => {
    expect(palmProblems(palmRows(lib7cDrawn()))).toEqual([]);
    for (const id of lib7cDrawn()) expect(P.renderPair(id).svg).not.toMatch(/>YOU<|>MACHINE<|>FACE</);
    expect(key(P.MODULES, 'v-handle').CAMERA_TEXT['neutral-overhead']).toBe(P.THUMB_SIDE);
    expect(P.CAMERA_TEXT['neutral-overhead']).toBe(P.THUMB_SIDE);
    if (lib7cDrawn().includes('close_grip_pulldown')) expect(ariaOf(P.renderPair('close_grip_pulldown').svg).startsWith('Seen from the thumb side')).toBe(true);
  });
  it('H2: markup within golden B\'s vocabulary, no colour literal, ids unique and uid-prefixed', () => {
    let n = 0;
    for (const id of lib7cDrawn()) for (const w of P.pairSpec(id).wrong) {
      const uid = `q-${n++}`, { svg } = P.renderPair(id, { fault: w.key, uid });
      expect([id, w.key, markupProblems(svg, uid, gold)]).toEqual([id, w.key, []]);
    }
    expect(n).toBe(6 - GAPPED.length);
  });
  it('H7: two builds byte-identical; each zoom within the largest golden-B hand ceiling; a fresh import draws every page the same', async () => {
    const cap = gen.handCeiling('pull-up');
    for (const id of lib7cDrawn()) {
      const z = Z.pairZoom(id, page.zoomTextsOf(id));
      const html = P.pairSpec(id).wrong.map((w: any) => z.handZoom(w.key)).join('');
      expect(P.pairSpec(id).wrong.map((w: any) => z.handZoom(w.key)).join('') === html).toBe(true);
      expect([id, html.length <= cap.raw, gzipSync(html).length <= cap.gz]).toEqual([id, true, true]);
    }
    const fresh = await import(/* @vite-ignore */ `${url('tools/plates/library/hands/pairs.mjs')}?lib7c=${Date.now()}`);
    expect(fresh.renderPair).not.toBe(P.renderPair);
    for (const id of lib7cDrawn()) for (const w of P.pairSpec(id).wrong) expect([id, fresh.renderPair(id, { fault: w.key }).svg === P.renderPair(id, { fault: w.key }).svg]).toEqual([id, true]);
  }, 60_000);
  it('ink: two drawn LIB-7c ids of one variant with different palm directions never draw the same hand', () => {
    expect(inkProblems(lib7cDrawn(), handInk)).toEqual([]);
  });
  it('the QA copies are hand-pairs.test.ts\'s word for word (vocabulary, markup, ink)', () => {
    const lib7 = readFileSync('tests/library/hand-pairs.test.ts', 'utf8'), mine = readFileSync('tests/library/lib7c.test.ts', 'utf8');
    const qa = (s: string) => s.slice(s.indexOf('const COLOUR = '), s.indexOf('\n  return bad;\n}\n', s.indexOf('function markupProblems')) + 16);
    expect(qa(mine)).toBe(qa(lib7));
    const ink = (s: string) => s.slice(s.indexOf('  const handInk = '), s.indexOf("join('|'); };", s.indexOf('  const handInk = ')) + 13);
    expect(ink(mine)).toBe(ink(lib7));
    const rule = "if (a >= b || A.pair !== B.pair || !!A.right.mirror === !!B.right.mirror) continue;";
    expect([lib7.includes(rule), mine.includes(rule)]).toEqual([true, true]);
  });
  it('mutations: the slip pose, chin_up against bar-hang-over\'s pages, a force line on a hang, the V-handle at neutral, H2\'s failures, bar-hang-under with bar-hang-over\'s ink', () => {
    const slip = P.indexOf(withMods(m => { key(m, 'bar').VARIANTS.hang.faults.curled.pose = { wrist: { ext: -30, dev: 0 }, contactAt: 1.4, fingers: { curl: 1, open: 0.4 } }; }));
    const ss = P.pairSpec('chin_up', slip);
    expect(hangProblems(ss, P.renderPair('chin_up', { index: slip }).svg).join('\n')).toMatch(/chin_up\/curled: the Wrong differs from the Right beyond the wrist/);
    const over = P.renderPair('hanging_knee_raise').report.measured.right;
    expect(palmProblems(palmRows(lib7cDrawn(), id => id === 'chin_up' ? over : P.renderPair(id).report.measured.right)).join('\n')).toMatch(/under: Right handle not on one side of the wrist/);
    const line = P.indexOf(withMods(m => { delete key(m, 'bar').VARIANTS.hang.loadLine; }));
    expect(C.pairProblems('chin_up', line).join('\n')).toMatch(/G6 force line drawn/);
    expect(hangProblems(P.pairSpec('chin_up', line), P.renderPair('chin_up', { index: line }).svg).join('\n')).toMatch(/h-load drawn on a hang/);
    const neutral = withMods(m => { key(m, 'v-handle').IDS.close_grip_pulldown.orientation = 'neutral'; });
    expect(lib7cRuleProblems(neutral, CLAIMS.claims).join('\n')).toMatch(/close_grip_pulldown: neutral with forearm 180, not level/);
    expect(ariaOf(P.renderPair('close_grip_pulldown', { index: P.indexOf(neutral) }).svg).startsWith('Seen from the thumb side')).toBe(false);
    const { svg } = P.renderPair('chin_up', { uid: 'q' });
    expect(markupProblems(svg.replace('</svg>', '<ellipse class="h-new"/></svg>'), 'q', gold).join('\n')).toMatch(/element ellipse.*\n?.*class h-new/s);
    expect(markupProblems(svg.replace('class="h-eq"', 'fill="#123" class="h-eq"'), 'q', gold).join('\n')).toMatch(/colour literal #123/);
    const d = svg.match(/<path id="(q-[^"]+)" d="[^"]*"\/>/)!;
    expect(markupProblems(svg.replace('</defs>', `${d[0]}</defs>`), 'q', gold)).toContain('duplicate id');
    expect(markupProblems(svg.replace(`id="${d[1]}"`, 'id="x-1"'), 'q', gold).join('\n')).toMatch(/id x-1 not prefixed q/);
    const hkr = (f: string) => handInk('hanging_knee_raise', f);
    expect(inkProblems(lib7cDrawn(), (id, f) => id === 'chin_up' ? hkr(f) : handInk(id, f))).toEqual(['chin_up = hanging_knee_raise (curled)', 'assisted_pull_up = chin_up (curled)']);
  });
});

describe('LIB-7c 7c-A6: panels and words (D-LIB7FIX-WORDS, -BUDGET)', () => {
  const drawnKeys = () => [...new Set(lib7cDrawn().map(id => RULED[id]!))];
  it('each drawn key\'s panel is a hand zx panel, ids hp-<key>-, every word from its words file with a source, within handCeiling(\'pull-up\')', async () => {
    const cap = gen.handCeiling('pull-up');
    for (const k of C.sweep(drawnKeys(), new Set(Object.values(RULED)).size - new Set(GAPPED.map(id => RULED[id])).size, 'LIB-7c keys')) {
      const h = await P.pairPanel(k), W = PN.readWords(k).keys[k];
      expect(h.startsWith(`<div class="zx" id="hp-${k}-zoom-hand" data-zoom="hand" `)).toBe(true);
      const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!);
      expect([k, ids.filter(i => !i.startsWith(`hp-${k}-`)), new Set(ids).size === ids.length]).toEqual([k, [], true]);
      expect(W.heading.text).toBe('Hand: right and wrong');
      for (const s of ['right', 'wrong', 'pager']) expect([k, s, /D-LIB7c-/.test(W.faults.curled[s].source)]).toEqual([k, s, true]);
      expect([W.faults.curled.right.text, W.faults.curled.wrong.text, W.faults.curled.pager.text]).toEqual(['Base of fingers', 'Wrist curled', 'Wrist curled']);
      const t = hp.pairText(k, h);
      expect([k, Buffer.byteLength(t) <= cap.raw, gzipSync(t).length <= cap.gz]).toEqual([k, true, true]);
    }
  }, 60_000);
  it('mutations: an 11-word caption, a caption with no source, a key\'s words file missing', () => {
    const k = 'bar-row-over', pages = [{ fault: 'curled', svg: '' }];
    const long = structuredClone(PN.readWords(k)); long.keys[k].faults.curled.wrong.text = 'Wrist curled forward toward the forearm while you pull it in';
    expect(() => PN.panelHtml(k, pages, long)).toThrow(/curled.wrong has 11 words \(max 10\)/);
    const noSrc = structuredClone(PN.readWords(k)); noSrc.keys[k].faults.curled.right.source = '';
    expect(() => PN.panelHtml(k, pages, noSrc)).toThrow(/curled.right has no approved text and source/);
    expect(() => PN.readWords('bar-zz-missing')).toThrow(/hand panel bar-zz-missing: no words in .*words\/bar-zz-missing.json/);
  });
});

// 7c-A5 (D-CRITIC-CAL3; D-PILOTA-R5): the panel approved all six ids on 3bdd609 (#271 6264406128; lib4-cards §25,
// D-LIB7c-PANEL1). Pinned on that sha, never re-pinned: sha256 over every approved page (`id/fault\0svg\0`, as
// hand-pairs.test.ts:128-132) and over lib7c-sheet.mjs's normal and --critic bodies.
const APPROVED7C = ['chin_up', 'hanging_knee_raise', 'assisted_pull_up', 'inverted_row', 'underhand_lat_pulldown', 'close_grip_pulldown'];
const PAGES_SHA = '35723cffd9eb7518047c92239f4bda2e4a85d70dafdc77a1b337b4d4c03a364e';
const SHEET_SHA = '497f6fa8a0cc724960ac308be92577798aeb66fc5a408a0dd147d59b299cb507';
const CRITIC_SHA = '6bc7bfe6def174de3fd0a64e0691400da2f1b603218151c0f4aa8acdc7f91399';
const pagesSha = (index?: any) => {
  const h = createHash('sha256');
  for (const id of APPROVED7C) for (const w of P.pairSpec(id, index).wrong) h.update(`${id}/${w.key}\0${P.renderPair(id, { fault: w.key, index }).svg}\0`);
  return h.digest('hex');
};
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

describe('LIB-7c 7c-A5: approved pages and sheets pinned (D-CRITIC-CAL3, D-PILOTA-R5)', () => {
  let L: any;
  beforeAll(async () => { L = await import(/* @vite-ignore */ url('tools/plates/library/hands/lib7c-sheet.mjs')); });
  it('the six approved ids draw their approved pages byte for byte; the sheets are the approved ones', async () => {
    expect([...lib7cDrawn()].sort()).toEqual([...APPROVED7C].sort());
    expect(pagesSha()).toBe(PAGES_SHA);
    expect(sha256((await L.buildLib7cSheet()).body)).toBe(SHEET_SHA);
    expect(sha256((await L.buildLib7cSheet({ critic: true })).body)).toBe(CRITIC_SHA);
  }, 60_000);
  it('mutations: a pose value 1 degree off, a LIB-7c ref text changed in the sheet, an anchor that is a labelled reference', async () => {
    expect(pagesSha(P.indexOf(withMods(m => { key(m, 'bar').VARIANTS.hang.right.wrist.ext = 11; })))).not.toBe(PAGES_SHA);
    const ref = `${card('chin_up')}#c1`, keep = L.CLAIMS.claims[ref];
    try { L.CLAIMS.claims[ref] = keep.replace('ACE', 'ACE.'); expect(sha256((await L.buildLib7cSheet()).body)).not.toBe(SHEET_SHA); } finally { L.CLAIMS.claims[ref] = keep; }
    expect(sha256((await L.buildLib7cSheet()).body)).toBe(SHEET_SHA);
    await expect(L.buildLib7cSheet({ anchors: [['pull_up', 'p1'], ['leg_press', null]] })).rejects.toThrow(/anchor pull_up\/p1 is a labelled reference/);
    await expect(L.buildLib7cSheet({ anchors: [['seated_cable_row', null], ['leg_press', null]] })).rejects.toThrow(/anchor seated_cable_row is a labelled reference/);
    await expect(L.buildLib7cSheet({ anchors: [['lat_pulldown', 'p1'], ['leg_press', null]] })).rejects.toThrow(/anchor lat_pulldown\/p1 is a labelled reference/);
  }, 120_000);
});
