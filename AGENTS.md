# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the React + TypeScript application. Use `components/` for reusable UI, `pages/` for route-level screens, `hooks/` for shared state and data logic, `lib/` and `services/` for integrations, and `utils/` for pure helpers. GraphQL files live in `src/graphql/` with generated artifacts under `src/graphql/generated/`. Static assets are in `public/`. Supabase SQL migrations are tracked in `supabase/migrations/`. Keep tests close to the code in `__tests__/` folders, with shared mocks in `src/__mocks__/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`.

- `npm run dev` starts the Vite dev server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built app locally for a final smoke check.
- `npm run lint` runs ESLint across the repo.
- `npm test` starts Vitest.
- `npm run test:watch` reruns tests during development.
- `npm run test:coverage` generates text, JSON, and HTML coverage output.
- `npm run codegen` regenerates GraphQL types after schema or operation changes.

## Coding Style & Naming Conventions
The codebase uses TypeScript with strict compiler settings and ESLint (`eslint.config.js`). Follow the existing style: 2-space indentation, functional React components, and named exports when practical. Use `PascalCase` for components and pages, `camelCase` for hooks and utilities, and `UPPER_SNAKE_CASE` only for true constants. Keep route components in `src/pages/...` and colocate smaller subcomponents near their feature area.

## Testing Guidelines
Vitest runs in the `jsdom` environment with Testing Library and shared setup from `src/setupTests.ts`. Name tests `*.test.ts` or `*.test.tsx` inside `__tests__/` directories. Prefer user-facing assertions over implementation details. Coverage reporting is configured in Vite; the README sets a 70% minimum target for branches, functions, lines, and statements.

## Commit & Pull Request Guidelines
Recent history shows short, imperative commit subjects such as `Fix: resolved Netlify blank page issue`. Keep that style, but avoid vague messages like `Save workspace changes`. PRs should include a brief summary, testing performed, linked issue if applicable, and screenshots for UI changes. Call out schema, GraphQL codegen, or Supabase migration changes explicitly so reviewers can verify downstream impact.

## Configuration Notes
Local development expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` or `.env.local`. `VITE_GRAPHQL_URL` is optional for local GraphQL work. Never commit real secrets.
