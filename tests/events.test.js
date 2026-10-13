// GET and GET-by-id tests for the events collection -- Boluwatife Alewi
// The happy paths are in get-endpoints.test.js. These cover what happens
// when something goes wrong. The model is mocked, so no database is needed.

jest.mock('../models/event', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Event = require('../models/event');

const realId = new mongoose.Types.ObjectId().toString();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /events', () => {
  test('GET /events returns an empty list with status 200 when there are none', async () => {
    Event.find.mockResolvedValue([]);

    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('GET /events returns 500 when the database fails', async () => {
    Event.find.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/events');

    expect(response.status).toBe(500);
  });
});

describe('GET /events/:id', () => {
  test('returns the event with status 200', async () => {
    Event.findById.mockResolvedValue({ _id: realId, title: 'Test Concert', time: '19:30' });

    const response = await request(app).get('/events/' + realId);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Concert');
  });

  test('returns 404 when no event has that id', async () => {
    Event.findById.mockResolvedValue(null);

    const response = await request(app).get('/events/' + realId);

    expect(response.status).toBe(404);
  });

  test('returns 400 for an id that is not a valid ObjectId', async () => {
    const response = await request(app).get('/events/notanid');

    expect(response.status).toBe(400);
    // the database should never be asked about a broken id
    expect(Event.findById).not.toHaveBeenCalled();
  });

  test('returns 500 when the database fails', async () => {
    Event.findById.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/events/' + realId);

    expect(response.status).toBe(500);
  });
});
