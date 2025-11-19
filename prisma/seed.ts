import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Check if running in test environment
const isTestEnv = process.env.NODE_ENV === "test";

async function main() {
  console.log("🌱 Seeding database...");
  if (isTestEnv) {
    console.log("📋 Running in TEST environment - seeding base data only");
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

  await prisma.user.create({ data: userData[0] });
  await prisma.user.create({ data: userData[1] });
  await prisma.user.create({ data: userData[2] });

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

  await prisma.label.create({ data: labelData[0] });
  await prisma.label.create({ data: labelData[1] });
  await prisma.label.create({ data: labelData[2] });
  await prisma.label.create({ data: labelData[3] });

  if (isTestEnv) {
    console.log("✅ Test database seeded successfully!");
    console.log("Created:\n- 3 users\n- 4 labels");
  } else {
    console.log("✅ Development database seeded successfully!");
    console.log("Created:\n- 3 users\n- 4 labels");
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
