import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

export interface HarnessConfig {
  piCommand: string;
  defaultProfile: 'FAST' | 'BALANCED' | 'DEEP' | 'MANUAL';
  allowPaidModels: boolean;
  allowPaidFallback: boolean;
  dailyPaidBudgetUSD: number;
  taskPaidBudgetUSD: number;
  maxTaskSeconds: number;
  maxOutputBytes: number;
}
export const defaultConfig: HarnessConfig = {
  piCommand: 'pi', defaultProfile: 'BALANCED', allowPaidModels: false,
  allowPaidFallback: false, dailyPaidBudgetUSD: 0, taskPaidBudgetUSD: 0,
  maxTaskSeconds: 900, maxOutputBytes: 1_000_000
};
export function configPath(): string { return join(homedir(), '.config', 'harness-agent', 'config.json'); }
export function validateConfig(value: unknown): HarnessConfig {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Configuration must be a JSON object');
  const v = { ...defaultConfig, ...(value as Record<string, unknown>) };
  if (typeof v.piCommand !== 'string' || !v.piCommand.trim()) throw new Error('piCommand must be a non-empty string');
  if (!['FAST', 'BALANCED', 'DEEP', 'MANUAL'].includes(String(v.defaultProfile))) throw new Error('Invalid defaultProfile');
  for (const k of ['allowPaidModels', 'allowPaidFallback'] as const) if (typeof v[k] !== 'boolean') throw new Error(`${k} must be boolean`);
  for (const k of ['dailyPaidBudgetUSD', 'taskPaidBudgetUSD', 'maxTaskSeconds', 'maxOutputBytes'] as const)
    if (typeof v[k] !== 'number' || !Number.isFinite(v[k]) || v[k] < 0) throw new Error(`${k} must be non-negative`);
  if (!v.allowPaidModels && (v.dailyPaidBudgetUSD !== 0 || v.taskPaidBudgetUSD !== 0)) throw new Error('Paid budgets must be zero while paid models are disabled');
  return v as HarnessConfig;
}
export async function loadConfig(): Promise<HarnessConfig> {
  try { return validateConfig(JSON.parse(await readFile(configPath(), 'utf8'))); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return defaultConfig; throw e; }
}
export async function ensureConfig(): Promise<string> {
  const path = configPath(); await mkdir(join(path, '..'), { recursive: true });
  try { await readFile(path); } catch { await writeFile(path, JSON.stringify(defaultConfig, null, 2) + '\n', { mode: 0o600 }); }
  return path;
}
