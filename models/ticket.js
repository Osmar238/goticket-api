const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  name: {
    type: String,
    required: [true, 'Ticket name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Ticket price is required'],
    min: [0, 'Ticket price must be a positive number']
  },
  quantity: {
    type: Number,
    required: [true, 'Ticket quantity is required'],
    min: [0, 'Ticket quantity must be a positive number']
  },
  currency: {
    type: String,
    default: 'USD',
    required: [true, 'Currency is required'],
    trim: true
  },
  salesStartDate: {
    type: Date,
    required: [true, 'Sales start date is required']
  },
  salesEndDate: {
    type: Date,
    required: [true, 'Sales end date is required']
  },
  maxTicketsPerCustomer: {
    type: Number,
    required: [true, 'Max tickets per customer is required'],
    min: [1, 'Max tickets per customer must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
