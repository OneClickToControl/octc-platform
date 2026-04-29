# i18n policy

Política de idioma para documentación y plantillas dentro de OneClickToControl LLC.

## Principios

- **Coherencia por documento**: cada archivo se escribe en un solo idioma (no mezclas).
- **Idioma operativo principal**: español (LatAm/España según producto).
- **Idioma técnico permitido**: inglés cuando aporta precisión (APIs, mensajes de error citados, términos canónicos).
- **Internacionalización de productos**: las apps se internacionalizan según su mercado en sus propios repos; esta política es para docs y plantillas de plataforma.

## Reglas por área

| área | idioma por defecto | excepciones |
|------|--------------------|-------------|
| `docs/` (octc-platform) | español | términos técnicos en inglés cuando son canónicos. |
| Plantillas de agentes (`CLAUDE.md`, etc.) | español | comandos y outputs en inglés cuando aplique. |
| Schemas, código, configs | inglés | inglés siempre (estándar). |
| ADR, RFC, audit | español | títulos pueden incluir tecnicismos en inglés. |
| Brand, marketing | depende del producto y mercado | documentado en cada repo. |

## Glosario

Mantenemos un glosario corto en `docs/i18n/GLOSSARY.md` (a crear cuando aparezca un término ambiguo). Términos canónicos (tier, ACP, allowlist, breadcrumbs, replay, profile) se mantienen en inglés.

## Traducciones

- Productos cara al usuario: cada repo decide su matriz de localización.
- Plataforma: solo en español por ahora; si entra un mantenedor anglófono, se evaluará bilingüe.

## Verificación

`verify.yml` no impone idioma (sería ruidoso). Revisión manual en revisión trimestral.
