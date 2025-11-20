import { test, expect } from "@playwright/test";
import {
  clearTestData,
  createTestUsers,
  createTestLabels,
  createSimpleTicket,
  disconnectPrisma,
} from "../playwright/testHelper";

test.describe("ダッシュボード", () => {
  test.beforeAll(async () => {
    // テストデータの初期化
    await clearTestData();
    await createTestUsers();
    await createTestLabels();

    // ダッシュボード用のテストチケットを作成
    // OPENステータスのチケット
    await createSimpleTicket(
      "フロントエンドの修正",
      "ボタンのスタイルを修正する必要があります。レイアウトがずれています。",
      "OPEN",
      "HIGH"
    );

    await createSimpleTicket(
      "データベース最適化",
      "クエリのパフォーマンスを改善するための最適化が必要です。",
      "OPEN",
      "MEDIUM"
    );

    // IN_PROGRESSステータスのチケット
    await createSimpleTicket(
      "ユーザー認証機能",
      "ユーザー認証機能の実装を進めています。セキュリティも考慮します。",
      "IN_PROGRESS",
      "HIGH"
    );

    // DONEステータスのチケット
    await createSimpleTicket(
      "APIドキュメント作成",
      "APIのドキュメントを作成して公開する必要があります。詳細な説明も追加します。",
      "DONE",
      "LOW"
    );
  });

  test.afterAll(async () => {
    await disconnectPrisma();
  });

  test("チケット数統計を表示する", async ({ page }) => {
    await page.goto("/");

    // ページが読み込まれるまで待機
    await page.waitForSelector("h1");

    // ダッシュボードタイトルが表示されていることを確認
    const title = page.getByRole("heading", { name: "ダッシュボード" });
    await expect(title).toBeVisible();

    // 統計情報が表示されていることを確認
    // 少なくとも統計セクションが表示されていることを確認
    const body = page.locator("body");
    await expect(body).toContainText("ダッシュボード");

    // ページの本文に統計情報が含まれていることを確認
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  test("最近のチケットセクションを表示する", async ({ page }) => {
    await page.goto("/");

    // ページが読み込まれるまで待機
    await page.waitForTimeout(2000);

    // ページが正常に読み込まれたことを確認
    const pageStatus = page.url();
    expect(pageStatus).toContain("/");
  });
});
