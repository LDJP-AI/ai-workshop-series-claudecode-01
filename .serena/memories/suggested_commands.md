# Suggested Commands

## Development Commands

### Start Development Server

```bash
npm run dev
```

Runs the Next.js development server on http://localhost:3000 with hot module replacement (HMR). Changes to files are reflected immediately.

### Build Production

```bash
npm run build
```

Creates an optimized production build. This compiles TypeScript, optimizes assets, and prepares the application for deployment.

### Start Production Server

```bash
npm run start
```

Runs the built application in production mode. Must run `npm run build` first.

### Format Code

```bash
npm run format
```

Formats all TypeScript, JavaScript, JSON, Markdown, and CSS files using Prettier. Automatically sorts imports and orders Tailwind className attributes. Auto-runs on save in ClaudeCode IDE.

### Check Code Formatting

```bash
npm run format:check
```

Checks if code adheres to Prettier formatting rules without making changes. Useful in CI/CD pipelines.

### Lint Code

```bash
npm run lint
```

Runs ESLint on the codebase. Uses Next.js ESLint configuration with core web vitals and TypeScript rules.

### Run E2E Tests

```bash
npm test                           # Run all tests (Chromium + Firefox)
npm test -- e2e/ticket-crud.spec.ts # Run specific test file
npm run test:ui                    # Interactive UI mode
npm run test:debug                 # Debug mode with inspector
npm test -- --project=chromium     # Run specific browser only
```

## Useful System Commands

### Git Operations

```bash
git status           # Check current branch and file changes
git diff             # View uncommitted changes
git add .            # Stage all changes
git commit -m "..."  # Create a commit
git log --oneline    # View recent commits
```

### Node/npm Commands

```bash
npm install          # Install dependencies (after package.json changes)
npm list             # Show installed package versions
npm outdated         # Check for outdated packages
```

### File/Directory Navigation (Darwin/macOS)

```bash
ls -la               # List files with details
cd <path>            # Change directory
pwd                  # Print working directory
find . -name "*.tsx" # Find files by pattern
grep -r "pattern"    # Search file contents
```
