const { connect } = require('../setup/db');
const User = require('../../backend/models/User');
const authController = require('../../backend/controllers/authController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const mockRequest = (body) => ({ body });

describe('Auth Controller Unit Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  test('register returns 400 when required fields are missing', async () => {
    const req = mockRequest({ name: 'Test', email: 'test@mail.com' });
    const res = mockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  test('register returns 201 on success and stores hashed password', async () => {
    const req = mockRequest({
      name: 'Guide',
      email: 'register@test.com',
      password: 'password',
      role: 'Guide',
      profileDetails: { bio: 'Bio', location: 'Dhaka' },
    });
    const res = mockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const responsePayload = res.json.mock.calls[0][0];
    expect(responsePayload.token).toBeDefined();
    expect(responsePayload.role).toBe('Guide');

    const saved = await User.findOne({ email: 'register@test.com' });
    expect(saved).not.toBeNull();
    expect(saved.password).not.toBe('password');
  });

  test('register returns 409 when email already exists', async () => {
    await User.create({
      name: 'Existing',
      email: 'duplicate@test.com',
      password: 'password',
      role: 'Tourist',
    });

    const req = mockRequest({
      name: 'Duplicate',
      email: 'duplicate@test.com',
      password: 'password',
      role: 'Tourist',
    });
    const res = mockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
  });

  test('login returns 400 when credentials are missing', async () => {
    const req = mockRequest({ email: 'user@test.com' });
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password required' });
  });

  test('login returns 401 for invalid email', async () => {
    const req = mockRequest({ email: 'no-user@test.com', password: 'password' });
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('login returns 401 for wrong password', async () => {
    await User.create({
      name: 'LoginUser',
      email: 'login@test.com',
      password: 'password',
      role: 'Tourist',
    });

    const req = mockRequest({ email: 'login@test.com', password: 'wrong' });
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('login returns token and role for valid credentials', async () => {
    await authController.register(
      mockRequest({
        name: 'ValidUser',
        email: 'valid@test.com',
        password: 'password',
        role: 'Tourist',
      }),
      mockResponse()
    );

    const req = mockRequest({ email: 'valid@test.com', password: 'password' });
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalled();
    const responsePayload = res.json.mock.calls[0][0];
    expect(responsePayload.token).toBeDefined();
    expect(responsePayload.role).toBe('Tourist');
  });
});
