# Codebase Structure

## Directory Layout

```
project-root/
├── app/                          # Next.js App Router directory
│   ├── page.tsx                  # Home page component
│   ├── layout.tsx                # Root layout (wraps all pages)
│   ├── globals.css               # Global styles and Tailwind directives
│   └── components/               # (create as needed) Reusable components
│
├── public/                       # Static assets (served as-is)
│   ├── favicon.ico
│   ├── *.svg                     # SVG graphics and icons
│   └── [other assets]
│
├── Configuration Files
│   ├── next.config.ts            # Next.js configuration
│   ├── tsconfig.json             # TypeScript compiler options
│   ├── eslint.config.mjs         # ESLint configuration
│   ├── postcss.config.mjs        # PostCSS config (for Tailwind)
│   └── package.json              # Dependencies and npm scripts
│
├── .git/                         # Git repository
├── .next/                        # Next.js build output (generated)
├── node_modules/                 # npm dependencies (generated)
└── README.md / CLAUDE.md         # Documentation
```

## Key Files Explained

### app/layout.tsx
Root layout component that wraps every page. Contains:
- HTML structure
- Font optimization (Geist font)
- Global metadata
- Providers (if any)

### app/page.tsx
The home page component (rendered at `/`). Modify this to change the home page.

### app/globals.css
Contains:
- Tailwind CSS directives (@tailwind, @layer, @apply)
- Global CSS variables
- Font imports

### next.config.ts
Next.js configuration for build behavior, experimental features, and optimizations.

### tsconfig.json
TypeScript compiler configuration with strict mode enabled and path aliases.

### package.json
Lists npm scripts and all dependencies.

## Architecture Notes

### React Server Components (RSC)
- Default: All components are Server Components
- Client-side interactivity: Add `'use client'` directive at the top of the file
- Benefits: Better performance, direct database access, secrets safe

### App Router
- File-based routing: `/app/page.tsx` → `/`, `/app/blog/page.tsx` → `/blog`
- Dynamic routes: `/app/[id]/page.tsx` → `/anything`
- Nested layouts: Create nested `layout.tsx` files for grouped routes

### Tailwind CSS
- Scans `/app` directory for class usage
- No separate CSS files needed (use inline utility classes)
- Configuration via PostCSS
