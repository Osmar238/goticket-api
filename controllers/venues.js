const mongoose = require('mongoose');
const Venue = require('../models/venue');

const getAll = async (req, res) => {
  //#swagger.tags = ['Venues']
  //#swagger.responses[200] = { description: 'OK' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  try {
    const venues = await Venue.find();

    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: 'No venues found' });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(venues);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch venues', error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags = ['Venues']
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid venue ID' });
    }

    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(venue);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch venue', error: err.message });
  }
};

const createVenue = async (req, res) => {
  //#swagger.tags = ['Venues']
  //#swagger.parameters['body'] = { in: 'body', description: 'Venue document to create', required: true, schema: { $ref: '#/definitions/VenueCreate' } }
  const input = req.body || {};
  const venue = {
    name: input.name,
    description: input.description,
    capacity: input.capacity,
    address: input.address,
    location: input.location,
    contactEmail: input.contactEmail,
    isActive: input.isActive
  };

  try {
    const createdVenue = await Venue.create(venue);
    return res.status(201).json(createdVenue);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.name === 'ValidationError'
          ? Object.values(err.errors).map((validationError) => validationError.message)
          : [err.message]
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({ message: 'Venue already exists', error: err.message });
    }

    return res.status(500).json({ message: 'Failed to create venue', error: err.message });
  }
};

const updateVenue = async (req, res) => {
  //#swagger.tags = ['Venues']
  //#swagger.parameters['body'] = { in: 'body', description: 'Venue fields to update', required: true, schema: { $ref: '#/definitions/VenueUpdate' } }
  //#swagger.responses[204] = { description: 'No Content' }
  //#swagger.responses[400] = { description: 'Bad Request' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid venue ID' });
    }

    const input = req.body || {};
    const venueUpdates = {};
    if (Object.hasOwn(input, 'name')) venueUpdates.name = input.name;
    if (Object.hasOwn(input, 'description')) venueUpdates.description = input.description;
    if (Object.hasOwn(input, 'capacity')) venueUpdates.capacity = input.capacity;
    if (Object.hasOwn(input, 'address')) venueUpdates.address = input.address;
    if (Object.hasOwn(input, 'location')) venueUpdates.location = input.location;
    if (Object.hasOwn(input, 'contactEmail')) venueUpdates.contactEmail = input.contactEmail;
    if (Object.hasOwn(input, 'isActive')) venueUpdates.isActive = input.isActive;

    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    venue.set(venueUpdates);
    await venue.save();
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

    if (err.code === 11000) {
      return res.status(409).json({ message: 'Venue already exists', error: err.message });
    }

    return res.status(500).json({ message: 'Failed to update venue', error: err.message });
  }
};

const deleteVenue = async (req, res) => {
  //#swagger.tags = ['Venues']
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid venue ID' });
    }

    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete venue', error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createVenue,
  updateVenue,
  deleteVenue
};
