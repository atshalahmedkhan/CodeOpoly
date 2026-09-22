import test from 'node:test';
import assert from 'node:assert/strict';
import { grade } from './grader.js';
import { buildHarness } from './harness.js';
import { challengeById, publicChallenge, type Language } from './problems.js';
import type { ExecutionResult, Executor } from './executor.js';

class FakeExecutor implements Executor {
  constructor(private readonly result: ExecutionResult) {}
  async execute(): Promise<ExecutionResult> { return this.result; }
}

const problem = challengeById('two-sum')!;
for (const language of ['javascript','python','cpp','java'] as Language[]) {
  test(`${language} harness calls the canonical function and grading accepts valid output`, async () => {
    const harness = buildHarness(problem, problem.publicTests[0], language, problem.starters[language]);
    assert.match(harness, /twoSum/);
    const result = await grade({ ...problem, publicTests: [problem.publicTests[0]] }, language, 'solution', new FakeExecutor({status:'ok',stdout:'[0,1]'}));
    assert.equal(result.allPassed, true);
  });
}

test('wrong answer is classified without exposing hidden tests', async () => {
  const result = await grade(problem, 'javascript', 'solution', new FakeExecutor({status:'ok',stdout:'[0,0]'}), true);
  assert.equal(result.status, 'wrong_answer');
  assert.equal(result.allPassed, false);
  assert.ok(result.tests.every(t => !('hidden' in t)));
});

for (const status of ['compile_error','runtime_error','timeout','service_unavailable'] as const) {
  test(`${status} is preserved`, async () => {
    const result = await grade(problem, 'javascript', 'solution', new FakeExecutor({status,message:'controlled'}));
    assert.equal(result.status, status);
    assert.equal(result.message, 'controlled');
  });
}

test('public challenge metadata contains no judge tests', () => {
  const safe: any = publicChallenge(problem);
  assert.equal(safe.publicTests, undefined);
  assert.equal(safe.hiddenTests, undefined);
  assert.ok(safe.functionSignatures.javascript);
});

