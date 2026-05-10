const jwt = require('jsonwebtoken');
const { connect } = require('../setup/db');
const User = require('../../backend/models/User');
const authController = require('../../backend/controllers/authController');
const authMiddleware = require('../../backend/middleware/authMiddleware');
const roleMiddleware = require('../../backend/middleware/roleMiddleware');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const mockRequest = (body = {}, user = {}) => ({ body, user, headers: {} });

const generateRegisterCases = () => {
  const names = [null, '', 'Valid Name', 'A'.repeat(256)];
  const emails = [null, '', 'bademail', 'user@example', 'user@example.com'];
  const passwords = [null, '', '123', 'password'];
  const roles = ['Tourist', 'Guide', 'Admin'];
  const cases = [];
  let index = 0;
  for (const name of names) {
    for (const email of emails) {
      for (const password of passwords) {
        if (index >= 50) break;
        cases.push({
          name,
          email,
          password,
          role: roles[index % roles.length],
          expectedError: !name || !email || !password || email.indexOf('@') === -1 || password.length < 4,
        });
        index += 1;
      }
      if (index >= 50) break;
    }
    if (index >= 50) break;
  }
  return cases;
};

const generateLoginCases = () => {
  const emails = [null, '', 'notfound@test.com', 'loginuser@test.com'];
  const passwords = [null, '', 'wrong', 'password'];
  const cases = [];
  let index = 0;
  for (const email of emails) {
    for (const password of passwords) {
      cases.push({ email, password });
      index += 1;
      if (index >= 50) break;
    }
    if (index >= 50) break;
  }
  return cases;
};

const authMiddlewareCases = [
  { header: null, expected: 401 },
  { header: 'Bearer', expected: 401 },
  { header: 'Bearer badtoken', expected: 401 },
  ...Array.from({ length: 70 }, (_, i) => ({ header: `Bearer ${jwt.sign({ id: `user${i}`, role: 'Tourist' }, process.env.JWT_SECRET || 'secret')}`, expected: 200 })),
];

const roleCases = [];
const userRoles = ['Tourist', 'Guide', 'Admin', 'Guest'];
const allowedSets = [['Tourist'], ['Guide'], ['Admin'], ['Guide', 'Admin'], ['Tourist', 'Guide'], ['Tourist', 'Admin'], ['Tourist', 'Guide', 'Admin']];
for (const userRole of userRoles) {
  for (const allowed of allowedSets) {
    roleCases.push({ userRole, allowed });
  }
}

beforeAll(async () => {
  await connect();
});

describe('Auth Bulk Tests', () => {
  test.each(generateRegisterCases())('register case %#', async ({ name, email, password, role, expectedError }) => {
    const req = mockRequest({ name, email, password, role });
    const res = mockResponse();
    await authController.register(req, res);
    if (expectedError) {
      expect(res.status).toHaveBeenCalled();
      expect(res.status.mock.calls[0][0]).toBeGreaterThanOrEqual(400);
    } else {
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    }
  });

  test.each(generateLoginCases())('login case %#', async ({ email, password }) => {
    const req = mockRequest({ email, password });
    const res = mockResponse();
    await User.create({ name: 'LoginUser', email: 'loginuser@test.com', password: 'password', role: 'Tourist' });
    await authController.login(req, res);
    if (!email || !password) {
      expect(res.status).toHaveBeenCalledWith(400);
    } else if (email !== 'loginuser@test.com' || password !== 'password') {
      expect(res.status).toHaveBeenCalledWith(401);
    } else {
      expect(res.json).toHaveBeenCalled();
    }
  });

  test.each(authMiddlewareCases)('authMiddleware header %#', async ({ header, expected }) => {
    const req = { headers: header ? { authorization: header } : {} };
    const res = mockResponse();
    const next = jest.fn();
    await authMiddleware(req, res, next);
    if (expected === 200) {
      expect(next).toHaveBeenCalled();
    } else {
      expect(res.status).toHaveBeenCalledWith(401);
    }
  });

  test.each(roleCases)('roleMiddleware %#', ({ userRole, allowed }) => {
    const req = { user: { role: userRole } };
    const res = mockResponse();
    const next = jest.fn();
    const middleware = roleMiddleware(allowed);
    middleware(req, res, next);
    if (allowed.includes(userRole)) {
      expect(next).toHaveBeenCalled();
    } else {
      expect(res.status).toHaveBeenCalledWith(403);
    }
  });
});
