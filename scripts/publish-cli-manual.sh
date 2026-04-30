#!/usr/bin/env bash
# First manual publish of @1c2c/cli (token in octc-platform/.env).
#
# Fully non-interactive when NPM_TOKEN is valid:
# - Uses a temporary userconfig with ONLY //registry.npmjs.org/:_authToken
#   so your global ~/.npmrc / "npm login" session does not take over and
#   trigger the device / browser flow.
#
# If your token still requires 2FA on each publish:
#   bash scripts/publish-cli-manual.sh --otp=123456
#
# Usage (from octc-platform repo root):
#   bash scripts/publish-cli-manual.sh
#   bash scripts/publish-cli-manual.sh --otp=123456
#
# CI/OIDC releases use provenance via release.yml (not this script).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/packages/cli"

if [[ ! -f "$ROOT/.env" ]]; then
  echo "publish-cli-manual: missing $ROOT/.env (NPM_TOKEN)" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source "$ROOT/.env"
set +a

if [[ -z "${NPM_TOKEN:-}" ]]; then
  echo "publish-cli-manual: NPM_TOKEN empty in .env" >&2
  exit 1
fi

TMP_NPMRC="$(mktemp)"
cleanup() { rm -f "$TMP_NPMRC"; }
trap cleanup EXIT

# Single-line auth: avoids mixing with project .npmrc or user defaults.
printf '//registry.npmjs.org/:_authToken=%s\n' "$NPM_TOKEN" >"$TMP_NPMRC"
export NPM_CONFIG_USERCONFIG="$TMP_NPMRC"

if ! OUT="$(npm whoami --registry https://registry.npmjs.org/ 2>&1)"; then
  echo "publish-cli-manual: npm whoami failed with this token. Output:" >&2
  echo "$OUT" >&2
  exit 1
fi

echo "publish-cli-manual: npm whoami => $OUT"

npm publish --access public --no-provenance "$@"
