// receiver callbacks that were already queued when the page was destroyed
PH = Phone(); PH.rest = false;
openApp(); advance(5000);
var oldRecv = RECV; closeApp(); advance(100);
var k0 = KEEP.length, s0 = SENT.length;
top(function () { oldRecv({ message: PH.snap(null) }); }, 'late rx');
top(function () { oldRecv({ isRegister: true }); }, 'late register');
advance(70000);
print('after onDestroy: keep calls', J(KEEP.slice(k0)), '| sends', SENT.length - s0, J(SENT.slice(s0).map(function (t) { return JSON.parse(t).k; })), '| ESC', J(ESC));
