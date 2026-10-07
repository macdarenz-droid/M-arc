// MO: copy the five app themes' tokens into the motion lab, so the lab never hand-copies colours.
// node tools/motion/lab-themes.mjs  ->  docs/design/motion-lab/src/themes.json
import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';
const out = await build({ entryPoints: ['src/theme/themes.ts'], bundle: true, format: 'esm', write: false, platform: 'neutral', logLevel: 'silent' });
const mod = await import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'));
const list = Object.values(mod.THEMES);
const pick = ['bg', 'surface1', 'surface2', 'surface3', 'borderSubtle', 'border', 'text', 'text2', 'text3', 'accent', 'onAccent', 'mapBody', 'mapLine', 'mistake', 'colorScheme', 'accentTextPct'];
const themes = list.map(t => ({ id: t.id, name: t.name, radius: t.radius, tokens: Object.fromEntries(pick.map(k => [k, t.tokens[k]])) }));
writeFileSync('docs/design/motion-lab/src/themes.json', JSON.stringify(themes, null, 1) + '\n');
console.log(themes.map(t => t.id).join(', '));
