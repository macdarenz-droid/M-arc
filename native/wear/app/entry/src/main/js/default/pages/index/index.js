import { P2pClient, Message, Builder } from '../wearengine.js';
import storage from '@system.storage';
import brightness from '@system.brightness';
import { PHONE_PKG, PHONE_FP, Link, makeBoot } from '../../common/link.js';

// WATCH-C page; common/link.js does the rest. Every entry point catches what it throws.
var client, link, page, timer;

function no() {}

function paint() {
	var v = page && link ? link.view() : {};
	for (var k in v) page[k] = v[k];
}

function send(text, done) {
	try {
		var b = new Builder(), m = new Message();
		b.setDescription(text);
		m.builder = b;
		client.send(m, { onSuccess: no, onFailure: no, onSendProgress: no, onSendResult: function (r) { try { done(r && r.code); } catch (e) {} } });
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
			onSuccess: function () { try { link.show(); } catch (e) {} },
			onFailure: no,
			onReceiveMessage: function (msg) { try { link.rx(msg); } catch (e) {} }
		});
	} catch (e) {}
}

export default {
	data: {
		l1: '', l2: '', eff: '', rest: '', st: '', p1: '', p2: '', set: false, can: false, rs: false, add: false,
		bg: '#08090a', fg: '#f7f8f8', ac: '#5e6ad2', cb: '#3a3a3a'
	},
  onInit() {
		try {
			page = this;
			link = Link({ store: storage, send: send, keep: keep, connect: connect, now: function () { return Date.now(); }, paint: paint }, makeBoot());
			link.start();
			timer = setInterval(function () { try { link.tick(); } catch (e) {} }, 1000);
			paint();
		} catch (e) {}
	},
  onShow() { try { link.show(); } catch (e) {} },
  onComplete() { try { link.complete(); } catch (e) {} },
  onEffort() { try { link.effort(); } catch (e) {} },
  onAdd() { try { link.rest('rest_add_30'); } catch (e) {} },
  onSkip() { try { link.rest('rest_skip'); } catch (e) {} },
  onDestroy() {
		try { link.die(); } catch (e) {}
		clearInterval(timer);
		keep(false);
		page = null;
		try { client.unregisterReceiver({ onSuccess: no }); } catch (e) {}
	}
};
