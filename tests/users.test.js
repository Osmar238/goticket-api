// GET and GET-by-id tests for the users collection -- Boluwatife Alewi
// The happy paths are in get-endpoints.test.js. These cover what happens
// when something goes wrong. The model is mocked, so no database is needed.

jest.mock('../models/user', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user');

const realId = new mongoose.Types.ObjectId().toString();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /users', () => {
  test('GET /users returns an empty list with status 200 when there are none', async () => {
    User.find.mockResolvedValue([]);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('GET /users returns 500 when the database fails', async () => {
    User.find.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/users');

    expect(response.status).toBe(500);
  });
});

describe('GET /users/:id', () => {
  test('returns the user with status 200', async () => {
    User.findById.mockResolvedValue({ _id: realId, firstName: 'Test', lastName: 'User' });

    const response = await request(app).get('/users/' + realId);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Test');
  });

  test('returns 404 when no user has that id', async () => {
    User.findById.mockResolvedValue(null);

    const response = await request(app).get('/users/' + realId);

    expect(response.status).toBe(404);
  });

  test('returns 400 for an id that is not a valid ObjectId', async () => {
    const response = await request(app).get('/users/notanid');

    expect(response.status).toBe(400);
    // the database should never be asked about a broken id
    expect(User.findById).not.toHaveBeenCalled();
  });

  test('returns 500 when the database fails', async () => {
    User.findById.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/users/' + realId);

    expect(response.status).toBe(500);
  });
});
