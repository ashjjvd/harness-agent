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
npm install --no-save --package-lock=false typescript@5.8.3 @types/node@25.1.0
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

Defaults are `allowPaidModels: false`, `allowPaidFallback: false`, and an empty `freeModels` allowlist. In this state `chat` and `run` are blocked until you explicitly add verified free model IDs (for example `provider/model-id`) to `~/.config/harness-agent/config.json`. The wrapper passes that allowlist to Pi using `--model` and `--models`. Only add IDs after verifying current provider pricing and terms. Explicitly setting `allowPaidModels: true` opts out of this restriction. The wrapper cannot meter or enforce provider billing budgets, and provider-side fallback behavior must be checked separately. A ChatGPT subscription is not automatically API access.

## Architecture

- `src/cli.ts`: CLI commands and bounded Pi subprocess adapter.
- `src/config.ts`: local validated policy configuration.
- `src/safety.ts`: workspace path checks, exact replacement, and pure model eligibility helper.

See `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/PROVIDERS.md`, `docs/UPSTREAMS.md`, and `docs/ROADMAP.md`. Offline tests do not contact model providers. No live provider, benchmark, or performance improvement is claimed.
