#!/usr/bin/env python3
# mut.py: apply each mutation, run the named test, expect red, restore; then run the same test clean, expect green.
import subprocess, sys
WT = '/home/user/M-arc/.claude/worktrees/wf_b70d8ff4-f01-2/'
A = WT + 'native/wear/app/entry/src/main/js/default/'
L, CSS, HML, CFG = A + 'common/link.js', A + 'pages/index/index.css', A + 'pages/index/index.hml', WT + 'native/wear/app/entry/src/main/config.json'
T = 'native/wear/test/'
M = [
  ('V1 Set', 'c2', L, "v.sl = msg === 'Saved' ? (r && svR === r.id ? 'Set ' + sv + ' saved' : '') : r || msg.indexOf('Pending') ? msg : '';", 'v.sl = msg;'),
  ('V1 offline', 'c2', L, 'v.off && (q.length || !snap) ? 4', 'v.off && q.length ? 4'),
  ('V1 Rest', 'c2', L, "(s ? ', ' + v.l2 : '')", "''"),
  ('V1 Up next', 'c2', L, '!o ? BG :', '!o ? PL :'),
  ('V1 markup', 'c2', CSS, '.pt{width:84px;height:28px;font-size:20px}', '.pt{width:84px;font-size:20px}'),
  ('V2 paging', 'c2', L, "d === 'up' || d === 'down' ? 1 - pg : pg", "d !== 'left' ? 1 - pg : pg"),
  ('V2 pick', 'c2', L, 's = cs(), f =', 's = snap.set, f ='),
  ('V2 the pick holds', 'c2', L, ' && snap.eid === pe', ''),
  ('V3 Back in sync', 'c2', L, "sy = m.status === 'applied' ? tk + 3 : 0", 'sy = tk + 3'),
  ('V3 Back in sync', 'c2', L, "if (gone() && q.length && !lq) lq = 1, bn = 0;", "if (q.length && !lq) lq = 1, bn = 0;"),
  ('V3 Rest comes', 'c2', L, "		if (svR === '') svR = m.rest ? m.rest.id : 0;\n", ''),
  ('V3 a hello', 'c2', L, 'hi = tk + 2, bn++;', 'hi = tk + 1, bn++;'),
  ('V4 a bad plan', 'c2', L, ' && okLt(o.lt)', ''),
  ('V4 a bad plan', 'c2', L, 'num(m.srev) && ', ''),
  ('V4 a bad plan', 'c2', L, " && (m.eid == null || str(m.eid))", ''),
  ('W4 ES5, ASCII', 'link', CFG, '"code": 1002000,\n      "name": "1.2.0"', '"code": 1001002,\n      "name": "1.1.2"'),
  ('W4 ES5, ASCII', 'link', HML, '<text class="a l x">Target</text>\n', '<text class="a l x">Target</text>\n<!--' + 'x' * 60 + '-->\n'),
  ('W4 page markup', 'link', HML, 'onclick="onEasy"', 'onclick="onIdeal"'),
  ('W3 hello: at start', 'link', L, "APP = '1.2.0'", "APP = '1.1.2'"),
]
def run(name, f):
  r = subprocess.run(['node', '--test', '--test-name-pattern', name, T + f + '.test.mjs'], cwd=WT, capture_output=True, text=True)
  out = r.stdout
  p = [l for l in out.splitlines() if l.startswith('# pass')][0].split()[-1]
  fl = [l for l in out.splitlines() if l.startswith('# fail')][0].split()[-1]
  return int(p), int(fl)
bad = 0
for name, f, path, a, b in M:
  src = open(path).read()
  assert src.count(a) == 1, (name, a, src.count(a))
  open(path, 'w').write(src.replace(a, b))
  try:
    p, fl = run(name, f)
  finally:
    open(path, 'w').write(src)
  p2, fl2 = run(name, f)
  ok = fl >= 1 and fl2 == 0 and p2 >= 1
  bad += not ok
  print(('RED ok ' if ok else 'NOT RED ') + f'{name!r}: mutated pass {p} fail {fl}; clean pass {p2} fail {fl2} | {a[:60]!r} -> {b[:40]!r}')
sys.exit(1 if bad else 0)
