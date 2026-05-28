# Agent Team — عَودة

29 specialized agents. Invoke via Claude Code subagent or `--agent` flag.

---

## Original 8 (Core Workflow)

| Agent         | File               | Job                                | When to Use                              |
| ------------- | ------------------ | ---------------------------------- | ---------------------------------------- |
| management    | `management.md`    | Project manager, planning, sprint  | Kick off any feature or bug              |
| architect     | `architect.md`     | System design, technical decisions | New feature design, tech stack decisions |
| ui-designer   | `ui-designer.md`   | UI/UX, component design, visual    | Any new UI component or layout           |
| 3d-designer   | `3d-designer.md`   | Three.js, R3F, shader, 3D scene    | Hero scene, 3D visualization             |
| developer     | `developer.md`     | Full-stack Next.js implementation  | Code implementation                      |
| code-reviewer | `code-reviewer.md` | Code review, bug finding, quality  | Before every merge                       |
| security      | `security.md`      | Security audit, CSP, OWASP, auth   | Before every deploy, any auth change     |
| marketing     | `marketing.md`     | Landing copy, growth, conversion   | Landing page, CTA, growth strategy       |

---

## High Value 6 (New)

| Agent                      | File                            | Job                                            | When to Use                              |
| -------------------------- | ------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| devops-engineer            | `devops-engineer.md`            | CI/CD, Vercel, GitHub Actions, monitoring      | Deploy pipeline, infra change, rollback  |
| qa-tester                  | `qa-tester.md`                  | Playwright E2E, Vitest, a11y tests, coverage   | After every feature, before every deploy |
| arabic-localization-expert | `arabic-localization-expert.md` | RTL layout, Arabic typography, numerals, dates | Any Arabic text or layout change         |
| ai-prompt-engineer         | `ai-prompt-engineer.md`         | Claude API, prompt design, caching, evals      | Any AI feature, generate-message changes |
| database-architect         | `database-architect.md`         | Schema, Prisma, indexes, query optimization    | Any DB change, new table, slow query     |
| compliance-officer         | `compliance-officer.md`         | PDPL, health data, data residency, DPA         | Any new data field, privacy decision     |

---

## Medium Value 6 (New)

| Agent                  | File                        | Job                                            | When to Use                             |
| ---------------------- | --------------------------- | ---------------------------------------------- | --------------------------------------- |
| content-writer         | `content-writer.md`         | Blog, email drip, in-app copy, error messages  | Onboarding flow, help center, microcopy |
| seo-specialist         | `seo-specialist.md`         | Keywords, schema, sitemap, Core Web Vitals SEO | Any new page, SEO audit                 |
| performance-engineer   | `performance-engineer.md`   | Lighthouse, bundle analysis, LCP/CLS/INP       | After major UI change, pre-deploy       |
| accessibility-expert   | `accessibility-expert.md`   | WCAG 2.2 AAA, ARIA, axe-core, screen reader    | Before any feature ship                 |
| api-designer           | `api-designer.md`           | REST design, OpenAPI, pagination, webhooks     | Any new API route                       |
| integration-specialist | `integration-specialist.md` | WhatsApp API, SMS, payment, calendar           | Any third-party integration             |

---

## Specialized 5 (New)

| Agent                | File                      | Job                                              | When to Use                                      |
| -------------------- | ------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| data-analyst         | `data-analyst.md`         | Cohort, funnel, churn, PostHog event design, SQL | Analytics question, dashboard data               |
| ml-engineer          | `ml-engineer.md`          | Churn prediction, send-time bandit, embeddings   | Custom ML beyond Claude API                      |
| mobile-app-developer | `mobile-app-developer.md` | Expo, React Native, iOS/Android, RTL mobile      | If mobile app is in scope                        |
| customer-success     | `customer-success.md`     | Onboarding, churn prevention, NPS, expansion     | Clinic journey, activation funnel                |
| legal-drafter        | `legal-drafter.md`        | ToS, Privacy Policy, DPA, bilingual contracts    | Legal documents (draft only — get lawyer review) |

---

## Creative 4 (New)

| Agent               | File                     | Job                                                      | When to Use                        |
| ------------------- | ------------------------ | -------------------------------------------------------- | ---------------------------------- |
| brand-strategist    | `brand-strategist.md`    | Naming, tagline, positioning, competitor map             | Brand decisions, new market entry  |
| illustrator         | `illustrator.md`         | Icon system, empty state SVG, AI image prompts           | Visual assets, SVG components      |
| motion-designer     | `motion-designer.md`     | Framer Motion, Lottie, page transition, scroll animation | Complex animations, choreography   |
| video-script-writer | `video-script-writer.md` | Demo video, explainer, social ad script, voiceover       | Video content, marketing campaigns |

---

## Mandatory Workflow (never skip)

```
project-manager → architect → ui-designer → 3d-designer → code-developer → code-reviewer → security → marketing
```

Add specialist agents at the appropriate step:

- `arabic-localization-expert` — after ui-designer, before developer
- `qa-tester` — after developer, before code-reviewer
- `performance-engineer` + `accessibility-expert` — after code-reviewer, before security
- `compliance-officer` — alongside security for any data change
- `devops-engineer` — final step before production deploy
