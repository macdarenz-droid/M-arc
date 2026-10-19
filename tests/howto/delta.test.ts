// HT-11 (card ht-11-card.md, rulings on PR #273): the path codec of the generated ht-*.ts and posture-*.ts modules.
//   D1 round trip: unpack(pack(s)) === s for every figure string of every shipped plate and every posture string, plus
//      non-ASCII text next to paths and a fragment with no path (an empty delta); every path form is used.
//   D2 (R1): each packed ht-<slug>.ts deep-equals the object of its unpacked moduleText; one changed path digit in a
//      packed module turns that, and L2's === against the golden fragment, red.
//   D3 (stop 3): no generated ht-*.ts or posture-*.ts, and not the decoder, holds eval(, new Function or Function(.
//   D4: each packed module carries src/howto/delta.js's unpack byte for byte.
//   D5 size: each built ht-<slug>-*.js is at most 65 % of its gz bytes on main 565ea5a4.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { unpack } from '@/howto/delta';
import { readHowTo } from './generated-module';
import { SHIPPED } from './shipped-rows';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let g: any, codec: any, plates: any, fixture: any[], latest: Map<string, any>;
const tmps: string[] = [];
beforeAll(async () => {
  g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
  codec = await import(/* @vite-ignore */ url('tools/plates/gen/codec/delta.mjs'));
  plates = await import(/* @vite-ignore */ url('tools/plates/gen/plates.mjs'));
  fixture = g.extractPlates(readFileSync(g.FIXTURE, 'utf8'));
  latest = g.latestEntries(JSON.parse(readFileSync(g.GOLDEN_JSON, 'utf8')).entries);
});
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

const EIGHT = SHIPPED.slice(0, 8);
const GEN = 'src/howto/generated';
const figures = (p: any) => [p.normal.svg, p.normal.overlay, p.mistake.svg, p.mistake.overlay] as string[];
const roundTrip = (frags: string[], table: string[] = []) => unpack(codec.pack(frags, [...table]), [...table]);
const formsOf = (frags: string[]) => frags.flatMap(s => [...s.matchAll(/ d="([^"]*)"/g)].map(m => {
  const d = m[1]!;
  return d[0] === '^' ? 'ref' : d.startsWith('~#') ? 'spline' : d.startsWith('~~') ? 'circle' : d[0] === '~' ? 'walk' : 'raw';
}));
/** A temp tree with one module file, for readHowTo. */
const tree = (slug: string, text: string) => {
  const root = mkdtempSync(join(tmpdir(), 'ht11-'));
  tmps.push(root);
  mkdirSync(join(root, GEN), { recursive: true });
  writeFileSync(join(root, GEN, `ht-${slug}.ts`), text);
  return root;
};

describe('HT-11 D1: the codec gives back every string byte for byte', () => {
  it('every figure string of the 8 golden plates, packed and unpacked, is === its source, and every form is used', () => {
    const forms = new Set<string>();
    expect(fixture).toHaveLength(8);
    for (const p of fixture) {
      const frags = figures(p), packed = codec.pack(frags);
      expect(unpack(packed), p.chromeId).toEqual(frags);
      unpack(packed).forEach((s, n) => expect(s === frags[n], `${p.chromeId} fragment ${n}`).toBe(true));
      expect(packed.join('').length, p.chromeId).toBeLessThan(frags.join('').length);
      for (const f of formsOf(packed)) forms.add(f);
    }
    expect([...forms].sort()).toEqual(['circle', 'raw', 'ref', 'spline', 'walk']);
  });

  it('every posture panel and zdots string of every shipped row decodes to itself', async () => {
    for (const r of SHIPPED) {
      const m = await import(/* @vite-ignore */ url(`${GEN}/posture-${r.chromeId}.ts`));
      const frags = [...Object.values(m.panels as Record<string, string>), m.zdots as string];
      expect(roundTrip(frags), r.chromeId).toEqual(frags);
    }
  });

  it('non-ASCII text next to paths, a string with no path (an empty delta), a raw path and a table from before', () => {
    const svg = '<svg><text>Größe – ✓ 🙂</text><path d="M1.5 2C3 4 5.25 6 7 8C9 10 11 12 13 14Z"/><path d="M0 0h10"/><path d="M1.5 2C3 4 5.25 6 7 8C9 10 11 12 13 14Z"/></svg>';
    const packed = codec.pack([svg, '<p>no path</p>', '']);
    expect(packed[1]).toBe('<p>no path</p>');
    expect(packed[2]).toBe('');
    expect(formsOf(packed)[0]).not.toBe('raw');
    expect(formsOf(packed).slice(1)).toEqual(['raw', 'ref']);
    expect(packed[0]).toContain('<text>Größe – ✓ 🙂</text>');
    expect(unpack(packed)).toEqual([svg, '<p>no path</p>', '']);
    const base = ['M1 1L2 2'], later = codec.pack(['<path d="M1 1L2 2"/>'], [...base]);
    expect(later).toEqual(['<path d="^0"/>']);
    expect(unpack(later, [...base])).toEqual(['<path d="M1 1L2 2"/>']);
  });

  it('refuses a source whose path starts with ~ or ^, and a value that would not decode to its own bytes stays raw', () => {
    expect(() => codec.pack(['<path d="~M1 2"/>'])).toThrow(/starts with ~ or \^/);
    expect(() => codec.pack(['<path d="^3"/>'])).toThrow(/starts with ~ or \^/);
    for (const d of ['M1.50 2L3 4', 'M01 2L3 4', 'M1 2L3', 'M-1 2L3 4', 'M1  2L3 4', 'M1 2l3 4']) expect(codec.encodePath(d), d).toBeNull();
  });
});

describe('HT-11 D2 (R1): each packed module is its unpacked text, and a changed digit is caught', () => {
  it('each ht-<slug>.ts of the 8 deep-equals the object of its unpacked moduleText', async () => {
    const byChrome = new Map(fixture.map(p => [p.chromeId, p]));
    for (const r of EIGHT) {
      const m = (await import(/* @vite-ignore */ url(`${GEN}/ht-${r.slug}.ts`))).default;
      const text = readFileSync(`${GEN}/ht-${r.slug}.ts`, 'utf8'), header = text.slice(0, text.indexOf('\n') + 1);
      const unpacked = plates.moduleText(r.id, byChrome.get(r.chromeId), latest.get(r.id), m.hashes.inputsSha256);
      expect(unpacked).not.toContain('unpack');
      // the plates plugin writes schema, id, name, hashes and plate; content.mjs adds the content fields after it
      const { schema, id, name, hashes, plate } = m;
      expect(readHowTo(r.slug, tree(r.slug, header + unpacked)), r.id).toEqual({ schema, id, name, hashes, plate });
      expect(readHowTo(r.slug), r.id).toEqual(m);
    }
  });

  it('mutation: one changed path digit in a packed module breaks the deep-equal and L2 HT2-A1\'s ===', async () => {
    const r = EIGHT[1]!, text = readFileSync(`${GEN}/ht-${r.slug}.ts`, 'utf8'), f = fixture.find(p => p.chromeId === r.chromeId);
    const from = text.indexOf(' d=\\"~#'), at = text.indexOf('\\"', from + 5) - 1, ch = text[at]!, alpha: string = codec.ALPHA;   // a control residual
    const swap = alpha[(alpha.indexOf(ch) + 1) % 32 + (alpha.indexOf(ch) < 32 ? 0 : 32)]!;   // same digit class: the structure holds
    const bad = readHowTo(r.slug, tree(r.slug, text.slice(0, at) + swap + text.slice(at + 1)));
    const good = (await import(/* @vite-ignore */ url(`${GEN}/ht-${r.slug}.ts`))).default;
    expect(bad).not.toEqual(good);
    expect(bad.plate.normal.svg === f.normal.svg).toBe(false);
    expect(good.plate.normal.svg === f.normal.svg).toBe(true);
  });
});

/** The banned dynamic-code calls (card stop 3) in a text. */
export const dynamicCode = (t: string) => [...t.matchAll(/\beval\s*\(|\bnew\s+Function\b|\bFunction\s*\(/g)].map(m => m[0]);

describe('HT-11 D3 (stop 3): no eval, new Function or Function( in the packed modules or the decoder', () => {
  it('every generated ht-*.ts and posture-*.ts, and src/howto/delta.js, is clean', () => {
    const files = readdirSync(GEN).filter(f => /^(ht|posture)-.*\.ts$/.test(f));
    expect(files.length).toBe(2 * SHIPPED.length);
    for (const f of [...files.map(f => `${GEN}/${f}`), 'src/howto/delta.js']) expect(dynamicCode(readFileSync(f, 'utf8')), f).toEqual([]);
  });
  it('mutation: each banned form inserted into a module is found', () => {
    const t = readFileSync(`${GEN}/ht-${EIGHT[0]!.slug}.ts`, 'utf8');
    for (const bad of ['eval(x)', 'new Function("x")', 'Function("x")()']) expect(dynamicCode(t.replace('const unpack =', `${bad}; const unpack =`)), bad).toHaveLength(1);
  });
});

describe('HT-11 D4: the decoder each module carries is src/howto/delta.js\'s', () => {
  it('each packed ht-*.ts and posture-*.ts holds decoderSource() exactly once, and nothing imports delta.js at run time', () => {
    const src: string = codec.decoderSource(), firstLine = src.slice(0, src.indexOf('\n'));
    expect(firstLine).toBe("function unpack(frags = [''], table = frags.slice(0, 0)) {");
    for (const r of SHIPPED) {
      const ht = readFileSync(`${GEN}/ht-${r.slug}.ts`, 'utf8'), po = readFileSync(`${GEN}/posture-${r.chromeId}.ts`, 'utf8');
      expect(ht.split(src.replace(/\n/g, '\n    ')).length, r.slug).toBe(2);
      expect(po.split(src).length, r.chromeId).toBe(2);
      for (const t of [ht, po]) expect(t).not.toMatch(/^import .*delta|import\(.*delta/m);
    }
  });
});

// The gz bytes of each ht-<slug>-*.js on main 565ea5a4 (scratch `vite build` of that commit, zlib's default level as
// the gate's A2; HT-11 note section 2).
const MAIN_GZ: Record<string, number> = {
  'dumbbell-lateral-raise': 15286, 'barbell-back-squat': 24008, 'pull-up': 31339, 'hanging-leg-raise': 30631,
  'lat-pulldown': 27005, 'seated-cable-row': 28371, 'leg-press': 20813, 'machine-chest-press': 22590,
};

describe('HT-11 D5: each base chunk ships at least 35 % fewer gz bytes than on main 565ea5a4', () => {
  it('a vite build of this tree: each built ht-<slug>-*.js gz <= 65 % of its main value', () => {
    expect(Object.keys(MAIN_GZ).sort()).toEqual(EIGHT.map(r => r.slug).sort());
    const out = mkdtempSync(join(tmpdir(), 'ht11-www-'));
    tmps.push(out);
    // the environment of `npm run build`: no NODE_ENV or VITEST* from the test runner (they switch vite to dev builds)
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST'));
    const r = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'error'], { env, encoding: 'utf8', maxBuffer: 1 << 26 });
    expect(r.status, r.stderr).toBe(0);
    const assets = readdirSync(join(out, 'assets'));
    for (const [slug, main] of Object.entries(MAIN_GZ)) {
      const f = assets.filter(a => new RegExp(`^ht-${slug}-[\\w-]{8}\\.js$`).test(a));
      expect(f, slug).toHaveLength(1);
      const gz = gzipSync(readFileSync(join(out, 'assets', f[0]!))).length;
      expect(gz, `${slug}: ${gz} B gz vs ${main} on main`).toBeLessThanOrEqual(Math.floor(main * 0.65));
    }
  }, 180_000);
});
