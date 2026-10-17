import { P2pClient, Message, Builder } from '../wearengine.js';
import storage from '@system.storage';
import brightness from '@system.brightness';
import { PHONE_PKG, PHONE_FP, Link, makeBoot } from '../../common/link.js';

// WATCH-C page; common/link.js does the rest. Every entry point catches what it throws.
var client, link, page, timer;

function no() {}
function tap(f, a) { try { link[f](a); } catch (e) {} }

// the lines t1 to t5 and colours c1 to c4 that the screens share (index.hml), from link.js view(), by screen
var SLOTS = 't1 t2 t3 t4 t5 c1 c2 c3 c4'.split(' ');
function slots(v) {
	var k = v.sc;
	return k == 1 ? [v.sp, v.l2, v.la, v.sl, '', v.e1, v.e2, v.e3, v.cb] : k == 2 ? [v.rc, v.sl] :
		k == 3 ? [v.dn, v.n0, v.n1, v.n2, v.n3, v.b0, v.b1, v.b2, v.b3] : k ? [v.na, v.add ? v.rest : ''] : [v.l1, v.l2];
}

// only page data; a colour is always a colour. A new screen is built with its inner if-parts (set, t1) off and gets
// them after, so no build runs inside another, as in 1.1.2 (red team, 611b09c8: about 1.9 KB less stack)
function paint() {
	var v = page && link ? link.view() : 0, s = v && slots(v), k;
	if (!v) return;
	if (v.sc !== page.sc) page.set = false, page.t1 = '';
	for (k in v) if (k !== 'sc' && k !== 'set' && k in page) page[k] = v[k];
	for (k = 1; k < 9; k++) page[SLOTS[k]] = s[k] || (k < 5 ? '' : '#08090a');
	page.sc = v.sc;
	page.set = v.set;
	page.t1 = s[0] || '';
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
	// what index.hml binds; t1 to t5 and c1 to c4 are the lines and colours the screens share (slots)
	data: {
		sc: 0, off: 0, ck: '', set: 0, nm: '', cl: '', nx: '', ns: '', r0: '', r1: '', r2: '', r3: '',
		t1: '', t2: '', t3: '', t4: '', t5: '', c1: '#08090a', c2: '#08090a', c3: '#08090a', c4: '#08090a'
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
