# Simulates the rep progress curve as drawn (straight lines between keyframe stops) and prints the
# smoothness numbers in UPGRADE-BRIEF.md for the current timing and the min-jerk target.
# Run: python3 rig-final/smooth-sim.py   (needs numpy)
import numpy as np
def bez(x1,y1,x2,y2):
    cx=3*x1;bx=3*(x2-x1)-cx;ax=1-cx-bx;cy=3*y1;by=3*(y2-y1)-cy;ay=1-cy-by
    X=lambda t:((ax*t+bx)*t+cx)*t;Y=lambda t:((ay*t+by)*t+cy)*t
    def f(x):
        lo,hi=0.0,1.0
        for _ in range(60):
            m=(lo+hi)/2
            if X(m)<x: lo=m
            else: hi=m
        return Y((lo+hi)/2)
    return f
eI=bez(.4,0,1,1);eO=bez(0,0,.6,1)
inOut=lambda x:0.5*eI(2*x) if x<0.5 else 0.5+0.5*eO(2*x-1)
mj=lambda x:10*x**3-15*x**4+6*x**5
def prog(u,E):
    if u<=.25: return E(u/.25)
    if u<=.375: return 1
    if u<=.875: return 1-E((u-.375)/.5)
    return 0
old_stops=[i*1.25 for i in range(21)]+[37.5+i*3.125 for i in range(17)]+[100]
new_stops=sorted(set([round(i*0.5,4) for i in range(51)]+[37.5]+[round(37.5+i*0.5,4) for i in range(101)]+[100]))
REP=4.0
def drawn(stops,E):
    xs=np.array(stops)/100; ys=np.array([prog(x,E) for x in xs]); return xs,ys
def sample(xs,ys,hz=120): # linear between stops, like CSS linear keyframes
    t=np.arange(0,REP*hz+1)/(REP*hz); return t,np.interp(t,xs,ys)
def metrics(stops,E,name):
    xs,ys=drawn(stops,E); t,p=sample(xs,ys)
    dt=REP/ (len(t)-1)
    out={}
    for ph,(a,b) in {'lift':(0,.25),'return':(.375,.875)}.items():
        m=(t>=a-1e-9)&(t<=b+1e-9); tp=t[m]; pp=p[m]
        v=np.abs(np.diff(pp))/dt; peak=v.max()
        # boundary speed: first and last 1/120 s interval
        out[ph+' edge speed % of peak']=round(100*max(v[0],v[-1])/peak,2)
        # stop-resolution acceleration: 2nd difference at the keyframe stops inside the phase
        sm=(xs>=a-1e-9)&(xs<=b+1e-9); sx=xs[sm]*REP; sy=ys[sm]
        vv=np.diff(sy)/np.diff(sx); acc=np.abs(np.diff(vv)/np.diff(sx)[:-1])
        out[ph+' stop-acc max/median']=round(acc.max()/np.median(acc),2)
        # 120 Hz acceleration (reviewer's point)
        a120=np.abs(np.diff(v))/dt
        out[ph+' 120Hz-acc max/median']=('inf' if np.median(a120)==0 else round(a120.max()/np.median(a120),2))
        # jerk proxy at stops: change of acceleration between neighbouring stops, signed accel
        sacc=np.diff(vv)/np.diff(sx)[:-1]; jk=np.abs(np.diff(sacc))
        out[ph+' stop-jerk max/median']=round(jk.max()/np.median(jk),2)
        # largest single step in p per 1/120 s, as % of the phase's total travel (travel=1)
        out[ph+' max step per 1/120s (%travel)']=round(100*np.abs(np.diff(pp)).max(),2)
        # speed jump between consecutive 1/120 s samples, % of peak (steps in speed = visible judder)
        out[ph+' max speed jump % of peak']=round(100*np.abs(np.diff(v)).max()/peak,2)
    print(name, len(stops),'stops'); [print('  ',k,val) for k,val in out.items()]
metrics(old_stops,inOut,'OLD inOut @ current stops')
metrics(new_stops,mj,'NEW min-jerk @ 0.5%')
metrics(new_stops,inOut,'inOut @ 0.5% (denser only)')
metrics(old_stops,mj,'min-jerk @ current stops (profile only)')
