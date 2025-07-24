import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { DatabaseHealth } from '../database/database.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private databaseHealth: DatabaseHealth,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.databaseHealth.isHealthy('database')]);
  }
}
