// HT-4 (HT4-A5, critic fix 2): golden B holds only golden-A plates. Design note on PR #107 explains the three
// proofs below and how the crop-key allowance was derived (empirically, from a real build, never assumed).
//
// 1. Source: each vendored `<slug>.howto.mjs` imports its plate from the golden-A source GOLDEN.json records, and
//    `plate` deep-equals that spec, with no callout override (lateral raise: byte-identical ref-src + same function
//    reference; no `exercises/dumbbell_lateral_raise.mjs` to import).
// 2. renderPlate capture: `engine/plate.mjs` is shimmed in a mirror (wraps `renderPlate`, records every call), then
//    `node artifact/build-page.mjs` runs for real. Every call's `opts` uses only {id, mistake, selected}. Grouped by
//    the call's own `spec.id` (stable - never overridden, confirmed by inspection) against golden-A: `tempo` and
//    `alt` are byte-identical on every call; `checks`/`callouts` are byte-identical or empty. Everything else is a
//    plate-engine drawing field (SPEC.md's schema, not GA's HowToContent), the sanctioned "crop window" allowance:
//    pose/camera framing (`poses`, `camera`, `seatDrop`, `datum`, `viewLabel`), what that framing repositions or
//    hides (`equipment`, `ghosts`, `startParts`, `marks`), the spec's own embedded mistake sub-pose, and pure labels
//    (`id`/`name`/`view`/`facing`). Never widened past this list to pass a real failure.
// 3. Fragment `===`: the built page's normalSvg/normalOverlay/mistakeSvg/mistakeOverlay/alt/mistakeAlt, sliced
//    straight from each card's `<figure class="plate">` blocks, sha256-match GOLDEN.json's golden-A fragments
//    exactly, for all 8 exercises. This is what ships, so it needs no tolerance at all.
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { GoldenFile, GoldenPlateEntry } from '../../src/howto/types';

const LAYERS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'tools', 'plates', 'layers');
const VENDOR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'tools', 'plates', 'vendor');
const GOLDEN_JSON = join(dirname(fileURLToPath(import.meta.url)), 'golden', 'GOLDEN.json');
const sha256 = (x: string | Buffer) => createHash('sha256').update(x).digest('hex');
const unesc = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const golden: GoldenFile = JSON.parse(readFileSync(GOLDEN_JSON, 'utf8'));
const plateEntries = golden.entries.filter((e): e is GoldenPlateEntry => e.kind === 'plate');

const tmps: string[] = [];
function makeMirror(): string {
  const tmp = mkdtempSync(join(tmpdir(), 'ht4-derivation-'));
  cpSync(LAYERS, tmp, { recursive: true });
  rmSync(join(tmp, 'MANIFEST.json'), { force: true });
  tmps.push(tmp);
  return tmp;
}

interface RpCall { opts: { id: string; mistake?: boolean; selected?: string }; spec: Record<string, unknown> }

/** Shims engine/plate.mjs in the mirror to record every renderPlate call, then runs the real page build. */
async function captureRenderPlateCalls(mirror: string): Promise<RpCall[]> {
  const real = join(mirror, 'engine', 'plate.real.mjs');
  renameSync(join(mirror, 'engine', 'plate.mjs'), real);
  const shim = `export * from './plate.real.mjs';
import { renderPlate as __real } from './plate.real.mjs';
import { writeFileSync } from 'node:fs';
globalThis.__RP_CALLS = [];
export function renderPlate(spec, opts) {
  globalThis.__RP_CALLS.push({ opts: opts ? { ...opts } : opts, spec: JSON.parse(JSON.stringify(spec, (k, v) => typeof v === 'function' ? undefined : v)) });
  return __real(spec, opts);
}
process.on('exit', () => writeFileSync(new URL('../rp-calls.json', import.meta.url), JSON.stringify(globalThis.__RP_CALLS)));
`;
  writeFileSync(join(mirror, 'engine', 'plate.mjs'), shim);
  await new Promise<void>((resolve, reject) => {
    const c = spawn(process.execPath, ['build-page.mjs'], { cwd: join(mirror, 'artifact'), stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    c.stderr.on('data', d => { err += d; });
    c.on('error', reject);
    c.on('close', code => (code === 0 ? resolve() : reject(new Error(`build-page.mjs exited ${code}: ${err.slice(0, 2000)}`))));
  });
  return JSON.parse(readFileSync(join(mirror, 'rp-calls.json'), 'utf8'));
}

/** Golden-A's own default export for each of the 7 non-ref-src exercises, from a proper mirror (font present). */
async function loadGoldenASpecs(): Promise<Record<string, Record<string, unknown>>> {
  const g = await import(pathToFileURL(join(VENDOR, '..', 'golden.mjs')).href);
  const vendorMirror = g.makeMirror();
  tmps.push(vendorMirror);
  const out: Record<string, Record<string, unknown>> = {};
  for (const p of plateEntries) {
    if (p.src === 'ref-src') continue;
    const mod = await import(pathToFileURL(join(vendorMirror, p.src)).href);
    out[p.slug.replace(/-/g, '_')] = JSON.parse(JSON.stringify(mod.default, (k, v) => (typeof v === 'function' ? undefined : v)));
  }
  return out;
}

/**
 * The only fields a crop-time renderPlate call may legitimately change from golden-A (item 2 of the design note):
 * pose/camera framing (`poses`, `camera`, `seatDrop`, `datum`, `viewLabel`), what that framing repositions or hides
 * (`equipment`, `ghosts`, `startParts`, `marks`), the spec's own embedded mistake sub-pose, and pure labels
 * (`id`, `name`, `view`, `facing`). None of these are user-authored content (they are plate-engine drawing fields,
 * SPEC.md's schema, not GA's HowToContent) - `tempo`, `alt`, `checks` and `callouts` are the protected content
 * fields below, and stay held to zero tolerance.
 */
const CROP_WINDOW_FIELDS = new Set([
  'poses', 'camera', 'seatDrop', 'datum', 'viewLabel', 'equipment', 'ghosts', 'startParts', 'marks',
  'mistake', 'id', 'name', 'view', 'facing',
]);
/** Everything else must be byte-identical, or (checks/callouts only) shrunk to empty - never partially edited. */
const PROTECTED_FIELDS = ['tempo', 'alt', 'checks', 'callouts'];

function protectedFieldProblems(exId: string, call: RpCall, goldenA: Record<string, unknown>): string[] {
  const bad: string[] = [];
  for (const k of PROTECTED_FIELDS) {
    const goldenVal = JSON.stringify(goldenA[k]);
    const callVal = JSON.stringify(call.spec[k]);
    if (goldenVal === callVal) continue;
    const shrunkToEmpty = Array.isArray(call.spec[k]) && (call.spec[k] as unknown[]).length === 0;
    if (!shrunkToEmpty) bad.push(`${exId} ${JSON.stringify(call.opts)}: ${k} differs from golden-A and is not empty`);
  }
  for (const k of Object.keys(call.spec)) {
    if (PROTECTED_FIELDS.includes(k) || CROP_WINDOW_FIELDS.has(k)) continue;
    if (JSON.stringify(call.spec[k]) !== JSON.stringify(goldenA[k])) bad.push(`${exId} ${JSON.stringify(call.opts)}: unenumerated field "${k}" differs from golden-A (never widen the crop-key list to pass; the drift is real)`);
  }
  return bad;
}

/** normalSvg/normalOverlay/mistakeSvg/mistakeOverlay/alt/mistakeAlt, sliced from the built page, sha256-matched
 *  against GOLDEN.json. Independent of tempo/tells layout (those can trail the figure in golden B's card). */
function fragmentProblems(html: string): string[] {
  const bad: string[] = [];
  const NORM = /<figure class="plate" data-mode="normal">([\s\S]*?)<figcaption class="sr-only">([^<]*)<\/figcaption><\/figure>/;
  const MIS = /<figure class="plate" data-mode="mistake" hidden>([\s\S]*?)<figcaption class="sr-only">([^<]*)<\/figcaption><\/figure>/;
  const splitSvg = (s: string): [string, string] => {
    const m = s.match(/^(<svg class="plate-svg"[^>]*>[\s\S]*?<\/svg>)([\s\S]*)$/);
    if (!m) throw new Error('no svg boundary found');
    return [m[1]!, m[2]!];
  };
  for (const p of plateEntries) {
    const cardStart = html.indexOf(`id="card-${p.chromeId}"`);
    if (cardStart < 0) { bad.push(`${p.chromeId}: card not found in the built page`); continue; }
    const body = html.slice(cardStart);
    const nm = body.match(NORM), mm = body.match(MIS);
    if (!nm || !mm) { bad.push(`${p.chromeId}: normal/mistake figure not found`); continue; }
    const [nSvg, nOv] = splitSvg(nm[1]!);
    const [mSvg, mOv] = splitSvg(mm[1]!);
    const checks: Array<[string, string, string]> = [
      ['normalSvg', sha256(nSvg), p.fragments.normalSvg],
      ['normalOverlay', sha256(nOv), p.fragments.normalOverlay],
      ['mistakeSvg', sha256(mSvg), p.fragments.mistakeSvg],
      ['mistakeOverlay', sha256(mOv), p.fragments.mistakeOverlay],
      ['alt', sha256(unesc(nm[2]!)), p.fragments.alt],
      ['mistakeAlt', sha256(unesc(mm[2]!)), p.fragments.mistakeAlt],
    ];
    for (const [name, got, want] of checks) if (got !== want) bad.push(`${p.chromeId}: ${name} sha256 ${got} != golden-A ${want}`);
  }
  return bad;
}

describe('HT4-A5: golden B holds only golden-A plates', () => {
  let calls: RpCall[];
  let goldenASpecs: Record<string, Record<string, unknown>>;
  let builtHtml: string;

  beforeAll(async () => {
    goldenASpecs = await loadGoldenASpecs();
    const mirror = makeMirror();
    calls = await captureRenderPlateCalls(mirror);
    builtHtml = readFileSync(join(mirror, 'artifact', 'technical-plates.html'), 'utf8');
  }, 30000);

  afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

  it('1. each of the 7 non-ref-src howto.mjs re-exports its plate spec unmodified from golden-A, no callout override', () => {
    for (const p of plateEntries) {
      if (p.src === 'ref-src') continue;
      const exId = p.slug.replace(/-/g, '_');
      const howto = readFileSync(join(LAYERS, 'exercises', `${exId}.howto.mjs`), 'utf8');
      // Two patterns in golden B, both zero-override re-exports: `import plate from './<id>.mjs'` used directly, or
      // `import plateSpec from './<id>.mjs'; const plate = plateSpec;`.
      const directImport = new RegExp(`import plate from '\\./${exId}\\.mjs'`).test(howto);
      const aliasedImport = new RegExp(`import plateSpec from '\\./${exId}\\.mjs'`).test(howto) && /const plate = plateSpec;/.test(howto);
      expect(directImport || aliasedImport, `${exId}.howto.mjs should re-export its plate from './${exId}.mjs' unmodified`).toBe(true);
    }
  });

  it('1b. golden B\'s own exercises/*.mjs are byte-identical to golden-A\'s vendored specs (no drift, S-2 fixed it)', () => {
    for (const p of plateEntries) {
      if (p.src === 'ref-src') continue;
      const layersFile = readFileSync(join(LAYERS, p.src), 'utf8');
      const vendorFile = readFileSync(join(VENDOR, p.src), 'utf8');
      expect(layersFile, `${p.src} should be byte-identical to the golden-A vendor copy`).toBe(vendorFile);
    }
  });

  it('1c. lateral raise: golden B\'s ref-src/plate.mjs is byte-identical to the golden-A vendor pin, and re-exported unwrapped', () => {
    const layersRef = readFileSync(join(LAYERS, 'ref-src', 'plate.mjs'), 'utf8');
    const vendorRef = readFileSync(join(VENDOR, 'ref-src', 'plate.mjs'), 'utf8');
    expect(layersRef).toBe(vendorRef);
    const howto = readFileSync(join(LAYERS, 'exercises', 'dumbbell_lateral_raise.howto.mjs'), 'utf8');
    expect(howto).toMatch(/import \{ plate as refPlate \} from '\.\.\/ref-src\/plate\.mjs'/);
    expect(howto).toMatch(/render:\s*refPlate/);
  });

  it('failure path: there is no exercises/dumbbell_lateral_raise.mjs to import (golden B takes its plate from ref-src)', () => {
    expect(existsSync(join(LAYERS, 'exercises', 'dumbbell_lateral_raise.mjs'))).toBe(false);
  });

  it('2. every renderPlate call uses only {id, mistake, selected} as options', () => {
    expect(calls.length).toBeGreaterThan(0);
    for (const c of calls) for (const k of Object.keys(c.opts ?? {})) expect(['id', 'mistake', 'selected']).toContain(k);
  });

  it('2. every call, grouped by its own spec.id, differs from golden-A only within the crop-window allowance', () => {
    const bad: string[] = [];
    for (const c of calls) {
      const exId = c.spec.id as string;
      const goldenA = goldenASpecs[exId];
      if (!goldenA) { bad.push(`call with unknown spec.id "${exId}"`); continue; }
      bad.push(...protectedFieldProblems(exId, c, goldenA));
    }
    expect(bad).toEqual([]);
  });

  it('2. at least one call per exercise is the untouched base plate (spec deep-equals golden-A exactly)', () => {
    const exact = new Set<string>();
    for (const c of calls) {
      const exId = c.spec.id as string;
      if (JSON.stringify(c.spec) === JSON.stringify(goldenASpecs[exId])) exact.add(exId);
    }
    expect([...exact].sort()).toEqual(Object.keys(goldenASpecs).sort());
  });

  it('failure path: reintroducing the chest-press callout override fails (a real, non-empty, differing callouts array)', () => {
    const goldenA = goldenASpecs.machine_chest_press!;
    const fakeCall: RpCall = { opts: { id: 'machine-chest-press-n' }, spec: { ...goldenA, callouts: [{ key: 'fake', text: 'reintroduced override' }] } };
    const bad = protectedFieldProblems('machine_chest_press', fakeCall, goldenA);
    expect(bad.some(m => m.includes('callouts'))).toBe(true);
  });

  it('failure path: a crop spec with a moved joint that also edits tempo fails (poses alone is not an excuse to touch tempo)', () => {
    const goldenA = goldenASpecs.barbell_back_squat!;
    const fakeCall: RpCall = { opts: { id: 'depth-r' }, spec: { ...goldenA, poses: {}, tempo: [{ phase: 'Invented', s: 1 }] } };
    const bad = protectedFieldProblems('barbell_back_squat', fakeCall, goldenA);
    expect(bad.some(m => m.includes('tempo'))).toBe(true);
  });

  it('3. every full plate fragment (normal/mistake svg+overlay, alt) in the built page is === golden-A\'s GOLDEN.json fragment, for all 8', () => {
    expect(fragmentProblems(builtHtml)).toEqual([]);
    expect(plateEntries.length).toBe(8);
  });
});
