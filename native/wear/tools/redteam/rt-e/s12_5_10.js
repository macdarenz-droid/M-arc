// true crash loop: the app dies 5 seconds after every start (no onDestroy); the user reopens 10 s later
function crash() { EV = []; TIMERS = {}; RECV = null; ST.inflight = 0; }
PH = Phone();
var live = 0, paused = 0, line = [];
for (var i = 0; i < 40; i++) {
  openApp(); advance(3000);
  var p = PAGE.l1 === 'Paused after restarts';
  if (p) paused++; else live++;
  line.push(p ? 'P' : 'L');
  if (p) { advance(4000); closeApp(); advance(10 * 1000); continue; }
  advance((5 - 3) * 1000); crash(); advance(10 * 1000);
}
print('crash at ' + 5 + ' s, reopen after ' + 10 + ' s:', line.join(''), '| crashing starts', live, 'of 40, over', Math.round(MONO / 60000), 'min');
