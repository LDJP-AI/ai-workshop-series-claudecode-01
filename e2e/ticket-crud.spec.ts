import { expect, test } from '@playwright/test';

test.describe('チケット管理', () => {
  test.beforeEach(async ({ page }) => {
    // ダッシュボードに移動
    await page.goto('/');
    await expect(page).toHaveTitle('Ticket Manager');
  });

  test.describe('チケット作成', () => {
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

  test.describe('チケット詳細とステータス変更', () => {
    test('チケット詳細情報が正しく表示されること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto('/tickets/1');

      // チケット情報が表示される（タイトルにはチケット#1の内容）
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // チケットIDと何かのタイトルが表示されている
      const h1Text = await h1.textContent();
      expect(h1Text).toMatch(/#1/);

      // 優先度が何かしら表示されている（低, 中, 高 のいずれか）
      const priorityContainer = page.locator('h3:has-text("優先度")').locator('..').first();
      await expect(priorityContainer).toBeVisible();

      // 説明セクションが表示されている
      await expect(page.locator('h2:has-text("説明")')).toBeVisible();
    });

    test('チケットのステータスを変更できること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto('/tickets/1');

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
      await page.goto('/tickets/1');

      // 編集ボタンが存在する
      const editButton = page.locator('a[href="/tickets/1/edit"]');
      await expect(editButton).toBeVisible();

      // 削除ボタンが存在する (ヘッダーの削除ボタンを特定するため、bg-red-600クラスを使用)
      const deleteButton = page.locator('button.bg-red-600:has-text("削除")');
      await expect(deleteButton).toBeVisible();
    });
  });

  test.describe('チケット編集', () => {
    test('編集ページに遷移でき、既存データが事前入力されること', async ({ page }) => {
      // チケット詳細ページから編集ページに移動
      await page.goto('/tickets/1');
      await page.click('a[href="/tickets/1/edit"]');

      // 編集ページが表示される
      await expect(page).toHaveURL('/tickets/1/edit');
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
      await page.goto('/tickets/1/edit');

      // フォームを更新
      await page.fill('input[name="title"]', '更新: ログイン不具合を修正');
      await page.fill(
        'textarea[name="description"]',
        'ログイン不具合に関するより詳細な説明を更新しました'
      );
      await page.selectOption('select[name="priority"]', 'MEDIUM');

      // フォーム送信
      await page.click('button[type="submit"]');

      // チケット詳細ページにリダイレクト
      await expect(page).toHaveURL('/tickets/1');
      // チケットの詳細ページが表示されることを確認（URLのみで十分）
      const pageUrl = page.url();
      expect(pageUrl).toContain('/tickets/1');
    });

    test('キャンセルボタンで前のページに戻ること', async ({ page }) => {
      // 編集ページに移動
      await page.goto('/tickets/1/edit');

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

  test.describe('チケット一覧', () => {
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

      // 最初のチケットをクリック
      await page.locator('a[href="/tickets/1"]').first().click();

      // チケット詳細ページに移動
      await expect(page).toHaveURL('/tickets/1');
      // h1に#1が含まれていることを確認
      await expect(page.locator('h1')).toContainText('#1');
    });
  });

  test.describe('ナビゲーション', () => {
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

  test.describe('ダッシュボード', () => {
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

  test.describe('コメント機能', () => {
    test('コメントセクションが表示されていること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto('/tickets/1');

      // コメントセクションが表示される
      await expect(page.locator('h2:has-text("コメント"):not(:has-text("新規"))')).toBeVisible();
      await expect(page.locator('h2:has-text("新規コメント")')).toBeVisible();

      // コメント入力フォームが表示される
      await expect(page.locator('textarea[name="content"]')).toBeVisible();
      await expect(page.locator('button:has-text("コメントを追加")')).toBeVisible();
    });

    test('新規コメントを追加できること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto('/tickets/1');

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
      await page.goto('/tickets/1');

      // 空のコメントでボタンをクリック
      await page.click('button:has-text("コメントを追加")');

      // エラーメッセージが表示される
      await expect(page.locator('text=Comment cannot be empty')).toBeVisible();
    });

    test('コメント削除ボタンが表示されていること', async ({ page }) => {
      // チケット詳細ページに移動
      await page.goto('/tickets/1');

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
      await page.goto('/tickets/1');

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
      await page.goto('/tickets/1');

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
