// s61 (WATCH-C3 L3): Adjust by taps and swipes, odd swipes, 1,000 swipes to the clamps, Complete sends the draft;
// a snap with a new rev drops the draft; paging stays off while Adjust is open.
NOLOG = true;
PH = Phone3(6); openApp(); advance(5000);
var log = [];
function at(tag) { log.push(tag + ':' + PAGE.sc + '/' + PAGE.t1 + '/' + PAGE.t2); }
tap('onAdj'); at('open');
swipe('up'); swipe('up'); at('up2');
swipe('down'); at('down');
swipe('left'); at('left');
swipe('up'); tap('onMore'); tap('onMore'); tap('onLess'); at('reps');
top(function () { O.onSwipe.call(PAGE, undefined); }, 'odd'); top(function () { O.onSwipe.call(PAGE, {}); }, 'odd');
top(function () { O.onSwipe.call(PAGE, { direction: { toString: 1 } }); }, 'odd'); top(function () { O.onSwipe.call(PAGE, null); }, 'odd');
at('odd');
swipe('right'); tap('onDone'); advance(1000); at('done');
tap('onComplete'); advance(3000); tap('onSkip'); advance(3000);
tap('onAdj');
for (var i = 0; i < 1000; i++) swipe('up');
swipe('left');
for (i = 0; i < 1000; i++) swipe('down');
at('clamps');
tap('onDone'); tap('onComplete'); advance(3000); tap('onSkip'); advance(3000);
// a draft, then the phone changes the set (new rev): its values come back and Adjust closes
tap('onAdj'); swipe('up'); PH.rev = 5; deliver(PH.snap(null), 1); advance(1000); at('rev');
swipe('up'); advance(1000); at('page');
print('s61 ESC', J(ESC), 'bad', J(ST.bad), 'maxIn', ST.maxIn);
print('s61 screens', log.join(' '));
print('s61 phone saved', J(PH.done));
closeApp(); advance(2000);
print('s61 closed: sends after', SENT_AFTER_DESTROY, 'ESC', J(ESC));
