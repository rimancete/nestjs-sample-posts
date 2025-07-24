import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseHealth } from './database.health';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseHealth],
  exports: [DatabaseHealth],
})
export class DatabaseModule {}
