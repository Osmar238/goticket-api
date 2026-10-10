const mongoose = require('mongoose');
const Ticket = require('../models/ticket');

const getAll = async (req, res) => {
  //#swagger.tags = ['Tickets']
  //#swagger.responses[200] = { description: 'OK' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  try {
    const tickets = await Ticket.find();

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found' });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags = ['Tickets']
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch ticket', error: err.message });
  }
};

const createTicket = async (req, res) => {
  //#swagger.tags = ['Tickets']
  //#swagger.parameters['body'] = { in: 'body', description: 'Ticket document to create', required: true, schema: { $ref: '#/definitions/TicketCreate' } }
  const input = req.body || {};
  const ticket = {
    userId: input.userId,
    eventId: input.eventId,
    name: input.name,
    price: input.price,
    quantity: input.quantity,
    currency: input.currency,
    salesStartDate: input.salesStartDate,
    salesEndDate: input.salesEndDate,
    maxTicketsPerCustomer: input.maxTicketsPerCustomer,
    isActive: input.isActive
  };

  try {
    const createdTicket = await Ticket.create(ticket);
    return res.status(201).json(createdTicket);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.name === 'ValidationError'
          ? Object.values(err.errors).map((validationError) => validationError.message)
          : [err.message]
      });
    }

    return res.status(500).json({ message: 'Failed to create ticket', error: err.message });
  }
};

const updateTicket = async (req, res) => {
  //#swagger.tags = ['Tickets']
  //#swagger.parameters['body'] = { in: 'body', description: 'Ticket fields to update', required: true, schema: { $ref: '#/definitions/TicketUpdate' } }
  //#swagger.responses[204] = { description: 'No Content' }
  //#swagger.responses[400] = { description: 'Bad Request' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    const input = req.body || {};
    const ticketUpdates = {};
    if (Object.hasOwn(input, 'userId')) ticketUpdates.userId = input.userId;
    if (Object.hasOwn(input, 'eventId')) ticketUpdates.eventId = input.eventId;
    if (Object.hasOwn(input, 'name')) ticketUpdates.name = input.name;
    if (Object.hasOwn(input, 'price')) ticketUpdates.price = input.price;
    if (Object.hasOwn(input, 'quantity')) ticketUpdates.quantity = input.quantity;
    if (Object.hasOwn(input, 'currency')) ticketUpdates.currency = input.currency;
    if (Object.hasOwn(input, 'salesStartDate')) ticketUpdates.salesStartDate = input.salesStartDate;
    if (Object.hasOwn(input, 'salesEndDate')) ticketUpdates.salesEndDate = input.salesEndDate;
    if (Object.hasOwn(input, 'maxTicketsPerCustomer')) ticketUpdates.maxTicketsPerCustomer = input.maxTicketsPerCustomer;
    if (Object.hasOwn(input, 'isActive')) ticketUpdates.isActive = input.isActive;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.set(ticketUpdates);
    await ticket.save();
    return res.status(204).send();
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.name === 'ValidationError'
          ? Object.values(err.errors).map((validationError) => validationError.message)
          : [err.message]
      });
    }

    return res.status(500).json({ message: 'Failed to update ticket', error: err.message });
  }
};

const deleteTicket = async (req, res) => {
  //#swagger.tags = ['Tickets']
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete ticket', error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createTicket,
  updateTicket,
  deleteTicket
};
