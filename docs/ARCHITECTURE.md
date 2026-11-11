# Architecture

The first milestone is deliberately a thin wrapper: CLI → validated local config → Pi CLI subprocess → Pi-managed provider/model/tool/session runtime. Pi remains responsible for the model loop, provider adapters, tool lifecycle, streaming, compaction, sessions, extension system and terminal interface. This avoids maintaining a competing runtime.

The wrapper adds command aliases and workspace selection, a bounded child-process adapter, conservative local policy defaults, and independently testable workspace/edit/model-policy utilities. Direct SDK integration is deferred until a pinned release is installed and its exported TypeScript API is verified. No upstream source code is copied into this repository.
