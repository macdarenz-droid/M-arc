// q at 7 pending (phone not answering), slow storage, then N quick +30 taps
var N = 11;
PH = Phone(); PH.answer = false;
openApp(); advance(5000);
for (var i = 0; i < 7; i++) { tap('onAdd'); advance(2000); }
print('filled st', PAGE.st);
ST.lat = 1500;
for (i = 0; i < N; i++) { tap('onAdd'); advance(150); }
advance(10000); ST.lat = 5;
print('after burst st', J(PAGE.st), 'storage ops', ST.n);
var n0 = ST.n;
PH.answer = true; advance(40000);
print('phone applied', PH.applied, 'st', J(PAGE.st), 'storage ops since', ST.n - n0);
var n1 = ST.n; tap('onComplete'); advance(5000);
print('complete on new set: st', J(PAGE.st), 'can', PAGE.can, 'storage ops', ST.n - n1, '| last', ST.log.slice(-2).join(' | '));
print('ESC', J(ESC), 'bad', ST.bad.length);
