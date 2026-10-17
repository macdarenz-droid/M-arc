/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 85:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $app_template$ = __webpack_require__(508)
var $app_style$ = __webpack_require__(123)
var $app_script$ = __webpack_require__(538)
var options=$app_script$
 if ($app_script$.__esModule) {

      options = $app_script$.default;
 }
options.styleSheet=$app_style$
options.render=$app_template$;
module.exports=new ViewModel(options);

/***/ }),

/***/ 123:
/***/ (function(module) {

module.exports = {"classSelectors":{"c":{"width":466,"height":466,"flexDirection":"column","justifyContent":"center","alignItems":"center"},"l1":{"width":340,"height":34,"fontSize":26,"textAlign":"center"},"l2":{"width":380,"height":52,"fontSize":40,"textAlign":"center"},"row":{"width":380,"height":52,"marginTop":4,"justifyContent":"center","alignItems":"center"},"rt":{"width":140,"height":40,"fontSize":26,"textAlign":"center"},"b":{"width":110,"height":44,"marginLeft":3,"marginRight":3,"fontSize":22,"backgroundColor":2763306,"color":16777215},"st":{"width":340,"height":26,"fontSize":20,"textAlign":"center"},"cb":{"width":200,"height":56,"marginTop":6,"fontSize":26,"color":16777215}}}

/***/ }),

/***/ 508:
/***/ (function(module) {

module.exports = function (vm) { var _vm = vm || this; return _c('div', {'staticClass' : ["c"],'dynamicStyle' :{'backgroundColor' : function () {return _vm.bg}}} , [_c('text', {'attrs' : {'value' : function () {return _vm.l1}},'staticClass' : ["l1"],'dynamicStyle' :{'color' : function () {return _vm.fg}}} ),_c('text', {'attrs' : {'value' : function () {return _vm.l2}},'staticClass' : ["l2"],'dynamicStyle' :{'color' : function () {return _vm.fg}}} ),_i((function () {return _vm.set}),function(){return _c('input', {'attrs' : {'type' : "button",'value' : function () {return _vm.eff}},'staticClass' : ["b"],'onBubbleEvents' : {'click' : _vm.onEffort}} )}),_i((function () {return _vm.rs}),function(){return _c('div', {'staticClass' : ["row"]} , [_c('text', {'attrs' : {'value' : function () {return _vm.rest}},'staticClass' : ["rt"],'dynamicStyle' :{'color' : function () {return _vm.fg}}} ),_i((function () {return _vm.add}),function(){return _c('input', {'attrs' : {'type' : "button",'value' : "+30 s"},'staticClass' : ["b"],'onBubbleEvents' : {'click' : _vm.onAdd}} )}),_c('input', {'attrs' : {'type' : "button",'value' : "Skip"},'staticClass' : ["b"],'onBubbleEvents' : {'click' : _vm.onSkip}} )] )}),_c('text', {'attrs' : {'value' : function () {return _vm.st}},'staticClass' : ["st"],'dynamicStyle' :{'color' : function () {return _vm.fg}}} ),_c('text', {'attrs' : {'value' : function () {return _vm.p1}},'staticClass' : ["st"],'dynamicStyle' :{'color' : function () {return _vm.fg}}} ),_c('text', {'attrs' : {'value' : function () {return _vm.p2}},'staticClass' : ["st"],'dynamicStyle' :{'color' : function () {return _vm.fg}}} ),_i((function () {return _vm.set}),function(){return _c('input', {'attrs' : {'type' : "button",'value' : "Complete"},'staticClass' : ["cb"],'dynamicStyle' :{'backgroundColor' : function () {return _vm.cb}},'onBubbleEvents' : {'click' : _vm.onComplete}} )})] ) }

/***/ }),

/***/ 254:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Link = Link;
exports.PHONE_PKG = exports.PHONE_FP = void 0;
exports.makeBoot = makeBoot;
exports.sum = sum;
exports.wire = wire;
// WATCH-C link: native/wear/README.md
var T = 'mw',
  V = 1,
  APP = '1.1.2';
var PHONE_PKG = 'com.mrcdrnzz.dailytracker';
exports.PHONE_PKG = PHONE_PKG;
var PHONE_FP = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
exports.PHONE_FP = PHONE_FP;
var KEY = 'm2q',
  RUN = 'm2r';
var EFF = ['', 'easy', 'ideal', 'max'],
  KINDS = {
    c: 'complete_set',
    a: 'rest_add_30',
    s: 'rest_skip'
  };
var CH = 'Changed on phone',
  END = 'Workout ended';
var WHY = {
  target_missing: CH,
  already_committed: CH,
  stale_revision: CH,
  stale_rest: CH,
  invalid_state: CH,
  session_closed: END,
  no_session: END,
  wrong_session: END,
  unsupported: 'Update needed'
};
function num(x) {
  return typeof x === 'number';
}
function str(x) {
  return typeof x === 'string';
}
function two(n) {
  return (n < 10 ? '0' : '') + n;
}
function hms(ms) {
  var d = new Date(ms);
  return two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds());
}
function mss(ms) {
  var s = Math.ceil(ms / 1000);
  return Math.floor(s / 60) + ':' + two(s % 60);
}
function sum(t) {
  for (var h = 0, i = 0, c; i < t.length; i++) h = (c = t.charCodeAt(i)) < 33 || c > 126 ? NaN : (h * 31 + c) % 2147483647;
  return h;
}
function makeBoot(rand) {
  for (var s = '', i = 0, k; i < 8; i++) s += '0123456789abcdefghijklmnopqrstuvwxyz'.charAt((k = Math.floor((rand || Math.random)() * 36)) >= 0 && k < 36 ? k : 0);
  return s;
}
function read(text) {
  try {
    var m = JSON.parse(text);
  } catch (e) {
    return null;
  }
  return Object(m) === m && m.t === T ? m : null;
}
function wire(f) {
  var c = {
    t: T,
    v: V,
    k: 'cmd',
    commandId: f[1],
    sessionId: f[2],
    actionAt: +f[3],
    kind: KINDS[f[0]]
  };
  if (f[0] !== 'c') c.restId = f[4];else {
    c.setId = f[4];
    c.expectedRev = +f[5];
    if (f[6] !== '') c.load = {
      value: +f[6],
      unit: f[7]
    };
    c.reps = +f[8];
    if (f[9]) c.effort = f[9];
  }
  return JSON.stringify(c);
}
function okSnap(m) {
  var s = m.set || {},
    r = m.rest || {};
  return num(m.pt) && (m.sid === null || str(m.sid)) && (!m.set || str(s.id) && num(s.rev) && (s.u === 'kg' || s.u === 'lb')) && (!m.rest || str(r.id) && num(r.left));
}
function Link(io, boot) {
  var seq = 0,
    snapAt = 0,
    off = 0,
    rtt = -1,
    t0 = 0,
    lastRx = 0,
    failAt = 0,
    hb = 0,
    due = Infinity;
  var q = [],
    jobs = [],
    hellos = [],
    wq = [],
    busy = 0,
    snap = null,
    eff = null,
    effSet = '',
    done = '';
  var wait = null,
    msg = '',
    stop = 0,
    kept = false,
    ready = 0,
    lost = 0,
    on = 0,
    pause = 0,
    calm = 0,
    dead = 0;
  function queue(job) {
    jobs.push(job);
    if (!busy) next();
  }
  function next() {
    var job = jobs.shift();
    busy = !!job;
    if (job) job(next);
  }
  function later(fn) {
    if (!dead) (io.defer || setTimeout)(function () {
      if (!dead) try {
        fn();
      } catch (e) {}
    }, 0);
  }
  function kv(op, key, value, cb) {
    var once = 0,
      o = {
        key: key,
        success: function success(v) {
          back(true, v);
        },
        fail: function fail() {
          back(false);
        }
      };
    function back(ok, v) {
      if (!once) {
        once = true;
        wait = null;
        later(function () {
          cb(ok, v);
        });
      }
    }
    o[op === 'set' ? 'value' : 'default'] = value;
    wait = {
      at: io.now(),
      back: back
    };
    later(function () {
      try {
        io.store[op](o);
      } catch (e) {
        back(false);
      }
    });
  }
  function text(v) {
    var j = String(v).lastIndexOf(','),
      b = String(v).slice(0, j),
      f = b.split(','),
      h = sum(b);
    return h >= 0 && String(h % 99991) === String(v).slice(j + 1) && f.length === {
      c: 10,
      a: 5,
      s: 5
    }[f[0]] ? wire(f) : '';
  }
  function slots() {
    for (var s = '', i = 0; i < q.length; i++) s += q[i].slot;
    return s;
  }
  function entry(slot, text, m) {
    return {
      slot: slot,
      text: text,
      id: m.commandId,
      set: m.setId || m.kind + m.restId,
      sent: 0,
      n: 0
    };
  }
  function add(code, set, effort) {
    var at = Math.round(io.now() + off),
      s = snap.set,
      f = [code, boot + '-' + ++seq, snap.sid, at].concat(code === 'c' ? [s.id, s.rev, s.w == null ? '' : s.w, s.u, s.r, effort] : [snap.rest.id]);
    var b = f.join(','),
      val = b + ',' + sum(b) % 99991,
      t = wire(f);
    if (set) wq.push(set);
    queue(function (fin) {
      for (var slot = -1, i = 7; i >= 0; i--) if (slots().indexOf(String(i)) < 0) slot = i;
      function end(m) {
        msg = m;
        if (set) wq.splice(wq.indexOf(set), 1);
        fin();
        io.paint();
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
    queue(function (fin) {
      if (lost) fin();else kv('set', KEY, slots() || '-', fin);
    });
  }
  function load() {
    queue(function (fin) {
      kv('get', KEY, '', function (ok, list) {
        var i = 0,
          keep = '';
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
          if (!lost && keep !== list) kv('set', KEY, keep || '-', finish);else finish();
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
    io.paint();
  }
  function run() {
    queue(function (fin) {
      kv('get', RUN, '', function (ok, v) {
        var p = String(v).split(','),
          c = +p[0],
          f = +p[1];
        if (!ok) return fin(pause = t0);
        if (!(c >= 0 && c < 100 && c % 1 === 0)) c = 0;
        if (!(f > 0)) f = t0;
        if (t0 < f || t0 - f > (c > 2 ? 599999 : 120000)) c = 0;
        if (!c) f = t0;
        pause = ++c > 2 ? f : 0;
        kv('set', RUN, c + ',' + f, function () {
          fin();
          if (!pause) live();
        });
      });
    });
  }
  function live() {
    if (!dead) {
      pause = 0;
      on = io.now();
      io.connect();
      load();
    }
  }
  function hello() {
    if (stop || !on) return;
    var now = io.now();
    due = now + 20000;
    hellos.push(now);
    if (hellos.length > 8) hellos.shift();
    io.send(JSON.stringify({
      t: T,
      v: V,
      k: 'hello',
      app: APP,
      boot: boot,
      wt: now,
      q: q.length
    }), sent);
  }
  function keepOn(again) {
    var want = q.length > 0 || !!(snap && snap.sid);
    if (want !== kept || again && want) io.keep(kept = want);
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
    var m = read(text),
      now = io.now();
    if (!m || stop) return;
    stop = m.v !== V;
    if (!stop) {
      lastRx = now;
      failAt = hb = 0;
      due = now + 20000;
      if (m.k === 'snap' && okSnap(m)) onSnap(m, now);
      if (m.k === 'res') onRes(m);
      keepOn();
    }
    io.paint();
  }
  function tick() {
    var now = io.now(),
      e = q[0];
    if (wait && now - wait.at > 5000) wait.back(false);
    if (pause && now - pause > 599999) live();
    if (on && !calm && now - on > 30000) queue(function (fin) {
      kv('set', RUN, '0,' + t0, fin);
    }, calm = 1);
    if (!stop && e && e.sent && now - e.sent >= Math.min(4000 << Math.min(e.n, 4) - 1, 30000)) fire(e);
    if (!stop && now >= due) hello();
    keepOn();
    io.paint();
  }
  function shown() {
    return eff !== null ? eff : snap && snap.set && snap.set.e || '';
  }
  function held(id) {
    for (var h = wq.indexOf(id) >= 0, i = 0; i < q.length; i++) h = h || q[i].set === id;
    return h;
  }
  function can() {
    var s = snap && snap.sid ? snap.set : null;
    return !!(ready && !stop && s && s.r >= 1 && s.id !== done && !held(s.id));
  }
  function view() {
    var now = io.now(),
      s = snap && snap.sid && snap.set,
      r = snap && snap.sid && snap.rest,
      th = snap && snap.th;
    if (!(th && th.length === 3 && str(th[0]) && str(th[1]) && str(th[2]))) th = ['#08090a', '#f7f8f8', '#5e6ad2'];
    var v = {
      l1: '',
      l2: '',
      eff: '',
      rest: '',
      st: msg,
      p1: '',
      p2: '',
      set: false,
      can: false,
      rs: false,
      add: false,
      bg: th[0],
      fg: th[1],
      ac: th[2],
      cb: '#3a3a3a'
    };
    if (stop || pause) {
      v.st = '';
      v.l1 = pause ? 'Paused after restarts' : 'Update needed';
      if (pause) v.l2 = 'Try again in 10 min';
      return v;
    }
    if (failAt > 0 || (lastRx ? now - lastRx > 25000 : now - t0 > 5000)) {
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
    rx: rx,
    tick: tick,
    view: view,
    start: function start() {
      t0 = io.now();
      run();
    },
    die: function die() {
      dead = 1;
    },
    show: function show() {
      hello();
      keepOn(true);
    },
    complete: function complete() {
      if (can()) add('c', snap.set.id, shown());
    },
    rest: function rest(kind) {
      var k = kind === 'rest_skip' && snap && snap.rest ? kind + snap.rest.id : '';
      if (ready && !stop && snap && snap.sid && snap.rest && !(k && held(k))) add(k ? 's' : 'a', k, '');
    },
    effort: function effort() {
      if (snap && snap.set) eff = EFF[(EFF.indexOf(shown()) + 1) % EFF.length];
      io.paint();
    }
  };
}

function requireModule(moduleName) {
  return requireNative(moduleName.slice(1));
}


/***/ }),

/***/ 42:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PeerDeviceClient = exports.P2pClient = exports.Message = exports.Builder = void 0;
var _system = _interopRequireDefault(requireModule("@system.wearengine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); } /*
                                                                                                                                                                                                                                                                                                                                                  * Copyright (c) 2021 Huawei Device Co., Ltd.
                                                                                                                                                                                                                                                                                                                                                  * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                  * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                  * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                                                                                                                  *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                                                                                                                  * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                  * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                  * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                  * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                  * Version: lite wearable 5.0.2.306
                                                                                                                                                                                                                                                                                                                                                  * Description: wearEngine SDK
                                                                                                                                                                                                                                                                                                                                                  */
var WearEngineConst = {
  DELAY_FILEAPP_VALUE: "internal://app/",
  // Default file storage path of third-party apps
  DEFAULT_EMPTY_VALUE: "" // Default empty string
};

var ErrorCode = {
  ERROR_CODE_INVALID_ARGUMENT: 5,
  // Invalid argument
  ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT: 13,
  // Device version is not supported
  MSG_ERROR_PING_WATCH_APP_NOT_EXIST: 200,
  // App has not been installed on the wearable device
  MSG_ERROR_PING_WATCH_APP_NOT_RUNNING: 201,
  // App has been installed but not opened
  MSG_ERROR_PING_WATCH_APP_EXIST_RUNNING: 202,
  // App has been installed and opened.
  MSG_ERROR_PING_OTHER: 203,
  // Other error
  MSG_ERROR_PING_PHONE_APP_NOT_EXIST: 204,
  // App has not been installed on the phone
  MSG_ERROR_PING_PHONE_APP_NOT_RUNNING: 205,
  // App has been installed on the phone
  MSG_ERROR_SEND_FAIL: 206,
  // Failed to send the message
  MSG_ERROR_SEND_SUCCESS: 207,
  // The message is sent successfully
  MSG_ERROR_CODE_VERSION_TOO_LOW: 208 // The wearEngine version of the watch is too early
};

var MessageType = {
  MESSAGE_TYPE_DATA: 0,
  // Text Messages
  MESSAGE_TYPE_FILE: 1,
  // File Messages
  MESSAGE_TYPE_OFFLINE_MSG: 2 // Offline Messages
};

var WEARENGINE_SERVICE_VISION_302 = 302;
var WEARENGINE_SERVICE_VISION_303 = 303;
var WEARENGINE_SERVICE_VISION_401 = 401;
var WEARENGINE_SDK_VERSION = "3";
var FILE_PUNLIC_PATH_INTERCETPED = 15;
var DEFAULT_EMPTY_FINGERPRINT = " ";
var isTransferring = false;
var P2pClient = function () {
  var peerPkgName;
  var peerFingerPrint;
  var version;
  function P2pClient() {
    try {
      var jsSdk = this;
      var getVersionCallBack = function getVersionCallBack(data) {
        if (data) {
          var versionArray = data.split(".");
          jsSdk.version = versionArray[versionArray.length - 1];
          console.info("service sdk version is: " + data);
        } else {
          jsSdk.version = 0;
          console.info("get service sdk version failed");
        }
      };
      _system["default"].getWearEngineVersion({
        complete: getVersionCallBack,
        sdkVersion: WEARENGINE_SDK_VERSION
      });
    } catch (error) {
      jsSdk.version = 0;
      console.info("service sdk version is too low" + error.message);
    }
  }
  /**
   * Set the package name of the phone app
   * peerPkgName: string
   */
  P2pClient.prototype.setPeerPkgName = function (peerPkgName) {
    var successCallBack = function successCallBack() {
      console.info("setPeerPkgName success.");
    };
    var failCallBack = function failCallBack() {
      console.info("setPeerPkgName fail.");
    };
    this.peerPkgName = peerPkgName;
    if (this.version < WEARENGINE_SERVICE_VISION_303) {
      console.info("ERROR_CODE_VERSION_TOO_LOW setPackageName is invalid");
      return;
    }
    _system["default"].setPackageName({
      appName: peerPkgName,
      complete: successCallBack,
      fail: failCallBack
    });
  };
  /**
   * Set the app fingerprint information on the phone
   * fingerPrint: string
   */
  P2pClient.prototype.setPeerFingerPrint = function (fingerPrint) {
    if (this.version < WEARENGINE_SERVICE_VISION_302) {
      console.info("setPeerFingerPrint interface invalid");
      var obj = {
        data: "ERROR_CODE_VERSION_TOO_LOW",
        code: ErrorCode.MSG_ERROR_CODE_VERSION_TOO_LOW
      };
      return obj;
    }
    if (isEmpty(fingerPrint)) {
      fingerPrint = DEFAULT_EMPTY_FINGERPRINT;
    }
    this.peerFingerPrint = fingerPrint;
    var successCallBack = function successCallBack() {
      console.info("setPeerFingerPrint success.");
    };
    var failCallBack = function failCallBack() {
      console.error("setPeerFingerPrint failed.");
    };
    _system["default"].setFingerprint({
      appName: this.peerPkgName,
      appCert: fingerPrint,
      complete: successCallBack,
      fail: failCallBack
    });
  };
  /**
   * Check whether the specified application has been installed on the peer device
   * pingCallback: object:onSuccess(),onFailure(),onPingResult(resultCode)
   */
  P2pClient.prototype.ping = function (pingCallback) {
    var successCode = {
      data: " ERROR_CODE_P2P_PHONE_APP_EXIST",
      code: ErrorCode.MSG_ERROR_PING_PHONE_APP_NOT_RUNNING
    };
    var successCallBack = function successCallBack() {
      pingCallback.onSuccess();
      pingCallback.onPingResult(successCode);
      console.info("ping success.");
    };
    var notInstallCode = {
      data: "ERROR_CODE_P2P_PHONE_APP_NOT_EXIST",
      code: ErrorCode.MSG_ERROR_PING_PHONE_APP_NOT_EXIST
    };
    var failCode = {
      data: "ERROR_CODE_P2P_OTHER_ERROR",
      code: ErrorCode.MSG_ERROR_PING_OTHER
    };
    if (isEmpty(this.peerPkgName)) {
      pingCallback.onFailure();
      pingCallback.onPingResult(notInstallCode);
      return;
    }
    var failCallBack = function failCallBack(data, code) {
      if (!data && !code) {
        pingCallback.onFailure();
        pingCallback.onPingResult(notInstallCode);
      } else {
        pingCallback.onFailure();
        pingCallback.onPingResult(failCode);
      }
      console.error("ping failed.");
    };
    if (this.version >= WEARENGINE_SERVICE_VISION_401) {
      _system["default"].detect({
        bundleName: this.peerPkgName,
        success: successCallBack,
        fail: failCallBack
      });
    } else {
      FeatureAbility.detect({
        bundleName: this.peerPkgName,
        success: successCallBack,
        fail: failCallBack
      });
    }
  };
  /**
   * Register message listener
   * receiver:object:onSuccess(),onFailure(),onReceiveMessage(message)
   */
  P2pClient.prototype.registerReceiver = function (receiver) {
    if (!receiver) {
      receiver.onReceiveMessage({
        isFileType: false,
        message: "receiver is null"
      });
      return;
    }
    if (this.version > WEARENGINE_SERVICE_VISION_302) {
      if (isEmpty(this.peerPkgName)) {
        console.error("peerPkgName cannot be empty");
        receiver.onFailure();
        return;
      }
      var setPeerPkgNameSuccessCallBack = function setPeerPkgNameSuccessCallBack() {
        console.info("registerReceiver setPeerPkgName success.");
      };
      var setPeerPkgNameFailCallBack = function setPeerPkgNameFailCallBack() {
        console.info("registerReceiver setPeerPkgName fail.");
        return;
      };
      _system["default"].setPackageName({
        appName: this.peerPkgName,
        complete: setPeerPkgNameSuccessCallBack,
        fail: setPeerPkgNameFailCallBack
      });
    }
    if (isEmpty(this.peerFingerPrint)) {
      console.error("peerFingerPrint cannot be empty");
      receiver.onFailure();
      return;
    }
    var successCallBack = function successCallBack(data) {
      if (data) {
        if (data.isRegister) {
          receiver.onSuccess();
        } else if (data.isFileType) {
          var fileObj = {
            isFileType: true,
            name: data.file,
            mode: "",
            mode2: ""
          };
          receiver.onReceiveMessage(fileObj);
          console.info("receive file name:" + fileObj.name);
        } else {
          receiver.onReceiveMessage(data.message);
          console.info("receive message:" + data.message);
        }
      } else {
        receiver.onSuccess();
      }
    };
    if (this.version >= WEARENGINE_SERVICE_VISION_401) {
      _system["default"].unsubscribeMsg();
      _system["default"].subscribeMsg({
        success: successCallBack,
        fail: receiver.onFailure
      });
    } else {
      FeatureAbility.subscribeMsg({
        success: successCallBack,
        fail: receiver.onFailure
      });
    }
  };
  /**
   * Send messages
   * message: Message
   * sendCallback: object:onSuccess(),onFailure(),onSendResult(resultCode),onSendProgress(count)
   * resultCode: SUCCESS 207, FAILURE 206
   */
  P2pClient.prototype.send = function (message, sendCallback) {
    if (!message || !sendCallback) {
      return;
    }
    var failCode = {
      data: "peerPkgName or peerFingerPrint empty",
      code: ErrorCode.MSG_ERROR_SEND_FAIL
    };
    if (isEmpty(this.peerPkgName) || isEmpty(this.peerFingerPrint)) {
      console.error("peerPkgName or peerFingerPrint cannot be empty");
      sendCallback.onFailure();
      sendCallback.onSendResult(failCode);
      return;
    }
    if (message.getType() == MessageType.MESSAGE_TYPE_DATA) {
      var successCallBack = function successCallBack() {
        var successCode = {
          data: "ERROR_CODE_COMM_SUCCESS",
          code: ErrorCode.MSG_ERROR_SEND_SUCCESS
        };
        sendCallback.onSuccess();
        sendCallback.onSendResult(successCode);
        sendCallback.onSendProgress(100 + "%");
        console.info("send message success.");
      };
      var failCallBack = function failCallBack(errorMessage, code) {
        var failCode = {
          data: errorMessage,
          code: ErrorCode.MSG_ERROR_SEND_FAIL
        };
        sendCallback.onFailure();
        sendCallback.onSendResult(failCode);
        sendCallback.onSendProgress(0 + "%");
        console.error("send message failed.");
      };
      if (this.version >= WEARENGINE_SERVICE_VISION_401) {
        _system["default"].sendMsg({
          deviceId: "remote",
          bundleName: this.peerPkgName,
          abilityName: "",
          message: message.getData(),
          success: successCallBack,
          fail: failCallBack
        });
      } else {
        FeatureAbility.sendMsg({
          deviceId: "remote",
          bundleName: this.peerPkgName,
          abilityName: "",
          message: message.getData(),
          success: successCallBack,
          fail: failCallBack
        });
      }
    } else {
      if (this.version < WEARENGINE_SERVICE_VISION_302) {
        console.info("not support send file");
        var obj = {
          data: "ERROR_CODE_VERSION_TOO_LOW",
          code: ErrorCode.MSG_ERROR_CODE_VERSION_TOO_LOW
        };
        sendCallback.onFailure();
        sendCallback.onSendResult(obj);
        return;
      }
      var fileName = message.getFile().name;
      // Service version earlier than 303 does not support the internal://app/ directory
      if (this.version < WEARENGINE_SERVICE_VISION_303) {
        var TempPath = fileName.substring(0, FILE_PUNLIC_PATH_INTERCETPED);
        if (TempPath == WearEngineConst.DELAY_FILEAPP_VALUE) {
          var obj = {
            data: "ERROR_CODE_VERSION_TOO_LOW",
            code: ErrorCode.MSG_ERROR_CODE_VERSION_TOO_LOW
          };
          sendCallback.onFailure();
          sendCallback.onSendResult(obj);
          console.info("wearEngine service version too low, file path not support");
          return;
        }
      }
      var successCallBack = function successCallBack() {
        var successCode = {
          data: "ERROR_CODE_COMM_SUCCESS",
          code: ErrorCode.MSG_ERROR_SEND_SUCCESS
        };
        sendCallback.onSuccess();
        sendCallback.onSendResult(successCode);
        console.info("send file success.");
        isTransferring = false;
      };
      var failCallBack = function failCallBack(errorMessage, code) {
        var failCode = {
          data: errorMessage,
          code: ErrorCode.MSG_ERROR_SEND_FAIL
        };
        sendCallback.onFailure();
        sendCallback.onSendResult(failCode);
        console.info("send file failed.");
        isTransferring = false;
      };
      if (isTransferring) {
        console.error("send file failed,there is already a file being sent.");
        failCallBack();
        return;
      }
      isTransferring = true;
      var progressCallBack = function progressCallBack(data) {
        sendCallback.onSendProgress(data.progressNum + "%");
        console.info("progress of sending file: " + data.progressNum + "%");
      };
      _system["default"].uploadFile({
        fileName: fileName,
        filePath: this.peerPkgName,
        peerPackageName: this.peerPkgName,
        success: successCallBack,
        fail: failCallBack,
        progress: progressCallBack
      });
    }
  };
  /**
   * Deregister message listener
   * receiver: onSuccess()
   */
  P2pClient.prototype.unregisterReceiver = function (receiver) {
    if (this.version >= WEARENGINE_SERVICE_VISION_401) {
      _system["default"].unsubscribeMsg();
    } else {
      FeatureAbility.unsubscribeMsg();
    }
    receiver.onSuccess();
  };
  /**
   * Check whether the parameter is empty
   * parameter: string
   */
  function isEmpty(parameter) {
    return parameter == "undefined" || parameter == null || parameter == "" || parameter == " ";
  }
  return P2pClient;
}();

/**
 * File format type
 * name: file name with path
 * mode: 'text' or 'binary'
 * mode2: 'R', 'W', 'RW'
 */
exports.P2pClient = P2pClient;
var File = function () {
  var name;
  var mode;
  var mode2;
  function File() {}
  return File;
}();
var Builder = function () {
  var messageInfo;
  function Builder() {}
  Builder.prototype.setDescription = function (description) {
    this.messageInfo = description;
    this.messageType = MessageType.MESSAGE_TYPE_DATA;
  };
  /**
   * Set the message information (either of the two formats)
   * data: ArrayBuffer
   * data: File(Not supported currently)
   */
  Builder.prototype.setPayload = function (data) {
    if (!data) {
      return;
    }
    if (_typeof(data) == "object" && data.name) {
      this.messageType = MessageType.MESSAGE_TYPE_FILE;
      return this.setFilePlayload(data);
    } else {
      this.messageType = MessageType.MESSAGE_TYPE_DATA;
      return this.setBufferPlayload(data);
    }
  };
  Builder.prototype.setBufferPlayload = function (data) {
    this.messageInfo = String.fromCharCode.apply(null, new Uint16Array(data));
  };
  Builder.prototype.setFilePlayload = function (data) {
    this.messageInfo = JSON.stringify(data);
  };
  return Builder;
}();
exports.Builder = Builder;
var Message = function () {
  var builder = new Builder();
  function Message() {}
  Message.prototype.describeContents = function () {
    return this.builder.messageInfo;
  };
  /**
   * Get information during transmission
   */
  Message.prototype.getData = function () {
    return this.builder.messageInfo;
  };
  Message.prototype.getDescription = function () {
    return this.builder.messageInfo;
  };
  /**
   * Get File Information
   */
  Message.prototype.getFile = function () {
    if (this.builder.messageType == MessageType.MESSAGE_TYPE_FILE) {
      return JSON.parse(this.builder.messageInfo);
    }
    return null;
  };
  /**
   * Get the transmission data type
   * 0 string
   * 1 File
   */
  Message.prototype.getType = function () {
    return this.builder.messageType;
  };
  return Message;
}();
exports.Message = Message;
var PeerDeviceClient = function () {
  var version;
  function PeerDeviceClient() {
    try {
      var jsSdk = this;
      var getVersionCallBack = function getVersionCallBack(data) {
        if (data) {
          var versionArray = data.split(".");
          jsSdk.version = versionArray[versionArray.length - 1];
          console.info("service sdk version is: " + data);
        } else {
          jsSdk.version = 0;
          console.info("get service sdk version failed");
        }
      };
      _system["default"].getWearEngineVersion({
        complete: getVersionCallBack,
        sdkVersion: WEARENGINE_SDK_VERSION
      });
    } catch (error) {
      jsSdk.version = 0;
      console.info("service sdk version is too low" + error.message);
    }
  }

  /**
    * Get the peer device object
    * sendCallback: object:onSuccess(data),onFailure(data)
    */
  PeerDeviceClient.prototype.getPeerDevice = function (peerDeviceCallback) {
    if (!peerDeviceCallback) {
      console.error("getPeerDevice peerDeviceCallback is null");
      var obj = {
        data: "ERROR_CODE_INVALID_ARGUMENT",
        errorCode: ErrorCode.ERROR_CODE_INVALID_ARGUMENT
      };
      return obj;
    }
    if (this.version < WEARENGINE_SERVICE_VISION_401) {
      console.error("getPeerDevice wearengine service verison is low");
      var obj = {
        data: "ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT",
        errorCode: ErrorCode.ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT
      };
      peerDeviceCallback.onFailure(obj);
      return;
    }
    var successCallBack = function successCallBack(data) {
      peerDeviceCallback.onSuccess(data);
    };
    var failCallBack = function failCallBack(data) {
      peerDeviceCallback.onFailure(data);
    };
    _system["default"].getPeerDevice({
      success: successCallBack,
      fail: failCallBack
    });
    return;
  };
  return PeerDeviceClient;
}();
exports.PeerDeviceClient = PeerDeviceClient;

function requireModule(moduleName) {
  return requireNative(moduleName.slice(1));
}


/***/ }),

/***/ 35:
/***/ (function(module) {

"use strict";


function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

function requireModule(moduleName) {
  return requireNative(moduleName.slice(1));
}


/***/ }),

/***/ 538:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(35);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _wearengine = __webpack_require__(42);
var _system = _interopRequireDefault(requireModule("@system.storage"));
var _system2 = _interopRequireDefault(requireModule("@system.brightness"));
var _link = __webpack_require__(254);
var client, link, page, timer;
function paint() {
  var v = page && link ? link.view() : {};
  for (var k in v) page[k] = v[k];
}
function no() {}
function send(text, done) {
  try {
    var b = new _wearengine.Builder(),
      m = new _wearengine.Message();
    b.setDescription(text);
    m.builder = b;
    client.send(m, {
      onSuccess: no,
      onFailure: no,
      onSendProgress: no,
      onSendResult: function onSendResult(r) {
        done(r && r.code);
      }
    });
  } catch (e) {
    done(-1);
  }
}
function keep(on) {
  try {
    _system2["default"].setKeepScreenOn({
      keepScreenOn: on,
      success: no,
      fail: no
    });
  } catch (e) {}
}
function connect() {
  try {
    client = new _wearengine.P2pClient();
    client.setPeerPkgName(_link.PHONE_PKG);
    client.setPeerFingerPrint(_link.PHONE_FP);
    client.registerReceiver({
      onSuccess: function onSuccess() {
        link.show();
      },
      onFailure: no,
      onReceiveMessage: function onReceiveMessage(msg) {
        link.rx(msg);
      }
    });
  } catch (e) {}
}
var _default = {
  data: {
    l1: '',
    l2: '',
    eff: '',
    rest: '',
    st: '',
    p1: '',
    p2: '',
    set: false,
    can: false,
    rs: false,
    add: false,
    bg: '#08090a',
    fg: '#f7f8f8',
    ac: '#5e6ad2',
    cb: '#3a3a3a'
  },
  onInit: function onInit() {
    page = this;
    link = (0, _link.Link)({
      store: _system["default"],
      send: send,
      keep: keep,
      connect: connect,
      now: function now() {
        return Date.now();
      },
      paint: paint
    }, (0, _link.makeBoot)());
    link.start();
    timer = setInterval(function () {
      link.tick();
    }, 1000);
    paint();
  },
  onShow: function onShow() {
    link.show();
  },
  onComplete: function onComplete() {
    link.complete();
  },
  onEffort: function onEffort() {
    link.effort();
  },
  onAdd: function onAdd() {
    link.rest('rest_add_30');
  },
  onSkip: function onSkip() {
    link.rest('rest_skip');
  },
  onDestroy: function onDestroy() {
    link.die();
    clearInterval(timer);
    keep(false);
    page = null;
    try {
      client.unregisterReceiver({
        onSuccess: no
      });
    } catch (e) {}
  }
};
exports["default"] = _default;

function requireModule(moduleName) {
  return requireNative(moduleName.slice(1));
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(85);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map
print(typeof b2)