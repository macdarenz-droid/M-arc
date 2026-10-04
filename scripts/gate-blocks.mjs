// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 3.3, 4.3 E1/E2/E7): the gate's block list, generated from the gate file's
// own syntax tree, never kept by hand. Every top-level statement between `const errors = []` and
// `await browser.close()` is either `if (gate.runs('<key>'))` in front of one statement, or a `const` declaration;
// a group is the run of statements under one key. Also checks module-scope coupling (E2, rules R1-R5) and strips
// the GATE-SPLIT lines back out (E7). Build and gate time only; never bundled.
// CLI: node scripts/gate-blocks.mjs [--list | --count | --strip | --check] [file]
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const GATE_FILE = join(ROOT, 'scripts/screenshot-gate.mjs');

// rollup is vite's own dependency; resolving it through vite adds no package (D-GATESPLIT-PARSER)
const viteRequire = createRequire(createRequire(import.meta.url).resolve('vite/package.json'));
const { parseAst } = viteRequire('rollup/parseAst');

/** Groups that run in every job: they hold no check (asserted: no `errors` reference), so running K times proves nothing twice. */
export const ALWAYS = new Set(['HT-10.clock']);
/**
 * State a group leaves for later groups, other than its own checks: each entry is replayed by gate-split.mjs in every
 * job at the group's file position when the group itself runs in another job, so every later group sees what it saw
 * in one serial run. R5 allows exactly these global writes (E2), and the test pins the list to what the parser finds.
 */
export const REPLAYED = [{ group: 'HT-3', path: 'process.env.HT3_DUMP' }];
/** The GATE-SPLIT harness lines, exactly as inserted (3.1); `--strip` removes these and the guard lines, nothing else. */
export const HARNESS_HEAD = "const gate = (await import('./gate-split.mjs')).gateSplit({ errors, OUT, browser, file: fileURLToPath(import.meta.url) });";
export const HARNESS_TAIL = 'await gate.done();';
export const GUARD_LINE = /^if \(gate\.runs\('([A-Za-z0-9][A-Za-z0-9.-]*)'\)\)$/;
const KEY = /^[A-Z][A-Za-z0-9-]*[A-Za-z0-9](\.[a-z0-9]+)?$/;

const guardKey = (s) => {
  if (s.type !== 'IfStatement' || s.alternate) return null;
  const t = s.test;
  if (t.type !== 'CallExpression' || t.callee.type !== 'MemberExpression' || t.callee.computed) return null;
  if (t.callee.object.type !== 'Identifier' || t.callee.object.name !== 'gate' || t.callee.property.name !== 'runs') return null;
  if (t.arguments.length !== 1 || t.arguments[0].type !== 'Literal' || typeof t.arguments[0].value !== 'string') return null;
  return t.arguments[0].value;
};
const isErrorsDecl = (s) => s.type === 'VariableDeclaration' && s.declarations.length === 1 && s.declarations[0].id.name === 'errors';
const isTeardown = (s) => s.type === 'ExpressionStatement' && s.expression.type === 'AwaitExpression' && s.expression.argument.type === 'CallExpression'
  && s.expression.argument.callee.type === 'MemberExpression' && s.expression.argument.callee.object.name === 'browser' && s.expression.argument.callee.property.name === 'close';

/** Parses the gate source: `{ groups, problems, ast, region }`. A group is `{ key, statements: [node], line }`, in file order. */
export function parseGate(src) {
  const ast = parseAst(src);
  const body = ast.body, problems = [];
  const iErr = body.findIndex(isErrorsDecl), iEnd = body.findIndex(isTeardown);
  if (iErr < 0 || iEnd < 0 || iEnd < iErr) return { groups: [], problems: ['gate file: `const errors` or `await browser.close()` not found'], ast, region: [] };
  const starts = [0];
  for (let i = src.indexOf('\n'); i >= 0; i = src.indexOf('\n', i + 1)) starts.push(i + 1);
  const lineOf = (pos) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= pos) lo = mid; else hi = mid - 1; } return lo + 1; };
  let region = body.slice(iErr + 1, iEnd);
  const head = region[0], tail = region[region.length - 1];
  const harnessHead = head && src.slice(head.start, head.end) === HARNESS_HEAD;
  const harnessTail = tail && src.slice(tail.start, tail.end) === HARNESS_TAIL;
  if (!harnessHead) problems.push(`E1: the first statement after \`const errors\` must be the harness line: ${HARNESS_HEAD}`);
  if (!harnessTail) problems.push(`E1: the statement before \`await browser.close()\` must be \`${HARNESS_TAIL}\``);
  region = region.slice(harnessHead ? 1 : 0, harnessTail ? -1 : undefined);
  const groups = [], seen = new Set();
  for (const s of region) {
    const key = guardKey(s);
    if (key == null) {
      if (s.type === 'VariableDeclaration' && s.kind === 'const') continue;
      problems.push(`E1: line ${lineOf(s.start)}: a top-level ${s.type} without a guard. Put \`if (gate.runs('<your task ID>'))\` on its own line directly above it (docs/qa/GATE-SPLIT-DESIGN.md 3.4)`);
      continue;
    }
    if (!KEY.test(key)) problems.push(`E1: line ${lineOf(s.start)}: key "${key}" is not a task ID (optionally .n)`);
    const last = groups[groups.length - 1];
    if (last && last.key === key) { last.statements.push(s.consequent); continue; }
    if (seen.has(key)) problems.push(`E1: line ${lineOf(s.start)}: key "${key}" is used again after another group; a group's statements must be contiguous and keys unique`);
    seen.add(key);
    groups.push({ key, statements: [s.consequent], line: lineOf(s.start) });
  }
  // every guard sits alone on its line, so --strip removes exactly the guard and nothing of the block
  for (const s of region) if (guardKey(s) != null) {
    const lineStart = src.lastIndexOf('\n', s.start) + 1, lineEnd = src.indexOf('\n', s.start);
    if (!GUARD_LINE.test(src.slice(lineStart, lineEnd)) || s.consequent.start <= lineEnd) problems.push(`E1: line ${lineOf(s.start)}: the guard must be alone on its own line, directly above the statement it guards`);
  }
  return { groups, problems, ast, region, iErr, iEnd, lineOf };
}

/** E7: the gate source without the GATE-SPLIT lines (guards and harness). Throws if a removed line is not one the parser counted. */
export function stripGate(src) {
  const { groups } = parseGate(src);
  const nGuards = groups.reduce((a, g) => a + g.statements.length, 0);
  let removed = 0;
  const out = src.split('\n').filter(l => {
    if (GUARD_LINE.test(l)) { removed++; return false; }
    return l !== HARNESS_HEAD && l !== HARNESS_TAIL;
  });
  if (removed !== nGuards) throw new Error(`stripGate: removed ${removed} guard lines but the syntax tree holds ${nGuards} guards`);
  return out.join('\n');
}

// ---- E2: module-scope coupling ---------------------------------------------------------------------------------------
const MUTATORS = new Set(['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin', 'set', 'add', 'delete', 'clear']);
const GLOBAL_WRITES = new Set(['process', 'globalThis', 'console', 'global']);
const isNode = (v) => v && typeof v === 'object' && typeof v.type === 'string';

function patternNames(p, out = []) {
  if (!p) return out;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') for (const q of p.properties) patternNames(q.type === 'RestElement' ? q.argument : q.value, out);
  else if (p.type === 'ArrayPattern') for (const q of p.elements) patternNames(q, out);
  else if (p.type === 'RestElement') patternNames(p.argument, out);
  else if (p.type === 'AssignmentPattern') patternNames(p.left, out);
  return out;
}
/** Names a block-like body declares directly (let/const/class/function hoist to the block; var is treated the same here). */
function declaredIn(stmts) {
  const names = [];
  for (const s of stmts) {
    if (s.type === 'VariableDeclaration') for (const d of s.declarations) patternNames(d.id, names);
    else if ((s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration') && s.id) names.push(s.id.name);
  }
  return names;
}

/**
 * Walks `node` and calls `onRef(identifierNode, parentChain)` for every identifier that reads a binding not declared
 * inside the walked code (so it resolves to module scope or a global). Scope-aware for blocks, loops, functions,
 * catch clauses and patterns; non-reference identifiers (property keys, member properties, labels) are skipped.
 */
function walkRefs(node, onRef, scope = [new Set()], chain = []) {
  if (!isNode(node)) return;
  if (node.type === 'Identifier') { if (!scope.some(s => s.has(node.name))) onRef(node, chain); return; }
  chain.push(node);
  try { walkInner(node, onRef, scope, chain); } finally { chain.pop(); }
}
function walkInner(node, onRef, scope, ch) {
  const visit = (n, sc) => walkRefs(n, onRef, sc, ch);
  switch (node.type) {
    case 'MemberExpression': visit(node.object, scope); if (node.computed) visit(node.property, scope); return;
    case 'Property': if (node.computed) visit(node.key, scope); visit(node.value, scope); return;
    case 'PropertyDefinition': case 'MethodDefinition': if (node.computed) visit(node.key, scope); visit(node.value, scope); return;
    case 'LabeledStatement': visit(node.body, scope); return;
    case 'BreakStatement': case 'ContinueStatement': case 'MetaProperty': return;
    case 'BlockStatement': case 'StaticBlock': { const sc = [...scope, new Set(declaredIn(node.body))]; for (const s of node.body) visit(s, sc); return; }
    case 'Program': { const sc = [...scope, new Set(declaredIn(node.body))]; for (const s of node.body) visit(s, sc); return; }
    case 'ForStatement': case 'ForInStatement': case 'ForOfStatement': {
      const init = node.init ?? node.left;
      const sc = [...scope, new Set(init && init.type === 'VariableDeclaration' ? declaredIn([init]) : [])];
      for (const k of ['init', 'left', 'right', 'test', 'update', 'body']) if (node[k]) visit(node[k], sc);
      return;
    }
    case 'FunctionDeclaration': case 'FunctionExpression': case 'ArrowFunctionExpression': {
      const own = new Set(node.params.flatMap(p => patternNames(p)));
      if (node.type === 'FunctionExpression' && node.id) own.add(node.id.name);
      own.add('arguments');
      const sc = [...scope, own];
      for (const p of node.params) if (p.type === 'AssignmentPattern') visit(p.right, sc);
      visit(node.body, sc);
      return;
    }
    case 'ClassDeclaration': case 'ClassExpression': if (node.superClass) visit(node.superClass, scope); visit(node.body, scope); return;
    case 'CatchClause': { const sc = [...scope, new Set(patternNames(node.param))]; visit(node.body, sc); return; }
    case 'VariableDeclarator': for (const n of patternDefaults(node.id)) visit(n, scope); if (node.init) visit(node.init, scope); return;
    case 'ImportExpression': visit(node.source, scope); return;
    default:
      for (const [k, v] of Object.entries(node)) {
        if (k === 'type' || k === 'start' || k === 'end') continue;
        if (Array.isArray(v)) for (const x of v) visit(x, scope); else if (isNode(v)) visit(v, scope);
      }
  }
}
function patternDefaults(p, out = []) {
  if (!p) return out;
  if (p.type === 'AssignmentPattern') { out.push(p.right); patternDefaults(p.left, out); }
  else if (p.type === 'ObjectPattern') for (const q of p.properties) { if (q.computed) out.push(q.key); patternDefaults(q.type === 'RestElement' ? q.argument : q.value, out); }
  else if (p.type === 'ArrayPattern') for (const q of p.elements) patternDefaults(q, out);
  else if (p.type === 'RestElement') patternDefaults(p.argument, out);
  return out;
}

/** The identifier at the root of `a.b[c].d`, or null. */
const rootOf = (n) => { while (n && (n.type === 'MemberExpression' || n.type === 'ChainExpression')) n = n.type === 'ChainExpression' ? n.expression : n.object; return n && n.type === 'Identifier' ? n : null; };
const memberPath = (n) => { const parts = []; while (n && n.type === 'MemberExpression') { parts.unshift(n.computed ? '[]' : n.property.name); n = n.object; } if (n?.type === 'Identifier') parts.unshift(n.name); return parts.join('.'); };

/** E1 (ALWAYS) and E2 (R1-R5): returns the problems; empty means the gate is safe to split. */
export function couplingProblems(src) {
  const { groups, problems: parseProblems, ast, region, iErr, lineOf } = parseGate(src);
  if (parseProblems.length && !groups.length) return parseProblems;
  const out = [];
  const body = ast.body;
  const before = new Set(), after = new Map();   // module bindings; `after` maps name -> declaring statement
  body.forEach((s, i) => {
    let names = [];
    if (s.type === 'ImportDeclaration') names = s.specifiers.map(x => x.local.name);
    else if (s.type === 'VariableDeclaration') names = s.declarations.flatMap(d => patternNames(d.id));
    else if ((s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration') && s.id) names = [s.id.name];
    for (const n of names) if (i <= iErr) before.add(n); else after.set(n, s);
    if (i > iErr && s.type === 'VariableDeclaration' && s.kind !== 'const') out.push(`E2 R5: line ${lineOf(s.start)}: top-level \`${s.kind}\` after \`const errors\``);
    if (i > iErr && (s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration')) out.push(`E2 R5: line ${lineOf(s.start)}: top-level ${s.type} after \`const errors\``);
  });
  const isModule = (n) => before.has(n) || after.has(n);

  // which groups reference each module binding declared after `errors`
  const users = new Map();
  for (const g of groups) for (const st of g.statements) walkRefs(st, (id) => {
    if (after.has(id.name)) { if (!users.has(id.name)) users.set(id.name, new Set()); users.get(id.name).add(g.key); }
  });
  const ownerOf = (name) => { const s = users.get(name); const o = s ? [...s].filter(k => !ALWAYS.has(k)) : []; return o.length === 1 ? o[0] : null; };
  const mutated = new Map();   // binding declared after `errors` -> groups that mutate it (R3)
  const noteMutation = (name, key) => { if (!after.has(name)) return; if (!mutated.has(name)) mutated.set(name, new Set()); mutated.get(name).add(key); };

  for (const g of groups) for (const st of g.statements) {
    walkRefs(st, (id, chain) => {
      const parent = chain[chain.length - 1];
      if (ALWAYS.has(g.key) && id.name === 'errors') out.push(`E1: ALWAYS group ${g.key} references \`errors\`; an ALWAYS group may hold no check`);
      // climb to the outermost member expression rooted at this identifier
      let top = id, i = chain.length - 1;
      while (i >= 0 && chain[i].type === 'MemberExpression' && chain[i].object === top) { top = chain[i]; i--; }
      const ctx = chain[i], at = lineOf(id.start), path = memberPath(top);
      const mod = isModule(id.name), glob = !mod && GLOBAL_WRITES.has(id.name);
      // a binding declared after `errors` may be mutated by its one owning group, or by an ALWAYS group (R3 checks the rest)
      const mayMutate = mod && after.has(id.name) && (ownerOf(id.name) === g.key || ALWAYS.has(g.key));
      const written = ctx && ((ctx.type === 'AssignmentExpression' && ctx.left === top) || (ctx.type === 'UpdateExpression' && ctx.argument === top)
        || (ctx.type === 'UnaryExpression' && ctx.operator === 'delete' && ctx.argument === top));
      if (written && mod) noteMutation(id.name, g.key);
      if (written && mod && !mayMutate) out.push(`E2 R1: line ${at}: group ${g.key} assigns to module-scope \`${path}\``);
      if (written && glob && !(g.key === 'HT-10.clock' && path === 'console.log') && !REPLAYED.some(r => r.group === g.key && r.path === path)) out.push(`E2 R5: line ${at}: group ${g.key} writes the global \`${path}\``);
      // a mutating method called on a module binding: errors.push anywhere, errors.splice only in BASE (its own injected entries)
      if (mod && top !== id && ctx && ctx.type === 'CallExpression' && ctx.callee === top && top.type === 'MemberExpression' && !top.computed && MUTATORS.has(top.property.name)) {
        const m = top.property.name, base = memberPath(top.object);
        const ok = (base === 'errors' && m === 'push') || (base === 'errors' && m === 'splice' && g.key === 'BASE') || mayMutate;
        if (base !== 'errors') noteMutation(id.name, g.key);
        if (!ok) out.push(`E2 R2: line ${at}: group ${g.key} calls \`${path}()\` on module-scope \`${base}\``);
      }
      if (id.name === 'process' && !mod && top.type === 'MemberExpression' && path === 'process.chdir') out.push(`E2 R5: line ${at}: group ${g.key} calls process.chdir`);
      // Object.assign / Object.defineProperty on a module binding
      if (id.name === 'Object' && parent?.type === 'MemberExpression' && ['assign', 'defineProperty', 'defineProperties', 'setPrototypeOf'].includes(parent.property?.name)) {
        const call = chain[chain.length - 2];
        const target = call?.type === 'CallExpression' && call.callee === parent ? rootOf(call.arguments[0]) : null;
        if (target && isModule(target.name)) noteMutation(target.name, g.key);
        if (target && isModule(target.name) && !(after.has(target.name) && (ownerOf(target.name) === g.key || ALWAYS.has(g.key)))) out.push(`E2 R2: line ${at}: group ${g.key} calls Object.${parent.property.name} on module-scope \`${target.name}\``);
      }
    });
  }
  // R3: a binding declared after `errors` that any group mutates belongs to one group; read-only ones may be shared,
  // because an unguarded declaration runs in every job (R4 keeps it free of checks)
  for (const [name, set] of mutated) {
    const owners = [...(users.get(name) ?? [])].filter(k => !ALWAYS.has(k));
    if (owners.length > 1) out.push(`E2 R3: \`${name}\` is mutated (by ${[...set].join(', ')}) and used by ${owners.length} groups: ${owners.join(', ')}; a mutated binding belongs to one group`);
  }
  // R4: unguarded declarations after `errors` (they run in every job): no await, no errors/browser/page/ctx/gate
  for (const s of region) if (s.type === 'VariableDeclaration') {
    let bad = null;
    const scan = (n) => { if (!isNode(n) || bad) return; if (n.type === 'AwaitExpression') bad = 'await'; for (const [k, v] of Object.entries(n)) { if (k === 'type') continue; if (Array.isArray(v)) v.forEach(scan); else if (isNode(v)) scan(v); } };
    for (const d of s.declarations) { scan(d.init); walkRefs(d.init, (id) => { if (!bad && ['errors', 'browser', 'page', 'ctx', 'gate'].includes(id.name)) bad = `\`${id.name}\``; }); }
    if (bad) out.push(`E2 R4: line ${lineOf(s.start)}: an unguarded top-level declaration uses ${bad}; it would run in every job`);
  }
  return [...parseProblems, ...out];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const mode = process.argv[2] ?? '--list';
  const file = process.argv[3] ?? GATE_FILE;
  const src = readFileSync(file, 'utf8');
  if (mode === '--strip') process.stdout.write(stripGate(src));
  else if (mode === '--count') console.log(parseGate(src).groups.length);
  else if (mode === '--check') { const p = couplingProblems(src); if (p.length) { console.error(p.join('\n')); process.exit(1); } console.log(`gate blocks OK: ${parseGate(src).groups.length} groups`); }
  else for (const g of parseGate(src).groups) console.log(`${g.key}\t${g.line}\t${g.statements.length}`);
}
