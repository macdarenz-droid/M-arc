// WATCH-C: protocol mw v1, outbox and screen text (native/wear/README.md, Gate C). ES5, ASCII.
var T = 'mw', V = 1, APP = '1.1.0';
var PHONE_PKG = 'com.mrcdrnzz.dailytracker';
// build-apk.yml EXPECTED_SHA256
var PHONE_FP = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
var KEY = 'mc_q', SLOTS = 8; // index; slots mc_q0..7
var GAPS = [4000, 8000, 16000, 30000];
var QUIET = 20000, LOST = 25000; // ms without a phone message
var EFF = ['', 'easy', 'ideal', 'max'];
var NAME = { easy: 'Easy', ideal: 'Ideal', max: 'Max' };
var CH = 'Changed on phone';
var END = 'Workout ended';
var WHY = { target_missing: CH, already_committed: CH, stale_revision: CH, stale_rest: CH, invalid_state: CH,
  session_closed: END, no_session: END, wrong_session: END, unsupported: 'Update needed' };

function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
function num(x) { return typeof x === 'number'; }
function str(x) { return typeof x === 'string'; }
function two(n) { return (n < 10 ? '0' : '') + n; }
function hms(ms) {
  var d = new Date(ms);
  return two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds());
}
function mss(ms) {
  var s = Math.ceil(ms / 1000);
  return Math.floor(s / 60) + ':' + two(s % 60);
}

// command ids are <boot>-<seq>
function makeBoot(rand) {
  var s = '';
  for (var i = 0; i < 8; i++) {
    var k = Math.floor((rand || Math.random)() * 36);
    s += '0123456789abcdefghijklmnopqrstuvwxyz'.charAt(k >= 0 && k < 36 ? k : 0);
  }
  return s;
}

function read(text) {
  try {
    var m = JSON.parse(text);
    return Object(m) === m && m.t === T ? m : null;
  } catch (e) {
    return null;
  }
}

// fixed key order; sends the load and effort shown
function makeCmd(id, snap, kind, at, effort) {
  var c = { t: T, v: V, k: 'cmd', commandId: id, sessionId: snap.sid, actionAt: at, kind: kind };
  var s = snap.set;
  if (kind !== 'complete_set') {
    c.restId = snap.rest.id;
  } else {
    c.setId = s.id;
    c.expectedRev = s.rev;
    if (s.w != null) c.load = { value: s.w, unit: s.u };
    c.reps = s.r;
    if (effort) c.effort = effort;
  }
  return JSON.stringify(c);
}

function okSnap(m) {
  var s = m.set;
  if (s && (!str(s.id) || !num(s.rev) || (s.u !== 'kg' && s.u !== 'lb'))) return false;
  return num(m.pt) && (m.sid === null || str(m.sid)) && (!m.rest || (str(m.rest.id) && num(m.rest.left)));
}

// the phone's three colours, else Silent Black
function theme(th) {
  return th && th.length === 3 && str(th[0]) && str(th[1]) && str(th[2]) ? th : ['#08090a', '#f7f8f8', '#5e6ad2'];
}

// io: store (@system.storage), send(text, done(code)), keep(on), now(), paint()
function Link(io, boot) {
  var seq = 0, snapAt = 0, off = 0, rtt = -1, t0 = 0, lastRx = 0, failAt = 0, hb = 0;
  var q = [], jobs = [], hellos = [], busy = false, snap = null, due = Infinity;
  var msg = '', stop = false, kept = false;
  var lost = false; // unreadable index
  var eff = null, effSet = ''; // effort picked for effSet; null: the phone's
  var done = '', wset = ''; // set last saved, set being written

  function paint() { if (io.paint) io.paint(); }
  // storage calls run one at a time
  function queue(job) {
    jobs.push(job);
    if (!busy) next();
  }
  function next() {
    var job = jobs.shift();
    busy = !!job;
    if (job) job(next);
  }
  function kv(op, key, value, cb) {
    var once = false;
    function back(ok, v) { if (!once) cb(ok, v); once = true; }
    try {
      io.store[op]({ key: key, value: value, default: '', success: function (v) { back(true, v); }, fail: function () { back(false, ''); } });
    } catch (e) {
      back(false, '');
    }
  }
  function slots() {
    var s = '';
    for (var i = 0; i < q.length; i++) s += q[i].slot;
    return s;
  }
  function entry(slot, text, m) {
    return { slot: slot, text: text, id: m.commandId, set: m.setId || '', sent: 0, n: 0 };
  }

  // Pending only after the slot, its read-back and the index
  function add(text, set, at) {
    wset = set;
    queue(function (fin) {
      var slot = -1;
      for (var i = SLOTS - 1; i >= 0; i--) if (slots().indexOf(String(i)) < 0) slot = i;
      function end(m) {
        msg = m;
        wset = '';
        keepOn();
        paint();
        fin();
      }
      if (lost || slot < 0) return end(lost ? 'Not saved' : 'Queue full');
      kv('set', KEY + slot, text, function (ok) {
        if (!ok) return end('Not saved');
        kv('get', KEY + slot, '', function (ok2, back) {
          if (!ok2 || back !== text) return end('Not saved');
          kv('set', KEY, slots() + slot, function (ok3) {
            if (!ok3) return end('Not saved');
            q.push(entry(slot, text, read(text)));
            end('Pending ' + hms(at));
            pump();
          });
        });
      });
    });
  }

  function drop(i) {
    q.splice(i, 1);
    queue(function (fin) { kv('set', KEY, slots(), fin); });
  }

  function load() {
    queue(function (fin) {
      kv('get', KEY, '', function (ok, list) {
        var i = 0, keep = '';
        list = String(list);
        lost = !ok;
        function finish() {
          if (q.length) msg = q.length + ' pending';
          fin();
          hello();
          pump();
          keepOn();
          paint();
        }
        function one() {
          while (ok && i < list.length) {
            var slot = list.charAt(i++);
            if ('01234567'.indexOf(slot) < 0 || keep.indexOf(slot) >= 0) continue;
            return kv('get', KEY + slot, '', function (ok2, t) {
              var m = ok2 ? read(t) : null;
              if (m && m.k === 'cmd' && str(m.commandId)) {
                keep += slot;
                q.push(entry(Number(slot), t, m));
              }
              one();
            });
          }
          if (ok && keep !== list) kv('set', KEY, keep, finish);
          else finish();
        }
        one();
      });
    });
  }

  function pump() {
    if (q[0] && !q[0].sent && !stop) fire(q[0]);
  }
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
  function hello() {
    if (stop) return;
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
    if (hellos.indexOf(m.wt) >= 0 && (rtt < 0 || now - m.wt < rtt)) {
      rtt = now - m.wt;
      off = Math.round(m.pt - (m.wt + now) / 2);
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

  // only a receipt shows Saved; others are retried
  function onRes(m) {
    for (var i = 0; i < q.length; i++) {
      if (q[i].id !== m.commandId) continue;
      if (m.status === 'applied') {
        msg = 'Saved';
        if (q[i].set) done = q[i].set;
      } else if (m.status === 'rejected') {
        msg = own(WHY, m.reason) ? WHY[m.reason] : 'Not saved';
      } else {
        return;
      }
      drop(i);
      return pump();
    }
  }

  function rx(text) {
    var m = read(text);
    var now = io.now();
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
    var now = io.now();
    var e = q[0];
    if (!stop && e && e.sent && now - e.sent >= GAPS[Math.min(e.n, 4) - 1]) fire(e);
    if (!stop && now >= due) hello();
    keepOn();
    paint();
  }

  function shown() {
    return eff !== null ? eff : (snap && snap.set && snap.set.e) || '';
  }
  function can() {
    var s = snap && snap.sid ? snap.set : null;
    var ok = !stop && s && s.r >= 1 && s.id !== done && s.id !== wset;
    for (var i = 0; ok && i < q.length; i++) ok = q[i].set !== s.id;
    return !!ok;
  }
  function cmd(kind, set, effort) {
    var at = Math.round(io.now() + off);
    add(makeCmd(boot + '-' + ++seq, snap, kind, at, effort), set, at);
  }

  function view() {
    var now = io.now();
    var s = snap && snap.sid && snap.set;
    var r = snap && snap.sid && snap.rest;
    var th = theme(snap && snap.th);
    var v = { l1: '', l2: '', eff: '', rest: '', st: msg, p1: '', p2: '', set: false, can: false, rs: false, add: false, bg: th[0], fg: th[1], ac: th[2], cb: '#3a3a3a' };
    if (stop) {
      v.l1 = 'Update needed';
      v.st = '';
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
      v.eff = own(NAME, shown()) ? NAME[shown()] : 'Effort';
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
    start: function () { t0 = io.now(); load(); },
    show: function () { hello(); keepOn(true); },
    complete: function () { if (can()) cmd('complete_set', snap.set.id, shown()); },
    rest: function (kind) { if (!stop && snap && snap.sid && snap.rest) cmd(kind, '', ''); },
    effort: function () {
      if (snap && snap.set) eff = EFF[(EFF.indexOf(shown()) + 1) % EFF.length];
      paint();
    }
  };
}

export { PHONE_PKG, PHONE_FP, makeBoot, Link };
