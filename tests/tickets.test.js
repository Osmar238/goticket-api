// GET and GET-by-id tests for the tickets collection -- Boluwatife Alewi
// The happy paths are in get-endpoints.test.js. These cover what happens
// when something goes wrong. The model is mocked, so no database is needed.

jest.mock('../models/ticket', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Ticket = require('../models/ticket');

const realId = new mongoose.Types.ObjectId().toString();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /tickets', () => {
  test('GET /tickets returns 404 when there are none', async () => {
    Ticket.find.mockResolvedValue([]);

    const response = await request(app).get('/tickets');

    expect(response.status).toBe(404);
  });

  test('GET /tickets returns 500 when the database fails', async () => {
    Ticket.find.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/tickets');

    expect(response.status).toBe(500);
  });
});

describe('GET /tickets/:id', () => {
  test('returns the ticket with status 200', async () => {
    Ticket.findById.mockResolvedValue({ _id: realId, name: 'General Admission', price: 35 });

    const response = await request(app).get('/tickets/' + realId);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('General Admission');
  });

  test('returns 404 when no ticket has that id', async () => {
    Ticket.findById.mockResolvedValue(null);

    const response = await request(app).get('/tickets/' + realId);

    expect(response.status).toBe(404);
  });

  test('returns 400 for an id that is not a valid ObjectId', async () => {
    const response = await request(app).get('/tickets/notanid');

    expect(response.status).toBe(400);
    // the database should never be asked about a broken id
    expect(Ticket.findById).not.toHaveBeenCalled();
  });

  test('returns 500 when the database fails', async () => {
    Ticket.findById.mockRejectedValue(new Error('Database is down'));

    const response = await request(app).get('/tickets/' + realId);

    expect(response.status).toBe(500);
  });
});
