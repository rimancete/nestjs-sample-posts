import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { Post as PostModel } from '../posts/schemas/post.schema';
import { User } from './schemas/user.schema';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<{ success: boolean; data: User[] }> {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users,
    };
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<{
    success: boolean;
    message: string;
    data: User;
  }> {
    const user = await this.usersService.create(userData);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard)
  async findPostsByUserId(@Param('id') id: string): Promise<{
    success: boolean;
    data: PostModel[];
  }> {
    const posts = await this.usersService.findPostsByUserId(id);
    if (!posts || posts.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'No posts found for this user',
      });
    }
    return {
      success: true,
      data: posts,
    };
  }
}
