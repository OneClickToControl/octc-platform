#!/usr/bin/env bash
# Privacy denylist scanner — TEMPLATE from octc-platform.
# Copy to scripts/precommit-privacy-check.sh and set ALLOWLIST_REGEX + PATTERNS
# to match your public-repo policy paths and org-specific denylist.
# See templates/governance/privacy-guard/README.md
#
# Modes:
#   --staged-mode=git   (default) check files staged for commit. Use as pre-commit hook.
#   --staged-mode=tree  check the entire tracked tree. Use in CI.

set -euo pipefail

MODE="git"
for arg in "$@"; do
  case "$arg" in
    --staged-mode=*) MODE="${arg#*=}" ;;
  esac
done

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

# Files we are explicitly allowed to mention denylist terms in,
# because they ARE the policy definition or a sealed stub.
ALLOWLIST_REGEX='^(docs/security/PUBLIC_REPO_POLICY\.md|\.gitleaks\.toml|\.github/workflows/privacy-guard\.yml|scripts/precommit-privacy-check\.sh|docs/PORTFOLIO\.md|docs/observability/SENTRY_PROJECTS\.md|docs/audit/.*\.md|pnpm-lock\.yaml)$'

# Patterns that must not appear in the public repo.
# id|description|regex
PATTERNS=(
  "octc-sentry-org-id|Sentry organization id of OneClickToControl|o4510948769923072"
  "octc-sentry-dsn|Sentry DSN of OneClickToControl|https?://[a-f0-9]{20,40}@o[0-9]+\\.ingest\\.[a-z0-9.-]+\\.sentry\\.io/[0-9]+"
  "octc-private-repo-name|Reference to a private OneClickToControl repository|\\b(health-app(-agents)?|store-app|strategy-app|openclaw-workspace-enlaza|ats-copilot-agent|ColombiaEnPR)\\b"
  "octc-internal-marker|Internal-only marker|\\b(internal-only|do-not-publish|nda-required|reserved-internal)\\b"
  "npm-token|npm token|npm_[A-Za-z0-9]{36,}"
  "github-pat|GitHub personal access token|\\b(gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{82,})\\b"
  "sentry-user-token|Sentry user auth token|sntrys_[A-Za-z0-9_-]{40,}"
)

if [ "$MODE" = "git" ]; then
  FILES=$(git diff --cached --name-only --diff-filter=ACMRT || true)
else
  FILES=$(git ls-files)
fi

if [ -z "$FILES" ]; then
  echo "privacy-check: nothing to scan."
  exit 0
fi

VIOLATIONS=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ ! -f "$f" ] && continue
  if [[ "$f" =~ $ALLOWLIST_REGEX ]]; then
    continue
  fi
  for p in "${PATTERNS[@]}"; do
    id="${p%%|*}"; rest="${p#*|}"
    desc="${rest%%|*}"; regex="${rest#*|}"
    matches=$(grep -nE -i -- "$regex" "$f" 2>/dev/null || true)
    if [ -n "$matches" ]; then
      echo "::error file=$f::[$id] $desc"
      echo "$matches" | sed "s|^|  $f:|"
      VIOLATIONS=$((VIOLATIONS+1))
    fi
  done
done <<< "$FILES"

if [ "$VIOLATIONS" -gt 0 ]; then
  echo ""
  echo "PRIVACY GUARD: $VIOLATIONS violation(s) found."
  echo "Move the offending content to https://github.com/OneClickToControl/octc-platform-internal"
  echo "or rotate the credential and remove from history."
  echo "See docs/security/PUBLIC_REPO_POLICY.md."
  exit 1
fi

echo "privacy-check: clean."
