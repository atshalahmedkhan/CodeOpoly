import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import { createCodeRoutes } from './codeRoutes.js';
import { saveGame, findGameById } from '../utils/memoryStore.js';
import type { Executor, ExecutionResult } from '../code/executor.js';

class QueueExecutor implements Executor {
  constructor(private values: ExecutionResult[]) {}
  async execute() { return this.values.shift() || { status:'runtime_error' as const, message:'No fake result.' }; }
}
const io: any = { to: () => ({ emit: () => {} }) };

async function withApi(executor: Executor, fn: (base:string)=>Promise<void>) {
  const app=express(); app.use(express.json()); app.use('/api/code',createCodeRoutes(io,executor));
  const server=createServer(app); await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));
  const address=server.address(); const base=`http://127.0.0.1:${typeof address==='object'&&address?address.port:0}`;
  try { await fn(base); } finally { await new Promise<void>(r=>server.close(()=>r())); }
}
function seed(id:string) {
  saveGame({_id:id,roomCode:'TEST',status:'in-progress',currentTurn:'p1',turnNumber:1,startTime:new Date(),players:[{id:'p1',name:'One',position:1,money:500,properties:[]},{id:'p2',name:'Two',position:0,money:500,properties:[]}],boardState:[{id:'prop',name:'Test Property',position:1,price:100,ownerId:undefined,houses:0}],pendingChallenges:{p1:{challengeId:'two-sum',propertyId:'prop'}}});
}

test('route rejects unsupported languages before execution', async () => {
  seed('route-invalid');
  await withApi(new QueueExecutor([]),async base=>{
    const response=await fetch(`${base}/api/code/run`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({gameId:'route-invalid',playerId:'p1',challengeId:'two-sum',language:'ruby',sourceCode:'x'})});
    assert.equal(response.status,400);
  });
});

test('Run uses public tests and does not mutate property ownership', async () => {
  seed('route-run');
  await withApi(new QueueExecutor([{status:'ok',stdout:'[0,1]'},{status:'ok',stdout:'[1,2]'}]),async base=>{
    const response=await fetch(`${base}/api/code/run`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({gameId:'route-run',playerId:'p1',challengeId:'two-sum',language:'javascript',sourceCode:'function twoSum(){}'})});
    assert.equal((await response.json() as any).allPassed,true);
    assert.equal(findGameById('route-run')?.boardState[0].ownerId,undefined);
  });
});

test('Submit passes hidden tests, purchases once, and advances the turn', async () => {
  seed('route-submit');
  await withApi(new QueueExecutor([{status:'ok',stdout:'[0,1]'},{status:'ok',stdout:'[1,2]'},{status:'ok',stdout:'[0,2]'}]),async base=>{
    const response=await fetch(`${base}/api/code/submit`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({gameId:'route-submit',playerId:'p1',challengeId:'two-sum',language:'javascript',sourceCode:'function twoSum(){}'})});
    const body:any=await response.json(); assert.equal(body.allPassed,true); assert.equal(body.tests.length,2);
    const game=findGameById('route-submit')!; assert.equal(game.boardState[0].ownerId,'p1'); assert.equal(game.players[0].money,400); assert.equal(game.currentTurn,'p2'); assert.equal(game.pendingChallenges?.p1,undefined);
  });
});
