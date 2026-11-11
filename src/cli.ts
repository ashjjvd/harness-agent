import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { ensureConfig, loadConfig, configPath } from './config.js';
const help = `harness-agent — a low-cost wrapper around Pi

Usage:
  harness-agent chat [--workspace PATH]
  harness-agent run "task" [--workspace PATH] [--profile FAST|BALANCED|DEEP|MANUAL]
  harness-agent doctor
  harness-agent models
  harness-agent config

Paid models and paid fallback are disabled by default. Pi manages model authentication, tools, sessions and TUI.
`;
function option(args: string[], key: string): string | undefined { const i=args.indexOf(key); return i>=0 ? args[i+1] : undefined; }
function runPi(args: string[], cwd: string, seconds: number, limit: number): Promise<number> {
  return new Promise((resolveCode, reject) => {
    const cfgPromise = loadConfig();
    cfgPromise.then(cfg => {
      const child = spawn(cfg.piCommand, args, { cwd, stdio: ['inherit','pipe','pipe'], env: { ...process.env, HARNESS_AGENT:'1' } });
      let bytes=0, truncated=false;
      const copy=(chunk:Buffer)=>{ bytes+=chunk.length; if(bytes<=limit) process.stdout.write(chunk); else if(!truncated){truncated=true; process.stdout.write('\n[output truncated by harness]\n');} };
      child.stdout.on('data',copy); child.stderr.on('data',copy);
      const timer=setTimeout(()=>child.kill('SIGTERM'),seconds*1000);
      const stop=()=>child.kill('SIGTERM'); process.once('SIGINT',stop);
      child.on('error',e=>{clearTimeout(timer);process.removeListener('SIGINT',stop);reject(new Error(`Cannot start Pi CLI: ${e.message}. Install @earendil-works/pi-coding-agent and ensure pi is on PATH.`));});
      child.on('close',code=>{clearTimeout(timer);process.removeListener('SIGINT',stop);resolveCode(code??1);});
    }).catch(reject);
  });
}
export async function main(argv: string[]): Promise<number> {
  const [command,...args]=argv;
  if(!command || ['--help','-h','help'].includes(command)){console.log(help);return 0;}
  if(command==='--version'||command==='-v'){console.log('harness-agent 0.1.0');return 0;}
  if(command==='config'){const p=await ensureConfig();console.log(`Config: ${p}\n${JSON.stringify(await loadConfig(),null,2)}`);return 0;}
  if(command==='doctor'){
    const c=await loadConfig(); console.log(`Node: ${process.version} (Pi requires >=22.19)\nConfig: ${configPath()}\nPaid models: ${c.allowPaidModels?'enabled by explicit opt-in':'blocked by wrapper'}\nFree model allowlist: ${c.freeModels.length ? c.freeModels.join(', ') : '(empty — configure verified free model IDs)'}\nPaid fallback: ${c.allowPaidFallback?'enabled':'disabled'}`);
    try{return await runPi(['--version'],process.cwd(),10,10000);}catch(e){console.log((e as Error).message);return 0;}
  }
  if(command==='models')return runPi(['--list-models'],process.cwd(),30,100000);
  const cwd=resolve(option(args,'--workspace')??process.cwd());
  const policy=await loadConfig();
  if(!policy.allowPaidModels && policy.freeModels.length===0){console.error('Blocked: no verified free model is configured. Add provider/model IDs to freeModels in the harness config, or explicitly enable paid models.');return 3;}
  const modelArgs=policy.allowPaidModels?[]:['--model',policy.freeModels[0]!, '--models',policy.freeModels.join(',')];
  if(command==='chat')return runPi([...modelArgs,'--session-dir',resolve(cwd,'.harness','sessions')],cwd,86400,1000000);
  if(command==='run'){
    const task=args.filter((x,i)=>!['--workspace','--profile'].includes(x)&&args[i-1]!=='--workspace'&&args[i-1]!=='--profile').join(' ').trim();
    if(!task){console.error('Usage: harness-agent run "Describe the task"');return 2;}
    const profile=option(args,'--profile')??(await loadConfig()).defaultProfile;
    if(!['FAST','BALANCED','DEEP','MANUAL'].includes(profile)){console.error('Invalid profile');return 2;}
    const c=await loadConfig(), prompt=`[Profile: ${profile}. Paid models are prohibited unless explicitly configured. Inspect files, make targeted edits, run relevant tests, and report evidence.]\n\nTask: ${task}`;
    return runPi([...modelArgs,'--print','--session-dir',resolve(cwd,'.harness','sessions'),prompt],cwd,c.maxTaskSeconds,c.maxOutputBytes);
  }
  console.error(`Unknown command: ${command}\n\n${help}`);return 2;
}
