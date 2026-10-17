// fw.js: after rt-e/prelude.js, a model of ACE lite's JS framework on the watch (OpenHarmony arkui_ace_engine_lite
// frameworks/packages/runtime-core: ViewModel with proxied data, Subject hijacking each data key, an Observer per binding),
// ported to ES5 (Set as a small array set: this JerryScript build has no ES2015 Set), plus native _c and _i stubs that,
// like the native render, watch every function-valued attr and dynamicStyle and mount an if-branch while its condition holds.
var ObserverStack = { stack: [], push: function (o) { this.stack.push(o); }, pop: function () { return this.stack.pop(); }, top: function () { return this.stack[this.stack.length - 1]; } };
function canObserve(t) { return typeof t === 'object' && t !== null; }
function defineProp(t, k, v) { Object.defineProperty(t, k, { enumerable: false, value: v }); }
function MiniSet() { this.a = []; }
MiniSet.prototype.has = function (x) { return this.a.indexOf(x) >= 0; };
MiniSet.prototype.add = function (x) { if (!this.has(x)) this.a.push(x); return this; };
MiniSet.prototype['delete'] = function (x) { var i = this.a.indexOf(x); if (i >= 0) this.a.splice(i, 1); };
MiniSet.prototype.forEach = function (f) { var c = this.a.slice(); for (var i = 0; i < c.length; i++) f(c[i]); };
MiniSet.prototype.clear = function () { this.a = []; };
function Observer(ctx, getter, cb, meta) { this._ctx = ctx; this._getter = getter; this._fn = cb; this._meta = meta; this._lastValue = this._get(); }
Observer.prototype._get = function () { try { ObserverStack.push(this); return this._getter.call(this._ctx); } finally { ObserverStack.pop(); } };
var FWERR = [];
Observer.prototype.update = function () {
  try {
  var l = this._lastValue, n = this._get();
  if (n !== l || canObserve(n)) { this._fn.call(this._ctx, n, l, this._meta); this._lastValue = n; }
  } catch (e) { if (FWERR.length < 5) FWERR.push(String(e)); FWN++; throw e; }
};
var FWN = 0;
Observer.prototype.subscribe = function (subject, key) {
  var d = subject.attach(key, this);
  if (typeof d !== 'function') return;
  if (!this._detaches) this._detaches = new MiniSet();
  this._detaches.add(d);
};
Observer.prototype.unsubscribe = function () { var d = this._detaches; if (!d) return; d.forEach(function (x) { x(); }); d.clear(); };
function Subject(target) { var s = this; s._hijacking = true; defineProp(target, '__ob__', s); Object.keys(target).forEach(function (k) { hijack(target, k, target[k]); }); }
Subject.of = function (t) { if (!t || !canObserve(t)) return t; if (t.__ob__) return t.__ob__; return new Subject(t); };
Subject.is = function (t) { return t && t._hijacking; };
Subject.prototype.attach = function (key, obs) {
  if (typeof key === 'undefined' || !obs) return;
  if (!this._obsMap) this._obsMap = {};
  if (!this._obsMap[key]) this._obsMap[key] = new MiniSet();
  var o = this._obsMap[key];
  if (!o.has(obs)) { o.add(obs); return function () { o['delete'](obs); }; }
};
Subject.prototype.notify = function (key) { if (!this._obsMap || !this._obsMap[key]) return; this._obsMap[key].forEach(function (o) { o.update(); }); };
Subject.prototype.setParent = function (p, k) { this._parent = p; this._key = k; };
function hijack(target, key, cache) {
  var subject = target.__ob__;
  Object.defineProperty(target, key, { enumerable: true,
    get: function () { var o = ObserverStack.top(); if (o) o.subscribe(subject, key); var ss = Subject.of(cache); if (Subject.is(ss)) ss.setParent(subject, key); return cache; },
    set: function (v) { cache = v; subject.notify(key); } });
}
function initState(vm, data) {
  if (typeof data === 'function') data = data.call(vm, vm);
  Object.keys(data).forEach(function (k) { Object.defineProperty(vm, k, { enumerable: false, configurable: true, get: function () { return data[k]; }, set: function (v) { data[k] = v; } }); });
  Subject.of(data);
}
ViewModel = function (options) {
  if (!(this instanceof ViewModel)) return new ViewModel(options);
  var vm = this._vm = this;
  vm.__o = options;
  Object.keys(options).forEach(function (key) {
    var v = options[key];
    if (key === 'render') vm.$render = v; else if (key === 'data') initState(vm, v); else if (key === 'styleSheet') {} else if (typeof v === 'function') vm[key] = v.bind(vm);
  });
};
ViewModel.prototype.$watch = function (g, cb, meta) { return new Observer(this, g, cb, meta); };
// native render stubs
var RVM = null, NEL = 0, NW = 0, NMOUNT = 0;
function NOCB() {}
function watchAll(el, map) { for (var k in map) if (typeof map[k] === 'function') { el.w.push(RVM.$watch(map[k], NOCB)); NW++; } }
function _c(tag, opts, kids) {
  var el = { o: opts, tag: tag, w: [], kids: kids || [], click: opts && opts.onBubbleEvents && opts.onBubbleEvents.click };
  NEL++;
  if (opts && opts.attrs) watchAll(el, opts.attrs);
  if (opts && opts.dynamicStyle) watchAll(el, opts.dynamicStyle);
  return el;
}
function unmount(list) { for (var i = 0; i < list.length; i++) { var e = list[i]; if (!e) continue; for (var j = 0; j < e.w.length; j++) e.w[j].unsubscribe(); if (e.ifw) { if (e.kids) unmount(e.kids); } else unmount(e.kids); } }
function _i(cond, render) {
  var h = { tag: 'if', w: [], kids: null, ifw: 1 };
  function set(v) { if (v && !h.kids) { NMOUNT++;  h.kids = [render()]; var k0 = h.kids[0], cs = k0.tag + (k0.o && k0.o.staticClass) + (k0.o && k0.o.attrs && typeof k0.o.attrs.value === 'string' ? k0.o.attrs.value : '') + '#' + k0.kids.length; MC[cs] = (MC[cs] || 0) + 1; } else if (!v && h.kids) { unmount(h.kids); h.kids = null; } }
  h.w.push(RVM.$watch(cond, function (n) { set(n); }));
  set(h.w[0]._lastValue);
  return h;
}
var TREE = null;
openApp = function () {
  DESTROYED = false; PAGE = loadPage(); O = PAGE.__o;
  top(function () { O.onInit.call(PAGE); }, 'onInit');
  top(function () { RVM = PAGE; TREE = PAGE.$render(PAGE); }, 'render');
  top(function () { O.onShow.call(PAGE); }, 'onShow');
};

// the handlers a finger can reach now: click handlers of mounted elements, by page method name
function reach() {
  var out = [];
  function walk(list) { for (var i = 0; list && i < list.length; i++) { var e = list[i]; if (!e) continue; if (e.click) for (var k in PAGE.__o) if (PAGE[k] === e.click && out.indexOf(k) < 0) out.push(k); walk(e.kids); } }
  walk([TREE]);
  return out.join(',');
}
