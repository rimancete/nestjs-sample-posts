import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateUsersMigration } from './001_create_users';

@Injectable()
export class MigrationRunner {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async runMigrations() {
    console.log('Starting migrations...');

    const createUsersMigration = new CreateUsersMigration(this.userModel);
    await createUsersMigration.execute();

    console.log('All migrations completed successfully');
    return true;
  }
}
