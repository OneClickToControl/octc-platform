#!/usr/bin/env bash
# octc-platform — bootstrap canónico de proyectos Sentry para la org única.
# Compatible con bash 3.2 (macOS por defecto).
# Carga variables desde ./.env si existe (no se commitea, está en .gitignore).
# Idempotente: si un team o proyecto ya existe, salta su creación y solo lee DSNs.
#
# Uso:
#   bash scripts/setup-sentry-projects.sh
#
# Variables requeridas (en el shell o en ./.env):
#   SENTRY_AUTH_TOKEN    User Auth Token sntryu_...
#   SENTRY_ORG           ej. oneclicktocontrol

set -eu

# Cargar .env si existe (no falla si no está)
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

if [ -z "${SENTRY_AUTH_TOKEN:-}" ]; then
  echo "ERROR: SENTRY_AUTH_TOKEN no definido (export o ./.env)" >&2
  exit 1
fi
if [ -z "${SENTRY_ORG:-}" ]; then
  echo "ERROR: SENTRY_ORG no definido (export o ./.env)" >&2
  exit 1
fi

API="https://sentry.io/api/0"
AUTH_HEADER="Authorization: Bearer ${SENTRY_AUTH_TOKEN}"
JSON_HEADER="Content-Type: application/json"

# team_slug|project_slug|platform
SPEC="
platform|octc-platform-meta|node
health|octc-health-web|javascript-nextjs
health|octc-health-mobile|flutter
health|octc-health-ml|python
health|octc-health-acp|node
store|octc-store-web|javascript-nextjs
strategy|octc-strategy-ml|python
strategy|octc-strategy-api|python
"

create_team() {
  team=$1
  code=$(curl -sS -o /tmp/octc_team.json -w "%{http_code}" \
    -X POST "${API}/organizations/${SENTRY_ORG}/teams/" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER" \
    -d "{\"slug\":\"${team}\",\"name\":\"${team}\"}")
  case "$code" in
    201) echo "  team created: ${team}" ;;
    409) echo "  team exists:  ${team}" ;;
    *)
      echo "  team error ${code}: $(cat /tmp/octc_team.json)" >&2
      return 1 ;;
  esac
}

create_project() {
  team=$1; slug=$2; platform=$3
  code=$(curl -sS -o /tmp/octc_proj.json -w "%{http_code}" \
    -X POST "${API}/teams/${SENTRY_ORG}/${team}/projects/" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER" \
    -d "{\"name\":\"${slug}\",\"slug\":\"${slug}\",\"platform\":\"${platform}\"}")
  case "$code" in
    201) echo "    project created: ${slug} [${platform}]" ;;
    409) echo "    project exists:  ${slug}" ;;
    *)
      echo "    project error ${code}: $(cat /tmp/octc_proj.json)" >&2
      return 1 ;;
  esac
}

dsn_for() {
  slug=$1
  curl -sS "${API}/projects/${SENTRY_ORG}/${slug}/keys/" \
    -H "$AUTH_HEADER" \
    | python3 -c "import json,sys;d=json.load(sys.stdin);print(d[0]['dsn']['public'] if d else '')"
}

unique_teams() {
  echo "$SPEC" | awk -F'|' 'NF==3 {print $1}' | sort -u
}

echo "==> Sentry org: ${SENTRY_ORG}"
echo
echo "==> Teams"
unique_teams | while read -r team; do
  [ -z "$team" ] && continue
  create_team "$team"
done

echo
echo "==> Projects"
echo "$SPEC" | while IFS='|' read -r team slug platform; do
  [ -z "$team" ] && continue
  echo "  ${team}/${slug} [${platform}]"
  create_project "$team" "$slug" "$platform"
done

echo
echo "==> DSNs (NO commitees: pega el resumen al asistente y se documentan en SENTRY_PROJECTS)"
echo "----------------------------------------------------------------------------------------"
echo "$SPEC" | while IFS='|' read -r team slug platform; do
  [ -z "$team" ] && continue
  dsn=$(dsn_for "$slug")
  printf "%-25s %s\n" "${slug}" "${dsn}"
done

echo
echo "==> Listo."
