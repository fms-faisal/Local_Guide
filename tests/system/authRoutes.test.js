const request = require('supertest');
const { connect, clearDatabase } = require('../setup/db');
const app = require('../../backend/app');
const User = require('../../backend/models/User');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

describe('System: Auth Routes', () => {
  test('POST /api/auth/register creates a new user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'SystemUser',
      email: 'system.register@test.com',
      password: 'password',
      role: 'Tourist',
      profileDetails: { bio: 'Bio', location: 'Dhaka' },
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.role).toBe('Tourist');
    const user = await User.findOne({ email: 'system.register@test.com' });
    expect(user).not.toBeNull();
  });

  test('POST /api/auth/register returns 409 for existing email', async () => {
    await User.create({ name: 'Existing', email: 'duplicate@system.test', password: 'password', role: 'Tourist' });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate',
      email: 'duplicate@system.test',
      password: 'password',
      role: 'Tourist',
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Email already registered');
  });

  test('POST /api/auth/login returns token for valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'LoginUser',
      email: 'login@system.test',
      password: 'password',
      role: 'Tourist',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@system.test',
      password: 'password',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.role).toBe('Tourist');
  });

  test('POST /api/auth/login returns 401 for invalid password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'LoginUser2',
      email: 'login2@system.test',
      password: 'password',
      role: 'Tourist',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'login2@system.test',
      password: 'wrong',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
