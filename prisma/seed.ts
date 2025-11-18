import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Check if running in test environment
const isTestEnv = process.env.NODE_ENV === "test";

async function main() {
  console.log("🌱 Seeding database...");
  if (isTestEnv) {
    console.log("📋 Running in TEST environment - using fixed IDs");
  }

  // Delete existing data
  await prisma.ticketLabel.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();

  // Create users with fixed IDs for testing
  const userData = isTestEnv
    ? [
        { id: 1, name: "田中太郎", email: "tanaka@example.com" },
        { id: 2, name: "佐藤花子", email: "sato@example.com" },
        { id: 3, name: "鈴木次郎", email: "suzuki@example.com" },
      ]
    : [
        { name: "田中太郎", email: "tanaka@example.com" },
        { name: "佐藤花子", email: "sato@example.com" },
        { name: "鈴木次郎", email: "suzuki@example.com" },
      ];

  const user1 = await prisma.user.create({
    data: userData[0],
  });

  const user2 = await prisma.user.create({
    data: userData[1],
  });

  const user3 = await prisma.user.create({
    data: userData[2],
  });

  // Create labels with fixed IDs for testing
  const labelData = isTestEnv
    ? [
        { id: 1, name: "バグ", color: "red" },
        { id: 2, name: "機能", color: "blue" },
        { id: 3, name: "ドキュメント", color: "green" },
        { id: 4, name: "緊急", color: "orange" },
      ]
    : [
        { name: "バグ", color: "red" },
        { name: "機能", color: "blue" },
        { name: "ドキュメント", color: "green" },
        { name: "緊急", color: "orange" },
      ];

  const labelBug = await prisma.label.create({
    data: labelData[0],
  });

  const labelFeature = await prisma.label.create({
    data: labelData[1],
  });

  const labelDoc = await prisma.label.create({
    data: labelData[2],
  });

  const labelUrgent = await prisma.label.create({
    data: labelData[3],
  });

  // Create tickets with fixed IDs for testing
  const ticket1Data = isTestEnv ? { id: 1 } : {};
  const ticket1 = await prisma.ticket.create({
    data: {
      ...ticket1Data,
      title: "ログイン機能のバグ修正",
      description: `## 問題の説明

メールアドレスでログインできない問題が発生しています。

### 現象
- 正しいユーザー認証情報を入力しても **401 Unauthorized** エラーが返される
- 発生確認日：2025年11月10日

### 期待される動作
- 有効な認証情報でログインできること
- セッションが正常に生成されること

### テスト手順
1. テストユーザーのメールアドレス \`test@example.com\` でログイン
2. 正しいパスワードを入力
3. ホームページへのリダイレクトを確認`,
      status: "OPEN",
      priority: "HIGH",
      assigneeId: user1.id,
      dueDate: new Date("2025-11-20"),
      labels: {
        create: [
          { labelId: labelBug.id },
          { labelId: labelUrgent.id },
        ],
      },
    },
  });

  const ticket2Data = isTestEnv ? { id: 2 } : {};
  const ticket2 = await prisma.ticket.create({
    data: {
      ...ticket2Data,
      title: "ダークモード機能の追加",
      description: `## 実装要件

設定画面にダークモードのテーマ切り替え機能を実装します。

### 機能
- [ ] ライト/ダークモード切り替えトグル
- [ ] ユーザーの設定を永続化
- [ ] システム設定を既定値として使用

### デザイン要件
- **ライトモード**: 現在のデフォルト配色
- **ダークモード**: \`#1a1a1a\` 背景、白いテキスト

### 参考リンク
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)`,
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      assigneeId: user2.id,
      dueDate: new Date("2025-11-25"),
      labels: {
        create: [{ labelId: labelFeature.id }],
      },
    },
  });

  const ticket3Data = isTestEnv ? { id: 3 } : {};
  const ticket3 = await prisma.ticket.create({
    data: {
      ...ticket3Data,
      title: "API ドキュメントの更新",
      description: `## ドキュメント更新内容

### 追加するエンドポイント
\`\`\`
GET /api/v2/tickets/{id}/comments
POST /api/v2/tickets/{id}/comments
DELETE /api/v2/comments/{id}
\`\`\`

### サンプルコード更新
v2 API用のサンプルコード（JavaScript、Python）を追加してください。

#### 例：JavaScript
\`\`\`javascript
const response = await fetch('https://api.example.com/v2/tickets/1');
const data = await response.json();
\`\`\`

### チェックリスト
- [ ] すべてのエンドポイントを記載
- [ ] 認証方法を説明
- [ ] レスポンス例を記載`,
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      assigneeId: user3.id,
      dueDate: new Date("2025-11-22"),
      labels: {
        create: [{ labelId: labelDoc.id }],
      },
    },
  });

  const ticket4Data = isTestEnv ? { id: 4 } : {};
  const ticket4 = await prisma.ticket.create({
    data: {
      ...ticket4Data,
      title: "データベースクエリの最適化",
      description: `## パフォーマンス改善タスク

ユーザーダッシュボードの遅いクエリをプロファイリングして最適化してください。

### 目標
**50%のパフォーマンス向上** を目指す

### 実施手順
1. **プロファイリング** - 遅いクエリを特定
2. **インデックス追加** - 必要なカラムにインデックスを追加
3. **クエリ最適化** - N+1問題を解決

### 成功基準
- ダッシュボード読み込み時間: \`2s → 1s以下\`
- クエリ実行時間: \`>500ms → <250ms\``,
      status: "OPEN",
      priority: "HIGH",
      assigneeId: user1.id,
      dueDate: new Date("2025-11-18"),
      labels: {
        create: [{ labelId: labelFeature.id }],
      },
    },
  });

  const ticket5Data = isTestEnv ? { id: 5 } : {};
  const ticket5 = await prisma.ticket.create({
    data: {
      ...ticket5Data,
      title: "認証モジュールのユニットテスト追加",
      description: `## テストカバレッジの拡張

認証モジュールの包括的なユニットテストを作成してください。

### 目標カバレッジ
**80%以上** を達成する

### テスト対象
- \`login()\` - ログイン処理
- \`logout()\` - ログアウト処理
- \`validateToken()\` - トークン検証
- \`refreshToken()\` - トークン更新

### テスティングツール
- フレームワーク: \`Jest\`
- アサーション: \`@testing-library/react\`

### 進捗
- [ ] ログイン処理のテスト
- [ ] ログアウト処理のテスト
- [ ] トークン検証のテスト`,
      status: "OPEN",
      priority: "MEDIUM",
      assigneeId: null,
      dueDate: new Date("2025-11-28"),
      labels: {
        create: [{ labelId: labelFeature.id }],
      },
    },
  });

  const ticket6Data = isTestEnv ? { id: 6 } : {};
  const ticket6 = await prisma.ticket.create({
    data: {
      ...ticket6Data,
      title: "モバイル版レスポンシブレイアウトの修正",
      description: `## レイアウトのバグ修正

### 問題
375px以下の画面サイズでナビゲーションメニューが崩れています。

### 原因推定
フレックスボックスのレイアウト設定に問題がある可能性があります。

### 修正方法
\`\`\`css
/* 修正前 */
.nav { display: flex; width: 100%; }

/* 修正後 */
.nav {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
}
\`\`\`

### テスト対象デバイス
- iPhone SE（375px）
- iPhone 12（390px）
- その他のスマートフォン`,
      status: "DONE",
      priority: "MEDIUM",
      assigneeId: user2.id,
      dueDate: new Date("2025-11-10"),
      labels: {
        create: [{ labelId: labelBug.id }],
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`
Created:
- 3 users
- 4 labels
- 6 tickets
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
