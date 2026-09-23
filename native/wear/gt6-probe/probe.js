/* Gate A diagnostic protocol. Plain JS for Lite Wearable; no workout state. */
export function createProbe(io) {
  var run = '', hrId = '', timer = null, pulse = null, lastSent = 0, seq = 0;
  var deadline = 0, pulseSeq = 0, shows = 0, hides = 0, swipes = 0, disposed = false;
  var boot = String(io.now());
  var seen = [];
  function safe(fn) {
    try {
      var result = fn();
      if (result && typeof result.catch === 'function') result.catch(function () { io.status('API promise rejected'); });
    } catch (e) { io.status('API exception'); }
  }
  function send(message) {
    if (disposed || !run) return;
    message.tag = 'marc-watch-lab'; message.v = 1; message.run = run;
    var text = JSON.stringify(message);
    if (text.length > 1024) { io.status('Reply too large'); return; }
    safe(function () { return io.send(text); });
  }
  function reply(q, status, extra) {
    var out = { kind: 'reply', id: q.id, op: q.op, status: status, boot: boot };
    if (extra) Object.keys(extra).forEach(function (key) { out[key] = extra[key]; });
    send(out);
  }
  function stop() {
    hrId = ''; deadline = 0;
    if (timer !== null) io.clearTimeout(timer);
    timer = null;
    safe(function () { if (typeof io.sensor.unsubscribeHeartRate === 'function') return io.sensor.unsubscribeHeartRate(); });
    io.status('HR stopped');
  }
  function heart(q) {
    stop();
    if (typeof io.sensor.subscribeHeartRate !== 'function') { reply(q, 'unsupported'); return; }
    hrId = q.id; seq = 0; lastSent = 0; deadline = io.now() + 300000;
    timer = io.setTimeout(stop, 300000);
    var currentId = hrId;
    try {
      var result = io.sensor.subscribeHeartRate({
        success: function (ret) {
          if (disposed || hrId !== currentId) return;
          if (io.now() >= deadline) { stop(); return; }
          var bpm = ret.heartRate;
          if (typeof bpm !== 'number' || !isFinite(bpm) || bpm <= 0 || bpm > 300) { io.status('Invalid sensor sample'); return; }
          // At most one outbound sample per second. Report actual intervals, never interpolate.
          if (lastSent && io.now() - lastSent < 1000) return;
          lastSent = io.now(); io.heart(bpm);
          send({ kind: 'hr', id: currentId, bpm: bpm, seq: ++seq, watchAt: io.now() });
        },
        fail: function (_data, code) { if (hrId === currentId) { stop(); send({ kind: 'sensor_error', id: currentId, code: String(code).slice(0, 40) }); io.status('HR failed: ' + code); } }
      });
      if (result && typeof result.catch === 'function') result.catch(function () { stop(); io.status('HR promise rejected'); });
      reply(q, 'subscription_requested'); // A callback sample, not this reply, proves sensor delivery.
    } catch (e) { stop(); reply(q, 'exception'); }
  }
  function receive(text) {
    if (disposed || typeof text !== 'string' || text.length > 1024) return;
    var q;
    try { q = JSON.parse(text); } catch (e) { io.status('Invalid probe JSON'); return; }
    if (q.tag !== 'marc-watch-lab' || q.v !== 1 || typeof q.run !== 'string' || q.run.length !== 36 || typeof q.id !== 'string' || q.id.length !== 36) return;
    if (run !== q.run) {
      stop(); run = q.run; seen = [];
      if (pulse !== null) io.clearInterval(pulse);
      var until = io.now() + 600000;
      pulse = io.setInterval(function () {
        if (io.now() > until) { io.clearInterval(pulse); pulse = null; return; }
        send({ kind: 'heartbeat', seq: ++pulseSeq, watchAt: io.now(), boot: boot, shows: shows, hides: hides, swipes: swipes });
      }, 5000);
    }
    if (seen.indexOf(q.id) !== -1) return; // No duplicate side effects.
    seen.push(q.id); if (seen.length > 32) seen.shift();
    io.status(q.op);
    try {
      switch (q.op) {
        case 'echo': reply(q, 'ok'); break;
        case 'payload': reply(q, 'ok', { bytes: text.length }); break; // Phone sends ASCII only.
        case 'capabilities': reply(q, 'api_presence_only', {
          sensor: typeof io.sensor.subscribeHeartRate === 'function', storage: typeof io.storage.set === 'function',
          vibrator: typeof io.vibrator.vibrate === 'function', shows: shows, hides: hides, swipes: swipes
        }); break;
        case 'hr_start': heart(q); break;
        case 'hr_stop': stop(); reply(q, 'stop_requested'); break;
        case 'storage_write': {
          var writeRun = run;
          safe(function () { return io.storage.set({ key: 'marc_gate_a_nonce', value: q.id,
            success: function () { if (run === writeRun) reply(q, 'written', { value: q.id }); },
            fail: function (_data, code) { if (run === writeRun) reply(q, 'failed', { code: code }); }
          }); }); break;
        }
        case 'storage_read': {
          var readRun = run;
          safe(function () { return io.storage.get({ key: 'marc_gate_a_nonce', default: '',
            success: function (value) { if (run === readRun) reply(q, 'read', { value: String(value).slice(0, 40) }); },
            fail: function (_data, code) { if (run === readRun) reply(q, 'failed', { code: code }); }
          }); }); break;
        }
        case 'vibrate': safe(function () { return io.vibrator.vibrate({ mode: 'short',
          success: function () { reply(q, 'api_success_user_must_confirm_buzz'); },
          fail: function (_data, code) { reply(q, 'failed', { code: code }); }
        }); }); break;
        default: reply(q, 'unknown_operation');
      }
    } catch (e) { reply(q, 'exception'); }
  }
  return {
    receive: receive,
    stop: stop,
    show: function () { shows++; if (deadline && io.now() >= deadline) stop(); },
    hide: function () { hides++; },
    swipe: function () { swipes++; io.status('Swipes: ' + swipes); },
    dispose: function () { stop(); disposed = true; if (pulse !== null) io.clearInterval(pulse); }
  };
}
