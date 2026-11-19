import { freshState } from '@/core/models';
import { initStore, state, update, flushSave, replaceGeneration, onReplace, STATE_KEY, stopSaving, repairState } from '@/core/store';
import { parseBackup } from '@/slices/settings/backup';
import { sessionEmphasis } from '@/brain/exposure';
const db=new Map<string,string>(); const storage={getItem:(k:string)=>db.get(k)??null,setItem:(k:string,v:string)=>{db.set(k,v)},removeItem:(k:string)=>{db.delete(k)}};
(globalThis as any).localStorage=storage;
const a=freshState(new Date('2026-11-19T06:00:00Z')); a.profile.name='Before reset';db.set(STATE_KEY,JSON.stringify(a));initStore(storage);
let notifications=0;onReplace(()=>notifications++);const before=replaceGeneration();
const external=freshState(new Date('2026-11-19T06:01:00Z'));external.profile.name='Other tab reset';db.set(STATE_KEY,JSON.stringify(external));
update(s=>({...s,goal:'strength'}));flushSave();
console.log(JSON.stringify({case:'cross-tab flush recovery',name:state.value.profile.name,beforeGeneration:before,afterGeneration:replaceGeneration(),replaceListeners:notifications}));
stopSaving();
for (const [name,modify,reader] of [
 ['split-focus', (s:any)=>{s.splits=[{id:'bad',name:'Bad focus',focus:'chest',exercises:[],createdAt:s.createdAt}];},(s:any)=>s.splits[0].focus.map((x:any)=>x)],
 ['session-name', (s:any)=>{s.sessions=[{id:'s',splitId:'s',splitName:'Synthetic',day:'2026-11-19',startedAt:'2026-11-19T06:00:00Z',endedAt:'2026-11-19T06:30:00Z',durationSec:1800,exercises:[{exerciseId:'missing-id',name:{bad:true},sets:[{kg:20,reps:8}]}]}];},(s:any)=>sessionEmphasis(s.sessions[0].exercises)],
] as const) {
 const s=freshState();modify(s);const parsed=parseBackup(JSON.stringify({state:s}));
 if('error' in parsed){console.log(JSON.stringify({case:name,accepted:false,error:parsed.error}));continue;}
 try{reader(parsed.state);console.log(JSON.stringify({case:name,accepted:true,reader:'ok'}));}catch(e){console.log(JSON.stringify({case:name,accepted:true,dropped:'dropped' in parsed?parsed.dropped:null,error:String(e)}));}
}

