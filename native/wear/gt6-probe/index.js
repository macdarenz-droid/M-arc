import sensor from '@system.sensor';
import storage from '@system.storage';
import vibrator from '@system.vibrator';
import { P2pClient, Message, Builder } from '../../wearengine/wearengine';
import { createProbe } from './probe';

// Public phone identity. The Android lab needs the DIFFERENT watch certificate fingerprint.
var PHONE_PACKAGE = 'com.mrcdrnzz.dailytracker';
var PHONE_CERTIFICATE = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
var client, probe;

export default {
  data: { state: 'Starting probe', bpm: '--' },
  onInit: function () {
    var page = this;
    function guarded(fn) {
      try {
        var pending = fn();
        if (pending && typeof pending.catch === 'function') pending.catch(function () { page.state = 'SDK promise rejected'; });
      } catch (e) { page.state = 'SDK exception'; }
    }
    guarded(function () {
      probe = createProbe({
        now: function () { return Date.now(); },
        setTimeout: setTimeout, clearTimeout: clearTimeout, setInterval: setInterval, clearInterval: clearInterval,
        sensor: sensor, storage: storage, vibrator: vibrator,
        status: function (message) { page.state = message; },
        heart: function (bpm) { page.bpm = String(bpm); },
        send: function (text) {
          var builder = new Builder(); builder.setDescription(text);
          var message = new Message(); message.builder = builder;
          if (!client) { page.state = 'Phone link unavailable'; return; }
          return client.send(message, {
            onSuccess: function () {},
            onFailure: function () { page.state = 'Send failed'; },
            onSendResult: function (result) { page.state = 'Send code: ' + result.code; }
          });
        }
      });
      client = new P2pClient();
      client.setPeerPkgName(PHONE_PACKAGE);
      client.setPeerFingerPrint(PHONE_CERTIFICATE);
      return client.registerReceiver({
        onSuccess: function () { page.state = 'Ready for phone tests'; },
        onFailure: function () { page.state = 'Receiver failed'; },
        onReceiveMessage: function (data) { if (probe) probe.receive(data); }
      });
    });
  },
  onShow: function () { if (probe) probe.show(); },
  onHide: function () { if (probe) probe.hide(); },
  swipe: function () { if (probe) probe.swipe(); },
  start: function () { if (probe) probe.startLocal(); },
  stop: function () { if (probe) probe.stop(); },
  onDestroy: function () {
    if (probe) probe.dispose();
    probe = null;
    try {
      if (client) {
        var pending = client.unregisterReceiver({ onSuccess: function () {}, onFailure: function () {} });
        if (pending && typeof pending.catch === 'function') pending.catch(function () {});
      }
    } catch (e) { /* Page destroyed; no more writes to UI. */ }
    client = null;
  }
};
