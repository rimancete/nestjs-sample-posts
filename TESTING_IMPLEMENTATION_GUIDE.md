# Testing Implementation Guide

## 1. Unit Testing Setup
### Base Test Configuration (`test/test-utils.ts`):
```typescript
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export async function createTestingModule() {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      MongooseModule.forRoot(process.env.MONGODB_URI_TEST),
    ],
  });
}

export async function setupTestApp(module: any): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule(module).compile();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
```

## 2. Service Unit Tests (`src/users/users.service.spec.ts`)
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    mockUserModel.create.mockResolvedValue({
      name: 'Test',
      email: 'test@example.com',
    });
    const user = await service.create({ /* user data */ });
    expect(user).toBeDefined();
  });
});
```

## 3. E2E Testing (`test/e2e/users.e2e-spec.ts`)
```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../../src/users/users.module';
import { createTestingModule, setupTestApp } from '../test-utils';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await createTestingModule({
      imports: [UsersModule],
    });
    app = await setupTestApp(module);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST users', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Test', email: 'test@example.com' })
      .expect(201);
  });
});
```

## 4. Test Database Configuration
Add to `.env.test`:
```
MONGODB_URI_TEST=mongodb://localhost:27017/nest-test
```

## 5. Test Scripts (`package.json`)
```json
{
  "scripts": {
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:e2e": "NODE_ENV=test jest --config ./test/jest-e2e.json"
  }
}
```

## 6. Mocking Strategies
```typescript
// Example repository mock
const mockRepository = {
  findOne: jest.fn().mockImplementation((query) => {
    if (query.email === 'exists@test.com') {
      return Promise.resolve({ email: 'exists@test.com' });
    }
    return Promise.resolve(null);
  }),
};
```

## 7. Testing Best Practices
- Use separate test database
- Clean database between tests
- Mock external services
- Test edge cases and error scenarios
- Include integration tests for critical paths
