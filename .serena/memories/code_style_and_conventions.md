# Code Style and Conventions

## TypeScript

- **Strict Mode:** Enabled in tsconfig.json (`"strict": true`)
- **Target:** ES2017
- **Module System:** ESNext modules with bundler resolution
- **JSX:** React 17+ JSX transform (`"jsx": "react-jsx"`)
- **Type Checking:** Full type checking required, no implicit `any`
- **Path Aliases:** `@/*` points to project root for imports

### TypeScript Best Practices in This Project

- Use explicit type annotations for function parameters and return types
- Leverage interface/type definitions for React component props
- Use `'use client'` directive only when client-side interactivity is needed
- Prefer Server Components by default (no directive = server component)

## ESLint Configuration

- Uses `eslint-config-next/core-web-vitals` for performance/accessibility checks
- Uses `eslint-config-next/typescript` for TypeScript-specific rules
- Strict linting enforced

### Prettier Configuration

- **Config file:** `.prettierrc`
- **Ignore file:** `.prettierignore`
- **Plugins:**
  - `@ianvs/prettier-plugin-sort-imports`: Organizes imports
  - `prettier-plugin-tailwindcss`: Orders Tailwind className attributes
- **Import order:** React/Next.js → @ aliases → relative paths → others
- **Tailwind ordering:** Follows Tailwind's recommended class order (layout → spacing → size → colors → etc.)

## Ignored Paths (ESLint + Prettier)

- `.next/` - Next.js build output
- `out/` - Static export output
- `build/` - Build artifacts
- `next-env.d.ts` - Auto-generated Next.js types
- `node_modules/` - Dependencies
- `playwright-report/` - Test reports
- `test-results/` - Test results

## React/Next.js Conventions

- **Components:** Functional components with React Server Components as default
- **Naming:** PascalCase for component files and exports
- **File Extension:** `.tsx` for files with JSX, `.ts` for TypeScript files
- **Styling:** Tailwind CSS utility classes (no separate CSS files unless necessary)
- **Routing:** File-based routing in `/app` directory
- **Imports:** Use `@/` path alias for absolute imports

## Code Style Guidelines (Enforced by Prettier)

- Use semicolons
- Use single quotes for strings
- Tab width: 2 spaces
- Trailing commas: ES5 style
- Max line width: 100 characters
- Arrow functions: Always use parentheses for parameters
- End of line: LF
- Use const/let, avoid var
- Use arrow functions for callbacks
- Keep components small and focused
- Write descriptive variable and function names

### Auto-Formatting

All code is automatically formatted on save using Prettier with:

- Import sorting plugin: Orders imports as React/Next.js → @ aliases → relative paths
- Tailwind CSS plugin: Orders className attributes by Tailwind best practices
- Configuration: `.prettierrc`, `.vscode/settings.json`, `.prettierignore`

## File Organization

- Global styles: `app/globals.css`
- Layout components: `app/layout.tsx` (root layout)
- Pages: `app/page.tsx` (home), `app/[route]/page.tsx` (nested routes)
- Reusable components: Should go in `app/components/` (create as needed)
