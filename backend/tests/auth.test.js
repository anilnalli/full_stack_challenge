import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../src/services/AuthService.js';
import { getPrisma, disconnectPrisma } from '../src/config/database.js';

describe('Authentication Service', () => {
  let authService;
  let prisma;

  before(async () => {
    authService = new AuthService();
    prisma = getPrisma();
  });

  after(async () => {
    await disconnectPrisma();
  });

  it('should register a new user', async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT',
    };

    const result = await authService.register(
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.role
    );

    assert.ok(result.user);
    assert.equal(result.user.email, userData.email);
    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
  });

  it('should not register duplicate email', async () => {
    const email = `duplicate-${Date.now()}@example.com`;
    const userData = {
      email,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT',
    };

    await authService.register(
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.role
    );

    try {
      await authService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.role
      );
      assert.fail('Should have thrown ConflictError');
    } catch (error) {
      assert.equal(error.statusCode, 409);
    }
  });

  it('should login successfully', async () => {
    const email = `login-test-${Date.now()}@example.com`;
    const password = 'password123';

    await authService.register(email, password, 'Test', 'User', 'STUDENT');

    const result = await authService.login(email, password);

    assert.ok(result.user);
    assert.equal(result.user.email, email);
    assert.ok(result.accessToken);
  });

  it('should reject invalid password', async () => {
    const email = `invalid-pwd-${Date.now()}@example.com`;

    await authService.register(email, 'password123', 'Test', 'User', 'STUDENT');

    try {
      await authService.login(email, 'wrongpassword');
      assert.fail('Should have thrown AuthenticationError');
    } catch (error) {
      assert.equal(error.statusCode, 401);
    }
  });
});
