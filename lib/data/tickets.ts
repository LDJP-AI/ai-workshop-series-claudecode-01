import { Ticket, TicketStatus } from '@/types/ticket';

// Sample users for assignees
const users = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com' },
  { id: 'user2', name: 'Alice Smith', email: 'alice@example.com' },
  { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com' },
];

// Sample labels
const labels = [
  { id: 'label1', name: 'bug', color: 'red' },
  { id: 'label2', name: 'feature', color: 'blue' },
  { id: 'label3', name: 'docs', color: 'green' },
  { id: 'label4', name: 'urgent', color: 'orange' },
];

// In-memory ticket store
const tickets: Ticket[] = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Users cannot login with email address. Returns 401 error when valid credentials are provided.',
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
    title: 'Add dark mode support',
    description: 'Implement dark mode theme toggle in settings. Use system preference as default.',
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
    title: 'Update API documentation',
    description: 'Add missing endpoints documentation and update examples for v2 API.',
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
    title: 'Optimize database queries',
    description: 'Profile and optimize slow queries in user dashboard. Target 50% performance improvement.',
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
    title: 'Add unit tests for auth module',
    description: 'Write comprehensive unit tests for authentication module. Target 80%+ coverage.',
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
    title: 'Fix responsive layout on mobile',
    description: 'Navigation menu breaks on screens smaller than 375px. Fix flexbox layout.',
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
    title: 'Implement email notifications',
    description: 'Send email notifications when ticket status changes or new comment is added.',
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
    title: 'Create user onboarding flow',
    description: 'Design and implement new user onboarding wizard with guided tours.',
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
    title: 'Add search functionality',
    description: 'Implement full-text search across tickets, comments, and user profiles.',
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
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
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
  return tickets.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE'
  );
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
    filtered = filtered.filter((t) =>
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
      sorted.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
      break;
    case 'created':
    default:
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return sorted;
}
