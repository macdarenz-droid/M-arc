// wall clock set back 1 h with a command pending
PH = Phone(); PH.answer = false;
openApp(); advance(5000); tap('onComplete'); advance(3000);
var c0 = PH.cmds, h0 = SENT.length; WOFF -= 3600000; PH.answer = true;
advance(10 * 60000);
print('clock back 1 h: resends in 10 min', PH.cmds - c0, '| hellos+cmds sent', SENT.length - h0, '| st', J(PAGE.st), '| p1', J(PAGE.p1));
advance(55 * 60000); print('65 min later: resends', PH.cmds - c0, 'st', J(PAGE.st));
