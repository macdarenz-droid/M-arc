PH = Phone(); openApp(); advance(5000);
var flat = '{"t":"mw","v":1,"k":"snap","pt":1,"x":[' + new Array(40001).join('0,') + '0]}';
print('msg bytes', flat.length);
top(function () { RECV({ message: flat }); }, 'onReceiveMessage'); advance(2000);
print('survived', J(ESC));
