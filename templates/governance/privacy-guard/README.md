# Plantilla: privacy-guard (repo público)

Copia de referencia del stack usado en el repo público **OneClickToControl/octc-platform** antes de hacer público un repo que antes era privado (o para mantener un repo público sin fugas operativas).

## Contenido

| Archivo en esta carpeta | Destino en el repo adoptante |
|-------------------------|--------------------------------|
| `gitleaks.toml` | `.gitleaks.toml` (raíz) |
| `precommit-privacy-check.sh` | `scripts/precommit-privacy-check.sh` (ajusta rutas y regex) |
| `privacy-guard.yml` | `.github/workflows/privacy-guard.yml` |

## Pasos de adopción

1. **Política**: escribe un `PUBLIC_REPO_POLICY.md` (o equivalente) con qué no puede aparecer en el repo público.
2. **Reglas**: edita `gitleaks.toml` — reglas custom (Sentry org id, nombres de repos privados, tokens) y `[allowlist].paths` para los archivos que *sí* pueden citar esos términos (definición de política, esta plantilla, etc.).
3. **Pre-commit**: edita `ALLOWLIST_REGEX` y `PATTERNS` en `precommit-privacy-check.sh` para alinearlos con tu política y rutas.
4. **CI**: copia el workflow; asegúrate de que los jobs llamen a `.gitleaks.toml` y al script en las rutas reales.
5. **Protección de rama**: haz obligatorio el workflow `privacy-guard` en `main` (o `trunk`).
6. **Hook local** (opcional): instala un hook que ejecute `scripts/precommit-privacy-check.sh` en modo `git` antes de commit.

## Notas

- Los archivos de ejemplo pueden contener **nombres/resoluciones propias de OneClickToControl** en las reglas (sirven como patrón). Sustitúyelos por los de tu org antes de usar la plantilla en otro contexto.
- Mantén sincronizada la **allowlist** entre `gitleaks.toml` y el script bash; si no, uno pasará y el otro fallará.
- Para Apache-2.0, este repo invoca el binario `gitleaks` en CI en lugar del action comercial que exige licencia de org.

## Actualización

La versión canónica evoluciona en **OneClickToControl/octc-platform**. Tras fusionar mejoras allí, vuelve a copiar los archivos que apliquen o diff contra esta plantilla.
