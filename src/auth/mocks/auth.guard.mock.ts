import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

interface MockUser {
  userId: string;
  username: string;
  roles: string[];
  email: string;
  [key: string]: unknown; // Allow additional properties
}

@Injectable()
export class MockAuthGuard implements CanActivate {
  private mockUser: MockUser = {
    userId: '507f1f77bcf86cd799439011',
    username: 'Test User',
    email: 'test@example.com',
    roles: ['user'],
  };

  setMockUser(user: MockUser) {
    this.mockUser = user;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    request.user = this.mockUser;
    return true;
  }
}
