import { P2pClient, Message, Builder } from '../wearengine.js';
import {
  PHONE_PKG, PHONE_FP, makeBoot, makeRequest, readAck, lost, addRow, headLine, tallyLine
} from '../../common/a2.js';

// Gate A question 2 test page. Send asks the phone app for an acknowledgement carrying the same id;
// Setup runs the Wear Engine setup again. console output cannot be read on the watch, so every result
// goes on screen. The SDK calls its callbacks without a this, so each one closes over the page (vm).
var client = null;
var boot = '';
var seq = 0;
var pending = {};
var rows = [];
var n = { sent: 0, ack: 0, lost: 0, bad: 0 };
var st = { fp: '', rx: '', png: '' };

function show(vm) {
  vm.head = headLine(client ? client.version : '', st.fp, st.rx, st.png);
  vm.r0 = rows[0] || '';
  vm.r1 = rows[1] || '';
  vm.r2 = rows[2] || '';
  vm.r3 = rows[3] || '';
  vm.r4 = rows[4] || '';
  vm.r5 = rows[5] || '';
  vm.r6 = rows[6] || '';
  vm.r7 = rows[7] || '';
  vm.r8 = rows[8] || '';
  vm.r9 = rows[9] || '';
  vm.tally = tallyLine(n);
}

function note(vm, text) {
  addRow(rows, text);
  show(vm);
}

function fail(vm, step, e) {
  note(vm, 'x ' + step + ' ' + (e && e.message ? e.message : String(e)));
}

function receive(vm, msg) {
  try {
    if (msg && typeof msg === 'object' && msg.isFileType) {
      note(vm, 'file');
      return;
    }
    var r = readAck(msg, pending, Date.now());
    if (r.kind === 'ack') {
      n.ack++;
      note(vm, '< ACK ' + r.id + ' ' + r.ms + 'ms');
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
    r9: '',
    tally: ''
  },
  onInit() {
    if (!boot) boot = makeBoot();
    setup(this);
  },
  onSetup() {
    setup(this);
  },
  onSend() {
    var vm = this;
    try {
      var now = Date.now();
      var gone = lost(pending, now);
      for (var i = 0; i < gone.length; i++) {
        n.lost++;
        addRow(rows, '! lost ' + gone[i]);
      }
      if (!client) {
        note(vm, 'x send no client');
        return;
      }
      seq++;
      var req = makeRequest(boot, seq);
      var b = new Builder();
      b.setDescription(JSON.stringify(req));
      var m = new Message();
      m.builder = b;
      pending[req.id] = now;
      n.sent++;
      show(vm);
      // All four callbacks: the SDK calls onSendResult and onSendProgress without checking for them.
      client.send(m, {
        onSuccess: function () {},
        onFailure: function () {},
        onSendResult: function (r) {
          note(vm, '> ' + req.id + ' ' + (r && r.code ? r.code : '-'));
        },
        onSendProgress: function (p) {}
      });
    } catch (e) {
      fail(vm, 'send', e);
    }
  },
  onDestroy() {
    if (!client) return;
    try {
      client.unregisterReceiver({ onSuccess: function () {} });
    } catch (e) {
      // the page is closing; nothing left to show
    }
  }
};
