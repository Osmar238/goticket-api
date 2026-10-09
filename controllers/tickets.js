const mongoose = require('mongoose');
const Ticket = require('../models/ticket');

async function getAll(req, res) {
  //#swagger.tags = ['Tickets']
  //#swagger.responses[200] = { description: 'OK' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  const tickets = await Ticket.find();
  if (tickets.length === 0) {
    return res.status(404).json({ message: 'No tickets found' });
  }

  return res.status(200).json(tickets);
}

async function getSingle(req, res) {
  //#swagger.tags = ['Tickets']
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  return res.status(200).json(ticket);
}

async function createTicket(req, res) {
  //#swagger.tags = ['Tickets']
  const ticket = await Ticket.create(req.body);
  return res.status(201).json(ticket);
}

async function updateTicket(req, res) {
  //#swagger.tags = ['Tickets']
  //#swagger.responses[204] = { description: 'No Content' }
  //#swagger.responses[400] = { description: 'Bad Request' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  const updates = { ...req.body };
  delete updates._id;
  delete updates.createdAt;
  delete updates.updatedAt;
  delete updates.__v;

  const ticket = await Ticket.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  return res.status(204).send();
}

async function deleteTicket(req, res) {
  //#swagger.tags = ['Tickets']
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  const ticket = await Ticket.findByIdAndDelete(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  return res.status(204).send();
}

module.exports = { getAll, getSingle, createTicket, updateTicket, deleteTicket };
