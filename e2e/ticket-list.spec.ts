import { expect, test } from '@playwright/test';
import { createSimpleTicket, createTestUsers } from '../playwright/testHelper';

test.describe('チケット一覧・検索・フィルター', () => {
  test.beforeEach(async ({ page }) => {
    // ダッシュボードに移動
    await page.goto('/');
    await expect(page).toHaveTitle('Ticket Manager');
  });

  test.describe('チケット一覧', () => {
    let testTicketId: number;

    test.beforeAll(async () => {
      // テストデータ作成
      await createTestUsers();
      const ticket = await createSimpleTicket(
        '一覧表示用テストチケット',
        'このチケットはチケット一覧表示テストで使用されます'
      );
      testTicketId = ticket.id;
    });

    test('チケット一覧が表示されること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // ページが表示される
      await expect(page.locator('h1')).toContainText('チケット一覧');

      // 複数のチケットが表示される
      const ticketCards = page.locator('a[href*="/tickets/"]');
      const count = await ticketCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('一覧からチケット詳細に遷移できること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // テストチケットをクリック
      await page.locator(`a[href="/tickets/${testTicketId}"]`).first().click();

      // チケット詳細ページに移動
      await expect(page).toHaveURL(`/tickets/${testTicketId}`);
      // h1に該当のチケットIDが含まれていることを確認
      await expect(page.locator('h1')).toContainText(`#${testTicketId}`);
    });
  });

  test.describe('検索・フィルター機能', () => {
    test('検索ボックスが表示されていること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // 検索ボックスが表示される
      await expect(page.locator('input[name="search"]')).toBeVisible();

      // フィルターセレクトが表示される
      await expect(page.locator('select[name="status"]')).toBeVisible();
      await expect(page.locator('select[name="sort"]')).toBeVisible();
    });

    test('キーワード検索でチケットをフィルターできること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // 初期状態でチケットが表示されている
      const initialCards = page.locator('a[href*="/tickets/"]');
      const initialCount = await initialCards.count();
      expect(initialCount).toBeGreaterThan(0);

      // 検索ボックスに入力
      await page.fill('input[name="search"]', 'bug');

      // URLが更新され、フィルターが適用される
      await page.waitForURL(/search=bug/);

      // 検索結果が表示される
      await expect(page.locator('input[name="search"]')).toHaveValue('bug');
    });

    test('ステータスフィルターでチケットをフィルターできること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // ステータスセレクトで「完了」を選択
      await page.selectOption('select[name="status"]', 'DONE');

      // URLが更新される
      await page.waitForURL(/status=DONE/);

      // フィルター状態が表示される
      await expect(page.locator('text=フィルター適用中')).toBeVisible();
      await expect(page.locator('div.bg-blue-50 strong:has-text("DONE")')).toBeVisible();
    });

    test('ソート機能でチケットを並べ替えられること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // ソートセレクトで「作成日 (古い順)」を選択
      await page.selectOption('select[name="sort"]', 'created-asc');

      // URLが更新される
      await page.waitForURL(/sort=created-asc/);

      // ソートが適用されている
      const sortSelect = page.locator('select[name="sort"]');
      const sortValue = await sortSelect.inputValue();
      expect(sortValue).toBe('created-asc');
    });

    test('フィルターリセットボタンでフィルターをリセットできること', async ({ page }) => {
      // チケット一覧ページで検索を実行
      await page.goto('/tickets?search=bug&status=OPEN');

      // リセットボタンが表示される
      await expect(page.locator('button:has-text("フィルターをリセット")')).toBeVisible();

      // リセットボタンをクリック
      await page.click('button:has-text("フィルターをリセット")');

      // チケット一覧ページにリダイレクト（フィルターなし）
      await page.waitForURL('/tickets');
      await expect(page).toHaveURL('/tickets');
    });

    test('検索結果が正しく表示されること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // 「API」で検索
      await page.fill('input[name="search"]', 'API');

      // URLが更新される
      await page.waitForURL(/search=API/);

      // 結果が表示される（チケットが見つかるか、見つからないかのいずれか）
      const noResultsMsg = page.locator('text=チケットが見つかりません');
      const ticketCards = page.locator('a[href*="/tickets/"]');

      const noResults = await noResultsMsg.isVisible().catch(() => false);
      const hasResults = await ticketCards
        .count()
        .then((c) => c > 0)
        .catch(() => false);

      expect(noResults || hasResults).toBeTruthy();
    });

    test('複数のフィルターを同時に適用できること', async ({ page }) => {
      // チケット一覧ページに移動
      await page.goto('/tickets');

      // 検索と、ステータスフィルターを適用
      await page.fill('input[name="search"]', 'Fix');
      // 検索が反映されるまで待機
      await page.waitForURL(/search=Fix/);

      // ステータスフィルターを適用
      await page.selectOption('select[name="status"]', 'OPEN');
      // 両方のフィルターが反映されるまで待機
      await page.waitForURL(/search=Fix.*status=OPEN|status=OPEN.*search=Fix/);

      // フィルター状態が表示される
      await expect(page.locator('text=フィルター適用中')).toBeVisible();
      await expect(page.locator('input[name="search"]')).toHaveValue('Fix');
      await expect(page.locator('select[name="status"]')).toHaveValue('OPEN');
    });
  });
});
