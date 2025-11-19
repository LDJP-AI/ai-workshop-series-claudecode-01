import { expect, test } from '@playwright/test';

test.describe('チケット作成', () => {
  test.beforeEach(async ({ page }) => {
    // ダッシュボードに移動
    await page.goto('/');
    await expect(page).toHaveTitle('Ticket Manager');
  });

  test('新規チケット作成ページに遷移できること', async ({ page }) => {
    // 新規チケット作成ボタンをクリック
    await page.click('a[href="/tickets/new"]');

    // 作成ページが表示される
    await expect(page).toHaveURL('/tickets/new');
    await expect(page.locator('h1')).toContainText('新規チケット作成');
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
  });

  test('新規チケットを正常に作成できること', async ({ page }) => {
    // 新規チケット作成ページに移動
    await page.goto('/tickets/new');

    // フォームを入力
    await page.fill('input[name="title"]', 'テストチケット作成');
    await page.fill('textarea[name="description"]', '作成機能の動作確認用テストチケットです');
    await page.selectOption('select[name="priority"]', 'HIGH');

    // フォーム送信
    await page.click('button[type="submit"]');

    // チケット詳細ページにリダイレクト（URLが/tickets/[id]に変わることを確認）
    await page.waitForURL(/\/tickets\/\d+/);
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/tickets\/\d+/);
  });

  test('タイトルが短すぎるときバリデーションエラーが表示されること', async ({ page }) => {
    // 新規チケット作成ページに移動
    await page.goto('/tickets/new');

    // タイトルが短すぎる
    await page.fill('input[name="title"]', 'ab');
    await page.fill('textarea[name="description"]', '十分な長さを持つテスト説明文です');

    // フォーム送信
    await page.click('button[type="submit"]');

    // エラーが表示される（フォームが再度表示される）
    await expect(page).toHaveURL('/tickets/new');
  });

  test('説明が短すぎるときバリデーションエラーが表示されること', async ({ page }) => {
    // 新規チケット作成ページに移動
    await page.goto('/tickets/new');

    // 説明が短すぎる
    await page.fill('input[name="title"]', 'テストタイトル');
    await page.fill('textarea[name="description"]', '短い');

    // フォーム送信
    await page.click('button[type="submit"]');

    // エラーが表示される
    await expect(page).toHaveURL('/tickets/new');
  });
});
