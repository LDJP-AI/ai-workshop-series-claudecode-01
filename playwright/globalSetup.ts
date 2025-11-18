import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

async function globalSetup() {
  console.log("🔄 Preparing test database...");

  try {
    // Load test environment variables (.env.test)
    const testEnvResult = dotenv.config({ path: ".env.test" });

    if (testEnvResult.error) {
      console.warn("⚠️  Could not load .env.test, using default DATABASE_URL");
    }

    const testDbPath = path.join(process.cwd(), "prisma", "test.db");

    // Delete existing test database file if it exists
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      console.log("✅ Deleted existing test database");
    }

    // Prepare environment for test run
    const testEnv = {
      ...process.env,
      NODE_ENV: "test",
      DATABASE_URL: `file:${testDbPath}`,
    };

    // Run migrations to recreate schema (using test database)
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      cwd: process.cwd(),
      env: testEnv as NodeJS.ProcessEnv,
    });

    console.log("✅ Test database schema created");

    // Run seed script with test environment
    execSync("npm run prisma:seed", {
      stdio: "inherit",
      cwd: process.cwd(),
      env: testEnv as NodeJS.ProcessEnv,
    });

    console.log("✅ Test database seeded successfully with fixed IDs");
  } catch (error) {
    console.error("❌ Failed to prepare test database:", error);
    throw error;
  }
}

export default globalSetup;
