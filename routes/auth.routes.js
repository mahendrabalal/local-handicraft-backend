const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post('/signup', async (req, res, next) => {
    const { email, password, name } = req.body;

    // Check if email, password, or name are provided as empty strings 
    if (!email || !password || !name) {
        return res.status(400).json({ message: "Provide email, password, and name" });
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Provide a valid email address.' });
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    }

    try {
        // Check if a user with the same email already exists
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create a new user
        const createdUser = await User.create({ email, password: hashedPassword, name });
        
        // Exclude the password from the response
        const { email: userEmail, name: userName, _id } = createdUser;
        const user = { email: userEmail, name: userName, _id };
        
        // Send a json response containing the user object
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email or password are provided as empty strings
    if (!email || !password) {
        return res.status(400).json({ message: "Provide email and password." });
    }

    try {
        // Check if a user with the same email exists
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: "User not found." });
        }

        // Compare the provided password with the one saved in the database
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Unable to authenticate the user" });
        }

        // Create a JWT token
        const { _id, email: userEmail, name } = foundUser;
        const payload = { _id, email: userEmail, name };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: "6h" });

        // Send the token as the response
        res.status(200).json({ authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET /auth/verify - Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {
    // If JWT is valid, the payload is decoded by the isAuthenticated middleware and available on 'req.payload'
    console.log(`req.payload`, req.payload);

    // Send back the object with user data previously set as the token payload
    res.status(200).json(req.payload);
});

// GET /auth/profile - Get user profile data
router.get('/profile', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id; // Use the ID from the token payload

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude the password from the response
        const { email, name, _id } = user;
        res.status(200).json({ email, name, _id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
