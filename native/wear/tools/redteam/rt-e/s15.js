// clock before 2020 / far future relative to the stored count
function one(stored, woff) { ST.map = { m2r: stored }; WOFF = woff; PH = Phone(); openApp(); advance(4000); var r = PAGE.l1; closeApp(); advance(1000); EV = []; TIMERS = {}; return J(r) + ' m2r=' + ST.map.m2r; }
var now = Date.now();
print('stored 5,now; clock 2019:', one('5,' + now, Date.UTC(2019, 0, 1) - now));
WOFF = 0; print('stored 5,2030; clock now:', one('5,' + Date.UTC(2030, 0, 1), 0));
print('stored 2,now-1s; clock 1970+:', one('2,' + (now - 1000), -now + 5000));
print('stored 2,5000; clock 1970+6s (3rd quick start):', one('2,5000', -now + 6000));
print('stored 2,-5000; clock 1969:', one('2,-5000', -now - 4000));
print('ESC', J(ESC));
