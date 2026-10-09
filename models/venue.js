const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Venue description is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Venue capacity is required'],
    min: [0, 'Venue capacity must be a positive number']
  },
  address: {
    street: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, required: [true, 'State is required'] },
    zipCode: { type: String, required: [true, 'Zip code is required'] },
    country: { type: String, required: [true, 'Country is required'] }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required']
    }
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
