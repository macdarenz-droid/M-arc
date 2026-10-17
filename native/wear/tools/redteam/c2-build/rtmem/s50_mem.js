// heap held: before the page loads, after open, after 1 min of snaps and Completes
var m0 = mem(true).alloc;
PH = Phone(); openApp(); advance(5000);
var m1 = mem(true).alloc;
for (var i = 0; i < 6; i++) { tap('onComplete'); advance(10000); }
var m2 = mem(true).alloc;
print('alloc before open', m0, '| after open', m1, '| after 6 Completes', m2, '| peak', mem(false).peak, '| ESC', J(ESC));
