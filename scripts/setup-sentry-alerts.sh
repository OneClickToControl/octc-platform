#!/usr/bin/env bash
# Idempotently create the minimum-required issue alerts for every
# canonical octc-* Sentry project. Reads SENTRY_AUTH_TOKEN and SENTRY_ORG
# from a local .env file (kept out of git).
#
# Alerts created (one rule per project):
#   1. "octc-baseline: new high-severity issue" — fires when a new issue
#      with level >= error appears.
#   2. "octc-baseline: error-rate spike vs 1h baseline" — fires when a
#      project's hourly event count exceeds 200% of its 24h average.
#
# Existing rules with the same name are left untouched so the script can
# be re-run safely.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a

: "${SENTRY_AUTH_TOKEN:?SENTRY_AUTH_TOKEN must be set (in .env or environment)}"
: "${SENTRY_ORG:?SENTRY_ORG must be set (in .env or environment)}"

API="https://sentry.io/api/0"
HDR=(-H "Authorization: Bearer $SENTRY_AUTH_TOKEN" -H "Content-Type: application/json")

PROJECTS=(
  octc-platform-meta
  octc-health-web
  octc-health-mobile
  octc-health-ml
  octc-health-acp
  octc-store-web
  octc-strategy-ml
  octc-strategy-api
)

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
echo "==> Creating baseline alerts on ${#PROJECTS[@]} projects"
echo
for proj in "${PROJECTS[@]}"; do
  echo "==> $proj"
  ensure_rule "$proj" "octc-baseline: new high-severity issue" "$(new_issue_rule "$proj")"
  ensure_rule "$proj" "octc-baseline: error-rate spike vs 1h baseline" "$(spike_rule "$proj")"
done
echo
echo "==> Done."
