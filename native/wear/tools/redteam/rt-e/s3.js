// one setTimeout(0) is not delivered (ACE lite deletes the timer when DispatchToLoop fails)
PH = Phone();
openApp(); advance(5000);
DROP_TIMER = NT + 2; // the timer that delivers the first storage callback of the next command
var n0 = ST.n;
tap('onComplete'); advance(1000);
var dropped = NT >= DROP_TIMER;
for (var i = 0; i < 20; i++) { advance(3000); tap('onAdd'); }
advance(600000);
print('timer dropped:', dropped, '| storage calls after it in 11 min:', ST.n - n0 - 1, '| phone got cmds:', PH.cmds, '| st', J(PAGE.st), '| can', PAGE.can);
