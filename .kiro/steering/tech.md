# Tech Stack

## Framework & Runtime

- **Next.js 16.0.1** (App Router)
- **React 19.2.0** with React 19 JSX transform
- **TypeScript 5** with strict mode enabled
- **Node.js 20+**

## Key Libraries

- **next-intl** (^3.26.5) - Internationalization with locale-based routing
- **ai** (^4.0.0) - Vercel AI SDK for AI-powered features
- **motion** (^10.16.0) - Animation library for visual effects
- **Tailwind CSS 4** - Utility-first styling with PostCSS

## Code Quality Tools

- **Biome 2.2.0** - Fast linter and formatter (replaces ESLint + Prettier)
  - 2-space indentation
  - Recommended rules for Next.js and React
  - Auto-organize imports enabled

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Build & Production
npm run build            # Create production build
npm run start            # Run production server

# Code Quality
npm run lint             # Run Biome linter
npm run format           # Format code with Biome
```

## Project Configuration

- **Path alias**: `@/*` maps to project root
- **TypeScript**: ES2017 target, strict mode, bundler module resolution
- **Fonts**: Geist Sans and Geist Mono (via next/font)
- **Styling**: Tailwind with dark mode support
