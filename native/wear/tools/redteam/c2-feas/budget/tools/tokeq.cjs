// tokeq.cjs <a.js> <b.js>: compare the token streams of two compiled pages, comments and whitespace ignored.
// Webpack module ids (keys "N: (function" and __webpack_require__(N)) are renumbered in order of first use.
const parser = require(process.env.ACE + '/node_modules/@babel/parser');
const fs = require('fs');
const tok = (f) => {
  const t = parser.parse(fs.readFileSync(f, 'utf8'), { sourceType: 'script', tokens: true }).tokens
    .filter((x) => x.type !== 'CommentBlock' && x.type !== 'CommentLine')
    .map((x) => [typeof x.type === 'object' ? x.type.label : x.type, x.value === undefined ? '' : String(x.value)]);
  const ids = {}; let n = 0;
  return t.map(([k, v], i) => {
    const isId = k === 'num' && ((t[i - 1] && t[i - 1][0] === '(' && t[i - 2] && t[i - 2][1] === '__webpack_require__') ||
      (t[i + 1] && t[i + 1][0] === ':' && t[i + 2] && t[i + 2][0] === '(' && t[i + 3] && t[i + 3][1] === 'function'));
    if (isId && ids[v] === undefined) ids[v] = 'MOD' + n++;
    return k + ':' + (isId ? ids[v] : v);
  });
};
const a = tok(process.argv[2]), b = tok(process.argv[3]);
let i = 0; while (i < a.length && a[i] === b[i]) i++;
console.log(a.length === b.length && i === a.length ? `IDENTICAL tokens (${a.length})` : `DIFFER at token ${i}: ${a[i]} vs ${b[i]} (lengths ${a.length}/${b.length})`);
