---
inclusion: always
---

# Project Structure

## Directory Layout

```
ghost-app/
├── app/                      # Next.js App Router
│   ├── chat/                # Chat page
│   ├── api/                 # API routes
│   │   └── ghost-chat/      # Chat API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable React components
├── lib/                     # Utilities and shared logic
│   ├── ai/                  # AI integration (chat-generator)
│   └── personas/            # Character personas and types
├── public/                  # Static assets
│   └── characters/          # Character SVGs (pumpkin, skeleton, witch)
└── docs/                    # Documentation
    └── image-prompt/        # Character image prompts
```

## Key Conventions

### File Organization

- Server components by default (no `'use client'` unless needed)
- Client components in `/components` when using hooks, events, or animations
- Utilities and business logic in `/lib`
- API routes in `/app/api`

### Routing

- Standard Next.js App Router structure
- Use `await params` for async params in Next.js 15+
- Default language: Japanese

### Imports

- Use `@/` path alias for imports from project root
- Auto-organize imports with Biome

### Naming

- Use kebab-case for file/folder names
- PascalCase for component files (e.g., `ChatStage.tsx`)
- camelCase for utility files (e.g., `chat-generator.ts`)
