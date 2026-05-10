const jwt = require('jsonwebtoken');
const authMiddleware = require('../../backend/middleware/authMiddleware');
const roleMiddleware = require('../../backend/middleware/roleMiddleware');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('Middleware Unit Tests', () => {
  test('authMiddleware returns 401 when no token provided', async () => {
    const req = { headers: {} };
    const res = mockResponse();
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('authMiddleware returns 401 for malformed token', async () => {
    const req = { headers: { authorization: 'Bearer badtoken' } };
    const res = mockResponse();
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('authMiddleware accepts valid token and attaches req.user', async () => {
    const token = jwt.sign({ id: 'abc123', role: 'Tourist' }, process.env.JWT_SECRET || 'secret');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockResponse();
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.role).toBe('Tourist');
  });

  test('roleMiddleware denies access when no user is attached', () => {
    const middleware = roleMiddleware('Admin');
    const req = {}; 
    const res = mockResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient permissions' });
    expect(next).not.toHaveBeenCalled();
  });

  test('roleMiddleware denies access for wrong role', () => {
    const middleware = roleMiddleware(['Guide', 'Admin']);
    const req = { user: { role: 'Tourist' } };
    const res = mockResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient permissions' });
    expect(next).not.toHaveBeenCalled();
  });

  test('roleMiddleware allows access when role matches', () => {
    const middleware = roleMiddleware(['Guide', 'Admin']);
    const req = { user: { role: 'Guide' } };
    const res = mockResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
