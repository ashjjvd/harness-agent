# Roadmap

## Initial implementation
- TypeScript CLI wrapper around Pi CLI.
- Local validated config with paid models and fallback disabled by default.
- Workspace traversal and symlink guard helper.
- Exact-one-match atomic replacement helper.
- Deterministic model eligibility helper.
- Offline tests and CI.

## Partial / not yet implemented
- Pi SDK direct integration; CLI boundary is used pending pinned SDK install/API verification.
- Provider-aware free/paid model discovery and hard billing enforcement.
- Interactive session resume selector.
- Custom tool registry, skills loader and proper approval UI.
- Mocked end-to-end model task and live provider smoke test.
- Performance benchmark and memory measurement.
- Browser automation.

## Next
1. Pin and integrate Pi SDK against a tested release.
2. Enforce provider/model policy using verified metadata.
3. Add Pi-native session resume and tool permission workflows.
4. Add deterministic mocked end-to-end task test.
5. Add measured performance baselines.
