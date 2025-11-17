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
    description:
      'メールアドレスでログインできない問題が発生しています。正しいユーザー認証情報を入力しても401エラーが返される状態です。',
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
    description:
      '設定画面にダークモードのテーマ切り替え機能を実装します。システム設定を既定値として使用してください。',
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
    description:
      '不足しているエンドポイントのドキュメント追加とv2 API用のサンプルコードを更新してください。',
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
    description:
      'ユーザーダッシュボードの遅いクエリをプロファイリングして最適化してください。50%のパフォーマンス向上を目標としています。',
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
    description:
      '認証モジュールの包括的なユニットテストを作成してください。カバレッジ80%以上を目標とします。',
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
    description:
      '375px以下の画面サイズでナビゲーションメニューが崩れています。フレックスボックスのレイアウトを修正してください。',
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
    description:
      'チケットのステータス変更またはコメント追加時にメール通知を送信する機能を実装してください。',
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
    description:
      'ガイドツアー機能付きの新規ユーザーオンボーディングウィザードを設計・実装してください。',
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
    description:
      'チケット、コメント、ユーザープロフィール全体にわたるフルテキスト検索を実装してください。',
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
    description: '自動テストと自動デプロイメント用の GitHub Actions を設定してください。',
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
