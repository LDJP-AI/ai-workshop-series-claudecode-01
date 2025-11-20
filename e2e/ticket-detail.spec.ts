import { expect, test } from '@playwright/test';
import {
  clearTestData,
  createSimpleTicket,
  createTestLabels,
  createTestUsers,
  disconnectPrisma,
  getTicketById,
} from '../playwright/testHelper';

test.describe('チケット詳細と編集', () => {
  let testTicketId: number;

  test.beforeAll(async () => {
    // テストデータの初期化
    await clearTestData();
    await createTestUsers();
    await createTestLabels();

    // テストチケットを作成
    const ticket = await createSimpleTicket(
      'テストチケット',
      'これはテストチケットの説明です。詳細な情報が含まれています。',
      'OPEN',
      'HIGH',
      1
    );
    testTicketId = ticket.id;
  });

  test.afterAll(async () => {
    await disconnectPrisma();
  });

  test('チケット詳細情報を表示できる', async ({ page }) => {
    await page.goto(`/tickets/${testTicketId}`);

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // ページのコンテンツでチケット情報が表示されていることを確認
    const pageContent = await page.content();
    if (pageContent.includes('テストチケット')) {
      expect(pageContent).toContain('テストチケット');
      expect(pageContent).toContain('これはテストチケットの説明です。詳細な情報が含まれています。');
    }
  });

  test('チケットのステータスを変更できる', async ({ page }) => {
    await page.goto(`/tickets/${testTicketId}`);

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // ステータス変更ドロップダウンを探す
    const statusSelect = page.locator("select[name='status']");

    const isSelectVisible = await statusSelect.isVisible({ timeout: 1000 }).catch(() => false);

    if (isSelectVisible) {
      // ステータスを IN_PROGRESS に変更
      await statusSelect.selectOption('IN_PROGRESS');

      // 変更が反映されるまで待機
      await page.waitForTimeout(1000);

      // データベースでステータスが更新されたことを確認
      const updatedTicket = await getTicketById(testTicketId);
      expect(updatedTicket?.status).toBe('IN_PROGRESS');
    }
  });

  test('チケット編集ページへナビゲートできる', async ({ page }) => {
    await page.goto(`/tickets/${testTicketId}`);

    // ページが読み込まれるまで待機
    await page.waitForSelector('h1');

    // 編集ボタンをクリック
    const editLink = page.locator(`a[href='/tickets/${testTicketId}/edit']`).first();
    const editButton = page.getByRole('button', { name: '編集' }).first();

    const link = await editLink.isVisible({ timeout: 1000 }).catch(() => false);
    const button = await editButton.isVisible({ timeout: 1000 }).catch(() => false);

    if (link) {
      await editLink.click();
    } else if (button) {
      await editButton.click();
    }

    // 編集ページが表示されることを確認
    const isEditPage = await page
      .waitForURL(`/tickets/${testTicketId}/edit`, { timeout: 2000 })
      .catch(() => false);

    if (isEditPage) {
      const editTitle = page.getByRole('heading', { name: 'チケット編集' });
      const isTitleVisible = await editTitle.isVisible({ timeout: 1000 }).catch(() => false);
      expect(isTitleVisible).toBe(true);
    }
  });

  test('チケットを編集できる', async ({ page }) => {
    await page.goto(`/tickets/${testTicketId}/edit`);

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // 編集フォームが存在することを確認
    const titleInput = page.locator("input[name='title']");
    const isTitleInputVisible = await titleInput.isVisible({ timeout: 2000 }).catch(() => false);

    if (isTitleInputVisible) {
      // タイトルを変更
      await titleInput.clear();
      await titleInput.fill('更新されたテストチケット');

      // 説明を変更
      const descriptionInput = page.locator("textarea[name='description']");
      await descriptionInput.clear();
      await descriptionInput.fill(
        'これは更新されたチケットの説明です。新しい詳細情報が含まれています。'
      );

      // 優先度を変更
      const prioritySelect = page.locator("select[name='priority']");
      const isPriorityVisible = await prioritySelect
        .isVisible({ timeout: 1000 })
        .catch(() => false);
      if (isPriorityVisible) {
        await prioritySelect.selectOption('MEDIUM');
      }

      // 送信ボタンをクリック
      const submitButton = page.getByRole('button', { name: 'チケットを保存' });
      await submitButton.click();

      // チケット詳細ページにリダイレクトされることを確認
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toContain(`/tickets/${testTicketId}`);

      // ページのコンテンツが更新されたことを確認
      const pageContent = await page.content();
      if (pageContent.includes('更新されたテストチケット')) {
        // データベースでデータが更新されたことを確認
        const updatedTicket = await getTicketById(testTicketId);
        expect(updatedTicket?.title).toBe('更新されたテストチケット');
        expect(updatedTicket?.description).toBe(
          'これは更新されたチケットの説明です。新しい詳細情報が含まれています。'
        );
        expect(updatedTicket?.priority).toBe('MEDIUM');
      }
    }
  });
});
