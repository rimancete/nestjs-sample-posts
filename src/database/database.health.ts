import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseHealth extends HealthIndicator {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (!this.connection?.db?.admin) {
        return this.getStatus(key, false, { error: 'Database not connected' });
      }
      await this.connection.db.admin().ping();
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, {
        error:
          error instanceof Error ? error.message : 'Database connection failed',
      });
    }
  }
}
