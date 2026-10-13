const mongoose = require('mongoose');
const Event = require('../models/event');

// GET all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single event
const getEventById = async (req, res) => {
    try {
        // A badly formed id would make Mongoose throw, so catch it here and send a 400
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST new event
const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update event
const updateEvent = async (req, res) => {
    try {
        // A badly formed id would make Mongoose throw, so catch it here and send a 400
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE event
const deleteEvent = async (req, res) => {
    try {
        // A badly formed id would make Mongoose throw, so catch it here and send a 400
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
