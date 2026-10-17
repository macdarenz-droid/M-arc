// s60 (WATCH-C3 L1, L2): one set online, then the phone away: 4 sets logged from the snap's nx, each with its local rest,
// Rest done and OK; the 4th leaves nothing, so Phone not connected; the phone back: 4 sets saved in order at their tap times.
NOLOG = true;
PH = Phone3(6); openApp(); advance(5000);
var log = [];
function at(tag) { log.push(tag + ':' + PAGE.sc + (PAGE.t1 ? '/' + PAGE.t1 : '')); }
at('open');
tap('onComplete'); advance(3000); at('set1');
tap('onSkip'); advance(3000); at('skip');
PH.on = false; advance(30000); at('away');
var taps = [];
for (var i = 0; i < 4; i++) {
  taps.push(Date.now()); tap('onComplete'); advance(2500); at('c' + i);
  advance(88000); at('end' + i);
  tap('onOk'); advance(1000); at('ok' + i);
}
var vib = VIB.length, q = ST.map.m2q;
PH.on = true; advance(90000); at('back');
var dt = PH.done.map(function (d, k) { return d[0] + (k ? ' ' + (d[1] - taps[k - 1]) : ''); });
print('s60 ESC', J(ESC), 'bad', J(ST.bad), 'maxIn', ST.maxIn, 'overlap', ST.overlap, '| queued', J(q), 'vib', vib, J(VIB.slice(0, 2)));
print('s60 screens', log.join(' '));
print('s60 phone saved', J(dt), 'applied', PH.applied, 'cmds', PH.cmds, 'outbox', J(ST.map.m2q));
closeApp(); advance(2000);
print('s60 closed: sends after', SENT_AFTER_DESTROY, 'RUN', J(ST.map.m2r), 'hr sub', HR.sub, 'unsub', HR.unsub, 'ESC', J(ESC));
