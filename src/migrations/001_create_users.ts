import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

interface UserData {
  name: string;
  email: string;
}

@Injectable()
export class CreateUsersMigration {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async execute(): Promise<void> {
    console.log('Running migration: Create Users');

    const users: UserData[] = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
      },
    ];

    for (const userData of users) {
      try {
        const existingUser = await this.userModel.findOne({
          email: userData.email,
        });
        if (!existingUser) {
          await this.userModel.create(userData);
          console.log(`Created user: ${userData.name}`);
        } else {
          console.log(`User already exists: ${userData.name}`);
        }
      } catch (error) {
        console.error(`Error processing user ${userData.name}:`, error);
        throw error;
      }
    }
  }
}
