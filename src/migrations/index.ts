import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MigrationRunner } from './migration-runner';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const runner = app.get(MigrationRunner);
    await runner.runMigrations();
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

if (require.main === module) {
  bootstrap().catch((err: Error) => {
    console.error('Bootstrap error:', err);
    process.exit(1);
  });
}
