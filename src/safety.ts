import { realpath, lstat, readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep, dirname, basename, join } from 'node:path';
import { randomUUID } from 'node:crypto';

export async function resolveWorkspacePath(workspace: string, target: string): Promise<string> {
  const root = await realpath(workspace);
  if (isAbsolute(target)) throw new Error('Absolute paths are not allowed');
  const candidate = resolve(root, target), rel = relative(root, candidate);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error('Path escapes the selected workspace');
  let cursor = root;
  for (const part of rel.split(sep).filter(Boolean)) {
    cursor = resolve(cursor, part);
    try { if ((await lstat(cursor)).isSymbolicLink()) throw new Error(`Symlink path component is not allowed: ${part}`); }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
  }
  return candidate;
}
export async function exactReplace(workspace: string, path: string, search: string, replacement: string): Promise<void> {
  if (!search) throw new Error('Search text cannot be empty');
  const file = await resolveWorkspacePath(workspace, path), original = await readFile(file, 'utf8');
  const count = original.split(search).length - 1;
  if (count !== 1) throw new Error(`Expected exactly one match; found ${count}. No changes made.`);
  const temp = join(dirname(file), `.${basename(file)}.${randomUUID()}.tmp`);
  try { await writeFile(temp, original.replace(search, replacement), { mode: 0o600 }); await rename(temp, file); }
  catch (e) { await unlink(temp).catch(() => undefined); throw e; }
}
export interface Candidate { provider: string; id: string; free: boolean; toolCalling: boolean; contextWindow?: number; }
export function chooseModel(candidates: Candidate[], allowPaidModels: boolean, requested?: string): { selected: Candidate | null; reason: string } {
  const eligible = candidates.filter(m => m.toolCalling && (allowPaidModels || m.free));
  if (requested) {
    const found = eligible.find(m => m.id === requested || `${m.provider}/${m.id}` === requested);
    return found ? { selected: found, reason: 'Explicit policy-compatible model.' } : { selected: null, reason: 'Requested model is unavailable or blocked by policy.' };
  }
  eligible.sort((a,b) => Number(b.free)-Number(a.free) || (b.contextWindow ?? 0)-(a.contextWindow ?? 0));
  return { selected: eligible[0] ?? null, reason: eligible.length ? 'Best eligible configured candidate.' : 'No model meets tool-calling and spending policy.' };
}
