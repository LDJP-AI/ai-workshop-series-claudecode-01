# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 ticket management application built with TypeScript and Tailwind CSS. It serves as a workshop project for the AI Workshop Series focused on Claude and modern web development practices. The application is fully localized to Japanese and includes comprehensive E2E tests.

**Tech Stack:**
- **Framework:** Next.js 16.0.3 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Library:** React 19.2.0 with Heroicons (24)
- **Testing:** Playwright (E2E tests)
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

# Run all E2E tests (Chromium + Firefox, 32 tests total)
npm test

# Run specific test file
npm test -- e2e/ticket-crud.spec.ts

# Run tests in interactive UI mode
npm run test:ui

# Run tests in debug mode with inspector
npm run test:debug

# Run tests for specific browser
npm test -- --project=chromium
npm test -- --project=firefox
```

## Project Architecture

### Data Flow

The ticket management system uses a layered architecture:

1. **Data Layer** (`lib/data/tickets.ts`):
   - In-memory ticket store with sample data
   - Query functions: `getTickets()`, `getTicketById()`, `searchTickets()`, etc.
   - Reference data: `users`, `labels` arrays
   - Read-only operations for Server Components

2. **Action Layer** (`lib/actions/tickets.ts`):
   - Server Actions (use `'use server'`)
   - CRUD operations with validation
   - Form data handling
   - Cache revalidation using `revalidatePath()`
   - Redirects after mutations using `redirect()`

3. **Component Layer** (`components/`):
   - **UI Components** (`components/ui/`): Reusable primitive components (Button, Card, Input, Select, Textarea, Badge)
   - **Ticket Components** (`components/tickets/`): Domain-specific components for ticket features
   - **Layout Components** (`components/layout/`): Navigation and page structure

### Key Architectural Patterns

**Server Components by Default**: All components are Server Components unless they need client-side interactivity. This includes:
- Dashboard page (home) - all queries run server-side
- Ticket list page - server-side data fetching
- Ticket detail page - server-side rendering of ticket data
- Edit forms - Server Actions handle submissions

**Client Components**: Use `'use client'` only for:
- Status change dropdown (user interaction needed)
- Comment form submission
- Form components that manage input state

**In-Memory Data Storage**: Currently uses a module-level JavaScript array (`let tickets: Ticket[]`) in `lib/actions/tickets.ts`. This data persists during a single server process but resets between deployments/restarts. Future phases should migrate to persistent storage (database).

### Type System

All types defined in `types/ticket.ts`:
- `Ticket`: Main entity with CRUD-managed properties
- `TicketStatus`: `'OPEN' | 'IN_PROGRESS' | 'DONE'`
- `Priority`: `'LOW' | 'MEDIUM' | 'HIGH'`
- `User`, `Label`, `Comment`: Supporting entities

### Validation Rules

**Ticket Creation/Update**:
- Title: minimum 3 characters
- Description: minimum 10 characters
- Priority: defaults to 'MEDIUM' if not specified
- Assignee: optional (can be null)
- Due Date: optional (can be null)

**Comment Actions**:
- Content: minimum 2 characters

### Data Revalidation Strategy

After mutations, the system revalidates cached data for affected routes:
```typescript
// Example from updateTicket()
revalidatePath(`/tickets/${id}`);      // Detail page
revalidatePath('/tickets');             // List page
revalidatePath('/');                    // Home dashboard
redirect(`/tickets/${id}`);             // Navigate to detail
```

## Testing

### Test Framework Details

- **Framework:** Playwright 1.56.1 (E2E testing)
- **Test File:** `e2e/ticket-crud.spec.ts`
- **Browsers:** Chromium and Firefox (16 tests per browser = 32 total)
- **Configuration:** `playwright.config.ts`
- **Dev Server:** Auto-started during test runs

### Test Coverage

The test suite validates the complete ticket lifecycle with Japanese UI text:

1. **チケット作成** (Ticket Creation) - 4 tests
   - Navigate to new ticket creation page
   - Create ticket with valid data
   - Title validation (< 3 chars rejected)
   - Description validation (< 10 chars rejected)

2. **チケット詳細とステータス変更** (Ticket Details & Status Change) - 3 tests
   - Display ticket details with all fields
   - Change ticket status (OPEN → IN_PROGRESS, etc.)
   - Display edit/delete action buttons

3. **チケット編集** (Ticket Editing) - 3 tests
   - Navigate to edit page with pre-filled form
   - Update ticket data successfully
   - Cancel button restores previous page

4. **チケット一覧** (Ticket List) - 2 tests
   - Display list of all tickets
   - Navigate to ticket details from list

5. **ナビゲーション** (Navigation) - 2 tests
   - Header navigation between home/tickets/new
   - New ticket button from home page

6. **ダッシュボード** (Dashboard) - 2 tests
   - Display ticket count statistics
   - Display recent tickets section

### Important Test Guidelines

**Avoid Playwright Strict Mode Violations** - Always use specific selectors:

```javascript
// ❌ Bad - matches multiple elements
page.locator('text=説明')

// ✅ Good - element type + text
page.locator('h2:has-text("説明")')

// ✅ Good - semantic locators
page.getByRole('heading', { name: '説明' })
page.getByRole('button', { name: 'ステータス変更' })
```

**Best Practices:**
- Use semantic locators (`getByRole`, `getByLabel`, `getByText` with element type)
- Use `:has-text()` pseudo-selector when text appears in multiple places
- Never use generic text-only locators
- Test both success paths and validation errors
- Cross-browser testing ensures Chromium and Firefox compatibility

## Routes

- `/` - Dashboard (home page with statistics and recent tickets)
- `/tickets` - Ticket list page with filtering
- `/tickets/new` - Create new ticket form
- `/tickets/[id]` - View ticket details with comments
- `/tickets/[id]/edit` - Edit ticket form

## Common Development Tasks

**Running a single test:**
```bash
npm test -- --grep "チケット作成"  # Run by test name pattern
```

**Debugging test failures:**
```bash
npm run test:debug
# Opens Inspector tab in browser for step-by-step debugging
```

**Adding new features:**
- For data retrieval: Add query function to `lib/data/tickets.ts`
- For mutations: Add Server Action to `lib/actions/tickets.ts` with validation
- For UI: Create component in `components/tickets/` or `components/ui/`
- Update tests in `e2e/ticket-crud.spec.ts` to cover new paths

## Important Notes

- Auto-reload enabled during development (`npm run dev`)
- Main entry point: `app/page.tsx` (dashboard)
- Tailwind auto-scans `app/` directory for class usage
- Next.js font optimization handled automatically
- Tests run with managed dev server - no manual server startup needed
- Data is stored in-memory; restart loses all changes (note for future DB integration)
