import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultConfig, validateConfig } from '../dist/config.js';

test('default config requires explicit model allowlisting and disables paid access',()=>{
  assert.deepEqual(defaultConfig.freeModels,[]);
  assert.equal(defaultConfig.allowPaidModels,false);
  assert.equal(defaultConfig.allowPaidFallback,false);
  assert.equal(defaultConfig.dailyPaidBudgetUSD,0);
});
test('configuration rejects invalid free model allowlists',()=>{
  assert.throws(()=>validateConfig({...defaultConfig,freeModels:['gemini-free',4]}),/freeModels/);
});
test('configuration rejects nonzero paid budget while paid models are disabled',()=>{
  assert.throws(()=>validateConfig({...defaultConfig,dailyPaidBudgetUSD:1}),/Paid budgets/);
});
test('configuration accepts explicit free model allowlist',()=>{
  const config=validateConfig({...defaultConfig,freeModels:['provider/model-id']});
  assert.equal(config.freeModels[0],'provider/model-id');
});
