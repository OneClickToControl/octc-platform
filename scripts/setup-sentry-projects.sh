#!/usr/bin/env bash
# octc-platform — bootstrap idempotente de proyectos Sentry para la org única.
# Compatible con bash 3.2 (macOS por defecto).
# Carga variables desde ./.env si existe (no se commitea, está en .gitignore).
#
# La lista team|proyecto|plataforma NO va en el repo público: usa un spec local
# (ver PUBLIC_REPO_POLICY.md §Referencias a repos privados).
#
# Uso:
#   cp scripts/sentry-org-projects.spec.example scripts/sentry-org-projects.spec
#   # editar sentry-org-projects.spec con filas reales (documentación interna)
#   bash scripts/setup-sentry-projects.sh
#
# Variables reseadas (en el shell o en ./.env):
#   SENTRY_AUTH_TOKEN    User Auth Token sntryu_...
#   SENTRY_ORG           ej. oneclicktocontrol
#
# Opcional:
#   SENTRY_PROJECT_SPEC  ruta absoluta a un spec alternativo

set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SPEC_FILE="${SENTRY_PROJECT_SPEC:-$ROOT/scripts/sentry-org-projects.spec}"

# Cargar .env si existe (no falla si no está)
if [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT/.env"
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

if [ ! -f "$SPEC_FILE" ]; then
  echo "ERROR: No existe $SPEC_FILE" >&2
  echo "  cp scripts/sentry-org-projects.spec.example scripts/sentry-org-projects.spec" >&2
  echo "  y completa las filas según runbook interno (octc-platform-internal)." >&2
  exit 1
fi

API="https://sentry.io/api/0"
AUTH_HEADER="Authorization: Bearer ${SENTRY_AUTH_TOKEN}"
JSON_HEADER="Content-Type: application/json"

SPEC=$(grep -v '^[[:space:]]*#' "$SPEC_FILE" | grep -v '^[[:space:]]*$' || true)
if [ -z "$SPEC" ]; then
  echo "ERROR: $SPEC_FILE no contiene filas válidas (team|slug|platform)" >&2
  exit 1
fi

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
echo "==> Spec file: ${SPEC_FILE}"
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
echo "==> DSNs (NO commitees: documentar resumen solo en repo interno)"
echo "----------------------------------------------------------------------------------------"
echo "$SPEC" | while IFS='|' read -r team slug platform; do
  [ -z "$team" ] && continue
  dsn=$(dsn_for "$slug")
  printf "%-25s %s\n" "${slug}" "${dsn}"
done

echo
echo "==> Listo."
