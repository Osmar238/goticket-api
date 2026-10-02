const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


app.get('/', (req, res) => {
  res.send('Welcome to GoTicket API');
});

//1. Define Venues Schema -- Samantha Salazar
const venueSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,
    unique: true,
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
    street: {type: String, required: [true, 'Street address is required']},
    city: {type: String, required: [true, 'City is required']},
    state: {type: String, required: [true, 'State is required']},
    zipCode: {type: String, required: [true, 'Zip code is required']},
    country: {type: String, required: [true, 'Country is required']},
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

//2. Define Ticket Schema -- Samantha Salazar
const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required']
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
    required: [true, 'Sales start date is required']},
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