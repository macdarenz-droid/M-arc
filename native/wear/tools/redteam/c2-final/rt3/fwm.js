// fwm.js: after fw.js; _i that records, per mount, the peak native stack (stk(), patched jerry), the stack at the mount's
// start, the if-nesting and the element depth of the tree after the mount.
var MB = {}, IFD = 0, IFDMAX = 0, MS = { m: 0, base: 0, ifd: 0, id: -1 }, NID = 0, EDMAX = 0, MSUM = {};
function edepth(list) { var d = 0; for (var i = 0; list && i < list.length; i++) { var e = list[i]; if (!e) continue; var k = edepth(e.kids) + (e.ifw ? 0 : 1); if (k > d) d = k; } return d; }
function _i(cond, render) {
  var h = { tag: 'if', w: [], kids: null, ifw: 1 }, id = NID++;
  function set(v) {
    if (v && !h.kids) {
      NMOUNT++;
      var outer = stk(0), base = stk(-1);
      IFD++; if (IFD > IFDMAX) IFDMAX = IFD;
      try { h.kids = [render()]; } finally { IFD--; var m = stk(0); stk(Math.max(outer, m)); }
      if (m > MS.m) MS = { m: m, base: base, ifd: IFD + 1, id: id };
      var t = MSUM[id] || (MSUM[id] = { n: 0, m: 0 }); t.n++; if (m > t.m) t.m = m;
      var kb = CUR + '/i' + (IFD + 1); if (!MB[kb] || MB[kb][0] < m) MB[kb] = [m, base];
      if (TREE) { var d = edepth([TREE]); if (d > EDMAX) EDMAX = d; }
    } else if (!v && h.kids) { unmount(h.kids); h.kids = null; }
  }
  h.w.push(RVM.$watch(cond, function (n) { set(n); }));
  set(h.w[0]._lastValue);
  return h;
}
function stkReport() {
  var ids = []; for (var k in MSUM) ids.push(k + ':' + MSUM[k].n + 'x' + MSUM[k].m);
  return 'STK peak ' + stk(0) + ' worstMount ' + J(MS) + ' ifNestMax ' + IFDMAX + ' elemDepthMax ' + EDMAX + ' perIf ' + ids.join(' ') + ' byBase ' + J(MB);
}

var CUR = '-';
function top(fn, name) { var o = CUR; CUR = name || '?'; try { fn(); } catch (e) { ESC.push((name || '?') + ': ' + e); } CUR = o; }
