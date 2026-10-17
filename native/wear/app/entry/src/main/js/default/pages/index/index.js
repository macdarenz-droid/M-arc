import { P2pClient, Message, Builder } from '../wearengine.js';
import storage from '@system.storage';
import brightness from '@system.brightness';
import { PHONE_PKG, PHONE_FP, Link, makeBoot } from '../../common/link.js';

// WATCH-C page: radio, storage and screen calls; the rest is common/link.js.
var client = null, link = null, page = null, timer = null;

function paint() {
  var v = page && link ? link.view() : {};
  for (var k in v) page[k] = v[k];
}

function no() {}

function send(text, done) {
  try {
    var b = new Builder(), m = new Message();
    b.setDescription(text);
    m.builder = b;
    client.send(m, { onSuccess: no, onFailure: no, onSendProgress: no, onSendResult: function (r) { done(r && r.code); } });
  } catch (e) {
    done(-1);
  }
}

function keep(on) {
  try { brightness.setKeepScreenOn({ keepScreenOn: on, success: no, fail: no }); } catch (e) {}
}

function connect() {
  try {
    client = new P2pClient();
    client.setPeerPkgName(PHONE_PKG);
    client.setPeerFingerPrint(PHONE_FP);
    client.registerReceiver({
      onSuccess: function () { link.show(); },
      onFailure: no,
      onReceiveMessage: function (msg) {
        if (typeof msg === 'string') link.rx(msg);
      }
    });
  } catch (e) {}
}

export default {
  data: {
    l1: '', l2: '', eff: '', rest: '', st: '', p1: '', p2: '', set: false, can: false, rs: false, add: false,
    bg: '#08090a', fg: '#f7f8f8', ac: '#5e6ad2', cb: '#3a3a3a'
  },
  onInit() {
    page = this;
    link = Link({ store: storage, send: send, keep: keep, connect: connect, now: function () { return Date.now(); }, paint: paint }, makeBoot());
    link.start();
    timer = setInterval(function () { link.tick(); }, 1000);
    paint();
  },
  onShow() { link.show(); },
  onComplete() { link.complete(); },
  onEffort() { link.effort(); },
  onAdd() { link.rest('rest_add_30'); },
  onSkip() { link.rest('rest_skip'); },
  onDestroy() {
    clearInterval(timer);
    keep(false);
    page = null;
    try {
      client.unregisterReceiver({ onSuccess: no });
    } catch (e) {}
  }
};
