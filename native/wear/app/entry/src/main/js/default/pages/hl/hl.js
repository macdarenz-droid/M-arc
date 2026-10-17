import router from '@system.router';
import vibrator from '@system.vibrator';

// WATCH-C4 highlights page: the lines h1 to h5 from the index page, two short buzzes, a tap goes back. It keeps
// nothing and needs only the router and the vibrator. Every entry point catches what it throws.
var timer = 0, t0 = 0;

function no() {}
function buzz() { try { vibrator.vibrate({ mode: 'short', success: no, fail: no }); } catch (e) {} }

export default {
	data: { h1: '', h2: '', h3: '', h4: '', h5: '' },
  onInit() {
		try {
			t0 = Date.now();
			buzz();
			timer = setTimeout(buzz, 250);
		} catch (e) {}
	},
	// a tap within 1 s of the switch is the finger still on the index page; the router itself refuses a second
	// replace while one runs (ace_engine_lite js_router.cpp Router::Replace)
  onTap() {
		try {
			if (Math.abs(Date.now() - t0) >= 1000) router.replace({ uri: 'pages/index/index' });
		} catch (e) {}
	},
  onDestroy() {
		try {
			clearTimeout(timer);
		} catch (e) {}
	}
};
