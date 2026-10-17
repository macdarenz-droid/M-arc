import { P2pClient, Message, Builder } from '../wearengine.js';
import storage from '@system.storage';
import brightness from '@system.brightness';
import vibrator from '@system.vibrator';
import sensor from '@system.sensor';
import router from '@system.router';
import { PHONE_PKG, PHONE_FP, Link, makeBoot } from '../../common/link.js';

// WATCH-C page; common/link.js does the rest. Entry points catch what they throw.
var client, link, page, timer, ct = 0;

// a tap within 1 s of a screen change is the same finger
function g(s) { var t = Date.now(); if (Math.abs(t - ct) < 1000) return 0; if (s) ct = t; return 1; }

function no() {}
function tap(f, a) { try { link[f](a); } catch (e) {} }

// t1 to t5, c1 to c4 of index.hml, from view()
var SLOTS = 't1 t2 t3 t4 t5 c1 c2 c3 c4'.split(' ');
function slots(v) {
	var k = v.sc;
	return v.dm ? [k == 2 ? v.rc : v.l2] : k == 1 ? [v.sp, v.l2, v.la, v.sl || v.hr, '', v.e1, v.e2, v.e3, v.cb] : k == 2 ? [v.rc, v.sl, v.hr] :
		k == 3 ? [v.dn, v.n0, v.n1, v.n2, v.n3, v.b0, v.b1, v.b2, v.b3] : k == 7 ? [v.ak, v.av] : k ? [v.na, v.add ? v.rest : '', v.na && 'Pending'] : [v.l1, v.l2];
}

// a new screen: set and t1 go last (611b09c8)
function paint() {
	var v = page && link ? link.view() : 0, s = v && slots(v), k, e = v.dm ? 8 : v.sc;
	if (!v) return;
	if (e !== page.sc) page.set = false, page.t1 = '';
	for (k in v) if (k !== 'sc' && k !== 'set' && k in page) page[k] = v[k];
	for (k = 1; k < 9; k++) page[SLOTS[k]] = s[k] || (k < 5 ? '' : '#08090a');
	page.sc = e;
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

// C3: heart rate with keep-on; never stored or sent
function keep(on) {
	try { brightness.setKeepScreenOn({ keepScreenOn: on, success: no, fail: no }); } catch (e) {}
	hr(on);
}

function buzz() { try { vibrator.vibrate({ mode: 'long', success: no, fail: no }); } catch (e) {} }
function hr(on) {
	try { sensor.unsubscribeHeartRate(); } catch (e) {}
	if (on) try { sensor.subscribeHeartRate({ success: function (d) { tap('beat', d && d.heartRate); }, fail: function (d, c) { tap('beat', -c); } }); } catch (e) {}
}

function hl(p) { try { router.replace({ uri: 'pages/hl/hl', params: p }); } catch (e) {} }

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
		sc: 0, off: 0, ck: '', set: 0, nm: '', cl: '', nx: '', ns: '', r0: '', r1: '', r2: '', r3: '',
		t1: '', t2: '', t3: '', t4: '', t5: '', c1: '#08090a', c2: '#08090a', c3: '#08090a', c4: '#08090a',
		hm: '', hd: '', hv: false, im: '', hc: '', kc: ''
	},
  onInit() {
		try {
			page = this;
			link = Link({ store: storage, send: send, keep: keep, connect: connect, now: function () { return Date.now(); }, paint: paint, buzz: buzz, hl: hl }, makeBoot());
			link.start();
			timer = setInterval(function () { try { link.tick(); } catch (e) {} }, 1000);
			paint();
		} catch (e) {}
	},
  onShow() { try { link.show(); } catch (e) {} },
  onComplete() { try { g(1) && link.complete(); } catch (e) {} },
  onEffort() { try { link.effort(); } catch (e) {} },
  onSub() { g() && tap('rest', 'rest_sub_15'); },
  onAdd() { try { g() && link.rest('rest_add_15'); } catch (e) {} },
  onSkip() { try { g(1) && link.rest('rest_skip'); } catch (e) {} },
  onEasy() { tap('effort', 1); },
  onIdeal() { tap('effort', 2); },
  onMax() { tap('effort', 3); },
  onNext() { tap('next'); },
  onR0() { tap('pick', 0); },
  onR1() { tap('pick', 1); },
  onR2() { tap('pick', 2); },
  onR3() { tap('pick', 3); },
  onSwipe: function (e) { tap('next', e && e.direction); },
  onAdj() { tap('adj'); },
  onOk() { g(1) && tap('ok'); },
  onLess() { tap('adj', -1); },
  onMore() { tap('adj', 1); },
  onDone() { g(1) && tap('adj', 0); },
  onTouch() { tap('touch'); },
  onDestroy() {
		clearInterval(timer);
		keep(false);
		page = null;
		try { client.unregisterReceiver({ onSuccess: no }); } catch (e) {}
		try { link.die(); } catch (e) {}
	}
};
