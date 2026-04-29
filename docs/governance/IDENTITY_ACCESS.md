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

## Identidad git para commits

| Repo / contexto | `user.name` | `user.email` |
|---|---|---|
| Repos **públicos** (`octc-platform`, futuros OSS) | `OneClickToControl` | GitHub privacy email del autor: `<id>+<login>@users.noreply.github.com` |
| Repos **privados** de producto (cada `<product>-app`) | `OneClickToControl` | mismo privacy email del autor |
| `octc-platform-internal` | `OneClickToControl` | mismo privacy email del autor |
| GitHub Actions (releases, PRs automáticos) | `github-actions[bot]` | `41898282+github-actions[bot]@users.noreply.github.com` (default GitHub) |

### Por qué el privacy email

El formato `<id>+<login>@users.noreply.github.com` (ejemplo: `15200377+1click2control@users.noreply.github.com`) es la convención estándar de GitHub para:

- Mantener el email personal del autor fuera de la historia git pública.
- Asegurar que cada commit queda **vinculado a la cuenta GitHub** correspondiente (Vercel, GitLeaks, GitHub badges, todos lo reconocen).
- Funcionar sin necesidad de mantener un dominio adicional o un alias real.

### Configuración local recomendada

```bash
# Por repo (recomendado para proyectos OneClickToControl, mantiene el global personal intacto)
cd <repo>
git config user.name "OneClickToControl"
git config user.email "$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')"

# Verificar
git config user.email   # debe terminar en @users.noreply.github.com
```

### Anti-patrones

- ❌ **NO** inventar dominios genéricos que no existen (ej. `ops@<slug-de-org>.com` cuando el dominio real es otro). Vercel y otros servicios fallan silenciosamente.
- ❌ **NO** reescribir historia ya empujada solo para corregir identidad (rompe attestations OIDC y tags). Configurar bien desde el inicio del repo.
- ❌ **NO** publicar email personal directo (`fernando.flechas@…`) en commits de repos públicos si se puede evitar — usar privacy email.
