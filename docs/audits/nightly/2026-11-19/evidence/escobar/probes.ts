// Offline synthetic audit probes against main 57dcbfc7efa60218ba902d16d6e3329d2fc053f5.
import assert from 'node:assert/strict';
import {freshState, type AppState} from '@/core/models';
import {state} from '@/core/store';
import {todayKey,addDays} from '@/core/dates';
import {makeCtx,progressionCtxFor,coachCtx} from '@/escobar/tools/context';
import {getSession,getNextTarget,getLiveSession} from '@/escobar/tools/read';
import {summarize} from '@/escobar/tools/show';
import {buildProposal} from '@/escobar/tools/actions';
import {decide,onProposal} from '@/escobar/apply';
import {memoryStorage,newConversation,setEscobarStorage} from '@/escobar/store';
import {activeConversation,storeSig,updateConversation} from '@/escobar/session';
import {toast} from '@/app/toast';
import {logWeight} from '@/slices/profile/profile';
import {addGym,deleteGym} from '@/slices/workout/units';
import {startSession,elapsedSec,restRemainingSec} from '@/slices/workout/session';
import {menuProfile} from '@/brain/units';
import {LIBRARY} from '@/core/exercises';
import {RULES} from '@/brain/coach/rules';
import {isImplausibleSet} from '@/brain/fidelity';
import {haptic,setHapticsEnabled} from '@/native/haptics';
import {session,sets} from '@tests/helpers';
import {checkGrounding} from '@/escobar/verify';
const out=(id:string,data:object)=>console.log(JSON.stringify({id,...data}));
const today=todayKey(),now=Date.now(),ex='lib_barbell_bench_press';
const base=()=>{const s=freshState();s.profile={name:'Synthetic',trainingSince:'2015-01',bodyWeightKg:80};s.splits=[{id:'a',name:'A',focus:[],exercises:[{exerciseId:ex,sets:3}]}];return s;};
const proposal=(kind:string,input:Record<string,unknown>,id='p1')=>({...newConversation('audit','chat'),proposals:[{...buildProposal(kind,input,makeCtx(state.value),id),status:'awaiting' as const,messageIndex:1}]});

// New: gym Undo bypasses the now-protected deleteGym path, even after that gym is in use.
{
 state.value=base();
 const c=proposal('propose_gym',{name:'New lb gym',defaultUnit:'lb'});
 const applied=decide(c,'p1','apply'); assert.equal(applied.result.ok,true);
 const gymId=state.value.units.activeGymId;
 startSession(state.value.splits[0]!);
 const before=menuProfile(ex,gymId,state.value.units,LIBRARY.find(e=>e.id===ex));
 deleteGym(gymId); assert.ok(state.value.units.gyms.some(g=>g.id===gymId));
 const undone=decide(applied.conversation,'p1','undo',applied.result.undo);
 const after=menuProfile(ex,gymId,state.value.units,LIBRARY.find(e=>e.id===ex));
 assert.equal(undone.result.ok,true);assert.equal(state.value.active?.gymId,gymId);assert.equal(state.value.units.gyms.some(g=>g.id===gymId),false);
 out('new_gym_undo_in_live_session',{undo:undone.result.status,liveGymExists:false,beforeUnit:before.unit,afterUnit:after.unit});
}
// New: model read treats assistance as a strength-load jump, contrary to mode-aware brain.
{
 const s=base();const assisted=LIBRARY.find(e=>e.mode==='assisted')!;
 s.sessions=[session(addDays(today,-7),[{id:assisted.id,sets:sets(20,8)}]),session(addDays(today,-1),[{id:assisted.id,sets:sets(40,8)}])];
 const r=getSession({sessionId:s.sessions[1]!.id},makeCtx(s)) as any;
 const flags=r.exercises[0].sets[0].flags;
 assert.ok(flags.includes('implausible_load'));
 assert.equal(isImplausibleSet({kg:40,reps:8},20,false,false),false);
 out('assistance_wrong_flags',{exerciseId:assisted.id,priorAssistanceKg:20,currentAssistanceKg:40,flags,modeAwareImplausible:false});
}
// Learn non-default machine rungs from repeated sessions: card and next-target must agree.
{
 const machine=LIBRARY.find(e=>e.equipment==='Machine'&&e.mode==='weighted')!;
 for(const kg of [14,16,18,22,24,26,28,32,36,42,44]){
  const s=base();s.splits[0]!.exercises=[{exerciseId:machine.id,sets:3}];
  s.sessions=[-21,-14,-7,-3].map((off,i)=>session(addDays(today,off),[{id:machine.id,sets:sets(i<2?kg:kg+4,12,'easy')}]));
  const ctx=makeCtx(s), read=getNextTarget({exerciseId:machine.id},ctx) as any,card=summarize('exercise_card',{exerciseId:machine.id},ctx) as any;
  if(read.target!==card.next.target)out('exercise_card_menu_disagreement',{exerciseId:machine.id,kg,target:read.target,cardTarget:card.next.target,readReason:read.reason,cardReason:card.next.reason});
 }
}
// IMP-E03 remedial regression: corrected weight and immediate undo history stay truthful.
{
 state.value={...base(),weightLog:[{day:today,kg:80}]};const a=decide(proposal('propose_profile',{field:'bodyWeightKg',value:82}),'p1','apply');logWeight(81);const u=decide(a.conversation,'p1','undo',a.result.undo);
 assert.equal(state.value.profile.bodyWeightKg,81);assert.deepEqual(state.value.weightLog,[{day:today,kg:81}]);assert.equal(u.result.ok,false);
 state.value={...base(),weightLog:[{day:today,kg:80}]};const b=decide(proposal('propose_profile',{field:'bodyWeightKg',value:82}),'p1','apply');decide(b.conversation,'p1','undo',b.result.undo);
 const insights=RULES.find(x=>x.id==='profile.changed')!.run(coachCtx(makeCtx(state.value)));
 assert.equal(state.value.profile.bodyWeightKg,80);assert.equal(insights.length,0);out('IMP-E03_resolved',{manualCorrectionKept:true,immediateUndoFalseInsight:false});
}
// IMP-E04 and IMP-E06 remedies.
{
 state.value=base();const id=addGym('Delete me','kg')!;const c=proposal('propose_equipment_profile',{scope:'exercise',exerciseId:ex,gymId:id,profile:{unit:'kg',step:2.5}});deleteGym(id);const r=decide(c,'p1','apply');assert.equal(r.result.status,'stale');assert.equal(state.value.units.byExercise[id],undefined);out('IMP-E04_resolved',{status:r.result.status});
 state.value=base();setHapticsEnabled(true);let calls=0;(globalThis as any).Capacitor={isNativePlatform:()=>true,Plugins:{NativeUi:{haptic:async()=>{calls++;return{played:true}}}}};
 decide(proposal('propose_setting',{setting:{key:'haptics',value:false}}),'p1','apply');await haptic.tick();assert.equal(calls,0);out('IMP-E06_resolved',{nativeCalls:calls});delete(globalThis as any).Capacitor;
}
// IMP-E01 / E05 remedies: live-entry override and pause/committed counts.
{
 const s=base();s.active={id:'live',splitId:'a',startedAt:new Date(now-20*60000).toISOString(),pausedMs:0,pausedAt:now-10*60000,rest:{endsAt:now-9*60000,totalSec:60,pausedRemainingSec:60},gymId:s.units.activeGymId,entries:[{exerciseId:ex,name:'Bench',loadFactor:0.8,sets:[{kg:60,reps:8},{},{}],done:false,skipped:false}]};
 s.escobar.todayOverride={day:addDays(today,-1),splitId:'a',reason:'Lighter yesterday',changes:[{kind:'load',exerciseId:ex,factor:0.8}]};
 assert.equal(progressionCtxFor(makeCtx(s),ex).loadFactor,0.8);
 const live=getLiveSession({},makeCtx(s,now)) as any;assert.equal(live.elapsedMin,elapsedSec(s.active,now)/60);assert.equal(live.restSecLeft,restRemainingSec(s.active,now));assert.equal(live.current.setsDone,1);assert.equal(live.current.sets.length,1);
 delete s.active.entries[0]!.loadFactor;s.escobar.todayOverride.day=today;s.escobar.todayOverride.splitId='other';assert.equal(progressionCtxFor(makeCtx(s),ex).loadFactor,undefined);
 out('IMP-E01_E05_resolved',{elapsedMin:live.elapsedMin,restSecLeft:live.restSecLeft,setsDone:live.current.setsDone,wrongSplitFactor:undefined});
}
// IMP-E02: toast remains bound to original conversation.
{
 state.value=base();setEscobarStorage(memoryStorage());storeSig.value={version:1,activeId:null,conversations:[]};
 updateConversation({...proposal('propose_setting',{setting:{key:'showSpark',value:false}}),id:'B'});await onProposal('p1','apply');const b=activeConversation.value!;
 updateConversation({...proposal('propose_setting',{setting:{key:'autoRest',value:false}}),id:'A'});await onProposal('p1','apply');const undo=toast.value!.onAction!;
 activeConversation.value=b;undo();await new Promise(r=>setTimeout(r,0));
 assert.equal(state.value.preferences.showSpark,false);assert.equal(state.value.preferences.autoRest,true);assert.equal(activeConversation.value?.id,'B');out('IMP-E02_resolved',{showSpark:false,autoRest:true,visibleConversation:'B'});
}
// Design limitation: unrelated ledger values satisfy grounding regardless of cited semantics.
{
 const r=checkGrounding({answer:'Your bench press is 100 kg. ⟦f1⟧',ledger:[{id:'f1',value:100,label:'chest recovery',unit:'%',source:'get_recovery',turn:1}] as any});
 assert.equal(r.ok,true);out('grounding_semantics_limit',{accepted:r.ok,claim:'bench press 100 kg',onlyFact:'chest recovery 100%'});
}
setTimeout(()=>process.exit(0),20);

