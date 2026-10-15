
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { isAuthenticated } = require('../middleware/auth');

const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/events');

// Validate event data
const validateEvent = [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),

    body('date')
        .notEmpty()
        .withMessage('Date is required'),

    body('venueId')
        .notEmpty()
        .withMessage('Venue ID is required')
];

// Return HTTP 400 when validation fails
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

// GET all events
router.get(
    '/',
    /* #swagger.tags = ['Events'] */
    /* #swagger.summary = 'Get all events' */
    getEvents
);

// GET event by ID
router.get(
    '/:id',
    /* #swagger.tags = ['Events'] */
    /* #swagger.summary = 'Get event by ID' */
    getEventById
);

// CREATE event
router.post(
    '/',
    /* #swagger.tags = ['Events'] */
    /* #swagger.security = [{ "githubOAuth": [] }] */
    /* #swagger.responses[401] = { description: 'Not logged in' } */
    /* #swagger.summary = 'Create an event' */
    /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventCreate' } } */
    isAuthenticated,
    validateEvent,
    checkValidation,
    createEvent
);

// UPDATE event
router.put(
    '/:id',
    /* #swagger.tags = ['Events'] */
    /* #swagger.security = [{ "githubOAuth": [] }] */
    /* #swagger.responses[401] = { description: 'Not logged in' } */
    /* #swagger.summary = 'Update an event' */
    /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventUpdate' } } */
    isAuthenticated,
    validateEvent,
    checkValidation,
    updateEvent
);

// DELETE event
router.delete(
    '/:id',
    /* #swagger.tags = ['Events'] */
    /* #swagger.security = [{ "githubOAuth": [] }] */
    /* #swagger.responses[401] = { description: 'Not logged in' } */
    /* #swagger.summary = 'Delete an event' */
    isAuthenticated,
    deleteEvent
);

module.exports = router;
