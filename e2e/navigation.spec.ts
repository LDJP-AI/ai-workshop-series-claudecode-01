import { expect, test } from '@playwright/test';

test.describe('ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    // ダッシュボードに移動
    await page.goto('/');
    await expect(page).toHaveTitle('Ticket Manager');
  });

  test('ヘッダーのリンクでページ間を遷移できること', async ({ page }) => {
    // ダッシュボードにいる
    await expect(page).toHaveURL('/');

    // ヘッダーの Tickets リンクをクリック
    await page.click('a[href="/tickets"]');
    await expect(page).toHaveURL('/tickets');

    // ヘッダーの Dashboard リンクをクリック
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('新規チケットボタンで新規作成ページに遷移できること', async ({ page }) => {
    // ダッシュボードにいる
    await expect(page).toHaveURL('/');

    // ヘッダーの New Ticket ボタンをクリック
    await page.click('a[href="/tickets/new"]');
    await expect(page).toHaveURL('/tickets/new');
  });
});
