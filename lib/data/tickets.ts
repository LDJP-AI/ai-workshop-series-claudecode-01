import prisma from '@/lib/prisma';

// Fetch all tickets from database
export async function getTickets() {
  return prisma.ticket.findMany({
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Fetch single ticket by ID
export async function getTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

// Fetch tickets by status
export async function getTicketsByStatus(status: string) {
  return prisma.ticket.findMany({
    where: { status: status as 'OPEN' | 'IN_PROGRESS' | 'DONE' },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Search tickets
export async function searchTickets(query: string, status?: string, sort?: string) {
  // ステータスフィルターの設定
  const statusFilter = status && status !== 'ALL' ? { status: status as any } : {};

  // ソートの設定（優先度以外）
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'created-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'updated') {
    orderBy = { updatedAt: 'desc' };
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [{ title: { contains: query } }, { description: { contains: query } }],
            }
          : {},
        statusFilter,
      ],
    },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: sort === 'priority' ? { createdAt: 'desc' } : orderBy,
  });

  // 優先度順のソート（アプリケーション層）
  if (sort === 'priority') {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return tickets.sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      // 優先度が同じ場合は作成日順（新しい順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  return tickets;
}

// Get ticket count by status
export async function getTicketCount() {
  const [openCount, inProgressCount, doneCount] = await Promise.all([
    prisma.ticket.count({ where: { status: 'OPEN' } }),
    prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.ticket.count({ where: { status: 'DONE' } }),
  ]);

  return {
    OPEN: openCount,
    IN_PROGRESS: inProgressCount,
    DONE: doneCount,
  };
}

// Get overdue tickets (due date has passed and not done)
export async function getOverdueTickets() {
  const now = new Date();
  return prisma.ticket.findMany({
    where: {
      dueDate: {
        lt: now,
      },
      status: {
        not: 'DONE',
      },
    },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
  });
}

// Fetch all users
export async function getUsers() {
  return prisma.user.findMany();
}

// Get users cached for backwards compatibility
export const users = getUsers;

// Fetch all labels
export async function getLabels() {
  return prisma.label.findMany();
}

// Get labels cached for backwards compatibility
export const labels = getLabels;
