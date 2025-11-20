# AI Workshop Series - Ticket Management Application

このプロジェクトは、Claude Code ワークショップシリーズ用の **Next.js 16 チケット管理アプリケーション** です。TypeScript、Tailwind CSS、Prisma ORM、GraphQL を組み合わせた、フル機能の実例を提供します。

**言語**: 完全に日本語ローカライズ
**テスト**: Playwright による E2E テスト（32 テスト）

## 技術スタック

| カテゴリ           | 技術                          | バージョン     |
| ------------------ | ----------------------------- | -------------- |
| **フレームワーク** | Next.js                       | 16.0.3         |
| **言語**           | TypeScript                    | 5              |
| **UI Library**     | React + Heroicons             | 19.2.0 + 2.2.0 |
| **スタイリング**   | Tailwind CSS                  | 4              |
| **データベース**   | SQLite + Prisma ORM           | 6.19.0         |
| **GraphQL**        | Apollo Server + Apollo Client | 5.1.0 + 3.12.3 |
| **テスト**         | Playwright                    | 1.56.1         |
| **コード品質**     | ESLint + Prettier             | 9 + 3.6.2      |

## クイックスタート

最短で開発を始めるには、以下のコマンドを順番に実行してください：

```bash
# 1. 依存関係をインストール
npm ci

# 2. データベースをセットアップ（マイグレーション + シード）
npm run prisma:migrate
npm run prisma:seed

# 3. 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。ダッシュボードが表示されます。

## 詳細なセットアップ手順

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone https://github.com/LDJP-AI/ai-workshop-series-claudecode-01
cd ai-workshop-series-claudecode-01
npm ci
```

### 2. 環境変数の確認

`.env` ファイルが既に設定されています。必要に応じて編集してください：

```env
DATABASE_URL="file:./db/dev.db"
APOLLO_KEY=""
APOLLO_GRAPH_REF=""
```

**注**: ローカル開発では環境変数の変更は不要です。

### 3. データベースのセットアップ

#### マイグレーション（初回のみ）

Prisma スキーマをデータベースに反映します：

```bash
npm run prisma:migrate
```

**この手順で以下が実行されます：**

- SQLite データベース (`prisma/dev.db`) を作成
- スキーマに基づいてテーブルを作成
- Prisma Client を自動生成

#### サンプルデータのシード

チケット作成時のテスト用に初期データを投入します：

```bash
npm run prisma:seed
```

**シードされるデータ：**

| データタイプ | 数   | 説明                           |
| ------------ | ---- | ------------------------------ |
| ユーザー     | 3 人 | 田中太郎、佐藤花子、鈴木次郎   |
| ラベル       | 4 個 | バグ、機能、ドキュメント、緊急 |
| チケット     | 複数 | マークダウン形式の詳細説明付き |

### 4. 開発サーバーの起動と確認

```bash
npm run dev
```

以下の URL でアプリが利用可能になります：

| 用途                 | URL                               |
| -------------------- | --------------------------------- |
| **アプリケーション** | http://localhost:3000             |
| **GraphQL API**      | http://localhost:3000/api/graphql |

Apollo Sandbox が自動で起動し、GraphQL クエリをテストできます。

## データベース操作

### コマンドリファレンス

| コマンド                    | 説明                                   |
| --------------------------- | -------------------------------------- |
| `npm run prisma:migrate`    | マイグレーション作成・実行（開発環境） |
| `npm run prisma:seed`       | `prisma/seed.ts` でシード              |
| `npm run prisma:studio`     | Prisma Studio GUI を起動               |
| `npx prisma migrate deploy` | 既存マイグレーション適用（本番環境）   |
| `npx prisma generate`       | Prisma Client を再生成                 |

### Prisma Studio でのデータベース管理

GUI ベースのデータベース管理ツール：

```bash
npm run prisma:studio
```

ブラウザで GUI が起動し、データベースを視覚的に管理できます。

### スキーマの更新ワークフロー

**1. `prisma/schema.prisma` を編集**

新しいフィールドやモデルを追加します。

**2. マイグレーション作成・実行**

```bash
npm run prisma:migrate
# または名前を指定する場合：
npx prisma migrate dev --name add_new_field
```

**3. Prisma Client を再生成**

通常は自動で実行されますが、必要に応じて：

```bash
npx prisma generate
```

## GraphQL API

### GraphQL エンドポイント

```
POST http://localhost:3000/api/graphql
```

### 利用可能なクエリ

```graphql
# チケット一覧を取得
query GetTickets($filter: TicketFilterInput) {
  tickets(filter: $filter) {
    id
    title
    description
    status
    priority
    # その他のフィールド
  }
}

# ユーザー一覧を取得
query GetUsers {
  users {
    id
    name
    email
  }
}

# ラベル一覧を取得
query GetLabels {
  labels {
    id
    name
    color
  }
}
```

### 利用可能なミューテーション

```graphql
# チケット作成
mutation CreateTicket($input: CreateTicketInput!) {
  createTicket(input: $input) {
    id
    title
    description
    status
  }
}

# チケット更新
mutation UpdateTicket($id: String!, $input: UpdateTicketInput!) {
  updateTicket(id: $id, input: $input) {
    id
    title
  }
}

# チケット削除
mutation DeleteTicket($id: String!) {
  deleteTicket(id: $id)
}

# コメント追加
mutation AddComment($ticketId: String!, $content: String!, $userId: String!) {
  addComment(ticketId: $ticketId, content: $content, userId: $userId) {
    id
    content
    createdAt
  }
}
```

## 開発コマンド

### サーバー操作

| コマンド        | 説明                                      |
| --------------- | ----------------------------------------- |
| `npm run dev`   | 開発サーバー起動（http://localhost:3000） |
| `npm run build` | 本番用ビルド作成                          |
| `npm run start` | ビルド済みアプリを本番モードで実行        |

### コード品質

| コマンド               | 説明                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run lint`         | ESLint を実行                                         |
| `npm run format`       | Prettier でコード整形（import sort + Tailwind order） |
| `npm run format:check` | フォーマット確認（修正なし、CI/CD 向け）              |

### E2E テスト

| コマンド                                | 説明                                   |
| --------------------------------------- | -------------------------------------- |
| `npm test`                              | 全テスト実行（Chromium + Firefox）     |
| `npm run test:ui`                       | UI モード（対話的にテスト実行）        |
| `npm run test:debug`                    | デバッグモード（Inspector タブで実行） |
| `npm test -- --project=chromium`        | Chromium のみで実行                    |
| `npm test -- e2e/ticket-detail.spec.ts` | 特定のテストファイル実行               |
| `npx playwright show-report`            | テストレポート表示                     |

**テスト構成:**

- `e2e/dashboard.spec.ts` - ダッシュボード
- `e2e/ticket-list.spec.ts` - チケット一覧
- `e2e/ticket-creation.spec.ts` - チケット作成
- `e2e/ticket-detail.spec.ts` - チケット詳細・編集・コメント
- `e2e/navigation.spec.ts` - ナビゲーション

## プロジェクト構造

```
ai-workshop-series-claudecode-01/
│
├── 📂 app/                       # Next.js App Router ディレクトリ
│   ├── page.tsx                  # ダッシュボード (/)
│   ├── layout.tsx                # ルートレイアウト
│   ├── globals.css               # グローバルスタイル + Tailwind
│   ├── api/
│   │   └── graphql/route.ts      # GraphQL エンドポイント
│   └── tickets/                  # チケット管理ルート
│       ├── page.tsx              # チケット一覧 (/tickets)
│       ├── new/page.tsx          # 新規作成 (/tickets/new)
│       └── [id]/
│           ├── page.tsx          # 詳細表示 (/tickets/[id])
│           └── edit/page.tsx     # 編集 (/tickets/[id]/edit)
│
├── 📂 components/                # React コンポーネント
│   ├── ui/                       # UI プリミティブ
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── ...
│   ├── tickets/                  # ドメイン固有コンポーネント
│   │   ├── TicketForm.tsx
│   │   ├── TicketDetail.tsx
│   │   ├── TicketList.tsx
│   │   ├── TicketCard.tsx
│   │   ├── TicketComments.tsx
│   │   └── TicketStatusSelect.tsx
│   └── layout/
│       └── Header.tsx
│
├── 📂 lib/                       # ビジネスロジック
│   ├── data/tickets.ts           # Prisma ベースのデータ層（読み取り）
│   ├── actions/tickets.ts        # Server Actions（CRUD・キャッシュ無効化）
│   ├── prisma.ts                 # Prisma Client シングルトン
│   └── graphql/
│       ├── schema.ts             # GraphQL スキーマ定義
│       ├── resolvers.ts          # Query・Mutation リゾルバー
│       ├── queries.ts            # Apollo Client クエリ
│       └── server.ts             # Server 側 GraphQL 実行
│
├── 📂 prisma/                    # Prisma ORM
│   ├── schema.prisma             # データベーススキーマ
│   ├── seed.ts                   # シードスクリプト
│   ├── migrations/               # マイグレーション履歴
│   └── dev.db                    # SQLite データベース（開発環境）
│
├── 📂 e2e/                       # Playwright E2E テスト
│   ├── dashboard.spec.ts
│   ├── ticket-list.spec.ts
│   ├── ticket-creation.spec.ts
│   ├── ticket-detail.spec.ts
│   ├── navigation.spec.ts
│   └── ...
│
├── 📂 playwright/                # テスト設定・ユーティリティ
│   ├── testHelper.ts             # テスト用ヘルパー関数
│   └── globalSetup.ts            # テスト前初期化
│
├── 📂 types/                     # TypeScript 型定義
│   └── ticket.ts                 # チケットドメイン型
│
├── 📂 public/                    # 静的アセット
│   ├── favicon.ico
│   └── ...
│
├── 📂 .vscode/                   # VSCode 設定
│   ├── settings.json             # エディタ設定（自動整形）
│   └── extensions.json           # 推奨拡張機能
│
├── 🔧 設定ファイル
│   ├── .env                      # 環境変数
│   ├── .env.example              # 環境変数テンプレート
│   ├── .prettierrc                # Prettier 設定
│   ├── .prettierignore            # Prettier 除外ファイル
│   ├── .eslintrc.json            # ESLint 設定
│   ├── next.config.ts            # Next.js 設定
│   ├── tsconfig.json             # TypeScript 設定
│   ├── playwright.config.ts      # Playwright 設定
│   ├── postcss.config.mjs        # PostCSS 設定
│   ├── package.json              # npm スクリプト・依存関係
│   └── CLAUDE.md                 # Claude Code ガイダンス
│
└── 📄 README.md                  # このファイル
```

## データベーススキーマ

### User テーブル

チケットの担当者とコメント作成者を管理します。

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  tickets   Ticket[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Ticket テーブル

チケット情報を管理します。

```prisma
model Ticket {
  id          String        @id @default(cuid())
  title       String
  description String
  status      Status        @default(OPEN)
  priority    Priority      @default(MEDIUM)
  assigneeId  String?
  assignee    User?         @relation(fields: [assigneeId], references: [id])
  labels      TicketLabel[]
  comments    Comment[]
  dueDate     DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum Status {
  OPEN
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

### Label テーブル

チケットのラベルを管理します。

```prisma
model Label {
  id        String        @id @default(cuid())
  name      String        @unique
  color     String
  tickets   TicketLabel[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}
```

### Comment テーブル

チケットへのコメントを管理します。

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## よくある警告

### Prisma 設定警告

```
warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7.
```

**原因**: Prisma v7 では `package.json` の `prisma` プロパティが非推奨になりました

**現在の対応**: package.json 内に seed 設定を保持していますが、Prisma v7 への完全移行時は `prisma.config.ts` ファイルを使用する必要があります

**対応方法（将来）**:

```typescript
// prisma.config.ts の例
export default {
  seed: 'tsx prisma/seed.ts',
};
```

現在はこの警告は無害で、すべての機能は正常に動作します。

## トラブルシューティング

### データベース関連のエラー

**エラー: `PrismaClientKnownRequestError: The table does not exist`**

マイグレーションが実行されていません。

```bash
npm run prisma:migrate
npm run prisma:seed
```

**エラー: `ENOENT: no such file or directory, open 'prisma/dev.db'`**

データベースファイルが存在しません。

```bash
npm run prisma:migrate
```

### データベースのリセット

開発中にデータベースをクリアしたい場合：

```bash
# ⚠️ 開発環境でのみ使用！
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

このコマンドでデータベースが再作成され、シードデータが投入されます。

### テストの問題

**テストが失敗する場合**

テスト実行前に自動的にデータベースがリセットされます。

```bash
# 全テスト再実行
npm test

# 特定のテストを実行
npm test -- e2e/dashboard.spec.ts
```

**テストをデバッグする**

```bash
npm run test:debug
```

Inspector タブでステップスルー実行できます。

**テストレポートを確認**

```bash
npx playwright show-report
```

## よくある質問（FAQ）

### Q: データベーススキーマを変更したい場合は？

A: `prisma/schema.prisma` を編集してから、マイグレーションを作成してください：

```bash
# schema.prisma を編集後、実行
npm run prisma:migrate
```

マイグレーション名を指定する場合：

```bash
npx prisma migrate dev --name add_new_field
```

### Q: GraphQL API をテストするには？

A: 開発サーバー起動後、以下の URL にアクセスしてください：

```
http://localhost:3000/api/graphql
```

Apollo Sandbox が自動で起動し、クエリやミューテーションをテストできます。

**例:**

```graphql
query GetTickets {
  tickets {
    id
    title
    status
    priority
  }
}
```

### Q: 新しいユーザーやラベルを追加したい

A: Prisma Studio GUI を使用できます：

```bash
npm run prisma:studio
```

ブラウザで GUI が起動し、ユーザーやラベルを直接追加できます。

### Q: コードを修正したが IDE に反映されない

A: 自動整形が有効です。ファイル保存時に自動で整形されます。手動で整形したい場合：

```bash
npm run format
```

### Q: ESLint エラーが表示される

A: ESLint を実行して確認してください：

```bash
npm run lint
```

## アーキテクチャの特徴

### サーバーコンポーネント優先

すべてのコンポーネントはデフォルトでサーバーコンポーネントです。クライアント側の処理が必要な場合のみ `'use client'` を使用します。

### キャッシュ無効化戦略

Server Actions で `revalidatePath()` を使用し、Prisma 変更後にキャッシュを無効化します：

```typescript
// チケット更新後、関連ページのキャッシュを無効化
revalidatePath(`/tickets/${id}`); // 詳細ページ
revalidatePath('/tickets'); // 一覧ページ
revalidatePath('/'); // ダッシュボード
```

### GraphQL と Server Actions の併用

両方のアクセス方法をサポート：

- **GraphQL**: `/api/graphql` エンドポイント（Apollo Server）
- **Server Actions**: `'use server'` で Server Components から直接呼び出し

## 今後の改善予定

- [ ] ユーザー認証の実装
- [ ] リアルタイム通知機能（WebSocket）
- [ ] チケット変更履歴のトラッキング
- [ ] 複数チーム・ワークスペース対応
- [ ] 高度なレポート・分析機能
- [ ] Prisma v7 への完全移行

## 参考資料

### 公式ドキュメント

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [React サーバーコンポーネント](https://react.dev/reference/rsc/use-client)
- [Prisma ORM](https://www.prisma.io/docs)
- [Apollo GraphQL](https://www.apollographql.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright テスティング](https://playwright.dev)

### このプロジェクトで学べること

- Next.js 16 App Router での最新のプラクティス
- TypeScript + React Server Components
- Prisma を使用したデータベース操作
- GraphQL スキーマ設計と実装
- Playwright による E2E テスト
- Tailwind CSS による効率的なスタイリング

## ライセンス

MIT

## 開発に参加する場合

1. フィーチャーブランチを作成: `git checkout -b feature/your-feature`
2. 変更をコミット: `git commit -m "feat: description"`
3. コードを整形: `npm run format`
4. ESLint で確認: `npm run lint`
5. テスト実行: `npm test`
6. プルリクエストを作成

---

**最後に**: このプロジェクトは学習目的のため、問題が発生した場合は遠慮なく Issue を作成してください。
