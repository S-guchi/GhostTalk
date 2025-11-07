---
inclusion: always
---

# Tech Stack

## Core Technologies

- Next.js 16.0.1 (App Router) - Server components by default
- React 19.2.0 with React 19 JSX transform
- TypeScript 5 (strict mode, `@/*` path alias)
- Tailwind CSS 4 for styling
- Vercel AI SDK (^4.0.0) for streaming responses
- Framer Motion (^10.16.0) for animations

## Code Style

- Use Biome 2.2.0 for linting/formatting (not ESLint/Prettier)
- 2-space indentation, auto-organize imports
- Run `npm run format` before committing

## TypeScript Rules

- Strict mode enabled
- Prefer type inference over explicit types
- Use `async/await` for async operations
- ES2017 target with bundler module resolution

## React Conventions

- Server components by default
- Add `'use client'` only for: hooks, event handlers, browser APIs, animations
- Prefer composition over prop drilling
- Leverage React 19 features (async components, improved hydration)

## Styling

- Tailwind utility classes only (avoid custom CSS)
- Dark mode via `dark:` prefix
- Font CSS variables: `--font-geist-sans`, `--font-geist-mono`
- Mobile-first responsive design

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run Biome linter
npm run format   # Format code with Biome
```
