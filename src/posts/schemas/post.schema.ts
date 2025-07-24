import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category_id: Types.ObjectId;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop()
  featured_image: string;

  @Prop({
    type: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
  })
  meta: {
    views: number;
    likes: number;
  };

  @Prop()
  published_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
