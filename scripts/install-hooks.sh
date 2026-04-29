#!/usr/bin/env bash
# Install local git hooks for octc-platform.
# Run once per clone: `pnpm run install-hooks`.

set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$ROOT/.git/hooks"
mkdir -p "$HOOKS_DIR"

cat > "$HOOKS_DIR/pre-commit" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
exec bash "$ROOT/scripts/precommit-privacy-check.sh" --staged-mode=git
HOOK

chmod +x "$HOOKS_DIR/pre-commit"
echo "pre-commit hook installed at $HOOKS_DIR/pre-commit"
echo "Privacy check will run automatically before each commit."
