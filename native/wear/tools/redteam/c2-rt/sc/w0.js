// W0: open the page and idle 5 s with a phone answering (start-up only)
var m0 = mem(true).alloc;
PH = Phone(); openApp(); advance(5000);
print('W0 alloc before open', m0, 'after open', mem(true).alloc, 'peak', mem(false).peak, 'sc', PAGE.sc, 'ESC', J(ESC));
