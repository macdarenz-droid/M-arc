// malformed phone input; each case on a fresh app with one pending command
function mk(o) { var s = JSON.parse(PH.snap(null)); for (var k in o) s[k] = o[k]; return JSON.stringify(s); }
function setx(o) { var s = JSON.parse(PH.snap(null)); for (var k in o) s.set[k] = o[k]; return JSON.stringify(s); }
var cases = {
  file: { isFileType: true, name: 'x' }, undef: undefined, num: 5, empty: '', nul: 'null', arr: '[]', str: '"mw"',
  noV: '{"t":"mw"}', badSnap: '{"t":"mw","v":1,"k":"snap"}', proto: '{"t":"mw","v":1,"k":"res","commandId":"__proto__","status":"applied"}',
  inf: '{"t":"mw","v":1,"k":"snap","pt":1e999,"wt":null,"sid":null}', hugeEx: null,
  exObj: null, repsObj: null, wObj: null, reasonObj: null, thBad: null, flood: null
};
var results = [];
function runCase(name) {
  ST.map = {}; ESC = []; PH = Phone(); PH.answer = false;
  openApp(); advance(5000); tap('onComplete'); advance(2000);
  var cid = JSON.parse(SENT[SENT.length - 1]).commandId;
  var m = cases[name];
  if (name === 'hugeEx') m = mk({ ex: new Array(20001).join('x') });
  if (name === 'exObj') m = mk({ ex: { toString: 1 } });
  if (name === 'repsObj') m = setx({ id: 'set_other', r: { toString: 1 } });
  if (name === 'wObj') m = setx({ id: 'set_other', w: { toString: 1 } });
  if (name === 'reasonObj') m = JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId: cid, status: 'rejected', reason: { toString: 1 } });
  if (name === 'thBad') m = mk({ th: [1, {}, null] });
  if (name === 'flood') { for (var i = 0; i < 2000; i++) top(function () { RECV({ message: PH.snap(null) }); }, 'rx'); m = PH.snap(null); }
  top(function () { RECV(typeof m === 'object' && m && m.isFileType ? { isFileType: true, file: 'x' } : { message: m }); }, 'onReceiveMessage');
  advance(3000);
  if (name === 'wObj') tap('onComplete');
  advance(3000);
  results.push(name + ' kinds=' + J(ESC.map(function (e) { return e.split(':')[0]; })) + ' esc=' + ESC.length + (ESC.length ? ' [' + ESC[0] + ' x' + ESC.length + ']' : '') + ' l1=' + J(String(PAGE.l1).slice(0, 24)) + ' bad=' + ST.bad.length);
  closeApp(); advance(1000);
}
for (var c in cases) runCase(c);
print(results.join('\n'));
