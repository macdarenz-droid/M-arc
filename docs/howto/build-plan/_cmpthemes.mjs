import { readFileSync } from 'node:fs';
import * as G from './_regen/docs/howto/technical-plate/ref-src/themes.mjs';
import * as A from './_themes_app.mjs';
const html = readFileSync('./_golden.html','utf8');
const style = html.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/<svg[\s\S]*?<\/svg>/g,'');
const used = new Set([...style.matchAll(/var\(--([\w-]+)/g)].map(m=>m[1]));
const parse = css => { const o={}; for (const blk of css.matchAll(/\[data-theme="([\w-]+)"\][^{]*\{([^}]*)\}/g)) { o[blk[1]] ??= {}; for (const d of blk[2].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) o[blk[1]][d[1]] = d[2].trim(); } return o; };
const g = parse(G.allThemesCss()), a = parse(A.allThemesCss());
console.log('themes', Object.keys(g), Object.keys(a));
let diffs=0, missing=new Set();
for (const t of Object.keys(g)) for (const k of used) { if (!(k in (g[t]||{}))) continue; if (!(k in (a[t]||{}))) { missing.add(k); continue; } if (g[t][k]!==a[t][k]) { diffs++; console.log('DIFF',t,k,g[t][k],'|',a[t][k]); } }
console.log('diffs',diffs,'missing in app',[...missing]);
// tokens.css (non-theme) vs app styles.css token block
const tk = readFileSync('./_regen/docs/howto/technical-plate/engine/tokens.css','utf8');
const app = readFileSync('./_build/src/ui/styles.css','utf8'); const blk = app.slice(app.indexOf('tokens:start'), app.indexOf('tokens:end'));
const kv = s => Object.fromEntries([...s.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
const T=kv(tk), P=kv(blk); let td=0; for (const k in T) if (T[k]!==P[k]) { td++; console.log('TOK',k,T[k],'|',P[k]); } console.log('token diffs',td);
