// 2 h session: phone pushes a snap every 3 s, 200 commands (Complete / +30 / skip), some phone drop-outs
NOLOG = true;
NOLOG = true; PH = Phone();
openApp(); advance(5000);
var base = mem(true).alloc, cmds = 0, row = [];
for (var t = 1; t <= 7200; t++) {
  if (t % 3 === 0) deliver(PH.snap(null), 1);
  if (t % 36 === 0 && cmds < 200) { cmds++; tap(cmds % 3 === 0 ? 'onAdd' : cmds % 5 === 0 ? 'onSkip' : 'onComplete'); if (cmds % 4 === 0) tap('onEffort'); }
  PH.on = !(t % 600 > 540); // phone out of range 1 min in every 10
  advance(1000);
  if (t % 1800 === 0) row.push(Math.round(t / 60) + 'min:' + (mem(true).alloc - base) + 'B ev' + EV.length);
}
print('cmds tapped', cmds, 'phone applied', PH.applied, 'storage ops', ST.n, 'maxIn', ST.maxIn, 'bad', ST.bad.length, 'ESC', ESC.length);
print(J(ESC));
