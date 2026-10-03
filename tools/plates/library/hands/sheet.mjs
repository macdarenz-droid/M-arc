// LIB-7 pilot sheet for the hand pairs (hands/DESIGN.md §5): every distinct drawn picture at 390 px in Silent Black and
// Paper, beside its closest approved golden-B hand (curl -> lateral raise, pull -> lat pulldown, push -> chest press),
// with its ids, claims and flags. Writes <out>/hand-pairs.html and one full-page PNG per theme.
//   node tools/plates/library/hands/sheet.mjs <out dir> [--calibrate] [--plant plant.json] [--critic] [--chromium <path>]
// --critic leaves out the check results and the variant names (planted tiles would show in them).
// --calibrate mixes two approved golden-B pairs in as unlabelled tiles; the key goes to <out>/calibration-key.json, never
// onto the sheet. --plant applies defects in memory (never committed): [{ "id", "op": "swap" }] swaps the Right and
// Wrong poses of the id's first page, [{ "id", "op": "pose", "pose": {...} }] merges into its Right pose.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { closeupApi } from '../render/closeups.mjs';
import { CLOSEUP_OPTIONS } from '../render/closeups-8.mjs';
import { mergePose, esc } from '../render/closeup/common.mjs';
import { CONVENTIONS, indexOf, MODULES, pairSpec, renderPair, ROOT } from './pairs.mjs';
import { problemsOf, renderedPages } from './checks.mjs';
import { pageHtml } from './page.mjs';

const CLAIMS = JSON.parse(readFileSync(new URL('./claims.json', import.meta.url), 'utf8'));
const EX = join(ROOT, 'tools/plates/layers/exercises');
/** The approved golden-B hand pair SVG of one of the 8 (the LIB-6 renderer, proven === golden B). */
export async function approvedHand(id, page) {
  const mod = await import(pathToFileURL(join(EX, `${id}.howto.mjs`)).href), api = closeupApi(mod, CLOSEUP_OPTIONS[id]);
  const html = api.zoomSection ? api.zoomSection(mod.default.zooms.find(z => z.kind === 'hand')) : api.handZoom(page);
  const m = html.match(/<svg class="hand-svg"[\s\S]*?<\/svg>/);
  if (!m) throw new Error(`sheet: no hand svg in ${id}`);
  return m[0];
}
export const REFERENCE = { curl: ['dumbbell_lateral_raise', undefined], pull: ['lat_pulldown', 'p1'], push: ['machine_chest_press', undefined] };

/** Modules with planted defects (deep copies; the files are untouched). */
export function planted(mods, plants) {
  const copy = mods.map(m => ({ ...m, VARIANTS: structuredClone(m.VARIANTS ?? {}), IDS: structuredClone(m.IDS ?? {}) }));
  for (const p of plants) {
    const m = copy.find(x => x.IDS[p.id]);
    if (!m) throw new Error(`plant: ${p.id} is not drawn`);
    const cfg = m.IDS[p.id], v = `${cfg.variant}~plant-${p.id}`, V = structuredClone(m.VARIANTS[cfg.variant]);
    if (p.op === 'swap') { const F = V.faults[cfg.faults[0]], wrongPose = mergePose(V.right, F.pose); F.pose = V.right; V.right = wrongPose; }
    else if (p.op === 'pose') V.right = mergePose(V.right, p.pose);
    else throw new Error(`plant: unknown op ${p.op}`);
    m.VARIANTS[v] = V; cfg.variant = v;
  }
  return copy;
}

const refText = r => r.startsWith('ga:') ? `${r} (convention: ${CONVENTIONS[r]})` : `${r}: ${CLAIMS.claims[r] ?? '(unresolved)'}`;
/** Distinct pictures: ids whose pages draw identical SVGs (uid aside) share one tile. */
export function tiles(index) {
  const by = new Map();
  for (const id of index.drawn.keys()) {
    const s = pairSpec(id, index);
    const svgs = s.wrong.map(F => renderPair(id, { fault: F.key, uid: 'u', index }).svg).join('');
    const t = by.get(svgs) ?? { ids: [], spec: s };
    t.ids.push(id); by.set(svgs, t);
  }
  return [...by.values()];
}

export async function buildSheet({ calibrate = false, plants = [], critic = false, mods = MODULES } = {}) {
  const index = indexOf(planted(mods, plants));
  const refs = {};
  for (const [arch, [id, page]] of Object.entries(REFERENCE)) refs[arch] = await approvedHand(id, page);
  const rows = [], key = [];
  for (const [i, t] of tiles(index).entries()) {
    const s = t.spec, V = s.mod.VARIANTS[s.variant], { pages } = renderedPages(s.id, index);
    const problems = problemsOf(s, pages), flags = [...Object.values(V.claims ?? {}).flat(), ...s.wrong.flatMap(w => w.claims ?? [])].filter(r => r.startsWith('ga:'));
    const claimLines = [...new Set([...Object.values(V.claims ?? {}).flat(), ...s.wrong.flatMap(w => w.claims ?? []), ...t.ids.flatMap(id => index.drawn.get(id).cfg.claims ?? [])])].map(refText);
    rows.push(`<section class="tile"><h2>${i + 1}. ${critic ? esc(s.key) : `${esc(s.pair)} · ${esc(s.orientation)}`}</h2><p class="ids">${t.ids.map(esc).join(', ')}</p>`
      + pages.map(p => `<div class="hand-plate">${renderPair(s.id, { fault: p.fault.key, uid: `t${i}-${p.fault.key}`, index }).svg}</div>`).join('')
      + (refs[V.archetype] ? `<p class="lab">Closest approved (${esc(REFERENCE[V.archetype][0])})</p><div class="hand-plate ref">${refs[V.archetype].replace(/id="([^"]+)"/g, `id="r${i}-$1"`).replace(/#([a-z][\w-]*)/g, `#r${i}-$1`)}</div>` : '')
      + `<p class="lab">Flags</p><ul>${[...new Set(flags)].map(f => `<li>${esc(f)}</li>`).join('') || '<li>none</li>'}${(V.flags ?? []).map(f => `<li>${esc(f)}</li>`).join('')}<li>sizes: drawing values (D-LIB7-2); wrong angles: approved precedents (D-LIB7-5)</li></ul>`
      + (critic ? '' : `<p class="lab">Checks</p><p>${problems.length ? problems.map(esc).join('<br>') : 'G1-G9 ok'}</p>`)
      + `<details><summary>Claims</summary><ul>${claimLines.map(l => `<li>${esc(l)}</li>`).join('')}</ul></details></section>`);
  }
  if (calibrate) {
    for (const [n, [id, page]] of [['A', ['lat_pulldown', 'p2']], ['B', ['pull_up', 'p1']]]) {
      key.push({ tile: `Pair ${n}`, approved: `${id}${page ? `/${page}` : ''}` });
      const at = 1 + (n === 'A' ? Math.floor(rows.length / 3) : Math.floor(2 * rows.length / 3));
      rows.splice(at, 0, `<section class="tile"><h2>Pair ${n}</h2><div class="hand-plate">${(await approvedHand(id, page)).replace(/id="([^"]+)"/g, `id="c${n}-$1"`).replace(/#([a-z][\w-]*)/g, `#c${n}-$1`)}</div></section>`);
    }
  }
  const css = `.tile{border-top:1px solid var(--line);padding:12px 0}.tile h2{font-size:15px;margin:0 0 4px}.ids,.lab{font-size:12px;color:var(--text-2);margin:6px 0}
ul{font-size:12px;padding-left:18px;margin:4px 0}details{font-size:12px}.ref{opacity:.95}`;
  return { body: `<h1 style="font-size:18px">Hand pairs (LIB-7)</h1><style>${css}</style>${rows.join('')}`, key };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2), out = resolve(args[0] ?? 'out/lib7-sheet');
  const plantAt = args.indexOf('--plant'), chrAt = args.indexOf('--chromium');
  const plants = plantAt >= 0 ? JSON.parse(readFileSync(args[plantAt + 1], 'utf8')) : [];
  const { body, key } = await buildSheet({ calibrate: args.includes('--calibrate'), plants, critic: args.includes('--critic') });
  mkdirSync(out, { recursive: true });
  if (key.length) writeFileSync(join(out, 'calibration-key.json'), JSON.stringify(key, null, 1));
  const { chromium } = createRequire(join(ROOT, 'package.json'))('playwright');
  const browser = await chromium.launch({ executablePath: chrAt >= 0 ? args[chrAt + 1] : '/opt/pw-browsers/chromium' });
  try {
    for (const [theme, scheme] of [['silent-black', 'dark'], ['paper', 'light']]) {
      const file = join(out, `hand-pairs-${theme}.html`);
      writeFileSync(file, pageHtml(body, theme));
      const p = await browser.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme });
      await p.goto(pathToFileURL(file).href); await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: join(out, `hand-pairs-${theme}.png`), fullPage: true });
      await p.close();
    }
  } finally { await browser.close(); }
  console.log(`sheet: ${out}`);
}
