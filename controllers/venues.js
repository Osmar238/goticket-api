const mongoose = require('mongoose');
const Venue = require('../models/venue');

async function getAll(req, res) {
  //#swagger.tags = ['Venues']
  //#swagger.responses[200] = { description: 'OK' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  const venues = await Venue.find();
  if (venues.length === 0) {
    return res.status(404).json({ message: 'No venues found' });
  }

  return res.status(200).json(venues);
}

async function getSingle(req, res) {
  //#swagger.tags = ['Venues']
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid venue ID' });
  }

  const venue = await Venue.findById(req.params.id);
  if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  return res.status(200).json(venue);
}

async function createVenue(req, res) {
  //#swagger.tags = ['Venues']
  const venue = await Venue.create(req.body);
  return res.status(201).json(venue);
}

async function updateVenue(req, res) {
  //#swagger.tags = ['Venues']
  //#swagger.responses[204] = { description: 'No Content' }
  //#swagger.responses[400] = { description: 'Bad Request' }
  //#swagger.responses[404] = { description: 'Not Found' }
  //#swagger.responses[500] = { description: 'Internal Server Error' }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid venue ID' });
  }

  const updates = { ...req.body };
  delete updates._id;
  delete updates.createdAt;
  delete updates.updatedAt;
  delete updates.__v;

  const venue = await Venue.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  return res.status(204).send();
}

async function deleteVenue(req, res) {
  //#swagger.tags = ['Venues']
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid venue ID' });
  }

  const venue = await Venue.findByIdAndDelete(req.params.id);
  if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  return res.status(204).send();
}

module.exports = { getAll, getSingle, createVenue, updateVenue, deleteVenue };
