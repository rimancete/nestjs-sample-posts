import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const postDto = plainToInstance(CreatePostDto, req.body);
    const errors = await validate(postDto);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.map((err) => {
          return {
            property: err.property,
            constraints: err.constraints,
          };
        }),
      });
    }

    next();
  }
}
