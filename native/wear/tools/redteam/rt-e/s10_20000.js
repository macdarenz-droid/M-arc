PH = Phone(); openApp(); advance(5000);
var nest = new Array(20000 + 1).join('[') + new Array(20000 + 1).join(']');
top(function () { RECV({ message: nest }); }, 'onReceiveMessage'); advance(2000);
print('survived depth', 20000, 'ESC', J(ESC), 'l1', PAGE.l1);
