# CLAUDE.md

このファイルは、Claude Code がこのリポジトリでコード作業をする際のガイダンスを提供します。

## プロジェクト概要

これは **Claude と現代的な Web 開発プラクティス** に焦点を当てた AI Workshop Series のワークショッププロジェクトです。完全に日本語ローカライズされており、包括的な E2E テストが含まれています。

**技術スタック：**

| カテゴリ              | 技術                   | バージョン     |
| --------------------- | ---------------------- | -------------- |
| **フレームワーク**    | Next.js (App Router)   | 16.0.3         |
| **言語**              | TypeScript             | 5              |
| **UI フレームワーク** | React + Heroicons      | 19.2.0 + 2.2.0 |
| **スタイリング**      | Tailwind CSS           | 4              |
| **データベース**      | SQLite + Prisma ORM    | 6.19.0         |
| **GraphQL**           | Apollo Server + Client | 5.1.0 + 3.12.3 |
| **テスト**            | Playwright (E2E)       | 1.56.1         |
| **コード品質**        | ESLint + Prettier      | 9 + 3.6.2      |

## 開発コマンド

### サーバー操作

```bash
npm run dev          # 開発サーバー起動（http://localhost:3000）
npm run build        # 本番用ビルド
npm run start        # ビルド済みアプリ起動（本番モード）
```

### コード品質

```bash
npm run format       # Prettier でコード整形（import sort + Tailwind 順序）
npm run format:check # フォーマット確認（修正なし）
npm run lint         # ESLint 実行
```

### E2E テスト（Playwright）

```bash
npm test                              # 全テスト実行（Chromium + Firefox）
npm run test:ui                       # UI モード（対話的実行）
npm run test:debug                    # デバッグモード（Inspector タブ）
npm test -- --project=chromium        # Chromium のみ
npm test -- --project=firefox         # Firefox のみ
npm test -- e2e/ticket-list.spec.ts   # 特定テストファイル実行
npx playwright show-report            # テストレポート表示
```

### データベース・Prisma

```bash
npm run prisma:migrate        # マイグレーション作成・実行
npm run prisma:seed           # シードスクリプト実行
npm run prisma:studio         # Prisma Studio GUI 起動
npx prisma generate           # Prisma Client 再生成
npx prisma migrate dev --name <name>  # 名前付きマイグレーション
```

### ClaudeCode IDE での自動整形

ClaudeCode IDE は Prettier を使用して自動的にコードを整形します（`.vscode/settings.json` で設定）：

- **デフォルトフォーマッター:** Prettier（`esbenp.prettier-vscode`）
- **保存時自動整形:** 有効（TypeScript, JavaScript, JSON, Markdown, CSS）
- **ペースト時自動整形:** 有効
- **プラグイン:** Import ソート + Tailwind CSS className 順序付け

セットアップ不要—ファイル保存時に自動で整形されます。

## コード操作戦略

### Serena シンボリックツールを優先

コード操作時は、汎用検索より **Serena MCP ツール** を優先します。セマンティック対応で効率的です：

**シンボリック操作（推奨）:**

- `find_symbol` - 関数・クラス・型を名前で検索
- `find_referencing_symbols` - シンボルの参照箇所を全て検索
- `get_symbols_overview` - ファイルの構造概要
- `replace_symbol_body` - 関数・クラス・メソッド本体全体を置換
- `insert_before_symbol` / `insert_after_symbol` - 特定位置にコード追加
- `rename_symbol` - シンボル全体をリネーム

**汎用ツール（必要時）:**

- `Glob` - ファイルパターンで検索
- `Grep` - テキスト内容で検索
- `Read` - ファイル内容を読む

### 操作ワークフロー例

**タスク:** チケット作成の検証ロジック追加

1. `find_symbol` で `lib/actions/tickets.ts` の `createTicket` 関数を検索
2. 関数本体を読んで現在の検証ロジックを理解
3. `replace_symbol_body` で検証ロジックを更新
4. `find_referencing_symbols` で影響範囲を確認
5. 保存時に自動整形

**非推奨:**

- 必要でない限りファイル全体を読む
- `find_symbol` で検索できるのに grep を繰り返す
- `replace_symbol_body` があるのに手動で文字列編集する

### Serena メモリで構造情報をキャッシュ

`.serena/memories/` には以下の情報があります：

- `codebase_structure.md` - ディレクトリレイアウトと層別アーキテクチャ
- `code_style_and_conventions.md` - フォーマットとインポートルール
- `suggested_commands.md` - 開発コマンド
- `project_overview.md` - 技術スタックと依存関係

変更前にこれらを参照してパターンと規約を理解してください。

## プロジェクトアーキテクチャ

### データフロー

チケット管理システムは、SQLite データベースと GraphQL API を組み合わせた階層型アーキテクチャを使用します：

1. **データベース層** (`prisma/`)：
   - SQLite + Prisma ORM
   - スキーマ: User、Ticket、Comment、Label、TicketLabel モデル
   - マイグレーション: バージョン管理されたスキーマ変更
   - シードスクリプト: サンプルデータ初期化

2. **データ層** (`lib/data/tickets.ts`)：
   - Prisma ベースのクエリ関数: `getTickets()`、`getTicketById()`、`searchTickets()` など
   - サーバーサイドデータ取得用の非同期関数
   - Server Components 向けの読み取り専用操作

3. **GraphQL 層** (`lib/graphql/`)：
   - **スキーマ** (`schema.ts`)：型定義（User、Ticket、Comment、Label）
   - **リゾルバー** (`resolvers.ts`)：Query・Mutation 実装
   - **エンドポイント** (`app/api/graphql/route.ts`)：Apollo Server 統合
   - フロントエンドまたは外部クライアント向けの代替 API アクセス

4. **アクション層** (`lib/actions/tickets.ts`)：
   - Server Actions（`'use server'` ディレクティブ）
   - Prisma を使用した CRUD 操作
   - フォームデータ処理
   - `revalidatePath()` によるキャッシュ再検証
   - `redirect()` によるミューテーション後のリダイレクト

5. **コンポーネント層** (`components/`)：
   - **UI コンポーネント** (`components/ui/`)：再利用可能なプリミティブ
   - **チケットコンポーネント** (`components/tickets/`)：ドメイン固有
   - **レイアウトコンポーネント** (`components/layout/`)：ナビゲーション・ページ構造

### 主要なアーキテクチャパターン

**デフォルトはサーバーコンポーネント**: すべてのコンポーネントはサーバーコンポーネントです。クライアント側操作が必要なときのみ `'use client'` を使用：

- ダッシュボード（ホーム）- 全クエリがサーバーサイド
- チケット一覧 - サーバーサイドデータ取得
- チケット詳細 - サーバーサイドレンダリング
- 編集フォーム - Server Actions が送信処理

**クライアントコンポーネント**: `'use client'` が必要な場合：

- ステータス変更ドロップダウン（ユーザー操作）
- コメントフォーム送信
- 入力状態を管理するフォームコンポーネント

**永続的データストレージ**: すべてのデータは Prisma ORM で管理される SQLite データベースに保存。マイグレーションによってバージョン管理されます。

### 型システム

すべての型は `types/ticket.ts` で定義：

- `Ticket`: メインエンティティ（CRUD 管理プロパティ）
- `TicketStatus`: `'OPEN' | 'IN_PROGRESS' | 'DONE'`
- `Priority`: `'LOW' | 'MEDIUM' | 'HIGH'`
- `User`、`Label`、`Comment`: サポートエンティティ

### 検証ルール

**チケット作成・更新時**:

- タイトル: 最小 3 文字
- 説明: 最小 10 文字
- 優先度: 指定なしの場合は 'MEDIUM'
- 担当者: 任意（null 可）
- 期限: 任意（null 可）

**コメント操作**:

- コンテンツ: 最小 2 文字

### キャッシュ再検証戦略

ミューテーション後、関連ルートのキャッシュを再検証：

```typescript
// updateTicket() の例
revalidatePath(`/tickets/${id}`); // 詳細ページ
revalidatePath('/tickets'); // 一覧ページ
revalidatePath('/'); // ダッシュボード
redirect(`/tickets/${id}`); // 詳細ページへ遷移
```

## テスト

### テストフレームワークの詳細

| 項目                   | 値                                     |
| ---------------------- | -------------------------------------- |
| **フレームワーク**     | Playwright 1.56.1                      |
| **テストディレクトリ** | `e2e/`（ページ別に整理）               |
| **ブラウザ**           | Chromium と Firefox                    |
| **設定ファイル**       | `playwright.config.ts`                 |
| **デバッグモード**     | `npm run test:debug` で Inspector 付き |
| **UI モード**          | `npm run test:ui` で対話的実行         |

### テストファイル構成

ページ別にテストを分割して管理性を向上：

| ファイル                    | テスト対象     | 主なテスト項目                                       |
| --------------------------- | -------------- | ---------------------------------------------------- |
| **dashboard.spec.ts**       | ダッシュボード | チケット数統計、最新チケット表示                     |
| **ticket-creation.spec.ts** | 新規作成       | フォーム入力、タイトル検証、説明検証                 |
| **ticket-detail.spec.ts**   | 詳細・編集     | 詳細表示、ステータス変更、コメント操作、編集フォーム |
| **ticket-list.spec.ts**     | 一覧・検索     | 一覧表示、検索、ステータスフィルター、ソート         |
| **navigation.spec.ts**      | ナビゲーション | ヘッダーナビゲーション、ページ遷移                   |

### テスト実行ガイド

```bash
# 全テスト実行（両ブラウザ）
npm test

# 特定ファイルのテスト
npm test -- e2e/dashboard.spec.ts

# 対話的 UI モード
npm run test:ui

# デバッグモード（Inspector で実行）
npm run test:debug

# レポート表示
npx playwright show-report
```

### テストファイルの命名規則と構造

**ファイル命名:** `[page-name].spec.ts`

**ファイル内のテスト構造:**

```typescript
test.describe('[ページ名]', () => {
  test.beforeEach(async ({ page }) => {
    // ページセットアップ（全テスト共通）
  });

  test.beforeAll(async () => {
    // テストデータ作成（describe ブロック実行前に 1 度だけ）
    // testHelper 関数を使用: createSimpleTicket()、createTestUsers() など
  });

  test('特定のテストケース', async ({ page }) => {
    // テスト実装
  });
});
```

### テストデータ管理

- **テストヘルパー:** `playwright/testHelper.ts` に配置
- **主要関数:**
  - `createTestUsers()` - テストユーザーを作成・取得
  - `createTestLabels()` - テストラベルを作成・取得
  - `createSimpleTicket()` - 基本チケット作成
  - `clearTestData()` - テストデータを全削除
- **テスト DB:** 各テスト実行時に独立した SQLite テストデータベース（`prisma/db/test.db`）を再作成
- **シード:** 最小限のシードデータ（ユーザー + ラベルのみ）

**重要:** 各テストファイルは必要なヘルパーのみインポート（未使用インポート警告回避）

### テストガイドライン（Playwright）

**Strict Mode 違反を避ける—常に具体的なセレクターを使用:**

```javascript
// ❌ 悪い例 - 複数要素にマッチ
page.locator('text=説明');

// ✅ 良い例 - 要素タイプ + テキスト
page.locator('h2:has-text("説明")');

// ✅ 良い例 - セマンティックロケーター
page.getByRole('heading', { name: '説明' });
page.getByRole('button', { name: 'ステータス変更' });
```

**ベストプラクティス:**

- セマンティックロケーター使用（`getByRole`、`getByLabel`、`getByText`）
- テキストが複数箇所に出現する場合は `:has-text()` 疑似セレクター使用
- 汎用テキストのみのロケーターを使用しない
- 成功と検証エラーの両方をテスト
- Chromium と Firefox の両ブラウザで動作確認

## ルート一覧

| ルート               | 説明                                 |
| -------------------- | ------------------------------------ |
| `/`                  | ダッシュボード（統計・最新チケット） |
| `/tickets`           | チケット一覧（フィルター・検索）     |
| `/tickets/new`       | チケット新規作成フォーム             |
| `/tickets/[id]`      | チケット詳細表示（コメント付き）     |
| `/tickets/[id]/edit` | チケット編集フォーム                 |

## よくある開発タスク

### 新しいデータベースフィールドを追加

1. `prisma/schema.prisma` でフィールド追加
2. マイグレーション作成: `npm run prisma:migrate`
3. 必要に応じて `lib/data/tickets.ts` のクエリ関数を更新
4. GraphQL で公開する場合は `lib/graphql/schema.ts` と `lib/graphql/resolvers.ts` を更新
5. ミュータブルなフィールドの場合は `lib/actions/tickets.ts` を更新

### 新機能を追加

**データ取得:** `lib/data/tickets.ts` にクエリ関数追加

```typescript
export async function getTicketsByLabel(labelId: string) {
  // Prisma クエリ
}
```

**ミューテーション:** `lib/actions/tickets.ts` に Server Action 追加

```typescript
'use server';
export async function updateTicketLabel(id: string, labelId: string) {
  // Prisma 更新 + revalidatePath
}
```

**GraphQL:** `lib/graphql/schema.ts` と `lib/graphql/resolvers.ts` を更新

**UI:** `components/tickets/` または `components/ui/` にコンポーネント作成

**テスト:** `e2e/` の対応するテストファイルを更新

### 開発用にデータベースをリセット

```bash
# ⚠️ 開発環境でのみ使用！
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

## 重要な注意事項

### 開発中の動作

- **自動リロード有効:** `npm run dev` 実行中はファイル変更時に自動リロード
- **メインエントリーポイント:** `app/page.tsx`（ダッシュボード）
- **Tailwind CSS スキャン:** `app/` ディレクトリ内の CSS クラスを自動検出
- **フォント最適化:** Next.js が自動で処理

### データベース

- **SQLite ファイル:** `prisma/dev.db`（サーバー再起動後も永続）
- **スキーマ変更:** すべてマイグレーション経由（`npm run prisma:migrate`）
- **シード:** マイグレーション後に `prisma/seed.ts` が実行される

### GraphQL

- **エンドポイント:** `http://localhost:3000/api/graphql`
- **IDE:** Apollo Sandbox が自動で起動（GraphQL クエリ・デバッグに使用可）

### テスト

- **自動 DB リセット:** テスト実行前に `prisma/db/test.db` を再作成
- **開発サーバー:** テスト実行時に自動で起動・停止
- **テストデータ:** `playwright/testHelper.ts` のヘルパーで管理

### Prisma v7 への移行に関する注意

```
warn: The configuration property `package.json#prisma` is deprecated...
```

この警告は **無害**です。`package.json` 内の `prisma.seed` プロパティは Prisma v7 では非推奨ですが、将来の完全移行時に `prisma.config.ts` への統合を予定しています。現在のところ、すべての機能は正常に動作します。
