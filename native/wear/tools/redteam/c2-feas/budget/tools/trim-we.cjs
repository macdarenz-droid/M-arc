// trim-we.cjs <original> <out> <drop ranges a-b,c-d> <keepComments 0|1|lic> [exportLine]
// Output = the original's lines, minus whole-line ranges, minus comment-only lines (unless kept), with the export line replaced.
const fs = require('fs');
const [src, out, ranges, mode, exp] = process.argv.slice(2);
const lines = fs.readFileSync(src, 'utf8').split('\n');
const drop = new Set();
for (const r of (ranges || '').split(',').filter(Boolean)) { const [a, b] = r.split('-').map(Number); for (let i = a; i <= (b || a); i++) drop.add(i); }
const isComment = (l) => /^\s*(\/\*\*?|\*\/?|\/\/)/.test(l);
const kept = [];
lines.forEach((l, i) => {
  const n = i + 1;
  if (drop.has(n)) return;
  if (mode !== '1' && isComment(l) && !(mode === 'lic' && n <= 16)) return;
  if (/^export \{/.test(l) && exp) l = exp;
  kept.push(l);
});
fs.writeFileSync(out, kept.join('\n'));
console.log(out, Buffer.byteLength(kept.join('\n')), 'B,', kept.length, 'lines');
