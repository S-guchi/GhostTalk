# Project Structure

## Root Organization

```
ghost-app/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (ja, en)
│   │   ├── layout.tsx     # Root layout with i18n provider
│   │   └── page.tsx       # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico
├── components/            # React components
├── lib/                   # Utility functions and shared logic
├── i18n/                  # Internationalization configuration
│   ├── config.ts          # Locale definitions (ja default, en)
│   └── request.ts         # i18n request handling
├── messages/              # Translation files
│   ├── en.json
│   └── ja.json
├── public/                # Static assets
│   └── characters/        # Character images/assets
└── middleware.ts          # Next.js middleware (likely i18n routing)
```

## Key Conventions

### Routing
- Locale-based routing via `[locale]` dynamic segment
- Default locale: Japanese (ja)
- Supported locales: ja, en

### Internationalization
- Use `useTranslations` hook from next-intl in client components
- Use `getMessages` in server components
- Translation keys organized by namespace (e.g., `common`, `home`, `errors`)
- All user-facing text must be internationalized

### Styling
- Tailwind utility classes with dark mode support
- CSS variables for fonts: `--font-geist-sans`, `--font-geist-mono`
- Global styles in `app/globals.css`

### TypeScript
- Strict mode enabled
- Use `@/` path alias for imports from project root
- Async params in Next.js 15+ (e.g., `await params`)

### Component Organization
- Server components by default (Next.js App Router)
- Client components marked with `'use client'` directive
- Shared components in `/components`
- Utilities and helpers in `/lib`
