var d = 0; function r() { d++; r(); }
try { r(); } catch (e) { print('depth', d, String(e)); }
print(typeof Map, typeof Promise, typeof Object.assign, typeof [].includes, typeof String.prototype.repeat);
var m = mem(true); print('alloc', m.alloc, 'peak', m.peak);
