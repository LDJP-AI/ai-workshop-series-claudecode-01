import { execSync } from 'child_process';
import dotenv from 'dotenv';

async function globalSetup() {
  console.log('🔄 Preparing test database...\n');

  try {
    console.log('🗃️  Setting up test database...', process.env.DATABASE_URL);
    // Load test environment variables (.env.test)
    const testEnvResult = dotenv.config({ path: '.env.test' });

    if (testEnvResult.error) {
      console.warn('⚠️  Could not load .env.test, using default DATABASE_URL');
    }

    // Prepare environment for test run
    const testEnv = {
      ...process.env,
      NODE_ENV: 'test',
    };

    // Step 1: Run migrations to recreate schema (using test database)
    console.log('📊 Step 1: Running Prisma migrations...');
    execSync('npm run prisma:migrate', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: testEnv as NodeJS.ProcessEnv,
    });
    console.log('✅ Test database schema created\n');
    console.log('🚀 Ready to run tests!\n');
  } catch (error) {
    console.error('\n❌ Failed to prepare test database:', error);
    throw error;
  }
}

export default globalSetup;
