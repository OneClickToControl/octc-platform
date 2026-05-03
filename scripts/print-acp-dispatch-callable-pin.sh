#!/usr/bin/env bash
# Prints the recommended Git SHA to pin for octc-acp-dispatch-callable.yml
# (latest commit on the chosen ref that touched that workflow file).
#
# Usage:
#   ./scripts/print-acp-dispatch-callable-pin.sh
# Env:
#   OCTC_PLATFORM_REPO (default OneClickToControl/octc-platform)
#   OCTC_PLATFORM_REF  (default main)
#
set -euo pipefail

ORG_REPO="${OCTC_PLATFORM_REPO:-OneClickToControl/octc-platform}"
REF="${OCTC_PLATFORM_REF:-main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "octc: install GitHub CLI (gh) and run: gh auth login" >&2
  exit 1
fi

SHA="$(
  gh api "repos/${ORG_REPO}/commits?path=.github/workflows/octc-acp-dispatch-callable.yml&sha=${REF}&per_page=1" --jq '.[0].sha' 2>/dev/null
)"

if [[ -z "$SHA" || "$SHA" == "null" ]]; then
  echo "octc: could not resolve ACP dispatch callable pin for ${ORG_REPO}@${REF}" >&2
  exit 1
fi

echo "Pin (commit that last modified octc-acp-dispatch-callable.yml on ${REF}):"
echo "$SHA"
echo ""
echo "Wrapper job snippet:"
echo "    uses: ${ORG_REPO}/.github/workflows/octc-acp-dispatch-callable.yml@${SHA}"
