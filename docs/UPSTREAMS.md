# Upstream research and attribution

| Project | URL | Adopted idea / dependency | Code copied |
|---|---|---|---|
| Pi coding agent | https://github.com/earendil-works/pi | Primary agent runtime, provider registry, authentication, tools, sessions, TUI and extension ecosystem. Pi CLI is an external prerequisite. | No |
| Aider | https://github.com/Aider-AI/aider | Inspiration for exact edits and repository-aware context; potential future repository map. | No |
| ripgrep | https://github.com/BurntSushi/ripgrep | Recommended optional fast search executable for future repository search integration. | No |
| ast-grep | https://github.com/ast-grep/ast-grep | Candidate for future syntax-aware search/edits. | No |
| Playwright | https://github.com/microsoft/playwright | Optional future browser testing only. | No |

Pi documentation: https://pi.dev/docs/latest/sdk, https://pi.dev/docs/latest/extensions, https://pi.dev/docs/latest/models. The implementation currently invokes the Pi CLI rather than importing the SDK. The upstream repository commit and license text were not independently inspected in this environment; no Pi source is vendored or redistributed. Verify the upstream license and pin the package version before direct SDK integration.
