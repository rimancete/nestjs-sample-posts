import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  author_id: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @IsString()
  @IsOptional()
  featured_image?: string;

  @IsOptional()
  published_at?: Date;
}
