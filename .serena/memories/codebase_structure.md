# Codebase Structure

## Directory Layout

```
project-root/
├── app/                          # Next.js App Router directory
│   ├── page.tsx                  # Home page (dashboard)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles and Tailwind directives
│   └── tickets/                  # Ticket management routes
│       ├── page.tsx              # Ticket list
│       ├── new/page.tsx          # Create ticket form
│       ├── [id]/page.tsx         # View ticket details
│       └── [id]/edit/page.tsx    # Edit ticket form
│
├── components/                   # Reusable components
│   ├── ui/                       # Primitive UI components (Button, Card, Input, etc.)
│   ├── tickets/                  # Domain-specific ticket components
│   ├── layout/                   # Layout components (Header, etc.)
│
├── lib/                          # Business logic and utilities
│   ├── data/tickets.ts           # Data queries (read-only)
│   └── actions/tickets.ts        # Server Actions (mutations, form handling)
│
├── types/                        # TypeScript type definitions
│   └── ticket.ts                 # Ticket domain types
│
├── e2e/                          # End-to-end tests
│   └── ticket-crud.spec.ts       # Playwright E2E tests
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── *.svg
│   └── [other assets]
│
├── Configuration Files
│   ├── .prettierrc                # Prettier formatting rules
│   ├── .prettierignore            # Files to ignore during formatting
│   ├── .vscode/settings.json      # VSCode editor settings (auto-format)
│   ├── .vscode/extensions.json    # VSCode extension recommendations
│   ├── next.config.ts             # Next.js configuration
│   ├── tsconfig.json              # TypeScript compiler options
│   ├── eslint.config.mjs          # ESLint configuration
│   ├── postcss.config.mjs         # PostCSS config (Tailwind)
│   ├── playwright.config.ts       # Playwright test configuration
│   └── package.json               # Dependencies and npm scripts
│
├── .git/                         # Git repository
├── .next/                        # Next.js build output (generated)
├── node_modules/                 # npm dependencies (generated)
├── playwright-report/            # Playwright test results (generated)
├── test-results/                 # Test results (generated)
├── CLAUDE.md                     # Claude Code guidance
└── README.md                     # Project README
```

## Key Files Explained

### app/layout.tsx

Root layout component that wraps every page. Contains:

- HTML structure
- Font optimization (Geist font)
- Global metadata
- Providers (if any)

### app/page.tsx

The home page component (rendered at `/`). Dashboard showing ticket statistics and recent tickets.

### app/tickets/

Ticket management routes:
- `page.tsx` - List all tickets with filtering
- `new/page.tsx` - Create new ticket form
- `[id]/page.tsx` - View ticket details with comments
- `[id]/edit/page.tsx` - Edit ticket form

### lib/data/tickets.ts

Data layer with read-only query functions:
- `getTickets()` - Fetch all tickets
- `getTicketById(id)` - Fetch single ticket
- `searchTickets(query, status, sortBy)` - Search and filter tickets
- `getTicketCount()` - Get ticket statistics
- `getOverdueTickets()` - Find overdue tickets
- Reference data: `users`, `labels` arrays

### lib/actions/tickets.ts

Server Actions for mutations:
- `createTicket()` - Create new ticket with validation
- `updateTicket()` - Update existing ticket
- `updateTicketStatus()` - Change ticket status
- `deleteTicket()` - Delete ticket
- `addComment()` - Add comment to ticket
- `deleteComment()` - Remove comment
- Uses `revalidatePath()` for cache invalidation

### types/ticket.ts

Domain type definitions:
- `Ticket` - Main entity
- `TicketStatus` - 'OPEN' | 'IN_PROGRESS' | 'DONE'
- `Priority` - 'LOW' | 'MEDIUM' | 'HIGH'
- `User`, `Label`, `Comment` - Supporting entities

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

npm scripts and all dependencies.

### .prettierrc

Prettier formatting configuration:
- Single quotes, semicolons, 2-space indentation
- 100 character line width
- Import sorting plugin: React/Next.js → @ aliases → relative paths
- Tailwind CSS className ordering plugin

### .vscode/settings.json

Editor settings for auto-formatting:
- Default formatter: esbenp.prettier-vscode
- Format on save: enabled
- Format on paste: enabled

## Architecture Notes

### Three-Layer Architecture

1. **Data Layer** (`lib/data/tickets.ts`) - Read-only queries
2. **Action Layer** (`lib/actions/tickets.ts`) - Server Actions with mutations and validation
3. **Component Layer** (`app/` + `components/`) - Server/Client components

### React Server Components (RSC)

- Default: All components are Server Components
- Client-side interactivity: Add `'use client'` directive at the top of the file
- Benefits: Better performance, direct database access, secrets safe
- Used for: Status dropdowns, comment forms, client state

### App Router

- File-based routing: `/app/page.tsx` → `/`, `/app/tickets/page.tsx` → `/tickets`
- Dynamic routes: `/app/tickets/[id]/page.tsx` → `/tickets/123`
- Nested layouts: Create nested `layout.tsx` files for grouped routes

### Tailwind CSS

- Scans `/app` directory for class usage
- Auto-ordered by prettier-plugin-tailwindcss on save
- Configuration via PostCSS
- No separate CSS files needed (use inline utility classes)

### In-Memory Data Storage

- Data stored in module-level array in `lib/actions/tickets.ts`
- Persists during single server process only
- Resets between deployments/restarts
- Future: Migrate to persistent database
