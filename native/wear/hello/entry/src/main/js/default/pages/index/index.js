import { P2pClient, Message, Builder } from '../wearengine.js';
import sensor from '@system.sensor';
import storage from '@system.storage';
import vibrator from '@system.vibrator';
import {
  PHONE_PKG, PHONE_FP, LATE_MS, EVERY_MS, ROWS, SIZES, makeBoot, makeRequest, padRequest, makeHr, nextMode,
  readAck, lost, addRow, headLine, tallyLine, ackRow, sizeRow, autoLine, hrLine, actLabel, nextCount, swipeRow,
  slowTick
} from '../../common/a2.js';

// Gate A test page. Modes: MSG one request per tap; AUTO a request every 5 s; SIZE five padded requests;
// HR heart rate with a report every 5 s; KIT storage, vibration and swipes. Setup runs the Wear Engine setup
// again. Every result goes on screen. SDK callbacks get no this, so each one closes over the page (vm).
var client = null;
var boot = '';
var seq = 0;
var mode = 'MSG';
var pending = {};
var late = {};
var rows = [];
var n = null;
var st = { fp: '', rx: '', png: '' };
var timer = null;
var wait = null;
var lastTick = 0;
var maxGap = 0;
var lastAck = 0;
var sizes = [];
var runs = 0; // a new SIZE run or a mode change stops the previous run
var hr = { on: false, bpm: '', count: 0, at: 0, fail: '' };
var kit = { launch: '?', vib: 'short' };

function reset() {
  n = { sent: 0, ack: 0, lost: 0, bad: 0, late: 0 };
  pending = {};
  late = {};
  rows = [];
  sizes = [];
  runs++;
  lastTick = 0;
  maxGap = 0;
  lastAck = 0;
}
reset();

function subLine(now) {
  if (mode === 'AUTO') return autoLine(timer !== null, now, lastAck, maxGap);
  if (mode === 'HR') return hrLine(hr, now);
  if (mode === 'KIT') return 'launch ' + kit.launch;
  return '';
}

function show(vm) {
  var list = rows;
  if (mode === 'SIZE' && sizes.length) {
    list = [];
    for (var i = 0; i < sizes.length; i++) list.push(sizeRow(sizes[i]));
    list = list.concat(rows.slice(sizes.length - ROWS));
  }
  vm.head = mode + ' ' + headLine(client ? client.version : '', st.fp, st.rx, st.png);
  for (var j = 0; j < ROWS; j++) vm['r' + j] = list[j] || '';
  vm.tally = tallyLine(n);
  vm.sub = subLine(Date.now());
  vm.act = actLabel(mode, mode === 'HR' ? hr.on : timer !== null, kit.vib);
}

function note(vm, text) {
  addRow(rows, text);
  show(vm);
}

function fail(vm, step, e) {
  note(vm, 'x ' + step + ' ' + (e && e.message ? e.message : String(e)));
}

function sizeOf(id) {
  for (var i = 0; i < sizes.length; i++) {
    if (sizes[i].id === id) return sizes[i];
  }
  return null;
}

// Moves ids unanswered for 10 s from pending to late, and forgets late ones after 10 min.
function sweep(now) {
  var gone = lost(pending, now, undefined, late);
  for (var i = 0; i < gone.length; i++) {
    n.lost++;
    var s = sizeOf(gone[i]);
    if (s) s.lost = true;
    else addRow(rows, '! lost ' + gone[i]);
  }
  lost(late, now, LATE_MS);
}

function receive(vm, msg) {
  try {
    if (msg && msg.isFileType) {
      note(vm, 'file');
      return;
    }
    var now = Date.now();
    var r = readAck(msg, pending, now, late);
    if (r.kind === 'ack' || r.kind === 'late') {
      if (r.kind === 'ack') n.ack++;
      else n.late++;
      lastAck = now;
      var s = sizeOf(r.id);
      if (s) {
        s.ack = r;
        show(vm);
      } else {
        note(vm, ackRow(r));
      }
    } else if (r.kind === 'dup') {
      note(vm, 'dup ' + r.id);
    } else {
      n.bad++;
      note(vm, 'bad ' + r.reason);
    }
  } catch (e) {
    fail(vm, 'rcv', e);
  }
}

// Sends one message object. quiet logs only send results other than 207; done(code) runs on the result.
function send(vm, obj, quiet, done) {
  var now = Date.now();
  sweep(now);
  if (!client) {
    note(vm, 'x send no client');
    return;
  }
  var b = new Builder();
  b.setDescription(JSON.stringify(obj));
  var m = new Message();
  m.builder = b;
  pending[obj.id] = now;
  n.sent++;
  show(vm);
  // All four callbacks: the SDK calls onSendResult and onSendProgress without checking for them.
  client.send(m, {
    onSuccess: function () {},
    onFailure: function () {},
    onSendResult: function (r) {
      var code = r && r.code ? r.code : '-';
      if (done) done(code);
      if (quiet && code === 207) show(vm);
      else note(vm, '> ' + obj.id + ' ' + code);
    },
    onSendProgress: function (p) {}
  });
}

// Shows ids that stay unanswered once the 10 s limit has passed, without waiting for the next send.
function later(vm) {
  if (wait !== null) clearTimeout(wait);
  wait = setTimeout(function () {
    wait = null;
    sweep(Date.now());
    show(vm);
  }, 10500);
}

function tick(vm) {
  try {
    var now = Date.now();
    var gap = slowTick(lastTick, now);
    if (gap) addRow(rows, '! gap ' + Math.round(gap / 1000) + 's');
    if (lastTick && now - lastTick > maxGap) maxGap = now - lastTick;
    lastTick = now;
    var obj = mode === 'HR' ? makeHr(boot, seq + 1, hr.bpm) : makeRequest(boot, seq + 1);
    if (obj) {
      seq++;
      send(vm, obj, true);
    } else {
      sweep(now);
      show(vm);
    }
  } catch (e) {
    fail(vm, 'tick', e);
  }
}

function stop(vm) {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  if (hr.on) {
    hr.on = false;
    try {
      sensor.unsubscribeHeartRate();
    } catch (e) {
      fail(vm, 'hr off', e);
    }
  }
}

function startTimer(vm) {
  timer = setInterval(function () {
    tick(vm);
  }, EVERY_MS);
}

function startHr(vm) {
  hr = { on: true, bpm: '', count: 0, at: 0, fail: '' };
  try {
    sensor.subscribeHeartRate({
      success: function (d) {
        hr.count++;
        hr.at = Date.now();
        hr.bpm = d ? d.heartRate : '';
        show(vm);
      },
      fail: function (data, code) {
        hr.fail = String(code);
        note(vm, 'x hr ' + code + ' ' + data);
      }
    });
  } catch (e) {
    hr.on = false;
    hr.fail = 'x';
    fail(vm, 'hr', e);
    return;
  }
  startTimer(vm);
}

// Five padded requests, each sent when the previous one has its send result.
function sizeRun(vm) {
  sizes = [];
  var run = ++runs;
  var i = 0;
  function next() {
    try {
      if (run !== runs) return;
      if (i >= SIZES.length) {
        later(vm);
        return;
      }
      seq++;
      var rec = { size: SIZES[i], id: boot + '-' + seq, code: '', ack: null, lost: false };
      i++;
      sizes.push(rec);
      send(vm, padRequest(boot, seq, rec.size), true, function (code) {
        rec.code = code;
        next();
      });
    } catch (e) {
      fail(vm, 'size', e);
    }
  }
  next();
}

function vibrate(vm) {
  var m = kit.vib;
  kit.vib = m === 'short' ? 'long' : 'short';
  vibrator.vibrate({
    mode: m,
    success: function () {
      note(vm, 'vib ' + m + ' ok');
    },
    fail: function (data, code) {
      note(vm, 'vib ' + m + ' x' + code + ' ' + data);
    }
  });
}

// Adds one to the launch count kept by @system.storage, so a restart shows whether it persisted.
function count(vm) {
  var key = 'marc_launch';
  try {
    storage.get({
      key: key,
      default: '0',
      success: function (v) {
        var c = nextCount(v);
        storage.set({
          key: key,
          value: String(c),
          success: function () {
            kit.launch = String(c);
            show(vm);
          },
          fail: function (data, code) {
            kit.launch = c + ' x' + code;
            show(vm);
          }
        });
      },
      fail: function (data, code) {
        kit.launch = 'x' + code;
        show(vm);
      }
    });
  } catch (e) {
    kit.launch = 'x';
    fail(vm, 'kv', e);
  }
}

// Order from Huawei's SDK: the package name first, because setPeerFingerPrint sends it along.
// The client is made once and kept: if the service version arrives after the constructor returns,
// Setup then runs with the version known.
function setup(vm) {
  st.fp = '';
  st.rx = '';
  st.png = '';
  if (client) {
    try {
      client.unregisterReceiver({ onSuccess: function () {} });
    } catch (e) {
      fail(vm, 'unreg', e);
    }
  }
  try {
    if (!client) client = new P2pClient();
    client.setPeerPkgName(PHONE_PKG);
    var fp = client.setPeerFingerPrint(PHONE_FP);
    st.fp = fp && fp.code ? fp.code : 'ok';
  } catch (e) {
    fail(vm, 'fp', e);
  }
  try {
    client.registerReceiver({
      onSuccess: function () {
        st.rx = 'ok';
        show(vm);
      },
      onFailure: function () {
        st.rx = 'fail';
        show(vm);
      },
      onReceiveMessage: function (msg) {
        receive(vm, msg);
      }
    });
  } catch (e) {
    fail(vm, 'rx', e);
  }
  try {
    client.ping({
      onSuccess: function () {},
      onFailure: function () {},
      onPingResult: function (r) {
        st.png = r && r.code ? r.code : '-';
        show(vm);
      }
    });
  } catch (e) {
    fail(vm, 'png', e);
  }
  show(vm);
}

export default {
  data: {
    head: '',
    r0: '',
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: '',
    r6: '',
    r7: '',
    r8: '',
    tally: '',
    sub: '',
    act: ''
  },
  onInit() {
    if (!boot) boot = makeBoot();
    setup(this);
    count(this);
  },
  onSetup() {
    setup(this);
  },
  onMode() {
    stop(this);
    mode = nextMode(mode);
    reset();
    show(this);
  },
  onSend() {
    var vm = this;
    try {
      if (mode === 'MSG') {
        seq++;
        send(vm, makeRequest(boot, seq), false);
        later(vm);
      } else if (mode === 'AUTO' || mode === 'HR') {
        if (timer !== null || hr.on) {
          stop(vm);
        } else {
          reset();
          if (mode === 'HR') startHr(vm);
          else startTimer(vm);
          tick(vm);
        }
      } else if (mode === 'SIZE') {
        sizeRun(vm);
      } else {
        vibrate(vm);
      }
      show(vm);
    } catch (e) {
      fail(vm, 'act', e);
    }
  },
  onSwipe(e) {
    if (mode === 'KIT') note(this, swipeRow(e));
  },
  onDestroy() {
    stop(this);
    if (wait !== null) clearTimeout(wait);
    if (!client) return;
    try {
      client.unregisterReceiver({ onSuccess: function () {} });
    } catch (e) {
      // the page is closing; nothing left to show
    }
  }
};
