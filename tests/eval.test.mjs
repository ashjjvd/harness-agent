import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseModel } from '../dist/safety.js';
test('evaluation: free tool-capable candidate is selected under free-only policy',()=>{
  const result=chooseModel([{provider:'paid',id:'large',free:false,toolCalling:true},{provider:'free',id:'agent',free:true,toolCalling:true}],false);
  assert.equal(result.selected?.id,'agent');
});
