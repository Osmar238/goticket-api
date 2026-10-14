// GET and GET-by-id tests for the venues collection -- Boluwatife Alewi
// The happy paths are in get-endpoints.test.js. These cover what happens
// when something goes wrong. The model is mocked, so no database is needed.

jest.mock('../models/venue', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Venue = require('../models/venue');

const realId = new mongoose.Types.ObjectId().toString();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /venues', () => {
  test('GET /venues returns 404 when there are none', async () => {
    Venue.find.mockResolvedValue([]);

    const response = await request(app).get('/venues');

    expect(response.status).toBe(404);
  });

  test('GET /venues returns 500 when the database fails', async () => {
    Venue.find.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/venues');

    expect(response.status).toBe(500);
  });
});

describe('GET /venues/:id', () => {
  test('returns the venue with status 200', async () => {
    Venue.findById.mockResolvedValue({ _id: realId, name: 'Test Hall', capacity: 500 });

    const response = await request(app).get('/venues/' + realId);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Hall');
  });

  test('returns 404 when no venue has that id', async () => {
    Venue.findById.mockResolvedValue(null);

    const response = await request(app).get('/venues/' + realId);

    expect(response.status).toBe(404);
  });

  test('returns 400 for an id that is not a valid ObjectId', async () => {
    const response = await request(app).get('/venues/notanid');

    expect(response.status).toBe(400);
    // the database should never be asked about a broken id
    expect(Venue.findById).not.toHaveBeenCalled();
  });

  test('returns 500 when the database fails', async () => {
    Venue.findById.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/venues/' + realId);

    expect(response.status).toBe(500);
  });
});
