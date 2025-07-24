import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MockAuthGuard } from '../src/auth/mocks/auth.guard.mock';
import { JwtAuthGuard } from '../src/auth/auth.guard';
import { UsersController } from '../src/users/users.controller';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mockGuard: MockAuthGuard;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MockAuthGuard],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    mockGuard = moduleFixture.get<MockAuthGuard>(MockAuthGuard);
    await app.init();

    // Verify guard override worked
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const guards: (new (...args: any[]) => unknown)[] = Reflect.getMetadata(
      '__guards__',
      UsersController.prototype,
    );
    console.log(
      'Applied guards:',
      guards?.map((g) => g?.name),
    );
    console.log('MockGuard instance:', mockGuard);
    console.log('Is mock guard active:', mockGuard instanceof MockAuthGuard);
    console.log('Original guard:', JwtAuthGuard.name);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) should return data with mock auth', async () => {
    mockGuard.setMockUser({
      userId: 'test-user-1',
      username: 'testuser1',
      email: 'test@example.com',
      roles: ['admin'],
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });

  it('/users (GET) should work with different roles', async () => {
    mockGuard.setMockUser({
      userId: 'test-user-2',
      username: 'testuser2',
      email: 'test@example.com',
      roles: ['user'],
    });

    return request(app.getHttpServer()).get('/api/users').expect(200);
  });
});
