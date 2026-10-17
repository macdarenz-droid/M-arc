// WATCH-C link: native/wear/README.md
var T = 'mw', V = 1, APP = '1.1.2';
var PHONE_PKG = 'com.mrcdrnzz.dailytracker';
var PHONE_FP = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
var KEY = 'm2q', RUN = 'm2r';
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
function okSnap(m) {
	var s = m.set || {}, r = m.rest || {};
	return num(m.pt) && nn(m.wt) && (m.sid === null || str(m.sid)) && (m.ex == null || str(m.ex) && num(m.si) && num(m.sn)) &&
		(!m.set || str(s.id) && num(s.rev) && (s.u === 'kg' || s.u === 'lb') && nn(s.w) && nn(s.r) && (s.e == null || str(s.e))) && (!m.rest || str(r.id) && num(r.left));
}

// io: store, send(text, done(code)), keep(on), connect(), paint(), now(), defer(fn, 0)
function Link(io, boot) {
	// tk counts 1 s ticks, the clock of every timer; io.now() is for actionAt and the offset only
	var tk = 0, seq = 0, snapTk = 0, off = 0, rtt = -1, lastRx = -1, fail = 0, hb = 0, due = Infinity;
	var q = [], jobs = [], hellos = [], wq = [], busy = 0, snap = 0, eff = null, effSet = '', done = '';
	var wait = 0, msg = '', stop = 0, kept = false, ready = 0, lost = 0, on = 0, pause = 0, calm = 0, dead = 0, sick = 0;

	function no() {}
	function later(fn) {
		if (!dead) (io.defer || setTimeout)(function () { if (!dead) try { fn(); } catch (e) {} }, 0);
	}
	// one job at a time, each on a fresh stack
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
	// answered on a fresh stack; silent for 5 ticks, it fails and storage stays off
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
		return h >= 0 && String(h % 99991) === String(v).slice(j + 1) && f.length === { c: 10, a: 5, s: 5 }[f[0]] ? wire(f) : '';
	}
	function slots() {
		for (var s = '', i = 0; i < q.length; i++) s += q[i].slot;
		return s;
	}
	function entry(slot, text, m) {
		return { slot: slot, text: text, id: m.commandId, set: m.setId || m.kind + m.restId, at: 0, n: 0 };
	}

	function add(code, set, effort) {
		var at = Math.round(io.now() + off), s = snap.set, f = [code, boot + '-' + ++seq, snap.sid, at].concat(code === 'c' ? [s.id, s.rev, s.w == null ? '' : s.w, s.u, s.r, effort] : [snap.rest.id]);
		var b = f.join(','), val = b + ',' + sum(b) % 99991, t = wire(f);
		if (set) wq.push(set);
		queue(function (fin) {
			for (var slot = -1, i = 7; i >= 0; i--) if (slots().indexOf(String(i)) < 0) slot = i;
			function end(m) {
				msg = m;
				if (set) wq.splice(wq.indexOf(set), 1);
				fin();
				io.paint();
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
		snapTk = tk;
		if (q[0] && (!q[0].n || tk > q[0].at)) {
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
				msg = str(m.reason) && str(WHY[m.reason]) ? WHY[m.reason] : 'Not saved';
			} else {
				return;
			}
			drop(i);
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
			keepOn();
		}
		io.paint();
	}

	function tick() {
		var e = q[0];
		if (dead) return;
		tk++;
		if (wait && tk - wait.at > 5) wait.give(false, sick = 1);
		// a lost start is retried; a job silent for 10 ticks is given up, storage off
		if (busy && tk - busy.at > 5 && busy.job) go();
		if (busy && tk - busy.at > 10) next(sick = 1);
		if (pause && tk >= pause) live();
		if (on && !calm && tk - on >= 30) queue(function (fin) { kv('set', RUN, '0,r', fin); }, calm = 1); // not a quick restart
		if (!stop && e && e.n && tk - e.at >= Math.min(4 << Math.min(e.n, 4) - 1, 30)) fire(e);
		if (!stop && tk >= due) hello();
		keepOn();
		io.paint();
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

	function view() {
		var s = snap && snap.sid && snap.set, r = snap && snap.sid && snap.rest, th = snap && snap.th;
		if (!(th && th.length === 3 && str(th[0]) && str(th[1]) && str(th[2]))) th = ['#08090a', '#f7f8f8', '#5e6ad2'];
		var v = { l1: '', l2: '', eff: '', rest: '', st: msg, p1: '', p2: '', set: false, can: false, rs: false, add: false, bg: th[0], fg: th[1], ac: th[2], cb: '#3a3a3a' };
		if (stop || pause) {
			v.st = '';
			v.l1 = pause ? 'Paused after restarts' : 'Update needed';
			if (pause) v.l2 = 'Try again in 10 min';
			return v;
		}
		if (fail || (lastRx < 0 ? tk > 5 : tk - lastRx > 25)) {
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
			var left = r.p ? r.left : Math.max(0, r.left - (tk - snapTk) * 1000);
			v.rest = 'Rest ' + mss(left);
			v.rs = true;
			v.add = left > 0;
		}
		return v;
	}

	return {
		rx: rx, tick: tick, view: view,
		start: run,
		// onDestroy: a live run with no call in flight is marked clean by one direct write
		die: function () {
			dead = 1;
			if (on && !pause && !sick && !wait) try { io.store.set({ key: RUN, value: '0,c', success: no, fail: no }); } catch (e) {}
		},
		show: function () { if (!dead) { hello(); keepOn(true); } },
		complete: function () { if (can()) add('c', snap.set.id, shown()); },
		rest: function (kind) {
			var k = kind === 'rest_skip' && snap && snap.rest ? kind + snap.rest.id : '';
			if (ready && !stop && snap && snap.sid && snap.rest && !(k && held(k))) add(k ? 's' : 'a', k, '');
		},
		effort: function () {
			if (snap && snap.set) eff = EFF[(EFF.indexOf(shown()) + 1) % EFF.length];
			io.paint();
		}
	};
}

export { PHONE_PKG, PHONE_FP, makeBoot, sum, wire, Link };
