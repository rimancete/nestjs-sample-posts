import {
  Controller,
  Get,
  Post as HttpPost,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  Query,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostModel } from './schemas/post.schema';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ success: boolean; data: PostModel[]; pagination: any }> {
    const { data, total } = await this.postsService.findAll(page, limit);
    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  @Get('published')
  async findPublished(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ): Promise<{ success: boolean; data: PostModel[]; pagination: any }> {
    const { data, total } = await this.postsService.findPublished(page, limit);
    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<{
    success: boolean;
    data: {
      _id: string;
      title: string;
      content: string;
      author_id: string;
      status: string;
      published_at?: Date;
      created_at: Date;
      updated_at: Date;
      meta: {
        views: number;
        likes: number;
      };
    };
  }> {
    try {
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException({
          success: false,
          message: 'Post not found',
        });
      }
      return {
        success: true,
        data: {
          _id: post._id as string,
          title: post.title,
          content: post.content,
          author_id: post.author_id.toString(),
          status: post.status,
          published_at: post.published_at,
          created_at: post.created_at,
          updated_at: post.updated_at,
          meta: {
            views: post.meta?.views || 0,
            likes: post.meta?.likes || 0,
          },
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'CastError') {
        throw new BadRequestException({
          success: false,
          message: 'Invalid post ID format',
        });
      }
      throw error;
    }
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<{ success: boolean; message: string; data: PostModel }> {
    const post = await this.postsService.create(createPostDto);
    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<{ success: boolean; message: string; data: PostModel }> {
    const updated = await this.postsService.update(id, updatePostDto);
    if (!updated) {
      throw new NotFoundException({
        success: false,
        message: 'Post not found',
      });
    }
    return {
      success: true,
      message: 'Post updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    const deleted = await this.postsService.remove(id);
    if (!deleted) {
      throw new NotFoundException({
        success: false,
        message: 'Post not found',
      });
    }
    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Param('id') id: string): Promise<{
    success: boolean;
    message: string;
    data: {
      _id: string;
      title: string;
      status: string;
      published_at: Date;
      author_id: string;
    };
  }> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid post ID format',
      });
    }
    const published = await this.postsService.publishPost(id);
    if (!published) {
      throw new NotFoundException({
        success: false,
        message: 'Post not found',
      });
    }

    return {
      success: true,
      message: 'Post published successfully',
      data: {
        _id: published._id as string,
        title: published.title,
        status: published.status,
        published_at: published.published_at,
        author_id: published.author_id.toString(),
      },
    };
  }
}
