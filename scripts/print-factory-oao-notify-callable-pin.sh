#!/usr/bin/env bash
# Pin para octc-factory-oao-notify-callable.yml (octc-platform).
set -euo pipefail

ORG_REPO="${OCTC_PLATFORM_REPO:-OneClickToControl/octc-platform}"
REF="${OCTC_PLATFORM_REF:-main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "octc: install GitHub CLI (gh) and run: gh auth login" >&2
  exit 1
fi

SHA="$(
  gh api "repos/${ORG_REPO}/commits?path=.github/workflows/octc-factory-oao-notify-callable.yml&sha=${REF}&per_page=1" --jq '.[0].sha' 2>/dev/null
)"

if [[ -z "$SHA" || "$SHA" == "null" ]]; then
  echo "octc: could not resolve OAO notify callable pin for ${ORG_REPO}@${REF}" >&2
  exit 1
fi

echo "Pin (commit that last modified octc-factory-oao-notify-callable.yml on ${REF}):"
echo "$SHA"
echo ""
echo "Product wrapper snippet:"
echo "    uses: ${ORG_REPO}/.github/workflows/octc-factory-oao-notify-callable.yml@${SHA}"
