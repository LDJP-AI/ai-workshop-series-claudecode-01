# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 ticket management application built with TypeScript and Tailwind CSS. It serves as a workshop project for the AI Workshop Series focused on Claude and modern web development practices. The application is fully localized to Japanese and includes comprehensive E2E tests.

**Tech Stack:**

- **Framework:** Next.js 16.0.3 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Library:** React 19.2.0 with Heroicons (24)
- **Database:** SQLite + Prisma ORM v6.19.0
- **GraphQL:** Apollo Server v5.1.0 + Apollo Client v3.12.3
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

# Format code with Prettier (imports + Tailwind className ordering)
npm run format

# Check code formatting without applying changes
npm run format:check

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

# Database/Prisma commands
npm run prisma:migrate      # Create and run database migration
npm run prisma:seed         # Seed database with sample data

# Prisma utilities
npx prisma studio          # Open Prisma Studio (GUI database browser)
npx prisma migrate dev --name <name>  # Create new migration with custom name
npx prisma generate        # Regenerate Prisma Client
```

### Auto-Formatting in ClaudeCode

ClaudeCode IDE automatically formats code on save using Prettier. Configuration is set in `.vscode/settings.json`:

- **Default formatter:** Prettier (`esbenp.prettier-vscode`)
- **Format on save:** Enabled for all TypeScript, JavaScript, JSON, Markdown, and CSS files
- **Format on paste:** Enabled
- **Plugins:** Import sorting + Tailwind CSS className ordering

No additional setup needed—edits will be auto-formatted when saved.

## Code Navigation and Editing Strategy

### Prefer Serena Symbolic Tools for Code Analysis

When exploring or modifying code, **prioritize Serena MCP tools** over generic search tools. They provide semantic-aware results and are more efficient:

**Symbolic Operations (Preferred):**

- `find_symbol` - Locate specific functions, classes, types by name
- `find_referencing_symbols` - Find all references to a symbol
- `get_symbols_overview` - Get structure overview of a file
- `replace_symbol_body` - Replace entire function/class/method body
- `insert_before_symbol` / `insert_after_symbol` - Add code at specific locations
- `rename_symbol` - Rename symbols across codebase

**Generic Tools (When Needed):**

- `Glob` - Find files by pattern (use after understanding file structure)
- `Grep` - Search text content (when semantic search won't work)
- `Read` - Read specific file content (only after symbolic search)

### Example Workflow

**Task:** Add validation to ticket creation

1. Use `find_symbol` with `name_path="/createTicket"` in `lib/actions/tickets.ts` → locate function
2. Read the function body to understand current validation
3. Use `replace_symbol_body` to update validation logic
4. Use `find_referencing_symbols` to check for impacts
5. Code auto-formats on save

**Not recommended:**

- Reading entire files unless necessary
- Using grep repeatedly when you can use `find_symbol`
- Manual string editing when `replace_symbol_body` is available

### Project Structure Caching

Serena memories in `.serena/memories/` contain:

- `codebase_structure.md` - Directory layout and layer architecture
- `code_style_and_conventions.md` - Formatting and import rules
- `suggested_commands.md` - Development commands
- `project_overview.md` - Tech stack and dependencies

Reference these before making changes to understand patterns and conventions.

## Project Architecture

### Data Flow

The ticket management system uses a layered architecture with SQLite database and GraphQL API:

1. **Database Layer** (`prisma/`):
   - SQLite database with Prisma ORM
   - Schema: User, Ticket, Comment, Label, TicketLabel models
   - Migrations: Version-controlled schema changes
   - Seed script: Sample data initialization

2. **Data Layer** (`lib/data/tickets.ts`):
   - Prisma-based query functions: `getTickets()`, `getTicketById()`, `searchTickets()`, etc.
   - Async functions for server-side data fetching
   - Read-only operations for Server Components

3. **GraphQL Layer** (`lib/graphql/`):
   - **Schema** (`schema.ts`): Type definitions (User, Ticket, Comment, Label)
   - **Resolvers** (`resolvers.ts`): Query and Mutation implementations
   - **Endpoint** (`app/api/graphql/route.ts`): Apollo Server integration
   - Alternative API access for frontend or external clients

4. **Action Layer** (`lib/actions/tickets.ts`):
   - Server Actions (use `'use server'`)
   - CRUD operations with Prisma
   - Form data handling
   - Cache revalidation using `revalidatePath()`
   - Redirects after mutations using `redirect()`

5. **Component Layer** (`components/`):
   - **UI Components** (`components/ui/`): Reusable primitive components (Button, Card, Input, Select, Textarea, Badge, MarkdownRenderer)
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

**Persistent Data Storage**: All data is stored in SQLite database managed by Prisma ORM. The database persists across server restarts and is version-controlled through migrations.

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
revalidatePath(`/tickets/${id}`); // Detail page
revalidatePath('/tickets'); // List page
revalidatePath('/'); // Home dashboard
redirect(`/tickets/${id}`); // Navigate to detail
```

## Testing

### Test Framework Details

- **Framework:** Playwright 1.56.1 (E2E testing)
- **Test Directory:** `e2e/` (organized by page)
- **Browsers:** Chromium and Firefox
- **Configuration:** `playwright.config.ts`
- **Dev Server:** Auto-started during test runs
- **Test Helpers:** `playwright/testHelper.ts` (data creation utilities)

### Test File Organization

Tests are split by page for better maintainability:

- **`e2e/dashboard.spec.ts`** - Dashboard page tests
  - Display ticket count statistics
  - Display recent tickets section

- **`e2e/ticket-creation.spec.ts`** - Ticket creation page tests
  - Navigate to new ticket creation page
  - Create ticket with valid data
  - Title validation (< 3 chars rejected)
  - Description validation (< 10 chars rejected)

- **`e2e/ticket-detail.spec.ts`** - Ticket detail, editing, and comments
  - Display ticket details with all fields
  - Change ticket status
  - Display edit/delete action buttons
  - Navigate to edit page with pre-filled form
  - Update ticket data
  - Cancel button behavior
  - Comment creation and deletion

- **`e2e/ticket-list.spec.ts`** - Ticket list, search, and filters
  - Display list of all tickets
  - Navigate to ticket details from list
  - Search by keyword
  - Filter by status
  - Sort by various criteria
  - Reset filters

- **`e2e/navigation.spec.ts`** - Navigation between pages
  - Header navigation between home/tickets/new
  - New ticket button from home page

### Test File Naming Convention

**File naming:** `[page-name].spec.ts`

**Test structure within files:**

```typescript
test.describe('[ページ名]', () => {
  test.beforeEach(async ({ page }) => {
    // Page setup (common for all tests in file)
  });

  test.beforeAll(async () => {
    // Test data creation (runs once before all tests in describe block)
    // Use testHelper functions: createSimpleTicket(), createTestUsers(), etc.
  });

  test('specific test case', async ({ page }) => {
    // Test implementation
  });
});
```

### Test Data Management

- **Test Helpers:** Located in `playwright/testHelper.ts`
- **Functions:**
  - `createTestUsers()` - Create/retrieve test users
  - `createTestLabels()` - Create/retrieve test labels
  - `createSimpleTicket()` - Create basic ticket for testing
  - `clearTestData()` - Clear all test data
- **Database:** Isolated SQLite test database (`prisma/db/test.db`) recreated for each test run
- **Seed:** Minimal seed data (users + labels only) in `prisma/seed.ts`

**Important:** Each test file imports only the helpers it needs to avoid unused import warnings.

### Important Test Guidelines

**Avoid Playwright Strict Mode Violations** - Always use specific selectors:

```javascript
// ❌ Bad - matches multiple elements
page.locator('text=説明');

// ✅ Good - element type + text
page.locator('h2:has-text("説明")');

// ✅ Good - semantic locators
page.getByRole('heading', { name: '説明' });
page.getByRole('button', { name: 'ステータス変更' });
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

**Adding new database fields:**

1. Edit `prisma/schema.prisma` to add field
2. Create migration: `npx prisma migrate dev --name <field_description>`
3. Update `lib/data/tickets.ts` query functions if needed
4. Update `lib/graphql/schema.ts` and `lib/graphql/resolvers.ts` if exposing via GraphQL
5. Update `lib/actions/tickets.ts` if field is mutable

**Adding new features:**

- For data retrieval: Add query function to `lib/data/tickets.ts` (uses Prisma)
- For mutations: Add Server Action to `lib/actions/tickets.ts` with validation (uses Prisma)
- For GraphQL access: Update `lib/graphql/schema.ts` and `lib/graphql/resolvers.ts`
- For UI: Create component in `components/tickets/` or `components/ui/`
- Update tests in `e2e/ticket-crud.spec.ts` to cover new paths

**Resetting database for development:**

```bash
# Delete and recreate database (dev only!)
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

## Important Notes

- Auto-reload enabled during development (`npm run dev`)
- Main entry point: `app/page.tsx` (dashboard)
- Tailwind auto-scans `app/` directory for class usage
- Next.js font optimization handled automatically
- GraphQL endpoint: `http://localhost:3000/api/graphql` (Apollo Sandbox available)
- Database is SQLite located at `prisma/dev.db` (persistent across restarts)
- All schema changes must go through Prisma migrations (`npm run prisma:migrate`)
- Tests run with managed dev server and automatic database reset before each test run
- Seed script (`prisma/seed.ts`) populates initial data after migrations
- **Prisma v7 Migration Note**: Package.json's `prisma.seed` property is deprecated. This warning is harmless; full migration to `prisma.config.ts` planned for future updates
