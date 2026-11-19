import assert from 'node:assert/strict';
import { session, baseCoachExtras } from '@audit-helpers';
import { emptySchedule } from '@/core/models';
import { RULES, type CoachContext } from '@/brain/coach/rules';
import { preSetBpmFromWindow, sessionDrift } from '@/brain/heart';
const id='lib_barbell_bench_press';
const history=[12,6,6,6].map((reps,i)=>session(`2026-11-${10+i}`,[{id,sets:[{kg:50,reps,effort:i?'ideal':'max'}]}]));
const ctx:CoachContext={...baseCoachExtras,sessions:history,splits:[],schedule:emptySchedule(),custom:[],today:'2026-11-19',now:Date.parse('2026-11-19T12:00:00Z')};
const effort=RULES.find(r=>r.id==='readiness.effort-calibration')!.run(ctx,{activeIds:[{id,name:'Bench'}]} as any);
assert.equal(effort.length,1);
assert.match(effort[0]!.noticed,/then a later max set/);
assert.equal(history.flatMap(s=>s.exercises.flatMap(e=>e.sets)).filter(s=>s.effort==='max').length,1);
assert.equal(history[0]!.exercises[0]!.sets[0]!.effort,'max');

// All values are valid physiological numbers, but every reading is separated
// by at least 80s: there is no contiguous 15-second window anywhere.
const sparse:Array<[number,number]>=Array.from({length:6},(_,i)=>[10,90,190].map(t=>[i*200+t,i<3?80:100] as [number,number])).flat();
const setAtSec=[200,400,600,800,1000,1200];
const sparsePre=preSetBpmFromWindow(sparse,0,200);
assert.equal(sparsePre,80);
const drift=sessionDrift({series:sparse,sessionSec:1200,setAtSec,restingHrBpm:null,hrMaxBpm:190});
assert.equal(drift?.drifting,true);
assert.equal(drift?.driftPct,25);
assert.equal(drift?.sets,6);
// Positive control: proper adjacent 5-second readings produce the same numeric drift.
const contiguous:Array<[number,number]>=Array.from({length:6},(_,i)=>[180,185,190].map(t=>[i*200+t,i<3?80:100] as [number,number])).flat();
const positive=sessionDrift({series:contiguous,sessionSec:1200,setAtSec,restingHrBpm:null,hrMaxBpm:190});
assert.equal(positive?.drifting,true);
assert.equal(preSetBpmFromWindow([[10,80],[90,80]],0,200),null);
const last=history.at(-1)!;
const current={...last,id:'synthetic-sparse-heart',day:'2026-11-19',startedAt:'2026-11-19T10:00:00.000Z',endedAt:'2026-11-19T10:20:00.000Z',durationSec:1200,exercises:[{exerciseId:id,name:'Bench',sets:setAtSec.map(t=>({kg:50,reps:8,effort:'ideal' as const,at:new Date(Date.parse('2026-11-19T10:00:00Z')+t*1000).toISOString()}))}]};
current.logging={...current.logging,trainedAt:current.startedAt,trainedEndAt:current.endedAt,loggedAt:current.endedAt};
const heartInsight=RULES.find(r=>r.id==='heart.drift')!.run({...ctx,sessions:[current],heartSeries:()=>sparse},{ } as any);
assert.equal(heartInsight.length,1);
assert.equal(heartInsight[0]!.evidence?.confidence,'medium');
console.log(JSON.stringify({commit:'57dcbfc7efa60218ba902d16d6e3329d2fc053f5',effort:{chronology:history.map(s=>({day:s.day,effort:s.exercises[0]!.sets[0]!.effort,reps:s.exercises[0]!.sets[0]!.reps})),insight:effort},heart:{sparse,sparsePre,drift,positive,insight:heartInsight},status:'All observed-defect and control assertions passed; no fixes applied.'},null,2));
