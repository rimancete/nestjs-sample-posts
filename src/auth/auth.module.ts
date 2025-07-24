import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule],
  providers: [JwtStrategy, AuthService, JwtAuthGuard],
  exports: [PassportModule, AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
