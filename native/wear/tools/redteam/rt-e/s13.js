// count read hangs or fails at start
PH = Phone(); ST.mode = function (op, key) { return op === 'get' && key === 'm2r' ? MODE : 'ok'; };
openApp(); advance(7000); var a = PAGE.l1; ST.mode = null;
advance(600000); print('m2r read ' + J(MODE) + ':', J(a), '-> after 10 min', J(PAGE.l1), 'ESC', J(ESC));
