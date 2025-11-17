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

### Lint Code

```bash
npm run lint
```

Runs ESLint on the codebase. Uses Next.js ESLint configuration with core web vitals and TypeScript rules.

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
