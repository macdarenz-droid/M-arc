// s62 (WATCH-C3 L4): heart-rate samples every 5 s on Set and Rest, a 602 fail, samples that stop, 1,000 rapid samples;
// unsubscribed at close; nothing of it in a message or in storage; then a sensor and vibrator that throw.
NOLOG = false;
PH = Phone3(6); openApp(); advance(5000);
var log = [];
function line() { return PAGE.sc === 1 ? PAGE.t4 : PAGE.sc === 2 ? PAGE.t3 : '-'; }
function at(tag) { log.push(tag + ':' + PAGE.sc + '/' + J(line())); }
var s0 = HR.sub;
for (var i = 0; i < 6; i++) { beat(118 + i); advance(5000); }
at('set');
tap('onComplete'); advance(2000);
for (i = 0; i < 4; i++) { beat(140 - i); advance(5000); }
at('rest');
hrFail(602); advance(1000); at('602');
beat(99); advance(1000); at('back');
advance(17000); at('stale');
for (i = 0; i < 1000; i++) beat(60 + (i % 100));
advance(1000); at('burst');
var leak = SENT.concat(Object.keys(ST.map).map(function (k) { return ST.map[k]; })).filter(function (x) { return /bpm|heart/i.test(x); }).length;
print('s62 ESC', J(ESC), 'bad', J(ST.bad), 'maxIn', ST.maxIn, '| subscribed', s0, HR.sub, 'samples', HR.n, '| in messages or storage', leak);
print('s62 screens', log.join(' '));
closeApp(); advance(6000); beat(70);
print('s62 closed: unsub', HR.unsub, 'cb', HR.cb === null, 'sends after', SENT_AFTER_DESTROY, 'ESC', J(ESC));
DEVBAD = true; ESC = []; PH = Phone3(6); openApp(); advance(5000); tap('onComplete'); advance(95000); closeApp(); advance(2000);
print('s62 throwing sensor and vibrator: ESC', J(ESC), 'sc', PAGE.sc, 'applied', PH.applied);
