export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/nestjs-sample-posts',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600',
  },
  mockAuth: {
    enabled: process.env.USE_MOCK_AUTH === 'true',
    roles: process.env.MOCK_USER_ROLES?.split(',') || ['user'],
  },
});
