# Identity & Access (IAM)

Política de identidad y acceso transversal para todas las plataformas y SaaS conectados a OneClickToControl LLC.

## Principios

- **SSO obligatorio** en todos los SaaS críticos.
- **2FA enforced** para todos los miembros, sin excepciones.
- **Acceso por menor privilegio** y revisado periódicamente.
- **Cuentas humanas vs cuentas máquina** separadas y rotuladas.

## Sistemas conectados

| sistema | método auth | 2FA | rotación tokens |
|---------|-------------|-----|-----------------|
| GitHub (org) | SSO + 2FA app/hardware | enforced | OIDC para CI; PATs prohibidos en automation |
| Sentry | SSO | enforced | OIDC para CI |
| Vercel | SSO | enforced | OIDC para CI |
| Supabase | SSO | enforced | service roles rotados trimestralmente |
| Cloudflare | SSO | enforced | API tokens rotados trimestralmente |
| npm | SSO + provenance | enforced | OIDC para publicar |
| Resend / email | SSO o 2FA local | enforced | API keys rotadas trimestralmente |
| Slack | SSO | enforced | n/a |
| Notion / Linear | SSO | enforced | tokens API rotados |

## Roles

- **Platform Admin**: total sobre `octc-platform` y configuración org.
- **Product Owner**: admin sobre repos del producto y proyectos Sentry asociados.
- **Contributor**: read/write a repos asignados; sin acceso a configuración org.
- **CI Bot (OIDC)**: identidades efímeras por workflow para publicar / desplegar.

## Onboarding

1. Invitar a SSO IdP (Google Workspace o equivalente).
2. Asignar a grupos de acceso necesarios.
3. Verificar 2FA con segunda autenticación.
4. Doc de onboarding en [PLATFORM_TOUR](../onboarding/PLATFORM_TOUR.md).

## Offboarding

- Revocar acceso en SSO en ≤ 1h tras separación.
- Rotar cualquier secreto que la persona haya tenido.
- Auditar últimos 30 días de actividad.

## Revisiones

- **Trimestral**: revisar miembros de cada org, eliminar inactivos, rotar tokens.
- **Anual**: pen-test ligero / revisión de superficie SaaS.

## Cuentas máquina

- Identificadas con prefijo `bot-` o sufijo `-ci`.
- Solo OIDC para automation. Tokens long-lived prohibidos.
- Documentadas en `docs/governance/MACHINE_IDENTITIES.md` (a crear cuando aparezca la primera).
