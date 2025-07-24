import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Post[]; total: number }> {
    const [data, total] = await Promise.all([
      this.postModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments().exec(),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async findPublished(
    page = 1,
    limit = 5,
  ): Promise<{ data: Post[]; total: number }> {
    const [data, total] = await Promise.all([
      this.postModel
        .find({ status: 'published' })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments({ status: 'published' }).exec(),
    ]);
    return { data, total };
  }

  async findWithAuthors(
    page = 1,
    limit = 5,
    status?: string,
    author_id?: string,
  ): Promise<{ data: Post[]; total: number }> {
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (author_id) {
      const { Types } = await import('mongoose');
      filter.author_id = new Types.ObjectId(author_id);
    }

    const query = this.postModel
      .find(filter)
      .populate('author_id', 'username email')
      .skip((page - 1) * limit)
      .limit(limit);

    const [data, total] = await Promise.all([
      query.exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);
    return { data, total };
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postModel.find({ author_id: authorId }).exec();
  }

  async publishPost(id: string): Promise<Post | null> {
    const result = await this.postModel
      .findByIdAndUpdate(
        id,
        {
          status: 'published',
          published_at: new Date(),
        },
        { new: true },
      )
      .exec();

    return result;
  }
}
