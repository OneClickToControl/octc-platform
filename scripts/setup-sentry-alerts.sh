#!/usr/bin/env bash
# Idempotently create the minimum-required issue alerts for every
# Sentry project listed in the local spec file (same format as
# setup-sentry-projects.sh). Reads SENTRY_AUTH_TOKEN and SENTRY_ORG
# from a local .env file (kept out of git).
#
# Alerts created (one rule per project):
#   1. "octc-baseline: new high-severity issue"
#   2. "octc-baseline: error-rate spike vs 1h baseline"
#
# Spec: copy scripts/sentry-org-projects.spec.example → sentry-org-projects.spec
# and list team|project_slug|platform — see PUBLIC_REPO_POLICY.md.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
SPEC_FILE="${SENTRY_PROJECT_SPEC:-$ROOT/scripts/sentry-org-projects.spec}"

[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a

: "${SENTRY_AUTH_TOKEN:?SENTRY_AUTH_TOKEN must be set (in .env or environment)}"
: "${SENTRY_ORG:?SENTRY_ORG must be set (in .env or environment)}"

if [ ! -f "$SPEC_FILE" ]; then
  echo "ERROR: No existe $SPEC_FILE — copia desde sentry-org-projects.spec.example" >&2
  exit 1
fi

PROJECTS=()
_spec_tmp=$(mktemp)
grep -v '^[[:space:]]*#' "$SPEC_FILE" | grep -v '^[[:space:]]*$' > "$_spec_tmp" || true
while IFS='|' read -r team slug _platform; do
  [ -z "${team:-}" ] && continue
  case "$team" in \#*) continue ;; esac
  [ -z "$slug" ] && continue
  PROJECTS+=("$slug")
done < "$_spec_tmp"
rm -f "$_spec_tmp"

if [ ${#PROJECTS[@]} -eq 0 ]; then
  echo "ERROR: $SPEC_FILE no produjo ningún project_slug" >&2
  exit 1
fi

API="https://sentry.io/api/0"
HDR=(-H "Authorization: Bearer $SENTRY_AUTH_TOKEN" -H "Content-Type: application/json")

new_issue_rule() {
  local project="$1"
  cat <<JSON
{
  "name": "octc-baseline: new high-severity issue",
  "actionMatch": "all",
  "filterMatch": "all",
  "frequency": 30,
  "conditions": [{"id": "sentry.rules.conditions.first_seen_event.FirstSeenEventCondition"}],
  "filters": [{"id": "sentry.rules.filters.level.LevelFilter", "match": "gte", "level": "40"}],
  "actions": [{"id": "sentry.mail.actions.NotifyEmailAction", "targetType": "IssueOwners"}]
}
JSON
}

spike_rule() {
  local project="$1"
  cat <<JSON
{
  "name": "octc-baseline: error-rate spike vs 1h baseline",
  "actionMatch": "all",
  "filterMatch": "all",
  "frequency": 30,
  "conditions": [
    {"id": "sentry.rules.conditions.event_frequency.EventFrequencyPercentCondition",
     "interval": "1h", "value": 200, "comparisonInterval": "1d", "comparisonType": "percent"}
  ],
  "filters": [],
  "actions": [{"id": "sentry.mail.actions.NotifyEmailAction", "targetType": "IssueOwners"}]
}
JSON
}

ensure_rule() {
  local project="$1" name="$2" body="$3"
  local existing
  existing=$(curl -sf "${HDR[@]}" "$API/projects/$SENTRY_ORG/$project/rules/" 2>/dev/null \
    | python3 -c "import json,sys; data=json.load(sys.stdin); print(any(r.get('name')==\"$name\" for r in data))" 2>/dev/null || echo "False")
  if [ "$existing" = "True" ]; then
    echo "  $project: rule already exists: $name"
    return 0
  fi
  local rc
  rc=$(curl -s -o /tmp/sentry-rule-resp.json -w '%{http_code}' "${HDR[@]}" -X POST \
    "$API/projects/$SENTRY_ORG/$project/rules/" -d "$body")
  if [ "$rc" = "200" ] || [ "$rc" = "201" ]; then
    echo "  $project: created rule: $name"
  else
    echo "  $project: FAILED ($rc) creating $name:"
    head -c 200 /tmp/sentry-rule-resp.json; echo
    return 1
  fi
}

echo "==> Sentry org: $SENTRY_ORG"
echo "==> Spec file: $SPEC_FILE"
echo "==> Creating baseline alerts on ${#PROJECTS[@]} projects"
echo
for proj in "${PROJECTS[@]}"; do
  echo "==> $proj"
  ensure_rule "$proj" "octc-baseline: new high-severity issue" "$(new_issue_rule "$proj")"
  ensure_rule "$proj" "octc-baseline: error-rate spike vs 1h baseline" "$(spike_rule "$proj")"
done
echo
echo "==> Done."
