// WATCH-C link: native/wear/README.md
var T = 'mw', V = 1, APP = '1.4.0';
var PHONE_PKG = 'com.mrcdrnzz.dailytracker';
var PHONE_FP = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
var KEY = 'm2q', RUN = 'm2r';
var EFF = ['', 'easy', 'ideal', 'max'], KINDS = { c: 'complete_set', a: 'rest_add_30', s: 'rest_skip', m: 'rest_sub_15', p: 'rest_add_15' };
var RK = { rest_add_30: 'a', rest_skip: 's', rest_sub_15: 'm', rest_add_15: 'p' };
var CH = 'Changed on phone', END = 'Workout ended';
var WHY = { target_missing: CH, already_committed: CH, stale_revision: CH, stale_rest: CH, invalid_state: CH,
	session_closed: END, no_session: END, wrong_session: END, unsupported: 'Update needed' };
var PL = '#232428', AC = '#5e6ad2', BG = '#08090a';

function num(x) { return typeof x === 'number'; }
function str(x) { return typeof x === 'string'; }
function two(n) { return (n < 10 ? '0' : '') + n; }
function hms(ms) { var d = new Date(ms); return two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()); }
function mss(ms) { var s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + two(s % 60); }
function sum(t) {
	for (var h = 0, i = 0, c; i < t.length; i++) h = (c = t.charCodeAt(i)) < 33 || c > 126 ? NaN : (h * 31 + c) % 2147483647;
	return h;
}

function makeBoot(rand) {
	for (var s = '', i = 0, k; i < 8; i++) s += '0123456789abcdefghijklmnopqrstuvwxyz'.charAt((k = Math.floor((rand || Math.random)() * 36)) >= 0 && k < 36 ? k : 0);
	return s;
}

function read(text) {
	if (!str(text) || text.length > 2048) return null;
	try { var m = JSON.parse(text); } catch (e) { return null; }
	return Object(m) === m && m.t === T ? m : null;
}

function wire(f) {
	var c = { t: T, v: V, k: 'cmd', commandId: f[1], sessionId: f[2], actionAt: +f[3], kind: KINDS[f[0]] };
	if (f[0] !== 'c') c.restId = f[4];
	else {
		c.setId = f[4];
		c.expectedRev = +f[5];
		if (f[6] !== '') c.load = { value: +f[6], unit: f[7] };
		c.reps = +f[8];
		if (f[9]) c.effort = f[9];
	}
	return JSON.stringify(c);
}

function nn(x) { return x == null || num(x); }
function okSet(s) { return str(s.id) && num(s.rev) && (s.u === 'kg' || s.u === 'lb') && nn(s.w) && nn(s.r) && (s.e == null || str(s.e)) && nn(s.st); }
function okLt(l) { return !l || Object(l) === l && nn(l.w) && nn(l.r) && (l.u === 'kg' || l.u === 'lb'); }
function okSnap(m) {
	var r = m.rest || {}, n = m.nx || [], f = m.fin, l = f == null ? [] : Array.isArray(f) && str(f[0]) && f[1], i, ok = num(m.pt) && nn(m.wt) && (m.sid === null || str(m.sid)) && (m.ex == null || str(m.ex) && num(m.si) && num(m.sn)) &&
		(!m.set || okSet(m.set)) && (!m.rest || str(r.id) && num(r.left)) && (m.eid == null || str(m.eid)) && okLt(m.lt) && nn(m.rs) && Array.isArray(n) && Array.isArray(l) && l.length < 5;
	for (i = 0; ok && i < n.length; i++) ok = Array.isArray(r = n[i]) && str(r[0]) && num(r[1]) && nn(r[2]) && nn(r[3]) && (r[4] === void 0 || num(r[4]) && r[4] > m.si && r[4] <= m.sn && r[4] % 1 === 0);
	for (i = 0; ok && i < l.length; i++) ok = str(l[i]) && l[i].length < 25;
	return ok;
}
function okPlan(m) {
	var r = m.rows, ok = str(m.sid) && num(m.srev) && num(m.sd) && num(m.st) && Array.isArray(r);
	for (var i = 0, o; ok && i < r.length; i++) ok = Object(o = r[i]) === o && str(o.id) && str(o.ex) && num(o.d) && num(o.n) && (!o.set || okSet(o.set)) && okLt(o.lt);
	return ok;
}
// C4: rest step (ms) at L ms left; -15 s keeps 5 s
function step(k, L) { var s = k.slice(9) * 1e3; return k.charAt(5) > 'a' ? -Math.min(s, Math.max(0, L - 5e3)) : s; }
function fmt(s) { var r = s.r == null ? '-' : s.r; return s.w == null ? r + ' reps' : s.w + ' ' + s.u + ' x ' + r; }

// io: store, send(text, done(code)), keep(on), connect(), paint(), now(), defer(fn), buzz(), hl(p)
function Link(io, boot) {
	// tk: 1 s ticks, every timer's clock; io.now(): actionAt, offset, clock
	var tk = 0, seq = 0, snapTk = 0, off = 0, rtt = -1, lastRx = -1, fail = 0, hb = 0, due = Infinity;
	var q = [], jobs = [], hellos = [], wq = [], busy = 0, snap = 0, eff = null, effSet = '', dl = [];
	var wait = 0, msg = '', stop = 0, kept = false, ready = 0, lost = 0, on = 0, pause = 0, calm = 0, dead = 0, sick = 0;
	var plan = 0, pk, ps, pe, pg = 0, sv, svR, lq, bn = 0, bj = 0, sy, hi, bad = 0;
	var ad = 0, af = 0, lr = 0, rn = '', rk, bz, ko, ht = 0, bp, hz, it = 0, hp, hs, hn, ls, fq, wk, fr = 0;

	function no() {}
	function later(fn) {
		if (!dead) (io.defer || setTimeout)(function () { if (!dead) try { fn(); } catch (e) {} }, 0);
	}
	function queue(job) { jobs.push(job); if (!busy) next(); }
	function next() {
		var job = jobs.shift();
		busy = job && { at: tk, job: job };
		if (job) later(go);
	}
	function go() {
		var j = busy && busy.job;
		if (j) {
			busy.job = 0;
			j(next);
		}
	}
	// answered on a fresh stack; silent 5 ticks: fails, storage off
	function kv(op, key, value, cb) {
		var once = 0, o = { key: key, success: function (v) { back(true, v); }, fail: function () { back(false); } };
		function give(ok, v) { if (!once) { once = 1; wait = 0; cb(ok, v); } }
		function back(ok, v) { later(function () { give(ok, v); }); }
		o[op === 'set' ? 'value' : 'default'] = value;
		wait = { at: tk, give: give };
		if (busy) busy.at = tk;
		later(sick ? function () { give(false); } : function () { try { io.store[op](o); } catch (e) { back(false); } });
	}
	function text(v) {
		var j = String(v).lastIndexOf(','), b = String(v).slice(0, j), f = b.split(','), h = sum(b);
		return h >= 0 && String(h % 99991) === String(v).slice(j + 1) && f.length === { c: 10, a: 5, s: 5, m: 5, p: 5 }[f[0]] ? wire(f) : '';
	}
	function slots() {
		for (var s = '', i = 0; i < q.length; i++) s += q[i].slot;
		return s;
	}
	function entry(slot, text, m) {
		return { slot: slot, text: text, id: m.commandId, set: m.setId || m.kind + m.restId, k: m.kind, rev: m.expectedRev, t: m.actionAt, at: 0, n: 0 };
	}

	function add(code, set, effort) {
		var at = Math.round(io.now() + off), s = cs(), d = dv(s), f = [code, boot + '-' + ++seq, snap.sid, at].concat(code === 'c' ? [s.id, s.rev, d.w == null ? '' : d.w, s.u, d.r, effort] : [snap.rest.id]);
		var L = code === 'c' && snap.rs > 0 && { i: (snap.rest || 0).id, left: snap.rs * 1000, id: tk, c: f[1] };
		var b = f.join(','), val = b + ',' + sum(b) % 99991, t = wire(f);
		if (set) wq.push(set);
		queue(function (fin) {
			for (var slot = -1, i = 7; i >= 0; i--) if (slots().indexOf(String(i)) < 0) slot = i;
			function end(m) {
				msg = m;
				if (set) wq.splice(wq.indexOf(set), 1);
				fresh();
				fin();
				later(io.paint);
			}
			if (lost || sick || val.length > 119 || !(sum(val) >= 0) || text(val) !== t) return end('Not saved');
			if (slot < 0) return end('Queue full');
			kv('set', KEY + slot, val, function (ok) {
				if (!ok) return end('Not saved');
				kv('get', KEY + slot, '', function (ok2, back) {
					if (!ok2 || back !== val) return end('Not saved');
					kv('set', KEY, slots() + slot, function (ok3) {
						if (!ok3) return end('Not saved');
						q.push(entry(slot, t, read(t)));
						msg = 'Pending ' + hms(at);
						if (L) lr = L;
						if (code === 's') ko = rk = bz = f[4];
						pump();
						end(msg);
					});
				});
			});
		});
	}

	function drop(i) {
		q.splice(i, 1);
		queue(function (fin) { if (lost) fin(); else kv('set', KEY, slots() || '-', fin); });
	}

	function load() {
		queue(function (fin) {
			kv('get', KEY, '', function (ok, list) {
				var i = 0, keep = '';
				list = String(list) === '-' ? '' : String(list);
				lost = !ok;
				function finish() {
					if (q.length) msg = q.length + ' pending';
					ready = true;
					fin();
					hello();
					pump();
				}
				function one() {
					while (ok && i < list.length) {
						var slot = list.charAt(i++);
						if ('01234567'.indexOf(slot) < 0 || keep.indexOf(slot) >= 0) continue;
						return kv('get', KEY + slot, '', function (ok2, v) {
							var t = ok2 && text(v);
							lost = lost || !ok2;
							if (t) {
								keep += slot;
								q.push(entry(Number(slot), t, read(t)));
							}
							one();
						});
					}
					if (!lost && keep !== list) kv('set', KEY, keep || '-', finish);
					else finish();
				}
				one();
			});
		});
	}

	function pump() { if (q[0] && !q[0].n && !stop) fire(q[0]); }
	function fire(e) {
		e.at = tk;
		e.n++;
		io.send(e.text, sent);
	}
	function sent(code) {
		bad = code !== 207;
		if (code === 207 || dead) return;
		fail = 1;
		hb = hb ? Math.min(hb * 2, 30) : 5;
		due = tk + hb;
		io.paint();
	}
	// m2r = "n,x", the restart guard in README
	function run() {
		queue(function (fin) {
			kv('get', RUN, '', function (ok, v) {
				var p = String(v).split(','), n = +p[0], x = p[1], left = 600000 - (io.now() - x);
				if (!ok) return fin(pause = tk + 600);
				if (+x > 0 && left > 0 && left <= 600000) return fin(pause = tk + Math.ceil(left / 1000));
				n = x === 'r' ? (n >= 0 && n < 99 && n % 1 === 0 ? n : 0) + 1 : +x > 0 ? 1 : 0;
				pause = n > 1 ? tk + 600 : 0;
				kv('set', RUN, n + ',' + (pause ? io.now() : 'r'), function () {
					fin();
					if (!pause) live();
				});
			});
		});
	}
	function live() {
		if (dead) return;
		pause = 0;
		on = tk + 1;
		io.connect();
		load();
	}
	function hello() {
		if (stop || !on || dead) return;
		var now = io.now();
		due = tk + 20;
		hellos.push(now);
		if (hellos.length > 8) hellos.shift();
		io.send(JSON.stringify({ t: T, v: V, k: 'hello', app: APP, boot: boot, wt: now, q: q.length }), sent);
	}
	function keepOn(again) {
		var want = q.length > 0 || !!(snap && snap.sid);
		if (want !== kept || (again && want)) io.keep(kept = want);
	}

	function onSnap(m, now) {
		var o = Math.round(m.pt - (m.wt + now) / 2), i, n, s;
		if (hellos.indexOf(m.wt) >= 0 && (rtt < 0 || now - m.wt < rtt || Math.abs(o - off) > now - m.wt)) {
			rtt = now - m.wt;
			off = o;
		}
		if (m.sid !== snap.sid) pg = lr = 0;
		// C4: heart stats per session; Done once
		if (m.sid) fq = 0, m.sid !== ls && (ls = m.sid, hp = hs = hn = 0);
		else if (m.fin && m.fin[0] === ls) for (ls = fr = 0, fq = {}, n = m.fin[1].concat(hn ? ['Peak ' + hp + ' bpm, avg ' + Math.round(hs / hn)] : []), i = 0; i < 5;) fq['h' + ++i] = n[i - 1] || '';
		if (m.rest && m.rest.id !== lr.i || lr.d) {
			if (m.rest && lr.d && bz === lr.id) bz = m.rest.id, rk = rk === lr.id ? bz : rk;
			lr = 0;
		}
		for (m.xs = [s = m.set], i = 0; s && m.nx && i < m.nx.length; i++) n = m.nx[i], m.xs.push({ id: n[0], rev: n[1], w: n[2], u: s.u, r: n[3], k: n[4] - m.si || i + 1 });
		snap = m;
		ko = '';
		snapTk = tk;
		if (svR === '') svR = m.rest ? m.rest.id : 0;
		fresh();
		if (q[0] && (!q[0].n || tk > q[0].at)) {
			q[0].n = 0;
			fire(q[0]);
		}
	}

	// a new set clears the effort draft and closes Adjust
	function fresh() {
		var s = cs(), id = s ? s.id : '';
		if (id !== effSet) eff = null, it = tk;
		effSet = id;
		if (!ao()) af = 0;
	}
	function pr(id) { for (var r = up() ? plan.rows : [], i = 0; i < r.length; i++) if (r[i].id === id) return r[i]; }
	// a pick holds while sid, eid and its row stay
	function row() {
		var r = pk && snap.sid === ps && snap.eid === pe && pr(pk);
		if (!r) pk = '';
		return r;
	}
	// plan row: the pick's, or the shown one's with the snap's set
	function nr() { var r = row(), e = pr(snap.eid); return r || e && (e.set || 0).id === (snap.set || 0).id && e; }
	// the first free of set, nx (a pick: its row), else the last
	function xs() { var r = row(); return r ? [r.set] : snap.xs || [0]; }
	function free(s) { return s && !held(s.id) && dl.indexOf(s.id + ':' + s.rev) < 0; }
	function cs() { for (var o = xs(), i = 0; i < o.length - 1 && !free(o[i]); i++); return o[i]; }
	function dv(s) { return s && ad && ad.id === s.id && ad.rev === s.rev && ad.u === s.u ? ad : s; }
	function ao() { var s = cs(); return af && free(s) && dv(s) === ad; }
	// C4: reps 1-100; w +-1 keeps decimals; d wheel .00-.75; load in (0, 1000 kg or 2200 lb]
	function bump(d) {
		var v = ad.w || 0, W = Math.floor(v), x = Math.round((v - W) * 100) / 25, M = ad.u == 'lb' ? 2200 : 1e3;
		if (af === 'r') x = (ad.r || 0) + d, ad.r = x < 1 ? 1 : x > 100 ? 100 : x;
		else x = af === 'w' ? Math.round((v + d) * 100) / 100 : W + ((d > 0 ? Math.floor(x) + 1 : Math.ceil(x) + 3) % 4) / 4, ad.w = x > M ? M : x > 0 ? x : ad.w;
	}
	function rst() {
		var r = lr.on ? lr : snap.sid && snap.rest, L = r && (r.p ? r.left : r.left - (tk - (r === lr ? r.id : snapTk)) * 1000), x = r && { id: r.id, left: Math.max(0, L + pa(r, L)), p: r.p };
		return x && x.id !== ko && x;
	}
	// offline, its queued steps, each at its tap
	function pa(r, L) {
		for (var n = 0, i = 0, e; r !== lr && (bad || gone()) && i < q.length; i++) if ((e = q[i]).set === e.k + r.id) n += step(e.k, L + n + (r.p ? 0 : io.now() + off - e.t));
		return n;
	}
	// wake: a running rest crossing 10 s, Rest done
	function ring() {
		var r = rst() || {};
		if (r.left > 0) rn = r.id, r.left > 1e4 ? wk = 0 : r.p || wk === r.id || (wk = r.id, it = tk);
		else if (r.id === rn && bz !== rn) bz = rn, it = tk, (io.buzz || no)();
	}
	function up() { return snap.sid && plan.sid === snap.sid; }

	function onRes(m) {
		for (var i = 0, c, o, j, k; i < q.length; i++) {
			if (q[i].id !== m.commandId) continue;
			if (k = m.status === 'applied' || m.reason === 'stale_rest') {
				if (msg !== bj) msg = q.length > 1 ? q.length - 1 + ' pending' : 'Saved';
				if (dl.push(q[i].set + ':' + q[i].rev) > 16) dl.shift();
				for (o = xs(), j = 0; j < o.length && (o[j] || 0).id !== q[i].set; j++);
				if (j < o.length) sv = ((c = nr()) ? c.d + 1 : snap.si) + (o[j].k || 0), svR = '';
				if (bn++, m.status === 'applied') hi = tk + 2;
			} else if (m.status === 'rejected') {
				msg = str(m.reason) && str(WHY[m.reason]) ? WHY[m.reason] : 'Not saved';
				// kept until a new tap (611b09c8)
				bj = (lq || q.length > 1) && msg;
			} else {
				return;
			}
			if (lr.c === m.commandId) lr.d = 1;
			drop(i);
			if (!q.length) sy = lq ? (k && !bj ? tk + 3 : 0) : sy, lq = bj = 0;
			fresh();
			return pump();
		}
	}

	function rx(text) {
		var m = read(text), now = io.now();
		if (!m || stop || dead) return;
		stop = m.v !== V;
		if (!stop) {
			lastRx = tk;
			fail = hb = 0;
			due = tk + 20;
			if (m.k === 'snap' && okSnap(m)) onSnap(m, now);
			if (m.k === 'res') onRes(m);
			if (m.k === 'plan' && okPlan(m)) fresh(plan = m);
			if (!q.length) bad = 0;
			keepOn();
		}
		io.paint();
	}

	function tick() {
		var e = q[0];
		if (dead) return;
		tk++;
		if (wait && tk - wait.at > 5) wait.give(false, sick = 1);
		// a lost start is retried; a job silent 10 ticks: storage off
		if (busy && tk - busy.at > 5 && busy.job) go();
		if (busy && tk - busy.at > 10) next(sick = 1);
		if (pause && tk >= pause) live();
		if (on && !calm && tk - on >= 30) queue(function (fin) { kv('set', RUN, '0,r', fin); }, calm = 1);
		if (!stop && e && e.n && tk - e.at >= Math.min(4 << Math.min(e.n, 4) - 1, 30)) fire(e);
		if (hi && tk >= hi) hello(hi = 0);
		if (!stop && tk >= due) hello();
		if ((gone() || bad) && q.length && !lq) lq = 1, bn = 0;
		if (tk - lr.id > 1) lr.on = 1;
		if (fq && ready && !q.length && !busy && !wait && tk >= fr) later((io.hl || no).bind(0, fq)), fr = tk + 3;
		ring();
		keepOn();
		io.paint();
	}
	function gone() { return fail || (lastRx < 0 ? tk > 5 : tk - lastRx > 25); }

	function shown() { var s = cs(); return eff !== null ? eff : (s && s.e) || ''; }
	function held(id) {
		for (var h = wq.indexOf(id) >= 0, i = 0; i < q.length; i++) h = h || q[i].set === id;
		return h;
	}
	function can() {
		var s = snap.sid && cs();
		return !!(ready && !stop && free(s) && s.r >= 1);
	}

	function view() {
		var c = snap.sid && row(), x = c || snap, s = snap.sid && cs(), r = rst(), th = snap.th, j = s && s.k || 0, f = tk - ht < 16 && bp;
		var a = c ? c.d + 1 : snap.si, b = c ? c.n : snap.sn, rows = up() && plan.rows, left = 0, i, o, k;
		if (!(th && th.length === 3 && str(th[0]) && str(th[1]) && str(th[2]))) th = ['#08090a', '#f7f8f8', '#5e6ad2'];
		var v = { l1: '', l2: '', eff: '', rest: '', st: msg, p1: '', p2: '', set: false, can: false, rs: false, add: false, bg: th[0], fg: th[1], ac: th[2], cb: PL,
			off: 0, ck: hms(io.now() + off).slice(0, 5), sc: 0, hm: f ? f + ' bpm' : 'M/ARC', hd: f ? Math.round(12000 / (Math.round(f / 5) || 1)) + 'ms' : '', hv: !!f,
			im: '/common/h.png', hc: '#a9aef0', kc: '#f7f8f8', hr: hz ? 'Allow Body sensors' : '' };
		if (stop || pause) {
			v.st = '';
			v.l1 = pause ? 'Paused after restarts' : 'Update needed';
			if (pause) v.l2 = 'Try again in 10 min';
			return v;
		}
		if (gone()) {
			v.p1 = 'Phone not connected';
			v.p2 = 'Open M/ARC on your phone';
		}
		// offline also while a pending send fails
		if (gone() || bad && q.length) v.off = 1, v.hc = '#f2b56b', f && !hz && (v.hr = v.hm);
		if (snap && !snap.sid) {
			v.l1 = 'Start your workout';
			v.l2 = 'in M/ARC on your phone';
		} else if (snap) {
			v.l1 = x.ex ? x.ex + ' ' + a + '/' + b : 'All sets done';
			v.l2 = x.ex ? 'Log on phone' : '';
		}
		if (s) {
			v.l2 = fmt(dv(s));
			v.eff = ['Effort', 'Easy', 'Ideal', 'Max'][EFF.indexOf(shown())] || 'Effort';
			v.set = true;
			v.can = can();
			if (v.can) v.cb = AC;
		}
		if (r) {
			left = r.left;
			v.rest = 'Rest ' + mss(left);
			v.rs = true;
			v.add = left > 0;
			v.rc = mss(left);
		}
		if (k = ao()) o = ad[af === 'r' ? 'r' : 'w'], v.ak = { r: 'REPS', d: 'DECIMALS' }[af] || ad.u.toUpperCase(), v.av = o == null ? '-' : af === 'd' ? o.toFixed(2) : '' + o;
		// 1 Set, 2 Rest, 3 Up next, 4 Offline, 5 Back in sync, 6 Rest done, 7 Adjust, 0 l1 l2
		v.sc = v.off && (q.length || !snap) && !free(s) ? 4 : k ? 7 : tk < sy ? 5 : rows && pg ? 3 : left > 0 ? 2 : r && r.id === rn && r.id !== rk ? 6 :
			snap.sid && x.ex ? 1 : 0;
		// C4: idle 15 s after a wake, on Set and Rest
		if (v.dm = tk - it > 14 && v.sc > 0 && v.sc < 3 ? 1 : 0) v.hc = v.kc = '#3a3a40', v.im = '/common/hd.png';
		k = v.sc > 4 ? bn : q.length;
		v.na = k ? k + ' action' + (k > 1 ? 's' : '') : '';
		v.nm = x.ex || '';
		a = ((o = nr()) ? o.d + 1 : snap.si) + j;
		b = o ? o.n : snap.sn;
		v.sp = 'SET ' + a + ' OF ' + b;
		v.la = x.lt && !j ? 'Last time ' + fmt(x.lt) : '';
		v.nx = v.nm && 'Next: ' + v.nm;
		v.ns = v.nm && 'Set ' + a + ' of ' + b + (s ? ', ' + v.l2 : '');
		v.sl = msg === 'Saved' ? (left > 0 && svR === r.id ? 'Set ' + sv + ' saved' : '') : left > 0 || msg.indexOf('Pending') ? msg : '';
		v.cl = 'Complete set';
		for (i = 0; s && i < q.length; i++) if (q[i].set === s.id) v.cl = 'Pending ' + hms(q[i].t);
		for (i = 1; i < 4; i++) v['e' + i] = EFF[i] === shown() ? AC : PL;
		v.dn = rows ? plan.sd + ' of ' + plan.st + ' sets done' : '';
		for (i = 0; rows && i < 4; i++) {
			o = rows[i];
			v['r' + i] = o ? o.ex : '';
			v['n' + i] = o ? o.d + '/' + o.n : '';
			v['b' + i] = !o ? BG : o.id === (c ? c.id : snap.eid) ? AC : PL;
		}
		return v;
	}

	return {
		rx: rx, tick: tick, view: view,
		start: run,
		// onDestroy: no call in flight: marked clean by one write
		die: function () {
			dead = 1;
			if (on && !pause && !sick && !wait) try { io.store.set({ key: RUN, value: '0,c', success: no, fail: no }); } catch (e) {}
		},
		show: function () { if (!dead) { it = tk; hello(); keepOn(true); io.paint(); } },
		touch: function () { it = tk; io.paint(); },
		complete: function () { if (can()) add('c', cs().id, shown()); },
		rest: function (kind) {
			var k = kind === 'rest_skip' && snap && snap.rest ? kind + snap.rest.id : '', c = RK[kind];
			if (lr.on) c && (kind === 'rest_skip' ? lr = 0 : lr.left += step(kind, rst().left)), io.paint();
			else if (c && ready && !stop && snap && snap.sid && snap.rest && !(k && held(k))) add(c, k, '');
		},
		effort: function (k) {
			if (cs()) eff = !k ? EFF[(EFF.indexOf(shown()) + 1) % EFF.length] : EFF[k] === shown() ? '' : EFF[k];
			io.paint();
		},
		next: function (d) {
			if (ao()) d === 'up' ? bump(1) : d === 'down' ? bump(-1) : (d === 'left' || d === 'right') && (af = { w: 'dr', d: 'rw', r: 'wd' }[af].charAt(d === 'left'));
			else if (up()) pg = !d ? 1 : d === 'up' || d === 'down' ? 1 - pg : pg;
			it = tk;
			io.paint();
		},
		pick: function (i) {
			var r = up() && plan.rows[i];
			if (r) pk = r.id === snap.eid ? '' : r.id, ps = snap.sid, pe = snap.eid, pg = 0, fresh();
			io.paint();
		},
		// adj() opens, adj(+-1) steps, adj(0) closes; beat(bpm or -code)
		ok: function () { rk = (rst() || 0).id; io.paint(); },
		adj: function (d) {
			var s = cs(), k;
			it = tk;
			if (d === 0) af = 0;
			else if (d) ao() && bump(d);
			else if (can()) {
				if (dv(s) !== ad) for (k in (ad = {}, s)) ad[k] = s[k];
				af = ad.w == null ? 'r' : 'w';
			}
			io.paint();
		},
		beat: function (x) {
			if ((x = Math.round(x)) > 24 && x < 251) bp = x, ht = tk, snap.sid && (hp = Math.max(hp, bp), hs += bp, hn++);
			else if (!(x > 0)) ht = -99;
			hz = x === -602;
		}
	};
}

export { PHONE_PKG, PHONE_FP, makeBoot, sum, wire, Link };
