import axios from 'axios';
import type { Language } from './problems.js';

export type ExecutionStatus = 'ok'|'compile_error'|'runtime_error'|'timeout'|'service_unavailable';
export interface ExecutionResult { status: ExecutionStatus; stdout?: string; message?: string; timeMs?: number; memoryKb?: number; }
export interface Executor { execute(source: string, language: Language): Promise<ExecutionResult>; }
export const languageIds: Record<Language, number> = { javascript:63, python:71, cpp:54, java:62 };

export class Judge0Executor implements Executor {
  async execute(source: string, language: Language): Promise<ExecutionResult> {
    const base = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    const key = process.env.JUDGE0_API_KEY || process.env.RAPIDAPI_KEY;
    if (base.includes('rapidapi.com') && !key) return {status:'service_unavailable',message:'Code execution service is not configured.'};
    const headers: Record<string,string> = {'Content-Type':'application/json'};
    if (key) { headers['X-RapidAPI-Key']=key; headers['X-RapidAPI-Host']=process.env.JUDGE0_API_HOST || new URL(base).host; }
    try {
      const api=axios.create({baseURL:base,headers,timeout:12000});
      const created=await api.post('/submissions?base64_encoded=false&wait=false',{source_code:source,language_id:languageIds[language],cpu_time_limit:2,wall_time_limit:5,memory_limit:128000});
      for(let i=0;i<20;i++){
        await new Promise(r=>setTimeout(r,250));
        const {data}=await api.get(`/submissions/${created.data.token}?base64_encoded=false&fields=status,stdout,stderr,compile_output,message,time,memory`);
        const id=data.status?.id;
        if(id<=2) continue;
        const msg=String(data.compile_output||data.stderr||data.message||data.status?.description||'').slice(0,2000);
        if(id===3) return {status:'ok',stdout:String(data.stdout||'').slice(0,10000),timeMs:Number(data.time||0)*1000,memoryKb:Number(data.memory||0)};
        if(id===5) return {status:'timeout',message:'Execution timed out.'};
        if(id===6) return {status:'compile_error',message:msg||'Compilation failed.'};
        return {status:'runtime_error',message:msg||'Runtime error.'};
      }
      return {status:'timeout',message:'Execution timed out.'};
    } catch { return {status:'service_unavailable',message:'Code execution service is temporarily unavailable.'}; }
  }
}
