import sys
D = '/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3/var/'
PG = '/main/js/default/pages/index/'

OLD_PAINT = """function paint() {
	var v = page && link ? link.view() : 0, s = v && slots(v), k;
	for (k in v) if (k !== 'sc' && k in page) page[k] = v[k];
	for (k = 0; s && k < 9; k++) page[SLOTS[k]] = s[k] || (k < 5 ? '' : '#08090a');
	if (v) page.sc = v.sc;
}"""
NEW_PAINT = """function paint() {
	var v = page && link ? link.view() : 0, s = v && slots(v), k;
	if (v && v.sc !== page.sc) page.set = 0, page.t1 = '';
	for (k in v) if (k !== 'sc' && k !== 'set' && k in page) page[k] = v[k];
	for (k = 1; s && k < 9; k++) page[SLOTS[k]] = s[k] || (k < 5 ? '' : '#08090a');
	if (v) page.sc = v.sc, page.set = v.set, page.t1 = s[0] || '';
}"""

def paint(name):
    p = D + name + PG + 'index.js'
    s = open(p).read()
    assert OLD_PAINT in s
    open(p, 'w').write(s.replace(OLD_PAINT, NEW_PAINT))

def flat(name):
    p = D + name + PG + 'index.hml'
    s = open(p).read()
    for a, b in [
        ('<div class="p1 cc" style="background-color:{{c1}}" onclick="onEasy"><text class="pt f x">Easy</text></div>', '<text class="p1 q f x" style="background-color:{{c1}}" onclick="onEasy">Easy</text>'),
        ('<div class="p1 cc" style="background-color:{{c2}}" onclick="onIdeal"><text class="pt f x">Ideal</text></div>', '<text class="p1 q f x" style="background-color:{{c2}}" onclick="onIdeal">Ideal</text>'),
        ('<div class="p1 cc" style="background-color:{{c3}}" onclick="onMax"><text class="pt f x">Max</text></div>', '<text class="p1 q f x" style="background-color:{{c3}}" onclick="onMax">Max</text>'),
        ('<div if="{{set}}" class="p2 cc" style="background-color:{{c4}}" onclick="onComplete"><text class="pc f x">{{cl}}</text></div>', '<text if="{{set}}" class="p2 q2 f x" style="background-color:{{c4}}" onclick="onComplete">{{cl}}</text>'),
    ]:
        assert a in s, a
        s = s.replace(a, b)
    open(p, 'w').write(s)
    c = D + name + PG + 'index.css'
    open(c, 'a').write('.q{font-size:20px}\n.q2{font-size:22px}\n')

for arg in sys.argv[1:]:
    name, what = arg.split(':')
    if 'p' in what: paint(name)
    if 't' in what: flat(name)
    print(name, what, 'ok')
