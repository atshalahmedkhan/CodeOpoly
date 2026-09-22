import type { Executor, ExecutionStatus } from './executor.js';
import { buildHarness } from './harness.js';
import type { Challenge, Language } from './problems.js';

export interface PublicResult { index:number; passed:boolean; input:string; expected:string; actual?:string; }
export interface GradeResult { status:ExecutionStatus|'wrong_answer'; allPassed:boolean; tests:PublicResult[]; message?:string; }
const normalized = (v: unknown, unordered=false): unknown => unordered && Array.isArray(v) ? v.map(x=>Array.isArray(x)?[...x].sort():x).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))) : v;
function valid(c:Challenge,input:unknown[],actual:unknown,expected:unknown){
  if(c.validator==='two-sum') { const a=actual as number[], nums=input[0] as number[], target=input[1] as number; return Array.isArray(a)&&a.length===2&&a[0]!==a[1]&&nums[a[0]]+nums[a[1]]===target; }
  return JSON.stringify(normalized(actual,c.validator==='unordered-nested'))===JSON.stringify(normalized(expected,c.validator==='unordered-nested'));
}
export async function grade(c:Challenge,language:Language,source:string,executor:Executor,submit=false):Promise<GradeResult>{
  const visible:PublicResult[]=[]; const tests=submit?[...c.publicTests,...c.hiddenTests]:c.publicTests;
  for(let i=0;i<tests.length;i++){
    const t=tests[i], r=await executor.execute(buildHarness(c,t,language,source),language);
    if(r.status!=='ok') return {status:r.status,allPassed:false,tests:visible,message:r.message};
    let actual:unknown; try { const line=(r.stdout||'').trim().split(/\r?\n/).pop()||''; actual=JSON.parse(line); } catch { return {status:'runtime_error',allPassed:false,tests:visible,message:'Program output could not be read as a result.'}; }
    const passed=valid(c,t.input,actual,t.expected);
    if(i<c.publicTests.length) visible.push({index:i+1,passed,input:JSON.stringify(t.input),expected:JSON.stringify(t.expected),actual:JSON.stringify(actual)});
    if(!passed) return {status:'wrong_answer',allPassed:false,tests:visible,message:i<c.publicTests.length?'Wrong answer.':'Solution failed one or more hidden tests.'};
  }
  return {status:'ok',allPassed:true,tests:visible};
}
