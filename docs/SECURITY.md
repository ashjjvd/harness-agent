# Security model

The workspace helper rejects absolute paths, traversal outside the canonical root, and symlink components. Exact replacement requires exactly one match and writes via a temporary file and rename. The Pi child process has a task timeout and bounded captured output.

Important limitations: Pi currently runs with the operating-system permissions of the invoking user. This wrapper is not an OS sandbox and does not constrain Pi's own internal tools. Configure Pi permissions carefully; untrusted repository scripts and package installation may execute arbitrary code. Do not run untrusted code without container/OS isolation and explicit approval. Paid/free status and billing are provider concerns; this wrapper's local policy helpers are not provider-side billing enforcement.
