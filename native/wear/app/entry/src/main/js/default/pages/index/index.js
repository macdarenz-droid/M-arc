import { P2pClient, Message, Builder } from '../wearengine.js';
import storage from '@system.storage';
import brightness from '@system.brightness';
import { PHONE_PKG, PHONE_FP, Link, makeBoot } from '../../common/link.js';

// WATCH-C page; common/link.js does the rest. Every entry point catches what it throws.
var client, link, page, timer;

function no() {}
function tap(f, a) { try { link[f](a); } catch (e) {} }

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
		l2: '', rest: '', set: 0, add: 0, cb: '', off: 0, ck: '', sc: 0, nm: '', sp: '', la: '', sl: '',
		cl: '', e1: '', e2: '', e3: '', rc: '', nx: '', ns: '', dn: '', r0: '', r1: '', r2: '', r3: '', n0: '', n1: '', n2: '', n3: '',
		b0: '', b1: '', b2: '', b3: '', na: '', l1: ''
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
  onEasy() { tap('effort', 1); },
  onIdeal() { tap('effort', 2); },
  onMax() { tap('effort', 3); },
  onNext() { tap('next'); },
  onR0() { tap('pick', 0); },
  onR1() { tap('pick', 1); },
  onR2() { tap('pick', 2); },
  onR3() { tap('pick', 3); },
  onSwipe: function (e) { tap('next', e && e.direction); },
  onDestroy() {
		clearInterval(timer);
		keep(false);
		page = null;
		try { client.unregisterReceiver({ onSuccess: no }); } catch (e) {}
		try { link.die(); } catch (e) {}
	}
};
