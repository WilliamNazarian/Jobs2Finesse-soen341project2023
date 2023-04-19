const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const verifyJWT = require('../verifyJWT');

// Mocks for dependencies
jest.mock('jsonwebtoken');
jest.mock('dotenv');

describe('JWT Verification Middleware Test', () => {
  test('Should verify JWT token and call next() on success', () => {
    const req = { headers: { authorization: 'Bearer token' } };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { username: 'testuser' });
    });

    verifyJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET, expect.any(Function));
    expect(req.user).toEqual({ username: 'testuser' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('Should return 403 error when JWT verification fails', () => {
    const req = { headers: { authorization: 'Bearer token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    verifyJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET, expect.any(Function));
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid!', accountType: 'guest' });
  });

  test('Should return 401 error when Authorization header is missing', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyJWT(req, res, next);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith('You are not authenticated!');
  });

  // You can also write additional tests to cover other scenarios, such as testing different cases of JWT token and secret, and verifying the interactions with `next()`, `res.status()`, and `res.json()`.
});
