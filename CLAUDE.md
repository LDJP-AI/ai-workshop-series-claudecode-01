# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project with TypeScript and Tailwind CSS. It serves as a template/starter project for the AI Workshop Series focused on Claude and modern web development practices.

**Tech Stack:**
- **Framework:** Next.js 16.0.3 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Library:** React 19.2.0
- **Linting:** ESLint 9 with Next.js configuration

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build production application
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Run E2E tests
npm test

# Run E2E tests in interactive UI mode
npm run test:ui

# Run E2E tests in debug mode
npm run test:debug
```

## Project Structure

```
app/
├── layout.tsx       # Root layout wrapper for all pages
├── page.tsx         # Home page component
└── globals.css      # Global styles and Tailwind directives

public/             # Static assets (images, fonts, SVGs, favicon)

config files/
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript compiler settings
├── eslint.config.mjs        # ESLint configuration
└── postcss.config.mjs       # PostCSS config for Tailwind CSS
```

## Architecture Patterns

### App Router
This project uses Next.js 13+ App Router (file-based routing in the `/app` directory). Routes are defined by directory structure and `page.tsx` files.

### React Server Components
The project leverages React Server Components by default. Use `'use client'` directive only when you need client-side interactivity (state, effects, event handlers).

### Styling
Tailwind CSS is the primary styling approach. Use utility classes directly in JSX rather than CSS files. Global styles go in `app/globals.css`.

### Component Structure
- Place reusable components in an `app/components/` directory (create as needed)
- Keep components small and focused
- Use TypeScript for type safety on props

## Testing

### Test Framework
- **Framework:** Playwright (E2E testing)
- **Test File:** `e2e/ticket-crud.spec.ts`
- **Browsers:** Chromium and Firefox (32 tests total: 16 per browser)
- **Configuration:** `playwright.config.ts`

### Test Coverage
The project includes comprehensive E2E tests for the ticket management system:

1. **チケット作成** (Ticket Creation) - 4 tests
   - New ticket creation page navigation
   - Normal ticket creation
   - Title validation (min 3 characters)
   - Description validation (min 10 characters)

2. **チケット詳細とステータス変更** (Ticket Details & Status Change) - 3 tests
   - Display ticket details
   - Change ticket status
   - Display edit/delete buttons

3. **チケット編集** (Ticket Editing) - 3 tests
   - Navigate to edit page with pre-filled data
   - Update ticket normally
   - Cancel button behavior

4. **チケット一覧** (Ticket List) - 2 tests
   - Display ticket list
   - Navigate to ticket details from list

5. **ナビゲーション** (Navigation) - 2 tests
   - Header navigation between pages
   - New ticket creation button

6. **ダッシュボード** (Dashboard) - 2 tests
   - Display statistics
   - Display recent tickets

### Important Test Guidelines

**Playwright Strict Mode:** Avoid multiple element matches when using locators
```javascript
// ❌ Bad - matches multiple elements (causes strict mode violation)
page.locator('text=説明')

// ✅ Good - specific selector targeting the heading
page.locator('h2:has-text("説明")')

// ✅ Good - use semantic selectors
page.getByRole('heading', { name: '説明' })
```

**Best Practices:**
- Use specific CSS selectors or semantic locators (`getByRole`, `getByText` with element type)
- Use `:has-text()` pseudo-selector to target specific elements when text appears in multiple places
- Avoid generic text locators that could match unintended elements
- Test both positive flows and validation errors
- Cross-browser testing ensures compatibility between Chromium and Firefox

## Important Notes

- The project auto-reloads on file changes during development (`npm run dev`)
- The main entry point is `app/page.tsx` - this renders the home page
- Tailwind CSS is configured with PostCSS and auto-scans the `app/` directory for class usage
- Font optimization is handled by Next.js (see `next/font` usage in layout.tsx)
- Tests run with auto-managed dev server during test execution
