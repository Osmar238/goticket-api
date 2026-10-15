
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { isAuthenticated } = require('../middleware/auth');

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

// Validate user data
const validateUser = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required'),

    body('lastName')
        .notEmpty()
        .withMessage('Last name is required'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required')
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

// GET all users
router.get(
    '/',
    /* #swagger.tags = ['Users'] */
    /* #swagger.summary = 'Get all users' */
    getUsers
);

// GET user by ID
router.get(
    '/:id',
    /* #swagger.tags = ['Users'] */
    /* #swagger.summary = 'Get user by ID' */
    getUserById
);

// CREATE user
router.post(
    '/',
    /* #swagger.tags = ['Users'] */
    /* #swagger.security = [{ "githubOAuth": [] }] */
    /* #swagger.responses[401] = { description: 'Not logged in' } */
    /* #swagger.summary = 'Create a user' */
    /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserCreate' } } */
    isAuthenticated,
    validateUser,
    checkValidation,
    createUser
);

// UPDATE user
router.put(
    '/:id',
    /* #swagger.tags = ['Users'] */
    /* #swagger.security = [{ "githubOAuth": [] }] */
    /* #swagger.responses[401] = { description: 'Not logged in' } */
    /* #swagger.summary = 'Update a user' */
    /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserUpdate' } } */
    isAuthenticated,
    validateUser,
    checkValidation,
    updateUser
);

// DELETE user
router.delete(
    '/:id',
    /* #swagger.tags = ['Users'] */
    /* #swagger.security = [{ "githubOAuth": [] }] */
    /* #swagger.responses[401] = { description: 'Not logged in' } */
    /* #swagger.summary = 'Delete a user' */
    isAuthenticated,
    deleteUser
);

module.exports = router;
