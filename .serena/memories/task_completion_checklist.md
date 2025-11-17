# Task Completion Checklist

## After Completing a Task, Run These Commands

### 1. Lint the Code

```bash
npm run lint
```

Ensure no ESLint errors or warnings are present. Fix any linting issues before proceeding.

### 2. Build the Project

```bash
npm run build
```

Verify that the production build succeeds without errors. This catches TypeScript compilation errors and Next.js build issues.

### 3. Test in Development

```bash
npm run dev
```

Run the development server and manually test the changes in the browser at http://localhost:3000.

## Verification Steps

- [ ] ESLint passes with no errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Development server starts without errors (`npm run dev`)
- [ ] Changes display correctly in browser at http://localhost:3000
- [ ] No console errors or warnings (check browser DevTools)
- [ ] Code follows TypeScript strict mode (no implicit `any`)
- [ ] Tailwind CSS classes are properly applied

## Git Workflow

After verifying the above:

```bash
git add .                          # Stage changes
git commit -m "descriptive message" # Create commit
git log --oneline                  # Verify commit was created
```

## Common Issues

- **Build fails with type errors:** Check `npm run lint` output and fix TypeScript errors
- **Tailwind classes not applied:** Ensure classes are used in files scanned by Tailwind (in `/app` directory)
- **HMR not working:** Restart dev server with `npm run dev`
- **Module not found:** Check path alias usage and file names
