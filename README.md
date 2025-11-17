# AI Workshop Series - Ticket Management Application

このプロジェクトは、Next.js 16、TypeScript、Tailwind CSS、Prisma、GraphQL を使用したフル機能のチケット管理アプリケーションです。

## 技術スタック

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Library**: React 19.2.0 + Heroicons
- **Database**: SQLite + Prisma ORM v6.19.0
- **GraphQL**: Apollo Server v5.1.0 + Apollo Client v3.12.3
- **Testing**: Playwright 1.56.1 (E2E)
- **Linting**: ESLint 9
- **Formatting**: Prettier 3 (Tailwind CSS + Import Sort プラグイン)

## 初期セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルが既に設定されていることを確認してください:

```env
DATABASE_URL="file:./prisma/dev.db"
APOLLO_KEY=""
APOLLO_GRAPH_REF=""
```

### 3. データベースのマイグレーション

Prisma スキーマをデータベースに適用します:

```bash
npm run prisma:migrate
```

**初回実行時の動作:**
- SQLite データベース (`prisma/dev.db`) を作成
- スキーマに基づいてテーブルを作成
- Prisma Client を自動生成

### 4. サンプルデータのシード

データベースに初期データ (ユーザー、ラベル、チケット) を投入します:

```bash
npm run prisma:seed
```

**シードされるデータ:**
- 3 人のユーザー (田中太郎、佐藤花子、鈴木次郎)
- 4 つのラベル (バグ、機能、ドキュメント、緊急)
- 6 つのサンプルチケット (マークダウン形式の詳細説明付き)

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## データベース操作

### マイグレーション関連コマンド

| コマンド | 説明 |
|---------|------|
| `npm run prisma:migrate` | 新規マイグレーションを作成して実行 |
| `npx prisma migrate deploy` | 既存マイグレーションを適用 |
| `npx prisma db seed` | サンプルデータをシード |
| `npx prisma studio` | Prisma Studio (GUI) を起動 |
| `npx prisma generate` | Prisma Client を再生成 |

### Prisma Studio でのデータベース確認

GUI ベースのデータベース管理ツールを起動:

```bash
npx prisma studio
```

### スキーマの更新

`prisma/schema.prisma` を編集後、新規マイグレーションを作成:

```bash
npx prisma migrate dev --name <migration_name>
```

例:
```bash
npx prisma migrate dev --name add_status_field
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

### コード品質

```bash
# ESLint を実行
npm run lint

# コードをフォーマット (Prettier + Tailwind CSS + Import Sort)
npm run format

# フォーマットチェック (修正せず)
npm run format:check
```

### テスト

```bash
# E2E テストを実行 (Chromium + Firefox)
npm test

# テストを UI モードで実行 (対話的)
npm run test:ui

# テストをデバッグモードで実行
npm run test:debug

# 特定のブラウザでテストを実行
npm test -- --project=chromium
npm test -- --project=firefox

# 特定のテストファイルを実行
npm test -- e2e/ticket-crud.spec.ts

# テストレポートを表示
npx playwright show-report
```

### ビルド

```bash
# 本番用ビルドを作成
npm run build

# ビルドをローカルで実行
npm start
```

## プロジェクト構造

```
.
├── app/                          # Next.js アプリケーション
│   ├── page.tsx                 # ダッシュボード (ホーム)
│   ├── layout.tsx               # ルートレイアウト
│   ├── providers.tsx            # Apollo Provider ラッパー
│   ├── api/graphql/route.ts    # GraphQL エンドポイント
│   └── tickets/                 # チケット関連ページ
│       ├── page.tsx             # チケット一覧
│       ├── [id]/page.tsx        # チケット詳細
│       ├── [id]/edit/page.tsx  # チケット編集
│       └── new/page.tsx         # チケット作成
│
├── components/                   # React コンポーネント
│   ├── ui/                      # UI プリミティブ
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── tickets/                 # ドメイン固有コンポーネント
│   │   ├── TicketForm.tsx
│   │   ├── TicketDetail.tsx
│   │   ├── TicketList.tsx
│   │   ├── TicketCard.tsx
│   │   ├── TicketComments.tsx
│   │   └── TicketStatusSelect.tsx
│   └── layout/
│       └── Header.tsx
│
├── lib/                          # ユーティリティと設定
│   ├── data/tickets.ts          # Prisma ベースのデータ層
│   ├── actions/tickets.ts       # Server Actions (CRUD)
│   ├── prisma.ts                # Prisma Client シングルトン
│   └── graphql/
│       ├── schema.ts            # GraphQL スキーマ定義
│       ├── resolvers.ts         # Query と Mutation レゾルバー
│       ├── queries.ts           # Apollo Client クエリ
│       └── server.ts            # Server 側 GraphQL 実行
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma            # データベーススキーマ
│   ├── seed.ts                  # データベースシード
│   ├── migrations/              # マイグレーション履歴
│   └── dev.db                   # SQLite データベース
│
├── e2e/                          # Playwright E2E テスト
│   └── ticket-crud.spec.ts      # チケット CRUD テスト
│
├── types/                        # TypeScript 型定義
│   └── ticket.ts                # チケット関連の型
│
├── playwright/
│   └── globalSetup.ts           # テスト前の DB リセット
│
├── .env                          # 環境変数
├── .prettierrc                   # Prettier 設定
├── .eslintrc.json               # ESLint 設定
├── playwright.config.ts         # Playwright 設定
└── tsconfig.json                # TypeScript 設定
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
  seed: "tsx prisma/seed.ts",
};
```

現在はこの警告は無害で、すべての機能は正常に動作します。

## トラブルシューティング

### データベース関連の問題

#### エラー: `PrismaClientKnownRequestError: The table 'main.TicketLabel' does not exist`

**原因**: マイグレーションが実行されていない

**解決方法**:
```bash
npm run prisma:migrate
npm run prisma:seed
```

#### エラー: `ENOENT: no such file or directory, open 'prisma/dev.db'`

**原因**: データベースファイルが存在しない

**解決方法**:
```bash
npm run prisma:migrate
```

#### データベースをリセットしたい

```bash
# 開発環境でのみ使用！
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

### テスト関連の問題

#### テストが失敗する場合

テスト実行時に自動的にデータベースがリセットされます。

```bash
# テストを再度実行
npm test
```

#### 特定のテストをデバッグ

```bash
npm run test:debug
# Inspector タブでステップスルー実行
```

## よくある質問

### Q: データベースを変更したい場合は？

A: `prisma/schema.prisma` を編集して新規マイグレーションを作成してください:

```bash
npx prisma migrate dev --name <description>
```

### Q: GraphQL API をテストするには？

A: 開発サーバー起動後、以下の URL にアクセス:

```
http://localhost:3000/api/graphql
```

Apollo Sandbox が起動し、クエリやミューテーションをテストできます。

### Q: 新しいユーザーやラベルを追加するには？

A: Prisma Studio を使用:

```bash
npx prisma studio
```

GUI から直接データを追加できます。

## 今後の改善予定

- [ ] ユーザー認証の実装
- [ ] リアルタイム通知機能
- [ ] チケットの履歴トラッキング
- [ ] 複数チームサポート
- [ ] 高度なレポート機能

## ライセンス

MIT

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Apollo GraphQL ドキュメント](https://www.apollographql.com/docs)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Playwright ドキュメント](https://playwright.dev)
