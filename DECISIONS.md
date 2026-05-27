# Architecture Decisions

## uipro replacement

Used `uipro-cli` (npm package `uipro-cli`) — the real package. Was installable via `npm install -g uipro-cli` (not `uipro` directly). Installs UI/UX Pro Max skill into `.claude/skills/`.

## Stack choices

| Item                     | Decision             | Reason                                                                       |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------- |
| Next.js 15 + React 19    | Upgraded from 14     | Latest stable, improved caching defaults, React 19 concurrent features       |
| Tailwind CSS v4          | Upgraded from v3     | CSS-first config, faster build, no PostCSS autoprefixer needed               |
| shadcn/ui                | Keep existing        | Already installed, best composable component library                         |
| React Three Fiber + drei | Added                | 3D graphics support, React-native API over Three.js                          |
| Prisma                   | Added alongside Neon | Type-safe ORM, schema mirrors existing Supabase tables                       |
| NextAuth v5              | Added (scaffold)     | JWT session layer — auth currently delegates to Supabase, migrate when ready |
| Supabase                 | Kept                 | Existing auth + realtime still used by dashboard; NextAuth added alongside   |
| Zod                      | Keep existing        | Already in use for validation schemas                                        |

## Folder rename

`C:\tmp\نظام تنشيط قاعدة العملاء بالذكاء الاصطناعي` → `C:\projects\ai-customer-base`
Arabic folder names break many CLI tools on Windows (path encoding issues).
