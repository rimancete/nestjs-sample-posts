import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  author_id?: string;

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
