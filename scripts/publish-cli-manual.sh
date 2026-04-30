#!/usr/bin/env bash
# First manual publish of @1c2c/cli (token in octc-platform/.env).
# npm may require 2FA: pass --otp=XXXXXX from your authenticator.
#
# Usage (from octc-platform repo root):
#   bash scripts/publish-cli-manual.sh
#   bash scripts/publish-cli-manual.sh --otp=123456
#
# Uses NPM_TOKEN from ./.env and npm publish --no-provenance (local token
# publish). CI/OIDC releases use provenance via release.yml.
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

export NODE_AUTH_TOKEN="$NPM_TOKEN"
exec npm publish --access public --no-provenance "$@"
