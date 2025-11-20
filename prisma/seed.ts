import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Check if running in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

async function main() {
  console.log('🌱 Seeding database...');
  if (isTestEnv) {
    console.log('📋 Running in TEST environment - seeding base data only');
  }

  // Delete existing data
  await prisma.ticketLabel.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();

  // Create users with fixed IDs for testing
  const userData = [
    { name: '田中太郎', email: 'tanaka@example.com' },
    { name: '佐藤花子', email: 'sato@example.com' },
    { name: '鈴木次郎', email: 'suzuki@example.com' },
  ];

  for (const user of userData) {
    await prisma.user.create({ data: user });
  }

  // Create labels with fixed IDs for testing
  const labelData = [
    { name: 'バグ', color: 'red' },
    { name: '機能', color: 'blue' },
    { name: 'ドキュメント', color: 'green' },
    { name: '緊急', color: 'orange' },
  ];

  for (const label of labelData) {
    await prisma.label.create({ data: label });
  }

  if (isTestEnv) {
    console.log('✅ Test database seeded successfully!');
  } else {
    // Create sample tickets for development environment
    const users = await prisma.user.findMany();
    const labels = await prisma.label.findMany();

    const sampleTickets = [
      {
        title: 'ログイン機能のバグ修正',
        description: `## 問題の説明
ユーザーがログイン画面で認証情報を入力した際、エラーメッセージが表示される場合があります。

## 再現手順
1. ログイン画面にアクセス
2. 有効な認証情報を入力
3. 「ログイン」ボタンをクリック

## 期待される動作
ダッシュボード画面にリダイレクトされるべき

## 現在の動作
\`Error: Authentication failed\` というエラーが表示される`,
        status: 'OPEN' as const,
        priority: 'HIGH' as const,
        assigneeId: users[0]?.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        labelIds: [labels[0]?.id].filter(Boolean),
      },
      {
        title: 'ダッシュボードのUI改善',
        description: `## 要件
ダッシュボードの統計情報をより視認しやすくする必要があります。

## 実装内容
- 統計情報のカードをより大きく表示
- アイコンを追加して視認性を向上
- 色分けを追加

## デザイン案
\`\`\`
チケット総数: 青
完了数: 緑
実行中: オレンジ
\`\`\``,
        status: 'IN_PROGRESS' as const,
        priority: 'MEDIUM' as const,
        assigneeId: users[1]?.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        labelIds: labels.slice(1, 2).map((l) => l.id),
      },
      {
        title: 'チケット検索機能の実装',
        description: `## 要件
ユーザーが大量のチケットの中から効率的に目的のチケットを探せるよう、検索機能を実装する。

## 実装仕様
- キーワード検索（タイトルと説明文）
- ステータスフィルタ
- 優先度フィルタ
- 担当者フィルタ

## 検索条件の組み合わせ
複数の条件を同時に適用可能にする`,
        status: 'OPEN' as const,
        priority: 'MEDIUM' as const,
        assigneeId: users[2]?.id,
        labelIds: labels.slice(1, 2).map((l) => l.id),
      },
      {
        title: 'データベーススキーマのドキュメント作成',
        description: `## ドキュメント対象
- User テーブル
- Ticket テーブル
- Comment テーブル
- Label テーブル
- TicketLabel テーブル

## 記載内容
- 各テーブルの概要
- カラム一覧と型
- リレーションシップ図
- 制約条件`,
        status: 'DONE' as const,
        priority: 'LOW' as const,
        assigneeId: users[0]?.id,
        labelIds: labels.slice(2, 3).map((l) => l.id),
      },
      {
        title: 'エラーハンドリングの改善',
        description: `## 現在の問題
API エラーが発生した際、ユーザーへの通知が不十分です。

## 改善案
- エラーメッセージをより詳細に
- エラー発生時のログ出力を強化
- ユーザーへの対応方法を提示

## 影響を受けるエンドポイント
- POST /api/tickets
- PUT /api/tickets/:id
- DELETE /api/tickets/:id`,
        status: 'IN_PROGRESS' as const,
        priority: 'HIGH' as const,
        assigneeId: users[1]?.id,
        labelIds: [labels[0]?.id].filter(Boolean),
      },
    ];

    // Create tickets and comments
    for (const ticketData of sampleTickets) {
      const { labelIds, ...ticketCreateData } = ticketData;
      const ticket = await prisma.ticket.create({
        data: ticketCreateData,
      });

      // Add labels to ticket
      if (labelIds && labelIds.length > 0) {
        for (const labelId of labelIds) {
          await prisma.ticketLabel.create({
            data: {
              ticketId: ticket.id,
              labelId: labelId,
            },
          });
        }
      }

      // Add sample comments
      const commentTexts = [
        '確認しました。調査を進めます。',
        '対応が完了しました。テストをお願いします。',
        'レビューを完了しました。本番環境への反映をお願いします。',
        '追加の情報が必要です。詳しく教えていただけますか？',
        'ありがとうございました。対応に感謝します。',
      ];

      const shuffled = commentTexts
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);

      for (const commentText of shuffled) {
        await prisma.comment.create({
          data: {
            content: commentText,
            ticketId: ticket.id,
            userId: users[Math.floor(Math.random() * users.length)].id,
          },
        });
      }
    }

    console.log('✅ Development database seeded successfully with sample tickets and comments!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
