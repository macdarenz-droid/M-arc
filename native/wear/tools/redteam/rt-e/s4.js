// normal use: open, glance 20 s, swipe away; three times in under two minutes
PH = Phone();
openApp(); advance(20000); closeApp(); advance(10000);
openApp(); advance(20000); closeApp(); advance(10000);
openApp(); advance(5000);
print('3rd open:', J(PAGE.l1), J(PAGE.l2), '| m2r', ST.map.m2r, '| can', PAGE.can);
var s0 = SENT.length; tap('onComplete'); advance(5000);
print('Complete while paused: msgs sent', SENT.length - s0, 'st', J(PAGE.st));
advance(9 * 60000); print('after 9.5 min:', J(PAGE.l1));
advance(60000); print('after 10.5 min:', J(PAGE.l1));
// clock set back 1 h while paused
ST.map = {}; closeApp(); advance(200000);
openApp(); advance(5000); closeApp(); advance(5000); openApp(); advance(5000); closeApp(); advance(5000); openApp(); advance(5000);
print('B paused:', J(PAGE.l1));
WOFF -= 3600000; advance(15 * 60000);
print('B clock set back 1 h, 15 min later:', J(PAGE.l1), '| 30 min later:', (advance(15 * 60000), J(PAGE.l1)));
closeApp(); advance(1000); openApp(); advance(5000); print('B after reopen:', J(PAGE.l1));
print('ESC', J(ESC));
