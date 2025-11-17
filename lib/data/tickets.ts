import { Ticket, TicketStatus } from '@/types/ticket';

// Sample users for assignees
export const users = [
  { id: 'user1', name: '田中太郎', email: 'tanaka@example.com' },
  { id: 'user2', name: '佐藤花子', email: 'sato@example.com' },
  { id: 'user3', name: '鈴木次郎', email: 'suzuki@example.com' },
];

// Sample labels
export const labels = [
  { id: 'label1', name: 'バグ', color: 'red' },
  { id: 'label2', name: '機能', color: 'blue' },
  { id: 'label3', name: 'ドキュメント', color: 'green' },
  { id: 'label4', name: '緊急', color: 'orange' },
];

// In-memory ticket store
const tickets: Ticket[] = [
  {
    id: '1',
    title: 'ログイン機能のバグ修正',
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
    status: 'OPEN',
    priority: 'HIGH',
    labels: [labels[0], labels[3]],
    assigneeId: users[0].id,
    assignee: users[0],
    dueDate: new Date('2025-11-20'),
    comments: [],
    createdAt: new Date('2025-11-10'),
    updatedAt: new Date('2025-11-10'),
  },
  {
    id: '2',
    title: 'ダークモード機能の追加',
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
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    labels: [labels[1]],
    assigneeId: users[1].id,
    assignee: users[1],
    dueDate: new Date('2025-11-25'),
    comments: [],
    createdAt: new Date('2025-11-08'),
    updatedAt: new Date('2025-11-12'),
  },
  {
    id: '3',
    title: 'API ドキュメントの更新',
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
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    labels: [labels[2]],
    assigneeId: users[2].id,
    assignee: users[2],
    dueDate: new Date('2025-11-22'),
    comments: [],
    createdAt: new Date('2025-11-05'),
    updatedAt: new Date('2025-11-11'),
  },
  {
    id: '4',
    title: 'データベースクエリの最適化',
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
    status: 'OPEN',
    priority: 'HIGH',
    labels: [labels[1]],
    assigneeId: users[0].id,
    assignee: users[0],
    dueDate: new Date('2025-11-18'),
    comments: [],
    createdAt: new Date('2025-11-09'),
    updatedAt: new Date('2025-11-09'),
  },
  {
    id: '5',
    title: '認証モジュールのユニットテスト追加',
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
    status: 'OPEN',
    priority: 'MEDIUM',
    labels: [labels[1]],
    assigneeId: null,
    assignee: null,
    dueDate: new Date('2025-11-28'),
    comments: [],
    createdAt: new Date('2025-11-07'),
    updatedAt: new Date('2025-11-07'),
  },
  {
    id: '6',
    title: 'モバイル版レスポンシブレイアウトの修正',
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
    status: 'DONE',
    priority: 'MEDIUM',
    labels: [labels[0]],
    assigneeId: users[1].id,
    assignee: users[1],
    dueDate: new Date('2025-11-10'),
    comments: [],
    createdAt: new Date('2025-11-03'),
    updatedAt: new Date('2025-11-10'),
  },
  {
    id: '7',
    title: 'メール通知機能の実装',
    description: `## メール通知システムの実装

チケットの変更を通知するメール機能を実装してください。

### トリガーイベント
1. **ステータス変更** - チケットのステータスが変更された時
2. **コメント追加** - 新しいコメントが追加された時

### 通知受信者
- チケット作成者
- チケット担当者
- コメント作成者

### メール内容
- チケットタイトル
- 変更内容の概要
- リンク（ブラウザで開く）

### 実装例
\`\`\`javascript
async function sendNotification(ticketId, eventType) {
  const ticket = await getTicket(ticketId);
  await mailService.send(ticket.creator.email, generateTemplate(ticket));
}
\`\`\``,
    status: 'DONE',
    priority: 'LOW',
    labels: [labels[1]],
    assigneeId: users[2].id,
    assignee: users[2],
    dueDate: new Date('2025-11-15'),
    comments: [],
    createdAt: new Date('2025-10-28'),
    updatedAt: new Date('2025-11-09'),
  },
  {
    id: '8',
    title: 'ユーザーオンボーディングフローの作成',
    description: `## 新規ユーザーオンボーディング

ガイドツアー機能付きのウィザードを設計・実装してください。

### ステップ
1. **プロフィール設定** - 名前、写真、言語設定
2. **プロジェクト作成** - 最初のプロジェクトを作成
3. **チームメンバー追加** - チームメンバーの招待
4. **統合設定** - Slack、GitHub等との連携

### ガイドツアー要素
- 各ステップでのツールチップ
- スキップ機能
- 進捗インジケーター

### UXガイドライン
- 最大5分で完了
- モバイル対応
- アクセシビリティ対応`,
    status: 'OPEN',
    priority: 'MEDIUM',
    labels: [labels[1]],
    assigneeId: users[0].id,
    assignee: users[0],
    dueDate: new Date('2025-12-01'),
    comments: [],
    createdAt: new Date('2025-11-06'),
    updatedAt: new Date('2025-11-06'),
  },
  {
    id: '9',
    title: '検索機能の追加',
    description: `## フルテキスト検索の実装

チケット、コメント、ユーザープロフィール全体にわたるフルテキスト検索を実装してください。

### 検索対象
- **チケット** - タイトル、説明、コメント
- **ユーザー** - 名前、メールアドレス
- **ラベル** - ラベル名

### 検索フィルター
- \`type:ticket\` - チケットのみ検索
- \`type:user\` - ユーザーのみ検索
- \`status:OPEN\` - ステータスでフィルター
- \`assignee:@user\` - 担当者でフィルター

### パフォーマンス
- インデックス実装（Elasticsearch推奨）
- 検索レスポンス: <200ms

### ドキュメント
- [検索構文ガイド](https://example.com/search-guide)`,
    status: 'OPEN',
    priority: 'LOW',
    labels: [labels[1]],
    assigneeId: null,
    assignee: null,
    dueDate: new Date('2025-12-10'),
    comments: [],
    createdAt: new Date('2025-11-04'),
    updatedAt: new Date('2025-11-04'),
  },
  {
    id: '10',
    title: 'CI/CDパイプラインの構築',
    description: `## GitHub Actions の設定

自動テストと自動デプロイメント用の CI/CD パイプラインを構築してください。

### ワークフロー
\`\`\`
Push → Test → Build → Deploy
\`\`\`

### 実装項目
- **テスト実行** - \`npm test\` を自動実行
- **ビルド** - \`npm run build\` を実行
- **デプロイ** - main ブランチを本番環境へデプロイ

### ファイル
- 設定ファイル: \`.github/workflows/main.yml\`

### 参考資料
- [GitHub Actions Documentation](https://docs.github.com/en/actions)`,
    status: 'DONE',
    priority: 'HIGH',
    labels: [labels[1]],
    assigneeId: users[2].id,
    assignee: users[2],
    dueDate: new Date('2025-11-12'),
    comments: [],
    createdAt: new Date('2025-10-30'),
    updatedAt: new Date('2025-11-12'),
  },
];

export async function getTickets(): Promise<Ticket[]> {
  return tickets;
}

export async function getTicketById(id: string): Promise<Ticket | undefined> {
  return tickets.find((t) => t.id === id);
}

export async function getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
  return tickets.filter((t) => t.status === status);
}

export async function getTicketCount(): Promise<{
  OPEN: number;
  IN_PROGRESS: number;
  DONE: number;
}> {
  return {
    OPEN: tickets.filter((t) => t.status === 'OPEN').length,
    IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tickets.filter((t) => t.status === 'DONE').length,
  };
}

export async function getOverdueTickets(): Promise<Ticket[]> {
  const now = new Date();
  return tickets.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE');
}

export async function searchTickets(
  query: string,
  status?: TicketStatus,
  sortBy: string = 'created'
): Promise<Ticket[]> {
  let filtered = tickets;

  // ステータスでフィルター
  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }

  // 検索クエリで検索
  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery)
    );
  }

  // ソート
  const sorted = [...filtered];
  switch (sortBy) {
    case 'created-asc':
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'updated':
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'priority':
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    case 'created':
    default:
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return sorted;
}
