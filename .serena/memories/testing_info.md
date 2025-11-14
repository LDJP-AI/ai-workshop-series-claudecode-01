# Testing Information

## Test Framework
- **Framework**: Playwright (E2E testing)
- **Test File**: `e2e/ticket-crud.spec.ts`
- **Browsers Tested**: Chromium, Firefox (32 tests total: 16 per browser)

## Test Coverage
The project includes comprehensive E2E tests for the ticket management system:

### Test Categories
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

## Common Test Issues & Solutions

### Strict Mode Violation
**Problem**: Playwright strict mode fails when a locator matches multiple elements
**Example**: `page.locator('text=説明')` matched both `<h2>説明</h2>` and `<p>...説明を更新...</p>`
**Solution**: Use more specific CSS selectors
```javascript
// ❌ Bad - matches multiple elements
page.locator('text=説明')

// ✅ Good - specific selector
page.locator('h2:has-text("説明")')
```

## Test Commands
```bash
npm test              # Run all tests
npm run test:ui       # Interactive UI mode
npm run test:debug    # Debug mode
```

## Test Configuration
- Config file: `playwright.config.ts`
- Browser: Chromium and Firefox
- Server management: Dev server auto-starts during tests
- Timeout: 5000ms default

## Key Points for Maintenance
- Always use specific selectors to avoid strict mode violations
- Prefer `getByRole()` or `getByText()` with specific element types
- Use `:has-text()` pseudo-selector to target specific elements when multiple match text
- Tests validate both positive flows and validation errors
- Cross-browser testing ensures compatibility
