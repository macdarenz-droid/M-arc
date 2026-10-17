// Split a webpack 5 lite page bundle into its modules and report bytes per module.
const fs = require('fs');
const f = process.argv[2];
const s = fs.readFileSync(f, 'latin1');
const re = /\n\/\*\*\*\/ (\d+):\n/g;
let m, marks = [];
while ((m = re.exec(s))) marks.push({ id: m[1], at: m.index });
const end = s.indexOf('\n/******/ \t});');
let out = [], modTotal = 0;
for (let i = 0; i < marks.length; i++) {
  const a = marks[i].at, b = i + 1 < marks.length ? marks[i + 1].at : end;
  const body = s.slice(a, b);
  let label = '?';
  if (/new ViewModel\(options\)/.test(body)) label = 'entry wrapper (ViewModel glue)';
  else if (/classSelectors/.test(body)) label = 'css (styleSheet JSON)';
  else if (/module\.exports = function \(vm\)/.test(body)) label = 'hml render';
  else if (/P2pClient/.test(body) && /function Builder|Builder =/.test(body)) label = 'wearengine.js';
  else if (/PHONE_FP|makeBoot/.test(body) && /function Link/.test(body)) label = 'link.js';
  else if (/_interopRequireDefault\(obj\)/.test(body)) label = 'babel interopRequireDefault helper';
  else if (/onInit/.test(body)) label = 'index.js';
  const rq = (body.match(/function requireModule\(moduleName\) \{\n  return requireNative\(moduleName\.slice\(1\)\);\n\}\n/g) || []).length;
  out.push({ id: marks[i].id, label, bytes: b - a, requireModuleTails: rq });
  modTotal += b - a;
}
const pre = marks[0].at, post = s.length - end;
console.log(JSON.stringify({ file: f, total: s.length, preamble: pre, modules: out, modulesTotal: modTotal, bootstrapTail: post }, null, 1));
