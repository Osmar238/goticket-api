jest.mock('../models/user', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

jest.mock('../models/event', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

jest.mock('../models/venue', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

jest.mock('../models/ticket', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

const User = require('../models/user');
const Event = require('../models/event');
const Venue = require('../models/venue');
const Ticket = require('../models/ticket');

const sampleId = new mongoose.Types.ObjectId().toString();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Users GET endpoints', () => {
  test('GET /users returns all users with status 200', async () => {
    User.find.mockResolvedValue([
      { _id: sampleId, firstName: 'Test', lastName: 'User' }
    ]);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(User.find).toHaveBeenCalled();
  });

  test('GET /users/:id returns a user with status 200', async () => {
    User.findById.mockResolvedValue({
      _id: sampleId,
      firstName: 'Test',
      lastName: 'User'
    });

    const response = await request(app).get(`/users/${sampleId}`);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Test');
    expect(User.findById).toHaveBeenCalledWith(sampleId);
  });
});

describe('Events GET endpoints', () => {
  test('GET /events returns all events with status 200', async () => {
    Event.find.mockResolvedValue([
      { _id: sampleId, title: 'Test Event' }
    ]);

    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(Event.find).toHaveBeenCalled();
  });

  test('GET /events/:id returns an event with status 200', async () => {
    Event.findById.mockResolvedValue({
      _id: sampleId,
      title: 'Test Event'
    });

    const response = await request(app).get(`/events/${sampleId}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Event');
    expect(Event.findById).toHaveBeenCalledWith(sampleId);
  });
});

describe('Venues GET endpoints', () => {
  test('GET /venues returns all venues with status 200', async () => {
    Venue.find.mockResolvedValue([
      { _id: sampleId, name: 'Test Venue' }
    ]);

    const response = await request(app).get('/venues');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(Venue.find).toHaveBeenCalled();
  });

  test('GET /venues/:id returns a venue with status 200', async () => {
    Venue.findById.mockResolvedValue({
      _id: sampleId,
      name: 'Test Venue'
    });

    const response = await request(app).get(`/venues/${sampleId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Venue');
    expect(Venue.findById).toHaveBeenCalledWith(sampleId);
  });
});

describe('Tickets GET endpoints', () => {
  test('GET /tickets returns all tickets with status 200', async () => {
    Ticket.find.mockResolvedValue([
      { _id: sampleId, name: 'Test Ticket' }
    ]);

    const response = await request(app).get('/tickets');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(Ticket.find).toHaveBeenCalled();
  });

  test('GET /tickets/:id returns a ticket with status 200', async () => {
    Ticket.findById.mockResolvedValue({
      _id: sampleId,
      name: 'Test Ticket'
    });

    const response = await request(app).get(`/tickets/${sampleId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Ticket');
    expect(Ticket.findById).toHaveBeenCalledWith(sampleId);
  });
});