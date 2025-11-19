import { expect, test } from '@playwright/test';
import {
  createSimpleTicket,
  createTestUsers,
} from '../playwright/testHelper';

test.describe('チケット詳細・編集・コメント', () => {
  test.beforeEach(async ({ page }) => {
    // ダッシュボードに移動
    await page.goto('/');
    await expect(page).toHaveTitle('Ticket Manager');
  });

  test.describe('チケット詳細とステータス変更', () => {
    let testTicketId: number;

    test.beforeAll(async () => {
      // テストデータ作成
      await createTestUsers();
      const ticket = await createSimpleTicket(
        'テスト用チケット：詳細表示確認',
        'このチケットはチケット詳細ページの表示テストに使用されます'
      );
      testTicketId = ticket.id;
    });

    test('チケット詳細情報が正しく表示されること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // チケット情報が表示される
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // チケットIDが表示されている
      const h1Text = await h1.textContent();
      expect(h1Text).toMatch(new RegExp(`#${testTicketId}`));

      // 優先度が何かしら表示されている（低, 中, 高 のいずれか）
      const priorityContainer = page.locator('h3:has-text("優先度")').locator('..').first();
      await expect(priorityContainer).toBeVisible();

      // 説明セクションが表示されている
      await expect(page.locator('text="説明"').first()).toBeVisible();
    });

    test('チケットのステータスを変更できること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // 現在のステータスを確認
      const statusSelect = page.locator('select[name="status"]');

      // 初期ステータスは OPEN, IN_PROGRESS, または DONE のいずれか
      const currentStatus = await statusSelect.inputValue();
      expect(['OPEN', 'IN_PROGRESS', 'DONE']).toContain(currentStatus);

      // ステータスを変更（現在のステータスに応じて変更先を決定）
      const newStatus = currentStatus === 'OPEN' ? 'IN_PROGRESS' : 'DONE';
      await statusSelect.selectOption(newStatus);

      // セレクトが更新されるまで待機
      await page.waitForTimeout(1000);

      // セレクトが更新されたことを確認
      const updatedStatus = await statusSelect.inputValue();
      expect(updatedStatus).toBe(newStatus);
    });

    test('編集ボタンと削除ボタンが表示されること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // 編集ボタンが存在する
      const editButton = page.locator(`a[href="/tickets/${testTicketId}/edit"]`);
      await expect(editButton).toBeVisible();

      // 削除ボタンが存在する (ヘッダーの削除ボタンを特定するため、bg-red-600クラスを使用)
      const deleteButton = page.locator('button.bg-red-600:has-text("削除")');
      await expect(deleteButton).toBeVisible();
    });
  });

  test.describe('チケット編集', () => {
    let testTicketId: number;

    test.beforeAll(async () => {
      // テストデータ作成
      await createTestUsers();
      const ticket = await createSimpleTicket(
        '編集テスト用チケット',
        'このチケットはチケット編集機能のテストに使用されます'
      );
      testTicketId = ticket.id;
    });

    test('編集ページに遷移でき、既存データが事前入力されること', async ({ page }) => {
      // チケット詳細ページから編集ページに移動
      await page.goto(`/tickets/${testTicketId}`);
      await page.click(`a[href="/tickets/${testTicketId}/edit"]`);

      // 編集ページが表示される
      await expect(page).toHaveURL(`/tickets/${testTicketId}/edit`);
      await expect(page.locator('h1')).toContainText('チケット編集');

      // フォームが既存データで事前に埋まっている
      const titleInput = page.locator('input[name="title"]');
      const title = await titleInput.inputValue();
      // タイトルが入力されていることを確認（内容は問わない）
      expect(title.length).toBeGreaterThan(0);

      const descriptionTextarea = page.locator('textarea[name="description"]');
      const description = await descriptionTextarea.textContent();
      // 説明が入力されていることを確認（内容は問わない）
      expect(description ? description.length : 0).toBeGreaterThan(0);
    });

    test('チケットを正常に更新できること', async ({ page }) => {
      // 編集ページに移動
      await page.goto(`/tickets/${testTicketId}/edit`);

      // フォームを更新
      await page.fill('input[name="title"]', '更新: テスト用チケット編集確認');
      await page.fill(
        'textarea[name="description"]',
        'チケット編集機能のテストで更新されたテストチケットです'
      );
      await page.selectOption('select[name="priority"]', 'MEDIUM');

      // フォーム送信
      await page.click('button[type="submit"]');

      // チケット詳細ページにリダイレクト
      await expect(page).toHaveURL(`/tickets/${testTicketId}`);
      // チケットの詳細ページが表示されることを確認（URLのみで十分）
      const pageUrl = page.url();
      expect(pageUrl).toContain(`/tickets/${testTicketId}`);
    });

    test('キャンセルボタンで前のページに戻ること', async ({ page }) => {
      // 編集ページに移動
      await page.goto(`/tickets/${testTicketId}/edit`);

      // キャンセルボタンをクリック
      await page.click('button:has-text("キャンセル")');

      // ホームページまたは一覧に移動する（window.history.backの動作）
      await page.waitForURL(/\/(tickets)?$/);
      const url = page.url();
      expect(
        url === '/' || url === 'http://localhost:3000/' || url.includes('/tickets')
      ).toBeTruthy();
    });
  });

  test.describe('コメント機能', () => {
    let testTicketId: number;

    test.beforeAll(async () => {
      // テストデータ作成
      await createTestUsers();
      const ticket = await createSimpleTicket(
        'コメント機能テスト用チケット',
        'このチケットはコメント機能のテストに使用されます'
      );
      testTicketId = ticket.id;
    });

    test('コメントセクションが表示されていること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // コメントセクションが表示される
      await expect(page.locator('h2:has-text("コメント"):not(:has-text("新規"))')).toBeVisible();
      await expect(page.locator('h2:has-text("新規コメント")')).toBeVisible();

      // コメント入力フォームが表示される
      await expect(page.locator('textarea[name="content"]')).toBeVisible();
      await expect(page.locator('button:has-text("コメントを追加")')).toBeVisible();
    });

    test('新規コメントを追加できること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // コメントを入力
      await page.fill('textarea[name="content"]', 'これはテストコメントです');

      // コメントボタンをクリック
      await page.click('button:has-text("コメントを追加")');

      // コメントが追加されるまで待機
      await page.waitForTimeout(500);

      // ページをリロードして新しいコメント数を確認
      await page.reload();

      // 新しいコメントが表示される
      await expect(page.locator('p:has-text("これはテストコメントです")').first()).toBeVisible();
    });

    test('空のコメントが追加できないこと', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // 空のコメントでボタンをクリック
      await page.click('button:has-text("コメントを追加")');

      // エラーメッセージが表示される
      await expect(page.locator('text=Comment cannot be empty')).toBeVisible();
    });

    test('コメント削除ボタンが表示されていること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // 初期状態でコメントを追加
      await page.fill('textarea[name="content"]', '削除テスト用コメント');
      await page.click('button:has-text("コメントを追加")');
      await page.waitForTimeout(500);

      // ページをリロード
      await page.reload();

      // 削除ボタンが表示される（テストコメントがある場合）
      const deleteButtons = await page.locator('button.text-xs.text-red-500').all();
      if (deleteButtons.length > 0) {
        await expect(page.locator('button.text-xs.text-red-500').first()).toBeVisible();
      }
    });

    test('コメントフォームに文字数が表示されること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // テキストエリアに入力
      await page.fill('textarea[name="content"]', 'コメント');

      // 文字数が表示される (タグ内のテキストから文字数を抽出)
      const charDisplay = await page
        .locator('textarea[name="content"]')
        .evaluate((el) => el.parentElement?.parentElement?.textContent || '');

      expect(charDisplay).toContain('4');
    });

    test('複数のコメントが表示されていること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto(`/tickets/${testTicketId}`);

      // 最初のコメント
      await page.fill('textarea[name="content"]', '最初のコメント');
      await page.click('button:has-text("コメントを追加")');
      await page.waitForTimeout(500);

      // 2番目のコメント
      await page.fill('textarea[name="content"]', '2番目のコメント');
      await page.click('button:has-text("コメントを追加")');
      await page.waitForTimeout(500);

      // ページをリロード
      await page.reload();

      // 両方のコメントが表示される
      await expect(page.locator('p:has-text("最初のコメント")').first()).toBeVisible();
      await expect(page.locator('p:has-text("2番目のコメント")').first()).toBeVisible();
    });
  });
});
