// WATCH-C link; see native/wear/README.md. ES5, ASCII, tabs.
var T = 'mw', V = 1, APP = '1.1.2';
var PHONE_PKG = 'com.mrcdrnzz.dailytracker';
// build-apk.yml EXPECTED_SHA256
var PHONE_FP = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
var KEY = 'mc_q', SLOTS = 8, GAPS = [4000, 8000, 16000, 30000], QUIET = 20000, LOST = 25000;
var EFF = ['', 'easy', 'ideal', 'max'], KINDS = { c: 'complete_set', a: 'rest_add_30', s: 'rest_skip' };
var CH = 'Changed on phone', END = 'Workout ended';
var WHY = { target_missing: CH, already_committed: CH, stale_revision: CH, stale_rest: CH, invalid_state: CH,
	session_closed: END, no_session: END, wrong_session: END, unsupported: 'Update needed' };

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

function okSnap(m) {
	var s = m.set || {}, r = m.rest || {};
	return num(m.pt) && (m.sid === null || str(m.sid)) && (!m.set || str(s.id) && num(s.rev) && (s.u === 'kg' || s.u === 'lb')) && (!m.rest || str(r.id) && num(r.left));
}

function theme(th) {
	return th && th.length === 3 && str(th[0]) && str(th[1]) && str(th[2]) ? th : ['#08090a', '#f7f8f8', '#5e6ad2'];
}

function Link(io, boot) {
	var seq = 0, snapAt = 0, off = 0, rtt = -1, t0 = 0, lastRx = 0, failAt = 0, hb = 0, due = Infinity;
	var q = [], jobs = [], hellos = [], wq = [], busy = false, snap = null, eff = null, effSet = '', done = '';
	var wait = null, msg = '', stop = false, kept = false, ready = false, lost = false, on = false, pause = 0;

	function paint() { io.paint(); }
	function queue(job) { jobs.push(job); if (!busy) next(); }
	function next() { var job = jobs.shift(); busy = !!job; if (job) job(next); }
	function later(fn) {
		(io.defer || setTimeout)(function () { try { fn(); } catch (e) {} }, 0);
	}
	function kv(op, key, value, cb) {
		var once = false;
		function back(ok, v) { if (!once) { once = true; wait = null; later(function () { cb(ok, v); }); } }
		wait = { at: io.now(), back: back };
		later(function () {
			try { io.store[op]({ key: key, value: value, default: '', success: function (v) { back(true, v); }, fail: function () { back(false); } }); } catch (e) { back(false); }
		});
	}
	function text(v) {
		var j = String(v).lastIndexOf(','), b = String(v).slice(0, j);
		return j > 0 && String(sum(b) % 99991) === String(v).slice(j + 1) ? wire(b.split(',')) : '';
	}
	function slots() {
		for (var s = '', i = 0; i < q.length; i++) s += q[i].slot;
		return s;
	}
	function entry(slot, text, m) {
		return { slot: slot, text: text, id: m.commandId, set: m.setId || m.kind + m.restId, sent: 0, n: 0 };
	}

	function add(f, set, at) {
		var b = f.join(','), val = b + ',' + sum(b) % 99991, t = wire(f);
		if (set) wq.push(set);
		queue(function (fin) {
			for (var slot = -1, i = SLOTS - 1; i >= 0; i--) if (slots().indexOf(String(i)) < 0) slot = i;
			function end(m) {
				msg = m;
				if (set) wq.splice(wq.indexOf(set), 1);
				fin();
				paint();
			}
			if (slot < 0 && !lost) return end('Queue full');
			if (lost || val.length > 119 || !(sum(val) >= 0) || text(val) !== t) return end('Not saved');
			kv('set', KEY + slot, val, function (ok) {
				if (!ok) return end('Not saved');
				kv('get', KEY + slot, '', function (ok2, back) {
					if (!ok2 || back !== val) return end('Not saved');
					kv('set', KEY, slots() + slot, function (ok3) {
						if (!ok3) return end('Not saved');
						q.push(entry(slot, t, read(t)));
						msg = 'Pending ' + hms(at);
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

	function pump() { if (q[0] && !q[0].sent && !stop) fire(q[0]); }
	function fire(e) {
		e.sent = io.now();
		e.n++;
		io.send(e.text, sent);
	}
	function sent(code) {
		if (code === 207) return;
		failAt = io.now();
		hb = hb ? Math.min(hb * 2, 30000) : 5000;
		due = failAt + hb;
		paint();
	}
	function run() {
		queue(function (fin) {
			kv('get', 'mc_run', '', function (ok, v) {
				var p = String(v).split(','), c = +p[0] || 0, f = +p[1] || t0;
				if (t0 < f || t0 - f > (c > 2 ? 599999 : 120000)) c = 0;
				if (!c) f = t0;
				pause = ++c > 2 ? f : 0;
				kv('set', 'mc_run', c + ',' + f, function () {
					fin();
					if (!pause) live();
				});
			});
		});
	}
	function live() { pause = 0; on = true; io.connect(); load(); }
	function hello() {
		if (stop || !on) return;
		var now = io.now();
		due = now + QUIET;
		hellos.push(now);
		if (hellos.length > 8) hellos.shift();
		io.send(JSON.stringify({ t: T, v: V, k: 'hello', app: APP, boot: boot, wt: now, q: q.length }), sent);
	}
	function keepOn(again) {
		var want = q.length > 0 || !!(snap && snap.sid);
		if (want !== kept || (again && want)) io.keep(kept = want);
	}

	function onSnap(m, now) {
		var o = Math.round(m.pt - (m.wt + now) / 2);
		if (hellos.indexOf(m.wt) >= 0 && (rtt < 0 || now - m.wt < rtt || Math.abs(o - off) > now - m.wt)) {
			rtt = now - m.wt;
			off = o;
		}
		var id = m.set ? m.set.id : '';
		if (id !== effSet) eff = null;
		if (id !== done) done = '';
		effSet = id;
		snap = m;
		snapAt = now;
		if (q[0] && (!q[0].sent || now - q[0].sent >= 1000)) {
			q[0].n = 0;
			fire(q[0]);
		}
	}

	function onRes(m) {
		for (var i = 0; i < q.length; i++) {
			if (q[i].id !== m.commandId) continue;
			if (m.status === 'applied') {
				msg = q.length > 1 ? q.length - 1 + ' pending' : 'Saved';
				if (q[i].set) done = q[i].set;
			} else if (m.status === 'rejected') {
				msg = str(WHY[m.reason]) ? WHY[m.reason] : 'Not saved';
			} else {
				return;
			}
			drop(i);
			return pump();
		}
	}

	function rx(text) {
		var m = read(text), now = io.now();
		if (!m || stop) return;
		stop = m.v !== V;
		if (!stop) {
			lastRx = now;
			failAt = hb = 0;
			due = now + QUIET;
			if (m.k === 'snap' && okSnap(m)) onSnap(m, now);
			if (m.k === 'res') onRes(m);
			keepOn();
		}
		paint();
	}

	function tick() {
		var now = io.now(), e = q[0];
		if (wait && now - wait.at > 5000) wait.back(false);
		if (pause && now - pause > 599999) live();
		if (!stop && e && e.sent && now - e.sent >= GAPS[Math.min(e.n, 4) - 1]) fire(e);
		if (!stop && now >= due) hello();
		keepOn();
		paint();
	}

	function shown() { return eff !== null ? eff : (snap && snap.set && snap.set.e) || ''; }
	function held(id) {
		for (var h = wq.indexOf(id) >= 0, i = 0; i < q.length; i++) h = h || q[i].set === id;
		return h;
	}
	function can() {
		var s = snap && snap.sid ? snap.set : null;
		return !!(ready && !stop && s && s.r >= 1 && s.id !== done && !held(s.id));
	}
	function cmd(code, set, effort) {
		var at = Math.round(io.now() + off), s = snap.set;
		add([code, boot + '-' + ++seq, snap.sid, at].concat(code === 'c' ? [s.id, s.rev, s.w == null ? '' : s.w, s.u, s.r, effort] : [snap.rest.id]), set, at);
	}

	function view() {
		var now = io.now(), s = snap && snap.sid && snap.set, r = snap && snap.sid && snap.rest, th = theme(snap && snap.th);
		var v = { l1: '', l2: '', eff: '', rest: '', st: msg, p1: '', p2: '', set: false, can: false, rs: false, add: false, bg: th[0], fg: th[1], ac: th[2], cb: '#3a3a3a' };
		if (stop || pause) {
			v.st = '';
			v.l1 = pause ? 'Paused after restarts' : 'Update needed';
			if (pause) v.l2 = 'Try again in 10 min';
			return v;
		}
		if (failAt > 0 || (lastRx ? now - lastRx > LOST : now - t0 > 5000)) {
			v.p1 = 'Phone not connected';
			v.p2 = 'Open M/ARC on your phone';
		}
		if (snap && !snap.sid) {
			v.l1 = 'Start your workout';
			v.l2 = 'in M/ARC on your phone';
		} else if (snap) {
			v.l1 = snap.ex ? snap.ex + ' ' + snap.si + '/' + snap.sn : 'All sets done';
			v.l2 = snap.ex ? 'Log on phone' : '';
		}
		if (s) {
			var reps = s.r == null ? '-' : s.r;
			v.l2 = s.w == null ? reps + ' reps' : s.w + ' ' + s.u + ' x ' + reps;
			v.eff = ['Effort', 'Easy', 'Ideal', 'Max'][EFF.indexOf(shown())] || 'Effort';
			v.set = true;
			v.can = can();
			if (v.can) v.cb = v.ac;
		}
		if (r) {
			var left = r.p ? r.left : Math.max(0, r.left - (now - snapAt));
			v.rest = 'Rest ' + mss(left);
			v.rs = true;
			v.add = left > 0;
		}
		return v;
	}

	return {
		rx: rx, tick: tick, view: view,
		start: function () { t0 = io.now(); run(); },
		show: function () { hello(); keepOn(true); },
		complete: function () { if (can()) cmd('c', snap.set.id, shown()); },
		rest: function (kind) {
			var k = kind === 'rest_skip' && snap && snap.rest ? kind + snap.rest.id : '';
			if (ready && !stop && snap && snap.sid && snap.rest && !(k && held(k))) cmd(k ? 's' : 'a', k, '');
		},
		effort: function () {
			if (snap && snap.set) eff = EFF[(EFF.indexOf(shown()) + 1) % EFF.length];
			paint();
		}
	};
}

export { PHONE_PKG, PHONE_FP, makeBoot, sum, wire, Link };
