const mongoose = require('mongoose');

// Event schema -- Boluwatife Alewi
// An event happens at a Venue, is run by a User (the organizer),
// and Tickets point back at it.
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
    minlength: [10, 'Event description must be at least 10 characters'],
    maxlength: [2000, 'Event description must be 2000 characters or fewer']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['concert', 'conference', 'sports', 'theatre', 'festival', 'workshop', 'other'],
      message: 'Category must be concert, conference, sports, theatre, festival, workshop or other'
    }
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: [true, 'Venue reference is required']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer reference is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      // `this` is only the document on a create, so guard for updates
      validator: function (value) {
        if (!this.startDate) return true;
        return value > this.startDate;
      },
      message: 'End date must be after the start date'
    }
  },
  totalCapacity: {
    type: Number,
    required: [true, 'Total capacity is required'],
    min: [1, 'Total capacity must be at least 1']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['draft', 'published', 'cancelled', 'completed'],
      message: 'Status must be draft, published, cancelled or completed'
    },
    default: 'draft'
  },
  imageUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Image URL must start with http:// or https://'],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Events get listed by date constantly, so index the common lookups
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
