const mongoose = require('mongoose');
const User = require('../models/user');

// GET all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single user
const getUserById = async (req, res) => {
    try {
        // A badly formed id would make Mongoose throw, so catch it here and send a 400
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST new user
const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update user
const updateUser = async (req, res) => {
    try {
        // A badly formed id would make Mongoose throw, so catch it here and send a 400
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        // A badly formed id would make Mongoose throw, so catch it here and send a 400
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
