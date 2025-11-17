import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function globalSetup() {
  console.log("🔄 Preparing database for tests...");

  try {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");

    // Delete existing database file if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log("✅ Deleted existing database");
    }

    // Run migrations to recreate schema
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "development" },
    });

    console.log("✅ Database schema created");

    // Run seed script
    execSync("npm run prisma:seed", {
      stdio: "inherit",
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "development" },
    });

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Failed to prepare database:", error);
    throw error;
  }
}

export default globalSetup;
