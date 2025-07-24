import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MigrationRunner } from './migration-runner';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [MigrationRunner],
  exports: [MigrationRunner],
})
export class MigrationsModule {}
