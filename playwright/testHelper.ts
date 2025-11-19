import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Test data creation helper functions
 * These functions are used in tests to create isolated test data
 */

export interface TestDataSeed {
  users: Array<{ id: number; name: string; email: string }>;
  labels: Array<{ id: number; name: string; color: string }>;
}

/**
 * Clear all test data from the database
 */
export async function clearTestData() {
  await prisma.ticketLabel.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Create base test users (or retrieve if already exist)
 */
export async function createTestUsers() {
  let user1 = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user1) {
    user1 = await prisma.user.create({
      data: { id: 1, name: "田中太郎", email: "tanaka@example.com" },
    });
  }

  let user2 = await prisma.user.findUnique({ where: { id: 2 } });
  if (!user2) {
    user2 = await prisma.user.create({
      data: { id: 2, name: "佐藤花子", email: "sato@example.com" },
    });
  }

  let user3 = await prisma.user.findUnique({ where: { id: 3 } });
  if (!user3) {
    user3 = await prisma.user.create({
      data: { id: 3, name: "鈴木次郎", email: "suzuki@example.com" },
    });
  }

  return [user1, user2, user3];
}

/**
 * Create base test labels (or retrieve if already exist)
 */
export async function createTestLabels() {
  let labelBug = await prisma.label.findUnique({ where: { id: 1 } });
  if (!labelBug) {
    labelBug = await prisma.label.create({
      data: { id: 1, name: "バグ", color: "red" },
    });
  }

  let labelFeature = await prisma.label.findUnique({ where: { id: 2 } });
  if (!labelFeature) {
    labelFeature = await prisma.label.create({
      data: { id: 2, name: "機能", color: "blue" },
    });
  }

  let labelDoc = await prisma.label.findUnique({ where: { id: 3 } });
  if (!labelDoc) {
    labelDoc = await prisma.label.create({
      data: { id: 3, name: "ドキュメント", color: "green" },
    });
  }

  let labelUrgent = await prisma.label.findUnique({ where: { id: 4 } });
  if (!labelUrgent) {
    labelUrgent = await prisma.label.create({
      data: { id: 4, name: "緊急", color: "orange" },
    });
  }

  return [labelBug, labelFeature, labelDoc, labelUrgent];
}

/**
 * Create a test ticket with minimal data
 * Useful for list and detail tests
 */
export async function createSimpleTicket(
  title: string,
  description: string,
  status: "OPEN" | "IN_PROGRESS" | "DONE" = "OPEN",
  priority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM",
  assigneeId?: number
) {
  return await prisma.ticket.create({
    data: {
      title,
      description,
      status,
      priority,
      assigneeId,
    },
  });
}

/**
 * Create a test ticket with labels
 */
export async function createTicketWithLabels(
  title: string,
  description: string,
  labelIds: number[],
  status: "OPEN" | "IN_PROGRESS" | "DONE" = "OPEN",
  priority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM",
  assigneeId?: number
) {
  return await prisma.ticket.create({
    data: {
      title,
      description,
      status,
      priority,
      assigneeId,
      labels: {
        create: labelIds.map((labelId) => ({ labelId })),
      },
    },
  });
}

/**
 * Create a comment on a ticket
 */
export async function createComment(
  ticketId: number,
  content: string,
  userId: number
) {
  return await prisma.comment.create({
    data: {
      content,
      ticketId,
      userId,
    },
  });
}

/**
 * Get a ticket by ID (for verification in tests)
 */
export async function getTicketById(id: number) {
  return await prisma.ticket.findUnique({
    where: { id },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: true,
    },
  });
}

/**
 * Get all tickets (for verification in tests)
 */
export async function getAllTickets() {
  return await prisma.ticket.findMany({
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Initialize test database with base data (users and labels only)
 * Should be called once before running tests
 */
export async function initializeTestDatabase() {
  await clearTestData();
  await createTestUsers();
  await createTestLabels();
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
