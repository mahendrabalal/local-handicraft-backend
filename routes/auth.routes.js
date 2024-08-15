const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: "Provide email, password, and name" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Provide a valid email address.' });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    }

    try {
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ email, password: hashedPassword, name });
        const { email: userEmail, name: userName, _id } = createdUser;
        const user = { email: userEmail, name: userName, _id };
        
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST /auth/login - Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Provide email and password." });
    }

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: "User not found." });
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Unable to authenticate the user" });
        }

        const { _id, email: userEmail, name } = foundUser;
        const payload = { _id, email: userEmail, name };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: "6h" });

        res.status(200).json({ authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /auth/verify - Verify JWT
router.get('/verify', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload);
});


//profile
router.get('/profile', isAuthenticated, async (req, res) => {
    const userId = req.payload._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Include profileImage and bio in the response
        const { email, name, _id, profileImage, bio } = user;
        res.status(200).json({ email, name, _id, profileImage, bio });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// PUT /auth/profile - Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
    const { name, email, profileImage, bio } = req.body;

    try {
        // Check if name and email are provided, which are mandatory fields
        if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

        // Update user with name, email, profileImage, and bio
        const updatedUser = await User.findByIdAndUpdate(
            req.payload._id,
            { name, email, profileImage, bio }, // Add profileImage and bio here
            { new: true } // Return the updated document
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile', error });
    }
});


module.exports = router;
