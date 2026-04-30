# ADR-0003: SSOT máquina-legible del monorepo y CLI (`verify` / `add surface`)

- **Estado**: accepted
- **Fecha**: 2026-05-01
- **Tags**: platform, cli, monorepo, governance

## Contexto

El patrón humano-legible de monorepo producto vive en [`docs/adoption/REFERENCE_PRODUCT_MONOREPO.md`](../adoption/REFERENCE_PRODUCT_MONOREPO.md): `active_surfaces`, trazabilidad, checklist y PORTFOLIO interno. Eso **no** permite hoy:

- Comprobar en CI que el **filesystem** y los **workflows** reflejan las superficies declaradas sin revisión manual.
- **Materializar** plantillas mínimas al declarar una nueva superficie (p. ej. `data` → stub `supabase/`, `docs/db`).
- Un **bridge** controlado hacia `octc-platform-internal` (p. ej. sugerir actualización de `repo_surfaces`) sin prometer sync “sin credenciales org”.

Fase 1–2 del plan de adopción cerraron el **contrato narrativo**; esta ADR fija la dirección de **Fase 4** en `@1c2c/cli` y el formato máquina-legible asociado.

## Decisión

1. **Archivo SSOT opcional pero recomendado** en repos adoptantes: **`.octc/monorepo.yaml`** (YAML 1.2, UTF-8) en la raíz del repo, versionado con git. Semántica inicial (v0):
   - `schema_version: 0` — entero; incremento al hacer cambios incompatibles del esquema documentados en CHANGELOG del paquete CLI.
   - `active_surfaces` — lista ordenada de strings en el vocabulario canónico (`landing`, `web`, `mobile`, `ml`, `api`, `chat`, `data`).
   - `paths` — mapa opcional **superficie → lista de globs o rutas prefijadas** relativas al root del repo (p. ej. `web: ["apps/web/**"]`, `data: ["supabase/**"]`). Los globs son orientativos para `verify`; la fuente de interpretación exacta será el implementación del comando.
   - `portfolio` — opcional: claves no sensibles alineadas al PORTFOLIO (p. ej. `repo_surfaces_csv` duplicado solo si se desea lint cruzado; **no** pegar URLs cloud ni secretos).

2. **Hasta que `verify` exista**, la tabla en `docs/architecture.md` sigue siendo obligatoria para humanos; cuando un repo active `.octc/monorepo.yaml`, **debe** coincidir en orden y membresía con `active_surfaces` declarado en prosa (misma regla que PORTFOLIO `repo_surfaces`).

3. **Comandos `@1c2c/cli` (roadmap, no bloqueantes de esta ADR):**
   - `octc verify monorepo` — lectura de `.octc/monorepo.yaml` y/o frontmatter acordado; validación de rutas presentes; reglas extensibles (p. ej. “si `data`, existe `supabase/migrations` o justificación”). Es **lint de coherencia**, no inferencia de negocio desde código sin reglas explícitas.
   - `octc add surface <surface>` — copia plantillas versionadas empaquetadas en el CLI o referenciadas desde `octc-platform` (checksum por versión); no crea proyectos cloud ni RLS.
   - **Bridge interno:** cualquier comando que abra PR contra `octc-platform-internal` **exige autenticación** (PAT/GitHub App con alcance org). Opciones y límites documentados en la implementación; **prohibido** documentar “sync completo solo con registro npm público”.

4. **Seguridad y política pública:** el contenido de `.octc/monorepo.yaml` en repos **públicos** debe cumplir [`PUBLIC_REPO_POLICY.md`](../security/PUBLIC_REPO_POLICY.md). Inventarios con nombres de clientes o PII solo en repos privados o campos omitidos.

5. **Estado de esta ADR:** **accepted** (vigente); actualizar [`INDEX.md`](INDEX.md) si cambia el estado.

## Consecuencias

- Positivas: camino claro para automatizar drift (P2-11 en internal), reducir error humano en altas de superficie, alinear CLI con docs ya publicados.
- Negativas: mantenimiento de esquema + migraciones de `schema_version`; riesgo de duplicar SSOT si equipos no sincronizan YAML y `architecture.md` hasta que `verify` sea obligatorio en CI.
- Neutras: repos pueden demorar la adopción del archivo; el checklist manual sigue válido.

## Alternativas consideradas

- **Solo frontmatter en `docs/architecture.md`** — descartado como único canal: peor para herramientas que no parsean MD; el YAML dedicado es más estable para CLI.
- **JSON en lugar de YAML** — posible en v1; YAML priorizado por legibilidad en revisión humana; el parser debe limitar tipos (no tags arbitrarios).
- **`verify` inferido desde filesystem sin declaración** — descartado: invita a falsos positivos y convenciones implícitas por repo.

## Notas y referencias

- [REFERENCE_PRODUCT_MONOREPO.md](../adoption/REFERENCE_PRODUCT_MONOREPO.md) — vocabulario y matriz CI.
- [MONOREPO_CONFORMANCE_CHECKLIST.md](../adoption/MONOREPO_CONFORMANCE_CHECKLIST.md).
- Plan local Cursor (patrón monorepo referencia OCTC) — Fase 4; runbook internal [REFERENCE_MONOREPO_SYNC](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/REFERENCE_MONOREPO_SYNC.md) (repo privado; enlace solo para miembros org).
- Próximo paso de implementación: ~~RFC breve~~ **`octc verify monorepo`** en `@1c2c/cli@0.2.0`; plantilla [`templates/monorepo/`](../../templates/monorepo/README.md). Roadmap: `octc add surface`, bridge internal con auth.
