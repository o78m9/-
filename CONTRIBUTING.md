# Contributing

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Quality gates (must pass before commit)

```bash
npm run build         # ✓ no TypeScript errors
npm run lint          # ✓ no ESLint errors
npm run test          # ✓ all Vitest tests pass
```

Husky runs `lint-staged` on `git commit` — fixes auto-applied via `eslint --fix` and `prettier --write`.

## Commit style

Conventional Commits: `feat|fix|refactor|test|docs|style|chore(scope): message`

Examples:

```
feat(auth): add password reset flow
fix(dashboard): correct revenue calculation for at-risk segment
refactor(capture): extract validation to shared schema
```

One logical change per commit. Don't mix feature work with formatting.

## Adding a new feature

1. Create `src/features/{name}/` with subdirs: `lib/`, `hooks/`, `components/`, `types/`
2. Write the logic in `lib/` first (pure functions, testable)
3. Write unit tests in `src/test/`
4. Wire to UI in `components/`
5. Export public API from `index.ts`
6. Reference from `src/app/` pages

## TypeScript rules

- `strict: true` + `noUncheckedIndexedAccess: true` — both active
- No `any` — use `unknown` + type guard, or proper generic
- Prefer `type` imports for types-only imports

## Arabic / RTL

- All user-facing copy stays in Arabic — do not change it
- Use `start/end` instead of `left/right` for RTL-safe layout
- Test at 375px viewport (mobile-first)
- Demo mode must always work
