import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser = any>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<Request>();

    // Mock authentication for development/testing
    interface MockAuthConfig {
      enabled: boolean;
      roles: string[];
    }
    const mockAuthConfig = this.configService.get<MockAuthConfig>('mockAuth');
    if (mockAuthConfig?.enabled) {
      const mockUser = {
        userId: 'mock-user-id',
        username: 'mock-user',
        email: 'mock@example.com',
        roles: mockAuthConfig.roles,
      };
      return mockUser as TUser;
    }

    if (err) {
      let errorMessage = 'Unknown authentication error';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      this.logger.warn(
        `Authentication error for ${request.path}: ${errorMessage}`,
      );
      throw new UnauthorizedException(errorMessage);
    }
    if (!user) {
      this.logger.warn(`Unauthorized access attempt to ${request.path}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return user as TUser;
  }
}
