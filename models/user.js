const mongoose = require('mongoose');

// User schema -- Boluwatife Alewi
// A user is anyone with an account: someone buying tickets (attendee),
// someone running events (organizer), or staff (admin).
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name must be 50 characters or fewer']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name must be 50 characters or fewer']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+()\-\s]{7,20}$/, 'Please use a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function (value) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['attendee', 'organizer', 'admin'],
      message: 'Role must be attendee, organizer or admin'
    },
    default: 'attendee'
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  // Set when the user signs in with OAuth. We never store a password,
  // so there is nothing to hash.
  githubId: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Handy for responses and for the organizer field on an event
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
