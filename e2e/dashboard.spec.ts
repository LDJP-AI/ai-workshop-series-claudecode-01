import { expect, test } from '@playwright/test';

test.describe('ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    // ダッシュボードに移動
    await page.goto('/');
    await expect(page).toHaveTitle('Ticket Manager');
  });

  test('ダッシュボードに統計情報が表示されること', async ({ page }) => {
    // ダッシュボードにいる
    await expect(page).toHaveURL('/');

    // 統計情報が表示される
    await expect(page.locator('h1')).toContainText('ダッシュボード');

    // ステータス別の件数が表示される
    const stats = page.locator('text=/オープン|進行中|完了/');
    const count = await stats.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('ダッシュボードに最近のチケットが表示されること', async ({ page }) => {
    // ダッシュボードにいる
    await expect(page).toHaveURL('/');

    // 最近のチケットセクション
    await expect(page.locator('text=最近のチケット')).toBeVisible();

    // チケットカードが表示される
    const ticketCards = page.locator('a[href*="/tickets/"]');
    const count = await ticketCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
