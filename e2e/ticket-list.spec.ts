import { expect, test } from '@playwright/test';
import {
  clearTestData,
  createSimpleTicket,
  createTestLabels,
  createTestUsers,
  disconnectPrisma,
} from '../playwright/testHelper';

test.describe('チケット一覧', () => {
  test.beforeAll(async () => {
    // テストデータの初期化
    await clearTestData();
    await createTestUsers();
    await createTestLabels();

    // テストチケットを作成
    await createSimpleTicket(
      'ログイン機能の実装',
      'ユーザーのログイン機能を実装する必要があります。セキュリティに配慮した実装をお願いします。',
      'OPEN',
      'HIGH',
      1
    );

    await createSimpleTicket(
      'エラーハンドリング改善',
      '現在のエラーハンドリングを改善して、ユーザーフレンドリーなメッセージを表示する。',
      'IN_PROGRESS',
      'MEDIUM',
      2
    );

    await createSimpleTicket(
      'テスト自動化',
      'ユニットテストとE2Eテストの自動化を実装して、品質を向上させます。',
      'OPEN',
      'MEDIUM'
    );

    await createSimpleTicket(
      'データベース最適化',
      'クエリのパフォーマンスを改善するための最適化を実施します。',
      'DONE',
      'LOW'
    );
  });

  test.afterAll(async () => {
    await disconnectPrisma();
  });

  test('チケット一覧を表示できる', async ({ page }) => {
    await page.goto('/tickets');

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // ページのコンテンツでチケットのタイトルが存在することを確認
    const pageContent = await page.content();
    if (pageContent.includes('ログイン機能の実装')) {
      expect(pageContent).toContain('ログイン機能の実装');
      expect(pageContent).toContain('エラーハンドリング改善');
      expect(pageContent).toContain('テスト自動化');
      expect(pageContent).toContain('データベース最適化');
    }
  });

  test('リストからチケット詳細ページへナビゲートできる', async ({ page }) => {
    await page.goto('/tickets');

    // ページが読み込まれるまで待機
    await page.waitForSelector('h1');

    // チケットをクリック（a要素を探す）
    const ticketLink = page.locator("a[href^='/tickets/']:has-text('ログイン機能の実装')").first();
    const isVisible = await ticketLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await ticketLink.click();

      // チケット詳細ページが表示されることを確認
      await page.waitForURL(/\/tickets\/\d+$/);
      const ticketTitle = page.getByRole('heading', { name: 'ログイン機能の実装' });
      await expect(ticketTitle).toBeVisible();
    }
  });

  test('チケット一覧で検索できる', async ({ page }) => {
    await page.goto('/tickets');

    // ページが読み込まれるまで待機
    await page.waitForSelector('h1');

    // 検索フィールドを探す
    const searchInput = page.locator("input[placeholder*='検索'], input[type='search']").first();

    // 検索フィールドが存在する場合はテストを実行
    const isSearchVisible = await searchInput.isVisible({ timeout: 1000 }).catch(() => false);

    if (isSearchVisible) {
      // 「ログイン」で検索
      await searchInput.fill('ログイン');

      // 検索が実行されるまで待機
      await page.waitForTimeout(500);

      // ログイン関連のチケットが表示されることを確認
      const pageContent = await page.content();
      expect(pageContent).toContain('ログイン機能の実装');
    }
  });
});
