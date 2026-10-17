#!/usr/bin/env python3
# mut.py [ids...]: each mutation on a fresh copy of the worktree's native/wear, then the watch tests there; prints the failing tests
import os, shutil, subprocess, sys, re
W = '/home/user/M-arc/.claude/worktrees/wf_ee5bd2d2-447-2'
M = '/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c3-mut'
LINK = 'native/wear/app/entry/src/main/js/default/common/link.js'
PAGE = 'native/wear/app/entry/src/main/js/default/pages/index/index.js'
HML = 'native/wear/app/entry/src/main/js/default/pages/index/index.hml'
MUTS = [
  ('M1', LINK, "i < o.length - 1 && !free(o[i]); i++); return o[i];", "i < 0; i++); return o[i];", 'no local advance'),
  ('M2', LINK, "return r ? [r.set] : snap.xs || [0];", "return r ? [r.set].concat((snap.xs || []).slice(1)) : snap.xs || [0];", 'a pick advances through the snap nx'),
  ('M3', LINK, "v.off && (q.length || !snap) && !free(s) ? 4", "v.off && (q.length || !snap) ? 4", 'Phone not connected with sets left'),
  ('M4', LINK, "if (dl.push(q[i].set) > 16) dl.shift();", "", 'a saved set unlocks on a stale snap'),
  ('M5', LINK, "for (i = 0; ok && i < n.length; i++) ok = Array.isArray(r = n[i]) && str(r[0]) && num(r[1]) && nn(r[2]) && nn(r[3]);", "", 'nx entries unchecked'),
  ('M5b', LINK, "okLt(m.lt) && nn(m.rs) && Array.isArray(n);", "okLt(m.lt) && Array.isArray(n);", 'rs unchecked'),
  ('M5c', LINK, "(s.e == null || str(s.e)) && nn(s.st); }", "(s.e == null || str(s.e)); }", 'st unchecked'),
  ('M6', LINK, "if (tk - lr.id > 1) lr.on = 1;", "if (tk - lr.id > 0) lr.on = 1;", 'local rest after 1 tick'),
  ('M7', LINK, "(tk - (r === lr ? r.id : snapTk))", "(tk - (r === lr ? r.id + 2 : snapTk))", 'local rest counted from its start'),
  ('M8', LINK, "if (m.rest && m.rest.id !== lr.i) lr = 0;", "", 'a phone rest does not replace it'),
  ('M9', LINK, "if (m.rest && m.rest.id !== lr.i) lr = 0;", "if (m.rest) lr = 0;", 'the old ended rest replaces it'),
  ('M10', LINK, "if (lr.on) kind === 'rest_skip' ? lr = 0 : lr.left += 30000, io.paint(); // C3: a local rest is local\n\t\t\telse if", "if", 'a local rest sends'),
  ('M11', LINK, "else if (r.id === rn && bz !== rn) bz = rn, (io.buzz || no)();", "else if (r.id === rn) bz = rn, (io.buzz || no)();", 'a buzz every tick'),
  ('M12', LINK, "r && r.id === rn && r.id !== rk ? 6", "r && r.id !== rk ? 6", 'Rest done for a rest never seen counting'),
  ('M13', LINK, "ok: function () { rk = (rst() || 0).id; io.paint(); }", "ok: function () { io.paint(); }", 'OK does nothing'),
  ('M14', LINK, "if (code === 's') ko = rk = bz = f[4];", "if (code === 's') rk = bz = f[4];", 'Skip leaves Rest only with the phone'),
  ('M15', LINK, "if (code === 's') ko = rk = bz = f[4];", "if (code === 's') ko = f[4];", 'a skipped rest rings later'),
  ('M15b', LINK, "\t\tko = '';\n", "", 'a skipped rest stays hidden after a snap'),
  ('M16', LINK, "x = Math.round(((ad[f] || 0) + d * (f === 'r' ? 1 : ad.st > 0 ? ad.st : ad.u === 'lb' ? 5 : 2.5)) * 100) / 100;", "x = (ad[f] || 0) + d * (f === 'r' ? 1 : ad.st > 0 ? ad.st : ad.u === 'lb' ? 5 : 2.5);", 'no rounding'),
  ('M17', LINK, "x > 100 ? 100 : x", "x", 'reps above 100'),
  ('M17b', LINK, "x < 1 ? 1 :", "", 'reps below 1'),
  ('M18', LINK, "x > 1000 ? 1000 : x > 0", "x > 0", 'load above 1000'),
  ('M19', LINK, "x > 0 ? x : ad.w;", "x;", 'load to 0 and below'),
  ('M20', LINK, "ad.u === 'lb' ? 5 : 2.5", "2.5", 'lb steps by 2.5'),
  ('M21', LINK, "ad.st > 0 ? ad.st : ", "", 'st ignored'),
  ('M22', LINK, "if (ao()) d === 'up' ? bump(1) : d === 'down' ? bump(-1) : (d === 'left' || d === 'right') && (af = af === 'r' ? 'w' : 'r'); // C3: in Adjust\n\t\t\telse if", "if", 'swipes page in Adjust'),
  ('M23', LINK, "(d === 'left' || d === 'right') && (af = af === 'r' ? 'w' : 'r')", "0", 'left and right do nothing'),
  ('M23b', LINK, "(d === 'left' || d === 'right') && (af", "d && (af", 'any direction switches the field'),
  ('M24', LINK, "ad.id === s.id && ad.rev === s.rev ? ad : s;", "ad.id === s.id ? ad : s;", 'draft not tied to rev'),
  ('M24b', LINK, "ad.id === s.id && ad.rev === s.rev ? ad : s;", "ad.rev === s.rev ? ad : s;", 'draft not tied to id'),
  ('M25', LINK, "s = cs(), d = dv(s), f =", "s = cs(), d = s, f =", 'Complete ignores the draft'),
  ('M26', LINK, "\t\tif (!ao()) af = 0;\n", "", 'Adjust reopens on a stale snap'),
  ('M27', LINK, "v.hr = tk - ht < 16 ? hv : '';", "v.hr = hv;", 'heart rate never goes stale'),
  ('M28', LINK, "x === -602 ?", "x === 602 ?", 'no 602 text'),
  ('M29', PAGE, "v.sl || v.hr, ''", "v.sl, ''", 'no heart rate on Set'),
  ('M30', PAGE, "[v.rc, v.sl, v.hr]", "[v.rc, v.sl]", 'no heart rate on Rest'),
  ('M31', PAGE, "\thr(on);\n", "", 'keep-on does not subscribe'),
  ('M32', PAGE, ": sensor.unsubscribeHeartRate();", ": 0;", 'never unsubscribed'),
  ('M33', PAGE, "mode: 'long'", "mode: 'short'", 'short vibration'),
  ('M34', HML, '<div if="{{off}}" class="wb mt"><text class="a w x">Phone not connected</text></div>', '<text if="{{off}}" class="mt a w x">Phone not connected</text>', '1.2.0 title'),
  ('M35', HML, '<text class="h l x">{{t3}}</text>', '<text if="{{t1}}" class="h l x">Pending</text>', '1.2.0 Pending'),
  ('M36', PAGE, ", v.na && 'Pending']", "]", 'no Pending slot'),
  ('M37', LINK, "later(io.paint); // C3: on a fresh stack", "io.paint();", 'write paint on the callback stack'),
  ('M38', LINK, "\t\t\t\tfresh();\n\t\t\t\tfin();", "\t\t\t\tfin();", 'effort carried to the next set'),
  ('M39', LINK, "\t\t\tfresh();\n\t\t\treturn pump();", "\t\t\treturn pump();", 'effort carried back after a refusal'),
  ('M40', LINK, "a = ((o = nr()) ? o.d + 1 : snap.si) + j;", "a = (o = nr()) ? o.d + 1 : snap.si;", 'numbering ignores nx'),
  ('M41', LINK, "v.la = x.lt && !j ?", "v.la = x.lt ?", 'last time on nx sets'),
  ('M42', LINK, "if (j < o.length) sv = ((c = nr()) ? c.d + 1 : snap.si) + j, svR = '';", "if (!j) sv = (c = nr()) ? c.d + 1 : snap.si, svR = '';", 'Set N saved numbering'),
  ('M43', LINK, "if (m.sid !== snap.sid) pg = lr = 0;", "if (m.sid !== snap.sid) pg = 0;", 'local rest kept across sessions'),
  ('M44', LINK, "\t\tif (L) lr = L;", "\t\tlr = L;", 'local rest armed by any write'),
  ('M45', LINK, "var L = code === 'c' && snap.rs > 0 &&", "var L = code === 'c' &&", 'local rest with rs 0'),
  ('M46', LINK, "dv(s).r >= 1);", "s.r >= 1);", 'can() ignores the draft'),
  ('M47', LINK, "else if (can()) {", "else if (snap.sid) {", 'Adjust opens on a pending set'),
]
ids = sys.argv[1:]
shutil.rmtree(M + '/base', ignore_errors=True)
os.makedirs(M + '/base/.github/workflows', exist_ok=True)
shutil.copytree(W + '/native/wear', M + '/base/native/wear', symlinks=True, ignore=shutil.ignore_patterns('fixtures'))
shutil.copy(W + '/.github/workflows/build-apk.yml', M + '/base/.github/workflows/')
shutil.copy(W + '/capacitor.config.json', M + '/base/')
os.symlink(W + '/node_modules', M + '/base/node_modules')
for mid, f, old, new, what in MUTS:
  if ids and mid not in ids: continue
  d = M + '/w'
  shutil.rmtree(d, ignore_errors=True)
  shutil.copytree(M + '/base', d, symlinks=True)
  p = os.path.join(d, f); s = open(p).read()
  n = s.count(old)
  if n != 1: print(mid, 'PATTERN COUNT', n); continue
  open(p, 'w').write(s.replace(old, new))
  out = subprocess.run(['node', '--test', 'native/wear/test/c3.test.mjs', 'native/wear/test/c2.test.mjs', 'native/wear/test/link.test.mjs'], cwd=d, capture_output=True, text=True).stdout
  fails = [re.sub(r'^not ok \d+ - ', '', l)[:60] for l in out.splitlines() if l.startswith('not ok')]
  print(f'{mid} ({what}): {len(fails)} failing' + (': ' + ' | '.join(fails) if fails else '  <-- SURVIVED'))
