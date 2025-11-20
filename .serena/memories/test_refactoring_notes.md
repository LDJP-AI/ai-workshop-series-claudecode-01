# Test Refactoring: Data-Driven Testing (案1 実装済)

## 改善内容

### 実装した変更

1. **playwright/testHelper.ts作成**
   - `createTestUsers()` - テストユーザー作成（重複チェック機能付き）
   - `createTestLabels()` - テストラベル作成（重複チェック機能付き）
   - `createSimpleTicket()` - シンプルなテストチケット作成
   - `createTicketWithLabels()` - ラベル付きテストチケット作成
   - `createComment()` - テストコメント作成
   - `clearTestData()` - テストデータ完全削除

2. **seed.ts を最小限に更新**
   - ユーザーとラベルのみを seed で作成
   - テスト環境では余分なチケットデータを削除
   - 開発環境のシード処理は削除（オプション）

3. **e2e/ticket-crud.spec.tsを完全にリファクタリング**
   - 詳細テスト（チケット詳細、編集、一覧）で `test.beforeAll()` を使用
   - 各テストスイートで必要なテストデータを個別作成
   - 固定IDの依存を排除し、動的なテストチケットID使用

## テスト実行結果

- 43 テスト成功 (Chromium: 全成功、Firefox: 一部タイムアウト)
- タイムアウトの原因:
  - Firefox での要素ロード時間が長い
  - 複数テスト並行実行時のデータベース競合

## 改善のメリット

✅ テストの独立性向上 - テストを何度実行してもデータが蓄積しない
✅ テストの可読性向上 - 各テストで必要なデータが明確
✅ テストの拡張性向上 - 新規テスト追加時にカスタムデータが簡単に作成可能
✅ seed の責務明確化 - 基本的なマスタデータのみ（ユーザー、ラベル）

## 今後の改善案

- Firefox タイムアウト対策: `waitForLoadState('networkidle')`を追加
- データベース競合対策: test.beforeAll の同期制御
- テストスピード最適化: 不要な待機時間を削除
