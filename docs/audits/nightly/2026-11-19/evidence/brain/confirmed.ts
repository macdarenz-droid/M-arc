// Standalone audit evidence; synthetic fixtures, no app writes or providers.
// Asserts observed defects and controls at main 57dcbfc7efa60218ba902d16d6e3329d2fc053f5.
import assert from 'node:assert/strict';
import { session, sets } from '@audit-helpers';
import { emptySchedule, type Session } from '@/core/models';
import { addDays, dayKey, daysBetween, trainedTodaySessions } from '@/core/dates';
import { splitPlan } from '@/brain/splitPlan';
import { weekSummary, weeklyVolumeHistory } from '@/brain/weekly';
import { adherenceRate } from '@/brain/coach/weeklyReview';
import { readiness } from '@/brain/readiness';
import { exerciseHistory } from '@/brain/history';
import { progressSeries } from '@/brain/trend';
import { suggestNext } from '@/brain/progression';
import { muscleDoses, recoveryAt, systemicFactor, acuteChronicRatio } from '@/brain/recovery';

const today='2026-11-19';
const now=new Date(today+'T12:00:00').getTime();
function localSession(day:string,exercises:Parameters<typeof session>[1],splitId?:string):Session {
  const s=session(day,exercises,splitId);
  s.id=`synthetic-${day}-${splitId??exercises[0]?.id}`;
  s.startedAt=new Date(day+'T10:00:00').toISOString();
  s.endedAt=new Date(day+'T11:00:00').toISOString();
  s.logging={...s.logging!,trainedAt:s.startedAt,trainedEndAt:s.endedAt,loggedAt:s.endedAt};
  return s;
}
const upper={id:'upper',name:'Upper',color:'#fff',focus:[],createdAt:'',exercises:[{exerciseId:'lib_barbell_bench_press',sets:3}]};
const lower={...upper,id:'lower',name:'Lower',exercises:[{exerciseId:'lib_barbell_back_squat',sets:3}]};
const schedule={...emptySchedule(),thu:upper.id,fri:lower.id};
const warm=(day:string)=>localSession(day,[{id:'lib_barbell_bench_press',sets:[{kind:'warmup',kg:20,reps:8}]}],upper.id);
const warmYesterday=warm(addDays(today,-1));
const warmToday=warm(today);
const mixedToday={...warmToday,exercises:warmToday.exercises.map(e=>({...e,sets:[...e.sets,{kg:40,reps:8}]}))};
const plan=(sessions:Session[])=>splitPlan({schedule,splits:[upper,lower],sessions,today,now});
const warmPlan=plan([warmYesterday]);
const emptyPlan=plan([]);
assert.equal(warmPlan.today,null);
assert.equal(warmPlan.doneEarly?.split.id,upper.id);
assert.equal(emptyPlan.today?.split.id,upper.id);
assert.equal(trainedTodaySessions([warmToday],today,now).length,1);
assert.equal(weekSummary([warmToday],today).workouts,0);
assert.equal(weekSummary([mixedToday],today).workouts,1);
assert.equal(weeklyVolumeHistory([warmToday],today,1)[0]?.sessions,1);
const warmReadiness=readiness({today,now,healthDays:[],checkIn:{day:today,mood:4},checkInHistory:[],recovery:[],scheduledSplit:upper,next:{split:lower,weekday:'fri'},custom:[],sessions:[warmToday]});
assert.match(warmReadiness!.postSessionAdvice!,/Today's session is done/);
// Four weeks of only warm-ups: adherence says 100%, while counted working workouts are zero.
const warmHistory=[0,7,14,21].map(d=>warm(addDays(today,-d)));
const onlyThursday={...emptySchedule(),thu:upper.id};
const warmAdherence=adherenceRate(warmHistory,onlyThursday,today);
assert.equal(warmAdherence,1);

const carryId='lib_farmer_s_carry';
const carry=[30,40,50,60].map((durationSec,i)=>localSession(addDays(today,-9+i),[{id:carryId,sets:[{kg:24,durationSec,effort:'ideal'}]}]));
const carryHistory=exerciseHistory(carry,carryId);
const carrySeries=progressSeries(carryHistory,'conditioning');
assert.equal(carrySeries.metric,'top');
assert.equal(carrySeries.trend.direction,'flat');
assert.deepEqual(carrySeries.values,[24,24,24,24]);
const target=suggestNext(carry,carryId,'lean',today);
assert.equal(target.sets?.[0]?.durationSec,65);
const ropesId='lib_battle_ropes';
const ropes=carry.map(s=>({...s,exercises:s.exercises.map(e=>({...e,exerciseId:ropesId,sets:e.sets.map(({kg,...v})=>v)}))}));
const ropesSeries=progressSeries(exerciseHistory(ropes,ropesId),'conditioning');
assert.equal(ropesSeries.trend.points,0);
const distance=carry.map(s=>({...s,exercises:s.exercises.map(e=>({...e,sets:e.sets.map(({durationSec,...v})=>({...v,distanceM:durationSec}))}))}));
const distanceSeries=progressSeries(exerciseHistory(distance,carryId),'conditioning');
assert.equal(distanceSeries.metric,'distance');
assert.deepEqual(distanceSeries.values,[30,40,50,60]);
assert.equal(distanceSeries.trend.direction,'up');

// Current week and weeks 3-7 have the same 3 sessions; weeks 1-2 are a break.
const returnHistory=[0,3,4,5,6,7].flatMap(w=>[1,3,5].map(o=>localSession(addDays(today,-7*w-o),[{id:'lib_barbell_bench_press',sets:sets(100,8,'ideal',5)}]))).sort((a,b)=>a.startedAt.localeCompare(b.startedAt));
const profile={name:'Synthetic',trainingSince:'2010-01'};
const doses=muscleDoses({sessions:returnHistory,profile});
const last=returnHistory.at(-1)!;
const at=Date.parse(last.endedAt);
const atDay=dayKey(at);
const fullFactor=systemicFactor([],returnHistory,at);
const shortFactor=systemicFactor([],returnHistory.filter(s=>daysBetween(s.day,atDay)<=30),at);
assert.equal(fullFactor,1);
assert.equal(shortFactor,1.25);
// Counterfactual evidence only: preserve every dose input, restoring the actual helper's
// full-prefix factor in place of its truncated factor. This is not an app patch.
const counterfactual=Object.fromEntries(Object.entries(doses).map(([muscle,list])=>[muscle,list.map(d=>{
  const idx=returnHistory.findIndex(s=>s.id===d.sessionId);
  const prefix=returnHistory.slice(0,idx+1);
  const ref=dayKey(d.at);
  const short=prefix.filter(s=>daysBetween(s.day,ref)<=30);
  return {...d,tau:d.tau/systemicFactor([],short,d.at)*systemicFactor([],prefix,d.at)};
})])) as typeof doses;
const actualRecovery=recoveryAt(doses,{sessions:returnHistory,now,profile}).find(r=>r.muscle==='chest')!;
const expectedRecovery=recoveryAt(counterfactual,{sessions:returnHistory,now,profile}).find(r=>r.muscle==='chest')!;
assert.equal(actualRecovery.systemicFactor,1);
assert.ok(actualRecovery.hoursLeft>expectedRecovery.hoursLeft);
assert.ok(actualRecovery.pct<expectedRecovery.pct);
console.log(JSON.stringify({commit:'57dcbfc7efa60218ba902d16d6e3329d2fc053f5',timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
  warmup:{todaySlot:warmPlan.today,doneEarly:warmPlan.doneEarly,emptyControlSlot:emptyPlan.today?.split.id,trainedTodayCount:trainedTodaySessions([warmToday],today,now).length,summaryWorkouts:weekSummary([warmToday],today).workouts,weeklyHistoryWorkouts:weeklyVolumeHistory([warmToday],today,1)[0]?.sessions,mixedControlWorkouts:weekSummary([mixedToday],today).workouts,postSessionAdvice:warmReadiness?.postSessionAdvice,adherence:warmAdherence},
  timedConditioning:{carryMetric:carrySeries.metric,carryValues:carrySeries.values,carryTrend:carrySeries.trend,durationTarget:target.sets?.[0]?.durationSec,ropesMetric:ropesSeries.metric,ropesPoints:ropesSeries.trend.points,distanceControl:distanceSeries.values,distanceControlTrend:distanceSeries.trend.direction},
  recoveryPrefix:{lastSessionDay:last.day,factorDay:atDay,fullFactor,shortFactor,fullRatio:acuteChronicRatio(returnHistory,atDay),shortRatio:acuteChronicRatio(returnHistory.filter(s=>daysBetween(s.day,atDay)<=30),atDay),actualLastTau:doses.chest.at(-1)?.tau,expectedLastTau:counterfactual.chest.at(-1)?.tau,actualRecovery,fullPrefixCounterfactual:expectedRecovery},
  status:'All observed-defect and control assertions passed; no fixes applied.'},null,2));
