import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private postsService: PostsService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findPostsByUserId(userId: string): Promise<Post[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    }
    return this.postsService.findByAuthor(userId);
  }
}
