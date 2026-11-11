# harness-agent

A small, safety-conscious TypeScript control layer around the maintained Pi coding agent. It reuses Pi for the model/tool loop, provider authentication, sessions, streaming, context compaction and terminal UX rather than building a competing agent runtime.

> **Status: early implementation.** The CLI wrapper and deterministic safety utilities are implemented. Live provider execution depends on a separately installed and authenticated Pi CLI. Provider-level paid/free classification is not inferred from model names. Review docs/SECURITY.md before using this on untrusted repositories.

## Requirements

- Node.js **22.19+**
- npm and Git
- TypeScript and Node.js type declarations for development/build
- Pi coding agent installed with its `pi` executable on PATH: https://pi.dev/docs/latest/installation

## Install

```bash
git clone https://github.com/ashjjvd/harness-agent.git
cd harness-agent
npm ci
npm install --no-save --package-lock=false typescript @types/node
npm run build
npm link
harness-agent doctor
```

Authenticate with Pi's supported provider login/API-key flow. A ChatGPT subscription is not automatically API access.

## Commands

```bash
harness-agent --help
harness-agent doctor
harness-agent config
harness-agent models
harness-agent chat --workspace .
harness-agent run "Find and fix the failing test" --workspace . --profile BALANCED
npm run check
```

`chat` opens Pi's interactive terminal. `run` uses Pi print mode and stores sessions under `.harness/sessions`. Session resume selection is not implemented yet.

## Spending policy

Defaults are `allowPaidModels: false`, `allowPaidFallback: false`, and zero paid budgets. This wrapper does not enforce billing at provider level or independently verify free-tier quotas. Configure only models known to be free in Pi and inspect provider terms. A ChatGPT subscription is not automatically API access.

## Architecture

- `src/cli.ts`: CLI commands and bounded Pi subprocess adapter.
- `src/config.ts`: local validated policy configuration.
- `src/safety.ts`: workspace path checks, exact replacement, and pure model eligibility helper.

See `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/PROVIDERS.md`, `docs/UPSTREAMS.md`, and `docs/ROADMAP.md`. Offline tests do not contact model providers. No live provider, benchmark, or performance improvement is claimed.
