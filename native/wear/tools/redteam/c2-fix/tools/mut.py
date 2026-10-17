#!/usr/bin/env python3
"""mut.py: each mutation applied alone to the worktree's watch code; the watch tests run; the file is restored.
Prints the mutation, then the failing tests (a mutation no test catches prints SURVIVED)."""
import subprocess, sys, re
WT = '/home/user/M-arc/.claude/worktrees/wf_20c6ab7f-3aa-1'
JS = WT + '/native/wear/app/entry/src/main/js/default/'
LINK, PAGE = JS + 'common/link.js', JS + 'pages/index/index.js'
M = [
    ('fix1 sc', LINK, "rows && pg ? 3 : left > 0 ? 2 :", "rows && pg ? 3 : r ? 2 :"),
    ('fix1 sl', LINK, ": left > 0 || msg.indexOf('Pending')", ": r || msg.indexOf('Pending')"),
    ('fix1 saved', LINK, "(left > 0 && svR === r.id ?", "(r && svR === r.id ?"),
    ('fix2 msg', LINK, "if (!bj) msg = q.length > 1", "msg = q.length > 1"),
    ('fix2 sync', LINK, "m.status === 'applied' && !bj ? tk + 3 : 0", "m.status === 'applied' ? tk + 3 : 0"),
    ('fix2 reset', LINK, ", lq = bj = 0;", ", lq = 0;"),
    ('fix2 set', LINK, "bj = lq;", ""),
    ('fix3', LINK, "if (k && id !== done) done = '';", "if (id !== done) done = '';"),
    ('fix4 sp', LINK, "a = (o = nr()) ? o.d + 1 : snap.si;", "a = (o = row()) ? o.d + 1 : snap.si;"),
    ('fix4 guard', LINK, "return r || e && (e.set || 0).id === (snap.set || 0).id && e;", "return r || e;"),
    ('fix4 saved', LINK, "sv = (c = nr()) ? c.d + 1 : snap.si", "sv = row() ? row().d + 1 : snap.si"),
    ('fix5 swipe', LINK, "d === 'up' || d === 'down' ? 1 - pg : pg", "d ? 1 - pg : pg"),
    ('fix5 effort', LINK, "if (id !== effSet) eff = null;", ""),
    ('fix5 cl', LINK, "if (q[i].set === s.id) v.cl", "if (q[i]) v.cl"),
    ('fix6 data', PAGE, "if (k !== 'sc' && k in page) page[k] = v[k];", "if (k !== 'sc') page[k] = v[k];"),
    ('fix6 order', PAGE, "for (k in v) if (k !== 'sc' && k in page) page[k] = v[k];\n\tfor (k = 0; s && k < 9; k++) page[SLOTS[k]] = s[k] || (k < 5 ? '' : '#08090a');\n\tif (v) page.sc = v.sc;",
     "for (k in v) if (k in page) page[k] = v[k];\n\tfor (k = 0; s && k < 9; k++) page[SLOTS[k]] = s[k] || (k < 5 ? '' : '#08090a');"),
    ('fix7', LINK, "hms(io.now() + off).slice(0, 5)", "hms(io.now()).slice(0, 5)"),
    ('churn off', LINK, "if (gone() || bad && q.length) v.off = 1;", "if (gone()) v.off = 1;"),
    ('churn lq', LINK, "if ((gone() || bad) && q.length && !lq)", "if (gone() && q.length && !lq)"),
    ('churn rx', LINK, "if (!q.length) bad = 0;", ""),
    ('churn sent', LINK, "bad = code !== 207;", "if (code !== 207) bad = 1;"),
    ('slots set', PAGE, "[v.sp, v.l2, v.la, v.sl, '',", "[v.l2, v.sp, v.la, v.sl, '',"),
    ('slots rest', PAGE, "k == 2 ? [v.rc, v.sl]", "k == 2 ? [v.sl, v.rc]"),
    ('slots up', PAGE, "[v.dn, v.n0, v.n1, v.n2, v.n3,", "[v.dn, v.n1, v.n0, v.n2, v.n3,"),
    ('slots up colours', PAGE, "v.b0, v.b1, v.b2, v.b3]", "v.b1, v.b0, v.b2, v.b3]"),
    ('slots msg', PAGE, "k ? [v.na, v.rest]", "k ? [v.rest, v.na]"),
    ('slots none', PAGE, ": [v.l1, v.l2];", ": [v.l2, v.l1];"),
    ('slots colour default', PAGE, "s[k] || (k < 5 ? '' : '#08090a')", "s[k] || ''"),
    ('slots set colours', PAGE, "v.e1, v.e2, v.e3, v.cb]", "v.e2, v.e1, v.e3, v.cb]"),
]
only = sys.argv[1:]
for name, f, a, b in M:
    if only and name not in only: continue
    src = open(f).read()
    if src.count(a) != 1:
        print(f'{name}: pattern found {src.count(a)} times'); continue
    open(f, 'w').write(src.replace(a, b))
    try:
        out = subprocess.run(['node', '--test', WT + '/native/wear/test/c2.test.mjs', WT + '/native/wear/test/link.test.mjs'],
                             capture_output=True, text=True, cwd=WT, timeout=600).stdout
    finally:
        open(f, 'w').write(src)
    fails = re.findall(r'^not ok \d+ - (.*)$', out, re.M)
    print(f'{name}: ' + ('SURVIVED' if not fails else ' | '.join(x[:70] for x in fails)))
