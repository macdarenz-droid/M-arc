// Current-main pure VNode leaf probes, not a mounted browser/device UI test.
import assert from 'node:assert/strict';
import {freshState} from '@/core/models';
import {state} from '@/core/store';
import {todayKey,addDays} from '@/core/dates';
import {PlanBoard,currentTurn} from '@/escobar/ui/PlanBoard';
// A test-only export shim in build-ui-leaf-probes.mjs exposes this unchanged pure leaf.
import {LiftTrend} from '@/escobar/ui/components/index';
import {executeTool} from '@/escobar/tools/executor';
import {makeCtx} from '@/escobar/tools/context';
import {summarize} from '@/escobar/tools/show';
import {session,sets} from '@tests/helpers';

const texts=(node:any):string=>node==null||typeof node==='boolean'?'':typeof node==='string'||typeof node==='number'?String(node):Array.isArray(node)?node.map(texts).join(' '):texts(node.props?.children);
const out=(id:string,data:object)=>console.log(JSON.stringify({id,...data}));
{
 state.value=freshState();
 const use={id:'invalid-plan',name:'evaluate_plan',input:{draft:{splits:[]}}};
 const result=executeTool(use,{ctx:makeCtx(state.value),ledger:[],turn:1,proposalCount:0});
 assert.equal(result.isError,true);
 const messages:any[]=[{role:'user',content:[{type:'text',text:'Build a plan'}]},{role:'assistant',content:[{type:'tool_use',...use}],meta:{rendered:{}}},{role:'user',content:[{type:'tool_result',tool_use_id:use.id,content:result.content,is_error:true}]}];
 assert.equal(currentTurn(messages).results.get(use.id)?.isError,true);
 const errorText=texts(PlanBoard({messages,activity:[]}));
 assert.ok(errorText.includes('Weekly volume and recovery check out'));
 const control=[...messages.slice(0,2),{role:'user',content:[{type:'tool_result',tool_use_id:use.id,content:JSON.stringify({data:{issues:[{severity:'block',text:'Synthetic blocking issue'}]}})}]}];
 const blockedText=texts(PlanBoard({messages:control as any,activity:[]}));
 assert.ok(blockedText.includes('Adjusting:'));assert.ok(!blockedText.includes('Weekly volume and recovery check out'));
 out('plan_error_false_pass',{isError:result.isError,toolError:result.content,displayedSuccess:true,blockingControlDisplayedAdjusting:true});
}
{
 const s=freshState();const id='lib_assisted_pull_up';
 s.sessions=[session(addDays(todayKey(),-7),[{id,sets:sets(20,8)}]),session(addDays(todayKey(),-1),[{id,sets:sets(40,10)}])];
 const summary=summarize('lift_trend',{exerciseId:id,metric:'volume'},makeCtx(s));
 assert.equal(summary.unit,'reps');
 const text=texts(LiftTrend({s:summary}));
 assert.ok(text.includes('kg volume'));assert.ok(!text.includes('reps'));
 out('assisted_volume_wrong_unit',{summaryUnit:summary.unit,best:summary.best,displayedStats:text.match(/First[\s\S]*/)?.[0]});
}
// Imported app selectors keep a clock timer alive; this standalone probe has finished.
setTimeout(()=>process.exit(0),20);
