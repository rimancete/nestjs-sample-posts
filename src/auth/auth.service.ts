import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  generateToken(payload: { sub: string; username: string }): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Using type assertion since we know the string format is valid
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }
}
