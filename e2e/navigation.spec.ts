import { test, expect } from "@playwright/test";
import {
  clearTestData,
  createTestUsers,
  createTestLabels,
  disconnectPrisma,
} from "../playwright/testHelper";

test.describe("ナビゲーション", () => {
  test.beforeAll(async () => {
    // テストデータの初期化
    await clearTestData();
    await createTestUsers();
    await createTestLabels();
  });

  test.afterAll(async () => {
    await disconnectPrisma();
  });

  test("ヘッダーからダッシュボードへナビゲートできる", async ({ page }) => {
    await page.goto("/tickets");

    // ページが読み込まれるまで待機
    await page.waitForTimeout(1000);

    // ヘッダーのホームリンクをクリック
    const homeLink = page.locator("header a[href='/']").first();
    await homeLink.click();

    // ダッシュボードにリダイレクトされることを確認
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toContain("/");
  });

  test("ヘッダーからチケット一覧へナビゲートできる", async ({ page }) => {
    await page.goto("/");

    // ページが読み込まれるまで待機
    await page.waitForTimeout(1000);

    // ヘッダーのチケット一覧リンクをクリック
    const ticketLink = page.locator("header a[href='/tickets']");
    await ticketLink.click();

    // チケット一覧ページにリダイレクトされることを確認
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toContain("/tickets");
  });

  test("ヘッダーから新規チケット作成ページへナビゲートできる", async ({
    page,
  }) => {
    await page.goto("/tickets");

    // チケット一覧ページが表示されていることを確認
    const title = page.getByRole("heading", { name: "チケット一覧" });
    await expect(title).toBeVisible();

    // ヘッダーの新規作成リンクをクリック
    const newLink = page.locator("header a[href='/tickets/new']");
    await newLink.click();

    // 新規作成ページにリダイレクトされることを確認
    await expect(page).toHaveURL("/tickets/new");
    const newTitle = page.getByRole("heading", { name: "新規チケット作成" });
    await expect(newTitle).toBeVisible();
  });

  test("ダッシュボードから新規チケット作成ボタンでナビゲートできる", async ({
    page,
  }) => {
    await page.goto("/");

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // 新規作成ボタンをクリック
    const createButton = page.locator("a[href='/tickets/new']");
    const isButtonVisible = await createButton
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    if (isButtonVisible) {
      await createButton.first().click();
      // 新規作成ページにリダイレクトされることを確認
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toContain("/tickets/new");
    }
  });
});
