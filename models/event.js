const mongoose = require('mongoose');

// Event schema -- Boluwatife Alewi
// Fields follow the project proposal: title, description, date, time,
// venueId, price, category, status.
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Event title must be at least 3 characters'],
    maxlength: [120, 'Event title must be 120 characters or fewer']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    minlength: [10, 'Event description must be at least 10 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    // 24 hour clock, for example 19:30
    match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM 24 hour format, for example 19:30']
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: [true, 'Venue id is required']
  },
  price: {
    type: Number,
    required: [true, 'Event price is required'],
    min: [0, 'Event price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['concert', 'conference', 'sports', 'theatre', 'festival', 'workshop', 'other'],
      message: 'Category must be concert, conference, sports, theatre, festival, workshop or other'
    }
  },
  status: {
    type: String,
    required: [true, 'Event status is required'],
    enum: {
      values: ['draft', 'published', 'cancelled', 'completed'],
      message: 'Status must be draft, published, cancelled or completed'
    },
    default: 'draft'
  },
  // Not in the proposal, but optional: who created the event
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
