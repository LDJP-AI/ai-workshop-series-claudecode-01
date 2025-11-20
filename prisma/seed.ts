import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Check if running in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Read session markdown file
const readSessionFile = (sessionNumber: number): string => {
  try {
    const filePath = path.join(process.cwd(), `sessions/session_0${sessionNumber}.md`);
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    console.warn(`⚠️ Could not read session_0${sessionNumber}.md`);
    return '';
  }
};

// Generate fixed due dates from 2025-12-05 onwards
const getDueDateForSession = (sessionNumber: number): Date => {
  const baseDate = new Date('2025-12-05');
  // Each session has a fixed due date: Session N has N * 14 days from base date
  const daysOffset = sessionNumber * 14;
  return new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
};

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
    // Create workshop session tickets for development environment
    const users = await prisma.user.findMany();
    const labels = await prisma.label.findMany();

    // Session data with titles and descriptions from markdown files
    const sessionTickets = [
      {
        title: 'Session 01: ClaudeCode の基本をマスター',
        sessionNumber: 1,
        status: 'DONE' as const,
        priority: 'HIGH' as const,
      },
      {
        title: 'Session 02: 優先度フィルター機能の実装',
        sessionNumber: 2,
        status: 'DONE' as const,
        priority: 'HIGH' as const,
      },
      {
        title: 'Session 03: カレンダー機能の実装',
        sessionNumber: 3,
        status: 'IN_PROGRESS' as const,
        priority: 'MEDIUM' as const,
      },
      {
        title: 'Session 04: ドキュメントの自動生成',
        sessionNumber: 4,
        status: 'IN_PROGRESS' as const,
        priority: 'MEDIUM' as const,
      },
      {
        title: 'Session 05: カスタム機能と高度な機能の探索',
        sessionNumber: 5,
        status: 'OPEN' as const,
        priority: 'MEDIUM' as const,
      },
    ];

    // Create workshop session tickets with markdown content
    for (const sessionTicket of sessionTickets) {
      const markdown = readSessionFile(sessionTicket.sessionNumber);

      if (!markdown) {
        console.warn(`⚠️ Skipping Session ${sessionTicket.sessionNumber} - markdown not found`);
        continue;
      }

      const ticket = await prisma.ticket.create({
        data: {
          title: sessionTicket.title,
          description: markdown,
          status: sessionTicket.status,
          priority: sessionTicket.priority,
          assigneeId: users[sessionTicket.sessionNumber % users.length]?.id,
          dueDate: getDueDateForSession(sessionTicket.sessionNumber),
        },
      });

      // Add random labels to ticket
      const randomLabels = labels.sort(() => Math.random() - 0.5).slice(0, 2);
      for (const label of randomLabels) {
        await prisma.ticketLabel.create({
          data: {
            ticketId: ticket.id,
            labelId: label.id,
          },
        });
      }

      // Add sample comments for in-progress and done tickets
      if (sessionTicket.status !== 'OPEN') {
        const commentTexts = [
          'セッションの内容を確認しました。',
          '各ステップが明確で分かりやすいです。',
          '実装パターンの例が参考になります。',
          '次のセッションへの道筋が良いですね。',
        ];

        const shuffled = commentTexts.sort(() => Math.random() - 0.5).slice(0, 2);

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
    }

    console.log('✅ Development database seeded successfully with workshop session tickets!');
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
