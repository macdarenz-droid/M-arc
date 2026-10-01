// HT-10 (card HT-10; D-HT10-A5b): the body of gate block HT-10, as a module, so that `npm run gate` (the block in
// scripts/screenshot-gate.mjs) and the ht10-gate job (scripts/ht10-gate.mjs) run the same code over the same tuples.
// See the block's comment in scripts/screenshot-gate.mjs for what it checks. Build and gate time only; never bundled.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

/** The tuples this run proves: HT-10's full list, cut to MARC_HT_SHARD's shard when it is set. */
export async function ht10RunTuples(env = process.env) {
  const H = await import('./harness.mjs');
  const S = await import('./shard.mjs');
  const shard = S.shardFromEnv(env);
  return { shard, tuples: S.htShard(shard.k, shard.N)(await H.ht10AllTuples()) };
}

/**
 * Runs HT-10 against the app served on `PORT`, pushing every problem onto `errors` and writing the proof manifest to
 * `OUT`/ht10-proof.json. `clock` is the gate's line clock (the full gate's HT block times); the runner passes its own.
 */
export async function runHt10({ errors, OUT, PORT, clock }) {
  const ht10Clock = clock;
  const tag = 'HT-10';
  const t0 = Date.now();
  const errorsBefore = errors.length;
  const H = await import('./harness.mjs');
  const S = await import('./shard.mjs');
  const { gzipSync } = await import('node:zlib');
  const { existsSync } = await import('node:fs');
  const assetsDir = join(ROOT, 'www/assets');
  // final numbers (D-HT3, recorded by HT-10): measured on CI + margin, never above plan 2.9's 400 ms
  const TAP_CEIL_MS = 400;
  const SHIMMER_RATIO = 1.2, S0_MAX = 700, LONG_TASK_MS = 100;
  // D-HT10-A4: the total How-to asset ceiling, measured + 10 %, in tests/howto/budgets.json (totals)
  const TOTAL = JSON.parse(readFileSync(join(ROOT, 'tests/howto/budgets.json'), 'utf8')).totals?.find(t => t.chunk === 'How-to total');
  if (!TOTAL) throw new Error(`${tag}: no "How-to total" entry in tests/howto/budgets.json totals`);
  const TOTAL_RAW = TOTAL.rawMax, TOTAL_GZ = TOTAL.gzMax;
  const SHARD_BUDGET_S = 25 * 60;
  const expectRisks = existsSync(join(ROOT, 'src/slices/howto/sections/Risks.tsx'));
  const ids = H.HT_PLATES.map(p => p[0]);
  const { shard, tuples } = await ht10RunTuples();
  const want = (state, theme) => tuples.filter(t => t.state === state && (!theme || t.theme === theme));
  const failed = new Set();
  const key = (id, theme, state) => `${id}|${theme}|${state}`;
  const fail = (id, theme, state, m) => { failed.add(key(id, theme, state)); errors.push(`${tag} ${m}`); };
  const owner = (state, theme, m) => ids.find(id => m.includes(` ${id}`)) ?? '*';
  const facts = {};
  const ht10 = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : { channel: 'chromium' }), args: ['--no-sandbox', '--disable-lcd-text', '--disable-features=OverscrollHistoryNavigation,TouchpadOverscrollHistoryNavigation'] });
  try {
    const crashed = (where, e) => ({ problems: [`${where}: crashed: ${e.message.split('\n')[0]}`], stats: {} });

    // A3 first, alone, so nothing else competes for the CPU it measures
    if (want('speed').length) {
      const sp = await H.ht10Speed(ht10, PORT, { goldenB: readFileSync(join(ROOT, 'tools/plates/layers/artifact/technical-plates.html')) }).catch(e => crashed('speed', e));
      const F = m => fail('*', 'silent-black', 'speed', `A3: ${m}`);
      for (const p of sp.problems) F(p);
      if (sp.tap) {
        if (sp.early.length) F(`How-to chunk(s) requested before Train was idle: ${sp.early.join(', ')}`);
        if (sp.tap.median > TAP_CEIL_MS) F(`tap-to-plate median ${sp.tap.median} ms (samples ${sp.tap.samples.join(', ')}), over ${TAP_CEIL_MS} ms`);
        if (sp.longTasks.some(d => d > LONG_TASK_MS)) F(`long task(s) over ${LONG_TASK_MS} ms while opening: ${sp.longTasks.join(', ')} ms`);
        if (!sp.control.some(d => d >= 150)) F(`the synthetic 150 ms task in an open was not caught (long tasks seen: ${sp.control.join(', ') || 'none'})`);
        if (!(sp.s0 > 0 && sp.s0 <= S0_MAX)) F(`${sp.s0} elements in the sheet at S0 with everything mounted (max ${S0_MAX})`);
        if (sp.shimmer) {
          const ratio = sp.shimmer.app.median / sp.shimmer.golden.median;
          if (!(sp.shimmer.golden.median >= 20)) F(`the golden-B shimmer measured ${sp.shimmer.golden.median} ms, too little to compare against (${JSON.stringify(sp.shimmer.golden)})`);
          else if (!(ratio <= SHIMMER_RATIO)) F(`shimmer TaskDuration app ${sp.shimmer.app.median} ms vs golden B ${sp.shimmer.golden.median} ms (ratio ${ratio.toFixed(2)}, max ${SHIMMER_RATIO})`);
          facts.shimmer = `shimmer app ${sp.shimmer.app.median} ms (tap ${sp.shimmer.app.runs.join('/')}, idle ${sp.shimmer.app.idle.join('/')}) vs golden B ${sp.shimmer.golden.median} ms (tap ${sp.shimmer.golden.runs.join('/')}, idle ${sp.shimmer.golden.idle.join('/')}), ratio ${ratio.toFixed(2)}`;
        } else if (existsSync(join(ROOT, 'src/slices/howto/sections/Feel.tsx'))) F('the feel section is registered but the shimmer was not measured');
        facts.speed = `tap-to-plate median ${sp.tap.median} ms (samples ${sp.tap.samples.join(', ')}; ceiling ${TAP_CEIL_MS}), long tasks ${sp.longTasks.join(', ') || 'none'}, 150 ms control caught as ${sp.control.join(', ')} ms, S0 ${sp.s0} elements, ${sp.early.length} early requests`;
      }
    }

    // A1 sweeps and C11, then A2: each theme's tuples in its own context, the themes side by side
    const runTheme = async theme => {
      const sw = want('sweep', theme).map(t => t.id), rd = want('reduced', theme).map(t => t.id);
      const out = [];
      if (sw.length) out.push(['sweep', await H.ht10Sweep(ht10, PORT, theme, { ids: sw, expectRisks }).catch(e => crashed(`sweep ${theme}`, e))]);
      if (rd.length) out.push(['reduced', await H.ht10Sweep(ht10, PORT, theme, { ids: rd, reduced: true, expectRisks }).catch(e => crashed(`reduced ${theme}`, e))]);
      return [theme, out];
    };
    const sweeps = await Promise.all(H.HT_THEMES.map(runTheme));
    const tot = { steps: 0, probes: 0, controls: 0, named: 0, anims: 0, exempt: new Set() };
    for (const [theme, out] of sweeps) for (const [state, r] of out) {
      for (const p of r.problems) fail(owner(state, theme, p), theme, state, `A1 ${state}: ${p}`);
      for (const k of ['steps', 'probes', 'controls', 'named', 'anims']) tot[k] += r.stats[k] ?? 0;
      r.stats.exempt?.forEach(x => tot.exempt.add(x));
    }
    const a2Themes = H.HT_THEMES.filter(th => want('a2', th).length);
    let a2Pairs = 0;
    if (a2Themes.length) {
      const src = H.ht10Script.toString();
      // the script's own failures are the sweep's to report (A1); here it only has to run, so L3 still compares after it
      // eslint-disable-next-line no-new-func
      const mutate = new Function('pre', `return (${src})(pre).then(() => {})`);
      // one side-by-side run over every theme with A2 tuples; a theme's plates are the ids with an A2 tuple in it
      const plates = H.HT_PLATES.filter(p => a2Themes.some(th => want('a2', th).some(t => t.id === p[0])));
      const a2 = await H.ht3Fidelity(ht10, PORT, { themes: a2Themes, full: [], widths: [], plates, mutate, markup: false }).catch(e => crashed('A2', e));
      a2Pairs = a2.stats.pairs ?? 0;
      for (const p of a2.problems) { const theme = H.HT_THEMES.find(th => p.startsWith(th)) ?? 'silent-black'; fail(owner('a2', theme, p), theme, 'a2', `A2 (after the full script): ${p}`); }
      if (a2Pairs < plates.length * a2Themes.length * 2) fail('*', 'silent-black', 'a2', `A2: only ${a2Pairs} plate pairs compared, expected ${plates.length * a2Themes.length * 2}`);
    }
    const minSteps = want('sweep').length * 15;
    if (tot.steps < minSteps) fail('*', 'silent-black', 'sweep', `A1: only ${tot.steps} script steps probed, expected at least ${minSteps}`);
    facts.sweep = `${want('sweep').length} sheets swept + ${want('reduced').length} under reduced motion: ${tot.steps} steps, ${tot.probes} probes, ${tot.controls} control boxes, ${tot.named} named AX nodes, ${tot.anims} animations recorded, exempt pairs seen ${[...tot.exempt].join(', ') || 'none'}; A2 ${a2Pairs} plate pairs after the script`;

    // golden: each exemption holds on the golden page itself
    if (want('golden').length) {
      const F = m => fail('*', 'silent-black', 'golden', `golden: ${m}`);
      const g = await H.openGolden(ht10, 'silent-black');
      try {
        // D-HT10-C10: every exemption measures its pinned value on the golden page, in its view
        for (const mode of ['normal', 'mistake']) {
          if (mode === 'mistake') await g.page.evaluate(ex => { for (const id of new Set(ex.filter(e => e.mode === 'mistake').map(e => e.ids[0].replace(/-m-.*$/, '')))) document.getElementById(`${id}-mistake`).click(); }, H.HT10_C10_EXEMPT);
          await g.page.waitForTimeout(300);
          const list = H.HT10_C10_EXEMPT.filter(e => e.mode === mode);
          const got = await g.page.evaluate(H.HT10_C10_MEASURE, list);
          list.forEach((e, i) => { if (!H.ht10ExemptMatches(e, got[i].m)) F(`C10 exemption ${e.ids.join(' / ')} (${e.kind}) measures ${JSON.stringify(got[i].m)} on the golden page, not its pinned ${e.w} x ${e.h}`); });
        }
      } finally { await g.ctx.close(); }
      const gf = H.ht10CssProblems(readFileSync(H.GOLDEN_PAGE, 'utf8'), 'golden').frames;
      for (const [name, props] of Object.entries(H.HT10_C18_EXEMPT)) if (JSON.stringify(gf[name]) !== JSON.stringify(props)) F(`C18 exemption @keyframes ${name} (${props}) is not the golden page's (${gf[name] ?? 'absent'})`);
    }

    // A4: the built assets
    if (want('assets').length) {
      const F = m => fail('*', 'silent-black', 'assets', `A4: ${m}`);
      const htFiles = readdirSync(assetsDir).filter(f => /^(HowToSheet-|ht-|hand-|feel-|posture-|zoom-)[\w-]+\.(js|css)$/.test(f));
      const js = htFiles.filter(f => f.endsWith('.js')), css = htFiles.filter(f => f.endsWith('.css'));
      if (js.filter(f => f.startsWith('ht-')).length !== ids.length || js.filter(f => f.startsWith('hand-')).length !== ids.length) F(`expected ${ids.length} ht- and hand- chunks, found ${js.join(', ')}`);
      let raw = 0, gz = 0;
      for (const f of htFiles) { const b = readFileSync(join(assetsDir, f)); raw += b.length; gz += gzipSync(b).length; }
      if (raw > TOTAL_RAW || gz > TOTAL_GZ) F(`all How-to assets are ${raw} B raw / ${gz} B gz, over ${TOTAL_RAW} / ${TOTAL_GZ}`);
      facts.assets = `${htFiles.length} How-to files, ${raw} B raw / ${gz} B gz of ${Math.floor(TOTAL_RAW)} / ${TOTAL_GZ}`;
      // C17: the shared checker on every How-to JS chunk, plus no <a>, no target=, every href starting with #
      const { pathToFileURL } = await import('node:url');
      const { mkdtempSync, copyFileSync, rmSync } = await import('node:fs');
      const { tmpdir } = await import('node:os');
      const { build } = await import('esbuild');
      const c17 = await build({ entryPoints: [join(ROOT, 'tests/howto/checks/c17.ts')], bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent' });
      const dir = mkdtempSync(join(tmpdir(), 'ht10-c17-')), scan = join(dir, 'scan');
      try {
        mkdirSync(scan);
        writeFileSync(join(dir, 'c17.mjs'), c17.outputFiles[0].text);
        const { checkC17 } = await import(pathToFileURL(join(dir, 'c17.mjs')).href);
        for (const f of js) copyFileSync(join(assetsDir, f), join(scan, f));
        for (const m of checkC17([scan])) F(`C17: ${m}`);
      } finally { rmSync(dir, { recursive: true, force: true }); }
      for (const f of htFiles) {
        const s = readFileSync(join(assetsDir, f), 'utf8');
        if (/<a[\s/>]/.test(s)) F(`C17: ${f} has an <a> tag`);
        if (/\btarget\s*=/.test(s)) F(`C17: ${f} has a target= attribute`);
        for (const m of s.matchAll(/\bhref=(["'])(.*?)\1/g)) if (!m[2].startsWith('#')) F(`C17: ${f} has href="${m[2].slice(0, 60)}"`);
      }
      for (const f of [...css, ...js]) for (const m of H.ht10CssProblems(readFileSync(join(assetsDir, f), 'utf8'), f).problems) F(m);
      // the main chunk holds no section's code (HT-3b's footprint probe covers generated strings; these are the class hooks)
      const indexJs = readFileSync(join(ROOT, 'www/index.html'), 'utf8').match(/src="\.\/assets\/(index-[\w-]+\.js)"/)[1];
      const idx = readFileSync(join(assetsDir, indexJs), 'utf8');
      for (const s of ['plate-svg', 'u-stroke', 'feel-band', 'data-feel-map', 'zx-chip', 'zx-page', 'st-show', 'ht-disclaimer']) if (idx.includes(s)) F(`${indexJs} contains "${s}"`);
    }
    if (want('build-b').length) {
      const b = await H.ht10BuildB(ht10, PORT).catch(e => crashed('build B', e));
      for (const p of b.problems) fail('*', 'silent-black', 'build-b', `A4 ${p}`);
      facts.buildB = `build B carried over ${b.kinds?.join(', ') ?? 'nothing'}`;
    }

    // fixtures: each check must fail on a seeded defect (M10-M12 are HT-9's C19 fixtures)
    if (want('fixtures').length) {
      const F = m => fail('*', 'silent-black', 'fixtures', `fixtures: ${m}`);
      const c19 = H.ht10C19Inputs();
      const { ctx, page } = await H.openAppTrain(ht10, PORT, 'silent-black').catch(e => ({ ctx: null, page: null, err: e }));
      if (!ctx) F('crashed: could not open the app');
      else try {
        const probe = () => page.evaluate(H.ht10DomProbe, [H.HT10_C10_EXEMPT, c19.pats, c19.words, c19.disclaimer, expectRisks, false]);
        const fx = [
          ['M10 (stub source section)', () => { const s = document.createElement('section'); s.dataset.section = 'ht10-m10'; s.innerHTML = '<details class="srcs" open><summary>Sources</summary><a href="https://example.org/x" target="_blank">Ref</a> <span class="ev ev-data">Measured</span></details>'; document.querySelector('dialog.sheet.ht [data-section]:last-of-type').after(s); }, [/<a> element/, /\[target\]/, /source\/evidence element/, /"Measured"/, /matches/]],
          ...(expectRisks ? [
            ['M11 (disclaimer above Risks)', () => { const d = document.querySelector('dialog.sheet.ht .ht-disclaimer'); document.querySelector('dialog.sheet.ht .redflag').before(d); }, [/not after the last \.redflag/]],
            ['M12 (disclaimer deleted)', () => document.querySelector('dialog.sheet.ht .ht-disclaimer').remove(), [/0 \.ht-disclaimer/]],
          ] : []),
          ['C10 (a 30 px button)', () => { const b = document.createElement('button'); b.id = 'ht10-small'; b.textContent = 'x'; b.style.cssText = 'width:30px;height:30px'; document.querySelector('dialog.sheet.ht [data-section]').append(b); }, [/#ht10-small is 30\.000 x 30\.000/]],
          ['C10 (an exempt tell 1 px wider than its golden pin)', () => { document.getElementById('lateral-raise-mistake').click(); const d = document.getElementById('lateral-raise-m-dip'); d.style.width = `${d.getBoundingClientRect().width + 1}px`; }, [/#lateral-raise-m-dip is 33\.078 x 44\.000 .*not its pinned golden/]],
          ['C10 (two overlapping buttons)', () => { const w = document.createElement('div'); w.style.position = 'relative'; w.innerHTML = '<button id="ht10-o1" style="width:60px;height:60px">a</button><button id="ht10-o2" style="position:absolute;left:20px;top:20px;width:60px;height:60px">b</button>'; document.querySelector('dialog.sheet.ht [data-section]').append(w); }, [/#ht10-o1 and #ht10-o2 overlap/]],
        ];
        for (const [name, inject, expect] of fx) {
          await H.openHowTo(page, 0);
          await page.evaluate(inject);
          const { problems } = await probe();
          for (const re of expect) if (!problems.some(p => re.test(p))) F(`${name}: the probe did not report ${re} (it reported ${problems.slice(0, 4).join('; ') || 'nothing'})`);
          await H.closeHowTo(page);
        }
        // TalkBack: a nameless button
        await H.openHowTo(page, 0);
        await page.evaluate(() => { const b = document.createElement('button'); b.className = 'ht10-noname'; b.style.cssText = 'width:44px;height:44px'; document.querySelector('dialog.sheet.ht [data-section]').append(b); });
        const cdp = await ctx.newCDPSession(page);
        await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
        const ax = await H.ht10AxNames(cdp);
        if (!ax.problems.some(p => /button button\.ht10-noname has no accessible name/.test(p))) F(`TalkBack: a nameless button was not reported (${ax.problems.join('; ') || 'nothing'})`);
        await H.closeHowTo(page);
        // C18 / C12: a width animation and an endless one on the sheet
        await H.openHowTo(page, 0);
        await page.evaluate(H.ht10Record);
        await page.evaluate(() => { const e = document.querySelector('dialog.sheet.ht .ht-golden'); e.animate([{ width: '300px' }, { width: '310px' }], 400); e.animate([{ opacity: 1 }, { opacity: 0.9 }], { duration: 400, iterations: Infinity }); });
        await page.waitForTimeout(200);
        const recd = await H.ht10Recorded(page);
        const am = H.ht10AnimProblems(recd, H.ht10EndMs());
        if (!H.ht10AnimProblems(recd, H.ht10EndMs(), true).some(p => /^C11: 2 animation\(s\) under reduced motion/.test(p))) F('C11: a width animation and an endless fade were not both reported under reduced motion');
        if (!am.some(p => /^C18: .*animates width/.test(p))) F(`C18: a width animation was not reported (${am.join('; ') || 'nothing'})`);
        if (!am.some(p => /^C12: .*never ends/.test(p))) F(`C12: an endless animation was not reported (${am.join('; ') || 'nothing'})`);
        await page.evaluate(() => document.querySelector('dialog.sheet.ht .ht-golden').getAnimations().forEach(a => a.cancel()));
        await H.closeHowTo(page);
      } catch (e) { F(`crashed: ${e.message.split('\n')[0]}`); } finally { await ctx.close(); }
    }
  } finally {
    await ht10.close();
  }

  // proof manifest (library plan 5.4): one row per tuple this run proved
  const sha = (process.env.GITHUB_SHA || '').slice(0, 40) || (await import('node:child_process')).execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
  const CHECK = { sweep: 'C10 C12 C18 C19 TalkBack S0', reduced: 'C11 C10 C19 TalkBack', a2: 'S0 L3', assets: 'C17 C18 C12 size', 'build-b': 'offline build B', fixtures: 'failure fixtures', golden: 'exemptions on golden', speed: 'A3 speed' };
  S.writeProof(join(OUT, 'ht10-proof.json'), { sha, shard, rows: tuples.map(t => ({ id: t.id, check: CHECK[t.state], state: t.state, theme: t.theme, width: 390, result: failed.has(key(t.id, t.theme, t.state)) || (t.id !== '*' && failed.has(key('*', t.theme, t.state))) ? 'fail' : 'pass' })) });

  // A5 (D-HT10-A5): each ht10-gate shard within 25 min; the full set (a local run) is logged with every HT block's time
  {
    const per = {};
    let prev = ht10Clock.t0;
    for (const [t, s] of ht10Clock.lines) { const m = /^(HT-\d+[a-z]?(?: C19)?)\b/.exec(s); if (m) per[m[1]] = (per[m[1]] ?? 0) + (t - prev); prev = t; }
    per[tag] = (per[tag] ?? 0) + (Date.now() - t0);
    const own = (Date.now() - t0) / 1000;
    facts.time = `HT blocks ${(Object.values(per).reduce((a, b) => a + b, 0) / 1000).toFixed(1)} s (${Object.entries(per).map(([k, v]) => `${k} ${(v / 1000).toFixed(1)}`).join(', ')})`;
    if (shard.N && own > SHARD_BUDGET_S) errors.push(`${tag} A5: shard ${shard.k + 1}/${shard.N} took ${own.toFixed(1)} s, over its ${SHARD_BUDGET_S} s budget (D-HT10-A5)`);
  }
  const n = errors.length - errorsBefore;
  console.log(`${tag}${shard.N ? ` (shard ${shard.k + 1}/${shard.N})` : ''}: ${tuples.length} tuples; ${Object.values(facts).join('; ')}; ${n ? `FAILED, ${n} problem(s) above` : 'all verified'}; ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
