PH = Phone(); openApp(); advance(5000);
var nest = new Array(DEPTH + 1).join('[') + new Array(DEPTH + 1).join(']');
top(function () { RECV({ message: nest }); }, 'onReceiveMessage'); advance(2000);
print('survived depth', DEPTH, 'ESC', J(ESC), 'l1', PAGE.l1);
