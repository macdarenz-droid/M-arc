// LIB-2b (card 10, lib4-cards section 11): library rows in the layer generators. Each block names its acceptance id.
// E1, E3 and E7 run the repo's own generator in a temporary repo copy that holds one source-level scratch row
// (tests/howto/fixtures/lib2b/fixture.mjs); E2 checks every output's inputs; the shared guards run on the repo itself.
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { LIBRARY } from './shipped-rows';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let F: any, root: string;
const tmps: string[] = [];
const turl = (p: string) => F.url(root, p);

/** Runs `node <args>` in `cwd`; resolves { code, out } (stdout + stderr). */
const run = (cwd: string, args: string[]) => new Promise<{ code: number; out: string }>(resolve => {
  const c = spawn(process.execPath, args, { cwd, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST')) });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', code => resolve({ code: code ?? 1, out }));
});

/** Output paths the clone writes (lib4-cards 11.1 item 11), and the one it must not. */
const CLONE_OUTPUTS = ['src/howto/generated/ht-cable-lateral-raise.ts', 'src/howto/generated/feel-cable-lateral-raise.ts', 'src/howto/generated/posture-cable-lateral-raise.ts',
  'src/slices/howto/css/zoom-cable-lateral-raise.css', 'docs/research/howto/lib_cable_lateral_raise.json', 'src/howto/generated/handpair-lib2b-scratch.ts'];

let mainOut: Map<string, any>, repoOut: Map<string, any>, treeOut: Map<string, any>;
beforeAll(async () => {
  F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
  root = F.fixtureTree(); tmps.push(root);
  const g = await run(root, ['tools/plates/generate.mjs']);
  if (g.code !== 0) throw new Error(`generate failed in the E1 tree:\n${g.out}`);
  const eight = F.ownRowsTree();
  try { mainOut = await (await import(/* @vite-ignore */ F.url(eight, 'tools/plates/generate.mjs'))).render(); } finally { F.drop(eight); }
  repoOut = await (await import(/* @vite-ignore */ url('tools/plates/generate.mjs'))).render();
  treeOut = await (await import(/* @vite-ignore */ turl('tools/plates/generate.mjs'))).render();
}, 600_000);
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

/** The import('./X') targets of a loaders.ts text that are not outputs. Red on a text with no imports. */
export function danglingImports(loaders: string, outputs: Set<string>): string[] {
  const targets = [...loaders.matchAll(/import\('\.\/([\w-]+)'\)/g)].map(m => m[1]!);
  if (!targets.length) return ['no imports in loaders.ts'];
  return targets.filter(t => !outputs.has(`src/howto/generated/${t}.ts`));
}

/** D-LIB2b-HANDCSS: problems with a library row's HAND line in a loaders.ts text. A shared handpair-<key> chunk imports
 *  no CSS, so the line must load the row's zoom-<chromeId>.css first, then the pair chunk. Returns the pair key too. */
export function handLineProblems(loaders: string, c: string): { key?: string; problems: string[] } {
  const hand = loaders.slice(loaders.indexOf('export const HAND'), loaders.indexOf('export const POSTURE'));
  const lines = hand.split('\n').filter(l => l.startsWith(`  ${JSON.stringify(c)}: `));
  if (lines.length !== 1) return { problems: [`${c}: ${lines.length} HAND lines`] };
  const m = lines[0]!.match(new RegExp(`^  ${JSON.stringify(c)}: \\(\\) => import\\('\\.\\./\\.\\./slices/howto/css/zoom-${c}\\.css'\\)\\.then\\(\\(\\) => import\\('\\./handpair-([a-z0-9-]+)'\\)\\),$`));
  return m ? { key: m[1]!, problems: [] } : { problems: [`${c}: HAND line does not load zoom-${c}.css before its hand pair: ${lines[0]}`] };
}

/** D-LIB2b-HANDCSS in the built chunk graph (vite manifest + the built loaders chunk): the HAND entry for `c` preloads
 *  the built zoom-<c>.css and only then imports the built handpair-<key> chunk, which itself has no css or imports. */
export function builtHandCssProblems(www: string, c: string, key: string): string[] {
  const man = JSON.parse(readFileSync(join(www, '.vite/manifest.json'), 'utf8'));
  const css = man[`src/slices/howto/css/zoom-${c}.css`]?.file, pair = man[`src/howto/generated/handpair-${key}.ts`];
  if (!css || !pair) return [`manifest: no zoom-${c}.css or handpair-${key}.ts entry`];
  const bad: string[] = [];
  if (pair.css?.length || pair.imports?.length) bad.push(`handpair-${key}: the pair chunk has css or imports`);
  const js = readFileSync(join(www, man['src/howto/generated/loaders.ts'].file), 'utf8');
  const deps = JSON.parse(js.match(/m\.f=(\[[^\]]*\])/)?.[1] ?? '[]') as string[];
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = js.match(new RegExp(`${esc(JSON.stringify(c))}:\\(\\)=>(\\w+)\\(\\(\\)=>Promise\\.resolve\\(\\{\\}\\),__vite__mapDeps\\(\\[([\\d,]+)\\]\\),import\\.meta\\.url\\)\\.then\\(\\(\\)=>\\1\\(\\(\\)=>import\\("\\./([^"]+)"\\)`));
  if (!m) return [...bad, `${c}: the built HAND entry does not preload a css before its pair chunk`];
  const pre = m[2]!.split(',').map(i => deps[Number(i)]);
  if (!pre.includes(`./${css.replace(/^assets\//, '')}`)) bad.push(`${c}: the built HAND entry preloads ${pre.join(', ')}, not ${css}`);
  if (`assets/${m[3]}` !== pair.file) bad.push(`${c}: the built HAND entry imports ${m[3]}, not ${pair.file}`);
  return bad;
}

describe('E1: a shipped library row gets every output', { timeout: 120_000 }, () => {
  it('the transform and the committed page are the ones provenance.json records', () => {
    const p = JSON.parse(readFileSync(F.PROVENANCE, 'utf8')), t = F.transformSources();
    expect(sha(t.spec)).toBe(p.specSha256);
    expect(sha(t.howto)).toBe(p.howtoSha256);
    const page = readFileSync(F.PAGE_FIXTURE);
    expect([sha(page), page.length]).toEqual([p.pageSha256, p.bytes]);
    expect(p.builds).toHaveLength(2);
    expect(new Set(p.builds.map((b: any) => b.checkout)).size).toBe(2);
    for (const b of p.builds) expect(b.pageSha256).toBe(p.pageSha256);
  });

  it('generate writes the 61 files plus exactly the clone\'s 6 (ht, feel, posture, zoom css, research card, its hand pair), never hand-<chromeId>', () => {
    const extra = [...treeOut.keys()].filter(p => !mainOut.has(p)).sort();
    expect(mainOut.size).toBe(61);
    expect(extra).toEqual([...CLONE_OUTPUTS].sort());
    expect(treeOut.size).toBe(61 + CLONE_OUTPUTS.length);
    expect(treeOut.has('src/howto/generated/hand-cable-lateral-raise.ts')).toBe(false);
  });

  it('the loaders map the clone: LOADERS, HAND (its pair), POSTURE and FEEL', () => {
    const t = treeOut.get('src/howto/generated/loaders.ts').text as string;
    expect(t).toContain("lib_cable_lateral_raise: () => import('./ht-cable-lateral-raise'),");
    expect(t).toContain(`"cable-lateral-raise": () => import('../../slices/howto/css/zoom-cable-lateral-raise.css').then(() => import('./handpair-lib2b-scratch')),`);
    expect(t).toContain(`"cable-lateral-raise": () => import('./posture-cable-lateral-raise'),`);
    expect(t).toContain(`"cable-lateral-raise": () => import('./feel-cable-lateral-raise'),`);
  });

  it('generate --check and npm run build pass on the tree', async () => {
    const c = await run(root, ['tools/plates/generate.mjs', '--check']);
    expect(c.out).toContain(`PASS, ${61 + CLONE_OUTPUTS.length} files fresh`);
    const b = await run(root, ['node_modules/vite/bin/vite.js', 'build', '--logLevel', 'error', '--manifest']);
    expect(b.code, b.out).toBe(0);
    expect(readdirSync(join(root, 'www/assets')).some(f => /^ht-cable-lateral-raise-[\w-]+\.js$/.test(f))).toBe(true);
    // D-LIB2b-HANDCSS: in the built chunk graph, the clone's HAND loader waits for its zoom css, then loads its pair chunk
    expect(builtHandCssProblems(join(root, 'www'), 'cable-lateral-raise', 'lib2b-scratch')).toEqual([]);
  }, 600_000);

  it('LIB-6 rebuild: where its builder exists the page rebuilds byte for byte through layersSpecOf; where it does not, render/ is absent too', async () => {
    if (!existsSync(join(F.REPO, 'tools/plates/library/build-layers-page.mjs'))) {
      expect(existsSync(join(F.REPO, 'tools/plates/library/render'))).toBe(false);
      return;
    }
    const stage = mkdtempSync(join(tmpdir(), 'lib2b-stage-')); tmps.push(stage);
    const { layersSpecOf } = await import(/* @vite-ignore */ turl('tools/plates/library/layers-spec.mjs'));
    const { buildLayersPage } = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
    const spec = layersSpecOf(F.BATCH, { stageDir: stage });
    expect((await buildLayersPage(spec)).equals(readFileSync(F.PAGE_FIXTURE))).toBe(true);
  }, 300_000);
});

/** Mutated copies of the E1 tree, each generated in parallel; every one must fail naming the id and the file or check. */
describe('E1/E3/E7 failure paths: the generator throws, naming the id and the file', () => {
  const cases: [string, (r: string) => void, RegExp][] = [
    ['one plugin back to goldenRows (feel.mjs emits the 8 only)', r => {
      const p = join(r, 'tools/plates/gen/feel.mjs'), s = readFileSync(p, 'utf8');
      writeFileSync(p, s.replace('...libraryRows().map(row =>', '...[].map(row =>'));
    }, /ids: lib_cable_lateral_raise: no src\/howto\/generated\/feel-cable-lateral-raise\.ts/],
    ['hands.mjs\'s library loop emptied (no zoom css)', r => {
      const p = join(r, 'tools/plates/gen/hands.mjs'), s = readFileSync(p, 'utf8'), from = 'const all = registryRows(), lib = libraryRows(all);';
      if (s.split(from).length !== 2) throw new Error('hands.mjs: the library loop moved');
      writeFileSync(p, s.replace(from, 'const all = registryRows(), lib = [];'));
    }, /ids: lib_cable_lateral_raise: no src\/slices\/howto\/css\/zoom-cable-lateral-raise\.css/],
    ['QA card removed (E7)', r => rmSync(join(r, F.CARD_FILE)), /plate QA refused lib_cable_lateral_raise:[\s\S]*PQ-H6/],
    ['no How-to source (E3)', r => rmSync(join(r, F.HOWTO)), /lib_cable_lateral_raise[^\n]*no (How-to )?source( file)? tools\/plates\/library\/howto\/lib_cable_lateral_raise\.howto\.mjs/],
    ['no pinned layers page (E3)', r => rmSync(join(r, F.PAGES.layers)), /lib_cable_lateral_raise \(batch LB-LIB2B, [^)]*\): no layers page tests\/howto\/golden\/library\/zz-lib2b\.layers\.html/],
    ['one byte of the layers page changed', r => {
      const p = join(r, F.PAGES.layers), s = readFileSync(p, 'utf8');
      writeFileSync(p, s.replace('stop-opacity="0.62"', 'stop-opacity="0.63"'));
    }, /lib_cable_lateral_raise[^\n]*zz-lib2b\.layers\.html sha256 [0-9a-f]{64} \(\d+ B\) != pinned/],
    ['no hand pair', r => rmSync(join(r, 'tools/plates/library/hands/pairs.mjs')), /hands: lib_cable_lateral_raise: no hand pair/],
  ];
  it(`${cases.length} mutations, each refused`, async () => {
    const results = await Promise.all(cases.map(async ([name, mutate, want]) => {
      const r = mkdtempSync(join(tmpdir(), 'lib2b-mut-')); tmps.push(r);
      cpSync(root, r, { recursive: true, verbatimSymlinks: true });
      mutate(r);
      const g = await run(r, ['tools/plates/generate.mjs']);
      return { name, code: g.code, ok: want.test(g.out), out: g.out.slice(-1500) };
    }));
    for (const x of results) {
      expect(x.code, x.name).not.toBe(0);
      expect(x.ok, `${x.name}:\n${x.out}`).toBe(true);
    }
  }, 900_000);
});

describe('E3: no dangling chunk', () => {
  it('every import in loaders.ts is an output, on the repo and on the E1 tree', () => {
    for (const o of [repoOut, treeOut]) expect(danglingImports(o.get('src/howto/generated/loaders.ts').text, new Set(o.keys()))).toEqual([]);
    expect(danglingImports('', new Set())).toEqual(['no imports in loaders.ts']);
    expect(danglingImports("x: () => import('./ht-nope'),", new Set())).toEqual(['ht-nope']);
  });
  it('ids.mjs refuses a shipped row without a chunk before it writes a line (missingChunks)', async () => {
    const ids = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
    const row = { id: 'lib_x', slug: 'x', chromeId: 'x' }, all = new Set(['ht-x', 'feel-x', 'posture-x', 'hand-x']), zoom = 'src/slices/howto/css/zoom-x.css';
    const has = (drop: string) => (n: string) => n !== drop && all.has(n), file = (p: string) => p === zoom, none = () => false;
    expect(() => ids.missingChunks([row], has(''), {}, {}, file)).not.toThrow();
    for (const n of ['ht-x', 'feel-x', 'posture-x']) expect(() => ids.missingChunks([row], has(n), {}, {}, file)).toThrow(`ids: lib_x: no src/howto/generated/${n}.ts`);
    expect(() => ids.missingChunks([row], has(''), {}, {}, none)).toThrow(`ids: lib_x: no ${zoom}`);
    expect(() => ids.missingChunks([row], has(''), { x: 'k' }, { lib_x: 'none' }, none)).toThrow(`ids: lib_x: no ${zoom}`);
    expect(() => ids.missingChunks([row], has('hand-x'), {}, {}, file)).toThrow('ids: lib_x: no src/howto/generated/hand-x.ts and no hand pair');
    expect(() => ids.missingChunks([row], has('hand-x'), { x: 'k' }, {}, file)).not.toThrow();
    expect(() => ids.missingChunks([row], has('hand-x'), {}, { lib_x: 'none' }, file)).not.toThrow();
  });
});

/** Every output's inputs, as the core hashes them: the union of each writer's inputsFor(path) (or its inputs()). */
async function inputsOf(base: string, out: Map<string, any>) {
  const gen = await import(/* @vite-ignore */ new URL('tools/plates/generate.mjs', `file://${base}/`).href);
  const core = await import(/* @vite-ignore */ new URL('tools/plates/lib/inputs.mjs', `file://${base}/`).href);
  const mods = new Map((await gen.loadPlugins()).map((p: any) => [p.path, p.mod]));
  // a writer without inputsFor (handpairs.mjs) gives each output its inputs in outputs(): read them there, as the core does
  const own = new Map<string, Map<string, string[]>>();
  for (const w of new Set([...out.values()].flatMap((o: any) => o.writers as string[]))) {
    const m: any = mods.get(w);
    if (!m.inputsFor) own.set(w, new Map((await m.outputs({ prev: new Map(), hashFor: () => '0'.repeat(64) })).filter((x: any) => x.inputs).map((x: any) => [x.path, x.inputs])));
  }
  const res = new Map<string, string[]>();
  for (const [p, o] of out) {
    const ins = o.writers.flatMap((w: string) => { const m: any = mods.get(w); return m.inputsFor?.(p) ?? own.get(w)?.get(p) ?? m.inputs(); });
    if (core.inputsSha256(o.writers, ins, base) !== o.hash) throw new Error(`${p}: the union of its writers' inputs does not give its header hash`);
    res.set(p, ins);
  }
  return { res, core };
}

describe('E2: inputs cover every imported composer', { timeout: 180_000 }, () => {
  it('every ht- and research output of every shipped row lists its How-to source\'s whole import closure (and a library plate its spec\'s)', async () => {
    const repo = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
    for (const [base, out] of [[repo, repoOut], [root, treeOut]] as const) {
      const { res } = await inputsOf(base, out);
      const reg = await import(/* @vite-ignore */ new URL('tools/plates/library/registry.mjs', `file://${base}/`).href);
      const { closureOf } = await import(/* @vite-ignore */ new URL('tools/plates/library/inputs-closure.mjs', `file://${base}/`).href);
      const rows = reg.shippedRows();
      expect(rows.length).toBeGreaterThanOrEqual(8);
      expect(rows.slice(0, 8).map((r: any) => r.id)).toEqual(Object.keys(JSON.parse(readFileSync(join(base, 'tools/plates/plates.json'), 'utf8'))));
      let n = 0;
      for (const r of rows) {
        const closure = closureOf([reg.sourceOf(r.id)]);
        expect(closure.length, r.id).toBeGreaterThan(1);
        for (const p of [`src/howto/generated/ht-${r.slug}.ts`, `docs/research/howto/${r.id}.json`]) {
          const ins = new Set(res.get(p));
          expect(ins.size, p).toBeGreaterThan(0);
          for (const f of closure) { expect(ins.has(f), `${p} lists ${f}`).toBe(true); n++; }
        }
        if (r.mode !== 'golden') for (const f of closureOf([`tools/plates/${r.src}`])) expect(res.get(`src/howto/generated/ht-${r.slug}.ts`)!.includes(f), f).toBe(true);
      }
      expect(n).toBeGreaterThan(rows.length * 2);
    }
  });

  it('the pull-up\'s How-to closure is exactly 13 files, plus the layers MANIFEST.json, and ht-pull-up.ts lists all of them', async () => {
    const { closureOf } = await import(/* @vite-ignore */ url('tools/plates/library/inputs-closure.mjs'));
    const c = closureOf(['tools/plates/layers/exercises/pull_up.howto.mjs']);
    expect(c.filter((p: string) => !p.endsWith('MANIFEST.json'))).toHaveLength(13);
    expect(c).toContain('tools/plates/layers/MANIFEST.json');
    for (const f of ['tools/plates/layers/exercises/pull_up.mjs', 'tools/plates/layers/engine/hand.mjs', 'tools/plates/layers/engine/body.mjs']) expect(c).toContain(f);
  });

  it('touching one composer changes the inputsSha256 of exactly the outputs whose inputs hold it (the clone\'s ht- among them)', async () => {
    const { res, core } = await inputsOf(root, treeOut);
    const file = 'tools/plates/layers/engine/hand.mjs', touched = mkdtempSync(join(tmpdir(), 'lib2b-touch-')); tmps.push(touched);
    cpSync(root, touched, { recursive: true, verbatimSymlinks: true });
    writeFileSync(join(touched, file), `${readFileSync(join(touched, file), 'utf8')}\n// touched\n`);
    const changed = [...res].filter(([p, ins]) => core.inputsSha256(treeOut.get(p).writers, ins, touched) !== treeOut.get(p).hash).map(([p]) => p).sort();
    const holding = [...res].filter(([, ins]) => ins.includes(file)).map(([p]) => p).sort();
    expect(changed).toEqual(holding);
    expect(changed).toContain('src/howto/generated/ht-cable-lateral-raise.ts');
    expect(changed).toContain('src/howto/generated/ht-pull-up.ts');
    expect(changed).not.toContain('src/howto/generated/feel-cable-lateral-raise.ts');
  });

  it('the library layer outputs list their page, its config, the batch golden and batch files, MANIFEST.json and layers.mjs (11.1 item 12)', async () => {
    const { res } = await inputsOf(root, treeOut);
    for (const p of ['src/howto/generated/feel-cable-lateral-raise.ts', 'src/howto/generated/posture-cable-lateral-raise.ts', 'src/slices/howto/css/zoom-cable-lateral-raise.css']) {
      for (const f of [F.PAGES.layers, F.PAGES.layersConfig, F.BATCH_GOLDEN, F.BATCH, 'tools/plates/layers/MANIFEST.json', 'tools/plates/layers.mjs']) expect(res.get(p), `${p} lists ${f}`).toContain(f);
    }
  });
});

describe('D-LIB2b-CLOSURE: closureOf follows every input or throws', () => {
  const tree = (files: Record<string, string>) => {
    const r = mkdtempSync(join(tmpdir(), 'lib2b-cl-')); tmps.push(r);
    for (const [p, t] of Object.entries(files)) { mkdirSync(join(r, p, '..'), { recursive: true }); writeFileSync(join(r, p), t); }
    return r;
  };
  let closureOf: any;
  beforeAll(async () => { ({ closureOf } = await import(/* @vite-ignore */ url('tools/plates/library/inputs-closure.mjs'))); });
  it('follows multi-line imports, export-from and node: builtins; red on an empty list', () => {
    const r = tree({ 'a.mjs': "import {\n  b,\n} from './b.mjs';\nexport { c } from './c.mjs';\nimport { join } from 'node:path';\n// import('./not-real.mjs') in a comment\nexport default b;\n", 'b.mjs': 'export const b = 1;\n', 'c.mjs': 'export const c = 2;\n' });
    expect(closureOf(['a.mjs'], r)).toEqual(['a.mjs', 'b.mjs', 'c.mjs']);
    expect(() => closureOf([], r)).toThrow('closure: no source files');
  });
  const bad: [string, string, RegExp][] = [
    ['a computed import()', "const n = 'b'; export default import(`./${n}.mjs`);\n", /import\(\) with an argument that is not one plain string literal/],
    ['a template-literal import()', 'export default import(`./b.mjs`);\n', /import\(\) with an argument that is not one plain string literal/],
    ['require(', "export default require('./b.mjs');\n", /require is not followed/],
    ['a bare specifier', "import x from 'lodash';\nexport default x;\n", /specifier lodash is neither relative nor node:/],
    ['a file read in a library composer', "import { readFileSync } from 'node:fs';\nexport default readFileSync('x.txt', 'utf8');\n", /reads a file outside the MANIFEST-locked trees/],
    ['an unresolved import', "import x from './missing.mjs';\nexport default x;\n", /unresolved import/],
  ];
  for (const [name, text, want] of bad) it(`throws on ${name}`, () => {
    const r = tree({ 'tools/plates/library/specs/x.mjs': text, 'tools/plates/library/specs/b.mjs': 'export default 1;\n' });
    expect(() => closureOf(['tools/plates/library/specs/x.mjs'], r)).toThrow(want);
  });
});

describe('D-LIB2b-LAYOUT: layersSpecOf stages each row\'s whole closure into the mirror', { timeout: 120_000 }, () => {
  it('the clone\'s staged spec and How-to are golden B\'s layout byte for byte (id and card swapped only); no file:// anywhere', async () => {
    const stage = mkdtempSync(join(tmpdir(), 'lib2b-stage-')); tmps.push(stage);
    const { layersSpecOf } = await import(/* @vite-ignore */ turl('tools/plates/library/layers-spec.mjs'));
    const spec = layersSpecOf(F.BATCH, { stageDir: stage });
    expect(spec.groups).toEqual([{ id: 'scratch', title: 'Scratch', ids: ['cable_lateral_raise'] }]);
    expect(Object.keys(spec.closeups)).toEqual(['cable_lateral_raise']);
    expect(spec.jump).toBe(null);
    expect(Object.keys(spec.files).sort()).toEqual(['exercises/cable_lateral_raise.howto.mjs', 'exercises/cable_lateral_raise.mjs']);
    const golden = (p: string) => readFileSync(join(F.REPO, 'tools/plates/layers/exercises', p), 'utf8');
    expect(readFileSync(spec.files['exercises/cable_lateral_raise.mjs'], 'utf8')).toBe(golden('pull_up.mjs'));
    expect(readFileSync(spec.files['exercises/cable_lateral_raise.howto.mjs'], 'utf8')).toBe(golden('pull_up.howto.mjs')
      .replace("import plate from './pull_up.mjs';", "import plate from './cable_lateral_raise.mjs';").replace("id: 'lib_pull_up'", "id: 'lib_cable_lateral_raise'")
      .replace("research: { card: 'grip/research/pull_up.json', rev: 1 }", `research: { card: '${F.CARD_FILE}', rev: 1 }`));
    for (const f of Object.values(spec.files) as string[]) expect(readFileSync(f, 'utf8')).not.toContain('file://');
  });
  it('a planted library composer that imports ../../layers/engine/body.mjs is staged under library/ with that import mapped into the mirror', async () => {
    const r = mkdtempSync(join(tmpdir(), 'lib2b-plant-')); tmps.push(r);
    cpSync(root, r, { recursive: true, verbatimSymlinks: true });
    writeFileSync(join(r, 'tools/plates/library/eq/planted.mjs'), "import { bodyShapes } from '../../layers/engine/body.mjs';\nexport const planted = bodyShapes;\n");
    const spec = join(r, F.SPEC);
    writeFileSync(spec, `import { planted } from '../eq/planted.mjs';\nvoid planted;\n${readFileSync(spec, 'utf8')}`);
    const stage = mkdtempSync(join(tmpdir(), 'lib2b-stage-')); tmps.push(stage);
    const { layersSpecOf } = await import(/* @vite-ignore */ F.url(r, 'tools/plates/library/layers-spec.mjs'));
    const s = layersSpecOf(F.BATCH, { stageDir: stage });
    const planted = readFileSync(s.files['library/tools/plates/library/eq/planted.mjs'], 'utf8');
    expect(planted).toContain("from '../../../../../engine/body.mjs'");
    expect(readFileSync(s.files['exercises/cable_lateral_raise.mjs'], 'utf8')).toContain("from '../library/tools/plates/library/eq/planted.mjs'");
  });
});

/** D-LIB2b-REVIEW-1: every shipped library row to check, with the tree it lives in: the repo's own LIBRARY rows
 *  (none until a batch ships), then the E1 tree's row, which is asserted present so the checks never run on nothing. */
async function libraryCases() {
  const reg = await import(/* @vite-ignore */ turl('tools/plates/library/registry.mjs'));
  const tree = reg.shippedRows(reg.rows()).filter((r: any) => r.mode !== 'golden');
  expect(tree.map((r: any) => r.id)).toEqual([F.ID]);
  const repo = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
  return [...LIBRARY.map(row => ({ base: repo, row: row as any })), ...tree.map((row: any) => ({ base: root, row }))];
}

/** HT8-A1's checks on one shipped library row in `base`: its committed feel-<chromeId>.ts section === feelSectionOf(its
 *  pinned page); the rest map, each row's watch and pain marks and the legend are golden B's renderer output from that
 *  row's own How-to feel spec; no is-playing or is-focus. Throws on the first failed check. */
async function feelChecks(base: string, row: any) {
  const feel = await import(/* @vite-ignore */ F.url(base, 'tools/plates/gen/feel.mjs'));
  const content = await import(/* @vite-ignore */ F.url(base, 'tools/plates/gen/content.mjs'));
  const fm = (await feel.renderAll()).fm, pre = row.chromeId, page = readFileSync(join(base, row.pages.layers), 'utf8');
  const text = readFileSync(join(base, `src/howto/generated/feel-${pre}.ts`), 'utf8');
  const section = JSON.parse(text.match(/\n {2}section: (".*"),\n/)![1]!) as string;
  expect(section === feel.feelSectionOf(page, pre), `${row.id}: section`).toBe(true);
  const Fs = (await content.loadContent(row.id)).content.feel;
  const rest = fm.renderFeelMap({ primary: Fs.primary, secondary: Fs.secondary, views: ['front', 'back'], id: `${pre}-feel`, shimmer: true });
  expect(section).toContain(`data-feel-map id="${pre}-feel-map" data-rest-label="${rest.label}">`);
  let marks = 0;
  for (const r of Fs.rows) {
    const watch = (r.at?.muscles ?? []).filter((m: string) => Fs.watch.some((w: any) => w.muscleId === m) && !Fs.primary.some((p: any) => p.muscleId === m)), pain = r.at?.parts ?? [];
    if (!watch.length && !pain.length) { expect(section.includes(`<g class="feel-mark" data-row="${r.key}">`), `${row.id}/${r.key}`).toBe(false); continue; }
    const m = fm.renderFeelMap({ primary: Fs.primary, secondary: Fs.secondary, avoid: watch, pain, views: ['front', 'back'], id: `${pre}-feel-${r.key}`, shimmer: false });
    m.svg.split('</figure>').slice(0, 2).forEach((v: string) => {
      const w = v.match(/<g class="feel-watch">[\s\S]*?<\/g>/)?.[0] ?? '', p = v.match(/<g class="feel-pain">[\s\S]*?<\/g>/)?.[0] ?? '';
      if (w || p) { marks++; expect(section, `${row.id}/${r.key}`).toContain(`<g class="feel-mark" data-row="${r.key}">${w.replace('class="feel-watch"', 'class="feel-quiet"')}${p}${w}</g>`); }
    });
  }
  expect(marks, row.id).toBeGreaterThan(0);
  const lg = fm.renderFeelLegend({ avoid: true }).replace(/<span>(<svg class="feel-sw sw-watch)/, '<span class="lg-watch" hidden>$1');
  expect(section).toContain(lg.replace(/<\/div>$/, ''));
  expect(section).not.toMatch(/is-playing|is-focus|feel-mark on/);
  expect(section.replace('stop-opacity="0.62"', 'stop-opacity="0.63"') === feel.feelSectionOf(page, pre)).toBe(false);
}

describe('D-LIB2b-FEEL: a library feel chunk passes the HT8-A1 checks the 8 get', { timeout: 180_000 }, () => {
  it('for the repo\'s shipped library rows and the E1 tree\'s: section === feelSectionOf(its pinned page); rest map, every row\'s marks and the legend are golden B\'s renderer output; no is-playing', async () => {
    const cases = await libraryCases();
    expect(cases.at(-1)!.row.id).toBe(F.ID);
    for (const { base, row } of cases) await feelChecks(base, row);
  });
  it('failure path: one row\'s mark moved to another muscle in the How-to source, without a page rebuild, is red', async () => {
    const m = mkdtempSync(join(tmpdir(), 'lib2b-feel-')); tmps.push(m);
    cpSync(root, m, { recursive: true, verbatimSymlinks: true });
    const p = join(m, F.HOWTO), s = readFileSync(p, 'utf8'), from = "at: { muscles: ['upper_traps'] }";
    expect(s.split(from)).toHaveLength(2);
    writeFileSync(p, s.replace(from, "at: { muscles: ['lower_back'] }"));
    const row = (await libraryCases()).at(-1)!.row;
    await expect(feelChecks(m, row)).rejects.toThrow(`${F.ID}/traps`);
  });
});

describe('E7: QA node-half gate', { timeout: 180_000 }, () => {
  it('only the browser-half keys are ignored: browser:not-run in PQ-H1/H4/H5 and F2/F5 "browser checks not run"', async () => {
    const { nodeHalf } = await import(/* @vite-ignore */ url('tools/plates/library/candidate.mjs'));
    const hard = (h: string, key: string) => ({ ...Object.fromEntries(['PQ-H1', 'PQ-H2', 'PQ-H4', 'PQ-H5'].map(k => [k, { pass: true, problems: [] }])), [h]: { pass: false, problems: [{ key, text: key }] } });
    const flags = (why: string) => ({ F2: { raised: true, blocks: true, why }, F5: { raised: true, blocks: false } });
    expect(nodeHalf({ hard: hard('PQ-H1', 'browser:not-run'), flags: flags('browser checks not run') }).ok).toBe(true);
    expect(nodeHalf({ hard: hard('PQ-H2', 'browser:not-run'), flags: flags('browser checks not run') }).ok).toBe(false);
    expect(nodeHalf({ hard: hard('PQ-H4', 'H4:other'), flags: flags('browser checks not run') }).ok).toBe(false);
    expect(nodeHalf({ hard: hard('PQ-H1', 'browser:not-run'), flags: flags('measured 3 px') }).ok).toBe(false);
  });
  it('candidateOf for each of the 8 is approved.mjs candidatesOf\'s entry; mode P and a missing view throw naming the id', async () => {
    const cand = await import(/* @vite-ignore */ url('tools/plates/library/candidate.mjs'));
    const appr = await import(/* @vite-ignore */ url('tools/plates/library/qa/approved.mjs'));
    const eng = await import(/* @vite-ignore */ url('tools/plates/library/qa/engine.mjs'));
    const golden = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const mirror = golden.makeMirror();
    try {
      const E = await eng.loadEngine(mirror), html = appr.goldenHtml(), all = await appr.candidatesOf(html, E);
      expect(all).toHaveLength(8);
      // functions (spec equipment, renderers) are fresh per import, so the shapes are compared without them
      for (const c of all) expect(JSON.stringify(await cand.candidateOf(c.id, { platesHtml: html, engine: E }))).toBe(JSON.stringify(c));
      const row = { id: 'lib_x', chromeId: 'x', mode: 'P', batchFile: 'b.json' };
      await expect(cand.candidateOf('lib_x', { platesHtml: html, engine: E, all: [row] })).rejects.toThrow("candidate: lib_x (b.json): mode 'P' has no candidate rule yet");
      await expect(cand.candidateOf('lib_x', { platesHtml: html, engine: E, all: [{ ...row, mode: 'H', chromeId: 'pull-up' }] })).rejects.toThrow('candidate: lib_x (b.json): no census view');
    } finally { eng.dropMirror(mirror); }
  });
  it('the clone passes the node half; its candidate carries every field from its own sources', async () => {
    const cand = await import(/* @vite-ignore */ turl('tools/plates/library/candidate.mjs'));
    const bg = await import(/* @vite-ignore */ turl('tools/plates/library/batch-golden.mjs'));
    const reg = await import(/* @vite-ignore */ turl('tools/plates/library/registry.mjs'));
    const golden = await import(/* @vite-ignore */ turl('tools/plates/golden.mjs'));
    const eng = await import(/* @vite-ignore */ turl('tools/plates/library/qa/engine.mjs'));
    const plates = await import(/* @vite-ignore */ turl('tools/plates/gen/plates.mjs'));
    const all = reg.rows(), row = all.find((r: any) => r.id === F.ID), mirror = golden.makeMirror();
    try {
      const E = await eng.loadEngine(mirror), html = await bg.platesPage(row, all);
      const c = await cand.candidateOf(F.ID, { platesHtml: html, engine: E, all });
      expect([c.mode, c.chromeId, c.census, c.mistakeFault, c.derivation, c.exemptions]).toEqual(['H', 'cable-lateral-raise', { view: 'side' }, 'kick', null, []]);
      expect(c.research.topFault).toBe('kick');
      expect(c.research.plateFacts).toHaveLength(1);
      expect(c.article).toContain('id="card-cable-lateral-raise"');
      expect(c.spec.callouts.length).toBeGreaterThan(0);
      const report = await plates.gateNodeHalf(row, html, E, all);
      expect(report.ok).toBe(true);
      expect(report.ms).toBeGreaterThan(0);
      console.log(`LIB-2b QA node half for ${F.ID}: ${report.ms} ms`);
    } finally { eng.dropMirror(mirror); }
  }, 300_000);
});

/** D-LIB2b-PAGES (7): tests/howto/golden/library holds exactly the batch golden files plus one pinned page per batch
 *  whose latest `layers-page` entry exists, and each batch file's pages.layers names that page. Returns the problems. */
export function libraryGoldenProblems(base: string): string[] {
  const dir = join(base, 'tests/howto/golden/library'), batchDir = join(base, 'tools/plates/library/batches');
  const batches = existsSync(batchDir) ? readdirSync(batchDir).filter(n => n.endsWith('.json')) : [];
  const files = existsSync(dir) ? readdirSync(dir).sort() : [], want: string[] = [], bad: string[] = [];
  for (const b of batches) {
    const data = JSON.parse(readFileSync(join(batchDir, b), 'utf8'));
    if (!existsSync(join(dir, b))) continue;
    want.push(b);
    const entries = JSON.parse(readFileSync(join(dir, b), 'utf8')).entries as any[];
    const pin = [...entries].reverse().find(e => e.kind === 'layers-page');
    if (!pin) continue;
    const page = `${b.replace(/\.json$/, '')}.layers.html`;
    want.push(page);
    if (data.pages?.layers !== `tests/howto/golden/library/${page}`) bad.push(`${b}: pages.layers is not tests/howto/golden/library/${page}`);
    if (!existsSync(join(dir, page))) { bad.push(`${page}: pinned but missing`); continue; }
    const bytes = readFileSync(join(dir, page));
    if (sha(bytes) !== pin.pageSha256 || bytes.length !== pin.bytes) bad.push(`${page}: sha256 or bytes differ from its layers-page entry`);
  }
  for (const f of files) if (!want.includes(f)) bad.push(`${f}: not a batch golden file or a pinned page`);
  return bad;
}

describe('D-LIB2b-PAGES (7): the library golden folder holds only batch golden files and their pinned pages', () => {
  it('the repo and the E1 tree are clean', () => {
    expect(libraryGoldenProblems(new URL('../../', import.meta.url).pathname)).toEqual([]);
    expect(libraryGoldenProblems(root)).toEqual([]);
    expect(readdirSync(join(root, 'tests/howto/golden/library')).sort()).toEqual(['zz-lib2b.json', 'zz-lib2b.layers.html']);
  });
  it('an unpinned page is red; a pin without its page is red', () => {
    const a = mkdtempSync(join(tmpdir(), 'lib2b-gold-')); tmps.push(a);
    cpSync(join(root, 'tests'), join(a, 'tests'), { recursive: true }); cpSync(join(root, 'tools/plates/library/batches'), join(a, 'tools/plates/library/batches'), { recursive: true });
    writeFileSync(join(a, 'tests/howto/golden/library/stray.layers.html'), 'x');
    expect(libraryGoldenProblems(a)).toEqual(['stray.layers.html: not a batch golden file or a pinned page']);
    rmSync(join(a, 'tests/howto/golden/library/stray.layers.html')); rmSync(join(a, 'tests/howto/golden/library/zz-lib2b.layers.html'));
    expect(libraryGoldenProblems(a)).toEqual(['zz-lib2b.layers.html: pinned but missing']);
  });
});

describe('D-LIB2b-PINS (11): HT2-A1 and the class-map check for each shipped library row', { timeout: 180_000 }, () => {
  it('for the repo\'s shipped library rows and the E1 tree\'s: its ht- plate strings are the plate cut from its batch plates page, whose fragments === the batch golden plate entry; no plate or plate-fit class', async () => {
    const cases = await libraryCases();
    expect(cases.at(-1)!.row.id).toBe(F.ID);
    for (const { base, row } of cases) {
      const reg = await import(/* @vite-ignore */ F.url(base, 'tools/plates/library/registry.mjs'));
      const bg = await import(/* @vite-ignore */ F.url(base, 'tools/plates/library/batch-golden.mjs'));
      const golden = await import(/* @vite-ignore */ F.url(base, 'tools/plates/golden.mjs'));
      const all = reg.rows();
      const p = golden.extractPlates(await bg.platesPage(row, all)).find((x: any) => x.chromeId === row.chromeId), e = bg.pinOf(row, 'plate');
      expect(golden.fragmentsOf(p), row.id).toEqual(e.fragments);
      for (const k of ['src', 'slug', 'prefix', 'chromeId']) expect(e[k], `${row.id}.${k}`).toBe(row[k]);
      const text = readFileSync(join(base, `src/howto/generated/ht-${row.slug}.ts`), 'utf8');
      const strings = { normalSvg: p.normal.svg, normalOverlay: p.normal.overlay, mistakeSvg: p.mistake.svg, mistakeOverlay: p.mistake.overlay, tells: p.tells, tempo: p.tempo };
      for (const [k, s] of Object.entries(strings) as [string, string][]) {
        expect(text.includes(JSON.stringify(s)), `${row.id}.${k} ships verbatim`).toBe(true);
        const tokens = [...s.matchAll(/class="([^"]*)"/g)].flatMap(m => m[1]!.split(/\s+/).filter(Boolean));
        expect(tokens.length, `${row.id}.${k}`).toBeGreaterThan(0);
        expect(tokens.filter(t => t === 'plate' || t === 'plate-fit'), `${row.id}.${k}`).toEqual([]);
        expect(s).not.toContain('ht-plate');
      }
      const changed = { ...p, tells: `${p.tells} ` };
      expect(golden.fragmentsOf(changed)).not.toEqual(e.fragments);
    }
  });
});

describe('D-LIB2b-HANDCSS: a library row\'s HAND loader brings in its zoom css before its shared hand pair', () => {
  it('for the repo\'s shipped library rows and the E1 tree\'s: one HAND line, zoom-<chromeId>.css then handpair-<key>; the pair chunk imports nothing; no hand-<chromeId>.ts', async () => {
    const cases = await libraryCases();
    expect(cases.at(-1)!.row.id).toBe(F.ID);
    for (const { base, row } of cases) {
      const c = row.chromeId, { key, problems } = handLineProblems(readFileSync(join(base, 'src/howto/generated/loaders.ts'), 'utf8'), c);
      expect(problems, row.id).toEqual([]);
      expect(existsSync(join(base, `src/slices/howto/css/zoom-${c}.css`)), row.id).toBe(true);
      expect(readFileSync(join(base, `src/howto/generated/handpair-${key}.ts`), 'utf8')).not.toMatch(/\bimport\b/);
      expect(existsSync(join(base, `src/howto/generated/hand-${c}.ts`)), row.id).toBe(false);
    }
  });
  it('the 8\'s loaders.ts lines are unchanged by a library row: the tree\'s lines minus the library rows\' are the repo\'s (header aside)', () => {
    const lib = [...LIBRARY, { id: F.ID, chromeId: 'cable-lateral-raise' }];
    const mine = (l: string) => lib.some(r => l.includes(`"${r.chromeId}":`) || l.startsWith(`  ${r.id}:`) || l.includes(`  ${JSON.stringify(r.id)},`));
    const of = (t: string) => t.split('\n').slice(1).filter(l => !mine(l));
    const repo = of(readFileSync(new URL('../../src/howto/generated/loaders.ts', import.meta.url), 'utf8'));
    const tree = of(readFileSync(join(root, 'src/howto/generated/loaders.ts'), 'utf8'));
    expect(tree.length).toBeGreaterThan(40);
    expect(tree).toEqual(repo);
  });
  it('failure path: a HAND line without the css, or with the css after the pair, is red', () => {
    const t = readFileSync(join(root, 'src/howto/generated/loaders.ts'), 'utf8');
    const line = `"cable-lateral-raise": () => import('../../slices/howto/css/zoom-cable-lateral-raise.css').then(() => import('./handpair-lib2b-scratch')),`;
    expect(t).toContain(line);
    expect(handLineProblems(t.replace(line, `"cable-lateral-raise": () => import('./handpair-lib2b-scratch'),`), 'cable-lateral-raise').problems).toHaveLength(1);
    expect(handLineProblems(t.replace(line, `"cable-lateral-raise": () => import('./handpair-lib2b-scratch').then(m => import('../../slices/howto/css/zoom-cable-lateral-raise.css').then(() => m)),`), 'cable-lateral-raise').problems).toHaveLength(1);
    expect(handLineProblems(t, 'cable-lateral-raise')).toEqual({ key: 'lib2b-scratch', problems: [] });
  });
});
